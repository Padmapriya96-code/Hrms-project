import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  InputAdornment,
  IconButton,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Radio,
  AppBar,
  Toolbar,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Navbar from "../../Home Page/Navbar";
// import Sidenav from "../components/Home Page/Sidenav";
// import Navbar from "../components/Home Page/Navbar";

import Sidenav from "../../Home Page/Sidenav";

export default function Payslips() {
  const [form, setForm] = useState({
    periodCode: "",
    periodDesc: "",
    payslipType: "II",
    forAll: "All",
    includeOT: "Yes",
    month: "May",
    year: "2023",
    category: "",
    department: "",
    salaryFrom: "2020-05-01",
    salaryTo: "2020-05-31",
    payDate: "2020-11-03",
    totalWorkingDays: "26",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleOk = () => {
    alert("Payslip Generated Successfully!");
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
              maxWidth: 1000,
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
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "#fff" }}
                >
                  PAYSLIP
                </Typography>
              </Toolbar>
            </AppBar>

            <Grid container spacing={3}>
              {/* Period Section */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Period Details
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

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
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Period Description"
                  name="periodDesc"
                  value={form.periodDesc}
                  onChange={handleChange}
                />
              </Grid>

              {/* Year & Month */}
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
                  {Array.from({ length: 30 }, (_, i) => 1995 + i).map((y) => (
                    <MenuItem key={y} value={y.toString()}>
                      {y}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Salary Month"
                  name="month"
                  value={form.month}
                  onChange={handleChange}
                >
                  {[
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
                  ].map((m) => (
                    <MenuItem key={m} value={m}>
                      {m}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Payslip Type & For */}
              <Grid item xs={6}>
                <Box
                  sx={{
                    border: 1, // Border thickness
                    borderColor: "grey.400", // Border color
                    borderRadius: 2, // Rounded corners
                    p: 2, // Padding inside the box
                    bgcolor: "background.paper", // Optional background
                  }}
                >
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel sx={{ fontWeight: 600 }}>Payslip Type</FormLabel>
                    <RadioGroup
                      row
                      name="payslipType"
                      value={form.payslipType}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="I"
                        control={<Radio />}
                        label="I"
                      />
                      <FormControlLabel
                        value="II"
                        control={<Radio />}
                        label="II"
                      />
                      <FormControlLabel
                        value="III"
                        control={<Radio />}
                        label="III"
                      />
                    </RadioGroup>
                  </FormControl>
                </Box>
              </Grid>

              <Grid item xs={6}>
                <Box
                  sx={{
                    border: 1, // Border thickness
                    borderColor: "grey.400", // Border color
                    borderRadius: 2, // Rounded corners
                    p: 2, // Padding inside the box
                    bgcolor: "background.paper", // Optional background
                  }}
                >
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel sx={{ fontWeight: 600, mb: 1 }}>
                      Payslip For
                    </FormLabel>
                    <RadioGroup
                      row
                      name="forAll"
                      value={form.forAll}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="All"
                        control={<Radio />}
                        label="All"
                      />
                      <FormControlLabel
                        value="Employee"
                        control={<Radio />}
                        label="Employee"
                      />
                      <FormControlLabel
                        value="Category"
                        control={<Radio />}
                        label="Category"
                      />
                      <FormControlLabel
                        value="Division"
                        control={<Radio />}
                        label="Division"
                      />
                    </RadioGroup>
                  </FormControl>
                </Box>
              </Grid>

              {/* Salary From & Salary To */}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  label="Salary From"
                  name="salaryFrom"
                  value={form.salaryFrom}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  label="Salary To"
                  name="salaryTo"
                  value={form.salaryTo}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Pay Date & Total Working Days */}
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
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  mt: 3,
                }}
              >
                <Button variant="contained" color="primary" onClick={handleOk}>
                  Generate
                </Button>
                <Button variant="outlined" color="secondary">
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
