'use client'
import Breadcrumb from "@/components/Breadcrumb";
import RoveroLayout from "@/layouts/RoveroLayout";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_CMS_BASE_URL;
const API_AUTH_TOKEN = process.env.NEXT_PUBLIC_CMS_TOKEN;

const page = () => {
  const [dinings, setDinings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const formRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    const fetchDinings = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/consumer/damauli_dinings_01`, {
          headers: {
            'Authorization': `Bearer ${API_AUTH_TOKEN}`
          }
        });
        const data = await response.json();
        setDinings(data.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dining areas:", error);
        setLoading(false);
      }
    };

    fetchDinings();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY || document.documentElement.scrollTop;
      setIsHeaderSticky(scrollPosition > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/default-dining.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
  };

  const renderDining = (dining, index) => {
    if (isMobile) {
      // Mobile-specific design
      return (
        <div className="col-12 px-3 mb-5" key={dining.id}>
          <div className="mobile-dining-card shadow-sm rounded overflow-hidden">
            {/* Image at top */}
            <div className="mobile-dining-image-container">
              <img
                className="w-100"
                src={getImageUrl(dining.image)}
                alt={`${dining.name} image`}
                onError={(e) => {
                  e.target.src = '/images/default-dining.jpg';
                }}
                style={{ height: '250px', objectFit: 'cover' }}
              />
            </div>
            
            {/* Content below image */}
            <div className="mobile-dining-content p-3">
              <h3 className="mobile-dining-title mb-3">
                {dining.name}
              </h3>
              
              <p className="mobile-dining-description text-muted mb-0">
                {dining.description}
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Desktop design - alternating layout
    const isEvenIndex = index % 2 === 0;

    if (isEvenIndex) {
      return (
        <div className="row dining-wrapper no-gutters align-items-md-center img-hover-effect-wrapper" key={dining.id}>
          {/* Image on left */}
          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 px-xl-0">
            <div className="dining-img transition5 zoom-img-hover img-hover-effect2 over-hidden position-relative">
              <img
                className="w-100 img"
                src={getImageUrl(dining.image)}
                alt={`${dining.name} image`}
                onError={(e) => {
                  e.target.src = '/images/default-dining.jpg';
                }}
                style={{ height: '400px', objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* Content on right */}
          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
            <DiningContent dining={dining} />
          </div>
        </div>
      );
    } else {
      return (
        <div className="row dining-wrapper dining-wrapper2 no-gutters align-items-md-center flex-column-reverse flex-md-row img-hover-effect-wrapper" key={dining.id}>
          {/* Content on left */}
          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
            <DiningContent dining={dining} />
          </div>

          {/* Image on right */}
          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
            <div className="dining-img zoom-img-hover transition5 img-hover-effect2 over-hidden position-relative">
              <img
                className="w-100 img"
                src={getImageUrl(dining.image)}
                alt={`${dining.name} image`}
                onError={(e) => {
                  e.target.src = '/images/default-dining.jpg';
                }}
                style={{ height: '400px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <RoveroLayout homeClass="hm2" isHeaderSticky={isHeaderSticky}>
        <Breadcrumb
          pageName="Dining"
          bgImage="images/blog-page/blog-page-hero.jpg"
          pageTitle="Dining"
        />
        <div className="text-center py-5">Loading dining areas...</div>
      </RoveroLayout>
    );
  }

  return (
    <RoveroLayout homeClass="hm2" isHeaderSticky={isHeaderSticky}>
      <Breadcrumb
        pageName="Dining"
        bgImage="images/blog-page/blog-page-hero.jpg"
        pageTitle="Dining"
      />
      
      <div className="dining-area mt-120 mb-120">
        <div className="container-fluid container-wrapper p-md-0">
          {dinings.length > 0 ? (
            dinings.map((dining, index) => renderDining(dining, index))
          ) : (
            <div className="text-center py-5">
              <p>No dining areas found.</p>
            </div>
          )}
        </div>
      </div>
    </RoveroLayout>
  );
};

// Separate component for dining content to avoid duplication
const DiningContent = ({ dining }) => {
  return (
    <div className="dining-content mt--10 dining-content-margin p-4 p-md-5">
      <div className="section-content-title">
        <h2 className="mb-22">
          {dining.name}
        </h2>
        <p className="text-muted">{dining.description}</p>
      </div>

      <style jsx>{`
        .dining-content {
          background: #fff;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        @media (max-width: 768px) {
          .dining-content {
            padding: 1.5rem !important;
          }
        }
        
        .mobile-dining-card {
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .mobile-dining-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        
        .mobile-dining-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #333;
        }
      `}</style>
    </div>
  );
};

export default page;