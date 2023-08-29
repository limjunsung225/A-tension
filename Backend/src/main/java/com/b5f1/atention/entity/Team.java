package com.b5f1.atention.entity;

import com.b5f1.atention.domain.team.dto.TeamUpdateRequestDto;
import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Team extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "team_id")
    private Long id;

    @Column
    private String name;

    @Column
    private String profileImage;

    @Column
    private String description;

    @OneToMany(mappedBy = "team")
    @Builder.Default
    private List<TeamParticipant> teamParticipantList = new ArrayList<>();

    @OneToMany(mappedBy = "team")
    @Builder.Default
    private List<Image> imageList = new ArrayList<>();


    public Team updateTeam(TeamUpdateRequestDto teamUpdateRequestDto) {
        this.name = teamUpdateRequestDto.getName();
        this.profileImage = teamUpdateRequestDto.getName();
        this.description = teamUpdateRequestDto.getDescription();
        return this;
    }

}