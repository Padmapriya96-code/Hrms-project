// import React, { useState, useEffect, useRef } from "react";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import {
//   Button,
//   Box,
//   Typography,
//   IconButton,
//   Tooltip,
//   CircularProgress,
//   Alert,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Grid,
//   AppBar,
//   Toolbar,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
// } from "@mui/material";
// import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
// import Navbar from "../../../Home Page-comapny/Navbar1";
// import { toast } from "react-toastify";
// import Sidenav from "../../../Home Page-comapny/Sidenav1";
// import { postRequest } from "../../../../serverconfiguration/requestcomp";
// import { ServerConfig } from "../../../../serverconfiguration/serverconfig";
// import { REPORTS } from "../../../../serverconfiguration/controllers";

// const AssetGridForm = () => {
//   const [rowData, setRowData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [selectedRowId, setSelectedRowId] = useState(null);
//   const [confirmOpen, setConfirmOpen] = useState(false);
//   const gridApiRef = useRef(null);
//   const [gridHeight] = useState(500);

//   const [isloggedin] = useState(sessionStorage.getItem("user"));
//   const [pnCompanyId, setPnCompanyId] = useState("");
//   const [loggedCompanyId, setLoggedCompanyId] = useState(null);
//   const [loggedBranchId, setLoggedBranchId] = useState(null);

//   const [company, setCompany] = useState([]);
//   const [branch, setBranch] = useState([]);

//   // Fetch company info based on logged in user
//   useEffect(() => {
//     const fetchCompanyData = async () => {
//       const companyData = await postRequest(ServerConfig.url, REPORTS, {
//         query: `SELECT * FROM paym_Company WHERE company_user_id = '${isloggedin}'`,
//       });
//       setCompany(companyData.data);
//       if (companyData.data.length > 0) {
//         const companyId = companyData.data[0].pn_CompanyID;
//         setPnCompanyId(companyId);
//         setLoggedCompanyId(companyId);
//       }
//     };
//     fetchCompanyData();
//   }, [isloggedin]);

//   // Fetch branch list for company
//   useEffect(() => {
//     const fetchBranchData = async () => {
//       if (pnCompanyId) {
//         const branchData = await postRequest(ServerConfig.url, REPORTS, {
//           query: `SELECT * FROM paym_branch WHERE pn_CompanyID = '${pnCompanyId}'`,
//         });
//         setBranch(branchData.data);
//         if (branchData.data.length > 0) {
//           setLoggedBranchId(branchData.data[0].pn_BranchID);
//         }
//       }
//     };
//     fetchBranchData();
//   }, [pnCompanyId]);

//   // Fetch assets with employee assignment details
//   const fetchAssetsWithEmployee = async () => {
//     if (!loggedCompanyId || !loggedBranchId) return;
//     setLoading(true);
//     try {
//       const res = await fetch(
//         `https://localhost:7266/api/AssignAssetToEmployee/with-employee?branchId=${loggedBranchId}`
//       );
//       if (!res.ok) throw new Error("Failed to fetch assigned asset data.");
//       const data = await res.json();
//       console.log("Assets fetched:", data);
//       setRowData(data);
//       setError(null);
//     } catch (err) {
//       setError(err.message || "Failed to load assets.");
//       setRowData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAssetsWithEmployee();
//   }, [loggedCompanyId, loggedBranchId]);

//   // DatePicker editor for ag-Grid
//   const DatePickerEditor = function () {};
//   DatePickerEditor.prototype.init = function (params) {
//     this.eInput = document.createElement("input");
//     this.eInput.type = "date";
//     this.eInput.className = "ag-input-field-input";
//     this.eInput.style.width = "100%";
//     this.eInput.value = params.value ? params.value.substring(0, 10) : "";
//   };
//   DatePickerEditor.prototype.getGui = function () {
//     return this.eInput;
//   };
//   DatePickerEditor.prototype.afterGuiAttached = function () {
//     this.eInput.focus();
//   };
//   DatePickerEditor.prototype.getValue = function () {
//     return this.eInput.value;
//   };
//   DatePickerEditor.prototype.destroy = function () {};
//   DatePickerEditor.prototype.isPopup = function () {
//     return false;
//   };

