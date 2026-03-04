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
import ListItemButton from "@mui/material/ListItemButton";
import { NavLink } from "react-router-dom";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from '@mui/icons-material/Dashboard';
import PaymentIcon from '@mui/icons-material/Payment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import InfoIcon from '@mui/icons-material/Info';
import HomeIcon from '@mui/icons-material/Home';
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "./appStore";
import { useLocation } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import React, { useState, useEffect } from 'react';
import TodayIcon from "@mui/icons-material/Today";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import SettingsIcon from '@mui/icons-material/Settings';
import ReceiptIcon from "@mui/icons-material/Receipt";

const drawerWidth = 230;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  backgroundColor: "white",
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
  backgroundColor: "white",
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
  const [isHovered, setIsHovered] = useState(false);
  const isLoggedIn = sessionStorage.getItem("user") !== null;
  const [openAttendance, setOpenAttendance] = React.useState(false);
  const [isloggedin, setisloggedin] = useState(sessionStorage.getItem("user"))
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

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
       <Drawer
        variant="permanent"
        open={open || isHovered} // Open if either the drawer is open or hovered
        onMouseEnter={() => setIsHovered(true)} // Set hover state to true
        onMouseLeave={() => setIsHovered(false)} // Set hover state to false
        sx={{ display: { xs: 'none', sm: 'block' } }}
      >

      {/* Permanent Drawer for Large Screens */}
      <Drawer variant="permanent" open={open} sx={{ display: { xs: 'none', sm: 'block' } }}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerToggle}>
            {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
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

        <ListItem disablePadding sx={{ display: "block" }}>
  <NavLink
    to="/EmployeeDashBoard2"
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
    <DashboardIcon 
      style={{
        color: "black",
        marginRight: "20px",
        transition: "color 0.3s ease",
      }}
    />
    <div style={{ color: "black", marginRight: "auto" }}>Dashboard</div>
  </NavLink>
</ListItem>
  
    <ListItem disablePadding sx={{ display: "block" }}>
      <NavLink
        to="/BasicDateCalendar2"
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
          const icon = target.querySelector('svg');
          const text = target.querySelector('.MuiListItemText-primary');
          if (icon) icon.style.color = "#0077d4";
          if (text) text.style.color = "#0077d4";
        }}
        onMouseLeave={(e) => {
          const target = e.currentTarget;
          target.style.color = "black"; // Revert text color
          const icon = target.querySelector('svg');
          const text = target.querySelector('.MuiListItemText-primary');
          if (icon) icon.style.color = "black";
          if (text) text.style.color = "black";
        }}
      >
          <ListItemIcon
          sx={{
            color: "black", // Default icon color
            minWidth: 0,
            marginRight: "20px",
            justifyContent: "center",
            transition: "color 0.3s ease",
          }}
        >
          <TodayIcon />
        </ListItemIcon>
        <ListItemText 
          primary="Attendance" 
          sx={{ 
            color: "black", // Default text color
            '& .MuiListItemText-primary': {
              transition: "color 0.3s ease",
            }
          }} 
        />
      </NavLink>
    </ListItem>
        
 <ListItem disablePadding sx={{ display: "block" }}>
        <NavLink
          to="/HomePage2"
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
            const icon = target.querySelector('svg');
            const textDiv = target.querySelector('.MuiListItemText-primary');
            if (icon) icon.style.color = "#0077d4"; // Change icon color on hover
            if (textDiv) textDiv.style.color = "#0077d4"; // Change text color on hover
          }}
          onMouseLeave={(e) => {
            const target = e.currentTarget;
            target.style.color = "black"; // Revert text color
            const icon = target.querySelector('svg');
            const textDiv = target.querySelector('.MuiListItemText-primary');
            if (icon) icon.style.color = "black"; // Revert icon color
            if (textDiv) textDiv.style.color = "black"; // Revert text color
          }}
        >
          <ListItemIcon
            sx={{
              color: "black",
              minWidth: 0,
              marginRight: "20px",
              justifyContent: "center",
            }}
          >
            <HomeIcon />
          </ListItemIcon>
         <ListItemText 
          primary="Home" 
          sx={{ 
            color: "black", // Default text color
            '& .MuiListItemText-primary': {
              transition: "color 0.3s ease",
            }
          }} 
        />
        </NavLink>
      </ListItem>
        
