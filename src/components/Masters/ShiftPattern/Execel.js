import React, { useState } from "react";
import {
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Box,
} from "@mui/material";
import * as XLSX from "xlsx";
import { postRequest } from "../../../serverconfiguration/requestcomp";
import { ServerConfig } from "../../../serverconfiguration/serverconfig";
import { SAVE } from "../../../serverconfiguration/controllers";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Sidenav from "../../Home Page/Sidenav";
import Navbar from "../../Home Page/Navbar";
import { toast } from "react-toastify";

const EmployeeBulkExcelSheetUpload = () => {
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const databaseName = sessionStorage.getItem("databaseName");
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setData(jsonData);
      };
      reader.readAsBinaryString(selectedFile);
    }
  };

  const handleSave = async () => {
    try {
      // Check for duplicate EmployeeCodes
      const employeeCodes = data.map((row) => row.EmployeeCode);
      const duplicateCodes = employeeCodes.filter(
        (code, index) => employeeCodes.indexOf(code) !== index
      );

      if (duplicateCodes.length > 0) {
        alert(
          `Duplicate Employee Code(s) found: ${Array.from(
            new Set(duplicateCodes)
          ).join(", ")}`
        );
        return; // Stop the save operation
      }

      const employeeQueries = data
        .map((row) => {
          return `
          INSERT INTO [${databaseName}].[dbo].[paym_Employee] (
            [pn_CompanyID], [pn_BranchID], [EmployeeCode], [Employee_First_Name],
            [Employee_Middle_Name], [Employee_Last_Name], [DateofBirth], [Password],
            [Gender], [status], [Employee_Full_Name], [Readerid], [OT_Eligible],
            [Pfno], [Esino], [OT_calc], [CTC], [basic_salary], [Bank_code],
            [Bank_Name], [Branch_Name], [Account_Type], [MICR_code], [IFSC_Code],
            [Other_Info], [Reporting_person], [ReportingID], [Reporting_email],
            [Pan_no], [salary_type], [TDS_Applicable], [Flag], [role],
            [Blood_Group], [Phone_No], [Alternate_Phone_No], [permanent_address],
            [Aadhar_Card], [Current_Address], [accountNo], [Father_Name], [Address],
            [Email], [Alternate_Email], [Grade], [Overall_Experience], [Confirm_Password],
            [Salutation], [Marital_status], [Religion], [Nationality], [Mothers_Name],
            [Spouse_Name], [No_of_Children], [ID_Proof_Type], [Others_Specify],
            [ID_Card_No], [Current_HouseNo], [Permanent_HouseNo], [Current_AddressLine2],
            [Current_City], [Current_State], [Current_Pincode], [Permanent_AddressLine2],
            [Permanent_City], [Permanent_State], [Permanent_Pincode], [Training_Attended],
            [Training_Duration], [Position_Held], [Salary], [Person_Name], [RelationShip],
            [Contact_EmailId], [Contact_PhoneNo]
          ) VALUES (
            ${row.pn_CompanyID}, ${row.pn_BranchID}, '${row.EmployeeCode}', '${row.Employee_First_Name}',
            '${row.Employee_Middle_Name}', '${row.Employee_Last_Name}', '${row.DateofBirth}', '${row.Password}',
            '${row.Gender}', '${row.status}', '${row.Employee_Full_Name}', ${row.Readerid}, '${row.OT_Eligible}',
            '${row.Pfno}', '${row.Esino}', ${row.OT_calc}, ${row.CTC}, ${row.basic_salary}, '${row.Bank_code}',
            '${row.Bank_Name}', '${row.Branch_Name}', '${row.Account_Type}', '${row.MICR_code}', '${row.IFSC_Code}',
            '${row.Other_Info}', '${row.Reporting_person}', ${row.ReportingID}, '${row.Reporting_email}',
            '${row.Pan_no}', '${row.salary_type}', '${row.TDS_Applicable}', '${row.Flag}', ${row.role},
            '${row.Blood_Group}', '${row.Phone_No}', '${row.Alternate_Phone_No}', '${row.permanent_address}',
            '${row.Aadhar_Card}', '${row.Current_Address}', '${row.accountNo}', '${row.Father_Name}', '${row.Address}',
            '${row.Email}', '${row.Alternate_Email}', '${row.Grade}', ${row.Overall_Experience}, '${row.Confirm_Password}',
            '${row.Salutation}', '${row.Marital_status}', '${row.Religion}', '${row.Nationality}', '${row.Mothers_Name}',
            '${row.Spouse_Name}', ${row.No_of_Children}, '${row.ID_Proof_Type}', '${row.Others_Specify}',
            '${row.ID_Card_No}', '${row.Current_HouseNo}', '${row.Permanent_HouseNo}', '${row.Current_AddressLine2}',
            '${row.Current_City}', '${row.Current_State}', ${row.Current_Pincode}, '${row.Permanent_AddressLine2}',
            '${row.Permanent_City}', '${row.Permanent_State}', ${row.Permanent_Pincode}, '${row.Training_Attended}',
            ${row.Training_Duration}, '${row.Position_Held}', ${row.Salary}, '${row.Person_Name}', '${row.RelationShip}',
            '${row.Contact_EmailId}', ${row.Contact_PhoneNo}
          )
        `;
        })
        .join("; ");

      // Extract unique divisions
      const uniqueDivisions = Array.from(
        new Set(
          data.map(
            (row) =>
              `${row.pn_CompanyID}, ${row.pn_BranchID}, '${row.v_DivisionName}', '${row.status}'`
          )
        )
      );

      const divisionQueries = uniqueDivisions
        .map((division) => {
          const [companyId, branchId, divisionName, status] =
            division.split(", ");
          return `
          INSERT INTO [${databaseName}].[dbo].[paym_Division] (
            [pn_CompanyID], [BranchID], [v_DivisionName], [status]
          ) VALUES (
            ${companyId}, ${branchId}, ${divisionName}, ${status}
          )
        `;
        })
        .join("; ");

      // Extract unique departments
      const uniqueDepartments = Array.from(
        new Set(
          data.map(
            (row) =>
              `${row.pn_CompanyID}, ${row.pn_BranchID}, '${row.v_DepartmentName}', '${row.status}'`
          )
        )
      );

      const departmentQueries = uniqueDepartments
        .map((department) => {
          const [companyId, branchId, departmentName, status] =
            department.split(", ");
          return `
        INSERT INTO [${databaseName}].[dbo].[paym_Department] (
          [pn_CompanyID], [pn_BranchID], [v_DepartmentName], [status]
        ) VALUES (
          ${companyId}, ${branchId}, ${departmentName}, ${status}
        )
      `;
        })
        .join("; ");

      // Extract unique designations
      const uniqueDesignations = Array.from(
        new Set(
          data.map(
            (row) =>
              `${row.pn_CompanyID}, ${row.pn_BranchID}, '${row.v_DesignationName}', '${row.Authority}', '${row.status}'`
          )
        )
      );

      const designationQueries = uniqueDesignations
        .map((designation) => {
          const [companyId, branchId, designationName, Authority, status] =
            designation.split(", ");
          return `
        INSERT INTO [${databaseName}].[dbo].[paym_Designation] (
          [pn_CompanyID], [BranchID], [v_DesignationName], [Authority], [status]
        ) VALUES (
          ${companyId}, ${branchId}, ${designationName}, ${Authority}, ${status}
        )
      `;
        })
        .join("; ");

      // Extract unique grades
      const uniqueGrades = Array.from(
        new Set(
          data.map(
            (row) =>
              `${row.pn_CompanyID}, ${row.pn_BranchID}, '${row.v_GradeName}', '${row.status}'`
          )
        )
      );

      const gradeQueries = uniqueGrades
        .map((grade) => {
          const [companyId, branchId, gradeName, status] = grade.split(", ");
          return `
        INSERT INTO [${databaseName}].[dbo].[paym_Grade] (
          [pn_CompanyID], [BranchID], [v_GradeName], [status]
        ) VALUES (
          ${companyId}, ${branchId}, ${gradeName}, ${status}
        )
      `;
        })
        .join("; ");

      // Extract unique shifts
      const uniqueShifts = Array.from(
        new Set(
          data.map(
            (row) =>
              `${row.pn_CompanyID}, ${row.pn_BranchID}, '${row.v_ShiftName}', '${row.v_ShiftFrom}', '${row.v_ShiftTo}', '${row.status}', '${row.v_ShiftCategory}'`
          )
        )
      );

      const shiftQueries = uniqueShifts
        .map((shift) => {
          const [
            companyId,
            branchId,
            shiftName,
            shiftFrom,
            shiftTo,
            status,
            shiftCategory,
          ] = shift.split(", ");
          return `
        INSERT INTO [${databaseName}].[dbo].[paym_Shift] (
          [pn_CompanyID], [BranchID], [v_ShiftName], [v_ShiftFrom], [v_ShiftTo], [status], [v_ShiftCategory]
        ) VALUES (
          ${companyId}, ${branchId}, ${shiftName}, ${shiftFrom}, ${shiftTo}, ${status}, ${shiftCategory}
        )
      `;
        })
        .join("; ");

      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(
          data.map(
            (row) =>
              `${row.pn_CompanyID}, ${row.pn_BranchID}, '${row.v_CategoryName}', '${row.status}'`
          )
        )
      );

      const categoryQueries = uniqueCategories
        .map((category) => {
          const [companyId, branchId, categoryName, status] =
            category.split(", ");
          return `
        INSERT INTO [${databaseName}].[dbo].[paym_Category] (
          [pn_CompanyID], [BranchID], [v_CategoryName], [status]
        ) VALUES (
          ${companyId}, ${branchId}, ${categoryName}, ${status}
        )
      `;
        })
        .join("; ");

      // Extract unique JobStatus
      const uniqueJobStatus = Array.from(
        new Set(
          data.map(
            (row) =>
              `${row.pn_CompanyID}, ${row.pn_BranchID}, '${row.v_JobStatusName}', '${row.status}'`
          )
        )
      );

      const jobstatusQueries = uniqueJobStatus
        .map((jobstatus) => {
          const [companyId, branchId, v_JobStatusName, status] =
            jobstatus.split(", ");
          return `
        INSERT INTO [${databaseName}].[dbo].[paym_JobStatus]
           ([pn_CompanyID]
           ,[BranchID]
           ,[v_JobStatusName]
           ,[status])
          VALUES (
          ${companyId}, ${branchId}, ${v_JobStatusName}, ${status}
        )
      `;
        })
        .join("; ");

      // Extract unique levels
      const uniqueLevels = Array.from(
        new Set(
          data.map(
            (row) =>
              `${row.pn_CompanyID}, ${row.pn_BranchID}, '${row.v_LevelName}', '${row.status}'`
          )
        )
      );

      const levelQueries = uniqueLevels
        .map((level) => {
          const [companyId, branchId, levelName, status] = level.split(", ");
          return `
        INSERT INTO [${databaseName}].[dbo].[paym_Level] (
          [pn_CompanyID], [BranchID], [v_LevelName], [status]
        ) VALUES (
          ${companyId}, ${branchId}, ${levelName}, ${status}
        )
      `;
        })
        .join("; ");

      // Combine both queries
      const combinedQueries = `${divisionQueries}; ${departmentQueries}; ${designationQueries}; ${gradeQueries}; ${shiftQueries}; ${categoryQueries}; ${jobstatusQueries}; ${levelQueries}; ${employeeQueries}`;

      // Log the combined queries for debugging
      console.log("Combined Queries: ", combinedQueries);

      const response = await postRequest(ServerConfig.url, SAVE, {
        query: combinedQueries,
      });
      if (response && response.status === 200) {
        toast.info("Data saved successfully", {
          position: "top-center",
          autoClose: 1000,
        });
      } else {
        toast.error("Failed to save data", {
          position: "top-center",
          autoClose: 1000,
        });
      }
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error("An error occurred: " + error.message, {
        position: "top-center",
        autoClose: 1000,
      });
    }
  };

  return (
    <Grid item xs={12}>
      <div style={{ backgroundColor: "#f5f5f5" }}>
        <Navbar />
        <Box height={30} />
        <Box sx={{ display: "flex" }}>
          <Sidenav />
          <Grid
            item
            xs={12}
            sm={10}
            md={9}
            lg={8}
            xl={7}
            sx={{
              padding: { xs: "20px", sm: "40px" },
              overflowY: "auto",
              margin: "0 auto",
            }}
          >
            <AppBar
              position="static"
              sx={{ width: "100%", marginTop: "40px", minHeight: "60px" }}
            >
              <Toolbar sx={{ justifyContent: "left", height: "100%" }}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    textAlign: "left",
                    fontWeight: "bold",
                    color: "white",
                    lineHeight: "60px",
                  }}
                >
                  UPLOAD EXCEL FILE
                </Typography>
              </Toolbar>
            </AppBar>
            <Paper
              elevation={3}
              sx={{
                p: 3, // padding
                display: "flex",
                alignItems: "center",
                gap: 2, // space between items
                maxWidth: 600, // optional max width for better layout
              }}
            >
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                style={{ flexGrow: 1 }} // allow input to grow and fill available space
              />
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={data.length === 0}
              >
                Save Data
              </Button>
            </Paper>
            {data.length > 0 && (
              <TableContainer component={Paper} sx={{ marginTop: "30px" }}>
                <Table>
                  <TableHead style={{ backgroundColor: "#e3e3e3" }}>
                    <TableRow>
                      {Object.keys(data[0]).map((key) => (
                        <TableCell key={key}>{key}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((row, index) => (
                      <TableRow key={index}>
                        {Object.values(row).map((value, idx) => (
                          <TableCell key={idx}>{value}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Grid>
        </Box>
      </div>
    </Grid>
  );
};

export default EmployeeBulkExcelSheetUpload;












// // EmployeeBulkExcelSheetUploadV2.jsx
// import React, { useState } from "react";
// import {
//   Button,
//   Grid,
//   Paper,
//   Box,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
// } from "@mui/material";
// import * as XLSX from "xlsx";
// import { postRequest } from "../../../serverconfiguration/requestcomp";
// import { ServerConfig } from "../../../serverconfiguration/serverconfig";
// import { SAVE } from "../../../serverconfiguration/controllers";
// import { toast } from "react-toastify";

// /**
//  * Bulk uploader + template generator for updated table schemas.
//  *
//  * Expectation: single-sheet uploads. Each row must contain all employee fields
//  * (paym_Employee fields + paym_employee_profile1 fields + login fields) plus
//  * optional master columns used to create master rows (division, department, etc).
//  *
//  * IMPORTANT: This component generates SQL text and sends it to the backend endpoint
//  * that executes the SQL. Make sure the backend executes the incoming SQL batch
//  * in a safe environment. Consider validating in backend and using parameterized queries.
//  */

// const EmployeeBulkExcelSheetUploadV2 = () => {
//   const [data, setData] = useState([]);
//   const [fileName, setFileName] = useState("");
//   const databaseName = sessionStorage.getItem("databaseName") || "YourDB";

//   const handleFileChange = (e) => {
//     const f = e.target.files[0];
//     if (!f) return;
//     setFileName(f.name);
//     const reader = new FileReader();
//     reader.onload = (ev) => {
//       const wb = XLSX.read(ev.target.result, { type: "binary" });
//       const sheet = wb.Sheets[wb.SheetNames[0]];
//       const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });
//       setData(json);
//     };
//     reader.readAsBinaryString(f);
//   };

//   // Helper to escape SQL strings & detect numbers/nulls (similar to manual form)
//   const sqlValue = (value) => {
//     if (value === null || value === undefined || value === "") return "NULL";
//     // if looks like number, return raw (but keep caution)
//     if (
//       typeof value === "number" ||
//       (!isNaN(value) && value.toString().trim() !== "")
//     ) {
//       return value;
//     }
//     // escape single quotes
//     return `'${value.toString().replace(/'/g, "''")}'`;
//   };

//   // Build master insertion arrays (unique)
//   const extractUnique = (rows, keyBuilder) => {
//     const set = new Set();
//     rows.forEach((r) => set.add(keyBuilder(r)));
//     return Array.from(set).filter(
//       (x) => x && x !== "undefined" && x !== "NULL"
//     );
//   };

//   // Template generator: creates an XLSX workbook and triggers download
//   const downloadTemplate = (sheetName, columns) => {
//     const headerRow = {};
//     columns.forEach((c) => (headerRow[c] = ""));
//     const wb = XLSX.utils.book_new();
//     const ws = XLSX.utils.json_to_sheet([headerRow]);
//     XLSX.utils.book_append_sheet(wb, ws, sheetName);
//     XLSX.writeFile(wb, `${sheetName}_template.xlsx`);
//   };

//   // Pre-defined column lists per your new schema (employee sheet includes profile/login)
//   const employeeColumns = [
//     // paym_Employee fields (as provided)
//     "image_base64",
//     "pn_CompanyID",
//     "pn_BranchID",
//     "pn_EmployeeID", // optional (if provided will be ignored as identity)
//     "EmployeeCode",
//     "Employee_First_Name",
//     "Employee_Middle_Name",
//     "Employee_Last_Name",
//     "DateofBirth",
//     "Password",
//     "Gender",
//     "status",
//     "Employee_Full_Name",
//     "Readerid",
//     "OT_Eligible",
//     "Pfno",
//     "Esino",
//     "OT_calc",
//     "CTC",
//     "basic_salary",
//     "Bank_code",
//     "Bank_Name",
//     "Branch_Name",
//     "Account_Type",
//     "MICR_code",
//     "IFSC_Code",
//     "Other_Info",
//     "Reporting_person",
//     "ReportingID",
//     "Reporting_email",
//     "Pan_no",
//     "salary_type",
//     "TDS_Applicable",
//     "Flag",
//     "role",
//     "accountNo",
//     "Blood_Group",
//     "Phone_No",
//     "Alternate_Phone_No",
//     "permanent_address",
//     "Aadhar_Card",
//     "Current_Address",
//     "Father_Name",
//     "Email",
//     "Alternate_Email",
//     "Grade",
//     "Overall_Experience",
//     // profile / extended fields
//     "HighestQualification",
//     "UniversityName",
//     "YearOfPassing",
//     "Certifications",
//     "Skills",
//     "UAN",
//     "PaymentMode",
//     "PassportNumber",
//     "VisaDetails",
//     "JoiningDate",
//     "ExitReason",
//     "PreviousCompany",
//     "PreviousDesignation",
//     "PreviousEmploymentDuration",
//     "ReasonForLeaving",
//     "PerformanceRating",
//     "TrainingRecords",
//     "DisciplinaryActions",
//     "Awards",
//     "VehicleDetails",
//     "HealthInsuranceDetails",
//     "NomineeDetails",
//     "Asset_Name",
//     "Asset_SerialNumber",
//     "NomineePhoneno",
//     "NomineeRelationship",
//     "ExitDate",
//     "AssetType",
//     // fields used for master creation (optional)
//     "v_DivisionName",
//     "v_DepartmentName",
//     "v_DesignationName",
//     "Authority",
//     "v_GradeName",
//     "v_ShiftName",
//     "start_time",
//     "break_time_out",
//     "break_time_in",
//     "end_time",
//     "shift_indicator",
//     "Shift_Type",
//     "v_CategoryName",
//     "v_JobStatusName",
//     "v_LevelName",
//   ];

//   const divisionCols = ["pn_CompanyID", "BranchID", "v_DivisionName", "status"];
//   const departmentCols = [
//     "pn_CompanyID",
//     "pn_BranchID",
//     "v_DepartmentName",
//     "status",
//   ];
//   const designationCols = [
//     "pn_CompanyID",
//     "BranchID",
//     "v_DesignationName",
//     "Authority",
//     "status",
//   ];
//   const gradeCols = ["pn_CompanyID", "BranchID", "v_GradeName", "status"];
//   const shiftCols = [
//     "pn_CompanyID",
//     "pn_branchid",
//     "v_ShiftName",
//     "start_time",
//     "break_time_out",
//     "break_time_in",
//     "end_time",
//     "shift_indicator",
//     "Shift_Type",
//     "status",
//   ];
//   const categoryCols = ["pn_CompanyID", "BranchID", "v_CategoryName", "status"];
//   const jobStatusCols = [
//     "pn_CompanyID",
//     "BranchID",
//     "v_JobStatusName",
//     "status",
//   ];
//   const levelCols = ["pn_CompanyID", "BranchID", "v_LevelName", "status"];

//   const handleDownloadAllTemplates = () => {
//     // Employee single sheet (Option A)
//     downloadTemplate("paym_Employee", employeeColumns);

//     // Masters (we provide individual buttons in UI too but this lets user get them quickly)
//     // Could create a workbook with multiple sheets — but better to give separate files per your request
//   };

//   const handleSave = async () => {
//     if (!data || data.length === 0) {
//       toast.warn("No data to save");
//       return;
//     }

//     try {
//       // Basic duplicate EmployeeCode check
//       const codes = data.map(
//         (r) => r.EmployeeCode && r.EmployeeCode.toString().trim()
//       );
//       const dup = codes.filter((c, i) => c && codes.indexOf(c) !== i);
//       if (dup.length) {
//         toast.error(
//           `Duplicate EmployeeCode(s): ${Array.from(new Set(dup)).join(", ")}`
//         );
//         return;
//       }

//       // Create unique master entries from rows
//       // Division
//       const uniqueDivisions = extractUnique(data, (r) =>
//         r.v_DivisionName
//           ? `${r.pn_CompanyID}||${r.pn_BranchID}||${r.v_DivisionName}||${
//               r.status || "A"
//             }`
//           : null
//       ).map((s) => {
//         const [pn_CompanyID, BranchID, v_DivisionName, status] = s.split("||");
//         return { pn_CompanyID, BranchID, v_DivisionName, status };
//       });

//       // Department
//       const uniqueDepartments = extractUnique(data, (r) =>
//         r.v_DepartmentName
//           ? `${r.pn_CompanyID}||${r.pn_BranchID}||${r.v_DepartmentName}||${
//               r.status || "A"
//             }`
//           : null
//       ).map((s) => {
//         const [pn_CompanyID, pn_BranchID, v_DepartmentName, status] =
//           s.split("||");
//         return { pn_CompanyID, pn_BranchID, v_DepartmentName, status };
//       });

//       // Designation
//       const uniqueDesignations = extractUnique(data, (r) =>
//         r.v_DesignationName
//           ? `${r.pn_CompanyID}||${r.pn_BranchID}||${r.v_DesignationName}||${
//               r.Authority || ""
//             }||${r.status || "A"}`
//           : null
//       ).map((s) => {
//         const [pn_CompanyID, BranchID, v_DesignationName, Authority, status] =
//           s.split("||");
//         return { pn_CompanyID, BranchID, v_DesignationName, Authority, status };
//       });

//       // Grade
//       const uniqueGrades = extractUnique(data, (r) =>
//         r.v_GradeName
//           ? `${r.pn_CompanyID}||${r.pn_BranchID}||${r.v_GradeName}||${
//               r.status || "A"
//             }`
//           : null
//       ).map((s) => {
//         const [pn_CompanyID, BranchID, v_GradeName, status] = s.split("||");
//         return { pn_CompanyID, BranchID, v_GradeName, status };
//       });

//       // Shift
//       const uniqueShifts = extractUnique(data, (r) =>
//         r.v_ShiftName
//           ? `${r.pn_CompanyID}||${r.pn_branchid || r.pn_BranchID}||${
//               r.v_ShiftName
//             }||${r.start_time || ""}||${r.break_time_out || ""}||${
//               r.break_time_in || ""
//             }||${r.end_time || ""}||${r.status || "A"}||${
//               r.shift_indicator || ""
//             }||${r.Shift_Type || ""}`
//           : null
//       ).map((s) => {
//         const [
//           pn_CompanyID,
//           pn_branchid,
//           v_ShiftName,
//           start_time,
//           break_time_out,
//           break_time_in,
//           end_time,
//           status,
//           shift_indicator,
//           Shift_Type,
//         ] = s.split("||");
//         return {
//           pn_CompanyID,
//           pn_branchid,
//           v_ShiftName,
//           start_time,
//           break_time_out,
//           break_time_in,
//           end_time,
//           status,
//           shift_indicator,
//           Shift_Type,
//         };
//       });

//       // Category
//       const uniqueCategories = extractUnique(data, (r) =>
//         r.v_CategoryName
//           ? `${r.pn_CompanyID}||${r.pn_BranchID}||${r.v_CategoryName}||${
//               r.status || "A"
//             }`
//           : null
//       ).map((s) => {
//         const [pn_CompanyID, BranchID, v_CategoryName, status] = s.split("||");
//         return { pn_CompanyID, BranchID, v_CategoryName, status };
//       });

//       // JobStatus
//       const uniqueJobStatus = extractUnique(data, (r) =>
//         r.v_JobStatusName
//           ? `${r.pn_CompanyID}||${r.pn_BranchID}||${r.v_JobStatusName}||${
//               r.status || "A"
//             }`
//           : null
//       ).map((s) => {
//         const [pn_CompanyID, BranchID, v_JobStatusName, status] = s.split("||");
//         return { pn_CompanyID, BranchID, v_JobStatusName, status };
//       });

//       // Level
//       const uniqueLevels = extractUnique(data, (r) =>
//         r.v_LevelName
//           ? `${r.pn_CompanyID}||${r.pn_BranchID}||${r.v_LevelName}||${
//               r.status || "A"
//             }`
//           : null
//       ).map((s) => {
//         const [pn_CompanyID, BranchID, v_LevelName, status] = s.split("||");
//         return { pn_CompanyID, BranchID, v_LevelName, status };
//       });

//       // Build SQL for all masters
//       const divisionQueries = uniqueDivisions
//         .map((d) => {
//           return `IF NOT EXISTS (SELECT 1 FROM [${databaseName}].[dbo].[paym_Division] WHERE pn_CompanyID=${sqlValue(
//             d.pn_CompanyID
//           )} AND BranchID=${sqlValue(d.BranchID)} AND v_DivisionName=${sqlValue(
//             d.v_DivisionName
//           )}) BEGIN
//             INSERT INTO [${databaseName}].[dbo].[paym_Division] ([pn_CompanyID],[BranchID],[v_DivisionName],[status])
//             VALUES (${sqlValue(d.pn_CompanyID)}, ${sqlValue(
//             d.BranchID
//           )}, ${sqlValue(d.v_DivisionName)}, ${sqlValue(d.status)});
//           END`;
//         })
//         .join(" ");

//       const departmentQueries = uniqueDepartments
//         .map((d) => {
//           return `IF NOT EXISTS (SELECT 1 FROM [${databaseName}].[dbo].[paym_Department] WHERE pn_CompanyID=${sqlValue(
//             d.pn_CompanyID
//           )} AND pn_BranchID=${sqlValue(
//             d.pn_BranchID
//           )} AND v_DepartmentName=${sqlValue(d.v_DepartmentName)}) BEGIN
//             INSERT INTO [${databaseName}].[dbo].[paym_Department] ([pn_CompanyID],[pn_BranchID],[v_DepartmentName],[status])
//             VALUES (${sqlValue(d.pn_CompanyID)}, ${sqlValue(
//             d.pn_BranchID
//           )}, ${sqlValue(d.v_DepartmentName)}, ${sqlValue(d.status)});
//           END`;
//         })
//         .join(" ");

//       const designationQueries = uniqueDesignations
//         .map((d) => {
//           return `IF NOT EXISTS (SELECT 1 FROM [${databaseName}].[dbo].[paym_Designation] WHERE pn_CompanyID=${sqlValue(
//             d.pn_CompanyID
//           )} AND BranchID=${sqlValue(
//             d.BranchID
//           )} AND v_DesignationName=${sqlValue(d.v_DesignationName)}) BEGIN
//             INSERT INTO [${databaseName}].[dbo].[paym_Designation] ([pn_CompanyID],[BranchID],[v_DesignationName],[Authority],[status])
//             VALUES (${sqlValue(d.pn_CompanyID)}, ${sqlValue(
//             d.BranchID
//           )}, ${sqlValue(d.v_DesignationName)}, ${sqlValue(
//             d.Authority
//           )}, ${sqlValue(d.status)});
//           END`;
//         })
//         .join(" ");

//       const gradeQueries = uniqueGrades
//         .map((g) => {
//           return `IF NOT EXISTS (SELECT 1 FROM [${databaseName}].[dbo].[paym_Grade] WHERE pn_CompanyID=${sqlValue(
//             g.pn_CompanyID
//           )} AND BranchID=${sqlValue(g.BranchID)} AND v_GradeName=${sqlValue(
//             g.v_GradeName
//           )}) BEGIN
//             INSERT INTO [${databaseName}].[dbo].[paym_Grade] ([pn_CompanyID],[BranchID],[v_GradeName],[status])
//             VALUES (${sqlValue(g.pn_CompanyID)}, ${sqlValue(
//             g.BranchID
//           )}, ${sqlValue(g.v_GradeName)}, ${sqlValue(g.status)});
//           END`;
//         })
//         .join(" ");

//       const shiftQueries = uniqueShifts
//         .map((s) => {
//           return `IF NOT EXISTS (SELECT 1 FROM [${databaseName}].[dbo].[paym_Shift] WHERE pn_CompanyID=${sqlValue(
//             s.pn_CompanyID
//           )} AND pn_branchid=${sqlValue(
//             s.pn_branchid
//           )} AND shift_code=${sqlValue(s.v_ShiftName)}) BEGIN
//             INSERT INTO [${databaseName}].[dbo].[paym_Shift] ([pn_CompanyID],[pn_branchid],[shift_code],[start_time],[break_time_out],[break_time_in],[end_time],[shift_indicator],[Shift_Type])
//             VALUES (${sqlValue(s.pn_CompanyID)}, ${sqlValue(
//             s.pn_branchid
//           )}, ${sqlValue(s.v_ShiftName)}, ${sqlValue(s.start_time)}, ${sqlValue(
//             s.break_time_out
//           )}, ${sqlValue(s.break_time_in)}, ${sqlValue(s.end_time)}, ${sqlValue(
//             s.shift_indicator
//           )}, ${sqlValue(s.Shift_Type)});
//           END`;
//         })
//         .join(" ");

//       const categoryQueries = uniqueCategories
//         .map((c) => {
//           return `IF NOT EXISTS (SELECT 1 FROM [${databaseName}].[dbo].[paym_Category] WHERE pn_CompanyID=${sqlValue(
//             c.pn_CompanyID
//           )} AND BranchID=${sqlValue(c.BranchID)} AND v_CategoryName=${sqlValue(
//             c.v_CategoryName
//           )}) BEGIN
//             INSERT INTO [${databaseName}].[dbo].[paym_Category] ([pn_CompanyID],[BranchID],[v_CategoryName],[status])
//             VALUES (${sqlValue(c.pn_CompanyID)}, ${sqlValue(
//             c.BranchID
//           )}, ${sqlValue(c.v_CategoryName)}, ${sqlValue(c.status)});
//           END`;
//         })
//         .join(" ");

//       const jobstatusQueries = uniqueJobStatus
//         .map((j) => {
//           return `IF NOT EXISTS (SELECT 1 FROM [${databaseName}].[dbo].[paym_JobStatus] WHERE pn_CompanyID=${sqlValue(
//             j.pn_CompanyID
//           )} AND BranchID=${sqlValue(
//             j.BranchID
//           )} AND v_JobStatusName=${sqlValue(j.v_JobStatusName)}) BEGIN
//             INSERT INTO [${databaseName}].[dbo].[paym_JobStatus] ([pn_CompanyID],[BranchID],[v_JobStatusName],[status])
//             VALUES (${sqlValue(j.pn_CompanyID)}, ${sqlValue(
//             j.BranchID
//           )}, ${sqlValue(j.v_JobStatusName)}, ${sqlValue(j.status)});
//           END`;
//         })
//         .join(" ");

//       const levelQueries = uniqueLevels
//         .map((l) => {
//           return `IF NOT EXISTS (SELECT 1 FROM [${databaseName}].[dbo].[paym_Level] WHERE pn_CompanyID=${sqlValue(
//             l.pn_CompanyID
//           )} AND BranchID=${sqlValue(l.BranchID)} AND v_LevelName=${sqlValue(
//             l.v_LevelName
//           )}) BEGIN
//             INSERT INTO [${databaseName}].[dbo].[paym_Level] ([pn_CompanyID],[BranchID],[v_LevelName],[status])
//             VALUES (${sqlValue(l.pn_CompanyID)}, ${sqlValue(
//             l.BranchID
//           )}, ${sqlValue(l.v_LevelName)}, ${sqlValue(l.status)});
//           END`;
//         })
//         .join(" ");

//       // Build employee + profile + login queries for each row
//       // We'll use a pattern: DECLARE @empId INT; INSERT ...; SET @empId = SCOPE_IDENTITY(); INSERT profile USING @empId; INSERT login
//       const employeeRowQueries = data
//         .map((row) => {
//           // map row fields according to your new schema names
//           const empInsert = `
//           INSERT INTO [${databaseName}].[dbo].[paym_Employee] (
//             [pn_CompanyID],[pn_BranchID],
//             [EmployeeCode],[Employee_First_Name],[Employee_Middle_Name],[Employee_Last_Name],
//             [DateofBirth],[Password],[Gender],[status],[Employee_Full_Name],[Readerid],
//             [OT_Eligible],[Pfno],[Esino],[OT_calc],[CTC],[basic_salary],
//             [Bank_code],[Bank_Name],[Branch_Name],[Account_Type],[MICR_code],[IFSC_Code],
//             [Other_Info],[Reporting_person],[ReportingID],[Reporting_email],[Pan_no],
//             [salary_type],[TDS_Applicable],[Flag],[role],[accountNo],[Blood_Group],
//             [Phone_No],[Alternate_Phone_No],[permanent_address],[Aadhar_Card],[Current_Address],
//             [Father_Name],[Email],[Alternate_Email],[Grade],[Overall_Experience],
//             [HighestQualification],[UniversityName],[YearOfPassing],[Certifications],[Skills],
//             [UAN],[PaymentMode],[PassportNumber],[VisaDetails],[JoiningDate],[ExitReason],
//             [PreviousCompany],[PreviousDesignation],[PreviousEmploymentDuration],[ReasonForLeaving],
//             [PerformanceRating],[TrainingRecords],[DisciplinaryActions],[Awards],[VehicleDetails],
//             [HealthInsuranceDetails],[NomineeDetails],[Asset_Name],[Asset_SerialNumber],
//             [NomineePhoneno],[NomineeRelationship],[ExitDate],[AssetType]
//           ) VALUES (
//             ${sqlValue(row.pn_CompanyID)}, ${sqlValue(row.pn_BranchID)},
//             ${sqlValue(row.EmployeeCode)}, ${sqlValue(
//             row.Employee_First_Name
//           )}, ${sqlValue(row.Employee_Middle_Name)}, ${sqlValue(
//             row.Employee_Last_Name
//           )},
//             ${sqlValue(row.DateofBirth)}, ${sqlValue(row.Password)}, ${sqlValue(
//             row.Gender
//           )}, ${sqlValue(row.status)}, ${sqlValue(
//             row.Employee_Full_Name
//           )}, ${sqlValue(row.Readerid)},
//             ${sqlValue(row.OT_Eligible)}, ${sqlValue(row.Pfno)}, ${sqlValue(
//             row.Esino
//           )}, ${sqlValue(row.OT_calc)}, ${sqlValue(row.CTC)}, ${sqlValue(
//             row.basic_salary
//           )},
//             ${sqlValue(row.Bank_code)}, ${sqlValue(row.Bank_Name)}, ${sqlValue(
//             row.Branch_Name
//           )}, ${sqlValue(row.Account_Type)}, ${sqlValue(
//             row.MICR_code
//           )}, ${sqlValue(row.IFSC_Code)},
//             ${sqlValue(row.Other_Info)}, ${sqlValue(
//             row.Reporting_person
//           )}, ${sqlValue(row.ReportingID)}, ${sqlValue(
//             row.Reporting_email
//           )}, ${sqlValue(row.Pan_no)},
//             ${sqlValue(row.salary_type)}, ${sqlValue(
//             row.TDS_Applicable
//           )}, ${sqlValue(row.Flag)}, ${sqlValue(row.role)}, ${sqlValue(
//             row.accountNo
//           )}, ${sqlValue(row.Blood_Group)},
//             ${sqlValue(row.Phone_No)}, ${sqlValue(
//             row.Alternate_Phone_No
//           )}, ${sqlValue(row.permanent_address)}, ${sqlValue(
//             row.Aadhar_Card
//           )}, ${sqlValue(row.Current_Address)},
//             ${sqlValue(row.Father_Name)}, ${sqlValue(row.Email)}, ${sqlValue(
//             row.Alternate_Email
//           )}, ${sqlValue(row.Grade)}, ${sqlValue(row.Overall_Experience)},
//             ${sqlValue(row.HighestQualification)}, ${sqlValue(
//             row.UniversityName
//           )}, ${sqlValue(row.YearOfPassing)}, ${sqlValue(
//             row.Certifications
//           )}, ${sqlValue(row.Skills)},
//             ${sqlValue(row.UAN)}, ${sqlValue(row.PaymentMode)}, ${sqlValue(
//             row.PassportNumber
//           )}, ${sqlValue(row.VisaDetails)}, ${sqlValue(
//             row.JoiningDate
//           )}, ${sqlValue(row.ExitReason)},
//             ${sqlValue(row.PreviousCompany)}, ${sqlValue(
//             row.PreviousDesignation
//           )}, ${sqlValue(row.PreviousEmploymentDuration)}, ${sqlValue(
//             row.ReasonForLeaving
//           )},
//             ${sqlValue(row.PerformanceRating)}, ${sqlValue(
//             row.TrainingRecords
//           )}, ${sqlValue(row.DisciplinaryActions)}, ${sqlValue(
//             row.Awards
//           )}, ${sqlValue(row.VehicleDetails)},
//             ${sqlValue(row.HealthInsuranceDetails)}, ${sqlValue(
//             row.NomineeDetails
//           )}, ${sqlValue(row.Asset_Name)}, ${sqlValue(row.Asset_SerialNumber)},
//             ${sqlValue(row.NomineePhoneno)}, ${sqlValue(
//             row.NomineeRelationship
//           )}, ${sqlValue(row.ExitDate)}, ${sqlValue(row.AssetType)}
//           );
//           `;

//           // profile insert requires employee id from SCOPE_IDENTITY()
//           const profileInsert = `
//           DECLARE @empId INT;
//           SET @empId = SCOPE_IDENTITY();
//           INSERT INTO [${databaseName}].[dbo].[paym_employee_profile1] (
//           [pn_CompanyID],[pn_BranchID],[pn_EmployeeID],[pn_DivisionId],[pn_DepartmentId],[pn_DesignationId],
//           [pn_GradeId],[pn_ShiftId],[pn_CategoryId],[pn_JobStatusId],[pn_LevelID],[pn_projectsiteID],
//           [d_Date],[v_Reason],[r_Department],[father_name],[image_data],[Emp_Profile_Image]
//           ) VALUES (
//           ${sqlValue(row.pn_CompanyID)}, ${sqlValue(row.pn_BranchID)}, @empId,
//           ${sqlValue(row.pnDivisionId)}, ${sqlValue(row.pnDepartmentId)},
//           ${sqlValue(row.pnDesignationId)},
//           ${sqlValue(row.pnGradeId)}, ${sqlValue(row.pn_ShiftID)},
//           ${sqlValue(row.pnCategoryId)},
//           ${sqlValue(row.pnJobStatusId)}, ${sqlValue(row.pnLevelId)}, ${sqlValue(row.pnProjectsiteId)},
//           ${sqlValue(row.d_Date)}, ${sqlValue(row.v_Reason)}, ${sqlValue(row.r_Department)},
//           ${sqlValue(row.Father_Name)},
//           ${sqlValue(row.image_base64)}, ${sqlValue(row.image_base64)}
//           );
//           `;

//           // HRMS_Master login insert (use employee code, password, DB)
//           const loginInsert = `
//           INSERT INTO [HRMS_Master].[dbo].[EmployeesLogin] ([EmployeeUserId],[Password],[DBname],[employeeFullName])
//           VALUES (${sqlValue(row.EmployeeCode)}, ${sqlValue(
//             row.Password
//           )}, ${sqlValue(databaseName)}, ${sqlValue(row.Employee_Full_Name)});
//           `;

//           // Combine emp + profile + login into one chunk. SCOPE_IDENTITY is used immediately after the insert
//           return empInsert + profileInsert + loginInsert;
//         })
//         .join(" ");

//       // Final combined SQL
//       const combinedQueries = `
//         SET NOCOUNT ON;
//         ${divisionQueries}
//         ${departmentQueries}
//         ${designationQueries}
//         ${gradeQueries}
//         ${shiftQueries}
//         ${categoryQueries}
//         ${jobstatusQueries}
//         ${levelQueries}
//         ${employeeRowQueries}
//       `;

//       console.log("CombinedQueries:", combinedQueries.slice(0, 1000)); // log start only

//       // send to backend
//       const response = await postRequest(ServerConfig.url, SAVE, {
//         query: combinedQueries,
//       });

//       if (response && response.status === 200) {
//         toast.success("Bulk data saved successfully", {
//           autoClose: 1200,
//           position: "top-center",
//         });
//         setData([]);
//         setFileName("");
//       } else {
//         toast.error("Failed to save bulk data", {
//           autoClose: 2000,
//           position: "top-center",
//         });
//       }
//     } catch (err) {
//       console.error("Error in bulk save:", err);
//       toast.error("Error saving data: " + (err.message || err), {
//         position: "top-center",
//       });
//     }
//   };

//   return (
//     <Grid item xs={12}>
//       <Box sx={{ p: 3 }}>
//         <Typography variant="h5" sx={{ mb: 2 }}>
//           Bulk Upload — Employee + Masters (Single-sheet Employee)
//         </Typography>

//         <Paper sx={{ p: 2, mb: 2 }}>
//           <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
//           <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
//             <Button
//               variant="contained"
//               onClick={() => downloadTemplate("paym_Employee", employeeColumns)}
//             >
//               Download Employee Template
//             </Button>
//             <Button
//               variant="outlined"
//               onClick={() => downloadTemplate("paym_Division", divisionCols)}
//             >
//               Download Division Template
//             </Button>
//             <Button
//               variant="outlined"
//               onClick={() =>
//                 downloadTemplate("paym_Department", departmentCols)
//               }
//             >
//               Download Department Template
//             </Button>
//             <Button
//               variant="outlined"
//               onClick={() =>
//                 downloadTemplate("paym_Designation", designationCols)
//               }
//             >
//               Download Designation Template
//             </Button>
//             <Button
//               variant="outlined"
//               onClick={() => downloadTemplate("paym_Grade", gradeCols)}
//             >
//               Download Grade Template
//             </Button>
//             <Button
//               variant="outlined"
//               onClick={() => downloadTemplate("paym_Shift", shiftCols)}
//             >
//               Download Shift Template
//             </Button>
//             <Button
//               variant="outlined"
//               onClick={() => downloadTemplate("paym_Category", categoryCols)}
//             >
//               Download Category Template
//             </Button>
//             <Button
//               variant="outlined"
//               onClick={() => downloadTemplate("paym_JobStatus", jobStatusCols)}
//             >
//               Download JobStatus Template
//             </Button>
//             <Button
//               variant="outlined"
//               onClick={() => downloadTemplate("paym_Level", levelCols)}
//             >
//               Download Level Template
//             </Button>
//           </Box>
//         </Paper>

//         <Paper sx={{ p: 2, mb: 2 }}>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleSave}
//             disabled={!data || data.length === 0}
//           >
//             Save Data
//           </Button>
//           <Box sx={{ mt: 2 }}>
//             <Typography variant="subtitle2">
//               File: {fileName || "none"}
//             </Typography>
//             <Typography variant="body2">Rows: {data.length}</Typography>
//           </Box>
//         </Paper>

//         {data.length > 0 && (
//           <TableContainer component={Paper}>
//             <Table size="small">
//               <TableHead>
//                 <TableRow>
//                   {Object.keys(data[0]).map((k) => (
//                     <TableCell key={k}>{k}</TableCell>
//                   ))}
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {data.map((r, idx) => (
//                   <TableRow key={idx}>
//                     {Object.values(r).map((v, j) => (
//                       <TableCell key={j}>{v}</TableCell>
//                     ))}
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}
//       </Box>
//     </Grid>
//   );
// };

// export default EmployeeBulkExcelSheetUploadV2;

// EmployeeBulkExcelSheetUploadCombined.jsx
// EmployeeBulkUpload_Final_WithCTE.jsx
// import React, { useState } from "react";
// import {
//   Grid,
//   Box,
//   Paper,
//   AppBar,
//   Toolbar,
//   Typography,
//   Button,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   TableContainer,
// } from "@mui/material";
// import * as XLSX from "xlsx";
// import Navbar from "../../Home Page/Navbar";
// import Sidenav from "../../Home Page/Sidenav";
// import { postRequest } from "../../../serverconfiguration/requestcomp";
// import { ServerConfig } from "../../../serverconfiguration/serverconfig";
// import { SAVE } from "../../../serverconfiguration/controllers";
// import { toast } from "react-toastify";

// /**
//  * EmployeeBulkUpload_Final_WithCTE.jsx
//  *
//  * Single-file combined UI + template generator + SQL generator using OUTPUT INSERTED CTE pattern.
//  *
//  * Notes:
//  * - Excel must contain column "image_filename" (not image_base64).
//  * - Users must upload image files in the UI (multiple). Filenames in Excel should match uploaded file names.
//  * - Missing/empty values are inserted as empty string '' (per user instruction).
//  * - Ensure backend endpoint (postRequest SAVE) accepts large SQL batches.
//  */

// const EmployeeBulkUploadFinalWithCTE = () => {
//   const [selectedTemplate, setSelectedTemplate] = useState("Employee");
//   const [data, setData] = useState([]);
//   const [fileName, setFileName] = useState("");
//   const [imageFiles, setImageFiles] = useState({}); // { filename: File }
//   const databaseName = sessionStorage.getItem("databaseName") || "HRMS_004_Mallow";

//   // final columns in UI order (with image_filename)
//   const employeeTemplateColumns = [
//     "pn_CompanyID","pn_BranchID","pn_EmployeeID","Employee_First_Name","Employee_Middle_Name","Employee_Last_Name",
//     "Employee_Full_Name","DateofBirth","Gender","status","Blood_Group","d_Date","image_filename","EmployeeCode","Password",
//     "pnDivisionId","pnDepartmentId","pnDesignationId","pnGradeId","pn_ShiftID","pnCategoryId","pnJobStatusId","pnLevelId",
//     "pnProjectsiteId","v_Reason","r_Department","Aadhar_Card","MICR_code","Branch_Name","Bank_Name","Bank_code","accountNo",
//     "IFSC_Code","Account_Type","Pan_no","CTC","PaymentMode","basic_salary","Readerid","salary_type","role","Other_Info",
//     "OT_Eligible","TDS_Applicable","OT_calc","PassportNumber","VisaDetails","UAN","Pfno","Esino","Email","Alternate_Email",
//     "Phone_No","Alternate_Phone_No","permanent_address","Current_Address","HighestQualification","UniversityName","YearOfPassing",
//     "Certifications","Skills","Overall_Experience","PreviousCompany","PreviousDesignation","PreviousEmploymentDuration",
//     "ReasonForLeaving","PerformanceRating","TrainingRecords","Awards","ReportingID","Reporting_person","Reporting_email","Father_Name",
//     "JoiningDate","VehicleDetails","HealthInsuranceDetails","NomineeDetails","NomineePhoneno","NomineeRelationship","AssetType",
//     "Asset_Name","Asset_SerialNumber","ExitDate"
//   ];

//   // master column sets
//   const divisionCols = ["pn_CompanyID", "BranchID", "pn_DivisionID", "v_DivisionName", "status"];
//   const departmentCols = ["pn_CompanyID", "pn_BranchID", "pn_DepartmentID", "v_DepartmentName", "status"];
//   const designationCols = ["pn_CompanyID", "BranchID", "pn_DesignationID", "v_DesignationName", "Authority", "status"];
//   const gradeCols = ["pn_CompanyID", "BranchID", "pn_GradeID", "v_GradeName", "status"];
//   const shiftCols = ["pn_CompanyID", "pn_branchid", "pn_ShiftID", "shift_code", "start_time", "break_time_out", "break_time_in", "end_time", "shift_indicator", "Shift_Type"];
//   const categoryCols = ["pn_CompanyID", "BranchID", "pn_CategoryID", "v_CategoryName", "status"];
//   const jobStatusCols = ["pn_CompanyID", "BranchID", "pn_JobStatusID", "v_JobStatusName", "status"];
//   const levelCols = ["pn_CompanyID", "BranchID", "pn_LevelID", "v_LevelName", "status"];

//   // helper: convert to SQL literal, using empty string default
//   const sqlValueEmptyString = (val) => {
//     if (val === null || val === undefined || val === "") return "''";
//     // detect number (but careful: keep leading zeros as strings if needed)
//     const num = Number(val);
//     if (!isNaN(num) && String(val).trim() !== "" && !/^[0]\d+/.test(String(val))) {
//       return `${num}`;
//     }
//     // escape single quotes
//     return `'${String(val).replace(/'/g, "''")}'`;
//   };

//   // Convert file to base64 (data URL) and return only base64 payload (without prefix)
//   const fileToBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       if (!file) return resolve("");
//       const reader = new FileReader();
//       reader.onload = () => {
//         const result = reader.result;
//         // result like "data:image/png;base64,iVBORw0K..."
//         const parts = result.split(",");
//         resolve(parts.length > 1 ? parts[1] : parts[0]);
//       };
//       reader.onerror = (err) => reject(err);
//       reader.readAsDataURL(file);
//     });
//   };

//   // download selected template
//   const downloadSingleTemplate = (templateName) => {
//     let cols = templateName === "Employee" ? employeeTemplateColumns : [];
//     if (templateName === "Division") cols = divisionCols;
//     if (templateName === "Department") cols = departmentCols;
//     if (templateName === "Designation") cols = designationCols;
//     if (templateName === "Grade") cols = gradeCols;
//     if (templateName === "Shift") cols = shiftCols;
//     if (templateName === "Category") cols = categoryCols;
//     if (templateName === "JobStatus") cols = jobStatusCols;
//     if (templateName === "Level") cols = levelCols;

//     const header = {};
//     cols.forEach((c) => (header[c] = ""));
//     const wb = XLSX.utils.book_new();
//     const ws = XLSX.utils.json_to_sheet([header]);
//     XLSX.utils.book_append_sheet(wb, ws, templateName);
//     XLSX.writeFile(wb, `${templateName}_template.xlsx`);
//   };

//   // Parse uploaded Excel
//   const handleFileChange = (e) => {
//     const f = e.target.files[0];
//     if (!f) return;
//     setFileName(f.name);
//     const reader = new FileReader();
//     reader.onload = (ev) => {
//       const wb = XLSX.read(ev.target.result, { type: "binary" });
//       const sheet = wb.Sheets[wb.SheetNames[0]];
//       const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });
//       // Normalize rows to ensure all expected columns present
//       const normalized = json.map((row) => {
//         const norm = {};
//         employeeTemplateColumns.forEach((col) => {
//           // Note: Excel column for image filename should be named "image_filename"
//           norm[col] = row[col] !== undefined ? row[col] : "";
//         });
//         // Also accept older column name image_base64 (if user still used old file)
//         if (!norm.image_filename && row.image_base64) norm.image_filename = row.image_base64;
//         return norm;
//       });
//       setData(normalized);
//       toast.info(`Parsed ${normalized.length} rows`, { position: "top-center", autoClose: 1000 });
//     };
//     reader.readAsBinaryString(f);
//   };

//   // Handle image file uploads
//   const handleImageUpload = (e) => {
//     const files = e.target.files;
//     const map = { ...imageFiles };
//     for (let i = 0; i < files.length; i++) {
//       map[files[i].name] = files[i];
//     }
//     setImageFiles(map);
//     toast.success(`${Object.keys(map).length} image(s) uploaded`, { position: "top-center", autoClose: 1200 });
//   };

//   // Build master insert queries (IF NOT EXISTS) from data optionally
//   const buildMasterQueries = (rows) => {
//     // We'll build a few masters if names exist in rows (v_DivisionName etc.) — safe even if empty
//     const unique = (arr) => Array.from(new Set(arr.filter(Boolean)));
//     // Divisions: expect columns v_DivisionName, BranchID, pn_CompanyID, status
//     const divisions = unique(rows.map(r => r.v_DivisionName ? `${r.pn_CompanyID}||${r.BranchID||r.pn_BranchID||""}||${r.v_DivisionName}||${r.status||""}` : null))
//       .map(s => {
//         const [pn_CompanyID, BranchID, v_DivisionName, status] = (s||"||||").split("||");
//         return { pn_CompanyID, BranchID, v_DivisionName, status };
//       });

//     const departments = unique(rows.map(r => r.v_DepartmentName ? `${r.pn_CompanyID}||${r.pn_BranchID||r.BranchID||""}||${r.v_DepartmentName}||${r.status||""}` : null))
//       .map(s => {
//         const [pn_CompanyID, pn_BranchID, v_DepartmentName, status] = (s||"||||").split("||");
//         return { pn_CompanyID, pn_BranchID, v_DepartmentName, status };
//       });

//     const designations = unique(rows.map(r => r.v_DesignationName ? `${r.pn_CompanyID}||${r.BranchID||r.pn_BranchID||""}||${r.v_DesignationName}||${r.Authority||""}||${r.status||""}` : null))
//       .map(s => {
//         const [pn_CompanyID, BranchID, v_DesignationName, Authority, status] = (s||"|||||").split("||");
//         return { pn_CompanyID, BranchID, v_DesignationName, Authority, status };
//       });

//     const grades = unique(rows.map(r => r.v_GradeName ? `${r.pn_CompanyID}||${r.BranchID||r.pn_BranchID||""}||${r.v_GradeName}||${r.status||""}` : null))
//       .map(s => {
//         const [pn_CompanyID, BranchID, v_GradeName, status] = (s||"||||").split("||");
//         return { pn_CompanyID, BranchID, v_GradeName, status };
//       });

//     const shifts = unique(rows.map(r => r.shift_code ? `${r.pn_CompanyID}||${r.pn_branchid||r.pn_BranchID||""}||${r.shift_code}||${r.start_time||""}||${r.break_time_out||""}||${r.break_time_in||""}||${r.end_time||""}||${r.shift_indicator||""}||${r.Shift_Type||""}` : null))
//       .map(s => {
//         const [pn_CompanyID, pn_branchid, shift_code, start_time, break_time_out, break_time_in, end_time, shift_indicator, Shift_Type] = (s||"||||||||").split("||");
//         return { pn_CompanyID, pn_branchid, shift_code, start_time, break_time_out, break_time_in, end_time, shift_indicator, Shift_Type };
//       });

//     const categories = unique(rows.map(r => r.v_CategoryName ? `${r.pn_CompanyID}||${r.BranchID||r.pn_BranchID||""}||${r.v_CategoryName}||${r.status||""}` : null))
//       .map(s => {
//         const [pn_CompanyID, BranchID, v_CategoryName, status] = (s||"||||").split("||");
//         return { pn_CompanyID, BranchID, v_CategoryName, status };
//       });

//     const jobstatus = unique(rows.map(r => r.v_JobStatusName ? `${r.pn_CompanyID}||${r.BranchID||r.pn_BranchID||""}||${r.v_JobStatusName}||${r.status||""}` : null))
//       .map(s => {
//         const [pn_CompanyID, BranchID, v_JobStatusName, status] = (s||"||||").split("||");
//         return { pn_CompanyID, BranchID, v_JobStatusName, status };
//       });

//     const levels = unique(rows.map(r => r.v_LevelName ? `${r.pn_CompanyID}||${r.BranchID||r.pn_BranchID||""}||${r.v_LevelName}||${r.status||""}` : null))
//       .map(s => {
//         const [pn_CompanyID, BranchID, v_LevelName, status] = (s||"||||").split("||");
//         return { pn_CompanyID, BranchID, v_LevelName, status };
//       });

//     // Build SQL strings
//     const divisionQueries = divisions.map(d => `
//       IF NOT EXISTS (SELECT 1 FROM [${databaseName}].[dbo].[paym_Division] WHERE pn_CompanyID=${sqlValueEmptyString(d.pn_CompanyID)} AND BranchID=${sqlValueEmptyString(d.BranchID)} AND v_DivisionName=${sqlValueEmptyString(d.v_DivisionName)})
//       BEGIN
//         INSERT INTO [${databaseName}].[dbo].[paym_Division] ([pn_CompanyID],[BranchID],[v_DivisionName],[status]) VALUES (${sqlValueEmptyString(d.pn_CompanyID)},${sqlValueEmptyString(d.BranchID)},${sqlValueEmptyString(d.v_DivisionName)},${sqlValueEmptyString(d.status)});
//       END;`).join("\n");

//     const departmentQueries = departments.map(d => `
//       IF NOT EXISTS (SELECT 1 FROM [${databaseName}].[dbo].[paym_Department] WHERE pn_CompanyID=${sqlValueEmptyString(d.pn_CompanyID)} AND pn_BranchID=${sqlValueEmptyString(d.pn_BranchID)} AND v_DepartmentName=${sqlValueEmptyString(d.v_DepartmentName)})
//       BEGIN
//         INSERT INTO [${databaseName}].[dbo].[paym_Department] ([pn_CompanyID],[pn_BranchID],[v_DepartmentName],[status]) VALUES (${sqlValueEmptyString(d.pn_CompanyID)},${sqlValueEmptyString(d.pn_BranchID)},${sqlValueEmptyString(d.v_DepartmentName)},${sqlValueEmptyString(d.status)});
//       END;`).join("\n");

//     const designationQueries = designations.map(d => `
//       IF NOT EXISTS (SELECT 1 FROM [${databaseName}].[dbo].[paym_Designation] WHERE pn_CompanyID=${sqlValueEmptyString(d.pn_CompanyID)} AND BranchID=${sqlValueEmptyString(d.BranchID)} AND v_DesignationName=${sqlValueEmptyString(d.v_DesignationName)})
//       BEGIN
//         INSERT INTO [${databaseName}].[dbo].[paym_Designation] ([pn_CompanyID],[BranchID],[v_DesignationName],[Authority],[status]) VALUES (${sqlValueEmptyString(d.pn_CompanyID)},${sqlValueEmptyString(d.BranchID)},${sqlValueEmptyString(d.v_DesignationName)},${sqlValueEmptyString(d.Authority)},${sqlValueEmptyString(d.status)});
//       END;`).join("\n");

//     const gradeQueries = grades.map(g => `
//       IF NOT EXISTS (SELECT 1 FROM [${databaseName}].[dbo].[paym_Grade] WHERE pn_CompanyID=${sqlValueEmptyString(g.pn_CompanyID)} AND BranchID=${sqlValueEmptyString(g.BranchID)} AND v_GradeName=${sqlValueEmptyString(g.v_GradeName)})
//       BEGIN
//         INSERT INTO [${databaseName}].[dbo].[paym_Grade] ([pn_CompanyID],[BranchID],[v_GradeName],[status]) VALUES (${sqlValueEmptyString(g.pn_CompanyID)},${sqlValueEmptyString(g.BranchID)},${sqlValueEmptyString(g.v_GradeName)},${sqlValueEmptyString(g.status)});
//       END;`).join("\n");

//     const shiftQueries = shifts.map(s => `
//       IF NOT EXISTS (SELECT 1 FROM [${databaseName}].[dbo].[paym_Shift] WHERE pn_CompanyID=${sqlValueEmptyString(s.pn_CompanyID)} AND pn_branchid=${sqlValueEmptyString(s.pn_branchid)} AND shift_code=${sqlValueEmptyString(s.shift_code)})
//       BEGIN
//         INSERT INTO [${databaseName}].[dbo].[paym_Shift] ([pn_CompanyID],[pn_branchid],[shift_code],[start_time],[break_time_out],[break_time_in],[end_time],[shift_indicator],[Shift_Type]) VALUES (${sqlValueEmptyString(s.pn_CompanyID)},${sqlValueEmptyString(s.pn_branchid)},${sqlValueEmptyString(s.shift_code)},${sqlValueEmptyString(s.start_time)},${sqlValueEmptyString(s.break_time_out)},${sqlValueEmptyString(s.break_time_in)},${sqlValueEmptyString(s.end_time)},${sqlValueEmptyString(s.shift_indicator)},${sqlValueEmptyString(s.Shift_Type)});
//       END;`).join("\n");

//     const categoryQueries = categories.map(c => `
//       IF NOT EXISTS (SELECT 1 FROM [${databaseName}].[dbo].[paym_Category] WHERE pn_CompanyID=${sqlValueEmptyString(c.pn_CompanyID)} AND BranchID=${sqlValueEmptyString(c.BranchID)} AND v_CategoryName=${sqlValueEmptyString(c.v_CategoryName)})
//       BEGIN
//         INSERT INTO [${databaseName}].[dbo].[paym_Category] ([pn_CompanyID],[BranchID],[v_CategoryName],[status]) VALUES (${sqlValueEmptyString(c.pn_CompanyID)},${sqlValueEmptyString(c.BranchID)},${sqlValueEmptyString(c.v_CategoryName)},${sqlValueEmptyString(c.status)});
//       END;`).join("\n");

//     const jobstatusQueries = jobstatus.map(j => `
//       IF NOT EXISTS (SELECT 1 FROM [${databaseName}].[dbo].[paym_JobStatus] WHERE pn_CompanyID=${sqlValueEmptyString(j.pn_CompanyID)} AND BranchID=${sqlValueEmptyString(j.BranchID)} AND v_JobStatusName=${sqlValueEmptyString(j.v_JobStatusName)})
//       BEGIN
//         INSERT INTO [${databaseName}].[dbo].[paym_JobStatus] ([pn_CompanyID],[BranchID],[v_JobStatusName],[status]) VALUES (${sqlValueEmptyString(j.pn_CompanyID)},${sqlValueEmptyString(j.BranchID)},${sqlValueEmptyString(j.v_JobStatusName)},${sqlValueEmptyString(j.status)});
//       END;`).join("\n");

//     const levelQueries = levels.map(l => `
//       IF NOT EXISTS (SELECT 1 FROM [${databaseName}].[dbo].[paym_Level] WHERE pn_CompanyID=${sqlValueEmptyString(l.pn_CompanyID)} AND BranchID=${sqlValueEmptyString(l.BranchID)} AND v_LevelName=${sqlValueEmptyString(l.v_LevelName)})
//       BEGIN
//         INSERT INTO [${databaseName}].[dbo].[paym_Level] ([pn_CompanyID],[BranchID],[v_LevelName],[status]) VALUES (${sqlValueEmptyString(l.pn_CompanyID)},${sqlValueEmptyString(l.BranchID)},${sqlValueEmptyString(l.v_LevelName)},${sqlValueEmptyString(l.status)});
//       END;`).join("\n");

//     return [
//       divisionQueries,
//       departmentQueries,
//       designationQueries,
//       gradeQueries,
//       shiftQueries,
//       categoryQueries,
//       jobstatusQueries,
//       levelQueries
//     ].filter(Boolean).join("\n");
//   };

//   // Main save handler: convert images to base64, build SQL batch using CTEs, and send to server
//   const handleSave = async () => {
//     if (!data || data.length === 0) {
//       toast.warn("No data to save");
//       return;
//     }

//     try {
//       // Validate EmployeeCode uniqueness in file
//       const codes = data.map(r => (r.EmployeeCode || "").toString().trim());
//       const dup = codes.filter((c, i) => c && codes.indexOf(c) !== i);
//       if (dup.length) {
//         toast.error(`Duplicate EmployeeCode(s): ${Array.from(new Set(dup)).join(", ")}`);
//         return;
//       }

//       // Pre-convert all image files referenced in rows to base64
//       const rowBase64Map = {}; // index -> base64 string or ""
//       for (let i = 0; i < data.length; i++) {
//         const row = data[i];
//         const filename = (row.image_filename || "").toString().trim();
//         if (filename && imageFiles[filename]) {
//           try {
//             const b64 = await fileToBase64(imageFiles[filename]);
//             rowBase64Map[i] = b64 || "";
//           } catch (err) {
//             console.warn("Error converting image for row", i, filename, err);
//             rowBase64Map[i] = "";
//           }
//         } else {
//           // no file uploaded or filename blank
//           rowBase64Map[i] = "";
//         }
//       }

//       // Build master queries
//       const masterSQL = buildMasterQueries(data);

//       // Build per-row SQL using CTE pattern
//       const perRowSQL = data.map((row, idx) => {
//         // For employee insert, map every paym_Employee column and fill with empty string defaults
//         const empCols = [
//           "[pn_CompanyID]","[pn_BranchID]","[pn_EmployeeID]","[EmployeeCode]","[Employee_First_Name]","[Employee_Middle_Name]","[Employee_Last_Name]",
//           "[DateofBirth]","[Password]","[Gender]","[status]","[Employee_Full_Name]","[Readerid]","[OT_Eligible]","[Pfno]","[Esino]","[OT_calc]","[CTC]",
//           "[basic_salary]","[Bank_code]","[Bank_Name]","[Branch_Name]","[Account_Type]","[MICR_code]","[IFSC_Code]","[Other_Info]","[Reporting_person]",
//           "[ReportingID]","[Reporting_email]","[Pan_no]","[salary_type]","[TDS_Applicable]","[Flag]","[role]","[accountNo]","[Blood_Group]","[Phone_No]",
//           "[Alternate_Phone_No]","[permanent_address]","[Aadhar_Card]","[Current_Address]","[Father_Name]","[Email]","[Alternate_Email]","[Grade]",
//           "[Overall_Experience]","[HighestQualification]","[UniversityName]","[YearOfPassing]","[Certifications]","[Skills]","[UAN]","[PaymentMode]",
//           "[PassportNumber]","[VisaDetails]","[JoiningDate]","[ExitReason]","[PreviousCompany]","[PreviousDesignation]","[PreviousEmploymentDuration]",
//           "[ReasonForLeaving]","[PerformanceRating]","[TrainingRecords]","[DisciplinaryActions]","[Awards]","[VehicleDetails]","[HealthInsuranceDetails]",
//           "[NomineeDetails]","[Asset_Name]","[Asset_SerialNumber]","[NomineePhoneno]","[NomineeRelationship]","[ExitDate]","[AssetType]"
//         ];

//         const empValues = [
//           sqlValueEmptyString(row.pn_CompanyID), sqlValueEmptyString(row.pn_BranchID), sqlValueEmptyString(row.pn_EmployeeID),
//           sqlValueEmptyString(row.EmployeeCode), sqlValueEmptyString(row.Employee_First_Name), sqlValueEmptyString(row.Employee_Middle_Name), sqlValueEmptyString(row.Employee_Last_Name),
//           sqlValueEmptyString(row.DateofBirth), sqlValueEmptyString(row.Password), sqlValueEmptyString(row.Gender), sqlValueEmptyString(row.status),
//           sqlValueEmptyString(row.Employee_Full_Name), sqlValueEmptyString(row.Readerid), sqlValueEmptyString(row.OT_Eligible), sqlValueEmptyString(row.Pfno), sqlValueEmptyString(row.Esino),
//           sqlValueEmptyString(row.OT_calc), sqlValueEmptyString(row.CTC),
//           sqlValueEmptyString(row.basic_salary), sqlValueEmptyString(row.Bank_code), sqlValueEmptyString(row.Bank_Name), sqlValueEmptyString(row.Branch_Name),
//           sqlValueEmptyString(row.Account_Type), sqlValueEmptyString(row.MICR_code), sqlValueEmptyString(row.IFSC_Code),
//           sqlValueEmptyString(row.Other_Info), sqlValueEmptyString(row.Reporting_person), sqlValueEmptyString(row.ReportingID), sqlValueEmptyString(row.Reporting_email),
//           sqlValueEmptyString(row.Pan_no), sqlValueEmptyString(row.salary_type), sqlValueEmptyString(row.TDS_Applicable), sqlValueEmptyString(row.Flag),
//           sqlValueEmptyString(row.role), sqlValueEmptyString(row.accountNo), sqlValueEmptyString(row.Blood_Group), sqlValueEmptyString(row.Phone_No),
//           sqlValueEmptyString(row.Alternate_Phone_No), sqlValueEmptyString(row.permanent_address), sqlValueEmptyString(row.Aadhar_Card),
//           sqlValueEmptyString(row.Current_Address), sqlValueEmptyString(row.Father_Name), sqlValueEmptyString(row.Email),
//           sqlValueEmptyString(row.Alternate_Email), sqlValueEmptyString(row.Grade), sqlValueEmptyString(row.Overall_Experience),
//           sqlValueEmptyString(row.HighestQualification), sqlValueEmptyString(row.UniversityName), sqlValueEmptyString(row.YearOfPassing),
//           sqlValueEmptyString(row.Certifications), sqlValueEmptyString(row.Skills), sqlValueEmptyString(row.UAN), sqlValueEmptyString(row.PaymentMode),
//           sqlValueEmptyString(row.PassportNumber), sqlValueEmptyString(row.VisaDetails), sqlValueEmptyString(row.JoiningDate),
//           sqlValueEmptyString(row.ExitReason), sqlValueEmptyString(row.PreviousCompany), sqlValueEmptyString(row.PreviousDesignation),
//           sqlValueEmptyString(row.PreviousEmploymentDuration), sqlValueEmptyString(row.ReasonForLeaving), sqlValueEmptyString(row.PerformanceRating),
//           sqlValueEmptyString(row.TrainingRecords), sqlValueEmptyString(row.DisciplinaryActions), sqlValueEmptyString(row.Awards),
//           sqlValueEmptyString(row.VehicleDetails), sqlValueEmptyString(row.HealthInsuranceDetails), sqlValueEmptyString(row.NomineeDetails),
//           sqlValueEmptyString(row.Asset_Name), sqlValueEmptyString(row.Asset_SerialNumber), sqlValueEmptyString(row.NomineePhoneno),
//           sqlValueEmptyString(row.NomineeRelationship), sqlValueEmptyString(row.ExitDate), sqlValueEmptyString(row.AssetType)
//         ].join(", ");

//         // profile values (we'll SELECT NewEmpId from CTE)
//         const profileCols = [
//           "[pn_CompanyID]","[pn_BranchID]","[pn_EmployeeID]","[pn_DivisionId]","[pn_DepartmentId]","[pn_DesignationId]",
//           "[pn_GradeId]","[pn_ShiftId]","[pn_CategoryId]","[pn_JobStatusId]","[pn_LevelID]","[pn_projectsiteID]",
//           "[d_Date]","[v_Reason]","[r_Department]","[father_name]","[Emp_Profile_Image]","[image_data]"
//         ];

//         const profileSelectValues = [
//           sqlValueEmptyString(row.pn_CompanyID), sqlValueEmptyString(row.pn_BranchID), "NewEmpId",
//           sqlValueEmptyString(row.pnDivisionId), sqlValueEmptyString(row.pnDepartmentId), sqlValueEmptyString(row.pnDesignationId),
//           sqlValueEmptyString(row.pnGradeId), sqlValueEmptyString(row.pn_ShiftID), sqlValueEmptyString(row.pnCategoryId), sqlValueEmptyString(row.pnJobStatusId),
//           sqlValueEmptyString(row.pnLevelId), sqlValueEmptyString(row.pnProjectsiteId),
//           sqlValueEmptyString(row.d_Date), sqlValueEmptyString(row.v_Reason), sqlValueEmptyString(row.r_Department), sqlValueEmptyString(row.Father_Name),
//           // image base64 (converted earlier)
//           sqlValueEmptyString(rowBase64Map[idx]), sqlValueEmptyString(rowBase64Map[idx])
//         ];

//         // login values
//         const loginVals = [
//           sqlValueEmptyString(row.EmployeeCode), sqlValueEmptyString(row.Password), sqlValueEmptyString(databaseName), sqlValueEmptyString(row.Employee_Full_Name)
//         ].join(", ");

//         // Build CTE block for this row using OUTPUT INSERTED
//         // IMPORTANT: wrap each CTE with a leading semicolon to avoid syntax issues when concatenating
//         const cteBlock = `
// ;WITH EmpInserted AS (
//   INSERT INTO [${databaseName}].[dbo].[paym_Employee] (${empCols.join(",")})
//   OUTPUT INSERTED.pn_EmployeeID AS NewEmpId
//   VALUES (${empValues})
// )
// INSERT INTO [${databaseName}].[dbo].[paym_employee_profile1] (${profileCols.join(",")})
// SELECT ${profileSelectValues.join(", ")} FROM EmpInserted;

// INSERT INTO [HRMS_Master].[dbo].[EmployeesLogin] ([EmployeeUserId],[Password],[DBname],[employeeFullName])
// VALUES (${loginVals});
//         `;
//         return cteBlock;
//       }).join("\n");

//       // Combine full SQL batch
//       const finalSQL = `
// SET NOCOUNT ON;
// ${masterSQL}

// ${perRowSQL}
// `;

//       // Send to backend
//       const resp = await postRequest(ServerConfig.url, SAVE, { query: finalSQL });

//       if (resp && resp.status === 200) {
//         toast.success("Bulk insert successful", { position: "top-center", autoClose: 2000 });
//         setData([]);
//         setFileName("");
//         setImageFiles({});
//       } else {
//         toast.error("Bulk insert failed. Check server logs. See console for response.", { position: "top-center", autoClose: 3000 });
//         console.error("Save response:", resp);
//       }

//     } catch (err) {
//       console.error("Bulk save error:", err);
//       toast.error("Error saving: " + (err.message || err), { position: "top-center", autoClose: 4000 });
//     }
//   };

//   return (
//     <Grid item xs={12}>
//       <div style={{ backgroundColor: "#f5f5f5" }}>
//         <Navbar />
//         <Box height={30} />

//         <Box sx={{ display: "flex" }}>
//           <Sidenav />

//           <Grid item xs={12} sm={10} md={9} lg={8} xl={7} sx={{ padding: { xs: "20px", sm: "40px" }, margin: "0 auto" }}>
//             <AppBar position="static" sx={{ width: "100%", marginTop: "40px", minHeight: "60px" }}>
//               <Toolbar sx={{ justifyContent: "left", height: "100%" }}>
//                 <Typography variant="h5" sx={{ textAlign: "left", fontWeight: "bold", color: "white", lineHeight: "60px" }}>
//                   BULK UPLOAD — EMPLOYEE & MASTER DATA (CTE OUTPUT INSERTED)
//                 </Typography>
//               </Toolbar>
//             </AppBar>

//             <Paper elevation={3} sx={{ p: 3, mt: 3, display: "flex", gap: 2, alignItems: "center", maxWidth: 900 }}>
//               <FormControl fullWidth>
//                 <InputLabel>Select Template</InputLabel>
//                 <Select value={selectedTemplate} label="Select Template" onChange={(e) => setSelectedTemplate(e.target.value)}>
//                   <MenuItem value="Employee">Employee Template (UI order) — includes image_filename</MenuItem>
//                   <MenuItem value="Division">Division Template</MenuItem>
//                   <MenuItem value="Department">Department Template</MenuItem>
//                   <MenuItem value="Designation">Designation Template</MenuItem>
//                   <MenuItem value="Grade">Grade Template</MenuItem>
//                   <MenuItem value="Shift">Shift Template</MenuItem>
//                   <MenuItem value="Category">Category Template</MenuItem>
//                   <MenuItem value="JobStatus">Job Status Template</MenuItem>
//                   <MenuItem value="Level">Level Template</MenuItem>
//                 </Select>
//               </FormControl>
//               <Button
//                 variant="contained"
//                 onClick={() => {
//                   if (!selectedTemplate) {
//                     toast.warn("Select a template to download");
//                     return;
//                   }
//                   downloadSingleTemplate(selectedTemplate);
//                 }}
//               >
//                 Download Template
//               </Button>
//             </Paper>

//             <Paper elevation={3} sx={{ p: 3, mt: 3, display: "flex", gap: 2, alignItems: "center", maxWidth: 900 }}>
//               <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} style={{ flexGrow: 1 }} />
//               <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ marginLeft: 12 }} />
//               <Button variant="contained" color="success" disabled={!data || data.length === 0} onClick={handleSave}>
//                 Save Data
//               </Button>
//             </Paper>

//             <Box sx={{ mt: 2 }}>
//               <Typography variant="body2">File: {fileName || "none"}</Typography>
//               <Typography variant="body2">Rows parsed: {data.length}</Typography>
//               <Typography variant="body2">Uploaded images: {Object.keys(imageFiles).length}</Typography>
//               <Typography variant="caption" color="textSecondary">Important: Excel must have column "image_filename" containing the file name (e.g. emp1.png). Upload those files using the image chooser before clicking Save.</Typography>
//             </Box>

//             {data.length > 0 && (
//               <TableContainer component={Paper} sx={{ mt: 3 }}>
//                 <Table size="small">
//                   <TableHead sx={{ backgroundColor: "#e7e7e7" }}>
//                     <TableRow>
//                       {employeeTemplateColumns.map((c) => (
//                         <TableCell key={c}>{c}</TableCell>
//                       ))}
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {data.map((row, idx) => (
//                       <TableRow key={idx}>
//                         {employeeTemplateColumns.map((c, j) => (
//                           <TableCell key={j} style={{ maxWidth: 200, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
//                             {String(row[c] ?? "")}
//                           </TableCell>
//                         ))}
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             )}
//           </Grid>
//         </Box>
//       </div>
//     </Grid>
//   );
// };

// export default EmployeeBulkUploadFinalWithCTE;

// // EmployeeBulkUpload_NoImageUI.jsx — Part 1/3
// import React, { useState } from "react";
// import {
//   Grid, Box, Paper, AppBar, Toolbar, Typography, Button, FormControl, InputLabel, Select,
//   MenuItem, Table, TableHead, TableRow, TableCell, TableBody, TableContainer,
//   Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress
// } from "@mui/material";
// import * as XLSX from "xlsx";
// import Navbar from "../../Home Page/Navbar";
// import Sidenav from "../../Home Page/Sidenav";
// import { postRequest } from "../../../serverconfiguration/requestcomp";
// import { ServerConfig } from "../../../serverconfiguration/serverconfig";
// import { SAVE } from "../../../serverconfiguration/controllers";
// import { toast } from "react-toastify";

// /**
//  * EmployeeBulkUpload_NoImageUI.jsx
//  *
//  * - Bulk upload React component WITHOUT image upload UI.
//  * - If you want to include images, put base64 into the Excel column "image_base64".
//  * - Generates SQL in correct SQL Server format (each employee block: ;WITH ... INSERT ...).
//  * - Builds master table inserts if corresponding master columns are present in rows.
//  *
//  * Usage: paste three parts (1 -> 2 -> 3) into a new file and import the component.
//  */

// // ----------------------------- Component start -----------------------------
// const EmployeeBulkUploadNoImageUI = () => {
//   // UI / data state
//   const [selectedTemplate, setSelectedTemplate] = useState("Employee");
//   const [rows, setRows] = useState([]); // parsed rows from Excel
//   const [fileName, setFileName] = useState("");
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [previewSQL, setPreviewSQL] = useState("");
//   const [loading, setLoading] = useState(false);

//   // DB name (from session or fallback)
//   const databaseName = sessionStorage.getItem("databaseName") || "HRMS_004_Mallow";

//   // ----------------------------- Employee columns in final order -----------------------------
//   // This list follows the fields you provided, with image_base64 at end for Excel usage
//   const employeeTemplateColumns = [
//     "pn_CompanyID","pn_BranchID","pn_EmployeeID","EmployeeCode","Employee_First_Name","Employee_Middle_Name","Employee_Last_Name",
//     "DateofBirth","Password","Gender","status","Employee_Full_Name","Readerid","OT_Eligible","Pfno","Esino","OT_calc","CTC",
//     "basic_salary","Bank_code","Bank_Name","Branch_Name","Account_Type","MICR_code","IFSC_Code","Other_Info","Reporting_person",
//     "ReportingID","Reporting_email","Pan_no","salary_type","TDS_Applicable","Flag","role","accountNo","Blood_Group","Phone_No",
//     "Alternate_Phone_No","permanent_address","Aadhar_Card","Current_Address","Father_Name","Email","Alternate_Email","Grade",
//     "Overall_Experience","HighestQualification","UniversityName","YearOfPassing","Certifications","Skills","UAN","PaymentMode",
//     "PassportNumber","VisaDetails","JoiningDate","ExitReason","PreviousCompany","PreviousDesignation","PreviousEmploymentDuration",
//     "ReasonForLeaving","PerformanceRating","TrainingRecords","DisciplinaryActions","Awards","VehicleDetails","HealthInsuranceDetails",
//     "NomineeDetails","Asset_Name","Asset_SerialNumber","NomineePhoneno","NomineeRelationship","ExitDate","AssetType",
//     // Profile table related fields (optional in Excel)
//     "pnDivisionId","pnDepartmentId","pnDesignationId","pnGradeId","pn_ShiftID","pnCategoryId","pnJobStatusId","pnLevelId",
//     "pnProjectsiteId","d_Date","v_Reason","r_Department",
//     // image base64 cell (optional)
//     "image_base64"
//   ];

//   // ----------------------------- Master table column definitions -----------------------------
//   const divisionCols = ["pn_CompanyID","BranchID","pn_DivisionID","v_DivisionName","status"];
//   const departmentCols = ["pn_CompanyID","pn_BranchID","pn_DepartmentID","v_DepartmentName","status"];
//   const designationCols = ["pn_CompanyID","BranchID","pn_DesignationID","v_DesignationName","Authority","status"];
//   const gradeCols = ["pn_CompanyID","BranchID","pn_GradeID","v_GradeName","status"];
//   const shiftCols = ["pn_CompanyID","pn_branchid","pn_ShiftID","shift_code","start_time","break_time_out","break_time_in","end_time","shift_indicator","Shift_Type"];
//   const categoryCols = ["pn_CompanyID","BranchID","pn_CategoryID","v_CategoryName","status"];
//   const jobStatusCols = ["pn_CompanyID","BranchID","pn_JobStatusID","v_JobStatusName","status"];
//   const levelCols = ["pn_CompanyID","BranchID","pn_LevelID","v_LevelName","status"];

//   // ----------------------------- Helpers -----------------------------
//   // Convert a value to a SQL-safe literal; user requested empty string for missing fields
//   const sqlValueEmptyString = (val) => {
//     if (val === null || val === undefined || val === "") return "''";
//     // If val looks like a number and not leading-zero string, return as number (no quotes)
//     const num = Number(val);
//     if (!isNaN(num) && String(val).trim() !== "" && !/^[0]\d+/.test(String(val))) {
//       return `${num}`;
//     }
//     // Otherwise escape single quote and wrap in quotes
//     return `'${String(val).replace(/'/g, "''")}'`;
//   };

//   // Simple utility to download single-sheet template given columns
//   const downloadTemplate = (sheetName, cols) => {
//     const header = {};
//     cols.forEach(c => header[c] = "");
//     const wb = XLSX.utils.book_new();
//     const ws = XLSX.utils.json_to_sheet([header]);
//     XLSX.utils.book_append_sheet(wb, ws, sheetName);
//     XLSX.writeFile(wb, `${sheetName}_template.xlsx`);
//   };

//   // ----------------------------- End of Part 1 -----------------------------
// // EmployeeBulkUpload_NoImageUI.jsx — Part 2/3

// // ----------------------------- Template download handler -----------------------------
// const templateDownloadHandler = (templateName) => {
//   switch (templateName) {
//     case "Employee":
//       downloadTemplate("Employee", employeeTemplateColumns);
//       break;
//     case "Division":
//       downloadTemplate("Division", divisionCols);
//       break;
//     case "Department":
//       downloadTemplate("Department", departmentCols);
//       break;
//     case "Designation":
//       downloadTemplate("Designation", designationCols);
//       break;
//     case "Grade":
//       downloadTemplate("Grade", gradeCols);
//       break;
//     case "Shift":
//       downloadTemplate("Shift", shiftCols);
//       break;
//     case "Category":
//       downloadTemplate("Category", categoryCols);
//       break;
//     case "JobStatus":
//       downloadTemplate("JobStatus", jobStatusCols);
//       break;
//     case "Level":
//       downloadTemplate("Level", levelCols);
//       break;
//     default:
//       downloadTemplate("Employee", employeeTemplateColumns);
//       break;
//   }
// };

// // ----------------------------- Excel parsing (no image UI) -----------------------------
// const handleFileChange = (e) => {
//   const f = e.target.files[0];
//   if (!f) return;
//   setFileName(f.name);
//   const reader = new FileReader();
//   reader.onload = (ev) => {
//     const wb = XLSX.read(ev.target.result, { type: "binary" });
//     const sheet = wb.Sheets[wb.SheetNames[0]];
//     const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });
//     // Normalize rows: ensure all expected employeeTemplateColumns exist (so later code can pick them)
//     const normalized = json.map(row => {
//       const norm = {};
//       employeeTemplateColumns.forEach(col => {
//         norm[col] = row[col] !== undefined ? row[col] : "";
//       });
//       // Copy other fields (master names) if present, to enable master generation
//       Object.keys(row).forEach(k => {
//         if (!norm[k]) norm[k] = row[k];
//       });
//       return norm;
//     });
//     setRows(normalized);
//     toast.info(`Parsed ${normalized.length} row(s) from the sheet`);
//   };
//   reader.readAsBinaryString(f);
// };

// // ----------------------------- Master SQL builder -----------------------------
// const buildMasterQueries = (rows) => {
//   if (!rows || rows.length === 0) return "";

//   // utility unique + filter
//   const unique = (arr) => Array.from(new Set(arr.filter(Boolean)));

//   // Build possible masters by scanning rows for master-like columns
//   // Division
//   const divisionEntries = unique(rows.map(r => {
//     if (r.v_DivisionName) {
//       const BranchID = r.BranchID || r.pn_BranchID || "";
//       return `${r.pn_CompanyID || ""}||${BranchID}||${r.v_DivisionName}||${r.status || ""}`;
//     }
//     return null;
//   })).filter(Boolean).map(s => s.split("||"));

//   // Department
//   const departmentEntries = unique(rows.map(r => {
//     if (r.v_DepartmentName) {
//       const b = r.pn_BranchID || r.BranchID || "";
//       return `${r.pn_CompanyID || ""}||${b}||${r.v_DepartmentName}||${r.status || ""}`;
//     }
//     return null;
//   })).filter(Boolean).map(s => s.split("||"));

//   // Designation
//   const designationEntries = unique(rows.map(r => {
//     if (r.v_DesignationName) {
//       const b = r.BranchID || r.pn_BranchID || "";
//       return `${r.pn_CompanyID || ""}||${b}||${r.v_DesignationName}||${r.Authority || ""}||${r.status || ""}`;
//     }
//     return null;
//   })).filter(Boolean).map(s => s.split("||"));

//   // Grade
//   const gradeEntries = unique(rows.map(r => {
//     if (r.v_GradeName) {
//       const b = r.BranchID || r.pn_BranchID || "";
//       return `${r.pn_CompanyID || ""}||${b}||${r.v_GradeName}||${r.status || ""}`;
//     }
//     return null;
//   })).filter(Boolean).map(s => s.split("||"));

//   // Shift
//   const shiftEntries = unique(rows.map(r => {
//     if (r.shift_code) {
//       const br = r.pn_branchid || r.pn_BranchID || "";
//       return `${r.pn_CompanyID || ""}||${br}||${r.shift_code}||${r.start_time || ""}||${r.break_time_out || ""}||${r.break_time_in || ""}||${r.end_time || ""}||${r.shift_indicator || ""}||${r.Shift_Type || ""}`;
//     }
//     return null;
//   })).filter(Boolean).map(s => s.split("||"));

//   // Category
//   const categoryEntries = unique(rows.map(r => {
//     if (r.v_CategoryName) {
//       const b = r.BranchID || r.pn_BranchID || "";
//       return `${r.pn_CompanyID || ""}||${b}||${r.v_CategoryName}||${r.status || ""}`;
//     }
//     return null;
//   })).filter(Boolean).map(s => s.split("||"));

//   // JobStatus
//   const jobstatusEntries = unique(rows.map(r => {
//     if (r.v_JobStatusName) {
//       const b = r.BranchID || r.pn_BranchID || "";
//       return `${r.pn_CompanyID || ""}||${b}||${r.v_JobStatusName}||${r.status || ""}`;
//     }
//     return null;
//   })).filter(Boolean).map(s => s.split("||"));

//   // Level
//   const levelEntries = unique(rows.map(r => {
//     if (r.v_LevelName) {
//       const b = r.BranchID || r.pn_BranchID || "";
//       return `${r.pn_CompanyID || ""}||${b}||${r.v_LevelName}||${r.status || ""}`;
//     }
//     return null;
//   })).filter(Boolean).map(s => s.split("||"));

//   // Build SQL strings
//   const divisionSql = divisionEntries.map(([pn_CompanyID, BranchID, v_DivisionName, status]) => `
// IF NOT EXISTS (SELECT 1 FROM [${databaseName}].[dbo].[paym_Division] WHERE pn_CompanyID=${sqlValueEmptyString(pn_CompanyID)} AND BranchID=${sqlValueEmptyString(BranchID)} AND v_DivisionName=${sqlValueEmptyString(v_DivisionName)})
// BEGIN
//   INSERT INTO [${databaseName}].[dbo].[paym_Division] ([pn_CompanyID],[BranchID],[v_DivisionName],[status]) VALUES (${sqlValueEmptyString(pn_CompanyID)},${sqlValueEmptyString(BranchID)},${sqlValueEmptyString(v_DivisionName)},${sqlValueEmptyString(status)});
// END;`).join("\n");

//   const departmentSql = departmentEntries.map(([pn_CompanyID, pn_BranchID, v_DepartmentName, status]) => `
// IF NOT EXISTS (SELECT 1 FROM [${databaseName}].[dbo].[paym_Department] WHERE pn_CompanyID=${sqlValueEmptyString(pn_CompanyID)} AND pn_BranchID=${sqlValueEmptyString(pn_BranchID)} AND v_DepartmentName=${sqlValueEmptyString(v_DepartmentName)})
// BEGIN
//   INSERT INTO [${databaseName}].[dbo].[paym_Department] ([pn_CompanyID],[pn_BranchID],[v_DepartmentName],[status]) VALUES (${sqlValueEmptyString(pn_CompanyID)},${sqlValueEmptyString(pn_BranchID)},${sqlValueEmptyString(v_DepartmentName)},${sqlValueEmptyString(status)});
// END;`).join("\n");

//   const designationSql = designationEntries.map(([pn_CompanyID, BranchID, v_DesignationName, Authority, status]) => `
// IF NOT EXISTS (SELECT 1 FROM [${databaseName}].[dbo].[paym_Designation] WHERE pn_CompanyID=${sqlValueEmptyString(pn_CompanyID)} AND BranchID=${sqlValueEmptyString(BranchID)} AND v_DesignationName=${sqlValueEmptyString(v_DesignationName)})
// BEGIN
//   INSERT INTO [${databaseName}].[dbo].[paym_Designation] ([pn_CompanyID],[BranchID],[v_DesignationName],[Authority],[status]) VALUES (${sqlValueEmptyString(pn_CompanyID)},${sqlValueEmptyString(BranchID)},${sqlValueEmptyString(v_DesignationName)},${sqlValueEmptyString(Authority)},${sqlValueEmptyString(status)});
// END;`).join("\n");

//   const gradeSql = gradeEntries.map(([pn_CompanyID, BranchID, v_GradeName, status]) => `
// IF NOT EXISTS (SELECT 1 FROM [${databaseName}].[dbo].[paym_Grade] WHERE pn_CompanyID=${sqlValueEmptyString(pn_CompanyID)} AND BranchID=${sqlValueEmptyString(BranchID)} AND v_GradeName=${sqlValueEmptyString(v_GradeName)})
// BEGIN
//   INSERT INTO [${databaseName}].[dbo].[paym_Grade] ([pn_CompanyID],[BranchID],[v_GradeName],[status]) VALUES (${sqlValueEmptyString(pn_CompanyID)},${sqlValueEmptyString(BranchID)},${sqlValueEmptyString(v_GradeName)},${sqlValueEmptyString(status)});
// END;`).join("\n");

//   const shiftSql = shiftEntries.map(([pn_CompanyID, pn_branchid, shift_code, start_time, break_time_out, break_time_in, end_time, shift_indicator, Shift_Type]) => `
// IF NOT EXISTS (SELECT 1 FROM [${databaseName}].[dbo].[paym_Shift] WHERE pn_CompanyID=${sqlValueEmptyString(pn_CompanyID)} AND pn_branchid=${sqlValueEmptyString(pn_branchid)} AND shift_code=${sqlValueEmptyString(shift_code)})
// BEGIN
//   INSERT INTO [${databaseName}].[dbo].[paym_Shift] ([pn_CompanyID],[pn_branchid],[shift_code],[start_time],[break_time_out],[break_time_in],[end_time],[shift_indicator],[Shift_Type]) VALUES (${sqlValueEmptyString(pn_CompanyID)},${sqlValueEmptyString(pn_branchid)},${sqlValueEmptyString(shift_code)},${sqlValueEmptyString(start_time)},${sqlValueEmptyString(break_time_out)},${sqlValueEmptyString(break_time_in)},${sqlValueEmptyString(end_time)},${sqlValueEmptyString(shift_indicator)},${sqlValueEmptyString(Shift_Type)});
// END;`).join("\n");

//   const categorySql = categoryEntries.map(([pn_CompanyID, BranchID, v_CategoryName, status]) => `
// IF NOT EXISTS (SELECT 1 FROM [${databaseName}].[dbo].[paym_Category] WHERE pn_CompanyID=${sqlValueEmptyString(pn_CompanyID)} AND BranchID=${sqlValueEmptyString(BranchID)} AND v_CategoryName=${sqlValueEmptyString(v_CategoryName)})
// BEGIN
//   INSERT INTO [${databaseName}].[dbo].[paym_Category] ([pn_CompanyID],[BranchID],[v_CategoryName],[status]) VALUES (${sqlValueEmptyString(pn_CompanyID)},${sqlValueEmptyString(BranchID)},${sqlValueEmptyString(v_CategoryName)},${sqlValueEmptyString(status)});
// END;`).join("\n");

//   const jobstatusSql = jobstatusEntries.map(([pn_CompanyID, BranchID, v_JobStatusName, status]) => `
// IF NOT EXISTS (SELECT 1 FROM [${databaseName}].[dbo].[paym_JobStatus] WHERE pn_CompanyID=${sqlValueEmptyString(pn_CompanyID)} AND BranchID=${sqlValueEmptyString(BranchID)} AND v_JobStatusName=${sqlValueEmptyString(v_JobStatusName)})
// BEGIN
//   INSERT INTO [${databaseName}].[dbo].[paym_JobStatus] ([pn_CompanyID],[BranchID],[v_JobStatusName],[status]) VALUES (${sqlValueEmptyString(pn_CompanyID)},${sqlValueEmptyString(BranchID)},${sqlValueEmptyString(v_JobStatusName)},${sqlValueEmptyString(status)});
// END;`).join("\n");

//   const levelSql = levelEntries.map(([pn_CompanyID, BranchID, v_LevelName, status]) => `
// IF NOT EXISTS (SELECT 1 FROM [${databaseName}].[dbo].[paym_Level] WHERE pn_CompanyID=${sqlValueEmptyString(pn_CompanyID)} AND BranchID=${sqlValueEmptyString(BranchID)} AND v_LevelName=${sqlValueEmptyString(v_LevelName)})
// BEGIN
//   INSERT INTO [${databaseName}].[dbo].[paym_Level] ([pn_CompanyID],[BranchID],[v_LevelName],[status]) VALUES (${sqlValueEmptyString(pn_CompanyID)},${sqlValueEmptyString(BranchID)},${sqlValueEmptyString(v_LevelName)},${sqlValueEmptyString(status)});
// END;`).join("\n");

//   return [
//     divisionSql, departmentSql, designationSql, gradeSql,
//     shiftSql, categorySql, jobstatusSql, levelSql
//   ].filter(Boolean).join("\n");
// };

// // ----------------------------- End of Part 2 -----------------------------
// // EmployeeBulkUpload_NoImageUI.jsx — Part 3/3

// // ----------------------------- Build the employee INSERT blocks (correct SQL format) -----------------------------
// const buildEmployeesSql = (rows) => {
//   if (!rows || rows.length === 0) return "";

//   // For each row produce:
//   // ;WITH EmpInserted AS ( INSERT ... OUTPUT INSERTED.pn_EmployeeID AS NewEmpId VALUES (...) )
//   // INSERT INTO paym_employee_profile1 (...) SELECT <company>, <branch>, NewEmpId, ... FROM EmpInserted;
//   // INSERT INTO HRMS_Master..EmployeesLogin VALUES(...);

//   const blocks = rows.map((r, idx) => {
//     // Build employee VALUES in the exact order used in earlier code
//     const empValuesArr = [
//       sqlValueEmptyString(r.pn_CompanyID), sqlValueEmptyString(r.pn_BranchID), sqlValueEmptyString(r.pn_EmployeeID),
//       sqlValueEmptyString(r.EmployeeCode), sqlValueEmptyString(r.Employee_First_Name), sqlValueEmptyString(r.Employee_Middle_Name), sqlValueEmptyString(r.Employee_Last_Name),
//       sqlValueEmptyString(r.DateofBirth), sqlValueEmptyString(r.Password), sqlValueEmptyString(r.Gender), sqlValueEmptyString(r.status),
//       sqlValueEmptyString(r.Employee_Full_Name), sqlValueEmptyString(r.Readerid), sqlValueEmptyString(r.OT_Eligible), sqlValueEmptyString(r.Pfno), sqlValueEmptyString(r.Esino),
//       sqlValueEmptyString(r.OT_calc), sqlValueEmptyString(r.CTC),
//       sqlValueEmptyString(r.basic_salary), sqlValueEmptyString(r.Bank_code), sqlValueEmptyString(r.Bank_Name), sqlValueEmptyString(r.Branch_Name),
//       sqlValueEmptyString(r.Account_Type), sqlValueEmptyString(r.MICR_code), sqlValueEmptyString(r.IFSC_Code), sqlValueEmptyString(r.Other_Info),
//       sqlValueEmptyString(r.Reporting_person), sqlValueEmptyString(r.ReportingID), sqlValueEmptyString(r.Reporting_email),
//       sqlValueEmptyString(r.Pan_no), sqlValueEmptyString(r.salary_type), sqlValueEmptyString(r.TDS_Applicable), sqlValueEmptyString(r.Flag),
//       sqlValueEmptyString(r.role), sqlValueEmptyString(r.accountNo), sqlValueEmptyString(r.Blood_Group), sqlValueEmptyString(r.Phone_No),
//       sqlValueEmptyString(r.Alternate_Phone_No), sqlValueEmptyString(r.permanent_address), sqlValueEmptyString(r.Aadhar_Card),
//       sqlValueEmptyString(r.Current_Address), sqlValueEmptyString(r.Father_Name), sqlValueEmptyString(r.Email), sqlValueEmptyString(r.Alternate_Email),
//       sqlValueEmptyString(r.Grade), sqlValueEmptyString(r.Overall_Experience), sqlValueEmptyString(r.HighestQualification),
//       sqlValueEmptyString(r.UniversityName), sqlValueEmptyString(r.YearOfPassing), sqlValueEmptyString(r.Certifications), sqlValueEmptyString(r.Skills),
//       sqlValueEmptyString(r.UAN), sqlValueEmptyString(r.PaymentMode), sqlValueEmptyString(r.PassportNumber), sqlValueEmptyString(r.VisaDetails),
//       sqlValueEmptyString(r.JoiningDate), sqlValueEmptyString(r.ExitReason), sqlValueEmptyString(r.PreviousCompany), sqlValueEmptyString(r.PreviousDesignation),
//       sqlValueEmptyString(r.PreviousEmploymentDuration), sqlValueEmptyString(r.ReasonForLeaving), sqlValueEmptyString(r.PerformanceRating),
//       sqlValueEmptyString(r.TrainingRecords), sqlValueEmptyString(r.DisciplinaryActions), sqlValueEmptyString(r.Awards), sqlValueEmptyString(r.VehicleDetails),
//       sqlValueEmptyString(r.HealthInsuranceDetails), sqlValueEmptyString(r.NomineeDetails), sqlValueEmptyString(r.Asset_Name),
//       sqlValueEmptyString(r.Asset_SerialNumber), sqlValueEmptyString(r.NomineePhoneno), sqlValueEmptyString(r.NomineeRelationship),
//       sqlValueEmptyString(r.ExitDate), sqlValueEmptyString(r.AssetType)
//     ];

//     const empValuesString = empValuesArr.join(", ");

//     // Profile table SELECT values (NewEmpId in 3rd position)
//     // Entires: [pn_CompanyID],[pn_BranchID],[pn_EmployeeID],[pn_DivisionId],[pn_DepartmentId],[pn_DesignationId],
//     // [pn_GradeId],[pn_ShiftId],[pn_CategoryId],[pn_JobStatusId],[pn_LevelID],[pn_projectsiteID],
//     // [d_Date],[v_Reason],[r_Department],[father_name],[Emp_Profile_Image],[image_data]

//     // Use image_base64 cell if present (user expected base64 in Excel), otherwise empty string
//     const imgBase64 = r.image_base64 ? r.image_base64 : "";

//     const profileSelectValues = [
//       sqlValueEmptyString(r.pn_CompanyID),
//       sqlValueEmptyString(r.pn_BranchID),
//       "NewEmpId", // will be replaced in SELECT as NewEmpId
//       sqlValueEmptyString(r.pnDivisionId),
//       sqlValueEmptyString(r.pnDepartmentId),
//       sqlValueEmptyString(r.pnDesignationId),
//       sqlValueEmptyString(r.pnGradeId),
//       sqlValueEmptyString(r.pn_ShiftID),
//       sqlValueEmptyString(r.pnCategoryId),
//       sqlValueEmptyString(r.pnJobStatusId),
//       sqlValueEmptyString(r.pnLevelId),
//       sqlValueEmptyString(r.pnProjectsiteId),
//       sqlValueEmptyString(r.d_Date),
//       sqlValueEmptyString(r.v_Reason),
//       sqlValueEmptyString(r.r_Department),
//       sqlValueEmptyString(r.Father_Name),
//       sqlValueEmptyString(imgBase64),
//       sqlValueEmptyString(imgBase64)
//     ];

//     // In SELECT form, we need to keep NewEmpId without quotes, so build SELECT line differently
//     const profileSelectString = [
//       profileSelectValues[0], profileSelectValues[1], "NewEmpId",
//       profileSelectValues[3], profileSelectValues[4], profileSelectValues[5],
//       profileSelectValues[6], profileSelectValues[7], profileSelectValues[8],
//       profileSelectValues[9], profileSelectValues[10], profileSelectValues[11],
//       profileSelectValues[12], profileSelectValues[13], profileSelectValues[14],
//       profileSelectValues[15], profileSelectValues[16], profileSelectValues[17]
//     ].join(", ");

//     // Build the block: no BEGIN before CTE. Use ;WITH then INSERT FROM EmpInserted, then login insert.
//     const block = `
// ;WITH EmpInserted AS (
//     INSERT INTO [${databaseName}].[dbo].[paym_Employee] (
//         [pn_CompanyID],[pn_BranchID],[pn_EmployeeID],[EmployeeCode],[Employee_First_Name],
//         [Employee_Middle_Name],[Employee_Last_Name],[DateofBirth],[Password],[Gender],
//         [status],[Employee_Full_Name],[Readerid],[OT_Eligible],[Pfno],[Esino],[OT_calc],
//         [CTC],[basic_salary],[Bank_code],[Bank_Name],[Branch_Name],[Account_Type],
//         [MICR_code],[IFSC_Code],[Other_Info],[Reporting_person],[ReportingID],
//         [Reporting_email],[Pan_no],[salary_type],[TDS_Applicable],[Flag],[role],
//         [accountNo],[Blood_Group],[Phone_No],[Alternate_Phone_No],[permanent_address],
//         [Aadhar_Card],[Current_Address],[Father_Name],[Email],[Alternate_Email],[Grade],
//         [Overall_Experience],[HighestQualification],[UniversityName],[YearOfPassing],
//         [Certifications],[Skills],[UAN],[PaymentMode],[PassportNumber],[VisaDetails],
//         [JoiningDate],[ExitReason],[PreviousCompany],[PreviousDesignation],
//         [PreviousEmploymentDuration],[ReasonForLeaving],[PerformanceRating],
//         [TrainingRecords],[DisciplinaryActions],[Awards],[VehicleDetails],
//         [HealthInsuranceDetails],[NomineeDetails],[Asset_Name],[Asset_SerialNumber],
//         [NomineePhoneno],[NomineeRelationship],[ExitDate],[AssetType]
//     )
//     OUTPUT INSERTED.pn_EmployeeID AS NewEmpId
//     VALUES (${empValuesString})
// )
// INSERT INTO [${databaseName}].[dbo].[paym_employee_profile1] (
//     [pn_CompanyID],[pn_BranchID],[pn_EmployeeID],[pn_DivisionId],[pn_DepartmentId],[pn_DesignationId],
//     [pn_GradeId],[pn_ShiftId],[pn_CategoryId],[pn_JobStatusId],[pn_LevelID],[pn_projectsiteID],
//     [d_Date],[v_Reason],[r_Department],[father_name],[Emp_Profile_Image],[image_data]
// )
// SELECT
//     ${profileSelectString}
// FROM EmpInserted;

// INSERT INTO [HRMS_Master].[dbo].[EmployeesLogin] ([EmployeeUserId],[Password],[DBname],[employeeFullName])
// VALUES (${sqlValueEmptyString(r.EmployeeCode)}, ${sqlValueEmptyString(r.Password)}, ${sqlValueEmptyString(databaseName)}, ${sqlValueEmptyString(r.Employee_Full_Name)});
// `;
//     return block;
//   });

//   return blocks.join("\n");
// };

// // ----------------------------- Save handler: build master SQL + employee blocks, preview and send -----------------------------
// const handleGenerateAndPreview = async () => {
//   if (!rows || rows.length === 0) {
//     toast.warn("No data to generate");
//     return;
//   }

//   setLoading(true);
//   try {
//     // Simple duplicate EmployeeCode check
//     const codes = rows.map(r => (r.EmployeeCode || "").toString().trim()).filter(Boolean);
//     const dup = codes.filter((c, i, arr) => arr.indexOf(c) !== i);
//     if (dup.length) {
//       toast.error(`Duplicate EmployeeCode(s) found in file: ${Array.from(new Set(dup)).join(", ")}`);
//       setLoading(false);
//       return;
//     }

//     // Build masters and employees SQL
//     const masterSql = buildMasterQueries(rows); // safe empty string if none
//     const employeesSql = buildEmployeesSql(rows);

//     // Combine into full script, ensure SET NOCOUNT ON at top
//     const finalSql = `SET NOCOUNT ON;\n${masterSql}\n${employeesSql}`;

//     setPreviewSQL(finalSql);
//     setPreviewOpen(true);
//   } catch (err) {
//     console.error("Error generating SQL", err);
//     toast.error("Error generating SQL: " + (err.message || err));
//   } finally {
//     setLoading(false);
//   }
// };

// // ----------------------------- Send SQL to server -----------------------------
// const sendSQLToServer = async (sql) => {
//   if (!sql) {
//     toast.error("No SQL to send");
//     return;
//   }
//   setLoading(true);
//   try {
//     const resp = await postRequest(ServerConfig.url, SAVE, { query: sql });
//     if (resp && resp.status === 200) {
//       toast.success("Bulk insert executed successfully");
//       setRows([]);
//       setFileName("");
//       setPreviewOpen(false);
//       setPreviewSQL("");
//     } else {
//       // Show server response if available
//       toast.error("Server returned an error — check logs");
//       console.error("Save response:", resp);
//     }
//   } catch (err) {
//     console.error("Send SQL error:", err);
//     toast.error("Error sending SQL to server: " + (err.message || err));
//   } finally {
//     setLoading(false);
//   }
// };

// // ----------------------------- Render UI -----------------------------
// return (
//   <Grid item xs={12}>
//     <div style={{ backgroundColor: "#f5f5f5" }}>
//       <Navbar />
//       <Box height={30} />
//       <Box sx={{ display: "flex" }}>
//         <Sidenav />
//         <Grid item xs={12} sm={10} md={9} lg={8} xl={7} sx={{ padding: { xs: "20px", sm: "40px" }, margin: "0 auto" }}>
//           <AppBar position="static" sx={{ width: "100%", marginTop: "40px", minHeight: "60px" }}>
//             <Toolbar sx={{ justifyContent: "left", height: "100%" }}>
//               <Typography variant="h5" sx={{ textAlign: "left", fontWeight: "bold", color: "white", lineHeight: "60px" }}>
//                 BULK UPLOAD — EMPLOYEE (No Image Upload UI)
//               </Typography>
//             </Toolbar>
//           </AppBar>

//           <Paper elevation={3} sx={{ p: 3, mt: 3, display: "flex", gap: 2, alignItems: "center", maxWidth: 1000 }}>
//             <FormControl fullWidth>
//               <InputLabel>Select Template</InputLabel>
//               <Select value={selectedTemplate} label="Select Template" onChange={(e) => setSelectedTemplate(e.target.value)}>
//                 <MenuItem value="Employee">Employee</MenuItem>
//                 <MenuItem value="Division">Division</MenuItem>
//                 <MenuItem value="Department">Department</MenuItem>
//                 <MenuItem value="Designation">Designation</MenuItem>
//                 <MenuItem value="Grade">Grade</MenuItem>
//                 <MenuItem value="Shift">Shift</MenuItem>
//                 <MenuItem value="Category">Category</MenuItem>
//                 <MenuItem value="JobStatus">JobStatus</MenuItem>
//                 <MenuItem value="Level">Level</MenuItem>
//               </Select>
//             </FormControl>
//             <Button variant="contained" onClick={() => templateDownloadHandler(selectedTemplate)}>Download Template</Button>
//           </Paper>

//           <Paper elevation={3} sx={{ p: 3, mt: 3, display: "flex", gap: 2, alignItems: "center", maxWidth: 1000 }}>
//             <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} style={{ flexGrow: 1 }} />
//             <Button variant="contained" color="primary" onClick={handleGenerateAndPreview} disabled={loading}>
//               {loading ? <CircularProgress size={18} /> : "Generate SQL & Preview"}
//             </Button>
//           </Paper>

//           <Box sx={{ mt: 2 }}>
//             <Typography variant="body2">File: {fileName || "none"}</Typography>
//             <Typography variant="body2">Rows parsed: {rows.length}</Typography>
//             <Typography variant="caption" color="textSecondary">If you want images, add a column "image_base64" in your Excel with the raw base64 string per row. Otherwise leave it empty.</Typography>
//           </Box>

//           {rows.length > 0 && (
//             <TableContainer component={Paper} sx={{ mt: 3 }}>
//               <Table size="small">
//                 <TableHead sx={{ backgroundColor: "#e7e7e7" }}>
//                   <TableRow>
//                     {employeeTemplateColumns.map(c => <TableCell key={c}>{c}</TableCell>)}
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {rows.map((r, i) => (
//                     <TableRow key={i}>
//                       {employeeTemplateColumns.map((c, j) => (
//                         <TableCell key={j} style={{ maxWidth: 200, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
//                           {String(r[c] ?? "")}
//                         </TableCell>
//                       ))}
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           )}

//           {/* Preview Modal */}
//           <Dialog open={previewOpen} fullWidth maxWidth="lg" onClose={() => setPreviewOpen(false)}>
//             <DialogTitle>SQL Preview — confirm before sending</DialogTitle>
//             <DialogContent dividers>
//               <TextField
//                 multiline
//                 fullWidth
//                 minRows={20}
//                 value={previewSQL}
//                 variant="outlined"
//                 InputProps={{ readOnly: true }}
//               />
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={() => setPreviewOpen(false)} color="inherit">Close</Button>
//               <Button onClick={() => sendSQLToServer(previewSQL)} variant="contained" color="primary" disabled={loading}>
//                 {loading ? <CircularProgress size={18} /> : "Send to Server"}
//               </Button>
//             </DialogActions>
//           </Dialog>

//         </Grid>
//       </Box>
//     </div>
//   </Grid>
// );

// // ----------------------------- component end -----------------------------
// }; // end component

// export default EmployeeBulkUploadNoImageUI;

//working copy
// ExecelUploadFinal_A.js
// import React, { useState } from "react";
// import * as XLSX from "xlsx";
// import {
//   Box,
//   Button,
//   LinearProgress,
//   Paper,
//   Typography,
//   Switch,
//   FormControlLabel,
//   TextField,
//   MenuItem,
//   Alert,
//   List,
//   ListItem,
// } from "@mui/material";

// import { postRequest } from "../../../serverconfiguration/requestcomp";
// import { ServerConfig } from "../../../serverconfiguration/serverconfig";
// import { SAVE, REPORTS } from "../../../serverconfiguration/controllers";

// /**
//  * ExecelUploadFinal_A
//  *
//  * - Removes pn_EmployeeID from INSERT into paym_Employee (IDENTITY column).
//  * - Uses SCOPE_IDENTITY() to fetch inserted identity for paym_employee_profile1.
//  * - Empty/missing excel cells => empty string '' (per user request).
//  * - Two modes: row-by-row (recommended) and batch.
//  * - Logs the SQL payload to console before sending.
//  */

// // Controller options
// const CONTROLLERS = [
//   { value: SAVE, label: "SAVE" },
//   { value: REPORTS, label: "REPORTS" },
// ];

// // Helper: convert JS/excel value to SQL literal (empty string for missing)
// const sqlValue = (val) => {
//   // Treat undefined/null as empty string per user's instruction
//   if (val === undefined || val === null) return "''";

//   // Empty string remains empty string literal
//   if (val === "") return "''";

//   // If Date object, format to 'YYYY-MM-DD'
//   if (val instanceof Date && !isNaN(val)) {
//     const y = val.getFullYear();
//     const m = String(val.getMonth() + 1).padStart(2, "0");
//     const d = String(val.getDate()).padStart(2, "0");
//     return `'${y}-${m}-${d}'`;
//   }

//   // If numeric (and not NaN), return as number literal (unquoted)
//   if (typeof val === "number" && Number.isFinite(val)) {
//     return String(val);
//   }

//   // Otherwise, escape single quotes and wrap in quotes
//   const s = String(val).trim();
//   const safe = s.replace(/'/g, "''");
//   return `'${safe}'`;
// };

// // Normalize Excel value (pass-through; you may adjust if you need date parsing)
// const normalizeExcelValue = (v) => v;

// // Build SQL for one row (WITHOUT pn_EmployeeID)
// const buildSqlBlock = (row) => {
//   // Employee columns (EXCLUDE pn_EmployeeID)
//   const empCols = [
//     "pn_CompanyID",
//     "pn_BranchID",
//     // pn_EmployeeID removed intentionally (IDENTITY)
//     "EmployeeCode",
//     "Employee_First_Name",
//     "Employee_Middle_Name",
//     "Employee_Last_Name",
//     "DateofBirth",
//     "Password",
//     "Gender",
//     "status",
//     "Employee_Full_Name",
//     "Readerid",
//     "OT_Eligible",
//     "Pfno",
//     "Esino",
//     "OT_calc",
//     "CTC",
//     "basic_salary",
//     "Bank_code",
//     "Bank_Name",
//     "Branch_Name",
//     "Account_Type",
//     "MICR_code",
//     "IFSC_Code",
//     "Other_Info",
//     "Reporting_person",
//     "ReportingID",
//     "Reporting_email",
//     "Pan_no",
//     "salary_type",
//     "TDS_Applicable",
//     "Flag",
//     "role",
//     "accountNo",
//     "Blood_Group",
//     "Phone_No",
//     "Alternate_Phone_No",
//     "permanent_address",
//     "Aadhar_Card",
//     "Current_Address",
//     "Father_Name",
//     "Email",
//     "Alternate_Email",
//     "Grade",
//     "Overall_Experience",
//     "HighestQualification",
//     "UniversityName",
//     "YearOfPassing",
//     "Certifications",
//     "Skills",
//     "UAN",
//     "PaymentMode",
//     "PassportNumber",
//     "VisaDetails",
//     "JoiningDate",
//     "ExitReason",
//     "PreviousCompany",
//     "PreviousDesignation",
//     "PreviousEmploymentDuration",
//     "ReasonForLeaving",
//     "PerformanceRating",
//     "TrainingRecords",
//     "DisciplinaryActions",
//     "Awards",
//     "VehicleDetails",
//     "HealthInsuranceDetails",
//     "NomineeDetails",
//     "Asset_Name",
//     "Asset_SerialNumber",
//     "NomineePhoneno",
//     "NomineeRelationship",
//     "ExitDate",
//     "AssetType",
//   ];

//   // Profile columns (pn_EmployeeID will be @NewEmpId)
//   const profileCols = [
//     "pn_CompanyID",
//     "pn_BranchID",
//     "pn_EmployeeID", // this will be provided as @NewEmpId in VALUES
//     "pn_DivisionId",
//     "pn_DepartmentId",
//     "pn_DesignationId",
//     "pn_GradeId",
//     "pn_ShiftId",
//     "pn_CategoryId",
//     "pn_JobStatusId",
//     "pn_LevelID",
//     "pn_projectsiteID",
//     "d_Date",
//     "v_Reason",
//     "r_Department",
//     "father_name",
//     "Emp_Profile_Image",
//     "image_data",
//   ];

//   // Build emp values in order (empty => '')
//   const empVals = empCols.map((col) => {
//     const raw = normalizeExcelValue(row[col] ?? "");
//     return sqlValue(raw);
//   });

//   // Build profile values (with @NewEmpId placeholder for pn_EmployeeID)
//   const profileVals = [
//     sqlValue(row["pn_CompanyID"] ?? ""),
//     sqlValue(row["pn_BranchID"] ?? ""),
//     "@NewEmpId", // use SCOPE_IDENTITY result
//     sqlValue(row["pn_DivisionId"] ?? ""),
//     sqlValue(row["pn_DepartmentId"] ?? ""),
//     sqlValue(row["pn_DesignationId"] ?? ""),
//     sqlValue(row["pn_GradeId"] ?? ""),
//     sqlValue(row["pn_ShiftId"] ?? ""),
//     sqlValue(row["pn_CategoryId"] ?? ""),
//     sqlValue(row["pn_JobStatusId"] ?? ""),
//     sqlValue(row["pn_LevelID"] ?? ""),
//     sqlValue(row["pn_projectsiteID"] ?? ""),
//     sqlValue(row["d_Date"] ?? ""),
//     sqlValue(row["v_Reason"] ?? ""),
//     sqlValue(row["r_Department"] ?? ""),
//     sqlValue(row["father_name"] ?? row["Father_Name"] ?? ""),
//     "NULL", // Emp_Profile_Image not used per request (no image upload)
//     "NULL",
//   ];

//   // Login fields
//   const loginUserId = sqlValue(row["EmployeeCode"] ?? "");
//   const loginPassword = sqlValue(row["Password"] ?? "");
//   const loginFullName = sqlValue(row["Employee_Full_Name"] ?? row["EmployeeFullName"] ?? "");

//   // Build SQL statements
//   const insertEmp = `INSERT INTO [HRMS_004_Mallow].[dbo].[paym_Employee] (${empCols.join(
//     ","
//   )}) VALUES (${empVals.join(",")});`;

//   // Use SCOPE_IDENTITY to get the identity generated in the same scope
//   const getId = `DECLARE @NewEmpId INT; SET @NewEmpId = SCOPE_IDENTITY();`;

//   const insertProfile = `INSERT INTO [HRMS_004_Mallow].[dbo].[paym_employee_profile1] (${profileCols.join(
//     ","
//   )}) VALUES (${profileVals
//     .map((v) => (v === "'@NewEmpId'" ? "@NewEmpId" : v))
//     .join(",")});`;

//   const insertLogin = `INSERT INTO [HRMS_Master].[dbo].[EmployeesLogin] (EmployeeUserId,Password,DBname,employeeFullName) VALUES (${loginUserId}, ${loginPassword}, 'HRMS_004_Mallow', ${loginFullName});`;

//   // Combine block; each row's block ends with semicolons
//   return `${insertEmp}\n${getId}\n${insertProfile}\n${insertLogin}`;
// };

// // Combine many rows into one big SQL block (batch mode)
// const buildBatchSql = (rows) => rows.map(buildSqlBlock).join("\n\n");

// export default function ExecelUploadFinal_A() {
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [progressPct, setProgressPct] = useState(0);
//   const [batchMode, setBatchMode] = useState(false);
//   const [controller, setController] = useState(SAVE);
//   const [errors, setErrors] = useState([]); // { index, error }

//   // Read file and parse first sheet to json with defval: '' to produce empty strings
//   const handleFile = (e) => {
//     const f = e.target.files?.[0];
//     if (!f) return;
//     const reader = new FileReader();
//     reader.onload = (ev) => {
//       const wb = XLSX.read(ev.target.result, { type: "binary" });
//       const ws = wb.Sheets[wb.SheetNames[0]];
//       // defval: '' => empty cells become empty strings
//       const json = XLSX.utils.sheet_to_json(ws, { defval: "" });
//       setRows(json);
//       setErrors([]);
//       setProgressPct(0);
//       alert(`${json.length} rows loaded (empty cells => empty string)`);
//     };
//     reader.readAsBinaryString(f);
//   };

//   // Row-by-row upload
//   const uploadRowByRow = async () => {
//     if (!rows.length) {
//       alert("No rows to upload");
//       return;
//     }
//     setLoading(true);
//     setErrors([]);
//     for (let i = 0; i < rows.length; i++) {
//       const row = rows[i];
//       const sql = buildSqlBlock(row);
//       console.log("SQL for row", i + 1, sql); // debug: exact payload
//       try {
//         const res = await postRequest(ServerConfig.url, controller, { query: sql });
//         // Optionally inspect res for server-reported errors
//         if (res?.status && res.status !== 200 && res?.data) {
//           setErrors((prev) => [...prev, { index: i + 1, error: JSON.stringify(res.data) }]);
//         }
//       } catch (err) {
//         console.error("Row upload error", i + 1, err);
//         setErrors((prev) => [...prev, { index: i + 1, error: err?.message || String(err) }]);
//       }
//       setProgressPct(Math.round(((i + 1) / rows.length) * 100));
//     }
//     setLoading(false);
//     alert(`Row-by-row upload finished. Errors: ${errors.length}`);
//   };

//   // Batch upload (one big SQL string)
//   const uploadBatch = async () => {
//     if (!rows.length) {
//       alert("No rows to upload");
//       return;
//     }
//     setLoading(true);
//     setErrors([]);
//     const fullSql = buildBatchSql(rows);
//     console.log("Batch SQL payload:", fullSql); // debug: inspect payload
//     try {
//       const res = await postRequest(ServerConfig.url, controller, { query: fullSql });
//       if (res?.status && res.status !== 200 && res?.data) {
//         setErrors([{ index: "batch", error: JSON.stringify(res.data) }]);
//       }
//     } catch (err) {
//       console.error("Batch upload error", err);
//       setErrors([{ index: "batch", error: err?.message || String(err) }]);
//     }
//     setLoading(false);
//     setProgressPct(100);
//     alert(`Batch upload finished. Errors: ${errors.length}`);
//   };

//   // Download template (header row)
//   const downloadTemplate = () => {
//     const header = [
//       // Employee headers (exclude pn_EmployeeID)
//       "pn_CompanyID",
//       "pn_BranchID",
//       "EmployeeCode",
//       "Employee_First_Name",
//       "Employee_Middle_Name",
//       "Employee_Last_Name",
//       "DateofBirth",
//       "Password",
//       "Gender",
//       "status",
//       "Employee_Full_Name",
//       "Readerid",
//       "OT_Eligible",
//       "Pfno",
//       "Esino",
//       "OT_calc",
//       "CTC",
//       "basic_salary",
//       "Bank_code",
//       "Bank_Name",
//       "Branch_Name",
//       "Account_Type",
//       "MICR_code",
//       "IFSC_Code",
//       "Other_Info",
//       "Reporting_person",
//       "ReportingID",
//       "Reporting_email",
//       "Pan_no",
//       "salary_type",
//       "TDS_Applicable",
//       "Flag",
//       "role",
//       "accountNo",
//       "Blood_Group",
//       "Phone_No",
//       "Alternate_Phone_No",
//       "permanent_address",
//       "Aadhar_Card",
//       "Current_Address",
//       "Father_Name",
//       "Email",
//       "Alternate_Email",
//       "Grade",
//       "Overall_Experience",
//       "HighestQualification",
//       "UniversityName",
//       "YearOfPassing",
//       "Certifications",
//       "Skills",
//       "UAN",
//       "PaymentMode",
//       "PassportNumber",
//       "VisaDetails",
//       "JoiningDate",
//       "ExitReason",
//       "PreviousCompany",
//       "PreviousDesignation",
//       "PreviousEmploymentDuration",
//       "ReasonForLeaving",
//       "PerformanceRating",
//       "TrainingRecords",
//       "DisciplinaryActions",
//       "Awards",
//       "VehicleDetails",
//       "HealthInsuranceDetails",
//       "NomineeDetails",
//       "Asset_Name",
//       "Asset_SerialNumber",
//       "NomineePhoneno",
//       "NomineeRelationship",
//       "ExitDate",
//       "AssetType",
//       // profile extra columns (optional)
//       "pn_DivisionId",
//       "pn_DepartmentId",
//       "pn_DesignationId",
//       "pn_GradeId",
//       "pn_ShiftId",
//       "pn_CategoryId",
//       "pn_JobStatusId",
//       "pn_LevelID",
//       "pn_projectsiteID",
//       "d_Date",
//       "v_Reason",
//       "r_Department",
//       "father_name",
//     ];
//     const ws = XLSX.utils.aoa_to_sheet([header]);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Employees");
//     const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
//     function s2ab(s) {
//       const buf = new ArrayBuffer(s.length);
//       const view = new Uint8Array(buf);
//       for (let i = 0; i < s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
//       return buf;
//     }
//     const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "employee_template_no_empid.xlsx";
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <Box p={2}>
//       <Paper sx={{ p: 3 }}>
//         <Typography variant="h6" gutterBottom>
//           Employee Excel Bulk Upload — (pn_EmployeeID handled by DB)
//         </Typography>

//         <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
//           <input id="file" type="file" accept=".xlsx" onChange={handleFile} />
//           <FormControlLabel
//             control={<Switch checked={batchMode} onChange={(e) => setBatchMode(e.target.checked)} />}
//             label="Batch Mode (single large SQL)"
//           />
//           <TextField
//             select
//             label="Controller"
//             value={controller}
//             size="small"
//             onChange={(e) => setController(e.target.value)}
//           >
//             {CONTROLLERS.map((opt) => (
//               <MenuItem key={opt.value} value={opt.value}>
//                 {opt.label}
//               </MenuItem>
//             ))}
//           </TextField>
//         </Box>

//         <Box mb={2}>
//           <Typography variant="body2">Rows loaded: {rows.length}</Typography>
//           {loading && (
//             <>
//               <Typography variant="body2">Progress: {progressPct}%</Typography>
//               <LinearProgress variant="determinate" value={progressPct} sx={{ mt: 1 }} />
//             </>
//           )}
//         </Box>

//         <Box sx={{ display: "flex", gap: 2 }}>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={batchMode ? uploadBatch : uploadRowByRow}
//             disabled={loading || rows.length === 0}
//           >
//             {batchMode ? "Upload All (Batch)" : "Upload Row-by-Row"}
//           </Button>

//           <Button variant="outlined" onClick={downloadTemplate} disabled={loading}>
//             Download Template (no pn_EmployeeID)
//           </Button>
//         </Box>

//         <Box mt={3}>
//           <Typography variant="subtitle2">Errors (if any):</Typography>
//           {errors.length === 0 ? (
//             <Typography variant="body2">No errors yet.</Typography>
//           ) : (
//             <List dense>
//               {errors.map((er, idx) => (
//                 <ListItem key={idx}>
//                   <Alert severity="error">
//                     {er.index === "batch" ? `Batch error: ${er.error}` : `Row ${er.index}: ${er.error}`}
//                   </Alert>
//                 </ListItem>
//               ))}
//             </List>
//           )}
//         </Box>
//       </Paper>
//     </Box>
//   );
// }








// import React, { useState } from "react";
// import {
//   Grid,
//   Box,
//   Paper,
//   AppBar,
//   Toolbar,
//   Typography,
//   Button,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   TableContainer,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   CircularProgress,
//   LinearProgress,
// } from "@mui/material";

// import * as XLSX from "xlsx";
// import Navbar from "../../Home Page/Navbar";
// import Sidenav from "../../Home Page/Sidenav";

// import { postRequest } from "../../../serverconfiguration/requestcomp";
// import { ServerConfig } from "../../../serverconfiguration/serverconfig";
// import { SAVE } from "../../../serverconfiguration/controllers";

// import { toast } from "react-toastify";

// /* ================================================================================================
//     EMPLOYEE BULK UPLOAD — FULL VERSION  
//     Requirements:
//     ✔ Employee + Master Tables (Division, Dept, Designation, Grade, Shift, Category, JobStatus, Level)
//     ✔ No Image Upload
//     ✔ Excel → empty cells = ''
//     ✔ Row-by-row SQL execution using SCOPE_IDENTITY()
//     ✔ No pn_EmployeeID inserted (identity column)
// ================================================================================================ */

// const EmployeeBulkUpload_FullUI_NoImage_Final = () => {
//   const [selectedTemplate, setSelectedTemplate] = useState("Employee");
//   const [rows, setRows] = useState([]);
//   const [fileName, setFileName] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [progress, setProgress] = useState(0);

//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [currentSql, setCurrentSql] = useState("");
//   const [previewSQL, setPreviewSQL] = useState("");

//   const databaseName =
//     sessionStorage.getItem("databaseName") || "HRMS_004_Mallow";

//   // ------------------------------------------------------------------------------------------------
//   // 1. TEMPLATE COLUMN DEFINITIONS
//   // ------------------------------------------------------------------------------------------------

//   const employeeColumns = [
//     "pn_CompanyID",
//     "pn_BranchID",
//     "Employee_First_Name",
//     "Employee_Middle_Name",
//     "Employee_Last_Name",
//     "Employee_Full_Name",
//     "DateofBirth",
//     "Gender",
//     "status",
//     "Blood_Group",
//     "EmployeeCode",
//     "Password",
//     "Readerid",
//     "OT_Eligible",
//     "Pfno",
//     "Esino",
//     "OT_calc",
//     "CTC",
//     "basic_salary",
//     "Bank_code",
//     "Bank_Name",
//     "Branch_Name",
//     "Account_Type",
//     "MICR_code",
//     "IFSC_Code",
//     "Other_Info",
//     "Reporting_person",
//     "ReportingID",
//     "Reporting_email",
//     "Pan_no",
//     "salary_type",
//     "TDS_Applicable",
//     "Flag",
//     "role",
//     "accountNo",
//     "Phone_No",
//     "Alternate_Phone_No",
//     "permanent_address",
//     "Aadhar_Card",
//     "Current_Address",
//     "Father_Name",
//     "Email",
//     "Alternate_Email",
//     "Grade",
//     "Overall_Experience",
//     "HighestQualification",
//     "UniversityName",
//     "YearOfPassing",
//     "Certifications",
//     "Skills",
//     "UAN",
//     "PaymentMode",
//     "PassportNumber",
//     "VisaDetails",
//     "JoiningDate",
//     "ExitReason",
//     "PreviousCompany",
//     "PreviousDesignation",
//     "PreviousEmploymentDuration",
//     "ReasonForLeaving",
//     "PerformanceRating",
//     "TrainingRecords",
//     "DisciplinaryActions",
//     "Awards",
//     "VehicleDetails",
//     "HealthInsuranceDetails",
//     "NomineeDetails",
//     "Asset_Name",
//     "Asset_SerialNumber",
//     "NomineePhoneno",
//     "NomineeRelationship",
//     "ExitDate",
//     "AssetType",

//     // PROFILE COLUMNS (Excel optional)
//     "pnDivisionId",
//     "pnDepartmentId",
//     "pnDesignationId",
//     "pnGradeId",
//     "pn_ShiftID",
//     "pnCategoryId",
//     "pnJobStatusId",
//     "pnLevelId",
//     "pnProjectsiteId",
//     "d_Date",
//     "v_Reason",
//     "r_Department",
//   ];

//   // MASTER TABLES
//   const divisionCols = ["pn_CompanyID", "BranchID", "v_DivisionName", "status"];
//   const departmentCols = [
//     "pn_CompanyID",
//     "pn_BranchID",
//     "v_DepartmentName",
//     "status",
//   ];
//   const designationCols = [
//     "pn_CompanyID",
//     "BranchID",
//     "v_DesignationName",
//     "Authority",
//     "status",
//   ];
//   const gradeCols = ["pn_CompanyID", "BranchID", "v_GradeName", "status"];
//   const shiftCols = [
//     "pn_CompanyID",
//     "pn_branchid",
//     "shift_code",
//     "start_time",
//     "break_time_out",
//     "break_time_in",
//     "end_time",
//     "shift_indicator",
//     "Shift_Type",
//   ];
//   const categoryCols = ["pn_CompanyID", "BranchID", "v_CategoryName", "status"];
//   const jobStatusCols = [
//     "pn_CompanyID",
//     "BranchID",
//     "v_JobStatusName",
//     "status",
//   ];
//   const levelCols = ["pn_CompanyID", "BranchID", "v_LevelName", "status"];

//   // ------------------------------------------------------------------------------------------------
//   // 2. HELPER — SQL VALUE FORMATTER
//   // ------------------------------------------------------------------------------------------------

//   const sqlValue = (val) => {
//     if (val === undefined || val === null || val === "") return "''";
//     const n = Number(val);
//     if (!isNaN(n) && String(val).trim() !== "" && !/^0\d+/.test(String(val))) {
//       return String(val);
//     }
//     return `'${String(val).replace(/'/g, "''")}'`;
//   };

//   // ------------------------------------------------------------------------------------------------
//   // 3. DOWNLOAD TEMPLATE
//   // ------------------------------------------------------------------------------------------------

//   const downloadTemplate = (type) => {
//     let cols = [];
//     switch (type) {
//       case "Employee":
//         cols = employeeColumns;
//         break;
//       case "Division":
//         cols = divisionCols;
//         break;
//       case "Department":
//         cols = departmentCols;
//         break;
//       case "Designation":
//         cols = designationCols;
//         break;
//       case "Grade":
//         cols = gradeCols;
//         break;
//       case "Shift":
//         cols = shiftCols;
//         break;
//       case "Category":
//         cols = categoryCols;
//         break;
//       case "JobStatus":
//         cols = jobStatusCols;
//         break;
//       case "Level":
//         cols = levelCols;
//         break;
//       default:
//         cols = employeeColumns;
//     }

//     const headerObj = {};
//     cols.forEach((c) => (headerObj[c] = ""));

//     const wb = XLSX.utils.book_new();
//     const ws = XLSX.utils.json_to_sheet([headerObj]);
//     XLSX.utils.book_append_sheet(wb, ws, type);
//     XLSX.writeFile(wb, `${type}_template.xlsx`);
//   };

//   // ------------------------------------------------------------------------------------------------
//   // 4. READ EXCEL FILE
//   // ------------------------------------------------------------------------------------------------

//   const handleFileChange = (e) => {
//     const f = e.target.files[0];
//     if (!f) return;
//     setFileName(f.name);

//     const reader = new FileReader();
//     reader.onload = (ev) => {
//       const wb = XLSX.read(ev.target.result, { type: "binary" });
//       const sheet = wb.Sheets[wb.SheetNames[0]];
//       const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

//       // Normalize each row
//       const out = json.map((r) => {
//         const obj = {};
//         employeeColumns.forEach((c) => {
//           obj[c] = r[c] !== undefined ? r[c] : "";
//         });

//         // Copy any master columns also
//         Object.keys(r).forEach((k) => {
//           if (!obj[k]) obj[k] = r[k];
//         });

//         return obj;
//       });

//       setRows(out);
//       toast.success(`${out.length} row(s) loaded.`);
//     };

//     reader.readAsBinaryString(f);
//   };

//   // ------------------------------------------------------------------------------------------------
//   // 5. BUILD MASTER TABLE SQL (IF NOT EXISTS)
//   // ------------------------------------------------------------------------------------------------

//   const buildMasterSQL = (rows) => {
//     let sql = "";

//     rows.forEach((r) => {
//       // DIVISION
//       if (r.v_DivisionName) {
//         sql += `
// IF NOT EXISTS (
//   SELECT 1 FROM [${databaseName}].[dbo].[paym_Division]
//   WHERE pn_CompanyID=${sqlValue(r.pn_CompanyID)}
//   AND BranchID=${sqlValue(r.BranchID || r.pn_BranchID || "")}
//   AND v_DivisionName=${sqlValue(r.v_DivisionName)}
// )
// BEGIN
//   INSERT INTO [${databaseName}].[dbo].[paym_Division]
//   (pn_CompanyID,BranchID,v_DivisionName,status)
//   VALUES (
//     ${sqlValue(r.pn_CompanyID)},
//     ${sqlValue(r.BranchID || r.pn_BranchID || "")},
//     ${sqlValue(r.v_DivisionName)},
//     ${sqlValue(r.status)}
//   );
// END;
// `;
//       }

//       // DEPARTMENT
//       if (r.v_DepartmentName) {
//         sql += `
// IF NOT EXISTS (
//   SELECT 1 FROM [${databaseName}].[dbo].[paym_Department]
//   WHERE pn_CompanyID=${sqlValue(r.pn_CompanyID)}
//   AND pn_BranchID=${sqlValue(r.pn_BranchID || r.BranchID || "")}
//   AND v_DepartmentName=${sqlValue(r.v_DepartmentName)}
// )
// BEGIN
//   INSERT INTO [${databaseName}].[dbo].[paym_Department]
//   (pn_CompanyID,pn_BranchID,v_DepartmentName,status)
//   VALUES (
//     ${sqlValue(r.pn_CompanyID)},
//     ${sqlValue(r.pn_BranchID || r.BranchID || "")},
//     ${sqlValue(r.v_DepartmentName)},
//     ${sqlValue(r.status)}
//   );
// END;
// `;
//       }

//       // DESIGNATION
//       if (r.v_DesignationName) {
//         sql += `
// IF NOT EXISTS (
//   SELECT 1 FROM [${databaseName}].[dbo].[paym_Designation]
//   WHERE pn_CompanyID=${sqlValue(r.pn_CompanyID)}
//   AND BranchID=${sqlValue(r.BranchID || r.pn_BranchID || "")}
//   AND v_DesignationName=${sqlValue(r.v_DesignationName)}
// )
// BEGIN
//   INSERT INTO [${databaseName}].[dbo].[paym_Designation]
//   (pn_CompanyID,BranchID,v_DesignationName,Authority,status)
//   VALUES (
//     ${sqlValue(r.pn_CompanyID)},
//     ${sqlValue(r.BranchID || r.pn_BranchID || "")},
//     ${sqlValue(r.v_DesignationName)},
//     ${sqlValue(r.Authority)},
//     ${sqlValue(r.status)}
//   );
// END;
// `;
//       }

//       // GRADE
//       if (r.v_GradeName) {
//         sql += `
// IF NOT EXISTS (
//   SELECT 1 FROM [${databaseName}].[dbo].[paym_Grade]
//   WHERE pn_CompanyID=${sqlValue(r.pn_CompanyID)}
//   AND BranchID=${sqlValue(r.BranchID || r.pn_BranchID || "")}
//   AND v_GradeName=${sqlValue(r.v_GradeName)}
// )
// BEGIN
//   INSERT INTO [${databaseName}].[dbo].[paym_Grade]
//   (pn_CompanyID,BranchID,v_GradeName,status)
//   VALUES (
//     ${sqlValue(r.pn_CompanyID)},
//     ${sqlValue(r.BranchID || r.pn_BranchID || "")},
//     ${sqlValue(r.v_GradeName)},
//     ${sqlValue(r.status)}
//   );
// END;
// `;
//       }

//       // SHIFT
//       if (r.shift_code) {
//         sql += `
// IF NOT EXISTS (
//   SELECT 1 FROM [${databaseName}].[dbo].[paym_Shift]
//   WHERE pn_CompanyID=${sqlValue(r.pn_CompanyID)}
//   AND pn_branchid=${sqlValue(r.pn_branchid || r.pn_BranchID || "")}
//   AND shift_code=${sqlValue(r.shift_code)}
// )
// BEGIN
//   INSERT INTO [${databaseName}].[dbo].[paym_Shift]
//   (pn_CompanyID,pn_branchid,shift_code,start_time,break_time_out,break_time_in,end_time,shift_indicator,Shift_Type)
//   VALUES (
//     ${sqlValue(r.pn_CompanyID)},
//     ${sqlValue(r.pn_branchid || r.pn_BranchID || "")},
//     ${sqlValue(r.shift_code)},
//     ${sqlValue(r.start_time)},
//     ${sqlValue(r.break_time_out)},
//     ${sqlValue(r.break_time_in)},
//     ${sqlValue(r.end_time)},
//     ${sqlValue(r.shift_indicator)},
//     ${sqlValue(r.Shift_Type)}
//   );
// END;
// `;
//       }

//       // CATEGORY
//       if (r.v_CategoryName) {
//         sql += `
// IF NOT EXISTS (
//   SELECT 1 FROM [${databaseName}].[dbo].[paym_Category]
//   WHERE pn_CompanyID=${sqlValue(r.pn_CompanyID)}
//   AND BranchID=${sqlValue(r.BranchID || r.pn_BranchID || "")}
//   AND v_CategoryName=${sqlValue(r.v_CategoryName)}
// )
// BEGIN
//   INSERT INTO [${databaseName}].[dbo].[paym_Category]
//   (pn_CompanyID,BranchID,v_CategoryName,status)
//   VALUES (
//     ${sqlValue(r.pn_CompanyID)},
//     ${sqlValue(r.BranchID || r.pn_BranchID || "")},
//     ${sqlValue(r.v_CategoryName)},
//     ${sqlValue(r.status)}
//   );
// END;
// `;
//       }

//       // JOB STATUS
//       if (r.v_JobStatusName) {
//         sql += `
// IF NOT EXISTS (
//   SELECT 1 FROM [${databaseName}].[dbo].[paym_JobStatus]
//   WHERE pn_CompanyID=${sqlValue(r.pn_CompanyID)}
//   AND BranchID=${sqlValue(r.BranchID || r.pn_BranchID || "")}
//   AND v_JobStatusName=${sqlValue(r.v_JobStatusName)}
// )
// BEGIN
//   INSERT INTO [${databaseName}].[dbo].[paym_JobStatus]
//   (pn_CompanyID,BranchID,v_JobStatusName,status)
//   VALUES (
//     ${sqlValue(r.pn_CompanyID)},
//     ${sqlValue(r.BranchID || r.pn_BranchID || "")},
//     ${sqlValue(r.v_JobStatusName)},
//     ${sqlValue(r.status)}
//   );
// END;
// `;
//       }

//       // LEVEL
//       if (r.v_LevelName) {
//         sql += `
// IF NOT EXISTS (
//   SELECT 1 FROM [${databaseName}].[dbo].[paym_Level]
//   WHERE pn_CompanyID=${sqlValue(r.pn_CompanyID)}
//   AND BranchID=${sqlValue(r.BranchID || r.pn_BranchID || "")}
//   AND v_LevelName=${sqlValue(r.v_LevelName)}
// )
// BEGIN
//   INSERT INTO [${databaseName}].[dbo].[paym_Level]
//   (pn_CompanyID,BranchID,v_LevelName,status)
//   VALUES (
//     ${sqlValue(r.pn_CompanyID)},
//     ${sqlValue(r.BranchID || r.pn_BranchID || "")},
//     ${sqlValue(r.v_LevelName)},
//     ${sqlValue(r.status)}
//   );
// END;
// `;
//       }
//     });

//     return sql;
//   };

//   // ------------------------------------------------------------------------------------------------
//   // 6. BUILD SQL FOR EMPLOYEE (ROW-BY-ROW)
//   // ------------------------------------------------------------------------------------------------

//   const buildEmployeeSQL = (r) => {
//     // Employee INSERT (NO pn_EmployeeID)
//     const empCols = employeeColumns.slice(0, 73); // first 73 columns belong to Employee table
//     const empVals = empCols.map((c) => sqlValue(r[c] || "")).join(", ");

//     const empInsert = `
// INSERT INTO [${databaseName}].[dbo].[paym_Employee] (
//   [pn_CompanyID],[pn_BranchID], /* NO pn_EmployeeID */
//   [EmployeeCode],[Employee_First_Name],[Employee_Middle_Name],[Employee_Last_Name],
//   [DateofBirth],[Password],[Gender],[status],[Employee_Full_Name],[Readerid],[OT_Eligible],
//   [Pfno],[Esino],[OT_calc],[CTC],[basic_salary],[Bank_code],[Bank_Name],[Branch_Name],
//   [Account_Type],[MICR_code],[IFSC_Code],[Other_Info],[Reporting_person],[ReportingID],
//   [Reporting_email],[Pan_no],[salary_type],[TDS_Applicable],[Flag],[role],[accountNo],
//   [Blood_Group],[Phone_No],[Alternate_Phone_No],[permanent_address],[Aadhar_Card],
//   [Current_Address],[Father_Name],[Email],[Alternate_Email],[Grade],[Overall_Experience],
//   [HighestQualification],[UniversityName],[YearOfPassing],[Certifications],[Skills],[UAN],
//   [PaymentMode],[PassportNumber],[VisaDetails],[JoiningDate],[ExitReason],[PreviousCompany],
//   [PreviousDesignation],[PreviousEmploymentDuration],[ReasonForLeaving],[PerformanceRating],
//   [TrainingRecords],[DisciplinaryActions],[Awards],[VehicleDetails],[HealthInsuranceDetails],
//   [NomineeDetails],[Asset_Name],[Asset_SerialNumber],[NomineePhoneno],[NomineeRelationship],
//   [ExitDate],[AssetType]
// )
// VALUES (${empVals});

// DECLARE @NewEmpId INT = SCOPE_IDENTITY();
// `;

//     // PROFILE INSERT
//     const profileInsert = `
// INSERT INTO [${databaseName}].[dbo].[paym_employee_profile1] (
//   pn_CompanyID,pn_BranchID,pn_EmployeeID,pn_DivisionId,pn_DepartmentId,pn_DesignationId,
//   pn_GradeId,pn_ShiftId,pn_CategoryId,pn_JobStatusId,pn_LevelID,pn_projectsiteID,
//   d_Date,v_Reason,r_Department,father_name,Emp_Profile_Image,image_data
// )
// VALUES (
//   ${sqlValue(r.pn_CompanyID)}, ${sqlValue(r.pn_BranchID)}, @NewEmpId,
//   ${sqlValue(r.pnDivisionId)}, ${sqlValue(r.pnDepartmentId)}, ${sqlValue(
//       r.pnDesignationId
//     )},
//   ${sqlValue(r.pnGradeId)}, ${sqlValue(r.pn_ShiftID)}, ${sqlValue(
//       r.pnCategoryId
//     )},
//   ${sqlValue(r.pnJobStatusId)}, ${sqlValue(r.pnLevelId)}, ${sqlValue(
//       r.pnProjectsiteId
//     )},
//   ${sqlValue(r.d_Date)}, ${sqlValue(r.v_Reason)}, ${sqlValue(
//       r.r_Department
//     )}, ${sqlValue(r.Father_Name)},
//   NULL, NULL
// );
// `;

//     // LOGIN TABLE
//     const loginInsert = `
// INSERT INTO [HRMS_Master].[dbo].[EmployeesLogin]
// (EmployeeUserId,Password,DBname,employeeFullName)
// VALUES (
//   ${sqlValue(r.EmployeeCode)},
//   ${sqlValue(r.Password)},
//   ${sqlValue(databaseName)},
//   ${sqlValue(r.Employee_Full_Name)}
// );
// `;

//     return empInsert + profileInsert + loginInsert;
//   };

//   // ------------------------------------------------------------------------------------------------
//   // 7. EXECUTE ALL ROWS (ROW-BY-ROW)
//   // ------------------------------------------------------------------------------------------------

//   const executeUpload = async () => {
//     if (rows.length === 0) {
//       toast.error("No rows to upload.");
//       return;
//     }

//     setLoading(true);
//     setProgress(0);

//     // Master table SQL first
//     const masterSql = buildMasterSQL(rows);
//     if (masterSql.trim() !== "") {
//       try {
//         await postRequest(ServerConfig.url, SAVE, { query: masterSql });
//       } catch (err) {
//         toast.error("Master insert failed.");
//         console.error(err);
//       }
//     }

//     // Row-by-row employee insert
//     for (let i = 0; i < rows.length; i++) {
//       const sql = buildEmployeeSQL(rows[i]);
//       setCurrentSql(sql);
//       setPreviewSQL(sql);

//       try {
//         await postRequest(ServerConfig.url, SAVE, { query: sql });
//       } catch (err) {
//         toast.error(`Error on row ${i + 1}`);
//         console.error(err);
//       }

//       setProgress(Math.round(((i + 1) / rows.length) * 100));
//     }

//     toast.success("All rows uploaded.");
//     setLoading(false);
//   };

//   // ------------------------------------------------------------------------------------------------
//   // 8. UI LAYOUT (Matches Your Current UI Style)
//   // ------------------------------------------------------------------------------------------------

//   return (
//     <Grid item xs={12}>
//       <Navbar />
//       <Box sx={{ height: 20 }} />

//       <Box sx={{ display: "flex" }}>
//         <Sidenav />

//         <Grid item xs={12} sm={10} md={9} lg={8} xl={7} sx={{ p: 4 }} >
//           <AppBar position="static">
//             <Toolbar>
//               <Typography variant="h5" sx={{ fontWeight: "bold" }}>
//                 BULK UPLOAD — EMPLOYEE & MASTER DATA (ROW-BY-ROW)
//               </Typography>
//             </Toolbar>
//           </AppBar>

//           {/* TEMPLATE SELECTION */}
//           <Paper sx={{ p: 3, mt: 3, display: "flex", gap: 2 }}>
//             <FormControl fullWidth>
//               <InputLabel>Select Template</InputLabel>
//               <Select
//                 value={selectedTemplate}
//                 label="Select Template"
//                 onChange={(e) => setSelectedTemplate(e.target.value)}
//               >
//                 <MenuItem value="Employee">Employee</MenuItem>
//                 <MenuItem value="Division">Division</MenuItem>
//                 <MenuItem value="Department">Department</MenuItem>
//                 <MenuItem value="Designation">Designation</MenuItem>
//                 <MenuItem value="Grade">Grade</MenuItem>
//                 <MenuItem value="Shift">Shift</MenuItem>
//                 <MenuItem value="Category">Category</MenuItem>
//                 <MenuItem value="JobStatus">Job Status</MenuItem>
//                 <MenuItem value="Level">Level</MenuItem>
//               </Select>
//             </FormControl>

//             <Button
//               variant="contained"
//               onClick={() => downloadTemplate(selectedTemplate)}
//             >
//               Download Template
//             </Button>
//           </Paper>

//           {/* UPLOAD EXCEL */}
//           <Paper sx={{ p: 3, mt: 3, display: "flex", gap: 2 }}>
//             <input type="file" accept=".xlsx" onChange={handleFileChange} />

//             <Button variant="contained" color="success" onClick={executeUpload}>
//               Upload (Row-by-Row)
//             </Button>
//           </Paper>

//           {/* PROGRESS */}
//           {loading && (
//             <>
//               <Typography>Progress: {progress}%</Typography>
//               <LinearProgress variant="determinate" value={progress} />
//             </>
//           )}

//           {/* TABLE PREVIEW */}
//           {rows.length > 0 && (
//             <Box
//               sx={{
//                 width: "1000px",
//                 overflowX: "auto", // enables horizontal scroll
//                 whiteSpace: "nowrap", // prevents columns from wrapping
//                 border: "1px solid #ddd",
//                 borderRadius: "6px",
//                 mt: 3,
//               }}
//             >
//               <TableContainer
//                 component={Paper}
//                 sx={{
//                   mt: 3,
//                   maxWidth: "100%",
//                   overflowX: "auto", // <-- horizontal scroll
//                   whiteSpace: "nowrap", // <-- prevents column wrapping
//                 }}
//               >
//                 <Table size="small">
//                   <TableHead>
//                     <TableRow>
//                       {employeeColumns.map((c) => (
//                         <TableCell key={c}>{c}</TableCell>
//                       ))}
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {rows.map((r, i) => (
//                       <TableRow key={i}>
//                         {employeeColumns.map((c, j) => (
//                           <TableCell key={j}>{String(r[c] || "")}</TableCell>
//                         ))}
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </Box>
//           )}
//         </Grid>
//       </Box>
//     </Grid>
//   );
// };

// export default EmployeeBulkUpload_FullUI_NoImage_Final;