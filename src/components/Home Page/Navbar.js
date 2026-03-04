// import * as React from 'react';
// import { styled, alpha } from '@mui/material/styles';
// import MuiAppBar from '@mui/material/AppBar';
// import Box from '@mui/material/Box';
// import Toolbar from '@mui/material/Toolbar';
// import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
// import InputBase from '@mui/material/InputBase';
// import Badge from '@mui/material/Badge';
// import MenuItem from '@mui/material/MenuItem';
// import Menu from '@mui/material/Menu';
// import MenuIcon from '@mui/icons-material/Menu';
// import SearchIcon from '@mui/icons-material/Search';
// import AccountCircle from '@mui/icons-material/AccountCircle';
// import MailIcon from '@mui/icons-material/Mail';
// import NotificationsIcon from '@mui/icons-material/Notifications';
// import MoreIcon from '@mui/icons-material/MoreVert';
// import { useAppStore } from './appStore';
// import Avatar from "@mui/material/Avatar";
// import { useState } from "react";
// import { useEffect } from "react";
// import LogoutIcon from "@mui/icons-material/Logout";
// import { navigate, useNavigate } from 'react-router-dom';
// import settingss from "../../images/Settingss-icon.png"
// import { Gradient } from '@mui/icons-material';
// import Drawer from '@mui/material/Drawer';
// import Tab from '@mui/material/Tab';
// import { postRequest } from "../../serverconfiguration/requestcomp";
// import { ServerConfig } from "../../serverconfiguration/serverconfig";
// import { REPORTS, SAVE } from "../../serverconfiguration/controllers";
// // import hr from '../../images/hr.jpg';
// import { Stack } from '@mui/material';
// import Calendar from 'react-calendar'; // Ensure this is imported
// import 'react-calendar/dist/Calendar.css';
// import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';


// const AppBar = styled(MuiAppBar)(({ theme }) => ({
//   zIndex: theme.zIndex.drawer + 1,
//   background: '#FFFFFF', // Set background color to white

//   boxShadow: 'none', // Remove shadow if needed
//   borderRadius: "10px"
// }));
// const Search = styled('div')(({ theme }) => ({
//   position: 'relative',
//   borderRadius: theme.shape.borderRadius,
//   backgroundColor: alpha(theme.palette.common.white, 0.15),
//   '&:hover': {
//     backgroundColor: alpha(theme.palette.common.white, 0.25),
//   },
//   marginRight: theme.spacing(2),
//   marginLeft: 0,
//   width: '100%',
//   [theme.breakpoints.up('sm')]: {
//     marginLeft: theme.spacing(3),
//     width: 'auto',
//   },
// }));

// const SearchIconWrapper = styled('div')(({ theme }) => ({
//   padding: theme.spacing(0, 2),
//   height: '80%',
//   position: 'absolute',
//   pointerEvents: 'none',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
// }));


// const StyledInputBase = styled(InputBase)(({ theme }) => ({
//   color: 'inherit',
//   '& .MuiInputBase-input': {
//     padding: theme.spacing(1, 1, 1, 0),
//     paddingLeft: `calc(1em + ${theme.spacing(4)})`,
//     transition: theme.transitions.create('width'),
//     width: '100%',
//     [theme.breakpoints.up('md')]: {
//       width: '20ch',
//     },
//   },
// }));



// export default function Navbar() {
//   const navigate = useNavigate();
//   const [anchorEl, setAnchorEl] = React.useState(null);
//   const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
//   const updateOpen = useAppStore((state) => state.updateOpen);
//   const dopen = useAppStore((state) => state.dopen);
//   const isLoggedIn = sessionStorage.getItem("user") !== null;
//   const [branchName, setBranchName] = useState('');
//   const [branchData, setBranchData] = useState(null);

//   const [dropdownAnchorEl, setDropdownAnchorEl] = useState(null);

//   const handleDropdownOpen = (event) => {
//     setDropdownAnchorEl(event.currentTarget);
//   };

