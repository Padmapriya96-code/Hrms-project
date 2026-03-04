// import * as React from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import { styled } from "@mui/material/styles";
// import Button from "@mui/material/Button";
// import TextField from "@mui/material/TextField";
// import Select from "@mui/material/Select";
// import MenuItem from "@mui/material/MenuItem";
// import { IconButton, Typography } from "@mui/material";
// import { postRequest, getRequest } from "../../serverconfiguration/requestcomp";
// import { ServerConfig } from "../../serverconfiguration/serverconfig";
// import { useEffect, useState, useCallback } from "react";
// import {
//   PAYMCATEGORY,
//   SAVE,
//   REPORTS,
// } from "../../serverconfiguration/controllers";
// import { Grid, Box } from "@mui/material";
// import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
// import { useRef } from "react";
// import ReactSelect from "react-select";
// import Radio from "@mui/material/Radio";
// import RadioGroup from "@mui/material/RadioGroup";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import FormControl from "@mui/material/FormControl";
// import FormLabel from "@mui/material/FormLabel";
// import Switch from "@mui/material/Switch";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import AppBar from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";

// import Sidenav from "../Home Page-comapny/Sidenav1";
// import Navbar from "../Home Page-comapny/Navbar1";

// // Styled DataGrid component
// const StyledDataGrid = styled(DataGrid)({
//   "& .MuiDataGrid-columnHeader": {
//     backgroundColor: "#D3D3D3",
//     color: "#000000",
//   },
//   "& .MuiDataGrid-cell:focus": {
//     outline: "none", // Remove the default focus outline
//   },
//   "& .MuiDataGrid-columnHeader:focus": {
//     outline: "none", // Remove the default focus outline for column headers
//   },
//   "& .MuiDataGrid-cell": {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     outline: "none",
//     "&:focus": {
//       outline: "none",
//     },
//   },
//   "& .MuiDataGrid-cell:focus-within": {
//     outline: "none",
//   },
//   "& .MuiTablePagination-selectLabel": {
//     fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
//     fontWeight: 400,
//     fontSize: "0.875rem",
//     lineHeight: 1.43,
//     letterSpacing: "0.01071em",
//     flexShrink: 0,
//   },
//   "& p": {
//     marginTop: 0,
//     marginBottom: "0rem",
//   },
// });

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

// // Initial rows
// const initialRows = [
//   { id: 1, Grade: "", ExperienceFrom: "", ExperienceTo: "", CTC: "" },
// ];

// // Main PtGrid component
// export default function Grade_Slab() {
//   const [rows, setRows] = React.useState(initialRows);
//   const [paginationModel, setPaginationModel] = React.useState({
//     pageSize: 5,
//     page: 0,
//   });
//   const [isEditable, setIsEditable] = React.useState(true);
//   const [Division, setDivision] = useState([]);
//   const [v_DivisionName, setv_DivisionName] = useState("");
//   const [retrievedRows, setRetrievedRows] = useState([]);
//   const [showFirstGrid, setShowFirstGrid] = useState(true);
//   const [Company, setCompany] = useState([]);
//   const [Branch, setBranch] = useState([]);
//   const [isloggedin, setisloggedin] = useState(sessionStorage.getItem("user"));
//   const [Grade, setGrade] = useState([]);
//   const [selectedDivisions, setSelectedDivisions] = useState([]);
//   const [pn_BranchID, setpn_BranchID] = useState([]);
//   const [selectedOption, setSelectedOption] = useState("Branch");
//   const [Level, setLevel] = useState([]);
//   const [isLevelSelected, setIsLevelSelected] = useState(false);
//   const [savedDivisions, setSavedDivisions] = useState([]);
//   const allBranchIDs = Branch.map((e) => e.pn_BranchID);
//   const [selectedBranches, setSelectedBranches] = useState([
//     "all",
//     ...allBranchIDs,
//   ]);
//   const [savedBranches, setSavedBranches] = useState([]);
//   const databaseName = sessionStorage.getItem("databaseName"); // ✅ Dynamic DB name

//   const notify = () => toast("Wow so easy !");

//   const handleSwitchChange = (event) => {
//     setIsLevelSelected(event.target.checked);
//   };

//   const handleGradeChange = (id, value) => {
//     setRows((prevRows) =>
//       prevRows.map((row) => (row.id === id ? { ...row, Grade: value } : row))
//     );
//   };

//   useEffect(() => {
//     if (selectedOption === "Branch" && selectedBranches.length > 0) {
//       async function fetchBranchData() {
//         try {
//           const data1 = await postRequest(ServerConfig.url, REPORTS, {
//             query: `SELECT * FROM [${databaseName}].[dbo].[paym_Company] WHERE Company_User_Id = '${isloggedin}'`,

//           });

//           setCompany(data1.data);
//           console.log("Company data", data1.data);

//           if (data1.data.length > 0 && data1.data[0].pn_CompanyID) {
//             const CompanyID = data1.data[0].pn_CompanyID;

//             let branchIDs = [];
//             if (selectedBranches.includes("all")) {
//               const branchData = await postRequest(ServerConfig.url, REPORTS, {
//                 query: `SELECT * FROM [${databaseName}].[dbo].[paym_Branch] WHERE pn_CompanyID = ${CompanyID}`,
//               });
//               branchIDs = branchData.data.map((branch) => branch.pn_BranchID);
//               setBranch(branchData.data);
//               console.log("Branch data", branchData.data);
//             } else {
//               branchIDs = selectedBranches;
//             }

//             let allGrades = [];
//             for (const branchID of branchIDs) {
//               const gradeData = await postRequest(ServerConfig.url, REPORTS, {
//                 query: `SELECT * FROM [${databaseName}].[dbo].[paym_Grade] WHERE pn_CompanyID = ${CompanyID} AND BranchID = ${branchID}`,

//               });
//               allGrades.push(...gradeData.data);
//             }

//             const uniqueGrades = allGrades.filter(
//               (grade, index, self) =>
//                 index ===
//                 self.findIndex((g) => g.v_GradeName === grade.v_GradeName)
//             );

//             setGrade(uniqueGrades);
//             console.log("Unique Grade data", uniqueGrades);

//             let allLevels = [];
//             for (const branchID of branchIDs) {
//               const levelData = await postRequest(ServerConfig.url, REPORTS, {
//                 query: `SELECT * FROM [${databaseName}].[dbo].[paym_Level] WHERE pn_CompanyID = ${CompanyID} AND BranchID = ${branchID}`,

//               });
//               allLevels.push(...levelData.data);
//             }

//             const uniqueLevels = allLevels.filter(
//               (level, index, self) =>
//                 index ===
//                 self.findIndex((l) => l.v_LevelName === level.v_LevelName)
//             );

