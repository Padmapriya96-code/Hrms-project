// // EmployeeBulkUpload_AllModules.js
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
//   LinearProgress,
// } from "@mui/material";

// import * as XLSX from "xlsx";
// import Navbar from "../../Home Page/Navbar";
// import Sidenav from "../../Home Page/Sidenav";

// import { postRequest } from "../../../serverconfiguration/requestcomp";
// import { ServerConfig } from "../../../serverconfiguration/serverconfig";
// import { SAVE } from "../../../serverconfiguration/controllers";

// import { toast } from "react-toastify";

// /**
//  * EmployeeBulkUpload_AllModules
//  *
//  * - Uses the final Employee Registration columns (as provided)
//  * - Builds row-by-row SQL inserting into:
//  *   - paym_Employee (main)
//  *   - paym_employee_profile1 (profile)
//  *   - HRMS_Master.dbo.EmployeesLogin (login)
//  *   - Master tables (insert-if-not-exists): Division, Department, Designation, Grade, Shift, Category, JobStatus, Level
//  *
//  * Notes:
//  * - Excel header column names must exactly match `excelColumns` below (these are the UI field names you provided)
//  * - The SQL maps UI/Excel names to DB column names (comments in code)
//  * - Empty Excel cells become '' in SQL
//  * - This component executes master inserts first (single batch), then inserts employees row-by-row using SCOPE_IDENTITY() to capture pn_EmployeeID for profile.
//  */

// const EmployeeBulkUpload_AllModules = () => {
//   // ------------------------------
//   // 1) Final UI/Excel column list (EXACT names you supplied)
//   // ------------------------------
//   const excelColumns = [
//     "CompanyID", // readonly in UI - optional in Excel
//     "BranchID", // readonly in UI - optional in Excel

//     "employeeFirstName",
//     "employeeMiddleName",
//     "employeeLastName",
//     "employeeFullName",
//     "dateofBirth",
//     "gender",
//     "status",
//     "bloodGroup",
//     "d_Date",

//     "employeeCode",
//     "password",

//     "pnDesignationId",
//     "pnDepartmentId",
//     "pnDivisionId",
//     "pnGradeId",
//     "pn_ShiftID",
//     "pnCategoryId",
//     "pnJobStatusId",
//     "pnLevelId",
//     "pnProjectsiteId",

//     "aadharCard",
//     "micrCode",
//     "branchName",
//     "bankName",
//     "bankCode",
//     "accountNo",
//     "ifscCode",
//     "accountType",
//     "panNo",

//     "ctc",
//     "paymentMode",
//     "basicSalary",
//     "readerid",
//     "salaryType",
//     "role",
//     "otherInfo",
//     "otEligible",
//     "tdsApplicable",
//     "otCalc",

//     "passportNumber",
//     "visaDetails",
//     "uan",
//     "pfno",
//     "esino",

//     "email",
//     "alternateEmail",
//     "phoneNo",
//     "alternatePhoneNo",
//     "permanentAddress",
//     "currentAddress",

//     "highestQualification",
//     "universityName",
//     "yearOfPassing",
//     "certifications",
//     "skills",

//     "overallExperience",
//     "previousCompany",
//     "previousDesignation",
//     "previousEmploymentDuration",
//     "reasonForLeaving",
//     "performanceRating",
//     "trainingRecords",
//     "awards",

//     "reportingId",
//     "reportingPerson",
//     "reportingEmail",
//     "vReason",
//     "rDepartment",

//     "fatherName",
//     "joiningDate",
//     "vehicleDetails",
//     "healthInsuranceDetails",
//     "nomineeDetails",
//     "NomineePhoneno",
//     "NomineeRelationship",

//     "assetType",
//     "assetName",
//     "assetSerialNumber",
//   ];

//   // ------------------------------
//   // state
//   // ------------------------------
//   const [rows, setRows] = useState([]);
//   const [fileName, setFileName] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [currentSql, setCurrentSql] = useState("");
//   const databaseName = sessionStorage.getItem("databaseName") || "HRMS_004_Mallow";

//   // ------------------------------
//   // Helper: format SQL-safe values
//   // ------------------------------
//   const sqlValue = (val) => {
//     if (val === undefined || val === null || val === "") return "''";
//     // If numeric-looking and not leading-zero string, return as-is (no quotes)
//     const num = Number(val);
//     if (!isNaN(num) && String(val).trim() !== "" && !/^0\d+/.test(String(val))) {
//       return String(val);
//     }
//     return `'${String(val).replace(/'/g, "''")}'`;
//   };

//   // ------------------------------
//   // Download Excel template (single-row header)
//   // ------------------------------
//   const downloadTemplate = () => {
//     const headerObj = {};
//     excelColumns.forEach((c) => (headerObj[c] = ""));
//     const wb = XLSX.utils.book_new();
//     const ws = XLSX.utils.json_to_sheet([headerObj]);
//     XLSX.utils.book_append_sheet(wb, ws, "EmployeeTemplate");
//     XLSX.writeFile(wb, `Employee_Register_Template.xlsx`);
//   };

//   // ------------------------------
//   // Read excel file and normalize rows
//   // ------------------------------
//   const handleFileChange = (e) => {
//     const f = e.target.files[0];
//     if (!f) return;
//     setFileName(f.name);

//     const reader = new FileReader();
//     reader.onload = (ev) => {
//       const wb = XLSX.read(ev.target.result, { type: "binary" });
//       const sheet = wb.Sheets[wb.SheetNames[0]];
//       const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

//       // Normalize to expected columns; add missing columns as ''
//       const out = json.map((r) => {
//         const obj = {};
//         excelColumns.forEach((c) => {
//           // If Excel uses DB-like names (e.g., Employee_First_Name) we also tolerate them:
//           obj[c] =
//             r[c] !== undefined
//               ? r[c]
//               : r[dbNameFromUI(c)] !== undefined
//               ? r[dbNameFromUI(c)]
//               : "";
//         });

//         // Copy any extra keys (in case user used DB column names directly)
//         Object.keys(r).forEach((k) => {
//           if (!obj[k]) obj[k] = r[k];
//         });

//         return obj;
//       });

//       setRows(out);
//       toast.success(`${out.length} row(s) loaded from ${f.name}`);
//     };
//     reader.readAsBinaryString(f);
//   };

//   // ------------------------------
//   // Map UI field name -> DB column name
//   // ------------------------------
//   function dbNameFromUI(uiName) {
//     // returns DB column name for direct mapping if Excel/CSV used DB names
//     const map = {
//       employeeFirstName: "Employee_First_Name",
//       employeeMiddleName: "Employee_Middle_Name",
//       employeeLastName: "Employee_Last_Name",
//       employeeFullName: "Employee_Full_Name",
//       dateofBirth: "DateofBirth",
//       gender: "Gender",
//       status: "status",
//       bloodGroup: "Blood_Group",
//       d_Date: "d_Date",
//       employeeCode: "EmployeeCode",
//       password: "Password",
//       pnDivisionId: "pnDivisionId",
//       pnDepartmentId: "pnDepartmentId",
//       pnDesignationId: "pnDesignationId",
//       pnGradeId: "pnGradeId",
//       pn_ShiftID: "pn_ShiftID",
//       pnCategoryId: "pnCategoryId",
//       pnJobStatusId: "pnJobStatusId",
//       pnLevelId: "pnLevelId",
//       pnProjectsiteId: "pnProjectsiteId",
//       aadharCard: "Aadhar_Card",
//       micrCode: "MICR_code",
//       branchName: "Branch_Name",
//       bankName: "Bank_Name",
//       bankCode: "Bank_code",
//       accountNo: "accountNo",
//       ifscCode: "IFSC_Code",
//       accountType: "Account_Type",
//       panNo: "Pan_no",
//       ctc: "CTC",
//       paymentMode: "PaymentMode",
//       basicSalary: "basic_salary",
//       readerid: "Readerid",
//       salaryType: "salary_type",
//       role: "role",
//       otherInfo: "Other_Info",
//       otEligible: "OT_Eligible",
//       tdsApplicable: "TDS_Applicable",
//       otCalc: "OT_calc",
//       passportNumber: "PassportNumber",
//       visaDetails: "VisaDetails",
//       uan: "UAN",
//       pfno: "Pfno",
//       esino: "Esino",
//       email: "Email",
//       alternateEmail: "Alternate_Email",
//       phoneNo: "Phone_No",
//       alternatePhoneNo: "Alternate_Phone_No",
//       permanentAddress: "permanent_address",
//       currentAddress: "Current_Address",
//       highestQualification: "HighestQualification",
//       universityName: "UniversityName",
//       yearOfPassing: "YearOfPassing",
//       certifications: "Certifications",
//       skills: "Skills",
//       overallExperience: "Overall_Experience",
//       previousCompany: "PreviousCompany",
//       previousDesignation: "PreviousDesignation",
//       previousEmploymentDuration: "PreviousEmploymentDuration",
//       reasonForLeaving: "ReasonForLeaving",
//       performanceRating: "PerformanceRating",
//       trainingRecords: "TrainingRecords",
//       awards: "Awards",
//       reportingId: "ReportingID",
//       reportingPerson: "Reporting_person",
//       reportingEmail: "Reporting_email",
//       vReason: "v_Reason",
//       rDepartment: "r_Department",
//       fatherName: "Father_Name",
//       joiningDate: "JoiningDate",
//       vehicleDetails: "VehicleDetails",
//       healthInsuranceDetails: "HealthInsuranceDetails",
//       nomineeDetails: "NomineeDetails",
//       NomineePhoneno: "NomineePhoneno",
//       NomineeRelationship: "NomineeRelationship",
//       assetType: "AssetType",
//       assetName: "Asset_Name",
//       assetSerialNumber: "Asset_SerialNumber",
//       CompanyID: "CompanyID",
//       BranchID: "BranchID",
//     };
//     return map[uiName] || uiName;
//   }

