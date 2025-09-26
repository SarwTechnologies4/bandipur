"use client"
import Breadcrumb from "@/components/Breadcrumb";
import RoveroLayout from "@/layouts/RoveroLayout";
import PointsActionsSection from "@/components/PointsSection";
import dynamic from "next/dynamic";
import { useState, useRef, useEffect } from "react";

const page = () => {
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const [activeTier, setActiveTier] = useState("lhotse");
  const [tierData, setTierData] = useState(null);
  const [earnPointsData, setEarnPointsData] = useState([]);
  const [usePointsData, setUsePointsData] = useState([]);
  const [loading, setLoading] = useState({
    tier: true,
    earnPoints: true,
    usePoints: true
  });
  const [error, setError] = useState(null);
  const formRef = useRef(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_CMS_BASE_URL;
  const API_AUTH_TOKEN = process.env.NEXT_PUBLIC_CMS_TOKEN;

  useEffect(() => {
    const fetchTierData = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/consumer/membership_descriptions`,
          {
            headers: {
              'Authorization': `Bearer ${API_AUTH_TOKEN}`
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        const transformedData = {};
        data.data.forEach(tier => {
          const tierKey = tier.name.toLowerCase();
          transformedData[tierKey] = {
            title: tier.title,
            subtitle: tier.subtitle,
            benefits: tier.benefits.map(benefit => ({
              title: benefit.title,
              description: benefit.description,
              icon: benefit.icon
            }))
          };
        });
        
        setTierData(transformedData);
        setLoading(prev => ({ ...prev, tier: false }));
      } catch (err) {
        setError(err.message);
        setLoading(prev => ({ ...prev, tier: false }));
        console.error("Failed to fetch tier data:", err);
      }
    };

    const fetchEarnPointsData = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/consumer/membership_earnpoints`,
          {
            headers: {
              'Authorization': `Bearer ${API_AUTH_TOKEN}`
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setEarnPointsData(data.data["earn points"] || []);
        setLoading(prev => ({ ...prev, earnPoints: false }));
      } catch (err) {
        console.error("Failed to fetch earn points data:", err);
        setLoading(prev => ({ ...prev, earnPoints: false }));
      }
    };

    const fetchUsePointsData = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/consumer/membership_buypoints`,
          {
            headers: {
              'Authorization': `Bearer ${API_AUTH_TOKEN}`
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setUsePointsData(data.data.points || []); // FIXED: Changed from data.data["use points"] to data.data.points
        setLoading(prev => ({ ...prev, usePoints: false }));
      } catch (err) {
        console.error("Failed to fetch use points data:", err);
        setLoading(prev => ({ ...prev, usePoints: false }));
      }
    };

    // Fetch all data in parallel
    Promise.all([
      fetchTierData(),
      fetchEarnPointsData(),
      fetchUsePointsData()
    ]);
  }, [API_BASE_URL, API_AUTH_TOKEN]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY || document.documentElement.scrollTop;

      let formShouldBeSticky = false;
      if (formRef.current) {
        const formTop = formRef.current.getBoundingClientRect().top;
        const navHeight = 80;
        formShouldBeSticky = formTop <= navHeight && scrollPosition > navHeight;
      }

      setIsHeaderSticky(scrollPosition > 100 && !formShouldBeSticky);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderIcon = (iconUrl) => {
    return (
      <img 
        src={iconUrl} 
        alt="Benefit icon" 
        width="32" 
        height="32"
        style={{objectFit: 'contain'}}
      />
    );
  };

  const isLoading = loading.tier || loading.earnPoints || loading.usePoints;

  if (isLoading) {
    return (
      <RoveroLayout homeClass="hm2" isHeaderSticky={isHeaderSticky}>
        <Breadcrumb
          pageName="membership"
          bgImage="images/blog-page/blog-page-hero.jpg"
          pageTitle="Yatra Club"
        />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading membership information...</p>
        </div>
        
        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 100px 0;
          }
          
          .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #1e3a5f;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </RoveroLayout>
    );
  }

  if (error) {
    return (
      <RoveroLayout homeClass="hm2" isHeaderSticky={isHeaderSticky}>
        <Breadcrumb
          pageName="membership"
          bgImage="images/blog-page/blog-page-hero.jpg"
          pageTitle="Yatra Club"
        />
        <div className="error-container">
          <h3>Error Loading Yatra Club Information</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
        
        <style jsx>{`
          .error-container {
            text-align: center;
            padding: 100px 20px;
            color: #d32f2f;
          }
          
          .error-container button {
            background-color: #1e3a5f;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 20px;
          }
        `}</style>
      </RoveroLayout>
    );
  }

  return (
    <RoveroLayout homeClass="hm2" isHeaderSticky={isHeaderSticky}>
      <Breadcrumb
        pageName="Yatra Club"
        bgImage="images/blog-page/blog-page-hero.jpg"
        pageTitle="Yatra Club"
      />
      <div className="membership-container">
        {/* Yatra Club Tiers Section */}
        <section className="Yatra Club-tiers-section">
          <div className="container">
            {/* Tier Navigation */}
            <div className="tier-navigation">
              <div className="row justify-content-center">
                {tierData && Object.keys(tierData).map((tierKey) => (
                  <div className="col-auto" key={tierKey}>
                    <div 
                      className={`tier-tab ${activeTier === tierKey ? 'active' : ''}`}
                      onClick={() => setActiveTier(tierKey)}
                    >
                      <span>{tierKey.charAt(0).toUpperCase() + tierKey.slice(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tier Content */}
            {tierData && tierData[activeTier] && (
              <div className="tier-content">
                <div className="tier-header text-center">
                  <h2 className="tier-title">{tierData[activeTier].title}</h2>
                  <p className="tier-subtitle">{tierData[activeTier].subtitle}</p>
                </div>

                {/* Benefits Grid */}
                <div className="benefits-grid">
                  <div className="row">
                    {tierData[activeTier].benefits.map((benefit, index) => (
                      <div className="col-lg-6" key={index}>
                        <div className="benefit-item">
                          <div className="benefit-icon">
                            {renderIcon(benefit.icon)}
                          </div>
                          <div className="benefit-content">
                            <h6>{benefit.title}</h6>
                            <p>{benefit.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Earn Points Section */}
        <section className="earn-points-section">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="image-wrapper">
                  <img 
                    src="/images/about/Lobby.jpg" 
                    alt="Hotel guests with luggage at entrance"
                    className="img-fluid points-image"
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="content-wrapper">
                  <h2 className="section-title">Earn Points</h2>
                  
                  <div className="points-list">
                    {earnPointsData.map((item, index) => (
                      <div className="points-item" key={index}>
                        <h6>{item.title}</h6>
                        <p>{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Use Points Section */}
        <section className="use-points-section">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 order-lg-2">
                <div className="image-wrapper">
                  <img 
                    src="/images/about/restaurant.jpg" 
                    alt="Underwater restaurant dining experience"
                    className="img-fluid points-image"
                  />
                </div>
              </div>
              <div className="col-lg-6 order-lg-1">
                <div className="content-wrapper">
                  <h2 className="section-title">Use Points</h2>
                  
                  <div className="points-list">
                    {usePointsData.map((item, index) => (
                      <div className="points-item" key={index}>
                        <h6>{item.title}</h6>
                        <p>{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Points Actions Section */}
        <PointsActionsSection />
      </div>

      <style jsx>{`
        .membership-container {
          padding: 60px 0;
        }

        .membership-tiers-section {
          padding: 40px 0 80px 0;
          background-color: #f8f9fa;
        }

        .tier-navigation {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          margin-bottom: 3rem;
        }

        .tier-tab {
          text-align: center;
          padding: 1.5rem 2rem;
          cursor: pointer;
          position: relative;
          transition: all 0.3s ease;
          min-width: 150px;
        }

        .tier-tab span {
          font-size: 1.1rem;
          font-weight: 600;
          color: #666;
          transition: color 0.3s ease;
        }

        .tier-tab.active span {
          color: #1e3a5f;
        }

        .tier-tab.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background-color: #1e3a5f;
          border-radius: 3px 3px 0 0;
        }

        .tier-content {
          background: white;
          border-radius: 12px;
          padding: 3rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }

        .tier-header {
          margin-bottom: 3rem;
        }

        .tier-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1e3a5f;
          margin-bottom: 1rem;
        }

        .tier-subtitle {
          font-size: 1.1rem;
          color: #666;
          margin-bottom: 1.5rem;
        }

        .benefits-grid {
          margin-top: 2rem;
        }

        .benefit-item {
          display: flex;
          align-items: flex-start;
          padding: 1.5rem;
          margin-bottom: 2rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .benefit-item:hover {
          background-color: #f8f9fa;
        }

        .benefit-icon {
          flex-shrink: 0;
          width: 48px;
          height: 48px;
          background-color: #e3f2fd;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1rem;
          color: #1e3a5f;
        }

        .benefit-content h6 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1e3a5f;
          margin-bottom: 0.5rem;
          line-height: 1.3;
        }

        .benefit-content p {
          color: #666;
          line-height: 1.6;
          margin: 0;
        }

        /* Points Sections Styling */
        .earn-points-section,
        .use-points-section {
          padding: 80px 0;
          background-color: #ffffff;
        }

        .use-points-section {
          background-color: #f8f9fa;
        }

        .image-wrapper {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
        }

        .points-image {
          width: 100%;
          height: 400px;
          object-fit: cover;
          border-radius: 12px;
          transition: transform 0.3s ease;
        }

        .image-wrapper:hover .points-image {
          transform: scale(1.05);
        }

        .content-wrapper {
          padding: 0 2rem;
        }

        .section-title {
          font-size: 3rem;
          font-weight: 700;
          color: #1e3a5f;
          margin-bottom: 2.5rem;
          line-height: 1.2;
        }

        .points-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .points-item {
          padding: 0;
          border: none;
          background: transparent;
        }

        .points-item h6 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1e3a5f;
          margin-bottom: 0.5rem;
          line-height: 1.3;
        }

        .points-item p {
          font-size: 1rem;
          color: #666666;
          line-height: 1.6;
          margin: 0;
          font-weight: 400;
        }

        /* Responsive Design */
        @media (max-width: 991px) {
          .earn-points-section,
          .use-points-section {
            padding: 60px 0;
          }

          .content-wrapper {
            padding: 2rem 0 0 0;
            text-align: center;
          }

          .section-title {
            font-size: 2.5rem;
            margin-bottom: 2rem;
          }

          .points-image {
            height: 300px;
          }
        }

        @media (max-width: 768px) {
          .tier-title {
            font-size: 2rem;
          }
          
          .tier-content {
            padding: 2rem 1.5rem;
          }

          .tier-tab {
            padding: 1rem 1.2rem;
            min-width: 120px;
          }

          .tier-tab span {
            font-size: 1rem;
          }

          .benefit-item {
            padding: 1rem;
            flex-direction: column;
            text-align: center;
          }

          .benefit-icon {
            margin-right: 0;
            margin-bottom: 1rem;
          }

          .earn-points-section,
          .use-points-section {
            padding: 40px 0;
          }

          .section-title {
            font-size: 2rem;
            margin-bottom: 1.5rem;
          }

          .points-item h6 {
            font-size: 1.2rem;
          }

          .points-item p {
            font-size: 0.95rem;
          }

          .points-image {
            height: 250px;
          }

          .content-wrapper {
            padding: 1.5rem 0 0 0;
          }
        }

        @media (max-width: 576px) {
          .points-list {
            gap: 1.2rem;
          }

          .points-item h6 {
            font-size: 1.1rem;
          }

          .section-title {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </RoveroLayout>
  );
};

export default page;