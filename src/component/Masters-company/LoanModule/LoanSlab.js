// import React, { useState, useEffect } from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import IconButton from "@mui/material/IconButton";
// import AddIcon from "@mui/icons-material/Add";
// import DeleteOutlinedIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import Button from "@mui/material/Button";
// import Navbar from "../../Home Page-comapny/Navbar1";
// import Sidenav from "../../Home Page-comapny/Sidenav1";
// import {
//   Grid,
//   TextField,
//   Typography,
//   useMediaQuery,
//   useTheme,
//   Box,
//   MenuItem,
// } from "@mui/material";
// import { postRequest } from "../../../serverconfiguration/requestcomp";
// import { ServerConfig } from "../../../serverconfiguration/serverconfig";
// import { REPORTS, SAVE } from "../../../serverconfiguration/controllers";
// import { useNavigate } from "react-router-dom";
// import AppBar from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";
// import { toast } from "react-toastify";
// import { AgGridReact } from "ag-grid-react";
// const CTCSlabTable = () => {
//   const [rows, setRows] = useState([]);
//   const [companyID, setCompanyID] = useState("");
//   const [companyName, setCompanyName] = useState("");
//   const [branchID, setBranchID] = useState("");
//   const [branches, setBranches] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [editingRowId, setEditingRowId] = useState(null);

//   const user = sessionStorage.getItem("user");
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"));

//   // Fetch company info
//   useEffect(() => {
//     async function fetchCompanyData() {
//       try {
//         const companyData = await postRequest(ServerConfig.url, REPORTS, {
//           query: `select pn_CompanyID, CompanyName from paym_Company where company_user_id = '${user}'`,
//         });
//         if (companyData.data.length > 0) {
//           setCompanyID(companyData.data[0].pn_CompanyID);
//           setCompanyName(companyData.data[0].CompanyName);
//         }
//       } catch (error) {
//         console.error("Error fetching company data:", error);
//         alert("Failed to fetch company data.");
//       }
//     }
//     fetchCompanyData();
//   }, [user]);

//   // Fetch branch info
//   useEffect(() => {
//     async function fetchBranchData() {
//       if (!companyID) return;
//       try {
//         const branchData = await postRequest(ServerConfig.url, REPORTS, {
//           query: `select * from paym_branch where pn_CompanyID = '${companyID}'`,
//         });
//         setBranches(branchData.data);
//         if (branchData.data.length > 0) {
//           setBranchID(branchData.data[0].pn_BranchID);
//         }
//       } catch (error) {
//         console.error("Error fetching branch data:", error);
//         alert("Failed to fetch branch data.");
//       }
//     }
//     fetchBranchData();
//   }, [companyID]);

//   // Fetch CTC slab data (all rows for company & branch)
//   useEffect(() => {
//     const fetchCTCSlabData = async () => {
//       if (!companyID || !branchID) return;
//       setLoading(true);
//       try {
//         const ctcSlabData = await postRequest(ServerConfig.url, REPORTS, {
//           query: `
//             SELECT CTCSlabID, MinCTC, MaxCTC, MaxLoanAmount, InterestRate
//             FROM [dbo].[CTCSlab]
//             WHERE pn_CompanyID = '${companyID}'
//               AND pn_BranchID = '${branchID}'
//           `,
//         });

//         const formattedRows = ctcSlabData.data.map((row, index) => ({
//           id: row.CTCSlabID || index + 1,
//           CTCSlabID: row.CTCSlabID,
//           MinCTC: row.MinCTC,
//           MaxCTC: row.MaxCTC,
//           MaxLoanAmount: row.MaxLoanAmount,
//           InterestRate: row.InterestRate,
//         }));

//         setRows(formattedRows);
//       } catch (error) {
//         console.error("Error fetching CTC slab data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCTCSlabData();
//   }, [companyID, branchID]);

//   // Delete a row
//   const handleDeleteRow = async (CTCSlabID) => {
//     if (window.confirm("Are you sure you want to delete this row?")) {
//       try {
//         await postRequest(ServerConfig.url, SAVE, {
//           query: `DELETE FROM [dbo].[CTCSlab] WHERE CTCSlabID = ${CTCSlabID}`,
//         });
//         setRows(rows.filter((row) => row.CTCSlabID !== CTCSlabID));
//         toast.info("Row deleted successfully", {
//           position: "top-center",
//           autoClose: 1000,
//         });
//       } catch (error) {
//         console.error("Error deleting row:", error);
//         toast.error("Failed to delete row", {
//           position: "top-center",
//           autoClose: 1000,
//         });
//       }
//     }
//   };

