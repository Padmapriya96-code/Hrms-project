// import React, { useState, useEffect } from "react";
// import { Grid, Button, Typography, Box, IconButton } from "@mui/material";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
// import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
// import { postRequest } from "../../serverconfiguration/requestcomp";
// import { ServerConfig } from "../../serverconfiguration/serverconfig";
// import { REPORTS, SAVE } from "../../serverconfiguration/controllers";
// import Navbar from "../../components/Home Page/Navbar";
// import Sidenav from "../../components/Home Page/Sidenav";
// import AppBar from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";
// import { toast } from "react-toastify";
// const PaymLeaveMaster1 = () => {
//   const [company, setCompany] = useState([]);
//   const [branch, setBranch] = useState([]);
//   const [gridData, setGridData] = useState([]);
//   const [pnCompanyId, setPnCompanyId] = useState("");
//   const [isloggedin, setIsloggedin] = useState(sessionStorage.getItem("user"));
//   const databaseName = sessionStorage.getItem("databaseName");

//   // Fetch company data
//   const fetchCompanyData = async () => {
//     const companyData = await postRequest(ServerConfig.url, REPORTS, {
//       query: `SELECT * FROM [${databaseName}].[dbo].[paym_Company]  WHERE company_user_id = '${isloggedin}'`,
//     });
//     setCompany(companyData.data);
//     if (companyData.data.length > 0) {
//       setPnCompanyId(companyData.data[0].pn_CompanyID);
//     }
//   };

//   // Fetch branch data
//   const fetchBranchData = async () => {
//     if (pnCompanyId) {
//       const branchData = await postRequest(ServerConfig.url, REPORTS, {
//         query: `SELECT * FROM [${databaseName}].[dbo].[paym_Branch] WHERE pn_CompanyID = '${pnCompanyId}'`,
//       });
//       setBranch(branchData.data);
//     }
//   };

//   // Fetch leave data
//   const fetchLeaveData = async () => {
//     if (pnCompanyId) {
//       const leaveData = await postRequest(ServerConfig.url, REPORTS, {
//         query: `SELECT * FROM [${databaseName}].[dbo].[paym_Leave] WHERE pn_CompanyID = '${pnCompanyId}'`,
//       });
//       setGridData(leaveData.data);
//     }
//   };

//   // Fetch all data
//   const fetchAllData = async () => {
//     await fetchCompanyData();
//     await fetchBranchData();
//     await fetchLeaveData();
//   };

//   // useEffect(() => {
//   //   fetchAllData();
//   // }, [isloggedin, pnCompanyId]);

//   // Fetch company when user logs in
//   useEffect(() => {
//     fetchCompanyData();
//   }, [isloggedin]);

//   // After company ID is fetched, fetch branch + leave
//   useEffect(() => {
//     if (pnCompanyId) {
//       fetchBranchData();
//       fetchLeaveData();
//     }
//   }, [pnCompanyId]);

//   const handleAddRow = () => {
//     const lastRow = gridData[gridData.length - 1];
//     if (
//       lastRow &&
//       (!lastRow.v_leaveName ||
//         !lastRow.pn_leaveCode ||
//         !lastRow.pn_Count ||
//         !lastRow.status ||
//         !lastRow.pn_BranchID ||
//         !lastRow.annual_leave ||
//         !lastRow.max_days ||
//         !lastRow.EL ||
//         !lastRow.Type)
//     ) {
//       toast.dismiss();
//       toast.warning(
//         "Please fill all fields in the current row before adding a new one.",
//         {
//           position: "top-center",
//           style: { textAlign: "center" },
//           autoClose: 1000,
//         }
//       );
//       return;
//     }

//     const newRow = {
//       pnCompanyId,
//       v_leaveName: "",
//       pn_leaveCode: "",
//       pn_Count: "",
//       status: "",
//       pn_BranchID: null,
//       annual_leave: "",
//       max_days: "",
//       EL: "",
//       Type: "",
//       isNew: true,
//     };
//     setGridData((prev) => [...prev, newRow]);
//   };

