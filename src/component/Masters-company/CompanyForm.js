// // src/component/Masters-company/CompanyForm.js
// import React, { useEffect, useState } from "react";
// import {
//   Dialog, DialogTitle, DialogContent, DialogActions,
//   Button, Tabs, Tab, TextField, Grid, Box, Card, IconButton, Typography
// } from "@mui/material";
// import { PhotoCamera, Delete } from "@mui/icons-material";
// import { useFormik } from "formik";
// import * as yup from "yup";
// import axios from "axios";

// // Add this import or definition for ServerConfig
// import { ServerConfig } from "../../serverconfiguration/serverconfig.js"; // Adjust the path as needed
// import { REPORTS } from "../../serverconfiguration/controllers";
// // Add this import or definition for postRequest
// import { postRequest } from "../../serverconfiguration/requestcomp"; // Adjust the path as needed

// // Replace with your icon imports
// // import GeneralInformation from "...";
// // import address from "...";
// // import contact from "...";
// // import additional from "...";

// const API_URL = "https://localhost:7266/api/PaymCompanies";

// const validationSchema = yup.object({
//   CompanyName: yup.string().required("Company Name is required"),
//   CompanyCode: yup.string().required("Company Code is required"),
//   Address_Line1: yup.string().required("Address Line 1 is required"),
//   Address_Line2: yup.string().required("Address Line 2 is required"),
//   City: yup.string().required("City is required"),
//   State: yup.string().required("State is required"),
//   Country: yup.string().required("Country is required"),
//   ZipCode: yup.string().required("ZipCode is required"),
//   Phone_No: yup.string().required("Phone No is required"),
//   Fax_No: yup.string().required("Fax No is required"),
//   Email_Id: yup.string().email("Invalid email").required("Email is required"),
//   AlternateEmail_Id: yup.string().nullable(),
//   Company_User_Id: yup.string().required("Company User Id is required"),
//   Company_Password: yup.string().required("Company Password is required"),
//   GSTNumber: yup.string().required("GST Number is required"),
//   WebsiteURL: yup.string().url("Invalid URL").required("Website URL is required"),
//   ContactPerson: yup.string().required("Contact Person is required"),
//   start_date: yup.string().required("Start Date is required"),
//   end_date: yup.string().required("End Date is required")
// });

// const CompanyForm = ({ open, onClose, fetchCompanies, initialData = {} }) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [companyData, setCompanyData] = useState(null);
//   const [imagePreview, setImagePreview] = useState({});
//   const [tabValue, setTabValue] = useState(0);

//   // --- added: tab helpers and per-tab validation ---
//   const isLastTab = tabValue === 3;
//   const isFirstTab = tabValue === 0;

//   // Group fields by tab for validation before moving next
//   const tabFields = [
//     // tab 0: General Information
//     ["CompanyName", "CompanyCode", "CompanyUserId", "CompanyPassword"],
//     // tab 1: Address Details
//     ["AddressLine1", "AddressLine2", "City", "State", "ZipCode", "Country"],
//     // tab 2: Contact Details
//     ["PhoneNo", "FaxNo", "EmailId", "AlternateEmailId"],
//     // tab 3: Additional Info
//     ["GSTNumber", "WebsiteURL", "ContactPerson", "StartDate", "EndDate"]
//   ];

//   const validateCurrentTab = async () => {
//     await f.validateForm();
//     const touched = {};
//     tabFields[tabValue].forEach((k) => (touched[k] = true));
//     f.setTouched({ ...f.touched, ...touched }, false);
//     const hasErrors = tabFields[tabValue].some((k) => !!f.errors[k]);
//     return !hasErrors;
//   };

//   const handleNext = async () => {
//     const ok = await validateCurrentTab();
//     if (!ok) return;
//     setTabValue((t) => Math.min(3, t + 1));
//   };

//   const handleBack = () => setTabValue((t) => Math.max(0, t - 1));
//   // --- end added code ---

//   const toForm = (d = {}) => ({
//     PnCompanyId: d.PnCompanyId ?? d.pn_CompanyID ?? 0,
//     CompanyLogo: d.CompanyLogo ?? d.companyLogo ?? null,
//     CompanyCode: d.CompanyCode ?? d.companyCode ?? "",
//     CompanyName: d.CompanyName ?? d.companyName ?? "",
//     AddressLine1: d.AddressLine1 ?? d.Address_Line1 ?? "",
//     AddressLine2: d.AddressLine2 ?? d.Address_Line2 ?? "",
//     City: d.City ?? d.city ?? "",
//     ZipCode: d.ZipCode ?? d.zipCode ?? "",
//     Country: d.Country ?? d.country ?? "",
//     State: d.State ?? d.state ?? "",
//     PhoneNo: d.PhoneNo ?? d.phone_No ?? "",
//     FaxNo: d.FaxNo ?? d.fax_No ?? "",
//     EmailId: d.EmailId ?? d.email_Id ?? "",
//     AlternateEmailId: d.AlternateEmailId ?? d.alternateEmail_Id ?? "",
//     StartDate: (d.StartDate ?? d.start_date)?.substring?.(0,10) || "",
//     EndDate: (d.EndDate ?? d.end_date)?.substring?.(0,10) || "",
//     CompanyUserId: d.CompanyUserId ?? d.Company_User_Id ?? "",
//     CompanyPassword: d.CompanyPassword ?? d.Company_Password ?? "",
//     GSTNumber: d.GSTNumber ?? d.gstNumber ?? "",
//     WebsiteURL: d.WebsiteURL ?? d.websiteURL ?? "",
//     ContactPerson: d.ContactPerson ?? d.contactPerson ?? ""
//   });

