import { createSlice } from "@reduxjs/toolkit";
import authService from "../services/auth.service";
import localStorageService from "../services/localStorage.service";
import userService from "../services/user.service";
import { generateAuthError } from "../utils/generateAuthError";
import history from "../utils/history";

const initialState = localStorageService.getAccessToken()
    ? {
          entities: null,
          isLoading: true,
          error: null,
          auth: localStorageService.getUserId(),
          isLoggedIn: true,
          dataLoaded: false
      }
    : {
          entities: null,
          isLoading: false,
          error: null,
          auth: null,
          isLoggedIn: false,
          dataLoaded: false
      };

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        authRequested: (state) => {
            state.error = null;
        },
        authRequestSuccess: (state, action) => {
            state.auth = action.payload;
            state.isLoggedIn = true;
        },
        authRequestFailed: (state, action) => {
            state.error = action.payload;
        },
        usersRequested: (state) => {
            state.isLoading = true;
        },
        usersRequestFailed: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        usersReceived: (state, action) => {
            state.entities = action.payload;
            state.isLoading = false;
            state.dataLoaded = true;
        },
        userCreated: (state, action) => {
            if (!Array.isArray(state.entities)) {
                state.entities = [];
            }
            state.entities.push(action.payload);
        },
        userLoggedOut: (state) => {
            state.entities = null;
            state.auth = null;
            state.isLoggedIn = false;
            state.dataLoaded = false;
        },
        userUpdateRequested: (state) => {
            state.isLoading = true;
        },
        userUpdated: (state, action) => {
            state.entities = state.entities.map((u) =>
                u._id === action.payload._id ? action.payload : u
            );
            state.isLoading = false;
        },
        userUpdateFailed: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        }
    }
});

const { reducer: usersReducer, actions } = usersSlice;
const {
    usersRequested,
    usersRequestFailed,
    usersReceived,
    authRequested,
    authRequestSuccess,
    authRequestFailed,
    userLoggedOut,
    userUpdateRequested,
    userUpdated,
    userUpdateFailed
} = actions;

export const logIn =
    ({ payload, redirect }) =>
    async (dispatch) => {
        const { email, password } = payload;
        dispatch(authRequested());
        try {
            const data = await authService.login({ email, password });
            localStorageService.setTokens(data);
            dispatch(authRequestSuccess(data.userId));
            history.push(redirect);
        } catch (error) {
            const { code, message } = error.response.data.error;
            if (code === 400) {
                const errorMessage = generateAuthError(message);
                dispatch(authRequestFailed(errorMessage));
            } else {
                dispatch(authRequestFailed(error.message));
            }
        }
    };

export const logOut = () => (dispatch) => {
    localStorageService.removeAuthData();
    dispatch(userLoggedOut());
    history.push("/");
};

export const updateUserData = (data) => async (dispatch) => {
    dispatch(userUpdateRequested());
    try {
        const { content } = await userService.update(data);
        dispatch(userUpdated(content));
        history.push(`/users/${content._id}`);
    } catch (error) {
        dispatch(userUpdateFailed(error.message));
    }
};

export const signUp = (payload) => async (dispatch) => {
    dispatch(authRequested());
    try {
        const data = await authService.register(payload);
        localStorageService.setTokens(data);
        dispatch(authRequestSuccess(data.userId));
        history.push("/users");
    } catch (error) {
        dispatch(authRequestFailed(error.message));
    }
};

export const loadUsersList = () => async (dispatch) => {
    dispatch(usersRequested());
    try {
        const { content } = await userService.get();
        dispatch(usersReceived(content));
    } catch (error) {
        dispatch(usersRequestFailed(error.message));
    }
};

export const getUsers = () => (state) => state.users.entities;
export const getCurrentUserData = () => (state) =>
    state.users.entities
        ? state.users.entities.find((u) => u._id === state.users.auth)
        : null;
export const getUsersLoadingStatus = () => (state) => state.users.isLoading;
export const getUserById = (id) => (state) => {
    return state.users.entities.find((p) => p._id === id);
};
export const getIsLoggedIn = () => (state) => state.users.isLoggedIn;
export const getCurrentUserId = () => (state) => state.users.auth;
export const getDataStatus = () => (state) => state.users.dataLoaded;
export const getUsersIsLoading = () => (state) => state.users.isLoading;
export const getAuthError = () => (state) => state.users.error;

export default usersReducer;
