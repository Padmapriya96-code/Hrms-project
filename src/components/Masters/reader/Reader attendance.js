import React, { useState, useEffect } from "react";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  AppBar,
  Toolbar,
  CircularProgress,
  Box,
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import Sidenav from "../../Home Page/Sidenav";
import Navbar from "../../Home Page/Navbar";
import { ServerConfig } from "../../../serverconfiguration/serverconfig";
import { REPORTS } from "../../../serverconfiguration/controllers";
import { postRequest } from "../../../serverconfiguration/requestcomp";
import { toast } from 'react-toastify';

const ReaderAttendance = () => {
  const [timecardData, setTimecardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedin, setLoggedin] = useState(sessionStorage.getItem("user"));
  const [loggedBranch, setLoggedBranch] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [activeFilters, setActiveFilters] = useState([]);
  const [filterOptions, setFilterOptions] = useState({});
  const [isFetchingOptions, setIsFetchingOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState([]);

  // Filter types with their corresponding database fields
  const filterTypes = [
    { label: "Employee Code", value: "emp_code", field: "emp_code" },
    { label: "Division", value: "division", field: "pn_DivisionId" },
    { label: "Department", value: "department", field: "pn_DepartmentId" },
    { label: "Designation", value: "designation", field: "pn_DesingnationId" },
    { label: "Grade", value: "grade", field: "pn_GradeId" },
    { label: "Shift", value: "shift", field: "pn_ShiftId" },
    { label: "Category", value: "category", field: "pn_CategoryId" },
    { label: "Level", value: "level", field: "pn_LevelID" },
  ];

  useEffect(() => {
    if (filteredData.length > 0) {
      const dateRange = getDateRangeFromData(filteredData);
      setFromDate(dateRange.minDate);
      setToDate(dateRange.maxDate);
      setEditableData([...filteredData]);
    }
  }, [filteredData]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const loggedBranchData = await postRequest(ServerConfig.url, REPORTS, {
          query: `SELECT * FROM paym_Branch WHERE Branch_User_Id = '${isLoggedin}'`,
        });

        if (loggedBranchData.data) {
          setLoggedBranch(loggedBranchData.data);
          fetchTimecardData(loggedBranchData.data[0].pn_BranchID);
        }
      } catch (error) {
        console.error("Error fetching branch data:", error);
      }
    };

    if (isLoggedin) {
      fetchInitialData();
    }
  }, [isLoggedin]);

  const fetchFilterOptions = async (filterType) => {
    setIsFetchingOptions(true);
    try {
      const selectedFilter = filterTypes.find((f) => f.value === filterType);
      if (!selectedFilter || !loggedBranch.length) return;

      let query = "";
      const companyId = loggedBranch[0].pn_CompanyID;
      const branchId = loggedBranch[0].pn_BranchID;

      switch (filterType) {
        case "emp_code":
          query = `
          SELECT DISTINCT 
            e.EmployeeCode AS id, 
            e.EmployeeCode AS name
          FROM 
            paym_Employee e
          JOIN 
            paym_employee_profile1 p ON e.pn_EmployeeID = p.pn_EmployeeID
          WHERE 
            p.pn_CompanyID = ${companyId} AND 
            p.pn_BranchID = ${branchId}
          ORDER BY 
            e.EmployeeCode`;
          break;
        case "division":
          query = `
          SELECT DISTINCT 
            divi.pn_DivisionID as id, 
            divi.v_DivisionName as name
          FROM 
            paym_Division divi
          WHERE 
            divi.pn_CompanyID = ${companyId} AND 
            divi.BranchID = ${branchId}
          ORDER BY 
            divi.v_DivisionName`;
          break;
        case "department":
          query = `
          SELECT DISTINCT 
            dep.pn_DepartmentID as id, 
            dep.v_DepartmentName as name
          FROM 
            paym_Department dep
          WHERE 
            dep.pn_CompanyID = ${companyId} AND 
            dep.pn_BranchID = ${branchId}
          ORDER BY 
            dep.v_DepartmentName`;
          break;
        case "designation":
          query = `
          SELECT DISTINCT 
            des.pn_DesignationID as id, 
            des.v_DesignationName as name
          FROM 
            paym_Designation des
          WHERE 
            des.pn_CompanyID = ${companyId} AND 
            des.BranchID = ${branchId}
          ORDER BY 
            des.v_DesignationName`;
          break;
        case "grade":
          query = `
          SELECT DISTINCT 
            gra.pn_GradeID as id, 
            gra.v_GradeName as name
          FROM 
            paym_Grade gra
          WHERE 
            gra.pn_CompanyID = ${companyId} AND 
            gra.BranchID = ${branchId}
          ORDER BY 
            gra.v_GradeName`;
          break;
        case "shift":
          query = `
          SELECT DISTINCT 
            shi.pn_ShiftID as id, 
            shi.shift_code as name
          FROM 
            paym_Shift shi
          WHERE 
            shi.pn_CompanyID = ${companyId} AND 
            shi.pn_branchid = ${branchId}
          ORDER BY 
            shi.shift_code`;
          break;
        case "category":
          query = `
          SELECT DISTINCT 
            cat.pn_CategoryID as id, 
            cat.v_CategoryName as name
          FROM 
            paym_Category cat
          WHERE 
            cat.pn_CompanyID = ${companyId} AND 
            cat.BranchID = ${branchId}
          ORDER BY 
            cat.v_CategoryName`;
          break;
        case "level":
          query = `
          SELECT DISTINCT 
            lev.pn_LevelID as id, 
            lev.v_LevelName as name
          FROM 
            paym_Level lev
          WHERE 
            lev.pn_CompanyID = ${companyId} AND 
            lev.BranchID = ${branchId}
          ORDER BY 
            lev.v_LevelName`;
          break;
        default:
          return;
      }

      const response = await postRequest(ServerConfig.url, REPORTS, { query });

      if (response.status === 200) {
        setFilterOptions((prev) => ({
          ...prev,
          [filterType]: response.data || [],
        }));
      }
    } catch (error) {
      console.error("Error fetching filter options:", error);
    } finally {
      setIsFetchingOptions(false);
    }
  };

  const handleAddFilter = (filterType) => {
    if (!activeFilters.includes(filterType)) {
      setActiveFilters([...activeFilters, filterType]);
      if (!filterOptions[filterType]) {
        fetchFilterOptions(filterType);
      }
    }
  };

  const handleRemoveFilter = (filterType) => {
    setActiveFilters(activeFilters.filter((f) => f !== filterType));
    setFilterOptions((prev) => {
      const newOptions = { ...prev };
      delete newOptions[filterType];
      return newOptions;
    });
  };

  const handleFilterValueChange = (filterType, value) => {
    setFilterOptions((prev) => ({
      ...prev,
      [filterType]: prev[filterType].map((opt) => ({
        ...opt,
        selected: opt.id === value,
      })),
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const fetchTimecardData = async (
    branchId,
    startDate = null,
    endDate = null
  ) => {
    setIsLoading(true);
    try {
      let dateCondition = "";
      if (startDate && endDate) {
        const formattedStart = formatDateForSQL(new Date(startDate));
        const formattedEnd = formatDateForSQL(new Date(endDate));
        dateCondition = `AND CONVERT(date, t.dates) BETWEEN '${formattedStart}' AND '${formattedEnd}'`;
      } else {
        const currentDate = new Date().toISOString().split("T")[0];
        dateCondition = `AND CONVERT(date, t.dates) = '${currentDate}'`;
      }

      // Build filter conditions from active filters
      let filterConditions = [];
      let joinConditions = "";

      // Only add the join if we have filters that require employee profile data
      if (
        activeFilters.some((filter) =>
          [
            "division",
            "department",
            "designation",
            "grade",
            "shift",
            "category",
            "level",
          ].includes(filter)
        )
      ) {
        joinConditions = `
        JOIN paym_employee_profile1 p ON t.pn_EmployeeID = p.pn_EmployeeID
        AND p.pn_CompanyID = ${loggedBranch[0]?.pn_CompanyID || 0}
        AND p.pn_BranchID = ${branchId}
      `;
      }

      activeFilters.forEach((filterType) => {
        const selectedFilter = filterTypes.find((f) => f.value === filterType);
        if (!selectedFilter) return;

        const selectedOption = filterOptions[filterType]?.find(
          (opt) => opt.selected
        );
        if (selectedOption) {
          // For employee code, filter directly on temptimecard table
          if (filterType === "emp_code") {
            filterConditions.push(
              `t.${selectedFilter.field} = '${selectedOption.id}'`
            );
          }
          // For other filters, use the employee profile table
          else {
            filterConditions.push(
              `p.${selectedFilter.field} = '${selectedOption.id}'`
            );
          }
        }
      });

      const filterCondition =
        filterConditions.length > 0
          ? `AND ${filterConditions.join(" AND ")}`
          : "";

      const query = `
      SELECT 
        t.pn_companyid,
        t.pn_branchid,
        t.emp_code,
        t.emp_name,
        t.shift_code,
        CONVERT(varchar, t.dates, 23) as dates,
        t.days,
        CONVERT(varchar, t.intime, 8) as intime,
        CONVERT(varchar, t.break_out, 8) as break_out,
        CONVERT(varchar, t.break_in, 8) as break_in,
        CONVERT(varchar, t.outtime, 8) as outtime,
        CONVERT(varchar, t.Late_in, 8) as late_in,
        CONVERT(varchar, t.Late_out, 8) as late_out,
        CONVERT(varchar, t.early_out, 8) as early_out,
        CONVERT(varchar, t.ot_hrs, 8) as ot_hrs,
        t.leave_code,
        t.status,
        t.data,
        t.pn_EmployeeID,
        t.flag
      FROM 
        temptimecard t
      ${joinConditions}
      WHERE 
        t.pn_branchid = ${branchId}
        ${dateCondition}
        ${filterCondition}
      ORDER BY 
        t.dates DESC, t.emp_name ASC;
    `;

      const response = await postRequest(ServerConfig.url, REPORTS, { query });

      if (response.status === 200) {
        const processedData = response.data.map((item) => {
          const newItem = {};
          Object.keys(item).forEach((key) => {
            newItem[key] =
              item[key] === null ||
              item[key] === undefined ||
              (typeof item[key] === "object" &&
                Object.keys(item[key]).length === 0)
                ? ""
                : key === "dates"
                ? formatDate(item[key])
                : item[key];
          });
          return newItem;
        });
        setTimecardData(processedData);
        setFilteredData(processedData);
      } else {
        console.error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching timecard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateForSQL = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleFilter = () => {
    if (loggedBranch.length === 0) return;
    fetchTimecardData(loggedBranch[0].pn_BranchID, fromDate, toDate);
  };

  const handleReset = () => {
    setActiveFilters([]);
    setFilterOptions({});
    setFromDate("");
    setToDate("");
    if (loggedBranch.length > 0) {
      fetchTimecardData(loggedBranch[0].pn_BranchID);
    }
  };

  const renderCellContent = (value) => {
    if (value === null || value === undefined) return "";
    if (typeof value === "object" && Object.keys(value).length === 0) return "";
    return String(value);
  };

  const getDateRangeFromData = (data) => {
    if (!data || data.length === 0) return { minDate: "", maxDate: "" };

    const dates = data
      .map((item) => item.dates)
      .filter((date) => date)
      .map((dateStr) => {
        const [day, month, year] = dateStr.split("-");
        return new Date(`${year}-${month}-${day}`);
      });

    if (dates.length === 0) return { minDate: "", maxDate: "" };

    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    return {
      minDate: minDate.toISOString().split("T")[0],
      maxDate: maxDate.toISOString().split("T")[0],
    };
  };

  const getSelectedValue = (filterType) => {
    if (!filterOptions[filterType]) return "";
    const selectedOption = filterOptions[filterType].find(
      (opt) => opt.selected
    );
    return selectedOption ? selectedOption.id : "";
  };

  const handleModify = () => {
    setIsEditing(true);
  };

  const handleSaveAll = async () => {
    setIsLoading(true);
    try {
      // Check for duplicate entries (same employee and same date)
      const duplicateEntries = editableData.reduce((acc, row, index) => {
        const existingIndex = editableData.findIndex(
          (r, i) =>
            i < index && r.emp_code === row.emp_code && r.dates === row.dates
        );
        if (existingIndex >= 0) {
          acc.push({
            index,
            empCode: row.emp_code,
            date: row.dates,
            existingIndex,
          });
        }
        return acc;
      }, []);

      if (duplicateEntries.length > 0) {
        const duplicateMessage = duplicateEntries
          .map(
            (dup) =>
              `Row ${dup.index + 1}: Employee ${dup.empCode} on ${
                dup.date
              } duplicates row ${dup.existingIndex + 1}`
          )
          .join("\n");
        alert(`Duplicate entries found:\n${duplicateMessage}`);
        setIsLoading(false);
        return;
      }

      // First, check if records already exist in time_card for these dates/employees
      const checkQuery = `
      SELECT emp_code, CONVERT(varchar, dates, 23) as date_str 
      FROM time_card 
      WHERE pn_branchid = ${loggedBranch[0].pn_BranchID}
      AND (
        ${editableData
          .map((row) => {
            const [day, month, year] = row.dates.split("-");
            const sqlDate = `${year}-${month}-${day}`;
            return `(emp_code = '${row.emp_code.replace(
              /'/g,
              "''"
            )}' AND dates = '${sqlDate}')`;
          })
          .join(" OR ")}
      )
    `;

      const checkResponse = await postRequest(ServerConfig.url, REPORTS, {
        query: checkQuery,
      });

      if (checkResponse.data && checkResponse.data.length > 0) {
        const existingRecords = checkResponse.data
          .map((r) => `Employee ${r.emp_code} on ${formatDate(r.date_str)}`)
          .join("\n");
        const shouldProceed = window.confirm(
          `The following records already exist in the database:\n${existingRecords}\n\nDo you want to overwrite them?`
        );
        if (!shouldProceed) {
          setIsLoading(false);
          return;
        }
      }

      // Prepare the queries
      const queries = [];

      // For each row, create an INSERT or UPDATE query for time_card
      editableData.forEach((row) => {
        const [day, month, year] = row.dates.split("-");
        const sqlDate = `${year}-${month}-${day}`;

        const escapeSql = (str) => {
          if (!str) return "NULL";
          return `'${str.replace(/'/g, "''")}'`;
        };

        // Format time fields properly (HH:MM:SS)
        const formatTime = (timeStr) => {
          if (!timeStr) return "NULL";
          if (timeStr.length === 5) return `'${timeStr}:00'`; // Convert HH:MM to HH:MM:SS
          return `'${timeStr}'`;
        };

        queries.push(`
        MERGE INTO time_card AS target
        USING (VALUES (
          ${row.pn_companyid}, 
          ${row.pn_branchid}, 
          ${escapeSql(row.emp_code)}, 
          ${escapeSql(row.emp_name)}, 
          ${escapeSql(row.shift_code)}, 
          '${sqlDate}', 
          ${escapeSql(row.days)}, 
          ${formatTime(row.intime)}, 
          ${formatTime(row.break_out)}, 
          ${formatTime(row.break_in)}, 
          ${formatTime(row.early_out)}, 
          ${formatTime(row.outtime)}, 
          ${formatTime(row.late_in)}, 
          ${formatTime(row.late_out)}, 
          ${formatTime(row.ot_hrs)}, 
          ${escapeSql(row.status)}, 
          ${escapeSql(row.leave_code)}, 
          ${escapeSql(row.data)}, 
          ${escapeSql(row.pn_EmployeeID)}, 
          ${escapeSql(row.flag)}
        )) AS source (
          pn_companyid, pn_branchid, emp_code, emp_name, 
          shift_code, dates, days, intime, break_out, 
          break_in, early_out, outtime, Late_in, Late_out, 
          ot_hrs, status, leave_code, data, pn_EmployeeID, flag
        )
        ON target.pn_branchid = source.pn_branchid 
          AND target.emp_code = source.emp_code 
          AND target.dates = source.dates
        WHEN MATCHED THEN
          UPDATE SET
            intime = source.intime,
            break_out = source.break_out,
            break_in = source.break_in,
            outtime = source.outtime,
            Late_in = source.Late_in,
            Late_out = source.Late_out,
            early_out = source.early_out,
            ot_hrs = source.ot_hrs,
            status = source.status,
            leave_code = source.leave_code,
            flag = source.flag
        WHEN NOT MATCHED THEN
          INSERT (
            pn_companyid, pn_branchid, emp_code, emp_name, 
            shift_code, dates, days, intime, break_out, 
            break_in, early_out, outtime, Late_in, Late_out, 
            ot_hrs, status, leave_code, data, pn_EmployeeID, flag
          )
          VALUES (
            source.pn_companyid, source.pn_branchid, source.emp_code, source.emp_name, 
            source.shift_code, source.dates, source.days, source.intime, source.break_out, 
            source.break_in, source.early_out, source.outtime, source.Late_in, source.Late_out, 
            source.ot_hrs, source.status, source.leave_code, source.data, source.pn_EmployeeID, source.flag
          );
      `);
      });

      // Also update the temptimecard table
      editableData.forEach((row) => {
        const [day, month, year] = row.dates.split("-");
        const sqlDate = `${year}-${month}-${day}`;

        const escapeSql = (str) => {
          if (!str) return "NULL";
          return `'${str.replace(/'/g, "''")}'`;
        };

        const formatTime = (timeStr) => {
          if (!timeStr) return "NULL";
          if (timeStr.length === 5) return `'${timeStr}:00'`;
          return `'${timeStr}'`;
        };

        queries.push(`
        UPDATE temptimecard SET
          intime = ${formatTime(row.intime)},
          break_out = ${formatTime(row.break_out)},
          break_in = ${formatTime(row.break_in)},
          outtime = ${formatTime(row.outtime)},
          Late_in = ${formatTime(row.late_in)},
          Late_out = ${formatTime(row.late_out)},
          early_out = ${formatTime(row.early_out)},
          ot_hrs = ${formatTime(row.ot_hrs)},
          status = ${escapeSql(row.status)},
          leave_code = ${escapeSql(row.leave_code)}
        WHERE 
          pn_companyid = ${row.pn_companyid} AND 
          pn_branchid = ${row.pn_branchid} AND 
          emp_code = ${escapeSql(row.emp_code)} AND 
          dates = '${sqlDate}'
      `);
      });

      // Execute all queries in a transaction
      const transactionQuery = `
      BEGIN TRANSACTION;
      BEGIN TRY
        ${queries.join("\n")}
        COMMIT TRANSACTION;
        SELECT 'Success' AS Result;
      END TRY
      BEGIN CATCH
        ROLLBACK TRANSACTION;
        SELECT ERROR_MESSAGE() AS ErrorMessage;
      END CATCH
    `;

      const response = await postRequest(ServerConfig.url, REPORTS, {
        query: transactionQuery,
      });

      if (
        response.data &&
        response.data[0] &&
        response.data[0].Result === "Success"
      ) {
        // Refresh the data
        if (loggedBranch.length > 0) {
          await fetchTimecardData(
            loggedBranch[0].pn_BranchID,
            fromDate,
            toDate
          );
        }
        setIsEditing(false);
        alert("Data saved successfully!");
      } else {
        const errorMessage =
          response.data && response.data[0]
            ? response.data[0].ErrorMessage
            : "Unknown error occurred";
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert(`Failed to save data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditableData([...filteredData]);
  };

  const handleCellChange = (index, field, value) => {
    const newData = [...editableData];
    newData[index] = {
      ...newData[index],
      [field]: value,
    };
    setEditableData(newData);
  };

  const renderEditableCell = (index, field, value) => {
    if (!isEditing) {
      return renderCellContent(value);
    }

    // For time fields, use time input
    if (
      [
        "intime",
        "break_out",
        "break_in",
        "outtime",
        "late_in",
        "late_out",
        "early_out",
        "ot_hrs",
      ].includes(field)
    ) {
      return (
        <input
          type="time"
          value={value || ""}
          onChange={(e) => handleCellChange(index, field, e.target.value)}
          style={{ border: "1px solid #ccc", padding: "5px", width: "100%" }}
        />
      );
    }

    // For status and leave_code, use dropdown
    if (field === "status") {
      return (
        <select
          value={value || ""}
          onChange={(e) => handleCellChange(index, field, e.target.value)}
          style={{ border: "1px solid #ccc", padding: "5px", width: "100%" }}
        >
          <option value="">Select Status</option>
          <option value="P">Present (P)</option>
          <option value="A">Absent (A)</option>
          <option value="L">Leave (L)</option>
          <option value="H">Holiday (H)</option>
        </select>
      );
    }

    if (field === "leave_code") {
      return (
        <select
          value={value || ""}
          onChange={(e) => handleCellChange(index, field, e.target.value)}
          style={{ border: "1px solid #ccc", padding: "5px", width: "100%" }}
        >
          <option value="">No Leave</option>
          <option value="CL">Casual Leave (CL)</option>
          <option value="SL">Sick Leave (SL)</option>
          <option value="PL">Privilege Leave (PL)</option>
          <option value="ML">Maternity Leave (ML)</option>
        </select>
      );
    }

    // For other fields, use text input
    return (
      <input
        type="text"
        value={value || ""}
        onChange={(e) => handleCellChange(index, field, e.target.value)}
        style={{ border: "1px solid #ccc", padding: "5px", width: "100%" }}
      />
    );
  };

  return (
    <Grid container sx={{ backgroundColor: "#f5f5f5" }}>
      <Navbar />
      <Grid item xs={12} sx={{ display: "flex" }}>
        <Sidenav />
        <Grid
          item
          xs={12}
          sm={10}
          md={9}
          lg={11}
          xl={7}
          sx={{ margin: "100px 50px 50px 50px" }}
        >
          <AppBar
            position="static"
            sx={{
              width: "100%",
              marginTop: "10px",
              minHeight: "60px",
              backgroundColor: "#1976d2",
            }}
          >
            <Toolbar sx={{ justifyContent: "left", height: "100%" }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  textAlign: "left",
                  fontWeight: "bold",
                  color: "white",
                  lineHeight: "60px",
                }}
              >
                READER ATTENDANCE
              </Typography>
            </Toolbar>
          </AppBar>

          <Paper elevation={3} sx={{ padding: 2 }}>
            <Stack direction="column" spacing={2} sx={{ mb: 3 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <FormControl sx={{ minWidth: 150 }} size="small">
                  <InputLabel>Add Filter</InputLabel>
                  <Select
                    value=""
                    label="Add Filter"
                    onChange={(e) => handleAddFilter(e.target.value)}
                  >
                    {filterTypes
                      .filter((type) => !activeFilters.includes(type.value))
                      .map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 90 }}>
                  <TextField
                    name="fromDate"
                    type="date"
                    variant="outlined"
                    fullWidth
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    label="From Date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    inputProps={{
                      max: toDate || undefined,
                    }}
                  />
                </FormControl>
                <FormControl sx={{ minWidth: 90 }}>
                  <TextField
                    name="toDate"
                    type="date"
                    variant="outlined"
                    fullWidth
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    label="To Date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    inputProps={{
                      min: fromDate || undefined,
                    }}
                  />
                </FormControl>
                <Button
                  variant="contained"
                  onClick={handleFilter}
                  disabled={!fromDate || !toDate}
                >
                  Filter
                </Button>
                <Button variant="outlined" onClick={handleReset}>
                  Reset
                </Button>
                {!isEditing ? (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleModify}
                  >
                    Modify
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSaveAll}
                    >
                      Save All
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </Stack>

              {activeFilters.length > 0 && (
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  {activeFilters.map((filterType) => {
                    const filterLabel = filterTypes.find(
                      (f) => f.value === filterType
                    )?.label;
                    return (
                      <Stack
                        key={filterType}
                        direction="row"
                        spacing={1}
                        alignItems="center"
                      >
                        <Chip
                          label={filterLabel}
                          onDelete={() => handleRemoveFilter(filterType)}
                        />
                        <FormControl sx={{ minWidth: 150 }} size="small">
                          <InputLabel>{filterLabel}</InputLabel>
                          <Select
                            value={getSelectedValue(filterType)}
                            label={filterLabel}
                            onChange={(e) =>
                              handleFilterValueChange(
                                filterType,
                                e.target.value
                              )
                            }
                            disabled={isFetchingOptions}
                          >
                            {filterOptions[filterType]?.map((option) => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Stack>
                    );
                  })}
                </Stack>
              )}
            </Stack>

            {isLoading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="200px"
              >
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#1976d2" }}>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        Emp Code
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        Emp Name
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        Shift Code
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "white",
                          fontWeight: "bold",
                          width: "110px",
                        }}
                      >
                        Date
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        Day
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        In Time
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        Break Out
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        Break In
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        Out Time
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        Late In
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        Late Out
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        Early Out
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        OT Hours
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        Leave Code
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        Status
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {editableData.length > 0 ? (
                      editableData.map((row, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:nth-of-type(odd)": {
                              backgroundColor: "#f5f5f5",
                            },
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell>{row.emp_code}</TableCell>
                          <TableCell>{row.emp_name}</TableCell>
                          <TableCell>{row.shift_code}</TableCell>
                          <TableCell>{row.dates}</TableCell>
                          <TableCell>{row.days}</TableCell>
                          <TableCell>
                            {renderEditableCell(index, "intime", row.intime)}
                          </TableCell>
                          <TableCell>
                            {renderEditableCell(
                              index,
                              "break_out",
                              row.break_out
                            )}
                          </TableCell>
                          <TableCell>
                            {renderEditableCell(
                              index,
                              "break_in",
                              row.break_in
                            )}
                          </TableCell>
                          <TableCell>
                            {renderEditableCell(index, "outtime", row.outtime)}
                          </TableCell>
                          <TableCell>
                            {renderEditableCell(index, "late_in", row.late_in)}
                          </TableCell>
                          <TableCell>
                            {renderEditableCell(
                              index,
                              "late_out",
                              row.late_out
                            )}
                          </TableCell>
                          <TableCell>
                            {renderEditableCell(
                              index,
                              "early_out",
                              row.early_out
                            )}
                          </TableCell>
                          <TableCell>
                            {renderEditableCell(index, "ot_hrs", row.ot_hrs)}
                          </TableCell>
                          <TableCell>
                            {renderEditableCell(
                              index,
                              "leave_code",
                              row.leave_code
                            )}
                          </TableCell>
                          <TableCell>
                            {renderEditableCell(index, "status", row.status)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={15} align="center">
                          No records found for selected filters
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ReaderAttendance;
