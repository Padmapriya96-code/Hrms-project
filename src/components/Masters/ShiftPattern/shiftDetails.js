// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import {
//   Grid,
//   Button,
//   Typography,
//   Box,
//   IconButton,
//   AppBar,
//   Toolbar,
// } from "@mui/material";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
// import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
// import { toast } from "react-toastify";
// import { postRequest } from "../../../serverconfiguration/requestcomp";
// import { ServerConfig } from "../../../serverconfiguration/serverconfig";
// import { REPORTS, SAVE } from "../../../serverconfiguration/controllers";
// import Sidenav from "../../Home Page/Sidenav";
// import Navbar from "../../Home Page/Navbar";

// const ShiftDetails = () => {
//   const [shiftDetailsList, setShiftDetailsList] = useState([]);
//   const [originalData, setOriginalData] = useState([]);
//   const [modifiedRows, setModifiedRows] = useState({});
//   const [companyId, setCompanyId] = useState(null);
//   const [branchId, setBranchId] = useState(null);
//   const [existingShiftCodes, setExistingShiftCodes] = useState(new Set());

//   // Fetch company and branch
//   const fetchCompanyAndBranch = useCallback(async () => {
//     const isLoggedin = sessionStorage.getItem("user");

//     try {
//       const loggedBranchData = await postRequest(ServerConfig.url, REPORTS, {
//         query: `SELECT * FROM paym_Branch WHERE Branch_User_Id = '${isLoggedin}'`,
//       });

//       if (loggedBranchData.data && loggedBranchData.data.length > 0) {
//         const branch = loggedBranchData.data[0];
//         setBranchId(branch.pn_BranchID);
//         setCompanyId(branch.pn_CompanyID);
//       }
//     } catch (error) {
//       console.error("Error fetching company and branch data:", error);
//     }
//   }, []);

//   // Fetch shift details
//   const fetchShiftDetails = useCallback(async () => {
//     if (companyId && branchId) {
//       try {
//         const response = await postRequest(ServerConfig.url, REPORTS, {
//           query: `
//           SELECT [pn_CompanyID], [pn_branchid], [pn_ShiftID], [shift_code], [start_time], 
//                  [break_time_out], [break_time_in], [end_time], [shift_indicator], [Shift_Type]
//           FROM [dbo].[paym_Shift]
//           WHERE pn_companyid = ${companyId} AND pn_branchid = ${branchId}
//         `,
//         });

//         if (response.data && response.data.length > 0) {
//           const formattedData = response.data.map((item) => ({
//             ...item,
//             start_time: formatTimeForDisplay(item.start_time),
//             break_time_out: formatTimeForDisplay(item.break_time_out),
//             break_time_in: formatTimeForDisplay(item.break_time_in),
//             end_time: formatTimeForDisplay(item.end_time),
//           }));

//           setShiftDetailsList(formattedData);
//           setOriginalData(JSON.parse(JSON.stringify(formattedData)));
//           const codes = new Set(response.data.map((shift) => shift.shift_code));
//           setExistingShiftCodes(codes);
//         } else {
//           setShiftDetailsList([]);
//           setOriginalData([]);
//         }
//       } catch (error) {
//         console.error("Error fetching shift details:", error);
//       }
//     }
//   }, [companyId, branchId]);

//   useEffect(() => {
//     fetchCompanyAndBranch();
//   }, [fetchCompanyAndBranch]);

//   useEffect(() => {
//     if (companyId && branchId) fetchShiftDetails();
//   }, [companyId, branchId, fetchShiftDetails]);

//   // --- TIME FORMATTING FUNCTIONS ---
//   const formatTimeForDisplay = (time) => {
//     if (!time) return "";

//     if (time instanceof Date) return time.toTimeString().slice(0, 5);

//     if (typeof time === "string") {
//       if (/^\d{2}:\d{2}$/.test(time)) return time;
//       if (/^\d{2}:\d{2}:\d{2}$/.test(time)) return time.slice(0, 5);
//       const date = new Date(`2000-01-01T${time}`);
//       if (!isNaN(date.getTime())) return date.toTimeString().slice(0, 5);
//     }

