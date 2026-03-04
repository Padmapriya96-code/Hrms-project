// import React, { useEffect, useState } from 'react';
// import { AppBar, Toolbar } from '@mui/material';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   TextField,
//   Button,
//   IconButton,
//   Tooltip,
//   Typography,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
//   Grid,
//   Box,
//   CircularProgress,
// } from '@mui/material';
// import nodata from '../../../images/NoDataImage.jpeg';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import { blue, green, purple, red } from '@mui/material/colors';
// import Sidenav from "../../Home Page/Sidenav";
// import Navbar from "../../Home Page/Navbar";
// import { postRequest } from '../../../serverconfiguration/requestcomp';
// import { ServerConfig } from '../../../serverconfiguration/serverconfig';
// import { REPORTS } from '../../../serverconfiguration/controllers';
// // import { Document, Page } from 'react-pdf'; // react-pdf package

// const EmployeeReimbursement = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [openDialog, setOpenDialog] = useState(false);
//   const [openEditDialog, setOpenEditDialog] = useState(false);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [editedEmployee, setEditedEmployee] = useState(null);
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const orange = '#FFA500'; // Define the color
//   const [employeeImages, setEmployeeImages] = useState({}); // State to store images
//   const databaseName = sessionStorage.getItem("databaseName");

//   // Fetch Data
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         // Fetch employee reimbursements
//         const response = await postRequest(ServerConfig.url, REPORTS, {
//           query: `SELECT * FROM [${databaseName}].[dbo].[paym_Reimbursement];`,
//         });
  
//         if (response?.data) {
//           const processedData = response.data.map((row) => ({
//             employeeName: row.employee,
//             date: row.start_date,
//             enddate: row.end_date,
//             reimburseCategory: row.category,
//             employeeReimburseAmount: row.amount,
//             totalAmountApproved: row.Total_Amount_approved,
//             status: row.Status,
//             id: row.id,
//             description: row.description,
//           }));
  
//           // Fetch employee images after employee data is fetched
//           await fetchEmployeeImages(processedData);
  
//           // Sort employees by status
//           processedData.sort((a, b) => {
//             if (a.status === 'Pending' && b.status !== 'Pending') return -1;
//             if (a.status !== 'Pending' && b.status === 'Pending') return 1;
//             return 0;
//           });
  
//           setEmployees(processedData); // Set the employee data
//         }
//       } catch (error) {
//         console.error('Failed to fetch data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     fetchData(); // Fetch the data
//   }, []);

//   const fetchEmployeeImages = async (employees) => {
//     // Get employee IDs from the employee list
//     const employeeIds = employees.map((employee) => employee.id).join(',');
  
//     try {
//       const query = `
//         SELECT id, attachments 
//         FROM [${databaseName}].[dbo].[paym_Reimbursement] 
//         WHERE id IN (${employeeIds});
//       `;
  
//       // Make a request to fetch image data from the server
//       const response = await postRequest(ServerConfig.url, REPORTS, { query });
  
//       if (response.status === 200) {
//         // Prepare an object to map employee IDs to image data
//         const images = {};
//         response.data.forEach((item) => {
//           images[item.id] = item.attachments; // Store the image data by employee ID
//         });
//         setEmployeeImages(images); // Update the state with the fetched images
//       }
//     } catch (error) {
//       console.error('Error fetching employee images:', error);
//     }
//   };
  
  

//   const getImageSrc = (employeeId) => {
//     // Get the image or file data based on employee ID
//     const fileData = employeeImages[employeeId];
  
//     if (!fileData) return nodata;
  
//     // Check if the file is a PDF
//     const isPDF = fileData.startsWith('%PDF');  // PDF files start with '%PDF'
  
//     if (isPDF) {
//       return null; // Return null for PDF, we'll handle it separately
//     } else {
//       return `data:image/jpeg;base64,${fileData}`; // Default to image display
//     }
//   };

//   const renderFile = (employeeId) => {
//     const fileData = employeeImages[employeeId];
  
//     if (!fileData) return null;
  
//     const isPDF = fileData.startsWith('%PDF');
  
