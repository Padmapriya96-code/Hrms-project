// // Modified PayslipProcess.js

// import React, { useState, useEffect } from 'react';
// import { AgGridReact } from 'ag-grid-react';
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';
// import { motion } from 'framer-motion';
// import { ServerConfig } from '../../../../serverconfiguration/serverconfig';
// import { REPORTS, SAVE } from '../../../../serverconfiguration/controllers';
// import { postRequest } from '../../../../serverconfiguration/requestcomp';
// import './PayslipProcess.css';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { BeatLoader } from 'react-spinners'; // Import a spinner from react-spinners
// import Select from 'react-select'; // For a better dropdown UI
// import { ReceiptLong } from "@mui/icons-material";
// import { confirmAlert } from 'react-confirm-alert'; // Import the confirmation library
// import 'react-confirm-alert/src/react-confirm-alert.css'; // Import styles for the library
// import FlagIcon from '@mui/icons-material/Flag';
// import { Box, Typography, Tooltip, Button } from '@mui/material';
// import DatePicker from 'react-datepicker';
// import "react-datepicker/dist/react-datepicker.css";



// function PayslipProcess() {
//   const [status, setStatus] = useState('');
//   const [branchName, setBranchName] = useState('');
//   const [rowData, setRowData] = useState([]);
//   const [isloggedin, setisloggedin] = useState(sessionStorage.getItem('user'));
//   const [companyName, setCompanyName] = useState('');
//   const [periodCodes, setPeriodCodes] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(null); // New state for selected date
//   const [periodCodeMap, setPeriodCodeMap] = useState({});
//   const [Company, setCompany] = useState([]);
//   const [Branch, setBranch] = useState([]);
//   const [loading, setLoading] = useState(false); // Track loading state
//   const [refreshData, setRefreshData] = useState(false);
//   const [buttonsDisabled, setButtonsDisabled] = useState(false); // New state for button disable


//   const periodOptions = periodCodes.map(code => ({
//     value: code,
//     label: code,
//   }));
  

//   useEffect(() => {
//     async function getData() {
//       try {
//         const Branchdata = await postRequest(ServerConfig.url, REPORTS, {
//           query: `SELECT * FROM paym_Branch WHERE Branch_User_Id = '${isloggedin}'`,
//         });
//         setBranch(Branchdata.data);
  
//         if (Branchdata.data && Branchdata.data.length > 0) {
//           setBranchName(Branchdata.data[0].BranchName);
//           const branchId = Branchdata.data[0].pn_BranchID;
  
//           const Companydata = await postRequest(ServerConfig.url, REPORTS, {
//             query: `SELECT pn_CompanyID FROM paym_Branch WHERE pn_BranchID = '${branchId}'`,
//           });
//           setCompany(Companydata.data);
  
//           if (Companydata.data && Companydata.data.length > 0) {
//             const companyId = Companydata.data[0].pn_CompanyID;
  
//             const CompanyNameData = await postRequest(ServerConfig.url, REPORTS, {
//               query: `SELECT CompanyName FROM paym_Company WHERE pn_CompanyID = '${companyId}'`,
//             });
  
//             if (CompanyNameData.data && CompanyNameData.data.length > 0) {
//               setCompanyName(CompanyNameData.data[0].CompanyName);
              
//               await fetchPayrollData(companyId, branchId); // Fetch payroll & update period codes
              
//             } else {
//               setCompanyName("Company name not found");
//             }
//           } else {
//             setCompanyName("Company ID not found");
//           }
//         } else {
//           setBranchName("Branch not found");
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setBranchName("Error fetching branch");
//         setCompanyName("Error fetching company");
//       }
//     }
  
//     getData();
//   }, [isloggedin]);
  
  
//   useEffect(() => {
//     const fetchRowData = async () => {
//       if (selectedDate && Company.length > 0 && Branch.length > 0) {
//         const monthYear = selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' });
//         try {
//           const companyId = Company[0].pn_CompanyID;
//           const branchId = Branch[0].pn_BranchID;
//           const payrollData = await postRequest(ServerConfig.url, REPORTS, {
//             query: `SELECT * FROM paym_paybill WHERE pn_CompanyID = '${companyId}' AND pn_BranchID = '${branchId}' AND period_code = '${monthYear}'`,
//           });
//           setRowData(payrollData.data || []);
  
//           if (payrollData.data && payrollData.data.length > 0) {
//             const flagValue = payrollData.data[0].Flag;
  