//             setLevel(uniqueLevels);
//             console.log("Unique Level data", uniqueLevels);
//           } else {
//             console.log("No valid Company data found.");
//           }
//         } catch (error) {
//           console.error("Error fetching data:", error);
//         }
//       }

//       fetchBranchData();
//     }
//   }, [isloggedin, selectedOption, selectedBranches]);

//   const fetchSavedData = async () => {
//     try {
//       toast.dismiss();
//       const data1 = await postRequest(ServerConfig.url, REPORTS, {
//         query: `SELECT * FROM [${databaseName}].[dbo].[paym_Company] WHERE Company_User_Id = '${isloggedin}'`,

//       });

//       if (data1.data.length > 0) {
//         const CompanyID = data1.data[0].pn_CompanyID;

//         let query = "";
//         if (selectedOption === "Branch") {
//           query = `SELECT * FROM [${databaseName}].[dbo].[GradeSlab_Branch] WHERE pn_companyid=${CompanyID}`;

//         } else if (selectedOption === "Division") {
//           query = `SELECT * FROM [${databaseName}].[dbo].[GradeSlab_Division] WHERE pn_companyid=${CompanyID}`;

//         }

//         const response = await postRequest(ServerConfig.url, REPORTS, {
//           query,
//         });

//         if (response.data.length > 0) {
//           // Map data to match DataGrid rows
//           const formattedRows = response.data.map((row, index) => ({
//             id: index + 1,
//             Grade: row.Grade_Name || row.Level_Name || "",
//             ExperienceFrom: row.Experience_From,
//             ExperienceTo: row.Experience_To,
//             CTC: row.CTC,
//             BranchID: row.pn_branchid,
//             DivisionID: row.pn_Divisionid || null,
//           }));

//           setRetrievedRows(formattedRows);
//           setShowFirstGrid(false); // Hide input grid, show DB grid
//           toast.success("Data retrieved successfully!", {
//             position: "top-center",
//             autoClose: 1000,
//           });
//         } else {
//           setRetrievedRows([]);
//           toast.info("No saved records found!", {
//             position: "top-center",
//             autoClose: 1000,
//           });
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching saved data:", error);
//       toast.error("Failed to fetch saved data", {
//         position: "top-center",
//         autoClose: 1000,
//       });
//     }
//   };

//   useEffect(() => {
//     if (selectedOption === "Division" && pn_BranchID.length > 0) {
//       async function fetchDivisionData() {
//         try {
//           const data1 = await postRequest(ServerConfig.url, REPORTS, {
//             query: `SELECT * FROM [${databaseName}].[dbo].[paym_Company] where Company_User_Id = '${isloggedin}'`,
//           });

//           setCompany(data1.data);
//           console.log("Company data", data1.data);

//           if (data1.data.length > 0 && data1.data[0].pn_CompanyID) {
//             const CompanyID = data1.data[0].pn_CompanyID;

//             const divisionData = await postRequest(ServerConfig.url, REPORTS, {
//               query: `SELECT * FROM [${databaseName}].[dbo].[paym_Division] where pn_CompanyID = ${CompanyID}`,
//             });

//             setDivision(divisionData.data);
//             console.log("Division data", divisionData.data);

//             const gradeData = await postRequest(ServerConfig.url, REPORTS, {
//               query: `SELECT * FROM [${databaseName}].[dbo].[paym_Grade] where pn_CompanyID = ${CompanyID} and BranchID = ${pn_BranchID}`,
//             });

//             setGrade(gradeData.data);
//             console.log("Unique Grade data", gradeData.data);

//             const levelData = await postRequest(ServerConfig.url, REPORTS, {
//               query: `SELECT * FROM [${databaseName}].[dbo].[paym_Level] where pn_CompanyID = ${CompanyID} and BranchID = ${pn_BranchID}`,
//             });

//             setLevel(levelData.data);
//             console.log("Unique Level data", levelData.data);
//           } else {
//             console.log("No valid Company data found.");
//           }
//         } catch (error) {
//           console.error("Error fetching data:", error);
//         }
//       }

//       fetchDivisionData();
//     }
//   }, [isloggedin, selectedOption, pn_BranchID]);

//   const handleRadioChange = (event) => {
//     setSelectedOption(event.target.value);
//   };

//   const branchOptions = Branch.filter(
//     (branch) => !savedBranches.includes(branch.pn_BranchID)
//   ) // Filter saved branches
//     .map((branch) => ({
//       value: branch.pn_BranchID,
//       label: branch.BranchName,
//     }));

//   if (branchOptions.length > 0) {
//     branchOptions.unshift({ value: "all", label: "All branches" });
//   }

//   const DivisionOptions = Division.filter(
//     (e) =>
//       e.BranchID == pn_BranchID && !savedDivisions.includes(e.pn_DivisionID)
//   ).map((e) => ({
//     value: e.pn_DivisionID,
//     label: e.v_DivisionName,
//   }));
//   const handleBranchChange = (selectedOptions) => {
//     if (selectedOptions.some((option) => option.value === "all")) {
//       setSelectedBranches(["all", ...allBranchIDs]);
//     } else {
//       setSelectedBranches(selectedOptions.map((option) => option.value));
//     }
//   };

//   const handleDivisionChange = (selectedOptions) => {
//     setSelectedDivisions(selectedOptions.map((option) => option.value));
//   };

//   // Custom cell renderer for the UpperLimit column
//   function debounce(func, wait) {
//     let timeout;
//     return (...args) => {
//       clearTimeout(timeout);
//       timeout = setTimeout(() => {
//         func.apply(this, args);
//       }, wait);
//     };
//   }

//   const CustomCellYear = React.forwardRef((params, ref) => {
//     const [textValue, setTextValue] = useState(params.value || "");
//     const [dropdownValue, setDropdownValue] = useState("");
//     const inputRef = useRef(null);
//     const cursorPositionRef = useRef(null); // Store cursor position

//     // Debounced update function to avoid frequent updates
//     const debounceUpdateCell = useCallback(
//       debounce((params, value) => {
//         params.api.setEditCellValue({
//           id: params.id,
//           field: params.field,
//           value,
//         });
//         handleProcessRowUpdate({ ...params.row, [params.field]: value });
//       }, 1500), // Adjust the debounce time as needed
//       []
//     );

//     // Function to handle text changes
//     const handleTextChange = useCallback(
//       (event) => {
//         if (isEditable) {
//           const input = event.target;
//           const newValue = input.value;
//           const cursorPosition = input.selectionStart; // Capture the cursor position

