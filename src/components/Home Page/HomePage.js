import React, { useEffect } from "react";
import Sidenav from "./Sidenav";
import Navbar from "./Navbar";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import { keyframes } from "@mui/system";
import { useNavigate } from "react-router-dom";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import SettingsIcon from "@mui/icons-material/Settings";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TodayIcon from "@mui/icons-material/Today";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";
import BookIcon from "@mui/icons-material/Book";
import holiday from "../../images/Holiday-icon.png";
import AOS from "aos"; // Import AOS
import "aos/dist/aos.css"; // Import AOS CSS

const bounce = keyframes({
  "0%, 20%, 50%, 80%, 100%": {
    transform: "translateY(0)",
  },
  "40%": {
    transform: "translateY(-15px)",
  },
  "60%": {
    transform: "translateY(-10px)",
  },
});

export default function HomePage() {
  const navigate = useNavigate();

  const cardItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon sx={{ width: 50, height: 50 }} />,
      onclick: () => navigate("/DBoards"),
    },
    {
      text: "Master",
      icon: <img src={holiday} width={50} height={50} />,
      onclick: () => navigate("/Masters1"),
    },
    {
      text: "Settings",
      icon: <SettingsIcon sx={{ width: 50, height: 50 }} />,
      onclick: () => navigate("/SlabTemplateEmp"),
    },
    {
      text: "Reimbursement",
      icon: <CurrencyExchangeIcon sx={{ width: 50, height: 50 }} />,
      onclick: () => navigate("/EmployeeReimbursement"),
    },
    {
      text: "Attendance",
      icon: <TodayIcon sx={{ width: 50, height: 50 }} />,
      onclick: () => navigate("/Attendance01"),
    },
    {
      text: "Leave",
      icon: <AssignmentIcon sx={{ width: 50, height: 50 }} />,
      onclick: () => navigate("/LeaveRequestHr"),
    },

    {
      text: "Slabs",
      icon: <BookIcon sx={{ width: 50, height: 50 }} />,
      onclick: () => navigate("/SlabTemplateEmp"),
    },
    {
      text: "Employee",
      icon: <PeopleIcon sx={{ width: 50, height: 50 }} />,
      onclick: () => navigate("/EmployeeHome"),
    },
  ];

  useEffect(() => {
    AOS.init({
      duration: 1000, // Set to 1 second for quick animation
      easing: "ease-in-out", // Optional: Choose an easing function
    });
  }, []);

  return (
    <Grid container>
      {/* Navbar and Sidebar */}
      <Grid item xs={12}>
        <div style={{ backgroundColor: "#fff" }}>
          <Navbar />
          <Box height={30} />
          <Box
            sx={{
              display: "flex",
              backgroundColor: "#efefef",
              alignItems: "flex-start",
            }}
          >
            <Sidenav />
            {/* Main Content */}
            <Grid
              item
              xs={12}
              sm={10}
              md={9}
              lg={8}
              xl={7}
              sx={{ margin: "80px auto", textAlign: "left" }}
            >
              <div data-aos="zoom-in-down">
                <Box
                  sx={{
                    borderRadius: "8px",
                    p: 3,
                    height: "100%",
                  }}
                >
                  <CardContent sx={{ textAlign: "center" }}>
                    <Grid container spacing={3} rowSpacing={4}>
                      {cardItems.map((item, index) => (
                        <Grid item xs={6} sm={4} md={3} key={index}>
                          <Card
                            sx={{
                              width: "100%",
                              height: "160px",
                              borderRadius: "8px",
                              backgroundColor: "white",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              transition:
                                "transform 0.4s ease-in-out, color 0.3s ease-in-out",

                              "&:hover": {
                                transform: "scale(1.1) translateY(-10px)",
                                "& .icon-button, & .text": {
                                  color: "#1976d2", // 👈 hover color (blue), you can change
                                  animation: `${bounce} 2s infinite`,
                                },
                              },
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "100%",
                                p: 2,
                              }}
                              onClick={item.onclick}
                            >
                              <IconButton
                                className="icon-button"
                                sx={{
                                  mb: 2,
                                  color: "black",
                                  transition: "color 0.3s ease-in-out",
                                }}
                                
                              >
                                {item.icon}
                              </IconButton>
                              <Typography
                                className="text"
                                variant="h6"
                                sx={{
                                  color: "black",
                                  transition: "color 0.3s ease-in-out",
                                }}
                                
                              >
                                {item.text}
                              </Typography>
                            </Box>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Box>
              </div>
            </Grid>
          </Box>
        </div>
      </Grid>
    </Grid>
  );
}
