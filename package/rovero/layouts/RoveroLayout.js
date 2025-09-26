"use client";
import EmbedPopup from "@/components/EmbedPopup";
import { niceSelect } from "@/utility/nice-select";
import { RoveroUtility } from "@/utility/roveroUtility";
import { Fragment, useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Scroll from "./Scroll";
import Chatbot from "@/components/Chatbot";

const RoveroLayout = ({ children, homeClass, isHeaderSticky }) => {
  useEffect(() => {
    RoveroUtility.animation();
    RoveroUtility.bgImage();
    niceSelect();
  }, []);

  return (
    <Fragment>
      <EmbedPopup />
      <Header homeClass={homeClass} sticky={isHeaderSticky} />
      {children}
      <Footer />
      <Scroll />
      <Chatbot/>
    </Fragment>
  );
};

export default RoveroLayout;
