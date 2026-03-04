// // import React, { useState, useCallback, useMemo, useEffect } from "react";
// // import { AgGridReact } from "ag-grid-react";
// // import "ag-grid-community/styles/ag-grid.css";
// // import "ag-grid-community/styles/ag-theme-alpine.css"; // Use alpine theme for consistency
// // import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
// // import { ModuleRegistry } from "@ag-grid-community/core";
// // import {
// //   Button,
// //   Grid,
// //   Typography,
// //   Box,
// //   CircularProgress,
// //   AppBar,
// //   Toolbar,
// // } from "@mui/material"; // Import necessary MUI components
// // import ReactSelect from "react-select";
// // import { ServerConfig } from "../../../../serverconfiguration/serverconfig";
// // import { postRequest } from "../../../../serverconfiguration/requestcomp";
// // import { REPORTS, SAVE } from "../../../../serverconfiguration/controllers";
// // import Sidenav from "../../../Home Page-comapny/Sidenav1";
// // import Navbar from "../../../Home Page-comapny/Navbar1";
// // import { toast } from "react-toastify";

// // ModuleRegistry.registerModules([ClientSideRowModelModule]);

// // function DeductionMaster() {
// //   const [selectedBranches, setSelectedBranches] = useState(["all"]);
// //   const [selectedOption, setSelectedOption] = useState("Branch");
// //   const [isloggedin, setisloggedin] = useState(sessionStorage.getItem("user"));
// //   const [Branch, setBranch] = useState([]);
// //   const [savedBranches, setSavedBranches] = useState([]);
// //   const [Company, setCompany] = useState([]);
// //   const allBranchIDs = Branch.map((e) => e.pn_BranchID);
// //   const [isSaving, setIsSaving] = useState(false);
// //   const [isLoading, setIsLoading] = useState(false); // Add loading state
// //   const [rowData, setRowData] = useState([]); // Initialize rowData to an empty array
// //   const databaseName = sessionStorage.getItem("databaseName"); // ✅ get DB name dynamically
// //   const [companyID, setCompanyID] = useState(null);

// //   useEffect(() => {
// //     if (selectedOption === "Branch" && selectedBranches.length > 0) {
// //       async function fetchBranchData() {
// //         setIsLoading(true); // Start loading
// //         try {
// //           const data1 = await postRequest(ServerConfig.url, REPORTS, {
// //             query: `SELECT * FROM [${databaseName}].[dbo].[paym_Company]
// //         WHERE Company_User_Id = '${isloggedin}'`,
// //           });
// //           if (data1.data.length > 0 && data1.data[0].pn_CompanyID) {
// //             const id = data1.data[0].pn_CompanyID;
// //             setCompanyID(id); // ✅ Save to state
// //           }

// //           setCompany(data1.data);
// //           console.log("Company data", data1.data);

// //           if (data1.data.length > 0 && data1.data[0].pn_CompanyID) {
// //             const CompanyID = data1.data[0].pn_CompanyID;

// //             let branchIDs = [];
// //             if (selectedBranches.includes("all")) {
// //               const branchData = await postRequest(ServerConfig.url, REPORTS, {
// //                 query: `SELECT * FROM [${databaseName}].[dbo].[paym_Branch]
// //         WHERE pn_CompanyID = ${CompanyID}`,
// //               });
// //               branchIDs = branchData.data.map((branch) => branch.pn_BranchID);
// //               setBranch(branchData.data);
// //               console.log("Branch data", branchData.data);
// //             } else {
// //               branchIDs = selectedBranches;
// //             }
// //           } else {
// //             console.log("No valid Company data found.");
// //           }
// //         } catch (error) {
// //           console.error("Error fetching data:", error);
// //         } finally {
// //           setIsLoading(false); // End loading
// //         }
// //       }

// //       fetchBranchData();
// //     }
// //   }, [isloggedin, selectedOption, selectedBranches]);

// //   const branchNameMap = useMemo(() => {
// //     return Branch.reduce((map, branch) => {
// //       map[branch.pn_BranchID] = branch.BranchName;
// //       return map;
// //     }, {});
// //   }, [Branch]);

// //   const columnDefs = useMemo(() => {
// //     const baseColumnDef = {
// //       editable: true,
// //       flex: 1,
// //       minWidth: 290,
// //       headerClass: "ag-center-header", // Use ag-center-header for consistent styling
// //       cellStyle: { textAlign: "left", paddingRight: "10px" }, // Align cell text left
// //     };

// //     const columns = [];

// //     if (selectedBranches.includes("all")) {
// //       columns.push({
// //         ...baseColumnDef,
// //         field: "deduction_all",
// //         headerName: "DEDUCTION NAME FOR ALL BRANCHES",
// //       });

// //       columns.push({
// //         ...baseColumnDef,
// //         field: "deduction_type_all",
// //         headerName: "DEDUCTION TYPE FOR ALL BRANCHES",
// //         cellEditor: "agSelectCellEditor",
// //         cellEditorParams: {
// //           values: ["Standard", "Miscellaneous"],
// //         },
// //       });
// //     } else {
// //       selectedBranches.forEach((branchID) => {
// //         columns.push({
// //           ...baseColumnDef,
// //           field: `deduction_${branchID}`,
// //           headerName: `${branchNameMap[branchID] || branchID} Deduction Name`,
// //         });

// //         columns.push({
// //           ...baseColumnDef,
// //           field: `deduction_type_${branchID}`,
// //           headerName: `${branchNameMap[branchID] || branchID} Deduction Type`,
// //           cellEditor: "agSelectCellEditor",
// //           cellEditorParams: {
// //             values: ["Standard", "Miscellaneous"],
// //           },
// //         });
// //       });
// //     }

// //     return columns;
// //   }, [selectedBranches, branchNameMap]);

// //   useEffect(() => {
// //     const fetchDeductionData = async () => {
// //       setIsLoading(true); // Start loading

// //       // Calculate initialEmptyRows here, inside the useEffect
// //       const initialEmptyRows = Array.from({ length: 5 }, () =>
// //         selectedBranches.includes("all")
// //           ? { deduction_all: "", deduction_type_all: "" }
// //           : selectedBranches.reduce((acc, branchID) => {
// //               acc[`deduction_${branchID}`] = "";
// //               acc[`deduction_type_${branchID}`] = "";
// //               return acc;
// //             }, {})
// //       );

// //       setRowData(initialEmptyRows); // Initialize rowData with the calculated initial rows

// //       if (selectedBranches.includes("all")) {
// //         setIsLoading(false); // Stop loading if "All branches" is selected
// //         return;
// //       }

// //       for (let branchID of selectedBranches) {
// //         try {
// //           const response = await postRequest(ServerConfig.url, REPORTS, {
// //             query: `SELECT * FROM [${databaseName}].[dbo].[paym_Branch]
// //         WHERE pn_CompanyID = ${CompanyID}`,
// //           });

