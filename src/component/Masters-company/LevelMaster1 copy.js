// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import {
//   Grid,
//   Button,
//   Typography,
//   Box,
//   IconButton,
//   AppBar,
//   Toolbar,
//   MenuItem,
//   FormControl,
//   Select,
//   InputLabel,
//   Card,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
// } from "@mui/material";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
// import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
// import { toast } from "react-toastify";
// import { postRequest } from "../../serverconfiguration/requestcomp";
// import { ServerConfig } from "../../serverconfiguration/serverconfig";
// import { REPORTS, SAVE } from "../../serverconfiguration/controllers";
// import Navbar from "../Home Page-comapny/Navbar1";
// import Sidenav from "../Home Page-comapny/Sidenav1";

// const LevelFormMaster1 = () => {
//   const [branch, setBranch] = useState([]);
//   const [gridData, setGridData] = useState([]);
//   const [originalData, setOriginalData] = useState([]);
//   const [modifiedRows, setModifiedRows] = useState({});
//   const [pnCompanyId, setPnCompanyId] = useState("");
//   const [branchFilter, setBranchFilter] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [viewData, setViewData] = useState(null);
//   const [openView, setOpenView] = useState(false);
//   const databaseName = sessionStorage.getItem("databaseName"); // ✅ dynamic DB name

//   const getStatusLabel = (char) => {
//     switch (char) {
//       case "A":
//         return "Active";
//       case "I":
//         return "Inactive";
//       case "P":
//         return "Pending";
//       default:
//         return "";
//     }
//   };

//   const getStatusChar = (label) => {
//     switch (label) {
//       case "Active":
//         return "A";
//       case "Inactive":
//         return "I";
//       case "Pending":
//         return "P";
//       default:
//         return "";
//     }
//   };

//   const fetchCompanyData = async () => {
//     const isloggedin = sessionStorage.getItem("user");
//     const companyData = await postRequest(ServerConfig.url, REPORTS, {
//       query: `SELECT * FROM [${databaseName}].[dbo].[paym_Company]
//         WHERE company_user_id = '${isloggedin}'`,

//     });
//     if (companyData.data.length > 0)
//       setPnCompanyId(companyData.data[0].pn_CompanyID);
//   };

//   const fetchBranchData = async () => {
//     if (pnCompanyId) {
//       const branchData = await postRequest(ServerConfig.url, REPORTS, {
//         query: `SELECT * FROM [${databaseName}].[dbo].[paym_Branch]
//         WHERE pn_CompanyID='${pnCompanyId}'`,

//       });
//       setBranch(branchData.data);
//     }
//   };

//   const fetchLevelData = async () => {
//     if (!pnCompanyId) return;
//     const levelData = await postRequest(ServerConfig.url, REPORTS, {
//       query: `SELECT * FROM [${databaseName}].[dbo].[paym_Branch]
//         WHERE pn_CompanyID='${pnCompanyId}'`,
//     });
//     const formattedData = levelData.data.map((item) => ({
//       pnCompanyId: item.pn_CompanyID,
//       BranchID: item.BranchID,
//       pn_LevelID: item.pn_LevelID,
//       v_LevelName: item.v_LevelName,
//       status: getStatusLabel(item.status),
//       isNew: false,
//     }));
//     setGridData(formattedData);
//     setOriginalData(JSON.parse(JSON.stringify(formattedData)));
//     setModifiedRows({});
//   };

//   const fetchAllData = async () => {
//     await fetchCompanyData();
//     await fetchBranchData();
//     await fetchLevelData();
//   };

//   useEffect(() => {
//     fetchAllData();
//   }, [pnCompanyId]);

//   const isRowModified = useCallback(
//     (rowData) => {
//       if (rowData.isNew) return false;
//       const originalRow = originalData.find(
//         (r) => r.pn_LevelID === rowData.pn_LevelID
//       );
//       if (!originalRow) return false;
//       return (
//         originalRow.BranchID !== rowData.BranchID ||
//         originalRow.v_LevelName !== rowData.v_LevelName ||
//         originalRow.status !== rowData.status
//       );
//     },
//     [originalData]
//   );