//   // Add new blank asset row
//   const handleAddRow = () => {
//     // Check if the last row exists and has empty required fields
//     const lastRow = rowData[0]; // Since you're adding to beginning of array
//     if (
//       lastRow &&
//       (!lastRow.assetType ||
//         !lastRow.assetName ||
//         !lastRow.assetSerialNumber ||
//         !lastRow.purchaseDate ||
//         !lastRow.assetValue)
//     ) {
//       toast.dismiss();
//       toast.warning(
//         "Please fill all required fields in the current row before adding a new one",
//         {
//           position: "top-center", // Centers horizontally
//           style: { textAlign: "center" }, // Centers text
//           autoClose: 1000,
//         }
//       );
//       return;
//     }

//     // Add new row only if validation passes
//     const newRow = {
//       assetType: "",
//       assetName: "",
//       assetSerialNumber: "",
//       purchaseDate: "",
//       assetValue: "",
//       status: "Active",
//       description: "",
//       assetAssignedTo: null,
//       createdDate: new Date().toISOString(),
//       PnCompanyId: loggedCompanyId,
//       BranchId: loggedBranchId,
//       isNew: true, // Added flag to identify new rows
//     };

//     setRowData((prev) => [newRow, ...prev]);
//   };

//   // Save asset (new or update)
//   const handleSaveRow = async (row) => {
//     try {
//       if (!row.assetName || !row.assetSerialNumber) {
//         toast.error("Please fill in Asset Name and Serial Number.", {
//           position: "top-center", // Centers horizontally
//           style: { textAlign: "center" }, // Centers text
//           autoClose: 1000,
//         });
//         return;
//       }

//       const isNew = !row.pnAssetid && !row.PnAssetid; // check both cases
//       const updatedRow = {
//         ...row,
//         PnCompanyId: loggedCompanyId,
//         PnBranchId: loggedBranchId,
//       };

//       const url = isNew
//         ? "https://localhost:7266/api/Assets"
//         : `https://localhost:7266/api/Assets/${row.pnAssetid || row.PnAssetid}`;
//       const method = isNew ? "POST" : "PUT";

//       const res = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updatedRow),
//       });

//       if (!res.ok)
//         throw new Error(
//           `Failed to ${method === "POST" ? "add" : "update"} asset`
//         );
//       if (method === "POST") {
//         toast.info("Asset saved successfully!", {
//           position: "top-center", // Centers horizontally
//           style: { textAlign: "center" }, // Centers text
//           autoClose: 1000,
//         });
//       } else {
//         toast.success("Asset updated successfully!", {
//           position: "top-center", // Centers horizontally
//           style: { textAlign: "center" }, // Centers text
//           autoClose: 1000,
//         });
//       }
//       fetchAssetsWithEmployee();
//     } catch (error) {
//       console.error(error);
//       toast.error(error.message || "Save failed");
//     }
//   };

//   // Delete asset row
//   const handleDeleteRow = async () => {
//     if (!selectedRowId) return;
//     try {
//       const res = await fetch(
//         `https://localhost:7266/api/Assets/${selectedRowId}`,
//         { method: "DELETE" }
//       );
//       if (!res.ok) throw new Error("Delete failed");
//       toast.error("Asset deleted successfully!");
//       fetchAssetsWithEmployee();
//       setConfirmOpen(false);
//       setSelectedRowId(null);
//     } catch (error) {
//       toast.error("Delete failed");
//     }
//   };

//   // ag-Grid columns definition
//   const columnDefs = [
//     {
//       field: "assetType",
//       headerName: "Asset Type",
//       editable: true,
//       cellStyle: { textAlign: "left" },
//     },
//     {
//       field: "assetName",
//       headerName: "Asset Name",
//       editable: true,
//       cellStyle: { textAlign: "left" },
//     },
//     {
//       field: "assetSerialNumber",
//       headerName: "Serial Number",
//       editable: true,
//       cellStyle: { textAlign: "left" },
//     },
//     {
//       field: "purchaseDate",
//       headerName: "Purchase Date",
//       editable: true,
//       cellStyle: { textAlign: "left" },
//       cellEditor: "datePickerEditor",
//       valueFormatter: (params) =>
//         params.value ? params.value.split("T")[0] : "",
//     },
//     {
//       field: "assetValue",
//       headerName: "Value",
//       editable: true,
//       type: "numberColumn",
//       cellStyle: { textAlign: "left" },
//     },
//     {
//       field: "description",
//       headerName: "Description",
//       editable: true,
//       cellStyle: { textAlign: "left" },
//     },

//     {
//       field: "status",
//       headerName: "Status",
//       editable: false,
//       cellStyle: (params) => ({
//         color: params.value === "Assigned" ? "red" : "green",
//         textAlign: "left", // Ensure left alignment
//       }),
//     },
//     {
//       field: "assignedToEmployeeName",
//       headerName: "Assigned To",
//       editable: false,
//       cellStyle: (params) => {
//         let style = {
//           color: "black", // Always black
//           textAlign: "left", // Ensure left alignment
//         };

