"use client"
import { useState, useEffect } from "react";

const PointsActionsSection = () => {
  const [activePointsTab, setActivePointsTab] = useState("");
  const [pointsData, setPointsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_CMS_BASE_URL;
  const API_AUTH_TOKEN = process.env.NEXT_PUBLIC_CMS_TOKEN;

  useEffect(() => {
    const fetchPointsData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/api/consumer/membership_points`,
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
        
        // Transform API data to match our component structure
        const transformedData = {};
        
        // Process points data and remove duplicates by title
        const uniquePoints = [];
        const seenTitles = new Set();
        
        data.data.points.forEach(point => {
          if (!seenTitles.has(point.title)) {
            seenTitles.add(point.title);
            uniquePoints.push(point);
          }
        });
        
        // Convert to the format we need for the tabs
        uniquePoints.forEach(point => {
          const tabKey = point.title.toLowerCase().replace(/\s+/g, '_');
          transformedData[tabKey] = {
            title: point.title,
            description: point.description,
            icon: point.icon
          };
        });
        
        setPointsData(transformedData);
        setLoading(false);
        
        // Set the first tab as active if points data is available
        if (Object.keys(transformedData).length > 0) {
          setActivePointsTab(Object.keys(transformedData)[0]);
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error("Failed to fetch points data:", err);
      }
    };

    fetchPointsData();
  }, [API_BASE_URL, API_AUTH_TOKEN]);

  // Icon components based on type - now using actual URLs from API
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

  if (loading) {
    return (
      <section className="points-actions-section">
        <div className="container">
          <div className="loading-container text-center py-5">
            <div className="spinner"></div>
            <p>Loading points information...</p>
          </div>
        </div>
        
        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 60px 0;
          }
          
          .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #1e3a5f;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin-bottom: 15px;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </section>
    );
  }

  if (error) {
    return (
      <section className="points-actions-section">
        <div className="container">
          <div className="error-container text-center py-5">
            <h3>Error Loading Points Information</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        </div>
        
        <style jsx>{`
          .error-container {
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
      </section>
    );
  }

  if (!pointsData || Object.keys(pointsData).length === 0) {
    return null;
  }

  return (
    <section className="points-actions-section">
      <div className="container">
        <h2 className="section-title text-center mb-5">SIDDHARTHA Yatra</h2>
        
        <div className="points-tabs">
          <div className="row justify-content-center">
            {Object.keys(pointsData).map((tabKey) => (
              <div className="col" key={tabKey}>
                <div 
                  className={`tab-item ${activePointsTab === tabKey ? 'active' : ''}`}
                  onClick={() => setActivePointsTab(tabKey)}
                >
                  <div className="tab-icon">
                    {renderIcon(pointsData[tabKey].icon)}
                  </div>
                  <span>{pointsData[tabKey].title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="tab-content mt-4">
          <div className="points-tab-content">
            <h3>{pointsData[activePointsTab]?.title}</h3>
            <p>{pointsData[activePointsTab]?.description}</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .points-actions-section {
          padding: 80px 0;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1e3a5f;
          margin-bottom: 2rem;
        }

        .points-tabs {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }

        .points-tabs .row {
          --bs-gutter-x: 0.5rem;
        }

        .tab-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding: 1.5rem 1rem;
          border-radius: 8px;
          transition: all 0.3s ease;
          cursor: pointer;
          text-align: center;
          height: 120px; /* Fixed height for uniform appearance */
          width: 100%;
          position: relative;
        }

        .tab-item:hover,
        .tab-item.active {
          background-color: #1e3a5f;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(30, 58, 95, 0.2);
        }

        .tab-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.75rem;
          border-radius: 50%;
          background-color: #f0f0f0;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .tab-item.active .tab-icon,
        .tab-item:hover .tab-icon {
          background-color: rgba(255, 255, 255, 1);
        }

        .tab-item span {
          font-size: 0.9rem;
          font-weight: 600;
          line-height: 1.3;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          width: 100%;
          flex-grow: 1;
          hyphens: auto;
          word-break: break-word;
        }

        .tab-content {
          background: white;
          padding: 2.5rem;
          border-radius: 8px;
          border: 1px solid #e9ecef;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .points-tab-content h3 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1e3a5f;
          margin-bottom: 1rem;
        }

        .points-tab-content p {
          color: #666;
          line-height: 1.7;
          font-size: 1.05rem;
          margin: 0;
        }

        @media (max-width: 992px) {
          .points-tabs .row {
            --bs-gutter-x: 0.25rem;
          }

          .tab-item {
            height: 110px;
            padding: 1rem 0.75rem;
          }

          .tab-item span {
            font-size: 0.85rem;
          }
        }

        @media (max-width: 768px) {
          .section-title {
            font-size: 2rem;
          }

          .points-actions-section {
            padding: 40px 0;
          }

          .points-tabs .row {
            --bs-gutter-x: 0.5rem;
          }

          .tab-item {
            height: 100px;
            padding: 1rem 0.5rem;
          }

          .tab-item span {
            font-size: 0.8rem;
            line-height: 1.2;
          }

          .tab-icon {
            width: 40px;
            height: 40px;
            margin-bottom: 0.5rem;
          }

          .tab-content {
            padding: 2rem 1.5rem;
          }

          .points-tab-content h3 {
            font-size: 1.5rem;
          }

          .points-tab-content p {
            font-size: 1rem;
          }
        }

        @media (max-width: 576px) {
          .points-tabs .row {
            flex-wrap: wrap;
          }

          .points-tabs .col {
            flex: 0 0 50%;
            max-width: 50%;
            margin-bottom: 0.5rem;
          }

          .tab-item {
            height: 90px;
            padding: 0.75rem 0.5rem;
          }

          .tab-icon {
            width: 36px;
            height: 36px;
          }

          .tab-item span {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </section>
  );
};

export default PointsActionsSection;