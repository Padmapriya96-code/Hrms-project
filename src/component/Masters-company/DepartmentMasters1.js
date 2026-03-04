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

const DepartmentMaster1 = () => {
  const [company, setCompany] = useState([]);
  const [branch, setBranch] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [modifiedRows, setModifiedRows] = useState({});
  const [pnCompanyId, setPnCompanyId] = useState("");
  const [companyName, setCompanyName] = useState("");

  // 🔽 Filters state
  const [statusFilter, setStatusFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");

  // Utils
  const getStatusLabel = (char) =>
    char === "A" ? "Active" : char === "I" ? "Inactive" : char === "P" ? "Pending" : "";

  const getStatusChar = (label) =>
    label === "Active" ? "A" : label === "Inactive" ? "I" : label === "Pending" ? "P" : "";

  // 🔽 Fetch Data
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

  const fetchDepartmentData = async () => {
    if (pnCompanyId) {
      const departmentData = await postRequest(ServerConfig.url, REPORTS, {
        query: `SELECT [pn_CompanyID], [pn_BranchID], [pn_DepartmentID], [v_DepartmentName], [status] 
                FROM [dbo].[paym_Department] 
                WHERE pn_CompanyID = '${pnCompanyId}'`,
      });
      const formattedData = departmentData.data.map((item) => ({
        pnCompanyId: item.pn_CompanyID,
        pn_BranchID: item.pn_BranchID,
        pn_DepartmentID: item.pn_DepartmentID,
        v_DepartmentName: item.v_DepartmentName,
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
    await fetchDepartmentData();
  };

  useEffect(() => {
    fetchAllData();
  }, [pnCompanyId]);

  // 🔽 Check modified row
  const isRowModified = useCallback(
    (rowData) => {
      if (rowData.isNew) return false;
      const originalRow = originalData.find(
        (item) => item.pn_DepartmentID === rowData.pn_DepartmentID
      );
      if (!originalRow) return false;
      return (
        String(originalRow.pn_BranchID) !== String(rowData.pn_BranchID) ||
        String(originalRow.v_DepartmentName) !== String(rowData.v_DepartmentName) ||
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
          [rowData.pn_DepartmentID]: modified,
        }));
      }
      params.api.refreshCells({ rowNodes: [params.node], force: true });
    },
    [isRowModified]
  );

  // 🔽 Add Row
  const handleAddRow = () => {
    const lastRow = gridData[gridData.length - 1];
    if (lastRow && (!lastRow.pn_BranchID || !lastRow.v_DepartmentName || !lastRow.status)) {
      toast.dismiss();
      toast.warning("Please fill all fields in the current row before adding a new one.", {
        position: "top-center",
        autoClose: 1000,
      });
      return;
    }
    setGridData((prev) => [
      ...prev,
      { pnCompanyId, pn_BranchID: "", v_DepartmentName: "", status: "", isNew: true },
    ]);
  };

  // 🔽 Save new rows
  const handleSaveAll = async () => {
    try {
      toast.dismiss();
      const newRows = gridData.filter((row) => row.isNew);
      if (newRows.length === 0) {
        toast.error("No new data to save", { position: "top-center", autoClose: 1000 });
        return;
      }
      for (const row of newRows) {
        if (!row.pn_BranchID || !row.v_DepartmentName || !row.status) {
          toast.error("Please fill all fields for new rows before saving.", {
            position: "top-center",
            autoClose: 1000,
          });
          return;
        }
      }
      const queries = newRows.map(
        (row) =>
          `INSERT INTO paym_Department (pn_CompanyID, pn_BranchID, v_DepartmentName, status) 
           VALUES ('${row.pnCompanyId}', '${row.pn_BranchID}', '${row.v_DepartmentName}', '${getStatusChar(
            row.status
          )}')`
      );
      await Promise.all(queries.map((q) => postRequest(ServerConfig.url, SAVE, { query: q })));
      toast.success("Data saved successfully", { position: "top-center", autoClose: 1000 });
      await fetchAllData();
    } catch (error) {
      toast.error("Failed to save data", { position: "top-center", autoClose: 1000 });
    }
  };

  // 🔽 Update
  const handleUpdateRow = async (rowData) => {
    try {
      const query = `UPDATE paym_Department 
                     SET pn_BranchID='${rowData.pn_BranchID}',
                         v_DepartmentName='${rowData.v_DepartmentName}',
                         status='${getStatusChar(rowData.status)}'
                     WHERE pn_DepartmentID='${rowData.pn_DepartmentID}'`;
      await postRequest(ServerConfig.url, SAVE, { query });
      setModifiedRows((prev) => {
        const copy = { ...prev };
        delete copy[rowData.pn_DepartmentID];
        return copy;
      });
      toast.success("Data updated successfully", { position: "top-center", autoClose: 1000 });
      await fetchAllData();
    } catch (error) {
      toast.error("Failed to update data", { position: "top-center", autoClose: 1000 });
    }
  };

  // 🔽 Delete
  const executeDelete = async (rowData) => {
    try {
      const query = `DELETE FROM paym_Department WHERE pn_DepartmentID='${rowData.pn_DepartmentID}'`;
      await postRequest(ServerConfig.url, SAVE, { query });
      toast.error("Data deleted successfully", { position: "top-center", autoClose: 1000 });
      await fetchAllData();
    } catch {
      toast.error("Failed to delete data", { position: "top-center", autoClose: 1000 });
    }
  };

  const handleDeleteRow = (rowData) => {
    toast.info(
      <div style={{ textAlign: "center" }}>
        Are you sure you want to delete this record?
        <Box mt={1} display="flex" justifyContent="center" gap={1}>
          <Button
            variant="contained"
            size="small"
            color="error"
            onClick={async () => {
              toast.dismiss();
              await executeDelete(rowData);
            }}
          >
            Delete
          </Button>
          <Button variant="outlined" size="small" onClick={() => toast.dismiss()}>
            Cancel
          </Button>
        </Box>
      </div>,
      { position: "top-center", autoClose: false, toastId: "delete-confirmation" }
    );
  };

  // 🔽 Columns
  const columnDefs = useMemo(
    () => [
      {
        headerName: "BRANCH NAME",
        field: "pn_BranchID",
        editable: true,
         cellStyle: { 
        whiteSpace: "normal", 
        overflow: "visible", 
        wordBreak: "break-word", 
        textAlign: "left" 
      },
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: branch.map((b) => b.BranchName) },
        valueGetter: (params) => branch.find((b) => b.pn_BranchID === params.data.pn_BranchID)?.BranchName || "",
        valueSetter: (params) => {
          const selected = branch.find((b) => b.BranchName === params.newValue);
          if (selected) {
            params.data.pn_BranchID = selected.pn_BranchID;
            return true;
          }
          return false;
        },
        minWidth: 150,
      },
      { headerName: "DEPARTMENT NAME",  cellStyle: { 
        whiteSpace: "normal", 
        overflow: "visible", 
        wordBreak: "break-word", 
        textAlign: "left" 
      },field: "v_DepartmentName", editable: true, minWidth: 190 },
      {
        headerName: "STATUS",
        field: "status",
         cellStyle: { 
        whiteSpace: "normal", 
        overflow: "visible", 
        wordBreak: "break-word", 
        textAlign: "left" 
      },
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: ["Active", "Inactive", "Pending"] },
        minWidth: 90,
      },
      {
        headerName: "ACTION",
          minWidth: 50, cellStyle: { 
        whiteSpace: "normal", 
        overflow: "visible", 
        wordBreak: "break-word", 
        textAlign: "center" 
      },
        cellRenderer: (params) => (
          <div>
            <IconButton
              onClick={() => handleUpdateRow(params.data)}
              color="success"
              disabled={!modifiedRows[params.data.pn_DepartmentID]}
            >
              <DoneOutlineIcon />
            </IconButton>
            <IconButton onClick={() => handleDeleteRow(params.data)} color="error">
              <DeleteOutlineIcon />
            </IconButton>
          </div>
        ),
      },
    ],
    [branch, modifiedRows]
  );

  // 🔽 Filters
  const filteredData = useMemo(
    () =>
      gridData.filter(
        (row) =>
          (!statusFilter || row.status === statusFilter) &&
          (!branchFilter || String(row.pn_BranchID) === String(branchFilter))
      ),
    [gridData, statusFilter, branchFilter]
  );

  return (
    <Grid container sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Navbar />
      <Grid item xs={12} sx={{ display: "flex" }}>
        <Sidenav />
        {/* Main Content */}
        <Grid
          item
          xs={12}
          sm={10}
          md={9}
          lg={9}
          xl={10}
          sx={{
            padding: { xs: 2, sm: 3, md: 4 },
            margin: "0 auto",
            width: "100%",
            maxWidth: "900px",
          }}
        >
          {/* AppBar */}
          <AppBar position="static" className="company-appbar">
            <Toolbar className="company-toolbar">
              <Typography variant="h5" className="company-title" sx={{ flexGrow: 1 }}>
                DEPARTMENT
              </Typography>
            </Toolbar>
          </AppBar>

          {/* Filters */}
          <Paper elevation={3} sx={{ p: 1, width: "100%", maxWidth: "900px", mx: "auto" }}>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
              <FormControl fullWidth sx={{ minWidth: 200 }}>
                <InputLabel>Branch</InputLabel>
                <Select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)}>
                  <MenuItem value="">All</MenuItem>
                  {branch.map((b) => (
                    <MenuItem key={b.pn_BranchID} value={b.pn_BranchID}>
                      {b.BranchName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ minWidth: 200 }}>
                <InputLabel>Status</InputLabel>
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Paper>

          {/* AG Grid */}
          <Box className="ag-theme-alpine ag-custom-grid">
            <AgGridReact
              rowData={filteredData}
              columnDefs={columnDefs}
              domLayout="autoHeight"
              defaultColDef={{ flex: 1, minWidth: 120, resizable: true }}
              animateRows={true}
              pagination={true}
              paginationPageSize={10}
              onCellValueChanged={handleCellValueChanged}
              getRowHeight={() => 33}
              getRowStyle={(params) => ({
                backgroundColor: params.node.rowIndex % 2 === 0 ? "#cde3f2" : "#ffffff",
              })}
            />
          </Box>

          {/* Buttons */}
          <Box mt={2} mr={4} display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="contained" onClick={handleAddRow} sx={{ width: 160, borderRadius: "10px" }}>
              Add Department
            </Button>
            <Button variant="contained" color="primary" onClick={handleSaveAll} sx={{ width: 160, borderRadius: "10px" }}>
              Save All
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DepartmentMaster1;
