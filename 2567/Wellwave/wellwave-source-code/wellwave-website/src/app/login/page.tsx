/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Image from "next/image";
import { useState, useEffect } from 'react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            setIsLoggedIn(true);
            window.location.href = '/'; // หรือใช้ router ในการ redirect
        }
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("http://ce67-16.cloud.ce.kmitl.ac.th/api/v1/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // ถ้ามีการใช้ Authorization header ก็เพิ่มตรงนี้
                },
                body: JSON.stringify({
                    "EMAIL": email,
                    "PASSWORD": password,
                }),
                credentials: 'include'
            });

            // เพิ่ม logging เพื่อ debug
            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.log('Error data:', errorData);
                throw new Error(errorData.message || 'Login failed');
            }

            const data = await response.json();
            console.log('Success data:', data);

            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("user", JSON.stringify(data.user));

            setIsLoggedIn(true);
            window.location.href = '/';
        } catch (err) {
            console.error('Login error:', err);
            setError('Failed to login');
        }
    };

    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [step, setStep] = useState<"login" | "forgot" | "otp" | "reset" | "success">("login");


    const handleSendResetLink = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`📩 ส่งลิงก์รีเซ็ตรหัสไปที่ ${email}`);
        setStep("otp");
    };

    const handleVerifyOtp = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp === "123456") {
            setStep("reset");
        } else {
            setError("OTP ไม่ถูกต้อง");
        }
    };

    const handleResetPassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError("รหัสผ่านไม่ตรงกัน");
        } else {
            setStep("success");
        }
    };
    return (
        <div className="relative flex items-center justify-center min-h-screen font-sans">
            <Image
                src="/bg_login.svg"
                alt="Background"
                layout="fill"
                objectFit="cover"
                className="-z-10"
            />

            <div className="mb-4">
                <Image
                    src="/cat.svg"
                    alt="cat"
                    layout="intrinsic"
                    width={200}
                    height={200}
                    style={{
                        position: 'absolute',
                        top: '6%',  // ให้ชิดบนสุด
                        left: '50%',  // ชิดซ้ายสุด
                        transform: 'translateX(-50%)',
                        zIndex: 1,
                    }}
                />
            </div>
            {/* Card */}
            <div className="relative bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center z-0 min-h-[380px] flex flex-col justify-center">
                <h3 className="text-4xl font-bold text-gray-800 mt-10 mb-4">
                    {step === "login"
                        ? "ยินดีต้อนรับ!"
                        : step === "forgot"
                            ? "ลืมรหัสผ่าน?"
                            : step === "otp"
                                ? "ยืนยัน OTP"
                                : step === "reset"
                                    ? "ตั้งรหัสผ่านใหม่"
                                    : "เปลี่ยนรหัสผ่านสำเร็จ!"}
                </h3>

                <div className="flex-1 flex flex-col justify-center">
                    {step === "login" && (
                        <form className="space-y-4" onSubmit={handleLogin}>
                            <input
                                type="email"
                                placeholder="อีเมล"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <input
                                type="password"
                                placeholder="รหัสผ่าน"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                                เข้าสู่ระบบ
                            </button>
                            <button type="button" onClick={() => setStep("forgot")} className="text-gray-500 hover:underline ">
                                ลืมรหัสผ่าน?
                            </button>
                        </form>
                    )}

                    {step === "forgot" && (
                        <form className="space-y-4" onSubmit={handleSendResetLink}>
                            <input
                                type="email"
                                placeholder="กรอกอีเมลของคุณ"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                                ส่งลิงก์รีเซ็ตรหัสผ่าน
                            </button>
                        </form>
                    )}

                    {step === "otp" && (
                        <form className="space-y-4" onSubmit={handleVerifyOtp}>
                            <input
                                type="text"
                                placeholder="กรอก OTP 6 หลัก"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
                            />
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                                ยืนยัน OTP
                            </button>
                        </form>
                    )}

                    {step === "reset" && (
                        <form className="space-y-4" onSubmit={handleResetPassword}>
                            <input
                                type="password"
                                placeholder="รหัสผ่านใหม่"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <input
                                type="password"
                                placeholder="ยืนยันรหัสผ่านใหม่"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                                ตั้งรหัสผ่านใหม่
                            </button>
                        </form>
                    )}

                    {step === "success" && (
                        <div className="space-y-4">
                            <p className="text-green-600">✅ เปลี่ยนรหัสผ่านสำเร็จ!</p>
                            <button type="button" onClick={() => setStep("login")} className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                                กลับไปเข้าสู่ระบบ
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
