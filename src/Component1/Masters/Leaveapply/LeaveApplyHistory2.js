// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Grid,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   AppBar,
//   Toolbar,
//   Button,
//   Modal,
//   TextField,
//   Chip,
// } from "@mui/material";
// import { postRequest } from "../../../serverconfiguration/requestcomp";
// import { REPORTS } from "../../../serverconfiguration/controllers";
// import { ServerConfig } from "../../../serverconfiguration/serverconfig";
// import Sidenav from "../../Home Page3/Sidenav2";
// import Navbar from "../../Home Page3/Navbar2";

// // Status Chip component
// const statusChip = (status) => {
//   if (status === "A") {
//     return (
//       <Chip
//         label="Approved"
//         style={{
//           backgroundColor: "green",
//           color: "white",
//           fontSize: "12px",
//           height: "20px",
//         }}
//       />
//     );
//   } else if (status === "R") {
//     return (
//       <Chip
//         label="Rejected"
//         style={{
//           backgroundColor: "red",
//           color: "white",
//           fontSize: "12px",
//           height: "20px",
//         }}
//       />
//     );
//   } else {
//     return (
//       <Chip
//         label="Pending"
//         style={{
//           backgroundColor: "orange",
//           color: "white",
//           fontSize: "12px",
//           height: "20px",
//         }}
//       />
//     );
//   }
// };

