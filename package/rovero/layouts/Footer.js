"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const Footer = () => {
  const [contactData, setContactData] = useState({
    phonenumber: "065-590789",
    email: "manager.damauli@siddharthahospitality.com",
    facebook: "#",
    twitter: "#",
    instagram: "#",
    linkedin: "#",
    tiktok: "#",
    address: "X7G8+FX4, Byas 33900, Damauli"
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_CMS_BASE_URL}/api/consumer/damauli_contact_01`,
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
        if (data.data) {
          setContactData({
            phonenumber: data.data.phonenumber || "+977 065-590789",
            email: data.data.email || "manager.damauli@siddharthahospitality.com",
            facebook: data.data.facebook || "#",
            twitter: data.data.twitter || "#",
            instagram: data.data.instagram || "#",
            linkedin: data.data.linkedin || "#",
            tiktok: data.data.tiktok || "#",
            address: data.data.address || "X7G8+FX4, Byas 33900, Damauli"
          });
        }
      } catch (error) {
        console.error('Error fetching contact data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactData();
  }, []);

  return (
    <footer>
      <div className="footer-area">
        <div className="footer-top primary-border-bottom pt-50 pb-25 mb-40">
          <div className="container">
            <div className="row">
              <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-6">
                <div className="footer-widget f-info pb-20">
                  <h6 className="text-capitalize text-white mb-22">About</h6>
                  <ul>
                    <li>
                      <Link href="/about" className="d-inline-block mb-2">
                        About us
                      </Link>
                    </li>
                
                    <li>
                      <Link href="/blog" className="d-inline-block mb-2">
                        News and Events
                      </Link>
                    </li>
                    <li>
                      <Link href="https://www.siddharthahospitality.com" className="d-inline-block mb-2">
                        About SIDDHARTHA Hospitality
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-6">
                <div className="footer-widget f-info pb-30">
                  <h6 className="text-capitalize text-white mb-22">Service</h6>
                  <ul>
                    <li>
                      <Link href="/rooms2" className="d-inline-block mb-2">
                        Hotel Booking
                      </Link>
                    </li>
                    <li>
                      <Link href="/events" className="d-inline-block mb-2">
                        Events
                      </Link>
                    </li>
                  
                  </ul>
                </div>
              </div>

              <div className="col-xl-3 col-lg-2 col-md-4 col-sm-6 col-6">
                <div className="footer-widget f-info pb-30">
                  <h6 className="text-capitalize text-white mb-22">Quick Links</h6>
                  <ul>
                    <li>
                      <Link href="/contact" className="d-inline-block mb-2">
                        Contact Us
                      </Link>
                    </li>
                    <li>
                      <Link href="https://siddharthabiz.com/download-app" className="d-inline-block mb-2">
                        Download Our App
                      </Link>
                    </li>
                    <li>
                      <Link href="https://mileage.siddharthahospitality.com/mileage/signup" className="d-inline-block mb-2">
                        Become a Member
                      </Link>
                    </li>
                    
                  </ul>
                </div>
              </div>

              <div className="col-xl-3 col-lg-4 col-md-12 col-sm-6 col-12">
                <div className="footer-widget f-adress">
                  <h6 className="text-capitalize text-white mb-20">Address</h6>
                  <div className="footer-ad mb-2 d-flex">
                    <span className="text-white pr-25 mt-1">
                      <i className="fa-solid fa-location-dot" />
                    </span>
                    <p className="mb-0">
                      {contactData.address}
                    </p>
                  </div>
                  
                  <div className="footer-email mb-2 d-flex">
                    <span className="text-white pr-25 mt-1">
                      <i className="fas fa-phone-alt" />
                    </span>
                    <p className="mb-0">
                      <a
                        className="text-color primary-hover d-inline-block"
                        href={`tel:${contactData.phonenumber.replace(/\D/g, '')}`}
                      >
                        {contactData.phonenumber}
                      </a>
                    </p>
                  </div>
                  
                  <div className="footer-phone mb-15 d-flex align-items-start">
                    <span className="text-white pr-25 pt-1">
                      <i className="far fa-envelope" />
                    </span>
                    <a 
                      className="text-color primary-hover"
                      href={`mailto:${contactData.email}`}
                      style={{
                        wordBreak: "break-word",
                        overflowWrap: "break-word"
                      }}
                    >
                      {contactData.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container">
            <div className="row justify-content-lg-between justify-content-center">
              <div className="col-xl-6 col-lg-8 col-md-8 col-sm-12 col-12 pr-0">
                <div className="footer-widget footer-logo pb-35 d-sm-flex align-items-center">

                  <div className="copyright-text">
                    <p className="mb-0">
                      All rights reserved
                      <Link href="/" className="c-theme primary-color f-600">
                        {" "}SIDDHARTHA Hospitality {" "}
                      </Link>
                      © {new Date().getFullYear()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-xl-6 col-lg-4 col-md-12 col-sm-12 col-12">
                <div className="footer-widget pb-35 d-flex align-items-center justify-content-lg-end justify-content-center">
                  <h6 className="text-white mr-30 mb-0">Follow Us</h6>
                  <ul className="social-link">
                    <li className="d-inline-block mr-10">
                      <a
                        className="text-white text-center d-inline-block transition-3"
                        href={contactData.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fab fa-facebook-f" />
                      </a>
                    </li>
                    {/* <li className="d-inline-block mr-10">
                      <a
                        className="text-white text-center d-inline-block transition-3"
                        href={contactData.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fa-brands fa-x-twitter" />
                      </a>
                    </li> */}
                    <li className="d-inline-block mr-10">
                      <a
                        className="text-white text-center d-inline-block transition-3"
                        href={contactData.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fab fa-instagram" />
                      </a>
                    </li>
                    <li className="d-inline-block mr-10">
                      <a
                        className="text-white text-center d-inline-block transition-3"
                        href={contactData.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fab fa-linkedin-in" />
                      </a>
                    </li>
                    <li className="d-inline-block mr-10">
                      <a
                        className="text-white text-center d-inline-block transition-3"
                        href={contactData.tiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fab fa-tiktok" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;