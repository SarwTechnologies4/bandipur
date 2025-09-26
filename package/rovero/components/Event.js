"use client"

import { useState, useEffect } from "react"
import { FaStar, FaChevronDown, FaChevronUp } from "react-icons/fa"
import Link from "next/link"
import { BsArrowRight } from "react-icons/bs"
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import { IoIosCall } from "react-icons/io"
import { MdEmail, MdOutlineShareLocation, MdClose } from "react-icons/md"
import Swal from "sweetalert2"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { useSearchParams } from "next/navigation"
const Event = () => {
    const [halls, setHalls] = useState([])
    const [extraFacilities, setExtraFacilities] = useState([])
    const [formData, setFormData] = useState({
        Name: "",
        Email: "",
        Message: "",
    })
    const [submitting, setSubmitting] = useState(false)
    const [noHallsFound, setNoHallsFound] = useState(false)
    const [isFiltered, setIsFiltered] = useState(false)
    const [selectedHall, setSelectedHall] = useState(null)
    const [showBookingModal, setShowBookingModal] = useState(false)
    const [bookingForm, setBookingForm] = useState({
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
    })
    const [maxChoiceMessages, setMaxChoiceMessages] = useState({})
    const [hallDetails, setHallDetails] = useState(null)
    const [loadingHallDetails, setLoadingHallDetails] = useState(false)

    const CMS_BASE_URL = process.env.NEXT_PUBLIC_CMS_BASE_URL
    const API_KEY = process.env.NEXT_PUBLIC_API_KEY2
    const FOODAPP_BASE_URL = process.env.NEXT_PUBLIC_FOODAPP_BASE_URL
    const FOODAPP_API_KEY = process.env.NEXT_PUBLIC_FOODAPP_API_KEY
    const IMAGE_BASE_URL = CMS_BASE_URL ? CMS_BASE_URL.replace("/api/consumer", "") : ""
    const CONTACT_US_ENDPOINT = "/contact-us-villasa"

    const [searchParams] = useSearchParams()

    const formatSize = (size) => {
        return new Intl.NumberFormat("en-US").format(size)
    }

    useEffect(() => {
        const fetchHalls = async () => {
            setNoHallsFound(false)

            // Get search params correctly
            const searchParamsString = searchParams.toString()
            const params = new URLSearchParams(searchParamsString)

            const bookingFrom = params.get("booking_from")
            const bookingTo = params.get("booking_to")
            const guests = params.get("guests")
            const purpose = params.get("purpose")

            const hasSearchParams = bookingFrom && bookingTo && guests && purpose
            setIsFiltered(hasSearchParams)

            let apiUrl, queryParams

            if (hasSearchParams) {
                apiUrl = `${FOODAPP_BASE_URL}/halls/availability`
                queryParams = new URLSearchParams()
                queryParams.append("propertyId", "property-3")
                queryParams.append("booking_from", bookingFrom)
                queryParams.append("booking_to", bookingTo)
                queryParams.append("guests", guests)
                queryParams.append("purpose", purpose)
            } else {
                apiUrl = `${FOODAPP_BASE_URL}/halls`
                queryParams = new URLSearchParams()
                queryParams.append("propertyId", "property-3")
            }

            try {
                const res = await fetch(`${apiUrl}?${queryParams.toString()}`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                const data = await res.json()

                if (data && data.length > 0) {
                    const mappedHalls = data.map((hall) => ({
                        id: hall.id,
                        title: hall.name,
                        size: formatSize(hall.size),
                        image: hall.media?.[0]
                            ? `${FOODAPP_BASE_URL.replace("/api/consumer", "")}${hall.media[0]}`
                            : "/placeholder.svg?height=250&width=400",
                        description: hall.description,
                        category: hall.majorAttraction || "Event Hall",
                        capacity: hall.capacity,
                        dailyPrice: hall.dailyPrice,
                        purposes: hall.usedFor || []
                    }))
                    setHalls(mappedHalls)
                } else {
                    setHalls([])
                    setNoHallsFound(true)
                }
            } catch (err) {
                console.error("Error fetching halls:", err)
                setHalls([])
                setNoHallsFound(true)
            }
        }
        fetchHalls()
    }, [FOODAPP_BASE_URL, searchParams])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            const url = `${CMS_BASE_URL}${CONTACT_US_ENDPOINT}`
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${API_KEY}`,
                },
                body: JSON.stringify({
                    Name: formData.Name,
                    Email: formData.Email,
                    Message: formData.Message,
                }),
            })
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            Swal.fire({
                title: "Success!",
                text: "Your message has been sent successfully!",
                icon: "success",
                background: "#BCAB6E",
                color: "#fff",
                confirmButtonColor: "#008000",
            })
            setFormData({ Name: "", Email: "", Message: "" })
        } catch (error) {
            console.error("Error:", error)
            Swal.fire({
                title: "Error!",
                text: `Failed to send message: ${error.message}`,
                icon: "error",
                background: "#BCAB6E",
                color: "#fff",
                confirmButtonColor: "#d33",
            })
        } finally {
            setSubmitting(false)
        }
    }

    const handleBookingChange = (e) => {
        const { name, value } = e.target
        setBookingForm((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleDateChange = (date, field) => {
        setBookingForm((prev) => ({
            ...prev,
            [field]: date,
        }))
    }

    const handleOpenBookingModal = (hall) => {
        setSelectedHall(hall)
        setShowBookingModal(true)
        fetchHallDetails(hall.id)
    }

    const fetchHallDetails = async (hallId) => {
        setLoadingHallDetails(true)
        try {
            const res = await fetch(`${FOODAPP_BASE_URL}/halls/${hallId}`, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            const data = await res.json()
            setHallDetails(data)

            const initialSelections = {}
            const initialExpanded = {}
            if (data.menu && data.menu.length > 0) {
                data.menu.forEach((menu) => {
                    initialSelections[menu.id] = {}
                    menu.menuGroups.forEach((group) => {
                        initialSelections[menu.id][group.id] = []
                        initialExpanded[group.id] = false
                        if (group.hasSubGroups && group.subGroups) {
                            group.subGroups.forEach((subGroup) => {
                                initialSelections[menu.id][subGroup.id] = []
                                initialExpanded[subGroup.id] = false
                            })
                        }
                    })
                })
            }

            const bookingFromParam = searchParams.get("booking_from")
            const bookingToParam = searchParams.get("booking_to")
            const guestsParam = searchParams.get("guests")
            const purposeParam = searchParams.get("purpose")
            const guestRoomsParam = searchParams.get("guestRooms")

            let initialCheckIn = null
            let initialCheckOut = null
            let initialAttendees = ""
            let initialPurpose = ""
            let initialGuestRooms = ""

            if (bookingFromParam && bookingToParam && guestsParam && purposeParam) {
                try {
                    initialCheckIn = new Date(bookingFromParam)
                    initialCheckOut = new Date(bookingToParam)
                    initialAttendees = Number.parseInt(guestsParam, 10)
                    initialPurpose = purposeParam
                    initialGuestRooms = guestRoomsParam ? Number.parseInt(guestRoomsParam, 10) : ""
                } catch (parseError) {
                    console.error("Error parsing search params dates/numbers:", parseError)
                }
            }

            setBookingForm((prev) => ({
                ...prev,
                checkIn: initialCheckIn,
                checkOut: initialCheckOut,
                attendees: initialAttendees,
                purpose: initialPurpose,
                guestRooms: initialGuestRooms,
                name: "",
                phoneNumber: "",
                message: "",
                menuSelections: initialSelections,
                expandedGroups: initialExpanded,
                selectedMenuId: null,
            }))
            setMaxChoiceMessages({})
        } catch (err) {
            console.error("Error fetching hall details:", err)
            Swal.fire({
                title: "Error!",
                text: "Failed to load hall details. Please try again.",
                icon: "error",
                background: "#BCAB6E",
                color: "#fff",
                confirmButtonColor: "#d33",
            })
        } finally {
            setLoadingHallDetails(false)
        }
    }

    const handleMenuSelection = (menuId, groupId, itemId, isChecked, maxChoice) => {
        setBookingForm((prev) => {
            const newSelections = { ...prev.menuSelections }

            Object.keys(newSelections).forEach((existingMenuId) => {
                if (existingMenuId !== menuId.toString()) {
                    Object.keys(newSelections[existingMenuId]).forEach((existingGroupId) => {
                        newSelections[existingMenuId][existingGroupId] = []
                    })
                }
            })

            const currentGroupSelections = newSelections[menuId]?.[groupId] || []
            let newMaxChoiceMessages = { ...maxChoiceMessages }

            if (isChecked) {
                if (maxChoice && currentGroupSelections.length >= maxChoice) {
                    newMaxChoiceMessages = { ...newMaxChoiceMessages, [groupId]: `Max ${maxChoice} choices allowed.` }
                    setMaxChoiceMessages(newMaxChoiceMessages)
                    return prev
                } else {
                    if (!currentGroupSelections.includes(itemId)) {
                        newSelections[menuId] = {
                            ...newSelections[menuId],
                            [groupId]: [...currentGroupSelections, itemId],
                        }
                    }
                    if (newMaxChoiceMessages[groupId]) {
                        delete newMaxChoiceMessages[groupId]
                        setMaxChoiceMessages(newMaxChoiceMessages)
                    }
                }
            } else {
                newSelections[menuId] = {
                    ...newSelections[menuId],
                    [groupId]: currentGroupSelections.filter((id) => id !== itemId),
                }
                if (newMaxChoiceMessages[groupId] && (newSelections[menuId][groupId].length < maxChoice || maxChoice === 0)) {
                    delete newMaxChoiceMessages[groupId]
                    setMaxChoiceMessages(newMaxChoiceMessages)
                }
            }

            return {
                ...prev,
                menuSelections: newSelections,
            }
        })
    }

    const handleMenuHeaderClick = (menuId) => {
        setBookingForm((prev) => {
            const newSelections = { ...prev.menuSelections }

            if (prev.selectedMenuId !== menuId) {
                Object.keys(newSelections).forEach((existingMenuId) => {
                    if (existingMenuId !== menuId.toString()) {
                        Object.keys(newSelections[existingMenuId]).forEach((existingGroupId) => {
                            newSelections[existingMenuId][existingGroupId] = []
                        })
                    }
                })
            }

            return {
                ...prev,
                selectedMenuId: prev.selectedMenuId === menuId ? null : menuId,
                menuSelections: newSelections,
                expandedGroups: prev.selectedMenuId === menuId ? prev.expandedGroups : {},
            }
        })
        setMaxChoiceMessages({})
    }

    const toggleNestedGroupExpansion = (groupId) => {
        setBookingForm((prev) => ({
            ...prev,
            expandedGroups: {
                ...prev.expandedGroups,
                [groupId]: !prev.expandedGroups[groupId],
            },
        }))
    }

    const renderMenuItems = (menuId, group) => {
        const isExpanded = bookingForm.expandedGroups[group.id]
        const maxChoice = group.maxChoice
        const currentSelectionsCount = bookingForm.menuSelections[menuId]?.[group.id]?.length || 0
        const isMaxReached = maxChoice && currentSelectionsCount >= maxChoice

        if (!isExpanded) return null

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
        )
    }

    const renderSubGroups = (menuId, group) => {
        if (!group.hasSubGroups || !group.subGroups) return null

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
        )
    }

    const handleBookingSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (bookingForm.attendees < 1) {
            Swal.fire({
                title: "Invalid Attendees",
                text: "Number of attendees must be at least 1",
                icon: "warning",
                background: "#BCAB6E",
                color: "#fff",
                confirmButtonColor: "#d33",
            });
            return;
        }

        if (bookingForm.checkOut <= bookingForm.checkIn) {
            Swal.fire({
                title: "Invalid Dates",
                text: "Check-out date must be after check-in date",
                icon: "warning",
                background: "#BCAB6E",
                color: "#fff",
                confirmButtonColor: "#d33",
            });
            return;
        }

        if (!bookingForm.purpose) {
            Swal.fire({
                title: "Purpose Required",
                text: "Please specify the purpose of your event",
                icon: "warning",
                background: "#BCAB6E",
                color: "#fff",
                confirmButtonColor: "#d33",
            });
            return;
        }

        if (!bookingForm.name.trim()) {
            Swal.fire({
                title: "Name Required",
                text: "Please enter your name",
                icon: "warning",
                background: "#BCAB6E",
                color: "#fff",
                confirmButtonColor: "#d33",
            });
            return;
        }

        if (!bookingForm.phoneNumber.trim()) {
            Swal.fire({
                title: "Phone Number Required",
                text: "Please enter your phone number",
                icon: "warning",
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
                // Flatten all selected items from all groups
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
                hallId: selectedHall.id,
                selectedMenuId: selectedMenuId || null,
                selectedItemIds,
                name: bookingForm.name,
                phone: bookingForm.phoneNumber,
                instructions: bookingForm.message || "",
            };

            // Submit to API
            const response = await fetch(`${FOODAPP_BASE_URL}/halls/bookings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${FOODAPP_API_KEY}`
                },
                body: JSON.stringify(bookingData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            Swal.fire({
                title: "Booking Request Submitted!",
                html: `
        <div class="text-left">
          <p class="mb-2"><strong>Reference #:</strong> ${result.bookingId || 'N/A'}</p>
          <p class="mb-2"><strong>Hall:</strong> ${selectedHall.title}</p>
          <p class="mb-2"><strong>Name:</strong> ${bookingForm.name}</p>
          <p class="mb-2"><strong>Phone:</strong> ${bookingForm.phoneNumber}</p>
          <p class="mb-2"><strong>Dates:</strong> ${bookingForm.checkIn.toLocaleString()} - ${bookingForm.checkOut.toLocaleString()}</p>
          <p class="mb-2"><strong>Purpose:</strong> ${bookingForm.purpose}</p>
          <p class="mb-2"><strong>Attendees:</strong> ${bookingForm.attendees}</p>
          <p class="mb-2"><strong>Guest Rooms:</strong> ${bookingForm.guestRooms || "None"}</p>
          ${bookingForm.message ? `<p class="mb-2"><strong>Instructions:</strong> ${bookingForm.message}</p>` : ''}
        </div>
      `,
                icon: "success",
                background: "#BCAB6E",
                color: "#fff",
                confirmButtonColor: "#008000",
            });

            // Reset form and close modal
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
            Swal.fire({
                title: "Error!",
                text: "Failed to submit booking. Please try again.",
                icon: "error",
                background: "#BCAB6E",
                color: "#fff",
                confirmButtonColor: "#d33",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const [sliderRef, sliderInstance] = useKeenSlider({
        breakpoints: {
            "(min-width: 400px)": {
                slides: { origin: "center", perView: 1 },
                spacing: 10,
            },
            "(min-width: 500px)": {
                slides: { origin: "center", perView: 1.5 },
                spacing: 10,
            },
            "(min-width: 600px)": {
                slides: { origin: "center", perView: 1 },
                spacing: 15,
            },
            "(min-width: 768px)": {
                slides: { origin: "center", perView: 1 },
                spacing: 18,
            },
            "(min-width: 992px)": {
                slides: { origin: "center", perView: 2 },
                spacing: 20,
            },
        },
        loop: true,
        initial: 0,
        created: (slider) => {
            slider.autoplay = setInterval(() => {
                slider.next()
            }, 3000)
        },
        destroyed: (slider) => {
            if (slider.autoplay) {
                clearInterval(slider.autoplay)
            }
        },
        dragStarted: (slider) => {
            if (slider.autoplay) {
                clearInterval(slider.autoplay)
                slider.autoplay = null
            }
        },
        dragEnded: (slider) => {
            if (!slider.autoplay) {
                slider.autoplay = setInterval(() => {
                    slider.next()
                }, 3000)
            }
        },
    })

    return (
        <section className="">
            {/* Hero Section */}
            <div className="relative bg-[url('/images/inner/meeting.jpg')] bg-cover h-[550px] bg-center grid items-center justify-center">
                <div className="absolute inset-0 bg-black/40 z-0"></div>
                <div className="relative z-10 mt-10 text-center">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl leading-10 lg:leading-[60px] 2xl:leading-[70px] text-white font-semibold font-Garamond uppercase">
                        Event Halls
                    </h1>
                    <Link
                        href="/"  // Changed from 'to' to 'href'
                        className="inline-block mt-5 px-6 py-2 text-sm md:text-base font-medium text-white bg-khaki hover:bg-opacity-90 transition rounded"
                    >
                        ← Back
                    </Link>
                </div>
            </div>

            {/* All Events */}
{/* All Events */}
{/* All Events */}
<div className="rooms-hm2-area room-page2 hm2 mt-120 mb-120">
  <div className="container-fluid container-wrapper p-md-0">
    <div className="text-center mb-60">
      <div className="flex items-center justify-center space-x-4 mb-4">
        <hr className="w-[100px] h-[1px] bg-lightGray dark:bg-gray" />
        <img 
          src="/images/inner/inner-logo.png" 
          alt="event_section_logo" 
          className="w-[50px] h-[50px]" 
        />
        <hr className="w-[100px] h-[1px] bg-lightGray dark:bg-gray" />
      </div>
      <h2 className="section-content-title mb-22">
        {isFiltered ? "Available Event Halls" : "SIDDHARTHA Vilasa's Event Halls"}
      </h2>
      {isFiltered && (
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Showing halls available for your selected criteria
        </p>
      )}
    </div>

    {noHallsFound ? (
      <div className="text-center text-lg text-gray-600 dark:text-gray-400 mt-10">
        {isFiltered
          ? "No event halls available for the selected criteria. Please try different dates or requirements."
          : "No event halls found."}
      </div>
    ) : (
      <div className="row">
        {halls.map((hall, index) => (
          <div 
            key={hall.id} 
            className={`row rooms-hm2-wrapper ${index % 2 !== 0 ? 'rooms-hm2-wrapper2 flex-column-reverse flex-md-row' : ''} no-gutters align-items-md-center img-hover-effect-wrapper mb-60`}
            data-aos="fade-up"
            data-aos-duration="1000"
          >
            {/* Image Column - alternates sides based on index */}
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 px-xl-0">
              <div className="room-hm2-img transition5 zoom-img-hover img-hover-effect2 over-hidden position-relative">
                <img
                  className="w-100 img"
                  src={hall.image || "/placeholder.svg?height=250&width=400"}
                  alt={hall.title}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = "/placeholder.svg?height=250&width=400"
                  }}
                />
                <div className="px-5 py-2 inline-flex bg-khaki text-sm items-center justify-center text-white absolute top-[10px] right-[10px]">
                  <span>{hall.size} SQ.FT</span>
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="room-hm2-content hm2-room-content-margin p-8">
                <div className="ratting-area d-flex align-items-center mb-4">
                  <ul className="review-ratting flex">
                    {[...Array(5)].map((_, i) => (
                      <li key={i} className="mr-1">
                        <FaStar className="text-khaki" />
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="section-content-title">
                  <h4 className="text-khaki uppercase font-semibold mb-2">{hall.category}</h4>
                  <h2 className="mb-4">
                    <Link 
                      href={`/home3/events/${hall.id}?${searchParams.toString()}`}
                      className="text-lightBlack dark:text-white hover:text-khaki transition-colors duration-300"
                    >
                      {hall.title}
                    </Link>
                  </h2>
                  <p className="text-gray dark:text-lightGray mb-4">{hall.description}</p>
                </div>
                
                <div className="room-info-details mt-6">
                  <div className="room-info d-flex flex-wrap">
                    <ul className="room-info-left pr-8">
                      <li className="mb-2">
                        <span className="font-semibold">Capacity</span>
                      </li>
                      <li className="mb-2">
                        <span className="font-semibold">Price</span>
                      </li>
                      <li className="mb-2">
                        <span className="font-semibold">Purposes</span>
                      </li>
                    </ul>
                    <ul className="room-info-right">
                      <li className="mb-2"><span>{hall.capacity} people</span></li>
                      <li className="mb-2"><span>NPR {hall.dailyPrice}/day</span></li>
                      <li className="mb-2">
                        <span>{hall.purposes.join(', ')}</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="my-btn mt-8">
                    <button
                      onClick={() => handleOpenBookingModal(hall)}
                      className="btn theme-bg w-full md:w-auto px-8 py-3 text-white hover:bg-opacity-90 transition-all duration-300 flex items-center"
                    >
                      Book Now <BsArrowRight className="w-4 h-4 ml-2 text-white" />
                    </button>
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
            {/* Booking Modal */}
            {showBookingModal && selectedHall && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className={`${window.innerWidth > 500 ? 'sticky top-0 bg-white z-30 border-b shadow-sm' : 'border-b shadow-sm'}`}>
                                <div className="flex justify-between items-center py-4 px-6">
                                    <h2 className="text-2xl font-bold text-gray-800">Book {selectedHall.title}</h2>
                                    <button onClick={() => setShowBookingModal(false)} className="text-gray-500 hover:text-gray-700">
                                        <MdClose size={24} />
                                    </button>
                                </div>

                                <div className="p-4 space-y-4 border-t">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={bookingForm.name}
                                                onChange={handleBookingChange}
                                                className="w-full p-2 border rounded-md"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                            <input
                                                type="tel"
                                                name="phoneNumber"
                                                value={bookingForm.phoneNumber}
                                                onChange={handleBookingChange}
                                                className="w-full p-2 border rounded-md"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                                            <DatePicker
                                                selected={bookingForm.checkIn}
                                                onChange={(date) => handleDateChange(date, "checkIn")}
                                                minDate={new Date()}
                                                showTimeSelect
                                                timeFormat="HH:mm"
                                                timeIntervals={15}
                                                timeCaption="Time"
                                                dateFormat="yyyy-MM-dd HH:mm"
                                                className="w-full p-2 border rounded-md"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                                            <DatePicker
                                                selected={bookingForm.checkOut}
                                                onChange={(date) => handleDateChange(date, "checkOut")}
                                                minDate={bookingForm.checkIn || new Date()}
                                                showTimeSelect
                                                timeFormat="HH:mm"
                                                timeIntervals={15}
                                                timeCaption="Time"
                                                dateFormat="yyyy-MM-dd HH:mm"
                                                className="w-full p-2 border rounded-md"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                                            <select
                                                name="purpose"
                                                value={bookingForm.purpose}
                                                onChange={handleBookingChange}
                                                className="w-full p-2 border rounded-md"
                                                required
                                            >
                                                <option value="">Select purpose</option>
                                                {selectedHall.purposes.map((purpose) => (
                                                    <option key={purpose} value={purpose}>
                                                        {purpose}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Attendees</label>
                                            <input
                                                type="number"
                                                name="attendees"
                                                min="1"
                                                max={selectedHall.capacity}
                                                value={bookingForm.attendees}
                                                onChange={handleBookingChange}
                                                className="w-full p-2 border rounded-md"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Guest Rooms Needed</label>
                                            <input
                                                type="number"
                                                name="guestRooms"
                                                min="0"
                                                value={bookingForm.guestRooms}
                                                onChange={handleBookingChange}
                                                className="w-full p-2 border rounded-md"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 p-4">
                                {hallDetails?.menu && hallDetails.menu.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Menu Options</label>
                                        <div className="space-y-4">
                                            {hallDetails.menu.map((menu) => (
                                                <div key={menu.id} className="border rounded-lg p-4">
                                                    <div
                                                        className="flex items-center mb-3 cursor-pointer"
                                                        onClick={() => handleMenuHeaderClick(menu.id)}
                                                    >
                                                        {menu.image && (
                                                            <img
                                                                src={`${FOODAPP_BASE_URL.replace("/api/consumer", "")}${menu.image}`}
                                                                alt={menu.name}
                                                                className="w-16 h-16 object-cover rounded mr-3"
                                                            />
                                                        )}
                                                        <h4 className="font-medium">{menu.name}</h4>
                                                        <span className="ml-auto">
                                                            {bookingForm.selectedMenuId === menu.id ? (
                                                                <FaChevronUp className="inline" />
                                                            ) : (
                                                                <FaChevronDown className="inline" />
                                                            )}
                                                        </span>
                                                    </div>

                                                    {bookingForm.selectedMenuId === menu.id && (
                                                        <div className="space-y-3">
                                                            {menu.menuGroups.map((group) => (
                                                                <div key={group.id}>
                                                                    <div
                                                                        className="flex justify-between items-center cursor-pointer"
                                                                        onClick={() => toggleNestedGroupExpansion(group.id)}
                                                                    >
                                                                        <h5 className="font-medium">{group.name}</h5>
                                                                        <span className="text-sm text-gray-500">
                                                                            {bookingForm.expandedGroups[group.id] ? (
                                                                                <FaChevronUp className="inline" />
                                                                            ) : (
                                                                                <FaChevronDown className="inline" />
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                    {group.help_text && <p className="text-sm text-gray-500 mb-2">{group.help_text}</p>}

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

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
                                    <textarea
                                        name="message"
                                        value={bookingForm.message}
                                        onChange={handleBookingChange}
                                        rows="3"
                                        className="w-full p-2 border rounded-md"
                                        placeholder="Any special requests or instructions for your event..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    onClick={handleBookingSubmit}
                                    disabled={submitting}
                                    className="w-full bg-khaki text-white py-3 rounded-md hover:bg-opacity-90 transition flex items-center justify-center"
                                >
                                    {submitting ? (
                                        <>
                                            <svg
                                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        "Submit Booking Request"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </section>
    )
}

export default Event