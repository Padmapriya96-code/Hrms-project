// import React, { useState } from "react";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import { useNavigate } from "react-router-dom";
// import { useEffect } from "react";
// import { postRequest } from "../../../../serverconfiguration/requestcomp";
// import { ServerConfig } from "../../../../serverconfiguration/serverconfig";
// import { REPORTS, SAVE } from "../../../../serverconfiguration/controllers";
// import {
//   Button,
//   CardContent,
//   FormControlLabel,
//   Grid,
//   Switch,
//   Typography,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import Sidenav from "../../../Home Page-comapny/Sidenav1";
// import Navbar from "../../../Home Page-comapny/Navbar1";
// import { Card } from "react-bootstrap";
// import AppBar from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";
// import { toast } from "react-toastify";

// const Android12Switch = styled(Switch)(({ theme }) => ({
//   padding: 8,
//   "& .MuiSwitch-track": {
//     borderRadius: 22 / 2,
//     "&::before, &::after": {
//       content: '""',
//       position: "absolute",
//       top: "50%",
//       transform: "translateY(-50%)",
//       width: 16,
//       height: 16,
//     },
//     "&::before": {
//       backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
//         theme.palette.getContrastText(theme.palette.primary.main)
//       )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
//       left: 12,
//     },
//     "&::after": {
//       backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
//         theme.palette.getContrastText(theme.palette.primary.main)
//       )}" d="M19,13H5V11H19V13Z" /></svg>')`,
//       right: 12,
//     },
//   },
//   "& .MuiSwitch-thumb": {
//     boxShadow: "none",
//     width: 16,
//     height: 16,
//     margin: 2,
//   },
// }));

// const AllowanceValues = () => {
//   const [Gradeslabdata, setGradeSlabData] = useState([]);
//   const [isloggedin, setisloggedin] = useState(sessionStorage.getItem("user"));
//   const [company, setCompany] = useState([]);
//   const [Branch, setBranch] = useState([]);
//   const [Branchid, setBranchid] = useState("");
//   const [Grade, setGrade] = useState("");
//   const [Allowancedata, setAllowancedata] = useState([]);
//   const [gridData, setGridData] = useState([]);
//   const [percentageType, setPercentageType] = useState(""); // New state for CTC or Basic Pay selection
//   const [originalGridData, setOriginalGridData] = useState([]);
//   const [isOriginalData, setIsOriginalData] = useState(true);
//   const [formattedData, setFormattedData] = useState([]);
//   const [isSaving, setIsSaving] = useState(false);
//   const databaseName = sessionStorage.getItem("databaseName"); // ✅ dynamically set DB name

//   const SwitchRenderer = (props) => {
//     const [checked, setChecked] = useState(
//       props.value === "Yes" || props.value === true
//     );

//     const handleChange = (event) => {
//       const newChecked = event.target.checked;
//       setChecked(newChecked);

//       // Update the cell's value
//       props.setValue(newChecked ? "Yes" : "No");

//       // Update PayMonth only if the field being toggled is "Regular"
//       if (props.colDef.field === "Regular") {
//         if (newChecked) {
//           props.node.setDataValue("PayMonth", "All Months");
//         } else {
//           props.node.setDataValue("PayMonth", ""); // Clear PayMonth when unchecked
//         }
//       }
//     };

//     return (
//       <FormControlLabel
//         control={<Android12Switch />}
//         checked={checked}
//         onChange={handleChange}
//         color="primary"
//         size="small"
//       />
//     );
//   };

//   const [columnDefs, setColumnDefs] = useState([
//     {
//       headerName: "ALLOWANCE",
//       field: "allowance",
//       editable: false,
//       flex: 1,
//       cellStyle: { textAlign: "left" },
//       minWidth: 120,
//     },
//     {
//       headerName: "VALUES",
//       field: "values",
//       editable: true,
//       flex: 1,
//       minWidth: 100,
//       cellStyle: { textAlign: "left" },
//     },
//     {
//       headerName: "REGULAR",
//       field: "Regular",
//       cellRenderer: SwitchRenderer,
//       flex: 1,
//       cellStyle: { textAlign: "left" },
//       minWidth: 120,
//     },
//     {
//       headerName: "INCLUDE FOR PAYSLIP",
//       field: "IncludeforPayslip",
//       cellRenderer: SwitchRenderer,
//       flex: 1,
//       cellStyle: { textAlign: "left" },
//       minWidth: 200,
//       hide: true,
//     },
//     {
//       headerName: "PAY MONTH",
//       field: "PayMonth",
//       editable: true,
//       flex: 1,
//       cellStyle: { textAlign: "left" },
//       minWidth: 150,
//       cellEditor: "agSelectCellEditor",
//       cellEditorParams: {
//         values: [
//           "January",
//           "February",
//           "March",
//           "April",
//           "May",
//           "June",
//           "July",
//           "August",
//           "September",
//           "October",
//           "November",
//           "December",
//         ],
//       },
//       valueGetter: (params) => params.data.PayMonth || "January", // Sets default value to "January" if PayMonth is not defined
//     },
//   ]);

