"use client";
import { RoveroUtility } from "@/utility/roveroUtility";
import { useEffect } from "react";

const Scroll = () => {
  useEffect(() => {
    RoveroUtility.scrollBtn();
  }, []);

  return (
    <div id="scroll" className="scroll-up">
      <div className="top text-center">
        <span className="white-bg theme-color d-block">
          <i className="fa-solid fa-angles-up" />
        </span>
      </div>
    </div>
  );
};
export default Scroll;