//     if (isPDF) {
//       // Create a data URL for the PDF file
//       const fileUrl = `data:application/pdf;base64,${fileData}`;
  
//       return (
//         <Box style={{ width: '100%', height: 'auto' }}>
//           <Typography variant="body1">
//             This is a PDF file. You can download it using the button below.
//           </Typography>
          
//           {/* Button to download the PDF */}
//           <Button variant="contained" color="primary">
//             <a href={fileUrl} download={`employee_${employeeId}_reimbursement.pdf`} style={{ textDecoration: 'none', color: 'white' }}>
//               Download PDF
//             </a>
//           </Button>
//         </Box>
//       );
//     } else {
//       // For image files, render the image
//       return <img src={`data:image/jpeg;base64,${fileData}`} alt="Employee" width={800} height={800} />;
//     }
//   };
//   // Handlers
//   const handleSearchChange = (event) => setSearchTerm(event.target.value);

//   const filteredEmployees = employees.filter((employee) =>
//     ['employeeName', 'reimburseCategory', 'employeeReimburseAmount', 'status', 'totalAmountApproved']
//       .some((key) => employee[key]?.toString().toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   const handleOpenDialog = (employee) => {
//     setSelectedEmployee(employee);
//     console.log("Attachments in varbinary format:", employee.attachments);    setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setSelectedEmployee(null);
//   };

//   const handleOpenEditDialog = (employee) => {
//     setEditedEmployee(employee);
//     setOpenEditDialog(true);
//   };

//   const handleCloseEditDialog = () => {
//     setOpenEditDialog(false);
//     setEditedEmployee(null);
//   };
// // Modify handleEditChange to update 'totalAmountApproved' automatically when status is 'Approved'
// const handleEditChange = (event) => {
//   const { name, value } = event.target;

//   setEditedEmployee((prev) => {
//     let updatedData = { ...prev, [name]: value };

//     // Automatically update 'Total Amount Approved' if status is 'Approved'
//     if (name === "status" && value === "Approved") {
//       updatedData.totalAmountApproved = prev.employeeReimburseAmount;
//     }

//     return updatedData;
//   });
// };
//   const handleDelete = async (employee) => {
//     if (window.confirm(`Are you sure you want to delete this reimbursement?`)) {
//       try {
//         const response = await postRequest(ServerConfig.url, REPORTS, {
//           query: `DELETE FROM [${databaseName}].[dbo].[paym_Reimbursement]WHERE id=${employee.id}`,
//         });
//         if (response?.success) {
//           setEmployees((prev) => prev.filter((emp) => emp.id !== employee.id));
//         }
//       } catch (error) {
//         console.error("Failed to delete reimbursement:", error);
//       }
//     }
//   };
  

//   const handleSaveEdit = async () => {
//     try {
//       const response = await postRequest(ServerConfig.url, REPORTS, {
//         query: `UPDATE [${databaseName}].[dbo].[paym_Reimbursement] SET 
//           category='${editedEmployee.reimburseCategory}', 
//           amount=${editedEmployee.employeeReimburseAmount}, 
//           description='${editedEmployee.description}', 
//           status='${editedEmployee.status}',
//           total_amount_approved=${editedEmployee.totalAmountApproved || 'NULL'}
//           WHERE id=${editedEmployee.id}`,
//       });
  
//       if (response?.success) {
//         setEmployees((prev) =>
//           prev.map((emp) => (emp.id === editedEmployee.id ? editedEmployee : emp))
//         );
//         handleCloseEditDialog();
//       }
//     } catch (error) {
//       console.error("Failed to save edited employee:", error);
//     }
//   };
  
  

 
// const formatDate = (date) => {
//   const newDate = new Date(date);
//   const day = newDate.getDate().toString().padStart(2, '0');
//   const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
//   const year = newDate.getFullYear();
//   return `${day}-${month}-${year}`;
// };

//   return (
//     <Grid container sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
//       <Navbar />
//       <Box height={30} />
//       <Grid container>
//         <Sidenav />
//         <Grid item xs={12} sm={10} md={9} lg={8} xl={7} sx={{ margin: '100px auto' }}>
          
