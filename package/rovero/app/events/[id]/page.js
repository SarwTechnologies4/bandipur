'use client'

import { useState, useEffect, useRef } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import Breadcrumb from "@/components/Breadcrumb";
import RoveroLayout from "@/layouts/RoveroLayout";
import Link from "next/link";

const CustomDropdown = ({ options, value, onChange, placeholder, required }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="custom-dropdown-wrapper" ref={dropdownRef}>
      <div
        className={`custom-dropdown-header ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="selected-value">
          {value || (
            <span className="placeholder">{placeholder}</span>
          )}
        </div>
        <div className="dropdown-arrow">
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </div>
      </div>
      
      {isOpen && (
        <div className="custom-dropdown-options">
          {options.map((option) => (
            <div
              key={option}
              className={`dropdown-option ${value === option ? 'selected' : ''}`}
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .custom-dropdown-wrapper {
          position: relative;
          width: 100%;
        }
        
        .custom-dropdown-header {
          height: 38px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          padding: 0.5rem 0.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: all 0.3s ease;
          background: white;
        }
        
        .custom-dropdown-header:hover {
          border-color: #BCAB6E;
        }
        
        .custom-dropdown-header.open {
          border-color: #BCAB6E;
          box-shadow: 0 0 0 3px rgba(188, 171, 110, 0.1);
        }
        
        .selected-value {
          flex: 1;
          font-size: 1rem;
          color: #374151;
        }
        
        .placeholder {
          color: #9ca3af;
        }
        
        .dropdown-arrow {
          color: #6b7280;
          transition: transform 0.3s ease;
        }
        
        .custom-dropdown-header.open .dropdown-arrow {
          transform: rotate(180deg);
        }
        
        .custom-dropdown-options {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          max-height: 300px;
          overflow-y: auto;
          background: white;
          border: 1px solid #f0f0f0;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          z-index: 100;
          margin-top: 4px;
        }
        
        .dropdown-option {
          padding: 12px 16px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .dropdown-option:hover {
          background-color: #f5f5f5;
        }
        
        .dropdown-option.selected {
          background-color: #f0f0f0;
          color: #BCAB6E;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

const EventDetails = () => {
    const [imageIndex, setImageIndex] = useState(0);
    const [hall, setHall] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingForm, setBookingForm] = useState({
        checkIn: null,
        checkOut: null,
        purpose: "",
        attendees: "",
        guestRooms: "",
        name: "",
        message: "",
        phoneNumber: "",
        selectedMenuId: null,
        menuSelections: {},
        expandedGroups: {},
    });
    const [maxChoiceMessages, setMaxChoiceMessages] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [hallDetails, setHallDetails] = useState(null);
    const [isHeaderSticky, setIsHeaderSticky] = useState(false);
    const formRef = useRef(null);

    const FOODAPP_BASE_URL = process.env.NEXT_PUBLIC_FOODAPP_BASE_URL;
    const FOODAPP_API_KEY = process.env.NEXT_PUBLIC_FOODAPP_API_KEY;

    const formatSize = (size) => {
        return new Intl.NumberFormat("en-US").format(size);
    };

    const getImageUrl = (imgPath) => {
        if (!imgPath || typeof imgPath !== "string") return "/images/inner/default-event.jpg";
        if (imgPath.startsWith("http")) return imgPath;
        const baseUrl = FOODAPP_BASE_URL.replace("/api/consumer", "");
        const cleanPath = imgPath.startsWith("/") ? imgPath.slice(1) : imgPath;
        return `${baseUrl}/${cleanPath}`;
    };

    useEffect(() => {
        const fetchHallDetails = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${FOODAPP_BASE_URL}/halls/${id}`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch hall");
                const data = await res.json();

                if (data) {
                    setHall({
                        id: data.id,
                        title: data.name,
                        description: data.description,
                        formattedSize: `${formatSize(data.size)} SQ.FT`,
                        images: data.media?.map((img) => getImageUrl(img)) || ["/images/inner/default-event.jpg"],
                        features: Array.isArray(data.usedFor)
                            ? data.usedFor
                            : typeof data.usedFor === "string"
                                ? data.usedFor.split(", ")
                                : [],
                        capacity: data.capacity,
                        seatingArrangements: data.seatingArrangement || [],
                        amenities: data.amenities || [],
                        openingTime: data.openingTime,
                        closingTime: data.closingTime,
                        dailyPrice: data.dailyPrice,
                        propertyName: data.propertyName,
                        purposes: data.usedFor || []
                    });
                    setHallDetails(data);
                } else {
                    router.push("/not-found");
                }
            } catch (err) {
                console.error("Error fetching hall details:", err);
                Swal.fire({
                    title: "Error!",
                    text: "Failed to load hall details",
                    icon: "error",
                    confirmButtonColor: "#d33",
                    background: "#BCAB6E",
                    color: "#fff",
                });
                router.push("/events");
            } finally {
                setLoading(false);
            }
        };

        fetchHallDetails();
    }, [id, FOODAPP_BASE_URL, router]);

    const prevBtn = () => {
        if (!hall) return;
        setImageIndex((prev) => (prev - 1 + hall.images.length) % hall.images.length);
    };

    const nextBtn = () => {
        if (!hall) return;
        setImageIndex((prev) => (prev + 1) % hall.images.length);
    };

    const initializeBookingForm = () => {
        const hasSearchParams =
            searchParams.get("booking_from") ||
            searchParams.get("booking_to") ||
            searchParams.get("guests") ||
            searchParams.get("purpose");

        const initialSelections = {};
        const initialExpanded = {};

        if (hallDetails?.menu && hallDetails.menu.length > 0) {
            hallDetails.menu.forEach((menu) => {
                initialSelections[menu.id] = {};
                menu.menuGroups.forEach((group) => {
                    initialSelections[menu.id][group.id] = [];
                    initialExpanded[group.id] = false;
                    if (group.hasSubGroups && group.subGroups) {
                        group.subGroups.forEach((subGroup) => {
                            initialSelections[menu.id][subGroup.id] = [];
                            initialExpanded[subGroup.id] = false;
                        });
                    }
                });
            });
        }

        if (hasSearchParams) {
            const bookingFromParam = searchParams.get("booking_from");
            const bookingToParam = searchParams.get("booking_to");
            const guestsParam = searchParams.get("guests");
            const purposeParam = searchParams.get("purpose");

            setBookingForm({
                checkIn: bookingFromParam ? new Date(bookingFromParam) : null,
                checkOut: bookingToParam ? new Date(bookingToParam) : null,
                purpose: purposeParam || "",
                attendees: guestsParam ? Number.parseInt(guestsParam, 10) : "",
                guestRooms: "",
                name: "",
                phoneNumber: "",
                message: "",
                selectedMenuId: null,
                menuSelections: initialSelections,
                expandedGroups: initialExpanded,
            });
        } else {
            setBookingForm({
                checkIn: null,
                checkOut: null,
                purpose: "",
                attendees: "",
                guestRooms: "",
                name: "",
                phoneNumber: "",
                message: "",
                selectedMenuId: null,
                menuSelections: initialSelections,
                expandedGroups: initialExpanded,
            });
        }

        setMaxChoiceMessages({});
    };

    const handleOpenBookingModal = () => {
        setShowBookingModal(true);
        initializeBookingForm();
    };

    const handleBookingChange = (e) => {
        const { name, value } = e.target;
        setBookingForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDateChange = (date, field) => {
        setBookingForm((prev) => ({
            ...prev,
            [field]: date,
        }));
    };

    const handleMenuSelection = (menuId, groupId, itemId, isChecked, maxChoice) => {
        setBookingForm((prev) => {
            const newSelections = { ...prev.menuSelections };

            if (!newSelections[menuId]) {
                newSelections[menuId] = {};
            }
            if (!newSelections[menuId][groupId]) {
                newSelections[menuId][groupId] = [];
            }

            const currentGroupSelections = newSelections[menuId][groupId];
            let newMaxChoiceMessages = { ...maxChoiceMessages };

            if (isChecked) {
                if (maxChoice && currentGroupSelections.length >= maxChoice) {
                    newMaxChoiceMessages[groupId] = `Max ${maxChoice} choices allowed.`;
                    setMaxChoiceMessages(newMaxChoiceMessages);
                    return prev;
                }
                if (!currentGroupSelections.includes(itemId)) {
                    newSelections[menuId][groupId] = [...currentGroupSelections, itemId];
                }
                if (newMaxChoiceMessages[groupId]) {
                    delete newMaxChoiceMessages[groupId];
                    setMaxChoiceMessages(newMaxChoiceMessages);
                }
            } else {
                newSelections[menuId][groupId] = currentGroupSelections.filter((id) => id !== itemId);
                if (newMaxChoiceMessages[groupId] && (newSelections[menuId][groupId].length < maxChoice || maxChoice === 0)) {
                    delete newMaxChoiceMessages[groupId];
                    setMaxChoiceMessages(newMaxChoiceMessages);
                }
            }

            return {
                ...prev,
                menuSelections: newSelections,
            };
        });
    };

    const handleMenuHeaderClick = (menuId) => {
        setBookingForm((prev) => ({
            ...prev,
            selectedMenuId: prev.selectedMenuId === menuId ? null : menuId,
            expandedGroups: prev.selectedMenuId === menuId ? prev.expandedGroups : {},
        }));
        setMaxChoiceMessages({});
    };

    const toggleNestedGroupExpansion = (groupId) => {
        setBookingForm((prev) => ({
            ...prev,
            expandedGroups: {
                ...prev.expandedGroups,
                [groupId]: !prev.expandedGroups[groupId],
            },
        }));
    };

    const renderMenuItems = (menuId, group) => {
        const isExpanded = bookingForm.expandedGroups[group.id];
        const maxChoice = group.maxChoice;
        const currentSelectionsCount = bookingForm.menuSelections[menuId]?.[group.id]?.length || 0;
        const isMaxReached = maxChoice && currentSelectionsCount >= maxChoice;

        if (!isExpanded) return null;

        return (
            <div className="space-y-2 pl-4 mt-2">
                {group.menuItems.map(
                    (item) =>
                        item.name && (
                            <div key={item.id} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`item-${item.id}`}
                                    checked={bookingForm.menuSelections[menuId]?.[group.id]?.includes(item.id) || false}
                                    onChange={(e) => handleMenuSelection(menuId, group.id, item.id, e.target.checked, maxChoice)}
                                    disabled={isMaxReached && !bookingForm.menuSelections[menuId]?.[group.id]?.includes(item.id)}
                                    className="mr-2"
                                />
                                <label htmlFor={`item-${item.id}`}>{item.name}</label>
                            </div>
                        ),
                )}
                {maxChoiceMessages[group.id] && <p className="text-red-500 text-sm mt-1">{maxChoiceMessages[group.id]}</p>}
            </div>
        );
    };

    const renderSubGroups = (menuId, group) => {
        if (!group.hasSubGroups || !group.subGroups) return null;

        return (
            <div className="pl-4 mt-2 space-y-3">
                {group.subGroups.map((subGroup) => (
                    <div key={subGroup.id}>
                        <div
                            className="flex justify-between items-center cursor-pointer"
                            onClick={() => toggleNestedGroupExpansion(subGroup.id)}
                        >
                            <h6 className="font-medium">{subGroup.name}</h6>
                            <span className="text-sm text-gray-500">
                                {bookingForm.expandedGroups[subGroup.id] ? (
                                    <FaChevronUp className="inline" />
                                ) : (
                                    <FaChevronDown className="inline" />
                                )}
                            </span>
                        </div>
                        {subGroup.help_text && <p className="text-sm text-gray-500 mb-2">{subGroup.help_text}</p>}
                        {renderMenuItems(menuId, subGroup)}
                    </div>
                ))}
            </div>
        );
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();

        // Client-side validation
        const validationErrors = [];

        if (bookingForm.attendees < 1) {
            validationErrors.push("Number of attendees must be at least 1");
        }

        if (!bookingForm.checkIn || !bookingForm.checkOut) {
            validationErrors.push("Please select both check-in and check-out dates");
        } else if (bookingForm.checkOut <= bookingForm.checkIn) {
            validationErrors.push("Check-out date must be after check-in date");
        }

        if (!bookingForm.purpose) {
            validationErrors.push("Please specify the purpose of your event");
        }

        if (!bookingForm.name.trim()) {
            validationErrors.push("Please enter your name");
        }

        // Phone number validation
        const phoneRegex = /^[0-9]{10,15}$/;
        if (!bookingForm.phoneNumber.trim() || !phoneRegex.test(bookingForm.phoneNumber.trim())) {
            validationErrors.push("Please enter a valid phone number (10-15 digits)");
        }

        // If there are validation errors, show them and return
        if (validationErrors.length > 0) {
            Swal.fire({
                title: "Validation Error",
                html: validationErrors.map(error => `<div class="text-left mb-2">• ${error}</div>`).join(''),
                icon: "error",
                background: "#BCAB6E",
                color: "#fff",
                confirmButtonColor: "#d33",
            });
            return;
        }

        setSubmitting(true);
        
        try {
            // Prepare selected menu items
            const selectedMenuId = bookingForm.selectedMenuId;
            let selectedItemIds = [];

            if (selectedMenuId && bookingForm.menuSelections[selectedMenuId]) {
                Object.values(bookingForm.menuSelections[selectedMenuId]).forEach(groupItems => {
                    selectedItemIds = [...selectedItemIds, ...groupItems];
                });
            }

            const bookingData = {
                booking_from: bookingForm.checkIn.toISOString(),
                booking_to: bookingForm.checkOut.toISOString(),
                guests: bookingForm.attendees,
                eventType: bookingForm.purpose,
                propertyId: "property-3",
                hallId: hall.id,
                selectedMenuId: selectedMenuId || null,
                selectedItemIds,
                name: bookingForm.name,
                phone: bookingForm.phoneNumber,
                instructions: bookingForm.message || "",
            };

            // API call
            const response = await fetch(`${FOODAPP_BASE_URL}/halls/bookings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${FOODAPP_API_KEY}`
                },
                body: JSON.stringify(bookingData),
            });

            if (!response.ok) {
                // Try to parse error response
                let errorMessage = "Failed to submit booking";
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch (parseError) {
                    console.error("Error parsing error response:", parseError);
                }
                throw new Error(`${errorMessage} (Status: ${response.status})`);
            }

            const result = await response.json();

            // Format dates for display
            const formatDate = (date) => {
                return new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }).format(date);
            };

            // Success notification
            await Swal.fire({
                title: "Booking Request Submitted!",
                html: `
                    <div class="text-left">
                        <p class="mb-2"><strong>Hall:</strong> ${hall.title}</p>
                        <p class="mb-2"><strong>Name:</strong> ${bookingForm.name}</p>
                        <p class="mb-2"><strong>Phone:</strong> ${bookingForm.phoneNumber}</p>
                        <p class="mb-2"><strong>Dates:</strong> ${formatDate(bookingForm.checkIn)} - ${formatDate(bookingForm.checkOut)}</p>
                        <p class="mb-2"><strong>Purpose:</strong> ${bookingForm.purpose}</p>
                        <p class="mb-2"><strong>Attendees:</strong> ${bookingForm.attendees}</p>
                        <p class="mb-2"><strong>Guest Rooms:</strong> ${bookingForm.guestRooms || "None"}</p>
                        ${bookingForm.message ? `<p class="mb-2"><strong>Instructions:</strong> ${bookingForm.message}</p>` : ''}
                        <p class="mt-4 text-sm">Our team will contact you shortly to confirm your booking.</p>
                    </div>
                `,
                icon: "success",
                background: "#BCAB6E",
                color: "#fff",
                confirmButtonColor: "#008000",
                customClass: {
                    container: 'swal2-top-layer',
                    popup: 'swal2-top-layer-popup'
                }
            });

            // Reset form on success
            setBookingForm({
                checkIn: null,
                checkOut: null,
                purpose: "",
                attendees: "",
                guestRooms: "",
                name: "",
                phoneNumber: "",
                message: "",
                selectedMenuId: null,
                menuSelections: {},
                expandedGroups: {},
            });
            setShowBookingModal(false);
            setMaxChoiceMessages({});

        } catch (error) {
            console.error("Booking error:", error);
            
            // Enhanced error display
            Swal.fire({
                title: "Booking Failed",
                html: `
                    <div class="text-left">
                        <p class="mb-3">${error.message}</p>
                        <p class="text-sm mt-3">Please check your details and try again, or contact support if the problem persists.</p>
                    </div>
                `,
                icon: "error",
                background: "#BCAB6E",
                color: "#fff",
                confirmButtonColor: "#d33",
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <RoveroLayout homeClass="hm2" isHeaderSticky={isHeaderSticky}>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="animate-pulse text-xl">Loading hall details...</div>
                </div>
            </RoveroLayout>
        );
    }

    if (!hall) {
        return (
            <RoveroLayout homeClass="hm2" isHeaderSticky={isHeaderSticky}>
                <div className="text-center py-20">
                    <h2 className="text-2xl mb-4">Hall not found</h2>
                    <Link href="/events" className="text-khaki hover:underline">
                        Browse our event halls
                    </Link>
                </div>
            </RoveroLayout>
        );
    }

    return (
        <RoveroLayout homeClass="hm2" isHeaderSticky={isHeaderSticky}>
            <Breadcrumb
                pageName={hall.title}
                bgImage="/images/room-details/room-details-page-hero-bg.jpg"
                pageTitle={hall.title}
            />

            <div className="rooms-details-page-area mt-120">
                <div className="container">
                    <div className="row rooms-details-page-wrapper">
                        <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12">
                            <div className="rooms-details-page-content">
                                <div className="rd-heading d-sm-flex align-items-center justify-content-between mb-45">
                                    <div className="section-content-title">
                                        <h2 className="mb-0">
                                            {hall.title}
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
                                            src={hall.images[imageIndex] || "/images/inner/default-event.jpg"}
                                            alt={hall.title}
                                        />
                                        {hall.images.length > 1 && (
                                            <div className="absolute inset-0 flex justify-between items-center px-4">
                                                <button
                                                    className="w-10 h-10 lg:w-12 lg:h-12 bg-white/80 hover:bg-khaki grid place-items-center transition-all duration-300 rounded-full"
                                                    onClick={prevBtn}
                                                    aria-label="Previous image"
                                                >
                                                    <BsArrowLeft className="text-dark hover:text-white" />
                                                </button>
                                                <button
                                                    className="w-10 h-10 lg:w-12 lg:h-12 bg-white/80 hover:bg-khaki grid place-items-center transition-all duration-300 rounded-full"
                                                    onClick={nextBtn}
                                                    aria-label="Next image"
                                                >
                                                    <BsArrowRight className="text-dark hover:text-white" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Hall Details - Updated Design */}
                                <div className="hall-details-grid mb-45">
                                    <div className="row">
                                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-4">
                                            <div className="detail-card">
                                                <h5 className="mb-25">Hall Size</h5>
                                                <p className="detail-value">{hall.formattedSize}</p>
                                            </div>
                                        </div>
                                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-4">
                                            <div className="detail-card">
                                                <h5 className="mb-25">Capacity</h5>
                                                <p className="detail-value">{hall.capacity} people</p>
                                            </div>
                                        </div>
                                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-4">
                                            <div className="detail-card">
                                                <h5 className="mb-25">Timings</h5>
                                                <p className="detail-value">{hall.openingTime} - {hall.closingTime}</p>
                                            </div>
                                        </div>
                                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-4">
                                            <div className="detail-card">
                                                <h5 className="mb-25">Daily Rate</h5>
                                                <p className="detail-value">NPR {hall.dailyPrice}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="rd-description mb-45">
                                    <h5 className="mb-25">Description</h5>
                                    <p>{hall.description}</p>
                                </div>

                                {/* Seating Arrangements - Updated Design */}
                                {hall.seatingArrangements.length > 0 && (
                                    <div className="seating-arrangements mb-45">
                                        <h5 className="mb-25">Seating Arrangements</h5>
                                        <div className="row">
                                            {hall.seatingArrangements.map((arrangement, idx) => (
                                                <div key={idx} className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 mb-4">
                                                    <div className="seating-card">
                                                        <div className="seating-header">
                                                            <div className="seating-icon">
                                                                <img
                                                                    src={getImageUrl(arrangement.icon) || "/images/inner/default-feature.png"}
                                                                    alt={arrangement.style}
                                                                />
                                                            </div>
                                                            <h4 className="seating-title">{arrangement.style}</h4>
                                                        </div>
                                                        <p className="seating-capacity">Capacity: {arrangement.pax} people</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {hall.images.length > 1 && (
                                    <div className="room-details-gallery mb-45">
                                        <h5 className="mb-25">Gallery</h5>
                                        <div className="row pl-10 pr-10">
                                            {hall.images.map((img, idx) => (
                                                <div key={idx} className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12 px-1">
                                                    <div className="single-rd-gallery gallery-img-hover over-hidden position-relative mb-2">
                                                        <a
                                                            data-fancybox="images"
                                                            href={img}
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                setImageIndex(idx)
                                                            }}
                                                        >
                                                            <img
                                                                className="w-100"
                                                                src={img}
                                                                alt={`${hall.title} - Image ${idx + 1}`}
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
                                )}
                            </div>
                        </div>

                        <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">
                            <div className="row rooms-page-left-sidebar">
                                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                    {/* Hall Enquiry Card */}
                                    <div className="sidebar-widget hall-enquiry-card mb-55 sticky">
                                        <div className="enquiry-card-content section-bg pl-30 pr-30 pt-45 pb-45 ">
                                            <h4 className="enquiry-title mb-30">Hall Enquiry</h4>

                                            <div className="hall-info-item mb-20">
                                                <span className="info-label">Hall Size : </span>
                                                <span className="info-value">{hall.formattedSize}</span>
                                            </div>

                                            <div className="hall-info-item mb-20">
                                                <span className="info-label">Capacity : </span>
                                                <span className="info-value">{hall.capacity} people</span>
                                            </div>

                                            <div className="hall-info-item mb-30">
                                                <span className="info-label">Daily Rate : </span>
                                                <span className="info-value">NPR {hall.dailyPrice}</span>
                                            </div>

                                            <div className="my-btn d-block mb-30">
                                                <button
                                                    onClick={handleOpenBookingModal}
                                                    className="btn theme-bg w-100"
                                                >
                                                    Book Now
                                                </button>
                                            </div>

                                            {/* Amenities Section */}
                                            {hall.amenities.length > 0 && (
                                                <div className="enquiry-amenities">
                                                    <h5 className="amenities-title mb-20">Amenities</h5>
                                                    <ul className="amenities-list">
                                                        {hall.amenities.slice(0, 6).map((amenity, index) => (
                                                            <li key={index} className="amenity-item mb-15">
                                                                <div className="d-flex align-items-center">
                                                                    <span className="amenity-icon mr-10">
                                                                        <img
                                                                            src={getImageUrl(amenity.icon) || `/images/icon/facilities-icon${(index % 8) + 1}.png`}
                                                                            alt={amenity.name}
                                                                            className="amenity-icon-img"
                                                                        />
                                                                    </span>
                                                                    <span className="amenity-name">{amenity.name}</span>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                    <div className="sidebar-widget rd-booking-help mb-55">
                                        <div className="booking-help theme-bg text-center pt-60 pb-55">
                                            <h4 className="sidebar-title f-700 fontNoto text-capitalize text-white mb-22 d-block">
                                                Booking Help
                                            </h4>
                                            <a href="tel:+012345678910" className="text-white f-600">
                                                065-590789
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            {showBookingModal && (
                <div className="event-booking-modal-overlay">
                    <div className="event-booking-modal">
                        {/* Modal Header */}
                        <div className="modal-header">
                            <div className="modal-title-section">
                                <h2 className="modal-title">Book {hall.title}</h2>
                                <p className="modal-subtitle">Fill in your details to request a booking</p>
                            </div>
                            <button
                                onClick={() => setShowBookingModal(false)}
                                className="modal-close-btn"
                                aria-label="Close modal"
                            >
                                <MdClose size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleBookingSubmit} className="booking-form">
                            {/* Personal Information Section */}
                            <div className="form-section">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label className="form-label">
                                            Full Name <span className="required">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={bookingForm.name}
                                            onChange={handleBookingChange}
                                            className="form-input"
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">
                                            Phone Number <span className="required">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            value={bookingForm.phoneNumber}
                                            onChange={handleBookingChange}
                                            className="form-input"
                                            placeholder="Enter your phone number"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Event Details Section */}
                            <div className="form-section form-section-sticky">
                                <div className="form-grid form-grid-3">
                                    <div className="form-group">
                                        <label className="form-label">
                                            Check-in Date & Time <span className="required">*</span>
                                        </label>
                                        <div className="date-picker-wrapper">
                                            <DatePicker
                                                selected={bookingForm.checkIn}
                                                onChange={(date) => handleDateChange(date, "checkIn")}
                                                minDate={new Date()}
                                                showTimeSelect
                                                timeFormat="HH:mm"
                                                timeIntervals={15}
                                                timeCaption="Time"
                                                dateFormat="yyyy-MM-dd HH:mm"
                                                className="form-input date-input"
                                                required
                                                placeholderText="Select date and time"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            Check-out Date & Time <span className="required">*</span>
                                        </label>
                                        <div className="date-picker-wrapper">
                                            <DatePicker
                                                selected={bookingForm.checkOut}
                                                onChange={(date) => handleDateChange(date, "checkOut")}
                                                minDate={bookingForm.checkIn || new Date()}
                                                showTimeSelect
                                                timeFormat="HH:mm"
                                                timeIntervals={15}
                                                timeCaption="Time"
                                                dateFormat="yyyy-MM-dd HH:mm"
                                                className="form-input date-input"
                                                required
                                                disabled={!bookingForm.checkIn}
                                                placeholderText="Select date and time"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            Purpose <span className="required">*</span>
                                        </label>
                                        <CustomDropdown
                                            options={hall.purposes}
                                            value={bookingForm.purpose}
                                            onChange={(value) => setBookingForm(prev => ({
                                                ...prev,
                                                purpose: value
                                            }))}
                                            placeholder="Select purpose"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-grid">
                                    <div className="form-group">
                                        <label className="form-label">
                                            Number of Attendees <span className="required">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            name="attendees"
                                            min="1"
                                            max={hall.capacity}
                                            value={bookingForm.attendees}
                                            onChange={handleBookingChange}
                                            className="form-input"
                                            placeholder={`Max ${hall.capacity} people`}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            Guest Rooms Needed
                                        </label>
                                        <input
                                            type="number"
                                            name="guestRooms"
                                            min="0"
                                            value={bookingForm.guestRooms}
                                            onChange={handleBookingChange}
                                            className="form-input"
                                            placeholder="Number of rooms (optional)"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Menu Options Section */}
                            {hallDetails?.menu && hallDetails.menu.length > 0 && (
                                <div className="form-section">
                                    <div className="section-header">
                                        <h3 className="section-title">Menu Options</h3>
                                        <div className="section-divider"></div>
                                    </div>
                                    <div className="menu-options">
                                        {hallDetails.menu.map((menu) => (
                                            <div key={menu.id} className="menu-card">
                                                <div
                                                    className="menu-header"
                                                    onClick={() => handleMenuHeaderClick(menu.id)}
                                                >
                                                    <div className="menu-info">
                                                        {menu.image && (
                                                            <div className="menu-image">
                                                                <img
                                                                    src={`${FOODAPP_BASE_URL.replace("/api/consumer", "")}${menu.image}`}
                                                                    alt={menu.name}
                                                                />
                                                            </div>
                                                        )}
                                                        <div className="menu-details">
                                                            <h4 className="menu-name">{menu.name}</h4>
                                                            <p className="menu-description">Click to view menu items</p>
                                                        </div>
                                                    </div>
                                                    <div className="menu-toggle">
                                                        {bookingForm.selectedMenuId === menu.id ? (
                                                            <FaChevronUp />
                                                        ) : (
                                                            <FaChevronDown />
                                                        )}
                                                    </div>
                                                </div>

                                                {bookingForm.selectedMenuId === menu.id && (
                                                    <div className="menu-content">
                                                        {menu.menuGroups.map((group) => (
                                                            <div key={group.id} className="menu-group">
                                                                <div
                                                                    className="menu-group-header"
                                                                    onClick={() => toggleNestedGroupExpansion(group.id)}
                                                                >
                                                                    <div className="group-info">
                                                                        <h5 className="group-name">{group.name}</h5>
                                                                        {group.help_text && (
                                                                            <p className="group-description">{group.help_text}</p>
                                                                        )}
                                                                    </div>
                                                                    <span className="group-toggle">
                                                                        {bookingForm.expandedGroups[group.id] ? (
                                                                            <FaChevronUp />
                                                                        ) : (
                                                                            <FaChevronDown />
                                                                        )}
                                                                    </span>
                                                                </div>

                                                                {!group.hasSubGroups && renderMenuItems(menu.id, group)}
                                                                {group.hasSubGroups && renderSubGroups(menu.id, group)}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Special Instructions Section */}
                            <div className="form-section">
                                <div className="section-header">
                                    <h3 className="section-title">Special Instructions</h3>
                                    <div className="section-divider"></div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        Additional Requirements
                                    </label>
                                    <textarea
                                        name="message"
                                        value={bookingForm.message}
                                        onChange={handleBookingChange}
                                        rows="4"
                                        className="form-input form-textarea"
                                        placeholder="Any special requests, dietary requirements, or additional instructions for your event..."
                                    />
                                </div>
                            </div>

                            {/* Submit Section */}
                            <div className="form-submit-section">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="submit-btn"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="loading-spinner"></div>
                                            Processing Request...
                                        </>
                                    ) : (
                                        <>
                                            <span>Submit Booking Request</span>
                                            <svg className="submit-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                    <style jsx global>{`
  /* Modal Container */
  .event-booking-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 20px;
    overflow-y: auto;
  }

  .event-booking-modal {
    background: white;
    border-radius: 16px;
    width: 100%;
    max-width: 800px;
    max-height: 90vh;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: column;
  }

  /* Modal Header */
  .modal-header {
    background: linear-gradient(135deg, #BCAB6E 0%, #a89659 100%);
    color: white;
    padding: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
  }

  .modal-title-section {
    flex: 1;
  }

  .modal-title {
    font-size: 1.75rem;
    font-weight: 700;
    margin: 0 0 8px 0;
    color: white;
  }

  .modal-subtitle {
    font-size: 1rem;
    opacity: 0.9;
    margin: 0;
    font-weight: 400;
  }

  .modal-close-btn {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
  }

  .modal-close-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
  }

  /* Form Styles */
  .booking-form {
    overflow-y: auto;
    flex: 1;
  }

  .form-section {
    padding: 20px;
    border-bottom: 1px solid #f0f0f0;
  }

  .form-section-sticky {
    position: sticky;
    padding: 20px;
    top: 0;
    background: white;
    z-index: 100;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border-bottom: 2px solid #BCAB6E;
  }

  /* Add this media query to remove sticky behavior on mobile */
  @media (max-width: 830px) {
    .form-section-sticky {
      position: static;
      box-shadow: none;
      border-bottom: 1px solid #f0f0f0;
    }
  }

  .section-header {
    margin-bottom: 25px;
  }

  .section-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #333;
    margin: 0 0 12px 0;
  }

  .section-divider {
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #BCAB6E, #a89659);
    border-radius: 2px;
  }

  /* Form Layout */
  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .form-grid-3 {
    grid-template-columns: 1fr 1fr 1fr;
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  .form-label {
    font-size: 0.95rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .required {
    color: #dc2626;
    font-size: 0.875rem;
  }

  .form-input {
    border: 2px solid #e5e7eb;
    border-radius: 10px;
    font-size: 1rem;
    padding: 0.5rem 0.75rem;
    transition: all 0.3s ease;
    background: white;
    width: 100%;
    height: 38px;
  }

  .form-input:focus {
    outline: none;
    border-color: #BCAB6E;
    box-shadow: 0 0 0 3px rgba(188, 171, 110, 0.1);
  }

  .form-input::placeholder {
    color: #9ca3af;
  }

  .form-textarea {
    resize: vertical;
    min-height: 100px;
    font-family: inherit;
  }

  /* Date Picker */
  .date-picker-wrapper {
    position: relative;
  }

  .date-input {
    width: 100%;
  }

  /* Menu Options */
  .menu-options {
    space-y: 16px;
  }

  .menu-card {
    border: 2px solid #f3f4f6;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
    margin-bottom: 16px;
  }

  .menu-card:hover {
    border-color: #BCAB6E;
    box-shadow: 0 4px 12px rgba(188, 171, 110, 0.1);
  }

  .menu-header {
    padding: 20px;
    background: #fafafa;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.3s ease;
  }

  .menu-header:hover {
    background: #f5f5f5;
  }

  .menu-info {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .menu-image {
    width: 60px;
    height: 60px;
    border-radius: 10px;
    overflow: hidden;
    flex-shrink: 0;
  }

  .menu-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .menu-details {
    flex: 1;
  }

  .menu-name {
    font-size: 1.125rem;
    font-weight: 600;
    color: #374151;
    margin: 0 0 4px 0;
  }

  .menu-description {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0;
  }

  .menu-toggle {
    color: #BCAB6E;
    font-size: 1.25rem;
  }

  .menu-content {
    padding: 0 20px 20px 20px;
    background: white;
  }

  .menu-group {
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    margin-bottom: 16px;
    overflow: hidden;
  }

  .menu-group-header {
    padding: 16px;
    background: #fafafa;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: background-color 0.3s ease;
  }

  .menu-group-header:hover {
    background: #f5f5f5;
  }

  .group-info {
    flex: 1;
  }

  .group-name {
    font-size: 1rem;
    font-weight: 500;
    color: #374151;
    margin: 0 0 4px 0;
  }

  .group-description {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0;
  }

  .group-toggle {
    color: #BCAB6E;
  }

  /* Submit Section */
  .form-submit-section {
    padding: 30px;
    background: #fafafa;
    border-top: 1px solid #f0f0f0;
  }

  .submit-btn {
    width: 100%;
    background: linear-gradient(135deg, #BCAB6E 0%, #a89659 100%);
    color: white;
    border: none;
    padding: 18px 24px;
    border-radius: 12px;
    font-size: 1.125rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    position: relative;
    overflow: hidden;
  }

  .submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(188, 171, 110, 0.3);
  }

  .submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .submit-arrow {
    width: 20px;
    height: 20px;
    transition: transform 0.3s ease;
  }

  .submit-btn:hover .submit-arrow {
    transform: translateX(4px);
  }

  .loading-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Mobile Responsiveness */
  @media (max-width: 768px) {
    .event-booking-modal-overlay {
      padding: 10px;
    }

    .event-booking-modal {
      max-height: 95vh;
    }

    .modal-header {
      padding: 15px;
    }

    .modal-title {
      font-size: 1rem;
    }

    .modal-subtitle {
      font-size: 0.70rem;
    }

    .form-section {
      padding: 20px;
    }

    .form-grid,
    .form-grid-3 {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .menu-header {
      padding: 16px;
    }

    .menu-info {
      gap: 12px;
    }

    .menu-image {
      width: 50px;
      height: 50px;
    }

    .menu-name {
      font-size: 1rem;
    }

    .submit-btn {
      padding: 16px 20px;
      font-size: 1rem;
    }
  }

  @media (max-width: 480px) {
    .modal-header {
      flex-direction: column;
      gap: 16px;
      text-align: center;
    }

    .modal-close-btn {
      position: absolute;
      top: 20px;
      right: 20px;
    }

    .form-section {
      padding: 16px;
    }

    .menu-info {
      flex-direction: column;
      text-align: center;
    }
  }
`}</style>


                </div>
            )}
        </RoveroLayout>
    );
};

export default EventDetails;