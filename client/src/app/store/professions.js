import { createSlice } from "@reduxjs/toolkit";
import professionService from "../services/profession.service";
import { isOutDate } from "../utils/isOutDate";

const professionsSlice = createSlice({
    name: "professions",
    initialState: {
        entities: null,
        isLoading: true,
        error: null,
        lastFetch: null
    },
    reducers: {
        professionsRequested(state) {
            state.isLoading = true;
        },
        professionsRequestFailed(state, action) {
            state.error = action.payload;
            state.isLoading = false;
        },
        professionsReceived(state, action) {
            state.entities = action.payload;
            state.isLoading = false;
            state.lastFetch = Date.now();
        }
    }
});

const { reducer: professionsReducer, actions } = professionsSlice;
const { professionsRequested, professionsRequestFailed, professionsReceived } =
    actions;

export const loadProfessionsList = () => async (dispatch, getState) => {
    const { lastFetch } = getState().professions;
    if (isOutDate(lastFetch)) {
        dispatch(professionsRequested());
        try {
            const { content } = await professionService.get();
            dispatch(professionsReceived(content));
        } catch (error) {
            dispatch(professionsRequestFailed(error.message));
        }
    }
};

export const getProfessions = () => (state) => state.professions.entities;
export const getProfessionsLoadingStatus = () => (state) =>
    state.professions.isLoading;
export const getProfessionById = (id) => (state) => {
    return state.professions.entities.find((p) => p._id === id);
};

export default professionsReducer;
