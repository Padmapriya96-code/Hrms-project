import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Switch, IconButton, Button ,Grid,Card,CardContent,Typography} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import styled from 'styled-components'; // Import styled-components as styled
import { styled as muiStyled } from '@mui/material/styles'; // Alias MUI styled to muiStyled
import { ServerConfig } from '../../../../serverconfiguration/serverconfig';
import { postRequest } from '../../../../serverconfiguration/requestcomp';
import { REPORTS, SAVE } from '../../../../serverconfiguration/controllers';
import { FormControlLabel } from '@mui/material'; 
import './Gridstyle.css'
import { toast } from 'react-toastify';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import Sidenav from "../../../Home Page-comapny/Sidenav1";
import Navbar from "../../../Home Page-comapny/Navbar1";
// ... existing styled components and other imports ...

const Container = styled.div`
  width: 90%;
  max-width: 1000px;
  margin: auto;
  background: #ffffff;
  
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.15);
`;

const Header = styled.h3`
  text-align: center;
  color: #007acc;
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 24px;
`;

const SettingsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height:50px;
  border: 1px solid #ccc; // Border styling
 
`;

const FieldContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: 500;
  color: #333;
`;

const Select = styled.select`
  width: 100%;
  max-width: 300px;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 16px;
`;

const PreferenceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #555;
  font-size: 16px;
  font-weight: 500;
`;

const CheckboxContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  background: #f1f1f1;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
`;


const CheckboxLabel = styled.label`
  font-size: 15px;
  color: #555;
  display: flex;
  align-items: center;
  gap: 8px
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; /* Center the content horizontally */
  gap: 20px; /* Add spacing between the grid and the button */
  height: 100%; /* Ensure the container takes up available space */
`;

const GridContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  
  .ag-theme-alpine {
    width: 90%;
    max-width: 1000px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%; /* Ensure the button container spans full width */
  margin-top: 10px; /* Add spacing above the button */
`;


const Android12Switch = muiStyled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
    },
    '&::before': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    '&::after': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
  },
}));

const AllowanceSettings = () => {
  const [rowData, setRowData] = useState([]);
  const [company, setCompany] = useState([]);
  const [Branch, setBranch] = useState([]);
  const [Branchid, setBranchid] = useState("");
  const [Allowancedata, setAllowancedata] = useState([]);
  const [deductiondata, setdeductiondata] = useState([]);
  const [showDeductions, setShowDeductions] = useState(false);
  const [deductionPreferences, setDeductionPreferences] = useState({});
  const databaseName = sessionStorage.getItem("databaseName");

  const [isSaving, setIsSaving] = useState(false);

  const SwitchRenderer = (props) => {
    const { data, colDef, value } = props;
  
    const handleChange = (event) => {
      const newChecked = event.target.checked;
      // Update the grid cell value
      props.setValue(newChecked ? 'Yes' : 'No');
  
      // Call the function passed from the parent to update rowData
      if (props.onToggle) {
        props.onToggle(data, colDef.field, newChecked);
      }
    };
  
    return (
      <FormControlLabel
        control={<Android12Switch />}
        checked={value === 'Yes'} // Ensure this reflects the correct state
        onChange={handleChange}
        color="primary"
        size="small"
      />
    );
  };
  
  

  const onSwitchToggle = (row, field, value) => {
    console.log(`Toggling ${field} for ${row.allowanceName} to ${value ? 'Yes' : 'No'}`);
    
    setAllowancedata((prevAllowancedata) =>
      prevAllowancedata.map((r) =>
        r.allowanceName === row.allowanceName ? { ...r, [field]: value ? 'Yes' : 'No' } : r
      )
    );
  
    setRowData((prevRowData) =>
      prevRowData.map((r) =>
        r.allowanceName === row.allowanceName ? { ...r, [field]: value ? 'Yes' : 'No' } : r
      )
    );
  };
  

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: 'ALLOWANCE NAME',
      field: 'allowanceName',
      resizable: true,
      headerClass: 'wrap-header',
      width: 333,
    },
    {
      headerName: 'ALLOWANCE COMPUTED FOR PRORATABASIS ',
      field: 'allowanceComputed',
      cellRenderer: (props) => (
        <SwitchRenderer {...props} onToggle={onSwitchToggle} />
      ),
      resizable: true,
      headerClass: 'wrap-header',
      width: 333,
    },
    {
      headerName: 'INCLUDE FOR OT CALCULATION',
      field: 'otCalc',
      cellRenderer: (props) => (
        <SwitchRenderer {...props} onToggle={onSwitchToggle} />
      ),
      resizable: true,
      headerClass: 'wrap-header',
      width: 333,
    },
  ]);
  

 

  useEffect(() => {
    async function getData() {
      try {
        const Company = await postRequest(ServerConfig.url, REPORTS, {
          query: `SELECT * FROM [${databaseName}].[dbo].[paym_Company]
                  WHERE Company_User_Id = '${sessionStorage.getItem("user")}'`,
        });
        setCompany(Company.data);
  
        if (Company.data && Company.data.length > 0) {
          const Branchdata = await postRequest(ServerConfig.url, REPORTS, {
            query: `SELECT * FROM [${databaseName}].[dbo].[paym_Branch]
                    WHERE pn_CompanyID = ${Company.data[0].pn_CompanyID}`,
          });
          setBranch(Branchdata.data);
  
          const allowancedata = await postRequest(ServerConfig.url, REPORTS, {
            query: `SELECT * FROM [${databaseName}].[dbo].[AllowanceMaster]
                    WHERE pn_CompanyID = ${Company.data[0].pn_CompanyID}
                    AND pn_BranchID = ${Branchid || 0}`,
          });
          
          // Sort the data based on the `d_order` column
          const sortedAllowanceData = allowancedata.data.sort((a, b) => a.d_order - b.d_order);
          setAllowancedata(sortedAllowanceData);
  
          const deductiondata = await postRequest(ServerConfig.url, REPORTS, {
           query: `SELECT * FROM [${databaseName}].[dbo].[DeductionMaster]
                    WHERE pn_CompanyID = ${Company.data[0].pn_CompanyID}
                    AND pn_BranchID = ${Branchid || 0}`,
          });
          setdeductiondata(deductiondata.data);
  
          // Extract deductions for this branch
          const branchSpecificDeductions = deductiondata.data.map(
            (deduction) => deduction.v_DeductionName
          );
  
          const schemaData = await postRequest(ServerConfig.url, REPORTS, {
           query: `SELECT COLUMN_NAME 
        FROM [${databaseName}].INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'Allowancesettings'`,

          });
  
          const savedSettings = await postRequest(ServerConfig.url, REPORTS, {
            query: `SELECT * FROM [${databaseName}].[dbo].[Allowancesettings]
                    WHERE pn_CompanyID = ${Company.data[0].pn_CompanyID}
                    AND pn_BranchID = ${Branchid || 0}`,
          });
  
          // Extract deduction-related columns dynamically
          const deductionColumns = schemaData.data
            .map((col) => col.COLUMN_NAME)
            .filter(
              (col) =>
                ![
                  "pn_CompanyID",
                  "pn_BranchID",
                  "v_EarningsName",
                  "c_OT",
                  "Prorata_basis",
                  "d_order",
                ].includes(col)
            )
            .map((col) => ({
              columnName: col,
              isEnabled: branchSpecificDeductions.includes(
                col.replace(/_/g, " ")
              ), // Enable only if deduction exists in the branch
            }));
  
          // Initialize deduction preferences
          const updatedPreferences = deductionColumns.reduce((acc, col) => {
            const deductionName = col.columnName.replace(/_/g, " ");
            return { ...acc, [deductionName]: col.isEnabled };
          }, {});
          setDeductionPreferences(updatedPreferences);
  
          // Update column definitions
          const newColumnDefs = [
            { headerName: "ALLOWANCE NAME ", field: "allowanceName",cellStyle: { textAlign: "left" }, resizable: true },
            {
              headerName: "ALLOWANCE COMPUTED FOR PRORATABASIS ",
              field: "allowanceComputed",
              cellStyle: { textAlign: "left" },
              cellRenderer: SwitchRenderer,
              resizable: true,
            },
            {
              headerName: "INCLUDE FOR OT CALCULATION",
              field: "otCalc",
              cellStyle: { textAlign: "left" },
              cellRenderer: SwitchRenderer,
              resizable: true,
            },
            ...deductionColumns.map((col) => ({
              headerName: col.columnName.replace(/_/g, " "),
              field: col.columnName,
              cellRenderer: SwitchRenderer,
              resizable: true,
              editable: col.isEnabled,
              cellStyle: () => ({
                backgroundColor: col.isEnabled ? "white" : "#f0f0f0",
                pointerEvents: col.isEnabled ? "auto" : "none",
              }),
            })),
          ];
          setColumnDefs(newColumnDefs);
  
          // Format rowData to include deductions
          const formattedData = sortedAllowanceData.map((item) => {
            const savedSetting =
              savedSettings.data.find(
                (setting) => setting.v_EarningsName === item.v_EarningsName
              ) || {};
            const deductions = deductionColumns.reduce(
              (acc, col) => ({
                ...acc,
                [col.columnName]: savedSetting[col.columnName] === "Y" ? "Yes" : "No",
              }),
              {}
            );
          
            return {
              allowanceName: item.v_EarningsName,
              allowanceComputed: savedSetting.Prorata_basis === "Y" ? "Yes" : "No",
              otCalc: savedSetting.c_OT === "Y" ? "Yes" : "No",
              ...deductions,
            };
          });
          setRowData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    getData();
  }, [Branchid]);
  


 const handleSave = async () => {
  if (isSaving) return;
  setIsSaving(true);

  try {
    toast.dismiss();

    // 1. Validate we have data to save
    if (rowData.length === 0) {
      toast.error("No allowance data to save", {position: "top-center"});
      return;
    }

    // 2. Get existing settings from database
    const existingSettings = await postRequest(ServerConfig.url, REPORTS, {
      query: `SELECT * FROM [${databaseName}].[dbo].[Allowancesettings] 
              WHERE pn_CompanyID = ${company[0].pn_CompanyID} 
              AND pn_BranchID = ${Branchid}`
    });
    
    const existingRecords = existingSettings.data || [];

    // 3. Compare and build queries
    let actualChanges = 0;
    const queries = [];
    const seenAllowances = new Set();

    for (const [index, row] of rowData.entries()) {
      // Skip duplicates in current batch
      if (seenAllowances.has(row.allowanceName)) continue;
      seenAllowances.add(row.allowanceName);

      const existingRow = existingRecords.find(item => 
        item.v_EarningsName === row.allowanceName
      );

      // Prepare current values
      const currentValues = {
        c_OT: row.otCalc === "Yes" ? "Y" : "N",
        Prorata_basis: row.allowanceComputed === "Yes" ? "Y" : "N",
        d_order: index + 1,
        // Include all deduction preferences
        ...Object.keys(deductionPreferences).reduce((acc, deductionName) => {
          const columnName = deductionName.replace(/\s+/g, '_');
          acc[columnName] = row[columnName] === "Yes" ? "Y" : "N";
          return acc;
        }, {})
      };

      if (existingRow) {
        // Check if ANY field has changed
        const isChanged = Object.keys(currentValues).some(key => {
          // Special handling for NULL values
          if (currentValues[key] === null) {
            return existingRow[key] !== null;
          }
          return existingRow[key] != currentValues[key]; // != for type coercion
        });

        if (!isChanged) continue; // Skip unchanged records

        actualChanges++;
        
        // Build SET clause for update
        const setClause = Object.entries(currentValues)
          .map(([key, value]) => 
            `${key} = ${value !== null ? `'${value}'` : 'NULL'}`
          )
          .join(", ");

        queries.push(`UPDATE [${databaseName}].[dbo].[Allowancesettings] SET
          ${setClause}
          WHERE pn_CompanyID = ${company[0].pn_CompanyID} 
            AND pn_BranchID = ${Branchid}
            AND v_EarningsName = '${row.allowanceName.replace(/'/g, "''")}'
        `);
      } else {
        // New record (always considered a change)
        actualChanges++;
        
        // Prepare columns and values for insert
        const columns = [
          'pn_CompanyID', 'pn_BranchID', 'v_EarningsName', 
          'c_OT', 'Prorata_basis', 'd_order',
          ...Object.keys(deductionPreferences)
            .filter(d => deductionPreferences[d])
            .map(d => d.replace(/\s+/g, '_'))
        ];
        
        const values = [
          company[0].pn_CompanyID,
          Branchid,
          `'${row.allowanceName.replace(/'/g, "''")}'`,
          `'${currentValues.c_OT}'`,
          `'${currentValues.Prorata_basis}'`,
          currentValues.d_order,
          ...Object.keys(deductionPreferences)
            .filter(d => deductionPreferences[d])
            .map(d => {
              const columnName = d.replace(/\s+/g, '_');
              return `'${currentValues[columnName]}'`;
            })
        ];

        queries.push(`INSERT INTO [${databaseName}].[dbo].[Allowancesettings] (
          ${columns.join(', ')}
        ) VALUES (
          ${values.join(', ')}
        )`);
      }
    }

    // 4. Handle results
    if (actualChanges === 0) {
      toast.error("Data already exists.", {
        position: "top-center",
        autoClose: 2000
      });
      return;
    }

    // Only save if there are actual changes
    if (queries.length > 0) {
      await postRequest(ServerConfig.url, SAVE, { "query": queries.join("\n") });
      toast.info(`Data saved successfully!`, {
        position: "top-center",
        autoClose: 2000
      });
      
      // Refresh data after save
      const updatedSettings = await postRequest(ServerConfig.url, REPORTS, {
        query: `SELECT * FROM [${databaseName}].[dbo].[Allowancesettings] 
                WHERE pn_CompanyID = ${company[0].pn_CompanyID} 
                AND pn_BranchID = ${Branchid}`
      });
      
      // Update rowData with fresh data from database
      const updatedRowData = rowData.map(row => {
        const dbRow = updatedSettings.data.find(
          item => item.v_EarningsName === row.allowanceName
        ) || {};
        return {
          ...row,
          allowanceComputed: dbRow.Prorata_basis === 'Y' ? 'Yes' : 'No',
          otCalc: dbRow.c_OT === 'Y' ? 'Yes' : 'No',
          ...Object.keys(deductionPreferences).reduce((acc, deductionName) => {
            const columnName = deductionName.replace(/\s+/g, '_');
            acc[columnName] = dbRow[columnName] === 'Y' ? 'Yes' : 'No';
            return acc;
          }, {})
        };
      });
      
      setRowData(updatedRowData);
    }

  } catch (error) {
    console.error("Save failed:", error);
    toast.error("Failed to save settings. Please try again.", {
      position: "top-center",
      autoClose: 2000
    });
  } finally {
    setIsSaving(false);
  }
};


  
  
  const toggleDeduction = async (deduction) => {
    const deductionName = deduction.v_DeductionName;
    const columnName = deductionName.replace(/\s+/g, '_'); // Ensure column name is DB-safe
  
    try {
      if (!deductionPreferences[deductionName]) {
        // Add column in the database
        await postRequest(ServerConfig.url, REPORTS, {
          query: `
            ALTER TABLE [${databaseName}].[dbo].[Allowancesettings] ADD  ${columnName} CHAR(1) null
          `,
        });
  
        // Update rowData with the new column set to 'N'
        setRowData((prev) =>
          prev.map((row) => ({
            ...row,
            [columnName]: 'N',
          }))
        );
      } else {
        // Remove column from the database
        await postRequest(ServerConfig.url, REPORTS, {
          query: `
            ALTER TABLE [${databaseName}].[dbo].[Allowancesettings] DROP COLUMN ${columnName}
          `,
        });
  
        // Remove column from rowData
        setRowData((prev) =>
          prev.map((row) => {
            const { [columnName]: _, ...rest } = row;
            return rest;
          })
        );
      }
  
      // Update deduction preferences state
      setDeductionPreferences((prev) => ({
        ...prev,
        [deductionName]: !prev[deductionName],
      }));
  
      // Update column definitions
      updateColumnDefs({
        ...deductionPreferences,
        [deductionName]: !deductionPreferences[deductionName],
      });
    } catch (error) {
      console.error(`Error updating column for ${deductionName}:`, error);
      alert(`Failed to update column for ${deductionName}.`);
    }
  };
  

  const updateColumnDefs = (updatedPreferences) => {
    const selectedDeductions = deductiondata.filter((d) => updatedPreferences[d.v_DeductionName]);
  
    const newColumnDefs = [
      { headerName: 'Allowance Name', field: 'allowanceName', resizable: true },
      { headerName: 'Allowance Computed for proratabasis', field: 'allowanceComputed', cellRenderer: SwitchRenderer, resizable: true },
      { headerName: 'Include for OT Calc.', field: 'otCalc', cellRenderer: SwitchRenderer, resizable: true },
      ...selectedDeductions.map((deduction) => ({
        headerName: deduction.v_DeductionName,
        field: deduction.v_DeductionName.replace(/\s+/g, '_'),
        cellRenderer: SwitchRenderer,
        resizable: true,
      })),
    ];
  
    setColumnDefs(newColumnDefs);
  
    // Ensure rowData includes the new fields with default values
    const updatedRowData = rowData.map((row) => ({
      ...row,
      ...selectedDeductions.reduce((acc, d) => {
        const columnName = d.v_DeductionName.replace(/\s+/g, '_');
        return { ...acc, [columnName]: row[columnName] || 'N' };
      }, {}),
    }));
  
    setRowData(updatedRowData);
  };

 return (
   <Grid container style={{ backgroundColor: '#f5f5f5' }}>
      <Grid item xs={12}>
        <Navbar />
      </Grid>
      <Grid item xs={12} sx={{ display: "flex" }}>
        <Sidenav />
        <Grid
          item xs={12} sm={10} md={8} lg={7} sx={{ padding: { xs: "20px", sm: "40px" }, overflowY: "auto", margin: '0 auto' }}
        >
  <CardContent>
            <Grid elevation={3} style={{ padding: 2, width: '100%', maxWidth: '1300px' }}> {/* Increased maxWidth for mobile view */}
              <AppBar position="static" sx={{ width: '100%', minHeight: "60px",marginTop: "70px"}}>
                <Toolbar sx={{ justifyContent: 'left', height: '100%' }}>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ textAlign: 'left', fontWeight: 'bold', color: 'white', lineHeight: '60px' }} // Adjust lineHeight to match AppBar height
                  >
                    ALLOWANCE SETTINGS
                  </Typography>
                </Toolbar>
              </AppBar>
              <SettingsContainer  style={{backgroundColor:"white"}}>
                <FieldContainer >
                  <Label style={{marginLeft:10,}}>Choose Branch</Label>
                  <Select 
                    value={Branchid} 
                    onChange={(e) => setBranchid(e.target.value)}
                  >
                    <option value="">Select</option>
                    {Branch.map((e) => (
                      <option key={e.pn_BranchID} value={e.pn_BranchID}>
                        {e.BranchName}
                      </option>
                    ))}
                  </Select>
                </FieldContainer>
                
                <PreferenceContainer>
                  {/* <Label>Deduction Preferences</Label> */}
                  <Label>Settings</Label>
                  <IconButton onClick={() => setShowDeductions((prev) => !prev)}>
                    <MenuIcon />
                  </IconButton>
                </PreferenceContainer>
              </SettingsContainer>

              {showDeductions && (
                <CheckboxContainer>
                  {deductiondata.map((deduction) => (
                    <CheckboxLabel key={deduction.pn_DeductionID}>
                      <input 
                        type="checkbox" 
                        checked={deductionPreferences[deduction.v_DeductionName] || false} 
                        onChange={() => toggleDeduction(deduction)} 
                      />
                      {deduction.v_DeductionName}
                    </CheckboxLabel>
                  ))}
                </CheckboxContainer>
              )}
              <ContentContainer>
                <GridContainer>
                  <div className="ag-theme-alpine" style={{ width: '100%' }}>
                    <AgGridReact
                      rowData={rowData}
                      columnDefs={columnDefs}
                      domLayout="autoHeight"
                                    getRowHeight={() => 33}

                      getRowStyle={params => ({
                        backgroundColor: params.node.rowIndex % 2 === 0 ? '#cde3f2' : '#ffffff' // Light gray for even rows, white for odd rows
                      })}
                    />
                  </div>
                </GridContainer>
                <ButtonContainer style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <Button variant="contained" color="primary" onClick={handleSave}>
                    Save 
                  </Button>
                </ButtonContainer>
              </ContentContainer>
            </Grid>
          </CardContent>
        </Grid>
      </Grid>
    </Grid>
 
);

};

export default AllowanceSettings;