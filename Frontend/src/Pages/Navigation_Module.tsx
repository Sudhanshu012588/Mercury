import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import ReadingMaterial from "../Components/Navigation_Component/ReadingMaterial";

export const Module = () => {
  const [searchParams] = useSearchParams();

  const userId = searchParams.get("userId");
  const docId = searchParams.get("docId");

  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurriculum = async () => {
      if (!userId || !docId) {
        setError("Missing query parameters");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/navigation/get/${userId}/${docId}`
        );

        if (res.data.status === "success") {
          console.log("fetched data :",res.data)
          setModules(res.data.data.curriculum);
        } else {
          throw new Error("Failed to fetch curriculum");
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load curriculum");
      } finally {
        setLoading(false);
      }
    };

    fetchCurriculum();
  }, [userId, docId]);

  if (loading) {
    return <p>Loading curriculum...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return(
    <div className="min-h-screen w-full bg-linear-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 py-12 px-4">
  <div className="mx-auto max-w-5xl">
    <ReadingMaterial modules={modules} />
  </div>
</div>

  );
};