//   // Add new row
//   const handleAddRow = () => {
//     const lastRow = rows[rows.length - 1];
//     if (
//       lastRow &&
//       (!lastRow.MinCTC ||
//         !lastRow.MaxCTC ||
//         !lastRow.MaxLoanAmount ||
//         !lastRow.InterestRate)
//     ) {
//       toast.dismiss();
//       toast.warning(
//         "Please fill all fields in the current row before adding a new row.",
//         { position: "top-center", autoClose: 1000 }
//       );
//       return;
//     }
//     const newId =
//       rows.length > 0 ? Math.max(...rows.map((row) => row.CTCSlabID)) + 1 : 1;
//     const lastMaxCTC = rows.length > 0 ? rows[rows.length - 1].MaxCTC : 0;
//     const newRow = {
//       id: newId,
//       CTCSlabID: newId,
//       MinCTC: lastMaxCTC + 1,
//       MaxCTC: "",
//       MaxLoanAmount: "",
//       InterestRate: "",
//       isNew: true,
//     };
//     setRows([...rows, newRow]);
//   };

//   // Update row after edit
//   // Update row immediately when edited
//   const handleProcessRowUpdate = async (newRow, oldRow) => {
//     try {
//       // Check if values actually changed
//       const isChanged = [
//         "MinCTC",
//         "MaxCTC",
//         "MaxLoanAmount",
//         "InterestRate",
//       ].some((key) => newRow[key] !== oldRow[key]);
//       if (!isChanged) return oldRow;

//       // Update DB directly
//       await postRequest(ServerConfig.url, SAVE, {
//         query: `
//         UPDATE [dbo].[CTCSlab] SET
//           MinCTC='${newRow.MinCTC}',
//           MaxCTC='${newRow.MaxCTC}',
//           MaxLoanAmount='${newRow.MaxLoanAmount}',
//           InterestRate='${newRow.InterestRate}'
//         WHERE CTCSlabID=${newRow.CTCSlabID}
//       `,
//       });

//       toast.success("Row updated successfully", {
//         position: "top-center",
//         autoClose: 1000,
//       });
//       return newRow; // return updated row
//     } catch (error) {
//       console.error("Error updating row:", error);
//       toast.error("Failed to update row", {
//         position: "top-center",
//         autoClose: 1000,
//       });
//       return oldRow; // rollback on error
//     }
//   };

//   // Save all rows
//   const handleSaveAllRows = async () => {
//     if (loading) return;
//     setLoading(true);
//     try {
//       toast.dismiss();
//       if (rows.length === 0) {
//         toast.error("No CTC slab data to save", {
//           position: "top-center",
//           autoClose: 1000,
//         });
//         return;
//       }

//       // Get existing data
//       const existingData = await postRequest(ServerConfig.url, REPORTS, {
//         query: `SELECT * FROM [dbo].[CTCSlab] WHERE pn_CompanyID='${companyID}' AND pn_BranchID='${branchID}'`,
//       });
//       const existingRecords = existingData.data || [];
//       const queries = [];

//       for (const row of rows) {
//         if (
//           !row.MinCTC ||
//           !row.MaxCTC ||
//           !row.MaxLoanAmount ||
//           !row.InterestRate
//         ) {
//           toast.error("Please fill all fields before saving.", {
//             position: "top-center",
//             autoClose: 1000,
//           });
//           setLoading(false);
//           return;
//         }

//         const existingRow = existingRecords.find(
//           (item) => item.CTCSlabID === row.CTCSlabID
//         );

//         if (existingRow) {
//           const isChanged = [
//             "MinCTC",
//             "MaxCTC",
//             "MaxLoanAmount",
//             "InterestRate",
//           ].some((key) => existingRow[key] != row[key]);
//           if (!isChanged) continue;

//           queries.push(`
//             UPDATE [dbo].[CTCSlab] SET
//               MinCTC='${row.MinCTC}',
//               MaxCTC='${row.MaxCTC}',
//               MaxLoanAmount='${row.MaxLoanAmount}',
//               InterestRate='${row.InterestRate}'
//             WHERE CTCSlabID=${row.CTCSlabID}
//           `);
//         } else {
//           queries.push(`
//             INSERT INTO [dbo].[CTCSlab] (pn_CompanyID, pn_BranchID, LoanType, MinCTC, MaxCTC, MaxLoanAmount, InterestRate)
//             VALUES ('${companyID}','${branchID}',NULL,'${row.MinCTC}','${row.MaxCTC}','${row.MaxLoanAmount}','${row.InterestRate}')
//           `);
//         }
//       }

//       if (queries.length === 0) {
//         toast.info("No changes to save", {
//           position: "top-center",
//           autoClose: 1000,
//         });
//         setLoading(false);
//         return;
//       }