//   useEffect(() => {
//     async function getData() {
//       try {
//         const Company = await postRequest(ServerConfig.url, REPORTS, {
//           query: `SELECT * FROM [${databaseName}].[dbo].[paym_Company]
//         WHERE Company_User_Id = '${isloggedin}'`,
//         });
//         setCompany(Company.data);
//         // console.log(Company.data)
//         if (Company.data && Company.data.length > 0) {
//           const Branchdata = await postRequest(ServerConfig.url, REPORTS, {
//             query: `SELECT * FROM [${databaseName}].[dbo].[paym_Branch]
//         WHERE pn_CompanyID = ${Company.data[0].pn_CompanyID}`,
//           });
//           // setBranch(Branchdata.data);
//           // FIX: Clean invalid object fields in Mallow DB
//           console.log("RAW BRANCH DATA FROM API:", Branchdata.data);

//           const cleanedBranch = Branchdata.data.map((b) => ({
//             ...b,
//             can_manage_department:
//               typeof b.can_manage_department === "object"
//                 ? false
//                 : b.can_manage_department,
//             can_manage_designation:
//               typeof b.can_manage_designation === "object"
//                 ? false
//                 : b.can_manage_designation,
//           }));

//           setBranch(cleanedBranch);

//           const GradeSlabdata = await postRequest(ServerConfig.url, REPORTS, {
//             query: `SELECT * FROM [${databaseName}].[dbo].[GradeSlab_Branch]
//         WHERE pn_companyid = ${Company.data[0].pn_CompanyID} AND pn_branchid = ${Branchid}`,
//           });
//           setGradeSlabData(GradeSlabdata.data);

//           const allowancedata = await postRequest(ServerConfig.url, REPORTS, {
//             query: `SELECT * FROM [${databaseName}].[dbo].[AllowanceMaster]
//         WHERE pn_CompanyID = ${Company.data[0].pn_CompanyID} AND pn_BranchID = ${Branchid}`,
//           });
//           setAllowancedata(allowancedata.data);

//           const sortedData = allowancedata.data.sort(
//             (a, b) => a.d_order - b.d_order
//           );
//           const formattedData = sortedData.map((item) => ({
//             allowance: item.v_EarningsName,
//             values: "",
//             Regular: "Yes", // Set default value for Regular to 'Yes'
//             PayMonth: "All Months", // Default to 'All' when Regular is checked
//             IncludeforPayslip: "Yes",
//           }));

//           setGridData(formattedData);
//         }
//       } catch (error) {
//         console.error("Error Fetching Data", error);
//       }
//     }
//     getData();
//   }, [isloggedin, Branchid]);

//   useEffect(() => {
//     console.log("Company", company);
//     console.log("Gradeslab", Gradeslabdata);
//     console.log("Branch", Branch);
//   }, [company, Gradeslabdata, Branch]);

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.shiftKey && e.key === "O") {
//         setColumnDefs((prevDefs) =>
//           prevDefs.map((col) =>
//             col.field === "IncludeforPayslip"
//               ? { ...col, hide: !col.hide }
//               : col
//           )
//         );
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);

//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, []);

//   useEffect(() => {
//     if (Branchid && Grade) {
//       // Both Branchid and Grade are selected, now fetch the allowance values.
//       fetchAllowanceValues();
//     }
//   }, [Branchid, Grade]);

//   // Determine the dropdown label and options based on the Slab_Type of the first matching item in Gradeslabdata
//   const selectedGradeData = Gradeslabdata.filter(
//     (item) => item.pn_branchid === parseInt(Branchid, 10)
//   );
//   const dropdownLabel = selectedGradeData.some(
//     (item) => item.Slab_Type === "Level"
//   )
//     ? "Choose Level"
//     : "Choose Grade";
//   const dropdownOptions = selectedGradeData.map((item) => ({
//     value: item.Slab_Type === "Level" ? item.Level_Name : item.Grade_Name,
//     label: item.Slab_Type === "Level" ? item.Level_Name : item.Grade_Name,
//   }));

//   const [amountType, setAmountType] = useState("fixed");

//   const onCellValueChanged = (params) => {
//     if (params.colDef.field === "values") {
//       const newValue = params.data.values;
//       const parsedValue = parseFloat(newValue);
//       if (isNaN(parsedValue)) {
//         params.data.values = ""; // Reset invalid input to empty string
//       } else if (amountType === "percentage") {
//         params.data.values = `${parsedValue}%`;
//       } else if (amountType === "fixed") {
//         params.data.values = parsedValue.toFixed(2);
//       }
//     }

//     // Handle other fields
//     if (params.colDef.field === "Regular") {
//       params.data.PayMonth = params.data.Regular === "Yes" ? "All Months" : "";
//     }

//     setGridData([...gridData]);
//   };

//   const handleSave = async () => {
//     try {
//       toast.dismiss();
//       // Step 1: Fetch existing AllowanceValues data for the selected Branch and Grade/Level
//       const selectedGradeData = Gradeslabdata.find(
//         (item) =>
//           item.pn_branchid === parseInt(Branchid, 10) &&
//           (item.Slab_Type === "Level" || item.Slab_Type === "Grade")
//       );
//       const gradeField =
//         selectedGradeData?.Slab_Type === "Level" ? "Level_Name" : "Grade_Name";
//       const gradeValue = Grade;

