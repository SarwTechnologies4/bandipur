"use client"
import Breadcrumb from "@/components/Breadcrumb";
import RoveroLayout from "@/layouts/RoveroLayout";
import { useState } from "react";
import Link from "next/link";
const page = () => {
  
    const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  return (
    <RoveroLayout homeClass="hm2" isHeaderSticky={isHeaderSticky}>

      <Breadcrumb
        pageName="Booking"
        bgImage="/images/bg/booking-hero.jpg"
        pageTitle="Booking"
      />

      <div className="booking-page-area mt-120 mb-120">
        <div className="container">
          <div className="row booking-page-wrapper">
            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12">
              <div className="booking-page-content">
                <div className="booking-room-info-area img-hover-effect-wrapper">
                  <h2 className="mb-30">Your Room</h2>
                  <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-7 col-12 img-hover-effect2">
                      <img
                        className="w-100"
                        src="images/bg/booking-img.jpg"
                        alt="booking image"
                      />
                    </div>
                    {/* /col */}
                    <div className="col-xl-6  col-lg-6 col-md-6 col-sm-5 col-12  px-sm-0 px-md-3">
                      <div className="booking-room-info-left">
                        <div className="title">
                          <h2 className="mb-0">
                            <Link href="rooms-details">Luxury Super Delux</Link>
                          </h2>
                        </div>
                        {/* /title */}
                        <ul className="booking-r-info mt-35">
                          <li className="single-rd-info">
                            <img
                              src="images/icon/booking-icon1.png"
                              alt=""
                              className="rd-info-icon"
                            />
                            <span className="d-inline-block text-color mt-10 ml-20">
                              30 sf
                            </span>
                          </li>
                          <li className="single-rd-info">
                            <img
                              src="images/icon/booking-icon2.png"
                              alt=""
                              className="rd-info-icon"
                            />
                            <span className="d-inline-block text-color mt-10 ml-20">
                              3 Guests
                            </span>
                          </li>
                          <li className="single-rd-info">
                            <img
                              src="images/icon/booking-icon3.png"
                              alt=""
                              className="rd-info-icon"
                            />
                            <span className="d-inline-block text-color mt-10 ml-20">
                              3 Beds
                            </span>
                          </li>
                          <li className="single-rd-info">
                            <img
                              src="images/icon/booking-icon4.png"
                              alt=""
                              className="rd-info-icon"
                            />
                            <span className="d-inline-block text-color mt-10 ml-20">
                              City View
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    {/* /col */}
                  </div>
                  {/* /row */}
                </div>
                {/* /booking-room-info-area */}
                <div className="booking-extra-service bp-cnt-ex-ser rp-service mt-50">
                  <h2 className="mb-30">Add Extra Service</h2>
                  <ul>
                    <li>
                      <div className="d-flex mb-10">
                        <input
                          type="checkbox"
                          className="option-input radio"
                          name="example"
                        />
                        <a href="#" className="ml-20">
                          <span className="main-color">Enable Wifi : </span>$10
                          ( Room / Night ) = $10
                        </a>
                      </div>
                    </li>
                    <li>
                      <div className="d-flex mb-10">
                        <input
                          type="checkbox"
                          className="option-input radio"
                          name="example"
                        />
                        <a href="#" className="ml-20">
                          <span className="main-color">Smooking Zone : </span>
                          $10 ( Room / Night ) = $10
                        </a>
                      </div>
                    </li>
                    <li>
                      <div className="d-flex mb-10">
                        <input
                          type="checkbox"
                          className="option-input radio"
                          name="example"
                        />
                        <a href="#" className="ml-20">
                          <span className="main-color">River View : </span>$10 (
                          Room / Trip ) = $10
                        </a>
                      </div>
                    </li>
                    <li>
                      <div className="d-flex mb-10">
                        <input
                          type="checkbox"
                          className="option-input radio"
                          name="example"
                        />
                        <a href="#" className="ml-20">
                          <span className="main-color">Forest View : </span>$10
                          ( Room / Night ) = $10
                        </a>
                      </div>
                    </li>
                    <li>
                      <div className="d-flex mb-10">
                        <input
                          type="checkbox"
                          className="option-input radio"
                          name="example"
                        />
                        <a href="#" className="ml-20">
                          <span className="main-color">Service Guide : </span>
                          $10 ( Room / Night ) = $10
                        </a>
                      </div>
                    </li>
                    <li>
                      <div className="d-flex mb-10">
                        <input
                          type="checkbox"
                          className="option-input radio"
                          name="example"
                        />
                        <a href="#" className="ml-20">
                          <span className="main-color">Restaurant : </span>$10 (
                          Room / Night ) = $10
                        </a>
                      </div>
                    </li>
                    <li>
                      <div className="d-flex mb-10">
                        <input
                          type="checkbox"
                          className="option-input radio"
                          name="example"
                        />
                        <a href="#" className="ml-20">
                          <span className="main-color">Pet Allowed : </span>$10
                          ( Room / Night ) = $10
                        </a>
                      </div>
                    </li>
                    <li>
                      <div className="d-flex mb-10">
                        <input
                          type="checkbox"
                          className="option-input radio"
                          name="example"
                        />
                        <a href="#" className="ml-20">
                          <span className="main-color">Swimming Pool : </span>
                          $10 ( Room / Night ) = $10
                        </a>
                      </div>
                    </li>
                    <li>
                      <div className="d-flex mb-10">
                        <input
                          type="checkbox"
                          className="option-input radio"
                          name="example"
                        />
                        <a href="#" className="ml-20">
                          <span className="main-color">Rest Room : </span>$10 (
                          Room / Night ) = $10
                        </a>
                      </div>
                    </li>
                    <li>
                      <div className="d-flex mb-10">
                        <input
                          type="checkbox"
                          className="option-input radio"
                          name="example"
                        />
                        <a href="#" className="ml-20">
                          <span className="main-color">Child Corner : </span>$10
                          ( Room / Night ) = $10
                        </a>
                      </div>
                    </li>
                  </ul>
                </div>
                {/* /booking-extra-service */}
                <div className="booking-your-info-area mt-40">
                  <div className="row booking-info-header justify-content-between">
                    <div className="col-xl-5  col-lg-  col-md-  col-sm- col- pr-sm-0">
                      <h2 className="mb-30">Add Your Information</h2>
                    </div>
                    {/* /col */}
                    <div className="col-xl-7 col-lg-  col-md-  col-sm- col-">
                      <div className="booking-login-info w-100">
                        {/* login accordion start */}
                        <p className="mb-25 text-md-right">
                          Already Registered ?{" "}
                          <span
                            id="login"
                            className="main-color cursor-pointer f-700 ml-2 pb-1"
                          >
                            login
                          </span>
                        </p>
                        <div
                          id="checkout-login"
                          className="coupon-content mb-35"
                        >
                          <div className="coupon-info">
                            <p className="coupon-text mb-15">
                              Avida turpis sit amet nulla posuere lacinia.
                            </p>
                            <form action="#">
                              <p className="log-mail mb-3">
                                <input
                                  type="text"
                                  className="w-100"
                                  placeholder="Username or email *"
                                />
                              </p>
                              <p className="log-pass mb-3">
                                <input
                                  type="password"
                                  className="w-100"
                                  placeholder="Password"
                                />
                              </p>
                              <div className="log-btn my-btn">
                                <a
                                  href="#"
                                  className="btn d-inline-block theme-bg rounded-0 mr-3"
                                >
                                  Login
                                </a>
                                <div className="save-info d-inline-block mb-30 mt-2">
                                  <input
                                    className="p-0 pr-1"
                                    type="checkbox"
                                    aria-label="Checkbox for following text input"
                                  />
                                  <p className="mb-0 d-inline-block">
                                    Remember me
                                  </p>
                                </div>
                              </div>
                              <p className="lost-password mb-0">
                                <a href="#" className="primary-color">
                                  Lost your password?
                                </a>
                              </p>
                            </form>
                          </div>
                        </div>
                        {/* login accordion start */}
                      </div>
                      {/* /booking-login-info */}
                    </div>
                    {/* /col */}
                  </div>
                  {/* /booking-info-header */}
                  <div className="checkbox-form">
                    <form action="#" className="pl-md-2">
                      <div className="row">
                        <div className="col-xl-6  col-lg-6  col-md-6  col-sm-6 col-12 px-md-2">
                          <div className="checkout-form-list mb-3">
                            <input
                              type="text"
                              placeholder="First Name"
                              className="w-100"
                            />
                          </div>
                        </div>
                        <div className="col-xl-6  col-lg-6  col-md-6  col-sm-6 col-12 px-md-2">
                          <div className="checkout-form-list mb-3">
                            <input
                              type="text"
                              placeholder="Last Name"
                              className="w-100"
                            />
                          </div>
                        </div>
                        <div className="col-xl-6  col-lg-6  col-md-6  col-sm-6 col-12 px-md-2">
                          <div className="checkout-form-list mb-3">
                            <input
                              type="email"
                              placeholder="Email Address"
                              className="w-100"
                            />
                          </div>
                        </div>
                        <div className="col-xl-6  col-lg-6  col-md-6  col-sm-6 col-12 px-md-2">
                          <div className="checkout-form-list mb-3">
                            <input
                              type="tel"
                              placeholder="Phone No"
                              className="w-100"
                            />
                          </div>
                        </div>
                        <div className="col-xl-6  col-lg-6  col-md-12  col-sm-12 col-12 px-md-2">
                          <div className="checkout-form-list mb-3">
                            <input
                              type="text"
                              placeholder="Address"
                              className="w-100"
                            />
                          </div>
                        </div>
                        <div className="col-xl-6  col-lg-6  col-md-12  col-sm-12 col-12 px-md-2">
                          <div className="checkout-form-list mb-3">
                            <input
                              type="text"
                              placeholder="City"
                              className="w-100"
                            />
                          </div>
                        </div>
                        <div className="col-xl-6  col-lg-6  col-md-6  col-sm-6 col-12 px-md-2">
                          <div className="checkout-form-list mb-3">
                            <input
                              type="text"
                              placeholder="Country"
                              className="w-100"
                            />
                          </div>
                        </div>
                        <div className="col-xl-6  col-lg-6  col-md-6  col-sm-6 col-12 px-md-2">
                          <div className="checkout-form-list mb-3">
                            <input
                              type="text"
                              placeholder="Zip Code"
                              className="w-100"
                            />
                          </div>
                        </div>
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 mb-3 px-md-2">
                          <textarea
                            className="massage w-100 primary-border pl-20 pt-20"
                            name="inputMessage"
                            id="inputMessage"
                            placeholder="Additional message"
                            required=""
                            defaultValue={""}
                          />
                          {/* /textarea */}
                        </div>
                        {/* /col */}
                        <div className="col-xl-12  col-lg-12  col-md-12  col-sm-12 col-12 px-md-2">
                          <div className="cupon-code mb-3">
                            <input
                              type="password"
                              placeholder="Cupon-code"
                              className="w-100"
                            />
                          </div>
                        </div>
                        <div className="col-xl-12  col-lg-12  col-md-12  col-sm-12 col-12 px-md-2">
                          <div className="my-btn w-100">
                            <button
                              className="btn theme-bg text-uppercase rounded-0 f-500"
                              type="submit"
                              name="submit"
                              data-aos="fade-up"
                              data-aos-anchor-placement="top-bottom"
                              data-aos-duration={2500}
                            >
                              book now
                            </button>
                          </div>
                        </div>
                      </div>
                      {/* /row */}
                    </form>
                  </div>
                </div>
                {/* /booking-your-info-area */}
              </div>
              {/* /rooms-page-right-sidebar */}
            </div>
            {/* /col */}
            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">
              <div className="row booking-page-left-sidebar mt-5 mt-lg-0 pt-1 pt-md-3 pt-lg-0">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                  <div className="sidebar-widget sidebar-search-area rp-booking-area section-bg pl-30 pr-30 pt-45 pb-45">
                    <div className="rpb-price text-center mb-25">
                      <span className="d-block text-color">sub total</span>
                      <span className="room-price d-block f-700 main-color fontNoto text-uppercase">
                        $299
                      </span>
                    </div>
                    {/* /rpb-price */}
                    <div className="form-hotel-search pb-50">
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
                            disabled=""
                          />
                        </div>
                        {/* /check-in */}
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
                            disabled=""
                          />
                        </div>
                        {/* /check-out */}
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
                            >
                              <option value="menu_order" selected="selected">
                                02
                              </option>
                              <option value="popularity">03</option>
                              <option value="rating">04</option>
                              <option value="date">05</option>
                              <option value="price">06</option>
                            </select>
                          </div>
                        </div>
                        {/* /check-guests-form */}
                      </form>
                    </div>
                    {/* /check-in-form */}
                  </div>
                  {/* /rp-booking-area */}
                </div>
                {/* /col */}
              </div>
              {/* /rooms-page-left-sidebar */}
            </div>
            {/* /col */}
          </div>
          {/* /row */}
        </div>
        {/* /container */}
      </div>
    </RoveroLayout>
  );
};
export default page;