//       await postRequest(ServerConfig.url, SAVE, { query: queries.join("\n") });
//       toast.success("Data saved successfully", {
//         position: "top-center",
//         autoClose: 1000,
//       });

//       // Refresh rows
//       const updatedData = await postRequest(ServerConfig.url, REPORTS, {
//         query: `SELECT CTCSlabID, MinCTC, MaxCTC, MaxLoanAmount, InterestRate FROM [dbo].[CTCSlab] WHERE pn_CompanyID='${companyID}' AND pn_BranchID='${branchID}'`,
//       });
//       const formattedRows = updatedData.data.map((row, index) => ({
//         id: row.CTCSlabID || index + 1,
//         CTCSlabID: row.CTCSlabID,
//         MinCTC: row.MinCTC,
//         MaxCTC: row.MaxCTC,
//         MaxLoanAmount: row.MaxLoanAmount,
//         InterestRate: row.InterestRate,
//       }));
//       setRows(formattedRows);
//     } catch (error) {
//       console.error("Save failed:", error);
//       toast.error("Failed to save data", {
//         position: "top-center",
//         autoClose: 1000,
//       });
//     } finally {
//       setLoading(false);
//       setEditingRowId(null);
//     }
//   };

//   // Columns for DataGrid
//   const columns = [
//     { field: "CTCSlabID", headerName: "CTC SLAB ID", width: 150 },
//     { field: "MinCTC", headerName: "MIN CTC", width: 150, editable: true },
//     { field: "MaxCTC", headerName: "MAX CTC", width: 150, editable: true },
//     {
//       field: "MaxLoanAmount",
//       headerName: "MAX LOAN AMOUNT",
//       width: 180,
//       editable: true,
//     },
//     {
//       field: "InterestRate",
//       headerName: "INTEREST RATE(%)",
//       width: 180,
//       editable: true,
//     },
//     {
//       field: "actions",
//       headerName: "ACTIONS",
//       width: 120,
//       renderCell: (params) => (
//         <div>
//           <IconButton
//             color="secondary"
//             onClick={() => {
//               // programmatically focus first editable cell in this row
//               document
//                 .querySelector(
//                   `[data-id="${params.row.id}"][data-field="MinCTC"]`
//                 )
//                 ?.click();
//             }}
//           >
//             <EditIcon />
//           </IconButton>
//           <IconButton onClick={() => handleDeleteRow(params.row.CTCSlabID)}>
//             <DeleteOutlinedIcon sx={{ color: "red" }} />
//           </IconButton>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <Grid container sx={{ minHeight: "100vh", backgroundColor: "#f0f4f8" }}>
//       <Navbar />
//       <Grid item xs={12} sx={{ display: "flex" }}>
//         <Sidenav />

//         <Grid item xs={12} sm={10} sx={{ p: 5, margin: "100px auto" }}>
//           {/* Gradient AppBar */}
//           <AppBar
//             position="static"
//             sx={{
//               background: "linear-gradient(90deg, #6a11cb, #2575fc)",
//               mb: 3,
//               borderRadius: 2,
//             }}
//           >
//             <Toolbar>
//               <Typography
//                 variant="h5"
//                 sx={{ fontWeight: "bold", color: "#fff" }}
//               >
//                 LOAN SLAB
//               </Typography>
//             </Toolbar>
//           </AppBar>

//           {/* Filter Card */}
//           <Box
//             sx={{
//               padding: 2,
//               borderRadius: 2,
//               background: "linear-gradient(90deg, #6a11cb, #2575fc)",
//               mb: 3,
//             }}
//           >
//             <Grid container spacing={2} alignItems="center">
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Company Name"
//                   variant="outlined"
//                   fullWidth
//                   value={companyName}
//                   InputLabelProps={{ shrink: true }}
//                   sx={{ backgroundColor: "#fff", borderRadius: 1 }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   select
//                   label="Branch"
//                   variant="outlined"
//                   fullWidth
//                   value={branchID}
//                   onChange={(e) => setBranchID(e.target.value)}
//                   InputLabelProps={{ shrink: true }}
//                   sx={{ backgroundColor: "#fff", borderRadius: 1 }}
//                 >
//                   {branches.map((branch) => (
//                     <MenuItem
//                       key={branch.pn_BranchID}
//                       value={branch.pn_BranchID}
//                     >
//                       {branch.BranchName}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </Grid>

