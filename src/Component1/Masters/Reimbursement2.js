// import React, { useState } from "react";
// import {
//   Box,
//   Button,
//   TextField,
//   AppBar,
//   Toolbar,
//   Grid,
//   MenuItem,
//   Typography,
//   Paper,
//   FormControl,
//   InputLabel,
//   Select,
//   IconButton,
//   Container,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   CssBaseline,
// } from "@mui/material";
// import { HelpOutline, CheckCircle } from "@mui/icons-material";
// import { LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import CreateIcon from "@mui/icons-material/Create";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { REPORTS } from "../../serverconfiguration/controllers";
// import { ServerConfig } from "../../serverconfiguration/serverconfig";
// import axios from "axios";
// import { postRequest } from "../../serverconfiguration/requestcomp";
// import Sidenav from "../Home Page3/Sidenav2";
// import Navbar from "../Home Page3/Navbar2";

// const ReimbursementForm2 = () => {
//   const [rows, setRows] = useState([
//     {
//       category: "",
//       amount: "",
//       startdate: null,
//       enddate: null,
//       description: "",
//       attachments: null,
//     },
//   ]);
//   const [payableMonth, setPayableMonth] = useState("");
//   const [job, setJob] = useState("");
//   const [employee, setEmployee] = useState("");
//   const [submitted, setSubmitted] = useState(false);
//   const [errors, setErrors] = useState({
//     payableMonth: false,
//     job: false,
//     employee: false,
//     rows: [],
//   });
//   const dbname = sessionStorage.getItem("databaseName");
//   const empCode = sessionStorage.getItem("user");

//   const handleRowChange = (index, field, value) => {
//     const newRows = [...rows];
//     newRows[index][field] = value;
//     setRows(newRows);
//   };

//   const handleFileChange = (index, event) => {
//     const newRows = [...rows];
//     newRows[index].attachments = event.target.files[0];
//     setRows(newRows);
//   };

//   const addRow = () => {
//     // Check if the last row is filled
//     const lastRow = rows[rows.length - 1];
//     const isLastRowFilled =
//       lastRow.category &&
//       lastRow.amount &&
//       lastRow.startdate &&
//       lastRow.enddate &&
//       lastRow.description;

//     if (isLastRowFilled) {
//       setRows([
//         ...rows,
//         {
//           category: "",
//           amount: "",
//           startdate: null,
//           enddate: null,
//           description: "",
//           attachments: null,
//         },
//       ]);
//       setErrors((prev) => ({ ...prev, rows: [...prev.rows, {}] }));
//     } else {
//       alert(
//         "Please fill out all fields in the current row before adding a new one."
//       );
//     }
//   };

//   const deleteRow = (index) => {
//     const newRows = rows.filter((_, rowIndex) => rowIndex !== index);
//     const newErrors = errors.rows.filter((_, rowIndex) => rowIndex !== index);
//     setRows(newRows);
//     setErrors((prev) => ({ ...prev, rows: newErrors }));
//   };

//   const validateForm = () => {
//     let formIsValid = true;
//     let newErrors = {
//       payableMonth: false,
//       job: false,
//       employee: false,
//       rows: [],
//     };

//     if (!payableMonth) {
//       newErrors.payableMonth = true;
//       formIsValid = false;
//     }

//     if (!job) {
//       newErrors.job = true;
//       formIsValid = false;
//     }

//     if (!employee) {
//       newErrors.employee = true;
//       formIsValid = false;
//     }

//     const rowErrors = rows.map((row) => {
//       let rowError = {};
//       if (!row.category) rowError.category = true;
//       if (!row.amount) rowError.amount = true;
//       if (!row.startdate) rowError.startdate = true;
//       if (!row.enddate) rowError.enddate = true;
//       if (!row.description) rowError.description = true;
//       return rowError;
//     });

//     rowErrors.forEach((rowError) => {
//       if (Object.keys(rowError).length > 0) formIsValid = false;
//     });
//     newErrors.rows = rowErrors;
//     setErrors(newErrors);
//     return formIsValid;
//   };

