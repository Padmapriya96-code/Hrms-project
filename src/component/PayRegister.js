import React, { useState, useEffect, useRef } from "react";
import { postRequest } from "../serverconfiguration/requestcomp";
import { ServerConfig } from "../serverconfiguration/serverconfig";
import { REPORTS } from "../serverconfiguration/controllers";
import { AgGridReact } from "ag-grid-react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const PayRegister = () => {
  const [isloggedin, setisloggedin] = useState(sessionStorage.getItem("user"));
  const [company, setCompany] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedDate, setSelectedDate] = useState(null); // New state for date
  const [payRegisterData, setPayRegisterData] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [branchName, setBranchName] = useState("");
  const gridRef = useRef();

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
      if (selectedBranch && selectedDate && selectedCompany) {
        try {
          const options = { year: 'numeric', month: 'long' };
          const periodCode = selectedDate.toLocaleDateString('en-US', options);
          const data = await postRequest(ServerConfig.url, REPORTS, {
            query: `
              SELECT * 
              FROM paym_paybill 
              WHERE pn_CompanyID = ${selectedCompany}
                AND pn_BranchID = ${selectedBranch}
                AND period_code LIKE '${periodCode}%'
                AND Flag = 'F'
            `,
          });
          setPayRegisterData(data.data);
        } catch (error) {
          console.error("Error fetching pay register data:", error);
        }
      }
    }
    fetchPayRegisterData();
  }, [selectedBranch, selectedDate, selectedCompany]);

  useEffect(() => {
    if (company.length > 0 && selectedCompany) {
      const selected = company.find((comp) => comp.pn_CompanyID == selectedCompany);
      setCompanyName(selected ? selected.CompanyName : "");
    }
    if (branches.length > 0 && selectedBranch) {
      const selected = branches.find((branch) => branch.pn_BranchID == selectedBranch);
      setBranchName(selected ? selected.BranchName : "");
    }
  }, [company, selectedCompany, branches, selectedBranch]);

  const exportToPDF = () => {
    // Create PDF in landscape mode with A4 paper size
    const doc = new jsPDF("landscape", "mm", "a4");
    const gridApi = gridRef.current.api;
    if (!gridApi) {
      console.error("Grid API is not available.");
      return;
    }
    
    let companyDetails = {};
    // Get first row's data for company details (using forEachNode so it's independent of pagination)
    gridApi.forEachNode((node, index) => {
      if (index === 0 && node.data) {
        companyDetails = {
          name: node.data.CompanyName || "N/A",
          address1: node.data.Address_line1 || "",
          address2: node.data.Address_Line2 || "",
          city: node.data.City || "N/A"
        };
      }
    });

    // Title Section
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    const companyTitleWidth = doc.getStringUnitWidth(companyDetails.name) * doc.getFontSize() / doc.internal.scaleFactor;
    const companyTitleX = (doc.internal.pageSize.width - companyTitleWidth) / 2;
    doc.text(companyDetails.name, companyTitleX, 12);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const addressText = `${companyDetails.address1}, ${companyDetails.address2}, ${companyDetails.city}`;
    const addressWidth = doc.getStringUnitWidth(addressText) * doc.getFontSize() / doc.internal.scaleFactor;
    const addressX = (doc.internal.pageSize.width - addressWidth) / 2;
    doc.text(addressText, addressX, 18);

    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate().toString().padStart(2, "0")}-${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${currentDate.getFullYear()}`;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    const payRegisterTitle = "Pay Register";
    const periodCode = `Period: ${selectedDate ? selectedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : ''}`;
    const branch = `Branch: ${branchName}`;
    const printedDate = `Printed Date: ${formattedDate}`;
    const combinedText = `${payRegisterTitle} | ${periodCode} | ${branch} | ${printedDate}`;
    const combinedTextWidth = doc.getStringUnitWidth(combinedText) * doc.getFontSize() / doc.internal.scaleFactor;
    const combinedTextX = (doc.internal.pageSize.width - combinedTextWidth) / 2;
    doc.text(combinedText, combinedTextX, 24);

    // Column Definitions (unchanged)
    const columnDefs = [
      { headerName: "Emp Code", field: "EmployeeCode", align: "left", pinned: "left" },
      { headerName: "Emp Name", field: "Employee_First_Name", align: "left", pinned: "left" },
      { headerName: "Designation", field: "DesignationName", align: "left", pinned: "left" },
      { headerName: "Department", field: "DepartmentName", align: "left", pinned: "left" },
      { headerName: "Grade", field: "GradeName", align: "left", pinned: "left" },
      { headerName: "Category", field: "CategoryName", align: "left", pinned: "left" },
      { headerName: "Present Days", field: "Present_Days" },
      { headerName: "Absent Days", field: "Absent_Days", align: "left" },
      { headerName: "Week Off Days", field: "WeekOffDays", align: "left" },
      { headerName: "Holidays", field: "Holidays", align: "left" },
      { headerName: "Total Leave Days", field: "TotLeave_Days", align: "left" },
      { headerName: "Work From Home", field: "WorkFromHome", align: "left" },
      { headerName: "Halfday", field: "Halfday", align: "left" },
      { headerName: "Paid Days", field: "Paid_Days", align: "right" },
      { headerName: "OT Hours", field: "ot_hrs", align: "right" },
      { headerName: "OT Value", field: "ot_value", align: "right" },
      { headerName: "OT Amount", field: "ot_amt", align: "right", format: true },
      { headerName: "Attendance Bonus", field: "Att_bonus", align: "right", format: true },
      { headerName: "Allowance 1", field: "Allowance1", align: "right" },
      { headerName: "Value 1", field: "value1", align: "right", format: true },
      { headerName: "Allowance 2", field: "Allowance2", align: "right" },
      { headerName: "Value 2", field: "value2", align: "right", format: true },
      { headerName: "Allowance 3", field: "Allowance3", align: "right" },
      { headerName: "Value 3", field: "value3", align: "right", format: true },
      { headerName: "Allowance 4", field: "Allowance4", align: "right" },
      { headerName: "Value 4", field: "value4", align: "right", format: true },
      { headerName: "Allowance 5", field: "Allowance5", align: "right" },
      { headerName: "Value 5", field: "value5", align: "right", format: true },
      { headerName: "Allowance 6", field: "Allowance6", align: "right" },
      { headerName: "Value 6", field: "value6", align: "right", format: true },
      { headerName: "Allowance 7", field: "Allowance7", align: "right" },
      { headerName: "Value 7", field: "value7", align: "right", format: true },
      { headerName: "Allowance 8", field: "Allowance8", align: "right" },
      { headerName: "Value 8", field: "value8", align: "right", format: true },
      { headerName: "Allowance 9", field: "Allowance9", align: "right" },
      { headerName: "Value 9", field: "value9", align: "right", format: true },
      { headerName: "Allowance 10", field: "Allowance10", align: "right" },
      { headerName: "Value 10", field: "value10", align: "right", format: true },
      { headerName: "Deduction 1", field: "Deduction1", align: "right" },
      { headerName: "Value A1", field: "valueA1", align: "right", format: true },
      { headerName: "Deduction 2", field: "Deduction2", align: "right" },
      { headerName: "Value A2", field: "valueA2", align: "right", format: true },
      { headerName: "Deduction 3", field: "Deduction3", align: "right" },
      { headerName: "Value A3", field: "valueA3", align: "right", format: true },
      { headerName: "Deduction 4", field: "Deduction4", align: "right" },
      { headerName: "Value A4", field: "valueA4", align: "right", format: true },
      { headerName: "Deduction 5", field: "Deduction5", align: "right" },
      { headerName: "Value A5", field: "valueA5", align: "right", format: true },
      { headerName: "Deduction 6", field: "Deduction6", align: "right" },
      { headerName: "Value A6", field: "valueA6", align: "right", format: true },
      { headerName: "Deduction 7", field: "Deduction7", align: "right" },
      { headerName: "Value A7", field: "valueA7", align: "right", format: true },
      { headerName: "Deduction 8", field: "Deduction8", align: "right" },
      { headerName: "Value A8", field: "valueA8", align: "right", format: true },
      { headerName: "Deduction 9", field: "Deduction9", align: "right" },
      { headerName: "Value A9", field: "valueA9", align: "right", format: true },
      { headerName: "Deduction 10", field: "Deduction10", align: "right" },
      { headerName: "Value A10", field: "valueA10", align: "right", format: true },
      { headerName: "Earned Basic", field: "Earned_Basic", align: "right", format: true },
      { headerName: "Earned Amt", field: "Earn_Amount", align: "right", format: true },
      { headerName: "Gross Salary", field: "Gross_salary", align: "right", format: true },
      { headerName: "Total Deductions", field: "Ded_Amount", align: "right", format: true },
      { headerName: "Net Pay", field: "NetPay", align: "right", format: true }
    ];

    // Prepare headers and row data from full grid data
    const headers = columnDefs.map(col => col.headerName);
    const rowData = [];
    gridApi.forEachNode((node) => {
      if (node.data) {
        rowData.push(
          columnDefs.map(col => {
            let value = node.data[col.field];
            return col.format
              ? (value !== null && value !== undefined ? Number(value).toFixed(2) : "NULL")
              : (value || "NULL");
          })
        );
      }
    });

    // Generate table with autoTable
    doc.autoTable({
      startY: 30,
      head: [headers],
      body: rowData,
      theme: "grid",
      styles: { fontSize: 5, cellPadding: 0.5 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, halign: "center" },
      columnStyles: columnDefs.reduce((styles, col, index) => {
        styles[index] = { halign: col.align };
        return styles;
      }, {}),
      margin: { top: 10 }
    });

    // Enable autoPrint (adds printing instructions to the PDF)
    doc.autoPrint();
    
    // Create a Blob from the PDF and generate a Blob URL
    const pdfBlob = doc.output("blob");
    const blobUrl = URL.createObjectURL(pdfBlob);
    
    // Trigger the download by programmatically clicking an anchor element
    const downloadLink = document.createElement("a");
    downloadLink.href = blobUrl;
    downloadLink.download = "pay_register.pdf";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    // Open the PDF in a new window to trigger the print dialog
    window.open(blobUrl, "_blank");
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Pay Register</h2>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <select
          style={{ marginRight: '10px' }}
          onChange={(e) => setSelectedCompany(e.target.value)}
          className="border p-2 rounded"
          disabled={!isloggedin}>
          <option value="">Select Company</option>
          {company.map((comp) => (
            <option key={comp.pn_CompanyID} value={comp.pn_CompanyID}>
              {comp.CompanyName}
            </option>
          ))}
        </select>
        <select
          style={{ marginRight: '10px' }}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="border p-2 rounded"
          disabled={!selectedCompany}>
          <option value="">Select Branch</option>
          {branches.map((branch) => (
            <option key={branch.pn_BranchID} value={branch.pn_BranchID}>
              {branch.BranchName}
            </option>
          ))}
        </select>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          className="border p-2 rounded"
          placeholderText="Select Date"
          dateFormat="MMMM"
          showMonthYearPicker
          required
        />
      </div>
      <button onClick={exportToPDF} className="bg-blue-500 text-black p-2 rounded mb-4">
        Download & Print
      </button>
      <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
        <AgGridReact
          ref={gridRef}
          rowData={payRegisterData}
          domLayout="autoHeight"
          columnDefs={[
            { headerName: "Employee Code", field: "EmployeeCode", width: 120, cellStyle: { textAlign: "left" }, pinned: "left" },
            { headerName: "Employee Name", field: "Employee_First_Name", width: 200, cellStyle: { textAlign: "left" }, pinned: "left" },
            { headerName: "Designation", field: "DesignationName", width: 120, cellStyle: { textAlign: "left" }, pinned: "left" },
            { headerName: "Department", field: "DepartmentName", width: 120, cellStyle: { textAlign: "left" }, pinned: "left" },
            { headerName: "Grade", field: "GradeName", width: 120, cellStyle: { textAlign: "left" }, pinned: "left" },
            { headerName: "Category", field: "CategoryName", width: 120, cellStyle: { textAlign: "left" }, pinned: "left" },
            { headerName: "Paid Days", field: "Paid_Days", width: 90, cellStyle: { textAlign: "left" } },
            { headerName: "Work From Home", field: "WorkFromHome", width: 120, cellStyle: { textAlign: "left" } },
            { headerName: "Halfday", field: "Halfday", width: 120, cellStyle: { textAlign: "left" } },
            { headerName: "Present Days", field: "Present_Days", width: 120, cellStyle: { textAlign: "left" } },
            { headerName: "Absent Days", field: "Absent_Days", width: 120, cellStyle: { textAlign: "left" } },
            { headerName: "Week Off Days", field: "WeekOffDays", width: 120, cellStyle: { textAlign: "left" } },
            { headerName: "Holidays", field: "Holidays", width: 120, cellStyle: { textAlign: "left" } },
            { headerName: "Total Leave Days", field: "TotLeave_Days", width: 120, cellStyle: { textAlign: "left" } },
            { headerName: "OT Hours", field: "ot_hrs", width: 120, cellStyle: { textAlign: "left" } },
            { headerName: "OT Value", field: "ot_value", width: 120, cellStyle: { textAlign: "left" } },
            { headerName: "OT Amount", field: "ot_amt", width: 120, valueFormatter: (params) => (params.value !== null && params.value !== undefined ? Number(params.value).toFixed(2) : "NULL"), cellStyle: { textAlign: "right" } },
            { headerName: "Attendance Bonus", field: "Att_bonus", width: 120, valueFormatter: (params) => (params.value !== null && params.value !== undefined ? Number(params.value).toFixed(2) : "NULL"), cellStyle: { textAlign: "right" } },
            { headerName: "Allowance 1", field: "Allowance1", width: 120, cellStyle: { textAlign: "left" } },
            { headerName: "Value 1", field: "value1", width: 120, valueFormatter: (params) => (params.value !== null && params.value !== undefined ? Number(params.value).toFixed(2) : "NULL"), cellStyle: { textAlign: "right" } },
            { headerName: "Allowance 2", field: "Allowance2", width: 120, cellStyle: { textAlign: "left" } },
            { headerName: "Value 2", field: "value2", width: 120, valueFormatter: (params) => (params.value !== null && params.value !== undefined ? Number(params.value).toFixed(2) : "NULL"), cellStyle: { textAlign: "right" } },
            { headerName: "Allowance 3", field: "Allowance3", width: 120, cellStyle: { textAlign: "left" } },
            { headerName: "Value 3", field: "value3", width: 120, valueFormatter: (params) => (params.value !== null && params.value !== undefined ? Number(params.value).toFixed(2) : "NULL"), cellStyle: { textAlign: "right" } },
            { headerName: "Allowance 4", field: "Allowance4", width: 120, cellStyle: { textAlign: "left" } },
            { headerName: "Value 4", field: "value4", width: 120, valueFormatter: (params) => (params.value !== null && params.value !== undefined ? Number(params.value).toFixed(2) : "NULL"), cellStyle: { textAlign: "right" } },
            { headerName: "Allowance 5", field: "Allowance5", width: 120, cellStyle: { textAlign: "left" } },
            { headerName: "Value 5", field: "value5", width: 120, valueFormatter: (params) => (params.value !== null && params.value !== undefined ? Number(params.value).toFixed(2) : "NULL"), cellStyle: { textAlign: "right", width: 120 } },
            { headerName: "Allowance 6", field: "Allowance6", width: 120, cellStyle: { textAlign: "left" } },
            { headerName: "Value 6", field: "value6", width: 120, valueFormatter: (params) => (params.value !== null && params.value !== undefined ? Number(params.value).toFixed(2) : "NULL"), cellStyle: { textAlign: "right", width: 120 } },
            { headerName: "Allowance 7", field: "Allowance7", width: 120, cellStyle: { textAlign: "left" } },
            { headerName: "Value 7", field: "value7", width: 120, valueFormatter: (params) => (params.value !== null && params.value !== undefined ? Number(params.value).toFixed(2) : "NULL"), cellStyle: { textAlign: "right", width: 120 } },
            { headerName: "Allowance 8", field: "Allowance8", width: 120, cellStyle: { textAlign: "left" } },
            { headerName: "Value 8", field: "value8", width: 120, valueFormatter: (params) => (params.value !== null && params.value !== undefined ? Number(params.value).toFixed(2) : "NULL"), cellStyle: { textAlign: "right", width: 120 } },
            { headerName: "Allowance 9", field: "Allowance9", width: 120, cellStyle: { textAlign: "left" } },
            { headerName: "Value 9", field: "value9", width: 120, valueFormatter: (params) => (params.value !== null && params.value !== undefined ? Number(params.value).toFixed(2) : "NULL"), cellStyle: { textAlign: "right", width: 120 } },
            { headerName: "Allowance 10", field: "Allowance10", width: 120, cellStyle: { textAlign: "left" } },
            { headerName: "Value 10", field: "value10", width: 120, valueFormatter: (params) => (params.value !== null && params.value !== undefined ? Number(params.value).toFixed(2) : "NULL"), cellStyle: { textAlign: "right", width: 120 } },
            { headerName: "Deduction 1", field: "Deduction1", width: 120, cellStyle: { textAlign: "left" } },
            { headerName: "Value A1", field: "valueA1", width: 120, valueFormatter: (params) => (params.value !== null && params.value !== undefined ? Number(params.value).toFixed(2) : "NULL"), cellStyle: { textAlign: "right", width: 120 } },
            { headerName: "Deduction 2", field: "Deduction2", width: 120, cellStyle: { textAlign: "left" } },
            { headerName: "Value A2", field: "valueA2", width: 120, valueFormatter: (params) => (params.value !== null && params.value !== undefined ? Number(params.value).toFixed(2) : "NULL"), cellStyle: { textAlign: "right", width: 120 } },
            { headerName: "Deduction 3", field: "Deduction3", width: 120, cellStyle: { textAlign: "left" } },
            { headerName: "Value A3", field: "valueA3", width: 120, valueFormatter: (params) => (params.value !== null && params.value !== undefined ? Number(params.value).toFixed(2) : "NULL"), cellStyle: { textAlign: "right", width: 120 } },
            { headerName: "Deduction 4", field: "Deduction4", width: 120, cellStyle: { textAlign: "left" } },
            { headerName: "Value A4", field: "valueA4", width: 120, valueFormatter: (params) => (params.value !== null && params.value !== undefined ? Number(params.value).toFixed(2) : "NULL"), cellStyle: { textAlign: "right", width: 120 } },
            { headerName: "Deduction 5", field: "Deduction5", width: 120, cellStyle: { textAlign: "left" } },
            { headerName: "Value A5", field: "valueA5", width: 120, valueFormatter: (params) => (params.value !== null && params.value !== undefined ? Number(params.value).toFixed(2) : "NULL"), cellStyle: { textAlign: "right", width: 120 } },
            { headerName: "Deduction 6", field: "Deduction6", width: 120, cellStyle: { textAlign: "left" } },
            { headerName: "Value A6", field: "valueA6", width: 120, valueFormatter: (params) => (params.value !== null && params.value !== undefined ? Number(params.value).toFixed(2) : "NULL"), cellStyle: { textAlign: "right", width: 120 } },
            { headerName: "Deduction 7", field: "Deduction7", width: 120, cellStyle: { textAlign: "left" } },
            { headerName: "Value A7", field: "valueA7", width: 120, valueFormatter: (params) => (params.value !== null && params.value !== undefined ? Number(params.value).toFixed(2) : "NULL"), cellStyle: { textAlign: "right", width: 120 } },
            { headerName: "Deduction 8", field: "Deduction8", width: 120, cellStyle: { textAlign: "left" } },
            { headerName: "Value A8", field: "valueA8", width: 120, valueFormatter: (params) => (params.value !== null && params.value !== undefined ? Number(params.value).toFixed(2) : "NULL"), cellStyle: { textAlign: "right", width: 120 } },
            { headerName: "Deduction 9", field: "Deduction9", width: 120, cellStyle: { textAlign: "left" } },
            { headerName: "Value A9", field: "valueA9", width: 120, valueFormatter: (params) => (params.value !== null && params.value !== undefined ? Number(params.value).toFixed(2) : "NULL"), cellStyle: { textAlign: "right", width: 120 } },
            { headerName: "Deduction 10", field: "Deduction10", width: 120, cellStyle: { textAlign: "left" } },
            { headerName: "Value A10", field: "valueA10", width: 120, valueFormatter: (params) => (params.value !== null && params.value !== undefined ? Number(params.value).toFixed(2) : "NULL"), cellStyle: { textAlign: "right", width: 120 } },
            { headerName: "Earned Basic", field: "Earned_Basic", width: 120, valueFormatter: (params) => (params.value !== null && params.value !== undefined ? Number(params.value).toFixed(2) : "NULL"), cellStyle: { textAlign: "right" } },
            { headerName: "Earned Amount", field: "Earn_Amount", width: 120, valueFormatter: (params) => (params.value !== null && params.value !== undefined ? Number(params.value).toFixed(2) : "NULL"), cellStyle: { textAlign: "right" } },
            { headerName: "Gross Salary", field: "Gross_salary", width: 120, valueFormatter: (params) => (params.value !== null && params.value !== undefined ? Number(params.value).toFixed(2) : "NULL"), cellStyle: { textAlign: "right", width: 120 } },
            { headerName: "Deducted Amount", field: "Ded_Amount", valueFormatter: (params) => (params.value !== null && params.value !== undefined ? Number(params.value).toFixed(2) : "NULL"), cellStyle: { textAlign: "right" }, width: 160 },
            { headerName: "Net Pay", field: "NetPay", width: 120, valueFormatter: (params) => (params.value !== null && params.value !== undefined ? Number(params.value).toFixed(2) : "NULL"), cellStyle: { textAlign: "right" } },
          ]}
        />
      </div>
    </div>
  );
};

export default PayRegister;