//               <Grid item xs={12} sx={{ textAlign: "right" }}>
//                 <Button
//                   variant="contained"
//                   onClick={handleAddRow}
//                   sx={{
//                     background: "linear-gradient(45deg, #ff6a00, #ee0979)",
//                     color: "#fff",
//                     fontWeight: "bold",
//                     mr: 2,
//                     "&:hover": { opacity: 0.9 },
//                   }}
//                 >
//                   Add Row
//                 </Button>
//                 <Button
//                   variant="contained"
//                   onClick={handleSaveAllRows}
//                   sx={{
//                     background: "linear-gradient(45deg, #56ab2f, #a8e063)",
//                     color: "#fff",
//                     fontWeight: "bold",
//                     "&:hover": { opacity: 0.9 },
//                   }}
//                 >
//                   Save All
//                 </Button>
//               </Grid>
//             </Grid>
//           </Box>

//           {/* Grid */}
//           <Box
//             className="ag-theme-alpine"
//             sx={{
//               width: "100%",
//               borderRadius: 3,
//               overflow: "hidden",
//               boxShadow: "0px 8px 20px rgba(0,0,0,0.15)",
//             }}
//           >
//             <AgGridReact
//               rowData={rows}
//               columnDefs={columns}
//               domLayout="autoHeight"
//               defaultColDef={{ flex: 1, minWidth: 120, resizable: true }}
//               pagination={true}
//               paginationPageSize={10}
//               animateRows={true}
//               processRowUpdate={handleProcessRowUpdate}
//               editType="fullRow"
//               getRowStyle={(params) => ({
//                 backgroundColor:
//                   params.node.rowIndex % 2 === 0 ? "#e3f2fd" : "#ffffff", // blue & white
//               })}
//             />
//           </Box>
//         </Grid>
//       </Grid>
//     </Grid>
//   );
// };

// export default CTCSlabTable;

import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlinedIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import Navbar from "../../Home Page-comapny/Navbar1";
import Sidenav from "../../Home Page-comapny/Sidenav1";
import {
  Grid,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Box,
  MenuItem,
} from "@mui/material";
import { postRequest } from "../../../serverconfiguration/requestcomp";
import { ServerConfig } from "../../../serverconfiguration/serverconfig";
import { REPORTS, SAVE } from "../../../serverconfiguration/controllers";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { toast } from "react-toastify";