//   const toApi = (v) => ({
//     PnCompanyId: v.PnCompanyId || 0,
//     CompanyCode: v.CompanyCode || null,
//     CompanyName: v.CompanyName || null,
//     AddressLine1: v.AddressLine1 || null,
//     AddressLine2: v.AddressLine2 || null,
//     City: v.City || null,
//     ZipCode: v.ZipCode || null,
//     Country: v.Country || null,
//     State: v.State || null,
//     PhoneNo: v.PhoneNo || null,
//     FaxNo: v.FaxNo || null,
//     EmailId: v.EmailId || null,
//     AlternateEmailId: v.AlternateEmailId || null,
//     StartDate: v.StartDate ? new Date(v.StartDate).toISOString() : null,
//     EndDate: v.EndDate ? new Date(v.EndDate).toISOString() : null,
//     CompanyUserId: v.CompanyUserId || null,
//     CompanyPassword: v.CompanyPassword || null,
//     GSTNumber: v.GSTNumber || null,
//     WebsiteURL: v.WebsiteURL || null,
//     ContactPerson: v.ContactPerson || null,
//     CompanyLogo: v.CompanyLogo || null // base64 string
//   });

//   const validationSchema = yup.object({
//     CompanyName: yup.string().required("Company Name is required"),
//     CompanyCode: yup.string().required("Company Code is required"),
//     AddressLine1: yup.string().required("Address Line 1 is required"),
//     AddressLine2: yup.string().required("Address Line 2 is required"),
//     City: yup.string().required("City is required"),
//     State: yup.string().required("State is required"),
//     Country: yup.string().required("Country is required"),
//     ZipCode: yup.string().required("ZipCode is required"),
//     PhoneNo: yup.string().required("Phone No is required"),
//     FaxNo: yup.string().required("Fax No is required"),
//     EmailId: yup.string().email("Invalid email").required("Email is required"),
//     AlternateEmailId: yup.string().nullable(),
//     CompanyUserId: yup.string().required("Company User Id is required"),
//     CompanyPassword: yup.string().required("Company Password is required"),
//     GSTNumber: yup.string().required("GST Number is required"),
//     WebsiteURL: yup.string().url("Invalid URL").required("Website URL is required"),
//     ContactPerson: yup.string().required("Contact Person is required"),
//     StartDate: yup.string().required("Start Date is required"),
//     EndDate: yup.string().required("End Date is required")
//   });

//   // const formik = useFormik({
//   //   enableReinitialize: true,
//   //   initialValues: toForm(initialData),
//   //   validationSchema,
//   //   onSubmit: async (values, { setSubmitting }) => {
//   //     try {
//   //       const payload = toApi(values);
//   //       if (values.PnCompanyId) {
//   //         await axios.put(`${API_URL}/${payload.PnCompanyId}`, payload);
//   //       } else {
//   //         await axios.post(API_URL, payload);
//   //       }
//   //       await fetchCompanies();
//   //       onClose();
//   //     } catch (error) {
//   //       console.error("Error saving company:", error);
//   //     } finally {
//   //       setSubmitting(false);
//   //     }
//   //   }
//   // });
//   // const formik = useFormik({
//   //     initialValues: {
//   //       companyName: "",
//   //       companyCode: "",
//   //       addressLine1: "",
//   //       addressLine2: "",
//   //       city: "",
//   //       state: "",
//   //       country: "",
//   //       ZipCode: "",
//   //       phoneNumber: "",
//   //       faxNo: "",
//   //       emailAddress: "",
//   //       alternateEmailAddress: "",
//   //       GSTNumber: "",
//   //       ContactPerson: "",
//   //       WebsiteURL: "",
//   //       startDate: "",
//   //       endDate: "",
//   //       companyUserId: "",
//   //       companyPassword: "",
//   //       CompanyLogo: "",
//   //     },
//   //     validationSchema: validationSchema,
//   //     onSubmit: (values) => {
//   //       companyData(values);
//   //     },
//   //   });

//   const formik = useFormik({
//   enableReinitialize: true,
//   initialValues: toForm(initialData),  // 👈 use correct mapping
//   validationSchema,
//   onSubmit: async (values, { setSubmitting }) => {
//     try {
//       const payload = toApi(values);
//       if (values.PnCompanyId) {
//         await axios.put(`${API_URL}/${payload.PnCompanyId}`, payload);
//       } else {
//         await axios.post(API_URL, payload);
//       }
//       await fetchCompanies();
//       onClose();
//     } catch (error) {
//       console.error("Error saving company:", error);
//     } finally {
//       setSubmitting(false);
//     }
//   },
// });
//   useEffect(() => {
//   if (companyData) {
//     formik.setValues(toForm(companyData));
//   }
// }, [companyData]);


