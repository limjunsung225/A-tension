package com.b5f1.atention.domain.user.controller;

import com.b5f1.atention.common.MessageOnly;
import com.b5f1.atention.common.MessageWithData;
import com.b5f1.atention.domain.user.dto.UserProfileUpdateDto;
import com.b5f1.atention.domain.user.dto.UserResponseDto;
import com.b5f1.atention.domain.user.dto.UserSearchResponseDto;
import com.b5f1.atention.domain.user.repository.UserRepository;
import com.b5f1.atention.domain.user.service.UserService;
import com.b5f1.atention.entity.User;
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
@RequestMapping("/user")
@Api(tags = "유저")
@RequiredArgsConstructor
public class UserController {
    private final UserRepository userRepository;

    private final UserService userService;


    @GetMapping
    @Operation(summary = "내 정보 조회", description = "내 정보 조회 요청 API 입니다.")
    public ResponseEntity<MessageWithData> getMyUserProfile(Authentication authentication) {
        UserResponseDto data = userService.getMyUserProfile(UUID.fromString(authentication.getName()));
        return new ResponseEntity<>(new MessageWithData("내 정보 조회가 성공하였습니다.", data), HttpStatus.OK);
    }

    @PutMapping
    @Operation(summary = "내 정보 수정", description = "내 정보 수정 요청 API 입니다.")
    public ResponseEntity<MessageWithData> updateUserProfile(Authentication authentication, @RequestBody UserProfileUpdateDto userProfileUpdateDto) {
        UserResponseDto data = userService.updateUserProfile(UUID.fromString(authentication.getName()), userProfileUpdateDto);
        return new ResponseEntity<>(new MessageWithData("내 정보 변경이 성공하였습니다.", data), HttpStatus.OK);
    }

    @DeleteMapping
    @Operation(summary = "회원 탈퇴", description = "회원 탈퇴 요청 API 입니다.")
    public ResponseEntity<MessageOnly> deleteUser(Authentication authentication) {
        userService.deleteUser(UUID.fromString(authentication.getName()));
        return new ResponseEntity<>(new MessageOnly("유저 탈퇴가 성공하였습니다."), HttpStatus.OK);
    }

    @GetMapping("/{keyword}")
    @Operation(summary = "회원 검색", description = "회원 검색 요청 API 입니다.")
    public ResponseEntity<MessageWithData> searchUser(@PathVariable String keyword) {
        List<UserSearchResponseDto> userSearchResponseDtoList = userService.searchUser(keyword);
        return new ResponseEntity<>(new MessageWithData("유저 검색에 성공하였습니다.", userSearchResponseDtoList), HttpStatus.OK);
    }

    @GetMapping("/test")
    public ResponseEntity<MessageWithData> test() {
        List<User> data = userRepository.findAll();
        return new ResponseEntity<>(new MessageWithData("TEST", data), HttpStatus.OK);
    }
}
