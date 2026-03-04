// import React, { useState, useEffect } from 'react';
// import { Grid, Button, Typography, IconButton, Box,AppBar,Toolbar, Paper, TextField, FormControl } from '@mui/material';
// import AttachFileIcon from '@mui/icons-material/AttachFile';
// import DeleteIcon from '@mui/icons-material/Delete';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ExpandLessIcon from '@mui/icons-material/ExpandLess';
// import { ServerConfig } from "../../../serverconfiguration/serverconfig";
// import { getRequest, postRequest } from "../../../serverconfiguration/requestcomp";
// import { PAYMLEAVE, REPORTS, SAVE } from "../../../serverconfiguration/controllers";
// import Sidenav from "../../Home Page3/Sidenav2";
// import Navbar from "../../Home Page3/Navbar2";
// import { toast } from 'react-toastify';


  
// const LeaveapplyHr2 = () => {
//   const [type, setType] = useState("");
//   const [paymLeave, setPaymLeave] = useState([]);
//   const [formData, setFormData] = useState({
//     leaveType: '',
//     fromDate: '',
//     toDate: '',
//     reason: '',
//     attachedFile: '',
//     days: 0,
//   });
//   const[isloggedin, setisloggedin] = useState(sessionStorage.getItem("user"))
//   const [errors, setErrors] = useState({});
//   const [showText, setShowText] = useState(false);
//   const [employee, setemployee] = useState([])
//   const[leaveCode, setLeaveCode] = useState([])
//   const[LeaveId, setLeaveId] = useState([])
//   const dbname = sessionStorage.getItem("databaseName");

//   const calculateDays = (fromDate, toDate) => {
//     if (fromDate && toDate) {
//       const startDate = new Date(fromDate);
//       const endDate = new Date(toDate);
//       const timeDiff = endDate - startDate;
//       const daysDiff = timeDiff / (1000 * 3600 * 24);
//       return daysDiff + 1; // Including both start and end dates
//     }
//     return 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevFormData) => {
//       const updatedFormData = { ...prevFormData, [name]: value };
  
//       if (name === 'fromDate' || name === 'toDate') {
//         updatedFormData.days = calculateDays(updatedFormData.fromDate, updatedFormData.toDate);
//       }
  
//       return updatedFormData;
//     });
//   };
  

//   useEffect(() => {
//     async function getData() {
//       try {
       
       
//         const employeedata = await postRequest(ServerConfig.url, REPORTS, {
//           "query" :` select * from [${dbname}].[dbo].[paym_Employee] where EmployeeCode = '${isloggedin}'`
//         })
       
//         setemployee(employeedata.data)
        
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     }
//     getData();
   
//   }, [isloggedin]);

//   useEffect(() => {
//     async function getpaymleavedata() {
//        if (employee.length > 0){

//         const paymleave1 = await postRequest (ServerConfig.url, REPORTS, {
//           query : `select * from [${dbname}].[dbo].[paym_leave] where pn_CompanyID = ${employee[0].pn_CompanyID} and  pn_BranchID = ${employee[0].pn_BranchID}`
//         })
//         setPaymLeave(paymleave1.data)

//        }
//     }
//     getpaymleavedata()
//   }, [employee])

 
//   useEffect(() => {
//     async function getleavedata() {
//       if (formData.leaveType && employee.length > 0) {
//         try {
//           const leavecode1 = await postRequest(ServerConfig.url, REPORTS, {
//             query: `select pn_leaveCode from [${dbname}].[dbo].[paym_leave] where v_leaveName = '${formData.leaveType}' and pn_CompanyID = ${employee[0].pn_CompanyID} and pn_BranchID = ${employee[0].pn_BranchID}`
//           });
  
//           setLeaveCode(leavecode1.data); // Correctly update state
//           console.log(leavecode1.data)

//           const LeaveId1 = await postRequest(ServerConfig.url, REPORTS, {
//             query : `SELECT pn_leaveID FROM [${dbname}].[dbo].[paym_leave] where v_leaveName = '${formData.leaveType}' and pn_CompanyID = ${employee[0].pn_CompanyID} and pn_BranchID = ${employee[0].pn_BranchID}`
//           })
//           setLeaveId(LeaveId1.data);
//           console.log(LeaveId1.data)
//         } catch (error) {
//           console.error("Error fetching leave code:", error);
//         }
//       }
//     }
  
