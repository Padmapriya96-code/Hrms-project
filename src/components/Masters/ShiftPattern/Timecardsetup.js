import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Card,
  Paper,
  AppBar,
  Toolbar,
  CardContent,
} from "@mui/material";
import { FormHelperText } from '@mui/material';
import Sidenav from "../../Home Page/Sidenav";
import Navbar from "../../Home Page/Navbar";
import { postRequest } from "../../../serverconfiguration/requestcomp";
import { ServerConfig } from "../../../serverconfiguration/serverconfig";
import { REPORTS } from "../../../serverconfiguration/controllers";
import { toast } from "react-toastify";

const defaultFormData = {
  intime: "",
  early_intime: "",
  shift_lin: "",
  lunch_ein: "",
  halfday: "",
  ot_limit: "",
  permission_limit: "",
  leave_days: "",
  morning_ot: "",
  month_type: "",
  weekOff1: "",
  weekOff2: "",
  manual_days: "",
  ot_days: "",
  ot_hrs: "",
};

const TimeCardSetup = () => {
  const [formData, setFormData] = useState(defaultFormData);
  const [companyId, setCompanyId] = useState(null);
  const [branchId, setBranchId] = useState(null);
  const [monthType, setMonthType] = useState("");
  const [showManualDays, setShowManualDays] = useState(false);
  const [showWeekOffs, setShowWeekOffs] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [recordId, setRecordId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const databaseName = sessionStorage.getItem("databaseName");

  useEffect(() => {
    const fetchCompanyAndBranch = async () => {
      const isLoggedin = sessionStorage.getItem("user");

      try {
        const loggedBranchData = await postRequest(ServerConfig.url, REPORTS, {
          query: `SELECT * 
FROM [${databaseName}].[dbo].[paym_Branch] 
WHERE Branch_User_Id = '${isLoggedin}'
`,
        });

        if (loggedBranchData.data && loggedBranchData.data.length > 0) {
          const branch = loggedBranchData.data[0];
          setBranchId(branch.pn_BranchID);
          setCompanyId(branch.pn_CompanyID);
        }
      } catch (error) {
        console.error("Error fetching company and branch data:", error);
      }
    };

    fetchCompanyAndBranch();
  }, []);

  const validateForm = (name, value) => {
    const strValue = value !== undefined && value !== null ? String(value).trim() : "";

    // Fields that must be in HH:mm:ss format
    const hhmmssFields = ["intime", "early_intime", "shift_lin", "lunch_ein", "halfday", "ot_limit", "permission_limit"];

    if (hhmmssFields.includes(name)) {
      if (!strValue) return `${name.replace("_", " ")} is required`;
      
      // Validate HH:mm:ss
      if (!/^\d{2}:\d{2}:\d{2}$/.test(strValue))
        return "Use HH:mm:ss format (e.g. 09:00:00)";
      
      const [hours, minutes, seconds] = strValue.split(":").map(Number);
      if (hours < 0 || hours > 23) return "Hours must be between 00–23";
      if (minutes < 0 || minutes > 59) return "Minutes must be between 00–59";
      if (seconds < 0 || seconds > 59) return "Seconds must be between 00–59";
      return "";
    }

    switch (name) {
      case "morning_ot":
        if (!strValue) return "Morning Over Time selection is required";
        return "";

      case "leave_days":
        if (!strValue) return "Leave Days is required";
        if (!/^\d+$/.test(strValue)) return "Must be a whole number (e.g., 12)";
        const days = parseInt(strValue, 10);
        if (days < 1) return "Must be at least 1 day";
        if (days > 31) return "Cannot exceed 31 days";
        return "";

      case "ot_days":
      case "ot_hrs":
        if (!strValue) return `${name.replace("_", " ")} is required`;
        if (!/^\d*\.?\d+$/.test(strValue)) return "Must be a valid number";
        const val = parseFloat(strValue);
        if (val < 0) return "Cannot be negative";
        if (name === "ot_days" && val > 31) return "Cannot exceed 31 days/month";
        if (name === "ot_hrs" && val > 24) return "Cannot exceed 24 hours/day";
        return "";

      default:
        return "";
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setFormErrors((prev) => ({
      ...prev,
      [name]: validateForm(name, value),
    }));
  };

  useEffect(() => {
    const fetchAttendanceData = async () => {
      if (companyId && branchId) {
        try {
          const response = await postRequest(ServerConfig.url, REPORTS, {
            query: `
            SELECT [Id], [intime], [early_intime], [shift_lin], [lunch_ein], [halfday], [ot_limit], [permission_limit], [leave_days], [morning_ot], [month_type], [week_off1], [week_off2], [manual_days], [ot_days], [ot_hrs]
            FROM [${databaseName}].[dbo].[attendance_ceiling]
            WHERE pn_companyid = ${companyId} AND pn_branchid = ${branchId}
          `,
          });

          if (response.data && response.data.length > 0) {
            const latestRecord = response.data[0];
            
            // Format time values to HH:mm:ss
            const formatTimeValue = (timeValue) => {
              if (!timeValue) return "";
              if (typeof timeValue === "string") return timeValue;
              // If it's a time object from database, convert to string
              return timeValue.toString().substring(0, 8);
            };

            setFormData({
              intime: formatTimeValue(latestRecord.intime),
              early_intime: formatTimeValue(latestRecord.early_intime),
              shift_lin: formatTimeValue(latestRecord.shift_lin),
              lunch_ein: formatTimeValue(latestRecord.lunch_ein),
              halfday: formatTimeValue(latestRecord.halfday),
              ot_limit: formatTimeValue(latestRecord.ot_limit),
              permission_limit: formatTimeValue(latestRecord.permission_limit),
              leave_days: latestRecord.leave_days || "",
              morning_ot: latestRecord.morning_ot || "",
              month_type: latestRecord.month_type || "",
              weekOff1: latestRecord.week_off1 || "",
              weekOff2: latestRecord.week_off2 || "",
              manual_days: latestRecord.manual_days || "",
              ot_days: latestRecord.ot_days || "",
              ot_hrs: latestRecord.ot_hrs || "",
            });
            setRecordId(latestRecord.Id);

            setMonthType(latestRecord.month_type || "");
            setShowManualDays(latestRecord.month_type === "Manual Days");
            setShowWeekOffs(latestRecord.month_type === "Week Off Excluded Days");
          }
        } catch (error) {
          console.error("Error fetching attendance data:", error);
        }
      }
    };

    fetchAttendanceData();
  }, [companyId, branchId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    setFormErrors((prev) => ({
      ...prev,
      [name]: validateForm(name, fieldValue),
    }));
  };

  const handleReset = () => {
    setFormData(defaultFormData);
    setShowManualDays(false);
    setShowWeekOffs(false);
    setMonthType("");
    setRecordId(null);
    setFormErrors({});
  };

  const handleMonthTypeChange = (event) => {
    const type = event.target.value;
    setMonthType(type);
    setShowManualDays(false);
    setShowWeekOffs(false);
    setFormData({ ...formData, manual_days: "", weekOff1: "", weekOff2: "" });

    if (type === "Manual Days") {
      setShowManualDays(true);
    } else if (type === "Month Days") {
      const currentDate = new Date();
      const totalDays = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      ).getDate();
      setFormData({ ...formData, manual_days: totalDays });
    } else if (type === "Week Off Excluded Days") {
      setShowWeekOffs(true);
    }
  };

  const validateAllFields = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((field) => {
      const error = validateForm(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    // Validate month type specific fields
    if (monthType === "Week Off Excluded Days") {
      if (!formData.weekOff1) {
        newErrors.weekOff1 = "Week Off 1 is required";
        isValid = false;
      }
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    try {
      toast.dismiss();
      
      // Run full validation
      if (!validateAllFields()) {
        toast.error("Please fix validation errors before saving", { 
          position: "top-center", 
          autoClose: 1000 
        });
        return;
      }

      // Ensure time fields have proper format
      const formatTimeField = (timeValue) => {
        if (!timeValue) return "NULL";
        // Ensure time format is correct
        if (/^\d{2}:\d{2}:\d{2}$/.test(timeValue)) {
          return `'${timeValue}'`;
        }
        return "NULL";
      };

      const payload = {
        pn_companyid: companyId,
        pn_branchid: branchId,
        intime: formData.intime,
        early_intime: formData.early_intime,
        shift_lin: formData.shift_lin,
        lunch_ein: formData.lunch_ein,
        halfday: formData.halfday,
        ot_limit: formData.ot_limit,
        permission_limit: formData.permission_limit,
        leave_days: formData.leave_days ? parseInt(formData.leave_days) : 0,
        morning_ot: formData.morning_ot || "No",
        month_type: monthType || "Month Days",
        week_off1: formData.weekOff1 || "",
        week_off2: formData.weekOff2 || "",
        manual_days: formData.manual_days ? parseInt(formData.manual_days) : 0,
        ot_days: formData.ot_days ? parseFloat(formData.ot_days) : 0,
        ot_hrs: formData.ot_hrs ? parseFloat(formData.ot_hrs) : 0,
      };

      if (recordId) {
        // Update existing record
        await postRequest(ServerConfig.url, REPORTS, {
          query: `
            UPDATE [${databaseName}].[dbo].[attendance_ceiling]
            SET 
              intime = ${formatTimeField(payload.intime)},
              early_intime = ${formatTimeField(payload.early_intime)},
              shift_lin = ${formatTimeField(payload.shift_lin)},
              lunch_ein = ${formatTimeField(payload.lunch_ein)},
              halfday = ${formatTimeField(payload.halfday)},
              ot_limit = ${formatTimeField(payload.ot_limit)},
              permission_limit = ${formatTimeField(payload.permission_limit)},
              leave_days = ${payload.leave_days},
              morning_ot = '${payload.morning_ot}',
              month_type = '${payload.month_type}',
              week_off1 = '${payload.week_off1}',
              week_off2 = '${payload.week_off2}',
              manual_days = ${payload.manual_days},
              ot_days = ${payload.ot_days},
              ot_hrs = ${payload.ot_hrs}
            WHERE Id = ${recordId};
          `,
        });
      } else {
        // Insert new record
        await postRequest(ServerConfig.url, REPORTS, {
          query: `
            INSERT INTO [${databaseName}].[dbo].[attendance_ceiling]
              ([pn_companyid], [pn_branchid], [intime], [early_intime], [shift_lin], [lunch_ein], [halfday], [ot_limit], [permission_limit], [leave_days], [morning_ot], [month_type], [week_off1], [week_off2], [manual_days], [ot_days], [ot_hrs])
            VALUES
              (
                ${payload.pn_companyid},
                ${payload.pn_branchid},
                ${formatTimeField(payload.intime)},
                ${formatTimeField(payload.early_intime)},
                ${formatTimeField(payload.shift_lin)},
                ${formatTimeField(payload.lunch_ein)},
                ${formatTimeField(payload.halfday)},
                ${formatTimeField(payload.ot_limit)},
                ${formatTimeField(payload.permission_limit)},
                ${payload.leave_days},
                '${payload.morning_ot}',
                '${payload.month_type}',
                '${payload.week_off1}',
                '${payload.week_off2}',
                ${payload.manual_days},
                ${payload.ot_days},
                ${payload.ot_hrs}
              );
          `,
        });
      }

      toast.info("Saved successfully!", { 
        position: "top-center", 
        autoClose: 1000 
      });
      
      // Refresh data after save
      const response = await postRequest(ServerConfig.url, REPORTS, {
        query: `
          SELECT [Id], [intime], [early_intime], [shift_lin], [lunch_ein], [halfday], [ot_limit], [permission_limit], [leave_days], [morning_ot], [month_type], [week_off1], [week_off2], [manual_days], [ot_days], [ot_hrs]
          FROM [${databaseName}].[dbo].[attendance_ceiling]
          WHERE pn_companyid = ${companyId} AND pn_branchid = ${branchId}
        `,
      });

      if (response.data && response.data.length > 0) {
        const latestRecord = response.data[0];
        setRecordId(latestRecord.Id);
      }
    } catch (err) {
      console.error("Error saving data:", err);
      toast.error("Error saving data. Please check console.", { 
        position: "top-center", 
        autoClose: 1000 
      });
    }
  };

  const handleDelete = (recordId) => {
    if (!recordId) {
      toast.error("No record to delete", { position: "top-center" });
      return;
    }

    toast.info(
      <div style={{ textAlign: "center" }}>
        Are you sure you want to delete this record?
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <Button
            variant="contained"
            size="small"
            color="error"
            onClick={async () => {
              toast.dismiss();
              try {
                await postRequest(ServerConfig.url, REPORTS, {
                  query: `DELETE FROM [${databaseName}].[dbo].[attendance_ceiling] WHERE Id = ${recordId}`,
                });
                toast.error("Record deleted successfully!", {
                  position: "top-center",
                  autoClose: 1000,
                });
                handleReset();
              } catch (err) {
                console.error("Error deleting data:", err);
                toast.error("Failed to delete record", {
                  position: "top-center",
                  autoClose: 1500,
                });
              }
            }}
            style={{ minWidth: "80px" }}
          >
            Delete
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => toast.dismiss()}
            style={{ minWidth: "80px" }}
          >
            Cancel
          </Button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        toastId: "delete-confirmation",
      }
    );
  };

  return (
    <Grid container style={{ backgroundColor: '#f5f5f5' }} justifyContent="center" alignItems="center">
      <Navbar />
      <Grid item xs={12} sx={{ display: "flex" }}>
        <Sidenav />
        <Grid item xs={12} sm={10} md={9} lg={8} xl={7} style={{ margin: "100px auto" }}>
          <AppBar position="static" sx={{ width: '100%', minHeight: "60px" }}>
            <Toolbar sx={{ justifyContent: 'left', height: '100%' }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ textAlign: 'left', fontWeight: 'bold', color: 'white', lineHeight: '60px' }}
              >
                TIME ATTENDANCE & PAYROLL SETUP
              </Typography>
            </Toolbar>
          </AppBar>
          
          <Paper
            elevation={3}
            sx={{
              height: '600px',
              width: '100%',
              backgroundColor: '#fafafa',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Grid container spacing={3} alignItems="stretch">
              {/* Left Card - Attendance Time Information */}
              <Grid item xs={12} sm={6}>
                <Card sx={{ height: "100%", backgroundColor: "white" }}>
                  <CardContent>
                    <Typography variant="h6" mb={4}>
                      ATTENDANCE TIME INFORMATION
                    </Typography>

                    {["intime", "early_intime", "shift_lin", "lunch_ein", "halfday", "ot_limit", "permission_limit"].map((field) => (
                      <TextField
                        key={field}
                        label={field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(formErrors[field])}
                        helperText={formErrors[field]}
                        fullWidth
                        size="small"
                        margin="dense"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "#fff",
                            borderRadius: "10px",
                            "& fieldset": {
                              borderWidth: "2px",
                              borderRadius: "8px",
                            },
                            "&:hover fieldset": {
                              borderColor: "black",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "black",
                            },
                            "&.Mui-error fieldset": {
                              borderColor: "black",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: "black !important",
                          },
                          "& .MuiInputLabel-shrink": {
                            color: "black !important",
                          },
                          "& .Mui-focused .MuiInputLabel-root": {
                            color: "black !important",
                          },
                        }}
                      />
                    ))}

                    <TextField
                      label="Leave Days"
                      name="leave_days"
                      value={formData.leave_days}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(formErrors.leave_days)}
                      helperText={formErrors.leave_days}
                      fullWidth
                      size="small"
                      margin="dense"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#fff",
                          borderRadius: "10px",
                          "& fieldset": {
                            borderWidth: "2px",
                            borderRadius: "8px",
                          },
                          "&:hover fieldset": {
                            borderColor: "black",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "black",
                          },
                          "&.Mui-error fieldset": {
                            borderColor: "black",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "black !important",
                        },
                        "& .MuiInputLabel-shrink": {
                          color: "black !important",
                        },
                        "& .Mui-focused .MuiInputLabel-root": {
                          color: "black !important",
                        },
                      }}
                    />

                    <FormControl 
                      fullWidth 
                      size="small" 
                      margin="dense"
                      error={Boolean(formErrors.morning_ot)}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#fff",
                          borderRadius: "10px",
                          "& fieldset": {
                            borderWidth: "2px",
                            borderRadius: "8px",
                          },
                          "&:hover fieldset": {
                            borderColor: "black",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "black",
                          },
                          "&.Mui-error fieldset": {
                            borderColor: "black",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "black !important",
                        },
                        "& .MuiInputLabel-shrink": {
                          color: "black !important",
                        },
                      }}
                    >
                      <InputLabel>Morning Over Time</InputLabel>
                      <Select
                        name="morning_ot"
                        value={formData.morning_ot || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                      {formErrors.morning_ot && (
                        <FormHelperText error>{formErrors.morning_ot}</FormHelperText>
                      )}
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>

              {/* Right Card - Month Days and OT Calculation */}
              <Grid item xs={12} sm={6}>
                <Card sx={{ height: "100%", backgroundColor: "white" }}>
                  <CardContent>
                    <Typography variant="h6" mb={4}>
                      MONTH DAYS AND OVER TIME CALCULATION
                    </Typography>

                    <FormControl fullWidth size="small" margin="dense">
                      <InputLabel>Month Type</InputLabel>
                      <Select 
                        value={monthType} 
                        onChange={handleMonthTypeChange}
                        label="Month Type"
                      >
                        <MenuItem value="Manual Days">Manual Days</MenuItem>
                        <MenuItem value="Month Days">Month Days</MenuItem>
                        <MenuItem value="Week Off Excluded Days">
                          Week Off Excluded Days
                        </MenuItem>
                      </Select>
                    </FormControl>

                    {showWeekOffs && (
                      <>
                        <FormControl fullWidth size="small" margin="dense">
                          <InputLabel>Week Off 1</InputLabel>
                          <Select
                            name="weekOff1"
                            value={formData.weekOff1}
                            onChange={handleChange}
                            error={Boolean(formErrors.weekOff1)}
                          >
                            <MenuItem value="">None</MenuItem>
                            {[
                              "Saturday",
                              "Sunday",
                              "Monday",
                              "Tuesday",
                              "Wednesday",
                              "Thursday",
                              "Friday",
                            ].map((day) => (
                              <MenuItem key={day} value={day}>
                                {day}
                              </MenuItem>
                            ))}
                          </Select>
                          {formErrors.weekOff1 && (
                            <FormHelperText error>{formErrors.weekOff1}</FormHelperText>
                          )}
                        </FormControl>

                        <FormControl fullWidth size="small" margin="dense">
                          <InputLabel>Week Off 2</InputLabel>
                          <Select
                            name="weekOff2"
                            value={formData.weekOff2}
                            onChange={handleChange}
                          >
                            <MenuItem value="">None</MenuItem>
                            {[
                              "Saturday",
                              "Sunday",
                              "Monday",
                              "Tuesday",
                              "Wednesday",
                              "Thursday",
                              "Friday",
                            ].map((day) => (
                              <MenuItem key={day} value={day}>
                                {day}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </>
                    )}

                    {showManualDays && (
                      <TextField
                        label="Manual Days"
                        name="manual_days"
                        value={formData.manual_days}
                        onChange={handleChange}
                        fullWidth
                        size="small"
                        margin="dense"
                      />
                    )}

                    <TextField
                      label="OT days/month"
                      name="ot_days"
                      value={formData.ot_days}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(formErrors.ot_days)}
                      helperText={formErrors.ot_days}
                      fullWidth
                      size="small"
                      margin="dense"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#fff",
                          borderRadius: "10px",
                          "& fieldset": {
                            borderWidth: "2px",
                            borderRadius: "8px",
                          },
                          "&:hover fieldset": {
                            borderColor: "black",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "black",
                          },
                          "&.Mui-error fieldset": {
                            borderColor: "black",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "black !important",
                        },
                        "& .MuiInputLabel-shrink": {
                          color: "black !important",
                        },
                        "& .Mui-focused .MuiInputLabel-root": {
                          color: "black !important",
                        },
                      }}
                    />
                    
                    <TextField
                      label="OT hrs/day"
                      name="ot_hrs"
                      value={formData.ot_hrs}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(formErrors.ot_hrs)}
                      helperText={formErrors.ot_hrs}
                      fullWidth
                      size="small"
                      margin="dense"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#fff",
                          borderRadius: "10px",
                          "& fieldset": {
                            borderWidth: "2px",
                            borderRadius: "8px",
                          },
                          "&:hover fieldset": {
                            borderColor: "black",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "black",
                          },
                          "&.Mui-error fieldset": {
                            borderColor: "black",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "black !important",
                        },
                        "& .MuiInputLabel-shrink": {
                          color: "black !important",
                        },
                        "& .Mui-focused .MuiInputLabel-root": {
                          color: "black !important",
                        },
                      }}
                    />

                    <Box mt={2} display="flex" gap={2} justifyContent="flex-end">
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleReset}
                      >
                        Reset
                      </Button>

                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(recordId)}
                       // disabled={!recordId}
                      >
                        Delete
                      </Button>

                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                      >
                        Save
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default TimeCardSetup;