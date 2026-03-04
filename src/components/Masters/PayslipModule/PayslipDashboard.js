import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, LabelList, CartesianGrid,ComposedChart,Area } from "recharts";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Card, Typography,  Box, Fade, TextField, Paper,CircularProgress } from "@mui/material";
import GaugeChart from 'react-gauge-chart'; // Import the gauge chart
import { useMediaQuery, useTheme } from '@mui/material';  // Add this import at the top of your file

import { Grid } from "@mui/material"; // Changed from @material-ui/core to @mui/material
import { styled } from "@mui/system";
import { motion } from "framer-motion";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { ServerConfig } from "../../../serverconfiguration/serverconfig";
import { REPORTS } from "../../../serverconfiguration/controllers";
import { postRequest } from "../../../serverconfiguration/requestcomp";

const colors = ["#9cd6ff", "#2aa2fe", "#0071c1", "#d64161", "#ff7b25"];

const AnimatedCard = styled(motion(Card))(() => ({
  padding: "16px",
  borderRadius: "12px",
  boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
  background: "#ffffff",
  color: "#000",
  '&:hover': {
    transform: "scale(1.03)",
  }, 
}));

const PayslipDashboard = ({ data = [] }) => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [periodCode, setPeriodCode] = useState(selectedDate.format("MMMM YYYY"));
  const [gridData, setGridData] = useState([]);
  const [gridKey, setGridKey] = useState(0); // Ensures Ag-Grid re-renders properly
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [avgSickDays, setAvgSickDays] = useState(0);
  const [avgPerformance, setAvgPerformance] = useState(0);
  const [gateData,setGateData] = useState([]);
  const [stackedBarData, setStackedBarData] = useState([]);
  const [isloggedin, setisloggedin] = useState(sessionStorage.getItem("user"))
  console.log("isloggedin", isloggedin)
 