//            <AppBar
//       position="static"
//       elevation={1}
//       sx={{
//         backgroundColor: '#0077d4',
//         color: 'white', // neutral dark text
//       }}
//     >
//       <Toolbar sx={{ minHeight: 64, px: { xs: 2, sm: 3, md: 6 } }}>
//         <IconButton
//           edge="start"
//           color="inherit"
//           aria-label="reimbursement icon"
//           sx={{ mr: 2 }}
//           disableRipple
//         >
         
//         </IconButton>
        
//         <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
//           EMPLOYEE REIMBURSEMENT FOR APPROVAL
//         </Typography>
//       </Toolbar>
//     </AppBar>
//         <Box
//       sx={{
//         border: '1px solid lightgray',
//        backgroundColor:"white",
//         p: 1,
//         display: 'inline-block',
//          width: '1006px',
//       }}
     
//     >
//       <Box >
//         <TextField
//           label="Search"
//           value={searchTerm}
//           onChange={handleSearchChange}
//           fullWidth
//           variant="outlined"
//           aria-label="Search input"
         
//           sx={{
//       width: '380px',
//       marginRight: "600px",
//       "& .MuiInputLabel-root": {
//         color: "black",
//       },
//       "& .MuiInputLabel-root.Mui-focused": {
//         color: "black",
//       },
//       "& .MuiOutlinedInput-root": {
//         backgroundColor: "#fff",
//         borderRadius: "10px",
//         "& fieldset": {
//           borderWidth: "2px",
//           borderRadius: "8px",
//         },
//         "&:hover fieldset": {
//           borderColor: "black",
//         },
//         "&.Mui-focused fieldset": {
//           borderColor: "black",
//         },
//         "&.Mui-error fieldset": {
//           borderColor: "black",
//         },
//       },
//       "& .MuiFormHelperText-root": {
//         color: "black",
//       },
//     }}
//         />
//       </Box>
//     </Box>
//           <TableContainer component={Paper}>
//   <Table>
//    <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
//   <TableRow>
//     <TableCell sx={{ width: '150px', lineHeight: '1.2', fontSize: '0.875rem', padding: '3px' }}>EMPLOYEE NAME</TableCell>
//     <TableCell sx={{ width: '150px', lineHeight: '1.2', fontSize: '0.875rem', marginLeft: '10px' }}>START DATE</TableCell>
//     <TableCell sx={{ width: '150px', lineHeight: '1.2', fontSize: '0.875rem', marginLeft: '3px' }}>END DATE</TableCell>
//     <TableCell sx={{ width: '150px', lineHeight: '1.2', fontSize: '0.875rem', padding: '3px' }}>REIMBURSE CATEGORY</TableCell>
//     <TableCell sx={{ width: '150px', lineHeight: '1.2', fontSize: '0.875rem', padding: '3px' }}>EMPLOYEE REIMBURSE AMOUNT</TableCell>
//     <TableCell sx={{ width: '150px', lineHeight: '1.2', fontSize: '0.875rem', padding: '3px' }}>TOTAL AMOUNT APPROVED</TableCell>
//     <TableCell sx={{ width: '150px', lineHeight: '1.2', fontSize: '0.875rem', marginLeft: '5px' }}>STATUS</TableCell>
//     <TableCell sx={{ width: '100px', lineHeight: '1.2', fontSize: '0.875rem', marginLeft: '15px' }}>ACTIONS</TableCell>
//   </TableRow>
// </TableHead>

