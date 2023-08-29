import {UUID} from "crypto";

export interface UserProfileUpdateDTO {
    name: string;
    profileImage: string;
    email : string;
}

export interface UserResponseDTO {
    email: string;
    name: string;
    profileImage: string;
    ticket: number;
    meetingUrl: string;
}

export interface UserSearchResponseDto {
    userId : UUID;
    email : string;
    name : string;
    profileImage : string;
}