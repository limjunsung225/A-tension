import {apiInstance} from "../index.tsx";
import {AxiosResponse} from "axios";
import {
    CreateMyItemResponseDto,
    FindAllItemsDto,
    FindMyItemResponseDto,
} from "./types.tsx";

const api = apiInstance();

// T : 백엔드에서 받아올 정보의 타입을 나타냄
// R : Axios 응답 객체의 타입을 나타냅니다. (함수의 반환값)

// @GetMapping("/all")
// findAllItems
// List<FindAllItemsDto>
// 모든 아이템 조회
export const findAllItems = async <T = FindAllItemsDto[], R = AxiosResponse<T>>()=> {
    try {
        return await api.get<T, R>("/item/all");
    } catch (err) {
        console.log(err)
        throw new Error('Failed to find all items');
    }
}

// @PostMapping
// getRandomItem
// CreateMyItemResponseDto
// 아이템 뽑기 
export const getRandomItem = async <T = CreateMyItemResponseDto, R = AxiosResponse<T>>():Promise<R> => {
    try {
        return await api.post<T, R>("/item");
    } catch (err){
        console.log(err);
        throw new Error('Failed to create my new item');
    }
}

// GetMapping
// findMyItemList
// FindMyItemResponseDto
// 보유 아이템 조회 
export const findMyItemList = async <T = FindMyItemResponseDto, R = AxiosResponse<T>>():Promise<R> => {
    try {
        return await api.get<T, R>(`/item`);
    } catch (err) {
        console.log(err);
        throw new Error('Failed to find my item list');
    }
}

// @DeleteMapping("/{itemId}")
// deleteMyItem

export const deleteMyItem = async <T = void, R = AxiosResponse<T>>(itemId: bigint):Promise<R> => {
    try {
        return await api.delete<T, R>(`/item/${itemId}`);
    } catch (err) {
        console.log(err);
        throw new Error('Failed to delete my item')
    }
}

