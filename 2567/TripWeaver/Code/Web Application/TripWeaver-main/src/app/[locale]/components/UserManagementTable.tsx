import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

type User = {
    _id: string;
    username: string;
    email: string;
    role: string;
    points: number;
    displayName: string;
    imgPath: string;
    firstName?: string;
    lastName?: string;
};

type UserManagementTableProps = {
    userData: User[];
    setUserData: React.Dispatch<React.SetStateAction<User[]>>;
    t: (key: string) => string;
    fetchUserData: () => Promise<void>;
};

const UserManagementTable: React.FC<UserManagementTableProps> = ({ userData, setUserData, t, fetchUserData }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const maxPageNumbersToShow = 5;
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        displayName: "",
    });

    useEffect(() => {
        fetchUserData();
    }, []);

    const filteredData = userData.filter((item) =>
        Object.values(item).some((value) =>
            value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const activeData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/user/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const newUser = await response.json();
                setUserData((prev) => [...prev, newUser]);
                setShowModal(false);
                Swal.fire({
                    title: t("Admin.UserCreated"),
                    text: t("Admin.UserCreatedSuccessfully"),
                    icon: "success",
                    confirmButtonText: "โอเค",
                    confirmButtonColor: "#2563ea",
                    customClass: {
                        title: "kanit",
                        popup: "kanit",
                        confirmButton: "kanit",
                        cancelButton: "kanit",
                      },
                });
                setFormData({ username: "", email: "", password: "", displayName: "" });
            } else {
                console.error("Failed to create user");
            }
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };

    const handleDelete = async (userId: string) => {
        Swal.fire({
            title: t("Admin.ConfirmDelete"),
            text: t("Admin.AreYouSure"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#aaa",
            confirmButtonText: t("Admin.Confirm"),
            customClass: {
                title: "kanit",
                popup: "kanit",
                confirmButton: "kanit",
                cancelButton: "kanit",
              },
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`/api/user/delete/${userId}`, {
                        method: "DELETE",
                    });

                    if (response.ok) {
                        Swal.fire({
                            title: t("Admin.UserDeleted"),
                            text: t("Admin.UserDeletedSuccessfully"),
                            icon: "success",
                            confirmButtonText: "โอเค",
                            confirmButtonColor: "#2563ea",
                            customClass: {
                                title: "kanit",
                                popup: "kanit",
                                confirmButton: "kanit",
                                cancelButton: "kanit",
                              },
                        });
                        setUserData((prev) => prev.filter((user) => user._id !== userId));
                    } else {
                        console.error("Failed to delete user");
                    }
                } catch (error) {
                    console.error("Error deleting user:", error);
                }
            }
        });
    };

    const handleEdit = (user: User) => {
        Swal.fire({
            title: "แก้ไขข้อมูลผู้ใช้",
            html: `
            <form id="editUserForm" class="grid gap-3">
              <div class="input-group col-span-2 mb-4">
                <label for="role" class="block text-lg text-left ml-10 font-medium text-gray-700 kanit">${t("Admin.Role")}</label>
                <select id="role" class="swal2-input kanit mr-[545px] mt-4 px-4 py-2 border border-gray-300 rounded-lg">
                    <option value="user" ${user.role === "user" ? "selected" : ""}>User</option>
                    <option value="admin" ${user.role === "admin" ? "selected" : ""}>Admin</option>
                </select>
              </div>
              <div class="input-group col-span-1">
                <label for="username" class="block text-lg text-left ml-10 font-medium text-gray-700 kanit">${t("Admin.Username")}</label>
                <input id="username" class="swal2-input kanit" value="${user.username}" placeholder="${t("Admin.Username")}" required />
              </div>
              <div class="input-group col-span-1">
                <label for="firstName" class="block text-lg text-left ml-10 font-medium text-gray-700 kanit">${t("Admin.FirstName")}</label>
                <input id="firstName" class="swal2-input kanit" value="${user.firstName || ''}" placeholder="${t("Admin.FirstName")}" />
              </div>
              <div class="input-group col-span-1">
                <label for="email" class="block text-lg text-left ml-10 font-medium text-gray-700 kanit">${t("Admin.Email")}</label>
                <input id="email" class="swal2-input kanit" value="${user.email}" placeholder="${t("Admin.Email")}" required />
              </div>
              <div class="input-group col-span-1">
                <label for="lastName" class="block text-lg text-left ml-10 font-medium text-gray-700 kanit">${t("Admin.LastName")}</label>
                <input id="lastName" class="swal2-input kanit" value="${user.lastName || ''}" placeholder="${t("Admin.LastName")}" />
              </div>
              <div class="input-group col-span-1">
                <label for="displayName" class="block text-lg text-left ml-10 font-medium text-gray-700 kanit">${t("Admin.DisplayName")}</label>
                <input id="displayName" class="swal2-input kanit" value="${user.displayName}" placeholder="${t("Admin.DisplayName")}" required />
              </div>
              <div class="input-group col-span-1">
                <label for="points" class="block text-lg text-left ml-10 font-medium text-gray-700 kanit">${t("Admin.Points")}</label>
                <input id="points" class="swal2-input kanit" type="number" value="${user.points}" placeholder="${t("Admin.Points")}" />
              </div>
            </form>
          `,
            focusConfirm: false,
            showCancelButton: true,
            cancelButtonText: t("Admin.Cancel"),
            confirmButtonText: t("Admin.Save"),
            confirmButtonColor: "#2563ea",
            width: "800px",
            padding: "10px",
            preConfirm: () => {
                const updatedUser = {
                    username: (document.getElementById("username") as HTMLInputElement).value,
                    email: (document.getElementById("email") as HTMLInputElement).value,
                    displayName: (document.getElementById("displayName") as HTMLInputElement).value,
                    firstName: (document.getElementById("firstName") as HTMLInputElement).value,
                    lastName: (document.getElementById("lastName") as HTMLInputElement).value,
                    points: parseInt((document.getElementById("points") as HTMLInputElement).value),
                    role: (document.getElementById("role") as HTMLSelectElement).value,
                };
                return updatedUser;
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                const updatedUser = result.value;

                try {
                    const response = await fetch(`/api/user/update/${user._id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(updatedUser),
                    });

                    if (response.ok) {
                        Swal.fire({
                            title: t("Admin.UserUpdated"),
                            text: t("Admin.UserUpdatedSuccessfully"),
                            icon: "success",
                            confirmButtonText: t("Admin.OK"),
                            confirmButtonColor: "#2563ea",
                            customClass: {
                                title: "kanit",
                                popup: "kanit",
                                confirmButton: "kanit",
                                cancelButton: "kanit",
                              },
                        });
                        setUserData((prev) =>
                            prev.map((item) =>
                                item._id === user._id ? { ...item, ...updatedUser } : item
                            )
                        );
                    } else {
                        Swal.fire({
                            title: t("Admin.Error"),
                            text: t("Admin.FailedToUpdateUser"),
                            icon: "error",
                            confirmButtonText: t("Admin.OK"),
                            confirmButtonColor: "#2563ea",
                            customClass: {
                                title: "kanit",
                                popup: "kanit",
                                confirmButton: "kanit",
                                cancelButton: "kanit",
                              },
                        });
                    }
                } catch (error) {
                    console.error("Error updating user:", error);
                    Swal.fire({
                        title: t("Admin.Error"),
                        text: t("Admin.FailedToUpdateUser"),
                        icon: "error",
                        confirmButtonText: t("Admin.OK"),
                        confirmButtonColor: "#2563ea",
                        customClass: {
                            title: "kanit",
                            popup: "kanit",
                            confirmButton: "kanit",
                            cancelButton: "kanit",
                          },
                    });
                }
            }
        });
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-end items-center mb-4">
                
                <div className="flex items-center space-x-4">
                    <input
                        type="text"
                        placeholder={t("Admin.Search")}
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="kanit px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <button
                        onClick={() => setShowModal(true)}
                        className="kanit px-4 py-2 bg-blue-500 text-white rounded-lg"
                    >
                        {t("Admin.Add")}
                    </button>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
                        <h2 className="kanit text-xl font-bold mb-4">{t("Admin.AddNewUser")}</h2>
                        <form onSubmit={handleFormSubmit}>
                            <div className="mb-4">
                                <label className="block kanit">{t("Admin.Username")}</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleFormChange}
                                    required
                                    className="kanit px-4 py-2 border border-gray-300 rounded-lg w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block kanit">{t("Admin.Email")}</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleFormChange}
                                    required
                                    className="kanit px-4 py-2 border border-gray-300 rounded-lg w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block kanit">{t("Admin.Password")}</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleFormChange}
                                    className="kanit px-4 py-2 border border-gray-300 rounded-lg w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block kanit">{t("Admin.DisplayName")}</label>
                                <input
                                    type="text"
                                    name="displayName"
                                    value={formData.displayName}
                                    onChange={handleFormChange}
                                    required
                                    className="kanit px-4 py-2 border border-gray-300 rounded-lg w-full"
                                />
                            </div>
                            <button type="submit" className="kanit px-6 py-2 bg-blue-500 text-white rounded-lg">
                                {t("Admin.Confirm")}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="kanit ml-4 mt-2 px-6 py-2 bg-gray-500 text-white rounded-lg"
                            >
                                {t("Admin.Cancel")}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <table className="table-fixed border-collapse border border-gray-300 w-full text-left">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="kanit px-4 py-2 border-b border-r text-left w-[20%]">{t("Admin.Profile")}</th>
                        <th className="kanit px-4 py-2 border-b border-r text-left w-[15%]">{t("Admin.Username")}</th>
                        <th className="kanit px-4 py-2 border-b border-r text-left w-[20%]">{t("Admin.Email")}</th>
                        <th className="kanit px-4 py-2 border-b border-r text-left w-[8%]">{t("Admin.Role")}</th>
                        <th className="kanit px-4 py-2 border-b border-r text-left w-[8%]">{t("Admin.Points")}</th>
                        <th className="kanit px-4 py-2 border-b text-center w-[15%]">{t("Admin.Actions")}</th>
                    </tr>
                </thead>
                <tbody>
                    {activeData.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 border-b border-r">
                                <div className="flex items-center space-x-2">
                                    {user.imgPath ? (
                                        <img
                                            src={user.imgPath}
                                            alt={user.username}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            className="w-10 h-10 text-gray-500"
                                        >
                                            <g
                                                fill="none"
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="1.5"
                                            >
                                                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2" />
                                                <path d="M4.271 18.346S6.5 15.5 12 15.5s7.73 2.846 7.73 2.846M12 12a3 3 0 1 0 0-6a3 3 0 0 0 0 6" />
                                            </g>
                                        </svg>
                                    )}
                                    <span className="kanit truncate max-w-[120px]">{user.displayName}</span>
                                </div>
                            </td>
                            <td className="kanit px-4 py-2 border-b border-r truncate max-w-[150px]">
                                {user.username}
                            </td>
                            <td className="kanit px-4 py-2 border-b border-r truncate max-w-[200px]">
                                {user.email}
                            </td>
                            <td className="kanit px-4 py-2 border-b border-r truncate max-w-[100px]">
                                {user.role}
                            </td>
                            <td className="kanit px-4 py-2 border-b border-r truncate max-w-[100px]">
                                {user.points}
                            </td>
                            <td className="px-4 py-2 border-b text-center">
                                <div className="flex justify-center items-center space-x-2">
                                    <button
                                        onClick={() => handleEdit(user)}
                                        className="kanit px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                    >
                                        {t("Admin.Edit")}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user._id)}
                                        className="kanit px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                    >
                                        {t("Admin.Remove")}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-end items-center mt-4">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                    disabled={currentPage === 1}
                >
                    &lt;
                </button>

                <div className="flex space-x-2 mx-4">
                    {currentPage > 3 && (
                        <>
                            <button onClick={() => setCurrentPage(1)} className="kanit px-4 py-2 border rounded-lg">
                                1
                            </button>
                            <span>...</span>
                        </>
                    )}

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = Math.max(1, currentPage - 2) + i;
                        if (page <= totalPages) {
                            return (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`kanit px-4 py-2 border rounded-lg ${currentPage === page ? "bg-gray-500 text-white" : "bg-white text-gray-700"}`}
                                >
                                    {page}
                                </button>
                            );
                        }
                        return null;
                    })}

                    {currentPage < totalPages - 2 && (
                        <>
                            <span>...</span>
                            <button onClick={() => setCurrentPage(totalPages)} className="kanit px-4 py-2 border rounded-lg">
                                {totalPages}
                            </button>
                        </>
                    )}
                </div>

                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                    disabled={currentPage === totalPages}
                >
                    &gt;
                </button>
            </div>



        </div>
    );
};

export default UserManagementTable;
