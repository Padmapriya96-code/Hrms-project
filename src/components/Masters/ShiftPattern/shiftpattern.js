import React, { useState, useEffect } from "react";
import {
  TextField,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  AppBar,
  Toolbar,
  MenuItem,
  Paper,
  Button,
  Typography,
  Grid,
  Box,
} from "@mui/material";
import Sidenav from "../../Home Page/Sidenav";
import Navbar from "../../Home Page/Navbar";
import { postRequest } from "../../../serverconfiguration/requestcomp"; // Import your postRequest function
import { ServerConfig } from "../../../serverconfiguration/serverconfig"; // Import your server config
import { SAVE, REPORTS } from "../../../serverconfiguration/controllers"; // Import your save and reports controllers
import { toast } from "react-toastify";

const ShiftPattern = () => {
  const [rows, setRows] = useState([]); // Start with an empty array
  const [newRows, setNewRows] = useState([
    // Initialize with one empty row
    {
      pn_companyid: "",
      pn_branchid: "",
      pattern_code: "",
      shifts: [
        { code: "", days: "" },
        { code: "", days: "" },
        { code: "", days: "" },
        { code: "", days: "" },
        { code: "", days: "" },
        { code: "", days: "" },
        { code: "", days: "" },
        { code: "", days: "" },
      ],
    },
  ]);

  const [isloggedin, setloggedin] = useState(sessionStorage.getItem("user"));
  const [loggedBranch, setloggedBranch] = useState([]);
  const [loggedCompany, setloggedCompany] = useState([]);
  const [shiftCodes, setShiftCodes] = useState([]); // State to store shift codes
  const databaseName = sessionStorage.getItem("databaseName");

  // Utility function to check if a value is valid for rendering
  const isValidValue = (value) => {
    return typeof value === "string" || typeof value === "number";
  };

  useEffect(() => {
    async function fetchLoggedBranch() {
      try {
        const loggedBranchData = await postRequest(ServerConfig.url, REPORTS, {
          query: `SELECT * FROM [${databaseName}].[dbo].[paym_Branch] WHERE Branch_User_Id = '${isloggedin}';`,
        });

        if (loggedBranchData.data) {
          setloggedBranch(loggedBranchData.data);
          // Dynamically set pn_BranchID based on the fetched data
          setNewRows((prevData) => {
            const updatedRows = [...prevData];
            updatedRows[0].pn_branchid = loggedBranchData.data[0].pn_BranchID; // Update the first row
            return updatedRows;
          });
        }
      } catch (error) {
        console.error("Error fetching branch data:", error);
      }
    }

    // Always fetch fresh data based on isloggedin
    if (isloggedin) {
      fetchLoggedBranch();
    }
  }, [isloggedin]);

  useEffect(() => {
    async function fetchLoggedCompany() {
      try {
        if (loggedBranch.length > 0) {
          const loggedCompanyData = await postRequest(
            ServerConfig.url,
            REPORTS,
            {
              query: `SELECT * FROM [${databaseName}].[dbo].[paym_Company] WHERE pn_CompanyID = ${loggedBranch[0].pn_CompanyID};`,
            }
          );

          if (loggedCompanyData.data) {
            setloggedCompany(loggedCompanyData.data);
            // Dynamically set pn_CompanyID based on the fetched data
            setNewRows((prevData) => {
              const updatedRows = [...prevData];
              updatedRows[0].pn_companyid =
                loggedCompanyData.data[0].pn_CompanyID; // Update the first row
              return updatedRows;
            });
          }
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    }

    // Fetch company data when loggedBranch is available
    if (loggedBranch.length > 0) {
      fetchLoggedCompany();
    }
  }, [loggedBranch]);

  // Fetch existing shift patterns from the database
  useEffect(() => {
    const fetchShiftPatterns = async () => {
      try {
        const response = await postRequest(ServerConfig.url, REPORTS, {
          query: `SELECT [pn_companyid], [pn_branchid], [pattern_code], 
                          [shift_code1], [days1], [shift_code2], [days2], 
                          [shift_code3], [days3], [shift_code4], [days4], 
                          [shift_code5], [days5], [shift_code6], [days6], 
                          [shift_code7], [days7], [shift_code8], [days8] 
                  FROM [${databaseName}].[dbo].[shift_pattern]`,
        });

        if (response.data) {
          // Filter rows based on logged-in company and branch
          const filteredRows = response.data.filter(
            (row) =>
              row.pn_companyid === loggedCompany[0]?.pn_CompanyID &&
              row.pn_branchid === loggedBranch[0]?.pn_BranchID
          );

          const fetchedRows = filteredRows.map((row) => ({
            pn_companyid: row.pn_companyid,
            pn_branchid: row.pn_branchid,
            pattern_code: row.pattern_code,
            shifts: [
              { code: row.shift_code1, days: row.days1 },
              { code: row.shift_code2, days: row.days2 },
              { code: row.shift_code3, days: row.days3 },
              { code: row.shift_code4, days: row.days4 },
              { code: row.shift_code5, days: row.days5 },
              { code: row.shift_code6, days: row.days6 },
              { code: row.shift_code7, days: row.days7 },
              { code: row.shift_code8, days: row.days8 },
            ],
          }));
          setRows(fetchedRows);
        }
      } catch (error) {
        console.error("Error fetching shift patterns:", error);
      }
    };

    fetchShiftPatterns();
  }, [loggedCompany, loggedBranch]); // Add dependencies to refetch when company or branch changes

  // Fetch shift codes based on logged-in company and branch
  useEffect(() => {
    const fetchShiftCodes = async () => {
      try {
        if (loggedCompany.length > 0 && loggedBranch.length > 0) {
          const response = await postRequest(ServerConfig.url, REPORTS, {
            query: `SELECT [shift_code] 
                    FROM [${databaseName}].[dbo].[paym_Shift] 
                    WHERE [pn_CompanyID] = ${loggedCompany[0].pn_CompanyID} 
                    AND [pn_branchid] = ${loggedBranch[0].pn_BranchID}`,
          });

          if (response.data) {
            setShiftCodes(response.data); // Store the fetched shift codes
          }
        }
      } catch (error) {
        console.error("Error fetching shift codes:", error);
      }
    };

    fetchShiftCodes();
  }, [loggedCompany, loggedBranch]); // Fetch shift codes when company or branch changes

  const handleAddRow = () => {
    // Get the last row from newRows
    const lastRow = newRows[newRows.length - 1];

    // Validate if the last row is completely filled
    if (
      lastRow &&
      (!lastRow.pn_companyid || !lastRow.pn_branchid || !lastRow.pattern_code)
    ) {
      toast.dismiss();
      toast.warning(
        "Please fill all fields in the current row before adding a new one.",
        {
          position: "top-center",
          autoClose: 1000,
        }
      );
      return;
    }

    // Add a new empty row
    const newRow = {
      pn_companyid:
        loggedCompany.length > 0 ? loggedCompany[0].pn_CompanyID : "",
      pn_branchid: loggedBranch.length > 0 ? loggedBranch[0].pn_BranchID : "",
      pattern_code: "",
      shifts: [
        { code: "", days: "" },
        { code: "", days: "" },
        { code: "", days: "" },
        { code: "", days: "" },
        { code: "", days: "" },
        { code: "", days: "" },
        { code: "", days: "" },
        { code: "", days: "" },
      ],
    };

    setNewRows((prevNewRows) => [...prevNewRows, newRow]);
  };

  const handleSave = async () => {
    // Combine existing rows with new rows
    const combinedRows = [...rows, ...newRows];

    // Validation: Check for required fields
    for (const row of combinedRows) {
      if (!row.pattern_code) {
        toast.dismiss();
        toast.error("Pattern Code is required for all rows.", {
          position: "top-center",
          autoClose: 1000,
        });
        return; // Stop execution if validation fails
      }

      // Check if at least one shift code and one days value are filled
      const hasShift = row.shifts.some((shift) => shift.code && shift.days);
      if (!hasShift) {
        toast.dismiss();
        toast.error(
          "At least one Shift Code and Days must be provided for each row.",
          {
            position: "top-center",
            autoClose: 1000,
          }
        );
        return; // Stop execution if validation fails
      }
    }

    // Fetch existing pattern codes
    const existingPatternCodes = await fetchExistingPatternCodes();

    // Check for duplicate pattern codes in new rows
    const newPatternCodes = newRows.map((row) => row.pattern_code);
    const duplicates = newPatternCodes.filter((code) =>
      existingPatternCodes.includes(code)
    );

    if (duplicates.length > 0) {
      toast.dismiss();
      toast.error("Duplicate Pattern Code found: " + duplicates.join(", "), {
        position: "top-center",
        autoClose: 1000,
      });
      // Filter out the new rows that have duplicate pattern codes
      const filteredNewRows = newRows.filter(
        (row) => !duplicates.includes(row.pattern_code)
      );
      // Combine existing rows with filtered new rows
      const finalRowsToInsert = [...rows, ...filteredNewRows];

      // Construct SQL insert queries for each row
      const queries = finalRowsToInsert
        .map((row) => {
          const values = [
            row.pn_companyid,
            row.pn_branchid,
            `'${row.pattern_code}'`, // Enclose pattern_code in quotes
            ...row.shifts.flatMap((shift) => [
              shift.code ? `'${shift.code}'` : "NULL", // Use NULL for empty shift codes
              shift.days ? shift.days : "NULL", // Use NULL for empty days
            ]),
          ];
          return `
              INSERT INTO [${databaseName}].[dbo].[shift_pattern] (
                  [pn_companyid], [pn_branchid], [pattern_code],
                  [shift_code1], [days1], [shift_code2], [days2],
                  [shift_code3], [days3], [shift_code4], [days4],
                  [shift_code5], [days5], [shift_code6], [days6],
                  [shift_code7], [days7], [shift_code8], [days8]
              ) VALUES (
                  ${values.join(", ")}
              )
          `;
        })
        .join("; "); // Join all queries with a semicolon

      console.log("SQL Queries:", queries); // Log the constructed queries

      try {
        // Make API call
        const response = await postRequest(ServerConfig.url, SAVE, {
          query: queries,
        });

        if (response && response.status === 200) {
          toast.dismiss();
          toast.info("Shift patterns saved successfully!", {
            position: "top-center",
            autoClose: 1000,
          });
          setRows([...finalRowsToInsert]); // Update the rows state
          setNewRows([
            // Reset newRows to have one empty row after saving
            {
              pn_companyid:
                loggedCompany.length > 0 ? loggedCompany[0].pn_CompanyID : "",
              pn_branchid:
                loggedBranch.length > 0 ? loggedBranch[0].pn_BranchID : "",
              pattern_code: "",
              shifts: Array(8).fill({ code: "", days: "" }), // Create 8 empty shifts
            },
          ]);
        } else {
          toast.dismiss();
          toast.error("Failed to save data", {
            position: "top-center",
            autoClose: 1000,
          });
        }
      } catch (error) {
        toast.dismiss();
        console.error("An error occurred:", error);
        toast.error("An error occurred: " + error.message, {
          position: "top-center",
          autoClose: 1000,
        });
      }
    } else {
      // If no duplicates, proceed with saving all new rows
      const queries = newRows
        .map((row) => {
          const values = [
            row.pn_companyid,
            row.pn_branchid,
            `'${row.pattern_code}'`, // Enclose pattern_code in quotes
            ...row.shifts.flatMap((shift) => [
              shift.code ? `'${shift.code}'` : "NULL", // Use NULL for empty shift codes
              shift.days ? shift.days : "NULL", // Use NULL for empty days
            ]),
          ];
          return `
              INSERT INTO [${databaseName}].[dbo].[shift_pattern] (
                  [pn_companyid], [pn_branchid], [pattern_code],
                  [shift_code1], [days1], [shift_code2], [days2],
                  [shift_code3], [days3], [shift_code4], [days4],
                  [shift_code5], [days5], [shift_code6], [days6],
                  [shift_code7], [days7], [shift_code8], [days8]
              ) VALUES (
                  ${values.join(", ")}
              )
          `;
        })
        .join("; "); // Join all queries with a semicolon

      console.log("SQL Queries:", queries); // Log the constructed queries

      try {
        // Make API call
        const response = await postRequest(ServerConfig.url, SAVE, {
          query: queries,
        });

        if (response && response.status === 200) {
          toast.dismiss();
          toast.info("Shift patterns saved successfully!", {
            position: "top-center",
            autoClose: 1000,
          });
          setRows([...rows, ...newRows]); // Update the rows state
          setNewRows([
            // Reset newRows to have one empty row after saving
            {
              pn_companyid:
                loggedCompany.length > 0 ? loggedCompany[0].pn_CompanyID : "",
              pn_branchid:
                loggedBranch.length > 0 ? loggedBranch[0].pn_BranchID : "",
              pattern_code: "",
              shifts: Array(8).fill({ code: "", days: "" }), // Create 8 empty shifts
            },
          ]);
        } else {
          toast.error("Failed to save data", {
            position: "top-center",
            autoClose: 1000,
          });
        }
      } catch (error) {
        console.error("An error occurred:", error);
        toast.error("An error occurred: " + error.message, {
          position: "top-center",
          autoClose: 1000,
        });
      }
    }
  };

  const fetchExistingPatternCodes = async () => {
    try {
      const response = await postRequest(ServerConfig.url, REPORTS, {
        query: `SELECT pattern_code FROM [${databaseName}].[dbo].[shift_pattern] WHERE pn_companyid = ${loggedCompany[0].pn_CompanyID} AND pn_branchid = ${loggedBranch[0].pn_BranchID}`,
      });

      if (response.data) {
        return response.data.map((row) => row.pattern_code);
      }
    } catch (error) {
      console.error("Error fetching existing pattern codes:", error);
    }
    return [];
  };

  const handleReset = () => {
    setRows([]); // Reset the rows to an empty array
    setNewRows([
      // Reset new rows to have one empty row
      {
        pn_companyid:
          loggedCompany.length > 0 ? loggedCompany[0].pn_CompanyID : "",
        pn_branchid: loggedBranch.length > 0 ? loggedBranch[0].pn_BranchID : "",
        pattern_code: "",
        shifts: [
          { code: "", days: "" },
          { code: "", days: "" },
          { code: "", days: "" },
          { code: "", days: "" },
          { code: "", days: "" },
          { code: "", days: "" },
          { code: "", days: "" },
          { code: "", days: "" },
        ],
      },
    ]);
  };

  const handleEdit = (index) => {
    // Set the row at the specified index to editable
    const updatedRows = [...rows];
    updatedRows[index].isEditable = true; // Mark the row as editable
    setRows(updatedRows);
  };

  const handleUpdate = async (index) => {
    const rowToUpdate = rows[index];
    const { pn_companyid, pn_branchid, pattern_code, shifts } = rowToUpdate;

    // Construct the SQL UPDATE query
    const updateQuery = `
      UPDATE [${databaseName}].[dbo].[shift_pattern]
      SET 
        pattern_code = '${pattern_code}',
        shift_code1 = '${shifts[0].code}', days1 = ${shifts[0].days},
        shift_code2 = '${shifts[1].code}', days2 = ${shifts[1].days},
        shift_code3 = '${shifts[2].code}', days3 = ${shifts[2].days},
        shift_code4 = '${shifts[3].code}', days4 = ${shifts[3].days},
        shift_code5 = '${shifts[4].code}', days5 = ${shifts[4].days},
        shift_code6 = '${shifts[5].code}', days6 = ${shifts[5].days},
        shift_code7 = '${shifts[6].code}', days7 = ${shifts[6].days},
        shift_code8 = '${shifts[7].code}', days8 = ${shifts[7].days}
      WHERE 
        pn_companyid = ${pn_companyid} AND pn_branchid = ${pn_branchid} AND pattern_code = '${pattern_code}';
    `;

    try {
      const response = await postRequest(ServerConfig.url, SAVE, {
        query: updateQuery,
      });

      if (response.status === 200) {
        toast.dismiss();
        toast.success("Shift pattern updated successfully!", {
          position: "top-center",
          autoClose: 1000,
        });
        // Optionally, you can refresh the rows or set isEditable to false
        const updatedRows = [...rows];
        updatedRows[index].isEditable = false; // Mark the row as not editable
        setRows(updatedRows);
      } else {
        toast.dismiss();
        toast.error("Failed to update shift pattern.", {
          position: "top-center",
          autoClose: 1000,
        });
      }
    } catch (error) {
      console.error("Error updating shift pattern:", error);
      toast.dismiss();
      toast.error("An error occurred while updating the shift pattern.", {
        position: "top-center",
        autoClose: 1000,
      });
    }
  };

  const handleDelete = async (index) => {
    const rowToDelete = rows[index];
    const { pn_companyid, pn_branchid, pattern_code } = rowToDelete;

    // Construct the SQL DELETE query
    const deleteQuery = `
      DELETE FROM [${databaseName}].[dbo].[shift_pattern]
      WHERE 
        pn_companyid = ${pn_companyid} AND pn_branchid = ${pn_branchid} AND pattern_code = '${pattern_code}';
    `;

    try {
      const response = await postRequest(ServerConfig.url, SAVE, {
        query: deleteQuery,
      });
      if (response.status === 200) {
        toast.dismiss();
        toast.error("Shift pattern deleted successfully!", {
          position: "top-center",
          autoClose: 1000,
        });
        // Remove the row from the state
        const updatedRows = rows.filter((_, idx) => idx !== index);
        setRows(updatedRows);
      } else {
        toast.dismiss();
        toast.error("Failed to delete shift pattern.", {
          position: "top-center",
          autoClose: 1000,
        });
      }
    } catch (error) {
      console.error("Error deleting shift pattern:", error);
      toast.dismiss();
      toast.error("An error occurred while deleting the shift pattern.", {
        position: "top-center",
        autoClose: 1000,
      });
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "100vh", margin: 0 }}
    >
      <div style={{ backgroundColor: "#f5f5f5", width: "100%" }}>
        <Navbar />
        <Box height={30} />
        <Box sx={{ display: "flex" }}>
          <Sidenav />
          <Grid
            item
            xs={12}
            sm={12}
            md={11}
            lg={10}
            xl={9}
            style={{ margin: "0 auto", padding: "20px" }}
          >
            <div>
              <AppBar
                position="sticky"
                color="default"
                elevation={2}
                sx={{
                  backgroundColor: "#0077d4",
                  color: "white",
                  marginTop: "35px",
                }}
              >
                <Toolbar sx={{ justifyContent: "center" }}>
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{ fontWeight: "bold", textAlign: "left", flexGrow: 1 }}
                  >
                    SHIFT PATTERN
                  </Typography>
                </Toolbar>
              </AppBar>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead style={{ backgroundColor: "#efefef" }}>
                    <TableRow>
                      <TableCell>Pattern Code</TableCell>
                      {[...Array(8)].map((_, i) => (
                        <React.Fragment key={i}>
                          <TableCell>Shift Code {i + 1}</TableCell>
                          <TableCell>Days {i + 1}</TableCell>
                        </React.Fragment>
                      ))}
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {row.isEditable ? (
                            <TextField
                              value={row.pattern_code}
                              onChange={(e) => {
                                const updatedRows = [...rows];
                                updatedRows[index].pattern_code =
                                  e.target.value;
                                setRows(updatedRows);
                              }}
                            />
                          ) : isValidValue(row.pattern_code) ? (
                            row.pattern_code
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        {row.shifts.map((shift, shiftIndex) => (
                          <React.Fragment key={`shift-${index}-${shiftIndex}`}>
                            <TableCell>
                              {row.isEditable ? (
                                <Select
                                  value={shift.code}
                                  onChange={(e) => {
                                    const updatedShifts = [...row.shifts];
                                    updatedShifts[shiftIndex].code =
                                      e.target.value;
                                    const updatedRows = [...rows];
                                    updatedRows[index].shifts = updatedShifts;
                                    setRows(updatedRows);
                                  }}
                                >
                                  {shiftCodes.map((code, idx) => (
                                    <MenuItem key={idx} value={code.shift_code}>
                                      {code.shift_code}
                                    </MenuItem>
                                  ))}
                                </Select>
                              ) : isValidValue(shift.code) ? (
                                shift.code
                              ) : (
                                "-"
                              )}
                            </TableCell>
                            <TableCell>
                              {row.isEditable ? (
                                <TextField
                                  value={shift.days}
                                  onChange={(e) => {
                                    const updatedShifts = [...row.shifts];
                                    updatedShifts[shiftIndex].days =
                                      e.target.value;
                                    const updatedRows = [...rows];
                                    updatedRows[index].shifts = updatedShifts;
                                    setRows(updatedRows);
                                  }}
                                />
                              ) : isValidValue(shift.days) ? (
                                shift.days
                              ) : (
                                "-"
                              )}
                            </TableCell>
                          </React.Fragment>
                        ))}

                        <TableCell>
                          {row.isEditable ? (
                            <Button onClick={() => handleUpdate(index)}>
                              Update
                            </Button>
                          ) : (
                            <>
                              <Button onClick={() => handleEdit(index)}>
                                Edit
                              </Button>
                              <Button
                                color="error"
                                onClick={() => handleDelete(index)}
                              >
                                Delete
                              </Button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {newRows.map((newRow, rowIndex) => (
                      <TableRow key={`new-row-${rowIndex}`}>
                        <TableCell>
                          <TextField
                            size="small"
                            value={newRow.pattern_code}
                            onChange={(e) => {
                              const updatedNewRows = [...newRows];
                              updatedNewRows[rowIndex].pattern_code =
                                e.target.value;
                              setNewRows(updatedNewRows);
                            }}
                            style={{ width: "50px" }}
                          />
                        </TableCell>
                        {newRow.shifts.map((shift, index) => (
                          <React.Fragment
                            key={`new-shift-${rowIndex}-${index}`}
                          >
                            <TableCell>
                              <Select
                                size="small"
                                value={shift.code}
                                onChange={(e) => {
                                  const updatedShifts = [...newRow.shifts];
                                  updatedShifts[index].code = e.target.value;
                                  const updatedNewRows = [...newRows];
                                  updatedNewRows[rowIndex].shifts =
                                    updatedShifts;
                                  setNewRows(updatedNewRows);
                                }}
                              >
                                {shiftCodes.map((code, idx) => (
                                  <MenuItem key={idx} value={code.shift_code}>
                                    {code.shift_code}
                                  </MenuItem>
                                ))}
                              </Select>
                            </TableCell>
                            <TableCell>
                              <TextField
                                size="small"
                                value={shift.days}
                                onChange={(e) => {
                                  const updatedShifts = [...newRow.shifts];
                                  updatedShifts[index].days = e.target.value;
                                  const updatedNewRows = [...newRows];
                                  updatedNewRows[rowIndex].shifts =
                                    updatedShifts;
                                  setNewRows(updatedNewRows);
                                }}
                                style={{ width: "50px" }}
                              />
                            </TableCell>
                          </React.Fragment>
                        ))}
                        <TableCell>
                          <Button
                            color="error"
                            onClick={() => {
                              const updatedNewRows = newRows.filter(
                                (_, idx) => idx !== rowIndex
                              );
                              setNewRows(updatedNewRows);
                            }}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box mt={2} display="flex" justifyContent="flex-end">
                <Button variant="contained" onClick={handleAddRow}>
                  ADD
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  style={{ marginLeft: "10px" }} // Add margin to separate buttons
                >
                  Save
                </Button>
                {/* <Button
    variant="contained"
    color="error"
    onClick={handleReset}
    style={{ marginLeft: "10px" }} // Add margin to separate buttons
  >
    Reset
  </Button> */}
              </Box>
            </div>
          </Grid>
        </Box>
      </div>
    </Grid>
  );
};

export default ShiftPattern;