const CTCSlabTable = () => {
  const [rows, setRows] = useState([]);
  const [companyID, setCompanyID] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [branchID, setBranchID] = useState("");
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);

  const user = sessionStorage.getItem("user");
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Fetch company info
  useEffect(() => {
    async function fetchCompanyData() {
      try {
        const companyData = await postRequest(ServerConfig.url, REPORTS, {
          query: `select pn_CompanyID, CompanyName from paym_Company where company_user_id = '${user}'`,
        });
        if (companyData.data.length > 0) {
          setCompanyID(companyData.data[0].pn_CompanyID);
          setCompanyName(companyData.data[0].CompanyName);
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
        alert("Failed to fetch company data.");
      }
    }
    fetchCompanyData();
  }, [user]);

  // Fetch branch info
  useEffect(() => {
    async function fetchBranchData() {
      if (!companyID) return;
      try {
        const branchData = await postRequest(ServerConfig.url, REPORTS, {
          query: `select * from paym_branch where pn_CompanyID = '${companyID}'`,
        });
        setBranches(branchData.data);
        if (branchData.data.length > 0) {
          setBranchID(branchData.data[0].pn_BranchID);
        }
      } catch (error) {
        console.error("Error fetching branch data:", error);
        alert("Failed to fetch branch data.");
      }
    }
    fetchBranchData();
  }, [companyID]);

  // Fetch CTC slab data (all rows for company & branch)
  useEffect(() => {
    const fetchCTCSlabData = async () => {
      if (!companyID || !branchID) return;
      setLoading(true);
      try {
        const ctcSlabData = await postRequest(ServerConfig.url, REPORTS, {
          query: `
            SELECT CTCSlabID, MinCTC, MaxCTC, MaxLoanAmount, InterestRate 
            FROM [dbo].[CTCSlab] 
            WHERE pn_CompanyID = '${companyID}' 
              AND pn_BranchID = '${branchID}'
          `,
        });

        const formattedRows = ctcSlabData.data.map((row, index) => ({
          id: row.CTCSlabID || index + 1,
          CTCSlabID: row.CTCSlabID,
          MinCTC: row.MinCTC,
          MaxCTC: row.MaxCTC,
          MaxLoanAmount: row.MaxLoanAmount,
          InterestRate: row.InterestRate,
        }));

        setRows(formattedRows);
      } catch (error) {
        console.error("Error fetching CTC slab data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCTCSlabData();
  }, [companyID, branchID]);

  // Delete a row
  const handleDeleteRow = async (CTCSlabID) => {
    if (window.confirm("Are you sure you want to delete this row?")) {
      try {
        await postRequest(ServerConfig.url, SAVE, {
          query: `DELETE FROM [dbo].[CTCSlab] WHERE CTCSlabID = ${CTCSlabID}`,
        });
        setRows(rows.filter((row) => row.CTCSlabID !== CTCSlabID));
        toast.info("Row deleted successfully", {
          position: "top-center",
          autoClose: 1000,
        });
      } catch (error) {
        console.error("Error deleting row:", error);
        toast.error("Failed to delete row", {
          position: "top-center",
          autoClose: 1000,
        });
      }
    }
  };

  // Add new row
  const handleAddRow = () => {
    const lastRow = rows[rows.length - 1];
    if (
      lastRow &&
      (!lastRow.MinCTC ||
        !lastRow.MaxCTC ||
        !lastRow.MaxLoanAmount ||
        !lastRow.InterestRate)
    ) {
      toast.dismiss();
      toast.warning(
        "Please fill all fields in the current row before adding a new row.",
        { position: "top-center", autoClose: 1000 }
      );
      return;
    }
    const newId =
      rows.length > 0 ? Math.max(...rows.map((row) => row.CTCSlabID)) + 1 : 1;
    // const lastMaxCTC = rows.length > 0 ? rows[rows.length - 1].MaxCTC : 0;
    const newRow = {
      id: newId,
      CTCSlabID: newId,
      MinCTC: "",
      MaxCTC: "",
      MaxLoanAmount: "",
      InterestRate: "",
      isNew: true,
    };
    setRows([...rows, newRow]);
  };

  // Update row after edit
  const handleProcessRowUpdate = (newRow) => {
    const updatedRows = rows.map((row) =>
      row.id === newRow.id ? newRow : row
    );
    setRows(updatedRows);
    return newRow;
  };
  // Only showing updated/new parts
  // Add this function for saving a single row
  const handleSaveRow = async (row) => {
    if (!row.MinCTC || !row.MaxCTC || !row.MaxLoanAmount || !row.InterestRate) {
      toast.error("Please fill all fields before saving.", {
        position: "top-center",
        autoClose: 1000,
      });
      return;
    }

    try {
      // Check if row exists in DB
      const existingData = await postRequest(ServerConfig.url, REPORTS, {
        query: `SELECT * FROM [dbo].[CTCSlab] WHERE CTCSlabID=${row.CTCSlabID}`,
      });

      if (existingData.data.length > 0) {
        // Update existing row
        await postRequest(ServerConfig.url, SAVE, {
          query: `
          UPDATE [dbo].[CTCSlab] SET
            MinCTC='${row.MinCTC}',
            MaxCTC='${row.MaxCTC}',
            MaxLoanAmount='${row.MaxLoanAmount}',
            InterestRate='${row.InterestRate}'
          WHERE CTCSlabID=${row.CTCSlabID}
        `,
        });
        toast.success("Row updated successfully", {
          position: "top-center",
          autoClose: 1000,
        });
      } else {
        // Insert new row
        await postRequest(ServerConfig.url, SAVE, {
          query: `
          INSERT INTO [dbo].[CTCSlab] (pn_CompanyID, pn_BranchID, LoanType, MinCTC, MaxCTC, MaxLoanAmount, InterestRate)
          VALUES ('${companyID}','${branchID}',NULL,'${row.MinCTC}','${row.MaxCTC}','${row.MaxLoanAmount}','${row.InterestRate}')
        `,
        });
        toast.success("Row added successfully", {
          position: "top-center",
          autoClose: 1000,
        });
      }

      // Refresh rows
      const updatedData = await postRequest(ServerConfig.url, REPORTS, {
        query: `SELECT CTCSlabID, MinCTC, MaxCTC, MaxLoanAmount, InterestRate FROM [dbo].[CTCSlab] WHERE pn_CompanyID='${companyID}' AND pn_BranchID='${branchID}'`,
      });

      const formattedRows = updatedData.data.map((row, index) => ({
        id: row.CTCSlabID || index + 1,
        CTCSlabID: row.CTCSlabID,
        MinCTC: row.MinCTC,
        MaxCTC: row.MaxCTC,
        MaxLoanAmount: row.MaxLoanAmount,
        InterestRate: row.InterestRate,
      }));

      setRows(formattedRows);
      setEditingRowId(null);
    } catch (error) {
      console.error("Failed to save row:", error);
      toast.error("Failed to save row", {
        position: "top-center",
        autoClose: 1000,
      });
    }
  };

  // Save all rows
  const handleSaveAllRows = async () => {
    if (loading) return;
    setLoading(true);
    try {
      toast.dismiss();
      if (rows.length === 0) {
        toast.error("No CTC slab data to save", {
          position: "top-center",
          autoClose: 1000,
        });
        return;
      }

      // Get existing data
      const existingData = await postRequest(ServerConfig.url, REPORTS, {
        query: `SELECT * FROM [dbo].[CTCSlab] WHERE pn_CompanyID='${companyID}' AND pn_BranchID='${branchID}'`,
      });
      const existingRecords = existingData.data || [];
      const queries = [];

      for (const row of rows) {
        if (
          !row.MinCTC ||
          !row.MaxCTC ||
          !row.MaxLoanAmount ||
          !row.InterestRate
        ) {
          toast.error("Please fill all fields before saving.", {
            position: "top-center",
            autoClose: 1000,
          });
          setLoading(false);
          return;
        }

        const existingRow = existingRecords.find(
          (item) => item.CTCSlabID === row.CTCSlabID
        );

        if (existingRow) {
          const isChanged = [
            "MinCTC",
            "MaxCTC",
            "MaxLoanAmount",
            "InterestRate",
          ].some((key) => existingRow[key] != row[key]);
          if (!isChanged) continue;

          queries.push(`
            UPDATE [dbo].[CTCSlab] SET
              MinCTC='${row.MinCTC}',
              MaxCTC='${row.MaxCTC}',
              MaxLoanAmount='${row.MaxLoanAmount}',
              InterestRate='${row.InterestRate}'
            WHERE CTCSlabID=${row.CTCSlabID}
          `);
        } else {
          queries.push(`
            INSERT INTO [dbo].[CTCSlab] (pn_CompanyID, pn_BranchID, LoanType, MinCTC, MaxCTC, MaxLoanAmount, InterestRate)
            VALUES ('${companyID}','${branchID}',NULL,'${row.MinCTC}','${row.MaxCTC}','${row.MaxLoanAmount}','${row.InterestRate}')
          `);
        }
      }

      if (queries.length === 0) {
        toast.info("No changes to save", {
          position: "top-center",
          autoClose: 1000,
        });
        setLoading(false);
        return;
      }

      await postRequest(ServerConfig.url, SAVE, { query: queries.join("\n") });
      toast.success("Data saved successfully", {
        position: "top-center",
        autoClose: 1000,
      });

      // Refresh rows
      const updatedData = await postRequest(ServerConfig.url, REPORTS, {
        query: `SELECT CTCSlabID, MinCTC, MaxCTC, MaxLoanAmount, InterestRate FROM [dbo].[CTCSlab] WHERE pn_CompanyID='${companyID}' AND pn_BranchID='${branchID}'`,
      });
      const formattedRows = updatedData.data.map((row, index) => ({
        id: row.CTCSlabID || index + 1,
        CTCSlabID: row.CTCSlabID,
        MinCTC: row.MinCTC,
        MaxCTC: row.MaxCTC,
        MaxLoanAmount: row.MaxLoanAmount,
        InterestRate: row.InterestRate,
      }));
      setRows(formattedRows);
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("Failed to save data", {
        position: "top-center",
        autoClose: 1000,
      });
    } finally {
      setLoading(false);
      setEditingRowId(null);
    }
  };

  // Columns for DataGrid
  const columns = [
    { field: "CTCSlabID", headerName: "CTC SLAB ID", width: 150 },
    { field: "MinCTC", headerName: "MIN CTC", width: 150, editable: true },
    { field: "MaxCTC", headerName: "MAX CTC", width: 150, editable: true },
    {
      field: "MaxLoanAmount",
      headerName: "MAX LOAN AMOUNT",
      width: 180,
      editable: true,
    },
    {
      field: "InterestRate",
      headerName: "INTEREST RATE(%)",
      width: 180,
      editable: true,
    },
    {
      field: "actions",
      headerName: "ACTIONS",
      width: 120,
      renderCell: (params) => (
        <div>
          <IconButton color="primary" onClick={() => handleSaveRow(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteRow(params.row.CTCSlabID)}>
            <DeleteOutlinedIcon sx={{ color: "red" }} />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <Grid container style={{ backgroundColor: "#f5f5f5" }}>
      <div style={{ width: "100%" }}>
        <Navbar />
        <Box height={40} />
        <Box sx={{ display: "flex" }}>
          <Sidenav />
          <Grid item xs={12} md={10} style={{ margin: "0 auto" }}>
            <AppBar
              position="static"
              sx={{ width: "100%", marginTop: "70px", minHeight: "60px" }}
            >
              <Toolbar>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", color: "white" }}
                >
                  LOAN SLAB
                </Typography>
              </Toolbar>
            </AppBar>
            <Box
              sx={{
                padding: 2,
                border: "1px solid #ccc",
                width: "100%",
                backgroundColor: "white",
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Company Name"
                    variant="outlined"
                    fullWidth
                    value={companyName}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Branch"
                    variant="outlined"
                    fullWidth
                    value={branchID}
                    onChange={(e) => setBranchID(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  >
                    {branches.map((branch) => (
                      <MenuItem
                        key={branch.pn_BranchID}
                        value={branch.pn_BranchID}
                      >
                        {branch.BranchName}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Box>

            <Box style={{ height: 300, width: "100%", margin: "20px auto" }}>
              <DataGrid
                rows={rows}
                columns={columns}
                processRowUpdate={handleProcessRowUpdate}
                editMode="cell"
              />
            </Box>

            <Box container justifyContent="flex-end" sx={{ marginBottom: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddRow}
                sx={{ marginRight: 2 }}
              >
                Add Row
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveAllRows}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            </Box>
          </Grid>
        </Box>
      </div>
    </Grid>
  );
};

export default CTCSlabTable;

























// import React, { useState, useEffect } from "react";
// import {
//   Grid,
//   Typography,
//   AppBar,
//   Toolbar,
//   Button,
//   Box,
//   Card,
// } from "@mui/material";
// import { Row, Col, Form } from "react-bootstrap";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";

// import Navbar from "../../Home Page-comapny/Navbar1";
// import Sidenav from "../../Home Page-comapny/Sidenav1";
// import { postRequest } from "../../../serverconfiguration/requestcomp";
// import { ServerConfig } from "../../../serverconfiguration/serverconfig";
// import { REPORTS, SAVE } from "../../../serverconfiguration/controllers";
// const CTCSlabMaster = () => {
//   const [branchFilter, setBranchFilter] = useState("");
//   const [loanTypeFilter, setLoanTypeFilter] = useState("");
//   const [branch, setBranch] = useState([]);
//   const [rowData, setRowData] = useState([]);
//   const [companyID, setCompanyID] = useState(1); // Assuming companyID is 1 for demo

//   // Fetch company ID from session storage
//   useEffect(() => {
//     const fetchCompanyID = async () => {
//       try {
//         const user = sessionStorage.getItem("user");
//         if (!user) return;

//         const res = await postRequest(ServerConfig.url, REPORTS, {
//           query: `select pn_CompanyID from paym_Company where company_user_id = '${user}'`,
//         });

//         if (res && res.length > 0) {
//           setCompanyID(res[0].pn_CompanyID);
//         }
//       } catch (err) {
//         console.error("Error fetching company ID:", err);
//       }
//     };

//     fetchCompanyID();
//   }, []);

//   // Fetch branches
//   useEffect(() => {
//     const fetchBranches = async () => {
//       try {
//         const res = await postRequest(ServerConfig.url, REPORTS, {
//           query: `select * from paym_branch where pn_CompanyID = '${companyID}'`,
//         });

//         // ✅ Ensure it's always an array
//         setBranch(Array.isArray(res) ? res : []);
//       } catch (err) {
//         console.error("Error fetching branches:", err);
//         setBranch([]); // fallback to empty array
//       }
//     };

//     if (companyID) {
//       fetchBranches();
//     }
//   }, [companyID]);

//   // Fetch CTC Slabs
//   // Fetch CTC Slabs
//   useEffect(() => {
//     const fetchData = async () => {
//       const result = await postRequest(ServerConfig.url, REPORTS, {
//         query: "SELECT * FROM CTCSlab",
//       });
//       setRowData(Array.isArray(result) ? result : []);
//     };
//     fetchData();
//   }, []);

//   const handleAddRow = () => {
//     const newRow = {
//       CTCSlabID: Date.now(),
//       MinCTC: "",
//       MaxCTC: "",
//       MaxLoanAmount: "",
//       InterestRate: "",
//       pn_CompanyID: 1,
//       pn_BranchID: branchFilter || null,
//       LoanType: loanTypeFilter || "",
//     };
//     setRowData([...rowData, newRow]);
//   };

//   const handleSaveAll = async () => {
//     for (let row of rowData) {
//       if (!row.CTCSlabID.toString().startsWith("temp")) continue;
//       await postRequest(ServerConfig.url, SAVE, {
//         query: `
//           INSERT INTO CTCSlab (MinCTC, MaxCTC, MaxLoanAmount, InterestRate, pn_CompanyID, pn_BranchID, LoanType)
//           VALUES ('${row.MinCTC}', '${row.MaxCTC}', '${row.MaxLoanAmount}', '${row.InterestRate}',
//                   '${row.pn_CompanyID}', '${row.pn_BranchID}', '${row.LoanType}')
//         `,
//       });
//     }
//   };

//   const columnDefs = [
//     { field: "CTCSlabID", headerName: "ID", width: 100 },
//     { field: "MinCTC", headerName: "Min CTC", editable: true },
//     { field: "MaxCTC", headerName: "Max CTC", editable: true },
//     { field: "MaxLoanAmount", headerName: "Max Loan", editable: true },
//     { field: "InterestRate", headerName: "Interest %", editable: true },
//     { field: "LoanType", headerName: "Loan Type", editable: true },
//   ];

//   // ✅ Filtering
//   const filteredData = Array.isArray(rowData)
//     ? rowData.filter(
//         (row) =>
//           (branchFilter ? row.pn_BranchID == branchFilter : true) &&
//           (loanTypeFilter ? row.LoanType === loanTypeFilter : true)
//       )
//     : [];

//   return (
//     <Grid container sx={{ minHeight: "100vh", backgroundColor: "#f0f4f8" }}>
//       <Navbar />
//       <Grid item xs={12} sx={{ display: "flex" }}>
//         <Sidenav />

//         <Grid item xs={12} sm={10} sx={{ p: 5, margin: "100px auto" }}>
//           {/* Header */}
//           <AppBar
//             position="static"
//             sx={{
//               background: "linear-gradient(90deg, #6a11cb, #2575fc)",
//               mb: 3,
//               borderRadius: 2,
//             }}
//           >
//             <Toolbar>
//               <Typography
//                 variant="h5"
//                 sx={{ fontWeight: "bold", color: "#fff" }}
//               >
//                 CTC Slab Master
//               </Typography>
//             </Toolbar>
//           </AppBar>

//           {/* Filters + Buttons */}
//           <Card
//             className="p-3 mb-3 shadow"
//             style={{
//               borderRadius: "12px",
//               background: "linear-gradient(90deg, #6a11cb, #2575fc)",
//             }}
//           >
//             <Row className="align-items-center">
//               <Col xs={12} sm={6} md={4} className="mb-2">
//                 <Form.Select
//                   value={branchFilter}
//                   onChange={(e) => setBranchFilter(e.target.value)}
//                   style={{ backgroundColor: "#ffffff", color: "#000" }}
//                 >
//                   <option value="">All Branches</option>
//                   {branch.map((b) => (
//                     <option key={b.pn_BranchID} value={b.pn_BranchID}>
//                       {b.BranchName}
//                     </option>
//                   ))}
//                 </Form.Select>
//               </Col>

//               <Col xs={12} sm={6} md={4} className="mb-2">
//                 <Form.Select
//                   value={loanTypeFilter}
//                   onChange={(e) => setLoanTypeFilter(e.target.value)}
//                   style={{ backgroundColor: "#ffffff", color: "#000" }}
//                 >
//                   <option value="">All Loan Types</option>
//                   <option value="Personal">Personal</option>
//                   <option value="Home">Home</option>
//                   <option value="Education">Education</option>
//                 </Form.Select>
//               </Col>

//               <Col xs={12} md={4} className="text-md-end">
//                 <Button
//                   onClick={handleAddRow}
//                   className="me-2"
//                   style={{
//                     backgroundColor: "#ff4b1f",
//                     border: "none",
//                     color: "#ffff",
//                   }}
//                 >
//                   Add Slab
//                 </Button>
//                 <Button
//                   onClick={handleSaveAll}
//                   style={{
//                     backgroundColor: "#1fddff",
//                     border: "none",
//                     color: "#000",
//                   }}
//                 >
//                   Save All
//                 </Button>
//               </Col>
//             </Row>
//           </Card>

//           {/* Grid */}
//           <Box
//             className="ag-theme-alpine"
//             sx={{
//               height: "auto",
//               width: "100%",
//               borderRadius: 3,
//               overflow: "hidden",
//               boxShadow: "0px 8px 20px rgba(0,0,0,0.15)",
//               mb: 3,
//             }}
//           >
//             <AgGridReact
//               rowData={rowData} // use raw data to debug first
//               columnDefs={columnDefs}
//               domLayout="autoHeight"
//               defaultColDef={{ flex: 1, minWidth: 120, resizable: true }}
//               pagination={true}
//               paginationPageSize={10}
//               animateRows={true}
//               getRowStyle={(params) => ({
//                 backgroundColor:
//                   params.node.rowIndex % 2 === 0 ? "#e3f2fd" : "#ffffff", // striped blue & white
//               })}
//             />
//           </Box>
//         </Grid>
//       </Grid>
//     </Grid>
//   );
// };

// export default CTCSlabMaster;
