import React from "react";

interface ProgressCircleProps {
    percentage: number;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({ percentage }) => {
    const radius = 45;
    const strokeWidth = 4; // 🔹 ลดขนาดเส้นกราฟ
    const circumference = 2 * Math.PI * radius;
    const progress = (percentage / 100) * circumference;

    return (
        <svg width="120" height="120" viewBox="0 0 100 100">
            {/* วงกลมพื้นหลัง */}
            <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="#e0e0e0"
                strokeWidth={strokeWidth}
                fill="none"
            />
            {/* วงกลม Progress */}
            <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="url(#gradient)"
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - progress}
            />
            {/* Gradient สี */}
            <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1976D2" />
                    <stop offset="100%" stopColor="#64b5f6" />
                </linearGradient>
            </defs>
            {/* ตัวเลขตรงกลาง */}
            <text
                x="50"
                y="55"
                textAnchor="middle"
                fontSize="18"
                fontWeight="bold"
                fill="url(#gradient)"
            >
                {percentage}%
            </text>
        </svg>
    );
};

export default ProgressCircle;