//       const checkQuery = `SELECT * FROM [${databaseName}].[dbo].[AllowanceValues]
//       WHERE pn_branchid = ${Branchid} AND ${gradeField} = '${gradeValue}'`;

//       // Fetch existing records
//       const response = await postRequest(ServerConfig.url, REPORTS, {
//         query: checkQuery,
//       });
//       const existingData = response.data || [];

//       // Step 2: Separate data for update and insert
//       const updateQueries = [];
//       const insertQueries = [];
//       let hasUpdates = false; // Flag to track if any updates were made
//       let hasExistingValues = false; // Flag to track if existing values are unchanged

//       gridData.forEach((row, index) => {
//         // Check if the row exists in existingData
//         const existingRow = existingData.find(
//           (item) => item.v_EarningsName === row.allowance
//         );

//         if (existingRow) {
//           hasExistingValues = true; // Mark that existing values are found
//           // Check if any value has changed
//           const isChanged =
//             existingRow.value !== parseFloat(row.values) ||
//             existingRow.c_Regular !== (row.Regular === "Yes" ? "Y" : "N") ||
//             existingRow.payslip !==
//               (row.IncludeforPayslip === "Yes" ? "Y" : "N") ||
//             existingRow.PayMonth !== row.PayMonth;

//           if (isChanged) {
//             // Prepare an UPDATE query for existing records
//             const updateQuery = `UPDATE [${databaseName}].[dbo].[AllowanceValues] SET Allowancetype='${amountType}', Cal_Based_on=${
//               amountType === "percentage" ? `'${percentageType}'` : "NULL"
//             }, value=${parseFloat(row.values)}, c_Regular='${
//               row.Regular === "Yes" ? "Y" : "N"
//             }', payslip='${
//               row.IncludeforPayslip === "Yes" ? "Y" : "N"
//             }', PayMonth='${row.PayMonth}', d_order=${
//               index + 1
//             } WHERE pn_branchid=${Branchid} AND ${gradeField}='${gradeValue}' AND v_EarningsName='${
//               row.allowance
//             }'`;
//             updateQueries.push(updateQuery);
//             hasUpdates = true; // Mark that an update will occur
//           }
//         } else {
//           // Prepare an INSERT query for new records
//           const insertQuery = `INSERT INTO [${databaseName}].[dbo].[AllowanceValues] (pn_companyid, pn_branchid, Grade_Name, Level_Name, v_EarningsName, Allowancetype, Cal_Based_on, value, c_Regular, payslip, PayMonth, d_order) VALUES (${
//             company[0].pn_CompanyID
//           }, ${Branchid}, ${
//             gradeField === "Grade_Name" ? `'${gradeValue}'` : "NULL"
//           }, ${gradeField === "Level_Name" ? `'${gradeValue}'` : "NULL"}, '${
//             row.allowance
//           }', '${amountType}', ${
//             amountType === "percentage" ? `'${percentageType}'` : "NULL"
//           }, ${parseFloat(row.values)}, '${
//             row.Regular === "Yes" ? "Y" : "N"
//           }', '${row.IncludeforPayslip === "Yes" ? "Y" : "N"}', '${
//             row.PayMonth
//           }', ${index + 1})`;
//           insertQueries.push(insertQuery);
//         }
//       });

//       // Step 3: Execute update and insert queries
//       const allQueries = [...updateQueries, ...insertQueries].join("\n");
//       await postRequest(ServerConfig.url, SAVE, { query: allQueries });

//       // Step 4: Display alert messages
//       if (hasUpdates) {
//         toast.success("Data updated successfully!", {
//           position: "top-center",
//           autoClose: 1000,
//         });
//       } else if (hasExistingValues) {
//         toast.error("No changes were made. Existing values remain unchanged.", {
//           position: "top-center",
//           autoClose: 1000,
//         });
//       } else if (insertQueries.length > 0) {
//         toast.info("data added successfully!", {
//           position: "top-center",
//           autoClose: 1000,
//         });
//       } else {
//         toast.error("No changes were made.", {
//           position: "top-center",
//           autoClose: 1000,
//         });
//       }

//       // Fetch updated data and update grid display
//       fetchAllowanceValues();
//     } catch (error) {
//       console.error("Error in handleSave:", error);
//       toast.error("Failed to save allowance settings.", {
//         position: "top-center",
//         autoClose: 1000,
//       });
//     }
//   };

//   const fetchAllowanceValues = async () => {
//     try {
//       // Determine grade/level field based on Gradeslabdata
//       const selectedGradeData = Gradeslabdata.find(
//         (item) =>
//           item.pn_branchid === parseInt(Branchid, 10) &&
//           (item.Slab_Type === "Level" || item.Slab_Type === "Grade")
//       );
//       const gradeField =
//         selectedGradeData?.Slab_Type === "Level" ? "Level_Name" : "Grade_Name";
//       const gradeValue = Grade;

//       // Fetch data from AllowanceValues table
//       const allowanceValuesQuery = `
//                 SELECT * FROM [${databaseName}].[dbo].[AllowanceValues] 
//                 WHERE pn_branchid = ${Branchid} 
//                 AND (${gradeField} = '${gradeValue}') order by d_order;
//             `;
//       const allowanceValuesResponse = await postRequest(
//         ServerConfig.url,
//         REPORTS,
//         { query: allowanceValuesQuery }
//       );
//       const allowanceValuesData = allowanceValuesResponse.data || [];

