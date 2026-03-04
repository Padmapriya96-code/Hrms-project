import React, { useEffect, useState } from "react";
import { Grid, Paper, Typography, Box, IconButton } from "@mui/material";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isToday,
} from "date-fns";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { styled } from "@mui/material/styles";
import WeekendIcon from "@mui/icons-material/Weekend";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { getRequest, postRequest } from "../../serverconfiguration/requestcomp";
import { ServerConfig } from "../../serverconfiguration/serverconfig";
import { TIMECARD, REPORTS } from "../../serverconfiguration/controllers";
import Navbar from "../Home Page3/Navbar2";
import Sidenav from "../Home Page3/Sidenav2";

const LegendItem = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  display: "flex",
  alignItems: "center",
}));

const StyledBox = styled(Box)(({ theme }) => ({
  border: "1px solid #ccc",
  borderRadius: 4,
  padding: theme.spacing(2),
}));

const LeaveCalendar2 = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const empCode = sessionStorage.getItem("user") || "";

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // useEffect(() => {
  //   async function getData() {
  //     const obj = {
  //       empCode,
  //       shiftCode: null,
  //       status: "",
  //       dates: new Date(),
  //       intime: new Date().toISOString(),
  //       outtime: "2024-04-23T18:00:46.867",
  //       pnEmployeeId: empCode,
  //     };

  //     try {
  //       const response = await getRequest(ServerConfig.url, TIMECARD, obj);
  //       setAttendanceData(response.data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }

  //   if (empCode) getData();
  // }, [empCode]);

  useEffect(() => {
    async function getData() {
      try {
        const dbname = sessionStorage.getItem("databaseName");

        const query = `
        SELECT emp_code, status, dates
        FROM [${dbname}].[dbo].[time_card]
        WHERE emp_code = '${empCode}'
      `;

        const response = await postRequest(ServerConfig.url, REPORTS, {
          dbname: dbname,
          query: query,
        });

        setAttendanceData(response.data || []);
      } catch (error) {
        console.error("Attendance fetch error:", error);
      }
    }

    if (empCode) getData();
  }, [empCode]);

  // const getAttendanceMap = (data) => {
  //   const map = {};
  //   data.forEach((entry) => {
  //     const { dates, status, empCode: entryEmpCode } = entry;
  //     if (entryEmpCode === empCode) {
  //       map[format(new Date(dates), "yyyy-MM-dd")] = status;
  //     }
  //   });
  //   return map;
  // };
  const getAttendanceMap = (data) => {
  const map = {};
  data.forEach((entry) => {
    const { dates, status, emp_code } = entry; // FIX: emp_code instead of empCode

    if (emp_code === empCode) {
      map[format(new Date(dates), "yyyy-MM-dd")] = status;
    }
  });
  return map;
};


  const attendanceMap = getAttendanceMap(attendanceData);

  const rows = [];
  let days = [];
  let day = startDate;
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  rows.push(
    <Grid container key="weekdays">
      {weekDays.map((day, index) => (
        <Grid item xs key={index}>
          <Box
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              backgroundColor: "#e0dfdc",
              borderBottom: "1px solid #ccc",
              padding: "8px",
            }}
          >
            {day}
          </Box>
        </Grid>
      ))}
    </Grid>
  );

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const formattedDate = format(day, "d");
      const attendance = attendanceMap[format(day, "yyyy-MM-dd")] || "";
      const isTodayFlag = isToday(day);

      const getBackgroundColor = (status) => {
        switch (status) {
          case "P":
            return "#ccffcc";
          case "A":
            return "#ffcccc";
          case "O":
            return "#ffff99";
          case "H":
            return "#ccccff";
          case "L":
            return "#ffcc99";
          case "W":
            return "#2f4f4f";
          default:
            return "#ffffff";
        }
      };

      const getStatusColor = (status) => {
        switch (status) {
          case "P":
            return "#2ecc71";
          case "A":
            return "#e74c3c";
          case "O":
            return "#f7dc6f";
          case "H":
            return "#6495ed";
          case "L":
            return "#ffa07a";
          case "W":
            return "#2f4f4f";
          default:
            return "#333";
        }
      };

      days.push(
        <Grid item xs key={day}>
          <Paper
            sx={{
              height: "70px",
              border: "1px solid #ccc",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              padding: "8px",
              position: "relative",
              backgroundColor: getBackgroundColor(attendance),
              textAlign: "center",
            }}
            square
          >
            <Typography
              variant="body2"
              sx={{
                position: "relative",
                zIndex: 1,
                border: isTodayFlag ? "2px solid #007bff" : "none",
                backgroundColor: isTodayFlag ? "#fff" : "transparent",
                borderRadius: "50%",
                padding: "2px",
              }}
            >
              {formattedDate}
            </Typography>
            {attendance && (
              <Typography
                variant="body1"
                sx={{
                  color: getStatusColor(attendance),
                  paddingTop: "10px",
                  paddingLeft: "24px",
                }}
              >
                {attendance}
              </Typography>
            )}
            {(day.getDay() === 0 || day.getDay() === 6) && (
              <WeekendIcon
                sx={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  fontSize: 18,
                  color: "#202120",
                }}
              />
            )}
          </Paper>
        </Grid>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <Grid container key={`week-${day}`}>
        {days}
      </Grid>
    );
    days = [];
  }

  return (
    <>
      <Navbar />
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
          marginTop: "70px",
        }}
      >
        <Sidenav />
        <Box
          sx={{
            flexGrow: 1,
            px: { xs: 2, sm: 4, md: 6 },
            py: 5,
            width: "100%",
          }}
        >
          <Grid container justifyContent="center" spacing={4}>
            {/* Calendar */}
            <Grid item xs={12} md={7}>
              <Box sx={{ textAlign: "center", mb: 2 }}>
                <IconButton onClick={handlePrevMonth}>
                  <ArrowBackIosIcon />
                  <Typography fontSize="15px">Prev</Typography>
                </IconButton>
                <Typography variant="h6" display="inline" mx={2}>
                  {format(currentDate, "MMMM yyyy")}
                </Typography>
                <IconButton onClick={handleNextMonth}>
                  <Typography fontSize="15px">Next</Typography>
                  <ArrowForwardIosIcon />
                </IconButton>
              </Box>
              <Box sx={{ width: "100%", overflowX: "auto" }}>{rows}</Box>
            </Grid>

            {/* Legends */}
            <Grid item xs={12} md={5}>
              <StyledBox sx={{ mx: "auto", maxWidth: 570, marginTop: "100px" }}>
                <Typography variant="h6" gutterBottom>
                  Legends
                </Typography>
                <Grid container spacing={2} mt={1}>
                  <Grid item xs={6}>
                    <LegendItem>
                      <CheckCircleIcon sx={{ color: "#2ecc71", mr: 1 }} />
                      Present
                    </LegendItem>
                  </Grid>
                  <Grid item xs={6}>
                    <LegendItem>
                      <CancelIcon sx={{ color: "#e74c3c", mr: 1 }} />
                      Absent
                    </LegendItem>
                  </Grid>
                  <Grid item xs={6}>
                    <LegendItem>
                      <WeekendIcon sx={{ color: "#e6edf5", mr: 1 }} />
                      Weekend
                    </LegendItem>
                  </Grid>
                  <Grid item xs={6}>
                    <LegendItem>
                      <CheckCircleIcon sx={{ color: "#f7dc6f", mr: 1 }} />
                      Off Day
                    </LegendItem>
                  </Grid>
                  <Grid item xs={6}>
                    <LegendItem>
                      <CheckCircleIcon sx={{ color: "#6495ed", mr: 1 }} />
                      Holiday
                    </LegendItem>
                  </Grid>
                  <Grid item xs={6}>
                    <LegendItem>
                      <CheckCircleIcon sx={{ color: "#ffa07a", mr: 1 }} />
                      Leave
                    </LegendItem>
                  </Grid>
                  <Grid item xs={6}>
                    <LegendItem>
                      <CheckCircleIcon sx={{ color: "#2f4f4f", mr: 1 }} />
                      Work From Home
                    </LegendItem>
                  </Grid>
                </Grid>
              </StyledBox>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default LeaveCalendar2;
