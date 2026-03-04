import React from "react";
import "../../../App.css";
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
  AutoComplete,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Select, MenuItem } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import FormHelperText from "@mui/material/FormHelperText";
import { useState, useEffect } from "react";
import defaultImage from "../../../images/Image Icons/image.png";
import { Stepper, Step, StepLabel } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
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
export default function EditEmployee() {
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
  const dbname = sessionStorage.getItem("databaseName");

  const location = useLocation();
  const [isViewMode, setIsViewMode] = useState(true); // default true
  const { id } = useParams();
  console.log(id);

  useEffect(() => {
    if (location.state?.isViewMode !== undefined) {
      setIsViewMode(location.state.isViewMode);
    }
  }, [location.state]);
  const [uniqueAssetTypes, setUniqueAssetTypes] = useState([]);
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
  const safeDate = (d) => (d ? d.split("T")[0] : "");

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
    AssetType: "",
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
        // if (!value.trim()) return "Full Name is required";
        if (!/^[a-zA-Z\s]+$/.test(value))
          return "Only letters and spaces allowed";
        return "";

      case "dateofBirth":
        if (!value) return "Date of Birth is required";
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

      // case "email":
      //   if (!value.trim()) return "Email is required";
      //   if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value))
      //     return "Invalid email format";
      //   return "";

      // case "phoneNo":
      //   if (!value.trim()) return "Phone number is required";
      //   if (!/^\d{10}$/.test(value)) return "Phone number must be 10 digits";
      //   return "";

      case "alternatePhoneNo":
        if (value && !/^\d{10}$/.test(value))
          return "Alternate phone number must be 10 digits";
        return "";

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
      // case "status":
      //   if (!value || value.trim() === "") return "Status is required";
      //   if (!["A", "I"].includes(value.toUpperCase()))
      //     return 'Status must be "A" (Active) or "I" (Inactive)';
      //   return "";

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

      default:
        return "";
    }
  };

  const finalBranchId  = formData.pnBranchId  ?? formData.pn_BranchID;
  const handleUpdate = async (e) => {
    e.preventDefault();

    // Validate form data
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.warning("Please fix validation errors before updating.", {
        position: "top-center",
        autoClose: 1000,
      });
      return;
    }

    try {
      // 🔹 Sanitize object values to prevent [object Object] in payload
      Object.keys(formData).forEach((key) => {
        const val = formData[key];
        if (val && typeof val === "object") {
          // If dropdown data contains {label, value}, keep only the value
          formData[key] = val?.value || "";
        }
      });
      // Convert image to base64 if it exists
      let base64Image = null;
      if (profileImage) {
        base64Image = await convertImageToBase64(profileImage);
      } else if (formData.imageData) {
        base64Image = formData.imageData;
      }

      // Helper function to properly escape SQL strings and handle null/undefined
      const sqlValue = (value) => {
        if (value === null || value === undefined) {
          return "NULL";
        }
        if (typeof value === "object") {
          return "NULL"; // or JSON.stringify(value) if you want to store as JSON
        }
        if (typeof value === "string") {
          // Escape single quotes by doubling them
          return `'${value.replace(/'/g, "''")}'`;
        }
        return value;
      };

      // Prepare SQL update queries with proper escaping
      const finalCompanyId = formData.pnCompanyId ?? formData.pn_CompanyID;
      
      console.log("branch id", formData.pnBranchId);
      const updateEmployeeQuery = `
      UPDATE [${dbname}].[dbo].[paym_Employee]
      SET 
        [pn_CompanyID] = ${sqlValue(finalCompanyId)},
        [pn_BranchID] = ${sqlValue(pnBranchId)},
        [EmployeeCode] = ${sqlValue(formData.employeeCode)},
        [password] = ${sqlValue(formData.password)},
        [Employee_First_Name] = ${sqlValue(formData.employeeFirstName)},
        [Employee_Middle_Name] = ${sqlValue(formData.employeeMiddleName) || ""},
        [Employee_Last_Name] = ${sqlValue(formData.employeeLastName)},
        [DateofBirth] = ${sqlValue(formData.dateofBirth)},
        [Gender] = ${sqlValue(formData.gender)},
        [status] = ${sqlValue(formData.status)},
        [Employee_Full_Name] = ${sqlValue(formData.employeeFullName)},
        [Readerid] = ${sqlValue(formData.readerid)},
        [OT_Eligible] = ${sqlValue(formData.otEligible)},
        [Pfno] = ${sqlValue(formData.pfno)},
        [Esino] = ${sqlValue(formData.esino)},
        [OT_calc] = ${sqlValue(formData.otCalc)},
        [CTC] = ${sqlValue(formData.ctc)},
        [basic_salary] = ${sqlValue(formData.basicSalary)},
        [Bank_code] = ${sqlValue(formData.bankCode)},
        [Bank_Name] = ${sqlValue(formData.bankName)},
        [Branch_Name] = ${sqlValue(formData.branchName)},
        [Account_Type] = ${sqlValue(formData.accountType)},
        [MICR_code] = ${sqlValue(formData.micrCode)},
        [IFSC_Code] = ${sqlValue(formData.ifscCode)},
        [Other_Info] = ${sqlValue(formData.otherInfo)},
        [Reporting_person] = ${sqlValue(formData.reportingPerson)},
        [ReportingID] = ${sqlValue(formData.reportingId)},
        [Reporting_email] = ${sqlValue(formData.reportingEmail)},
        [Pan_no] = ${sqlValue(formData.panNo)},
        [salary_type] = ${sqlValue(formData.salaryType)},
        [TDS_Applicable] = ${sqlValue(formData.tdsApplicable)},
        [Flag] = ${sqlValue(formData.flag)},
        [role] = ${sqlValue(formData.role)},
        [accountNo] = ${sqlValue(formData.accountNo)},
        [Blood_Group] = ${sqlValue(formData.bloodGroup)},
        [Phone_No] = ${sqlValue(formData.phoneNo)},
        [Alternate_Phone_No] = ${sqlValue(formData.alternatePhoneNo)},
        [permanent_address] = ${sqlValue(formData.permanentAddress)},
        [Aadhar_Card] = ${sqlValue(formData.aadharCard)},
        [Current_Address] = ${sqlValue(formData.currentAddress)},
        [Father_Name] = ${sqlValue(formData.fatherName)},
        [Email] = ${sqlValue(formData.email)},
        [Alternate_Email] = ${sqlValue(formData.alternateEmail)},
        [Grade] = ${sqlValue(formData.grade)},
        [Overall_Experience] = ${sqlValue(formData.overallExperience)},
        [HighestQualification] = ${sqlValue(formData.highestQualification)},
        [UniversityName] = ${sqlValue(formData.universityName)},
        [YearOfPassing] = ${sqlValue(formData.yearOfPassing)},
        [Certifications] = ${sqlValue(formData.certifications)},
        [Skills] = ${sqlValue(formData.skills)},
        [UAN] = ${sqlValue(formData.uan)},
        [PaymentMode] = ${sqlValue(formData.paymentMode)},
        [PassportNumber] = ${sqlValue(formData.passportNumber)},
        [VisaDetails] = ${sqlValue(formData.visaDetails)},
        [JoiningDate] = ${sqlValue(formData.joiningDate)},
        [ExitReason] = ${sqlValue(formData.exitReason)},
        [ExitDate] = ${sqlValue(formData.ExitDate)},
        [PreviousCompany] = ${sqlValue(formData.previousCompany)},
        [PreviousDesignation] = ${sqlValue(formData.previousDesignation)},
        [PreviousEmploymentDuration] = ${sqlValue(
          formData.previousEmploymentDuration
        )},
        [ReasonForLeaving] = ${sqlValue(formData.reasonForLeaving)},
        [PerformanceRating] = ${sqlValue(formData.performanceRating)},
        [TrainingRecords] = ${sqlValue(formData.trainingRecords)},
        [DisciplinaryActions] = ${sqlValue(formData.disciplinaryActions)},
        [Awards] = ${sqlValue(formData.awards)},
        [VehicleDetails] = ${sqlValue(formData.vehicleDetails)},
        [HealthInsuranceDetails] = ${sqlValue(formData.healthInsuranceDetails)},
        [NomineeDetails] = ${sqlValue(formData.nomineeDetails)},
        [NomineePhoneno] = ${sqlValue(formData.NomineePhoneno)},
        [NomineeRelationship] = ${sqlValue(formData.NomineeRelationship)},
         [AssetType] = ${sqlValue(formData.AssetType)},
        [Asset_Name] = ${sqlValue(formData.assetName)},
        [Asset_SerialNumber] = ${sqlValue(formData.assetSerialNumber)}
      WHERE [pn_EmployeeID] = ${id}
    `.replace(/\n/g, " ");

      const updateProfileQuery = `
  UPDATE [${dbname}].[dbo].[paym_employee_profile1]
  SET 
    [pn_CompanyID] = ${sqlValue(finalCompanyId)},
    [pn_BranchID] = ${sqlValue(pnBranchId)},
    [pn_EmployeeID] = ${id},
    [pn_DivisionId] = ${sqlValue(formData.pnDivisionId)},
    [pn_DepartmentId] = ${sqlValue(formData.pnDepartmentId)},
    [pn_DesignationId] = ${sqlValue(formData.pnDesignationId)},
    [pn_GradeId] = ${sqlValue(formData.pnGradeId)},
    [pn_ShiftId] = ${sqlValue(formData.pn_ShiftID)},
    [pn_CategoryId] = ${sqlValue(formData.pnCategoryId)},
    [pn_JobStatusId] = ${sqlValue(formData.pnJobStatusId)},
    [pn_LevelID] = ${sqlValue(formData.pnLevelId)},
    [pn_projectsiteID] = ${sqlValue(formData.pnProjectsiteId)},
    [d_Date] = ${sqlValue(formData.d_Date)},
    [v_Reason] = ${sqlValue(formData.v_Reason)},
    [r_Department] = ${sqlValue(formData.r_Department)},
    [father_name] = ${sqlValue(formData.fatherName)},
    [image_data] = '${base64Image.replace(/'/g, "''")}',
    [Emp_Profile_Image] = '${base64Image.replace(/'/g, "''")}'
  WHERE [pn_EmployeeID] = ${id}
`.replace(/\n/g, " ");

      // Execute the queries using your postRequest function
      const employeeUpdateResponse = await postRequest(
        ServerConfig.url,
        REPORTS,
        {
          query: updateEmployeeQuery,
        }
      );

      const profileUpdateResponse = await postRequest(
        ServerConfig.url,
        REPORTS,
        {
          query: updateProfileQuery,
        }
      );

      if (employeeUpdateResponse.data && profileUpdateResponse.data) {
        console.log("Employee updated successfully");
        toast.success("Employee updated successfully", {
          position: "top-center",
          autoClose: 1000,
        });

        // Reset steps or reload data
        setCompletedSteps(new Set());
        setActiveStep(0);
      } else {
        throw new Error("Failed to update employee");
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      alert("Error updating employee: " + error.message);
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

  useEffect(() => {
    async function fetchAssetTypes() {
      try {
        if (pnCompanyId && pnBranchId) {
        const response = await postRequest(ServerConfig.url, REPORTS, {
          query: `SELECT DISTINCT AssetType FROM [${dbname}].[dbo].[Assets] WHERE BranchID = ${pnBranchId}`,
        });
        if (response.data) {
          setUniqueAssetTypes(response.data.map((item) => item.AssetType));
        }}
      } catch (error) {
        console.error("Error fetching asset types:", error);
      }
    }

    fetchAssetTypes();
  }, [pnCompanyId, pnBranchId]);

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

    console.log("Fetching employee data for ID:", id);

    const fetchEmployeeData = async () => {
      try {
        let profileResponse = null;
        let employeeResponse = null;

        // Fetch profile data
        try {
          profileResponse = await postRequest(ServerConfig.url, REPORTS, {
            query: `SELECT * FROM [${dbname}].[dbo].[paym_employee_profile1] WHERE [pn_EmployeeID] = ${id}`,
          });
          console.log("Profile Response:", profileResponse.data);
        } catch (err) {
          console.error("Profile fetch error:", err);
        }

        // Fetch employee data
        try {
          employeeResponse = await postRequest(ServerConfig.url, REPORTS, {
            query: `SELECT * FROM [${dbname}].[dbo].[paym_Employee] WHERE [pn_EmployeeID] = ${id}`,
          });
          console.log("Employee Response:", employeeResponse.data);
        } catch (err) {
          console.error("Employee fetch error:", err);
        }

        if (
          profileResponse?.data?.length > 0 &&
          employeeResponse?.data?.length > 0
        ) {
          const profileData = profileResponse.data[0];
          const employeeData = employeeResponse.data[0];

          console.log("Raw DateofBirth:", employeeData.DateofBirth);
          console.log("Raw JoiningDate:", employeeData.JoiningDate);
          console.log("Employee Response:", employeeResponse.data);
          const safeFormatDate = (dateValue) => {
            if (
              !dateValue ||
              (typeof dateValue === "object" &&
                Object.keys(dateValue).length === 0)
            ) {
              return "";
            }

            if (typeof dateValue === "object" && dateValue.$date) {
              const parsed = new Date(dateValue.$date);
              if (!isNaN(parsed)) {
                return parsed.toISOString().split("T")[0];
              }
            }

            if (dateValue instanceof Date && !isNaN(dateValue)) {
              return dateValue.toISOString().split("T")[0];
            }

            if (typeof dateValue === "string") {
              const parsed = new Date(dateValue);
              if (!isNaN(parsed)) {
                return parsed.toISOString().split("T")[0];
              }
            }

            console.warn("Invalid date format:", dateValue);
            return "";
          };

          console.log(employeeData);
          const clean = (v) => (v && typeof v === "object" ? "" : v || "");

          // ✅ Set form data
          // setFormData({
          //   // ✅ From employee table
          //   pnCompanyId: employeeData.pn_CompanyID,
          //   pnBranchId: employeeData.pn_BranchID,
          //   employeeCode: employeeData.EmployeeCode,
          //   password: employeeData.Password, // was lowercase earlier
          //   employeeFirstName: employeeData.Employee_First_Name,
          //   employeeMiddleName: employeeData.Employee_Middle_Name || "",
          //   employeeLastName: employeeData.Employee_Last_Name,
          //   dateofBirth: safeFormatDate(employeeData.DateofBirth),
          //   gender: employeeData.Gender,
          //   // status: employeeData.status,
          //   status:
          //     employeeData.status === "Active"
          //       ? "A"
          //       : employeeData.status === "Inactive"
          //       ? "I"
          //       : employeeData.status === "Pending"
          //       ? "P"
          //       : "",

          //   employeeFullName: employeeData.Employee_Full_Name,
          //   readerid: employeeData.Readerid,
          //   otEligible: employeeData.OT_Eligible,
          //   pfno: employeeData.Pfno,
          //   esino: employeeData.Esino,
          //   otCalc: employeeData.OT_calc,
          //   ctc: employeeData.CTC,
          //   basicSalary: employeeData.basic_salary,
          //   bankCode: employeeData.Bank_code,
          //   bankName: employeeData.Bank_Name,
          //   branchName: employeeData.Branch_Name,
          //   accountType: employeeData.Account_Type,
          //   micrCode: employeeData.MICR_code,
          //   ifscCode: employeeData.IFSC_Code,
          //   otherInfo: employeeData.Other_Info,
          //   reportingPerson: employeeData.Reporting_person,
          //   reportingId: employeeData.ReportingID,
          //   reportingEmail: employeeData.Reporting_email,
          //   panNo: employeeData.Pan_no,
          //   salaryType: employeeData.salary_type,
          //   tdsApplicable: employeeData.TDS_Applicable,
          //   flag: employeeData.Flag,
          //   role: employeeData.role,
          //   accountNo: employeeData.accountNo,
          //   bloodGroup: employeeData.Blood_Group,
          //   phoneNo: employeeData.Phone_No,
          //   alternatePhoneNo: employeeData.Alternate_Phone_No,
          //   permanentAddress: employeeData.permanent_address,
          //   aadharCard: employeeData.Aadhar_Card,
          //   currentAddress: employeeData.Current_Address,
          //   fatherName: employeeData.Father_Name, // ✅ note case
          //   email: employeeData.Email,
          //   alternateEmail: employeeData.Alternate_Email,
          //   grade: employeeData.Grade,
          //   overallExperience: employeeData.Overall_Experience,
          //   highestQualification: employeeData.HighestQualification,
          //   universityName: employeeData.UniversityName,
          //   yearOfPassing: employeeData.YearOfPassing,
          //   certifications: employeeData.Certifications,
          //   skills: employeeData.Skills,
          //   uan: employeeData.UAN,
          //   paymentMode: employeeData.PaymentMode,
          //   passportNumber: employeeData.PassportNumber || "",
          //   visaDetails: employeeData.VisaDetails,
          //   joiningDate: safeFormatDate(employeeData.JoiningDate),
          //   exitReason: employeeData.ExitReason,
          //   ExitDate: safeFormatDate(employeeData.ExitDate),
          //   previousCompany: employeeData.PreviousCompany,
          //   previousDesignation: employeeData.PreviousDesignation,
          //   previousEmploymentDuration: employeeData.PreviousEmploymentDuration,
          //   reasonForLeaving: employeeData.ReasonForLeaving || "",
          //   performanceRating: employeeData.PerformanceRating,
          //   trainingRecords: employeeData.TrainingRecords,
          //   disciplinaryActions: employeeData.DisciplinaryActions,
          //   awards: employeeData.Awards,
          //   vehicleDetails: employeeData.VehicleDetails,
          //   healthInsuranceDetails: employeeData.HealthInsuranceDetails,
          //   nomineeDetails: employeeData.NomineeDetails,
          //   NomineePhoneno: employeeData.NomineePhoneno,
          //   NomineeRelationship: employeeData.NomineeRelationship,
          //   assetType: employeeData.AssetType,
          //   assetName: employeeData.Asset_Name,
          //   assetSerialNumber: employeeData.Asset_SerialNumber,

          //   // ✅ From profile table
          //   pnDivisionId: profileData.pn_DivisionId,
          //   pnDepartmentId: profileData.pn_DepartmentId,
          //   pnDesignationId: profileData.pn_DesignationId,
          //   pnGradeId: profileData.pn_GradeId,
          //   pn_ShiftID: profileData.pn_ShiftId,
          //   pnCategoryId: profileData.pn_CategoryId,
          //   pnJobStatusId: profileData.pn_JobStatusId,
          //   pnLevelId: profileData.pn_LevelID,
          //   pnProjectsiteId: profileData.pn_projectsiteID,
          //   d_Date: safeFormatDate(profileData.d_Date),
          //   v_Reason: profileData.v_Reason,
          //   r_Department: profileData.r_Department,
          //   fatherNameProfile: profileData.father_name, // ⚡ different from employee
          //   empProfileImage: profileData.Emp_Profile_Image,
          //   imageData: profileData.image_data,
          // });
          // const emp = { ...employeeData, ...profileData };

          // setFormData({
          //   // ================= GENERAL =================
          //   employeeFirstName: clean(emp.Employee_First_Name),
          //   employeeMiddleName: clean(emp.Employee_Middle_Name),
          //   employeeLastName: clean(emp.Employee_Last_Name),
          //   employeeFullName: clean(emp.Employee_Full_Name),

          //   dateofBirth: safeFormatDate(emp.DateofBirth),
          //   gender: clean(emp.Gender),

          //   status:
          //     emp.status === "Active"
          //       ? "A"
          //       : emp.status === "Inactive"
          //       ? "I"
          //       : emp.status === "Pending"
          //       ? "P"
          //       : "",

          //   bloodGroup: clean(emp.Blood_Group),

          //   // ================= CONTACT =================
          //   phoneNo: clean(emp.Phone_No),
          //   alternatePhoneNo: clean(emp.Alternate_Phone_No),

          //   email: clean(emp.Email),
          //   alternateEmail: clean(emp.Alternate_Email),

          //   permanentAddress: clean(emp.permanent_address),
          //   currentAddress: clean(emp.Current_Address),

          //   // ================= COMPLIANCE =================
          //   passportNumber: clean(emp.PassportNumber),
          //   visaDetails: clean(emp.VisaDetails),
          //   uan: clean(emp.UAN),
          //   pfno: clean(emp.Pfno),
          //   esino: clean(emp.Esino),

          //   // ================= REPORTING =================
          //   reportingId: clean(emp.ReportingID),
          //   reportingPerson: clean(emp.Reporting_person),
          //   reportingEmail: clean(emp.Reporting_email),
          //   reportingDepartment: clean(emp.r_Department),
          //   reason: clean(emp.v_Reason),

          //   // ================= EDUCATION =================
          //   highestQualification: clean(emp.HighestQualification),
          //   universityName: clean(emp.UniversityName),
          //   yearOfPassing: clean(emp.YearOfPassing),
          //   certifications: clean(emp.Certifications),
          //   skills: clean(emp.Skills),

          //   // ================= EXPERIENCE =================
          //   previousCompany: clean(emp.PreviousCompany),
          //   previousDesignation: clean(emp.PreviousDesignation),
          //   previousEmploymentDuration: clean(emp.PreviousEmploymentDuration),
          //   reasonForLeaving: clean(emp.ReasonForLeaving),

          //   performanceRating: clean(emp.PerformanceRating),
          //   trainingRecords: clean(emp.TrainingRecords),
          //   awards: clean(emp.Awards),

          //   // ================= BANK =================
          //   aadharCardNumber: clean(emp.Aadhar_Card),
          //   micrCode: clean(emp.MICR_code),
          //   branchName: clean(emp.Branch_Name),
          //   bankName: clean(emp.Bank_Name),
          //   bankCode: clean(emp.Bank_code),
          //   accountNumber: clean(emp.accountNo),
          //   ifscCode: clean(emp.IFSC_Code),
          //   accountType: clean(emp.Account_Type),
          //   panNumber: clean(emp.Pan_no),

          //   // ================= SALARY =================
          //   ctc: clean(emp.CTC),
          //   paymentMode: clean(emp.PaymentMode),
          //   basicSalary: clean(emp.basic_salary),
          //   readerId: clean(emp.Readerid),
          //   salaryType: clean(emp.salary_type),
          //   role: clean(emp.role),
          //   otherInfo: clean(emp.Other_Info),
          //   otEligible: clean(emp.OT_Eligible),
          //   tdsApplicable: clean(emp.TDS_Applicable),
          //   otCal: clean(emp.OT_calc),

          //   // ================= ASSET =================
          //   AssetType: clean(emp.AssetType),
          //   assetName: clean(emp.Asset_Name),
          //   assetSerialNumber: clean(emp.Asset_SerialNumber),

          //   // ================= DATES =================
          //   joiningDate: safeFormatDate(emp.JoiningDate),
          //   d_Date: safeFormatDate(emp.d_Date),

          //   // ================= MASTER KEYS =================
          //   pnDesignationId: emp.pn_DesignationId,
          //   pnDepartmentId: emp.pn_DepartmentId,
          //   pnDivisionId: emp.pn_DivisionId,
          //   pnGradeId: emp.pn_GradeId,
          //   pn_ShiftID: emp.pn_ShiftId,
          //   pnCategoryId: emp.pn_CategoryId,
          //   pnJobStatusId: emp.pn_JobStatusId,
          //   pnLevelId: emp.pn_LevelID,
          //   pnProjectsiteId: emp.pn_projectsiteID,

          //   // ================= EXTRA =================
          //   fatherName: clean(emp.Father_Name),
          //   vehicleDetails: clean(emp.VehicleDetails),
          //   healthInsuranceDetails: clean(emp.HealthInsuranceDetails),
          //   nomineeDetails: clean(emp.NomineeDetails),
          //   nomineePhoneNo: clean(emp.NomineePhoneno),
          //   nomineeRelationship: clean(emp.NomineeRelationship),
          // });
          const emp = { ...employeeData, ...profileData };

          setFormData({
            // ================= GENERAL =================
            employeeFirstName: clean(emp.Employee_First_Name),
            employeeMiddleName: clean(emp.Employee_Middle_Name),
            employeeLastName: clean(emp.Employee_Last_Name),
            employeeFullName: clean(emp.Employee_Full_Name),

            dateofBirth: safeFormatDate(emp.DateofBirth),
            gender: clean(emp.Gender),

            status:
              emp.status === "Active"
                ? "A"
                : emp.status === "Inactive"
                ? "I"
                : emp.status === "Pending"
                ? "P"
                : "",

            bloodGroup: clean(emp.Blood_Group),

            // ================= CONTACT =================
            phoneNo: clean(emp.Phone_No),
            alternatePhoneNo: clean(emp.Alternate_Phone_No),
            email: clean(emp.Email),
            alternateEmail: clean(emp.Alternate_Email),
            permanentAddress: clean(emp.permanent_address),
            currentAddress: clean(emp.Current_Address),

            // ================= EMPLOYMENT =================
            employeeCode: clean(emp.EmployeeCode),
            password: clean(emp.Password),

            pnDivisionId: emp.pn_DivisionId,
            pnDepartmentId: emp.pn_DepartmentId,
            pnDesignationId: emp.pn_DesignationId,
            pnGradeId: emp.pn_GradeId,
            pn_ShiftID: emp.pn_ShiftId,
            pnCategoryId: emp.pn_CategoryId,
            pnJobStatusId: emp.pn_JobStatusId,
            pnLevelId: emp.pn_LevelID,
            pnProjectsiteId: emp.pn_projectsiteID,

            // ================= COMPLIANCE =================
            passportNumber: clean(emp.PassportNumber),
            visaDetails: clean(emp.VisaDetails),
            uan: clean(emp.UAN),
            pfno: clean(emp.Pfno),
            esino: clean(emp.Esino),

            // ================= REPORTING =================
            reportingId: clean(emp.ReportingID),
            reportingPerson: clean(emp.Reporting_person),
            reportingEmail: clean(emp.Reporting_email),
            v_Reason: clean(emp.v_Reason),
            r_Department: clean(emp.r_Department),

            // ================= EDUCATION =================
            highestQualification: clean(emp.HighestQualification),
            universityName: clean(emp.UniversityName),
            yearOfPassing: clean(emp.YearOfPassing),
            certifications: clean(emp.Certifications),
            skills: clean(emp.Skills),

            // ================= EXPERIENCE =================
            overallExperience: clean(emp.Overall_Experience),
            previousCompany: clean(emp.PreviousCompany),
            previousDesignation: clean(emp.PreviousDesignation),
            previousEmploymentDuration: clean(emp.PreviousEmploymentDuration),
            reasonForLeaving: clean(emp.ReasonForLeaving),
            performanceRating: clean(emp.PerformanceRating),
            trainingRecords: clean(emp.TrainingRecords),
            awards: clean(emp.Awards),

            // ================= BANK DETAILS =================
            aadharCard: clean(emp.Aadhar_Card),
            micrCode: clean(emp.MICR_code),
            branchName: clean(emp.Branch_Name),
            bankName: clean(emp.Bank_Name),
            bankCode: clean(emp.Bank_code),
            accountNo: clean(emp.accountNo),
            ifscCode: clean(emp.IFSC_Code),
            accountType: clean(emp.Account_Type),
            panNo: clean(emp.Pan_no),

            // ================= SALARY DETAILS =================
            ctc: clean(emp.CTC),
            paymentMode: clean(emp.PaymentMode),
            basicSalary: clean(emp.basic_salary),
            readerid: clean(emp.Readerid),
            salaryType: clean(emp.salary_type),
            role: clean(emp.role),
            otherInfo: clean(emp.Other_Info),
            otEligible: clean(emp.OT_Eligible),
            tdsApplicable: clean(emp.TDS_Applicable),
            otCalc: clean(emp.OT_calc),

            // ================= ASSET DETAILS =================
            AssetType: clean(emp.AssetType),
            assetName: clean(emp.Asset_Name),
            assetSerialNumber: clean(emp.Asset_SerialNumber),

            // ================= DATES =================
            joiningDate: safeFormatDate(emp.JoiningDate),
            d_Date: safeFormatDate(emp.d_Date),

            // ================= PERSONAL =================
            fatherName: clean(emp.Father_Name),
            vehicleDetails: clean(emp.VehicleDetails),
            healthInsuranceDetails: clean(emp.HealthInsuranceDetails),

            // ================= NOMINEE =================
            nomineeDetails: clean(emp.NomineeDetails),
            NomineePhoneno: clean(emp.NomineePhoneno),
            NomineeRelationship: clean(emp.NomineeRelationship),

            // ================= PROFILE IMAGE =================
            imageData: profileData.image_data,
          });

          // 🔹 Clean dropdown-like objects before setting to state
          const sanitizeObjectValues = (obj) => {
            const clean = {};
            Object.keys(obj).forEach((key) => {
              const val = obj[key];
              clean[key] =
                val && typeof val === "object" ? val.value || "" : val;
            });
            return clean;
          };

          // ✅ Set preview image
          const imageData =
            profileData.image_data || profileData.Emp_Profile_Image;
          if (imageData) {
            setPreviewUrl(
              imageData.startsWith("data:image")
                ? imageData
                : `data:image/jpeg;base64,${imageData}`
            );
          } else {
            setPreviewUrl(null);
          }
        } else {
          console.warn("No employee data found.");
        }
      } catch (error) {
        console.error("Unexpected fetch error:", error);
        toast.error("Failed to load employee data.", {
          position: "top-center",
          autoClose: 1000,
        });
      }
    };

    fetchEmployeeData();
  }, [id]);

  useEffect(() => {
    async function fetchAssets() {
      try {
        if (pnCompanyId && pnBranchId) {
          const assetsData = await postRequest(ServerConfig.url, REPORTS, {
            query: `SELECT [Asset_name], [Asset_SerialNumber], [AssetType] 
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
  }, [pnCompanyId, pnBranchId]);

  const filteredAssets = formData.AssetType
    ? assets.filter((asset) => asset.AssetType === formData.AssetType)
    : assets;
  // Filter assets by selected type
  const filteredByType = formData.AssetType
    ? assets.filter((asset) => asset.AssetType === formData.AssetType)
    : assets;

  // Filter assets by selected name (for serial numbers)
  const filteredByName = formData.assetName
    ? filteredByType.filter((asset) => asset.Asset_name === formData.assetName)
    : filteredByType;
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
  //               query: `select * from [${dbname}].[dbo].[paym_Company] where pn_CompanyID = ${loggedBranchData.data[0].pn_CompanyID}`,
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
          // Company
          postRequest(ServerConfig.url, REPORTS, {
            dbname,
            query: `SELECT * FROM [${dbname}].[dbo].[paym_Company]`,
          }),

          // Branch
          postRequest(ServerConfig.url, REPORTS, {
            dbname,
            query: `SELECT * FROM [${dbname}].[dbo].[paym_Branch]`,
          }),

          // Division
          postRequest(ServerConfig.url, REPORTS, {
            dbname,
            query: `SELECT * FROM [${dbname}].[dbo].[paym_Division]`,
          }),

          // Department
          postRequest(ServerConfig.url, REPORTS, {
            dbname,
            query: `SELECT * FROM [${dbname}].[dbo].[paym_Department]`,
          }),

          // Designation
          postRequest(ServerConfig.url, REPORTS, {
            dbname,
            query: `SELECT * FROM [${dbname}].[dbo].[paym_Designation]`,
          }),

          // Grade
          postRequest(ServerConfig.url, REPORTS, {
            dbname,
            query: `SELECT * FROM [${dbname}].[dbo].[paym_Grade]`,
          }),

          // Shift
          postRequest(ServerConfig.url, REPORTS, {
            dbname,
            query: `SELECT * FROM [${dbname}].[dbo].[paym_Shift]`,
          }),

          // Category
          postRequest(ServerConfig.url, REPORTS, {
            dbname,
            query: `SELECT * FROM [${dbname}].[dbo].[paym_Category]`,
          }),

          // Job Status
          postRequest(ServerConfig.url, REPORTS, {
            dbname,
            query: `SELECT * FROM [${dbname}].[dbo].[paym_JobStatus]`,
          }),

          // Level
          postRequest(ServerConfig.url, REPORTS, {
            dbname,
            query: `SELECT * FROM [${dbname}].[dbo].[paym_Level]`,
          }),
        ]);

        // *** ASSIGN MASTER DATA ***
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

        // ========== EMPLOYEE’S LOGGED-IN BRANCH + COMPANY ==========
        if (isloggedin) {
          const loggedBranchData = await postRequest(
            ServerConfig.url,
            REPORTS,
            {
              dbname,
              query: `
            SELECT * FROM [${dbname}].[dbo].[paym_Branch]
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
        console.error("Error fetching data:", error);
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
        // 🔥 Fetch Company list
        const companyData = await postRequest(ServerConfig.url, REPORTS, {
          dbname: dbname,
          query: `SELECT * FROM [${dbname}].[dbo].[paym_Company]`,
        });
        setCompany(companyData.data);

        // 🔥 Fetch Branch list
        const branchData = await postRequest(ServerConfig.url, REPORTS, {
          dbname: dbname,
          query: `SELECT * FROM [${dbname}].[dbo].[paym_Branch]`,
        });
        setBranch(branchData.data);
      } catch (error) {
        console.error("Error fetching initial company/branch:", error);
      }
    }

    fetchInitialData();
  }, []); // Runs once on page load

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
      toast.error("Only JPG, JPEG, PNG, and GIF files are allowed.", {
        position: "top-center",
        autoClose: 1000,
      });
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

    // Special handling for asset type changes
    if (name === "AssetType") {
      // Reset asset name and serial number when type changes
      setFormData((prev) => ({
        ...prev,
        assetName: "",
        assetSerialNumber: "",
      }));
    }

    // Validate the field on change
    const errorMessage = validateForm(name, value);
    setFormErrors((prev) => ({ ...prev, [name]: errorMessage }));
  };

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

  console.log("d_Date", formData.d_Date ? safeDate(formData.d_Date) : "");
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
                            // InputProps={{ readOnly: true }}
                            className="custom-readonly-textfield"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="dateofBirth"
                            label="Date of Birth"
                            type="date"
                            value={
                              formData.dateofBirth
                                ? safeDate(formData.dateofBirth)
                                : ""
                            } // Format to YYYY-MM-DD
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
                        <Grid item xs={12} sm={6} style={{ marginTop: "18px" }}>
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
                            autoComplete="new-password"
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
                            autoComplete="new-password"
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
                            value={
                              formData.joiningDate
                                ? safeDate(formData.joiningDate)
                                : ""
                            } // Format to YYYY-MM-DD
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
                              name="AssetType"
                              value={formData.AssetType || ""} // Use formData.AssetType directly
                              onChange={!isViewMode ? handleChange : undefined}
                              onBlur={!isViewMode ? handleBlur : undefined}
                              label="Asset Type"
                              disabled={isViewMode}
                              error={!!formErrors.AssetType}
                            >
                              <MenuItem value="">Select Asset Type</MenuItem>
                              {uniqueAssetTypes.map((type, index) => (
                                <MenuItem key={index} value={type}>
                                  {type}
                                </MenuItem>
                              ))}
                            </Select>
                            {formErrors.AssetType && (
                              <FormHelperText error>
                                {formErrors.AssetType}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl
                            fullWidth
                            margin="normal"
                            className="custom-readonly-textfield"
                          >
                            <InputLabel>Asset Name</InputLabel>
                            <Select
                              name="assetName"
                              value={formData.assetName}
                              onChange={
                                !isViewMode
                                  ? (e) => {
                                      handleChange(e);
                                      // Clear serial number when name changes
                                      setFormData((prev) => ({
                                        ...prev,
                                        assetSerialNumber: "",
                                      }));
                                    }
                                  : undefined
                              }
                              onBlur={!isViewMode ? handleBlur : undefined}
                              label="Asset Name"
                              error={!!formErrors.assetName}
                              disabled={isViewMode}
                            >
                              <MenuItem value="">Select Asset</MenuItem>
                              {[
                                ...new Set(
                                  filteredByType.map(
                                    (asset) => asset.Asset_name
                                  )
                                ),
                              ].map((name) => (
                                <MenuItem key={name} value={name}>
                                  {name}
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
                            className="custom-readonly-textfield"
                            disabled={isViewMode || !formData.assetName}
                          >
                            <MenuItem value="">Select Serial Number</MenuItem>
                            {filteredByName.map((asset) => (
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
                  <Button
                    variant="outlined"
                    onClick={handleBack}
                    disabled={activeStep === 0}
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#f0f0f0",
                      "&:disabled": {
                        opacity: 0.5,
                        cursor: "not-allowed",
                      },
                    }}
                  >
                    Back
                  </Button>

                  {activeStep < steps.length - 1 ? (
                    <Button
                      variant="contained"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNext();
                      }}
                      type="button"
                      sx={{
                        fontWeight: "bold",
                        backgroundColor: "#e74c3c",
                        "&:hover": {
                          backgroundColor: "#c0392b",
                        },
                      }}
                    >
                      Next
                    </Button>
                  ) : (
                    !isViewMode && (
                      <Button
                        variant="contained"
                        onClick={handleUpdate}
                        sx={{
                          fontWeight: "bold",
                          backgroundColor: "#28a745",
                          "&:hover": {
                            backgroundColor: "#218838",
                          },
                        }}
                      >
                        Update
                      </Button>
                    )
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
