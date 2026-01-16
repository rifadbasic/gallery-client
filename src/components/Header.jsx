import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Camera } from "lucide-react";
import { Link } from "react-router";

const Header = () => {
  const images = [
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxo-1SqeN2Fk4JI7nzeBuI1l5qkjD3f245SA&s",
    "https://www.shutterstock.com/image-photo/advertising-product-photo-household-appliances-260nw-2591556745.jpg",
    "https://images.unsplash.com/photo-1470075801209-17f9ec0cada6?w=1200",
  ];

  const [current, setCurrent] = useState(0);

  // Auto-slide every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(timer);
  }, [images.length]);

  const prevSlide = () => {
    setCurrent(current === 0 ? images.length - 1 : current - 1);
  };

  const nextSlide = () => {
    setCurrent(current === images.length - 1 ? 0 : current + 1);
  };

  return (
    <header className="relative w-full h-[70vh] overflow-hidden bg-gray-900">
      {/* Image Slider */}
      <div className="w-full h-full relative">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Slide ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out
                        ${
                          current === index
                            ? "opacity-100 z-0"
                            : "opacity-0 z-0"
                        }`}
          />
        ))}
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
        <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg">
          Welcome to Gallery
        </h1>
        <p className="mt-4 max-w-xl text-lg">
          Where moments live forever, framed by light and memory.
        </p>

        {/* Gallery Tour Button */}
        <Link
          to="/gallery"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-full transition shadow-lg"
          role="button"
        >
          <Camera className="w-5 h-5" />
          Start Gallery Tour
        </Link>
      </div>

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-3 rounded-full transition"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-3 rounded-full transition"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-transform duration-300
                        ${
                          current === index
                            ? "bg-white scale-125"
                            : "bg-white/50"
                        }`}
          />
        ))}
      </div>
    </header>
  );
};

export default Header;
