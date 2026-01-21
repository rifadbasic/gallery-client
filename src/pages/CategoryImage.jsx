import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router";
import ImageCard from "../components/ImageCard";
import useAxiosSecure from "../hooks/useAxiosSecure";

export default function CategoryImage() {
  // dynamic title
  useEffect(() => {
    document.title = "Category Images | Gallery";
  }, []);

  const { categoryName } = useParams();
  const axios = useAxiosSecure();

  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const observer = useRef();

  useEffect(() => {
    // যখন category বা search বদলাবে, তখন reset
    setImages([]);
    setPage(1);
    setHasMore(true);
  }, [categoryName, search]);

  useEffect(() => {
    fetchImages();
  }, [page, categoryName, search]);

  const fetchImages = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await axios.get(
        `/images/category/${categoryName}?page=${page}&limit=10&search=${search}`,
      );

      const newImages = res.data.images || [];

      setImages((prev) => {
        const ids = new Set(prev.map((i) => i._id));
        return [...prev, ...newImages.filter((i) => !ids.has(i._id))];
      });

      if (newImages.length < 10) {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to fetch images:", err);
    } finally {
      setLoading(false);
    }
  };

  const lastImageRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold  mb-4 capitalize mt-16">
          {categoryName.replace("-", " ")} Images
        </h1>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by image name or role..."
          className="w-full p-3 rounded mb-6  border border-gray-700 focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Images Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((img, index) => {
            if (images.length === index + 1) {
              return (
                <ImageCard key={img._id} img={img} lastRef={lastImageRef} />
              );
            } else {
              return <ImageCard key={img._id} img={img} />;
            }
          })}
        </div>

        {loading && (
          <div className="text-center  mt-6">
            Loading more images...
          </div>
        )}

        {!hasMore && images.length > 0 && (
          <p className="text-center  mt-6">
            You’ve reached the end ✨
          </p>
        )}

        {images.length === 0 && !loading && (
          <p className="text-center  mt-6">
            No images found in this category.
          </p>
        )}
      </div>
    </div>
  );
}
