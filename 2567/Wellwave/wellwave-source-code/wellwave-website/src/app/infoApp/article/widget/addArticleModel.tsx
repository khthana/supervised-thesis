import { useState } from 'react';
import FileUpload from "../../../components/upload";
import { createArticle } from '../../../services/article/articleService';

interface AddArticleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface ArticleForm {
    TOPIC: string;
    DISEASES_TYPE_IDS: string;
    BODY: string;
    file: File | null;
}

const AddArticleModal = ({ isOpen, onClose, onSuccess }: AddArticleModalProps) => {
    const [formData, setFormData] = useState<ArticleForm>({
        TOPIC: '',
        DISEASES_TYPE_IDS: '',  // default value
        BODY: '',
        file: null,
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            await createArticle(formData);
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to create article:', error);
            // Show error message to the user
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow max-w-[600px] w-full max-h-[600px] p-6 m-18">
                <div className="flex justify-between items-center border-b pb-3">
                    <h2 className="text-lg font-semibold">เพิ่มบทความ</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        ✖
                    </button>
                </div>

                <div className="mt-4 space-y-4 max-h-[500px] overflow-y-auto scrollbar-custom pr-2">

                    {/* ชื่อบทความ */}
                    <div>
                        <label className="block text-gray-700">ชื่อบทความ</label>
                        <input
                            type="text"
                            className="w-full border rounded p-2"
                            placeholder="ชื่อบทความ"
                            value={formData.TOPIC}
                            onChange={(e) => setFormData({ ...formData, TOPIC: e.target.value })}
                        />
                    </div>

                    {/* ประเภทบทความ */}
                    <div>
                        <label className="block text-gray-700">ประเภทบทความ</label>
                        <select
                            className={`w-full border rounded p-2 ${formData.DISEASES_TYPE_IDS === "" ? "text-gray-400" : "text-gray-700"}`}
                            value={formData.DISEASES_TYPE_IDS}
                            onChange={(e) => setFormData({ ...formData, DISEASES_TYPE_IDS: e.target.value })}
                        >
                            <option value="" disabled>เลือกประเภทบทความ</option>
                            <option value="1">โรคเบาหวาน</option>
                            <option value="2">โรคความดันโลหิตสูง</option>
                            <option value="3">โรคไขมันในเลือดสูง</option>
                            <option value="4">โรคอ้วน</option>
                            <option value="5">อื่น ๆ </option>
                        </select>
                    </div>






                    {/* รายละเอียด */}
                    <div>
                        <label className="block text-gray-700">รายละเอียด</label>
                        <input
                            type="text"
                            className="w-full border rounded p-2"
                            placeholder="รายละเอียด"
                            value={formData.BODY}
                            onChange={(e) => setFormData({ ...formData, BODY: e.target.value })}
                        />
                    </div>

                    {/* รูปภาพบทความ */}
                    <div>
                        <label className="block text-gray-700">รูปภาพบทความ</label>
                        <FileUpload
                            onFileSelect={(file) => setFormData({ ...formData, file })}
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-500 hover:text-gray-700"
                            disabled={loading}
                        >
                            ยกเลิก
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                            disabled={loading}
                        >
                            {loading ? 'กำลังบันทึก...' : 'ยืนยัน'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddArticleModal;
