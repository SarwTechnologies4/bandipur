"use client";

import Breadcrumb from "@/components/Breadcrumb";
import RoveroLayout from "@/layouts/RoveroLayout";
import { useEffect, useState, useRef } from "react";

const ContactPage = () => {
  const [contactData, setContactData] = useState({
    address: "X7G8+FX4, Byas 33900, Damauli",
    phone1: "",
    email1: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phonenumber: "",
    description: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY || document.documentElement.scrollTop;
      setIsHeaderSticky(scrollPosition > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
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
        if (data.data) {
          setContactData({
            address: data.data.address || "X7G8+FX4, Byas 33900, Damauli",
            phone1: data.data.phonenumber || "+123 456 7890",
            email1: data.data.email || "hello@hotelian.com",
          });
        }
      } catch (error) {
        console.error('Error fetching contact data:', error);
      }
    };

    fetchContactData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CMS_BASE_URL}/api/consumer/damauli_contactuses`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CMS_TOKEN}`
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phonenumber: formData.phonenumber,
            description: formData.description
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit form');
      }

      const data = await response.json();
      setSubmitStatus({ success: true, message: 'Message sent successfully!' });
      setFormData({
        name: "",
        email: "",
        phonenumber: "",
        description: ""
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({ 
        success: false, 
        message: error.message || 'Failed to send message. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RoveroLayout homeClass="hm2" isHeaderSticky={isHeaderSticky}>
      <style jsx global>{`
        body, html {
           overflow-x: hidden;
          width: 100%;
        }
      `}</style>

      <Breadcrumb
        pageName="Contact"
        bgImage="images/bg/contact-page-bg.jpg"
        pageTitle="Contact Us"
      />

      <div className="contact-area contact-page mt-120" style={{ overflowX: 'hidden' }}>
        <div className="container">
          <div className="row contact-info-wrapper justify-content-center align-items-center" style={{ marginLeft: 0, marginRight: 0 }}>
            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-8 col-12 contact-info-sep position-relative mb-30" style={{ paddingLeft: 15, paddingRight: 15 }}>
              <div className="contact-page-info contact-location position-relative text-center">
                <div className="contact-icon theme-bg d-inline-block text-center mb-30 mr-0">
                  <span className="d-inline-block">
                    <i className="fas fa-map-marker-alt" />
                  </span>
                </div>
                <div className="contact-text">
                  <h4 className="mb-15">Address</h4>
                  <p className="mb-0">
                    {contactData.address}
                  </p>
                </div>
              </div>
            </div>

            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-8 col-12 contact-info-sep position-relative mb-30" style={{ paddingLeft: 15, paddingRight: 15 }}>
              <div className="contact-page-info contact-phone position-relative text-center">
                <div className="contact-icon theme-bg d-inline-block text-center mb-30 mr-0">
                  <span className="d-inline-block">
                    <i className="fas fa-phone-alt" />
                  </span>
                </div>
                <div className="contact-text">
                  <h4 className="mb-3">Phone Number</h4>
                  <p className="mb-0">
                    <a className="d-block" href={`tel:${contactData.phone1.replace(/\D/g, '')}`}>
                      {contactData.phone1}
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-8 col-12 contact-info-sep position-relative mb-30" style={{ paddingLeft: 15, paddingRight: 15 }}>
              <div className="contact-page-info contact-email text-center">
                <div className="contact-icon theme-bg d-inline-block text-center mb-30 mr-0">
                  <span className="d-inline-block">
                    <i className="fas fa-envelope" />
                  </span>
                </div>
                <div className="contact-text">
                  <h4 className="mb-3">Email Address</h4>
                  <p className="mb-0">
                    <a className="d-block" href={`mailto:${contactData.email1}`}>
                      {contactData.email1}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
              <div className="contact-wrapper contact-page-form-margin pt-70">
                <div className="contact-form">
                  <div className="con-title">
                    <h4 className="mb-35 text-md-center">Write Us Something</h4>
                  </div>
                  <form onSubmit={handleSubmit} id="contact-form">
                    <div className="contact-info text-md-center text-lg-left pt-20">
                      <div className="row" style={{ marginLeft: 0, marginRight: 0 }}>
                        <div
                          className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 mb-3 px-md-2"
                          data-aos="fade-up"
                          data-aos-anchor-placement="top-bottom"
                          data-aos-duration={2000}
                        >
                          <input
                            className="name w-100 primary-border pl-20 pt-15 pb-15 pr-10"
                            type="text"
                            name="name"
                            id="inputName"
                            placeholder="Your Name"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            style={{ maxWidth: '100%' }}
                          />
                        </div>
                        <div
                          className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 mb-3 px-md-2"
                          data-aos="fade-up"
                          data-aos-anchor-placement="top-bottom"
                          data-aos-duration={2500}
                        >
                          <input
                            className="email w-100 primary-border pl-20 pt-15 pb-15 pr-10"
                            type="email"
                            name="email"
                            id="inputEmail"
                            placeholder="Your Email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            style={{ maxWidth: '100%' }}
                          />
                        </div>
                        <div
                          className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 mb-3 px-md-2"
                          data-aos="fade-up"
                          data-aos-anchor-placement="top-bottom"
                          data-aos-duration={2000}
                        >
                          <input
                            className="website w-100 primary-border pl-20 pt-15 pb-15 pr-10"
                            type="text"
                            name="phonenumber"
                            id="inputPhoneNumber"
                            placeholder="Phone Number"
                            required
                            value={formData.phonenumber}
                            onChange={handleInputChange}
                            style={{ maxWidth: '100%' }}
                          />
                        </div>
                      </div>
                      <div className="row" style={{ marginLeft: 0, marginRight: 0 }}>
                        <div
                          className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 mb-3 px-md-2"
                          data-aos="fade-up"
                          data-aos-anchor-placement="top-bottom"
                          data-aos-duration={2000}
                        >
                          <textarea
                            className="massage w-100 primary-border pl-20 pt-20"
                            name="description"
                            id="inputMessage"
                            placeholder="Write your comment here"
                            required
                            value={formData.description}
                            onChange={handleInputChange}
                            style={{ maxWidth: '100%' }}
                          />
                        </div>
                      </div>
                      <div className="my-btn w-100">
                        <button
                          className="btn theme-bg text-uppercase rounded-0 f-500 w-100"
                          type="submit"
                          disabled={isSubmitting}
                          data-aos="fade-up"
                          data-aos-anchor-placement="top-bottom"
                          data-aos-duration={2500}
                        >
                          {isSubmitting ? 'Sending...' : 'Submit now'}
                        </button>
                      </div>
                      {submitStatus && (
                        <div className={`mt-3 text-center ${submitStatus.success ? 'text-success' : 'text-danger'}`}>
                          {submitStatus.message}
                        </div>
                      )}
                    </div>
                  </form>
                  <p className="form-message mt-20" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="over-hidden contact-page-map mt-100 mb-120" style={{ overflowX: 'hidden' }}>
          <div className="container" style={{ maxWidth: '100%', padding: '0 15px' }}>
            <div className="map-wrapper w-100 z-index1 rounded-0" style={{ overflow: 'hidden' }}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3523.593271407962!2d84.26634702547291!3d27.975739983686594!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399507006da5a76f%3A0x9d0a39c1df0109b1!2sHotel%20Siddhartha!5e0!3m2!1sen!2snp!4v1754893374984!5m2!1sen!2snp" 
                width="100%" 
                height="600" 
                style={{ border: 0, maxWidth: '100%' }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </RoveroLayout>
  );
};

export default ContactPage;