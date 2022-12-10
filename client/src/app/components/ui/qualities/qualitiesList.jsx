import React from "react";
import PropTypes from "prop-types";
import Quality from "./quality";
import Loader from "../../common/loader";
import { useSelector } from "react-redux";
import { getQualitiesByIds, getQualitiesLoadingStatus } from "../../../store/qualities";

const QualitiesList = ({ qualities }) => {
    const isLoading = useSelector(getQualitiesLoadingStatus());
    const qualitiesList = useSelector(getQualitiesByIds(qualities));

    if (isLoading) return <Loader />;
    return (
        <>
            {qualitiesList.map((qual) => (
                <Quality key={qual._id} {...qual} />
            ))}
        </>
    );
};

QualitiesList.propTypes = {
    qualities: PropTypes.array
};

export default QualitiesList;