//   const handleSaveAll = async () => {
//     try {
//       toast.dismiss();
//       const newRows = gridData.filter((row) => row.isNew);
//       if (newRows.length === 0) {
//         toast.error("No new data to save", {
//           position: "top-center",
//           style: { textAlign: "center" },
//           autoClose: 1000,
//         });
//         return;
//       }
//       // Validate all required fields
//       for (const row of newRows) {
//         if (
//           !row.v_leaveName ||
//           !row.pn_leaveCode ||
//           !row.pn_Count ||
//           !row.status ||
//           !row.pn_BranchID ||
//           !row.annual_leave ||
//           !row.max_days ||
//           !row.EL ||
//           !row.Type
//         ) {
//           toast.error("Please fill all fields for new rows before saving.", {
//             position: "top-center",
//             style: { textAlign: "center" },
//             autoClose: 1000,
//           });
//           return;
//         }
//       }
//       // Build and send queries
//       const queries = newRows.map((row) => {
//         return `INSERT INTO [${databaseName}].[dbo].[paym_Leave] ([pn_CompanyID], [v_leaveName], [pn_leaveCode], [pn_Count], [status], [pn_BranchID], [annual_leave], [max_days], [EL], [Type]) VALUES ('${row.pnCompanyId}', '${row.v_leaveName}', '${row.pn_leaveCode}', ${row.pn_Count}, '${row.status}', ${row.pn_BranchID}, '${row.annual_leave}', ${row.max_days}, '${row.EL}', '${row.Type}')`;
//       });

//       await Promise.all(
//         queries.map((query) => postRequest(ServerConfig.url, SAVE, { query }))
//       );
//       toast.info("Data saved successfully", {
//         position: "top-center",
//         style: { textAlign: "center" },
//         autoClose: 1000,
//       });
//       await fetchLeaveData(); // Refresh data after saving
//     } catch (error) {
//       console.error("Error saving data:", error);
//       toast.error("Failed to save data", {
//         position: "top-center",
//         style: { textAlign: "center" },
//         autoClose: 1000,
//       });
//     }
//   };

//   const handleUpdateRow = async (rowData) => {
//     try {
//       toast.dismiss();
//       const query = `UPDATE [${databaseName}].[dbo].[paym_leave] SET [v_leaveName] = '${rowData.v_leaveName}', [pn_leaveCode] = '${rowData.pn_leaveCode}', [pn_Count] = ${rowData.pn_Count}, [status] = '${rowData.status}', [pn_BranchID] = ${rowData.pn_BranchID}, [annual_leave] = '${rowData.annual_leave}', [max_days] = ${rowData.max_days}, [EL] = '${rowData.EL}', [Type] = '${rowData.Type}' WHERE [pn_CompanyID] = '${rowData.pnCompanyId}' AND [pn_leaveID] = '${rowData.pn_leaveID}'`;

//       const response = await postRequest(ServerConfig.url, SAVE, { query });
//       console.log("Response:", response); // Log the response for debugging

//       toast.success("Data updated successfully", {
//         position: "top-center",
//         style: { textAlign: "center" },
//         autoClose: 1000,
//       });

//       // Update local grid data state directly without fetching again
//       setGridData((prevData) =>
//         prevData.map((row) =>
//           row.pn_leaveID === rowData.pn_leaveID ? { ...row, ...rowData } : row
//         )
//       );
//     } catch (error) {
//       console.error("Error updating data:", error);
//       toast.error("Failed to update data", {
//         position: "top-center",
//         style: { textAlign: "center" },
//         autoClose: 1000,
//       });
//     }
//   };

//   // Executes the delete query and refreshes grid
//   const executeDelete = async (rowData) => {
//     try {
//       if (!rowData.pn_leaveID) {
//         // It might be a new row not saved yet, just remove locally
//         setGridData((prev) => prev.filter((r) => r !== rowData));
//         return;
//       }

//       const query = `DELETE FROM [${databaseName}].[dbo].[paym_leave] WHERE [pn_leaveID] = '${rowData.pn_leaveID}'`;
//       await postRequest(ServerConfig.url, SAVE, { query });

//       toast.error("Data deleted successfully", {
//         position: "top-center",
//         style: { textAlign: "center" },
//         autoClose: 1000,
//       });

//       await fetchLeaveData(); // Refresh data after delete
//     } catch (error) {
//       console.error("Error deleting leave data:", error);
//       toast.error("Failed to delete leave record", {
//         position: "top-center",
//         style: { textAlign: "center" },
//         autoClose: 1000,
//       });
//     }
//   };

//   // Main function triggered on delete icon click
//   const handleDeleteRow = (rowData) => {
//     toast.dismiss(); // Clear any existing toasts

