// import React, { useState, useEffect } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
//   Checkbox,
//   Box,
//   IconButton,
//   Grid,
//   Typography,
//   Modal,
//   Backdrop,
//   Fade,
// } from "@mui/material";

// import { FilterList } from "@mui/icons-material";
// import Navbar from "../../Home Page/Navbar";
// import Sidenav from "../../Home Page/Sidenav";
// import { REPORTS } from "../../../serverconfiguration/controllers";
// import { postRequest } from "../../../serverconfiguration/requestcomp";
// import { ServerConfig } from "../../../serverconfiguration/serverconfig";
// import DoneIcon from "@mui/icons-material/Done";
// import CloseIcon from "@mui/icons-material/Close";
// import AppBar from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";
// const statusColors = {
//   A: "green",
//   P: "orange",
//   R: "red",
// };

// function LeaveRequestHr() {
//   const [checkedRows, setCheckedRows] = useState({});
//   const [leaveApply, setLeaveApply] = useState([]);
//   const [open, setOpen] = useState(false); // State for modal
//   const [imageSrc, setImageSrc] = useState(""); // State for image source
//   const databaseName = sessionStorage.getItem("databaseName");

//   const getData = async () => {
//     try {
//       const response = await postRequest(ServerConfig.url, REPORTS, {
//         query: `SELECT * FROM [${databaseName}].[dbo].[Leave_Apply]`,

//       });

//       console.log(response);

//       const filteredData = response.data.filter((row) => row.status === "P");

//       // Convert `varbinary` data to a viewable format (e.g., base64)
//       const processedData = filteredData.map((row) => ({
//         ...row,
//         attachfile: row.attachfile
//           ? `data:${row.file_type};base64,${row.attachfile}`
//           : null, // Use correct MIME type
//       }));

//       setLeaveApply(processedData);
//     } catch (error) {
//       console.error("Failed to fetch data:", error);
//     }
//   };

//   useEffect(() => {
//     getData();
//   }, []);

//   const handleCheckboxChange = (event, index) => {
//     setCheckedRows((prev) => ({
//       ...prev,
//       [index]: event.target.checked,
//     }));
//   };

//   const anyCheckboxChecked =
//     Object.values(checkedRows).filter(Boolean).length > 1;
//   const checkedRowsData = leaveApply.filter((_, index) => checkedRows[index]);

//   // const updateLeaveRequestStatus = async (employeeID, status) => {
//   //   try {
//   //     const response = await postRequest(ServerConfig.url, REPORTS, {
//   //       query: `UPDATE leave_apply SET status = '${status}', approve = 'Hr' WHERE pn_EmployeeID = ${employeeID}`,
//   //     });
//   //     console.log("Update Response:", response);
//   //     await getData();
//   //   } catch (error) {
//   //     console.error("Failed to update status:", error);
//   //   }
//   // };

//   const updateLeaveRequestStatus = async (sno, status) => {
//     try {
//       const response = await postRequest(ServerConfig.url, REPORTS, {
//         query: `
//   UPDATE [${databaseName}].[dbo].[Leave_Apply]
//   SET status = '${status}', approve = 'Hr'
//   WHERE sno = ${sno};
// `,

//       });
//       console.log("Update Response:", response);
//       await getData();
//     } catch (error) {
//       console.error("Failed to update status:", error);
//     }
//   };

//   // const handleApproveClick = (row) => {
//   //   updateLeaveRequestStatus(row.pn_EmployeeID, "A");
//   // };

//   // const handleRejectClick = (row) => {
//   //   updateLeaveRequestStatus(row.pn_EmployeeID, "R");
//   // };

//   // const handleApproveSelected = () => {
//   //   checkedRowsData.forEach((row) => {
//   //     updateLeaveRequestStatus(row.pn_EmployeeID, "A");
//   //   });
//   // };

//   // const handleRejectSelected = () => {
//   //   checkedRowsData.forEach((row) => {
//   //     updateLeaveRequestStatus(row.pn_EmployeeID, "R");
//   //   });
//   // };