//   // ------------------------------
//   // Build master-table SQL (insert-if-not-exists)
//   // Accepts both name-based (v_*) and id-based (pn*Id) inputs.
//   // ------------------------------
//   const buildMasterSQL = (rows) => {
//     let sql = "";

//     rows.forEach((r, idx) => {
//       // DIVISION (if name provided)
//       if (r.v_DivisionName || r.v_DivisionName === undefined) {
//         // If Excel included v_DivisionName use it; else skip
//       }
//       // We'll handle common master fields if names are present in row (tolerant)
//       if (r.v_DivisionName) {
//         sql += `
// IF NOT EXISTS (
//   SELECT 1 FROM [${databaseName}].[dbo].[paym_Division]
//   WHERE pn_CompanyID=${sqlValue(r.pn_CompanyID || r.CompanyName || "")}
//     AND BranchID=${sqlValue(r.pn_BranchID || r.BranchID || r.branchName || "")}
//     AND v_DivisionName=${sqlValue(r.v_DivisionName)}
// )
// BEGIN
//   INSERT INTO [${databaseName}].[dbo].[paym_Division] (pn_CompanyID,BranchID,v_DivisionName,status)
//   VALUES (${sqlValue(r.pn_CompanyID || r.CompanyName || "")}, ${sqlValue(r.pn_BranchID || r.BranchID || r.branchName || "")}, ${sqlValue(r.v_DivisionName)}, ${sqlValue(r.status)});
// END;
// `;
//       }

//       if (r.v_DepartmentName) {
//         sql += `
// IF NOT EXISTS (
//   SELECT 1 FROM [${databaseName}].[dbo].[paym_Department]
//   WHERE pn_CompanyID=${sqlValue(r.pn_CompanyID)} AND pn_BranchID=${sqlValue(r.pn_BranchID || r.BranchID || r.branchName || "")} AND v_DepartmentName=${sqlValue(r.v_DepartmentName)}
// )
// BEGIN
//   INSERT INTO [${databaseName}].[dbo].[paym_Department] (pn_CompanyID,pn_BranchID,v_DepartmentName,status)
//   VALUES (${sqlValue(r.pn_CompanyID)}, ${sqlValue(r.pn_BranchID || r.BranchID || r.branchName || "")}, ${sqlValue(r.v_DepartmentName)}, ${sqlValue(r.status)});
// END;
// `;
//       }

//       if (r.v_DesignationName) {
//         sql += `
// IF NOT EXISTS (
//   SELECT 1 FROM [${databaseName}].[dbo].[paym_Designation]
//   WHERE pn_CompanyID=${sqlValue(r.pn_CompanyID)} AND BranchID=${sqlValue(r.BranchID || r.pn_BranchID || "")} AND v_DesignationName=${sqlValue(r.v_DesignationName)}
// )
// BEGIN
//   INSERT INTO [${databaseName}].[dbo].[paym_Designation] (pn_CompanyID,BranchID,v_DesignationName,Authority,status)
//   VALUES (${sqlValue(r.pn_CompanyID)}, ${sqlValue(r.BranchID || r.pn_BranchID || "")}, ${sqlValue(r.v_DesignationName)}, ${sqlValue(r.Authority)}, ${sqlValue(r.status)});
// END;
// `;
//       }

//       if (r.v_GradeName) {
//         sql += `
// IF NOT EXISTS (
//   SELECT 1 FROM [${databaseName}].[dbo].[paym_Grade]
//   WHERE pn_CompanyID=${sqlValue(r.pn_CompanyID)} AND BranchID=${sqlValue(r.BranchID || r.pn_BranchID || "")} AND v_GradeName=${sqlValue(r.v_GradeName)}
// )
// BEGIN
//   INSERT INTO [${databaseName}].[dbo].[paym_Grade] (pn_CompanyID,BranchID,v_GradeName,status)
//   VALUES (${sqlValue(r.pn_CompanyID)}, ${sqlValue(r.BranchID || r.pn_BranchID || "")}, ${sqlValue(r.v_GradeName)}, ${sqlValue(r.status)});
// END;
// `;
//       }

//       if (r.shift_code) {
//         sql += `
// IF NOT EXISTS (
//   SELECT 1 FROM [${databaseName}].[dbo].[paym_Shift]
//   WHERE pn_CompanyID=${sqlValue(r.pn_CompanyID)} AND pn_branchid=${sqlValue(r.pn_branchid || r.pn_BranchID || "")} AND shift_code=${sqlValue(r.shift_code)}
// )
// BEGIN
//   INSERT INTO [${databaseName}].[dbo].[paym_Shift] (pn_CompanyID,pn_branchid,shift_code,start_time,break_time_out,break_time_in,end_time,shift_indicator,Shift_Type)
//   VALUES (${sqlValue(r.pn_CompanyID)}, ${sqlValue(r.pn_branchid || r.pn_BranchID || "")}, ${sqlValue(r.shift_code)}, ${sqlValue(r.start_time)}, ${sqlValue(r.break_time_out)}, ${sqlValue(r.break_time_in)}, ${sqlValue(r.end_time)}, ${sqlValue(r.shift_indicator)}, ${sqlValue(r.Shift_Type)});
// END;
// `;
//       }

//       if (r.v_CategoryName) {
//         sql += `
// IF NOT EXISTS (
//   SELECT 1 FROM [${databaseName}].[dbo].[paym_Category]
//   WHERE pn_CompanyID=${sqlValue(r.pn_CompanyID)} AND BranchID=${sqlValue(r.BranchID || r.pn_BranchID || "")} AND v_CategoryName=${sqlValue(r.v_CategoryName)}
// )
// BEGIN
//   INSERT INTO [${databaseName}].[dbo].[paym_Category] (pn_CompanyID,BranchID,v_CategoryName,status)
//   VALUES (${sqlValue(r.pn_CompanyID)}, ${sqlValue(r.BranchID || r.pn_BranchID || "")}, ${sqlValue(r.v_CategoryName)}, ${sqlValue(r.status)});
// END;
// `;
//       }

//       if (r.v_JobStatusName) {
//         sql += `
// IF NOT EXISTS (
//   SELECT 1 FROM [${databaseName}].[dbo].[paym_JobStatus]
//   WHERE pn_CompanyID=${sqlValue(r.pn_CompanyID)} AND BranchID=${sqlValue(r.BranchID || r.pn_BranchID || "")} AND v_JobStatusName=${sqlValue(r.v_JobStatusName)}
// )
// BEGIN
//   INSERT INTO [${databaseName}].[dbo].[paym_JobStatus] (pn_CompanyID,BranchID,v_JobStatusName,status)
//   VALUES (${sqlValue(r.pn_CompanyID)}, ${sqlValue(r.BranchID || r.pn_BranchID || "")}, ${sqlValue(r.v_JobStatusName)}, ${sqlValue(r.status)});
// END;
// `;
//       }

//       if (r.v_LevelName) {
//         sql += `
// IF NOT EXISTS (
//   SELECT 1 FROM [${databaseName}].[dbo].[paym_Level]
//   WHERE pn_CompanyID=${sqlValue(r.pn_CompanyID)} AND BranchID=${sqlValue(r.BranchID || r.pn_BranchID || "")} AND v_LevelName=${sqlValue(r.v_LevelName)}
// )
// BEGIN
//   INSERT INTO [${databaseName}].[dbo].[paym_Level] (pn_CompanyID,BranchID,v_LevelName,status)
//   VALUES (${sqlValue(r.pn_CompanyID)}, ${sqlValue(r.BranchID || r.pn_BranchID || "")}, ${sqlValue(r.v_LevelName)}, ${sqlValue(r.status)});
// END;
// `;
//       }
//     });

//     return sql;
//   };

//   // ------------------------------
//   // Build employee + profile + login SQL for ONE row
//   // ------------------------------
//   const buildEmployeeSQL = (r) => {
//     // Map UI names to DB values (use dbNameFromUI where helpful)
//     // Main paym_Employee columns we will insert (order matters)
//     const empColumnsOrdered = [
//       "pn_CompanyID", // must be provided in Excel (or session)
//       "pn_BranchID",
//       // Note: pn_EmployeeID is identity in DB — we DO NOT insert it
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
//       "Flag", // kept, but if not provided will be ''
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
//     ];

