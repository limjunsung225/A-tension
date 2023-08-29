import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { Team } from "./group";
import { User } from "./user";
import { planResponseDto } from "../api/plan/types";
import fillerImg from "../assets/Memoji.png";

//!! 사실 거꾸로 인데 리팩토링 힘들어서 일단 이름 플랜 <-> 미팅
export interface Meeting {
  name: string;
  startTime: string;
  invite?: string | User[] | string[] | Team["teamId"];
  isPrivate: boolean | false;
 
  id?: number;
  teamId?: number;
  // endTime?: string;
  // description: string;
  teamName?: string;
  // profileImg?: string; 
}
export interface Plan extends planResponseDto {
  id: number;
  teamId: number;
  name: string;
  startTime: string;
  endTime: string;
}
const currentDate = new Date();
const stringdate = currentDate.toISOString();
// date: new Date().toISOString().replace(/T.*$/, ''),

currentDate.setHours(currentDate.getHours() + 3);
const endString = currentDate.toISOString();
const initialState: Meeting[] = [];
export const meetingSlice = createSlice({
  name: "meeting",
  initialState: initialState,
  reducers: {
    loadListTest: (state) => {
      state.push(
        {
          id: 1,
          teamId: 306,
          name: "누르면 생기는 일정",
          startTime: stringdate,
          endTime: endString,
          description: "입력시 isostring 형태",
          teamName: "5b1f",
          profileImage: fillerImg,
        },
        {
          id: 714,
          teamId: 812,
          name: "테스트용일정",
          startTime: new Date().toISOString(),
          endTime: endString,
          description: "리덕스 스토어의 슬라이스 초기 상태",
          teamName: "이게진짜 맞나",
          profileImage: fillerImg,
        },
        {
          id: 555,
          teamId: 111,
          name: "테스트 ",
          startTime: new Date("2023-08-18T09:00:00").toISOString(),
          endTime: new Date("2023-08-18T18:00:00").toISOString(),
          description: "리덕스 스토어의 슬라이스 초기 상태",
          teamName: "이게진짜 맞나",
          profileImage: fillerImg,
        }
      );
      // state.push({
      //   name: "G2",
      //   members: 2,
      // });
    },
    meetCreateTest: (state, action: PayloadAction<Meeting>) => {
      const {
        id,
        name,
        startTime,
        endTime,
        teamName,
      } = action.payload;
      state.push({
        name: name,
        members: members,
        startTime: startTime,
        endTime: endTime,
        starttime:starttime,
        startdate:startdate,
        isPrivate:isPrivate,
        // id: id,
        // teamId: 0,
        // name: "",
        // startTime: "",
        // endTime: "",
        // description: "",
        // teamName: "",
        // profileImage: "",
      });
    },
  },
});
export const { meetCreateTest, loadListTest } = meetingSlice.actions;
//getters
export const getPlanlist = (state: RootState) => state.meeting;
export const loadEventList = (state: RootState) => state.meeting;
//
export default meetingSlice.reducer;
