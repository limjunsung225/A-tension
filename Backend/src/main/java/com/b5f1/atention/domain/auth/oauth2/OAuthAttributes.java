package com.b5f1.atention.domain.auth.oauth2;

import com.b5f1.atention.domain.auth.oauth2.userinfo.GoogleOAuth2UserInfo;
import com.b5f1.atention.domain.auth.oauth2.userinfo.KakaoOAuth2UserInfo;
import com.b5f1.atention.domain.auth.oauth2.userinfo.NaverOAuth2UserInfo;
import com.b5f1.atention.domain.auth.oauth2.userinfo.OAuth2UserInfo;
import com.b5f1.atention.entity.User;
import com.b5f1.atention.entity.enums.SocialType;
import lombok.Builder;
import lombok.Getter;

import java.util.Map;
import java.util.UUID;

@Getter
public class OAuthAttributes {

    private OAuth2UserInfo oauth2UserInfo; // 소셜 타입별 로그인 유저 정보(닉네임, 이메일, 프로필 사진 등등)
    private UUID id;
    private String refreshToken;
    private String meetingUrl;
    @Builder
    public OAuthAttributes(OAuth2UserInfo oauth2UserInfo) {
        this.oauth2UserInfo = oauth2UserInfo;
    }

    /**
     * SocialType에 맞는 메소드 호출하여 OAuthAttributesDto 객체 반환
     * 파라미터 : userNameAttributeName -> OAuth2 로그인 시 키(PK)가 되는 값 / attributes : OAuth 서비스의 유저 정보들
     * 소셜별 of 메소드(ofGoogle, ofKaKao, ofNaver)들은 각각 소셜 로그인 API에서 제공하는
     * 회원의 식별값(id), attributes, nameAttributeKey를 저장 후 build
     */
    public static OAuthAttributes of(SocialType socialType, Map<String, Object> attributes) {

        if (socialType == SocialType.NAVER) {
            return ofNaver(attributes);
        }
        if (socialType == SocialType.KAKAO) {
            return ofKakao(attributes);
        }
        return ofGoogle(attributes);
    }

    private static OAuthAttributes ofKakao(Map<String, Object> attributes) {
        return OAuthAttributes.builder()
                .oauth2UserInfo(new KakaoOAuth2UserInfo(attributes))
                .build();
    }

    public static OAuthAttributes ofGoogle(Map<String, Object> attributes) {
        return OAuthAttributes.builder()
                .oauth2UserInfo(new GoogleOAuth2UserInfo(attributes))
                .build();
    }

    public static OAuthAttributes ofNaver(Map<String, Object> attributes) {
        return OAuthAttributes.builder()
                .oauth2UserInfo(new NaverOAuth2UserInfo(attributes))
                .build();
    }

    /**
     * of메소드로 OAuthAttributesDto 객체가 생성되어,
     * 유저 정보들이 담긴 OAuth2UserInfo가 소셜 타입별로 주입된 상태
     * OAuth2UserInfo에서 email, nickname, imageUrl을 가져와서 build
     * id에는 UUID로 중복 없는 랜덤 값 생성
     */
    public User toEntity(SocialType socialType, OAuthAttributes oAuthAttributes) {
        return User.builder()
                .id(oAuthAttributes.getId())
                .refreshToken(oAuthAttributes.getRefreshToken())
                .email(oAuthAttributes.getOauth2UserInfo().getEmail())
                .name(oAuthAttributes.getOauth2UserInfo().getName())
                .profileImage(oAuthAttributes.getOauth2UserInfo().getProfileImage())
                .meetingUrl(oAuthAttributes.getMeetingUrl())
                .socialType(socialType)
                .socialId(oAuthAttributes.getOauth2UserInfo().getSocialId())
                .build();
    }

    public void setId(UUID uuid){
        this.id = uuid;
    }

    public void setRefreshToken(String refreshToken){
        this.refreshToken = refreshToken;
    }

    public void setMeetingUrl(String meetingUrl){ this.meetingUrl = meetingUrl; }
}
