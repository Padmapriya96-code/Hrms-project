import React, { useState, useEffect } from "react";
import {
  Button,
  Grid,
  Typography,
  Box,
  CircularProgress,
  AppBar,
  Toolbar,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { postRequest } from "../../../../serverconfiguration/requestcomp";
import { ServerConfig } from "../../../../serverconfiguration/serverconfig";
import { REPORTS } from "../../../../serverconfiguration/controllers";
import { toast } from "react-toastify";
import Sidenav from "../../../Home Page-comapny/Sidenav1";
import Navbar from "../../../Home Page-comapny/Navbar1";
import axios from "axios";


const PFvalues = () => {
  const [isloggedin] = useState(sessionStorage.getItem("user"));
  const [company, setCompany] = useState([]);
  const [rowData, setRowData] = useState([
    { id: 1, label: "Effective Month From", value: "" },
    { id: 2, label: "Effective From Year", value: "" },
    { id: 3, label: "PF Contribution (%)", value: "" },
    { id: 4, label: "Max Ceiling", value: "" },
    { id: 5, label: "Inc Earnings for PF value below ceiling", value: "" },
    { id: 6, label: "EPF Contribution (%)", value: "" },
    { id: 7, label: "Upper Limit", value: "" },
    { id: 8, label: "EPS Contribution (%)", value: "" },
    { id: 9, label: "Eligibility Amount", value: "" },
    { id: 10, label: "Admin Charges (%)", value: "" },
    { id: 11, label: "Rounding Options", value: "" },
  ]);
  const [originalRowData, setOriginalRowData] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pnCompanyName, setCompanyName] = useState("");
  const [pnCompanyId, setPnCompanyId] = useState(null);
  const databaseName = sessionStorage.getItem("databaseName"); // ✅ Dynamic DB name
  const authStr=sessionStorage.getItem("auth");
    const auth=authStr?JSON.parse(authStr):null;
    const token=auth?.token;
    ServerConfig.url = "https://localhost:7266/api";

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const handleCellValueChange = (params) => {
    setRowData((prevData) =>
      prevData.map((row) =>
        row.id === params.data.id ? { ...row, value: params.data.value } : row
      )
    );
  };

  const columns = [
    {
      headerName: "FIELD",
      field: "label",
      flex: 1,
      minWidth: 150,
      cellStyle: { textAlign: "left", paddingRight: "10px" },
      headerClass: "ag-center-header",
    },
    {
      headerName: "VALUE",
      field: "value",
      editable: true,
      flex: 1,
      minWidth: 150,
      valueFormatter: (params) => {
        if (!params || !params.data) return "";
        if (params.data.label.includes("%")) {
          const value = parseFloat(params.value);
          return isNaN(value) ? "" : `${value}%`;
        }
        if (params.data.label === "Effective From Year") {
          return parseInt(params.value, 10) || "";
        }
        const value = parseFloat(params.value);
        return !isNaN(value) ? value.toFixed(2) : params.value;
      },
      valueParser: (params) => {
        if (!params.newValue) return null;
        const numericValue = parseFloat(params.newValue);
        return isNaN(numericValue) ? 0 : numericValue;
      },
      cellStyle: { textAlign: "left", paddingLeft: "10px" },
      cellEditorSelector: (params) => {
        if (params.data.label === "Effective From Year") {
          const currentYear = new Date().getFullYear();
          const years = Array.from({ length: 20 }, (_, i) => currentYear - i);
          return { component: "agSelectCellEditor", params: { values: years } };
        }
        if (params.data.label === "Effective Month From") {
          return { component: "agSelectCellEditor", params: { values: months } };
        }
        if (
          params.data.label === "Max Ceiling" ||
          params.data.label === "Inc Earnings for PF value below ceiling"
        ) {
          return { component: "agSelectCellEditor", params: { values: ["Yes", "No"] } };
        }
        if (params.data.label === "Rounding Options") {
          return {
            component: "agSelectCellEditor",
            params: { values: ["Rounded to Next Rupee", "Round to Nearest Rupee"] },
          };
        }
        return null;
      },
      headerClass: "ag-center-header",
    },
  ];

  // ✅ Fetch company and PF data
  const fetchCompanyData = async () => {
    if(!token){
      toast.error("User not logged in");
      return;
    }
    try{
      console.log("Fetching company data...");
      const res=await axios.get(`${ServerConfig.url}/PaymCompanies/by-user`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      console.log("Company Data Fetched:", res.data);
      setCompany(res.data);
      if(res.data.length>0){
        const companyId = res.data[0].pnCompanyId || res.data[0].PnCompanyId;
        setPnCompanyId(companyId);
        console.log("Company ID set to:", companyId);
        setCompanyName(res.data[0].companyName || res.data[0].CompanyName);
        return companyId;
      }
     return null; 
    }catch(error){
      console.error("Failed to fetch company",{
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      return null;
    }
    };
    const fetchallData = async () => {
      // 1. Fetch the company and get the ID back
    const id = await fetchCompanyData(); 

    // 2. Debug: See what 'id' actually is
    console.log("ID received in fetchallData:", id);

    // 3. ONLY call the next fetch if the id is a valid number
    if (id && typeof id !== 'object') {
        await fetchPfSettings(id);
    } else {
        console.error("Invalid ID type detected:", typeof id);
    }
    }
    useEffect(() => {
  if (token) {
    fetchallData();
  } else {
    console.warn("No token found, skipping data fetch.");
  }
}, [token]); // Re-runs if the token changes (e.g., user logs in/out)

  // ✅ Save PF settings
  const handleSave = async () => {
  // 1. Try to get ID from current state or the company array
  let activeId = pnCompanyId || (company.length > 0 ? (company[0].pnCompanyId || company[0].PnCompanyId) : null);

  // 2. If it's still missing (State was wiped), run the fetch again and get the returned value
  if (!activeId) {
    console.log("State was empty, attempting to fetch ID directly...");
    activeId = await fetchCompanyData(); 
  }

  // 3. Final check
  if (!activeId) {
    toast.error("Company ID missing. Please refresh the page.");
    return;
  }
  setIsSaving(true);
  try {
    toast.dismiss();

    // 1. Validation for Required Fields
    const requiredFields = [
      "Effective Month From", "Effective From Year", "PF Contribution (%)",
      "EPF Contribution (%)", "EPS Contribution (%)", "Admin Charges (%)"
    ];
    const missing = rowData.filter(r => requiredFields.includes(r.label) && !r.value);
    if (missing.length > 0) {
      toast.error("Please fill all required fields.");
      return;
    }

    // 2. Prepare Payload (Mapping UI labels to DTO properties)
    const dataMap = rowData.reduce((acc, row) => {
      acc[row.label] = row.value;
      return acc;
    }, {});

    const payload = {
      
      pnCompanyId: activeId,
      // Ensure these strings are never null/undefined
  effectiveMonthFrom: dataMap["Effective Month From"] || "January",
  maxCeiling: dataMap["Max Ceiling"] || "No",
  pfBelowCeiling: dataMap["Inc Earnings for PF value below ceiling"] || "No",
  roundingOptions: dataMap["Rounding Options"] || "None",

  // Ensure these numbers are never NaN
  effectiveFromYear: parseInt(dataMap["Effective From Year"]) || new Date().getFullYear(),
  pfContribution: parseFloat(dataMap["PF Contribution (%)"]) || 0,
  epfContribution: parseFloat(dataMap["EPF Contribution (%)"]) || 0,
  epsContribution: parseFloat(dataMap["EPS Contribution (%)"]) || 0,
  adminCharges: parseFloat(dataMap["Admin Charges (%)"]) || 0,

  // Use 0 instead of null if your SQL columns don't allow NULLs
  upperLimit: dataMap["Upper Limit"] ? parseFloat(dataMap["Upper Limit"]) : 0,
  eligibilityAmount: dataMap["Eligibility Amount"] ? parseFloat(dataMap["Eligibility Amount"]) : 0
    };
    console.log("Payload being sent:", payload);

    // 3. API Call
    await axios.post(`${ServerConfig.url}/PfSettings`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });

    toast.success("PF settings saved successfully!");
    setOriginalRowData(JSON.parse(JSON.stringify(rowData)));
    await fetchallData(); // Refresh data after save
  } catch (error) {
    console.error("Save error:", error);
    toast.error("Failed to save settings.");
  } finally {
    setIsSaving(false);
  }
};
const fetchPfSettings = async (companyId) => {
  // Defensive check: Ensure we have a valid ID before making the network request
  if (!companyId || companyId === "[object Object]") {
    console.error("PF Fetch blocked: Invalid Company ID:", companyId);
    return;
  }
    try {
        const response = await axios.get(`${ServerConfig.url}/PfSettings/${companyId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data) {
            const data = response.data;
            
            // Map the DTO properties back to your UI rowData
            const updatedRows = rowData.map(row => {
                switch (row.label) {
                    case "Effective Month From": return { ...row, value: data.effectiveMonthFrom };
                    case "Effective From Year": return { ...row, value: data.effectiveFromYear };
                    case "PF Contribution (%)": return { ...row, value: data.pfContribution };
                    case "Max Ceiling": return { ...row, value: data.maxCeiling };
                    case "Inc Earnings for PF value below ceiling": return { ...row, value: data.pfBelowCeiling };
                    case "EPF Contribution (%)": return { ...row, value: data.epfContribution };
                    case "Upper Limit": return { ...row, value: data.upperLimit };
                    case "EPS Contribution (%)": return { ...row, value: data.epsContribution };
                    case "Eligibility Amount": return { ...row, value: data.eligibilityAmount };
                    case "Admin Charges (%)": return { ...row, value: data.adminCharges };
                    case "Rounding Options": return { ...row, value: data.roundingOptions };
                    default: return row;
                }
            });

            setRowData(updatedRows);
            setOriginalRowData(JSON.parse(JSON.stringify(updatedRows)));
        }
    } catch (error) {
        if (error.response?.status === 404) {
            console.log("No settings found, keeping default values.");
        } else {
            console.error("Error fetching PF settings:", error);
        }
    }
};
useEffect(() => {
  const initialize = async () => {
    if (token) {
      await fetchallData();
    }
  };
  
  initialize();
}, [token]); // Only runs when the token is available or changes
  return (
    <Grid container style={{ backgroundColor: "#f5f5f5" }}>
      <Grid item xs={12}>
        <Navbar />
      </Grid>
      <Grid item xs={12} sx={{ display: "flex" }}>
        <Sidenav />
        <Grid item xs={12} sm={10} md={8} lg={7} sx={{ padding: "40px", margin: "0 auto" }}>
          <AppBar position="static" sx={{ marginTop: "70px", minHeight: "60px" }}>
            <Toolbar>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "white" }}>
                PF SETTINGS
              </Typography>
            </Toolbar>
          </AppBar>

          <Box sx={{ mt: 4 }}>
            <div className="ag-theme-alpine" style={{ width: "100%", overflowY: "auto" }}>
              {isLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                  <CircularProgress />
                </Box>
              ) : (
                <AgGridReact
                  columnDefs={columns}
                  rowData={rowData}
                  onCellValueChanged={handleCellValueChange}
                  domLayout="autoHeight"
                  getRowHeight={() => 35}
                  getRowStyle={(params) => ({
                    backgroundColor: params.node.rowIndex % 2 === 0 ? "#e3f2fd" : "#ffffff",
                  })}
                />
              )}
            </div>

            <Box display="flex" justifyContent="flex-end" mt={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
              
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PFvalues;
