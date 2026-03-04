import React, { useState, useEffect } from "react"; // Added useState import
import Sidenav from "./Sidenav2";
import Navbar from "./Navbar2";
import { Box, Grid, Typography, Card, IconButton } from "@mui/material";
import TodayIcon from "@mui/icons-material/Today";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import RedeemIcon from "@mui/icons-material/Redeem";
import { keyframes } from "@mui/system";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import { ServerConfig } from "../../serverconfiguration/serverconfig";
import { REPORTS } from "../../serverconfiguration/controllers";
import { postRequest, getRequest } from "../../serverconfiguration/requestcomp";

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

export default function HomePage2() {
  const navigate = useNavigate();
  const [bdaylistv, setBdayListv] = useState([]);
  const [birthdayGreeting, setBirthdayGreeting] = useState("");
  const [employeeFirstName, setEmployeeFirstName] = useState(""); // Added state for first name
  const [hasShownGreeting, setHasShownGreeting] = useState(false);
  const dbname = sessionStorage.getItem("databaseName");

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
    });
  }, []);

  useEffect(() => {
    let timer;

    async function getData() {
      try {
        const empCode = sessionStorage.getItem("user");
        if (empCode && !hasShownGreeting) {
          const employeeData = await postRequest(ServerConfig.url, REPORTS, {
            query: `SELECT * FROM [${dbname}].[dbo].[paym_Employee]  WHERE EmployeeCode = '${empCode}'`,
          });

          if (employeeData.data && employeeData.data.length > 0) {
            const fullName = employeeData.data[0].Employee_Full_Name;
            const firstName = fullName.split(" ")[0];
            setEmployeeFirstName(firstName);

            const dateOfBirth = employeeData.data[0].DateofBirth;

            if (dateOfBirth) {
              const dob = new Date(dateOfBirth);
              const today = new Date();

              if (
                dob.getMonth() === today.getMonth() &&
                dob.getDate() === today.getDate()
              ) {
                setBirthdayGreeting(`🎉 Today is ${fullName}'s birthday! 🎂`);
                setHasShownGreeting(true);

                timer = setTimeout(() => {
                  setBirthdayGreeting("");
                }, 10000);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    }

    getData();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [hasShownGreeting]);

  useEffect(() => {
    async function fetchBirthdays() {
      try {
        const today = new Date();
        const currentMonth = today.getMonth() + 1; // JavaScript months are 0-based
        const currentDay = today.getDate();

        const birthdayData = await postRequest(ServerConfig.url, REPORTS, {
          query: `SELECT Employee_Full_Name, EmployeeCode FROM [${dbname}].[dbo].[paym_Employee] 
                  WHERE MONTH(DateofBirth) = ${currentMonth} 
                  AND DAY(DateofBirth) = ${currentDay}`,
        });

        if (birthdayData.data && birthdayData.data.length > 0) {
          const birthdayList = birthdayData.data.map((employee) => ({
            name: employee.Employee_Full_Name,
            message: `🎉 Today is ${employee.Employee_Full_Name}'s birthday! 🎂`,
          }));

          setBdayListv(birthdayList);

          // Check if current user is in the birthday list
          const empCode = sessionStorage.getItem("user");
          const currentUser = birthdayData.data.find(
            (emp) => emp.EmployeeCode === empCode
          );

          if (currentUser && !birthdayGreeting) {
            const firstName = currentUser.Employee_Full_Name.split(" ")[0];
            setBirthdayGreeting(`🎉 Happy Birthday, ${firstName}! 🎂`);
          }
        }
      } catch (error) {
        console.error("Error fetching birthday data:", error);
      }
    }

    fetchBirthdays();
  }, [birthdayGreeting]); // Added dependency

  const cardItems = [
    {
      text: "Attendance",
      icon: <TodayIcon sx={{ width: 40, height: 40 }} />,
      onclick: () => navigate("/BasicDateCalendar2"),
    },
    {
      text: "Leave",
      icon: <AssignmentIcon sx={{ width: 40, height: 40 }} />,
      onclick: () => navigate("/LeaveapplyHr2"),
    },
    { text: "Shift", icon: <AccessTimeIcon sx={{ width: 40, height: 40 }} /> },
    {
      text: "Payslip",
      icon: <ReceiptIcon sx={{ width: 40, height: 40 }} />,
      onclick: () => navigate("/payslipgenerator"),
    },
    {
      text: "Reimbursement",
      icon: <CurrencyExchangeIcon sx={{ width: 40, height: 40 }} />,
      onclick: () => navigate("/ReimbursementForm2"),
    },
    { text: "Loan", icon: <RedeemIcon sx={{ width: 40, height: 40 }} /> },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
      }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Main Content with Sidebar */}
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        <Sidenav />

        {/* Centered Content */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 3,
            bgcolor: "#efefef",
          }}
        >
          <div data-aos="zoom-in-down">
            <Grid
              container
              spacing={4}
              sx={{
                maxWidth: "lg",
                justifyContent: "center",
              }}
            >
              {cardItems.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
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
                    >
                      <IconButton
                        className="icon-button"
                        sx={{
                          mb: 2,
                          color: "black",
                          transition: "color 0.3s ease-in-out",
                        }}
                        onClick={item.onclick}
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
          </div>
        </Box>
      </Box>

      {/* Birthday Notification - Moved outside the main grid */}
      {birthdayGreeting && (
        <Box
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            backgroundColor: "#fff",
            padding: 2,
            borderRadius: 2,
            boxShadow: 3,
            zIndex: 1000,
          }}
        >
          <Typography sx={{ color: "green", fontSize: 16 }}>
            {birthdayGreeting}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
