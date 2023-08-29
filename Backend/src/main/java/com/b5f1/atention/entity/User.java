package com.b5f1.atention.entity;

import com.b5f1.atention.domain.user.dto.UserProfileUpdateDto;
import com.b5f1.atention.entity.enums.SocialType;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Entity
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {
    @Id
    @Column(name = "user_id", columnDefinition = "BINARY(16)")
    @Builder.Default
    private UUID id = UUID.randomUUID();

    @Column(nullable = false)
    private String email;

    @Column
    private String name;

    @Column
    private String profileImage;

    @Column
    @Builder.Default
    private int ticket = 0;

    @Column(nullable = false)
    private String meetingUrl;

    @OneToMany(mappedBy = "user")
    @Builder.Default
    private List<TeamParticipant> teamParticipantList = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    @Builder.Default
    private List<MyItem> myItemList = new ArrayList<>();

    // KAKAO, NAVER, GOOGLE
    @Enumerated(EnumType.STRING)
    private SocialType socialType;

    // 로그인한 소셜 타입의 식별자 값 (일반 로그인인 경우 null)
    private String socialId;

    private String refreshToken;

    public void updateName(String name){
        this.name = name;
    }

    public void updateRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    // 티켓 획득 메서드
    public void addTicket() {
        this.ticket ++;
    }

    // 티켓 사용 메서드
    public void useTicket() {
        this.ticket --;
    }

    public User updateUser(UserProfileUpdateDto userProfileUpdateDto) {
        if (userProfileUpdateDto.getName() != null)
            this.name = userProfileUpdateDto.getName();
        if (userProfileUpdateDto.getProfileImage() != null)
            this.profileImage = userProfileUpdateDto.getProfileImage();
        if (userProfileUpdateDto.getMeetingUrl() != null)
            this.meetingUrl = userProfileUpdateDto.getMeetingUrl();
        return this;
    }
}