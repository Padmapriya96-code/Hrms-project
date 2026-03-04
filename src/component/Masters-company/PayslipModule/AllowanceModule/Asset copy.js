import React, { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  Button,
  Box,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  AppBar,
  Toolbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Navbar from "../../../Home Page-comapny/Navbar1";
import Sidenav from "../../../Home Page-comapny/Sidenav1";
import { toast } from "react-toastify";
import { postRequest } from "../../../../serverconfiguration/requestcomp";
import { ServerConfig } from "../../../../serverconfiguration/serverconfig";
import { REPORTS, SAVE } from "../../../../serverconfiguration/controllers";

const AssetGridForm = () => {
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const gridApiRef = useRef(null);
  const [gridHeight] = useState(500);

  const loggedUser = sessionStorage.getItem("user");
  const databaseName = sessionStorage.getItem("databaseName");

  const [companyList, setCompanyList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [companyId, setCompanyId] = useState(null);
  const [branchId, setBranchId] = useState(null);

  /* ----------------------------------------------------------
     FETCH COMPANY
  ---------------------------------------------------------- */
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const query = `
          SELECT [pn_CompanyID], [CompanyName]
          FROM [${databaseName}].[dbo].[paym_Company]
          WHERE [company_user_id] = '${loggedUser}'
        `;
        const res = await postRequest(ServerConfig.url, REPORTS, { query });

        setCompanyList(res.data);
        if (res.data.length > 0) {
          const cid = res.data[0].pn_CompanyID;
          setCompanyId(cid);
        }
      } catch (err) {
        console.error("Company Fetch Error:", err);
      }
    };

    fetchCompany();
  }, [loggedUser, databaseName]);

  /* ----------------------------------------------------------
     FETCH BRANCHES BASED ON COMPANY
  ---------------------------------------------------------- */
  useEffect(() => {
    const fetchBranches = async () => {
      if (!companyId) return;

      try {
        const query = `
          SELECT [pn_BranchID], [BranchName]
          FROM [${databaseName}].[dbo].[paym_Branch]
          WHERE [pn_CompanyID] = ${companyId}
        `;
        const res = await postRequest(ServerConfig.url, REPORTS, { query });

        setBranchList(res.data);
        if (res.data.length > 0) {
          setBranchId(res.data[0].pn_BranchID);
        }
      } catch (err) {
        console.error("Branch Fetch Error:", err);
      }
    };

    fetchBranches();
  }, [companyId, databaseName]);

  /* ----------------------------------------------------------
     FETCH ASSETS BASED ON BRANCH
  ---------------------------------------------------------- */
  const fetchAssets = async () => {
    if (!companyId || !branchId) return;

    setLoading(true);
    try {
      const query = `
        SELECT 
          [pn_Assetid],
          [AssetType],
          [Asset_name] AS AssetName,
          [Asset_SerialNumber] AS AssetSerialNumber,
          [PurchaseDate],
          [AssetValue],
          [Status],
          [Description],
          [CreatedDate],
          [AssetAssignedTo]
        FROM [${databaseName}].[dbo].[Assets]
        WHERE [pn_CompanyID] = ${companyId} 
        AND [BranchID] = ${branchId}
        ORDER BY [CreatedDate] DESC
      `;

      const res = await postRequest(ServerConfig.url, REPORTS, { query });

      setRowData(Array.isArray(res.data) ? res.data : []);
      setError(null);
    } catch (err) {
      console.error("Asset Fetch Error:", err);
      setError("Failed to load Asset data.");
      toast.error("Database Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [companyId, branchId]);

  /* ----------------------------------------------------------
     CUSTOM DATE PICKER
  ---------------------------------------------------------- */
  const DatePickerEditor = function () {};
  DatePickerEditor.prototype.init = function (params) {
    this.eInput = document.createElement("input");
    this.eInput.type = "date";
    this.eInput.className = "ag-input-field-input";
    this.eInput.style.width = "100%";
    this.eInput.value = params.value ? params.value.substring(0, 10) : "";
  };
  DatePickerEditor.prototype.getGui = function () {
    return this.eInput;
  };
  DatePickerEditor.prototype.afterGuiAttached = function () {
    this.eInput.focus();
  };
  DatePickerEditor.prototype.getValue = function () {
    return this.eInput.value;
  };
  DatePickerEditor.prototype.isPopup = function () {
    return false;
  };

  /* ----------------------------------------------------------
     ADD NEW ASSET ROW
  ---------------------------------------------------------- */
  const handleAddRow = () => {
    const topRow = rowData[0];

    if (
      topRow &&
      (!topRow.AssetType ||
        !topRow.AssetName ||
        !topRow.AssetSerialNumber ||
        !topRow.PurchaseDate ||
        !topRow.AssetValue)
    ) {
      toast.warning("Please complete the first row before adding a new one.", {
        position: "top-center",
        autoClose: 1000,
      });
      return;
    }

    const newRow = {
      pn_CompanyID: companyId,
      BranchID: branchId,
      AssetType: "",
      AssetName: "",
      AssetSerialNumber: "",
      PurchaseDate: "",
      AssetValue: "",
      Status: "Active",
      Description: "",
      CreatedDate: new Date().toISOString(),
      isNew: true,
    };

    setRowData((prev) => [newRow, ...prev]);
  };

  /* ----------------------------------------------------------
     SAVE ROW (INSERT OR UPDATE)
  ---------------------------------------------------------- */
  const handleSaveRow = async (row) => {
    try {
      if (!row.AssetName || !row.AssetSerialNumber) {
        toast.error("Asset Name & Serial Number are required", {
          position: "top-center",
          autoClose: 1000,
        });
        return;
      }

      const isNew = !row.pn_Assetid;

      const query = isNew
        ? `
          INSERT INTO [${databaseName}].[dbo].[Assets]
          ([pn_CompanyID], [BranchID], [AssetType], [Asset_name], [Asset_SerialNumber], 
           [PurchaseDate], [AssetValue], [Status], [Description], [CreatedDate])
          VALUES
          (${companyId}, ${branchId}, '${row.AssetType}', '${row.AssetName}',
          '${row.AssetSerialNumber}', '${row.PurchaseDate}', ${row.AssetValue || 0},
          '${row.Status}', '${row.Description}', GETDATE())
        `
        : `
          UPDATE [${databaseName}].[dbo].[Assets]
          SET [AssetType] = '${row.AssetType}',
              [Asset_name] = '${row.AssetName}',
              [Asset_SerialNumber] = '${row.AssetSerialNumber}',
              [PurchaseDate] = '${row.PurchaseDate}',
              [AssetValue] = ${row.AssetValue || 0},
              [Status] = '${row.Status}',
              [Description] = '${row.Description}'
          WHERE [pn_Assetid] = ${row.pn_Assetid}
        `;

      await postRequest(ServerConfig.url, SAVE, { query });

      toast.success(isNew ? "Asset Added" : "Asset Updated", {
        position: "top-center",
        autoClose: 1000,
      });

      fetchAssets();
    } catch (err) {
      console.error("Save Error:", err);
      toast.error("Failed to save asset.");
    }
  };

  /* ----------------------------------------------------------
     DELETE ROW
  ---------------------------------------------------------- */
  const handleDeleteRow = async () => {
    if (!selectedRowId) return;

    try {
      const query = `
        DELETE FROM [${databaseName}].[dbo].[Assets]
        WHERE [pn_Assetid] = ${selectedRowId}
      `;
      await postRequest(ServerConfig.url, SAVE, { query });

      toast.error("Asset Deleted");
      fetchAssets();
      setConfirmOpen(false);
    } catch (err) {
      console.error("Delete Error:", err);
      toast.error("Failed to delete asset.");
    }
  };

  /* ----------------------------------------------------------
     GRID COLUMNS
  ---------------------------------------------------------- */
  const columnDefs = [
    { field: "AssetType", headerName: "Asset Type", editable: true },
    { field: "AssetName", headerName: "Asset Name", editable: true },
    { field: "AssetSerialNumber", headerName: "Serial Number", editable: true },
    {
      field: "PurchaseDate",
      headerName: "Purchase Date",
      editable: true,
      cellEditor: "datePickerEditor",
      valueFormatter: (params) =>
        params.value ? params.value.split("T")[0] : "",
    },
    { field: "AssetValue", headerName: "Value", editable: true },
    { field: "Description", headerName: "Description", editable: true },
    {
      field: "Status",
      headerName: "Status",
      editable: true,
      cellStyle: (params) => ({
        color: params.value === "Assigned" ? "red" : "green",
      }),
    },
    {
      headerName: "Actions",
      cellRenderer: (params) => (
        <Box display="flex" gap={1}>
          <Tooltip title="Save">
            <IconButton
              onClick={() => handleSaveRow(params.data)}
              color="success"
            >
              <DoneOutlineIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete">
            <IconButton
              color="error"
              onClick={() => {
                setSelectedRowId(params.data.pn_Assetid);
                setConfirmOpen(true);
              }}
            >
              <DeleteOutlineIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  /* ----------------------------------------------------------
     RENDER UI
  ---------------------------------------------------------- */
  if (loading) return <CircularProgress />;

  return (
    <Grid container style={{ backgroundColor: "#f5f5f5" }}>
      <Navbar />
      <Grid item xs={12} sx={{ display: "flex" }}>
        <Sidenav />

        <Grid
          item
          xs={12}
          sm={10}
          md={10}
          lg={10}
          sx={{
            padding: { xs: "20px", sm: "40px" },
            overflowY: "auto",
            margin: "0 auto",
          }}
        >
          {/* ----------------------------------------------------------
             BRANCH SELECT DROPDOWN (ADDED)
          ---------------------------------------------------------- */}
          <Grid item xs={4} sm={4} sx={{ mt: 6, mb: 1 }}>
            <FormControl fullWidth>
              <InputLabel id="branch-label">Select Branch</InputLabel>
              <Select
                labelId="branch-label"
                value={branchId || ""}
                label="Select Branch"
                onChange={(e) => setBranchId(e.target.value)}
              >
                {branchList.map((b) => (
                  <MenuItem key={b.pn_BranchID} value={b.pn_BranchID}>
                    {b.BranchName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <AppBar position="static" sx={{ width: "100%", minHeight: "60px" }}>
            <Toolbar>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", color: "white" }}
              >
                ASSETS
              </Typography>
            </Toolbar>
          </AppBar>

          {error && (
            <Box mt={2}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}

          <div
            className="ag-theme-alpine"
            style={{ height: gridHeight, width: "100%", overflowX: "auto" }}
          >
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={{
                editable: true,
                sortable: true,
                filter: true,
                resizable: true,
              }}
              getRowHeight={() => 33}
              pagination={true}
              components={{ datePickerEditor: DatePickerEditor }}
              onGridReady={(params) => (gridApiRef.current = params.api)}
              stopEditingWhenCellsLoseFocus={true}
              getRowStyle={(params) => ({
                backgroundColor:
                  params.node.rowIndex % 2 === 0 ? "#cde3f2" : "#ffffff",
              })}
            />
          </div>

          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              onClick={handleAddRow}
              disabled={!branchId}
            >
              Add Asset
            </Button>
          </Box>

          {/* ----------------------------------------------------------
             DELETE CONFIRMATION DIALOG
          ---------------------------------------------------------- */}
          <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>Are you sure you want to delete this asset?</DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
              <Button onClick={handleDeleteRow} color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AssetGridForm;
