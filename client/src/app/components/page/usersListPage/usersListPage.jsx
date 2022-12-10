import React, { useState, useEffect } from "react";
import _ from "lodash";
import { paginate } from "../../../utils/paginate";
import Pagination from "../../../components/common/pagination";
import GroupList from "../../common/groupList";
import SearchStatus from "../../ui/searchStatus";
import UserTable from "../../ui/usersTable";
import SearchField from "../../common/form/searchField";
import Loader from "../../common/loader";
import { useSelector } from "react-redux";
import { getProfessions, getProfessionsLoadingStatus } from "../../../store/professions";
import { getCurrentUserId, getUsers } from "../../../store/users";

const UsersListPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const users = useSelector(getUsers());
    const currentUserId = useSelector(getCurrentUserId());
    const professions = useSelector(getProfessions());
    const isLoading = useSelector(getProfessionsLoadingStatus());
    const [selectedProf, setSelectedProf] = useState();
    const [sortBy, setSortBy] = useState({ path: "name", order: "asc" });
    const [search, setSearch] = useState("");
    const pageSize = 8;

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedProf, search]);

    const handleToggleBookMark = (id) => {
        const newArray = users.map((user) => {
            if (user._id === id) {
                return { ...user, bookmark: !user.bookmark };
            }
            return user;
        });
        console.log(newArray);
    };

    const handleProfessionSelect = (item) => {
        setSelectedProf(item);
        if (search) setSearch("");
    };

    const handlePageChange = (pageIndex) => {
        setCurrentPage(pageIndex);
    };
    const handleSort = (item) => {
        setSortBy(item);
    };

    const filterUsers = (data) => {
        const filteredUsers = search
            ? data.filter(user => user.name.toLowerCase().includes(search))
            : selectedProf
                ? data.filter(
                    (user) =>
                        user.profession ===
                        selectedProf._id
                )
                : data;
        return filteredUsers.filter(u => u._id !== currentUserId);
    };

    if (users) {
        const filteredUsers = filterUsers(users);
        const count = filteredUsers.length;
        const sortedUsers = _.orderBy(
            filteredUsers,
            [sortBy.path],
            [sortBy.order]
        );

        const usersCrop = paginate(sortedUsers, currentPage, pageSize);

        const clearFilter = () => {
            setSelectedProf();
        };

        const handleSearch = ({ value }) => {
            if (selectedProf) clearFilter();
            setSearch(value.trim().toLowerCase());
        };

        return (
            <div className="d-flex">
                {professions && !isLoading && (
                    <div className="d-flex flex-column flex-shrink-0 p-3">
                        <GroupList
                            selectedItem={selectedProf}
                            items={professions}
                            onItemSelect={handleProfessionSelect}
                        />
                        <button
                            className="btn btn-secondary mt-2"
                            onClick={clearFilter}
                        >
                            {" "}
                            Очистить
                        </button>
                    </div>
                )}
                <div className="d-flex flex-column">
                    <SearchStatus length={count} />
                    <SearchField value={search} onChange={handleSearch} />

                    {count > 0 && (
                        <UserTable
                            users={usersCrop}
                            onSort={handleSort}
                            selectedSort={sortBy}
                            onToggleBookMark={handleToggleBookMark}
                        />
                    )}
                    <div className="d-flex justify-content-center">
                        <Pagination
                            itemsCount={count}
                            pageSize={pageSize}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            </div >
        );
    }
    return <Loader fullScreen />;
};

export default UsersListPage;
