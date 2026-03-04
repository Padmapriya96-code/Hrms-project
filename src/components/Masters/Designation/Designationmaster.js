// import React, { useState, useEffect } from "react";
// import { ServerConfig } from "../../../serverconfiguration/serverconfig";
// import { REPORTS, SAVE } from "../../../serverconfiguration/controllers";
// import { postRequest } from "../../../serverconfiguration/requestcomp";
// import nodata from "../../../images/NoDataImage.jpeg";
// import {
//   CircularProgress,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   Typography,
//   Button,
//   Grid,
//   Box,
//   CssBaseline,
//   Card,
//   InputBase,
//   AppBar,
//   Toolbar,
// } from "@material-ui/core";
// import { makeStyles } from "@material-ui/core/styles";
// import SearchIcon from "@material-ui/icons/Search";
// import EditIcon from "@material-ui/icons/Edit";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
// import AddIcon from "@mui/icons-material/Add";
// import Sidenav from "../../Home Page/Sidenav";
// import Navbar from "../../Home Page/Navbar";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     display: "flex",
//   },
//   content: {
//     flexGrow: 1,
//   },
//   toolbar: theme.mixins.toolbar,
//   searchContainer: {
//     display: "flex",
//     alignItems: "center",
//     backgroundColor: "#f1f1f1",
//     padding: theme.spacing(1),
//     borderRadius: theme.shape.borderRadius,
//     marginBottom: theme.spacing(1),
//     maxWidth: 450,
//   },
//   searchIcon: {
//     padding: theme.spacing(0.5),
//   },
//   table: {
//     minWidth: 700,
//   },
//   actionCell: {
//     display: "flex",
//   },
//   header: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: theme.spacing(4),
//   },
//   headerTitle: {
//     fontSize: "30px",
//     color: "white",
//   },
//   tableHeader: {
//     backgroundColor: "#f9fafb",
//   },
//   card: {
//     maxWidth: 900,
//     width: "100%",
//     margin: "0 auto",
//     padding: theme.spacing(4),
//     boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
//     backgroundColor: "#ffffff",
//   },
//   button: {
//     borderRadius: "10px",
//     textTransform: "none",
//     fontWeight: 600,
//     paddingLeft: theme.spacing(3),
//     paddingRight: theme.spacing(3),
//   },
//   addButton: {
//     backgroundColor: "#3278d3",
//     color: "#ffffff",
//     minHeight: 44,
//   },
// appBarContainer: {
//   width: "100%",
//   maxWidth: 900,
//   marginLeft: "auto",
//   marginRight: "auto",
//   marginTop: theme.spacing(8),
//   marginBottom: theme.spacing(0),
//   backgroundColor: "#3278d3",
//   boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
// },
//   appBarInner: {
//     backgroundColor: "transparent",
//     boxShadow: "none",
//     minHeight: 66,
//   },
//   denseTable: {
//     "& .MuiTableRow-root": {
//       height: 32,
//       minHeight: 32,
//     },
//     "& .MuiTableCell-root": {
//       paddingTop: 4,
//       paddingBottom: 4,
//       paddingLeft: 12,
//       paddingRight: 12,
//       fontSize: 14,
//       lineHeight: "18px",
//     },
//     "& .MuiTableCell-root:not(:last-child)": {
//       borderBottom: "1px solid #e5e7eb",
//     },
//   },
// }));

// function DesignationHome() {
//   const classes = useStyles();
//   const [designations, setDesignations] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isLoggedin] = useState(sessionStorage.getItem("user"));
//   const [searchQuery, setSearchQuery] = useState("");
//   const [loggedBranch, setLoggedBranch] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     async function fetchBranchData() {
//       try {
//         const loggedBranchData = await postRequest(ServerConfig.url, REPORTS, {
//           query: `SELECT * FROM paym_Branch WHERE Branch_User_Id = '${isLoggedin}'`,
//         });

//         if (loggedBranchData.data && loggedBranchData.data.length > 0) {
//           setLoggedBranch(loggedBranchData.data);
//         } else {
//           console.log("No branch found for the logged-in user");
//         }
//       } catch (error) {
//         console.error("Error fetching branch data:", error);
//       }
//     }

