import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Utility function to format date as "day-month-year"
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Utility function to format numbers to two decimal places
const formatDecimal = (value) => {
  return parseFloat(value).toFixed(2);
};

function ReportPage() {
  const location = useLocation();
  const { reportData } = location.state || { reportData: [] };

  // Extract common fields and format issueDate
  const companyName = reportData[0]?.companyName || 'HASPL';
  const branchName = reportData[0]?.branchName || 'ButtRoad';
  const gradeName = reportData[0]?.gradeName || 'N/A';
  const issueDate = reportData[0]?.issueDate
    ? formatDate(reportData[0]?.issueDate)
    : 'N/A';

  // Get and format current date
  const currentDate = formatDate(new Date());

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Title and Header
    doc.setFontSize(12);
    doc.text('Generated Payslip Report', 10, 10);
    doc.setFontSize(10);
    doc.text(`Company Name: ${companyName}`, 150, 10, { align: 'right' });
    doc.text(`Print Date: ${currentDate}`, 10, 20);
    doc.text(`Branch Name: ${branchName}`, 10, 30);
    doc.text(`Grade Name: ${gradeName}`, 100, 30); // Aligned horizontally
    doc.text(`Issue Date: ${issueDate}`, 10, 40);

    // Table Data
    const tableData = reportData.map((row) => [
      row.employeeId,
      row.employeeName,
      row.allowanceName,
      formatDecimal(row.value),
      formatDate(row.issueDate),
      '__________',
    ]);

    doc.autoTable({
      startY: 50,
      head: [['Employee ID', 'Employee Name', 'Allowance Name', 'Value', 'Issue Date', 'Signature']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 160, 133] }, // Optional: add table header styling
      columnStyles: {
        0: { halign: 'center', cellWidth: 20 },
        1: { halign: 'left', cellWidth: 40 },
        2: { halign: 'left', cellWidth: 40 },
        3: { halign: 'right', cellWidth: 20 },
        4: { halign: 'center', cellWidth: 30 },
        5: { halign: 'center', cellWidth: 30 },
      },
      margin: { top: 10, left: 10, right: 10 },
    });

    doc.save('Payslip_Report.pdf');
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" sx={{ textAlign: 'right' }}>
          Company Name: {companyName}
        </Typography>
        <Typography variant="h5">Generated Payslip Report</Typography>
      </Box>

      {/* Display common fields with reduced spacing */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', mb: 2 }}>
        <Typography variant="subtitle2">Branch Name: {branchName}</Typography>
        <Typography variant="subtitle2">Grade Name: {gradeName}</Typography>
        <Typography variant="subtitle2">Print Date: {currentDate}</Typography>
      </Box>

      {/* Display the table */}
      <Box
        sx={{
          marginTop: 4,
          height: 300,
          width: '70%',
          margin: '0 auto',
        }}
        className="ag-theme-alpine"
      >
        <AgGridReact
          rowData={reportData}
          columnDefs={[
            { headerName: 'Employee ID', field: 'employeeId', suppressMenu: true },
            { headerName: 'Employee Name', field: 'employeeName', suppressMenu: true },
            { headerName: 'Allowance Name', field: 'allowanceName', suppressMenu: true },
            {
              headerName: 'Value',
              field: 'value',
              valueFormatter: (params) => formatDecimal(params.value),
              suppressMenu: true,
            },
            {
              headerName: 'Issue Date',
              field: 'issueDate',
              valueGetter: (params) => formatDate(params.data.issueDate),
              suppressMenu: true,
            },
            { headerName: 'Signature', field: 'signature', suppressMenu: true },
          ]}
          domLayout="autoHeight"
          defaultColDef={{
            flex: 1,
            minWidth: 100,
            sortable: true,
            filter: true,
          }}
          className="ag-theme-alpine"
        />
      </Box>

      {/* Buttons for Print and PDF */}
      <Box sx={{ marginTop: 3 }}>
        <Button
          variant="contained"
          color="primary"
          
          onClick={handlePrint}
          sx={{ marginRight: 2 }}
        >
          Print Report
        </Button>
        <Button variant="contained" color="secondary" onClick={handleDownloadPDF}>
          Save as PDF
        </Button>
      </Box>
    </Box>
  );
}

export default ReportPage;
