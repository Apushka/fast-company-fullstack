import React, { useEffect, useState } from "react";
import * as yup from "yup";
import TextField from "../common/form/textField";
import PropTypes from "prop-types";
import SelectField from "../common/form/selectField";
import RadioField from "../common/form/radioField";
import MultiSelectField from "../common/form/miltiSelectField";
import Loader from "../common/loader";
import { useDispatch, useSelector } from "react-redux";
import { getQualities, getQualitiesByIds, getQualitiesLoadingStatus } from "../../store/qualities";
import { getProfessions } from "../../store/professions";
import { getCurrentUserData, updateUserData } from "../../store/users";

const UserEditForm = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector(getCurrentUserData());
    const userQualities = useSelector(getQualitiesByIds(currentUser.qualities));
    const [data, setData] = useState({
        ...currentUser,
        qualities: transformData(userQualities)
    }
    );

    const professions = useSelector(getProfessions());
    const professionsList = transformData(professions);
    const qualities = useSelector(getQualities());
    const isLoading = useSelector(getQualitiesLoadingStatus());
    const qualitiesList = transformData(qualities);
    const [errors, setErrors] = useState({});
    const isValid = Object.keys(errors).length === 0;

    function transformData(data) {
        const arr = Array.isArray(data) ? data : Object.values(data);
        return arr.map((item) => {
            const { name: label, _id: value, ...rest } = item;
            return { label, value, ...rest };
        });
    };

    useEffect(() => {
        validate();
    }, [data]);

    const validateSchema = yup.object().shape({
        qualities: yup.array(),
        sex: yup.string(),
        profession: yup.string().required("Обязательно выберите вашу профессию"),
        email: yup.string().required("Электронная почта обязательна для заполнения").email("Email введён некорректно"),
        name: yup.string().required("Имя почта обязательно для заполнения")
    });

    const validate = () => {
        validateSchema.validate(data)
            .then(() => setErrors({}))
            .catch((error) => setErrors({ [error.path]: error.message }));
        return Object.keys(errors).length === 0;
    };

    const handleChange = (target) => {
        setData(prevState => ({ ...prevState, [target.name]: target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = validate();
        if (!isValid) return;
        const { qualities } = data;
        const updatedData = {
            ...data,
            qualities: qualities.map(q => q.value)
        };
        dispatch(updateUserData(updatedData));
    };

    if (isLoading) return <Loader />;

    return <form onSubmit={handleSubmit}>
        <TextField
            name="name"
            label="Имя"
            error={errors.name}
            value={data.name}
            onChange={handleChange}
        />
        <TextField
            label="Электронная почта"
            name="email"
            value={data.email}
            onChange={handleChange}
            error={errors.email} />
        <SelectField
            label="Выберите вашу профессию"
            options={professionsList}
            name="profession"
            onChange={handleChange}
            defaultOption="Choose..."
            error={errors.profession}
            value={data.profession}
        />
        <RadioField
            options={[
                { name: "Male", value: "male" },
                { name: "Female", value: "female" },
                { name: "Other", value: "other" }
            ]}
            value={data.sex}
            name="sex"
            onChange={handleChange}
            label="Выберите ваш пол"
        />
        <MultiSelectField
            options={qualitiesList}
            onChange={handleChange}
            defaultValue={data.qualities}
            name="qualities"
            label="Выберите ваши качества" />
        <button className="btn btn-primary w-100 mx-auto" disabled={!isValid}>Submit</button>
    </form>;
};

UserEditForm.propTypes = {
    user: PropTypes.object
};

export default UserEditForm;
