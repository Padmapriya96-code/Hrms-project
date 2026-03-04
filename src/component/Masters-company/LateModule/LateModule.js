import React, { useState, useEffect, useRef } from 'react';
import { Radio, RadioGroup, FormControl, FormControlLabel, TextField, Typography, Checkbox, MenuItem, Grid, ListItemText, Select, IconButton, Menu, ListItem } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { postRequest } from '../../../serverconfiguration/requestcomp';
import { ServerConfig } from '../../../serverconfiguration/serverconfig';
import { REPORTS } from '../../../serverconfiguration/controllers';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import InputAdornment from '@mui/material/InputAdornment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {Button} from '@mui/material';

const LateProvision = () => {
  const [selection, setSelection] = useState('');
  const [minuteCount, setMinuteCount] = useState('');
  const [timeRows, setTimeRows] = useState([{ id: 1, fromDuration: '', toDuration: '', lateDeduction: '' }]);
  const [minuteRows, setMinuteRows] = useState([{ id: 1, fromMinutes: '', toMinutes: '', count: '', lateDeduction: '' }]);
  const [company, setCompany] = useState([]);
  const [branch, setBranch] = useState([]);
  const [pnCompanyId, setPnCompanyId] = useState('');
  const [isloggedin, setIsloggedin] = useState(sessionStorage.getItem('user'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBranchIds, setSelectedBranchIds] = useState([]);

  const ToDeductionEditor = React.memo((params) => {
    const { value, api, colDef, node, onValueChange } = params;
    const [textValue, setTextValue] = useState(value || "");
    const [dropdownValue, setDropdownValue] = useState("");

    const inputRef = useRef(null);

    useEffect(() => {
      inputRef.current.focus();
    }, []);

    useEffect(() => {
      setTextValue(value || "");
    }, [value]);

    const handleTextChange = (event) => {
      const newValue = event.target.value;
      setTextValue(newValue);
      setDropdownValue(""); 
      onValueChange(newValue); 
    };

    const handleDropdownChange = (event) => {
      const selectedValue = event.target.value;
      setTextValue(selectedValue); 
      setDropdownValue(""); 
      onValueChange(selectedValue); 
    };

    const getValue = () => {
      return textValue;
    };

    const isPopup = () => {
      return false;
    };

    return (
      <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
        <TextField
          value={textValue}
          onChange={handleTextChange}
          variant="standard"
          size="small"
          style={{ flex: 1, marginRight: 8 }}
          inputRef={inputRef}
          InputProps={{ disableUnderline: true }}
        />
        <Select
          variant="standard"
          value={dropdownValue}
          onChange={handleDropdownChange}
          size="small"
          style={{ width: 30, height: 30 }}
          disableUnderline
        >
          <MenuItem value="Upwards">Upwards</MenuItem>
        </Select>
      </div>
    );
  });

  const TimePickerCell = ({ value, onChange, disabled }) => {
    const [internalValue, setInternalValue] = useState(value || null);

    const handleChange = (newValue) => {
      setInternalValue(newValue);
      onChange(newValue); 
    };

    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <TimePicker
          value={internalValue}
          onChange={handleChange}
          renderInput={(params) => <TextField {...params} variant="standard" />}
          ampm={false}
          views={['hours', 'minutes']}
          timeSteps={{minutes: 1}}
          inputFormat="HH:mm"
          mask="__:__"
          sx={{ width: '100%' }}
          disabled={disabled}
        />
      </LocalizationProvider>
    );
  };

  const handleValueChange = (newValue, params) => {
    const { data, colDef, node } = params;
    const field = colDef.field;
    const newData = { ...data, [field]: newValue };
    node.setData(newData);
  };

  const handleCellValueChanged = (event) => {
    const updatedData = timeRows.map((row) =>
      row === event.data ? { ...row, [event.colDef.field]: event.newValue } : row
    );
    setTimeRows(updatedData);
  };

  const timeColumns = [
    {
      headerName: 'From',
      field: 'fromDuration',
      flex: 1,
      minWidth: 150,
      editable: false,
      cellRenderer: (params) => (
        <TimePickerCell
          value={params.value}
          onChange={(newValue) => handleRowUpdate(params.data.id, 'fromDuration', newValue)}
          disabled={false} 
        />
      ),
      headerAlign: 'center',
      align: 'center',
    },
    {
      headerName: 'To',
      field: 'toDuration',
      flex: 1,
      minWidth: 150,
      editable: false,
      cellRenderer: (params) => (
        <TimePickerCell
          value={params.value}
          onChange={(newValue) => handleRowUpdate(params.data.id, 'toDuration', newValue)}
          disabled={false} 
        />
      ),
      headerAlign: 'center',
      align: 'center',
    },
    {
      headerName: 'Deduction',
      field: 'lateDeduction',
      editable: true,
      cellEditor: ToDeductionEditor,
      cellEditorParams: {
        onValueChange: (newValue, params) => handleValueChange(newValue, params),
      },
    },
  ];

  const minuteCountColumns = [
    {
      headerName: 'From',
      field: 'fromMinutes',
      flex: 1,
      minWidth: 150,
      editable: false,
      cellRenderer: (params) => (
        <TimePickerCell
          value={params.value}
          onChange={(newValue) => handleMinuteRowUpdate(params.data.id, 'fromMinutes', newValue)}
          disabled={false} 
        />
      ),
      headerAlign: 'center',
      align: 'center',
    },
    {
      headerName: 'To',
      field: 'toMinutes',
      flex: 1,
      minWidth: 150,
      editable: false,
      cellRenderer: (params) => (
        <TimePickerCell
          value={params.value}
          onChange={(newValue) => handleMinuteRowUpdate(params.data.id, 'toMinutes', newValue)}
          disabled={false} 
        />
      ),
      headerAlign: 'center',
      align: 'center',
    },
    {
      headerName: 'Deduction',
      field: 'lateDeduction',
      editable: true,
      cellEditor: ToDeductionEditor,
      cellEditorParams: {
        onValueChange: (newValue, params) => handleValueChange(newValue, params),
      },
    },
    { headerName: 'Count', field: 'count', editable: true },
  ];

  useEffect(() => {
    async function getData() {
      try {
        const companyData = await postRequest(ServerConfig.url, REPORTS, {
          query: `SELECT * FROM paym_Company WHERE company_user_id = '${isloggedin}'`
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
            query: `SELECT * FROM paym_branch WHERE pn_CompanyID = '${pnCompanyId}'`
          });
          setBranch(branchData.data);
        }
      } catch (error) {
        console.error('Error fetching branch data:', error);
      }
    }
    getData();
  }, [pnCompanyId]);



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
      setSelectedBranchIds(branch.map((b) => b.pn_BranchID));
    }
  };

  const handleSelectionChange = (event) => {
    setSelection(event.target.value);
  };

  const handleRowUpdate = (id, field, value) => {
    const updatedRows = timeRows.map((row) =>
      row.id === id ? { ...row, [field]: value } : row
    );
    setTimeRows(updatedRows);
  };

  const handleMinuteRowUpdate = (id, field, value) => {
    const updatedRows = minuteRows.map((row) =>
      row.id === id ? { ...row, [field]: value } : row
    );
    setMinuteRows(updatedRows);
  };

  const handleAddTimeRow = () => {
    const newRow = { id: timeRows.length + 1, fromDuration: '', toDuration: '', lateDeduction: '' };
    setTimeRows([...timeRows, newRow]);
  };

  const handleAddMinuteRow = () => {
    const newRow = { id: minuteRows.length + 1, fromMinutes: '', toMinutes: '', count: '', lateDeduction: '' };
    setMinuteRows([...minuteRows, newRow]);
  };

  const formatTime = (date) => {
    if (!date) return null;
    return date.toTimeString().split(' ')[0]; // This will give you HH:MM:SS
  };
  
  const handleSaveTimeRows = async () => {
    const dataToSave = timeRows.map(row => ({
      pn_CompanyID: pnCompanyId,
      pn_BranchID: selectedBranchIds,
       // Assuming you want to save for all selected branches
      from_minutes: formatTime(row.fromDuration),
      to_minutes: formatTime(row.toDuration),
      deduction: row.lateDeduction || 'Null', // Handle null values appropriately
    }));
  
    try {
      const response = await postRequest(ServerConfig.url, REPORTS, {
        query: `INSERT INTO late_deduction_time (pn_CompanyID, pn_BranchID, from_minutes, to_minutes, deduction) VALUES ${dataToSave.map(row => `(${row.pn_CompanyID}, ${row.pn_BranchID}, '${row.from_minutes}', '${row.to_minutes}', '${row.deduction}')`).join(', ')}`
      });
      console.log('Time rows saved:', response);
    } catch (error) {
      console.error('Error saving time rows:', error);
    }
  };
  
  const handleSaveMinuteRows = async () => {
    const dataToSave = minuteRows.map(row => ({
      pn_CompanyID: pnCompanyId,
      pn_BranchID: selectedBranchIds,
      minutes_per_count :minuteCount,// Assuming you want to save for all selected branches
      from_minutes: formatTime(row.fromMinutes),
      to_minutes: formatTime(row.toMinutes),
      count: row.count,
      deduction: row.lateDeduction || 'Null', // Handle null values appropriately
    }));
  
    try {
      const response = await postRequest(ServerConfig.url, REPORTS, {
        query: `INSERT INTO late_deduction_minutes (pn_CompanyID, pn_BranchID,minutes_per_count, from_minutes, to_minutes, count, deduction) VALUES ${dataToSave.map(row => `(${row.pn_CompanyID}, ${row.pn_BranchID},null, '${row.from_minutes}', '${row.to_minutes}', ${row.count}, '${row.deduction}')`).join(', ')}`
      });
      console.log('Minute rows saved:', response);
    } catch (error) {
      console.error('Error saving minute rows:', error);
    }
  };

 
  
 

  return (
    <div style={{ padding: '16px', textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>
        Late Provision
      </Typography>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <TextField
              value={company.find((c) => c.pn_CompanyID === pnCompanyId)?.CompanyName || ''}
              variant="outlined"
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <TextField
              value={
                branch.length > 0
                  ? branch.filter((b) => selectedBranchIds.includes(b.pn_BranchID)).map((b) => b.BranchName).join(', ')
                  : 'No branches'
              }
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
                  sx={{ ml: 'auto' }} 
                />
              </ListItem>
              {branch.map((b) => (
                <MenuItem
                  key={b.pn_BranchID}
                  onClick={() => handleBranchChange(b.pn_BranchID)}
                  sx={{ display: 'flex', justifyContent: 'space-between', width: '280px', alignItems: 'center' }}
                >
                  <ListItemText primary={b.BranchName} />
                  <Checkbox checked={selectedBranchIds.includes(b.pn_BranchID)} sx={{ ml: 'auto' }} />
                </MenuItem>
              ))}
            </Menu>
          </FormControl>
        </Grid>
      </Grid>
      <FormControl>
        <RadioGroup row value={selection} onChange={handleSelectionChange}>
          <FormControlLabel value="time" control={<Radio />} label="Choose Time" />
          <FormControlLabel value="minuteCount" control={<Radio />} label="Choose Minute Count" />
        </RadioGroup>
      </FormControl>

      {selection === 'time' && (
  <div style={{ marginTop: '16px', textAlign: 'center' }}>
    <Typography variant="h6" gutterBottom>
      Time-based Late Deduction
    </Typography>
    <div className="ag-theme-alpine" style={{ height: 300, width: '700px', margin: 'auto' }}>
      <AgGridReact
        rowData={timeRows}
        columnDefs={timeColumns}
        domLayout="autoHeight"
        frameworkComponents={{ ToDeductionEditor }}
        defaultColDef={{
          editable: true,
        }}
        onCellValueChanged={handleCellValueChanged}
      />
    </div>
    <Button variant="contained" size='small' color="primary" sx={{ mt: 2, mx: 1 }} onClick={handleAddTimeRow}>
      Add Row
    </Button>
    <Button variant="contained" size='small' color="primary" sx={{ mt: 2, mx: 1 }} onClick={handleSaveTimeRows}>
      Save
    </Button>
  </div>
)}

{selection === 'minuteCount' && (
  <div style={{ marginTop: '16px', textAlign: 'center' }}>
    
    <Typography variant="h6" gutterBottom>
      Minute Count-based Late Deduction
    </Typography>
    <div className="ag-theme-alpine" style={{ height: 300, width: '900px', margin: 'auto' }}>
      <AgGridReact
        rowData={minuteRows}
        columnDefs={minuteCountColumns}
        domLayout="autoHeight"
        frameworkComponents={{ ToDeductionEditor }}
        defaultColDef={{
          editable: true,
        }}
        onCellValueChanged={handleCellValueChanged}
      />
    </div>
    <Button variant="contained" size='small' color="primary" sx={{ mt: 2, mx: 1 }} onClick={handleAddMinuteRow}>
      Add Row
    </Button>
    <Button variant="contained" size='small' color="primary" sx={{ mt: 2, mx: 1 }} onClick={handleSaveMinuteRows}>
      Save
    </Button>
  </div>
)}
    </div>
  );
};

export default LateProvision;