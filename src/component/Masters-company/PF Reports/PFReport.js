import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { postRequest } from "../../../serverconfiguration/requestcomp";
import { ServerConfig } from "../../../serverconfiguration/serverconfig";
import { REPORTS } from "../../../serverconfiguration/controllers";
import { Button, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';


const PFReport = () => {
  const [pfData, setPfData] = useState([]);
    const [company, setCompany] = useState([]);
  const [branches, setBranches] = useState([]);
      const [periodCode, setPeriodCode] = useState(""); // Changed from month and year to periodCode
  const [periods, setPeriods] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");
    const [isloggedin, setisloggedin] = useState(sessionStorage.getItem("user"));
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        if (date) {
          const options = { year: 'numeric', month: 'long' };
          const formattedDate = date.toLocaleDateString('en-US', options);
          setPeriodCode(formattedDate); // Set the formatted date as period code
        }
      };

   useEffect(() => {
        async function fetchCompanyData() {
          if (isloggedin) { 
            try {
              const data = await postRequest(ServerConfig.url, REPORTS, {
                query: `SELECT * FROM paym_Company WHERE Company_User_Id = '${isloggedin}'`,
              });
              setCompany(data.data);
            } catch (error) {
              console.error("Error fetching company data:", error);
            }
          }
        }
        fetchCompanyData();
      }, [isloggedin]);
      useEffect(() => {
        async function fetchBranchData() {
          if (selectedCompany) {
            try {
              const data = await postRequest(ServerConfig.url, REPORTS, {
                query: `SELECT * FROM paym_branch WHERE pn_CompanyID = ${selectedCompany}`,
              });
              setBranches(data.data);
            } catch (error) {
              console.error("Error fetching branch data:", error);
            }
          }
        }
        fetchBranchData();
      }, [selectedCompany]);
      const columnDefs = [
        { headerName: "Employee Code", field: "emp_code" },
        { headerName: "Employee Name", field: "emp_name" },
        { headerName: "PF Number", field: "pfno" },
        { headerName: "Basic Salary", field: "basic_salary", valueFormatter: (params) => `₹${params.value}` },
        { headerName: "Level Name", field: "Level_Name" },
        { headerName: "PF", field: "PF", valueFormatter: (params) => `₹${params.value}` },
        { headerName: "Month", field: "Month" },
        { headerName: "Year", field: "Year" },
        { headerName: "Absent", field: "Absent" },
        { headerName: "Present", field: "Present" },
        { headerName: "Leave", field: "Leave" },
        { headerName: "Holiday", field: "Holiday" },
        { headerName: "Work From Home", field: "Work_From_Home" },
        { headerName: "Half Day", field: "HalfDay" },
        { headerName: "Week Off", field: "WeekOff" },
        { headerName: "Paid Days", field: "PaidDays" },
        { headerName: "Total Days in Month", field: "TotalDaysInMonth" },
        { headerName: "Max Ceiling", field: "MaxCeiling", valueFormatter: (params) => `₹${params.value}` },
        { headerName: "Upper Limit", field: "UpperLimit", valueFormatter: (params) => `₹${params.value}` },
        { headerName: "PF Contribution", field: "PF_Contribution", valueFormatter: (params) => `₹${params.value}` },
        { headerName: "EPF Contribution", field: "EPF_Contribution", valueFormatter: (params) => `₹${params.value}` },
        { headerName: "EPS Contribution", field: "EPS_Contribution", valueFormatter: (params) => `₹${params.value}` },
        { headerName: "Total Contribution", field: "Total_Contribution", valueFormatter: (params) => `₹${params.value}` }

      ];
      
      const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text("PF Report", 14, 10);
        
        doc.autoTable({
          head: [[
             "Employee Code", "Employee Name", "PF Number", "Basic Salary", "Level Name", "PF", "Month", "Year", "Absent", "Present", "Leave", "Holiday", "Work From Home", "Half Day", "Week Off", "Paid Days", "Total Days", "Max Ceiling", "Upper Limit", "PF Contribution", "EPF Contribution", "EPS Contribution","Total Contribution"
          ]],
          body: pfData.map(row => [
             row.emp_code, row.emp_name, row.pfno, `₹${row.basic_salary}`, row.Level_Name, `₹${row.PF}`, row.Month, row.Year, row.Absent, row.Present, row.Leave, row.Holiday, row.Work_From_Home, row.HalfDay, row.WeekOff, row.PaidDays, row.TotalDaysInMonth, `₹${row.MaxCeiling}`, `₹${row.UpperLimit}`, `₹${row.PF_Contribution}`, `₹${row.EPF_Contribution}`, `₹${row.EPS_Contribution}`,`${row.Total_Contribution}`
          ])
        });
      
        doc.save("PF_Report.pdf");
      };
      
  return (

    <div style={{ width: "100%", textAlign: "center", padding: "20px" }}>
      <h2>Provident Fund Report</h2>

      {/* Dropdown Filters */}
     <div className="grid grid-cols-4 gap-4 mb-4">
             <select style={{marginRight: '10px'}} onChange={(e) => setSelectedCompany(e.target.value)} className="border p-2 rounded" disabled={!isloggedin}>
               <option value="">Select Company</option>
               {company.map((comp) => (
                 <option key={comp.pn_CompanyID} value={comp.pn_CompanyID}>{comp.CompanyName}</option>
               ))}
             </select>
             <select style={{marginRight: '10px'}} onChange={(e) => setSelectedBranch(e.target.value)} className="border p-2 rounded" disabled={!selectedCompany}>
               <option value="">Select Branch</option>
               {branches.map((branch) => (
                 <option key={branch.pn_BranchID} value={branch.pn_BranchID}>{branch.BranchName}</option>
               ))}
             </select>
             <DatePicker
               selected={selectedDate}
               onChange={handleDateChange}
               showMonthYearPicker
               dateFormat="MMMM yyyy"
               placeholderText="Select a period"
               className="border p-2 rounded"/>
           </div>

      {/* Ag-Grid Table */}
      <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
        <AgGridReact rowData={pfData} columnDefs={columnDefs} pagination={true} />
      </div>

      {/* Export to PDF Button at Bottom */}
      <div style={{ marginTop: "20px" }}>
        <Button variant="contained" color="secondary" onClick={exportToPDF}>
          Export to PDF
        </Button>
      </div>
    </div>
  );
};

export default PFReport;
