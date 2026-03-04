import React, { useState, useEffect } from "react";
import { format } from "date-fns"; // Import the format function from date-fns
import { ServerConfig } from "../../../serverconfiguration/serverconfig";
import { REPORTS } from "../../../serverconfiguration/controllers";
import { postRequest } from "../../../serverconfiguration/requestcomp";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import {
  Table,
  TableContainer,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid,
  TextField,
  Typography,
  Box,
  Button,
  Stack,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Sidenav from "../../Home Page/Sidenav";
import Navbar from "../../Home Page/Navbar";
const HolidaysPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [holidayType, setHolidayType] = useState("all");
  const [holidays, setHolidays] = useState([]);
  const navigate = useNavigate();
  const databaseName = sessionStorage.getItem("databaseName");

  // const branchId = sessionStorage.getItem("branchInfo");
  // const companyId = sessionStorage.getItem("pn_CompanyID");

  // Function to fetch holidays data
  //   const fetchHolidays = async () => {
  //     try {
  //       // const query = `SELECT From_date AS date, days AS day, pn_Holidayname AS holidayName FROM paym_holiday WHERE Fyear = YEAR(GETDATE())`;
  //       const query = `
  //   SELECT From_date AS date, days AS day, pn_Holidayname AS holidayName
  //   FROM paym_holiday
  //   WHERE Fyear = YEAR(GETDATE())
  //   AND pn_CompanyID = ${companyId}
  //   AND pn_BranchID = ${branchId}
  // `;

  //       const response = await postRequest(ServerConfig.url, REPORTS, { query });

  //       if (response.status === 200) {
  //         console.log("Fetched holidays:", response.data);
  //         setHolidays(response.data || []);
  //       } else {
  //         console.error`(Unexpected response status: ${response.status})`;
  //       }
  //     } catch (error) {
  //       console.error("Error fetching holidays data:", error);
  //     }
  //   };

//   const fetchHolidays = async () => {
//   try {
//     // 1️⃣ Read branch info from sessionStorage
//     const branchInfoRaw = sessionStorage.getItem("branchInfo");
//     if (!branchInfoRaw) {
//       console.error("❌ No branch info found in sessionStorage!");
//       return;
//     }

//     const branchInfo = JSON.parse(branchInfoRaw);
//     console.log("✅ Loaded branch info:", branchInfo);

//     const { pn_CompanyID, pn_BranchID } = branchInfo;

//     if (!pn_CompanyID || !pn_BranchID) {
//       console.error("❌ Missing pn_CompanyID or pn_BranchID!");
//       return;
//     }

//     // 2️⃣ Build SQL query
//     const query = `
//   SELECT 
//     From_date AS date, 
//     days AS day, 
//     pn_Holidayname AS holidayName 
//   FROM [${databaseName}].[dbo].[paym_Holiday] 
//   WHERE Fyear = YEAR(GETDATE()) 
//     AND pn_CompanyID = ${pn_CompanyID}
//     AND pn_BranchID = ${pn_BranchID};
//   `;


//     console.log("🟡 Running query:", query);

//     // 3️⃣ Make API request
//     const response = await postRequest(ServerConfig.url, REPORTS, { query });

//     // 4️⃣ Log and handle response
//     console.log("🟢 Raw response:", response);

//     if (response?.status === 200 && Array.isArray(response?.data)) {
//       console.log("✅ Fetched holidays:", response.data);
//       setHolidays(response.data);
//     } else {
//       console.error("❌ Unexpected response format:", response);
//     }
//   } catch (error) {
//     console.error("🔥 Error fetching holidays:", error);
//   }
// };

const fetchHolidays = async () => {
  try {
    // ✅ 1️⃣ Get DB Name
    const databaseName = sessionStorage.getItem("databaseName");
    if (!databaseName) {
      console.warn("⚠️ No database name found in sessionStorage!");
      return;
    }

    // ✅ 2️⃣ Load branch info
    const branchInfoRaw = sessionStorage.getItem("branchInfo");
    if (!branchInfoRaw) {
      console.error("❌ No branch info found in sessionStorage!");
      return;
    }

    const branchInfo = JSON.parse(branchInfoRaw);
    console.log("✅ Loaded branch info:", branchInfo);

    const { pn_CompanyID, pn_BranchID } = branchInfo;

    if (!pn_CompanyID || !pn_BranchID) {
      console.error("❌ Missing pn_CompanyID or pn_BranchID!");
      return;
    }

    // ✅ 3️⃣ Dynamic DB Query
    const query = `
      SELECT 
        From_date AS date, 
        days AS day, 
        pn_Holidayname AS holidayName 
      FROM [${databaseName}].[dbo].[paym_Holiday]
      WHERE Fyear = YEAR(GETDATE()) 
        AND pn_CompanyID = ${pn_CompanyID}
        AND pn_BranchID = ${pn_BranchID};
    `;

    console.log("🔹 Using Database:", databaseName);
    console.log("🟡 Running Query:", query);

    // ✅ 4️⃣ Execute Query
    const response = await postRequest(ServerConfig.url, REPORTS, { query });

    if (response?.status === 200 && Array.isArray(response?.data)) {
      console.log("✅ Fetched holidays:", response.data);
      setHolidays(response.data);
    } else {
      console.error("❌ Unexpected response format:", response);
    }

    if (response?.data?.length === 0) {
      console.warn("⚠️ No holidays found for this company/branch this year.");
    }

  } catch (error) {
    console.error("🔥 Error fetching holidays:", error);
  }
};



  useEffect(() => {
    fetchHolidays();
  }, []);

  // Filter holidays based on search term and type
  const filteredHolidays = holidays.filter((holiday) => {
    const holidayDate = new Date(holiday.date);
    const isUpcoming = holidayDate > new Date();
    if (holidayType === "upcoming" && !isUpcoming) return false;
    if (holidayType === "past" && isUpcoming) return false;

    return (
      holiday.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(holiday.day).toLowerCase().includes(searchTerm.toLowerCase()) ||
      holiday.holidayName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Function to format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return format(date, "dd-MM-yyyy"); // Format the date as 'dd-MM-yyyy'
  };

  const handleAddNewHolidayClick = () => {
    navigate("/HolidayForm1");
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "100vh", margin: 0 }}
    >
      <div style={{ backgroundColor: "#f5f5f5", width: "100%" }}>
        <Navbar />
        <Box height={30} />
        <Box sx={{ display: "flex" }}>
          <Sidenav />
          <Grid
            item
            xs={12}
            sm={10}
            md={9}
            lg={8}
            xl={7}
            style={{ margin: "0 auto", padding: "20px" }}
          >
            <Box sx={{ p: 2 }}>
              <AppBar
                position="sticky"
                color="default"
                elevation={2}
                sx={{
                  backgroundColor: "#0077d4",
                  color: "white",
                  marginTop: "35px",
                }}
              >
                <Toolbar sx={{ justifyContent: "center" }}>
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{ fontWeight: "bold", textAlign: "left", flexGrow: 1 }}
                  >
                    HOLIDAYS
                  </Typography>
                </Toolbar>
              </AppBar>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Stack
                  direction="row"
                  spacing={4}
                  alignItems="center"
                  mb={2}
                  sx={{ justifyContent: "space-between" }}
                >
                  <TextField
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{
                      width: 300,
                      "& .MuiInputBase-root": {
                        backgroundColor: "#white", // light gray background
                      },
                      "& label": {
                        color: "#666", // default label color (gray)
                      },
                      "&:hover .MuiInputLabel-root": {
                        color: "black", // label color black on hover
                      },
                      "& .Mui-focused .MuiInputLabel-root": {
                        color: "black", // label color black on focus
                      },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#ccc", // default border color
                        },
                        "&:hover fieldset": {
                          borderColor: "black", // border color black on hover
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "black", // border color black on focus
                        },
                      },
                    }} // adjust the width value as needed
                  />

                  <FormControl>
                    <RadioGroup
                      row
                      value={holidayType}
                      onChange={(e) => setHolidayType(e.target.value)}
                    >
                      <FormControlLabel
                        value="all"
                        control={<Radio />}
                        label="All"
                      />
                      <FormControlLabel
                        value="upcoming"
                        control={<Radio />}
                        label="Upcoming"
                      />
                      <FormControlLabel
                        value="past"
                        control={<Radio />}
                        label="Past Holidays"
                      />
                    </RadioGroup>
                  </FormControl>

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddNewHolidayClick}
                  >
                    Add New Holiday
                  </Button>
                </Stack>
              </Paper>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <TableContainer component={Paper} sx={{ width: 1000 }}>
                  <Table>
                    <TableHead sx={{ backgroundColor: "#e8e8e8" }}>
                      <TableRow>
                        <TableCell
                          sx={{
                            fontSize: 18,
                            textAlign: "center",
                            fontWeight: "bold",
                            width: "333px",
                          }}
                        >
                          DATE
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: 18,
                            textAlign: "center",
                            fontWeight: "bold",
                            width: "333px",
                          }}
                        >
                          DAYS
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: 18,
                            textAlign: "center",
                            fontWeight: "bold",
                            width: "333px",
                          }}
                        >
                          HOLIDAY NAME
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredHolidays.map((holiday) => (
                        <TableRow
                          key={holiday.date}
                          sx={{ height: 33 }} // 👈 row height
                        >
                          <TableCell sx={{ fontSize: 15, py: 0.5 }}>
                            {" "}
                            {/* 👈 reduce padding */}
                            {formatDate(holiday.date)}
                          </TableCell>
                          <TableCell sx={{ fontSize: 15, py: 0.5 }}>
                            {holiday.day}
                          </TableCell>
                          <TableCell sx={{ fontSize: 15, py: 0.5 }}>
                            {holiday.holidayName}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </Box>
          </Grid>
        </Box>
      </div>
    </Grid>
  );
};

export default HolidaysPage;
