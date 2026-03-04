// import React, { useState, useCallback, useMemo, useEffect } from "react";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-quartz.css";
// import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
// import { ModuleRegistry } from "@ag-grid-community/core";
// import { Button, CardContent, Grid, Typography } from "@mui/material";
// import ReactSelect from "react-select";
// import { ServerConfig } from "../../../../serverconfiguration/serverconfig";
// import CircularProgress from "@mui/material/CircularProgress";
// // or if you're using an older version of Material-UI:
// // import { CircularProgress } from '@material-ui/core';
// import { postRequest } from "../../../../serverconfiguration/requestcomp";
// import { REPORTS, SAVE } from "../../../../serverconfiguration/controllers";
// import Sidenav from "../../../Home Page-comapny/Sidenav1";
// import Navbar from "../../../Home Page-comapny/Navbar1";
// import "./Gridstyle.css";
// import AppBar from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";
// import { toast } from "react-toastify";

// ModuleRegistry.registerModules([ClientSideRowModelModule]);

// function AllowanceMaster() {
//   const [selectedBranches, setSelectedBranches] = useState(["all"]);
//   const [selectedOption, setSelectedOption] = useState("Branch");
//   const [isloggedin, setisloggedin] = useState(sessionStorage.getItem("user"));
//   const [Branch, setBranch] = useState([]);
//   const [savedBranches, setSavedBranches] = useState([]);
//   const [Company, setCompany] = useState([]);
//   const [isSaving, setIsSaving] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const allBranchIDs = Branch.map((e) => e.pn_BranchID);
//   const databaseName = sessionStorage.getItem("databaseName"); // ✅ Get DB name dynamically

//   const initialEmptyRows = useMemo(() => {
//     return Array.from({ length: 5 }, () =>
//       selectedBranches.includes("all")
//         ? { allowance_all: "" }
//         : selectedBranches.reduce((acc, branchID) => {
//             acc[`allowance_${branchID}`] = "";
//             return acc;
//           }, {})
//     );
//   }, [selectedBranches]);

//   const [rowData, setRowData] = useState(initialEmptyRows);
//   const [originalRowData, setOriginalRowData] = useState([]);

//   useEffect(() => {
//     setRowData(initialEmptyRows);
//   }, [initialEmptyRows]);

//   useEffect(() => {
//     async function fetchBranchData() {
//       if (selectedOption === "Branch" && selectedBranches.length > 0) {
//         setIsLoading(true);
//         try {
//           const data1 = await postRequest(ServerConfig.url, REPORTS, {
//             query: `SELECT * FROM [${databaseName}].[dbo].[paym_Company]
//         WHERE Company_User_Id = '${isloggedin}'`,
//           });

//           setCompany(data1.data);

//           if (data1.data.length > 0 && data1.data[0].pn_CompanyID) {
//             const CompanyID = data1.data[0].pn_CompanyID;

//             if (selectedBranches.includes("all")) {
//               const branchData = await postRequest(ServerConfig.url, REPORTS, {
//                 query: `SELECT * FROM [${databaseName}].[dbo].[paym_Branch]
//         WHERE pn_CompanyID = ${CompanyID}`,
//               });
//               setBranch(branchData.data);
//             }
//           }
//         } catch (error) {
//           console.error("Error fetching data:", error);
//           toast.error("Error loading company data", {
//             position: "top-center",
//             autoClose: 1000,
//           });
//         } finally {
//           setIsLoading(false);
//         }
//       }
//     }

//     fetchBranchData();
//   }, [isloggedin, selectedOption, selectedBranches]);

//   useEffect(() => {
//     async function fetchAllowanceData() {
//       if (!Company.length || selectedBranches.includes("all")) return;
//       setIsLoading(true);
//       try {
//         const newData = [];
//         for (let branchID of selectedBranches) {
//           try {
//             const response = await postRequest(ServerConfig.url, REPORTS, {
//               query: `SELECT * FROM [${databaseName}].[dbo].[AllowanceMaster]
//         WHERE pn_CompanyID = ${Company[0].pn_CompanyID} AND pn_BranchID = ${branchID}
//         ORDER BY d_order`,
//             });
//             const branchData = response.data;
//             branchData.forEach((data, index) => {
//               if (!newData[index]) {
//                 newData[index] = {};
//               }
//               newData[index][`allowance_${branchID}`] =
//                 data.v_EarningsName || "";
//             });
//           } catch (error) {
//             console.error("Error fetching allowance data:", error);
//           }
//         }

//         // Fill empty fields for missing branches per row
//         for (const row of newData) {
//           for (const branchID of selectedBranches) {
//             if (
//               branchID !== "all" &&
//               row[`allowance_${branchID}`] === undefined
//             ) {
//               row[`allowance_${branchID}`] = "";
//             }
//           }
//         }

//         setRowData(newData);
//         setOriginalRowData(JSON.parse(JSON.stringify(newData)));
//       } catch (error) {
//         console.error("Error:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     }

//     fetchAllowanceData();
//   }, [selectedBranches, Company]);

//   const branchNameMap = useMemo(() => {
//     return Branch.reduce((map, branch) => {
//       map[branch.pn_BranchID] = branch.BranchName;
//       return map;
//     }, {});
//   }, [Branch]);

//   const columnDefs = useMemo(() => {
//     const baseColumnDef = {
//       editable: true,
//       flex: 1,
//       headerClass: "ag-header-cell-label",
//     };
//     if (selectedBranches.includes("all")) {
//       return [
//         {
//           ...baseColumnDef,
//           field: "allowance_all",
//           headerName: "ALLOWANCE FOR ALL BRANCHES",
//           cellStyle: { textAlign: "left" },
//         },
//       ];
//     } else {
//       return selectedBranches.map((branchID) => ({
//         ...baseColumnDef,
//         field: `allowance_${branchID}`,
//         headerName: branchNameMap[branchID] || branchID,
//         cellStyle: { textAlign: "left" },
//       }));
//     }
//   }, [selectedBranches, branchNameMap]);