//       // Fetch all allowances from AllowanceMaster for the selected branch
//       const allowanceMasterQuery = `
//                 SELECT * FROM [${databaseName}].[dbo].[AllowanceMaster] 
//                 WHERE pn_CompanyID = ${company[0]?.pn_CompanyID} AND pn_BranchID = ${Branchid} order by d_order;
//             `;
//       const allowanceMasterResponse = await postRequest(
//         ServerConfig.url,
//         REPORTS,
//         { query: allowanceMasterQuery }
//       );
//       const allowanceMasterData = allowanceMasterResponse.data || [];

//       // Identify newly added allowances in AllowanceMaster
//       const existingAllowanceNames = allowanceValuesData.map(
//         (item) => item.v_EarningsName
//       );
//       const newAllowances = allowanceMasterData.filter(
//         (item) => !existingAllowanceNames.includes(item.v_EarningsName)
//       );

//       // Format newly added allowances with default values
//       const newFormattedData = newAllowances.map((item) => ({
//         allowance: item.v_EarningsName,
//         values: "",
//         Regular: "Yes", // Default to "Yes"
//         PayMonth: "All Months", // Default to "All Months"
//         IncludeforPayslip: "Yes", // Default to "Yes"
//       }));

//       // Combine existing and new allowances
//       const combinedData = [
//         ...allowanceValuesData.map((item) => ({
//           allowance: item.v_EarningsName,
//           values: item.value ? parseFloat(item.value).toFixed(2) : "",
//           Regular: item.c_Regular === "Y" ? "Yes" : "No",
//           PayMonth: item.PayMonth || "All Months",
//           IncludeforPayslip: item.payslip === "Y" ? "Yes" : "No",
//         })),
//         ...newFormattedData,
//       ];

//       const formattedData = [
//         ...allowanceValuesData
//           .filter((item) => !(item.c_Regular === "N" && item.payslip === "N"))
//           .map((item) => ({
//             allowance: item.v_EarningsName,
//             values: item.value ? parseFloat(item.value).toFixed(2) : "",
//             Regular: item.c_Regular === "Y" ? "Yes" : "No",
//             PayMonth: item.PayMonth || "All Months",
//             IncludeforPayslip: item.payslip === "Y" ? "Yes" : "No",
//           })),
//         ...newFormattedData,
//       ];

//       const firstItem = allowanceValuesData[0];
//       if (firstItem) {
//         setAmountType(firstItem.Allowancetype || "fixed"); // Default to "fixed" if no type is found
//         setPercentageType(firstItem.Cal_Based_on || "ctc"); // Default to "ctc" if no type is found
//       }

//       // Update the grid and states
//       setOriginalGridData(formattedData);
//       setFormattedData(combinedData);
//       setGridData(formattedData);
//     } catch (error) {
//       console.error("Error fetching AllowanceValues data:", error);
//     }
//   };

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.shiftKey && e.key === "R") {
//         setIsOriginalData((prev) => !prev); // Toggle the state
//         setGridData(isOriginalData ? formattedData : originalGridData);
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);

//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [isOriginalData, formattedData, originalGridData]);

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
//           {" "}
//           {/* Main Content */}
//           <CardContent sx={{ p: 0 }}>
//             <Grid
//               elevation={3}
//               style={{
//                 padding: 2,
//                 width: "100%",
//                 maxWidth: "970px",
//                 margin: "0 auto",
//               }}
//             >
//               <AppBar
//                 position="static"
//                 sx={{ width: "100%", marginTop: "80px", minHeight: "60px" }}
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
//                     ALLOWANCE VALUE
//                   </Typography>
//                 </Toolbar>
//               </AppBar>

//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "center",

//                   border: "1px solid #ccc", // Border for the box

//                   padding: "10px", // Padding inside the box
//                   backgroundColor: "white", // Light background color
//                 }}
//               >
//                 <label style={{ marginRight: "20px" }}>
//                   <input
//                     type="radio"
//                     name="amountType"
//                     value="fixed"
//                     checked={amountType === "fixed"}
//                     onChange={() => setAmountType("fixed")}
//                   />
//                   <span style={{ marginLeft: "8px" }}>Fixed Amount</span>
//                 </label>
//                 <label>
//                   <input
//                     type="radio"
//                     name="amountType"
//                     value="percentage"
//                     checked={amountType === "percentage"}
//                     onChange={() => setAmountType("percentage")}
//                   />
//                   <span style={{ marginLeft: "8px" }}>Percentage</span>
//                 </label>
//               </div>

//               {amountType === "percentage" && (
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "center",

//                     padding: "10px",
//                     border: "1px solid #ddd",