//   // const handleSubmit = async () => {
//   //   if (validateForm()) {
//   //     try {
//   //       const formData = new FormData();
//   //       formData.append('PayableMonth', payableMonth);
//   //       formData.append('Job', job);
//   //       formData.append('Employee', employee);

//   //       rows.forEach((row, index) => {
//   //         formData.append(`Rows[${index}].category`, row.category);
//   //         formData.append(`Rows[${index}].amount`, row.amount);
//   //         formData.append(`Rows[${index}].startdate`, row.startdate);
//   //         formData.append(`Rows[${index}].enddate`, row.enddate);
//   //         formData.append(`Rows[${index}].description`, row.description);
//   //         if (row.attachments) {
//   //           formData.append(`Rows[${index}].attachments`, row.attachments);
//   //         }
//   //       });

//   //       const response = await axios.post(`${ServerConfig.url}${REPORTS}`, formData, {
//   //         headers: {
//   //           'Content-Type': 'multipart/form-data',
//   //         },
//   //       });

//   //       if (response.status === 200) {
//   //         alert('Data saved successfully');
//   //       } else {
//   //         alert('Failed to save data');
//   //       }
//   //     } catch (error) {
//   //       console.error('Error saving data:', error);
//   //       alert('Failed to save data');
//   //     }
//   //   } else {
//   //     console.log('Form validation failed.');
//   //   }
//   // };

//   const handleSubmit = async () => {
//     if (!validateForm()) {
//       console.log("Form validation failed.");
//       return;
//     }

//     try {
//       // Convert all attachments into HEX (same as leave module)
//       for (let i = 0; i < rows.length; i++) {
//         if (rows[i].attachments) {
//           const arr = await rows[i].attachments.arrayBuffer();
//           const byteArray = new Uint8Array(arr);
//           rows[i].fileHex = Array.from(byteArray, (b) =>
//             b.toString(16).padStart(2, "0")
//           ).join("");
//         } else {
//           rows[i].fileHex = null;
//         }
//       }

//       // Build SQL insert for each row
//       const insertQueries = rows
//         .map((row) => {
//           return `
//           INSERT INTO [${dbname}].[dbo].[paym_Reimbursement]
//           (
//             EmployeeCode,
//             PayableMonth,
//             Category,
//             Amount,
//             StartDate,
//             EndDate,
//             Description,
//             AttachFile
//           )
//           VALUES
//           (
//             '${empCode}',
//             '${payableMonth}',
//             '${row.category}',
//             ${row.amount},
//             '${row.startdate}',
//             '${row.enddate}',
//             '${row.description}',
//             ${
//               row.fileHex
//                 ? `CONVERT(varbinary(max), '0x${row.fileHex}', 1)`
//                 : "NULL"
//             }
//           );
//         `;
//         })
//         .join("");

//       // Execute query via SAVE controller
//       const response = await postRequest(ServerConfig.url, REPORTS, {
//         dbname: dbname,
//         query: insertQueries,
//       });

//       if (response.status === 200) {
//         alert("Reimbursement saved successfully!");
//       } else {
//         alert("Failed to save reimbursement");
//       }
//     } catch (error) {
//       console.error("Error saving reimbursement:", error);
//       alert("Error saving reimbursement");
//     }
//   };

//   return (
//     <Box
//       sx={{ display: "flex", backgroundColor: "#f5f5f5", minHeight: "100vh" }}
//     >
//       <CssBaseline />
//       <Navbar />
//       <Sidenav />

//       <Box component="main" sx={{ flexGrow: 1, mt: 20, width: "100%" }}>
//         <LocalizationProvider dateAdapter={AdapterDateFns}>
//           <Container maxWidth="lg">
//             {/* Help Button */}
//             <Box position="absolute" top={16} right={16}>
//               <Button startIcon={<HelpOutline />} color="error">
//                 Help
//               </Button>
//             </Box>

