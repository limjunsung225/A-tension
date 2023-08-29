import {useLocation} from 'react-router-dom'
// interface Props{
//   groupId?:number;
//   groupname?: string;
// }

const GChat=()=> {
const location = useLocation();
const dataObject = location.state;
  return (
    <>
      <h1>그룹 채팅 {JSON.stringify(dataObject, null, 2)}</h1>
    </>
  )
}

export default GChat
