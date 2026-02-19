import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

interface EditDurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (totalDuration: number) => void;
  duration: number;
}

const EditDurationModal: React.FC<EditDurationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  duration,
}) => {
  const [hours, setHours] = useState<number>(Math.floor(duration / 60));
  const [minutes, setMinutes] = useState<number>(duration % 60);

  useEffect(() => {
    if (isOpen) {
      setHours(Math.floor(duration / 60));
      setMinutes(duration % 60);         
    }
  }, [isOpen, duration]);
  
  const handleSave = () => {
    const totalDuration = hours * 60 + minutes; 
    onSave(totalDuration);
    onClose();
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg w-[90%] sm:w-[400px] p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Edit Duration</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <Icon
              icon="iconoir:cancel"
              className="text-lg text-[#414141]"
              width={24}
              height={24}
            />
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">Hours</label>
            <input
              type="number"
              value={hours}
              onChange={(e) => setHours(Math.min(23, Math.max(0, +e.target.value)))}
              min="0"
              className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">Minutes</label>
            <input
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(Math.max(0, Math.min(59, +e.target.value)))}
              min="0"
              max="59"
              className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="py-2 px-4 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default EditDurationModal;