//             <Paper elevation={3} sx={{ p: 2 }}>
//               <AppBar position="static" sx={{ mb: 2 }}>
//                 <Toolbar>
//                   <Typography variant="h5" sx={{ flexGrow: 1 }}>
//                     EMPLOYEE REIMBURSEMENT
//                   </Typography>
//                 </Toolbar>
//               </AppBar>

//               {/* Payable Month Section */}
//               <Grid container spacing={2} sx={{ mb: 2 }}>
//                 <Grid item xs={12}>
//                   <Grid container spacing={1} alignItems="center">
//                     <Grid item xs={12} md={3}>
//                       <Typography variant="h6" sx={{ my: 0 }}>
//                         Select Payable Month:
//                       </Typography>
//                     </Grid>
//                     <Grid item xs={12} md={4}>
//                       <TextField
//                         fullWidth
//                         type="date"
//                         variant="outlined"
//                         value={payableMonth}
//                         onChange={(e) => setPayableMonth(e.target.value)}
//                         InputLabelProps={{ shrink: true }}
//                         sx={{
//                           "& .MuiOutlinedInput-root": {
//                             backgroundColor: "#fff",
//                             borderRadius: "10px", // This sets the input background to white
//                             "& fieldset": {
//                               borderWidth: "2px",
//                               borderRadius: "8px",
//                             },
//                             "&:hover fieldset": {
//                               borderColor: "black",
//                             },
//                             "&.Mui-focused fieldset": {
//                               borderColor: "black",
//                             },
//                             "&.Mui-error fieldset": {
//                               borderColor: "black",
//                             },
//                           },
//                         }}
//                         error={errors.payableMonth}
//                         helperText={
//                           errors.payableMonth && "Payable month is required."
//                         }
//                       />
//                     </Grid>
//                     <Grid item xs={12} md={5}>
//                       <Typography
//                         variant="body2"
//                         sx={{
//                           display: "flex",
//                           alignItems: "center",
//                           color: "primary.main",
//                           fontSize: "1.25rem",
//                           marginLeft: "10px",
//                         }}
//                       >
//                         <IconButton color="primary" size="small">
//                           <CreateIcon />
//                         </IconButton>
//                         Add Reimbursement
//                       </Typography>
//                     </Grid>
//                   </Grid>
//                 </Grid>
//               </Grid>