//     return time;
//   };

//   const formatTimeForDatabase = (time) => {
//     if (!time) return null;
//     if (/^\d{2}:\d{2}$/.test(time)) return `${time}:00`;
//     return time;
//   };

//   const normalizeTimeInput = (value) => {
//     if (!value) return "";
//     if (/^\d{1,2}$/.test(value)) {
//       return value.padStart(2, "0") + ":00";
//     }
//     if (/^\d{1,2}:\d{1,2}$/.test(value)) {
//       let [h, m] = value.split(":");
//       return h.padStart(2, "0") + ":" + m.padStart(2, "0");
//     }
//     if (/^\d{2}:\d{2}:\d{2}$/.test(value)) return value.slice(0, 5);
//     if (/^\d{2}:\d{2}$/.test(value)) return value;
//     return value;
//   };

//   // --- DETERMINE SHIFT TYPE ---
//   const determineShiftType = (start_time, end_time) => {
//     if (!start_time || !end_time) return "General";

//     try {
//       const start = new Date(`2000-01-01T${formatTimeForDatabase(start_time)}`);
//       const end = new Date(`2000-01-01T${formatTimeForDatabase(end_time)}`);
//       if (isNaN(start.getTime()) || isNaN(end.getTime())) return "General";
//       return start > end ? "Next Day" : "General";
//     } catch (error) {
//       return "General";
//     }
//   };

//   // --- CHECK IF ROW IS MODIFIED ---
//   const isRowModified = useCallback(
//     (rowData) => {
//       if (rowData.isNew) return false;
//       const originalRow = originalData.find(
//         (item) => item.pn_ShiftID === rowData.pn_ShiftID
//       );
//       if (!originalRow) return false;

//       return (
//         String(originalRow.shift_code) !== String(rowData.shift_code) ||
//         String(originalRow.start_time) !== String(rowData.start_time) ||
//         String(originalRow.break_time_out) !== String(rowData.break_time_out) ||
//         String(originalRow.break_time_in) !== String(rowData.break_time_in) ||
//         String(originalRow.end_time) !== String(rowData.end_time) ||
//         String(originalRow.shift_indicator) !== String(rowData.shift_indicator)
//       );
//     },
//     [originalData]
//   );

//   // --- CELL VALUE CHANGED ---
//   const handleCellValueChanged = useCallback(
//   (params) => {
//     const rowData = params.data;

//     if (["start_time", "break_time_out", "break_time_in", "end_time"].includes(params.colDef.field)) {
//       rowData[params.colDef.field] = normalizeTimeInput(rowData[params.colDef.field]);

//       // Reject invalid railway time immediately
//       if (!isValidRailwayTime(rowData[params.colDef.field])) {
//         toast.dismiss();
//         toast.error("Invalid railway timing! Enter 00:00 - 23:59.", { position: "top-center", autoClose: 1000 });
//         rowData[params.colDef.field] = ""; // clear invalid input
//       }
//     }

//     // Auto-calculate Shift Type
//     rowData.Shift_Type = determineShiftType(rowData.start_time, rowData.end_time);

//     if (!rowData.isNew) {
//       const modified = isRowModified(rowData);
//       setModifiedRows((prev) => ({
//         ...prev,
//         [rowData.pn_ShiftID]: modified,
//       }));
//     }

//     params.api.refreshCells({ rowNodes: [params.node], force: true });
//   },
//   [isRowModified]
// );


//   // --- ADD NEW SHIFT ---
//   const handleAddShift = () => {
//     const lastShift = shiftDetailsList[shiftDetailsList.length - 1];

//     if (
//       lastShift &&
//       (!lastShift.shift_code || !lastShift.start_time || !lastShift.shift_indicator)
//     ) {
//       toast.dismiss();
//       toast.warning(
//         "Please fill all required fields in the current row before adding a new one.",
//         { position: "top-center", autoClose: 1000 }
//       );
//       return;
//     }