// const LeaveRequestTable2 = () => {
//   const [leaveRequests, setLeaveRequests] = useState([]);
//   const [employeeName, setEmployeeName] = useState("");
//   const [isloggedin, setIsLoggedin] = useState(sessionStorage.getItem("user"));
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [formData, setFormData] = useState({
//     from_date: "",
//     to_date: "",
//     reason: "",
//   });
//   const dbname = sessionStorage.getItem("databaseName");

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         // Fetch all leave requests
//         const allData = await postRequest(ServerConfig.url, REPORTS, {
//           query: `SELECT pn_Leavename, status, from_date, to_date, reason, approve, pn_CompanyID, pn_BranchID, pn_EmployeeID, Emp_code, Emp_name, pn_LeaveID, pn_leavecode, attachfile FROM [${dbname}].[dbo].[leave_apply] WHERE pn_EmployeeID = (SELECT pn_EmployeeID FROM [${dbname}].[dbo].[paym_Employee] WHERE EmployeeCode = '${isloggedin}')`,
//         });
//         setLeaveRequests(allData.data);
//         console.log(allData.data); // Log the fetched leave requests
//         // Fetch employee name
//         const employeeData = await postRequest(ServerConfig.url, REPORTS, {
//           query: `SELECT Employee_Full_Name FROM [${dbname}].[dbo].[paym_Employee] WHERE EmployeeCode = '${isloggedin}'`,
//         });
//         setEmployeeName(employeeData.data[0]?.Employee_Full_Name || "Employee");
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     }
//     fetchData();
//   }, [isloggedin]);

//   const handleReapplyClick = (request) => {
//     setSelectedRequest(request);
//     setFormData({
//       from_date: request.from_date,
//       to_date: request.to_date,
//       reason: request.reason,
//     });
//     setModalOpen(true);
//   };

//   const handleModalClose = () => {
//     setModalOpen(false);
//     setSelectedRequest(null);
//     setFormData({
//       from_date: "",
//       to_date: "",
//       reason: "",
//     });
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const { from_date, to_date, reason } = formData;

//     // Calculate days
//     const days =
//       (new Date(to_date) - new Date(from_date)) / (1000 * 60 * 60 * 24) + 1;

//     // Insert query
//     const insertQuery = {
//       query: `INSERT INTO [${dbname}].[dbo].[leave_apply]

//                 ([pn_CompanyID], [pn_BranchID], [pn_EmployeeID], [Emp_code], [Emp_name], [pn_LeaveID], [pn_Leavename], [pn_leavecode], [from_date], [from_status], [to_date], [status], [days], [reason], [submitted_date], [approve], [reminder], [priority], [comments], [record], [flag], [yearend], [attachfile])
//                 VALUES
//                 (${selectedRequest.pn_CompanyID}, ${selectedRequest.pn_BranchID}, ${selectedRequest.pn_EmployeeID}, '${selectedRequest.Emp_code}', '${selectedRequest.Emp_name}', ${selectedRequest.pn_LeaveID}, '${selectedRequest.pn_Leavename}', '${selectedRequest.pn_leavecode}', '${from_date}', 'P', '${to_date}', 'P', ${days}, '${reason}', GETDATE(), NULL, NULL, NULL, NULL,NULL, 'R', NULL, CAST('0x${selectedRequest.attachfile}' AS VARBINARY(MAX)))`,
//     };

//     try {
//       await postRequest(ServerConfig.url, REPORTS, insertQuery);
//       // Optionally, refresh the leave requests
//       handleModalClose();
//     } catch (error) {
//       console.error("Error submitting reapply:", error);
//     }
//   };

//   return (
//     <Grid container>
//       {/* Navbar and Sidebar */}
//       <Grid item xs={12}>
//         <div style={{ backgroundColor: "#f5f5f5" }}>
//           <Navbar />
//           <Box height={30} />
//           <Box sx={{ display: "flex" }}>
//             <Sidenav />
//             {/* Main Content */}
//             <Grid
//               item
//               xs={12}
//               sm={10}
//               md={9}
//               lg={8}
//               xl={7}
//               style={{ margin: "0 auto", padding: "20px" }}
//             >
//               <AppBar
//                 position="sticky"
//                 color="default"
//                 elevation={2}
//                 sx={{
//                   backgroundColor: "#0077d4",
//                   color: "white",
//                   marginTop: "45px",
//                 }}
//               >
//                 <Toolbar sx={{ justifyContent: "center" }}>
//                   <Typography
//                     variant="h5"
//                     component="div"
//                     sx={{ fontWeight: "bold", textAlign: "left", flexGrow: 1 }}
//                   >
//                     LEAVE STATUS
//                   </Typography>
//                 </Toolbar>
//               </AppBar>
//               <Box
//                 sx={{
//                   backgroundColor: "#ffffff",
//                   padding: "12px",
//                   textAlign: "center",
//                 }}
//               >
//                 <Typography variant="subtitle1" sx={{ fontSize: "14px" }}>
//                   EMPLOYEE NAME: {employeeName}
//                 </Typography>
//               </Box>
//               <TableContainer component={Paper}>
//                 <Table size="small">
//                   <TableHead
//                     sx={{
//                       backgroundColor: "#f5f5f5", // Indigo-600 for example
//                       minHeight: 56, // increased height in pixels
//                     }}
//                   >
//                     <TableRow>
//                       <TableCell sx={{ padding: "16px 8px", fontSize: "17px" }}>
//                         LEAVE NAME
//                       </TableCell>
//                       <TableCell sx={{ padding: "16px 8px", fontSize: "17px" }}>
//                         STATUS
//                       </TableCell>
//                       <TableCell sx={{ padding: "16px 8px", fontSize: "17px" }}>
//                         REQUEST DATES
//                       </TableCell>
//                       <TableCell sx={{ padding: "16px 8px", fontSize: "17px" }}>
//                         REASON
//                       </TableCell>
//                       <TableCell sx={{ padding: "16px 8px", fontSize: "17px" }}>
//                         APPROVED BY
//                       </TableCell>
//                       <TableCell sx={{ padding: "16px 8px", fontSize: "17px" }}>
//                         ACTIONS
//                       </TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {leaveRequests.map((request, index) => {
//                       console.log("Rendering request:", request); // Log the entire request object
//                       return (
//                         <TableRow key={index}>
//                           <TableCell>{request.pn_Leavename || "N/A"}</TableCell>
//                           <TableCell>
//                             {statusChip(request.status) || "N/A"}
//                           </TableCell>
//                           <TableCell>
//                             {new Date(request.from_date).toString() !==
//                               "Invalid Date" &&
//                             new Date(request.to_date).toString() !==
//                               "Invalid Date"
//                               ? `${new Date(
//                                   request.from_date
//                                 ).toLocaleDateString()} - ${new Date(
//                                   request.to_date
//                                 ).toLocaleDateString()}`
//                               : "Invalid Dates"}
//                           </TableCell>
//                           <TableCell>{request.reason || "N/A"}</TableCell>
//                           <TableCell>
//                             {/* {Object.keys(request.approve).length > 0
//                               ? request.approve.someProperty
//                               : "N/A"} */}{request.approve || "N/A"}
//                           </TableCell>
//                           <TableCell>
//                             {request.status === "R" && (
//                               <Button
//                                 variant="contained"
//                                 color="primary"
//                                 size="small"
//                                 onClick={() => handleReapplyClick(request)}
//                               >
//                                 Reapply
//                               </Button>
//                             )}
//                           </TableCell>
//                         </TableRow>
//                       );
//                     })}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </Grid>
//           </Box>
//         </div>
//       </Grid>

//       {/* Reapply Modal */}
//       <Modal open={modalOpen} onClose={handleModalClose}>
//         <Box
//           sx={{
//             padding: 4,
//             backgroundColor: "white",
//             borderRadius: 2,
//             maxWidth: 400,
//             margin: "auto",
//             marginTop: "100px",
//           }}
//         >
//           <Typography variant="h6" component="h2" sx={{ marginBottom: 2 }}>
//             Reapply Leave
//           </Typography>
//           <form onSubmit={handleSubmit}>
//             <TextField
//               label="From Date"
//               type="date"
//               name="from_date"
//               value={formData.from_date}
//               onChange={handleInputChange}
//               fullWidth
//               sx={{ marginBottom: 2 }}
//               InputLabelProps={{
//                 shrink: true,
//               }}
//             />
//             <TextField
//               label="To Date"
//               type="date"
//               name="to_date"
//               value={formData.to_date}
//               onChange={handleInputChange}
//               fullWidth
//               sx={{ marginBottom: 2 }}
//               InputLabelProps={{
//                 shrink: true,
//               }}
//             />
//             <TextField
//               label="Reason"
//               name="reason"
//               value={formData.reason}
//               onChange={handleInputChange}
//               fullWidth
//               sx={{ marginBottom: 2 }}
//             />
//             <Button type="submit" variant="contained" color="primary" fullWidth>
//               Submit
//             </Button>
//           </form>
//         </Box>
//       </Modal>
//     </Grid>
//   );
// };

// export default LeaveRequestTable2;







import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  AppBar,
  Toolbar,
  Button,
  Modal,
  TextField,
  Chip,
} from "@mui/material";
import { postRequest } from "../../../serverconfiguration/requestcomp";
import { REPORTS } from "../../../serverconfiguration/controllers";
import { ServerConfig } from "../../../serverconfiguration/serverconfig";
import Sidenav from "../../Home Page3/Sidenav2";
import Navbar from "../../Home Page3/Navbar2";

