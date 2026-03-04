// import React, { useState } from "react";
// import {
//   Grid,
//   Button,
//   TextField,
//   Paper,
//   Typography,
//   Box,
//   AppBar,
//   Container,
// } from "@mui/material";
// import { UserContext } from "./UserContext";
// import { useContext } from "react";
// import { ServerConfig } from "../../serverconfiguration/serverconfig";

// import { postRequest, getRequest } from "../../serverconfiguration/requestcomp";
// import {
//   BRANCHLOGIN,
//   COMPANYLOGIN,
//   PAYMCOMPANIES,
// } from "../../serverconfiguration/controllers";
// import { PAYMBRANCHES } from "../../serverconfiguration/controllers";
// import { useNavigate } from "react-router-dom";
// import { connect } from "react-redux";

// import { setUser } from "../../reduxcomp/actions/actionfunctions";
// import { encryptData } from "./encryption";
// import {
//   EMPLOYEELOGIN,
//   PAYMEMPLOYEE,
// } from "../../serverconfiguration/controllers";
// import paymicon from "../../../src/images/Asset.jpeg";

// import login from "../../../src/images/Login.jpeg";
// import { padding } from "@mui/system";
// // import icon from './images/assest-icon.png'

// function LoginOthers(props) {
//   const [username, setUsername] = useState("");
//   const navigate = useNavigate();
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loginType, setLoginType] = useState("select");
//   //const [loggedIn,isLoggedIn]=useState(false)
//   const changeState = (status) => {
//     props.isLoggedIn(status);
//   };
//   const handleUsernameChange = (event) => {
//     setUsername(event.target.value);
//   };

//   const handlePasswordChange = (event) => {
//     setPassword(event.target.value);
//   };

//   const handleSubmit = (event) => {
//     if (!loginType) return;

//     event.preventDefault();
//     console.log("Username:", username);
//     console.log("Password:", password);
//     console.log("LoginType:", loginType);

//     // if (loginType == "Company") {

//     //   postRequest(ServerConfig.url, COMPANYLOGIN, { username, password })
//     //   .then((e) => {
//     //     console.log(e);
//     //     sessionStorage.setItem("jwt", e.data.message);
//     //     console.log( sessionStorage.setItem("jwt", e.data.message));

//     //     changeState(true);
//     //     sessionStorage.setItem("user", username);

//     //     setError("");
//     //    // getRequest(ServerConfig.url, PAYMCOMPANIES).then((e) => {
//     //       // var COMPANYdet = e.data.filter((s) => s.companyUserId == username);
//     //       // console.log("Companydet", COMPANYdet);
//     //       // props.dispatch(
//     //       //   setUser({
//     //       //     // branch: branchdet[0].pnBranchId,
//     //       //     company: COMPANYdet[0].pnCompanyId,
//     //       //   })
//     //       // );
//     //       // sessionStorage.setItem(
//     //       //   "branch",
//     //       //   encryptData(branchdet[0].pnBranchId)
//     //       // );
//     //     //   sessionStorage.setItem(
//     //     //     "company",
//     //     //     encryptData(COMPANYdet[0].pnCompanyId)
//     //     //   );
//     //     // });
//     //   })
//     //   .catch(() => {
//     //     setError("Invalid username or password");
//     //   });
//     // }
//     // if (loginType === "Company") {
//     //   postRequest(ServerConfig.url, COMPANYLOGIN, { username, password })
//     //     .then((e) => {
//     //       navigate("/Homepage1");
//     //       console.log("Login Response:", e);
//     //       // Store token
//     //       sessionStorage.setItem("jwt", e.data.token);
//     //       sessionStorage.setItem("user", username);

//     //       // Set state
//     //       // changeState(true);
//     //       setError("");