//         // Optionally, apply background color or other styles based on status
//         if (params.data.status === "Assigned") {
//           // light red background (optional)
//         } else if (params.data.status === "Active") {
//         }

//         return style;
//       },
//     },
//     {
//       headerName: "Actions",
//       cellRenderer: (params) => (
//         <Box display="flex" gap={1}>
//           <Tooltip title="Save">
//             <IconButton
//               onClick={() => handleSaveRow(params.data)}
//               color="success"
//             >
//               <DoneOutlineIcon />
//             </IconButton>
//           </Tooltip>
//           <Tooltip title="Delete">
//             <IconButton
//               onClick={() => {
//                 setSelectedRowId(
//                   params.data.pnAssetid || params.data.PnAssetid
//                 );
//                 setConfirmOpen(true);
//               }}
//               color="error"
//             >
//               <DeleteOutlineIcon />
//             </IconButton>
//           </Tooltip>
//         </Box>
//       ),
//       editable: false,
//       flex: 1,
//       minWidth: 120,
//     },
//   ];

//   if (loading) return <CircularProgress />;
//   if (error) return <Alert severity="error">{error}</Alert>;

//   return (
//     <Grid container style={{ backgroundColor: "#f5f5f5" }}>
//       <Navbar />
//       <Grid item xs={12} sx={{ display: "flex" }}>
//         <Sidenav />
//         <Grid
//           item
//           xs={12}
//           sm={10}
//           md={10}
//           lg={10}
//           sx={{
//             padding: { xs: "20px", sm: "40px" },
//             overflowY: "auto",
//             margin: "0 auto",
//           }}
//         >
//           <Grid item xs={4} sm={4} sx={{ mt: 6, mb: 1 }}>
//             <FormControl fullWidth>
//               <InputLabel id="branch-select-label">Select Branch</InputLabel>
//               <Select
//                 labelId="branch-select-label"
//                 id="branch-select"
//                 value={loggedBranchId || ""}
//                 label="Select Branch"
//                 onChange={(e) => setLoggedBranchId(e.target.value)}
//               >
//                 {branch.map((b) => (
//                   <MenuItem key={b.pn_BranchID} value={b.pn_BranchID}>
//                     {b.BranchName}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>

//           <AppBar position="static" sx={{ width: "100%", minHeight: "60px" }}>
//             <Toolbar sx={{ justifyContent: "left", height: "100%" }}>
//               <Typography
//                 variant="h5"
//                 gutterBottom
//                 sx={{ fontWeight: "bold", color: "white", lineHeight: "60px" }}
//               >
//                 ASSETS
//               </Typography>
//             </Toolbar>
//           </AppBar>

//           <div
//             className="ag-theme-alpine"
//             style={{ height: gridHeight, width: "100%", overflowX: "auto" }}
//           >
//             <AgGridReact
//               rowData={rowData}
//               columnDefs={columnDefs}
//               getRowHeight={() => 33}
//               defaultColDef={{
//                 editable: true,
//                 sortable: true,
//                 filter: true,
//                 resizable: true,
//               }}
//               pagination={true}
//               components={{ datePickerEditor: DatePickerEditor }}
//               onGridReady={(params) => (gridApiRef.current = params.api)}
//               stopEditingWhenCellsLoseFocus={true}
//               getRowStyle={(params) => ({
//                 backgroundColor:
//                   params.node.rowIndex % 2 === 0 ? "#cde3f2" : "#ffffff",
//               })}
//             />
//           </div>

//           <Box mt={2} display="flex" justifyContent="flex-end">
//             <Button
//               variant="contained"
//               onClick={handleAddRow}
//               disabled={!loggedBranchId}
//             >
//               Add Asset
//             </Button>
//           </Box>

//           <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
//             <DialogTitle>Confirm Delete</DialogTitle>
//             <DialogContent>
//               Are you sure you want to delete this asset?
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
//               <Button onClick={handleDeleteRow} color="error">
//                 Delete
//               </Button>
//             </DialogActions>
//           </Dialog>
//         </Grid>
//       </Grid>
//     </Grid>
//   );
// };

// export default AssetGridForm;



