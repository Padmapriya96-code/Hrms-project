// import React, { useState } from "react";
// import {
//   Container,
//   TextField,
//   Button,
//   Typography,
//   Box,
//   Grid,
//   Paper,
// } from "@mui/material";
// import { toast } from 'react-toastify';
// import axios from "axios";
// import { ServerConfig } from "../../serverconfiguration/serverconfig";
// import { REPORTS } from "../../serverconfiguration/controllers";
// import { postRequest } from "../../serverconfiguration/requestcomp";
// import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
// import BusinessIcon from '@mui/icons-material/Business';
// import {  useNavigate } from "react-router-dom";
// const RegisterPage = () => {
//    const navigate = useNavigate();
//   const [formData, setFormData] = useState({
    
//     companyName: "",
//     email: "",
//     username: "",
//     password: "",
//     mobileNumber: "",
//     address: "",
//   companyCode: "",          // "" instead of "null"
//   companyName: "",
//   addressLine1: "",
//   addressLine2: "",
//   city: "",
//   zipCode: "",
//   country: "",
//   state: "",
//   phoneNo: "",
//   faxNo: "",
//   emailId: "",
//   alternateEmailId: "",
//   startDate: null,          // real null
//   endDate: null,
//   websiteURL: "",
//   gstNumber: "",
//   contactPerson: "",
//   companyLogo: null, 
//   });

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };
//   let registerResponse; // ✅ Declare outside try block

//  const handleSubmit = async (e) => {
//   e.preventDefault();

//   const payload = {
    
//     registerUser: {
//       userID: 0,
//       companyName: formData.companyName,
//       email: formData.email,
//       username: formData.username,
//       passwordHash: formData.password,
//       mobileNumber: formData.mobileNumber,
//       address: formData.address,
//       createdAt: new Date().toISOString(),
//       isActive: true,
//     },
//     companyInfo: {
//       companyCode: formData.companyCode,
//       companyName: formData.companyName,
//       addressLine1: formData.addressLine1,
//       addressLine2: formData.addressLine2,
//       city: formData.city,
//       zipCode: formData.ZipCode,
//       country: formData.country,
//       state: formData.state,
//       phoneNo: formData.mobileNumber,
//       faxNo: formData.faxNo,
//       emailId: formData.email,
//       alternateEmailId: formData.alternateEmailAddress,
//       startDate: formData.startDate,
//       endDate: formData.endDate,
//       companyUserId: formData.username,
//       companyPassword: formData.password,
//       websiteURL: formData.WebsiteURL,
//       companyLogo: formData.CompanyLogo,
//     }
//   };

//   try {
//      toast.dismiss();
//     // const res = await axios.post("https://localhost:7266/api/Signup/Register", payload);
//     const res = await axios.post("https://localhost:7266/api/Register/Register", payload);
//     if (res.status === 200) {
//       toast.info("Registration  successful!", {
//            position: "top-center", // Centers horizontally
//            style: { textAlign: "center" }, // Centers text
//            autoClose: 1000,
//          });
//     }
//     navigate('/')
//   } catch (error) {
//     console.error("Error during submission:", error);
//     toast.error("Submission failed: " + (error.response?.data?.error || error.message), {
//            position: "top-center", // Centers horizontally
//            style: { textAlign: "center" }, // Centers text
//            autoClose: 1000,
//          });
//   }
// };

//   return (
//     <Container maxWidth="sm">
//       <Paper elevation={3} sx={{ p: 4, mt: 5, boxShadow: "0px 6px 15px rgb(162, 206, 239)",
  
//  }}>
//         <AccountCircleOutlinedIcon
//       color="primary" sx={{ fontSize: 64 }} />
//         <Typography variant="h5" gutterBottom sx={{mt:1}}>
//           Registration
//         </Typography>
//         <form onSubmit={handleSubmit}>
//           <Grid container spacing={2} sx={{mt:1}}>
//             <Grid item xs={12} sm={6}>
//             <TextField
//   name="companyName"
//   label="Company Name"
//   fullWidth
//   required
//   value={formData.companyName}
//   onChange={handleChange}
  
//   sx={{
//     // Text color for input
//     '& .MuiInputBase-input': {
//       color: '#000000', // black text color
//     },
//     // Label style
//     '& label': {
//       color: '#000000', // black color for label
//     },
//     '& label.Mui-focused': {
//       color: '#000000', // black color for focused label
//     },
//     // Underline style for outlined variant
//     '& .MuiOutlinedInput-root': {
//       '& fieldset': {
//         borderColor: '#000000', // black border color
//         borderWidth: '1px', // thin border
//       },
//       '&:hover fieldset': {
//         borderColor: '#000000', // black border on hover
//       },
//       '&.Mui-focused fieldset': {
//         borderColor: '#000000', // black border when focused
//       },
//     },
//   }}
// />

