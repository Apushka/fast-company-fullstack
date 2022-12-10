import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { getDataStatus, loadUsersList } from "../store/users";
import Loader from "../components/common/loader";

const UsersLoader = ({ children }) => {
    const dataLoaded = useSelector(getDataStatus());
    const dispatch = useDispatch();

    useEffect(() => {
        if (!dataLoaded) {
            dispatch(loadUsersList());
        }
    }, []);

    if (!dataLoaded) {
        return <Loader fullScreen />;
    }
    return children;
};

UsersLoader.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
};

export default UsersLoader;
