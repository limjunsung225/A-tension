package com.b5f1.atention.domain.team.dto;

import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class TeamUpdateRequestDto {
    private String name;
    private String profileImage;
    private String description;

}
