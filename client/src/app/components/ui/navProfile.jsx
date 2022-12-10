import React, { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { getCurrentUserData } from "../../store/users";
import Loader from "../common/loader";

const NavProfile = () => {
    const currentUser = useSelector(getCurrentUserData());
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(prevState => !prevState);
    };

    if (!currentUser) return <Loader />;

    return <div className="dropdown" onClick={toggleMenu}>
        <button className="btn dropdown-toggle d-flex align-items-center">
            <div className="me-2">{currentUser.name}</div>
            <img src={currentUser.image}
                alt="profile photo"
                className="img-responsive rounded-circle"
                height="40" />
        </button>
        <div className={"dropdown-menu" + (isOpen ? " show" : "")}>
            <NavLink to={`/users/${currentUser._id}`} className="dropdown-item" >Profile</NavLink>
            <NavLink to="/logout" className="dropdown-item">Log Out</NavLink>

        </div>
    </div>;
};

export default NavProfile;