//           // Add .00 logic if applicable
//           let updatedValue = newValue;
//           if (!isNaN(newValue) && newValue.indexOf(".") === -1) {
//             updatedValue = `${newValue}`;
//           }

//           // Update the text value without losing the cursor position
//           setTextValue(updatedValue);
//           cursorPositionRef.current = cursorPosition; // Store the cursor position

//           // Restore cursor position after re-render
//           setTimeout(() => {
//             if (inputRef.current) {
//               inputRef.current.setSelectionRange(
//                 cursorPositionRef.current,
//                 cursorPositionRef.current
//               );
//             }
//           }, 0);

//           // Use debounce to reduce unnecessary updates
//           debounceUpdateCell(params, updatedValue);
//         }
//       },
//       [isEditable, params, inputRef]
//     );

//     // Function to handle dropdown changes
//     const handleDropdownChange = (event) => {
//       if (isEditable) {
//         const selectedValue = event.target.value;
//         const newValue = selectedValue === "Upwards" ? "Upwards" : "";
//         setDropdownValue(newValue);

//         // Update the cell value in the grid and handle row update
//         params.api.setEditCellValue({
//           id: params.id,
//           field: params.field,
//           value: newValue,
//         });
//         handleProcessRowUpdate({ ...params.row, [params.field]: newValue });
//       }
//     };

//     return (
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           width: "100%",
//         }}
//       >
//         <TextField
//           value={textValue}
//           onChange={handleTextChange}
//           variant="outlined"
//           size="small"
//           style={{ flex: 1, marginRight: 8 }}
//           inputRef={inputRef} // Attach the ref to the input for cursor control
//           disabled={!isEditable}
//           onFocus={(e) => e.stopPropagation()} // Prevent losing focus when clicking inside the input
//         />
//         <Select
//           value={dropdownValue}
//           onChange={handleDropdownChange}
//           size="small"
//           style={{ width: 30, height: 30 }}
//           disabled={!isEditable}
//         >
//           <MenuItem value="Upwards">Upwards</MenuItem>
//         </Select>
//       </div>
//     );
//   });

//   const AnnualBasisCell = React.forwardRef((params, ref) => {
//     const [textValue, setTextValue] = React.useState(params.value || "");
//     const inputRef = React.useRef(null); // Ref to manage input focus

//     // Debounce function to handle updates without too many renders
//     const debounceUpdateCell = React.useCallback(
//       debounce((params, value) => {
//         params.api.setEditCellValue({
//           id: params.id,
//           field: params.field,
//           value,
//         });
//         // Update the rows state with the debounced value
//         setRows((prevRows) =>
//           prevRows.map((row) =>
//             row.id === params.id ? { ...row, [params.field]: value } : row
//           )
//         );
//       }, 1500),
//       []
//     );

//     // Handle text changes
//     const handleTextChange = (event) => {
//       if (isEditable) {
//         // Check if the grid is editable
//         const input = event.target;
//         let newValue = input.value;
//         const cursorPosition = input.selectionStart; // Save the cursor position

//         // Add .00 logic if applicable
//         if (!isNaN(newValue) && newValue.indexOf(".") === -1) {
//           newValue = `${newValue}.00`;
//         }

//         setTextValue(newValue); // Update the text field value

//         // Use debounce to delay cell update
//         debounceUpdateCell(params, newValue);

//         // Restore cursor position after state update
//         setTimeout(() => {
//           if (inputRef.current) {
//             inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
//           }
//         }, 0);
//       }
//     };

//     React.useEffect(() => {
//       // Only set focus when manually triggered, not automatically
//       if (inputRef.current && document.activeElement === inputRef.current) {
//         inputRef.current.focus(); // Ensure input is focused
//         inputRef.current.setSelectionRange(
//           inputRef.current.selectionStart,
//           inputRef.current.selectionEnd
//         );
//       }
//     }, [textValue]);

//     return (
//       <TextField
//         value={textValue}
//         onChange={handleTextChange}
//         variant="outlined"
//         size="small"
//         style={{ width: "100%" }}
//         inputRef={inputRef} // Attach the ref to the TextField
//         disabled={!isEditable}
//         onFocus={(e) => e.stopPropagation()} // Prevent losing focus by stopping event bubbling
//       />
//     );
//   });

//   // Utility function to debounce updates
//   function debounce(func, wait) {
//     let timeout;
//     return (...args) => {
//       clearTimeout(timeout);
//       timeout = setTimeout(() => {
//         func.apply(this, args);
//       }, wait);
//     };
//   }

//   const AnnualBasisCellYear = React.forwardRef((params, ref) => {
//     const [textValue, setTextValue] = React.useState(params.value || "");
//     const inputRef = React.useRef(null); // Ref to manage input focus

//     // Debounce function to handle updates without too many renders
//     const debounceUpdateCell = React.useCallback(
//       debounce((params, value) => {
//         params.api.setEditCellValue({
//           id: params.id,
//           field: params.field,
//           value,
//         });
//         // Update the rows state with the debounced value
//         setRows((prevRows) =>
//           prevRows.map((row) =>
//             row.id === params.id ? { ...row, [params.field]: value } : row
//           )
//         );
//       }, 1500),
//       []
//     );

//     // Handle text changes
//     const handleTextChange = (event) => {
//       if (isEditable) {
//         // Check if the grid is editable
//         const input = event.target;
//         let newValue = input.value;
//         const cursorPosition = input.selectionStart; // Save the cursor position

//         // Add .00 logic if applicable
//         if (!isNaN(newValue) && newValue.indexOf(".") === -1) {
//           newValue = `${newValue}`;
//         }

//         setTextValue(newValue); // Update the text field value

//         // Use debounce to delay cell update
//         debounceUpdateCell(params, newValue);

//         // Restore cursor position after state update
//         setTimeout(() => {
//           if (inputRef.current) {
//             inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
//           }
//         }, 0);
//       }
//     };

//     React.useEffect(() => {
//       // Only set focus when manually triggered, not automatically
//       if (inputRef.current && document.activeElement === inputRef.current) {
//         inputRef.current.focus(); // Ensure input is focused
//         inputRef.current.setSelectionRange(
//           inputRef.current.selectionStart,
//           inputRef.current.selectionEnd
//         );
//       }
//     }, [textValue]);

//     return (
//       <TextField
//         value={textValue}
//         onChange={handleTextChange}
//         variant="outlined"
//         size="small"
//         style={{ width: "100%" }}
//         inputRef={inputRef} // Attach the ref to the TextField
//         disabled={!isEditable}
//         onFocus={(e) => e.stopPropagation()} // Prevent losing focus by stopping event bubbling
//       />
//     );
//   });