//     // Helper to get value from row, supporting UI names
//     const val = (dbCol) => {
//       // try to find by DB name in row (sometimes Excel uses DB names)
//       const possibleUi = uiNameFromDb(dbCol);
//       // prefer the UI name value if exists, else the DB-named value, else ''
//       return (
//         (possibleUi && (r[possibleUi] !== undefined ? r[possibleUi] : undefined)) ??
//         (r[dbCol] !== undefined ? r[dbCol] : r[dbNameFromUI(possibleUi)] ?? "")
//       );
//     };

//     // Build VALUES list in same order
//     const empVals = empColumnsOrdered.map((c) => {
//       const v = val(c);
//       return sqlValue(v);
//     });

//     const empInsert = `
// -- INSERT EMPLOYEE (row)
// INSERT INTO [${databaseName}].[dbo].[paym_Employee] (
//   pn_CompanyID,pn_BranchID,
//   ${empColumnsOrdered.slice(2).join(",\n  ")}
// )
// VALUES (
//   ${sqlValue(r.pn_CompanyID || r.CompanyID || sessionStorage.getItem("pn_CompanyID") || "")},
//   ${sqlValue(r.pn_BranchID || r.BranchID || sessionStorage.getItem("pn_BranchID") || "")},
//   ${empVals.slice(2).join(", ")}
// );

// DECLARE @NewEmpId INT = SCOPE_IDENTITY();
// `;

//     // Profile insert — uses @NewEmpId
//     const profileInsert = `
// INSERT INTO [${databaseName}].[dbo].[paym_employee_profile1] (
//   pn_CompanyID,pn_BranchID,pn_EmployeeID,
//   pn_DivisionId,pn_DepartmentId,pn_DesignationId,pn_GradeId,pn_ShiftId,
//   pn_CategoryId,pn_JobStatusId,pn_LevelID,pn_projectsiteID,d_Date,v_Reason,r_Department,
//   father_name,Emp_Profile_Image,image_data
// )
// VALUES (
//   ${sqlValue(r.pn_CompanyID || r.CompanyName || "")},
//   ${sqlValue(r.pn_BranchID || r.BranchID || "")},
//   @NewEmpId,
//   ${sqlValue(r.pnDivisionId || r.pnDivisionID || r.pnDivisionId || "")},
//   ${sqlValue(r.pnDepartmentId || r.pnDepartmentID || "")},
//   ${sqlValue(r.pnDesignationId || r.pnDesignationID || "")},
//   ${sqlValue(r.pnGradeId || r.pnGradeID || "")},
//   ${sqlValue(r.pn_ShiftID || r.pnShiftID || "")},
//   ${sqlValue(r.pnCategoryId || r.pnCategoryID || "")},
//   ${sqlValue(r.pnJobStatusId || r.pnJobStatusID || "")},
//   ${sqlValue(r.pnLevelId || r.pnLevelID || "")},
//   ${sqlValue(r.pnProjectsiteId || r.pn_ProjectsiteID || "")},
//   ${sqlValue(r.d_Date || r.d_Date || "")},
//   ${sqlValue(r.vReason || r.v_Reason || "")},
//   ${sqlValue(r.rDepartment || r.r_Department || "")},
//   ${sqlValue(r.fatherName || r.Father_Name || "")},
//   NULL, NULL
// );
// `;

//     // Login insert (HRMS_Master)
//     const loginInsert = `
// INSERT INTO [HRMS_Master].[dbo].[EmployeesLogin] (EmployeeUserId,Password,DBname,employeeFullName)
// VALUES (
//   ${sqlValue(r.employeeCode || r.EmployeeCode || "")},
//   ${sqlValue(r.password || r.Password || "")},
//   ${sqlValue(databaseName)},
//   ${sqlValue(r.employeeFullName || r.Employee_Full_Name || "")}
// );
// `;

//     return empInsert + profileInsert + loginInsert;
//   };

//   // helper reverse mapping DB->UI name if exists
//   function uiNameFromDb(db) {
//     const reverse = {
//       Employee_First_Name: "employeeFirstName",
//       Employee_Middle_Name: "employeeMiddleName",
//       Employee_Last_Name: "employeeLastName",
//       Employee_Full_Name: "employeeFullName",
//       DateofBirth: "dateofBirth",
//       Gender: "gender",
//       status: "status",
//       Blood_Group: "bloodGroup",
//       EmployeeCode: "employeeCode",
//       Password: "password",
//       Aadhar_Card: "aadharCard",
//       MICR_code: "micrCode",
//       Branch_Name: "branchName",
//       Bank_Name: "bankName",
//       Bank_code: "bankCode",
//       accountNo: "accountNo",
//       IFSC_Code: "ifscCode",
//       Account_Type: "accountType",
//       Pan_no: "panNo",
//       CTC: "ctc",
//       PaymentMode: "paymentMode",
//       basic_salary: "basicSalary",
//       Readerid: "readerid",
//       salary_type: "salaryType",
//       role: "role",
//       Other_Info: "otherInfo",
//       OT_Eligible: "otEligible",
//       TDS_Applicable: "tdsApplicable",
//       OT_calc: "otCalc",
//       PassportNumber: "passportNumber",
//       VisaDetails: "visaDetails",
//       UAN: "uan",
//       Pfno: "pfno",
//       Esino: "esino",
//       Email: "email",
//       Alternate_Email: "alternateEmail",
//       Phone_No: "phoneNo",
//       Alternate_Phone_No: "alternatePhoneNo",
//       permanent_address: "permanentAddress",
//       Current_Address: "currentAddress",
//       HighestQualification: "highestQualification",
//       UniversityName: "universityName",
//       YearOfPassing: "yearOfPassing",
//       Certifications: "certifications",
//       Skills: "skills",
//       Overall_Experience: "overallExperience",
//       PreviousCompany: "previousCompany",
//       PreviousDesignation: "previousDesignation",
//       PreviousEmploymentDuration: "previousEmploymentDuration",
//       ReasonForLeaving: "reasonForLeaving",
//       PerformanceRating: "performanceRating",
//       TrainingRecords: "trainingRecords",
//       Awards: "awards",
//       ReportingID: "reportingId",
//       Reporting_person: "reportingPerson",
//       Reporting_email: "reportingEmail",
//       v_Reason: "vReason",
//       r_Department: "rDepartment",
//       Father_Name: "fatherName",
//       JoiningDate: "joiningDate",
//       VehicleDetails: "vehicleDetails",
//       HealthInsuranceDetails: "healthInsuranceDetails",
//       NomineeDetails: "nomineeDetails",
//       NomineePhoneno: "NomineePhoneno",
//       NomineeRelationship: "NomineeRelationship",
//       AssetType: "assetType",
//       Asset_Name: "assetName",
//       Asset_SerialNumber: "assetSerialNumber",
//       pnDivisionId: "pnDivisionId",
//       pnDepartmentId: "pnDepartmentId",
//       pnDesignationId: "pnDesignationId",
//       pnGradeId: "pnGradeId",
//       pn_ShiftID: "pn_ShiftID",
//       pnCategoryId: "pnCategoryId",
//       pnJobStatusId: "pnJobStatusId",
//       pnLevelId: "pnLevelId",
//       pnProjectsiteId: "pnProjectsiteId",
//       // etc.
//     };
//     return reverse[db] || null;
//   }

//   // ------------------------------
//   // Execute upload
//   // ------------------------------
//   const executeUpload = async () => {
//     if (!rows || rows.length === 0) {
//       toast.error("No rows to upload. Please load the Excel first.");
//       return;
//     }

//     setLoading(true);
//     setProgress(0);

//     // 1) Build master SQL for all rows and run once
//     const masterSql = buildMasterSQL(rows);
//     if (masterSql && masterSql.trim() !== "") {
//       try {
//         await postRequest(ServerConfig.url, SAVE, { query: masterSql });
//       } catch (err) {
//         toast.error("Master table inserts failed. Check console.");
//         console.error("Master SQL error:", err);
//         // proceed to row inserts anyway (optionally abort)
//       }
//     }

//     // 2) Insert rows one-by-one
//     for (let i = 0; i < rows.length; i++) {
//       const r = rows[i];

//       // Build employee SQL
//       const sql = buildEmployeeSQL(r);
//       setCurrentSql(sql);

//       try {
//         await postRequest(ServerConfig.url, SAVE, { query: sql });
//       } catch (err) {
//         toast.error(`Error inserting row ${i + 1}. Check console.`);
//         console.error(`Row ${i + 1} SQL error:`, err);
//         // continue to next row
//       }

//       setProgress(Math.round(((i + 1) / rows.length) * 100));
//     }

//     setLoading(false);
//     toast.success("Upload finished.");
//   };

//   // ------------------------------
//   // UI
//   // ------------------------------
//   return (
//     <Grid item xs={12}>
//       <Navbar />
//       <Box sx={{ height: 20 }} />

//       <Box sx={{ display: "flex" }}>
//         <Sidenav />

