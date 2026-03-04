import React, { useState, useEffect } from "react";
import { ServerConfig } from "../../../serverconfiguration/serverconfig";
import { REPORTS } from "../../../serverconfiguration/controllers";
import { postRequest } from "../../../serverconfiguration/requestcomp";
import nodata from "../../../images/NoDataImage.jpeg";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  Button,
  InputBase,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  CssBaseline,
  IconButton,
  Grid,
  Box,
  CircularProgress,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Tooltip,
} from "@mui/material";
import { toast } from "react-toastify";
import { CardContent, Card } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import Sidenav from "../../Home Page/Sidenav";
import Navbar from "../../Home Page/Navbar";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";

function EmployeeHome() {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [isLoggedin, setLoggedin] = useState(sessionStorage.getItem("user"));
  const [loggedBranch, setLoggedBranch] = useState([]);
  const [employeeImages, setEmployeeImages] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isViewMode, setIsViewMode] = useState(true);
  const databaseName = sessionStorage.getItem("databaseName");

  // Function to handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const safeValue = (val) => {
    if (val === null || val === undefined) return "";
    if (typeof val === "object") return JSON.stringify(val);
    return val;
  };

  // Filtered employees based on search query
  const filteredEmployees = employees.filter((employee) => {
    const searchValue = searchQuery.toLowerCase();
    return (
      (employee["Employee Name"] &&
        employee["Employee Name"].toLowerCase().includes(searchValue)) ||
      (employee["Employee ID"] &&
        employee["Employee ID"]
          .toString()
          .toLowerCase()
          .includes(searchValue)) ||
      (employee["Employee Code"] &&
        employee["Employee Code"].toLowerCase().includes(searchValue)) ||
      (employee["Email"] &&
        employee["Email"].toLowerCase().includes(searchValue)) ||
      (employee["Department"] &&
        employee["Department"].toLowerCase().includes(searchValue)) ||
      (employee["Designation"] &&
        employee["Designation"].toLowerCase().includes(searchValue))
    );
  });

  // Handler functions for View, Edit, and Delete action
  const handleEditClick = (employeeId) => {
    setIsViewMode(false); // allow editing
    navigate(`/EditEmployee/${employeeId}`, { state: { isViewMode: false } });
  };

  const handleViewClick = (employeeId) => {
    setIsViewMode(true); // disable editing
    console.log(employeeId);
    navigate(`/Editprofile/${employeeId}`, { state: { isViewMode: true } });
  };

  const handleDelete = async (employeeId) => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;

    try {
      const query = `DELETE FROM [${databaseName}].[dbo].[paym_Employee] WHERE pn_EmployeeID = ${employeeId}`;
      const res = await postRequest(ServerConfig.url, REPORTS, { query });

      if (res.status === 200) {
        toast.info("Employee deleted successfully!");
        fetchEmployees(); // Refresh the employee list
      } else {
        toast.error("Failed to delete employee.");
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("An error occurred while deleting the employee.");
    }
  };

  // const handleDeleteClick = async (employeeId) => {
  //   try {
  //     const query = `
  //     DELETE FROM [${databaseName}].[dbo].[paym_employee_profile1]
  //     WHERE pn_EmployeeID = ${employeeId};
  //     DELETE FROM [${databaseName}].[dbo].[paym_Employee]
  //     WHERE pn_EmployeeID = ${employeeId};
      
  //   `;

  //     const response = await postRequest(ServerConfig.url, REPORTS, { query });

  //     if (response.status === 200) {
  //       // Remove the deleted employee from the UI
  //       setEmployees(
  //         employees.filter((emp) => emp["Employee ID"] !== employeeId)
  //       );
  //       alert("Employee deleted successfully.");
  //     } else {
  //       alert("Failed to delete employee. Please try again.");
  //       console.error("Delete failed:", response);
  //     }
  //   } catch (error) {
  //     console.error("Error deleting employee:", error);
  //     alert("Error occurred during deletion.");
  //   }
  // };
  const handleDeleteClick = async (employeeId) => {
  try {
    const query = `
      DECLARE @EmployeeCode VARCHAR(50);

      -- Get EmployeeCode using pn_EmployeeID
      SELECT @EmployeeCode = EmployeeCode
      FROM [${databaseName}].[dbo].[paym_Employee]
      WHERE pn_EmployeeID = ${employeeId};

      -- Delete from profile table
      DELETE FROM [${databaseName}].[dbo].[paym_employee_profile1]
      WHERE pn_EmployeeID = ${employeeId};

      -- Delete from employee table
      DELETE FROM [${databaseName}].[dbo].[paym_Employee]
      WHERE pn_EmployeeID = ${employeeId};

      -- Delete from HRMS_Master login table
      DELETE FROM [HRMS_Master].[dbo].[EmployeesLogin]
      WHERE EmployeeUserId = @EmployeeCode
        AND DBname = '${databaseName}';
    `;

    const response = await postRequest(ServerConfig.url, REPORTS, { query });

    if (response.status === 200) {
      // Remove deleted employee from UI
      setEmployees(
        employees.filter((emp) => emp["Employee ID"] !== employeeId)
      );
      alert("Employee deleted successfully.");
    } else {
      alert("Failed to delete employee. Please try again.");
      console.error("Delete failed:", response);
    }
  } catch (error) {
    console.error("Error deleting employee:", error);
    alert("Error occurred during deletion.");
  }
};


  function handleAddEmployee() {
    navigate("/PaymEmployeeFormm", { state: { isViewMode: false } });
  }

  const getImageSrc = (imageData) => {
    return imageData ? `data:image/jpeg;base64,${imageData}` : nodata;
  };

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const loggedBranchData = await postRequest(ServerConfig.url, REPORTS, {
          query: `SELECT * 
FROM [${databaseName}].[dbo].[paym_Branch]
WHERE Branch_User_Id = '${isLoggedin}'
`,
        });

        if (loggedBranchData.data) {
          setLoggedBranch(loggedBranchData.data);
        }
      } catch (error) {
        console.error("Error fetching branch data:", error);
      }
    }

    if (isLoggedin) {
      fetchInitialData();
    }
  }, [isLoggedin]);

  // Fetch employees data
  const fetchEmployees = async () => {
    if (loggedBranch.length > 0) {
      setIsLoading(true);
      const branchId = loggedBranch[0].pn_BranchID;
      try {
        const query = `
        SELECT 
          emp.pn_EmployeeID AS [Employee ID],
          emp.Employee_Full_Name AS [Employee Name],
          emp.EmployeeCode AS [Employee Code],
          emp.Email,
          emp.Phone_No,
          emp.JoiningDate,
          emp.status,
          emp.Gender,
          emp.DateofBirth,
          emp.role,
          emp.Current_Address,
          emp.permanent_address,
          emp.Father_Name,
          emp.Blood_Group,
          emp.Aadhar_Card,
          emp.Pan_no,
          emp.UAN,
          emp.Pfno,
          emp.Esino,
          emp.Bank_Name,
          emp.Bank_code,
          emp.Branch_Name,
          emp.Account_Type,
          emp.accountNo,
          emp.IFSC_Code,
          emp.MICR_code,
          emp.Reporting_person,
          emp.ReportingID,
          emp.Reporting_email,
          emp.salary_type,
          emp.OT_Eligible,
          emp.OT_calc,
          emp.CTC,
          emp.basic_salary,
          emp.TDS_Applicable,
          emp.PaymentMode,
          emp.VehicleDetails,
          emp.HealthInsuranceDetails,
          emp.NomineeDetails,
          emp.NomineePhoneno,
          emp.NomineeRelationship,
          emp.Asset_Name,
          emp.Asset_SerialNumber,
          emp.ExitDate,
          emp.ExitReason,
          
          profile.pn_DivisionId,
          profile.pn_DepartmentId,
          profile.pn_DesignationId,
          profile.pn_GradeId,
          profile.pn_ShiftId,
          profile.pn_CategoryId,
          profile.pn_JobStatusId,
          profile.pn_LevelID,
          profile.pn_projectsiteID,
          profile.Emp_Profile_Image,
          profile.image_data,
          
          branch.BranchName AS [Branch Name],
          company.CompanyName AS [Company Name],
          dept.v_DepartmentName AS [Department],
          desig.v_DesignationName AS [Designation]
          
        FROM [${databaseName}].[dbo].[paym_Employee] emp
LEFT JOIN [${databaseName}].[dbo].[paym_employee_profile1] profile 
  ON emp.pn_EmployeeID = profile.pn_EmployeeID 
  AND emp.pn_BranchID = profile.pn_BranchID 
  AND emp.pn_CompanyID = profile.pn_CompanyID
LEFT JOIN [${databaseName}].[dbo].[paym_Branch] branch 
  ON emp.pn_BranchID = branch.pn_BranchID
LEFT JOIN [${databaseName}].[dbo].[paym_Company] company 
  ON emp.pn_CompanyID = company.pn_CompanyID
LEFT JOIN [${databaseName}].[dbo].[paym_Department] dept 
  ON profile.pn_DepartmentId = dept.pn_DepartmentId
LEFT JOIN [${databaseName}].[dbo].[paym_Designation] desig 
  ON profile.pn_DesignationId = desig.pn_DesignationID
        WHERE emp.pn_BranchID = ${branchId}
      `;

        const response = await postRequest(ServerConfig.url, REPORTS, {
          query,
        });

        if (response.status === 200) {
          // Only modification: Sort by Employee ID (descending) to show newest first
          const sortedEmployees = (response.data || []).sort(
            (a, b) => b["Employee ID"] - a["Employee ID"]
          );

          setEmployees(sortedEmployees);

          // Original image handling remains unchanged
          const images = {};
          sortedEmployees.forEach((item) => {
            if (item.image_data) {
              images[item["Employee ID"]] = item.image_data;
            }
          });
          setEmployeeImages(images);
        } else {
          console.error(`Unexpected response status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching employees data:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  // Fetch employees data whenever the loggedBranch changes
  useEffect(() => {
    fetchEmployees();
  }, [loggedBranch]);

  return (
    <Grid item xs={12}>
      <div style={{ backgroundColor: "#f5f5f5" }}>
        <Navbar />
        <Box height={40} />
        <Box sx={{ display: "flex" }}>
          <Sidenav />
          <Grid item xs={12} style={{ margin: "0 auto" }}>
            <div>
              <Grid container>
                <Card
                  style={{
                    // maxWidth: 1100,
                    width: "100%",
                    margin: "40px",
                    padding: "20px",
                  }}
                >
                  <CssBaseline />
                  <div
                    style={{ flexGrow: 1, padding: "8px", marginLeft: "0px" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "16px",
                      }}
                    >
                      <AppBar
                        position="static"
                        color="primary"
                        style={{
                          backgroundColor: "#0077d4",
                          color: "white",
                          boxShadow: "none",
                          width: "100%",
                          minHeight: "50px",
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "center",
                          paddingLeft: "16px",
                          paddingRight: "16px",
                          marginBottom: "16px",
                          boxSizing: "border-box",
                        }}
                      >
                        <Toolbar
                          sx={{ justifyContent: "left", height: "100%" }}
                        >
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
                            EMPLOYEES
                          </Typography>
                        </Toolbar>
                      </AppBar>
                    </div>
                    <Paper style={{ padding: "16px", marginBottom: "16px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            backgroundColor: "#f1f1f1",
                            padding: "0px",
                            borderRadius: "4px",
                            marginBottom: "8px",
                            maxWidth: 250,
                          }}
                        >
                          <InputBase
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            style={{ marginLeft: "8px", flex: 1 }}
                          />
                          <IconButton style={{ padding: "4px" }}>
                            <SearchIcon />
                          </IconButton>
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Button
                            variant="contained"
                            style={{
                              backgroundColor: "#1976d2", // Replace with your primary color
                              color: "#fff",
                              borderRadius: "10px",
                              marginRight: "3.2px",
                              height: "48px",
                            }}
                            onClick={handleAddEmployee}
                          >
                            <AddIcon />
                            Add Employee
                          </Button>
                        </div>
                      </div>
                    </Paper>
                    <TableContainer component={Paper} >
                      <Table style={{ minWidth: 700 }}>
                        <TableHead>
                          <TableRow>
                            <TableCell style={{ backgroundColor: "#f1f1f1" }}>
                              EMPLOYEE NAME
                            </TableCell>
                            <TableCell style={{ backgroundColor: "#f1f1f1" }}>
                              EMPLOYEE ID
                            </TableCell>
                            <TableCell style={{ backgroundColor: "#f1f1f1" }}>
                              EMPLOYEE CODE
                            </TableCell>
                            <TableCell style={{ backgroundColor: "#f1f1f1" }}>
                              EMAIL
                            </TableCell>
                            <TableCell style={{ backgroundColor: "#f1f1f1" }}>
                              PHONE
                            </TableCell>
                            <TableCell style={{ backgroundColor: "#f1f1f1" }}>
                              DEPARTMENT
                            </TableCell>
                            <TableCell style={{ backgroundColor: "#f1f1f1" }}>
                              DESIGNATION
                            </TableCell>
                            <TableCell style={{ backgroundColor: "#f1f1f1" }}>
                              ACTIONS
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody style={{ maxHeight: "500px",  overflowY: "auto", }}>
                          {isLoading ? (
                            <TableRow>
                              <TableCell colSpan={8} align="center">
                                <CircularProgress />
                              </TableCell>
                            </TableRow>
                          ) : filteredEmployees.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={8} align="center">
                                <IconButton aria-label="no data">
                                  <img src={nodata} alt="No data" width={150} />
                                </IconButton>
                                <Typography>No Data</Typography>
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredEmployees.map((employee, index) => (
                              <TableRow
                                key={index}
                                style={{
                                  height: 33,
                                  backgroundColor:
                                    index % 2 === 0 ? "#cde3f2" : "#ffffff",
                                  transition:
                                    "background-color 0.3s ease-in-out",
                                }}
                              >
                                <TableCell>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Avatar
                                      src={getImageSrc(
                                        employeeImages[employee["Employee ID"]]
                                      )}
                                      alt="Employee Avatar"
                                      style={{ marginRight: "8px" }}
                                    />
                                    {employee["Employee Name"]}
                                  </div>
                                </TableCell>
                                <TableCell>{employee["Employee ID"]}</TableCell>
                                <TableCell>
                                  {employee["Employee Code"]}
                                </TableCell>
                                <TableCell>{employee["Email"]}</TableCell>
                                <TableCell>
                                  {safeValue(employee["Phone_No"])}
                                </TableCell>
                                <TableCell>
                                  {safeValue(employee["Department"])}
                                </TableCell>
                                <TableCell>
                                  {safeValue(employee["Designation"])}
                                </TableCell>

                                <TableCell
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-around",
                                  }}
                                >
                                  <IconButton
                                    aria-label="view"
                                    onClick={() =>
                                      handleViewClick(employee["Employee ID"])
                                    }
                                    style={{ color: "darkblue" }}
                                  >
                                    <VisibilityIcon />
                                  </IconButton>
                                  <IconButton
                                    aria-label="edit"
                                    onClick={() =>
                                      handleEditClick(employee["Employee ID"])
                                    }
                                    style={{ color: "#007BFF" }}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton
                                    aria-label="delete"
                                    onClick={() =>
                                      handleDeleteClick(employee["Employee ID"])
                                    }
                                    style={{ color: "red" }}
                                  >
                                    <DeleteOutlineIcon />
                                  </IconButton>
                                  {/* <IconButton
                                    aria-label="delete"
                                    onClick={() =>
                                      handleDelete(employee["Employee ID"])
                                    }
                                    style={{ color: "red" }}
                                  >
                                    <DeleteIcon />
                                  </IconButton> */}
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </Card>
              </Grid>
            </div>
          </Grid>
        </Box>
      </div>
    </Grid>
  );
}

export default EmployeeHome;