//             // Set button states based on the flag value
//             if (flagValue === 'F') {
//               setButtonsDisabled({
//                 doProcessDisabled: true,
//                 undoDisabled: true,
//                 freezeDisabled: true,
//               });
//             } else if (flagValue === 'M') {
//               setButtonsDisabled({
//                 doProcessDisabled: true, // Disable Do Process button
//                 undoDisabled: false,     // Enable Undo button
//                 freezeDisabled: false,    // Enable Freeze button
//               });
//             } else {
//               // If flag is neither F nor M, enable all buttons
//               setButtonsDisabled({
//                 doProcessDisabled: false,
//                 undoDisabled: false,
//                 freezeDisabled: false,
//               });
//             }
//           } else {
//             // No data for the selected date
//             setButtonsDisabled({
//               doProcessDisabled: false,
//               undoDisabled: true,
//               freezeDisabled: true,
//             });
//           }
//         } catch (error) {
//           console.error("Error fetching row data:", error);
//         }
//       }
//     };
  
//     fetchRowData();
//   }, [selectedDate, Company, Branch, refreshData]);
  
//   const fetchPayrollData = async (companyId, branchId) => {
//     try {
//       const payrollData = await postRequest(ServerConfig.url, REPORTS, {
//         query: `SELECT * FROM paym_paybill WHERE pn_CompanyID = '${companyId}' AND pn_BranchID = '${branchId}'`,
//       });
  
//       const newPeriodCodeMap = {};
//       payrollData.data.forEach(item => {
//         const actualCode = item.period_code;
//         newPeriodCodeMap[actualCode] = actualCode;
//       });
  
//       setPeriodCodeMap(newPeriodCodeMap);
  
//       const sortedPeriodCodes = [...new Set(Object.keys(newPeriodCodeMap))].sort((a, b) => {
//         const [monthA, yearA] = a.split(" ");
//         const [monthB, yearB] = b.split(" ");
  
//         const monthOrder = [
//           "January", "February", "March", "April", "May", "June",
//           "July", "August", "September", "October", "November", "December"
//         ];
  
//         return yearA - yearB || monthOrder.indexOf(monthA) - monthOrder.indexOf(monthB);
//       });
  
//       setPeriodCodes(sortedPeriodCodes);
//     } catch (error) {
//       console.error("Error fetching payroll data:", error);
//     }
//   };

//   const defaultColDef = {
//     resizable: true,
//     flex: 1,
//     minWidth: 120,
//     cellStyle: { padding: '10px' },
//   };

 

//   const columnDefs = [
//     { headerName: 'Employee Code', field: 'EmployeeCode', pinned: 'left',   cellStyle: { textAlign: 'left' } },
//     { headerName: 'Employee Name', field: 'Employee_First_Name', pinned: 'left',  cellStyle: { textAlign: 'left' } },
//     {
//       headerName: 'Flag',
//       field: 'Flag',
//       pinned: 'left',
//       cellStyle: { textAlign: 'center' },
//       cellRenderer: (params) => {
//         const flagValue = params.value;
//         const color = flagValue === 'F' ? '#FF0000' : flagValue === 'M' ? '#4CAF50' : 'black';
//         const helperText = flagValue === 'F' ? 'Frozen Data' : flagValue === 'M' ? 'Modifiable Data' : '';
    
//         return (
//           <Tooltip title={<Typography variant="body2">{helperText}</Typography>} arrow>
//             <Box display="flex" alignItems="center" justifyContent="center" gap={0.5} marginBottom="1px">
//               <FlagIcon style={{ color }} />
//               {/* <span>{flagValue}</span> */}
//             </Box>
//           </Tooltip>
//         );
//       }
//     },
//     { headerName: 'Actual Basic', field: 'Act_Basic', cellStyle: { textAlign: 'right' }, valueFormatter: (params) => { const value = parseFloat(params.value);
//       return isNaN(value) ? '0.00' : value.toFixed(2);
//     },
//   },
//     { headerName: 'Earned Basic', field: 'Earned_Basic', cellStyle: { textAlign: 'right' }, valueFormatter: (params) => { const value = parseFloat(params.value);
//         return isNaN(value) ? '0.00' : value.toFixed(2);
//       },
//     },

//   ];
  
//   const updateColumnHeaders = (rowData) => {
//     if (!rowData || rowData.length === 0) return columnDefs; // Return default if no data
  
//     const updatedColumns = [...columnDefs]; // Start with existing columnDefs
  
//     for (let i = 1; i <= 10; i++) {
//       const allowanceKey = `Allowance${i}`;
//       const valueKey = `value${i}`;
//       const allowanceName = rowData[0][allowanceKey];
  