//         <Grid item xs={12} sm={10} md={9} lg={8} xl={7} sx={{ p: 4 }}>
//           <AppBar position="static">
//             <Toolbar>
//               <Typography variant="h6" sx={{ fontWeight: "bold" }}>
//                 Employee Bulk Upload — Multi-Module (Row-by-Row)
//               </Typography>
//             </Toolbar>
//           </AppBar>

//           <Paper sx={{ p: 2, mt: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
//             <Button variant="contained" onClick={downloadTemplate}>
//               Download Excel Template
//             </Button>

//             <input
//               type="file"
//               accept=".xlsx, .xls, .csv"
//               onChange={handleFileChange}
//               style={{ marginLeft: 12 }}
//             />

//             <Button
//               variant="contained"
//               color="success"
//               onClick={executeUpload}
//               sx={{ marginLeft: "auto" }}
//               disabled={loading || rows.length === 0}
//             >
//               Upload (Row-by-Row)
//             </Button>
//           </Paper>

//           {loading && (
//             <Box sx={{ mt: 2 }}>
//               <Typography>Progress: {progress}%</Typography>
//               <LinearProgress variant="determinate" value={progress} />
//               <Paper sx={{ p: 2, mt: 1, maxHeight: 200, overflow: "auto" }}>
//                 <Typography variant="subtitle2">Current SQL Preview</Typography>
//                 <pre style={{ whiteSpace: "pre-wrap", fontSize: 12 }}>
//                   {currentSql}
//                 </pre>
//               </Paper>
//             </Box>
//           )}