//   const handleDropdownClose = () => {
//     setDropdownAnchorEl(null);
//   };

//   const isDropdownOpen = Boolean(dropdownAnchorEl);



//   const isMenuOpen = Boolean(anchorEl);
//   const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

//   const [showCalendar, setShowCalendar] = useState(false); // State to manage calendar visibility
//   const handleCalendarToggle = () => {
//     setShowCalendar(!showCalendar); // Toggle calendar visibility
//   };


//   // Fetch company data

//   const [company, setCompany] = useState(null);
//   const [pnCompanyId, setPnCompanyId] = useState(null);
//   const [companyName, setCompanyName] = useState('');
//   const [companyLogo, setCompanyLogo] = useState(null);
//   const [logoError, setLogoError] = useState(false);

//   const [userEmail, setUserEmail] = useState('');
//   const [userImage, setUserImage] = useState('');

//   // useEffect(() => {
//   //   const fetchData = async () => {
//   //     try {
//   //       const user = sessionStorage.getItem("user");
//   //       if (!user) return;

//   //       // 1. Fetch branch data
//   //       const branchResponse = await postRequest(ServerConfig.url, REPORTS, {
//   //         query: `SELECT * FROM paym_Branch WHERE Branch_User_Id = '${user}'`
//   //       });

//   //       if (branchResponse.data?.length > 0) {
//   //         const branch = branchResponse.data[0];
//   //         setBranchData(branch);
//   //         setBranchName(branch.BranchName);
//   //         sessionStorage.setItem("branchInfo", JSON.stringify(branch));

//   //         // 2. Fetch company data using the company ID from branch
//   //         const companyResponse = await postRequest(ServerConfig.url, REPORTS, {
//   //           query: `SELECT CompanyLogo, CompanyName FROM paym_Company WHERE pn_CompanyID = '${branch.pn_CompanyID}'`
//   //         });

//   //         if (companyResponse.data?.length > 0) {
//   //           const company = companyResponse.data[0];
//   //           setCompanyName(company.CompanyName);

//   //           // 3. Process company logo
//   //           if (company.CompanyLogo) {
//   //             let logoUrl;
//   //             // Check if logo is URL, base64, or binary
//   //             if (company.CompanyLogo.startsWith('http')) {
//   //               logoUrl = company.CompanyLogo; // Full URL
//   //             } else if (company.CompanyLogo.length > 100) {
//   //               // Likely base64 data
//   //               logoUrl = `data:image/png;base64,${company.CompanyLogo}`;
//   //             } else {
//   //               // Handle binary data or file path
//   //               logoUrl = `${ServerConfig.baseUrl}/${company.CompanyLogo}`;
//   //             }
//   //             setCompanyLogo(logoUrl);
//   //           }
//   //         }
//   //       }
//   //     } catch (error) {
//   //       console.error("Error fetching data:", error);
//   //     }
//   //   };

//   //   fetchData();
//   // }, []);
//   useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const user = sessionStorage.getItem("user");
//       const databaseName = sessionStorage.getItem("databaseName"); // ✅ e.g. HRMS_Misoftware Solution

//       if (!user || !databaseName) {
//         console.warn("Missing user or databaseName");
//         return;
//       }

//       console.log("Using DB:", databaseName);

//       // ✅ Build dynamic query using DB name
//       const query = `
//         SELECT 
//           [pn_CompanyID], 
//           [CompanyName], 
//           [CompanyLogo] 
//         FROM 
//           [${databaseName}].[dbo].[paym_Company]
//         WHERE 
//           company_user_id = '${user}';
//       `;

//       const response = await postRequest(ServerConfig.url, REPORTS, {
//         query,
//       });

//       if (response.data?.length > 0) {
//         const company = response.data[0];
//         console.log("Company:", company);
//         // setCompanyName(company.CompanyName);
//       }
//     } catch (err) {
//       console.error("Error fetching company:", err);
//     }
//   };

//   fetchData();
// }, []);