//   const handleCellValueChanged = useCallback(
//     (params) => {
//       const rowData = params.data;
//       if (!rowData.isNew) {
//         setModifiedRows((prev) => ({
//           ...prev,
//           [rowData.pn_LevelID]: isRowModified(rowData),
//         }));
//       }
//       params.api.refreshCells({ rowNodes: [params.node], force: true });
//     },
//     [isRowModified]
//   );

//   const handleAddRow = () => {
//   // ✅ Prevent adding new row if previous one is incomplete
//   const lastRow = gridData[gridData.length - 1];
//   if (
//     lastRow &&
//     (!lastRow.BranchID || !lastRow.v_LevelName || !lastRow.status)
//   ) {
//     toast.warning("Please fill all fields before adding a new row.");
//     return;
//   }

//   // ✅ Add new row marked as 'isNew'
//   const newRow = {
//     pnCompanyId,
//     BranchID: "",
//     v_LevelName: "",
//     status: "",
//     isNew: true, // important flag
//   };

//   // ✅ Append to grid without re-fetching data
//   setGridData((prev) => [...prev, newRow]);
// };


// //   const handleSaveAll = async () => {
// //     const newRows = gridData.filter((r) => r.isNew);
// //     if (!newRows.length) {
// //       toast.error("No new rows to save");
// //       return;
// //     }
// //     for (const row of newRows) {
// //       if (!row.BranchID || !row.v_LevelName || !row.status) {
// //         toast.error("Please fill all fields before saving");
// //         return;
// //       }
// //     }
// //     const queries = newRows.map(
// //       (r) =>
// //         `INSERT INTO [${databaseName}].[dbo].[paym_Level]
// //  (pn_CompanyID, BranchID, v_LevelName, status)
// //  VALUES ('${r.pnCompanyId}', '${r.BranchID}', '${r.v_LevelName}', '${getStatusChar(r.status)}')`

// //     );
// //     await Promise.all(
// //       queries.map((q) => postRequest(ServerConfig.url, SAVE, { query: q }))
// //     );
// //     toast.success("Saved successfully");
// //     fetchAllData();
// //   };
//   const handleSaveAll = async () => {
//   const newRows = gridData.filter((r) => r.isNew);

//   if (!newRows.length) {
//     toast.error("No new rows to save");
//     return;
//   }

//   for (const row of newRows) {
//     if (!row.BranchID || !row.v_LevelName || !row.status) {
//       toast.warning("Please fill all required fields before saving");
//       return;
//     }
//   }

//   try {
//     const databaseName = sessionStorage.getItem("databaseName");
//     if (!databaseName) {
//       toast.error("Database name missing in sessionStorage!");
//       return;
//     }

//     const queries = newRows.map(
//       (r) => `
//         INSERT INTO [${databaseName}].[dbo].[paym_Level]
//         (pn_CompanyID, BranchID, v_LevelName, status)
//         VALUES ('${r.pnCompanyId}', '${r.BranchID}', '${r.v_LevelName}', '${r.status === "Active" ? "A" : "I"}')
//       `
//     );

//     await Promise.all(
//       queries.map((q) => postRequest(ServerConfig.url, SAVE, { query: q }))
//     );

//     toast.success("Saved successfully");

//     // ✅ After saving, re-fetch data to refresh grid
//     fetchAllData();
//   } catch (err) {
//     console.error("Save error:", err);
//     toast.error("Error saving data");
//   }
// };


//   const  handleUpdateRow = async (rowData) => {
//     const query = `UPDATE [${databaseName}].[dbo].[paym_Level]
//                SET BranchID='${rowData.BranchID}',
//                    v_LevelName='${rowData.v_LevelName}',
//                    status='${getStatusChar(rowData.status)}'
//                WHERE pn_LevelID='${rowData.pn_LevelID}'`;

