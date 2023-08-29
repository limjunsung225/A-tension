import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { User } from "./user";
import { addItem as addItemToUser } from "./user"; // user Store의 addItem 액션을 가져옴
import { useAppDispatch } from "../store/hooks.ts";

export interface Item {
  name: string;
  image: string;
  itemTypeId?: bigint;
  itemTypeName?: string;
  description?: string;
}
const initialState: Item[] = []; // 빈 배열로 초기화
export const itemSlice = createSlice({
  name: "item",
  initialState: initialState,
  reducers: {

    // 아이템 정보를 스토어에 설정하는 액션
    setItems: (state, action: PayloadAction<Item[]>) => {
      return action.payload; // 전달된 아이템 정보로 상태를 업데이트
    },

    addItem: (state, action: PayloadAction<Item>) => {
      state.push(action.payload); // 아이템을 배열에 추가
      addItemToUser(action.payload); // 이게 왜 안되는지는 모르겠음 ㅠㅠ
    },

    itemLoginTest: (state, action: PayloadAction<Item[]>) => {      
      return action.payload;
    },
  },
  
});

export const fetchItems = () => async (dispatch) => {
  try {
    const response = await fetch("/api/items"); // API 엔드포인트에 맞게 URL을 수정
    const data = await response.json();
    dispatch(setItems(data));
  } catch (error) {
    console.error("Error fetching items:", error);
  }
};


export const { addItem, itemLoginTest, setItems  } = itemSlice.actions;

export const getItems = (state:RootState)=>state.item;
export default itemSlice.reducer as Reducer<Item[], AnyAction>; // 타입 어노테이션 추가