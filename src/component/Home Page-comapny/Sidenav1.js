import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import { useRef } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Calendar from "react-calendar"; // Import the calendar component
import "react-calendar/dist/Calendar.css"; // Import the calendar styles
import HowToRegRoundedIcon from "@mui/icons-material/HowToRegRounded";

import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PaymentIcon from "@mui/icons-material/Payment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import InfoIcon from "@mui/icons-material/Info";
import HomeIcon from "@mui/icons-material/Home";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import { useState, useEffect } from "react";

import { Typography } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppStore } from "./appStore";
import { useLocation } from "react-router-dom";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import index from "../../index.css";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import SettingsIcon from "@mui/icons-material/Settings";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import GradeIcon from "@mui/icons-material/Grade";
import AccountBalanceSharpIcon from "@mui/icons-material/AccountBalanceSharp";
import AddBusinessSharpIcon from "@mui/icons-material/AddBusinessSharp";
import CreditCardOffIcon from "@mui/icons-material/CreditCardOff";
import AddTaskIcon from "@mui/icons-material/AddTask";
const drawerWidth = 230;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  backgroundColor: "#FFF",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  backgroundColor: "#FFF",
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": {
      ...openedMixin(theme),
      overflowY: "auto", // Allow scrolling when the drawer is open
    },
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": {
      ...closedMixin(theme),
      overflowY: "auto", // Allow scrolling when the drawer is closed
    },
  }),
}));

