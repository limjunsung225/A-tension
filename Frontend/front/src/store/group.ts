import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { User, userLoginTest } from "./user";
import {
  teamDetailResponseDto,
  teamResponseDto,
  userProfileDto,
} from "../api/team/types";
import { UserSearchResponseDto } from "../api/user/types";

export interface Team {
  //로그인시 받아오는 유저의 그룹 목록에 있는 정보
  teamId: number; // axios에서 생성 요청시 자동반환
  name: string;
  profileImage?: string;
  description?: string;
  members?:userProfileDto[]|UserSearchResponseDto[];
}
const initialState: Team[] = [];
// const convertedTest = { ...test, teamId: Number(test.teamId) };
export const groupSlice = createSlice({
  name: "groups",
  initialState: initialState,
  reducers: {
    loginload: (state, action: PayloadAction<teamResponseDto>) => {
      const { teamId, name, profileImage } = action.payload;
      state.push({
        name: name,
        teamId: teamId,
        profileImage: profileImage,
      });
    },
    getGroupDetail: (state, action: PayloadAction<Team>) => {
      const updatedGroup = action.payload;
      const updatedState = state.map((group) =>
        group.teamId === updatedGroup.teamId ? updatedGroup : group
      );
      return updatedState;
    },
    loadListTest: (state) => {},
    groupCreateTest: (state, action: PayloadAction<Team>) => {
      const { name, profileImage, members, description } = action.payload;
      state.push({
        name: name,
        teamId: teamId,
        profileImage: profileImage,
        members: members,
        description: description,
      });
    },
    // teamId : bigint,
    // name : string,
    // profileImage : string,
    // description : string
    // userProfileDtoList : userProfileDto[],},

    addDetail: (state, action: PayloadAction<teamDetailResponseDto>) => {
      const findId = action.payload.teamId;
      const details = action.payload;
      // const theGroup = state.find(group => group.teamId === findId);
      // return theGroup;
      // If group is found, return a new state array with the modified group
      // if (theGroup) {
      return state.map((group) => (group.teamId === findId ? details : group));
    },
    addList: (state, action: PayloadAction<teamResponseDto[]>) => {
      const myGroups = action.payload;
      return [
        ...state.filter(
          (groups) =>
            !myGroups.some((newGroups) => newGroups.teamId === groups.teamId)
        ),
        ...myGroups,
      ];
    },
  },
});
export const { groupCreateTest, loadListTest, addDetail, addList, loginload } =
  groupSlice.actions;
//getters
export const getGrouplist = (state: RootState) => state.groups;
export const selectGroupById = (teamId: number) =>
  createSelector(
    (state: RootState) => state.groups,
    (groups: Team[]) => groups.find((group) => group.teamId === teamId)
  );
export default groupSlice.reducer;
