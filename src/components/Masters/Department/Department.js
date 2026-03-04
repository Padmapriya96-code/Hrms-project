// import React, { useState, useEffect } from "react";
// import { REPORTS, SAVE } from "../../../serverconfiguration/controllers";
// import { postRequest } from "../../../serverconfiguration/requestcomp";
// import { ServerConfig } from "../../../serverconfiguration/serverconfig";
// import Sidenav from "../../Home Page/Sidenav";
// import Navbar from "../../Home Page/Navbar";
// import { useLocation} from "react-router-dom";
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
// import { useNavigate } from "react-router-dom";
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const DepartmentMaster = () => {
//   const [isLoggedin] = useState(sessionStorage.getItem("user"));
//   const [loggedBranch, setLoggedBranch] = useState([]);
//   const [loggedCompany, setLoggedCompany] = useState([]);
//   const navigate = useNavigate();
//   const [submissionError, setSubmissionError] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
// const location = useLocation();
// const departmentData = location.state?.departmentData || null;
// const isEditMode = !!departmentData;
// const [formData, setFormData] = useState({
//   pn_BranchID: "",
//   pn_CompanyID: "",
//   v_DepartmentName: "",
//   status: "A",
//   pn_DepartmentID: ""   // include ID for editing
// });

//   const [errors, setErrors] = useState({
//     v_DepartmentName: '',
//     status: ''
//   });

//   useEffect(() => {
//     async function fetchInitialData() {
//       try {
//         const loggedBranchData = await postRequest(ServerConfig.url, REPORTS, {
//           query: `SELECT * FROM paym_Branch WHERE Branch_User_Id = '${isLoggedin}'`,
//         });

//         if (loggedBranchData.data) {
//           setLoggedBranch(loggedBranchData.data);
//           setFormData(prev => ({
//             ...prev,
//             pn_BranchID: loggedBranchData.data[0]?.pn_BranchID || ""
//           }));
//         }
//       } catch (error) {
//         console.error("Error fetching branch data:", error);
//         toast.error("Failed to load branch data");
//       }
//     }

//     if (isLoggedin) fetchInitialData();
//   }, [isLoggedin]);
// useEffect(() => {
//   if (departmentData?.pn_DepartmentID) {
//     // Option 1: if full row is passed from table
//     setFormData({
//       pn_DepartmentID: departmentData.pn_DepartmentID,
//       pn_BranchID: departmentData.pn_BranchID,
//       pn_CompanyID: departmentData.pn_CompanyID,
//       v_DepartmentName: departmentData.v_DepartmentName,
//       status: departmentData.status,
//     });

//     // Option 2: If you want to re-fetch from DB
//     // fetchDepartmentById(departmentData.pn_DepartmentID);
//   }
// }, [departmentData]);
// const fetchDepartmentById = async (id) => {
//   try {
//     const result = await postRequest(ServerConfig.url, REPORTS, {
//       query: `SELECT [pn_CompanyID],[pn_BranchID],[pn_DepartmentID],[v_DepartmentName],[status] 
//               FROM [dbo].[paym_Department] WHERE pn_DepartmentID = ${id}`
//     });
//     if (result.data && result.data.length > 0) {
//       setFormData(result.data[0]);
//     }
//   } catch (error) {
//     console.error("Error fetching department:", error);
//   }
// };
//   useEffect(() => {
//     async function fetchLoggedCompany() {
//       try {
//         if (loggedBranch.length > 0) {
//           const loggedCompanyData = await postRequest(ServerConfig.url, REPORTS, {
//             query: `SELECT * FROM paym_Company WHERE pn_CompanyID = ${loggedBranch[0].pn_CompanyID}`,
//           });

//           if (loggedCompanyData.data) {
//             setLoggedCompany(loggedCompanyData.data);
//             setFormData(prev => ({
//               ...prev,
//               pn_CompanyID: loggedCompanyData.data[0]?.pn_CompanyID || ""
//             }));
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching company data:", error);
//         toast.error("Failed to load company data");
//       }
//     }

//     if (loggedBranch.length > 0) fetchLoggedCompany();
//   }, [loggedBranch]);

//   const validateForm = (name, value) => {
//     switch (name) {
//       case 'v_DepartmentName':
//         if (!value.trim()) return 'Department Name is required';
//         if (value.length > 50) return 'Maximum 50 characters allowed';
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
//       v_DepartmentName: validateForm('v_DepartmentName', formData.v_DepartmentName),
//       status: validateForm('status', formData.status)
//     };
    
//     setErrors(newErrors);
//     return Object.values(newErrors).every(error => error === '');
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };
// const hasFormChanged = () => {
//   if (!departmentData) return true; // new insert, always "changed"
  