// //           const branchData = response.data;
// //           setRowData((prevRowData) => {
// //             // Use functional update
// //             const newData = [...prevRowData];
// //             branchData.forEach((data, index) => {
// //               if (index < newData.length) {
// //                 newData[index][`deduction_${branchID}`] =
// //                   data.v_DeductionName || "";
// //                 newData[index][`deduction_type_${branchID}`] =
// //                   data.v_DeductionType || "";
// //               } else {
// //                 const newRow = {
// //                   [`deduction_${branchID}`]: data.v_DeductionName || "",
// //                   [`deduction_type_${branchID}`]: data.v_DeductionType || "",
// //                 };
// //                 selectedBranches.forEach((id) => {
// //                   if (id !== branchID) {
// //                     newRow[`deduction_${id}`] = "";
// //                     newRow[`deduction_type_${id}`] = "";
// //                   }
// //                 });
// //                 newData.push(newRow);
// //               }
// //             });
// //             return newData;
// //           });
// //         } catch (error) {
// //           console.error("Error fetching deduction data:", error);
// //         }
// //       }

// //       setIsLoading(false); // Stop loading
// //     };

// //     if (Company.length > 0) {
// //       // Ensure Company data is available
// //       fetchDeductionData();
// //     }
// //   }, [selectedBranches, Company]);

// //   const branchOptions = useMemo(() => {
// //     const options = Branch.filter(
// //       (branch) => !savedBranches.includes(branch.pn_BranchID)
// //     ).map((branch) => ({
// //       value: branch.pn_BranchID,
// //       label: branch.BranchName,
// //     }));

// //     if (!options.find((option) => option.value === "all")) {
// //       options.unshift({ value: "all", label: "All branches" });
// //     }

// //     return options;
// //   }, [Branch, savedBranches]);

// //   const handleBranchChange = (selectedOptions) => {
// //     if (selectedOptions.some((option) => option.value === "all")) {
// //       setSelectedBranches(["all", ...allBranchIDs]);
// //     } else {
// //       setSelectedBranches(selectedOptions.map((option) => option.value));
// //     }
// //   };

// //   const displayedOptions = useMemo(() => {
// //     if (selectedBranches.includes("all")) {
// //       return [{ value: "all", label: "All branches" }];
// //     } else {
// //       return branchOptions.filter((opt) =>
// //         selectedBranches.includes(opt.value)
// //       );
// //     }
// //   }, [selectedBranches, branchOptions]);

// //   const addRow = () => {
// //     const currentRow = rowData[rowData.length - 1];
// //     const hasEmptyFields = selectedBranches.includes("all")
// //       ? !currentRow.deduction_all ||
// //         currentRow.deduction_all.toString().trim() === "" ||
// //         !currentRow.deduction_type_all ||
// //         currentRow.deduction_type_all.toString().trim() === ""
// //       : selectedBranches.some(
// //           (branchID) =>
// //             !currentRow[`deduction_${branchID}`] ||
// //             currentRow[`deduction_${branchID}`].toString().trim() === "" ||
// //             !currentRow[`deduction_type_${branchID}`] ||
// //             currentRow[`deduction_type_${branchID}`].toString().trim() === ""
// //         );
// //     if (hasEmptyFields) {
// //       toast.dismiss();
// //       toast.warning(
// //         "Please fill all fields in the current row before adding a new one.",
// //         {
// //           position: "top-center",
// //           autoClose: 1000,
// //         }
// //       );
// //       return;
// //     }
// //     const newRow = selectedBranches.includes("all")
// //       ? { deduction_all: "", deduction_type_all: "" }
// //       : selectedBranches.reduce((acc, branchID) => {
// //           acc[`deduction_${branchID}`] = "";
// //           acc[`deduction_type_${branchID}`] = "";
// //           return acc;
// //         }, {});
// //     setRowData((prevRowData) => [...prevRowData, newRow]);
// //   };

// //   const onCellValueChanged = useCallback((event) => {
// //     console.log("Updated Row:", event.data);

// //     const allRowData = [];
// //     event.api.forEachNode((node) => {
// //       allRowData.push(node.data);
// //     });

// //     console.log("All Row Data:", allRowData);
// //   }, []);

// //   const fetchDeductionData = async () => {
// //     try {
// //       for (let branchID of allBranchIDs) {
// //         const response = await postRequest(ServerConfig.url, REPORTS, {
// //           query: `SELECT * FROM [${databaseName}].[dbo].[DeductionMaster]
// //         WHERE pn_CompanyID = ${Company[0].pn_CompanyID} AND pn_BranchID = ${branchID}`,
// //         });
// //         console.log(`Data for Branch ID ${branchID}:`, response.data);
// //       }
// //     } catch (error) {
// //       console.error("Error fetching deduction data:", error);
// //     }
// //   };

// //   const fetchExistingData = async () => {
// //     const branchIDs = selectedBranches.includes("all")
// //       ? allBranchIDs
// //       : selectedBranches;
// //     const conditions = branchIDs
// //       .map(
// //         (branchID) =>
// //           `(pn_CompanyID = ${Company[0]?.pn_CompanyID} AND pn_BranchID = ${branchID})`
// //       )
// //       .join(" OR ");
// //     const query = `SELECT pn_DeductionID, pn_BranchID, v_DeductionName, v_DeductionType, d_order
// //                FROM [${databaseName}].[dbo].[DeductionMaster]
// //                WHERE ${conditions}`;

// //     try {
// //       const response = await postRequest(ServerConfig.url, REPORTS, { query });
// //       return response.data;
// //     } catch (error) {
// //       console.error("Error fetching existing data:", error);
// //       return [];
// //     }
// //   };

// //   const handlesave = async () => {
// //     if (isSaving) return;
// //     setIsSaving(true);

// //     try {
// //       toast.dismiss();

// //       // Filter out empty rows
// //       const filledRows = rowData.filter((row) =>
// //         Object.values(row).some((val) => val?.toString().trim() !== "")
// //       );

// //       if (filledRows.length === 0) {
// //         toast.error("No filled rows to save.", {
// //           position: "top-center",
// //           autoClose: 1000,
// //         });
// //         return;
// //       }

// //       // Fetch existing data for comparison
// //       const existingRowData = await fetchExistingData();
// //       const branchIDs = selectedBranches.includes("all")
// //         ? allBranchIDs
// //         : selectedBranches;
// //       let hasChanges = false;
// //       const allRowData = [];

// //       // Check for actual changes
// //       for (let branchID of branchIDs) {
// //         const branchRows = filledRows.filter((row) => {
// //           const name = selectedBranches.includes("all")
// //             ? row.deduction_all
// //             : row[`deduction_${branchID}`];
// //           return name?.toString().trim() !== "";
// //         });

// //         for (let [index, row] of branchRows.entries()) {
// //           const deductionName = (
// //             selectedBranches.includes("all")
// //               ? row.deduction_all
// //               : row[`deduction_${branchID}`]
// //           )
// //             ?.toString()
// //             .trim();

// //           const deductionType = (
// //             selectedBranches.includes("all")
// //               ? row.deduction_type_all
// //               : row[`deduction_type_${branchID}`]
// //           )
// //             ?.toString()
// //             .trim();

// //           if (!deductionName || !deductionType) continue;

// //           // Find existing record (if any)
// //           const existingRecord = existingRowData.find(
// //             (existing) =>
// //               existing.pn_BranchID === branchID &&
// //               existing.v_DeductionName === deductionName
// //           );

// //           // Check if this is a new record or has changes
// //           if (
// //             !existingRecord ||
// //             existingRecord.v_DeductionType !== deductionType
// //           ) {
// //             hasChanges = true;
// //           }

// //           allRowData.push({
// //             pn_CompanyID: Company[0]?.pn_CompanyID,
// //             pn_BranchID: branchID,
// //             v_DeductionName: deductionName,
// //             v_DeductionType: deductionType,
// //             c_Regular: null,
// //             status: null,
// //             d_order: index + 1,
// //             pn_DeductionID: existingRecord?.pn_DeductionID,
// //           });
// //         }
// //       }

// //       // If no changes detected
// //       if (!hasChanges) {
// //         toast.info("Please update at least one field before saving.", {
// //           position: "top-center",
// //           autoClose: 1000,
// //         });
// //         return;
// //       }

// //       // Separate inserts and updates
// //       const insertValues = [];
// //       const updateQueries = [];

// //       allRowData.forEach((data) => {
// //         const safeName = data.v_DeductionName.replace(/'/g, "''");
// //         const safeType = data.v_DeductionType.replace(/'/g, "''");

// //         if (data.pn_DeductionID) {
// //           // Only update if the type has changed
// //           const existingRecord = existingRowData.find(
// //             (r) => r.pn_DeductionID === data.pn_DeductionID
// //           );
// //           if (
// //             existingRecord &&
// //             existingRecord.v_DeductionType !== data.v_DeductionType
// //           ) {
// //             updateQueries.push(`
// //             UPDATE [${databaseName}].[dbo].[DeductionMaster]
// //             SET v_DeductionType = '${safeType}',
// //                 d_order = ${data.d_order}
// //             WHERE pn_DeductionID = ${data.pn_DeductionID}
// //           `);
// //           }
// //         } else {
// //           insertValues.push(
// //             `(${data.pn_CompanyID}, ${data.pn_BranchID}, '${safeName}', '${safeType}',
// //           ${data.c_Regular}, ${data.status}, ${data.d_order})`
// //           );
// //         }
// //       });

// //       // Execute updates first
// //       for (const query of updateQueries) {
// //         await postRequest(ServerConfig.url, SAVE, { query });
// //       }

// //       // Then execute inserts
// //       if (insertValues.length > 0) {
// //         const insertQuery = `
// //         INSERT INTO [${databaseName}].[dbo].[DeductionMaster]
// //         ([pn_CompanyID], [pn_BranchID], [v_DeductionName], [v_DeductionType],
// //         [c_Regular], [status], [d_order])
// //         VALUES ${insertValues.join(", ")}
// //       `;
// //         await postRequest(ServerConfig.url, SAVE, { query: insertQuery });
// //       }

// //       // Show success message only if we made changes
// //       if (updateQueries.length > 0 || insertValues.length > 0) {
// //         toast.success("Deduction master saved successfully!", {
// //           position: "top-center",
// //           autoClose: 1000,
// //         });
// //       }

// //       // Refresh the data after save
// //       await fetchDeductionData();
// //     } catch (error) {
// //       console.error("Error during save:", error);
// //       toast.error("An error occurred while saving.", {
// //         position: "top-center",
// //         autoClose: 1000,
// //       });
// //     } finally {
// //       setIsSaving(false);
// //     }
// //   };
// //   const onGridReady = (params) => {
// //     params.api.sizeColumnsToFit();
// //   };
// //   return (
// //     <Grid container style={{ backgroundColor: "#f5f5f5" }}>
// //       <Grid item xs={12}>
// //         <Navbar />
// //       </Grid>
// //       <Grid item xs={12} sx={{ display: "flex" }}>
// //         <Sidenav />
// //         <Grid
// //           item
// //           xs={12}
// //           sm={10}
// //           md={8}
// //           lg={7}
// //           sx={{
// //             padding: { xs: "20px", sm: "40px" },
// //             overflowY: "auto",
// //             margin: "0 auto",
// //           }}
// //         >
// //           <AppBar
// //             position="static"
// //             sx={{ width: "100%", marginTop: "70px", minHeight: "60px" }}
// //           >
// //             <Toolbar sx={{ justifyContent: "left", height: "100%" }}>
// //               <Typography
// //                 variant="h5"
// //                 gutterBottom
// //                 sx={{
// //                   textAlign: "left",
// //                   fontWeight: "bold",
// //                   color: "white",
// //                   lineHeight: "60px",
// //                 }}
// //               >
// //                 DEDUCTION MASTER
// //               </Typography>
// //             </Toolbar>
// //           </AppBar>
// //           <Box sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
// //             {/* Common Container */}
// //             <div
// //               style={{
// //                 width: "100%",
// //                 maxWidth: "970px",
// //                 // Add border and background to the container
// //                 border: "1px solid #ccc",
// //                 borderRadius: "4px",
// //                 overflow: "hidden", // Ensure rounded corners are respected
// //               }}
// //             >
// //               <div style={{ position: "relative" }}>
// //                 {branchOptions.length > 0 && (
// //                   <label
// //                     htmlFor="Branch"
// //                     style={{
// //                       position: "absolute",
// //                       top: "-10px",
// //                       left: "10px",
// //                       backgroundColor: "white",
// //                       padding: "0 4px",
// //                       zIndex: 1,
// //                     }}
// //                   ></label>
// //                 )}

