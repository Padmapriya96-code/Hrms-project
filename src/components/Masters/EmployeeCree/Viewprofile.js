import React from "react";
import "../../../App.css"; // Import the global CSS file
import axios from "axios";
import {
  TextField,
  Button,
  Avatar,
  Typography,
  InputLabel,
  FormControl,
  Container,
  Grid,
  formControlClasses,
  Box,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
//import defaultImage from '../../../images/person-dummy-Copy.jpeg';
import { Select, MenuItem } from "@mui/material";
// AG Grid imports
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import FormHelperText from "@mui/material/FormHelperText";
import defaultImage from "../../../images/Image Icons/image.png";
import { useState, useEffect } from "react";
import { Stepper, Step, StepLabel } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { useParams } from "react-router-dom";
import Sidenav from "../../Home Page/Sidenav";
import Navbar from "../../Home Page/Navbar";
import {
  PAYMCOMPANIES,
  PAYMBRANCHES,
  REPORTS,
} from "../../../serverconfiguration/controllers";
import {
  getRequest,
  postRequest,
} from "../../../serverconfiguration/requestcomp";
import { ServerConfig } from "../../../serverconfiguration/serverconfig";
import { useNavigate } from "react-router-dom";
import {
  PAYMDIVISION,
  PAYMDEPARTMENT,
  PAYMDESIGNATION,
  PAYMGRADE,
  PAYMSHIFT,
  PAYMCATEGORY,
  JOBSTATUS,
  PAYMLEVEL,
} from "../../../serverconfiguration/controllers";
import { useLocation } from "react-router-dom";
export default function Editprofile() {
  const steps = [
    "General Information",
    "Employment Details",
    "Bank / Salary Details",
    "Compliance Details",
    "Contact Information",
    "Education & Skills ",
    "Experience Details",
    "Reporting Details",
    "Additional Info",
  ];

  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set()); // Using a Set for tracking completed
  const { id } = useParams();
  console.log(id);

  //const isViewMode = !!id;
  const location = useLocation();
  const [isViewMode, setIsViewMode] = useState(true); // default true
  const dbname = sessionStorage.getItem("databaseName");

  useEffect(() => {
    // Check if we're in view mode from navigation state
    if (location.state?.isViewMode !== undefined) {
      setIsViewMode(location.state.isViewMode);
    } else if (id) {
      // If we have an ID but no explicit view mode state, default to view mode
      setIsViewMode(true);
    }
  }, [location.state, id]);

  const [company, setCompany] = useState([]);
  const [branch, setBranch] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isloggedin, setloggedin] = useState(sessionStorage.getItem("user"));
  const [loggedBranch, setloggedBranch] = useState([]);
  const [loggedCompany, setloggedCompany] = useState([]);
  const [division, setDivision] = useState([]);

  const [department, setDepartment] = useState([]);
  const [designation, setDesignation] = useState([]);
  const [grade, setGrade] = useState([]);
  const [shift, setShift] = useState([]);
  const [category, setCategory] = useState([]);
  const [jobstatus, setJobStatus] = useState([]);
  const [level, setLevel] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [assets, setAssets] = useState([]);
  // State variables for form fields
  const [pnCompanyId, setPnCompanyId] = useState("");
  const [pnBranchId, setPnBranchId] = useState("");
  const [pnDivisionId, setPnDivisionId] = useState("");
  const [pnDepartmentId, setPnDepartmentId] = useState("");
  const [pnDesignationId, setPnDesignationId] = useState("");
  const [pnGradeId, setPnGradeId] = useState("");
  const [pn_ShiftID, setPnShiftId] = useState("");
  const [pnCategoryId, setPnCategoryId] = useState("");
  const [pnJobStatusId, setPnJobStatusId] = useState("");
  const [pnLevelId, setPnLevelId] = useState("");
  const [pnProjectsiteId, setPnProjectsiteId] = useState("");
  const [d_Date, setd_Date] = useState("");
  const [uniqueAssetTypes, setUniqueAssetTypes] = useState([]);
  const [v_Reason, setVReason] = useState("");
  const [r_Department, setRDepartment] = useState("");
  const [formData, setFormData] = useState({
    pnCompanyId: "",
    pnBranchId: "",
    employeeCode: "",
    password: "",
    employeeFirstName: "",
    employeeMiddleName: "",
    employeeLastName: "",
    dateofBirth: "",
    gender: "",
    status: "",
    employeeFullName: "",
    readerid: "", //
    otEligible: "", //
    pfno: "", //
    esino: "", //
    otCalc: "", //
    ctc: "",
    basicSalary: "",
    bankCode: "",
    bankName: "",
    branchName: "", //
    accountType: "", //
    micrCode: "", //
    ifscCode: "", //
    // address: "", //
    otherInfo: "", //
    reportingPerson: "", //
    reportingId: "", //
    reportingEmail: "", //
    panNo: "",
    salaryType: "", //
    tdsApplicable: "", //
    flag: null,
    role: "", //
    accountNo: "",
    bloodGroup: "",
    phoneNo: "",
    alternatePhoneNo: "",
    permanentAddress: "",
    aadharCard: "",
    currentAddress: "",
    fatherName: "",
    email: "",
    alternateEmail: "",
    grade: " ", //
    overallExperience: "",
    highestQualification: "",
    universityName: "",
    yearOfPassing: "",
    certifications: "",
    skills: "",
    uan: "",
    paymentMode: "",
    passportNumber: "",
    visaDetails: "",
    joiningDate: "",

    exitReason: null,
    ExitDate: null,
    previousCompany: "",
    previousDesignation: "",
    previousEmploymentDuration: "",
    reasonForLeaving: "",
    performanceRating: "",
    trainingRecords: "",
    disciplinaryActions: null,
    awards: "",
    vehicleDetails: "",
    healthInsuranceDetails: "",
    nomineeDetails: "",
    NomineePhoneno: "",
    NomineeRelationship: "",
    assetType: "",
    assetName: "",
    assetSerialNumber: "",

    pnDivisionId: "",
    pnDepartmentId: "",
    pnDesignationId: "",
    pnGradeId: "",
    pnShiftId: "",
    pnCategoryId: "",
    pnJobStatusId: "",
    pnLevelId: "",
    pnProjectsiteId: "",
    d_Date: "",
    v_Reason: "",
    r_Department: "",
    imageData: "",
  });

  useEffect(() => {
    async function fetchDepartments() {
      try {
        if (pnCompanyId && pnBranchId) {
          const departmentsData = await postRequest(ServerConfig.url, REPORTS, {
            query: `SELECT [pn_CompanyID], [pn_BranchID], [pn_DepartmentID], [v_DepartmentName], [status] 
                  FROM [${dbname}].[dbo].[paym_Department] 
                  WHERE [pn_CompanyID] = ${pnCompanyId} 
                  AND [pn_BranchID] = ${pnBranchId}`,
          });

          if (departmentsData.data) {
            setDepartment(departmentsData.data);
          }
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    }

    fetchDepartments();
  }, [pnCompanyId, pnBranchId]);
  useEffect(() => {
    async function fetchDesignations() {
      try {
        if (pnCompanyId && pnBranchId) {
          const designationsData = await postRequest(
            ServerConfig.url,
            REPORTS,
            {
              query: `
            SELECT [pn_CompanyID], [BranchID], [pn_DesignationID], [v_DesignationName], [Authority], [status] 
            FROM [${dbname}].[dbo].[paym_Designation] 
            WHERE [pn_CompanyID] = ${pnCompanyId} 
              AND [BranchID] = ${pnBranchId}
          `,
            }
          );

          if (designationsData.data) {
            setDesignation(designationsData.data);
          }
        }
      } catch (error) {
        console.error("Error fetching designations:", error);
      }
    }

    fetchDesignations();
  }, [pnCompanyId, pnBranchId]);

  useEffect(() => {
    async function fetchDivisions() {
      try {
        if (pnCompanyId && pnBranchId) {
          const divisionsData = await postRequest(ServerConfig.url, REPORTS, {
            query: `
            SELECT [pn_CompanyID], [BranchID], [pn_DivisionID], [v_DivisionName], [status]
            FROM [${dbname}].[dbo].[paym_Division]
            WHERE [pn_CompanyID] = ${pnCompanyId} 
              AND [BranchID] = ${pnBranchId}
          `,
          });

          if (divisionsData.data) {
            setDivision(divisionsData.data);
          }
        }
      } catch (error) {
        console.error("Error fetching divisions:", error);
      }
    }

    fetchDivisions();
  }, [pnCompanyId, pnBranchId]);
  useEffect(() => {
    async function fetchGrades() {
      try {
        if (pnCompanyId && pnBranchId) {
          const gradesData = await postRequest(ServerConfig.url, REPORTS, {
            query: `
            SELECT [pn_CompanyID], [BranchID], [pn_GradeID], [v_GradeName], [status] 
            FROM [${dbname}].[dbo].[paym_Grade] 
            WHERE [pn_CompanyID] = ${pnCompanyId} 
              AND [BranchID] = ${pnBranchId}
          `,
          });

          if (gradesData.data) {
            setGrade(gradesData.data);
          }
        }
      } catch (error) {
        console.error("Error fetching grades:", error);
      }
    }

    fetchGrades();
  }, [pnCompanyId, pnBranchId]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        if (pnCompanyId && pnBranchId) {
          const categoriesData = await postRequest(ServerConfig.url, REPORTS, {
            query: `
            SELECT [pn_CompanyID], [BranchID], [pn_CategoryID], [v_CategoryName], [status]
            FROM [${dbname}].[dbo].[paym_Category]
            WHERE [pn_CompanyID] = ${pnCompanyId}
              AND [BranchID] = ${pnBranchId}
          `,
          });

          if (categoriesData.data) {
            setCategory(categoriesData.data);
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    fetchCategories();
  }, [pnCompanyId, pnBranchId]);
  useEffect(() => {
    async function fetchJobStatusAndLevels() {
      try {
        if (pnCompanyId && pnBranchId) {
          // Job Status
          const jobStatusData = await postRequest(ServerConfig.url, REPORTS, {
            query: `
            SELECT [pn_CompanyID], [BranchID], [pn_JobStatusID], [v_JobStatusName], [status]
            FROM [${dbname}].[dbo].[paym_JobStatus]
            WHERE [pn_CompanyID] = ${pnCompanyId}
              AND [BranchID] = ${pnBranchId}
          `,
          });
          if (jobStatusData.data) setJobStatus(jobStatusData.data);

          // Level
          const levelsData = await postRequest(ServerConfig.url, REPORTS, {
            query: `
            SELECT [pn_CompanyID], [BranchID], [pn_LevelID], [v_LevelName], [status]
            FROM [${dbname}].[dbo].[paym_Level]
            WHERE [pn_CompanyID] = ${pnCompanyId}
              AND [BranchID] = ${pnBranchId}
          `,
          });
          if (levelsData.data) setLevel(levelsData.data);
        }
      } catch (error) {
        console.error("Error fetching Job Status or Levels:", error);
      }
    }

    fetchJobStatusAndLevels();
  }, [pnCompanyId, pnBranchId]);

  useEffect(() => {
    async function fetchShifts() {
      try {
        if (pnCompanyId && pnBranchId) {
          const shiftsData = await postRequest(ServerConfig.url, REPORTS, {
            query: `
            SELECT [pn_CompanyID], [pn_branchid], [pn_ShiftID], [shift_code], [start_time], 
                   [break_time_out], [break_time_in], [end_time], [shift_indicator], [Shift_Type]
            FROM [${dbname}].[dbo].[paym_Shift]
            WHERE [pn_CompanyID] = ${pnCompanyId} 
              AND [pn_branchid] = ${pnBranchId}
          `,
          });

          if (shiftsData.data) {
            setShift(shiftsData.data);
          }
        }
      } catch (error) {
        console.error("Error fetching shifts:", error);
      }
    }

    fetchShifts();
  }, [pnCompanyId, pnBranchId]);
  const validateForm = (name, value) => {
    switch (name) {
      case "employeeFirstName":
        if (!value.trim()) return "First Name is required";
        if (!/^[a-zA-Z\s]+$/.test(value))
          return "Only letters and spaces allowed";
        return "";
      case "employeeLastName":
        if (!value.trim()) return "Last Name is required";
        if (!/^[a-zA-Z\s]+$/.test(value))
          return "Only letters and spaces allowed";
        return "";
      case "employeeFullName":
        if (!value.trim()) return "Full Name is required";
        if (!/^[a-zA-Z\s]+$/.test(value))
          return "Only letters and spaces allowed";
        return "";

      case "dateofBirth":
        if (!value) return "Date of Birth is required";
        // Optional: Prevent future dates
        const selectedd_Date = new Date(value);
        const today = new Date();
        if (selectedd_Date > today)
          return "Date of Birth cannot be in the future";
        return "";
      case "gender":
        if (!value) return "Gender is required";
        return "";

      case "status":
        if (!value) return "Status is required";
        if (!["A", "I", "P"].includes(value))
          return "Status must be Active (A), Inactive (I) or Pending (P)";
        return "";
      case "bloodGroup":
        if (!value) return "Blood Group is required";
        return "";

      case "d_Date":
        if (!value) return "Confirmation Date is required";
        return "";
      case "employeeCode":
        if (!value.trim()) return "Employee Code is required";
        return "";
      case "pnDesignationId":
        if (!value) return "Designation is required";
        return "";

      case "pnDepartmentId":
        if (!value) return "Department is required";
        return "";
      case "bankCode":
        if (!value || value.trim() === "") return "Bank Code is required";
        if (!/^[a-zA-Z0-9]+$/.test(value))
          return "Bank Code must be alphanumeric";
        if (value.length < 3 || value.length > 10)
          return "Bank Code must be 3-10 characters long";
        return "";

      case "pnDivisionId":
        if (!value) return "Division is required";
        return "";
      case "pnGradeId":
        if (!value) return "Grade is required";
        return "";

      case "pn_ShiftID":
        if (!value) return "Shift is required";
        return "";

      case "pnCategoryId":
        if (!value) return "Category is required";
        return "";
      case "pnJobStatusId":
        if (!value) return "Job Status is required";
        return "";

      case "pnLevelId":
        if (!value) return "Level is required";
        return "";

      case "pnProjectsiteId":
        if (!value.trim()) return "Project Site ID is required";
        return "";

      case "phoneNo":
        if (!value.trim()) return "Phone number is required";
        if (!/^\d{10}$/.test(value)) return "Phone number must be 10 digits";
        return "";

      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value))
          return "Invalid email format";
        return "";

      case "aadharCard":
        if (!value.trim()) return "Aadhar Card Number is required";
        else if (!/^\d{12}$/.test(value))
          return "Aadhar Card must be 12 digits";
        return "";

      case "bankName":
        if (!value.trim()) return "Bank Name is required";
        return "";

      case "accountNo":
        if (!value.trim()) return "Account Number is required";
        return "";

      case "ifscCode":
        if (!value.trim()) return "IFSC Code is required";
        return "";

      case "accountType":
        if (!value.trim()) return "Account Type is required";
        return "";

      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value))
          return "Invalid email format";
        return "";

      case "phoneNo":
        if (!value.trim()) return "Phone number is required";
        if (!/^\d{10}$/.test(value)) return "Phone number must be 10 digits";
        return "";

      case "alternatePhoneNo":
        if (value && !/^\d{10}$/.test(value))
          return "Alternate phone number must be 10 digits";
        return "";

      //   case 'address':
      // if (!value.trim()) return 'Address is required';
      //  return '';

      case "permanentAddress":
        if (!value.trim()) return "Permanent Address is required";
        return "";

      case "currentAddress":
        if (!value.trim()) return "Current Address is required";
        return "";
      case "highestQualification":
        if (!value.trim()) return "Highest Qualification is required";
        return "";

      case "universityName":
        if (!value.trim()) return "University Name is required";
        return "";

      case "yearOfPassing":
        if (!value.trim()) return "Year of Passing is required";
        if (!/^\d{4}$/.test(value)) return "Enter a valid 4-digit year";
        if (parseInt(value) > new Date().getFullYear())
          return "Year cannot be in the future";
        return "";

      case "certifications":
        if (!value.trim()) return "Certifications are required";
        return "";

      case "skills":
        if (!value.trim()) return "Skills are required";
        return "";
      case "overallExperience":
        if (value === "" || value === null)
          return "Overall Experience is required";
        if (isNaN(value) || parseFloat(value) < 0)
          return "Experience must be a non-negative number";
        return "";
      case "reportingId":
        if (value === "" || value === null) return "Reporting ID is required";
        if (!/^\d+$/.test(value)) return "Reporting ID must be a valid number";
        return "";
      case "alternateEmail":
        if (!value || value.trim() === "") return "Alternate Email is required";
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value))
          return "Invalid email format";
        return "";
      case "reportingPerson":
        if (!value || value.trim() === "")
          return "Reporting Person is required";
        if (!/^[a-zA-Z\s]+$/.test(value))
          return "Only letters and spaces allowed";
        return "";
      case "status":
        if (!value || value.trim() === "") return "Status is required";
        if (!["A", "I"].includes(value.toUpperCase()))
          return 'Status must be "A" (Active) or "I" (Inactive)';
        return "";

      case "reportingEmail":
        if (!value || value.trim() === "") return "Reporting Email is required";
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value))
          return "Invalid email format";
        return "";
      case "joiningDate":
        if (!value || value.trim() === "") return "Joining Date is required";
        if (isNaN(Date.parse(value))) return "Invalid date format";
        return "";
      case "nomineeDetails":
        if (!value || value.trim() === "")
          return "Nominee details are required";
        return "";

      case "NomineePhoneno":
        if (!value || value.trim() === "")
          return "Nominee phone number is required";
        if (!/^\d{10}$/.test(value)) return "Phone number must be 10 digits";
        return "";

      case "NomineeRelationship":
        if (!value || value.trim() === "")
          return "Nominee relationship is required";
        return "";
      case "panNo":
        if (!value || value.trim() === "") return "PAN Number is required";
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value.toUpperCase()))
          return "Invalid PAN format (e.g., ABCDE1234F)";
        return "";
      case "assetName":
        if (!value || value.trim() === "") return "Asset name is required";
        return "";

      case "assetSerialNumber":
        if (!value || value.trim() === "")
          return "Asset serial number is required";
        return "";
      case "micrCode":
        if (!value || value.trim() === "") return "MICR Code is required";
        if (!/^\d{9}$/.test(value)) return "MICR Code must be exactly 9 digits";
        return "";
      case "branchName":
        if (!value.trim()) return "Branch Name is required";
        if (!/^[a-zA-Z\s]+$/.test(value))
          return "Branch Name should contain only letters and spaces";
        if (value.length > 50)
          return "Branch Name must be at most 50 characters";
        return "";
      // Add more fields as needed

      default:
        return "";
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const errorMsg = validateForm(name, value);

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg,
    }));
  };

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Others", label: "Others" },
  ];

  const bloodGroupOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  useEffect(() => {
    if (!id) {
      console.warn("No employee ID provided.");
      return;
    }
    // const id = 3136

    console.log("Fetching employee data for ID:", id);

    const fetchEmployeeData = async () => {
      try {
        // Fetch both employee and profile data in parallel
        const [employeeResponse, profileResponse] = await Promise.all([
          postRequest(ServerConfig.url, REPORTS, {
            query: `SELECT * FROM [${dbname}].[dbo].[paym_Employee] WHERE [pn_EmployeeID] = ${id}`,
          }),
          postRequest(ServerConfig.url, REPORTS, {
            query: `SELECT * FROM [${dbname}].[dbo].[paym_employee_profile1] WHERE [pn_EmployeeID] = ${id}`,
          }),
        ]);

        console.log("Employee API Response:", employeeResponse);
        console.log("Profile API Response:", profileResponse);

        // Check if we got data
        if (employeeResponse?.data?.length > 0) {
          const employeeData = employeeResponse.data[0];
          const profileData =
            profileResponse?.data?.length > 0 ? profileResponse.data[0] : {};

          console.log("Employee Data:", employeeData);
          console.log("Profile Data:", profileData);

          // Helper function to safely format dates
          const safeFormatDate = (dateValue) => {
            if (!dateValue) return "";

            if (typeof dateValue === "object" && dateValue.$date) {
              return new Date(dateValue.$date).toISOString().split("T")[0];
            }

            if (dateValue instanceof Date) {
              return dateValue.toISOString().split("T")[0];
            }

            if (typeof dateValue === "string") {
              const parsed = new Date(dateValue);
              if (!isNaN(parsed)) {
                return parsed.toISOString().split("T")[0];
              }
            }

            return "";
          };

          // Set form data
          const newFormData = {
            // Employee table fields
            pnCompanyId: employeeData.pn_CompanyID || "",
            pnBranchId: employeeData.pn_BranchID || "",
            employeeCode: employeeData.EmployeeCode || "",
            password: employeeData.Password || "",
            employeeFirstName: employeeData.Employee_First_Name || "",
            employeeMiddleName: employeeData.Employee_Middle_Name || "",
            employeeLastName: employeeData.Employee_Last_Name || "",
            dateofBirth: safeFormatDate(employeeData.DateofBirth),
            gender: employeeData.Gender || "",
            status:
              employeeData.status === "Active"
                ? "A"
                : employeeData.status === "Inactive"
                ? "I"
                : employeeData.status === "Pending"
                ? "P"
                : "A",

            employeeFullName: employeeData.Employee_Full_Name || "",
            readerid: employeeData.Readerid || "",
            otEligible: employeeData.OT_Eligible || "",
            pfno: employeeData.Pfno || "",
            esino: employeeData.Esino || "",
            otCalc: employeeData.OT_calc || "",
            ctc: employeeData.CTC || "",
            basicSalary: employeeData.basic_salary || "",
            bankCode: employeeData.Bank_code || "",
            bankName: employeeData.Bank_Name || "",
            branchName: employeeData.Branch_Name || "",
            accountType: employeeData.Account_Type || "",
            micrCode: employeeData.MICR_code || "",
            ifscCode: employeeData.IFSC_Code || "",
            otherInfo: employeeData.Other_Info || "",
            reportingPerson: employeeData.Reporting_person || "",
            reportingId: employeeData.ReportingID || "",
            reportingEmail: employeeData.Reporting_email || "",
            panNo: employeeData.Pan_no || "",
            salaryType: employeeData.salary_type || "",
            tdsApplicable: employeeData.TDS_Applicable || "",
            flag: employeeData.Flag,
            role: employeeData.role || "",
            accountNo: employeeData.accountNo || "",
            bloodGroup: employeeData.Blood_Group || "",
            phoneNo: employeeData.Phone_No || "",
            alternatePhoneNo: employeeData.Alternate_Phone_No || "",
            permanentAddress: employeeData.permanent_address || "",
            aadharCard: employeeData.Aadhar_Card || "",
            currentAddress: employeeData.Current_Address || "",
            fatherName: employeeData.Father_Name || "",
            email: employeeData.Email || "",
            alternateEmail: employeeData.Alternate_Email || "",
            grade: employeeData.Grade || "",
            overallExperience: employeeData.Overall_Experience || "",
            highestQualification: employeeData.HighestQualification || "",
            universityName: employeeData.UniversityName || "",
            yearOfPassing: employeeData.YearOfPassing || "",
            certifications: employeeData.Certifications || "",
            skills: employeeData.Skills || "",
            uan: employeeData.UAN || "",
            paymentMode: employeeData.PaymentMode || "",
            passportNumber: employeeData.PassportNumber || "",
            visaDetails: employeeData.VisaDetails || "",
            joiningDate: safeFormatDate(employeeData.JoiningDate),
            exitReason: employeeData.ExitReason,
            ExitDate: safeFormatDate(employeeData.ExitDate),
            previousCompany: employeeData.PreviousCompany || "",
            previousDesignation: employeeData.PreviousDesignation || "",
            previousEmploymentDuration:
              employeeData.PreviousEmploymentDuration || "",
            reasonForLeaving: employeeData.ReasonForLeaving || "",
            performanceRating: employeeData.PerformanceRating || "",
            trainingRecords: employeeData.TrainingRecords || "",
            disciplinaryActions: employeeData.DisciplinaryActions,
            awards: employeeData.Awards || "",
            vehicleDetails: employeeData.VehicleDetails || "",
            healthInsuranceDetails: employeeData.HealthInsuranceDetails || "",
            nomineeDetails: employeeData.NomineeDetails || "",
            NomineePhoneno: employeeData.NomineePhoneno || "",
            NomineeRelationship: employeeData.NomineeRelationship || "",
            assetType: employeeData.AssetType || "",
            assetName: employeeData.Asset_Name || "",
            assetSerialNumber: employeeData.Asset_SerialNumber || "",

            // Profile table fields
            pnDivisionId: profileData.pn_DivisionId || "",
            pnDepartmentId: profileData.pn_DepartmentId || "",
            pnDesignationId: profileData.pn_DesignationId || "",
            pnGradeId: profileData.pn_GradeId || "",
            pn_ShiftID: profileData.pn_ShiftId || "",
            pnCategoryId: profileData.pn_CategoryId || "",
            pnJobStatusId: profileData.pn_JobStatusId || "",
            pnLevelId: profileData.pn_LevelID || "",
            pnProjectsiteId: profileData.pn_projectsiteID || "",
            d_Date: safeFormatDate(profileData.d_Date),
            v_Reason: profileData.v_Reason || "",
            r_Department: profileData.r_Department || "",
            imageData: profileData.image_data || "",
          };
          Object.keys(newFormData).forEach((key) => {
            const val = newFormData[key];
            if (val && typeof val === "object") {
              newFormData[key] = ""; // Replace any object with empty string
            }
          });

          console.log("New Form Data to be set:", newFormData);
          setFormData(newFormData);

          // Set preview image
          const imageData = profileData.image_data;
          if (imageData) {
            setPreviewUrl(
              imageData.startsWith("data:image")
                ? imageData
                : `data:image/jpeg;base64,${imageData}`
            );
          } else {
            setPreviewUrl(null);
          }

          // Set company and branch IDs for dropdowns
          setPnCompanyId(employeeData.pn_CompanyID || "");
          setPnBranchId(employeeData.pn_BranchID || "");
        } else {
          console.warn("No employee data found for ID:", id);
          alert("No employee data found for the provided ID.");
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
        alert(
          "Failed to load employee data. Please check console for details."
        );
      }
    };

    fetchEmployeeData();
  }, [id]);
  useEffect(() => {
    async function fetchAssetTypes() {
      try {
        const response = await postRequest(ServerConfig.url, REPORTS, {
          query: `SELECT DISTINCT AssetType FROM [${dbname}].[dbo].[paym_Employee] WHERE AssetType IS NOT NULL`,
        });
        if (response.data) {
          setUniqueAssetTypes(response.data.map((item) => item.AssetType));
        }
      } catch (error) {
        console.error("Error fetching asset types:", error);
      }
    }

    fetchAssetTypes();
  }, []);

  useEffect(() => {
    async function fetchAssets() {
      try {
        if (pnCompanyId && pnBranchId) {
          const assetsData = await postRequest(ServerConfig.url, REPORTS, {
            query: `SELECT [Asset_name], [Asset_SerialNumber] 
                  FROM [${dbname}].[dbo].[Assets] 
                  WHERE [pn_CompanyID] = ${pnCompanyId} 
                  AND [BranchID] = ${pnBranchId}`,
          });

          if (assetsData.data) {
            setAssets(assetsData.data);
          }
        }
      } catch (error) {
        console.error("Error fetching assets:", error);
      }
    }

    fetchAssets();
  }, [pnCompanyId, pnBranchId]); // Run when company or branch changes

  // useEffect(() => {
  //   async function getData() {
  //     try {
  //       const [
  //         companies,
  //         branches,
  //         divisions,
  //         departments,
  //         designations,
  //         grades,
  //         shifts,
  //         categories,
  //         jobStatuses,
  //         levels,
  //       ] = await Promise.all([
  //         getRequest(ServerConfig.url, PAYMCOMPANIES),
  //         getRequest(ServerConfig.url, PAYMBRANCHES),
  //         getRequest(ServerConfig.url, PAYMDIVISION),
  //         getRequest(ServerConfig.url, PAYMDEPARTMENT),
  //         getRequest(ServerConfig.url, PAYMDESIGNATION),
  //         getRequest(ServerConfig.url, PAYMGRADE),
  //         getRequest(ServerConfig.url, PAYMSHIFT),
  //         getRequest(ServerConfig.url, PAYMCATEGORY),
  //         getRequest(ServerConfig.url, JOBSTATUS),
  //         getRequest(ServerConfig.url, PAYMLEVEL),
  //       ]);

  //       setCompany(companies.data);
  //       setBranch(branches.data);
  //       setDivision(divisions.data);
  //       setDepartment(departments.data);
  //       setDesignation(designations.data);
  //       setGrade(grades.data);
  //       setShift(shifts.data);
  //       setCategory(categories.data);
  //       setJobStatus(jobStatuses.data);
  //       setLevel(levels.data);

  //       if (isloggedin) {
  //         const loggedBranchData = await postRequest(
  //           ServerConfig.url,
  //           REPORTS,
  //           {
  //             query: `select * from paym_Branch where Branch_User_Id = '${isloggedin}'`,
  //           }
  //         );

  //         if (loggedBranchData.data) {
  //           setloggedBranch(loggedBranchData.data);
  //           setPnBranchId(loggedBranchData.data[0].pn_BranchID);

  //           const loggedCompanyData = await postRequest(
  //             ServerConfig.url,
  //             REPORTS,
  //             {
  //               query: `select * from paym_Company where pn_CompanyID = ${loggedBranchData.data[0].pn_CompanyID}`,
  //             }
  //           );

  //           if (loggedCompanyData.data) {
  //             setloggedCompany(loggedCompanyData.data);
  //             setPnCompanyId(loggedCompanyData.data[0].pn_CompanyID);
  //           }
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data", error);
  //     }
  //   }
  //   console.log("shift data:", shift);

  //   getData();
  // }, [isloggedin]);

  useEffect(() => {
    async function getData() {
      try {
        const dbname = sessionStorage.getItem("databaseName");

        // 🔥 1. Fetch all master tables using REPORTS
        const [
          companies,
          branches,
          divisions,
          departments,
          designations,
          grades,
          shifts,
          categories,
          jobStatuses,
          levels,
        ] = await Promise.all([
          postRequest(ServerConfig.url, REPORTS, {
            dbname,
            query: `SELECT * FROM [${dbname}].[dbo].[paym_Company]`,
          }),

          postRequest(ServerConfig.url, REPORTS, {
            dbname,
            query: `SELECT * FROM [${dbname}].[dbo].[paym_Branch]`,
          }),

          postRequest(ServerConfig.url, REPORTS, {
            dbname,
            query: `SELECT * FROM [${dbname}].[dbo].[paym_Division]`,
          }),

          postRequest(ServerConfig.url, REPORTS, {
            dbname,
            query: `SELECT * FROM [${dbname}].[dbo].[paym_Department]`,
          }),

          postRequest(ServerConfig.url, REPORTS, {
            dbname,
            query: `SELECT * FROM [${dbname}].[dbo].[paym_Designation]`,
          }),

          postRequest(ServerConfig.url, REPORTS, {
            dbname,
            query: `SELECT * FROM [${dbname}].[dbo].[paym_Grade]`,
          }),

          postRequest(ServerConfig.url, REPORTS, {
            dbname,
            query: `SELECT * FROM [${dbname}].[dbo].[paym_Shift]`,
          }),

          postRequest(ServerConfig.url, REPORTS, {
            dbname,
            query: `SELECT * FROM [${dbname}].[dbo].[paym_Category]`,
          }),

          postRequest(ServerConfig.url, REPORTS, {
            dbname,
            query: `SELECT * FROM [${dbname}].[dbo].[paym_JobStatus]`,
          }),

          postRequest(ServerConfig.url, REPORTS, {
            dbname,
            query: `SELECT * FROM [${dbname}].[dbo].[paym_Level]`,
          }),
        ]);

        // 🔥 2. Assign all master data to state
        setCompany(companies.data);
        setBranch(branches.data);
        setDivision(divisions.data);
        setDepartment(departments.data);
        setDesignation(designations.data);
        setGrade(grades.data);
        setShift(shifts.data);
        setCategory(categories.data);
        setJobStatus(jobStatuses.data);
        setLevel(levels.data);

        // 🔥 3. Logged-in user's branch + company
        if (isloggedin) {
          const loggedBranchData = await postRequest(
            ServerConfig.url,
            REPORTS,
            {
              dbname,
              query: `
            SELECT * 
            FROM [${dbname}].[dbo].[paym_Branch]
            WHERE Branch_User_Id = '${isloggedin}'
          `,
            }
          );

          if (loggedBranchData.data?.length > 0) {
            setloggedBranch(loggedBranchData.data);
            setPnBranchId(loggedBranchData.data[0].pn_BranchID);

            const loggedCompanyData = await postRequest(
              ServerConfig.url,
              REPORTS,
              {
                dbname,
                query: `
              SELECT * 
              FROM [${dbname}].[dbo].[paym_Company]
              WHERE pn_CompanyID = ${loggedBranchData.data[0].pn_CompanyID}
            `,
              }
            );

            if (loggedCompanyData.data?.length > 0) {
              setloggedCompany(loggedCompanyData.data);
              setPnCompanyId(loggedCompanyData.data[0].pn_CompanyID);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    }

    getData();
  }, [isloggedin]);

  // useEffect(() => {
  //   async function fetchInitialData() {
  //     const companyData = await getRequest(ServerConfig.url, PAYMCOMPANIES);
  //     setCompany(companyData.data);

  //     const branchData = await getRequest(ServerConfig.url, PAYMBRANCHES);
  //     setBranch(branchData.data);
  //   }

  //   fetchInitialData();
  // }, []); // Only run when isloggedin changes

  useEffect(() => {
    async function fetchInitialData() {
      const dbname = sessionStorage.getItem("databaseName");

      try {
        // 🔥 FETCH COMPANY DATA
        const companyData = await postRequest(ServerConfig.url, REPORTS, {
          dbname: dbname,
          query: `SELECT * FROM [${dbname}].[dbo].[paym_Company]`,
        });
        setCompany(companyData.data);

        // 🔥 FETCH BRANCH DATA
        const branchData = await postRequest(ServerConfig.url, REPORTS, {
          dbname: dbname,
          query: `SELECT * FROM [${dbname}].[dbo].[paym_Branch]`,
        });
        setBranch(branchData.data);
      } catch (error) {
        console.error("Error loading initial company/branch:", error);
      }
    }

    fetchInitialData();
  }, []);

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const loggedBranchData = await postRequest(ServerConfig.url, REPORTS, {
          query: ` select * from [${dbname}].[dbo].[paym_Branch] where Branch_User_Id = '${isloggedin}'`,
        });

        if (loggedBranchData.data) {
          setloggedBranch(loggedBranchData.data);

          // Dynamically set pn_BranchID based on the fetched data
          setFormData((prevData) => ({
            ...prevData,
            pn_BranchID: loggedBranchData.data[0].pn_BranchID,
          }));
        }
      } catch (error) {
        console.error("Error fetching branch data:", error);
      }
    }

    // Always fetch fresh data based on isloggedin
    if (isloggedin) {
      fetchInitialData();
    }
  }, [isloggedin]);

  useEffect(() => {
    async function fetchLoggedCompany() {
      try {
        if (loggedBranch.length > 0) {
          const loggedCompanyData = await postRequest(
            ServerConfig.url,
            REPORTS,
            {
              query: ` select * from [${dbname}].[dbo].[paym_Company] where pn_CompanyID = ${loggedBranch[0].pn_CompanyID}`,
            }
          );

          if (loggedCompanyData.data) {
            setloggedCompany(loggedCompanyData.data);

            // Dynamically set pn_CompanyID based on the fetched data
            setFormData((prevData) => ({
              ...prevData,
              pn_CompanyID: loggedCompanyData.data[0].pn_CompanyID,
            }));
          }
        }
      } catch (error) {
        console.error`("Error fetching company data:", error)`;
      }
    }

    // Fetch company data when loggedBranch is available
    if (loggedBranch.length > 0) {
      fetchLoggedCompany();
    }
  }, [loggedBranch]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];

    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, JPEG, PNG, and GIF files are allowed.");
      return;
    }

    setProfileImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const convertImageToBase64 = (image) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result.split(",")[1];
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(image);
    });
  };

  const handleSkip = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form data
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate the field on change
    const errorMessage = validateForm(name, value);

    // Set error if any
    setFormErrors((prev) => ({ ...prev, [name]: errorMessage }));
  };

  //   const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  //   setFormErrors((prev) => ({ ...prev, [name]: "" })); // Clear error on change
  // };

  //   const handleEmployeeChange = (e) => {
  //     const { name, value } = e.target;
  //     setEmployee({ ...employee, [name]: value });
  //   };

  //   const handleChange = (e) => {
  //     const { name, value } = e.target;
  //     setformData({ ...formData, [name]: value });
  //   };

  // Add this useEffect to handle full name logic
  // useEffect(() => {
  //   const { employeeFirstName, employeeMiddleName, employeeLastName } =
  //     formData;

  //   // Only update full name when all three fields have values
  //   if (employeeFirstName && employeeMiddleName && employeeLastName) {
  //     const fullName = `${employeeFirstName} ${employeeMiddleName} ${employeeLastName}`;
  //     setFormData((prev) => ({ ...prev, employeeFullName: fullName }));
  //   } else {
  //     // Clear full name if any field is empty
  //     setFormData((prev) => ({ ...prev, employeeFullName: "" }));
  //   }
  // }, [
  //   formData.employeeFirstName,
  //   formData.employeeMiddleName,
  //   formData.employeeLastName,
  // ]);

  useEffect(() => {
    const first = formData.employeeFirstName || "";
    const middle =
      typeof formData.employeeMiddleName === "string"
        ? formData.employeeMiddleName
        : "";
    const last = formData.employeeLastName || "";

    const fullName = [first, middle, last]
      .filter((x) => x && x.trim() !== "")
      .join(" ");

    setFormData((prev) => ({
      ...prev,
      employeeFullName: fullName,
    }));
  }, [
    formData.employeeFirstName,
    formData.employeeMiddleName,
    formData.employeeLastName,
  ]);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const errors = validateForm(); // Full form validation
  //   if (Object.keys(errors).length > 0) {
  //     setFormErrors(errors); // Set all errors
  //     alert("Please fix validation errors before submitting.");
  //     return;
  //   }

  //   if (!profileImage) {
  //     alert("Please upload an image before submitting.");
  //     return;
  //   }

  //   try {
  //     const base64Image = await convertImageToBase64(profileImage);
  //     console.log(base64Image);

  //     const dataToSend = {
  //       employee: {
  //         pnCompanyId: formData.pn_CompanyID,
  //         pnBranchId: formData.pn_BranchID,
  //         employeeCode: formData.employeeCode,
  //         employeeFirstName: formData.employeeFirstName,
  //         employeeMiddleName: formData.employeeMiddleName,
  //         employeeLastName: formData.employeeLastName,
  //         dateofBirth: formData.dateofBirth,
  //         gender: formData.gender,
  //         status: formData.status,
  //         employeeFullName: formData.employeeFullName,
  //         readerid: formData.readerid,
  //         otEligible: formData.otEligible,
  //         pfno: formData.pfno,
  //         esino: formData.esino,
  //         otCalc: formData.otCalc,
  //         ctc: formData.ctc,
  //         basicSalary: formData.basicSalary,
  //         bankCode: formData.bankCode,
  //         bankName: formData.bankName,
  //         branchName: formData.branchName,
  //         accountType: formData.accountType,
  //         micrCode: formData.micrCode,
  //         ifscCode: formData.ifscCode,
  //         //  address: formData.address,
  //         otherInfo: formData.otherInfo,
  //         reportingPerson: formData.reportingPerson,
  //         reportingId: formData.reportingId,
  //         reportingEmail: formData.reportingEmail,
  //         panNo: formData.panNo,
  //         salaryType: formData.salaryType,
  //         tdsApplicable: formData.tdsApplicable,
  //         flag: formData.flag,
  //         role: formData.role,
  //         accountNo: formData.accountNo,
  //         bloodGroup: formData.bloodGroup,
  //         phoneNo: formData.phoneNo,
  //         alternatePhoneNo: formData.alternatePhoneNo,
  //         permanentAddress: formData.permanentAddress,
  //         aadharCard: formData.aadharCard,
  //         currentAddress: formData.currentAddress,
  //         fatherName: formData.fatherName,
  //         email: formData.email,
  //         alternateEmail: formData.alternateEmail,
  //         grade: formData.grade,
  //         overallExperience: formData.overallExperience,
  //         highestQualification: formData.highestQualification,
  //         universityName: formData.universityName,
  //         yearOfPassing: formData.yearOfPassing,
  //         certifications: formData.certifications,
  //         skills: formData.skills,
  //         uan: formData.uan,
  //         paymentMode: formData.paymentMode,
  //         passportNumber: formData.passportNumber,
  //         visaDetails: formData.visaDetails,
  //         joiningDate: formData.joiningDate,
  //         ExitDate: formData.ExitDate,
  //         exitReason: formData.exitReason,
  //         previousCompany: formData.previousCompany,
  //         previousDesignation: formData.previousDesignation,
  //         previousEmploymentDuration: formData.previousEmploymentDuration,
  //         reasonForLeaving: formData.reasonForLeaving,
  //         performanceRating: formData.performanceRating,
  //         trainingRecords: formData.trainingRecords,
  //         disciplinaryActions: formData.disciplinaryActions,
  //         awards: formData.awards,
  //         vehicleDetails: formData.vehicleDetails,
  //         healthInsuranceDetails: formData.healthInsuranceDetails,
  //         nomineeDetails: formData.nomineeDetails,
  //         NomineePhoneno: formData.NomineePhoneno,
  //         NomineeRelationship: formData.NomineeRelationship,
  //         assetName: formData.assetName,
  //         assetSerialNumber: formData.assetSerialNumber,

  //       },
  //       employeeProfile: {
  //         pnCompanyId: formData.pn_CompanyID,
  //         pnBranchId: formData.pn_BranchID,
  //         pnDivisionId: formData.pnDivisionId,
  //         pnDepartmentId: formData.pnDepartmentId,
  //         pnDesingnationId: formData.pnDesignationId,
  //         pnGradeId: formData.pnGradeId,
  //         pnShiftId: formData.pn_ShiftID,
  //         pnCategoryId: formData.pnCategoryId,
  //         pnJobStatusId: formData.pnJobStatusId,
  //         pnLevelId: formData.pnLevelId,
  //         pnProjectsiteId: formData.pnProjectsiteId,
  //         dDate: formData.dDate,
  //         v_Reason: formData.v_Reason,
  //         rDepartment: formData.rDepartment,
  //         imageData: base64Image
  //       }
  //     };

  //     const response = await axios.post(
  //       'https://localhost:7266/api/EmployeeFull/SaveEmployeeWithProfile',
  //       dataToSend
  //     );

  //     console.log('Employee saved:', response.data);
  //     setFormData({
  //       pnCompanyId: "",
  //       pnBranchId: "",
  //       employeeCode: "",
  //       employeeFirstName: "",
  //       employeeMiddleName: "",
  //       employeeLastName: "",
  //       dateofBirth: "",
  //       gender: "",
  //       status: "",
  //       employeeFullName: "",
  //       readerid: "",
  //       otEligible: "",
  //       pfno: "",
  //       esino: "",
  //       otCalc: "",
  //       ctc: "",
  //       basicSalary: "",
  //       bankCode: "",
  //       bankName: "",
  //       branchName: "",
  //       accountType: "",
  //       micrCode: "",
  //       ifscCode: "",
  //       //   address: "",
  //       otherInfo: "",
  //       reportingPerson: "",
  //       reportingId: "",
  //       reportingEmail: "",
  //       panNo: "",
  //       salaryType: "",
  //       tdsApplicable: "",
  //       flag: null,
  //       role: "",
  //       accountNo: "",
  //       bloodGroup: "",
  //       phoneNo: "",
  //       alternatePhoneNo: "",
  //       permanentAddress: "",
  //       aadharCard: "",
  //       currentAddress: "",
  //       fatherName: "",
  //       email: "",
  //       alternateEmail: "",
  //       grade: " ",
  //       overallExperience: "",
  //       highestQualification: "",
  //       universityName: "",
  //       yearOfPassing: "",
  //       certifications: "",
  //       skills: "",
  //       uan: "",
  //       paymentMode: "",
  //       passportNumber: "",
  //       visaDetails: "",
  //       joiningDate: "",
  //       exitReason: null,
  //       ExitDate: null,
  //       previousCompany: "",
  //       previousDesignation: "",
  //       previousEmploymentDuration: "",
  //       reasonForLeaving: "",
  //       performanceRating: "",
  //       trainingRecords: "",
  //       disciplinaryActions: null,
  //       awards: "",
  //       vehicleDetails: "",
  //       healthInsuranceDetails: "",
  //       nomineeDetails: "",
  //       NomineePhoneno: "",
  //       NomineeRelationship: "",
  //       assetName: "",
  //       assetSerialNumber: "",
  //       pnDivisionId: "",
  //       pnDepartmentId: "",
  //       pnDesingnationId: "",
  //       pnGradeId: "",
  //       pnShiftId: "",
  //       pnCategoryId: "",
  //       pnJobStatusId: "",
  //       pnLevelId: "",
  //       pnProjectsiteId: "",
  //       dDate: "",
  //       v_Reason: "",
  //       rDepartment: "",
  //       imageData: ''
  //     });

  //     // Reset other related states
  //     setProfileImage(null);
  //     setPreviewUrl(null);
  //     setFormErrors({});
  //     setActiveStep(0); // Reset to first step if using a stepper
  //     setCompletedSteps(new Set()); // Clear completed steps if using a stepper

  //     alert('Saved successfully');
  //   } catch (error) {
  //     console.error('Error saving employee:', error);
  //     alert('Error saving employee');
  //   }
  // };
  const handleStepClick = (index) => {
    setActiveStep(index);
    // In a real app, you might only allow clicking completed steps
    // or steps that are immediately next.
  };

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleCompleteStep = () => {
    const newCompletedSteps = new Set(completedSteps);
    newCompletedSteps.add(activeStep);
    setCompletedSteps(newCompletedSteps);

    // Only move to the next step if not already past the last step
    if (activeStep < steps.length) {
      // Check if we are within valid step indices
      setActiveStep(activeStep + 1);
    }
  };

  console.log("d_Date", formData.d_Date.split("T")[0]);
  console.log("d_Date", formData.d_Date);

  console.log(formData);
  console.log("pnDesignationId", formData.pnDesignationId);
  console.log("formData.pnDesignationId:", formData.pnDesignationId);
  console.log("designation options:", designation);
  return (
    <Grid item xs={12}>
      <div style={{ backgroundColor: "#f5f5f5" }}>
        <Navbar />
        <Box height={30} />

        {/* Main flex container with Sidenav + Content */}
        <Box
          sx={{
            display: "flex",
            width: "100%",
            backgroundColor: "#efefef",
            alignItems: "flex-start",
          }}
        >
          {/* Sidenav on the left */}
          <Sidenav />

          {/* Main content on the right */}
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
              padding: 2,
            }}
          >
            <div
              className="stepperOuterContainer"
              style={{
                width: "100%",
                maxWidth: "1200px",
              }}
            >
              <form>
                <AppBar
                  position="static"
                  sx={{
                    backgroundColor: "#1976d2",
                    paddingY: "6px",
                    marginBottom: "16px",
                  }}
                >
                  <Toolbar sx={{ minHeight: "60px !important" }}>
                    <Typography
                      variant="h5"
                      sx={{ color: "white", fontWeight: "bold" }}
                    >
                      EMPLOYEE MASTER
                    </Typography>
                  </Toolbar>
                </AppBar>
                {/* Stepper */}
                <div className="stepperContainer">
                  <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label, index) => (
                      <Step key={label} completed={completedSteps.has(index)}>
                        <StepLabel onClick={() => handleStepClick(index)}>
                          {label}
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </div>

                {/* Content area */}
                <Box
                  sx={{
                    mt: 3,
                    width: "100%",
                    maxWidth: "1120px",
                    backgroundColor: "white",
                    padding: "24px",

                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                    border: "1px solid #e0e0e0",
                    textAlign: "center",
                    mx: "auto", // margin left and right auto
                  }}
                >
                  {/* Conditional rendering for step content */}

                  {activeStep === 0 && (
                    <div>
                      <Typography
                        variant="h5" // Change to h6 for a smaller font size
                        gutterBottom
                        sx={{
                          textAlign: "left",
                          fontWeight: "bold",
                          color: "black",
                          lineHeight: "40px", // Adjust line height to match the new height
                          zIndex: 1201,
                        }}
                      >
                        GENERAL INFORMATION
                      </Typography>

                      <Grid item xs={12} sm={2}>
                        <FormControl fullWidth>
                          <input
                            accept="image/*"
                            type="file"
                            onChange={handleImageChange}
                            style={{ display: "none" }}
                            id="imageInput"
                          />
                          <label
                            htmlFor="imageInput"
                            style={{ cursor: "pointer", textAlign: " start" }}
                          >
                            <Avatar
                              src={previewUrl || defaultImage}
                              alt="Profile"
                              sx={{
                                width: 80,
                                height: 80,
                                marginRight: 2,
                                border: 1,
                              }}
                            />
                            <Typography variant="body1" color="primary">
                              {previewUrl ? "Change Image" : "Upload Image"}
                            </Typography>
                          </label>
                        </FormControl>
                      </Grid>
                      <Grid container spacing={1}>
                        <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
                          <TextField
                            fullWidth
                            label="Company Name"
                            name="CompanyName"
                            value={
                              loggedCompany.length > 0
                                ? loggedCompany[0].CompanyName
                                : ""
                            }
                            variant="outlined"
                            InputProps={{
                              readOnly: true,
                            }}
                            className="custom-readonly-textfield"
                          />
                        </Grid>

                        {/* Branch Name (Read-Only) */}

                        {/* Employee Fields */}
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="employeeFirstName"
                            label="First Name"
                            value={formData.employeeFirstName}
                            onChange={!isViewMode ? handleChange : undefined}
                            onBlur={!isViewMode ? handleBlur : undefined}
                            error={!!formErrors.employeeFirstName}
                            helperText={formErrors.employeeFirstName}
                            fullWidth
                            margin="normal"
                            InputProps={{
                              readOnly: isViewMode,
                            }}
                            className="custom-readonly-textfield"
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="employeeMiddleName"
                            label="Middle Name"
                            value={formData.employeeMiddleName}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            className="custom-readonly-textfield"
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="employeeLastName"
                            label="Last Name"
                            value={formData.employeeLastName}
                            onChange={!isViewMode ? handleChange : undefined}
                            onBlur={!isViewMode ? handleBlur : undefined}
                            fullWidth
                            margin="normal"
                            error={!!formErrors.employeeLastName} // <-- shows red border if error exists
                            helperText={formErrors.employeeLastName}
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="employeeFullName"
                            label="Employee Full Name"
                            value={formData.employeeFullName}
                            onChange={!isViewMode ? handleChange : undefined}
                            onBlur={!isViewMode ? handleBlur : undefined}
                            fullWidth
                            margin="normal"
                            InputProps={{ readOnly: true }}
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="dateofBirth"
                            label="Date of Birth"
                            type="date"
                            value={formData.dateofBirth.split("T")[0]} // Format to YYYY-MM-DD
                            onChange={!isViewMode ? handleChange : undefined}
                            onBlur={!isViewMode ? handleBlur : undefined}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            error={!!formErrors.dateofBirth} // Show error red border
                            helperText={formErrors.dateofBirth}
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            select
                            name="gender"
                            label="Gender"
                            value={formData.gender || ""}
                            fullWidth
                            margin="normal"
                            onChange={!isViewMode ? handleChange : undefined}
                            onBlur={!isViewMode ? handleBlur : undefined}
                            error={!!formErrors.gender}
                            helperText={formErrors.gender}
                            className="custom-readonly-textfield"
                          >
                            {genderOptions.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl
                            fullWidth
                            margin="normal"
                            error={!!formErrors.status}
                            className="custom-readonly-textfield"
                          >
                            <InputLabel>Status</InputLabel>
                            <Select
                              name="status"
                              value={formData.status || "A"} // Default to "A" (Active)
                              onChange={!isViewMode ? handleChange : undefined}
                              onBlur={!isViewMode ? handleBlur : undefined}
                              label="Status"
                              className="custom-readonly-textfield"
                            >
                              <MenuItem value="A">Active</MenuItem>
                              <MenuItem value="I">Inactive</MenuItem>
                              <MenuItem value="P">Pending</MenuItem>
                            </Select>
                            {formErrors.status && (
                              <FormHelperText error>
                                {formErrors.status}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextField
                            select
                            name="bloodGroup"
                            label="Blood Group"
                            value={formData.bloodGroup || ""}
                            onChange={!isViewMode ? handleChange : undefined}
                            onBlur={!isViewMode ? handleBlur : undefined}
                            fullWidth
                            margin="normal"
                            error={!!formErrors.bloodGroup}
                            helperText={formErrors.bloodGroup}
                            className="custom-readonly-textfield"
                          >
                            {bloodGroupOptions.map((group) => (
                              <MenuItem key={group} value={group}>
                                {group}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="d_Date"
                            label="Confirmation Date"
                            type="date"
                            value={formData.d_Date || ""}
                            onChange={!isViewMode ? handleChange : undefined}
                            onBlur={!isViewMode ? handleBlur : undefined}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                            error={!!formErrors.d_Date}
                            helperText={formErrors.d_Date}
                          />
                        </Grid>
                      </Grid>
                    </div>
                  )}

                  {activeStep === 1 && (
                    <div>
                      <Typography
                        variant="h5" // Change to h6 for a smaller font size
                        gutterBottom
                        sx={{
                          textAlign: "left",
                          fontWeight: "bold",
                          color: "black",
                          lineHeight: "40px", // Adjust line height to match the new height
                          zIndex: 1201,
                        }}
                      >
                        EMPLOYMENT DETAILS
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} mt={2}>
                          <TextField
                            fullWidth
                            label="Branch Name"
                            name="BranchName"
                            value={
                              loggedBranch.length > 0
                                ? loggedBranch[0].BranchName
                                : ""
                            }
                            variant="outlined"
                            InputProps={{
                              readOnly: true,
                            }}
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} mt={2}>
                          <FormControl fullWidth>
                            <TextField
                              name="pnProjectsiteId"
                              label="Project Site ID"
                              variant="outlined"
                              fullWidth
                              required
                              value={formData.pnProjectsiteId}
                              onChange={
                                !isViewMode
                                  ? (e) =>
                                      setFormData({
                                        ...formData,
                                        pnProjectsiteId: e.target.value,
                                      })
                                  : undefined
                              }
                              onBlur={!isViewMode ? handleBlur : undefined}
                              InputProps={{ readOnly: isViewMode }}
                              InputLabelProps={{ shrink: true }}
                              className="custom-readonly-textfield"
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="employeeCode"
                            label="Employee Code"
                            value={formData.employeeCode}
                            onChange={!isViewMode ? handleChange : undefined}
                            onBlur={!isViewMode ? handleBlur : undefined}
                            fullWidth
                            margin="normal"
                            error={!!formErrors.employeeCode}
                            helperText={formErrors.employeeCode}
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="password"
                            label="Password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            className="custom-readonly-textfield"
                            InputProps={
                              {
                                // You can add additional properties here if needed
                              }
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FormControl
                            fullWidth
                            className="custom-readonly-textfield"
                            error={!!formErrors.pnDesignationId}
                          >
                            <InputLabel id="pnDesignationId-label">
                              Designation
                            </InputLabel>
                            <Select
                              labelId="pnDesignationId-label"
                              id="pnDesignationId"
                              name="pnDesignationId"
                              value={formData.pnDesignationId}
                              onChange={
                                !isViewMode
                                  ? (e) =>
                                      setFormData({
                                        ...formData,
                                        pnDesignationId: e.target.value,
                                      })
                                  : undefined
                              }
                              onBlur={!isViewMode ? handleBlur : undefined}
                              label="Designation"
                              disabled={isViewMode}
                              sx={{ height: "50px" }}
                            >
                              <MenuItem value="">Select</MenuItem>
                              {designation.map((d) => (
                                <MenuItem
                                  key={d.pn_DesignationID}
                                  value={d.pn_DesignationID}
                                >
                                  {d.v_DesignationName}
                                </MenuItem>
                              ))}
                            </Select>
                            <FormHelperText>
                              {formErrors.pnDesignationId}
                            </FormHelperText>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <FormControl
                            fullWidth
                            className="custom-readonly-textfield"
                            error={!!formErrors.pnDepartmentId}
                          >
                            <InputLabel id="pnDepartmentId-label">
                              Department
                            </InputLabel>
                            <Select
                              labelId="pnDepartmentId-label"
                              id="pnDepartmentId"
                              name="pnDepartmentId"
                              value={formData.pnDepartmentId}
                              onChange={
                                !isViewMode
                                  ? (e) =>
                                      setFormData({
                                        ...formData,
                                        pnDepartmentId: e.target.value,
                                      })
                                  : undefined
                              }
                              onBlur={!isViewMode ? handleBlur : undefined}
                              label="Department"
                              disabled={isViewMode} // <--- This disables it in view mode
                              sx={{ height: "50px" }}
                            >
                              <MenuItem value="">Select</MenuItem>
                              {department
                                .filter(
                                  (e) =>
                                    (e.pnCompanyId === pnCompanyId ||
                                      e.pn_CompanyID === pnCompanyId) &&
                                    (e.pnBranchId === pnBranchId ||
                                      e.pn_BranchID === pnBranchId) // ✅ include branch check
                                )
                                .map((e) => (
                                  <MenuItem
                                    key={e.pnDepartmentId || e.pn_DepartmentID}
                                    value={
                                      e.pnDepartmentId || e.pn_DepartmentID
                                    }
                                  >
                                    {e.vDepartmentName || e.v_DepartmentName}
                                  </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>
                              {formErrors.pnDepartmentId}
                            </FormHelperText>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <FormControl
                            fullWidth
                            className="custom-readonly-textfield"
                            error={!!formErrors.pnDivisionId}
                          >
                            <InputLabel id="pnDivisionId-label">
                              Division
                            </InputLabel>
                            <Select
                              labelId="pnDivisionId-label"
                              id="pnDivisionId"
                              name="pnDivisionId"
                              value={formData.pnDivisionId}
                              onChange={
                                !isViewMode
                                  ? (e) =>
                                      setFormData({
                                        ...formData,
                                        pnDivisionId: e.target.value,
                                      })
                                  : undefined
                              }
                              onBlur={!isViewMode ? handleBlur : undefined}
                              label="Division"
                              disabled={isViewMode} // disables in view mode
                              sx={{ height: "50px" }}
                            >
                              <MenuItem value="">Select</MenuItem>
                              {division.map((d) => (
                                <MenuItem
                                  key={d.pn_DivisionID}
                                  value={d.pn_DivisionID}
                                >
                                  {d.v_DivisionName}
                                </MenuItem>
                              ))}
                            </Select>
                            <FormHelperText>
                              {formErrors.pnDivisionId}
                            </FormHelperText>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <FormControl
                            fullWidth
                            className="custom-readonly-textfield"
                            error={!!formErrors.pnGradeId}
                          >
                            <InputLabel id="pnGradeId-label">Grade</InputLabel>
                            <Select
                              labelId="pnGradeId-label"
                              id="pnGradeId"
                              name="pnGradeId"
                              value={formData.pnGradeId}
                              onChange={
                                !isViewMode
                                  ? (e) =>
                                      setFormData({
                                        ...formData,
                                        pnGradeId: e.target.value,
                                      })
                                  : undefined
                              }
                              onBlur={!isViewMode ? handleBlur : undefined}
                              label="Grade"
                              disabled={isViewMode}
                              sx={{ height: "50px" }}
                            >
                              <MenuItem value="">Select</MenuItem>
                              {grade.map((g) => (
                                <MenuItem
                                  key={g.pn_GradeID}
                                  value={g.pn_GradeID}
                                >
                                  {g.v_GradeName}
                                </MenuItem>
                              ))}
                            </Select>
                            <FormHelperText>
                              {formErrors.pnGradeId}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FormControl
                            fullWidth
                            className="custom-readonly-textfield"
                            error={!!formErrors.pn_ShiftID}
                          >
                            <InputLabel id="pn_ShiftID-label">Shift</InputLabel>
                            <Select
                              labelId="pn_ShiftID-label"
                              id="pn_ShiftID"
                              name="pn_ShiftID"
                              value={formData.pn_ShiftID}
                              onChange={
                                !isViewMode
                                  ? (e) =>
                                      setFormData({
                                        ...formData,
                                        pn_ShiftID: e.target.value,
                                      })
                                  : undefined
                              }
                              onBlur={!isViewMode ? handleBlur : undefined}
                              label="Shift"
                              disabled={isViewMode}
                              sx={{ height: "50px" }}
                            >
                              <MenuItem value="">Select</MenuItem>
                              {shift.map((s) => (
                                <MenuItem
                                  key={s.pn_ShiftID}
                                  value={s.pn_ShiftID}
                                >
                                  {s.shift_code}{" "}
                                  {/* You can also use s.shift_code if needed */}
                                </MenuItem>
                              ))}
                            </Select>
                            <FormHelperText>
                              {formErrors.pn_ShiftID}
                            </FormHelperText>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <FormControl
                            fullWidth
                            className="custom-readonly-textfield"
                            error={!!formErrors.pnCategoryId}
                          >
                            <InputLabel id="pnCategoryId-label">
                              Category
                            </InputLabel>
                            <Select
                              labelId="pnCategoryId-label"
                              id="pnCategoryId"
                              name="pnCategoryId"
                              value={formData.pnCategoryId}
                              onChange={
                                !isViewMode
                                  ? (e) =>
                                      setFormData({
                                        ...formData,
                                        pnCategoryId: e.target.value,
                                      })
                                  : undefined
                              }
                              onBlur={!isViewMode ? handleBlur : undefined}
                              label="Category"
                              disabled={isViewMode} // disables dropdown in view mode
                              sx={{ height: "50px" }}
                            >
                              <MenuItem value="">Select</MenuItem>
                              {category.map((c) => (
                                <MenuItem
                                  key={c.pn_CategoryID}
                                  value={c.pn_CategoryID}
                                >
                                  {c.v_CategoryName}
                                </MenuItem>
                              ))}
                            </Select>
                            <FormHelperText>
                              {formErrors.pnCategoryId}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FormControl
                            fullWidth
                            className="custom-readonly-textfield"
                            error={!!formErrors.pnJobStatusId}
                          >
                            <InputLabel id="pnJobStatusId-label">
                              Job Status
                            </InputLabel>
                            <Select
                              labelId="pnJobStatusId-label"
                              id="pnJobStatusId"
                              name="pnJobStatusId"
                              value={formData.pnJobStatusId}
                              onChange={
                                !isViewMode
                                  ? (e) =>
                                      setFormData({
                                        ...formData,
                                        pnJobStatusId: e.target.value,
                                      })
                                  : undefined
                              }
                              onBlur={!isViewMode ? handleBlur : undefined}
                              label="Job Status"
                              disabled={isViewMode}
                              sx={{ height: "50px" }}
                            >
                              <MenuItem value="">Select</MenuItem>
                              {jobstatus.map((j) => (
                                <MenuItem
                                  key={j.pn_JobStatusID}
                                  value={j.pn_JobStatusID}
                                >
                                  {j.v_JobStatusName}
                                </MenuItem>
                              ))}
                            </Select>
                            <FormHelperText>
                              {formErrors.pnJobStatusId}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FormControl
                            fullWidth
                            className="custom-readonly-textfield"
                            error={!!formErrors.pnLevelId}
                          >
                            <InputLabel id="pnLevelId-label">Level</InputLabel>
                            <Select
                              labelId="pnLevelId-label"
                              id="pnLevelId"
                              name="pnLevelId"
                              value={formData.pnLevelId}
                              onChange={
                                !isViewMode
                                  ? (e) =>
                                      setFormData({
                                        ...formData,
                                        pnLevelId: e.target.value,
                                      })
                                  : undefined
                              }
                              onBlur={!isViewMode ? handleBlur : undefined}
                              label="Level"
                              disabled={isViewMode}
                              sx={{ height: "50px" }}
                            >
                              <MenuItem value="">Select</MenuItem>
                              {level.map((l) => (
                                <MenuItem
                                  key={l.pn_LevelID}
                                  value={l.pn_LevelID}
                                >
                                  {l.v_LevelName}
                                </MenuItem>
                              ))}
                            </Select>
                            <FormHelperText>
                              {formErrors.pnLevelId}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </div>
                  )}

                  {activeStep === 2 && (
                    <div>
                      <Typography
                        variant="h5" // Change to h6 for a smaller font size
                        gutterBottom
                        sx={{
                          textAlign: "left",
                          fontWeight: "bold",
                          color: "BLACK",
                          lineHeight: "40px", // Adjust line height to match the new height
                          zIndex: 1201,
                        }}
                      >
                        BANK DETAILS
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="aadharCard"
                            label="Aadhar Card Number"
                            value={formData.aadharCard}
                            onChange={!isViewMode ? handleChange : undefined}
                            onBlur={!isViewMode ? handleBlur : undefined}
                            fullWidth
                            margin="normal"
                            error={!!formErrors.aadharCard}
                            helperText={formErrors.aadharCard}
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="micrCode"
                            label="Micr Code "
                            value={formData.micrCode}
                            onChange={!isViewMode ? handleChange : undefined}
                            onBlur={!isViewMode ? handleBlur : undefined}
                            fullWidth
                            margin="normal"
                            error={!!formErrors.micrCode}
                            helperText={formErrors.micrCode}
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="branchName"
                            label="branch Name"
                            value={formData.branchName}
                            onChange={!isViewMode ? handleChange : undefined}
                            onBlur={!isViewMode ? handleBlur : undefined}
                            fullWidth
                            margin="normal"
                            error={!!formErrors.branchName}
                            helperText={formErrors.branchName}
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="bankName"
                            label="Bank Name"
                            value={formData.bankName}
                            onChange={!isViewMode ? handleChange : undefined}
                            onBlur={!isViewMode ? handleBlur : undefined}
                            fullWidth
                            margin="normal"
                            error={!!formErrors.bankName}
                            helperText={formErrors.bankName}
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="bankCode"
                            label="Bank Code"
                            value={formData.bankCode}
                            onChange={!isViewMode ? handleChange : undefined}
                            onBlur={!isViewMode ? handleBlur : undefined}
                            fullWidth
                            margin="normal"
                            error={!!formErrors.bankCode}
                            helperText={formErrors.bankCode}
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="accountNo"
                            label="Account Number"
                            value={formData.accountNo}
                            onChange={!isViewMode ? handleChange : undefined}
                            onBlur={!isViewMode ? handleBlur : undefined}
                            fullWidth
                            margin="normal"
                            error={!!formErrors.accountNo}
                            helperText={formErrors.accountNo}
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                        <Grid item xs={6} sm={6}>
                          <TextField
                            name="ifscCode"
                            label="Ifsc Code "
                            value={formData.ifscCode}
                            onChange={!isViewMode ? handleChange : undefined}
                            onBlur={!isViewMode ? handleBlur : undefined}
                            fullWidth
                            margin="normal"
                            error={!!formErrors.ifscCode}
                            helperText={formErrors.ifscCode}
                            className="custom-readonly-textfield"
                          />
                        </Grid>

                        <Grid item xs={6} sm={6}>
                          <TextField
                            name="accountType"
                            label="Account Type"
                            value={formData.accountType}
                            onChange={!isViewMode ? handleChange : undefined}
                            onBlur={!isViewMode ? handleBlur : undefined}
                            fullWidth
                            margin="normal"
                            error={!!formErrors.accountType}
                            helperText={formErrors.accountType}
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="panNo"
                            label="PAN Number"
                            value={formData.panNo}
                            onChange={!isViewMode ? handleChange : undefined}
                            onBlur={!isViewMode ? handleBlur : undefined}
                            fullWidth
                            margin="normal"
                            error={!!formErrors.panNo}
                            helperText={formErrors.panNo}
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                      </Grid>
                      <Typography
                        variant="h5" // Change to h6 for a smaller font size
                        gutterBottom
                        sx={{
                          textAlign: "left",
                          fontWeight: "bold",
                          color: "BLACK",
                          lineHeight: "40px", // Adjust line height to match the new height
                          zIndex: 1201,
                        }}
                      >
                        SALARY DETAILS
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="ctc"
                            label="CTC"
                            type="number"
                            value={formData.ctc}
                            onChange={!isViewMode ? handleChange : undefined}
                            InputProps={{ readOnly: isViewMode }}
                            fullWidth
                            margin="normal"
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="paymentMode"
                            label="Payment Mode"
                            value={formData.paymentMode}
                            onChange={!isViewMode ? handleChange : undefined}
                            InputProps={{ readOnly: isViewMode }}
                            fullWidth
                            margin="normal"
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="basicSalary"
                            label="Basic Salary"
                            type="number"
                            value={formData.basicSalary}
                            onChange={!isViewMode ? handleChange : undefined}
                            InputProps={{ readOnly: isViewMode }}
                            fullWidth
                            margin="normal"
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="readerid"
                            label="Reader ID"
                            value={formData.readerid}
                            onChange={!isViewMode ? handleChange : undefined}
                            InputProps={{ readOnly: isViewMode }}
                            fullWidth
                            margin="normal"
                            className="custom-readonly-textfield"
                          />
                        </Grid>

                        <Grid item xs={6} sm={6}>
                          <TextField
                            name="salaryType"
                            label="Salary Type"
                            value={formData.salaryType}
                            onChange={!isViewMode ? handleChange : undefined}
                            InputProps={{ readOnly: isViewMode }}
                            fullWidth
                            margin="normal"
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                        <Grid item xs={6} sm={6}>
                          <TextField
                            name="role"
                            label="Role"
                            value={formData.role}
                            onChange={!isViewMode ? handleChange : undefined}
                            InputProps={{ readOnly: isViewMode }}
                            fullWidth
                            margin="normal"
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                        <Grid item xs={6} sm={6}>
                          <TextField
                            name="otherInfo"
                            label="other Info "
                            value={formData.otherInfo}
                            onChange={!isViewMode ? handleChange : undefined}
                            InputProps={{ readOnly: isViewMode }}
                            fullWidth
                            margin="normal"
                            className="custom-readonly-textfield"
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <FormControl
                            fullWidth
                            margin="normal"
                            error={!!formErrors.otEligible}
                            className="custom-readonly-textfield"
                          >
                            <InputLabel id="otEligible-label">
                              OT Eligible
                            </InputLabel>
                            <Select
                              labelId="otEligible-label"
                              name="otEligible"
                              value={formData.otEligible}
                              onChange={!isViewMode ? handleChange : undefined}
                              InputProps={{ readOnly: isViewMode }}
                              label="OT Eligible"
                            >
                              <MenuItem value="">Select</MenuItem>
                              <MenuItem value="Y">Yes</MenuItem>
                              <MenuItem value="N">No</MenuItem>
                            </Select>
                            {formErrors.otEligible && (
                              <FormHelperText>
                                {formErrors.otEligible}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl
                            fullWidth
                            margin="normal"
                            error={!!formErrors.tdsApplicable}
                            className="custom-readonly-textfield"
                          >
                            <InputLabel>Tds Applicable</InputLabel>
                            <Select
                              labelId="Tds Applicable"
                              name="tdsApplicable"
                              value={formData.tdsApplicable}
                              onChange={!isViewMode ? handleChange : undefined}
                              InputProps={{ readOnly: isViewMode }}
                              label="Tds Applicable"
                            >
                              <MenuItem value="">Select</MenuItem>
                              <MenuItem value="Y">Yes</MenuItem>
                              <MenuItem value="N">No</MenuItem>
                            </Select>
                            {formErrors.tdsApplicable && (
                              <FormHelperText>
                                {formErrors.tdsApplicable}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="otCalc"
                            label="Ot Cal"
                            type="number"
                            value={formData.otCalc}
                            onChange={!isViewMode ? handleChange : undefined}
                            InputProps={{ readOnly: isViewMode }}
                            fullWidth
                            margin="normal"
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                      </Grid>
                    </div>
                  )}

                  {activeStep === 3 && (
                    <div>
                      <Typography
                        variant="h5" // Change to h6 for a smaller font size
                        gutterBottom
                        sx={{
                          textAlign: "left",
                          fontWeight: "bold",
                          color: "black",
                          lineHeight: "40px", // Adjust line height to match the new height
                          zIndex: 1201,
                        }}
                      >
                        COMPILANCE DETAILS
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="passportNumber"
                            label="Passport Number"
                            value={formData.passportNumber}
                            onChange={!isViewMode ? handleChange : undefined}
                            InputProps={{ readOnly: isViewMode }}
                            fullWidth
                            margin="normal"
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="visaDetails"
                            label="Visa Details"
                            value={formData.visaDetails}
                            onChange={!isViewMode ? handleChange : undefined}
                            InputProps={{ readOnly: isViewMode }}
                            fullWidth
                            margin="normal"
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="uan"
                            label="UAN"
                            value={formData.uan}
                            onChange={!isViewMode ? handleChange : undefined}
                            InputProps={{ readOnly: isViewMode }}
                            fullWidth
                            margin="normal"
                            className="custom-readonly-textfield"
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="pfno"
                            label="Pf No"
                            type="number"
                            value={formData.pfno}
                            onChange={!isViewMode ? handleChange : undefined}
                            InputProps={{ readOnly: isViewMode }}
                            fullWidth
                            margin="normal"
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="esino"
                            label="Esi No"
                            type="number"
                            value={formData.esino}
                            onChange={!isViewMode ? handleChange : undefined}
                            InputProps={{ readOnly: isViewMode }}
                            fullWidth
                            margin="normal"
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                      </Grid>
                      <Box
                        sx={{
                          mt: 2,
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={handleSkip}
                        >
                          Skip
                        </Button>
                      </Box>
                    </div>
                  )}
                  {activeStep === 4 && (
                    <div>
                      <Typography
                        variant="h5" // Change to h6 for a smaller font size
                        gutterBottom
                        sx={{
                          textAlign: "left",
                          fontWeight: "bold",
                          color: "black",
                          lineHeight: "40px", // Adjust line height to match the new height
                          zIndex: 1201,
                        }}
                      >
                        CONTACT INFORMATION
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="email"
                            label="Email"
                            value={formData.email}
                            onChange={!isViewMode ? handleChange : undefined}
                            onBlur={!isViewMode ? handleBlur : undefined}
                            fullWidth
                            margin="normal"
                            error={!!formErrors.email}
                            helperText={formErrors.email}
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="alternateEmail"
                            label="Alternate Email"
                            value={formData.alternateEmail}
                            onChange={!isViewMode ? handleChange : undefined}
                            onBlur={!isViewMode ? handleBlur : undefined}
                            fullWidth
                            margin="normal"
                            error={!!formErrors.alternateEmail}
                            helperText={formErrors.alternateEmail}
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="phoneNo"
                            label="Phone Number"
                            value={formData.phoneNo}
                            onChange={!isViewMode ? handleChange : undefined}
                            onBlur={!isViewMode ? handleBlur : undefined}
                            fullWidth
                            margin="normal"
                            error={!!formErrors.phoneNo}
                            helperText={formErrors.phoneNo}
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="alternatePhoneNo"
                            label="Alternate Phone Number"
                            value={formData.alternatePhoneNo}
                            onChange={!isViewMode ? handleChange : undefined}
                            onBlur={!isViewMode ? handleBlur : undefined}
                            fullWidth
                            margin="normal"
                            error={!!formErrors.alternatePhoneNo}
                            helperText={formErrors.alternatePhoneNo}
                            className="custom-readonly-textfield"
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="permanentAddress"
                            label="Permanent Address"
                            value={formData.permanentAddress}
                            onChange={!isViewMode ? handleChange : undefined}
                            onBlur={!isViewMode ? handleBlur : undefined}
                            fullWidth
                            margin="normal"
                            minRows={3}
                            InputProps={{
                              sx: {
                                alignItems: "flex-start", // text starts at the top
                                "& .MuiInputBase-input": {
                                  minHeight: "90px", // 👈 exact pixel height override
                                },
                              },
                            }}
                            error={!!formErrors.permanentAddress}
                            helperText={formErrors.permanentAddress}
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="currentAddress"
                            label="Current Address"
                            value={formData.currentAddress}
                            onChange={!isViewMode ? handleChange : undefined}
                            onBlur={!isViewMode ? handleBlur : undefined}
                            fullWidth
                            margin="normal"
                            InputProps={{
                              sx: {
                                alignItems: "flex-start", // text starts at the top
                                "& .MuiInputBase-input": {
                                  minHeight: "90px", // 👈 exact pixel height override
                                },
                              },
                            }}
                            error={!!formErrors.currentAddress}
                            helperText={formErrors.currentAddress}
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                      </Grid>{" "}
                    </div>
                  )}
                  {activeStep === 5 && (
                    <div>
                      <Typography
                        variant="h5" // Change to h6 for a smaller font size
                        gutterBottom
                        sx={{
                          textAlign: "left",
                          fontWeight: "bold",
                          color: "black",
                          lineHeight: "40px", // Adjust line height to match the new height
                          zIndex: 1201,
                        }}
                      >
                        EDUCATION DETAILS
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="highestQualification"
                            label="Highest Qualification"
                            value={formData.highestQualification}
                            onChange={!isViewMode ? handleChange : undefined}
                            onBlur={!isViewMode ? handleBlur : undefined}
                            fullWidth
                            margin="normal"
                            error={!!formErrors.highestQualification}
                            helperText={formErrors.highestQualification}
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="universityName"
                            label="University Name"
                            value={formData.universityName}
                            onChange={!isViewMode ? handleChange : undefined}
                            onBlur={!isViewMode ? handleBlur : undefined}
                            fullWidth
                            margin="normal"
                            error={!!formErrors.universityName}
                            helperText={formErrors.universityName}
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="yearOfPassing"
                            label="Year of Passing"
                            type="number"
                            value={formData.yearOfPassing}
                            onChange={!isViewMode ? handleChange : undefined}
                            onBlur={!isViewMode ? handleBlur : undefined}
                            fullWidth
                            margin="normal"
                            error={!!formErrors.yearOfPassing}
                            helperText={formErrors.yearOfPassing}
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="certifications"
                            label="Certifications"
                            value={formData.certifications}
                            onChange={!isViewMode ? handleChange : undefined}
                            onBlur={!isViewMode ? handleBlur : undefined}
                            fullWidth
                            margin="normal"
                            error={!!formErrors.certifications}
                            helperText={formErrors.certifications}
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="skills"
                            label="Skills"
                            value={formData.skills}
                            onChange={!isViewMode ? handleChange : undefined}
                            onBlur={!isViewMode ? handleBlur : undefined}
                            fullWidth
                            margin="normal"
                            error={!!formErrors.skills}
                            helperText={formErrors.skills}
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                      </Grid>
                    </div>
                  )}

                  {activeStep === 6 && (
                    <div>
                      <Typography
                        variant="h5" // Change to h6 for a smaller font size
                        gutterBottom
                        sx={{
                          textAlign: "left",
                          fontWeight: "bold",
                          color: "black",
                          lineHeight: "40px", // Adjust line height to match the new height
                          zIndex: 1201,
                        }}
                      >
                        EXPERIENCE DETAILS
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="overallExperience"
                            label="Overall Experience (Years)"
                            type="number"
                            value={formData.overallExperience}
                            onChange={!isViewMode ? handleChange : undefined}
                            onBlur={!isViewMode ? handleBlur : undefined}
                            fullWidth
                            margin="normal"
                            error={!!formErrors.overallExperience}
                            helperText={formErrors.overallExperience}
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="previousCompany"
                            label="Previous Company"
                            value={formData.previousCompany}
                            onChange={!isViewMode ? handleChange : undefined}
                            InputProps={{ readOnly: isViewMode }}
                            fullWidth
                            margin="normal"
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="previousDesignation"
                            label="Previous Designation"
                            value={formData.previousDesignation}
                            onChange={!isViewMode ? handleChange : undefined}
                            InputProps={{ readOnly: isViewMode }}
                            fullWidth
                            margin="normal"
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="previousEmploymentDuration"
                            label="Previous Employment Duration"
                            value={formData.previousEmploymentDuration}
                            onChange={!isViewMode ? handleChange : undefined}
                            InputProps={{ readOnly: isViewMode }}
                            fullWidth
                            margin="normal"
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="reasonForLeaving"
                            label="Reason for Leaving"
                            value={formData.reasonForLeaving}
                            onChange={!isViewMode ? handleChange : undefined}
                            InputProps={{ readOnly: isViewMode }}
                            fullWidth
                            margin="normal"
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="performanceRating"
                            label="Performance Rating"
                            type="number"
                            value={formData.performanceRating}
                            onChange={!isViewMode ? handleChange : undefined}
                            InputProps={{ readOnly: isViewMode }}
                            fullWidth
                            margin="normal"
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="trainingRecords"
                            label="Training Records"
                            value={formData.trainingRecords}
                            onChange={!isViewMode ? handleChange : undefined}
                            InputProps={{ readOnly: isViewMode }}
                            fullWidth
                            margin="normal"
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="awards"
                            label="Awards"
                            value={formData.awards}
                            onChange={!isViewMode ? handleChange : undefined}
                            InputProps={{ readOnly: isViewMode }}
                            fullWidth
                            margin="normal"
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                      </Grid>
                    </div>
                  )}

                  {activeStep === 7 && (
                    <div>
                      <Typography
                        variant="h5" // Change to h6 for a smaller font size
                        gutterBottom
                        sx={{
                          textAlign: "left",
                          fontWeight: "bold",
                          color: "black",
                          lineHeight: "40px", // Adjust line height to match the new height
                          zIndex: 1201,
                        }}
                      >
                        REPORTING DETAILS
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="reportingId"
                            label="Reporting Id "
                            value={formData.reportingId}
                            onChange={!isViewMode ? handleChange : undefined}
                            onBlur={!isViewMode ? handleBlur : undefined}
                            fullWidth
                            margin="normal"
                            error={!!formErrors.reportingId}
                            helperText={formErrors.reportingId}
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="reportingPerson"
                            label="Reporting Person "
                            value={formData.reportingPerson}
                            onChange={!isViewMode ? handleChange : undefined}
                            onBlur={!isViewMode ? handleBlur : undefined}
                            fullWidth
                            margin="normal"
                            error={!!formErrors.reportingPerson}
                            helperText={formErrors.reportingPerson}
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="reportingEmail"
                            label="Reporting Email "
                            value={formData.reportingEmail}
                            onChange={!isViewMode ? handleChange : undefined}
                            onBlur={!isViewMode ? handleBlur : undefined}
                            fullWidth
                            margin="normal"
                            error={!!formErrors.reportingEmail}
                            helperText={formErrors.reportingEmail}
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth>
                            <TextField
                              name="v_Reason"
                              label="Reason"
                              value={formData.v_Reason || ""}
                              onChange={(e) => {
                                setVReason(e.target.value);
                                setFormErrors((prev) => ({
                                  ...prev,
                                  v_Reason: "",
                                }));
                              }}
                              onBlur={(e) => {
                                const error =
                                  e.target.value.trim() === ""
                                    ? "Reason is required"
                                    : "";
                                setFormErrors((prev) => ({
                                  ...prev,
                                  v_Reason: error,
                                }));
                              }}
                              required
                              error={!!formErrors.v_Reason}
                              helperText={formErrors.v_Reason}
                              className="custom-readonly-textfield"
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth>
                            <TextField
                              name="r_Department"
                              label="Reporting Department"
                              value={formData.r_Department || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  r_Department: e.target.value,
                                })
                              }
                              onBlur={(e) => {
                                const value = e.target.value;
                                const error =
                                  value.trim() === ""
                                    ? "Reporting Department is required"
                                    : "";
                                setFormErrors((prev) => ({
                                  ...prev,
                                  r_Department: error,
                                }));
                              }}
                              error={!!formErrors.r_Department}
                              helperText={formErrors.r_Department}
                              className="custom-readonly-textfield"
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </div>
                  )}
                  {activeStep === 8 && (
                    <div>
                      <Typography
                        variant="h5" // Change to h6 for a smaller font size
                        gutterBottom
                        sx={{
                          textAlign: "left",
                          fontWeight: "bold",
                          color: "black",
                          lineHeight: "40px", // Adjust line height to match the new height
                          zIndex: 1201,
                        }}
                      >
                        ADDITIONAL INFO
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="fatherName"
                            label="Father's Name"
                            value={formData.fatherName}
                            onChange={!isViewMode ? handleChange : undefined}
                            InputProps={{ readOnly: isViewMode }}
                            fullWidth
                            margin="normal"
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="joiningDate"
                            label="Joining Date"
                            type="date"
                            value={formData.joiningDate.split("T")[0]} // Format to YYYY-MM-DD
                            onChange={!isViewMode ? handleChange : undefined}
                            onBlur={!isViewMode ? handleBlur : undefined}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            error={!!formErrors.joiningDate}
                            helperText={formErrors.joiningDate}
                            className="custom-readonly-textfield"
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="vehicleDetails"
                            label="Vehicle Details"
                            value={formData.vehicleDetails}
                            onChange={!isViewMode ? handleChange : undefined}
                            InputProps={{ readOnly: isViewMode }}
                            fullWidth
                            margin="normal"
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="healthInsuranceDetails"
                            label="Health Insurance Details"
                            value={formData.healthInsuranceDetails}
                            onChange={!isViewMode ? handleChange : undefined}
                            InputProps={{ readOnly: isViewMode }}
                            fullWidth
                            margin="normal"
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="nomineeDetails"
                            label="Nominee Details"
                            value={formData.nomineeDetails}
                            onChange={!isViewMode ? handleChange : undefined}
                            onBlur={!isViewMode ? handleBlur : undefined}
                            fullWidth
                            margin="normal"
                            error={!!formErrors.nomineeDetails}
                            helperText={formErrors.nomineeDetails}
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="NomineePhoneno"
                            label="Nominee Phone No"
                            value={formData.NomineePhoneno}
                            onChange={!isViewMode ? handleChange : undefined}
                            onBlur={!isViewMode ? handleBlur : undefined}
                            fullWidth
                            margin="normal"
                            error={!!formErrors.NomineePhoneno}
                            helperText={formErrors.NomineePhoneno}
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="NomineeRelationship"
                            label="Nominee Relationship"
                            value={formData.NomineeRelationship}
                            onChange={!isViewMode ? handleChange : undefined}
                            onBlur={!isViewMode ? handleBlur : undefined}
                            fullWidth
                            margin="normal"
                            error={!!formErrors.NomineeRelationship}
                            helperText={formErrors.NomineeRelationship}
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl
                            fullWidth
                            margin="normal"
                            className="custom-readonly-textfield"
                          >
                            <InputLabel id="asset-type-label">
                              Asset Type
                            </InputLabel>
                            <Select
                              labelId="asset-type-label"
                              id="asset-type"
                              name="assetType"
                              value={formData.assetType}
                              onChange={!isViewMode ? handleChange : undefined}
                              onBlur={!isViewMode ? handleBlur : undefined}
                              label="Asset Type"
                              disabled={isViewMode}
                              error={!!formErrors.assetType}
                            >
                              <MenuItem value="">Select Asset Type</MenuItem>
                              {uniqueAssetTypes.map((type, index) => (
                                <MenuItem key={index} value={type}>
                                  {type}
                                </MenuItem>
                              ))}
                            </Select>
                            {formErrors.assetType && (
                              <FormHelperText error>
                                {formErrors.assetType}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <FormControl
                            fullWidth
                            margin="normal"
                            className="custom-readonly-textfield" // Move it here if you want to style the FormControl
                          >
                            <InputLabel>Asset Name</InputLabel>
                            <Select
                              name="assetName"
                              value={formData.assetName}
                              onChange={!isViewMode ? handleChange : undefined}
                              onBlur={!isViewMode ? handleBlur : undefined}
                              label="Asset Name"
                              error={!!formErrors.assetName}
                              disabled={isViewMode}

                              // Remove className from here unless you specifically want to style the Select component
                            >
                              <MenuItem value="">Select Asset</MenuItem>
                              {assets.map((asset) => (
                                <MenuItem
                                  key={asset.Asset_SerialNumber}
                                  value={asset.Asset_name}
                                >
                                  {asset.Asset_name}
                                </MenuItem>
                              ))}
                            </Select>
                            {formErrors.assetName && (
                              <FormHelperText error>
                                {formErrors.assetName}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextField
                            select
                            name="assetSerialNumber"
                            label="Asset Serial Number"
                            value={formData.assetSerialNumber}
                            onChange={!isViewMode ? handleChange : undefined}
                            onBlur={!isViewMode ? handleBlur : undefined}
                            fullWidth
                            margin="normal"
                            error={!!formErrors.assetSerialNumber}
                            helperText={formErrors.assetSerialNumber}
                            className="custom-readonly-textfield" // ✅ Correct placement (if needed)
                              disabled={isViewMode}

                          >
                            <MenuItem value="">Select Serial Number</MenuItem>
                            {assets.map((asset) => (
                              <MenuItem
                                key={asset.Asset_SerialNumber}
                                value={asset.Asset_SerialNumber}
                              >
                                {asset.Asset_SerialNumber}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                      </Grid>
                    </div>
                  )}
                  {activeStep >= steps.length && (
                    <div>
                      <h3
                        style={{
                          fontWeight: "bold",
                          marginBottom: "8px",
                          color: "#333",
                          fontSize: "1.25rem",
                        }}
                      >
                        All Steps Completed!
                      </h3>
                      <p style={{ color: "#555" }}>
                        Thank you for completing the form.
                      </p>
                    </div>
                  )}
                </Box>

                {/* Navigation buttons */}
                <div
                  style={{
                    marginTop: "20px",
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                  }}
                >
                  <button
                    onClick={handleBack}
                    disabled={activeStep === 0}
                    style={{
                      padding: "10px 20px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      backgroundColor: "#f0f0f0",
                      cursor: activeStep === 0 ? "not-allowed" : "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Back
                  </button>
                  {activeStep < steps.length - 1 ? (
                    <button
                      onClick={handleNext}
                      style={{
                        padding: "10px 20px",
                        borderRadius: "5px",
                        border: "none",
                        backgroundColor: "#e74c3c",
                        color: "white",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isViewMode} // Assuming isViewMode is a boolean state variable
                      style={{
                        padding: "10px 20px",
                        borderRadius: "5px",
                        border: "none",
                        backgroundColor: isViewMode ? "#6c757d" : "#28a745", // Gray when disabled, green when enabled
                        color: "white",
                        cursor: isViewMode ? "not-allowed" : "pointer",
                        fontWeight: "bold",
                        opacity: isViewMode ? 0.7 : 1,
                      }}
                    >
                      Save
                    </button>
                  )}
                </div>
              </form>
            </div>
          </Box>
        </Box>
      </div>
    </Grid>
  );
}