//   useEffect(() => {
//     const fetchBranchData = async () => {
//       try {
//         const user = sessionStorage.getItem("user");
//         if (!user) return;

//         // Fetch branch data for the logged-in user
//         const response = await postRequest(ServerConfig.url, REPORTS, {
//           query: `SELECT * FROM paym_Branch WHERE Branch_User_Id = '${user}'`
//         });

//         if (response.data && response.data.length > 0) {
//           setBranchData(response.data[0]);
//           setBranchName(response.data[0].BranchName);

//           // You can also store additional branch info if needed
//           sessionStorage.setItem("branchInfo", JSON.stringify(response.data[0]));
//         }
//       } catch (error) {
//         console.error("Error fetching branch data:", error);
//       }
//     };

//     fetchBranchData();
//   }, []);



//   const [elapsedTime, setElapsedTime] = useState(0);
//   const [startTime, setStartTime] = useState(null);

//   useEffect(() => {
//     let storedStart = sessionStorage.getItem('startTime');

//     if (!storedStart) {
//       const now = Date.now();
//       sessionStorage.setItem('startTime', now.toString());
//       storedStart = now;
//     }

//     const start = Number(storedStart);
//     setStartTime(start);
//     setElapsedTime(Date.now() - start);

//     const interval = setInterval(() => {
//       setElapsedTime(Date.now() - start);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   const formatTime = (milliseconds) => {
//     const totalSeconds = Math.floor(milliseconds / 1000);
//     const hours = Math.floor(totalSeconds / 3600);
//     const minutes = Math.floor((totalSeconds % 3600) / 60);
//     const seconds = totalSeconds % 60;
//     return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
//   };

//   const handleLogout = () => {
//     // Clear sessionStorage
//     sessionStorage.clear();
//     // Navigate to login page or any other page you desire
//     window.location.href = "http://localhost:3000/";
//   };



//   const handleProfileMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMobileMenuClose = () => {
//     setMobileMoreAnchorEl(null);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     handleMobileMenuClose();
//   };

//   const handleMobileMenuOpen = (event) => {
//     setMobileMoreAnchorEl(event.currentTarget);
//   };

//   if (!isLoggedIn) {
//     // If not logged in, redirect to login page
//     return <navigate to="/" />;
//   }

//   const menuId = 'primary-search-account-menu';
//   const renderMenu = (
//     <Menu
//       anchorEl={anchorEl}
//       anchorOrigin={{
//         vertical: 'top',
//         horizontal: 'right',
//       }}
//       id={menuId}
//       keepMounted
//       transformOrigin={{
//         vertical: 'top',
//         horizontal: 'right',
//       }}
//       open={isMenuOpen}
//       onClose={handleMenuClose}
//     >
//       <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
//       <MenuItem onClick={handleMenuClose}>My account</MenuItem>
//     </Menu>
//   );

//   const mobileMenuId = 'primary-search-account-menu-mobile';
//   const renderMobileMenu = (
//     <Menu
//       anchorEl={mobileMoreAnchorEl}
//       anchorOrigin={{
//         vertical: 'top',
//         horizontal: 'right',
//       }}
//       id={mobileMenuId}
//       keepMounted
//       transformOrigin={{
//         vertical: 'top',
//         horizontal: 'right',
//       }}
//       open={isMobileMenuOpen}
//       onClose={handleMobileMenuClose}
//     >

//       <MenuItem>
//         <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}> </Box>

//         <IconButton size="large" aria-label="show 4 new mails" color="inherit">

//           <Badge badgeContent={4} color="error">
//             <MailIcon />
//           </Badge>
//         </IconButton>
//         <p>Messages</p>
//       </MenuItem>
//       <MenuItem>
//         <IconButton
//           size="large"
//           aria-label="show 17 new notifications"
//           color="inherit"
//         >
//           <Badge badgeContent={17} color="error">
//             <NotificationsIcon />
//           </Badge>
//         </IconButton>
//         <p>Notifications</p>
//       </MenuItem>
//       <MenuItem onClick={handleProfileMenuOpen}>
//         <IconButton
//           size="large"
//           aria-label="account of current user"
//           aria-controls="primary-search-account-menu"
//           aria-haspopup="true"
//           color="inherit"
//         >
//           <AccountCircle />
//         </IconButton>
//         <p>Profile</p>

