import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface CurriculumItem {
  docId: string;
  topic: string;
  createdAt: string;
}

interface Props {
  userId: string;
}

const CurriculumList = ({ userId }: Props) => {
  const [curriculums, setCurriculums] = useState<CurriculumItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurriculums = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/navigation/user/${userId}`
        );

        if (res.data.status === "success") {
          setCurriculums(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch curriculums", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurriculums();
  }, [userId]);

  return (
    <aside className="w-80 h-full border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      {/* <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          My Curriculums
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Your learning library
        </p>
      </div> */}

      <div className="overflow-y-auto h-[calc(100vh-80px)]">
        {loading && (
          <p className="p-4 text-sm text-gray-500">Loading…</p>
        )}

        {!loading && curriculums.length === 0 && (
          <p className="p-4 text-sm text-gray-500">
            No curriculums yet
          </p>
        )}

        {curriculums.map((item) => (
          <button
            key={item.docId}
            onClick={() =>
              navigate(
                `/navigation/module?userId=${userId}&docId=${item.docId}`
              )
            }
            className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition border-b border-gray-100 dark:border-gray-800"
          >
            <p className="font-medium text-gray-900 dark:text-white line-clamp-2">
              {item.topic}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(item.createdAt).toLocaleDateString()}
            </p>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default CurriculumList;
