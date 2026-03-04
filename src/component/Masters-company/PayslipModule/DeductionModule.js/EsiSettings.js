// import React, { useState, useEffect } from "react";
// import {
//   Button,
//   Typography,
//   Box,
//   CircularProgress,
//   AppBar,
//   Toolbar,
//   Grid,
// } from "@mui/material";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import { toast } from 'react-toastify';
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import { ServerConfig } from "../../../../serverconfiguration/serverconfig";
// import { postRequest } from "../../../../serverconfiguration/requestcomp";
// import { REPORTS } from "../../../../serverconfiguration/controllers";
// import Sidenav from "../../../Home Page-comapny/Sidenav1";
// import Navbar from "../../../Home Page-comapny/Navbar1";
// import 'bootstrap/dist/css/bootstrap.min.css';

// const ESIsettings = () => {
//   const [isloggedin, setIsLoggedIn] = useState(sessionStorage.getItem("user"));
//   const [company, setCompany] = useState([]);
//   const [rowData, setRowData] = useState([
//     { id: 1, label: "Effective Month From", value: "" },
//     { id: 2, label: "Effective From Year", value: "" },
//     { id: 3, label: "Lower Limit", value: "" },
//     { id: 4, label: "Upper Limit", value: "" },
//     { id: 5, label: "Employee Contribution (%)", value: "" },
//     { id: 6, label: "Employer Contribution (%)", value: "" },
//     { id: 7, label: "Rounding Options", value: "" },
//   ]);
//   const [originalRowData, setOriginalRowData] = useState(JSON.parse(JSON.stringify(rowData)));
//   const [isSaving, setIsSaving] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const months = [
//     "January", "February", "March", "April", "May", "June", "July",
//     "August", "September", "October", "November", "December",
//   ];

//   const handleCellValueChange = (params) => {
//     if (!params || !params.data) return;
    
//     const updatedData = rowData.map((row) =>
//       row.id === params.data.id ? { ...row, value: params.newValue } : row
//     );
//     setRowData(updatedData);
//   };

//   const columns = [
//     {
//       headerName: "FIELD",
//       field: "label",
//       flex: 1,
//       minWidth: 100,
//       sortable: true,
//       cellStyle: { textAlign: "left" },
//       headerClass: "ag-center-header",
//     },
//     {
//       headerName: "VALUE",
//       field: "value",
//       editable: true,
//       flex: 1,
//       minWidth: 100,
//       valueFormatter: (params) => {
//         if (!params || !params.data || params.value === null || params.value === undefined) return "";
        
//         if (params.data.label && params.data.label.includes("%")) {
//           const value = parseFloat(params.value);
//           return isNaN(value) ? "" : `${value}%`;
//         }

//         if (params.data.label && 
//             (params.data.label === "Effective From Year" || 
//              params.data.label === "Lower Limit" || 
//              params.data.label === "Upper Limit")) {
//           const intValue = parseInt(params.value, 10);
//           return isNaN(intValue) ? "" : intValue;
//         }

//         return params.value;
//       },
//       valueParser: (params) => {
//         if (!params || !params.newValue) return null;
//         return params.newValue;
//       },
//       cellStyle: { textAlign: "left" },
//       cellEditorSelector: (params) => {
//         if (!params || !params.data) return null;
        
//         if (params.data.label === "Effective From Year") {
//           const currentYear = new Date().getFullYear();
//           const years = Array.from({ length: 20 }, (_, i) => currentYear - i);
//           return { component: "agSelectCellEditor", params: { values: years } };
//         }
//         if (params.data.label === "Effective Month From") {
//           return {
//             component: "agSelectCellEditor",
//             params: { values: months },
//           };
//         }
//         if (params.data.label === "Rounding Options") {
//           return {
//             component: "agSelectCellEditor",
//             params: {
//               values: ["Rounded to Next Rupee", "Round to Nearest Rupee"],
//             },
//           };
//         }
//         return null;
//       },
//       headerClass: "ag-center-header",
//     },
//   ];

//   const fetchData = async () => {
//     setIsLoading(true);
//     try {
//       const companyResponse = await postRequest(ServerConfig.url, REPORTS, {
//         query: `SELECT * FROM paym_Company WHERE Company_User_Id = '${isloggedin}'`,
//       });

