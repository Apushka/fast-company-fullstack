import React from "react";
import PropTypes from "prop-types";

const Loader = ({ fullScreen }) => {
    return <div className={"d-flex align-items-center justify-content-center mb-5 w-100" + (fullScreen ? " vh-100" : "")}>
        <span className="spinner-border" role="status" />
    </div >;
};

Loader.defaultProps = {
    fullScreen: false
};

Loader.propTypes = {
    fullScreen: PropTypes.bool
};

export default Loader;
