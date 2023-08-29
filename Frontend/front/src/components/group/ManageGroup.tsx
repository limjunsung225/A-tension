import { Team } from "../../store/group";
import Gcreate from "./Gcreate";

interface Props{
  groupId?:number;
  groupname?: string;
  teamProp?:Team;
}

const ManageGroup=(props:Props)=> {
  return (
    <>
      <Gcreate teamProp={props.teamProp}></Gcreate>
    </>
  )
}

export default ManageGroup
