import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import { postRequest } from '../../serverconfiguration/requestcomp';
import { ServerConfig } from '../../serverconfiguration/serverconfig';
import { REPORTS, SAVE } from '../../serverconfiguration/controllers';
import Navbar from "../Home Page-comapny/Navbar1";
import Sidenav from "../Home Page-comapny/Sidenav1";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { toast } from 'react-toastify';

const PaymLeaveMaster1 = () => {
  const [company, setCompany] = useState([]);
  const [branch, setBranch] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [pnCompanyId, setPnCompanyId] = useState('');
  const [isloggedin, setIsloggedin] = useState(sessionStorage.getItem('user'));

  // filter states
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedType, setSelectedType] = useState('');

  // filtered data
  const [filteredData, setFilteredData] = useState([]);

  // Fetch company data
  const fetchCompanyData = async () => {
    const companyData = await postRequest(ServerConfig.url, REPORTS, {
      query: `SELECT * FROM paym_Company WHERE company_user_id = '${isloggedin}'`,
    });
    setCompany(companyData.data);
    if (companyData.data.length > 0) {
      setPnCompanyId(companyData.data[0].pn_CompanyID);
    }
  };

  // Fetch branch data
  const fetchBranchData = async () => {
    if (pnCompanyId) {
      const branchData = await postRequest(ServerConfig.url, REPORTS, {
        query: `SELECT * FROM paym_branch WHERE pn_CompanyID = '${pnCompanyId}'`,
      });
      setBranch(branchData.data);
    }
  };

  // Fetch leave data
  const fetchLeaveData = async () => {
    if (pnCompanyId) {
      const leaveData = await postRequest(ServerConfig.url, REPORTS, {
        query: `SELECT * FROM paym_leave WHERE pn_CompanyID = '${pnCompanyId}'`,
      });
      setGridData(leaveData.data);
    }
  };

  // Apply filters whenever gridData / selectedBranch / selectedType changes
  useEffect(() => {
    let data = gridData;
    if (selectedBranch) {
      data = data.filter((row) => row.pn_BranchID == selectedBranch);
    }
    if (selectedType) {
      data = data.filter((row) => row.Type === selectedType);
    }
    setFilteredData(data);
  }, [gridData, selectedBranch, selectedType]);

  // Fetch all data
  const fetchAllData = async () => {
    await fetchCompanyData();
    await fetchBranchData();
    await fetchLeaveData();
  };

  useEffect(() => {
    fetchAllData();
  }, [isloggedin, pnCompanyId]);

  const handleAddRow = () => {
    const lastRow = gridData[gridData.length - 1];
    if (
      lastRow &&
      (!lastRow.v_leaveName || !lastRow.pn_leaveCode || !lastRow.pn_Count || !lastRow.status || !lastRow.pn_BranchID || !lastRow.annual_leave || !lastRow.max_days || !lastRow.EL || !lastRow.Type)
    ) {
      toast.dismiss();
      toast.warning("Please fill all fields in the current row before adding a new one.", {
        position: "top-center",
        style: { textAlign: "center" },
        autoClose: 1000,
      });
      return;
    }

    const newRow = {
      pnCompanyId,
      v_leaveName: '',
      pn_leaveCode: '',
      pn_Count: '',
      status: '',
      pn_BranchID: null,
      annual_leave: '',
      max_days: '',
      EL: '',
      Type: '',
      isNew: true,
    };
    setGridData((prev) => [...prev, newRow]);
  };

  const handleSaveAll = async () => {
    try {
      toast.dismiss();
      const newRows = gridData.filter(row => row.isNew);
      if (newRows.length === 0) {
        toast.error("No new data to save", {
          position: "top-center",
          style: { textAlign: "center" },
          autoClose: 1000,
        });
        return;
      }

      for (const row of newRows) {
        if (!row.v_leaveName || !row.pn_leaveCode || !row.pn_Count || !row.status || !row.pn_BranchID || !row.annual_leave || !row.max_days || !row.EL || !row.Type) {
          toast.error("Please fill all fields for new rows before saving.", {
            position: "top-center",
            style: { textAlign: "center" },
            autoClose: 1000,
          });
          return;
        }
      }

      const queries = newRows.map(row => {
        return `INSERT INTO [dbo].[paym_leave] ([pn_CompanyID], [v_leaveName], [pn_leaveCode], [pn_Count], [status], [pn_BranchID], [annual_leave], [max_days], [EL], [Type]) 
                VALUES ('${row.pnCompanyId}', '${row.v_leaveName}', '${row.pn_leaveCode}', ${row.pn_Count}, '${row.status}', ${row.pn_BranchID}, '${row.annual_leave}', ${row.max_days}, '${row.EL}', '${row.Type}')`;
      });

      await Promise.all(
        queries.map(query => postRequest(ServerConfig.url, SAVE, { query }))
      );
      toast.info("Data saved successfully", {
        position: "top-center",
        style: { textAlign: "center" },
        autoClose: 1000,
      });
      await fetchLeaveData();
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save data", {
        position: "top-center",
        style: { textAlign: "center" },
        autoClose: 1000,
      });
    }
  };

  const handleUpdateRow = async (rowData) => {
    try {
      toast.dismiss();
      const query = `UPDATE [dbo].[paym_leave] 
                     SET [v_leaveName] = '${rowData.v_leaveName}', [pn_leaveCode] = '${rowData.pn_leaveCode}', [pn_Count] = ${rowData.pn_Count}, 
                         [status] = '${rowData.status}', [pn_BranchID] = ${rowData.pn_BranchID}, [annual_leave] = '${rowData.annual_leave}', 
                         [max_days] = ${rowData.max_days}, [EL] = '${rowData.EL}', [Type] = '${rowData.Type}' 
                     WHERE [pn_CompanyID] = '${rowData.pnCompanyId}' AND [pn_leaveID] = '${rowData.pn_leaveID}'`;

      await postRequest(ServerConfig.url, SAVE, { query });

      toast.success("Data updated successfully", {
        position: "top-center",
        style: { textAlign: "center" },
        autoClose: 1000,
      });

      setGridData((prevData) =>
        prevData.map((row) =>
          row.pn_leaveID === rowData.pn_leaveID ? { ...row, ...rowData } : row
        )
      );
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("Failed to update data", {
        position: "top-center",
        style: { textAlign: "center" },
        autoClose: 1000,
      });
    }
  };

  const executeDelete = async (rowData) => {
    try {
      if (!rowData.pn_leaveID) {
        setGridData((prev) => prev.filter((r) => r !== rowData));
        return;
      }

      const query = `DELETE FROM [dbo].[paym_leave] WHERE [pn_leaveID] = '${rowData.pn_leaveID}'`;
      await postRequest(ServerConfig.url, SAVE, { query });

      toast.error("Data deleted successfully", {
        position: "top-center",
        style: { textAlign: "center" },
        autoClose: 1000,
      });

      await fetchLeaveData();
    } catch (error) {
      console.error("Error deleting leave data:", error);
      toast.error("Failed to delete leave record", {
        position: "top-center",
        style: { textAlign: "center" },
        autoClose: 1000,
      });
    }
  };

  const handleDeleteRow = (rowData) => {
    toast.dismiss();
    toast.info(
      <div style={{ textAlign: 'center' }}>
        Are you sure you want to delete this leave record?
        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
          <Button
            variant="contained"
            size="small"
            color="error"
            onClick={async () => {
              toast.dismiss();
              await executeDelete(rowData);
            }}
            style={{ minWidth: '80px' }}
          >
            Delete
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => toast.dismiss()}
            style={{ minWidth: '80px' }}
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

  const columnDefs = [
    { headerName: "LEAVE NAME", field: "v_leaveName", editable: true, minWidth: 150 },
    { headerName: "LEAVE CODE", field: "pn_leaveCode", editable: true, minWidth: 120 },
    { headerName: "COUNT", field: "pn_Count", editable: true, minWidth: 100 },
    { headerName: "STATUS", field: "status", editable: true, minWidth: 100 },
    { headerName: "BRANCH ID", field: "pn_BranchID", editable: true, minWidth: 140 },
    { headerName: "ANNUAL LEAVE", field: "annual_leave", editable: true, minWidth: 140 },
    { headerName: "MAX DAYS", field: "max_days", editable: true, minWidth: 130 },
    { headerName: "EL", field: "EL", editable: true, minWidth: 80 },
    { headerName: "TYPE", field: "Type", editable: true, minWidth: 100 },
    {
      headerName: "ACTION",
      cellRenderer: (params) => (
        <div>
          <IconButton onClick={() => handleUpdateRow(params.data)} color="success">
            <DoneOutlineIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteRow(params.data)} color="error">
            <DeleteOutlineIcon />
          </IconButton>
        </div>
      ),
      minWidth: 100,
    },
  ];

  return (
    <Grid container style={{ backgroundColor: '#f5f5f5' }}>
      <Navbar />
      <Grid item xs={12} sx={{ display: "flex" }}>
        <Sidenav />
        <Grid item xs={12} sx={{ padding: { xs: "20px", sm: "40px" }, overflowY: "auto", margin: '0 auto' }}>
          <AppBar position="static" sx={{ width: '100%', marginTop: "70px", minHeight: "60px" }}>
            <Toolbar sx={{ justifyContent: 'left', height: '100%' }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ textAlign: 'left', fontWeight: 'bold', color: 'white', lineHeight: '60px' }}
              >
                LEAVE MANAGEMENT
              </Typography>
            </Toolbar>
          </AppBar>

          {/* Filters */}
          <Box display="flex" gap={2} mt={2} mb={2} flexWrap="wrap">
            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel>Branch</InputLabel>
              <Select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {branch.map((b) => (
                  <MenuItem key={b.pn_BranchID} value={b.pn_BranchID}>
                    {b.v_BranchName || b.pn_BranchID}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Casual">Casual</MenuItem>
                <MenuItem value="Sick">Sick</MenuItem>
                <MenuItem value="Earned">Earned</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Grid */}
          <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
            <AgGridReact
              rowData={filteredData}
              columnDefs={columnDefs}
              defaultColDef={{ flex: 1, minWidth: 100, resizable: true }}
              animateRows={true}
              pagination={true}
              paginationPageSize={10}
              getRowStyle={params => ({
                backgroundColor: params.node.rowIndex % 2 === 0 ? '#cde3f2' : '#ffffff'
              })}
            />
          </div>

          <Box mt={2} display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="flex-end">
            <Button variant="contained" onClick={handleAddRow} sx={{ mb: { xs: 1, sm: 0 }, mr: { sm: 1 } }}>
              Add Leave
            </Button>
            <Button variant="contained" color="primary" onClick={handleSaveAll}>
              Save All
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PaymLeaveMaster1;
