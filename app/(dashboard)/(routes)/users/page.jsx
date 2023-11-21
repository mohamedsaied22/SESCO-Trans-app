"use client";
import { Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import { Card } from "@/components/ui/card";
import { Heading } from "@/components/heading";
import NewUser from "./components/new-user-modal";
import UpdateUser from "./components/update-user-modal";
import DeleteUser from "./components/delete-user-modal";
import Pagination from "@/components/pagination";
import SortOptions from "./components/user-sort-options";
import Filters from "@/components/filteration";

export default function UserPage() {
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [originalUsers, setOriginalUsers] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 15;
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setOriginalUsers(storedUsers.map(addSubsCount));
    setFilteredUsers(storedUsers.map(addSubsCount));
  }, []);

  const addSubsCount = (user) => {
    const userSubs = JSON.parse(localStorage.getItem(`subs_${user.id}`)) || [];
    user.subs = userSubs.length;
    return user;
  };

  const filterUsers = (filterValue) => {
    if (filterValue === "") {
      setFilteredUsers(originalUsers);
      setCurrentPage(1);
    } else {
      const lowerCaseFilterValue = filterValue.toLowerCase();
      const filtered = originalUsers.filter((user) => {
        return (
          user.username.toLowerCase().includes(lowerCaseFilterValue) ||
          user.role.toLowerCase().includes(lowerCaseFilterValue) ||
          user.branch.toLowerCase().includes(lowerCaseFilterValue) ||
          user.email.toLowerCase().includes(lowerCaseFilterValue)
        );
      });

      setFilteredUsers(filtered);
      setCurrentPage(1);
    }
  };

  const handleSortChange = (sortValue) => {
    setSortOption(sortValue);

    const sortedUsers = [...filteredUsers];

    switch (sortValue) {
      case "username":
        sortedUsers.sort((a, b) => a.username.localeCompare(b.username));
        break;
      case "role":
        sortedUsers.sort((a, b) => a.role.localeCompare(b.role));
        break;
      case "branch":
        sortedUsers.sort((a, b) => a.branch.localeCompare(b.branch));
        break;
      case "email":
        sortedUsers.sort((a, b) => a.email.localeCompare(b.email));
        break;
      default:
        break;
    }

    setFilteredUsers(sortedUsers);
    setCurrentPage(1);
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleUserCreated = (newUser) => {
    newUser.id = uuidv4();

    const updatedUsers = [...filteredUsers, newUser];
    setFilteredUsers(updatedUsers);
    setOriginalUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  const handleUpdateUser = (updatedUser) => {
    const userIndex = filteredUsers.findIndex(
      (user) => user.id === updatedUser.id
    );

    if (userIndex !== -1) {
      const updatedUsers = [...filteredUsers];
      updatedUsers[userIndex] = updatedUser;
      setFilteredUsers(updatedUsers);
      setOriginalUsers(updatedUsers);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
    }
  };

  const handleDeleteUser = (user) => {
    const updatedUsers = filteredUsers.filter((u) => u.id !== user.id);
    setFilteredUsers(updatedUsers);
    setOriginalUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  return (
    <div className="">
      <Heading
        title="User Management"
        description="Maintain the privacy of your users."
        icon={Users}
        iconColor="text-sky-400"
      />

      {/* <div className="px-4 mb-8 mt-10">
        <Filters onFilterChange={filterUsers} />
      </div>

      <div className="flex mt-8 mb-6 items-start justify-center">
        <div>
          <SortOptions
            sortOption={sortOption}
            onSortChange={handleSortChange}
          />
        </div>
        <NewUser users={filteredUsers} onUserCreated={handleUserCreated} />
      </div> */}

      <div className="  px-1  flex flex-col md:flex-row mt-8 mb-2 justify-center items-center ">
        <div className="flex-1 mb-4 ">
          <Filters onFilterChange={filterUsers} />
        </div>
        <div className="mb-4 ml-2 rounded-full">
          <SortOptions
            sortOption={sortOption}
            onSortChange={handleSortChange}
          />
        </div>
        <div className="mb-4  ">
          <NewUser users={filteredUsers} onUserCreated={handleUserCreated} />
        </div>
      </div>

      <div className=" px-4 md:px-12 mt-4 lg:px-16  grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {currentUsers.map((user, index) => (
          <Card
            key={index}
            className="w-1/2 p-4 border-black/5 flex flex-col shadow-md hover:shadow-xl transition "
          >
            <div className="  flex items-center justify-end mb-4 ">
              <div className="w-full font- ">
                <div 
                  className="flex text-lg  mb-2 bg-gray-100 shadow-lg p-2 items-center justify-center rounded-t-2xl font-semibold">
                  <div
                   className="text-right ">
                    {user.username || ".................."}
                  </div>
                </div>
                <div className="flex justify-between mb-2 shadow-md p-2">
                  <div className="text-left text-md">Role:</div>
                  <div className="text-right ">
                    {user.role || ".................."}
                  </div>
                </div>
                <div className="flex justify-between shadow-md p-2">
                  <div className="text-left text-sm">Email:</div>
                  <div className="text-right text-sm ">
                    {user.email || ".................."}
                  </div>
                </div>

                <div className="flex justify-between shadow-md p-2">
                  <div className="text-left text-md">Branch:</div>
                  <div className="text-right ">
                    {user.branch || ".................."}
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="text-sm">User No: {user.id}</div> */}

            <div className="flex justify-center mt-auto">
              <UpdateUser user={user} onUpdateUser={handleUpdateUser} />
              {/* <DeleteUser onDeleteUser={() => handleDeleteUser(user)} /> */}
            </div>
          </Card>
        ))}
      </div>

      <Pagination
        currentUsers={currentUsers}
        currentPage={currentPage}
        totalPages={totalPages}
        goToPreviousPage={goToPreviousPage}
        goToNextPage={goToNextPage}
      />
    </div>
  );
}