// //                 <ReactSelect
// //                   id="Branch"
// //                   name="Branch"
// //                   options={branchOptions}
// //                   isMulti
// //                   onChange={handleBranchChange}
// //                   value={displayedOptions}
// //                   styles={{
// //                     control: (base, state) => ({
// //                       ...base,
// //                       minHeight: state.hasValue ? "auto" : "40px",
// //                       padding: "10px",
// //                       width: "100%",
// //                       flexWrap: "wrap",
// //                       // Remove border
// //                       border: "none",
// //                       // Remove shadow
// //                       boxShadow: "none",
// //                       //Remove background
// //                       backgroundColor: "white",
// //                     }),
// //                     valueContainer: (base) => ({
// //                       ...base,
// //                       display: "flex",
// //                       flexWrap: "wrap",
// //                       alignItems: "flex-start",
// //                       textAlign: "left",
// //                     }),
// //                     multiValue: (base) => ({
// //                       ...base,
// //                       margin: "2px",
// //                       textAlign: "left",
// //                     }),
// //                     option: (base, state) => ({
// //                       ...base,
// //                       textAlign: "left",
// //                     }),
// //                     menu: (base) => ({
// //                       ...base,
// //                       borderRadius: 0,
// //                       border: "none",
// //                       boxShadow: "none",
// //                     }),
// //                     menuList: (base) => ({
// //                       ...base,
// //                       padding: 0,
// //                     }),
// //                   }}
// //                 />
// //               </div>
// //               <div
// //                 className="ag-theme-alpine"
// //                 style={{
// //                   width: "100%",
// //                   overflowY: "auto",
// //                   // Remove border
// //                   border: "none",
// //                   // Remove shadow
// //                   boxShadow: "none",
// //                   // Remove background
// //                   backgroundColor: "transparent",
// //                 }}
// //               >
// //                 {isLoading ? (
// //                   <Box
// //                     sx={{
// //                       display: "flex",
// //                       justifyContent: "center",
// //                       alignItems: "center",
// //                       width: "100%",
// //                       padding: 0,
// //                       margin: 0,
// //                     }}
// //                   >
// //                     <CircularProgress />
// //                   </Box>
// //                 ) : (
// //                   <AgGridReact
// //                     rowData={rowData}
// //                     columnDefs={columnDefs}
// //                     onCellValueChanged={onCellValueChanged}
// //                     rowDragManaged={true}
// //                     rowDragMultiRow={true}
// //                     domLayout="autoHeight"
// //                     pagination={true}
// //                     getRowHeight={() => 33}
// //                     paginationPageSize={10}
// //                     paginationPageSizeSelector={[5, 10, 25]}
// //                     onGridReady={onGridReady}
// //                     getRowStyle={(params) => ({
// //                       backgroundColor:
// //                         params.node.rowIndex % 2 === 0 ? "#cde3f2" : "#ffffff",
// //                     })}
// //                   />
// //                 )}
// //               </div>
// //             </div>
// //             <Box display="flex" justifyContent="flex-end">
// //               <Button
// //                 variant="contained"
// //                 color="primary"
// //                 onClick={addRow}
// //                 sx={{ mr: 1 }}
// //               >
// //                 Add
// //               </Button>
// //               <Button
// //                 variant="contained"
// //                 color="primary"
// //                 onClick={handlesave}
// //                 disabled={isSaving}
// //               >
// //                 {isSaving ? "Saving..." : "Save"}
// //               </Button>
// //             </Box>
// //           </Box>
// //         </Grid>
// //       </Grid>
// //     </Grid>
// //   );
// // }

// // export default DeductionMaster;

// import React from "react";

// import { useState, useCallback, useMemo, useEffect } from "react";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
// import { ModuleRegistry } from "@ag-grid-community/core";
// import {
//   Button,
//   Grid,
//   Typography,
//   Box,
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
// import { toast } from "react-toastify";

// ModuleRegistry.registerModules([ClientSideRowModelModule]);

// function DeductionMaster() {
//   const [selectedBranches, setSelectedBranches] = useState(["all"]);
//   const [selectedOption, setSelectedOption] = useState("Branch");
//   const [isloggedin] = useState(sessionStorage.getItem("user"));
//   const [Branch, setBranch] = useState([]);
//   const [savedBranches, setSavedBranches] = useState([]);
//   const [Company, setCompany] = useState([]);
//   const [companyID, setCompanyID] = useState(null);
//   const [isSaving, setIsSaving] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [rowData, setRowData] = useState([]);
//   const databaseName = sessionStorage.getItem("databaseName");

//   const allBranchIDs = Branch.map((e) => e.pn_BranchID);

//   // ✅ Fetch Company and Branch Data
//   useEffect(() => {
//     if (selectedOption === "Branch" && selectedBranches.length > 0) {
//       const fetchBranchData = async () => {
//         setIsLoading(true);
//         try {
//           const companyRes = await postRequest(ServerConfig.url, REPORTS, {
//             query: `SELECT * FROM [${databaseName}].[dbo].[paym_Company]
//                     WHERE Company_User_Id = '${isloggedin}'`,
//           });

//           if (companyRes.data.length > 0) {
//             const id = companyRes.data[0].pn_CompanyID;
//             setCompany(companyRes.data);
//             setCompanyID(id);

//             if (selectedBranches.includes("all")) {
//               const branchRes = await postRequest(ServerConfig.url, REPORTS, {
//                 query: `SELECT * FROM [${databaseName}].[dbo].[paym_Branch]
//                         WHERE pn_CompanyID = ${id}`,
//               });
//               setBranch(branchRes.data);
//             }
//           } else {
//             toast.error("No company found for the logged-in user.");
//           }
//         } catch (error) {
//           console.error("Error fetching branch data:", error);
//         } finally {
//           setIsLoading(false);
//         }
//       };
//       fetchBranchData();
//     }
//   }, [isloggedin, selectedOption, selectedBranches, databaseName]);

//   // ✅ Map Branch ID to Branch Name
//   const branchNameMap = useMemo(() => {
//     return Branch.reduce((map, branch) => {
//       map[branch.pn_BranchID] = branch.BranchName;
//       return map;
//     }, {});
//   }, [Branch]);

//   // ✅ Define Grid Columns Dynamically
//   const columnDefs = useMemo(() => {
//     const baseColumnDef = {
//       editable: true,
//       flex: 1,
//       minWidth: 290,
//       headerClass: "ag-center-header",
//       cellStyle: { textAlign: "left", paddingRight: "10px" },
//     };

//     const columns = [];

//     if (selectedBranches.includes("all")) {
//       columns.push(
//         {
//           ...baseColumnDef,
//           field: "deduction_all",
//           headerName: "DEDUCTION NAME FOR ALL BRANCHES",
//         },
//         {
//           ...baseColumnDef,
//           field: "deduction_type_all",
//           headerName: "DEDUCTION TYPE FOR ALL BRANCHES",
//           cellEditor: "agSelectCellEditor",
//           cellEditorParams: { values: ["Standard", "Miscellaneous"] },
//         }
//       );
//     } else {
//       selectedBranches.forEach((branchID) => {
//         columns.push(
//           {
//             ...baseColumnDef,
//             field: `deduction_${branchID}`,
//             headerName: `${branchNameMap[branchID] || branchID} Deduction Name`,
//           },
//           {
//             ...baseColumnDef,
//             field: `deduction_type_${branchID}`,
//             headerName: `${branchNameMap[branchID] || branchID} Deduction Type`,
//             cellEditor: "agSelectCellEditor",
//             cellEditorParams: { values: ["Standard", "Miscellaneous"] },
//           }
//         );
//       });
//     }
//     return columns;
//   }, [selectedBranches, branchNameMap]);

//   // ✅ Initialize Empty Grid Rows
//   useEffect(() => {
//     const initializeRows = () => {
//       const emptyRows = Array.from({ length: 5 }, () =>
//         selectedBranches.includes("all")
//           ? { deduction_all: "", deduction_type_all: "" }
//           : selectedBranches.reduce((acc, branchID) => {
//               acc[`deduction_${branchID}`] = "";
//               acc[`deduction_type_${branchID}`] = "";
//               return acc;
//             }, {})
//       );
//       setRowData(emptyRows);
//     };
//     initializeRows();
//   }, [selectedBranches]);

