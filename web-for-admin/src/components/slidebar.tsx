import React, { useState, useRef, useEffect } from "react";
import PerfectScrollbar from "perfect-scrollbar";
import { Link } from "react-router-dom"; // Import Link từ react-router-dom

// Importing CSS and external libraries


import logo from "../assets/images/logo/logo.png";

// Slide toggle function with smooth animations
const slideToggle = (
  element: HTMLElement,
  duration = 400,
  callback?: () => void
) => {
  if (element.clientHeight === 0) {
    slideAction(element, duration, callback, true);
  } else {
    slideAction(element, duration, callback);
  }
};
const slideAction = (
  element: HTMLElement,
  duration: number,
  callback?: () => void,
  isOpening = false
) => {
  element.style.overflow = "hidden";
  if (isOpening) element.style.display = "block";

  const computedStyle = window.getComputedStyle(element);
  const height = parseFloat(computedStyle.getPropertyValue("height"));
  const paddingTop = parseFloat(computedStyle.getPropertyValue("padding-top"));
  const paddingBottom = parseFloat(
    computedStyle.getPropertyValue("padding-bottom")
  );
  const marginTop = parseFloat(computedStyle.getPropertyValue("margin-top"));
  const marginBottom = parseFloat(
    computedStyle.getPropertyValue("margin-bottom")
  );

  const step = (timestamp: number, startTime: number) => {
    const progress = (timestamp - startTime) / duration;
    if (isOpening) {
      element.style.height = height * progress + "px";
      element.style.paddingTop = paddingTop * progress + "px";
      element.style.paddingBottom = paddingBottom * progress + "px";
      element.style.marginTop = marginTop * progress + "px";
      element.style.marginBottom = marginBottom * progress + "px";
    } else {
      element.style.height = height * (1 - progress) + "px";
      element.style.paddingTop = paddingTop * (1 - progress) + "px";
      element.style.paddingBottom = paddingBottom * (1 - progress) + "px";
      element.style.marginTop = marginTop * (1 - progress) + "px";
      element.style.marginBottom = marginBottom * (1 - progress) + "px";
    }

    if (progress < 1) {
      window.requestAnimationFrame((newTimestamp) =>
        step(newTimestamp, startTime)
      );
    } else {
      element.style.height = "";
      element.style.paddingTop = "";
      element.style.paddingBottom = "";
      element.style.marginTop = "";
      element.style.marginBottom = "";
      element.style.overflow = "";
      if (!isOpening) element.style.display = "none";
      if (callback) callback();
    }
  };

  window.requestAnimationFrame((timestamp) => step(timestamp, timestamp));
};

// Sidebar component
const Sidebar: React.FC = () => {
  const [sidebarActive, setSidebarActive] = useState(window.innerWidth >= 1200);
  const [submenuState, setSubmenuState] = useState<{ [key: string]: boolean }>({
    management: false,
    data: false,
  });

  const sidebarRef = useRef<HTMLDivElement>(null);

  // Handle window resize for sidebar responsiveness
  useEffect(() => {
    const handleResize = () => {
      setSidebarActive(window.innerWidth >= 1200);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  const toggleSubmenu = (submenuKey: string, submenuElement: HTMLElement) => {
    setSubmenuState((prevState) => ({
      ...prevState,
      [submenuKey]: !prevState[submenuKey],
    }));
    slideToggle(submenuElement, 300);
  };

  // Initialize Perfect Scrollbar when sidebar is loaded
  useEffect(() => {
    if (typeof PerfectScrollbar === "function" && sidebarRef.current) {
      new PerfectScrollbar(sidebarRef.current, { wheelPropagation: false });
    }
  }, []);

  return (
    <div id="sidebar" className={sidebarActive ? "active" : ""}>
      <div className="sidebar-wrapper active" ref={sidebarRef}>
        <div className="sidebar-header">
          <div className="d-flex justify-content-between">
            <div className="logo">
              <Link to="/dashboard">
                <img src={logo} alt="Logo" style={{ width: "230px", height: "auto" }} />
              </Link>
            </div>
            <div className="toggler">
              <button
                className="sidebar-hide d-xl-none d-block"
                onClick={toggleSidebar}
              >
                <i className="bi bi-x bi-middle"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="sidebar-menu">
          <ul className="menu">
            <li className="sidebar-item">
              <Link to="/dashboard" className="sidebar-link">
                <i className="bi bi-grid-fill"></i>
                <span>Dashboard</span>
              </Link>
            </li>
            <li className="sidebar-item has-sub">
              <a
                href="#"
                className="sidebar-link"
                onClick={(e) => {
                  e.preventDefault();
                  toggleSubmenu(
                    "management",
                    e.currentTarget.nextElementSibling as HTMLElement
                  );
                }}
              >
                <i className="fa-solid fa-user-gear"></i>
                <span>Quản lý</span>
              </a>
              <ul
                className={`submenu ${submenuState.management ? "active" : ""}`}
                style={{ display: submenuState.management ? "block" : "none" }}
              >
                <li>
                  <Link to="/comment" className="sidebar-link">
                    <i className="fa-solid fa-comment"></i> <span>Bình luận</span>
                  </Link>
                </li>
                <li>
                  <Link to="/movie" className="sidebar-link">
                    <i className="fa-solid fa-film"></i>
                    <span>Phim</span>
                  </Link>
                </li>
                <li>
                  <Link to="/room" className="sidebar-link">
                    <i className="fa-solid fa-chalkboard-user"></i>{" "}
                    <span>Phòng Chiếu</span>
                  </Link>
                </li>
                <li>
                  <Link to="/product" className="sidebar-link">
                    <i className="fa-solid fa-bowl-food"></i>
                    <span>Đồ Ăn Vặt</span>
                  </Link>
                </li>
                <li>
                  <Link to="/order-page" className="sidebar-link">
                    <i className="fa-solid fa-file-invoice-dollar"></i>{" "}
                    <span>Hóa đơn</span>
                  </Link>
                </li>
                <li>
                  <Link to="/show-page" className="sidebar-link">
                    <i className="fa-solid fa-receipt"></i> <span>Lịch Chiếu</span>
                  </Link>
                </li>
                <li>
                  <Link to="/voucher-page" className="sidebar-link">
                    <i className="fa-solid fa-percent"></i> <span>Khuyến Mãi</span>
                  </Link>
                </li>
                {/* Other submenu items */}
              </ul>
            </li>

            <li className="sidebar-item has-sub">
              <a
                href="#"
                className="sidebar-link"
                onClick={(e) => {
                  e.preventDefault();
                  toggleSubmenu(
                    "data",
                    e.currentTarget.nextElementSibling as HTMLElement
                  );
                }}
              >
                <i className="fa-solid fa-database"></i>
                <span>Số liệu</span>
              </a>
              <ul
                className={`submenu ${submenuState.data ? "active" : ""}`}
                style={{ display: submenuState.data ? "block" : "none" }}
              >
                <li>
                  <Link to="/chart" className="sidebar-link">
                    <i className="fa-solid fa-chart-line"></i>
                    <span>Biểu Đồ</span>
                  </Link>
                </li>
                {/* Other submenu items */}
              </ul>
            </li>
            <li className="sidebar-item">
              <Link to="/report-page" className="sidebar-link">
                <i className="fa-solid fa-circle-info"></i>
                <span>Góp ý</span>
              </Link>
            </li>
          </ul>
        </div>
        <button className="sidebar-toggler btn x" onClick={toggleSidebar}>
          <i data-feather="x"></i>
        </button>
      </div>
    </div>
  );
};
export default Sidebar;
