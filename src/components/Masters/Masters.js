import React, { useEffect } from "react";
import Sidenav from "../Home Page/Sidenav";
import Navbar from "../Home Page/Navbar";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Search, Settings } from "@mui/icons-material";
import WorkIcon from "@mui/icons-material/Work";
import TodayIcon from "@mui/icons-material/Today";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from '@mui/icons-material/School';
import BookIcon from '@mui/icons-material/Book';
import { keyframes } from '@mui/system';
import { Navigate, useNavigate } from "react-router-dom";
import Company from '../../../src/images/Home page/Company.jpeg'
import Branch from "../../../src/images/Home page/Branch.jpeg"
import Department from "../../../src/images/Home page/Department.jpeg"
import Division from "../../../src/images/Home page/Division.jpeg"
import Grade from "../../../src/images/Home page/Grade.jpeg"
import Shift from "../../../src/images/Home page/Shift.jpeg"
import Category from "../../../src/images/Home page/Category.jpeg"
import Jobstatus from "../../../src/images/Home page/Jobstatus.jpeg"
import Level from "../../../src/images/Home page/Level.jpeg"
import Leave from "../../../src/images/Home page/Leave.jpeg"
import Designation from "../../../src/images/Home page/Designation.jpeg"
import Group from "../../images/group-icons.png"
import CastForEducationIcon from '@mui/icons-material/CastForEducation';
import AOS from 'aos'; // Import AOS
import 'aos/dist/aos.css'; // Import AOS CSS


const bounce = keyframes({
  '0%, 20%, 50%, 80%, 100%': {
    transform: 'translateY(0)',
  },
  '40%': {
    transform: 'translateY(-15px)',
  },
  '60%': {
    transform: 'translateY(-10px)',
  },
});


export default function Masters1() {
    const navigate = useNavigate();

    const cardItems = [
        // { text: "Company", icon: <img src={Company} width={50} height={50}  /> ,onclick : () => navigate('/CompanyMasterss1')  },
        // { text: "Branch", icon: <img src={Branch} width={50} height={50}  />, onclick : () => navigate('/BranchMaster1')   },
        { text: "Division", icon: <img src={Division} width={50} height={50}  />, onclick : () => navigate('/Divisions') },
        { text: "Department", icon: <img src={Department} width={50} height={50}  /> , onclick : () => navigate('/Departments')  },
        { text: "Designation", icon: <img src={Designation} width={50} height={50}  />  , onclick : () => navigate('/Designations') },
        { text: "Grade", icon: <img src={Grade} width={50} height={50}  />  , onclick : () => navigate('/Grades')  },
       // { text: "Shift", icon: <img src={Shift} width={50} height={50}  />, onclick : () => navigate('/ShiftFormMaster1') }, 
        { text: "Category", icon: <img src={Category} width={50} height={50}  />  , onclick : () => navigate('/Categorys')  },
        { text: "Jobstatus", icon: <img src={Jobstatus} width={50} height={50}  />  , onclick : () => navigate('/JobStatus')  },
        { text: "Level", icon: <img src={Level} width={50} height={50}  /> , onclick : () => navigate('/Levels')   },
        { text: "Leave", icon: <img src={Leave} width={50} height={50}  />  , onclick : () => navigate('/Leaves')  },
       // { text: "Earn Deduct", icon:  <CastForEducationIcon style={{ width: 50, height: 50 }}/>,  onclick : () => navigate('/EarnDeductCompanyMasters')  },
       { text: "Assets", icon: <WorkIcon sx={{ width: 50, height: 50 }} />,onclick: () => navigate('/Assets') },
      ];
      
      useEffect(() => {
        AOS.init({
            duration: 1000, // Set to 1 second for quick animation
            easing: 'ease-in-out', // Optional: Choose an easing function
        });
    }, []);
  return (
  <Grid container>
    {/* Navbar and Sidebar */}
    <Grid item xs={12}>
      <div style={{ backgroundColor: "#fff" }}>
       <Navbar /> 
        <Box height={30} />
        <Box sx={{ display: "flex", backgroundColor: "#efefef", alignItems: "flex-start" }}>
           <Sidenav /> 
          {/* Main Content */}
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7} sx={{ margin: "50px auto", textAlign: "left" }}>
            <div data-aos="zoom-in-down">
              <Box
                sx={{
                  borderRadius: "8px",
                  p: 3,
                  height: "100%",
                }}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <Grid container spacing={3}>
                    {cardItems.map((item, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card
                          sx={{
                            maxWidth: "500px", // optional: to avoid stretching full width
                            maxHeight: "160px",
                            borderRadius: "8px",
                            backgroundColor: "white",
                            flexDirection: "column", // stack children vertically
                            alignItems: "center", // center horizontally
                            justifyContent: "center",
                            transition: "transform 0.4s ease-in-out",
                            "&:hover": {
                              transform: "scale(1.1) translateY(-10px)",
                              "& .icon-button, & .text": {
                                animation: `${bounce} 2s infinite`,
                              },
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              p: 2,
                              height: "100%",
                            }}
                          >
                            <IconButton className="icon-button" sx={{ mb: 2, color: "black" }} onClick={item.onclick}>
                              {item.icon}
                            </IconButton>
                            <Typography className="text" variant="h6" sx={{ color: "black" }}>
                              {item.text}
                            </Typography>
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Box>
            </div>
          </Grid>
        </Box>
      </div>
    </Grid>
  </Grid>
);
}