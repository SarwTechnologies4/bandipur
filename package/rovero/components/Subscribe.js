import Link from "next/link";
import { useEffect, useState } from "react";

const Subscribe = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_CMS_BASE_URL;
  const API_AUTH_TOKEN = process.env.NEXT_PUBLIC_CMS_TOKEN;

  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Image URL handler
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/bg/subscription-bg-img.jpg'; // Default fallback image
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
  };

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/consumer/membership_subscription`,
          {
            headers: {
              Authorization: `Bearer ${API_AUTH_TOKEN}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch subscription data");
        }

        const data = await response.json();
        setSubscriptionData(data.data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching subscription data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [API_BASE_URL, API_AUTH_TOKEN]);

  if (loading) {
    return <div className="text-center py-20">Loading subscription data...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">Error: {error}</div>;
  }

  if (!subscriptionData) {
    return null;
  }

  return (
    <div
      className="subscription-area about-subscription hm2 over-hidden position-relative bg-no-repeat bg-cover black-overly aos-init aos-animate"
      style={{ 
        backgroundImage: `url(${getImageUrl(subscriptionData.image)})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover'
      }}
      data-aos="fade-up"
      data-aos-duration={1000}
    >
      <div className="container subscription-padding pt-130 pb-140">
        <div className="row justify-content-center">
          <div className="col-xl-8 col-lg-8 col-md-10 col-sm-12 col-12">
            <div className="subscription-content text-center">
              <div className="section-content-title text-center">
                {/* title */}
                <h2 className="mb-15 text-white">
                  {subscriptionData.title}
                </h2>
                {/* description */}
                <p className="text-white">
                  {subscriptionData.description}
                </p>
                <div className="my-btn d-inline-block">
                  {/* link */}
                  <Link href={subscriptionData.link} className="btn theme-bg w-100">
                    Subscribe now
                  </Link>
                  
                  {/* Underlined white text below subscribe now button */}
                  <div className="mt-3">
                    <Link 
                      href="/membership" 
                      className="text-white text-decoration-underline"
                      style={{ 
                        fontSize: '16px',
                        fontWeight: '400',
                        transition: 'opacity 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                      onMouseLeave={(e) => e.target.style.opacity = '1'}
                    >
                      Learn more
                    </Link>
                  </div>
                </div>
              </div>
              {/* /section-title */}
            </div>
            {/* /subscription-content */}
          </div>
          {/* /col */}
        </div>
        {/* /row */}
      </div>
      {/* /container */}
    </div>
  );
};

export default Subscribe;