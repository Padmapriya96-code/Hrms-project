import React, { useState, useEffect, useRef } from "react";
import { postRequest } from "../serverconfiguration/requestcomp";
import { ServerConfig } from "../serverconfiguration/serverconfig";
import { REPORTS } from "../serverconfiguration/controllers";
import { AgGridReact } from "ag-grid-react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import MenuIcon from "@mui/icons-material/Menu";  // Correct import
import { Menu, MenuItem, Switch ,Box} from "@mui/material";  // MUI components
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Consolidation = () => {
    const [isloggedin, setisloggedin] = useState(sessionStorage.getItem("user"));
    const [company, setCompany] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState("");
    const [selectedAllowances, setSelectedAllowances] = useState("");
    const [selectedDeductions, setSelectedDeductions] = useState("");
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState("");
    const [periodCode, setPeriodCode] = useState(""); // Changed from month and year to periodCode
    const [payRegisterData, setPayRegisterData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [allowances, setAllowances] = useState([]);
const [deductions, setDeductions] = useState([]);
    const handleDateChange = (date) => {
        setSelectedDate(date);
        if (date) {
          const options = { year: 'numeric', month: 'long' };
          const formattedDate = date.toLocaleDateString('en-US', options);
          setPeriodCode(formattedDate); // Set the formatted date as period code
        }
      };
    const [anchorEl, setAnchorEl] = useState(null);  // For dropdown menu anchor
    const gridRef = useRef();
    const toggleAllowance = (id) => {
        setSelectedAllowances((prev) =>
          prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
        );
      };
    
      const toggleDeduction = (id) => {
        setSelectedDeductions((prev) =>
          prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
        );
      };
    const defaultColDef = {
      flex: 1,
      resizable: true,
      minWidth: 100, 
      sortable: true,
      autoHeaderHeight: true,
      autoSizePadding: 10,
      cellStyle: (params) => ({
        textAlign: isNaN(params.value) ? "left" : "right",
      }),
      valueFormatter: (params) => {
        if (!isNaN(params.value) && params.value !== null) {
          return Number(params.value).toFixed(2);
        }
        return params.value || "NULL";
      },
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
    useEffect(() => {
      async function fetchPayRegisterData() {
        if (selectedBranch && periodCode && selectedCompany) {
          try {
            const query = `
              SELECT 
                pn_CompanyID, pn_BranchID, period_code,
                DesignationName, DepartmentName, GradeName, CategoryName,
                SUM(value1) AS Total_Allowance1, SUM(value2) AS Total_Allowance2,
                SUM(value3) AS Total_Allowance3, SUM(value4) AS Total_Allowance4,
                SUM(value5) AS Total_Allowance5, SUM(value6) AS Total_Allowance6,
                SUM(value7) AS Total_Allowance7, SUM(value8) AS Total_Allowance8,
                SUM(value9) AS Total_Allowance9, SUM(value10) AS Total_Allowance10,
                SUM(valueA1) AS Total_Deduction1, SUM(valueA2) AS Total_Deduction2,
                SUM(valueA3) AS Total_Deduction3, SUM(valueA4) AS Total_Deduction4,
                SUM(valueA5) AS Total_Deduction5, SUM(valueA6) AS Total_Deduction6,
                SUM(valueA7) AS Total_Deduction7, SUM(valueA8) AS Total_Deduction8,
                SUM(valueA9) AS Total_Deduction9, SUM(valueA10) AS Total_Deduction10,
                SUM(Earn_Amount) AS Total_Earn_Amount, SUM(Ded_Amount) AS Total_Ded_Amount,
                SUM(NetPay) AS Total_NetPay, SUM(Earned_Basic) AS Total_Earned_Basic,
                SUM(Gross_salary) AS Total_Gross_Salary, SUM(Net_salary) AS Total_Net_Salary,
                SUM(ot_amt) AS Total_OT_Amount, SUM(Att_bonus) AS Total_Attendance_Bonus
              FROM dbo.paym_paybill
              WHERE pn_CompanyID = ${selectedCompany} 
                AND pn_BranchID = ${selectedBranch}
                AND period_code = '${periodCode}'  
              GROUP BY pn_CompanyID, pn_BranchID, period_code, DesignationName, 
                DepartmentName, GradeName, CategoryName
            `;
                const data = await postRequest(ServerConfig.url, REPORTS, { query });
            setPayRegisterData(data.data);
          } catch (error) {
            console.error("Error fetching pay register data:", error);
          }
        }
      }
      fetchPayRegisterData();
    }, [selectedBranch, periodCode, selectedCompany]);

    useEffect(() => {
        async function fetchAllowanceDeductionNames() {
          if (selectedCompany && selectedBranch) {
            try {
              const query = `SELECT * FROM paym_paybill WHERE pn_CompanyID = ${selectedCompany} AND pn_BranchID = ${selectedBranch}`;
              const data = await postRequest(ServerConfig.url, REPORTS, { query });
              const firstRow = data.data[0] || {};
      
              const fetchedAllowances = [];
              const fetchedDeductions = [];
      
              for (let i = 1; i <= 10; i++) {
                const allowanceName = firstRow[`Allowance${i}`];
                const deductionName = firstRow[`Deduction${i}`];
      
                // Ensure values are strings (avoid objects)
                if (allowanceName && typeof allowanceName === "string") {
                  fetchedAllowances.push({ id: i, name: allowanceName });
                }
                if (deductionName && typeof deductionName === "string") {
                  fetchedDeductions.push({ id: i, name: deductionName });
                }
              }
      
              setAllowances(fetchedAllowances);
              setDeductions(fetchedDeductions);
            } catch (error) {
              console.error("Error fetching allowance and deduction names:", error);
            }
          }
        }
        fetchAllowanceDeductionNames();
      }, [selectedCompany, selectedBranch]);
      const exportToPDF = () => {
        const doc = new jsPDF("l", "mm", "a4");
        const gridApi = gridRef.current.api;
        if (!gridApi || gridApi.getDisplayedRowCount() === 0) {
          alert("No data available for export!");
          return;
        }
      
        // Retrieve common details from company and branch arrays
        const companyDetails = company.find(comp => comp.pn_CompanyID === Number(selectedCompany));
        const branchDetails = branches.find(b => b.pn_BranchID === Number(selectedBranch));
      
        const companyName = companyDetails ? companyDetails.CompanyName : "Company Name N/A";
        const branchName = branchDetails ? branchDetails.BranchName : "Branch Name N/A";
      
        // Print common header details
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
      
        // Center align company name
        const companyTitleWidth = doc.getTextWidth(companyName);
        const companyTitleX = (doc.internal.pageSize.width - companyTitleWidth) / 2;
        // Print company name at Y = 12 (or adjust as needed)
        doc.text(companyName, companyTitleX, 12);
      
        // Prepare period and printed date details
        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate().toString().padStart(2, "0")}-${(currentDate.getMonth() + 1)
          .toString().padStart(2, "0")}-${currentDate.getFullYear()}`;
        const periodText = `Period: ${selectedDate ? selectedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : ''}`;
        const printedDate = `Printed Date: ${formattedDate}`;
        const combinedText = `Consolidation | Branch: ${branchName} | ${periodText} | ${printedDate}`;
        const combinedTextWidth = doc.getTextWidth(combinedText);
        const combinedTextX = (doc.internal.pageSize.width - combinedTextWidth) / 2;
      
        // Print combined text closer to the company name (adjust Y value as desired)
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(combinedText, combinedTextX, 20);  // Reduced from 30
      
        // Define column definitions (omitted for brevity, same as your code)
        const columnDefs = [
          { headerName: "Designation", field: "DesignationName", pinned: "left", width: 50 },
          { headerName: "Department", field: "DepartmentName", pinned: "left", width: 50 },
          { headerName: "Grade", field: "GradeName", pinned: "left", width: 50 },
          { headerName: "Category", field: "CategoryName", pinned: "left", width: 50 },
          ...allowances
            .filter((a) => selectedAllowances.includes(a.id))
            .map((a) => ({
              headerName: a.name,
              field: `Total_Allowance${a.id}`,
              width: 200,
              cellStyle: { 
                textAlign: "right",
                backgroundColor: "#f2f2f2"  // Light green tint for allowance cells
              },
              valueFormatter: (params) =>
                !isNaN(params.value) ? Number(params.value).toFixed(2) : params.value,
            })),
          ...deductions
            .filter((d) => selectedDeductions.includes(d.id))
            .map((d) => ({
              headerName: d.name,
              field: `Total_Deduction${d.id}`,
              width: 150,
              cellStyle: { 
                textAlign: "right", 
                backgroundColor: "#e6e6e6"  // Light red tint for deduction cells
              },
              valueFormatter: (params) =>
                !isNaN(params.value) ? Number(params.value).toFixed(2) : params.value,
            })),
        //   { headerName: "Total Earned Amount", field: "Total_Earn_Amount", cellStyle: { textAlign: 'right' }, valueFormatter: (params) => Number(params.value).toFixed(2), width: 150 },
        //   { headerName: "Total Deduction Amount", field: "Total_Ded_Amount", cellStyle: { textAlign: 'right' }, valueFormatter: (params) => Number(params.value).toFixed(2), width: 150 },
        //   { headerName: "Net Pay", field: "Total_NetPay", cellStyle: { textAlign: 'right' }, valueFormatter: (params) => Number(params.value).toFixed(2), width: 150 },
        //   { headerName: "Earned Basic", field: "Total_Earned_Basic", cellStyle: { textAlign: 'right' }, valueFormatter: (params) => Number(params.value).toFixed(2), width: 150 },
        //   { headerName: "Gross Salary", field: "Total_Gross_Salary", cellStyle: { textAlign: 'right' }, valueFormatter: (params) => Number(params.value).toFixed(2), width: 150 },
        //   { headerName: "Net Salary", field: "Total_Net_Salary", cellStyle: { textAlign: 'right' }, valueFormatter: (params) => Number(params.value).toFixed(2), width: 150 },
        //   { headerName: "OT Amount", field: "Total_OT_Amount", cellStyle: { textAlign: 'right' }, valueFormatter: (params) => Number(params.value).toFixed(2), width: 150 },
        //   { headerName: "Attendance Bonus", field: "Total_Attendance_Bonus", cellStyle: { textAlign: 'right' }, valueFormatter: (params) => Number(params.value).toFixed(2), width: 150 },
        ];
      
        const headers = columnDefs.map(col => col.headerName);
        const rowData = [];
        for (let i = 0; i < gridApi.getDisplayedRowCount(); i++) {
          const rowNode = gridApi.getDisplayedRowAtIndex(i);
          if (rowNode) {
            rowData.push(
              columnDefs.map(col => {
                let value = rowNode.data[col.field];
                return !isNaN(value) && value !== null ? Number(value).toFixed(2) : value || "NULL";
              })
            );
          }
        }
      
        // Generate table with a lower startY (reduce the gap)
        doc.autoTable({
          startY: 25,  // Reduced startY from 32 to 25
          head: [headers],
          body: rowData,
          theme: "grid",
          styles: { fontSize: 10, cellPadding: 0.5 },
          headStyles: { fillColor: [41, 128, 185], textColor: 255, halign: "center" },
          columnStyles: columnDefs.reduce((styles, col, index) => {
            styles[index] = { halign: col.cellStyle && col.cellStyle.textAlign ? col.cellStyle.textAlign : "left" };
            return styles;
          }, {}),
          margin: { top: 10 }
        });
      
        doc.save("Consolidation.pdf");
      };
      
      
      
      const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
      };
      
      const handleMenuClose = () => {
        setAnchorEl(null);
      };
    return (
      <div className="max-w-4xl mx-auto p-4 relative">
        <h2 className="text-2xl font-bold mb-4">Consolidation</h2>
        <div style={{textAlign: 'right'}}>
          <MenuIcon 
            onClick={handleMenuClick} 
            className="cursor-pointer" 
            fontSize="Medium" 
          />

<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
  {allowances.map((a) => (
    <MenuItem key={a.id} onClick={() => toggleAllowance(a.id)}>
      <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
        {a.name}
        <Switch
          checked={selectedAllowances.includes(a.id)}
          onChange={() => toggleAllowance(a.id)}
          onClick={(e) => e.stopPropagation()} // Prevents menu from closing when toggling
        />
      </Box>
    </MenuItem>
  ))}
  {deductions.map((d) => (
    <MenuItem key={d.id} onClick={() => toggleDeduction(d.id)}>
      <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
        {d.name}
        <Switch
          checked={selectedDeductions.includes(d.id)}
          onChange={() => toggleDeduction(d.id)}
          onClick={(e) => e.stopPropagation()} // Prevents menu from closing when toggling
        />
      </Box>
    </MenuItem>
  ))}
</Menu>Preference
        </div>
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
      <div style={{ padding: "10px", fontWeight: "bold", textAlign: "center", background: "#f5f5f5" }}>
        Select the preference for Allowance and Deduction
      </div>
        <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
          <AgGridReact
            ref={gridRef}
            rowData={payRegisterData}
            columnDefs={[{ headerName: "Designation", field: "DesignationName", pinned: "left", width: 50 },
        { headerName: "Department", field: "DepartmentName", pinned: "left", width: 50 },
        { headerName: "Grade", field: "GradeName", pinned: "left", width: 50 },
        { headerName: "Category", field: "CategoryName", pinned: "left", width: 50 },
        ...allowances
          .filter((a) => selectedAllowances.includes(a.id))
          .map((a) => ({
            headerName: a.name,
            field: `Total_Allowance${a.id}`,
            width: 200,
            cellStyle: { 
              textAlign: "right",
              backgroundColor: "#f2f2f2"  // Light green tint for allowance cells
            },
            valueFormatter: (params) =>
              !isNaN(params.value) ? Number(params.value).toFixed(2) : params.value,
          })),
        ...deductions
          .filter((d) => selectedDeductions.includes(d.id))
          .map((d) => ({
            headerName: d.name,
            field: `Total_Deduction${d.id}`,
            width: 150,
            cellStyle: { 
              textAlign: "right", 
              backgroundColor: "#e6e6e6"  // Light red tint for deduction cells
            },
            valueFormatter: (params) =>
              !isNaN(params.value) ? Number(params.value).toFixed(2) : params.value,
          })),
        
   ]}
            defaultColDef={defaultColDef}
            domLayout="autoHeight"
            pagination={true}
            paginationPageSize={10}
            suppressHorizontalScroll={false}/>
        </div>
        <div className="flex justify-between mb-4">
        <button onClick={exportToPDF} className="bg-blue-500 text-black p-2 rounded mb-4">Download & Print</button>
</div> </div>
    );
  };

export default Consolidation;