package com.b5f1.atention.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TeamParticipant extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "team_participant_id")
    private Long id;

    @Column
    @Builder.Default
    private Boolean hasAuthority = false;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;


    /**
     * 새 TeamParticipant 객체의 필드 세팅 후 연관되어있는 필드에 더해줌
     * @param user
     * @param team
     * @param hasAuthority
     * @return TeamParticipant
     */
    public TeamParticipant createTeamParticipant(User user, Team team, boolean hasAuthority) {
        this.user = user;
        this.team = team;
        this.hasAuthority = hasAuthority;
        user.getTeamParticipantList().add(this);
        team.getTeamParticipantList().add(this);
        return this;
    }

    public TeamParticipant deleteTeamParticipant(User user, Team team) {
        user.getTeamParticipantList().remove(this);
        team.getTeamParticipantList().remove(this);
        this.deleted();
        return this;
    }

    public TeamParticipant updateAuthority(Boolean hasAuthority) {
        this.hasAuthority = hasAuthority;
        return this;
    }
}
