import React, { useState, useEffect, useMemo, useCallback } from "react";
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

const LevelFormMaster1 = () => {
  const [company, setCompany] = useState([]);
  const [branch, setBranch] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [modifiedRows, setModifiedRows] = useState({});
  const [pnCompanyId, setPnCompanyId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [gridHeight] = useState(400);

  // 🔽 Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");

  // Utility: DB char → Label
  const getStatusLabel = (char) => {
    switch (char) {
      case "A": return "Active";
      case "I": return "Inactive";
      case "P": return "Pending";
      default: return "";
    }
  };

  // Utility: Label → DB char
  const getStatusChar = (label) => {
    switch (label) {
      case "Active": return "A";
      case "Inactive": return "I";
      case "Pending": return "P";
      default: return "";
    }
  };

  const fetchCompanyData = async () => {
    const isloggedin = sessionStorage.getItem("user");
    const companyData = await postRequest(ServerConfig.url, REPORTS, {
      query: `SELECT * FROM paym_Company WHERE company_user_id = '${isloggedin}'`,
    });
    setCompany(companyData.data);
    if (companyData.data.length > 0) {
      setPnCompanyId(companyData.data[0].pn_CompanyID);
      setCompanyName(companyData.data[0].CompanyName);
    }
  };

  const fetchBranchData = async () => {
    if (pnCompanyId) {
      const branchData = await postRequest(ServerConfig.url, REPORTS, {
        query: `SELECT * FROM paym_branch WHERE pn_CompanyID = '${pnCompanyId}'`,
      });
      setBranch(branchData.data);
    }
  };

  const fetchLevelData = async () => {
    if (pnCompanyId) {
      const levelData = await postRequest(ServerConfig.url, REPORTS, {
        query: `SELECT [pn_CompanyID], [BranchID], [pn_LevelID], [v_LevelName], [status] 
                FROM [dbo].[paym_Level] WHERE pn_CompanyID = '${pnCompanyId}'`,
      });
      const formattedData = levelData.data.map((item) => ({
        pnCompanyId: item.pn_CompanyID,
        BranchID: item.BranchID,
        pn_LevelID: item.pn_LevelID,
        v_LevelName: item.v_LevelName,
        status: getStatusLabel(item.status),
      }));
      setGridData(formattedData || []);
      setOriginalData(JSON.parse(JSON.stringify(formattedData)) || []);
      setModifiedRows({});
    }
  };

  const fetchAllData = async () => {
    await fetchCompanyData();
    await fetchBranchData();
    await fetchLevelData();
  };

  useEffect(() => {
    fetchAllData();
  }, [pnCompanyId]);

  // 🔽 Track modified rows
  const isRowModified = useCallback((rowData) => {
    if (rowData.isNew) return false;
    const originalRow = originalData.find(
      (item) => item.pn_LevelID === rowData.pn_LevelID
    );
    if (!originalRow) return false;
    return (
      String(originalRow.BranchID) !== String(rowData.BranchID) ||
      String(originalRow.v_LevelName) !== String(rowData.v_LevelName) ||
      String(originalRow.status) !== String(rowData.status)
    );
  }, [originalData]);

  const handleCellValueChanged = useCallback((params) => {
    const rowData = params.data;
    if (!rowData.isNew) {
      const modified = isRowModified(rowData);
      setModifiedRows((prev) => ({
        ...prev,
        [rowData.pn_LevelID]: modified,
      }));
    }
    params.api.refreshCells({ rowNodes: [params.node], force: true });
  }, [isRowModified]);

  // 🔽 Add Row
  const handleAddRow = () => {
    const lastRow = gridData[gridData.length - 1];
    if (lastRow && (!lastRow.BranchID || !lastRow.v_LevelName || !lastRow.status)) {
      toast.dismiss();
      toast.warning("Please fill all fields in the current row before adding a new one.", {
        position: "top-center",
        autoClose: 1000,
      });
      return;
    }
    const newRow = { pnCompanyId, BranchID: "", v_LevelName: "", status: "", isNew: true };
    setGridData((prev) => [...prev, newRow]);
  };

  // 🔽 Save New Rows
  const handleSaveAll = async () => {
    try {
      toast.dismiss();
      const newRows = gridData.filter((row) => row.isNew);
      if (newRows.length === 0) {
        toast.error("No new data to save", { position: "top-center", autoClose: 1000 });
        return;
      }
      for (const row of newRows) {
        if (!row.BranchID || !row.v_LevelName || !row.status) {
          toast.error("Please fill all fields for new rows before saving.", {
            position: "top-center",
            autoClose: 1000,
          });
          return;
        }
      }
      const queries = newRows.map((row) => {
        const statusChar = getStatusChar(row.status);
        return `INSERT INTO paym_Level (pn_CompanyID, BranchID, v_LevelName, status) 
                VALUES ('${row.pnCompanyId}', '${row.BranchID}', '${row.v_LevelName}', '${statusChar}')`;
      });
      await Promise.all(queries.map((q) => postRequest(ServerConfig.url, SAVE, { query: q })));
      toast.success("Data saved successfully", { position: "top-center", autoClose: 1000 });
      await fetchAllData();
    } catch {
      toast.error("Failed to save data", { position: "top-center", autoClose: 1000 });
    }
  };

  // 🔽 Update Row
  const handleUpdateRow = async (rowData) => {
    try {
      toast.dismiss();
      const statusChar = getStatusChar(rowData.status);
      const query = `UPDATE paym_Level 
                     SET BranchID = '${rowData.BranchID}', 
                         v_LevelName = '${rowData.v_LevelName}', 
                         status = '${statusChar}' 
                     WHERE pn_LevelID = '${rowData.pn_LevelID}'`;
      await postRequest(ServerConfig.url, SAVE, { query });
      setModifiedRows((prev) => {
        const newModified = { ...prev };
        delete newModified[rowData.pn_LevelID];
        return newModified;
      });
      toast.success("Data updated successfully", { position: "top-center", autoClose: 1000 });
      await fetchAllData();
    } catch {
      toast.error("Failed to update data", { position: "top-center", autoClose: 1000 });
    }
  };

  // 🔽 Delete Row
  const handleDeleteRow = (rowData) => {
    toast.dismiss();
    toast.info(
      <div style={{ textAlign: "center" }}>
        Are you sure you want to delete this record?
        <div style={{ marginTop: "10px", display: "flex", justifyContent: "center", gap: "8px" }}>
          <Button
            variant="contained"
            size="small"
            color="error"
            onClick={async () => {
              toast.dismiss();
              await executeDelete(rowData);
            }}
            style={{ minWidth: "80px" }}
          >
            Delete
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => toast.dismiss()}
            style={{ minWidth: "80px" }}
          >
            Cancel
          </Button>
        </div>
      </div>,
      { position: "top-center", autoClose: false, toastId: "delete-confirmation" }
    );
  };

  const executeDelete = async (rowData) => {
    try {
      const query = `DELETE FROM [dbo].[paym_Level] WHERE [pn_LevelID] = '${rowData.pn_LevelID}'`;
      await postRequest(ServerConfig.url, SAVE, { query });
      toast.error("Data deleted successfully", { position: "top-center", autoClose: 1000 });
      await fetchAllData();
    } catch {
      toast.error("Failed to delete data", { position: "top-center", autoClose: 1000 });
    }
  };

  // 🔽 Column Defs
  const columnDefs = useMemo(() => [
    {
      headerName: "BRANCH NAME",
      field: "BranchID",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: branch.map((b) => b.BranchName) },
      valueGetter: (params) => branch.find((b) => b.pn_BranchID === params.data.BranchID)?.BranchName || "",
      valueSetter: (params) => {
        const selected = branch.find((b) => b.BranchName === params.newValue);
        if (selected) { params.data.BranchID = selected.pn_BranchID; return true; }
        return false;
      },
      minWidth: 150,
      cellStyle: { whiteSpace: "normal", wordBreak: "break-word", textAlign: "left" },
    },
    {
      headerName: "LEVEL NAME",
      field: "v_LevelName",
      editable: true,
      minWidth: 160,
      cellStyle: { whiteSpace: "normal", wordBreak: "break-word", textAlign: "left" },
    },
    {
      headerName: "STATUS",
      field: "status",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: ["Active", "Inactive", "Pending"] },
      minWidth: 100,
      cellStyle: { whiteSpace: "normal", wordBreak: "break-word", textAlign: "left" },
    },
    {
      headerName: "ACTION",
      cellRenderer: (params) => (
        <div>
          <IconButton
            onClick={() => handleUpdateRow(params.data)}
            color="success"
            disabled={!modifiedRows[params.data.pn_LevelID]}
          >
            <DoneOutlineIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteRow(params.data)} color="error">
            <DeleteOutlineIcon />
          </IconButton>
        </div>
      ),
    },
  ], [branch, modifiedRows]);

  // 🔽 Apply filters
  const filteredData = useMemo(() => {
    return gridData.filter((row) => {
      const statusMatch = statusFilter ? row.status === statusFilter : true;
      const branchMatch = branchFilter ? String(row.BranchID) === String(branchFilter) : true;
      return statusMatch && branchMatch;
    });
  }, [gridData, statusFilter, branchFilter]);

  return (
    <Grid container sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Navbar />
      <Grid item xs={12} sx={{ display: "flex" }}>
        <Sidenav />
        <Grid item xs={12} sm={10} md={9} lg={9} xl={10} sx={{ p: { xs: 2, sm: 3, md: 4 }, mx: "auto", width: "100%", maxWidth: "900px" }}>
          
          {/* AppBar */}
          <AppBar position="static" className="company-appbar">
            <Toolbar className="company-toolbar">
              <Typography variant="h5" className="company-title" sx={{ flexGrow: 1 }}>
                LEVEL MANAGEMENT
              </Typography>
            </Toolbar>
          </AppBar>

          {/* Filters */}
          <Paper elevation={3} sx={{ p: 1, width: "100%", maxWidth: "900px", mx: "auto",  }}>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
              {/* Branch Filter */}
              <FormControl fullWidth sx={{ minWidth: 100 }}>
                <InputLabel>Branch</InputLabel>
                <Select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)} label="Branch">
                  <MenuItem value="">All</MenuItem>
                  {branch.map((b) => (
                    <MenuItem key={b.pn_BranchID} value={b.pn_BranchID}>
                      {b.BranchName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Status Filter */}
              <FormControl fullWidth sx={{ minWidth: 100 }}>
                <InputLabel>Status</InputLabel>
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Paper>

          {/* AG Grid */}
          <Box className="ag-theme-alpine ag-custom-grid" >
            <AgGridReact
              rowData={filteredData}
              columnDefs={columnDefs}
              domLayout="autoHeight"
              defaultColDef={{ flex: 1, minWidth: 120, resizable: true }}
              animateRows
              pagination
              paginationPageSize={10}
              onCellValueChanged={handleCellValueChanged}
              getRowStyle={(params) => ({
                backgroundColor: params.node.rowIndex % 2 === 0 ? "#cde3f2" : "#ffffff",
              })}
              getRowHeight={() => 33}
            />
          </Box>

          {/* Action Buttons */}
          <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="contained" onClick={handleAddRow} sx={{ width: 150, borderRadius: "10px" }}>
              Add Level
            </Button>
            <Button variant="contained" color="primary" onClick={handleSaveAll} sx={{ width: 150, borderRadius: "10px" }}>
              Save All
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default LevelFormMaster1;