//             </Grid>
//                <Grid item xs={12} sm={6}>
//               <TextField
//                 name="username"
//                 label="Username"
//                 fullWidth
//                 required
//                 value={formData.username}
//                 onChange={handleChange}
//                 sx={{
//     // Text color for input
//     '& .MuiInputBase-input': {
//       color: '#000000', // black text color
//     },
//     // Label style
//     '& label': {
//       color: '#000000', // black color for label
//     },
//     '& label.Mui-focused': {
//       color: '#000000', // black color for focused label
//     },
//     // Underline style for outlined variant
//     '& .MuiOutlinedInput-root': {
//       '& fieldset': {
//         borderColor: '#000000', // black border color
//         borderWidth: '1px', // thin border
//       },
//       '&:hover fieldset': {
//         borderColor: '#000000', // black border on hover
//       },
//       '&.Mui-focused fieldset': {
//         borderColor: '#000000', // black border when focused
//       },
//     },
//   }}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 name="email"
//                 label="Email"
//                 fullWidth
//                 required
//                 type="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 sx={{
//     // Text color for input
//     '& .MuiInputBase-input': {
//       color: '#000000', // black text color
//     },
//     // Label style
//     '& label': {
//       color: '#000000', // black color for label
//     },
//     '& label.Mui-focused': {
//       color: '#000000', // black color for focused label
//     },
//     // Underline style for outlined variant
//     '& .MuiOutlinedInput-root': {
//       '& fieldset': {
//         borderColor: '#000000', // black border color
//         borderWidth: '1px', // thin border
//       },
//       '&:hover fieldset': {
//         borderColor: '#000000', // black border on hover
//       },
//       '&.Mui-focused fieldset': {
//         borderColor: '#000000', // black border when focused
//       },
//     },
//   }}
//               />
//             </Grid>
//            <Grid item xs={12} sm={6}>
//               <TextField
//                 name="mobileNumber"
//                 label="Mobile Number"
//                 fullWidth
//                 value={formData.mobileNumber}
//                 onChange={handleChange}
//                 sx={{
//     // Text color for input
//     '& .MuiInputBase-input': {
//       color: '#000000', // black text color
//     },
//     // Label style
//     '& label': {
//       color: '#000000', // black color for label
//     },
//     '& label.Mui-focused': {
//       color: '#000000', // black color for focused label
//     },
//     // Underline style for outlined variant
//     '& .MuiOutlinedInput-root': {
//       '& fieldset': {
//         borderColor: '#000000', // black border color
//         borderWidth: '1px', // thin border
//       },
//       '&:hover fieldset': {
//         borderColor: '#000000', // black border on hover
//       },
//       '&.Mui-focused fieldset': {
//         borderColor: '#000000', // black border when focused
//       },
//     },
//   }}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 name="password"
//                 label="Password"
//                 type="password"
//                 fullWidth
//                 required
//                 value={formData.password}
//                 onChange={handleChange}
//                 sx={{
//     // Text color for input
//     '& .MuiInputBase-input': {
//       color: '#000000', // black text color
//     },
//     // Label style
//     '& label': {
//       color: '#000000', // black color for label
//     },
//     '& label.Mui-focused': {
//       color: '#000000', // black color for focused label
//     },
//     // Underline style for outlined variant
//     '& .MuiOutlinedInput-root': {
//       '& fieldset': {
//         borderColor: '#000000', // black border color
//         borderWidth: '1px', // thin border
//       },
//       '&:hover fieldset': {
//         borderColor: '#000000', // black border on hover
//       },
//       '&.Mui-focused fieldset': {
//         borderColor: '#000000', // black border when focused
//       },
//     },
//   }}
  
//               />
//             </Grid>
          
//             <Grid item xs={12}>
//               <TextField
//                 name="address"
//                 label="Address"
//                 multiline
//                 rows={2}
//                 fullWidth
//                 value={formData.address}
//                 onChange={handleChange}
//                 sx={{
//     // Text color for input
//     '& .MuiInputBase-input': {
//       color: '#000000', // black text color
//     },
//     // Label style
//     '& label': {
//       color: '#000000', // black color for label
//     },
//     '& label.Mui-focused': {
//       color: '#000000', // black color for focused label
//     },
//     // Underline style for outlined variant
//     '& .MuiOutlinedInput-root': {
//       '& fieldset': {
//         borderColor: '#000000', // black border color
//         borderWidth: '1px', // thin border
//       },
//       '&:hover fieldset': {
//         borderColor: '#000000', // black border on hover
//       },
//       '&.Mui-focused fieldset': {
//         borderColor: '#000000', // black border when focused
//       },
//     },
//   }}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <Box display="flex" justifyContent="center">
//                 <Button variant="contained" type="submit">
//                   Register
//                 </Button>
//               </Box>
//             </Grid>
//           </Grid>
//         </form>
//       </Paper>
//     </Container>
//   );
// };

// export default RegisterPage;




// import React, { useState } from "react";
// import {
//   Container,
//   TextField,
//   Button,
//   Typography,
//   Box,
//   Grid,
//   Paper,
// } from "@mui/material";
// import { toast } from "react-toastify";
// import axios from "axios";
// import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
// import { useNavigate } from "react-router-dom";