//     const newShift = {
//       shift_code: "",
//       start_time: "",
//       break_time_out: "",
//       break_time_in: "",
//       end_time: "",
//       shift_indicator: "",
//       Shift_Type: "General",
//       isNew: true,
//     };

//     setShiftDetailsList((prev) => [...prev, newShift]);
//   };

//   // --- VALIDATE ROW ---
//  const validateFields = (shiftDetails) => {
//   const { shift_code, start_time, break_time_out, break_time_in, end_time, shift_indicator } = shiftDetails;

//   if (!shift_code || !start_time || !shift_indicator) {
//     toast.dismiss();
//     toast.error("Shift Code, Start Time and Shift Indicator are required.", {
//       position: "top-center",
//       autoClose: 1000,
//     });
//     return false;
//   }

//   // Validate railway time
//   if (!isValidRailwayTime(start_time) || (break_time_out && !isValidRailwayTime(break_time_out)) ||
//       (break_time_in && !isValidRailwayTime(break_time_in)) || (end_time && !isValidRailwayTime(end_time))) {
//     toast.dismiss();
//     toast.error("Please enter valid railway timing (00:00 to 23:59).", {
//       position: "top-center",
//       autoClose: 1000,
//     });
//     return false;
//   }

//   // Check for unique shift code for new rows
//   if (shiftDetails.isNew && existingShiftCodes.has(shift_code)) {
//     toast.dismiss();
//     toast.error("Shift Code already exists. Please use a unique code.", {
//       position: "top-center",
//       autoClose: 1000,
//     });
//     return false;
//   }

//   return true;
// };
// // Check if time is valid railway time (00:00 to 23:59)
// const isValidRailwayTime = (value) => {
//   if (!value) return false;
//   const regex = /^([01]\d|2[0-3]):([0-5]\d)$/; // 24-hour format HH:mm
//   return regex.test(value);
// };

//   const handleSaveAll = async () => {
//     try {
//       toast.dismiss();
//       const newRows = shiftDetailsList.filter((row) => row.isNew);
//       if (newRows.length === 0) {
//         toast.error("No new data to save", { position: "top-center", autoClose: 1000 });
//         return;
//       }

//       for (const row of newRows) {
//         if (!validateFields(row)) return;
//       }

//       const queries = newRows.map((row) => {
//         const shiftType = determineShiftType(row.start_time, row.end_time);
//         return `INSERT INTO [dbo].[paym_Shift]
//                 ([pn_CompanyID], [pn_branchid], [shift_code], [start_time], 
//                  [break_time_out], [break_time_in], [end_time], [shift_indicator], [Shift_Type])
//                 VALUES
//                 (${companyId}, ${branchId}, '${row.shift_code}', 
//                  '${formatTimeForDatabase(row.start_time)}', 
//                  '${formatTimeForDatabase(row.break_time_out)}', 
//                  '${formatTimeForDatabase(row.break_time_in)}', 
//                  '${formatTimeForDatabase(row.end_time)}', 
//                  '${row.shift_indicator}', '${shiftType}')`;
//       });

//       await Promise.all(queries.map((query) => postRequest(ServerConfig.url, SAVE, { query })));

//       toast.success("Shift details saved successfully", { position: "top-center", autoClose: 1000 });
//       fetchShiftDetails();
//     } catch (error) {
//       toast.error("Failed to save shift details", { position: "top-center", autoClose: 1000 });
//     }
//   };

//   // --- UPDATE SINGLE SHIFT ---
//   const handleUpdateShift = async (rowData) => {
//     try {
//       toast.dismiss();
//       if (!rowData.shift_code || !rowData.start_time || !rowData.shift_indicator) {
//         toast.error(
//           "Shift Code, Start Time and Shift Indicator are required.",
//           { position: "top-center", autoClose: 1000 }
//         );
//         return;
//       }