//   // Utility function to debounce updates
//   function debounce(func, wait) {
//     let timeout;
//     return (...args) => {
//       clearTimeout(timeout);
//       timeout = setTimeout(() => {
//         func.apply(this, args);
//       }, wait);
//     };
//   }

//   const handleProcessRowUpdate = React.useCallback(
//     (newRow) => {
//       // Ensure only the row being updated is changed
//       const updatedRows = rows.map((row) => {
//         if (row.id === newRow.id) {
//           return { ...row, ...newRow }; // Update the entire row object
//         }
//         return row;
//       });

//       setRows(updatedRows); // Update the state with the modified row
//       return newRow;
//     },
//     [rows]
//   );

//   const handleAddRow = () => {
//     const lastRow = rows[rows.length - 1]; // Get the last row
//     // Check if the last row has all required fields filled
//     if (
//       lastRow &&
//       (!lastRow.Grade ||
//         !lastRow.ExperienceFrom ||
//         !lastRow.ExperienceTo ||
//         !lastRow.CTC) // Check for required fields
//     ) {
//       toast.dismiss();
//       toast.warning(
//         "Please fill all fields in the current row before adding a new one.",
//         {
//           position: "top-center",
//           autoClose: 1000,
//         }
//       );
//       return; // Exit the function if validation fails
//     }
//     addRow(); // Call the original addRow function to add a new row
//   };
//   const addRow = () => {
//     // Create a new row using the `initialRows` structure or default values
//     const newRow = {
//       id: rows.length + 1,
//       Grade: "", // Keep blank for new rows if needed
//       ExperienceFrom: "",
//       ExperienceTo: "",
//       CTC: "",
//       CTCTo: "",
//     };
//     // Add the new row to the rows array without modifying the previous rows
//     setRows((prevRows) => [...prevRows, newRow]);
//   };

//   const handleDelete = (id) => {
//     setRows((prevRows) => {
//       const updatedRows = prevRows.filter((row) => row.id !== id);
//       console.log("Rows after deletion:", updatedRows);
//       return updatedRows;
//     });
//   };

//   const handleSave = async () => {
//     try {
//       toast.dismiss();
//       if (selectedOption === "Branch") {
//         const branchesToInsert = selectedBranches.includes("all")
//           ? allBranchIDs
//           : selectedBranches;

//         await Promise.all(
//           branchesToInsert.map(async (branchID) => {
//             await Promise.all(
//               rows.map(async (row) => {
//                 const slabType = isLevelSelected ? "Level" : "Grade";
//                 const gradeName = isLevelSelected ? "NULL" : `'${row.Grade}'`;
//                 const levelName = isLevelSelected ? `'${row.Grade}'` : "NULL";

//                 const query = `
//               INSERT INTO [${databaseName}].[dbo].[GradeSlab_Branch]
//               ([pn_companyid], [pn_branchid], [Slab_Type], [Grade_Name], [Level_Name], [Experience_From], [Experience_To], [CTC])
//               VALUES (
//                 ${Company[0].pn_CompanyID}, ${branchID}, '${slabType}', ${gradeName}, ${levelName}, ${row.ExperienceFrom}, '${row.ExperienceTo}', ${row.CTC}
//               )`;

//                 console.log("Query:", query);

//                 const response = await postRequest(ServerConfig.url, SAVE, {
//                   query,
//                 });

//                 // Check if the response code is 200
//                 if (response.status === 200) {
//                   // Optionally, you could log or handle the response data
//                 } else {
//                   throw new Error(
//                     `Failed to save branch with ID ${selectedBranches}: ${response.statusText}`
//                   );
//                 }
//               })
//             );

//             // Update the saved branches list
//             setSavedBranches((prevSaved) => [...prevSaved, branchID]);
//           })
//         );

//         toast.success(`Data saved for Selected Branch  successfully!`, {
//           position: "top-center",
//           autoClose: 1000,
//         });
//       } else if (selectedOption === "Division") {
//         await Promise.all(
//           selectedDivisions.map(async (divisionID) => {
//             await Promise.all(
//               rows.map(async (row) => {
//                 const slabType = isLevelSelected ? "Level" : "Grade";
//                 const gradeName = isLevelSelected ? "NULL" : `'${row.Grade}'`;
//                 const levelName = isLevelSelected ? `'${row.Grade}'` : "NULL";

//                 const query = `
//               INSERT INTO [${databaseName}].[dbo].[GradeSlab_Division]

//               ([pn_companyid], [pn_branchid], [pn_Divisionid], [Slab_Type], [Grade_Name], [Level_Name], [Experience_From], [Experience_To], [CTC])
//               VALUES (
//                 ${Company[0].pn_CompanyID}, ${pn_BranchID}, ${divisionID}, '${slabType}', ${gradeName}, ${levelName}, ${row.ExperienceFrom}, '${row.ExperienceTo}', ${row.CTC}
//               )`;

//                 console.log("Query:", query);

//                 const response = await postRequest(ServerConfig.url, SAVE, {
//                   query,
//                 });

//                 // Check if the response code is 200
//                 if (response.status === 200) {
//                   // Optionally, you could log or handle the response data
//                 } else {
//                   throw new Error(
//                     `Failed to save division with ID ${divisionID}: ${response.statusText}`
//                   );
//                 }
//               })
//             );

//             // Update the saved divisions list
//             setSavedDivisions((prevSaved) => [...prevSaved, divisionID]);
//           })
//         );

//         // Clear selected divisions after saving
//         setSelectedDivisions([]);
//         toast.success("Data saved for selected divisions successfully!", {
//           position: "top-center",
//           autoClose: 1000,
//         });
//       }
//     } catch (error) {
//       console.error("Error saving data:", error);
//       toast.error(
//         `Error: ${"Failed to save data" || "Something went wrong!"}`,
//         {
//           position: "top-center",
//           autoClose: 1000,
//         }
//       );
//     }
//   };