//   const handleApproveClick = (row) => {
//     updateLeaveRequestStatus(row.sno, "A");
//   };

//   const handleRejectClick = (row) => {
//     updateLeaveRequestStatus(row.sno, "R");
//   };

//   const handleApproveSelected = () => {
//     checkedRowsData.forEach((row) => {
//       updateLeaveRequestStatus(row.sno, "A");
//     });
//   };

//   const handleRejectSelected = () => {
//     checkedRowsData.forEach((row) => {
//       updateLeaveRequestStatus(row.sno, "R");
//     });
//   };

//   const handleImageClick = (src) => {
//     setImageSrc(src);
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setImageSrc("");
//   };

//   return (
//     <Grid
//       container
//       justifyContent="center"
//       alignItems="center"
//       style={{ minHeight: "100vh", margin: 0 }}
//     >
//       <div style={{ backgroundColor: "#f5f5f5", width: "100%" }}>
//         <Navbar />
//         <Box height={30} />
//         <Box sx={{ display: "flex" }}>
//           <Sidenav />
//           <Grid
//             item
//             xs={12}
//             sm={10}
//             md={9}
//             lg={8}
//             xl={7}
//             style={{ margin: "0 auto", padding: "20px" }} // Centering the Grid
//           >
//             <AppBar
//               position="static"
//               sx={{ width: "100%", marginTop: "50px", minHeight: "60px" }}
//             >
//               <Toolbar sx={{ justifyContent: "left", height: "100%" }}>
//                 <Typography
//                   variant="h5"
//                   gutterBottom
//                   sx={{
//                     textAlign: "left",
//                     fontWeight: "bold",
//                     color: "white",
//                     lineHeight: "60px",
//                   }}
//                 >
//                   LEAVE
//                 </Typography>
//               </Toolbar>
//             </AppBar>
//             <Box display="flex" flexDirection="column" alignItems="center">
//               <TableContainer component={Paper} sx={{ width: "100%" }}>
//                 <Table>
//                   <TableHead style={{ backgroundColor: "#f9f9f9" }}>
//                     <TableRow>
//                       <TableCell></TableCell>
//                       <TableCell style={{ textAlign: "left" }}>
//                         EMPLOYEE NAME
//                       </TableCell>
//                       <TableCell>LEAVE NAME</TableCell>
//                       <TableCell>STATUS</TableCell>
//                       <TableCell>REQUEST</TableCell>
//                       <TableCell>REASON</TableCell>
//                       <TableCell>APPLY DATE</TableCell>
//                       <TableCell>ATTACHMENT</TableCell> {/* New Column */}
//                       <TableCell>ACTIONS</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {leaveApply.map((row, index) => (
//                       <TableRow
//                         key={index}
//                         style={{
//                           backgroundColor:
//                             index % 2 === 0 ? "#cde3f2" : "#ffffff",
//                         }}
//                       >
//                         <TableCell>
//                           <Checkbox
//                             checked={!!checkedRows[index]}
//                             onChange={(event) =>
//                               handleCheckboxChange(event, index)
//                             }
//                           />
//                         </TableCell>
//                         <TableCell>{row.Emp_name}</TableCell>
//                         <TableCell>{row.pn_Leavename}</TableCell>
//                         <TableCell>
//                           <Box display="flex" justifyContent="left">
//                             <span
//                               style={{
//                                 backgroundColor:
//                                   statusColors[row.status] || "gray",
//                                 color: "white",
//                                 width: "80px",
//                                 height: "20px",
//                                 textAlign: "center",
//                                 borderRadius: "10px",
//                               }}
//                             >
//                               {row.status === "P" ? "Pending" : row.status}
//                             </span>
//                           </Box>
//                         </TableCell>
//                         <TableCell>{`${new Date(
//                           row.from_date
//                         ).toLocaleDateString()} - ${new Date(
//                           row.to_date
//                         ).toLocaleDateString()}`}</TableCell>
//                         <TableCell>{row.reason}</TableCell>
//                         <TableCell>
//                           {new Date(row.submitted_date).toLocaleDateString()}
//                         </TableCell>
//                         <TableCell>
//                           {row.attachfile ? (
//                             <IconButton
//                               onClick={() => handleImageClick(row.attachfile)}
//                             >
//                               <img
//                                 src={row.attachfile}
//                                 alt="Attachment"
//                                 style={{ width: 50, height: 50 }}
//                               />
//                             </IconButton>
//                           ) : (
//                             "No Attachment"
//                           )}
//                         </TableCell>
//                         <TableCell>
//                           <IconButton
//                             color="success"
//                             size="small"
//                             disabled={anyCheckboxChecked}
//                             onClick={() => handleApproveClick(row)}
//                             sx={{ marginRight: 1 }}
//                           >
//                             <DoneIcon />
//                           </IconButton>
//                           <IconButton
//                             color="error"
//                             size="small"
//                             disabled={anyCheckboxChecked}
//                             onClick={() => handleRejectClick(row)}
//                           >
//                             <CloseIcon />
//                           </IconButton>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>