//       const shiftType = determineShiftType(rowData.start_time, rowData.end_time);
//       const query = `UPDATE [dbo].[paym_Shift]
//                     SET 
//                       start_time = '${formatTimeForDatabase(rowData.start_time)}',
//                       break_time_out = '${formatTimeForDatabase(rowData.break_time_out)}',
//                       break_time_in = '${formatTimeForDatabase(rowData.break_time_in)}',
//                       end_time = '${formatTimeForDatabase(rowData.end_time)}',
//                       shift_indicator = '${rowData.shift_indicator}',
//                       Shift_Type = '${shiftType}'
//                     WHERE 
//                       pn_companyid = ${companyId} AND 
//                       pn_branchid = ${branchId} AND 
//                       shift_code = '${rowData.shift_code}'`;

//       await postRequest(ServerConfig.url, SAVE, { query });

//       setModifiedRows((prev) => {
//         const newModified = { ...prev };
//         delete newModified[rowData.pn_ShiftID];
//         return newModified;
//       });

//       toast.success("Shift details updated successfully", { position: "top-center", autoClose: 1000 });
//       fetchShiftDetails();
//     } catch (error) {
//       toast.error("Failed to update shift details", { position: "top-center", autoClose: 1000 });
//     }
//   };

// const handleDeleteShift = (rowData) => {
//     toast.dismiss();

//     toast.info(
//       <div style={{ textAlign: 'center' }}>
//         Are you sure you want to delete this shift?
//         <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
//           <Button 
//             variant="contained" 
//             size="small"
//             color="error"
//             onClick={async () => {
//               toast.dismiss();
//               await executeDelete(rowData);
//             }}
//             style={{ minWidth: '80px' }}
//           >
//             Delete
//           </Button>
//           <Button 
//             variant="outlined" 
//             size="small"
//             onClick={() => toast.dismiss()}
//             style={{ minWidth: '80px' }}
//           >
//             Cancel
//           </Button>
//         </div>
//       </div>,
//       {
//         position: "top-center",
//         autoClose: false,
//         closeOnClick: false,
//         draggable: false,
//         toastId: "delete-confirmation",
//       }
//     );
//   };

//   const executeDelete = async (rowData) => {
//     try {
//       const query = `DELETE FROM [dbo].[paym_Shift]
//                      WHERE pn_companyid = ${companyId} 
//                      AND pn_branchid = ${branchId} 
//                      AND shift_code = '${rowData.shift_code}'`;
      
//       await postRequest(ServerConfig.url, SAVE, { query });

//       toast.error("Shift details deleted successfully", {
//         position: "top-center",
//         autoClose: 1000,
//       });

//       fetchShiftDetails();
//     } catch (error) {
//       toast.error("Failed to delete shift details", {
//         position: "top-center",
//         autoClose: 1000,
//       });
//     }
//   };


//   // --- AG GRID COLUMNS ---
//   const columnDefs = useMemo(
//     () => [
//       { headerName: "SHIFT CODE", field: "shift_code", editable: true, minWidth: 120 },
//       { headerName: "START TIME", field: "start_time", editable: true, minWidth: 120 },
//       { headerName: "BREAK (OUT)", field: "break_time_out", editable: true, minWidth: 120 },
//       { headerName: "BREAK (IN)", field: "break_time_in", editable: true, minWidth: 120 },
//       { headerName: "END TIME", field: "end_time", editable: true, minWidth: 120 },
//       { headerName: "SHIFT NAME", field: "shift_indicator", editable: true, minWidth: 150 },
//       {
//         headerName: "SHIFT TYPE",
//         field: "Shift_Type",
//         valueGetter: (params) => determineShiftType(params.data.start_time, params.data.end_time),
//         minWidth: 120,
//       },
//       {
//         headerName: "ACTIONS",
//         width: 150,
//         cellRenderer: (params) => (
//           <div>
//         <IconButton
//   onClick={() => handleUpdateShift(params.data)}
//   color="success"
//   disabled={!modifiedRows[params.data.pn_ShiftID]}
// >
//   <DoneOutlineIcon />
// </IconButton>
// <IconButton onClick={() => handleDeleteShift(params.data)} color="error">
//   <DeleteOutlineIcon />
// </IconButton>