// its working but small issue in fetch with table
// import React, { useState, useEffect, useRef } from "react";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import {
//   Button,
//   Box,
//   Typography,
//   IconButton,
//   Tooltip,
//   CircularProgress,
//   Alert,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Grid,
//   AppBar,
//   Toolbar,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
// } from "@mui/material";
// import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
// import Navbar from "../../../Home Page-comapny/Navbar1";
// import Sidenav from "../../../Home Page-comapny/Sidenav1";
// import { toast } from "react-toastify";
// import { postRequest } from "../../../../serverconfiguration/requestcomp";
// import { ServerConfig } from "../../../../serverconfiguration/serverconfig";
// import { REPORTS, SAVE } from "../../../../serverconfiguration/controllers";

// const AssetGridForm = () => {
//   const [rowData, setRowData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [selectedRowId, setSelectedRowId] = useState(null);
//   const [confirmOpen, setConfirmOpen] = useState(false);
//   const gridApiRef = useRef(null);
//   const [gridHeight] = useState(500);

//   const [isloggedin] = useState(sessionStorage.getItem("user"));
//   const [pnCompanyId, setPnCompanyId] = useState("");
//   const [loggedCompanyId, setLoggedCompanyId] = useState(null);
//   const [loggedBranchId, setLoggedBranchId] = useState(null);
//   const [company, setCompany] = useState([]);
//   const [branch, setBranch] = useState([]);
//   const databaseName = sessionStorage.getItem("databaseName");

//   // ✅ Fetch company info
//   useEffect(() => {
//     const fetchCompanyData = async () => {
//       try {
//         const companyData = await postRequest(ServerConfig.url, REPORTS, {
//           query: `SELECT [pn_CompanyID], [CompanyName] 
//                   FROM [${databaseName}].[dbo].[paym_Company] 
//                   WHERE company_user_id = '${isloggedin}'`,
//         });
//         setCompany(companyData.data);
//         if (companyData.data.length > 0) {
//           const companyId = companyData.data[0].pn_CompanyID;
//           setPnCompanyId(companyId);
//           setLoggedCompanyId(companyId);
//         }
//       } catch (error) {
//         console.error("Error fetching company data:", error);
//       }
//     };
//     fetchCompanyData();
//   }, [isloggedin, databaseName]);

//   // ✅ Fetch branch list
//   useEffect(() => {
//     const fetchBranchData = async () => {
//       if (pnCompanyId) {
//         try {
//           const branchData = await postRequest(ServerConfig.url, REPORTS, {
//             query: `SELECT [pn_BranchID], [BranchName]
//                     FROM [${databaseName}].[dbo].[paym_Branch]
//                     WHERE pn_CompanyID = '${pnCompanyId}'`,
//           });
//           setBranch(branchData.data);
//           if (branchData.data.length > 0) {
//             setLoggedBranchId(branchData.data[0].pn_BranchID);
//           }
//         } catch (error) {
//           console.error("Error fetching branches:", error);
//         }
//       }
//     };
//     fetchBranchData();
//   }, [pnCompanyId, databaseName]);

//   // ✅ Fetch asset data directly via REPORTS controller
//   const fetchAssetsFromDB = async () => {
//     if (!loggedBranchId || !loggedCompanyId) return;
//     setLoading(true);
//     try {
//       const query = `
//         SELECT 
//           pnAssetid,
//           AssetType,
//           AssetName,
//           AssetSerialNumber,
//           PurchaseDate,
//           AssetValue,
//           Status,
//           Description,
//           AssetAssignedTo,
//           CreatedDate
//         FROM [${databaseName}].[dbo].[Assets]
//         WHERE PnCompanyId = ${loggedCompanyId} AND BranchId = ${loggedBranchId}
//         ORDER BY CreatedDate DESC;
//       `;
//       const res = await postRequest(ServerConfig.url, REPORTS, { query });

//       if (res.data && Array.isArray(res.data)) {
//         setRowData(res.data);
//       } else {
//         setRowData([]);
//       }
//       setError(null);
//     } catch (err) {
//       console.error("Error fetching assets:", err);
//       setError(err.message);
//       toast.error("Failed to fetch asset data from DB");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAssetsFromDB();
//   }, [loggedBranchId, loggedCompanyId]);

//   // ✅ AG Grid Date Picker
//   const DatePickerEditor = function () {};
//   DatePickerEditor.prototype.init = function (params) {
//     this.eInput = document.createElement("input");
//     this.eInput.type = "date";
//     this.eInput.className = "ag-input-field-input";
//     this.eInput.style.width = "100%";
//     this.eInput.value = params.value ? params.value.substring(0, 10) : "";
//   };
//   DatePickerEditor.prototype.getGui = function () {
//     return this.eInput;
//   };
//   DatePickerEditor.prototype.afterGuiAttached = function () {
//     this.eInput.focus();
//   };
//   DatePickerEditor.prototype.getValue = function () {
//     return this.eInput.value;
//   };
//   DatePickerEditor.prototype.destroy = function () {};
//   DatePickerEditor.prototype.isPopup = function () {
//     return false;
//   };