//               <Grid sx={{ textAlign: "right", padding: "20px", width: "100%" }}>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   size="small"
//                   disabled={!anyCheckboxChecked}
//                   onClick={handleApproveSelected}
//                 >
//                   Approve
//                 </Button>
//                 <Button
//                   variant="contained"
//                   color="error"
//                   style={{ marginLeft: "10px" }}
//                   size="small"
//                   disabled={!anyCheckboxChecked}
//                   onClick={handleRejectSelected}
//                 >
//                   Reject
//                 </Button>
//               </Grid>
//             </Box>
//           </Grid>
//         </Box>

//         {/* Modal for Viewing Attachments */}
//         <Modal
//           open={open}
//           onClose={handleClose}
//           closeAfterTransition
//           BackdropComponent={Backdrop}
//           BackdropProps={{ timeout: 500 }}
//         >
//           <Fade in={open}>
//             <Box
//               sx={{
//                 position: "absolute",
//                 top: "50%",
//                 left: "50%",
//                 transform: "translate(-50%, -50%)",
//                 width: "80%",
//                 bgcolor: "background.paper",
//                 boxShadow: 24,
//                 p: 4,
//                 textAlign: "center",
//               }}
//             >
//               <img
//                 src={imageSrc}
//                 alt="Attachment"
//                 style={{ width: "100%", height: "auto" }}
//               />
//               <IconButton
//                 onClick={handleClose}
//                 style={{ position: "absolute", top: 10, right: 10 }}
//               >
//                 <CloseIcon />
//               </IconButton>
//             </Box>
//           </Fade>
//         </Modal>
//       </div>
//     </Grid>
//   );
// }

// export default LeaveRequestHr;







import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Checkbox, Box, IconButton, Grid, Typography, Modal,
  Backdrop, Fade
} from "@mui/material";

import Navbar from "../../Home Page/Navbar";
import Sidenav from "../../Home Page/Sidenav";
import { REPORTS, SAVE } from "../../../serverconfiguration/controllers";
import { postRequest } from "../../../serverconfiguration/requestcomp";
import { ServerConfig } from "../../../serverconfiguration/serverconfig";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { FilterList } from "@mui/icons-material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

const statusColors = { A: "green", P: "orange", R: "red" };