//       </MenuItem>
//     </Menu>

//   );

//   return (
//     <Box sx={{ flexGrow: 1 }}>
//       <AppBar position="fixed" sx={{ height: '70px', }}>
//         <Toolbar >
//           <IconButton
//             size="large"
//             edge="start"
//             //  color="inherit"
//             color='black'
//             aria-label="open drawer"
//             sx={{ mr: 2 }}
//             onClick={() => updateOpen(!dopen)}
//           >
//             <MenuIcon />
//           </IconButton>
//           {/* <Tab 
                          
//             icon={<img src={hr} alt="info" style={{ width: 50, height: 30 }} />} 
            
//             sx={{ color: 'black',mr: 4  }} 
//           /> */}


//           <Stack direction="column" spacing={1} sx={{ marginLeft: "60px", padding: "16px" }}>
//             <Typography
//               variant="h5"
//               sx={{
//                 display: { xs: 'none', sm: 'block' },
//                 color: 'black',
//                 textAlign: 'left'
//               }}
//             >
//               HR MANAGEMENT SYSTEM
//             </Typography>
//             <Typography sx={{ fontWeight: "normal", color: "black", textAlign: 'center' }}>
//               {formatTime(elapsedTime)}
//             </Typography>
//           </Stack>

//           <Box sx={{ flexGrow: 1 }} />
//           <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
//             {/* <Search>
//               <SearchIconWrapper>
//                 <SearchIcon />
//               </SearchIconWrapper>
//               <StyledInputBase
//                 placeholder="Search…"
//                 inputProps={{ 'aria-label': 'search' }}
//               />
//             </Search> */}
//           </Box>
//           <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', ml: 8 }}>
//             <IconButton
//               size="large"
//               aria-label="show calendar"
//               color='black'
//               onClick={handleCalendarToggle}
//             >
//               <CalendarTodayIcon />

//             </IconButton>
//             {showCalendar && (
//               <Box sx={{ position: 'absolute', zIndex: 1000, backgroundColor: '#f2eded', alignitems: "center", marginTop: 40, }}>
//                 <Calendar />
//               </Box>
//             )}
//             <IconButton
//               size="large"
//               aria-label="show 17 new notifications"
//               // color="inherit"
//               color='black'
//               sx={{ mr: 1 }}
//             >
//               <Badge badgeContent={17} color="error"  >
//                 <NotificationsIcon />
//               </Badge>
//             </IconButton>

//             <IconButton
//               size="large"
//               edge="end"

//               aria-label="account of current user"
//               aria-controls={menuId}
//               aria-haspopup="true"
//               onClick={handleProfileMenuOpen}
//               // color="inherit"
//               color='black'
//               sx={{ mr: 1 }}

//             >
//               <img src={settingss} width={25} height={25} color='black' sizes='' />
//             </IconButton>

//             <Avatar
//               alt={companyName || "Company Logo"}
//               src={logoError ? undefined : companyLogo}
//               onError={() => setLogoError(true)}
//               sx={{
//                 width: 40,
//                 height: 40,
//                 bgcolor: (logoError || !companyLogo) ?
//                   (theme) => theme.palette.primary.main : undefined,
//               }}
//             >
//               {(logoError || !companyLogo) && companyName?.charAt(0)}
//             </Avatar>
//             <Typography variant="h6" sx={{ marginLeft: 1 }}>
//               {userEmail}
//             </Typography>
//             <Box sx={{ marginLeft: "10px", display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
//               <Typography sx={{ color: "black", }}>
//                 Welcome
//               </Typography>
//               {branchName && (
//                 <Typography sx={{ color: "black", fontWeight: "normal", fontSize: "16px" }}>
//                   {branchName}