//           </div>
//         ),
//       },
//     ],
//     [modifiedRows]
//   );

//   return (
//     <Grid container style={{ backgroundColor: "#f5f5f5" }}>
//       <Navbar />
//       <Grid item xs={12} sx={{ display: "flex" }}>
//         <Sidenav />
//         <Grid
//           item
//           xs={12}
//           sm={12}
//           md={12}
//           lg={11}
//           sx={{ padding: { xs: "20px", sm: "40px" }, overflowY: "auto", margin: "0 auto" }}
//         >
//           <AppBar position="static" sx={{ width: "100%", marginTop: "70px", minHeight: "60px" }}>
//             <Toolbar sx={{ justifyContent: "left", height: "100%" }}>
//               <Typography
//                 variant="h5"
//                 gutterBottom
//                 sx={{ textAlign: "left", fontWeight: "bold", color: "white", lineHeight: "60px" }}
//               >
//                 SHIFT DETAILS
//               </Typography>
//             </Toolbar>
//           </AppBar>

//           <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
//             <AgGridReact
//               rowData={shiftDetailsList}
//               columnDefs={columnDefs}
//               defaultColDef={{ flex: 1, minWidth: 100, resizable: true }}
//               onCellValueChanged={handleCellValueChanged}
//               animateRows={true}
//               pagination={true}
//               paginationPageSize={10}
//               getRowStyle={(params) => ({
//                 backgroundColor: params.node.rowIndex % 2 === 0 ? "#cde3f2" : "#ffffff",
//               })}
//             />
//           </div>

//           <Box mt={2} display="flex" justifyContent="flex-end">
//             <Button variant="contained" onClick={handleAddShift} sx={{ mr: 1 }}>
//               Add Shift
//             </Button>
//             <Button variant="contained" color="primary" onClick={handleSaveAll}>
//               Save All
//             </Button>
//           </Box>
//         </Grid>
//       </Grid>
//     </Grid>
//   );
// };

// export default ShiftDetails;


















import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Grid,
  Button,
  Typography,
  Box,
  IconButton,
  AppBar,
  Toolbar,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import { toast } from "react-toastify";
import { postRequest } from "../../../serverconfiguration/requestcomp";
import { ServerConfig } from "../../../serverconfiguration/serverconfig";
import { REPORTS, SAVE } from "../../../serverconfiguration/controllers";
import Sidenav from "../../Home Page/Sidenav";
import Navbar from "../../Home Page/Navbar";