//   const branchOptions = useMemo(() => {
//     const options = Branch.filter(
//       (branch) => !savedBranches.includes(branch.pn_BranchID)
//     ).map((branch) => ({
//       value: branch.pn_BranchID,
//       label: branch.BranchName,
//     }));

//     if (!options.find((option) => option.value === "all")) {
//       options.unshift({ value: "all", label: "All branches" });
//     }
//     return options;
//   }, [Branch, savedBranches]);

//   const displayedOptions = useMemo(() => {
//     if (selectedBranches.includes("all")) {
//       return [{ value: "all", label: "All Branches" }];
//     } else {
//       return branchOptions.filter((opt) =>
//         selectedBranches.includes(opt.value)
//       );
//     }
//   }, [branchOptions, selectedBranches]);

//   const handleBranchChange = (selectedOptions) => {
//     if (!selectedOptions) {
//       setSelectedBranches([]);
//       return;
//     }
//     if (selectedOptions.some((option) => option.value === "all")) {
//       setSelectedBranches(["all", ...allBranchIDs]);
//     } else {
//       setSelectedBranches(selectedOptions.map((option) => option.value));
//     }
//   };

//   const addRow = () => {
//     if (rowData.length > 0) {
//       const lastRow = rowData[rowData.length - 1];
//       const hasEmpty = selectedBranches.some((branchID) => {
//         if (branchID === "all") {
//           return !lastRow.allowance_all || lastRow.allowance_all.trim() === "";
//         } else {
//           return (
//             !lastRow[`allowance_${branchID}`] ||
//             lastRow[`allowance_${branchID}`].trim() === ""
//           );
//         }
//       });
//       if (hasEmpty) {
//         toast.dismiss(); // prevent duplicate warning toasts
//         toast.warning(
//           "Please fill in the current row before adding a new one.",
//           {
//             position: "top-center",
//             autoClose: 1000,
//           }
//         );
//         return;
//       }
//     }

//     const newRow = selectedBranches.includes("all")
//       ? { allowance_all: "" }
//       : selectedBranches.reduce((acc, branchID) => {
//           acc[`allowance_${branchID}`] = "";
//           return acc;
//         }, {});
//     setRowData((prev) => [...prev, newRow]);
//   };

//   const onCellValueChanged = useCallback((params) => {
//     const allRowData = [];
//     params.api.forEachNode((node) => allRowData.push(node.data));
//     setRowData(allRowData);
//   }, []);

//   const fetchExistingData = async () => {
//     const branchIDs = selectedBranches.includes("all")
//       ? allBranchIDs
//       : selectedBranches;
//     const conditions = branchIDs
//       .map(
//         (branchID) =>
//           `(pn_CompanyID = ${Company[0]?.pn_CompanyID} AND pn_BranchID = ${branchID})`
//       )
//       .join(" OR ");
//     const query = `SELECT pn_AllowanceID, pn_BranchID, v_EarningsName, d_order
//                FROM [${databaseName}].[dbo].[AllowanceMaster]
//                WHERE ${conditions}`;

//     try {
//       const response = await postRequest(ServerConfig.url, REPORTS, { query });
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching existing data:", error);
//       return [];
//     }
//   };

//   const handlesave = async () => {
//     if (isSaving) return;
//     setIsSaving(true);

//     try {
//       toast.dismiss();

//       // Filter out empty rows
//       const filledRows = rowData.filter((row) =>
//         Object.values(row).some((val) => val?.toString().trim() !== "")
//       );

//       if (filledRows.length === 0) {
//         toast.error("No filled rows to save.", {
//           position: "top-center",
//           autoClose: 1000,
//         });
//         return;
//       }

//       // Check if any values have changed from original
//       const hasChanges = rowData.some((row, rowIndex) => {
//         if (!originalRowData[rowIndex]) return true; // New row

//         return Object.keys(row).some((key) => {
//           const currentValue = row[key]?.toString().trim();
//           const originalValue = originalRowData[rowIndex][key]
//             ?.toString()
//             .trim();
//           return currentValue !== originalValue;
//         });
//       });

//       if (!hasChanges) {
//         toast.info("No changes detected to save.", {
//           position: "top-center",
//           autoClose: 1000,
//         });
//         return;
//       }

//       const branchIDs = selectedBranches.includes("all")
//         ? allBranchIDs
//         : selectedBranches;
//       const allRowData = [];

//       // Prepare data for saving
//       for (let branchID of branchIDs) {
//         const branchRows = filledRows.filter((row) => {
//           const name = selectedBranches.includes("all")
//             ? row.allowance_all
//             : row[`allowance_${branchID}`];
//           return name?.toString().trim() !== "";
//         });

//         branchRows.forEach((row, index) => {
//           const allowanceName = (
//             selectedBranches.includes("all")
//               ? row.allowance_all
//               : row[`allowance_${branchID}`]
//           )
//             ?.toString()
//             .trim();

//           if (!allowanceName) return;

//           allRowData.push({
//             pn_CompanyID: Company[0]?.pn_CompanyID,
//             pn_BranchID: branchID,
//             v_EarningsName: allowanceName,
//             c_Regular: null,
//             c_PF: null,
//             c_ESI: null,
//             c_OT: null,
//             c_LOP: null,
//             c_PT: null,
//             payslip: null,
//             status: null,
//             d_order: index + 1,
//           });
//         });
//       }

//       // Delete existing data first (simpler approach)
//       const deleteQuery = `
//         DELETE FROM [${databaseName}].[dbo].[AllowanceMaster]
//         WHERE pn_CompanyID = ${Company[0]?.pn_CompanyID}
//         ${
//           selectedBranches.includes("all")
//             ? ""
//             : `AND pn_BranchID IN (${selectedBranches.join(",")})`
//         }
//       `;
//       await postRequest(ServerConfig.url, SAVE, { query: deleteQuery });