//     //       // Store company ID if needed
//     //       // const companyId = e.data.userData?.pn_CompanyID;
//     //       // if (companyId) {
//     //       //   sessionStorage.setItem("company", encryptData(companyId));
//     //       //   // Dispatch to redux store if needed
//     //       //   props.dispatch(
//     //       //     setUser({
//     //       //       company: companyId
//     //       //     })
//     //       //   );
//     //       // }
//     //     })
//     //     .catch(() => {
//     //       setError("Invalid username or password");
//     //     });
//     // }
//     if (loginType === "Company") {
//       postRequest(ServerConfig.url, COMPANYLOGIN, { username, password })
//         .then((e) => {
//           console.log("Login Response:", e);

//           // Store values from backend
//           sessionStorage.setItem("jwt", e.data.token || ""); // in case token is returned
//           sessionStorage.setItem("user", username);

//           // ✅ Store database name from response
//           if (e.data.database) {
//             sessionStorage.setItem("databaseName", e.data.database);
//             console.log("Database Name stored:", e.data.database);
//           }

//           // Optionally store message too
//           if (e.data.message) {
//             sessionStorage.setItem("loginMessage", e.data.message);
//           }

//           setError("");
//           navigate("/Homepage1");
//         })
//         .catch(() => {
//           setError("Invalid username or password");
//         });
//       // } else if (loginType == "Branch") {
//       //   sessionStorage.setItem("role", "branchmanager");
//       //   // postRequest(ServerConfig.url, BRANCHLOGIN, { username, password }).then(
//       //   //   (e) => {
//       //   //     // console.log(e);

//       //   //     sessionStorage.setItem("jwt", e.data.message);

//       //   //     // changeState(true);
//       //   //     sessionStorage.setItem("user", username);

//       //   //     //  setError("");
//       //   //     navigate("/HomePage");
//       //   //     //   getRequest(ServerConfig.url, PAYMBRANCHES).then((e) => {
//       //   //     //     var branchdet = e.data.filter((s) => s.branchUserId == username);
//       //   //     //     console.log(branchdet);
//       //   //     //     props.dispatch(
//       //   //     //       setUser({
//       //   //     //         branch: branchdet[0].pnBranchId,
//       //   //     //         company: branchdet[0].pnCompanyId,
//       //   //     //       })
//       //   //     //     );
//       //   //     //     sessionStorage.setItem(
//       //   //     //       "branch",
//       //   //     //       encryptData(branchdet[0].pnBranchId)
//       //   //     //     );
//       //   //     //     sessionStorage.setItem(
//       //   //     //       "company",
//       //   //     //       encryptData(branchdet[0].pnCompanyId)
//       //   //     //     );
//       //   //     //   });
//       //   //     // })
//       //   //     //   .catch(() => {
//       //   //     setError("Invalid username or password");
//       //   //   }
//       //   // );
//       //   postRequest(ServerConfig.url, BRANCHLOGIN, {
//       //     username,
//       //     password,
//       //     status: "Active", // <-- send active status to backend
//       //   })
//       //     .then((res) => {
//       //       // Backend only returns token if login succeeds and status is active
//       //       sessionStorage.setItem("jwt", res.data.message);
//       //       sessionStorage.setItem("user", username);
//       //       sessionStorage.setItem("role", "branchmanager");

//       //       navigate("/HomePage");
//       //     })
//       //     .catch(() => {
//       //       // Either invalid credentials or inactive account
//       //       setError("Invalid username, password, or inactive account");
//       //     });
//       // }
//     } else if (loginType === "Branch") {
//       sessionStorage.setItem("role", "branchmanager");

//       postRequest(ServerConfig.url, BRANCHLOGIN, { username, password })
//         .then((res) => {
//           console.log("Branch Login Response:", res);

//           // ✅ Store the JWT or message token
//           sessionStorage.setItem("jwt", res.data.token || "");
//           sessionStorage.setItem("user", username);
//           sessionStorage.setItem("role", "branchmanager");

//           // ✅ Store the database name returned from backend
//           if (res.data.dbname) {
//             sessionStorage.setItem("databaseName", res.data.dbname);
//             console.log("Database Name stored:", res.data.dbname);
//           } else {
//             console.warn("No database name found in response!");
//           }