//     <TableBody>
//       {filteredEmployees.length > 0 ? (
//         filteredEmployees.map((employee) => (
//           <TableRow key={employee.id}  sx={{ height: '20px' }}>
//             <TableCell sx={{padding: '2px', lineHeight: '2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
//               {employee.employeeName}
//             </TableCell>
//             <TableCell sx={{ padding: '2px', lineHeight: '2',whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
//               {formatDate(employee.date)}
//             </TableCell>
//             <TableCell sx={{ padding: '2px', lineHeight: '2',whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
//               {formatDate(employee.enddate)}
//             </TableCell>
//             <TableCell sx={{padding: '2px', lineHeight: '2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
//               {employee.reimburseCategory}
//             </TableCell>
//             <TableCell sx={{padding: '2px', lineHeight: '2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
//               {employee.employeeReimburseAmount}
//             </TableCell>
//             <TableCell sx={{ padding: '2px', lineHeight: '2',whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
//               {employee.totalAmountApproved}
//             </TableCell>
//             <TableCell sx={{ padding: '2px', lineHeight: '2',}}>
//               <Typography
//                 sx={{
//                   color:
//                     employee.status === 'Approved'
//                       ? green[500]
//                       : employee.status === 'Rejected'
//                       ? red[500]
//                       : employee.status === 'Pending'
//                       ? orange[500]
//                       : 'inherit', // Default color
//                 }}
//               >
//                 {employee.status}
//               </Typography>
//             </TableCell>
//             <TableCell sx={{ padding: '2px', lineHeight: '2',}}>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//               <Tooltip title="View">
//                 <IconButton onClick={() => handleOpenDialog(employee)} sx={{ color: blue[400] }}>
//                   <VisibilityIcon />
//                 </IconButton>
//               </Tooltip>
//               <Tooltip title="Edit">
//                 <IconButton onClick={() => handleOpenEditDialog(employee)} sx={{ color: purple[400] }}>
//                   <EditIcon />
//                 </IconButton>
//               </Tooltip>
//               <Tooltip title="Delete">
//                 <IconButton onClick={() => handleDelete(employee)} sx={{ color: red[400] }}>
//                   <DeleteIcon />
//                 </IconButton>
//               </Tooltip>
//           </Box> 
//            </TableCell>
//           </TableRow>
//         ))
//       ) : (
//         <TableRow>
//           <TableCell colSpan={7} align="center">
//             {loading ? <CircularProgress /> : 'No records found'}
//           </TableCell>
//         </TableRow>
//       )}
//     </TableBody>
//   </Table>
// </TableContainer>

//         </Grid>
//       </Grid>

//       {/* View Dialog */}
//       <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
//         <DialogTitle>View Employee Reimbursement</DialogTitle>
//         <DialogContent>
//           {selectedEmployee && (
//             <Box>
//               <Typography><strong>Employee Name:</strong> {selectedEmployee.employeeName}</Typography>
//               <Typography><strong>Date:</strong> {formatDate(selectedEmployee.date)}</Typography>
// <Typography><strong>Date:</strong> {formatDate(selectedEmployee.enddate)}</Typography>

//               <Typography><strong>Category:</strong> {selectedEmployee.reimburseCategory}</Typography>
//               <Typography><strong>Amount:</strong> {selectedEmployee.employeeReimburseAmount}</Typography>
//               <Typography><strong>Total Amount Approved:</strong> {selectedEmployee.totalAmountApproved}</Typography> {/* Added */}
//               <Typography><strong>Description:</strong> {selectedEmployee.description}</Typography>
//   {/* Render the file based on its type (Image or PDF) */}
//   {renderFile(selectedEmployee.id)}
        
//         {/* If it's a PDF, add download button below the details */}
//         <Button variant="contained" color="primary" style={{ marginTop: '10px' }}>
//           <a href={`data:application/pdf;base64,${employeeImages[selectedEmployee.id]}`} 
//              download={`employee_${selectedEmployee.id}_reimbursement.pdf`} 
//              style={{ textDecoration: 'none', color: 'white' }}>
//             Download PDF
//           </a>
//           </Button>
//           </Box>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog} color="primary">Close</Button>
//         </DialogActions>
//       </Dialog>

//       {/* Edit Dialog */}
//       <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
//         <DialogTitle>Edit Employee Reimbursement</DialogTitle>
//         <DialogContent>
//           {editedEmployee && (
//             <Box component="form" sx={{ mt: 2 }}>
//               <TextField
//                 label="Category"
//                 name="reimburseCategory"
//                 value={editedEmployee.reimburseCategory}
//                 onChange={handleEditChange}
//                 fullWidth
//                 sx={{ mb: 2 }}
//               />
//               <TextField
//                 label="Amount"
//                 name="employeeReimburseAmount"
//                 value={editedEmployee.employeeReimburseAmount}
//                 onChange={handleEditChange}
//                 fullWidth
//                 sx={{ mb: 2 }}
//               />
//                 <TextField
//           label="Status"
//           name="status"
//           select
//           value={editedEmployee.status || 'Pending'}
//           onChange={handleEditChange}
//           fullWidth
//           sx={{ mb: 2 }}
//           SelectProps={{
//             native: true,
//           }}
//         >
//           <option value="Pending">Pending</option>
//           <option value="Approved">Approved</option>
//           <option value="Rejected">Rejected</option>
          
