import axios from "axios";
import { setupInterceptorsTo } from "../utils/AxiosInterceptor";

const getCode = async () => {
  // const interceptedAxios = setupInterceptorsTo(axios.create());
  while (1) {
    // const usedCode = await interceptedAxios.get(`/classes/checkcode`);
    const code = Math.random().toString(14).substring(2, 8);
    // if (!(code in usedCode)) return code;
    return code;
  }
};

export default getCode;