//   return (
//     formData.v_DepartmentName !== departmentData.v_DepartmentName ||
//     formData.status !== departmentData.status
//   );
// };

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setSubmissionError('');
//   setIsSubmitting(true);

//   // ✅ validate fields
//   if (!validateAllFields()) {
//     toast.error('Please fix all validation errors before submitting', {
//       position: "top-center",
//       autoClose: 1000,
//     });
//     setIsSubmitting(false);
//     return;
//   }

//   // ✅ prevent update if no changes detected
//   if (isEditMode && !hasFormChanged()) {
//     toast.error('No changes detected to update', {
//       position: "top-center",
//       autoClose: 1000,
//     });
//     setIsSubmitting(false);
//     return;
//   }

//   try {
//     // ✅ build query based on mode
//     const query = isEditMode
//       ? `UPDATE [dbo].[paym_Department] 
//            SET v_DepartmentName = '${formData.v_DepartmentName}',
//                status = '${formData.status.toUpperCase()}'
//          WHERE pn_DepartmentID = ${formData.pn_DepartmentID};`
//       : `INSERT INTO [dbo].[paym_Department]
//            (pn_CompanyID, pn_BranchID, v_DepartmentName, status)
//          VALUES (${formData.pn_CompanyID}, ${formData.pn_BranchID}, 
//                  '${formData.v_DepartmentName}', '${formData.status.toUpperCase()}');`;

//     const response = await postRequest(ServerConfig.url, SAVE, { query });

//     if (response?.data === 1 || response?.success) {
//       if (isEditMode) {
//         toast.success("Department updated successfully!", {
//           position: "top-center",
//           autoClose: 1000,
//         });
//       } else {
//         toast.info("Department added successfully!", {
//           position: "top-center",
//           autoClose: 1000,
//         });
//       }
//       setTimeout(() => navigate("/DepartmentHome"), 1000);
//     } else {
//       throw new Error(response?.message || "Operation failed");
//     }
//   } catch (error) {
//     console.error(
//       `Error ${isEditMode ? "updating" : "adding"} Department:`,
//       error
//     );
//     toast.error(
//       error.message || `Failed to ${isEditMode ? "update" : "add"} Department`,
//       {
//         position: "top-center",
//         autoClose: 1000,
//       }
//     );
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
//                       <AppBar
//                         position="static"
//                         style={{
//                           background: "#3278d3",
//                           width: "120vw",
//                           marginLeft: "-34px",
//                           marginRight: "auto",
//                           marginBottom: "10px",
//                           marginTop: "-15px",
//                         }}
//                       >
//                         <Toolbar>
//                        <Typography variant="h5" style={{ color: "#fff" }}>
//   {isEditMode ? "EDIT DEPARTMENT" : "ADD NEW DEPARTMENT"}
// </Typography>

//                         </Toolbar>
//                       </AppBar>