//     toast.info(
//       <div style={{ textAlign: "center" }}>
//         Are you sure you want to delete this leave record?
//         <div
//           style={{
//             marginTop: "10px",
//             display: "flex",
//             justifyContent: "center",
//             gap: "8px",
//           }}
//         >
//           <Button
//             variant="contained"
//             size="small"
//             color="error"
//             onClick={async () => {
//               toast.dismiss(); // Close confirmation toast
//               await executeDelete(rowData); // Perform actual delete
//             }}
//             style={{ minWidth: "80px" }}
//           >
//             Delete
//           </Button>
//           <Button
//             variant="outlined"
//             size="small"
//             onClick={() => toast.dismiss()}
//             style={{ minWidth: "80px" }}
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

//   const columnDefs = [
//     {
//       headerName: "LEAVE NAME",
//       field: "v_leaveName",
//       editable: true,
//       cellStyle: { textAlign: "left" },
//       minWidth: 150,
//     },
//     {
//       headerName: "LEAVE CODE",
//       field: "pn_leaveCode",
//       editable: true,
//       minWidth: 120,
//     },
//     { headerName: "COUNT", field: "pn_Count", editable: true, minWidth: 100 },
//     { headerName: "STATUS", field: "status", editable: true, minWidth: 100 },
//     {
//       headerName: "BRANCH ID",
//       field: "pn_BranchID",
//       editable: true,
//       minWidth: 140,
//     },
//     {
//       headerName: "ANNUAL LEAVE",
//       field: "annual_leave",
//       editable: true,
//       minWidth: 140,
//     },
//     {
//       headerName: "MAX DAYS",
//       field: "max_days",
//       editable: true,
//       minWidth: 130,
//     },
//     { headerName: "EL", field: "EL", editable: true, minWidth: 80 },
//     { headerName: "TYPE", field: "Type", editable: true, minWidth: 100 },
//     {
//       headerName: "ACTION",
//       cellRenderer: (params) => (
//         <div>
//           <IconButton
//             onClick={() => handleUpdateRow(params.data)}
//             color="success"
//           >
//             <DoneOutlineIcon />
//           </IconButton>
//           <IconButton
//             onClick={() => handleDeleteRow(params.data)}
//             color="error"
//           >
//             <DeleteOutlineIcon />
//           </IconButton>
//         </div>
//       ),
//       minWidth: 100,
//     },
//   ];

//   return (
//     <Grid container style={{ backgroundColor: "#f5f5f5" }}>
//       <Navbar />
//       <Grid item xs={12} sx={{ display: "flex" }}>
//         <Sidenav />
//         <Grid
//           item
//           xs={12}
//           sx={{
//             padding: { xs: "20px", sm: "40px" },
//             overflowY: "auto",
//             margin: "0 auto",
//           }}
//         >
//           <AppBar
//             position="static"
//             sx={{ width: "100%", marginTop: "70px", minHeight: "60px" }}
//           >
//             <Toolbar sx={{ justifyContent: "left", height: "100%" }}>
//               <Typography
//                 variant="h5"
//                 gutterBottom
//                 sx={{
//                   textAlign: "left",
//                   fontWeight: "bold",
//                   color: "white",
//                   lineHeight: "60px",
//                 }}
//               >
//                 LEAVE MANAGEMENT
//               </Typography>
//             </Toolbar>
//           </AppBar>
//           <div
//             className="ag-theme-alpine"
//             style={{ height: 400, width: "100%" }} // Set width to 100% for mobile view
//           >
//             <AgGridReact
//               rowData={gridData}
//               columnDefs={columnDefs}
//               defaultColDef={{
//                 flex: 1,
//                 minWidth: 100,
//                 resizable: true,
//               }}
//               animateRows={true}
//               pagination={true}
//               paginationPageSize={10}
//               getRowStyle={(params) => ({
//                 backgroundColor:
//                   params.node.rowIndex % 2 === 0 ? "#cde3f2" : "#ffffff",
//               })}
//             />
//           </div>
//           <Box
//             mt={2}
//             display="flex"
//             flexDirection={{ xs: "column", sm: "row" }}
//             justifyContent="flex-end"
//           >
//             <Button
//               variant="contained"
//               onClick={handleAddRow}
//               sx={{ mb: { xs: 1, sm: 0 }, mr: { sm: 1 } }}
//             >
//               Add Leave
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

// export default PaymLeaveMaster1;












