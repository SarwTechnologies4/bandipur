"use client";
import { RoveroUtility } from "@/utility/roveroUtility";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const DesktopMenu = () => {
  const pathname = usePathname();
  
  return (
    <nav id="mobile-menu" className="d-none d-xl-block">
      <ul className="d-block">
        <li>
          <Link href="/" className={pathname === '/' ? 'active' : ''}>
            Home
          </Link>
        </li>
                <li>
          <Link 
            href="/events"
            className={pathname === '/events' ? 'active' : ''}
          >
            Events
          </Link>
        </li>



        <li>
          <Link 
            href="/rooms2"
            className={pathname === '/rooms2' ? 'active' : ''}
          >
            Rooms
          </Link>
        </li>
                <li>
          <Link 
            href="/dining"
            className={pathname === '/dining' ? 'active' : ''}
          >
            Dining
          </Link>
        </li>

                <li>
          <Link 
            href="/membership"
            className={pathname === '/membership' ? 'active' : ''}
          >
            Yatra
          </Link>
        </li>

                <li>
          <a href="#">More</a>
          <ul className="mega-menu mega-dropdown-menu white-bg ml-0">
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/gallery">Gallery</Link>
            </li>
            <li>
              <Link href="/blog">Blog</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </li>

        
        
      </ul>
    </nav>
  );
};

const MobileMenu = () => {
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState("");

  const activeMenuSet = (value) =>
    setActiveMenu(activeMenu === value ? "" : value);
  
  const activeLi = (value) =>
    value === activeMenu ? { display: "block" } : { display: "none" };

  return (
    <nav className="mean-nav d-block d-xl-none">
      <ul className="d-block">
        <li>
          <Link 
            href="/" 
            className={pathname === '/' ? 'active' : ''}
            aria-current="page"
          >
            Home
          </Link>
        </li>
        <li>
          <Link 
            href="/about"
            className={pathname === '/about' ? 'active' : ''}
          >
            About
          </Link>
        </li>
                <li className="mean-last">
          <Link 
            href="/dining"
            className={pathname === '/dining' ? 'active' : ''}
          >
            Dining
          </Link>
        </li>
        <li>
          <Link 
            href="/rooms2"
            className={pathname === '/rooms2' ? 'active' : ''}
          >
            Rooms
          </Link>
        </li>
        <li>
          <Link 
            href="/events"
            className={pathname === '/events' ? 'active' : ''}
          >
            Events
          </Link>
        </li>
        <li>
          <Link 
            href="/blog"
            className={pathname === '/blog' ? 'active' : ''}
          >
            News
          </Link>
        </li>
        <li className="mean-last">
          <Link 
            href="/contact"
            className={pathname === '/contact' ? 'active' : ''}
          >
            Contact
          </Link>
        </li>

                <li className="mean-last">
          <Link 
            href="/gallery"
            className={pathname === '/gallery' ? 'active' : ''}
          >
            Gallery
          </Link>
        </li>
      </ul>
    </nav>
  );
};

