import React from "react";
import PropTypes from "prop-types";
import Loader from "../../common/loader";
import UserCard from "../../ui/userCard";
import QualitiesCard from "../../ui/qualitiesCard";
import MeetingsCard from "../../ui/meetingsCard";
import Comments from "../../ui/comments";
import { useSelector } from "react-redux";
import { getUserById } from "../../../store/users";

const UserPage = ({ userId }) => {
    const user = useSelector(getUserById(userId));

    if (!user) return <Loader fullScreen />;

    return (
        <div className="container">
            <div className="row gutters-sm">
                <div className="col-md-4 mb-3">
                    <UserCard user={user} />
                    <QualitiesCard qualities={user.qualities} />
                    <MeetingsCard meetings={user.completedMeetings} />
                </div>
                <div className="col-md-8">
                    <Comments />
                </div>
            </div>
        </div>
    );
};

UserPage.propTypes = {
    userId: PropTypes.string.isRequired
};

export default UserPage;
