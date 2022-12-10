import React, { useState } from "react";
import PropTypes from "prop-types";
import { validator } from "../../utils/validator";
import TextAreaField from "../common/form/textAreaField";

const CommentAddForm = ({ onSubmit }) => {
    const [data, setData] = useState({});

    const [errors, setErrors] = useState({});
    const isValid = Object.keys(errors).length === 0;

    const handleChange = (target) => {
        setData(prevState => ({ ...prevState, [target.name]: target.value }));
    };

    const validatorConfig = {
        content: {
            isRequired: {
                message: "Сообщение не должно быть пустым"
            }
        }
    };

    const validate = () => {
        const errors = validator(data, validatorConfig);
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const isValid = validate();
        if (!isValid) return;
        onSubmit(data);
        clearForm();
    };

    const clearForm = () => {
        setData({});
        setErrors({});
    };

    return <div>
        <h2>New comment</h2>
        <form onSubmit={handleSubmit}>
            <TextAreaField
                label="Сообщение"
                name="content"
                value={data.content || ""}
                onChange={handleChange}
                error={errors.content} />
            <div className="d-flex justify-content-end">
                <button className="btn btn-primary" disabled={!isValid}>Опубликовать</button>
            </div>
        </form>
    </div>;
};

CommentAddForm.propTypes = {
    onSubmit: PropTypes.func
};

export default CommentAddForm;
