import React, { useState, useEffect } from "react";
import { format } from "date-fns"; // Import the format function from date-fns
import { ServerConfig } from "../../../serverconfiguration/serverconfig";
import { REPORTS } from "../../../serverconfiguration/controllers";
import { postRequest } from "../../../serverconfiguration/requestcomp";
import {
  Table,
  TableContainer,
  TableBody,
  TableCell,
  TableHead,
  AppBar,
  Toolbar,
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
import Sidenav from "../../Home Page3/Sidenav2";
import Navbar from "../../Home Page3/Navbar2";
const HolidaysempPage2 = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [holidayType, setHolidayType] = useState("all");
  const [holidays, setHolidays] = useState([]);
  const navigate = useNavigate();
  const dbname = sessionStorage.getItem("databaseName");


  const empLoginId = sessionStorage.getItem("user");

const getEmployeeDetails = async () => {
  const query = `
    SELECT pn_BranchID, pn_CompanyID
    FROM [${dbname}].[dbo].[paym_Employee]
    WHERE EmployeeCode = '${empLoginId}'
  `;
  const res = await postRequest(ServerConfig.url, REPORTS, { query });
  return res.data[0];
};

  // Function to fetch holidays data
  // const fetchHolidays = async () => {
  //   try {
  //     const query = `SELECT From_date AS date, days AS day, pn_Holidayname AS holidayName FROM paym_holiday WHERE Fyear = YEAR(GETDATE())`;

  //     const response = await postRequest(ServerConfig.url, REPORTS, { query });

  //     if (response.status === 200) {
  //       console.log("Fetched holidays:", response.data);
  //       setHolidays(response.data || []);
  //     } else {
  //       console.error`(Unexpected response status: ${response.status})`;
  //     }
  //   } catch (error) {
  //     console.error("Error fetching holidays data:", error);
  //   }
  // };


  const fetchHolidays = async () => {
  try {
    const emp = await getEmployeeDetails();
    if (!emp) return;

    const query = `
  SELECT 
      h.From_date AS date,
      h.days AS day,
      h.pn_Holidayname AS holidayName,
      b.BranchName AS branchName,
      b.status AS branchStatus
  FROM [${dbname}].[dbo].[paym_Holiday] h
  INNER JOIN [${dbname}].[dbo].[paym_Branch] b 
      ON h.pn_BranchID = b.pn_BranchID
      AND h.pn_CompanyID = b.pn_CompanyID
  WHERE 
      h.Fyear = YEAR(GETDATE())
      AND b.status = 'Active'
      AND h.pn_BranchID = '${emp.pn_BranchID}'
      AND h.pn_CompanyID = '${emp.pn_CompanyID}'
`;


    const response = await postRequest(ServerConfig.url, REPORTS, { query });
    setHolidays(response.data || []);
  } catch (error) {
    console.error("Error fetching holidays:", error);
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
                    // adjust the width value as needed
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
                    }}
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

                  {/* <Button
          variant="contained"
          color="primary"
          onClick={handleAddNewHolidayClick}
        >
          Add New Holiday
        </Button> */}
                </Stack>
              </Paper>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "30px",
                }}
              >
                <TableContainer component={Paper} sx={{ width: 1000 }}>
                  <Table>
                    <TableHead sx={{ backgroundColor: "lightgrey" }}>
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
                        <TableRow key={holiday.date}>
                          <TableCell sx={{ fontSize: 15 }}>
                            {formatDate(holiday.date)}
                          </TableCell>
                          <TableCell sx={{ fontSize: 15 }}>
                            {holiday.day}
                          </TableCell>
                          <TableCell sx={{ fontSize: 15 }}>
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

export default HolidaysempPage2;
