import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Box,
  MenuItem
} from "@mui/material";
import { postRequest } from "../../serverconfiguration/requestcomp";
import { ServerConfig } from "../../serverconfiguration/serverconfig";
import { REPORTS, SAVE } from "../../serverconfiguration/controllers";
import { Checkbox } from "@material-ui/core";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./Styles.css";
import { useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Switch } from "@material-ui/core";
import Select from "react-select";
import Sidenav from "../Home Page-comapny/Sidenav1";
import Navbar from "../Home Page-comapny/Navbar1";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CurrencyExchangeSharpIcon from "@mui/icons-material/CurrencyExchangeSharp";
import CreditCardOffOutlinedIcon from "@mui/icons-material/CreditCardOffOutlined";
import axios from "axios";

const EarnDeductCompanyMasters = () => {
  const [formData, setFormData] = useState({
    pnCompanyId: "",
    pnBranchId: "",
    Allowance1: "",
    Allowance2: "",
    Allowance3: "",
    Allowance4: "",
    Allowance5: "",
    Allowance6: "",
    Allowance7: "",
    Allowance8: "",
    Allowance9: "",
    Allowance10: "",
    Deduction1: "",
    Deduction2: "",
    Deduction3: "",
    Deduction4: "",
    Deduction5: "",
    Deduction6: "",
    Deduction7: "",
    Deduction8: "",
    Deduction9: "",
    Deduction10: "",
  });
  const [isloggedin, setloggedin] = useState(sessionStorage.getItem("auth"));
  const [loggedCompany, setloggedCompany] = useState([]);
  const [loggedBranch, setloggedBranch] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [allowanceCount, setAllowanceCount] = useState(6);
  const [deductionCount, setDeductionCount] = useState(6);
  const [fetchedData, setFetchedData] = useState(null);
  const [updatedData, setUpdatedData] = useState(null);
  const [checkedAllowances, setCheckedAllowances] = useState(
    Array(10).fill(true)
  );
  const [checkedDeductions, setCheckedDeductions] = useState(
    Array(10).fill(true)
  );
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [gridData, setGridData] = useState([]);
  const companyId = sessionStorage.getItem("companyId");
  const [companyName, setCompanyName] = useState("");
  const [company, setCompany] = useState([]);
  const [pnCompanyId, setPnCompanyId] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const databaseName = sessionStorage.getItem("databaseName");
  const authStr=sessionStorage.getItem("auth");
    const auth=authStr?JSON.parse(authStr):null;
    const token=auth?.token;
     ServerConfig.url = "https://localhost:7266/api";
  

  const handleCheckboxChange = (index, type) => {
    if (type === "allowances") {
      const newChecked = [...checkedAllowances];
      newChecked[index] = !newChecked[index];
      setCheckedAllowances(newChecked);

      // Check the corresponding allowance and log it
      const allowance = fetchedData[0][`Allowance${index + 1}`];
      console.log(
        `Allowance ${index + 1}: ${allowance} is ${
          newChecked[index] ? "Checked" : "Unchecked"
        }`
      );
    } else {
      const newChecked = [...checkedDeductions];
      newChecked[index] = !newChecked[index];
      setCheckedDeductions(newChecked);

      // Check the corresponding deduction and log it
      const deduction = fetchedData[0][`Deduction${index + 1}`];
      console.log(
        `Deduction ${index + 1}: ${deduction} is ${
          newChecked[index] ? "Checked" : "Unchecked"
        }`
      );
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    console.log("DEBUG: useEffect triggered. isloggedin:", isloggedin, "token:", !!token);
  
  if (!isloggedin || !token) {
     console.log("DEBUG: Effect skipped because login or token is missing.");
     return;
  }
    async function fetchInitialData() {
      try {
       const res=await axios.get(`${ServerConfig.url}/PaymCompanies/by-user`,{
          headers: {
            Authorization: `Bearer ${token}`}});

        if (res.data&& res.data.length > 0) {
          setloggedCompany(res.data);
          setPnCompanyId(res.data[0].pnCompanyId);
           setCompany(res.data);
        console.log("Company ID set to:", pnCompanyId);
        setCompanyName(res.data[0].companyName || res.data[0].CompanyName);

          // Dynamically set pn_BranchID based on the fetched data
          setFormData((prevData) => ({
            ...prevData,
            pnCompanyId: res.data[0].pnCompanyId,
          }));
          console.log("LoggedCompany", res.data);
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    }

    // Always fetch fresh data based on isloggedin
    if (isloggedin&&token) {
      fetchInitialData();
    }
  }, [isloggedin, token]);

  useEffect(() => {
    async function fetchLoggedBranch() {
      if(!pnCompanyId) return;
      try {
        const res=await axios.get(`${ServerConfig.url}/PaymBranches/by-company/${pnCompanyId}`,
          { headers:{ Authorization: `Bearer ${token}`}});
        
          console.log("LoggedBranch", res.data);

          if (res.data&&res.data.length>0) {
            setloggedBranch(res.data);

            // Dynamically set pn_CompanyID based on the fetched data
            setFormData((prevData) => ({
              ...prevData,
              pnBranchId: res.data[0].pnBranchId,
            }));
          }
        
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    }
console.log("LoggedBranch Data Check:", loggedBranch);
    if (loggedCompany&&loggedCompany.length > 0) {
      fetchLoggedBranch();
    }
  }, [loggedCompany,token,pnCompanyId]);

  const branchOptions = loggedBranch.map((e) => ({
    value: e.pnBranchId||e.PnBranchId,
    label: e.branchName||e.BranchName,
  }));

  const handleBranchChange = (selectedOptions) => {
    setSelectedBranches(selectedOptions.map((option) => option.value));
  };

  const handleAddRow = () => {
    // Check if gridData is defined and has at least one row
    if (!gridData || gridData.length === 0) {
      alert("No rows available. Please add a row first.");
      return;
    }
    const lastRow = gridData[gridData.length - 1];
    if (
      lastRow &&
      (!lastRow.pnBranchIdranchID || !lastRow.vDivisionName || !lastRow.status)
    ) {
      alert(
        "Please fill all fields in the current row before adding a new one."
      );
      return;
    }
    const newRow = {
      pnBranchId: "", // This will hold the selected branch ID
      vDivisionName: "",
      status: "",
    };
    setGridData((prev) => [...prev, newRow]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value.trim() === "" ? null : value,
    }));
  };

  // const handleSave = async () => {
  //   try {
  //     // Transform formData to handle empty strings
  //     const transformedData = { ...formData };
  //     Object.keys(transformedData).forEach((key) => {
  //       if (transformedData[key] === "") {
  //         transformedData[key] = null;
  //       }
  //     });

  //     // Save data for each selected branch
  //     if (selectedBranches.length === 0) {
  //       // Insert with null branch ID
  //       const query = `INSERT INTO [${databaseName}].[dbo].[EarnDeductMasters]
  //            ([pn_CompanyID],[pn_BranchID],[Allowance1],[Allowance2],[Allowance3],[Allowance4],[Allowance5],[Allowance6],[Allowance7],[Allowance8],[Allowance9],[Allowance10],
  //            [Deduction1],[Deduction2],[Deduction3],[Deduction4],[Deduction5],[Deduction6],[Deduction7],[Deduction8],[Deduction9],[Deduction10])
  //         VALUES (
  //           ${transformedData.pn_CompanyID}, null,
  //           ${Array(10)
  //             .fill(0)
  //             .map((_, i) => `'${transformedData[`Allowance${i + 1}`]}'`)
  //             .join(", ")},
  //           ${Array(10)
  //             .fill(0)
  //             .map((_, i) => `'${transformedData[`Deduction${i + 1}`]}'`)
  //             .join(", ")})`;

  //       // Save the data
  //       const response = await postRequest(ServerConfig.url, SAVE, { query });

  //       if (response.status === 200) {
  //         console.log("Data saved successfully with null for branch ID");
  //       } else {
  //         console.error(
  //           "Error saving data with null branch ID:",
  //           response.statusText
  //         );
  //       }
  //     } else {
  //       // Loop through each selected branch and execute an insert query
  //       for (const branchID of selectedBranches) {
  //         const query = `INSERT INTO [${databaseName}].[dbo].[EarnDeductMasters]
  //              ([pn_CompanyID],[pn_BranchID],[Allowance1],[Allowance2],[Allowance3],[Allowance4],[Allowance5],[Allowance6],[Allowance7],[Allowance8],[Allowance9],[Allowance10],
  //              [Deduction1],[Deduction2],[Deduction3],[Deduction4],[Deduction5],[Deduction6],[Deduction7],[Deduction8],[Deduction9],[Deduction10])
  //           VALUES (
  //             ${transformedData.pn_CompanyID}, ${branchID},
  //             ${Array(10)
  //               .fill(0)
  //               .map((_, i) => `'${transformedData[`Allowance${i + 1}`]}'`)
  //               .join(", ")},
  //             ${Array(10)
  //               .fill(0)
  //               .map((_, i) => `'${transformedData[`Deduction${i + 1}`]}'`)
  //               .join(", ")})`;

  //         const response = await postRequest(ServerConfig.url, SAVE, { query });

  //         if (response.status === 200) {
  //           console.log(`Data saved successfully for branch ${branchID}`);
  //         } else {
  //           console.error(
  //             `Error saving data for branch ${branchID}:`,
  //             response.statusText
  //           );
  //         }
  //       }
  //     }

  //     // Fetch data for selected branches and company ID
  //     if (selectedBranches.length > 0) {
  //       // Create a list of branch IDs for the query
  //       const branchIDs = selectedBranches.join(", ");

  //       // SQL query to fetch data based on company ID and selected branches
  //       const fetchQuery = `SELECT * FROM [${databaseName}].[dbo].[earndeductmasters] 
  //                           WHERE pn_CompanyID = ${loggedCompany[0].pn_CompanyID} 
  //                           AND pn_BranchID IN (${branchIDs})`;

  //       const fetchearndeductmasters = await postRequest(
  //         ServerConfig.url,
  //         REPORTS,
  //         { query: fetchQuery }
  //       );

  //       setFetchedData(fetchearndeductmasters.data); // Set the fetched data
  //       console.log("fetchedmasters", fetchearndeductmasters);
  //     } else {
  //       console.log("No branches selected for fetching data.");
  //     }
  //   } catch (error) {
  //     console.error("Error occurred during save:", error);
  //   }
  // };
  const handleSave = async () => {
  try {
    // 1. Prepare the payload (Clean data, no SQL injection risk)
    const payload = {
      pnCompanyId: formData.pnCompanyId,
      branchIds: selectedBranches.length > 0 ? selectedBranches : [null], // Backend handles null/list logic
      allowances: Array.from({ length: 10 }, (_, i) => ({
        name: formData[`Allowance${i + 1}`],
        value: formData[`Value${i + 1}`]
      })),
      deductions: Array.from({ length: 10 }, (_, i) => ({
        name: formData[`Deduction${i + 1}`],
        value: formData[`ValueA${i + 1}`]
      }))
    };

    // 2. Call your API
    const saveResponse = await axios.post(`${ServerConfig.url}/EarnDeducts`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (saveResponse.status === 200 || saveResponse.status === 201) {
      console.log("Saved successfully!");
      
      // 3. Fetch the updated data using GET
      const fetchResponse = await axios.get(`${ServerConfig.url}/EarnDeductMasters`, {
        params: { 
          companyId: formData.pnCompanyId, 
          branchIds: selectedBranches.join(",") 
        },
        headers: { Authorization: `Bearer ${token}` }
      });

      setFetchedData(fetchResponse.data);
    }
  } catch (error) {
    console.error("Error saving data:", error);
    // Add user-friendly alert here
    confirmAlert({
      title: "Error",
      message: "Failed to save data.",
      buttons: [
        {
          label: "OK",
          onClick: () => {},
        },
      ],
    });
  }
};

  const handleDone = () => {
    // Show confirmation alert before proceeding
    confirmAlert({
      title: "Confirm Submission",
      message:
        "Are you sure you want to submit these allowances and deductions?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            // Proceed with the submission after user confirms
            saveData();
          },
          style: { backgroundColor: "#0b87da" }, // Info color (blue)
        },
        {
          label: "No",
          onClick: () => {
            // User canceled, do nothing
          },
          style: { backgroundColor: "#dc3545" }, // Error color (red)
        },
      ],
    });
  };

  const saveData = async () => {
    const allowanceValues = [...Array(10)].map((_, i) => {
      const allowance = fetchedData[0][`Allowance${i + 1}`];
      return allowance && allowance !== "null"
        ? checkedAllowances[i]
          ? "'Y'"
          : "'N'"
        : "null";
    });

    const deductionValues = [...Array(10)].map((_, i) => {
      const deduction = fetchedData[0][`Deduction${i + 1}`];
      return deduction && deduction !== "null"
        ? checkedDeductions[i]
          ? "'Y'"
          : "'N'"
        : "null";
    });

    const queryValues = [...allowanceValues, ...deductionValues].join(",");

    const branchIDs = fetchedData.map((item) => item.pn_BranchID);

    try {
      await Promise.all(
        branchIDs.map((branchID) =>
          postRequest(ServerConfig.url, SAVE, {
            query: `INSERT INTO [${databaseName}].[dbo].[ProRataBasisMasters] 
              ([pn_CompanyID], [pn_BranchID], [Allowance1PRB], [Allowance2PRB], [Allowance3PRB], [Allowance4PRB], 
               [Allowance5PRB], [Allowance6PRB], [Allowance7PRB], [Allowance8PRB], [Allowance9PRB], [Allowance10PRB], 
               [Deduction1PRB], [Deduction2PRB], [Deduction3PRB], [Deduction4PRB], [Deduction5PRB], [Deduction6PRB], 
               [Deduction7PRB], [Deduction8PRB], [Deduction9PRB], [Deduction10PRB])
            VALUES (${loggedCompany[0].pn_CompanyID}, ${branchID}, ${queryValues})`,
          })
        )
      );

      // Show success message after successful submission
      confirmAlert({
        title: "Error",
        message: "There was an error saving the data.",
        buttons: [
          {
            label: "OK",
            onClick: () => {},
            style: { backgroundColor: "#0b87da", color: "white" }, // Info color (blue)
          },
        ],
      });
    } catch (error) {
      console.error("Error saving data: ", error);
      confirmAlert({
        title: "Error",
        message: "There was an error saving the data.",
        buttons: [
          {
            label: "OK",
            onClick: () => {},
          },
        ],
      });
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const addAllowanceField = () => {
    if (allowanceCount < 10) {
      setAllowanceCount(allowanceCount + 1);
    }
  };

  const addDeductionField = () => {
    if (deductionCount < 10) {
      setDeductionCount(deductionCount + 1);
    }
  };

  if (fetchedData) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ textAlign: "center", fontWeight: "bold" }}
          >
            ProRataBasis Masters
          </Typography>
          <Typography className="animated-message" gutterBottom>
            Exclude the allowances and deductions that you dont want to include
            for Pro rata basis
          </Typography>
          <Grid container spacing={3}>
            {/* Allowances Section */}
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ textAlign: "center", fontWeight: "bold" }}
              >
                Allowances
              </Typography>
              <Box
                sx={{
                  border: "1px solid black",
                  p: 2,
                  minHeight: "150px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                {[...Array(10)].map((_, i) => {
                  const allowance = fetchedData[0][`Allowance${i + 1}`];
                  return allowance && allowance !== "null" ? (
                    <Box
                      key={`fetched-allowance-${i}`}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 0.5,
                      }}
                    >
                      <Typography variant="body1">{allowance}</Typography>
                      <Switch
                        color="primary"
                        checked={checkedAllowances[i]}
                        onChange={() => handleCheckboxChange(i, "allowances")}
                        id={`allowance-switch-${i + 1}`}
                      />
                    </Box>
                  ) : null;
                })}
              </Box>
            </Grid>
            {/* Deductions Section */}
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ textAlign: "center", fontWeight: "bold" }}
              >
                Deductions
              </Typography>
              <Box
                sx={{
                  border: "1px solid black",
                  p: 2,
                  minHeight: "150px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                {[...Array(10)].map((_, i) => {
                  const deduction = fetchedData[0][`Deduction${i + 1}`];
                  return deduction && deduction !== "null" ? (
                    <Box
                      key={`fetched-deduction-${i}`}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="body1">{deduction}</Typography>
                      <Switch
                        color="primary"
                        checked={checkedDeductions[i]}
                        onChange={() => handleCheckboxChange(i, "deductions")}
                        id={`deduction-switch-${i + 1}`}
                      />
                    </Box>
                  ) : null;
                })}
              </Box>
            </Grid>
          </Grid>
          <Grid container justifyContent="flex-end" spacing={2} sx={{ mt: 4 }}>
            <Grid item>
              <button
                type="button"
                onClick={handleDone}
                className="btn btn-primary btn-sm"
              >
                Done
              </button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    );
  }

  return (
    <Grid container style={{ backgroundColor: "#f5f5f5" }}>
      {/* Navbar and Sidebar */}
      <Grid item xs={12}>
        <div>
          <Navbar />
          <Box height={30} />
          <Box sx={{ display: "flex" }}>
            <Sidenav />
            <Grid
              item
              xs={12}
              sm={10}
              md={9}
              lg={8}
              xl={7}
              sx={{ margin: "50px auto" }}
            >
              <Container sx={{ width: "80%", maxWidth: "1200px", mt: 4 }}>
                <Paper elevation={3} sx={{ p: 0 }}>
                  <AppBar
                    position="static"
                    sx={{
                      width: "100%",
                      margin: 0,
                      padding: 0,
                      minHeight: "60px",
                    }}
                  >
                    <Toolbar sx={{ justifyContent: "left", height: "100%" }}>
                      <Typography
                        variant="h5"
                        gutterBottom
                        sx={{
                          textAlign: "left",
                          fontWeight: "bold",
                          color: "white",
                          lineHeight: "60px",
                        }} // Adjust lineHeight to match minHeight
                      >
                        ALLOWANCES AND DEDUCTION MASTER
                      </Typography>
                    </Toolbar>
                  </AppBar>
                  <Tabs value={tabIndex} onChange={handleTabChange} centered>
                    <Tab
                      icon={
                        <CurrencyExchangeSharpIcon
                          fontSize="large"
                          style={{ color: "black" }}
                        />
                      }
                      iconPosition="top"
                      label="Allowances"
                      sx={{
                        fontWeight: "600",
                        color: tabIndex === 0 ? "#0b87da" : "#6b7280", // default grey for unselected
                        mx: 10, // horizontal margin between tabs
                        py: 2, // vertical padding for more height
                        borderRadius: 2, // subtle rounded corners (0.75rem ~ 12px)
                        transition:
                          "color 0.3s ease, background-color 0.3s ease",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "12px", // space between icon and label
                        "&:hover": {
                          backgroundColor: "#e6f0fb", // subtle hover background
                          cursor: "pointer",
                          color: "#0b87da",
                        },
                        "&.Mui-selected": {
                          backgroundColor: "#d0e3fb",
                          color: "#0b87da",
                        },
                        "& .MuiTab-iconWrapper": {
                          color: "black", // icon always black
                          transition: "color 0.3s ease",
                        },
                      }}
                    />
                    <Tab
                      icon={
                        <CreditCardOffOutlinedIcon
                          fontSize="large"
                          style={{ color: "black" }}
                        />
                      }
                      iconPosition="top"
                      label="Deductions"
                      sx={{
                        fontWeight: "600",
                        color: tabIndex === 1 ? "#0b87da" : "#6b7280",
                        mx: 10,
                        py: 2,
                        borderRadius: 2,
                        transition:
                          "color 0.3s ease, background-color 0.3s ease",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "12px",
                        "&:hover": {
                          backgroundColor: "#e6f0fb",
                          cursor: "pointer",
                          color: "#0b87da",
                        },
                        "&.Mui-selected": {
                          backgroundColor: "#d0e3fb",
                          color: "#0b87da",
                        },
                        "& .MuiTab-iconWrapper": {
                          color: "black",
                          transition: "color 0.3s ease",
                        },
                      }}
                    />
                  </Tabs>

                  <form>
                    <Box sx={{ mt: 3 }}>
                      {tabIndex === 0 && (
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6} md={5} ml={4}>
                            <TextField
                           
                              fullWidth
                              label="Company"
                              name="CompanyName"
                              value={loggedCompany?.[0]?.companyName || ""}
                            
                            
                              variant="outlined"
                              InputProps={{
                                readOnly: true,
                              }}
                              InputLabelProps={{
                                sx: {
                                  color: "gray", // Default label color
                                  "&.Mui-focused": {
                                    color: "black", // Change to black when focused
                                  },
                                },
                              }}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  backgroundColor: "#fff",
                                  borderRadius: "10px", // This sets the input background to white
                                  "& fieldset": {
                                    borderWidth: "2px",
                                    borderRadius: "8px",
                                  },
                                  "&:hover fieldset": {
                                    borderColor: "black",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "black",
                                  },
                                  "&.Mui-error fieldset": {
                                    borderColor: "black",
                                  },
                                },
                              }}
                            />
                          </Grid>

                          <Grid item xs={12} sm={6} md={5} ml={4}>
                            <div
                              style={{ width: "100%", position: "relative" }}
                            >
                              <label
                                htmlFor="branch"
                                style={{
                                  position: "absolute",
                                  top: "-10px",
                                  backgroundColor: "white",
                                  padding: "0 4px",
                                  zIndex: 1,
                                }}
                              >
                                Branch
                              </label>
                              <Select
                                id="Branch"
                                name="Branch"
                                options={branchOptions}
                                isMulti
                                onChange={handleBranchChange}
                                styles={{
                                  control: (base, state) => ({
                                    ...base,
                                    minHeight: state.hasValue ? "auto" : "55px", // Adjust height dynamically
                                    padding: "10px",
                                    backgroundColor: "#fff", // Set background color
                                    borderRadius: "8px", // Set border radius
                                    borderWidth: "2px", // Set border width
                                    borderColor: state.isFocused
                                      ? "black"
                                      : "lightgray", // Change border color on focus
                                    boxShadow: state.isFocused
                                      ? "0 0 5px rgba(0, 0, 0, 0.2)"
                                      : "none",
                                    "&:hover": {
                                      borderColor: "black", // Change border color on hover
                                    },
                                  }),
                                  valueContainer: (base) => ({
                                    ...base,
                                    display: "flex",
                                    flexWrap: "wrap", // Ensure values wrap to new lines
                                    alignItems: "flex-start", // Align selected values at the top
                                  }),
                                  multiValue: (base) => ({
                                    ...base,
                                    margin: "2px", // Adjust margins for better spacing
                                  }),
                                }}
                              />
                            </div>
                          </Grid>

                          {[...Array(allowanceCount)].map((_, i) => (
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={5}
                              key={`allowance${i + 1}`}
                              sx={{ ml: 4 }}
                            >
                              <TextField
                                fullWidth
                                label={`Allowance ${i + 1}`}
                                name={`Allowance${i + 1}`}
                                value={formData[`Allowance${i + 1}`] || ""}
                                onChange={handleChange}
                                variant="outlined"
                                InputLabelProps={{
                                  sx: {
                                    color: "gray", // Default label color
                                    "&.Mui-focused": {
                                      color: "black", // Change to black when focused
                                    },
                                  },
                                }}
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    backgroundColor: "#fff",
                                    borderRadius: "10px", // This sets the input background to white
                                    "& fieldset": {
                                      borderWidth: "2px",
                                      borderRadius: "8px",
                                    },
                                    "&:hover fieldset": {
                                      borderColor: "black",
                                    },
                                    "&.Mui-focused fieldset": {
                                      borderColor: "black",
                                    },
                                    "&.Mui-error fieldset": {
                                      borderColor: "black",
                                    },
                                  },
                                }}
                              />
                            </Grid>
                          ))}

                          <Grid
                            container
                            spacing={2}
                            sx={{ justifyContent: "flex-end", mt: 2 }}
                          >
                            <Grid item>
                              <Button
                                variant="contained"
                                size="small"
                                onClick={() => handleAddRow("allowance")}
                                disabled={allowanceCount >= 10}
                                sx={{ width: 100, height: 40, mt: 2, mb: 2 }}
                              >
                                Add
                              </Button>
                            </Grid>

                            <Grid item>
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={() => setTabIndex(1)}
                                sx={{
                                  width: 100,
                                  height: 40,
                                  mt: 2,
                                  mb: 2,
                                  mr: 3,
                                }}
                              >
                                Next
                              </Button>
                            </Grid>
                          </Grid>
                        </Grid>
                      )}

                      {tabIndex === 1 && (
                        <Grid container spacing={3}>
                          {[...Array(deductionCount)].map((_, i) => (
                            <Grid
                              item
                              xs={12}
                              sm={5}
                              key={`deduction${i + 1}`}
                              sx={{ ml: 4 }}
                            >
                              <TextField
                                fullWidth
                                label={`Deduction ${i + 1}`}
                                name={`Deduction${i + 1}`}
                                value={formData[`Deduction${i + 1}`] || ""}
                                onChange={handleChange}
                                variant="outlined"
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    backgroundColor: "#fff",
                                    borderRadius: "10px", // This sets the input background to white
                                    "& fieldset": {
                                      borderWidth: "2px",
                                      borderRadius: "8px",
                                    },
                                    "&:hover fieldset": {
                                      borderColor: "black",
                                    },
                                    "&.Mui-focused fieldset": {
                                      borderColor: "black",
                                    },
                                    "&.Mui-error fieldset": {
                                      borderColor: "black",
                                    },
                                  },
                                }}
                              />
                            </Grid>
                          ))}

                          <Grid
                            container
                            spacing={2}
                            sx={{ justifyContent: "flex-end", mt: 2 }}
                          >
                            <Grid item>
                              <Button
                                variant="contained"
                                size="small"
                                onClick={() => handleAddRow("deduction")}
                                disabled={deductionCount >= 10}
                                sx={{ width: 100, height: 40, mt: 2, mb: 2 }}
                              >
                                Add
                              </Button>
                            </Grid>
                            <Grid item>
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={() => setTabIndex(0)}
                                sx={{ width: 100, height: 40, mt: 2, mb: 2 }}
                              >
                                Back
                              </Button>
                            </Grid>
                            <Grid item>
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={handleSave}
                                sx={{
                                  width: 100,
                                  height: 40,
                                  mt: 2,
                                  mb: 2,
                                  mr: 2,
                                }}
                              >
                                Save
                              </Button>
                            </Grid>
                          </Grid>
                        </Grid>
                      )}
                    </Box>
                  </form>
                </Paper>
              </Container>
            </Grid>
          </Box>
        </div>
      </Grid>
    </Grid>
  );
};

export default EarnDeductCompanyMasters;
