// import React, { useState, useEffect } from "react";
// import { postRequest } from "../../../serverconfiguration/requestcomp";
// import { ServerConfig } from "../../../serverconfiguration/serverconfig";
// import { REPORTS } from "../../../serverconfiguration/controllers";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { Card, CardContent, MenuItem, Select, FormControl, InputLabel, Grid, Typography, TextField, Button } from "@mui/material";



// const SalaryPeriod = () => {
//     const [isloggedin] = useState(sessionStorage.getItem("user"));
//     const [company, setCompany] = useState([]);
//     const [selectedCompany, setSelectedCompany] = useState("");
//     const [branches, setBranches] = useState([]);
//     const [selectedBranch, setSelectedBranch] = useState("");
//     const [periodCode, setPeriodCode] = useState(""); 
//     const [selectedDate, setSelectedDate] = useState(null);
    



//   useEffect(() => {
//     async function fetchCompanyData() {
//       if (isloggedin) {
//         try {
//           const data = await postRequest(ServerConfig.url, REPORTS, {
//             query: `SELECT * FROM paym_Company WHERE Company_User_Id = '${isloggedin}'`,
//           });
//           setCompany(data.data);
//         } catch (error) {
//           console.error("Error fetching company data:", error);
//         }
//       }
//     }
//     fetchCompanyData();
//   }, [isloggedin]);

//   // Fetch Branch Data (Independent of selectedCompany)
//   useEffect(() => {
//     async function fetchBranchData() {
//       try {
//         const data = await postRequest(ServerConfig.url, REPORTS, {
//           query: `SELECT * FROM paym_branch where pn_CompanyID = ${company[0].pn_CompanyID}`, 
//         });
//         setBranches(data.data);
//       } catch (error) {
//         console.error("Error fetching branch data:", error);
//       }
//     }
//     fetchBranchData();
//   }, [company]);

//   const currentYear = new Date().getFullYear();
// const years = Array.from({ length: 11 }, (_, i) => (currentYear - 5 + i).toString()); // 5 years before and after current year
// const months = Array.from({ length: 12 }, (_, i) =>
//   new Date(0, i).toLocaleString("default", { month: "long" })
// );


//  return (
//     <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px" }}>
//       <Card style={{ maxWidth: "600px", width: "100%", textAlign: "center", padding: "16px" }}>
//         <CardContent>
//           {/* Display Company Name at the top center */}
//           {company.length > 0 && (
//             <Typography variant="h5" marginBottom= "5px">
//               {company[0].CompanyName} {/* Display the first company name */}
//             </Typography>
//           )}

//           <Grid container spacing={2}>
//             {/* Branch Dropdown */}
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <InputLabel>Select Branch</InputLabel>
//                 <Select
//                   value={selectedBranch}
//                   onChange={(e) => setSelectedBranch(e.target.value)}
//                   label="Select Branch"
//                 >
//                   <MenuItem value="">Select Branch</MenuItem>
//                   {branches.map((branch) => (
//                     <MenuItem key={branch.pn_BranchID} value={branch.pn_BranchID}>
//                       {branch.BranchName}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>

//             {/* Accessing Side Dropdown */}
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <InputLabel>Select Accessing Side</InputLabel>
//                 <Select label="Select Accessing Side">
//                   <MenuItem value="Both">Both</MenuItem>
//                   <MenuItem value="Branch Side">Branch Side</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>

//        <Grid item xs={12} sm={6}>
//         <FormControl fullWidth>
//           <InputLabel>Select Month</InputLabel>
//           <Select label="Select Month">
//             {months.map((month) => (
//               <MenuItem key={month} value={month}>
//                 {month}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       </Grid>

//  <Grid item xs={12} sm={6}>
//         <FormControl fullWidth>
//           <InputLabel>Select Year</InputLabel>
//           <Select label="Select Year">
//             {years.map((year) => (
//               <MenuItem key={year} value={year}>
//                 {year}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       </Grid>
//       <Grid item xs={12} sm={12}>
//        <TextField label= "Type period code" variant="outlined"/>
//       </Grid>
//         <Grid item xs={12} sm={12}>
//           <Button variant='contained' >SAVE</Button>
//         </Grid>
//           </Grid>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default SalaryPeriod;








import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
  AppBar,
  Toolbar,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

// import Sidenav from "./Home Page/Sidenav";
// import Navbar from "./Home Page/Navbar";
import Navbar from "../../Home Page-comapny/Navbar1";
import Sidenav from "../../Home Page-comapny/Sidenav1";



export default function SalaryProcess() {
  const [form, setForm] = useState({
    periodCode: "",
    type: "Month",
    year: "2023",
    month: "May",
    fromDate: "2023-05-01",
    toDate: "2023-05-31",
    totalWorkingDays: "21",
    payDate: "2023-05-31",
    includeOT: "Yes",
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
              maxWidth: 950,
              margin: "auto",
              p: 4,
              borderRadius: 3,
              backgroundColor: "#fff",
            }}
          >
            {/* Header */}
            <AppBar
              position="static"
              sx={{
                backgroundColor: "#1976d2",
                borderRadius: 2,
                mb: 3,
                boxShadow: "none",
              }}
            >
              <Toolbar>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#fff" }}>
                SALARY PERIOD
                </Typography>
              </Toolbar>
            </AppBar>

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
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small">
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Type */}
              <Grid item xs={6}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Select Type"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                >
                  {["Month", "Week", "Category", "Division"].map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Year */}
              <Grid item xs={6}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Select Year"
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                >
                  {Array.from({ length: 30 }, (_, i) => 1995 + i).map((year) => (
                    <MenuItem key={year} value={year.toString()}>
                      {year}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Month */}
              <Grid item xs={6}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Select Month"
                  name="month"
                  value={form.month}
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
                  label="Salary From Date"
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
                  label="Salary To Date"
                  name="toDate"
                  value={form.toDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Total Working Days */}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Total Working Days"
                  name="totalWorkingDays"
                  value={form.totalWorkingDays}
                  onChange={handleChange}
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

              {/* Include OT */}
              <Grid item xs={6}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Include OT"
                  name="includeOT"
                  value={form.includeOT}
                  onChange={handleChange}
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </TextField>
              </Grid>

              {/* Buttons */}
              <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
                <Button variant="contained" color="primary">
                  Save
                </Button>
                <Button variant="outlined" color="secondary">
                  Delete
                </Button>
                <Button variant="outlined" color="info">
                  Clear
                </Button>
                <Button variant="outlined" color="error">
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Grid>
    </Grid>
  );
}