//   // ✅ Branch Options for Select
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

//   // ✅ Handle Multi-select Change
//   const handleBranchChange = (selectedOptions) => {
//     if (selectedOptions.some((option) => option.value === "all")) {
//       setSelectedBranches(["all", ...allBranchIDs]);
//     } else {
//       setSelectedBranches(selectedOptions.map((option) => option.value));
//     }
//   };

//   const displayedOptions = useMemo(() => {
//     if (selectedBranches.includes("all")) {
//       return [{ value: "all", label: "All branches" }];
//     } else {
//       return branchOptions.filter((opt) =>
//         selectedBranches.includes(opt.value)
//       );
//     }
//   }, [selectedBranches, branchOptions]);

//   // ✅ Add New Row
//   const addRow = () => {
//     const currentRow = rowData[rowData.length - 1];
//     const hasEmptyFields = selectedBranches.includes("all")
//       ? !currentRow.deduction_all ||
//         !currentRow.deduction_type_all?.trim()
//       : selectedBranches.some(
//           (branchID) =>
//             !currentRow[`deduction_${branchID}`]?.trim() ||
//             !currentRow[`deduction_type_${branchID}`]?.trim()
//         );

//     if (hasEmptyFields) {
//       toast.warning("Please fill all fields before adding a new row.");
//       return;
//     }

//     const newRow = selectedBranches.includes("all")
//       ? { deduction_all: "", deduction_type_all: "" }
//       : selectedBranches.reduce((acc, branchID) => {
//           acc[`deduction_${branchID}`] = "";
//           acc[`deduction_type_${branchID}`] = "";
//           return acc;
//         }, {});
//     setRowData((prev) => [...prev, newRow]);
//   };

//   // ✅ Fetch Existing Data
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

//     const query = `SELECT pn_DeductionID, pn_BranchID, v_DeductionName, v_DeductionType, d_order
//                    FROM [${databaseName}].[dbo].[DeductionMaster]
//                    WHERE ${conditions}`;

//     try {
//       const res = await postRequest(ServerConfig.url, REPORTS, { query });
//       return res.data;
//     } catch (err) {
//       console.error("Error fetching existing data:", err);
//       return [];
//     }
//   };

//   // ✅ Save Records
//   const handleSave = async () => {
//     if (isSaving) return;
//     setIsSaving(true);
//     try {
//       const filledRows = rowData.filter((row) =>
//         Object.values(row).some((val) => val?.trim() !== "")
//       );

//       if (filledRows.length === 0) {
//         toast.error("No filled rows to save.");
//         return;
//       }

//       const existingData = await fetchExistingData();
//       const branchIDs = selectedBranches.includes("all")
//         ? allBranchIDs
//         : selectedBranches;
//       const insertValues = [];
//       const updateQueries = [];

//       for (let branchID of branchIDs) {
//         for (let [index, row] of filledRows.entries()) {
//           const name = selectedBranches.includes("all")
//             ? row.deduction_all
//             : row[`deduction_${branchID}`];
//           const type = selectedBranches.includes("all")
//             ? row.deduction_type_all
//             : row[`deduction_type_${branchID}`];
//           if (!name || !type) continue;

//           const safeName = name.replace(/'/g, "''");
//           const safeType = type.replace(/'/g, "''");

//           const existing = existingData.find(
//             (r) => r.pn_BranchID === branchID && r.v_DeductionName === name
//           );

//           if (existing) {
//             if (existing.v_DeductionType !== type) {
//               updateQueries.push(`
//                 UPDATE [${databaseName}].[dbo].[DeductionMaster]
//                 SET v_DeductionType = '${safeType}', d_order = ${index + 1}
//                 WHERE pn_DeductionID = ${existing.pn_DeductionID}
//               `);
//             }
//           } else {
//             insertValues.push(
//               `(${Company[0]?.pn_CompanyID}, ${branchID}, '${safeName}', '${safeType}', NULL, NULL, ${
//                 index + 1
//               })`
//             );
//           }
//         }
//       }

//       for (const query of updateQueries) {
//         await postRequest(ServerConfig.url, SAVE, { query });
//       }

//       if (insertValues.length > 0) {
//         const insertQuery = `
//           INSERT INTO [${databaseName}].[dbo].[DeductionMaster]
//           ([pn_CompanyID], [pn_BranchID], [v_DeductionName], [v_DeductionType], [c_Regular], [status], [d_order])
//           VALUES ${insertValues.join(", ")}
//         `;
//         await postRequest(ServerConfig.url, SAVE, { query: insertQuery });
//       }

//       toast.success("Deduction Master saved successfully!");
//     } catch (error) {
//       console.error("Error saving data:", error);
//       toast.error("An error occurred while saving.");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   // ✅ Grid Initialization
//   const onGridReady = (params) => params.api.sizeColumnsToFit();

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
//           <AppBar
//             position="static"
//             sx={{ width: "100%", marginTop: "70px", minHeight: "60px" }}
//           >
//             <Toolbar>
//               <Typography
//                 variant="h5"
//                 sx={{ fontWeight: "bold", color: "white" }}
//               >
//                 DEDUCTION MASTER
//               </Typography>
//             </Toolbar>
//           </AppBar>

//           {/* ✅ Branch Selector */}
//           <Box sx={{ mt: 3 }}>
//             <ReactSelect
//               id="Branch"
//               name="Branch"
//               options={branchOptions}
//               isMulti
//               onChange={handleBranchChange}
//               value={displayedOptions}
//             />
//           </Box>

//           {/* ✅ AG Grid Table */}
//           <Box
//             className="ag-theme-alpine"
//             sx={{
//               mt: 3,
//               borderRadius: 2,
//               boxShadow: 2,
//               overflow: "hidden",
//               backgroundColor: "white",
//             }}
//           >
//             {isLoading ? (
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   height: 200,
//                 }}
//               >
//                 <CircularProgress />
//               </Box>
//             ) : (
//               <AgGridReact
//                 rowData={rowData}
//                 columnDefs={columnDefs}
//                 onCellValueChanged={onGridReady}
//                 pagination
//                 paginationPageSize={10}
//                 domLayout="autoHeight"
//               />
//             )}
//           </Box>

//           {/* ✅ Action Buttons */}
//           <Box display="flex" justifyContent="flex-end" mt={3}>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={addRow}
//               sx={{ mr: 1 }}
//             >
//               Add
//             </Button>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={handleSave}
//               disabled={isSaving}
//             >
//               {isSaving ? "Saving..." : "Save"}
//             </Button>
//           </Box>
//         </Grid>
//       </Grid>
//     </Grid>
//   );
// }

// export default DeductionMaster;

// // new ui design but need to work by tarun

