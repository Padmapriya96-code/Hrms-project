import { useEffect, useState } from "react";
import { Checkbox, Card, Button, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { motion } from "framer-motion";
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import { postRequest } from "../../../serverconfiguration/requestcomp";
import { ServerConfig } from "../../../serverconfiguration/serverconfig";
import { REPORTS, SAVE } from "../../../serverconfiguration/controllers";

export default function LeaveSandwiching() {
  const [weekendDays, setWeekendDays] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [includeHolidays, setIncludeHolidays] = useState(false);
  const [companyId, setCompanyId] = useState([]);
  const [branch, setBranch] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(''); // State for selected branch
  const [isloggedin, setIsloggedin] = useState(sessionStorage.getItem('user'));
  const [existingSettings, setExistingSettings] = useState(null); // State to hold existing settings

  useEffect(() => {
    async function getData() {
      try {
        const companyData = await postRequest(ServerConfig.url, REPORTS, {
          query: `select pn_CompanyID from paym_company where Company_User_Id = '${isloggedin}'`
        });
        setCompanyId(companyData.data);

        if (companyData.data && companyData.data.length > 0) {
          const companyId = companyData.data[0].pn_CompanyID;
          const branchData = await postRequest(ServerConfig.url, REPORTS, {
            query: `select * from paym_Branch where pn_CompanyID = ${companyId}`
          });
          setBranch(branchData.data);

          // Fetch existing LeaveSandwichingSettings for the company and branch
          const settingsData = await postRequest(ServerConfig.url, REPORTS, {
            query: `select * from LeaveSandwichingSettings where pn_CompanyID = ${companyId} and pn_BranchID = ${selectedBranch}`
          });

          if (settingsData && settingsData.data.length > 0) {
            setExistingSettings(settingsData.data[0]);
            setWeekendDays(settingsData.data[0].weekend_days.split(", "));
            setSelectedDays(settingsData.data[0].selected_days.split(", "));
            setIncludeHolidays(settingsData.data[0].Include_PaidLeaves);
          }
        }
      } catch (error) {
        console.error("Error Fetching Data", error);
      }
    }
    if (isloggedin) {
      getData();
    }
  }, [isloggedin, selectedBranch]);

  useEffect(() => {
    console.log("CompanyId:", companyId);
    console.log("Branch:", branch);
  }, [companyId, branch]);

  const allDays = ["Thursday", "Friday", "Saturday", "Sunday", "Monday", "Tuesday"];

  const toggleWeekend = (day) => {
    setWeekendDays((prev) => {
      if (day === "Saturday & Sunday") {
        return prev.includes(day) ? [] : ["Saturday & Sunday"];
      } else if (day === "Sunday") {
        return prev.includes(day) ? [] : ["Sunday"];
      } else {
        return prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day];
      }
    });
  };

  useEffect(() => {
    console.log("Include Holidays State:", includeHolidays);
  }, [includeHolidays]);

  const fetchSettings = async () => {
    if (companyId.length > 0 && selectedBranch) {
      try {
        const settingsData = await postRequest(ServerConfig.url, REPORTS, {
          query: `SELECT * FROM LeaveSandwichingSettings WHERE pn_CompanyID = ${companyId[0].pn_CompanyID} AND pn_BranchID = ${selectedBranch}`
        });
  console.log("SettingsData", settingsData.data)
        if (settingsData && settingsData.data.length > 0) {
          setExistingSettings(settingsData.data[0]);
          setWeekendDays(settingsData.data[0].weekend_days.split(", "));
          setSelectedDays(settingsData.data[0].selected_days.split(", "));
          setIncludeHolidays(settingsData.data[0].Include_PaidLeaves);
        } else {
          // Reset settings if no data found
          setExistingSettings(null);
          setWeekendDays([]);
          setSelectedDays([]);
          setIncludeHolidays(false);
        }
      } catch (error) {
        console.error("Error fetching settings", error);
      }
    }
  };

  useEffect(() => {
    if (selectedBranch) {
      fetchSettings();
    }
  }, [selectedBranch]);

  const handleSave = async () => {
    const weekendDaysString = weekendDays.join(', ');  // Convert array to comma-separated string
    const selectedDaysString = selectedDays.join(', ');  // Convert array to comma-separated string
    const includePaidLeaves = includeHolidays ? 1 : 0;
    const createdAt = new Date().toISOString();  // Get the current datetime in ISO format
  
    try {
      if (existingSettings) {
        // If data exists, update the record
        await postRequest(ServerConfig.url, SAVE, {
          "query": 
            `UPDATE [dbo].[LeaveSandwichingSettings]
            SET
              [weekend_days] = '${weekendDaysString}',
              [selected_days] = '${selectedDaysString}',
                [Include_PaidLeaves] = ${includePaidLeaves},
                   [created_at] = '${createdAt}'
            WHERE [pn_CompanyID] = ${companyId[0].pn_CompanyID} AND [pn_BranchID] = ${selectedBranch}`
        });
        console.log("Data updated successfully!");
      } else {
        // If no data exists, insert a new record
        await postRequest(ServerConfig.url, SAVE, {
          "query": 
            `INSERT INTO [dbo].[LeaveSandwichingSettings]
            ([pn_CompanyID], [pn_BranchID], [weekend_days], [selected_days], [created_at], [Include_PaidLeaves])
            VALUES
            (${companyId[0].pn_CompanyID}, 
            ${selectedBranch}, 
            '${weekendDaysString}', 
            '${selectedDaysString}', 
            '${createdAt}', 
            ${includePaidLeaves})`
        });
        console.log("Data inserted successfully!");
      }
  
      // Fetch the latest settings after save operation
      await fetchSettings();
  
    } catch (error) {
      console.error("Error saving data", error);
    }
  };

  const isSaturdayFrozen = weekendDays.includes("Saturday & Sunday");
  const isSundayFrozen = weekendDays.includes("Saturday & Sunday") || weekendDays.includes("Sunday");

  return (
    <Card className="p-4 shadow-lg rounded-lg">
      <h4 className="text-xl font-semibold">
        Leave Sandwiching Settings <LunchDiningIcon />
      </h4>

      {/* Step 0: Branch Selection */}
      <div className="mt-4" style={{ textAlign: "left", width: '200px' }}>
        <FormControl variant="outlined" style={{ width: '100%' }}>
          <InputLabel id="branch-select-label">Branch</InputLabel>
          <Select
            labelId="branch-select-label"
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            label="Branch"
          >
            {branch.map((branchItem) => (
              <MenuItem key={branchItem.pn_BranchID} value={branchItem.pn_BranchID}>
                {branchItem.BranchName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* Step 1: Weekend Selection */}
      <div className="mt-4" style={{ textAlign: "left" }}>
        <h6 className="font-medium">
          1. What days of the week should be considered as weekends for the purpose of leave sandwiching?
        </h6>
        <label>
          <Checkbox
            onChange={() => toggleWeekend("Sunday")}
            checked={weekendDays.includes("Sunday")}
          />{" "}
          Sunday
        </label>
        <label>
          <Checkbox
            onChange={() => toggleWeekend("Saturday & Sunday")}
            checked={weekendDays.includes("Saturday & Sunday")}
          />{" "}
          Saturday & Sunday 
        </label>
      </div>

      {/* Step 2: Select Surrounding Days */}
      <div className="mt-4" style={{ textAlign: "left" }}>
        <h6 className="font-medium">
          2. Choose the days that you're going to consider before and after the weekend?
        </h6>
        <div className="grid grid-cols-3 gap-4 p-4 bg-gray-100 rounded-lg">
          {allDays.map((day) => {
            const isFrozen =
              (day === "Saturday" && isSaturdayFrozen) || (day === "Sunday" && isSundayFrozen);
            return (
              <motion.button
                key={day}
                className={`p-2 rounded-lg border ${selectedDays.includes(day) ? "bg-blue-800 text-black" : "bg-white"} ${isFrozen ? "bg-gray-300 cursor-not-allowed" : ""}`}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                onClick={() => {
                  if (!isFrozen) {
                    setSelectedDays((prev) =>
                      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
                    );
                  }
                }}
                disabled={isFrozen}
              >
                {day}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Step 3: Include Public Holidays */}
      <div className="mt-4" style={{ textAlign: "left" }}>
        <h6 className="font-medium">
          3. Would you like to include paid leaves for the leave sandwiching policy?
        </h6>
        <label>
        <Checkbox
  onChange={() => setIncludeHolidays(!includeHolidays)}
  checked={includeHolidays}
/>{" "}
          Yes
        </label>
        <label>
          <Checkbox
            onChange={() => setIncludeHolidays(!includeHolidays)}
            checked={!includeHolidays}
          />{" "}
          No
        </label>
      </div>

      {/* Save Button */}
      <div className="mt-4">
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </div>
    </Card>
  );
}