//       if (allowanceName && typeof allowanceName === 'string' && allowanceName !== '[object Object]') {
//         updatedColumns.push({
//           headerName: allowanceName,
//           field: valueKey,
//           cellClass: 'allowance-cell', // Add class for allowance cells
//           cellStyle: { textAlign: 'right' },
//           valueFormatter: (params) => {
//             const value = parseFloat(params.value);
//             return isNaN(value) ? '0.00' : value.toFixed(2);
//           },
//         });
//       }
//     }
  
//     for (let i = 1; i <= 10; i++) {
//       const DeductionKey = `Deduction${i}`;
//       const DeductionvalueKey = `valueA${i}`;
//       const DeductionName = rowData[0][DeductionKey];
  
//       if (DeductionName && typeof DeductionName === 'string' && DeductionName !== '[object Object]') {
//         updatedColumns.push({
//           headerName: DeductionName,
//           field: DeductionvalueKey,
//           cellClass: 'deduction-cell', // Add class for deduction cells
//           cellStyle: { textAlign: 'right' },
//           valueFormatter: (params) => {
//             const value = parseFloat(params.value);
//             return isNaN(value) ? '0.00' : value.toFixed(2);
//           },
//         });
//       }
//     }
  
//     // Append Net Salary and Gross Salary columns
//     updatedColumns.push(
//       {
//         headerName: 'Net Salary',
//         field: 'Net_salary',
//         cellStyle: { textAlign: 'right' },
//         valueFormatter: (params) => {
//           const value = parseFloat(params.value);
//           return isNaN(value) ? '0.00' : value.toFixed(2);
//         },
//       },
//       {
//         headerName: 'Gross Salary',
//         field: 'Gross_salary',
//         cellStyle: { textAlign: 'right' },
//         valueFormatter: (params) => {
//           const value = parseFloat(params.value);
//           return isNaN(value) ? '0.00' : value.toFixed(2);
//         },
//       },
     
//     );
  
//     return updatedColumns;
//   };
  

//   // Update columnDefs dynamically based on rowData
//   const updatedColumnDefs = updateColumnHeaders(rowData);

//   const handleDoProcess = async () => {
//     setLoading(true);
//     setStatus("Processing...");
  
//     try {
//       const response = await postRequest(ServerConfig.url, SAVE, {
//         query: `EXEC CombinedPaybillProcessing`,
//       });
  
//       if (response && response.status === 200) {
//         setStatus("Processed");
//         toast.success("Payroll processing completed successfully!", {
//           position: "top-center",
//           autoClose: 5000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//         });
  
//         // Trigger the useEffect by updating refreshData
//         setRefreshData((prev) => !prev);
  
//         // Fetch updated period codes
//         if (Company.length > 0 && Branch.length > 0) {
//           await fetchPayrollData(Company[0].pn_CompanyID, Branch[0].pn_BranchID);
//         }
  
//       } else {
//         throw new Error(`Unexpected response: ${JSON.stringify(response)}`);
//       }
//     } catch (error) {
//       console.error("Error processing payroll:", error);
//       toast.error(`Error processing payroll: ${error.message}`, {
//         position: "top-center",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };
  


//   const handleDoprocessConfirmation = () => {
//     confirmAlert({
//       title: 'Confirm',
//       message: 'Do you want to make changes?',
//       customUI: ({ onClose }) => (
//         <div className="custom-confirm-alert">
//           <h2 className="react-confirm-alert-title">Confirmation</h2>
//           <p>{'Do you want to make changes?'}</p>
//           <div className="react-confirm-alert-button-group">
//             <button
//               className="react-confirm-alert-button react-confirm-alert-yes"
//               onClick={() => {
//                 handleDoProcess();
//                 onClose();
//               }}
//             >
//               Yes
//             </button>
//             <button
//               className="react-confirm-alert-button react-confirm-alert-no"
//               onClick={onClose}
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       ),
//     });
//   };

  
// const handleUndo = async () => {
//   setLoading(true);
//   setStatus("Undoing...");

//   try {
//     // Format the selected date to match the period_code format
//     const monthYear = selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' });

//     const response = await postRequest(ServerConfig.url, SAVE, {
//       query: `DELETE FROM paym_paybill WHERE pn_CompanyID = ${Company[0].pn_CompanyID} AND pn_BranchID = ${Branch[0].pn_BranchID} AND period_code = '${monthYear}' AND flag = 'M'`
//     });

//     if (response && response.status === 200) {
//       setStatus("Undone");
//       toast.warn("Payroll processing undone!", {
//         position: "top-center",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//       });

