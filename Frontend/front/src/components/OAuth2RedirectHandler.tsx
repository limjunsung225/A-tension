import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { findMyItemList } from "../api/item/itemApi";
import { FindMyItemResponseDto } from "../api/item/types";
import { findMyTeam } from "../api/team/teamApi.tsx";
import { teamResponseDto } from "../api/team/types.tsx";
import { addList } from "../store/group.ts";
import { useAppDispatch } from "../store/hooks.ts";
import { PlanResponseDto } from "../api/plan/types.tsx";
import { reloadPlans } from "../store/plan.ts";
import { userLogin } from "../store/user.ts";
import { findMyPlan } from "../api/plan/planApi.tsx";
import { getUserProfile } from "../api/user/userApi.tsx";
import { UserResponseDTO } from "../api/user/types.tsx";
import { Item } from "../store/item.ts";
import { addItem } from "../store/item.ts";

function OAuth2RedirectHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>();
  const [accessToken, setAccessToken] = useState<string | null>();
  const [refreshToken, setRefreshToken] = useState<string | null>();

  useEffect(() => {
    setAccessToken(getUrlParameter("accessToken"));
    setRefreshToken(getUrlParameter("refreshToken"));
    setError(getUrlParameter("error"));
  }, []);

  useEffect(() => {
    if (accessToken) {
      saveTokenToLocalStorage().then(() => {
        getUserInfos().then(() => {
          navigate("/");
        });
      });
    }
  }, [accessToken, refreshToken]);

  const getUrlParameter = (name: string) => {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    const results = regex.exec(location.search);
    return results === null
      ? ""
      : decodeURIComponent(results[1].replace(/\+/g, " "));
  };
  const saveTokenToLocalStorage = async () => {
    if (accessToken != null && refreshToken != null) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    } else {
      navigate("/login", { state: { from: location, error: error } });
    }
  };

  const getUserInfos = async () => {
    getUserProfile<UserResponseDTO>().then((response) => {
      dispatch(userLogin(response.data.data))
      }).then(()=>{
        navigate("/");
    });

    // 내 아이템 조회
    findMyItemList<FindMyItemResponseDto>()
    .then((response) => {
      console.log("myItemList = ", response.data.data);
      const myItemList = response.data.data.myItemDtoList; 
      // myItem 돌면서 myItemDtoList
      for (const myItemDto of myItemList) {                
          const item : Item = {
              name : myItemDto.name,
              image : myItemDto.image,
              itemTypeId : myItemDto.itemTypeId,
              itemTypeName : myItemDto.itemTypeName,
              description : myItemDto.description,
          }
          // console.log(item);
          dispatch(addItem(item))
      } })
    .catch((error) => {
      console.error(error);
      // 에러 처리 로직 추가
    });

    // 내가 속한 모든 그룹 조회
    findMyTeam<teamResponseDto[]>()
      .then(function (result) {
        console.log(result.data);
        dispatch(addList(result.data.data));
      })
      .catch((error) => {
        console.error(error);
        // 에러 처리 로직 추가
      });

    findMyPlan<PlanResponseDto[]>()
      .then(function (result) {
        console.log(result.data);``
        dispatch(reloadPlans(result.data.data));
      })
      .catch((error) => {
        console.error(error);
        // 에러 처리 로직 추가cd
      });
  };

  return null; // Since we're doing redirects, there's nothing to render
}

export default OAuth2RedirectHandler;

// c2VzX01YanFnY2VvSDE=