import React, { useState, useEffect } from 'react';
import { Grid, Button, Typography, Box, IconButton } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import { postRequest } from '../../serverconfiguration/requestcomp';
import { ServerConfig } from '../../serverconfiguration/serverconfig';
import { REPORTS, SAVE } from '../../serverconfiguration/controllers';
import Navbar from "../../components/Home Page/Navbar";
import Sidenav from "../../components/Home Page/Sidenav";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { toast } from 'react-toastify';

const PaymLeaveMaster1 = () => {
  const [company, setCompany] = useState([]);
  const [branch, setBranch] = useState([]);
  const [gridData, setGridData] = useState([]);

  const [pnCompanyId, setPnCompanyId] = useState("");  // MAIN COMPANY ID (From Branch Login)

  const isloggedin = sessionStorage.getItem("user");
  const databaseName = sessionStorage.getItem("databaseName");

  console.log("Logged User:", isloggedin);
  console.log("Database:", databaseName);
  console.log("CompanyID:", pnCompanyId);

  // -------------------------------------------------------------------
  // 1️⃣ FETCH BRANCH BY LOGIN → GET COMPANY ID (FIRST STEP ALWAYS)
  // -------------------------------------------------------------------
  const fetchBranchByLogin = async () => {
    try {
      const branchData = await postRequest(ServerConfig.url, REPORTS, {
        query: `SELECT * FROM [${databaseName}].[dbo].[paym_Branch] 
                WHERE branch_user_id = '${isloggedin}'`,
      });

      console.log("Branch Data:", branchData.data);

      setBranch(branchData.data);

      if (branchData.data.length > 0) {
        const compId = branchData.data[0].pn_CompanyID;
        setPnCompanyId(compId);
        console.log("Company ID Found From Branch:", compId);
      } else {
        console.warn("Branch Login User Not Found In Branch Table");
      }
    } catch (error) {
      console.error("Branch Fetch Error:", error);
    }
  };

  // -------------------------------------------------------------------
  // 2️⃣ FETCH COMPANY DATA (AFTER companyId LOADS)
  // -------------------------------------------------------------------
  const fetchCompanyData = async () => {
    try {
      if (!pnCompanyId) return;

      const companyData = await postRequest(ServerConfig.url, REPORTS, {
        query: `SELECT * FROM [${databaseName}].[dbo].[paym_Company] 
                WHERE pn_CompanyID = '${pnCompanyId}'`,
      });

      console.log("Company Data:", companyData.data);
      setCompany(companyData.data);

    } catch (error) {
      console.error("Company Fetch Error:", error);
    }
  };

  // -------------------------------------------------------------------
  // 3️⃣ FETCH LEAVE DATA (AFTER companyId LOADS)
  // -------------------------------------------------------------------
  const fetchLeaveData = async () => {
    try {
      if (!pnCompanyId) return;

      const leaveData = await postRequest(ServerConfig.url, REPORTS, {
        query: `SELECT * FROM [${databaseName}].[dbo].[paym_Leave] 
                WHERE pn_CompanyID = '${pnCompanyId}'`,
      });

      console.log("Leave Data:", leaveData.data);
      setGridData(leaveData.data);
    } catch (error) {
      console.error("Leave Fetch Error:", error);
    }
  };

  // -------------------------------------------------------------------
  // USE EFFECT: 1 — On Login → Fetch Branch → Get Company ID
  // -------------------------------------------------------------------
  useEffect(() => {
    fetchBranchByLogin();
  }, [isloggedin]);

  // -------------------------------------------------------------------
  // USE EFFECT: 2 — When Company ID arrives → Fetch Company & Leave
  // -------------------------------------------------------------------
  useEffect(() => {
    if (pnCompanyId) {
      fetchCompanyData();
      fetchLeaveData();
    }
  }, [pnCompanyId]);

  // -------------------------------------------------------------------
  // ADD LEAVE ROW
  // -------------------------------------------------------------------
  const handleAddRow = () => {
    const newRow = {
      pn_CompanyID: pnCompanyId,
      v_leaveName: "",
      pn_leaveCode: "",
      pn_Count: "",
      status: "",
      pn_BranchID: "",
      annual_leave: "",
      max_days: "",
      EL: "",
      Type: "",
      isNew: true,
    };

    setGridData((prev) => [...prev, newRow]);
  };

  // -------------------------------------------------------------------
  // SAVE ALL NEW ROWS
  // -------------------------------------------------------------------
  const handleSaveAll = async () => {
    const newRows = gridData.filter(row => row.isNew === true);

    if (newRows.length === 0) {
      toast.error("No new data to save!");
      return;
    }

    for (let row of newRows) {
      const query = `
        INSERT INTO [${databaseName}].[dbo].[paym_Leave]
        (pn_CompanyID, v_leaveName, pn_leaveCode, pn_Count, status, pn_BranchID, annual_leave, max_days, EL, Type)
        VALUES ('${pnCompanyId}', '${row.v_leaveName}', '${row.pn_leaveCode}', '${row.pn_Count}', '${row.status}',
                '${row.pn_BranchID}', '${row.annual_leave}', '${row.max_days}', '${row.EL}', '${row.Type}')
      `;

      await postRequest(ServerConfig.url, SAVE, { query });
    }

    toast.success("Saved Successfully!");
    fetchLeaveData(); // refresh
  };

  // -------------------------------------------------------------------
  // UPDATE SINGLE ROW
  // -------------------------------------------------------------------
  const handleUpdateRow = async (data) => {
    try {
      const query = `
        UPDATE [${databaseName}].[dbo].[paym_Leave]
        SET v_leaveName='${data.v_leaveName}',
            pn_leaveCode='${data.pn_leaveCode}',
            pn_Count='${data.pn_Count}',
            status='${data.status}',
            pn_BranchID='${data.pn_BranchID}',
            annual_leave='${data.annual_leave}',
            max_days='${data.max_days}',
            EL='${data.EL}',
            Type='${data.Type}'
        WHERE pn_leaveID='${data.pn_leaveID}'
      `;

      await postRequest(ServerConfig.url, SAVE, { query });
      toast.success("Updated Successfully!");
      fetchLeaveData();
    } catch (error) {
      toast.error("Update Failed!");
    }
  };

  // -------------------------------------------------------------------
  // DELETE ROW
  // -------------------------------------------------------------------
  const handleDeleteRow = async (row) => {
    if (!row.pn_leaveID) {
      setGridData(prev => prev.filter(r => r !== row));
      return;
    }

    const query = `
      DELETE FROM [${databaseName}].[dbo].[paym_Leave]
      WHERE pn_leaveID='${row.pn_leaveID}'
    `;

    await postRequest(ServerConfig.url, SAVE, { query });
    toast.error("Deleted Successfully!");
    fetchLeaveData();
  };

  // -------------------------------------------------------------------
  // GRID COLUMNS
  // -------------------------------------------------------------------
  const columnDefs = [
    { headerName: "LEAVE NAME", field: "v_leaveName", editable: true },
    { headerName: "LEAVE CODE", field: "pn_leaveCode", editable: true },
    { headerName: "COUNT", field: "pn_Count", editable: true },
    { headerName: "STATUS", field: "status", editable: true },
    { headerName: "BRANCH ID", field: "pn_BranchID", editable: true },
    // { headerName: "ANNUAL LEAVE", field: "annual_leave", editable: true },
    { headerName: "MAX DAYS", field: "max_days", editable: true },
    // { headerName: "EL", field: "EL", editable: true },
    { headerName: "TYPE", field: "Type", editable: true },

    // {
    //   headerName: "ACTION",
    //   minWidth: 120,
    //   cellRenderer: (params) => (
    //     <div>
    //       <IconButton onClick={() => handleUpdateRow(params.data)} color="success">
    //         <DoneOutlineIcon />
    //       </IconButton>

    //       <IconButton onClick={() => handleDeleteRow(params.data)} color="error">
    //         <DeleteOutlineIcon />
    //       </IconButton>
    //     </div>
    //   ),
    // },
  ];

  // -------------------------------------------------------------------
  // UI
  // -------------------------------------------------------------------
  return (
    <Grid container>
      <Navbar />
      <Grid item xs={12} sx={{ display: "flex" }}>
        <Sidenav />

        <Grid item xs={12} sx={{ padding: "30px", marginTop: "90px" }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
            LEAVE MANAGEMENT
          </Typography>

          <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
            <AgGridReact
              rowData={gridData}
              columnDefs={columnDefs}
              defaultColDef={{ flex: 1, resizable: true }}
              pagination
            />
          </div>

          {/* <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="contained" onClick={handleAddRow}>
              Add Leave
            </Button>
            <Button variant="contained" color="primary" onClick={handleSaveAll}>
              Save All
            </Button>
          </Box> */}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PaymLeaveMaster1;
