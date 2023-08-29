import axios from "axios";
import { setupInterceptorsTo } from "../utils/AxiosInterceptor";

const InterceptedAxios = setupInterceptorsTo(axios.create());

export default InterceptedAxios;