//         </TextField>
//                <TextField
//         label="Total Amount Approved" /* Added */
//         name="totalAmountApproved" /* New field */
//         value={editedEmployee.totalAmountApproved || ''} /* Safeguard null values */
//         onChange={handleEditChange}
//         fullWidth
//         sx={{ mb: 2 }}
//       />

//               <TextField
//                 label="Description"
//                 name="description"
//                 value={editedEmployee.description}
//                 onChange={handleEditChange}
//                 fullWidth
//                 multiline
//                 rows={3}
//                 sx={{ mb: 2 }}
//               />
              
//             </Box>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseEditDialog} color="primary">Cancel</Button>
//           <Button onClick={handleSaveEdit} color="primary" variant="contained">Save</Button>
//         </DialogActions>
//       </Dialog>
//     </Grid>
//   );
// };

// export default EmployeeReimbursement;











import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, Button, IconButton, Tooltip, Typography, Dialog, DialogTitle,
  DialogContent, DialogActions, CircularProgress, MenuItem
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { blue, green, red } from "@mui/material/colors";

import Sidenav from "../../Home Page/Sidenav";
import Navbar from "../../Home Page/Navbar";
import { postRequest } from "../../../serverconfiguration/requestcomp";
import { ServerConfig } from "../../../serverconfiguration/serverconfig";
import { REPORTS } from "../../../serverconfiguration/controllers";

const STATUS_OPTIONS = ["Pending", "Approved", "Rejected"];

