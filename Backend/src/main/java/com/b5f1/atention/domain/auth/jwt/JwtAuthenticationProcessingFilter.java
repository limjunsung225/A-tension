package com.b5f1.atention.domain.auth.jwt;

import com.b5f1.atention.domain.user.repository.UserRepository;
import com.b5f1.atention.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;
import org.springframework.security.core.authority.mapping.NullAuthoritiesMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;

/**
 * 기본적으로 사용자는 요청 헤더에 AccessToken만 담아서 요청
 * AccessToken 만료 시에만 RefreshToken을 요청 헤더에 AccessToken과 함께 요청
 *
 * 1. RefreshToken이 없고, AccessToken이 유효한 경우 -> 인증 성공 처리, RefreshToken을 재발급하지는 않는다.
 * 2. RefreshToken이 없고, AccessToken이 없거나 유효하지 않은 경우 -> 인증 실패 처리, 403 ERROR
 * 3. RefreshToken이 있는 경우 -> DB의 RefreshToken과 비교하여 일치하면 AccessToken 재발급, RefreshToken 재발급(RTR 방식)
 *                              인증 성공 처리는 하지 않고 실패 처리
 *
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationProcessingFilter extends OncePerRequestFilter {

    private static final String NO_CHECK_LOGIN_URL = "/oauth2/authorization"; // "/login"으로 들어오는 요청은 Filter 작동 X

    private final JwtService jwtService;
    private final UserRepository userRepository;

    private GrantedAuthoritiesMapper authoritiesMapper = new NullAuthoritiesMapper();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // "/login" 요청이 들어오면, 인증/인가 처리할 필요 없으므로 다음 필터 호출
        if (request.getRequestURI().contains(NO_CHECK_LOGIN_URL)) {
            filterChain.doFilter(request, response);
            // return으로 이후 현재 필터 진행 막기 (안해주면 아래로 내려가서 계속 필터 진행시킴)
            return;
        }

        //가장 먼저 사용자 요청 헤더에서 refreshToken 추출
        //refreshToken이 없거나 유효하지 않은 경우 null
        String refreshToken = jwtService.extractRefreshToken(request)
//              .filter(token -> jwtService.isTokenValid(token)) 이 람다식을 아래와 같이 메서드 참조 방식으로 작성 가능
                //filter는 Optional 객체의 값을 조건에 따라 걸러냄. 여기서는 token이 유효하지 않으면 걸러냄
                .filter(jwtService::isTokenValid)
                //token이 유효하지 않아 걸려졌을 때 대채값으로 null을 반환
                .orElse(null);

        // 리프레시 토큰이 요청 헤더에 존재했다면, 사용자가 AccessToken이 만료되어서
        // RefreshToken까지 보낸 것이므로 리프레시 토큰이 DB의 리프레시 토큰과 일치하는지 판단 후,
        // 일치한다면 AccessToken을 재발급해준다.
        if (refreshToken != null) {
            reIssueRefreshTokenAndAccessToken(response, refreshToken);
            /*
            * RefreshToken을 보낸 경우에는 AccessToken을 재발급 하고
            * 인증 처리는 하지 않게 하기위해 바로 return으로 필터 진행 막기
            * */
            return;
        }

        // RefreshToken이 없거나 유효하지 않다면, AccessToken을 검사하고 인증을 처리하는 로직 수행
        // AccessToken이 없거나 유효하지 않다면, 인증 객체가 담기지 않은 상태로 다음 필터로 넘어가기 때문에 403 에러 발생
        // AccessToken이 유효하다면, 인증 객체가 담긴 상태로 다음 필터로 넘어가기 때문에 인증 성공
        else {
            checkAccessTokenAndAuthentication(request, response, filterChain);
        }
    }

    public void reIssueRefreshTokenAndAccessToken(HttpServletResponse response, String refreshToken) {
        //리프레시 토큰으로 유저 정보 찾기
        userRepository.findByRefreshToken(refreshToken)
                .ifPresent(user -> {
                    //reIssueRefreshToken()로 리프레시 토큰 재발급 & DB에 refreshToken 업데이트
                    String reIssuedRefreshToken = reIssueRefreshToken(user);
                    //JwtService.sendAccessTokenAndRefreshToken()으로 응답 헤더에 accessToken, refreshToken 담기
                    jwtService.sendAccessAndRefreshToken(response,
                            //액세스 토큰 발급
                            jwtService.createAccessToken(user.getId()),
                            reIssuedRefreshToken);
                });
    }

    private String reIssueRefreshToken(User user) {
        //리프레시 토큰 재발급
        String reIssuedRefreshToken = jwtService.createRefreshToken(user.getId());
        //DB에 리프레시 토큰 업데이트
        user.updateRefreshToken(reIssuedRefreshToken);
        userRepository.saveAndFlush(user);
        return reIssuedRefreshToken;
    }

    //액세스 토큰 체크 & 인증 처리 메소드
    public void checkAccessTokenAndAuthentication(HttpServletRequest request, HttpServletResponse response,
                                                  FilterChain filterChain) throws ServletException, IOException {
        log.debug("checkAccessTokenAndAuthentication() 호출");
        //request header에서 액세스 토큰 추출
        jwtService.extractAccessToken(request)
//                .filter(jwtService::isTokenValid) 유효성 중복 검사라고 판단하여 주석처리
                //액세스 토큰에서 extractUUID로 UUID을 추출
                .ifPresent(accessToken -> jwtService.extractUUID(accessToken)
                        //DB에서 추출한 uuid를 사용하는 유저 객체 반환
                        .ifPresent(uuid -> userRepository.findById(UUID.fromString(uuid))
                                //반환 받은 유저 객체를 saveAuthentication()로 인증 처리
                                .ifPresent(this::saveAuthentication)));
        //다음 인증 필터로 진행
        filterChain.doFilter(request, response);
    }

    public void saveAuthentication(User myUser) {
        //UserDetails : 인증 객체로 캡슐화되는 사용자 정보를 저장하는데 사용되는 객체
        log.debug("saveAuthentication() 호출");
        UserDetails userDetailsUser = org.springframework.security.core.userdetails.User.builder()
                .username(myUser.getId().toString())
                .password("")
                .roles("")
                .build();

        Authentication authentication =
                //Sprig Security의 new UsernamePasswordAuthenticationToken()로 인증 객체인 Authentication 객체 생성
                new UsernamePasswordAuthenticationToken(userDetailsUser, null,
                        authoritiesMapper.mapAuthorities(userDetailsUser.getAuthorities()));

        //현재 실행 중인 스레드의 보안 컨텍스트(SecurityContext)에 인증 정보(Authentication)를 설정
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}
