import { apiInstance } from "../index.tsx";
import { AxiosResponse } from "axios";
import { UserProfileUpdateDTO, UserResponseDTO, UserSearchResponseDto } from "./types.tsx";

const api = apiInstance();

export const getUserProfile = async <T = UserResponseDTO, R = AxiosResponse<T>>(): Promise<R> => {
    try {
        const url = `/user`;
        return await api.get<T, R>(url);
    } catch (err) {
        console.log(err);
        throw new Error('Failed to get user profile');
    }
}

export const updateUserProfile = async <T = UserResponseDTO, R = AxiosResponse<T>>(data?: UserProfileUpdateDTO): Promise<R> => {
    try {
        console.log(data);
        const url = `/user`;
        return await api.put<T, R>(url, data);
    } catch (err) {
        console.log(err);
        throw new Error('Failed to update user profile');
    }
}

export const deleteUser = async <T = void, R = AxiosResponse<T>>(): Promise<R> => {
    try {
        const url = `/user`;
        return await api.delete<T, R>(url);
    } catch (err) {
        console.log(err);
        throw new Error('Failed to delete user');
    }
}

export const searchUser = async <T = UserSearchResponseDto[], R = AxiosResponse<T>>(keyword: string): Promise<R> => {
    try {
        return await api.get<T, R>(`/user/${keyword}`);
    } catch (err) {
        console.log(err)
        throw new Error('Failed to search user')
    }
}