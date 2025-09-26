"use client";
import { use, useState, useEffect ,useRef} from 'react'; // Import 'use' directly
import RoveroLayout from "@/layouts/RoveroLayout";
import Link from "next/link";

const BlogDetailsPage = ({ params }) => {
  // Properly unwrap params using the 'use' hook
  const { id } = use(params);
  
  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY || document.documentElement.scrollTop;

      // Handle form stickiness
      let formShouldBeSticky = false;
      if (formRef.current) {
        const formTop = formRef.current.getBoundingClientRect().top;
        formShouldBeSticky = formTop <= navHeight && scrollPosition > navHeight;
        setIsSticky(formShouldBeSticky);
      }

      // Header sticky only if form is not sticky
      setIsHeaderSticky(scrollPosition > 100 && !formShouldBeSticky);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  useEffect(() => {
    // Fix for scroll utility error
    const handleScroll = () => {
      const scrollUp = document.querySelector(".scroll-up");
      if (scrollUp) {
        if (window.pageYOffset > 300) {
          scrollUp.classList.add("show");
        } else {
          scrollUp.classList.remove("show");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        if (!id || isNaN(id)) throw new Error('Invalid blog ID');

     const API_BASE_URL = process.env.NEXT_PUBLIC_CMS_BASE_URL;
  const API_AUTH_TOKEN = process.env.NEXT_PUBLIC_CMS_TOKEN;

        if (!API_BASE_URL || !API_AUTH_TOKEN) {
          throw new Error('API configuration missing');
        }

        const response = await fetch(
          `${API_BASE_URL}/api/consumer/damauli_news/${id}`,
          {
            headers: {
              Authorization: `Bearer ${API_AUTH_TOKEN}`,
              'Content-Type': 'application/json',
            },
            cache: 'no-store'
          }
        );

        if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
        setBlogData(await response.json());
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [id]);

  if (loading) {
    return (
      <RoveroLayout homeClass="hm2" isHeaderSticky={isHeaderSticky}>

        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading blog post...</p>
        </div>
      </RoveroLayout>
    );
  }

  if (error || !blogData?.data) {
    return (
      <RoveroLayout homeClass="hm2" isHeaderSticky={isHeaderSticky}>

        <div className="container py-5 text-center">
          <h1>{error || 'Blog Not Found'}</h1>
          <p>We couldn't find the blog post you're looking for.</p>
          <Link href="/blog" className="btn btn-primary">
            Back to Blog
          </Link>
        </div>
      </RoveroLayout>
    );
  }

  const { title, authorname, type, created_at, paragraphs, image } = blogData.data;
  const API_BASE_URL = process.env.NEXT_PUBLIC_CMS_BASE_URL;

  return (
    <RoveroLayout homeClass="hm2" isHeaderSticky={isHeaderSticky}>

      <div className="inner-page-hero-area">
        <div
          className="inner-page-height blog-details-page-height inner-page-bg d-flex align-items-end position-relative black-overly"
          style={{ 
            backgroundImage: `url(${API_BASE_URL}${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="container">
            <div className="row">
              <div className="col-12 d-flex align-items-end justify-content-center">
                <div className="inner-page-content text-center">
                  <h1 className="text-white mb-30 text-capitalize">
                    {title}
                  </h1>
                  <div className="news-page-info-wrapper d-md-flex align-items-center justify-content-center mb-80">
                    <ul className="news-page-info mb-1 mb-md-0">
                      <li className="text-white text-uppercase fontNoto f-500 mr-20 d-inline-block">
                        <span className="text-white pr-1">
                          <i className="fas fa-user" />
                        </span>
                        {authorname}
                      </li>
                      <li className="text-white text-uppercase fontNoto f-500 mr-20 d-inline-block">
                        <span className="text-white pr-1">
                          <i className="fas fa-folder-open" />
                        </span>
                        {type}
                      </li>
                    </ul>
                    <ul className="news-page-info-comment">
                      <li className="text-white text-capitalize secondary-color mr-20 d-inline-block">
                        <span className="text-white pr-1">
                          <i className="fas fa-clock" />
                        </span>
                        {new Date(created_at).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="blog-details-page-area mt-110 mb-120">
        <div className="blog-details-page-content-wpapper">
          <div className="container">
            <div 
              className="b-details-page-content mb-45" 
              dangerouslySetInnerHTML={{ __html: paragraphs }} 
            />
            
            
          </div>
        </div>
      </div>
    </RoveroLayout>
  );
};

export default BlogDetailsPage;