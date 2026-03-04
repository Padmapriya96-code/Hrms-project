import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Card,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Grid,
  TextField,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Autocomplete,
} from "@mui/material";
import { toast } from "react-toastify";

import { PhotoCamera, Delete } from "@mui/icons-material";
import { useFormik } from "formik";
import * as yup from "yup";
import Navbar from "../Home Page-comapny/Navbar1";
import Sidenav from "../Home Page-comapny/Sidenav1";
import { ServerConfig } from "../../serverconfiguration/serverconfig.js";
// import { REPORTS } from "../../serverconfiguration/controllers";
import { postRequest } from "../../serverconfiguration/requestcomp";
import cityStateData from "../../Assets/json/cityStateData.json";
import { getRequest } from "../../serverconfiguration/requestcomp";

// Validation schema
const validationSchema = yup.object({
  CompanyName: yup.string().required("Company Name is required"),
  CompanyCode: yup.string().required("Company Code is required"),
  AddressLine1: yup.string().required("Address Line 1 is required"),
  AddressLine2: yup.string().required("Address Line 2 is required"),
  City: yup.string().required("City is required"),
  State: yup.string().required("State is required"),
  Country: yup.string().required("Country is required"),
  ZipCode: yup.string().required("ZipCode is required"),
  PhoneNo: yup.string().required("Phone No is required"),
  FaxNo: yup.string().required("Fax No is required"),
  EmailId: yup.string().email("Invalid email").required("Email is required"),
  AlternateEmailId: yup.string().nullable(),
  CompanyUserId: yup.string().required("Company User Id is required"),
  CompanyPassword: yup.string().required("Company Password is required"),
  GSTNumber: yup.string().required("GST Number is required"),
  WebsiteURL: yup
    .string()
    .required("Website URL is required")
    .test("is-valid-url", "Invalid URL", (value) => {
      if (!value) return false;

      // Allow user to type: www.mi.com, mi.com, https://mi.com, etc.
      const url = value.trim().toLowerCase();

      return (
        url.startsWith("http://") ||
        url.startsWith("https://") ||
        url.startsWith("www.") ||
        /^[a-z0-9.-]+\.[a-z]{2,}$/.test(url) // mi.com, redmi.in, etc.
      );
    }),

  ContactPerson: yup.string().required("Contact Person is required"),
  StartDate: yup.string().required("Start Date is required"),
  EndDate: yup.string().required("End Date is required"),
});

const CompanyMasters1 = () => {
  const [companies, setCompanies] = useState([]);
  const [editData, setEditData] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [viewData, setViewData] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const isLoggedin = sessionStorage.getItem("user");
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedState, setSelectedState] = useState("");

  useEffect(() => {
    if (cityStateData?.states) {
      setStates(cityStateData.states.map((s) => s.state));
    }
  }, []);

  const handleStateChange = (event, value) => {
    setSelectedState(value || "");
    const found = cityStateData.states.find((s) => s.state === value);
    setDistricts(found ? found.districts : []);
    f.setFieldValue("State", value || "");
    f.setFieldValue("City", ""); // clear city when state changes
  };

  const handleDistrictChange = (event, value) => {
    f.setFieldValue("City", value || "");
  };

  

  // const fetchCompanies = async () => {
  //   try {
  //     const isLoggedin = sessionStorage.getItem("user");
  //     const databaseName = sessionStorage.getItem("databaseName"); // ✅ Get DB name from session

  //     if (!isLoggedin || !databaseName) {
  //       console.warn("Missing user or database name in sessionStorage.");
  //       return;
  //     }

  //     // ✅ Dynamic SQL query using the database name
  //     const query = `
  //     SELECT 
  //       [pn_CompanyID], 
  //       [CompanyCode], 
  //       [CompanyName], 
  //       [Address_Line1], 
  //       [Address_Line2], 
  //       [City], 
  //       [ZipCode], 
  //       [Country], 
  //       [State], 
  //       [Phone_No], 
  //       [Fax_No], 
  //       [Email_Id], 
  //       [AlternateEmail_Id], 
  //       [start_date], 
  //       [end_date], 
  //       [Company_User_Id], 
  //       [Company_Password], 
  //       [GSTNumber], 
  //       [WebsiteURL], 
  //       [ContactPerson], 
  //       [CompanyLogo]
  //     FROM [${databaseName}].[dbo].[paym_Company]
  //     WHERE Company_User_Id = '${isLoggedin}';
  //   `;

  //     const res = await postRequest(ServerConfig.url, REPORTS, { query });

  //     // ✅ Normalize result structure
  //     const normalize = (data) => {
  //       const safeString = (v) => (v && typeof v === "string" ? v : ""); // ✅ ensures string only

  //       return {
  //         PnCompanyId: data.pn_CompanyID ?? 0,
  //         CompanyName: safeString(data.CompanyName),
  //         CompanyCode: safeString(data.CompanyCode),
  //         AddressLine1: safeString(data.Address_Line1),
  //         AddressLine2: safeString(data.Address_Line2),
  //         City: safeString(data.City),
  //         State: safeString(data.State),
  //         Country: safeString(data.Country),
  //         ZipCode: safeString(data.ZipCode),
  //         PhoneNo: safeString(data.Phone_No),
  //         FaxNo: safeString(data.Fax_No),
  //         EmailId: safeString(data.Email_Id),
  //         AlternateEmailId: safeString(data.AlternateEmail_Id),
  //         GSTNumber: safeString(data.GSTNumber),
  //         ContactPerson: safeString(data.ContactPerson),
  //         WebsiteURL: safeString(data.WebsiteURL),
  //         StartDate:
  //           typeof data.start_date === "string"
  //             ? data.start_date.split("T")[0]
  //             : "",
  //         EndDate:
  //           typeof data.end_date === "string"
  //             ? data.end_date.split("T")[0]
  //             : "",
  //         CompanyUserId: safeString(data.Company_User_Id),
  //         CompanyPassword: safeString(data.Company_Password),
  //         CompanyLogo:
  //           data.CompanyLogo && typeof data.CompanyLogo === "string"
  //             ? data.CompanyLogo
  //             : null,
  //       };
  //     };

  //     // ✅ Set state with normalized results
  //     setCompanies(Array.isArray(res.data) ? res.data.map(normalize) : []);
  //   } catch (err) {
  //     console.error("Error fetching companies:", err);
  //   }
  // };

  // useEffect(() => {
  //   fetchCompanies();
  // }, []);
 const authStr = sessionStorage.getItem("auth");