//     await postRequest(ServerConfig.url, SAVE, { query });
//     setModifiedRows((prev) => {
//       const copy = { ...prev };
//       delete copy[rowData.pn_LevelID];
//       return copy;
//     });
//     toast.success("Updated successfully");
//     fetchAllData();
//   };

//   const handleDeleteRow = async (rowData) => {
//     if (!window.confirm("Are you sure you want to delete this record?")) return;
//     const query = `DELETE FROM [${databaseName}].[dbo].[paym_Level]
//                WHERE pn_LevelID='${rowData.pn_LevelID}'`;

//     await postRequest(ServerConfig.url, SAVE, { query });
//     toast.info("Deleted successfully");
//     fetchAllData();
//   };

//   const handleViewRow = (rowData) => {
//     setViewData(rowData);
//     setOpenView(true);
//   };

//   const columnDefs = useMemo(
//     () => [
//       {
//         headerName: "Branch",
//         field: "BranchID",
//         editable: true,
//         cellEditor: "agSelectCellEditor",
//         cellEditorParams: { values: branch.map((b) => b.BranchName) },
//         valueGetter: (params) =>
//           branch.find((b) => b.pn_BranchID === params.data.BranchID)
//             ?.BranchName || "",
//         valueSetter: (params) => {
//           const selected = branch.find((b) => b.BranchName === params.newValue);
//           if (selected) {
//             params.data.BranchID = selected.pn_BranchID;
//             return true;
//           }
//           return false;
//         },
//       },
//       { headerName: "Level Name", field: "v_LevelName", editable: true },
//       {
//         headerName: "Status",
//         field: "status",
//         editable: true,
//         cellEditor: "agSelectCellEditor",
//         cellEditorParams: { values: ["Active", "Inactive", "Pending"] },
//       },
//       {
//         headerName: "Actions",
//         field: "actions",
//         cellRenderer: (params) => (
//           <Box sx={{ display: "flex", gap: 1 }}>
//           <Button variant="outlined" size="small" onClick={() => handleViewRow(params.data)}>View</Button>
//           <Button variant="outlined" size="small" onClick={() => handleUpdateRow(params.data)} disabled={!modifiedRows[params.data.pn_LevelID]}>Edit</Button>
//           <IconButton color="error" onClick={() => handleDeleteRow(params.data)}><DeleteOutlineIcon /></IconButton>
//         </Box>
//         ),
//       },
//     ],
//     [branch, modifiedRows]
//   );

//   const filteredData = useMemo(
//     () =>
//       gridData.filter(
//         (row) =>
//           (!statusFilter || row.status === statusFilter) &&
//           (!branchFilter || String(row.BranchID) === String(branchFilter))
//       ),
//     [gridData, statusFilter, branchFilter]
//   );

//   return (
//     <Grid container sx={{ minHeight: "100vh", backgroundColor: "#f0f4f8" }}>
//       <Navbar />
//       <Grid item xs={12} sx={{ display: "flex" }}>
//         <Sidenav />
//         <Grid item xs={12} sm={10} sx={{ p: 5, margin: "100px auto" }}>
//           {/* AppBar */}
//           <AppBar
//             position="static"
//             sx={{
//               mb: 3,
//               borderRadius: 2,
//               background: "linear-gradient(90deg, #6a11cb, #2575fc)",
//             }}
//           >
//             <Toolbar>
//               <Typography
//                 variant="h5"
//                 sx={{ fontWeight: "bold", color: "#fff" }}
//               >
//                 Level Master
//               </Typography>
//             </Toolbar>
//           </AppBar>

