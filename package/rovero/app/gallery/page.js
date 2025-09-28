"use client"
import Breadcrumb from "@/components/Breadcrumb";
import RoveroLayout from "@/layouts/RoveroLayout";
import dynamic from "next/dynamic";
import { useState, useRef, useEffect } from "react";

// Dynamically import the slider to reduce initial bundle size
const Slider = dynamic(() => import('react-slick'), {
  ssr: false,
  loading: () => <div className="slick-loading" style={{ minHeight: '200px' }} />
});

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Default data to show immediately while loading
const DEFAULT_GALLERY_DATA = [
  {
    id: 1,
    title: "Room Interior",
    images: [
      "/images/gallery/room1.jpg",
      "/images/gallery/room2.jpg",
      "/images/gallery/room3.jpg",
      "/images/gallery/room4.jpg"
    ]
  },
  {
    id: 2,
    title: "Restaurant and Dining",
    images: [
      "/images/gallery/dining1.jpg",
      "/images/gallery/dining2.jpg",
      "/images/gallery/dining3.jpg"
    ]
  }
];

// Custom arrow components
const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ 
        ...style, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        width: "40px", 
        height: "40px", 
        background: "rgba(255, 255, 255, 0.8)", 
        borderRadius: "50%",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        right: "-20px",
        zIndex: 1
      }}
      onClick={onClick}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 18L15 12L9 6"
          stroke="#000000"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ 
        ...style, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        width: "40px", 
        height: "40px", 
        background: "rgba(255, 255, 255, 0.8)", 
        borderRadius: "50%",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        left: "-20px",
        zIndex: 1
      }}
      onClick={onClick}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15 18L9 12L15 6"
          stroke="#000000"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

const Page = () => {
  const [galleryData, setGalleryData] = useState(DEFAULT_GALLERY_DATA);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const formRef = useRef(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_CMS_BASE_URL;
  const API_AUTH_TOKEN = process.env.NEXT_PUBLIC_CMS_TOKEN;

  // Image URL handler
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/gallery/placeholder.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY || document.documentElement.scrollTop;
      let formShouldBeSticky = false;
      
      if (formRef.current) {
        const formTop = formRef.current.getBoundingClientRect().top;
        const navHeight = document.querySelector('header')?.offsetHeight || 100;
        formShouldBeSticky = formTop <= navHeight && scrollPosition > navHeight;
      }

      setIsHeaderSticky(scrollPosition > 100 && !formShouldBeSticky);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Fetch data without blocking UI
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const galleryRes = await fetch(`${API_BASE_URL}/api/consumer/damauli_galleries_01_01`, {
          headers: { 'Authorization': `Bearer ${API_AUTH_TOKEN}` }
        });

        if (galleryRes.ok) {
          const galleryJson = await galleryRes.json();
          setGalleryData(galleryJson.data || DEFAULT_GALLERY_DATA);
        }
      } catch (err) {
        console.error('API fetch error:', err);
        // Silently fail - we already have default data
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [API_BASE_URL, API_AUTH_TOKEN]);

  // Function to chunk array into pairs for two images per slide
  const chunkArray = (array, chunkSize) => {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  };

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1, centerMode: true, centerPadding: '20px' }
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1, arrows: false, centerMode: true, centerPadding: '10px' }
      }
    ]
  };

  return (
    <RoveroLayout homeClass="hm2" isHeaderSticky={isHeaderSticky}>
      <style jsx global>{`
        html, body { overflow-x: hidden; width: 100%; }
        
        .slick-prev:before, .slick-next:before { display: none; }
        .slick-dots { bottom: -30px !important; }
        
        .slick-slide { padding: 0 8px; }
        .slick-list { margin: 0 -8px; overflow: visible; }
        
        .gallery-slide-item { transition: transform 0.3s ease; }
        .gallery-slide-item:hover { transform: scale(1.02); }
        
        .gallery-img-container {
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 16px;
        }
        
        .gallery-img-container:last-child {
          margin-bottom: 0;
        }
        
        .slick-loading {
          background: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .gallery-section {
          margin-bottom: 80px;
        }
        
        .gallery-title {
          position: relative;
          padding-bottom: 15px;
          margin-bottom: 30px;
        }
        
        .gallery-title:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 60px;
          height: 3px;
          background: var(--theme-color);
        }
        
        .two-column-slide {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        
        @media (max-width: 768px) {
          .slick-slide { padding: 0 5px; }
          .slick-list { margin: 0 -5px; }
          
          .two-column-slide {
            flex-direction: row;
            gap: 10px;
          }
          
          .gallery-img-container {
            flex: 1;
            margin-bottom: 0;
          }
        }
        
        @media (max-width: 480px) {
          .two-column-slide {
            flex-direction: column;
            gap: 0;
          }
          
          .gallery-img-container {
            margin-bottom: 10px;
          }
        }
      `}</style>

      <Breadcrumb
        pageName="Gallery"
        pageTitle="Gallery"
        bgImage="images/blog-page/blog-page-hero.jpg"
      />
      
      <div className="gallery-page-area mt-115">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-8 col-lg-10 col-md-12 col-sm-12 col-12">
              <div className="section-content-title text-center">
                <span className="text-uppercase theme-color f-700 fontNoto pb- d-block mb-6">
                  SIDDHARTHA Hospitality
                </span>
                <h2 className="mb-0">Our Gallery</h2>
              </div>
            </div>
          </div>
          
          <div className="row gallery-page-wrapper d-flex mt-55">
            <div className="col-12">
              <div className="gallery-description text-center">
                <p>Explore our collection of beautiful images showcasing our facilities and services.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="gallery-sections-area mt-105 mb-100">
        <div className="container">
          {isLoading ? (
            <div className="text-center py-5">
              <p>Loading gallery...</p>
            </div>
          ) : (
            galleryData.map((gallerySection, index) => {
              // Split images into pairs for two images per slide
              const imagePairs = chunkArray(gallerySection.images || [], 2);
              
              return (
                <div key={gallerySection.id || index} className="gallery-section">
                  <div className="row">
                    <div className="col-12">
                      <h3 className="gallery-title">{gallerySection.title}</h3>
                    </div>
                  </div>
                  
                  <div className="container-fluid px-md-4 px-2">
                    <div className="gallery-slider-container">
                      <Slider {...sliderSettings}>
                        {imagePairs.map((pair, pairIndex) => (
                          <div key={pairIndex}>
                            <div className="two-column-slide">
                              {pair.map((img, imgIndex) => (
                                <div key={imgIndex} className="gallery-img-container position-relative overflow-hidden" style={{ paddingBottom: "75%", height: "0" }}>
                                  <img
                                    className="position-absolute w-100 h-100 object-cover"
                                    src={getImageUrl(img)}
                                    alt={`${gallerySection.title} ${pairIndex * 2 + imgIndex + 1}`}
                                    loading={pairIndex > 1 ? "lazy" : "eager"}
                                    style={{ objectFit: "cover" }}
                                    onError={(e) => {
                                      // Fallback to default image if needed
                                      const defaultImages = DEFAULT_GALLERY_DATA[index % DEFAULT_GALLERY_DATA.length]?.images || [];
                                      e.target.src = defaultImages[(pairIndex * 2 + imgIndex) % defaultImages.length] || '/images/gallery/placeholder.jpg';
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </Slider>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </RoveroLayout>
  );
};
export default Page;