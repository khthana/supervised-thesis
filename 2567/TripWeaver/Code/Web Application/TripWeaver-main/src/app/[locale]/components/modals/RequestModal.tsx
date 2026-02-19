import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

type Province = {
    _id: string;
    name: string;
    idRef?: string;
};

type District = {
    _id: string;
    name: string;
    idRef?: string;
};

type SubDistrict = {
    _id: string;
    name: string;
    idRef?: string;
};

type Location = {
    address: string;
    province: string;
    district: string;
    subDistrict: string;
    province_code: string;
    district_code: string;
    sub_district_code: string;
};

export type PlaceFormData = {
    name: string;
    type: string[];
    description: string;
    latitude: string;
    longitude: string;
    imgPath: string[];
    phone: string | string[];
    website: string;
    openingHour: { day: string; openingHour: string }[];
    facility: string[];
    priceRange: string;
    star: string;
    tag: string[];
    location: Location;
};

type RequestModalProps = {
    isOpen: boolean;
    onClose: () => void;
    placeType: "attraction" | "restaurant" | "accommodation";
    userId: string;
    placeId?: string;
    requestType?: string;
    t: (key: string) => string;
    onSuccess?: () => void;
};

const RequestModal: React.FC<RequestModalProps> = ({
    isOpen,
    onClose,
    placeType,
    userId,
    placeId,
    requestType = "edit",
    t,
    onSuccess,
}) => {
    const initialFormData: PlaceFormData = {
        name: "",
        type: [""],
        description: "",
        latitude: "",
        longitude: "",
        imgPath: [""],
        phone: placeType === "attraction" ? "" : [""],
        website: "",
        openingHour: [{ day: "", openingHour: "" }],
        facility: [""],
        priceRange: "",
        star: "",
        tag: [""],
        location: {
            address: "",
            province: "",
            district: "",
            subDistrict: "",
            province_code: "",
            district_code: "",
            sub_district_code: "",
        },
    };

    const [formData, setFormData] = useState<PlaceFormData>(initialFormData);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [subDistricts, setSubDistricts] = useState<SubDistrict[]>([]);

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await fetch("/api/province/listProvince", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({}),
                });
                if (response.ok) {
                    const data = await response.json();
                    setProvinces(data.provinces);
                } else {
                    console.error("Failed to fetch provinces");
                }
            } catch (error) {
                console.error("Error fetching provinces:", error);
            }
        };
        fetchProvinces();
    }, []);

    useEffect(() => {
        if (isOpen && placeId && requestType === "edit") {
            const fetchPlaceDetails = async () => {
                try {
                    let endpoint = "";
                    if (placeType === "attraction") {
                        endpoint = `/api/attraction/getAttraction/${placeId}`;
                    } else if (placeType === "restaurant") {
                        endpoint = `/api/restaurant/getRestaurant/${placeId}`;
                    } else if (placeType === "accommodation") {
                        endpoint = `/api/accommodation/getAccommodation/${placeId}`;
                    }

                    const res = await fetch(endpoint, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    if (res.ok) {
                        const responseData = await res.json();
                        let data;
                        if (placeType === "attraction") {
                            data = responseData.attraction;
                        } else if (placeType === "restaurant") {
                            data = responseData.restaurant;
                        } else if (placeType === "accommodation") {
                            data = responseData.accommodation;
                        } else {
                            data = responseData;
                        }

                        console.log("Fetched place data:", data);

                        setFormData({
                            name: data.name || "",
                            type: data.type || [""],
                            description: data.description || "",
                            latitude: data.latitude ? String(data.latitude) : "",
                            longitude: data.longitude ? String(data.longitude) : "",
                            imgPath: data.imgPath || [""],
                            phone: data.phone || (placeType === "attraction" ? "" : [""]),
                            website: data.website || "",
                            openingHour: data.openingHour || [{ day: "", openingHour: "" }],
                            facility: data.facility || [""],
                            priceRange: data.priceRange || "",
                            star: data.star ? String(data.star) : "",
                            tag: data.tag || [""],
                            location: data.location || {
                                address: "",
                                province: "",
                                district: "",
                                subDistrict: "",
                                province_code: "",
                                district_code: "",
                                sub_district_code: "",
                            },
                        });
                    } else {
                        console.error("Failed to fetch place details");
                    }
                } catch (error) {
                    console.error("Error fetching place details:", error);
                }
            };

            fetchPlaceDetails();
        }
    }, [isOpen, placeId, placeType]);

    useEffect(() => {
        if (formData.location.province) {
            const fetchDistricts = async () => {
                try {
                    const response = await fetch("/api/province/listDistrict", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ provinceName: formData.location.province }),
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setDistricts(data.districts || []);
                    } else {
                        console.error("Failed to fetch districts");
                    }
                } catch (error) {
                    console.error("Error fetching districts:", error);
                }
            };
            fetchDistricts();
        }
    }, [formData.location.province]);

    useEffect(() => {
        if (formData.location.district) {
            const fetchSubDistricts = async () => {
                try {
                    const response = await fetch("/api/province/listSubDistrict", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            DistrictName: formData.location.district,
                            DistrictID: formData.location.district_code,
                        }),
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setSubDistricts(data.subDistricts || []);
                    } else {
                        console.error("Failed to fetch subdistricts");
                    }
                } catch (error) {
                    console.error("Error fetching subdistricts:", error);
                }
            };
            fetchSubDistricts();
        }
    }, [formData.location.district, formData.location.district_code]);

    const handleProvinceChange = async (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const selectedProvinceName = e.target.value;
        const selectedProvince = provinces.find(
            (p) => p.name === selectedProvinceName
        );
        setFormData((prev) => ({
            ...prev,
            location: {
                ...prev.location,
                province: selectedProvinceName,
                province_code: selectedProvince?.idRef || "",
                district: "",
                district_code: "",
                subDistrict: "",
                sub_district_code: "",
                address: selectedProvinceName,
            },
        }));

        if (selectedProvinceName) {
            try {
                const response = await fetch("/api/province/listDistrict", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ provinceName: selectedProvinceName }),
                });
                if (response.ok) {
                    const data = await response.json();
                    setDistricts(data.districts || []);
                    setSubDistricts([]);
                } else {
                    console.error("Failed to fetch districts");
                    setDistricts([]);
                }
            } catch (error) {
                console.error("Error fetching districts:", error);
                setDistricts([]);
            }
        }
    };

    const handleDistrictChange = async (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const selectedDistrictName = e.target.value;
        const selectedDistrict = districts.find(
            (d) => d.name === selectedDistrictName
        );
        setFormData((prev) => ({
            ...prev,
            location: {
                ...prev.location,
                district: selectedDistrictName,
                district_code: selectedDistrict?.idRef || "",
                subDistrict: "",
                sub_district_code: "",
                address: `${prev.location.province}, ${selectedDistrictName}`,
            },
        }));

        if (selectedDistrictName) {
            try {
                const response = await fetch("/api/province/listSubDistrict", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        DistrictName: selectedDistrictName,
                        DistrictID: selectedDistrict?.idRef,
                    }),
                });
                if (response.ok) {
                    const data = await response.json();
                    setSubDistricts(data.subDistricts || []);
                } else {
                    console.error("Failed to fetch subdistricts");
                    setSubDistricts([]);
                }
            } catch (error) {
                console.error("Error fetching subdistricts:", error);
                setSubDistricts([]);
            }
        }
    };

    const handleSubDistrictChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const selectedSubDistrictName = e.target.value;
        const selectedSubDistrict = subDistricts.find(
            (s) => s.name === selectedSubDistrictName
        );
        setFormData((prev) => ({
            ...prev,
            location: {
                ...prev.location,
                subDistrict: selectedSubDistrictName,
                sub_district_code: selectedSubDistrict?.idRef || "",
                address: `${prev.location.province}, ${prev.location.district}, ${selectedSubDistrictName}`,
            },
        }));
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const submissionData = {
            ...formData,
            phone:
                placeType === "attraction"
                    ? formData.phone
                    : (Array.isArray(formData.phone)
                        ? formData.phone.filter(Boolean)
                        : formData.phone),
        };

        let cleanedDetails: Partial<PlaceFormData> = { ...submissionData };

        if (placeType === "attraction") {
            delete cleanedDetails.facility;
            delete cleanedDetails.priceRange;
            delete cleanedDetails.star;
            delete cleanedDetails.tag;
        } else if (placeType === "accommodation") {
            delete cleanedDetails.priceRange;
        } else if (placeType === "restaurant") {
            delete cleanedDetails.star;
            delete cleanedDetails.tag;
        }

        const payload = {
            type: requestType,
            placeType,
            placeId,
            userId,
            details: cleanedDetails,
        };

        try {
            const response = await fetch("/api/request/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                Swal.fire({
                    title: "เสนอให้แก้ไขข้อมูล",
                    text: "ส่งคำขอเรียบร้อยแล้ว",
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
                setFormData(initialFormData);
                onClose();
                if (onSuccess) onSuccess();
            } else {
                Swal.fire({
                    title: "เกิดข้อผิดพลาด",
                    text: "ส่งคำขอไม่สำเร็จ",
                    icon: "error",
                    confirmButtonText: "โอเค",
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
            console.error("Error submitting form:", error);
        }
    };



    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] max-h-[90vh] overflow-y-auto">
                <h2 className="kanit text-xl font-bold mb-4">{t("EditInfo")}</h2>
                <form onSubmit={handleFormSubmit}>
                    {/* Place Name */}
                    <div className="mb-4">
                        <label className="block kanit">{t("PlaceName")}</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="kanit px-4 py-2 border border-gray-300 rounded-lg w-full"
                        />
                    </div>

                    {/* Place Type */}
                    <div className="mb-4">
                        <label className="block kanit">{t("PlaceType")}</label>
                        {formData.type?.map((typeItem, index) => (
                            <div key={index} className="flex items-center space-x-4 mb-2">
                                <input
                                    type="text"
                                    value={typeItem}
                                    onChange={(e) => {
                                        const updatedTypes = [...formData.type];
                                        updatedTypes[index] = e.target.value;
                                        setFormData({ ...formData, type: updatedTypes });
                                    }}
                                    className="kanit px-4 py-2 border border-gray-300 rounded-lg w-full"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setFormData({
                                            ...formData,
                                            type: formData.type.filter((_, i) => i !== index),
                                        })
                                    }
                                    className="kanit text-red-500"
                                >
                                    {t("Remove")}
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() =>
                                setFormData({ ...formData, type: [...formData.type, ""] })
                            }
                            className="kanit px-4 py-2 bg-blue-500 text-white rounded-lg"
                        >
                            {t("AddType")}
                        </button>
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                        <label className="block kanit">{t("Description")}</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="kanit px-4 py-2 border border-gray-300 rounded-lg w-full"
                        />
                    </div>

                    {/* Latitude */}
                    <div className="mb-4">
                        <label className="block kanit">{t("Latitude")}</label>
                        <input
                            type="number"
                            name="latitude"
                            value={formData.latitude}
                            onChange={handleInputChange}
                            required
                            className="kanit px-4 py-2 border border-gray-300 rounded-lg w-full"
                        />
                    </div>

                    {/* Longitude */}
                    <div className="mb-4">
                        <label className="block kanit">{t("Longitude")}</label>
                        <input
                            type="number"
                            name="longitude"
                            value={formData.longitude}
                            onChange={handleInputChange}
                            required
                            className="kanit px-4 py-2 border border-gray-300 rounded-lg w-full"
                        />
                    </div>

                    {/* Province */}
                    <div className="mb-4">
                        <label className="block kanit">{t("Province")}</label>
                        <select
                            value={formData.location.province}
                            onChange={handleProvinceChange}
                            className="kanit px-4 py-2 border border-gray-300 rounded-lg w-full"
                        >
                            <option value="">{t("SelectProvince")}</option>
                            {provinces.map((province) => (
                                <option key={province._id} value={province.name}>
                                    {province.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* District */}
                    <div className="mb-4">
                        <label className="block kanit">{t("District")}</label>
                        <select
                            value={formData.location.district}
                            onChange={handleDistrictChange}
                            className="kanit px-4 py-2 border border-gray-300 rounded-lg w-full"
                        >
                            <option value="">{t("SelectDistrict")}</option>
                            {districts.map((district) => (
                                <option key={district._id} value={district.name}>
                                    {district.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* SubDistrict */}
                    <div className="mb-4">
                        <label className="block kanit">{t("SubDistrict")}</label>
                        <select
                            value={formData.location.subDistrict}
                            onChange={handleSubDistrictChange}
                            className="kanit px-4 py-2 border border-gray-300 rounded-lg w-full"
                        >
                            <option value="">{t("SelectSubDistrict")}</option>
                            {subDistricts.map((sub) => (
                                <option key={sub._id} value={sub.name}>
                                    {sub.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Phone */}
                    <div className="mb-4">
                        <label className="block kanit">{t("Phone")}</label>
                        {placeType === "attraction" ? (
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone as string}
                                onChange={(e) =>
                                    setFormData({ ...formData, phone: e.target.value })
                                }
                                className="kanit px-4 py-2 border border-gray-300 rounded-lg w-full"
                            />
                        ) : (
                            <>
                                {(formData.phone as string[])?.map((phone, index) => (
                                    <div key={index} className="flex items-center space-x-4 mb-2">
                                        <input
                                            type="text"
                                            value={phone}
                                            onChange={(e) => {
                                                const updatedPhones = [...(formData.phone as string[])];
                                                updatedPhones[index] = e.target.value;
                                                setFormData({ ...formData, phone: updatedPhones });
                                            }}
                                            className="kanit px-4 py-2 border border-gray-300 rounded-lg w-full"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setFormData({
                                                    ...formData,
                                                    phone: (formData.phone as string[]).filter(
                                                        (_, i) => i !== index
                                                    ),
                                                })
                                            }
                                            className="kanit text-red-500"
                                        >
                                            {t("Remove")}
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() =>
                                        setFormData({
                                            ...formData,
                                            phone: [...(formData.phone as string[]), ""],
                                        })
                                    }
                                    className="kanit px-4 py-2 bg-blue-500 text-white rounded-lg"
                                >
                                    {t("AddPhone")}
                                </button>
                            </>
                        )}
                    </div>

                    {/* Website */}
                    <div className="mb-4">
                        <label className="block kanit">{t("Website")}</label>
                        <input
                            type="text"
                            name="website"
                            value={formData.website}
                            onChange={handleInputChange}
                            className="kanit px-4 py-2 border border-gray-300 rounded-lg w-full"
                        />
                    </div>

                    {/* Images */}
                    <div className="mb-4">
                        <label className="block kanit">{t("Images")}</label>
                        {formData.imgPath?.map((img, index) => (
                            <div key={index} className="mb-4">
                                <input
                                    type="text"
                                    value={img}
                                    onChange={(e) => {
                                        const updatedImages = [...formData.imgPath];
                                        updatedImages[index] = e.target.value;
                                        setFormData({ ...formData, imgPath: updatedImages });
                                    }}
                                    className="kanit px-4 py-2 border border-gray-300 rounded-lg w-full mb-2"
                                    placeholder={t("ImageURL")}
                                />
                                <div className="relative w-96 h-48 bg-gray-200 border border-gray-300 rounded-lg overflow-hidden">
                                    {img ? (
                                        <img
                                            src={img}
                                            alt={`Preview ${index}`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="flex items-center justify-center h-full text-gray-400 kanit">
                                            {t("ImagePreview")}
                                        </span>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setFormData({
                                            ...formData,
                                            imgPath: formData.imgPath.filter((_, i) => i !== index),
                                        })
                                    }
                                    className="kanit mt-2 px-4 py-2 bg-red-500 text-white rounded-lg"
                                >
                                    {t("RemoveImage")}
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() =>
                                setFormData({ ...formData, imgPath: [...formData.imgPath, ""] })
                            }
                            className="kanit px-4 py-2 bg-blue-500 text-white rounded-lg"
                        >
                            {t("AddImage")}
                        </button>
                    </div>

                    {/* Opening Hours (not used for accommodations) */}
                    {placeType !== "accommodation" && (
                        <div className="mb-4">
                            <label className="block kanit">{t("OpeningHours")}</label>
                            {formData.openingHour?.map((hour, index) => (
                                <div key={index} className="flex items-center space-x-4 mb-2">
                                    <input
                                        type="text"
                                        placeholder={t("Day")}
                                        value={hour.day}
                                        onChange={(e) => {
                                            const updatedHours = [...formData.openingHour];
                                            updatedHours[index].day = e.target.value;
                                            setFormData({ ...formData, openingHour: updatedHours });
                                        }}
                                        className="kanit px-4 py-2 border border-gray-300 rounded-lg"
                                    />
                                    <input
                                        type="text"
                                        placeholder={t("OpeningHours")}
                                        value={hour.openingHour}
                                        onChange={(e) => {
                                            const updatedHours = [...formData.openingHour];
                                            updatedHours[index].openingHour = e.target.value;
                                            setFormData({ ...formData, openingHour: updatedHours });
                                        }}
                                        className="kanit px-4 py-2 border border-gray-300 rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setFormData({
                                                ...formData,
                                                openingHour: formData.openingHour.filter(
                                                    (_, i) => i !== index
                                                ),
                                            })
                                        }
                                        className="kanit text-red-500"
                                    >
                                        {t("Remove")}
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() =>
                                    setFormData({
                                        ...formData,
                                        openingHour: [
                                            ...formData.openingHour,
                                            { day: "", openingHour: "" },
                                        ],
                                    })
                                }
                                className="kanit px-4 py-2 bg-blue-500 text-white rounded-lg"
                            >
                                {t("AddOpeningHour")}
                            </button>
                        </div>
                    )}

                    {/* Price Range (for restaurants) */}
                    {placeType === "restaurant" && (
                        <div className="mb-4">
                            <label className="block kanit">{t("PriceRange")}</label>
                            <input
                                type="text"
                                name="priceRange"
                                value={formData.priceRange}
                                onChange={handleInputChange}
                                className="kanit px-4 py-2 border border-gray-300 rounded-lg w-full"
                            />
                        </div>
                    )}

                    {/* Facilities (for restaurants and accommodations) */}
                    {(placeType === "restaurant" || placeType === "accommodation") && (
                        <div className="mb-4">
                            <label className="block kanit">{t("Facility")}</label>
                            {formData.facility?.map((fac, index) => (
                                <div key={index} className="flex items-center space-x-4 mb-2">
                                    <input
                                        type="text"
                                        value={fac}
                                        onChange={(e) => {
                                            const updatedFacilities = [...formData.facility];
                                            updatedFacilities[index] = e.target.value;
                                            setFormData({ ...formData, facility: updatedFacilities });
                                        }}
                                        className="kanit px-4 py-2 border border-gray-300 rounded-lg w-full"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setFormData({
                                                ...formData,
                                                facility: formData.facility.filter((_, i) => i !== index),
                                            })
                                        }
                                        className="kanit text-red-500"
                                    >
                                        {t("Remove")}
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() =>
                                    setFormData({
                                        ...formData,
                                        facility: [...formData.facility, ""],
                                    })
                                }
                                className="kanit px-4 py-2 bg-blue-500 text-white rounded-lg"
                            >
                                {t("AddFacility")}
                            </button>
                        </div>
                    )}

                    {/* For accommodations, show star rating and tags */}
                    {placeType === "accommodation" && (
                        <>
                            <div className="mb-4">
                                <label className="block kanit">{t("StarRating")}</label>
                                <input
                                    type="number"
                                    name="star"
                                    value={formData.star}
                                    onChange={handleInputChange}
                                    className="kanit px-4 py-2 border border-gray-300 rounded-lg w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block kanit">{t("Tag")}</label>
                                {formData.tag?.map((tag, index) => (
                                    <div key={index} className="flex items-center space-x-4 mb-2">
                                        <input
                                            type="text"
                                            value={tag}
                                            onChange={(e) => {
                                                const updatedTags = [...formData.tag];
                                                updatedTags[index] = e.target.value;
                                                setFormData({ ...formData, tag: updatedTags });
                                            }}
                                            className="kanit px-4 py-2 border border-gray-300 rounded-lg w-full"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setFormData({
                                                    ...formData,
                                                    tag: formData.tag.filter((_, i) => i !== index),
                                                })
                                            }
                                            className="kanit text-red-500"
                                        >
                                            {t("Remove")}
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() =>
                                        setFormData({ ...formData, tag: [...formData.tag, ""] })
                                    }
                                    className="kanit px-4 py-2 bg-blue-500 text-white rounded-lg"
                                >
                                    {t("AddTag")}
                                </button>
                            </div>
                        </>
                    )}

                    {/* Submit and Cancel Buttons */}
                    <div className="flex items-center">
                        <button
                            type="submit"
                            className="kanit px-6 py-2 bg-blue-500 text-white rounded-lg"
                        >
                            {t("Confirm")}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setFormData(initialFormData);
                                onClose();
                            }}
                            className="kanit ml-4 px-6 py-2 bg-gray-500 text-white rounded-lg"
                        >
                            {t("Cancel")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RequestModal;