//       const companyData = companyResponse.data || [];
//       setCompany(companyData);

//       if (companyData.length > 0) {
//         const esiSettingsQuery = `
//           SELECT * FROM [dbo].[ESI_Settings] 
//           WHERE pn_CompanyID = ${companyData[0].pn_CompanyID}
//         `;
//         const esiResponse = await postRequest(ServerConfig.url, REPORTS, {
//           query: esiSettingsQuery,
//         });
//         const esiData = esiResponse.data || [];

//         if (esiData.length > 0) {
//           const updatedRowData = rowData.map((row) => {
//             const columnMapping = {
//               "Effective Month From": "Effective_Month_From",
//               "Effective From Year": "Effective_From_Year",
//               "Lower Limit": "Lower_Limit",
//               "Upper Limit": "Upper_Limit",
//               "Employee Contribution (%)": "Employee_Contribution(%)",
//               "Employer Contribution (%)": "Employer_Contribution(%)",
//               "Rounding Options": "Rounding_Options",
//             };

//             const dbColumn = columnMapping[row.label];
//             const dbValue = esiData[0][dbColumn];
            
//             return {
//               ...row,
//               value: dbValue !== null && dbValue !== undefined ? dbValue : "",
//             };
//           });
//           setRowData(updatedRowData);
//           setOriginalRowData(JSON.parse(JSON.stringify(updatedRowData)));
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       toast.error("Failed to load data. Please try again.", {
//         position: "top-center",
//         autoClose: 1000,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSave = async () => {
//     setIsSaving(true);
//     try {

//        toast.dismiss();
//       // Check if any value has changed
//       const hasChanges = rowData.some(
//         (row, index) => row.value !== originalRowData[index]?.value
//       );

//       if (!hasChanges) {
//          toast.dismiss();
//         toast.info("No changes detected.", {
//           position: "top-center",
//           autoClose: 1000,
//         });
//         return;
//       }

//       const data = rowData.reduce((acc, row) => {
//         acc[row.label] = row.value;
//         return acc;
//       }, {});

//       const checkQuery = `
//         SELECT COUNT(*) as count FROM [dbo].[ESI_Settings] 
//         WHERE pn_CompanyID = ${company[0].pn_CompanyID}
//       `;
//       const checkResponse = await postRequest(ServerConfig.url, REPORTS, {
//         query: checkQuery,
//       });
//       const existingDataCount = checkResponse.data[0]?.count || 0;

//       let query;
//       if (existingDataCount > 0) {
//         query = `
//           UPDATE [dbo].[ESI_Settings]
//           SET
//             Effective_Month_From = ${data["Effective Month From"] ? `'${data["Effective Month From"]}'` : "NULL"},
//             Effective_From_Year = ${data["Effective From Year"] ? parseInt(data["Effective From Year"], 10) : "NULL"},
//             Lower_Limit = ${data["Lower Limit"] !== undefined && data["Lower Limit"] !== "" 
//               ? parseInt(data["Lower Limit"], 10) : "NULL"},
//             Upper_Limit = ${data["Upper Limit"] !== undefined && data["Upper Limit"] !== "" 
//               ? parseInt(data["Upper Limit"], 10) : "NULL"},
//             [Employee_Contribution(%)] = ${data["Employee Contribution (%)"] !== undefined && data["Employee Contribution (%)"] !== "" 
//               ? parseFloat(data["Employee Contribution (%)"]) : "NULL"},
//             [Employer_Contribution(%)] = ${data["Employer Contribution (%)"] !== undefined && data["Employer Contribution (%)"] !== "" 
//               ? parseFloat(data["Employer Contribution (%)"]) : "NULL"},
//             Rounding_Options = ${data["Rounding Options"] ? `'${data["Rounding Options"]}'` : "NULL"}
//           WHERE pn_CompanyID = ${company[0].pn_CompanyID}
//         `;
//       } else {
//         query = `
//           INSERT INTO [dbo].[ESI_Settings] 
//           (
//             pn_CompanyID, Effective_Month_From, Effective_From_Year, Lower_Limit, 
//             Upper_Limit, [Employee_Contribution(%)], [Employer_Contribution(%)], 
//             Rounding_Options
//           ) 
//           VALUES 
//           (
//             ${company[0].pn_CompanyID}, 
//             ${data["Effective Month From"] ? `'${data["Effective Month From"]}'` : "NULL"}, 
//             ${data["Effective From Year"] ? parseInt(data["Effective From Year"], 10) : "NULL"}, 
//             ${data["Lower Limit"] !== undefined && data["Lower Limit"] !== "" 
//               ? parseInt(data["Lower Limit"], 10) : "NULL"}, 
//             ${data["Upper Limit"] !== undefined && data["Upper Limit"] !== "" 
//               ? parseInt(data["Upper Limit"], 10) : "NULL"}, 
//             ${data["Employee Contribution (%)"] !== undefined && data["Employee Contribution (%)"] !== "" 
//               ? parseFloat(data["Employee Contribution (%)"]) : "NULL"}, 
//             ${data["Employer Contribution (%)"] !== undefined && data["Employer Contribution (%)"] !== "" 
//               ? parseFloat(data["Employer Contribution (%)"]) : "NULL"}, 
//             ${data["Rounding Options"] ? `'${data["Rounding Options"]}'` : "NULL"}
//           )
//         `;
//       }

//       await postRequest(ServerConfig.url, REPORTS, { query });

//       toast.success(
//         existingDataCount > 0 
//           ? "ESI settings updated successfully!" 
//           : "ESI settings saved successfully!",
//         {
//           position: "top-center",
//           autoClose: 1000,
//         }
//       );

//       // Refresh data after save
//       await fetchData();

//     } catch (error) {
//       console.error("Error saving or updating data:", error);
//       toast.error("Failed to save ESI settings.", {
//         position: "top-center",
//         autoClose: 1000,
//       });
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   useEffect(() => {
//     if (isloggedin) fetchData();
//   }, [isloggedin]);

//   return (
//     <Grid container style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
//       <Grid item xs={12}>
//         <Navbar />
//       </Grid>
//       <Grid item xs={12} sx={{ display: "flex" }}>
//         <Sidenav />
//         <Grid
//           item xs={12} sm={10} md={8} lg={7} 
//           sx={{ 
//             padding: { xs: "20px", sm: "40px" }, 
//             margin: '0 auto',
//             marginTop: '70px'
//           }}
//         >
//           <AppBar position="static" sx={{ width: '100%', }}>
//             <Toolbar>
//               <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
//                 ESI SETTINGS
//               </Typography>
//             </Toolbar>
//           </AppBar>
          
//           <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
//             <div
//               className="ag-theme-alpine"
//               style={{
//                 width: '100%',
//                 height: '345px',
//               }}
//             >
//               {isLoading ? (
//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     height: '100%'
//                   }}
//                 >
//                   <CircularProgress />
//                 </Box>
//               ) : (
//                 <AgGridReact
//                   columnDefs={columns}
//                                 getRowHeight={() => 33}

//                   rowData={rowData}
//                   onCellValueChanged={handleCellValueChange}
//                   getRowStyle={(params) => ({
//                     backgroundColor: params.node.rowIndex % 2 === 0 ? '#e3f2fd' : 'white'
//                   })}
//                 />
//               )}
//             </div>
            
//             <Box display="flex" justifyContent="flex-end">
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleSave}
//                 disabled={isSaving || isLoading}
//                 startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : null}
//               >
//                 {isSaving ? "Saving..." : "Save"}
//               </Button>
//             </Box>
//           </Box>
//         </Grid>
//       </Grid>
//     </Grid>
//   );
// };

// export default ESIsettings;



import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Box,
  CircularProgress,
  AppBar,
  Toolbar,
  Grid,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { toast } from "react-toastify";
import { ServerConfig } from "../../../../serverconfiguration/serverconfig";
import { postRequest } from "../../../../serverconfiguration/requestcomp";
import { REPORTS } from "../../../../serverconfiguration/controllers";
import Sidenav from "../../../Home Page-comapny/Sidenav1";
import Navbar from "../../../Home Page-comapny/Navbar1";
import "bootstrap/dist/css/bootstrap.min.css";

const ESIsettings = () => {
  const [isloggedin] = useState(sessionStorage.getItem("user"));
  const [company, setCompany] = useState([]);
  const [rowData, setRowData] = useState([
    { id: 1, label: "Effective Month From", value: "" },
    { id: 2, label: "Effective From Year", value: "" },
    { id: 3, label: "Lower Limit", value: "" },
    { id: 4, label: "Upper Limit", value: "" },
    { id: 5, label: "Employee Contribution (%)", value: "" },
    { id: 6, label: "Employer Contribution (%)", value: "" },
    { id: 7, label: "Rounding Options", value: "" },
  ]);
  const [originalRowData, setOriginalRowData] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const databaseName = sessionStorage.getItem("databaseName"); // ✅ dynamic DB name

  const months = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December",
  ];

  const handleCellValueChange = (params) => {
    if (!params || !params.data) return;
    setRowData((prevData) =>
      prevData.map((row) =>
        row.id === params.data.id ? { ...row, value: params.newValue } : row
      )
    );
  };

  const columns = [
    {
      headerName: "FIELD",
      field: "label",
      flex: 1,
      minWidth: 150,
      sortable: false,
      cellStyle: { textAlign: "left" },
      headerClass: "ag-center-header",
    },
    {
      headerName: "VALUE",
      field: "value",
      editable: true,
      flex: 1,
      minWidth: 150,
      valueFormatter: (params) => {
        if (!params?.data) return "";
        if (params.data.label.includes("%")) {
          const val = parseFloat(params.value);
          return isNaN(val) ? "" : `${val}%`;
        }
        if (
          ["Effective From Year", "Lower Limit", "Upper Limit"].includes(
            params.data.label
          )
        ) {
          const intVal = parseInt(params.value, 10);
          return isNaN(intVal) ? "" : intVal;
        }
        return params.value;
      },
      valueParser: (params) => (params.newValue ? params.newValue : null),
      cellStyle: { textAlign: "left" },
      cellEditorSelector: (params) => {
        if (!params?.data) return null;
        if (params.data.label === "Effective From Year") {
          const currentYear = new Date().getFullYear();
          const years = Array.from({ length: 20 }, (_, i) => currentYear - i);
          return { component: "agSelectCellEditor", params: { values: years } };
        }
        if (params.data.label === "Effective Month From") {
          return {
            component: "agSelectCellEditor",
            params: { values: months },
          };
        }
        if (params.data.label === "Rounding Options") {
          return {
            component: "agSelectCellEditor",
            params: {
              values: ["Rounded to Next Rupee", "Round to Nearest Rupee"],
            },
          };
        }
        return null;
      },
      headerClass: "ag-center-header",
    },
  ];

  // ✅ Fetch Company & ESI data dynamically
  const fetchData = async () => {
    if (!databaseName) {
      toast.error("Database name missing in sessionStorage!");
      return;
    }

    setIsLoading(true);
    try {
      const companyRes = await postRequest(ServerConfig.url, REPORTS, {
        query: `SELECT * FROM [${databaseName}].[dbo].[paym_Company]
                WHERE Company_User_Id = '${isloggedin}'`,
      });

      const companyData = companyRes.data || [];
      setCompany(companyData);

      if (companyData.length > 0) {
        const esiQuery = `
          SELECT * FROM [${databaseName}].[dbo].[ESI_Settings]
          WHERE pn_CompanyID = ${companyData[0].pn_CompanyID}
        `;
        const esiRes = await postRequest(ServerConfig.url, REPORTS, { query: esiQuery });
        const esiData = esiRes.data || [];

        if (esiData.length > 0) {
          const updatedRows = rowData.map((row) => {
            const map = {
              "Effective Month From": "Effective_Month_From",
              "Effective From Year": "Effective_From_Year",
              "Lower Limit": "Lower_Limit",
              "Upper Limit": "Upper_Limit",
              "Employee Contribution (%)": "Employee_Contribution(%)",
              "Employer Contribution (%)": "Employer_Contribution(%)",
              "Rounding Options": "Rounding_Options",
            };
            const dbCol = map[row.label];
            const val = esiData[0][dbCol];
            return { ...row, value: val ?? "" };
          });
          setRowData(updatedRows);
          setOriginalRowData(JSON.parse(JSON.stringify(updatedRows)));
        }
      }
    } catch (err) {
      console.error("Error fetching ESI data:", err);
      toast.error("Failed to load ESI settings.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Save or Update ESI settings
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const hasChanges = rowData.some(
        (row, i) => row.value !== originalRowData[i]?.value
      );
      if (!hasChanges) {
        toast.info("No changes detected.");
        return;
      }

      const data = rowData.reduce((acc, row) => {
        acc[row.label] = row.value;
        return acc;
      }, {});

      const companyID = company[0]?.pn_CompanyID;

      const checkQuery = `
        SELECT COUNT(*) as count FROM [${databaseName}].[dbo].[ESI_Settings]
        WHERE pn_CompanyID = ${companyID}
      `;
      const checkRes = await postRequest(ServerConfig.url, REPORTS, { query: checkQuery });
      const exists = checkRes.data[0]?.count > 0;

      const query = exists
        ? `
          UPDATE [${databaseName}].[dbo].[ESI_Settings]
          SET Effective_Month_From = '${data["Effective Month From"]}',
              Effective_From_Year = ${data["Effective From Year"] || "NULL"},
              Lower_Limit = ${data["Lower Limit"] || "NULL"},
              Upper_Limit = ${data["Upper Limit"] || "NULL"},
              [Employee_Contribution(%)] = ${data["Employee Contribution (%)"] || "NULL"},
              [Employer_Contribution(%)] = ${data["Employer Contribution (%)"] || "NULL"},
              Rounding_Options = '${data["Rounding Options"]}'
          WHERE pn_CompanyID = ${companyID}`
        : `
          INSERT INTO [${databaseName}].[dbo].[ESI_Settings]
          (pn_CompanyID, Effective_Month_From, Effective_From_Year, Lower_Limit, Upper_Limit, 
           [Employee_Contribution(%)], [Employer_Contribution(%)], Rounding_Options)
          VALUES (${companyID}, '${data["Effective Month From"]}', 
                  ${data["Effective From Year"] || "NULL"},
                  ${data["Lower Limit"] || "NULL"}, ${data["Upper Limit"] || "NULL"},
                  ${data["Employee Contribution (%)"] || "NULL"},
                  ${data["Employer Contribution (%)"] || "NULL"},
                  '${data["Rounding Options"]}')`;

      await postRequest(ServerConfig.url, REPORTS, { query });
      toast.success(exists ? "ESI settings updated successfully!" : "ESI settings saved successfully!");
      await fetchData();
    } catch (err) {
      console.error("Error saving ESI settings:", err);
      toast.error("Failed to save ESI settings.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (isloggedin) fetchData();
  }, [isloggedin]);

  return (
    <Grid container sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Grid item xs={12}>
        <Navbar />
      </Grid>
      <Grid item xs={12} sx={{ display: "flex" }}>
        <Sidenav />
        <Grid
          item
          xs={12}
          sm={10}
          md={8}
          lg={7}
          sx={{
            p: { xs: "20px", sm: "40px" },
            margin: "0 auto",
            marginTop: "70px",
          }}
        >
          <AppBar position="static" sx={{ width: "100%" }}>
            <Toolbar>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "white" }}>
                ESI SETTINGS
              </Typography>
            </Toolbar>
          </AppBar>

          <Box sx={{ mt: 3 }}>
            <div className="ag-theme-alpine" style={{ width: "100%", height: "350px" }}>
              {isLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <CircularProgress />
                </Box>
              ) : (
                <AgGridReact
                  columnDefs={columns}
                  rowData={rowData}
                  onCellValueChanged={handleCellValueChange}
                  getRowHeight={() => 33}
                  getRowStyle={(params) => ({
                    backgroundColor: params.node.rowIndex % 2 === 0 ? "#e3f2fd" : "white",
                  })}
                />
              )}
            </div>

            <Box display="flex" justifyContent="flex-end" mt={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={isSaving || isLoading}
                startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ESIsettings;
