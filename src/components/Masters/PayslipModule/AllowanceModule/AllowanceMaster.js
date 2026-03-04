import {AgGridReact} from 'ag-grid-react'
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-quartz.css"
import { useState } from 'react';
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import { useCallback } from 'react';
import { useMemo } from 'react';
import { REPORTS, SAVE } from '../../../../serverconfiguration/controllers';
import { postRequest } from '../../../../serverconfiguration/requestcomp';
import { useEffect } from 'react';
import { ServerConfig } from '../../../../serverconfiguration/serverconfig';
import { Button, CardContent, Grid, Typography } from '@mui/material';
import Sidenav from "../../../Home Page/Sidenav";
import Navbar from "../../../Home Page/Navbar";
import './Gridstyle.css'
import { Card } from 'react-bootstrap';
import { Snackbar, Alert } from '@mui/material';
// import './App.css';
ModuleRegistry.registerModules([ClientSideRowModelModule]);

function AllowanceMasterBranch() {
    const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
    const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
    const [rowData, setRowData] = useState([]);
    const [Branch, setBranch] = useState([]);
    const [isloggedin, setisloggedin] = useState(sessionStorage.getItem("user"));
    const [Allowance, setAllowance] = useState([]);
    const [CompanyID, setCompanyID] = useState('')
    const [saveMessage, setSaveMessage] = useState(''); // For message display
const [alertSeverity, setAlertSeverity] = useState('info'); // For alert severity
const [alertOpen, setAlertOpen] = useState(false); // Controls Snackbar visibility
const [allowancemasterapprove, setallowancemasterapprove] = useState([])

    console.log("isloggedin", isloggedin);
    
    useEffect(() => {
      async function getData() {
          try {
              const Branchdata = await postRequest(ServerConfig.url, REPORTS, {
                  query: `SELECT * FROM paym_Branch WHERE Branch_User_Id = '${isloggedin}'`,
              });
              setBranch(Branchdata.data);
  
              const Companyid = await postRequest(ServerConfig.url, REPORTS, {
                  query: `SELECT pn_CompanyID FROM paym_Branch WHERE Branch_User_Id = '${isloggedin}'`,
              });
              setCompanyID(Companyid.data);
  
              if (Branchdata.data && Branchdata.data.length > 0 && Companyid.data && Companyid.data.length > 0) {
                  const branchId = Branchdata.data[0].pn_BranchID;
                  const companyId = Companyid.data[0].pn_CompanyID;
  
                  const AllowanceMasterApprove = await postRequest(ServerConfig.url, REPORTS, {
                      query: `SELECT * FROM AllowanceMasterApprove WHERE pn_CompanyID = ${companyId} AND pn_BranchID = ${branchId} AND pending = 'Yes'`,
                  });
  
                  const Allowancedata = await postRequest(ServerConfig.url, REPORTS, {
                      query: `SELECT * FROM AllowanceMaster WHERE pn_BranchID = ${branchId} ORDER BY d_order`,
                  });
  
                  const combinedData = [
                      ...Allowancedata.data.map((item) => ({
                          ...item,
                          isPendingApproval: false, // Data from AllowanceMaster
                      })),
                      ...AllowanceMasterApprove.data.map((item) => ({
                          ...item,
                          isPendingApproval: true, // Data from AllowanceMasterApprove
                      })),
                  ];
  
                  const sortedData = combinedData.sort((a, b) => a.d_order - b.d_order);
                  setRowData(
                      sortedData.map((item, index) => ({
                          ...item,
                          position: index + 1, // Track position
                      }))
                  );
              }
          } catch (error) {
              console.error("Error fetching data", error);
          }
      }
  
      getData();
  }, [isloggedin]);
  
    useEffect(() => {
      console.log("Branch", Branch);
      console.log("Allowance", Allowance);
      console.log('Companyid', CompanyID)
      console.log('AMapprove', allowancemasterapprove)
    }, [Branch, Allowance, CompanyID]);

    const handleSave = async () => {
      try {
          const pn_CompanyID = CompanyID[0]?.pn_CompanyID;
          const pn_BranchID = Branch[0]?.pn_BranchID;
  
          if (!pn_CompanyID || !pn_BranchID) {
              setSaveMessage('Company or Branch ID is missing. Cannot save data.');
              setAlertSeverity('error');
              setAlertOpen(true);
              return;
          }
  
          // Filter rows to include only those from AllowanceMasterApprove (pending approval)
          const rowsToSave = rowData.filter(
              (row) => (row.isNew || row.isPendingApproval) && row.v_EarningsName
          );
  
          if (rowsToSave.length === 0) {
              setSaveMessage('No data to send for approval.');
              setAlertSeverity('warning');
              setAlertOpen(true);
              return;
          }
  
          let rowsSaved = 0; // Track successful operations
  
          for (const row of rowsToSave) {
              const { position: d_order, v_EarningsName } = row;
  
              if (!v_EarningsName) continue;
  
              const existingData = await postRequest(ServerConfig.url, REPORTS, {
                  query: `SELECT * FROM AllowanceMasterApprove WHERE pn_CompanyID = ${pn_CompanyID} AND pn_BranchID = ${pn_BranchID} AND v_EarningsName = '${v_EarningsName}' AND Pending = 'Yes'`,
              });
  
              if (existingData.data.length > 0) {
                  const updateResult = await postRequest(ServerConfig.url, SAVE, {
                      query: `UPDATE AllowanceMasterApprove SET v_EarningsName = '${v_EarningsName}' WHERE pn_CompanyID = ${pn_CompanyID} AND pn_BranchID = ${pn_BranchID} AND v_EarningsName = '${v_EarningsName}'`,
                  });
                  if (updateResult.status === 200) {
                      rowsSaved++;
                      row.isPendingApproval = true; // Mark as pending after update
                      row.isNew = false;
                  }
              } else {
                  if (row.isNew) {
                      const insertResult = await postRequest(ServerConfig.url, SAVE, {
                          query: `INSERT INTO AllowanceMasterApprove (pn_CompanyID, pn_BranchID, v_EarningsName, Approve, Pending, Reject, RequestDate, ResponseDate, Request_User_Id, Response_User_Id) 
                                  VALUES (${pn_CompanyID}, ${pn_BranchID}, '${v_EarningsName}', 'No', 'Yes', 'No', GETDATE(), NULL, '${isloggedin}', NULL)`,
                      });
                      if (insertResult.status === 200) {
                          rowsSaved++;
                          row.isPendingApproval = true; // Mark as pending after insert
                          row.isNew = false;
                      }
                  }
              }
          }
  
          // Update rowData with new pending approval status
          setRowData([...rowData]);
  
          if (rowsSaved > 0) {
              setSaveMessage('Data has been sent for approval. Once approved, it will be enabled.');
              setAlertSeverity('warning');
          } else {
              setSaveMessage('No changes were made. Data was already up to date.');
              setAlertSeverity('info');
          }
  
          setAlertOpen(true);
          
      } catch (error) {
          console.error('Error saving data', error);
          setSaveMessage('An error occurred while saving the data.');
          setAlertSeverity('error');
          setAlertOpen(true);
      }
  };
     
const columnDefs = useMemo(() => [
  {
      field: 'v_EarningsName',
      rowDrag: true,
      headerName: 'Earnings Name',
      editable: (params) => !params.data.isPendingApproval,
      cellStyle: (params) => ({
          color: 'black',
          backgroundColor: params.data.isPendingApproval ? '#E8E8E8' : 'transparent',
      }),
      flex: 1,
  },
], []);
    
    const defaultColDef = useMemo(() => {
      return {
        width: 250,
      };
    }, []);
    
    const rowSelection = useMemo(() => {
      return { mode: "multiRow", headerCheckbox: false };
    }, []);
  
    const onRowDragEnd = (event) => {
        const updatedRowData = [];
      
        for (let i = 0; i < event.api.getDisplayedRowCount(); i++) {
          const rowNode = event.api.getDisplayedRowAtIndex(i);
          updatedRowData.push({
            ...rowNode.data,
            position: i + 1, // Track the new position based on current order
          });
        }
        setRowData(updatedRowData);
        console.log("Updated Allowance Order:");
        updatedRowData.forEach((row) => {
          console.log(`Position: ${row.position}, Name: ${row.v_EarningsName}`);
        });
      };

      const onGridReady = (params) => {
        params.api.sizeColumnsToFit();
      };

      const handleAdd = () => {
        // Create a new empty row with required fields
        const newRow = {
          v_EarningsName: '', // Empty field for user to enter the earnings name
          d_order: rowData.length + 1, // Assign the next order number
          position: rowData.length + 1, // Assign the next position
          isPendingApproval: false, // Not pending yet
          isNew: true, // Mark as a new row
        };
      
        // Add the empty row to the grid
        setRowData((prevRowData) => [...prevRowData, newRow]);
      };
    return (
        <div className="background1">

        <Grid >
          {/* Navbar */}
          <Grid item xs={12}>
            <Navbar />
          </Grid>
    
          {/* Sidebar and Main Content */}
          <Grid item xs={12} sx={{ display: "flex", flexDirection: "row" }}>
            {/* Sidebar */}
            <Grid item xs={2}>
              <Sidenav />
            </Grid>
    
            {/* Main Content */}
         
            <Grid item xs={10} sx={{ padding: "60px 0 0 0", overflowY: "auto",margin:'0 auto' }}>
    
            <div className="background1">
    
              <Card style={{ maxWidth: 1100, width: "100%", padding:"50px"    
              }}>
                <CardContent>
                <Grid elevation={3} style={{ padding: 2, width: '970px'}}>
                 
                <Typography variant="h5" align="center" fontWeight={'425'} gutterBottom textAlign={'center'}>
               Allowance Master
              </Typography>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', marginBottom: '10px' }}>
        <div className="ag-theme-quartz" style={{flex: 0.1, width: 400 }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            rowDragManaged={true}
            domLayout="autoHeight"
            rowDragMultiRow={true}
            rowSelection={rowSelection}
            onRowDragEnd={onRowDragEnd}
            onGridReady={onGridReady}
          />
          <div style={{  display: 'flex', justifyContent: 'flex-end' }}>
          <Snackbar 
  open={alertOpen} 
  autoHideDuration={3000} 
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>
  <Alert severity={alertSeverity} sx={{ width: '100%' }}>
    {saveMessage}
  </Alert>
</Snackbar>

<Button variant="outlined" color="primary" size="small" onClick={handleAdd}>
  Add
</Button>

        <Button variant="outlined" color="primary" size='small' onClick={handleSave}>
          Save
        </Button>
       </div>
        </div>
      </div>
      </Grid>
      </CardContent>
      </Card>
      </div>
      </Grid>
      </Grid>
      </Grid>
      </div>

    );
  }
  
  
export default AllowanceMasterBranch;