function LeaveRequestHr() {
  const [checkedRows, setCheckedRows] = useState({});
  const [leaveApply, setLeaveApply] = useState([]);
  const [open, setOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const databaseName = sessionStorage.getItem("databaseName");

  /** ------------------------------------------
   * FETCH ALL LEAVE APPLICATIONS
   * ------------------------------------------ */
  const getData = async () => {
    try {
      const response = await postRequest(ServerConfig.url, REPORTS, {
        query: `SELECT * FROM [${databaseName}].[dbo].[Leave_Apply]`
      });

      const filtered = response.data.filter((row) => row.status === "P");

      const processed = filtered.map((row) => ({
        ...row,
        attachfile: row.attachfile
          ? `data:${row.file_type};base64,${row.attachfile}`
          : null
      }));

      setLeaveApply(processed);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => { getData(); }, []);

  const handleCheckboxChange = (e, index) => {
    setCheckedRows((prev) => ({ ...prev, [index]: e.target.checked }));
  };

  const checkedRowsData = leaveApply.filter((_, i) => checkedRows[i]);
  const anyCheckboxChecked = checkedRowsData.length > 1;

  /** --------------------------------------------------
   *  APPROVE FLOW = update → then recalc leave balance
   * -------------------------------------------------- */
  const approveLeaveAndRecalculate = async (row) => {
    try {
      // 1) Approve leave
      await postRequest(ServerConfig.url, SAVE, {
        query: `
          UPDATE [${databaseName}].[dbo].[Leave_Apply]
          SET status='A', approve='HR'
          WHERE sno=${row.sno};
        `
      });

      // 2) GET total taken days for this employee & leave type
      const takenRes = await postRequest(ServerConfig.url, REPORTS, {
        query: `
          SELECT ISNULL(SUM(days),0) AS takenDays
          FROM [${databaseName}].[dbo].[Leave_Apply]
          WHERE pn_EmployeeID=${row.pn_EmployeeID}
          AND pn_LeaveID=${row.pn_LeaveID}
          AND status='A'
        `
      });

      const takenDays = takenRes.data[0].takenDays || 0;

      // 3) Get allowed days from master
      const allowedRes = await postRequest(ServerConfig.url, REPORTS, {
        query: `
          SELECT pn_Count
          FROM [${databaseName}].[dbo].[paym_leave]
          WHERE pn_leaveID=${row.pn_LeaveID}
        `
      });

      const allowDays = allowedRes.data[0]?.pn_Count || 0;
      const balDays = allowDays - takenDays;

      // 4) Update or insert into paym_EncashmentDetails
      await postRequest(ServerConfig.url, SAVE, {
        query: `
          IF EXISTS (
            SELECT 1 FROM [${databaseName}].[dbo].[paym_EncashmentDetails]
            WHERE pn_EmployeeId=${row.pn_EmployeeID}
            AND Pn_LeaveId=${row.pn_LeaveID}
          )
          BEGIN
            UPDATE [${databaseName}].[dbo].[paym_EncashmentDetails]
            SET Allow_Days=${allowDays},
                Taken_Days=${takenDays},
                Bal_Days=${balDays},
                [Date]=GETDATE()
            WHERE pn_EmployeeId=${row.pn_EmployeeID}
            AND Pn_LeaveId=${row.pn_LeaveID}
          END
          ELSE
          BEGIN
            INSERT INTO [${databaseName}].[dbo].[paym_EncashmentDetails]
              (pn_CompanyId, pn_BranchId, pn_EmployeeId, Pn_LeaveId,
               Allow_Days, Taken_Days, Bal_Days, [Date])
            VALUES
              (${row.pn_CompanyID}, ${row.pn_BranchID}, ${row.pn_EmployeeID},
               ${row.pn_LeaveID}, ${allowDays}, ${takenDays}, ${balDays}, GETDATE())
          END
        `
      });

    } catch (err) {
      console.error("Error approving leave:", err);
    }
  };

  /** ------------------------------------------
   * HANDLE APPROVE BUTTON (single row)
   * ------------------------------------------ */
  const handleApproveClick = async (row) => {
    await approveLeaveAndRecalculate(row);
    await getData();
  };

  /** ------------------------------------------
   * HANDLE REJECT BUTTON (NO balance update)
   * ------------------------------------------ */
  const handleRejectClick = async (row) => {
    await postRequest(ServerConfig.url, SAVE, {
      query: `
        UPDATE [${databaseName}].[dbo].[Leave_Apply]
        SET status='R', approve='HR'
        WHERE sno=${row.sno};
      `
    });
    await getData();
  };

  /** ------------------------------------------
   * HANDLE BULK APPROVE
   * ------------------------------------------ */
  const handleApproveSelected = async () => {
    for (const row of checkedRowsData) {
      await approveLeaveAndRecalculate(row);
    }
    await getData();
  };

  /** ------------------------------------------
   * HANDLE BULK REJECT
   * ------------------------------------------ */
  const handleRejectSelected = async () => {
    for (const row of checkedRowsData) {
      await postRequest(ServerConfig.url, SAVE, {
        query: `
          UPDATE [${databaseName}].[dbo].[Leave_Apply]
          SET status='R', approve='HR'
          WHERE sno=${row.sno};
        `
      });
    }
    await getData();
  };

  /** IMAGE VIEWER */
  const handleImageClick = (src) => { setImageSrc(src); setOpen(true); };
  const handleClose = () => { setOpen(false); setImageSrc(""); };

  return (
    <Grid container>
      <div style={{ backgroundColor: "#f5f5f5", width: "100%" }}>
        <Navbar />
        <Box height={30} />

        <Box sx={{ display: "flex" }}>
          <Sidenav />

          <Grid item xs={12} sm={10} md={9} lg={8} xl={7} style={{ margin: "0 auto", padding: "20px" }}>
            <AppBar position="static" sx={{ marginTop: "50px" }}>
              <Toolbar><Typography variant="h5" sx={{ fontWeight: "bold", color: "white" }}>LEAVE REQUESTS</Typography></Toolbar>
            </AppBar>

            <TableContainer component={Paper}>
              <Table>
                <TableHead style={{ backgroundColor: "#f9f9f9" }}>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>EMPLOYEE NAME</TableCell>
                    <TableCell>LEAVE NAME</TableCell>
                    <TableCell>STATUS</TableCell>
                    <TableCell>REQUEST</TableCell>
                    <TableCell>REASON</TableCell>
                    <TableCell>APPLY DATE</TableCell>
                    <TableCell>ATTACHMENT</TableCell>
                    <TableCell>ACTIONS</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {leaveApply.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Checkbox
                          checked={!!checkedRows[index]}
                          onChange={(e) => handleCheckboxChange(e, index)}
                        />
                      </TableCell>

                      <TableCell>{row.Emp_name}</TableCell>
                      <TableCell>{row.pn_Leavename}</TableCell>
                      <TableCell>
                        <span style={{
                          backgroundColor: statusColors[row.status],
                          color: "white", padding: "2px 10px",
                          borderRadius: "10px"
                        }}>
                          Pending
                        </span>
                      </TableCell>

                      <TableCell>
                        {new Date(row.from_date).toLocaleDateString()} -
                        {new Date(row.to_date).toLocaleDateString()}
                      </TableCell>

                      <TableCell>{row.reason}</TableCell>
                      <TableCell>{new Date(row.submitted_date).toLocaleDateString()}</TableCell>

                      <TableCell>
                        {row.attachfile ? (
                          <img
                            src={row.attachfile}
                            onClick={() => handleImageClick(row.attachfile)}
                            style={{ width: 50, height: 50, cursor: "pointer" }}
                          />
                        ) : "No File"}
                      </TableCell>

                      <TableCell>
                        <IconButton color="success" onClick={() => handleApproveClick(row)}>
                          <DoneIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleRejectClick(row)}>
                          <CloseIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>

              </Table>
            </TableContainer>

            {/* Bulk buttons */}
            <Grid sx={{ textAlign: "right", padding: "20px" }}>
              <Button variant="contained" color="primary" disabled={!anyCheckboxChecked} onClick={handleApproveSelected}>
                Approve Selected
              </Button>
              <Button variant="contained" color="error" style={{ marginLeft: "10px" }} disabled={!anyCheckboxChecked} onClick={handleRejectSelected}>
                Reject Selected
              </Button>
            </Grid>

          </Grid>
        </Box>

        {/* Modal image preview */}
        <Modal open={open} onClose={handleClose} closeAfterTransition BackdropComponent={Backdrop}>
          <Fade in={open}>
            <Box sx={{ p: 4, bgcolor: "white", margin: "auto", marginTop: "10%" }}>
              <img src={imageSrc} style={{ width: "100%" }} />
            </Box>
          </Fade>
        </Modal>

      </div>
    </Grid>
  );
}

export default LeaveRequestHr;