{/* 
          <ListItem disablePadding sx={{ display: "block" }}  onClick={() => navigate("/App001")}>
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
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary=" Attendance" sx={{ opacity: open ? 1 : 0, color: "white" }} />
            </ListItemButton>
          </ListItem>
        

          <ListItem disablePadding sx={{ display: "block" }}  onClick={() => navigate("/LeaveapplyHr")}>
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
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Leaves" sx={{ opacity: open ? 1 : 0, color: "white" }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ display: "block" }}  onClick={() => navigate("/LeaveRequestTable")}>
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
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Leaves History" sx={{ opacity: open ? 1 : 0, color: "white" }} />
            </ListItemButton>
          </ListItem>

  <ListItem disablePadding sx={{ display: "block" }}  onClick={() => navigate("/HolidaysHrPage")}>
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
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Holiday" sx={{ opacity: open ? 1 : 0, color: "white" }} />
            </ListItemButton>
          </ListItem> */}
      <ListItem disablePadding sx={{ display: "block" }}>
  <ListItemButton
    onClick={handleSalaryClick}
    sx={{
      minHeight: 48,
      px: 2.5,
      transition: "all 0.3s ease",
      '&:hover': {
        backgroundColor: "white", 
        '& .MuiListItemIcon-root': {
          color: "#0077d4" // Icon color on hover
        },
        '& .MuiListItemText-primary': {
          color: "#0077d4" // Text color on hover
        },
        '& .MuiSvgIcon-root': {
          color: "#0077d4" // Expand/collapse icon color on hover
        }
      }
    }}
  >
      <ListItemIcon sx={{ 
      color: "black",
      minWidth: 0,
      mr: 3,
      justifyContent: "center",
      transition: "color 0.3s ease"
    }}>
      <AssignmentIcon />
    </ListItemIcon>
    <ListItemText 
      primary="Leave" 
      sx={{ 
        '& .MuiListItemText-primary': {
          color: "black",
          transition: "color 0.3s ease" 
        }
      }} 
    />
     {open && (openSalary ? 
      <ExpandLessIcon sx={{ 
        color: "black",
        transition: "color 0.3s ease" 
      }} /> : 
      <ExpandMoreIcon sx={{ 
        color: "black",
        transition: "color 0.3s ease"
      }} />)}
  </ListItemButton>