//           {/* Filters */}
//           <Card
//             sx={{
//               p: 3,
//               mb: 3,
//               borderRadius: 3,
//               background: "linear-gradient(90deg, #6a11cb, #2575fc)",
//             }}
//           >
//             <Grid container spacing={2} alignItems="center">
//               <Grid item xs={12} sm={6} md={4}>
//                 <FormControl fullWidth>
//                   <InputLabel sx={{ color: "#000" }}>Branch</InputLabel>
//                   <Select
//                     value={branchFilter}
//                     onChange={(e) => setBranchFilter(e.target.value)}
//                     sx={{ bgcolor: "#fff", color: "#000" }}
//                   >
//                     <MenuItem value="">All Branches</MenuItem>
//                     {branch.map((b) => (
//                       <MenuItem key={b.pn_BranchID} value={b.pn_BranchID}>
//                         {b.BranchName}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={6} md={4}>
//                 <FormControl fullWidth>
//                   <InputLabel sx={{ color: "#000" }}>Status</InputLabel>
//                   <Select
//                     value={statusFilter}
//                     onChange={(e) => setStatusFilter(e.target.value)}
//                     sx={{ bgcolor: "#fff", color: "#000" }}
//                   >
//                     <MenuItem value="">All Status</MenuItem>
//                     <MenuItem value="Active">Active</MenuItem>
//                     <MenuItem value="Inactive">Inactive</MenuItem>
//                     <MenuItem value="Pending">Pending</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} md={4} sx={{ textAlign: { md: "right" } }}>
//                 <Button
//                   onClick={handleAddRow}
//                   sx={{ mr: 2, background: "#ff4b1f", color: "#fff" }}
//                 >
//                   Add Level
//                 </Button>
//                 <Button
//                   onClick={handleSaveAll}
//                   sx={{
//                     background: "linear-gradient(45deg,#1fddff,#45f3ff)",
//                     color: "#000",
//                   }}
//                 >
//                   Save All
//                 </Button>
//               </Grid>
//             </Grid>
//           </Card>

//           {/* AG Grid */}
//           <Box
//             className="ag-theme-alpine"
//             sx={{ borderRadius: 3, overflow: "hidden", boxShadow: 3, mb: 3 }}
//           >
//             <AgGridReact
//               rowData={filteredData}
//               columnDefs={columnDefs}
//               domLayout="autoHeight"
//               defaultColDef={{ flex: 1, minWidth: 120, resizable: true }}
//               pagination
//               paginationPageSize={10}
//               animateRows
//               onCellValueChanged={handleCellValueChanged}
//               getRowStyle={(params) => ({
//                 backgroundColor:
//                   params.node.rowIndex % 2 === 0 ? "#e0f7fa" : "#ffffff",
//               })}
//             />
//           </Box>

//           {/* View Dialog */}
//           <Dialog
//             open={openView}
//             onClose={() => setOpenView(false)}
//             PaperProps={{
//               sx: {
//                 borderRadius: 3,
//                 background: "linear-gradient(135deg, #f6d365, #fda085)",
//                 p: 3,
//               },
//             }}
//           >
//             <DialogTitle sx={{ fontWeight: "bold", color: "#333" }}>
//               Level Details
//             </DialogTitle>
//             <DialogContent>
//               {viewData && (
//                 <Box
//                   sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
//                 >
//                   <Typography>
//                     <strong>Branch:</strong>{" "}
//                     {branch.find((b) => b.pn_BranchID === viewData.BranchID)
//                       ?.BranchName || ""}
//                   </Typography>
//                   <Typography>
//                     <strong>Level Name:</strong> {viewData.v_LevelName}
//                   </Typography>
//                   <Typography>
//                     <strong>Status:</strong> {viewData.status}
//                   </Typography>
//                 </Box>
//               )}
//             </DialogContent>
//             <DialogActions>
//               <Button
//                 onClick={() => setOpenView(false)}
//                 sx={{
//                   background: "linear-gradient(45deg,#ff416c,#ff4b2b)",
//                   color: "#fff",
//                   fontWeight: "bold",
//                   "&:hover": { opacity: 0.9 },
//                 }}
//               >
//                 Close
//               </Button>
//             </DialogActions>
//           </Dialog>
//         </Grid>
//       </Grid>
//     </Grid>
//   );
// };

