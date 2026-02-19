"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useTranslations } from "next-intl";
import NavBar from "../components/NavBar";
import UserManagementTable from "../components/UserManagementTable";
import PlaceManagementTable from "../components/PlaceManagementTable";
import RequestManagementTable from "../components/RequestManagementTable";

const fetchUserData = async () => {
    try {
        const response = await fetch("/api/user/getAllUser");
        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching user data:", error);
        return [];
    }
};

const AdminPage = () => {
    const t = useTranslations();
    const [activeMenu, setActiveMenu] = useState("users");
    const [userData, setUserData] = useState<any[]>([]);
    const { data: session, status } = useSession();

    useEffect(() => {
        const getData = async () => {
            const data = await fetchUserData();
            setUserData(data);
        };
        getData();
    }, []);

    if (status === "unauthenticated") {
        redirect("/login");
    }

    if (status === "authenticated" && (session?.user as { role?: string })?.role !== "admin") {
        redirect("/");
    }

    if (status === "loading") {
        return;
    }

    const renderContent = () => {
        if (activeMenu === "users") {
            return (
                <UserManagementTable
                    userData={userData}
                    setUserData={setUserData}
                    t={t}
                    fetchUserData={fetchUserData}
                />
            );
        }
        if (activeMenu === "places") {
            return <PlaceManagementTable t={t} />;
        }
        if (activeMenu === "requests") {
            return <RequestManagementTable t={t} />;
        }
        return <div className="kanit">{t("Admin.NoData")}</div>;
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <NavBar />
            <div className="max-w-5xl mx-auto mt-8 p-4 bg-gray-50 shadow-md rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <select
                        value={activeMenu}
                        onChange={(e) => setActiveMenu(e.target.value)}
                        className="kanit px-4 py-2 border border-gray-300 rounded-lg"
                    >
                        <option value="users">{t("Admin.Users")}</option>
                        <option value="places">{t("Admin.Places")}</option>
                        <option value="requests">{t("Admin.Requests")}</option>
                    </select>
                </div>
                <div>{renderContent()}</div>
            </div>
        </div>
    );
};

export default AdminPage;
