import {ReactElement} from 'react'
interface PrivateRouterProps{
    children?:ReactElement;
    authentication: boolean;//이값은 요청해서 가져오면 됨, 처음 로그인 oauth 할때 state에 저장하고 그때 확인, 만료시 조회 수정

}
const PrivateRoute = ({authentication}:PrivateRouterProps)=>{
const isauthenticate = sessionStorage.getItem("auth");
if(authentication){

}else{
    return 
}
}
export default PrivateRoute