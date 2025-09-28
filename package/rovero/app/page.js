"use client";
import { useState, useEffect, useRef } from 'react';
import DatePicker from "react-datepicker";
import { usePathname, useRouter } from 'next/navigation';
import "react-datepicker/dist/react-datepicker.css";
import Brand from "@/components/Brand";
import News from "@/components/News";
import { Hero2 } from "@/components/slider/Hero1";
import Subscribe from "@/components/Subscribe";
import Testimonial from "@/components/Testimonial";
import RoveroLayout from "@/layouts/RoveroLayout";
import Link from "next/link";
import PointsActionsSection from '@/components/PointsSection';
import Header from "@/layouts/Header";

const Page = () => {
  // State for about section
  const [aboutData, setAboutData] = useState(null);
  const [aboutLoading, setAboutLoading] = useState(true);
  const [aboutError, setAboutError] = useState(null);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);

  // State for offers section
  const [offersData, setOffersData] = useState([]);
  const [offersLoading, setOffersLoading] = useState(true);
  const [offersError, setOffersError] = useState(null);

  // State for rooms section
  const [roomsData, setRoomsData] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [roomsError, setRoomsError] = useState(null);

  // Sticky form state
  const [formHeight, setFormHeight] = useState(0);
  const [isSticky, setIsSticky] = useState(false);
  const formRef = useRef(null);
  const [navHeight, setNavHeight] = useState(80);
  const [activeTab, setActiveTab] = useState("hotel");
  const router = useRouter();
  const pathname = usePathname();
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guestRooms, setGuestRooms] = useState("");
  const [attendees, setAttendees] = useState("");
  const [purpose, setPurpose] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [purposes, setPurposes] = useState([]);
  const [loadingPurposes, setLoadingPurposes] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_CMS_BASE_URL;
  const API_AUTH_TOKEN = process.env.NEXT_PUBLIC_CMS_TOKEN;
  const FOODAPP_BASE_URL = process.env.NEXT_PUBLIC_FOODAPP_BASE_URL;

  // Image URL handler
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/default-image.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
  };

  // Fetch about data
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/consumer/damauli_startareas_01`,
          {
            headers: {
              Authorization: `Bearer ${API_AUTH_TOKEN}`,
            },
          }
        );

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const { data } = await response.json();
        setAboutData(data[0]);
      } catch (err) {
        setAboutError(err.message || "Failed to load about section data");
        console.error("About fetch error:", err);
      } finally {
        setAboutLoading(false);
      }
    };

    fetchAboutData();
  }, [API_BASE_URL, API_AUTH_TOKEN]);

  useEffect(() => {
    const onScroll = () => {
      if (!formRef.current) return;

      const formTop = formRef.current.getBoundingClientRect().top;
      const scrollPosition = window.scrollY || document.documentElement.scrollTop;

      if (formHeight === 0) {
        setFormHeight(formRef.current.offsetHeight);
      }

      setIsSticky(formTop <= 0 && scrollPosition > 100); // Adjust as needed
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [formHeight]);

  // Fetch offers data
  useEffect(() => {
    const fetchOffersData = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/consumer/damauli_offers_01`,
          {
            headers: {
              Authorization: `Bearer ${API_AUTH_TOKEN}`,
            },
          }
        );

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const { data } = await response.json();
        setOffersData(data);
      } catch (err) {
        setOffersError(err.message || "Failed to load offers data");
        console.error("Offers fetch error:", err);
      } finally {
        setOffersLoading(false);
      }
    };

    fetchOffersData();
  }, [API_BASE_URL, API_AUTH_TOKEN]);

  // Fetch rooms data
  useEffect(() => {
    const fetchRoomsData = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/consumer/damauli_roomdetails_01_01`,
          {
            headers: {
              Authorization: `Bearer ${API_AUTH_TOKEN}`,
            },
          }
        );

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const { data } = await response.json();
        setRoomsData(data);
      } catch (err) {
        setRoomsError(err.message || "Failed to load rooms data");
        console.error("Rooms fetch error:", err);
      } finally {
        setRoomsLoading(false);
      }
    };

    fetchRoomsData();
  }, [API_BASE_URL, API_AUTH_TOKEN]);

  useEffect(() => {
    const fetchPurposes = async () => {
      setLoadingPurposes(true);
      try {
        const response = await fetch(`${FOODAPP_BASE_URL}/halls/purposes?propertyId=property-3`);
        if (!response.ok) {
          throw new Error('Failed to fetch purposes');
        }
        const data = await response.json();
        setPurposes(data);
      } catch (error) {
        console.error("Error fetching purposes:", error);
        // Fallback purposes in case API fails
        setPurposes(["Business", "Wedding", "Social"]);
      } finally {
        setLoadingPurposes(false);
      }
    };

    fetchPurposes();
  }, [FOODAPP_BASE_URL]);

useEffect(() => {
  const checkIfMobile = () => {
    // Using 992px as the breakpoint (Bootstrap's lg breakpoint)
    setIsMobile(window.innerWidth < 992);
  };
  
  // Check immediately
  checkIfMobile();
  
  // Set up event listener for window resize
  window.addEventListener("resize", checkIfMobile);
  
  return () => window.removeEventListener("resize", checkIfMobile);
}, []);

useEffect(() => {
  const handleScroll = () => {
    if (isMobile) {
      // On mobile: never make the form sticky
      setIsSticky(false);
      // Header can still be sticky if needed
      setIsHeaderSticky(window.scrollY > 100);
      return;
    }

    const scrollPosition = window.scrollY || document.documentElement.scrollTop;

    // Handle form stickiness (only for desktop/tablet)
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
}, [isMobile, navHeight]);



  const handleHotelSubmit = (e) => {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      alert("Please select both check-in and check-out dates");
      return;
    }
    router.push("/find_room");
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      alert("Please select both check-in and check-out dates");
      return;
    }
    if (!purpose) {
      alert("Please select a purpose");
      return;
    }
    if (!attendees) {
      alert("Please enter number of attendees");
      return;
    }
    if (!guestRooms) {
      alert("Please enter number of guest rooms");
      return;
    }

    const formatToApiDateTime = (date) => {
      const isoString = date.toISOString();
      return isoString.split(".")[0] + "Z";
    };

    const booking_from = formatToApiDateTime(checkIn);
    const booking_to = formatToApiDateTime(checkOut);

    try {
      const query = new URLSearchParams({
        booking_from,
        booking_to,
        purpose,
        guests: attendees,
        guestRooms: guestRooms,
        propertyId: "property-3",
      }).toString();

      const fetchUrl = `${FOODAPP_BASE_URL}/halls/availability?${query}`;
      console.log("Fetching availability from URL:", fetchUrl);

      const res = await fetch(fetchUrl, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`API responded with status ${res.status}:`, errorText);
        alert(`Failed to fetch availability. Server responded with: ${res.status} ${res.statusText}`);
        return;
      }

      const data = await res.json();
      if (data && (Array.isArray(data) ? data.length > 0 : Object.keys(data).length > 0)) {
        router.push(`/events?${query}`);
      } else {
        alert("No available halls found for selected criteria.");
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
      alert("Error occurred while checking availability. Please check console for details.");
    }
  };

  const InputField = ({ type = "text", placeholder, required = false, value, onChange, min, ...props }) => (
    <div className="form-input-group">
      <p className="form-input-label">{placeholder}</p>
      <input
        type={type}
        required={required}
        min={min}
        value={value}
        onChange={onChange}
        className="form-input"
        placeholder={placeholder}
        {...props}
      />
    </div>
  );

  const SelectField = ({ placeholder, options, value, onChange, ...props }) => (
    <div className="form-input-group">
      <p className="form-input-label">{placeholder}</p>
      <select
        className="form-select"
        value={value}
        onChange={onChange}
        {...props}
      >
        <option value="" disabled hidden>
          Select {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const SearchButton = () => (
    <div className="form-input-group">
      <p className="form-input-label" style={{ visibility: 'hidden' }}>Search</p>
      <button
        type="submit"
        className="form-button"
      >
        SEARCH
      </button>
    </div>
  );

  const HotelCheckInputs = () => (
    <>
      <div className="form-input-group">
        <p className="form-input-label">Check In</p>
        <DatePicker
          selected={checkIn}
          onChange={(date) => {
            setCheckIn(date);
            if (checkOut && date >= checkOut) {
              setCheckOut(null);
            }
          }}
          selectsStart
          startDate={checkIn}
          endDate={checkOut}
          minDate={new Date()}
          className="form-input"
          dateFormat="yyyy-MM-dd"
          required
          placeholderText="Select check-in date"
          popperPlacement="bottom-start"
          popperModifiers={[
            {
              name: "preventOverflow",
              options: {
                rootBoundary: "viewport",
                tether: false,
              },
            },
          ]}
          popperClassName="z-[9999]"
        />
      </div>
      <div className="form-input-group">
        <p className="form-input-label">Check Out</p>
        <DatePicker
          selected={checkOut}
          onChange={(date) => setCheckOut(date)}
          selectsEnd
          startDate={checkIn}
          endDate={checkOut}
          minDate={checkIn || new Date()}
          className="form-input"
          dateFormat="yyyy-MM-dd"
          required
          disabled={!checkIn}
          placeholderText="Select check-out date"
          popperPlacement="bottom-start"
          popperModifiers={[
            {
              name: "preventOverflow",
              options: {
                rootBoundary: "viewport",
                tether: false,
              },
            },
          ]}
          popperClassName="z-[9999]"
        />
      </div>
    </>
  );

  const EventCheckInputs = () => (
    <>
      <div className="form-input-group">
        <p className="form-input-label">Check In</p>
        <DatePicker
          selected={checkIn}
          onChange={(date) => {
            setCheckIn(date);
            if (checkOut && date >= checkOut) {
              setCheckOut(null);
            }
          }}
          selectsStart
          startDate={checkIn}
          endDate={checkOut}
          minDate={new Date()}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          timeCaption="Time"
          className="form-input"
          dateFormat="yyyy-MM-dd HH:mm"
          required
          placeholderText="Select date and time"
          popperPlacement="bottom-start"
          popperModifiers={[
            {
              name: "preventOverflow",
              options: {
                rootBoundary: "viewport",
                tether: false,
              },
            },
          ]}
          popperClassName="z-[9999]"
        />
      </div>
      <div className="form-input-group">
        <p className="form-input-label">Check Out</p>
        <DatePicker
          selected={checkOut}
          onChange={(date) => setCheckOut(date)}
          selectsEnd
          startDate={checkIn}
          endDate={checkOut}
          minDate={checkIn || new Date()}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          timeCaption="Time"
          className="form-input"
          dateFormat="yyyy-MM-dd HH:mm"
          required
          disabled={!checkIn}
          placeholderText="Select date and time"
          popperPlacement="bottom-start"
          popperModifiers={[
            {
              name: "preventOverflow",
              options: {
                rootBoundary: "viewport",
                tether: false,
              },
            },
          ]}
          popperClassName="z-[9999]"
        />
      </div>
    </>
  );

const renderRoom = (room, index) => {
  if (isMobile) {
    // Mobile-specific design
    return (
      <div className="col-12 px-3 mb-5" key={room.id}>
  <div className="mobile-room-card shadow-sm rounded overflow-hidden">
    {/* Image at top */}
    <div className="mobile-room-image-container">
      <img
        className="w-100"
        src={getImageUrl(room.image)}
        alt={`${room.roomname} image`}
        onError={(e) => {
          e.target.src = '/images/default-image.jpg';
        }}
      />
    </div>
    
    {/* Content below image */}
    <div className="mobile-room-content p-3">
      <div className="d-flex justify-content-between align-items-start mb-2">
        <h3 className="mobile-room-title mb-0">
          <Link href={`/rooms-details/${room.id}`}>{room.roomname}</Link>
        </h3>
        <div className="mobile-room-price">
          <span className="theme-color fw-bold">RS {room.price}</span>
          <span className="text-muted small">/night</span>
        </div>
      </div>
      
      <p className="mobile-room-description text-muted small mb-3">
        {room.short_description}
      </p>
      
      <div className="mobile-room-features mb-3">
        <ul className="list-unstyled">
          <li className="mb-2">
            <span className="fw-bold">Guests:</span> {room.guests}
          </li>
          <li className="mb-2">
            <span className="fw-bold">Beds:</span> {room.beds}
          </li>
          <li className="mb-2">
            <span className="fw-bold">Payment:</span> {room.payment_method}
          </li>
        </ul>
      </div>
      
      <div className="ratting-area mb-3">
        <span><i className="fa fa-star text-warning" /></span>
        <span><i className="fa fa-star text-warning" /></span>
        <span><i className="fa fa-star text-warning" /></span>
        <span><i className="fa fa-star text-warning" /></span>
        <span><i className="fa fa-star text-warning" /></span>
      </div>
      
      <Link 
        href={`/rooms-details/${room.id}`} 
        className="btn theme-bg w-100 py-2"
      >
        Book Now
      </Link>
    </div>
  </div>
</div>
    );
  }

  // Original desktop design
  const isEvenIndex = index % 2 === 0;

  if (isEvenIndex) {
    return (
      <div className="row rooms-hm2-wrapper no-gutters align-items-md-center img-hover-effect-wrapper" key={room.id}>
        {/* Image on left */}
        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 px-xl-0">
          <div className="room-hm2-img transition5 zoom-img-hover img-hover-effect2 over-hidden position-relative">
            <img
              className="w-100 img"
              src={getImageUrl(room.image)}
              alt={`${room.roomname} image`}
              onError={(e) => {
                e.target.src = '/images/default-image.jpg';
              }}
            />
          </div>
        </div>

        {/* Content on right */}
        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
          <RoomContent room={room} />
        </div>
      </div>
    );
  } else {
    return (
      <div className="row rooms-hm2-wrapper rooms-hm2-wrapper2 no-gutters align-items-md-center flex-column-reverse flex-md-row img-hover-effect-wrapper" key={room.id}>
        {/* Content on left */}
        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
          <RoomContent room={room} />
        </div>

        {/* Image on right */}
        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
          <div className="room-hm2-img zoom-img-hover transition5 img-hover-effect2 over-hidden position-relative">
            <img
              className="w-100 img"
              src={getImageUrl(room.image)}
              alt={`${room.roomname} image`}
              onError={(e) => {
                e.target.src = '/images/default-image.jpg';
              }}
            />
          </div>
        </div>
      </div>
    );
  }
};

  return (
    <RoveroLayout homeClass="hm2" isHeaderSticky={isHeaderSticky}>

      <main className="over-hidden">
        {/* ======slider-area-start =========================================== */}
        <Hero2 />
        {/* slider-area-end  */}

        {/* ====== Sticky Form Section =============================================== */}
<div className="bg-whiteSmoke dark:bg-lightBlack">
  <div className="sticky-form-container">
    {isSticky && !isMobile && window.innerWidth >= 992 && (
      <div style={{ height: `${formHeight}px` }} className="sticky-form-placeholder" aria-hidden="true" />
    )}
    <div
      ref={formRef}
      className={`sticky-form ${isSticky && !isMobile ? "fixed" : ""}`}
    >
              <div className="sticky-form-tabs">
                <a
                  onClick={() => setActiveTab("hotel")}
                  className={`sticky-form-tab ${activeTab === "hotel" ? "active" : "inactive"}`}
                >
                  Hotels
                </a>
                <a
                  onClick={() => setActiveTab("event")}
                  className={`sticky-form-tab ${activeTab === "event" ? "active" : "inactive"}`}
                >
                  Meetings & Events
                </a>
              </div>

              {activeTab === "hotel" && (
                <form onSubmit={handleHotelSubmit} className="sticky-form-content">
                  <div className="sticky-form-full-width sticky-form-grid">
                    <HotelCheckInputs />
                    <InputField type="number" placeholder="Adults" required min="1" />
                    <InputField type="number" placeholder="Children" required min="0" />
                    <InputField type="text" placeholder="Promo Code" />
                    <SearchButton />
                  </div>
                </form>
              )}

              {activeTab === "event" && (
                <form onSubmit={handleEventSubmit} className="sticky-form-content">
                  <div className="sticky-form-full-width sticky-form-grid">
                    <EventCheckInputs />
                    <InputField
                      type="number"
                      placeholder="Guest Rooms"
                      min="1"
                      required
                      value={guestRooms}
                      onChange={(e) => setGuestRooms(e.target.value)}
                    />
                    <InputField
                      type="number"
                      placeholder="Attendees"
                      min="1"
                      required
                      value={attendees}
                      onChange={(e) => setAttendees(e.target.value)}
                    />
                    <SelectField
                      placeholder="Purpose"
                      options={purposes.map(purpose => ({
                        value: purpose.toLowerCase(),
                        label: purpose
                      }))}
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      required
                      disabled={loadingPurposes}
                    />
                    <SearchButton />
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* ====== about-area-start =============================================== */}
        {aboutLoading ? (
          <div className="about-hm2-area hm2 mt-115 over-hidden position-relative">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-12 text-center py-5">Loading about section...</div>
              </div>
            </div>
          </div>
        ) : aboutError ? (
          <div className="about-hm2-area hm2 mt-115 over-hidden position-relative">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-12 text-center py-5">Error: {aboutError}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="about-hm2-area hm2 mt-115 over-hidden position-relative">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-xl-6 col-lg-7 col-md-9 col-sm-12 col-12">
                  <div className="title text-center">
                    <span className="sub-title f-500 text-uppercase primary-color position-relative d-inline-block pb-15 mb-2">
                      We are champ
                    </span>
                    <h2 className="mb-0">
                      Welcome to {aboutData?.name || 'SIDDHARTHA'}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="row about-hm2-wrapper d-flex justify-content-center align-items-center mt-85 img-hover-effect-wrapper">
                <div className="col-xl-5 col-lg-6 col-md-5 col-sm-9 col-12">
                  <div className="about-hm2-img position-relative over-hidden img-hover-effect2">
                    <img
                      className="tilt"
                      src={getImageUrl(aboutData?.image)}
                      alt="about image"
                      style={{ willChange: "transform" }}
                      onError={(e) => {
                        e.target.src = '/images/about/hm2-about-img.jpg';
                      }}
                    />
                  </div>
                </div>

                <div className="col-xl-6 offset-xl-1 col-lg-6 col-md-7 col-sm-12 col-12 pl-lg-0 pl-xl-3">
                  <div className="about-hm2-content">
                    <div className="section-content-title mt--10">
                      <span className="text-uppercase theme-color f-700 fontNoto mb-2">
                        {aboutData?.name}
                      </span>
                      <h2 className="mb-40">
                        {aboutData?.title || 'The Best Place to Live A Luxurious Life'}
                      </h2>
                      <p className="mb-25">
                        {aboutData?.description || 'Default description text if none provided'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* about-hm2-area-end  */}
        {/* ====== rooms-area-start =============================================== */}
        <div className="rooms-hm2-area hm2 mt-120 mb-120">
          <div className="container-fluid container-wrapper p-md-0">
            {roomsLoading ? (
              <div className="row justify-content-center">
                <div className="col-12 text-center py-5">Loading rooms...</div>
              </div>
            ) : roomsError ? (
              <div className="row justify-content-center">
                <div className="col-12 text-center py-5">Error: {roomsError}</div>
              </div>
            ) : (
              <>
                {roomsData.map((room, index) => renderRoom(room, index))}

                <div className="hm2-rooms-btn transparent-btn text-center mt-60">
                  <div className="my-btn d-inline-block">
                    <Link href="rooms2" className="btn transparent-btn w-100">
                      view all
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        {/* rooms-hm2-area-end  */}
        {/* ====== offer-area-start =========================================== */}
        <div className="offer-area hm2 section-bg over-hidden pt-115 pb-40">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xl-6 col-lg-7 col-md-9 col-sm-12 col-12">
                <div className="title text-center">
                  <span className="sub-title f-500 text-uppercase primary-color position-relative d-inline-block pb-15 mb-2">
                    Its Awesome
                  </span>
                  <h2 className="mb-0">Special Offers</h2>
                </div>
              </div>
            </div>

            {offersLoading ? (
              <div className="row justify-content-center mt-85">
                <div className="col-12 text-center py-5">Loading offers...</div>
              </div>
            ) : offersError ? (
              <div className="row justify-content-center mt-85">
                <div className="col-12 text-center py-5">Error: {offersError}</div>
              </div>
            ) : (
              <div className="row offer-wrapper align-items-center justify-content-center mt-85">
                {offersData.map((offer, index) => (
                  <div
                    key={offer.id}
                    className="col-xl-4 col-lg-4 col-md-6 col-sm-9 col-12 aos-init aos-animate"
                    data-aos="fade-up"
                    data-aos-duration={1000}
                  >
                    <div
                      className="single-offer-wrapper position-relative transition5 zoom-img-hover over-hidden transition3 d-flex align-items-center mb-30"
                      data-overlay={2}
                    >
                      <div className="offer-hm2-img w-100 position-relative transition5">
                        <img
                          className="img w-100"
                          src={getImageUrl(offer.image)}
                          alt={offer.title}
                          onError={(e) => {
                            e.target.src = `/images/offer/hm2-offer-img${index + 1}.jpg`;
                          }}
                        />
                      </div>
                      <div className="offer-hm2-content position-absolute text-center transition5 z-index1 w-100 h-100">
                        <div className="offer-hm2-text1 transition5 position-absolute w-100 top-0 transition5 pl-30 pr-30 pt-40">
                          <div className="offer-hm2-text-hover1 transition5">
                            <h5 className="text-white mb-6">
                              <a>
                                {offer.title || 'Special Offer'}
                              </a>
                            </h5>
                            <p className="text-white">
                              {offer.description || ''}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* offer-area -end */}
        {/* ====== testimonial-area-start =============================================== */}
        <Testimonial />
        {/* testimonial-area -end */}
        {/* ====== subscription-area-start ======================================= */}
        <Subscribe />
        {/* subscription-area-end  */}
        <PointsActionsSection />
        <News />
      </main>
    </RoveroLayout>
  );
};

// Separate component for room content to avoid duplication
const RoomContent = ({ room }) => {
  return (
    <div className="room-hm2-content mt--10 hm2-room-content-margin">
      <div className="ratting-area d-flex align-items-center mb-xl-2">
        <ul className="review-ratting">
          <li>
            <br />
            <span><i className="fa fa-star" /></span>
            <span><i className="fa fa-star" /></span>
            <span><i className="fa fa-star" /></span>
            <span><i className="fa fa-star" /></span>
            <span><i className="fa fa-star" /></span>
          </li>
        </ul>
      </div>

      <div className="section-content-title">
        <h2 className="mb-22">
          <Link href={`/rooms-details/${room.id}`}>{room.roomname}</Link>
        </h2>
        <p>{room.short_description}</p>
      </div>

      <div className="room-info-details mt-25">
        <div className="room-price">
          <p className="mr-20 d-inline-block mb-0">Starts From</p>
          <span className="room-price f-700 main-color fontNoto text-uppercase">
            <span className="theme-color mr-2">RS {room.price}</span>/ Night
          </span>
        </div>

        <div className="room-info d-flex mt-22 mb-40">
          <ul className="room-info-left pr-45">

            <li>
              <span className="fontNoto main-color f-700 text-uppercase">Payment</span>
            </li>
            <li>
              <span className="fontNoto main-color f-700 text-uppercase">Guest</span>
            </li>
            <li>
              <span className="fontNoto main-color f-700 text-uppercase">Beds</span>
            </li>
          </ul>
          <ul className="room-info-right">
          
            <li><span>{room.payment_method}</span></li>
            <li><span>{room.guests}</span></li>
            <li><span>{room.beds}</span></li>
          </ul>
        </div>

        <div className="my-btn d-inline-block ">
          <Link 
              href={`/rooms-details/${room.id}`} 
              className="btn theme-bg w-100 py-2 text-white"
            >
              Book Now
            </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;