//       // Insert all new data
//       if (allRowData.length > 0) {
//         const insertValues = allRowData.map(
//           (data) =>
//             `(${data.pn_CompanyID}, ${
//               data.pn_BranchID
//             }, '${data.v_EarningsName.replace(/'/g, "''")}',
//           ${data.c_Regular}, ${data.c_PF}, ${data.c_ESI}, ${data.c_OT},
//           ${data.c_LOP}, ${data.c_PT}, ${data.payslip}, ${data.status}, ${
//               data.d_order
//             })`
//         );

//         const insertQuery = `
//           INSERT INTO [${databaseName}].[dbo].[AllowanceMaster]
//           ([pn_CompanyID], [pn_BranchID], [v_EarningsName],
//           [c_Regular], [c_PF], [c_ESI], [c_OT], [c_LOP], [c_PT],
//           [payslip], [status], [d_order])
//           VALUES ${insertValues.join(", ")}
//         `;
//         await postRequest(ServerConfig.url, SAVE, { query: insertQuery });
//       }

//       toast.success("Allowance master saved successfully!", {
//         position: "top-center",
//         autoClose: 1000,
//       });

//       // Refresh the data after save
//       const conditions = branchIDs
//         .map(
//           (branchID) =>
//             `(pn_CompanyID = ${Company[0].pn_CompanyID} AND pn_BranchID = ${branchID})`
//         )
//         .join(" OR ");
//       const query = `SELECT * FROM [${databaseName}].[dbo].[AllowanceMaster] WHERE ${conditions} ORDER BY d_order`;

//       const response = await postRequest(ServerConfig.url, REPORTS, { query });
//       const updatedData = response.data || [];

//       // Update the grid with the fresh data
//       const newRowData = [];
//       updatedData.forEach((data, index) => {
//         if (!newRowData[index]) {
//           newRowData[index] = {};
//         }
//         newRowData[index][`allowance_${data.pn_BranchID}`] =
//           data.v_EarningsName || "";
//       });