//                 </Typography>
//               )}

//               <IconButton
//                 aria-controls="company-menu"
//                 aria-haspopup="true"
//                 onClick={handleDropdownOpen}
//                 sx={{ padding: 0, justifyContent: 'left' }}
//               >

//                 <ArrowDropDownIcon sx={{ color: "black" }} />
//               </IconButton>
//               <Menu
//                 id="company-menu"
//                 anchorEl={dropdownAnchorEl}
//                 open={isDropdownOpen}
//                 onClose={handleDropdownClose}
//                 MenuListProps={{
//                   'aria-labelledby': 'basic-button',
//                 }}
//               >
//                 <MenuItem sx={{ display: 'flex', justifyContent: 'center' }} onClick={() => {
//                   handleLogout();
//                   handleDropdownClose();
//                 }}>
//                   <LogoutIcon />
//                 </MenuItem>
//               </Menu>
//             </Box>


//           </Box>
//           <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
//             <IconButton
//               size="large"
//               aria-label="show more"
//               aria-controls={mobileMenuId}
//               aria-haspopup="true"
//               onClick={handleMobileMenuOpen}
//               // color="inherit"
//               color='black'

//             >
//               <MoreIcon />
//             </IconButton>

//           </Box>
//         </Toolbar>
//       </AppBar>
//       {renderMobileMenu}
//       {renderMenu}
//     </Box>
//   );
// };


















import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import { useAppStore } from './appStore';
import Avatar from "@mui/material/Avatar";
import { useState, useEffect } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from 'react-router-dom';
import settingss from "../../images/Settingss-icon.png";
import { postRequest } from "../../serverconfiguration/requestcomp";
import { ServerConfig } from "../../serverconfiguration/serverconfig";
import { REPORTS } from "../../serverconfiguration/controllers";
import { Stack } from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  background: '#FFFFFF',
  boxShadow: 'none',
  borderRadius: "10px"
}));

