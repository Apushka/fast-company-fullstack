import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { getIsLoggedIn } from "../../store/users";
import NavProfile from "./navProfile";

const NavBar = () => {
    const isLoggedIn = useSelector(getIsLoggedIn());
    return (
        <nav className="navbar bg-light mb-3">
            <div className="container-fluid">
                <ul className="nav">
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="bg-secondary text-white" exact to="/">
                            Main
                        </NavLink>
                    </li>
                    {isLoggedIn && <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="bg-secondary text-white" to="/users">
                            Users
                        </NavLink>
                    </li>}
                </ul>
                <div className="nav d-flex">
                    {isLoggedIn
                        ? <NavProfile />
                        : <NavLink className="nav-link" aria-current="page" activeClassName="bg-secondary text-white" to="/login">
                            Login
                        </NavLink>}

                </div>
            </div>
        </nav>
    );
};

export default NavBar;