//   // ✅ Add new row
//   const handleAddRow = () => {
//     const lastRow = rowData[0];
//     if (
//       lastRow &&
//       (!lastRow.AssetType ||
//         !lastRow.AssetName ||
//         !lastRow.AssetSerialNumber ||
//         !lastRow.PurchaseDate ||
//         !lastRow.AssetValue)
//     ) {
//       toast.warning("Please fill all fields in the last row.", {
//         position: "top-center",
//         autoClose: 1000,
//       });
//       return;
//     }

//     const newRow = {
//       PnCompanyId: loggedCompanyId,
//       BranchId: loggedBranchId,
//       AssetType: "",
//       AssetName: "",
//       AssetSerialNumber: "",
//       PurchaseDate: "",
//       AssetValue: "",
//       Status: "Active",
//       Description: "",
//       CreatedDate: new Date().toISOString(),
//       isNew: true,
//     };
//     setRowData((prev) => [newRow, ...prev]);
//   };

//   // ✅ Save asset (INSERT or UPDATE)
//   const handleSaveRow = async (row) => {
//     try {
//       if (!row.AssetName || !row.AssetSerialNumber) {
//         toast.error("Asset Name and Serial Number are required.", {
//           position: "top-center",
//           autoClose: 1000,
//         });
//         return;
//       }

//       const isNew = !row.pnAssetid;

//       const query = isNew
//         ? `
//           INSERT INTO [${databaseName}].[dbo].[Assets]
//           (PnCompanyId, BranchId, AssetType, AssetName, AssetSerialNumber, PurchaseDate, AssetValue, Status, Description, CreatedDate)
//           VALUES
//           (${loggedCompanyId}, ${loggedBranchId}, '${row.AssetType}', '${row.AssetName}', '${row.AssetSerialNumber}', '${row.PurchaseDate}', ${row.AssetValue || 0}, '${row.Status}', '${row.Description || ""}', GETDATE())
//         `
//         : `
//           UPDATE [${databaseName}].[dbo].[Assets]
//           SET AssetType='${row.AssetType}', AssetName='${row.AssetName}', AssetSerialNumber='${row.AssetSerialNumber}',
//               PurchaseDate='${row.PurchaseDate}', AssetValue=${row.AssetValue || 0}, 
//               Status='${row.Status}', Description='${row.Description || ""}'
//           WHERE pnAssetid=${row.pnAssetid}
//         `;

//       await postRequest(ServerConfig.url, SAVE, { query });

//       toast.success(isNew ? "Asset added successfully" : "Asset updated successfully", {
//         position: "top-center",
//         autoClose: 1000,
//       });

//       fetchAssetsFromDB();
//     } catch (err) {
//       console.error("Save failed:", err);
//       toast.error("Save operation failed.");
//     }
//   };

//   // ✅ Delete asset
//   const handleDeleteRow = async () => {
//     if (!selectedRowId) return;
//     try {
//       const query = `
//         DELETE FROM [${databaseName}].[dbo].[Assets]
//         WHERE pnAssetid = ${selectedRowId}
//       `;
//       await postRequest(ServerConfig.url, SAVE, { query });
//       toast.error("Asset deleted successfully!");
//       fetchAssetsFromDB();
//       setConfirmOpen(false);
//       setSelectedRowId(null);
//     } catch (error) {
//       console.error("Delete failed:", error);
//       toast.error("Failed to delete asset.");
//     }
//   };

//   // ✅ Grid Columns
//   const columnDefs = [
//     { field: "AssetType", headerName: "Asset Type", editable: true },
//     { field: "AssetName", headerName: "Asset Name", editable: true },
//     { field: "AssetSerialNumber", headerName: "Serial Number", editable: true },
//     {
//       field: "PurchaseDate",
//       headerName: "Purchase Date",
//       editable: true,
//       cellEditor: "datePickerEditor",
//       valueFormatter: (params) =>
//         params.value ? params.value.split("T")[0] : "",
//     },
//     { field: "AssetValue", headerName: "Value", editable: true },
//     { field: "Description", headerName: "Description", editable: true },
//     {
//       field: "Status",
//       headerName: "Status",
//       editable: true,
//       cellStyle: (params) => ({
//         color: params.value === "Assigned" ? "red" : "green",
//       }),
//     },
//     {
//       headerName: "Actions",
//       cellRenderer: (params) => (
//         <Box display="flex" gap={1}>
//           <Tooltip title="Save">
//             <IconButton
//               onClick={() => handleSaveRow(params.data)}
//               color="success"
//             >
//               <DoneOutlineIcon />
//             </IconButton>
//           </Tooltip>
//           <Tooltip title="Delete">
//             <IconButton
//               onClick={() => {
//                 setSelectedRowId(params.data.pnAssetid);
//                 setConfirmOpen(true);
//               }}
//               color="error"
//             >
//               <DeleteOutlineIcon />
//             </IconButton>
//           </Tooltip>
//         </Box>
//       ),
//     },
//   ];