//       // Refresh data to trigger useEffect
//       setRefreshData((prev) => !prev);

//       // Fetch updated payroll data
//       const payrollData = await postRequest(ServerConfig.url, REPORTS, {
//         query: `SELECT * FROM paym_paybill WHERE pn_CompanyID = '${Company[0].pn_CompanyID}' AND pn_BranchID = '${Branch[0].pn_BranchID}'`,
//       });

//       const newPeriodCodeMap = {};
//       payrollData.data.forEach((item) => {
//         const actualCode = item.period_code;
//         newPeriodCodeMap[actualCode] = actualCode;
//       });

//       setPeriodCodeMap(newPeriodCodeMap);

//       // Sort period codes
//       const sortedPeriodCodes = [...new Set(Object.keys(newPeriodCodeMap))].sort((a, b) => {
//         const [monthA, yearA] = a.split(" ");
//         const [monthB, yearB] = b.split(" ");

//         const monthOrder = [
//           "January", "February", "March", "April", "May", "June",
//           "July", "August", "September", "October", "November", "December"
//         ];

//         return yearA - yearB || monthOrder.indexOf(monthA) - monthOrder.indexOf(monthB);
//       });

//       setPeriodCodes(sortedPeriodCodes);

//     } else {
//       throw new Error(`Unexpected response: ${JSON.stringify(response)}`);
//     }
//   } catch (error) {
//     console.error("Error undoing payroll:", error);
//     toast.error(`Error undoing payroll: ${error.message}`, {
//       position: "top-center",
//       autoClose: 5000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//     });
//   } finally {
//     setLoading(false);
//   }
// };

  
//   const handleUndoConfirmation = () => {
//     confirmAlert({
//       title: 'Confirm',
//       message: 'Do you want to make changes?',
//       customUI: ({ onClose }) => (
//         <div className="custom-confirm-alert">
//           <h2 className="react-confirm-alert-title">Confirmation</h2>
//           <p>{'Do you want to make changes?'}</p>
//           <div className="react-confirm-alert-button-group">
//             <button
//               className="react-confirm-alert-button react-confirm-alert-yes"
//               onClick={() => {
//                 handleUndo();
//                 onClose();
//               }}
//             >
//               Yes
//             </button>
//             <button
//               className="react-confirm-alert-button react-confirm-alert-no"
//               onClick={onClose}
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       ),
//     });
//   };

//   const handleFreeze = async () => {
//     setLoading(true);
//     setStatus('Freezing...');
  
//     try {
//       // Format the selected date to match the period_code format
//       const monthYear = selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  
//       const response = await postRequest(ServerConfig.url, SAVE, {
//         query: `UPDATE paym_paybill SET Flag = 'F' WHERE pn_CompanyID = ${Company[0].pn_CompanyID} AND pn_BranchID = ${Branch[0].pn_BranchID} AND period_code = '${monthYear}'`
//       });
  
//       if (response && response.status === 200) {
//         setStatus('Frozen');
//         toast.info('Payroll data frozen!', {
//           position: "top-center",
//           autoClose: 5000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//         });
  
//         setRefreshData((prev) => !prev);
//       } else {
//         throw new Error(`Unexpected response: ${JSON.stringify(response)}`);
//       }
//     } catch (error) {
//       console.error('Error freezing payroll:', error);
//       toast.error(`Error freezing payroll: ${error.message}`, {
//         position: "top-center",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFreezeConfirmation = () => {
//     confirmAlert({
//       title: 'Confirm',
//       message: 'Do you want to make changes?',
//       customUI: ({ onClose }) => (
//         <div className="custom-confirm-alert">
//           <h2 className="react-confirm-alert-title">Confirmation</h2>
//           <p>{'Do you want to make changes?'}</p>
//           <div className="react-confirm-alert-button-group">
//             <button
//               className="react-confirm-alert-button react-confirm-alert-yes"
//               onClick={() => {
//                 handleFreeze();
//                 onClose();
//               }}
//             >
//               Yes
//             </button>
//             <button
//               className="react-confirm-alert-button react-confirm-alert-no"
//               onClick={onClose}
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       ),
//     });
//   };
  
//   return (
//     <div className="payslip-process">
//       <ToastContainer />
//       <div
//         className="container"
        
//       >
//         <div className="header">
//           <h2>Payroll Processing <ReceiptLong/></h2>
//           <p className="company-details">
//             {/* <span><strong>Company Name:</strong> {companyName || 'NO'}</span> */}
//             <span><strong>Branch Name:</strong> {branchName || `${isloggedin}`}</span>
//             <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//               <strong>Period:</strong>
//               <DatePicker
//                 selected={selectedDate}
//                 onChange={(date) => setSelectedDate(date)}
//                 showMonthYearPicker
//                 dateFormat="MMMM yyyy"
//                 placeholderText="Select Month and Year"
//                 className="date-picker"
//               />
//             </span>

