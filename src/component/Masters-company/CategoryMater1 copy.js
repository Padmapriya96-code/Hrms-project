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
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import { postRequest } from "../../serverconfiguration/requestcomp";
import { ServerConfig } from "../../serverconfiguration/serverconfig";
import { REPORTS, SAVE } from "../../serverconfiguration/controllers";
import Navbar from "../Home Page-comapny/Navbar1";
import Sidenav from "../Home Page-comapny/Sidenav1";
import axios from "axios";

const CategoryMasterUI = () => {
  const [company, setCompany] = useState([]);
  const [branch, setBranch] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [modifiedRows, setModifiedRows] = useState({});
  const [pnCompanyId, setPnCompanyId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [viewData, setViewData] = useState(null);
  const [openView, setOpenView] = useState(false);
const gridRef=useRef(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const databaseName = sessionStorage.getItem("databaseName"); // ✅ get DB name dynamically
  const authStr=sessionStorage.getItem("auth");
  const auth=authStr?JSON.parse(authStr):null;
  const token=auth?.token;
ServerConfig.url = "https://localhost:7266/api";
  const getStatusLabel = (val) => {
  // If val is already "Active", "Inactive", or "Pending", just return it
  if (["Active", "Inactive", "Pending"].includes(val)) return val;

  switch (val) {
    case "A": return "Active";
    case "I": return "Inactive";
    case "P": return "Pending";
    default: return "";
  }
};

  const getStatusChar = (label) => {
    switch (label) {
      case "Active":
        return "A";
      case "Inactive":
        return "I";
      case "Pending":
        return "P";
      default:
        return "";
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

  const fetchCategoryData = async () => {
  if (!pnCompanyId) return;
  
  try {
    const response = await axios.get(
      `${ServerConfig.url}/PaymCategories/company/${pnCompanyId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    // Map the camelCase JSON from C# to your grid state
    const formattedData = response.data.map((item) => ({
      pnCompanyId: item.pnCompanyId,
      pnBranchId: item.branchId||item.PnBranchId||item.BranchId,      // Received as string from backend
      pnCategoryId: item.pnCategoryId,
      vCategoryName: item.vCategoryName,
      status: getStatusLabel(item.status||item.Status) // Handle both cases,
    }));
 console.log("Fetching for URL:", `${ServerConfig.url}/PaymCategories/company/${pnCompanyId}`);
    setGridData(formattedData || []);
    setOriginalData(JSON.parse(JSON.stringify(formattedData)) || []);
    setModifiedRows({});
  } catch (error) {
    console.error("Error fetching category data:", error);
    toast.error("Failed to load category data");
   
  }
};

  const fetchAllData = async () => {
    await fetchCompanyData();
    await fetchBranchData();
    await fetchCategoryData();
  };

  useEffect(() => {
    fetchAllData();
  }, [pnCompanyId]);

  const isRowModified = useCallback(
    (rowData) => {
      if (rowData.isNew) return false;
      const originalRow = originalData.find(
        (r) => r.pnCategoryId === rowData.pnCategoryId
      );
      if (!originalRow) return false;
      return (
        String(originalRow.pnBranchId) !== String(rowData.pnBranchId) ||
        String(originalRow.vCategoryName) !== String(rowData.vCategoryName) ||
        String(originalRow.status) !== String(rowData.status)
      );
    },
    [originalData]
  );

  const handleCellValueChanged = useCallback(
    (params) => {
      const rowData = params.data;
      if (!rowData.isNew) {
        const modified = isRowModified(rowData);
        setModifiedRows((prev) => ({
          ...prev,
          [rowData.pnCategoryId]: modified,
        }));
      }
      params.api.refreshCells({ rowNodes: [params.node], force: true });
    },
    [isRowModified]
  );

  const handleAddRow = () => {
    const lastRow = gridData[gridData.length - 1];
    if (
      lastRow &&
      (!lastRow.pnBranchId || !lastRow.vCategoryName || !lastRow.status)
    ) {
      toast.warning(
        "Please fill all fields in the current row before adding a new one."
      );
      return;
    }
    setGridData((prev) => [
      ...prev,
      {
        pnCompanyId: pnCompanyId,
        pnBranchId: "",
        vCategoryName: "",
        status: "",
        isNew: true,
      },
    ]);
  };

  const handleSaveAll= async () => {
    //force the grid to stop editing so the latestt typed vaues are captured
    gridRef.current?.api?.stopEditing();
    //filter for new rows
    const newRows = gridData.filter((r) => r.isNew);
    if(newRows.length===0){
      toast.info("No new rows to save");
      return;
    }
    //validation and payload preparation
    const payload=[];
    for(const row of newRows){
      if(!row.pnBranchId||!row.vCategoryName||!row.status){
        toast.warning("Please fill all fields in new rows before saving.");
        return;
      }
      payload.push({
        pnCompanyId: row.pnCompanyId,
        BranchId:String (row.pnBranchId),
        VCategoryName: row.vCategoryName,
        Status: row.status
      });
    }
    try{
      //send the array to backend
      const response=await axios.post(`${ServerConfig.url}/PaymCategories/bulk-save`,
        payload,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );
      if (response.status === 200) {
      toast.success("Saved successfully");
      fetchAllData(); // Refresh to clear 'isNew' flags and get generated IDs
    }
  } catch (error) {
    console.error("Save Error:", error);
    toast.error(error.response?.data || "Failed to save records");
  }
  };
  const handleUpdateRow = async (rowData) => {try {
    const payload = {
      PnCompanyId: rowData.pnCompanyId,
      BranchId: rowData.pnBranchId, // Keeping it as a string
      PnCategoryId: rowData.pnCategoryId,
      VCategoryName: rowData.vCategoryName,
      Status: getStatusChar(rowData.status)
    };

    await axios.put(`${ServerConfig.url}/PaymCategories`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });

    toast.success("Updated successfully");
    fetchCategoryData();
  } catch (error) {
    toast.error("Update failed");
  }};

  const handleDeleteRow = async (rowData) => {
     // ✅ If it is new row (not saved)
          if (rowData.isNew) {
            setGridData(prev =>
              prev.filter(row => row !== rowData)
            );
            toast.info("Unsaved row removed");
            return;
          }
  if (!window.confirm("Are you sure you want to delete this category?")) return;

  try {
    await axios.delete(`${ServerConfig.url}/PaymCategories`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        companyId: rowData.pnCompanyId,
        branchId: rowData.pnBranchId, // Sent as string
        categoryId: rowData.pnCategoryId
      }
    });

    toast.info("Deleted successfully");
    fetchCategoryData();
  } catch (error) {
    toast.error("Delete failed");
  }
};
const handleViewRow = (rowData) => { setViewData(rowData); setOpenView(true); };
  const columnDefs = useMemo(
    () => [
      {
        headerName: "Branch",
        field: "pnBranchId",
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: branch.map((b) => b.branchName) },
        // Fix: Corrected property name and added String conversion
  valueGetter: (params) => {
    if (!params.data.pnBranchId) return "";
    const selectedBranch = branch.find(
      (b) => String(b.pnBranchId) === String(params.data.pnBranchId)
    );
    return selectedBranch ? selectedBranch.branchName : "";
  },
  valueSetter: (params) => {
    const selected = branch.find((b) => b.branchName === params.newValue);
    if (selected) {
      params.data.pnBranchId = selected.pnBranchId; // Keep as string if that's your standard
      return true;
    }
    return false;
        },
      },
      { headerName: "Category Name", field: "vCategoryName", editable: true },
      {
        headerName: "Status",
        field: "status",
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: ["Active", "Inactive", "Pending"] },
      },
      {
        headerName: "Actions",
        field: "actions",
        cellRenderer: (params) => (
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              color="primary"
              onClick={() => handleViewRow(params.data)}
            >
              <VisibilityIcon />
            </IconButton>
            <IconButton
              color="success"
              onClick={() => handleUpdateRow(params.data)}
              disabled={!modifiedRows[params.data.pnCategoryId]}
            >
              <DoneOutlineIcon />
            </IconButton>
            <IconButton
              color="error"
              onClick={() => handleDeleteRow(params.data)}
            >
              <DeleteOutlineIcon />
            </IconButton>
          </Box>
        ),
      },
    ],
    [branch, modifiedRows]
  );

  const filteredData = useMemo(
    () =>
      gridData.filter(
        (row) =>
          (!statusFilter || row.status === statusFilter) &&
          (!branchFilter || String(row.pnBranchId) === String(branchFilter))
      ),
    [gridData, statusFilter, branchFilter]
  );

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
                Category Master
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
                  <InputLabel sx={{ color: "#fff" }}>Branch</InputLabel>
                  <Select
                    value={branchFilter}
                    onChange={(e) => setBranchFilter(e.target.value)}
                    sx={{ bgcolor: "#fff", color: "#000" }}
                    displayEmpty // This ensures that even empty values show something
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
                  <InputLabel sx={{ color: "#fff" }}>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    sx={{ bgcolor: "#fff", color: "#000" }} displayEmpty // This ensures that even empty values show something
                  >
                    <MenuItem value="">All Status</MenuItem>
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4} sx={{ textAlign: { md: "right" } }}>
                <Button
                  onClick={handleAddRow}
                  sx={{ mr: 2, background: "#ff4b1f", color: "#fff" }}
                >
                  Add Category
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
              domLayout="autoHeight"
              defaultColDef={{ flex: 1, minWidth: 120, resizable: true }}
              pagination
              paginationPageSize={10}
              animateRows
              onCellValueChanged={handleCellValueChanged}
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
              Category Details
            </DialogTitle>
            <DialogContent>
              {viewData && (
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  <Typography>
                    <strong>Branch:</strong>{" "}
                    {branch.find((b) => String(b.pnBranchId) === String(viewData.pnBranchId))
                      ?.branchName || ""}
                  </Typography>
                  <Typography>
                    <strong>Category Name:</strong> {viewData.vCategoryName}
                  </Typography>
                  <Typography>
                    <strong>Status:</strong> {viewData.status}
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

export default CategoryMasterUI;
