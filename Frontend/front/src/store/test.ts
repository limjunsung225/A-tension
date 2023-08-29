import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { User } from "./user";
export interface Status {
  sessionId?: string;
  user?: User;
  inMeeting?: boolean | false;
  loggedIn?: boolean | false;
}
const initialState: Status = {
  sessionId: "",
  inMeeting: false,
  loggedIn: false,
};
//  = {
//     name:"",
//     date:"",
//     members:[],
//     private:false,
//     time:""
// };
export const statusSlice = createSlice({
  name: "status",
  initialState: initialState,
  reducers: {
    meetingModeTest: (state) => {
      state.inMeeting = !state.inMeeting;
    },
    hideBackground: (state, action: PayloadAction<boolean>) => {
      state.inMeeting = action.payload;
    },

    // planCreateTest: (state, action: PayloadAction<Plan>) => {
    //   const { members, name,start,starttime, startdate, isPrivate} = action.payload;
    //   state.push({
    //     name: name,
    //     members: members,
    //     start: start,
    //     starttime:starttime,
    //     startdate:startdate,
    //     isPrivate:isPrivate,
    //   });
    // },
  },
});
export const { meetingModeTest, hideBackground } = statusSlice.actions;
//getters
export const getMode = (state: RootState) => state.status.inMeeting;
//
export default statusSlice.reducer;