//               {/* Table Section */}
//               <TableContainer component={Paper} sx={{ mb: 3 }}>
//                 <Table>
//                   <TableHead sx={{ backgroundColor: "action.hover" }}>
//                     <TableRow>
//                       <TableCell width="20%">Category</TableCell>
//                       <TableCell width="15%">Amount</TableCell>
//                       <TableCell width="15%">Start Date</TableCell>
//                       <TableCell width="15%">End Date</TableCell>
//                       <TableCell width="20%">Description</TableCell>
//                       <TableCell width="10%">Attachments</TableCell>
//                       <TableCell width="5%">Actions</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {rows.map((row, index) => (
//                       <TableRow
//                         key={index}
//                         sx={{
//                           backgroundColor:
//                             index % 2 === 0 ? "#cde3f2" : "#ffffff",
//                         }}
//                       >
//                         <TableCell>
//                           <FormControl
//                             fullWidth
//                             variant="outlined"
//                             error={errors.rows[index]?.category}
//                             sx={{
//                               "& .MuiOutlinedInput-root": {
//                                 backgroundColor: "#fff",
//                                 borderRadius: "10px",
//                                 "& fieldset": {
//                                   borderWidth: "2px",
//                                   borderRadius: "8px",
//                                 },
//                                 "&:hover fieldset": {
//                                   borderColor: "black",
//                                 },
//                                 "&.Mui-focused fieldset": {
//                                   borderColor: "black",
//                                 },
//                                 "&.Mui-error fieldset": {
//                                   borderColor: "black",
//                                 },
//                               },
//                               // Add this for the label
//                               "& .MuiInputLabel-root": {
//                                 color: "black",
//                                 "&.Mui-focused": {
//                                   color: "black",
//                                 },
//                                 "&.Mui-error": {
//                                   color: "black",
//                                 },
//                               },
//                             }}
//                           >
//                             <InputLabel>Select Category</InputLabel>
//                             <Select
//                               value={row.category}
//                               onChange={(e) =>
//                                 handleRowChange(
//                                   index,
//                                   "category",
//                                   e.target.value
//                                 )
//                               }
//                               label="Select Category"
//                             >
//                               <MenuItem value="category1">Category 1</MenuItem>
//                               <MenuItem value="category2">Category 2</MenuItem>
//                             </Select>
//                             {errors.rows[index]?.category && (
//                               <Typography variant="caption" color="error">
//                                 Required
//                               </Typography>
//                             )}
//                           </FormControl>
//                         </TableCell>
//                         <TableCell>
//                           <TextField
//                             fullWidth
//                             type="number"
//                             variant="outlined"
//                             value={row.amount}
//                             onChange={(e) =>
//                               handleRowChange(index, "amount", e.target.value)
//                             }
//                             error={errors.rows[index]?.amount}
//                             helperText={
//                               errors.rows[index]?.amount && "Required"
//                             }
//                             sx={{
//                               "& .MuiOutlinedInput-root": {
//                                 backgroundColor: "#fff",
//                                 borderRadius: "10px",
//                                 "& fieldset": {
//                                   borderWidth: "2px",
//                                   borderRadius: "8px",
//                                 },
//                                 "&:hover fieldset": {
//                                   borderColor: "black",
//                                 },
//                                 "&.Mui-focused fieldset": {
//                                   borderColor: "black",
//                                 },
//                                 "&.Mui-error fieldset": {
//                                   borderColor: "black",
//                                 },
//                               },
//                               // Add this for the label
//                               "& .MuiInputLabel-root": {
//                                 color: "black",
//                                 "&.Mui-focused": {
//                                   color: "black",
//                                 },
//                                 "&.Mui-error": {
//                                   color: "black",
//                                 },
//                               },
//                             }}
//                           />
//                         </TableCell>
//                         <TableCell>
//                           <TextField
//                             fullWidth
//                             type="date"
//                             variant="outlined"
//                             value={row.startdate}
//                             onChange={(e) =>
//                               handleRowChange(
//                                 index,
//                                 "startdate",
//                                 e.target.value
//                               )
//                             }
//                             InputLabelProps={{ shrink: true }}
//                             error={errors.rows[index]?.startdate}
//                             helperText={
//                               errors.rows[index]?.startdate && "Required"
//                             }
//                             sx={{
//                               "& .MuiOutlinedInput-root": {
//                                 backgroundColor: "#fff",
//                                 borderRadius: "10px",
//                                 "& fieldset": {
//                                   borderWidth: "2px",
//                                   borderRadius: "8px",
//                                 },
//                                 "&:hover fieldset": {
//                                   borderColor: "black",
//                                 },
//                                 "&.Mui-focused fieldset": {
//                                   borderColor: "black",
//                                 },
//                                 "&.Mui-error fieldset": {
//                                   borderColor: "black",
//                                 },
//                               },
//                               // Add this for the label
//                               "& .MuiInputLabel-root": {
//                                 color: "black",
//                                 "&.Mui-focused": {
//                                   color: "black",
//                                 },
//                                 "&.Mui-error": {
//                                   color: "black",
//                                 },
//                               },
//                             }}
//                           />
//                         </TableCell>
//                         <TableCell>
//                           <TextField
//                             fullWidth
//                             type="date"
//                             variant="outlined"
//                             value={row.enddate}
//                             onChange={(e) =>
//                               handleRowChange(index, "enddate", e.target.value)
//                             }
//                             InputLabelProps={{ shrink: true }}
//                             error={errors.rows[index]?.enddate}
//                             helperText={
//                               errors.rows[index]?.enddate && "Required"
//                             }
//                             sx={{
//                               "& .MuiOutlinedInput-root": {
//                                 backgroundColor: "#fff",
//                                 borderRadius: "10px",
//                                 "& fieldset": {
//                                   borderWidth: "2px",
//                                   borderRadius: "8px",
//                                 },
//                                 "&:hover fieldset": {
//                                   borderColor: "black",
//                                 },
//                                 "&.Mui-focused fieldset": {
//                                   borderColor: "black",
//                                 },
//                                 "&.Mui-error fieldset": {
//                                   borderColor: "black",
//                                 },
//                               },
//                               // Add this for the label
//                               "& .MuiInputLabel-root": {
//                                 color: "black",
//                                 "&.Mui-focused": {
//                                   color: "black",
//                                 },
//                                 "&.Mui-error": {
//                                   color: "black",
//                                 },
//                               },
//                             }}
//                           />
//                         </TableCell>
//                         <TableCell>
//                           <TextField
//                             fullWidth
//                             variant="outlined"
//                             value={row.description}
//                             onChange={(e) =>
//                               handleRowChange(
//                                 index,
//                                 "description",
//                                 e.target.value
//                               )
//                             }
//                             error={errors.rows[index]?.description}
//                             helperText={
//                               errors.rows[index]?.description && "Required"
//                             }
//                             sx={{
//                               "& .MuiOutlinedInput-root": {
//                                 backgroundColor: "#fff",
//                                 borderRadius: "10px",
//                                 "& fieldset": {
//                                   borderWidth: "2px",
//                                   borderRadius: "8px",
//                                 },
//                                 "&:hover fieldset": {
//                                   borderColor: "black",
//                                 },
//                                 "&.Mui-focused fieldset": {
//                                   borderColor: "black",
//                                 },
//                                 "&.Mui-error fieldset": {
//                                   borderColor: "black",
//                                 },
//                               },
//                               // Add this for the label
//                               "& .MuiInputLabel-root": {
//                                 color: "black",
//                                 "&.Mui-focused": {
//                                   color: "black",
//                                 },
//                                 "&.Mui-error": {
//                                   color: "black",
//                                 },
//                               },
//                             }}
//                           />
//                         </TableCell>
//                         <TableCell>
//                           <Button
//                             variant="outlined"
//                             component="label"
//                             fullWidth
//                             sx={{
//                               backgroundColor: "#fff",
//                               borderRadius: "10px",
//                               "&:hover": {
//                                 borderColor: "black",
//                               },
//                               "&.Mui-focused": {
//                                 borderColor: "black",
//                               },
//                               "&.Mui-error": {
//                                 borderColor: "black",
//                               },
//                               "& fieldset": {
//                                 borderWidth: "2px",
//                                 borderRadius: "8px",
//                               },
//                             }}
//                           >
//                             Choose File
//                             <input
//                               type="file"
//                               hidden
//                               onChange={(e) => handleFileChange(index, e)}
//                             />
//                           </Button>
//                         </TableCell>
//                         <TableCell>
//                           <Box display="flex" flexDirection="column" gap={1}>
//                             {index > 0 && (
//                               <IconButton
//                                 color="error"
//                                 size="small"
//                                 onClick={() => deleteRow(index)}
//                               >
//                                 <DeleteIcon />
//                               </IconButton>
//                             )}
//                           </Box>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>

