import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { getIsLoggedIn, getUsersIsLoading, loadUsersList } from "../store/users";
import Loader from "../components/common/loader";
import { loadQualitiesList } from "../store/qualities";
import { loadProfessionsList } from "../store/professions";

const AppLoader = ({ children }) => {
    const isLoggedIn = useSelector(getIsLoggedIn());
    const usersStatusLoading = useSelector(getUsersIsLoading());
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loadQualitiesList());
        dispatch(loadProfessionsList());
        if (isLoggedIn) {
            dispatch(loadUsersList());
        }
    }, [isLoggedIn]);
    if (usersStatusLoading) return <Loader fullScreen />;
    return children;
};

AppLoader.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
};

export default AppLoader;
