import _ from "lodash";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createComment, getComments, getCommentsLoadingStatus, loadCommentsList, removeComment } from "../../store/comments";
import { getCurrentUserId } from "../../store/users";
import { CommentsList } from "../common/comments";
import Loader from "../common/loader";
import CommentAddForm from "./commentAddForm";

const Comments = () => {
    const isLoading = useSelector(getCommentsLoadingStatus());
    const comments = useSelector(getComments());
    const currentUserId = useSelector(getCurrentUserId());
    const { userId } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadCommentsList(userId));
    }, [userId]);

    const handleRemove = (id) => {
        dispatch(removeComment(id));
    };

    const handleSubmit = (data) => {
        dispatch(createComment(data, currentUserId, userId));
    };

    const sortedComments = _.orderBy(comments, ["created_at"], ["desc"]);

    return (
        <>
            <div className="card mb-2">
                {" "}
                <div className="card-body ">
                    <CommentAddForm onSubmit={handleSubmit} />
                </div>
            </div>
            {sortedComments.length > 0 && <div className="card mb-3">
                <div className="card-body ">
                    <h2>Comments</h2>
                    <hr />
                    {!isLoading
                        ? <CommentsList
                            comments={sortedComments}
                            onRemove={handleRemove} />
                        : <Loader />}

                </div>
            </div>}
        </>
    );
};

export default Comments;
