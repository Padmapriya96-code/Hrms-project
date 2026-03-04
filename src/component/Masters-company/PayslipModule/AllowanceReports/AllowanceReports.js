import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Typography,
  Box,
  Button,
} from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

function PayslipReport() {
  const [grade, setGrade] = useState('');
  const [allowance, setAllowance] = useState('');
  const [value, setValue] = useState('');
  const [issueDate, setIssueDate] = useState('');  // Add state for issue date
  const navigate = useNavigate();

  const grades = ['Grade A', 'Grade B', 'Grade C'];
  const allowances = ['diwali', 'pongal'];

  const rowData = [
    { employeeId: 'E001', employeeName: 'John Doe' },
    { employeeId: 'E002', employeeName: 'Jane Smith' },
    { employeeId: 'E003', employeeName: 'Alice Johnson' },
  ];

  const handleSaveAndGenerateReport = () => {
    if (!grade || !allowance || !value || !issueDate) {  // Check if issueDate is empty
      alert('Please fill in all fields before generating the report.');
      return;
    }

    const companyId = sessionStorage.getItem('companyId') || 'Unknown Company';
    const branchId = sessionStorage.getItem('branchId') || 'Unknown Branch';

    const formattedValue = parseFloat(value).toFixed(2);

    const newReportData = rowData.map((employee) => ({
      companyId,
      branchId,
      employeeId: employee.employeeId,
      employeeName: employee.employeeName,
      gradeName: grade,
      allowanceName: allowance,
      value: parseFloat(formattedValue),
      issueDate: issueDate,  // Add issueDate to report data
    }));

    // Navigate to the Report Page with report data
    navigate('/report', { state: { reportData: newReportData } });
  };

  return (
    <Box sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h5" gutterBottom>
        Payslip Report
      </Typography>
      <Grid container spacing={3} sx={{ maxWidth: 800 }}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Choose Grade</InputLabel>
            <Select value={grade} onChange={(e) => setGrade(e.target.value)} label="Choose Grade">
              {grades.map((gradeOption, index) => (
                <MenuItem key={index} value={gradeOption}>
                  {gradeOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Allowance Name</InputLabel>
            <Select value={allowance} onChange={(e) => setAllowance(e.target.value)} label="Allowance Name">
              {allowances.map((allowanceOption, index) => (
                <MenuItem key={index} value={allowanceOption}>
                  {allowanceOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            variant="outlined"
            fullWidth
            type="number"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Issue Date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}  // Handle change of issue date
            variant="outlined"
            fullWidth
            type="date"  // Date picker format
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
      </Grid>
      <Box sx={{ marginTop: 4, height: 400, width: '100%', maxWidth: 800 }} className="ag-theme-alpine">
        <AgGridReact
          rowData={rowData}
          columnDefs={[
            { headerName: 'Employee ID', field: 'employeeId', sortable: true, filter: true, cellStyle: { textAlign: 'left' } },
            { headerName: 'Employee Name', field: 'employeeName', sortable: true, filter: true, cellStyle: { textAlign: 'left' } },
          ]}
          domLayout="normal"
          defaultColDef={{
            flex: 1,
            minWidth: 100,
          }}
        />
      </Box>
      <Box sx={{ marginTop: 3 }}>
        <Button variant="contained" color="primary" onClick={handleSaveAndGenerateReport}>
          Save & Generate Report
        </Button>
      </Box>
    </Box>
  );
}

export default PayslipReport;
