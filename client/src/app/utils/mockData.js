import { useState, useEffect } from "react";
import httpService from "../services/http.service";
import professions from "../mockData/professions.json";
import users from "../mockData/users.json";
import qualities from "../mockData/qualities.json";

export const useMockData = () => {
    const statusConsts = {
        idle: "Not Started",
        error: "Error occurred",
        pending: "In progress",
        success: "Ready"
    };

    const [error, setError] = useState(null);
    const [status, setStatus] = useState(statusConsts.idle);
    const [progress, setProgress] = useState(0);
    const [count, setCount] = useState(0);
    const summaryCount = professions.length + users.length + qualities.length;

    const increment = () => {
        setCount((prevState) => prevState + 1);
    };

    const updateProgress = () => {
        if (count !== 0 && status === statusConsts.idle) {
            setStatus(statusConsts.pending);
        }
        const newProgress = Math.floor((count / summaryCount) * 100);
        if (progress < newProgress) {
            setProgress(() => newProgress);
        }
        if (newProgress === 100) {
            setStatus(statusConsts.success);
        }
    };

    useEffect(() => {
        updateProgress();
    }, [count]);

    const resetState = () => {
        setProgress(0);
        setCount(0);
        setStatus(statusConsts.idle);
        setError(null);
    };

    const initialize = async () => {
        resetState();
        console.log("yes");

        try {
            for (const prof of professions) {
                await httpService.put("profession/" + prof._id, prof);
                increment();
            }
            for (const user of users) {
                await httpService.put("user/" + user._id, user);
                increment();
            }
            for (const qual of qualities) {
                await httpService.put("quality/" + qual._id, qual);
                increment();
            }
        } catch (error) {
            setError(error);
            setStatus(statusConsts.error);
        }
    };
    return { initialize, error, progress, status };
};
