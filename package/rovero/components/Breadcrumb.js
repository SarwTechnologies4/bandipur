import Link from "next/link";

const Breadcrumb = ({
  pageName,
  bgImage = "/images/about-page/about-page-hero.jpg",
  pageTitle,
}) => {
  return (
    <div className="inner-page-hero-area">
      <div
        className="inner-page-height inner-page-bg d-flex align-items-center position-relative black-overly"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-12 d-flex align-items-center justify-content-center">
              <div className="inner-page-content text-center">
                <h1
                  className="text-white mb-20 text-capitalize aos-init"
                  data-aos="fade-up"
                  data-aos-duration={1800}
                  data-aos-delay={50}
                >
                  {pageTitle}
                </h1>
                <p
                  className="text-white aos-init"
                  data-aos="fade-up"
                  data-aos-duration={2500}
                  data-aos-delay={150}
                >
                  
                </p>
              </div>
            </div>
            {/* /col */}
          </div>
          {/* /row */}
        </div>
        {/* /container */}
        <nav
          aria-label="breadcrumb"
          className="inner-hero-nav position-absolute bottom-0 mb-20"
        >
          <ol className="breadcrumb justify-content-center bg-transparent">
            <li className="breadcrumb-item">
              <Link className="text-white" href="/">
                Home
              </Link>
            </li>
            <li
              className="breadcrumb-item active text-capitalize text-white"
              aria-current="page"
            >
              {pageName}
            </li>
          </ol>
        </nav>
        {/* /breadcrumb */}
      </div>
    </div>
  );
};
export default Breadcrumb;
