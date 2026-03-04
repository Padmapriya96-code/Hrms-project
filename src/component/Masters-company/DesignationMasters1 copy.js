import React, { useState, useEffect, useMemo, useCallback,useRef } from "react";
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
  FormControl,
  Select,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { Card, Col, Row, Form } from "react-bootstrap";
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

const DesignationMaster = () => {
  const [company, setCompany] = useState([]);
  const [branch, setBranch] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [modifiedRows, setModifiedRows] = useState({});
  const [pnCompanyId, setPnCompanyId] = useState("");
  const [companyName, setCompanyName] = useState("");

  // Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");

  // View Modal
  const [viewData, setViewData] = useState(null);
  const [openView, setOpenView] = useState(false);
  const databaseName = sessionStorage.getItem("databaseName"); // ✅ get dynamic DB name
  const authStr=sessionStorage.getItem("auth");
      const auth=authStr?JSON.parse(authStr):null;
      const token=auth?.token;
      ServerConfig.url = "https://localhost:7266/api";
      const gridRef = useRef();


  const getStatusLabel = (char) =>
    char === "A"
      ? "Active"
      : char === "I"
      ? "Inactive"
      : char === "P"
      ? "Pending"
      : "";

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

  useEffect(() => {
  fetchBranchData();
}, [pnCompanyId]);

  const fetchDesignationData = async () => {
    if (!pnCompanyId) return;
    try{
      const response=await axios.get(`${ServerConfig.url}/PaymDesignations/company/${pnCompanyId}`, 
        {headers:{Authorization:`Bearer ${token}`}}
      );

    
      
      const formatted = response.data.map((item) => ({
        pnCompanyId: item.pnCompanyId,
        pnBranchId: item.pnbranchId,
        pnDesignationId: item.pnDesignationId,
        vDesignationName: item.vDesignationName,
        authority: item.authority??"",
        status: getStatusLabel(item.status),
      }));
      setGridData(formatted || []);
      setOriginalData(JSON.parse(JSON.stringify(formatted)) || []);
      setModifiedRows({});
    }catch(error){console.error("Error fetching designation data",error);

    }
  };

  const fetchAllData = async () => {
    await fetchCompanyData();
    await fetchBranchData();
    await fetchDesignationData();
  };

  useEffect(() => {
    fetchAllData();
  }, [pnCompanyId]);

  const isRowModified = useCallback(
    (rowData) => {
      if (rowData.isNew) return false;
      const originalRow = originalData.find(
        (r) => r.pnDesignationId === rowData.pnDesignationId
      );
      if (!originalRow) return false;
      return (
        String(originalRow.pnBranchId) !== String(rowData.pnBranchId) ||
        String(originalRow.vDesignationName) !==
          String(rowData.vDesignationName) ||
        String(originalRow.authority) !== String(rowData.authority) ||
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
          [rowData.pnDesignationId]: modified,
        }));
      }
      params.api.refreshCells({ rowNodes: [params.node], force: true });
    },
    [isRowModified]
  );

  const handleAddRow = () => {
    if (!gridRef.current?.api) return;

  gridRef.current.api.stopEditing();

  const rowCount = gridRef.current.api.getDisplayedRowCount();
  if (rowCount > 0) {
    const lastNode = gridRef.current.api.getDisplayedRowAtIndex(rowCount - 1);
    const lastRow = lastNode.data;

    // Check for the ID across all possible naming conventions
    const actualBranchId = lastRow.pnBranchId || lastRow.branchId || lastRow.pnbranchId;

    const isBranchEmpty = actualBranchId === null || actualBranchId === undefined || actualBranchId === "";
    const isDesignationEmpty = !lastRow.vDesignationName?.toString().trim();
    const isStatusEmpty = !lastRow.status?.toString().trim();

    // ✅ Variables match exactly now
    if (isBranchEmpty || isDesignationEmpty || isStatusEmpty) {
      toast.warning("Fill current row before adding a new one");
      return;
    }
  }
    setGridData((prev) => [
      ...prev,
      {
        pnCompanyId,
        pnBranchId: null,
        vDesignationName: "",
        authority: "",
        status: "",
        isNew: true,
      },
    ]);
  };


  const handleSaveAll = async () => {
  const newRows = gridData.filter(r => r.isNew);

  if (!newRows.length) {
    toast.error("No new rows to save");
    return;
  }

  for (const row of newRows) {
  const branchId =
    typeof row.pnBranchId === "object"
      ? row.pnBranchId?.pnBranchId
      : row.pnBranchId;

  console.log("Row:", row);
  console.log("branchId:", branchId);
  console.log("vDesignationName:", row.vDesignationName);
  console.log("status:", row.status);

  if (
    branchId == null ||
    !row.vDesignationName?.trim() ||
    row.status == null ||
    row.status === ""
  ) {
    toast.error("Please fill all fields before saving");
    return;
  }
}


  const payload = newRows.map(row => ({
    pnCompanyId: row.pnCompanyId,
  pnBranchId: row.pnBranchId,
    vDesignationName: row.vDesignationName,
    authority: row.authority ?? null,   // 🔑 important
    status: getStatusChar(row.status),
    
  }));


  try {
    await axios.post(
      `${ServerConfig.url}/PaymDesignations/bulk`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Saved successfully");
    fetchAllData();

  } catch (error) {
    console.error("FULL ERROR:", error);
  console.error("RESPONSE DATA:", error.response?.data);
  console.error("STATUS:", error.response?.status);
    toast.error("Error saving designation");
  }
};

  const handleUpdateRow = async (rowData) => {
  try {
    await axios.put(
      `${ServerConfig.url}/PaymDesignations/${rowData.pnDesignationId}`,
      {
        pnCompanyId: rowData.pnCompanyId,
    pnBranchId:
      rowData.pnBranchId ?? rowData.branchId ?? 0,
    vDesignationName: rowData.vDesignationName,
    authority: rowData.authority,
    status: getStatusChar(rowData.status),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // if JWT
        },
      }
    );

    const copy = { ...modifiedRows };
    delete copy[rowData.pnDesignationId];
    setModifiedRows(copy);

    toast.success("Updated successfully");
    fetchAllData();
  } catch (error) {
    console.error(error);
    console.error("STATUS:", error.response?.status);
  console.error("DATA:", error.response?.data);
  console.error("FULL:", error);
    toast.error("Error updating designation");
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
  if (!window.confirm("Are you sure you want to delete this record?")) return;

  try {
    await axios.delete(
      `${ServerConfig.url}/PaymDesignations/${rowData.pnDesignationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // if JWT
        },
      }
    );

    toast.info("Deleted successfully");
    fetchAllData();
  } catch (error) {
    console.error(error);
    toast.error("Error deleting designation");
  }
};

  const handleViewRow = (rowData) => {
    setViewData(rowData);
    setOpenView(true);
  };

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Branch",
        field: "pnBranchId",
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { 
    values: branch.map((b) => b.branchName) 
  },
  valueGetter: (params) => {
    // 1. Look for the ID in all common key variations
    const bId = params.data.pnBranchId || params.data.branchId || params.data.pnbranchId;

    if (!bId) return "";

    // 2. Find the branch object in your normalized list
    const found = branch.find((b) => String(b.pnBranchId) === String(bId));

    // 3. Return the name to show in the cell, or the raw ID if not found
    return found ? found.branchName : bId;
  },
  valueSetter: (params) => {
    const selected = branch.find((b) => b.branchName === params.newValue);
    if (selected) {
      // 4. Force consistency: update the main key the Grid expects
      params.data.pnBranchId = selected.pnBranchId;
      return true;
    }
    return false;
        },
        minWidth: 150,
      },
      { headerName: "Designation", field: "vDesignationName", editable: true },
      { headerName: "Authority", field: "authority", editable: true },
      {
        headerName: "Status",
        field: "status",
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: ["Active", "Inactive", "Pending"] },
        cellStyle: (params) => ({
          fontWeight: "bold",
          color:
            params.value === "Active"
              ? "#155724"
              : params.value === "Inactive"
              ? "#721c24"
              : "#856404",
        }),
      },
     

      {
        headerName: "Actions",
        cellRenderer: (params) => (
          <div style={{ display: "flex", gap: "6px" }}>
            <IconButton
              color="primary"
              onClick={() => handleViewRow(params.data)}
            >
              <VisibilityIcon />
            </IconButton>
            <IconButton
              color="success"
              onClick={() => handleUpdateRow(params.data)}
              disabled={!modifiedRows[params.data.pnDesignationId]}
            >
              <DoneOutlineIcon />
            </IconButton>
            <IconButton
              color="error"
              onClick={() => handleDeleteRow(params.data)}
            >
              <DeleteOutlineIcon />
            </IconButton>
          </div>
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
              background: "linear-gradient(90deg, #6a11cb, #2575fc)",
              mb: 3,
              borderRadius: 2,
            }}
          >
            <Toolbar>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", color: "#fff" }}
              >
                Designation Master
              </Typography>
            </Toolbar>
          </AppBar>

          {/* Filters */}
          <Card
            className="p-3 mb-3 shadow"
            style={{
              borderRadius: "12px",
              background: "linear-gradient(90deg, #6a11cb, #2575fc)",
            }}
          >
            <Row className="align-items-center">
              <Col xs={12} sm={6} md={4} className="mb-2">
                <Form.Select
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                  style={{ backgroundColor: "#ffffff", color: "#000" }}
                >
                  <option value="">All Branches</option>
                  {branch.map((b) => (
                    <option key={b.pnBranchId} value={b.pnBranchId}>
                      {b.branchName}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col xs={12} sm={6} md={4} className="mb-2">
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ backgroundColor: "#ffffff", color: "#000" }}
                >
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </Form.Select>
              </Col>
              <Col xs={12} md={4} className="text-md-end">
                <Button
                  onClick={handleAddRow}
                  className="me-2"
                  style={{
                    backgroundColor: "#ff4b1f",
                    border: "none",
                    color: "#ffff",
                  }}
                >
                  Add Designation
                </Button>
                <Button
                  onClick={handleSaveAll}
                  style={{
                    backgroundColor: "#1fddff",
                    border: "none",
                    color: "#000",
                  }}
                >
                  Save All
                </Button>
              </Col>
            </Row>
          </Card>

          {/* Grid */}
          <Box
            className="ag-theme-alpine"
            sx={{
              height: "auto",
              width: "100%",
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: "0px 8px 20px rgba(0,0,0,0.15)",
              mb: 3,
            }}
          >
            <AgGridReact
            ref={gridRef}
              rowData={filteredData}
              columnDefs={columnDefs}
              domLayout="autoHeight"
              defaultColDef={{ flex: 1, minWidth: 120, resizable: true }}
              pagination={true}
              paginationPageSize={10}
              animateRows={true}
              onCellValueChanged={handleCellValueChanged}
              getRowStyle={(params) => ({
                backgroundColor:
                  params.node.rowIndex % 2 === 0 ? "#e0f7fa" : "#ffffff",
              })}
            />
          </Box>

          {/* Action Buttons */}
          {/* <Box
            sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mb: 3 }}
          >
            <Button
              variant="contained"
              onClick={handleAddRow}
              sx={{
                background: "linear-gradient(45deg, #ff6a00, #ee0979)",
                color: "#fff",
                fontWeight: "bold",
                "&:hover": { opacity: 0.9 },
              }}
            >
              Add Designation
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveAll}
              sx={{
                background: "linear-gradient(45deg, #56ab2f, #a8e063)",
                color: "#fff",
                fontWeight: "bold",
                "&:hover": { opacity: 0.9 },
              }}
            >
              Save All
            </Button>
          </Box> */}

          {/* View Modal */}
          <Dialog
            open={openView}
            onClose={() => setOpenView(false)}
            PaperProps={{
              sx: {
                borderRadius: 3,
                background: "linear-gradient(135deg, #f6d365, #fda085)",
                padding: 3,
              },
            }}
          >
            <DialogTitle sx={{ color: "#333", fontWeight: "bold" }}>
              Designation Details
            </DialogTitle>
            <DialogContent>
              {viewData && (
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  <Typography>
                    <strong>Branch:</strong>{" "}
                    {branch.find((b) => b.pnBranchId=== viewData.pnBranchId)
                      ?.branchName || ""}
                  </Typography>
                  <Typography>
                    <strong>Designation:</strong> {viewData.vDesignationName}
                  </Typography>
                  <Typography>
                    <strong>Authority:</strong> {viewData.authority}
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
                  background: "linear-gradient(45deg, #ff416c, #ff4b2b)",
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

export default DesignationMaster;