const Header = ({ homeClass = "hm2", sticky = false }) => {
  const [toggle, setToggle] = useState(false);
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1200); // Matches your d-xl-none breakpoint
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    const fetchContactData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_CMS_BASE_URL}/api/consumer/damauli_contact`,
          {
            headers: {
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CMS_TOKEN}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch contact data');
        }

        const data = await response.json();
        setContactData(data.data);
      } catch (error) {
        console.error('Error fetching contact data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactData();
    
    // Only apply sticky nav if not mobile
    if (!isMobile) {
      RoveroUtility.stickyNav();
    }

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  useEffect(() => {
    // Update sticky behavior when isMobile or sticky prop changes
    if (!isMobile) {
      RoveroUtility.stickyNav(sticky);
    } else {
      // Ensure sticky is disabled for mobile
      RoveroUtility.stickyNav(false);
    }
  }, [sticky, isMobile]);

  return (
    <Fragment>
      <header>
        <div className={`transparent-header header-area ${homeClass} ${(sticky && !isMobile) ? 'sticky-menu' : ''}`}>
          <div className="header">
            {/* header top section */}
            <div className="header-top pt-12">
              <div className="container">
                <div className="row">
                  <div className="col-xl-7 col-lg-7 col-md-7 col-sm-12 col-12 d-flex align-items-center">
                    <div className="header-top-left d-none d-md-block">
                      <ul className="d-flex align-items-center">
                        {contactData?.phonenumber && (
                          <li>
                            <a href={`tel:${contactData.phonenumber}`}>
                              <span className="pr-2">
                                <i className="fa-solid fa-phone" />
                              </span>
                              {contactData.phonenumber}
                            </a>
                          </li>
                        )}
                        {contactData?.email && (
                          <li className="before-effect">
                            <a href={`mailto:${contactData.email}`}>
                              <span className="pr-2">
                                <i className="fa-regular fa-envelope" />
                              </span>
                              {contactData.email}
                            </a>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                  <div className="col-xl-5 col-lg-5 col-md-5 col-sm-12 col-12">
                    <div className="header-right d-flex align-items-center justify-content-end pl-25">
                      <ul className="social-link header-social d-flex align-items-center mr-20">
                        {contactData?.facebook && (
                          <li className="d-inline-block mr-10">
                            <a
                              className="facebook-color text-center d-inline-block transition-3"
                              href={contactData.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <i className="fa-brands fa-facebook-f" />
                            </a>
                          </li>
                        )}
                        {contactData?.instagram && (
                          <li className="d-inline-block mr-10">
                            <a
                              className="instagram-color text-center d-inline-block transition-3"
                              href={contactData.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <i className="fa-brands fa-instagram" />
                            </a>
                          </li>
                        )}
                        {/* {contactData?.twitter && (
                          <li className="d-inline-block mr-10">
                            <a
                              className="twitter-color text-center d-inline-block transition-3"
                              href={contactData.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <i className="fa-brands fa-x-twitter" />
                            </a>
                          </li>
                        )} */}
                        {contactData?.linkedin && (
                          <li className="d-inline-block mr-10">
                            <a
                              className="linked-in-color text-center d-inline-block transition-3"
                              href={contactData.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <i className="fa-brands fa-linkedin-in" />
                            </a>
                          </li>
                        )}
                        {contactData?.tiktok && (
                          <li className="d-inline-block mr-10">
                            <a
                              className="linked-in-color text-center d-inline-block transition-3"
                              href={contactData.tiktok}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <i className="fa-brands fa-tiktok" />
                            </a>
                          </li>
                        )}
                      </ul>
                      <div className="d-block d-lg-none pl-20">
                        <button
                          className="mobile-menubar theme-color border-0 bg-transparent"
                          onClick={(e) => {
                            e.preventDefault();
                            setToggle(true);
                          }}
                        >
                          <i className="fa-solid fa-bars" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div id="header-sticky" className="header-bottom">
              <div className="container">
                <div className="row align-items-center justify-content-between position-relative">
                  <div className="col-xl-3 col-lg-2 col-md-3 col-sm-5 col-5 pr-0">
                    <div className="logo">
                      {homeClass == "hm1" ? (
                        <Link href="/" className="d-block">
                          <img src="/images/logo/logo.png" alt="SIDDHARTHA" />
                        </Link>
                      ) : (
                        <Link href="/" className="d-block">
                          <img src="/images/logo/logo-white.png" alt="SIDDHARTHA" />
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className="col-xl-9 col-lg-10 col-md-9 col-sm-7 col-7 pl-0 d-flex justify-content-end position-static">
                    <div className="main-menu">
                      <DesktopMenu />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu sidebar */}
      <div
        className={`side-mobile-menu white-bg pt-10 pb-30 pl-35 pr-30 pb-100 ${toggle ? "open-menubar" : ""
          }`}
      >
        <div className="w-100">
          <div className="close-icon d-inline-block float-right clear-both mt-15 mb-10">
            <button 
              className="border-0 bg-transparent"
              onClick={() => setToggle(false)}
            >
              <span className="icon-clear theme-color">
                <i className="fa fa-times" />
              </span>
            </button>
          </div>
        </div>
        <div className="side-menu-search header-search-content mt-70 pr-15">
          <form action="#" className="position-relative">
            <input
              className="w-100 rounded-0 pb-2"
              type="text"
              placeholder="Type Keyword..."
            />
            <button
              className="position-absolute right-0 top-0 dark-black-color d-block border-0 bg-transparent"
              type="submit"
            >
              <i className="fas fa-search" />
            </button>
          </form>
        </div>
        <div className="mobile-menu mt-20 w-100 mean-container">
          <MobileMenu />
        </div>
        <ul className="pt-45 clear-both">
          {contactData?.phonenumber && (
            <li>
              <a href={`tel:${contactData.phonenumber}`} className="main-color mb-10 d-block">
                <span className="pr-2">
                  <i className="fa-solid fa-phone" />
                </span>
                {contactData.phonenumber}
              </a>
            </li>
          )}
          {contactData?.email && (
            <li>
              <a 
                href={`mailto:${contactData.email}`} 
                className="main-color mb-10 d-block"
                style={{
                  wordBreak: "break-all",
                  overflowWrap: "break-word",
                  whiteSpace: "normal",
                  display: "inline-block",
                  maxWidth: "100%",
                  paddingRight: "15px"
                }}
              >
                <span className="pr-2">
                  <i className="fa-regular fa-envelope" />
                </span>
                {contactData.email}
              </a>
            </li>
          )}
        </ul>
        <ul className="social-link pt-10 clear-both">
          {contactData?.facebook && (
            <li className="d-inline-block mr-10">
              <a
                className="facebook-color text-center d-inline-block transition-3"
                href={contactData.facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-facebook-f" />
              </a>
            </li>
          )}
          {contactData?.twitter && (
            <li className="d-inline-block mr-10">
              <a
                className="twitter-color text-center d-inline-block transition-3"
                href={contactData.twitter}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-brands fa-x-twitter" />
              </a>
            </li>
          )}
          {contactData?.instagram && (
            <li className="d-inline-block mr-10">
              <a
                className="instagram-color text-center d-inline-block transition-3"
                href={contactData.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-instagram" />
              </a>
            </li>
          )}
          {contactData?.linkedin && (
            <li className="d-inline-block mr-10">
              <a
                className="linked-in-color text-center d-inline-block transition-3"
                href={contactData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-linkedin-in" />
              </a>
            </li>
          )}
        </ul>
      </div>
      <div
        className={`body-overlay ${toggle ? "opened" : ""}`}
        onClick={() => setToggle(false)}
      />
    </Fragment>
  );
};

export default Header;