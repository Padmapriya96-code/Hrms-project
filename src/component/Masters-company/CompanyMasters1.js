import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Grid,
  Card,
  Popover,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Toolbar,
  AppBar,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { PhotoCamera, Delete } from "@mui/icons-material";
import Navbar from "../Home Page-comapny/Navbar1";
import Sidenav from "../Home Page-comapny/Sidenav1";
import { postRequest } from "../../serverconfiguration/requestcomp";
import { ServerConfig } from "../../serverconfiguration/serverconfig";
import { REPORTS } from "../../serverconfiguration/controllers";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import GeneralInformation from "../../../src/images/Home page/genaral.jpeg";
import address from "../../../src/images/Home page/address.jpeg";
import contact from "../../../src/images/Home page/Contact.jpeg";
import additional from "../../../src/images/Home page/address.jpeg";

const CompanyMasterss1 = () => {
  const [companyData, setCompanyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const [popoverMessage, setPopoverMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [files, setFiles] = useState({ CompanyLogo: null });
  const [imagePreview, setImagePreview] = useState({ CompanyLogo: null });
  const navigate = useNavigate();
  const isLoggedin = sessionStorage.getItem("user");

  // Fetch company data for logged-in user
  const fetchCompanyData = async () => {
    setIsLoading(true);
    try {
      const response = await postRequest(ServerConfig.url, REPORTS, {
        query: `SELECT [pn_CompanyID], [CompanyCode], [CompanyName], [Address_Line1], [Address_Line2], [City], [ZipCode], 
                 [Country], [State], [Phone_No], [Fax_No], [Email_Id], [AlternateEmail_Id], [start_date], [end_date], 
                 [Company_User_Id], [Company_Password], [GSTNumber], [WebsiteURL], [ContactPerson], [CompanyLogo]
          FROM [dbo].[paym_Company] 
          WHERE Company_User_Id = '${isLoggedin}'`,
      });

      if (response.data && response.data.length > 0) {
        const data = response.data[0];
        setCompanyData(data);

        // Set form values if data exists
        formik.setValues({
          companyName: data.CompanyName || "",
          companyCode: data.CompanyCode || "",
          addressLine1: data.Address_Line1 || "",
          addressLine2: data.Address_Line2 || "",
          city: data.City || "",
          state: data.State || "",
          country: data.Country || "",
          ZipCode: data.ZipCode || "",
          phoneNumber: data.Phone_No || "",
          faxNo: data.Fax_No || "",
          emailAddress: data.Email_Id || "",
          alternateEmailAddress: data.AlternateEmail_Id || "",
          GSTNumber: data.GSTNumber || "",
          ContactPerson: data.ContactPerson || "",
          WebsiteURL: data.WebsiteURL || "",
          startDate: data.start_date ? data.start_date.split("T")[0] : "",
          endDate: data.end_date ? data.end_date.split("T")[0] : "",
          companyUserId: data.Company_User_Id || "",
          companyPassword: data.Company_Password || "",
          CompanyLogo: data.CompanyLogo || "",
        });

        // Set image preview if logo exists
        if (data.CompanyLogo) {
          setImagePreview({
            CompanyLogo: `data:image/jpeg;base64,${data.CompanyLogo}`,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching company data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedin) {
      fetchCompanyData();
    }
  }, [isLoggedin]);

  const validationSchema = yup.object({
    companyName: yup
      .string()
      .max(50, "Company Name should be at most 50 characters")
      .required("Company Name is required")
      .matches(
        /^[a-zA-Z0-9\s]+$/,
        "Company Name should contain only letters, numbers, and spaces"
      ),
    companyCode: yup
      .string()
      .max(20, "Company Code should be at most 20 characters")
      .required("Company Code is required")
      .matches(
        /^[a-zA-Z0-9]+$/,
        "Company Code should contain only letters and numbers"
      ),
    addressLine1: yup
      .string()
      .max(100, "Address Line 1 should be at most 100 characters")
      .required("Address Line 1 is required")
      .matches(
        /^[a-zA-Z0-9\s,/-]+$/,
        "Address Line 1 should contain only letters, numbers,commas forward slashes (/), and hyphens (-)"
      ),
    addressLine2: yup
      .string()
      .max(100, "Address Line 2 should be at most 100 characters")
      .required("Address Line 2 is required")
      .matches(
        /^[a-zA-Z0-9\s,/-]+$/,
        "Address Line 2 should contain only letters, numbers,commas forward slashes (/), and hyphens (-)"
      ),
    city: yup
      .string()
      .max(50, "City should be at most 50 characters")
      .required("City is required")
      .matches(/^[a-zA-Z\s]+$/, "City should contain only letters and spaces"),
    state: yup
      .string()
      .max(100, "State should be at most 100 characters")
      .required("State is required")
      .matches(/^[a-zA-Z\s]+$/, "State should contain only letters and spaces"),
    country: yup
      .string()
      .max(100, "Country should be at most 100 characters")
      .required("Country is required")
      .matches(
        /^[a-zA-Z\s]+$/,
        "Country should contain only letters and spaces"
      ),
    ZipCode: yup
      .string()
      .max(6, "Zip Code should be at most 6 characters")
      .required("Zip Code is required")
      .matches(/^\d{6}$/, "Zip Code should be 6 digits"),
    phoneNumber: yup
      .string()
      .max(10, "Phone Number should be at most 10 characters")
      .required("Phone Number is required")
      .matches(/^\d{10}$/, "Phone Number should be 10 digits"),
    faxNo: yup
      .string()
      .max(10, "Fax Number should be at most 10 characters")
      .required("Fax Number is required")
      .matches(/^\d{10}$/, "Fax Number should be 10 digits"),
    emailAddress: yup
      .string()
      .email("Enter a valid email")
      .max(100, "Email Address should be at most 100 characters")
      .required("Email Address is required"),
    alternateEmailAddress: yup
      .string()
      .email("Enter a valid email")
      .max(100, "Alternate Email Address should be at most 100 characters"),
    GSTNumber: yup
      .string()
      .max(22, "GST Number should be at most 22 characters")
      .required("GST Number is required")
      .matches(
        /^[a-zA-Z0-9]{1,100}$/,
        "GST Number should be alphanumeric and at most 22 characters"
      ),
    ContactPerson: yup
      .string()
      .max(20, "ContactPerson Name should be at most 40 characters")
      .required("ContactPerson Name is required")
      .matches(
        /^[a-zA-Z0-9]{1,100}$/,
        "ContactPerson Name should be alphanumeric and at most 40 characters"
      ),
    startDate: yup.date().required("Start Date is required"),
    endDate: yup
      .date()
      .required("End Date is required")
      .min(yup.ref("startDate"), "End Date cannot be before Start Date"),
    companyUserId: yup
      .string()
      .matches(
        /^[a-zA-Z0-9_]+$/,
        "Company User ID can only contain letters, numbers, and underscores"
      )
      .max(10, "Company User ID should be at most 10 characters")
      .required("Company User ID is required"),
    companyPassword: yup
      .string()
      .matches(
        /^[a-zA-Z0-9\s]+$/,
        "Company Password must be at least 8 characters long and include at least one letter and one number"
      )
      .required("Company Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      companyName: "",
      companyCode: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      country: "",
      ZipCode: "",
      phoneNumber: "",
      faxNo: "",
      emailAddress: "",
      alternateEmailAddress: "",
      GSTNumber: "",
      ContactPerson: "",
      WebsiteURL: "",
      startDate: "",
      endDate: "",
      companyUserId: "",
      companyPassword: "",
      CompanyLogo: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      updateCompanyData(values);
    },
  });

  const handleDeleteImage = () => {
    setFiles({ ...files, CompanyLogo: null });
    setImagePreview({ ...imagePreview, CompanyLogo: null });
  };

  const handleTabChange = (event, newValue) => {
    if (newValue > tabValue) {
      if (!isValid()) {
        // Correct toast implementation
        toast.error(
          "Please fill all required fields before moving to the next step.",
          {
            position: "top-center",
            style: { textAlign: "center" },
            autoClose: 1000,
          }
        );

        const anchorEl = event.target;
        setPopoverOpen(true);
        setPopoverAnchorEl(anchorEl);
        toast.error(
          "Please fill all required fields before moving to the next step.",
          {
            position: "top-center",
            style: { textAlign: "center" },
            autoClose: 1000,
          }
        );
        return;
      }
    }
    setTabValue(newValue);
  };
  const fetchLocationDetails = async (zipcode) => {
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
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    formik.handleChange(e);

    if (name === "ZipCode") {
      if (value.length === 6) {
        fetchLocationDetails(value);
      } else {
        formik.setFieldValue("city", "");
        formik.setFieldValue("state", "");
        formik.setFieldValue("country", "");
      }
    }
  };

  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      formik.values.ZipCode &&
      formik.values.ZipCode.length === 6
    ) {
      fetchLocationDetails(formik.values.ZipCode);
    }
  };

  const isValid = () => {
    const errors = formik.errors;
    if (tabValue === 0) {
      return (
        !errors.companyName &&
        !errors.companyCode &&
        !errors.companyUserId &&
        !errors.companyPassword
      );
    } else if (tabValue === 1) {
      return (
        !errors.addressLine1 &&
        !errors.city &&
        !errors.state &&
        !errors.country &&
        !errors.ZipCode
      );
    } else if (tabValue === 2) {
      return !errors.phoneNumber && !errors.emailAddress;
    } else if (tabValue === 3) {
      return !errors.GSTNumber && !errors.startDate && !errors.endDate;
    }
    return true;
  };

  const handleNext = () => {
    if (isValid()) {
      if (tabValue === 3) {
        formik.handleSubmit();
      } else {
        setTabValue(tabValue + 1);
      }
    }
  };

  const handleCancel = () => {
    setTabValue(0);
    formik.resetForm();
    if (companyData) {
      formik.setValues({
        companyName: companyData.CompanyName || "",
        companyCode: companyData.CompanyCode || "",
        addressLine1: companyData.Address_Line1 || "",
        addressLine2: companyData.Address_Line2 || "",
        city: companyData.City || "",
        state: companyData.State || "",
        country: companyData.Country || "",
        ZipCode: companyData.ZipCode || "",
        phoneNumber: companyData.Phone_No || "",
        faxNo: companyData.Fax_No || "",
        emailAddress: companyData.Email_Id || "",
        alternateEmailAddress: companyData.AlternateEmail_Id || "",
        GSTNumber: companyData.GSTNumber || "",
        ContactPerson: companyData.ContactPerson || "",
        WebsiteURL: companyData.WebsiteURL || "",
        startDate: companyData.start_date || "",
        endDate: companyData.end_date || "",
        companyUserId: companyData.Company_User_Id || "",
        companyPassword: companyData.Company_Password || "",
        CompanyLogo: companyData.CompanyLogo || "",
      });
    }
  };

  const updateCompanyData = async (formData) => {
    try {
      let CompanyLogo = null;

      if (files.CompanyLogo) {
        const reader = new FileReader();
        CompanyLogo = await new Promise((resolve) => {
          reader.onload = () => {
            const arrayBuffer = reader.result;
            const binary = new Uint8Array(arrayBuffer);
            const hexString = Array.from(binary, (byte) =>
              byte.toString(16).padStart(2, "0")
            ).join("");
            resolve(`0x${hexString}`);
          };
          reader.readAsArrayBuffer(files.CompanyLogo);
        });
      } else if (companyData?.CompanyLogo) {
        CompanyLogo = `0x${companyData.CompanyLogo}`;
      }

      const query = `
        UPDATE [dbo].[paym_Company]
        SET 
          [CompanyCode] = '${formData.companyCode}',
          [CompanyName] = '${formData.companyName}',
          [Address_Line1] = '${formData.addressLine1}',
          [Address_Line2] = '${formData.addressLine2}',
          [City] = '${formData.city}',
          [State] = '${formData.state}',
          [Country] = '${formData.country}',
          [ZipCode] = '${formData.ZipCode}',
          [Phone_No] = '${formData.phoneNumber}',
          [Fax_No] = '${formData.faxNo}',
          [Email_Id] = '${formData.emailAddress}',
          [AlternateEmail_Id] = '${formData.alternateEmailAddress}',
          [GSTNumber] = '${formData.GSTNumber}',
          [ContactPerson] = '${formData.ContactPerson}',
          [start_date] = '${formData.startDate}',
          [end_date] = '${formData.endDate}',
          [Company_User_Id] = '${formData.companyUserId}',
          [Company_Password] = '${formData.companyPassword}',
          [WebsiteURL] = '${formData.WebsiteURL}',
          [CompanyLogo] = ${CompanyLogo || "NULL"}
        WHERE pn_CompanyID = ${companyData.pn_CompanyID};
      `;

      const response = await postRequest(ServerConfig.url, REPORTS, { query });

      if (response.status === 200) {
        setDialogOpen(true);
        // Refresh the data after successful update
        fetchCompanyData();
      } else {
        toast.error(`Unexpected response status: ${response.status}`, {
          position: "top-center",
          style: { textAlign: "center" },
          autoClose: 1000,
        });
      }
    } catch (error) {
      console.error("Error in postData:", error);
      toast.error("Update failed.", {
        position: "top-center",
        style: { textAlign: "center" },
        autoClose: 1000,
      });
    }
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFiles({ ...files, [fileType]: file });
      setImagePreview({ ...imagePreview, [fileType]: imageUrl });
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDialogYes = () => {
    navigate("/BranchMasters2");
  };

  const handleDialogNo = () => {
    setDialogOpen(false);
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12}>
        <div style={{ backgroundColor: "#f5f5f5" }}>
          <Navbar />
          <Box height={30} />
          <Box sx={{ display: "flex", flex: 1, justifyContent: "center" }}>
            <Sidenav />
            <Grid
              item
              xs={12}
              sm={10}
              md={9}
              lg={8}
              xl={7}
              style={{ marginLeft: "auto", marginRight: "auto" }}
            >
              <Container maxWidth="md" sx={{ p: 2 }}>
                <AppBar position="static" className="company-appbar">
                  <Toolbar className="company-toolbar">
                    <Typography variant="h5" className="company-title">
                      COMPANY DETAILS
                    </Typography>
                  </Toolbar>
                </AppBar>

                <Card
                  sx={{
                    width: "100%",
                    maxWidth: "100%",
                    padding: "10px",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
                    margin: "auto",
                    borderBottomLeftRadius: "20px",
                    borderBottomRightRadius: "20px",
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                  }}
                >
                  <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label="company-details-tabs"
                  >
                    <Tab
                      icon={
                        <img
                          src={GeneralInformation}
                          alt="info"
                          style={{ width: 24, height: 24 }}
                        />
                      }
                      label="General Information"
                      sx={{ color: "black", mr: 4 }}
                    />
                    <Tab
                      icon={
                        <img
                          src={address}
                          alt="info"
                          style={{ width: 24, height: 24 }}
                        />
                      }
                      sx={{ color: "black", mr: 4 }}
                      label="Address Details"
                    />
                    <Tab
                      icon={
                        <img
                          src={contact}
                          alt="info"
                          style={{ width: 24, height: 24 }}
                        />
                      }
                      label="Contact Details"
                      sx={{ color: "black", mr: 4 }}
                    />
                    <Tab
                      icon={
                        <img
                          src={additional}
                          alt="info"
                          style={{ width: 24, height: 24 }}
                        />
                      }
                      label=" Additional Info"
                      sx={{ color: "black", mr: 4 }}
                    />
                  </Tabs>
                  <form onSubmit={formik.handleSubmit}>
                    {tabValue === 0 && (
                      <Grid container spacing={2} sx={{ paddingTop: 2 }}>
                        <Grid item xs={6}>
                          <TextField
                            label={
                              <span>
                                Company Name
                                <span
                                  style={{
                                    color: "red",
                                    marginLeft: "0.25rem",
                                  }}
                                >
                                  *
                                </span>
                              </span>
                            }
                            name="companyName"
                            value={formik.values.companyName}
                            className="custom-readonly-textfield"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.companyName &&
                              Boolean(formik.errors.companyName)
                            }
                            helperText={
                              formik.touched.companyName &&
                              formik.errors.companyName
                            }
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            label={
                              <span>
                                Company Code
                                <span
                                  style={{
                                    color: "red",
                                    marginLeft: "0.25rem",
                                  }}
                                >
                                  *
                                </span>
                              </span>
                            }
                            name="companyCode"
                            className="custom-readonly-textfield"
                            value={formik.values.companyCode}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.companyCode &&
                              Boolean(formik.errors.companyCode)
                            }
                            helperText={
                              formik.touched.companyCode &&
                              formik.errors.companyCode
                            }
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label={
                              <span>
                                Company User Id
                                <span
                                  style={{
                                    color: "red",
                                    marginLeft: "0.25rem",
                                  }}
                                >
                                  *
                                </span>
                              </span>
                            }
                            name="companyUserId"
                            autoComplete="off"
                            className="custom-readonly-textfield"
                            value={formik.values.companyUserId}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.companyUserId &&
                              Boolean(formik.errors.companyUserId)
                            }
                            helperText={
                              formik.touched.companyUserId &&
                              formik.errors.companyUserId
                            }
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label={
                              <span>
                                Company Password
                                <span
                                  style={{
                                    color: "red",
                                    marginLeft: "0.25rem",
                                  }}
                                >
                                  *
                                </span>
                              </span>
                            }
                            name="companyPassword"
                            type="password"
                            autoComplete="new-password"
                            value={formik.values.companyPassword}
                            onChange={formik.handleChange}
                            className="custom-readonly-textfield"
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.companyPassword &&
                              Boolean(formik.errors.companyPassword)
                            }
                            helperText={
                              formik.touched.companyPassword &&
                              formik.errors.companyPassword
                            }
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                      </Grid>
                    )}
                    {tabValue === 1 && (
                      <Grid container spacing={2} sx={{ paddingTop: 2 }}>
                        <Grid item xs={4}>
                          <TextField
                            fullWidth
                            label={
                              <span>
                                Address Line1
                                <span
                                  style={{
                                    color: "red",
                                    marginLeft: "0.25rem",
                                  }}
                                >
                                  *
                                </span>
                              </span>
                            }
                            name="addressLine1"
                            value={formik.values.addressLine1}
                            onChange={formik.handleChange}
                            className="custom-readonly-textfield"
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.addressLine1 &&
                              Boolean(formik.errors.addressLine1)
                            }
                            helperText={
                              formik.touched.addressLine1 &&
                              formik.errors.addressLine1
                            }
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            label={
                              <span>
                                Address Line2
                                <span
                                  style={{
                                    color: "red",
                                    marginLeft: "0.25rem",
                                  }}
                                >
                                  *
                                </span>
                              </span>
                            }
                            name="addressLine2"
                            value={formik.values.addressLine2}
                            onChange={formik.handleChange}
                            className="custom-readonly-textfield"
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.addressLine2 &&
                              Boolean(formik.errors.addressLine2)
                            }
                            helperText={
                              formik.touched.addressLine2 &&
                              formik.errors.addressLine2
                            }
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            label={
                              <span>
                                ZipCode
                                <span
                                  style={{
                                    color: "red",
                                    marginLeft: "0.25rem",
                                  }}
                                >
                                  *
                                </span>
                              </span>
                            }
                            name="ZipCode"
                            value={formik.values.ZipCode}
                            onChange={handleChange}
                            className="custom-readonly-textfield"
                            onKeyDown={handleKeyDown}
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.ZipCode &&
                              Boolean(formik.errors.ZipCode)
                            }
                            helperText={
                              formik.touched.ZipCode && formik.errors.ZipCode
                            }
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            label={
                              <span>
                                City
                                <span
                                  style={{
                                    color: "red",
                                    marginLeft: "0.25rem",
                                  }}
                                >
                                  *
                                </span>
                              </span>
                            }
                            name="city"
                            value={formik.values.city}
                            onChange={formik.handleChange}
                            className="custom-readonly-textfield"
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.city && Boolean(formik.errors.city)
                            }
                            helperText={
                              formik.touched.city && formik.errors.city
                            }
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item sm={4}>
                          <TextField
                            label={
                              <span>
                                State
                                <span
                                  style={{
                                    color: "red",
                                    marginLeft: "0.25rem",
                                  }}
                                >
                                  *
                                </span>
                              </span>
                            }
                            name="state"
                            value={formik.values.state}
                            className="custom-readonly-textfield"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.state &&
                              Boolean(formik.errors.state)
                            }
                            helperText={
                              formik.touched.state && formik.errors.state
                            }
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item sm={4}>
                          <TextField
                            label={
                              <span>
                                Country
                                <span
                                  style={{
                                    color: "red",
                                    marginLeft: "0.25rem",
                                  }}
                                >
                                  *
                                </span>
                              </span>
                            }
                            name="country"
                            value={formik.values.country}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="custom-readonly-textfield"
                            error={
                              formik.touched.country &&
                              Boolean(formik.errors.country)
                            }
                            helperText={
                              formik.touched.country && formik.errors.country
                            }
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                      </Grid>
                    )}
                    {tabValue === 2 && (
                      <Grid container spacing={2} sx={{ paddingTop: 2 }}>
                        <Grid item xs={6}>
                          <TextField
                            label={
                              <span>
                                Phone Number
                                <span
                                  style={{
                                    color: "red",
                                    marginLeft: "0.25rem",
                                  }}
                                >
                                  *
                                </span>
                              </span>
                            }
                            name="phoneNumber"
                            value={formik.values.phoneNumber}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="custom-readonly-textfield"
                            error={
                              formik.touched.phoneNumber &&
                              Boolean(formik.errors.phoneNumber)
                            }
                            helperText={
                              formik.touched.phoneNumber &&
                              formik.errors.phoneNumber
                            }
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            label={
                              <span>
                                FaxNo
                                <span
                                  style={{
                                    color: "red",
                                    marginLeft: "0.25rem",
                                  }}
                                >
                                  *
                                </span>
                              </span>
                            }
                            name="faxNo"
                            value={formik.values.faxNo}
                            className="custom-readonly-textfield"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.faxNo &&
                              Boolean(formik.errors.faxNo)
                            }
                            helperText={
                              formik.touched.faxNo && formik.errors.faxNo
                            }
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            label={
                              <span>
                                Email Address
                                <span
                                  style={{
                                    color: "red",
                                    marginLeft: "0.25rem",
                                  }}
                                >
                                  *
                                </span>
                              </span>
                            }
                            name="emailAddress"
                            value={formik.values.emailAddress}
                            onChange={formik.handleChange}
                            className="custom-readonly-textfield"
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.emailAddress &&
                              Boolean(formik.errors.emailAddress)
                            }
                            helperText={
                              formik.touched.emailAddress &&
                              formik.errors.emailAddress
                            }
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            label="Alternate Email Address"
                            name="alternateEmailAddress"
                            value={formik.values.alternateEmailAddress}
                            className="custom-readonly-textfield"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.alternateEmailAddress &&
                              Boolean(formik.errors.alternateEmailAddress)
                            }
                            helperText={
                              formik.touched.alternateEmailAddress &&
                              formik.errors.alternateEmailAddress
                            }
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                      </Grid>
                    )}
                    {tabValue === 3 && (
                      <Grid container spacing={2} sx={{ paddingTop: 2 }}>
                        <Grid item xs={4}>
                          <TextField
                            label={
                              <span>
                                GSTNumber
                                <span
                                  style={{
                                    color: "red",
                                    marginLeft: "0.25rem",
                                  }}
                                >
                                  *
                                </span>
                              </span>
                            }
                            name="GSTNumber"
                            value={formik.values.GSTNumber}
                            onChange={formik.handleChange}
                            className="custom-readonly-textfield"
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.GSTNumber &&
                              Boolean(formik.errors.GSTNumber)
                            }
                            helperText={
                              formik.touched.GSTNumber &&
                              formik.errors.GSTNumber
                            }
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            label={
                              <span>
                                WebsiteURL
                                <span
                                  style={{
                                    color: "red",
                                    marginLeft: "0.25rem",
                                  }}
                                >
                                  *
                                </span>
                              </span>
                            }
                            name="WebsiteURL"
                            value={formik.values.WebsiteURL}
                            onChange={formik.handleChange}
                            className="custom-readonly-textfield"
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.WebsiteURL &&
                              Boolean(formik.errors.WebsiteURL)
                            }
                            helperText={
                              formik.touched.WebsiteURL &&
                              formik.errors.WebsiteURL
                            }
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>

                        <Grid item xs={4}>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, "CompanyLogo")}
                            style={{ display: "none" }}
                            id="company-logo-upload"
                          />
                          <label
                            htmlFor="company-logo-upload"
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <IconButton
                              component="span"
                              style={{ color: "blue", fontSize: "40px" }}
                            >
                              <PhotoCamera />
                            </IconButton>
                            <span
                              style={{
                                marginLeft: "8px",
                                fontSize: "16px",
                                color: "black",
                              }}
                            >
                              Upload Company Logo
                            </span>
                          </label>
                          {(imagePreview.CompanyLogo ||
                            companyData?.CompanyLogo) && (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginTop: "10px",
                              }}
                            >
                              <img
                                src={
                                  imagePreview.CompanyLogo ||
                                  `data:image/jpeg;base64,${companyData.CompanyLogo}`
                                }
                                alt="Company Logo Preview"
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  marginRight: "10px",
                                }}
                              />
                              <IconButton
                                onClick={handleDeleteImage}
                                style={{ color: "red" }}
                              >
                                <Delete />
                              </IconButton>
                            </div>
                          )}
                        </Grid>

                        <Grid item xs={4}>
                          <TextField
                            label={
                              <span>
                                ContactPerson
                                <span
                                  style={{
                                    color: "red",
                                    marginLeft: "0.25rem",
                                  }}
                                >
                                  *
                                </span>
                              </span>
                            }
                            name="ContactPerson"
                            value={formik.values.ContactPerson}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="custom-readonly-textfield"
                            error={
                              formik.touched.ContactPerson &&
                              Boolean(formik.errors.ContactPerson)
                            }
                            helperText={
                              formik.touched.ContactPerson &&
                              formik.errors.ContactPerson
                            }
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            label={
                              <span>
                                Start Date
                                <span
                                  style={{
                                    color: "red",
                                    marginLeft: "0.25rem",
                                  }}
                                >
                                  *
                                </span>
                              </span>
                            }
                            name="startDate"
                            type="date"
                            value={formik.values.startDate}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="custom-readonly-textfield"
                            error={
                              formik.touched.startDate &&
                              Boolean(formik.errors.startDate)
                            }
                            helperText={
                              formik.touched.startDate &&
                              formik.errors.startDate
                            }
                            fullWidth
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            label={
                              <span>
                                End Date
                                <span
                                  style={{
                                    color: "red",
                                    marginLeft: "0.25rem",
                                  }}
                                >
                                  *
                                </span>
                              </span>
                            }
                            name="endDate"
                            type="date"
                            value={formik.values.endDate}
                            onChange={formik.handleChange}
                            className="custom-readonly-textfield"
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.endDate &&
                              Boolean(formik.errors.endDate)
                            }
                            helperText={
                              formik.touched.endDate && formik.errors.endDate
                            }
                            fullWidth
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>
                      </Grid>
                    )}
                    <Box mt={3}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} style={{ textAlign: "right" }}>
                          <Box display="flex" justifyContent="flex-end">
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={handleCancel}
                              style={{ marginRight: "8px" }}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={handleNext}
                            >
                              {tabValue === 3 ? "Update" : "Next"}
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </form>
                  <Popover
                    open={popoverOpen}
                    anchorEl={popoverAnchorEl}
                    onClose={() => setPopoverOpen(false)}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                  >
                    <Typography sx={{ p: 2 }}>{popoverMessage}</Typography>
                  </Popover>
                  <Dialog
                    open={dialogOpen}
                    onClose={handleDialogClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      {"Company details updated successfully!"}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        Do you want to update branch details now?
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleDialogYes} color="primary">
                        Yes
                      </Button>
                      <Button
                        onClick={handleDialogNo}
                        color="primary"
                        autoFocus
                      >
                        No
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Card>
              </Container>
            </Grid>
          </Box>
        </div>
      </Grid>
    </Grid>
  );
};

export default CompanyMasterss1;
