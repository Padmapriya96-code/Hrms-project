import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  TextField,
  Button,
  Typography,
  FormControl,
  MenuItem,
  Checkbox,
  ListItemText,
  Menu,
  Container,
  Box,
  CardContent,
  IconButton,
  ListItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ServerConfig } from '../serverconfiguration/serverconfig';
import { postRequest } from '../serverconfiguration/requestcomp';
import { REPORTS } from '../serverconfiguration/controllers';
import Navbar from './Home Page/Navbar';
import Sidenav from './dashboredsss/Sidenav';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import EditIcon from '@mui/icons-material/Edit'; // Import Edit Icon
import DeleteIcon from '@mui/icons-material/Delete'; // Import Delete Icon
import { AgGridReact } from 'ag-grid-react'; // Import AG Grid
import 'ag-grid-community/styles/ag-grid.css'; // Import AG Grid styles
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Import AG Grid theme styles

// Custom cell editor for text input


// Custom cell editor for dropdown


export default function Permission() {
  const navigate = useNavigate();
  const [company, setCompany] = useState([]);
  const [branch, setBranch] = useState([]);
  const [pnCompanyId, setPnCompanyId] = useState('');
  const [isloggedin, setIsloggedin] = useState(sessionStorage.getItem('user'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBranchIds, setSelectedBranchIds] = useState([]);
  const [agGridData, setAgGridData] = useState([]); // State for AG Grid data
  const [newRow, setNewRow] = useState({ v_leaveName: '', pn_leaveCode: '', pn_Count: '' }); // State for new row data

  useEffect(() => {
    async function getData() {
      try {
        const companyData = await postRequest(ServerConfig.url, REPORTS, {
          query: `SELECT * FROM paym_Company WHERE company_user_id = '${isloggedin}'`,
        });
        setCompany(companyData.data);
        if (companyData.data.length > 0) {
          setPnCompanyId(companyData.data[0].pn_CompanyID);
        }
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    }
    getData();
  }, [isloggedin]);

  useEffect(() => {
    async function getData() {
      try {
        if (pnCompanyId) {
          const branchData = await postRequest(ServerConfig.url, REPORTS, {
            query: `SELECT * FROM paym_branch WHERE pn_CompanyID = '${pnCompanyId}'`,
          });
          setBranch(branchData.data);
        }
      } catch (error) {
        console.error('Error fetching branch data:', error);
      }
    }
    getData();
  }, [pnCompanyId]);

  useEffect(() => {
    const fetchLeaveData = async () => {
      if (pnCompanyId && selectedBranchIds.length > 0) {
        try {
          const leaveData = await postRequest(ServerConfig.url, REPORTS, {
            query: `SELECT * FROM paym_leave WHERE pn_CompanyID = '${pnCompanyId}' AND pn_BranchID IN (${selectedBranchIds.join(',')})`,
          });
          setAgGridData(leaveData.data); // Set the AG Grid data
        } catch (error) {
          console.error('Error fetching leave data:', error);
        }
      }
    };

    fetchLeaveData(); // Call the async function
  }, [pnCompanyId, selectedBranchIds]);

  const handleBranchChange = (branchId) => {
    setSelectedBranchIds((prev) =>
      prev.includes(branchId)
        ? prev.filter((id) => id !== branchId)
        : [...prev, branchId]
    );
  };

  const handleSelectAll = () => {
    if (selectedBranchIds.length === branch.length) {
      setSelectedBranchIds([]);
    } else {
      setSelectedBranchIds(branch.map(b => b.pn_BranchID));
    }
  };

  const handleAddRow = () => {
    setAgGridData((prevData) => [...prevData, newRow]);
    setNewRow({ v_leaveName: '', pn_leaveCode: '', pn_Count: '' }); // Reset new row input
  };

  const handleSave = async () => {
    try {
      // Assuming you have an API endpoint to save the leave data
      await postRequest(ServerConfig.url, REPORTS, {
        query: `INSERT INTO paym_leave (v_leaveName, pn_leaveCode, pn_Count) VALUES ${agGridData.map(row => `('${row.v_leaveName}', '${row.pn_leaveCode}', ${row.pn_Count})`).join(', ')}`,
      });
      alert('Data saved successfully!');
    } catch (error) {
      console.error('Error saving leave data:', error);
    }
  };

  const handleEditRow = (rowIndex) => {
    const rowData = agGridData[rowIndex];
    setNewRow(rowData); // Set the new row state to the selected row data for editing
    setAgGridData((prevData) => prevData.filter((_, index) => index !== rowIndex)); // Remove the row from the grid
  };

  const handleDeleteRow = (rowIndex) => {
    setAgGridData((prevData) => prevData.filter((_, index) => index !== rowIndex)); // Remove the row from the grid
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <div style={{ backgroundColor: "#fff" }}>
          <Box height={30} />
          <Box sx={{ display: "flex" }}>
            <Grid item xs={12} sm={10} md={9} lg={8} xl={7} style={{ marginLeft: "auto", marginRight: "auto" }}>
              <Container maxWidth="md" sx={{ p: 2 }}>
                <Grid style={{ padding: '80px 5px 0 5px' }}>
                  <Card style={{ maxWidth: 900, margin: '0 auto' }}>
                    <CardContent>
                      <Typography variant="h5" gutterBottom color="textPrimary" align="center">
                        Permission Slab
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth>
                            <TextField
                              value={company.find((c) => c.pn_CompanyID === pnCompanyId)?.CompanyName || ''}
                              variant="outlined"
                              fullWidth
                              InputProps={{ readOnly: true }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth>
                            <TextField
                              value={branch.length > 0 ? branch.filter(b => selectedBranchIds.includes(b.pn_BranchID)).map(b => b.BranchName).join(', ') : 'No branches'}
                              variant="outlined"
                              fullWidth
                              onClick={(event) => setAnchorEl(event.currentTarget)}
                              InputProps={{
                                readOnly: true,
                                endAdornment: (
                                  <IconButton size="small" aria-label="select branches">
                                    <ArrowDropDownIcon />
                                  </IconButton>
                                ),
                              }}
                              label="Branch List"
                            />
                            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                              <ListItem 
                                button 
                                onClick={handleSelectAll} 
                                sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontWeight: 'bold' }}
                              >
                                <ListItemText primary="Select All" />
                                <Checkbox 
                                  checked={selectedBranchIds.length === branch.length} 
                                  sx={{ ml: 'auto' }} // Move checkbox to the right
                                />
                              </ListItem>
                              {branch.map((b) => (
                                <MenuItem 
                                  key={b.pn_BranchID} 
                                  onClick={() => handleBranchChange(b.pn_BranchID)} 
                                  sx={{ display: 'flex', justifyContent: 'space-between', width: '280px', alignItems: 'center' }}
                                >
                                  <ListItemText primary={b.BranchName} />
                                  <Checkbox 
                                    checked={selectedBranchIds.includes(b.pn_BranchID)} 
                                    sx={{ ml: 'auto' }} // Move checkbox to the right
                                  />
                                </MenuItem>
                              ))}
                            </Menu>
                          </FormControl>
                        </Grid>
                      </Grid>
                      <Grid container spacing={2} style={{ marginTop: '20px' }}>
                        <Grid item xs={12}>
                          <div className="ag-theme-alpine" style={{ height: 300, width: '100%' }}>
                            <AgGridReact
                              rowData={agGridData} // Set the row data for AG Grid
                              columnDefs={[
                                {
                                  headerName: "From Duration",
                                  field: "v_leaveName",
                                  editable: true,
                                },
                                {
                                  headerName: "To Duration",
                                  field: "pn_leaveCode",
                                  editable: true,
                                },
                                {
                                  headerName: "Permission Deduction",
                                  field: "pn_Count",
                                  editable: true,
                                },
                                {
                                  headerName: "Actions",
                                  cellRendererFramework: (params) => (
                                    <div>
                                      <IconButton onClick={() => handleEditRow(params.rowIndex)}>
                                        <EditIcon />
                                      </IconButton>
                                      <IconButton onClick={() => handleDeleteRow(params.rowIndex)}>
                                        <DeleteIcon />
                                      </IconButton>
                                    </div>
                                  ),
                                },
                              ]}
                              pagination={true}
                              paginationPageSize={10}
                            />
                          </div>
                        </Grid>
                      </Grid>

                      <Grid container spacing={2} style={{ marginTop: '20px' }}>
                        <Grid item xs={12} sm={6}>
                          <Button variant="contained" color="primary" onClick={handleAddRow}>
                            Add Row
                          </Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Button variant="contained" color="secondary" onClick={handleSave}>
                            Save
                          </Button>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Container>
            </Grid>
          </Box>
        </div>
      </Grid>
    </Grid>
  );
}