import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import Stack from "@mui/material/Stack"; // Adjust the import path based on your library
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Calendar from "react-calendar";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import { useAppStore } from "./appStore";
import Avatar from "@mui/material/Avatar";
import { useState } from "react";
import { useEffect } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { navigate, useNavigate } from "react-router-dom";
import settingss from "../../images/Settingss-icon.png";
import "react-calendar/dist/Calendar.css";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { ServerConfig } from "../../serverconfiguration/serverconfig";
import { REPORTS } from "../../serverconfiguration/controllers";
import { postRequest, getRequest } from "../../serverconfiguration/requestcomp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import { Divider } from "@mui/material";

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: "#fff",
  borderRadius: "5px", // Black color for the AppBar
  boxShadow: "#ffffff",
}));

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function Navbar() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const updateOpen = useAppStore((state) => state.updateOpen);
  const dopen = useAppStore((state) => state.dopen);
  const isLoggedIn = sessionStorage.getItem("user") !== null;
  const [employeeFirstName, setEmployeeFirstName] = useState("");
  const [employeeImage, setEmployeeImage] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [showCalendar, setShowCalendar] = useState(false);
  const [birthdayMessage, setBirthdayMessage] = useState("");
  const [birthdayGreeting, setBirthdayGreeting] = useState("");
  const dbname = sessionStorage.getItem("databaseName");

  const handleSidenavToggle = () => {
    updateOpen(!dopen); // Toggle the sidenav state
  };

  //bday wish
  const [bdayanchorEl, setBdayAnchorEl] = useState(null);
  const open = Boolean(bdayanchorEl);

  const handleClickBday = (event) => {
    setBdayAnchorEl(event.currentTarget);
  };
  const handleCloseBday = () => {
    setBdayAnchorEl(null);
  };

  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    let storedStart = sessionStorage.getItem("startTime");

    if (!storedStart) {
      const now = Date.now();
      sessionStorage.setItem("startTime", now.toString());
      storedStart = now;
    }

    const start = Number(storedStart);
    setStartTime(start);
    setElapsedTime(Date.now() - start);

    const interval = setInterval(() => {
      setElapsedTime(Date.now() - start);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  useEffect(() => {
    async function getData() {
      try {
        const empCode = sessionStorage.getItem("user");
        if (empCode) {
          // Fetch employee data from paym_Employee
          const employeeData = await postRequest(ServerConfig.url, REPORTS, {
            query: `SELECT * FROM [${dbname}].[dbo].[paym_Employee] WHERE EmployeeCode = '${empCode}'`,
          });
          if (employeeData.data && employeeData.data.length > 0) {
            const fullName = employeeData.data[0].Employee_Full_Name;
            const firstName = fullName.split(" ")[0];
            setEmployeeFirstName(firstName);

            if (employeeData.data && employeeData.data.length > 0) {
              const employeeID = employeeData.data[0].pn_EmployeeID;

              // Fetch image data from paym_employee_Profile1
              const employeeProfileData = await postRequest(
                ServerConfig.url,
                REPORTS,
                {
                  query: `SELECT * FROM [${dbname}].[dbo].[paym_employee_Profile1] WHERE pn_EmployeeID = '${employeeID}'`,
                }
              );

              if (
                employeeProfileData.data &&
                employeeProfileData.data.length > 0
              ) {
                const imageData = employeeProfileData.data[0].image_data;

                if (imageData) {
                  // Prepend the MIME type to the base64 string
                  const base64Image = `data:image/jpeg;base64,${imageData}`;

                  // Set the image for Avatar
                  setEmployeeImage(base64Image);
                } else {
                  console.log(
                    "Image data is null or undefined for Employee ID:",
                    employeeID
                  );
                }
              } else {
                console.log(
                  "No matching profile data found for Employee ID:",
                  employeeID
                );
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    }

    getData();
  }, []);

  const bdaylistv = [
    { name: "Ramki", message: "🎉 Today is Ramki's birthday! 🎂" },
    { name: "Priya", message: "🎉 Today is Priya's birthday! 🎂" },
    { name: "John", message: "🎉 Today is John's birthday! 🎂" },
    { name: "Sneha", message: "🎉 Today is Sneha's birthday! 🎂" },
  ];

  useEffect(() => {
    const fetchBirthdayGreeting = async () => {
      const username = sessionStorage.getItem("user");
      const password = sessionStorage.getItem("password");

      if (!username || !password) return;

      try {
        // const response = await fetch(
        //   `${ServerConfig.url}/EmployeeGreeting/BirthdayGreetingForEmployee?username=${username}&password=${password}`
        // );
        const response = await fetch(
          `${ServerConfig.url}/EmployeeGreeting/BirthdayGreetingForEmployee?username=${username}&password=${password}`,
          {
            headers: {
              dbname: dbname,
            },
          }
        );

        const data = await response.json();
        console.log("Greeting API Response:", data); // ✅ debug log

        if (response.ok && data.Message) {
          setBirthdayGreeting(data.Message); // 👈 Store the message
          console.log(data);
        } else {
          setBirthdayGreeting(""); // clear if no birthday
        }
      } catch (error) {
        console.error("Failed to fetch birthday greeting:", error);
      }
    };

    fetchBirthdayGreeting();
  }, []);

  const handleLogout = () => {
    // Clear sessionStorage
    sessionStorage.clear();
    // Navigate to login page or any other page you desire
    window.location.href = "http://localhost:3000/";
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCalendarToggle = () => {
    setShowCalendar((prev) => !prev);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  if (!isLoggedIn) {
    // If not logged in, redirect to login page
    return <navigate to="/" />;
  }

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
      <MenuItem onClick={handleLogout}>Log out</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            //  color="inherit"
            color="black"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={() => updateOpen(!dopen)}
          >
            <MenuIcon />
          </IconButton>
          <Stack direction="column" spacing={1} sx={{ marginLeft: "140px" }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block", color: "black" } }}
            >
              HR MANAGEMENT SYSTEM
            </Typography>
            <Typography
              sx={{ fontWeight: "normal", color: "black", textAlign: "center" }}
            >
              {formatTime(elapsedTime)}
            </Typography>
          </Stack>
          <Box sx={{ flexGrow: 1 }} />
          <Box
            sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center" }}
          >
            {/* <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search> */}
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              ml: 8,
              position: "relative",
            }}
          >
            <IconButton
              size="large"
              aria-label="show calendar"
              color="black"
              onClick={handleCalendarToggle}
            >
              <CalendarTodayIcon />
            </IconButton>

            {showCalendar && (
              <Box
                sx={{
                  position: "absolute",
                  top: "50px", // down
                  left: "-180px", // shift slightly to the left
                  zIndex: 1000,
                  backgroundColor: "#f2eded",
                  p: 1,
                  borderRadius: 1,
                  boxShadow: 3,
                }}
              >
                <Calendar />
              </Box>
            )}

            {/* <IconButton size="large" color="black">
  <Badge badgeContent={2} color="error">
    <NotificationsIcon />
  </Badge>
</IconButton> */}

            {/* {birthdayGreeting && (
  <Typography sx={{ color: 'green', ml: 1, fontSize: 14 }}>
    {birthdayGreeting}
  </Typography>
)} */}

            <Box sx={{ ml: -2 }}>
              {/* 🔔 Notification Icon */}
              <IconButton size="large" color="black" onClick={handleClickBday}>
                <Badge badgeContent={bdaylistv.length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              {/* 📋 Birthday Dropdown Menu */}
              <Menu
                bdayanchorEl={bdayanchorEl}
                open={open}
                onClose={handleCloseBday}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                PaperProps={{
                  style: {
                    width: "350px",
                    borderRadius: "10px",
                  },
                }}
              >
                {bdaylistv.length === 0 ? (
                  <MenuItem disabled>No birthdays today</MenuItem>
                ) : (
                  bdaylistv.map((item, index) => (
                    <Box key={index}>
                      <MenuItem>
                        <Typography variant="body2" sx={{ flexGrow: 1 }}>
                          🎉 {item.message}
                        </Typography>
                      </MenuItem>
                      {index < bdaylistv.length - 1 && (
                        <Divider sx={{ marginY: "4px", marginX: "8px" }} />
                      )}
                    </Box>
                  ))
                )}
              </Menu>
            </Box>

            {/* <IconButton
              size="large"
              edge="end"
              
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
             // color="inherit"
             color='black'

            >
              <img src={settingss} width={25} height={25} color='black' sizes=''/>
            </IconButton> */}
            <Avatar
              src={employeeImage || undefined}
              alt="Employee Image"
              style={{ marginLeft: 3 }}
            />
            <Typography
              style={{ color: "black", marginLeft: 8, cursor: "pointer" }}
            >
              Hi, {employeeFirstName}
            </Typography>
            <IconButton onClick={handleProfileMenuOpen}>
              <ArrowDropDownIcon />
            </IconButton>

            {/* <IconButton
            color="black"
            aria-label="Log out"
            onClick={handleLogout}>
            <LogoutIcon />
          </IconButton> */}
          </Box>
          <Box
            sx={{ display: { xs: "flex", md: "none" }, alignItems: "center" }}
          >
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              // color="inherit"
              color="black"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