//                     backgroundColor: "white", // Light background color for consistency
//                   }}
//                 >
//                   <label style={{ marginRight: "20px" }}>
//                     <input
//                       type="radio"
//                       name="percentageType"
//                       value="ctc"
//                       checked={percentageType === "ctc"}
//                       onChange={() => setPercentageType("ctc")}
//                     />
//                     <span style={{ marginLeft: "8px" }}>CTC</span>
//                   </label>
//                   <label>
//                     <input
//                       type="radio"
//                       name="percentageType"
//                       value="basicPay"
//                       checked={percentageType === "basicPay"}
//                       onChange={() => setPercentageType("basicPay")}
//                     />
//                     <span style={{ marginLeft: "8px" }}>Basic Pay</span>
//                   </label>
//                 </div>
//               )}

//               {/* Branch and Grade Dropdowns */}
//               <div
//                 style={{
//                   border: "1px solid #ccc", // Border for the box

//                   padding: "15px", // Padding inside the box
//                   backgroundColor: "white", // Light background color
//                   // Space below the box
//                 }}
//               >
//                 <div
//                   style={{ display: "flex", justifyContent: "space-between" }}
//                 >
//                   <div style={{ flex: 1, marginRight: "10px" }}>
//                     <label style={{ display: "block", marginBottom: "5px" }}>
//                       Choose Branch
//                     </label>
//                     <select
//                       style={{ width: "100%", padding: "8px" }}
//                       value={Branchid}
//                       onChange={(e) => setBranchid(e.target.value)}
//                     >
//                       <option value="">Select</option>
//                       {Branch.map((e) => (
//                         <option key={e.pn_BranchID} value={e.pn_BranchID}>
//                           {e.BranchName}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div style={{ flex: 1 }}>
//                     <label style={{ display: "block", marginBottom: "5px" }}>
//                       {dropdownLabel}
//                     </label>
//                     <select
//                       style={{ width: "100%", padding: "8px" }}
//                       value={Grade}
//                       onChange={(e) => setGrade(e.target.value)}
//                     >
//                       <option value="">Select</option>
//                       {dropdownOptions.map((option, index) => (
//                         <option key={index} value={option.value}>
//                           {option.label}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//               </div>
//               {/* ag-Grid Table */}
//               <div style={{ flex: 1, marginBottom: "20px", overflow: "auto" }}>
//                 <div className="ag-theme-alpine" style={{ height: "100%" }}>
//                   <AgGridReact
//                     rowData={gridData}
//                     columnDefs={columnDefs}
//                     domLayout="autoHeight"
//                     getRowHeight={() => 33}
//                     onCellValueChanged={onCellValueChanged}
//                     getRowStyle={(params) => {
//                       // Alternate row colors
//                       return {
//                         backgroundColor:
//                           params.node.rowIndex % 2 === 0
//                             ? "#cde3f2"
//                             : "#ffffff", // Light gray for even rows, white for odd rows
//                       };
//                     }}
//                   />
//                 </div>
//               </div>

//               {/* Save Button */}
//               <div
//                 style={{
//                   textAlign: "right",
//                   marginTop: "auto",
//                   paddingTop: "10px",
//                 }}
//               >
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   onClick={handleSave}
//                   style={{ paddingTop: "10px" }}
//                 >
//                   Save
//                 </Button>
//               </div>
//             </Grid>
//           </CardContent>
//         </Grid>
//       </Grid>
//     </Grid>
//   );
// };

// export default AllowanceValues;























// AllowanceValues.js (final, sanitized, optimized)

import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import {
  Grid,
  Button,
  Typography,
  CardContent,
  FormControlLabel,
  Switch,
} from "@mui/material";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { styled } from "@mui/material/styles";

import Navbar from "../../../Home Page-comapny/Navbar1";
import Sidenav from "../../../Home Page-comapny/Sidenav1";

import { toast } from "react-toastify";

import { postRequest } from "../../../../serverconfiguration/requestcomp";
import { ServerConfig } from "../../../../serverconfiguration/serverconfig";
import { REPORTS, SAVE } from "../../../../serverconfiguration/controllers";

// --------------------- helper ---------------------
/**
 * Convert any value that might be an object/null/undefined into a safe string for rendering.
 * Returns empty string for null/undefined, stringified JSON for objects (useful for debugging).
 */
const safeText = (val) => {
  if (val === undefined || val === null) return "";
  if (
    typeof val === "string" ||
    typeof val === "number" ||
    typeof val === "boolean"
  )
    return String(val);
  try {
    return JSON.stringify(val);
  } catch {
    return "";
  }
};

// ---------------- SWITCH STYLE ------------------------
const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  "& .MuiSwitch-thumb": { width: 16, height: 16, margin: 2, boxShadow: "none" },
}));

