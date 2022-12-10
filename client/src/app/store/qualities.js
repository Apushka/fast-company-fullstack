import { createSlice } from "@reduxjs/toolkit";
import qualityService from "../services/quality.service";
import { isOutDate } from "../utils/isOutDate";

const qualitiesSlice = createSlice({
    name: "qualities",
    initialState: {
        entities: null,
        isLoading: true,
        error: null,
        lastFetch: null
    },
    reducers: {
        qualitiesRequested(state) {
            state.isLoading = true;
        },
        qualitiesRequestFailed(state, action) {
            state.error = action.payload;
            state.isLoading = false;
        },
        qualitiesReceived(state, action) {
            state.entities = action.payload;
            state.isLoading = false;
            state.lastFetch = Date.now();
        }
    }
});

const { reducer: qualitiesReducer, actions } = qualitiesSlice;
const { qualitiesRequested, qualitiesRequestFailed, qualitiesReceived } =
    actions;

export const loadQualitiesList = () => async (dispatch, getState) => {
    const { lastFetch } = getState().qualities;
    if (isOutDate(lastFetch)) {
        dispatch(qualitiesRequested());
        try {
            const { content } = await qualityService.get();
            dispatch(qualitiesReceived(content));
        } catch (error) {
            dispatch(qualitiesRequestFailed(error.message));
        }
    }
};

export const getQualities = () => (state) => state.qualities.entities;
export const getQualitiesLoadingStatus = () => (state) =>
    state.qualities.isLoading;
export const getQualityById = (id) => (state) => {
    return state.qualities.entities.find((q) => q._id === id);
};

export const getQualitiesByIds = (ids) => (state) => {
    if (state.qualities.entities) {
        const qualitiesArray = [];
        for (const qualId of ids) {
            for (const quality of state.qualities.entities) {
                if (quality._id === qualId) {
                    qualitiesArray.push(quality);
                    break;
                }
            }
        }
        return qualitiesArray;
    }
    return [];
};

export default qualitiesReducer;
