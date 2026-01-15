import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Header = () => {
  const images = [
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxo-1SqeN2Fk4JI7nzeBuI1l5qkjD3f245SA&s",
    "https://www.shutterstock.com/image-photo/advertising-product-photo-household-appliances-260nw-2591556745.jpg",
    "https://images.unsplash.com/photo-1470075801209-17f9ec0cada6?w=1200"
  ];

  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent(current === 0 ? images.length - 1 : current - 1);
  };

  const nextSlide = () => {
    setCurrent(current === images.length - 1 ? 0 : current + 1);
  };

  return (
    <header className="w-full h-[70vh] relative overflow-hidden bg-gray-900">
      {/* Background Image */}
      <img
        src={images[current]}
        alt="Gallery Header"
        className="w-full h-full object-cover transition-transform duration-700 ease-in-out"
      />

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
      </div>

      {/* Left Button */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-3 rounded-full transition"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      {/* Right Button */}
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
            className={`w-3 h-3 rounded-full transition ${
              current === index ? "bg-white scale-125" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </header>
  );
};

export default Header;
