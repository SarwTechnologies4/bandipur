"use client";

import Breadcrumb from "@/components/Breadcrumb";
import Subscribe from "@/components/Subscribe";
import Testimonial from "@/components/Testimonial";
import RoveroLayout from "@/layouts/RoveroLayout";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import dynamic from 'next/dynamic';

// Dynamically import the slider to reduce initial bundle size
const Slider = dynamic(() => import('react-slick'), {
  ssr: false,
  loading: () => <div className="slick-loading" style={{ minHeight: '200px' }} />
});

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Default data to show immediately while loading
const DEFAULT_ABOUT_DATA = {
  title: "Welcome to SIDDHARTHA Hospitality",
  description: "<p>Experience exceptional hospitality with our premium services and comfortable accommodations.</p>",
  titleimage: "/images/about-page/about-page-herocopy.jpg",
  gallery: [
    "/images/about-page/about-gallery-img1.jpg",
    "/images/about-page/about-gallery-img2.jpg",
    "/images/about-page/about-gallery-img3.jpg"
  ]
};

const DEFAULT_SPECIALITIES = {
  specialitydescription: "SIDDHARTHA Hospitality provides various kinds of special facilities",
  specialities: Array(6).fill().map((_, i) => ({
    id: i,
    title: `Speciality ${i+1}`,
    description: `Premium service feature ${i+1} for your comfort`,
    icon: `/images/icon/ab-choose-icon${i+1}.png`
  }))
};

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
  const [aboutData, setAboutData] = useState(DEFAULT_ABOUT_DATA);
  const [specialitiesData, setSpecialitiesData] = useState(DEFAULT_SPECIALITIES);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const formRef = useRef(null);
  const sliderRef = useRef(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_CMS_BASE_URL;
  const API_AUTH_TOKEN = process.env.NEXT_PUBLIC_CMS_TOKEN;

  // Image URL handler
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/about-page/about-page-herocopy.jpg';
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
        const [aboutRes, specialitiesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/consumer/damauli_aboutus_01`, {
            headers: { 'Authorization': `Bearer ${API_AUTH_TOKEN}` }
          }),
          fetch(`${API_BASE_URL}/api/consumer/damauli_speciality`, {
            headers: { 'Authorization': `Bearer ${API_AUTH_TOKEN}` }
          })
        ]);

        if (aboutRes.ok) {
          const aboutJson = await aboutRes.json();
          setAboutData(prev => ({ ...prev, ...aboutJson.data }));
        }

        if (specialitiesRes.ok) {
          const specialitiesJson = await specialitiesRes.json();
          setSpecialitiesData(prev => ({ ...prev, ...specialitiesJson.data }));
        }
      } catch (err) {
        console.error('API fetch error:', err);
        // Silently fail - we already have default data
      }
    };

    fetchData();
  }, [API_BASE_URL, API_AUTH_TOKEN]);

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

  const renderDescription = (htmlString) => {
    return { __html: htmlString || DEFAULT_ABOUT_DATA.description };
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
        }
        
        .ser-icon img { width: 40px; height: 40px; object-fit: contain; }
        
        .slick-loading {
          background: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        @media (max-width: 768px) {
          .slick-slide { padding: 0 5px; }
          .slick-list { margin: 0 -5px; }
        }
      `}</style>

      <Breadcrumb
        pageName="About"
        pageTitle="About us"
        bgImage="/images/about-page/about-page-herocopy.jpg"
      />
      
      <div className="about-page-area mt-115">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-8 col-lg-10 col-md-12 col-sm-12 col-12">
              <div className="section-content-title text-center">
                <span className="text-uppercase theme-color f-700 fontNoto pb- d-block mb-6">
                  SIDDHARTHA Hospitality
                </span>
                <h2 className="mb-0">{aboutData.title}</h2>
              </div>
            </div>
          </div>
          
          <div className="row about-page-wrapper d-flex mt-55">
            <div className="col-12">
              <div 
                className="about-description" 
                dangerouslySetInnerHTML={renderDescription(aboutData.description)}
              />
            </div>
          </div>
        </div>
      </div>
      
      {aboutData.gallery?.length > 0 && (
        <div className="about-photo-gallery-area mt-105 mb-100">
          <div className="container-fluid px-md-4 px-2">
            <div className="row justify-content-center">
              <div className="col-xl-8 col-lg-10 col-md-12 col-sm-12 col-12">
                <div className="section-content-title text-center mb-50">
                  <h2 className="mb-0">Our Gallery</h2>
                </div>
              </div>
            </div>
            
            <div className="gallery-slider-container">
              <Slider ref={sliderRef} {...sliderSettings}>
                {(aboutData.gallery || DEFAULT_ABOUT_DATA.gallery).map((img, index) => (
                  <div key={index}>
                    <div className="gallery-slide-item h-100 mx-1">
                      <div className="gallery-img-container position-relative overflow-hidden" style={{ paddingBottom: "75%", height: "0" }}>
                        <img
                          className="position-absolute w-100 h-100 object-cover"
                          src={getImageUrl(img)}
                          alt={`Gallery ${index + 1}`}
                          loading={index > 2 ? "lazy" : "eager"}
                          style={{ objectFit: "cover" }}
                          onError={(e) => {
                            e.target.src = DEFAULT_ABOUT_DATA.gallery[index % DEFAULT_ABOUT_DATA.gallery.length];
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      )}
      
      <div className="why-choose-us-area mb-95">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-6 col-lg-8 col-md-9 col-sm-12 col-12">
              <div className="title text-center">
                <span className="sub-title f-500 text-uppercase primary-color position-relative d-inline-block pb-15 mb-2">
                  We are Awesome
                </span>
                <h2 className="mb-22">Our Speciality</h2>
                <p>
                  {specialitiesData?.specialitydescription || DEFAULT_SPECIALITIES.specialitydescription}
                </p>
              </div>
            </div>
          </div>
          
          <div className="row choose-us-wrapper mt-50">
            {(specialitiesData?.specialities || DEFAULT_SPECIALITIES.specialities).map((speciality, index) => (
              <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12" key={speciality.id || index}>
                <div className="single-service pt-md-3 mb-4 d-flex">
                  <div className="ser-icon d-inline-block text-center mt-1">
                    <span className="d-block">
                      <img 
                        src={getImageUrl(speciality.icon)} 
                        alt={speciality.title}
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = `/images/icon/ab-choose-icon${(index % 6) + 1}.png`;
                        }}
                      />
                    </span>
                  </div>
                  <div className="service-text pl-25">
                    <h5 className="f-700 pb-md-2">
                      <Link href="rooms-details">{speciality.title}</Link>
                    </h5>
                    <p className="mb-0">
                      {speciality.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Testimonial />
      <br/>
      <br/>
      <Subscribe />
    </RoveroLayout>
  );
};

export default Page;