const [companyID,setcompanyid] =useState([]);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md')); 


  useEffect (() => {
    async function getCompanyData() {
      try {
          const data = await postRequest(ServerConfig.url, REPORTS, {
            query : `select pn_CompanyID from paym_company where Company_user_id ='${isloggedin}'`
          })
          setcompanyid(data.data)

      }catch(error) {
        console.error("Error fetching company data:", error);
        setcompanyid([])
      }
    }
    getCompanyData()
  },[isloggedin])

  useEffect (() => {
    console.log('CompanyId', companyID)

  }, [companyID]) 
  useEffect(() => {
    if (!periodCode) return;
  
    async function fetchData() {
      try {
        const response = await postRequest(ServerConfig.url, REPORTS, {
          query: `WITH AllowanceData AS (
                    SELECT DISTINCT pn_CompanyID, period_code, Allowance1 AS AllowanceName FROM [dbo].[paym_paybill] WHERE Allowance1 IS NOT NULL
                    UNION ALL SELECT DISTINCT pn_CompanyID, period_code, Allowance2 FROM [dbo].[paym_paybill] WHERE Allowance2 IS NOT NULL
                    UNION ALL SELECT DISTINCT pn_CompanyID, period_code, Allowance3 FROM [dbo].[paym_paybill] WHERE Allowance3 IS NOT NULL
                    UNION ALL SELECT DISTINCT pn_CompanyID, period_code, Allowance4 FROM [dbo].[paym_paybill] WHERE Allowance4 IS NOT NULL
                    UNION ALL SELECT DISTINCT pn_CompanyID, period_code, Allowance5 FROM [dbo].[paym_paybill] WHERE Allowance5 IS NOT NULL
                    UNION ALL SELECT DISTINCT pn_CompanyID, period_code, Allowance6 FROM [dbo].[paym_paybill] WHERE Allowance6 IS NOT NULL
                    UNION ALL SELECT DISTINCT pn_CompanyID, period_code, Allowance7 FROM [dbo].[paym_paybill] WHERE Allowance7 IS NOT NULL
                    UNION ALL SELECT DISTINCT pn_CompanyID, period_code, Allowance8 FROM [dbo].[paym_paybill] WHERE Allowance8 IS NOT NULL
                    UNION ALL SELECT DISTINCT pn_CompanyID, period_code, Allowance9 FROM [dbo].[paym_paybill] WHERE Allowance9 IS NOT NULL
                    UNION ALL SELECT DISTINCT pn_CompanyID, period_code, Allowance10 FROM [dbo].[paym_paybill] WHERE Allowance10 IS NOT NULL
                  ),
                  DeductionData AS (
                    SELECT DISTINCT pn_CompanyID, period_code, Deduction1 AS DeductionName FROM [dbo].[paym_paybill] WHERE Deduction1 IS NOT NULL
                    UNION ALL SELECT DISTINCT pn_CompanyID, period_code, Deduction2 FROM [dbo].[paym_paybill] WHERE Deduction2 IS NOT NULL
                    UNION ALL SELECT DISTINCT pn_CompanyID, period_code, Deduction3 FROM [dbo].[paym_paybill] WHERE Deduction3 IS NOT NULL
                    UNION ALL SELECT DISTINCT pn_CompanyID, period_code, Deduction4 FROM [dbo].[paym_paybill] WHERE Deduction4 IS NOT NULL
                    UNION ALL SELECT DISTINCT pn_CompanyID, period_code, Deduction5 FROM [dbo].[paym_paybill] WHERE Deduction5 IS NOT NULL
                    UNION ALL SELECT DISTINCT pn_CompanyID, period_code, Deduction6 FROM [dbo].[paym_paybill] WHERE Deduction6 IS NOT NULL
                    UNION ALL SELECT DISTINCT pn_CompanyID, period_code, Deduction7 FROM [dbo].[paym_paybill] WHERE Deduction7 IS NOT NULL
                    UNION ALL SELECT DISTINCT pn_CompanyID, period_code, Deduction8 FROM [dbo].[paym_paybill] WHERE Deduction8 IS NOT NULL
                    UNION ALL SELECT DISTINCT pn_CompanyID, period_code, Deduction9 FROM [dbo].[paym_paybill] WHERE Deduction9 IS NOT NULL
                    UNION ALL SELECT DISTINCT pn_CompanyID, period_code, Deduction10 FROM [dbo].[paym_paybill] WHERE Deduction10 IS NOT NULL
                  )
                  SELECT 
                    COUNT(DISTINCT p.GradeName) AS Total_Grades,
                    COUNT(DISTINCT p.DesignationName) AS Total_Designations,
                    COUNT(DISTINCT p.pn_BranchID) AS Total_Branches,
                    COUNT(DISTINCT p.CategoryName) AS Total_Categories,
                    COUNT(DISTINCT p.DepartmentName) AS Total_Departments,
  
                    -- Count of unique allowances
                    (SELECT COUNT(DISTINCT AllowanceName) FROM AllowanceData WHERE pn_CompanyID = ${companyID[0].pn_CompanyID} AND period_code = '${periodCode}') AS Total_Allowances,
  
                    -- Unique Allowance Names
                    (SELECT STRING_AGG(AllowanceName, ', ') FROM AllowanceData WHERE pn_CompanyID = ${companyID[0].pn_CompanyID} AND period_code = '${periodCode}') AS Allowance_Names,
  
                    -- Count of unique deductions
                    (SELECT COUNT(DISTINCT DeductionName) FROM DeductionData WHERE pn_CompanyID = ${companyID[0].pn_CompanyID} AND period_code = '${periodCode}') AS Total_Deductions,
  
                    -- Unique Deduction Names
                    (SELECT STRING_AGG(DeductionName, ', ') FROM DeductionData WHERE pn_CompanyID = ${companyID[0].pn_CompanyID} AND period_code = '${periodCode}') AS Deduction_Names
  
                  FROM [dbo].[paym_paybill] p
                  WHERE p.pn_CompanyID = ${companyID[0].pn_CompanyID} AND p.period_code = '${periodCode}';`
        });
  
        console.log("Fetched Data:", response.data);
  
        if (response.data) {
          setGateData(response.data);
        } else {
          setGateData([]);
        }
      } catch (error) {
        console.error("Error fetching organizational data:", error);
        setGateData([]);
      }
    }
    fetchData();
  }, [periodCode, companyID]);
  const totalcountData = [
    { BreakdownName: 'Grades', Total_Count: gateData[0]?.Total_Grades || 0 },
    { BreakdownName: 'Designations', Total_Count: gateData[0]?.Total_Designations || 0 },
    { BreakdownName: 'Branches', Total_Count: gateData[0]?.Total_Branches || 0 },
    { BreakdownName: 'Categories', Total_Count: gateData[0]?.Total_Categories || 0 },
    { BreakdownName: 'Departments', Total_Count: gateData[0]?.Total_Departments || 0 },
];
const barColors = ["#054d66", "#7ad25a", "#028398", "#45a8a5", "#1160af"]; // Different colors for each bar
const CustomLabel = (props) => {
    const { x, y, width, value } = props;
    return (
      <g>
        {/* White Box Background */}
        <rect
          x={x + width / 6}   // Adjust box to be centered inside the bar
          y={y + 5}          // Position inside the bar
          width={width / 1.5} // Box width adjusted to fit inside
          height={20}         // Box height
          fill="white"        // Box color
          rx={4}              // Rounded corners
        />
        {/* Total Count Text */}
        <text
          x={x + width / 2}   // Center the text inside the bar
          y={y + 18}           // Position the text inside the bar
          fill="#2f4f4f"      // Text color
          fontSize={12}
          fontWeight="bold"
          textAnchor="middle"
        >
          {value}
        </text>
      </g>
    );
  };
  useEffect(() => {
      setPeriodCode(selectedDate.format("MMMM YYYY"));
  }, [selectedDate]);

  useEffect(() => {
      if (!periodCode) return;

      async function fetchPayrollData() {
          try {
              const response = await postRequest(ServerConfig.url, REPORTS, {
                  query: `SELECT 
                          pn_CompanyID,
                          pn_BranchID, 
                          period_code,
                          DesignationName,
                          DepartmentName,
                          GradeName,
                          CategoryName,
                          COUNT(DISTINCT GradeName) AS Total_Grades,
                            COUNT(DISTINCT CategoryName) AS Total_Categories,
                            COUNT(DISTINCT DepartmentName) AS Total_Departments,
                            COUNT(DISTINCT DesignationName) AS Total_Designations,
                          COUNT(DISTINCT pn_EmployeeID) AS Total_Employees,
                          SUM(Earn_Amount) AS Total_Earn_Amount,
                          SUM(Ded_Amount) AS Total_Ded_Amount,
                          SUM(NetPay) AS Total_NetPay,
                          SUM(Earned_Basic) AS Total_Earned_Basic,
                          SUM(Gross_salary) AS Total_Gross_Salary,
                          SUM(Net_salary) AS Total_Net_Salary,
                          SUM(ot_amt) AS Total_OT_Amount,
                          SUM(Att_bonus) AS Total_Attendance_Bonus
                      FROM dbo.paym_paybill
                      WHERE period_code = '${periodCode}'
                      GROUP BY 
                          pn_CompanyID, pn_BranchID, period_code, DesignationName,
                          DepartmentName, GradeName, CategoryName;`
              });

              console.log("Fetched Payroll Data:", response.data);  

              if (response.data) {
                  setGridData([...response.data]);  // ✅ Ensure state updates correctly
                  setGridKey(prevKey => prevKey + 1); // ✅ Force Ag-Grid to refresh
                  setAvgSickDays(response.data.avgSickDays || 0);
              setAvgPerformance(response.data.avgPerformance || 0);
              } else {
                  setGridData([]);
              }
          } catch (error) {
              console.error("Error fetching payroll data:", error);
              setGridData([]);
          }
      }
      fetchPayrollData();
  }, [periodCode]);  
  const totalEmployees = gridData.reduce((sum, item) => sum + (item.Total_Employees || 0), 0);
  const totalNetSalary = gridData.reduce((sum, item) => sum + (item.Total_Net_Salary || 0), 0);
  const totalGrades = gridData.reduce((sum, item) => sum + (item.Total_Grades || 0), 0);
  const totalCategories = gridData.reduce((sum, item) => sum + (item.Total_Categories || 0), 0);
  const totalDepartments = gridData.reduce((sum, item) => sum + (item.Total_Departments || 0), 0);
  const totalDesignations = gridData.reduce((sum, item) => sum + (item.Total_Designations || 0), 0);
  const allowanceNames = gateData[0]?.Allowance_Names;
