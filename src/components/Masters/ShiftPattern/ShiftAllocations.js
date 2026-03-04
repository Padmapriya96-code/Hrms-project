import React, { useState, useEffect } from "react";
import { ServerConfig } from "../../../serverconfiguration/serverconfig";
import { REPORTS, SAVE } from "../../../serverconfiguration/controllers";
import { postRequest } from "../../../serverconfiguration/requestcomp";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  AppBar,
  Toolbar,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Typography,
  Grid,
  Box,
  Avatar,
  Checkbox,
  TextField, // Import TextField for the date input
} from "@mui/material"; // Changed to @mui/material for consistency
import Sidenav from "../../Home Page/Sidenav"; // Import Sidenav
import Navbar from "../../Home Page/Navbar"; // Import Navbar
import nodata from "../../../images/NoDataImage.jpeg"; // Import no data image
import Calendar from "react-calendar"; // Import Calendar
import "react-calendar/dist/Calendar.css"; // Import Calendar styles
import { toast } from 'react-toastify';

function EmployeeShiftAllocation() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedin, setLoggedin] = useState(sessionStorage.getItem("user"));
  const [loggedBranch, setLoggedBranch] = useState([]);
  const [employeeImages, setEmployeeImages] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState({});
  const [selectAll, setSelectAll] = useState(false); // State for "Select All"
  const [shiftPatterns, setShiftPatterns] = useState([]); // State for shift patterns
  const [employeeShiftPatterns, setEmployeeShiftPatterns] = useState({}); // State for employee shift patterns
  const [globalShiftPattern, setGlobalShiftPattern] = useState("");
  const [employeeShiftCodes, setEmployeeShiftCodes] = useState({}); // State for employee shift codes
  const [employeeShiftDays, setEmployeeShiftDays] = useState({}); // State for employee shift days
  const [calendarDate, setCalendarDate] = useState(new Date()); // State for calendar date
  const [categories, setCategories] = useState([]);
  const [grades, setGrades] = useState([]);
  const databaseName = sessionStorage.getItem("databaseName");

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  ); // State for the selected date, defaulting to today's date
  const [refresh, setRefresh] = useState(false); // State to trigger refresh
  const [existingShiftData, setExistingShiftData] = useState({}); // State to store existing shift data
  const [shiftHistory, setShiftHistory] = useState({}); // Store shift history

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const fetchShiftCodes = async (patternCode) => {
    try {
      const query = `
        SELECT shift_code1, days1, shift_code2, days2, shift_code3, days3,
               shift_code4, days4, shift_code5, days5, shift_code6, days6,
               shift_code7, days7, shift_code8, days8
        FROM [${databaseName}].[dbo].[shift_pattern]
        WHERE pattern_code = '${patternCode}';
      `;
      const response = await postRequest(ServerConfig.url, REPORTS, { query });

      if (response.status === 200) {
        const codes = response.data[0];
        console.log("Fetched Codes and Days:", codes); // Log the fetched data
        return {
          shiftCodes: [
            codes.shift_code1,
            codes.shift_code2,
            codes.shift_code3,
            codes.shift_code4,
            codes.shift_code5,
            codes.shift_code6,
            codes.shift_code7,
            codes.shift_code8,
          ].filter((code) => typeof code === "string" && code.trim() !== ""), // Filter out invalid codes
          days: [
            codes.days1,
            codes.days2,
            codes.days3,
            codes.days4,
            codes.days5,
            codes.days6,
            codes.days7,
            codes.days8,
          ].filter((day) => typeof day === "number" && !isNaN(day)), // Filter out invalid days
        };
      }
    } catch (error) {
      console.error("Error fetching shift codes:", error);
    }
    return { shiftCodes: [], days: [] }; // Return empty if there's an error
  };

  const handleEmployeeSelect = (pn_EmployeeID) => {
    setSelectedEmployees((prev) => ({
      ...prev,
      [pn_EmployeeID]: !prev[pn_EmployeeID],
    }));
  };

  const handleSelectAll = () => {
    const newSelectedEmployees = {};
    filteredEmployees.forEach((employee) => {
      newSelectedEmployees[employee.pn_EmployeeID] = !selectAll; // Toggle selection
    });
    setSelectedEmployees(newSelectedEmployees);
    setSelectAll(!selectAll); // Toggle "Select All" state
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleGradeChange = (event) => {
    setSelectedGrade(event.target.value);
  };

  const handlePatternChange = async (event, pn_EmployeeID) => {
    const selectedPattern = event.target.value;
    setEmployeeShiftPatterns((prev) => ({
      ...prev,
      [pn_EmployeeID]: selectedPattern,
    }));

    // Fetch shift codes and days for the selected pattern
    if (selectedPattern) {
      const codes = await fetchShiftCodes(selectedPattern);
      setEmployeeShiftCodes((prev) => ({
        ...prev,
        [pn_EmployeeID]: codes.shiftCodes,
      }));
      setEmployeeShiftDays((prev) => ({
        ...prev,
        [pn_EmployeeID]: codes.days,
      }));
    } else {
      // Clear shift codes and days if no pattern is selected
      setEmployeeShiftCodes((prev) => ({
        ...prev,
        [pn_EmployeeID]: [],
      }));
      setEmployeeShiftDays((prev) => ({
        ...prev,
        [pn_EmployeeID]: [],
      }));
    }
  };

  const handleGlobalPatternChange = async (event) => {
    const selectedPattern = event.target.value;
    setGlobalShiftPattern(selectedPattern);

    // Fetch shift codes and days for the selected global pattern
    if (selectedPattern) {
      const codes = await fetchShiftCodes(selectedPattern);
      const newEmployeeShiftCodes = {};
      const newEmployeeShiftDays = {};
      filteredEmployees.forEach((employee) => {
        newEmployeeShiftCodes[employee.pn_EmployeeID] = codes.shiftCodes;
        newEmployeeShiftDays[employee.pn_EmployeeID] = codes.days;
      });
      setEmployeeShiftCodes(newEmployeeShiftCodes);
      setEmployeeShiftDays(newEmployeeShiftDays);
    } else {
      // Clear shift codes and days if no global pattern is selected
      const newEmployeeShiftCodes = {};
      const newEmployeeShiftDays = {};
      filteredEmployees.forEach((employee) => {
        newEmployeeShiftCodes[employee.pn_EmployeeID] = [];
        newEmployeeShiftDays[employee.pn_EmployeeID] = [];
      });
      setEmployeeShiftCodes(newEmployeeShiftCodes);
      setEmployeeShiftDays(newEmployeeShiftDays);
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const matchesCategory =
      !selectedCategory || employee.v_CategoryName === selectedCategory;
    const matchesGrade =
      !selectedGrade || employee.v_GradeName === selectedGrade;
    return matchesCategory && matchesGrade;
  });

  useEffect(() => {
    const fetchLoggedBranch = async () => {
      try {
        const query = `SELECT * FROM [${databaseName}].[dbo].[paym_Branch] WHERE Branch_User_Id = '${isLoggedin}'`;
        const response = await postRequest(ServerConfig.url, REPORTS, { query });
        if (response.status === 200) {
          setLoggedBranch(response.data);

          // Once branch is known, fetch categories and grades
          if (response.data.length > 0) {
            const branchId = response.data[0].pn_BranchID;
            fetchCategories(branchId);
            fetchGrades(branchId);   // 👈 fetch grades for this branch
          }
        }
      } catch (error) {
        console.error("Error fetching branch data:", error);
      }
    };

    if (isLoggedin) {
      fetchLoggedBranch();
    }
  }, [isLoggedin, refresh]);

  // fetchCategories function
  const fetchCategories = async (branchId) => {
    try {
      const query = `
      SELECT pn_CompanyID, BranchID, pn_CategoryID, v_CategoryName, status
      FROM [${databaseName}].[dbo].[paym_Category]
      WHERE BranchID = ${branchId};
    `;
      const response = await postRequest(ServerConfig.url, REPORTS, { query });
      if (response.status === 200) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const fetchGrades = async (branchId) => {
    try {
      const query = `
      SELECT pn_CompanyID, BranchID, pn_GradeID, v_GradeName, status
      FROM [${databaseName}].[dbo].[paym_Grade]
      WHERE BranchID = ${branchId};
    `;
      const response = await postRequest(ServerConfig.url, REPORTS, { query });
      if (response.status === 200) {
        setGrades(response.data);
      }
    } catch (error) {
      console.error("Error fetching grades:", error);
    }
  };


  useEffect(() => {
    const fetchEmployees = async () => {
      if (loggedBranch.length > 0) {
        const branchId = loggedBranch[0].pn_BranchID;
        try {
          const query = `
            SELECT
             paym_Employee.pn_CompanyID,
             paym_Employee.pn_BranchID,
              paym_Employee.pn_EmployeeID,
              paym_Employee.EmployeeCode,
              paym_Employee.Employee_Full_Name,
              paym_Category.v_CategoryName,
              paym_Grade.v_GradeName
            FROM [${databaseName}].[dbo].[paym_employee_profile1]
              LEFT JOIN [${databaseName}].[dbo].[paym_Employee] ON paym_employee_profile1.pn_EmployeeID = paym_Employee.pn_EmployeeID
              LEFT JOIN [${databaseName}].[dbo].[paym_Category] ON paym_employee_profile1.pn_CategoryId = paym_Category.pn_CategoryID
              LEFT JOIN [${databaseName}].[dbo].[paym_Grade] ON paym_employee_profile1.pn_GradeID = paym_Grade.pn_GradeID
            WHERE paym_employee_profile1.pn_BranchID = ${branchId};
          `;
          const response = await postRequest(ServerConfig.url, REPORTS, {
            query,
          });
          if (response.status === 200) {
            setEmployees(response.data);
            await fetchEmployeeImages(response.data);
          }
        } catch (error) {
          console.error("Error fetching employees:", error);
        }
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await fetchEmployees();
      await fetchShiftPatterns(); // Fetch shift patterns
      await fetchExistingShiftData(); // Fetch existing shift data
      setLoading(false);
    };

    fetchData();
  }, [loggedBranch, refresh, selectedDate]); // Added refresh as a dependency and selectedDate

  const fetchEmployeeImages = async (employees) => {
    const employeeIds = employees
      .map((employee) => employee.pn_EmployeeID)
      .join(",");
    try {
      const query = `
        SELECT pn_EmployeeID, image_data
        FROM [${databaseName}].[dbo].[Paym_employee_profile1]
        WHERE pn_EmployeeID IN (${employeeIds});
      `;

      const response = await postRequest(ServerConfig.url, REPORTS, { query });

      if (response.status === 200) {
        const images = {};
        response.data.forEach((item) => {
          images[item.pn_EmployeeID] = item.image_data;
        });
        setEmployeeImages(images);
      }
    } catch (error) {
      console.error("Error fetching employee images:", error);
    }
  };

  const fetchShiftPatterns = async () => {
    try {
      const query = `SELECT pattern_code FROM [${databaseName}].[dbo].[shift_pattern];`;
      const response = await postRequest(ServerConfig.url, REPORTS, { query });

      if (response.status === 200) {
        setShiftPatterns(response.data);
      }
    } catch (error) {
      console.error("Error fetching shift patterns:", error);
    }
  };

  const fetchExistingShiftData = async () => {
    if (!selectedDate || loggedBranch.length === 0) {
      return;
    }

    const monthYear = new Date(selectedDate).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
    const branchId = loggedBranch[0].pn_BranchID;

    try {
      const query = `
      SELECT *
      FROM [${databaseName}].[dbo].[shift_month]
      WHERE monthyear = '${monthYear}' AND pn_BranchID = ${branchId} AND date = '${selectedDate}';
    `;
      const response = await postRequest(ServerConfig.url, REPORTS, { query });

      if (response.status === 200) {
        const shiftData = {};
        response.data.forEach((item) => {
          shiftData[item.pn_EmployeeCode] = item.Shift_PatternCode;
        });
        setExistingShiftData(shiftData);

        // Update employeeShiftPatterns with existing data
        const initialEmployeeShiftPatterns = {};
        const newEmployeeShiftCodes = {};
        const newEmployeeShiftDays = {};

        for (const employee of filteredEmployees) {
          const pattern = shiftData[employee.EmployeeCode];
          if (pattern) {
            initialEmployeeShiftPatterns[employee.pn_EmployeeID] = pattern;

            // Fetch shift codes and days for this pattern
            const codes = await fetchShiftCodes(pattern);
            newEmployeeShiftCodes[employee.pn_EmployeeID] = codes.shiftCodes;
            newEmployeeShiftDays[employee.pn_EmployeeID] = codes.days;
          }
        }

        setEmployeeShiftPatterns(initialEmployeeShiftPatterns);
        setEmployeeShiftCodes(newEmployeeShiftCodes);
        setEmployeeShiftDays(newEmployeeShiftDays);
      }
    } catch (error) {
      console.error("Error fetching existing shift data:", error);
    }
  };


  const getNextShiftPattern = (employeeCode, currentPattern) => {
    const availablePatterns = shiftPatterns.map((p) => p.pattern_code);
    if (!currentPattern || !availablePatterns.length) {
      return availablePatterns[0] || ""; // Return the first pattern if no current pattern or no available patterns
    }

    const currentIndex = availablePatterns.indexOf(currentPattern);
    const nextIndex = (currentIndex + 1) % availablePatterns.length;
    return availablePatterns[nextIndex];
  };

const handlesubmit = async () => {
  if (!selectedDate) {
    toast.dismiss();
    toast.error("Please select a date.", {
      position: "top-center",
      autoClose: 1000,
    });
    return;
  }

  const monthYear = new Date(selectedDate).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const selectedEmployeeEntries = filteredEmployees.filter(
    (employee) => selectedEmployees[employee.pn_EmployeeID]
  );

  if (selectedEmployeeEntries.length === 0) {
    toast.dismiss();
    toast.error("No employees selected for submission.", {
      position: "top-center",
      autoClose: 1000,
    });
    return;
  }

  const insertQueries = [];
  const updateQueries = [];

  for (const employee of selectedEmployeeEntries) {
    const employeeCode = employee.EmployeeCode;
    const employeeName = employee.Employee_Full_Name;
    const pn_CompanyID = employee.pn_CompanyID;
    const pn_BranchID = employee.pn_BranchID;

    let shiftPatternCode =
      employeeShiftPatterns[employee.pn_EmployeeID] || globalShiftPattern;

    if (!shiftPatternCode) {
      const lastShiftPattern = existingShiftData[employeeCode] || null;
      shiftPatternCode = getNextShiftPattern(employeeCode, lastShiftPattern);
    }

    if (existingShiftData[employeeCode]) {
      if (existingShiftData[employeeCode] !== shiftPatternCode) {
        updateQueries.push(`
          UPDATE [${databaseName}].[dbo].[shift_month]
          SET [Shift_PatternCode] = '${shiftPatternCode}'
          WHERE [pn_CompanyID] = ${pn_CompanyID}
            AND [pn_BranchID] = ${pn_BranchID}
            AND [pn_EmployeeCode] = '${employeeCode}'
            AND [monthyear] = '${monthYear}'
            AND [date] = '${selectedDate}';
        `);
      }
    } else {
      insertQueries.push(`
        INSERT INTO [${databaseName}].[dbo].[shift_month] 
        ([pn_CompanyID],[pn_BranchID],[pn_EmployeeCode],[pn_EmployeeName],[monthyear],[date],[Shift_PatternCode])
        VALUES (${pn_CompanyID}, ${pn_BranchID}, '${employeeCode}', '${employeeName}', '${monthYear}', '${selectedDate}', '${shiftPatternCode}');
      `);
    }
  }

  const allQueries = [...insertQueries, ...updateQueries].join(" ");

  if (!allQueries) {
    toast.dismiss();
    toast.error("No changes to save.", {
      position: "top-center",
      autoClose: 1000,
    });
    return;
  }

  try {
    toast.dismiss();
    const response = await postRequest(ServerConfig.url, SAVE, { query: allQueries });

    if (response.status === 200) {
      toast.info("Shift allocation saved successfully.", {
        position: "top-center",
        autoClose: 1000,
      });

      const updatedShiftData = { ...existingShiftData };
      const updatedEmployeeShiftPatterns = { ...employeeShiftPatterns };
      const updatedEmployeeShiftCodes = { ...employeeShiftCodes };
      const updatedEmployeeShiftDays = { ...employeeShiftDays };

      // 🔥 fetch shift codes & days for each saved employee
      for (const employee of selectedEmployeeEntries) {
        const shiftPattern =
          employeeShiftPatterns[employee.pn_EmployeeID] || globalShiftPattern;

        if (shiftPattern) {
          updatedShiftData[employee.EmployeeCode] = shiftPattern;
          updatedEmployeeShiftPatterns[employee.pn_EmployeeID] = shiftPattern;

          // query shift_pattern table
          const query = `
            SELECT shift_code1,days1,shift_code2,days2,shift_code3,days3,
                   shift_code4,days4,shift_code5,days5,shift_code6,days6,
                   shift_code7,days7
            FROM [${databaseName}].[dbo].[shift_pattern]
            WHERE pattern_code = '${shiftPattern}';
          `;

          const codesResp = await postRequest(ServerConfig.url, REPORTS, { query });

          if (codesResp && codesResp.data && codesResp.data.length > 0) {
            const patternRow = codesResp.data[0];
            const shiftCodes = [];
            const days = [];

            for (let i = 1; i <= 7; i++) {
              if (patternRow[`shift_code${i}`]) {
                shiftCodes.push(patternRow[`shift_code${i}`]);
                days.push(patternRow[`days${i}`]);
              }
            }

            updatedEmployeeShiftCodes[employee.pn_EmployeeID] = shiftCodes;
            updatedEmployeeShiftDays[employee.pn_EmployeeID] = days;
          }
        }
      }

      setExistingShiftData(updatedShiftData);
      setEmployeeShiftPatterns(updatedEmployeeShiftPatterns);
      setEmployeeShiftCodes(updatedEmployeeShiftCodes);
      setEmployeeShiftDays(updatedEmployeeShiftDays);

      setSelectedEmployees({});
      setGlobalShiftPattern("");
    } else {
      toast.dismiss();
      toast.error("Failed to save shift allocation.", {
        position: "top-center",
        autoClose: 1000,
      });
    }
  } catch (error) {
    toast.dismiss();
    console.error("Error saving shift allocation:", error);
    toast.error("An error occurred while saving shift allocation.", {
      position: "top-center",
      autoClose: 1000,
    });
  }
};


  if (loading) {
    return <CircularProgress />;
  }

  const getImageSrc = (imageData) => {
    return imageData ? `data:image/jpeg;base64,${imageData}` : nodata;
  };

  return (
    <Grid container style={{ backgroundColor: '#f5f5f5', }} justifyContent="center" alignItems="center">
      <Navbar />
      <Grid item xs={12} sx={{ display: "flex" }}>
        <Sidenav />
        <Grid item xs={12} sm={10} md={9} lg={8} xl={7} style={{ margin: "20px auto" }}>
          <AppBar position="static" sx={{ width: '100%', minHeight: "60px", marginTop: "100px" }}>
            <Toolbar sx={{ justifyContent: 'left', height: '100%' }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ textAlign: 'left', fontWeight: 'bold', color: 'white', lineHeight: '60px' }}
              >
                EMPLOYEE SHIFT ALLOCATION
              </Typography>
            </Toolbar>
          </AppBar>
          <Paper
            elevation={3}
            sx={{
              height: '650px',
              width: '100%',
              backgroundColor: '#fafafa',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
            }}>
            <Box display="flex" justifyContent="left" sx={{ mb: 3, mt: 3 }}>
              <FormControl sx={{ minWidth: 198, mr: 5 }}>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  label="Category"
                >
                  <MenuItem value="">
                    <em>All</em>
                  </MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat.pn_CategoryID} value={cat.v_CategoryName}>
                      {cat.v_CategoryName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>


              <FormControl sx={{ minWidth: 198, mr: 2 }}>
                <InputLabel id="grade-label">Grade</InputLabel>
                <Select
                  labelId="grade-label"
                  value={selectedGrade}
                  onChange={handleGradeChange}
                  label="Grade"
                >
                  <MenuItem value="">
                    <em>All</em>
                  </MenuItem>
                  {grades.map((grade) => (
                    <MenuItem key={grade.pn_GradeID} value={grade.v_GradeName}>
                      {grade.v_GradeName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>



              <FormControl sx={{ minWidth: 198, mr: 2 }}>
                <InputLabel id="shift-pattern-label">Shift Pattern</InputLabel>
                <Select
                  labelId="shift-pattern-label"
                  value={globalShiftPattern}
                  onChange={handleGlobalPatternChange}
                  label="Shift Pattern"   // <-- Important for proper label rendering
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {shiftPatterns.map((pattern) => (
                    <MenuItem
                      key={pattern.pattern_code}
                      value={pattern.pattern_code}
                    >
                      {pattern.pattern_code}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* New Date Field */}
              <FormControl sx={{ minWidth: 200, mr: 2 }}>
                <TextField
                  name="date"
                  type="date"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={selectedDate} // Ensure only the date is shown
                  onChange={handleDateChange}
                />
              </FormControl>
            </Box>

            {/* Render the calendar */}
            {/* <Box sx={{ mb: 3 }}>
            <Calendar
              onChange={setCalendarDate}
              value={calendarDate}
              view="month"
              tileDisabled={({ date }) =>
                date.getMonth() !== calendarDate.getMonth()
              } // Disable tiles not in the selected month
            />
          </Box> */}

            <Paper style={{ padding: "16px" }}>
              <TableContainer>
                <Table>
                  <TableHead style={{ backgroundColor: "#e3e3e3" }}>
                    <TableRow>
                      <TableCell>EMPLOYEE CODE</TableCell>
                      <TableCell>EMPLOYEE NAME</TableCell>
                      <TableCell>CATEGORY</TableCell>
                      <TableCell>GRADE</TableCell>
                      <TableCell>SHIFT PATTERN</TableCell>
                      <TableCell>SHIFT CODES</TableCell>{" "}
                      {/* New column for Shift Codes */}
                      <TableCell>DAYS</TableCell> {/* New column for Days */}
                      <TableCell>
                        <Checkbox
                          checked={selectAll}
                          onChange={handleSelectAll}
                        />
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {filteredEmployees.map((employee) => (
                      <TableRow key={employee.pn_EmployeeID}>
                        <TableCell>{employee.EmployeeCode}</TableCell>
                        <TableCell>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <Avatar
                              src={getImageSrc(
                                employeeImages[employee.pn_EmployeeID]
                              )}
                              alt="Employee Avatar"
                              style={{
                                width: 40,
                                height: 40,
                                marginRight: "10px",
                              }}
                            />
                            {employee.Employee_Full_Name}
                          </div>
                        </TableCell>
                        <TableCell>{employee.v_CategoryName}</TableCell>
                        <TableCell>{employee.v_GradeName}</TableCell>
 <TableCell>
                  <FormControl sx={{ minWidth: 180, marginTop: 0.5 }}>
                    <InputLabel 
                      id={`shift-pattern-label-${employee.pn_EmployeeID}`}
                      shrink={true} // This ensures the label doesn't overlap
                    >
                      Shift Pattern
                    </InputLabel>
                    <Select
                      labelId={`shift-pattern-label-${employee.pn_EmployeeID}`}
                      value={
                        employeeShiftPatterns[employee.pn_EmployeeID] ||
                        existingShiftData[employee.EmployeeCode] ||
                        globalShiftPattern ||
                        ""
                      }
                      onChange={(event) =>
                        handlePatternChange(event, employee.pn_EmployeeID)
                      }
                      label="Shift Pattern"
                      notched={true} // Works with shrink to prevent overlapping
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {shiftPatterns.map((pattern) => (
                        <MenuItem
                          key={pattern.pattern_code}
                          value={pattern.pattern_code}
                        >
                          {pattern.pattern_code}  {pattern.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                        <TableCell>
                          {/* Display Shift Codes */}
                          {employeeShiftCodes[employee.pn_EmployeeID]
                            ?.filter(
                              (code) =>
                                typeof code === "string" && code.trim() !== ""
                            ) // Ensure it's a string and not empty
                            .map((code, index) => (
                              <div key={index}>{code}</div>
                            ))}
                        </TableCell>
                        <TableCell>
                          {/* Display Days */}
                          {employeeShiftDays[employee.pn_EmployeeID]
                            ?.filter(
                              (day) => typeof day === "number" && !isNaN(day)
                            ) // Ensure it's a number and not NaN
                            .map((day, index) => (
                              <div key={index}>{day}</div>
                            ))}
                        </TableCell>

                        <TableCell>
                          <Checkbox
                            checked={!!selectedEmployees[employee.pn_EmployeeID]}
                            onChange={() =>
                              handleEmployeeSelect(employee.pn_EmployeeID)
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box mt={2} display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlesubmit}
                >
                  Submit Selection
                </Button>
              </Box>
            </Paper>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default EmployeeShiftAllocation;