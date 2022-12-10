import React, { useEffect, useState } from "react";
import { validator } from "../../utils/validator";
import TextField from "../common/form/textField";
import SelectField from "../common/form/selectField";
import RadioField from "../common/form/radioField";
import MultiSelectField from "../common/form/miltiSelectField";
import CheckBoxField from "../common/form/checkBoxField";
import { useDispatch, useSelector } from "react-redux";
import { getQualities } from "../../store/qualities";
import { getProfessions } from "../../store/professions";
import { signUp } from "../../store/users";

const RegisterForm = () => {
    const [data, setData] = useState({
        email: "",
        password: "",
        profession: "",
        sex: "male",
        name: "",
        qualities: [],
        license: false
    });

    const [errors, setErrors] = useState({});
    const isValid = Object.keys(errors).length === 0;
    const qualities = useSelector(getQualities());

    const qualitiesList = qualities.map(q => ({
        label: q.name,
        value: q._id
    }));
    const professions = useSelector(getProfessions());
    const professionsList = professions.map(p => ({
        value: p._id,
        label: p.name
    }));
    const dispatch = useDispatch();

    useEffect(() => {
        validate();
    }, [data]);

    const validatorConfig = {
        email: {
            isRequired: {
                message: "Электронная почта обязательна для заполнения"
            },
            isEmail: {
                message: "Email введён некорректно"
            }
        },
        name: {
            isRequired: {
                message: "Имя обязательно для заполнения"
            },
            min: {
                message: "Имя должно состоять минимум из 3-х символов",
                value: 3
            }
        },
        password: {
            isRequired: {
                message: "Пароль обязателен для заполнения"
            },
            isCapital: {
                message: "Пароль должен содержать хотя бы одну заглавную букву"
            },
            isContainDigit: {
                message: "Пароль должен содержать хотя бы одну цифру"
            },
            min: {
                message: "Пароль должен состоять минимум из 8-ми символов",
                value: 8
            }
        },
        profession: {
            isRequired: {
                message: "Обязательно выберите вашу профессию"
            }
        },
        license: {
            isRequired: {
                message: "Нужно обязательно принять условия лицензионного соглашения"
            }
        }
    };

    const validate = () => {
        const errors = validator(data, validatorConfig);
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (target) => {
        setData(prevState => ({ ...prevState, [target.name]: target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const isValid = validate();
        if (!isValid) return;
        const newData = {
            ...data,
            qualities: data.qualities.map(q => q.value)
        };

        dispatch(signUp(newData));
    };

    return <form onSubmit={handleSubmit}>
        <TextField
            label="Электронная почта"
            name="email"
            value={data.email}
            onChange={handleChange}
            error={errors.email} />
        <TextField
            label="Имя"
            name="name"
            value={data.name}
            onChange={handleChange}
            error={errors.name} />
        <TextField
            label="Пароль"
            type="password"
            name="password"
            value={data.password}
            onChange={handleChange}
            error={errors.password} />
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
        <CheckBoxField
            value={data.license}
            onChange={handleChange}
            name="license"
            error={errors.license}>
            Принять <a>лицензионное соглашение</a>
        </CheckBoxField>
        <button className="btn btn-primary w-100 mx-auto" disabled={!isValid}>Submit</button>
    </form>;
};

export default RegisterForm;