//                       <form onSubmit={handleSubmit}>
//                         <Grid item xs={12} style={{ padding: "20px 20px 0 20px" }}>
//                           <Typography gutterBottom style={{ textAlign: "left", paddingBottom: "10px" }}>
//                             Department Name
//                           </Typography>
//                           <FormControl fullWidth error={!!errors.v_DepartmentName}>
//                             <TextField
//                               name="v_DepartmentName"
//                               value={formData.v_DepartmentName}
//                               onChange={handleChange}
//                               fullWidth
//                               variant="outlined"
//                               error={!!errors.v_DepartmentName}
//                                 className="custom-readonly-textfield"
//                             />
//                           </FormControl>
//                         </Grid>

//                         <Grid item xs={12} style={{ padding: "20px" }}>
//                           <Typography gutterBottom style={{ textAlign: "left", paddingBottom: "10px" }}>
//                             Status
//                           </Typography>
//                           <FormControl fullWidth error={!!errors.status}   className="custom-readonly-textfield">
//                             <Select
//                               name="status"
//                               value={formData.status}
//                               onChange={handleChange}
//                               variant="outlined"
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
//                             {isSubmitting ? 'Processing...' : 'Submit'}
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

// export default DepartmentMaster;
















import React, { useState, useEffect } from "react";
import { REPORTS, SAVE } from "../../../serverconfiguration/controllers";
import { postRequest } from "../../../serverconfiguration/requestcomp";
import { ServerConfig } from "../../../serverconfiguration/serverconfig";
import Sidenav from "../../Home Page/Sidenav";
import Navbar from "../../Home Page/Navbar";
import { useLocation } from "react-router-dom";
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
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DepartmentMaster = () => {
  const [isLoggedin] = useState(sessionStorage.getItem("user"));
  const [loggedBranch, setLoggedBranch] = useState([]);
  const [loggedCompany, setLoggedCompany] = useState([]);
  const navigate = useNavigate();
  const [submissionError, setSubmissionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const departmentData = location.state?.departmentData || null;
  const isEditMode = !!departmentData;

  const [formData, setFormData] = useState({
    pn_BranchID: "",
    pn_CompanyID: "",
    v_DepartmentName: "",
    status: "A",
    pn_DepartmentID: "", // include ID for editing
  });

  const [errors, setErrors] = useState({
    v_DepartmentName: "",
    status: "",
  });

  // ✅ Get database name from sessionStorage
  const databaseName = sessionStorage.getItem("databaseName");

  useEffect(() => {
    async function fetchInitialData() {
      try {
        if (!databaseName) {
          console.warn("⚠️ Database name missing in sessionStorage");
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
          setLoggedBranch(loggedBranchData.data);
          setFormData((prev) => ({
            ...prev,
            pn_BranchID: loggedBranchData.data[0]?.pn_BranchID || "",
          }));
        }
      } catch (error) {
        console.error("Error fetching branch data:", error);
        toast.error("Failed to load branch data");
      }
    }

    if (isLoggedin) fetchInitialData();
  }, [isLoggedin, databaseName]);

  useEffect(() => {
    if (departmentData?.pn_DepartmentID) {
      setFormData({
        pn_DepartmentID: departmentData.pn_DepartmentID,
        pn_BranchID: departmentData.pn_BranchID,
        pn_CompanyID: departmentData.pn_CompanyID,
        v_DepartmentName: departmentData.v_DepartmentName,
        status: departmentData.status,
      });
    }
  }, [departmentData]);

  const fetchDepartmentById = async (id) => {
    try {
      if (!databaseName) {
        console.warn("⚠️ Missing database name");
        return;
      }

      const query = `
        SELECT [pn_CompanyID],[pn_BranchID],[pn_DepartmentID],[v_DepartmentName],[status] 
        FROM [${databaseName}].[dbo].[paym_Department]
        WHERE pn_DepartmentID = ${id};
      `;

      const result = await postRequest(ServerConfig.url, REPORTS, { query });
      if (result.data && result.data.length > 0) {
        setFormData(result.data[0]);
      }
    } catch (error) {
      console.error("Error fetching department:", error);
    }
  };

  useEffect(() => {
    async function fetchLoggedCompany() {
      try {
        if (loggedBranch.length > 0 && databaseName) {
          const companyQuery = `
            SELECT * 
            FROM [${databaseName}].[dbo].[paym_Company]
            WHERE pn_CompanyID = ${loggedBranch[0].pn_CompanyID};
          `;

          const loggedCompanyData = await postRequest(ServerConfig.url, REPORTS, {
            query: companyQuery,
          });

          if (loggedCompanyData.data) {
            setLoggedCompany(loggedCompanyData.data);
            setFormData((prev) => ({
              ...prev,
              pn_CompanyID: loggedCompanyData.data[0]?.pn_CompanyID || "",
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
        toast.error("Failed to load company data");
      }
    }

    if (loggedBranch.length > 0) fetchLoggedCompany();
  }, [loggedBranch, databaseName]);

  const validateForm = (name, value) => {
    switch (name) {
      case "v_DepartmentName":
        if (!value.trim()) return "Department Name is required";
        if (value.length > 50) return "Maximum 50 characters allowed";
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
      v_DepartmentName: validateForm("v_DepartmentName", formData.v_DepartmentName),
      status: validateForm("status", formData.status),
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const hasFormChanged = () => {
    if (!departmentData) return true;
    return (
      formData.v_DepartmentName !== departmentData.v_DepartmentName ||
      formData.status !== departmentData.status
    );
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
        toast.error("Missing database name. Please login again.");
        return;
      }

      // ✅ Dynamic query with database name
      const query = isEditMode
        ? `
          UPDATE [${databaseName}].[dbo].[paym_Department]
          SET v_DepartmentName = '${formData.v_DepartmentName}',
              status = '${formData.status.toUpperCase()}'
          WHERE pn_DepartmentID = ${formData.pn_DepartmentID};
        `
        : `
          INSERT INTO [${databaseName}].[dbo].[paym_Department]
            (pn_CompanyID, pn_BranchID, v_DepartmentName, status)
          VALUES (
            ${formData.pn_CompanyID},
            ${formData.pn_BranchID},
            '${formData.v_DepartmentName}',
            '${formData.status.toUpperCase()}'
          );
        `;

      const response = await postRequest(ServerConfig.url, SAVE, { query });

      if (response?.data === 1 || response?.success) {
        toast.success(
          isEditMode
            ? "Department updated successfully!"
            : "Department added successfully!",
          { position: "top-center", autoClose: 1000 }
        );
        setTimeout(() => navigate("/DepartmentHome"), 1000);
      } else {
        throw new Error(response?.message || "Operation failed");
      }
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "adding"} Department:`,
        error
      );
      toast.error(
        error.message || `Failed to ${isEditMode ? "update" : "add"} Department`,
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
                          marginBottom: "10px",
                          marginTop: "-15px",
                        }}
                      >
                        <Toolbar>
                          <Typography variant="h5" style={{ color: "#fff" }}>
                            {isEditMode
                              ? "EDIT DEPARTMENT"
                              : "ADD NEW DEPARTMENT"}
                          </Typography>
                        </Toolbar>
                      </AppBar>

                      <form onSubmit={handleSubmit}>
                        <Grid
                          item
                          xs={12}
                          style={{ padding: "20px 20px 0 20px" }}
                        >
                          <Typography gutterBottom>
                            Department Name
                          </Typography>
                          <FormControl
                            fullWidth
                            error={!!errors.v_DepartmentName}
                          >
                            <TextField
                              name="v_DepartmentName"
                              value={formData.v_DepartmentName}
                              onChange={handleChange}
                              fullWidth
                              variant="outlined"
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} style={{ padding: "20px" }}>
                          <Typography gutterBottom>Status</Typography>
                          <FormControl
                            fullWidth
                            error={!!errors.status}
                          >
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
                            {isSubmitting ? "Processing..." : "Submit"}
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

export default DepartmentMaster;
