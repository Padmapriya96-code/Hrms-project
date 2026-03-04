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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import { postRequest } from "../../serverconfiguration/requestcomp";
import { ServerConfig } from "../../serverconfiguration/serverconfig";
import { REPORTS, SAVE } from "../../serverconfiguration/controllers";
import Navbar from "../Home Page-comapny/Navbar1";
import Sidenav from "../Home Page-comapny/Sidenav1";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { toast } from "react-toastify";
import axios from "axios";


const PaymLeaveMaster1 = () => {
  const [company, setCompany] = useState([]);
  const [branch, setBranch] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [pnCompanyId, setPnCompanyId] = useState("");
  const [isloggedin, setIsloggedin] = useState(sessionStorage.getItem("user"));
  const [filteredData, setFilteredData] = useState([]);
  const [branchFilter, setBranchFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [openView, setOpenView] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [originalData, setOriginalData] = useState([]);
  const [modifiedRows, setModifiedRows] = useState({});
  const authStr=sessionStorage.getItem("auth");
  const auth=authStr?JSON.parse(authStr):null;
  const token=auth?.token;
   ServerConfig.url = "https://localhost:7266/api";

  
  const getStatusChar = (label) =>
    label === "Active"
      ? "A"
      : label === "Inactive"
      ? "I"
      : label === "Pending"
      ? "P"
      : "";

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
      }
    }catch(error){
      console.error("Failed to fetch company",{
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    }
    };

  const fetchBranchData = async () => {
  // ✅ Stop if companyId is missing
  if (!pnCompanyId) {
    console.log("Skipping branch fetch - no pnCompanyId");
    return;
  }

  // ✅ Stop if token is missing
  if (!token) {
    toast.error("User not logged in");
    return;
  }

  try {
    console.log("Fetching branches for company:", pnCompanyId);
    const res = await axios.get(
      `${ServerConfig.url}/PaymBranches/by-company/${pnCompanyId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    console.log("Branch Data Fetched:", res.data);
    const normalized = res.data.map(b => ({
      pnBranchId: b.pnBranchId || b.PnBranchId,
      branchName: b.branchName || b.BranchName
    }));
    console.log("Normalized Branch Data:", normalized);
    setBranch(normalized);
  } catch (error) {
    console.error(
      "Failed to fetch branch",
      {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      }
    );
  }
};

  const fetchLeaveData = async () => {
    
    
    try{
      if (!pnCompanyId) return;
      console.log("Fetching for Company:", pnCompanyId)
      const url=(branchFilter&&branchFilter!=="0")?`${ServerConfig.url}/PaymLeaves/${pnCompanyId}/${branchFilter}`
      :`${ServerConfig.url}/PaymLeaves/${pnCompanyId}`;
      const res=await axios.get(url,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      //MAP API RESPONSE TO GRID DATA FORMAT
      const formattedData=(res.data||[]).map(item=>({
        pnCompanyId: item.pnCompanyId,
        pnLeaveId: item.pnLeaveId,
        vLeaveName: item.vLeaveName,
        pnLeaveCode: item.pnLeaveCode,
        pnCount: item.pnCount,
        status: item.status,
        pnBranchId: item.pnBranchId,
        
        maxDays: item.maxDays,
        type: item.type
      }));
      setGridData(formattedData);
      setOriginalData(JSON.parse(JSON.stringify(formattedData)));//for change tracking
      setModifiedRows({});
    }
    catch(err){
      console.error("Failed to fetch leave data:", err);
    }
  };

  const fetchAllData = async () => {
    await fetchCompanyData();
    await fetchBranchData();
    await fetchLeaveData();
  };

  useEffect(() => {
    fetchAllData();
  }, [isloggedin, pnCompanyId]);

  useEffect(() => {
    let data = gridData;
    if (branchFilter)
      data = data.filter((row) => row.pnBranchId=== branchFilter);
    if (typeFilter) data = data.filter((row) => row.Type === typeFilter);
    setFilteredData(data);
  }, [gridData, branchFilter, typeFilter]);

  const handleAddRow = () => {
    const lastRow = gridData[gridData.length - 1];
    if (
      lastRow &&
      (!lastRow.vLeaveName ||
        !lastRow.pnLeaveCode ||
        !lastRow.pnCount ||
        !lastRow.status ||
        !lastRow.pnBranchId ||
        !lastRow.maxDays ||
        !lastRow.type)
    ) {
      toast.dismiss();
      toast.warning(
        "Please fill all fields in the current row before adding a new one.",
        { position: "top-center", autoClose: 1000 }
      );
      return;
    }
    const newRow = {
      pnCompanyId,
      vLeaveName: "",
      pnLeaveCode: "",
      pnCount: null,
      status: "Active",
      pnBranchId: branch.length > 0 ? branch[0].pnBranchId : null,
      maxDays: null,
      type: "",
      isNew: true,
    };
    setGridData((prev) => [...prev, newRow]);
  };
  const onCellValueChanged = (params) => {
  const { data } = params;
  // This updates the specific row in your gridData state
  setGridData((prev) =>
    prev.map((row) => (row === params.data ? { ...data } : row))
  );
  
  // If you are tracking modified rows for the Update button:
  if (!data.isNew) {
    setModifiedRows((prev) => ({ ...prev, [data.pnLeaveId]: true }));
  }
};

  const handleSaveAll = async () => {
    try {
      const newRows = gridData.filter((r) => r.isNew);
      if (!newRows.length) {
        toast.error("No new data to save");
        return;
      }

      for (const row of newRows) {
        if (
          !row.vLeaveName ||
          !row.pnLeaveCode ||
          !row.pnCount ||
          !row.status ||
          !row.pnBranchId ||
          row.maxDays === null || row.maxDays === undefined ||
          !row.type
        ) {
          console.log("Validation failed for row:", row);
          toast.error("Please fill all fields for new rows before saving");
          return;
        }
      }
      if (!token) {
      toast.error("Session expired. Please login again.");
      return;
    }

      const savePromises=newRows.map((row)=>{
        const payload={
          pnCompanyId:Number(pnCompanyId),
          
          vLeaveName:row.vLeaveName,
          pnLeaveCode:row.pnLeaveCode,
          pnCount:Number(row.pnCount),
          status:getStatusChar(row.status),
          pnBranchId: Number(row.pnBranchId),
        
        maxDays: row.maxDays !==null ?Number(row.maxDays):0,
        
        type: row.type
        };
      
      return axios.post(`${ServerConfig.url}/PaymLeaves`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      });
      await Promise.all(savePromises);
    
    toast.success("Data saved successfully");
    await fetchLeaveData(); // Refresh grid with DB-generated IDs
    } catch (error) {
      toast.error("Failed to save data");
    }
  };

  const handleUpdateRow = async (rowData) => {
  try {
    
    if (!token) {
      toast.error("Session expired. Please login again.");
      return;
    }

     
      ;

    // 2. Prepare Payload using camelCase keys (matching your DTO)
    const payload = {
      pnCompanyId: Number(pnCompanyId),
      pnLeaveId: Number(rowData.pnLeaveId), // Primary Key segment
      vLeaveName: rowData.vLeaveName,
      pnLeaveCode: rowData.pnLeaveCode,
      pnCount: Number(rowData.pnCount),
      status: getStatusChar(rowData.status), // Ensure "Active" -> "A"
      pnBranchId: Number(rowData.pnBranchId),
       
      maxDays: Number(rowData.maxDays),
      
      type: rowData.type
    };

    // 3. Axios PUT request
    await axios.put(`${ServerConfig.url}/PaymLeaves`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 4. Cleanup modification state
    setModifiedRows((prev) => {
      const copy = { ...prev };
      delete copy[rowData.pnLeaveId];
      return copy;
    });

    toast.success("Data updated successfully");
    await fetchLeaveData(); // Refresh to sync UI with DB

  } catch (error) {
    console.error("Update error:", error);
    const errorMsg = error.response?.data?.message || "Failed to update data";
    toast.error(errorMsg);
  }
};

  const handleDeleteRow = async (rowData) => {
  // 1. Handle unsaved (new) rows locally without calling the API
  if (rowData.isNew || !rowData.pnLeaveId) {
    setGridData((prev) => prev.filter((r) => r !== rowData));
    toast.info("Unsaved row removed");
    return;
  }

  if (!window.confirm("Are you sure you want to delete this leave record?")) return;

  try {
     if (!token) {
      toast.error("Session expired. Please login again.");
      return;
    }
    // 3. Construct URL using Composite Key: /api/PaymLeave/{companyId}/{leaveId}
    const companyId = Number(pnCompanyId);
    const leaveId = Number(rowData.pnLeaveId);
    const url = `${ServerConfig.url}/PaymLeaves/${companyId}/${leaveId}`;

    // 4. Axios DELETE request
    await axios.delete(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    toast.info("Data deleted successfully");
    
    // 5. Refresh grid to ensure UI is in sync with database
    await fetchLeaveData();

  } catch (error) {
    console.error("Delete error:", error);
    const errorMsg = error.response?.data?.message || "Delete failed";
    toast.error(errorMsg);
  }
};
 // ✅ View record dialog
  const handleViewRow = (rowData) => {
    setViewData(rowData);
    setOpenView(true);
  };

  const columnDefs = [
    { headerName: "LEAVE CODE", field: "pnLeaveCode", editable: true },
    { headerName: "LEAVE NAME", field: "vLeaveName", editable: true },
    {
      headerName: "Branch",
      field: "pnBranchId",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: branch.map((b) => b.branchName) },
      valueGetter: (params) =>
        branch.find((b) => b.pnBranchId === params.data.pnBranchId)
          ?.branchName || "",
      valueSetter: (params) => {
        const selected = branch.find((b) => b.branchName === params.newValue);
        if (selected) {
          params.data.pnBranchId = selected.pnBranchId;
          return true;
        }
        return false;
      },
      minWidth: 150,
    },
    {
      headerName: "TYPE",
      field: "type",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: ["Casual", "Sick", "Earned", "Other"] },
    },
    { headerName: "COUNT", field: "pnCount", editable: true },
    {
      headerName: "Status",
      field: "status",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: ["Active", "Inactive", "Pending"] },
    },
    

    { headerName: "MAX DAYS", field: "maxDays", editable: true ,valueParser: params => {
    const val = params.newValue;
    return val === '' || val === null ? null : Number(val);
  }},
  
    {
      headerName: "ACTION",
      cellRenderer: (params) => (
        
        <Box sx={{display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', // Centers them in the cell
  gap: 0.5, 
  width: '100%',
  overflow: 'visible'}}>
    <Button variant="outlined" size="small" sx={{ minWidth: '60px', height: '30px', fontSize: '0.75rem' }} onClick={() => handleViewRow(params.data)}>
      View
    </Button>
    {/* Hide edit for new rows, show for saved ones */}
    {!params.data.isNew && (
      <Button variant="outlined" size="small" sx={{ minWidth: '60px', height: '30px', fontSize: '0.75rem' }} onClick={() => handleUpdateRow(params.data)}>
        Edit
      </Button>
    )}
    <IconButton 
    color="error" 
    size="small" 
    onClick={() => handleDeleteRow(params.data)}
    sx={{ padding: '4px' }} // Tightens the hit area
  >
    <DeleteOutlineIcon fontSize="small" />
  </IconButton>
  </Box>
      ),
    },
  ];

  return (
    <Grid container sx={{ minHeight: "100vh", backgroundColor: "#f0f4f8" }}>
      <Navbar />
      <Grid item xs={12} sx={{ display: "flex" }}>
        <Sidenav />
        <Grid item xs={12} sm={10} sx={{ p: 5, margin: "100px auto" }}>
          <AppBar
            position="static"
            sx={{
              mb: 3,
              borderRadius: 2,
              background: "linear-gradient(90deg, #6a11cb, #2575fc)",
            }}
          >
            <Toolbar>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", color: "#fff" }}
              >
                Leave Master
              </Typography>
            </Toolbar>
          </AppBar>

          <Card
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              background: "linear-gradient(90deg, #6a11cb, #2575fc)",
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: "#000" }}></InputLabel>
                  <Select
                    value={branchFilter}
                    onChange={(e) => setBranchFilter(e.target.value)}
                    sx={{ bgcolor: "#fff", color: "#000" }} displayEmpty
                  >
                    <MenuItem value="">All Branches</MenuItem>
                    {branch.map((b) => (
                      <MenuItem key={b.pnBranchId} value={b.pnBranchId}>
                        {b.branchName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: "#000" }}></InputLabel>
                  <Select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    sx={{ bgcolor: "#fff", color: "#000" }} displayEmpty
                  >
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="Casual">Casual</MenuItem>
                    <MenuItem value="Sick">Sick</MenuItem>
                    <MenuItem value="Earned">Earned</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4} sx={{ textAlign: { md: "right" } }}>
                <Button
                  onClick={handleAddRow}
                  sx={{ mr: 2, background: "#ff4b1f", color: "#fff" }}
                >
                  Add Leave
                </Button>
                <Button
                  onClick={handleSaveAll}
                  sx={{
                    background: "linear-gradient(45deg,#1fddff,#45f3ff)",
                    color: "#000",
                  }}
                >
                  Save All
                </Button>
              </Grid>
            </Grid>
          </Card>

          <Box
            className="ag-theme-alpine"
            sx={{ borderRadius: 3, overflow: "hidden", boxShadow: 3, mb: 3 }}
          >
            <AgGridReact
              rowData={filteredData}
              columnDefs={columnDefs}
              onCellValueChanged={onCellValueChanged}
              domLayout="autoHeight"
              rowHeight={50}
              defaultColDef={{ flex: 1, minWidth: 120, resizable: true }}
              pagination
              paginationPageSize={10}
              animateRows
              getRowStyle={(params) => ({
                backgroundColor:
                  params.node.rowIndex % 2 === 0 ? "#e0f7fa" : "#ffffff",
              })}
            />
          </Box>

          <Dialog
            open={openView}
            onClose={() => setOpenView(false)}
            PaperProps={{
              sx: {
                borderRadius: 3,
                background: "linear-gradient(135deg, #f6d365, #fda085)",
                p: 3,
              },
            }}
          >
            <DialogTitle sx={{ fontWeight: "bold", color: "#333" }}>
              Leave Details
            </DialogTitle>
            <DialogContent>
              {viewData && (
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  <Typography>
                    <strong>Branch:</strong>{" "}
                    {branch.find((b) => b.pnBranchId === viewData.pnBranchId)
                      ?.branchName || ""}
                  </Typography>
                  <Typography>
                    <strong>Leave Name:</strong> {viewData.vLeaveName}
                  </Typography>
                  <Typography>
                    <strong>Type:</strong> {viewData.type}
                  </Typography>
                  <Typography>
                    <strong>Leave code:</strong> {viewData.pnLeaveCode}
                  </Typography>
                  
                  <Typography>
                    <strong>count:</strong> {viewData.pnCount}
                  </Typography>
                  <Typography>
                    <strong>status:</strong> {viewData.status}
                  </Typography>
                  <Typography>
                    <strong>Max Days:</strong> {viewData.maxDays}
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setOpenView(false)}
                sx={{
                  background: "linear-gradient(45deg,#ff416c,#ff4b2b)",
                  color: "#fff",
                  fontWeight: "bold",
                  "&:hover": { opacity: 0.9 },
                }}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PaymLeaveMaster1;
