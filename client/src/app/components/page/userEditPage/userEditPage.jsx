import React from "react";
import BackButton from "../../common/backButton";
import UserEditForm from "../../ui/userEditForm";

const UserEditPage = () => {
    return <div className="container mt-5">
        <BackButton />
        <div className="col-md-6 offset-md-3 shadow p-4">
            <UserEditForm />
        </div>
    </div>;
};

export default UserEditPage;