//           // ✅ Navigate to homepage
//           navigate("/HomePage");
//         })
//         .catch((err) => {
//           console.error("Branch Login Error:", err);
//           setError("Invalid username, password, or inactive account");
//         });
//     } else {
//       console.log("employee");
//       // postRequest(ServerConfig.url, EMPLOYEELOGIN, { username, password })
//       //   .then((e) => {
//       //     //  console.log(e);
//       //     sessionStorage.setItem("jwt", e.data.message);

//       //     // changeState(true);
//       //     sessionStorage.setItem("user", username);

//       //     navigate("/HomePage2");

//       //     //  setError("");
//       //     getRequest(ServerConfig.url, PAYMEMPLOYEE).then((e) => {
//       //       var branchdet = e.data.filter((s) => s.employeeCode == username);
//       //       if (branchdet[0].role == 1) {
//       //         sessionStorage.setItem("role", "hr");
//       //       } else if (branchdet[0].role == 4) {
//       //         navigate("/HomePage2");
//       //         sessionStorage.setItem("role", "employee");
//       //       } else if (branchdet[0].role == 2) {
//       //         navigate("/HomePage2");
//       //         sessionStorage.setItem("role", "accounts");
//       //       } else if (branchdet[0].role == 3) {
//       //         sessionStorage.setItem("role", "grouphead");
//       //       } else if (branchdet[0].role == 5) {
//       //       }
//       //       // props.dispatchx(
//       //       //   setUser({
//       //       //     branch: branchdet[0].pnEmployeeId,
//       //       //     company: branchdet[0].,
//       //       //   })
//       //       // );
//       //       //   sessionStorage.setItem("employee", encryptData(branchdet));
//       //     });
//       //   })
//       //   .catch(() => {
//       //     setError("Invalid username or password");
//       //   });
//       postRequest(ServerConfig.url, EMPLOYEELOGIN, { username, password })
//   .then((e) => {
//     console.log("employee login response", e.data);

//     // Store token
//     sessionStorage.setItem("jwt", e.data.token);

//     // Store username
//     sessionStorage.setItem("user", username);

//     // ⭐ Store dynamic DB name from backend response
//     if (e.data.dbname) {
//       sessionStorage.setItem("databaseName", e.data.dbname);
//     }

//     // Navigate
//     navigate("/HomePage2");

//     // Fetch employee details
//     getRequest(ServerConfig.url, PAYMEMPLOYEE).then((ed) => {
//       var branchdet = ed.data.filter((s) => s.employeeCode == username);

//       if (branchdet.length > 0) {
//         const role = branchdet[0].role;

//         if (role == 1) {
//           sessionStorage.setItem("role", "hr");
//         } else if (role == 4) {
//           sessionStorage.setItem("role", "employee");
//         } else if (role == 2) {
//           sessionStorage.setItem("role", "accounts");
//         } else if (role == 3) {
//           sessionStorage.setItem("role", "grouphead");
//         } else if (role == 5) {
//           sessionStorage.setItem("role", "admin");
//         }
//       }
//     });
//   })
//   .catch(() => {
//     setError("Invalid username or password");
//   });

//     }
//   };

//   return (
//     <Box
//       sx={{
//         width: "100vw",
//         minHeight: "100vh", // Ensures full screen height
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         padding: 2,
//       }}
//     >
//       {/* Centered Login Wrapper */}
//       <Box
//         sx={{
//           width: "80vw",
//           maxWidth: "800px",
//           display: "flex",
//           flexDirection: { xs: "column", md: "row" },
//           justifyContent: "center", // Ensures centering of both elements
//           alignItems: "center",
//           backgroundColor: "white",
//           borderRadius: "10px",
//           padding: { xs: 2, md: 3 },
//           boxShadow: "0px 6px 15px rgba(76, 8, 204, 0.15)",
//         }}
//       >
//         {/* Centered Form Container */}
//         <Container
//           component="main"
//           sx={{
//             width: "100%",
//             maxWidth: "400px",
//             minHeight: "30vh",
//             padding: 2,
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center", // Centers the form content
//             justifyContent: "center", // Centers vertically
//           }}
//         >
//           <img
//             src={paymicon} // Change this path to your actual image
//             alt="Login"
//             style={{ width: "60px", height: "60px", marginBottom: "5px" }} // Adjust size as needed
//           />
//           <Typography
//             component="h1"
//             variant="h4"
//             align="center"
//             gutterBottom
//             sx={{ color: "#1976D2", fontWeight: "bold" }}
//           >
//             Login
//           </Typography>

