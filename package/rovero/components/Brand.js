"use client";
import { sliderProps } from "@/utility/sliderProps";
import Slider from "react-slick";

const Brand = () => {
  return (
    <div className="brand-area over-hidden">
      <div className="container">
        <Slider
          {...sliderProps.brandActive}
          className="row brand-active brand-wapper pt-70 pb-50"
        >
          <div className="text-center">
            <div className="single-brand mb-30 d-block text-center">
              <img
                className="d-inline-block"
                src="images/brand/brand-logo1.png"
                alt="image"
              />
            </div>
          </div>
          {/* /col */}
          <div className="text-center">
            <div className="single-brand mb-30 d-block text-center">
              <img
                className="d-inline-block"
                src="images/brand/brand-logo2.png"
                alt="image"
              />
            </div>
          </div>
          {/* /col */}
          <div className="text-center">
            <div className="single-brand mb-30 d-block text-center">
              <img
                className="d-inline-block"
                src="images/brand/brand-logo3.png"
                alt="image"
              />
            </div>
          </div>
          {/* /col */}
          <div className="text-center">
            <div className="single-brand mb-30 d-block text-center">
              <img
                className="d-inline-block"
                src="images/brand/brand-logo4.png"
                alt="image"
              />
            </div>
          </div>
          {/* /col */}
          <div className="text-center">
            <div className="single-brand mb-30 d-block text-center">
              <img
                className="d-inline-block"
                src="images/brand/brand-logo1.png"
                alt="image"
              />
            </div>
          </div>
          {/* /col */}
          <div className="text-center">
            <div className="single-brand mb-30 d-block text-center">
              <img
                className="d-inline-block"
                src="images/brand/brand-logo2.png"
                alt="image"
              />
            </div>
          </div>
          {/* /col */}
          <div className="text-center">
            <div className="single-brand mb-30 d-block text-center">
              <img
                className="d-inline-block"
                src="images/brand/brand-logo3.png"
                alt="image"
              />
            </div>
          </div>
          {/* /col */}
          <div className="text-center">
            <div className="single-brand mb-30 d-block text-center">
              <img
                className="d-inline-block"
                src="images/brand/brand-logo4.png"
                alt="image"
              />
            </div>
          </div>
          {/* /col */}
        </Slider>
        {/* /row */}
      </div>
      {/* /container */}
    </div>
  );
};
export default Brand;
