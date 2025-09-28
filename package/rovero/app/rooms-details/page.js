'use client'
import Breadcrumb from "@/components/Breadcrumb";
import RoveroLayout from "@/layouts/RoveroLayout";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_CMS_BASE_URL;
const API_AUTH_TOKEN = process.env.NEXT_PUBLIC_CMS_TOKEN;

const Page = () => {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const roomId = params.id;
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
    const fetchRoom = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/consumer/damauli_roomdetails_01_01/${roomId}`,
          {
            headers: {
              'Authorization': `Bearer ${API_AUTH_TOKEN}`
            }
          }
        );
        const data = await response.json();
        setRoom(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching room:", error);
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  if (loading) {
    return (
      <RoveroLayout homeClass="hm2" isHeaderSticky={isHeaderSticky}>

        <div className="text-center py-5">Loading room details...</div>
      </RoveroLayout>
    );
  }

  if (!room) {
    return (
      <RoveroLayout homeClass="hm2" isHeaderSticky={isHeaderSticky}>

        <div className="text-center py-5">Room not found</div>
      </RoveroLayout>
    );
  }

  return (
    <RoveroLayout homeClass="hm2" isHeaderSticky={isHeaderSticky}>

      <Breadcrumb
        pageName="Rooms details"
        bgImage="/images/room-details/room-details-page-hero-bg.jpg"
        pageTitle="Rooms details"
      />
      <div className="rooms-details-page-area mt-120">
        <div className="container">
          <div className="row rooms-details-page-wrapper">
            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12">
              <div className="rooms-details-page-content">
                <div className="rd-heading d-sm-flex align-items-center justify-content-between mb-45">
                  <div className="section-content-title">
                    <h2 className="mb-0">
                      <Link href="rooms-details">{room.roomname}</Link>
                    </h2>
                  </div>
                  <div className="ratting-area pt-2">
                    <ul className="review-ratting">
                      <li>
                        <span><i className="fa fa-star" /></span>
                        <span><i className="fa fa-star" /></span>
                        <span><i className="fa fa-star" /></span>
                        <span><i className="fa fa-star" /></span>
                        <span><i className="fa fa-star" /></span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="img-hover-effect-wrapper">
                  <div className="pd-img mb-25 zoom-img-hover img-hover-effect2 over-hidden position-relative">
                    <img
                      className="w-100 img"
                      src={`${API_BASE_URL}${room.image}`}
                      alt={room.roomname}
                      style={{ height: '500px', objectFit: 'cover' }}
                    />
                  </div>
                </div>
                
                <div className="room-details-info primary-border pt-25 pb-18 mb-45">
                  <ul className="d-sm-flex justify-content-around">
                    {room.main_amenities.map((amenity, index) => (
                      <li key={index} className="single-rd-info text-center">
                        <div className="rd-info-icon-container">
                          <img
                            src={amenity.icon}
                            alt={amenity.title}
                            className="rd-info-icon"
                            style={{
                              width: '40px',
                              height: '40px',
                              objectFit: 'contain'
                            }}
                          />
                        </div>
                        <span className="d-block text-color mt-10">{amenity.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="rd-description mb-45">
                  <h5 className="mb-25">Description</h5>
                  <p>{room.description}</p>
                </div>
                
                <div className="rd-facilities mb-30">
                  <h5 className="mb-25">Facilities</h5>
                  <ul className="rd-facilities-list">
                    {room.other_amenities.map((amenity, index) => (
                      <li key={index} className="d-inline-block mb-20">
                        <div className="d-flex align-items-center">
                          <span className="facilities-icon d-inline-block text-center">
                            <img
                              src={amenity.icon}
                              alt={amenity.title}
                              style={{
                                width: '24px',
                                height: '24px',
                                objectFit: 'contain'
                              }}
                            />
                          </span>
                          <p className="pl-20 mb-0">{amenity.title}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="room-details-gallery mb-45">
                  <h5 className="mb-25">Gallery</h5>
                  <div className="row pl-10 pr-10">
                    {room.gallery.slice(0, 6).map((image, index) => (
                      <div key={index} className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12 px-1">
                        <div className="single-rd-gallery gallery-img-hover over-hidden position-relative mb-2">
                          <a
                            data-fancybox="images"
                            href={`${API_BASE_URL}${image}`}
                          >
                            <img
                              className="w-100"
                              src={`${API_BASE_URL}${image}`}
                              alt={`gallery image ${index + 1}`}
                              style={{
                                height: '200px',
                                objectFit: 'cover'
                              }}
                            />
                            <div className="gallery-hover transition5 text-center theme-color position-absolute transition5 z-index11">
                              <span className="d-flex align-items-center justify-content-center text-center h-100">
                                <i className="fa-solid fa-plus" />
                              </span>
                            </div>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">
              <div className="row rooms-page-left-sidebar">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                  <div className="sidebar-widget sidebar-search-area rp-booking-area mb-55 section-bg pl-30 pr-30 pt-45 pb-45">
                    <div className="form-hotel-search">
                      <form>
                        <label
                          htmlFor="checkIn"
                          className="meta-text-color d-block fontNoto f-700 mb-10 mt-35"
                        >
                          CHECK IN
                        </label>
                        <div className="check-in mb-25 position-relative">
                          <input
                            type="date"
                            className="datepicker primary-color w-100"
                            id="checkIn"
                            placeholder="24 April, 24"
                            disabled
                          />
                        </div>
                        <label
                          htmlFor="checkOut"
                          className="meta-text-color d-block fontNoto f-700 mb-10 mt-35"
                        >
                          CHECK OUT
                        </label>
                        <div className="check-out mb-40 position-relative">
                          <input
                            type="date"
                            className="datepicker primary-color w-100"
                            id="checkOut"
                            placeholder="24 April, 24"
                            disabled
                          />
                        </div>
                        <div className="check-guests-form">
                          <div className="course-filter">
                            <label
                              htmlFor="exampleFormControlSelect3"
                              className="main-color d-block fontNoto f-700 mb-10"
                            >
                              GUESTS
                            </label>
                            <select
                              className="white-bg primary-color w-100 border-0 pl-0 rounded-0 mb-25"
                              id="exampleFormControlSelect3"
                              defaultValue={room.guests}
                            >
                              {[1, 2, 3, 4, 5, 6].map(num => (
                                <option key={num} value={num}>
                                  {num < 10 ? `0${num}` : num}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </form>
                    </div>
                    <div className="sidebar-widget rp-service mb-1">
                      <h5 className="sidebar-title f-700 fontNoto text-uppercase mb-22 mr-xl-2 d-inline-block">
                        Add Extra Service
                      </h5>
                      <span className="accordion" />
                      <ul className="panel panel-ser">
                        {[
                          "Enable Wifi",
                          "Smooking Zone",
                          "River View",
                          "Forest View",
                          "Service Guide",
                          "Restaurant",
                          "Pet Allowed",
                          "Swimming Pool",
                          "Rest Room",
                          "Child Corner"
                        ].map((service, i) => (
                          <li key={i}>
                            <div className={`d-flex align-items-center ${i % 2 === 0 ? 'mb-10' : 'mb-3'}`}>
                              <input
                                type="checkbox"
                                className="option-input radio"
                                name="example"
                                id={`service-${i}`}
                              />
                              <label htmlFor={`service-${i}`} className="pl-20 mb-0 cursor-pointer">
                                {service}
                              </label>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="my-btn d-block">
                      <Link href="booking" className="btn theme-bg w-100">
                        book now
                      </Link>
                    </div>
                  </div>
                </div>
                
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                  <div className="sidebar-widget rd-booking-help mb-55">
                    <div className="booking-help theme-bg text-center pt-60 pb-55">
                      <h4 className="sidebar-title f-700 fontNoto text-capitalize text-white mb-22 d-block">
                        Booking Help
                      </h4>
                      <Link href="booking" className="text-white f-600">
                        +0123 4567 8910
                      </Link>
                    </div>
                  </div>
                </div>
                
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                  <div className="sidebar-widget pc-rooms mb-50">
                    <h4 className="sidebar-title f-700 fontNoto text-capitalize mb-22 d-inline-block">
                      Popular rooms
                    </h4>
                    <ul className="popular-rooms mt-18">
                      {[...Array(3)].map((_, i) => (
                        <li key={i} className="d-flex mb-30">
                          <Link href="rooms-details">
                            <img
                              src={`images/room-details/rd-pr-img${i+1}.jpg`}
                              alt="blog"
                              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                            />
                          </Link>
                          <div className="pr-rooms-content ml-30 mt--10">
                            <h6 className="mb-2">
                              <Link href="rooms-details">
                                Super luxuray delux room
                              </Link>
                            </h6>
                            <span className="text-color d-block mb-10">
                              Starts From{" "}
                              <span className="rc-price main-color f-700 fontNoto">
                                $299
                              </span>
                            </span>
                            <div className="my-btn d-inline-block">
                              <Link href="booking" className="btn theme-bg w-100">
                                book now
                              </Link>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoveroLayout>
  );
};

export default Page;