//   const columns = [
//     {
//       field: "Grade",
//       headerName: isLevelSelected ? "Level" : "GRADE", // Dynamic header
//       flex: 1,
//       minWidth: 180,
//       editable: false,
//       headerAlign: "center",
//       align: "center",
//       renderCell: (params) => (
//         <Select
//           value={params.value || ""}
//           onChange={(event) => handleGradeChange(params.id, event.target.value)}
//           displayEmpty
//           variant="outlined"
//           fullWidth
//           disabled={!isEditable}
//         >
//           <MenuItem value="">
//             {isLevelSelected ? "Select Level" : "Select Grade"}
//           </MenuItem>
//           {isLevelSelected
//             ? Level.map((level) => (
//                 <MenuItem key={level.v_LevelID} value={level.v_LevelName}>
//                   {level.v_LevelName}
//                 </MenuItem>
//               ))
//             : Grade.map((grade) => (
//                 <MenuItem key={grade.v_GradeID} value={grade.v_GradeName}>
//                   {grade.v_GradeName}
//                 </MenuItem>
//               ))}
//         </Select>
//       ),
//     },
//     {
//       field: "ExperienceFrom",
//       headerName: "EXPERIENCE FROM",
//       flex: 1,
//       minWidth: 230,
//       editable: false,
//       headerAlign: "center",
//       align: "center",
//       renderCell: (params) => <AnnualBasisCellYear {...params} />,
//     },
//     {
//       field: "ExperienceTo",
//       headerName: "EXPERIENCE TO",
//       flex: 1,
//       minWidth: 230,
//       editable: false,
//       headerAlign: "center",
//       align: "center",
//       renderCell: (params) => <AnnualBasisCellYear {...params} />,
//     },
//     {
//       field: "CTC",
//       headerName: "CTC (Annual Basis)",
//       flex: 1,
//       minWidth: 230,
//       editable: false,
//       headerAlign: "center",
//       align: "center",
//       renderCell: (params) => <AnnualBasisCell {...params} />,
//     },
//     {
//       field: "actions",
//       headerName: "Actions",
//       flex: 0.5,
//       minWidth: 100,
//       headerAlign: "center",
//       align: "center",
//       renderCell: (params) => (
//         <IconButton onClick={() => handleDelete(params.id)}>
//           <DeleteOutlinedIcon color="error" />
//         </IconButton>
//       ),
//     },
//   ];

//   return (
//   <Grid container sx={{ backgroundColor: "#f2f4f7", minHeight: "100vh" }}>
//     <Navbar />
//     <Box height={30} />

//     <Box sx={{ display: "flex" }}>
//   <Box sx={{ width: "240px", position: "fixed", top: "64px", left: 0 }}>
//     <Sidenav />
//   </Box>

//   <Grid
//     item
//     xs={12}
//     sx={{
//       marginRight: "200px",  // matches sidenav width
//       marginTop: "70px",  // matches navbar height
//       padding: "30px",
//       width: "calc(100% - 240px)",
//     }}
//   >

//         {/* PAGE TITLE */}
//         <AppBar position="static" sx={{ borderRadius: "8px" }}>
//           <Toolbar>
//             <Typography variant="h5" sx={{ fontWeight: "bold", color: "#fff" }}>
//               Grade Slab Management
//             </Typography>
//           </Toolbar>
//         </AppBar>

//         <ToastContainer autoClose={1500} />

//         {/* FILTER CARD */}
//         <Box
//           sx={{
//             background: "#fff",
//             padding: "20px",
//             mt: 3,
//             borderRadius: "8px",
//             boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//           }}
//         >
//           <Typography fontWeight="bold" sx={{ mb: 2 }}>
//             Filters
//           </Typography>

//           {/* RADIO OPTIONS */}
//           <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//             <RadioGroup row value={selectedOption} onChange={handleRadioChange}>
//               <FormControlLabel value="Branch" control={<Radio />} label="Branch-Based" />
//               <FormControlLabel value="Division" control={<Radio />} label="Division-Based" />
//             </RadioGroup>

//             <FormControlLabel
//               sx={{ ml: 4 }}
//               control={<Android12Switch checked={isLevelSelected} onChange={handleSwitchChange} />}
//               label="Level Slab"
//             />
//           </Box>

//           {/* CONDITIONAL INPUTS */}
//           {selectedOption === "Branch" && (
//             <Box>
//               <Typography sx={{ mb: 1 }}>Select Branch</Typography>
//               <ReactSelect
//                 options={branchOptions}
//                 isMulti
//                 value={branchOptions.filter((opt) =>
//                   selectedBranches.includes(opt.value)
//                 )}
//                 onChange={handleBranchChange}
//                 placeholder="Choose Branch(es)"
//               />
//             </Box>
//           )}

//           {selectedOption === "Division" && (
//             <Box sx={{ display: "flex", gap: 3 }}>
//               <Box sx={{ width: "50%" }}>
//                 <Typography sx={{ mb: 1 }}>Select Branch</Typography>
//                 <select
//                   className="form-select"
//                   style={{ width: "100%", height: "45px", padding: "10px" }}
//                   onChange={(e) => setpn_BranchID(e.target.value)}
//                 >
//                   <option>Select Branch</option>
//                   {Branch.map((e) => (
//                     <option key={e.pn_BranchID} value={e.pn_BranchID}>
//                       {e.BranchName}
//                     </option>
//                   ))}
//                 </select>
//               </Box>

//               <Box sx={{ width: "50%" }}>
//                 <Typography sx={{ mb: 1 }}>Select Division</Typography>
//                 <ReactSelect
//                   options={DivisionOptions}
//                   isMulti
//                   value={DivisionOptions.filter((opt) =>
//                     selectedDivisions.includes(opt.value)
//                   )}
//                   onChange={handleDivisionChange}
//                   placeholder="Choose Division(s)"
//                 />
//               </Box>
//             </Box>
//           )}
//         </Box>

//         {/* GRID + BUTTONS CARD */}
//         <Box
//           sx={{
//             background: "#fff",
//             padding: "20px",
//             mt: 3,
//             borderRadius: "8px",
//             boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//           }}
//         >
//           <Typography fontWeight="bold" sx={{ mb: 2 }}>
//             {showFirstGrid ? "Create Grade Slab" : "Saved Slab Records"}
//           </Typography>

//           {/* GRID */}
//           {showFirstGrid ? (
//             <>
//               <StyledDataGrid
//                 rows={rows}
//                 columns={columns}
//                 autoHeight
//                 paginationModel={paginationModel}
//                 onPaginationModelChange={setPaginationModel}
//                 pageSizeOptions={[5, 10, 25]}
//               />

//               {/* ACTION BUTTONS */}
//               <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 2 }}>
//                 <Button variant="contained" color="secondary" onClick={fetchSavedData}>
//                   View Saved
//                 </Button>
//                 <Button variant="contained" onClick={handleAddRow}>
//                   Add Row
//                 </Button>
//                 <Button variant="contained" color="primary" onClick={handleSave}>
//                   Save
//                 </Button>
//               </Box>
//             </>
//           ) : (
//             <StyledDataGrid
//               rows={retrievedRows}
//               columns={[
//                 { field: "Grade", headerName: "Grade/Level", flex: 1 },
//                 { field: "ExperienceFrom", headerName: "Experience From", flex: 1 },
//                 { field: "ExperienceTo", headerName: "Experience To", flex: 1 },
//                 { field: "CTC", headerName: "CTC", flex: 1 },
//               ]}
//               autoHeight
//             />
//           )}
//         </Box>
//       </Grid>
//     </Box>
//   </Grid>
// );
// }
























