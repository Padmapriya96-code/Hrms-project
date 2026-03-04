import React, { useState, useEffect } from "react";
import {
  Grid,
  AppBar,
  Toolbar,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import Sidenav from "../../Home Page/Sidenav";
import Navbar from "../../Home Page/Navbar";
import { postRequest } from "../../../serverconfiguration/requestcomp";
import { ServerConfig } from "../../../serverconfiguration/serverconfig";
import { SAVE, REPORTS } from "../../../serverconfiguration/controllers";
import { toast } from 'react-toastify';

import { useNavigate } from "react-router-dom";

const ReaderMaster = () => {
  const [readers, setReaders] = useState([]);
  const [newReader, setNewReader] = useState({
    pn_CompanyID: "",
    Pn_BranchID: "",
    ReaderNo: "",
    IPAddress: "",
    Location: "",
  });
  const [isloggedin, setloggedin] = useState(sessionStorage.getItem("user"));
  const [loggedBranch, setloggedBranch] = useState([]);
  const [loggedCompany, setloggedCompany] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  // Utility function to check if a value is valid for rendering
  const isValidValue = (value) => {
    return value !== null && value !== undefined && value !== "";
  };

  // Fetch logged in branch data
  useEffect(() => {
    async function fetchLoggedBranch() {
      try {
        const loggedBranchData = await postRequest(ServerConfig.url, REPORTS, {
          query: `select * from paym_Branch where Branch_User_Id = '${isloggedin}'`,
        });

        if (loggedBranchData.data) {
          setloggedBranch(loggedBranchData.data);
          setNewReader((prev) => ({
            ...prev,
            Pn_BranchID: loggedBranchData.data[0]?.pn_BranchID || "",
          }));
        }
      } catch (error) {
        console.error("Error fetching branch data:", error);
      }
    }

    if (isloggedin) {
      fetchLoggedBranch();
    }
  }, [isloggedin]);

  // Fetch logged in company data
  useEffect(() => {
    async function fetchLoggedCompany() {
      try {
        if (loggedBranch.length > 0) {
          const loggedCompanyData = await postRequest(
            ServerConfig.url,
            REPORTS,
            {
              query: `select * from paym_Company where pn_CompanyID = ${loggedBranch[0].pn_CompanyID}`,
            }
          );

          if (loggedCompanyData.data) {
            setloggedCompany(loggedCompanyData.data);
            setNewReader((prev) => ({
              ...prev,
              pn_CompanyID: loggedCompanyData.data[0]?.pn_CompanyID || "",
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    }

    if (loggedBranch.length > 0) {
      fetchLoggedCompany();
    }
  }, [loggedBranch]);

  // Fetch readers data
  useEffect(() => {
    const fetchReaders = async () => {
      try {
        if (loggedCompany.length > 0 && loggedBranch.length > 0) {
          const response = await postRequest(ServerConfig.url, REPORTS, {
            query: `SELECT [SlNo], [pn_CompanyID], [Pn_BranchID], [ReaderNo], [IPAddress], [Location]
                    FROM [dbo].[Reader]
                    WHERE [pn_CompanyID] = ${loggedCompany[0].pn_CompanyID}
                    AND [Pn_BranchID] = ${loggedBranch[0].pn_BranchID}`,
          });

          if (response.data) {
            setReaders(response.data);
          } else {
            setReaders([]);
          }
        }
      } catch (error) {
        console.error("Error fetching readers:", error);
        setReaders([]);
      }
    };

    fetchReaders();
  }, [loggedCompany, loggedBranch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReader((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
// ✅ Utility function to validate any IPv4 or IPv6 address
const isValidIP = (ip) => {
  // IPv4 → matches 0.0.0.0 to 255.255.255.255
  const ipv4Regex =
    /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

  // IPv6 → supports full, compressed (::), loopback (::1), and link-local (fe80::)
  const ipv6Regex =
    /^(([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}|(([0-9A-Fa-f]{1,4}:){1,7}:)|(([0-9A-Fa-f]{1,4}:){1,6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,5}(:[0-9A-Fa-f]{1,4}){1,2})|(([0-9A-Fa-f]{1,4}:){1,4}(:[0-9A-Fa-f]{1,4}){1,3})|(([0-9A-Fa-f]{1,4}:){1,3}(:[0-9A-Fa-f]{1,4}){1,4})|(([0-9A-Fa-f]{1,4}:){1,2}(:[0-9A-Fa-f]{1,4}){1,5})|([0-9A-Fa-f]{1,4}:((:[0-9A-Fa-f]{1,4}){1,6}))|(:((:[0-9A-Fa-f]{1,4}){1,7}|:)))(%.+)?$/;

  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
};


// ✅ Save Reader (Insert / Update with Duplicate Check)
const handleSaveReader = async () => {
   toast.dismiss();
  // Validation
  if (!newReader.ReaderNo || !newReader.IPAddress || !newReader.Location) {
    toast.warning("Please fill all required fields", {
      position: "top-center",
      autoClose: 1500,
    });
    return;
  }
  if (!isValidIP(newReader.IPAddress)) {
    toast.error(" Invalid IP Address.", {
      position: "top-center",
      autoClose: 2000,
    });
    return;
  }
  try {
    // 🔍 Check for duplicates
    const duplicateQuery = `
      SELECT COUNT(*) AS count
      FROM [dbo].[Reader]
      WHERE [pn_CompanyID] = ${newReader.pn_CompanyID}
        AND [Pn_BranchID] = ${newReader.Pn_BranchID}
        AND (
          [ReaderNo] = '${newReader.ReaderNo}'
          OR [IPAddress] = '${newReader.IPAddress}'
        )
        ${editingId ? `AND [SlNo] <> ${editingId}` : ""}
    `;

    const duplicateCheck = await postRequest(ServerConfig.url, REPORTS, {
      query: duplicateQuery,
    });

    if (duplicateCheck?.data?.[0]?.count > 0) {
      toast.error(
        "Duplicate Reader No or IP Address exists. Please use unique values.",
        { position: "top-center", autoClose: 2000 }
      );
      return;
    }

    // ✅ Build query (Insert / Update)
    let query;
    if (editingId) {
      query = `
        UPDATE [dbo].[Reader]
        SET 
          [ReaderNo] = '${newReader.ReaderNo}',
          [IPAddress] = '${newReader.IPAddress}',
          [Location] = '${newReader.Location}'
        WHERE 
          [SlNo] = ${editingId}
          AND [pn_CompanyID] = ${newReader.pn_CompanyID}
          AND [Pn_BranchID] = ${newReader.Pn_BranchID}
      `;
    } else {
      query = `
        INSERT INTO [dbo].[Reader]
          ([pn_CompanyID], [Pn_BranchID], [ReaderNo], [IPAddress], [Location])
        VALUES
          (${newReader.pn_CompanyID}, 
           ${newReader.Pn_BranchID}, 
           '${newReader.ReaderNo}', 
           '${newReader.IPAddress}', 
           '${newReader.Location}')
      `;
    }

    const response = await postRequest(ServerConfig.url, SAVE, { query });

    if (response && response.status === 200) {
      toast.success(
        editingId ? "Reader updated successfully!" : "Reader saved successfully!",
        { position: "top-center", autoClose: 1500 }
      );

      // 🔄 Refresh readers list
      const refreshResponse = await postRequest(ServerConfig.url, REPORTS, {
        query: `SELECT [SlNo], [pn_CompanyID], [Pn_BranchID], [ReaderNo], [IPAddress], [Location]
                FROM [dbo].[Reader]
                WHERE [pn_CompanyID] = ${loggedCompany[0].pn_CompanyID}
                AND [Pn_BranchID] = ${loggedBranch[0].pn_BranchID}`,
      });

      if (refreshResponse.data) {
        setReaders(refreshResponse.data);
      }

      // ♻️ Reset form after save/update
      setNewReader({
        pn_CompanyID: loggedCompany[0]?.pn_CompanyID || "",
        Pn_BranchID: loggedBranch[0]?.pn_BranchID || "",
        ReaderNo: "",
        IPAddress: "",
        Location: "",
      });
      setEditingId(null);
    } else {
      toast.error("Failed to save reader data", {
        position: "top-center",
        autoClose: 1500,
      });
    }
  } catch (error) {
    console.error("Error saving reader:", error);
    toast.error("An error occurred: " + error.message, {
      position: "top-center",
      autoClose: 2000,
    });
  }
};

// ✅ Edit Reader (Load values into form)
const handleEditReader = (reader) => {
  setNewReader({
    pn_CompanyID: reader.pn_CompanyID, // must match DB column
    Pn_BranchID: reader.Pn_BranchID,   // must match DB column
    ReaderNo: reader.ReaderNo,
    IPAddress: reader.IPAddress,
    Location: reader.Location,
  });
  setEditingId(reader.SlNo);
};

const handleDeleteReader = async (id) => {
  // clear any previous toasts
  toast.dismiss();

  toast.info(
    <div style={{ textAlign: "center" }}>
      <p>Are you sure you want to delete this reader?</p>
      <div
        style={{
          marginTop: "10px",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={async () => {
            toast.dismiss(); // close confirm toast

            try {
              const response = await postRequest(ServerConfig.url, SAVE, {
                query: `DELETE FROM [dbo].[Reader] 
                        WHERE [SlNo] = ${id}
                        AND [pn_CompanyID] = ${loggedCompany[0].pn_CompanyID}
                        AND [Pn_BranchID] = ${loggedBranch[0].pn_BranchID}`,
              });

              if (response && response.status === 200) {
                toast.error("Data deleted successfully!", {
                  position: "top-center",
                  autoClose: 1500,
                });

                // Refresh list
                const refreshResponse = await postRequest(
                  ServerConfig.url,
                  REPORTS,
                  {
                    query: `SELECT [SlNo], [pn_CompanyID], [Pn_BranchID], [ReaderNo], [IPAddress], [Location]
                            FROM [dbo].[Reader]
                            WHERE [pn_CompanyID] = ${loggedCompany[0].pn_CompanyID}
                            AND [Pn_BranchID] = ${loggedBranch[0].pn_BranchID}`,
                  }
                );

                if (refreshResponse.data) {
                  setReaders(refreshResponse.data);
                }
              } else {
                toast.error("❌ Failed to delete reader", {
                  position: "top-center",
                  autoClose: 2000,
                });
              }
            } catch (error) {
              console.error("Error deleting reader:", error);
              toast.error("⚠️ An error occurred while deleting the reader.", {
                position: "top-center",
                autoClose: 2000,
              });
            }
          }}
        >
          Yes
        </Button>

        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={() => toast.dismiss()}
        >
          No
        </Button>
      </div>
    </div>,
    {
      position: "top-center",
      autoClose: false, // don't close until user clicks Yes/No
      closeOnClick: false,
      draggable: false,
    }
  );
};

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelecteds = readers.map((reader) => reader.SlNo);
      setSelectedRows(newSelecteds);
      return;
    }
    setSelectedRows([]);
  };

  const handleSelectRow = (event, id) => {
    const selectedIndex = selectedRows.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRows, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = newSelected.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1)
      );
    }

    setSelectedRows(newSelected);
  };

  const handleConnectDownload = () => {
    alert("Connect & Download functionality would be implemented here");
  };

  const handleDisconnect = () => {
    alert("Disconnect functionality would be implemented here");
  };

  const navigate = useNavigate();

  return (
    <Grid container sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Navbar />
      <Grid item xs={12} sx={{ display: "flex" }}>
        <Sidenav />
        <Grid item xs={12} sm={10} md={9} lg={11} xl={10} sx={{ p: 3 }}>
          <AppBar position="static" sx={{ backgroundColor: "#1976d2", mt: 10 }}>
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
                READER MASTER
              </Typography>
            </Toolbar>
          </AppBar>

     <Paper
  elevation={3}
  sx={{
    p: 2,                    // padding
    mt: 2,                   // margin top
   // width: '1000px',           // increased fixed width
    maxWidth: '100%',          // responsive max width
    margin: '0 auto',         // center horizontally
    display: 'flex',          // flex layout
    gap: 2,                   // spacing between buttons
    flexWrap: 'wrap',         // wrap buttons on smaller screens
  }}
>
  <Button
    variant="contained"
    color="success"
    onClick={handleConnectDownload}
  >
    Connect & Download
  </Button>

  <Button
    variant="contained"
    color="secondary"
    onClick={() => navigate("/ReaderAttendance")}
  >
    Go to Reader Attendance
  </Button>

  <Button
    variant="contained"
    color="error"
    onClick={handleDisconnect}
  >
    Disconnect
  </Button>
</Paper>


       <Grid container columnSpacing={0} rowSpacing={2}>
            <Grid item xs={12} md={8}>
                <Box
  sx={{
    display: "flex",
    justifyContent: "flex-start", // aligns horizontally to start (left)
    alignItems: "flex-start",     // aligns vertically to top
    mb: 10, 
                           // optional margin-top
  }}
>
              <TableContainer component={Paper}  sx={{
    borderRadius: 0,   // 8px rounded corners
    overflow: "hidden" // ensures the table content follows the rounded shape
  }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          indeterminate={
                            selectedRows.length > 0 &&
                            selectedRows.length < readers.length
                          }
                          checked={
                            readers.length > 0 &&
                            selectedRows.length === readers.length
                          }
                          onChange={handleSelectAll}
                        />
                      </TableCell>
                      <TableCell>Reader No</TableCell>
                      <TableCell>IP Address</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {readers.length > 0 ? (
                      readers.map((reader) => (
                        <TableRow key={reader.SlNo}>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedRows.indexOf(reader.SlNo) !== -1}
                              onChange={(event) =>
                                handleSelectRow(event, reader.SlNo)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            {isValidValue(reader.ReaderNo)
                              ? reader.ReaderNo
                              : ""}
                          </TableCell>
                          <TableCell>
                            {isValidValue(reader.IPAddress)
                              ? reader.IPAddress
                              : ""}
                          </TableCell>
                          <TableCell>
                            {isValidValue(reader.Location)
                              ? reader.Location
                              : ""}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              color="primary"
                              onClick={() => handleEditReader(reader)}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => handleDeleteReader(reader.SlNo)}
                            >
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          No records found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 2 , borderRadius: 0,   // 8px rounded corners
    overflow: "hidden" }}>
                <Typography variant="h6" gutterBottom>
                  {editingId ? "Edit Reader" : "Add New Reader"}
                </Typography>
                <TextField
                  label="Reader No"
                  name="ReaderNo"
                  value={newReader.ReaderNo}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                     className="custom-readonly-textfield"
                />
                <TextField
                  label="IP Address"
                  name="IPAddress"
                  value={newReader.IPAddress}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                     className="custom-readonly-textfield"
                />
                <TextField
                  label="Location"
                  name="Location"
                  value={newReader.Location}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                     className="custom-readonly-textfield"
                />
                <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
         <Button
  variant="contained"
  color="info"
  onClick={() =>
    handleSaveReader(
      newReader,
      readers,
      setReaders,
      setNewReader,
      editingId,
      setEditingId
    )
  }
  fullWidth
>
  {editingId ? "Update" : "Save"}
</Button>

                  {editingId && (
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => {
                        setNewReader({
                          pn_CompanyID: loggedCompany[0]?.pn_CompanyID || "",
                          Pn_BranchID: loggedBranch[0]?.pn_BranchID || "",
                          ReaderNo: "",
                          IPAddress: "",
                          Location: "",
                        });
                        setEditingId(null);
                      }}
                      fullWidth
                    >
                      Cancel
                    </Button>
                  )}
                </Box>
              </Paper>
            </Grid>
            
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ReaderMaster;
