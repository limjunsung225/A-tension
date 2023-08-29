package com.b5f1.atention.domain.team.controller;

import com.b5f1.atention.common.MessageOnly;
import com.b5f1.atention.common.MessageWithData;
import com.b5f1.atention.domain.team.dto.*;
import com.b5f1.atention.domain.team.service.TeamService;
import io.swagger.annotations.Api;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/team")
@Api(tags = "팀")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;

    // TODO
    //  2. @AuthenticationPrincipal 처리
    @GetMapping
    @Operation(summary = "내 팀 조회", description = "본인 팀 리스트 조회 요청 API 입니다.")
    public ResponseEntity<MessageWithData> findMyTeamList(Authentication authentication) {
        List<TeamResponseDto> data = teamService.findMyTeamList(UUID.fromString(authentication.getName()));
        return new ResponseEntity<>(new MessageWithData("내 팀 조회가 성공하였습니다.", data), HttpStatus.OK);
    }

    @PostMapping
    @Operation(summary = "팀 생성", description = "팀 생성 요청 API 입니다.")
    public ResponseEntity<MessageOnly> create(Authentication authentication, @RequestBody TeamCreateRequestDto teamCreateRequestDto) {
        teamService.createTeam(UUID.fromString(authentication.getName()), teamCreateRequestDto);
        return new ResponseEntity<>(new MessageOnly("팀 생성이 성공하였습니다."), HttpStatus.OK);
    }

    @GetMapping("/{teamId}")
    @Operation(summary = "특정 팀 조회", description = "특정 팀 조회 요청 API 입니다.")
    public ResponseEntity<MessageWithData> getTeamDetail(Authentication authentication, @PathVariable("teamId") Long teamId) {
        TeamDetailResponseDto data = teamService.getTeamDetail(UUID.fromString(authentication.getName()), teamId);
        return new ResponseEntity<>(new MessageWithData("특정 팀 조회가 성공하였습니다.", data), HttpStatus.OK);
    }

    @PutMapping("/{teamId}")
    @Operation(summary = "팀 수정", description = "팀 수정 요청 API 입니다.")
    public ResponseEntity<MessageWithData> updateTeam(Authentication authentication, @PathVariable("teamId") Long teamId, @RequestBody TeamUpdateRequestDto teamUpdateRequestDto) {
        TeamUpdateRequestDto data = teamService.updateTeam(UUID.fromString(authentication.getName()), teamId, teamUpdateRequestDto);
        return new ResponseEntity<>(new MessageWithData("팀 수정이 성공하였습니다.", data), HttpStatus.OK);
    }

    @DeleteMapping("/{teamId}")
    @Operation(summary = "팀 삭제", description = "팀 삭제 요청 API 입니다.")
    public ResponseEntity<MessageOnly> deleteTeam(Authentication authentication, @PathVariable("teamId") Long teamId) {
        teamService.deleteTeam(UUID.fromString(authentication.getName()), teamId);
        return new ResponseEntity<>(new MessageOnly("팀 삭제가 성공하였습니다."), HttpStatus.OK);
    }

    @PostMapping("/invite")
    @Operation(summary = "팀 초대", description = "팀 초대 요청 API 입니다.")
    public ResponseEntity<MessageOnly> inviteTeam(Authentication authentication, @RequestBody TeamInviteRequestDto teamInviteRequestDto) {
        teamService.inviteTeam(UUID.fromString(authentication.getName()), teamInviteRequestDto);
        return new ResponseEntity<>(new MessageOnly("팀 초대가 성공하였습니다."), HttpStatus.OK);
    }

    @PostMapping("/accept/{teamId}")
    @Operation(summary = "팀 초대 수락", description = "팀 초대 수락 요청 API 입니다.")
    public ResponseEntity<MessageOnly> acceptTeam(Authentication authentication, @PathVariable Long teamId) {
        teamService.acceptTeam(UUID.fromString(authentication.getName()), teamId);
        return new ResponseEntity<>(new MessageOnly("팀 초대 수락이 성공하였습니다."), HttpStatus.OK);
    }

    @DeleteMapping("/refuse/{teamId}")
    @Operation(summary = "팀 초대 거절", description = "팀 초대 거절 요청 API 입니다.")
    public ResponseEntity<MessageOnly> refuseTeam(Authentication authentication, @PathVariable Long teamId) {
        teamService.refuseTeam(UUID.fromString(authentication.getName()), teamId);
        return new ResponseEntity<>(new MessageOnly("팀 초대 거절이 성공하였습니다."), HttpStatus.OK);
    }

    @DeleteMapping("/leave/{teamId}")
    @Operation(summary = "팀 탈퇴", description = "팀 탈퇴 요청 API 입니다.")
    public ResponseEntity<MessageOnly> leaveTeam(Authentication authentication, @PathVariable Long teamId) {
        teamService.leaveTeam(UUID.fromString(authentication.getName()), teamId);
        return new ResponseEntity<>(new MessageOnly("팀 탈퇴가 성공하였습니다."), HttpStatus.OK);
    }

    @PutMapping("/authority")
    @Operation(summary = "팀 참여자 권한 변경", description = "팀 참여자 권한 변경 요청 API 입니다.")
    public ResponseEntity<MessageOnly> updateTeamParticipantAuthority(Authentication authentication, @RequestBody TeamParticipantAuthorityDto teamParticipantAuthorityDto) {
        teamService.updateTeamParticipantAuthority(UUID.fromString(authentication.getName()), teamParticipantAuthorityDto);
        return new ResponseEntity<>(new MessageOnly("팀 참여자 권한 변경이 성공하였습니다."), HttpStatus.OK);
    }

}