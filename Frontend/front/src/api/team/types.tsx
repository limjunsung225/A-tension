import {UUID} from "crypto";

export interface myTeams{
    id : number,
    name : string,
    profileImage : string,
    description : string,
    teamParticipantList : object,
    uploadImageList : object,
}

export interface teamDetail{
    id : number,
    name : string,
    profileImage : string,
    description : string,
    userProfileDtoList : userProfileDto[],
}

export interface createTeamRequestBody{
    name : string,
    userIdList : UUID[],
    description:string,
}

export interface teamResponseDto {
    teamId : number,
    name : string,
    profileImage : string,
    description : string,
}


export interface teamDetailResponseDto {
    teamId : number,
    name : string,
    profileImage : string,
    description : string,
    userProfileDtoList : userProfileDto[],
}

export interface userProfileDto {
    userId : UUID,
    name : string,
    profileImage : string,
}

export interface teamUpdateRequestDto {
    name : string,
    profileImage : string,
    description : string,
}

export interface teamInviteRequestDto {
    teamId : bigint,
    userIdList : UUID[],
}

export interface userAuthDto {
    userId : UUID,
    hasAuthority : boolean
}
export interface teamParticipantAuthorityDto {
    teamId : number,
    userAuthDtoList : userAuthDto[]
}