</ListItem>
          {open && (
            <Collapse in={openSalary} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem disablePadding sx={{ display: "block" }} onClick={() => navigate("/LeaveapplyHr2")}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                      ml:6,
                      transition: "transform 0.4s ease-in-out",
                      "&:hover": {
                        backgroundColor: "#eaf7f7",
                        transform: "scale(1.10)",
                      },
                    }}
                     onMouseEnter={(e) => {
            const target = e.currentTarget;
            target.style.color = "#0077d4"; // Change text color on hover
            const icon = target.querySelector('svg');
            const textDiv = target.querySelector('.MuiListItemText-primary');
            if (icon) icon.style.color = "#0077d4"; // Change icon color on hover
            if (textDiv) textDiv.style.color = "#0077d4"; // Change text color on hover
          }}
          onMouseLeave={(e) => {
            const target = e.currentTarget;
            target.style.color = "black"; // Revert text color
            const icon = target.querySelector('svg');
            const textDiv = target.querySelector('.MuiListItemText-primary');
            if (icon) icon.style.color = "black"; // Revert icon color
            if (textDiv) textDiv.style.color = "black"; // Revert text color
          }}
                  >
                       <ListItemText 
          primary="Apply" 
          sx={{ 
            color: "black", // Default text color
            '& .MuiListItemText-primary': {
              transition: "color 0.3s ease",
            }
          }} 
        />
                  </ListItemButton>
                </ListItem>
                
                <ListItem disablePadding sx={{ display: "block" }} onClick={() => navigate("/LeaveRequestTable2")}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                      ml:6,
                      transition: "transform 0.4s ease-in-out",
                      "&:hover": {
                        backgroundColor: "#eaf7f7",
                        transform: "scale(1.10)",
                      },
                    }}
                     onMouseEnter={(e) => {
            const target = e.currentTarget;
            target.style.color = "#0077d4"; // Change text color on hover
            const icon = target.querySelector('svg');
            const textDiv = target.querySelector('.MuiListItemText-primary');
            if (icon) icon.style.color = "#0077d4"; // Change icon color on hover
            if (textDiv) textDiv.style.color = "#0077d4"; // Change text color on hover
          }}
          onMouseLeave={(e) => {
            const target = e.currentTarget;
            target.style.color = "black"; // Revert text color
            const icon = target.querySelector('svg');
            const textDiv = target.querySelector('.MuiListItemText-primary');
            if (icon) icon.style.color = "black"; // Revert icon color
            if (textDiv) textDiv.style.color = "black"; // Revert text color
          }}
                  >
                      <ListItemText 
          primary="Leave Status" 
          sx={{ 
            color: "black", // Default text color
            '& .MuiListItemText-primary': {
              transition: "color 0.3s ease",
            }
          }} 
        />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding sx={{ display: "block" }} onClick={() => navigate("/LeaveBalances2")}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                      ml:6,
                      transition: "transform 0.4s ease-in-out",
                      "&:hover": {
                        backgroundColor: "#eaf7f7",
                        transform: "scale(1.10)",
                      },
                    }}
                     onMouseEnter={(e) => {
            const target = e.currentTarget;
            target.style.color = "#0077d4"; // Change text color on hover
            const icon = target.querySelector('svg');
            const textDiv = target.querySelector('.MuiListItemText-primary');
            if (icon) icon.style.color = "#0077d4"; // Change icon color on hover
            if (textDiv) textDiv.style.color = "#0077d4"; // Change text color on hover
          }}
          onMouseLeave={(e) => {
            const target = e.currentTarget;
            target.style.color = "black"; // Revert text color
            const icon = target.querySelector('svg');
            const textDiv = target.querySelector('.MuiListItemText-primary');
            if (icon) icon.style.color = "black"; // Revert icon color
            if (textDiv) textDiv.style.color = "black"; // Revert text color
          }}
                  >
                      <ListItemText 
          primary="Leave Balance" 
          sx={{ 
            color: "black", // Default text color
            '& .MuiListItemText-primary': {
              transition: "color 0.3s ease",
            }
          }} 
        />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding sx={{ display: "block" }} onClick={() => navigate("/LeaveCalendar2")}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                      ml:6,
                      transition: "transform 0.4s ease-in-out",
                      "&:hover": {
                        backgroundColor: "#eaf7f7",
                        transform: "scale(1.10)",
                      },
                    }}
                     onMouseEnter={(e) => {
            const target = e.currentTarget;
            target.style.color = "#0077d4"; // Change text color on hover
            const icon = target.querySelector('svg');
            const textDiv = target.querySelector('.MuiListItemText-primary');
            if (icon) icon.style.color = "#0077d4"; // Change icon color on hover
            if (textDiv) textDiv.style.color = "#0077d4"; // Change text color on hover
          }}
          onMouseLeave={(e) => {
            const target = e.currentTarget;
            target.style.color = "black"; // Revert text color
            const icon = target.querySelector('svg');
            const textDiv = target.querySelector('.MuiListItemText-primary');
            if (icon) icon.style.color = "black"; // Revert icon color
            if (textDiv) textDiv.style.color = "black"; // Revert text color
          }}
                  >
                     <ListItemText 
          primary="Holiday calender" 
          sx={{ 
            color: "black", // Default text color
            '& .MuiListItemText-primary': {
              transition: "color 0.3s ease",
            }
          }} 
        />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding sx={{ display: "block" }} onClick={() => navigate("/HolidaysempPage2")}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                      ml:6,
                      transition: "transform 0.4s ease-in-out",
                      "&:hover": {
                        backgroundColor: "#eaf7f7",
                        transform: "scale(1.10)",
                      },
                    }}
                      onMouseEnter={(e) => {
            const target = e.currentTarget;
            target.style.color = "#0077d4"; // Change text color on hover
            const icon = target.querySelector('svg');
            const textDiv = target.querySelector('.MuiListItemText-primary');
            if (icon) icon.style.color = "#0077d4"; // Change icon color on hover
            if (textDiv) textDiv.style.color = "#0077d4"; // Change text color on hover
          }}
          onMouseLeave={(e) => {
            const target = e.currentTarget;
            target.style.color = "black"; // Revert text color
            const icon = target.querySelector('svg');
            const textDiv = target.querySelector('.MuiListItemText-primary');
            if (icon) icon.style.color = "black"; // Revert icon color
            if (textDiv) textDiv.style.color = "black"; // Revert text color
          }}
                  >
                   <ListItemText 
          primary="Holidays" 
          sx={{ 
            color: "black", // Default text color
            '& .MuiListItemText-primary': {
              transition: "color 0.3s ease",
            }
          }} 
        />
                  </ListItemButton>
                </ListItem>

              </List>  
            </Collapse>
          )} 

           <ListItem disablePadding sx={{ display: "block" }}>
      <NavLink
        to="/ReimbursementForm2"
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
            const icon = target.querySelector('svg');
            const textDiv = target.querySelector('.MuiListItemText-primary');
            if (icon) icon.style.color = "#0077d4"; // Change icon color on hover
            if (textDiv) textDiv.style.color = "#0077d4"; // Change text color on hover
          }}
          onMouseLeave={(e) => {
            const target = e.currentTarget;
            target.style.color = "black"; // Revert text color
            const icon = target.querySelector('svg');
            const textDiv = target.querySelector('.MuiListItemText-primary');
            if (icon) icon.style.color = "black"; // Revert icon color
            if (textDiv) textDiv.style.color = "black"; // Revert text color
          }}
      >
        <ListItemIcon
          sx={{
            color: "black",
            minWidth: 0,
            marginRight: "20px",
            justifyContent: "center",
          }}
        >
          <CurrencyExchangeIcon />
        </ListItemIcon>
        <ListItemText 
          primary="Reimbursement" 
          sx={{ 
            color: "black", // Default text color
            '& .MuiListItemText-primary': {
              transition: "color 0.3s ease",
            }
          }} 
        />
      </NavLink>
    </ListItem>

       <ListItem disablePadding sx={{ display: "block" }}>
      <NavLink
        to="/payslipgenerator"
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
            const icon = target.querySelector('svg');
            const textDiv = target.querySelector('.MuiListItemText-primary');
            if (icon) icon.style.color = "#0077d4"; // Change icon color on hover
            if (textDiv) textDiv.style.color = "#0077d4"; // Change text color on hover
          }}
          onMouseLeave={(e) => {
            const target = e.currentTarget;
            target.style.color = "black"; // Revert text color
            const icon = target.querySelector('svg');
            const textDiv = target.querySelector('.MuiListItemText-primary');
            if (icon) icon.style.color = "black"; // Revert icon color
            if (textDiv) textDiv.style.color = "black"; // Revert text color
          }}
      >
          <ListItemIcon
          sx={{
            color: "black",
            minWidth: 0,
            marginRight: "20px",
            justifyContent: "center",
          }}
        >
          <ReceiptIcon />
        </ListItemIcon>
        <ListItemText 
          primary="Payslip" 
          sx={{ 
            color: "black", // Default text color
            '& .MuiListItemText-primary': {
              transition: "color 0.3s ease",
            }
          }} 
        />
      </NavLink>
    </ListItem>
         
    <ListItem disablePadding sx={{ display: "block" }}>
      <NavLink
        to="/SlabTemplateEmp"
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
            const icon = target.querySelector('svg');
            const textDiv = target.querySelector('.MuiListItemText-primary');
            if (icon) icon.style.color = "#0077d4"; // Change icon color on hover
            if (textDiv) textDiv.style.color = "#0077d4"; // Change text color on hover
          }}
          onMouseLeave={(e) => {
            const target = e.currentTarget;
            target.style.color = "black"; // Revert text color
            const icon = target.querySelector('svg');
            const textDiv = target.querySelector('.MuiListItemText-primary');
            if (icon) icon.style.color = "black"; // Revert icon color
            if (textDiv) textDiv.style.color = "black"; // Revert text color
          }}
      >
         <ListItemIcon
          sx={{
            color: "black",
            minWidth: 0,
            marginRight: "20px",
            justifyContent: "center",
          }}
        >
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText 
          primary="Settings" 
          sx={{ 
            color: "black", // Default text color
            '& .MuiListItemText-primary': {
              transition: "color 0.3s ease",
            }
          }} 
        />
      </NavLink>
    </ListItem>


        <ListItem disablePadding sx={{ display: "block" }}>
      <NavLink
        to="/info"
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
            const icon = target.querySelector('svg');
            const textDiv = target.querySelector('.MuiListItemText-primary');
            if (icon) icon.style.color = "#0077d4"; // Change icon color on hover
            if (textDiv) textDiv.style.color = "#0077d4"; // Change text color on hover
          }}
          onMouseLeave={(e) => {
            const target = e.currentTarget;
            target.style.color = "black"; // Revert text color
            const icon = target.querySelector('svg');
            const textDiv = target.querySelector('.MuiListItemText-primary');
            if (icon) icon.style.color = "black"; // Revert icon color
            if (textDiv) textDiv.style.color = "black"; // Revert text color
          }}
      >
        <ListItemIcon
          sx={{
            color: "black",
            minWidth: 0,
            marginRight: "20px",
            justifyContent: "center",
          }}
        >
          <InfoIcon />
        </ListItemIcon>
        <ListItemText 
          primary="Info" 
          sx={{ 
            color: "black", // Default text color
            '& .MuiListItemText-primary': {
              transition: "color 0.3s ease",
            }
          }} 
        />
      </NavLink>
    </ListItem>
        </List>
      </Drawer>

      {/* Temporary Drawer for Small Screens */}
      <Drawer variant="temporary" open={open} onClose={handleDrawerToggle} sx={{ display: { xs: 'block', sm: 'none' } }}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerToggle}>
            {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {/* Same list items as in the permanent drawer */}
        </List>
      </Drawer>
                 </Drawer>
                  </Box>
  );
}
