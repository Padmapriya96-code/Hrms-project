import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Grid,
  Button,
  Typography,
  Box,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Card,
  AppBar,
  Toolbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import { toast } from "react-toastify";
import { postRequest } from "../../serverconfiguration/requestcomp";
import { ServerConfig } from "../../serverconfiguration/serverconfig";
import { REPORTS, SAVE } from "../../serverconfiguration/controllers";
import Navbar from "../Home Page-comapny/Navbar1";
import Sidenav from "../Home Page-comapny/Sidenav1";
import axios from "axios";


const JobStatusFormMaster = () => {
  const [branch, setBranch] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [modifiedRows, setModifiedRows] = useState({});
  const [pnCompanyId, setPnCompanyId] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [viewData, setViewData] = useState(null);
  const [openView, setOpenView] = useState(false);
  const [company, setCompany] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const[pnBranchId,setPnBranchId]=useState("");
  const authStr=sessionStorage.getItem("auth");
    const auth=authStr?JSON.parse(authStr):null;
    const token=auth?.token;
    ServerConfig.url = "https://localhost:7266/api";
  const databaseName = sessionStorage.getItem("databaseName"); // ✅ Dynamic DB name


  const getStatusLabel = (char) => {
    switch (char) {
      case "A": return "Active";
      case "I": return "Inactive";
      case "P": return "Pending";
      default: return "";
    }
  };

  const getStatusChar = (label) => {
    switch (label) {
      case "Active": return "A";
      case "Inactive": return "I";
      case "Pending": return "P";
      default: return "";
    }
  };

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
  

 

const fetchJobStatusData = async () => {
  // Use branchFilter because that's what your dropdown updates
  if (!pnCompanyId) return;

  const authStr = sessionStorage.getItem("auth");
  const token = authStr ? JSON.parse(authStr)?.token : null;

const url = branchFilter 
    ? `${ServerConfig.url}/PaymJobStatus/${pnCompanyId}/${branchFilter}`
    : `${ServerConfig.url}/PaymJobStatus/${pnCompanyId}`;
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    // The URL must match your [HttpGet("{companyId}/{branchId}")]
    const response = await axios.get(
      url, 
      config
    );
    
    if (response.data) {
      const formattedData = response.data.map((item) => ({
        // We map these to camelCase to match your JobStatusDto exactly
        pnJobStatusId: item.pnJobStatusId,
        branchId: item.branchId,          
        vJobStatusName: item.vJobStatusName,
        status: getStatusLabel(item.status), 
        isNew: false,                       
      }));

      setGridData(formattedData);
    }
  } catch (error) {
    console.error("Fetch failed:", error);
  }
};
  const fetchAllData = async () => {
    await fetchCompanyData();
    await fetchBranchData();
    await fetchJobStatusData();
  };

  useEffect(() => { fetchAllData(); }, [pnCompanyId]);

  const isRowModified = useCallback((rowData) => {
    if (rowData.isNew) return false;
    const originalRow = originalData.find(r => r.pnJobStatusId === rowData.pnJobStatusId);
    if (!originalRow) return false;
    return originalRow.branchId !== rowData.branchId ||
           originalRow.vJobStatusName !== rowData.vJobStatusName ||
           originalRow.status !== rowData.status;
  }, [originalData]);

  const handleCellValueChanged = useCallback((params) => {
    const rowData = params.data;
    if (!rowData.isNew) {
      setModifiedRows(prev => ({ ...prev, [rowData.pnJobStatusId]: isRowModified(rowData) }));
    }
    params.api.refreshCells({ rowNodes: [params.node], force: true });
  }, [isRowModified]);

  // const handleAddRow = () => {
  //   const lastRow = gridData[gridData.length - 1];
  //   if (lastRow && (!lastRow.branchId || !lastRow.vJobStatusName || !lastRow.status)) {
  //     toast.warning("Please fill all fields in the current row before adding a new one.");
  //     return;
  //   }
  //   setGridData(prev => [...prev, { pnCompanyId, branchId: "", vJobStatusName: "", status: "", isNew: true }]);
  // };
  const handleAddRow = () => {
  const newRow = {
    pnCompanyId: pnCompanyId,
    branchId: branchFilter, // Auto-assign the selected branch from your dropdown
    vJobStatusName: "",
    status: "Active",
    isNew: true,
  };
  setGridData([newRow, ...gridData]);
};

  const handleSaveAll = async () => {
  const newRows = gridData.filter(r => r.isNew);
  if (!newRows.length) return;

  // 1. Get your token (using your existing logic)
  const authStr = sessionStorage.getItem("auth");
  const auth = authStr ? JSON.parse(authStr) : null;
  const token = auth?.token;

  if (!token) {
    toast.error("Session expired. Please login again.");
    return;
  }

  try {
    const payload = newRows.map(row => ({
      pnCompanyId: Number(pnCompanyId),
      branchId: Number(row.branchId),
      vJobStatusName: row.vJobStatusName,
      status: getStatusChar(row.status)
    }));

    // 2. Define the header config
    const config = {
      headers: {
        Authorization: `Bearer ${token}` 
      }
    };

    // 3. Pass the config as the THIRD argument
    const savePromises = payload.map(data => 
      axios.post(`${ServerConfig.url}/PaymJobStatus`, data, config)
    );

    await Promise.all(savePromises);
    toast.success("Saved successfully");
    fetchJobStatusData(); 

  } catch (error) {
    console.error("Save failed:", error);
    if (error.response?.status === 401) {
      toast.error("Unauthorized: Your session may have expired.");
    } else {
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  }
};

  const handleUpdateRow = async (rowData) => {
    // 1. Get token
  const authStr = sessionStorage.getItem("auth");
  const token = authStr ? JSON.parse(authStr)?.token : null;

  if (!token) {
    toast.error("Session expired. Please login again.");
    return;
  }
  try {
    // 1. Prepare the payload matching your C# JobStatusDto
    const payload = {
      pnCompanyId: parseInt(pnCompanyId), // From your global state/context
      branchId: parseInt(rowData.branchId),
      pnJobStatusId: rowData.pnJobStatusId,
      vJobStatusName: rowData.vJobStatusName,
      status: getStatusChar(rowData.status) // Converts 'Active' -> 'A'
    };
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    // 2. Call the PUT method on your controller
    await axios.put(`${ServerConfig.url}/PaymJobStatus`, payload, config);

    // 3. Clear the modification state for this row
    setModifiedRows(prev => { 
      const copy = { ...prev }; 
      delete copy[rowData.pnJobStatusId]; 
      return copy; 
    });

    toast.success("Updated successfully");
    
    // 4. Refresh data to ensure the grid is in sync with the DB
    fetchJobStatusData(); 

  } catch (error) {
    console.error("Update failed:", error);
    const errorMsg = error.response?.data?.message || "An error occurred while updating";
    toast.error(errorMsg);
  }
};

  const handleDeleteRow = async (rowData) => {
    if (rowData.isNew) {
              setGridData(prev =>
                prev.filter(row => row !== rowData)
              );
              toast.info("Unsaved row removed");
              return;
            }
  // 1. Safety check
  if (!window.confirm("Are you sure you want to delete this record?")) return;
   
   // 1. Get token
  const authStr = sessionStorage.getItem("auth");
  const token = authStr ? JSON.parse(authStr)?.token : null;

  if (!token) {
    toast.error("Session expired. Please login again.");
    return;
  }

  try {
    // 2. Build the query parameters to match the composite key requirements
    // Note: Use camelCase keys to match the rowData structure
    const params = {
      companyId: pnCompanyId, // From your global state
      branchId: rowData.branchId,
      name: rowData.vJobStatusName
    };
     const config = {
      headers: { Authorization: `Bearer ${token}` }
    };


    // 3. Perform the DELETE request
    await axios.delete(`${ServerConfig.url}/PaymJobStatus`, { params, ...config });

    toast.info("Deleted successfully");

    // 4. Refresh the grid data
    fetchJobStatusData();

  } catch (error) {
    console.error("Delete failed:", error);
    const errorMsg = error.response?.data?.message || "An error occurred while deleting";
    toast.error(errorMsg);
  }
};
  const handleViewRow = (rowData) => { setViewData(rowData); setOpenView(true); };

  const columnDefs = useMemo(() => [
    {
      headerName: "Branch",
      field: "branchId",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: branch.map(b => b.branchName) },
      // valueGetter: params => branch.find(b => b.pnBranchId === params.data.pnBranchId)?.branchName || "",
      // valueSetter: params => {
      //   const selected = branch.find(b => b.branchName === params.newValue);
      //   if (selected) { params.data.pnBranchId = selected.pnBranchId; return true; }
      //   return false;
      // },
      valueGetter: params => {
    const selectedBranch = branch.find(b => b.pnBranchId === params.data.branchId);
    return selectedBranch ? selectedBranch.branchName : "";
  },
  // Update: Convert the Name (string) back to ID (number) when user picks a value
  valueSetter: params => {
    const selected = branch.find(b => b.branchName === params.newValue);
    if (selected) {
      params.data.branchId = selected.pnBranchId; // Update the DTO-friendly key
      return true;
    }
    return false;
    },
  },
    { headerName: "Job Status Name", field: "vJobStatusName", editable: true },
    { headerName: "Status", field: "status", editable: true, cellEditor: "agSelectCellEditor", cellEditorParams: { values: ["Active","Inactive","Pending"] } },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          {/* <IconButton color="success" onClick={() => handleUpdateRow(params.data)} disabled={!modifiedRows[params.data.pn_JobStatusID]}><DoneOutlineIcon /></IconButton> */}
          <Button variant="outlined" size="small" onClick={() => handleViewRow(params.data)}>View</Button>
          <Button variant="outlined" size="small" onClick={() => handleUpdateRow(params.data)} disabled={!modifiedRows}>Edit</Button>
          <IconButton color="error" onClick={() => handleDeleteRow(params.data)}><DeleteOutlineIcon /></IconButton>
        </Box>
      ),
    }
  ], [branch, modifiedRows]);

  const filteredData = useMemo(() => gridData.filter(row => 
    (!statusFilter || row.status === statusFilter) &&
    (!branchFilter || String(row.branchId) === String(branchFilter))
  ), [gridData, statusFilter, branchFilter]);

  return (
    <Grid container sx={{ minHeight: "100vh", backgroundColor: "#f0f4f8" }}>
      <Navbar />
      <Grid item xs={12} sx={{ display: "flex" }}>
        <Sidenav />
        <Grid item xs={12} sm={10} sx={{ p: 5, margin: "100px auto" }}>
          {/* AppBar */}
          <AppBar position="static" sx={{ mb: 3, borderRadius: 2, background: "linear-gradient(90deg, #6a11cb, #2575fc)" }}>
            <Toolbar>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "#fff" }}>Job Status Master</Typography>
            </Toolbar>
          </AppBar>

          {/* Filters */}
          <Card sx={{ p: 3, mb: 3, borderRadius: 3, background: "linear-gradient(90deg, #6a11cb, #2575fc)" }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: "#fff" }}>Branch</InputLabel>
                  <Select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)} sx={{ bgcolor: "#fff", color: "#000" }}
                    renderValue={(selected) => {
      if (selected === "") {
        return "All Branches"; // 👈 Forces the text to show when value is ""
      }
      const selectedBranch = branch.find(b => b.pnBranchId === selected);
      return selectedBranch ? selectedBranch.branchName : "All Branches";
    }}>
                    <MenuItem value="">All Branches</MenuItem>
                    {branch.map(b => <MenuItem key={b.pnBranchId} value={b.pnBranchId}>{b.branchName}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: "#fff" }}>Status</InputLabel>
                  <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} sx={{ bgcolor: "#fff", color: "#000" }}
                    renderValue={(selected) => {
      if (selected === "") {
        return "All Status"; // 👈 Forces the text to show when value is ""
      }
        return selected;
    }}>
                    <MenuItem value="">All Status</MenuItem>
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4} sx={{ textAlign: { md: "right" } }}>
                <Button onClick={handleAddRow} sx={{ mr: 2, background: "#ff4b1f", color: "#fff" }}>Add Job Status</Button>
                <Button onClick={handleSaveAll} sx={{ background: "linear-gradient(45deg,#1fddff,#45f3ff)", color: "#000" }}>Save All</Button>
              </Grid>
            </Grid>
          </Card>

          {/* AG Grid */}
          <Box className="ag-theme-alpine" sx={{ borderRadius: 3, overflow: "hidden", boxShadow: 3, mb: 3 }}>
            <AgGridReact
              rowData={filteredData}
              columnDefs={columnDefs}
              domLayout="autoHeight"
              defaultColDef={{ flex: 1, minWidth: 120, resizable: true }}
              pagination={true}
              paginationPageSize={10}
              paginationPageSizeSelector={[10, 20, 50, 100]}
              animateRows
              onCellValueChanged={handleCellValueChanged}
              context={{ modifiedRows }}
              getRowStyle={(params) => ({
                backgroundColor: params.node.rowIndex % 2 === 0 ? "#e0f7fa" : "#ffffff",
              })}
            />
          </Box>

          {/* View Dialog */}
          <Dialog open={openView} onClose={() => setOpenView(false)} PaperProps={{ sx: { borderRadius: 3, background: "linear-gradient(135deg, #f6d365, #fda085)", p: 3 } }}>
            <DialogTitle sx={{ fontWeight: "bold", color: "#333" }}>Job Status Details</DialogTitle>
            <DialogContent>
              {viewData && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, height: "100px" }}>
                  <Typography><strong>Branch:</strong> {branch.find(b => b.branchId === viewData.pnbranchId)?.branchName || ""}</Typography>
                  <Typography><strong>Job Status Name:</strong> {viewData.vJobStatusName}</Typography>
                  <Typography><strong>Status:</strong> {viewData.status}</Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenView(false)} sx={{ background: "linear-gradient(45deg,#ff416c,#ff4b2b)", color: "#fff", fontWeight: "bold", "&:hover": { opacity: 0.9 } }}>Close</Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default JobStatusFormMaster;
