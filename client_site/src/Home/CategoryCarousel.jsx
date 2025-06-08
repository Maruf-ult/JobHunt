import { useRef } from "react";
import { Carousel } from "antd";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const categories = ["Frontend Developer", "Backend Developer", "Graphic Designer", "Fullstack Developer"];

function CategoryCarousel() {
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  return (
    <div className="relative w-3/4 ml-40">

      <button
        className="absolute left-[-30px] top-1/2 transform -translate-y-1/2 text-gray-800 z-10 p-2"
        onClick={() => carouselRef.current.prev()}
      >
        <FaArrowLeft className="h-6 w-6 -ml-8" />
      </button>

     
      <Carousel ref={carouselRef} autoplay dots={false} slidesToShow={3}>
        {categories.map((cat, index) => (
          <div key={index} className="mx-2 cursor-pointer">
            <h3
              className="text-sm font-medium bg-gray-100 px-3 py-2 rounded-md inline-block hover:bg-gray-300"
              onClick={() => navigate(`/search-results/${cat}`)} 
            >
              {cat}
            </h3>
          </div>
        ))}
      </Carousel>


      <button
        className="absolute right-[-30px] top-1/2 transform -translate-y-1/2 text-gray-800 z-10 p-2"
        onClick={() => carouselRef.current.next()}
      >
        <FaArrowRight className="h-6 w-6 -ml-20" />
      </button>
    </div>
  );
}

export default CategoryCarousel;