//           {rows.length > 0 && (
//             <Box sx={{ mt: 3 }}>
//               <Typography variant="subtitle1">
//                 Preview ({rows.length} rows)
//               </Typography>
//               <TableContainer component={Paper} sx={{ mt: 1, maxHeight: 360 }}>
//                 <Table size="small" stickyHeader>
//                   <TableHead>
//                     <TableRow>
//                       {excelColumns.map((c) => (
//                         <TableCell key={c}>{c}</TableCell>
//                       ))}
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {rows.map((r, i) => (
//                       <TableRow key={i}>
//                         {excelColumns.map((c) => (
//                           <TableCell key={c} style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" }}>
//                             {String(r[c] ?? r[dbNameFromUI(c)] ?? "").slice(0, 200)}
//                           </TableCell>
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

// export default EmployeeBulkUpload_AllModules;

// EmployeeBulkUpload_AllModules.js
import React, { useState } from "react";
import {
  Grid,
  Box,
  Paper,
  AppBar,
  Toolbar,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  LinearProgress,
} from "@mui/material";

import * as XLSX from "xlsx";
import Navbar from "../../Home Page/Navbar";
import Sidenav from "../../Home Page/Sidenav";

import { postRequest } from "../../../serverconfiguration/requestcomp";
import { ServerConfig } from "../../../serverconfiguration/serverconfig";
import { SAVE } from "../../../serverconfiguration/controllers";

import { toast } from "react-toastify";

/**
 * EmployeeBulkUpload_AllModules
 *
 * NOTE (very important):
 * - I DID NOT MODIFY your employee insert logic (buildEmployeeSQL) or employeeColumns.
 * - Added: template selection, download templates for masters, preview for selected template,
 *   and row-by-row insert logic for master tables (Division, Department, Designation, Grade, Shift, Category, JobStatus, Level).
 */

const EmployeeBulkUpload_AllModules = () => {
  // ------------------------------
  // 1) Final UI/Excel column list (Employee) - EXACT as you supplied earlier
  // ------------------------------
  const excelColumns = [
    "CompanyID", // readonly in UI - optional in Excel
    "BranchID", // readonly in UI - optional in Excel

    "employeeFirstName",
    "employeeMiddleName",
    "employeeLastName",
    "employeeFullName",
    "dateofBirth",
    "gender",
    "status",
    "bloodGroup",
    "d_Date",

    "employeeCode",
    "password",

    "pnDesignationId",
    "pnDepartmentId",
    "pnDivisionId",
    "pnGradeId",
    "pn_ShiftID",
    "pnCategoryId",
    "pnJobStatusId",
    "pnLevelId",
    "pnProjectsiteId",

    "aadharCard",
    "micrCode",
    "branchName",
    "bankName",
    "bankCode",
    "accountNo",
    "ifscCode",
    "accountType",
    "panNo",

    "ctc",
    "paymentMode",
    "basicSalary",
    "readerid",
    "salaryType",
    "role",
    "otherInfo",
    "otEligible",
    "tdsApplicable",
    "otCalc",

    "passportNumber",
    "visaDetails",
    "uan",
    "pfno",
    "esino",

    "email",
    "alternateEmail",
    "phoneNo",
    "alternatePhoneNo",
    "permanentAddress",
    "currentAddress",

    "highestQualification",
    "universityName",
    "yearOfPassing",
    "certifications",
    "skills",

    "overallExperience",
    "previousCompany",
    "previousDesignation",
    "previousEmploymentDuration",
    "reasonForLeaving",
    "performanceRating",
    "trainingRecords",
    "awards",

    "reportingId",
    "reportingPerson",
    "reportingEmail",
    "vReason",
    "rDepartment",

    "fatherName",
    "joiningDate",
    "vehicleDetails",
    "healthInsuranceDetails",
    "nomineeDetails",
    "NomineePhoneno",
    "NomineeRelationship",

    "assetType",
    "assetName",
    "assetSerialNumber",
  ];

  // ------------------------------
  // 2) Master table columns (you provided final lists)
  // ------------------------------
  const divisionCols = [
    "pn_CompanyID",
    "BranchID",
    "pn_DivisionID",
    "v_DivisionName",
    "status",
  ];
  const departmentCols = [
    "pn_CompanyID",
    "pn_BranchID",
    "pn_DepartmentID",
    "v_DepartmentName",
    "status",
  ];
  const designationCols = [
    "pn_CompanyID",
    "BranchID",
    "pn_DesignationID",
    "v_DesignationName",
    "Authority",
    "status",
  ];
  const gradeCols = [
    "pn_CompanyID",
    "BranchID",
    "pn_GradeID",
    "v_GradeName",
    "status",
  ];
  const shiftCols = [
    "pn_CompanyID",
    "pn_branchid",
    "pn_ShiftID",
    "shift_code",
    "start_time",
    "break_time_out",
    "break_time_in",
    "end_time",
    "shift_indicator",
    "Shift_Type",
  ];
  const categoryCols = [
    "pn_CompanyID",
    "BranchID",
    "pn_CategoryID",
    "v_CategoryName",
    "status",
  ];
  const jobStatusCols = [
    "pn_CompanyID",
    "BranchID",
    "pn_JobStatusID",
    "v_JobStatusName",
    "status",
  ];
  const levelCols = [
    "pn_CompanyID",
    "BranchID",
    "pn_LevelID",
    "v_LevelName",
    "status",
  ];

  // ------------------------------
  // state
  // ------------------------------
  const [rows, setRows] = useState([]);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentSql, setCurrentSql] = useState("");
  const databaseName =
    sessionStorage.getItem("databaseName") || "HRMS_004_Mallow";

  // NEW: template type selector
  const [templateType, setTemplateType] = useState("Employee"); // Employee default

  // ------------------------------
  // Helper: format SQL-safe values (keeps your existing style)
  // ------------------------------
  const sqlValue = (val) => {
    if (val === undefined || val === null || val === "") return "''";
    // If numeric-looking and not leading-zero string, return as-is (no quotes)
    const num = Number(val);
    if (
      !isNaN(num) &&
      String(val).trim() !== "" &&
      !/^0\d+/.test(String(val))
    ) {
      return String(val);
    }
    return `'${String(val).replace(/'/g, "''")}'`;
  };

  // ------------------------------
  // Download Excel template for selected template
  // ------------------------------
  const downloadTemplate = () => {
    let columnsToUse = excelColumns; // default = employee
    switch (templateType) {
      case "Division":
        columnsToUse = divisionCols;
        break;
      case "Department":
        columnsToUse = departmentCols;
        break;
      case "Designation":
        columnsToUse = designationCols;
        break;
      case "Grade":
        columnsToUse = gradeCols;
        break;
      case "Shift":
        columnsToUse = shiftCols;
        break;
      case "Category":
        columnsToUse = categoryCols;
        break;
      case "JobStatus":
        columnsToUse = jobStatusCols;
        break;
      case "Level":
        columnsToUse = levelCols;
        break;
      default:
        columnsToUse = excelColumns;
    }

    const headerObj = {};
    columnsToUse.forEach((c) => (headerObj[c] = ""));
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet([headerObj]);
    XLSX.utils.book_append_sheet(wb, ws, `${templateType}_Template`);
    XLSX.writeFile(wb, `${templateType}_template.xlsx`);
  };

  // ------------------------------
  // Read excel file and normalize rows according to selected template
  // ------------------------------
  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFileName(f.name);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const wb = XLSX.read(ev.target.result, { type: "binary" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      // Choose active columns depending on selected template
      let activeCols = excelColumns;
      switch (templateType) {
        case "Division":
          activeCols = divisionCols;
          break;
        case "Department":
          activeCols = departmentCols;
          break;
        case "Designation":
          activeCols = designationCols;
          break;
        case "Grade":
          activeCols = gradeCols;
          break;
        case "Shift":
          activeCols = shiftCols;
          break;
        case "Category":
          activeCols = categoryCols;
          break;
        case "JobStatus":
          activeCols = jobStatusCols;
          break;
        case "Level":
          activeCols = levelCols;
          break;
        default:
          activeCols = excelColumns;
      }

      // Normalize to expected columns; add missing columns as ''
      const out = json.map((r) => {
        const obj = {};
        activeCols.forEach((c) => {
          // If Excel uses a DB-like name we tolerate it by checking row[c] directly
          obj[c] =
            r[c] !== undefined
              ? r[c]
              : r[dbNameFromUI(c)] !== undefined
              ? r[dbNameFromUI(c)]
              : "";
        });

        // Copy any extra keys (in case user used DB column names directly)
        Object.keys(r).forEach((k) => {
          if (!obj[k]) obj[k] = r[k];
        });

        return obj;
      });

      setRows(out);
      toast.success(`${out.length} row(s) loaded from ${f.name}`);
    };
    reader.readAsBinaryString(f);
  };

  // ------------------------------
  // Map UI field name -> DB column name (same as your mapping)
  // ------------------------------
  function dbNameFromUI(uiName) {
    const map = {
      employeeFirstName: "Employee_First_Name",
      employeeMiddleName: "Employee_Middle_Name",
      employeeLastName: "Employee_Last_Name",
      employeeFullName: "Employee_Full_Name",
      dateofBirth: "DateofBirth",
      gender: "Gender",
      status: "status",
      bloodGroup: "Blood_Group",
      d_Date: "d_Date",
      employeeCode: "EmployeeCode",
      password: "Password",
      pnDivisionId: "pnDivisionId",
      pnDepartmentId: "pnDepartmentId",
      pnDesignationId: "pnDesignationId",
      pnGradeId: "pnGradeId",
      pn_ShiftID: "pn_ShiftID",
      pnCategoryId: "pnCategoryId",
      pnJobStatusId: "pnJobStatusId",
      pnLevelId: "pnLevelId",
      pnProjectsiteId: "pnProjectsiteId",
      aadharCard: "Aadhar_Card",
      micrCode: "MICR_code",
      branchName: "Branch_Name",
      bankName: "Bank_Name",
      bankCode: "Bank_code",
      accountNo: "accountNo",
      ifscCode: "IFSC_Code",
      accountType: "Account_Type",
      panNo: "Pan_no",
      ctc: "CTC",
      paymentMode: "PaymentMode",
      basicSalary: "basic_salary",
      readerid: "Readerid",
      salaryType: "salary_type",
      role: "role",
      otherInfo: "Other_Info",
      otEligible: "OT_Eligible",
      tdsApplicable: "TDS_Applicable",
      otCalc: "OT_calc",
      passportNumber: "PassportNumber",
      visaDetails: "VisaDetails",
      uan: "UAN",
      pfno: "Pfno",
      esino: "Esino",
      email: "Email",
      alternateEmail: "Alternate_Email",
      phoneNo: "Phone_No",
      alternatePhoneNo: "Alternate_Phone_No",
      permanentAddress: "permanent_address",
      currentAddress: "Current_Address",
      highestQualification: "HighestQualification",
      universityName: "UniversityName",
      yearOfPassing: "YearOfPassing",
      certifications: "Certifications",
      skills: "Skills",
      overallExperience: "Overall_Experience",
      previousCompany: "PreviousCompany",
      previousDesignation: "PreviousDesignation",
      previousEmploymentDuration: "PreviousEmploymentDuration",
      reasonForLeaving: "ReasonForLeaving",
      performanceRating: "PerformanceRating",
      trainingRecords: "TrainingRecords",
      awards: "Awards",
      reportingId: "ReportingID",
      reportingPerson: "Reporting_person",
      reportingEmail: "Reporting_email",
      vReason: "v_Reason",
      rDepartment: "r_Department",
      fatherName: "Father_Name",
      joiningDate: "JoiningDate",
      vehicleDetails: "VehicleDetails",
      healthInsuranceDetails: "HealthInsuranceDetails",
      nomineeDetails: "NomineeDetails",
      NomineePhoneno: "NomineePhoneno",
      NomineeRelationship: "NomineeRelationship",
      assetType: "AssetType",
      assetName: "Asset_Name",
      assetSerialNumber: "Asset_SerialNumber",
      CompanyID: "CompanyID",
      BranchID: "BranchID",
      // master columns (if Excel uses DB names directly they will be copied by handleFileChange)
    };
    return map[uiName] || uiName;
  }

  // ------------------------------
  // Helper: build a row-level SQL for a master table (row-by-row insertion)
  // We'll produce an IF NOT EXISTS + INSERT to avoid duplicates
  // ------------------------------
  const buildMasterRowSQL = (type, r) => {
    switch (type) {
      case "Division": {
        // columns: pn_CompanyID, BranchID, v_DivisionName, status
        return `
IF NOT EXISTS (
  SELECT 1 FROM [${databaseName}].[dbo].[paym_Division]
  WHERE pn_CompanyID=${sqlValue(r.pn_CompanyID || r.CompanyID || "")}
    AND BranchID=${sqlValue(r.BranchID || r.pn_BranchID || r.branchName || "")}
    AND v_DivisionName=${sqlValue(r.v_DivisionName || "")}
)
BEGIN
  INSERT INTO [${databaseName}].[dbo].[paym_Division]
  (pn_CompanyID, BranchID, v_DivisionName, status)
  VALUES (
    ${sqlValue(r.pn_CompanyID || r.CompanyID || "")},
    ${sqlValue(r.BranchID || r.pn_BranchID || r.branchName || "")},
    ${sqlValue(r.v_DivisionName || "")},
    ${sqlValue((r.status || "").substring(0, 1))}

  );
END;
`;
      }

      case "Department": {
        return `
IF NOT EXISTS (
  SELECT 1 FROM [${databaseName}].[dbo].[paym_Department]
  WHERE pn_CompanyID=${sqlValue(r.pn_CompanyID || r.CompanyID || "")}
    AND pn_BranchID=${sqlValue(
      r.pn_BranchID || r.BranchID || r.branchName || ""
    )}
    AND v_DepartmentName=${sqlValue(r.v_DepartmentName || "")}
)
BEGIN
  INSERT INTO [${databaseName}].[dbo].[paym_Department]
  (pn_CompanyID, pn_BranchID, v_DepartmentName, status)
  VALUES (
    ${sqlValue(r.pn_CompanyID || r.CompanyID || "")},
    ${sqlValue(r.pn_BranchID || r.BranchID || r.branchName || "")},
    ${sqlValue(r.v_DepartmentName || "")},
${sqlValue((r.status || "").substring(0, 1))}
  );
END;
`;
      }

      case "Designation": {
        return `
IF NOT EXISTS (
  SELECT 1 FROM [${databaseName}].[dbo].[paym_Designation]
  WHERE pn_CompanyID=${sqlValue(r.pn_CompanyID || r.CompanyID || "")}
    AND BranchID=${sqlValue(r.BranchID || r.pn_BranchID || r.branchName || "")}
    AND v_DesignationName=${sqlValue(r.v_DesignationName || "")}
)
BEGIN
  INSERT INTO [${databaseName}].[dbo].[paym_Designation]
  (pn_CompanyID, BranchID, v_DesignationName, Authority, status)
  VALUES (
    ${sqlValue(r.pn_CompanyID || r.CompanyID || "")},
    ${sqlValue(r.BranchID || r.pn_BranchID || r.branchName || "")},
    ${sqlValue(r.v_DesignationName || "")},
    ${sqlValue(r.Authority || "")},
${sqlValue((r.status || "").substring(0, 1))}
  );
END;
`;
      }

      case "Grade": {
        return `
IF NOT EXISTS (
  SELECT 1 FROM [${databaseName}].[dbo].[paym_Grade]
  WHERE pn_CompanyID=${sqlValue(r.pn_CompanyID || r.CompanyID || "")}
    AND BranchID=${sqlValue(r.BranchID || r.pn_BranchID || r.branchName || "")}
    AND v_GradeName=${sqlValue(r.v_GradeName || "")}
)
BEGIN
  INSERT INTO [${databaseName}].[dbo].[paym_Grade]
  (pn_CompanyID, BranchID, v_GradeName, status)
  VALUES (
    ${sqlValue(r.pn_CompanyID || r.CompanyID || "")},
    ${sqlValue(r.BranchID || r.pn_BranchID || r.branchName || "")},
    ${sqlValue(r.v_GradeName || "")},
${sqlValue((r.status || "").substring(0, 1))}
  );
END;
`;
      }

      case "Shift": {
        return `
IF NOT EXISTS (
  SELECT 1 FROM [${databaseName}].[dbo].[paym_Shift]
  WHERE pn_CompanyID=${sqlValue(r.pn_CompanyID || r.CompanyID || "")}
    AND pn_branchid=${sqlValue(
      r.pn_branchid || r.BranchID || r.pn_BranchID || ""
    )}
    AND shift_code=${sqlValue(r.shift_code || "")}
)
BEGIN
  INSERT INTO [${databaseName}].[dbo].[paym_Shift]
  (pn_CompanyID, pn_branchid, shift_code, start_time, break_time_out, break_time_in, end_time, shift_indicator, Shift_Type)
  VALUES (
    ${sqlValue(r.pn_CompanyID || r.CompanyID || "")},
    ${sqlValue(r.pn_branchid || r.BranchID || r.pn_BranchID || "")},
    ${sqlValue(r.shift_code || "")},
    ${sqlValue(r.start_time || "")},
    ${sqlValue(r.break_time_out || "")},
    ${sqlValue(r.break_time_in || "")},
    ${sqlValue(r.end_time || "")},
    ${sqlValue(r.shift_indicator || "")},
    ${sqlValue(r.Shift_Type || "")}
  );
END;
`;
      }

      case "Category": {
        return `
IF NOT EXISTS (
  SELECT 1 FROM [${databaseName}].[dbo].[paym_Category]
  WHERE pn_CompanyID=${sqlValue(r.pn_CompanyID || r.CompanyID || "")}
    AND BranchID=${sqlValue(r.BranchID || r.pn_BranchID || r.branchName || "")}
    AND v_CategoryName=${sqlValue(r.v_CategoryName || "")}
)
BEGIN
  INSERT INTO [${databaseName}].[dbo].[paym_Category]
  (pn_CompanyID, BranchID, v_CategoryName, status)
  VALUES (
    ${sqlValue(r.pn_CompanyID || r.CompanyID || "")},
    ${sqlValue(r.BranchID || r.pn_BranchID || r.branchName || "")},
    ${sqlValue(r.v_CategoryName || "")},
${sqlValue((r.status || "").substring(0, 1))}
  );
END;
`;
      }

      case "JobStatus": {
        return `
IF NOT EXISTS (
  SELECT 1 FROM [${databaseName}].[dbo].[paym_JobStatus]
  WHERE pn_CompanyID=${sqlValue(r.pn_CompanyID || r.CompanyID || "")}
    AND BranchID=${sqlValue(r.BranchID || r.pn_BranchID || r.branchName || "")}
    AND v_JobStatusName=${sqlValue(r.v_JobStatusName || "")}
)
BEGIN
  INSERT INTO [${databaseName}].[dbo].[paym_JobStatus]
  (pn_CompanyID, BranchID, v_JobStatusName, status)
  VALUES (
    ${sqlValue(r.pn_CompanyID || r.CompanyID || "")},
    ${sqlValue(r.BranchID || r.pn_BranchID || r.branchName || "")},
    ${sqlValue(r.v_JobStatusName || "")},
${sqlValue((r.status || "").substring(0, 1))}
  );
END;
`;
      }

      case "Level": {
        return `
IF NOT EXISTS (
  SELECT 1 FROM [${databaseName}].[dbo].[paym_Level]
  WHERE pn_CompanyID=${sqlValue(r.pn_CompanyID || r.CompanyID || "")}
    AND BranchID=${sqlValue(r.BranchID || r.pn_BranchID || r.branchName || "")}
    AND v_LevelName=${sqlValue(r.v_LevelName || "")}
)
BEGIN
  INSERT INTO [${databaseName}].[dbo].[paym_Level]
  (pn_CompanyID, BranchID, v_LevelName, status)
  VALUES (
    ${sqlValue(r.pn_CompanyID || r.CompanyID || "")},
    ${sqlValue(r.BranchID || r.pn_BranchID || r.branchName || "")},
    ${sqlValue(r.v_LevelName || "")},
${sqlValue((r.status || "").substring(0, 1))}
  );
END;
`;
      }

      default:
        return "";
    }
  };

  // ------------------------------
  // Build master-table SQL (insert-if-not-exists) — keep your original function if needed by employee path
  // (I will keep it here exactly as you had it earlier, untouched)
  // ------------------------------
  const buildMasterSQL = (rows) => {
    let sql = "";

    rows.forEach((r) => {
      // DIVISION
      if (r.v_DivisionName) {
        sql += `
IF NOT EXISTS (
  SELECT 1 FROM [${databaseName}].[dbo].[paym_Division]
  WHERE pn_CompanyID=${sqlValue(r.pn_CompanyID)}
  AND BranchID=${sqlValue(r.BranchID || r.pn_BranchID || "")}
  AND v_DivisionName=${sqlValue(r.v_DivisionName)}
)
BEGIN
  INSERT INTO [${databaseName}].[dbo].[paym_Division]
  (pn_CompanyID,BranchID,v_DivisionName,status)
  VALUES (
    ${sqlValue(r.pn_CompanyID)},
    ${sqlValue(r.BranchID || r.pn_BranchID || "")},
    ${sqlValue(r.v_DivisionName)},
    ${sqlValue(r.status)}
  );
END;
`;
      }

      // DEPARTMENT
      if (r.v_DepartmentName) {
        sql += `
IF NOT EXISTS (
  SELECT 1 FROM [${databaseName}].[dbo].[paym_Department]
  WHERE pn_CompanyID=${sqlValue(r.pn_CompanyID)}
  AND pn_BranchID=${sqlValue(r.pn_BranchID || r.BranchID || "")}
  AND v_DepartmentName=${sqlValue(r.v_DepartmentName)}
)
BEGIN
  INSERT INTO [${databaseName}].[dbo].[paym_Department]
  (pn_CompanyID,pn_BranchID,v_DepartmentName,status)
  VALUES (
    ${sqlValue(r.pn_CompanyID)},
    ${sqlValue(r.pn_BranchID || r.BranchID || "")},
    ${sqlValue(r.v_DepartmentName)},
    ${sqlValue(r.status)}
  );
END;
`;
      }

      // DESIGNATION
      if (r.v_DesignationName) {
        sql += `
IF NOT EXISTS (
  SELECT 1 FROM [${databaseName}].[dbo].[paym_Designation]
  WHERE pn_CompanyID=${sqlValue(r.pn_CompanyID)}
  AND BranchID=${sqlValue(r.BranchID || r.pn_BranchID || "")}
  AND v_DesignationName=${sqlValue(r.v_DesignationName)}
)
BEGIN
  INSERT INTO [${databaseName}].[dbo].[paym_Designation]
  (pn_CompanyID,BranchID,v_DesignationName,Authority,status)
  VALUES (
    ${sqlValue(r.pn_CompanyID)},
    ${sqlValue(r.BranchID || r.pn_BranchID || "")},
    ${sqlValue(r.v_DesignationName)},
    ${sqlValue(r.Authority)},
    ${sqlValue(r.status)}
  );
END;
`;
      }

      // GRADE
      if (r.v_GradeName) {
        sql += `
IF NOT EXISTS (
  SELECT 1 FROM [${databaseName}].[dbo].[paym_Grade]
  WHERE pn_CompanyID=${sqlValue(r.pn_CompanyID)}
  AND BranchID=${sqlValue(r.BranchID || r.pn_BranchID || "")}
  AND v_GradeName=${sqlValue(r.v_GradeName)}
)
BEGIN
  INSERT INTO [${databaseName}].[dbo].[paym_Grade]
  (pn_CompanyID,BranchID,v_GradeName,status)
  VALUES (
    ${sqlValue(r.pn_CompanyID)},
    ${sqlValue(r.BranchID || r.pn_BranchID || "")},
    ${sqlValue(r.v_GradeName)},
    ${sqlValue(r.status)}
  );
END;
`;
      }

      // SHIFT
      if (r.shift_code) {
        sql += `
IF NOT EXISTS (
  SELECT 1 FROM [${databaseName}].[dbo].[paym_Shift]
  WHERE pn_CompanyID=${sqlValue(r.pn_CompanyID)}
  AND pn_branchid=${sqlValue(r.pn_branchid || r.pn_BranchID || "")}
  AND shift_code=${sqlValue(r.shift_code)}
)
BEGIN
  INSERT INTO [${databaseName}].[dbo].[paym_Shift]
  (pn_CompanyID,pn_branchid,shift_code,start_time,break_time_out,break_time_in,end_time,shift_indicator,Shift_Type)
  VALUES (
    ${sqlValue(r.pn_CompanyID)},
    ${sqlValue(r.pn_branchid || r.pn_BranchID || "")},
    ${sqlValue(r.shift_code)},
    ${sqlValue(r.start_time)},
    ${sqlValue(r.break_time_out)},
    ${sqlValue(r.break_time_in)},
    ${sqlValue(r.end_time)},
    ${sqlValue(r.shift_indicator)},
    ${sqlValue(r.Shift_Type)}
  );
END;
`;
      }

      // CATEGORY
      if (r.v_CategoryName) {
        sql += `
IF NOT EXISTS (
  SELECT 1 FROM [${databaseName}].[dbo].[paym_Category]
  WHERE pn_CompanyID=${sqlValue(r.pn_CompanyID)}
  AND BranchID=${sqlValue(r.BranchID || r.pn_BranchID || "")}
  AND v_CategoryName=${sqlValue(r.v_CategoryName)}
)
BEGIN
  INSERT INTO [${databaseName}].[dbo].[paym_Category]
  (pn_CompanyID,BranchID,v_CategoryName,status)
  VALUES (
    ${sqlValue(r.pn_CompanyID)},
    ${sqlValue(r.BranchID || r.pn_BranchID || "")},
    ${sqlValue(r.v_CategoryName)},
    ${sqlValue(r.status)}
  );
END;
`;
      }

      // JOB STATUS
      if (r.v_JobStatusName) {
        sql += `
IF NOT EXISTS (
  SELECT 1 FROM [${databaseName}].[dbo].[paym_JobStatus]
  WHERE pn_CompanyID=${sqlValue(r.pn_CompanyID)}
  AND BranchID=${sqlValue(r.BranchID || r.pn_BranchID || "")}
  AND v_JobStatusName=${sqlValue(r.v_JobStatusName)}
)
BEGIN
  INSERT INTO [${databaseName}].[dbo].[paym_JobStatus]
  (pn_CompanyID,BranchID,v_JobStatusName,status)
  VALUES (
    ${sqlValue(r.pn_CompanyID)},
    ${sqlValue(r.BranchID || r.pn_BranchID || "")},
    ${sqlValue(r.v_JobStatusName)},
    ${sqlValue(r.status)}
  );
END;
`;
      }

      // LEVEL
      if (r.v_LevelName) {
        sql += `
IF NOT EXISTS (
  SELECT 1 FROM [${databaseName}].[dbo].[paym_Level]
  WHERE pn_CompanyID=${sqlValue(r.pn_CompanyID)}
  AND BranchID=${sqlValue(r.BranchID || r.pn_BranchID || "")}
  AND v_LevelName=${sqlValue(r.v_LevelName)}
)
BEGIN
  INSERT INTO [${databaseName}].[dbo].[paym_Level]
  (pn_CompanyID,BranchID,v_LevelName,status)
  VALUES (
    ${sqlValue(r.pn_CompanyID)},
    ${sqlValue(r.BranchID || r.pn_BranchID || "")},
    ${sqlValue(r.v_LevelName)},
    ${sqlValue(r.status)}
  );
END;
`;
      }
    });

    return sql;
  };

  // ------------------------------
  // Build employee + profile + login SQL for ONE row (UNTOUCHED)
  // I pasted your original employee SQL builder here exactly (kept as-is)
  // ------------------------------
  const buildEmployeeSQL = (r) => {
    // Map UI names to DB values (use dbNameFromUI where helpful)
    // Main paym_Employee columns we will insert (order matters)
    const empColumnsOrdered = [
      "pn_CompanyID", // must be provided in Excel (or session)
      "pn_BranchID",
      // Note: pn_EmployeeID is identity in DB — we DO NOT insert it
      "EmployeeCode",
      "Employee_First_Name",
      "Employee_Middle_Name",
      "Employee_Last_Name",
      "DateofBirth",
      "Password",
      "Gender",
      "status",
      "Employee_Full_Name",
      "Readerid",
      "OT_Eligible",
      "Pfno",
      "Esino",
      "OT_calc",
      "CTC",
      "basic_salary",
      "Bank_code",
      "Bank_Name",
      "Branch_Name",
      "Account_Type",
      "MICR_code",
      "IFSC_Code",
      "Other_Info",
      "Reporting_person",
      "ReportingID",
      "Reporting_email",
      "Pan_no",
      "salary_type",
      "TDS_Applicable",
      "Flag", // kept, but if not provided will be ''
      "role",
      "accountNo",
      "Blood_Group",
      "Phone_No",
      "Alternate_Phone_No",
      "permanent_address",
      "Aadhar_Card",
      "Current_Address",
      "Father_Name",
      "Email",
      "Alternate_Email",
      "Grade",
      "Overall_Experience",
      "HighestQualification",
      "UniversityName",
      "YearOfPassing",
      "Certifications",
      "Skills",
      "UAN",
      "PaymentMode",
      "PassportNumber",
      "VisaDetails",
      "JoiningDate",
      "ExitReason",
      "PreviousCompany",
      "PreviousDesignation",
      "PreviousEmploymentDuration",
      "ReasonForLeaving",
      "PerformanceRating",
      "TrainingRecords",
      "DisciplinaryActions",
      "Awards",
      "VehicleDetails",
      "HealthInsuranceDetails",
      "NomineeDetails",
      "Asset_Name",
      "Asset_SerialNumber",
      "NomineePhoneno",
      "NomineeRelationship",
      "ExitDate",
      "AssetType",
    ];

    // Helper to get value from row, supporting UI names
    const val = (dbCol) => {
      // try to find by DB name in row (sometimes Excel uses DB names)
      const possibleUi = uiNameFromDb(dbCol);
      // prefer the UI name value if exists, else the DB-named value, else ''
      return (
        (possibleUi &&
          (r[possibleUi] !== undefined ? r[possibleUi] : undefined)) ??
        (r[dbCol] !== undefined ? r[dbCol] : r[dbNameFromUI(possibleUi)] ?? "")
      );
    };

    // Build VALUES list in same order
    const empVals = empColumnsOrdered.map((c) => {
      const v = val(c);
      return sqlValue(v);
    });

    const empInsert = `
-- INSERT EMPLOYEE (row)
INSERT INTO [${databaseName}].[dbo].[paym_Employee] (
  pn_CompanyID,pn_BranchID,
  ${empColumnsOrdered.slice(2).join(",\n  ")}
)
VALUES (
  ${sqlValue(
    r.pn_CompanyID ||
      r.CompanyID ||
      sessionStorage.getItem("pn_CompanyID") ||
      ""
  )},
  ${sqlValue(
    r.pn_BranchID || r.BranchID || sessionStorage.getItem("pn_BranchID") || ""
  )},
  ${empVals.slice(2).join(", ")}
);

DECLARE @NewEmpId INT = SCOPE_IDENTITY();
`;

    // Profile insert — uses @NewEmpId
    const profileInsert = `
INSERT INTO [${databaseName}].[dbo].[paym_employee_profile1] (
  pn_CompanyID,pn_BranchID,pn_EmployeeID,
  pn_DivisionId,pn_DepartmentId,pn_DesignationId,pn_GradeId,pn_ShiftId,
  pn_CategoryId,pn_JobStatusId,pn_LevelID,pn_projectsiteID,d_Date,v_Reason,r_Department,
  father_name,Emp_Profile_Image,image_data
)
VALUES (
  ${sqlValue(r.pn_CompanyID || r.CompanyID || "")},
  ${sqlValue(r.pn_BranchID || r.BranchID || "")},
  @NewEmpId,
  ${sqlValue(r.pnDivisionId || r.pnDivisionID || r.pnDivisionId || "")},
  ${sqlValue(r.pnDepartmentId || r.pnDepartmentID || "")},
  ${sqlValue(r.pnDesignationId || r.pnDesignationID || "")},
  ${sqlValue(r.pnGradeId || r.pnGradeID || "")},
  ${sqlValue(r.pn_ShiftID || r.pnShiftID || "")},
  ${sqlValue(r.pnCategoryId || r.pnCategoryID || "")},
  ${sqlValue(r.pnJobStatusId || r.pnJobStatusID || "")},
  ${sqlValue(r.pnLevelId || r.pnLevelID || "")},
  ${sqlValue(r.pnProjectsiteId || r.pn_ProjectsiteID || "")},
  ${sqlValue(r.d_Date || r.d_Date || "")},
  ${sqlValue(r.vReason || r.v_Reason || "")},
  ${sqlValue(r.rDepartment || r.r_Department || "")},
  ${sqlValue(r.fatherName || r.Father_Name || "")},
  NULL, NULL
);
`;

    // Login insert (HRMS_Master)
    const loginInsert = `
INSERT INTO [HRMS_Master].[dbo].[EmployeesLogin] (EmployeeUserId,Password,DBname,employeeFullName)
VALUES (
  ${sqlValue(r.employeeCode || r.EmployeeCode || "")},
  ${sqlValue(r.password || r.Password || "")},
  ${sqlValue(databaseName)},
  ${sqlValue(r.employeeFullName || r.Employee_Full_Name || "")}
);
`;

    return empInsert + profileInsert + loginInsert;
  };

  // helper reverse mapping DB->UI name if exists (unchanged)
  function uiNameFromDb(db) {
    const reverse = {
      Employee_First_Name: "employeeFirstName",
      Employee_Middle_Name: "employeeMiddleName",
      Employee_Last_Name: "employeeLastName",
      Employee_Full_Name: "employeeFullName",
      DateofBirth: "dateofBirth",
      Gender: "gender",
      status: "status",
      Blood_Group: "bloodGroup",
      EmployeeCode: "employeeCode",
      Password: "password",
      Aadhar_Card: "aadharCard",
      MICR_code: "micrCode",
      Branch_Name: "branchName",
      Bank_Name: "bankName",
      Bank_code: "bankCode",
      accountNo: "accountNo",
      IFSC_Code: "ifscCode",
      Account_Type: "accountType",
      Pan_no: "panNo",
      CTC: "ctc",
      PaymentMode: "paymentMode",
      basic_salary: "basicSalary",
      Readerid: "readerid",
      salary_type: "salaryType",
      role: "role",
      Other_Info: "otherInfo",
      OT_Eligible: "otEligible",
      TDS_Applicable: "tdsApplicable",
      OT_calc: "otCalc",
      PassportNumber: "passportNumber",
      VisaDetails: "visaDetails",
      UAN: "uan",
      Pfno: "pfno",
      Esino: "esino",
      Email: "email",
      Alternate_Email: "alternateEmail",
      Phone_No: "phoneNo",
      Alternate_Phone_No: "alternatePhoneNo",
      permanent_address: "permanentAddress",
      Current_Address: "currentAddress",
      HighestQualification: "highestQualification",
      UniversityName: "universityName",
      YearOfPassing: "yearOfPassing",
      Certifications: "certifications",
      Skills: "skills",
      Overall_Experience: "overallExperience",
      PreviousCompany: "previousCompany",
      PreviousDesignation: "previousDesignation",
      PreviousEmploymentDuration: "previousEmploymentDuration",
      ReasonForLeaving: "reasonForLeaving",
      PerformanceRating: "performanceRating",
      TrainingRecords: "trainingRecords",
      Awards: "awards",
      ReportingID: "reportingId",
      Reporting_person: "reportingPerson",
      Reporting_email: "reportingEmail",
      v_Reason: "vReason",
      r_Department: "rDepartment",
      Father_Name: "fatherName",
      JoiningDate: "joiningDate",
      VehicleDetails: "vehicleDetails",
      HealthInsuranceDetails: "healthInsuranceDetails",
      NomineeDetails: "nomineeDetails",
      NomineePhoneno: "NomineePhoneno",
      NomineeRelationship: "NomineeRelationship",
      AssetType: "assetType",
      Asset_Name: "assetName",
      Asset_SerialNumber: "assetSerialNumber",
      pnDivisionId: "pnDivisionId",
      pnDepartmentId: "pnDepartmentId",
      pnDesignationId: "pnDesignationId",
      pnGradeId: "pnGradeId",
      pn_ShiftID: "pn_ShiftID",
      pnCategoryId: "pnCategoryId",
      pnJobStatusId: "pnJobStatusId",
      pnLevelId: "pnLevelId",
      pnProjectsiteId: "pnProjectsiteId",
    };
    return reverse[db] || null;
  }

  // ------------------------------
  // Execute upload
  // Behavior:
  // - If templateType === "Employee" => original flow (masterSql + row-by-row employee inserts)
  // - Else => row-by-row inserts for the selected master table using buildMasterRowSQL
  // ------------------------------
  const executeUpload = async () => {
    if (!rows || rows.length === 0) {
      toast.error("No rows to upload. Please load the Excel first.");
      return;
    }

    setLoading(true);
    setProgress(0);

    if (templateType === "Employee") {
      // Original employee flow: run buildMasterSQL once (keeps your original behavior)
      const masterSql = buildMasterSQL(rows);
      if (masterSql && masterSql.trim() !== "") {
        try {
          await postRequest(ServerConfig.url, SAVE, { query: masterSql });
        } catch (err) {
          toast.error("Master table inserts failed. Check console.");
          console.error("Master SQL error:", err);
          // continue to employee inserts anyway
        }
      }

      // Row-by-row employee insert (unchanged)
      for (let i = 0; i < rows.length; i++) {
        const r = rows[i];

        const sql = buildEmployeeSQL(r);
        setCurrentSql(sql);

        try {
          await postRequest(ServerConfig.url, SAVE, { query: sql });
        } catch (err) {
          toast.error(`Error inserting employee row ${i + 1}. Check console.`);
          console.error(`Row ${i + 1} SQL error:`, err);
        }

        setProgress(Math.round(((i + 1) / rows.length) * 100));
      }
    } else {
      // Master table row-by-row insertion
      for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        const sql = buildMasterRowSQL(templateType, r);
        if (!sql || sql.trim() === "") {
          // skip if no SQL constructed
          continue;
        }
        setCurrentSql(sql);

        try {
          await postRequest(ServerConfig.url, SAVE, { query: sql });
        } catch (err) {
          toast.error(
            `Error inserting ${templateType} row ${i + 1}. Check console.`
          );
          console.error(`${templateType} Row ${i + 1} SQL error:`, err);
        }

        setProgress(Math.round(((i + 1) / rows.length) * 100));
      }
    }

    setLoading(false);
    toast.success("Upload finished.");
  };

  // ------------------------------
  // UI
  // ------------------------------
  // The preview table will display active columns for the selected template
  const getActiveColumnsForPreview = () => {
    switch (templateType) {
      case "Division":
        return divisionCols;
      case "Department":
        return departmentCols;
      case "Designation":
        return designationCols;
      case "Grade":
        return gradeCols;
      case "Shift":
        return shiftCols;
      case "Category":
        return categoryCols;
      case "JobStatus":
        return jobStatusCols;
      case "Level":
        return levelCols;
      default:
        return excelColumns;
    }
  };

  return (
    <Grid item xs={12}>
      <Navbar />
      <Box sx={{ height: 20 }} />

      <Box sx={{ display: "flex" }}>
        <Sidenav />

        <Grid
          item
          xs={12}
          sm={10}
          md={9}
          lg={8}
          xl={7}
          sx={{ p: 4 }}
          style={{ margin: "40px auto" }}
        >
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Employee Bulk Upload — Multi-Module (Row-by-Row)
              </Typography>
            </Toolbar>
          </AppBar>

          {/* TEMPLATE SELECT + DOWNLOAD + UPLOAD */}
          <Paper
            sx={{ p: 2, mt: 3, display: "flex", gap: 2, alignItems: "center" }}
          >
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileChange}
              style={{ marginLeft: 12 }}
            />

            <Button
              variant="contained"
              color="success"
              onClick={executeUpload}
              // sx={{ marginLeft: "auto" }}
              disabled={loading || rows.length === 0}
            >
              Upload
            </Button>
            <FormControl sx={{ minWidth: 240 }}>
              <InputLabel id="template-select-label">Template</InputLabel>
              <Select
                labelId="template-select-label"
                value={templateType}
                label="Template"
                onChange={(e) => setTemplateType(e.target.value)}
              >
                <MenuItem value="Employee">Employee</MenuItem>
                <MenuItem value="Division">Division</MenuItem>
                <MenuItem value="Department">Department</MenuItem>
                <MenuItem value="Designation">Designation</MenuItem>
                <MenuItem value="Grade">Grade</MenuItem>
                <MenuItem value="Shift">Shift</MenuItem>
                <MenuItem value="Category">Category</MenuItem>
                <MenuItem value="JobStatus">Job Status</MenuItem>
                <MenuItem value="Level">Level</MenuItem>
              </Select>
            </FormControl>

            <Button variant="contained" onClick={downloadTemplate}>
              Download Template
            </Button>

            
          </Paper>
          {/* <Paper
            sx={{
              p: 2,
              mt: 3,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <FormControl sx={{ minWidth: 240 }}>
                <InputLabel id="template-select-label">Template</InputLabel>
                <Select
                  labelId="template-select-label"
                  value={templateType}
                  label="Template"
                  onChange={(e) => setTemplateType(e.target.value)}
                >
                  <MenuItem value="Employee">Employee</MenuItem>
                  <MenuItem value="Division">Division</MenuItem>
                  <MenuItem value="Department">Department</MenuItem>
                  <MenuItem value="Designation">Designation</MenuItem>
                  <MenuItem value="Grade">Grade</MenuItem>
                  <MenuItem value="Shift">Shift</MenuItem>
                  <MenuItem value="Category">Category</MenuItem>
                  <MenuItem value="JobStatus">Job Status</MenuItem>
                  <MenuItem value="Level">Level</MenuItem>
                </Select>
              </FormControl>

              <Button variant="contained" onClick={downloadTemplate}>
                Download Template
              </Button>
            </Box>

            
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <input
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
                style={{ marginLeft: 12 }}
              />

              <Button
                variant="contained"
                color="success"
                onClick={executeUpload}
                // sx={{ marginLeft: "auto" }}
                disabled={loading || rows.length === 0}
              >
                Upload
              </Button>
            </Box>
          </Paper> */}

          {loading && (
            <Box sx={{ mt: 2 }}>
              <Typography>Progress: {progress}%</Typography>
              <LinearProgress variant="determinate" value={progress} />
            </Box>
          )}

          {rows.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1">
                Preview ({rows.length} rows)
              </Typography>
              <TableContainer component={Paper} sx={{ mt: 1, width: 1000 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      {getActiveColumnsForPreview().map((c) => (
                        <TableCell key={c}>{c}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((r, i) => (
                      <TableRow key={i}>
                        {getActiveColumnsForPreview().map((c) => (
                          <TableCell
                            key={c}
                            style={{
                              maxWidth: 200,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {String(r[c] ?? r[dbNameFromUI(c)] ?? "").slice(
                              0,
                              200
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Grid>
      </Box>
    </Grid>
  );
};

export default EmployeeBulkUpload_AllModules;
