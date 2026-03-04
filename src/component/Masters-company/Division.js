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

const DivisionMaster1 = () => {
  const [company, setCompany] = useState([]);
  const [branch, setBranch] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [modifiedRows, setModifiedRows] = useState({});
  const [pnCompanyId, setPnCompanyId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [gridHeight, setGridHeight] = useState(400);

  // 🔽 Filters state
  const [statusFilter, setStatusFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");

  // Utility to map char to label
  const getStatusLabel = (char) => {
    switch (char) {
      case "A":
        return "Active";
      case "I":
        return "Inactive";
      case "P":
        return "Pending";
      default:
        return "";
    }
  };

  // Utility to map label to char
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

  const fetchDivisionData = async () => {
    if (pnCompanyId) {
      const divisionData = await postRequest(ServerConfig.url, REPORTS, {
        query: `SELECT [pn_CompanyID], [BranchID], [pn_DivisionID], [v_DivisionName], [status] FROM [dbo].[paym_Division] WHERE pn_CompanyID = '${pnCompanyId}'`,
      });
      const formattedData = divisionData.data.map((item) => ({
        pnCompanyId: item.pn_CompanyID,
        BranchID: item.BranchID,
        pn_DivisionID: item.pn_DivisionID,
        v_DivisionName: item.v_DivisionName,
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
    await fetchDivisionData();
  };

  useEffect(() => {
    fetchAllData();
  }, [pnCompanyId]);

  const isRowModified = useCallback(
    (rowData) => {
      if (rowData.isNew) return false;

      const originalRow = originalData.find(
        (item) => item.pn_DivisionID === rowData.pn_DivisionID
      );

      if (!originalRow) return false;

      return (
        String(originalRow.BranchID) !== String(rowData.BranchID) ||
        String(originalRow.v_DivisionName) !== String(rowData.v_DivisionName) ||
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
          [rowData.pn_DivisionID]: modified,
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
      (!lastRow.BranchID || !lastRow.v_DivisionName || !lastRow.status)
    ) {
      toast.dismiss();
      toast.warning(
        "Please fill all fields in the current row before adding a new one.",
        {
          position: "top-center",
          autoClose: 1000,
        }
      );
      return;
    }

    const newRow = {
      pnCompanyId,
      BranchID: "",
      v_DivisionName: "",
      status: "",
      isNew: true,
    };
    setGridData((prev) => [...prev, newRow]);
  };

  const handleSaveAll = async () => {
    try {
      toast.dismiss();
      const newRows = gridData.filter((row) => row.isNew);
      if (newRows.length === 0) {
        toast.error("No new data to save", {
          position: "top-center",
          autoClose: 1000,
        });
        return;
      }

      for (const row of newRows) {
        if (!row.BranchID || !row.v_DivisionName || !row.status) {
          toast.error("Please fill all fields for new rows before saving.", {
            position: "top-center",
            autoClose: 1000,
          });
          return;
        }
      }

      const queries = newRows.map((row) => {
        const statusChar = getStatusChar(row.status);
        return `INSERT INTO paym_Division (pn_CompanyID, BranchID, v_DivisionName, status) 
                VALUES ('${row.pnCompanyId}', '${row.BranchID}', '${row.v_DivisionName}', '${statusChar}')`;
      });

      await Promise.all(
        queries.map((query) => postRequest(ServerConfig.url, SAVE, { query }))
      );

      toast.success("Data saved successfully", {
        position: "top-center",
        autoClose: 1000,
      });
      await fetchAllData();
    } catch (error) {
      toast.error("Failed to save data", { position: "top-center", autoClose: 1000 });
    }
  };

  const handleUpdateRow = async (rowData) => {
    try {
      toast.dismiss();
      const statusChar = getStatusChar(rowData.status);
      const query = `UPDATE paym_Division 
                    SET BranchID = '${rowData.BranchID}', 
                        v_DivisionName = '${rowData.v_DivisionName}', 
                        status = '${statusChar}' 
                    WHERE pn_DivisionID = '${rowData.pn_DivisionID}'`;

      await postRequest(ServerConfig.url, SAVE, { query });

      setModifiedRows((prev) => {
        const newModified = { ...prev };
        delete newModified[rowData.pn_DivisionID];
        return newModified;
      });

      toast.success("Data updated successfully", {
        position: "top-center",
        autoClose: 1000,
      });
      await fetchAllData();
    } catch (error) {
      toast.error("Failed to update data", { position: "top-center", autoClose: 1000 });
    }
  };

  const handleDeleteRow = (rowData) => {
    toast.dismiss();

    toast.info(
      <div style={{ textAlign: "center" }}>
        Are you sure you want to delete this record?
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "center",
            gap: "8px",
          }}
        >
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
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        toastId: "delete-confirmation",
      }
    );
  };

  const executeDelete = async (rowData) => {
    try {
      const query = `DELETE FROM [dbo].[paym_Division] WHERE [pn_DivisionID] = '${rowData.pn_DivisionID}'`;
      await postRequest(ServerConfig.url, SAVE, { query });

      toast.error("Data deleted successfully", {
        position: "top-center",
        autoClose: 1000,
      });

      await fetchAllData();
    } catch (error) {
      toast.error("Failed to delete data", {
        position: "top-center",
        autoClose: 1000,
      });
    }
  };

  const columnDefs = useMemo(
    () => [
      {
        headerName: "BRANCH NAME",
        field: "BranchID",
        editable: true,
        cellStyle: {
          whiteSpace: "normal",
          overflow: "visible",
          wordBreak: "break-word",
          textAlign: "left"
        },
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: branch.map((b) => b.BranchName) },
        valueGetter: (params) => {
          const branchItem = branch.find(
            (b) => b.pn_BranchID === params.data.BranchID
          );
          return branchItem?.BranchName || "";
        },
        valueSetter: (params) => {
          const selectedBranch = branch.find(
            (b) => b.BranchName === params.newValue
          );
          if (selectedBranch) {
            params.data.BranchID = selectedBranch.pn_BranchID;
            return true;
          }
          return false;
        },
        minWidth: 150,
      },
      {
        headerName: "DIVISION NAME",
        field: "v_DivisionName",
        editable: true,
        minWidth: 160,
        cellStyle: {
          whiteSpace: "normal",
          overflow: "visible",
          wordBreak: "break-word",
          textAlign: "left"
        },
      },
      {
        headerName: "STATUS",
        field: "status",
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: ["Active", "Inactive", "Pending"] },
        minWidth: 80,
        cellStyle: {
          whiteSpace: "normal",
          overflow: "visible",
          wordBreak: "break-word",
          textAlign: "left"
        },
      },
      {
        headerName: "ACTION",
        cellStyle: {
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
              disabled={!modifiedRows[params.data.pn_DivisionID]}
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
    [branch, modifiedRows, handleUpdateRow, handleDeleteRow]
  );

  // 🔽 Apply filters to gridData
  const filteredData = useMemo(() => {
    return gridData.filter((row) => {
      const statusMatch = statusFilter ? row.status === statusFilter : true;
      const branchMatch = branchFilter
        ? String(row.BranchID) === String(branchFilter)
        : true;
      return statusMatch && branchMatch;
    });
  }, [gridData, statusFilter, branchFilter]);


  return (
    <Grid container sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Navbar />
      <Grid item xs={12} sx={{ display: "flex" }}>
        <Sidenav />

        {/* Main Content */}
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
            width: "100%",     // full width, CSS will cap
            maxWidth: "900px", // matches CSS for centering
          }}
        >
          {/* AppBar */}
          <AppBar
            position="static"
            className="company-appbar"
          >
            <Toolbar className="company-toolbar">
              <Typography
                variant="h5"
                className="company-title"
                sx={{ flexGrow: 1 }}
              >
                DIVISION
              </Typography>
            </Toolbar>
          </AppBar>

          {/* Filters */}
          <Paper
            elevation={3}
            sx={{
              p: 1,
              width: "100%",
              maxWidth: "900px",
              mx: "auto",   // ⬅ centers Paper (both sides adjust equally)
            }}
          >


            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
              }}
            >
              {/* Branch Filter */}
              <FormControl fullWidth sx={{ minWidth: 100 }}>
                <InputLabel>Branch</InputLabel>
                <Select
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                  label="Branch"
                >
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
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
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
              domLayout="autoHeight"   // 👈 enables auto height
              defaultColDef={{ flex: 1, minWidth: 120, resizable: true }}
              animateRows={true}
              pagination={true}
              paginationPageSize={10}
              getRowStyle={(params) => ({
                backgroundColor:
                  params.node.rowIndex % 2 === 0 ? "#cde3f2" : "#ffffff",
              })}
              onCellValueChanged={handleCellValueChanged}
              getRowHeight={() => 33}
            />
          </Box>


          {/* Action Buttons */}
          <Box
            mt={2}
mr={4}
            display="flex"
            flexDirection={{ sm: "row" }}
            justifyContent="flex-end"
            gap={2}
          >
            <Button
              variant="contained"
              onClick={handleAddRow}
              sx={{ width: 150, borderRadius: "10px" }}
            >
              Add Division
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveAll}
              sx={{ width: 150, borderRadius: "10px" }}
            >
              Save All
            </Button>
          </Box>

        </Grid>

      </Grid>
    </Grid>
  );

};

export default DivisionMaster1;