// // import React, { useState, useCallback, useMemo, useEffect } from 'react';
// // import { AgGridReact } from 'ag-grid-react';
// // import 'ag-grid-community/styles/ag-grid.css';
// // import 'ag-grid-community/styles/ag-theme-alpine.css';
// // import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
// // import { ModuleRegistry } from "@ag-grid-community/core";
// // import { Button, Grid, Typography, Box, CircularProgress, AppBar, Toolbar, IconButton } from '@mui/material';
// // import ReactSelect from 'react-select';
// // import { ServerConfig } from '../../../../serverconfiguration/serverconfig';
// // import { postRequest } from '../../../../serverconfiguration/requestcomp';
// // import { REPORTS, SAVE } from '../../../../serverconfiguration/controllers';
// // import Sidenav from "../../../Home Page-comapny/Sidenav1";
// // import Navbar from "../../../Home Page-comapny/Navbar1";
// // import { toast } from 'react-toastify';
// // import DeleteIcon from '@mui/icons-material/Delete';
// // import EditIcon from '@mui/icons-material/Edit';

// // ModuleRegistry.registerModules([ClientSideRowModelModule]);

// // function DeductionMaster() {
// //   const [selectedBranches, setSelectedBranches] = useState(["all"]);
// //   const [isloggedin, setisloggedin] = useState(sessionStorage.getItem("user"));
// //   const [Branch, setBranch] = useState([]);
// //   const [Company, setCompany] = useState([]);
// //   const [isSaving, setIsSaving] = useState(false);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [rowData, setRowData] = useState([]);

// //   useEffect(() => {
// //     async function fetchCompanyBranch() {
// //       try {
// //         const data1 = await postRequest(ServerConfig.url, REPORTS, {
// //           query: `select * from paym_Company where Company_User_Id = '${isloggedin}'`,
// //         });
// //         setCompany(data1.data);

// //         if (data1.data.length > 0) {
// //           const CompanyID = data1.data[0].pn_CompanyID;
// //           const branchData = await postRequest(ServerConfig.url, REPORTS, {
// //             query: `select * from paym_branch where pn_CompanyID = ${CompanyID}`,
// //           });
// //           setBranch(branchData.data);

// //           // fetch deductions from DB
// //           await fetchDeductionData(CompanyID, branchData.data.map(b => b.pn_BranchID));
// //         }
// //       } catch (error) {
// //         console.error("Error fetching company/branch:", error);
// //       }
// //     }
// //     fetchCompanyBranch();
// //   }, [isloggedin]);

// //   const fetchDeductionData = async (CompanyID, branchIDs) => {
// //     setIsLoading(true);
// //     try {
// //       const query = `SELECT pn_DeductionID, pn_BranchID, v_DeductionName, v_DeductionType, d_order
// //                      FROM [dbo].[DeductionMaster] WHERE pn_CompanyID = ${CompanyID}`;
// //       const response = await postRequest(ServerConfig.url, REPORTS, { query });

// //       const mappedData = response.data.map(d => ({
// //         id: d.pn_DeductionID,
// //         branch: d.pn_BranchID,
// //         name: d.v_DeductionName,
// //         type: d.v_DeductionType,
// //         order: d.d_order
// //       }));

// //       setRowData(mappedData);
// //     } catch (err) {
// //       console.error("Error fetching deductions:", err);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const handleEdit = (row) => {
// //     toast.info(`Editing Deduction: ${row.name}`, { autoClose: 1000 });
// //     // You can open a dialog here for inline editing
// //   };

// //   const handleDelete = async (row) => {
// //     if (!window.confirm(`Delete Deduction "${row.name}" ?`)) return;
// //     try {
// //       await postRequest(ServerConfig.url, SAVE, {
// //         query: `DELETE FROM [dbo].[DeductionMaster] WHERE pn_DeductionID = ${row.id}`
// //       });
// //       setRowData(prev => prev.filter(r => r.id !== row.id));
// //       toast.success("Deleted successfully!", { autoClose: 1000 });
// //     } catch (error) {
// //       console.error("Delete failed:", error);
// //       toast.error("Error deleting record.");
// //     }
// //   };

// //   const columnDefs = useMemo(() => [
// //     { headerName: "Deduction Name", field: "name", editable: true, flex: 1 },
// //     { headerName: "Deduction Type", field: "type", editable: true, flex: 1,
// //       cellEditor: 'agSelectCellEditor',
// //       cellEditorParams: { values: ['Standard', 'Miscellaneous'] }
// //     },
// //     { headerName: "Branch ID", field: "branch", flex: 1 },
// //     {
// //       headerName: "Actions",
// //       field: "actions",
// //       cellRendererFramework: (params) => (
// //         <Box>
// //           <IconButton onClick={() => handleEdit(params.data)}><EditIcon color="primary" /></IconButton>
// //           <IconButton onClick={() => handleDelete(params.data)}><DeleteIcon color="error" /></IconButton>
// //         </Box>
// //       ),
// //       flex: 1,
// //     }
// //   ], []);

// //   const addRow = () => {
// //     const newRow = {
// //       id: Date.now(),
// //       branch: selectedBranches.includes("all") ? "all" : selectedBranches[0],
// //       name: "",
// //       type: "Standard",
// //       order: rowData.length + 1
// //     };
// //     setRowData(prev => [...prev, newRow]);
// //   };

// //   const handleSave = async () => {
// //     if (isSaving) return;
// //     setIsSaving(true);

// //     try {
// //       const insertValues = rowData.map(r =>
// //         `(${Company[0].pn_CompanyID}, ${r.branch}, '${r.name}', '${r.type}', NULL, NULL, ${r.order})`
// //       );

// //       const query = `
// //         INSERT INTO [dbo].[DeductionMaster]
// //         ([pn_CompanyID], [pn_BranchID], [v_DeductionName], [v_DeductionType], c_Regular, status, d_order)
// //         VALUES ${insertValues.join(", ")}
// //       `;

// //       await postRequest(ServerConfig.url, SAVE, { query });
// //       toast.success("Saved successfully!", { autoClose: 1000 });
// //     } catch (error) {
// //       console.error("Save failed:", error);
// //       toast.error("Error saving data.");
// //     } finally {
// //       setIsSaving(false);
// //     }
// //   };

// //   return (
// //     <Grid container style={{ backgroundColor: '#f5f5f5' }}>
// //       <Grid item xs={12}><Navbar /></Grid>
// //       <Grid item xs={12} sx={{ display: "flex" }}>
// //         <Sidenav />
// //         <Grid item xs={12} sm={10} md={8} lg={7} sx={{ padding: "40px", margin: '0 auto' }}>
// //           <AppBar position="static" sx={{ marginTop: "70px" }}>
// //             <Toolbar><Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>DEDUCTION MASTER</Typography></Toolbar>
// //           </AppBar>