// const RegisterPage = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     companyName: "",
//     email: "",
//     username: "",
//     password: "",
//     phoneNumber: "",
//     address: "",
//   });

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const payload = {
//   username: formData.username,
//   password: formData.password,
//   companyName: formData.companyName,
//   email: formData.email,
//   phoneNumber: formData.phoneNumber,
//   address: formData.address,
//   databaseName: "" // ✅ add this
// };


//     try {
//       toast.dismiss();

//       const res = await axios.post("https://localhost:7266/api/Register/Register", payload);

//       if (res.status === 200) {
//         toast.success(`✅ ${res.data.message}`, {
//           position: "top-center",
//           autoClose: 1500,
//         });
//         navigate("/");
//       }
//     } catch (error) {
//       console.error("Error during submission:", error);
//       toast.error(
//         "❌ Registration failed: " +
//           (error.response?.data?.message || error.message),
//         {
//           position: "top-center",
//           autoClose: 2000,
//         }
//       );
//     }
//   };

//   return (
//     <Container maxWidth="sm">
//       <Paper
//         elevation={3}
//         sx={{
//           p: 4,
//           mt: 5,
//           boxShadow: "0px 6px 15px rgb(162, 206, 239)",
//         }}
//       >
//         <Box textAlign="center">
//           <AccountCircleOutlinedIcon color="primary" sx={{ fontSize: 64 }} />
//           <Typography variant="h5" gutterBottom sx={{ mt: 1 }}>
//             Company Registration
//           </Typography>
//         </Box>

//         <form onSubmit={handleSubmit}>
//           <Grid container spacing={2} sx={{ mt: 1 }}>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 name="companyName"
//                 label="Company Name"
//                 fullWidth
//                 required
//                 value={formData.companyName}
//                 onChange={handleChange}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 name="username"
//                 label="Username"
//                 fullWidth
//                 required
//                 value={formData.username}
//                 onChange={handleChange}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <TextField
//                 name="email"
//                 label="Email"
//                 type="email"
//                 fullWidth
//                 required
//                 value={formData.email}
//                 onChange={handleChange}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 name="phoneNumber"
//                 label="Phone Number"
//                 fullWidth
//                 value={formData.phoneNumber}
//                 onChange={handleChange}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 name="password"
//                 label="Password"
//                 type="password"
//                 fullWidth
//                 required
//                 value={formData.password}
//                 onChange={handleChange}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <TextField
//                 name="address"
//                 label="Address"
//                 multiline
//                 rows={2}
//                 fullWidth
//                 value={formData.address}
//                 onChange={handleChange}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <Box display="flex" justifyContent="center">
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   type="submit"
//                   sx={{ px: 4 }}
//                 >
//                   Register
//                 </Button>
//               </Box>
//             </Grid>
//           </Grid>
//         </form>
//       </Paper>
//     </Container>
//   );
// };

// export default RegisterPage;

























//loader integration
import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Paper,
  CircularProgress,
  Backdrop,
  autoComplete
} from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    username: "",
    password: "",
    phoneNumber: "",
    address: "",
  });

  const [loading, setLoading] = useState(false); // ✅ loader state

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      username: formData.username,
      password: formData.password,
      companyName: formData.companyName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      databaseName: "", // backend can auto-create DB
    };

    try {
      toast.dismiss();
      setLoading(true); // ✅ show loader

      const res = await axios.post(
        "https://localhost:7266/api/register",
        payload
      );

      if (res.status === 200) {
        toast.success(`✅ ${res.data.message}`, {
          position: "top-center",
          autoClose: 1500,
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error(
        "❌ Registration failed: " +
          (error.response?.data?.message || error.message),
        {
          position: "top-center",
          autoClose: 2000,
        }
      );
    } finally {
      setLoading(false); // ✅ hide loader
    }
  };

  return (
    <>
      {/* ✅ Full-screen backdrop loader */}
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          flexDirection: "column",
        }}
        open={loading}
      >
        <CircularProgress color="inherit" size={60} />
        <Typography sx={{ mt: 2, fontSize: 18 }}>
          Creating database & registering company...
        </Typography>
      </Backdrop>

      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mt: 5,
            boxShadow: "0px 6px 15px rgb(162, 206, 239)",
          }}
        >
          <Box textAlign="center">
            <AccountCircleOutlinedIcon color="primary" sx={{ fontSize: 64 }} />
            <Typography variant="h5" gutterBottom sx={{ mt: 1 }}>
              Company Registration
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="companyName"
                  label="Company Name"
                  fullWidth
                  required
                  value={formData.companyName}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  name="username"
                  label="Username"
                  fullWidth
                  required
                  value={formData.username}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="email"
                  label="Email"
                  type="email"
                  fullWidth
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  name="phoneNumber"
                  label="Phone Number"
                  fullWidth
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  name="password"
                  label="Password"
                  type="password"
                  fullWidth
                  required
                  value={formData.password}
                  onChange={handleChange}
                  // autoComplete="new-password"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="address"
                  label="Address"
                  multiline
                  rows={2}
                  fullWidth
                  value={formData.address}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" justifyContent="center">
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    sx={{ px: 4 }}
                    disabled={loading} // disable button while loading
                  >
                    Register
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default RegisterPage;