const auth = authStr ? JSON.parse(authStr) : null;
const token = auth?.token?.replace(/^"|"$/g, '');


  const fetchCompanies = async () => {
  try {
    
    // 1. Get user
    const authStr= sessionStorage.getItem("auth");
    if (!authStr) {toast.error("User is not logged in");
    return;
    }

    
     
    // 2. Build controller
    const controller = `PaymCompanies/by-user`;
    const res = await getRequest(controller, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
     console.log("BY-USER API DATA:", res.data);
    // 4. Normalize function
    const normalize = (data) => ({
      PnCompanyId: data.pnCompanyId ?? 0,
      CompanyName: data.companyName ?? "",
      CompanyCode: data.companyCode ?? "",
      AddressLine1: data.addressLine1 ?? "",
      AddressLine2: data.addressLine2 ?? "",
      City: data.city ?? "",
      State: data.state ?? "",
      Country: data.country ?? "",
      ZipCode: data.zipCode ?? "",
      PhoneNo: data.phoneNo ?? "",
      FaxNo: data.faxNo ?? "",
      EmailId: data.emailId ?? "",
      AlternateEmailId: data.alternateEmailId ?? "",
      GSTNumber: data.gstNumber ?? "",
      ContactPerson: data.contactPerson ?? "",
      WebsiteURL: data.websiteURL ?? "",
      StartDate: data.startDate?.split("T")[0] ?? "",
      EndDate: data.endDate?.split("T")[0] ?? "",
      CompanyUserId: data.companyUserId ?? "",
      CompanyLogo: data.companyLogo ?? null,
    });

    // 5. Set state
    setCompanies(Array.isArray(res.data) ? res.data.map(normalize) : []);

  } catch (err) {
  console.log("---- FETCH COMPANIES ERROR ----");

  if (err.response) {
    console.log("STATUS:", err.response.status);
    console.log("DATA:", err.response.data);
    console.log("HEADERS:", err.response.headers);
  } else if (err.request) {
    console.log("NO RESPONSE FROM SERVER");
  } else {
    console.log("ERROR MESSAGE:", err.message);
  }
}

};

useEffect(() => {
  fetchCompanies();
}, []);


  // --- Helpers for Formik initial values ---
  const toForm = (d) => {
    d = d || {}; // ensure it's not null
    return {
      PnCompanyId: d.PnCompanyId || 0,
      CompanyName: d.CompanyName || "",
      CompanyCode: d.CompanyCode || "",
      AddressLine1: d.AddressLine1 || "",
      AddressLine2: d.AddressLine2 || "",
      City: d.City || "",
      State: d.State || "",
      Country: d.Country || "India",
      ZipCode: d.ZipCode || "",
      PhoneNo: d.PhoneNo || "",
      FaxNo: d.FaxNo || "",
      EmailId: d.EmailId || "",
      AlternateEmailId: d.AlternateEmailId || "",
      StartDate: d.StartDate || "",
      EndDate: d.EndDate || "",
      CompanyUserId: d.CompanyUserId || "",
      CompanyPassword: d.CompanyPassword || "",
      GSTNumber: d.GSTNumber || "",
      WebsiteURL: d.WebsiteURL || "",
      ContactPerson: d.ContactPerson || "",
      CompanyLogo: d.CompanyLogo || null,
    };
  };

  const toApi = (v) => ({
    PnCompanyId: v.PnCompanyId || 0,
    CompanyName: v.CompanyName || null,
    CompanyCode: v.CompanyCode || null,
    AddressLine1: v.AddressLine1 || null,
    AddressLine2: v.AddressLine2 || null,
    City: v.City || null,
    State: v.State || null,
    Country: v.Country || null,
    ZipCode: v.ZipCode || null,
    PhoneNo: v.PhoneNo || null,
    FaxNo: v.FaxNo || null,
    EmailId: v.EmailId || null,
    AlternateEmailId: v.AlternateEmailId || null,
    StartDate: v.StartDate ? new Date(v.StartDate).toISOString() : null,
    EndDate: v.EndDate ? new Date(v.EndDate).toISOString() : null,
    CompanyUserId: v.CompanyUserId || null,
    CompanyPassword: v.CompanyPassword || null,
    GSTNumber: v.GSTNumber || null,
    // WebsiteURL: v.WebsiteURL || null,
    WebsiteURL: normalizeUrl(v.WebsiteURL),
    ContactPerson: v.ContactPerson || null,
    CompanyLogo: v.CompanyLogo || null,
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: toForm(editData),
    validationSchema,
    
    
    onSubmit: async (values, { setSubmitting, resetForm }) => {
  try {
    const payload = toApi(values);
 

    // UPDATE
    if (payload.PnCompanyId && payload.PnCompanyId > 0) {
      await axios.put(
        `https://localhost:7266/api/PaymCompanies/${payload.PnCompanyId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );

      toast.success("Company updated successfully!");
    }
    // CREATE
    else {
      await axios.post(
        `https://localhost:7266/api/PaymCompanies`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`
            // "X-Database-Name": databaseName,
          },
        }
      );

      toast.success("Company saved successfully!");
    }

    fetchCompanies();   // reload table
    setEditData(null);  // clear edit
    setTabValue(0);     // go back to list
    resetForm();
  } catch (err) {
    console.error("Save failed:", err);
    toast.error("Failed to save company");
  } finally {
    setSubmitting(false);
  }
}

  });

  const fetchLocationDetails = async (zipcode) => {
    if (!zipcode || zipcode.length !== 6) return; // only trigger on valid 6-digit codes
    try {
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${zipcode}`
      );
      const data = response.data;
      if (data.length > 0 && data[0].Status === "Success") {
        const locationData = data[0];
        formik.setFieldValue("city", locationData.PostOffice[0].District);
        formik.setFieldValue("state", locationData.PostOffice[0].State);
        formik.setFieldValue("country", "India");
      } else {
        toast.error("Invalid Zip Code");
      }
    } catch (error) {
      console.error("Error fetching location details:", error);
      toast.error("Unable to fetch location details");
    }
  };

  const f = formik;
  const err = (n) => Boolean(f.touched[n] && f.errors[n]);
  const help = (n) => (f.touched[n] && f.errors[n]) || " ";

  const tabFields = [
    ["CompanyName", "CompanyCode", "CompanyUserId", "CompanyPassword"],
    ["AddressLine1", "AddressLine2", "City", "State", "ZipCode", "Country"],
    ["PhoneNo", "FaxNo", "EmailId", "AlternateEmailId"],
    ["GSTNumber", "WebsiteURL", "ContactPerson", "StartDate", "EndDate"],
  ];

  const validateCurrentTab = async () => {
    await f.validateForm();
    const touched = {};
    tabFields[tabValue].forEach((k) => (touched[k] = true));
    f.setTouched({ ...f.touched, ...touched }, false);
    const hasErrors = tabFields[tabValue].some((k) => !!f.errors[k]);
    return !hasErrors;
  };

  const handleNext = async () => {
    const ok = await validateCurrentTab();
    if (!ok) return;
    setTabValue((t) => Math.min(3, t + 1));
  };

  const handleBack = () => setTabValue((t) => Math.max(0, t - 1));

  const handleEdit = (row) => {
    setEditData(row);
    setImagePreview(
      row.CompanyLogo ? `data:image/jpeg;base64,${row.CompanyLogo}` : null
    );
    setTabValue(0);
  };
  //   const handleView = (row) => {
  //   setViewData(row);
  //   setOpenForm(false);
  // };
  const handleView = (id) => {
    setSelectedCompanyId(id);
  };
  const selectedCompany = companies.find(
    (c) => c.PnCompanyId === selectedCompanyId
  );
  // const handleDelete = async (id) => {
  //   if (window.confirm("Are you sure you want to delete this company?")) {
  //     try {
  //       const query = `DELETE FROM paym_Company WHERE pn_CompanyID=${id}`;
  //       await postRequest(ServerConfig.url, REPORTS, { query });
  //       fetchCompanies();
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   }
  // };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      try {
       await axios.delete(`https://localhost:7266/api/PaymCompanies/${id}`,
        {
          headers:{
            Authorization:`Bearer ${sessionStorage.getItem("token")}`,
          }
        }
       );
       toast.success("company deleted successfully");
       fetchCompanies();
      } catch (err) {
        console.error("Delete failed:", err);
        toast.error("Error deleting company");
      }
    }
  };

  // const handleFileChange = (e) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;
  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     const base64 = reader.result;
  //     setImagePreview(base64);
  //     const raw = base64.toString().split(",")[1] || base64;
  //     f.setFieldValue("CompanyLogo", raw);
  //   };
  //   reader.readAsDataURL(file);
  // };
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, JPEG, PNG, GIF allowed");
      return;
    }

    // Preview image
    setImagePreview(URL.createObjectURL(file));

    // Convert to base64 RAW (without prefix)
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(",")[1]; // ALWAYS RAW
      f.setFieldValue("CompanyLogo", base64);
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteImage = () => {
    setImagePreview(null);
    f.setFieldValue("CompanyLogo", null);
  };

  const normalizeUrl = (val) => {
    if (!val) return "";
    let url = val.trim();

    if (url.startsWith("www.")) url = "https://" + url;

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    return url;
  };

  // const generateCompanyCode = (name) => {
  //   if (!name) return "";
  //   const prefix = name.substring(0, 3).toUpperCase();
  //   const randomNum = Math.floor(100 + Math.random() * 900); // random 3-digit number
  //   return `${prefix}${randomNum}`;
  // };

  const generateCompanyCode = (name) => {
    if (!name) return "";
    const prefix = name.substring(0, 3).toUpperCase();
    const randomNum = Math.floor(100 + Math.random() * 900); // random 3-digit number
    return `${prefix}${randomNum}`;
  };
  // useEffect(() => {
  //   // Only run when editing company and name is available
  //   if (editData?.CompanyName && !f.values.CompanyCode) {
  //     const name = editData.CompanyName;
  //     const prefix = name.substring(0, 3).toUpperCase();
  //     const randomNum = Math.floor(100 + Math.random() * 900);
  //     const code = `${prefix}${randomNum}`;
  //     f.setFieldValue("CompanyCode", code);
  //   }
  // }, [editData, f]);
  // useEffect(() => {
  //   if (!editData) return;

  //   // EDIT mode → Do NOT generate if company has existing code
  //   if (editData.PnCompanyId && editData.CompanyCode) {
  //     return; // stop here
  //   }

  //   // ADD mode → generate only once when CompanyName is typed
  //   if (
  //     !editData.PnCompanyId &&
  //     f.values.CompanyName &&
  //     !f.values.CompanyCode
  //   ) {
  //     const prefix = f.values.CompanyName.substring(0, 3).toUpperCase();
  //     const randomNum = Math.floor(100 + Math.random() * 900);
  //     f.setFieldValue("CompanyCode", `${prefix}${randomNum}`);
  //   }
  // }, [editData, f.values.CompanyName]);

  // Auto-generate Company Code only ONCE when ADDING a new company
  useEffect(() => {
  // EDIT mode (always true in your case)
  if (editData) {
    // If CompanyCode already exists → DO NOT generate
    if (editData.CompanyCode) {
      f.setFieldValue("CompanyCode", editData.CompanyCode);
      return;
    }

    // If CompanyCode is empty (first edit) → generate code
    if (!f.values.CompanyCode) {
      const name = editData.CompanyName || f.values.CompanyName;
      if (name) {
        const prefix = name.substring(0, 3).toUpperCase();
        const randomNum = Math.floor(100 + Math.random() * 900);
        f.setFieldValue("CompanyCode", `${prefix}${randomNum}`);
      }
    }
  }
}, [editData, f.values.CompanyName]);


  const safe = (v) =>
    v === null || v === undefined ? "" : typeof v === "object" ? "" : String(v);

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Navbar />
        {/* <Toolbar>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            COMPANY MASTER
          </Typography>
        </Toolbar> */}
      </AppBar>

      <Box sx={{ display: "flex", pt: 8 }}>
        <Box component="nav" sx={{ width: 240, flexShrink: 0 }}>
          <Sidenav />
        </Box>

        <Box
          component="main"
          sx={{ flexGrow: 1, width: { sm: `calc(100% - 240px)` }, p: 3 }}
        >
          <Container maxWidth="lg">
            {/* Card for table and button */}
            <Card sx={{ mb: 3, p: 2 }}>
              {/* Header with Add button on right */}
              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                {(!companies || companies.length === 0) && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setEditData({})}
                  >
                    + Add Company
                  </Button>
                )}
              </Box>

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Company Code</TableCell>
                    <TableCell>Company Name</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>City</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {companies.map((row) => (
                    <TableRow key={row.PnCompanyId}>
                      <TableCell>{safe(row.CompanyCode)}</TableCell>
                      <TableCell>{safe(row.CompanyName)}</TableCell>
                      <TableCell>{safe(row.AddressLine1)}</TableCell>
                      <TableCell>{safe(row.City)}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleEdit(row)}
                          sx={{ mr: 1 }}
                        >
                          Edit
                        </Button>

                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleView(row.PnCompanyId)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
            {/* <Dialog open={Boolean(viewData)} onClose={() => setViewData(null)} fullWidth maxWidth="md">
                <DialogTitle>Company Details</DialogTitle>
                <DialogContent dividers>
                  {viewData && (
                    <Grid container spacing={2}>
                      <Grid item xs={6}><Typography><strong>Name:</strong> {viewData.CompanyName}</Typography></Grid>
                      <Grid item xs={6}><Typography><strong>Code:</strong> {viewData.CompanyCode}</Typography></Grid>
                      <Grid item xs={6}><Typography><strong>Address 1:</strong> {viewData.Address_Line1}</Typography></Grid>
                      <Grid item xs={6}><Typography><strong>Address 2:</strong> {viewData.Address_Line2}</Typography></Grid>
                      <Grid item xs={6}><Typography><strong>City:</strong> {viewData.City}</Typography></Grid>
                      <Grid item xs={6}><Typography><strong>State:</strong> {viewData.State}</Typography></Grid>
                      <Grid item xs={6}><Typography><strong>Country:</strong> {viewData.Country}</Typography></Grid>
                      <Grid item xs={6}><Typography><strong>Zip:</strong> {viewData.ZipCode}</Typography></Grid>
                      <Grid item xs={6}><Typography><strong>Phone:</strong> {viewData.Phone_No}</Typography></Grid>
                      <Grid item xs={6}><Typography><strong>Email:</strong> {viewData.Email_Id}</Typography></Grid>
                      <Grid item xs={6}><Typography><strong>GST:</strong> {viewData.GSTNumber}</Typography></Grid>
                      <Grid item xs={6}><Typography><strong>Contact Person:</strong> {viewData.ContactPerson}</Typography></Grid>
                      <Grid item xs={6}><Typography><strong>Website:</strong> {viewData.WebsiteURL}</Typography></Grid>
                      <Grid item xs={6}><Typography><strong>Start Date:</strong> {viewData.start_date}</Typography></Grid>
                      <Grid item xs={6}><Typography><strong>End Date:</strong> {viewData.end_date}</Typography></Grid>
                      <Grid item xs={6}><Typography><strong>User ID:</strong> {viewData.Company_User_Id}</Typography></Grid>
                      <Grid item xs={6} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {viewData.CompanyLogo && (
                          <Avatar src={`data:image/jpeg;base64,${viewData.CompanyLogo}`} alt="logo" sx={{ width: 80, height: 80 }} />
                        )}
                        <Typography><strong>Logo</strong></Typography>
                      </Grid>
                    </Grid>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setViewData(null)} color="primary" variant="contained">Close</Button>
                </DialogActions>
              </Dialog> */}

            {/* NEED TO REWORK THIS */}
            {/* <Dialog
              open={Boolean(selectedCompany)}
              onClose={() => setSelectedCompanyId(null)}
              fullWidth
              maxWidth="md"
            >
              <DialogTitle>Company Details</DialogTitle>
              <DialogContent dividers>
                {selectedCompany && (
                  <Grid container spacing={2}>
                    {/* {Object.entries(selectedCompany).map(([key, value]) => {
                      if (key === "CompanyLogo") return null; // skip logo here
                      let displayValue = "";

                      if (value === null || value === undefined) {
                        displayValue = "";
                      } else if (typeof value === "object") {
                        // If value is Date or any object, convert safely
                        displayValue =
                          value instanceof Date
                            ? value.toISOString().split("T")[0]
                            : JSON.stringify(value);
                      } else {
                        displayValue = value;
                      }

                      return (
                        <Grid item xs={6} key={key}>
                          <Typography>
                            <strong>{key.replace(/([A-Z])/g, " $1")}:</strong>{" "}
                            {displayValue}
                          </Typography>
                        </Grid>
                      );
                    })} 

                    {Object.entries(selectedCompany).map(([key, value]) => {
                      if (key === "CompanyLogo") return null; // Skip logo field

                      let displayValue = "";

                      if (value === null || value === undefined)
                        displayValue = "";
                      else if (value instanceof Date)
                        displayValue = value.toISOString().split("T")[0];
                      else if (typeof value === "object")
                        displayValue = ""; // <-- IMPORTANT FIX
                      else displayValue = String(value);

                      return (
                        <Grid item xs={6} key={key}>
                          <Typography>
                            <strong>{key.replace(/([A-Z])/g, " $1")}:</strong>{" "}
                            {displayValue}
                          </Typography>
                        </Grid>
                      );
                    })}

                    {/* Render Logo separately 
                    {selectedCompany.CompanyLogo && (
                      <Grid
                        item
                        xs={6}
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Avatar
                          src={`data:image/jpeg;base64,${selectedCompany.CompanyLogo}`}
                          alt="logo"
                          sx={{ width: 80, height: 80 }}
                        />
                        <Typography>
                          <strong>Logo</strong>
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                )}
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => setSelectedCompanyId(null)}
                  color="primary"
                  variant="contained"
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog> */}

            <Dialog
              open={Boolean(selectedCompany)}
              onClose={() => setSelectedCompanyId(null)}
              fullWidth
              maxWidth="md"
            >
              <DialogTitle>Company Details</DialogTitle>

              <DialogContent dividers>
                {selectedCompany && (
                  <Grid container spacing={2}>
                    {Object.entries(selectedCompany).map(([key, value]) => {
                      if (key === "CompanyLogo") return null;

                      let displayValue =
                        value === null || value === undefined
                          ? ""
                          : typeof value === "object"
                          ? ""
                          : String(value);

                      return (
                        <Grid item xs={6} key={key}>
                          <Typography>
                            <strong>{key.replace(/([A-Z])/g, " $1")}:</strong>{" "}
                            {displayValue}
                          </Typography>
                        </Grid>
                      );
                    })}

                    {selectedCompany.CompanyLogo && (
                      <Grid
                        item
                        xs={6}
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar
                          src={`data:image/jpeg;base64,${selectedCompany.CompanyLogo}`}
                          sx={{ width: 80, height: 80 }}
                        />
                        <Typography>
                          <strong>Logo</strong>
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                )}
              </DialogContent>

              <DialogActions>
                <Button
                  onClick={() => setSelectedCompanyId(null)}
                  variant="contained"
                  color="primary"
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog>

            {/* Inline Form */}
            {editData && (
              <Card sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {editData.PnCompanyId ? "Edit Company" : "Add Company"}
                </Typography>

                <Tabs
                  value={tabValue}
                  onChange={(_, nv) => setTabValue(nv)}
                  sx={{ mb: 2 }}
                >
                  <Tab label="General Info" />
                  <Tab label="Address" />
                  <Tab label="Contact" />
                  <Tab label="Additional" />
                </Tabs>

                <Box component="form" onSubmit={f.handleSubmit}>
                  {tabValue === 0 && (
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        {/* <TextField
                          label="Company Name"
                          name="CompanyName"
                          value={f.values.CompanyName}
                          onChange={f.handleChange}
                          onBlur={f.handleBlur}
                          error={err("CompanyName")}
                          helperText={help("CompanyName")}
                          fullWidth
                        /> */}
                        <TextField
                          label="Company Name"
                          name="CompanyName"
                          value={f.values.CompanyName}
                          onChange={f.handleChange}
                          onBlur={f.handleBlur}
                          error={err("CompanyName")}
                          helperText={help("CompanyName")}
                          fullWidth
                          disabled
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Company Code"
                          name="CompanyCode"
                          value={f.values.CompanyCode}
                          onChange={f.handleChange}
                          onBlur={f.handleBlur}
                          error={err("CompanyCode")}
                          helperText={help("CompanyCode")}
                          fullWidth
                        />

                        {/* <TextField
                          label="Company Code"
                          name="CompanyCode"
                          value={f.values.CompanyCode}
                          onChange={f.handleChange}
                          fullWidth
                          // InputProps={{ readOnly: true }} // optional: make it read-only
                        /> */}
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Company User Id"
                          name="CompanyUserId"
                          value={f.values.CompanyUserId}
                          onChange={f.handleChange}
                          onBlur={f.handleBlur}
                          error={err("CompanyUserId")}
                          helperText={help("CompanyUserId")}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Company Password"
                          name="CompanyPassword"
                          type="password"
                         
                          value={f.values.CompanyPassword}
                          onChange={f.handleChange}
                          onBlur={f.handleBlur}
                          error={err("CompanyPassword")}
                          helperText={help("CompanyPassword")}
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                  )}

                  {tabValue === 1 && (
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          label="Address Line 1"
                          name="AddressLine1"
                          value={f.values.AddressLine1}
                          onChange={f.handleChange}
                          onBlur={f.handleBlur}
                          error={err("AddressLine1")}
                          helperText={help("AddressLine1")}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Address Line 2"
                          name="AddressLine2"
                          value={f.values.AddressLine2}
                          onChange={f.handleChange}
                          onBlur={f.handleBlur}
                          error={err("AddressLine2")}
                          helperText={help("AddressLine2")}
                          fullWidth
                        />
                      </Grid>

                      {/* STATE Autocomplete */}
                      {/* <Grid item xs={4}>
                        <Autocomplete
                          freeSolo
                          options={cityStateData.map((item) => item.state)}
                          value={f.values.State || ""}
                          onChange={(event, newValue) => {
                            f.setFieldValue("State", newValue || "");
                            // Reset City when state changes
                            f.setFieldValue("City", "");
                          }}
                          onInputChange={(event, newInputValue) => {
                            f.setFieldValue("State", newInputValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="State"
                              error={err("State")}
                              helperText={help("State")}
                              fullWidth
                            />
                          )}
                        />
                      </Grid>

                      {/* CITY Autocomplete 
                      <Grid item xs={4}>
                        <Autocomplete
                          freeSolo
                          options={
                            f.values.State
                              ? cityStateData.find(
                                  (item) =>
                                    item.state.toLowerCase() ===
                                    f.values.State.toLowerCase()
                                )?.cities || []
                              : cityStateData.flatMap((item) => item.cities)
                          }
                          value={f.values.City || ""}
                          onChange={(event, newValue) => {
                            f.setFieldValue("City", newValue || "");
                            if (newValue) {
                              const foundState = cityStateData.find((item) =>
                                item.cities.some(
                                  (city) =>
                                    city.toLowerCase() ===
                                    newValue.toLowerCase()
                                )
                              );
                              if (foundState)
                                f.setFieldValue("State", foundState.state);
                            }
                          }}
                          onInputChange={(event, newInputValue) => {
                            f.setFieldValue("City", newInputValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="City"
                              error={err("City")}
                              helperText={help("City")}
                              fullWidth
                            />
                          )}
                        />
                      </Grid> */}

                      <Grid item xs={12} sm={6}>
                        <Autocomplete
                          options={states}
                          value={f.values.State || ""}
                          onChange={handleStateChange}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="State"
                              fullWidth
                              error={err("State")}
                              helperText={help("State")}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Autocomplete
                          options={districts}
                          value={f.values.City || ""}
                          onChange={handleDistrictChange}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="District / City"
                              fullWidth
                              error={err("City")}
                              helperText={help("City")}
                            />
                          )}
                        />
                      </Grid>

                      {/* COUNTRY */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Country"
                          name="Country"
                          value={f.values.Country || "India"}
                          onChange={(e) =>
                            f.setFieldValue("Country", e.target.value)
                          }
                          fullWidth
                          error={err("Country")}
                          helperText={help("Country")}
                        />
                      </Grid>
                      {/* ZIP Field */}
                      <Grid item xs={6}>
                        <TextField
                          label="Zip Code"
                          name="ZipCode"
                          value={f.values.ZipCode}
                          onChange={(e) => {
                            const value = e.target.value;
                            f.setFieldValue("ZipCode", value);
                            if (value.length === 6) fetchLocationDetails(value);
                          }}
                          onBlur={f.handleBlur}
                          error={err("ZipCode")}
                          helperText={help("ZipCode")}
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                  )}
                  {tabValue === 2 && (
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          label="Phone No"
                          name="PhoneNo"
                          value={f.values.PhoneNo}
                          onChange={f.handleChange}
                          onBlur={f.handleBlur}
                          error={err("PhoneNo")}
                          helperText={help("PhoneNo")}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Fax No"
                          name="FaxNo"
                          value={f.values.FaxNo}
                          onChange={f.handleChange}
                          onBlur={f.handleBlur}
                          error={err("FaxNo")}
                          helperText={help("FaxNo")}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Email Id"
                          name="EmailId"
                          value={f.values.EmailId}
                          onChange={f.handleChange}
                          onBlur={f.handleBlur}
                          error={err("EmailId")}
                          helperText={help("EmailId")}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Alternate Email Id"
                          name="AlternateEmailId"
                          value={f.values.AlternateEmailId}
                          onChange={f.handleChange}
                          onBlur={f.handleBlur}
                          error={err("AlternateEmailId")}
                          helperText={help("AlternateEmailId")}
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                  )}
                  {tabValue === 3 && (
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          label="GST Number"
                          name="GSTNumber"
                          value={f.values.GSTNumber}
                          onChange={f.handleChange}
                          onBlur={f.handleBlur}
                          error={err("GSTNumber")}
                          helperText={help("GSTNumber")}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Website URL"
                          name="WebsiteURL"
                          value={f.values.WebsiteURL}
                          onChange={f.handleChange}
                          onBlur={f.handleBlur}
                          error={err("WebsiteURL")}
                          helperText={help("WebsiteURL")}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Contact Person"
                          name="ContactPerson"
                          value={f.values.ContactPerson}
                          onChange={f.handleChange}
                          onBlur={f.handleBlur}
                          error={err("ContactPerson")}
                          helperText={help("ContactPerson")}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField
                          label="Start Date"
                          name="StartDate"
                          type="date"
                          value={f.values.StartDate}
                          onChange={f.handleChange}
                          onBlur={f.handleBlur}
                          error={err("StartDate")}
                          helperText={help("StartDate")}
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField
                          label="End Date"
                          name="EndDate"
                          type="date"
                          value={f.values.EndDate}
                          onChange={f.handleChange}
                          onBlur={f.handleBlur}
                          error={err("EndDate")}
                          helperText={help("EndDate")}
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            mt: 1,
                          }}
                        >
                          {imagePreview && (
                            <Avatar
                              src={imagePreview}
                              sx={{ width: 80, height: 80 }}
                            />
                          )}
                          <Button
                            variant="contained"
                            component="label"
                            startIcon={<PhotoCamera />}
                          >
                            Upload Logo
                            <input
                              hidden
                              type="file"
                              onChange={handleFileChange}
                            />
                          </Button>
                          {imagePreview && (
                            <IconButton
                              color="error"
                              onClick={handleDeleteImage}
                            >
                              <Delete />
                            </IconButton>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  )}
                  <Box
                    sx={{
                      mt: 3,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button disabled={tabValue === 0} onClick={handleBack}>
                      Back
                    </Button>
                    {tabValue < 3 && <Button onClick={handleNext}>Next</Button>}
                    {tabValue === 3 && (
                      <Button variant="contained" color="primary" type="submit">
                        Save
                      </Button>
                    )}
                  </Box>
                </Box>
              </Card>
            )}
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default CompanyMasters1;

// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Container,
//   AppBar,
//   Toolbar,
//   Typography,
//   Card,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Button,
//   Grid,
//   TextField,
//   Tabs,
//   Tab,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
// } from "@mui/material";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { postRequest } from "../../serverconfiguration/requestcomp";
// import { ServerConfig } from "../../serverconfiguration/serverconfig";

// export default function CompanyMasters1() {
//   const [companies, setCompanies] = useState([]);
//   const [selectedCompany, setSelectedCompany] = useState(null);
//   const [open, setOpen] = useState(false);
//   const [tabValue, setTabValue] = useState(0);

//   // ✅ Assume login username is stored in localStorage/session after login
//   const loggedInUsername = localStorage.getItem("username");

//   const fetchCompanyData = async () => {
//     if (!loggedInUsername) return;
//     try {
//       const payload = {
//         query: `SELECT [pn_CompanyID], [CompanyCode], [CompanyName], [Address_Line1], [Address_Line2], [City], [ZipCode],
//                        [Country], [State], [Phone_No], [Fax_No], [Email_Id], [AlternateEmail_Id], [start_date], [end_date],
//                        [Company_User_Id], [Company_Password], [GSTNumber], [WebsiteURL], [ContactPerson], [CompanyLogo]
//                 FROM [dbo].[paym_Company]
//                 WHERE Company_User_Id = '${loggedInUsername}'`,
//       };
//       const response = await postRequest(ServerConfig.url, payload);
//       setCompanies(response || []);
//     } catch (error) {
//       console.error("Error fetching company data:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCompanyData();
//   }, []);

//   const handleOpen = (company) => {
//     setSelectedCompany(company || null);
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setSelectedCompany(null);
//     setOpen(false);
//   };

//   const f = useFormik({
//     initialValues: {
//       CompanyCode: "",
//       CompanyName: "",
//       Address_Line1: "",
//       Address_Line2: "",
//       City: "",
//       ZipCode: "",
//       Country: "",
//       State: "",
//       Phone_No: "",
//       Fax_No: "",
//       Email_Id: "",
//       AlternateEmail_Id: "",
//       start_date: "",
//       end_date: "",
//       GSTNumber: "",
//       WebsiteURL: "",
//       ContactPerson: "",
//     },
//     validationSchema: Yup.object({
//       CompanyName: Yup.string().required("Required"),
//       Email_Id: Yup.string().email("Invalid email").required("Required"),
//     }),
//     onSubmit: async (values) => {
//       try {
//         const query = selectedCompany
//           ? `UPDATE [dbo].[paym_Company]
//              SET CompanyName='${values.CompanyName}', Email_Id='${values.Email_Id}'
//              WHERE pn_CompanyID=${selectedCompany.pn_CompanyID}`
//           : `INSERT INTO [dbo].[paym_Company]
//              (CompanyCode, CompanyName, Address_Line1, Company_User_Id, Company_Password)
//              VALUES ('${values.CompanyCode}', '${values.CompanyName}', '${values.Address_Line1}', '${loggedInUsername}', '1234')`;

//         await postRequest(ServerConfig.url, { query });
//         fetchCompanyData();
//         handleClose();
//       } catch (error) {
//         console.error("Error saving company:", error);
//       }
//     },
//   });

//   useEffect(() => {
//     if (selectedCompany) {
//       f.setValues(selectedCompany);
//     } else {
//       f.resetForm();
//     }
//   }, [selectedCompany]);

//   return (
//     <Container maxWidth="lg">
//       <AppBar position="static" color="primary">
//         <Toolbar>
//           <Typography variant="h6">Company Master</Typography>
//         </Toolbar>
//       </AppBar>

//       <Card sx={{ mt: 2, p: 2 }}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Company Code</TableCell>
//               <TableCell>Company Name</TableCell>
//               <TableCell>Email</TableCell>
//               <TableCell>Phone</TableCell>
//               <TableCell>City</TableCell>
//               <TableCell>Action</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {companies.map((c) => (
//               <TableRow key={c.pn_CompanyID}>
//                 <TableCell>{c.CompanyCode}</TableCell>
//                 <TableCell>{c.CompanyName}</TableCell>
//                 <TableCell>{c.Email_Id}</TableCell>
//                 <TableCell>{c.Phone_No}</TableCell>
//                 <TableCell>{c.City}</TableCell>
//                 <TableCell>
//                   <Button variant="outlined" onClick={() => handleOpen(c)}>
//                     Edit
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </Card>

//       <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
//         <DialogTitle>{selectedCompany ? "Edit Company" : "Add Company"}</DialogTitle>
//         <DialogContent>
//           <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
//             <Tab label="General" />
//             <Tab label="Address" />
//             <Tab label="Contact" />
//             <Tab label="Additional" />
//           </Tabs>

//           {/* General Tab */}
//           {tabValue === 0 && (
//             <Grid container spacing={2} sx={{ mt: 1 }}>
//               <Grid item xs={6}>
//                 <TextField
//                   label="Company Code"
//                   name="CompanyCode"
//                   value={f.values.CompanyCode}
//                   onChange={f.handleChange}
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <TextField
//                   label="Company Name"
//                   name="CompanyName"
//                   value={f.values.CompanyName}
//                   onChange={f.handleChange}
//                   fullWidth
//                   error={f.touched.CompanyName && Boolean(f.errors.CompanyName)}
//                   helperText={f.touched.CompanyName && f.errors.CompanyName}
//                 />
//               </Grid>
//             </Grid>
//           )}

//           {/* Address Tab */}
//           {tabValue === 1 && (
//             <Grid container spacing={2} sx={{ mt: 1 }}>
//               <Grid item xs={12}>
//                 <TextField
//                   label="Address Line 1"
//                   name="Address_Line1"
//                   value={f.values.Address_Line1}
//                   onChange={f.handleChange}
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <TextField
//                   label="City"
//                   name="City"
//                   value={f.values.City}
//                   onChange={f.handleChange}
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <TextField
//                   label="Zip Code"
//                   name="ZipCode"
//                   value={f.values.ZipCode}
//                   onChange={f.handleChange}
//                   fullWidth
//                 />
//               </Grid>
//             </Grid>
//           )}

//           {/* Contact Tab */}
//           {tabValue === 2 && (
//             <Grid container spacing={2} sx={{ mt: 1 }}>
//               <Grid item xs={6}>
//                 <TextField
//                   label="Email"
//                   name="Email_Id"
//                   value={f.values.Email_Id}
//                   onChange={f.handleChange}
//                   fullWidth
//                   error={f.touched.Email_Id && Boolean(f.errors.Email_Id)}
//                   helperText={f.touched.Email_Id && f.errors.Email_Id}
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <TextField
//                   label="Phone"
//                   name="Phone_No"
//                   value={f.values.Phone_No}
//                   onChange={f.handleChange}
//                   fullWidth
//                 />
//               </Grid>
//             </Grid>
//           )}

//           {/* Additional Tab */}
//           {tabValue === 3 && (
//             <Grid container spacing={2} sx={{ mt: 1 }}>
//               <Grid item xs={6}>
//                 <TextField
//                   label="GST Number"
//                   name="GSTNumber"
//                   value={f.values.GSTNumber}
//                   onChange={f.handleChange}
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <TextField
//                   label="Website URL"
//                   name="WebsiteURL"
//                   value={f.values.WebsiteURL}
//                   onChange={f.handleChange}
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <TextField
//                   label="Contact Person"
//                   name="ContactPerson"
//                   value={f.values.ContactPerson}
//                   onChange={f.handleChange}
//                   fullWidth
//                 />
//               </Grid>
//             </Grid>
//           )}
//         </DialogContent>

//         <DialogActions>
//           <Button onClick={handleClose}>Cancel</Button>
//           <Button onClick={f.handleSubmit} variant="contained">
//             Save
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Container>
//   );
// }
