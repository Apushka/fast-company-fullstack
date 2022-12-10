import React, { useState } from "react";
import PropTypes from "prop-types";

const TextField = ({ label, type, name, value, onChange, error, placeholder }) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(prevState => !prevState);
    };

    const getInputClasses = () => {
        return "form-control " + (error ? "is-invalid" : "");
    };

    const handleChange = ({ target }) => {
        onChange({ name: target.name, value: target.value });
    };

    return (<div className="mb-4">
        {label && <label htmlFor={label}>{label}</label>}
        <div className="input-group has-validation">
            <input
                className={getInputClasses()}
                type={showPassword ? "text" : type}
                id={name}
                value={value}
                onChange={handleChange}
                name={name}
                placeholder={placeholder} />
            {type === "password" && <button className="btn btn-outline-secondary" type="button" onClick={toggleShowPassword}>
                <i className={`bi bi-eye${showPassword ? "-slash" : ""}`}></i>
            </button>}
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    </div >);
};

TextField.defaultProps = {
    type: "text"
};
TextField.propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.string,
    error: PropTypes.string,
    onChange: PropTypes.func,
    placeholder: PropTypes.string
};

export default TextField;
