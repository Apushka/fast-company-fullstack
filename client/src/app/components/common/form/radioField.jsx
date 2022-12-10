import React from "react";
import PropTypes from "prop-types";

const RadioField = ({ options, value, onChange, name, label }) => {
    const handleChange = ({ target }) => {
        onChange({ name: target.name, value: target.value });
    };

    return <div className="mb-4">
        <label className="form-label">
            {label}
        </label>
        <div>
            {options.map(option => <div className="form-check form-check-inline" key={option.name}>
                <input
                    className="form-check-input"
                    type="radio"
                    name={name}
                    id={option.name + "_" + option.value}
                    checked={option.value === value}
                    onChange={handleChange}
                    value={option.value} />
                <label
                    className="form-check-label"
                    htmlFor="inlineRadio1">
                    {option.name}
                </label>
            </div>)}
        </div>
    </div>;
};

RadioField.propTypes = {
    options: PropTypes.array,
    value: PropTypes.string,
    onChange: PropTypes.func,
    name: PropTypes.string,
    label: PropTypes.string
};

export default RadioField;
