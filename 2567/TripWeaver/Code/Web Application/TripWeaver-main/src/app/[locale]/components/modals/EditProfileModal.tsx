import React, { useState, useEffect, FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    userData: {
        id: string;
        firstName?: string;
        lastName?: string;
        displayName?: string;
        email?: string;
        imgPath?: string;
    };
    onProfileUpdated: (updatedData: any) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, userData, onProfileUpdated }) => {
    const t = useTranslations();
    const { data: session } = useSession();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        displayName: "",
        email: "",
        imgPath: "",
    });

    // Initialize form data when modal opens
    useEffect(() => {
        if (userData) {
            setFormData({
                firstName: userData.firstName || "",
                lastName: userData.lastName || "",
                displayName: userData.displayName || "",
                email: userData.email || "",
                imgPath: userData.imgPath || "/images/no-img.png",
            });
        }
    }, [userData]);

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/user/update/${session?.user?.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                onProfileUpdated(updatedUser);
                onClose();
            } else {
                console.error("Failed to update profile.");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h2 className="kanit text-xl font-semibold mb-4">{t('EditProfile')}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            name="firstName"
                            placeholder={t('FirstName')}
                            value={formData.firstName}
                            onChange={handleChange}
                            className="kanit w-full p-2 border rounded"
                        />
                        <input
                            type="text"
                            name="lastName"
                            placeholder={t('LastName')}
                            value={formData.lastName}
                            onChange={handleChange}
                            className="kanit w-full p-2 border rounded"
                        />
                        <input
                            type="text"
                            name="displayName"
                            placeholder={t('DisplayName')}
                            value={formData.displayName}
                            onChange={handleChange}
                            className="kanit w-full p-2 border rounded"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder={t('Email')}
                            value={formData.email}
                            onChange={handleChange}
                            className="kanit w-full p-2 border rounded"
                            required
                        />
                        <div className="flex justify-between items-center">
                            <button
                                onClick={onClose}
                                className="kanit bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400 w-32"
                            >
                                {t('Cancel')}
                            </button>
                            <button
                                type="submit"
                                className="kanit bg-blue-600 text-white p-2 rounded hover:bg-blue-500 w-32"
                            >
                                {t('SaveChanges')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
};

export default EditProfileModal;
