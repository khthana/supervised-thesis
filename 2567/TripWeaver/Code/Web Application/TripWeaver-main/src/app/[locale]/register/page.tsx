"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import NavBar from '../components/NavBar';
import { useTranslations } from 'next-intl';
import Swal from 'sweetalert2';
import { signIn, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function Register() {
    const t = useTranslations();
    const { data: session, status } = useSession();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    useEffect(() => {
        if (status === "authenticated") {
          redirect("/");
        }
      }, [status]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { username, email, password, confirmPassword } = formData;

        if (password.length < 8) {
            Swal.fire({
                icon: 'error',
                title: t('Register.errorTitle'),
                text: t('Register.passwordTooShort'),
                confirmButtonText: "โอเค",
                confirmButtonColor: "#2563ea",
                customClass: {
                    title: "kanit",
                    popup: "kanit",
                    confirmButton: "kanit",
                    cancelButton: "kanit",
                  },
            });
            return;
        }
        
        if (password !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: t('Register.errorTitle'),
                text: t('Register.passwordMismatch'),
                confirmButtonText: "โอเค",
                confirmButtonColor: "#2563ea",
                customClass: {
                    title: "kanit",
                    popup: "kanit",
                    confirmButton: "kanit",
                    cancelButton: "kanit",
                  },
            });
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: t('Register.successTitle'),
                    text: t('Register.accountCreated'),
                    confirmButtonText: "โอเค",
                    confirmButtonColor: "#2563ea",
                    customClass: {
                        title: "kanit",
                        popup: "kanit",
                        confirmButton: "kanit",
                        cancelButton: "kanit",
                      },
                }).then(() => {
                    window.location.href = '/login';
                });
                setFormData({ username: '', email: '', password: '', confirmPassword: '' });
            } else {
                const data = await response.json();
                Swal.fire({
                    icon: 'error',
                    title: t('Register.errorTitle'),
                    text: data.message || t('Register.accountExists'),
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
            Swal.fire({
                icon: 'error',
                title: t('Register.errorTitle'),
                text: t('Register.serverError'),
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
    };

    return (
        <>
            <NavBar />

            <div className="relative min-h-screen flex flex-col items-center justify-center">
                <div className="absolute inset-0 -z-10 w-full h-full">
                    <Image
                        src="/th/images/authbg.jpg"
                        alt="Background"
                        fill
                        className="object-cover"
                        quality={75}
                        priority
                    />
                    <div className="absolute inset-0 bg-black opacity-40"></div>
                </div>

                {/* Signup form container */}
                <div className="relative bg-white bg-opacity-90 p-10 rounded-3xl shadow-lg max-w-3xl w-full z-10 translate-y-[-40px]">
                    <h2 className="text-3xl kanit font-extrabold text-center text-gray-800 mb-6">{t('Register.signup')}</h2>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder={t('Register.username')}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 kanit"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder={t('Register.email')}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 kanit"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder={t('Register.password')}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 kanit"
                            required
                        />
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder={t('Register.confirmPassword')}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 kanit"
                            required
                        />

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="w-1/2 py-3 mt-10 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 kanit"
                            >
                                {t('Register.signup')}
                            </button>
                        </div>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center my-4">
                        <hr className="w-full border-gray-300" />
                        <span className="mx-2 text-gray-400 kanit font-extrabold">{t('Register.or')}</span>
                        <hr className="w-full border-gray-300" />
                    </div>

                    {/* Google signup button */}
                    <div className="flex justify-center">
                        <button
                            type="button"
                            className="w-1/2 py-3 border border-gray-300 text-gray-700 font-semibold rounded-md flex items-center justify-center bg-white hover:bg-gray-100 kanit"
                            onClick={() => signIn("google")}
                        >
                            <Image src="/th/images/google-logo.png" alt="Google" width={30} height={30} className="mr-2" />
                            {t('Register.signupWithGoogle')}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
