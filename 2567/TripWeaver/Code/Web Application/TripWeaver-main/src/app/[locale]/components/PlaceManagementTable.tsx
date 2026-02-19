import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import SearchComponent from "./SearchComponent";

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

type Place = {
    _id: string;
    name: string;
    type: string[];
    description?: string;
    latitude?: string;
    longitude?: string;
    imgPath?: string[];
    phone?: string | string[];
    website?: string;
    openingHour?: { day: string; openingHour: string }[];
    facility?: string[];
    priceRange?: string;
    star?: string;
    tag?: string[];
    rating?: { score: number; ratingCount: number };
    location?: {
        address: string;
        province: string;
        district: string;
        subDistrict: string;
        province_code: string;
        district_code: string;
        sub_district_code: string;
    };
};

type PlaceManagementTableProps = {
    t: (key: string) => string;
};

const PlaceManagementTable: React.FC<PlaceManagementTableProps> = ({ t }) => {
    const [places, setPlaces] = useState<Place[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("attraction");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [subDistricts, setSubDistricts] = useState<SubDistrict[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingPlaceId, setEditingPlaceId] = useState<string | null>(null);
    const [selectedProvince, setSelectedProvince] = useState("ภูเก็ต");

    const handleProvinceSelect = (province: string) => {
        setSelectedProvince(province);
    };

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await fetch(`/api/province/listProvince`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({}),
                });

                if (response.ok) {
                    const data = await response.json();
                    setProvinces(data.provinces);
                } else {
                    console.error("Failed to fetch provinces:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching provinces:", error);
            }
        };

        fetchProvinces();
    }, []);


    const [formData, setFormData] = useState({
        name: "",
        type: [""],
        description: "",
        latitude: "",
        longitude: "",
        imgPath: [""],
        phone: selectedCategory === "attraction" ? "" : [""],
        website: "",
        openingHour: [{ day: "", openingHour: "" }],
        facility: [""],
        priceRange: "",
        star: "",
        tag: [""],
        rating: { score: 0, ratingCount: 0 },
        location: {
            address: "",
            province: "",
            district: "",
            subDistrict: "",
            province_code: "",
            district_code: "",
            sub_district_code: "",
        },
    });

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            phone: selectedCategory === "attraction" ? "" : (Array.isArray(prev.phone) ? prev.phone : [""]),
        }));
    }, [selectedCategory]);
    

    const itemsPerPage = 10;
    const maxPageNumbersToShow = 5;

    const fetchPlaces = async (category: string) => {
        const url = `/api/${category}/getAll`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to fetch places");
            }
            const data = await response.json();
            setPlaces(data);
        } catch (error) {
            console.error("Error fetching places:", error);
        }
    };

    useEffect(() => {
        fetchPlaces(selectedCategory);
    }, [selectedCategory]);

    const filteredData = places.filter(
        (place) =>
            (place.location?.province || "").includes(selectedProvince) &&
            (place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                place.type.some((type) =>
                    type.toLowerCase().includes(searchQuery.toLowerCase())
                ))
    );

    const activeData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const submissionData = {
            ...formData,
            phone: selectedCategory === "attraction" ? formData.phone : (formData.phone as string[]).filter(Boolean),
        };

        try {
            const method = isEditing ? "PUT" : "POST";
            const url = isEditing
                ? `/api/${selectedCategory}/update/${editingPlaceId}`
                : `/api/${selectedCategory}/create`;

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(submissionData),
            });

            if (response.ok) {
                if (isEditing) {
                    await fetchPlaces(selectedCategory);
                } else {
                    const result = await response.json();
                    setPlaces((prev) => [...prev, result]);
                }
                setShowModal(false);
                setIsEditing(false);
                setEditingPlaceId(null);
                Swal.fire({
                    title: t(isEditing ? "Admin.PlaceUpdated" : "Admin.PlaceCreated"),
                    text: t(isEditing ? "Admin.PlaceUpdatedSuccessfully" : "Admin.PlaceCreatedSuccessfully"),
                    icon: "success",
                    confirmButtonText: t("Admin.OK"),
                    customClass: {
                        title: "kanit",
                        popup: "kanit",
                        confirmButton: "kanit",
                        cancelButton: "kanit",
                      },
                });
            } else {
                Swal.fire({
                    title: t("Admin.Error"),
                    text: t(isEditing ? "Admin.FailedToUpdatePlace" : "Admin.FailedToCreatePlace"),
                    icon: "error",
                    confirmButtonText: t("Admin.OK"),
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


    const handleDelete = async (placeId: string) => {
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
                    const response = await fetch(`/api/${selectedCategory}/delete/${placeId}`, {
                        method: "DELETE",
                    });

                    if (response.ok) {
                        Swal.fire({
                            title: t("Admin.PlaceDeleted"),
                            text: t("Admin.PlaceDeletedSuccessfully"),
                            icon: "success",
                            confirmButtonText: t("Admin.OK"),
                            customClass: {
                                title: "kanit",
                                popup: "kanit",
                                confirmButton: "kanit",
                                cancelButton: "kanit",
                              },
                        });
                        setPlaces((prev) => prev.filter((place) => place._id !== placeId));
                    } else {
                        console.error("Failed to delete place");
                    }
                } catch (error) {
                    console.error("Error deleting place:", error);
                }
            }
        });
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center justify-start space-x-4">
                    <select
                        value={selectedCategory}
                        onChange={(e) => {
                            setSelectedCategory(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="kanit px-4 py-2 border border-gray-300 rounded-lg"
                    >
                        <option value="attraction">{t("Admin.Attraction")}</option>
                        <option value="accommodation">{t("Admin.Accommodation")}</option>
                        <option value="restaurant">{t("Admin.Restaurant")}</option>
                    </select>
                    <SearchComponent
                        defaultValue={selectedProvince}
                        onProvinceSelect={handleProvinceSelect}
                    />
                </div>

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
                        {t("Admin.AddNewPlace")}
                    </button>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] max-h-[90vh] overflow-y-auto">
                        <h2 className="kanit text-xl font-bold mb-4">{t("Admin.AddNewPlace")}</h2>
                        <form onSubmit={handleFormSubmit}>
                            {/* Place Name */}
                            <div className="mb-4">
                                <label className="block kanit">{t("Admin.PlaceName")}</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    required
                                    className="kanit px-4 py-2 border border-gray-300 rounded-lg w-full"
                                />
                            </div>

                            {/* Place Type */}
                            <div className="mb-4">
                                <label className="block kanit">{t("Admin.PlaceType")}</label>
                                {formData.type.map((typeItem, index) => (
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
                                            onClick={() => {
                                                setFormData({
                                                    ...formData,
                                                    type: formData.type.filter((_, i) => i !== index),
                                                });
                                            }}
                                            className="kanit text-red-500"
                                        >
                                            {t("Admin.Remove")}
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData({ ...formData, type: [...formData.type, ""] });
                                    }}
                                    className="kanit px-4 py-2 bg-blue-500 text-white rounded-lg"
                                >
                                    {t("Admin.AddType")}
                                </button>
                            </div>


                            {/* Description */}
                            <div className="mb-4">
                                <label className="block kanit">{t("Admin.Description")}</label>
                                <textarea
                                    name="description"
                                    value={formData.description ?? ""}
                                    onChange={handleFormChange}
                                    className="kanit px-4 py-2 border border-gray-300 rounded-lg w-full"
                                />
                            </div>

                            {/* Latitude */}
                            <div className="mb-4">
                                <label className="block kanit">{t("Admin.Latitude")}</label>
                                <input
                                    type="number"
                                    name="latitude"
                                    value={formData.latitude ?? ""}
                                    onChange={handleFormChange}
                                    required
                                    className="kanit px-4 py-2 border border-gray-300 rounded-lg w-full"
                                />
                            </div>

                            {/* Longitude */}
                            <div className="mb-4">
                                <label className="block kanit">{t("Admin.Longitude")}</label>
                                <input
                                    type="number"
                                    name="longitude"
                                    value={formData.longitude ?? ""}
                                    onChange={handleFormChange}
                                    required
                                    className="kanit px-4 py-2 border border-gray-300 rounded-lg w-full"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block kanit">{t("Admin.Province")}</label>
                                <select
                                    value={formData.location.province ?? ""}
                                    onChange={async (e) => {
                                        const selectedProvinceName = e.target.value;
                                        const selectedProvince = provinces.find((p) => (p as Province).name === selectedProvinceName);

                                        setFormData((prev) => ({
                                            ...prev,
                                            location: {
                                                ...prev.location,
                                                province: selectedProvinceName,
                                                province_code: selectedProvince?.idRef ?? "",
                                                district: "",
                                                district_code: "",
                                                subDistrict: "",
                                                sub_district_code: "",
                                                address: selectedProvinceName || "",
                                            },
                                        }));

                                        if (selectedProvince) {
                                            try {
                                                const response = await fetch(`/api/province/listDistrict`, {
                                                    method: "POST",
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                    },
                                                    body: JSON.stringify({ provinceName: selectedProvinceName }),
                                                });

                                                if (response.ok) {
                                                    const data = await response.json();
                                                    setDistricts(data.districts || []);
                                                    setSubDistricts([]);
                                                } else {
                                                    setDistricts([]);
                                                    console.error("Failed to fetch districts");
                                                }
                                            } catch (error) {
                                                console.error("Error fetching districts:", error);
                                                setDistricts([]);
                                            }
                                        } else {
                                            setDistricts([]);
                                            setSubDistricts([]);
                                        }
                                    }}
                                    className="kanit px-4 py-2 border border-gray-300 rounded-lg w-full"
                                >
                                    <option value="">{t("Admin.SelectProvince")}</option>
                                    {provinces.map((province) => (
                                        <option key={province._id} value={province.name}>
                                            {province.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block kanit">{t("Admin.District")}</label>
                                <select
                                    value={formData.location.district ?? ""}
                                    onChange={async (e) => {
                                        const selectedDistrictName = e.target.value;
                                        const selectedDistrict: District | undefined = districts.find(
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
                                                address: `${prev.location.province || ""}, ${selectedDistrictName || ""}`.trim(),
                                            },
                                        }));

                                        if (selectedDistrict) {
                                            try {
                                                const response = await fetch(`/api/province/listSubDistrict`, {
                                                    method: "POST",
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                    },
                                                    body: JSON.stringify({ DistrictName: selectedDistrictName, DistrictID: selectedDistrict.idRef }),
                                                });

                                                if (response.ok) {
                                                    const data = await response.json();
                                                    setSubDistricts(data.subDistricts || []);
                                                } else {
                                                    setSubDistricts([]);
                                                    console.error("Failed to fetch sub-districts");
                                                }
                                            } catch (error) {
                                                console.error("Error fetching sub-districts:", error);
                                                setSubDistricts([]);
                                            }
                                        } else {
                                            setSubDistricts([]);
                                        }
                                    }}
                                    className="kanit px-4 py-2 border border-gray-300 rounded-lg w-full"
                                >
                                    <option value="">{t("Admin.SelectDistrict")}</option>
                                    {districts.map((district) => (
                                        <option key={district._id} value={district.name}>
                                            {district.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block kanit">{t("Admin.SubDistrict")}</label>
                                <select
                                    value={formData.location.subDistrict ?? ""}
                                    onChange={(e) => {
                                        const selectedSubDistrictName = e.target.value;
                                        const selectedSubDistrict = subDistricts.find((s) => s.name === selectedSubDistrictName);

                                        setFormData((prev) => ({
                                            ...prev,
                                            location: {
                                                ...prev.location,
                                                subDistrict: selectedSubDistrictName,
                                                sub_district_code: selectedSubDistrict?.idRef || "",
                                                address: `${prev.location.province || ""}, ${prev.location.district || ""}, ${selectedSubDistrictName || ""}`.trim(),
                                            },
                                        }));
                                    }}
                                    className="kanit px-4 py-2 border border-gray-300 rounded-lg w-full"
                                >
                                    <option value="">{t("Admin.SelectSubDistrict")}</option>
                                    {subDistricts.map((subDistrict) => (
                                        <option key={subDistrict._id} value={subDistrict.name}>
                                            {subDistrict.name}
                                        </option>
                                    ))}
                                </select>
                            </div>


                            {/* Phone */}
                            <div className="mb-4">
                                <label className="block kanit">{t("Admin.Phone")}</label>
                                {selectedCategory === "attraction" ? (
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone as string}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="kanit px-4 py-2 border border-gray-300 rounded-lg w-full"
                                    />
                                ) : (
                                    <>
                                        {(formData.phone as string[]).map((phone, index) => (
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
                                                    onClick={() => {
                                                        setFormData({
                                                            ...formData,
                                                            phone: (formData.phone as string[]).filter((_, i) => i !== index),
                                                        });
                                                    }}
                                                    className="kanit text-red-500"
                                                >
                                                    {t("Admin.Remove")}
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFormData({ ...formData, phone: [...(formData.phone as string[]), ""] });
                                            }}
                                            className="kanit px-4 py-2 bg-blue-500 text-white rounded-lg"
                                        >
                                            {t("Admin.AddPhone")}
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Website */}
                            <div className="mb-4">
                                <label className="block kanit">{t("Admin.Website")}</label>
                                <input
                                    type="text"
                                    name="website"
                                    value={formData.website ?? ""}
                                    onChange={handleFormChange}
                                    className="kanit px-4 py-2 border border-gray-300 rounded-lg w-full"
                                />
                            </div>

                            {/* Images */}
                            <div className="mb-4">
                                <label className="block kanit">{t("Admin.Images")}</label>
                                {formData.imgPath.map((img, index) => (
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
                                            placeholder={t("Admin.ImageURL")}
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
                                                    {t("Admin.ImagePreview")}
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFormData({
                                                    ...formData,
                                                    imgPath: formData.imgPath.filter((_, i) => i !== index),
                                                });
                                            }}
                                            className="kanit mt-2 px-4 py-2 bg-red-500 text-white rounded-lg"
                                        >
                                            {t("Admin.RemoveImage")}
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData({ ...formData, imgPath: [...formData.imgPath, ""] });
                                    }}
                                    className="kanit px-4 py-2 bg-blue-500 text-white rounded-lg"
                                >
                                    {t("Admin.AddImage")}
                                </button>
                            </div>


                            {/* Opening Hours */}
                            {selectedCategory !== "accommodation" && (
                                <div className="mb-4">
                                    <label className="block kanit">{t("Admin.OpeningHours")}</label>
                                    {formData.openingHour.map((hour, index) => (
                                        <div key={index} className="flex items-center space-x-4 mb-2">
                                            <input
                                                type="text"
                                                placeholder={t("Admin.Day")}
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
                                                placeholder={t("Admin.OpeningHours")}
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
                                                onClick={() => {
                                                    setFormData({
                                                        ...formData,
                                                        openingHour: formData.openingHour.filter((_, i) => i !== index),
                                                    });
                                                }}
                                                className="kanit text-red-500"
                                            >
                                                {t("Admin.Remove")}
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormData({
                                                ...formData,
                                                openingHour: [...formData.openingHour, { day: "", openingHour: "" }],
                                            });
                                        }}
                                        className="kanit px-4 py-2 bg-blue-500 text-white rounded-lg"
                                    >
                                        {t("Admin.AddOpeningHour")}
                                    </button>
                                </div>
                            )}

                            {/* Price Range (Restaurant) */}
                            {selectedCategory === "restaurant" && (
                                <div className="mb-4">
                                    <label className="block kanit">{t("Admin.PriceRange")}</label>
                                    <input
                                        type="text"
                                        name="priceRange"
                                        value={formData.priceRange ?? ""}
                                        onChange={handleFormChange}
                                        className="kanit px-4 py-2 border border-gray-300 rounded-lg w-full"
                                    />
                                </div>
                            )}

                            {/* Facilities (Restaurant and Accommodation) */}
                            {(selectedCategory === "restaurant" || selectedCategory === "accommodation") && (
                                <div className="mb-4">
                                    <label className="block kanit">{t("Admin.Facilities")}</label>
                                    {formData.facility.map((facility, index) => (
                                        <div key={index} className="flex items-center space-x-4 mb-2">
                                            <input
                                                type="text"
                                                value={facility}
                                                onChange={(e) => {
                                                    const updatedFacilities = [...formData.facility];
                                                    updatedFacilities[index] = e.target.value;
                                                    setFormData({ ...formData, facility: updatedFacilities });
                                                }}
                                                className="kanit px-4 py-2 border border-gray-300 rounded-lg w-full"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFormData({
                                                        ...formData,
                                                        facility: formData.facility.filter((_, i) => i !== index),
                                                    });
                                                }}
                                                className="kanit text-red-500"
                                            >
                                                {t("Admin.Remove")}
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormData({ ...formData, facility: [...formData.facility, ""] });
                                        }}
                                        className="kanit px-4 py-2 bg-blue-500 text-white rounded-lg"
                                    >
                                        {t("Admin.AddFacility")}
                                    </button>
                                </div>

                            )}

                            {selectedCategory === "accommodation" && (
                                <>
                                    <div className="mb-4">
                                        <label className="block kanit">{t("Admin.StarRating")}</label>
                                        <input
                                            type="number"
                                            name="star"
                                            value={formData.star ?? ""}
                                            onChange={handleFormChange}
                                            className="kanit px-4 py-2 border border-gray-300 rounded-lg w-full"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block kanit">{t("Admin.Tags")}</label>
                                        {formData.tag.map((tag, index) => (
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
                                                    onClick={() => {
                                                        setFormData({
                                                            ...formData,
                                                            tag: formData.tag.filter((_, i) => i !== index),
                                                        });
                                                    }}
                                                    className="kanit text-red-500"
                                                >
                                                    {t("Admin.Remove")}
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFormData({ ...formData, tag: [...formData.tag, ""] });
                                            }}
                                            className="kanit px-4 py-2 bg-blue-500 text-white rounded-lg"
                                        >
                                            {t("Admin.AddTag")}
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* Rating */}
                            <div className="mb-4">
                                <label className="block kanit">{t("Admin.Rating")}</label>
                                <input
                                    type="number"
                                    name="rating"
                                    value={formData.rating.score ?? 0}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            rating: { ...prev.rating, score: Number(e.target.value) },
                                        }))
                                    }
                                    className="kanit px-4 py-2 border border-gray-300 rounded-lg w-full"
                                />
                            </div>

                            {/* Rating Count */}
                            <div className="mb-4">
                                <label className="block kanit">{t("Admin.RatingCount")}</label>
                                <input
                                    type="number"
                                    name="ratingCount"
                                    value={formData.rating.ratingCount ?? 0}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            rating: { ...prev.rating, ratingCount: Number(e.target.value) },
                                        }))
                                    }
                                    className="kanit px-4 py-2 border border-gray-300 rounded-lg w-full"
                                />
                            </div>

                            {/* Submit and Cancel Buttons */}
                            <button
                                type="submit"
                                className="kanit px-6 py-2 bg-blue-500 text-white rounded-lg"
                            >
                                {t("Admin.Confirm")}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowModal(false);
                                    setFormData({
                                        name: "",
                                        type: [""],
                                        description: "",
                                        latitude: "",
                                        longitude: "",
                                        imgPath: [""],
                                        phone: selectedCategory === "attraction" ? "" : [""],
                                        website: "",
                                        openingHour: [{ day: "", openingHour: "" }],
                                        facility: [""],
                                        priceRange: "",
                                        star: "",
                                        tag: [""],
                                        rating: { score: 0, ratingCount: 0 },
                                        location: {
                                            address: "",
                                            province: "",
                                            district: "",
                                            subDistrict: "",
                                            province_code: "",
                                            district_code: "",
                                            sub_district_code: "",
                                        },
                                    });
                                    setIsEditing(false);
                                    setEditingPlaceId(null);
                                }}
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
                        <th className="kanit px-4 py-2 border-b border-r w-[70%]">{t("Admin.Name")}</th>
                        <th className="kanit px-4 py-2 border-b border-r w-[60%]">{t("Admin.Type")}</th>
                        <th className="kanit px-4 py-2 border-b text-center w-[30%]">{t("Admin.Actions")}</th>
                    </tr>
                </thead>
                <tbody>
                    {activeData.length > 0 ? (
                        activeData.map((place) => (
                            <tr key={place._id} className="hover:bg-gray-50">

                                <td className="px-4 py-2 border-b border-r kanit truncate">
                                    {place.name}
                                </td>

                                <td className="px-4 py-2 border-b border-r kanit truncate">
                                    {place.type.join(", ")}
                                </td>

                                <td className="px-4 py-2 border-b text-center">
                                    <div className="flex justify-center space-x-2">
                                        <button
                                            onClick={async () => {
                                                setFormData({
                                                    ...place,
                                                    description: place.description ?? "",
                                                    latitude: place.latitude ?? "",
                                                    longitude: place.longitude ?? "",
                                                    imgPath: place.imgPath ?? [],
                                                    phone: place.phone ?? "",
                                                    website: place.website ?? "",
                                                    openingHour: place.openingHour ?? [],
                                                    facility: place.facility ?? [],
                                                    priceRange: place.priceRange ?? "",
                                                    star: place.star ?? "",
                                                    tag: place.tag ?? [],
                                                    rating: place.rating ?? { score: 0, ratingCount: 0 },
                                                    location: place.location ?? {
                                                        address: "",
                                                        province: "",
                                                        district: "",
                                                        subDistrict: "",
                                                        province_code: "",
                                                        district_code: "",
                                                        sub_district_code: "",
                                                    },
                                                });

                                                setEditingPlaceId(place._id);
                                                setIsEditing(true);

                                                if (place.location?.province) {
                                                    try {
                                                        const districtResponse = await fetch(`/api/province/listDistrict`, {
                                                            method: "POST",
                                                            headers: {
                                                                "Content-Type": "application/json",
                                                            },
                                                            body: JSON.stringify({ provinceName: place.location?.province }),
                                                        });

                                                        if (districtResponse.ok) {
                                                            const districtData = await districtResponse.json();
                                                            setDistricts(districtData.districts || []);
                                                        }
                                                    } catch (error) {
                                                        console.error("Error fetching districts:", error);
                                                    }
                                                }

                                                if (place.location?.district) {
                                                    try {
                                                        const subDistrictResponse = await fetch(`/api/province/listSubDistrict`, {
                                                            method: "POST",
                                                            headers: {
                                                                "Content-Type": "application/json",
                                                            },
                                                            body: JSON.stringify({
                                                                DistrictName: place.location.district,
                                                                DistrictID: place.location.district_code,
                                                            }),
                                                        });

                                                        if (subDistrictResponse.ok) {
                                                            const subDistrictData = await subDistrictResponse.json();
                                                            setSubDistricts(subDistrictData.subDistricts || []);
                                                        }
                                                    } catch (error) {
                                                        console.error("Error fetching subdistricts:", error);
                                                    }
                                                }

                                                setShowModal(true);
                                            }}

                                            className="kanit px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                        >
                                            {t("Admin.Edit")}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(place._id)}
                                            className="kanit px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                        >
                                            {t("Admin.Remove")}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3} className="px-4 py-2 text-center text-gray-500 kanit">
                                ไม่มีข้อมูล
                            </td>
                        </tr>
                    )}
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

        </div>
    );
};

export default PlaceManagementTable;