//   // image preview from base64 or upload
//   useEffect(() => {
//     if (formik.values.CompanyLogo) {
//       if (
//         (typeof formik.values.CompanyLogo === "string" && formik.values.CompanyLogo.startsWith("/9j")) ||
//         (typeof formik.values.CompanyLogo === "string" && formik.values.CompanyLogo.startsWith("iVB"))
//       ) {
//         setImagePreview(`data:image/*;base64,${formik.values.CompanyLogo}`);
//       } else if (typeof formik.values.CompanyLogo === "string" && formik.values.CompanyLogo.startsWith("data:image")) {
//         setImagePreview(formik.values.CompanyLogo);
//       } else {
//         setImagePreview(`data:image/*;base64,${formik.values.CompanyLogo}`);
//       }
//     } else {
//       setImagePreview(null);
//     }
//   }, [formik.values.CompanyLogo]);

//   const handleTabChange = async (_e, nv) => {
//     if (nv > tabValue) {
//       const ok = await validateCurrentTab();
//       if (!ok) return;
//     }
//     setTabValue(nv);
//   };

//   const handleFileChange = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const base64 = reader.result;
//       setImagePreview(base64);
//       const raw = base64.toString().split(",")[1] || base64;
//       formik.setFieldValue("CompanyLogo", raw);
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleDeleteImage = () => {
//     setImagePreview(null);
//     formik.setFieldValue("CompanyLogo", null);
//   };

//   const f = formik;
//   const err = (n) => Boolean(f.touched[n] && f.errors[n]);
//   const help = (n) => (f.touched[n] && f.errors[n]) || " ";

//   const normalizeUrl = (val) => {
//     if (!val) return val;
//     const trimmed = val.trim();
//     return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
//   };

//   // replace or set this to the logged in company user id in your app
//   const isLoggedin = /* e.g. localStorage.getItem('Company_User_Id') || user?.id */ "";

//   // Define REPORTS endpoint or import it if it's defined elsewhere
//     // const REPORTS = "/reports"; // Adjust this value as needed for your API
  
//   // function to fetch company details and set formik values
//     const fetchCompanyData = async () => {
//       setIsLoading(true);
//       try {
//         const response = await postRequest(ServerConfig.url, REPORTS, {
//           query: `SELECT * FROM paym_Company WHERE Company_User_Id = '${isLoggedin}'`,
//         });

//       if (response.data && response.data.length > 0) {
//         const data = response.data[0];
//         setCompanyData(data);

//         // Set form values if data exists (assuming you have a formik instance)
//         formik.setValues({
//           companyName: data.CompanyName || "",
//           companyCode: data.CompanyCode || "",
//           addressLine1: data.Address_Line1 || "",
//           addressLine2: data.Address_Line2 || "",
//           city: data.City || "",
//           state: data.State || "",
//           country: data.Country || "",
//           ZipCode: data.ZipCode || "",
//           phoneNumber: data.Phone_No || "",
//           faxNo: data.Fax_No || "",
//           emailAddress: data.Email_Id || "",
//           alternateEmailAddress: data.AlternateEmail_Id || "",
//           GSTNumber: data.GSTNumber || "",
//           ContactPerson: data.ContactPerson || "",
//           WebsiteURL: data.WebsiteURL || "",
//           startDate: data.start_date ? data.start_date.split("T")[0] : "",
//           endDate: data.end_date ? data.end_date.split("T")[0] : "",
//           companyUserId: data.Company_User_Id || "",
//           companyPassword: data.Company_Password || "",
//           CompanyLogo: data.CompanyLogo || "",
//         });

//         // Set image preview if logo exists
//         if (data.CompanyLogo) {
//           setImagePreview({
//             CompanyLogo: `data:image/jpeg;base64,${data.CompanyLogo}`,
//           });
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching company data:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // call on mount or when isLoggedin changes
//   useEffect(() => {
//     if (isLoggedin) fetchCompanyData();
//   }, [isLoggedin]);

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle>{f.values.PnCompanyId ? "Edit Company" : "Add Company"}</DialogTitle>
//       <DialogContent dividers>
//         <Card
//           sx={{
//             width: "100%",
//             maxWidth: "100%",
//             p: 1.5,
//             boxShadow: "0px 4px 12px rgba(0,0,0,0.05)",
//             m: "auto",
//             borderBottomLeftRadius: "20px",
//             borderBottomRightRadius: "20px",
//             borderTopLeftRadius: 0,
//             borderTopRightRadius: 0,
//           }}
//         >
//           <Tabs
//             value={tabValue}
//             onChange={handleTabChange}
//             aria-label="company-details-tabs"
//           >
//             <Tab label="General Information" sx={{ color: "black", mr: 4 }} />
//             <Tab label="Address Details" sx={{ color: "black", mr: 4 }} />
//             <Tab label="Contact Details" sx={{ color: "black", mr: 4 }} />
//             <Tab label="Additional Info" sx={{ color: "black", mr: 4 }} />
//           </Tabs>

//           <Box component="form" onSubmit={f.handleSubmit} sx={{ mt: 2 }}>
//             {tabValue === 0 && (
//               <Grid container spacing={2}>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="Company Name"
//                     name="CompanyName"
//                     required
//                     value={f.values.CompanyName}
//                     onChange={f.handleChange}
//                     onBlur={f.handleBlur}
//                     error={err("CompanyName")}
//                     helperText={help("CompanyName")}
//                     fullWidth
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="Company Code"
//                     name="CompanyCode"
//                     required
//                     value={f.values.CompanyCode}
//                     onChange={f.handleChange}
//                     onBlur={f.handleBlur}
//                     error={err("CompanyCode")}
//                     helperText={help("CompanyCode")}
//                     fullWidth
//                   />
//                 </Grid>

//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="Company User Id"
//                     name="CompanyUserId"
//                     required
//                     value={f.values.CompanyUserId}
//                     onChange={f.handleChange}
//                     onBlur={f.handleBlur}
//                     error={err("CompanyUserId")}
//                     helperText={help("CompanyUserId")}
//                     fullWidth
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="Company Password"
//                     name="CompanyPassword"
//                     type="password"
//                     required
//                     value={f.values.CompanyPassword}
//                     onChange={f.handleChange}
//                     onBlur={f.handleBlur}
//                     error={err("CompanyPassword")}
//                     helperText={help("CompanyPassword")}
//                     fullWidth
//                   />
//                 </Grid>
//               </Grid>
//             )}

//             {tabValue === 1 && (
//               <Grid container spacing={2}>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="Address Line 1"
//                     name="AddressLine1"
//                     required
//                     value={f.values.AddressLine1}
//                     onChange={f.handleChange}
//                     onBlur={f.handleBlur}
//                     error={err("AddressLine1")}
//                     helperText={help("AddressLine1")}
//                     fullWidth
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="Address Line 2"
//                     name="AddressLine2"
//                     required
//                     value={f.values.AddressLine2}
//                     onChange={f.handleChange}
//                     onBlur={f.handleBlur}
//                     error={err("AddressLine2")}
//                     helperText={help("AddressLine2")}
//                     fullWidth
//                   />
//                 </Grid>

//                 <Grid item xs={12} sm={4}>
//                   <TextField
//                     label="City"
//                     name="City"
//                     required
//                     value={f.values.City}
//                     onChange={f.handleChange}
//                     onBlur={f.handleBlur}
//                     error={err("City")}
//                     helperText={help("City")}
//                     fullWidth
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <TextField
//                     label="State"
//                     name="State"
//                     required
//                     value={f.values.State}
//                     onChange={f.handleChange}
//                     onBlur={f.handleBlur}
//                     error={err("State")}
//                     helperText={help("State")}
//                     fullWidth
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <TextField
//                     label="Zip Code"
//                     name="ZipCode"
//                     required
//                     value={f.values.ZipCode}
//                     onChange={f.handleChange}
//                     onBlur={f.handleBlur}
//                     error={err("ZipCode")}
//                     helperText={help("ZipCode")}
//                     fullWidth
//                   />
//                 </Grid>

//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="Country"
//                     name="Country"
//                     required
//                     value={f.values.Country}
//                     onChange={f.handleChange}
//                     onBlur={f.handleBlur}
//                     error={err("Country")}
//                     helperText={help("Country")}
//                     fullWidth
//                   />
//                 </Grid>
//               </Grid>
//             )}

//             {tabValue === 2 && (
//               <Grid container spacing={2}>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="Phone No"
//                     name="PhoneNo"
//                     required
//                     value={f.values.PhoneNo}
//                     onChange={f.handleChange}
//                     onBlur={f.handleBlur}
//                     error={err("PhoneNo")}
//                     helperText={help("PhoneNo")}
//                     fullWidth
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="Fax No"
//                     name="FaxNo"
//                     required
//                     value={f.values.FaxNo}
//                     onChange={f.handleChange}
//                     onBlur={f.handleBlur}
//                     error={err("FaxNo")}
//                     helperText={help("FaxNo")}
//                     fullWidth
//                   />
//                 </Grid>

//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="Email"
//                     name="EmailId"
//                     required
//                     value={f.values.EmailId}
//                     onChange={f.handleChange}
//                     onBlur={f.handleBlur}
//                     error={err("EmailId")}
//                     helperText={help("EmailId")}
//                     fullWidth
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="Alternate Email"
//                     name="AlternateEmailId"
//                     value={f.values.AlternateEmailId}
//                     onChange={f.handleChange}
//                     onBlur={f.handleBlur}
//                     error={err("AlternateEmailId")}
//                     helperText={help("AlternateEmailId")}
//                     fullWidth
//                   />
//                 </Grid>
//               </Grid>
//             )}

//             {tabValue === 3 && (
//               <Grid container spacing={2}>
//                 <Grid item xs={12} sm={4}>
//                   <TextField
//                     label="GST Number"
//                     name="GSTNumber"
//                     required
//                     value={f.values.GSTNumber}
//                     onChange={f.handleChange}
//                     onBlur={f.handleBlur}
//                     error={err("GSTNumber")}
//                     helperText={help("GSTNumber")}
//                     fullWidth
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <TextField
//                     label="Website URL"
//                     name="WebsiteURL"
//                     required
//                     value={f.values.WebsiteURL}
//                     onChange={f.handleChange}
//                     onBlur={(e) => {
//                       const normalized = normalizeUrl(e.target.value);
//                       if (normalized !== e.target.value) {
//                         f.setFieldValue("WebsiteURL", normalized);
//                       }
//                       f.handleBlur(e);
//                     }}
//                     error={err("WebsiteURL")}
//                     helperText={help("WebsiteURL")}
//                     fullWidth
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <TextField
//                     label="Contact Person"
//                     name="ContactPerson"
//                     required
//                     value={f.values.ContactPerson}
//                     onChange={f.handleChange}
//                     onBlur={f.handleBlur}
//                     error={err("ContactPerson")}
//                     helperText={help("ContactPerson")}
//                     fullWidth
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="Start Date"
//                     type="date"
//                     name="StartDate"
//                     required
//                     value={f.values.StartDate}
//                     onChange={f.handleChange}
//                     onBlur={f.handleBlur}
//                     error={err("StartDate")}
//                     helperText={help("StartDate")}
//                     InputLabelProps={{ shrink: true }}
//                     fullWidth
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="End Date"
//                     type="date"
//                     name="EndDate"
//                     required
//                     value={f.values.EndDate}
//                     onChange={f.handleChange}
//                     onBlur={f.handleBlur}
//                     error={err("EndDate")}
//                     helperText={help("EndDate")}
//                     InputLabelProps={{ shrink: true }}
//                     fullWidth
//                   />
//                 </Grid>

//                 <Grid item xs={12}>
//                   {/* Upload Company Logo */}
//                   <Box
//                     display="flex"
//                     alignItems="center"
//                     flexDirection={{ xs: "column", sm: "row" }}
//                     gap={2}
//                     sx={{
//                       border: "1px dashed #bdbdbd",
//                       borderRadius: 2,
//                       p: 2,
//                       background: "#fafbfc",
//                       mt: 1,
//                     }}
//                   >
//                     <Box>
//                       <input
//                         id="company-logo-upload"
//                         type="file"
//                         accept="image/*"
//                         onChange={handleFileChange}
//                         style={{ display: "none" }}
//                       />
//                       <label htmlFor="company-logo-upload">
//                         <Button
//                           variant="outlined"
//                           component="span"
//                           startIcon={<PhotoCamera />}
//                           sx={{ textTransform: "none" }}
//                         >
//                           {imagePreview ? "Change Logo" : "Upload Logo"}
//                         </Button>
//                       </label>
//                     </Box>
//                     {imagePreview ? (
//                       <Box
//                         sx={{
//                           display: "flex",
//                           alignItems: "center",
//                           gap: 1,
//                           mt: { xs: 2, sm: 0 },
//                         }}
//                       >
//                         <img
//                           src={imagePreview}
//                           alt="Company Logo"
//                           style={{
//                             width: 72,
//                             height: 72,
//                             objectFit: "cover",
//                             borderRadius: 12,
//                             border: "1px solid #e0e0e0",
//                             background: "#fff",
//                           }}
//                         />
//                         <IconButton
//                           onClick={handleDeleteImage}
//                           color="error"
//                           size="small"
//                           sx={{
//                             border: "1px solid #e57373",
//                             ml: 1,
//                             bgcolor: "#fff",
//                             "&:hover": { bgcolor: "#ffebee" },
//                           }}
//                         >
//                           <Delete />
//                         </IconButton>
//                       </Box>
//                     ) : (
//                       <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
//                         Upload a company logo in JPG or PNG format.
//                       </Typography>
//                     )}
//                   </Box>
//                 </Grid>
//               </Grid>
//             )}
//             {/* End of tab panels */}
//           </Box>
//         </Card>
//         <DialogActions>
//           {!isFirstTab && (
//             <Button onClick={handleBack} color="inherit">
//               Back
//             </Button>
//           )}

//           {/* Next for tabs 0–2 */}
//           {!isLastTab && (
//             <Button onClick={handleNext} variant="contained" color="primary">
//               Next
//             </Button>
//           )}

//           {/* Save/Update only on last tab */}
//           {isLastTab && (
//             <Button
//               onClick={f.handleSubmit}
//               variant="contained"
//               color="primary"
//               disabled={f.isSubmitting}
//             >
//               {f.values.PnCompanyId ? "Update" : "Save"}
//             </Button>
//           )}
//         </DialogActions>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default CompanyForm;

// src/component/Masters-company/CompanyForm.js
import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Tabs, Tab, TextField, Grid, Box, Card, IconButton, Typography
} from "@mui/material";
import { PhotoCamera, Delete } from "@mui/icons-material";
import { useFormik } from "formik";
import * as yup from "yup";
import { ServerConfig } from "../../serverconfiguration/serverconfig.js";
import { REPORTS } from "../../serverconfiguration/controllers";
import { postRequest } from "../../serverconfiguration/requestcomp";
// import { postRequest } from "../../serverconfiguration/requestcomp";
// import { ServerConfig } from "../../serverconfiguration/serverconfig.js";
// import { REPORTS } from "../../serverconfiguration/controllers";
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
  WebsiteURL: yup.string().url("Invalid URL").required("Website URL is required"),
  ContactPerson: yup.string().required("Contact Person is required"),
  StartDate: yup.string().required("Start Date is required"),
  EndDate: yup.string().required("End Date is required")
});

