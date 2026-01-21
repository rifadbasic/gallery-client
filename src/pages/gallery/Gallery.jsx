import { useEffect, useState, useRef, useCallback } from "react";
import useAxios from "../../hooks/useAxiosSecure";
import ImageCard from "../../components/ImageCard";
import { useGallery } from "../../context/GalleryContext";

const Gallery = () => {


  // dynamic title
  document.title = "Gallery";

  const { filters } = useGallery();
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef(null);
  const fetchingRef = useRef(false);
  const axios = useAxios();

  // console.log(images)

  // Reset when filters change
  useEffect(() => {
    setImages([]);
    setPage(1);
    setHasMore(true);
  }, [filters]);

  const fetchImages = async (pageNum) => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    setLoading(true);

    try {
      const { category = "All", status = "All", role = "All" } = filters;

      const query = new URLSearchParams({ page: pageNum });
      if (category && category !== "All") query.append("category", category);
      if (status && status !== "All") query.append("status", status);
      if (role && role !== "All") query.append("role", role);

      const res = await axios.get(`/images?${query.toString()}`);
      let newImages = Array.isArray(res.data?.images) ? res.data.images : [];

      // ✅ Remove pending images
      newImages = newImages.filter((img) => img.status !== "Pending");

      setImages((prev) => {
        const ids = new Set(prev.map((i) => i._id));
        const filtered = newImages.filter((i) => !ids.has(i._id));
        return [...prev, ...filtered];
      });

      setHasMore(!!res.data?.hasMore);
    } catch (error) {
      console.error("Failed to load images", error);
    } finally {
      fetchingRef.current = false;
      setLoading(false);
    }
  };

  // Fetch when page changes
  useEffect(() => {
    fetchImages(page);
  }, [page, filters]);

  // Infinite scroll observer
  const lastImageRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !fetchingRef.current) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore],
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img, index) => {
          const isLast = index === images.length - 1;
          return (
            <ImageCard
              key={img._id}
              img={img}
              lastRef={isLast ? lastImageRef : null}
            />
          );
        })}
      </div>

      {loading && (
        <div className="text-center text-gray-500 mt-6">
          Loading more images...
        </div>
      )}

      {!loading && images.length === 0 && (
        <div className="text-center text-gray-500 mt-6">No images found.</div>
      )}

      {!hasMore && images.length > 0 && (
        <div className="text-center text-gray-400 mt-6">
          No more images to load.
        </div>
      )}
    </div>
  );
};

export default Gallery;
