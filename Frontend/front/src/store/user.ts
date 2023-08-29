import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { Team } from "./group";
import { UUID } from "crypto";
import {teamResponseDto} from "../api/team/types.tsx";
import { Item } from "./item.ts";


export interface User {
  userId?: UUID; //| "c5e0d81b-9eef-4b8c-9f11-153be5b18c2c";
  nickname?: string ;
  email?: string;// | "";
  name?: string;// | "";
  profileImage?: string;
  ticket?: number; // 뽑기권
  meetingUrl?: string;
  myItems?: Item[];
  myGroups?: Team[];
}

const initialState: User = {
  userId: " - - - - ",
  email: "",
  name: "",
  profileImage: "",
  ticket: 0,
  meetingUrl: "",
  myItems: [],
  myGroups: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    userLoginTest: (state) => {
      state.userId = "c5e0d81b-9eef-4b8c-9f11-153be5b18c2c";
      state.email = "ssafy@ssafy.com";
      state.name = "김싸피";
    },

    addItem: (state, action: PayloadAction<Item>) => {
      state.myItems?.push(action.payload); // myItems 배열에 아이템 추가
    },

    // 티켓 봅기할 때 쓰는 함수 
    checkTickets: (state, action) => {
      state.ticket = action.payload;
    },
    // getTeam: (state, action : PayloadAction<teamResponseDto>) => {
    //   const {
    //     teamId,
    //     name,
    //     profileImage,
    //   } = action.payload
    //   const teamTest : Team = {
    //     teamId : 349,
    //     name : name,
    //     profileImg : profileImage
    //   }
    //   state.push(teamTest);
    //   console.log("name")
    //   console.log(name);
    //   console.log("state")
    //   console.log(state)
    // },
    userLogin: (state, action: PayloadAction<User>) => {
      //axios
      const {
        userId,
        email,
        name,
        profileImage,
        ticket,
        meetingUrl,
        myItems,
        myGroups,
      } = action.payload;
      state.userId = userId;
      state.email = email;
      state.name = name;
      state.profileImage = profileImage;
      state.ticket = 20;
      state.meetingUrl = meetingUrl;
      state.myItems = myItems;
      state.myGroups = myGroups;
      state.isLoggedIn = true;
    },
    userLogout: () => {
      console.log("log out call");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      
      return initialState; // 그냥 refresh/redirect to front page 가 나을 지도?
    },
    userRefresh: () => {
      //refresh token 혹은 상태 정보 업데이트시?
    },
    isLoggedIn: (state) => {
      return { ...state, isLoggedIn: state.email !== "" };
    },
    // hasAuthority: (state)=>{//  해당 그룹에
    //   return state.isLoggedIn;
    // }
    editName:  (state, action: PayloadAction<string>) => {
      state.name =action.payload;}
  },
});
//action - dispatch

export const { userLoginTest, userLogin, userLogout,isLoggedIn, addItem, checkTickets, editName } = userSlice.actions;

//getters
export const checkTicket = (state: RootState) => state.user.ticket;
export const getUserId = (state: RootState) => state.user.userId;
export const selectUser = (state: RootState) => state.user;
export const checkAuthority = (state: RootState) => state.user.isLoggedIn;
export const getUserGroups = (state: RootState) => state.user.myGroups;
//
export default userSlice.reducer;