// GradeSlabAG.js (FINAL FULL)
import React, { useState, useEffect } from "react";
import {
  Grid,
  Button,
  Typography,
  Box,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  AppBar,
  Toolbar,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { postRequest } from "../../serverconfiguration/requestcomp";
import { ServerConfig } from "../../serverconfiguration/serverconfig";
import { REPORTS, SAVE } from "../../serverconfiguration/controllers";
import Navbar from "../Home Page-comapny/Navbar1";
import Sidenav from "../Home Page-comapny/Sidenav1";
import { toast } from "react-toastify";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import axios from "axios";

/**
 * GradeSlabAG
 * - Shows branch/division grade slabs
 * - Toggle Level Slab to show/save level rows (stored in Level_Name)
 * - Toggle off to show/save grade rows (stored in Grade_Name)
 *
 * Table shapes expected (from user):
 * Branch table: pn_companyid, pn_branchid, Slab_Type, Grade_Name, Level_Name, Experience_From, Experience_To, CTC, ..., pn_GradeSlabID
 * Division table: pn_CompanyID, pn_DivisionID, Slab_Type, Grade_Name, Level_Name, Experience_From, Experience_To, CTC, ..., GradeSlabID, pn_branchid
 */

export default function GradeSlabAG() {
  const [company, setCompany] = useState(null);
  const [branch, setBranch] = useState([]);
  const [division, setDivision] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [levelList, setLevelList] = useState([]);

  const [pnCompanyId, setPnCompanyId] = useState("");
  const [isloggedin] = useState(sessionStorage.getItem("auth"));
  const databaseName = sessionStorage.getItem("databaseName");

  // UI mode & toggle
  const [selectedOption, setSelectedOption] = useState("Branch"); // Branch | Division
  const [isLevelSelected, setIsLevelSelected] = useState(false);

  // Filters
  const [selectedBranchFilter, setSelectedBranchFilter] = useState("");
  const [selectedDivisionFilter, setSelectedDivisionFilter] = useState("");

  // Data
  const [gridData, setGridData] = useState([]); // raw rows (DB + new)
  const [filteredData, setFilteredData] = useState([]); // rows after filtering
//token
const authStr=sessionStorage.getItem("auth");
        const auth=authStr?JSON.parse(authStr):null;
        const token=auth?.token;
        ServerConfig.url = "https://localhost:7266/api";
  // Fetch company for logged user
  const fetchCompany = async () => {
    try {
      const res=await axios.get(`${ServerConfig.url}/PaymCompanies/by-user`,{
          headers:{
            Authorization:`Bearer ${token}`
          }
        });
      
      if (res?.data?.length) {
        setCompany(res.data[0]);
        setPnCompanyId(res.data[0].pnCompanyId);
      }
    } catch (e) {
      console.error("fetchCompany", e);
      toast.error("Failed to fetch company");
    }
  };

  const fetchBranches = async () => {
    if (!pnCompanyId) return;
    try {
      const res=await axios.get(`${ServerConfig.url}/PaymBranches/by-company/${pnCompanyId}`,{
          headers:{
            Authorization:`Bearer ${token}`
          }
        });
      setBranch(res.data || []);
      
    } catch (e) {
      console.error("fetchBranches", e);
    }
  };

  const fetchDivisions = async () => {
    if (!pnCompanyId) return;
    try {
      const res=await axios.get(`${ServerConfig.url}/PaymDivisions/by-company/${pnCompanyId}`,{
          headers:{
            Authorization:`Bearer ${token}`
          }
        });
      setDivision(res.data || []);
    } catch (e) {
      console.error("fetchDivisions", e);
    }
  };

  const fetchGradesLevels = async () => {
    if (!pnCompanyId) return;
    try {
      const gradeRes=await axios.get(`${ServerConfig.url}/PaymGrades/company/${pnCompanyId}`,{
          headers:{
            Authorization:`Bearer ${token}`
          }
        });
        const levelRes=await axios.get(`${ServerConfig.url}/PaymLevels/${pnCompanyId}`,{
          headers:{
            Authorization:`Bearer ${token}`
          }
        });
      setGradeList(gradeRes.data || []);
      setLevelList(levelRes.data || []);
    } catch (e) {
      console.error("fetchGradesLevels", e);
    }
  };

  // Normalize DB rows into consistent UI row format
  const fetchSavedSlabs = async () => {
    if (!pnCompanyId) return;
    try {
      let query = "";
      if (selectedOption === "Branch") {
        query = `SELECT * FROM [${databaseName}].[dbo].[GradeSlab_Branch] WHERE pn_companyid=${pnCompanyId}`;
      } else {
        query = `SELECT * FROM [${databaseName}].[dbo].[GradeSlab_Division] WHERE pn_companyid=${pnCompanyId}`;
      }

      const res = await postRequest(ServerConfig.url, REPORTS, { query });
      const rows = (res.data || []).map((r) => {
        // DB column name variations: use safe fallbacks
        const id =
          r.GradeSlabID ??
          r.pn_GradeSlabID ??
          r.pn_GradeSlab_DivisionID ??
          r.pn_GradeSlabID ??
          r.GradeSlabID; // best effort

        const branchId =
          r.pn_branchid ?? r.pn_BranchID ?? r.pn_branchID ?? null;

        // Division table uses pn_DivisionID but sometimes lowercase variants exist
        const divisionId =
          r.pn_DivisionID ?? r.pn_Divisionid ?? r.DIVISIONID ?? null;

        return {
          id,
          GradeOrLevel: r.Slab_Type === "Level" ? r.Level_Name || "" : r.Grade_Name || "",
          ExperienceFrom: r.Experience_From,
          ExperienceTo: r.Experience_To,
          CTC: r.CTC,
          BranchID: branchId,
          DivisionID: divisionId,
          slabType: r.Slab_Type,
          isNew: false,
          raw: r,
        };
      });

      setGridData(rows);
      setFilteredData(rows);
      toast.success("Saved slabs loaded");
    } catch (e) {
      console.error("fetchSavedSlabs", e);
      toast.error("Failed to load saved slabs");
    }
  };

  // initial fetch
  useEffect(() => {
    fetchCompany();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isloggedin]);

  // when company id or mode changes, reload supporting lists and saved slabs
  useEffect(() => {
    if (!pnCompanyId) return;
    fetchBranches();
    fetchDivisions();
    fetchGradesLevels();
    fetchSavedSlabs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pnCompanyId, selectedOption]);

  // Filter rows by slabType (level/grade) + branch + division
  useEffect(() => {
    let data = [...gridData];

    // slab type filter
    data = data.filter((r) =>
      isLevelSelected
        ? String(r.slabType).toLowerCase() === "level"
        : String(r.slabType).toLowerCase() === "grade"
    );

    // branch filter
    if (selectedBranchFilter) {
      data = data.filter((r) => String(r.BranchID) === String(selectedBranchFilter));
    }

    // division filter
    if (selectedDivisionFilter) {
      data = data.filter((r) => String(r.DivisionID) === String(selectedDivisionFilter));
    }

    setFilteredData(data);
  }, [isLevelSelected, gridData, selectedBranchFilter, selectedDivisionFilter]);

  // Add temporary new row
  const handleAddRow = () => {
    const last = gridData[gridData.length - 1];
    if (
      last &&
      (!last.GradeOrLevel ||
        last.ExperienceFrom === "" ||
        last.ExperienceTo === "" ||
        last.CTC === "")
    ) {
      toast.warning("Please fill the last row before adding a new one");
      return;
    }

    const defaultBranch = branch.length ? branch[0].pn_BranchID : null;
    const defaultDivision = division.length ? division[0].pn_DivisionID : null;

    const newRow = {
      id: Math.random(), // temporary
      GradeOrLevel: "",
      ExperienceFrom: "",
      ExperienceTo: "",
      CTC: "",
      BranchID: defaultBranch,
      DivisionID: selectedOption === "Division" ? defaultDivision : null,
      slabType: isLevelSelected ? "Level" : "Grade",
      isNew: true,
    };

    setGridData((p) => [...p, newRow]);
  };

  // Helper: ensure we extract string value from ag-grid newValue which can be object or primitive
  const normalizeEditorValue = (val) => {
    if (val == null) return "";
    // If it's a primitive string/number, return its string
    if (typeof val === "string" || typeof val === "number" || typeof val === "boolean") {
      return String(val);
    }
    // if object, common patterns: { value, label } or { v_LevelName } etc.
    if (typeof val === "object") {
      if ("label" in val && typeof val.label === "string") return val.label;
      if ("value" in val && (typeof val.value === "string" || typeof val.value === "number"))
        return String(val.value);
      // fallback: try JSON-friendly extraction of first string property
      for (const k of Object.keys(val)) {
        if (typeof val[k] === "string") return val[k];
      }
      // last resort
      return JSON.stringify(val);
    }
    return String(val);
  };

  // Save new rows bulk
  const handleSaveAll = async () => {
    try {
      if (!company) return toast.error("Company not found");
      const newRows = gridData.filter((r) => r.isNew);
      if (!newRows.length) return toast.error("No new rows to save");

      // Validate
      for (const r of newRows) {
        if (
          !r.GradeOrLevel ||
          r.ExperienceFrom === "" ||
          r.ExperienceTo === "" ||
          r.CTC === "" ||
          !r.BranchID ||
          (selectedOption === "Division" && !r.DivisionID)
        ) {
          return toast.error("Please fill all fields for new rows");
        }
      }

      // Build and run queries sequentially
      for (const r of newRows) {
        const value = normalizeEditorValue(r.GradeOrLevel);
        const slabType = isLevelSelected ? "Level" : "Grade";
        const gradeName = isLevelSelected ? "NULL" : `'${value.replace(/'/g, "''")}'`;
        const levelName = isLevelSelected ? `'${value.replace(/'/g, "''")}'` : "NULL";

        if (selectedOption === "Branch") {
          const q = `INSERT INTO [${databaseName}].[dbo].[GradeSlab_Branch]
            (pn_companyid, pn_branchid, Slab_Type, Grade_Name, Level_Name, Experience_From, Experience_To, CTC)
            VALUES (${company.pn_CompanyID}, ${r.BranchID}, '${slabType}', ${gradeName}, ${levelName}, ${r.ExperienceFrom}, ${r.ExperienceTo}, ${r.CTC})`;
          await postRequest(ServerConfig.url, SAVE, { query: q });
        } else {
          // Division
          const q = `INSERT INTO [${databaseName}].[dbo].[GradeSlab_Division]
            (pn_companyid, pn_branchid, pn_DivisionID, Slab_Type, Grade_Name, Level_Name, Experience_From, Experience_To, CTC)
            VALUES (${company.pn_CompanyID}, ${r.BranchID}, ${r.DivisionID}, '${slabType}', ${gradeName}, ${levelName}, ${r.ExperienceFrom}, ${r.ExperienceTo}, ${r.CTC})`;
          await postRequest(ServerConfig.url, SAVE, { query: q });
        }
      }

      toast.success("Saved successfully");
      await fetchSavedSlabs();
    } catch (err) {
      console.error("handleSaveAll", err);
      toast.error("Failed to save");
    }
  };

  // Update single saved row
  const handleUpdateRow = async (row) => {
    try {
      if (!row || !row.id) return;
      if (row.isNew) return toast.info("Please click Save All to persist new rows");

      const value = normalizeEditorValue(row.GradeOrLevel);
      const gradeName = isLevelSelected ? "NULL" : `'${value.replace(/'/g, "''")}'`;
      const levelName = isLevelSelected ? `'${value.replace(/'/g, "''")}'` : "NULL";

      if (selectedOption === "Branch") {
        const q = `UPDATE [${databaseName}].[dbo].[GradeSlab_Branch]
          SET Slab_Type='${row.slabType}', Grade_Name=${gradeName}, Level_Name=${levelName},
              Experience_From=${row.ExperienceFrom}, Experience_To=${row.ExperienceTo}, CTC=${row.CTC},
              pn_branchid=${row.BranchID}
          WHERE pn_GradeSlabID=${row.id}`;
        await postRequest(ServerConfig.url, SAVE, { query: q });
      } else {
        const q = `UPDATE [${databaseName}].[dbo].[GradeSlab_Division]
          SET Slab_Type='${row.slabType}', Grade_Name=${gradeName}, Level_Name=${levelName},
              Experience_From=${row.ExperienceFrom}, Experience_To=${row.ExperienceTo}, CTC=${row.CTC},
              pn_branchid=${row.BranchID}, pn_DivisionID=${row.DivisionID}
          WHERE GradeSlabID=${row.id}`;
        await postRequest(ServerConfig.url, SAVE, { query: q });
      }

      toast.success("Updated");
      await fetchSavedSlabs();
    } catch (e) {
      console.error("handleUpdateRow", e);
      toast.error("Update failed");
    }
  };

  // Delete row (DB or local)
  const handleDeleteRow = async (row) => {
    try {
      if (!row) return;
      if (!row.isNew) {
        const q =
          selectedOption === "Branch"
            ? `DELETE FROM [${databaseName}].[dbo].[GradeSlab_Branch] WHERE pn_GradeSlabID=${row.id}`
            : `DELETE FROM [${databaseName}].[dbo].[GradeSlab_Division] WHERE GradeSlabID=${row.id}`;
        await postRequest(ServerConfig.url, SAVE, { query: q });
        toast.info("Deleted from DB");
        await fetchSavedSlabs();
        return;
      }
      setGridData((p) => p.filter((r) => r.id !== row.id));
      toast.info("Row removed");
    } catch (e) {
      console.error("handleDeleteRow", e);
      toast.error("Delete failed");
    }
  };

  // AG Grid column defs with robust valueSetter to avoid object storage
  const columnDefs = [
    {
      headerName: isLevelSelected ? "LEVEL" : "GRADE",
      field: "GradeOrLevel",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: isLevelSelected ? levelList.map((l) => l.vLevelName) : gradeList.map((g) => g.vGradeName),
      },
      valueSetter: (params) => {
        // normalize and store a string
        params.data.GradeOrLevel = normalizeEditorValue(params.newValue);
        return true;
      },
      minWidth: 180,
      flex: 1,
    },
    {
      headerName: "EXPERIENCE FROM",
      field: "ExperienceFrom",
      editable: true,
      minWidth: 140,
      cellEditor: "agTextCellEditor",
    },
    {
      headerName: "EXPERIENCE TO",
      field: "ExperienceTo",
      editable: true,
      minWidth: 140,
      cellEditor: "agTextCellEditor",
    },
    {
      headerName: "CTC (Annual)",
      field: "CTC",
      editable: true,
      minWidth: 140,
      cellEditor: "agTextCellEditor",
    },
    {
      headerName: "Branch",
      field: "BranchID",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: branch.map((b) => String(b.pnBranchId)),
      },
      valueFormatter: (params) => {
        const b = branch.find((x) => String(x.pnBranchId) === String(params.value));
        return b ? b.branchName : "";
      },
      valueSetter: (params) => {
        params.data.BranchID = normalizeEditorValue(params.newValue);
        return true;
      },
      minWidth: 160,
    },
    {
      headerName: "Division",
      field: "pnDivisionId",
      // editable: selectedOption === "Division",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: division.map((d) => String(d.pnDivisionId)),
      },
      valueFormatter: (params) => {
        const d = division.find((x) => String(x.pnDivisionId) === String(params.value));
        return d ? d.vDivisionName : "";
      },
      valueSetter: (params) => {
        params.data.pnDivisionId = normalizeEditorValue(params.newValue);
        return true;
      },
      minWidth: 160,
    },
    {
      headerName: "ACTION",
      field: "action",
      cellRenderer: (params) => {
        const row = params.data;
        return (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="outlined" size="small" onClick={() => handleUpdateRow(row)} startIcon={<EditOutlinedIcon />}>
              Update
            </Button>
            <IconButton color="error" onClick={() => handleDeleteRow(row)}>
              <DeleteOutlineIcon />
            </IconButton>
          </Box>
        );
      },
      minWidth: 160,
    },
  ];

  return (
    <Grid container sx={{ minHeight: "100vh", backgroundColor: "#f0f4f8" }}>
      <Navbar />
      <Grid item xs={12} sx={{ display: "flex" }}>
        <Sidenav />
        <Grid item xs={12} sm={10} sx={{ p: 3, margin: "100px auto" }}>
          <AppBar position="static" sx={{ mb: 3, borderRadius: 2, background: "linear-gradient(90deg, #6a11cb, #2575fc)" }}>
            <Toolbar>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "#fff" }}>
                Grade Slab
              </Typography>
            </Toolbar>
          </AppBar>

          <Card sx={{ p: 3, mb: 3, borderRadius: 3, background: "linear-gradient(90deg, #6a11cb, #2575fc)" }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: "#000" }}>Mode</InputLabel>
                  <Select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)} sx={{ bgcolor: "#fff", color: "#000" }}>
                    <MenuItem value="Branch">Branch-Based</MenuItem>
                    <MenuItem value="Division">Division-Based</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: "#000" }}>Filter Branch</InputLabel>
                  <Select value={selectedBranchFilter} onChange={(e) => setSelectedBranchFilter(e.target.value)} sx={{ bgcolor: "#fff", color: "#000" }}>
                    <MenuItem value="">All Branches</MenuItem>
                    {branch.map((b) => (
                      <MenuItem key={b.pnBranchId} value={b.pnBranchId}>
                        {b.branchName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4} sx={{ textAlign: { md: "right" } }}>
                <Button onClick={handleAddRow} sx={{ mr: 2, background: "#ff4b1f", color: "#fff" }}>
                  Add Slab
                </Button>
                <Button onClick={handleSaveAll} sx={{ background: "linear-gradient(45deg,#1fddff,#45f3ff)", color: "#000" }}>
                  Save All
                </Button>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControlLabel
                  control={<Switch checked={isLevelSelected} onChange={(e) => setIsLevelSelected(e.target.checked)} />}
                  label="Level Slab"
                  sx={{ color: "#fff" }}
                />
              </Grid>

              {selectedOption === "Division" && (
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: "#000" }}>Filter Division</InputLabel>
                    <Select value={selectedDivisionFilter} onChange={(e) => setSelectedDivisionFilter(e.target.value)} sx={{ bgcolor: "#fff", color: "#000" }}>
                      <MenuItem value="">All Divisions</MenuItem>
                      {division.map((d) => (
                        <MenuItem key={d.pn_DivisionID} value={d.pn_DivisionID}>
                          {d.v_DivisionName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
            </Grid>
          </Card>

          <Box className="ag-theme-alpine" sx={{ borderRadius: 3, overflow: "hidden", boxShadow: 3, mb: 3 }}>
            <AgGridReact
              rowData={filteredData}
              columnDefs={columnDefs}
              domLayout="autoHeight"
              defaultColDef={{ flex: 1, minWidth: 120, resizable: true }}
              pagination
              paginationPageSize={10}
              animateRows
              stopEditingWhenGridLosesFocus
              onCellValueChanged={(params) =>
                // reflect edit to the master gridData array
                setGridData((prev) => prev.map((r) => (r.id === params.data.id ? { ...r, ...params.data } : r)))
              }
              getRowStyle={(params) => ({ backgroundColor: params.node.rowIndex % 2 === 0 ? "#e0f7fa" : "#ffffff" })}
            />
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
}