//               {/* Job and Employee Selection */}
//               <Grid container spacing={3} sx={{ mb: 3 }}>
//                 <Grid item xs={12} sm={6}>
//                   <Grid container spacing={1} alignItems="center">
//                     <Grid item xs={12} md={4}>
//                       <Typography variant="h6">Select Job:</Typography>
//                     </Grid>
//                     <Grid item xs={12} md={8}>
//                       <FormControl
//                         fullWidth
//                         variant="outlined"
//                         error={errors.job}
//                         sx={{
//                           "& .MuiOutlinedInput-root": {
//                             backgroundColor: "#fff",
//                             borderRadius: "10px",
//                             "& fieldset": {
//                               borderWidth: "2px",
//                               borderRadius: "8px",
//                             },
//                             "&:hover fieldset": {
//                               borderColor: "black",
//                             },
//                             "&.Mui-focused fieldset": {
//                               borderColor: "black",
//                             },
//                             "&.Mui-error fieldset": {
//                               borderColor: "black",
//                             },
//                           },
//                           // Add this for the label
//                           "& .MuiInputLabel-root": {
//                             color: "black",
//                             "&.Mui-focused": {
//                               color: "black",
//                             },
//                             "&.Mui-error": {
//                               color: "black",
//                             },
//                           },
//                         }}
//                       >
//                         <InputLabel>Select Job</InputLabel>
//                         <Select
//                           value={job}
//                           onChange={(e) => setJob(e.target.value)}
//                           label="Select Job"
//                         >
//                           <MenuItem value="job1">Job 1</MenuItem>
//                           <MenuItem value="job2">Job 2</MenuItem>
//                         </Select>
//                         {errors.job && (
//                           <Typography variant="caption" color="error">
//                             Required
//                           </Typography>
//                         )}
//                       </FormControl>
//                     </Grid>
//                   </Grid>
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <Grid container spacing={1} alignItems="center">
//                     <Grid item xs={12} md={4}>
//                       <Typography variant="h6">Select Employee:</Typography>
//                     </Grid>
//                     <Grid item xs={12} md={8}>
//                       <FormControl
//                         fullWidth
//                         variant="outlined"
//                         error={errors.employee}
//                         sx={{
//                           "& .MuiOutlinedInput-root": {
//                             backgroundColor: "#fff",
//                             borderRadius: "10px",
//                             "& fieldset": {
//                               borderWidth: "2px",
//                               borderRadius: "8px",
//                             },
//                             "&:hover fieldset": {
//                               borderColor: "black",
//                             },
//                             "&.Mui-focused fieldset": {
//                               borderColor: "black",
//                             },
//                             "&.Mui-error fieldset": {
//                               borderColor: "black",
//                             },
//                           },
//                           // Add this for the label
//                           "& .MuiInputLabel-root": {
//                             color: "black",
//                             "&.Mui-focused": {
//                               color: "black",
//                             },
//                             "&.Mui-error": {
//                               color: "black",
//                             },
//                           },
//                         }}
//                       >
//                         <InputLabel>Select Employee</InputLabel>
//                         <Select
//                           value={employee}
//                           onChange={(e) => setEmployee(e.target.value)}
//                           label="Select Employee"
//                         >
//                           <MenuItem value="employee1">Employee 1</MenuItem>
//                           <MenuItem value="employee2">Employee 2</MenuItem>
//                         </Select>
//                         {errors.employee && (
//                           <Typography variant="caption" color="error">
//                             Required
//                           </Typography>
//                         )}
//                       </FormControl>
//                     </Grid>
//                   </Grid>
//                 </Grid>
//               </Grid>