const ShiftDetails = () => {
  const [shiftDetailsList, setShiftDetailsList] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [modifiedRows, setModifiedRows] = useState({});
  const [companyId, setCompanyId] = useState(null);
  const [branchId, setBranchId] = useState(null);
  const [existingShiftCodes, setExistingShiftCodes] = useState(new Set());

  // ✅ Dynamic DB name
  const databaseName = sessionStorage.getItem("databaseName");

  // --- Utility: 24-hour time validator ---
  const isValidRailwayTime = (value) => {
    if (!value) return false;
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/; // 00:00–23:59 format
    return regex.test(value);
  };

  // --- Fetch company & branch ---
  const fetchCompanyAndBranch = useCallback(async () => {
    const isLoggedin = sessionStorage.getItem("user");

    try {
      if (!databaseName) {
        console.warn("⚠️ Missing database name in sessionStorage");
        return;
      }

      const query = `
        SELECT * 
        FROM [${databaseName}].[dbo].[paym_Branch]
        WHERE Branch_User_Id = '${isLoggedin}';
      `;

      const result = await postRequest(ServerConfig.url, REPORTS, { query });
      if (result.data && result.data.length > 0) {
        const branch = result.data[0];
        setBranchId(branch.pn_BranchID);
        setCompanyId(branch.pn_CompanyID);
      }
    } catch (error) {
      console.error("Error fetching branch/company data:", error);
    }
  }, [databaseName]);

  // --- Fetch Shift Details ---
  const fetchShiftDetails = useCallback(async () => {
    if (!databaseName || !companyId || !branchId) return;

    try {
      const query = `
        SELECT [pn_CompanyID], [pn_branchid], [pn_ShiftID], [shift_code],
               [start_time], [break_time_out], [break_time_in],
               [end_time], [shift_indicator], [Shift_Type]
        FROM [${databaseName}].[dbo].[paym_Shift]
        WHERE pn_companyid = ${companyId} AND pn_branchid = ${branchId};
      `;

      const response = await postRequest(ServerConfig.url, REPORTS, { query });

      if (response.data && response.data.length > 0) {
        const formattedData = response.data.map((item) => ({
          ...item,
          start_time: formatTimeForDisplay(item.start_time),
          break_time_out: formatTimeForDisplay(item.break_time_out),
          break_time_in: formatTimeForDisplay(item.break_time_in),
          end_time: formatTimeForDisplay(item.end_time),
        }));

        setShiftDetailsList(formattedData);
        setOriginalData(JSON.parse(JSON.stringify(formattedData)));
        setExistingShiftCodes(new Set(response.data.map((s) => s.shift_code)));
      } else {
        setShiftDetailsList([]);
        setOriginalData([]);
      }
    } catch (error) {
      console.error("Error fetching shift details:", error);
    }
  }, [companyId, branchId, databaseName]);

  useEffect(() => {
    fetchCompanyAndBranch();
  }, [fetchCompanyAndBranch]);

  useEffect(() => {
    if (companyId && branchId) fetchShiftDetails();
  }, [companyId, branchId, fetchShiftDetails]);

  // --- Format Time Helpers ---
  const formatTimeForDisplay = (time) => {
    if (!time) return "";
    if (/^\d{2}:\d{2}(:\d{2})?$/.test(time)) return time.slice(0, 5);
    const date = new Date(`2000-01-01T${time}`);
    return !isNaN(date.getTime()) ? date.toTimeString().slice(0, 5) : "";
  };

  const formatTimeForDatabase = (time) =>
    time ? (time.length === 5 ? `${time}:00` : time) : null;

  const normalizeTimeInput = (value) => {
    if (!value) return "";
    if (/^\d{1,2}$/.test(value)) return value.padStart(2, "0") + ":00";
    if (/^\d{1,2}:\d{1,2}$/.test(value)) {
      const [h, m] = value.split(":");
      return h.padStart(2, "0") + ":" + m.padStart(2, "0");
    }
    if (/^\d{2}:\d{2}(:\d{2})?$/.test(value)) return value.slice(0, 5);
    return value;
  };

  const determineShiftType = (start_time, end_time) => {
    if (!start_time || !end_time) return "General";
    try {
      const s = new Date(`2000-01-01T${formatTimeForDatabase(start_time)}`);
      const e = new Date(`2000-01-01T${formatTimeForDatabase(end_time)}`);
      return s > e ? "Next Day" : "General";
    } catch {
      return "General";
    }
  };

  // --- Handle Edit Cell ---
  const handleCellValueChanged = useCallback(
    (params) => {
      const rowData = params.data;

      if (["start_time", "break_time_out", "break_time_in", "end_time"].includes(params.colDef.field)) {
        rowData[params.colDef.field] = normalizeTimeInput(rowData[params.colDef.field]);

        // ✅ Validate 24-hour format
        if (rowData[params.colDef.field] && !isValidRailwayTime(rowData[params.colDef.field])) {
          toast.dismiss();
          toast.error("Invalid railway time! Must be 00:00–23:59.", {
            position: "top-center",
            autoClose: 1000,
          });
          rowData[params.colDef.field] = "";
        }
      }

      // Auto-calc Shift Type
      rowData.Shift_Type = determineShiftType(rowData.start_time, rowData.end_time);

      if (!rowData.isNew) {
        const modified =
          JSON.stringify(rowData) !==
          JSON.stringify(originalData.find((o) => o.pn_ShiftID === rowData.pn_ShiftID));
        setModifiedRows((prev) => ({
          ...prev,
          [rowData.pn_ShiftID]: modified,
        }));
      }

      params.api.refreshCells({ rowNodes: [params.node], force: true });
    },
    [originalData]
  );

  // --- Add New Shift Row ---
  const handleAddShift = () => {
    const last = shiftDetailsList[shiftDetailsList.length - 1];
    if (last && (!last.shift_code || !last.start_time || !last.shift_indicator)) {
      toast.warning("Complete the current row before adding a new one.", { autoClose: 1000 });
      return;
    }
    setShiftDetailsList((prev) => [
      ...prev,
      {
        shift_code: "",
        start_time: "",
        break_time_out: "",
        break_time_in: "",
        end_time: "",
        shift_indicator: "",
        Shift_Type: "General",
        isNew: true,
      },
    ]);
  };

  // --- Save New Rows ---
  const handleSaveAll = async () => {
    try {
      toast.dismiss();
      const newRows = shiftDetailsList.filter((r) => r.isNew);
      if (newRows.length === 0) {
        toast.error("No new rows to save", { autoClose: 1000 });
        return;
      }

      for (const row of newRows) {
        const required = [row.shift_code, row.start_time, row.shift_indicator];
        if (required.some((v) => !v)) {
          toast.error("Shift Code, Start Time & Indicator required.", { autoClose: 1000 });
          return;
        }

        const allTimes = [row.start_time, row.break_time_out, row.break_time_in, row.end_time].filter(Boolean);
        for (const t of allTimes) {
          if (!isValidRailwayTime(t)) {
            toast.error(`Invalid time (${t}). Use 00:00–23:59.`, { autoClose: 1000 });
            return;
          }
        }
      }

      const queries = newRows.map((r) => {
        const shiftType = determineShiftType(r.start_time, r.end_time);
        return `
          INSERT INTO [${databaseName}].[dbo].[paym_Shift]
          ([pn_CompanyID], [pn_branchid], [shift_code], [start_time], [break_time_out], [break_time_in],
           [end_time], [shift_indicator], [Shift_Type])
          VALUES (${companyId}, ${branchId}, '${r.shift_code}', 
                  '${formatTimeForDatabase(r.start_time)}', '${formatTimeForDatabase(r.break_time_out)}',
                  '${formatTimeForDatabase(r.break_time_in)}', '${formatTimeForDatabase(r.end_time)}',
                  '${r.shift_indicator}', '${shiftType}');
        `;
      });

      await Promise.all(queries.map((q) => postRequest(ServerConfig.url, SAVE, { query: q })));
      toast.success("Shift details saved successfully", { autoClose: 1000 });
      fetchShiftDetails();
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save shift details", { autoClose: 1000 });
    }
  };

  // --- Update Existing Shift ---
  const handleUpdateShift = async (rowData) => {
    try {
      toast.dismiss();
      if (!rowData.shift_code || !rowData.start_time || !rowData.shift_indicator) {
        toast.error("Shift Code, Start Time & Indicator required.", { autoClose: 1000 });
        return;
      }

      const allTimes = [rowData.start_time, rowData.break_time_out, rowData.break_time_in, rowData.end_time].filter(Boolean);
      for (const t of allTimes) {
        if (!isValidRailwayTime(t)) {
          toast.error(`Invalid time format (${t}). Use 00:00–23:59.`, { autoClose: 1000 });
          return;
        }
      }

      const shiftType = determineShiftType(rowData.start_time, rowData.end_time);
      const query = `
        UPDATE [${databaseName}].[dbo].[paym_Shift]
        SET start_time='${formatTimeForDatabase(rowData.start_time)}',
            break_time_out='${formatTimeForDatabase(rowData.break_time_out)}',
            break_time_in='${formatTimeForDatabase(rowData.break_time_in)}',
            end_time='${formatTimeForDatabase(rowData.end_time)}',
            shift_indicator='${rowData.shift_indicator}',
            Shift_Type='${shiftType}'
        WHERE pn_companyid=${companyId} AND pn_branchid=${branchId} AND shift_code='${rowData.shift_code}';
      `;

      await postRequest(ServerConfig.url, SAVE, { query });
      toast.success("Shift updated successfully", { autoClose: 1000 });
      fetchShiftDetails();
    } catch (error) {
      toast.error("Failed to update shift", { autoClose: 1000 });
    }
  };

  // --- Delete Shift ---
  const executeDelete = async (rowData) => {
    try {
      const query = `
        DELETE FROM [${databaseName}].[dbo].[paym_Shift]
        WHERE pn_companyid=${companyId} AND pn_branchid=${branchId} 
        AND shift_code='${rowData.shift_code}';
      `;
      await postRequest(ServerConfig.url, SAVE, { query });
      toast.success("Shift deleted successfully", { autoClose: 1000 });
      fetchShiftDetails();
    } catch (error) {
      toast.error("Failed to delete shift", { autoClose: 1000 });
    }
  };

  // --- Grid Columns ---
  const columnDefs = useMemo(
    () => [
      { headerName: "SHIFT CODE", field: "shift_code", editable: true, minWidth: 120 },
      { headerName: "START TIME", field: "start_time", editable: true, minWidth: 120 },
      { headerName: "BREAK (OUT)", field: "break_time_out", editable: true, minWidth: 120 },
      { headerName: "BREAK (IN)", field: "break_time_in", editable: true, minWidth: 120 },
      { headerName: "END TIME", field: "end_time", editable: true, minWidth: 120 },
      { headerName: "SHIFT NAME", field: "shift_indicator", editable: true, minWidth: 150 },
      {
        headerName: "SHIFT TYPE",
        field: "Shift_Type",
        valueGetter: (params) => determineShiftType(params.data.start_time, params.data.end_time),
        minWidth: 120,
      },
      {
        headerName: "ACTIONS",
        width: 150,
        cellRenderer: (params) => (
          <div>
            <IconButton onClick={() => handleUpdateShift(params.data)} color="success">
              <DoneOutlineIcon />
            </IconButton>
            <IconButton onClick={() => executeDelete(params.data)} color="error">
              <DeleteOutlineIcon />
            </IconButton>
          </div>
        ),
      },
    ],
    [modifiedRows]
  );

  return (
    <Grid container style={{ backgroundColor: "#f5f5f5" }}>
      <Navbar />
      <Grid item xs={12} sx={{ display: "flex" }}>
        <Sidenav />
        <Grid item xs={12} sm={12} md={12} lg={11} sx={{ p: 4, margin: "0 auto" }}>
          <AppBar position="static" sx={{ width: "100%", marginTop: "70px", minHeight: "60px" }}>
            <Toolbar>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "white" }}>
                SHIFT DETAILS
              </Typography>
            </Toolbar>
          </AppBar>

          <div className="ag-theme-alpine" style={{ height: 420, width: "100%" }}>
            <AgGridReact
              rowData={shiftDetailsList}
              columnDefs={columnDefs}
              defaultColDef={{ flex: 1, resizable: true }}
              onCellValueChanged={handleCellValueChanged}
              animateRows
              pagination
              paginationPageSize={10}
              getRowStyle={(params) => ({
                backgroundColor: params.node.rowIndex % 2 === 0 ? "#cde3f2" : "#ffffff",
              })}
            />
          </div>

          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button variant="contained" onClick={handleAddShift} sx={{ mr: 1 }}>
              Add Shift
            </Button>
            <Button variant="contained" color="primary" onClick={handleSaveAll}>
              Save All
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ShiftDetails;