//   if (loading) return <CircularProgress />;

//   return (
//     <Grid container style={{ backgroundColor: "#f5f5f5" }}>
//       <Navbar />
//       <Grid item xs={12} sx={{ display: "flex" }}>
//         <Sidenav />
//         <Grid
//           item
//           xs={12}
//           sm={10}
//           md={10}
//           lg={10}
//           sx={{
//             padding: { xs: "20px", sm: "40px" },
//             overflowY: "auto",
//             margin: "0 auto",
//           }}
//         >
//           <AppBar position="static" sx={{ width: "100%", minHeight: "60px" }}>
//             <Toolbar sx={{ justifyContent: "left", height: "100%" }}>
//               <Typography
//                 variant="h5"
//                 sx={{ fontWeight: "bold", color: "white", lineHeight: "60px" }}
//               >
//                 ASSETS
//               </Typography>
//             </Toolbar>
//           </AppBar>

//           {error && (
//             <Box mt={2}>
//               <Alert severity="error">{error}</Alert>
//             </Box>
//           )}

//           <div
//             className="ag-theme-alpine"
//             style={{ height: gridHeight, width: "100%", overflowX: "auto" }}
//           >
//             <AgGridReact
//               rowData={rowData}
//               columnDefs={columnDefs}
//               getRowHeight={() => 33}
//               defaultColDef={{
//                 editable: true,
//                 sortable: true,
//                 filter: true,
//                 resizable: true,
//               }}
//               pagination={true}
//               components={{ datePickerEditor: DatePickerEditor }}
//               onGridReady={(params) => (gridApiRef.current = params.api)}
//               stopEditingWhenCellsLoseFocus={true}
//               getRowStyle={(params) => ({
//                 backgroundColor:
//                   params.node.rowIndex % 2 === 0 ? "#cde3f2" : "#ffffff",
//               })}
//             />
//           </div>

//           <Box mt={2} display="flex" justifyContent="flex-end">
//             <Button
//               variant="contained"
//               onClick={handleAddRow}
//               disabled={!loggedBranchId}
//             >
//               Add Asset
//             </Button>
//           </Box>

//           <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
//             <DialogTitle>Confirm Delete</DialogTitle>
//             <DialogContent>
//               Are you sure you want to delete this asset?
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
//               <Button onClick={handleDeleteRow} color="error">
//                 Delete
//               </Button>
//             </DialogActions>
//           </Dialog>
//         </Grid>
//       </Grid>
//     </Grid>
//   );
// };

// export default AssetGridForm;