//               {/* Submit Button */}
//               <Box display="flex" justifyContent="right">
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   size="small"
//                   sx={{ mr: 2 }}
//                   onClick={addRow}
//                 >
//                   Add
//                 </Button>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   size="large"
//                   startIcon={<CheckCircle />}
//                   onClick={handleSubmit}
//                   sx={{ px: 4, py: 1.5 }}
//                 >
//                   Save
//                 </Button>
//               </Box>
//             </Paper>
//           </Container>
//         </LocalizationProvider>
//       </Box>
//     </Box>
//   );
// };

// export default ReimbursementForm2;












// ⬇️ ReimbursementForm2 — Optimized Clean Code
import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  AppBar,
  Toolbar,
  Grid,
  MenuItem,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CssBaseline,
} from "@mui/material";
import { HelpOutline, CheckCircle } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import { REPORTS } from "../../serverconfiguration/controllers";
import { ServerConfig } from "../../serverconfiguration/serverconfig";
import { postRequest } from "../../serverconfiguration/requestcomp";
import Sidenav from "../Home Page3/Sidenav2";
import Navbar from "../Home Page3/Navbar2";

// 🔹 Reusable Input Style
const inputStyle = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#fff",
    borderRadius: "10px",
    "& fieldset": { borderWidth: 2, borderRadius: "8px" },
    "&:hover fieldset": { borderColor: "black" },
    "&.Mui-focused fieldset": { borderColor: "black" },
    "&.Mui-error fieldset": { borderColor: "black" },
  },
  "& .MuiInputLabel-root": {
    color: "black",
    "&.Mui-focused": { color: "black" },
    "&.Mui-error": { color: "black" },
  },
};