const BranchReimbursement = () => {
  const databaseName = sessionStorage.getItem("databaseName");

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [viewRow, setViewRow] = useState(null);
  const [editRow, setEditRow] = useState(null);

  // -------------------------------
  // FETCH + NORMALIZE SQL RESPONSE
  // -------------------------------
  const fetchData = async () => {
    setLoading(true);
    try {
      const query = `
        SELECT 
          p.ReimbursementID AS id,
          p.EmployeeCode,
          ISNULL(e.Employee_First_Name + ' ' + e.Employee_Last_Name, p.EmployeeName) AS EmployeeName,
          p.PayableMonth,
          p.Category,
          p.Amount,
          p.StartDate AS Start_Date,
          p.EndDate as End_Date,
          p.Description,
          p.Status,
          p.Total_Amount_Approved,
          p.AttachFile
        FROM [${databaseName}].[dbo].[paym_Reimbursement] p
        LEFT JOIN [${databaseName}].[dbo].[paym_Employee] e
          ON p.EmployeeCode = e.EmployeeCode
        ORDER BY 
          CASE WHEN p.Status = 'Pending' THEN 0 ELSE 1 END,
          p.CreatedDate DESC;
      `;

      const res = await postRequest(ServerConfig.url, REPORTS, { query });

      if (res?.data) {
        // ⭐⭐⭐ CRITICAL FIX: NORMALIZE all fields so React doesn’t crash ⭐⭐⭐
        const cleaned = res.data.map(r => ({
          ...r,

          // Strings
          EmployeeName: r.EmployeeName || "",
          Category: r.Category || "",
          Description: r.Description || "",

          // Dates
          PayableMonth: typeof r.PayableMonth === "string" ? r.PayableMonth : "",
          Start_Date: typeof r.Start_Date === "string" ? r.Start_Date : "",
          End_Date: typeof r.End_Date === "string" ? r.End_Date : "",

          // Numbers
          Amount: typeof r.Amount === "number" ? r.Amount : 0,
          Total_Amount_Approved:
            typeof r.Total_Amount_Approved === "number" ? r.Total_Amount_Approved : null,

          // Status
          Status: typeof r.Status === "string" ? r.Status : "Pending",

          // AttachFile must be base64 string or null
          AttachFile: typeof r.AttachFile === "string" ? r.AttachFile : null,
        }));

        setRows(cleaned);
        console.log("Cleaned Rows:", cleaned);
      } else {
        setRows([]);
      }
    } catch (err) {
      console.error("Fetch reimbursements error:", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ---------------------------------------------
  // Detect PDF or Image
  // ---------------------------------------------
  const isPDFBase64 = (b64) => {
    if (!b64) return false;
    try {
      const head = atob(b64.slice(0, 32));
      return head.startsWith("%PDF");
    } catch {
      return false;
    }
  };

  const imageSrc = (b64) => `data:image/jpeg;base64,${b64}`;

  // ----------------------------------------------------
  // Filter rows for search
  // ----------------------------------------------------
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;

    return rows.filter((r) =>
      [
        r.EmployeeName,
        r.Category,
        String(r.Amount),
        r.Status,
        String(r.Total_Amount_Approved || "")
      ].some((v) => v?.toString().toLowerCase().includes(q))
    );
  }, [rows, search]);

  // ---------------------------------------------
  // View Attachment Renderer
  // ---------------------------------------------
  const renderAttachment = (row) => {
    if (!row.AttachFile) return <Typography>No attachment</Typography>;

    if (isPDFBase64(row.AttachFile)) {
      return (
        <Box>
          <Typography>This is a PDF document.</Typography>
          <Button variant="contained" sx={{ mt: 1 }}>
            <a
              href={`data:application/pdf;base64,${row.AttachFile}`}
              download={`reimbursement_${row.id}.pdf`}
              style={{ color: "#fff", textDecoration: "none" }}
            >
              Download PDF
            </a>
          </Button>
        </Box>
      );
    }

    return (
      <img
        src={imageSrc(row.AttachFile)}
        alt="attachment"
        style={{ maxWidth: "100%", height: "auto" }}
      />
    );
  };

  // ---------------------------------------------
  // Delete Row
  // ---------------------------------------------
  const handleDelete = async (row) => {
    if (!window.confirm("Delete this reimbursement?")) return;

    try {
      const query = `DELETE FROM [${databaseName}].[dbo].[paym_Reimbursement] WHERE ReimbursementID=${row.id};`;
      const res = await postRequest(ServerConfig.url, REPORTS, { query });

      if (res?.success) {
        setRows((prev) => prev.filter((r) => r.id !== row.id));
      } else {
        alert("Delete failed");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed");
    }
  };

  // ---------------------------------------------
  // Edit Logic
  // ---------------------------------------------
  const onEditChange = (field, value) => {
    setEditRow((prev) => ({ ...prev, [field]: value }));

    if (field === "Status" && value === "Approved") {
      setEditRow((prev) => ({
        ...prev,
        Total_Amount_Approved:
          prev?.Total_Amount_Approved ?? prev?.Amount
      }));
    }
  };

  const handleSaveEdit = async () => {
    if (!editRow) return;

    try {
      const query = `
        UPDATE [${databaseName}].[dbo].[paym_Reimbursement]
        SET
          Category = '${(editRow.Category || "").replace(/'/g, "''")}',
          Amount = ${editRow.Amount || 0},
          Description = '${(editRow.Description || "").replace(/'/g, "''")}',
          Status = '${editRow.Status || "Pending"}',
          Total_Amount_Approved = ${
            editRow.Total_Amount_Approved !== null &&
            editRow.Total_Amount_Approved !== ""
              ? editRow.Total_Amount_Approved
              : "NULL"
          },
          UpdatedDate = GETDATE()
        WHERE ReimbursementID = ${editRow.id};
      `;

      const res = await postRequest(ServerConfig.url, REPORTS, { query });

      if (res) {
        setRows((prev) =>
          prev.map((r) => (r.id === editRow.id ? { ...r, ...editRow } : r))
        );
        setEditRow(null);
        alert("Save Successful");
      } else {
        alert("Save failed");
      }
    } catch (err) {
      console.error("Save edit error:", err);
      alert("Save failed");
    }
  };

  // ---------------------------------------------
  // Render Component
  // ---------------------------------------------
  return (
    <Grid container sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Navbar />
      <Box height={30} />
      <Grid container>
        <Sidenav />

        <Grid item xs={12} md={9} lg={8} sx={{ margin: "100px auto", width: "95%" }}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">
              Employee Reimbursement Approval
            </Typography>

            <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
              <TextField
                placeholder="Search by employee, category, amount, status..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ width: 400 }}
              />
              <Button variant="contained" onClick={fetchData}>Refresh</Button>
              {loading && <CircularProgress size={24} sx={{ ml: 2 }} />}
            </Box>

            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
                  <TableRow>
                    <TableCell>Employee</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Total Approved</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        {loading ? <CircularProgress /> : "No records found"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>{r.EmployeeName}</TableCell>
                        <TableCell>
                          {r.Start_Date ? new Date(r.Start_Date).toLocaleDateString() : "-"}
                        </TableCell>
                        <TableCell>
                          {r.End_Date ? new Date(r.End_Date).toLocaleDateString() : "-"}
                        </TableCell>
                        <TableCell>{r.Category}</TableCell>
                        <TableCell>{r.Amount}</TableCell>
                        <TableCell>{r.Total_Amount_Approved ?? "-"}</TableCell>

                        <TableCell>
                          <Typography sx={{ color:
                            r.Status === "Approved"
                              ? green[500]
                              : r.Status === "Rejected"
                              ? red[500]
                              : blue[500]
                          }}>
                            {r.Status}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Tooltip title="View">
                              <IconButton onClick={() => setViewRow(r)}>
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Edit">
                              <IconButton onClick={() => setEditRow(r)}>
                                <EditIcon />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Delete">
                              <IconButton onClick={() => handleDelete(r)}>
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* VIEW DIALOG */}
      <Dialog open={Boolean(viewRow)} onClose={() => setViewRow(null)} maxWidth="md" fullWidth>
        <DialogTitle>View Reimbursement</DialogTitle>
        <DialogContent>
          {viewRow && (
            <Box>
              <Typography><strong>Employee:</strong> {viewRow.EmployeeName}</Typography>
              <Typography><strong>Start:</strong> {viewRow.Start_Date || "-"}</Typography>
              <Typography><strong>End:</strong> {viewRow.End_Date || "-"}</Typography>
              <Typography><strong>Category:</strong> {viewRow.Category}</Typography>
              <Typography><strong>Amount:</strong> {viewRow.Amount}</Typography>
              <Typography><strong>Total Approved:</strong> {viewRow.Total_Amount_Approved ?? "-"}</Typography>
              <Typography><strong>Description:</strong> {viewRow.Description}</Typography>

              <Box sx={{ mt: 2 }}>{renderAttachment(viewRow)}</Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewRow(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* EDIT DIALOG */}
      <Dialog open={Boolean(editRow)} onClose={() => setEditRow(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Reimbursement</DialogTitle>
        <DialogContent>
          {editRow && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
              <TextField
                label="Category"
                value={editRow.Category || ""}
                onChange={(e) => onEditChange("Category", e.target.value)}
              />

              <TextField
                label="Amount"
                type="number"
                value={editRow.Amount ?? ""}
                onChange={(e) => onEditChange("Amount", Number(e.target.value))}
                disabled
              />

              <TextField
                label="Status"
                select
                value={editRow.Status || "Pending"}
                onChange={(e) => onEditChange("Status", e.target.value)}
              >
                {STATUS_OPTIONS.map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </TextField>

              <TextField
                label="Total Amount Approved"
                type="number"
                value={editRow.Total_Amount_Approved ?? ""}
                onChange={(e) =>
                  onEditChange("Total_Amount_Approved", e.target.value ? Number(e.target.value) : "")
                }
              />

              <TextField
                label="Description"
                value={editRow.Description || ""}
                onChange={(e) => onEditChange("Description", e.target.value)}
                multiline
                rows={3}
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setEditRow(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEdit}>Save</Button>
        </DialogActions>
      </Dialog>

    </Grid>
  );
};

export default BranchReimbursement;
