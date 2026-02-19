import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import Swal from "sweetalert2";

type Request = {
    _id: string;
    type: string;
    placeType: string;
    placeId: string | null;
    userId: {
        _id: string;
        username: string;
        displayName: string;
        email: string;
    };
    details: Record<string, any>;
    status: string;
    date: string;
};

type RequestManagementTableProps = {
    t: (key: string) => string;
};

const RequestManagementTable: React.FC<RequestManagementTableProps> = ({ t }) => {
    const [requests, setRequests] = useState<Request[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [placeTypeFilter, setPlaceTypeFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
    const [showModal, setShowModal] = useState(false);
    const itemsPerPage = 10;
    const maxPageNumbersToShow = 5;
    const fetchRequests = async () => {
        try {
            const response = await fetch("/api/request/getAll");
            if (!response.ok) throw new Error("Failed to fetch requests");
            const data = await response.json();
            setRequests(data);
        } catch (error) {
            console.error("Error fetching requests:", error);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const translateType = (type: string) => {
        if (type === "add") return "เพิ่มสถานที่";
        if (type === "edit") return "แก้ไขสถานที่";
        return type;
    };

    const translatePlaceType = (placeType: string) => {
        if (placeType === "attraction") return "สถานที่ท่องเที่ยว";
        if (placeType === "accommodation") return "สถานที่พัก";
        if (placeType === "restaurant") return "ร้านอาหาร";
        return placeType;
    };

    const translateStatus = (status: string) => {
        if (status === "waiting") return "รอดำเนินการ";
        if (status === "approved") return "สำเร็จ";
        if (status === "rejected") return "ปฎิเสธคำขอ";
        return status;
    };

    const searchMapping: Record<string, string> = {
        เพิ่มสถานที่: "add",
        แก้ไขสถานที่: "edit",
        สถานที่ท่องเที่ยว: "attraction",
        สถานที่พัก: "accommodation",
        ร้านอาหาร: "restaurant",
        รอดำเนินการ: "waiting",
        สำเร็จ: "approved",
        ปฎิเสธคำขอ: "rejected",
    };

    const filteredData = requests.filter((item) => {
        const translatedItem = {
            ...item,
            name: item.details?.name,
            type: translateType(item.type),
            placeType: translatePlaceType(item.placeType),
            status: translateStatus(item.status),
        };
    
        const searchQueryMapped =
            searchMapping[searchQuery] || searchQuery.toLowerCase();
    
        const matchesSearch = Object.values(translatedItem).some((value) =>
            value?.toString().toLowerCase().includes(searchQueryMapped)
        );
    
        const matchesStatus =
            statusFilter === "all" || item.status === statusFilter;
    
        const matchesPlaceType =
            placeTypeFilter === "all" || item.placeType === placeTypeFilter;
    
        return matchesSearch && matchesStatus && matchesPlaceType;
    });
    
    const activeData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handleViewDetails = (request: Request) => {
        setSelectedRequest(request);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedRequest(null);
    };

    const handleApprove = async (request: Request) => {
        try {
            const response = await fetch(`/api/request/update/${request._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...request,
                    status: "approved",
                }),
            });

            if (response.ok) {
                setRequests((prev) =>
                    prev.map((r) =>
                        r._id === request._id ? { ...r, status: "approved" } : r
                    )
                );
                alert(t("Admin.ApprovedSuccess"));
            } else {
                console.error("Failed to approve the request.");
            }
        } catch (error) {
            console.error("Error approving the request:", error);
        }
    };

    const handleReject = async (request: Request) => {
        try {
            const response = await fetch(`/api/request/update/${request._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...request,
                    status: "rejected",
                }),
            });

            if (response.ok) {
                setRequests((prev) =>
                    prev.map((r) =>
                        r._id === request._id ? { ...r, status: "rejected" } : r
                    )
                );
                alert(t("Admin.RejectedSuccess"));
            } else {
                console.error("Failed to reject the request.");
            }
        } catch (error) {
            console.error("Error rejecting the request:", error);
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            {/* Filters */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-4">
                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="kanit px-4 py-2 border border-gray-300 rounded-lg"
                    >
                        <option value="all">{t("Admin.AllStatus")}</option>
                        <option value="waiting">{t("Admin.Waiting")}</option>
                        <option value="approved">{t("Admin.Approved")}</option>
                        <option value="rejected">{t("Admin.Rejected")}</option>
                    </select>

                    {/* Place Type Filter */}
                    <select
                        value={placeTypeFilter}
                        onChange={(e) => setPlaceTypeFilter(e.target.value)}
                        className="kanit px-4 py-2 border border-gray-300 rounded-lg"
                    >
                        <option value="all">{t("Admin.AllCategories")}</option>
                        <option value="attraction">{t("Admin.Attraction")}</option>
                        <option value="accommodation">{t("Admin.Accommodation")}</option>
                        <option value="restaurant">{t("Admin.Restaurant")}</option>
                    </select>
                </div>

                {/* Search Field */}
                <input
                    type="text"
                    placeholder={t("Admin.Search")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="kanit px-4 py-2 border border-gray-300 rounded-lg"
                />
            </div>


            {/* Table */}
            <table className="table-fixed border-collapse border border-gray-300 w-full text-left">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="kanit px-4 py-2 border-b border-r w-[16%]">{t("Admin.Date")}</th>
                        <th className="kanit px-4 py-2 border-b border-r w-[20%]">{t("Admin.PlaceName")}</th>
                        <th className="kanit px-4 py-2 border-b border-r w-[15%]">{t("Admin.RequestType")}</th>
                        <th className="kanit px-4 py-2 border-b border-r w-[12%]">{t("Admin.Status")}</th>
                        <th className="kanit px-4 py-2 border-b text-center w-[30%]">{t("Admin.Actions")}</th>
                    </tr>
                </thead>
                <tbody>
                    {activeData.map((request) => (
                        <tr key={request._id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 border-b border-r truncate kanit">
                                {format(new Date(request.date), "dd/MM/yyyy HH:mm")}
                            </td>
                            <td className="px-4 py-2 border-b border-r truncate kanit">
                                {request.details?.name || t("Admin.Unknown")}
                            </td>
                            <td className="px-4 py-2 border-b border-r truncate kanit">{translateType(request.type)}</td>
                            <td className="px-4 py-2 border-b border-r truncate kanit">{translateStatus(request.status)}</td>
                            <td className="px-4 py-2 border-b text-center">
                                <div className="flex justify-center items-center space-x-2">
                                    <button
                                        onClick={() => handleViewDetails(request)}
                                        className="kanit px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                    >
                                        {t("Admin.View")}
                                    </button>
                                    {request.status === "waiting" && (
                                        <>
                                            <button
                                                onClick={() => {
                                                    Swal.fire({
                                                        title: t("Admin.ConfirmApprove"),
                                                        text: t("Admin.AreYouSureApprove"),
                                                        icon: "warning",
                                                        showCancelButton: true,
                                                        confirmButtonColor: "#3085d6",
                                                        cancelButtonColor: "#d33",
                                                        confirmButtonText: t("Admin.YesApprove"),
                                                        cancelButtonText: t("Admin.Cancel"),
                                                        customClass: {
                                                            title: "kanit",
                                                            popup: "kanit",
                                                            confirmButton: "kanit",
                                                            cancelButton: "kanit",
                                                          },
                                                    }).then(async (result) => {
                                                        if (result.isConfirmed) {
                                                            await handleApprove(request);
                                                            Swal.fire(
                                                                t("Admin.Approved"),
                                                                t("Admin.RequestApprovedSuccessfully"),
                                                                "success"
                                                            );
                                                        }
                                                    });
                                                }}
                                                className="kanit px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                            >
                                                {t("Admin.Approve")}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    Swal.fire({
                                                        title: t("Admin.ConfirmReject"),
                                                        text: t("Admin.AreYouSureReject"),
                                                        icon: "warning",
                                                        showCancelButton: true,
                                                        confirmButtonColor: "#3085d6",
                                                        cancelButtonColor: "#d33",
                                                        confirmButtonText: t("Admin.YesReject"),
                                                        cancelButtonText: t("Admin.Cancel"),
                                                        customClass: {
                                                            title: "kanit",
                                                            popup: "kanit",
                                                            confirmButton: "kanit",
                                                            cancelButton: "kanit",
                                                          },
                                                    }).then(async (result) => {
                                                        if (result.isConfirmed) {
                                                            await handleReject(request);
                                                            Swal.fire(
                                                                t("Admin.Rejected"),
                                                                t("Admin.RequestRejectedSuccessfully"),
                                                                "success"
                                                            );
                                                        }
                                                    });
                                                }}
                                                className="kanit px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                            >
                                                {t("Admin.Reject")}
                                            </button>
                                        </>
                                    )}

                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-end items-center mt-4">
                {/* Previous Button */}
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                    disabled={currentPage === 1}
                >
                    &lt;
                </button>

                {/* Pagination Numbers */}
                <div className="flex space-x-2 mx-4">
                    {currentPage > Math.ceil(maxPageNumbersToShow / 2) && (
                        <>
                            <button
                                onClick={() => setCurrentPage(1)}
                                className="kanit px-4 py-2 border rounded-lg"
                            >
                                1
                            </button>
                            <span>...</span>
                        </>
                    )}

                    {Array.from({ length: Math.min(maxPageNumbersToShow, totalPages) }, (_, i) => {
                        const page = Math.max(1, currentPage - Math.floor(maxPageNumbersToShow / 2)) + i;
                        if (page <= totalPages) {
                            return (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`kanit px-4 py-2 border rounded-lg ${currentPage === page ? "bg-gray-500 text-white" : ""
                                        }`}
                                >
                                    {page}
                                </button>
                            );
                        }
                        return null;
                    })}

                    {currentPage < totalPages - Math.floor(maxPageNumbersToShow / 2) && (
                        <>
                            <span>...</span>
                            <button
                                onClick={() => setCurrentPage(totalPages)}
                                className="kanit px-4 py-2 border rounded-lg"
                            >
                                {totalPages}
                            </button>
                        </>
                    )}
                </div>

                {/* Next Button */}
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                    disabled={currentPage === totalPages}
                >
                    &gt;
                </button>
            </div>


            {showModal && selectedRequest && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[800px] h-[600px] flex flex-col">
                        <h2 className="kanit text-xl font-bold mb-4">{t("Admin.RequestDetails")}</h2>
                        <div className="overflow-y-auto flex-1 space-y-4">

                            {/* Requested By */}
                            <div className="border p-4 rounded">
                                <p className="kanit font-bold">{t("Admin.RequestedBy")}</p>
                                <p>
                                    <span className="font-semibold">{t("Admin.UserID")}: </span>
                                    {selectedRequest.userId._id}
                                </p>
                                <p>
                                    <span className="font-semibold">{t("Admin.Username")}: </span>
                                    {selectedRequest.userId.username}
                                </p>
                                <p>
                                    <span className="font-semibold">{t("Admin.DisplayName")}: </span>
                                    {selectedRequest.userId.displayName}
                                </p>
                                <p>
                                    <span className="font-semibold">{t("Admin.Email")}: </span>
                                    {selectedRequest.userId.email}
                                </p>
                            </div>

                            {/* Type */}
                            <div className="border p-4 rounded">
                                <p className="kanit font-bold">{t("Admin.RequestType")}</p>
                                <p>{selectedRequest.type === "add" ? t("Admin.AddPlace") : t("Admin.EditPlace")}</p>
                            </div>

                            {/* Place Type */}
                            <div className="border p-4 rounded">
                                <p className="kanit font-bold">{t("Admin.PlaceType")}</p>
                                <p>
                                    {selectedRequest.placeType === "attraction"
                                        ? t("Admin.Attraction")
                                        : selectedRequest.placeType === "accommodation"
                                            ? t("Admin.Accommodation")
                                            : t("Admin.Restaurant")}
                                </p>
                            </div>

                            {/* Status */}
                            <div className="border p-4 rounded">
                                <p className="kanit font-bold">{t("Admin.Status")}</p>
                                <p>
                                    {selectedRequest.status === "waiting"
                                        ? t("Admin.Waiting")
                                        : selectedRequest.status === "approved"
                                            ? t("Admin.Approved")
                                            : t("Admin.Rejected")}
                                </p>
                            </div>

                            {/* Render Details */}
                            {Object.entries(selectedRequest.details).map(([key, value]) => (
                                <div key={key} className="border p-4 rounded">
                                    <p className="kanit font-bold">{t(`Admin.${key}`)}</p>

                                    {key === "imgPath" && Array.isArray(value) ? (
                                        value.map((img, index) => (
                                            <div
                                                key={index}
                                                className="relative w-full h-64 bg-gray-200 border border-gray-300 rounded-lg overflow-hidden my-2"
                                            >
                                                <img
                                                    src={img}
                                                    alt={`Preview ${index}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ))
                                    ) : Array.isArray(value) ? (
                                        <ul className="list-disc list-inside">
                                            {value.map((item, idx) =>
                                                typeof item === "object" ? (
                                                    <li key={idx} className="pl-4">
                                                        {Object.entries(item).map(([subKey, subValue]) => (
                                                            <div key={subKey} className="text-sm">
                                                                <span className="font-semibold">{t(`Admin.${subKey}`)}: </span>
                                                                {typeof subValue === "object" ? JSON.stringify(subValue) : String(subValue)}
                                                            </div>
                                                        ))}
                                                    </li>
                                                ) : (
                                                    <li key={idx}>{item}</li>
                                                )
                                            )}
                                        </ul>
                                    ) : typeof value === "object" ? (
                                        <div className="pl-4">
                                            {Object.entries(value).map(([subKey, subValue]) => (
                                                <div key={subKey} className="text-sm">
                                                    <span className="font-semibold">{t(`Admin.${subKey}`)}: </span>
                                                    {typeof subValue === "object" ? JSON.stringify(subValue) : String(subValue)}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>{value}</p>
                                    )}
                                </div>
                            ))}

                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={closeModal}
                                className="kanit px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                            >
                                {t("Admin.Close")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RequestManagementTable;
