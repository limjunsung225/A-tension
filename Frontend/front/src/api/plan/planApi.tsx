import {apiInstance} from "../index.tsx";
import {AxiosResponse} from "axios";
import {PlanRequestDto, PlanResponseDto} from "./types.tsx";

const api = apiInstance();

export const findMyPlan = async <T = PlanResponseDto[], R = AxiosResponse<T>>() => {
    try {
        return await api.get<T, R>("/plan");
    } catch (err) {
        console.log(err)
        throw new Error('Failed to find My Plan')
    }
}

export const getTeamPlan = async <T = PlanResponseDto[], R = AxiosResponse<T>>(teamId:number):Promise<R> => {
    try {
        console.log("trying to get team plan"+teamId)
        return await api.get<T, R>(`/plan/team/${teamId}`);
    } catch (err) {
        console.log(err)
        throw new Error('Failed to find Team Plan')
    }
}

export const getPlan = async <T = PlanResponseDto, R = AxiosResponse<T>>(planId:number):Promise<R> => {
    try {
        return await api.get<T, R>(`/plan/${planId}`);
    } catch (err) {
        console.log(err)
        throw new Error('Failed to find Plan details')
    }
}
export const createTeamPlan= async <T = PlanRequestDto, R = AxiosResponse<T>>(data?:PlanRequestDto):Promise<R> => {
    try {
        console.log("data = ", data);
        console.log(data?.teamId);
        return await api.post<T, R>("/plan", data);
    } catch (err) {
        console.log(err)
        throw new Error('Failed to create Plan')
    }
}

export const updatePlan= async <T = PlanRequestDto, R = AxiosResponse<T>>(planId?:number,data?:PlanRequestDto):Promise<R> => {
    try {
        return await api.put<T, R>(`/plan/${planId}`,data);
    } catch (err) {
        console.log(err)
        throw new Error('Failed to update Plan')
    }
}
export const deletePlan= async <T = PlanRequestDto, R = AxiosResponse<T>>(planId?:number,data?:PlanRequestDto):Promise<R> => {
    try {
        return await api.delete<T, R>(`/plan/${planId}`,data);
    } catch (err) {
        console.log(err)
        throw new Error('Failed to update Plan')
    }
}