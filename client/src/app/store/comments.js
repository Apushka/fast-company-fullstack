import { createSlice } from "@reduxjs/toolkit";
import commentService from "../services/comment.service";

const commentsSlice = createSlice({
    name: "comments",
    initialState: {
        entities: null,
        isLoading: true,
        error: null
    },
    reducers: {
        commentsRequested: (state) => {
            state.isLoading = true;
        },
        commentsRequestFailed: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        commentsReceived: (state, action) => {
            state.entities = action.payload;
            state.isLoading = false;
        },
        commentCreateRequested: (state) => {
            state.isLoading = true;
        },
        commentCreateFailed: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        commentCreated: (state, action) => {
            state.entities.push(action.payload);
            state.isLoading = false;
        },
        commentDeleteRequested: (state) => {
            state.isLoading = true;
        },
        commentDeleted: (state, action) => {
            state.entities = state.entities.filter(
                (c) => c._id !== action.payload
            );
            state.isLoading = false;
        },
        commentDeleteFailed: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        }
    }
});

const { reducer: commentsReducer, actions } = commentsSlice;
const {
    commentsRequested,
    commentsRequestFailed,
    commentsReceived,
    commentCreateRequested,
    commentCreateFailed,
    commentCreated,
    commentDeleteRequested,
    commentDeleted,
    commentDeleteFailed
} = actions;

export const loadCommentsList = (userId) => async (dispatch) => {
    dispatch(commentsRequested());
    try {
        const { content } = await commentService.getComments(userId);
        dispatch(commentsReceived(content));
    } catch (error) {
        dispatch(commentsRequestFailed(error.message));
    }
};

export const createComment = (data, userId, pageId) => async (dispatch) => {
    dispatch(commentCreateRequested());
    try {
        const { content } = await commentService.createComment({
            ...data,
            userId,
            pageId
        });
        dispatch(commentCreated(content));
    } catch (error) {
        dispatch(commentCreateFailed(error.message));
    }
};

export const removeComment = (commentId) => async (dispatch) => {
    dispatch(commentDeleteRequested());
    try {
        const { content } = await commentService.removeComment(commentId);
        if (!content) {
            dispatch(commentDeleted(commentId));
        }
    } catch (error) {
        dispatch(commentDeleteFailed(error.message));
    }
};

export const getComments = () => (state) => state.comments.entities;
export const getCommentsLoadingStatus = () => (state) =>
    state.comments.isLoading;

export default commentsReducer;
