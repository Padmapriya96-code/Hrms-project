// import React, { useState, useEffect } from "react";
// import { Grid, Button, Typography, Box, IconButton, AppBar, Toolbar } from "@mui/material";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
// import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
// import { postRequest } from "../../serverconfiguration/requestcomp";
// import { ServerConfig } from "../../serverconfiguration/serverconfig";
// import { REPORTS, SAVE } from "../../serverconfiguration/controllers";
// import Navbar from "../Home Page-comapny/Navbar1";
// import Sidenav from "../Home Page-comapny/Sidenav1";

// const ShiftFormMaster1 = () => {
//   const [gridData, setGridData] = useState([]);
//   const [pnCompanyId, setPnCompanyId] = useState("");
//   const [companyName, setCompanyName] = useState("");

//   const fetchCompanyData = async () => {
//     const isloggedin = sessionStorage.getItem("user");
//     const companyData = await postRequest(ServerConfig.url, REPORTS, {
//       query: `SELECT * FROM paym_Company WHERE company_user_id = '${isloggedin}'`,
//     });
//     if (companyData.data.length > 0) {
//       setPnCompanyId(companyData.data[0].pn_CompanyID);
//       setCompanyName(companyData.data[0].CompanyName);
//     }
//   };

//   const fetchShiftData = async () => {
//     if (pnCompanyId) {
//       const shiftData = await postRequest(ServerConfig.url, REPORTS, {
//         query: `SELECT [pn_CompanyID], [pn_ShiftID], [v_ShiftName], [v_ShiftFrom], [v_ShiftTo], [status], [BranchID], [v_ShiftCategory] FROM [dbo].[paym_Shift] WHERE pn_CompanyID = '${pnCompanyId}'`,
//       });
//       setGridData(shiftData.data || []);
//     }
//   };

//   useEffect(() => {
//     fetchCompanyData();
//   }, []);

//   useEffect(() => {
//     fetchShiftData();
//   }, [pnCompanyId]);

//   const handleAddRow = () => {
//     const lastRow = gridData[gridData.length - 1];
//     if (
//       lastRow &&
//       (!lastRow.BranchID || !lastRow.v_ShiftName || !lastRow.v_ShiftFrom || !lastRow.v_ShiftTo || !lastRow.status || !lastRow.v_ShiftCategory)
//     ) {
//       alert("Please fill all fields in the current row before adding a new one.");
//       return;
//     }
//     const newRow = {
//       pnCompanyId,
//       BranchID: "",
//       v_ShiftName: "",
//       v_ShiftFrom: "",
//       v_ShiftTo: "",
//       status: "",
//       v_ShiftCategory: "",
//       isNew: true,
//     };
//     setGridData((prev) => [...prev, newRow]);
//   };

//   const handleSaveAll = async () => {
//     try {
//       const newRows = gridData.filter((row) => row.isNew);
//       if (newRows.length === 0) {
//         alert("No new data to save");
//         return;
//       }
//       // Validate all required fields
//       for (const row of newRows) {
//         if (!row.BranchID || !row.v_ShiftName || !row.v_ShiftFrom || !row.v_ShiftTo || !row.status || !row.v_ShiftCategory) {
//           alert("Please fill all fields for new rows before saving.");
//           return;
//         }
//       }
//       // Build and send queries
//       const queries = newRows.map((row) => {
//         return `INSERT INTO [dbo].[paym_Shift]([pn_CompanyID],[BranchID],[v_ShiftName],[v_ShiftFrom],[v_ShiftTo],[status],[v_ShiftCategory]) VALUES ('${row.pnCompanyId}','${row.BranchID}','${row.v_ShiftName}','${row.v_ShiftFrom}','${row.v_ShiftTo}','${row.status}','${row.v_ShiftCategory}')`;
//       });

//       await Promise.all(
//         queries.map((query) => postRequest(ServerConfig.url, SAVE, { query }))
//       );
//       alert("Data saved successfully");
//       await fetchShiftData();
//     } catch (error) {
//       console.error("Error saving data:", error);
//       alert("Failed to save data");
//     }
//   };

//   const handleUpdateRow = async (rowData) => {
//     try {
//       const query = `UPDATE [dbo].[paym_Shift] SET [BranchID] = '${rowData.BranchID}', [v_ShiftName] = '${rowData.v_ShiftName}', [v_ShiftFrom] = '${rowData.v_ShiftFrom}', [v_ShiftTo] = '${rowData.v_ShiftTo}', [status] = '${rowData.status}', [v_ShiftCategory] = '${rowData.v_ShiftCategory}' WHERE [pn_ShiftID] = '${rowData.pn_ShiftID}'`;
//       await postRequest(ServerConfig.url, SAVE, { query });
//       alert("Data updated successfully");
//       await fetchShiftData();
//     } catch (error) {
//       console.error("Error updating data:", error);
//       alert("Failed to update data");
//     }
//   };

//   const handleDeleteRow = async (rowData) => {
//     try {
//       const query = `DELETE FROM [dbo].[paym_Shift] WHERE [pn_ShiftID] = '${rowData.pn_ShiftID}'`;
//       await postRequest(ServerConfig.url, SAVE, { query });
//       alert("Data deleted successfully");
//       await fetchShiftData();
//     } catch (error) {
//       console.error("Error deleting data:", error);
//       alert("Failed to delete data");
//     }
//   };

//   const columnDefs = [
//     { headerName: "BRANCH NAME", field: "BranchID", editable: true },
//     { headerName: "SHIFT NAME", field: "v_ShiftName", editable: true },
//     { headerName: "SHIFT FROM", field: "v_ShiftFrom", editable: true },
//     { headerName: "SHIFT TO", field: "v_ShiftTo", editable: true },
//     { headerName: "STATUS", field: "status", editable: true },
//     { headerName: "SHIFT CATEGORY", field: "v_ShiftCategory", editable: true },
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
//     },
//   ];

//   return (
//     <Grid container style={{ backgroundColor: '#f5f5f5' }}>
//       <Navbar />
//       <Grid item xs={12} sx={{ display: "flex" }}>
//         <Sidenav />
//         <Grid
//           item xs={12} sm={10} md={9} lg={9} // Decreased width for larger screens
//           sx={{ padding: { xs: "20px", sm: "40px" }, overflowY: "auto", margin: '0 auto' }}
//         >
//           <AppBar position="static" sx={{ width: '100%', marginTop: "70px", minHeight: "60px" }}>
//             <Toolbar sx={{ justifyContent: 'left', height: '100%' }}>
//               <Typography
//                 variant="h5"
//                 gutterBottom
//                 sx={{ textAlign: 'left', fontWeight: 'bold', color: 'white', lineHeight: '60px' }}
//               >
//                 SHIFT FORM
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
//               getRowStyle={params => ({
//                 backgroundColor: params.node.rowIndex % 2 === 0 ? '#cde3f2' : '#ffffff'
//               })}
//             />
//           </div>
//           <Box mt={2} display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="flex-end">
//             <Button
//               variant="contained"
//               onClick={handleAddRow}
//               sx={{
//                 mb: { xs: 1, sm: 0 },
//                 mr: { sm: 1 },
//                 width: { xs: '100%', sm: 'auto' } // Full width on mobile
//               }}
//             >
//               Add Shift
//             </Button>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={handleSaveAll}
//               sx={{
//                 width: { xs: '100%', sm: 'auto' } // Full width on mobile
//               }}
//             >
//               Save All
//             </Button>
//           </Box>
//         </Grid>
//       </Grid>
//     </Grid>
//   );
// };

// export default ShiftFormMaster1;
