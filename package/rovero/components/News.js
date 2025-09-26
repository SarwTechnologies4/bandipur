"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_CMS_BASE_URL;
const API_AUTH_TOKEN = process.env.NEXT_PUBLIC_CMS_TOKEN;

const News = () => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleItems, setVisibleItems] = useState(3);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/consumer/damauli_news`, {
          headers: {
            Authorization: `Bearer ${API_AUTH_TOKEN}`,
          },
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setNewsData(data.data || []);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const loadMore = () => setVisibleItems(prev => prev + 3);

  if (loading) {
    return (
      <div className="blog-hm1-area mt-30 mb-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-6 col-lg-7 col-md-9 col-sm-12 col-12">
              <div className="title text-center">
                <span className="sub-title f-500 text-uppercase primary-color position-relative d-inline-block pb-15 mb-2">
                  Know More about us
                </span>
                <h2 className="mb-22">Latest News & Events</h2>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-hm1-area mt-30 mb-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-6 col-lg-7 col-md-9 col-sm-12 col-12">
              <div className="title text-center">
                <span className="sub-title f-500 text-uppercase primary-color position-relative d-inline-block pb-15 mb-2">
                  Error
                </span>
                <h2 className="mb-22">Failed to load news</h2>
                <p className="text-danger">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const groupedNews = [];
  for (let i = 0; i < Math.min(visibleItems, newsData.length); i += 3) {
    groupedNews.push(newsData.slice(i, i + 3));
  }

  return (
    <div className="blog-hm1-area mt-30 mb-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-6 col-lg-7 col-md-9 col-sm-12 col-12">
            <div className="title text-center">
              <span className="sub-title f-500 text-uppercase primary-color position-relative d-inline-block pb-15 mb-2">
                Know More about us
              </span>
              <h2 className="mb-22">Latest News & Events</h2>
              <p>Stay updated with our latest news and events</p>
            </div>
          </div>
        </div>

        {groupedNews.map((row, rowIndex) => (
          <div 
            key={rowIndex} 
            className="row blog-hm1-wrapper d-flex justify-content-center align-items-center mt-70"
          >
            {row.map((news) => (
              <div 
                key={news.id}
                className="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12 aos-init aos-animate"
                data-aos="fade-up"
                data-aos-duration={1000}
              >
                <div className="single-blog-wrapper blog-overly position-relative transition5 zoom-img-hover over-hidden transition5 d-flex align-items-center mb-30">
                  {/* Fixed height container with object-fit cover */}
                  <div className="blog-hm1-img w-100 position-relative transition5" style={{
                    height: '300px', // Fixed height
                    overflow: 'hidden'
                  }}>
                    <img
                      className="img w-100 h-100"
                      src={`${API_BASE_URL}${news.image}`}
                      alt={news.title}
                      style={{
                        objectFit: 'cover', // Ensures image covers the container
                        objectPosition: 'center', // Centers the image
                        width: '100%',
                        height: '100%'
                      }}
                    />
                  </div>
                  <div className="blog-hm1-content position-absolute transition5 z-index1 w-100 h-100">
                    <div className="blog-hm1-text position-absolute w-100 bottom-0 transition5 pl-25 pr-25 pt-20 pb-25">
                      <div className="blog-hm1-text-hover transition5">
                        <span className="text-white text-uppercase fontNoto f-700 d-inline-block">
                          {news.type || 'News'}
                        </span>
                        <div className="blog-hm-date d-inline-block position-relative pl-15 ml-15">
                          <span className="text-white d-block f-400">
                            {new Date(news.created_at).toLocaleDateString('en-US', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <h4 className="text-white mb-15 mt-1 mb-0">
                          <Link href={`/blog/${news.id}`}>
                            {news.title || 'Latest News'}
                          </Link>
                        </h4>
                      </div>
                      <div className="my-btn2 d-inline-block blog-btn transition5">
                        <Link
                          href={`/blog/${news.id}`}
                          className="btn position-relative rounded-0 transition5"
                        >
                          read more
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}

        {newsData.length > visibleItems && (
          <div className="row justify-content-center mt-4">
            <div className="col-12 text-center">
              <button 
                onClick={loadMore}
                className="btn theme-bg text-white"
              >
                Load More
              </button>
            </div>
          </div>
        )}

        {newsData.length > 3 && (
          <div className="row justify-content-center mt-4">
            <div className="col-12 text-center">
              <Link href="/blog" className="btn btn-outline-primary">
                See All News
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;