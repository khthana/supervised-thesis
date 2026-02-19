import React from 'react';

interface PaginationProps {
  pagination: {
    total: number;
    totalPages: number;
  };
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ pagination, currentPage, setCurrentPage }) => {
  const startItem = pagination.total > 0 ? (currentPage - 1) * 10 + 1 : 0;
  const endItem = Math.min(currentPage * 10, pagination.total);

  return (
    <footer className="fixed justify-between w-5/6 bottom-12 mb-2">
      <div className="flex justify-between items-center w-full">
        <p className="text-gray-600 text-sm">
          แสดง {startItem} - {endItem} จาก {pagination.total} รายการ
        </p>
        <div className="flex space-x-2 pr-4">
          {Array.from({ length: pagination.totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`py-1 px-3 rounded-lg transition-colors duration-200
                ${currentPage === index + 1
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Pagination;
