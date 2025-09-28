'use client'
import Breadcrumb from "@/components/Breadcrumb";
import RoveroLayout from "@/layouts/RoveroLayout";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_CMS_BASE_URL;
const API_AUTH_TOKEN = process.env.NEXT_PUBLIC_CMS_TOKEN;

const page = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const formRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/consumer/damauli_roomdetails_01_01`, {
          headers: {
            'Authorization': `Bearer ${API_AUTH_TOKEN}`
          }
        });
        const data = await response.json();
        setRooms(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY || document.documentElement.scrollTop;
      setIsHeaderSticky(scrollPosition > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // if (loading) {
  //   return (
  //     <RoveroLayout homeClass="hm2" isHeaderSticky={isHeaderSticky}>
  //       <div className="text-center py-5">Loading rooms...</div>
  //     </RoveroLayout>
  //   );
  // }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/default-image.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
  };

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
      <Breadcrumb
        pageName="Rooms"
        bgImage="/images/room-page/room-page2-hero-bg.jpg"
        pageTitle="Rooms"
      />
      <div className="rooms-hm2-area room-page2 hm2 mt-120 mb-120">
        <div className="container-fluid container-wrapper p-md-0">
          {rooms.map((room, index) => renderRoom(room, index))}
        </div>
      </div>
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
          <Link href={`/rooms-details/${room.id}`} className="btn theme-bg w-100">
            book now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;