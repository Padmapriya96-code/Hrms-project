import React, { useState, useEffect } from "react";
import {
  Grid,
  Button,
  IconButton,
  Box,
  CircularProgress,
  Typography,
  AppBar,
  Toolbar,
  Select,
  Paper,
  MenuItem,
} from "@mui/material";
import Sidenav from "../../Home Page/Sidenav";
import Navbar from "../../Home Page/Navbar";
import DeleteIcon from "@mui/icons-material/Delete";
import { ServerConfig } from "../../../serverconfiguration/serverconfig";
import { REPORTS } from "../../../serverconfiguration/controllers";
import { postRequest } from "../../../serverconfiguration/requestcomp";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { toast } from "react-toastify";

const ManualAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedin, setLoggedin] = useState(sessionStorage.getItem("user"));
  const [loggedBranch, setLoggedBranch] = useState([]);
  const [shiftOptions, setShiftOptions] = useState([]);
  const [commonShiftCode, setCommonShiftCode] = useState(""); // State for common shift code
  const [commonShiftDetails, setCommonShiftDetails] = useState({}); // State for common shift details
  const [modifiedRows, setModifiedRows] = useState({});
  const [leaveOptions, setLeaveOptions] = useState([]);
  const databaseName = sessionStorage.getItem("databaseName");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const loggedBranchData = await postRequest(ServerConfig.url, REPORTS, {
          query: `SELECT * 
FROM [${databaseName}].[dbo].[paym_Branch]
WHERE Branch_User_Id = '${isLoggedin}'
`,
        });

        if (loggedBranchData.data) {
          setLoggedBranch(loggedBranchData.data);
          const branchId = loggedBranchData.data[0].pn_BranchID;

          // 🔄 Try fetching saved attendance first
          const savedQuery = `
          SELECT 
            [pn_companyid],
            [pn_branchid],
            emp_code AS emp_code,
            emp_name AS emp_name,
            [shift_code],
            [dates],
            [days],
            [intime],
            [break_out],
            [break_in],
            [early_out],
            [outtime],
            [Late_in],
            [Late_out],
            [ot_hrs],
            [status],
            [leave_code],
            [pn_EmployeeID],
            [flag]
          FROM [${databaseName}].[dbo].[time_card]
          WHERE pn_branchid = ${branchId}
            AND dates = CONVERT(date, GETDATE()); -- fetch today's saved data
        `;

          const savedResponse = await postRequest(ServerConfig.url, REPORTS, {
            query: savedQuery,
          });

          if (savedResponse.status === 200 && savedResponse.data.length > 0) {
            // ✅ Show saved attendance if it exists
            setAttendanceData(savedResponse.data);
          } else {
            // 🚨 No saved data → load employee list
            fetchEmployees(branchId);
          }

          // Load shifts & leaves (🔑 pass branchId)
          fetchShifts(branchId);
          fetchLeaves(branchId);
        }
      } catch (error) {
        console.error("Error fetching branch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoggedin) {
      fetchInitialData();
    }
  }, [isLoggedin]);

  const fetchLeaves = async (branchId) => {
    try {
      const query = `
      SELECT [pn_leaveID], [pn_leaveCode]
      FROM [${databaseName}].[dbo].[paym_leave]
      WHERE [pn_BranchID] = ${branchId} AND [status] = 'Active';
    `;
      const response = await postRequest(ServerConfig.url, REPORTS, { query });
      if (response.status === 200) setLeaveOptions(response.data);
    } catch (error) {
      console.error("Error fetching leave codes:", error);
    }
  };

  // const fetchEmployees = async (branchId) => {
  //   setIsLoading(true);
  //   try {
  //     const query = `
  //   SELECT
  //     paym_Employee.Employee_Full_Name AS [Employee Name],
  //     paym_Employee.pn_EmployeeID AS [Employee ID],
  //     paym_Employee.EmployeeCode AS [EmployeeCode]
  //   FROM
  //     paym_employee_profile1
  //   LEFT JOIN paym_Employee ON paym_employee_profile1.pn_EmployeeID = paym_Employee.pn_EmployeeID
  //   WHERE
  //     paym_employee_profile1.pn_BranchID = ${branchId};
  //   `;

  //     const response = await postRequest(ServerConfig.url, REPORTS, { query });

  //     if (response.status === 200) {
  //       const currentDate = new Date();
  //       const options = { weekday: "long" };
  //       const currentDay = currentDate.toLocaleDateString("en-US", options);

  //       const employees = response.data.map((employee) => ({
  //         emp_code: employee["EmployeeCode"],
  //         emp_name: employee["Employee Name"],
  //         shift_code: "",
  //         dates: currentDate.toISOString().split("T")[0],
  //         days: currentDay,
  //         intime: "",
  //         break_out: "",
  //         break_in: "",
  //         early_out: "",
  //         outtime: "",
  //         Late_in: "",
  //         Late_out: "",
  //         ot_hrs: "",
  //         status: "",
  //         leave_code: "",
  //       }));
  //       setAttendanceData(employees);
  //       fetchShifts(branchId); // Pass the branchId to fetchShifts
  //     } else {
  //       console.error(`Unexpected response status: ${response.status}`);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching employees data:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const fetchEmployees = async (branchId) => {
    setIsLoading(true);
    try {
      const query = `
      SELECT 
        E.Employee_Full_Name AS [Employee Name],
        E.pn_EmployeeID AS [Employee ID],
        E.EmployeeCode AS [EmployeeCode],
        S.shift_code AS [ShiftCode]  -- ✅ fetch from Shift master
      FROM [${databaseName}].[dbo].[paym_employee_profile1] P
      LEFT JOIN [${databaseName}].[dbo].[paym_Employee] E ON P.pn_EmployeeID = E.pn_EmployeeID
      LEFT JOIN [${databaseName}].[dbo].[paym_Shift] S ON P.pn_ShiftId = S.pn_ShiftID  -- ✅ join with Shift table
      WHERE 
        P.pn_BranchID = ${branchId};
    `;

      const response = await postRequest(ServerConfig.url, REPORTS, { query });

      if (response.status === 200) {
        const currentDate = new Date();
        const options = { weekday: "long" };
        const currentDay = currentDate.toLocaleDateString("en-US", options);

        const employees = response.data.map((employee) => ({
          emp_code: employee["EmployeeCode"],
          emp_name: employee["Employee Name"],
          pn_EmployeeID: employee["Employee ID"],
          shift_code: employee["ShiftCode"] || "", // ✅ now prefill shift code
          dates: currentDate.toISOString().split("T")[0],
          days: currentDay,
          intime: "",
          break_out: "",
          break_in: "",
          early_out: "",
          outtime: "",
          Late_in: "",
          Late_out: "",
          ot_hrs: "",
          status: "",
          leave_code: "",
        }));

        // setAttendanceData(employees);

        // // Prefetch shift options so the grid can use them
        // fetchShifts(branchId);

        // Prefetch shift options first
        await fetchShifts(branchId);

        // ✅ Now map through employees and load their respective shift timings
        // const employeesWithTiming = employees.map((emp) => {
        //   const shift = shiftOptions.find(
        //     (s) => s.shift_code === emp.shift_code
        //   );
        //   if (shift) {
        //     return {
        //       ...emp,
        //       intime: shift.start_time || "",
        //       break_out: shift.break_time_out || "",
        //       break_in: shift.break_time_in || "",
        //       outtime: shift.end_time || "",
        //     };
        //   }
        //   return emp;
        // });

        // setAttendanceData(employeesWithTiming);
        const shifts = await fetchShifts(branchId);
        const employeesWithTiming = employees.map((emp) => {
          const shift = shifts.find((s) => s.shift_code === emp.shift_code);
          return shift
            ? {
                ...emp,
                intime: shift.start_time,
                break_out: shift.break_time_out,
                break_in: shift.break_time_in,
                outtime: shift.end_time,
              }
            : emp;
        });
        setAttendanceData(employeesWithTiming);
      } else {
        console.error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching employees data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // const fetchShifts = async (branchId) => {
  //   try {
  //     const query = `
  //   SELECT
  //     [pn_CompanyID],
  //     [pn_branchid],
  //     [pn_ShiftID],
  //     [shift_code],
  //     [start_time],
  //     [break_time_out],
  //     [break_time_in],
  //     [end_time],
  //     [shift_indicator],
  //     [Shift_Type]
  //   FROM
  //     [dbo].[paym_Shift]
  //   WHERE
  //     [pn_branchid] = ${branchId};
  //   `;

  //     const response = await postRequest(ServerConfig.url, REPORTS, { query });

  //     if (response.status === 200) {
  //       setShiftOptions(response.data);
  //     } else {
  //       console.error(`Unexpected response status: ${response.status}`);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching shift data:", error);
  //   }
  // };

  const fetchShifts = async (branchId) => {
    try {
      const query = `
      SELECT 
        [pn_CompanyID],
        [pn_branchid],
        [pn_ShiftID],
        [shift_code],
        [start_time],
        [break_time_out],
        [break_time_in],
        [end_time],
        [shift_indicator],
        [Shift_Type]
      FROM [${databaseName}].[dbo].[paym_Shift]
      WHERE [pn_branchid] = ${branchId};
    `;
      const response = await postRequest(ServerConfig.url, REPORTS, { query });

      if (response.status === 200) {
        setShiftOptions(response.data);
        return response.data; // ✅ return shift list
      } else {
        console.error(`Unexpected response status: ${response.status}`);
        return [];
      }
    } catch (error) {
      console.error("Error fetching shift data:", error);
      return [];
    }
  };

  const handleCommonShiftChange = (event) => {
    const selectedShiftCode = event.target.value;
    setCommonShiftCode(selectedShiftCode);

    // Find the selected shift details
    const selectedShift = shiftOptions.find(
      (shift) => shift.shift_code === selectedShiftCode
    );
    if (selectedShift) {
      setCommonShiftDetails(selectedShift); // Store the selected shift details

      // Update all rows with the selected common shift code and timings
      const updatedData = attendanceData.map((item) => ({
        ...item,
        shift_code: selectedShiftCode,
        intime: selectedShift.start_time,
        break_out: selectedShift.break_time_out,
        break_in: selectedShift.break_time_in,
        outtime: selectedShift.end_time,
      }));
      setAttendanceData(updatedData);
    }
  };

  const handleDelete = (index) => {
    const newData = attendanceData.filter((_, i) => i !== index);
    setAttendanceData(newData);
  };

  const handleReset = () => {
    setAttendanceData(
      attendanceData.map((item) => ({
        ...item,
        shift_code: "",
        dates: "",
        days: "",
        intime: "",
        break_out: "",
        break_in: "",
        early_out: "",
        outtime: "",
        Late_in: "",
        Late_out: "",
        ot_hrs: "",
        status: "",
        leave_code: "",
      }))
    );
  };

  const handleUpdate = async () => {
    try {
      toast.dismiss();

      for (const rowId in modifiedRows) {
        const entry = modifiedRows[rowId];
        const query = `
        UPDATE [${databaseName}].[dbo].[time_card]
        SET 
          shift_code = '${entry.shift_code}',
          intime = '${entry.intime}',
          break_out = '${entry.break_out}',
          break_in = '${entry.break_in}',
          early_out = '${entry.early_out}',
          outtime = '${entry.outtime}',
          Late_in = '${entry.Late_in}',
          Late_out = '${entry.Late_out}',
          ot_hrs = '${entry.ot_hrs}',
          status = '${statusMapSave[entry.status] || entry.status}',
          leave_code = '${entry.leave_code}'
        WHERE emp_code = '${entry.emp_code}' 
          AND dates = '${entry.dates}'
          AND pn_branchid = ${loggedBranch[0]?.pn_BranchID};
      `;

        await postRequest(ServerConfig.url, REPORTS, { query });
      }

      setModifiedRows({}); // clear modified rows

      toast.success("Attendance updated successfully", {
        position: "top-center",
        autoClose: 1000,
      });
      await fetchSavedAttendance(loggedBranch[0]?.pn_BranchID);
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update attendance", {
        position: "top-center",
        autoClose: 1000,
      });
    }
  };

  // New function: fetch saved attendance from DB
  const fetchSavedAttendance = async (branchId) => {
    try {
      const query = `
      SELECT 
        [pn_companyid],
        [pn_branchid],
        [emp_code],
        [emp_name],
        [shift_code],
        CONVERT(varchar(10), [dates], 23) AS [dates], -- YYYY-MM-DD
        [days],
        CONVERT(varchar(5), [intime], 108) AS [intime], -- HH:MM
        CONVERT(varchar(5), [break_out], 108) AS [break_out],
        CONVERT(varchar(5), [break_in], 108) AS [break_in],
        CONVERT(varchar(5), [early_out], 108) AS [early_out],
        CONVERT(varchar(5), [outtime], 108) AS [outtime],
        CONVERT(varchar(5), [Late_in], 108) AS [Late_in],
        CONVERT(varchar(5), [Late_out], 108) AS [Late_out],
        CONVERT(varchar(5), [ot_hrs], 108) AS [ot_hrs], -- ✅ fix overtime display
        [status],
        [leave_code],
        [pn_EmployeeID],
        [flag]
      FROM [${databaseName}].[dbo].[time_card]
      WHERE pn_branchid = ${branchId}
        AND dates = CONVERT(date, GETDATE());
    `;

      const response = await postRequest(ServerConfig.url, REPORTS, { query });

      if (response.status === 200) {
        setAttendanceData(response.data);
      } else {
        console.error("Error fetching saved attendance:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching saved attendance:", error);
    }
  };

  const handleSave = async () => {
    const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    for (const entry of attendanceData) {
      const dataToSave = {
        pn_companyid: loggedBranch[0]?.pn_CompanyID,
        pn_branchid: loggedBranch[0]?.pn_BranchID,
        emp_code: entry.emp_code,
        emp_name: entry.emp_name,
        shift_code: entry.shift_code,
        dates: currentDate, // ✅ Always today's date
        days: new Date().toLocaleDateString("en-US", { weekday: "long" }),
        intime: entry.intime,
        break_out: entry.break_out,
        break_in: entry.break_in,
        early_out: entry.early_out,
        outtime: entry.outtime,
        Late_in: entry.Late_in,
        Late_out: entry.Late_out,
        ot_hrs: entry.ot_hrs,
        status: statusMapSave[entry.status] || entry.status,
        leave_code: entry.leave_code,
        data: "Y",
        pn_EmployeeID: entry.pn_EmployeeID,
        flag: "N",
        pn_EmployeeID: entry.pn_EmployeeID,
      };

      try {
        const query = `
        IF NOT EXISTS (
          SELECT 1 FROM [${databaseName}].[dbo].[time_card] 
          WHERE emp_code = '${dataToSave.emp_code}' 
            AND dates = CONVERT(date, GETDATE()) -- ✅ Always match today
        )
        BEGIN
          INSERT INTO [${databaseName}].[dbo].[time_card]
            ([pn_companyid],[pn_branchid],[emp_code],[emp_name],[shift_code],
             [dates],[days],[intime],[break_out],[break_in],[early_out],[outtime],
             [Late_in],[Late_out],[ot_hrs],[status],[leave_code],[data],[pn_EmployeeID],[flag])
          VALUES
            (${dataToSave.pn_companyid}, ${dataToSave.pn_branchid}, '${dataToSave.emp_code}', 
            '${dataToSave.emp_name}', '${dataToSave.shift_code}', CONVERT(date, GETDATE()), -- ✅ Save today
            '${dataToSave.days}', CAST('${dataToSave.intime}' AS TIME), '${dataToSave.break_out}', 
            '${dataToSave.break_in}', '${dataToSave.early_out}', '${dataToSave.outtime}', 
            '${dataToSave.Late_in}', '${dataToSave.Late_out}', '${dataToSave.ot_hrs}', 
            '${dataToSave.status}', '${dataToSave.leave_code}', '${dataToSave.data}', 
            '${dataToSave.pn_EmployeeID}', '${dataToSave.flag}');
        END
      `;

        await postRequest(ServerConfig.url, REPORTS, { query });
      } catch (error) {
        toast.dismiss();
        toast.error("Error saving attendance data: " + error.message, {
          position: "top-center",
          autoClose: 1000,
        });
      }
    }
    toast.dismiss();
    toast.info("Attendance Data Saved Successfully", {
      position: "top-center",
      autoClose: 1000,
    });
    fetchSavedAttendance(loggedBranch[0]?.pn_BranchID);
  };

  // Map for saving (full → short code)
  const statusMapSave = {
    Present: "P",
    Absent: "A",
    Leave: "L",
    "Work from home": "WFH",
  };

  // Map for fetching (short code → full)
  const statusMapFetch = {
    P: "Present",
    A: "Absent",
    L: "Leave",
    WFH: "Work from home",
  };
  const columnDefs = [
    {
      headerName: "EMPLOYEE CODE",
      field: "emp_code",
      editable: false,
      valueFormatter: (params) => params.value || "-",
    },
    {
      headerName: "EMPLOYEE NAME",
      field: "emp_name",
      editable: false,
      valueFormatter: (params) => params.value || "-",
    },
    {
      headerName: "SHIFT CODE",
      field: "shift_code",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: shiftOptions.map((shift) => shift.shift_code),
      },
      valueFormatter: (params) => params.value || "-",
    },
    {
      headerName: "DATES",
      field: "dates",
      editable: true,
      valueFormatter: (params) => params.value || "-",
    },
    {
      headerName: "DAYS",
      field: "days",
      editable: true,
      valueFormatter: (params) => params.value || "-",
    },
    {
      headerName: "IN TIME",
      field: "intime",
      editable: true,
      valueFormatter: (params) => params.value || "-",
    },
    {
      headerName: "BREAK OUT",
      field: "break_out",
      editable: true,
      valueFormatter: (params) => params.value || "-",
    },
    {
      headerName: "BREAK IN",
      field: "break_in",
      editable: true,
      valueFormatter: (params) => params.value || "-",
    },
    {
      headerName: "OUT TIME",
      field: "outtime",
      editable: true,
      valueFormatter: (params) => params.value || "-",
    },
    {
      headerName: "EARLY OUT",
      field: "early_out",
      editable: true,
      valueFormatter: (params) => params.value || "-",
    },
    {
      headerName: "LATE IN",
      field: "Late_in",
      editable: true,
      valueFormatter: (params) => params.value || "-",
    },
    {
      headerName: "LATE OUT",
      field: "Late_out",
      editable: true,
      valueFormatter: (params) => params.value || "-",
    },
    {
      headerName: "OT HRS",
      field: "ot_hrs",
      editable: true,
      valueFormatter: (params) => params.value || "-",
    },
    {
      headerName: "STATUS",
      field: "status",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: ["Present", "Absent", "Leave", "Work from home"],
      },
      valueFormatter: (params) => params.value || "-",
    },
    {
      headerName: "LEAVE CODE",
      field: "leave_code",
      editable: true,
      cellEditor: "agSelectCellEditor",
      editable: (params) => params.data.status !== "Present",
      cellEditorParams: {
        values: leaveOptions.map((l) => l.pn_leaveCode),
      },
      valueFormatter: (params) => {
        if (!params.value) return "-";
        const leave = leaveOptions.find((l) => l.pn_leaveCode === params.value);
        return leave ? `${leave.pn_leaveCode}` : params.value;
      },
    },
  ];
  const onGridReady = (params) => {
    params.api.sizeColumnsToFit();
    params.api.autoSizeAllColumns();
  };

  const gridHeight = Math.max(attendanceData.length * 50, 300);

  const onCellValueChanged = (params) => {
    const newData = [...attendanceData];
    if (params.oldValue === params.newValue ) {
      return; // ❌ Prevent accidental overwrite
    }

    newData[params.rowIndex][params.colDef.field] = params.newValue;
    setAttendanceData(newData);

    // Mark this row as modified
    setModifiedRows((prev) => ({
      ...prev,
      [params.data.emp_code]: { ...params.data },
    }));

    // Auto-update shift timings if shift_code changed
    if (params.colDef.field === "shift_code") {
      const selectedShift = shiftOptions.find(
        (shift) => shift.shift_code === params.newValue
      );
      if (selectedShift) {
        newData[params.rowIndex].intime = selectedShift.start_time;
        newData[params.rowIndex].break_out = selectedShift.break_time_out;
        newData[params.rowIndex].break_in = selectedShift.break_time_in;
        newData[params.rowIndex].outtime = selectedShift.end_time;
        setAttendanceData(newData);

        // Mark updated row again with new timings
        setModifiedRows((prev) => ({
          ...prev,
          [params.data.emp_code]: { ...newData[params.rowIndex] },
        }));
      }
    }
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
          xl={20}
          sx={{ margin: "100px 50px 50px 50px" }}
        >
          <AppBar
            position="static"
            sx={{ width: "100%", marginTop: "10px", minHeight: "60px" }}
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
                MANUAL ATTENDANCE ENTRY
              </Typography>
            </Toolbar>
          </AppBar>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Box
              display="flex"
              flexDirection="row"
              gap={2}
              justifyContent="flex-start"
            >
              <Box display="flex" gap={2}>
                <Select
                  value={commonShiftCode}
                  onChange={handleCommonShiftChange}
                  displayEmpty
                  variant="outlined"
                  size="small"
                >
                  <MenuItem value="" disabled>
                    Select Common Shift Code
                  </MenuItem>
                  {shiftOptions.map((shift) => (
                    <MenuItem key={shift.pn_ShiftID} value={shift.shift_code}>
                      {shift.shift_code}
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              <Box
                display="flex"
                sx={{
                  justifyContent: "flex-end", // Align buttons to right
                  paddingRight: "20px",
                  gap: 2,
                  width: "100%", // Ensure Box uses the full width to push buttons right
                }}
              >
                {/* <Button
                    variant="contained"
                    size="small"
                    color="secondary"
                    onClick={handleReset}
                    >
                      Reset All
                    </Button> */}
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={handleUpdate}
                  disabled={Object.keys(modifiedRows).length === 0}
                >
                  Update All
                </Button>

                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  onClick={handleSave}
                >
                  Save All
                </Button>
              </Box>
            </Box>
          </Paper>

          {isLoading ? (
            <CircularProgress />
          ) : (
            <div
              className="ag-theme-alpine"
              style={{ height: "80%", width: "100%" }}
            >
              <AgGridReact
                rowData={attendanceData}
                getRowHeight={() => 33}
                columnDefs={columnDefs}
                onCellValueChanged={onCellValueChanged}
                onGridReady={onGridReady}
                getRowStyle={(params) => ({
                  backgroundColor:
                    params.node.rowIndex % 2 === 0 ? "#cde3f2" : "#ffffff",
                })}
              />
            </div>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ManualAttendance;
