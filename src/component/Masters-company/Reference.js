import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  Container,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tabs,
  Tab,
  FormHelperText,
  Switch,
  Autocomplete,
} from "@mui/material";
import Navbar from "../Home Page-comapny/Navbar1";
import Sidenav from "../Home Page-comapny/Sidenav1";
import { postRequest } from "../../serverconfiguration/requestcomp";
import { ServerConfig } from "../../serverconfiguration/serverconfig";
import { REPORTS } from "../../serverconfiguration/controllers";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as yup from "yup";
import cityStateData from "../../Assets/json/cityStateData.json";
import axios from "axios";
export const Reference = () => {
  const [branches, setBranches] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [pnCompanyId, setPnCompanyId] = useState(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [openView, setOpenView] = useState(false);
  const [viewData, setViewData] = useState(null);

  const isloggedin = sessionStorage.getItem("user");
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const databaseName = sessionStorage.getItem("databaseName"); // ✅ get DB name dynamically

  useEffect(() => {
    if (cityStateData?.states) {
      setStates(cityStateData.states.map((s) => s.state));
    }
  }, []);

 // Fetch companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        if (!databaseName) {
          console.warn("Missing database name in sessionStorage");
          return;
        }

        const query = `
        SELECT pn_CompanyID AS pnCompanyId, CompanyName 
        FROM [${databaseName}].[dbo].[paym_Company]
      `;

        const res = await postRequest(ServerConfig.url, REPORTS, { query });
        if (res.data) setCompanies(res.data);
      } catch (err) {
        console.error("Error fetching companies:", err);
      }
    };
    fetchCompanies();
  }, [databaseName]);

  // ✅ Fetch logged-in company ID
  useEffect(() => {
    const fetchCompanyId = async () => {
      try {
        if (!databaseName || !isloggedin) {
          console.warn("Missing database name or login ID");
          return;
        }

        const query = `
        SELECT pn_CompanyID 
        FROM [${databaseName}].[dbo].[paym_Company]
        WHERE company_user_id='${isloggedin}'
      `;

        const res = await postRequest(ServerConfig.url, REPORTS, { query });
        if (res?.data?.length > 0) setPnCompanyId(res.data[0].pn_CompanyID);
      } catch (err) {
        console.error("Error fetching company ID:", err);
      }
    };

    fetchCompanyId();
  }, [isloggedin, databaseName]);

  useEffect(() => {
    const fetchLoggedInCompany = async () => {
      try {
        const query = `
  SELECT pn_CompanyID AS pnCompanyId, CompanyName 
  FROM [${databaseName}].[dbo].[paym_Company]
  WHERE company_user_id='${isloggedin}'
`;

        const res = await postRequest(ServerConfig.url, REPORTS, { query });
        if (res?.data?.length > 0) {
          setCompanies(res.data); // only the logged-in company
          setPnCompanyId(res.data[0].pnCompanyId); // set company id for form
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchLoggedInCompany();
  }, [isloggedin]);

  // Fetch branches
  const fetchBranches = async () => {
    if (!pnCompanyId) return;
    try {
      //       const query = `
      //   SELECT *
      //   FROM [${databaseName}].[dbo].[paym_Branch]
      //   WHERE pn_CompanyID IN (
      //     SELECT pn_CompanyID FROM [${databaseName}].[dbo].[paym_Company]
      //     WHERE company_user_id='${isloggedin}'
      //   )
      // `;
      const query = `
  SELECT * FROM [${databaseName}].[dbo].[paym_Branch]
  WHERE pn_CompanyID IN (
    SELECT pn_CompanyID 
    FROM [${databaseName}].[dbo].[paym_Company]
    WHERE company_user_id='${isloggedin}'
  )
`;

      const res = await postRequest(ServerConfig.url, REPORTS, { query });
      if (res.status === 200) setBranches(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };
  console.log("Branch Record:", branches);

  useEffect(() => {
    if (pnCompanyId) fetchBranches();
  }, [pnCompanyId]);

  // Validation schema
  const validationSchema = yup.object({
    branchCode: yup.string().required("Branch Code required"),
    branchName: yup.string().required("Branch Name required"),
    branchUserId: yup.string().required("Branch User ID required"),
    branchPassword: yup.string().required("Branch Password required"),
    startDate: yup.date().required("Start Date required"),
    endDate: yup.date().required("End Date required"),
  });
  const handleOpenAdd = () => {
    setOpenAdd(true);
    addFormik.resetForm({
      values: {
        branchCode: "",
        branchName: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        country: "India",
        ZipCode: "",
        phoneNo: "",
        faxNo: "",
        emailId: "",
        alternateEmailId: "",
        branchUserId: "", // 🟢 Ensure this is empty
        branchPassword: "", // 🟢 Ensure this is empty
        status: "INActive",
        startDate: "",
        endDate: "",
        pnCompanyId: pnCompanyId || "", // only company is prefilled
      },
    });
  };

  // Formik for Add
  const addFormik = useFormik({
    initialValues: {
      branchCode: "",
      branchName: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      country: "India",
      ZipCode: "",
      phoneNo: "",
      faxNo: "",
      emailId: "",
      alternateEmailId: "",
      branchUserId: "",
      branchPassword: "",
      status: "Active",
      startDate: "",
      endDate: "",
      pnCompanyId: pnCompanyId || "",
    },
    enableReinitialize: true,
    validationSchema,
    // onSubmit: async (values) => {
    //   try {
    //     if (!databaseName) {
    //       toast.error("Database name missing in sessionStorage");
    //       return;
    //     }

    //     const query = `INSERT INTO [${databaseName}].[dbo].[paym_Branch]
    //     ([pn_CompanyID],[BranchCode],[BranchName],[Address_Line1],[Address_Line2],[City],[State],[Country],[ZipCode],
    //      [Phone_No],[Fax_No],[Email_Id],[AlternateEmail_Id],[Branch_User_Id],[Branch_Password],[status],
    //      [start_date],[end_date],[BranchType])
    //     VALUES
    //     (${pnCompanyId}, '${values.branchCode}', '${values.branchName}', '${values.addressLine1}', '${values.addressLine2}',
    //      '${values.city}', '${values.state}', '${values.country}', '${values.ZipCode}', '${values.phoneNo}', '${values.faxNo}',
    //      '${values.emailId}', '${values.alternateEmailId}', '${values.branchUserId}', '${values.branchPassword}',
    //      '${values.status}', '${values.startDate}', '${values.endDate}', 'Main Branch')`;
    //     const res = await postRequest(ServerConfig.url, REPORTS, { query });
    //     if (res.status === 200) {
    //       toast.success("Branch added!");
    //       fetchBranches();
    //       setOpenAdd(false);
    //       addFormik.resetForm();
    //     } else toast.error("Failed to add branch");
    //   } catch (err) {
    //     console.error(err);
    //     toast.error("Error adding branch");
    //   }
    // },
    onSubmit: async (values) => {
      try {
        if (!databaseName) {
          toast.error("Database name missing in sessionStorage");
          return;
        }

        // 1️⃣ Insert into the company’s branch table
        const branchInsertQuery = `
      INSERT INTO [${databaseName}].[dbo].[paym_Branch] 
      ([pn_CompanyID],[BranchCode],[BranchName],[Address_Line1],[Address_Line2],
      [City],[State],[Country],[ZipCode],[Phone_No],[Fax_No],[Email_Id],
      [AlternateEmail_Id],[Branch_User_Id],[Branch_Password],[status],
      [start_date],[end_date],[BranchType])
      VALUES
      (${pnCompanyId}, '${values.branchCode}', '${values.branchName}', 
      '${values.addressLine1}', '${values.addressLine2}', '${values.city}', 
      '${values.state}', '${values.country}', '${values.ZipCode}', '${values.phoneNo}', 
      '${values.faxNo}', '${values.emailId}', '${values.alternateEmailId}', 
      '${values.branchUserId}', '${values.branchPassword}', '${values.status}', 
      '${values.startDate}', '${values.endDate}', 'Main Branch')
      `;

        const branchRes = await postRequest(ServerConfig.url, REPORTS, {
          query: branchInsertQuery,
        });

        if (branchRes.status === 200) {
          // 2️⃣ Insert branch login into static HRMS_Master
          const masterInsertQuery = `
        INSERT INTO [HRMS_Master].[dbo].[Branchlogin]
        ([BranchUserId],[Password],[DBname],[startdate],[enddate],[Status])
        VALUES ('${values.branchUserId}', '${values.branchPassword}', 
        '${databaseName}', '${values.startDate}', '${values.endDate}', '${values.status}')
      `;

          const masterRes = await postRequest(ServerConfig.url, REPORTS, {
            query: masterInsertQuery,
          });

          if (masterRes.status === 200) {
            toast.success("✅ Branch & Login created successfully!");
          } else {
            toast.warn(
              "⚠️ Branch created, but login not inserted into HRMS_Master."
            );
          }

          fetchBranches();
          setOpenAdd(false);
          addFormik.resetForm();
        } else {
          toast.error("❌ Failed to add branch in company database");
        }
      } catch (err) {
        console.error("Error adding branch:", err);
        toast.error("Unexpected error during branch creation");
      }
    },
  });
  const updateDepartmentAccess = async (branchId, currentValue) => {
    const newValue = currentValue ? 0 : 1;
    // 1️⃣ Update DB
    const query = `
    UPDATE [${databaseName}].[dbo].[paym_Branch]
    SET can_manage_department = ${newValue}
    WHERE pn_BranchID = ${branchId};
  `;
    await postRequest(ServerConfig.url, REPORTS, { query });

    // 2️⃣ Update UI immediately without refresh
    setBranches((prev) =>
      prev.map((b) =>
        b.pn_BranchID === branchId
          ? { ...b, can_manage_department: newValue }
          : b
      )
    );

    // 3️⃣ Notify other pages
    sessionStorage.setItem("forceRefreshAccess", Date.now());
  };

  const updateDesignationAccess = async (branchId, currentValue) => {
    const newValue = currentValue === 1 ? 0 : 1;

    const query = `
    UPDATE [${databaseName}].[dbo].[paym_Branch]
    SET can_manage_designation = ${newValue}
    WHERE pn_BranchID = ${branchId};
  `;
    await postRequest(ServerConfig.url, REPORTS, { query });

    setBranches((prev) =>
      prev.map((b) =>
        b.pn_BranchID === branchId
          ? { ...b, can_manage_designation: newValue }
          : b
      )
    );

    sessionStorage.setItem("forceRefreshAccess", Date.now());
  };

  // Formik for Edit
  const editFormik = useFormik({
    initialValues: {
      pnCompanyId: editData?.pn_CompanyID || "",
      branchCode: editData?.BranchCode || "",
      branchName: editData?.BranchName || "",
      addressLine1: editData?.Address_Line1 || "",
      addressLine2: editData?.Address_Line2 || "",
      city: editData?.City || "",
      state: editData?.State || "",
      country: editData?.Country || "India",
      ZipCode: editData?.ZipCode || "",
      phoneNo: editData?.Phone_No || "",
      faxNo: editData?.Fax_No || "",
      emailId: editData?.Email_Id || "",
      alternateEmailId: editData?.AlternateEmail_Id || "",
      branchUserId: editData?.Branch_User_Id || "",
      branchPassword: editData?.Branch_Password || "",
      status: editData?.status || "Active",
      startDate: editData?.start_date?.substring(0, 10) || "",
      endDate: editData?.end_date?.substring(0, 10) || "",
    },
    enableReinitialize: true,
    validationSchema,
    // onSubmit: async (values) => {
    //   try {
    //     const query = `UPDATE [${databaseName}].[dbo].[paym_Branch] SET
    //       BranchCode='${values.branchCode}', BranchName='${values.branchName}',
    //       Address_Line1='${values.addressLine1}', Address_Line2='${values.addressLine2}',
    //       City='${values.city}', State='${values.state}', Country='${values.country}',
    //       ZipCode='${values.ZipCode}', Phone_No='${values.phoneNo}', Fax_No='${values.faxNo}',
    //       Email_Id='${values.emailId}', AlternateEmail_Id='${values.alternateEmailId}',
    //       Branch_User_Id='${values.branchUserId}', Branch_Password='${values.branchPassword}',
    //       status='${values.status}', start_date='${values.startDate}', end_date='${values.endDate}'
    //       WHERE pn_BranchID=${editData?.pn_BranchID}`;
    //     const res = await postRequest(ServerConfig.url, REPORTS, { query });
    //     if (res.status === 200) {
    //       toast.success("Branch updated!");
    //       fetchBranches();
    //       setOpenEdit(false);
    //       setEditData(null);
    //     } else toast.error("Failed to update branch");
    //   } catch (err) {
    //     console.error(err);
    //     toast.error("Error updating branch");
    //   }
    // },
    onSubmit: async (values) => {
      try {
        // 1️⃣ UPDATE dynamic company database branch table
        const branchUpdateQuery = `
      UPDATE [${databaseName}].[dbo].[paym_Branch] SET
        BranchCode='${values.branchCode}', BranchName='${values.branchName}',
        Address_Line1='${values.addressLine1}', Address_Line2='${values.addressLine2}',
        City='${values.city}', State='${values.state}', Country='${values.country}',
        ZipCode='${values.ZipCode}', Phone_No='${values.phoneNo}', Fax_No='${values.faxNo}',
        Email_Id='${values.emailId}', AlternateEmail_Id='${values.alternateEmailId}',
        Branch_User_Id='${values.branchUserId}', Branch_Password='${values.branchPassword}',
        status='${values.status}', start_date='${values.startDate}', end_date='${values.endDate}'
      WHERE pn_BranchID=${editData?.pn_BranchID}
    `;

        const res = await postRequest(ServerConfig.url, REPORTS, {
          query: branchUpdateQuery,
        });

        if (res.status !== 200) {
          toast.error("Failed to update branch");
          return;
        }

        // 2️⃣ CHECK if Branchlogin record exists
        const checkQuery = `
      SELECT Id 
      FROM [HRMS_Master].[dbo].[Branchlogin]
      WHERE BranchUserId='${values.branchUserId}'
    `;
        const checkRes = await postRequest(ServerConfig.url, REPORTS, {
          query: checkQuery,
        });

        let masterQuery = "";

        if (checkRes.data?.length > 0) {
          // 3️⃣ UPDATE existing Branchlogin record
          masterQuery = `
        UPDATE [HRMS_Master].[dbo].[Branchlogin]
        SET Password='${values.branchPassword}',
            BranchUserId='${values.branchUserId}',
            startdate='${values.startDate}',
            enddate='${values.endDate}',
            Status='${values.status}'
        WHERE DBname='${databaseName}'
      `;
        } else {
          // 3️⃣ INSERT new record if not exists
          masterQuery = `
        INSERT INTO [HRMS_Master].[dbo].[Branchlogin]
        (BranchUserId, Password, DBname, startdate, enddate, Status)
        VALUES ('${values.branchUserId}', '${values.branchPassword}', 
                '${databaseName}', '${values.startDate}', '${values.endDate}', '${values.status}')
      `;
        }

        const masterRes = await postRequest(ServerConfig.url, REPORTS, {
          query: masterQuery,
        });

        if (masterRes.status === 200) {
          toast.success("Branch updated successfully!");
        } else {
          toast.warn("Branch updated but Branchlogin record failed to update");
        }

        fetchBranches();
        setOpenEdit(false);
        setEditData(null);
      } catch (err) {
        console.error(err);
        toast.error("Error updating branch");
      }
    },
  });

  // Delete
  // const handleDelete = async (id) => {
  //   if (!window.confirm("Delete branch?")) return;
  //   try {
  //     const query = `DELETE FROM [dbo].[paym_Branch] WHERE pn_BranchID=${id}`;
  //     const res = await postRequest(ServerConfig.url, REPORTS, { query });
  //     if (res.status === 200) {
  //       toast.info("Deleted!");
  //       fetchBranches();
  //     } else toast.error("Failed to delete");
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Error deleting branch");
  //   }
  // };
  const handleDelete = async (id) => {
    if (!window.confirm("Delete branch?")) return;

    try {
      // 1️⃣ Fetch Branch_User_Id from company DB BEFORE deleting
      const getUserQuery = `
      SELECT Branch_User_Id 
      FROM [${databaseName}].[dbo].[paym_Branch]
      WHERE pn_BranchID = ${id}
    `;

      const getUserRes = await postRequest(ServerConfig.url, REPORTS, {
        query: getUserQuery,
      });

      const branchUserId = getUserRes.data?.[0]?.Branch_User_Id;

      // 2️⃣ Delete from the company branch table
      const deleteBranchQuery = `
      DELETE FROM [${databaseName}].[dbo].[paym_Branch]
      WHERE pn_BranchID = ${id}
    `;

      const deleteBranchRes = await postRequest(ServerConfig.url, REPORTS, {
        query: deleteBranchQuery,
      });

      if (deleteBranchRes.status !== 200) {
        toast.error("Failed to delete branch");
        return;
      }

      // 3️⃣ Delete from HRMS_Master using BranchUserId
      if (branchUserId) {
        const deleteMasterQuery = `
        DELETE FROM [HRMS_Master].[dbo].[Branchlogin]
        WHERE BranchUserId = '${branchUserId}'
      `;

        await postRequest(ServerConfig.url, REPORTS, {
          query: deleteMasterQuery,
        });
      }

      toast.success("Branch & HRMS login deleted successfully!");
      fetchBranches();
    } catch (err) {
      console.error(err);
      toast.error("Error deleting branch");
    }
  };

  return (
    <Box>
      <Navbar />
      <Box sx={{ display: "flex", mt: 2 }}>
        <Sidenav />
        <Container maxWidth="xl" sx={{ p: 2, my: "100px" }}>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="h5">Branch Master</Typography>
            <Button onClick={handleOpenAdd}>Add Branch</Button>
          </Box>

          <Card sx={{ p: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>S. No</TableCell>
                  <TableCell>Branch Code</TableCell>
                  <TableCell>Branch Name</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                  <TableCell>Department Access</TableCell>
                  <TableCell>Designation Access</TableCell>
                </TableRow>
              </TableHead>
              {/* <TableBody>
                {branches.map((b) => (
                  <TableRow key={b.pn_BranchID}>
                    <TableCell>{b.BranchCode}</TableCell>
                    <TableCell>{b.BranchName}</TableCell>
                    <TableCell>{b.Address_Line1}</TableCell>
                    <TableCell>{b.City}</TableCell>
                    <TableCell>{b.status}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        onClick={() => {
                          setViewData(b); // set the branch to viewData
                          setOpenView(true); // open the dialog
                        }}
                      >
                        View
                      </Button>

                      <Button
                        size="small"
                        onClick={() => {
                          setEditData(b);
                          setOpenEdit(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        onClick={() => handleDelete(b.pn_BranchID)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody> */}
              <TableBody>
                {branches.map((b, index) => (
                  <TableRow key={b.pn_BranchID}>
                    <TableCell>{index + 1}</TableCell> {/* S. No column */}
                    <TableCell>{b.BranchCode}</TableCell>
                    <TableCell>{b.BranchName}</TableCell>
                    <TableCell>{b.Address_Line1}</TableCell>
                    <TableCell>{b.City}</TableCell>
                    <TableCell>{b.status}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        onClick={() => {
                          setViewData({ ...b, index: index + 1 }); // set the branch to viewData
                          setOpenView(true); // open the dialog
                        }}
                      >
                        View
                      </Button>

                      <Button
                        size="small"
                        onClick={() => {
                          setEditData(b);
                          setOpenEdit(true);
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        size="small"
                        onClick={() => handleDelete(b.pn_BranchID)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={Boolean(b.can_manage_department)}
                        onChange={() =>
                          updateDepartmentAccess(
                            b.pn_BranchID,
                            b.can_manage_department
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={Boolean(b.can_manage_designation)}
                        onChange={() =>
                          updateDesignationAccess(
                            b.pn_BranchID,
                            b.can_manage_designation
                          )
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
          <Dialog
            open={openView}
            onClose={() => {
              setOpenView(false);
              setViewData(null);
            }}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>Branch Details</DialogTitle>
            <DialogContent>
              {viewData && (
                <Table>
                  <TableBody>
                    {/* <TableRow><TableCell><strong>Company ID</strong></TableCell><TableCell>{viewData.pn_CompanyID}</TableCell></TableRow>
                    <TableRow><TableCell><strong>Branch ID</strong></TableCell><TableCell>{viewData.pn_BranchID}</TableCell></TableRow> */}
                    <TableRow>
                      <TableCell>
                        <strong>S. No</strong>
                      </TableCell>
                      <TableCell>{viewData.index}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Branch Code</strong>
                      </TableCell>
                      <TableCell>{viewData.BranchCode}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Branch Name</strong>
                      </TableCell>
                      <TableCell>{viewData.BranchName}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Branch User ID</strong>
                      </TableCell>
                      <TableCell>{viewData.Branch_User_Id}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Branch Password</strong>
                      </TableCell>
                      <TableCell>{viewData.Branch_Password}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Address Line 1</strong>
                      </TableCell>
                      <TableCell>{viewData.Address_Line1}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Address Line 2</strong>
                      </TableCell>
                      <TableCell>{viewData.Address_Line2}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>City</strong>
                      </TableCell>
                      <TableCell>{viewData.City}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>State</strong>
                      </TableCell>
                      <TableCell>{viewData.State}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Country</strong>
                      </TableCell>
                      <TableCell>{viewData.Country}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Zip Code</strong>
                      </TableCell>
                      <TableCell>{viewData.ZipCode}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Phone No</strong>
                      </TableCell>
                      <TableCell>{viewData.Phone_No}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Fax No</strong>
                      </TableCell>
                      <TableCell>{viewData.Fax_No}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Email</strong>
                      </TableCell>
                      <TableCell>{viewData.Email_Id}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Alternate Email</strong>
                      </TableCell>
                      <TableCell>{viewData.AlternateEmail_Id}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Status</strong>
                      </TableCell>
                      <TableCell>{viewData.status}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        {" "}
                        <strong>Start Date</strong>
                      </TableCell>
                      <TableCell>
                        {new Date(viewData.start_date).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>End Date</strong>
                      </TableCell>
                      <TableCell>
                        {new Date(viewData.end_date).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                    {/* <TableRow><TableCell><strong>Branch Type</strong></TableCell><TableCell>{viewData.BranchType}</TableCell></TableRow> */}
                  </TableBody>
                </Table>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setOpenView(false);
                  setViewData(null);
                }}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>

          {/* <Dialog
            open={openView}
            onClose={() => {
              setOpenView(false);
              setViewData(null);
            }}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>Branch Details</DialogTitle>
            <DialogContent dividers>
              {viewData ? (
                <Table>
                  <TableBody>
                    {Object.entries(viewData).map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell>
                          <strong>{key.replace(/_/g, " ")}</strong>
                        </TableCell>
                        <TableCell>
                          {typeof value === "string" && value.includes("T")
                            ? new Date(value).toLocaleDateString()
                            : value?.toString() || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Typography>No data to display</Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setOpenView(false);
                  setViewData(null);
                }}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog> */}

          {/* Add Branch Dialog */}
          <Dialog
            open={openAdd}
            onClose={() => setOpenAdd(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>Add Branch</DialogTitle>
            <DialogContent>
              <Tabs
                value={tabIndex}
                onChange={(e, v) => setTabIndex(v)}
                sx={{ mb: 2 }}
              >
                <Tab label="General Info" />
                <Tab label="Address" />
                <Tab label="Contact" />
                <Tab label="Additional" />
              </Tabs>
              <form onSubmit={addFormik.handleSubmit}>
                {tabIndex === 0 && (
                  <Grid container spacing={2}>
                    <Grid item xs={3}>
                      <FormControl
                        fullWidth
                        error={
                          addFormik.touched.pnCompanyId &&
                          Boolean(addFormik.errors.pnCompanyId)
                        }
                      >
                        <InputLabel shrink sx={{ color: "#000 !important" }}>
                          Company
                        </InputLabel>
                        <Select
                          name="pnCompanyId"
                          value={addFormik.values.pnCompanyId}
                          onChange={addFormik.handleChange}
                          displayEmpty
                          disabled
                          sx={{
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#d3d3d3",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#000",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#000",
                            },
                            "& .MuiSelect-outlined": { color: "#000" },
                            backgroundColor: "#fff",
                            borderRadius: "8px",
                          }}
                        >
                          <MenuItem value="">Select Company</MenuItem>
                          {companies.map((company) => (
                            <MenuItem
                              key={company.pnCompanyId}
                              value={company.pnCompanyId}
                            >
                              {company.CompanyName}
                            </MenuItem>
                          ))}
                        </Select>
                        {addFormik.touched.pnCompanyId &&
                          addFormik.errors.pnCompanyId && (
                            <FormHelperText style={{ color: "red" }}>
                              {addFormik.errors.pnCompanyId}
                            </FormHelperText>
                          )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        fullWidth
                        label="Branch Code"
                        name="branchCode"
                        value={addFormik.values.branchCode}
                        onChange={addFormik.handleChange}
                        error={
                          !!addFormik.touched.branchCode &&
                          !!addFormik.errors.branchCode
                        }
                        helperText={
                          addFormik.touched.branchCode &&
                          addFormik.errors.branchCode
                        }
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        fullWidth
                        label="Branch Name"
                        name="branchName"
                        value={addFormik.values.branchName}
                        onChange={addFormik.handleChange}
                        error={
                          !!addFormik.touched.branchName &&
                          !!addFormik.errors.branchName
                        }
                        helperText={
                          addFormik.touched.branchName &&
                          addFormik.errors.branchName
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Branch User ID"
                        name="branchUserId"
                        // autoComplete="new-username"
                        value={addFormik.values.branchUserId}
                        onChange={addFormik.handleChange}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Branch Password"
                        name="branchPassword"
                        type="password"
                        autoComplete="new-password"
                        value={addFormik.values.branchPassword}
                        onChange={addFormik.handleChange}
                        error={
                          !!addFormik.touched.branchPassword &&
                          !!addFormik.errors.branchPassword
                        }
                        helperText={
                          addFormik.touched.branchPassword &&
                          addFormik.errors.branchPassword
                        }
                      />
                    </Grid>
                  </Grid>
                )}

                {tabIndex === 1 && (
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Address Line 1"
                        name="addressLine1"
                        value={addFormik.values.addressLine1}
                        onChange={addFormik.handleChange}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Address Line 2"
                        name="addressLine2"
                        value={addFormik.values.addressLine2}
                        onChange={addFormik.handleChange}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Autocomplete
                        options={states}
                        value={addFormik.values.state || ""}
                        onChange={(e, value) => {
                          const found = cityStateData.states.find(
                            (s) => s.state === value
                          );
                          setDistricts(found ? found.districts : []);
                          setSelectedState(value);
                          addFormik.setFieldValue("state", value || "");
                          addFormik.setFieldValue("city", "");
                        }}
                        renderInput={(params) => (
                          <TextField {...params} label="State" fullWidth />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Autocomplete
                        options={districts}
                        value={addFormik.values.city || ""}
                        onChange={(e, value) =>
                          addFormik.setFieldValue("city", value || "")
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="District / City"
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label={
                          <span>
                            ZipCode
                            <span
                              style={{
                                color: "red",
                                marginLeft: "0.25rem",
                              }}
                            >
                              *
                            </span>
                          </span>
                        }
                        name="ZipCode"
                        value={addFormik.values.ZipCode}
                        onChange={addFormik.handleChange}
                        // onChange={handleChange}
                        // onKeyDown={handleKeyDown}
                        // onBlur={formik.handleBlur}
                        className="custom-readonly-textfield"
                        error={
                          addFormik.touched.ZipCode &&
                          Boolean(addFormik.errors.ZipCode)
                        }
                        helperText={
                          addFormik.touched.ZipCode && addFormik.errors.ZipCode
                        }
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Country"
                        name="country"
                        value={addFormik.values.country || "India"} // default to India
                        onChange={(e) =>
                          addFormik.setFieldValue("country", e.target.value)
                        }
                      />
                    </Grid>
                  </Grid>
                )}

                {tabIndex === 2 && (
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Phone No"
                        name="phoneNo"
                        value={addFormik.values.phoneNo}
                        onChange={addFormik.handleChange}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Fax No"
                        name="faxNo"
                        value={addFormik.values.faxNo}
                        onChange={addFormik.handleChange}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="emailId"
                        value={addFormik.values.emailId}
                        onChange={addFormik.handleChange}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Alternate Email"
                        name="alternateEmailId"
                        value={addFormik.values.alternateEmailId}
                        onChange={addFormik.handleChange}
                      />
                    </Grid>
                  </Grid>
                )}

                {tabIndex === 3 && (
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                          name="status"
                          value={addFormik.values.status}
                          onChange={addFormik.handleChange}
                        >
                          <MenuItem value="Active">Active</MenuItem>
                          <MenuItem value="Inactive">Inactive</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Start Date"
                        name="startDate"
                        value={addFormik.values.startDate}
                        onChange={addFormik.handleChange}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{
                          min: new Date().toISOString().split("T")[0], // disables past dates
                        }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      {/* <TextField
                        fullWidth
                        type="date"
                        label="End Date"
                        name="endDate"
                        value={addFormik.values.endDate}
                        onChange={addFormik.handleChange}
                        InputLabelProps={{ shrink: true }}
                      /> */}
                      <TextField
                        fullWidth
                        type="date"
                        label="End Date"
                        name="endDate"
                        value={addFormik.values.endDate}
                        onChange={addFormik.handleChange}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{
                          min: addFormik.values.startDate || "",
                        }}
                        disabled={!addFormik.values.startDate} // ✅ Disable until start date selected
                      />
                    </Grid>
                  </Grid>
                )}
                <DialogActions>
                  {tabIndex > 0 && (
                    <Button onClick={() => setTabIndex(tabIndex - 1)}>
                      Back
                    </Button>
                  )}

                  {tabIndex < 3 && (
                    <Button
                      onClick={() => setTabIndex(tabIndex + 1)}
                      variant="contained"
                    >
                      Next
                    </Button>
                  )}

                  {tabIndex === 3 && (
                    <Button type="submit" variant="contained">
                      Save
                    </Button>
                  )}
                  {tabIndex === 3 && (
                    <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
                  )}
                </DialogActions>
              </form>
            </DialogContent>
          </Dialog>

          {/* Edit Branch Dialog */}
          <Dialog
            open={openEdit}
            onClose={() => setOpenEdit(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>Edit Branch</DialogTitle>
            <DialogContent>
              <Tabs
                value={tabIndex}
                onChange={(e, v) => setTabIndex(v)}
                sx={{ mb: 2 }}
              >
                <Tab label="General Info" />
                <Tab label="Address" />
                <Tab label="Contact" />
                <Tab label="Additional" />
              </Tabs>
              <form onSubmit={editFormik.handleSubmit}>
                {tabIndex === 0 && (
                  <Grid container spacing={2}>
                    <Grid item xs={3}>
                      <FormControl
                        fullWidth
                        error={
                          editFormik.touched.pnCompanyId &&
                          Boolean(editFormik.errors.pnCompanyId)
                        }
                      >
                        <InputLabel shrink sx={{ color: "#000 !important" }}>
                          Company
                        </InputLabel>
                        <Select
                          name="pnCompanyId"
                          value={editFormik.values.pnCompanyId}
                          onChange={editFormik.handleChange}
                          displayEmpty
                          sx={{
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#d3d3d3",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#000",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#000",
                            },
                            "& .MuiSelect-outlined": { color: "#000" },
                            backgroundColor: "#fff",
                            borderRadius: "8px",
                          }}
                        >
                          <MenuItem value="">Select Company</MenuItem>
                          {companies.map((company) => (
                            <MenuItem
                              key={company.pnCompanyId}
                              value={company.pnCompanyId}
                            >
                              {company.CompanyName ||
                                company.companyName ||
                                "Unnamed Company"}
                            </MenuItem>
                          ))}
                        </Select>
                        {editFormik.touched.pnCompanyId &&
                          editFormik.errors.pnCompanyId && (
                            <FormHelperText style={{ color: "red" }}>
                              {editFormik.errors.pnCompanyId}
                            </FormHelperText>
                          )}
                      </FormControl>

                      {/* <FormControl fullWidth>
                        <InputLabel>Select Company</InputLabel>
                        <Select
                          name="pn_CompanyID"
                          value={editFormik.values.pn_CompanyID || ""}
                          onChange={editFormik.handleChange}
                          displayEmpty
                          sx={{
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#d3d3d3",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#000",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#000",
                            },
                            "& .MuiSelect-outlined": { color: "#000" },
                            backgroundColor: "#fff",
                            borderRadius: "8px",
                          }}
                        >
                          <MenuItem value="">Select Company</MenuItem>
                          {companies.map((company) => (
                            <MenuItem
                              key={company.pnCompanyID}
                              value={company.pnCompanyID}
                            >
                              {company.CompanyName}
                            </MenuItem>
                          ))}
                        </Select>
                        {editFormik.touched.pn_CompanyID &&
                          editFormik.errors.pn_CompanyID && (
                            <FormHelperText style={{ color: "red" }}>
                              {editFormik.errors.pn_CompanyID}
                            </FormHelperText>
                          )}
                      </FormControl> */}
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        fullWidth
                        label="Branch Code"
                        name="branchCode"
                        value={editFormik.values.branchCode}
                        onChange={editFormik.handleChange}
                        error={
                          !!editFormik.touched.branchCode &&
                          !!editFormik.errors.branchCode
                        }
                        helperText={
                          editFormik.touched.branchCode &&
                          editFormik.errors.branchCode
                        }
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        fullWidth
                        label="Branch Name"
                        name="branchName"
                        value={editFormik.values.branchName}
                        onChange={editFormik.handleChange}
                        error={
                          !!editFormik.touched.branchName &&
                          !!editFormik.errors.branchName
                        }
                        helperText={
                          editFormik.touched.branchName &&
                          editFormik.errors.branchName
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Branch User ID"
                        name="branchUserId"
                        value={editFormik.values.branchUserId}
                        onChange={editFormik.handleChange}
                        error={
                          !!editFormik.touched.branchUserId &&
                          !!editFormik.errors.branchUserId
                        }
                        helperText={
                          editFormik.touched.branchUserId &&
                          editFormik.errors.branchUserId
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Branch Password"
                        name="branchPassword"
                        type="password"
                        value={editFormik.values.branchPassword}
                        onChange={editFormik.handleChange}
                        error={
                          !!editFormik.touched.branchPassword &&
                          !!editFormik.errors.branchPassword
                        }
                        helperText={
                          editFormik.touched.branchPassword &&
                          editFormik.errors.branchPassword
                        }
                      />
                    </Grid>
                  </Grid>
                )}

                {tabIndex === 1 && (
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Address Line 1"
                        name="addressLine1"
                        value={editFormik.values.addressLine1}
                        onChange={editFormik.handleChange}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Address Line 2"
                        name="addressLine2"
                        value={editFormik.values.addressLine2}
                        onChange={editFormik.handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label={
                          <span>
                            ZipCode
                            <span
                              style={{
                                color: "red",
                                marginLeft: "0.25rem",
                              }}
                            >
                              *
                            </span>
                          </span>
                        }
                        name="ZipCode"
                        value={editFormik.values.ZipCode}
                        onChange={editFormik.handleChange}
                        // onChange={handleChange}
                        // onKeyDown={handleKeyDown}
                        // onBlur={formik.handleBlur}
                        className="custom-readonly-textfield"
                        error={
                          editFormik.touched.ZipCode &&
                          Boolean(editFormik.errors.ZipCode)
                        }
                        helperText={
                          editFormik.touched.ZipCode &&
                          editFormik.errors.ZipCode
                        }
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Autocomplete
                        options={states}
                        value={editFormik.values.state || ""}
                        onChange={(e, value) => {
                          const found = cityStateData.states.find(
                            (s) => s.state === value
                          );
                          setDistricts(found ? found.districts : []);
                          setSelectedState(value);
                          editFormik.setFieldValue("state", value || "");
                          editFormik.setFieldValue("city", "");
                        }}
                        renderInput={(params) => (
                          <TextField {...params} label="State" fullWidth />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Autocomplete
                        options={districts}
                        value={editFormik.values.city || ""}
                        onChange={(e, value) =>
                          editFormik.setFieldValue("city", value || "")
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="District / City"
                            fullWidth
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Country"
                        name="country"
                        value={editFormik.values.country || "India"}
                        onChange={(e) =>
                          editFormik.setFieldValue("country", e.target.value)
                        }
                      />
                    </Grid>
                  </Grid>
                )}

                {tabIndex === 2 && (
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Phone No"
                        name="phoneNo"
                        value={editFormik.values.phoneNo}
                        onChange={editFormik.handleChange}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Fax No"
                        name="faxNo"
                        value={editFormik.values.faxNo}
                        onChange={editFormik.handleChange}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="emailId"
                        value={editFormik.values.emailId}
                        onChange={editFormik.handleChange}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Alternate Email"
                        name="alternateEmailId"
                        value={editFormik.values.alternateEmailId}
                        onChange={editFormik.handleChange}
                      />
                    </Grid>
                  </Grid>
                )}

                {tabIndex === 3 && (
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                          name="status"
                          value={editFormik.values.status}
                          onChange={editFormik.handleChange}
                        >
                          <MenuItem value="Active">Active</MenuItem>
                          <MenuItem value="Inactive">Inactive</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Start Date"
                        name="startDate"
                        value={editFormik.values.startDate}
                        onChange={editFormik.handleChange}
                        InputLabelProps={{ shrink: true }}
                        // inputProps={{
                        //   min: new Date().toISOString().split("T")[0], // disables past dates
                        // }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      {/* <TextField
                        fullWidth
                        type="date"
                        label="End Date"
                        name="endDate"
                        value={editFormik.values.endDate}
                        onChange={editFormik.handleChange}
                        InputLabelProps={{ shrink: true }}
                      /> */}
                      <TextField
                        fullWidth
                        type="date"
                        label="End Date"
                        name="endDate"
                        value={editFormik.values.endDate}
                        onChange={editFormik.handleChange}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{
                          min: editFormik.values.startDate || "",
                        }}
                        disabled={!editFormik.values.startDate} // ✅ Disable until start date selected
                      />
                    </Grid>
                  </Grid>
                )}
                <DialogActions>
                  <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
                  <Button type="submit" variant="contained">
                    Update
                  </Button>
                </DialogActions>
              </form>
            </DialogContent>
          </Dialog>
        </Container>
      </Box>
    </Box>
  );
};