const deductionNames = gateData[0]?.Deduction_Names;
const allowanceArray = typeof allowanceNames === 'string' ? allowanceNames.split(", ") : [];
const deductionArray = typeof deductionNames === 'string' ? deductionNames.split(", ") : [];  
    const columns = [
      { headerName: "Branch", field: "pn_BranchID", sortable: true, filter: true },
      { headerName: "Designation", field: "DesignationName", sortable: true, filter: true },
      { headerName: "Department", field: "DepartmentName", sortable: true, filter: true },
      { headerName: "Grade Name", field: "GradeName", sortable: true, filter: true },
      { headerName: "Category Name", field: "CategoryName", sortable: true, filter: true },
      { headerName: "Total Employees", field: "Total_Employees", type: "numericColumn", cellStyle: { textAlign: "right" } },
      { headerName: "Total Gross Salary", field: "Total_Gross_Salary", type: "numericColumn", valueFormatter: params => params.value ? `${params.value.toFixed(2)}` : "NULL", cellStyle: { textAlign: "right" } },
      { headerName: "Total Earn Salary", field: "Total_Earn_Amount", type: "numericColumn", valueFormatter: params => params.value ? `${params.value.toFixed(2)}` : "NULL", cellStyle: { textAlign: "right" } },
      { headerName: "Total Deduction Salary", field: "Total_Ded_Amount", type: "numericColumn", valueFormatter: params => params.value ? `${params.value.toFixed(2)}` : "NULL", cellStyle: { textAlign: "right" } },
      { headerName: "Total Net Salary", field: "Total_Net_Salary", type: "numericColumn", valueFormatter: params => params.value ? `${params.value.toFixed(2)}` : "NULL", cellStyle: { textAlign: "right" } },
  ];


  useEffect(() => {
    async function fetchChartData() {
        try {
            const response = await postRequest(ServerConfig.url, REPORTS, {
                query: `SELECT 
                            pn_CompanyID,
                            CompanyName,
                            period_code,
                            
                            COUNT(DISTINCT pn_EmployeeID) AS Total_Employees,
                            SUM(Earn_Amount) AS Total_Earn_Amount,
                            SUM(Ded_Amount) AS Total_Ded_Amount,
                            SUM(NetPay) AS Total_NetPay,
                            SUM(Earned_Basic) AS Total_Earned_Basic, 
                            SUM(Gross_salary) AS Total_Gross_Salary,
                            SUM(Net_salary) AS Total_Net_Salary,
                            SUM(ot_amt) AS Total_OT_Amount,
                            SUM(Att_bonus) AS Total_Attendance_Bonus
                        FROM [dbo].[paym_paybill]
                        WHERE period_code = '${periodCode}'
                        GROUP BY pn_CompanyID, CompanyName, period_code
                        ORDER BY pn_CompanyID, period_code;`
            });

            console.log("Fetched Chart Data:", response.data);

            if (response.data && Array.isArray(response.data)) {
                // Process Pie Chart Data
                const totalOT = response.data.reduce((sum, item) => sum + (item.Total_OT_Amount || 0), 0);
                const totalBonus = response.data.reduce((sum, item) => sum + (item.Total_Attendance_Bonus || 0), 0);
                const totalSalary = response.data.reduce((sum, item) => sum + (item.Total_Net_Salary || 0), 0);

                setStackedBarData([
                    {
                      name: "Payroll Breakdown",
                      Overtime: totalOT,
                      Bonus: totalBonus,
                      Salary: totalSalary
                    }
                  ]);
                setBarData([
                    { category: "Earned Basic", Amount: response.data.reduce((sum, item) => sum + (item.Total_Earned_Basic || 0), 0) },
                    { category: "Allowance", Amount: response.data.reduce((sum, item) => sum + (item.Total_Earn_Amount || 0), 0) },
                    { category: "Deduction", Amount: response.data.reduce((sum, item) => sum + (item.Total_Ded_Amount || 0), 0) },

                ]);
                const lineDataFormatted = response.data.map(item => ({
                    month: item.period_code,
                    salary: item.Total_Net_Salary || 0
                }));

                setLineData(lineDataFormatted);
            } else {
                setStackedBarData([]);
                setBarData([]);
                setLineData([]);
            }
        } catch (error) {
            console.error("Error fetching chart data:", error);
            setStackedBarData([]);
            setBarData([]);
            setLineData([]);
        }
    }

    if (periodCode) {
        fetchChartData();
    }
}, [periodCode]); 
                                                         
  return (
    <Box sx={{ padding: "24px", backgroundColor: "#e3f2fd", minHeight: "100vh", animation: "fadeIn 1.5s ease-in-out" }}>
      <Fade in={true} timeout={1000}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#000" }}>
          Payroll Management Dashboard
        </Typography>
      </Fade>

      <Box sx={{ display: "flex", justifyContent: "flex-end", marginBottom: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            views={["year", "month"]}
            label="Select Period"
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            renderInput={(params) => <TextField {...params} variant="outlined" />}
            sx={{ width: 250, backgroundColor: "white", borderRadius: "8px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}
          />
        </LocalizationProvider>
      </Box>

      <Grid container spacing={2}>
  {/* First Row with Gauge Charts */}
  <Grid item xs={12} sm={3}>
    <Paper sx={{ padding: 2, textAlign: "center", marginBottom: '10px', backgroundColor: "#ffffff", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}>
      <Typography variant="h6">Total Employees</Typography>
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>{totalEmployees}</Typography>
    </Paper>
    <Paper sx={{ padding: 2, textAlign: "center", marginBottom: "10px", backgroundColor: "#ffffff", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}>
    <Typography variant="h6">Total Allowance</Typography>
      <Typography variant="h5" sx={{ fontWeight: "bold", cursor: "pointer", marginBottom: "5px" }}>
      {gateData[0]?.Total_Allowances || 0  }    </Typography>
      {allowanceArray.map((allowance, index) => (
        <Typography key={index} variant="body1">
          {allowance}
        </Typography>
      ))}
  </Paper>
 </Grid>
  <Grid item xs={12} sm={3}>
    <Paper sx={{ padding: 2, textAlign: "center", marginBottom: '10px', backgroundColor: "#ffffff", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}>
      <Typography variant="h6">Total Net Salary</Typography>
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>₹{totalNetSalary.toFixed(2)}</Typography>
    </Paper>
    <Paper sx={{ padding: 2, textAlign: "center", marginBottom: "10px", backgroundColor: "#ffffff", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}>
    <Typography variant="h6">Total Deduction</Typography>
      <Typography variant="h5" sx={{ fontWeight: "bold", cursor: "pointer", marginBottom: "5px" }}>
      {gateData[0]?.Total_Deductions || 0  }    </Typography>
      {deductionArray.map((deduction, index) => (
        <Typography key={index} variant="body1">
          {deduction}
        </Typography>
      ))}
  </Paper>
  </Grid>

  {/* Second Row with Bar Chart */}
  <Grid item xs={12} sm={6}>
      <Paper sx={{ padding: 2, marginBottom: 4, boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}>
        <Typography variant="h6" gutterBottom>Organizational Overview</Typography>
        <ResponsiveContainer width="100%" height={215}>
          <BarChart data={totalcountData} barCategoryGap="10%">
            <XAxis dataKey="BreakdownName" />
            <YAxis />
            <Bar dataKey="Total_Count" barSize={80}>
              {totalcountData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
              ))}
              {/* Custom Label Inside Bar */}
              <LabelList dataKey="Total_Count" position="insideTop" content={<CustomLabel />} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Grid>
</Grid>

      <Grid container spacing={2} >
        <Grid item xs={12} md={4}>
          <AnimatedCard>
          <Typography variant="h6" align="center">Payroll Breakdown</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={stackedBarData} 
              layout="horizontal"  // Set to "horizontal" for horizontal bar chart
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis type="category" dataKey="name" hide />  {/* Change to category for horizontal layout */}
              <YAxis type="number" hide />  {/* Change to number for horizontal layout */}
              <Tooltip formatter={(value) => value.toLocaleString()} />
              <Legend />
              <Bar dataKey="Salary" stackId="a" fill="#1f78b4" barSize={100} />

              <Bar dataKey="Overtime" stackId="a" fill="#fe7f0e" barSize={100} />
              <Bar dataKey="Bonus" stackId="a" fill="#2ba02d" barSize={100} />
            </BarChart>
          </ResponsiveContainer>
          </AnimatedCard>
        </Grid>

        <Grid item xs={12} md={4}>
  <AnimatedCard>
    <Typography variant="h6" style={{ textAlign: 'center' }}>Salary Distribution</Typography>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={barData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Amount" fill="#1bd4d4" barSize={40} />
      </BarChart>
    </ResponsiveContainer>
  </AnimatedCard>
</Grid>

        <Grid item xs={12} md={4}>
          <AnimatedCard>
            <Typography variant="h6">Salary Trend</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="salary" stroke="#FF9800" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </AnimatedCard>
        </Grid>

        <Grid container spacing={3} style={{ marginTop: '20px' }}>
  <Grid item xs={6} md={3}>
    <Paper sx={{ padding: 2, textAlign: "center", backgroundColor: "#ffffff", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}>
      <Box position="relative" display="inline-flex">
        <CircularProgress variant="determinate" value={100} size={60} thickness={4} sx={{ color: "#3f51b5" }} />
        <Box position="absolute" top="50%" left="50%" style={{ transform: 'translate(-50%, -50%)' }}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>{totalGrades}</Typography>
        </Box>
      </Box>
      <Typography variant="h6">Total Grades</Typography>
    </Paper>
  </Grid>

  <Grid item xs={6} md={3}>
    <Paper sx={{ padding: 2, textAlign: "center", backgroundColor: "#ffffff", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}>
      <Box position="relative" display="inline-flex">
        <CircularProgress variant="determinate" value={100} size={60} thickness={4} sx={{ color: "#3f51b5" }} />
        <Box position="absolute" top="50%" left="50%" style={{ transform: 'translate(-50%, -50%)' }}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>{totalCategories}</Typography>
        </Box>
      </Box>
      <Typography variant="h6">Total Categories</Typography>
    </Paper>
  </Grid>

  <Grid item xs={6} md={3}>
    <Paper sx={{ padding: 2, textAlign: "center", backgroundColor: "#ffffff", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}>
      <Box position="relative" display="inline-flex">
        <CircularProgress variant="determinate" value={100} size={60} thickness={4} sx={{ color: "#3f51b5" }} />
        <Box position="absolute" top="50%" left="50%" style={{ transform: 'translate(-50%, -50%)' }}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>{totalDepartments}</Typography>
        </Box>
      </Box>
      <Typography variant="h6">Total Departments</Typography>
    </Paper>
  </Grid>

  <Grid item xs={6} md={3}>
    <Paper sx={{ padding: 2, textAlign: "center", backgroundColor: "#ffffff", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}>
      <Box position="relative" display="inline-flex">
        <CircularProgress variant="determinate" value={100} size={60} thickness={4} sx={{ color: "#3f51b5" }} />
        <Box position="absolute" top="50%" left="50%" style={{ transform: 'translate(-50%, -50%)' }}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>{totalDesignations}</Typography>
        </Box>
      </Box>
      <Typography variant="h6">Total Designations</Typography>
    </Paper>
  </Grid>
</Grid>

        <Grid item xs={12}>
          <Paper sx={{ padding: 2, marginTop: 3, boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}>
            <Typography variant="h6" gutterBottom>Employee Payroll Data</Typography>
            <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
                    <AgGridReact
                        key={gridKey} // ✅ Force Ag-Grid to re-render with fresh data
                        rowData={gridData} 
                        columnDefs={columns}
                        pagination={true}
                        paginationPageSize={10}
                        domLayout="autoHeight"/>
                </div>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PayslipDashboard;
