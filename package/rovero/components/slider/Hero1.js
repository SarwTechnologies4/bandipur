"use client";
import { sliderProps } from "@/utility/sliderProps";
import Link from "next/link";
import Slider from "react-slick";
import { useEffect, useState } from "react";

export const Hero2 = () => {
  const [heroSections, setHeroSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_CMS_BASE_URL;
  const API_AUTH_TOKEN = process.env.NEXT_PUBLIC_CMS_TOKEN;

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/menu_r1.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
  };

  // Create a modified version of sliderProps with arrows disabled
const modifiedSliderProps = {
  ...sliderProps.home1,
  arrows: false,
  dots: false,
  autoplay: true,          
  autoplaySpeed: 4000,     
  speed:  1600,              
};

  useEffect(() => {
    const fetchHeroSections = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/consumer/damauli_herosections_01`,
          {
            headers: {
              Authorization: `Bearer ${API_AUTH_TOKEN}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const { data } = await response.json();
        setHeroSections(data);
      } catch (err) {
        setError(err.message || "An unknown error occurred");
        console.error("Error fetching hero sections:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroSections();
  }, [API_BASE_URL, API_AUTH_TOKEN]);

  // if (loading) {
  //   return <div className="slider-area hm2 position-relative over-hidden">Loading...</div>;
  // }

  if (error) {
    return <div className="slider-area hm2 position-relative over-hidden">Error: {error}</div>;
  }

  if (!heroSections.length) {
    return <div className="slider-area hm2 position-relative over-hidden">No hero sections found</div>;
  }

  return (
    <div className="slider-area hm2 position-relative over-hidden">
      {/* Use the modified slider props here */}
      <Slider {...modifiedSliderProps} className="slider-active">
        {heroSections.map((section) => {
          const imageUrl = getImageUrl(section.image);

          return (
            <div
              key={section.id}
              className="single-slider slider-height2 d-flex align-items-center z-index1 black-overly"
            >
              <div 
                className="slider-bg-image"
                style={{
                  backgroundImage: `url(${imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: -1
                }}
                onError={(e) => {
                  e.target.style.backgroundImage = "url('/images/menu_r1.jpg')";
                }}
              />
              
              <div className="container">
                <div className="row align-items-center justify-content-center">
                  <div className="col-xl-8 col-lg-8 col-md-8 col-sm-12 col-12">
                    <div className="slider-content slider-content1 mt-50 text-center px-sm--3">
                      <span className="text-white text-uppercase fontNoto f-700">
                        {section.propertyname}
                      </span>
                      <h1
                        className="text-white mb-30 f-700"
                        data-aos="fade-up"
                        data-aos-duration={20}
                        data-aos-delay={15}
                      >
                        {section.title}
                      </h1>
                      <p
                        className="text-white mb-55"
                        data-aos="fade-up"
                        data-aos-duration={17}
                      >
                        {section.description}
                      </p>
                      <div className="my-btn d-inline-block">
                        <Link href="rooms2" className="btn theme-bg">
                          book now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};