// Status chip UI
const statusChip = (status) => {
  const styles = {
    fontSize: "12px",
    height: "20px",
    color: "white",
  };

  switch (status) {
    case "A":
      return <Chip label="Approved" style={{ ...styles, background: "green" }} />;
    case "R":
      return <Chip label="Rejected" style={{ ...styles, background: "red" }} />;
    default:
      return <Chip label="Pending" style={{ ...styles, background: "orange" }} />;
  }
};

const LeaveRequestTable2 = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [formData, setFormData] = useState({
    from_date: "",
    to_date: "",
    reason: "",
  });

  const isloggedin = sessionStorage.getItem("user");
  const dbname = sessionStorage.getItem("databaseName");

  // Fetch Requests & Employee Name
  useEffect(() => {
    async function loadData() {
      try {
        const leaveResponse = await postRequest(ServerConfig.url, REPORTS, {
          query: `
            SELECT pn_Leavename, status, from_date, to_date, reason, approve,
                   pn_CompanyID, pn_BranchID, pn_EmployeeID, Emp_code, Emp_name,
                   pn_LeaveID, pn_leavecode, attachfile
            FROM [${dbname}].[dbo].[leave_apply]
            WHERE pn_EmployeeID = (
              SELECT pn_EmployeeID FROM [${dbname}].[dbo].[paym_Employee]
              WHERE EmployeeCode = '${isloggedin}'
            )
          `,
        });

        setLeaveRequests(leaveResponse.data);

        const empData = await postRequest(ServerConfig.url, REPORTS, {
          query: `
            SELECT Employee_Full_Name
            FROM [${dbname}].[dbo].[paym_Employee]
            WHERE EmployeeCode = '${isloggedin}'
          `,
        });

        setEmployeeName(empData.data[0]?.Employee_Full_Name || "Employee");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    loadData();
  }, [isloggedin]);

  // On Reapply Click
  const handleReapplyClick = (request) => {
    setSelectedRequest(request);
    setFormData({
      from_date: request.from_date,
      to_date: request.to_date,
      reason: request.reason,
    });
    setModalOpen(true);
  };

  // Submit Reapply
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { from_date, to_date, reason } = formData;

    const days =
      (new Date(to_date) - new Date(from_date)) / (1000 * 60 * 60 * 24) + 1;

    const insertQuery = {
      query: `
        INSERT INTO [${dbname}].[dbo].[leave_apply]
        ([pn_CompanyID], [pn_BranchID], [pn_EmployeeID], [Emp_code], [Emp_name],
         [pn_LeaveID], [pn_Leavename], [pn_leavecode], [from_date], [from_status],
         [to_date], [status], [days], [reason], [submitted_date], [approve],
         [reminder], [priority], [comments], [record], [flag], [yearend], [attachfile])
        VALUES
        (${selectedRequest.pn_CompanyID}, ${selectedRequest.pn_BranchID},
         ${selectedRequest.pn_EmployeeID}, '${selectedRequest.Emp_code}',
         '${selectedRequest.Emp_name}', ${selectedRequest.pn_LeaveID},
         '${selectedRequest.pn_Leavename}', '${selectedRequest.pn_leavecode}',
         '${from_date}', 'P', '${to_date}', 'P', ${days}, '${reason}',
         GETDATE(), NULL, NULL, NULL, NULL, NULL, 'R',
         NULL, CAST('0x${selectedRequest.attachfile}' AS VARBINARY(MAX))
        )
      `,
    };

    try {
      await postRequest(ServerConfig.url, REPORTS, insertQuery);
      setModalOpen(false);
      setSelectedRequest(null);
    } catch (error) {
      console.error("Submit Error:", error);
    }
  };

  return (
    <Grid container>
      {/* Navbar */}
      <Grid item xs={12}>
        <Navbar />
        <Box height={30} />

        <Box sx={{ display: "flex" }}>
          <Sidenav />

          <Grid item xs={12} sm={10} md={9} style={{ margin: "0 auto", padding: "20px" }}>
            <AppBar position="sticky" elevation={2} sx={{ backgroundColor: "#0077d4" }}>
              <Toolbar>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  LEAVE STATUS
                </Typography>
              </Toolbar>
            </AppBar>

            <Box sx={{ background: "#fff", p: 2, textAlign: "center" }}>
              <Typography variant="subtitle1">
                EMPLOYEE NAME: {employeeName}
              </Typography>
            </Box>

            {/* Table */}
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableRow>
                    <TableCell>LEAVE NAME</TableCell>
                    <TableCell>STATUS</TableCell>
                    <TableCell>REQUEST DATES</TableCell>
                    <TableCell>REASON</TableCell>
                    <TableCell>APPROVED BY</TableCell>
                    <TableCell>ACTIONS</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {leaveRequests.map((req, index) => (
                    <TableRow key={index}>
                      <TableCell>{req.pn_Leavename || "N/A"}</TableCell>
                      <TableCell>{statusChip(req.status)}</TableCell>

                      <TableCell>
                        {new Date(req.from_date).toLocaleDateString()} -{" "}
                        {new Date(req.to_date).toLocaleDateString()}
                      </TableCell>

                      <TableCell>{req.reason || "N/A"}</TableCell>
                      <TableCell>{req.approve || "N/A"}</TableCell>

                      {/* ACTIONS CELL */}
                      <TableCell>
                        {req.status === "R" ? (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleReapplyClick(req)}
                          >
                            Reapply
                          </Button>
                        ) : (
                          <Button variant="contained" size="small" disabled>
                            Reapply
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Box>
      </Grid>

      {/* Reapply Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            padding: 4,
            backgroundColor: "white",
            borderRadius: 2,
            maxWidth: 400,
            margin: "auto",
            marginTop: "100px",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Reapply Leave
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="From Date"
              type="date"
              fullWidth
              sx={{ mb: 2 }}
              name="from_date"
              value={formData.from_date}
              onChange={(e) => setFormData({ ...formData, from_date: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="To Date"
              type="date"
              fullWidth
              sx={{ mb: 2 }}
              name="to_date"
              value={formData.to_date}
              onChange={(e) => setFormData({ ...formData, to_date: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Reason"
              fullWidth
              sx={{ mb: 2 }}
              name="reason"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            />

            <Button type="submit" variant="contained" fullWidth>
              Submit
            </Button>
          </form>
        </Box>
      </Modal>
    </Grid>
  );
};

export default LeaveRequestTable2;