// 🔹 Default Row Template
const defaultRow = {
  category: "",
  amount: "",
  startdate: "",
  enddate: "",
  description: "",
  attachments: null,
};

const ReimbursementForm2 = () => {
  const [rows, setRows] = useState([defaultRow]);
  const [payableMonth, setPayableMonth] = useState("");
  const [job, setJob] = useState("");
  const [employee, setEmployee] = useState("");

  const [errors, setErrors] = useState({
    payableMonth: false,
    job: false,
    employee: false,
    rows: [],
  });

  const dbname = sessionStorage.getItem("databaseName");
  const empCode = sessionStorage.getItem("user");

  // 🔹 Update a row field
  const handleRowChange = (index, field, value) => {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  // 🔹 Add new row (only if last row is filled)
  const addRow = () => {
    const last = rows[rows.length - 1];

    if (
      !last.category ||
      !last.amount ||
      !last.startdate ||
      !last.enddate ||
      !last.description
    ) {
      return alert("Please fill all fields before adding a new row.");
    }

    setRows([...rows, { ...defaultRow }]);
  };

  // 🔹 Delete row
  const deleteRow = (i) => {
    setRows((prev) => prev.filter((_, idx) => idx !== i));
  };

  // 🔹 Form Validation
  const validateForm = () => {
    let valid = true;

    const newErrors = {
      payableMonth: !payableMonth,
      job: !job,
      employee: !employee,
      rows: [],
    };

    const rowErrors = rows.map((r) => ({
      category: !r.category,
      amount: !r.amount,
      startdate: !r.startdate,
      enddate: !r.enddate,
      description: !r.description,
    }));

    rowErrors.forEach((err) => {
      if (Object.values(err).includes(true)) valid = false;
    });

    newErrors.rows = rowErrors;
    setErrors(newErrors);
    return valid;
  };

  // 🔹 Convert file to HEX
  const fileToHex = async (file) => {
    if (!file) return null;
    const buffer = await file.arrayBuffer();
    return Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  // 🔹 Submit Handler
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const rowsWithHex = await Promise.all(
        rows.map(async (r) => ({
          ...r,
          fileHex: r.attachments ? await fileToHex(r.attachments) : null,
        }))
      );

      const insertSQL = rowsWithHex
        .map(
          (r) => `
        INSERT INTO [${dbname}].[dbo].[paym_Reimbursement]
        (
          EmployeeCode, PayableMonth, Category, Amount,
          StartDate, EndDate, Description, AttachFile
        )
        VALUES (
          '${empCode}',
          '${payableMonth}',
          '${r.category}',
          ${r.amount},
          '${r.startdate}',
          '${r.enddate}',
          '${r.description}',
          ${r.fileHex ? `CONVERT(varbinary(max), '0x${r.fileHex}', 1)` : "NULL"}
        );`
        )
        .join("");

      const res = await postRequest(ServerConfig.url, REPORTS, {
        dbname,
        query: insertSQL,
      });

      res.status === 200
        ? alert("Reimbursement saved successfully!")
        : alert("Failed to save data");
    } catch (err) {
      console.error(err);
      alert("Error saving reimbursement");
    }
  };

  return (
    <Box sx={{ display: "flex", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <CssBaseline />
      <Navbar />
      <Sidenav />

      <Box component="main" sx={{ flexGrow: 1, mt: 20, width: "100%" }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Container maxWidth="lg">
            <Box position="absolute" top={16} right={16}>
              <Button startIcon={<HelpOutline />} color="error">
                Help
              </Button>
            </Box>

            <Paper elevation={3} sx={{ p: 2 }}>
              <AppBar position="static" sx={{ mb: 2 }}>
                <Toolbar>
                  <Typography variant="h5">EMPLOYEE REIMBURSEMENT</Typography>
                </Toolbar>
              </AppBar>

              {/* ---------- Payable Month ---------- */}
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={3}>
                  <Typography variant="h6">Select Payable Month:</Typography>
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    type="date"
                    value={payableMonth}
                    onChange={(e) => setPayableMonth(e.target.value)}
                    sx={inputStyle}
                    error={errors.payableMonth}
                    helperText={errors.payableMonth && "Required"}
                  />
                </Grid>
              </Grid>

              {/* ---------- Rows Table ---------- */}
              <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table>
                  <TableHead sx={{ backgroundColor: "action.hover" }}>
                    <TableRow>
                      <TableCell>Category</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Start</TableCell>
                      <TableCell>End</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>File</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {rows.map((r, i) => (
                      <TableRow key={i}>
                        {/* Category */}
                        <TableCell>
                          <FormControl fullWidth error={errors.rows[i]?.category} sx={inputStyle}>
                            <InputLabel>Select Category</InputLabel>
                            <Select
                              value={r.category}
                              label="Select Category"
                              onChange={(e) =>
                                handleRowChange(i, "category", e.target.value)
                              }
                            >
                              <MenuItem value="category1">Category 1</MenuItem>
                              <MenuItem value="category2">Category 2</MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>

                        {/* Amount */}
                        <TableCell>
                          <TextField
                            fullWidth
                            type="number"
                            value={r.amount}
                            onChange={(e) => handleRowChange(i, "amount", e.target.value)}
                            error={errors.rows[i]?.amount}
                            sx={inputStyle}
                          />
                        </TableCell>

                        {/* Start Date */}
                        <TableCell>
                          <TextField
                            fullWidth
                            type="date"
                            value={r.startdate}
                            onChange={(e) => handleRowChange(i, "startdate", e.target.value)}
                            sx={inputStyle}
                            error={errors.rows[i]?.startdate}
                          />
                        </TableCell>

                        {/* End Date */}
                        <TableCell>
                          <TextField
                            fullWidth
                            type="date"
                            value={r.enddate}
                            onChange={(e) => handleRowChange(i, "enddate", e.target.value)}
                            sx={inputStyle}
                            error={errors.rows[i]?.enddate}
                          />
                        </TableCell>

                        {/* Description */}
                        <TableCell>
                          <TextField
                            fullWidth
                            value={r.description}
                            onChange={(e) =>
                              handleRowChange(i, "description", e.target.value)
                            }
                            sx={inputStyle}
                            error={errors.rows[i]?.description}
                          />
                        </TableCell>

                        {/* File */}
                        <TableCell>
                          <Button component="label" variant="outlined" fullWidth sx={inputStyle}>
                            File
                            <input
                              type="file"
                              hidden
                              onChange={(e) =>
                                handleRowChange(i, "attachments", e.target.files[0])
                              }
                            />
                          </Button>
                        </TableCell>

                        {/* Delete */}
                        <TableCell>
                          {i > 0 && (
                            <IconButton color="error" onClick={() => deleteRow(i)}>
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* ---------- Job & Employee ---------- */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={errors.job} sx={inputStyle}>
                    <InputLabel>Select Job</InputLabel>
                    <Select value={job} label="Select Job" onChange={(e) => setJob(e.target.value)}>
                      <MenuItem value="job1">Job 1</MenuItem>
                      <MenuItem value="job2">Job 2</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={errors.employee} sx={inputStyle}>
                    <InputLabel>Select Employee</InputLabel>
                    <Select
                      value={employee}
                      label="Select Employee"
                      onChange={(e) => setEmployee(e.target.value)}
                    >
                      <MenuItem value="employee1">Employee 1</MenuItem>
                      <MenuItem value="employee2">Employee 2</MenuItem>
                    </Select>
                  </FormControl>
                </Grid> */}
              </Grid>

              {/* ---------- Buttons ---------- */}
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button variant="contained" onClick={addRow}>
                  Add
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CheckCircle />}
                  onClick={handleSubmit}
                >
                  Save
                </Button>
              </Box>
            </Paper>
          </Container>
        </LocalizationProvider>
      </Box>
    </Box>
  );
};

export default ReimbursementForm2;
