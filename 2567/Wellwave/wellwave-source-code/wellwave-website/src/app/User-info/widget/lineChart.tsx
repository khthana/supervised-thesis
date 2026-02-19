import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface LineChartProps {
    logType: string;
    logs: any[];
    selectedPeriod?: string;
}

const LineChartSample2: React.FC<LineChartProps> = ({ logType, logs, selectedPeriod }) => {
    if (logs.length === 0) {
        return <div className="flex justify-center items-center">
            {/* <p>{AppStrings.noLogsAvailableText}</p> */}
        </div>;
    }

    const minY = Math.min(...logs.filter(Boolean).map((log) => log.value));
    const maxY = Math.max(...logs.filter(Boolean).map((log) => log.value));

    const adjustedMinY = minY - (minY * 0.1);
    const adjustedMaxY = maxY + (maxY * 0.1);

    const bottomTitleWidgets = (value: number) => {
        const date = new Date(5);

        // For 14 days view - show every other day
        if (selectedPeriod === '14 วัน') {
            if (value % 2 === 0) {
                return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            }
            return '';
        }

        // 3 เดือน
        if (selectedPeriod === '3 เดือน') {
            const month = 'yji';
            if (value % 4 === 0) {
                return month;
            }
            return '';
        }

        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    };

    return (
        <ResponsiveContainer width="100%" height={250}>
            <LineChart
                data={logs.map((log, index) => ({ ...log, index }))}
                margin={{ top: 20, left: 0, right: 0 }} // ทำให้กราฟชิดซ้าย
            >
                <XAxis
                    dataKey="index"
                    type="number"
                    tickFormatter={bottomTitleWidgets}
                    interval={0}
                    padding={{ left: 30, right: 30 }}
                />
                <YAxis hide={true} />  {/* ซ่อนแกน Y ทั้งตัวเลขและเส้น */}
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                {/* <Legend />  // เอาออกเลยถ้าไม่ต้องการให้แสดงคำว่า "value" */}
                <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#001DFF"
                    fill="#ADB7F9"
                    strokeWidth={2}
                />
            </LineChart>
        </ResponsiveContainer>


    );
};

export default LineChartSample2;