import React, { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  Button,
  Box,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  AppBar,
  Toolbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Navbar from "../../../Home Page-comapny/Navbar1";
import Sidenav from "../../../Home Page-comapny/Sidenav1";
import { toast } from "react-toastify";
import { postRequest } from "../../../../serverconfiguration/requestcomp";
import { ServerConfig } from "../../../../serverconfiguration/serverconfig";
import { REPORTS, SAVE } from "../../../../serverconfiguration/controllers";

const AssetGridForm = () => {
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const gridApiRef = useRef(null);
  const [gridHeight] = useState(500);

  const [isloggedin] = useState(sessionStorage.getItem("user"));
  const [pnCompanyId, setPnCompanyId] = useState("");
  const [loggedCompanyId, setLoggedCompanyId] = useState(null);
  const [loggedBranchId, setLoggedBranchId] = useState(null);
  const [company, setCompany] = useState([]);
  const [branch, setBranch] = useState([]);
  const databaseName = sessionStorage.getItem("databaseName");

  // ✅ Fetch company info
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const companyData = await postRequest(ServerConfig.url, REPORTS, {
          query: `SELECT [pn_CompanyID], [CompanyName] 
                  FROM [${databaseName}].[dbo].[paym_Company] 
                  WHERE company_user_id = '${isloggedin}'`,
        });
        setCompany(companyData.data);
        if (companyData.data.length > 0) {
          const companyId = companyData.data[0].pn_CompanyID;
          setPnCompanyId(companyId);
          setLoggedCompanyId(companyId);
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };
    fetchCompanyData();
  }, [isloggedin, databaseName]);

  // ✅ Fetch branch list
  useEffect(() => {
    const fetchBranchData = async () => {
      if (pnCompanyId) {
        try {
          const branchData = await postRequest(ServerConfig.url, REPORTS, {
            query: `SELECT [pn_BranchID], [BranchName]
                    FROM [${databaseName}].[dbo].[paym_Branch]
                    WHERE pn_CompanyID = '${pnCompanyId}'`,
          });
          setBranch(branchData.data);
          if (branchData.data.length > 0) {
            setLoggedBranchId(branchData.data[0].pn_BranchID);
          }
        } catch (error) {
          console.error("Error fetching branches:", error);
        }
      }
    };
    fetchBranchData();
  }, [pnCompanyId, databaseName]);

  // ✅ Fetch assets from DB
  const fetchAssetsFromDB = async () => {
    if (!loggedBranchId || !loggedCompanyId) return;
    setLoading(true);
    try {
      const query = `
        SELECT 
          [pn_Assetid],
          [AssetType],
          [Asset_name] AS AssetName,
          [Asset_SerialNumber] AS AssetSerialNumber,
          [PurchaseDate],
          [AssetValue],
          [Status],
          [Description],
          [CreatedDate],
          [AssetAssignedTo]
        FROM [${databaseName}].[dbo].[Assets]
        WHERE [pn_CompanyID] = ${loggedCompanyId} AND [BranchID] = ${loggedBranchId}
        ORDER BY [CreatedDate] DESC;
      `;
      const res = await postRequest(ServerConfig.url, REPORTS, { query });

      if (res.data && Array.isArray(res.data)) {
        setRowData(res.data);
      } else {
        setRowData([]);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching assets:", err);
      setError(err.message);
      toast.error("Failed to fetch asset data from DB");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssetsFromDB();
  }, [loggedBranchId, loggedCompanyId]);

  // ✅ Date Picker
  const DatePickerEditor = function () {};
  DatePickerEditor.prototype.init = function (params) {
    this.eInput = document.createElement("input");
    this.eInput.type = "date";
    this.eInput.className = "ag-input-field-input";
    this.eInput.style.width = "100%";
    this.eInput.value = params.value ? params.value.substring(0, 10) : "";
  };
  DatePickerEditor.prototype.getGui = function () {
    return this.eInput;
  };
  DatePickerEditor.prototype.afterGuiAttached = function () {
    this.eInput.focus();
  };
  DatePickerEditor.prototype.getValue = function () {
    return this.eInput.value;
  };
  DatePickerEditor.prototype.destroy = function () {};
  DatePickerEditor.prototype.isPopup = function () {
    return false;
  };

  // ✅ Add new row
  const handleAddRow = () => {
    const lastRow = rowData[0];
    if (
      lastRow &&
      (!lastRow.AssetType ||
        !lastRow.AssetName ||
        !lastRow.AssetSerialNumber ||
        !lastRow.PurchaseDate ||
        !lastRow.AssetValue)
    ) {
      toast.warning("Please fill all fields in the last row.", {
        position: "top-center",
        autoClose: 1000,
      });
      return;
    }

    const newRow = {
      pnCompanyId: loggedCompanyId,
      BranchID: loggedBranchId,
      AssetType: "",
      AssetName: "",
      AssetSerialNumber: "",
      PurchaseDate: "",
      AssetValue: "",
      Status: "Active",
      Description: "",
      CreatedDate: new Date().toISOString(),
      isNew: true,
    };
    setRowData((prev) => [newRow, ...prev]);
  };

  // ✅ Save asset
  const handleSaveRow = async (row) => {
    try {
      if (!row.AssetName || !row.AssetSerialNumber) {
        toast.error("Asset Name and Serial Number are required.", {
          position: "top-center",
          autoClose: 1000,
        });
        return;
      }

      const isNew = !row.pn_Assetid;

      const query = isNew
        ? `
          INSERT INTO [${databaseName}].[dbo].[Assets]
          ([pn_CompanyID], [BranchID], [AssetType], [Asset_name], [Asset_SerialNumber], [PurchaseDate], [AssetValue], [Status], [Description], [CreatedDate])
          VALUES
          (${loggedCompanyId}, ${loggedBranchId}, '${row.AssetType}', '${row.AssetName}', '${row.AssetSerialNumber}', '${row.PurchaseDate}', ${row.AssetValue || 0}, '${row.Status}', '${row.Description || ""}', GETDATE())
        `
        : `
          UPDATE [${databaseName}].[dbo].[Assets]
          SET [AssetType] = '${row.AssetType}',
              [Asset_name] = '${row.AssetName}',
              [Asset_SerialNumber] = '${row.AssetSerialNumber}',
              [PurchaseDate] = '${row.PurchaseDate}',
              [AssetValue] = ${row.AssetValue || 0},
              [Status] = '${row.Status}',
              [Description] = '${row.Description || ""}'
          WHERE [pn_Assetid] = ${row.pn_Assetid}
        `;

      await postRequest(ServerConfig.url, SAVE, { query });

      toast.success(isNew ? "Asset added successfully" : "Asset updated successfully", {
        position: "top-center",
        autoClose: 1000,
      });

      fetchAssetsFromDB();
    } catch (err) {
      console.error("Save failed:", err);
      toast.error("Save operation failed.");
    }
  };

  // ✅ Delete asset
  const handleDeleteRow = async () => {
    if (!selectedRowId) return;
    try {
      const query = `
        DELETE FROM [${databaseName}].[dbo].[Assets]
        WHERE [pn_Assetid] = ${selectedRowId}
      `;
      await postRequest(ServerConfig.url, SAVE, { query });
      toast.error("Asset deleted successfully!");
      fetchAssetsFromDB();
      setConfirmOpen(false);
      setSelectedRowId(null);
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete asset.");
    }
  };

  const columnDefs = [
    { field: "AssetType", headerName: "Asset Type", editable: true },
    { field: "AssetName", headerName: "Asset Name", editable: true },
    { field: "AssetSerialNumber", headerName: "Serial Number", editable: true },
    {
      field: "PurchaseDate",
      headerName: "Purchase Date",
      editable: true,
      cellEditor: "datePickerEditor",
      valueFormatter: (params) =>
        params.value ? params.value.split("T")[0] : "",
    },
    { field: "AssetValue", headerName: "Value", editable: true },
    { field: "Description", headerName: "Description", editable: true },
    {
      field: "Status",
      headerName: "Status",
      editable: true,
      cellStyle: (params) => ({
        color: params.value === "Assigned" ? "red" : "green",
      }),
    },
    {
      headerName: "Actions",
      cellRenderer: (params) => (
        <Box display="flex" gap={1}>
          <Tooltip title="Save">
            <IconButton
              onClick={() => handleSaveRow(params.data)}
              color="success"
            >
              <DoneOutlineIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              onClick={() => {
                setSelectedRowId(params.data.pn_Assetid);
                setConfirmOpen(true);
              }}
              color="error"
            >
              <DeleteOutlineIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  if (loading) return <CircularProgress />;

  return (
    <Grid container style={{ backgroundColor: "#f5f5f5" }}>
      <Navbar />
      <Grid item xs={12} sx={{ display: "flex" }}>
        <Sidenav />
        <Grid
          item
          xs={12}
          sm={10}
          md={10}
          lg={10}
          sx={{
            padding: { xs: "20px", sm: "40px" },
            overflowY: "auto",
            margin: "0 auto",
          }}
        >
          <AppBar position="static" sx={{ width: "100%", minHeight: "60px" }}>
            <Toolbar sx={{ justifyContent: "left", height: "100%" }}>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", color: "white", lineHeight: "60px" }}
              >
                ASSETS
              </Typography>
            </Toolbar>
          </AppBar>

          {error && (
            <Box mt={2}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}

          <div
            className="ag-theme-alpine"
            style={{ height: gridHeight, width: "100%", overflowX: "auto" }}
          >
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              getRowHeight={() => 33}
              defaultColDef={{
                editable: true,
                sortable: true,
                filter: true,
                resizable: true,
              }}
              pagination={true}
              components={{ datePickerEditor: DatePickerEditor }}
              onGridReady={(params) => (gridApiRef.current = params.api)}
              stopEditingWhenCellsLoseFocus={true}
              getRowStyle={(params) => ({
                backgroundColor:
                  params.node.rowIndex % 2 === 0 ? "#cde3f2" : "#ffffff",
              })}
            />
          </div>

          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              onClick={handleAddRow}
              disabled={!loggedBranchId}
            >
              Add Asset
            </Button>
          </Box>

          <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this asset?
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
              <Button onClick={handleDeleteRow} color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AssetGridForm;