// //           <Box sx={{ mt: 3 }}>
// //             <div className="ag-theme-alpine" style={{ width: '100%', height: 400 }}>
// //               {isLoading ? <CircularProgress /> :
// //                 <AgGridReact
// //                   rowData={rowData}
// //                   columnDefs={columnDefs}
// //                   domLayout="autoHeight"
// //                   pagination
// //                   paginationPageSize={5}
// //                   getRowStyle={params => ({
// //                     backgroundColor: params.node.rowIndex % 2 === 0 ? '#cde3f2' : '#ffffff'
// //                   })}
// //                 />}
// //             </div>

// //             <Box display="flex" justifyContent="flex-end" mt={2}>
// //               <Button variant="contained" onClick={addRow} sx={{ mr: 1 }}>Add</Button>
// //               <Button variant="contained" onClick={handleSave} disabled={isSaving}>
// //                 {isSaving ? "Saving..." : "Save"}
// //               </Button>
// //             </Box>
// //           </Box>
// //         </Grid>
// //       </Grid>
// //     </Grid>
// //   );
// // }

// // export default DeductionMaster;

// DeductionMaster.js
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import {
  Button,
  Grid,
  Box,
  CircularProgress,
  AppBar,
  Toolbar,
  Typography,
} from "@mui/material";
import ReactSelect from "react-select";
import { ServerConfig } from "../../../../serverconfiguration/serverconfig";
import { postRequest } from "../../../../serverconfiguration/requestcomp";
import { REPORTS, SAVE } from "../../../../serverconfiguration/controllers";
import Sidenav from "../../../Home Page-comapny/Sidenav1";
import Navbar from "../../../Home Page-comapny/Navbar1";
import { toast } from "react-toastify";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