const CompanyForm = ({ open, onClose, initialData = {}, viewMode = false }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [companyData, setCompanyData] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  

const fetchCompanies = async () => {
    try {
      const query = `SELECT * FROM paym_Company`;
      const res = await postRequest(ServerConfig.url, REPORTS, { query });
      const normalize = (data) => ({
        PnCompanyId: data.PnCompanyId ?? data.pn_CompanyID ?? 0,
        CompanyName: data.CompanyName || "",
        CompanyCode: data.CompanyCode || "",
        AddressLine1: data.Address_Line1 || "",
        AddressLine2: data.Address_Line2 || "",
        City: data.City || "",
        State: data.State || "",
        Country: data.Country || "",
        ZipCode: data.ZipCode || "",
        PhoneNo: data.Phone_No || "",
        FaxNo: data.Fax_No || "",
        EmailId: data.Email_Id || "",
        AlternateEmailId: data.AlternateEmail_Id || "",
        GSTNumber: data.GSTNumber || "",
        ContactPerson: data.ContactPerson || "",
        WebsiteURL: data.WebsiteURL || "",
        StartDate: data.start_date?.split("T")[0] || "",
        EndDate: data.end_date?.split("T")[0] || "",
        CompanyUserId: data.Company_User_Id || "",
        CompanyPassword: data.Company_Password || "",
        CompanyLogo: data.CompanyLogo || null,
      });
      setCompanyData(Array.isArray(res.data) ? res.data.map(normalize) : []);
    } catch (err) {
      console.error("Error fetching companies:", err);
    }
  };


  // --- Tab helpers ---
  const isLastTab = tabValue === 3;
  const isFirstTab = tabValue === 0;

  const tabFields = [
    ["CompanyName", "CompanyCode", "CompanyUserId", "CompanyPassword"],
    ["AddressLine1", "AddressLine2", "City", "State", "ZipCode", "Country"],
    ["PhoneNo", "FaxNo", "EmailId", "AlternateEmailId"],
    ["GSTNumber", "WebsiteURL", "ContactPerson", "StartDate", "EndDate"]
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

  const toForm = (d = {}) => ({
    PnCompanyId: d.PnCompanyId ?? d.pn_CompanyID ?? 0,
    CompanyLogo: d.CompanyLogo ?? d.companyLogo ?? null,
    CompanyCode: d.CompanyCode ?? d.companyCode ?? "",
    CompanyName: d.CompanyName ?? d.companyName ?? "",
    AddressLine1: d.AddressLine1 ?? d.Address_Line1 ?? "",
    AddressLine2: d.AddressLine2 ?? d.Address_Line2 ?? "",
    City: d.City ?? d.city ?? "",
    ZipCode: d.ZipCode ?? d.zipCode ?? "",
    Country: d.Country ?? d.country ?? "",
    State: d.State ?? d.state ?? "",
    PhoneNo: d.PhoneNo ?? d.phone_No ?? "",
    FaxNo: d.FaxNo ?? d.fax_No ?? "",
    EmailId: d.EmailId ?? d.email_Id ?? "",
    AlternateEmailId: d.AlternateEmailId ?? d.alternateEmail_Id ?? "",
    StartDate: (d.StartDate ?? d.start_date)?.substring?.(0,10) || "",
    EndDate: (d.EndDate ?? d.end_date)?.substring?.(0,10) || "",
    CompanyUserId: d.CompanyUserId ?? d.Company_User_Id ?? "",
    CompanyPassword: d.CompanyPassword ?? d.Company_Password ?? "",
    GSTNumber: d.GSTNumber ?? d.gstNumber ?? "",
    WebsiteURL: d.WebsiteURL ?? d.websiteURL ?? "",
    ContactPerson: d.ContactPerson ?? d.contactPerson ?? ""
  });

  const toApi = (v) => ({
    PnCompanyId: v.PnCompanyId || 0,
    CompanyCode: v.CompanyCode || null,
    CompanyName: v.CompanyName || null,
    AddressLine1: v.AddressLine1 || null,
    AddressLine2: v.AddressLine2 || null,
    City: v.City || null,
    ZipCode: v.ZipCode || null,
    Country: v.Country || null,
    State: v.State || null,
    PhoneNo: v.PhoneNo || null,
    FaxNo: v.FaxNo || null,
    EmailId: v.EmailId || null,
    AlternateEmailId: v.AlternateEmailId || null,
    StartDate: v.StartDate ? new Date(v.StartDate).toISOString() : null,
    EndDate: v.EndDate ? new Date(v.EndDate).toISOString() : null,
    CompanyUserId: v.CompanyUserId || null,
    CompanyPassword: v.CompanyPassword || null,
    GSTNumber: v.GSTNumber || null,
    WebsiteURL: v.WebsiteURL || null,
    ContactPerson: v.ContactPerson || null,
    CompanyLogo: v.CompanyLogo || null
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: toForm(initialData),
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const payload = toApi(values);
        const query = values.PnCompanyId
          ? `UPDATE paym_Company SET 
                CompanyCode='${payload.CompanyCode}',
                CompanyName='${payload.CompanyName}',
                Address_Line1='${payload.AddressLine1}',
                Address_Line2='${payload.AddressLine2}',
                City='${payload.City}',
                ZipCode='${payload.ZipCode}',
                Country='${payload.Country}',
                State='${payload.State}',
                Phone_No='${payload.PhoneNo}',
                Fax_No='${payload.FaxNo}',
                Email_Id='${payload.EmailId}',
                AlternateEmail_Id='${payload.AlternateEmailId}',
                Start_date='${payload.StartDate}',
                End_date='${payload.EndDate}',
                Company_User_Id='${payload.CompanyUserId}',
                Company_Password='${payload.CompanyPassword}',
                GSTNumber='${payload.GSTNumber}',
                WebsiteURL='${payload.WebsiteURL}',
                ContactPerson='${payload.ContactPerson}',
                CompanyLogo='${payload.CompanyLogo}'
            WHERE PnCompanyId=${payload.PnCompanyId}`
          : `INSERT INTO paym_Company 
                (CompanyCode, CompanyName, Address_Line1, Address_Line2, City, ZipCode, Country, State, Phone_No, Fax_No, Email_Id, AlternateEmail_Id, Start_date, End_date, Company_User_Id, Company_Password, GSTNumber, WebsiteURL, ContactPerson, CompanyLogo)
            VALUES 
                ('${payload.CompanyCode}','${payload.CompanyName}','${payload.AddressLine1}','${payload.AddressLine2}','${payload.City}','${payload.ZipCode}','${payload.Country}','${payload.State}','${payload.PhoneNo}','${payload.FaxNo}','${payload.EmailId}','${payload.AlternateEmailId}','${payload.StartDate}','${payload.EndDate}','${payload.CompanyUserId}','${payload.CompanyPassword}','${payload.GSTNumber}','${payload.WebsiteURL}','${payload.ContactPerson}','${payload.CompanyLogo}')`;

        await postRequest(ServerConfig.url, REPORTS, { query });
        await fetchCompanies();
        onClose();
      } catch (error) {
        console.error("Error saving company:", error);
      } finally {
        setSubmitting(false);
      }
    }
  });

  const f = formik;
  const err = (n) => Boolean(f.touched[n] && f.errors[n]);
  const help = (n) => (f.touched[n] && f.errors[n]) || " ";

  // Image preview
  useEffect(() => {
    if (f.values.CompanyLogo) {
      setImagePreview(`data:image/*;base64,${f.values.CompanyLogo}`);
    } else {
      setImagePreview(null);
    }
  }, [f.values.CompanyLogo]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setImagePreview(base64);
      const raw = base64.toString().split(",")[1] || base64;
      f.setFieldValue("CompanyLogo", raw);
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteImage = () => {
    setImagePreview(null);
    f.setFieldValue("CompanyLogo", null);
  };

  const handleTabChange = async (_e, nv) => {
    if (nv > tabValue) {
      const ok = await validateCurrentTab();
      if (!ok) return;
    }
    setTabValue(nv);
  };

  const normalizeUrl = (val) => {
    if (!val) return val;
    const trimmed = val.trim();
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{viewMode ? "View Company" : f.values.PnCompanyId ? "Edit Company" : "Add Company"}</DialogTitle>
      <DialogContent dividers>
        <Card sx={{ width: "100%", maxWidth: "100%", p: 1.5, boxShadow: "0px 4px 12px rgba(0,0,0,0.05)", m: "auto", borderBottomLeftRadius: "20px", borderBottomRightRadius: "20px", borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="company-details-tabs">
            <Tab label="General Information" sx={{ color: "black", mr: 4 }} />
            <Tab label="Address Details" sx={{ color: "black", mr: 4 }} />
            <Tab label="Contact Details" sx={{ color: "black", mr: 4 }} />
            <Tab label="Additional Info" sx={{ color: "black", mr: 4 }} />
          </Tabs>

          <Box component="form" onSubmit={f.handleSubmit} sx={{ mt: 2 }}>
            {/* === Tabs content same as your new code === */}
            {/* General Information Tab */}
            {tabValue === 0 && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField label="Company Name" name="CompanyName" required value={f.values.CompanyName} onChange={f.handleChange} onBlur={f.handleBlur} error={err("CompanyName")} helperText={help("CompanyName")} fullWidth disabled={viewMode} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Company Code" name="CompanyCode" required value={f.values.CompanyCode} onChange={f.handleChange} onBlur={f.handleBlur} error={err("CompanyCode")} helperText={help("CompanyCode")} fullWidth disabled={viewMode} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Company User Id" name="CompanyUserId" required value={f.values.CompanyUserId} onChange={f.handleChange} onBlur={f.handleBlur} error={err("CompanyUserId")} helperText={help("CompanyUserId")} fullWidth disabled={viewMode} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Company Password" name="CompanyPassword" type="password" required value={f.values.CompanyPassword} onChange={f.handleChange} onBlur={f.handleBlur} error={err("CompanyPassword")} helperText={help("CompanyPassword")} fullWidth disabled={viewMode} />
                </Grid>
              </Grid>
            )}
            {/* === Other tabs same as your new code === */}
            {tabValue === 1 && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Address Line 1"
                    name="AddressLine1"
                    required
                    value={f.values.AddressLine1}
                    onChange={f.handleChange}
                    onBlur={f.handleBlur}
                    error={err("AddressLine1")}
                    helperText={help("AddressLine1")}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Address Line 2"
                    name="AddressLine2"
                    required
                    value={f.values.AddressLine2}
                    onChange={f.handleChange}
                    onBlur={f.handleBlur}
                    error={err("AddressLine2")}
                    helperText={help("AddressLine2")}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    label="City"
                    name="City"
                    required
                    value={f.values.City}
                    onChange={f.handleChange}
                    onBlur={f.handleBlur}
                    error={err("City")}
                    helperText={help("City")}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="State"
                    name="State"
                    required
                    value={f.values.State}
                    onChange={f.handleChange}
                    onBlur={f.handleBlur}
                    error={err("State")}
                    helperText={help("State")}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Zip Code"
                    name="ZipCode"
                    required
                    value={f.values.ZipCode}
                    onChange={f.handleChange}
                    onBlur={f.handleBlur}
                    error={err("ZipCode")}
                    helperText={help("ZipCode")}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Country"
                    name="Country"
                    required
                    value={f.values.Country}
                    onChange={f.handleChange}
                    onBlur={f.handleBlur}
                    error={err("Country")}
                    helperText={help("Country")}
                    fullWidth
                  />
                </Grid>
              </Grid>
            )}
            {tabValue === 2 && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone No"
                    name="PhoneNo"
                    required
                    value={f.values.PhoneNo}
                    onChange={f.handleChange}
                    onBlur={f.handleBlur}
                    error={err("PhoneNo")}
                    helperText={help("PhoneNo")}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Fax No"
                    name="FaxNo"
                    required
                    value={f.values.FaxNo}
                    onChange={f.handleChange}
                    onBlur={f.handleBlur}
                    error={err("FaxNo")}
                    helperText={help("FaxNo")}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    name="EmailId"
                    required
                    value={f.values.EmailId}
                    onChange={f.handleChange}
                    onBlur={f.handleBlur}
                    error={err("EmailId")}
                    helperText={help("EmailId")}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Alternate Email"
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
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="GST Number"
                    name="GSTNumber"
                    required
                    value={f.values.GSTNumber}
                    onChange={f.handleChange}
                    onBlur={f.handleBlur}
                    error={err("GSTNumber")}
                    helperText={help("GSTNumber")}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Website URL"
                    name="WebsiteURL"
                    required
                    value={f.values.WebsiteURL}
                    onChange={f.handleChange}
                    onBlur={(e) => {
                      const normalized = normalizeUrl(e.target.value);
                      if (normalized !== e.target.value) {
                        f.setFieldValue("WebsiteURL", normalized);
                      }
                      f.handleBlur(e);
                    }}
                    error={err("WebsiteURL")}
                    helperText={help("WebsiteURL")}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Contact Person"
                    name="ContactPerson"
                    required
                    value={f.values.ContactPerson}
                    onChange={f.handleChange}
                    onBlur={f.handleBlur}
                    error={err("ContactPerson")}
                    helperText={help("ContactPerson")}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Start Date"
                    type="date"
                    name="StartDate"
                    required
                    value={f.values.StartDate}
                    onChange={f.handleChange}
                    onBlur={f.handleBlur}
                    error={err("StartDate")}
                    helperText={help("StartDate")}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="End Date"
                    type="date"
                    name="EndDate"
                    required
                    value={f.values.EndDate}
                    onChange={f.handleChange}
                    onBlur={f.handleBlur}
                    error={err("EndDate")}
                    helperText={help("EndDate")}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  {/* Upload Company Logo */}
                  <Box
                    display="flex"
                    alignItems="center"
                    flexDirection={{ xs: "column", sm: "row" }}
                    gap={2}
                    sx={{
                      border: "1px dashed #bdbdbd",
                      borderRadius: 2,
                      p: 2,
                      background: "#fafbfc",
                      mt: 1,
                    }}
                  >
                    <Box>
                      <input
                        id="company-logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                      />
                      <label htmlFor="company-logo-upload">
                        <Button
                          variant="outlined"
                          component="span"
                          startIcon={<PhotoCamera />}
                          sx={{ textTransform: "none" }}
                        >
                          {imagePreview ? "Change Logo" : "Upload Logo"}
                        </Button>
                      </label>
                    </Box>
                    {imagePreview ? (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mt: { xs: 2, sm: 0 },
                        }}
                      >
                        <img
                          src={imagePreview}
                          alt="Company Logo"
                          style={{
                            width: 72,
                            height: 72,
                            objectFit: "cover",
                            borderRadius: 12,
                            border: "1px solid #e0e0e0",
                            background: "#fff",
                          }}
                        />
                        <IconButton
                          onClick={handleDeleteImage}
                          color="error"
                          size="small"
                          sx={{
                            border: "1px solid #e57373",
                            ml: 1,
                            bgcolor: "#fff",
                            "&:hover": { bgcolor: "#ffebee" },
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        Upload a company logo in JPG or PNG format.
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            )}
            {/* Address, Contact, Additional Info tabs remain unchanged */}
            
          </Box>
        </Card>

        <DialogActions>
          {!isFirstTab && !viewMode && (
            <Button onClick={handleBack} color="inherit">Back</Button>
          )}
          {!isLastTab && !viewMode && (
            <Button onClick={handleNext} variant="contained" color="primary">Next</Button>
          )}
          {isLastTab && !viewMode && (
            <Button onClick={f.handleSubmit} variant="contained" color="primary" disabled={f.isSubmitting}>
              {f.values.PnCompanyId ? "Update" : "Save"}
            </Button>
          )}
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyForm;
