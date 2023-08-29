import axios from "axios";

// local vue api axios instance

function apiInstance() {
    const REFRESH_URL = import.meta.env.VITE_REISSUE_ACCESSTOEKN_URL;
    const getTokenFromLocalStorage = (tokenType : string) => localStorage.getItem(tokenType);
    const getRefreshToken = async (): Promise<string | void> => {
        try {
            const { data: { accessToken, refreshToken } } = await axios.get<{ accessToken: string; refreshToken: string | null }>(REFRESH_URL);

            localStorage.setItem('accessToken', accessToken);

            if (refreshToken !== null) {
                localStorage.setItem('refreshToken', refreshToken);
            }

            return accessToken;
        } catch (e) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
    }

    const instance  = axios.create({
        baseURL: `${import.meta.env.VITE_API_BASE_URL}`,
        headers: {
            "Content-Type": "application/json;charset=utf-8",
        },
    });
    instance.interceptors.request.use((config) => {
        if(!config.headers) return config;

        const tokenKey = config.url === REFRESH_URL ? 'refreshToken' : 'accessToken';
        const token = getTokenFromLocalStorage(tokenKey);

        if (token) {
            const headerName = tokenKey === 'refreshToken' ? 'Authorization-refresh' : 'Authorization';
            config.headers[headerName] = `Bearer ${token}`;
        }

        return config;
    })

    instance.interceptors.response.use((res) => res,
        async (err) =>{
            const { config, response: { status } } = err;

            //refresh 요청 자체의 에러나 401 에러가 아닌 경우 Refresh 할 필요 없음
            if (config.url === REFRESH_URL || status !== 401 || config.sent) {
                return Promise.reject(err);
            }

            /** 2 */
            config.sent = true;
            const accessToken = await getRefreshToken();

            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }

            return axios(config);
    })
    return instance;
}


export { apiInstance };