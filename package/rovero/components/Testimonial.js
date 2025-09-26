"use client";
import { sliderProps } from "@/utility/sliderProps";
import Slider from "react-slick";
import { useState, useEffect } from "react";

const Testimonial = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_CMS_BASE_URL;
  const API_AUTH_TOKEN = process.env.NEXT_PUBLIC_CMS_TOKEN;

  // Image URL handler
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/testimonial/default-testimonial.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
  };

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/consumer/damauli_testimonials`,
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
        setTestimonials(data);
      } catch (err) {
        setError(err.message || "Failed to load testimonials");
        console.error("Error fetching testimonials:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [API_BASE_URL, API_AUTH_TOKEN]);

  if (loading) {
    return (
      <div className="testimonial-area testimonial-bg position-relative mb-20">
        <div className="container hm1-testi-padding pt-110">
          <div className="row justify-content-center">
            <div className="col-12 text-center py-5">Loading testimonials...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="testimonial-area testimonial-bg position-relative mb-20">
        <div className="container hm1-testi-padding pt-110">
          <div className="row justify-content-center">
            <div className="col-12 text-center py-5">Error: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!testimonials.length) {
    return (
      <div className="testimonial-area testimonial-bg position-relative">
        <div className="container hm1-testi-padding pt-110">
          <div className="row justify-content-center">
            <div className="col-12 text-center py-5">No testimonials available</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="testimonial-area testimonial-bg position-relative">
      <style jsx>{`
        .testimonial-avatar {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border: 3px solid white;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }
        .testimonial-avatar:hover {
          transform: scale(1.05);
        }
        .avatar-container {
          position: absolute;
          top: -40px;
          left: 50%;
          transform: translateX(-50%);
        }
      `}</style>

      <div className="container hm1-testi-padding pt-110">
        <div className="row justify-content-center">
          <div className="col-xl-6 col-lg-7 col-md-9 col-sm-12 col-12">
            <div className="title text-center">
              <span className="sub-title f-500 text-uppercase primary-color position-relative d-inline-block pb-15 mb-2">
                Testimonial &amp; Review
              </span>
              <h2 className="mb-22">What People Say</h2>
            </div>
          </div>
        </div>
        
        <div
          className="testimonial-wrapper aos-init aos-animate"
          data-aos="fade-up"
          data-aos-duration={1000}
        >
          <Slider
            {...sliderProps.testimonialActive}
            className="row testimonial-active main-style mt-65 pb-65 justify-content-center"
          >
            {testimonials.map((testimonial) => (
              <div className="px-3" key={testimonial.id}>
                <div className="single-testimonial bg-white text-center position-relative pt-30 pb-45 pl-30 pr-30 mt-50 mb-20 transition5">
                  {/* Avatar with fixed size */}
                  <div className="avatar-container">
                    <img
                      className="testimonial-avatar rounded-circle"
                      src={getImageUrl(testimonial.image)}
                      alt={testimonial.name}
                      onError={(e) => {
                        e.target.src = '/images/testimonial/default-testimonial.jpg';
                      }}
                    />
                  </div>
                  
                  <ul className="review-ratting mt-45 mb-20">
                    <li>
                      <span><i className="fa fa-star" /></span>
                      <span><i className="fa fa-star" /></span>
                      <span><i className="fa fa-star" /></span>
                      <span><i className="fa fa-star" /></span>
                      <span><i className="fa fa-star" /></span>
                    </li>
                  </ul>
                  
                  <p className="testimonial-text">{testimonial.description}</p>
                  
                  <div className="testi-info text-center mt-30">
                    <h5 className="mb-1">{testimonial.name}</h5>
                    <span className="meta-text-color mb-0">
                      {testimonial.designation}
                    </span>
                  </div>
                </div>
              </div>
              
            ))}
          </Slider>
          <br />
        </div>
      </div>
    </div>
  );
};

export default Testimonial;