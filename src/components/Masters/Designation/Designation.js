// import React, { useState, useEffect } from "react";
// import { REPORTS, SAVE } from "../../../serverconfiguration/controllers";
// import { postRequest } from "../../../serverconfiguration/requestcomp";
// import { ServerConfig } from "../../../serverconfiguration/serverconfig";
// import Sidenav from "../../Home Page/Sidenav";
// import Navbar from "../../Home Page/Navbar";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Button,
//   Grid,
//   Card,
//   Container,
//   CardContent,
//   Box,
//   TextField,
//   Select,
//   MenuItem,
//   FormControl,
// } from "@material-ui/core";
// import { useNavigate, useLocation } from "react-router-dom";
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const DesignationMaster = () => {
//   const location = useLocation();
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [designationId, setDesignationId] = useState(null);
//   const [isLoggedin] = useState(sessionStorage.getItem("user"));
//   const [loggedBranch, setloggedBranch] = useState([]);
//   const [loggedCompany, setloggedCompany] = useState([]);
//   const navigate = useNavigate();
//   const [originalData, setOriginalData] = useState(null);
//   const [submissionError, setSubmissionError] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [formData, setFormData] = useState({
//     pn_BranchID: "",
//     pn_CompanyID: "",
//     v_DesignationName: "",
//     Authority: "",
//     status: "A",
//   });

//   const [errors, setErrors] = useState({
//     v_DesignationName: '',
//     Authority: '',
//     status: ''
//   });

//   useEffect(() => {
//     if (location.state?.designationData) {
//       const { designationData } = location.state;
//       setIsEditMode(true);
//       setDesignationId(designationData.pn_DesignationID);
//       const initialData = {
//         pn_BranchID: designationData.BranchID,
//         pn_CompanyID: designationData.pn_CompanyID,
//         v_DesignationName: designationData.v_DesignationName,
//         Authority: designationData.Authority,
//         status: designationData.status,
//       };
//       setFormData(initialData);
//       setOriginalData(initialData);
//     }
//   }, [location.state]);

//   const hasFormChanged = () => {
//     if (!isEditMode || !originalData) return true;
//     return (
//       formData.v_DesignationName !== originalData.v_DesignationName ||
//       formData.Authority !== originalData.Authority ||
//       formData.status !== originalData.status
//     );
//   };

//   useEffect(() => {
//     async function fetchInitialData() {
//       try {
//         const loggedBranchData = await postRequest(ServerConfig.url, REPORTS, {
//           query: `SELECT * FROM paym_Branch WHERE Branch_User_Id = '${isLoggedin}'`,
//         });

//         if (loggedBranchData.data) {
//           setloggedBranch(loggedBranchData.data);
//           if (!isEditMode) {
//             setFormData(prev => ({
//               ...prev,
//               pn_BranchID: loggedBranchData.data[0]?.pn_BranchID || ""
//             }));
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching branch data:", error);
//         toast.error("Failed to load branch data");
//       }
//     }

//     if (isLoggedin) fetchInitialData();
//   }, [isLoggedin, isEditMode]);

//   useEffect(() => {
//     async function fetchLoggedCompany() {
//       try {
//         if (loggedBranch.length > 0) {
//           const loggedCompanyData = await postRequest(ServerConfig.url, REPORTS, {
//             query: `SELECT * FROM paym_Company WHERE pn_CompanyID = ${loggedBranch[0].pn_CompanyID}`,
//           });

//           if (loggedCompanyData.data) {
//             setloggedCompany(loggedCompanyData.data);
//             if (!isEditMode) {
//               setFormData(prev => ({
//                 ...prev,
//                 pn_CompanyID: loggedCompanyData.data[0]?.pn_CompanyID || ""
//               }));
//             }
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching company data:", error);
//         toast.error("Failed to load company data");
//       }
//     }

//     if (loggedBranch.length > 0) fetchLoggedCompany();
//   }, [loggedBranch, isEditMode]);

//   const validateForm = (name, value) => {
//     switch (name) {
//       case 'v_DesignationName':
//         if (!value.trim()) return 'Designation Name is required';
//         if (!/^[a-zA-Z\s\-()]+$/.test(value)) return 'Only letters, spaces, hyphens and parentheses allowed';
//         if (value.length > 50) return 'Maximum 50 characters allowed';
//         return '';
//       case 'Authority':
//         if (!value.trim()) return 'Authority is required';
//         if (value.length > 100) return 'Maximum 100 characters allowed';
//         return '';
//       case 'status':
//         if (!value) return 'Status is required';
//         return '';
//       default:
//         return '';
//     }
//   };

//   const validateAllFields = () => {
//     const newErrors = {
//       v_DesignationName: validateForm('v_DesignationName', formData.v_DesignationName),
//       Authority: validateForm('Authority', formData.Authority),
//       status: validateForm('status', formData.status)
//     };

//     setErrors(newErrors);
//     return Object.values(newErrors).every(error => error === '');
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setSubmissionError('');
//   setIsSubmitting(true);

//   if (!validateAllFields()) {
//     toast.error('Please fix all validation errors before submitting', {
//       position: "top-center",
//       autoClose: 1000,
//     });
//     setIsSubmitting(false);
//     return;
//   }

//   if (isEditMode && !hasFormChanged()) {
//     toast.error('No changes detected to update', {
//       position: "top-center",
//       autoClose: 1000,
//     });
//     setIsSubmitting(false);
//     return;
//   }

//   try {
//     const query = isEditMode
//       ? `UPDATE [dbo].[paym_Designation] SET
//           v_DesignationName = '${formData.v_DesignationName}',
//           Authority = '${formData.Authority}',
//           status = '${formData.status.toUpperCase()}'
//          WHERE pn_DesignationID = ${designationId}`
//       : `INSERT INTO [dbo].[paym_Designation]
//           (pn_CompanyID, BranchID, v_DesignationName, Authority, status)
//          VALUES (${formData.pn_CompanyID}, ${formData.pn_BranchID},
//                 '${formData.v_DesignationName}', '${formData.Authority}',
//                 '${formData.status.toUpperCase()}')`;

//     const response = await postRequest(ServerConfig.url, SAVE, { query });

//     if (response?.data === 1 || response?.success) {
//       if (isEditMode) {
//         toast.success(`Data updated successfully!`, {
//           position: "top-center",
//           autoClose: 1000,
//         });
//       } else {
//         toast.info(`Data saved successfully!`, {
//           position: "top-center",
//           autoClose: 1000,
//         });
//       }
//       setTimeout(() => navigate("/DesignationHome"), 1000);
//     } else {
//       throw new Error(response?.message || 'Operation failed');
//     }
//   } catch (error) {
//     console.error(`Error ${isEditMode ? 'updating' : 'adding'} Designation:`, error);
//     toast.error(error.message || `Failed to ${isEditMode ? 'update' : 'add'} Designation`, {
//       position: "top-center",
//       autoClose: 1000,
//     });
//   } finally {
//     setIsSubmitting(false);
//   }
// };

//   return (
//     <Grid container>
//       <Grid item xs={12}>
//         <div style={{ backgroundColor: "#f5f5f5" }}>
//           <Navbar />
//           <Box height={30} />
//           <Box sx={{ display: "flex" }}>
//             <Sidenav />
//             <Grid item xs={12} sm={10} md={9} lg={8} xl={7} style={{ margin: "0 auto" }}>
//               <Container maxWidth="md" sx={{ p: 2 }}>
//                 <Grid style={{ padding: '80px 5px 0 5px' }}>
//                   <Card style={{ maxWidth: 600, margin: '0 auto' }}>
//                     <CardContent>
//                     <AppBar
//   position="static"
//   style={{
//     background: "#3278d3",
//     width: "120vw",       // make it wider than viewport
//     marginLeft: "-34px",  // shift to the left
//     marginRight: "auto",
//     marginBottom: "10px",
//     marginTop: "-15px",
//   }}
// >
//   <Toolbar>
//     <Typography variant="h5" style={{ color: "#fff" }}>
//       {isEditMode ? "EDIT DESIGNATION" : "ADD NEW DESIGNATION"}
//     </Typography>
//   </Toolbar>
// </AppBar>

//                       {/* Display submission error at the top */}
//                       {submissionError && (
//                         <Box sx={{
//                           backgroundColor: '#ffebee',
//                           padding: '16px',
//                           borderRadius: '4px',
//                           marginBottom: '20px'
//                         }}>
//                           <Typography
//                             variant="body1"
//                             color="error"
//                             sx={{ fontWeight: 'medium' }}
//                           >
//                             {submissionError}
//                           </Typography>
//                         </Box>
//                       )}

//                       <form onSubmit={handleSubmit}>
//                         <Grid item xs={12} style={{ padding: "20px 20px 0 20px" }}>
//                           <Typography gutterBottom style={{ textAlign: "left", paddingBottom: "10px" }}>
//                             Designation Name
//                           </Typography>
//                           <FormControl fullWidth error={!!errors.v_DesignationName}>
//                             <TextField
//                               name="v_DesignationName"
//                               value={formData.v_DesignationName}
//                               onChange={handleChange}
//                               fullWidth
//                               variant="outlined"
//                               error={!!errors.v_DesignationName}
//                                 className="custom-readonly-textfield"
//                             />
//                           </FormControl>
//                         </Grid>

//                         <Grid item xs={12} style={{ padding: "20px 20px 0 20px" }}>
//                           <Typography gutterBottom style={{ textAlign: "left", paddingBottom: "10px" }}>
//                             Authority
//                           </Typography>
//                           <FormControl fullWidth error={!!errors.Authority}>
//                             <TextField
//                               name="Authority"
//                               value={formData.Authority}
//                               onChange={handleChange}
//                               fullWidth
//                               variant="outlined"
//                               error={!!errors.Authority}
//                                 className="custom-readonly-textfield"
//                             />
//                           </FormControl>
//                         </Grid>

//                         <Grid item xs={12} style={{ padding: "20px" }}>
//                           <Typography gutterBottom style={{ textAlign: "left", paddingBottom: "10px" }}>
//                             Status
//                           </Typography>
//                           <FormControl fullWidth error={!!errors.status}
//                            className="custom-readonly-textfield">
//                             <Select
//                               name="status"
//                               value={formData.status}
//                               onChange={handleChange}
//                               variant="outlined"

//                               error={!!errors.status}
//                             >
//                               <MenuItem value="A">Active</MenuItem>
//                               <MenuItem value="I">Inactive</MenuItem>
//                             </Select>
//                           </FormControl>
//                         </Grid>

//                         <Grid item align="right" style={{ padding: "18px" }}>
//                           <Button
//                             type="submit"
//                             variant="contained"
//                             color="primary"
//                             disabled={isSubmitting}
//                           >
//                             {isSubmitting ? 'Processing...' : isEditMode ? 'Update' : 'Submit'}
//                           </Button>
//                         </Grid>
//                       </form>
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               </Container>
//             </Grid>
//           </Box>
//         </div>
//       </Grid>
//     </Grid>
//   );
// };

// export default DesignationMaster;

import React, { useState, useEffect } from "react";
import { REPORTS, SAVE } from "../../../serverconfiguration/controllers";
import { postRequest } from "../../../serverconfiguration/requestcomp";
import { ServerConfig } from "../../../serverconfiguration/serverconfig";
import Sidenav from "../../Home Page/Sidenav";
import Navbar from "../../Home Page/Navbar";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Grid,
  Card,
  Container,
  CardContent,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
} from "@material-ui/core";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DesignationMaster = () => {
  const location = useLocation();
  const [isEditMode, setIsEditMode] = useState(false);
  const [designationId, setDesignationId] = useState(null);
  const [isLoggedin] = useState(sessionStorage.getItem("user"));
  const [loggedBranch, setloggedBranch] = useState([]);
  const [loggedCompany, setloggedCompany] = useState([]);
  const navigate = useNavigate();
  const [originalData, setOriginalData] = useState(null);
  const [submissionError, setSubmissionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    pn_BranchID: "",
    pn_CompanyID: "",
    v_DesignationName: "",
    Authority: "",
    status: "A",
  });

  const [errors, setErrors] = useState({
    v_DesignationName: "",
    Authority: "",
    status: "",
  });

  // ✅ Get database name
  const databaseName = sessionStorage.getItem("databaseName");

  useEffect(() => {
    if (location.state?.designationData) {
      const { designationData } = location.state;
      setIsEditMode(true);
      setDesignationId(designationData.pn_DesignationID);
      const initialData = {
        pn_BranchID: designationData.BranchID,
        pn_CompanyID: designationData.pn_CompanyID,
        v_DesignationName: designationData.v_DesignationName,
        Authority: designationData.Authority,
        status: designationData.status,
      };
      setFormData(initialData);
      setOriginalData(initialData);
    }
  }, [location.state]);

  const hasFormChanged = () => {
    if (!isEditMode || !originalData) return true;
    return (
      formData.v_DesignationName !== originalData.v_DesignationName ||
      formData.Authority !== originalData.Authority ||
      formData.status !== originalData.status
    );
  };

  useEffect(() => {
    async function fetchInitialData() {
      try {
        if (!databaseName) {
          console.warn("⚠️ Missing database name");
          return;
        }

        const branchQuery = `
          SELECT * 
          FROM [${databaseName}].[dbo].[paym_Branch]
          WHERE Branch_User_Id = '${isLoggedin}';
        `;

        const loggedBranchData = await postRequest(ServerConfig.url, REPORTS, {
          query: branchQuery,
        });

        if (loggedBranchData.data) {
          setloggedBranch(loggedBranchData.data);
          if (!isEditMode) {
            setFormData((prev) => ({
              ...prev,
              pn_BranchID: loggedBranchData.data[0]?.pn_BranchID || "",
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching branch data:", error);
        toast.error("Failed to load branch data");
      }
    }

    if (isLoggedin) fetchInitialData();
  }, [isLoggedin, isEditMode, databaseName]);

  useEffect(() => {
    async function fetchLoggedCompany() {
      try {
        if (loggedBranch.length > 0 && databaseName) {
          const companyQuery = `
            SELECT * 
            FROM [${databaseName}].[dbo].[paym_Company]
            WHERE pn_CompanyID = ${loggedBranch[0].pn_CompanyID};
          `;

          const loggedCompanyData = await postRequest(
            ServerConfig.url,
            REPORTS,
            {
              query: companyQuery,
            }
          );

          if (loggedCompanyData.data) {
            setloggedCompany(loggedCompanyData.data);
            if (!isEditMode) {
              setFormData((prev) => ({
                ...prev,
                pn_CompanyID: loggedCompanyData.data[0]?.pn_CompanyID || "",
              }));
            }
          }
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
        toast.error("Failed to load company data");
      }
    }

    if (loggedBranch.length > 0) fetchLoggedCompany();
  }, [loggedBranch, isEditMode, databaseName]);

  const validateForm = (name, value) => {
    switch (name) {
      case "v_DesignationName":
        if (!value.trim()) return "Designation Name is required";
        if (!/^[a-zA-Z\s\-()]+$/.test(value))
          return "Only letters, spaces, hyphens and parentheses allowed";
        if (value.length > 50) return "Maximum 50 characters allowed";
        return "";
      case "Authority":
        if (!value.trim()) return "Authority is required";
        if (value.length > 100) return "Maximum 100 characters allowed";
        return "";
      case "status":
        if (!value) return "Status is required";
        return "";
      default:
        return "";
    }
  };

  const validateAllFields = () => {
    const newErrors = {
      v_DesignationName: validateForm(
        "v_DesignationName",
        formData.v_DesignationName
      ),
      Authority: validateForm("Authority", formData.Authority),
      status: validateForm("status", formData.status),
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionError("");
    setIsSubmitting(true);

    if (!validateAllFields()) {
      toast.error("Please fix all validation errors before submitting", {
        position: "top-center",
        autoClose: 1000,
      });
      setIsSubmitting(false);
      return;
    }

    if (isEditMode && !hasFormChanged()) {
      toast.error("No changes detected to update", {
        position: "top-center",
        autoClose: 1000,
      });
      setIsSubmitting(false);
      return;
    }

    try {
      if (!databaseName) {
        toast.error("Database name missing. Please log in again.");
        return;
      }

      const query = isEditMode
        ? `
          UPDATE [${databaseName}].[dbo].[paym_Designation]
          SET v_DesignationName = '${formData.v_DesignationName}',
              Authority = '${formData.Authority}',
              status = '${formData.status.toUpperCase()}'
          WHERE pn_DesignationID = ${designationId};
        `
        : `
          INSERT INTO [${databaseName}].[dbo].[paym_Designation]
            (pn_CompanyID, BranchID, v_DesignationName, Authority, status)
          VALUES (
            ${formData.pn_CompanyID},
            ${formData.pn_BranchID},
            '${formData.v_DesignationName}',
            '${formData.Authority}',
            '${formData.status.toUpperCase()}'
          );
        `;

      const response = await postRequest(ServerConfig.url, SAVE, { query });

      if (response?.data === 1 || response?.success) {
        toast.success(
          isEditMode
            ? "Designation updated successfully!"
            : "Designation added successfully!",
          { position: "top-center", autoClose: 1000 }
        );
        setTimeout(() => navigate("/DesignationHome"), 1000);
      } else {
        throw new Error(response?.message || "Operation failed");
      }
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "adding"} Designation:`,
        error
      );
      toast.error(
        error.message ||
          `Failed to ${isEditMode ? "update" : "add"} Designation`,
        { position: "top-center", autoClose: 1000 }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Grid container>
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
              style={{ margin: "0 auto" }}
            >
              <Container maxWidth="md" sx={{ p: 2 }}>
                <Grid style={{ padding: "80px 5px 0 5px" }}>
                  <Card style={{ maxWidth: 600, margin: "0 auto" }}>
                    <CardContent>
                      <AppBar
                        position="static"
                        style={{
                          background: "#3278d3",
                          width: "120vw",
                          marginLeft: "-34px",
                          marginRight: "auto",
                          marginBottom: "10px",
                          marginTop: "-15px",
                        }}
                      >
                        <Toolbar>
                          <Typography variant="h5" style={{ color: "#fff" }}>
                            {isEditMode
                              ? "EDIT DESIGNATION"
                              : "ADD NEW DESIGNATION"}
                          </Typography>
                        </Toolbar>
                      </AppBar>

                      {submissionError && (
                        <Box
                          sx={{
                            backgroundColor: "#ffebee",
                            padding: "16px",
                            borderRadius: "4px",
                            marginBottom: "20px",
                          }}
                        >
                          <Typography variant="body1" color="error">
                            {submissionError}
                          </Typography>
                        </Box>
                      )}

                      <form onSubmit={handleSubmit}>
                        <Grid
                          item
                          xs={12}
                          style={{ padding: "20px 20px 0 20px" }}
                        >
                          <Typography gutterBottom>Designation Name</Typography>
                          <FormControl
                            fullWidth
                            error={!!errors.v_DesignationName}
                          >
                            <TextField
                              name="v_DesignationName"
                              value={formData.v_DesignationName}
                              onChange={handleChange}
                              fullWidth
                              variant="outlined"
                            />
                          </FormControl>
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          style={{ padding: "20px 20px 0 20px" }}
                        >
                          <Typography gutterBottom>Authority</Typography>
                          <FormControl fullWidth error={!!errors.Authority}>
                            <TextField
                              name="Authority"
                              value={formData.Authority}
                              onChange={handleChange}
                              fullWidth
                              variant="outlined"
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} style={{ padding: "20px" }}>
                          <Typography gutterBottom>Status</Typography>
                          <FormControl fullWidth error={!!errors.status}>
                            <Select
                              name="status"
                              value={formData.status}
                              onChange={handleChange}
                              variant="outlined"
                            >
                              <MenuItem value="A">Active</MenuItem>
                              <MenuItem value="I">Inactive</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid item align="right" style={{ padding: "18px" }}>
                          <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isSubmitting}
                          >
                            {isSubmitting
                              ? "Processing..."
                              : isEditMode
                              ? "Update"
                              : "Submit"}
                          </Button>
                        </Grid>
                      </form>
                    </CardContent>
                  </Card>
                </Grid>
              </Container>
            </Grid>
          </Box>
        </div>
      </Grid>
    </Grid>
  );
};

export default DesignationMaster;
