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
import Sidenav from "../../../components/Home Page/Sidenav";
import Navbar from "../../../components/Home Page/Navbar";
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
export default function PaymEmployeeFormm() {
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
  //const isViewMode = !!id;
  const location = useLocation();
  const [isViewMode, setIsViewMode] = useState(true); // default true

  useEffect(() => {
    if (location.state?.isViewMode !== undefined) {
      setIsViewMode(location.state.isViewMode);
    }
  }, [location.state]);
  const [selectedAssetType, setSelectedAssetType] = useState("");
  const [usedSerialNumbers, setUsedSerialNumbers] = useState([]);
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
  const [allAssets, setAllAssets] = useState([]);
  const [availableAssets, setAvailableAssets] = useState([]);
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
  const [dDate, setDDate] = useState("");

  const [vReason, setVReason] = useState("");
  const [rDepartment, setRDepartment] = useState("");
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
    status: "A",
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
    pnDesingnationId: "",
    pnGradeId: "",
    pnShiftId: "",
    pnCategoryId: "",
    pnJobStatusId: "",
    pnLevelId: "",
    pnProjectsiteId: "",
    d_Date: "",
    vReason: "",
    rDepartment: "",
    imageData: "",
  });

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
        const selectedDate = new Date(value);
        const today = new Date();
        if (selectedDate > today)
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
    async function fetchAssets() {
      try {
        if (pnCompanyId && pnBranchId) {
          const assetsData = await postRequest(ServerConfig.url, REPORTS, {
            query: `SELECT [Asset_name], [Asset_SerialNumber], [AssetType] 
                 FROM [dbo].[Assets] 
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
  useEffect(() => {
    async function getData() {
      try {
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
          getRequest(ServerConfig.url, PAYMCOMPANIES),
          getRequest(ServerConfig.url, PAYMBRANCHES),
          getRequest(ServerConfig.url, PAYMDIVISION),
          getRequest(ServerConfig.url, PAYMDEPARTMENT),
          getRequest(ServerConfig.url, PAYMDESIGNATION),
          getRequest(ServerConfig.url, PAYMGRADE),
          getRequest(ServerConfig.url, PAYMSHIFT),
          getRequest(ServerConfig.url, PAYMCATEGORY),
          getRequest(ServerConfig.url, JOBSTATUS),
          getRequest(ServerConfig.url, PAYMLEVEL),
        ]);

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

        if (isloggedin) {
          const loggedBranchData = await postRequest(
            ServerConfig.url,
            REPORTS,
            {
              query: `select * from paym_Branch where Branch_User_Id = '${isloggedin}'`,
            }
          );

          if (loggedBranchData.data) {
            setloggedBranch(loggedBranchData.data);
            setPnBranchId(loggedBranchData.data[0].pn_BranchID);

            const loggedCompanyData = await postRequest(
              ServerConfig.url,
              REPORTS,
              {
                query: `select * from paym_Company where pn_CompanyID = ${loggedBranchData.data[0].pn_CompanyID}`,
              }
            );

            if (loggedCompanyData.data) {
              setloggedCompany(loggedCompanyData.data);
              setPnCompanyId(loggedCompanyData.data[0].pn_CompanyID);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    }
    console.log("shift data:", shift);

    getData();
  }, [isloggedin]);

  useEffect(() => {
    async function fetchInitialData() {
      const companyData = await getRequest(ServerConfig.url, PAYMCOMPANIES);
      setCompany(companyData.data);

      const branchData = await getRequest(ServerConfig.url, PAYMBRANCHES);
      setBranch(branchData.data);
    }

    fetchInitialData();
  }, []); // Only run when isloggedin changes

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const loggedBranchData = await postRequest(ServerConfig.url, REPORTS, {
          query: ` select * from paym_Branch where Branch_User_Id = '${isloggedin}'`,
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
              query: ` select * from paym_Company where pn_CompanyID = ${loggedBranch[0].pn_CompanyID}`,
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
  useEffect(() => {
    const { employeeFirstName, employeeMiddleName, employeeLastName } =
      formData;

    // Only update full name when all three fields have values
    if (employeeFirstName && employeeMiddleName && employeeLastName) {
      const fullName = `${employeeFirstName} ${employeeMiddleName} ${employeeLastName}`;
      setFormData((prev) => ({ ...prev, employeeFullName: fullName }));
    } else {
      // Clear full name if any field is empty
      setFormData((prev) => ({ ...prev, employeeFullName: "" }));
    }
  }, [
    formData.employeeFirstName,
    formData.employeeMiddleName,
    formData.employeeLastName,
  ]);

  useEffect(() => {
    async function fetchAssetTypes() {
      try {
        const response = await postRequest(ServerConfig.url, REPORTS, {
          query: `SELECT DISTINCT AssetType FROM [dbo].[Assets] WHERE AssetType IS NOT NULL`,
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
    async function fetchUsedSerialNumbers() {
      try {
        const response = await postRequest(ServerConfig.url, REPORTS, {
          query: `SELECT DISTINCT [Asset_SerialNumber] 
                FROM [dbo].[paym_Employee] 
                WHERE [Asset_SerialNumber] IS NOT NULL 
                AND [Asset_SerialNumber] != '' 
                AND [pn_CompanyID] = ${pnCompanyId} 
                AND [pn_BranchID] = ${pnBranchId}`,
        });
        if (response.data) {
          setUsedSerialNumbers(
            response.data.map((item) => item.Asset_SerialNumber)
          );
        }
      } catch (error) {
        console.error("Error fetching used serial numbers:", error);
      }
    }

    if (pnCompanyId && pnBranchId) {
      fetchUsedSerialNumbers();
    }
  }, [pnCompanyId, pnBranchId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    const errors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateForm(key, formData[key]);
      if (error) errors[key] = error;
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      alert("Please fill all fields before submitting.");
      return;
    }

    if (!profileImage) {
      alert("Please upload an image before submitting.");
      return;
    }

    try {
      // Convert image to base64
      const base64Image = await convertImageToBase64(profileImage);

      // Helper function to properly escape SQL strings
      const sqlValue = (value) => {
        if (value === null || value === undefined) {
          return "NULL";
        }
        if (typeof value === "string") {
          return `'${value.replace(/'/g, "''")}'`;
        }
        return value;
      };

      // Generate employee insert query
      const insertEmployeeQuery = `
      INSERT INTO [dbo].[paym_Employee] (
        [pn_CompanyID], [pn_BranchID], [EmployeeCode],[Password], [Employee_First_Name],
        [Employee_Middle_Name], [Employee_Last_Name], [DateofBirth], [Gender],
        [status], [Employee_Full_Name], [Readerid], [OT_Eligible], [Pfno],
        [Esino], [OT_calc], [CTC], [basic_salary], [Bank_code], [Bank_Name],
        [Branch_Name], [Account_Type], [MICR_code], [IFSC_Code], [Other_Info],
        [Reporting_person], [ReportingID], [Reporting_email], [Pan_no],
        [salary_type], [TDS_Applicable], [Flag], [role], [accountNo],
        [Blood_Group], [Phone_No], [Alternate_Phone_No], [permanent_address],
        [Aadhar_Card], [Current_Address], [Father_Name], [Email],
        [Alternate_Email], [Grade], [Overall_Experience], [HighestQualification],
        [UniversityName], [YearOfPassing], [Certifications], [Skills], [UAN],
        [PaymentMode], [PassportNumber], [VisaDetails], [JoiningDate],
        [ExitReason], [ExitDate], [PreviousCompany], [PreviousDesignation],
        [PreviousEmploymentDuration], [ReasonForLeaving], [PerformanceRating],
        [TrainingRecords], [DisciplinaryActions], [Awards], [VehicleDetails],
        [HealthInsuranceDetails], [NomineeDetails], [NomineePhoneno],
        [NomineeRelationship], [AssetType], [Asset_Name], [Asset_SerialNumber]
      ) VALUES (
        ${sqlValue(formData.pn_CompanyID)}, ${sqlValue(formData.pn_BranchID)},
        ${sqlValue(formData.employeeCode)},  ${sqlValue(
        formData.password
      )},${sqlValue(formData.employeeFirstName)},
        ${sqlValue(formData.employeeMiddleName)}, ${sqlValue(
        formData.employeeLastName
      )},
        ${sqlValue(formData.dateofBirth)}, ${sqlValue(formData.gender)},
        ${sqlValue(formData.status)}, ${sqlValue(formData.employeeFullName)},
        ${sqlValue(formData.readerid)}, ${sqlValue(formData.otEligible)},
        ${sqlValue(formData.pfno)}, ${sqlValue(formData.esino)},
        ${sqlValue(formData.otCalc)}, ${sqlValue(formData.ctc)},
        ${sqlValue(formData.basicSalary)}, ${sqlValue(formData.bankCode)},
        ${sqlValue(formData.bankName)}, ${sqlValue(formData.branchName)},
        ${sqlValue(formData.accountType)}, ${sqlValue(formData.micrCode)},
        ${sqlValue(formData.ifscCode)}, ${sqlValue(formData.otherInfo)},
        ${sqlValue(formData.reportingPerson)}, ${sqlValue(
        formData.reportingId
      )},
        ${sqlValue(formData.reportingEmail)}, ${sqlValue(formData.panNo)},
        ${sqlValue(formData.salaryType)}, ${sqlValue(formData.tdsApplicable)},
        ${sqlValue(formData.flag)}, ${sqlValue(formData.role)},
        ${sqlValue(formData.accountNo)}, ${sqlValue(formData.bloodGroup)},
        ${sqlValue(formData.phoneNo)}, ${sqlValue(formData.alternatePhoneNo)},
        ${sqlValue(formData.permanentAddress)}, ${sqlValue(
        formData.aadharCard
      )},
        ${sqlValue(formData.currentAddress)}, ${sqlValue(formData.fatherName)},
        ${sqlValue(formData.email)}, ${sqlValue(formData.alternateEmail)},
        ${sqlValue(formData.grade)}, ${sqlValue(formData.overallExperience)},
        ${sqlValue(formData.highestQualification)}, ${sqlValue(
        formData.universityName
      )},
        ${sqlValue(formData.yearOfPassing)}, ${sqlValue(
        formData.certifications
      )},
        ${sqlValue(formData.skills)}, ${sqlValue(formData.uan)},
        ${sqlValue(formData.paymentMode)}, ${sqlValue(formData.passportNumber)},
        ${sqlValue(formData.visaDetails)}, ${sqlValue(formData.joiningDate)},
        ${sqlValue(formData.exitReason)}, ${sqlValue(formData.ExitDate)},
        ${sqlValue(formData.previousCompany)}, ${sqlValue(
        formData.previousDesignation
      )},
        ${sqlValue(formData.previousEmploymentDuration)}, ${sqlValue(
        formData.reasonForLeaving
      )},
        ${sqlValue(formData.performanceRating)}, ${sqlValue(
        formData.trainingRecords
      )},
        ${sqlValue(formData.disciplinaryActions)}, ${sqlValue(formData.awards)},
        ${sqlValue(formData.vehicleDetails)}, ${sqlValue(
        formData.healthInsuranceDetails
      )},
        ${sqlValue(formData.nomineeDetails)}, ${sqlValue(
        formData.NomineePhoneno
      )},
        ${sqlValue(formData.NomineeRelationship)},${sqlValue(
        formData.assetType
      )},
        ${sqlValue(formData.assetName)},  ${sqlValue(
        formData.assetSerialNumber
      )}
      )
    `;

      // First insert employee data
      const employeeResponse = await postRequest(ServerConfig.url, REPORTS, {
        query: insertEmployeeQuery,
      });

      if (!employeeResponse.data) {
        throw new Error("Failed to insert employee data");
      }

      // Get the newly inserted employee ID
      const getEmployeeIdQuery = `
      SELECT IDENT_CURRENT('paym_Employee') AS employeeId
    `;
      const idResponse = await postRequest(ServerConfig.url, REPORTS, {
        query: getEmployeeIdQuery,
      });

      const employeeId = idResponse.data[0]?.employeeId;
      if (!employeeId) {
        throw new Error("Failed to retrieve new employee ID");
      }

      // Generate profile insert query
      const insertProfileQuery = `
      INSERT INTO [dbo].[paym_employee_profile1] (
        [pn_CompanyID], [pn_BranchID], [pn_EmployeeID], [pn_DivisionId],
        [pn_DepartmentId], [pn_DesignationId], [pn_GradeId], [pn_ShiftId],
        [pn_CategoryId], [pn_JobStatusId], [pn_LevelID], [pn_projectsiteID],
        [d_Date], [v_Reason], [r_Department], [father_name],
        [image_data], [Emp_Profile_Image]
      ) VALUES (
        ${sqlValue(formData.pn_CompanyID)}, ${sqlValue(formData.pn_BranchID)},
        ${employeeId}, ${sqlValue(formData.pnDivisionId)},
        ${sqlValue(formData.pnDepartmentId)}, ${sqlValue(
        formData.pnDesignationId
      )},
        ${sqlValue(formData.pnGradeId)}, ${sqlValue(formData.pn_ShiftID)},
        ${sqlValue(formData.pnCategoryId)}, ${sqlValue(formData.pnJobStatusId)},
        ${sqlValue(formData.pnLevelId)}, ${sqlValue(formData.pnProjectsiteId)},
        ${sqlValue(formData.d_Date)}, ${sqlValue(formData.vReason)},
        ${sqlValue(formData.rDepartment)}, ${sqlValue(formData.fatherName)},
        '${base64Image.replace(/'/g, "''")}', '${base64Image.replace(
        /'/g,
        "''"
      )}'
      )
    `;

      // Insert profile data
      const profileResponse = await postRequest(ServerConfig.url, REPORTS, {
        query: insertProfileQuery,
      });

      if (profileResponse.data) {
        console.log("Employee created successfully");
        alert("Employee created successfully");

        // Reset form and steps
        setFormData({
          pnCompanyId: "",
          pnBranchId: "",
          employeeCode: "",
          password: "",
          employeeFirstName: "",
          employeeMiddleName: "",
          employeeLastName: "",
          dateofBirth: "",
          gender: "",
          status: "A",
          employeeFullName: "",
          readerid: "",
          otEligible: "",
          pfno: "",
          esino: "",
          otCalc: "",
          ctc: "",
          basicSalary: "",
          bankCode: "",
          bankName: "",
          branchName: "",
          accountType: "",
          micrCode: "",
          ifscCode: "",
          otherInfo: "",
          reportingPerson: "",
          reportingId: "",
          reportingEmail: "",
          panNo: "",
          salaryType: "",
          tdsApplicable: "",
          flag: null,
          role: "",
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
          grade: " ",
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
          pnDesingnationId: "",
          pnGradeId: "",
          pnShiftId: "",
          pnCategoryId: "",
          pnJobStatusId: "",
          pnLevelId: "",
          pnProjectsiteId: "",
          d_Date: "",
          vReason: "",
          rDepartment: "",
          imageData: "",
        });
        setProfileImage(null);
        setPreviewUrl(null);
        setCompletedSteps(new Set());
        setActiveStep(0);
      } else {
        throw new Error("Failed to insert profile data");
      }
    } catch (error) {
      console.error("Error creating employee:", error);
      alert("Error creating employee: " + error.message);
    }
  };

  // =======================================
  // ✅ Final handleSubmit() for Employee Form
  // =======================================
  // const handleSubmit = async (values, { resetForm }) => {
  //   try {
  //     const isEdit = !!values.pn_EmployeeID;
  //     const formatDate = (date) => {
  //       if (!date) return "NULL";
  //       const d = new Date(date);
  //       if (isNaN(d)) return "NULL";
  //       return `'${d.toISOString().split("T")[0]}'`;
  //     };
  //     const sanitize = (v) => {
  //       if (v === null || v === undefined || v === "") return "NULL";
  //       if (!isNaN(v) && v !== "") return v;
  //       // numeric values no quotes
  //       if (typeof v === "boolean") return v ? 1 : 0;
  //       if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v))
  //         return formatDate(v);
  //       return `'${v.toString().replace(/'/g, "''")}'`;
  //     };
  //     const cols = Object.keys(values);
  //     const vals = Object.values(values).map(sanitize);
  //     let query = "";
  //     if (!isEdit) {
  //       query = ` INSERT INTO [dbo].[paym_Employee] ( ${cols.join(
  //         ", "
  //       )} ) VALUES ( ${vals.join(", ")} ) `;
  //     } else {
  //       const updates = cols
  //         .filter((col) => col !== "pn_EmployeeID")
  //         .map((col, idx) => `${col} = ${vals[idx]}`)
  //         .join(", ");
  //       query = ` UPDATE [dbo].[paym_Employee] SET ${updates} WHERE pn_EmployeeID = ${values.pn_EmployeeID} `;
  //     }
  //     console.log("✅ Final SQL Query:", query);
  //     const response = await postRequest(ServerConfig.url + "Reports", {
  //       query,
  //     });
  //     if (response?.status === 200) {
  //       alert(
  //         isEdit
  //           ? "Employee updated successfully ✅"
  //           : "Employee saved successfully ✅"
  //       );
  //       resetForm();
  //     } else {
  //       alert("⚠️ Something went wrong while saving employee data.");
  //       console.error("Response:", response);
  //     }
  //   } catch (error) {
  //     console.error("❌ handleSubmit error:", error);
  //     alert("Error occurred while saving employee data.");
  //   }
  // };

  const filteredAssets = formData.assetType
    ? assets.filter((asset) => asset.AssetType === formData.assetType)
    : assets;
  // Filter assets by selected type
  const filteredByType = formData.assetType
    ? assets.filter((asset) => asset.AssetType === formData.assetType)
    : assets;

  // Filter assets by selected name (for serial numbers)
  const filteredByName = formData.assetName
    ? filteredByType.filter((asset) => asset.Asset_name === formData.assetName)
    : filteredByType;

  const handleStepClick = (index) => {
    setActiveStep(index);
    // In a real app, you might only allow clicking completed steps
    // or steps that are immediately next.
  };

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      // If on the last step and 'Next' (or 'Finish') is clicked,
      // mark current step complete and move beyond steps length
      handleCompleteStep(); // Call complete for the last step
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
              <form onSubmit={handleSubmit}>
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
                              value={formData.status || "A"}
                              onChange={!isViewMode ? handleChange : undefined}
                              onBlur={!isViewMode ? handleBlur : undefined}
                              label="Status"
                              disabled={isViewMode}
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
                            value={
                              formData.d_Date
                                ? formData.d_Date.split("T")[0]
                                : ""
                            }
                            onChange={handleChange}
                            onBlur={handleBlur}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            error={!!formErrors.d_Date}
                            helperText={formErrors.d_Date}
                            className="custom-readonly-textfield"
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
                              {designation
                                .filter((d) => d.pnCompanyId === pnCompanyId)
                                .map((d) => (
                                  <MenuItem
                                    key={d.pnDesignationId}
                                    value={d.pnDesignationId}
                                  >
                                    {d.vDesignationName}
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
                                .filter((e) => e.pnCompanyId === pnCompanyId)
                                .map((e) => (
                                  <MenuItem
                                    key={e.pnDepartmentId}
                                    value={e.pnDepartmentId}
                                  >
                                    {e.vDepartmentName}
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
                              disabled={isViewMode} // <--- disables in view mode
                              sx={{ height: "50px" }}
                            >
                              <MenuItem value="">Select</MenuItem>
                              {division
                                .filter((e) => e.pnCompanyId === pnCompanyId)
                                .map((e) => (
                                  <MenuItem
                                    key={e.pnDivisionId}
                                    value={e.pnDivisionId}
                                  >
                                    {e.vDivisionName}
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
                              disabled={isViewMode} // disables dropdown in view mode
                              sx={{ height: "50px" }}
                            >
                              <MenuItem value="">Select</MenuItem>
                              {grade
                                .filter((e) => e.pnCompanyId === pnCompanyId)
                                .map((e) => (
                                  <MenuItem
                                    key={e.pnGradeId}
                                    value={e.pnGradeId}
                                  >
                                    {e.vGradeName}
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
                              disabled={isViewMode} // disables dropdown in view mode
                              sx={{ height: "50px" }}
                            >
                              <MenuItem value="">Select</MenuItem>
                              {shift
                                .filter((e) => e.pn_CompanyID === pnCompanyId)
                                .map((e) => (
                                  <MenuItem
                                    key={e.pn_ShiftID}
                                    value={e.pn_ShiftID}
                                  >
                                    {e.shift_Type}
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
                              {category
                                .filter((e) => e.pnCompanyId === pnCompanyId)
                                .map((e) => (
                                  <MenuItem
                                    key={e.pnCategoryId}
                                    value={e.pnCategoryId}
                                  >
                                    {e.vCategoryName}
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
                              disabled={isViewMode} // disables the dropdown in view mode
                              sx={{ height: "50px" }}
                            >
                              <MenuItem value="">Select</MenuItem>
                              {jobstatus
                                .filter((e) => e.pnCompanyId === pnCompanyId)
                                .map((e) => (
                                  <MenuItem
                                    key={e.pnJobStatusId}
                                    value={e.pnJobStatusId}
                                  >
                                    {e.vJobStatusName}
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
                              disabled={isViewMode} // disables dropdown in view mode
                              sx={{ height: "50px" }}
                            >
                              <MenuItem value="">Select</MenuItem>
                              {level
                                .filter((e) => e.pnCompanyId === pnCompanyId)
                                .map((e) => (
                                  <MenuItem
                                    key={e.pnLevelId}
                                    value={e.pnLevelId}
                                  >
                                    {e.vLevelName}
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
                              name="vReason"
                              label="Reason"
                              value={formData.vReason || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  vReason: e.target.value,
                                })
                              }
                              required
                              error={!!formErrors.vReason}
                              helperText={formErrors.vReason}
                              className="custom-readonly-textfield"
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth>
                            <TextField
                              name="rDepartment"
                              label="Reporting Department"
                              value={formData.rDepartment || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  rDepartment: e.target.value,
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
                                  rDepartment: error,
                                }));
                              }}
                              error={!!formErrors.rDepartment}
                              helperText={formErrors.rDepartment}
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
                            {filteredByName
                              .filter(
                                (asset) =>
                                  !usedSerialNumbers.includes(
                                    asset.Asset_SerialNumber
                                  )
                              )
                              .map((asset) => (
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
                      onClick={handleSubmit}
                      type="submit"
                      style={{
                        padding: "10px 20px",
                        borderRadius: "5px",
                        border: "none",
                        backgroundColor: "#28a745", // Green for finish
                        color: "white",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      save
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
