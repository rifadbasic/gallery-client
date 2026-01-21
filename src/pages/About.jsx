import React from "react";
import { Star, Quote, Users, Award, Image } from "lucide-react";

const About = () => {
  // dynamic title
  document.title = "About | Gallery";

  const reviews = [
    {
      name: "Sarah Ahmed",
      role: "Art Collector",
      review:
        "This gallery changed how I see digital art. The curation is flawless.",
      rating: 5,
    },
    {
      name: "James Carter",
      role: "Photographer",
      review: "A stunning platform with amazing artists and smooth experience.",
      rating: 5,
    },
    {
      name: "Ayesha Khan",
      role: "Designer",
      review:
        "Beautiful UI, meaningful artworks, and excellent filtering system.",
      rating: 4,
    },
  ];

  return (
    <section className=" py-16 px-6">
      <div className="max-w-7xl mx-auto mt-12">
        {/* TITLE */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">About Our Gallery</h2>
          <p className="mt-4  max-w-2xl mx-auto">
            Where creativity meets curation — we showcase art that tells
            stories, sparks emotions, and inspires minds across the world.
          </p>
        </div>

        {/* ABOUT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* LEFT SIDE: IMAGE */}
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1549893072-4bc678117f45?auto=format&fit=crop&w=800&q=80"
              alt="Gallery"
              className="w-full h-[350px] object-cover"
            />
          </div>

          {/* RIGHT SIDE: TEXT */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Who We Are
            </h3>
            <p className="mt-4 ">
              We are a digital art gallery bringing together photographers,
              illustrators, and visual storytellers from around the globe. Our
              mission is to create a space where art is accessible, appreciated,
              and celebrated.
            </p>

            <div className="grid grid-cols-2 gap-6 mt-6">
              <div className="flex items-center gap-3">
                <Users className="text-blue-500" size={28} />
                <div>
                  <h4 className="font-bold text-lg ">12K+</h4>
                  <p className="text-sm ">Happy Visitors</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Award className="text-indigo-500" size={28} />
                <div>
                  <h4 className="font-bold text-lg ">50+</h4>
                  <p className="text-sm ">Awards Won</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Image className="text-purple-500" size={28} />
                <div>
                  <h4 className="font-bold text-lg ">5K+</h4>
                  <p className="text-sm ">Artworks</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Star className="text-yellow-500" size={28} />
                <div>
                  <h4 className="font-bold text-lg ">4.9</h4>
                  <p className="text-sm ">User Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CUSTOMER REVIEWS */}
        <div className="mt-16">
          <h3 className="text-2xl font-semibold text-center text-gray-900 dark:text-white mb-8">
            What Our Users Say
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="bg-white dark:bg-[#0d1d33] p-6 rounded-xl shadow-md"
              >
                <Quote className="text-blue-500 mb-3" size={28} />

                <p className="text-gray-700 dark:text-gray-300 italic">
                  "{review.review}"
                </p>

                <div className="flex items-center gap-2 mt-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={18} className="text-yellow-500" />
                  ))}
                </div>

                <h4 className="mt-3 font-bold text-gray-900 dark:text-white">
                  {review.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {review.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
