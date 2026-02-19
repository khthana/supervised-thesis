/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from 'react';
import Image from "next/image";
import AddArticleModal from "./widget/addArticleModel";
import { useRouter } from "next/navigation";
interface Disease {
  DISEASE_ID: number;
  TH_NAME: string;
  ENG_NAME: string;
}

interface Article {
  AID: number;
  TOPIC: string;
  ESTIMATED_READ_TIME: number;
  THUMBNAIL_URL: string;
  VIEW_COUNT: number;
  PUBLISH_DATE: string;
  diseases: Disease[];
}

const diseaseTabs = [
  { id: null, name: "ทั้งหมด" },
  { id: 1, name: "โรคเบาหวาน" },
  { id: 2, name: "โรคความดันโลหิตสูง" },
  { id: 3, name: "โรคไขมันในเลือดสูง" },
  { id: 4, name: "โรคอ้วน" },
  { id: 5, name: "อื่น ๆ" },
];

const ArticlePage = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<number | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1
  });
  const handleArticleCreated = () => {
    // Refresh article list
    fetchArticles(selectedDiseaseId, currentPage);
  };
  const fetchArticles = async (diseaseId: number | null, page: number) => {
    setLoading(true);
    try {
      const limit = 10;
      const url = `http://ce67-16.cloud.ce.kmitl.ac.th/api/v1/article/search?${diseaseId ? `diseaseIds=${diseaseId}&` : ''}page=${page}&limit=${limit}`;
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setArticles(data.data);
        setPagination({
          total: data.meta.total,
          totalPages: data.meta.totalPages
        });
      } else {
        setError("Failed to fetch articles.");
      }
    } catch (error) {
      setError("Error fetching articles.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchArticles(selectedDiseaseId, currentPage);
  }, [selectedDiseaseId, currentPage]);

  const handleDiseaseChange = (diseaseId: number | null) => {
    setSelectedDiseaseId(diseaseId);
    setCurrentPage(1); // Reset to first page when disease changes
  };

  const ArticleList = () => (
    <div className="p-4 space-y-4 max-h-[350px] overflow-y-auto scrollbar-custom pr-1">
      {articles.length > 0 ? (
        <ul>
          {articles.map((article) => (
            <li key={article.AID} className="flex items-start bg-white rounded-lg shadow hover:shadow-lg mb-3">
              <div className="w-32 h-32 bg-gray-200 flex items-center justify-center rounded-l-lg">
                {/* <Image
                  src={`http://ce67-16.cloud.ce.kmitl.ac.th/api/v1$/get-image/{article.THUMBNAIL_URL}`}
                  alt="article-thumbnail"
                  width={128}
                  height={128}
                /> */}
              </div>
              <div className="ml-4 flex-grow">
                <h2 className="text-lg font-bold text-gray-800 mt-4">{article.TOPIC}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <Image src="/asset/bookmark.svg" alt="article" width={16} height={16} />
                  <p className="text-sm text-blue-700">ยอดบุ๊กมาร์ก {article.VIEW_COUNT} ครั้ง</p>
                </div>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{article.TOPIC}</p>
              </div>
              <button className="px-4 py-2 text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h.01M12 12h.01M18 12h.01" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No articles found.</p>
      )}
    </div>
  );

  const Pagination = () => {
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

  return (
    <div className="top-0 px-28 py-6 bg-gray-100 min-h-screen font-sans">
      <div className="rounded-lg p-6 mt-16 h-[600px] bg-white shadow-md">
        <p
          className="text-gray-600 text-sm pb-2 flex items-center cursor-pointer group"
          onClick={() => router.back()} // Go back
        >
          <span className="hover:underline inline-flex items-center group-hover:text-black ">
            เพิ่มข้อมูล</span>
          <span style={{ margin: "0 8px" }}> &gt; </span>
          <Image
            src="/asset/article.svg"
            alt="article"
            width={16}
            height={16}
            className="mr-1"
          />
          <span className="text-black">บทความ</span>
        </p>
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">
            บทความ ทั้งหมด {pagination.total} บทความ
          </h1>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => setIsOpen(true)}>
            + เพิ่มบทความ
          </button>
        </div>
        <AddArticleModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSuccess={handleArticleCreated}
        />

        <div className="relative mt-4">
          <input
            type="text"
            placeholder="ค้นหา"
            className="rounded-lg bg-gray-100 px-10 py-2 w-full focus:outline-none focus:ring focus:ring-blue-300"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M16.5 10.5a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
          </span>
        </div>

        <nav className="flex space-x-4 px-4 py-1">
          {diseaseTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleDiseaseChange(tab.id)}
              className={`text-sm font-semibold px-3 py-2 
                ${selectedDiseaseId === tab.id
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-600"}`}
            >
              {tab.name}
            </button>
          ))}
        </nav>

        {loading && <p>Loading articles...</p>}
        {error && <p>{error}</p>}

        <ArticleList />
        <Pagination />
      </div>
    </div>
  );
};

export default ArticlePage;