import React, { useState, useEffect, useCallback } from "react";
import {
  TextField,
  Button,
  Grid,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Typography,
  Select,
  AppBar,
  Toolbar,
} from "@mui/material";
import { getRequest, postRequest } from "../../../serverconfiguration/requestcomp";
import { ServerConfig } from "../../../serverconfiguration/serverconfig";
import { PAYMBRANCHES, PAYMCOMPANIES, SAVE, REPORTS } from "../../../serverconfiguration/controllers";
import Sidenav from "../../Home Page/Sidenav";
import Navbar from "../../Home Page/Navbar";
import { toast } from "react-toastify";

const HolidayForm1 = () => {
  const [formData, setFormData] = useState({
    pn_CompanyID: "",
    pn_BranchID: "",
    pn_Holidaycode: "",
    pn_Holidayname: "",
    Fyear: "",
    From_date: "",
    To_date: "",
    days: "",
  });

  const [companies, setCompanies] = useState([]);
  const [branches, setBranches] = useState([]);
  const databaseName = sessionStorage.getItem("databaseName");

  // Fetch companies and branches
  useEffect(() => {
    async function fetchData() {
      try {
        const companyData = await getRequest(ServerConfig.url, PAYMCOMPANIES);
        setCompanies(companyData.data || []);

        const branchData = await getRequest(ServerConfig.url, PAYMBRANCHES);
        setBranches(branchData.data || []);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    }
    fetchData();
  }, []);

  // Function to fetch company & branch for logged-in user
  const fetchCompanyAndBranch = useCallback(async () => {
    const loggedUser = sessionStorage.getItem("user");
    try {
      const response = await postRequest(ServerConfig.url, REPORTS, {
        query: `SELECT * FROM [${databaseName}].[dbo].[paym_Branch] WHERE Branch_User_Id = '${loggedUser}'`,
      });

      if (response.data && response.data.length > 0) {
        const branch = response.data[0];
        setFormData(prev => ({
          ...prev,
          pn_CompanyID: branch.pn_CompanyID,
          pn_BranchID: branch.pn_BranchID,
        }));
      }
    } catch (error) {
      console.error("Error fetching company/branch:", error);
    }
  }, []);

  // Call after function is defined
  useEffect(() => {
    fetchCompanyAndBranch();
  }, [fetchCompanyAndBranch]);

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submit
const handleSubmit = async (e) => {
  e.preventDefault();
  toast.dismiss();

  try {
    // 1️⃣ Check for duplicate
    const checkQuery = `
      SELECT * FROM [${databaseName}].[dbo].[paym_holiday]
      WHERE pn_CompanyID = ${formData.pn_CompanyID}
        AND pn_BranchID = ${formData.pn_BranchID}
        AND pn_Holidaycode = '${formData.pn_Holidaycode}'
    `;
    const checkResponse = await postRequest(ServerConfig.url, REPORTS, {
      query: checkQuery,
    });

    if (checkResponse.data && checkResponse.data.length > 0) {
      const existing = checkResponse.data[0];
      toast.warning(
        `Data already exists!`,
        { position: "top-center", autoClose: 2000 }
      );
      return;
    }

    // 2️⃣ Insert new holiday
    const insertQuery = `
      INSERT INTO [${databaseName}].[dbo].[paym_holiday]
      (pn_CompanyID, pn_BranchID, pn_Holidaycode, pn_Holidayname, Fyear, From_date, To_date, days)
      VALUES
      (${formData.pn_CompanyID}, ${formData.pn_BranchID}, '${formData.pn_Holidaycode}',
       '${formData.pn_Holidayname}', ${formData.Fyear}, '${formData.From_date}',
       '${formData.To_date}', ${formData.days})
    `;
    const insertResponse = await postRequest(ServerConfig.url, SAVE, { query: insertQuery });

    if (insertResponse.status === 200) {
      toast.info("Data saved successfully!", { position: "top-center", autoClose: 1500 });

      // 3️⃣ Reset form for next insert, but keep Company & Branch IDs
      setFormData(prev => ({
        ...prev,
        pn_Holidaycode: "",
        pn_Holidayname: "",
        Fyear: "",
        From_date: "",
        To_date: "",
        days: "",
      }));
    } else {
      toast.error("Failed to save holiday!", { position: "top-center", autoClose: 1500 });
    }

  } catch (error) {
    console.error("Error:", error);
    toast.error("Error saving holiday!", { position: "top-center", autoClose: 1500 });
  }
};

  // Reset form
  const handleReset = () => {
    setFormData({
      pn_CompanyID: "",
      pn_BranchID: "",
      pn_Holidaycode: "",
      pn_Holidayname: "",
      Fyear: "",
      From_date: "",
      To_date: "",
      days: "",
    });
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: "100vh", margin: 0 }}>
      <div style={{ backgroundColor: "#f5f5f5", width: "100%" }}>
        <Navbar />
        <Box height={30} />
        <Box sx={{ display: "flex" }}>
          <Sidenav />
          <Grid item xs={12} sm={11} md={10} lg={9} xl={8} style={{ margin: "0 auto", padding: "20px" }}>
            <Box sx={{ p: 2 }}>
              <AppBar
                position="sticky"
                color="default"
                elevation={2}
                sx={{
                  backgroundColor: "#0077d4",
                  color: "white",
                  marginTop: "35px",
                  width: "78%",
                  marginLeft: "auto",
                  marginRight: "auto",
                  left: 0,
                  right: 0,
                  borderTopLeftRadius: "4px",
                  borderTopRightRadius: "4px",
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                }}
              >
                <Toolbar>
                  <Typography variant="h5" component="div" sx={{ fontWeight: "bold", flexGrow: 1 }}>
                    HOLIDAY FORM
                  </Typography>
                </Toolbar>
              </AppBar>

              <form onSubmit={handleSubmit}>
                <Paper
                  elevation={3}
                  style={{
                    padding: 20,
                    margin: "0 auto",
                    width: "78%",
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                    borderBottomLeftRadius: "4px",
                    borderBottomRightRadius: "4px",
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="pn_Holidaycode"
                        label="Holiday Code"
                        value={formData.pn_Holidaycode}
                        onChange={handleChange}
                        fullWidth
                        required
                            className="custom-readonly-textfield"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="pn_Holidayname"
                        label="Holiday Name"
                        value={formData.pn_Holidayname}
                        onChange={handleChange}
                        fullWidth
                        required
                            className="custom-readonly-textfield"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="Fyear"
                        label="Calendar Year"
                        type="number"
                        value={formData.Fyear}
                        onChange={handleChange}
                        fullWidth
                        required
                            className="custom-readonly-textfield"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="From_date"
                        label="From Date"
                        type="date"
                        value={formData.From_date}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        required
                            className="custom-readonly-textfield"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="To_date"
                        label="To Date"
                        type="date"
                        value={formData.To_date}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        required
                            className="custom-readonly-textfield"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="days"
                        label="Days"
                        type="number"
                        value={formData.days}
                        onChange={handleChange}
                        fullWidth
                        required
                            className="custom-readonly-textfield"
                      />
                    </Grid>
                  </Grid>

                  <Grid item xs={12} mt={3} container justifyContent="flex-end">
                    <Button onClick={handleReset} variant="contained" color="secondary" style={{ marginTop: "15px" }}>
                      Reset
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      style={{ marginTop: "15px", marginLeft: "30px" }}
                     // disabled={!formData.pn_CompanyID || !formData.pn_BranchID}
                    >
                      Submit
                    </Button>
                  </Grid>
                </Paper>
              </form>
            </Box>
          </Grid>
        </Box>
      </div>
    </Grid>
  );
};

export default HolidayForm1;