//     if (isLoggedin) {
//       fetchBranchData();
//     }
//   }, [isLoggedin]);

//   const fetchDesignations = async () => {
//     if (loggedBranch.length > 0) {
//       const branchId = loggedBranch[0].pn_BranchID;
//       setIsLoading(true);
//       try {
//         const DesignationsData = await postRequest(ServerConfig.url, REPORTS, {
//           query: `SELECT * FROM paym_Designation WHERE BranchID = '${branchId}'`,
//         });
//         if (DesignationsData.data) {
//           setDesignations(DesignationsData.data);
//         }
//       } catch (error) {
//         console.error("Error fetching Designations data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   useEffect(() => {
//     if (loggedBranch.length > 0) fetchDesignations();
//   }, [loggedBranch]);

//   const handleSearchChange = (event) => setSearchQuery(event.target.value);
//   const handleEditClick = (designation) => {
//     navigate(`/DesignationMaster`, { state: { designationData: designation } });
//   };

//   const handleDeleteClick = (id) => {
//     if (!id) {
//       console.error("No ID provided for deletion");
//       return;
//     }

//     // clear any existing toasts
//     toast.dismiss();

//     // show confirmation toast
//     toast.info(
//       <div style={{ textAlign: "center" }}>
//         Are you sure you want to delete this designation?
//         <div
//           style={{
//             marginTop: "10px",
//             display: "flex",
//             justifyContent: "center",
//             gap: "8px",
//           }}
//         >
//           <Button
//             variant="contained"
//             size="small"
//             color="red"
//             onClick={async () => {
//               toast.dismiss();
//               await executeDelete(id);
//             }}
//             style={{ minWidth: "80px" }}
//           >
//             Delete
//           </Button>
//           <Button
//             variant="outlined"
//             size="small"
//             onClick={() => toast.dismiss()}
//             style={{ minWidth: "80px" }}
//           >
//             Cancel
//           </Button>
//         </div>
//       </div>,
//       {
//         position: "top-center",
//         autoClose: false,
//         closeOnClick: false,
//         draggable: false,
//         toastId: "delete-confirmation",
//       }
//     );
//   };

//   const executeDelete = async (id) => {
//     try {
//       setIsLoading(true);
//       const response = await postRequest(ServerConfig.url, SAVE, {
//         query: `DELETE FROM [dbo].[paym_Designation] WHERE [pn_DesignationID] = '${id}'`,
//       });

//       if (response.success || response.data === 1) {
//         toast.error("Designation deleted successfully", {
//           position: "top-center",
//           autoClose: 1000,
//         });
//         await fetchDesignations(); // refresh grid
//       } else {
//         toast.error("Failed to delete designation. Please try again.", {
//           position: "top-center",
//           autoClose: 2000,
//         });
//       }
//     } catch (error) {
//       console.error("Delete error:", error);
//       toast.error("An error occurred while deleting the designation.", {
//         position: "top-center",
//         autoClose: 2000,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const filteredDesignations = designations.filter((designation, index) => {
//     const name = designation.v_DesignationName
//       ? designation.v_DesignationName.toLowerCase()
//       : "";
//     const status = designation.status === "A" ? "active" : "inactive";
//     const sNo = (index + 1).toString();

//     return (
//       name.includes(searchQuery.toLowerCase()) ||
//       status.includes(searchQuery.toLowerCase()) ||
//       sNo.includes(searchQuery)
//     );
//   });

//   return (
//     <Grid item xs={12}>
//       <div style={{ backgroundColor: "#f5f5f5" }}>
//         <Navbar />
//         <Box height={40} />
//         <Box sx={{ display: "flex" }}>
//           <Sidenav />
//           <Grid
//             item
//             xs={12}
//             sm={10}
//             md={8}
//             style={{
//               margin: "0 auto",
//               display: "flex",
//               justifyContent: "center",
//               flexDirection: "column",
//               alignItems: "center",
//             }}
//           >
//             <div className={classes.appBarContainer}>
//               <AppBar
//                 position="static"
//                 sx={{ width: "100%", minHeight: "60px" }}
//               >
//                 <Toolbar sx={{ justifyContent: "left", height: "100%" }}>
//                   <Typography
//                     variant="h5"
//                     gutterBottom
//                     sx={{
//                       textAlign: "left",
//                       fontWeight: "bold",
//                       color: "white",
//                       lineHeight: "60px",
//                     }}
//                   >
//                     DESIGNATION
//                   </Typography>
//                 </Toolbar>
//               </AppBar>
//             </div>

