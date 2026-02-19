import React from "react";

interface DateTripProps {
  startDate: Date;
  durationDate: number;
  onSelectDay: (indexDate: number) => void;
}

const TripDate: React.FC<DateTripProps> = ({
  startDate,
  durationDate,
  onSelectDay
}) => {


    const formatDate = (date: Date) =>
        date.toLocaleDateString("th-TH", {
          day: "numeric",
          month: "short",
          year: "2-digit",
        });


    const dates = Array.from({ length: durationDate+1 }, (_, index) => {
        const baseDate = new Date(startDate);
        const date = new Date(baseDate);
        date.setDate(baseDate.getDate() + index);
        return formatDate(date); 
      });
    
  
  return (
    <div className="relative w-full">
      <select
        className="border rounded-md p-2 w-full outline-none"
        onChange={(e) => onSelectDay(Number(e.target.value))}
      >
        {dates.map((date, index) => (
          <option key={index} value={index}>
            {date}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TripDate;