//           {error && (
//             <Typography color="error" align="center" gutterBottom>
//               {error}
//             </Typography>
//           )}
//           <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
//             <Grid container spacing={2}>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   label="Username"
//                   variant="outlined"
//                   value={username}
//                   onChange={handleUsernameChange}
//                   sx={{
//                     backgroundColor: "#E3F2FD",
//                     borderRadius: "12px",
//                     "& .MuiOutlinedInput-root": {
//                       borderRadius: "12px",
//                     },
//                   }}
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   label="Password"
//                   variant="outlined"
//                   type="password"
//                   value={password}
//                   onChange={handlePasswordChange}
//                   sx={{
//                     backgroundColor: "#E3F2FD",
//                     borderRadius: "12px",
//                     "& .MuiOutlinedInput-root": {
//                       borderRadius: "12px",
//                     },
//                   }}
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 {/* <TextField
//                 fullWidth
//                 label="Password"
//                 variant="outlined"
//                 type="password"
//                 value={password}
//                 onChange={handlePasswordChange}
//                 sx={{ backgroundColor: "#f9f9f9" }}
//               /> */}
//                 <select
//                   style={{
//                     backgroundColor: "#E3F2FD",
//                     height: "55px",
//                     width: "320px",
//                     borderRadius: "12px",

//                     padding: "5px",
//                   }}
//                   onChange={(e) => setLoginType(e.target.value)}
//                 >
//                   <option>Select Login Type</option>
//                   <option>Company</option>
//                   <option>Branch</option>
//                   <option>Employee</option>
//                 </select>
//               </Grid>
//             </Grid>

//             <Button
//               type="submit"
//               variant="contained"
//               sx={{
//                 mt: 3,
//                 minWidth: "100px",
//                 width: "320px",
//                 lineHeight: "2.25",
//                 backgroundColor: "#1976D2",
//                 color: "#fff",
//                 borderRadius: "12px",
//                 "&:hover": { backgroundColor: "#1565C0" },
//               }}
//             >
//               Login Now
//             </Button>
//             <Grid>
//               <Typography style={{ padding: "10px 0 0 0" }}>
//                 Don't have an account?{" "}
//                 <a
//                   href="/RegisterPage"
//                   style={{ color: "blue", textDecoration: "none" }}
//                 >
//                   Signup Now
//                 </a>
//               </Typography>
//             </Grid>
//           </Box>
//         </Container>
//         <Box
//           sx={{
//             // Adjust image container width
//             display: "flex",
//             justifyContent: "center",
//           }}
//         >
//           <img
//             src={login} // Change this path to your actual image
//             style={{ width: "90%", height: "50%", borderRadius: "2px" }}
//           />
//         </Box>
//       </Box>
//     </Box>
//   );
// }
// const mapStateToProps = (state) => ({ state: state });
// const mapDispatchToProps = (dispatch) => ({ dispatch: dispatch });
// export default connect(mapStateToProps, mapDispatchToProps)(LoginOthers);






// import React, { useState } from "react";
// import {
//   Grid,
//   Button,
//   TextField,
//   Paper,
//   Typography,
//   Box,
//   AppBar,
//   Container,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { connect } from "react-redux";
// import { setUser } from "../../reduxcomp/actions/actionfunctions";
// import { ServerConfig } from "../../serverconfiguration/serverconfig";

// import { postRequest, getRequest } from "../../serverconfiguration/requestcomp";
// import { COMMONLOGIN, PAYMEMPLOYEE } from "../../serverconfiguration/controllers";

// import paymicon from "../../../src/images/Asset.jpeg";
// import login from "../../../src/images/Login.jpeg";