// export default LevelFormMaster1;




import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Grid,
  Button,
  Typography,
  Box,
  IconButton,
  AppBar,
  Toolbar,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import { toast } from "react-toastify";
import { postRequest } from "../../serverconfiguration/requestcomp";
import { ServerConfig } from "../../serverconfiguration/serverconfig";
import { REPORTS, SAVE } from "../../serverconfiguration/controllers";
import Navbar from "../Home Page-comapny/Navbar1";
import Sidenav from "../Home Page-comapny/Sidenav1";
import axios from "axios";


const LevelFormMaster1 = () => {
  const [branch, setBranch] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [modifiedRows, setModifiedRows] = useState({});
  const [pnCompanyId, setPnCompanyId] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [viewData, setViewData] = useState(null);
  const [openView, setOpenView] = useState(false);
  const [company, setCompany] = useState([]);
  const [companyName, setCompanyName] = useState("");
   const authStr=sessionStorage.getItem("auth");
      const auth=authStr?JSON.parse(authStr):null;
      const token=auth?.token;
      ServerConfig.url = "https://localhost:7266/api";

  const databaseName = sessionStorage.getItem("databaseName");

  const getStatusLabel = (char) => {
    switch (char) {
      case "A":
        return "Active";
      case "I":
        return "Inactive";
      case "P":
        return "Pending";
      default:
        return "";
    }
  };

  const getStatusChar = (label) => {
    switch (label) {
      case "Active":
        return "A";
      case "Inactive":
        return "I";
      case "Pending":
        return "P";
      default:
        return "";
    }
  };

  // ✅ Fetch company for logged user
   const fetchCompanyData = async () => {
     if(!token){
       toast.error("User not logged in");
       return;
     }
     try{
       console.log("Fetching company data...");
       const res=await axios.get(`${ServerConfig.url}/PaymCompanies/by-user`,{
         headers:{
           Authorization:`Bearer ${token}`
         }
       });
       console.log("Company Data Fetched:", res.data);
       setCompany(res.data);
       if(res.data.length>0){
         const companyId = res.data[0].pnCompanyId || res.data[0].PnCompanyId;
         setPnCompanyId(companyId);
         console.log("Company ID set to:", companyId);
         setCompanyName(res.data[0].companyName || res.data[0].CompanyName);
       }
     }catch(error){
       console.error("Failed to fetch company",{
         status: error.response?.status,
         data: error.response?.data,
         message: error.message
       });
     }
     };

  // ✅ Fetch branch list
  const fetchBranchData = async () => {
    // ✅ Stop if companyId is missing
    if (!pnCompanyId) {
      console.log("Skipping branch fetch - no pnCompanyId");
      return;
    }
  
    // ✅ Stop if token is missing
    if (!token) {
      toast.error("User not logged in");
      return;
    }
  
    try {
      console.log("Fetching branches for company:", pnCompanyId);
      const res = await axios.get(
        `${ServerConfig.url}/PaymBranches/by-company/${pnCompanyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log("Branch Data Fetched:", res.data);
      const normalized = res.data.map(b => ({
        pnBranchId: b.pnBranchId || b.PnBranchId,
        branchName: b.branchName || b.BranchName
      }));
      console.log("Normalized Branch Data:", normalized);
      setBranch(normalized);
    } catch (error) {
      console.error(
        "Failed to fetch branch",
        {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        }
      );
    }
  };

  // ✅ Fetch level data (corrected table)
  const fetchLevelData = async () => {
    try {
      if (!pnCompanyId ) return;

     // 1. Get the token from session
    const authStr = sessionStorage.getItem("auth");
    const token = authStr ? JSON.parse(authStr)?.token : null;
    const config = { headers: { Authorization: `Bearer ${token}` } };
// 2. Build URL (Handling the optional Branch ID)
    const url = branchFilter 
      ? `${ServerConfig.url}/PaymLevels/${pnCompanyId}/${branchFilter}`
      : `${ServerConfig.url}/PaymLevels/${pnCompanyId}`;
      const response = await axios.get(url, config);
      const formattedData = (response.data || []).map((item) => ({
        pnCompanyId: item.pnCompanyId,
        branchId: item.branchId,
        pnLevelId: item.pnLevelId,
        vLevelName: item.vLevelName,
        status: getStatusLabel(item.status),
        isNew: false,
      }));

      setGridData(formattedData);
      setOriginalData(JSON.parse(JSON.stringify(formattedData)));
      setModifiedRows({});
    } catch (err) {
      console.error("Error fetching level data:", err);
    }
  };

  const fetchAllData = async () => {
    await fetchCompanyData();
    await fetchBranchData();
    await fetchLevelData();
  };

  useEffect(() => {
    fetchAllData();
  }, [pnCompanyId]);

  // ✅ Detect modified rows
  const isRowModified = useCallback(
    (rowData) => {
      if (rowData.isNew) return false;
      const originalRow = originalData.find(
        (r) => r.pnLevelId === rowData.pnLevelId
      );
      if (!originalRow) return false;
      return (
        originalRow.branchId !== rowData.branchId ||
        originalRow.vLevelName !== rowData.vLevelName ||
        originalRow.status !== rowData.status
      );
    },
    [originalData]
  );

  const handleCellValueChanged = useCallback(
    (params) => {
      const rowData = params.data;
      if (!rowData.isNew) {
        setModifiedRows((prev) => ({
          ...prev,
          [rowData.pnLevelId]: isRowModified(rowData),
        }));
      }
      params.api.refreshCells({ rowNodes: [params.node], force: true });
    },
    [isRowModified]
  );

  // ✅ Add new blank row
  const handleAddRow = () => {
    const lastRow = gridData[gridData.length - 1];
    if (
      lastRow &&
      (!lastRow.branchId || !lastRow.vLevelName || !lastRow.status)
    ) {
      toast.warning("Please fill all fields before adding a new row.");
      return;
    }
    const newRow = {
      pnCompanyId,
      branchId: "",
      vLevelName: "",
      status: "",
      isNew: true,
    };
    setGridData((prev) => [...prev, newRow]);
  };

  // ✅ Save all new rows
 const handleSaveAll = async () => {
  const newRows = gridData.filter((r) => r.isNew);

  if (!newRows.length) {
    toast.error("No new rows to save");
    return;
  }

  // Validation
  for (const row of newRows) {
    if (!row.branchId || !row.vLevelName || !row.status) {
      toast.error("Please fill all fields before saving");
      return;
    }
  }

  // 1. Get Authentication Token
  const authStr = sessionStorage.getItem("auth");
  const token = authStr ? JSON.parse(authStr)?.token : null;

  if (!token) {
    toast.error("Session expired. Please login again.");
    return;
  }

  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    // 2. Map rows to match the Backend DTO (PascalCase matching)
    const savePromises = newRows.map((r) => {
      const payload = {
        pnCompanyId: Number(pnCompanyId),
        branchId: Number(r.branchId),
        vLevelName: r.vLevelName,
        status: getStatusChar(r.status)
      };

      // 3. Axios POST request (URL, Data, Config)
      return axios.post(`${ServerConfig.url}/PaymLevels`, payload, config);
    });

    await Promise.all(savePromises);

    toast.success("Saved successfully");
    await fetchLevelData(); // Refresh the grid
  } catch (err) {
    console.error("Error saving rows:", err);
    const errorMessage = err.response?.data || "Error saving data";
    toast.error(typeof errorMessage === 'string' ? errorMessage : "An error occurred");
  }
};

  // ✅ Update a single row
 const handleUpdateRow = async (rowData) => {
  // 1. Get Authentication Token
  const authStr = sessionStorage.getItem("auth");
  const token = authStr ? JSON.parse(authStr)?.token : null;

  if (!token) {
    toast.error("Session expired. Please login again.");
    return;
  }

  try {
    // 2. Map payload to match Backend DTO
    // Note: vLevelName must be the ORIGINAL name if it's used as a key in C#
    const payload = {
      pnCompanyId: Number(pnCompanyId),
      branchId: Number(rowData.branchId),
      pnLevelId: rowData.pnLevelId,
      vLevelName: rowData.vLevelName, 
      status: getStatusChar(rowData.status)
    };

    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    // 3. Axios PUT request (URL, Data, Config)
    await axios.put(`${ServerConfig.url}/PaymLevels`, payload, config);

    // 4. Clear modification state
    setModifiedRows((prev) => {
      const copy = { ...prev };
      delete copy[rowData.pnLevelId];
      return copy;
    });

    toast.success("Updated successfully");
    await fetchLevelData(); // Refresh to sync with DB
    
  } catch (err) {
    console.error("Error updating row:", err);
    const errorMessage = err.response?.data?.message || "Update failed";
    toast.error(errorMessage);
  }
};

  // ✅ Delete row
  const handleDeleteRow = async (rowData) => {
    if (rowData.isNew) {
                  setGridData(prev =>
                    prev.filter(row => row !== rowData)
                  );
                  toast.info("Unsaved row removed");
                  return;
                }
  if (!window.confirm("Are you sure you want to delete this record?")) return;

  // 1. Get Authentication Token
  const authStr = sessionStorage.getItem("auth");
  const token = authStr ? JSON.parse(authStr)?.token : null;

  if (!token) {
    toast.error("Session expired. Please login again.");
    return;
  }

  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    // 2. Construct the URL with the Triple Composite Key
    // Matches: [HttpDelete("{companyId}/{branchId}/{levelName}")]
    const companyId = Number(pnCompanyId);
    const branchId = Number(rowData.branchId);
    const levelName = encodeURIComponent(rowData.vLevelName); // Encode in case of spaces/special chars

    const url = `${ServerConfig.url}/PaymLevels/${companyId}/${branchId}/${levelName}`;

    // 3. Axios DELETE request
    await axios.delete(url, config);

    toast.info("Deleted successfully");
    
    // 4. Refresh grid
    await fetchLevelData();

  } catch (err) {
    console.error("Delete error:", err);
    const errorMessage = err.response?.data?.message || "Delete failed";
    toast.error(errorMessage);
  }
};

  // ✅ View record dialog
  const handleViewRow = (rowData) => {
    setViewData(rowData);
    setOpenView(true);
  };

  // ✅ Grid Columns
  const columnDefs = useMemo(
    () => [
      {
        headerName: "Branch",
        field: "branchId",
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: branch.map((b) => b.branchName) },
        valueGetter: (params) =>
          branch.find((b) => b.pnBranchId === params.data.branchId)
            ?.branchName || "",
        valueSetter: (params) => {
          const selected = branch.find((b) => b.branchName === params.newValue);
          if (selected) {
            params.data.branchId = selected.pnBranchId;
            return true;
          }
          return false;
        },
      },
      { headerName: "Level Name", field: "vLevelName", editable: true },
      {
        headerName: "Status",
        field: "status",
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: ["Active", "Inactive", "Pending"] },
      },
      {
        headerName: "Actions",
        field: "actions",
        cellRenderer: (params) => (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleViewRow(params.data)}
            >
              View
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleUpdateRow(params.data)}
              disabled={!modifiedRows[params.data.pnLevelId]}
            >
              Edit
            </Button>
            <IconButton
              color="error"
              onClick={() => handleDeleteRow(params.data)}
            >
              <DeleteOutlineIcon />
            </IconButton>
          </Box>
        ),
      },
    ],
    [branch, modifiedRows]
  );

  // ✅ Filtered Rows
  const filteredData = useMemo(
    () =>
      gridData.filter(
        (row) =>
          (!statusFilter || row.status === statusFilter) &&
          (!branchFilter || String(row.branchId) === String(branchFilter))
      ),
    [gridData, statusFilter, branchFilter]
  );

  return (
    <Grid container sx={{ minHeight: "100vh", backgroundColor: "#f0f4f8" }}>
      <Navbar />
      <Grid item xs={12} sx={{ display: "flex" }}>
        <Sidenav />
        <Grid item xs={12} sm={10} sx={{ p: 5, margin: "100px auto" }}>
          {/* Header */}
          <AppBar
            position="static"
            sx={{
              mb: 3,
              borderRadius: 2,
              background: "linear-gradient(90deg, #6a11cb, #2575fc)",
            }}
          >
            <Toolbar>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", color: "#fff" }}
              >
                Level Master
              </Typography>
            </Toolbar>
          </AppBar>

          {/* Filters */}
          <Card
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              background: "linear-gradient(90deg, #6a11cb, #2575fc)",
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: "#fff" }}>Branch</InputLabel>
                  <Select
                    value={branchFilter}
                    onChange={(e) => setBranchFilter(e.target.value)}
                    sx={{ bgcolor: "#fff", color: "#000" }}
                    displayEmpty // This ensures that even empty values show something
                  >
                    <MenuItem value="">All Branches</MenuItem>
                    {branch.map((b) => (
                      <MenuItem key={b.pnBranchId} value={b.pnBranchId}>
                        {b.branchName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: "#fff" }}>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    sx={{ bgcolor: "#fff", color: "#000" }}
                    displayEmpty // This ensures that even empty values show something
                  >
                    <MenuItem value="">All Status</MenuItem>
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4} sx={{ textAlign: { md: "right" } }}>
                <Button
                  onClick={handleAddRow}
                  sx={{ mr: 2, background: "#ff4b1f", color: "#fff" }}
                >
                  Add Level
                </Button>
                <Button
                  onClick={handleSaveAll}
                  sx={{
                    background: "linear-gradient(45deg,#1fddff,#45f3ff)",
                    color: "#000",
                  }}
                >
                  Save All
                </Button>
              </Grid>
            </Grid>
          </Card>

          {/* Grid */}
          <Box
            className="ag-theme-alpine"
            sx={{ borderRadius: 3, overflow: "hidden", boxShadow: 3, mb: 3 }}
          >
            <AgGridReact
              rowData={filteredData}
              columnDefs={columnDefs}
              domLayout="autoHeight"
              defaultColDef={{ flex: 1, minWidth: 120, resizable: true }}
              pagination
              paginationPageSize={10}
              animateRows
              onCellValueChanged={handleCellValueChanged}
              getRowStyle={(params) => ({
                backgroundColor:
                  params.data?.isNew ? "#fff8e1" : params.node.rowIndex % 2 === 0
                    ? "#e0f7fa"
                    : "#ffffff",
              })}
            />
          </Box>

          {/* View Dialog */}
          <Dialog
            open={openView}
            onClose={() => setOpenView(false)}
            PaperProps={{
              sx: {
                borderRadius: 3,
                background: "linear-gradient(135deg, #f6d365, #fda085)",
                p: 3,
              },
            }}
          >
            <DialogTitle sx={{ fontWeight: "bold", color: "#333" }}>
              Level Details
            </DialogTitle>
            <DialogContent>
              {viewData && (
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  <Typography>
                    <strong>Branch:</strong>{" "}
                    {branch.find((b) => b.pnBranchId === viewData.branchId)
                      ?.branchName || ""}
                  </Typography>
                  <Typography>
                    <strong>Level Name:</strong> {viewData.vLevelName}
                  </Typography>
                  <Typography>
                    <strong>Status:</strong> {viewData.status}
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setOpenView(false)}
                sx={{
                  background: "linear-gradient(45deg,#ff416c,#ff4b2b)",
                  color: "#fff",
                  fontWeight: "bold",
                  "&:hover": { opacity: 0.9 },
                }}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default LevelFormMaster1;
