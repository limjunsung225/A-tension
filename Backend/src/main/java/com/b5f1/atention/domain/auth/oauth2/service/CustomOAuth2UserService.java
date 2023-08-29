package com.b5f1.atention.domain.auth.oauth2.service;

import com.b5f1.atention.domain.auth.jwt.JwtService;
import com.b5f1.atention.domain.auth.oauth2.CustomOAuth2User;
import com.b5f1.atention.domain.auth.oauth2.OAuthAttributes;
import com.b5f1.atention.domain.user.repository.UserRepository;
import com.b5f1.atention.entity.User;
import com.b5f1.atention.entity.enums.SocialType;
import io.openvidu.java.client.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.util.Base64Utils;

import java.util.Collections;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@Getter
@RequiredArgsConstructor
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    private static final String NAVER = "naver";
    private static final String KAKAO = "kakao";

    @Value("${openvidu.serverUrl}")
    private String OPENVIDU_URL;
    @Value("${openvidu.serverSecret}")
    private String OPENVIDU_SECRET;
    @Value("${openvidu.meetingUrl}")
    private String BASE_MEETING_URL;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        //1)
        OAuth2UserService<OAuth2UserRequest, OAuth2User> oAuth2UserOAuth2UserService = new DefaultOAuth2UserService();

        //2)
        OAuth2User oAuth2User = oAuth2UserOAuth2UserService.loadUser(userRequest);

        //3) 각 소셜 타입에 맞는 attributes로 변환하는 분기 처리에 사용될 socialType 추출
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        SocialType socialType = getSocialType(registrationId);

        //4) DefaultOAuth2User를 상속받는 CustomOAuth2User를 생성할 때 필수 매개변수
        String userNameAttributeName = userRequest.getClientRegistration()
                .getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();
        log.debug("userNameAttributeName : " + userNameAttributeName);
        //"userNameAttributeName : sub"

        //5) OAuth Provider에게 제공받은 사용자 attribute
        Map<String, Object> attributes = oAuth2User.getAttributes();
        log.debug("attributes : " + attributes);
        //attributes : {sub=103151414792709319215, name=김기정, given_name=기정, family_name=김, picture=https://lh3.googleusercontent.com/a/AAcHTtdcIh1LXjllo_2m6wgWvTu4VEog7kpCHfEsJdF6x-VG=s96-c, email=dlsgkrlwjd@gmail.com, email_verified=true, locale=ko}

        //6) 각 social 타입별로 필요한 값만 추출한 attributes
        OAuthAttributes extractAttributes = OAuthAttributes.of(socialType, attributes);

        User createdUser = getUser(extractAttributes, socialType);

        return new CustomOAuth2User(Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
                attributes,
                userNameAttributeName,
                createdUser.getId());
    }

    private SocialType getSocialType(String registrationId) {
        if (NAVER.equals(registrationId)) {
            return SocialType.NAVER;
        }
        if (KAKAO.equals(registrationId)) {
            return SocialType.KAKAO;
        }
        return SocialType.GOOGLE;
    }

    // 로그인 유저 DB에 저장
    private User getUser(OAuthAttributes attributes, SocialType socialType){

        User findUser = userRepository.findBySocialTypeAndSocialId(socialType,
                attributes.getOauth2UserInfo().getSocialId()).orElse(null);

        // 로그인 경험이 없는 신규 유저만 DB에 저장
        if (findUser == null) {
            return saveUser(attributes, socialType);
        }

        return findUser;

    }

    private User saveUser(OAuthAttributes attributes, SocialType socialType) {
        attributes.setId(UUID.randomUUID());
        try {
            OpenVidu openVidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
            SessionProperties properties = new SessionProperties.Builder().build();
            Session session = openVidu.createSession(properties);
            //sessionId를 base64 인코딩
            String encodedSeesionId = Base64Utils.encodeToString(session.getSessionId().getBytes());
            //개인 미팅 URL 생성
            String personalMeetingUrl = BASE_MEETING_URL+encodedSeesionId;
            attributes.setMeetingUrl(personalMeetingUrl);
        } catch (OpenViduJavaClientException e) {
            throw new RuntimeException(e);
        } catch (OpenViduHttpException e) {
            throw new RuntimeException(e);
        }
        User createdUser = attributes.toEntity(socialType, attributes);
        return userRepository.save(createdUser);
    }
}