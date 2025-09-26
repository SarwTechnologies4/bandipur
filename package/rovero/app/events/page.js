'use client'

import { useState, useEffect, useRef, Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import RoveroLayout from "@/layouts/RoveroLayout";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

const EventHallsContent = () => {
  const [halls, setHalls] = useState([]);
  const [noHallsFound, setNoHallsFound] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const formRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  const FOODAPP_BASE_URL = process.env.NEXT_PUBLIC_FOODAPP_BASE_URL;

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const formatSize = (size) => {
    return new Intl.NumberFormat("en-US").format(size);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY || document.documentElement.scrollTop;
      setIsHeaderSticky(scrollPosition > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchHalls = async () => {
      setNoHallsFound(false);
      setLoading(true);

      const bookingFrom = searchParams.get('booking_from');
      const bookingTo = searchParams.get('booking_to');
      const guests = searchParams.get('guests');
      const purpose = searchParams.get('purpose');

      const hasSearchParams = bookingFrom && bookingTo && guests && purpose;
      setIsFiltered(hasSearchParams);

      let apiUrl, queryParams;

      if (hasSearchParams) {
        apiUrl = `${FOODAPP_BASE_URL}/halls/availability`;
        queryParams = new URLSearchParams();
        queryParams.append("propertyId", "property-3");
        queryParams.append("booking_from", bookingFrom);
        queryParams.append("booking_to", bookingTo);
        queryParams.append("guests", guests);
        queryParams.append("purpose", purpose);
      } else {
        apiUrl = `${FOODAPP_BASE_URL}/halls`;
        queryParams = new URLSearchParams();
        queryParams.append("propertyId", "property-3");
      }

      try {
        const res = await fetch(`${apiUrl}?${queryParams.toString()}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();

        if (data && data.length > 0) {
          const mappedHalls = data.map((hall) => ({
            id: hall.id,
            title: hall.name,
            size: formatSize(hall.size),
            image: hall.media?.[0]
              ? `${FOODAPP_BASE_URL.replace("/api/consumer", "")}${hall.media[0]}`
              : "/placeholder.svg",
            description: hall.description,
            category: hall.majorAttraction || "Event Hall",
            capacity: hall.capacity,
            dailyPrice: hall.dailyPrice,
            purposes: hall.usedFor || [],
          }));
          setHalls(mappedHalls);
        } else {
          setHalls([]);
          setNoHallsFound(true);
        }
      } catch (err) {
        console.error("Error fetching halls:", err);
        setHalls([]);
        setNoHallsFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchHalls();
  }, [FOODAPP_BASE_URL, searchParams]);

  const handleViewDetails = (hall) => {
    const params = new URLSearchParams();
    if (searchParams.get('booking_from')) params.set('booking_from', searchParams.get('booking_from'));
    if (searchParams.get('booking_to')) params.set('booking_to', searchParams.get('booking_to'));
    if (searchParams.get('guests')) params.set('guests', searchParams.get('guests'));
    if (searchParams.get('purpose')) params.set('purpose', searchParams.get('purpose'));
    
    router.push(`/events/${hall.id}?${params.toString()}`);
  };

  const renderHall = (hall, index) => {
    if (isMobile) {
      // Mobile-specific design
      return (
        <div className="col-12 px-3 mb-5" key={hall.id}>
  <div className="mobile-room-card shadow-sm rounded overflow-hidden">
    {/* Image at top */}
    <div className="mobile-room-image-container">
      <img
        className="w-100"
        src={hall.image}
        alt={hall.title}
        onError={(e) => {
          e.target.src = "/placeholder.svg";
        }}
      />
    </div>
    
    {/* Content below image */}
    <div className="mobile-room-content p-3">
      <div className="d-flex justify-content-between align-items-start mb-2">
        <h3 className="mobile-room-title mb-0">
          {hall.title}
        </h3>
        <div className="mobile-room-price">
          <span className="theme-color fw-bold">NPR {hall.dailyPrice}</span>
          <span className="text-muted small">/day</span>
        </div>
      </div>
      
      <p className="mobile-room-description text-muted small mb-3">
        {hall.description || "Premium event space for your special occasions"}
      </p>
      
      <div className="mobile-room-features mb-3">
        <ul className="list-unstyled">
          <li className="mb-2">
            <span className="fw-bold">Size:</span> {hall.size} SQ.FT
          </li>
          <li className="mb-2">
            <span className="fw-bold">Capacity:</span> {hall.capacity} people
          </li>
          <li className="mb-2">
            <span className="fw-bold">Category:</span> {hall.category}
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
      
      <button
        onClick={() => handleViewDetails(hall)}
        className="btn theme-bg w-100 py-2"
      >
        Book Now
      </button>
    </div>
  </div>
</div>
      );
    }

    // Original desktop design
    const isEvenIndex = index % 2 === 0;

    if (isEvenIndex) {
      return (
        <div className="row rooms-hm2-wrapper no-gutters align-items-md-center img-hover-effect-wrapper" key={hall.id}>
          {/* Image on left */}
          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 px-xl-0">
            <div className="room-hm2-img transition5 zoom-img-hover img-hover-effect2 over-hidden position-relative">
              <img
                className="w-100 img"
                src={hall.image}
                alt={hall.title}
                onError={(e) => {
                  e.target.src = "/placeholder.svg";
                }}
              />
            </div>
          </div>

          {/* Content on right */}
          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
            <HallContent hall={hall} handleViewDetails={handleViewDetails} />
          </div>
        </div>
      );
    } else {
      return (
        <div className="row rooms-hm2-wrapper rooms-hm2-wrapper2 no-gutters align-items-md-center flex-column-reverse flex-md-row img-hover-effect-wrapper" key={hall.id}>
          {/* Content on left */}
          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
            <HallContent hall={hall} handleViewDetails={handleViewDetails} />
          </div>

          {/* Image on right */}
          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
            <div className="room-hm2-img zoom-img-hover transition5 img-hover-effect2 over-hidden position-relative">
              <img
                className="w-100 img"
                src={hall.image}
                alt={hall.title}
                onError={(e) => {
                  e.target.src = "/placeholder.svg";
                }}
              />
            </div>
          </div>
        </div>
      );
    }
  };

  // if (loading) {
  //   return (
  //     <RoveroLayout homeClass="hm2" isHeaderSticky={isHeaderSticky}>
  //       <div className="container text-center py-20">
  //         <div className="spinner-border text-primary" role="status">
  //           <span className="sr-only">Loading...</span>
  //         </div>
  //         <p className="mt-3">Loading event halls...</p>
  //       </div>
  //     </RoveroLayout>
  //   );
  // }

  return (
    <RoveroLayout homeClass="hm2" isHeaderSticky={isHeaderSticky}>
      <Breadcrumb
        pageName="Event Halls"
        bgImage="/images/room-page/room-page2-hero-bg.jpg"
        pageTitle="Event Halls"
      />
      {/* Events Area Section Start */}
      <div className="rooms-hm2-area room-page2 hm2 mt-120 mb-120">
        <div className={`container-fluid ${isMobile ? 'container' : 'container-wrapper p-md-0'}`}>
          {noHallsFound ? (
            <div className="text-center text-lg text-gray-600 py-20">
              {isFiltered
                ? "No event halls available for the selected criteria. Please try different dates or requirements."
                : "No event halls found."}
            </div>
          ) : (
            <div className={isMobile ? "row" : ""}>
              {halls.map((hall, index) => renderHall(hall, index))}
            </div>
          )}
        </div>
      </div>
      {/* Events Area Section End */}
    </RoveroLayout>
  );
};

// Separate component for hall content to avoid duplication
const HallContent = ({ hall, handleViewDetails }) => {
  return (
    <div className="room-hm2-content mt--10 hm2-room-content-margin">
      <div className="section-content-title">
        <h2 className="mb-22">{hall.title}</h2>
        <p>{hall.description || "Premium event space for your special occasions"}</p>
      </div>
      <div className="room-info-details mt-25">
        <div className="room-price">
          <p className="mr-20 d-inline-block mb-0">Starts From</p>
          <span className="room-price f-700 main-color fontNoto text-uppercase">
            <span className="theme-color mr-2">NPR {hall.dailyPrice}</span>/ Day
          </span>
        </div>
        <div className="room-info d-flex mt-22 mb-40">
          <ul className="room-info-left pr-45">
            <li>
              <span className="fontNoto main-color f-700 text-uppercase">
                Size
              </span>
            </li>
            <li>
              <span className="fontNoto main-color f-700 text-uppercase">
                Capacity
              </span>
            </li>
            <li>
              <span className="fontNoto main-color f-700 text-uppercase">
                Category
              </span>
            </li>
          </ul>
          <ul className="room-info-right">
            <li>
              <span>{hall.size} SQ.FT</span>
            </li>
            <li>
              <span>{hall.capacity} people</span>
            </li>
            <li>
              <span>{hall.category}</span>
            </li>
          </ul>
        </div>
        <div className="my-btn d-inline-block ">
          <button
            onClick={() => handleViewDetails(hall)}
            className="btn theme-bg w-100"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

const EventHallsPage = () => {
  return (
    <Suspense fallback={
      <RoveroLayout homeClass="hm2" isHeaderSticky={false}>
        <div className="container text-center py-20">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-3">Loading event halls...</p>
        </div>
      </RoveroLayout>
    }>
      <EventHallsContent />
    </Suspense>
  );
};

export default EventHallsPage;