export default function Navbar() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const updateOpen = useAppStore((state) => state.updateOpen);
  const dopen = useAppStore((state) => state.dopen);
  const isLoggedIn = sessionStorage.getItem("user") !== null;

  const [branchName, setBranchName] = useState('');
  const [branchData, setBranchData] = useState(null);
  const [dropdownAnchorEl, setDropdownAnchorEl] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [companyLogo, setCompanyLogo] = useState(null);
  const [logoError, setLogoError] = useState(false);

  const handleDropdownOpen = (event) => setDropdownAnchorEl(event.currentTarget);
  const handleDropdownClose = () => setDropdownAnchorEl(null);
  const isDropdownOpen = Boolean(dropdownAnchorEl);

  const handleCalendarToggle = () => setShowCalendar(!showCalendar);

  // ✅ Fetch Company and Branch data dynamically using DB name
  useEffect(() => {
    const fetchCompanyAndBranch = async () => {
      try {
        const user = sessionStorage.getItem("user");
        const databaseName = sessionStorage.getItem("databaseName"); // ✅ HRMS_Misoftware Solution

        if (!user || !databaseName) {
          console.warn("Missing user or database name in sessionStorage");
          return;
        }

        console.log("Using DB:", databaseName);

        // 1️⃣ Fetch Branch Data from logged-in DB
        const branchQuery = `
          SELECT * 
          FROM [${databaseName}].[dbo].[paym_Branch]
          WHERE Branch_User_Id = '${user}';
        `;

        const branchResponse = await postRequest(ServerConfig.url, REPORTS, { query: branchQuery });
        if (branchResponse.data?.length > 0) {
          const branch = branchResponse.data[0];
          setBranchData(branch);
          setBranchName(branch.BranchName);
          sessionStorage.setItem("branchInfo", JSON.stringify(branch));
          console.log("Branch Loaded:", branch.BranchName);

          // 2️⃣ Fetch Company Data using the branch’s company ID
          const companyQuery = `
            SELECT [pn_CompanyID], [CompanyName], [CompanyLogo]
            FROM [${databaseName}].[dbo].[paym_Company]
            WHERE pn_CompanyID = '${branch.pn_CompanyID}';
          `;

          const companyResponse = await postRequest(ServerConfig.url, REPORTS, { query: companyQuery });
          if (companyResponse.data?.length > 0) {
            const company = companyResponse.data[0];
            setCompanyName(company.CompanyName);

            // ✅ Handle Logo
            if (company.CompanyLogo) {
              let logoUrl;
              if (company.CompanyLogo.startsWith("http")) {
                logoUrl = company.CompanyLogo;
              } else if (company.CompanyLogo.length > 100) {
                logoUrl = `data:image/png;base64,${company.CompanyLogo}`;
              } else {
                logoUrl = `${ServerConfig.baseUrl}/${company.CompanyLogo}`;
              }
              setCompanyLogo(logoUrl);
            }

            console.log("Company Loaded:", company.CompanyName);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchCompanyAndBranch();
  }, []);

  // 🕒 Timer Section
  const [elapsedTime, setElapsedTime] = useState(0);
  useEffect(() => {
    let storedStart = sessionStorage.getItem('startTime');
    if (!storedStart) {
      const now = Date.now();
      sessionStorage.setItem('startTime', now.toString());
      storedStart = now;
    }

    const start = Number(storedStart);
    setElapsedTime(Date.now() - start);

    const interval = setInterval(() => {
      setElapsedTime(Date.now() - start);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "http://localhost:3000/";
  };

  if (!isLoggedIn) return <navigate to="/" />;

  const menuId = 'primary-search-account-menu';

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ height: '70px' }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color='black'
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={() => updateOpen(!dopen)}
          >
            <MenuIcon />
          </IconButton>

          <Stack direction="column" spacing={1} sx={{ marginLeft: "60px", padding: "16px" }}>
            <Typography variant="h5" sx={{ color: 'black' }}>
              HR MANAGEMENT SYSTEM
            </Typography>
            <Typography sx={{ color: "black" }}>{formatTime(elapsedTime)}</Typography>
          </Stack>

          <Box sx={{ flexGrow: 1 }} />

          {/* Calendar & Notifications */}
          <IconButton color='black' onClick={handleCalendarToggle}><CalendarTodayIcon /></IconButton>
          {showCalendar && (
            <Box sx={{ position: 'absolute', zIndex: 1000, backgroundColor: '#f2eded', marginTop: 40 }}>
              <Calendar />
            </Box>
          )}
          <IconButton color='black'><Badge badgeContent={17} color="error"><NotificationsIcon /></Badge></IconButton>

          {/* Settings & Profile */}
          <IconButton color='black' sx={{ mr: 1 }}>
            <img src={settingss} width={25} height={25} alt="settings" />
          </IconButton>

          <Avatar
            alt={companyName || "Company"}
            src={logoError ? undefined : companyLogo}
            onError={() => setLogoError(true)}
            sx={{
              width: 40,
              height: 40,
              bgcolor: (logoError || !companyLogo)
                ? (theme) => theme.palette.primary.main
                : undefined,
            }}
          >
            {(logoError || !companyLogo) && companyName?.charAt(0)}
          </Avatar>

          <Box sx={{ ml: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Typography sx={{ color: "black" }}>Welcome</Typography>
            <Typography sx={{ color: "black", fontSize: "16px" }}>{branchName}</Typography>

            <IconButton onClick={handleDropdownOpen} sx={{ p: 0 }}>
              <ArrowDropDownIcon sx={{ color: "black" }} />
            </IconButton>

            <Menu
              anchorEl={dropdownAnchorEl}
              open={isDropdownOpen}
              onClose={handleDropdownClose}
            >
              <MenuItem onClick={() => { handleLogout(); handleDropdownClose(); }}>
                <LogoutIcon /> Logouts
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