//             <Card className={classes.card} style={{ marginTop: "0px" }}>
//               <CssBaseline />
//               <main className={classes.content}>
//                 <Grid
//                   container
//                   alignItems="center"
//                   justifyContent="space-between"
//                 >
//                   <Grid item>
//                     <Paper className={classes.searchContainer}>
//                       <InputBase
//                         placeholder="Search..."
//                         value={searchQuery}
//                         onChange={handleSearchChange}
//                         classes={{
//                           root: classes.inputBase,
//                         }}
//                         inputProps={{ "aria-label": "search designations" }}
//                       />
//                       <IconButton
//                         className={classes.searchIcon}
//                         aria-label="search"
//                       >
//                         <SearchIcon />
//                       </IconButton>
//                     </Paper>
//                   </Grid>
//                   <Grid item>
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       className={`${classes.button} ${classes.addButton}`}
//                       onClick={() => navigate("/DesignationMaster")}
//                     >
//                       <AddIcon style={{ marginRight: 8 }} />
//                       ADD DESIGNATION
//                     </Button>
//                   </Grid>
//                 </Grid>

//                 <TableContainer component={Paper} style={{ marginTop: "30px" }}>
//                   <Table className={classes.denseTable}>
//                     <TableHead style={{ backgroundColor: "#d8d8d8" }}>
//                       <TableRow>
//                         <TableCell
//                           className={classes.tableHeader}
//                           style={{ padding: "6px 12px" }}
//                         ></TableCell>
//                         <TableCell
//                           className={classes.tableHeader}
//                           style={{ padding: "6px 12px" }}
//                         ></TableCell>
//                         <TableCell
//                           className={classes.tableHeader}
//                           style={{ padding: "6px 12px" }}
//                         ></TableCell>
//                         <TableCell
//                           className={classes.tableHeader}
//                           style={{ padding: "6px 12px" }}
//                         ></TableCell>
//                         <TableCell
//                           className={classes.tableHeader}
//                           style={{ padding: "6px 12px" }}
//                         ></TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {isLoading ? (
//                         <TableRow>
//                           <TableCell colSpan={5} align="center">
//                             <CircularProgress />
//                           </TableCell>
//                         </TableRow>
//                       ) : filteredDesignations.length > 0 ? (
//                         filteredDesignations.map((designation, index) => (
//                           <TableRow
//                             key={designation.id || index}
//                             sx={{ height: 36 }} // 👈 controls row height
//                             style={{
//                               backgroundColor:
//                                 index % 2 === 0 ? "#cde3f2" : "#ffffff",
//                             }}
//                           >
//                             <TableCell>{index + 1}</TableCell>
//                             <TableCell>
//                               {designation.v_DesignationName}
//                             </TableCell>
//                             <TableCell>{designation.Authority}</TableCell>
//                             <TableCell>
//                               {designation.status === "A"
//                                 ? "Active"
//                                 : "Inactive"}
//                             </TableCell>
//                             <TableCell className={classes.actionCell}>
//                               <IconButton
//                                 aria-label="edit"
//                                 style={{ color: "#007BFF" }}
//                                 onClick={() => handleEditClick(designation)}
//                               >
//                                 <EditIcon />
//                               </IconButton>
//                               <IconButton
//                                 aria-label="delete"
//                                 style={{ color: "red" }}
//                                 onClick={() =>
//                                   handleDeleteClick(
//                                     designation.pn_DesignationID
//                                   )
//                                 }
//                               >
//                                 <DeleteOutlineIcon />
//                               </IconButton>
//                             </TableCell>
//                           </TableRow>
//                         ))
//                       ) : (
//                         <TableRow>
//                           <TableCell colSpan={5} align="center">
//                             <img src={nodata} alt="No Data" width={150} />
//                             <Typography>No Data</Typography>
//                           </TableCell>
//                         </TableRow>
//                       )}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               </main>
//             </Card>
//           </Grid>
//         </Box>
//       </div>
//     </Grid>
//   );
// }

