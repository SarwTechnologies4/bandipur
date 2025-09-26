"use client";
import Isotope from "isotope-layout";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

  const API_BASE_URL = process.env.NEXT_PUBLIC_CMS_BASE_URL;
  const API_AUTH_TOKEN = process.env.NEXT_PUBLIC_CMS_TOKEN;

const BlogIsotope = () => {
  const isotope = useRef();
  const [filterKey, setFilterKey] = useState("*");
  const [blogData, setBlogData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/consumer/damauli_news`, {
          headers: {
            Authorization: `Bearer ${API_AUTH_TOKEN}`,
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setBlogData(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      isotope.current = new Isotope(".grid", {
        itemSelector: ".grid-item",
        percentPosition: true,
        masonry: {
          columnWidth: ".grid-item",
        },
        animationOptions: {
          duration: 750,
          easing: "linear",
          queue: false,
        },
      });
    }, 500);
  }, [blogData]); // Reinitialize Isotope when blogData changes

  useEffect(() => {
    if (isotope.current) {
      filterKey === "*"
        ? isotope.current.arrange({ filter: `*` })
        : isotope.current.arrange({ filter: `.${filterKey}` });
    }
  }, [filterKey]);

  const handleFilterKeyChange = (key) => () => {
    setFilterKey(key);
  };

  const activeBtn = (value) => (value === filterKey ? "active" : "");

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error) return <div className="text-center py-5 text-danger">Error: {error}</div>;

  return (
    <div className="blog-page-area mt-100 mb-120">
      <div className="container">
        <div className="row">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 text-center">
            <div className="port-button mb-40 portfolio-menu">
              <button
                className={activeBtn("*")}
                onClick={handleFilterKeyChange("*")}
              >
                All
              </button>
              <button
                className={activeBtn("news")}
                onClick={handleFilterKeyChange("news")}
                data-filter=".news"
              >
                News
              </button>
              <button
                className={activeBtn("events")}
                onClick={handleFilterKeyChange("events")}
                data-filter=".events"
              >
                Events
              </button>
              <button
                className={activeBtn("blog")}
                onClick={handleFilterKeyChange("blog")}
                data-filter=".blog"
              >
                Blog
              </button>
              <button
                className={activeBtn("story")}
                onClick={handleFilterKeyChange("story")}
                data-filter=".story"
              >
                Stories
              </button>
            </div>
          </div>
        </div>
        
        <div className="row portfolio grid justify-content-center">
          {blogData.map((item) => (
            <div 
              key={item.id} 
              className={`col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 grid-item ${item.type}`}
            >
              <div className="single-blog-page-wrapper zoom-img-hover transition5 position-relative over-hidden mb-30">
                <div className="blog-page-img over-hidden">
                  <img
                    className="w-100 img"
                    src={`${API_BASE_URL}${item.image}`}
                    alt={item.title}
                  />
                </div>
                <div className="blog-page-content pt-25 pb-25 pl-30 pr-30">
                  <span className="text-uppercase fontNoto f-700 d-inline-block">
                    {item.type}
                  </span>
                  <div className="blog-hm-date d-inline-block position-relative pl-15 ml-15">
                    <span className="d-block f-400">
                      {new Date(item.created_at).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <h4>
                    <Link href={`/blog/${item.id}`}>{item.title}</Link>
                  </h4>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="blog-page-btn transparent-btn text-center mt-30">
          <div className="my-btn d-inline-block ">
            <Link href="#" className="btn bg-transparent w-100">
              load more
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogIsotope;