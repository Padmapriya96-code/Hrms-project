import React, { useState, useEffect, useMemo,useRef, useCallback } from "react";
import {
  Grid,
  Button,
  Typography,
  Box,
  IconButton,
  AppBar,
  Toolbar,
  MenuItem,
  Paper,
  Card,
  FormControl,
  Select,
  InputLabel,
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import { toast } from "react-toastify";
import { postRequest } from "../../serverconfiguration/requestcomp";
import { ServerConfig } from "../../serverconfiguration/serverconfig";
import { REPORTS, SAVE } from "../../serverconfiguration/controllers";
import Navbar from "../Home Page-comapny/Navbar1";
import Sidenav from "../Home Page-comapny/Sidenav1";
import axios from "axios";


const Grade1copy = () => {
  const [company, setCompany] = useState([]);
  const [branch, setBranch] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [modifiedRows, setModifiedRows] = useState({});
  const [pnCompanyId, setPnCompanyId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [viewData, setViewData] = useState(null);
  const [openView, setOpenView] = useState(false);
  const gridRef = useRef(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const databaseName = sessionStorage.getItem("databaseName"); // ✅ get DB name dynamically
  const authStr=sessionStorage.getItem("auth");
        const auth=authStr?JSON.parse(authStr):null;
        const token=auth?.token;
        ServerConfig.url = "https://localhost:7266/api";

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

  useEffect(() => {
  fetchBranchData();
}, [pnCompanyId]);

  const fetchGradeData = async () => {
    if(!pnCompanyId)return;
    try{
      const response=await axios.get(`${ServerConfig.url}/PaymGrades/company/${pnCompanyId}`,
        {
          headers:{
            Authorization:`Bearer ${token}`}
          }
      );
    
    const formattedData = response.data.map(item => ({
      pnCompanyId: item.pnCompanyId,
      pnBranchId: item.branchId,
      pnGradeId: item.pnGradeId,
      vGradeName: item.vGradeName,
      status: getStatusLabel(item.status),
    }));
    setGridData(formattedData || []);
    setOriginalData(JSON.parse(JSON.stringify(formattedData)) || []);
    setModifiedRows({});
  }

  catch(error){console.error("Error fetching grade data:",error);

  }
};
  const fetchAllData = async () => {
    await fetchCompanyData();
    await fetchBranchData();
    await fetchGradeData();
  };
  useEffect(() => { fetchAllData(); }, [pnCompanyId]);

  const isRowModified = useCallback((rowData) => {
    if (rowData.isNew) return false;
    const originalRow = originalData.find(r => r.pnGradeId === rowData.pnGradeId);
    if (!originalRow) return false;
    return (
      String(originalRow.pnBranchId) !== String(rowData.pnBranchId) ||
      String(originalRow.vGradeName) !== String(rowData.vGradeName) ||
      String(originalRow.status) !== String(rowData.status)
    );
  }, [originalData]);

  const handleCellValueChanged = useCallback((params) => {
    const rowData = params.data;
    if (!rowData.isNew) {
      const modified = isRowModified(rowData);
      setModifiedRows(prev => ({ ...prev, [rowData.pnGradeId]: modified }));
    }
    params.api.refreshCells({ rowNodes: [params.node], force: true });
  }, [isRowModified]);

  const handleAddRow = () => {
    const lastRow = gridData[gridData.length - 1];
    if (lastRow && (!lastRow.pnBranchId || !lastRow.vGradeName || !lastRow.status)) {
      toast.warning("Please fill all fields in the current row before adding a new one.");
      return;
    }
    setGridData(prev => [...prev, { pnCompanyId, pnBranchId: "", vGradeName: "", status: "", isNew: true }]);
  };

  const handleSaveAll = async () => {
    // 1. Force AG Grid to commit current edits
  gridRef.current.api.stopEditing();
    // 2. Filter for new rows
  const newRows = gridData.filter(r => r.isNew);
  if (newRows.length === 0) {
    toast.error("No new rows to save");
    return;
  }

  // 3. Validation and Mapping to DTO structure
  const payload = [];
  for (const row of newRows) {
    if (!row.pnBranchId || !row.vGradeName || !row.status) {
      toast.error("Please fill all fields before saving");
      return;
    }

    payload.push({
      PnCompanyId: row.pnCompanyId,
      BranchId: Number(row.pnBranchId), // 👈 Matches 'public int BranchId' in C#
  PnGradeId: 0,                    // Usually 0 for new records (identity column)
  VGradeName: row.vGradeName,       // Matches 'public string VGradeName'
  Status: getStatusChar(row.status) // Converts 'Active' -> 'A'
    });
  }

  try {
    // 4. Axios POST request
    const response = await axios.post(
      `${ServerConfig.url}/PaymGrades/bulk-save`,
      payload,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (response.status === 200) {
      toast.success("Saved successfully");
      fetchAllData(); // Refresh grid to remove 'isNew' flags
    }
  } catch (error) {
    console.error("Save Error:", error);
    toast.error(error.response?.data || "Failed to save records");
  }
  };

  const handleUpdateRow = async (rowData) => {
  try {
    const payload = {
      pnCompanyId: rowData.pnCompanyId,
      BranchId: Number(rowData.pnBranchId), // Match DTO property naming
      PnGradeId: rowData.pnGradeId,
      VGradeName: rowData.vGradeName,
      Status: getStatusChar(rowData.status)
    };

    await axios.put(
      `${ServerConfig.url}/PaymGrades`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Clear the modified state for this specific row
    setModifiedRows(prev => {
      const copy = { ...prev };
      delete copy[rowData.pnGradeId];
      return copy;
    });

    toast.success("Updated successfully");
    fetchAllData();
  } catch (error) {
    console.error("Update error:", error);
    toast.error("Failed to update record");
  }
};
  const handleDeleteRow = async (rowData) => {
     // ✅ If it is new row (not saved)
      if (rowData.isNew) {
        setGridData(prev =>
          prev.filter(row => row !== rowData)
        );
        toast.info("Unsaved row removed");
        return;
      }
  if (!window.confirm("Are you sure you want to delete this grade?")) return;
// Passing keys as query parameters for the Delete request
  try {
    await axios.delete(
      `${ServerConfig.url}/PaymGrades`,
      { headers: { Authorization: `Bearer ${token}` } ,
      params: {
        companyId: rowData.pnCompanyId,
        branchId: Number(rowData.pnBranchId),
        gradeName: rowData.vGradeName
      }
  });

    toast.info("Deleted successfully");
    fetchAllData();
  } catch (error) {
    console.error("Delete error:", error);
    toast.error("Delete failed: " + (error.response?.data?.title || "Check parameters"));
  }
};

  const handleViewRow = (rowData) => { setViewData(rowData); setOpenView(true); };

  const columnDefs = useMemo(() => [
    {
      headerName: "Branch",
      field: "pnBranchId",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: branch.map(b => b.branchName) },
      valueGetter: params => branch.find(b => b.pnBranchId === params.data.pnBranchId)?.branchName || "",
      valueSetter: params => {
        const selected = branch.find(b => b.branchName === params.newValue);
        if (selected) { params.data.pnBranchId = selected.pnBranchId; return true; }
        return false;
      },
    },
    { headerName: "Grade Name", field: "vGradeName", editable: true },
    { headerName: "Status", field: "status", editable: true, cellEditor: "agSelectCellEditor", cellEditorParams: { values: ["Active","Inactive","Pending"] } },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton color="primary" onClick={() => handleViewRow(params.data)}><VisibilityIcon /></IconButton>
          <IconButton color="success" onClick={() => handleUpdateRow(params.data)} disabled={!modifiedRows[params.data.pnGradeId]}><DoneOutlineIcon /></IconButton>
          <IconButton color="error" onClick={() => handleDeleteRow(params.data)}><DeleteOutlineIcon /></IconButton>
        </Box>
      ),
    }
  ], [branch, modifiedRows]);

  const filteredData = useMemo(() => gridData.filter(row => 
    (!statusFilter || row.status === statusFilter) &&
    (!branchFilter || String(row.pnBranchId) === String(branchFilter))
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
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "#fff" }}>Grade Master</Typography>
            </Toolbar>
          </AppBar>

          {/* Filters */}
          <Card sx={{ p: 3, mb: 3, borderRadius: 3, background: "linear-gradient(90deg, #6a11cb, #2575fc)" }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  {/* <InputLabel sx={{ color: "#fff" }}>Branch</InputLabel> */}
                  <Select
                    value={branchFilter}
                    onChange={(e) => setBranchFilter(e.target.value)}
                     displayEmpty
                    sx={{ bgcolor: "#fff", color: "#000" }}
                    renderValue={(selected) => {
      if (selected === "") {
        return "All Branches"; // 👈 Forces the text to show when value is ""
      }
      const selectedBranch = branch.find(b => b.pnBranchId === selected);
      return selectedBranch ? selectedBranch.branchName : "All Branches";
    }}
                  >
                    <MenuItem value="">All Branches</MenuItem>
                    {branch.map((b) => <MenuItem key={b.pnBranchId} value={b.pnBranchId}>{b.branchName}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  {/* <InputLabel sx={{ color: "#fff" }}>Status</InputLabel> */}
                  <Select
                    value={statusFilter}
                     displayEmpty
                    onChange={(e) => setStatusFilter(e.target.value)}
                    sx={{ bgcolor: "#fff", color: "#000" }}
                    renderValue={(selected) => {
      if (selected === "") {
        return "All Status"; // 👈 Forces the text to show when value is ""
      }
        return selected;
    }}
                  >
                    <MenuItem value="">All Status</MenuItem>
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4} sx={{ textAlign: { md: "right" } }}>
                <Button onClick={handleAddRow} sx={{ mr: 2, background: "#ff4b1f", color: "#fff" }}>Add Grade</Button>
                <Button onClick={handleSaveAll} sx={{ background: "linear-gradient(45deg,#1fddff,#45f3ff)", color: "#000" }}>Save All</Button>
              </Grid>
            </Grid>
          </Card>

          {/* AG Grid */}
          <Box className="ag-theme-alpine" sx={{ borderRadius: 3, overflow: "hidden", boxShadow: 3, mb: 3 }}>
            <AgGridReact
            ref={gridRef}
              rowData={filteredData}
              columnDefs={columnDefs}
              domLayout="autoHeight"
              defaultColDef={{ flex: 1, minWidth: 120, resizable: true }}
              pagination
              paginationPageSize={10}
              animateRows
              onCellValueChanged={handleCellValueChanged}
              getRowStyle={(params) => ({
                backgroundColor: params.node.rowIndex % 2 === 0 ? "#e0f7fa" : "#ffffff",
              })}
            />
          </Box>

          {/* View Dialog */}
          <Dialog open={openView} onClose={() => setOpenView(false)} PaperProps={{ sx: { borderRadius: 3, background: "linear-gradient(135deg, #f6d365, #fda085)", p: 3 } }}>
            <DialogTitle sx={{ fontWeight: "bold", color: "#333" }}>Grade Details</DialogTitle>
            <DialogContent>
              {viewData && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Typography><strong>Branch:</strong> {branch.find(b => b.pnBranchId === viewData.pnBranchId)?.branchName || ""}</Typography>
                  <Typography><strong>Grade Name:</strong> {viewData.vGradeName}</Typography>
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

export default Grade1copy;
