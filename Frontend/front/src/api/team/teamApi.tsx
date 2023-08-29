import {apiInstance} from "../index.tsx";
import {AxiosResponse} from "axios";
import {
    createTeamRequestBody,
    teamDetailResponseDto,
    teamInviteRequestDto, teamParticipantAuthorityDto,
    teamResponseDto,
    teamUpdateRequestDto
} from "./types.tsx";

const api = apiInstance();

export const findMyTeam = async <T = teamResponseDto[], R = AxiosResponse<T>>()=> {
    try {
        return await api.get<T, R>("/team");
    } catch (err) {
        console.log(err)
        throw new Error('Failed to find My Team');
    }
}

export const createTeam = async <T = void, R = AxiosResponse<T>>(data?: createTeamRequestBody):Promise<R> => {
    try {
        return await api.post<T, R>("/team", data);
    } catch (err){
        console.log(err);
        throw new Error('Failed to create team');
    }
}

export const getTeamDetail = async <T = teamDetailResponseDto, R = AxiosResponse<T>>(teamId: number):Promise<R> => {
    try {
        return await api.get<T, R>(`/team/${teamId}`);
    } catch (err) {
        console.log(err);
        throw new Error('Failed to get Team Detail');
    }
}

export const updateTeam = async <T = teamUpdateRequestDto, R = AxiosResponse<T>>(teamId: number, data? : teamUpdateRequestDto):Promise<R> => {
    try {
        return await api.put<T, R>(`/team/${teamId}`, data);
    } catch (err) {
        console.log(err);
        throw new Error('Failed to update Team Detail')
    }
}

export const deleteTeam = async <T = void, R = AxiosResponse<T>>(teamId: number):Promise<R> => {
    try {
        return await api.delete<T, R>(`/team/${teamId}`);
    } catch (err) {
        console.log(err)
        throw new Error('Failed to delete Team')
    }
}

export const inviteTeam = async <T = void, R = AxiosResponse<T>>(data? : teamInviteRequestDto):Promise<R> => {
    try {
        return await api.post<T, R>("/team/invite", data);
    } catch (err) {
        console.log(err)
        throw new Error('Failed to invite Team')
    }
}
export const acceptTeam = async <T = void, R = AxiosResponse<T>>(teamId : number):Promise<R> => {
    try {
        console.log(teamId)
        return await api.post<T, R>(`/team/accept/${teamId}`);
    } catch (err) {
        console.log(err)
        throw new Error('Failed to accept Team')
    }
}

export const refuseTeam = async <T = void, R = AxiosResponse<T>>(teamId : number):Promise<R> => {
    try {
        return await api.delete<T, R>(`/team/refuse/${teamId}`);
    } catch (err) {
        console.log(err)
        throw new Error('Failed to refuse Team')
    }
}

export const leaveTeam = async <T = void, R = AxiosResponse<T>>(teamId : number):Promise<R> => {
    try {
        return await api.delete(`/team/leave/${teamId}`);
    } catch (err) {
        console.log(err);
        throw new Error('Failed to leave Team')
    }
}

export const updateTeamParticipantAuthority = async <T = void, R = AxiosResponse<T>>(data? : teamParticipantAuthorityDto):Promise<R> => {
    try {
        return await api.put('team/authority', data);
    } catch (err) {
        console.log(err);
        throw new Error('Failed to update Authority')
    }
}