export default function DeductionMaster() {
  const databaseName = sessionStorage.getItem("databaseName");
  const loggedInUser = sessionStorage.getItem("user");

  const [company, setCompany] = useState(null);
  const [branches, setBranches] = useState([]);
  const [selectedBranches, setSelectedBranches] = useState(["all"]);
  const [rowData, setRowData] = useState([]);
  const [originalRowData, setOriginalRowData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // ---------- Helpers ----------
  const escapeSQL = (s) => (s ? s.replace(/'/g, "''") : "");
  const allBranchIDs = useMemo(
    () => branches.map((b) => b.pn_BranchID),
    [branches]
  );

  const branchNameMap = useMemo(() => {
    const m = {};
    branches.forEach((b) => (m[b.pn_BranchID] = b.BranchName));
    return m;
  }, [branches]);

  // Column definitions - dynamic: includes _type columns with select editor
  const columnDefs = useMemo(() => {
    const base = { editable: true, flex: 1, minWidth: 220 };
    const typeSelect = {
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: ["Standard", "Miscellaneous"] },
    };

    // ---- ALL BRANCHES ----
    if (selectedBranches.includes("all")) {
      return [
        { ...base, field: "deduction_all", headerName: "DEDUCTION NAME (ALL)" },
        {
          ...base,
          field: "deduction_type_all",
          headerName: "DEDUCTION TYPE (ALL)",
          ...typeSelect,
        },
      ];
    }

    // ---- SPECIFIC BRANCHES ----
    return [
      { ...base, field: "deduction_name", headerName: "DEDUCTION NAME" },
      {
        ...base,
        field: "deduction_type",
        headerName: "DEDUCTION TYPE",
        ...typeSelect,
      },
    ];
  }, [selectedBranches]);

  // ---------- Load company and branches once ----------
  useEffect(() => {
    async function loadCompanyAndBranches() {
      setIsLoading(true);
      try {
        const compRes = await postRequest(ServerConfig.url, REPORTS, {
          query: `SELECT * FROM [${databaseName}].[dbo].[paym_Company] WHERE Company_User_Id = '${loggedInUser}'`,
        });

        const comp = compRes?.data?.[0];
        if (!comp) {
          toast.error("Company not found for current user.");
          setCompany(null);
          setBranches([]);
          return;
        }
        setCompany(comp);

        const brRes = await postRequest(ServerConfig.url, REPORTS, {
          query: `SELECT * FROM [${databaseName}].[dbo].[paym_Branch] WHERE pn_CompanyID = ${comp.pn_CompanyID}`,
        });

        setBranches(brRes?.data || []);
      } catch (err) {
        console.error("Error loading company/branches:", err);
        toast.error("Failed to load company/branches.");
      } finally {
        setIsLoading(false);
      }
    }
    loadCompanyAndBranches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Fetch Deduction Data for grid ----------
  useEffect(() => {
    if (!company) return;

    async function loadDeductions() {
      setIsLoading(true);
      try {
        // Case: All selected -> show distinct deduction names + prefer earliest order
        if (selectedBranches.includes("all")) {
          const q = `
            SELECT v_DeductionName,
       MIN(v_DeductionType) AS v_DeductionType,
       MIN(d_order) AS mn_order
            FROM [${databaseName}].[dbo].[DeductionMaster]
            WHERE pn_CompanyID = ${company.pn_CompanyID}
            GROUP BY v_DeductionName
            ORDER BY mn_order`;

          const res = await postRequest(ServerConfig.url, REPORTS, {
            query: q,
          });
          const rows = (res.data || []).map((r) => ({
            deduction_all: r.v_DeductionName || "",
            deduction_type_all: r.v_DeductionType || "Standard", // type not deterministic across branches; allow user to select
          }));

          setRowData(
            rows.length ? rows : [{ deduction_all: "", deduction_type_all: "" }]
          );
          setOriginalRowData(JSON.parse(JSON.stringify(rows)));
          return;
        }

        // Specific branches: fetch by branches and align rows by d_order per branch
        const ids = selectedBranches.join(",");
        const q2 = `
          SELECT pn_BranchID, v_DeductionName, v_DeductionType, d_order
          FROM [${databaseName}].[dbo].[DeductionMaster]
          WHERE pn_CompanyID = ${company.pn_CompanyID}
            AND pn_BranchID IN (${ids})
          ORDER BY pn_BranchID, d_order`;

        const res2 = await postRequest(ServerConfig.url, REPORTS, {
          query: q2,
        });
        const grouped = {};
        let max = 0;
        (res2.data || []).forEach((r) => {
          if (!grouped[r.pn_BranchID]) grouped[r.pn_BranchID] = [];
          grouped[r.pn_BranchID].push({
            name: r.v_DeductionName || "",
            type: r.v_DeductionType || "",
          });
          if (grouped[r.pn_BranchID].length > max)
            max = grouped[r.pn_BranchID].length;
        });

        const final = [];
        for (let i = 0; i < max; i++) {
          const row = {};

          selectedBranches.forEach((bid) => {
            row["deduction_name"] =
              grouped[bid] && grouped[bid][i] ? grouped[bid][i].name : "";

            row["deduction_type"] =
              grouped[bid] && grouped[bid][i] ? grouped[bid][i].type : "";
          });

          final.push(row);
        }

        setRowData(
          final.length
            ? final
            : [
                selectedBranches.reduce(
                  (acc, b) => ({
                    ...acc,
                    [`deduction_${b}`]: "",
                    [`deduction_type_${b}`]: "",
                  }),
                  {}
                ),
              ]
        );
        setOriginalRowData(JSON.parse(JSON.stringify(final)));
      } catch (err) {
        console.error("Error loading deductions:", err);
        toast.error("Failed to load deduction data.");
      } finally {
        setIsLoading(false);
      }
    }

    loadDeductions();
  }, [selectedBranches, company, databaseName]);

  // ---------- Grid handlers ----------
  const onCellValueChanged = useCallback((params) => {
    const all = [];
    params.api.forEachNode((n) => all.push(n.data));
    setRowData(all);
  }, []);

  const addRow = useCallback(() => {
    const last = rowData[rowData.length - 1];
    if (last) {
      const empty = selectedBranches.includes("all")
        ? !last.deduction_all?.toString().trim() ||
          !last.deduction_type_all?.toString().trim()
        : selectedBranches.some(
            (b) =>
              !last[`deduction_${b}`]?.toString().trim() ||
              !last[`deduction_type_${b}`]?.toString().trim()
          );

      if (empty) {
        toast.warning("Please fill the current row before adding a new one.");
        return;
      }
    }

    const newRow = selectedBranches.includes("all")
      ? { deduction_all: "", deduction_type_all: "Standard" }
      : selectedBranches.reduce(
          (acc, b) => ({
            ...acc,
            [`deduction_${b}`]: "",
            [`deduction_type_${b}`]: "Standard",
          }),
          {}
        );
    setRowData((p) => [...p, newRow]);
  }, [rowData, selectedBranches]);

  // ---------- Save logic ----------
  const handleSave = async () => {
    if (isSaving || !company) return;
    setIsSaving(true);
    try {
      toast.dismiss();

      // Collect filled rows only
      const filledRows = rowData.filter((r) =>
        Object.values(r).some((v) => v && v.toString().trim() !== "")
      );

      if (!filledRows.length) {
        toast.error("No data to save.");
        return;
      }

      // CASE: ALL branches selected -> insert only new (name + type) for all branches
      if (selectedBranches.includes("all")) {
        // fetch existing name+type pairs (we'll compare by lowercase name + type)
        const existQ = `
          SELECT v_DeductionName, v_DeductionType
          FROM [${databaseName}].[dbo].[DeductionMaster]
          WHERE pn_CompanyID = ${company.pn_CompanyID}`;
        const existRes = await postRequest(ServerConfig.url, REPORTS, {
          query: existQ,
        });
        const existingSet = new Set(
          (existRes.data || []).map(
            (x) =>
              `${(x.v_DeductionName || "").toLowerCase().trim()}||${(
                x.v_DeductionType || ""
              )
                .toLowerCase()
                .trim()}`
          )
        );

        // build new entries (unique combinations)
        const newItems = [];
        const seen = new Set();
        for (const r of filledRows) {
          const name = (r.deduction_all || "").toString().trim();
          const type =
            (r.deduction_type_all || "").toString().trim() || "Standard";
          if (!name) continue;
          const key = `${name.toLowerCase()}||${type.toLowerCase()}`;
          if (existingSet.has(key) || seen.has(key)) continue;
          seen.add(key);
          newItems.push({ name, type });
        }

        if (!newItems.length) {
          toast.info("No NEW deduction entries to add for ALL branches.");
          return;
        }

        // insert each new item for every branch
        const tuples = [];
        newItems.forEach((it) => {
          allBranchIDs.forEach((bid) => {
            tuples.push(
              `(${company.pn_CompanyID}, ${bid}, '${escapeSQL(
                it.name
              )}', '${escapeSQL(it.type)}', NULL, NULL, 0)`
            );
          });
        });

        const insertQ = `
          INSERT INTO [${databaseName}].[dbo].[DeductionMaster]
            (pn_CompanyID, pn_BranchID, v_DeductionName, v_DeductionType, c_Regular, status, d_order)
          VALUES ${tuples.join(",")}
        `;

        await postRequest(ServerConfig.url, SAVE, { query: insertQ });
        toast.success("New deductions added to ALL branches.");
        // refresh view
        setSelectedBranches((p) => [...p]);
        return;
      }

      // CASE: Specific branches selected -> delete existing for those branches and insert fresh rows
      const targetBranches = selectedBranches;
      if (!targetBranches.length) {
        toast.error("No branches selected.");
        return;
      }

      // delete existing for these branches
      const delQ = `
        DELETE FROM [${databaseName}].[dbo].[DeductionMaster]
        WHERE pn_CompanyID = ${company.pn_CompanyID}
          AND pn_BranchID IN (${targetBranches.join(",")})
      `;
      await postRequest(ServerConfig.url, SAVE, { query: delQ });

      // build insert tuples per branch using row order
      const toInsert = [];
      targetBranches.forEach((bid) => {
        filledRows.forEach((row, idx) => {
          const name = (row[`deduction_${bid}`] || "").toString().trim();
          const type =
            (row[`deduction_type_${bid}`] || "").toString().trim() ||
            "Standard";
          if (!name) return;
          toInsert.push(
            `(${company.pn_CompanyID}, ${bid}, '${escapeSQL(
              name
            )}', '${escapeSQL(type)}', NULL, NULL, ${idx + 1})`
          );
        });
      });

      if (toInsert.length) {
        const insQ = `
          INSERT INTO [${databaseName}].[dbo].[DeductionMaster]
            (pn_CompanyID, pn_BranchID, v_DeductionName, v_DeductionType, c_Regular, status, d_order)
          VALUES ${toInsert.join(",")}
        `;
        await postRequest(ServerConfig.url, SAVE, { query: insQ });
      }

      toast.success("Deduction master saved successfully.");
      // refresh view
      setSelectedBranches((p) => [...p]);
    } catch (err) {
      console.error("Save failed:", err);
      toast.error("Error saving deduction master.");
    } finally {
      setIsSaving(false);
    }
  };

  const onGridReady = useCallback((p) => p.api.sizeColumnsToFit(), []);

  // ---------- Render ----------
  return (
    <Grid container style={{ backgroundColor: "#f5f5f5" }}>
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
          sx={{ margin: "0 auto", padding: { xs: 2, sm: 4 } }}
        >
          <AppBar position="static" sx={{ marginTop: "70px" }}>
            <Toolbar>
              <Typography variant="h5" color="white" fontWeight="bold">
                DEDUCTION MASTER
              </Typography>
            </Toolbar>
          </AppBar>

          <Box sx={{ mt: 3 }}>
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
              styles={{ control: (s) => ({ ...s, padding: 8 }) }}
            />
          </Box>

          <Box className="ag-theme-alpine" sx={{ mt: 3, width: "100%" }}>
            {isLoading ? (
              <Box sx={{ textAlign: "center", py: 6 }}>
                <CircularProgress />
              </Box>
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
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                >
                  <Button variant="contained" onClick={addRow} sx={{ mr: 1 }}>
                    Add
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
}
