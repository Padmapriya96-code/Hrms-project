import React, { useState, useEffect } from 'react';
import { Grid, Paper, CardContent, Typography,AppBar,Toolbar, Button, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ServerConfig } from '../../../serverconfiguration/serverconfig';
import { REPORTS } from '../../../serverconfiguration/controllers';
import { postRequest } from '../../../serverconfiguration/requestcomp';
import Sidenav from "../../Home Page3/Sidenav2";
import Navbar from "../../Home Page3/Navbar2";
const LeaveBalances2 = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [employeeLeaveData, setEmployeeLeaveData] = useState([]);
  const navigate = useNavigate();
  const dbname = sessionStorage.getItem("databaseName");

  // const fetchLeaveData = async () => {
  //   try {
  //     const query = `
  //       SELECT 
  //           paym_EncashmentDetails.pn_EmployeeId,
  //           paym_Employee.Employee_Full_Name, 
  //           paym_EncashmentDetails.Pn_LeaveId,
  //           leave_apply.pn_Leavename,
  //           paym_EncashmentDetails.Allow_Days,
  //           paym_EncashmentDetails.Taken_Days,
  //           paym_EncashmentDetails.Bal_Days
  //       FROM 
  //           paym_EncashmentDetails 
  //       JOIN 
  //           paym_Employee 
  //       ON 
  //           paym_Employee.pn_EmployeeID = paym_EncashmentDetails.pn_EmployeeId 
  //       JOIN
  //           leave_apply
  //       ON
  //           paym_EncashmentDetails.Pn_LeaveId = leave_apply.pn_LeaveID;
  //     `;
      
  //     const response = await postRequest(ServerConfig.url, REPORTS, { query });

  //     if (response.status === 200) {
  //       // Assuming the response data contains the rows
  //       const data = response.data || [];
        
  //       // Process leave data if needed
  //       const leaveData = data.map(row => ({
  //         type: row.pn_Leavename,
  //         granted: row.Allow_Days,
  //         balance: row.Bal_Days
  //       }));

  //       setLeaveData(leaveData);
  //       setEmployeeLeaveData(data);
  //     } else {
  //       console.error`(Unexpected response status: ${response.status})`;
  //     }
  //   } catch (error) {
  //     console.error('Error fetching leave data:', error);
  //   }
  // };

  const fetchLeaveData = async () => {
  try {
    const dbname = sessionStorage.getItem("databaseName");

    const query = `
      SELECT 
          E.pn_EmployeeId,
          EMP.Employee_Full_Name, 
          E.Pn_LeaveId,
          L.pn_Leavename,
          E.Allow_Days,
          E.Taken_Days,
          E.Bal_Days
      FROM 
          [${dbname}].[dbo].[paym_EncashmentDetails] E
      JOIN 
          [${dbname}].[dbo].[paym_Employee] EMP
          ON EMP.pn_EmployeeID = E.pn_EmployeeId 
      JOIN
          [${dbname}].[dbo].[leave_apply] L
          ON E.Pn_LeaveId = L.pn_LeaveID;
    `;

    const response = await postRequest(ServerConfig.url, REPORTS, {
      query,
      dbname: dbname
    });

    if (response.status === 200) {
      const data = response.data || [];

      const leaveData = data.map(row => ({
        type: row.pn_Leavename,
        granted: row.Allow_Days,
        balance: row.Bal_Days
      }));

      setLeaveData(leaveData);
      setEmployeeLeaveData(data);
    } else {
      console.error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error fetching leave data:', error);
  }
};

  useEffect(() => {
    fetchLeaveData();
  }, []);

  const handleApplyClick = () => {
    navigate('/LeaveBalanceForm');
  };

  return (
    <Grid container>
    {/* Navbar and Sidebar */}
    <Grid item xs={12}>
      <div style={{ backgroundColor: "#f5f5f5" }}>
        <Navbar />
        <Box height={30} />
        <Box sx={{ display: "flex" }}>
          <Sidenav />
          {/* Main Content */}
         <Grid
                  item
                  xs={12}
                  sm={10}
                  md={9}
                  lg={8}
                  xl={7}
                 style={{ margin: "0 auto", padding: "20px" }}  
                  >        
    <div style={{ padding: '20px' }}>
     <AppBar position="sticky" color="default" elevation={2} sx={{ backgroundColor: '#0077d4',color: 'white', marginTop:"35px" }}>
          <Toolbar sx={{ justifyContent: 'center' }}>
            <Typography
              variant="h5"
              component="div"
              sx={{ fontWeight: 'bold', textAlign: 'left', flexGrow: 1 }}
            >
              LEAVE BALANCES
            </Typography>
           
          </Toolbar>
        </AppBar>
    

      <Grid container mt={0} ml={-2}>
        {leaveData.map((leave, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
         
              <CardContent>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="subtitle1" style={{ textAlign: 'left' }}>
                    {leave.type}
                  </Typography>
                  <Typography variant="subtitle1" color="white" style={{ textAlign: 'right' }}>
                    Granted: {leave.granted}
                  </Typography>
                </Box>
                <Typography variant="h4" mt={5}>{leave.balance}</Typography>
                <Typography variant="body2" color="white">
                  Balance
                </Typography>
              </CardContent>
          
          </Grid>
        ))}
      </Grid>

      <TableContainer component={Paper} elevation={3} >
        <Table>
          <TableHead>
            <TableRow 
              sx={{
            background:"white",
             
            backdropFilter: 'blur(8px)',
          }}>
              <TableCell>EMPLOYEE ID</TableCell>
              <TableCell>EMPLOYEE NAME</TableCell>
              <TableCell>LEAVE ID</TableCell>
              <TableCell>LEAVE NAME</TableCell>
              <TableCell>ALLOW DAYS</TableCell>
              <TableCell>TAKEN DAYS</TableCell>
              <TableCell>BALANCE DAYS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employeeLeaveData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.pn_EmployeeId}</TableCell>
                <TableCell>{row.Employee_Full_Name}</TableCell>
                <TableCell>{row.Pn_LeaveId}</TableCell>
                <TableCell>{row.pn_Leavename}</TableCell>
                <TableCell>{row.Allow_Days}</TableCell>
                <TableCell>{row.Taken_Days}</TableCell>
                <TableCell>{row.Bal_Days}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
      <div style={{ display: 'flex',marginTop:"30px" ,justifyContent: 'flex-end' }}>
        <Button variant="contained" color="primary" onClick={handleApplyClick} style={{ fontWeight: 'bold', marginRight: '50px', width: '190px', height: '40px', marginTop: '-20px' }}>
          Leave Balance Form
        </Button>
      </div>
    </Grid>
    </Box>
    </div>
    </Grid>
    </Grid>
  );
};

export default LeaveBalances2;
