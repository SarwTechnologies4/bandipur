"use client"
import Breadcrumb from "@/components/Breadcrumb";
import RoveroLayout from "@/layouts/RoveroLayout";
import dynamic from "next/dynamic";
import { useState, useRef , useEffect } from "react";
const BlogIsotope = dynamic(() => import("@/components/BlogIsotope"), {
  ssr: false,
});
const page = () => {
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

  return (
    <RoveroLayout homeClass="hm2" isHeaderSticky={isHeaderSticky}>

      <Breadcrumb
        pageName="blog"
        bgImage="images/blog-page/blog-page-hero.jpg"
        pageTitle="News & Events"
      />
      <BlogIsotope />
    </RoveroLayout>
  );
};
export default page;
