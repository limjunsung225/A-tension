import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  responseEncoding,
} from "axios";
import { setCookie, getCookie } from "./cookie";

// 사용법: 원하는 위치에서 임포트 후 기본 axios 대신에 사용
// import axios from 'axios';
// import { setupInterceptorsTo } from '@src/utils/AxiosInterceptor';
// 생성자 밑에서 인터셉터 설정된 axiosInstance 생성
// const InterceptedAxios = setupInterceptorsTo(axios.create());
// 사용
// const login = async () => {
//   const result = await InterceptedAxios.post('/auth/login', {
//     id: id,
//     password: password,
//   });
//   return result;
// };

// 요청 성공 직전 호출됩니다.
// axios 설정값을 넣습니다. (사용자 정의 설정도 추가 가능)
const onRequest = (config: AxiosRequestConfig): AxiosRequestConfig => {
  // console.info(`[요청] [${JSON.stringify(config)}]`);
  // config.baseURL = 'http://i7a403.p.ssafy.io:8080/be';

  return config;
};

// 요청 에러 직전 호출됩니다.
const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  // console.error(`[요청 에러] [${JSON.stringify(error)}]`);
  return Promise.reject(error);
};

/*
        http status가 200인 경우
        응답 성공 직전 호출됩니다. 
        .then() 으로 이어집니다.
    */
const onResponse = (response: AxiosResponse): AxiosResponse => {
  // console.info(`[응답] [${JSON.stringify(response)}]`);
  return response;
};

/*
        http status가 200이 아닌 경우
        응답 에러 직전 호출됩니다.
        .catch() 으로 이어집니다.    
    */
const onResponseError = (error: AxiosError): Promise<AxiosError> => {
  const { config, response } = error;
  if (response?.status === 401) {
    const originalRequest = config;

    let accessToken = getCookie("jwt-accessToken");
    let refreshToken = getCookie("jwt-refreshToken");

    axios({
      method: "post",
      url: "/auth/reissue",
      data: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    })
      .then((res) => {
        const newAccessToken = res.data.accessToken;
        const newRefreshToken = res.data.refreshToken;

        setCookie("jwt-accessToken", newAccessToken, {
          path: "/",
          sameSite: "Lax",
        });
        setCookie("jwt-refreshToken", newRefreshToken, {
          path: "/",
          sameSite: "Lax",
        });
        axios.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers!.Authorization = `Bearer ${newAccessToken}`;
        // 401로 요청 실패했던 요청 새로운 accessToken으로 재요청
        accessToken = newAccessToken;
        return axios.request(originalRequest);
      })
      .catch((e) => {
        console.log("에러발생 : ", e);
      });
    // 새로운 토큰 저장
  }
  // console.error(`[응답 에러] [${JSON.stringify(error)}]`);
  return Promise.reject(error);
};

export function setupInterceptorsTo(
  axiosInstance: AxiosInstance
): AxiosInstance {
  let accessToken = getCookie("jwt-accessToken");
  axiosInstance.interceptors.request.use(onRequest, onRequestError);
  axiosInstance.interceptors.response.use(onResponse, onResponseError);
  axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  // axiosInstance.defaults.headers.common['Content-Type'] =
  //   'application/json; charset=UTF-8';

  return axiosInstance;
}