export default function Sidenav() {
  const theme = useTheme();
  const navigate = useNavigate();
  const open = useAppStore((state) => state.dopen);
  const updateOpen = useAppStore((state) => state.updateOpen);
  const [openLeave, setOpenLeave] = React.useState(false);
  const [openSalary, setOpenSalary] = React.useState(false);
  const isLoggedIn = sessionStorage.getItem("user") !== null;
  const [openAttendance, setOpenAttendance] = React.useState(false);
  const [isloggedin, setisloggedin] = useState(sessionStorage.getItem("user"));
  const [isHovered, setIsHovered] = useState(false);
  const [showCompany, setShowCompany] = useState(false);
  const [hovered, setHovered] = useState(false);
  const dropdownRef = useRef(null);
  

  const handleMastersClick = () => {
    setShowCompany(!showCompany); // Toggle visibility of "Company" dropdown
  };
  const [showCalendar, setShowCalendar] = useState(false);

  const handleMasterClick = () => {
    setShowCompany(!showCompany);
  };

  const handleAttendanceClick = () => {
    setOpenAttendance(!openAttendance);
  };

  const handleDrawerToggle = () => {
    if (location.pathname === "/Masters") {
      navigate("/"); // Navigate to the home page if already on the DBoards page
    } else {
      updateOpen(!open);
      navigate("/Masters"); // Navigate to the DBoards page when the dashboard button is clicked
    }
  };

  const handleLeaveClick = () => {
    setOpenLeave(!openLeave);
  };

  const location = useLocation();

  const handleSalaryClick = () => {
    setOpenSalary(!openSalary);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCompany(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    const masterRoutes = [
      "/CompanyMasterss1copy",
      "/BranchMaster1copy",
      "/DivisionMaster1copy",
      "/DepartmentFormMaster1copy",
      "/DesignationMasterForm1copy",
      "/GradeForm1copy",
      "/CategoryFormMaster1copy",
      "/JobStatusFormMaster1copy",
      "/LevelFormMaster1copy",
      "/PaymLeaveMaster1copy",
    ];

    if (masterRoutes.includes(location.pathname)) {
      setShowCompany(true); // keep dropdown open
    } else {
      setShowCompany(false); // close dropdown
    }
  }, [location.pathname]);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <CssBaseline />

      <Drawer
        variant="permanent"
        open={open || isHovered} // Open if either the drawer is open or hovered
        onMouseEnter={() => setIsHovered(true)} // Set hover state to true
        onMouseLeave={() => setIsHovered(false)} // Set hover state to falsea
        sx={{ display: { xs: "none", sm: "block" } }}
      >
        {/* Permanent Drawer for Large Screens */}
        <Drawer
          variant="permanent"
          open={open}
          sx={{ display: { xs: "none", sm: "block" } }}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerToggle}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {/* <ListItem disablePadding sx={{ display: "block" }}>
            <Box sx={{ display: "flex", alignItems: "center", marginLeft: 2 }}>
              <Avatar>{sessionStorage.getItem("user").charAt(0)}</Avatar>
              <Typography color={"white"} sx={{ margin: 2 }}>
                {sessionStorage.getItem("user")}
              </Typography>
            </Box>
          </ListItem> */}

            {/* 
          <ListItem disablePadding sx={{ display: "block" }} onClick={() => navigate("/Attendancewise1")}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                transition: "transform 0.4s ease-in-out",
                "&:hover": {
                  backgroundColor: "#7f7f7f",
                  transform: "scale(1.10)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: "white",
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <AccessTimeIcon />
              </ListItemIcon>
              <ListItemText primary="Attendance" sx={{ opacity: open ? 1 : 0, color: "white" }} />
              {open && (
                <Collapse in={openAttendance} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                   
                  </List>
                </Collapse>
              )}
            </ListItemButton>
          </ListItem> */}

            <ListItem disablePadding sx={{ display: "block" }}>
              <NavLink
                to="/HomePage1"
                className={({ isActive, isPending }) =>
                  isPending ? "pending" : isActive ? "active" : ""
                }
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  backgroundColor: isActive ? "#d0f0c0" : "transparent",
                  padding: "8px 20px",
                  color: "black", // Default text color
                  transition: "color 0.3s ease", // Smooth transition for color change
                })}
                onMouseEnter={(e) => {
                  const target = e.currentTarget;
                  target.style.color = "#0077d4"; // Change text color on hover
                  const icon = target.querySelector("svg");
                  const textDiv = target.querySelector("div");

                  if (icon) icon.style.color = "#0077d4"; // Change icon color on hover
                  if (textDiv) textDiv.style.color = "#0077d4"; // Change text color on hover
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget;
                  target.style.color = "black"; // Revert text color
                  const icon = target.querySelector("svg");
                  const textDiv = target.querySelector("div");

                  if (icon) icon.style.color = "black"; // Revert icon color
                  if (textDiv) textDiv.style.color = "black"; // Revert text color
                }}
              >
                <HomeIcon
                  style={{
                    color: "black",
                    marginRight: "20px",
                    transition: "color 0.3s ease",
                  }}
                />
                <div style={{ color: "black", marginRight: "auto" }}>Home</div>
              </NavLink>
            </ListItem>

            <ListItem disablePadding sx={{ display: "block" }}>
              <div
                onClick={handleMasterClick}
                style={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  backgroundColor: showCompany ? "white" : "transparent",
                  padding: "8px 20px",
                  color: "black",
                  cursor: "pointer",
                  transition: "background 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#0077d4";
                  e.currentTarget.style.backgroundColor = "white"; // Light grey on hover
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = showCompany
                    ? "#0077d4"
                    : "black"; // Restore text color based on showCompany
                  e.currentTarget.style.backgroundColor = "transparent"; // Always revert background to transparent on mouse leave
                }}
                aria-expanded={showCompany}
                aria-haspopup="menu"
                aria-controls="master-dropdown-menu"
              >
                <HowToRegRoundedIcon
                  style={{ color: "black", marginRight: "20px" }}
                />
                <div style={{ color: "black", marginRight: "auto" }}>
                  Masters
                </div>
                {showCompany ? (
                  <ExpandLessIcon
                    style={{ color: "black", marginLeft: "10px" }}
                  />
                ) : (
                  <ExpandMoreIcon
                    style={{ color: "black", marginLeft: "10px" }}
                  />
                )}
              </div>

              {showCompany && (
                <div
                  id="master-dropdown-menu"
                  aria-label="Master submenu"
                  role="menu"
                  style={{ paddingLeft: 48, paddingTop: 8, paddingBottom: 16 }}
                >
                  <NavLink
                    to="/CompanyMasterss1copy"
                    style={({ isActive }) => ({
                      display: "block",
                      textDecoration: "none",
                      color: isActive ? "#0077d4" : "#111827",
                      backgroundColor: isActive ? "#e3f2fd" : "transparent",
                      padding: "10px 20px",
                      fontSize: "1rem",
                      marginTop: -20,
                      transition: "background-color 0.3s ease, color 0.3s ease",
                      userSelect: "none",
                    })}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#0077d4")
                    }
                    onMouseLeave={(e) => {
                      const navStyle = e.currentTarget.style;
                      if (!e.currentTarget.classList.contains("active")) {
                        navStyle.color = "#111827";
                      }
                    }}
                    role="menuitem"
                  >
                    Company
                  </NavLink>
                  <NavLink
                    to="/BranchMaster1copy"
                    style={({ isActive }) => ({
                      textDecoration: "none",
                      color: isActive ? "#1976d2" : "#111827",
                      backgroundColor: isActive ? "#e3f2fd" : "transparent",
                      padding: "10px 20px",

                      fontSize: "1rem",

                      display: "block", // Ensure it takes the full width
                      marginTop: "-10px",
                      transition: "background-color 0.2s ease, color 0.2s ease",
                    })}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#0077d4";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "black";
                    }}
                  >
                    Branch
                  </NavLink>
                  <NavLink
                    to="/DivisionMaster1copy"
                    style={({ isActive }) => ({
                      textDecoration: "none",
                      color: isActive ? "#1976d2" : "#111827",
                      backgroundColor: isActive ? "#e3f2fd" : "transparent",
                      padding: "10px 20px",

                      fontSize: "1rem",

                      display: "block", // Ensure it takes the full width
                      marginTop: "-10px",
                      transition: "background-color 0.2s ease, color 0.2s ease",
                    })}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#0077d4";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "black";
                    }}
                  >
                    Division
                  </NavLink>
                  <NavLink
                    to="/DepartmentFormMaster1copy"
                    style={({ isActive }) => ({
                      textDecoration: "none",
                      color: isActive ? "#1976d2" : "#111827",
                      backgroundColor: isActive ? "#e3f2fd" : "transparent",
                      padding: "10px 20px",

                      fontSize: "1rem",

                      display: "block", // Ensure it takes the full width
                      marginTop: "-10px",
                      transition: "background-color 0.2s ease, color 0.2s ease",
                    })}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#0077d4";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "black";
                    }}
                  >
                    Department
                  </NavLink>
                  <NavLink
                    to="/DesignationMasterForm1copy"
                    style={({ isActive }) => ({
                      textDecoration: "none",
                      color: isActive ? "#1976d2" : "#111827",
                      backgroundColor: isActive ? "#e3f2fd" : "transparent",
                      padding: "10px 20px",

                      fontSize: "1rem",

                      display: "block", // Ensure it takes the full width
                      marginTop: "-10px",
                      transition: "background-color 0.2s ease, color 0.2s ease",
                    })}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#0077d4";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "black";
                    }}
                  >
                    Designation
                  </NavLink>
                  <NavLink
                    to="/GradeForm1copy"
                    style={({ isActive }) => ({
                      textDecoration: "none",
                      color: isActive ? "#1976d2" : "#111827",
                      backgroundColor: isActive ? "#e3f2fd" : "transparent",
                      padding: "10px 20px",

                      fontSize: "1rem",

                      display: "block", // Ensure it takes the full width
                      marginTop: "-10px",
                      transition: "background-color 0.2s ease, color 0.2s ease",
                    })}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#0077d4";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "black";
                    }}
                  >
                    Grade
                  </NavLink>

                  <NavLink
                    to="/CategoryFormMaster1copy"
                    style={({ isActive }) => ({
                      textDecoration: "none",

                      color: isActive ? "#1976d2" : "#111827",
                      backgroundColor: isActive ? "#e3f2fd" : "transparent",
                      padding: "10px 20px",

                      fontSize: "1rem",

                      display: "block", // Ensure it takes the full width
                      marginTop: "-5px",
                      transition: "background-color 0.2s ease, color 0.2s ease",
                    })}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#0077d4";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "black";
                    }}
                  >
                    Category
                  </NavLink>
                  <NavLink
                    to="/JobStatusFormMaster1copy"
                    style={({ isActive }) => ({
                      textDecoration: "none",
                      color: isActive ? "#1976d2" : "#111827",
                      backgroundColor: isActive ? "#e3f2fd" : "transparent",
                      padding: "10px 20px",

                      fontSize: "1rem",

                      display: "block", // Ensure it takes the full width
                      marginTop: "-10px",
                      transition: "background-color 0.2s ease, color 0.2s ease",
                    })}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#0077d4";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "black";
                    }}
                  >
                    Job Status
                  </NavLink>
                  <NavLink
                    to="/LevelFormMaster1copy"
                    style={({ isActive }) => ({
                      textDecoration: "none",
                      color: isActive ? "#1976d2" : "#111827",
                      backgroundColor: isActive ? "#e3f2fd" : "transparent",
                      padding: "10px 20px",

                      fontSize: "1rem",

                      display: "block", // Ensure it takes the full width
                      marginTop: "-10px",
                      transition: "background-color 0.2s ease, color 0.2s ease",
                    })}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#0077d4";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "black";
                    }}
                  >
                    Level
                  </NavLink>
                  <NavLink
                    to="/PaymLeaveMaster1copy"
                    style={({ isActive }) => ({
                      textDecoration: "none",
                      color: isActive ? "#1976d2" : "#111827",
                      backgroundColor: isActive ? "#e3f2fd" : "transparent",
                      padding: "10px 20px",

                      fontSize: "1rem",

                      display: "block", // Ensure it takes the full width
                      marginTop: "-10px",
                      transition: "background-color 0.2s ease, color 0.2s ease",
                    })}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#0077d4";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "black";
                    }}
                  >
                    Leave
                  </NavLink>
                  {/* <NavLink
            to="/EarnDeductCompanyMasters"
            style={({ isActive }) => ({
              textDecoration: "none",
              color: isActive ? "#1976d2" : "#111827",
              backgroundColor: isActive ? "#e3f2fd" : "transparent",
              padding: "10px 20px",
             
              fontSize: "1rem",
              
             display: "block", // Ensure it takes the full width
        marginTop: "-10px",
              transition: "background-color 0.2s ease, color 0.2s ease",
            })}
             onMouseEnter={(e) => {
              e.currentTarget.style.color = "#0077d4";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "black";
            }}
          >
            Earn Deduct
          </NavLink> */}
                </div>
              )}
            </ListItem>

            {/* 
            <ListItem disablePadding sx={{ display: "block" }}>
              <NavLink
                to="/EmployeeHomeH1"
                className={({ isActive, isPending }) =>
                  isPending ? "pending" : isActive ? "active" : ""
                }
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  backgroundColor: isActive ? "#d0f0c0" : "transparent",
                  // borderLeft: isActive ? "4px solid #90ee90" : "none",
                  padding: "8px 20px",
                  color: "black", // Default text color
                  transition: "color 0.3s ease", // Smooth transition for color change
                })}
                onMouseEnter={(e) => {
                  const target = e.currentTarget;
                  target.style.color = "#0077d4"; // Change text color on hover
                  const icon = target.querySelector('svg');
                  const textDiv = target.querySelector('div');
            
                  if (icon) icon.style.color = "#0077d4"; // Change icon color on hover
                  if (textDiv) textDiv.style.color = "#0077d4"; // Change text color on hover
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget;
                  target.style.color = "black"; // Revert text color
                  const icon = target.querySelector('svg');
                  const textDiv = target.querySelector('div');
            
                  if (icon) icon.style.color = "black"; // Revert icon color
                  if (textDiv) textDiv.style.color = "black"; // Revert text color
                }}
                
              >
                < PersonAddAlt1Icon 
                  style={{
                    color: "black",
                    marginRight: "20px",
                    transition: "color 0.3s ease",
                  }}
                />
                <div style={{ color: "black", marginRight: "auto" }}>Employee Master</div>

              </NavLink>
            </ListItem> */}
            <ListItem disablePadding sx={{ display: "block" }}>
              <NavLink
                to="/GradeSlabcopy"
                className={({ isActive, isPending }) =>
                  isPending ? "pending" : isActive ? "active" : ""
                }
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  backgroundColor: isActive ? "#d0f0c0" : "transparent",
                  // borderLeft: isActive ? "4px solid #90ee90" : "none",
                  padding: "8px 20px",
                  color: "black", // Default text color
                  transition: "color 0.3s ease", // Smooth transition for color change
                })}
                onMouseEnter={(e) => {
                  const target = e.currentTarget;
                  target.style.color = "#0077d4"; // Change text color on hover
                  const icon = target.querySelector("svg");
                  const textDiv = target.querySelector("div");

                  if (icon) icon.style.color = "#0077d4"; // Change icon color on hover
                  if (textDiv) textDiv.style.color = "#0077d4"; // Change text color on hover
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget;
                  target.style.color = "black"; // Revert text color
                  const icon = target.querySelector("svg");
                  const textDiv = target.querySelector("div");

                  if (icon) icon.style.color = "black"; // Revert icon color
                  if (textDiv) textDiv.style.color = "black"; // Revert text color
                }}
              >
                <GradeIcon
                  className="myDIV"
                  style={{
                    color: "black",
                    marginRight: "20px",
                    transition: "color 0.3s ease",
                  }}
                />
                <div style={{ color: "black", marginRight: "auto" }}>
                  {" "}
                  Grade Slab
                </div>
              </NavLink>
            </ListItem>

            <ListItem disablePadding sx={{ display: "block" }}>
              <NavLink
                to="/CTCSlabTablecopy"
                className={({ isActive, isPending }) =>
                  isPending ? "pending" : isActive ? "active" : ""
                }
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  backgroundColor: isActive ? "#d0f0c0" : "transparent",
                  // borderLeft: isActive ? "4px solid #90ee90" : "none",
                  padding: "8px 20px",
                  color: "black", // Default text color
                  transition: "color 0.3s ease", // Smooth transition for color change
                })}
                onMouseEnter={(e) => {
                  const target = e.currentTarget;
                  target.style.color = "#0077d4"; // Change text color on hover
                  const icon = target.querySelector("svg");
                  const textDiv = target.querySelector("div");

                  if (icon) icon.style.color = "#0077d4"; // Change icon color on hover
                  if (textDiv) textDiv.style.color = "#0077d4"; // Change text color on hover
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget;
                  target.style.color = "black"; // Revert text color
                  const icon = target.querySelector("svg");
                  const textDiv = target.querySelector("div");

                  if (icon) icon.style.color = "black"; // Revert icon color
                  if (textDiv) textDiv.style.color = "black"; // Revert text color
                }}
              >
                <AccountBalanceSharpIcon
                  className="myDIV"
                  style={{
                    color: "black",
                    marginRight: "20px",
                    transition: "color 0.3s ease",
                  }}
                />
                <div style={{ color: "black", marginRight: "auto" }}>
                  {" "}
                  Loan Slab
                </div>
              </NavLink>
            </ListItem>

            <ListItem disablePadding sx={{ display: "block" }}>
              <NavLink
                to="/LoanMaster"
                className={({ isActive, isPending }) =>
                  isPending ? "pending" : isActive ? "active" : ""
                }
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  backgroundColor: isActive ? "#d0f0c0" : "transparent",
                  // borderLeft: isActive ? "4px solid #90ee90" : "none",
                  padding: "8px 20px",
                  color: "black", // Default text color
                  transition: "color 0.3s ease", // Smooth transition for color change
                })}
                onMouseEnter={(e) => {
                  const target = e.currentTarget;
                  target.style.color = "#0077d4"; // Change text color on hover
                  const icon = target.querySelector("svg");
                  const textDiv = target.querySelector("div");

                  if (icon) icon.style.color = "#0077d4"; // Change icon color on hover
                  if (textDiv) textDiv.style.color = "#0077d4"; // Change text color on hover
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget;
                  target.style.color = "black"; // Revert text color
                  const icon = target.querySelector("svg");
                  const textDiv = target.querySelector("div");

                  if (icon) icon.style.color = "black"; // Revert icon color
                  if (textDiv) textDiv.style.color = "black"; // Revert text color
                }}
              >
                <CreditScoreIcon
                  className="myDIV"
                  style={{
                    color: "black",
                    marginRight: "20px",
                    transition: "color 0.3s ease",
                  }}
                />
                <div style={{ color: "black", marginRight: "auto" }}>
                  {" "}
                  Loan Master
                </div>
              </NavLink>
            </ListItem>

            <ListItem disablePadding sx={{ display: "block" }}>
              <NavLink
                to="/AllowanceMaster"
                className={({ isActive, isPending }) =>
                  isPending ? "pending" : isActive ? "active" : ""
                }
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  backgroundColor: isActive ? "#d0f0c0" : "transparent",
                  // borderLeft: isActive ? "4px solid #90ee90" : "none",
                  padding: "8px 20px",
                  color: "black", // Default text color
                  transition: "color 0.3s ease", // Smooth transition for color change
                })}
                onMouseEnter={(e) => {
                  const target = e.currentTarget;
                  target.style.color = "#0077d4"; // Change text color on hover
                  const icon = target.querySelector("svg");
                  const textDiv = target.querySelector("div");

                  if (icon) icon.style.color = "#0077d4"; // Change icon color on hover
                  if (textDiv) textDiv.style.color = "#0077d4"; // Change text color on hover
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget;
                  target.style.color = "black"; // Revert text color
                  const icon = target.querySelector("svg");
                  const textDiv = target.querySelector("div");

                  if (icon) icon.style.color = "black"; // Revert icon color
                  if (textDiv) textDiv.style.color = "black"; // Revert text color
                }}
              >
                <AddTaskIcon
                  className="myDIV"
                  style={{
                    color: "black",
                    marginRight: "20px",
                    transition: "color 0.3s ease",
                  }}
                />
                <div style={{ color: "black", marginRight: "auto" }}>
                  {" "}
                  Allowance Master
                </div>
              </NavLink>
            </ListItem>

            <ListItem disablePadding sx={{ display: "block" }}>
              <NavLink
                to="/AllowanceValues"
                className={({ isActive, isPending }) =>
                  isPending ? "pending" : isActive ? "active" : ""
                }
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  backgroundColor: isActive ? "#d0f0c0" : "transparent",
                  // borderLeft: isActive ? "4px solid #90ee90" : "none",
                  padding: "8px 20px",
                  color: "black", // Default text color
                  transition: "color 0.3s ease", // Smooth transition for color change
                })}
                onMouseEnter={(e) => {
                  const target = e.currentTarget;
                  target.style.color = "#0077d4"; // Change text color on hover
                  const icon = target.querySelector("svg");
                  const textDiv = target.querySelector("div");

                  if (icon) icon.style.color = "#0077d4"; // Change icon color on hover
                  if (textDiv) textDiv.style.color = "#0077d4"; // Change text color on hover
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget;
                  target.style.color = "black"; // Revert text color
                  const icon = target.querySelector("svg");
                  const textDiv = target.querySelector("div");

                  if (icon) icon.style.color = "black"; // Revert icon color
                  if (textDiv) textDiv.style.color = "black"; // Revert text color
                }}
              >
                <AddBusinessSharpIcon
                  className="myDIV"
                  style={{
                    color: "black",
                    marginRight: "20px",
                    transition: "color 0.3s ease",
                  }}
                />
                <div style={{ color: "black", marginRight: "auto" }}>
                  {" "}
                  Allowance Values
                </div>
              </NavLink>
            </ListItem>

            <ListItem disablePadding sx={{ display: "block" }}>
              <NavLink
                to="/DeductionMaster"
                className={({ isActive, isPending }) =>
                  isPending ? "pending" : isActive ? "active" : ""
                }
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  backgroundColor: isActive ? "#d0f0c0" : "transparent",
                  // borderLeft: isActive ? "4px solid #90ee90" : "none",
                  padding: "8px 20px",
                  color: "black", // Default text color
                  transition: "color 0.3s ease", // Smooth transition for color change
                })}
                onMouseEnter={(e) => {
                  const target = e.currentTarget;
                  target.style.color = "#0077d4"; // Change text color on hover
                  const icon = target.querySelector("svg");
                  const textDiv = target.querySelector("div");

                  if (icon) icon.style.color = "#0077d4"; // Change icon color on hover
                  if (textDiv) textDiv.style.color = "#0077d4"; // Change text color on hover
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget;
                  target.style.color = "black"; // Revert text color
                  const icon = target.querySelector("svg");
                  const textDiv = target.querySelector("div");

                  if (icon) icon.style.color = "black"; // Revert icon color
                  if (textDiv) textDiv.style.color = "black"; // Revert text color
                }}
              >
                <CreditCardOffIcon
                  className="myDIV"
                  style={{
                    color: "black",
                    marginRight: "20px",
                    transition: "color 0.3s ease",
                  }}
                />
                <div style={{ color: "black", marginRight: "auto" }}>
                  {" "}
                  Deduction Master
                </div>
              </NavLink>
            </ListItem>
            <ListItem disablePadding sx={{ display: "block" }}>
              <NavLink
                to="/PFvalues"
                className={({ isActive, isPending }) =>
                  isPending ? "pending" : isActive ? "active" : ""
                }
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  backgroundColor: isActive ? "#d0f0c0" : "transparent",
                  // borderLeft: isActive ? "4px solid #90ee90" : "none",
                  padding: "8px 20px",
                  color: "black", // Default text color
                  transition: "color 0.3s ease", // Smooth transition for color change
                })}
                onMouseEnter={(e) => {
                  const target = e.currentTarget;
                  target.style.color = "#0077d4"; // Change text color on hover
                  const icon = target.querySelector("svg");
                  const textDiv = target.querySelector("div");

                  if (icon) icon.style.color = "#0077d4"; // Change icon color on hover
                  if (textDiv) textDiv.style.color = "#0077d4"; // Change text color on hover
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget;
                  target.style.color = "black"; // Revert text color
                  const icon = target.querySelector("svg");
                  const textDiv = target.querySelector("div");

                  if (icon) icon.style.color = "black"; // Revert icon color
                  if (textDiv) textDiv.style.color = "black"; // Revert text color
                }}
              >
                <SettingsIcon
                  className="myDIV"
                  style={{
                    color: "black",
                    marginRight: "20px",
                    transition: "color 0.3s ease",
                  }}
                />
                <div style={{ color: "black", marginRight: "auto" }}>
                  {" "}
                  PF Settings
                </div>
              </NavLink>
            </ListItem>

            <ListItem disablePadding sx={{ display: "block" }}>
              <NavLink
                to="/ESIsettings"
                className={({ isActive, isPending }) =>
                  isPending ? "pending" : isActive ? "active" : ""
                }
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  backgroundColor: isActive ? "#d0f0c0" : "transparent",
                  // borderLeft: isActive ? "4px solid #90ee90" : "none",
                  padding: "8px 20px",
                  color: "black", // Default text color
                  transition: "color 0.3s ease", // Smooth transition for color change
                })}
                onMouseEnter={(e) => {
                  const target = e.currentTarget;
                  target.style.color = "#0077d4"; // Change text color on hover
                  const icon = target.querySelector("svg");
                  const textDiv = target.querySelector("div");

                  if (icon) icon.style.color = "#0077d4"; // Change icon color on hover
                  if (textDiv) textDiv.style.color = "#0077d4"; // Change text color on hover
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget;
                  target.style.color = "black"; // Revert text color
                  const icon = target.querySelector("svg");
                  const textDiv = target.querySelector("div");

                  if (icon) icon.style.color = "black"; // Revert icon color
                  if (textDiv) textDiv.style.color = "black"; // Revert text color
                }}
              >
                <SettingsSuggestIcon
                  className="myDIV"
                  style={{
                    color: "black",
                    marginRight: "20px",
                    transition: "color 0.3s ease",
                  }}
                />
                <div style={{ color: "black", marginRight: "auto" }}>
                  {" "}
                  ESI Settings
                </div>
              </NavLink>
            </ListItem>

            <ListItem disablePadding sx={{ display: "block" }}>
              <NavLink
                to="/AllowanceSettings"
                className={({ isActive, isPending }) =>
                  isPending ? "pending" : isActive ? "active" : ""
                }
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  backgroundColor: isActive ? "#d0f0c0" : "transparent",
                  // borderLeft: isActive ? "4px solid #90ee90" : "none",
                  padding: "8px 20px",
                  color: "black", // Default text color
                  transition: "color 0.3s ease", // Smooth transition for color change
                })}
                onMouseEnter={(e) => {
                  const target = e.currentTarget;
                  target.style.color = "#0077d4"; // Change text color on hover
                  const icon = target.querySelector("svg");
                  const textDiv = target.querySelector("div");

                  if (icon) icon.style.color = "#0077d4"; // Change icon color on hover
                  if (textDiv) textDiv.style.color = "#0077d4"; // Change text color on hover
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget;
                  target.style.color = "black"; // Revert text color
                  const icon = target.querySelector("svg");
                  const textDiv = target.querySelector("div");

                  if (icon) icon.style.color = "black"; // Revert icon color
                  if (textDiv) textDiv.style.color = "black"; // Revert text color
                }}
              >
                <SettingsApplicationsIcon
                  className="myDIV"
                  style={{
                    color: "black",
                    marginRight: "20px",
                    transition: "color 0.3s ease",
                  }}
                />
                <div style={{ color: "black", marginRight: "auto" }}>
                  {" "}
                  Allowance Settings
                </div>
              </NavLink>
            </ListItem>
            <ListItem disablePadding sx={{ display: "block" }}>
              <NavLink
                to="/AssetGridFormcopy"
                className={({ isActive, isPending }) =>
                  isPending ? "pending" : isActive ? "active" : ""
                }
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  backgroundColor: isActive ? "#d0f0c0" : "transparent",
                  // borderLeft: isActive ? "4px solid #90ee90" : "none",
                  padding: "8px 20px",
                  color: "black", // Default text color
                  transition: "color 0.3s ease", // Smooth transition for color change
                })}
                onMouseEnter={(e) => {
                  const target = e.currentTarget;
                  target.style.color = "#0077d4"; // Change text color on hover
                  const icon = target.querySelector("svg");
                  const textDiv = target.querySelector("div");

                  if (icon) icon.style.color = "#0077d4"; // Change icon color on hover
                  if (textDiv) textDiv.style.color = "#0077d4"; // Change text color on hover
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget;
                  target.style.color = "black"; // Revert text color
                  const icon = target.querySelector("svg");
                  const textDiv = target.querySelector("div");

                  if (icon) icon.style.color = "black"; // Revert icon color
                  if (textDiv) textDiv.style.color = "black"; // Revert text color
                }}
              >
                <SettingsApplicationsIcon
                  className="myDIV"
                  style={{
                    color: "black",
                    marginRight: "20px",
                    transition: "color 0.3s ease",
                  }}
                />
                <div style={{ color: "black", marginRight: "auto" }}>
                  {" "}
                  Assets
                </div>
              </NavLink>
            </ListItem>
          </List>
        </Drawer>

        {/* Temporary Drawer for Small Screens */}
        <Drawer
          variant="temporary"
          open={open}
          onClose={handleDrawerToggle}
          sx={{ display: { xs: "block", sm: "none" } }}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerToggle}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>{/* Same list items as in the permanent drawer */}</List>
        </Drawer>
      </Drawer>
    </Box>
  );
}
