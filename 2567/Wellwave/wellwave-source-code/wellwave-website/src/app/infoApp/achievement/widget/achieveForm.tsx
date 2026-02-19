// // src/components/FormComponent.js
// import React, { useState } from "react";
// import FileUpload from "../../components/upload";

// function FormComponent() {
//   const [levels, setLevels] = useState([1]); // เก็บระดับที่ 1 เป็น default
//   const [duration, setDuration] = useState(1); // เก็บค่า duration สำหรับทุกระดับ
//   const [isOpen, setIsOpen] = useState(true); // ตั้งค่าเริ่มต้นเป็น true


//   // ฟังก์ชันเพิ่มระดับใหม่
//   const addLevel = () => {
//     setLevels([...levels, levels.length + 1]); // เพิ่มระดับใหม่โดยการเพิ่มเลขลำดับที่ใหม่
//   };

//   return (
//     <div className="mt-4 space-y-4 max-h-[500px] overflow-y-auto scrollbar-custom pr-2">
//       <label className="block text-gray-700">ชื่อความสำเร็จ</label>
//       <input type="text" className="w-full border rounded p-2" placeholder="ชื่อความสำเร็จ" />

//       <label className="block text-gray-700">รางวัล</label>
//       <div className="flex gap-2">
//         <select className="border rounded p-2">
//           <option>Gem</option>
//           <option>EXP</option>
//         </select>
//         <input type="number" className="w-full border rounded p-2" placeholder="จำนวน" />
//       </div>

//       <label className="block text-gray-700">เกณฑ์การเลื่อนขั้น</label>

//       {/* แสดงระดับทั้งหมดที่มี */}
//       {levels.map((level, index) => (
//         <div key={index}>
//           <label className="block text-gray-700">ระดับที่ {level}</label>
//           <FileUpload />
//           <div className="flex gap-2">
//             <select className="border rounded p-2">
//               <option>Gem</option>
//               <option>EXP</option>
//             </select>
//             <select className="border rounded p-2">
//               <option>Gem</option>
//               <option>EXP</option>
//             </select>
//             <div className="flex items-center w-full">
//               <input
//                 type="number"
//                 value={duration}
//                 onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
//                 min="1"
//                 className="w-full rounded-l-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//               <span className="rounded-r-md border border-l-0 border-gray-300 bg-white px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">วัน</span>
//             </div>
//           </div>
//         </div>
//       ))}

//       {/* ปุ่ม */}
//       <div className="flex justify-between mt-4">
//         <button onClick={addLevel} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
//           + เพิ่มระดับ
//         </button>
//         <div className="flex gap-2">
//           <button onClick={() => setIsOpen(false)} className="px-4 py-2 text-gray-500 hover:text-gray-700">
//             ยกเลิก
//           </button>
//           <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
//             ยืนยัน
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default FormComponent;