// function LoginOthers(props) {
//   const [username, setUsername] = useState("");
//   const navigate = useNavigate();
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = (event) => {
//     event.preventDefault();

//     // 🔥 Call only COMMON LOGIN API
//     postRequest(ServerConfig.url, COMMONLOGIN, { username, password })
//       .then((response) => {
//         const data = response.data;
//         console.log("LOGIN RESPONSE:", data);

//         // Store JWT
//         sessionStorage.setItem("jwt", data.token || "");

//         // Store username
//         sessionStorage.setItem("user", username);

//         // Store database name from backend
//         if (data.database) {
//           sessionStorage.setItem("databaseName", data.database);
//         }

//         // Store login message (Company / Branch / Employee)
//         if (data.message) {
//           sessionStorage.setItem("loginMessage", data.message);
//         }

//         // 🚀 Redirect based on login type
//         if (data.message.includes("Company")) {
//           sessionStorage.setItem("role", "company");
//           navigate("/Homepage1");
//         } else if (data.message.includes("Branch")) {
//           sessionStorage.setItem("role", "branchmanager");
//           navigate("/HomePage");
//         } else if (data.message.includes("Employee")) {
//           sessionStorage.setItem("role", "employee");

//           // 🔥 Fetch employee details & set role
//           getRequest(ServerConfig.url, PAYMEMPLOYEE).then((empRes) => {
//             const emp = empRes.data.find((e) => e.employeeCode == username);

//             if (emp) {
//               switch (emp.role) {
//                 case 1:
//                   sessionStorage.setItem("role", "hr");
//                   break;
//                 case 2:
//                   sessionStorage.setItem("role", "accounts");
//                   break;
//                 case 3:
//                   sessionStorage.setItem("role", "grouphead");
//                   break;
//                 case 4:
//                   sessionStorage.setItem("role", "employee");
//                   break;
//                 case 5:
//                   sessionStorage.setItem("role", "admin");
//                   break;
//                 default:
//                   sessionStorage.setItem("role", "employee");
//               }
//             }
//           });

//           navigate("/HomePage2");
//         }
//       })
//       .catch((err) => {
//         console.log("LOGIN ERROR:", err);
//         setError("Invalid username or password");
//       });
//   };

//   return (
//     <Box
//       sx={{
//         width: "100vw",
//         minHeight: "100vh",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         padding: 2,
//       }}
//     >
//       <Box
//         sx={{
//           width: "80vw",
//           maxWidth: "800px",
//           display: "flex",
//           flexDirection: { xs: "column", md: "row" },
//           justifyContent: "center",
//           alignItems: "center",
//           backgroundColor: "white",
//           borderRadius: "10px",
//           padding: { xs: 2, md: 3 },
//           boxShadow: "0px 6px 15px rgba(76, 8, 204, 0.15)",
//         }}
//       >
//         {/* FORM */}
//         <Container
//           component="main"
//           sx={{
//             width: "100%",
//             maxWidth: "400px",
//             minHeight: "30vh",
//             padding: 2,
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           <img
//             src={paymicon}
//             alt="Login"
//             style={{ width: "60px", height: "60px", marginBottom: "5px" }}
//           />
//           <Typography
//             component="h1"
//             variant="h4"
//             align="center"
//             gutterBottom
//             sx={{ color: "#1976D2", fontWeight: "bold" }}
//           >
//             Login
//           </Typography>

//           {error && (
//             <Typography color="error" align="center" gutterBottom>
//               {error}
//             </Typography>
//           )}

//           <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
//             <Grid container spacing={2}>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   label="Username"
//                   variant="outlined"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   sx={{
//                     backgroundColor: "#E3F2FD",
//                     borderRadius: "12px",
//                   }}
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Grid>

//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   label="Password"
//                   type="password"
//                   variant="outlined"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   sx={{
//                     backgroundColor: "#E3F2FD",
//                     borderRadius: "12px",
//                   }}
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Grid>
//             </Grid>

//             <Button
//               type="submit"
//               variant="contained"
//               sx={{
//                 mt: 3,
//                 width: "320px",
//                 lineHeight: "2.25",
//                 backgroundColor: "#1976D2",
//                 color: "#fff",
//                 borderRadius: "12px",
//                 "&:hover": { backgroundColor: "#1565C0" },
//               }}
//             >
//               Login Now
//             </Button>
//           </Box>

//           <Typography style={{ padding: "10px 0 0 0" }}>
//             Don't have an account?{" "}
//             <a href="/RegisterPage" style={{ color: "blue", textDecoration: "none" }}>
//               Signup Now
//             </a>
//           </Typography>
//         </Container>

//         {/* IMAGE */}
//         <Box sx={{ display: "flex", justifyContent: "center" }}>
//           <img
//             src={login}
//             style={{ width: "90%", height: "50%", borderRadius: "2px" }}
//           />
//         </Box>
//       </Box>
//     </Box>
//   );
// }

// const mapStateToProps = (state) => ({ state: state });
// const mapDispatchToProps = (dispatch) => ({ dispatch: dispatch });
// export default connect(mapStateToProps, mapDispatchToProps)(LoginOthers);







import React, { useState } from "react";
import {
  Grid,
  Button,
  TextField,
  Typography,
  Box,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { ServerConfig } from "../../serverconfiguration/serverconfig";

import { postRequest, getRequest } from "../../serverconfiguration/requestcomp";
import { COMMONLOGIN, PAYMEMPLOYEE } from "../../serverconfiguration/controllers";

import paymicon from "../../../src/images/Asset.jpeg";
import login from "../../../src/images/Login.jpeg";
import axios from "axios";

function Login(props) {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // const handleSubmit = (event) => {
  //   event.preventDefault();

  //   // 🔥 Call only COMMON LOGIN API
  //   postRequest(ServerConfig.url, COMMONLOGIN, { username, password })
  //     .then((response) => {
  //       const data = response.data;
  //       console.log("LOGIN RESPONSE:", data);

  //       // Store JWT
  //       sessionStorage.setItem("jwt", data.token || "");

  //       // Store username
  //       sessionStorage.setItem("user", username);
  //       sessionStorage.setItem("userId", response.data.userId);

  //       // Store database name
  //       if (data.database) {
  //         sessionStorage.setItem("databaseName", data.database);
  //       }

  //       // Store login message
  //       if (data.message) {
  //         sessionStorage.setItem("loginMessage", data.message);
  //       }

  //       // 🚀 Redirect based on login type
  //       if (data.message.includes("Company")) {
  //         sessionStorage.setItem("role", "company");
  //         navigate("/Homepage1");
  //       } 
  //       else if (data.message.includes("Branch")) {
  //         sessionStorage.setItem("role", "branchmanager");
  //         navigate("/HomePage");
  //       } 
  //       else if (data.message.includes("Employee")) {
  //         sessionStorage.setItem("role", "employee");

  //         // 🔥 SAFE role fetch (no error will be thrown)
  //         try {
  //           getRequest(ServerConfig.url, PAYMEMPLOYEE)
  //             .then((empRes) => {
  //               if (!empRes?.data) return; // prevent undefined errors

  //               const emp = empRes.data.find(
  //                 (e) => e.employeeCode == username
  //               );
  //               if (!emp) return;

  //               switch (emp.role) {
  //                 case 1:
  //                   sessionStorage.setItem("role", "hr");
  //                   break;
  //                 case 2:
  //                   sessionStorage.setItem("role", "accounts");
  //                   break;
  //                 case 3:
  //                   sessionStorage.setItem("role", "grouphead");
  //                   break;
  //                 case 4:
  //                   sessionStorage.setItem("role", "employee");
  //                   break;
  //                 case 5:
  //                   sessionStorage.setItem("role", "admin");
  //                   break;
  //                 default:
  //                   sessionStorage.setItem("role", "employee");
  //               }
  //             })
  //             .catch((err) => {
  //               // ❗ Error ignored safely (temporary)
  //               console.error(
  //                 "Employee role API failed (temporary):",
  //                 err.message
  //               );
  //             });
  //         } catch (e) {
  //           console.warn("Unexpected role fetch error:", e);
  //         }

  //         navigate("/HomePage2");
  //       }
  //     })
  //     .catch((err) => {
  //       console.log("LOGIN ERROR:", err);
  //       setError("Invalid username or password");
  //     });
  // };
  const handleSubmit = async (event) => {
  event.preventDefault();
  setError("");

  try {
    // 1. Send Login Request
    const response = await axios.post(
      "https://localhost:7266/api/CommonLogin",
      { username, password }
    );

    const data = response.data;
    console.log("Login response:", data);

    // 2. Prepare the Auth Object (Unifies all your data)
    const auth = {
      token: data.token,
      id: data.userId,
      username: username,
      email: data.email || username,
      // Default role from message, will update if it's an employee
      role: data.message.includes("Company") ? "company" : 
            data.message.includes("Branch") ? "branchmanager" : "employee"
    };

    // 3. Handle specific Employee Role logic if necessary
    if (data.message.includes("Employee")) {
      try {
        const empRes = await axios.get("https://localhost:7266/api/PaymEmployees", {
          headers: { Authorization: `Bearer ${data.token}` }
        });

        const emp = empRes.data.find((e) => e.employeeCode === username);
        if (emp) {
          const roles = { 1: "hr", 2: "accounts", 3: "grouphead", 4: "employee", 5: "admin" };
          auth.role = roles[emp.role] || "employee";
        }
      } catch (empErr) {
        console.error("Employee role fetch failed, defaulting to 'employee'", empErr);
      }
    }

    // 4. Save to SessionStorage and Notify Navbar
    sessionStorage.setItem("auth", JSON.stringify(auth));
    window.dispatchEvent(new Event("authChanged"));

    // 5. Final Navigation
    if (auth.role === "company") {
      navigate("/Homepage1");
    } else if (auth.role === "branchmanager") {
      navigate("/HomePage1");
    } else {
      navigate("/HomePage2"); // HR, Admin, Employees, etc.
    }

    if (props.isLoggedIn) props.isLoggedIn(true);

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    setError("Invalid username or password");
  }
};

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
      }}
    >
      <Box
        sx={{
          width: "80vw",
          maxWidth: "800px",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
          borderRadius: "10px",
          padding: { xs: 2, md: 3 },
          boxShadow: "0px 6px 15px rgba(76, 8, 204, 0.15)",
        }}
      >
        {/* FORM */}
        <Container
          component="main"
          sx={{
            width: "100%",
            maxWidth: "400px",
            minHeight: "30vh",
            padding: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={paymicon}
            alt="Login"
            style={{ width: "60px", height: "60px", marginBottom: "5px" }}
          />

          <Typography
            component="h1"
            variant="h4"
            align="center"
            gutterBottom
            sx={{ color: "#1976D2", fontWeight: "bold" }}
          >
            Login
          </Typography>

          {error && (
            <Typography color="error" align="center" gutterBottom>
              {error}
            </Typography>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Username"
                  variant="outlined"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  sx={{ backgroundColor: "#E3F2FD", borderRadius: "12px" }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{ backgroundColor: "#E3F2FD", borderRadius: "12px" }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              sx={{
                mt: 3,
                width: "320px",
                lineHeight: "2.25",
                backgroundColor: "#1976D2",
                color: "#fff",
                borderRadius: "12px",
                "&:hover": { backgroundColor: "#1565C0" },
              }}
            >
              Login Nowww
            </Button>
          </Box>

          <Typography style={{ padding: "10px 0 0 0" }}>
            Don't have an account?{" "}
            <a
              href="/RegisterPage"
              style={{ color: "blue", textDecoration: "none" }}
            >
              Signup Now
            </a>
          </Typography>
        </Container>

        {/* IMAGE */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <img
            src={login}
            style={{ width: "90%", height: "50%", borderRadius: "2px" }}
          />
        </Box>
      </Box>
    </Box>
  );
}

const mapStateToProps = (state) => ({ state: state });
const mapDispatchToProps = (dispatch) => ({ dispatch: dispatch });
export default connect(mapStateToProps, mapDispatchToProps)(Login);
