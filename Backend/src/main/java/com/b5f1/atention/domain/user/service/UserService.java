package com.b5f1.atention.domain.user.service;

import com.b5f1.atention.domain.user.dto.UserProfileUpdateDto;
import com.b5f1.atention.domain.user.dto.UserResponseDto;
import com.b5f1.atention.domain.user.dto.UserSearchResponseDto;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

public interface UserService {

    public UserResponseDto getMyUserProfile(UUID userId);

    public void deleteUser(UUID userId);

    public UserResponseDto updateUserProfile(UUID userId, UserProfileUpdateDto userProfileUpdateDto);

    public List<UserSearchResponseDto> searchUser(String keyword);
}