//           </p>
//         </div>
//         <motion.div
//   className="button-container"
//   initial={{ opacity: 0, y: 20 }}
//   animate={{ opacity: 1, y: 0 }}
//   transition={{ delay: 0.3, duration: 0.4 }}
// >
//   {loading ? (
//     <div className="loader">
//       <BeatLoader color="#36d7b7" />
//     </div>
//   ) : (
//     <>
//       <Button
//         color='success'
//         variant='contained'
//         disabled={buttonsDisabled.doProcessDisabled}
//         onClick={handleDoprocessConfirmation}
//         sx={{ backgroundColor: '#2ecc71', '&:hover': { backgroundColor: '#27AE60' } }}
//       >
//         Do Process
//       </Button>
//       <Button
//         color='error'
//         variant='contained'
//         disabled={buttonsDisabled.undoDisabled}
//         onClick={handleUndoConfirmation}
//         sx={{ backgroundColor: '#e74c3c', '&:hover': { backgroundColor: '#C0392B' } }}
//       >
//         Undo
//       </Button>
//       <Button
//         variant='contained'
//         disabled={buttonsDisabled.freezeDisabled}
//         onClick={handleFreezeConfirmation}
//         sx={{ backgroundColor: '#3498db', '&:hover': { backgroundColor: '#2980b9' } }}
//       >
//         Freeze
//       </Button>
//     </>
//   )}
// </motion.div>

//         {/* <div className="status">
//           <strong>Status: </strong>{status || 'No action'}
//         </div> */}
//           <div className="ag-theme-alpine" 
//           style={{ height: 400, width: '100%' }}
         
//         >
//           <AgGridReact
//   columnDefs={updatedColumnDefs}
//   defaultColDef={defaultColDef}
//   rowData={rowData}
//   pagination={true}
//      domLayout="autoHeight"
     
// />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default PayslipProcess;








import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import Navbar from "../../../Home Page/Navbar";
import Sidenav from "../../../Home Page/Sidenav";

export default function PayslipProcessing() {
  const [form, setForm] = useState({
    periodCode: "MAY2020",
    periodType: "Month",
    monthName: "May",
    fromDate: "2020-05-01",
    toDate: "2020-05-31",
    payDate: "2020-11-03",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <Grid container sx={{ minHeight: "100vh", backgroundColor: "#f4f6f8" }}>
      <Navbar />

      <Grid item xs={12} sx={{ display: "flex" }}>
        <Sidenav />

        <Box sx={{ flexGrow: 1, p: 3, mt: 8 }}>
          <Paper
            elevation={4}
            sx={{
              maxWidth: 900,
              margin: "auto",
              p: 4,
              borderRadius: 3,
              backgroundColor: "#fff",
            }}
          >
            <Typography
              variant="h5"
              textAlign="center"
              sx={{ fontWeight: "bold", color: "#1E4AA8", mb: 3 }}
            >
              PAYSLIP PROCESSING
            </Typography>

            <Grid container spacing={3}>
              {/* Period Code */}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Period Code"
                  name="periodCode"
                  value={form.periodCode}
                  onChange={handleChange}
                  placeholder="Enter Period Code"
                />
              </Grid>

              {/* Period Type */}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Period Type"
                  name="periodType"
                  value={form.periodType}
                  
                />
              </Grid>

              {/* Month Name */}
              <Grid item xs={6}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Select Month"
                  name="monthName"
                  value={form.monthName}
                  onChange={handleChange}
                >
                  {[
                    "January","February","March","April","May","June",
                    "July","August","September","October","November","December"
                  ].map((m) => (
                    <MenuItem key={m} value={m}>
                      {m}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* From Date */}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  label="From Date"
                  name="fromDate"
                  value={form.fromDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* To Date */}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  label="To Date"
                  name="toDate"
                  value={form.toDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Pay Date */}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  label="Pay Date"
                  name="payDate"
                  value={form.payDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Buttons */}
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}
              >
                <Button variant="contained" color="primary">
                  Do process
                </Button>
                <Button variant="outlined" color="secondary">
                  Undo process
                </Button>
                <Button variant="outlined" color="info">
                  Cancel
                </Button>
                <Button variant="outlined" color="error">
                  Import Deductions
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Grid>
    </Grid>
  );
}
