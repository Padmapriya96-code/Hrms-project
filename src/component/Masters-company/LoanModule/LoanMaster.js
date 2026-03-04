import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  TextField,
  Button,
  Typography,
  FormControl,
  MenuItem,
  Select,
  FormHelperText,
  Box,
  Container,
  CardContent,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  // columns,
  AppBar,
  Toolbar,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { postRequest } from "../../../serverconfiguration/requestcomp";
import { ServerConfig } from "../../../serverconfiguration/serverconfig";
import { useNavigate } from "react-router-dom";
import { REPORTS } from "../../../serverconfiguration/controllers";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Navbar from "../../Home Page-comapny/Navbar1";
import Sidenav from "../../Home Page-comapny/Sidenav1";
import { Formik, Form } from "formik";
import * as Yup from "yup";

export default function LoanMaster() {
  const navigate = useNavigate();
  const [company, setCompany] = useState([]);
  const [branch, setBranch] = useState([]);
  const [pnCompanyId, setPnCompanyId] = useState("");
  const [isloggedin, setIsloggedin] = useState(sessionStorage.getItem("user"));
  const [loanData, setLoanData] = useState([]);
  const [loanTypes, setLoanTypes] = useState([]);
  const [openLoanTypeDialog, setOpenLoanTypeDialog] = useState(false);
  const [loanTypeName, setLoanTypeName] = useState("");
  const [loanTypeStatus, setLoanTypeStatus] = useState("Active");
  const [editMode, setEditMode] = useState(false);
  const [editLoanTypeId, setEditLoanTypeId] = useState(null);
  const [editLoanData, setEditLoanData] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const databaseName = sessionStorage.getItem("databaseName"); // ✅ dynamic DB name

  // Fetch Company
  useEffect(() => {
    async function getData() {
      try {
        const companyData = await postRequest(ServerConfig.url, REPORTS, {
          query: `SELECT * FROM [${databaseName}].[dbo].[paym_Company]
        WHERE company_user_id = '${isloggedin}'`,
        });
        setCompany(companyData.data);
        if (companyData.data.length > 0) {
          setPnCompanyId(companyData.data[0].pn_CompanyID);
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    }
    getData();
  }, [isloggedin]);

  const columns = [
    { field: "CompanyName", headerName: "COMPANY NAME", width: 223 },
    { field: "v_LoanName", headerName: "LOAN NAME", width: 228 },
    { field: "v_LoanCode", headerName: "LOAN CODE", width: 206 },
    { field: "v_LoanType", headerName: "LOAN TYPE", width: 206 },
    { field: "status", headerName: "STATUS", width: 206 },
    {
      field: "BranchName",
      headerName: "BRANCH NAME",
      width: 206,
      cellClassName: "branch-column-cell",
    }, // Show Branch Name here
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton
            color="primary"
            onClick={() => handleEditLoan(params.row)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDeleteLoan(params.row)}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  // Fetch Branch
  useEffect(() => {
    async function getData() {
      try {
        const branchData = await postRequest(ServerConfig.url, REPORTS, {
          query: `SELECT * FROM [${databaseName}].[dbo].[paym_Branch]
        WHERE pn_CompanyID = '${pnCompanyId}'`,
        });
        setBranch(branchData.data);
      } catch (error) {
        console.error("Error fetching branch data:", error);
      }
    }
    if (pnCompanyId) getData();
  }, [pnCompanyId]);

  // Fetch Loans
  useEffect(() => {
    const fetchLoanData = async () => {
      try {
        const response = await postRequest(ServerConfig.url, REPORTS, {
          query: `SELECT pn_Companyid, v_LoanName, v_LoanCode, status, Pn_BranchID, v_LoanType FROM [${databaseName}].[dbo].[paym_Loan] WHERE pn_Companyid = '${pnCompanyId}'`,
        });
        const modifiedData = response.data.map((loan) => ({
          ...loan,
          CompanyName:
            company.find((c) => c.pn_CompanyID === loan.pn_Companyid)
              ?.CompanyName || "Unknown Company",
          BranchName:
            branch.find((b) => b.pn_BranchID === loan.Pn_BranchID)
              ?.BranchName || "Unknown Branch",
          id: `${loan.pn_Companyid}-${loan.v_LoanCode}`,
        }));
        setLoanData(modifiedData);
      } catch (error) {
        console.error("Error fetching loan data:", error);
      }
    };
    if (pnCompanyId) fetchLoanData();
  }, [company, branch]);

  // Edit Loan Record
  // const handleEditLoan = (loan) => {
  //   // Example: You can open a dialog and prefill the form later if needed
  //   console.log("Edit Loan:", loan);
  //   toast.info(`Editing Loan: ${loan.v_LoanName}`);
  // };
  const handleEditLoan = (loan) => {
    setEditLoanData(loan); // Store the clicked row data
    setOpenEditDialog(true); // Open dialog
  };

  const handleUpdateLoan = async () => {
    if (!editLoanData?.v_LoanCode) {
      toast.error("Invalid loan record!");
      return;
    }

    try {
      const query = `
  UPDATE [${databaseName}].[dbo].[paym_Loan]
  SET v_LoanName = '${editLoanData.v_LoanName}',
      v_LoanType = '${editLoanData.v_LoanTypeId}',
      status = '${editLoanData.status}'
  WHERE v_LoanCode = '${editLoanData.v_LoanCode}'
  AND pn_Companyid = '${editLoanData.pn_Companyid}'
`;

      const res = await postRequest(ServerConfig.url, REPORTS, { query });

      if (res.status === 200) {
        toast.success("Loan updated successfully!");
        setOpenEditDialog(false);

        // Refresh grid after update
        const response = await postRequest(ServerConfig.url, REPORTS, {
          query: `SELECT pn_Companyid, v_LoanName, v_LoanCode, status, Pn_BranchID, v_LoanType FROM [${databaseName}].[dbo].[paym_Loan] WHERE pn_Companyid = '${editLoanData.pn_Companyid}'`,
        });
        const modifiedData = response.data.map((loan) => ({
          ...loan,
          CompanyName:
            company.find((c) => c.pn_CompanyID === loan.pn_Companyid)
              ?.CompanyName || "Unknown Company",
          BranchName:
            branch.find((b) => b.pn_BranchID === loan.Pn_BranchID)
              ?.BranchName || "Unknown Branch",
          id: `${loan.pn_Companyid}-${loan.v_LoanCode}`,
        }));
        setLoanData(modifiedData);
      } else {
        toast.error("Failed to update loan!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating loan!");
    }
  };

  // Delete Loan Record
  const handleDeleteLoan = async (loan) => {
    try {
      const res = await postRequest(ServerConfig.url, REPORTS, {
        query: `DELETE FROM [${databaseName}].[dbo].[paym_Loan]
        WHERE v_LoanCode = '${loan.v_LoanCode}'
        AND pn_Companyid = '${loan.pn_Companyid}'`,
      });
      if (res?.status === 200) {
        toast.success("Loan deleted successfully!");
        // Refresh loan data
        const response = await postRequest(ServerConfig.url, REPORTS, {
          query: `SELECT pn_Companyid, v_LoanName, v_LoanCode, status, Pn_BranchID, v_LoanType FROM [${databaseName}].[dbo].[paym_Loan] WHERE pn_Companyid = '${pnCompanyId}'`,
        });
        const modifiedData = response.data.map((loan) => ({
          ...loan,
          CompanyName:
            company.find((c) => c.pn_CompanyID === loan.pn_Companyid)
              ?.CompanyName || "Unknown Company",
          BranchName:
            branch.find((b) => b.pn_BranchID === loan.Pn_BranchID)
              ?.BranchName || "Unknown Branch",
          id: `${loan.pn_Companyid}-${loan.v_LoanCode}`,
        }));
        setLoanData(modifiedData);
      } else {
        toast.error("Failed to delete loan!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error while deleting loan!");
    }
  };

  // Fetch Loan Types
  // const fetchLoanTypes = async () => {
  //   try {
  //     const res = await postRequest(ServerConfig.url, REPORTS, {
  //       query: `SELECT * FROM [dbo].[paym_LoanTypeMaster]`,
  //     });
  //     setLoanTypes(res.data);
  //   } catch (err) {
  //     console.error("Error fetching loan types:", err);
  //   }
  // };

  const fetchLoanTypes = async () => {
    if (!pnCompanyId) return;
    try {
      const res = await postRequest(ServerConfig.url, REPORTS, {
        query: `SELECT * FROM [${databaseName}].[dbo].[paym_LoanTypeMaster] WHERE pn_CompanyID = '${pnCompanyId}'`,
      });
      setLoanTypes(res.data);
    } catch (err) {
      console.error("Error fetching loan types:", err);
    }
  };

  // useEffect(() => {
  //   fetchLoanTypes();
  // }, []);

  useEffect(() => {
    if (pnCompanyId) {
      fetchLoanTypes();
    }
  }, [pnCompanyId]);

  // Save or Update Loan Type
  // const handleSaveLoanType = async () => {
  //   if (!loanTypeName.trim()) {
  //     toast.error("Loan Type Name is required!");
  //     return;
  //   }
  //   try {
  //     let query = "";
  //     if (editMode) {
  //       query = `UPDATE [dbo].[paym_LoanTypeMaster] SET v_LoanTypeName = '${loanTypeName}', status = '${loanTypeStatus}' WHERE pn_LoanTypeID = '${editLoanTypeId}'`;
  //     } else {
  //       query = `INSERT INTO [dbo].[paym_LoanTypeMaster] ([v_LoanTypeName], [status]) VALUES ('${loanTypeName}', '${loanTypeStatus}')`;
  //     }
  //     const res = await postRequest(ServerConfig.url, REPORTS, { query });
  //     if (res?.status === 200) {
  //       toast.success(editMode ? "Loan Type updated!" : "Loan Type added!");
  //       setLoanTypeName("");
  //       setLoanTypeStatus("Active");
  //       setEditMode(false);
  //       setEditLoanTypeId(null);
  //       fetchLoanTypes();
  //     } else {
  //       toast.error("Failed to save Loan Type!");
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Error while saving Loan Type!");
  //   }
  // };

  const handleSaveLoanType = async () => {
    if (!loanTypeName.trim()) {
      toast.error("Loan Type Name is required!");
      return;
    }

    if (!pnCompanyId) {
      toast.error("Company ID not found!");
      return;
    }

    try {
      let query = "";

      if (editMode) {
        // ✅ Update existing loan type with company ID
        query = `
        UPDATE [${databaseName}].[dbo].[paym_LoanTypeMaster]
        SET v_LoanTypeName = '${loanTypeName}',
            status = '${loanTypeStatus}',
            pn_CompanyID = '${pnCompanyId}'
        WHERE pn_LoanTypeID = '${editLoanTypeId}'
      `;
      } else {
        // ✅ Insert new loan type with company ID
        query = `
        INSERT INTO [${databaseName}].[dbo].[paym_LoanTypeMaster]
          ([pn_CompanyID], [v_LoanTypeName], [status])
        VALUES
          ('${pnCompanyId}', '${loanTypeName}', '${loanTypeStatus}')
      `;
      }

      const res = await postRequest(ServerConfig.url, REPORTS, { query });

      if (res?.status === 200) {
        toast.success(editMode ? "Loan Type updated!" : "Loan Type added!");
        setLoanTypeName("");
        setLoanTypeStatus("Active");
        setEditMode(false);
        setEditLoanTypeId(null);
        fetchLoanTypes();
      } else {
        toast.error("Failed to save Loan Type!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error while saving Loan Type!");
    }
  };

  // Delete Loan Type
  const handleDeleteLoanType = async (id) => {
    try {
      const res = await postRequest(ServerConfig.url, REPORTS, {
        query: `DELETE FROM [${databaseName}].[dbo].[paym_LoanTypeMaster]
        WHERE pn_LoanTypeID = '${id}'`,
      });
      if (res?.status === 200) {
        toast.success("Loan Type deleted!");
        fetchLoanTypes();
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting Loan Type!");
    }
  };

  // Edit Loan Type
  const handleEditLoanType = (loanType) => {
    setLoanTypeName(loanType.v_LoanTypeName);
    setLoanTypeStatus(loanType.status);
    setEditMode(true);
    setEditLoanTypeId(loanType.pn_LoanTypeID);
  };

  // Form Validation
  const validationSchema = Yup.object({
    pnCompanyId: Yup.string().required("Please select a Company ID"),
    pnBranchId: Yup.string().required("Please select a Branch ID"),
    vLoanName: Yup.string().required("Loan Name is required"),
    vLoanCode: Yup.string().required("Loan Code is required"),
    vLoanTypeId: Yup.string().required("Select Loan Type"),
    status: Yup.string().required("Status is required"),
  });

  const fetchLoans = async () => {
    if (!pnCompanyId) return;
    try {
      const response = await postRequest(ServerConfig.url, REPORTS, {
        query: `SELECT pn_Companyid, v_LoanName, v_LoanCode, status, Pn_BranchID, v_LoanType FROM [${databaseName}].[dbo].[paym_Loan] WHERE pn_Companyid = '${pnCompanyId}'`,
      });

      const modifiedData = response.data.map((loan) => ({
        ...loan,
        CompanyName:
          company.find((c) => c.pn_CompanyID === loan.pn_Companyid)
            ?.CompanyName || "Unknown Company",
        BranchName:
          branch.find((b) => b.pn_BranchID === loan.Pn_BranchID)?.BranchName ||
          "Unknown Branch",
        id: `${loan.pn_Companyid}-${loan.v_LoanCode}`,
      }));

      setLoanData(modifiedData);
    } catch (err) {
      console.error("Error fetching loan data:", err);
    }
  };

  // Save Loan
  const handleSubmit = async (values, { resetForm }) => {
    try {
      const response = await postRequest(ServerConfig.url, REPORTS, {
        query: `
  INSERT INTO [${databaseName}].[dbo].[paym_Loan]
  ([pn_Companyid], [v_LoanName], [v_LoanCode], [status], [Pn_BranchID], [v_LoanType])
  VALUES ('${values.pnCompanyId}', '${values.vLoanName}', '${values.vLoanCode}', '${values.status}', '${values.pnBranchId}', '${values.vLoanTypeId}')
`,
      });
      if (response?.status === 200) {
        toast.success("Loan saved successfully!");
        fetchLoanTypes();
        resetForm();
        fetchLoans();
      } else toast.error("Failed to save loan!");
    } catch (err) {
      console.error(err);
      toast.error("Error while saving loan!");
    }
  };

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Grid container>
        {/* Navbar */}
        <Grid item xs={12}>
          <Navbar />
        </Grid>

        {/* Sidebar and Main Content */}
        <Grid item xs={12} sx={{ display: "flex", flexDirection: "row" }}>
          {/* Sidebar */}
          <Grid item xs={2} sx={{ display: { xs: "none", sm: "block" } }}>
            {" "}
            {/* Hide on small screens */}
            <Sidenav />
          </Grid>

          {/* Main Content */}
          <Grid
            item
            xs={12}
            sm={10}
            sx={{ overflowY: "auto", margin: "0 auto", marginTop: "60px" }}
          >
            <Card style={{ maxWidth: 1100, width: "100%" }}>
              <CardContent>
                <Box sx={{ position: "relative", marginBottom: "20px" }}>
                  <AppBar
                    position="static"
                    color=""
                    elevation={1}
                    sx={{
                      mb: 2,
                      minHeight: "70px",
                      backgroundColor: "#0077d4",
                    }}
                  >
                    <Toolbar>
                      <Typography
                        variant="h5"
                        gutterBottom
                        component="div"
                        sx={{
                          flexGrow: 1,
                          textAlign: "left",
                          fontWeight: "bold",
                          color: "white",
                        }}
                      >
                        LOAN MASTER
                      </Typography>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => setOpenLoanTypeDialog(true)}
                        sx={{ backgroundColor: "#fff", color: "#0077d4" }}
                      >
                        + Add Loan Type
                      </Button>
                    </Toolbar>
                  </AppBar>
                </Box>

                <Formik
                  initialValues={{
                    pnCompanyId: pnCompanyId || "",
                    pnBranchId: "",
                    vLoanName: "",
                    vLoanCode: "",
                    vLoanTypeId: "",
                    status: "",
                  }}
                  validationSchema={validationSchema}
                  onSubmit={(values, { resetForm }) =>
                    handleSubmit(values, { resetForm })
                  }
                  enableReinitialize
                >
                  {({
                    values,
                    handleChange,
                    handleBlur,
                    errors,
                    touched,
                    resetForm,
                  }) => (
                    <Form>
                      <Grid container spacing={2} sx={{ marginTop: "20px" }}>
                        <Grid item xs={12} sm={6}>
                          <FormControl
                            fullWidth
                            error={
                              touched.pnCompanyId && Boolean(errors.pnCompanyId)
                            }
                          >
                            <TextField
                              value={
                                company.find(
                                  (c) => c.pn_CompanyID === values.pnCompanyId
                                )?.CompanyName || ""
                              }
                              variant="outlined"
                              fullWidth
                              label="Company Name"
                              InputLabelProps={{
                                shrink: true,
                                sx: {
                                  color: "black", // Always set label color to black
                                  "&.Mui-focused": {
                                    color: "black", // Keep label color black when focused
                                  },
                                  "&.Mui-error": {
                                    color: "black", // Keep label color black when there's an error
                                  },
                                },
                              }}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  backgroundColor: "#fff",
                                  borderRadius: "10px", // This sets the input background to white
                                  "& fieldset": {
                                    borderWidth: "2px",
                                    borderRadius: "8px",
                                  },
                                  "&:hover fieldset": {
                                    borderColor: "black",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "black",
                                  },
                                  "&.Mui-error fieldset": {
                                    borderColor: "black",
                                  },
                                },
                              }}
                            />
                            {touched.pnCompanyId && errors.pnCompanyId && (
                              <FormHelperText sx={{ color: "error.main" }}>
                                {errors.pnCompanyId}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl
                            fullWidth
                            error={
                              touched.pnBranchId && Boolean(errors.pnBranchId)
                            }
                          >
                            <InputLabel
                              id="branch-select-label"
                              sx={{
                                color: "black", // Always set label color to black
                                "&.Mui-focused": {
                                  color: "black", // Keep label color black when focused
                                },
                                "&.Mui-error": {
                                  color: "black", // Keep label color black when there's an error
                                },
                              }}
                            >
                              Select a Branch
                            </InputLabel>
                            <Select
                              name="pnBranchId"
                              value={values.pnBranchId}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              displayEmpty
                              labelId="branch-select-label" // Link the label to the select
                              sx={{
                                borderRadius: "10px",
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "gray",
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "black",
                                },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                  {
                                    borderColor: "black",
                                  },
                                "&.Mui-error .MuiOutlinedInput-notchedOutline":
                                  {
                                    borderColor: "black",
                                  },
                              }}
                            >
                              {branch.map((b) => (
                                <MenuItem
                                  key={b.pn_BranchID}
                                  value={b.pn_BranchID}
                                >
                                  {b.BranchName}
                                </MenuItem>
                              ))}
                            </Select>
                            {touched.pnBranchId && errors.pnBranchId && (
                              <FormHelperText sx={{ color: "error.main" }}>
                                {errors.pnBranchId}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl
                            fullWidth
                            error={
                              touched.vLoanCode && Boolean(errors.vLoanCode)
                            }
                          >
                            <TextField
                              name="vLoanCode"
                              label={
                                <span>
                                  Loan Code
                                  <span
                                    style={{
                                      color: "red",
                                      marginLeft: "0.2rem",
                                    }}
                                  >
                                    *
                                  </span>
                                </span>
                              }
                              variant="outlined"
                              fullWidth
                              value={values.vLoanCode}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              InputLabelProps={{
                                shrink: true,
                                sx: {
                                  color: "black", // Always set label color to black
                                  "&.Mui-focused": {
                                    color: "black", // Keep label color black when focused
                                  },
                                  "&.Mui-error": {
                                    color: "black", // Keep label color black when there's an error
                                  },
                                },
                              }}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  backgroundColor: "#fff",
                                  borderRadius: "10px", // This sets the input background to white
                                  "& fieldset": {
                                    borderWidth: "2px",
                                    borderRadius: "8px",
                                  },
                                  "&:hover fieldset": {
                                    borderColor: "black",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "black",
                                  },
                                  "&.Mui-error fieldset": {
                                    borderColor: "black",
                                  },
                                },
                              }}
                            />
                            {touched.vLoanCode && errors.vLoanCode && (
                              <FormHelperText sx={{ color: "error.main" }}>
                                {errors.vLoanCode}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl
                            fullWidth
                            error={
                              touched.vLoanName && Boolean(errors.vLoanName)
                            }
                          >
                            <TextField
                              name="vLoanName"
                              label={
                                <span>
                                  Loan Name
                                  <span
                                    style={{
                                      color: "red",
                                      marginLeft: "0.2rem",
                                    }}
                                  >
                                    *
                                  </span>
                                </span>
                              }
                              variant="outlined"
                              fullWidth
                              value={values.vLoanName}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              InputLabelProps={{
                                shrink: true,
                                sx: {
                                  color: "black", // Always set label color to black
                                  "&.Mui-focused": {
                                    color: "black", // Keep label color black when focused
                                  },
                                  "&.Mui-error": {
                                    color: "black", // Keep label color black when there's an error
                                  },
                                },
                              }}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  backgroundColor: "#fff",
                                  borderRadius: "10px", // This sets the input background to white
                                  "& fieldset": {
                                    borderWidth: "2px",
                                    borderRadius: "8px",
                                  },
                                  "&:hover fieldset": {
                                    borderColor: "black",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "black",
                                  },
                                  "&.Mui-error fieldset": {
                                    borderColor: "black",
                                  },
                                },
                              }}
                            />
                            {touched.vLoanName && errors.vLoanName && (
                              <FormHelperText sx={{ color: "error.main" }}>
                                {errors.vLoanName}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                        {/* Loan Type Dropdown */}{" "}
                        <Grid item xs={12} sm={6}>
                          {" "}
                          <FormControl fullWidth>
                            {" "}
                            <InputLabel>Loan Type</InputLabel>{" "}
                            <Select
                              name="vLoanTypeId"
                              value={values.vLoanTypeId}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={
                                touched.vLoanTypeId &&
                                Boolean(errors.vLoanTypeId)
                              }
                            >
                              {" "}
                              {Array.isArray(loanTypes) &&
                                loanTypes.map((type) => (
                                  <MenuItem
                                    key={type.pn_LoanTypeID}
                                    value={type.pn_LoanTypeID}
                                  >
                                    {type.v_LoanTypeName}
                                  </MenuItem>
                                ))}{" "}
                            </Select>{" "}
                            {touched.vLoanTypeId && errors.vLoanTypeId && (
                              <FormHelperText error>
                                {" "}
                                {errors.vLoanTypeId}{" "}
                              </FormHelperText>
                            )}{" "}
                          </FormControl>{" "}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl
                            fullWidth
                            error={touched.status && Boolean(errors.status)}
                          >
                            <InputLabel
                              shrink
                              sx={{
                                color: "black",
                                "&.Mui-focused": { color: "black" },
                                "&.Mui-error": { color: "black" },
                              }}
                            >
                              Status{" "}
                              <span
                                style={{ color: "red", marginLeft: "0.2rem" }}
                              >
                                *
                              </span>
                            </InputLabel>

                            <Select
                              name="status"
                              value={values.status}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              displayEmpty
                              variant="outlined"
                              sx={{
                                backgroundColor: "#fff",
                                borderRadius: "10px",
                                textAlign: "left", // ✅ align text to left
                                "& .MuiSelect-select": {
                                  textAlign: "left", // ✅ ensure menu value stays left aligned
                                  // paddingY: "10px",
                                },
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#d3d3d3",
                                  borderWidth: "2px",
                                  borderRadius: "8px",
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "black",
                                },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                  {
                                    borderColor: "black",
                                  },
                                "&.Mui-error .MuiOutlinedInput-notchedOutline":
                                  {
                                    borderColor: "black",
                                  },
                              }}
                            >
                              <MenuItem value="">Select Status</MenuItem>
                              <MenuItem value="Active">Active</MenuItem>
                              <MenuItem value="Inactive">Inactive</MenuItem>
                            </Select>

                            {touched.status && errors.status && (
                              <FormHelperText sx={{ color: "error.main" }}>
                                {errors.status}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} align="right">
                          <Button
                            style={{ margin: "0 5px" }}
                            type="submit"
                            variant="contained"
                            color="primary"
                          >
                            SAVE
                          </Button>
                        </Grid>
                      </Grid>
                    </Form>
                  )}
                </Formik>

                <DataGrid
                  rows={loanData}
                  columns={columns}
                  className="custom-row-height"
                  getRowId={(row) => `${row.pn_Companyid}-${row.v_LoanCode}`}
                  getRowClassName={(params) =>
                    params.indexRelativeToCurrentPage % 2 === 0
                      ? "even-row"
                      : "odd-row"
                  }
                  sx={{
                    marginTop: "20px",
                    "& .even-row": {
                      backgroundColor: "#cde3f2", // Light blue for even rows
                      "&:hover": {
                        backgroundColor: "#c0dbed", // White on hover
                      },
                    },
                    "& .odd-row": {
                      backgroundColor: "#ffffff", // White for odd rows
                      "&:hover": {
                        backgroundColor: "#c0dbed", // Keep white on hover
                      },
                    },
                    "& .MuiDataGrid-columnHeader": {
                      backgroundColor: "#f4f2f2", // Set header background color to gray
                      color: "black", // Optional: Set header text color to white for contrast
                    },
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Loan</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Loan Name"
            value={editLoanData?.v_LoanName || ""}
            onChange={(e) =>
              setEditLoanData({ ...editLoanData, v_LoanName: e.target.value })
            }
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Loan Type</InputLabel>
            <Select
              value={editLoanData?.v_LoanTypeId || ""} // use ID
              onChange={(e) =>
                setEditLoanData({
                  ...editLoanData,
                  v_LoanTypeId: e.target.value, // store ID
                  v_LoanType: loanTypes.find(
                    (t) => t.pn_LoanTypeID === e.target.value
                  )?.v_LoanTypeName, // optional: keep name for display
                })
              }
            >
              {loanTypes.map((type) => (
                <MenuItem key={type.pn_LoanTypeID} value={type.pn_LoanTypeID}>
                  {type.v_LoanTypeName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              value={editLoanData?.status || ""}
              label="Status"
              onChange={(e) =>
                setEditLoanData({ ...editLoanData, status: e.target.value })
              }
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleUpdateLoan}
            color="primary"
            variant="contained"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openLoanTypeDialog}
        onClose={() => setOpenLoanTypeDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        {" "}
        <DialogTitle>
          {" "}
          {editMode ? "Edit Loan Type" : "Add Loan Type"}{" "}
        </DialogTitle>{" "}
        <DialogContent>
          {" "}
          <TextField
            fullWidth
            label="Loan Type Name"
            value={loanTypeName}
            onChange={(e) => setLoanTypeName(e.target.value)}
            margin="normal"
          />{" "}
          <FormControl fullWidth margin="normal">
            {" "}
            <InputLabel>Status</InputLabel>{" "}
            <Select
              value={loanTypeStatus}
              onChange={(e) => setLoanTypeStatus(e.target.value)}
            >
              {" "}
              <MenuItem value="Active">Active</MenuItem>{" "}
              <MenuItem value="Inactive">Inactive</MenuItem>{" "}
            </Select>{" "}
          </FormControl>{" "}
          <Typography variant="h6" sx={{ mt: 3 }}>
            {" "}
            Existing Loan Types{" "}
          </Typography>{" "}
          <DataGrid
            rows={(loanTypes || []).map((t) => ({ ...t, id: t.pn_LoanTypeID }))}
            columns={[
              { field: "v_LoanTypeName", headerName: "Loan Type", width: 200 },
              { field: "status", headerName: "Status", width: 150 },
              {
                field: "actions",
                headerName: "Actions",
                width: 150,
                renderCell: (params) => (
                  <>
                    {" "}
                    <IconButton
                      color="primary"
                      onClick={() => handleEditLoanType(params.row)}
                    >
                      {" "}
                      <EditIcon />{" "}
                    </IconButton>{" "}
                    <IconButton
                      color="error"
                      onClick={() =>
                        handleDeleteLoanType(params.row.pn_LoanTypeID)
                      }
                    >
                      {" "}
                      <DeleteIcon />{" "}
                    </IconButton>{" "}
                  </>
                ),
              },
            ]}
            autoHeight
            disableRowSelectionOnClick
          />{" "}
        </DialogContent>{" "}
        <DialogActions>
          {" "}
          <Button onClick={() => setOpenLoanTypeDialog(false)}>
            {" "}
            Cancel{" "}
          </Button>{" "}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveLoanType}
          >
            {" "}
            {editMode ? "Update" : "Save"}{" "}
          </Button>{" "}
        </DialogActions>{" "}
      </Dialog>
    </div>
  );
}

// import React, { useState, useEffect } from "react";
// import {
//   Grid,
//   Card,
//   TextField,
//   Button,
//   Typography,
//   FormControl,
//   MenuItem,
//   Select,
//   FormHelperText,
//   Box,
//   Container,
//   CardContent,
//   InputLabel,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   IconButton,
//   AppBar,
//   Toolbar,
// } from "@mui/material";
// import { DataGrid } from "@mui/x-data-grid";
// import { postRequest } from "../../../serverconfiguration/requestcomp";
// import { ServerConfig } from "../../../serverconfiguration/serverconfig";
// import { useNavigate } from "react-router-dom";
// import { REPORTS } from "../../../serverconfiguration/controllers";
// import { toast } from "react-toastify";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import Navbar from "../../Home Page-comapny/Navbar1";
// import Sidenav from "../../Home Page-comapny/Sidenav1";
// import { Formik, Form } from "formik";
// import * as Yup from "yup";

// export default function LoanMaster() {
//   const navigate = useNavigate();
//   const [company, setCompany] = useState([]);
//   const [branch, setBranch] = useState([]);
//   const [pnCompanyId, setPnCompanyId] = useState("");
//   const [isloggedin, setIsloggedin] = useState(sessionStorage.getItem("user"));
//   const [loanData, setLoanData] = useState([]);
//   const [loanTypes, setLoanTypes] = useState([]);

//   const [openLoanTypeDialog, setOpenLoanTypeDialog] = useState(false);
//   const [loanTypeName, setLoanTypeName] = useState("");
//   const [loanTypeStatus, setLoanTypeStatus] = useState("Active");
//   const [editMode, setEditMode] = useState(false);
//   const [editLoanTypeId, setEditLoanTypeId] = useState(null);

//   // Fetch Company
//   useEffect(() => {
//     async function getData() {
//       try {
//         const companyData = await postRequest(ServerConfig.url, REPORTS, {
//           query: `select * from paym_Company where company_user_id = '${isloggedin}'`,
//         });
//         setCompany(companyData.data);
//         if (companyData.data.length > 0) {
//           setPnCompanyId(companyData.data[0].pn_CompanyID);
//         }
//       } catch (error) {
//         console.error("Error fetching company data:", error);
//       }
//     }
//     getData();
//   }, [isloggedin]);

//   // Fetch Branch
//   useEffect(() => {
//     async function getData() {
//       try {
//         const branchData = await postRequest(ServerConfig.url, REPORTS, {
//           query: `select * from paym_branch where pn_CompanyID = '${pnCompanyId}'`,
//         });
//         setBranch(branchData.data);
//       } catch (error) {
//         console.error("Error fetching branch data:", error);
//       }
//     }
//     if (pnCompanyId) getData();
//   }, [pnCompanyId]);

//   // Fetch Loans
//   useEffect(() => {
//     const fetchLoanData = async () => {
//       try {
//         const response = await postRequest(ServerConfig.url, REPORTS, {
//           query: `SELECT pn_Companyid, v_LoanName, v_LoanCode, status, Pn_BranchID FROM [dbo].[paym_Loan] WHERE pn_Companyid = '${pnCompanyId}'`,
//         });

//         const modifiedData = response.data.map((loan) => ({
//           ...loan,
//           CompanyName:
//             company.find((c) => c.pn_CompanyID === loan.pn_Companyid)
//               ?.CompanyName || "Unknown Company",
//           BranchName:
//             branch.find((b) => b.pn_BranchID === loan.Pn_BranchID)
//               ?.BranchName || "Unknown Branch",
//           id: `${loan.pn_Companyid}-${loan.v_LoanCode}`,
//         }));

//         setLoanData(modifiedData);
//       } catch (error) {
//         console.error("Error fetching loan data:", error);
//       }
//     };
//     if (pnCompanyId) fetchLoanData();
//   }, [company, branch]);

//   // Fetch Loan Types
//   const fetchLoanTypes = async () => {
//     try {
//       const res = await postRequest(ServerConfig.url, REPORTS, {
//         query: `SELECT * FROM [dbo].[paym_LoanTypeMaster]`,
//       });
//       setLoanTypes(res.data);
//     } catch (err) {
//       console.error("Error fetching loan types:", err);
//     }
//   };

//   useEffect(() => {
//     fetchLoanTypes();
//   }, []);

//   // Save or Update Loan Type
//   const handleSaveLoanType = async () => {
//     if (!loanTypeName.trim()) {
//       toast.error("Loan Type Name is required!");
//       return;
//     }

//     try {
//       let query = "";
//       if (editMode) {
//         query = `UPDATE [dbo].[paym_LoanTypeMaster]
//                  SET v_LoanTypeName = '${loanTypeName}', status = '${loanTypeStatus}'
//                  WHERE pn_LoanTypeID = '${editLoanTypeId}'`;
//       } else {
//         query = `INSERT INTO [dbo].[paym_LoanTypeMaster] ([v_LoanTypeName], [status])
//                  VALUES ('${loanTypeName}', '${loanTypeStatus}')`;
//       }

//       const res = await postRequest(ServerConfig.url, REPORTS, { query });

//       if (res?.status === 200) {
//         toast.success(editMode ? "Loan Type updated!" : "Loan Type added!");
//         setLoanTypeName("");
//         setLoanTypeStatus("Active");
//         setEditMode(false);
//         setEditLoanTypeId(null);
//         fetchLoanTypes();
//       } else {
//         toast.error("Failed to save Loan Type!");
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Error while saving Loan Type!");
//     }
//   };

//   // Delete Loan Type
//   const handleDeleteLoanType = async (id) => {
//     try {
//       const res = await postRequest(ServerConfig.url, REPORTS, {
//         query: `DELETE FROM [dbo].[paym_LoanTypeMaster] WHERE pn_LoanTypeID = '${id}'`,
//       });
//       if (res?.status === 200) {
//         toast.success("Loan Type deleted!");
//         fetchLoanTypes();
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Error deleting Loan Type!");
//     }
//   };

//   // Edit Loan Type
//   const handleEditLoanType = (loanType) => {
//     setLoanTypeName(loanType.v_LoanTypeName);
//     setLoanTypeStatus(loanType.status);
//     setEditMode(true);
//     setEditLoanTypeId(loanType.pn_LoanTypeID);
//   };

//   // Form Validation
//   const validationSchema = Yup.object({
//     pnCompanyId: Yup.string().required("Please select a Company ID"),
//     pnBranchId: Yup.string().required("Please select a Branch ID"),
//     vLoanName: Yup.string().required("Loan Name is required"),
//     vLoanCode: Yup.string().required("Loan Code is required"),
//     vLoanTypeId: Yup.string().required("Select Loan Type"),
//     status: Yup.string().required("Status is required"),
//   });

//   // Save Loan
//   const handleSubmit = async (values, { resetForm }) => {
//     try {
//       const response = await postRequest(ServerConfig.url, REPORTS, {
//         query: `INSERT INTO [dbo].[paym_Loan]
//                 ([pn_Companyid], [v_LoanName], [v_LoanCode], [status], [Pn_BranchID], [v_LoanTypeID])
//               VALUES
//                 ('${values.pnCompanyId}', '${values.vLoanName}', '${values.vLoanCode}', '${values.status}', '${values.pnBranchId}', '${values.vLoanTypeId}')`,
//       });

//       if (response?.status === 200) {
//         toast.success("Loan saved successfully!");
//         fetchLoanTypes();
//         resetForm();
//       } else toast.error("Failed to save loan!");
//     } catch (err) {
//       console.error(err);
//       toast.error("Error while saving loan!");
//     }
//   };

//   return (
//     <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
//       <Grid container>
//         <Grid item xs={12}>
//           <Navbar />
//         </Grid>
//         <Grid item xs={12} sx={{ display: "flex", flexDirection: "row" }}>
//           <Grid item xs={2} sx={{ display: { xs: "none", sm: "block" } }}>
//             <Sidenav />
//           </Grid>

//           <Grid item xs={12} sm={10} sx={{ marginTop: "60px" }}>
//             <Card sx={{ maxWidth: 1100, width: "100%", p: 2 }}>
//               <CardContent>
//                 <AppBar
//                   position="static"
//                   sx={{ mb: 2, backgroundColor: "#0077d4" }}
//                 >
//                   <Toolbar>
//                     <Typography
//                       variant="h5"
//                       sx={{ flexGrow: 1, color: "white", fontWeight: "bold" }}
//                     >
//                       LOAN MASTER
//                     </Typography>
//                     <Button
//                       variant="contained"
//                       onClick={() => setOpenLoanTypeDialog(true)}
//                       sx={{ backgroundColor: "#fff", color: "#0077d4" }}
//                     >
//                       + Add Loan Type
//                     </Button>
//                   </Toolbar>
//                 </AppBar>

//                 {/* FORM */}
//                 <Formik
//                   initialValues={{
//                     pnCompanyId: pnCompanyId || "",
//                     pnBranchId: "",
//                     vLoanName: "",
//                     vLoanCode: "",
//                     vLoanTypeId: "",
//                     status: "",
//                   }}
//                   validationSchema={validationSchema}
//                   onSubmit={handleSubmit}
//                   enableReinitialize
//                 >
//                   {({
//                     values,
//                     handleChange,
//                     handleBlur,
//                     errors,
//                     touched,
//                     resetForm,
//                   }) => (
//                     <Form>
//                       <Grid container spacing={2}>
//                         {/* Loan Name */}
//                         <Grid item xs={12} sm={6}>
//                           <TextField
//                             name="vLoanName"
//                             label="Loan Name"
//                             fullWidth
//                             variant="outlined"
//                             value={values.vLoanName}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             error={touched.vLoanName && Boolean(errors.vLoanName)}
//                             helperText={touched.vLoanName && errors.vLoanName}
//                           />
//                         </Grid>

//                         {/* Loan Type Dropdown */}
//                         <Grid item xs={12} sm={6}>
//                           <FormControl fullWidth>
//                             <InputLabel>Loan Type</InputLabel>
//                             <Select
//                               name="vLoanTypeId"
//                               value={values.vLoanTypeId}
//                               onChange={handleChange}
//                               onBlur={handleBlur}
//                               error={
//                                 touched.vLoanTypeId && Boolean(errors.vLoanTypeId)
//                               }
//                             >
//                               {loanTypes.map((type) => (
//                                 <MenuItem
//                                   key={type.pn_LoanTypeID}
//                                   value={type.pn_LoanTypeID}
//                                 >
//                                   {type.v_LoanTypeName}
//                                 </MenuItem>
//                               ))}
//                             </Select>
//                             {touched.vLoanTypeId && errors.vLoanTypeId && (
//                               <FormHelperText error>
//                                 {errors.vLoanTypeId}
//                               </FormHelperText>
//                             )}
//                           </FormControl>
//                         </Grid>
//                       </Grid>

//                       <Grid item xs={12} align="right" sx={{ mt: 2 }}>
//                         <Button type="submit" variant="contained" color="primary">
//                           SAVE
//                         </Button>
//                       </Grid>
//                     </Form>
//                   )}
//                 </Formik>

//                 {/* Add Loan Type Dialog */}
//                 <Dialog
//                   open={openLoanTypeDialog}
//                   onClose={() => setOpenLoanTypeDialog(false)}
//                   fullWidth
//                   maxWidth="sm"
//                 >
//                   <DialogTitle>
//                     {editMode ? "Edit Loan Type" : "Add Loan Type"}
//                   </DialogTitle>
//                   <DialogContent>
//                     <TextField
//                       fullWidth
//                       label="Loan Type Name"
//                       value={loanTypeName}
//                       onChange={(e) => setLoanTypeName(e.target.value)}
//                       margin="normal"
//                     />
//                     <FormControl fullWidth margin="normal">
//                       <InputLabel>Status</InputLabel>
//                       <Select
//                         value={loanTypeStatus}
//                         onChange={(e) => setLoanTypeStatus(e.target.value)}
//                       >
//                         <MenuItem value="Active">Active</MenuItem>
//                         <MenuItem value="Inactive">Inactive</MenuItem>
//                       </Select>
//                     </FormControl>

//                     <Typography variant="h6" sx={{ mt: 3 }}>
//                       Existing Loan Types
//                     </Typography>
//                     <DataGrid
//                       rows={loanTypes.map((t) => ({
//                         ...t,
//                         id: t.pn_LoanTypeID,
//                       }))}
//                       columns={[
//                         { field: "v_LoanTypeName", headerName: "Loan Type", width: 200 },
//                         { field: "status", headerName: "Status", width: 150 },
//                         {
//                           field: "actions",
//                           headerName: "Actions",
//                           width: 150,
//                           renderCell: (params) => (
//                             <>
//                               <IconButton
//                                 color="primary"
//                                 onClick={() => handleEditLoanType(params.row)}
//                               >
//                                 <EditIcon />
//                               </IconButton>
//                               <IconButton
//                                 color="error"
//                                 onClick={() =>
//                                   handleDeleteLoanType(params.row.pn_LoanTypeID)
//                                 }
//                               >
//                                 <DeleteIcon />
//                               </IconButton>
//                             </>
//                           ),
//                         },
//                       ]}
//                       autoHeight
//                       disableRowSelectionOnClick
//                     />
//                   </DialogContent>
//                   <DialogActions>
//                     <Button onClick={() => setOpenLoanTypeDialog(false)}>
//                       Cancel
//                     </Button>
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       onClick={handleSaveLoanType}
//                     >
//                       {editMode ? "Update" : "Save"}
//                     </Button>
//                   </DialogActions>
//                 </Dialog>
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>
//       </Grid>
//     </div>
//   );
// }