// export default DesignationHome;

import React, { useState, useEffect } from "react";
import { ServerConfig } from "../../../serverconfiguration/serverconfig";
import { REPORTS, SAVE } from "../../../serverconfiguration/controllers";
import { postRequest } from "../../../serverconfiguration/requestcomp";
import nodata from "../../../images/NoDataImage.jpeg";
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Button,
  Grid,
  Box,
  CssBaseline,
  Card,
  InputBase,
  AppBar,
  Toolbar,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import EditIcon from "@material-ui/icons/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import Sidenav from "../../Home Page/Sidenav";
import Navbar from "../../Home Page/Navbar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// const useStyles = makeStyles((theme) => ({
//   root: { display: "flex" },
//   content: { flexGrow: 1 },
//   toolbar: theme.mixins.toolbar,
//   searchContainer: {
//     display: "flex",
//     alignItems: "center",
//     backgroundColor: "#f1f1f1",
//     padding: theme.spacing(1),
//     borderRadius: theme.shape.borderRadius,
//     marginBottom: theme.spacing(1),
//     maxWidth: 450,
//   },
//   searchIcon: { padding: theme.spacing(0.5) },
//   table: { minWidth: 700 },
//   actionCell: { display: "flex" },
//   headerTitle: { fontSize: "30px", color: "white" },
//   tableHeader: { backgroundColor: "#f9fafb" },
//   card: {
//     maxWidth: 900,
//     width: "100%",
//     margin: "0 auto",
//     padding: theme.spacing(4),
//     boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
//     backgroundColor: "#ffffff",
//   },
//   button: {
//     borderRadius: "10px",
//     textTransform: "none",
//     fontWeight: 600,
//     paddingLeft: theme.spacing(3),
//     paddingRight: theme.spacing(3),
//   },
//   addButton: {
//     backgroundColor: "#3278d3",
//     color: "#ffffff",
//     minHeight: 44,
//   },
//   appBarContainer: {
//     width: "100%",
//     maxWidth: 900,
//     marginLeft: "auto",
//     marginRight: "auto",
//     marginTop: theme.spacing(8),
//     marginBottom: theme.spacing(0),
//     backgroundColor: "#3278d3",
//     boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//   },
//   denseTable: {
//     "& .MuiTableRow-root": { height: 32, minHeight: 32 },
//     "& .MuiTableCell-root": {
//       paddingTop: 4,
//       paddingBottom: 4,
//       paddingLeft: 12,
//       paddingRight: 12,
//       fontSize: 14,
//       lineHeight: "18px",
//     },
//     "& .MuiTableCell-root:not(:last-child)": {
//       borderBottom: "1px solid #e5e7eb",
//     },
//   },
// }));
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
  },
  toolbar: theme.mixins.toolbar,
  searchContainer: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(1),
    maxWidth: 450,
  },
  searchIcon: {
    padding: theme.spacing(0.5),
  },
  table: {
    minWidth: 700,
  },
  actionCell: {
    display: "flex",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing(4),
  },
  headerTitle: {
    fontSize: "30px",
    color: "white",
  },
  tableHeader: {
    backgroundColor: "#f9fafb",
  },
  card: {
    maxWidth: 900,
    width: "100%",
    margin: "0 auto",
    padding: theme.spacing(4),
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    backgroundColor: "#ffffff",
  },
  button: {
    borderRadius: "10px",
    textTransform: "none",
    fontWeight: 600,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  addButton: {
    backgroundColor: "#3278d3",
    color: "#ffffff",
    minHeight: 44,
  },
  appBarContainer: {
    width: "100%",
    maxWidth: 900,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(0),
    backgroundColor: "#3278d3",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  appBarInner: {
    backgroundColor: "transparent",
    boxShadow: "none",
    minHeight: 66,
  },
  denseTable: {
    "& .MuiTableRow-root": {
      height: 32,
      minHeight: 32,
    },
    "& .MuiTableCell-root": {
      paddingTop: 4,
      paddingBottom: 4,
      paddingLeft: 12,
      paddingRight: 12,
      fontSize: 14,
      lineHeight: "18px",
    },
    "& .MuiTableCell-root:not(:last-child)": {
      borderBottom: "1px solid #e5e7eb",
    },
  },
}));
function DesignationHome() {
  const classes = useStyles();
  const [designations, setDesignations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedin] = useState(sessionStorage.getItem("user"));
  const [searchQuery, setSearchQuery] = useState("");
  const [loggedBranch, setLoggedBranch] = useState([]);
  const navigate = useNavigate();
  const canManageDesig = Boolean(loggedBranch[0]?.can_manage_designation);

  // ✅ Get DB name dynamically
  const databaseName = sessionStorage.getItem("databaseName");

  async function fetchBranchData() {
    try {
      if (!databaseName) {
        console.warn("⚠️ Missing database name in sessionStorage");
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

      if (loggedBranchData.data && loggedBranchData.data.length > 0) {
        setLoggedBranch(loggedBranchData.data);
      } else {
        console.log("No branch found for the logged-in user");
      }
    } catch (error) {
      console.error("Error fetching branch data:", error);
    }
  }
  useEffect(() => {
    if (isLoggedin) fetchBranchData();
  }, [isLoggedin, databaseName]);

  useEffect(() => {
    const interval = setInterval(() => {
      const trigger = sessionStorage.getItem("forceRefreshAccess");
      if (trigger) {
        fetchBranchData(); // 🔥 re-fetch access
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const fetchDesignations = async () => {
    if (loggedBranch.length > 0) {
      const branchId = loggedBranch[0].pn_BranchID;
      setIsLoading(true);
      try {
        if (!databaseName) {
          console.warn("⚠️ Database name missing for Designation fetch");
          return;
        }

        const designationQuery = `
          SELECT * 
          FROM [${databaseName}].[dbo].[paym_Designation]
          WHERE BranchID = '${branchId}';
        `;

        const DesignationsData = await postRequest(ServerConfig.url, REPORTS, {
          query: designationQuery,
        });

        if (DesignationsData.data) {
          setDesignations(DesignationsData.data);
        }
      } catch (error) {
        console.error("Error fetching Designations data:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (loggedBranch.length > 0) fetchDesignations();
  }, [loggedBranch]);

  const handleSearchChange = (event) => setSearchQuery(event.target.value);

  const handleEditClick = (designation) => {
    navigate(`/DesignationMaster`, { state: { designationData: designation } });
  };

  const handleDeleteClick = (id) => {
    if (!id) {
      console.error("No ID provided for deletion");
      return;
    }

    toast.dismiss();
    toast.info(
      <div style={{ textAlign: "center" }}>
        Are you sure you want to delete this designation?
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <Button
            variant="contained"
            size="small"
            color="red"
            onClick={async () => {
              toast.dismiss();
              await executeDelete(id);
            }}
            style={{ minWidth: "80px" }}
          >
            Delete
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => toast.dismiss()}
            style={{ minWidth: "80px" }}
          >
            Cancel
          </Button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        toastId: "delete-confirmation",
      }
    );
  };

  // ✅ Delete using databaseName dynamically
  const executeDelete = async (id) => {
    try {
      setIsLoading(true);

      if (!databaseName) {
        console.warn("⚠️ Missing database name for delete operation");
        return;
      }

      const deleteQuery = `
        DELETE FROM [${databaseName}].[dbo].[paym_Designation]
        WHERE [pn_DesignationID] = '${id}';
      `;

      const response = await postRequest(ServerConfig.url, SAVE, {
        query: deleteQuery,
      });

      if (response.success || response.data === 1) {
        toast.success("Designation deleted successfully", {
          position: "top-center",
          autoClose: 1000,
        });
        await fetchDesignations();
      } else {
        toast.error("Failed to delete designation. Please try again.", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("An error occurred while deleting the designation.", {
        position: "top-center",
        autoClose: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDesignations = designations.filter((designation, index) => {
    const name = designation.v_DesignationName
      ? designation.v_DesignationName.toLowerCase()
      : "";
    const status = designation.status === "A" ? "active" : "inactive";
    const sNo = (index + 1).toString();

    return (
      name.includes(searchQuery.toLowerCase()) ||
      status.includes(searchQuery.toLowerCase()) ||
      sNo.includes(searchQuery)
    );
  });

  return (
    <Grid item xs={12}>
      <div style={{ backgroundColor: "#f5f5f5" }}>
        <Navbar />
        <Box height={40} />
        <Box sx={{ display: "flex" }}>
          <Sidenav />
          <Grid
            item
            xs={12}
            sm={10}
            md={8}
            style={{
              margin: "0 auto",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div className={classes.appBarContainer}>
              <AppBar
                position="static"
                sx={{ width: "100%", minHeight: "60px" }}
              >
                <Toolbar sx={{ justifyContent: "left", height: "100%" }}>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      textAlign: "left",
                      fontWeight: "bold",
                      color: "white",
                      lineHeight: "60px",
                    }}
                  >
                    DESIGNATION
                  </Typography>
                </Toolbar>
              </AppBar>
            </div>

            <Card className={classes.card} style={{ marginTop: "0px" }}>
              <CssBaseline />
              <main className={classes.content}>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Grid item>
                    <Paper className={classes.searchContainer}>
                      <InputBase
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        classes={{ root: classes.inputBase }}
                        inputProps={{ "aria-label": "search designations" }}
                      />
                      <IconButton
                        className={classes.searchIcon}
                        aria-label="search"
                      >
                        <SearchIcon />
                      </IconButton>
                    </Paper>
                  </Grid>
                  <Grid item>
                    {canManageDesig && (
                      <Button
                        variant="contained"
                        color="primary"
                        className={`${classes.button} ${classes.addButton}`}
                        onClick={() => navigate("/DesignationMaster")}
                      >
                        <AddIcon style={{ marginRight: 8 }} />
                        ADD DESIGNATION
                      </Button>
                    )}
                  </Grid>
                </Grid>

                <TableContainer component={Paper} style={{ marginTop: "30px" }}>
                  <Table className={classes.denseTable}>
                    <TableHead style={{ backgroundColor: "#d8d8d8" }}>
                      <TableRow>
                        <TableCell>S.No</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Authority</TableCell>
                        <TableCell>Status</TableCell>
                        {canManageDesig && <TableCell>Actions</TableCell>}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            <CircularProgress />
                          </TableCell>
                        </TableRow>
                      ) : filteredDesignations.length > 0 ? (
                        filteredDesignations.map((designation, index) => (
                          <TableRow
  key={designation.pn_DesignationID || index}
  sx={{ height: 36 }}
  style={{
    backgroundColor: index % 2 === 0 ? "#cde3f2" : "#ffffff",
  }}
>
  <TableCell>{index + 1}</TableCell>
  <TableCell>{designation.v_DesignationName}</TableCell>
  <TableCell>{designation.Authority}</TableCell>
  <TableCell>{designation.status === "A" ? "Active" : "Inactive"}</TableCell>

  {canManageDesig && (
    <TableCell className={classes.actionCell}>
      <IconButton
        aria-label="edit"
        style={{ color: "#007BFF" }}
        onClick={() => handleEditClick(designation)}
      >
        <EditIcon />
      </IconButton>

      <IconButton
        aria-label="delete"
        style={{ color: "red" }}
        onClick={() =>
          handleDeleteClick(designation.pn_DesignationID)
        }
      >
        <DeleteOutlineIcon />
      </IconButton>
    </TableCell>
  )}
</TableRow>

                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            <img src={nodata} alt="No Data" width={150} />
                            <Typography>No Data</Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </main>
            </Card>
          </Grid>
        </Box>
      </div>
    </Grid>
  );
}

export default DesignationHome;