//       setRowData(newRowData);
//       setOriginalRowData(JSON.parse(JSON.stringify(newRowData)));
//     } catch (error) {
//       console.error("Error during save:", error);
//       toast.error("An error occurred while saving.", {
//         position: "top-center",
//         autoClose: 1000,
//       });
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const onGridReady = (params) => {
//     params.api.sizeColumnsToFit();
//   };

//   return (
//     <Grid container style={{ backgroundColor: "#f5f5f5" }}>
//       <Grid item xs={12}>
//         <Navbar />
//       </Grid>
//       <Grid item xs={12} sx={{ display: "flex" }}>
//         <Sidenav />
//         <Grid
//           item
//           xs={12}
//           sm={10}
//           md={8}
//           lg={7}
//           sx={{
//             padding: { xs: "20px", sm: "40px" },
//             overflowY: "auto",
//             margin: "0 auto",
//           }}
//         >
//           <CardContent>
//             <Grid
//               elevation={3}
//               style={{ padding: 2, maxWidth: "970px", margin: "auto" }}
//             >
//               <AppBar
//                 position="static"
//                 sx={{ width: "100%", marginTop: "70px", minHeight: "60px" }}
//               >
//                 <Toolbar sx={{ justifyContent: "left", height: "100%" }}>
//                   <Typography
//                     variant="h5"
//                     gutterBottom
//                     sx={{
//                       textAlign: "left",
//                       fontWeight: "bold",
//                       color: "white",
//                       lineHeight: "60px",
//                     }}
//                   >
//                     ALLOWANCE MASTER
//                   </Typography>
//                 </Toolbar>
//               </AppBar>

//               <div>
//                 <ReactSelect
//                   id="Branch"
//                   name="Branch"
//                   options={branchOptions}
//                   isMulti
//                   onChange={handleBranchChange}
//                   value={displayedOptions}
//                   styles={{
//                     control: (base) => ({
//                       ...base,
//                       minHeight: "40px",
//                       padding: "10px",
//                       width: "100%",
//                       flexWrap: "wrap",
//                     }),
//                     valueContainer: (base) => ({
//                       ...base,
//                       display: "flex",
//                       flexWrap: "wrap",
//                       alignItems: "flex-start",
//                       textAlign: "left",
//                     }),
//                     multiValue: (base) => ({
//                       ...base,
//                       margin: "2px",
//                       textAlign: "left",
//                     }),
//                     option: (base) => ({
//                       ...base,
//                       textAlign: "left",
//                     }),
//                   }}
//                 />
//               </div>

//               <div className="ag-theme-quartz" style={{ width: "100%" }}>
//                 {isLoading ? (
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "center",
//                       alignItems: "center",
//                       height: "200px",
//                     }}
//                   >
//                     <CircularProgress />
//                   </div>
//                 ) : (
//                   <>
//                     <AgGridReact
//                       rowData={rowData}
//                       getRowHeight={() => 33}
//                       columnDefs={columnDefs}
//                       onCellValueChanged={onCellValueChanged}
//                       rowDragManaged={true}
//                       rowDragMultiRow={true}
//                       domLayout="autoHeight"
//                       pagination={true}
//                       paginationPageSize={10}
//                       onGridReady={onGridReady}
//                       style={{ width: "100%", height: "500px" }}
//                       getRowStyle={(params) => ({
//                         backgroundColor:
//                           params.node.rowIndex % 2 === 0
//                             ? "#cde3f2"
//                             : "#ffffff",
//                       })}
//                     />
//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "flex-end",
//                         marginTop: "20px",
//                       }}
//                     >
//                       <Button
//                         variant="contained"
//                         color="primary"
//                         onClick={addRow}
//                       >
//                         Add
//                       </Button>
//                       <Button
//                         variant="contained"
//                         color="primary"
//                         style={{ marginLeft: "10px" }}
//                         onClick={handlesave}
//                         disabled={isSaving}
//                       >
//                         {isSaving ? "Saving..." : "Save"}
//                       </Button>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </Grid>
//           </CardContent>
//         </Grid>
//       </Grid>
//     </Grid>
//   );
// }

// export default AllowanceMaster;

// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-quartz.css";
// import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
// import { ModuleRegistry } from "@ag-grid-community/core";
// import {
//   Button,
//   CardContent,
//   Grid,
//   Typography,
//   CircularProgress,
//   AppBar,
//   Toolbar,
// } from "@mui/material";
// import ReactSelect from "react-select";
// import { ServerConfig } from "../../../../serverconfiguration/serverconfig";
// import { postRequest } from "../../../../serverconfiguration/requestcomp";
// import { REPORTS, SAVE } from "../../../../serverconfiguration/controllers";
// import Sidenav from "../../../Home Page-comapny/Sidenav1";
// import Navbar from "../../../Home Page-comapny/Navbar1";
// import "./Gridstyle.css";
// import { toast } from "react-toastify";

// ModuleRegistry.registerModules([ClientSideRowModelModule]);

// export default function AllowanceMaster() {
//   const databaseName = sessionStorage.getItem("databaseName");
//   const loggedInUser = sessionStorage.getItem("user");

//   const [company, setCompany] = useState(null);
//   const [branches, setBranches] = useState([]); // all branches for company
//   const [selectedBranches, setSelectedBranches] = useState(["all"]); // default all
//   const [rowData, setRowData] = useState([]);
//   const [originalRowData, setOriginalRowData] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);

//   // ---------- Helpers ----------
//   const allBranchIDs = useMemo(
//     () => branches.map((b) => b.pn_BranchID),
//     [branches]
//   );

//   const branchNameMap = useMemo(() => {
//     const map = {};
//     for (const b of branches) map[b.pn_BranchID] = b.BranchName;
//     return map;
//   }, [branches]);

//   // Build column definitions depending on selection
//   const columnDefs = useMemo(() => {
//     const base = { editable: true, flex: 1, headerClass: "ag-header-cell-label" };
//     if (selectedBranches.includes("all")) {
//       return [
//         {
//           ...base,
//           field: "allowance_all",
//           headerName: "ALLOWANCE FOR ALL BRANCHES",
//           cellStyle: { textAlign: "left" },
//         },
//       ];
//     } else {
//       return selectedBranches.map((id) => ({
//         ...base,
//         field: `allowance_${id}`,
//         headerName: branchNameMap[id] || id,
//         cellStyle: { textAlign: "left" },
//       }));
//     }
//   }, [selectedBranches, branchNameMap]);

//   // Build react-select options
//   const branchOptions = useMemo(() => {
//     const opts = branches.map((b) => ({ value: b.pn_BranchID, label: b.BranchName }));
//     // ensure All branches present
//     if (!opts.find((o) => o.value === "all")) opts.unshift({ value: "all", label: "All Branches" });
//     return opts;
//   }, [branches]);

//   const displayedOptions = useMemo(() => {
//     if (selectedBranches.includes("all")) return [{ value: "all", label: "All Branches" }];
//     return branchOptions.filter((opt) => selectedBranches.includes(opt.value));
//   }, [branchOptions, selectedBranches]);

//   // ---------- Fetch Company & Branches once when component mounts or user changes ----------
//   useEffect(() => {
//     async function fetchCompanyAndBranches() {
//       setIsLoading(true);
//       try {
//         // fetch company by user
//         const companyRes = await postRequest(ServerConfig.url, REPORTS, {
//           query: `SELECT * FROM [${databaseName}].[dbo].[paym_Company] WHERE Company_User_Id = '${loggedInUser}'`,
//         });

//         const companyData = companyRes?.data?.[0] || null;
//         if (!companyData) {
//           toast.error("Company not found for user.", { position: "top-center", autoClose: 1500 });
//           setCompany(null);
//           setBranches([]);
//           return;
//         }
//         setCompany(companyData);

//         // fetch branches for that company
//         const branchRes = await postRequest(ServerConfig.url, REPORTS, {
//           query: `SELECT * FROM [${databaseName}].[dbo].[paym_Branch] WHERE pn_CompanyID = ${companyData.pn_CompanyID}`,
//         });
//         setBranches(branchRes?.data || []);
//       } catch (err) {
//         console.error("Error fetching company/branches:", err);
//         toast.error("Error loading company/branches.", { position: "top-center", autoClose: 1500 });
//       } finally {
//         setIsLoading(false);
//       }
//     }

//     fetchCompanyAndBranches();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [loggedInUser, databaseName]);

//   // ---------- Fetch Allowance Data ----------
//   useEffect(() => {
//     async function fetchAllowance() {
//       if (!company) return;
//       setIsLoading(true);
//       try {
//         // CASE: ALL selected -> fetch distinct allowance names across all branches
//         if (selectedBranches.includes("all")) {
//           // fetch ordered distinct v_EarningsName using d_order where possible
//           const q = `
//             SELECT v_EarningsName, MIN(d_order) as mn_order
//             FROM [${databaseName}].[dbo].[AllowanceMaster]
//             WHERE pn_CompanyID = ${company.pn_CompanyID}
//             GROUP BY v_EarningsName
//             ORDER BY mn_order
//           `;
//           const res = await postRequest(ServerConfig.url, REPORTS, { query: q });
//           const data = res?.data || [];

//           const rows = data.map((r) => ({ allowance_all: r.v_EarningsName || "" }));
//           // if no data, keep few empty rows for user convenience
//           setRowData(rows.length ? rows : [{ allowance_all: "" }, { allowance_all: "" }, { allowance_all: "" }]);
//           setOriginalRowData(JSON.parse(JSON.stringify(rows)));
//           setIsLoading(false);
//           return;
//         }

//         // CASE: specific branches selected -> fetch for those branches in one query
//         const branchList = selectedBranches.join(",");
//         const q = `
//           SELECT pn_BranchID, v_EarningsName, d_order
//           FROM [${databaseName}].[dbo].[AllowanceMaster]
//           WHERE pn_CompanyID = ${company.pn_CompanyID}
//             AND pn_BranchID IN (${branchList})
//           ORDER BY pn_BranchID, d_order
//         `;
//         const resp = await postRequest(ServerConfig.url, REPORTS, { query: q });
//         const allRows = resp?.data || [];

//         // Group by branch and produce arrays of earnings by index
//         const grouped = {};
//         let maxLen = 0;
//         for (const r of allRows) {
//           const bid = r.pn_BranchID;
//           if (!grouped[bid]) grouped[bid] = [];
//           grouped[bid].push(r.v_EarningsName || "");
//           if (grouped[bid].length > maxLen) maxLen = grouped[bid].length;
//         }

//         // build rows aligning per index
//         const newRowData = [];
//         for (let i = 0; i < maxLen; i++) {
//           const row = {};
//           for (const bid of selectedBranches) {
//             row[`allowance_${bid}`] = (grouped[bid] && grouped[bid][i]) ? grouped[bid][i] : "";
//           }
//           newRowData.push(row);
//         }

//         // if no rows found, init with 3 empty rows
//         setRowData(newRowData.length ? newRowData : [selectedBranches.reduce((acc, b) => ({ ...acc, [`allowance_${b}`]: "" }), {})]);
//         setOriginalRowData(JSON.parse(JSON.stringify(newRowData)));
//       } catch (err) {
//         console.error("Error fetching allowances:", err);
//         toast.error("Error loading allowance data.", { position: "top-center", autoClose: 1500 });
//       } finally {
//         setIsLoading(false);
//       }
//     }

//     fetchAllowance();
//   }, [selectedBranches, company, databaseName]);

//   // ---------- Handlers ----------
//   const handleBranchChange = useCallback(
//     (selectedOptions) => {
//       if (!selectedOptions || selectedOptions.length === 0) {
//         setSelectedBranches([]);
//         return;
//       }

//       // If user selected 'all' we will set ['all', ...allIds] so UI keeps track and SAVE logic uses all ids
//       const hasAll = selectedOptions.some((o) => o.value === "all");
//       if (hasAll) {
//         setSelectedBranches(["all", ...allBranchIDs]);
//       } else {
//         setSelectedBranches(selectedOptions.map((o) => o.value));
//       }
//     },
//     [allBranchIDs]
//   );

//   const onCellValueChanged = useCallback((params) => {
//     // get entire grid data
//     const all = [];
//     params.api.forEachNode((n) => all.push(n.data));
//     setRowData(all);
//   }, []);

//   const addRow = useCallback(() => {
//     // block adding if last row is empty
//     const last = rowData[rowData.length - 1];
//     if (last) {
//       const hasEmpty = selectedBranches.some((bid) => {
//         if (bid === "all") return !last.allowance_all || last.allowance_all.toString().trim() === "";
//         return !last[`allowance_${bid}`] || last[`allowance_${bid}`].toString().trim() === "";
//       });
//       if (hasEmpty) {
//         toast.warning("Please fill the current row before adding a new one.", { position: "top-center", autoClose: 1200 });
//         return;
//       }
//     }

//     const newRow = selectedBranches.includes("all")
//       ? { allowance_all: "" }
//       : selectedBranches.reduce((acc, b) => ({ ...acc, [`allowance_${b}`]: "" }), {});
//     setRowData((prev) => [...prev, newRow]);
//   }, [rowData, selectedBranches]);

//   // Utility: escape single quotes for SQL insertion
//   const escapeSQL = (s) => (s == null ? "" : s.replace(/'/g, "''"));

//   // ---------- SAVE ----------
//   const handleSave = useCallback(async () => {
//     if (isSaving) return;
//     if (!company) {
//       toast.error("Company not set.", { position: "top-center", autoClose: 1200 });
//       return;
//     }

//     setIsSaving(true);
//     try {
//       // Filter only filled cells
//       const filledRows = rowData.filter((row) =>
//         Object.values(row).some((v) => v && v.toString().trim() !== "")
//       );

//       if (filledRows.length === 0) {
//         toast.error("No filled rows to save.", { position: "top-center", autoClose: 1200 });
//         setIsSaving(false);
//         return;
//       }

//       // Build branch list to operate on
//       const branchIDs = selectedBranches.includes("all") ? allBranchIDs : selectedBranches;
//       if (!branchIDs || branchIDs.length === 0) {
//         toast.error("No branches selected.", { position: "top-center", autoClose: 1200 });
//         setIsSaving(false);
//         return;
//       }

//       // Build data to insert:
//       const insertTuples = [];
//       if (selectedBranches.includes("all")) {
//         // for each filled row, insert for each branch
//         filledRows.forEach((row) => {
//           const allowanceName = (row.allowance_all || "").toString().trim();
//           if (!allowanceName) return;
//           for (const bid of branchIDs) {
//             insertTuples.push(`(${company.pn_CompanyID}, ${bid}, '${escapeSQL(allowanceName)}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0)`);
//           }
//         });
//       } else {
//         // per branch columns
//         for (const bid of branchIDs) {
//           filledRows.forEach((row, idx) => {
//             const val = (row[`allowance_${bid}`] || "").toString().trim();
//             if (val) {
//               insertTuples.push(`(${company.pn_CompanyID}, ${bid}, '${escapeSQL(val)}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, ${/*d_order*/ idx + 1})`);
//             }
//           });
//         }
//       }

//       // Delete existing for these branches first
//       const deleteQuery = `
//         DELETE FROM [${databaseName}].[dbo].[AllowanceMaster]
//         WHERE pn_CompanyID = ${company.pn_CompanyID}
//           AND pn_BranchID IN (${branchIDs.join(",")})
//       `;
//       await postRequest(ServerConfig.url, SAVE, { query: deleteQuery });

//       // Insert new rows (only if any)
//       if (insertTuples.length > 0) {
//         // Note: For performance / SQL length limits you might want to chunk large inserts
//         const insertQuery = `
//           INSERT INTO [${databaseName}].[dbo].[AllowanceMaster]
//             (pn_CompanyID, pn_BranchID, v_EarningsName, c_Regular, c_PF, c_ESI, c_OT, c_LOP, c_PT, payslip, status, d_order)
//           VALUES ${insertTuples.join(", ")}
//         `;
//         await postRequest(ServerConfig.url, SAVE, { query: insertQuery });
//       }

//       toast.success("Saved successfully!", { position: "top-center", autoClose: 1200 });

//       // Refresh after save (re-run fetch)
//       // Keep same selectedBranches to refresh view accordingly
//       // We'll trigger fetch by resetting company state to force effect — but simpler: call fetchAllowance inline
//       // Re-run allowance fetch logic:
//       // Instead of duplicating logic, call the effect by temporarily toggling selectedBranches to itself
//       setSelectedBranches((prev) => [...prev]);
//     } catch (err) {
//       console.error("Save error:", err);
//       toast.error("Error saving Allowance Master.", { position: "top-center", autoClose: 1500 });
//     } finally {
//       setIsSaving(false);
//     }
//   }, [isSaving, company, rowData, selectedBranches, allBranchIDs, databaseName]);

//   // Re-fetch allowances whenever selectedBranches array content changes (we already dependent on selectedBranches)
//   // (We used setSelectedBranches([...prev]) after save to trigger fetch)

//   // ---------- Grid ready ----------
//   const onGridReady = useCallback((params) => {
//     params.api.sizeColumnsToFit();
//   }, []);

//   // ---------- Render ----------
//   return (
//     <Grid container style={{ backgroundColor: "#f5f5f5" }}>
//       <Grid item xs={12}><Navbar /></Grid>
//       <Grid item xs={12} sx={{ display: "flex" }}>
//         <Sidenav />
//         <Grid item xs={12} sm={10} md={8} lg={7} sx={{ padding: { xs: "20px", sm: "40px" }, overflowY: "auto", margin: "0 auto" }}>
//           <CardContent>
//             <AppBar position="static" sx={{ width: "100%", marginTop: "70px", minHeight: "60px" }}>
//               <Toolbar sx={{ justifyContent: "left", height: "100%" }}>
//                 <Typography variant="h5" gutterBottom sx={{ textAlign: "left", fontWeight: "bold", color: "white", lineHeight: "60px" }}>
//                   ALLOWANCE MASTER
//                 </Typography>
//               </Toolbar>
//             </AppBar>

//             <div style={{ margin: "16px 0" }}>
//               <ReactSelect
//                 id="Branch"
//                 name="Branch"
//                 options={branchOptions}
//                 isMulti
//                 onChange={handleBranchChange}
//                 value={displayedOptions}
//                 styles={{
//                   control: (base) => ({ ...base, minHeight: "40px", padding: "6px", width: "100%", flexWrap: "wrap" }),
//                   valueContainer: (base) => ({ ...base, display: "flex", flexWrap: "wrap", alignItems: "flex-start", textAlign: "left" }),
//                   multiValue: (base) => ({ ...base, margin: "2px", textAlign: "left" }),
//                   option: (base) => ({ ...base, textAlign: "left" }),
//                 }}
//               />
//             </div>

//             <div className="ag-theme-quartz" style={{ width: "100%" }}>
//               {isLoading ? (
//                 <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
//                   <CircularProgress />
//                 </div>
//               ) : (
//                 <>
//                   <AgGridReact
//                     rowData={rowData}
//                     getRowHeight={() => 33}
//                     columnDefs={columnDefs}
//                     onCellValueChanged={onCellValueChanged}
//                     rowDragManaged={true}
//                     rowDragMultiRow={true}
//                     domLayout="autoHeight"
//                     pagination={true}
//                     paginationPageSize={10}
//                     onGridReady={onGridReady}
//                     style={{ width: "100%", height: "500px" }}
//                     getRowStyle={(params) => ({
//                       backgroundColor: params.node.rowIndex % 2 === 0 ? "#cde3f2" : "#ffffff",
//                     })}
//                   />
//                   <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
//                     <Button variant="contained" color="primary" onClick={addRow}>Add</Button>
//                     <Button variant="contained" color="primary" style={{ marginLeft: "10px" }} onClick={handleSave} disabled={isSaving}>
//                       {isSaving ? "Saving..." : "Save"}
//                     </Button>
//                   </div>
//                 </>
//               )}
//             </div>
//           </CardContent>
//         </Grid>
//       </Grid>
//     </Grid>
//   );
// }

// ================================
//  ALLOWANCE MASTER (Optimized)
//  NEW LOGIC: "ALL" = INSERT ONLY NEW VALUES
// ================================

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import {
  Button,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
  AppBar,
  Toolbar,
} from "@mui/material";
import ReactSelect from "react-select";
import { ServerConfig } from "../../../../serverconfiguration/serverconfig";
import { postRequest } from "../../../../serverconfiguration/requestcomp";
import { REPORTS, SAVE } from "../../../../serverconfiguration/controllers";
import Sidenav from "../../../Home Page-comapny/Sidenav1";
import Navbar from "../../../Home Page-comapny/Navbar1";
import { toast } from "react-toastify";
import "./Gridstyle.css";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

export default function AllowanceMaster() {
  const databaseName = sessionStorage.getItem("databaseName");
  const loggedInUser = sessionStorage.getItem("user");

  const [company, setCompany] = useState(null);
  const [branches, setBranches] = useState([]);
  const [selectedBranches, setSelectedBranches] = useState(["all"]);
  const [rowData, setRowData] = useState([]);
  const [originalRowData, setOriginalRowData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Escape dangerous SQL characters
  const escapeSQL = (s) => (s ? s.replace(/'/g, "''") : "");

  // Branch ID list
  const allBranchIDs = useMemo(
    () => branches.map((b) => b.pn_BranchID),
    [branches]
  );

  // Branch Name Map
  const branchNameMap = useMemo(() => {
    const m = {};
    branches.forEach((b) => (m[b.pn_BranchID] = b.BranchName));
    return m;
  }, [branches]);

  // Build Column Definitions
  const columnDefs = useMemo(() => {
    const base = { editable: true, flex: 1 };

    if (selectedBranches.includes("all")) {
      return [
        {
          ...base,
          field: "allowance_all",
          headerName: "ALLOWANCE FOR ALL BRANCHES",
        },
      ];
    }
    return selectedBranches.map((b) => ({
      ...base,
      field: `allowance_${b}`,
      headerName: branchNameMap[b] || b,
    }));
  }, [selectedBranches, branchNameMap]);

  // Fetch company + branches once
  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const comp = await postRequest(ServerConfig.url, REPORTS, {
          query: `
          SELECT * FROM [${databaseName}].[dbo].[paym_Company]
          WHERE Company_User_Id = '${loggedInUser}'`,
        });

        const c = comp.data?.[0];
        if (!c) return toast.error("Company not found");

        setCompany(c);

        const br = await postRequest(ServerConfig.url, REPORTS, {
          query: `
          SELECT * FROM [${databaseName}].[dbo].[paym_Branch]
          WHERE pn_CompanyID = ${c.pn_CompanyID}`,
        });

        setBranches(br.data || []);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  // Fetch Allowance Data
  useEffect(() => {
    if (!company) return;
    async function loadAllowance() {
      setIsLoading(true);

      try {
        // ==========================
        // CASE 1 : ALL BRANCHES VIEW
        // ==========================
        if (!selectedBranches.length) {
          setRowData([]);
          setOriginalRowData([]);
          setIsLoading(false);
          return;
        }
        if (selectedBranches.includes("all")) {
          const q = `
            SELECT v_EarningsName, MIN(d_order) mn_order
            FROM [${databaseName}].[dbo].[AllowanceMaster]
            WHERE pn_CompanyID = ${company.pn_CompanyID}
            GROUP BY v_EarningsName
            ORDER BY mn_order`;

          const res = await postRequest(ServerConfig.url, REPORTS, {
            query: q,
          });

          const rows = res.data.map((r) => ({
            allowance_all: r.v_EarningsName,
          }));

          setRowData(rows.length ? rows : [{ allowance_all: "" }]);
          setOriginalRowData(JSON.parse(JSON.stringify(rows)));
          setIsLoading(false);
          return;
        }

        // ==============================
        // CASE 2 : SPECIFIC BRANCH VIEW
        // ==============================
        const ids = selectedBranches.join(",");

        const q2 = `
          SELECT pn_BranchID, v_EarningsName, d_order
          FROM [${databaseName}].[dbo].[AllowanceMaster]
          WHERE pn_CompanyID = ${company.pn_CompanyID}
          AND pn_BranchID IN (${ids})
          ORDER BY pn_BranchID, d_order`;

        const res2 = await postRequest(ServerConfig.url, REPORTS, {
          query: q2,
        });

        const grouped = {};
        let max = 0;

        res2.data.forEach((r) => {
          if (!grouped[r.pn_BranchID]) grouped[r.pn_BranchID] = [];
          grouped[r.pn_BranchID].push(r.v_EarningsName);
          if (grouped[r.pn_BranchID].length > max)
            max = grouped[r.pn_BranchID].length;
        });

        const final = [];
        for (let i = 0; i < max; i++) {
          const row = {};
          selectedBranches.forEach((bid) => {
            row[`allowance_${bid}`] =
              grouped[bid] && grouped[bid][i] ? grouped[bid][i] : "";
          });
          final.push(row);
        }

        setRowData(final.length ? final : [{}]);
        setOriginalRowData(JSON.parse(JSON.stringify(final)));
      } finally {
        setIsLoading(false);
      }
    }

    loadAllowance();
  }, [selectedBranches, company]);

  // On Cell Change
  const onCellValueChanged = useCallback((p) => {
    const all = [];
    p.api.forEachNode((n) => all.push(n.data));
    setRowData(all);
  }, []);

  // Add Row
  const addRow = useCallback(() => {
    const last = rowData[rowData.length - 1];

    if (last) {
      const empty = selectedBranches.includes("all")
        ? !last.allowance_all?.trim()
        : selectedBranches.some((b) => !last[`allowance_${b}`]?.trim());

      if (empty) {
        return toast.warning("Fill current row first!");
      }
    }

    const newRow = selectedBranches.includes("all")
      ? { allowance_all: "" }
      : selectedBranches.reduce(
          (acc, b) => ({ ...acc, [`allowance_${b}`]: "" }),
          {}
        );

    setRowData((p) => [...p, newRow]);
  }, [rowData, selectedBranches]);

  // ================================
  // SAVE LOGIC (UPDATED FOR "ALL")
  // ================================
  const handleSave = async () => {
    if (isSaving || !company) return;
    setIsSaving(true);

    try {
      toast.dismiss();

      // Filter filled rows
      const filledRows = rowData.filter((r) =>
        Object.values(r).some((v) => v && v.toString().trim() !== "")
      );

      if (!filledRows.length) {
        toast.error("No data to save");
        return;
      }

      // ================================
      // CASE 1 – ALL BRANCHES SELECTED
      // (Add ONLY NEW VALUES to ALL branches)
      // ================================
      if (selectedBranches.includes("all")) {
        // STEP 1: Fetch existing values
        const existRes = await postRequest(ServerConfig.url, REPORTS, {
          query: `
            SELECT DISTINCT v_EarningsName
            FROM [${databaseName}].[dbo].[AllowanceMaster]
            WHERE pn_CompanyID = ${company.pn_CompanyID}
          `,
        });

        const existing = existRes.data.map((x) =>
          x.v_EarningsName.toLowerCase().trim()
        );

        // STEP 2: Take ONLY NEW values
        const newValues = filledRows
          .map((r) => r.allowance_all?.trim())
          .filter((name) => name && !existing.includes(name.toLowerCase()));

        if (!newValues.length) {
          toast.info("No NEW values found.");
          return;
        }

        // STEP 3: INSERT new values for ALL branches
        const tuples = [];

        newValues.forEach((txt) => {
          allBranchIDs.forEach((bid) => {
            tuples.push(`
              (${company.pn_CompanyID},
               ${bid},
              '${escapeSQL(txt)}',
               NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0)
            `);
          });
        });

        const insertQuery = `
          INSERT INTO [${databaseName}].[dbo].[AllowanceMaster]
          (pn_CompanyID,pn_BranchID,v_EarningsName,
           c_Regular,c_PF,c_ESI,c_OT,c_LOP,c_PT,payslip,status,d_order)
          VALUES ${tuples.join(",")}
        `;

        await postRequest(ServerConfig.url, SAVE, { query: insertQuery });

        toast.success("New values added to ALL branches!");

        setSelectedBranches((p) => [...p]); // refresh
        return;
      }

      // ================================
      // CASE 2 – SPECIFIC BRANCHES
      // ================================
      const targetBranches = selectedBranches;

      // DELETE existing for selected branches only
      const delQuery = `
        DELETE FROM [${databaseName}].[dbo].[AllowanceMaster]
        WHERE pn_CompanyID = ${company.pn_CompanyID}
        AND pn_BranchID IN (${targetBranches.join(",")})
      `;
      await postRequest(ServerConfig.url, SAVE, { query: delQuery });

      // INSERT fresh values
      const toInsert = [];

      targetBranches.forEach((bid) => {
        filledRows.forEach((row, idx) => {
          const val = row[`allowance_${bid}`]?.trim();
          if (val)
            toInsert.push(`
              (${company.pn_CompanyID},${bid},
              '${escapeSQL(val)}',
              NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,${idx + 1})
            `);
        });
      });

      if (toInsert.length) {
        const insQuery = `
          INSERT INTO [${databaseName}].[dbo].[AllowanceMaster]
          (pn_CompanyID,pn_BranchID,v_EarningsName,
           c_Regular,c_PF,c_ESI,c_OT,c_LOP,c_PT,payslip,status,d_order)
          VALUES ${toInsert.join(",")}
        `;
        await postRequest(ServerConfig.url, SAVE, { query: insQuery });
      }

      toast.success("Saved successfully!");
      setSelectedBranches((p) => [...p]); // refresh
    } catch (err) {
      console.error(err);
      toast.error("Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  // Grid Ready
  const onGridReady = (p) => p.api.sizeColumnsToFit();

  // Render
  return (
    <Grid container style={{ background: "#f5f5f5" }}>
      <Grid item xs={12}>
        <Navbar />
      </Grid>

      <Grid item xs={12} style={{ display: "flex" }}>
        <Sidenav />

        <Grid item xs={12} sm={10} md={8} lg={7} style={{ margin: "0 auto" }}>
          <CardContent>
            <AppBar position="static" sx={{ marginTop: "70px" }}>
              <Toolbar>
                <Typography variant="h5" fontWeight="bold" color="white">
                  ALLOWANCE MASTER
                </Typography>
              </Toolbar>
            </AppBar>

            {/* Branch Selector */}
            <ReactSelect
              isMulti
              options={[
                { value: "all", label: "All Branches" },
                ...branches.map((b) => ({
                  value: b.pn_BranchID,
                  label: b.BranchName,
                })),
              ]}
              value={
                selectedBranches.includes("all")
                  ? [{ value: "all", label: "All Branches" }]
                  : branches
                      .filter((b) => selectedBranches.includes(b.pn_BranchID))
                      .map((b) => ({
                        value: b.pn_BranchID,
                        label: b.BranchName,
                      }))
              }
              onChange={(sel) => {
                if (!sel) return setSelectedBranches([]);

                if (sel.some((x) => x.value === "all")) {
                  setSelectedBranches(["all", ...allBranchIDs]);
                } else {
                  setSelectedBranches(sel.map((x) => x.value));
                }
              }}
              styles={{
                control: (b) => ({ ...b, padding: "8px" }),
              }}
            />

            {/* GRID */}
            <div className="ag-theme-quartz" style={{ width: "100%" }}>
              {isLoading ? (
                <div style={{ textAlign: "center", padding: "50px" }}>
                  <CircularProgress />
                </div>
              ) : (
                <>
                  <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    onCellValueChanged={onCellValueChanged}
                    pagination
                    paginationPageSize={10}
                    domLayout="autoHeight"
                    onGridReady={onGridReady}
                  />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: 20,
                    }}
                  >
                    <Button variant="contained" onClick={addRow}>
                      Add
                    </Button>

                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSave}
                      disabled={isSaving}
                      style={{ marginLeft: 10 }}
                    >
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Grid>
      </Grid>
    </Grid>
  );
}
