import { Camera, Image, Palette, Film, Layers } from "lucide-react";
import { Link } from "react-router";
import "./component.css";

const categories = [
  {
    id: 1,
    name: "Photography",
    icon: <Camera className="w-8 h-8" />,
    description: "Captured moments, frozen in time.",
    color: "bg-indigo-100 text-indigo-600",
    link: "/category/photography"
  },
  {
    id: 2,
    name: "Digital Art",
    icon: <Palette className="w-8 h-8" />,
    description: "Modern creativity in pixels.",
    color: "bg-pink-100 text-pink-600",
    link: "/category/digital-art"
  },
  {
    id: 3,
    name: "Illustration",
    icon: <Image className="w-8 h-8" />,
    description: "Hand-drawn artistic expression.",
    color: "bg-green-100 text-green-600",
    link: "/category/illustration"
  },
  {
    id: 4,
    name: "Cinematography",
    icon: <Film className="w-8 h-8" />,
    description: "Motion, emotion, and storytelling.",
    color: "bg-blue-100 text-blue-600",
    link: "/category/cinematography"
  },
  {
    id: 5,
    name: "Mixed Media",
    icon: <Layers className="w-8 h-8" />,
    description: "Where different arts collide.",
    color: "bg-yellow-100 text-yellow-600",
    link: "/category/mixed-media"
  },
];

const ProductsCategories = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      {/* Section Title */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold title-text ">
          Explore Categories
        </h2>
        <p className="text-gray-400 mt-3 max-w-xl mx-auto">
          Walk through different creative spaces of our Gallery and discover
          your favorite art form.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={category.link}
            className="group div-bg border border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center hover:shadow-lg transition duration-300"
          >
            <div
              className={`inline-flex items-center justify-center p-4 rounded-full ${category.color}`}
            >
              {category.icon}
            </div>

            <h3 className="mt-4 text-lg font-semibold ">
              {category.name}
            </h3>

            <p className="text-sm  mt-2">
              {category.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ProductsCategories;
