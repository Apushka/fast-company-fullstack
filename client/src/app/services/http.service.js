import axios from "axios";
import configFile from "../config.json";
import { toast } from "react-toastify";
import localStorageService from "./localStorage.service";
import authService from "./auth.service";

const http = axios.create({
    baseURL: configFile.apiEndpoint
});

http.interceptors.request.use(
    async (config) => {
        const expiresDate = localStorageService.getTokenExpiresDate();
        const refreshToken = localStorageService.getRefreshToken();
        const isExpired = refreshToken && expiresDate < Date.now();

        if (configFile.isFirebase) {
            const containSlash = /\/$/gi.test(config.url);
            config.url =
                (containSlash ? config.url.slice(0, -1) : config.url) + ".json";

            if (isExpired) {
                const { data } = await authService.refresh();
                localStorageService.setTokens({
                    idToken: data.id_token,
                    refreshToken: data.refresh_token,
                    localId: data.user_id,
                    expiresIn: data.expires_in
                });
            }
            const accessToken = localStorageService.getAccessToken();
            if (accessToken) {
                config.params = {
                    ...config.params,
                    auth: accessToken
                };
            }
        } else {
            if (isExpired) {
                const data = await authService.refresh();
                localStorageService.setTokens(data);
            }
            const accessToken = localStorageService.getAccessToken();
            if (accessToken) {
                config.headers = {
                    ...config.headers,
                    Authorization: `Bearer ${accessToken}`
                };
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const transformData = (data) => {
    return data && !data._id
        ? Object.keys(data).map((key) => ({
              ...data[key]
          }))
        : data;
};

http.interceptors.response.use(
    (res) => {
        if (configFile.isFirebase) {
            res.data = { content: transformData(res.data) };
        }
        res.data = { content: res.data };
        return res;
    },
    (error) => {
        const expectedError =
            error.response &&
            error.response.status >= 400 &&
            error.response.status < 500;
        if (!expectedError) {
            // logger.log(error);
            toast.error("Something got broken. Try again later");
        }
        return Promise.reject(error);
    }
);

const httpService = {
    get: http.get,
    post: http.post,
    put: http.put,
    delete: http.delete,
    patch: http.patch
};

export default httpService;