//     getleavedata();
//   }, [formData.leaveType, employee]); // Runs when formData.leaveType or employee changes
  
  

//   useEffect(()=> {
//     console.log('LeaveData' , paymLeave)
//     console.log('Employee', employee)
   
//   },[paymLeave, employee, leaveCode])

//   const handleFileChange = (e) => {
//     setFormData({ ...formData, attachedFile: e.target.files[0] });
//   };

//   const handleFileRemove = () => {
//     setFormData({ ...formData, attachedFile: null });
//   };

//   const validate = () => {
//     let tempErrors = {};
//     tempErrors.leaveType = formData.leaveType ? "" : "This field is required.";
//     tempErrors.fromDate = formData.fromDate ? "" : "This field is required.";
//     tempErrors.toDate = formData.toDate ? "" : "This field is required.";
//     tempErrors.reason = formData.reason ? "" : "This field is required.";
//     setErrors(tempErrors);

//     return Object.values(tempErrors).every(x => x === "");
//   };

//   const handleClear = () => {
//   setFormData({
//     leaveType: '',
//     fromDate: '',
//     toDate: '',
//     reason: '',
//     attachedFile: '',
//     days: 0,
//   });
//   setErrors({});
// };

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   if (validate()) {
//     try {
//       // 👉 Step 1: Check if any leave already exists for the given date range
//       const checkQuery = `
//         SELECT COUNT(*) AS cnt 
//         FROM [${dbname}].[dbo].[leave_apply]  
//         WHERE pn_EmployeeID = ${employee[0].pn_EmployeeID}
//           AND (
//             (from_date <= '${formData.toDate}' AND to_date >= '${formData.fromDate}')
//           )
//       `;

//       const checkResponse = await postRequest(ServerConfig.url, REPORTS, { query: checkQuery });
//       const existingCount = checkResponse.data[0].cnt;

//       if (existingCount > 0) {
//         toast.error("Only one leave is allowed per day!", {
//           position: "top-center",
//           autoClose: 3000,
//         });
//         return; // ❌ stop here
//       }

//       // 👉 Step 2: Convert file to HEX if attached
//       let fileHex = null;
//       if (formData.attachedFile) {
//         const arrayBuffer = await formData.attachedFile.arrayBuffer();
//         const binary = new Uint8Array(arrayBuffer);
//         fileHex = Array.from(binary, (b) =>
//           b.toString(16).padStart(2, "0")
//         ).join("");
//       }

//       // 👉 Step 3: Insert new leave (only if no overlap found)
//       const query = `
//         INSERT INTO [${dbname}].[dbo].[leave_apply]  (
//           [pn_CompanyID],[pn_BranchID],[pn_EmployeeID],[Emp_code],[Emp_name],
//           [pn_LeaveID],[pn_Leavename],[pn_leavecode],
//           [from_date],[from_status],[to_date],[status],
//           [days],[reason],[submitted_date],[approve],
//           [reminder],[priority],[comments],[record],[flag],[yearend],[attachfile]
//         )
//         VALUES (
//           ${employee[0].pn_CompanyID},${employee[0].pn_BranchID},${employee[0].pn_EmployeeID},
//           '${employee[0].EmployeeCode}','${employee[0].Employee_Full_Name}',
//           ${LeaveId[0].pn_leaveID},'${formData.leaveType}','${leaveCode[0].pn_leaveCode}',
//           '${formData.fromDate}','P','${formData.toDate}','P',
//           ${formData.days},'${formData.reason}',GETDATE(),
//           'Pending',GETDATE(),'NULL','None','NULL','N',NULL,
//           ${
//             fileHex
//               ? `CONVERT(varbinary(max), '0x${fileHex}', 1)`
//               : "NULL"
//           }
//         );
//       `;

//       const response = await postRequest(ServerConfig.url, SAVE, { query });

//       if (response.status === 200) {
//         toast.success("Leave applied successfully!", {
//           position: "top-center",
//           autoClose: 2000,
//         });
//         handleClear();
//       } else {
//         toast.error("Failed to save leave", { position: "top-center" });
//       }
//     } catch (error) {
//       console.error("Error submitting data:", error);
//       toast.error("An error occurred while saving data", {
//         position: "top-center",
//       });
//     }
//   }
// };

//   const toggleTextVisibility = () => {
//     setShowText(!showText);
//   };

//   return (
//     <Grid container>
//     <Grid item xs={12}>
//       <div style={{ backgroundColor: "#f5f5f5" }}>
//         <Navbar />
//         <Box height={30} />
//         <Box sx={{ display: "flex" }}>
//           <Sidenav />
//           {/* Main Content */}
//           <Grid
//                            item
//                            xs={12}
//                            sm={10}
//                            md={9}
//                            lg={8}
//                            xl={7}
//                           style={{ margin: "0 auto", padding: "20px" }}  
//                            >       
           
//        <AppBar position="sticky" color="default" elevation={2} sx={{ backgroundColor: '#0077d4',color: 'white', marginTop:"35px",  width: '93%', // Set your desired width here
//     marginLeft: 'auto', // Center the AppBar
//     marginRight: 'auto'  }}>
//               <Toolbar sx={{ justifyContent: 'center' }}>
//                 <Typography
//                   variant="h5"
//                   component="div"
//                   sx={{ fontWeight: 'bold', textAlign: 'left', flexGrow: 1 }}
//                 >
//                   LEAVE APPLY
//                 </Typography>
               
//               </Toolbar>
//             </AppBar>
      

//       <form onSubmit={handleSubmit}>
//          <Paper elevation={3} style={{ padding: '30px', maxWidth: '800px', margin: 'auto', backgroundColor: '#ffffff' }}>
//         <Grid container spacing={3}>
//           {/* Leave Type */}
//           <Grid item xs={12} sm={4}>
//   <FormControl fullWidth>
//     <select
//       name="leaveType" // This should match the key in formData
//       value={formData.leaveType} // Value is directly bound to the formData.leaveType
//       onChange={handleChange} // Update the state when a selection is made
//       style={{ height: "50px" }}
//     >
//       <option value="">Select Leave</option>
//       {paymLeave.map((leave, index) => (
//         <option key={index} value={leave.v_leaveName}>
//           {leave.v_leaveName}
//         </option>
//       ))}
//     </select>
//   </FormControl>
// </Grid>

//           {/* From Date */}
//           <Grid item xs={12} sm={4}>
//             <TextField
//               label="From date"
//               name="fromDate"
//               type="date"
//               fullWidth
//               InputLabelProps={{
//                 shrink: true,
//               }}
//               value={formData.fromDate}
//               onChange={handleChange}
//               error={Boolean(errors.fromDate)}
//               helperText={errors.fromDate}
//               required
//                sx={{
   
//     '& .MuiInputBase-root': {
//       backgroundColor: '#white', // light gray background
//     },
//     '& label': {
//       color: '#666', // default label color (gray)
//     },
//     '&:hover .MuiInputLabel-root': {
//       color: 'black', // label color black on hover
//     },
//     '& .Mui-focused .MuiInputLabel-root': {
//       color: 'black', // label color black on focus
//     },
//     '& .MuiOutlinedInput-root': {
//       '& fieldset': {
//         borderColor: '#ccc', // default border color
//       },
//       '&:hover fieldset': {
//         borderColor: 'black', // border color black on hover
//       },
//       '&.Mui-focused fieldset': {
//         borderColor: 'black', // border color black on focus
//       },
//     },
//   }}
//             />
//           </Grid>

//           {/* To Date */}
//           <Grid item xs={12} sm={4}>
//             <TextField
//               label="To date"
//               name="toDate"
//               type="date"
//               fullWidth
//               InputLabelProps={{
//                 shrink: true,
//               }}
//               value={formData.toDate}
//               onChange={handleChange}
//               error={Boolean(errors.toDate)}
//               helperText={errors.toDate}
//               required
//                sx={{
   
//     '& .MuiInputBase-root': {
//       backgroundColor: '#white', // light gray background
//     },
//     '& label': {
//       color: '#666', // default label color (gray)
//     },
//     '&:hover .MuiInputLabel-root': {
//       color: 'black', // label color black on hover
//     },
//     '& .Mui-focused .MuiInputLabel-root': {
//       color: 'black', // label color black on focus
//     },
//     '& .MuiOutlinedInput-root': {
//       '& fieldset': {
//         borderColor: '#ccc', // default border color
//       },
//       '&:hover fieldset': {
//         borderColor: 'black', // border color black on hover
//       },
//       '&.Mui-focused fieldset': {
//         borderColor: 'black', // border color black on focus
//       },
//     },
//   }}
//             />
//           </Grid>

//           {/* Reason */}
//           <Grid item xs={12}>
//             <TextField
//               label="Reason"
//               name="reason"
//               value={formData.reason}
//               onChange={handleChange}
//               fullWidth
//               multiline
//               rows={3}
//               error={Boolean(errors.reason)}
//               helperText={errors.reason}
//               required
//                sx={{
   
//     '& .MuiInputBase-root': {
//       backgroundColor: '#white', // light gray background
//     },
//     '& label': {
//       color: '#666', // default label color (gray)
//     },
//     '&:hover .MuiInputLabel-root': {
//       color: 'black', // label color black on hover
//     },
//     '& .Mui-focused .MuiInputLabel-root': {
//       color: 'black', // label color black on focus
//     },
//     '& .MuiOutlinedInput-root': {
//       '& fieldset': {
//         borderColor: '#ccc', // default border color
//       },
//       '&:hover fieldset': {
//         borderColor: 'black', // border color black on hover
//       },
//       '&.Mui-focused fieldset': {
//         borderColor: 'black', // border color black on focus
//       },
//     },
//   }}
//             />
//           </Grid>

//           {/* Attach File Icon and Text */}
//           <Grid item xs={12}>
//             <Box display="flex" alignItems="center" flexWrap="wrap">
//               <input
//                 accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
//                 type="file"
//                 onChange={handleFileChange}
//                 style={{ display: 'none' }}
//                 id="fileInput"
//               />
//               <label htmlFor="fileInput" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
//                 <AttachFileIcon color="primary" />
//                 <Typography variant="body2" color="primary" style={{ marginLeft: '5px' }}>
//                   {formData.attachedFile ? formData.attachedFile.name : 'Attach File'}
//                 </Typography>
//               </label>
//               {formData.attachedFile && (
//                 <IconButton color="secondary" onClick={handleFileRemove} style={{ marginLeft: '10px' }}>
//                   <DeleteIcon />
//                 </IconButton>
//               )}
//               <Typography variant="caption" color="textSecondary" style={{ marginTop: '5px', marginLeft: '10px' }}>
//                 File Types: pdf, doc, docx, jpg, jpeg, png
//               </Typography>
//             </Box>
//           </Grid>

//           {/* Submit and Cancel Buttons */}
//           <Grid item xs={12} display="flex" justifyContent="flex-end">
//             <Button variant="contained" color="primary" type="submit" style={{ marginRight: '10px' }}>
//               Submit
//             </Button>
//          {/* <Button variant="contained" color="error" onClick={handleClear}>
//   Clear
// </Button> */}

//           </Grid>
//         </Grid>
//         </Paper>
//       </form>
   
//     </Grid>
//     </Box>
//     </div>
//     </Grid>
//     </Grid>

//   );
// };

// export default LeaveapplyHr2;











// // src/pages/LeaveApply/LeaveApplyForm.js
// import React, { useState, useEffect } from "react";
// import { postRequest } from "../../../serverconfiguration/requestcomp";
// import { ServerConfig } from "../../../serverconfiguration/serverconfig";
// import { REPORTS } from "../../../serverconfiguration/controllers";
// import {
//   Grid, Paper, TextField, Button, Select, MenuItem, FormControl, InputLabel, Typography
// } from "@mui/material";
// import { applyLeave } from "./leaveService";

// const LeaveApplyForm = () => {
//   const isloggedin = sessionStorage.getItem("user");
//   const db = sessionStorage.getItem("databaseName");
//   const [employee, setEmployee] = useState(null);
//   const [paymLeave, setPaymLeave] = useState([]);
//   const [form, setForm] = useState({
//     leaveType: "",
//     fromDate: "",
//     toDate: "",
//     reason: "",
//     attachedFile: null,
//     days: 0
//   });

//   useEffect(() => {
//     async function loadEmployee() {
//       const res = await postRequest(ServerConfig.url, REPORTS, {
//         query: `SELECT * FROM [${db}].[dbo].[paym_Employee] WHERE EmployeeCode='${isloggedin}'`
//       });
//       setEmployee(res.data[0] || null);
//     }
//     loadEmployee();
//   }, [isloggedin]);

//   useEffect(() => {
//     async function loadLeaves() {
//       if (!employee) return;
//       const res = await postRequest(ServerConfig.url, REPORTS, {
//         query: `SELECT * FROM [${db}].[dbo].[paym_leave] WHERE pn_CompanyID = ${employee.pn_CompanyID} AND pn_BranchID = ${employee.pn_BranchID}`
//       });
//       setPaymLeave(res.data || []);
//     }
//     loadLeaves();
//   }, [employee]);

//   const calcDays = (fromDate, toDate) => {
//     if (!fromDate || !toDate) return 0;
//     const d1 = new Date(fromDate);
//     const d2 = new Date(toDate);
//     return Math.floor((d2 - d1) / (1000*3600*24)) + 1;
//   };

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === "attachedFile") {
//       setForm(f => ({ ...f, attachedFile: files[0] }));
//     } else {
//       setForm(f => ({ ...f, [name]: value, days: name === "fromDate" || name === "toDate" ? calcDays(name === "fromDate" ? value : f.fromDate, name === "toDate" ? value : f.toDate) : f.days }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!employee) return;
//     // convert file to hex if provided
//     let hex = null;
//     if (form.attachedFile) {
//       const ab = await form.attachedFile.arrayBuffer();
//       const arr = new Uint8Array(ab);
//       hex = Array.from(arr, b => b.toString(16).padStart(2,"0")).join("");
//     }

//     // find leave meta
//     const leaveMeta = paymLeave.find(l => l.v_leaveName === form.leaveType);
//     if (!leaveMeta) return alert("Select valid leave");

//     const payload = {
//       pn_CompanyID: employee.pn_CompanyID,
//       pn_BranchID: employee.pn_BranchID,
//       pn_EmployeeID: employee.pn_EmployeeID,
//       Emp_code: employee.EmployeeCode,
//       Emp_name: employee.Employee_Full_Name,
//       pn_LeaveID: leaveMeta.pn_leaveID,
//       pn_Leavename: leaveMeta.v_leaveName,
//       pn_leavecode: leaveMeta.pn_leaveCode,
//       fromDate: form.fromDate,
//       toDate: form.toDate,
//       days: form.days || calcDays(form.fromDate, form.toDate),
//       reason: form.reason.replace(/'/g, "''"),
//       fileHex: hex
//     };

//     try {
//       await applyLeave(payload);
//       alert("Leave applied. Pending approval.");
//       setForm({ leaveType: "", fromDate: "", toDate: "", reason: "", attachedFile: null, days: 0 });
//     } catch (err) {
//       console.error(err);
//       alert("Failed to apply");
//     }
//   };

//   return (
//     <Paper style={{ padding: 20, maxWidth: 900, margin: "auto" }}>
//       <Typography variant="h6">Apply Leave</Typography>
//       <form onSubmit={handleSubmit}>
//         <Grid container spacing={2}>
//           <Grid item xs={12} sm={4}>
//             <FormControl fullWidth>
//               <InputLabel>Leave Type</InputLabel>
//               <Select name="leaveType" value={form.leaveType} onChange={handleChange}>
//                 <MenuItem value="">Select</MenuItem>
//                 {paymLeave.map(l => <MenuItem value={l.v_leaveName} key={l.pn_leaveID}>{l.v_leaveName}</MenuItem>)}
//               </Select>
//             </FormControl>
//           </Grid>

//           <Grid item xs={12} sm={4}>
//             <TextField label="From" name="fromDate" type="date" onChange={handleChange} InputLabelProps={{ shrink: true }} fullWidth />
//           </Grid>

//           <Grid item xs={12} sm={4}>
//             <TextField label="To" name="toDate" type="date" onChange={handleChange} InputLabelProps={{ shrink: true }} fullWidth />
//           </Grid>

//           <Grid item xs={12}>
//             <TextField label="Reason" name="reason" multiline rows={3} value={form.reason} onChange={handleChange} fullWidth />
//           </Grid>

//           <Grid item xs={12}>
//             <input name="attachedFile" type="file" onChange={handleChange} />
//           </Grid>

//           <Grid item xs={12} style={{ textAlign: "right" }}>
//             <Button variant="contained" color="primary" type="submit">Submit</Button>
//           </Grid>
//         </Grid>
//       </form>
//     </Paper>
//   );
// };

// export default LeaveApplyForm;







import React, { useState, useEffect } from "react";
import {
  Grid, Button, Typography, IconButton, Box, AppBar, Toolbar,
  Paper, TextField, FormControl
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteIcon from "@mui/icons-material/Delete";
import Sidenav from "../../Home Page3/Sidenav2";
import Navbar from "../../Home Page3/Navbar2";
import { toast } from "react-toastify";

import { postRequest } from "../../../serverconfiguration/requestcomp";
import { ServerConfig } from "../../../serverconfiguration/serverconfig";
import { REPORTS } from "../../../serverconfiguration/controllers";
import { applyLeave } from "./leaveService";

const LeaveApplyForm = () => {
  const isloggedin = sessionStorage.getItem("user");
  const db = sessionStorage.getItem("databaseName");

  const [employee, setEmployee] = useState([]);
  const [paymLeave, setPaymLeave] = useState([]);
  const [leaveCode, setLeaveCode] = useState([]);
  const [leaveId, setLeaveId] = useState([]);

  const [formData, setFormData] = useState({
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
    attachedFile: null,
    days: 0,
  });

  const [errors, setErrors] = useState({});

  /** ===========================
   * FETCH LOGGED EMPLOYEE
   * =========================== */
  useEffect(() => {
    async function getEmployee() {
      const res = await postRequest(ServerConfig.url, REPORTS, {
        query: `SELECT * FROM [${db}].[dbo].[paym_Employee] WHERE EmployeeCode='${isloggedin}'`,
      });
      setEmployee(res.data);
    }
    getEmployee();
  }, [isloggedin]);

  /** ===========================
   * FETCH AVAILABLE LEAVE TYPES
   * =========================== */
  useEffect(() => {
    async function getLeaveMaster() {
      if (employee.length === 0) return;

      const res = await postRequest(ServerConfig.url, REPORTS, {
        query: `
          SELECT * FROM [${db}].[dbo].[paym_leave]
          WHERE pn_CompanyID=${employee[0].pn_CompanyID}
          AND pn_BranchID=${employee[0].pn_BranchID}
        `,
      });

      setPaymLeave(res.data);
    }
    getLeaveMaster();
  }, [employee]);

  /** ===========================
   * FETCH LEAVE CODE + LEAVE ID
   * =========================== */
  useEffect(() => {
    async function fetchMetadata() {
      if (!formData.leaveType || employee.length === 0) return;

      const codeRes = await postRequest(ServerConfig.url, REPORTS, {
        query: `
          SELECT pn_leaveCode FROM [${db}].[dbo].[paym_leave]
          WHERE v_leaveName='${formData.leaveType}'
          AND pn_CompanyID=${employee[0].pn_CompanyID}
          AND pn_BranchID=${employee[0].pn_BranchID}
        `,
      });

      const idRes = await postRequest(ServerConfig.url, REPORTS, {
        query: `
          SELECT pn_leaveID FROM [${db}].[dbo].[paym_leave]
          WHERE v_leaveName='${formData.leaveType}'
          AND pn_CompanyID=${employee[0].pn_CompanyID}
          AND pn_BranchID=${employee[0].pn_BranchID}
        `,
      });

      setLeaveCode(codeRes.data);
      setLeaveId(idRes.data);
    }

    fetchMetadata();
  }, [formData.leaveType, employee]);

  /** ===========================
   * DAYS CALCULATION
   * =========================== */
  const calculateDays = (fromDate, toDate) => {
    if (!fromDate || !toDate) return 0;
    const d1 = new Date(fromDate);
    const d2 = new Date(toDate);
    return (d2 - d1) / (1000 * 3600 * 24) + 1;
  };

  /** ===========================
   * HANDLE FORM CHANGE
   * =========================== */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => {
      let updated = { ...prev, [name]: value };

      if (name === "attachedFile") {
        updated.attachedFile = files[0];
      }

      if (name === "fromDate" || name === "toDate") {
        updated.days = calculateDays(
          name === "fromDate" ? value : prev.fromDate,
          name === "toDate" ? value : prev.toDate
        );
      }

      return updated;
    });
  };

  /** ===========================
   * VALIDATION
   * =========================== */
  const validate = () => {
    const temp = {};

    temp.leaveType = formData.leaveType ? "" : "Required";
    temp.fromDate = formData.fromDate ? "" : "Required";
    temp.toDate = formData.toDate ? "" : "Required";
    temp.reason = formData.reason ? "" : "Required";

    setErrors(temp);
    return Object.values(temp).every((x) => x === "");
  };

  /** ===========================
   * SUBMIT HANDLER
   * =========================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      let hex = null;
      if (formData.attachedFile) {
        const buffer = await formData.attachedFile.arrayBuffer();
        hex = [...new Uint8Array(buffer)]
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
      }

      const payload = {
        pn_CompanyID: employee[0].pn_CompanyID,
        pn_BranchID: employee[0].pn_BranchID,
        pn_EmployeeID: employee[0].pn_EmployeeID,
        Emp_code: employee[0].EmployeeCode,
        Emp_name: employee[0].Employee_Full_Name,
        pn_LeaveID: leaveId[0]?.pn_leaveID,
        pn_Leavename: formData.leaveType,
        pn_leavecode: leaveCode[0]?.pn_leaveCode,
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        days: formData.days,
        reason: formData.reason.replace(/'/g, "''"),
        fileHex: hex,
      };

      await applyLeave(payload);

      toast.success("Leave Applied Successfully!");
      setFormData({
        leaveType: "",
        fromDate: "",
        toDate: "",
        reason: "",
        attachedFile: null,
        days: 0,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to apply leave!");
    }
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Navbar />
        <Box height={30} />
        <Box sx={{ display: "flex" }}>
          <Sidenav />

          <Grid item xs={12} sm={10} md={9} lg={8} xl={7} style={{ margin: "0 auto", padding: "20px" }}>

            {/* ===== App Bar ===== */}
            <AppBar position="sticky" elevation={2} sx={{ backgroundColor: "#0077d4", marginTop: "35px" }}>
              <Toolbar>
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "white" }}>
                  LEAVE APPLY
                </Typography>
              </Toolbar>
            </AppBar>

            {/* ===== WHITE CARD ===== */}
            <Paper elevation={3} style={{ padding: "30px", maxWidth: "800px", margin: "auto", marginTop: "20px" }}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>

                  {/* Leave Type */}
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <select
                        name="leaveType"
                        value={formData.leaveType}
                        onChange={handleChange}
                        style={{ height: "50px" }}
                      >
                        <option value="">Select Leave</option>
                        {paymLeave.map((l, i) => (
                          <option key={i} value={l.v_leaveName}>
                            {l.v_leaveName}
                          </option>
                        ))}
                      </select>
                      {errors.leaveType && <span style={{ color: "red" }}>{errors.leaveType}</span>}
                    </FormControl>
                  </Grid>

                  {/* From Date */}
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="From Date"
                      name="fromDate"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={formData.fromDate}
                      onChange={handleChange}
                      error={!!errors.fromDate}
                      helperText={errors.fromDate}
                    />
                  </Grid>

                  {/* To Date */}
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="To Date"
                      name="toDate"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={formData.toDate}
                      onChange={handleChange}
                      error={!!errors.toDate}
                      helperText={errors.toDate}
                    />
                  </Grid>

                  {/* Reason */}
                  <Grid item xs={12}>
                    <TextField
                      label="Reason"
                      name="reason"
                      fullWidth
                      multiline
                      rows={3}
                      value={formData.reason}
                      onChange={handleChange}
                      error={!!errors.reason}
                      helperText={errors.reason}
                    />
                  </Grid>

                  {/* File Upload */}
                  <Grid item xs={12}>
                    <Box display="flex" alignItems="center">
                      <input
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        type="file"
                        name="attachedFile"
                        id="fileInput"
                        onChange={handleChange}
                        style={{ display: "none" }}
                      />
                      <label htmlFor="fileInput" style={{ cursor: "pointer" }}>
                        <AttachFileIcon color="primary" />
                        <Typography variant="body2" color="primary" sx={{ ml: 1 }}>
                          {formData.attachedFile ? formData.attachedFile.name : "Attach File"}
                        </Typography>
                      </label>

                      {formData.attachedFile && (
                        <IconButton onClick={() => setFormData({ ...formData, attachedFile: null })}>
                          <DeleteIcon color="error" />
                        </IconButton>
                      )}
                    </Box>
                  </Grid>

                  {/* Submit */}
                  <Grid item xs={12} textAlign="right">
                    <Button variant="contained" color="primary" type="submit">
                      Submit
                    </Button>
                  </Grid>

                </Grid>
              </form>
            </Paper>

          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default LeaveApplyForm;