// -------------------- component ----------------------
const AllowanceValues = () => {
  const databaseName = sessionStorage.getItem("databaseName");
  const isloggedin = sessionStorage.getItem("user");

  // master data
  const [company, setCompany] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [branchId, setBranchId] = useState("");

  const [gradeSlabData, setGradeSlabData] = useState([]);
  const [grade, setGrade] = useState("");

  const [allowanceMaster, setAllowanceMaster] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [formattedData, setFormattedData] = useState([]);
  const [originalGridData, setOriginalGridData] = useState([]);
  const [useOriginalData, setUseOriginalData] = useState(true);

  const [amountType, setAmountType] = useState("fixed");
  const [percentageType, setPercentageType] = useState("ctc");

  // ---------------- switch renderer ----------------
  const SwitchRenderer = (props) => {
    const [checked, setChecked] = useState(
      props.value === "Yes" || props.value === true
    );

    const handleChange = (e) => {
      const v = e.target.checked;
      setChecked(v);
      props.setValue(v ? "Yes" : "No");
      if (props.colDef.field === "Regular") {
        props.node.setDataValue("PayMonth", v ? "All Months" : "");
      }
    };

    return (
      <FormControlLabel
        control={<Android12Switch checked={checked} onChange={handleChange} />}
      />
    );
  };

  // ---------------- column defs ---------------------
  const columnDefs = [
    {
      headerName: "ALLOWANCE",
      field: "allowance",
      editable: false,
      flex: 1,
      valueFormatter: (p) => safeText(p.value),
    },
    {
      headerName: "VALUES",
      field: "values",
      editable: true,
      flex: 1,
      valueFormatter: (p) => safeText(p.value),
    },
    {
      headerName: "REGULAR",
      field: "Regular",
      cellRenderer: SwitchRenderer,
      flex: 1,
    },
    {
      headerName: "INCLUDE FOR PAYSLIP",
      field: "IncludeforPayslip",
      cellRenderer: SwitchRenderer,
      flex: 1,
      hide: true,
    },
    {
      headerName: "PAY MONTH",
      field: "PayMonth",
      flex: 1,
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
      },
      valueGetter: (p) => safeText(p.data?.PayMonth) || "January",
    },
  ];

  // ------------------ fetches -----------------------
  const loadCompany = async () => {
    try {
      const res = await postRequest(ServerConfig.url, REPORTS, {
        query: `SELECT * FROM [${databaseName}].[dbo].[paym_Company] WHERE Company_User_Id = '${isloggedin}'`,
      });
      if (res?.data?.length) setCompany(res.data);
    } catch (err) {
      console.error("loadCompany:", err);
    }
  };

  const loadBranches = async () => {
    if (!company.length) return;
    try {
      const res = await postRequest(ServerConfig.url, REPORTS, {
        query: `SELECT * FROM [${databaseName}].[dbo].[paym_Branch] WHERE pn_CompanyID = ${company[0].pn_CompanyID}`,
      });

      const raw = Array.isArray(res.data) ? res.data : res.data ? [res.data] : [];
      const cleaned = raw.map((b) => ({
        ...b,
        pn_BranchID: safeText(b.pn_BranchID),
        BranchName: safeText(b.BranchName),
        can_manage_department:
          typeof b.can_manage_department === "boolean"
            ? b.can_manage_department
              ? 1
              : 0
            : Number(b.can_manage_department) || 0,
        can_manage_designation:
          typeof b.can_manage_designation === "boolean"
            ? b.can_manage_designation
              ? 1
              : 0
            : Number(b.can_manage_designation) || 0,
      }));

      console.debug("CLEANED BRANCH LIST:", cleaned);
      setBranchList(cleaned);
    } catch (err) {
      console.error("loadBranches:", err);
    }
  };

  const loadGradeSlab = async () => {
    if (!company.length || !branchId) {
      setGradeSlabData([]);
      return;
    }
    try {
      const res = await postRequest(ServerConfig.url, REPORTS, {
        query: `SELECT * FROM [${databaseName}].[dbo].[GradeSlab_Branch]
                WHERE pn_companyid = ${company[0].pn_CompanyID}
                AND pn_branchid = ${branchId}`,
      });

      const raw = Array.isArray(res.data) ? res.data : res.data ? [res.data] : [];
      const cleaned = raw.map((g) => ({
        ...g,
        pn_GradeSlabID: safeText(g.pn_GradeSlabID),
        pn_branchid: safeText(g.pn_branchid),
        Slab_Type: safeText(g.Slab_Type),
        Grade_Name: safeText(g.Grade_Name),
        Level_Name: safeText(g.Level_Name),
      }));

      console.debug("CLEANED GRADE SLAB:", cleaned);
      setGradeSlabData(cleaned);
    } catch (err) {
      console.error("loadGradeSlab:", err);
    }
  };

  const loadAllowanceMaster = async () => {
    if (!company.length || !branchId) {
      setAllowanceMaster([]);
      setGridData([]);
      return;
    }
    try {
      const res = await postRequest(ServerConfig.url, REPORTS, {
        query: `SELECT * FROM [${databaseName}].[dbo].[AllowanceMaster]
                WHERE pn_CompanyID = ${company[0].pn_CompanyID}
                AND pn_BranchID = ${branchId}
                ORDER BY d_order`,
      });

      const raw = Array.isArray(res.data) ? res.data : res.data ? [res.data] : [];
      const cleaned = raw.map((a) => ({
        ...a,
        v_EarningsName: safeText(a.v_EarningsName),
        d_order: Number(a.d_order) || 0,
      }));

      setAllowanceMaster(cleaned);

      const formatted = cleaned.map((item) => ({
        allowance: safeText(item.v_EarningsName),
        values: "",
        Regular: "Yes",
        PayMonth: "All Months",
        IncludeforPayslip: "Yes",
      }));

      setGridData(formatted);
    } catch (err) {
      console.error("loadAllowanceMaster:", err);
    }
  };

  const loadAllowanceValues = async () => {
    if (!branchId || !grade) {
      setGridData((prev) => prev);
      return;
    }

    try {
      // pick a slab row to determine grade vs level field
      const slab = gradeSlabData.find(
        (g) => g.Slab_Type === "Level" || g.Slab_Type === "Grade"
      );
      if (!slab) return;

      const gradeField = slab.Slab_Type === "Level" ? "Level_Name" : "Grade_Name";

      const res = await postRequest(ServerConfig.url, REPORTS, {
        query: `SELECT * FROM [${databaseName}].[dbo].[AllowanceValues]
                WHERE pn_branchid = ${branchId}
                AND ${gradeField} = '${grade}'
                ORDER BY d_order`,
      });

      const existing = Array.isArray(res.data) ? res.data : res.data ? [res.data] : [];

      const existingFormatted = existing.map((x) => ({
        allowance: safeText(x.v_EarningsName),
        values: x.value ? safeText(parseFloat(x.value).toFixed(2)) : "",
        Regular: x.c_Regular === "Y" ? "Yes" : "No",
        PayMonth: safeText(x.PayMonth || "All Months"),
        IncludeforPayslip: x.payslip === "Y" ? "Yes" : "No",
      }));

      // combine with allowanceMaster new items
      const combined = [
        ...existingFormatted,
        ...allowanceMaster
          .filter((a) => !existing.find((e) => e.v_EarningsName === a.v_EarningsName))
          .map((a) => ({
            allowance: safeText(a.v_EarningsName),
            values: "",
            Regular: "Yes",
            PayMonth: "All Months",
            IncludeforPayslip: "Yes",
          })),
      ];

      setFormattedData(combined);
      setOriginalGridData(combined);
      setGridData(combined);

      if (existing.length) {
        setAmountType(existing[0].Allowancetype || "fixed");
        setPercentageType(existing[0].Cal_Based_on || "ctc");
      }
    } catch (err) {
      console.error("loadAllowanceValues:", err);
    }
  };

  // ------------------ onCellChange -------------------
  const onCellValueChanged = (params) => {
    if (params.colDef.field === "values") {
      const parsed = parseFloat(params.data.values);
      params.data.values =
        isNaN(parsed) || params.data.values === "" ? "" : amountType === "percentage" ? `${parsed}%` : parsed.toFixed(2);
    }
    if (params.colDef.field === "Regular") {
      params.data.PayMonth = params.data.Regular === "Yes" ? "All Months" : "";
    }
    setGridData([...gridData]);
  };

  // -------------------- save -------------------------
  const handleSave = async () => {
    if (!branchId || !grade) {
      toast.error("Please select Branch and Grade/Level before saving.");
      return;
    }

    try {
      toast.dismiss();

      const slab = gradeSlabData.find(
        (g) => g.Slab_Type === "Level" || g.Slab_Type === "Grade"
      );
      if (!slab) {
        toast.error("Grade/Level info missing.");
        return;
      }
      const gradeField = slab.Slab_Type === "Level" ? "Level_Name" : "Grade_Name";

      const checkRes = await postRequest(ServerConfig.url, REPORTS, {
        query: `SELECT * FROM [${databaseName}].[dbo].[AllowanceValues]
                WHERE pn_branchid = ${branchId}
                AND ${gradeField} = '${grade}'`,
      });

      const existing = Array.isArray(checkRes.data) ? checkRes.data : checkRes.data ? [checkRes.data] : [];

      const updates = [];
      const inserts = [];

      gridData.forEach((row, idx) => {
        const match = existing.find((x) => x.v_EarningsName === row.allowance);

        if (match) {
          updates.push(`
            UPDATE [${databaseName}].[dbo].[AllowanceValues]
            SET Allowancetype='${amountType}',
                Cal_Based_on='${percentageType}',
                value=${parseFloat(row.values) || 0},
                c_Regular='${row.Regular === "Yes" ? "Y" : "N"}',
                payslip='${row.IncludeforPayslip === "Yes" ? "Y" : "N"}',
                PayMonth='${row.PayMonth}',
                d_order=${idx + 1}
            WHERE pn_branchid=${branchId}
              AND ${gradeField}='${grade}'
              AND v_EarningsName='${row.allowance}'`);
        } else {
          inserts.push(`
            INSERT INTO [${databaseName}].[dbo].[AllowanceValues] (
              pn_companyid, pn_branchid, Grade_Name, Level_Name,
              v_EarningsName, Allowancetype, Cal_Based_on, value,
              c_Regular, payslip, PayMonth, d_order)
            VALUES (
              ${company[0].pn_CompanyID},
              ${branchId},
              ${gradeField === "Grade_Name" ? `'${grade}'` : "NULL"},
              ${gradeField === "Level_Name" ? `'${grade}'` : "NULL"},
              '${row.allowance}',
              '${amountType}',
              '${percentageType}',
              ${parseFloat(row.values) || 0},
              '${row.Regular === "Yes" ? "Y" : "N"}',
              '${row.IncludeforPayslip === "Yes" ? "Y" : "N"}',
              '${row.PayMonth}',
              ${idx + 1}
            )`);
        }
      });

      const final = [...updates, ...inserts].join("\n");
      if (final.trim()) {
        await postRequest(ServerConfig.url, SAVE, { query: final });
        toast.success("Saved successfully!");
        loadAllowanceValues();
      } else {
        toast.info("No changes detected.");
      }
    } catch (err) {
      console.error("handleSave:", err);
      toast.error("Save failed.");
    }
  };

  // --------------- debug scan for objects ----------------
  const scanForObjects = (arr, name) => {
    if (!Array.isArray(arr)) return;
    arr.forEach((r, i) => {
      Object.keys(r || {}).forEach((k) => {
        const v = r[k];
        if (v && typeof v === "object") {
          console.error(`FOUND OBJECT in ${name}[${i}].${k}:`, v);
        }
      });
    });
  };

  // ---------------- keyboard shortcuts -----------------
  useEffect(() => {
    const handler = (e) => {
      if (e.shiftKey && e.key === "R") {
        setUseOriginalData((prev) => !prev);
        setGridData(useOriginalData ? formattedData : originalGridData);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  // ---------------- lifecycle -------------------------
  useEffect(() => {
    loadCompany();
  }, []); // load once

  useEffect(() => {
    loadBranches();
  }, [company]);

  useEffect(() => {
    loadGradeSlab();
    loadAllowanceMaster();
    // reset grade & grid when branch changes
    setGrade("");
    setGridData([]);
  }, [branchId]);

  useEffect(() => {
    loadAllowanceValues();
  }, [grade]);

  // debug scan - helpful in development
  useEffect(() => {
    scanForObjects(branchList, "branchList");
    scanForObjects(gradeSlabData, "gradeSlabData");
    scanForObjects(gridData, "gridData");
    scanForObjects(formattedData, "formattedData");
  }, [branchList, gradeSlabData, gridData, formattedData]);

  // ---------------- dropdown options -------------------
  const gradeOptions = gradeSlabData.map((g) => ({
    value: g.Slab_Type === "Level" ? g.Level_Name : g.Grade_Name,
    label: g.Slab_Type === "Level" ? g.Level_Name : g.Grade_Name,
  }));
  const gradeLabel = gradeSlabData.some((g) => g.Slab_Type === "Level")
    ? "Choose Level"
    : "Choose Grade";

  // ------------------- render -------------------------
  return (
    <Grid container style={{ backgroundColor: "#f5f5f5" }}>
      <Grid item xs={12}>
        <Navbar />
      </Grid>

      <Grid item xs={12} style={{ display: "flex" }}>
        <Sidenav />
        <Grid item xs={12} sm={10} md={8} lg={7} style={{ margin: "0 auto" }}>
          <CardContent sx={{ p: 0 }}>
            <AppBar position="static" sx={{ mt: "80px" }}>
              <Toolbar>
                <Typography variant="h6" sx={{ color: "white" }}>
                  ALLOWANCE VALUE
                </Typography>
              </Toolbar>
            </AppBar>

            <div style={{ padding: 10, marginTop: 10, background: "white" }}>
              <label>
                <input
                  type="radio"
                  name="amt"
                  checked={amountType === "fixed"}
                  onChange={() => setAmountType("fixed")}
                />{" "}
                Fixed Amount
              </label>

              <label style={{ marginLeft: 20 }}>
                <input
                  type="radio"
                  name="amt"
                  checked={amountType === "percentage"}
                  onChange={() => setAmountType("percentage")}
                />{" "}
                Percentage
              </label>
            </div>

            {amountType === "percentage" && (
              <div style={{ padding: 10, background: "white", marginTop: 5 }}>
                <label>
                  <input
                    type="radio"
                    name="pct"
                    checked={percentageType === "ctc"}
                    onChange={() => setPercentageType("ctc")}
                  />{" "}
                  CTC
                </label>

                <label style={{ marginLeft: 20 }}>
                  <input
                    type="radio"
                    name="pct"
                    checked={percentageType === "basicPay"}
                    onChange={() => setPercentageType("basicPay")}
                  />{" "}
                  Basic Pay
                </label>
              </div>
            )}

            <div style={{ padding: 15, background: "white", marginTop: 10 }}>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <label>Choose Branch</label>
                  <select
                    value={branchId}
                    onChange={(e) => setBranchId(e.target.value)}
                    style={{ width: "100%", padding: 7 }}
                  >
                    <option value="">Select</option>
                    {branchList.map((b) => (
                      <option key={b.pn_BranchID} value={String(b.pn_BranchID)}>
                        {safeText(b.BranchName)}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ flex: 1 }}>
                  <label>{gradeLabel}</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    style={{ width: "100%", padding: 7 }}
                  >
                    <option value="">Select</option>
                    {gradeOptions.map((g, idx) => (
                      <option key={idx} value={safeText(g.value)}>
                        {safeText(g.label)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 15, background: "white" }}>
              <div className="ag-theme-alpine">
                <AgGridReact
                  rowData={gridData}
                  columnDefs={columnDefs}
                  domLayout="autoHeight"
                  onCellValueChanged={onCellValueChanged}
                  getRowHeight={() => 33}
                />
              </div>
            </div>

            <div style={{ textAlign: "right", padding: 10 }}>
              <Button variant="contained" onClick={handleSave}>
                Save
              </Button>
            </div>
          </CardContent>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AllowanceValues;
