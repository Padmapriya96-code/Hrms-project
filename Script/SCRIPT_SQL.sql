
--CREATE FUNCTION [dbo].[Total_PF]()
--RETURNS @ResultTable TABLE (
--    pn_companyid INT,
--    pn_branchid INT,
--    emp_code NVARCHAR(50),
--    emp_name NVARCHAR(100),
--    basic_salary DECIMAL(18, 2),
--    Level_Name NVARCHAR(50),
--    PF CHAR(1),
--    Month NVARCHAR(2), -- New column for Month
--    Year NVARCHAR(4),  -- New column for Year
--    Absent INT,
--    Present INT,
--    Leave INT,
--    Holiday INT,
--    Work_From_Home INT,
--    HalfDay INT,
--    WeekOff INT,
--    PaidDays INT,
--    TotalDaysInMonth INT,
--    [Fix Amount] DECIMAL(18, 2),
--    [Earn Amt] DECIMAL(18, 2),
--    [Total Earn Amount] DECIMAL(18, 2),
--    PF_Contribution DECIMAL(18, 0),
--    EPF_Contribution DECIMAL(18, 0),
--    EPS_Contribution DECIMAL(18, 0),
--    Total_Contribution DECIMAL(18, 0)
--)
--AS
--BEGIN
--    WITH PF_Settings_CTE AS (
--        SELECT 
--            pn_CompanyID,
--            [PF_Contribution(%)] AS PF_Contribution,
--            [EPF_Contribution(%)] AS EPF_Contribution,
--            [EPS_Contribution(%)] AS EPS_Contribution,
--            [Max_Ceiling] AS MaxCeiling,
--            [Eligibility_Amount] AS EligibilityAmount,
--            [Upper_Limit] AS UpperLimit
--        FROM 
--            [dbo].[PF_Settings]
--    ),
--    PaidDays AS (
--        SELECT 
--            tc.emp_code,
--            tc.emp_name,
--            tc.pn_branchid,
--            tc.pn_companyid,
--            tc.shift_code,
--            SUM(CASE WHEN tc.status = 'A' THEN 1 ELSE 0 END) AS Absent,
--            SUM(CASE WHEN tc.status = 'P' THEN 1 ELSE 0 END) AS Present,
--            SUM(CASE WHEN tc.status = 'L' THEN 1 ELSE 0 END) AS Leave,
--            SUM(CASE WHEN tc.status = 'H' THEN 1 ELSE 0 END) AS Holiday,
--            SUM(CASE WHEN tc.status = 'WFH' THEN 1 ELSE 0 END) AS Work_From_Home,
--            SUM(CASE WHEN tc.status = 'HD' THEN 0.5 ELSE 0 END) AS HalfDay,
--            SUM(CASE WHEN tc.status = 'W' THEN 1 ELSE 0 END) AS WeekOff,
--            SUM(CASE WHEN tc.status IN ('P', 'L', 'H', 'WFH', 'W') THEN 1 ELSE 0 END) + 
--            SUM(CASE WHEN tc.status = 'HD' THEN 0.5 ELSE 0 END) AS PaidDays,
--            COUNT(DISTINCT tc.dates) AS TotalDaysInMonth,
--            FORMAT(tc.dates, 'yyyy-MM') AS MonthYear,
--            MONTH(tc.dates) AS Month, -- Extract Month
--            YEAR(tc.dates) AS Year    -- Extract Year
--        FROM 
--            [dbo].[time_card] tc
--        GROUP BY 
--            tc.emp_code, 
--            tc.emp_name, 
--            tc.pn_branchid, 
--            tc.pn_companyid, 
--            tc.shift_code,
--            FORMAT(tc.dates, 'yyyy-MM'),
--            MONTH(tc.dates),
--            YEAR(tc.dates)
--    ),
--    AllowanceCalculations AS (
--        SELECT 
--            av.pn_companyid,
--            av.pn_branchid,
--            e.EmployeeCode AS emp_code,
--            e.Employee_Full_Name AS emp_name,
--            e.basic_salary,
--            av.Level_Name,
--            av.v_EarningsName,
--            av.value AS TotalPercentage,
--            aset.Prorata_basis,
--            aset.PF,
--            pd.PaidDays,
--            pd.TotalDaysInMonth,
--            pd.Absent,
--            pd.Present,
--            pd.Leave,
--            pd.Holiday,
--            pd.Work_From_Home,
--            pd.HalfDay,
--            pd.WeekOff,
--            pd.MonthYear,  
--            pd.Month,  -- Include Month
--            pd.Year,   -- Include Year
--            pf.MaxCeiling,
--            pf.UpperLimit,
--            pf.PF_Contribution,
--            pf.EPF_Contribution,
--            pf.EPS_Contribution,
--            -- Fixed Allowance Calculation
--            CASE 
--                WHEN av.Allowancetype = 'Fixed' THEN av.value
--                WHEN av.Cal_Based_on = 'CTC' THEN (e.CTC * av.value / 100)
--                WHEN av.Cal_Based_on = 'BasicPay' THEN (e.Basic_Salary * av.value / 100) 
--                ELSE 0
--            END AS FixedAmount
--        FROM 
--            [dbo].[AllowanceValues] av
--        JOIN 
--            [dbo].[paym_Employee] e
--            ON av.Grade_Name = e.Grade
--            OR av.Level_Name = e.Grade
--        JOIN 
--            PaidDays pd
--            ON pd.emp_code = e.EmployeeCode 
--            AND pd.pn_branchid = av.pn_branchid
--        JOIN [dbo].[AllowanceSettings] aset
--            ON av.v_EarningsName = aset.v_EarningsName
--            AND av.pn_companyid = aset.pn_CompanyID
--            AND av.pn_branchid = aset.pn_branchID
--        JOIN PF_Settings_CTE pf
--            ON av.pn_companyid = pf.pn_CompanyID
--        GROUP BY
--            av.pn_companyid,
--            av.pn_branchid,
--            e.EmployeeCode,
--            e.Employee_Full_Name,
--            e.basic_salary,
--            av.Level_Name,
--            av.v_EarningsName,
--            av.value,
--            aset.Prorata_basis,
--            aset.PF,
--            pd.PaidDays,
--            pd.TotalDaysInMonth,
--            pd.Absent,
--            pd.Present,
--            pd.Leave,
--            pd.Holiday,
--            pd.Work_From_Home,
--            pd.HalfDay,
--            pd.WeekOff,
--            pd.MonthYear,
--            pd.Month,  -- Group by Month
--            pd.Year,   -- Group by Year
--            pf.MaxCeiling,
--            pf.UpperLimit,
--            pf.PF_Contribution,
--            pf.EPF_Contribution,
--            pf.EPS_Contribution,
--            av.Allowancetype,          
--            av.Cal_Based_on,          
--            e.CTC                     
--    ),
--    FilteredResults AS (
--        SELECT 
--            *,
--            COUNT(CASE WHEN PF = 'Y' THEN 1 END) OVER (PARTITION BY MonthYear) AS YCount
--        FROM 
--            AllowanceCalculations
--    )
--    INSERT INTO @ResultTable
--    SELECT 
--        pn_companyid,
--        pn_branchid,
--        emp_code,
--        emp_name,
--        basic_salary,
--        Level_Name,
--        PF,
--        Month,  -- New Month column
--        Year,   -- New Year column
--        Absent,
--        Present,
--        Leave,
--        Holiday,
--        Work_From_Home,
--        HalfDay,
--        WeekOff,
--        PaidDays,
--        TotalDaysInMonth,

--        SUM(CASE 
--            WHEN PF = 'Y' AND Prorata_basis = 'Y' THEN 
--                FixedAmount * PaidDays / TotalDaysInMonth
--            WHEN PF = 'Y' AND Prorata_basis = 'N' THEN 
--                FixedAmount
--            ELSE 
--                0
--        END) AS [Fix Amount],
        
--        (basic_salary * PaidDays / TotalDaysInMonth) AS [Earn Amt], 

--        (SUM(CASE 
--            WHEN PF = 'Y' AND Prorata_basis = 'N' THEN FixedAmount
--            ELSE 0
--        END) + 
--        (basic_salary + 
--            SUM(CASE WHEN FixedAmount > 0 AND PF = 'Y' AND Prorata_basis = 'Y' THEN FixedAmount ELSE 0 END)) * PaidDays / TotalDaysInMonth) AS [Total Earn Amount], 
        
--        CASE 
--            WHEN MaxCeiling = 'Yes' THEN 
--                ROUND(UpperLimit * PF_Contribution / 100, 0)
--            ELSE 
--                CASE 
--                    WHEN PF = 'Y' THEN 
--                        ROUND((SUM(CASE 
--                            WHEN PF = 'Y' AND Prorata_basis = 'N' THEN FixedAmount
--                            ELSE 0
--                        END) + 
--                        (basic_salary + 
--                            SUM(CASE WHEN FixedAmount > 0 AND PF = 'Y' AND Prorata_basis = 'Y' THEN FixedAmount ELSE 0 END)) * PaidDays / TotalDaysInMonth) * PF_Contribution / 100, 0)
--                    ELSE 
--                        ROUND(basic_salary * PF_Contribution / 100, 0)
--                END
--        END AS PF_Contribution,

--        CASE 
--            WHEN MaxCeiling = 'Yes' THEN 
--                ROUND(UpperLimit * EPF_Contribution / 100, 0)
--            ELSE 
--                CASE 
--                    WHEN PF = 'Y' THEN 
--                        ROUND((SUM(CASE 
--                            WHEN PF = 'Y' AND Prorata_basis = 'N' THEN FixedAmount
--                            ELSE 0
--                        END) + 
--                        (basic_salary + 
--                            SUM(CASE WHEN FixedAmount > 0 AND PF = 'Y' AND Prorata_basis = 'Y' THEN FixedAmount ELSE 0 END)) * PaidDays / TotalDaysInMonth) * EPF_Contribution / 100, 0)
--                    ELSE 
--                        ROUND(basic_salary * EPF_Contribution / 100, 0)
--                END
--        END AS EPF_Contribution,

--        CASE 
--            WHEN MaxCeiling = 'Yes' THEN 
--                ROUND(UpperLimit * EPS_Contribution / 100, 0)
--            ELSE 
--                CASE 
--                    WHEN PF = 'Y' THEN 
--                        ROUND((SUM(CASE 
--                            WHEN PF = 'Y' AND Prorata_basis = 'N' THEN FixedAmount
--                            ELSE 0
--                        END) + 
--                        (basic_salary + 
--                            SUM(CASE WHEN FixedAmount > 0 AND PF = 'Y' AND Prorata_basis = 'Y' THEN FixedAmount ELSE 0 END)) * PaidDays / TotalDaysInMonth) * EPS_Contribution / 100, 0)
--                    ELSE 
--                        ROUND(basic_salary * EPS_Contribution / 100, 0)
--                END
--        END AS EPS_Contribution,

--        -- New column for total contributions
--        CASE 
--            WHEN MaxCeiling = 'Yes' THEN 
--                ROUND(UpperLimit * (PF_Contribution + EPF_Contribution + EPS_Contribution) / 100, 0)
--            ELSE 
--                CASE 
--                    WHEN PF = 'Y' THEN 
--                        ROUND((SUM(CASE 
--                            WHEN PF = 'Y' AND Prorata_basis = 'N' THEN FixedAmount
--                            ELSE 0
--                        END) + 
--                        (basic_salary + 
--                            SUM(CASE WHEN FixedAmount > 0 AND PF = 'Y' AND Prorata_basis = 'Y' THEN FixedAmount ELSE 0 END)) * PaidDays / TotalDaysInMonth) * (PF_Contribution + EPF_Contribution + EPS_Contribution) / 100, 0)
--                    ELSE 
--                        ROUND(basic_salary * (PF_Contribution + EPF_Contribution + EPS_Contribution) / 100, 0)
--                END
--        END AS Total_Contribution

--    FROM 
--        FilteredResults
--    WHERE 
--        (YCount > 0 AND PF = 'Y') OR (YCount = 0 AND PF = 'N')
--    GROUP BY 
--        pn_companyid,
--        pn_branchid,
--        emp_code,
--        emp_name,
--        basic_salary,
--        Level_Name,
--        PF,
--        Month,  -- Group by Month
--        Year,   -- Group by Year
--        Absent,
--        Present,
--        Leave,
--        Holiday,
--        Work_From_Home,
--        HalfDay,
--        WeekOff,
--        PaidDays,
--        TotalDaysInMonth,
--        MaxCeiling,
--        UpperLimit,
--        PF_Contribution,
--        EPF_Contribution,
--        EPS_Contribution
--    ORDER BY 
--        emp_code, Year, Month, Level_Name; -- Order by Year and Month

--    RETURN;
--END;
--GO
--/****** Object:  UserDefinedFunction [dbo].[Total_PFdemo]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE FUNCTION [dbo].[Total_PFdemo]()
--RETURNS @ResultTable TABLE (
--    pn_companyid INT,
--    pn_branchid INT,
--    emp_code NVARCHAR(50),
--    emp_name NVARCHAR(100),
--    pfno NVARCHAR(50), -- Added PF Number
--    basic_salary DECIMAL(18, 2),
--    Level_Name NVARCHAR(50),
--    PF CHAR(1),
--    Month NVARCHAR(2), -- New column for Month
--    Year NVARCHAR(4),  -- New column for Year
--    Absent INT,
--    Present INT,
--    Leave INT,
--    Holiday INT,
--    Work_From_Home INT,
--    HalfDay INT,
--    WeekOff INT,
--    PaidDays INT,
--    TotalDaysInMonth INT,
--    [Fix Amount] DECIMAL(18, 2),
--    [Earn Amt] DECIMAL(18, 2),
--    [Total Earn Amount] DECIMAL(18, 2),
--    PF_Contribution DECIMAL(18, 2),
--    EPF_Contribution DECIMAL(18, 2),
--    EPS_Contribution DECIMAL(18, 2),
--    Total_Contribution DECIMAL(18, 2)
--)
--AS
--BEGIN
--    WITH PF_Settings_CTE AS (
--        SELECT 
--            pn_CompanyID,
--            [PF_Contribution(%)] AS PF_Contribution,
--            [EPF_Contribution(%)] AS EPF_Contribution,
--            [EPS_Contribution(%)] AS EPS_Contribution,
--            [Max_Ceiling] AS MaxCeiling,
--            [Eligibility_Amount] AS EligibilityAmount,
--            [Upper_Limit] AS UpperLimit
--        FROM 
--            [dbo].[PF_Settings]
--    ),
--    PaidDays AS (
--        SELECT 
--            tc.emp_code,
--            tc.emp_name,
--            tc.pn_branchid,
--            tc.pn_companyid,
--            tc.shift_code,
--            SUM(CASE WHEN tc.status = 'A' THEN 1 ELSE 0 END) AS Absent,
--            SUM(CASE WHEN tc.status = 'P' THEN 1 ELSE 0 END) AS Present,
--            SUM(CASE WHEN tc.status = 'L' THEN 1 ELSE 0 END) AS Leave,
--            SUM(CASE WHEN tc.status = 'H' THEN 1 ELSE 0 END) AS Holiday,
--            SUM(CASE WHEN tc.status = 'WFH' THEN 1 ELSE 0 END) AS Work_From_Home,
--            SUM(CASE WHEN tc.status = 'HD' THEN 0.5 ELSE 0 END) AS HalfDay,
--            SUM(CASE WHEN tc.status = 'W' THEN 1 ELSE 0 END) AS WeekOff,
--            SUM(CASE WHEN tc.status IN ('P', 'L', 'H', 'WFH', 'W') THEN 1 ELSE 0 END) + 
--            SUM(CASE WHEN tc.status = 'HD' THEN 0.5 ELSE 0 END) AS PaidDays,
--            COUNT(DISTINCT tc.dates) AS TotalDaysInMonth,
--            FORMAT(tc.dates, 'yyyy-MM') AS MonthYear,
--            MONTH(tc.dates) AS Month, -- Extract Month
--            YEAR(tc.dates) AS Year    -- Extract Year
--        FROM 
--            [dbo].[time_card] tc
--        GROUP BY 
--            tc.emp_code, 
--            tc.emp_name, 
--            tc.pn_branchid, 
--            tc.pn_companyid, 
--            tc.shift_code,
--            FORMAT(tc.dates, 'yyyy-MM'),
--            MONTH(tc.dates),
--            YEAR(tc.dates)
--    ),
--    AllowanceCalculations AS (
--        SELECT 
--            av.pn_companyid,
--            av.pn_branchid,
--            e.EmployeeCode AS emp_code,
--            e.Employee_Full_Name AS emp_name,
--			            e.pfno, -- Added PF Number
--            e.basic_salary,
--            av.Level_Name,
--            av.v_EarningsName,
--            av.value AS TotalPercentage,
--            aset.Prorata_basis,
--            aset.PF,
--            pd.PaidDays,
--            pd.TotalDaysInMonth,
--            pd.Absent,
--            pd.Present,
--            pd.Leave,
--            pd.Holiday,
--            pd.Work_From_Home,
--            pd.HalfDay,
--            pd.WeekOff,
--            pd.MonthYear,  
--            pd.Month,  -- Include Month
--            pd.Year,   -- Include Year
--            pf.MaxCeiling,
--            pf.UpperLimit,
--            pf.PF_Contribution,
--            pf.EPF_Contribution,
--            pf.EPS_Contribution,
--            -- Fixed Allowance Calculation
--            CASE 
--                WHEN av.Allowancetype = 'Fixed' THEN av.value
--                WHEN av.Cal_Based_on = 'CTC' THEN (e.CTC * av.value / 100)
--                WHEN av.Cal_Based_on = 'BasicPay' THEN (e.Basic_Salary * av.value / 100) 
--                ELSE 0
--            END AS FixedAmount
--        FROM 
--            [dbo].[AllowanceValues] av
--        JOIN 
--            [dbo].[paym_Employee] e
--            ON av.Grade_Name = e.Grade
--            OR av.Level_Name = e.Grade
--        JOIN 
--            PaidDays pd
--            ON pd.emp_code = e.EmployeeCode 
--            AND pd.pn_branchid = av.pn_branchid
--        JOIN [dbo].[AllowanceSettings] aset
--            ON av.v_EarningsName = aset.v_EarningsName
--            AND av.pn_companyid = aset.pn_CompanyID
--            AND av.pn_branchid = aset.pn_branchID
--        JOIN PF_Settings_CTE pf
--            ON av.pn_companyid = pf.pn_CompanyID
--        GROUP BY
--            av.pn_companyid,
--            av.pn_branchid,
--            e.EmployeeCode,
--            e.Employee_Full_Name,
--		e.pfno, -- Added PF Number
--            e.basic_salary,
--            av.Level_Name,
--            av.v_EarningsName,
--            av.value,
--            aset.Prorata_basis,
--            aset.PF,
--            pd.PaidDays,
--            pd.TotalDaysInMonth,
--            pd.Absent,
--            pd.Present,
--            pd.Leave,
--            pd.Holiday,
--            pd.Work_From_Home,
--            pd.HalfDay,
--            pd.WeekOff,
--            pd.MonthYear,
--            pd.Month,  -- Group by Month
--            pd.Year,   -- Group by Year
--            pf.MaxCeiling,
--            pf.UpperLimit,
--            pf.PF_Contribution,
--            pf.EPF_Contribution,
--            pf.EPS_Contribution,
--            av.Allowancetype,          
--            av.Cal_Based_on,          
--            e.CTC                     
--    ),
--    FilteredResults AS (
--        SELECT 
--            *,
--            COUNT(CASE WHEN PF = 'Y' THEN 1 END) OVER (PARTITION BY MonthYear) AS YCount
--        FROM 
--            AllowanceCalculations
--    )
--    INSERT INTO @ResultTable
--    SELECT 
--        pn_companyid,
--        pn_branchid,
--        emp_code,
--        emp_name,
--		        pfno, -- Added PF Number
--        basic_salary,
--        Level_Name,
--        PF,
--        Month,  -- New Month column
--        Year,   -- New Year column
--        Absent,
--        Present,
--        Leave,
--        Holiday,
--        Work_From_Home,
--        HalfDay,
--        WeekOff,
--        PaidDays,
--        TotalDaysInMonth,

--        SUM(CASE 
--            WHEN PF = 'Y' AND Prorata_basis = 'Y' THEN 
--                FixedAmount * PaidDays / TotalDaysInMonth
--            WHEN PF = 'Y' AND Prorata_basis = 'N' THEN 
--                FixedAmount
--            ELSE 
--                0
--        END) AS [Fix Amount],
        
--        (basic_salary * PaidDays / TotalDaysInMonth) AS [Earn Amt], 

--        (SUM(CASE 
--            WHEN PF = 'Y' AND Prorata_basis = 'N' THEN FixedAmount
--            ELSE 0
--        END) + 
--        (basic_salary + 
--            SUM(CASE WHEN FixedAmount > 0 AND PF = 'Y' AND Prorata_basis = 'Y' THEN FixedAmount ELSE 0 END)) * PaidDays / TotalDaysInMonth) AS [Total Earn Amount], 
        
--                       CASE 
--            WHEN MaxCeiling = 'Yes' THEN 
--                ROUND(CAST(UpperLimit AS DECIMAL(18,2)) * PF_Contribution / 100, 2)
--            ELSE 
--                CASE 
--                    WHEN PF = 'Y' THEN 
--                        ROUND((SUM(CASE 
--                            WHEN PF = 'Y' AND Prorata_basis = 'N' THEN FixedAmount
--                            ELSE 0
--                        END) + 
--                        (basic_salary + 
--                            SUM(CASE WHEN FixedAmount > 0 AND PF = 'Y' AND Prorata_basis = 'Y' THEN FixedAmount ELSE 0 END)) * PaidDays / TotalDaysInMonth) * PF_Contribution / 100, 2)
--                    ELSE 
--                        ROUND(basic_salary * PF_Contribution / 100, 2)
--                END
--        END AS PF_Contribution,

--        CASE 
--            WHEN MaxCeiling = 'Yes' THEN 
--                ROUND(CAST(UpperLimit AS DECIMAL(18,2)) * EPF_Contribution / 100, 2)
--            ELSE 
--                CASE 
--                    WHEN PF = 'Y' THEN 
--                        ROUND((SUM(CASE 
--                            WHEN PF = 'Y' AND Prorata_basis = 'N' THEN FixedAmount
--                            ELSE 0
--                        END) + 
--                        (basic_salary + 
--                            SUM(CASE WHEN FixedAmount > 0 AND PF = 'Y' AND Prorata_basis = 'Y' THEN FixedAmount ELSE 0 END)) * PaidDays / TotalDaysInMonth) * EPF_Contribution / 100, 2)
--                    ELSE 
--                        ROUND(basic_salary * EPF_Contribution / 100, 2)
--                END
--        END AS EPF_Contribution,

--        CASE 
--            WHEN MaxCeiling = 'Yes' THEN 
--                ROUND(CAST(UpperLimit AS DECIMAL(18,2)) * EPS_Contribution / 100, 2)
--            ELSE 
--                CASE 
--                    WHEN PF = 'Y' THEN 
--                        ROUND((SUM(CASE 
--                            WHEN PF = 'Y' AND Prorata_basis = 'N' THEN FixedAmount
--                            ELSE 0
--                        END) + 
--                        (basic_salary + 
--                            SUM(CASE WHEN FixedAmount > 0 AND PF = 'Y' AND Prorata_basis = 'Y' THEN FixedAmount ELSE 0 END)) * PaidDays / TotalDaysInMonth) * EPS_Contribution / 100, 2)
--                    ELSE 
--                        ROUND(basic_salary * EPS_Contribution / 100, 2)
--                END
--        END AS EPS_Contribution,

--        -- New column for total contributions
--        CASE 
--            WHEN MaxCeiling = 'Yes' THEN 
--                ROUND(UpperLimit * (PF_Contribution + EPF_Contribution + EPS_Contribution) / 100, 2)
--            ELSE 
--                CASE 
--                    WHEN PF = 'Y' THEN 
--                        ROUND((SUM(CASE 
--                            WHEN PF = 'Y' AND Prorata_basis = 'N' THEN FixedAmount
--                            ELSE 0
--                        END) + 
--                        (basic_salary + 
--                            SUM(CASE WHEN FixedAmount > 0 AND PF = 'Y' AND Prorata_basis = 'Y' THEN FixedAmount ELSE 0 END)) * PaidDays / TotalDaysInMonth) * (PF_Contribution + EPF_Contribution + EPS_Contribution) / 100, 2)
--                    ELSE 
--                        ROUND(basic_salary * (PF_Contribution + EPF_Contribution + EPS_Contribution) / 100, 2)
--                END
--        END AS Total_Contribution

--    FROM 
--        FilteredResults
--    WHERE 
--        (YCount > 0 AND PF = 'Y') OR (YCount = 0 AND PF = 'N')
--    GROUP BY 
--        pn_companyid,
--        pn_branchid,
--        emp_code,
--        emp_name,
--		pfno,
--        basic_salary,
--        Level_Name,
--        PF,
--        Month,  -- Group by Month
--        Year,   -- Group by Year
--        Absent,
--        Present,
--        Leave,
--        Holiday,
--        Work_From_Home,
--        HalfDay,
--        WeekOff,
--        PaidDays,
--        TotalDaysInMonth,
--        MaxCeiling,
--        UpperLimit,
--        PF_Contribution,
--        EPF_Contribution,
--        EPS_Contribution
--    ORDER BY 
--        emp_code, Year, Month, Level_Name; -- Order by Year and Month

--    RETURN;
--END;

--GO
--/****** Object:  Table [dbo].[Allowancesettings]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[Allowancesettings](
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_BranchID] [int] NULL,
--	[v_EarningsName] [varchar](40) NULL,
--	[c_OT] [char](1) NULL,
--	[Prorata_basis] [char](1) NULL,
--	[d_order] [int] NULL,
--	[PF] [char](1) NULL,
--	[ESI] [char](1) NULL,
--	[h] [char](1) NULL,
--	[rtg] [char](1) NULL,
--	[uyjtyu] [char](1) NULL,
--	[hbib] [char](1) NULL,
--	[nbkbk] [char](1) NULL,
--	[wedlfknon] [char](1) NULL,
--	[kbkjb_k] [char](1) NULL,
--	[kbk_k] [char](1) NULL,
--	[iojoj] [char](1) NULL,
--	[jijnini] [char](1) NULL,
--	[fea] [char](1) NULL,
--	[Internet] [char](1) NULL,
--	[Travel] [char](1) NULL
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[AllowanceValues]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[AllowanceValues](
--	[pn_companyid] [int] NOT NULL,
--	[pn_branchid] [int] NOT NULL,
--	[Grade_Name] [varchar](30) NULL,
--	[Level_Name] [varchar](30) NULL,
--	[v_EarningsName] [varchar](40) NULL,
--	[Allowancetype] [varchar](20) NULL,
--	[Cal_Based_on] [varchar](20) NULL,
--	[value] [float] NULL,
--	[c_Regular] [char](1) NULL,
--	[payslip] [char](1) NULL,
--	[PayMonth] [varchar](20) NULL,
--	[d_order] [int] NULL
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[time_card]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[time_card](
--	[Sno] [int] IDENTITY(1,1) NOT NULL,
--	[pn_companyid] [int] NULL,
--	[pn_branchid] [int] NULL,
--	[emp_code] [varchar](10) NULL,
--	[emp_name] [varchar](50) NULL,
--	[shift_code] [varchar](5) NULL,
--	[dates] [datetime] NULL,
--	[days] [varchar](15) NULL,
--	[intime] [datetime] NULL,
--	[break_out] [datetime] NULL,
--	[break_in] [datetime] NULL,
--	[early_out] [datetime] NULL,
--	[outtime] [datetime] NULL,
--	[Late_in] [datetime] NULL,
--	[Late_out] [datetime] NULL,
--	[ot_hrs] [time](0) NULL,
--	[status] [varchar](5) NULL,
--	[leave_code] [varchar](20) NULL,
--	[data] [char](1) NULL,
--	[pn_EmployeeID] [varchar](20) NULL,
--	[flag] [char](1) NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[Sno] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[paym_Employee]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[paym_Employee](
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_BranchID] [int] NOT NULL,
--	[pn_EmployeeID] [int] IDENTITY(1,1) NOT NULL,
--	[EmployeeCode] [varchar](50) NULL,
--	[Employee_First_Name] [varchar](50) NULL,
--	[Employee_Middle_Name] [varchar](50) NULL,
--	[Employee_Last_Name] [varchar](50) NULL,
--	[DateofBirth] [datetime] NULL,
--	[Password] [varchar](20) NULL,
--	[Gender] [varchar](20) NULL,
--	[status] [nvarchar](20) NULL,
--	[Employee_Full_Name] [varchar](70) NULL,
--	[Readerid] [varchar](100) NULL,
--	[OT_Eligible] [varchar](100) NULL,
--	[Pfno] [varchar](20) NULL,
--	[Esino] [varchar](20) NULL,
--	[OT_calc] [float] NULL,
--	[CTC] [float] NULL,
--	[basic_salary] [float] NULL,
--	[Bank_code] [varchar](10) NULL,
--	[Bank_Name] [varchar](30) NULL,
--	[Branch_Name] [varchar](30) NULL,
--	[Account_Type] [varchar](20) NULL,
--	[MICR_code] [varchar](20) NULL,
--	[IFSC_Code] [varchar](20) NULL,
--	[Other_Info] [varchar](100) NULL,
--	[Reporting_person] [varchar](50) NULL,
--	[ReportingID] [varchar](100) NULL,
--	[Reporting_email] [varchar](50) NULL,
--	[Pan_no] [varchar](20) NULL,
--	[salary_type] [varchar](50) NULL,
--	[TDS_Applicable] [varchar](100) NULL,
--	[Flag] [varchar](1) NULL,
--	[role] [varchar](100) NULL,
--	[accountNo] [varchar](50) NULL,
--	[Blood_Group] [varchar](20) NULL,
--	[Phone_No] [varchar](20) NULL,
--	[Alternate_Phone_No] [varchar](20) NULL,
--	[permanent_address] [varchar](200) NULL,
--	[Aadhar_Card] [varchar](20) NULL,
--	[Current_Address] [varchar](200) NULL,
--	[Father_Name] [varchar](200) NULL,
--	[Email] [varchar](100) NULL,
--	[Alternate_Email] [varchar](100) NULL,
--	[Grade] [varchar](30) NULL,
--	[Overall_Experience] [float] NULL,
--	[HighestQualification] [varchar](100) NULL,
--	[UniversityName] [varchar](100) NULL,
--	[YearOfPassing] [varchar](100) NULL,
--	[Certifications] [nvarchar](255) NULL,
--	[Skills] [nvarchar](max) NULL,
--	[UAN] [varchar](25) NULL,
--	[PaymentMode] [varchar](100) NULL,
--	[PassportNumber] [varchar](20) NULL,
--	[VisaDetails] [varchar](200) NULL,
--	[JoiningDate] [date] NULL,
--	[ExitReason] [varchar](100) NULL,
--	[PreviousCompany] [varchar](100) NULL,
--	[PreviousDesignation] [varchar](100) NULL,
--	[PreviousEmploymentDuration] [varchar](50) NULL,
--	[ReasonForLeaving] [varchar](255) NULL,
--	[PerformanceRating] [decimal](3, 2) NULL,
--	[TrainingRecords] [varchar](255) NULL,
--	[DisciplinaryActions] [varchar](255) NULL,
--	[Awards] [varchar](255) NULL,
--	[VehicleDetails] [varchar](255) NULL,
--	[HealthInsuranceDetails] [varchar](255) NULL,
--	[NomineeDetails] [varchar](255) NULL,
--	[Asset_Name] [varchar](100) NULL,
--	[Asset_SerialNumber] [varchar](100) NULL,
--	[NomineePhoneno] [varchar](20) NULL,
--	[NomineeRelationship] [varchar](30) NULL,
--	[ExitDate] [date] NULL,
--	[AssetType] [varchar](40) NULL,
-- CONSTRAINT [pk_paym_Employee] PRIMARY KEY CLUSTERED 
--(
--	[pn_CompanyID] ASC,
--	[pn_BranchID] ASC,
--	[pn_EmployeeID] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
--GO
--/****** Object:  UserDefinedFunction [dbo].[GetEmployeeAllowancesWithFinalOTDisplay]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE FUNCTION [dbo].[GetEmployeeAllowancesWithFinalOTDisplay]()
--RETURNS TABLE
--AS
--RETURN
--(
--    WITH EmployeeAllowances AS (
--        SELECT DISTINCT
--            e.pn_CompanyID,
--            e.pn_BranchID,
--            e.Employee_Full_Name,
--            e.EmployeeCode,
--            e.pn_EmployeeID,
--            av.Grade_Name,
--            av.Level_Name,
--            av.v_EarningsName,
--            av.Allowancetype,
--            av.Cal_Based_on,
--            CASE 
--                WHEN av.Allowancetype = 'Fixed' THEN av.value
--                WHEN av.Allowancetype = 'Percentage' AND av.Cal_Based_on = 'CTC' THEN (e.CTC * av.value / 100.0)
--                WHEN av.Allowancetype = 'Percentage' AND av.Cal_Based_on = 'BasicPay' THEN (e.Basic_Salary * av.value / 100.0)
--                ELSE 0
--            END AS OriginalAmount,
--            aset.Prorata_basis,
--            aset.c_OT,
--            av.d_order
--        FROM 
--            [dbo].[AllowanceValues] av
--        JOIN 
--            [dbo].[paym_Employee] e
--            ON av.Grade_Name = e.Grade
--            OR av.Level_Name = e.Grade
--        LEFT JOIN (
--            SELECT 
--                pn_CompanyID, pn_BranchID, v_EarningsName, 
--                MAX(Prorata_basis) AS Prorata_basis,
--                MAX(c_OT) AS c_OT
--            FROM 
--                [dbo].[Allowancesettings]
--            GROUP BY 
--                pn_CompanyID, pn_BranchID, v_EarningsName
--        ) aset
--        ON av.pn_companyid = aset.pn_CompanyID
--        AND av.pn_branchid = aset.pn_BranchID
--        AND av.v_EarningsName = aset.v_EarningsName
--        WHERE 
--            av.pn_branchid = e.pn_BranchID
--            AND av.Allowancetype IN ('Fixed', 'Percentage')
--            AND NOT (av.c_Regular = 'N' AND av.payslip = 'N')
--            AND (aset.c_OT = 'Y' OR aset.c_OT IS NULL)
--    ),
--    AbsentDays AS (
--        SELECT 
--            tc.emp_code,
--            COUNT(CASE WHEN tc.Status = 'A' THEN 1 ELSE NULL END) AS FullDayAbsences,
--            COUNT(CASE WHEN tc.Status = 'HD' THEN 1 ELSE NULL END) AS HalfDayAbsences,
--            MAX(DATEPART(DAY, EOMONTH(tc.dates))) AS TotalDaysInMonth,
--            DATEPART(YEAR, tc.dates) AS Year,
--            DATEPART(MONTH, tc.dates) AS Month,
--            COUNT(CASE WHEN tc.Status = 'A' THEN 1 ELSE NULL END) + 
--            (COUNT(CASE WHEN tc.Status = 'HD' THEN 1 ELSE NULL END) * 0.5) AS TotalAbsentDays
--        FROM 
--            [dbo].[time_card] tc
--        GROUP BY 
--            tc.emp_code, DATEPART(YEAR, tc.dates), DATEPART(MONTH, tc.dates)
--    )
--    SELECT 
--        ea.pn_CompanyID,
--        ea.pn_BranchID,
--        ea.pn_EmployeeID,
--        ea.Employee_Full_Name,
--        ea.EmployeeCode,
--        ad.Year,
--        ad.Month,
--        ISNULL(ad.FullDayAbsences, 0) AS FullDayAbsences,
--        ISNULL(ad.HalfDayAbsences, 0) AS HalfDayAbsences,
--        ISNULL(ad.TotalDaysInMonth, 31) AS TotalDaysInMonth,
--        ISNULL(ad.TotalAbsentDays, 0) AS TotalAbsentDays,
--        (ISNULL(ad.TotalDaysInMonth, 31) - ISNULL(ad.TotalAbsentDays, 0)) AS PaidDays,
--        COALESCE(SUM(
--            CASE 
--                WHEN ea.Prorata_basis = 'Y' THEN 
--                    (ea.OriginalAmount / ISNULL(ad.TotalDaysInMonth, 31)) * 
--                    (ISNULL(ad.TotalDaysInMonth, 31) - ISNULL(ad.TotalAbsentDays, 0))
--                ELSE 
--                    ea.OriginalAmount
--            END
--        ), 0) AS TotalAllowance
--    FROM 
--        EmployeeAllowances ea
--    LEFT JOIN 
--        AbsentDays ad
--        ON ea.EmployeeCode = ad.emp_code
--    WHERE 
--        ea.Prorata_basis IN ('Y', 'N')
--    GROUP BY
--        ea.pn_CompanyID, 
--        ea.pn_BranchID, 
--        ea.pn_EmployeeID, 
--        ea.Employee_Full_Name, 
--        ea.EmployeeCode,
--        ad.Year,
--        ad.Month,
--        ad.FullDayAbsences,
--        ad.HalfDayAbsences,
--        ad.TotalDaysInMonth,
--        ad.TotalAbsentDays
--);
--GO
--/****** Object:  Table [dbo].[__EFMigrationsHistory]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[__EFMigrationsHistory](
--	[MigrationId] [nvarchar](150) NOT NULL,
--	[ProductVersion] [nvarchar](32) NOT NULL,
-- CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY CLUSTERED 
--(
--	[MigrationId] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[adminlogin]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[adminlogin](
--	[username] [varchar](20) NOT NULL,
--	[password] [varchar](20) NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[username] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[AllowanceMaster]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[AllowanceMaster](
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_BranchID] [int] NULL,
--	[pn_EarningsID] [int] IDENTITY(1,1) NOT NULL,
--	[v_EarningsName] [varchar](40) NULL,
--	[c_Regular] [char](1) NULL,
--	[c_PF] [char](1) NULL,
--	[c_ESI] [char](1) NULL,
--	[c_OT] [char](1) NULL,
--	[c_LOP] [char](1) NULL,
--	[c_PT] [char](1) NULL,
--	[payslip] [char](1) NULL,
--	[status] [char](1) NULL,
--	[d_order] [int] NULL,
--	[Company_User_Id] [varchar](255) NULL,
--	[Branch_User_Id] [varchar](255) NULL
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[AllowanceMasterApprove]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[AllowanceMasterApprove](
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_BranchID] [int] NOT NULL,
--	[v_EarningsName] [varchar](40) NOT NULL,
--	[Approve] [varchar](40) NOT NULL,
--	[Pending] [varchar](40) NOT NULL,
--	[Reject] [varchar](40) NOT NULL,
--	[RequestDate] [datetime] NULL,
--	[Responsedate] [datetime] NULL,
--	[Response_User_Id] [varchar](255) NULL,
--	[Request_User_Id] [varchar](255) NULL
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[Assets]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[Assets](
--	[pn_CompanyID] [int] NOT NULL,
--	[BranchID] [int] NOT NULL,
--	[pn_Assetid] [int] IDENTITY(1,1) NOT NULL,
--	[Asset_name] [varchar](100) NOT NULL,
--	[Asset_SerialNumber] [varchar](100) NULL,
--	[PurchaseDate] [date] NULL,
--	[AssetValue] [decimal](18, 2) NULL,
--	[Status] [nvarchar](50) NOT NULL,
--	[Description] [nvarchar](max) NULL,
--	[CreatedDate] [datetime] NOT NULL,
--	[AssetType] [varchar](100) NULL,
--	[AssetAssignedTo] [int] NULL,
-- CONSTRAINT [PK_Assets] PRIMARY KEY CLUSTERED 
--(
--	[pn_CompanyID] ASC,
--	[BranchID] ASC,
--	[Asset_name] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
-- CONSTRAINT [UQ_AssetType_Serial] UNIQUE NONCLUSTERED 
--(
--	[AssetType] ASC,
--	[Asset_SerialNumber] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[attendance]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[attendance](
--	[id] [int] IDENTITY(1,1) NOT NULL,
--	[pn_companyId] [int] NULL,
--	[pn_branchId] [int] NULL,
--	[pn_employeeId] [int] NULL,
--	[day_status] [varchar](20) NULL,
--	[intime] [datetime] NULL,
--	[outtime] [datetime] NULL,
--	[meeting] [varchar](500) NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[id] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[Attendance_Bonus]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[Attendance_Bonus](
--	[pn_companyid] [int] NULL,
--	[pn_branchid] [int] NULL,
--	[Category_Name] [varchar](30) NULL,
--	[SlabID] [int] NULL,
--	[Attendance_Bonus_Value] [numeric](10, 2) NULL,
--	[Attendance_bonus_type] [float] NULL
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[attendance_ceiling]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[attendance_ceiling](
--	[Id] [int] IDENTITY(1,1) NOT NULL,
--	[pn_companyid] [int] NULL,
--	[pn_branchid] [int] NULL,
--	[intime] [time](3) NULL,
--	[early_intime] [time](3) NULL,
--	[shift_lin] [time](3) NULL,
--	[lunch_ein] [time](3) NULL,
--	[halfday] [time](3) NULL,
--	[ot_limit] [time](3) NULL,
--	[permission_limit] [time](3) NULL,
--	[leave_days] [int] NULL,
--	[morning_ot] [varchar](3) NULL,
--	[month_type] [varchar](22) NULL,
--	[week_off1] [varchar](12) NULL,
--	[week_off2] [varchar](12) NULL,
--	[manual_days] [int] NULL,
--	[ot_days] [float] NULL,
--	[ot_hrs] [float] NULL,
--	[time_card] [varchar](25) NULL,
--	[ptax_month] [varchar](30) NULL,
--	[reader_name] [varchar](20) NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[Id] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[Backup_Attendance]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[Backup_Attendance](
--	[Sno] [int] IDENTITY(1,1) NOT NULL,
--	[pn_companyid] [int] NULL,
--	[pn_branchid] [int] NULL,
--	[emp_code] [varchar](10) NULL,
--	[emp_name] [varchar](50) NULL,
--	[shift_code] [varchar](5) NULL,
--	[dates] [datetime] NULL,
--	[days] [varchar](15) NULL,
--	[intime] [datetime] NULL,
--	[break_out] [datetime] NULL,
--	[break_in] [datetime] NULL,
--	[early_out] [datetime] NULL,
--	[outtime] [datetime] NULL,
--	[Late_in] [datetime] NULL,
--	[Late_out] [datetime] NULL,
--	[ot_hrs] [datetime] NULL,
--	[status] [varchar](5) NULL,
--	[leave_code] [varchar](20) NULL,
--	[data] [char](1) NULL,
--	[pn_EmployeeID] [varchar](20) NULL,
--	[flag] [char](1) NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[Sno] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[CTCSlab]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[CTCSlab](
--	[CTCSlabID] [int] IDENTITY(1,1) NOT NULL,
--	[MinCTC] [decimal](18, 2) NOT NULL,
--	[MaxCTC] [decimal](18, 2) NOT NULL,
--	[MaxLoanAmount] [decimal](18, 2) NOT NULL,
--	[InterestRate] [decimal](5, 2) NULL,
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_BranchID] [int] NOT NULL,
--	[LoanType] [varchar](50) NULL,
--	[LoanID] [nvarchar](50) NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[CTCSlabID] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[daily_timecard_new]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[daily_timecard_new](
--	[Id] [int] IDENTITY(1,1) NOT NULL,
--	[pn_companyid] [int] NULL,
--	[pn_branchid] [int] NULL,
--	[machine_num] [varchar](30) NULL,
--	[card_no] [varchar](5) NULL,
--	[emp_code] [varchar](10) NULL,
--	[emp_name] [varchar](50) NULL,
--	[VerifyMode] [int] NULL,
--	[InOutMode] [int] NULL,
--	[shift_code] [varchar](5) NULL,
--	[dates] [datetime] NULL,
--	[days] [varchar](15) NULL,
--	[intime] [time](7) NULL,
--	[break_out] [time](7) NULL,
--	[break_in] [time](7) NULL,
--	[outtime] [time](7) NULL,
--	[ot_hrs] [datetime] NULL,
--	[status] [varchar](2) NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[Id] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[DeductionMaster]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[DeductionMaster](
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_BranchID] [int] NOT NULL,
--	[pn_DeductionID] [int] IDENTITY(1,1) NOT NULL,
--	[v_DeductionName] [varchar](40) NOT NULL,
--	[c_Regular] [char](1) NULL,
--	[status] [char](1) NULL,
--	[d_order] [int] NULL,
--	[v_DeductionType] [varchar](20) NULL
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[DeductionMasterApprove]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[DeductionMasterApprove](
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_BranchID] [int] NOT NULL,
--	[v_DeductionName] [varchar](40) NOT NULL,
--	[Type] [varchar](255) NULL,
--	[Approve] [varchar](40) NOT NULL,
--	[Pending] [varchar](40) NOT NULL,
--	[Reject] [varchar](40) NOT NULL,
--	[RequestDate] [datetime] NULL,
--	[Responsedate] [datetime] NULL,
--	[Request_User_Id] [varchar](255) NULL,
--	[Response_User_Id] [varchar](255) NULL
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[DeductionValues]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[DeductionValues](
--	[pn_companyid] [int] NOT NULL,
--	[pn_branchid] [int] NOT NULL,
--	[Grade_Name] [varchar](30) NULL,
--	[Level_Name] [varchar](30) NULL,
--	[v_DeductionName] [varchar](40) NULL,
--	[Deductiontype] [varchar](20) NULL,
--	[value] [float] NULL,
--	[d_order] [int] NULL
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[earn_deduct]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[earn_deduct](
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_BranchID] [int] NOT NULL,
--	[ED_ID] [int] IDENTITY(1,1) NOT NULL,
--	[pn_EmployeeID] [int] NOT NULL,
--	[Allowance1] [varchar](30) NULL,
--	[value1] [float] NULL,
--	[Allowance2] [varchar](30) NULL,
--	[value2] [float] NULL,
--	[Allowance3] [varchar](30) NULL,
--	[value3] [float] NULL,
--	[Allowance4] [varchar](30) NULL,
--	[value4] [float] NULL,
--	[Allowance5] [varchar](30) NULL,
--	[value5] [float] NULL,
--	[Allowance6] [varchar](30) NULL,
--	[value6] [float] NULL,
--	[Allowance7] [varchar](30) NULL,
--	[value7] [float] NULL,
--	[Allowance8] [varchar](30) NULL,
--	[value8] [float] NULL,
--	[Allowance9] [varchar](30) NULL,
--	[value9] [float] NULL,
--	[Allowance10] [varchar](30) NULL,
--	[value10] [float] NULL,
--	[Deduction1] [varchar](30) NULL,
--	[valueA1] [float] NULL,
--	[Deduction2] [varchar](30) NULL,
--	[valueA2] [float] NULL,
--	[Deduction3] [varchar](30) NULL,
--	[valueA3] [float] NULL,
--	[Deduction4] [varchar](30) NULL,
--	[valueA4] [float] NULL,
--	[Deduction5] [varchar](30) NULL,
--	[valueA5] [float] NULL,
--	[Deduction6] [varchar](30) NULL,
--	[valueA6] [float] NULL,
--	[Deduction7] [varchar](30) NULL,
--	[valueA7] [float] NULL,
--	[Deduction8] [varchar](30) NULL,
--	[valueA8] [float] NULL,
--	[Deduction9] [varchar](30) NULL,
--	[valueA9] [float] NULL,
--	[Deduction10] [varchar](30) NULL,
--	[valueA10] [float] NULL,
--	[d_date] [datetime] NOT NULL,
--	[d_From_Date] [datetime] NULL,
--	[d_To_Date] [datetime] NULL,
-- CONSTRAINT [pk_earn_deduct] PRIMARY KEY CLUSTERED 
--(
--	[pn_CompanyID] ASC,
--	[pn_BranchID] ASC,
--	[pn_EmployeeID] ASC,
--	[d_date] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[EarnDeductMasters]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[EarnDeductMasters](
--	[pn_CompanyID] [int] NULL,
--	[pn_BranchID] [int] NULL,
--	[Allowance1] [varchar](30) NULL,
--	[Allowance2] [varchar](30) NULL,
--	[Allowance3] [varchar](30) NULL,
--	[Allowance4] [varchar](30) NULL,
--	[Allowance5] [varchar](30) NULL,
--	[Allowance6] [varchar](30) NULL,
--	[Allowance7] [varchar](30) NULL,
--	[Allowance8] [varchar](30) NULL,
--	[Allowance9] [varchar](30) NULL,
--	[Allowance10] [varchar](30) NULL,
--	[Deduction1] [varchar](30) NULL,
--	[Deduction2] [varchar](30) NULL,
--	[Deduction3] [varchar](30) NULL,
--	[Deduction4] [varchar](30) NULL,
--	[Deduction5] [varchar](30) NULL,
--	[Deduction6] [varchar](30) NULL,
--	[Deduction7] [varchar](30) NULL,
--	[Deduction8] [varchar](30) NULL,
--	[Deduction9] [varchar](30) NULL,
--	[Deduction10] [varchar](30) NULL
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[EarnDeductValuesMasters]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[EarnDeductValuesMasters](
--	[pn_CompanyID] [int] NULL,
--	[pn_BranchID] [int] NULL,
--	[pn_EmployeeID] [int] NULL,
--	[ValueType] [varchar](20) NULL,
--	[CTC] [float] NULL,
--	[value1] [float] NULL,
--	[value2] [float] NULL,
--	[value3] [float] NULL,
--	[value4] [float] NULL,
--	[value5] [float] NULL,
--	[value6] [float] NULL,
--	[value7] [float] NULL,
--	[value8] [float] NULL,
--	[value9] [float] NULL,
--	[value10] [float] NULL,
--	[valueA1] [float] NULL,
--	[valueA2] [float] NULL,
--	[valueA3] [float] NULL,
--	[valueA4] [float] NULL,
--	[valueA5] [float] NULL,
--	[valueA6] [float] NULL,
--	[valueA7] [float] NULL,
--	[valueA8] [float] NULL,
--	[valueA9] [float] NULL,
--	[valueA10] [float] NULL
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[employee_Group]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[employee_Group](
--	[id] [int] IDENTITY(1,1) NOT NULL,
--	[employee_code] [varchar](50) NULL,
--	[groupid] [int] NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[id] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
--UNIQUE NONCLUSTERED 
--(
--	[employee_code] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[ESI_Settings]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[ESI_Settings](
--	[pn_CompanyID] [int] NOT NULL,
--	[Effective_Month_From] [varchar](30) NULL,
--	[Effective_From_Year] [int] NULL,
--	[Lower_Limit] [int] NULL,
--	[Upper_Limit] [int] NULL,
--	[Employee_Contribution(%)] [float] NULL,
--	[Employer_Contribution(%)] [float] NULL,
--	[Rounding_Options] [varchar](50) NULL
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[Final_Salary]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[Final_Salary](
--	[id] [int] IDENTITY(1,1) NOT NULL,
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_BranchID] [int] NOT NULL,
--	[pn_EmployeeID] [int] NOT NULL,
--	[EmployeeCode] [nvarchar](50) NULL,
--	[Employee_First_Name] [nvarchar](50) NULL,
--	[DesignationName] [nvarchar](50) NULL,
--	[DepartmentName] [nvarchar](50) NULL,
--	[GradeName] [nvarchar](50) NULL,
--	[CategoryName] [nvarchar](50) NULL,
--	[JoiningDate] [nvarchar](50) NULL,
--	[d_date] [datetime] NULL,
--	[Month] [nvarchar](20) NULL,
--	[Year] [nvarchar](20) NULL,
--	[Earn_Amount] [float] NULL,
--	[Ded_Amount] [float] NULL,
--	[NetPay] [float] NULL,
--	[Earned_Basic] [float] NULL,
--	[Gross_salary] [float] NULL,
--	[Net_salary] [float] NULL,
--	[EPF] [float] NULL,
--	[FPF] [float] NULL,
--	[period_code] [nvarchar](50) NULL,
--	[max_amount] [float] NULL,
--	[Act_Basic] [float] NULL,
--	[Calc_Days] [float] NULL,
--	[Paid_Days] [float] NULL,
--	[Present_Days] [float] NULL,
--	[Absent_Days] [float] NULL,
--	[WeekOffDays] [float] NULL,
--	[Holidays] [float] NULL,
--	[TotLeave_Days] [float] NULL,
--	[ot_hrs] [datetime] NULL,
--	[ot_value] [float] NULL,
--	[ot_amt] [float] NULL,
--	[Allowance1] [nvarchar](50) NULL,
--	[value1] [float] NULL,
--	[Allowance2] [nvarchar](50) NULL,
--	[value2] [float] NULL,
--	[Allowance3] [nvarchar](50) NULL,
--	[value3] [float] NULL,
--	[Allowance4] [nvarchar](50) NULL,
--	[value4] [float] NULL,
--	[Allowance5] [nvarchar](50) NULL,
--	[value5] [float] NULL,
--	[Allowance6] [nvarchar](50) NULL,
--	[value6] [float] NULL,
--	[Allowance7] [nvarchar](50) NULL,
--	[value7] [float] NULL,
--	[Allowance8] [nvarchar](50) NULL,
--	[value8] [float] NULL,
--	[Allowance9] [nvarchar](50) NULL,
--	[value9] [float] NULL,
--	[Allowance10] [nvarchar](50) NULL,
--	[value10] [float] NULL,
--	[Deduction1] [nvarchar](50) NULL,
--	[valueA1] [float] NULL,
--	[Deduction2] [nvarchar](50) NULL,
--	[valueA2] [float] NULL,
--	[Deduction3] [nvarchar](50) NULL,
--	[valueA3] [float] NULL,
--	[Deduction4] [nvarchar](50) NULL,
--	[valueA4] [float] NULL,
--	[Deduction5] [nvarchar](50) NULL,
--	[valueA5] [float] NULL,
--	[Deduction6] [nvarchar](50) NULL,
--	[valueA6] [float] NULL,
--	[Deduction7] [nvarchar](50) NULL,
--	[valueA7] [float] NULL,
--	[Deduction8] [nvarchar](50) NULL,
--	[valueA8] [float] NULL,
--	[Deduction9] [nvarchar](50) NULL,
--	[valueA9] [float] NULL,
--	[Deduction10] [nvarchar](50) NULL,
--	[valueA10] [float] NULL,
--	[CompanyName] [nvarchar](50) NULL,
--	[Address_line1] [nvarchar](500) NULL,
--	[Address_Line2] [nvarchar](500) NULL,
--	[City] [nvarchar](50) NULL,
--	[Zipcode] [int] NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[id] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[form7]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[form7](
--	[Id] [int] IDENTITY(1,1) NOT NULL,
--	[pn_CompanyID] [int] NULL,
--	[pn_BranchID] [int] NULL,
--	[pn_EmployeeID] [varchar](20) NULL,
--	[EmployeeCode] [varchar](20) NULL,
--	[Esino] [varchar](20) NULL,
--	[M1] [int] NULL,
--	[M2] [int] NULL,
--	[M3] [int] NULL,
--	[M4] [int] NULL,
--	[M5] [int] NULL,
--	[M6] [int] NULL,
--	[D1] [float] NULL,
--	[D2] [float] NULL,
--	[D3] [float] NULL,
--	[D4] [float] NULL,
--	[D5] [float] NULL,
--	[D6] [float] NULL,
--	[W1] [float] NULL,
--	[W2] [float] NULL,
--	[W3] [float] NULL,
--	[W4] [float] NULL,
--	[W5] [float] NULL,
--	[W6] [float] NULL,
--	[Esi1] [float] NULL,
--	[Esi2] [float] NULL,
--	[Esi3] [float] NULL,
--	[Esi4] [float] NULL,
--	[Esi5] [float] NULL,
--	[Esi6] [float] NULL,
--	[Empr1] [float] NULL,
--	[Empr2] [float] NULL,
--	[Empr3] [float] NULL,
--	[Empr4] [float] NULL,
--	[Empr5] [float] NULL,
--	[Empr6] [float] NULL,
--	[Totwage] [float] NULL,
--	[TotEsi] [float] NULL,
--	[TotEmpr] [float] NULL,
--	[Disp] [varchar](20) NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[Id] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[GradeSlab_Branch]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[GradeSlab_Branch](
--	[pn_companyid] [int] NULL,
--	[pn_branchid] [int] NULL,
--	[Slab_Type] [varchar](30) NULL,
--	[Grade_Name] [varchar](30) NULL,
--	[Level_Name] [varchar](30) NULL,
--	[Experience_From] [float] NULL,
--	[Experience_To] [varchar](10) NULL,
--	[CTC] [numeric](10, 2) NULL,
--	[Value_type] [varchar](20) NULL,
--	[value1] [float] NULL,
--	[value2] [float] NULL,
--	[value3] [float] NULL,
--	[value4] [float] NULL,
--	[value5] [float] NULL,
--	[value6] [float] NULL,
--	[value7] [float] NULL,
--	[value8] [float] NULL,
--	[value9] [float] NULL,
--	[value10] [float] NULL
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[Group_details]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[Group_details](
--	[GroupID] [int] IDENTITY(1,1) NOT NULL,
--	[Group_name] [varchar](50) NOT NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[GroupID] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[Group_Settings]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[Group_Settings](
--	[Settings_id] [int] IDENTITY(1,1) NOT NULL,
--	[groupid] [int] NULL,
--	[emp_EPF] [float] NULL,
--	[emp_FPF] [float] NULL,
--	[Ded_Amount] [float] NULL,
--	[Earned_Amount] [float] NULL,
--	[Gross_salary] [float] NULL,
--	[Basic_salary] [float] NULL,
--	[Net_salary] [float] NULL,
--	[vpfamount] [money] NULL,
--	[shift_code] [varchar](25) NULL,
--	[Allowance1] [varchar](30) NULL,
--	[Value1] [float] NULL,
--	[Allowance2] [varchar](30) NULL,
--	[value2] [float] NULL,
--	[Allowance3] [varchar](30) NULL,
--	[Value3] [float] NULL,
--	[Allowance4] [varchar](30) NULL,
--	[Value4] [float] NULL,
--	[Allowance5] [varchar](30) NULL,
--	[Value5] [float] NULL,
--	[Allowance6] [varchar](30) NULL,
--	[Value6] [float] NULL,
--	[Allowance7] [varchar](30) NULL,
--	[Value7] [float] NULL,
--	[Allowance8] [varchar](30) NULL,
--	[Value8] [float] NULL,
--	[Allowance9] [varchar](30) NULL,
--	[Value9] [float] NULL,
--	[Allowance10] [varchar](30) NULL,
--	[Value10] [float] NULL,
--	[Deduction1] [varchar](30) NULL,
--	[valueA1] [float] NULL,
--	[Deduction2] [varchar](30) NULL,
--	[valueA2] [float] NULL,
--	[Deduction3] [varchar](30) NULL,
--	[valueA3] [float] NULL,
--	[Deduction4] [varchar](30) NULL,
--	[valueA4] [float] NULL,
--	[Deduction5] [varchar](30) NULL,
--	[valueA5] [float] NULL,
--	[Deduction6] [varchar](30) NULL,
--	[valueA6] [float] NULL,
--	[Deduction7] [varchar](30) NULL,
--	[valueA7] [float] NULL,
--	[Deduction8] [varchar](30) NULL,
--	[valueA8] [float] NULL,
--	[Deduction9] [varchar](30) NULL,
--	[valueA9] [float] NULL,
--	[Deduction10] [varchar](30) NULL,
--	[valueA10] [float] NULL,
--	[medical] [int] NULL,
--	[official] [int] NULL,
--	[casual] [int] NULL,
--	[personnel] [varchar](30) NULL,
--	[maternity] [varchar](30) NULL,
--	[Earned] [varchar](30) NULL,
--	[Admin_Charges] [float] NULL,
--	[NetPay] [float] NULL,
--	[Earned_Basic] [float] NULL,
--	[max_amount] [float] NULL,
--	[emp_PF] [float] NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[Settings_id] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[hr_authentication]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[hr_authentication](
--	[Id] [int] IDENTITY(1,1) NOT NULL,
--	[pn_CompanyID] [int] NULL,
--	[pn_BranchID] [int] NULL,
--	[SectionID] [int] NULL,
--	[section_view] [varchar](3) NULL,
--	[section_edit] [varchar](3) NULL,
--	[section_delete] [varchar](3) NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[Id] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[hrmm_Course]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[hrmm_Course](
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_CourseID] [int] IDENTITY(1,1) NOT NULL,
--	[v_CourseName] [varchar](40) NOT NULL,
--	[status] [char](1) NULL,
--	[BranchID] [int] NULL,
-- CONSTRAINT [pk_hrmm_Course] PRIMARY KEY CLUSTERED 
--(
--	[pn_CompanyID] ASC,
--	[pn_CourseID] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[hrmm_SkillsMaster]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[hrmm_SkillsMaster](
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_SkillID] [int] IDENTITY(1,1) NOT NULL,
--	[v_SkillName] [varchar](40) NULL,
--	[status] [char](1) NULL,
--	[BranchID] [int] NULL,
-- CONSTRAINT [pk_hrmm_SkillsMaster] PRIMARY KEY CLUSTERED 
--(
--	[pn_CompanyID] ASC,
--	[pn_SkillID] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[hrmm_Specialization]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[hrmm_Specialization](
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_SpecializationId] [int] IDENTITY(1,1) NOT NULL,
--	[v_SpecializationName] [varchar](40) NOT NULL,
--	[status] [char](1) NULL,
--	[pn_BranchID] [int] NULL,
-- CONSTRAINT [pk_hrmm_Specialization] PRIMARY KEY CLUSTERED 
--(
--	[pn_CompanyID] ASC,
--	[pn_SpecializationId] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[late_deduction_minutes]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[late_deduction_minutes](
--	[Minutes_ID] [int] IDENTITY(1,1) NOT NULL,
--	[pn_CompanyID] [int] NULL,
--	[pn_BranchID] [int] NULL,
--	[minutes_per_count] [int] NULL,
--	[from_minutes] [time](3) NOT NULL,
--	[to_minutes] [time](3) NOT NULL,
--	[count] [decimal](2, 1) NOT NULL,
--	[deduction] [varchar](25) NOT NULL
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[late_deduction_time]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[late_deduction_time](
--	[Time_ID] [int] IDENTITY(1,1) NOT NULL,
--	[pn_CompanyID] [int] NULL,
--	[pn_BranchID] [int] NULL,
--	[from_minutes] [time](3) NOT NULL,
--	[to_minutes] [time](3) NOT NULL,
--	[deduction] [varchar](25) NOT NULL
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[leave_apply]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[leave_apply](
--	[pn_CompanyID] [int] NULL,
--	[pn_BranchID] [int] NULL,
--	[pn_EmployeeID] [int] NULL,
--	[Emp_code] [varchar](10) NULL,
--	[Emp_name] [varchar](50) NULL,
--	[pn_LeaveID] [int] NULL,
--	[pn_Leavename] [varchar](50) NULL,
--	[pn_leavecode] [varchar](20) NULL,
--	[from_date] [datetime] NULL,
--	[from_status] [varchar](2) NULL,
--	[to_date] [datetime] NULL,
--	[status] [varchar](2) NULL,
--	[days] [float] NULL,
--	[reason] [varchar](50) NULL,
--	[submitted_date] [datetime] NULL,
--	[approve] [varchar](10) NULL,
--	[reminder] [datetime] NULL,
--	[priority] [varchar](10) NULL,
--	[comments] [varchar](100) NULL,
--	[record] [varchar](10) NULL,
--	[flag] [char](1) NULL,
--	[yearend] [int] NULL,
--	[sno] [int] IDENTITY(1,1) NOT NULL,
--	[attachfile] [varbinary](max) NULL,
-- CONSTRAINT [pkleave_apply] PRIMARY KEY CLUSTERED 
--(
--	[sno] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[leave_settlement]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[leave_settlement](
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_BranchID] [int] NOT NULL,
--	[pn_EmployeeID] [int] NOT NULL,
--	[pn_LeaveID] [int] NULL,
--	[pn_leavecode] [varchar](5) NOT NULL,
--	[days_allowed] [int] NULL,
--	[days_taken] [int] NULL,
--	[days_balance] [int] NULL,
--	[Ec] [char](1) NULL,
--	[Cf] [char](1) NULL,
--	[max_days] [int] NULL,
--	[flag] [char](1) NULL,
--	[calendar_year] [varchar](12) NOT NULL,
-- CONSTRAINT [pk_settlement] PRIMARY KEY CLUSTERED 
--(
--	[pn_CompanyID] ASC,
--	[pn_BranchID] ASC,
--	[pn_leavecode] ASC,
--	[pn_EmployeeID] ASC,
--	[calendar_year] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[leaveallocation_master]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[leaveallocation_master](
--	[Id] [int] IDENTITY(1,1) NOT NULL,
--	[pn_CompanyID] [int] NULL,
--	[pn_BranchID] [int] NULL,
--	[pn_leaveID] [int] NULL,
--	[pn_EmployeeID] [int] NULL,
--	[Category] [varchar](30) NULL,
--	[Sub_Category] [varchar](30) NULL,
--	[n_count] [int] NULL,
--	[Yearend] [int] NULL,
--	[Medical] [int] NULL,
--	[Official] [int] NULL,
--	[Casual] [int] NULL,
--	[ssss] [varchar](30) NULL,
--	[personnel] [varchar](30) NULL,
--	[personel] [varchar](30) NULL,
--	[maternity] [varchar](30) NULL,
--	[Earned] [varchar](30) NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[Id] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[leaveapprove_hr]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[leaveapprove_hr](
--	[sno] [int] IDENTITY(1,1) NOT NULL,
--	[pn_companyId] [int] NULL,
--	[pn_BranchId] [int] NULL,
--	[Emp_Id] [int] NULL,
--	[Empcode] [varchar](50) NULL,
--	[Emp_name] [varchar](100) NULL,
--	[pn_LeaveId] [int] NULL,
--	[pn_Leavecode] [varchar](50) NULL,
--	[pn_leaveName] [varchar](100) NULL,
--	[from_date] [datetime] NULL,
--	[To_date] [datetime] NULL,
--	[Submitted_date] [datetime] NULL,
--	[from_status] [varchar](20) NULL,
--	[To_status] [varchar](20) NULL,
--	[Approve] [varchar](30) NULL,
--	[YearEnd] [varchar](10) NULL,
--	[dayss] [int] NULL,
--	[pn_DesignationId] [int] NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[sno] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[leaveapprove_manager]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[leaveapprove_manager](
--	[sno] [int] IDENTITY(1,1) NOT NULL,
--	[pn_companyId] [int] NULL,
--	[pn_BranchId] [int] NULL,
--	[Emp_Id] [int] NULL,
--	[Empcode] [varchar](50) NULL,
--	[Emp_name] [varchar](100) NULL,
--	[pn_LeaveId] [int] NULL,
--	[pn_Leavecode] [varchar](50) NULL,
--	[pn_leaveName] [varchar](100) NULL,
--	[from_date] [datetime] NULL,
--	[To_date] [datetime] NULL,
--	[Submitted_date] [datetime] NULL,
--	[from_status] [varchar](20) NULL,
--	[To_status] [varchar](20) NULL,
--	[Approve] [varchar](30) NULL,
--	[YearEnd] [varchar](10) NULL,
--	[dayss] [int] NULL,
--	[pn_DesignationId] [int] NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[sno] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[LeaveSandwichingSettings]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[LeaveSandwichingSettings](
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_BranchID] [int] NULL,
--	[id] [int] IDENTITY(1,1) NOT NULL,
--	[weekend_days] [nvarchar](255) NULL,
--	[selected_days] [nvarchar](255) NULL,
--	[created_at] [datetime] NULL,
--	[Include_PaidLeaves] [bit] NULL
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[loan_post]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[loan_post](
--	[loan_reqno] [varchar](20) NOT NULL,
--	[req_date] [datetime] NULL,
--	[employeeid] [int] NULL,
--	[employeename] [varchar](20) NULL,
--	[loan_appid] [varchar](20) NULL,
--	[loan_type] [varchar](20) NULL,
--	[loan_name] [varchar](20) NULL,
--	[loan_amount] [decimal](8, 2) NULL,
--	[month_to_posted] [datetime] NULL,
--	[month_posted_on] [datetime] NULL,
--	[rem_month] [int] NULL,
--	[postedamt] [decimal](8, 2) NULL,
--	[balance_amt] [decimal](8, 2) NULL,
--	[approve_by] [varchar](20) NULL,
--	[pn_companyid] [int] NULL,
--	[pn_branchid] [int] NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[loan_reqno] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[Loan_PreCloser]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[Loan_PreCloser](
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_BranchID] [int] NOT NULL,
--	[pn_EmployeeID] [int] NOT NULL,
--	[loan_appid] [varchar](20) NOT NULL,
--	[d_date] [datetime] NOT NULL,
--	[n_loanamount] [decimal](8, 2) NULL,
--	[n_balanceamount] [float] NULL,
--	[n_paidamount] [float] NULL,
--	[n_closureamount] [float] NULL,
--	[n_checkno] [varchar](20) NULL,
--	[d_checkdate] [datetime] NULL,
--	[n_checkamount] [float] NULL,
--	[v_bankname] [varchar](20) NULL,
--	[v_Remarks] [varchar](20) NULL,
--	[c_status] [char](1) NULL,
--	[int_amt] [decimal](8, 2) NULL,
--	[payment_mode] [varchar](20) NULL,
--	[loan_process] [varchar](20) NULL,
--	[loan_interest] [decimal](8, 2) NULL,
--	[loan_name] [varchar](20) NULL,
-- CONSTRAINT [pk_loan_appid] PRIMARY KEY CLUSTERED 
--(
--	[loan_appid] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[LoanEntry]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[LoanEntry](
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_BranchID] [int] NOT NULL,
--	[pn_EmployeeID] [int] NOT NULL,
--	[Loan_AutoID] [varchar](20) NULL,
--	[fn_LoanID] [int] NOT NULL,
--	[san_date] [datetime] NULL,
--	[d_effdate] [datetime] NULL,
--	[Loan_Amt] [decimal](8, 2) NULL,
--	[InstalmentAmt] [decimal](8, 2) NULL,
--	[Instalmentcount] [int] NULL,
--	[Balance_Amt] [decimal](8, 2) NULL,
--	[c_status] [char](1) NULL,
--	[loan_name] [varchar](20) NULL,
--	[loan_process] [varchar](20) NULL,
--	[loan_calculation] [varchar](20) NULL,
--	[comments] [varchar](50) NULL,
--	[loan_appid] [varchar](20) NOT NULL,
--	[interest] [decimal](8, 2) NULL,
--	[tot_interest_amt] [decimal](8, 2) NULL,
--	[emp_name] [varchar](30) NULL,
--	[loan_status] [char](20) NULL,
--	[lasttransaction_from] [datetime] NULL,
--	[lasttransaction_to] [datetime] NULL,
-- CONSTRAINT [loan_key] PRIMARY KEY CLUSTERED 
--(
--	[loan_appid] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[LoanPostponed]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[LoanPostponed](
--	[PostponementID] [int] IDENTITY(1,1) NOT NULL,
--	[ApplicationID] [int] NOT NULL,
--	[pn_companyid] [int] NULL,
--	[pn_branchid] [int] NULL,
--	[employeeid] [int] NULL,
--	[employeename] [varchar](20) NULL,
--	[loan_type] [varchar](20) NULL,
--	[loan_amount] [decimal](8, 2) NULL,
--	[req_date] [datetime] NULL,
--	[postedamt] [decimal](8, 2) NULL,
--	[ApprovalStatus] [varchar](50) NOT NULL,
--	[month_to_posted] [date] NULL,
--	[Remarks] [varchar](200) NULL
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[LoanPreclosure]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[LoanPreclosure](
--	[PreclosureID] [int] IDENTITY(1,1) NOT NULL,
--	[ApplicationID] [int] NOT NULL,
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_BranchID] [int] NOT NULL,
--	[pn_EmployeeID] [int] NOT NULL,
--	[PreclosureAmount] [decimal](18, 2) NOT NULL,
--	[PaidDate] [date] NULL,
--	[Status] [varchar](20) NOT NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[PreclosureID] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[LoanRepayment]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[LoanRepayment](
--	[RepaymentID] [int] IDENTITY(1,1) NOT NULL,
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_BranchID] [int] NOT NULL,
--	[pn_EmployeeID] [int] NOT NULL,
--	[ApplicationID] [int] NOT NULL,
--	[LoanAmount] [decimal](18, 2) NOT NULL,
--	[InterestRate] [decimal](5, 2) NOT NULL,
--	[Totalamount] [decimal](18, 2) NULL,
--	[EMIAmount] [decimal](18, 2) NOT NULL,
--	[TotalPaidAmout] [decimal](18, 2) NULL,
--	[RemainingAmount] [decimal](18, 2) NULL,
--	[ScheduledPaymentDate] [date] NOT NULL,
--	[PaymentDate] [date] NULL,
--	[PaymentStatus] [varchar](20) NOT NULL,
--	[Remarks] [varchar](200) NULL
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[medicalslip]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[medicalslip](
--	[id] [int] IDENTITY(1,1) NOT NULL,
--	[Date_of_service] [varchar](50) NULL,
--	[Hospital_Name] [varchar](50) NULL,
--	[Amount] [float] NULL,
--	[Medicalbills] [text] NULL,
--	[pn_EmployeeID] [int] NULL,
--	[EmployeeCode] [varchar](50) NULL,
--	[Employee_Full_Name] [varchar](70) NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[id] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[onduty]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[onduty](
--	[sno] [int] IDENTITY(1,1) NOT NULL,
--	[Ref_no] [varchar](20) NOT NULL,
--	[pn_companyid] [int] NOT NULL,
--	[pn_branchid] [int] NOT NULL,
--	[empid] [varchar](50) NULL,
--	[empname] [varchar](50) NULL,
--	[onduty_dat] [datetime] NOT NULL,
--	[fstatus] [varchar](15) NULL,
--	[todat] [datetime] NOT NULL,
--	[tstatus] [varchar](15) NULL,
--	[tot_days] [float] NULL,
--	[sub_dat] [datetime] NOT NULL,
--	[reason] [varchar](30) NULL,
--	[priority] [varchar](10) NULL,
--	[approval] [varchar](10) NULL,
--	[Message1] [varchar](500) NULL,
--	[Message2] [varchar](500) NULL,
--	[Message3] [varchar](500) NULL,
--	[Message4] [varchar](500) NULL,
-- CONSTRAINT [pk_paym_onduty] PRIMARY KEY CLUSTERED 
--(
--	[pn_companyid] ASC,
--	[pn_branchid] ASC,
--	[Ref_no] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[otslab]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[otslab](
--	[pn_companyid] [int] NOT NULL,
--	[pn_branchid] [int] NOT NULL,
--	[slab_id] [int] IDENTITY(1,1) NOT NULL,
--	[ot_from] [time](3) NOT NULL,
--	[ot_to] [time](3) NOT NULL,
--	[ot_slab] [time](3) NOT NULL,
--	[pn_category] [varchar](30) NOT NULL,
--	[ot_hrs] [decimal](2, 1) NOT NULL,
-- CONSTRAINT [pk_otslab] PRIMARY KEY CLUSTERED 
--(
--	[pn_companyid] ASC,
--	[pn_branchid] ASC,
--	[ot_from] ASC,
--	[ot_to] ASC,
--	[pn_category] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[OtslabNew]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[OtslabNew](
--	[pn_companyid] [int] NOT NULL,
--	[pn_branchid] [int] NOT NULL,
--	[Category_Name] [varchar](30) NOT NULL,
--	[SlabID] [int] NOT NULL,
--	[Ot_From_Duration] [time](3) NOT NULL,
--	[Ot_To_Duration] [time](3) NOT NULL,
--	[Ot_Rate] [decimal](2, 1) NOT NULL,
--	[oT_Hrs] [time](3) NULL
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[PayInput]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[PayInput](
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_BranchID] [int] NOT NULL,
--	[pn_EmployeeID] [int] NOT NULL,
--	[d_Date] [datetime] NOT NULL,
--	[d_From_Date] [datetime] NULL,
--	[d_To_Date] [datetime] NULL,
--	[Calc_Days] [float] NULL,
--	[Paid_Days] [float] NULL,
--	[Present_Days] [float] NULL,
--	[Absent_Days] [float] NULL,
--	[TotLeave_Days] [float] NULL,
--	[WeekOffDays] [float] NULL,
--	[Holidays] [float] NULL,
--	[OnDuty_days] [float] NULL,
--	[Compoff_Days] [float] NULL,
--	[Tour_Days] [float] NULL,
--	[Att_Bonus] [char](1) NULL,
--	[Att_BonusAmount] [float] NULL,
--	[OT_HRS] [time](3) NULL,
--	[Earn_Arrears] [float] NULL,
--	[Ded_Arrears] [float] NULL,
--	[ot_value] [float] NULL,
--	[ot_Amt] [float] NULL,
--	[Act_Basic] [float] NULL,
--	[Earn_Basic] [float] NULL,
--	[Mode] [char](1) NULL,
--	[Flag] [char](1) NULL,
--	[PT_Gross] [float] NULL,
-- CONSTRAINT [pk_PayInput] PRIMARY KEY CLUSTERED 
--(
--	[pn_CompanyID] ASC,
--	[pn_BranchID] ASC,
--	[pn_EmployeeID] ASC,
--	[d_Date] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[paym_attbonus]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[paym_attbonus](
--	[pn_CompanyId] [int] NULL,
--	[pn_BranchId] [int] NULL,
--	[AttbonusId] [int] IDENTITY(1,1) NOT NULL,
--	[CategoryId] [varchar](20) NULL,
--	[CategoryName] [varchar](30) NULL,
--	[Fullatt] [decimal](7, 2) NULL,
--	[Halfatt] [decimal](7, 2) NULL,
--	[Oneatt] [decimal](7, 2) NULL
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[paym_Bank]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[paym_Bank](
--	[pn_BankID] [int] IDENTITY(1,1) NOT NULL,
--	[v_BankName] [varchar](50) NULL,
--	[v_BankCode] [varchar](50) NULL,
--	[status] [char](1) NULL,
--	[pn_CompanyID] [int] NULL,
--	[pn_BranchID] [int] NULL,
--	[Branch_Name] [varchar](50) NULL,
--	[Account_Type] [varchar](20) NULL,
--	[Micr_Code] [varchar](20) NULL,
--	[Ifsc_Code] [varchar](20) NULL,
--	[Address] [varchar](100) NULL,
--	[others] [varchar](500) NULL,
-- CONSTRAINT [pk_paym_Bank] PRIMARY KEY CLUSTERED 
--(
--	[pn_BankID] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[paym_Branch]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[paym_Branch](
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_BranchID] [int] IDENTITY(1,1) NOT NULL,
--	[BranchCode] [varchar](20) NULL,
--	[BranchName] [varchar](50) NULL,
--	[Address_Line1] [varchar](100) NULL,
--	[Address_Line2] [varchar](100) NULL,
--	[City] [varchar](50) NULL,
--	[ZipCode] [varchar](50) NULL,
--	[Country] [varchar](100) NULL,
--	[State] [varchar](100) NULL,
--	[Phone_No] [varchar](50) NULL,
--	[Fax_No] [varchar](50) NULL,
--	[Email_Id] [varchar](100) NULL,
--	[AlternateEmail_Id] [varchar](100) NULL,
--	[Branch_User_Id] [varchar](10) NULL,
--	[Branch_Password] [varchar](10) NULL,
--	[status] [varchar](40) NULL,
--	[start_date] [datetime] NULL,
--	[end_date] [datetime] NULL,
--	[BranchType] [varchar](100) NULL,
--	[can_manage_department] [bit] NULL,
--	[can_manage_designation] [bit] NULL,
-- CONSTRAINT [pk_paym_Branch] PRIMARY KEY CLUSTERED 
--(
--	[pn_CompanyID] ASC,
--	[pn_BranchID] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[paym_CarryForward]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[paym_CarryForward](
--	[id] [int] IDENTITY(1,1) NOT NULL,
--	[pn_CompanyId] [int] NOT NULL,
--	[pn_BranchId] [int] NOT NULL,
--	[pn_EmployeeId] [int] NOT NULL,
--	[Pn_LeaveId] [int] NOT NULL,
--	[Allow_Days] [decimal](18, 0) NOT NULL,
--	[Taken_Days] [decimal](18, 0) NOT NULL,
--	[Max_Days] [decimal](18, 0) NOT NULL,
--	[Bal_Days] [decimal](18, 0) NOT NULL,
--	[Date] [datetime] NOT NULL,
--	[YearEnd] [varchar](50) NOT NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[id] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[paym_Category]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[paym_Category](
--	[pn_CompanyID] [int] NOT NULL,
--	[BranchID] [int] NOT NULL,
--	[pn_CategoryID] [int] IDENTITY(1,1) NOT NULL,
--	[v_CategoryName] [varchar](40) NOT NULL,
--	[status] [varchar](20) NULL,
-- CONSTRAINT [PK_paym_Category] PRIMARY KEY CLUSTERED 
--(
--	[pn_CompanyID] ASC,
--	[BranchID] ASC,
--	[pn_CategoryID] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[paym_Company]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[paym_Company](
--	[pn_CompanyID] [int] IDENTITY(1,1) NOT NULL,
--	[CompanyCode] [varchar](20) NULL,
--	[CompanyName] [varchar](50) NULL,
--	[Address_Line1] [varchar](100) NULL,
--	[Address_Line2] [varchar](100) NULL,
--	[City] [varchar](50) NULL,
--	[ZipCode] [varchar](50) NULL,
--	[Country] [varchar](100) NULL,
--	[State] [varchar](100) NULL,
--	[Phone_No] [varchar](50) NULL,
--	[Fax_No] [varchar](50) NULL,
--	[Email_Id] [varchar](100) NULL,
--	[AlternateEmail_Id] [varchar](100) NULL,
--	[start_date] [datetime] NULL,
--	[end_date] [datetime] NULL,
--	[Company_User_Id] [varchar](25) NULL,
--	[Company_Password] [varchar](25) NULL,
--	[GSTNumber] [varchar](100) NULL,
--	[WebsiteURL] [varchar](250) NULL,
--	[ContactPerson] [varchar](200) NULL,
--	[CompanyLogo] [varchar](max) NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[pn_CompanyID] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[paym_Computation]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[paym_Computation](
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_BranchID] [int] NOT NULL,
--	[id] [int] IDENTITY(1,1) NOT NULL,
--	[Type] [varchar](20) NULL,
--	[pn_EarningsCode] [varchar](50) NOT NULL,
--	[Value] [float] NULL,
-- CONSTRAINT [pk_paym_Computation] PRIMARY KEY CLUSTERED 
--(
--	[pn_CompanyID] ASC,
--	[pn_BranchID] ASC,
--	[pn_EarningsCode] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[paym_Deduction]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[paym_Deduction](
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_BranchID] [int] NOT NULL,
--	[pn_DeductionID] [int] IDENTITY(1,1) NOT NULL,
--	[v_DeductionCode] [varchar](40) NOT NULL,
--	[v_DeductionName] [varchar](40) NOT NULL,
--	[c_Regular] [char](1) NULL,
--	[c_Print] [char](1) NULL,
--	[status] [char](1) NULL,
--	[d_order] [int] NULL,
-- CONSTRAINT [pk_paym_Deduction] PRIMARY KEY CLUSTERED 
--(
--	[pn_CompanyID] ASC,
--	[pn_DeductionID] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[paym_Department]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[paym_Department](
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_BranchID] [int] NOT NULL,
--	[pn_DepartmentID] [int] IDENTITY(1,1) NOT NULL,
--	[v_DepartmentName] [varchar](40) NOT NULL,
--	[status] [varchar](20) NULL,
-- CONSTRAINT [PK_paym_Department] PRIMARY KEY CLUSTERED 
--(
--	[pn_CompanyID] ASC,
--	[pn_BranchID] ASC,
--	[pn_DepartmentID] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[paym_Designation]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[paym_Designation](
--	[pn_CompanyID] [int] NOT NULL,
--	[BranchID] [int] NOT NULL,
--	[pn_DesignationID] [int] IDENTITY(1,1) NOT NULL,
--	[v_DesignationName] [varchar](40) NOT NULL,
--	[Authority] [varchar](20) NULL,
--	[status] [varchar](20) NULL,
-- CONSTRAINT [PK_paym_Designation_1] PRIMARY KEY CLUSTERED 
--(
--	[pn_CompanyID] ASC,
--	[BranchID] ASC,
--	[v_DesignationName] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[paym_Division]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[paym_Division](
--	[pn_CompanyID] [int] NOT NULL,
--	[BranchID] [int] NOT NULL,
--	[pn_DivisionID] [int] IDENTITY(1,1) NOT NULL,
--	[v_DivisionName] [varchar](40) NOT NULL,
--	[status] [char](1) NULL,
-- CONSTRAINT [PK_paym_Division_1] PRIMARY KEY CLUSTERED 
--(
--	[pn_CompanyID] ASC,
--	[BranchID] ASC,
--	[v_DivisionName] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[paym_Earnings]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[paym_Earnings](
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_EarningsID] [int] IDENTITY(1,1) NOT NULL,
--	[v_EarningsCode] [varchar](40) NOT NULL,
--	[v_EarningsName] [varchar](40) NULL,
--	[c_Regular] [char](1) NULL,
--	[c_PF] [char](1) NULL,
--	[c_ESI] [char](1) NULL,
--	[c_OT] [char](1) NULL,
--	[c_LOP] [char](1) NULL,
--	[c_PT] [char](1) NULL,
--	[c_Print] [char](1) NULL,
--	[payslip] [char](1) NULL,
--	[status] [char](1) NULL,
--	[d_order] [int] NULL,
--	[pn_BranchID] [int] NULL,
-- CONSTRAINT [pk_paym_Earnings] PRIMARY KEY CLUSTERED 
--(
--	[pn_CompanyID] ASC,
--	[pn_EarningsID] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[paym_Emp_Deduction]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[paym_Emp_Deduction](
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_BranchID] [int] NOT NULL,
--	[pn_EmployeeID] [int] NOT NULL,
--	[pn_DeductionID] [int] NOT NULL,
--	[n_Amount] [float] NULL,
--	[d_Date] [datetime] NOT NULL,
--	[c_eligible] [char](1) NULL,
--	[from_date] [datetime] NULL,
--	[to_date] [datetime] NULL,
--	[period_code] [varchar](10) NULL,
-- CONSTRAINT [pk_paym_Emp_Deduction] PRIMARY KEY CLUSTERED 
--(
--	[pn_CompanyID] ASC,
--	[pn_BranchID] ASC,
--	[pn_EmployeeID] ASC,
--	[pn_DeductionID] ASC,
--	[d_Date] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[paym_Emp_Earnings]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[paym_Emp_Earnings](
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_BranchID] [int] NOT NULL,
--	[pn_EmployeeID] [int] NOT NULL,
--	[pn_EarningsID] [int] NOT NULL,
--	[Pid] [int] NOT NULL,
--	[ID] [int] IDENTITY(1,1) NOT NULL,
--	[n_Amount] [int] NULL,
--	[d_Date] [datetime] NOT NULL,
--	[c_eligible] [char](1) NULL,
--	[from_date] [datetime] NULL,
--	[to_date] [datetime] NULL,
--	[Flag] [char](1) NULL,
-- CONSTRAINT [pk_paym_Emp_Earnings] PRIMARY KEY CLUSTERED 
--(
--	[pn_CompanyID] ASC,
--	[pn_BranchID] ASC,
--	[pn_EmployeeID] ASC,
--	[pn_EarningsID] ASC,
--	[Pid] ASC,
--	[d_Date] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[paym_Employee_leave]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[paym_Employee_leave](
--	[id] [int] IDENTITY(1,1) NOT NULL,
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_BranchID] [int] NOT NULL,
--	[pn_EmployeeID] [int] NOT NULL,
--	[pn_leaveID] [int] NOT NULL,
--	[From_Date] [datetime] NULL,
--	[To_Date] [datetime] NULL,
--	[From_Status] [varchar](5) NULL,
--	[To_Status] [varchar](5) NULL,
--	[Leave_Count] [float] NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[id] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[paym_employee_profile1]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[paym_employee_profile1](
--	[Id] [int] IDENTITY(1,1) NOT NULL,
--	[pn_CompanyID] [int] NULL,
--	[pn_BranchID] [int] NULL,
--	[pn_EmployeeID] [int] NULL,
--	[pn_DivisionId] [int] NULL,
--	[pn_DepartmentId] [int] NULL,
--	[pn_DesignationId] [int] NULL,
--	[pn_GradeId] [int] NULL,
--	[pn_ShiftId] [int] NULL,
--	[pn_CategoryId] [int] NULL,
--	[pn_JobStatusId] [int] NULL,
--	[pn_LevelID] [int] NULL,
--	[pn_projectsiteID] [int] NULL,
--	[d_Date] [datetime] NULL,
--	[v_Reason] [varchar](500) NULL,
--	[r_Department] [int] NULL,
--	[father_name] [varchar](40) NULL,
--	[Emp_Profile_Image] [varchar](max) NULL,
--	[image_data] [varchar](max) NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[Id] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[paym_Employee_WorkDetails]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[paym_Employee_WorkDetails](
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_BranchID] [int] NOT NULL,
--	[pn_EmployeeID] [int] NOT NULL,
--	[JoiningDate] [datetime] NULL,
--	[OfferDate] [datetime] NULL,
--	[ProbationUpto] [datetime] NULL,
--	[ExtendedUpto] [datetime] NULL,
--	[ConfirmationDate] [datetime] NULL,
--	[RetirementDate] [datetime] NULL,
--	[ContractRenviewDate] [datetime] NULL,
--	[v_Reason] [varchar](200) NULL,
-- CONSTRAINT [pk_paym_Employee_workdetails] PRIMARY KEY CLUSTERED 
--(
--	[pn_CompanyID] ASC,
--	[pn_BranchID] ASC,
--	[pn_EmployeeID] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[paym_EncashmentDetails]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[paym_EncashmentDetails](
--	[id] [int] IDENTITY(1,1) NOT NULL,
--	[pn_CompanyId] [int] NULL,
--	[pn_BranchId] [int] NULL,
--	[pn_EmployeeId] [int] NULL,
--	[Pn_LeaveId] [int] NULL,
--	[Allow_Days] [decimal](18, 0) NULL,
--	[Taken_Days] [decimal](18, 0) NULL,
--	[Max_Days] [decimal](18, 0) NULL,
--	[Bal_Days] [decimal](18, 0) NULL,
--	[Basic_PerDay] [decimal](18, 0) NULL,
--	[Total_Amt] [decimal](18, 0) NULL,
--	[Date] [datetime] NULL,
--	[YearEnd] [varchar](50) NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[id] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[paym_Grade]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[paym_Grade](
--	[pn_CompanyID] [int] NOT NULL,
--	[BranchID] [int] NOT NULL,
--	[pn_GradeID] [int] IDENTITY(1,1) NOT NULL,
--	[v_GradeName] [varchar](40) NOT NULL,
--	[status] [varchar](20) NULL,
-- CONSTRAINT [PK_paym_Grade_1] PRIMARY KEY CLUSTERED 
--(
--	[pn_CompanyID] ASC,
--	[BranchID] ASC,
--	[v_GradeName] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[paym_holiday]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[paym_holiday](
--	[id] [int] IDENTITY(1,1) NOT NULL,
--	[pn_CompanyID] [int] NULL,
--	[pn_BranchID] [int] NULL,
--	[pn_Holidaycode] [varchar](10) NULL,
--	[pn_Holidayname] [varchar](30) NULL,
--	[Fyear] [int] NULL,
--	[From_date] [datetime] NULL,
--	[To_date] [datetime] NULL,
--	[days] [int] NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[id] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[paym_JobStatus]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[paym_JobStatus](
--	[pn_CompanyID] [int] NOT NULL,
--	[BranchID] [int] NOT NULL,
--	[pn_JobStatusID] [int] IDENTITY(1,1) NOT NULL,
--	[v_JobStatusName] [varchar](40) NOT NULL,
--	[status] [varchar](20) NULL,
-- CONSTRAINT [PK_paym_JobStatus_1] PRIMARY KEY CLUSTERED 
--(
--	[pn_CompanyID] ASC,
--	[BranchID] ASC,
--	[v_JobStatusName] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[paym_leave]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[paym_leave](
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_leaveID] [int] IDENTITY(1,1) NOT NULL,
--	[v_leaveName] [varchar](40) NOT NULL,
--	[pn_leaveCode] [varchar](10) NULL,
--	[pn_Count] [int] NULL,
--	[status] [varchar](20) NULL,
--	[pn_BranchID] [int] NULL,
--	[max_days] [int] NULL,
--	[Type] [varchar](10) NULL
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[paym_leaveAllocation1]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[paym_leaveAllocation1](
--	[pn_companyid] [int] NOT NULL,
--	[pn_branchid] [int] NOT NULL,
--	[pn_leaveid] [int] NOT NULL,
--	[pn_employeeid] [int] NOT NULL,
--	[n_count] [float] NULL,
--	[cy_count] [float] NULL,
--	[Leaveby] [varchar](50) NULL,
--	[yearend] [int] NOT NULL,
-- CONSTRAINT [PK_paym_leaveAllocation1] PRIMARY KEY CLUSTERED 
--(
--	[pn_companyid] ASC,
--	[pn_branchid] ASC,
--	[pn_leaveid] ASC,
--	[pn_employeeid] ASC,
--	[yearend] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[paym_Level]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[paym_Level](
--	[pn_CompanyID] [int] NOT NULL,
--	[BranchID] [int] NOT NULL,
--	[pn_LevelID] [int] IDENTITY(1,1) NOT NULL,
--	[v_LevelName] [varchar](40) NOT NULL,
--	[status] [varchar](20) NULL,
-- CONSTRAINT [PK_paym_Level_1] PRIMARY KEY CLUSTERED 
--(
--	[pn_CompanyID] ASC,
--	[BranchID] ASC,
--	[v_LevelName] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[paym_Loan]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[paym_Loan](
--	[pn_Companyid] [int] NOT NULL,
--	[pn_LoanID] [int] IDENTITY(1,1) NOT NULL,
--	[v_LoanName] [varchar](50) NULL,
--	[v_LoanCode] [varchar](50) NULL,
--	[status] [varchar](30) NULL,
--	[Pn_BranchID] [int] NULL,
--	[v_LoanType] [varchar](100) NULL,
-- CONSTRAINT [pk_paym_loan] PRIMARY KEY CLUSTERED 
--(
--	[pn_Companyid] ASC,
--	[pn_LoanID] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[paym_loan_diminishing]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[paym_loan_diminishing](
--	[id] [int] IDENTITY(1,1) NOT NULL,
--	[pn_companyid] [int] NULL,
--	[pn_branchid] [int] NULL,
--	[pn_employeeid] [int] NULL,
--	[fn_LoanId] [int] NULL,
--	[loan_appid] [varchar](20) NULL,
--	[loan_amount] [float] NULL,
--	[balance_amt] [decimal](8, 2) NULL,
--	[installement_count] [int] NULL,
--	[eff_date] [datetime] NULL,
--	[from_date] [datetime] NULL,
--	[to_date] [datetime] NULL,
--	[instal_amt] [decimal](8, 2) NULL,
--	[months] [int] NULL,
--	[loan_status] [varchar](30) NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[id] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[paym_LoanApply_employee]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[paym_LoanApply_employee](
--	[ApplicationID] [int] IDENTITY(1,1) NOT NULL,
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_BranchID] [int] NOT NULL,
--	[pn_EmployeeID] [int] NOT NULL,
--	[RequestedAmount] [decimal](18, 2) NULL,
--	[RepaymentPeriod] [int] NOT NULL,
--	[ApplicationDate] [date] NOT NULL,
--	[InterestRate] [decimal](5, 2) NOT NULL,
--	[EmployeeComments] [text] NULL,
--	[ApplicationStatus] [varchar](20) NOT NULL,
--	[loantype] [varchar](50) NOT NULL,
--	[MaxLoanAmount] [decimal](18, 2) NOT NULL,
--	[Pan_Card] [varbinary](max) NULL,
--	[Aadhaar_Card] [varbinary](max) NULL,
--	[Digital_Signature] [varbinary](max) NULL,
--	[EffectiveDate] [date] NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[ApplicationID] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[paym_LoanTypeMaster]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[paym_LoanTypeMaster](
--	[pn_LoanTypeID] [int] IDENTITY(1,1) NOT NULL,
--	[v_LoanTypeName] [varchar](100) NOT NULL,
--	[status] [varchar](20) NULL,
--	[CreatedDate] [datetime] NULL,
--	[ModifiedDate] [datetime] NULL,
--	[pn_CompanyID] [int] NULL,

--PRIMARY KEY CLUSTERED 
--(
--	[pn_LoanTypeID] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[paym_OverHeadingCost]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[paym_OverHeadingCost](
--	[pn_CompanyID] [int] NOT NULL,
--	[BranchID] [int] NOT NULL,
--	[overHeadingID] [int] IDENTITY(1,1) NOT NULL,
--	[OverHeadingName] [varchar](40) NOT NULL,
--	[status] [char](1) NULL,
-- CONSTRAINT [PK_paym_OverHeadingCost_1] PRIMARY KEY CLUSTERED 
--(
--	[pn_CompanyID] ASC,
--	[BranchID] ASC,
--	[OverHeadingName] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[paym_paybill]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[paym_paybill](
--	[id] [int] IDENTITY(1,1) NOT NULL,
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_BranchID] [int] NOT NULL,
--	[pn_EmployeeID] [int] NOT NULL,
--	[EmployeeCode] [nvarchar](50) NULL,
--	[Employee_First_Name] [nvarchar](50) NULL,
--	[DesignationName] [nvarchar](50) NULL,
--	[DepartmentName] [nvarchar](50) NULL,
--	[GradeName] [nvarchar](50) NULL,
--	[CategoryName] [nvarchar](50) NULL,
--	[JoiningDate] [nvarchar](50) NULL,
--	[d_date] [datetime] NULL,
--	[Earn_Amount] [float] NULL,
--	[Ded_Amount] [float] NULL,
--	[NetPay] [float] NULL,
--	[Earned_Basic] [float] NULL,
--	[Gross_salary] [float] NULL,
--	[Net_salary] [float] NULL,
--	[EPF] [float] NULL,
--	[FPF] [float] NULL,
--	[period_code] [nvarchar](50) NULL,
--	[max_amount] [float] NULL,
--	[Act_Basic] [float] NULL,
--	[Calc_Days] [float] NULL,
--	[Paid_Days] [float] NULL,
--	[Present_Days] [float] NULL,
--	[Absent_Days] [float] NULL,
--	[WeekOffDays] [float] NULL,
--	[Holidays] [float] NULL,
--	[TotLeave_Days] [float] NULL,
--	[ot_hrs] [datetime] NULL,
--	[ot_value] [float] NULL,
--	[ot_amt] [float] NULL,
--	[Allowance1] [nvarchar](50) NULL,
--	[value1] [float] NULL,
--	[Allowance2] [nvarchar](50) NULL,
--	[value2] [float] NULL,
--	[Allowance3] [nvarchar](50) NULL,
--	[value3] [float] NULL,
--	[Allowance4] [nvarchar](50) NULL,
--	[value4] [float] NULL,
--	[Allowance5] [nvarchar](50) NULL,
--	[value5] [float] NULL,
--	[Allowance6] [nvarchar](50) NULL,
--	[value6] [float] NULL,
--	[Allowance7] [nvarchar](50) NULL,
--	[value7] [float] NULL,
--	[Allowance8] [nvarchar](50) NULL,
--	[value8] [float] NULL,
--	[Allowance9] [nvarchar](50) NULL,
--	[value9] [float] NULL,
--	[Allowance10] [nvarchar](50) NULL,
--	[value10] [float] NULL,
--	[Deduction1] [nvarchar](50) NULL,
--	[valueA1] [float] NULL,
--	[Deduction2] [nvarchar](50) NULL,
--	[valueA2] [float] NULL,
--	[Deduction3] [nvarchar](50) NULL,
--	[valueA3] [float] NULL,
--	[Deduction4] [nvarchar](50) NULL,
--	[valueA4] [float] NULL,
--	[Deduction5] [nvarchar](50) NULL,
--	[valueA5] [float] NULL,
--	[Deduction6] [nvarchar](50) NULL,
--	[valueA6] [float] NULL,
--	[Deduction7] [nvarchar](50) NULL,
--	[valueA7] [float] NULL,
--	[Deduction8] [nvarchar](50) NULL,
--	[valueA8] [float] NULL,
--	[Deduction9] [nvarchar](50) NULL,
--	[valueA9] [float] NULL,
--	[Deduction10] [nvarchar](50) NULL,
--	[valueA10] [float] NULL,
--	[CompanyName] [nvarchar](50) NULL,
--	[Address_line1] [nvarchar](500) NULL,
--	[Address_Line2] [nvarchar](500) NULL,
--	[City] [nvarchar](50) NULL,
--	[Zipcode] [int] NULL,
--	[Att_bonus] [float] NULL,
--	[WorkFromHome] [float] NULL,
--	[Halfday] [float] NULL,
--	[Flag] [char](1) NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[id] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[paym_paybill_log]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[paym_paybill_log](
--	[LogID] [int] IDENTITY(1,1) NOT NULL,
--	[OriginalID] [int] NOT NULL,
--	[ChangeType] [nvarchar](10) NOT NULL,
--	[OldValue] [nvarchar](max) NULL,
--	[NewValue] [nvarchar](max) NULL,
--	[ChangeDate] [datetime] NOT NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[LogID] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[Paym_Permission]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[Paym_Permission](
--	[CompanyID] [int] NOT NULL,
--	[BranchID] [int] NOT NULL,
--	[PermissionID] [int] IDENTITY(1,1) NOT NULL,
--	[EmployeeID] [int] NOT NULL,
--	[EmployeeName] [nvarchar](50) NULL,
--	[Date] [datetime] NOT NULL,
--	[Session] [nvarchar](50) NOT NULL,
--	[Status] [nvarchar](50) NULL,
-- CONSTRAINT [PK_Paym_Permission_1] PRIMARY KEY CLUSTERED 
--(
--	[CompanyID] ASC,
--	[BranchID] ASC,
--	[EmployeeID] ASC,
--	[Date] ASC,
--	[Session] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[paym_PermissionSlab]    Script Date: 31-10-2025 6.45.20 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[paym_PermissionSlab](
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_BranchID] [int] NOT NULL,
--	[From_Duration] [varchar](25) NOT NULL,
--	[To_Duration] [varchar](25) NOT NULL,
--	[Permission_Deduction] [varchar](25) NULL
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[paym_PF]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[paym_PF](
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_BranchID] [int] NOT NULL,
--	[Emp_Con_PF] [float] NULL,
--	[Emp_Con_EPF] [float] NULL,
--	[Emp_Con_FPF] [float] NULL,
--	[Admin_Charges] [float] NULL,
--	[Eligibility_Amt] [float] NULL,
--	[c_Round] [char](1) NULL,
--	[d_date] [datetime] NOT NULL,
--	[check_ceiling] [varchar](2) NULL,
--	[max_amount] [int] NULL,
--	[check_allowance] [char](1) NULL,
--	[month] [varchar](10) NULL,
--	[year] [int] NULL,
-- CONSTRAINT [pk_paym_PF] PRIMARY KEY CLUSTERED 
--(
--	[pn_CompanyID] ASC,
--	[pn_BranchID] ASC,
--	[d_date] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[paym_Shift]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[paym_Shift](
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_branchid] [int] NOT NULL,
--	[pn_ShiftID] [int] IDENTITY(1,1) NOT NULL,
--	[shift_code] [varchar](20) NOT NULL,
--	[start_time] [time](7) NULL,
--	[break_time_out] [time](7) NULL,
--	[break_time_in] [time](7) NULL,
--	[end_time] [time](7) NULL,
--	[shift_indicator] [varchar](30) NULL,
--	[Shift_Type] [varchar](40) NULL,
-- CONSTRAINT [pk_paym_Shift] PRIMARY KEY CLUSTERED 
--(
--	[pn_CompanyID] ASC,
--	[pn_branchid] ASC,
--	[pn_ShiftID] ASC,
--	[shift_code] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[Paym_vpf]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[Paym_vpf](
--	[id] [int] IDENTITY(1,1) NOT NULL,
--	[pn_companyid] [int] NULL,
--	[pn_branchid] [int] NULL,
--	[pn_EmployeeID] [varchar](10) NULL,
--	[employeename] [varchar](50) NULL,
--	[monthlycontribution] [money] NULL,
--	[salaryfrom] [varchar](20) NULL,
--	[vpfamount] [money] NULL,
--	[contribution_type] [varchar](15) NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[id] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[PayOutput_Actuals]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[PayOutput_Actuals](
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_BranchID] [int] NULL,
--	[pn_EmployeeID] [int] NOT NULL,
--	[d_Date] [datetime] NOT NULL,
--	[d_From_Date] [datetime] NULL,
--	[d_To_Date] [datetime] NULL,
--	[Earn_Act_Amount] [float] NULL,
--	[Ded_Act_Amount] [float] NULL,
--	[Act_basic] [float] NULL,
--	[Period_code] [varchar](20) NULL,
-- CONSTRAINT [pk_PayOutput_Actuals] PRIMARY KEY CLUSTERED 
--(
--	[pn_CompanyID] ASC,
--	[pn_EmployeeID] ASC,
--	[d_Date] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[PayOutput_Deductions]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[PayOutput_Deductions](
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_EmployeeID] [int] NOT NULL,
--	[pn_DeductionID] [int] NOT NULL,
--	[pn_DepartmentName] [varchar](30) NULL,
--	[d_Date] [datetime] NOT NULL,
--	[d_From_Date] [datetime] NULL,
--	[d_To_Date] [datetime] NULL,
--	[Mode] [char](1) NULL,
--	[Flag] [char](1) NOT NULL,
--	[Act_Amount] [float] NULL,
--	[Amount] [float] NULL,
--	[pn_BranchID] [int] NULL,
-- CONSTRAINT [pk_PayOutput_Deductions] PRIMARY KEY CLUSTERED 
--(
--	[pn_CompanyID] ASC,
--	[pn_EmployeeID] ASC,
--	[pn_DeductionID] ASC,
--	[Flag] ASC,
--	[d_Date] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[PayOutput_Earnings]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[PayOutput_Earnings](
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_EmployeeID] [int] NOT NULL,
--	[pn_EarningsID] [int] NOT NULL,
--	[Pn_DepartmentName] [varchar](30) NULL,
--	[d_Date] [datetime] NOT NULL,
--	[d_From_Date] [datetime] NULL,
--	[d_To_Date] [datetime] NULL,
--	[Mode] [char](1) NULL,
--	[Flag] [char](1) NULL,
--	[Act_Amount] [float] NULL,
--	[Amount] [float] NULL,
--	[pn_BranchID] [int] NULL,
-- CONSTRAINT [pk_PayOutput_Earnings] PRIMARY KEY CLUSTERED 
--(
--	[pn_CompanyID] ASC,
--	[pn_EmployeeID] ASC,
--	[pn_EarningsID] ASC,
--	[d_Date] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[PayOutput_ESI]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[PayOutput_ESI](
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_EmployeeID] [int] NOT NULL,
--	[v_ESIno] [varchar](20) NULL,
--	[d_Date] [datetime] NOT NULL,
--	[d_From_Date] [datetime] NULL,
--	[d_To_Date] [datetime] NULL,
--	[NetPay] [int] NULL,
--	[ESI_EMP] [float] NULL,
--	[ESI_EPR] [float] NULL,
--	[Paid_Days] [float] NULL,
--	[Absent_Days] [float] NULL,
--	[WeekOffDays] [float] NULL,
--	[Period_code] [varchar](20) NULL,
--	[pn_BranchID] [int] NULL,
-- CONSTRAINT [pk_PayOutput_ESI] PRIMARY KEY CLUSTERED 
--(
--	[pn_CompanyID] ASC,
--	[pn_EmployeeID] ASC,
--	[d_Date] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[payoutput_loan]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[payoutput_loan](
--	[id] [int] IDENTITY(1,1) NOT NULL,
--	[pn_companyid] [int] NULL,
--	[pn_employeeid] [int] NULL,
--	[pn_loanid] [int] NULL,
--	[d_Date] [datetime] NULL,
--	[d_From_Date] [datetime] NULL,
--	[d_To_Date] [datetime] NULL,
--	[Amount] [decimal](8, 2) NULL,
--	[count_installement] [int] NULL,
--	[pn_branchid] [int] NULL,
--	[installement_count] [int] NULL,
--	[loan_appid] [varchar](20) NULL,
--	[instal_amt] [decimal](8, 2) NULL,
--	[balance_amt] [decimal](8, 2) NULL,
--	[loan_status] [varchar](30) NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[id] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[PayOutput_NetPay]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[PayOutput_NetPay](
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_BranchID] [int] NULL,
--	[pn_EmployeeID] [int] NOT NULL,
--	[d_Date] [datetime] NOT NULL,
--	[d_From_Date] [datetime] NULL,
--	[d_To_Date] [datetime] NULL,
--	[Earn_Act_Amount] [float] NULL,
--	[Earn_Amount] [float] NULL,
--	[OT_amt] [float] NULL,
--	[Ded_Act_Amount] [float] NULL,
--	[Ded_Amount] [float] NULL,
--	[NetPay] [float] NULL,
--	[Act_basic] [float] NULL,
--	[Earned_basic] [float] NULL,
--	[Gross_salary] [float] NULL,
--	[Net_salary] [float] NULL,
--	[Period_code] [varchar](20) NULL,
-- CONSTRAINT [pk_PayOutput_NetPay] PRIMARY KEY CLUSTERED 
--(
--	[pn_CompanyID] ASC,
--	[pn_EmployeeID] ASC,
--	[d_Date] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[PayOutput_PF]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[PayOutput_PF](
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_EmployeeID] [int] NOT NULL,
--	[v_PFno] [varchar](20) NULL,
--	[d_Date] [datetime] NOT NULL,
--	[d_From_Date] [datetime] NULL,
--	[d_To_Date] [datetime] NULL,
--	[NetPay] [int] NULL,
--	[PF] [float] NULL,
--	[Tot_pf] [float] NULL,
--	[EPF] [float] NULL,
--	[FPF] [float] NULL,
--	[VPF] [float] NULL,
--	[Paid_Days] [float] NULL,
--	[Absent_Days] [float] NULL,
--	[WeekOffDays] [float] NULL,
--	[Period_Code] [varchar](20) NULL,
--	[pn_BranchID] [int] NULL,
-- CONSTRAINT [pk_PayOutput_PF] PRIMARY KEY CLUSTERED 
--(
--	[pn_CompanyID] ASC,
--	[pn_EmployeeID] ASC,
--	[d_Date] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[PayProcess]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[PayProcess](
--	[id] [int] IDENTITY(1,1) NOT NULL,
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_BranchID] [int] NOT NULL,
--	[d_Date] [datetime] NOT NULL,
--	[d_From_Date] [datetime] NULL,
--	[d_To_Date] [datetime] NULL,
--	[salary_period] [varchar](20) NULL,
--	[ProcessDate] [datetime] NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[id] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[Payroll_final_settlement]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[Payroll_final_settlement](
--	[Pn_companyid] [int] NOT NULL,
--	[pn_branchid] [int] NOT NULL,
--	[ReferenceNo] [varchar](20) NOT NULL,
--	[pn_employeeid] [int] NOT NULL,
--	[joining_date] [varchar](50) NOT NULL,
--	[Last_Working_date] [varchar](50) NULL,
--	[ServiceYear] [int] NULL,
--	[Grauity_Amount] [decimal](18, 2) NULL,
--	[PF_Amount] [decimal](18, 2) NULL,
--	[Encashment_Amount] [decimal](18, 2) NULL,
--	[Loan_Amount] [decimal](18, 2) NULL,
--	[Deduct_Salary_Amount] [decimal](18, 2) NULL,
--	[Final_Amount] [decimal](18, 2) NULL,
--	[Status] [varchar](50) NULL,
-- CONSTRAINT [pk_Payroll_final_settlement] PRIMARY KEY CLUSTERED 
--(
--	[Pn_companyid] ASC,
--	[pn_employeeid] ASC,
--	[ReferenceNo] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[PF_EPF]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[PF_EPF](
--	[Id] [int] IDENTITY(1,1) NOT NULL,
--	[pn_companyID] [int] NULL,
--	[pn_BranchID] [int] NULL,
--	[pn_employeeID] [int] NULL,
--	[Nominee_Name] [varchar](20) NULL,
--	[Gender] [varchar](10) NULL,
--	[DOB] [datetime] NULL,
--	[PF_Share] [decimal](18, 2) NULL,
--	[Relationship] [varchar](20) NULL,
--	[address1] [varchar](50) NULL,
--	[State] [varchar](20) NULL,
--	[District] [varchar](20) NULL,
--	[city] [varchar](20) NULL,
--	[pin_no] [varchar](50) NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[Id] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[PF_EPS]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[PF_EPS](
--	[Id] [int] IDENTITY(1,1) NOT NULL,
--	[pn_companyID] [int] NULL,
--	[pn_BranchID] [int] NULL,
--	[pn_employeeID] [int] NULL,
--	[FamilyMember_Name] [varchar](20) NULL,
--	[Gender] [varchar](10) NULL,
--	[Relationship] [varchar](20) NULL,
--	[DOB] [datetime] NULL,
--	[address1] [varchar](50) NULL,
--	[State] [varchar](20) NULL,
--	[District] [varchar](20) NULL,
--	[city] [varchar](20) NULL,
--	[pin_no] [varchar](50) NULL,
--	[Disabled] [varchar](10) NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[Id] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[PF_Settings]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[PF_Settings](
--	[pn_CompanyID] [int] NOT NULL,
--	[Effective_Month_From] [varchar](30) NULL,
--	[Effective_From_Year] [int] NULL,
--	[PF_Contribution(%)] [float] NULL,
--	[Max_Ceiling] [varchar](20) NULL,
--	[PF_below_ceiling] [varchar](20) NULL,
--	[EPF_Contribution(%)] [float] NULL,
--	[Upper_Limit] [decimal](18, 2) NULL,
--	[EPS_Contribution(%)] [float] NULL,
--	[Eligibility_Amount] [decimal](18, 2) NULL,
--	[Admin_Charges(%)] [float] NULL,
--	[Rounding_Options] [varchar](50) NULL
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[Professional_Tax]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[Professional_Tax](
--	[pn_companyid] [int] NULL,
--	[pn_branchid] [int] NULL,
--	[State] [varchar](30) NULL,
--	[SlabID] [int] NULL,
--	[Lower_limit] [numeric](10, 2) NULL,
--	[Upper_limit] [varchar](50) NULL,
--	[Annual_basis] [numeric](10, 2) NULL,
--	[Half_yearly] [numeric](10, 2) NULL,
--	[Monthly_Amount] [numeric](10, 2) NULL
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[ProRataBasisMasters]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[ProRataBasisMasters](
--	[pn_CompanyID] [int] NULL,
--	[pn_BranchID] [int] NULL,
--	[Allowance1PRB] [nchar](1) NULL,
--	[Allowance2PRB] [nchar](1) NULL,
--	[Allowance3PRB] [nchar](1) NULL,
--	[Allowance4PRB] [nchar](1) NULL,
--	[Allowance5PRB] [nchar](1) NULL,
--	[Allowance6PRB] [nchar](1) NULL,
--	[Allowance7PRB] [nchar](1) NULL,
--	[Allowance8PRB] [nchar](1) NULL,
--	[Allowance9PRB] [nchar](1) NULL,
--	[Allowance10PRB] [nchar](1) NULL,
--	[Deduction1PRB] [nchar](1) NULL,
--	[Deduction2PRB] [nchar](1) NULL,
--	[Deduction3PRB] [nchar](1) NULL,
--	[Deduction4PRB] [nchar](1) NULL,
--	[Deduction5PRB] [nchar](1) NULL,
--	[Deduction6PRB] [nchar](1) NULL,
--	[Deduction7PRB] [nchar](1) NULL,
--	[Deduction8PRB] [nchar](1) NULL,
--	[Deduction9PRB] [nchar](1) NULL,
--	[Deduction10PRB] [nchar](1) NULL
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[punch_details]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[punch_details](
--	[id] [int] IDENTITY(1,1) NOT NULL,
--	[pn_companyid] [int] NULL,
--	[pn_branchid] [int] NULL,
--	[machine_num] [bigint] NULL,
--	[card_no] [varchar](15) NULL,
--	[emp_code] [varchar](15) NULL,
--	[emp_name] [varchar](50) NULL,
--	[VerifyMode] [int] NULL,
--	[InOutMode] [int] NULL,
--	[shift_code] [varchar](5) NULL,
--	[dates] [datetime] NULL,
--	[days] [varchar](15) NULL,
--	[times] [time](7) NULL,
--	[ot_hrs] [time](7) NULL,
--	[status] [varchar](2) NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[id] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[Reader]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[Reader](
--	[SlNo] [int] IDENTITY(1,1) NOT NULL,
--	[pn_CompanyID] [int] NOT NULL,
--	[Pn_BranchID] [int] NOT NULL,
--	[ReaderNo] [varchar](50) NOT NULL,
--	[IPAddress] [varchar](50) NOT NULL,
--	[Location] [varchar](50) NULL
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[Register]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[Register](
--	[UserID] [int] IDENTITY(1,1) NOT NULL,
--	[CompanyName] [varchar](100) NOT NULL,
--	[Email] [varchar](100) NOT NULL,
--	[Username] [varchar](50) NOT NULL,
--	[Passwordhash] [varchar](255) NOT NULL,
--	[MobileNumber] [varchar](15) NULL,
--	[Address] [nvarchar](255) NULL,
--	[CreatedAt] [datetime] NULL,
--	[IsActive] [bit] NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[UserID] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
--UNIQUE NONCLUSTERED 
--(
--	[Username] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
--UNIQUE NONCLUSTERED 
--(
--	[Email] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[salary_period]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[salary_period](
--	[pn_CompanyID] [int] NULL,
--	[pn_BranchID] [int] NULL,
--	[period_code] [varchar](15) NULL,
--	[selection] [varchar](5) NULL,
--	[p_year] [int] NULL,
--	[p_month] [varchar](15) NULL,
--	[from_date] [datetime] NOT NULL,
--	[to_date] [datetime] NOT NULL,
--	[total_days] [int] NULL,
--	[pay_date] [datetime] NULL,
--	[ot_include] [char](1) NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[from_date] ASC,
--	[to_date] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[salary_structure]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[salary_structure](
--	[Id] [int] IDENTITY(1,1) NOT NULL,
--	[pn_companyid] [int] NULL,
--	[pn_branchid] [int] NULL,
--	[pn_EmployeeID] [int] NULL,
--	[Salary] [float] NULL,
--	[Effective_date] [datetime] NULL,
--	[Remarks] [varchar](30) NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[Id] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[shift_balance]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[shift_balance](
--	[Id] [int] IDENTITY(1,1) NOT NULL,
--	[pn_companyid] [int] NULL,
--	[pn_branchid] [int] NULL,
--	[pn_employeecode] [varchar](10) NULL,
--	[pn_employeename] [varchar](50) NULL,
--	[monthyear] [varchar](8) NULL,
--	[pattern_code] [varchar](5) NULL,
--	[slot] [int] NULL,
--	[balance_days] [int] NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[Id] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[shift_details]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[shift_details](
--	[pn_companyid] [int] NOT NULL,
--	[pn_branchid] [int] NOT NULL,
--	[shift_code] [varchar](20) NOT NULL,
--	[start_time] [time](7) NULL,
--	[break_time_out] [time](7) NULL,
--	[break_time_in] [time](7) NULL,
--	[end_time] [time](7) NULL,
--	[shift_indicator] [varchar](30) NULL,
--	[Shift_Type] [varchar](40) NULL,
-- CONSTRAINT [PK_shift_details] PRIMARY KEY NONCLUSTERED 
--(
--	[pn_companyid] ASC,
--	[pn_branchid] ASC,
--	[shift_code] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[shift_month]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[shift_month](
--	[Id] [int] IDENTITY(1,1) NOT NULL,
--	[pn_CompanyID] [int] NULL,
--	[pn_BranchID] [int] NULL,
--	[pn_EmployeeCode] [varchar](50) NULL,
--	[pn_EmployeeName] [varchar](50) NULL,
--	[monthyear] [varchar](20) NULL,
--	[date] [datetime] NULL,
--	[Shift_PatternCode] [varchar](20) NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[Id] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[shift_pattern]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[shift_pattern](
--	[pn_companyid] [int] NOT NULL,
--	[pn_branchid] [int] NOT NULL,
--	[pattern_code] [varchar](5) NOT NULL,
--	[shift_code1] [varchar](10) NULL,
--	[days1] [int] NULL,
--	[shift_code2] [varchar](10) NULL,
--	[days2] [int] NULL,
--	[shift_code3] [varchar](10) NULL,
--	[days3] [int] NULL,
--	[shift_code4] [varchar](10) NULL,
--	[days4] [int] NULL,
--	[shift_code5] [varchar](10) NULL,
--	[days5] [int] NULL,
--	[shift_code6] [varchar](10) NULL,
--	[days6] [int] NULL,
--	[shift_code7] [varchar](10) NULL,
--	[days7] [int] NULL,
--	[shift_code8] [varchar](10) NULL,
--	[days8] [int] NULL,
-- CONSTRAINT [pk_shift_pattern] PRIMARY KEY CLUSTERED 
--(
--	[pn_companyid] ASC,
--	[pn_branchid] ASC,
--	[pattern_code] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[temp_deductions]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[temp_deductions](
--	[Id] [int] IDENTITY(1,1) NOT NULL,
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_EmployeeID] [int] NOT NULL,
--	[pn_DeductionID] [int] NOT NULL,
--	[pn_DepartmentName] [varchar](30) NULL,
--	[d_Date] [datetime] NOT NULL,
--	[d_From_Date] [datetime] NULL,
--	[d_To_Date] [datetime] NULL,
--	[Mode] [char](1) NULL,
--	[Flag] [char](1) NOT NULL,
--	[Act_Amount] [float] NULL,
--	[Amount] [float] NULL,
--	[pn_BranchID] [int] NULL,
--	[v_deductionname] [varchar](40) NOT NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[Id] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[temp_earnings]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[temp_earnings](
--	[Id] [int] IDENTITY(1,1) NOT NULL,
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_EmployeeID] [int] NOT NULL,
--	[pn_EarningsID] [int] NOT NULL,
--	[Pn_DepartmentName] [varchar](30) NULL,
--	[d_Date] [datetime] NOT NULL,
--	[d_From_Date] [datetime] NULL,
--	[d_To_Date] [datetime] NULL,
--	[Mode] [char](1) NULL,
--	[Flag] [char](1) NULL,
--	[Act_Amount] [float] NULL,
--	[Amount] [float] NULL,
--	[pn_BranchID] [int] NULL,
--	[v_earningsname] [varchar](40) NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[Id] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[Temp_EmployeeID]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[Temp_EmployeeID](
--	[Id] [int] IDENTITY(1,1) NOT NULL,
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_BranchID] [int] NOT NULL,
--	[pn_EmployeeID] [int] NULL,
--	[d_date] [datetime] NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[Id] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[Temp_Muster]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[Temp_Muster](
--	[Id] [int] IDENTITY(1,1) NOT NULL,
--	[pn_CompanyID] [int] NULL,
--	[pn_BranchID] [int] NULL,
--	[Emp_code] [varchar](50) NULL,
--	[Emp_name] [varchar](100) NULL,
--	[From_date] [datetime] NULL,
--	[To_Date] [datetime] NULL,
--	[M1] [varchar](2) NULL,
--	[M2] [varchar](2) NULL,
--	[M3] [varchar](2) NULL,
--	[M4] [varchar](2) NULL,
--	[M5] [varchar](2) NULL,
--	[M6] [varchar](2) NULL,
--	[M7] [varchar](2) NULL,
--	[M8] [varchar](2) NULL,
--	[M9] [varchar](2) NULL,
--	[M10] [varchar](2) NULL,
--	[M11] [varchar](2) NULL,
--	[M12] [varchar](2) NULL,
--	[M13] [varchar](2) NULL,
--	[M14] [varchar](2) NULL,
--	[M15] [varchar](2) NULL,
--	[M16] [varchar](2) NULL,
--	[M17] [varchar](2) NULL,
--	[M18] [varchar](2) NULL,
--	[M19] [varchar](2) NULL,
--	[M20] [varchar](2) NULL,
--	[M21] [varchar](2) NULL,
--	[M22] [varchar](2) NULL,
--	[M23] [varchar](2) NULL,
--	[M24] [varchar](2) NULL,
--	[M25] [varchar](2) NULL,
--	[M26] [varchar](2) NULL,
--	[M27] [varchar](2) NULL,
--	[M28] [varchar](2) NULL,
--	[M29] [varchar](2) NULL,
--	[M30] [varchar](2) NULL,
--	[M31] [varchar](2) NULL,
--	[PrsDays] [float] NULL,
--	[leaveDays] [float] NULL,
--	[OdDays] [float] NULL,
--	[Holidays] [float] NULL,
--	[WeekOff] [float] NULL,
--	[AbsDays] [float] NULL,
--	[PaidDays] [float] NULL,
--	[pn_GradeID] [int] NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[Id] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[temp_netpay]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[temp_netpay](
--	[Id] [int] IDENTITY(1,1) NOT NULL,
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_BranchID] [int] NULL,
--	[pn_EmployeeID] [int] NOT NULL,
--	[d_Date] [datetime] NOT NULL,
--	[d_From_Date] [datetime] NULL,
--	[d_To_Date] [datetime] NULL,
--	[Earn_Act_Amount] [float] NULL,
--	[Earn_Amount] [float] NULL,
--	[OT_amt] [float] NULL,
--	[Ded_Act_Amount] [float] NULL,
--	[Ded_Amount] [float] NULL,
--	[NetPay] [float] NULL,
--	[Act_basic] [float] NULL,
--	[Earned_basic] [float] NULL,
--	[Gross_salary] [float] NULL,
--	[Net_salary] [float] NULL,
--	[Period_code] [varchar](20) NULL,
--	[EPF] [float] NULL,
--	[FPF] [float] NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[Id] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[temp_Payinput]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[temp_Payinput](
--	[Id] [int] IDENTITY(1,1) NOT NULL,
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_BranchID] [int] NOT NULL,
--	[pn_EmployeeID] [int] NOT NULL,
--	[d_Date] [datetime] NOT NULL,
--	[d_From_Date] [datetime] NULL,
--	[d_To_Date] [datetime] NULL,
--	[Calc_Days] [float] NULL,
--	[Paid_Days] [float] NULL,
--	[Present_Days] [float] NULL,
--	[Absent_Days] [float] NULL,
--	[TotLeave_Days] [float] NULL,
--	[WeekOffDays] [float] NULL,
--	[Holidays] [float] NULL,
--	[OnDuty_days] [float] NULL,
--	[Compoff_Days] [float] NULL,
--	[Tour_Days] [float] NULL,
--	[Att_Bonus] [char](1) NULL,
--	[Att_BonusAmount] [float] NULL,
--	[OT_HRS] [time](3) NULL,
--	[Earn_Arrears] [float] NULL,
--	[Ded_Arrears] [float] NULL,
--	[ot_value] [float] NULL,
--	[ot_Amt] [float] NULL,
--	[Act_Basic] [float] NULL,
--	[Earn_Basic] [float] NULL,
--	[Mode] [char](1) NULL,
--	[Flag] [char](1) NULL,
--	[PT_Gross] [float] NULL,
--	[max_amount] [int] NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[Id] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[temp_timecard]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[temp_timecard](
--	[Id] [int] IDENTITY(1,1) NOT NULL,
--	[pn_companyid] [int] NULL,
--	[pn_branchid] [int] NULL,
--	[BranchCode] [varchar](10) NULL,
--	[emp_code] [varchar](10) NULL,
--	[emp_name] [varchar](50) NULL,
--	[shift_code] [varchar](10) NULL,
--	[dates] [datetime] NULL,
--	[days] [varchar](15) NULL,
--	[intime] [time](7) NULL,
--	[break_out] [time](7) NULL,
--	[break_in] [time](7) NULL,
--	[outtime] [time](7) NULL,
--	[late_in] [time](7) NULL,
--	[late_out] [time](7) NULL,
--	[early_out] [time](7) NULL,
--	[ot_hrs] [datetime] NULL,
--	[leave_code] [varchar](20) NULL,
--	[status] [varchar](2) NULL,
--	[data] [char](1) NULL,
--	[pn_EmployeeID] [varchar](20) NULL,
--	[flag] [char](1) NULL,
--	[GroupID] [int] NULL,
--	[pn_DepartmentID] [int] NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[Id] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[tempsattendance]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[tempsattendance](
--	[Id] [int] IDENTITY(1,1) NOT NULL,
--	[pn_companyid] [int] NULL,
--	[pn_branchid] [int] NULL,
--	[RegisterNo] [varchar](15) NULL,
--	[StudentName] [varchar](50) NULL,
--	[dates] [datetime] NULL,
--	[intime] [varchar](10) NULL,
--	[latein] [varchar](10) NULL,
--	[outtime] [varchar](10) NULL,
--	[lateout] [varchar](10) NULL,
--	[whours] [varchar](10) NULL,
--	[status] [varchar](5) NULL,
--	[Department] [varchar](50) NULL,
--	[Leave_name] [varchar](50) NULL,
--	[earlyout] [varchar](10) NULL,
--	[pn_gradeID] [int] NULL,
--	[To_Date] [datetime] NULL,
--	[Shift_code] [varchar](10) NULL,
--	[work_hrs] [varchar](50) NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[Id] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[tempshift]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[tempshift](
--	[Id] [int] IDENTITY(1,1) NOT NULL,
--	[pn_companyid] [int] NULL,
--	[pn_branchid] [int] NULL,
--	[RegisterNo] [varchar](15) NULL,
--	[StudentName] [varchar](50) NULL,
--	[dates] [datetime] NULL,
--	[intime] [varchar](10) NULL,
--	[latein] [varchar](10) NULL,
--	[outtime] [varchar](10) NULL,
--	[lateout] [varchar](10) NULL,
--	[whours] [varchar](10) NULL,
--	[status] [varchar](5) NULL,
--	[Department] [varchar](50) NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[Id] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[tempshiftdetails]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[tempshiftdetails](
--	[Id] [int] IDENTITY(1,1) NOT NULL,
--	[pn_companyid] [int] NULL,
--	[pn_branchid] [int] NULL,
--	[RegisterNo] [varchar](15) NULL,
--	[StudentName] [varchar](50) NULL,
--	[dates] [datetime] NULL,
--	[intime] [varchar](10) NULL,
--	[latein] [varchar](10) NULL,
--	[outtime] [varchar](10) NULL,
--	[lateout] [varchar](10) NULL,
--	[whours] [varchar](10) NULL,
--	[shift_code] [varchar](50) NULL,
--	[Department] [varchar](50) NULL,
--	[To_Date] [datetime] NULL,
--PRIMARY KEY CLUSTERED 
--(
--	[Id] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[temptimecard]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[temptimecard](
--	[Sno] [int] IDENTITY(1,1) NOT NULL,
--	[pn_companyid] [int] NULL,
--	[pn_branchid] [int] NULL,
--	[emp_code] [varchar](10) NULL,
--	[emp_name] [varchar](50) NULL,
--	[shift_code] [varchar](5) NULL,
--	[dates] [datetime] NULL,
--	[days] [varchar](15) NULL,
--	[intime] [datetime] NULL,
--	[break_out] [datetime] NULL,
--	[break_in] [datetime] NULL,
--	[early_out] [datetime] NULL,
--	[outtime] [datetime] NULL,
--	[Late_in] [datetime] NULL,
--	[Late_out] [datetime] NULL,
--	[ot_hrs] [datetime] NULL,
--	[status] [varchar](5) NULL,
--	[leave_code] [varchar](20) NULL,
--	[data] [char](1) NULL,
--	[pn_EmployeeID] [varchar](20) NULL,
--	[flag] [char](1) NULL
--) ON [PRIMARY]
--GO
--/****** Object:  Table [dbo].[Yearend]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE TABLE [dbo].[Yearend](
--	[pn_CompanyID] [int] NOT NULL,
--	[pn_BranchID] [int] NOT NULL,
--	[StartDate] [datetime] NOT NULL,
--	[EndDate] [datetime] NOT NULL,
--	[ProcessDate] [datetime] NOT NULL,
-- CONSTRAINT [PK_Yearend] PRIMARY KEY CLUSTERED 
--(
--	[StartDate] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
--) ON [PRIMARY]
--GO
--ALTER TABLE [dbo].[Assets] ADD  DEFAULT ('Active') FOR [Status]
--GO
--ALTER TABLE [dbo].[Assets] ADD  DEFAULT (getdate()) FOR [CreatedDate]
--GO
--ALTER TABLE [dbo].[LoanPostponed] ADD  DEFAULT ('Pending') FOR [ApprovalStatus]
--GO
--ALTER TABLE [dbo].[paym_LoanApply_employee] ADD  DEFAULT ('Pending') FOR [ApplicationStatus]
--GO
--ALTER TABLE [dbo].[paym_LoanApply_employee] ADD  DEFAULT ((0)) FOR [MaxLoanAmount]
--GO
--ALTER TABLE [dbo].[paym_LoanTypeMaster] ADD  DEFAULT ('Active') FOR [status]
--GO
--ALTER TABLE [dbo].[paym_LoanTypeMaster] ADD  DEFAULT (getdate()) FOR [CreatedDate]
--GO
--ALTER TABLE [dbo].[paym_paybill_log] ADD  DEFAULT (getdate()) FOR [ChangeDate]
--GO
--ALTER TABLE [dbo].[Register] ADD  DEFAULT (getdate()) FOR [CreatedAt]
--GO
--ALTER TABLE [dbo].[Register] ADD  DEFAULT ((1)) FOR [IsActive]
--GO
--ALTER TABLE [dbo].[employee_Group]  WITH CHECK ADD  CONSTRAINT [fk_employeeGroup_groupid] FOREIGN KEY([groupid])
--REFERENCES [dbo].[Group_details] ([GroupID])
--GO
--ALTER TABLE [dbo].[employee_Group] CHECK CONSTRAINT [fk_employeeGroup_groupid]
--GO
--ALTER TABLE [dbo].[Group_Settings]  WITH CHECK ADD  CONSTRAINT [fk_groupSettings_groupid] FOREIGN KEY([groupid])
--REFERENCES [dbo].[Group_details] ([GroupID])
--GO
--ALTER TABLE [dbo].[Group_Settings] CHECK CONSTRAINT [fk_groupSettings_groupid]
--GO
--ALTER TABLE [dbo].[hrmm_Course]  WITH CHECK ADD  CONSTRAINT [fk_hrmm_Company] FOREIGN KEY([pn_CompanyID])
--REFERENCES [dbo].[paym_Company] ([pn_CompanyID])
--ON DELETE CASCADE
--GO
--ALTER TABLE [dbo].[hrmm_Course] CHECK CONSTRAINT [fk_hrmm_Company]
--GO
--ALTER TABLE [dbo].[hrmm_SkillsMaster]  WITH CHECK ADD  CONSTRAINT [fk_hrmm_SkillsMaster_Company] FOREIGN KEY([pn_CompanyID])
--REFERENCES [dbo].[paym_Company] ([pn_CompanyID])
--ON DELETE CASCADE
--GO
--ALTER TABLE [dbo].[hrmm_SkillsMaster] CHECK CONSTRAINT [fk_hrmm_SkillsMaster_Company]
--GO
--ALTER TABLE [dbo].[hrmm_Specialization]  WITH CHECK ADD  CONSTRAINT [fk_Specialization_Company] FOREIGN KEY([pn_CompanyID])
--REFERENCES [dbo].[paym_Company] ([pn_CompanyID])
--ON DELETE CASCADE
--GO
--ALTER TABLE [dbo].[hrmm_Specialization] CHECK CONSTRAINT [fk_Specialization_Company]
--GO
--ALTER TABLE [dbo].[Loan_PreCloser]  WITH NOCHECK ADD  CONSTRAINT [fk_loancloser_company] FOREIGN KEY([pn_CompanyID], [pn_BranchID])
--REFERENCES [dbo].[paym_Branch] ([pn_CompanyID], [pn_BranchID])
--GO
--ALTER TABLE [dbo].[Loan_PreCloser] CHECK CONSTRAINT [fk_loancloser_company]
--GO
--ALTER TABLE [dbo].[LoanEntry]  WITH NOCHECK ADD  CONSTRAINT [fk_loanentry_company] FOREIGN KEY([pn_CompanyID], [pn_BranchID])
--REFERENCES [dbo].[paym_Branch] ([pn_CompanyID], [pn_BranchID])
--GO
--ALTER TABLE [dbo].[LoanEntry] CHECK CONSTRAINT [fk_loanentry_company]
--GO
--ALTER TABLE [dbo].[LoanEntry]  WITH NOCHECK ADD  CONSTRAINT [fk_loanentry_loanid] FOREIGN KEY([pn_CompanyID], [fn_LoanID])
--REFERENCES [dbo].[paym_Loan] ([pn_Companyid], [pn_LoanID])
--GO
--ALTER TABLE [dbo].[LoanEntry] CHECK CONSTRAINT [fk_loanentry_loanid]
--GO
--ALTER TABLE [dbo].[LoanPreclosure]  WITH CHECK ADD FOREIGN KEY([ApplicationID])
--REFERENCES [dbo].[paym_LoanApply_employee] ([ApplicationID])
--GO
--ALTER TABLE [dbo].[PayInput]  WITH NOCHECK ADD  CONSTRAINT [fk_PayInput] FOREIGN KEY([pn_CompanyID], [pn_BranchID])
--REFERENCES [dbo].[paym_Branch] ([pn_CompanyID], [pn_BranchID])
--GO
--ALTER TABLE [dbo].[PayInput] CHECK CONSTRAINT [fk_PayInput]
--GO
--ALTER TABLE [dbo].[paym_Branch]  WITH CHECK ADD  CONSTRAINT [fk_paym_Branch] FOREIGN KEY([pn_CompanyID])
--REFERENCES [dbo].[paym_Company] ([pn_CompanyID])
--ON DELETE CASCADE
--GO
--ALTER TABLE [dbo].[paym_Branch] CHECK CONSTRAINT [fk_paym_Branch]
--GO
--ALTER TABLE [dbo].[paym_Category]  WITH CHECK ADD  CONSTRAINT [fk_Category_Company] FOREIGN KEY([pn_CompanyID])
--REFERENCES [dbo].[paym_Company] ([pn_CompanyID])
--ON DELETE CASCADE
--GO
--ALTER TABLE [dbo].[paym_Category] CHECK CONSTRAINT [fk_Category_Company]
--GO
--ALTER TABLE [dbo].[paym_Deduction]  WITH CHECK ADD  CONSTRAINT [fk_Deduction_Company] FOREIGN KEY([pn_CompanyID])
--REFERENCES [dbo].[paym_Company] ([pn_CompanyID])
--ON DELETE CASCADE
--GO
--ALTER TABLE [dbo].[paym_Deduction] CHECK CONSTRAINT [fk_Deduction_Company]
--GO
--ALTER TABLE [dbo].[paym_Department]  WITH CHECK ADD  CONSTRAINT [fk_Department_Company] FOREIGN KEY([pn_CompanyID])
--REFERENCES [dbo].[paym_Company] ([pn_CompanyID])
--ON DELETE CASCADE
--GO
--ALTER TABLE [dbo].[paym_Department] CHECK CONSTRAINT [fk_Department_Company]
--GO
--ALTER TABLE [dbo].[paym_Designation]  WITH CHECK ADD  CONSTRAINT [fk_Designation_Company] FOREIGN KEY([pn_CompanyID])
--REFERENCES [dbo].[paym_Company] ([pn_CompanyID])
--ON DELETE CASCADE
--GO
--ALTER TABLE [dbo].[paym_Designation] CHECK CONSTRAINT [fk_Designation_Company]
--GO
--ALTER TABLE [dbo].[paym_Division]  WITH CHECK ADD  CONSTRAINT [fk_Division_Company] FOREIGN KEY([pn_CompanyID])
--REFERENCES [dbo].[paym_Company] ([pn_CompanyID])
--ON DELETE CASCADE
--GO
--ALTER TABLE [dbo].[paym_Division] CHECK CONSTRAINT [fk_Division_Company]
--GO
--ALTER TABLE [dbo].[paym_Earnings]  WITH CHECK ADD  CONSTRAINT [fk_Earnings_Company] FOREIGN KEY([pn_CompanyID])
--REFERENCES [dbo].[paym_Company] ([pn_CompanyID])
--ON DELETE CASCADE
--GO
--ALTER TABLE [dbo].[paym_Earnings] CHECK CONSTRAINT [fk_Earnings_Company]
--GO
--ALTER TABLE [dbo].[paym_Emp_Deduction]  WITH NOCHECK ADD  CONSTRAINT [fk_paym_Deduction_Branch] FOREIGN KEY([pn_CompanyID], [pn_BranchID])
--REFERENCES [dbo].[paym_Branch] ([pn_CompanyID], [pn_BranchID])
--GO
--ALTER TABLE [dbo].[paym_Emp_Deduction] CHECK CONSTRAINT [fk_paym_Deduction_Branch]
--GO
--ALTER TABLE [dbo].[paym_Emp_Deduction]  WITH NOCHECK ADD  CONSTRAINT [fk_paym_Deduction_Deduction] FOREIGN KEY([pn_CompanyID], [pn_DeductionID])
--REFERENCES [dbo].[paym_Deduction] ([pn_CompanyID], [pn_DeductionID])
--GO
--ALTER TABLE [dbo].[paym_Emp_Deduction] CHECK CONSTRAINT [fk_paym_Deduction_Deduction]
--GO
--ALTER TABLE [dbo].[paym_Emp_Earnings]  WITH NOCHECK ADD  CONSTRAINT [fk_paym_Earnings_Branch] FOREIGN KEY([pn_CompanyID], [pn_BranchID])
--REFERENCES [dbo].[paym_Branch] ([pn_CompanyID], [pn_BranchID])
--GO
--ALTER TABLE [dbo].[paym_Emp_Earnings] CHECK CONSTRAINT [fk_paym_Earnings_Branch]
--GO
--ALTER TABLE [dbo].[paym_Emp_Earnings]  WITH NOCHECK ADD  CONSTRAINT [fk_paym_Earnings_Earnings] FOREIGN KEY([pn_CompanyID], [pn_EarningsID])
--REFERENCES [dbo].[paym_Earnings] ([pn_CompanyID], [pn_EarningsID])
--GO
--ALTER TABLE [dbo].[paym_Emp_Earnings] CHECK CONSTRAINT [fk_paym_Earnings_Earnings]
--GO
--ALTER TABLE [dbo].[paym_Employee]  WITH NOCHECK ADD  CONSTRAINT [fk_paym_Employee] FOREIGN KEY([pn_CompanyID], [pn_BranchID])
--REFERENCES [dbo].[paym_Branch] ([pn_CompanyID], [pn_BranchID])
--GO
--ALTER TABLE [dbo].[paym_Employee] CHECK CONSTRAINT [fk_paym_Employee]
--GO
--ALTER TABLE [dbo].[paym_Employee]  WITH NOCHECK ADD  CONSTRAINT [fk_paym_Employee1] FOREIGN KEY([pn_CompanyID], [pn_BranchID])
--REFERENCES [dbo].[paym_Branch] ([pn_CompanyID], [pn_BranchID])
--GO
--ALTER TABLE [dbo].[paym_Employee] CHECK CONSTRAINT [fk_paym_Employee1]
--GO
--ALTER TABLE [dbo].[paym_Grade]  WITH CHECK ADD  CONSTRAINT [fk_Grade_Company] FOREIGN KEY([pn_CompanyID])
--REFERENCES [dbo].[paym_Company] ([pn_CompanyID])
--ON DELETE CASCADE
--GO
--ALTER TABLE [dbo].[paym_Grade] CHECK CONSTRAINT [fk_Grade_Company]
--GO
--ALTER TABLE [dbo].[paym_JobStatus]  WITH CHECK ADD  CONSTRAINT [fk_JobStatus_Company] FOREIGN KEY([pn_CompanyID])
--REFERENCES [dbo].[paym_Company] ([pn_CompanyID])
--ON DELETE CASCADE
--GO
--ALTER TABLE [dbo].[paym_JobStatus] CHECK CONSTRAINT [fk_JobStatus_Company]
--GO
--ALTER TABLE [dbo].[paym_Level]  WITH CHECK ADD  CONSTRAINT [fk_Level_Company] FOREIGN KEY([pn_CompanyID])
--REFERENCES [dbo].[paym_Company] ([pn_CompanyID])
--ON DELETE CASCADE
--GO
--ALTER TABLE [dbo].[paym_Level] CHECK CONSTRAINT [fk_Level_Company]
--GO
--ALTER TABLE [dbo].[paym_Loan]  WITH CHECK ADD  CONSTRAINT [fk_paym_loan] FOREIGN KEY([pn_Companyid])
--REFERENCES [dbo].[paym_Company] ([pn_CompanyID])
--ON DELETE CASCADE
--GO
--ALTER TABLE [dbo].[paym_Loan] CHECK CONSTRAINT [fk_paym_loan]
--GO
--ALTER TABLE [dbo].[paym_OverHeadingCost]  WITH CHECK ADD  CONSTRAINT [fk_OverHeading_Company] FOREIGN KEY([pn_CompanyID])
--REFERENCES [dbo].[paym_Company] ([pn_CompanyID])
--ON DELETE CASCADE
--GO
--ALTER TABLE [dbo].[paym_OverHeadingCost] CHECK CONSTRAINT [fk_OverHeading_Company]
--GO
--ALTER TABLE [dbo].[paym_PF]  WITH NOCHECK ADD  CONSTRAINT [fk_paym_PF] FOREIGN KEY([pn_CompanyID], [pn_BranchID])
--REFERENCES [dbo].[paym_Branch] ([pn_CompanyID], [pn_BranchID])
--GO
--ALTER TABLE [dbo].[paym_PF] CHECK CONSTRAINT [fk_paym_PF]
--GO
--ALTER TABLE [dbo].[paym_Shift]  WITH CHECK ADD  CONSTRAINT [fk_Shift_Company] FOREIGN KEY([pn_CompanyID])
--REFERENCES [dbo].[paym_Company] ([pn_CompanyID])
--ON DELETE CASCADE
--GO
--ALTER TABLE [dbo].[paym_Shift] CHECK CONSTRAINT [fk_Shift_Company]
--GO
--ALTER TABLE [dbo].[PayOutput_Deductions]  WITH CHECK ADD  CONSTRAINT [fk_paym_PayOutput_Deductions] FOREIGN KEY([pn_CompanyID])
--REFERENCES [dbo].[paym_Company] ([pn_CompanyID])
--ON DELETE CASCADE
--GO
--ALTER TABLE [dbo].[PayOutput_Deductions] CHECK CONSTRAINT [fk_paym_PayOutput_Deductions]
--GO
--ALTER TABLE [dbo].[PayOutput_ESI]  WITH CHECK ADD  CONSTRAINT [fk_PayOutput_ESI] FOREIGN KEY([pn_CompanyID])
--REFERENCES [dbo].[paym_Company] ([pn_CompanyID])
--ON DELETE CASCADE
--GO
--ALTER TABLE [dbo].[PayOutput_ESI] CHECK CONSTRAINT [fk_PayOutput_ESI]
--GO
--ALTER TABLE [dbo].[PayOutput_NetPay]  WITH CHECK ADD  CONSTRAINT [fk_PayOutput_NetPay] FOREIGN KEY([pn_CompanyID])
--REFERENCES [dbo].[paym_Company] ([pn_CompanyID])
--ON DELETE CASCADE
--GO
--ALTER TABLE [dbo].[PayOutput_NetPay] CHECK CONSTRAINT [fk_PayOutput_NetPay]
--GO
--ALTER TABLE [dbo].[PayOutput_PF]  WITH CHECK ADD  CONSTRAINT [fk_PayOutput_PF] FOREIGN KEY([pn_CompanyID])
--REFERENCES [dbo].[paym_Company] ([pn_CompanyID])
--ON DELETE CASCADE
--GO
--ALTER TABLE [dbo].[PayOutput_PF] CHECK CONSTRAINT [fk_PayOutput_PF]
--GO
--ALTER TABLE [dbo].[shift_balance]  WITH NOCHECK ADD  CONSTRAINT [fk_paym_Shift_Balance] FOREIGN KEY([pn_companyid], [pn_branchid], [pattern_code])
--REFERENCES [dbo].[shift_pattern] ([pn_companyid], [pn_branchid], [pattern_code])
--GO
--ALTER TABLE [dbo].[shift_balance] CHECK CONSTRAINT [fk_paym_Shift_Balance]
--GO
--/****** Object:  StoredProcedure [dbo].[AssignAssetToEmployee]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE PROCEDURE [dbo].[AssignAssetToEmployee]
--    @pnCompanyId INT,
--    @pnBranchId INT,
--    @pnEmployeeId INT,
--    @AssetName VARCHAR(100),
--    @AssetSerialNumber VARCHAR(100),
--    @AssetType VARCHAR(100) = NULL
--AS
--BEGIN
--    SET NOCOUNT ON;

--    IF EXISTS (
--        SELECT 1 FROM Assets
--        WHERE pn_CompanyID = @pnCompanyId
--          AND BranchID = @pnBranchId
--          AND Asset_name = @AssetName
--          AND Asset_SerialNumber = @AssetSerialNumber
--          AND Status = 'Active'
--    )
--    BEGIN
--        -- Assign asset to employee in paym_Employee table
--        UPDATE paym_Employee
--        SET Asset_Name = @AssetName,
--            Asset_SerialNumber = @AssetSerialNumber
--        WHERE pn_CompanyID = @pnCompanyId
--          AND pn_BranchID = @pnBranchId
--          AND pn_EmployeeID = @pnEmployeeId;

--        -- Update asset status and assign employee in Assets table
--        UPDATE Assets
--        SET Status = 'Assigned',
--            AssetAssignedTo = @pnEmployeeId
--        WHERE pn_CompanyID = @pnCompanyId
--          AND BranchID = @pnBranchId
--          AND Asset_name = @AssetName
--          AND Asset_SerialNumber = @AssetSerialNumber
--          AND Status = 'Active';

--        -- Return updated asset details including AssetAssignedTo
--        SELECT 
--            pn_Assetid,
--            pn_CompanyID,
--            BranchID,
--            Asset_name,
--            Asset_SerialNumber,
--            PurchaseDate,
--            AssetValue,
--            Status,
--            Description,
--            CreatedDate,
--            AssetAssignedTo,
--            @AssetType AS AssetType,
--            'Asset assigned and marked as Assigned.' AS Message
--        FROM Assets
--        WHERE pn_CompanyID = @pnCompanyId
--          AND BranchID = @pnBranchId
--          AND Asset_name = @AssetName
--          AND Asset_SerialNumber = @AssetSerialNumber;
--    END
--    ELSE
--    BEGIN
--        -- Return asset details with message when not found or already assigned
--        SELECT 
--            pn_Assetid,
--            pn_CompanyID,
--            BranchID,
--            Asset_name,
--            Asset_SerialNumber,
--            PurchaseDate,
--            AssetValue,
--            Status,
--            Description,
--            CreatedDate,
--            AssetAssignedTo,
--            @AssetType AS AssetType,
--            'Asset not found or already Assigned.' AS Message
--        FROM Assets
--        WHERE pn_CompanyID = @pnCompanyId
--          AND BranchID = @pnBranchId
--          AND Asset_name = @AssetName
--          AND Asset_SerialNumber = @AssetSerialNumber;
--    END
--END

--GO
--/****** Object:  StoredProcedure [dbo].[CalculateGrossSalary]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE PROCEDURE [dbo].[CalculateGrossSalary]
--AS
--BEGIN
--    SET NOCOUNT ON;

--    -- Temporary table to store Employee Allowances
--    WITH EmployeeAllowances AS (
--        SELECT DISTINCT
--            e.pn_CompanyID,
--            e.pn_BranchID,
--            e.Employee_Full_Name,
--            e.EmployeeCode,
--            e.pn_EmployeeID,
--            av.Grade_Name,
--            av.Level_Name,
--            av.v_EarningsName,
--            av.Allowancetype,
--            av.Cal_Based_on,
--            CASE 
--                WHEN av.Allowancetype = 'Fixed' THEN av.value
--                WHEN av.Cal_Based_on = 'CTC' THEN (e.CTC * av.value / 100)
--                WHEN av.Cal_Based_on = 'BasicPay' THEN (e.Basic_Salary * av.value / 100)
--                ELSE 0
--            END AS OriginalAmount,
--            aset.Prorata_basis, -- Prorata flag specific to each earning
--            av.d_order
--        FROM 
--            [dbo].[AllowanceValues] av
--        JOIN 
--            [dbo].[paym_Employee] e
--            ON av.Grade_Name = e.Grade
--            OR av.Level_Name = e.Grade
--        LEFT JOIN (
--            SELECT 
--                pn_CompanyID, pn_BranchID, v_EarningsName, 
--                MAX(Prorata_basis) AS Prorata_basis
--            FROM 
--                [dbo].[Allowancesettings]
--            GROUP BY 
--                pn_CompanyID, pn_BranchID, v_EarningsName
--        ) aset
--        ON av.pn_companyid = aset.pn_CompanyID
--        AND av.pn_branchid = aset.pn_BranchID
--        AND av.v_EarningsName = aset.v_EarningsName
--        WHERE 
--            av.pn_branchid = e.pn_BranchID
--            AND (av.Allowancetype IN ('Fixed', 'Percentage'))
--            AND NOT (av.c_Regular = 'N' AND av.payslip = 'N')
--    ),
--    AttendanceData AS (
--        SELECT 
--            tc.pn_EmployeeID,
--            YEAR(tc.dates) AS Year,
--            MONTH(tc.dates) AS Month,
--            COUNT(DISTINCT MONTH(tc.dates)) AS MonthsWithAttendance,
--            SUM(CASE WHEN tc.status = 'A' THEN 1 ELSE 0 END) + 
--            SUM(CASE WHEN tc.status = 'HD' THEN 0.5 ELSE 0 END) AS AbsentDays,
--            COUNT(tc.dates) AS TotalDays,
--            COUNT(tc.dates) - 
--            (SUM(CASE WHEN tc.status = 'A' THEN 1 ELSE 0 END) + 
--             SUM(CASE WHEN tc.status = 'HD' THEN 0.5 ELSE 0 END)) AS PaidDays,
--            SUM(CASE WHEN tc.status = 'P' THEN 1 ELSE 0 END) AS PresentDays,
--            SUM(CASE WHEN tc.status = 'W' THEN 1 ELSE 0 END) AS Weekoffdays,
--            SUM(CASE WHEN tc.status = 'L' THEN 1 ELSE 0 END) AS Leavedays,
--            SUM(CASE WHEN tc.status = 'H' THEN 1 ELSE 0 END) AS Holidays,
--            SUM(CASE WHEN tc.status = 'WFH' THEN 1 ELSE 0 END) AS WorkFromHome,
--            SUM(CASE WHEN tc.status = 'HD' THEN 1 ELSE 0 END) AS HalfDay
--        FROM 
--            dbo.time_card tc
--        GROUP BY 
--            tc.pn_EmployeeID, YEAR(tc.dates), MONTH(tc.dates)
--        HAVING COUNT(DISTINCT MONTH(tc.dates)) > 0  -- Only consider employees with attendance in this month
--    ),
--    GrossSalaryData AS (
--        SELECT 
--            emp.pn_CompanyID,
--            emp.pn_BranchID,
--            emp.Employee_Full_Name,
--            emp.EmployeeCode,
--            emp.pn_EmployeeID,
--            emp.Basic_Salary,
--            ad.Year,
--            ad.Month,
--            ad.TotalDays,
--            ad.PaidDays,
--            ad.AbsentDays,
--            -- Calculate Earned Basic
--            CASE 
--                WHEN ad.TotalDays > 0 THEN 
--                    (emp.Basic_Salary / ad.TotalDays) * ad.PaidDays
--                ELSE 0 
--            END AS Earned_Basic,
--            -- Calculate Gross Salary
--            (CASE 
--                WHEN ad.TotalDays > 0 THEN 
--                    (emp.Basic_Salary / ad.TotalDays) * ad.PaidDays
--                ELSE 0 
--            END + 
--            COALESCE(MAX(CASE WHEN ea.d_order = 1 THEN 
--                CASE WHEN ea.Prorata_basis = 'Y' THEN 
--                    (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
--                    ELSE ea.OriginalAmount END
--                ELSE 0 END), 0) +
--            COALESCE(MAX(CASE WHEN ea.d_order = 2 THEN 
--                CASE WHEN ea.Prorata_basis = 'Y' THEN 
--                    (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
--                    ELSE ea.OriginalAmount END
--                ELSE 0 END), 0) +
--            COALESCE(MAX(CASE WHEN ea.d_order = 3 THEN 
--                CASE WHEN ea.Prorata_basis = 'Y' THEN 
--                    (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
--                    ELSE ea.OriginalAmount END
--                ELSE 0 END), 0) +
--            COALESCE(MAX(CASE WHEN ea.d_order = 4 THEN 
--                CASE WHEN ea.Prorata_basis = 'Y' THEN 
--                    (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
--                    ELSE ea.OriginalAmount END
--                ELSE 0 END), 0) +
--            COALESCE(MAX(CASE WHEN ea.d_order = 5 THEN 
--                CASE WHEN ea.Prorata_basis = 'Y' THEN 
--                    (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
--                    ELSE ea.OriginalAmount END
--                ELSE 0 END), 0) +
--            COALESCE(MAX(CASE WHEN ea.d_order = 6 THEN 
--                CASE WHEN ea.Prorata_basis = 'Y' THEN 
--                    (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
--                    ELSE ea.OriginalAmount END
--                ELSE 0 END), 0) +
--            COALESCE(MAX(CASE WHEN ea.d_order = 7 THEN 
--                CASE WHEN ea.Prorata_basis = 'Y' THEN 
--                    (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
--                    ELSE ea.OriginalAmount END
--                ELSE 0 END), 0) +
--            COALESCE(MAX(CASE WHEN ea.d_order = 8 THEN 
--                CASE WHEN ea.Prorata_basis = 'Y' THEN 
--                    (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
--                    ELSE ea.OriginalAmount END
--                ELSE 0 END), 0) +
--            COALESCE(MAX(CASE WHEN ea.d_order = 9 THEN 
--                CASE WHEN ea.Prorata_basis = 'Y' THEN 
--                    (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
--                    ELSE ea.OriginalAmount END
--                ELSE 0 END), 0) +
--            COALESCE(MAX(CASE WHEN ea.d_order = 10 THEN 
--                CASE WHEN ea.Prorata_basis = 'Y' THEN 
--                    (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
--                    ELSE ea.OriginalAmount END
--                ELSE 0 END), 0)) AS Gross_Salary
--        FROM 
--            EmployeeAllowances ea
--        JOIN 
--            AttendanceData ad
--            ON ea.pn_EmployeeID = ad.pn_EmployeeID
--        JOIN 
--            [dbo].[paym_Employee] emp
--            ON emp.pn_EmployeeID = ea.pn_EmployeeID
--        GROUP BY 
--            emp.pn_CompanyID,
--            emp.pn_BranchID,
--            emp.Employee_Full_Name,
--            emp.EmployeeCode,
--            emp.pn_EmployeeID,
--            emp.Basic_Salary,
--            ad.Year,
--            ad.Month,
--            ad.TotalDays,
--            ad.PaidDays,
--            ad.AbsentDays
--    )
--    SELECT *
--    FROM GrossSalaryData
--    ORDER BY Year, Month, pn_EmployeeID; -- Order by Year, Month, and Employee ID
--END;
--GO
--/****** Object:  StoredProcedure [dbo].[CalculateGrossSalaryAndESI]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE PROCEDURE [dbo].[CalculateGrossSalaryAndESI]
--AS
--BEGIN
--    WITH GrossSalaryCalculation AS (
--        SELECT 
--            av.pn_companyid,
--            av.pn_branchid,
--            e.Employee_Full_Name,
--            e.EmployeeCode,
--            e.Basic_Salary,  -- Basic Salary
--            av.Level_Name,
--            SUM(CASE 
--                WHEN av.Allowancetype = 'Fixed' THEN av.value
--                WHEN av.Cal_Based_on = 'CTC' THEN (e.CTC * av.value / 100)
--                WHEN av.Cal_Based_on = 'BasicPay' THEN (e.Basic_Salary * av.value / 100)
--                ELSE 0
--            END) AS Total_Allowance_Amt,
--            -- Calculate Gross Salary
--            e.Basic_Salary + SUM(CASE 
--                WHEN av.Allowancetype = 'Fixed' THEN av.value
--                WHEN av.Cal_Based_on = 'CTC' THEN (e.CTC * av.value / 100)
--                WHEN av.Cal_Based_on = 'BasicPay' THEN (e.Basic_Salary * av.value / 100)
--                ELSE 0
--            END) AS Gross_Salary
--        FROM 
--            [dbo].[AllowanceValues] av
--        JOIN 
--            [dbo].[paym_Employee] e
--            ON av.Grade_Name = e.Grade
--            OR av.Level_Name = e.Grade
--        JOIN 
--            [dbo].[Allowancesettings] aset
--            ON av.pn_companyid = aset.pn_CompanyID
--            AND av.pn_branchid = aset.pn_BranchID
--            AND av.v_EarningsName = aset.v_EarningsName
--        WHERE 
--            av.pn_branchid = e.pn_BranchID -- Ensure they belong to the same branch
--            AND (av.Allowancetype IN ('Fixed', 'Percentage')) -- Check allowance type
--            AND aset.ESI = 'Y' -- Include only EarningsName where ESI is 'Y'
--        GROUP BY 
--            av.pn_companyid,
--            av.pn_branchid,
--            e.Employee_Full_Name,
--            e.EmployeeCode,
--            e.Basic_Salary,  -- Add Basic_Salary to the GROUP BY clause
--            av.Level_Name
--    )
--    SELECT 
--        gs.pn_companyid,
--        gs.pn_branchid,
--        gs.Employee_Full_Name,
--        gs.EmployeeCode,
--        gs.Basic_Salary,
--        gs.Total_Allowance_Amt,
--        gs.Gross_Salary,
--        es.[Employee_Contribution(%)] AS Employee_Contribution,
--        es.[Employer_Contribution(%)] AS Employer_Contribution,
--        -- Calculate ESI Contributions dynamically and round to the next rupee
--        CEILING(gs.Gross_Salary * es.[Employee_Contribution(%)] / 100) AS Employee_ESI_Contribution,
--        CEILING(gs.Gross_Salary * es.[Employer_Contribution(%)] / 100) AS Employer_ESI_Contribution
--    FROM 
--        GrossSalaryCalculation gs
--    JOIN 
--        [dbo].[ESI_Settings] es
--    ON 
--        gs.pn_companyid = es.pn_CompanyID
--    WHERE 
--        gs.Gross_Salary >= es.Lower_Limit  -- Only show employees whose gross salary is greater than or equal to Lower_Limit
--        AND gs.Gross_Salary <= es.Upper_Limit -- Only show employees whose gross salary is less than or equal to Upper_Limit
--END;
--GO
--/****** Object:  StoredProcedure [dbo].[CalculateGrossSalaryWithBonus]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE PROCEDURE [dbo].[CalculateGrossSalaryWithBonus]
--AS
--BEGIN
--    SET NOCOUNT ON;

--    -- Create a temporary table to store output from GetEmployeeAttendanceBonus
--    CREATE TABLE #AttendanceBonus (
--        pn_CompanyID INT,
--        pn_BranchID INT,
--        pn_EmployeeID INT,
--        EmployeeCode NVARCHAR(50),
--        Employee_Full_Name NVARCHAR(100),
--        pn_CategoryId INT,
--        v_CategoryName NVARCHAR(100),
--        Year INT,
--        Month INT,
--        Status_A_Count INT,
--        Attendance_bonus_type NVARCHAR(50),
--        Attendance_Bonus_Value DECIMAL(18, 2)
--    );

--    -- Insert data from GetEmployeeAttendanceBonus into the temporary table
--    INSERT INTO #AttendanceBonus
--    EXEC dbo.GetEmployeeAttendanceBonus;

--    -- Temporary table to store Employee Allowances
--    WITH EmployeeAllowances AS (
--        SELECT DISTINCT
--            e.pn_CompanyID,
--            e.pn_BranchID,
--            e.Employee_Full_Name,
--            e.EmployeeCode,
--            e.pn_EmployeeID,
--            av.Grade_Name,
--            av.Level_Name,
--            av.v_EarningsName,
--            av.Allowancetype,
--            av.Cal_Based_on,
--            CASE 
--                WHEN av.Allowancetype = 'Fixed' THEN av.value
--                WHEN av.Cal_Based_on = 'CTC' THEN (e.CTC * av.value / 100)
--                WHEN av.Cal_Based_on = 'BasicPay' THEN (e.Basic_Salary * av.value / 100)
--                ELSE 0
--            END AS OriginalAmount,
--            aset.Prorata_basis,
--            av.d_order
--        FROM 
--            [dbo].[AllowanceValues] av
--        JOIN 
--            [dbo].[paym_Employee] e
--            ON av.Grade_Name = e.Grade
--            OR av.Level_Name = e.Grade
--        LEFT JOIN (
--            SELECT 
--                pn_CompanyID, pn_BranchID, v_EarningsName, 
--                MAX(Prorata_basis) AS Prorata_basis
--            FROM 
--                [dbo].[Allowancesettings]
--            GROUP BY 
--                pn_CompanyID, pn_BranchID, v_EarningsName
--        ) aset
--        ON av.pn_companyid = aset.pn_CompanyID
--        AND av.pn_branchid = aset.pn_BranchID
--        AND av.v_EarningsName = aset.v_EarningsName
--        WHERE 
--            av.pn_branchid = e.pn_BranchID
--            AND (av.Allowancetype IN ('Fixed', 'Percentage'))
--            AND NOT (av.c_Regular = 'N' AND av.payslip = 'N')
--    ),
--    AttendanceData AS (
--        SELECT 
--            tc.pn_EmployeeID,
--            YEAR(tc.dates) AS Year,
--            MONTH(tc.dates) AS Month,
--            COUNT(DISTINCT MONTH(tc.dates)) AS MonthsWithAttendance,
--            SUM(CASE WHEN tc.status = 'A' THEN 1 ELSE 0 END) + 
--            SUM(CASE WHEN tc.status = 'HD' THEN 0.5 ELSE 0 END) AS AbsentDays,
--            COUNT(tc.dates) AS TotalDays,
--            COUNT(tc.dates) - 
--            (SUM(CASE WHEN tc.status = 'A' THEN 1 ELSE 0 END) + 
--             SUM(CASE WHEN tc.status = 'HD' THEN 0.5 ELSE 0 END)) AS PaidDays
--        FROM 
--            dbo.time_card tc
--        GROUP BY 
--            tc.pn_EmployeeID, YEAR(tc.dates), MONTH(tc.dates)
--        HAVING COUNT(DISTINCT MONTH(tc.dates)) > 0
--    ),
--    GrossSalaryData AS (
--        SELECT 
--            emp.pn_CompanyID,
--            emp.pn_BranchID,
--            emp.Employee_Full_Name,
--            emp.EmployeeCode,
--            emp.pn_EmployeeID,
--            emp.Basic_Salary,
--            ad.Year,
--            ad.Month,
--            ad.TotalDays,
--            ad.PaidDays,
--            ad.AbsentDays,
--            CASE 
--                WHEN ad.TotalDays > 0 THEN 
--                    (emp.Basic_Salary / ad.TotalDays) * ad.PaidDays
--                ELSE 0 
--            END AS Earned_Basic,
--            (
--                CASE 
--                    WHEN ad.TotalDays > 0 THEN 
--                        (emp.Basic_Salary / ad.TotalDays) * ad.PaidDays
--                    ELSE 0 
--                END +
--                SUM(CASE 
--                    WHEN ea.d_order BETWEEN 1 AND 10 THEN
--                        CASE 
--                            WHEN ea.Prorata_basis = 'Y' THEN 
--                                (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
--                            ELSE ea.OriginalAmount
--                        END
--                    ELSE 0
--                END)
--            ) AS Gross_Salary
--        FROM 
--            EmployeeAllowances ea
--        JOIN 
--            AttendanceData ad
--            ON ea.pn_EmployeeID = ad.pn_EmployeeID
--        JOIN 
--            [dbo].[paym_Employee] emp
--            ON emp.pn_EmployeeID = ea.pn_EmployeeID
--        GROUP BY 
--            emp.pn_CompanyID,
--            emp.pn_BranchID,
--            emp.Employee_Full_Name,
--            emp.EmployeeCode,
--            emp.pn_EmployeeID,
--            emp.Basic_Salary,
--            ad.Year,
--            ad.Month,
--            ad.TotalDays,
--            ad.PaidDays,
--            ad.AbsentDays
--    )
--    -- Final result with Attendance Bonus
--    SELECT 
--        gs.pn_CompanyID,
--        gs.pn_BranchID,
--        gs.Employee_Full_Name,
--        gs.EmployeeCode,
--        gs.pn_EmployeeID,
--        gs.Year,
--        gs.Month,
--        gs.Gross_Salary,
--        ab.Attendance_Bonus_Value,
--        (gs.Gross_Salary + ISNULL(ab.Attendance_Bonus_Value, 0)) AS Total_Value
--    FROM 
--        GrossSalaryData gs
--    LEFT JOIN 
--        #AttendanceBonus ab
--    ON 
--        gs.pn_CompanyID = ab.pn_CompanyID
--        AND gs.pn_BranchID = ab.pn_BranchID
--        AND gs.EmployeeCode = ab.EmployeeCode
--        AND gs.Year = ab.Year
--        AND gs.Month = ab.Month
--    ORDER BY 
--        gs.Year, gs.Month, gs.pn_EmployeeID;

--    -- Drop the temporary table
--    DROP TABLE #AttendanceBonus;
--END;
--GO
--/****** Object:  StoredProcedure [dbo].[CalculateOvertimePay]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE PROCEDURE [dbo].[CalculateOvertimePay]
--AS
--BEGIN
--    -- Create a temporary table to store the output of the stored procedure
--    CREATE TABLE #AllowanceData (
--        pn_CompanyID INT,
--        pn_BranchID INT,
--        pn_EmployeeID INT,
--        Employee_Full_Name VARCHAR(255),
--        EmployeeCode VARCHAR(50),
--        Year INT,
--        Month INT,
--        FullDayAbsences FLOAT,
--        HalfDayAbsences FLOAT,
--        TotalDaysInMonth FLOAT,
--        TotalAbsentDays FLOAT,
--        PaidDays FLOAT,
--        TotalAllowance DECIMAL(18, 2)
--    );

--    -- Execute the stored procedure and insert its output into the temporary table
--    INSERT INTO #AllowanceData
--    EXEC GetEmployeeAllowancesWithFinalOT;

--    -- Use a CTE to precompute the number of days in the month
--    WITH CTE_TimeCard AS (
--        SELECT 
--            tc.*,
--            DAY(EOMONTH(tc.dates)) AS Total_Days_In_Month
--        FROM [dbo].[time_card] tc
--    ),
--    CTE_Overtime AS (
--        SELECT 
--            tc.pn_companyid,
--            tc.pn_branchid,
--            ep.pn_EmployeeID,
--            tc.emp_code,
--            e.Employee_Full_Name,
--            c.v_CategoryName,
--            MONTH(tc.dates) AS Month,
--            YEAR(tc.dates) AS Year,
--            SUM(((e.basic_salary / tc.Total_Days_In_Month * allowance.PaidDays) + ISNULL(allowance.TotalAllowance, 0)) / (tc.Total_Days_In_Month * 8) * o.Ot_Rate) AS TotalOverTimePay
--        FROM 
--            CTE_TimeCard tc
--        JOIN 
--            [dbo].[paym_Employee] e ON tc.emp_code = e.EmployeeCode  
--        JOIN 
--            [dbo].[paym_employee_profile1] ep ON e.pn_EmployeeID = ep.pn_EmployeeID
--        JOIN 
--            [dbo].[paym_category] c ON ep.pn_CategoryId = c.pn_CategoryId
--        JOIN 
--            [dbo].[OtslabNew] o ON c.v_CategoryName = o.Category_Name
--        LEFT JOIN 
--            #AllowanceData allowance ON tc.emp_code = allowance.EmployeeCode
--            AND MONTH(tc.dates) = allowance.Month
--            AND YEAR(tc.dates) = allowance.Year
--        WHERE 
--            CONVERT(TIME, CAST(tc.ot_hrs AS TIME)) BETWEEN CONVERT(TIME, o.Ot_From_Duration) AND CONVERT(TIME, o.Ot_To_Duration)
--        GROUP BY 
--            tc.pn_companyid,
--            tc.pn_branchid,
--            ep.pn_EmployeeID,
--            tc.emp_code,
--            e.Employee_Full_Name,
--            c.v_CategoryName,
--            MONTH(tc.dates),
--            YEAR(tc.dates)
--    )
--    -- Update the paym_paybill table with the calculated TotalOverTimePay
--    UPDATE pb
--    SET pb.ot_amt = ot.TotalOverTimePay
--    FROM [dbo].[paym_paybill] pb
--    JOIN CTE_Overtime ot ON pb.EmployeeCode = ot.emp_code
--        AND pb.pn_EmployeeID = ot.pn_EmployeeID
--        AND MONTH(pb.d_date) = ot.Month
--        AND YEAR(pb.d_date) = ot.Year
--    WHERE pb.Flag = 'M';  -- Only update rows where Flag is 'M'

--    -- Drop the temporary table after use
--    DROP TABLE #AllowanceData;
--END;
--GO
--/****** Object:  StoredProcedure [dbo].[CalculateProRataForCompanyBranch]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE PROCEDURE [dbo].[CalculateProRataForCompanyBranch]
--    @pn_CompanyID INT,
--    @pn_BranchID INT
--AS
--BEGIN
--    WITH PaidDaysCalculation AS (
--        SELECT 
--            TC.emp_code,
--            TC.pn_CompanyID,
--            TC.pn_BranchID,
--            MONTH(TC.dates) AS Month,
--            YEAR(TC.dates) AS Year,
            
--            -- Calculate Present Days, Off Days, WorkFromHome, Holidays, Half Days, Leave Days, and Absent Days
--            SUM(CASE WHEN TC.status = 'P' THEN 1 ELSE 0 END) AS PresentDays,
--            SUM(CASE WHEN TC.status = 'W' THEN 1 ELSE 0 END) AS OffDays,
--            SUM(CASE WHEN TC.status = 'WFH' THEN 1 ELSE 0 END) AS WorkFromHome,
--            SUM(CASE WHEN TC.status = 'H' THEN 1 ELSE 0 END) AS Holidays,
--            SUM(CASE WHEN TC.status = 'HD' THEN 1 ELSE 0 END) AS HalfDays,
--            SUM(CASE WHEN TC.status = 'L' THEN 1 ELSE 0 END) AS LeaveDays,
--            SUM(CASE WHEN TC.status = 'A' THEN 1 ELSE 0 END) AS AbsentDays,
            
--            -- Calculate PaidDays using the given logic
--            (SUM(CASE WHEN TC.status = 'P' THEN 1 ELSE 0 END) +   -- Present Days
--             SUM(CASE WHEN TC.status = 'W' THEN 1 ELSE 0 END) +   -- Off Days
--             (SUM(CASE WHEN TC.status = 'HD' THEN 1 ELSE 0 END) * 0.5) + -- Half Days (Half considered)
          
--             SUM(CASE WHEN TC.status = 'H' THEN 1 ELSE 0 END) +   -- Holidays
--             SUM(CASE WHEN TC.status = 'WFH' THEN 1 ELSE 0 END))  -- Work From Home
--             AS PaidDays,

--            -- Calculate Total Days in the month from the 'dates' column
--            COUNT(*) AS TotalDays
        
--        FROM [dbo].[time_card] TC
--        WHERE TC.pn_CompanyID = @pn_CompanyID
--          AND TC.pn_BranchID = @pn_BranchID
--        GROUP BY TC.emp_code, TC.pn_CompanyID, TC.pn_BranchID, MONTH(TC.dates), YEAR(TC.dates)
--    ),


--    CalculatedValues AS (
--        SELECT 
--            ED.pn_CompanyID, ED.pn_BranchID,EDV.pn_EmployeeID, EDM.Allowance1, EDM.Allowance2, EDM.Allowance3,EDM.Allowance4, EDM.Allowance5,
--			EDM.Allowance6, EDM.Allowance7, EDM.Allowance8, EDM.Allowance9, EDM.Allowance10,
--			EDM.Deduction1,EDM.Deduction2, EDM.Deduction3,EDM.Deduction4, EDM.Deduction5, EDM.Deduction6,EDM.Deduction7,
--			EDM.Deduction8, EDM.Deduction9, EDM.Deduction10,
--            PE.EmployeeCode, PE.Employee_Full_Name, PDE.v_DesignationName,PD.v_DepartmentName,PG.v_GradeName, CAT.v_CategoryName,
--			PEW.JoiningDate,PE.CTC,PDC.PaidDays, PDC.TotalDays,PDC.PresentDays,PDC.AbsentDays,PDC.OffDays,PDC.Holidays,PDC.LeaveDays,
--            PDC.Month, PDC.Year, PC.CompanyName,PC.Address_Line1,PC.Address_Line2,PC.City, PC.ZipCode,
			

--            -- Calculate EarnedBasic based on PaidDays and TotalDays
--            PE.basic_salary AS BasicSalary,
--            ROUND((PE.basic_salary / PDC.TotalDays) * PDC.PaidDays, 2) AS EarnedBasic,

--			-- Calculate Actual Salary (CTC / 12)
--             (PE.CTC / 12) AS ActualBasic,

--            -- Calculate Allowances 1-10 based on prorata using PaidDays and TotalDays
--          CASE 
--    WHEN ED.Allowance1PRB = 'Y' AND COALESCE(EDV.Value1, '') != '' 
--    THEN ROUND((COALESCE(EDV.Value1, 0) / PDC.TotalDays) * PDC.PaidDays, 2)
--    ELSE ROUND(COALESCE (EDV.Value1, 0), 2)
--END AS value1
--,

--            CASE 
--    WHEN ED.Allowance2PRB = 'Y' AND COALESCE(EDV.Value2, '') != '' 
--    THEN Round((COALESCE(EDV.Value2, 0) / PDC.TotalDays) * PDC.PaidDays, 2)
--    ELSE ROUND(COALESCE(EDV.Value2, 0), 2)
--END AS value2,

--	CASE 
--    WHEN ED.Allowance3PRB = 'Y' AND COALESCE(EDV.Value3, '') != '' 
--    THEN ROUND((COALESCE(EDV.Value3, 0) / PDC.TotalDays) * PDC.PaidDays, 2)
--    ELSE ROUND(COALESCE(EDV.Value3, 0), 2)
--END AS value3,

--			 CASE 
--    WHEN ED.Allowance4PRB = 'Y' AND COALESCE(EDV.Value4, '') != '' 
--    THEN ROUND((COALESCE(EDV.Value4, 0) / PDC.TotalDays) * PDC.PaidDays, 2)
--    ELSE ROUND(COALESCE(EDV.Value4, 0), 2)
--END AS value4,

--			 CASE 
--    WHEN ED.Allowance5PRB = 'Y' AND COALESCE(EDV.Value5, '') != '' 
--    THEN ROUND((COALESCE(EDV.Value5, 0) / PDC.TotalDays) * PDC.PaidDays, 2)
--    ELSE Round(COALESCE(EDV.Value5, 0), 2)
--END AS value5,

--			 CASE 
--    WHEN ED.Allowance6PRB = 'Y' AND COALESCE(EDV.Value6, '') != '' 
--    THEN Round((COALESCE(EDV.Value6, 0) / PDC.TotalDays) * PDC.PaidDays, 2)
--    ELSE Round(COALESCE(EDV.Value6, 0), 2)
--END AS value6,

--			CASE 
--    WHEN ED.Allowance7PRB = 'Y' AND COALESCE(EDV.Value7, '') != '' 
--    THEN Round((COALESCE(EDV.Value7, 0) / PDC.TotalDays) * PDC.PaidDays, 2)
--    ELSE Round(COALESCE(EDV.Value7, 0), 2)
--END AS value7,

--			CASE 
--    WHEN ED.Allowance8PRB = 'Y' AND COALESCE(EDV.Value8, '') != '' 
--    THEN Round((COALESCE(EDV.Value8, 0) / PDC.TotalDays) * PDC.PaidDays, 2)
--    ELSE Round(COALESCE(EDV.Value8, 0), 2)
--END AS value8,

--			CASE 
--    WHEN ED.Allowance9PRB = 'Y' AND COALESCE(EDV.Value9, '') != '' 
--    THEN Round((COALESCE(EDV.Value9, 0) / PDC.TotalDays) * PDC.PaidDays, 2)
--    ELSE Round(COALESCE(EDV.Value9, 0), 2)
--END AS value9,


           
--           CASE 
--    WHEN ED.Allowance10PRB = 'Y' AND COALESCE(EDV.Value10, '') != '' 
--    THEN Round((COALESCE(EDV.Value10, 0) / PDC.TotalDays) * PDC.PaidDays, 2)
--    ELSE Round(COALESCE(EDV.Value10, 0), 2)
--END AS value10,

--            -- Calculate Deductions 1-10 based on prorata using PaidDays and TotalDays
--            -- Similar logic for deductions
--           CASE 
--    WHEN ED.Deduction1PRB = 'Y' AND COALESCE(EDV.ValueA1, '') != '' 
--    THEN Round((COALESCE(EDV.ValueA1, 0) / PDC.TotalDays) * PDC.PaidDays, 2)
--    ELSE Round(COALESCE(EDV.ValueA1, 0), 2)
--END AS valueA1,

--			CASE 
--    WHEN ED.Deduction2PRB = 'Y' AND COALESCE(EDV.ValueA2, '') != '' 
--    THEN Round((COALESCE(EDV.ValueA2, 0) / PDC.TotalDays) * PDC.PaidDays, 2)
--    ELSE Round(COALESCE(EDV.ValueA2, 0), 2)
--END AS valueA2,

--			CASE 
--    WHEN ED.Deduction3PRB = 'Y' AND COALESCE(EDV.ValueA3, '') != '' 
--    THEN Round((COALESCE(EDV.ValueA3, 0) / PDC.TotalDays) * PDC.PaidDays, 2)
--    ELSE Round(COALESCE(EDV.ValueA3, 0), 2)
--END AS valueA3,

--			CASE 
--    WHEN ED.Deduction4PRB = 'Y' AND COALESCE(EDV.ValueA4, '') != '' 
--    THEN Round((COALESCE(EDV.ValueA4, 0) / PDC.TotalDays) * PDC.PaidDays, 2)
--    ELSE Round(COALESCE(EDV.ValueA4, 0), 2)
--END AS valueA4,

--			CASE 
--    WHEN ED.Deduction5PRB = 'Y' AND COALESCE(EDV.ValueA5, '') != '' 
--    THEN Round((COALESCE(EDV.ValueA5, 0) / PDC.TotalDays) * PDC.PaidDays, 2)
--    ELSE Round(COALESCE(EDV.ValueA5, 0), 2)
--END AS valueA5,

--			CASE 
--    WHEN ED.Deduction6PRB = 'Y' AND COALESCE(EDV.ValueA6, '') != '' 
--    THEN Round((COALESCE(EDV.ValueA6, 0) / PDC.TotalDays) * PDC.PaidDays, 2)
--    ELSE Round(COALESCE(EDV.ValueA6, 0), 2)
--END AS valueA6,

--			CASE 
--    WHEN ED.Deduction7PRB = 'Y' AND COALESCE(EDV.ValueA7, '') != '' 
--    THEN Round((COALESCE(EDV.ValueA7, 0) / PDC.TotalDays) * PDC.PaidDays, 2)
--    ELSE Round(COALESCE(EDV.ValueA7, 0), 2)
--END AS valueA7,

--			CASE 
--    WHEN ED.Deduction8PRB = 'Y' AND COALESCE(EDV.ValueA8, '') != '' 
--    THEN Round((COALESCE(EDV.ValueA8, 0) / PDC.TotalDays) * PDC.PaidDays, 2)
--    ELSE COALESCE(EDV.ValueA8, 0)
--END AS valueA8,


--			CASE 
--    WHEN ED.Deduction9PRB = 'Y' AND COALESCE(EDV.ValueA9, '') != '' 
--    THEN Round((COALESCE(EDV.ValueA9, 0) / PDC.TotalDays) * PDC.PaidDays, 2)
--    ELSE Round(COALESCE(EDV.ValueA9, 0), 2)
--END AS valueA9,

--			CASE 
--    WHEN ED.Deduction10PRB = 'Y' AND COALESCE(EDV.ValueA10, '') != '' 
--    THEN Round((COALESCE(EDV.ValueA10, 0) / PDC.TotalDays) * PDC.PaidDays, 2)
--    ELSE Round(COALESCE(EDV.ValueA10, 0), 2)
--END AS valueA10

--            -- Other deductions (up to 10) handled similarly...
--      FROM ProRataBasisMasters ED
--    JOIN EarnDeductValuesMasters EDV 
--        ON ED.pn_CompanyID = EDV.pn_CompanyID 
--        AND ED.pn_BranchID = EDV.pn_BranchID
  
--    JOIN paym_Employee PE 
--        ON PE.pn_EmployeeID = EDV.pn_EmployeeID  -- Ensure this join is correctly placed
--    JOIN paym_employee_profile1 EP 
--        ON EP.pn_EmployeeID = PE.pn_EmployeeID  -- Use PE here since it has been joined above
--    JOIN paym_Grade PG 
--        ON PG.pn_GradeID = EP.pn_GradeId
--    JOIN paym_Designation PDE 
--        ON PDE.pn_DesignationID = EP.pn_DesignationId
--    JOIN paym_Department PD 
--        ON PD.pn_DepartmentID = EP.pn_DepartmentId
--    JOIN paym_Company PC 
--        ON PC.pn_CompanyID = EP.pn_CompanyID
--    JOIN paym_Category CAT 
--        ON CAT.pn_CategoryID = EP.pn_CategoryId
--    JOIN paym_Employee_WorkDetails PEW 
--        ON PEW.pn_EmployeeID = PE.pn_EmployeeID  -- Make sure alias matches
--    JOIN PaidDaysCalculation PDC 
--        ON PE.EmployeeCode = PDC.emp_code
--		  JOIN EarnDeductMasters EDM 
--	ON EDV.pn_CompanyID = EDM.pn_CompanyID 
--	AND EDV.pn_BranchID = EDM.pn_BranchID
--    ),
--    GrossSalaryCalculation AS (
--        SELECT *,
--            -- Calculate Gross Salary as Earn edBasic + all Allowances (Null values treated as 0)
--            EarnedBasic + 
--            ISNULL(value1, 0) + 
--            ISNULL(value2, 0) + 
--            ISNULL(value3, 0) + 
--            ISNULL(value4, 0) + 
--            ISNULL(value5, 0) + 
--            ISNULL(value6, 0) + 
--            ISNULL(value7, 0) + 
--            ISNULL(value8, 0) + 
--            ISNULL(value9, 0) + 
--            ISNULL(value10, 0) AS GrossSalary,


--			 -- Calculate Total Allowances (Null values treated as 0)
--            ISNULL(value1, 0) + 
--            ISNULL(value2, 0) + 
--            ISNULL(value3, 0) + 
--            ISNULL(value4, 0) + 
--            ISNULL(value5, 0) + 
--            ISNULL(value6, 0) + 
--            ISNULL(value7, 0) + 
--            ISNULL(value8, 0) + 
--            ISNULL(value9, 0) + 
--            ISNULL(value10, 0) AS Earned_Amount,

--            -- Calculate Total Deductions (Null values treated as 0)
--            ISNULL(valueA1, 0) + 
--            ISNULL(valueA2, 0) + 
--            ISNULL(valueA3, 0) + 
--            ISNULL(valueA4, 0) + 
--            ISNULL(valueA5, 0) + 
--            ISNULL(valueA6, 0) + 
--            ISNULL(valueA7, 0) + 
--            ISNULL(valueA8, 0) + 
--            ISNULL(valueA9, 0) + 
--            ISNULL(valueA10, 0) AS Deducted_Amount,

--            -- Calculate Net Salary: GrossSalary - TotalDeductions
--            (EarnedBasic + 
--             ISNULL(value1, 0) + 
--            ISNULL(value2, 0) + 
--            ISNULL(value3, 0) + 
--            ISNULL(value4, 0) + 
--            ISNULL(value5, 0) + 
--            ISNULL(value6, 0) + 
--            ISNULL(value7, 0) + 
--            ISNULL(value8, 0) + 
--            ISNULL(value9, 0) + 
--            ISNULL(value10, 0)) 
--             - (ISNULL(valueA1, 0) + 
--            ISNULL(valueA2, 0) + 
--            ISNULL(valueA3, 0) + 
--            ISNULL(valueA4, 0) + 
--            ISNULL(valueA5, 0) + 
--            ISNULL(valueA6, 0) + 
--            ISNULL(valueA7, 0) + 
--            ISNULL(valueA8, 0) + 
--            ISNULL(valueA9, 0) + 
--            ISNULL(valueA10, 0)) AS NetSalary
--        FROM CalculatedValues
--    )
--    INSERT INTO [dbo].[paym_paybill]
--           ([pn_CompanyID]
--           ,[pn_BranchID]
--           ,[pn_EmployeeID]
--           ,[EmployeeCode]
--           ,[Employee_First_Name]
--           ,[DesignationName]
--           ,[DepartmentName]
--           ,[GradeName]
--           ,[CategoryName]
--           ,[JoiningDate]
--           ,[d_date]
--           ,[Earn_Amount]
--           ,[Ded_Amount]
--           ,[NetPay]
--           ,[Earned_Basic]
--           ,[Gross_salary]
--           ,[Net_salary]
--           ,[EPF]
--           ,[FPF]
--           ,[period_code]
--           ,[max_amount]
--           ,[Act_Basic]
--           ,[Calc_Days]
--           ,[Paid_Days]
--           ,[Present_Days]
--           ,[Absent_Days]
--           ,[WeekOffDays]
--           ,[Holidays]
--           ,[TotLeave_Days]
--           ,[ot_hrs]
--           ,[ot_value]
--           ,[ot_amt]
--           ,[Allowance1]
--           ,[value1]
--           ,[Allowance2]
--           ,[value2]
--           ,[Allowance3]
--           ,[value3]
--           ,[Allowance4]
--           ,[value4]
--           ,[Allowance5]
--           ,[value5]
--           ,[Allowance6]
--           ,[value6]
--           ,[Allowance7]
--           ,[value7]
--           ,[Allowance8]
--           ,[value8]
--           ,[Allowance9]
--           ,[value9]
--           ,[Allowance10]
--           ,[value10]
--           ,[Deduction1]
--           ,[valueA1]
--           ,[Deduction2]
--           ,[valueA2]
--           ,[Deduction3]
--           ,[valueA3]
--           ,[Deduction4]
--           ,[valueA4]
--           ,[Deduction5]
--           ,[valueA5]
--           ,[Deduction6]
--           ,[valueA6]
--           ,[Deduction7]
--           ,[valueA7]
--           ,[Deduction8]
--           ,[valueA8]
--           ,[Deduction9]
--           ,[valueA9]
--           ,[Deduction10]
--           ,[valueA10]
--           ,[CompanyName]
--           ,[Address_line1]
--           ,[Address_Line2]
--           ,[City]
--           ,[Zipcode])
--    SELECT 
--           @pn_CompanyID
--           ,@pn_BranchID
--           ,pn_EmployeeID
--           ,EmployeeCode
--           ,Employee_Full_Name
--           ,v_DesignationName
--           ,v_DepartmentName
--           ,v_GradeName
--           ,v_CategoryName
--           ,JoiningDate
--           ,DATEFROMPARTS(Year, Month, 1) AS d_date  -- Use the month and year from the time_card table
--           ,Earned_Amount
--           ,Deducted_Amount
--           ,NetSalary
--           ,EarnedBasic
--           ,GrossSalary
--           ,NetSalary
--           ,0  -- EPF
--           ,0  -- FPF
--           ,0  -- period_code
--           ,CTC  -- max_amount
--           ,ActualBasic
--           ,TotalDays  -- Calc_Days
--           ,PaidDays
--           ,PresentDays
--           ,AbsentDays
--           ,OffDays  -- WeekOffDays
--           ,Holidays
--           ,LeaveDays  -- TotLeave_Days
--           ,0  -- ot_hrs
--           ,0  -- ot_value
--           ,0  -- ot_amt
--           ,Allowance1  -- Allowance1-10
--           ,value1
--           ,Allowance2  -- Allowance2-10
--           ,value2
--           ,Allowance3  -- Allowance3-10
--           ,value3
--           ,Allowance4  -- Allowance4-10
--           ,value4
--           ,Allowance5  -- Allowance5-10
--           ,value5
--           ,Allowance6  -- Allowance6-10
--           ,value6
--           ,Allowance7  -- Allowance7-10
--           ,value7
--           ,Allowance8  -- Allowance8-10
--           ,value8
--           ,Allowance9  -- Allowance9-10
--           ,value9
--           ,Allowance10  -- Allowance10
--           ,value10
--           ,Deduction1  -- Deduction1-10
--           ,valueA1
--           ,Deduction2  -- Deduction2-10
--           ,valueA2
--           ,Deduction3  -- Deduction3-10
--           ,valueA3
--           ,Deduction4  -- Deduction4-10
--           ,valueA4
--           ,Deduction5  -- Deduction5 -10
--           ,valueA5
--           ,Deduction6  -- Deduction6-10
--           ,valueA6
--           ,Deduction7  -- Deduction7-10
--           ,valueA7
--           ,Deduction8  -- Deduction8-10
--           ,valueA8
--           ,Deduction9  -- Deduction9-10
--           ,valueA9
--           ,Deduction10  -- Deduction10
--           ,valueA10
--           ,CompanyName
--           ,Address_Line1
--           ,Address_Line2
--           ,City
--           ,ZipCode
--    FROM GrossSalaryCalculation
--    WHERE NOT EXISTS (
--        SELECT 1
--        FROM [dbo].[paym_paybill] PP
--        WHERE PP.pn_CompanyID = @pn_CompanyID
--          AND PP.pn_BranchID = @pn_BranchID
--          AND PP.pn_EmployeeID = GrossSalaryCalculation.pn_EmployeeID
--          AND PP.d_date = DATEFROMPARTS(GrossSalaryCalculation.Year, GrossSalaryCalculation.Month, 1)
--    );
--END;
--GO
--/****** Object:  StoredProcedure [dbo].[CalculateTotalDeductions]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO

--CREATE PROCEDURE [dbo].[CalculateTotalDeductions]
--AS
--BEGIN
--    -- Temporary tables to hold the results of the table-valued functions
--    CREATE TABLE #GrossSalaryAndESI (
--        pn_companyid INT,
--        pn_branchid INT,
--        Year INT,
--        Month INT,
--        Employee_Full_Name NVARCHAR(50),
--        EmployeeCode NVARCHAR(50),
--        Earned_Basic_Salary DECIMAL(18, 2),
--        Total_Allowance_Amt DECIMAL(18, 2),
--        Gross_Salary DECIMAL(18, 2),
--        TotalDays FLOAT,
--        Paid_Days FLOAT,
--        Employee_Contribution FLOAT,
--        Employer_Contribution FLOAT,
--        Employee_ESI_Contribution DECIMAL(18, 2),
--        Employer_ESI_Contribution DECIMAL(18, 2),
--        Total_ESI_Contribution DECIMAL(18, 2),
--        ESI_D_Order INT,
--        Type NVARCHAR(50)
--    );

--    CREATE TABLE #CTCLimits (
--        pn_CompanyID INT,
--        pn_BranchID INT,
--        EmployeeCode NVARCHAR(50),
--        Employee_Full_Name NVARCHAR(50),
--        State NVARCHAR(50),
--        Lower_limit DECIMAL(18, 2),
--        Upper_limit NVARCHAR(20),
--        CTC DECIMAL(18, 2),
--        Annual_basis DECIMAL(18, 2),
--        Half_yearly DECIMAL(18, 2),
--        Monthly_Amount DECIMAL(18, 2),
--        d_order INT,
--        Type NVARCHAR(50)
--    );

--    CREATE TABLE #PFContributions (
--        pn_companyid INT,
--        pn_branchid INT,
--        emp_code NVARCHAR(50),
--        emp_name NVARCHAR(50),
--        basic_salary DECIMAL(18, 2),
--        Level_Name NVARCHAR(50),
--        PF char(1),
--        Month INT,
--        Year INT,
--        Absent float,
--        Present float,
--        Leave float,
--        Holiday float,
--        Work_From_Home float,
--        HalfDay float,
--        WeekOff float,
--        PaidDays float,
--        TotalDaysInMonth INT,
--        Fix_Amount DECIMAL(18, 2),
--        Earn_Amt DECIMAL(18, 2),
--        Total_Earn_Amount DECIMAL(18, 2),
--        PF_Contribution DECIMAL(18, 2),
--        EPF_Contribution DECIMAL(18, 2),
--        EPS_Contribution DECIMAL(18, 2),
--        Total_Contribution DECIMAL(18, 2)
--    );

--    -- Insert data from the first table-valued function
--    INSERT INTO #GrossSalaryAndESI
--    SELECT * FROM dbo.CalculateGrossSalaryAndESIwithprorataDisplay();

--    -- Insert data from the second table-valued function
--    INSERT INTO #CTCLimits
--    SELECT * 
--    FROM dbo.CheckCTCLimitsDisplay()
--    ORDER BY pn_CompanyID, pn_BranchID, EmployeeCode;

--    -- Insert data from the PF contributions function
--    INSERT INTO #PFContributions
--    SELECT * FROM dbo.Total_PF(); -- Replace with your actual function name

--    -- Join the results and calculate Total Deduction
--    SELECT 
--        g.pn_companyid,
--        g.pn_branchid,
--        g.Year,
--        g.Month,
--        g.EmployeeCode,
--        ISNULL(c.Monthly_Amount, 0) AS PT_Monthly_Amount,
--        ISNULL(g.Total_ESI_Contribution, 0) AS TOTALESI,
--        ISNULL(p.Total_Contribution, 0) AS TotalPFContribution,
--        ISNULL(c.Monthly_Amount, 0) + ISNULL(g.Total_ESI_Contribution, 0) + ISNULL(p.Total_Contribution, 0) AS TotalDeductionAmount
--    INTO #Result
--    FROM #GrossSalaryAndESI g
--    LEFT JOIN #CTCLimits c
--        ON g.pn_companyid = c.pn_CompanyID
--        AND g.pn_branchid = c.pn_BranchID
--        AND g.EmployeeCode = c.EmployeeCode
--    LEFT JOIN #PFContributions p
--        ON g.pn_companyid = p.pn_companyid
--        AND g.pn_branchid = p.pn_branchid
--		AND g.EmployeeCode = p.emp_code
--        AND g.Month = p.Month
--        AND g.Year = p.Year;

--    -- Return the results
--    SELECT 
--        r.pn_companyid,
--        r.pn_branchid,
--        r.Year,
--        r.Month,
--        r.EmployeeCode,
--        r.PT_Monthly_Amount,
--        r.TOTALESI,
--        r.TotalPFContribution,
--        r.TotalDeductionAmount
--    FROM #Result r;

--    -- Cleanup temporary tables
--    DROP TABLE #GrossSalaryAndESI;
--    DROP TABLE #CTCLimits;
--    DROP TABLE #PFContributions;
--    DROP TABLE #Result;
--END;
--GO
--/****** Object:  StoredProcedure [dbo].[CheckCTCLimitsonlybranchpt]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE PROCEDURE [dbo].[CheckCTCLimitsonlybranchpt]
--    @CompanyID INT,
--    @BranchID INT
--AS
--BEGIN
--    -- Select employees and tax slab information where CTC fits between Lower_limit and Upper_limit
--    SELECT 
--        e.pn_CompanyID,
--        e.pn_BranchID,
--        e.EmployeeCode,
--        e.Employee_Full_Name,
--        pt.State,
--        pt.Lower_limit,
--        pt.Upper_limit,
--        e.CTC,
--        pt.Annual_basis,
--        pt.Half_yearly,
--        pt.Monthly_Amount
		
--    FROM 
--        dbo.paym_Employee e
--    INNER JOIN 
--        dbo.Professional_Tax pt
--        ON e.pn_CompanyID = pt.pn_companyid 
--        AND e.pn_BranchID = pt.pn_branchid
--    WHERE 
--        e.pn_CompanyID = @CompanyID
--        AND e.pn_BranchID = @BranchID
--        -- Use TRY_CAST to safely convert Upper_limit to numeric and handle non-numeric values
--        AND e.CTC BETWEEN pt.Lower_limit AND ISNULL(TRY_CAST(pt.Upper_limit AS numeric(10,2)), e.CTC + 1)
--    ORDER BY 
--        e.pn_CompanyID, e.pn_BranchID, e.EmployeeCode;
--END
--GO
--/****** Object:  StoredProcedure [dbo].[CombinedPaybillProcessing]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO

--CREATE PROCEDURE [dbo].[CombinedPaybillProcessing]
--AS
--BEGIN
--    -- Begin a transaction to ensure all steps are executed or none in case of failure
--    BEGIN TRANSACTION;

--    BEGIN TRY
--        -- Execute each stored procedure in order
--        EXEC GetAttendanceSummaryWithAllowances;
--        EXEC UpdateESIContributionsInPaybill;
--        EXEC CalculateOvertimePay;
--        EXEC UpdatePTinpaybill;

--        -- Commit the transaction if all succeed
--        COMMIT TRANSACTION;
--    END TRY
--    BEGIN CATCH
--        -- Rollback the transaction in case of any error
--        ROLLBACK TRANSACTION;

--        -- Print or rethrow the error for debugging
--        THROW;
--    END CATCH
--END;
--GO
--/****** Object:  StoredProcedure [dbo].[DisplayOvertimePay]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE PROCEDURE [dbo].[DisplayOvertimePay]
--AS
--BEGIN
--    -- Use a CTE to precompute the number of days in the month
--    WITH CTE_TimeCard AS (
--        SELECT 
--            tc.*,
--            DAY(EOMONTH(tc.dates)) AS Total_Days_In_Month
--        FROM [dbo].[time_card] tc
--    ),
--    CTE_Overtime AS (
--        SELECT 
--            tc.pn_companyid,
--            tc.pn_branchid,
--            ep.pn_EmployeeID,
--            tc.emp_code AS EmployeeCode,
--            e.Employee_Full_Name,
--            c.v_CategoryName,
--            MONTH(tc.dates) AS Month,
--            YEAR(tc.dates) AS Year,
--            SUM(((e.basic_salary / tc.Total_Days_In_Month * allowance.PaidDays) + ISNULL(allowance.TotalAllowance, 0)) / (tc.Total_Days_In_Month * 8) * o.Ot_Rate) AS TotalOverTimePay
--        FROM 
--            CTE_TimeCard tc
--        JOIN 
--            [dbo].[paym_Employee] e ON tc.emp_code = e.EmployeeCode  
--        JOIN 
--            [dbo].[paym_employee_profile1] ep ON e.pn_EmployeeID = ep.pn_EmployeeID
--        JOIN 
--            [dbo].[paym_category] c ON ep.pn_CategoryId = c.pn_CategoryId
--        JOIN 
--            [dbo].[OtslabNew] o ON c.v_CategoryName = o.Category_Name
--        -- Replace the temp table with the table-valued function
--        CROSS APPLY dbo.GetEmployeeAllowancesWithFinalOTDisplay() allowance
--        WHERE 
--            CONVERT(TIME, CAST(tc.ot_hrs AS TIME)) BETWEEN CONVERT(TIME, o.Ot_From_Duration) AND CONVERT(TIME, o.Ot_To_Duration)
--            AND tc.emp_code = allowance.EmployeeCode  -- Matching the employee code
--            AND MONTH(tc.dates) = allowance.Month     -- Matching the month
--            AND YEAR(tc.dates) = allowance.Year       -- Matching the year
--        GROUP BY 
--            tc.pn_companyid,
--            tc.pn_branchid,
--            ep.pn_EmployeeID,
--            tc.emp_code,
--            e.Employee_Full_Name,
--            c.v_CategoryName,
--            MONTH(tc.dates),
--            YEAR(tc.dates)
--    )
--    -- Display the calculated TotalOverTimePay instead of updating the paym_paybill table
--    SELECT 
--        ot.pn_companyid AS CompanyID,
--        ot.pn_branchid AS BranchID,
--        ot.pn_EmployeeID AS EmployeeID,
--        ot.EmployeeCode,
--        ot.Employee_Full_Name AS EmployeeName,
--        ot.Month,
--        ot.Year,
--        ot.TotalOverTimePay
--    FROM 
--        CTE_Overtime ot;
--END;
--GO
--/****** Object:  StoredProcedure [dbo].[FinalSalaryCalculation2]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO


--CREATE PROCEDURE [dbo].[FinalSalaryCalculation2] 
--    @EmployeeCode VARCHAR(50),
--    @Month INT,
--    @Year INT,
--    @D_dates datetime
--AS
--BEGIN
--    DECLARE @workingdays INT;
--    DECLARE @paiddays INT;
--    DECLARE @firstOfMonth DATE = DATEFROMPARTS(@Year, @Month, 1);
--    DECLARE @lastOfMonth DATE = EOMONTH(@firstOfMonth);
	
--    -- Calculate working days in the specified month
--    SELECT @workingdays = COUNT(*) 
--    FROM time_card 
--    WHERE emp_code = @EmployeeCode
--      AND dates BETWEEN @firstOfMonth AND @lastOfMonth;

--    -- Calculate paid days in the specified month
--    SELECT @paiddays = COUNT(CASE WHEN status = 'P' THEN 1 END) 
--                        + COUNT(CASE WHEN status = 'W' THEN 1 END) 
--                        + COUNT(CASE WHEN status = 'H' THEN 1 END) 
--                        + COUNT(CASE WHEN status = 'L' THEN 1 END)
--    FROM time_card 
--    WHERE emp_code = @EmployeeCode
--      AND dates BETWEEN @firstOfMonth AND @lastOfMonth;

--    DECLARE @Earn_Amount FLOAT = 0; 
--    DECLARE @Ded_Amount FLOAT = 0;
--    DECLARE @NetPay FLOAT = 0; 
--    DECLARE @Earned_Basic FLOAT = 0; 
--    DECLARE @Gross_salary FLOAT = 0; 
--    DECLARE @Net_salary FLOAT = 0; 
--    DECLARE @PF_Pct FLOAT = 0; 
--    DECLARE @ESI_Pct FLOAT = 0;
--    DECLARE @FPF FLOAT = 0; 
--    DECLARE @max_amount FLOAT = 0; 
--    DECLARE @Act_Basic FLOAT = 0; 
--    DECLARE @Calc_Days FLOAT = 0; 
--    DECLARE @Paid_Days FLOAT = 0; 
--    DECLARE @Present_Days FLOAT = 0; 
--    DECLARE @Absent_Days FLOAT = 0; 
--    DECLARE @WeekOffDays FLOAT = 0; 
--    DECLARE @Holidays FLOAT = 0; 
--    DECLARE @TotLeave FLOAT = 0; 
--    DECLARE @ot_value FLOAT = 0; 
--    DECLARE @ot_amt FLOAT = 0; 
--    DECLARE @value1 FLOAT = 0;
--    DECLARE @value2 FLOAT = 0;
--    DECLARE @value3 FLOAT = 0;
--    DECLARE @value4 FLOAT = 0;
--    DECLARE @value5 FLOAT = 0;
--    DECLARE @value6 FLOAT = 0;
--    DECLARE @value7 FLOAT = 0;
--    DECLARE @value8 FLOAT = 0;
--    DECLARE @value9 FLOAT = 0;
--    DECLARE @value10 FLOAT = 0;
--    DECLARE @valueA1 FLOAT = 0;
--    DECLARE @valueA2 FLOAT = 0;
--    DECLARE @valueA3 FLOAT = 0;
--    DECLARE @valueA4 FLOAT = 0;
--    DECLARE @valueA5 FLOAT = 0;
--    DECLARE @valueA6 FLOAT = 0;
--    DECLARE @valueA7 FLOAT = 0;
--    DECLARE @valueA8 FLOAT = 0;
--    DECLARE @valueA9 FLOAT = 0;
--    DECLARE @valueA10 FLOAT = 0;
--    DECLARE @MonthlySalary FLOAT;

--    SELECT 
--        @Earn_Amount = Earn_Amount,
--        @Ded_Amount = Ded_Amount,
--        @NetPay = NetPay,
--        @Earned_Basic = Earned_Basic,
--        @Gross_salary = Gross_salary,
--        @Net_salary = Net_salary,
--        @PF_Pct = EPF,
--        @FPF = FPF,
--        @max_amount = max_amount,
--        @Act_Basic = Act_Basic,
--        @Present_Days = Present_Days,
--        @Absent_Days = Absent_Days,
--        @WeekOffDays = WeekOffDays,
--        @Holidays = Holidays,
--        @Totleave = TotLeave_Days,
--        @ot_value = ot_value,
--        @ot_amt = ot_amt,
--        @value1 = value1,
--        @value2 = value2,
--        @value3 = value3,
--        @value4 = value4,
--        @value5 = value5,
--        @value6 = value6,
--        @value7 = value7,
--        @value8 = value8,
--        @value9 = value9,
--        @value10 = value10,
--        @valueA1 = valueA1,
--        @valueA2 = valueA2,
--        @valueA3 = valueA3,
--        @valueA4 = valueA4,
--        @valueA5 = valueA5,
--        @valueA6 = valueA6,
--        @valueA7 = valueA7,
--        @valueA8 = valueA8,
--        @valueA9 = valueA9,
--        @valueA10 = valueA10
--    FROM paym_paybill 
--    WHERE EmployeeCode = @EmployeeCode and d_date = @D_dates

--	DECLARE @HRA FLOAT = @Act_Basic * (@value1 / 100.0);
--    DECLARE @TotalAllowances FLOAT = @HRA + @value2 + @value3 + @value4 + @value5 + @value6 + @value7 + @value8 + @value9 + @value10;
--    DECLARE @GrossPay FLOAT = @Act_Basic + @TotalAllowances;
--    DECLARE @PF_Amount FLOAT = @Act_Basic * (@PF_Pct / 100.0);
--    DECLARE @ESI_Amount FLOAT = @GrossPay * (@valueA1 / 100.0);
	

--    SET @MonthlySalary = CEILING(
--        (@Act_Basic / @workingdays) * @paiddays 
--        + @TotalAllowances 
--        - (@PF_Amount + @ESI_Amount + @valueA2 + @valueA3 + @valueA4 + @valueA5 + @valueA6 + @valueA7 + @valueA8 + @valueA9 + @valueA10)
--    );

--    SELECT @MonthlySalary AS MonthlySalary;
--END;

--GO
--/****** Object:  StoredProcedure [dbo].[GetAttendanceSummary]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE PROCEDURE [dbo].[GetAttendanceSummary]
--    @Month INT,
--    @Year INT
--AS
--BEGIN
--    SET NOCOUNT ON;

--    -- Calculate StartDate and EndDate based on Month and Year
--    DECLARE @StartDate DATE = DATEFROMPARTS(@Year, @Month, 1);
--    DECLARE @EndDate DATE = EOMONTH(@StartDate);

--    SELECT 
--        tc.pn_companyid,
--        tc.pn_branchid,
--        tc.pn_EmployeeID,
--        tc.emp_code,
--        tc.emp_name,
--        tc.shift_code,
--        emp.CTC,
--        emp.basic_salary,
--        emp.Grade,
--        emp.Overall_Experience,
--        COUNT(tc.dates) AS Total_Calculated_Days,
--        SUM(CASE WHEN tc.status = 'P' THEN 1 ELSE 0 END) AS Present,
--        SUM(CASE WHEN tc.status = 'A' THEN 1 ELSE 0 END) AS Absent,
--        SUM(CASE WHEN tc.status = 'L' THEN 1 ELSE 0 END) AS Leave,
--        SUM(CASE WHEN tc.status = 'H' THEN 1 ELSE 0 END) AS Holiday,
--        SUM(CASE WHEN tc.status = 'WFH' THEN 1 ELSE 0 END) AS Work_From_Home,
--        SUM(CASE WHEN tc.status = 'HD' THEN 1 ELSE 0 END) AS HalfDay,
--        SUM(CASE WHEN tc.status = 'W' THEN 1 ELSE 0 END) AS WeekOff,
--        -- Calculate Paid Days considering Half Days and Leaves
--        SUM(CASE WHEN tc.status IN ('P', 'W', 'H', 'WFH', 'L') THEN 1 ELSE 0 END) 
--        + SUM(CASE WHEN tc.status = 'HD' THEN 0.5 ELSE 0 END) AS Paid_Days,
--        -- Calculate Earned Basic
--        CASE 
--            WHEN COUNT(tc.dates) > 0 THEN 
--                (emp.basic_salary / COUNT(tc.dates)) * 
--                (
--                    SUM(CASE WHEN tc.status IN ('P', 'W', 'H', 'WFH', 'L') THEN 1 ELSE 0 END) 
--                    + SUM(CASE WHEN tc.status = 'HD' THEN 0.5 ELSE 0 END)
--                )
--            ELSE 0 
--        END AS Earned_Basic,
--        -- Additional fields from related tables
--        dp.v_DesignationName,
--        dpt.v_DepartmentName,
--        ct.v_CategoryName,
--        ep.d_Date AS JoiningDate,
--        co.CompanyName,
--        co.Address_Line1,
--        co.Address_Line2,
--        co.City,
--        co.ZipCode
--    FROM 
--        dbo.time_card tc
--    INNER JOIN 
--        dbo.paym_Employee emp ON tc.pn_EmployeeID = emp.pn_EmployeeID
--    INNER JOIN 
--        dbo.paym_employee_profile1 ep ON emp.pn_EmployeeID = ep.pn_EmployeeID
--    INNER JOIN 
--        dbo.paym_Designation dp ON ep.pn_DesignationId = dp.pn_DesignationId
--    INNER JOIN 
--        dbo.paym_Department dpt ON ep.pn_DepartmentId = dpt.pn_DepartmentId
--    INNER JOIN 
--        dbo.paym_Category ct ON ep.pn_CategoryId = ct.pn_CategoryId
--    INNER JOIN 
--        dbo.paym_Company co ON ep.pn_CompanyID = co.pn_CompanyID
--    WHERE 
--        tc.dates BETWEEN @StartDate AND @EndDate
--    GROUP BY 
--        tc.pn_companyid,
--        tc.pn_branchid,
--        tc.pn_EmployeeID,
--        tc.emp_code,
--        tc.emp_name,
--        tc.shift_code,
--        emp.CTC,
--        emp.basic_salary,
--        emp.Grade,
--        emp .Overall_Experience,
--        dp.v_DesignationName,
--        dpt.v_DepartmentName,
--        ct.v_CategoryName,
--        ep.d_Date,
--        co.CompanyName,
--        co.Address_Line1,
--        co.Address_Line2,
--        co.City,
--        co.ZipCode
--END

--GO
--/****** Object:  StoredProcedure [dbo].[GetAttendanceSummaryInsertquery]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE PROCEDURE [dbo].[GetAttendanceSummaryInsertquery]
--    @Month INT,
--    @Year INT
--AS
--BEGIN
--    SET NOCOUNT ON;

--    -- Calculate StartDate and EndDate based on Month and Year
--    DECLARE @StartDate DATE = DATEFROMPARTS(@Year, @Month, 1);
--    DECLARE @EndDate DATE = EOMONTH(@StartDate);

--    -- Insert selected data into paym_paybill table
--    INSERT INTO [dbo].[paym_paybill]
--           ([pn_CompanyID],
--            [pn_BranchID],
--            [pn_EmployeeID],
--            [EmployeeCode],
--            [Employee_First_Name],
--            [DesignationName],
--            [DepartmentName],
--            [GradeName],
--            [CategoryName],
--            [JoiningDate],
--            [d_date],
--            [Earned_Basic],
--            [Act_Basic],
--            [Calc_Days],
--            [Paid_Days],
--            [Present_Days],
--            [Absent_Days],
--            [WeekOffDays],
--            [Holidays],
--            [TotLeave_Days],
--            [CompanyName],
--            [Address_line1],
--            [Address_Line2],
--            [City],
--            [Zipcode])
--    SELECT 
--        tc.pn_companyid AS [pn_CompanyID],
--        tc.pn_branchid AS [pn_BranchID],
--        tc.pn_EmployeeID AS [pn_EmployeeID],
--        tc.emp_code AS [EmployeeCode],
--        tc.emp_name AS [Employee_First_Name],
--        dp.v_DesignationName AS [DesignationName],
--        dpt.v_DepartmentName AS [DepartmentName],
--        emp.Grade AS [GradeName],
--        ct.v_CategoryName AS [CategoryName],
--        ep.d_Date AS [JoiningDate],
--        GETDATE() AS [d_date], -- Use current date for d_date
--        CASE 
--            WHEN COUNT(tc.dates) > 0 THEN 
--                (emp.basic_salary / COUNT(tc.dates)) * 
--                (
--                    SUM(CASE WHEN tc.status IN ('P', 'W', 'H', 'WFH', 'L') THEN 1 ELSE 0 END) 
--                    + SUM(CASE WHEN tc.status = 'HD' THEN 0.5 ELSE 0 END)
--                )
--            ELSE 0 
--        END AS [Earned_Basic],
--        emp.basic_salary AS [Act_Basic],
--        COUNT(tc.dates) AS [Calc_Days],
--        SUM(CASE WHEN tc.status IN ('P', 'W', 'H', 'WFH', 'L') THEN 1 ELSE 0 END) 
--        + SUM(CASE WHEN tc.status = 'HD' THEN 0.5 ELSE 0 END) AS [Paid_Days],
--        SUM(CASE WHEN tc.status = 'P' THEN 1 ELSE 0 END) AS [Present_Days],
--        SUM(CASE WHEN tc.status = 'A' THEN 1 ELSE 0 END) AS [Absent_Days],
--        SUM(CASE WHEN tc.status = 'W' THEN 1 ELSE 0 END) AS [WeekOffDays],
--        SUM(CASE WHEN tc.status = 'H' THEN 1 ELSE 0 END) AS [Holidays],
--        SUM(CASE WHEN tc.status = 'L' THEN 1 ELSE 0 END) AS [TotLeave_Days],
--        co.CompanyName AS [CompanyName],
--        co.Address_Line1 AS [Address_line1],
--        co.Address_Line2 AS [Address_Line2],
--        co.City AS [City],
--        co.ZipCode AS [Zipcode]
--    FROM 
--        dbo.time_card tc
--    INNER JOIN 
--        dbo.paym_Employee emp ON tc.pn_EmployeeID = emp.pn_EmployeeID
--    INNER JOIN 
--        dbo.paym_employee_profile1 ep ON emp.pn_EmployeeID = ep.pn_EmployeeID
--    INNER JOIN 
--        dbo.paym_Designation dp ON ep.pn_DesignationId = dp.pn_DesignationId
--    INNER JOIN 
--        dbo.paym_Department dpt ON ep.pn_DepartmentId = dpt.pn_DepartmentId
--    INNER JOIN 
--        dbo.paym_Category ct ON ep.pn_CategoryId = ct.pn_CategoryId
--    INNER JOIN 
--        dbo.paym_Company co ON ep.pn_CompanyID = co.pn_CompanyID
--    WHERE 
--        tc.dates BETWEEN @StartDate AND @EndDate
--    GROUP BY 
--        tc.pn_companyid,  
--        tc.pn_branchid,
--        tc.pn_EmployeeID,
--        tc.emp_code,
--        tc.emp_name,
--        tc.shift_code,
--        emp.CTC,
--        emp.basic_salary,
--        emp.Grade,
--        emp.Overall_Experience,
--        dp.v_DesignationName,
--        dpt.v_DepartmentName,
--        ct.v_CategoryName,
--        ep.d_Date,
--        co.CompanyName,
--        co.Address_Line1,
--        co.Address_Line2,
--        co.City,
--        co.ZipCode;
--END
--GO
--/****** Object:  StoredProcedure [dbo].[GetAttendanceSummaryInsertqueryforallmonth]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE PROCEDURE [dbo].[GetAttendanceSummaryInsertqueryforallmonth]
--AS
--BEGIN
--    SET NOCOUNT ON;

--    -- Declare variables for year and month
--    DECLARE @Year INT, @Month INT;
--    DECLARE @ExecutionDay INT = DAY(GETDATE()); -- Get the day of the execution date
--    DECLARE @CursorExist INT;

--    -- Check if cursor already exists (this is an optional safety check)
--    SELECT @CursorExist = COUNT(*) FROM sys.objects WHERE type = 'P' AND name = 'AttendanceCursor';

--    -- Declare the cursor to fetch distinct Year and Month
--    DECLARE AttendanceCursor CURSOR FOR
--        SELECT DISTINCT YEAR(dates) AS Year, MONTH(dates) AS Month
--        FROM dbo.time_card;

--    OPEN AttendanceCursor;
--    FETCH NEXT FROM AttendanceCursor INTO @Year, @Month;

--    WHILE @@FETCH_STATUS = 0
--    BEGIN
--        -- Calculate the start and end dates for the month
--        DECLARE @StartDate DATE = DATEFROMPARTS(@Year, @Month, 1);
--        DECLARE @EndDate DATE = EOMONTH(@StartDate);

--        -- Construct d_date with correct month/year and the execution day
--        DECLARE @DDate DATE = DATEFROMPARTS(@Year, @Month, @ExecutionDay);

--        -- Insert new data into the paym_paybill table, avoiding duplicates
--        INSERT INTO [dbo].[paym_paybill]
--               ([pn_CompanyID],
--                [pn_BranchID],
--                [pn_EmployeeID],
--                [EmployeeCode],
--                [Employee_First_Name],
--                [DesignationName],
--                [DepartmentName],
--                [GradeName],
--                [CategoryName],
--                [JoiningDate],
--                [d_date],
--                [Earned_Basic],
--                [Act_Basic],
--                [Calc_Days],
--                [Paid_Days],
--                [Present_Days],
--                [Absent_Days],
--                [WeekOffDays],
--                [Holidays],
--                [TotLeave_Days],
--                [CompanyName],
--                [Address_line1],
--                [Address_Line2],
--                [City],
--                [Zipcode],
--                [EarningsName],
--                [FinalAmount])
--        SELECT 
--            tc.pn_companyid AS [pn_CompanyID],
--            tc.pn_branchid AS [pn_BranchID],
--            tc.pn_EmployeeID AS [pn_EmployeeID],
--            tc.emp_code AS [EmployeeCode],
--            tc.emp_name AS [Employee_First_Name],
--            dp.v_DesignationName AS [DesignationName],
--            dpt.v_DepartmentName AS [DepartmentName],
--            emp.Grade AS [GradeName],
--            ct.v_CategoryName AS [CategoryName],
--            ep.d_Date AS [JoiningDate],
--            @DDate AS [d_date], -- Use the constructed date with correct month/year and execution day
--            CASE 
--                WHEN COUNT(tc.dates) > 0 THEN 
--                    (emp.basic_salary / COUNT(tc.dates)) * 
--                    (
--                        SUM(CASE WHEN tc.status IN ('P', 'W', 'H', 'WFH', 'L') THEN 1 ELSE 0 END) 
--                        + SUM(CASE WHEN tc.status = 'HD' THEN 0.5 ELSE 0 END)
--                    )
--                ELSE 0 
--            END AS [Earned_Basic],
--            emp.basic_salary AS [Act_Basic],
--            COUNT(tc.dates) AS [Calc_Days],
--            SUM(CASE WHEN tc.status IN ('P', 'W', 'H', 'WFH', 'L') THEN 1 ELSE 0 END) 
--            + SUM(CASE WHEN tc.status = 'HD' THEN 0.5 ELSE 0 END) AS [Paid_Days],
--            SUM(CASE WHEN tc.status = 'P' THEN 1 ELSE 0 END) AS [Present_Days],
--            SUM(CASE WHEN tc.status = 'A' THEN 1 ELSE 0 END) AS [Absent_Days],
--            SUM(CASE WHEN tc.status = 'W' THEN 1 ELSE 0 END) AS [WeekOffDays],
--            SUM(CASE WHEN tc.status = 'H' THEN 1 ELSE 0 END) AS [Holidays],
--            SUM(CASE WHEN tc.status = 'L' THEN 1 ELSE 0 END) AS [TotLeave_Days],
--            co.CompanyName AS [CompanyName],
--            co.Address_Line1 AS [Address_line1],
--            co.Address_Line2 AS [Address_Line2],
--            co.City AS [City],
--            co.ZipCode AS [Zipcode],
--            -- Add allowances (v_earningsname) and final amount
--            al.v_earningsname AS [EarningsName],
--            al.finalamount AS [FinalAmount]
--        FROM 
--            dbo.time_card tc
--        INNER JOIN 
--            dbo.paym_Employee emp ON tc.pn_EmployeeID = emp.pn_EmployeeID
--        INNER JOIN 
--            dbo.paym_employee_profile1 ep ON emp.pn_EmployeeID = ep.pn_EmployeeID
--        INNER JOIN 
--            dbo.paym_Designation dp ON ep.pn_DesignationId = dp.pn_DesignationId
--        INNER JOIN 
--            dbo.paym_Department dpt ON ep.pn_DepartmentId = dpt.pn_DepartmentId
--        INNER JOIN 
--            dbo.paym_Category ct ON ep.pn_CategoryId = ct.pn_CategoryId
--        INNER JOIN 
--            dbo.paym_Company co ON ep.pn_CompanyID = co.pn_CompanyID
--        -- Join with the allowance table to get earnings and final amount
--        LEFT JOIN 
--            dbo.paym_Allowances al ON tc.pn_EmployeeID = al.pn_EmployeeID
--        WHERE 
--            tc.dates BETWEEN @StartDate AND @EndDate
--        GROUP BY 
--            tc.pn_companyid,  
--            tc.pn_branchid,
--            tc.pn_EmployeeID,
--            tc.emp_code,
--            tc.emp_name,
--            tc.shift_code,
--            emp.CTC,
--            emp.basic_salary,
--            emp.Grade,
--            emp.Overall_Experience,
--            dp.v_DesignationName,
--            dpt.v_DepartmentName,
--            ct.v_CategoryName,
--            ep.d_Date,
--            co.CompanyName,
--            co.Address_Line1,
--            co.Address_Line2,
--            co.City,
--            co.ZipCode,
--            al.v_earningsname,
--            al.finalamount
--        HAVING 
--            NOT EXISTS (
--                SELECT 1
--                FROM dbo.paym_paybill pb
--                WHERE pb.pn_CompanyID = tc.pn_companyid
--                  AND pb.pn_BranchID = tc.pn_branchid
--                  AND pb.pn_EmployeeID = tc.pn_EmployeeID
--                  AND pb.d_date = @DDate -- Check for duplicate record based on unique combination
--            );

--        -- Fetch the next month and year
--        FETCH NEXT FROM AttendanceCursor INTO @Year, @Month;
--    END;

--    -- Close and deallocate the cursor
--    CLOSE AttendanceCursor;
--    DEALLOCATE AttendanceCursor;
--END;
--GO
--/****** Object:  StoredProcedure [dbo].[GetAttendanceSummaryInsertqueryforallmonthsupdate]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE PROCEDURE [dbo].[GetAttendanceSummaryInsertqueryforallmonthsupdate]
--AS
--BEGIN
--    SET NOCOUNT ON;

--    -- Declare variables for year and month
--    DECLARE @Year INT, @Month INT;
--    DECLARE @ExecutionDay INT = DAY(GETDATE()); -- Get the day of the execution date
--    DECLARE AttendanceCursor CURSOR FOR
--        SELECT DISTINCT YEAR(dates) AS Year, MONTH(dates) AS Month
--        FROM dbo.time_card;

--    OPEN AttendanceCursor;
--    FETCH NEXT FROM AttendanceCursor INTO @Year, @Month;

--    WHILE @@FETCH_STATUS = 0
--    BEGIN
--        -- Calculate the start and end dates for the month
--        DECLARE @StartDate DATE = DATEFROMPARTS(@Year, @Month, 1);
--        DECLARE @EndDate DATE = EOMONTH(@StartDate);

--        -- Construct d_date with correct month/year and the execution day
--        DECLARE @DDate DATE = DATEFROMPARTS(@Year, @Month, @ExecutionDay);

--        -- Insert new data into the paym_paybill table, avoiding duplicates
--        INSERT INTO [dbo].[paym_paybill]
--           ([pn_CompanyID],
--            [pn_BranchID],
--            [pn_EmployeeID],
--            [EmployeeCode],
--            [Employee_First_Name],
--            [DesignationName],
--            [DepartmentName],
--            [GradeName],
--            [CategoryName],
--            [JoiningDate],
--            [d_date],
--            [Earn_Amount],
--            [Ded_Amount],
--            [NetPay],
--            [Earned_Basic],
--            [Gross_salary],
--            [Net_salary],
--            [EPF],
--            [FPF],
--            [period_code],
--            [max_amount],
--            [Act_Basic],
--            [Calc_Days],
--            [Paid_Days],
--            [Present_Days],
--            [Absent_Days],
--            [WeekOffDays],
--            [Holidays],
--            [TotLeave_Days],
--            [ot_hrs],
--            [ot_value],
--            [ot_amt],
--            [Allowance1],
--            [value1],
--            [Allowance2],
--            [value2],
--            [Allowance3],
--            [value3],
--            [Allowance4],
--            [value4],
--            [Allowance5],
--            [value5],
--            [Allowance6],
--            [value6],
--            [Allowance7],
--            [value7],
--            [Allowance8],
--            [value8],
--            [Allowance9],
--            [value9],
--            [Allowance10],
--            [value10],
--            [Deduction1],
--            [valueA1],
--            [Deduction2],
--            [valueA2],
--            [Deduction3],
--            [valueA3],
--            [Deduction4],
--            [valueA4],
--            [Deduction5],
--            [valueA5],
--            [Deduction6],
--            [valueA6],
--            [Deduction7],
--            [valueA7],
--            [Deduction8],
--            [valueA8],
--            [Deduction9],
--            [valueA9],
--            [Deduction10],
--            [valueA10],
--            [CompanyName],
--            [Address_line1],
--            [Address_Line2],
--            [City],
--            [Zipcode],
--            [Att_bonus])
--        SELECT 
--            ea.pn_CompanyID,
--            ea.pn_BranchID,
--            ea.pn_EmployeeID,
--            ea.EmployeeCode,
--            ea.Employee_First_Name,
--            ea.DesignationName,
--            ea.DepartmentName,
--            ea.GradeName,
--            ea.CategoryName,
--            ea.JoiningDate,
--            @DDate AS [d_date], -- Use the constructed date with correct month/year and execution day
--            ea.OriginalAmount AS [Earn_Amount],
--            0 AS [Ded_Amount], -- Assuming Deduction logic is handled separately
--            (ea.OriginalAmount - 0) AS [NetPay], -- Assuming no deductions here, adjust as needed
--            ea.OriginalAmount AS [Earned_Basic],
--            ea.OriginalAmount AS [Gross_salary], -- Assuming Gross Salary equals Earned Amount
--            ea.OriginalAmount AS [Net_salary], -- Assuming Net Salary equals Earned Amount
--            0 AS [EPF], -- Assuming EPF logic is handled separately
--            0 AS [FPF], -- Assuming FPF logic is handled separately
--            'PeriodCode' AS [period_code], -- Placeholder, replace with actual logic
--            ea.OriginalAmount AS [max_amount], -- Adjust logic based on the actual requirement
--            ea.OriginalAmount AS [Act_Basic],
--            31 AS [Calc_Days], -- Assuming a fixed 31 days for calculation, adjust as needed
--            ad.Paid_Days, -- This value will be passed from the absent days calculation
--            ad.Present_Days,
--            ad.Absent_Days,
--            ad.WeekOffDays,
--            ad.Holidays,
--            ad.TotLeave_Days,
--            0 AS [ot_hrs], -- Assuming overtime logic is handled separately
--            0 AS [ot_value], -- Assuming overtime value logic is handled separately
--            0 AS [ot_amt], -- Assuming overtime amount logic is handled separately
--            NULL AS [Allowance1],
--            0 AS [value1],
--            NULL AS [Allowance2],
--            0 AS [value2],
--            NULL AS [Allowance3],
--            0 AS [value3],
--            NULL AS [Allowance4],
--            0 AS [value4],
--            NULL AS [Allowance5],
--            0 AS [value5],
--            NULL AS [Allowance6],
--            0 AS [value6],
--            NULL AS [Allowance7],
--            0 AS [value7],
--            NULL AS [Allowance8],
--            0 AS [value8],
--            NULL AS [Allowance9],
--            0 AS [value9],
--            NULL AS [Allowance10],
--            0 AS [value10],
--            NULL AS [Deduction1],
--            0 AS [valueA1],
--            NULL AS [Deduction2],
--            0 AS [valueA2],
--            NULL AS [Deduction3],
--            0 AS [valueA3],
--            NULL AS [Deduction4],
--            0 AS [valueA4],
--            NULL AS [Deduction5],
--            0 AS [valueA5],
--            NULL AS [Deduction6],
--            0 AS [valueA6],
--            NULL AS [Deduction7],
--            0 AS [valueA7],
--            NULL AS [Deduction8],
--            0 AS [valueA8],
--            NULL AS [Deduction9],
--            0 AS [valueA9],
--            NULL AS [Deduction10],
--            0 AS [valueA10],
--            ea.CompanyName,
--            ea.Address_line1,
--            ea.Address_Line2,
--            ea.City,
--            ea.Zipcode,
--            0 AS [Att_bonus] -- Assuming no attendance bonus logic
--        FROM 
--            EmployeeAllowances ea
--        LEFT JOIN 
--            AbsentDays ad ON ea.EmployeeCode = ad.emp_code
--        WHERE 
--            ea.Prorata_basis IN ('Y', 'N') -- Ensure only valid prorata values
--        ORDER BY 
--            ea.d_order; -- Order by the d_order to align allowances correctly

--        -- Fetch the next month and year
--        FETCH NEXT FROM AttendanceCursor INTO @Year, @Month;
--    END;

--    -- Close and deallocate the cursor
--    CLOSE AttendanceCursor;
--    DEALLOCATE AttendanceCursor;
--END;

--GO
--/****** Object:  StoredProcedure [dbo].[GetAttendanceSummaryWithAllowances]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO

--CREATE PROCEDURE [dbo].[GetAttendanceSummaryWithAllowances]
--AS
--BEGIN
--    SET NOCOUNT ON;

--  -- Declare variables for year and month
--DECLARE @Year INT, @Month INT;
--DECLARE @ExecutionDay INT = DAY(GETDATE()); -- Get the day of the execution date

---- Declare cursor for distinct Year-Month combinations with attendance
--DECLARE AttendanceCursor CURSOR FOR
--    SELECT DISTINCT YEAR(dates) AS Year, MONTH(dates) AS Month
--    FROM dbo.time_card
--    GROUP BY YEAR(dates), MONTH(dates)
--    HAVING COUNT(*) > 0;  -- Ensure there's attendance data

--OPEN AttendanceCursor;
--FETCH NEXT FROM AttendanceCursor INTO @Year, @Month;

--WHILE @@FETCH_STATUS = 0
--BEGIN
--    -- Validate the month and year
--    IF @Month < 1 OR @Month > 12 OR @Year < 1900 OR @Year > 2100
--    BEGIN
--        FETCH NEXT FROM AttendanceCursor INTO @Year, @Month;
--        CONTINUE;
--    END

--    -- Calculate the start and end dates for the month
--    DECLARE @StartDate DATE = DATEFROMPARTS(@Year, @Month, 1);
--    DECLARE @EndDate DATE = EOMONTH(@StartDate);
--    DECLARE @TotalDaysInMonth INT = DAY(@EndDate); -- Total days in the month

--    -- Count distinct days with attendance data for the month
--    DECLARE @DistinctDaysWithAttendance INT;
--    SELECT @DistinctDaysWithAttendance = COUNT(DISTINCT CAST(dates AS DATE))
--    FROM dbo.time_card
--    WHERE dates BETWEEN @StartDate AND @EndDate;

--    -- Check if the distinct days with attendance data is less than total days in the month
--    IF @DistinctDaysWithAttendance < @TotalDaysInMonth
--    BEGIN
--        -- If not all days have attendance data, skip processing
--        FETCH NEXT FROM AttendanceCursor INTO @Year, @Month;
--        CONTINUE;
--    END

--    -- Ensure the execution day is valid for the month
--    IF @ExecutionDay > @TotalDaysInMonth
--    BEGIN
--        SET @ExecutionDay = @TotalDaysInMonth; -- Adjust to the last day of the month
--    END

--    -- Construct d_date with correct month/year and the execution day
--    DECLARE @DDate DATE = DATEFROMPARTS(@Year, @Month, @ExecutionDay);


--   BEGIN TRY
--        -- Drop the temporary table if it exists
--        IF OBJECT_ID('tempdb..#AttendanceBonus2') IS NOT NULL 
--            DROP TABLE #AttendanceBonus2;

--        -- Create a temporary table to store Employee Allowances
--        CREATE TABLE #AttendanceBonus2(
--            pn_companyid INT,
--            pn_branchid INT,
--            pn_employeeid INT,
--            EmployeeCode NVARCHAR(50),
--            Employee_Full_Name NVARCHAR(100),
--            pn_categoryid INT,
--            v_categoryname NVARCHAR(100),
--            Year INT,
--            Month INT,
--            status_A_count INT,
--            attendance_bonus_type NVARCHAR(50),
--            attendance_bonus_value DECIMAL(18, 2)
--        );

--        -- Temporary table to store Employee Allowances
--        WITH EmployeeAllowances AS (
--            SELECT DISTINCT
--                e.pn_CompanyID,
--                e.pn_BranchID,
--                e.Employee_Full_Name,
--                e.EmployeeCode,
--                e.pn_EmployeeID,
--                av.Grade_Name,
--                av.Level_Name,
--                av.v_EarningsName,
--                av.Allowancetype,
--                av.Cal_Based_on,
--                CASE 
--                    WHEN av.Allowancetype = 'Fixed' THEN av.value
--                    WHEN av.Cal_Based_on = 'CTC' THEN (e.CTC * av.value / 100)
--                    WHEN av.Cal_Based_on = 'BasicPay' THEN (e.Basic_Salary * av.value / 100)
--                    ELSE 0
--                END AS OriginalAmount,
--                aset.Prorata_basis, -- Prorata flag specific to each earning
--                av.d_order
--            FROM 
--                [dbo].[AllowanceValues] av
--            JOIN 
--                [dbo].[paym_Employee] e
--                ON av.Grade_Name = e.Grade
--                OR av.Level_Name = e.Grade
--            LEFT JOIN (
--                SELECT 
--                    pn_CompanyID, pn_BranchID, v_EarningsName, 
--                    MAX(Prorata_basis) AS Prorata_basis
--                FROM 
--                    [dbo].[Allowancesettings]
--                GROUP BY 
--                    pn_CompanyID, pn_BranchID, v_EarningsName
--            ) aset
--            ON av.pn_companyid = aset.pn_CompanyID
--            AND av.pn_branchid = aset.pn_BranchID
--            AND av.v_EarningsName = aset.v_EarningsName
--            WHERE 
--                av.pn_branchid = e.pn_BranchID
--                AND (av.Allowancetype IN ('Fixed', 'Percentage'))
--                AND NOT (av.c_Regular = 'N' AND av.payslip = 'N')
--        ),
--        AttendanceData AS (
--            SELECT 
--                tc.pn_EmployeeID,
--                COUNT(DISTINCT MONTH(tc.dates)) AS MonthsWithAttendance,
--                SUM(CASE WHEN tc.status = 'A' THEN 1 ELSE 0 END 
--                ) + 
--                SUM(CASE WHEN tc.status = 'HD' THEN 0.5 ELSE 0 END) AS AbsentDays,
--                COUNT(tc.dates) AS TotalDays,
--                COUNT(tc.dates) - 
--                (SUM(CASE WHEN tc .status = 'A' THEN 1 ELSE 0 END) + 
--                 SUM(CASE WHEN tc.status = 'HD' THEN 0.5 ELSE 0 END)) AS PaidDays, 
--                SUM(CASE WHEN tc.status = 'P' THEN 1 ELSE 0 END) AS PresentDays,
--                SUM(CASE WHEN tc.status = 'W' THEN 1 ELSE 0 END) AS Weekoffdays,
--                SUM(CASE WHEN tc.status = 'L' THEN 1 ELSE 0 END) AS Leavedays,
--                SUM(CASE WHEN tc.status = 'H' THEN 1 ELSE 0 END) AS Holidays,
--                SUM(CASE WHEN tc.status = 'WFH' THEN 1 ELSE 0 END) AS WorkFromHome,
--                SUM(CASE WHEN tc.status = 'HD' THEN 1 ELSE 0 END) AS HalfDay
--            FROM 
--                dbo.time_card tc
--            WHERE 
--                tc.dates BETWEEN @StartDate AND @EndDate
--            GROUP BY 
--                tc.pn_EmployeeID
--            HAVING COUNT(DISTINCT MONTH(tc.dates)) > 0  -- Only consider employees with attendance in this month
--        )
--        -- Insert or update data into paym_paybill table for employees with attendance
--        MERGE INTO [dbo].[paym_paybill] AS target
--        USING (
--            SELECT 
--                tc.pn_companyid AS [pn_CompanyID],
--                tc.pn_branchid AS [pn_BranchID],
--                tc.pn_EmployeeID AS [pn_EmployeeID],
--                tc.emp_code AS [EmployeeCode],
--                tc.emp_name AS [Employee_First_Name],
--                dp.v_DesignationName AS [DesignationName],
--                dpt.v_DepartmentName AS [DepartmentName],
--                pg.v_GradeName AS [GradeName],
--                ct.v_CategoryName AS [CategoryName],
--                ep.d_Date AS [JoiningDate],
--                @DDate AS [d_date],
--                COALESCE(MAX(CASE WHEN ea.d_order = 1 THEN 
--                    CASE WHEN ea.Prorata_basis = 'Y' THEN 
--                        (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
--                        ELSE ea.OriginalAmount END
--                    ELSE 0 END), 0) +
--                COALESCE(MAX(CASE WHEN ea.d_order = 2 THEN 
--                    CASE WHEN ea.Prorata_basis = 'Y' THEN 
--                        (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
--                        ELSE ea.OriginalAmount END
--                    ELSE 0 END), 0) +
--                COALESCE(MAX(CASE WHEN ea.d_order = 3 THEN 
--                    CASE WHEN ea.Prorata_basis = 'Y' THEN 
--                        (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
--                        ELSE ea.OriginalAmount END
--                    ELSE 0 END), 0) +
--                COALESCE(MAX(CASE WHEN ea.d_order = 4 THEN 
--                    CASE WHEN ea.Prorata_basis = 'Y' THEN 
--                        (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
--                        ELSE ea.OriginalAmount END
--                    ELSE 0 END), 0) +
--                COALESCE(MAX(CASE WHEN ea.d_order = 5 THEN 
--                    CASE WHEN ea.Prorata_basis = 'Y' THEN 
--                        (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
--                        ELSE ea.OriginalAmount END
--                    ELSE 0 END), 0) +
--                COALESCE(MAX(CASE WHEN ea.d_order = 6 THEN 
--                    CASE WHEN ea.Prorata_basis = 'Y' THEN 
--                        (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
--                        ELSE ea.OriginalAmount END
--                    ELSE 0 END), 0) +
--                COALESCE(MAX(CASE WHEN ea.d_order = 7 THEN 
--                    CASE WHEN ea.Prorata_basis = 'Y' THEN 
--                        (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
--                        ELSE ea.OriginalAmount END
--                    ELSE 0 END), 0) +
--                COALESCE(MAX(CASE WHEN ea.d_order = 8 THEN 
--                    CASE WHEN ea.Prorata_basis = 'Y' THEN 
--                        (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
--                        ELSE ea.OriginalAmount END
--                    ELSE 0 END), 0) +
--                COALESCE(MAX(CASE WHEN ea.d_order = 9 THEN 
--                    CASE WHEN ea.Prorata_basis = 'Y' THEN 
--                        (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
--                        ELSE ea.OriginalAmount END
--                    ELSE 0 END), 0) +
--                COALESCE(MAX(CASE WHEN ea.d_order = 10 THEN 
--                    CASE WHEN ea.Prorata_basis = 'Y' THEN 
--                        (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
--                        ELSE ea.OriginalAmount END
--                    ELSE 0 END), 0) AS [Earn_Amount],

--                NULL AS [Ded_Amount], -- Placeholder for missing value
--                NULL AS [NetPay], -- Placeholder for missing value
--                CASE 
--                    WHEN ad.TotalDays > 0 THEN 
--                        (emp.basic_salary / ad.TotalDays) * ad.PaidDays
--                    ELSE 0 
--                END AS [Earned_Basic],
--                (CASE 
--                    WHEN ad.TotalDays > 0 THEN 
--                        (emp.basic_salary / ad.TotalDays) * ad.PaidDays
--                    ELSE 0 
--                END + 
--                COALESCE(MAX(CASE WHEN ea.d_order = 1 THEN 
--                    CASE WHEN ea.Prorata_basis = 'Y' THEN 
--                        (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
--                        ELSE ea.OriginalAmount END
--                    ELSE 0 END), 0) +
--                COALESCE(MAX(CASE WHEN ea.d_order = 2 THEN 
--                    CASE WHEN ea.Prorata_basis = 'Y' THEN 
--                        (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
--                        ELSE ea.OriginalAmount END
--                    ELSE 0 END), 0) +
--                COALESCE(MAX(CASE WHEN ea.d_order = 3 THEN 
--                    CASE WHEN ea.Prorata_basis = 'Y' THEN 
--                        (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
--                        ELSE ea.OriginalAmount END
--                    ELSE 0 END), 0) +
--                COALESCE(MAX(CASE WHEN ea.d_order = 4 THEN 
--                    CASE WHEN ea.Prorata_basis = 'Y' THEN 
--                        (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
--                        ELSE ea.OriginalAmount END
--                    ELSE 0 END), 0) +
--                COALESCE(MAX(CASE WHEN ea.d_order = 5 THEN 
--                    CASE WHEN ea.Prorata_basis = 'Y' THEN 
--                        (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
--                        ELSE ea.OriginalAmount END
--                    ELSE 0 END), 0) +
--                COALESCE(MAX(CASE WHEN ea.d_order = 6 THEN 
--                    CASE WHEN ea.Prorata_basis = 'Y' THEN 
--                        (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
--                        ELSE ea.OriginalAmount END
--                    ELSE 0 END), 0) +
--                COALESCE(MAX(CASE WHEN ea.d_order = 7 THEN 
--                    CASE WHEN ea.Prorata_basis = 'Y' THEN 
--                        (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
--                        ELSE ea.OriginalAmount END
--                    ELSE 0 END), 0) +
--                COALESCE(MAX(CASE WHEN ea.d_order = 8 THEN 
--                    CASE WHEN ea.Prorata_basis = 'Y' THEN 
--                        (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
--                        ELSE ea.OriginalAmount END
--                    ELSE 0 END), 0) +
--                COALESCE(MAX(CASE WHEN ea.d_order = 9 THEN 
--                    CASE WHEN ea.Prorata_basis = 'Y' THEN 
--                        (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
--                        ELSE ea.OriginalAmount END
--                    ELSE 0 END), 0) +
--                COALESCE(MAX(CASE WHEN ea.d_order = 10 THEN 
--                    CASE WHEN ea.Prorata_basis = 'Y' THEN 
--                        (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
--                        ELSE ea.OriginalAmount END
--                    ELSE 0 END), 0)
--                ) AS [Gross_salary],
--                NULL AS [Net_salary],
--                NULL AS [EPF],
--                NULL AS [FPF],
--                Format (@DDate, 'MMMM yyyy') AS [Period_code],
--                emp.CTC AS [max_amount],
--                emp.basic_salary AS [Act_Basic],
--                ad.TotalDays AS [Calc_Days],
--                ad.PaidDays AS [Paid_Days],
--                ad.PresentDays AS [Present_Days],
--                ad.AbsentDays AS [Absent_Days],
--                ad.Weekoffdays AS [WeekOffDays],
--				ad.Holidays AS [Holidays],
--                ad.Leavedays AS [TotLeave_Days],
--                NULL AS [ot_hrs],
--                NULL AS [ot_value],
--                NULL AS [ot_amt],
--                -- Allowance calculation (taking Prorata_basis into account)
--                MAX(CASE WHEN ea.d_order = 1 THEN ea.v_EarningsName ELSE NULL END) AS [Allowance1],
--                MAX(CASE WHEN ea.d_order = 1 THEN 
--                    CASE 
--                        WHEN ea.Prorata_basis = 'Y' THEN 
--                            (
--                                ea.OriginalAmount - (
--                                    (ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays
--                                )
--                            )
--                        ELSE ea.OriginalAmount
--                    END
--                    ELSE 0 END) AS [value1],
--                MAX(CASE WHEN ea.d_order = 2 THEN ea.v_EarningsName ELSE NULL END) AS [Allowance2],
--                MAX(CASE WHEN ea.d_order = 2 THEN 
--                    CASE 
--                        WHEN ea.Prorata_basis = 'Y' THEN 
--                            (
--                                ea.OriginalAmount - (
--                                    (ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays
--                                )
--                            )
--                        ELSE ea.OriginalAmount
--                    END
--                    ELSE 0 END) AS [value2],
--                MAX(CASE WHEN ea.d_order = 3 THEN ea.v_EarningsName ELSE NULL END) AS [Allowance3],
--                MAX(CASE WHEN ea.d_order = 3 THEN 
--                    CASE 
--                        WHEN ea.Prorata_basis = 'Y' THEN 
--                            (
--                                ea.OriginalAmount - (
--                                    (ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays
--                                )
--                            )
--                        ELSE ea.OriginalAmount
--                    END
--                    ELSE 0 END) AS [value3],
--                MAX(CASE WHEN ea.d_order = 4 THEN ea.v_EarningsName ELSE NULL END) AS [Allowance4],
--                MAX(CASE WHEN ea.d_order = 4 THEN 
--                    CASE 
--                        WHEN ea.Prorata_basis = 'Y' THEN 
--                            (
--                                ea.OriginalAmount - (
--                                    (ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays
--                                )
--                            )
--                        ELSE ea.OriginalAmount
--                    END
--                    ELSE 0 END) AS [value4],
--                MAX(CASE WHEN ea.d_order = 5 THEN ea.v_EarningsName ELSE NULL END) AS [Allowance5],
--                MAX(CASE WHEN ea.d_order = 5 THEN 
--                    CASE 
--                        WHEN ea.Prorata_basis = 'Y' THEN 
--                            (
--                                ea.OriginalAmount - (
--                                    (ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays
--                                )
--                            )
--                        ELSE ea.OriginalAmount
--                    END
--                    ELSE 0 END) AS [value5],
--                MAX(CASE WHEN ea.d_order = 6 THEN ea.v_EarningsName ELSE NULL END) AS [Allowance6],
--                MAX(CASE WHEN ea.d_order = 6 THEN 
--                    CASE 
--                        WHEN ea.Prorata_basis = 'Y' THEN 
--                            (
--                                ea.OriginalAmount - (
--                                    (ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays
--                                )
--                            )
--                        ELSE ea.OriginalAmount
--                    END
--                    ELSE 0 END) AS [value6],
--                MAX(CASE WHEN ea.d_order = 7 THEN ea.v_EarningsName ELSE NULL END) AS [Allowance7],
--                MAX(CASE WHEN ea.d_order = 7 THEN 
--                    CASE 
--                        WHEN ea.Prorata_basis = 'Y' THEN 
--                            (
--                                ea.OriginalAmount - (
--                                    (ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays
--                                )
--                            )
--                        ELSE ea.OriginalAmount
--                    END
--                    ELSE 0 END) AS [value7],
--                MAX(CASE WHEN ea.d_order = 8 THEN ea.v_EarningsName ELSE NULL END) AS [Allowance8],
--                MAX(CASE WHEN ea.d_order = 8 THEN 
--                    CASE WHEN ea.Prorata_basis = 'Y' THEN 
--                            (
--                                ea.OriginalAmount - (
--                                    (ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays
--                                )
--                            )
--                        ELSE ea.OriginalAmount
--                    END
--                    ELSE 0 END) AS [value8],
--                MAX(CASE WHEN ea.d_order = 9 THEN ea.v_EarningsName ELSE NULL END) AS [Allowance9],
--                MAX(CASE WHEN ea.d_order = 9 THEN 
--                    CASE 
--                        WHEN ea.Prorata_basis = 'Y' THEN 
--                            (
--                                ea.OriginalAmount - (
--                                    (ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays
--                                )
--                            )
--                        ELSE ea.OriginalAmount
--                    END
--                    ELSE 0 END) AS [value9],
--                MAX(CASE WHEN ea.d_order = 10 THEN ea.v_EarningsName ELSE NULL END) AS [Allowance10],
--				MAX(CASE WHEN ea.d_order = 10 THEN CASE WHEN ea.Prorata_basis = 'Y' THEN ( ea.OriginalAmount - ( (ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays ) ) ELSE ea.OriginalAmount END ELSE 0 END) AS [value10], 
--				NULL AS [Deduction1], -- Placeholder for missing value
--				0 AS [valueA1], -- Placeholder for missing value 
--				NULL AS [Deduction2], -- Placeholder for missing value 
--				0 AS [valueA2], -- Placeholder for missing value 
--				NULL AS [Deduction3], -- Placeholder for missing value 
--				0 AS [valueA3], -- Placeholder for missing value 
--				NULL AS [Deduction4], -- Placeholder for missing value 
--				0 AS [valueA4], -- Placeholder for missing value 
--				NULL AS [Deduction5], -- Placeholder for missing value 
--				0 AS [valueA5], -- Placeholder for missing value 
--				NULL AS [Deduction6], -- Placeholder for missing value 
--				0 AS [valueA6], -- Placeholder for missing value 
--				NULL AS [Deduction7], -- Placeholder for missing value 
--				0 AS [valueA7], -- Placeholder for missing value 
--				NULL AS [Deduction8], -- Placeholder for missing value 
--				0 AS [valueA8], -- Placeholder for missing value 
--				NULL AS [Deduction9], -- Placeholder for missing value 
--				0 AS [valueA9], -- Placeholder for missing value 
--				NULL AS [Deduction10], -- Placeholder for missing value 
--				0 AS [valueA10], -- Placeholder for missing value 
--				co.CompanyName AS [CompanyName], co.Address_Line1 AS [Address_line1], co.Address_Line2 AS [Address_Line2], co.City AS [City], co.ZipCode AS [Zipcode], NULL AS [Att_bonus], ad.WorkFromHome AS [WorkFromHome], ad.HalfDay AS [Halfday], 'M' AS Flag FROM dbo.time_card tc INNER JOIN dbo.paym_Employee emp ON tc.pn_EmployeeID = emp.pn_EmployeeID INNER JOIN dbo.paym_employee_profile1 ep ON emp.pn_EmployeeID = ep.pn_EmployeeID INNER JOIN dbo.paym_Designation dp ON ep.pn_DesignationId = dp.pn_DesignationId INNER JOIN dbo.paym_Department dpt ON ep.pn_DepartmentId = dpt.pn_DepartmentId INNER JOIN dbo.paym_Category ct ON ep.pn_CategoryId = ct.pn_CategoryId INNER JOIN dbo.paym_Company co ON ep.pn_CompanyID = co.pn_CompanyID INNER JOIN EmployeeAllowances ea ON tc.pn_EmployeeID = ea.pn_EmployeeID INNER JOIN 
--            paym_Grade pg ON ep.pn_GradeId = pg.pn_GradeID
--				INNER JOIN AttendanceData ad ON tc.pn_EmployeeID = ad.pn_EmployeeID WHERE tc.dates BETWEEN @StartDate AND @EndDate GROUP BY tc.pn_companyid,
--tc.pn_branchid, tc.pn_EmployeeID, tc.emp_code, tc.emp_name, emp.basic_salary, dp.v_DesignationName, dpt.v_DepartmentName, ct.v_CategoryName, pg.v_GradeName, ep.d_Date, co.CompanyName, co.Address_Line1, co.Address_Line2, co.City, co.Zipcode, ad.TotalDays,
--ad.PaidDays,ad.MonthsWithAttendance, ad.AbsentDays, ad.PresentDays, ad.Weekoffdays, ad.Leavedays, ad.Holidays, ad.WorkFromHome, ad.HalfDay, emp.CTC ) AS source ON target.pn_CompanyID = source.pn_CompanyID AND target.pn_BranchID = source.pn_BranchID AND target.pn_EmployeeID = source.pn_EmployeeID AND target.d_date = source.d_date WHEN MATCHED AND target.Flag = 'M' THEN UPDATE SET target.Earn_Amount = source.Earn_Amount, target.Ded_Amount = source.Ded_Amount, target.NetPay = source.NetPay, target.Earned_Basic = source.Earned_Basic, target.Gross_salary = source.Gross_salary, target.Net_salary = source.Net_salary, target.EPF = source.EPF ,target.FPF = source.FPF, target.Period_code = source.Period_code, target.max_amount = source.max_amount, target.Act_Basic = source.Act_Basic, target.Calc_Days = source.Calc_Days, target.Paid_Days = source.Paid_Days, target.Present_Days = source.Present_Days, target.Absent_Days = source.Absent_Days, target.WeekOffDays = source.WeekOffDays, target.Holidays = source.Holidays, 
--target.TotLeave_Days = source.TotLeave_Days, target.ot_hrs = source.ot_hrs, target.ot_value = source.ot_value, target.ot_amt = source.ot_amt, target.Allowance1 = source.Allowance1, target.value1 = source.value1, target.Allowance2 = source.Allowance2, target.value2 = source.value2, target.Allowance3 = source.Allowance3, target.value3 = source.value3, target.Allowance4 = source.Allowance4, target.value4 = source.value4, target.Allowance5 = source.Allowance5, target.value5 = source.value5, target.Allowance6 = source.Allowance6, target.value6 = source.value6, target.Allowance7 = source.Allowance7, target.value7 = source.value7, target.Allowance8 = source.Allowance8, target.value8 = source.value8, target.Allowance9 = source.Allowance9, target.value9 = source.value9, target.Allowance10 = source.Allowance10, target.value10 = source.value10, target.Deduction1 = source.Deduction1, target.valueA1 = source.valueA1, target.Deduction2 = source.Deduction2, target.valueA2 = source.valueA2, target.Deduction3 = source.Deduction3, target.valueA3 = source.valueA3, target.Deduction4 = source.Deduction4, target.valueA4 = source.valueA4, target.Deduction5 = source.Deduction5, target.valueA5 = source.valueA5, 
--target.Deduction6 = source.Deduction6, target.valueA6 = source.valueA6, target.Deduction7 = source.Deduction7, target.valueA7 = source.valueA7, target.Deduction8 = source.Deduction8, target.valueA8 = source.valueA8, target.Deduction9 = source.Deduction9, target.valueA9 = source.valueA9, target.Deduction10 = source.Deduction10, target.valueA10 = source.valueA10, target.CompanyName = source.CompanyName, target.Address_line1 = source.Address_line1, target.Address_Line2 = source.Address_Line2, target.City = source.City, target.Zipcode = source.Zipcode, target.Att_bonus = source.Att_bonus, target.WorkFromHome = source.WorkFromHome, target.Halfday = source.Halfday, target.Flag = source.Flag WHEN NOT MATCHED THEN INSERT ([pn_CompanyID], [pn_BranchID], [pn_EmployeeID], [EmployeeCode], [Employee_First_Name], [DesignationName], [DepartmentName], [GradeName], [CategoryName], [JoiningDate], [d_date], [Earn_Amount], [Ded_Amount], [NetPay], [Earned_Basic], [Gross_salary], [Net_salary], [EPF], [FPF], [Period_code], [max_amount], [Act_Basic], [Calc_Days],
--[Paid_Days], [Present_Days], [Absent_Days], [WeekOffDays], [Holidays], [TotLeave_Days], [ot_hrs], [ot_value], [ot_amt], [Allowance1], [value1], [Allowance2], [value2], [Allowance3], [value3], [Allowance4], [value4], [Allowance5], [value5], [Allowance6], [value6], [Allowance7], [value7], [Allowance8], [value8], [Allowance9], [value9], [Allowance10], [value10], [Deduction1], [valueA1], [Deduction2], [valueA2], [Deduction3], [valueA3], [Deduction4], [valueA4], [Deduction5], [valueA5], [Deduction6], [valueA6], [Deduction7], [valueA7], [Deduction8], [valueA8], [Deduction9], [valueA9], [Deduction10], [valueA10], [CompanyName], [Address_line1], [Address_Line2], [City], [Zipcode], [Att_bonus], [WorkFromHome], [Halfday], [Flag]) 
--VALUES (source.pn_CompanyID, source.pn_BranchID, source.pn_EmployeeID, source.EmployeeCode, source.Employee_First_Name, source.DesignationName, source.DepartmentName, source.GradeName, source.CategoryName, source.JoiningDate, source.d_date, source.Earn_Amount, source.Ded_Amount, source.NetPay, source.Earned_Basic, source.Gross_salary, source.Net_salary, source.EPF, source.FPF, source.Period_code, source.max_amount, source.Act_Basic, source.Calc_Days, source.Paid_Days, source.Present_Days, source.Absent_Days, source.WeekOffDays, source.Holidays, source.TotLeave_Days, source.ot_hrs, source.ot_value, source.ot_amt, source.Allowance1, source.value1, source.Allowance2, source.value2, source.Allowance3, source.value3, source.Allowance4, source.value4, source.Allowance5, source.value5, source.Allowance6, source.value6, source.Allowance7, source.value7, source.Allowance8, source.value8, source.Allowance9, source.value9, source.Allowance10, source.value10, source.Deduction1, source.valueA1, source.Deduction2, source.valueA2, source.Deduction3, source.valueA3, source.Deduction4, source.valueA4, source.Deduction5, source.valueA5, source.Deduction6, source.valueA6, source.Deduction7, source.valueA7, source.Deduction8, source.valueA8, source.Deduction9, source.valueA9, source.Deduction10, source.valueA10, source.CompanyName, source.Address_line1, source.Address_Line2, source.City, source.Zipcode, source.Att_bonus, source.WorkFromHome, source.Halfday, source.Flag);

--        -- Execute the attendance bonus stored procedure and insert results into the temporary table
--        INSERT INTO #AttendanceBonus2
--        EXEC GetEmployeeAttendanceBonus;

--        -- Update the paym_paybill table to fill the Att_bonus column
--        UPDATE pb
--        SET pb.Att_bonus = ab.attendance_bonus_value
--        FROM dbo.paym_paybill pb
--        INNER JOIN #AttendanceBonus2 ab ON pb.pn_CompanyID = ab.pn_companyid
--            AND pb.pn_BranchID = ab.pn_branchid
--            AND pb.pn_EmployeeID = ab.pn_employeeid
--            AND pb.EmployeeCode = ab.EmployeeCode
--            AND YEAR(pb.d_date) = ab.Year
--            AND MONTH(pb.d_date) = ab.Month;

--        -- Fetch the next Year-Month combination
--        FETCH NEXT FROM AttendanceCursor INTO @Year, @Month;
--    END TRY
--    BEGIN CATCH
--        -- Handle the error
--        PRINT ERROR_MESSAGE();
--        -- Drop the temporary table if it exists
--        IF OBJECT_ID('tempdb..#AttendanceBonus2') IS NOT NULL 
--            DROP TABLE #AttendanceBonus2;
--    END CATCH;
--END

--CLOSE AttendanceCursor;
--DEALLOCATE AttendanceCursor;

--END; 

--GO
--/****** Object:  StoredProcedure [dbo].[GetCTCBySlab]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE PROCEDURE [dbo].[GetCTCBySlab]
--    @SlabType VARCHAR(30), -- Slab_Type can be either 'Level' or 'Grade'
--    @Level_Name VARCHAR(30) = NULL, -- Optional parameter for Level_Name
--    @Grade_Name VARCHAR(30) = NULL, -- Optional parameter for Grade_Name
--    @Experience FLOAT -- Experience value to check against
--AS
--BEGIN
--    SET NOCOUNT ON;

--    DECLARE @CTC NUMERIC(10, 2);

--    -- Check if SlabType is 'Level'
--    IF @SlabType = 'Level'
--    BEGIN
--        SELECT @CTC = CTC
--        FROM [dbo].[GradeSlab_Branch]
--        WHERE Slab_Type = @SlabType
--          AND Level_Name = @Level_Name
--          AND Experience_From <= @Experience
--          AND (Experience_To = 'upwards' OR Experience_To >= @Experience);
--    END
--    -- Check if SlabType is 'Grade'
--    ELSE IF @SlabType = 'Grade'
--    BEGIN
--        SELECT @CTC = CTC
--        FROM [dbo].[GradeSlab_Branch]
--        WHERE Slab_Type = @SlabType
--          AND Grade_Name = @Grade_Name
--          AND Experience_From <= @Experience
--          AND (Experience_To = 'upwards' OR Experience_To >= @Experience);
--    END
--    ELSE
--    BEGIN
--        RAISERROR('Invalid Slab_Type. Please use ''Level'' or ''Grade''.', 16, 1);
--        RETURN;
--    END

--    -- Return the CTC value
--    IF @CTC IS NOT NULL
--    BEGIN
--        SELECT @CTC AS CTC;
--    END
--    ELSE
--    BEGIN
--        SELECT 'No matching records found.' AS Message;
--    END
--END
--GO
--/****** Object:  StoredProcedure [dbo].[GetCTCSlabForEmployees]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--create PROCEDURE [dbo].[GetCTCSlabForEmployees]
--    @EmployeeID INT -- Add EmployeeID as a parameter
--AS
--BEGIN
--    SELECT 
--        s.pn_CompanyID,  -- Show CompanyID from the CTCSlab table
--        s.pn_BranchID,   -- Show BranchID from the CTCSlab table
--        e.pn_EmployeeID,
--        e.CTC,
--        s.MinCTC,
--        s.MaxCTC,
--        s.MaxLoanAmount,
--        s.InterestRate,
--        s.LoanType
--    FROM 
--        dbo.paym_Employee e
--    INNER JOIN 
--        dbo.CTCSlab s
--        ON e.CTC BETWEEN s.MinCTC AND s.MaxCTC
--    WHERE 
--        e.pn_EmployeeID = @EmployeeID  -- Filter by the logged-in employee
--        AND e.pn_CompanyID = s.pn_CompanyID  -- Ensure the employee belongs to the same company as the slab
--        AND e.pn_BranchID = s.pn_BranchID; -- Ensure the employee belongs to the same branch as the slab
--END;
--GO
--/****** Object:  StoredProcedure [dbo].[GetEmployeeAllowancesAndFinalAmount]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO

--CREATE PROCEDURE [dbo].[GetEmployeeAllowancesAndFinalAmount]
--    @CompanyID INT,
--    @BranchID INT,
--    @GradeName NVARCHAR(100) = NULL,
--    @LevelName NVARCHAR(100) = NULL,
--    @EarningsName NVARCHAR(100) = NULL
--AS
--BEGIN
--    SET NOCOUNT ON;

--    -- Fetch the consistent Prorata_basis value for the branch and company
--    DECLARE @GlobalProrata NVARCHAR(1);

--    SELECT TOP 1 @GlobalProrata = Prorata_basis
--    FROM [dbo].[Allowancesettings]
--    WHERE pn_CompanyID = @CompanyID AND pn_BranchID = @BranchID;

--    -- If Prorata_basis is not found, raise an error
--    IF @GlobalProrata IS NULL
--    BEGIN
--        RAISERROR ('No Allowancesettings record found for the specified CompanyID and BranchID.', 16, 1);
--        RETURN;
--    END;

--    -- Start the CTEs
--    ;WITH EmployeeAllowances AS (
--        SELECT DISTINCT
--            e.Employee_Full_Name,
--            e.EmployeeCode,
--            av.Grade_Name,
--            av.Level_Name,
--            av.v_EarningsName,
--            av.pn_companyid,
--            av.pn_branchid,
--            CASE 
--                WHEN av.Allowancetype = 'Fixed' THEN av.value
--                WHEN av.Cal_Based_on = 'CTC' THEN (e.CTC * av.value / 100)
--                WHEN av.Cal_Based_on = 'BasicPay' THEN (e.Basic_Salary * av.value / 100)
--                ELSE 0
--            END AS OriginalAmount,
--            av.d_order
--        FROM 
--            [dbo].[AllowanceValues] av
--        JOIN 
--            [dbo].[paym_Employee] e
--            ON av.Grade_Name = e.Grade
--            OR av.Level_Name = e.Grade
--        WHERE 
--            av.pn_branchid = e.pn_BranchID
--            AND (av.Allowancetype IN ('Fixed', 'Percentage'))
--            AND (av.c_Regular = 'N' AND av.payslip = 'N')
--            AND av.pn_companyid = @CompanyID
--            AND av.pn_branchid = @BranchID
--            AND (@GradeName IS NULL OR av.Grade_Name = @GradeName)
--            AND (@LevelName IS NULL OR av.Level_Name = @LevelName)
--            AND (@EarningsName IS NULL OR av.v_EarningsName = @EarningsName)
--    ),
--    AbsentDays AS (
--        SELECT 
--            tc.emp_code,
--            DATEPART(MONTH, tc.dates) AS Month,
--            DATEPART(YEAR, tc.dates) AS Year,
--            COUNT(CASE WHEN tc.Status = 'A' THEN 1 ELSE NULL END) AS TotalAbsences
--        FROM 
--            [dbo].[time_card] tc
--        GROUP BY 
--            tc.emp_code, 
--            DATEPART(MONTH, tc.dates),
--            DATEPART(YEAR, tc.dates)
--    )
--    SELECT DISTINCT
--        ea.pn_companyid,
--        ea.pn_branchid,
--        ea.Grade_Name,
--        ea.Level_Name,
--        ea.v_EarningsName,
--        ea.OriginalAmount,
--        ea.d_order
--    FROM 
--        EmployeeAllowances ea
--    LEFT JOIN 
--        AbsentDays ad
--    ON ea.EmployeeCode = ad.emp_code
--    ORDER BY 
--        ea.pn_branchid, ea.d_order;
--END;
--GO
--/****** Object:  StoredProcedure [dbo].[GetEmployeeAllowancesAndFinalAmounts]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE PROCEDURE [dbo].[GetEmployeeAllowancesAndFinalAmounts]
--    @CompanyID INT,
--    @BranchID INT,
--    @GradeName NVARCHAR(100) = NULL,
--    @LevelName NVARCHAR(100) = NULL,
--    @EarningsName NVARCHAR(100) = NULL
--AS
--BEGIN
--    SET NOCOUNT ON;

--    -- Fetch the consistent Prorata_basis value for the branch and company
--    DECLARE @GlobalProrata NVARCHAR(1);

--    SELECT TOP 1 @GlobalProrata = Prorata_basis
--    FROM [dbo].[Allowancesettings]
--    WHERE pn_CompanyID = @CompanyID AND pn_BranchID = @BranchID;

--    -- If Prorata_basis is not found, raise an error
--    IF @GlobalProrata IS NULL
--    BEGIN
--        RAISERROR ('No Allowancesettings record found for the specified CompanyID and BranchID.', 16, 1);
--        RETURN;
--    END;

--    -- Start the CTEs
--    ;WITH EmployeeAllowances AS (
--        SELECT DISTINCT
--            e.Employee_Full_Name,
--            e.EmployeeCode,
--            av.Grade_Name,
--            av.Level_Name,
--            av.v_EarningsName,
--            av.pn_companyid,
--            av.pn_branchid,
--            CASE 
--                WHEN av.Allowancetype = 'Fixed' THEN av.value
--                WHEN av.Cal_Based_on = 'CTC' THEN (e.CTC * av.value / 100)
--                WHEN av.Cal_Based_on = 'BasicPay' THEN (e.Basic_Salary * av.value / 100)
--                ELSE 0
--            END AS OriginalAmount,
--            av.d_order
--        FROM 
--            [dbo].[AllowanceValues] av
--        JOIN 
--            [dbo].[paym_Employee] e
--            ON av.Grade_Name = e.Grade
--            OR av.Level_Name = e.Grade
--        WHERE 
--            av.pn_branchid = e.pn_BranchID
--            AND (av.Allowancetype IN ('Fixed', 'Percentage'))
--            AND (av.c_Regular = 'N' AND av.payslip = 'N')
--            AND av.pn_companyid = @CompanyID
--            AND av.pn_branchid = @BranchID
--            AND (@GradeName IS NULL OR av.Grade_Name = @GradeName)
--            AND (@LevelName IS NULL OR av.Level_Name = @LevelName)
--            AND (@EarningsName IS NULL OR av.v_EarningsName = @EarningsName)
--    ),
--    AbsentDays AS (
--        SELECT 
--            tc.emp_code,
--            DATEPART(MONTH, tc.dates) AS Month,
--            DATEPART(YEAR, tc.dates) AS Year,
--            COUNT(CASE WHEN tc.Status = 'A' THEN 1 ELSE NULL END) AS TotalAbsences
--        FROM 
--            [dbo].[time_card] tc
--        GROUP BY 
--            tc.emp_code, 
--            DATEPART(MONTH, tc.dates),
--            DATEPART(YEAR, tc.dates)
--    )
--    SELECT DISTINCT
--        ea.pn_companyid,
--        ea.pn_branchid,
--        ea.Grade_Name,
--        ea.Level_Name,
--        ea.v_EarningsName,
--        ea.OriginalAmount,
--        ea.d_order
--    FROM 
--        EmployeeAllowances ea
--    LEFT JOIN 
--        AbsentDays ad
--    ON ea.EmployeeCode = ad.emp_code
--    ORDER BY 
--        ea.pn_branchid, ea.d_order;
--END;
--GO
--/****** Object:  StoredProcedure [dbo].[GetEmployeeAllowancesWithFinalall]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE PROCEDURE [dbo].[GetEmployeeAllowancesWithFinalall]
--AS
--BEGIN
--    SET NOCOUNT ON;

--    WITH EmployeeAllowances AS (
--        SELECT DISTINCT
--            e.pn_CompanyID,
--            e.pn_BranchID,
--            e.Employee_Full_Name,
--            e.EmployeeCode,
--            e.pn_EmployeeID,
--            av.Grade_Name,
--            av.Level_Name,
--            av.v_EarningsName,
--            av.Allowancetype,
--            av.Cal_Based_on,
--            CASE 
--                WHEN av.Allowancetype = 'Fixed' THEN av.value
--                WHEN av.Cal_Based_on = 'CTC' THEN (e.CTC * av.value / 100)
--                WHEN av.Cal_Based_on = 'BasicPay' THEN (e.Basic_Salary * av.value / 100)
--                ELSE 0
--            END AS OriginalAmount,
--            aset.Prorata_basis, -- Prorata flag specific to each earning
--            av.d_order
--        FROM 
--            [dbo].[AllowanceValues] av
--        JOIN 
--            [dbo].[paym_Employee] e
--            ON av.Grade_Name = e.Grade
--            OR av.Level_Name = e.Grade
--        LEFT JOIN (
--            SELECT 
--                pn_CompanyID, pn_BranchID, v_EarningsName, 
--                MAX(Prorata_basis) AS Prorata_basis
--            FROM 
--                [dbo].[Allowancesettings]
--            GROUP BY 
--                pn_CompanyID, pn_BranchID, v_EarningsName
--        ) aset
--        ON av.pn_companyid = aset.pn_CompanyID
--        AND av.pn_branchid = aset.pn_BranchID
--        AND av.v_EarningsName = aset.v_EarningsName
--        WHERE 
--            av.pn_branchid = e.pn_BranchID
--            AND (av.Allowancetype IN ('Fixed', 'Percentage'))
--            AND NOT (av.c_Regular = 'N' AND av.payslip = 'N')
--    ),
--    AbsentDays AS (
--        SELECT 
--            tc.emp_code,
--            COUNT(CASE WHEN tc.Status = 'A' THEN 1 ELSE NULL END) AS FullDayAbsences,
--            COUNT(CASE WHEN tc.Status = 'HD' THEN 1 ELSE NULL END) AS HalfDayAbsences,
--            MAX(DATEPART(DAY, EOMONTH(tc.dates))) AS TotalDaysInMonth,
--            DATEPART(YEAR, tc.dates) AS Year,
--            DATEPART(MONTH, tc.dates) AS Month
--        FROM 
--            [dbo].[time_card] tc
--        GROUP BY 
--            tc.emp_code, DATEPART(YEAR, tc.dates), DATEPART(MONTH, tc.dates)
--    )
--    SELECT 
--        ea.pn_CompanyID,
--        ea.pn_BranchID,
--        ea.pn_EmployeeID,
--        ea.Employee_Full_Name,
--        ea.EmployeeCode,
--        ad.Year, -- Year
--        ad.Month, -- Month
--        SUM(
--            CASE 
--                WHEN ea.Prorata_basis = 'Y' THEN 
--                    CEILING(
--                        ea.OriginalAmount - (
--                            (ea.OriginalAmount / ISNULL(ad.TotalDaysInMonth, 31)) * 
--                            (ISNULL(ad.FullDayAbsences, 0) + ISNULL(ad.HalfDayAbsences, 0) * 0.5)
--                        )
--                    )
--                ELSE 
--                    ea.OriginalAmount
--            END
--        ) AS TotalAllowance -- Total Allowance for the employee in the month
--    FROM 
--        EmployeeAllowances ea
--    LEFT JOIN 
--        AbsentDays ad
--        ON ea.EmployeeCode = ad.emp_code
--    WHERE 
--        ea.Prorata_basis IN ('Y', 'N') -- Ensure only valid prorata values
--    GROUP BY
--        ea.pn_CompanyID, 
--        ea.pn_BranchID, 
--        ea.pn_EmployeeID, 
--        ea.Employee_Full_Name, 
--        ea.EmployeeCode,
--        ad.Year,
--        ad.Month
--    ORDER BY   
--        ea.EmployeeCode, ad.Year, ad.Month;
--END;
--GO
--/****** Object:  StoredProcedure [dbo].[GetEmployeeAllowancesWithFinalAmounts]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE PROCEDURE [dbo].[GetEmployeeAllowancesWithFinalAmounts]
--AS
--BEGIN
--    SET NOCOUNT ON;

--    WITH EmployeeAllowances AS (
--        SELECT DISTINCT
--            e.pn_CompanyID,
--            e.pn_BranchID,
--            e.Employee_Full_Name,
--            e.EmployeeCode,
--            e.pn_EmployeeID,
--            av.Grade_Name,
--            av.Level_Name,
--            av.v_EarningsName,
--            av.Allowancetype,
--            av.Cal_Based_on,
--            CASE 
--                WHEN av.Allowancetype = 'Fixed' THEN av.value
--                WHEN av.Cal_Based_on = 'CTC' THEN (e.CTC * av.value / 100)
--                WHEN av.Cal_Based_on = 'BasicPay' THEN (e.Basic_Salary * av.value / 100)
--                ELSE 0
--            END AS OriginalAmount,
--            aset.Prorata_basis, -- Prorata flag specific to each earning
--            av.d_order
--        FROM 
--            [dbo].[AllowanceValues] av
--        JOIN 
--            [dbo].[paym_Employee] e
--            ON av.Grade_Name = e.Grade
--            OR av.Level_Name = e.Grade
--        LEFT JOIN (
--            SELECT 
--                pn_CompanyID, pn_BranchID, v_EarningsName, 
--                MAX(Prorata_basis) AS Prorata_basis
--            FROM 
--                [dbo].[Allowancesettings]
--            GROUP BY 
--                pn_CompanyID, pn_BranchID, v_EarningsName
--        ) aset
--        ON av.pn_companyid = aset.pn_CompanyID
--        AND av.pn_branchid = aset.pn_BranchID
--        AND av.v_EarningsName = aset.v_EarningsName
--        WHERE 
--            av.pn_branchid = e.pn_BranchID
--            AND (av.Allowancetype IN ('Fixed', 'Percentage'))
--            AND NOT (av.c_Regular = 'N' AND av.payslip = 'N')
--    ),
--    AbsentDays AS (
--        SELECT 
--            tc.emp_code,
--            COUNT(CASE WHEN tc.Status = 'A' THEN 1 ELSE NULL END) AS FullDayAbsences,
--            COUNT(CASE WHEN tc.Status = 'HD' THEN 1 ELSE NULL END) AS HalfDayAbsences,
--            MAX(DATEPART(DAY, EOMONTH(tc.dates))) AS TotalDaysInMonth,
--            DATEPART(YEAR, tc.dates) AS Year,
--            DATEPART(MONTH, tc.dates) AS Month
--        FROM 
--            [dbo].[time_card] tc
--        GROUP BY 
--            tc.emp_code, DATEPART(YEAR, tc.dates), DATEPART(MONTH, tc.dates)
--    )
--    SELECT DISTINCT
--        ea.pn_CompanyID,
--        ea.pn_BranchID,
--        ea.pn_EmployeeID,
--        ea.Employee_Full_Name,
--        ea.EmployeeCode,
--        ea.Grade_Name,
--        ea.Level_Name,
--        ea.v_EarningsName,
--        ea.OriginalAmount,
--        ea.Prorata_basis, -- Show prorata basis (Y or N)
--        CASE 
--            WHEN ea.Prorata_basis = 'Y' THEN 
--                CEILING(
--                    ea.OriginalAmount - (
--                        (ea.OriginalAmount / ISNULL(ad.TotalDaysInMonth, 31)) * 
--                        (ISNULL(ad.FullDayAbsences, 0) + ISNULL(ad.HalfDayAbsences, 0) * 0.5)
--                    )
--                )
--            ELSE 
--                ea.OriginalAmount
--        END AS FinalAmount,
--        ea.d_order,
--        ad.Year, -- Show Year
--        ad.Month -- Show Month
--    FROM 
--        EmployeeAllowances ea
--    LEFT JOIN 
--        AbsentDays ad
--        ON ea.EmployeeCode = ad.emp_code
--    WHERE 
--        ea.Prorata_basis IN ('Y', 'N') -- Ensure only valid prorata values
--    ORDER BY   
--        ea.d_order, ad.Year, ad.Month;
--END;
--GO
--/****** Object:  StoredProcedure [dbo].[GetEmployeeAllowancesWithFinalOT]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE PROCEDURE [dbo].[GetEmployeeAllowancesWithFinalOT]
--AS
--BEGIN
--    SET NOCOUNT ON;

--    WITH EmployeeAllowances AS (
--        SELECT DISTINCT
--            e.pn_CompanyID,
--            e.pn_BranchID,
--            e.Employee_Full_Name,
--            e.EmployeeCode,
--            e.pn_EmployeeID,
--            av.Grade_Name,
--            av.Level_Name,
--            av.v_EarningsName,
--            av.Allowancetype,
--            av.Cal_Based_on,
--            CASE 
--                WHEN av.Allowancetype = 'Fixed' THEN av.value
--                WHEN av.Allowancetype = 'Percentage' AND av.Cal_Based_on = 'CTC' THEN (e.CTC * av.value / 100.0)
--                WHEN av.Allowancetype = 'Percentage' AND av.Cal_Based_on = 'BasicPay' THEN (e.Basic_Salary * av.value / 100.0)
--                ELSE 0
--            END AS OriginalAmount,
--            aset.Prorata_basis,
--            aset.c_OT,
--            av.d_order
--        FROM 
--            [dbo].[AllowanceValues] av
--        JOIN 
--            [dbo].[paym_Employee] e
--            ON av.Grade_Name = e.Grade
--            OR av.Level_Name = e.Grade
--        LEFT JOIN (
--            SELECT 
--                pn_CompanyID, pn_BranchID, v_EarningsName, 
--                MAX(Prorata_basis) AS Prorata_basis,
--                MAX(c_OT) AS c_OT
--            FROM 
--                [dbo].[Allowancesettings]
--            GROUP BY 
--                pn_CompanyID, pn_BranchID, v_EarningsName
--        ) aset
--        ON av.pn_companyid = aset.pn_CompanyID
--        AND av.pn_branchid = aset.pn_BranchID
--        AND av.v_EarningsName = aset.v_EarningsName
--        WHERE 
--            av.pn_branchid = e.pn_BranchID
--            AND av.Allowancetype IN ('Fixed', 'Percentage')
--            AND NOT (av.c_Regular = 'N' AND av.payslip = 'N')
--            AND (aset.c_OT = 'Y' OR aset.c_OT IS NULL)
--    ),
--    AbsentDays AS (
--        SELECT 
--            tc.emp_code,
--            COUNT(CASE WHEN tc.Status = 'A' THEN 1 ELSE NULL END) AS FullDayAbsences,
--            COUNT(CASE WHEN tc.Status = 'HD' THEN 1 ELSE NULL END) AS HalfDayAbsences,
--            MAX(DATEPART(DAY, EOMONTH(tc.dates))) AS TotalDaysInMonth,
--            DATEPART(YEAR, tc.dates) AS Year,
--            DATEPART(MONTH, tc.dates) AS Month,
--            COUNT(CASE WHEN tc.Status = 'A' THEN 1 ELSE NULL END) + 
--            (COUNT(CASE WHEN tc.Status = 'HD' THEN 1 ELSE NULL END) * 0.5) AS TotalAbsentDays
--        FROM 
--            [dbo].[time_card] tc
--        GROUP BY 
--            tc.emp_code, DATEPART(YEAR, tc.dates), DATEPART(MONTH, tc.dates)
--    )
--    SELECT 
--        ea.pn_CompanyID,
--        ea.pn_BranchID,
--        ea.pn_EmployeeID,
--        ea.Employee_Full_Name,
--        ea.EmployeeCode,
--        ad.Year,
--        ad.Month,
--        ISNULL(ad.FullDayAbsences, 0) AS FullDayAbsences,
--        ISNULL(ad.HalfDayAbsences, 0) AS HalfDayAbsences,
--        ISNULL(ad.TotalDaysInMonth, 31) AS TotalDaysInMonth,
--        ISNULL(ad.TotalAbsentDays, 0) AS TotalAbsentDays,
--        (ISNULL(ad.TotalDaysInMonth, 31) - ISNULL(ad.TotalAbsentDays, 0)) AS PaidDays,
--        COALESCE(SUM(
--            CASE 
--                WHEN ea.Prorata_basis = 'Y' THEN 
--                    (ea.OriginalAmount / ISNULL(ad.TotalDaysInMonth, 31)) * 
--                    (ISNULL(ad.TotalDaysInMonth, 31) - ISNULL(ad.TotalAbsentDays, 0))
--                ELSE 
--                    ea.OriginalAmount
--            END
--        ), 0) AS TotalAllowance
--    FROM 
--        EmployeeAllowances ea
--    LEFT JOIN 
--        AbsentDays ad
--        ON ea.EmployeeCode = ad.emp_code
--    WHERE 
--        ea.Prorata_basis IN ('Y', 'N')
--    GROUP BY
--        ea.pn_CompanyID, 
--        ea.pn_BranchID, 
--        ea.pn_EmployeeID, 
--        ea.Employee_Full_Name, 
--        ea.EmployeeCode,
--        ad.Year,
--        ad.Month,
--        ad.FullDayAbsences,
--        ad.HalfDayAbsences,
--        ad.TotalDaysInMonth,
--        ad.TotalAbsentDays
--    UNION ALL
--    SELECT 
--        e.pn_CompanyID,
--        e.pn_BranchID,
--        e.pn_EmployeeID,
--        e.Employee_Full_Name,
--        e.EmployeeCode,
--        ad.Year,
--        ad.Month,
--        ISNULL(ad.FullDayAbsences, 0) AS FullDayAbsences,
--        ISNULL(ad.HalfDayAbsences, 0) AS HalfDayAbsences,
--        ISNULL(ad.TotalDaysInMonth, 31) AS TotalDaysInMonth,
--        ISNULL(ad.TotalAbsentDays, 0) AS TotalAbsentDays,
--        (ISNULL(ad.TotalDaysInMonth, 31) - ISNULL(ad.TotalAbsentDays, 0)) AS PaidDays,
--        0 AS TotalAllowance
--    FROM 
--        [dbo].[paym_Employee] e
--    LEFT JOIN 
--        AbsentDays ad
--        ON e.EmployeeCode = ad.emp_code
--    WHERE 
--        NOT EXISTS (
--            SELECT 1 
--            FROM EmployeeAllowances ea 
--            WHERE ea.pn_EmployeeID = e.pn_EmployeeID
--        )
--    ORDER BY   
--        EmployeeCode, Year, Month;
--END;
--GO
--/****** Object:  StoredProcedure [dbo].[GetEmployeeAttendanceBonus]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE PROCEDURE [dbo].[GetEmployeeAttendanceBonus]
--AS
--BEGIN
--    -- Set the transaction isolation level
--    SET NOCOUNT ON;

--    -- Define the main query with the employee details and status count
--    WITH EmployeeAttendance AS (
--        SELECT 
--            e.pn_CompanyID,
--            e.pn_BranchID,
--            e.pn_EmployeeID,
--            emp.EmployeeCode,
--            emp.Employee_Full_Name,
--            e.pn_CategoryId,
--            c.v_CategoryName,
--            DATEPART(YEAR, tc.dates) AS [Year],        -- Extract year from the Date column
--            DATEPART(MONTH, tc.dates) AS [Month],      -- Extract month from the Date column
--          SUM(CASE WHEN tc.Status = 'A' THEN 1 ELSE 0 END) + 
--          SUM(CASE WHEN tc.Status = 'HD' THEN 0.5 ELSE 0 END) AS Status_A_Count

--        FROM 
--           [dbo].[paym_employee_profile1] e 
--        INNER JOIN 
--            [dbo].[paym_Category] c  
--        ON 
--            e.pn_CompanyID = c.pn_CompanyID
--            AND e.pn_BranchID = c.BranchID
--            AND e.pn_CategoryId = c.pn_CategoryId
--        INNER JOIN 
--            [dbo].[paym_Employee] emp 
--        ON 
--            e.pn_CompanyID = emp.pn_CompanyID
--            AND e.pn_BranchID = emp.pn_BranchID
--            AND e.pn_EmployeeID = emp.pn_EmployeeID
--        LEFT JOIN 
--            [dbo].[time_card] tc 
--        ON 
--            e.pn_CompanyID = tc.pn_CompanyID
--            AND e.pn_BranchID = tc.pn_BranchID
--            AND e.pn_EmployeeID = tc.pn_EmployeeID
--        GROUP BY 
--            e.pn_CompanyID,
--            e.pn_BranchID,
--            e.pn_EmployeeID,
--            emp.EmployeeCode,
--            emp.Employee_Full_Name,
--            e.pn_CategoryId,
--            c.v_CategoryName,
--            DATEPART(YEAR, tc.dates),
--            DATEPART(MONTH, tc.dates)
--    )

--    -- Join with Attendance_Bonus table to get the corresponding Attendance_Bonus_Value
--    SELECT 
--        ea.pn_CompanyID,
--        ea.pn_BranchID,
--        ea.pn_EmployeeID,
--        ea.EmployeeCode,
--        ea.Employee_Full_Name,
--        ea.pn_CategoryId,
--        ea.v_CategoryName,
--        ea.[Year],
--        ea.[Month],
--        ea.Status_A_Count,
--        ab.Attendance_bonus_type,
--        ab.Attendance_Bonus_Value
--    FROM 
--        EmployeeAttendance ea
--    LEFT JOIN 
--        [dbo].[Attendance_Bonus] ab
--    ON 
--	ea.pn_CompanyID = ab.pn_companyid and
--	ea.pn_BranchID = ab.pn_branchid and
--	ea.v_CategoryName = ab.Category_Name and
--        ea.Status_A_Count = ab.Attendance_bonus_type
--    ORDER BY 
--        ea.EmployeeCode,
--        ea.[Year],
--        ea.[Month];
--END

--GO
--/****** Object:  StoredProcedure [dbo].[GetEmployeeOTDetails]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE PROCEDURE [dbo].[GetEmployeeOTDetails]
--    @CategoryName NVARCHAR(100) = NULL -- Optional parameter to filter by category name
--AS
--BEGIN
--    SET NOCOUNT ON;

--    SELECT 
--        tc.pn_companyid,
--        tc.pn_branchid,
--        ep.pn_EmployeeID,
--        tc.emp_code,
--        tc.ot_hrs,
--        e.Employee_Full_Name,
--        ep.pn_CategoryId,
--        o.Category_Name, -- Include category name
--        -- Convert ot_hrs to time format
--        CONVERT(VARCHAR(8), CAST(tc.ot_hrs AS TIME), 108) AS Formatted_OT_Hours,
--        o.Ot_From_Duration, -- OT slab start
--        o.Ot_To_Duration,   -- OT slab end
--        o.Ot_Rate,          -- OT rate
--        -- Return OT hours and rate if the employee's OT falls within the slab range
--        CASE 
--            WHEN CONVERT(TIME, CAST(tc.ot_hrs AS TIME)) BETWEEN CONVERT(TIME, o.Ot_From_Duration) AND CONVERT(TIME, o.Ot_To_Duration)
--            THEN tc.ot_hrs
--            ELSE NULL
--        END AS Matched_OT_Hours,
--        CASE 
--            WHEN CONVERT(TIME, CAST(tc.ot_hrs AS TIME)) BETWEEN CONVERT(TIME, o.Ot_From_Duration) AND CONVERT(TIME, o.Ot_To_Duration)
--            THEN o.Ot_Rate
--            ELSE NULL
--        END AS Matched_OT_Rate
--    FROM 
--        [dbo].[time_card] tc
--    JOIN 
--        [dbo].[paym_Employee] e ON tc.emp_code = e.EmployeeCode  
--    JOIN 
--        [dbo].[paym_employee_profile1] ep ON e.pn_EmployeeID = ep.pn_EmployeeID
--    JOIN 
--        [dbo].[paym_category] c ON ep.pn_CategoryId = c.pn_CategoryId
--    JOIN 
--        [dbo].[OtslabNew] o ON c.v_CategoryName = o.Category_Name
--    WHERE 
--        (@CategoryName IS NULL OR c.v_CategoryName = @CategoryName)
--        AND CONVERT(TIME, CAST(tc.ot_hrs AS TIME)) 
--            BETWEEN CONVERT(TIME, o.Ot_From_Duration) AND CONVERT(TIME, o.Ot_To_Duration)
--END;
--GO
--/****** Object:  StoredProcedure [dbo].[GetEmployeeOvertimeAndAllowances]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE PROCEDURE [dbo].[GetEmployeeOvertimeAndAllowances]
--AS
--BEGIN
--    SET NOCOUNT ON;

--    WITH OTAllowances AS (
--        -- Calculate allowances included in OT
--        SELECT 
--            e.EmployeeCode AS emp_code,
--            av.pn_companyid,
--            av.pn_branchid,
--            SUM(
--                CASE 
--                    WHEN aset.c_OT = 'Y' THEN 
--                        CASE 
--                            WHEN av.Allowancetype = 'Fixed' THEN av.value
--                            WHEN av.Cal_Based_on = 'CTC' THEN (e.CTC * av.value / 100)
--                            WHEN av.Cal_Based_on = 'BasicPay' THEN (e.basic_salary * av.value / 100)
--                            ELSE 0
--                        END
--                    ELSE 0
--                END
--            ) AS OT_AllowanceValue
--        FROM 
--            [dbo].[AllowanceSettings] aset
--        JOIN 
--            [dbo].[AllowanceValues] av ON aset.v_EarningsName = av.v_EarningsName
--        JOIN 
--            [dbo].[paym_Employee] e ON av.Grade_Name = e.Grade OR av.Level_Name = e.Grade
--        GROUP BY 
--            e.EmployeeCode, av.pn_companyid, av.pn_branchid
--    ),
--    OTCalculations AS (
--        SELECT 
--            tc.pn_companyid,
--            tc.pn_branchid,
--            ep.pn_EmployeeID,
--            tc.emp_code,
--            tc.ot_hrs,
--            e.Employee_Full_Name,
--            ep.pn_CategoryId,
--            c.v_CategoryName,
--            CONVERT(VARCHAR(8), CAST(tc.ot_hrs AS TIME), 108) AS Formatted_OT_Hours,
--            o.Ot_From_Duration,
--            o.Ot_To_Duration,
--            o.Ot_Rate,
--            e.CTC,
--            e.basic_salary,
--            e.Grade,
--            DAY(EOMONTH(tc.dates)) AS Total_Days_In_Month,
--            ((e.basic_salary + COALESCE(ota.OT_AllowanceValue, 0)) / (DAY(EOMONTH(tc.dates)) * 8)) * o.Ot_Rate AS OverTimePay,
--            FORMAT(tc.dates, 'dd/MM/yyyy') AS Formatted_Date
--        FROM 
--            [dbo].[time_card] tc
--        JOIN 
--            [dbo].[paym_Employee] e ON tc.emp_code = e.EmployeeCode
--        JOIN 
--            [dbo].[paym_employee_profile1] ep ON e.pn_EmployeeID = ep.pn_EmployeeID
--        JOIN 
--            [dbo].[paym_category] c ON ep.pn_CategoryId = c.pn_CategoryId
--        JOIN 
--            [dbo].[OtslabNew] o ON c.v_CategoryName = o.Category_Name
--        LEFT JOIN 
--            OTAllowances ota ON tc.emp_code = ota.emp_code AND tc.pn_branchid = ota.pn_branchid
--        WHERE 
--            CONVERT(TIME, CAST(tc.ot_hrs AS TIME)) BETWEEN CONVERT(TIME, o.Ot_From_Duration) AND CONVERT(TIME, o.Ot_To_Duration)
--    ),
--    AllowanceCalculations AS (
--        -- Unchanged logic for allowances not related to OT
--        SELECT 
--            av.pn_companyid,
--            av.pn_branchid,
--            e.EmployeeCode AS emp_code,
--            e.Employee_Full_Name AS emp_name,
--            e.CTC,
--            e.basic_salary,
--            av.Level_Name,
--            SUM(
--                CASE 
--                    WHEN aset.c_OT = 'Y' THEN 0 -- Exclude OT-related allowances
--                    WHEN av.Allowancetype = 'Fixed' THEN av.value
--                    WHEN av.Cal_Based_on = 'CTC' THEN (e.CTC * av.value / 100)
--                    WHEN av.Cal_Based_on = 'BasicPay' THEN (e.basic_salary * av.value / 100)
--                    ELSE 0
--                END
--            ) AS Total_Allowance
--        FROM 
--            [dbo].[AllowanceValues] av
--        JOIN 
--            [dbo].[paym_Employee] e
--            ON av.Grade_Name = e.Grade
--            OR av.Level_Name = e.Grade
--        JOIN 
--            [dbo].[AllowanceSettings] aset
--            ON av.v_EarningsName = aset.v_EarningsName
--        GROUP BY 
--            av.pn_companyid,
--            av.pn_branchid,
--            e.EmployeeCode,
--            e.Employee_Full_Name,
--            e.CTC,
--            e.basic_salary,
--            av.Level_Name
--    ),
--    RankedOT AS (
--        SELECT 
--            ot.pn_companyid,
--            ot.pn_branchid,
--            ot.emp_code,
--            ot.Employee_Full_Name,
--            ot.CTC,
--            ot.basic_salary,
--            ot.Grade,
--            ot.Formatted_OT_Hours,
--            ot.Ot_From_Duration,
--            ot.Ot_To_Duration,
--            ot.Ot_Rate,
--            ot.OverTimePay,
--            ot.Total_Days_In_Month,
--            ot.Formatted_Date,
--            ac.Level_Name,
--            ac.Total_Allowance,
--            ROW_NUMBER() OVER (PARTITION BY ot.emp_code, ot.Formatted_Date ORDER BY ot.Formatted_Date) AS rn
--        FROM 
--            OTCalculations ot
--        LEFT JOIN 
--            AllowanceCalculations ac ON ot.emp_code = ac.emp_code AND ot.pn_branchid = ac.pn_branchid
--    )
--    -- Final output unchanged
--    SELECT 
--        ro.pn_companyid,
--        ro.pn_branchid,
--        ro.emp_code,
--        ro.Employee_Full_Name,
--        ro.CTC,
--        ro.basic_salary,
--        ro.Grade,
--        ro.Formatted_OT_Hours,
--        ro.Ot_From_Duration,
--        ro.Ot_To_Duration,
--        ro.Ot_Rate,
--        ro.OverTimePay,
--        ro.Total_Days_In_Month,
--        ro.Formatted_Date,
--        ro.Level_Name,
--        ro.Total_Allowance
--    FROM 
--        RankedOT ro
--    WHERE 
--        ro.rn = 1
--    ORDER BY 
--        ro.emp_code, ro.Total_Days_In_Month, ro.Level_Name;
--END;
--GO
--/****** Object:  StoredProcedure [dbo].[GetEmployeeSummaryInPayBill]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE PROCEDURE [dbo].[GetEmployeeSummaryInPayBill]
--AS
--BEGIN
--    SET NOCOUNT ON;

--    -- Declare variables for Salary, Attendance, and Deductions calculations
--    DECLARE @EmployeeCode VARCHAR(10), @EmployeeName VARCHAR(50);
--    DECLARE @pn_CompanyID INT, @pn_BranchID INT, @pn_EmployeeID INT;
--    DECLARE @Month INT, @Year INT;
--    DECLARE @CTC FLOAT, @BasicSalary FLOAT, @ActualSalary FLOAT, @Earnedbasic FLOAT;
--    DECLARE @PresentDays INT, @OffDays INT, @HalfDays INT, @LeaveDays INT;
--    DECLARE @Holidays INT, @WorkFromHome INT, @AbsentDays INT, @PaidDays FLOAT;
--    DECLARE @TotalDaysInMonth INT, @TotalCalculatedDays INT;
--    DECLARE @TotalAllowances FLOAT; -- Declare variable for total allowances
--    DECLARE @GrossSalary FLOAT; -- Declare variable for gross salary
--    DECLARE @TotalDeductions FLOAT; -- Declare variable for total deductions
--    DECLARE @NetSalary FLOAT; -- Declare variable for net salary

--    -- Temporary table for employees
--    SELECT 
--        pn_CompanyID,
--        pn_BranchID,
--        pn_EmployeeID,
--        EmployeeCode, 
--        Employee_Full_Name AS EmployeeName
--    INTO #EmployeeList
--    FROM [dbo].[paym_employee];

--    -- Create a table to hold the results
--    CREATE TABLE #EmployeeSummary (
--        pn_CompanyID INT,
--        pn_BranchID INT,
--        pn_EmployeeID INT,
--        EmployeeCode VARCHAR(10),
--        EmployeeName VARCHAR(50),
--        Month INT,
--        Year INT,
--        NoOfPresentDays INT,
--        NoOfOffDays INT,
--        NoOfHalfDays INT,
--        Holidays INT,
--        WorkFromHome INT,
--        NoOfLeaves INT,
--        AbsentDays INT,
--        PaidDays FLOAT,
--        TotalCalculatedDays INT,
--        BasicSalary FLOAT,
--        ActualSalary FLOAT,
--        Earnedbasic FLOAT,
--        CTC FLOAT,
--        GrossSalary FLOAT, -- Add GrossSalary column here
--        TotalDeductions FLOAT, -- Add TotalDeductions column here
--        NetSalary FLOAT -- Add NetSalary column here
--    );

--    -- Loop through each employee
--    DECLARE EmployeeCursor CURSOR FOR
--    SELECT pn_CompanyID, pn_BranchID, pn_EmployeeID, EmployeeCode, EmployeeName 
--    FROM #EmployeeList;

--    OPEN EmployeeCursor;
--    FETCH NEXT FROM EmployeeCursor INTO @pn_CompanyID, @pn_BranchID, @pn_EmployeeID, @EmployeeCode, @EmployeeName;

--    WHILE @@FETCH_STATUS = 0
--    BEGIN
--        -- Get CTC and BasicSalary for the employee
--        SELECT @CTC = ctc, @BasicSalary = basic_salary
--        FROM [dbo].[paym_employee]
--        WHERE EmployeeCode = @EmployeeCode;

--        -- Calculate Gross Salary (CTC / 12)
--        SET @ActualSalary = @CTC / 12;



--        -- Get total allowances for the employee
--        SELECT @TotalAllowances = SUM(COALESCE(value1, 0) + COALESCE(value2, 0) + 
--                                       COALESCE(value3, 0) + COALESCE(value4, 0) +
--                                       COALESCE(value5, 0) + COALESCE(value6, 0) + 
--                                       COALESCE(value7, 0) + COALESCE(value8, 0) + 
--                                       COALESCE(value9, 0) + COALESCE(value10, 0))
--        FROM [dbo].[EarnDeductValuesMasters]
--        WHERE pn_CompanyID = @pn_CompanyID AND pn_BranchID = @pn_BranchID and pn_EmployeeID = @pn_EmployeeID;

--        -- Calculate Gross Salary
--        SET @GrossSalary = @BasicSalary + @TotalAllowances;

--        -- Get total deductions for the employee
--        SELECT @TotalDeductions = SUM(COALESCE(valueA1, 0) + COALESCE(valueA2, 0) + 
--                                       COALESCE(valueA3, 0) + COALESCE(valueA4, 0) +
--                                       COALESCE(valueA5, 0) + COALESCE(valueA6, 0) + 
--                                       COALESCE(valueA7, 0) + COALESCE(valueA8, 0) + 
--                                       COALESCE(valueA9, 0) + COALESCE(valueA10, 0))
--        FROM [dbo].[EarnDeductValuesMasters]
--        WHERE pn_CompanyID = @pn_CompanyID AND pn_BranchID = @pn_BranchID AND pn_EmployeeID = @pn_EmployeeID;

--        -- Calculate Net Salary
--        SET @NetSalary = @GrossSalary - @TotalDeductions;

--        -- Loop through each month/year combination in the time_card table
--        DECLARE MonthYearCursor CURSOR FOR
--        SELECT DISTINCT MONTH([dates]) AS Month, YEAR([dates]) AS Year
--        FROM [dbo].[time_card]
--        WHERE [emp_code] = @EmployeeCode;

--        OPEN MonthYearCursor;
--        FETCH NEXT FROM MonthYearCursor INTO @Month, @Year;

--        WHILE @@FETCH_STATUS = 0
--        BEGIN
--            -- Initialize counts for attendance
--            SET @PresentDays = 0;
--            SET @OffDays = 0;
--            SET @HalfDays = 0;
--            SET @LeaveDays = 0;
--            SET @Holidays = 0;
--            SET @WorkFromHome = 0;
--            SET @AbsentDays = 0;

--            -- Attendance calculations
--            SELECT @PresentDays = COUNT(*) 
--            FROM [dbo].[time_card]
--            WHERE [emp_code] = @EmployeeCode AND [status] = 'P' AND MONTH([dates]) = @Month AND YEAR([dates]) = @Year;

--            SELECT @OffDays = COUNT(*) 
--            FROM [dbo].[time_card]
--            WHERE [emp_code] = @EmployeeCode AND [status] = 'W' AND MONTH([dates]) = @Month AND YEAR([dates]) = @Year;

--            SELECT @WorkFromHome = COUNT(*) 
--            FROM [dbo].[time_card]
--            WHERE [emp_code] = @EmployeeCode AND [status] = 'WFH' AND MONTH([dates]) = @Month AND YEAR([dates]) = @Year;

--            SELECT @Holidays = COUNT(*) 
--            FROM [dbo].[time_card]
--            WHERE [emp_code] = @EmployeeCode AND [status] = 'H' AND MONTH([dates]) = @Month AND YEAR([dates]) = @Year;

--            SELECT @HalfDays = COUNT(*) 
--            FROM [dbo].[time_card]
--            WHERE [emp_code] = @EmployeeCode AND [status] = 'HD' AND MONTH([dates]) = @Month AND YEAR([dates]) = @Year;

--            SELECT @LeaveDays = COUNT(*) 
--            FROM [dbo].[time_card]
--            WHERE [emp_code] = @EmployeeCode AND ([leave_code] = 'LC001' OR [leave_code] = 'LC002') AND MONTH([dates]) = @Month AND YEAR([dates]) = @Year;

--            SELECT @AbsentDays = COUNT(*) 
--            FROM [dbo].[time_card]
--            WHERE [emp_code] = @EmployeeCode AND [status] = 'A' AND MONTH([dates]) = @Month AND YEAR([dates]) = @Year;

--            -- Calculate PaidDays
--            SET @PaidDays = @PresentDays + @OffDays + (@HalfDays * 0.5) + @LeaveDays + @Holidays + @WorkFromHome;

--            -- Calculate Total Days in the month
--            SET @TotalDaysInMonth = DAY(EOMONTH(CONVERT(DATE, CONCAT(@Year, '-', @Month, '-01'))));

--            -- Calculate Earned Basic Salary
--            SET @Earnedbasic = (@BasicSalary / @TotalDaysInMonth) * @PaidDays;

--            -- Calculate total days for the employee in that month
--            SET @TotalCalculatedDays = (SELECT COUNT(*) 
--                                        FROM [dbo].[time_card] 
--                                        WHERE [emp_code] = @EmployeeCode 
--                                        AND MONTH([dates]) = @Month 
--                                        AND YEAR([dates]) = @Year);

--            -- Insert the results into the summary table
--            INSERT INTO #EmployeeSummary (
--                pn_CompanyID, pn_BranchID, pn_EmployeeID, EmployeeCode, EmployeeName, Month, Year, 
--                NoOfPresentDays, NoOfOffDays, NoOfHalfDays, Holidays, WorkFromHome, NoOfLeaves, AbsentDays, 
--                PaidDays, TotalCalculatedDays, BasicSalary, ActualSalary, Earnedbasic, CTC, GrossSalary,
--                TotalDeductions, NetSalary)
--            VALUES (
--                @pn_CompanyID, @pn_BranchID, @pn_EmployeeID, @EmployeeCode, @EmployeeName, @Month, @Year, 
--                @PresentDays, @OffDays, @HalfDays, @Holidays, @WorkFromHome, @LeaveDays, @AbsentDays, 
--                @PaidDays, @TotalCalculatedDays, @BasicSalary, @ActualSalary, @Earnedbasic, @CTC, @GrossSalary,
--                @TotalDeductions, @NetSalary);

--            -- Insert into paym_paybill after calculations
--            INSERT INTO paym_paybill (
--                pn_CompanyID, pn_BranchID, pn_EmployeeID, EmployeeCode, Employee_First_Name, Earned_Basic, Calc_Days, Paid_Days, Present_Days, Absent_Days, WeekOffDays, Holidays, TotLeave_Days)
--            VALUES (
--                @pn_CompanyID, @pn_BranchID, @pn_EmployeeID, @EmployeeCode, @EmployeeName, @Earnedbasic , @TotalCalculatedDays, @PaidDays, @PresentDays, @AbsentDays, @OffDays, @Holidays, @LeaveDays);

--            FETCH NEXT FROM MonthYearCursor INTO @Month, @Year;
--        END;

--        CLOSE MonthYearCursor;
--        DEALLOCATE MonthYearCursor;

--        FETCH NEXT FROM EmployeeCursor INTO @pn_CompanyID, @pn_BranchID, @pn_EmployeeID, @EmployeeCode, @EmployeeName;
--    END;

--    CLOSE EmployeeCursor;
--    DEALLOCATE EmployeeCursor;

--    -- Return the results
--    SELECT * FROM #EmployeeSummary;

--    -- Clean up temporary table
--    DROP TABLE #EmployeeList;
--    DROP TABLE #EmployeeSummary;
--END;

--GO
--/****** Object:  StoredProcedure [dbo].[GetEmployeeTotalAllowancesWithFinalAmounts]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE PROCEDURE [dbo].[GetEmployeeTotalAllowancesWithFinalAmounts]
--AS
--BEGIN
--    SET NOCOUNT ON;

--    WITH EmployeeAllowances AS (
--        SELECT DISTINCT
--            e.pn_CompanyID,
--            e.pn_BranchID,
--            e.Employee_Full_Name,
--            e.EmployeeCode,
--            e.pn_EmployeeID,
--            av.Grade_Name,
--            av.Level_Name,
--            av.v_EarningsName,
--            av.Allowancetype,
--            av.Cal_Based_on,
--            CASE 
--                WHEN av.Allowancetype = 'Fixed' THEN av.value
--                WHEN av.Cal_Based_on = 'CTC' THEN (e.CTC * av.value / 100)
--                WHEN av.Cal_Based_on = 'BasicPay' THEN (e.Basic_Salary * av.value / 100)
--                ELSE 0
--            END AS OriginalAmount,
--            aset.Prorata_basis, -- Prorata flag specific to each earning
--            av.d_order
--        FROM 
--            [dbo].[AllowanceValues] av
--        JOIN 
--            [dbo].[paym_Employee] e
--            ON av.Grade_Name = e.Grade
--            OR av.Level_Name = e.Grade
--        LEFT JOIN (
--            SELECT 
--                pn_CompanyID, pn_BranchID, v_EarningsName, 
--                MAX(Prorata_basis) AS Prorata_basis
--            FROM 
--                [dbo].[Allowancesettings]
--            GROUP BY 
--                pn_CompanyID, pn_BranchID, v_EarningsName
--        ) aset
--        ON av.pn_companyid = aset.pn_CompanyID
--        AND av.pn_branchid = aset.pn_BranchID
--        AND av.v_EarningsName = aset.v_EarningsName
--        WHERE 
--            av.pn_branchid = e.pn_BranchID
--            AND (av.Allowancetype IN ('Fixed', 'Percentage'))
--            AND NOT (av.c_Regular = 'N' AND av.payslip = 'N')
--    ),
--    AbsentDays AS (
--        SELECT 
--            tc.emp_code,
--            COUNT(CASE WHEN tc.Status = 'A' THEN 1 ELSE NULL END) AS FullDayAbsences,
--            COUNT(CASE WHEN tc.Status = 'HD' THEN 1 ELSE NULL END) AS HalfDayAbsences,
--            MAX(DATEPART(DAY, EOMONTH(tc.dates))) AS TotalDaysInMonth,
--            DATEPART(YEAR, tc.dates) AS Year,
--            DATEPART(MONTH, tc.dates) AS Month
--        FROM 
--            [dbo].[time_card] tc
--        GROUP BY 
--            tc.emp_code, DATEPART(YEAR, tc.dates), DATEPART(MONTH, tc.dates)
--    )
--    SELECT 
--        ea.pn_CompanyID,
--        ea.pn_BranchID,
--        ea.pn_EmployeeID,
--        ea.Employee_Full_Name,
--        ea.EmployeeCode,
--        ad.Year, -- Year
--        ad.Month, -- Month
--        SUM(
--            CASE 
--                WHEN ea.Prorata_basis = 'Y' THEN 
--                    CEILING(
--                        ea.OriginalAmount - (
--                            (ea.OriginalAmount / ISNULL(ad.TotalDaysInMonth, 31)) * 
--                            (ISNULL(ad.FullDayAbsences, 0) + ISNULL(ad.HalfDayAbsences, 0) * 0.5)
--                        )
--                    )
--                ELSE 
--                    ea.OriginalAmount
--            END
--        ) AS TotalAllowance -- Total Allowance for the employee in the month
--    FROM 
--        EmployeeAllowances ea
--    LEFT JOIN 
--        AbsentDays ad
--        ON ea.EmployeeCode = ad.emp_code
--    WHERE 
--        ea.Prorata_basis IN ('Y', 'N') -- Ensure only valid prorata values
--    GROUP BY
--        ea.pn_CompanyID, 
--        ea.pn_BranchID, 
--        ea.pn_EmployeeID, 
--        ea.Employee_Full_Name, 
--        ea.EmployeeCode,
--        ad.Year,
--        ad.Month
--    ORDER BY   
--        ea.EmployeeCode, ad.Year, ad.Month;
--END;
--GO
--/****** Object:  StoredProcedure [dbo].[GetPermissionDeduction]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE PROCEDURE [dbo].[GetPermissionDeduction]
--    @CompanyID INT,
--    @BranchID INT = NULL,
--    @PermissionMinutes INT
--AS
--BEGIN
--    SET NOCOUNT ON;

--    DECLARE @Deduction VARCHAR(25);

--    -- Find the deduction based on permission duration
--    SELECT TOP 1 @Deduction = Permission_Deduction
--    FROM paym_PermissionSlab
--    WHERE pn_CompanyID = @CompanyID
--        AND (pn_BranchID = @BranchID OR pn_BranchID IS NULL)
--        AND CAST(From_Duration AS INT) <= @PermissionMinutes
--        AND (
--            -- Condition 1: Normal range-based duration check
--            (ISNUMERIC(To_Duration) = 1 AND CAST(To_Duration AS INT) >= @PermissionMinutes)
--            -- Condition 2: If To_Duration is "Upwards", consider it as unlimited
--            OR (To_Duration = 'Upwards')
--        )
--    ORDER BY CAST(From_Duration AS INT) ASC;

--    -- Return the deduction value
--    IF @Deduction IS NOT NULL
--        SELECT @Deduction AS Permission_Deduction;
--    ELSE
--        SELECT 'No Slab Defined' AS Permission_Deduction;
--END;
--GO
--/****** Object:  StoredProcedure [dbo].[LoanPayment]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE PROCEDURE [dbo].[LoanPayment] 
--    @EmployeeID INT
--AS
--BEGIN
--    SET NOCOUNT ON;

--    DECLARE @ApplicationID INT;
--	DECLARE @RequestedAmount DECIMAL(18,2);
--	DECLARE @loantype varchar(50);
--    DECLARE @LoanAmount DECIMAL(18,2), @InterestRate DECIMAL(5,2);
--    DECLARE @RepaymentPeriod INT, @EffectiveDate DATE, @TotalInterest DECIMAL(18,2);
--    DECLARE @TotalLoanAmount DECIMAL(18,2), @EMIAmount DECIMAL(18,2), @RemainingAmount DECIMAL(18,2);
--    DECLARE @Month INT = 1, @EMIDueDate DATE, @ExtendedMonths INT = 0;
--    DECLARE @PreclosureAmount DECIMAL(18,2), @LastRemainingAmount DECIMAL(18,2);
--    DECLARE @CompanyID INT, @BranchID INT;
    
--    -- Get latest approved loan application
--    SELECT TOP 1 
--        @ApplicationID = ApplicationID,
--		@loantype = loantype,
--	@RequestedAmount = RequestedAmount,
--	@InterestRate =InterestRate
--    FROM [paym_LoanApply_employee] 
--    WHERE pn_EmployeeID = @EmployeeID AND ApplicationStatus = 'Approved' 
--    ORDER BY ApplicationDate DESC;

--    -- Validate if a loan exists
--    IF @ApplicationID IS NULL
--    BEGIN
--        PRINT 'No approved loan found';
--        RETURN;
--    END;

--    -- Fetch Loan Details
--    BEGIN TRY
--        SELECT 
--            @LoanAmount = RequestedAmount, 
--            @InterestRate = InterestRate, 
--            @CompanyID = pn_CompanyId,
--            @BranchID = pn_BranchId,
--            @RepaymentPeriod = RepaymentPeriod,
--            @EffectiveDate = EffectiveDate
--        FROM [paym_LoanApply_employee] 
--        WHERE ApplicationID = @ApplicationID;

--        IF @LoanAmount IS NULL
--        BEGIN
--            RAISERROR('Loan details not found for ApplicationID: %d', 16, 1, @ApplicationID);
--            RETURN;
--        END;
--    END TRY
--    BEGIN CATCH
--        PRINT 'Error fetching loan details: ' + ERROR_MESSAGE();
--        RETURN;
--    END CATCH;

--    -- Calculate Total Loan Amount
--    SET @TotalInterest = (@LoanAmount * (@InterestRate / 100)) * @RepaymentPeriod;
--    SET @TotalLoanAmount = @LoanAmount + @TotalInterest;
--    SET @EMIAmount = @TotalLoanAmount / @RepaymentPeriod;
--    SET @RemainingAmount = @TotalLoanAmount;
--    SET @EMIDueDate = DATEADD(MONTH, 1, @EffectiveDate);

--    -- Temporary Table for Repayment Schedule
--    CREATE TABLE #LoanRepaymentSchedule (
--        EmployeeID INT,
--        MonthNo INT,
--        EMIAmount DECIMAL(18,2),
--        PaidAmount DECIMAL(18,2) DEFAULT 0.00,
--        RemainingAmount DECIMAL(18,2) DEFAULT 0.00,
--        EMIDueDate DATE,
--        Status VARCHAR(20)
--    );

--    -- Generate Repayment Schedule
--    WHILE @Month <= @RepaymentPeriod + @ExtendedMonths
--    BEGIN
--        IF EXISTS (SELECT 1 FROM dbo.LoanPostponed WHERE ApplicationID = @ApplicationID AND ApprovalStatus = 'Approved' AND month_to_posted = @EMIDueDate)
--        BEGIN
--            INSERT INTO #LoanRepaymentSchedule (EmployeeID, MonthNo, EMIAmount, EMIDueDate, Status)
--            VALUES (@EmployeeID, @Month, 0.00, @EMIDueDate, 'Postponed');
--            SET @ExtendedMonths = @ExtendedMonths + 1;
--        END
--        ELSE
--        BEGIN
--            INSERT INTO #LoanRepaymentSchedule (EmployeeID, MonthNo, EMIAmount, EMIDueDate, Status)
--            VALUES (@EmployeeID, @Month, @EMIAmount, @EMIDueDate, 'Pending');
--        END;

--        SET @EMIDueDate = DATEADD(MONTH, 1, @EMIDueDate);
--        SET @Month = @Month + 1;
--    END;

--    -- Fetch Preclosure Amount
--    SELECT @PreclosureAmount = PreclosureAmount 
--    FROM dbo.LoanPreclosure 
--    WHERE ApplicationID = @ApplicationID;

--    -- Fetch Last Remaining Amount
--    SELECT TOP 1 @LastRemainingAmount = RemainingAmount 
--    FROM dbo.LoanRepayment 
--    WHERE ApplicationID = @ApplicationID 
--    ORDER BY ScheduledPaymentDate DESC;

--    -- Handle Preclosure Case
--    IF @LastRemainingAmount IS NOT NULL AND @PreclosureAmount IS NOT NULL AND @LastRemainingAmount = @PreclosureAmount
--    BEGIN
--        UPDATE LRS
--        SET RemainingAmount = 0.00, Status = 'Preclosed'
--        FROM #LoanRepaymentSchedule LRS
--        WHERE LRS.Status = 'Pending';
--    END;

--    -- Mark Paid EMIs
--    UPDATE LRS
--    SET Status = 'Paid'
--    FROM #LoanRepaymentSchedule LRS
--    JOIN dbo.LoanRepayment LR ON LRS.EMIDueDate = LR.ScheduledPaymentDate
--    WHERE LR.ApplicationID = @ApplicationID AND LR.PaymentStatus = 'Paid';

--    -- Update Remaining Amounts
--    UPDATE LRS
--    SET RemainingAmount = 0.00
--    FROM #LoanRepaymentSchedule LRS
--    WHERE LRS.Status = 'Paid';

--    -- Return Loan Repayment Schedule
--    SELECT 
--          LRS.MonthNo,
--	@ApplicationID AS ApplicationID,
--	@CompanyID AS CompanyID,  -- Adding Company ID
--    @BranchID AS BranchID    ,
--	LRS.EmployeeID,
--	@loantype As loantype,
--	@InterestRate As intrestrate,
--	@RequestedAmount As PrincipalAmount,
--	@TotalLoanAmount As TotalAmount,
--    LRS.EMIAmount,
--    LRS.EMIDueDate,
--          COALESCE(
--            (SELECT SUM(EMIAmount) 
--             FROM dbo.LoanRepayment 
--             WHERE ApplicationID = @ApplicationID 
--               AND PaymentStatus = 'Paid' 
--               AND ScheduledPaymentDate = LRS.EMIDueDate), 0) AS PaidAmount,
--        CASE 
--            WHEN LRS.Status = 'Preclosed' THEN 0.00
--            ELSE @TotalLoanAmount - 
--                 (SELECT COALESCE(SUM(EMIAmount), 0) 
--                  FROM dbo.LoanRepayment 
--                  WHERE ApplicationID = @ApplicationID 
--                    AND PaymentStatus = 'Paid' 
--                    AND ScheduledPaymentDate <= LRS.EMIDueDate)
--        END AS RemainingAmount,
--        LRS.Status
--    FROM #LoanRepaymentSchedule LRS
--    ORDER BY LRS.EMIDueDate;

--    -- Cleanup
--    DROP TABLE #LoanRepaymentSchedule; 
--END;

--------------------------------------------------------------------------
----EXEC LoanPayment @EmployeeID 

--GO
--/****** Object:  StoredProcedure [dbo].[NETSALARY]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO

--CREATE PROCEDURE [dbo].[NETSALARY]
--AS
--BEGIN
--    SET NOCOUNT ON;

--    -- Create a temporary table to store output from GetEmployeeAttendanceBonus
--    CREATE TABLE #AttendanceBonus (
--        pn_CompanyID INT,
--        pn_BranchID INT,
--        pn_EmployeeID INT,
--        EmployeeCode NVARCHAR(50),
--        Employee_Full_Name NVARCHAR(100),
--        pn_CategoryId INT,
--        v_CategoryName NVARCHAR(100),
--        Year INT,
--        Month INT,
--        Status_A_Count INT,
--        Attendance_bonus_type NVARCHAR(50),
--        Attendance_Bonus_Value DECIMAL(18, 2)
--    );

--    -- Insert data from GetEmployeeAttendanceBonus into the temporary table
--    INSERT INTO #AttendanceBonus
--    EXEC dbo.GetEmployeeAttendanceBonus;

--    -- Create a temporary table to store Employee Allowances
--    CREATE TABLE #EmployeeAllowances (
--        pn_CompanyID INT,
--        pn_BranchID INT,
--        Employee_Full_Name NVARCHAR(100),
--        EmployeeCode NVARCHAR(50),
--        pn_EmployeeID INT,
--        Grade_Name NVARCHAR(100),
--        Level_Name NVARCHAR(100),
--        v_EarningsName NVARCHAR(100),
--        Allowancetype NVARCHAR(50),
--        Cal_Based_on NVARCHAR(50),
--        OriginalAmount DECIMAL(18, 2),
--        Prorata_basis NVARCHAR(50),
--        d_order INT
--    );

--    -- Insert data into #EmployeeAllowances table
--    INSERT INTO #EmployeeAllowances
--    SELECT DISTINCT
--        e.pn_CompanyID,
--        e.pn_BranchID,
--        e.Employee_Full_Name,
--        e.EmployeeCode,
--        e.pn_EmployeeID,
--        av.Grade_Name,
--        av.Level_Name,
--        av.v_EarningsName,
--        av.Allowancetype,
--        av.Cal_Based_on,
--        CASE 
--            WHEN av.Allowancetype = 'Fixed' THEN av.value
--            WHEN av.Cal_Based_on = 'CTC' THEN (e.CTC * av.value / 100)
--            WHEN av.Cal_Based_on = 'BasicPay' THEN (e.Basic_Salary * av.value / 100)
--            ELSE 0
--        END AS OriginalAmount,
--        aset.Prorata_basis,
--        av.d_order
--    FROM 
--        [dbo].[AllowanceValues] av
--    JOIN 
--        [dbo].[paym_Employee] e
--        ON av.Grade_Name = e.Grade
--        OR av.Level_Name = e.Grade
--    LEFT JOIN (
--        SELECT 
--            pn_CompanyID, pn_BranchID, v_EarningsName, 
--            MAX(Prorata_basis) AS Prorata_basis
--        FROM 
--            [dbo].[Allowancesettings]
--        GROUP BY 
--            pn_CompanyID, pn_BranchID, v_EarningsName
--    ) aset
--    ON av.pn_companyid = aset.pn_CompanyID
--    AND av.pn_branchid = aset.pn_BranchID
--    AND av.v_EarningsName = aset.v_EarningsName
--    WHERE 
--        av.pn_branchid = e.pn_BranchID
--        AND (av.Allowancetype IN ('Fixed', 'Percentage'))
--        AND NOT (av.c_Regular = 'N' AND av.payslip = 'N');

--    -- Create a temporary table to store Attendance Data
--    CREATE TABLE #AttendanceData (
--        pn_EmployeeID INT,
--        Year INT,
--        Month INT,
--        MonthsWithAttendance INT,
--        AbsentDays DECIMAL(18, 2),
--        TotalDays INT,
--        PaidDays INT
--    );

--    -- Insert data into #AttendanceData table
--    INSERT INTO #AttendanceData
--    SELECT 
--        tc.pn_EmployeeID,
--        YEAR(tc.dates) AS Year,
--        MONTH(tc.dates) AS Month,
--        COUNT(DISTINCT MONTH(tc.dates)) AS MonthsWithAttendance,
--        SUM(CASE WHEN tc.status = 'A' THEN 1 ELSE 0 END) + 
--        SUM(CASE WHEN tc.status = 'HD' THEN 0.5 ELSE 0 END) AS AbsentDays,
--        COUNT(tc.dates) AS TotalDays,
--        COUNT(tc.dates) - 
--        (SUM(CASE WHEN tc.status = 'A' THEN 1 ELSE 0 END) + 
--         SUM(CASE WHEN tc.status = 'HD' THEN 0.5 ELSE 0 END)) AS PaidDays
--    FROM 
--        dbo.time_card tc
--    GROUP BY 
--        tc.pn_EmployeeID, YEAR(tc.dates), MONTH(tc.dates)
--    HAVING COUNT(DISTINCT MONTH(tc.dates)) > 0;

--    -- Create a temporary table to store Gross Salary Data
--    CREATE TABLE #GrossSalaryData (
--        pn_CompanyID INT,
--        pn_BranchID INT,
--        Employee_Full_Name NVARCHAR(100),
--        EmployeeCode NVARCHAR(50),
--        pn_EmployeeID INT,
--        Basic_Salary DECIMAL(18, 2),
--        Year INT,
--        Month INT,
--        TotalDays INT,
--        PaidDays INT,
--        AbsentDays DECIMAL(18, 2),
--        Earned_Basic DECIMAL(18, 2),
--        Gross_Salary DECIMAL(18, 2)
--    );

--    -- Insert data into #GrossSalaryData table
--    INSERT INTO #GrossSalaryData
--    SELECT 
--        emp.pn_CompanyID,
--        emp.pn_BranchID,
--        emp.Employee_Full_Name,
--        emp.EmployeeCode,
--        emp.pn_EmployeeID,
--        emp.Basic_Salary,
--        ad.Year,
--        ad.Month,
--        ad.TotalDays,
--        ad.PaidDays,
--        ad.AbsentDays,
--        CASE 
--            WHEN ad.TotalDays > 0 THEN 
--                (emp.Basic_Salary / ad.TotalDays) * ad.PaidDays
--            ELSE 0 
--        END AS Earned_Basic,
--        (
--            CASE 
--                WHEN ad.TotalDays > 0 THEN 
--                    (emp.Basic_Salary / ad.TotalDays) * ad.PaidDays
--                ELSE 0 
--            END +
--            SUM(CASE 
--                WHEN ea.d_order BETWEEN 1 AND 10 THEN
--                    CASE 
--                        WHEN ea.Prorata_basis = 'Y' THEN 
--                            (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
--                        ELSE ea.OriginalAmount
--                    END
--                ELSE 0
--            END)
--        ) AS Gross_Salary
--    FROM 
--        #EmployeeAllowances ea
--    JOIN 
--        #AttendanceData ad
--        ON ea.pn_EmployeeID = ad.pn_EmployeeID
--    JOIN 
--        [dbo].[paym_Employee] emp
--        ON emp.pn_EmployeeID = ea.pn_EmployeeID
--    GROUP BY 
--        emp.pn_CompanyID,
--        emp.pn_BranchID,
--        emp.Employee_Full_Name,
--        emp.EmployeeCode,
--        emp.pn_EmployeeID,
--        emp.Basic_Salary,
--        ad.Year,
--        ad.Month,
--        ad.TotalDays,
--        ad.PaidDays,
--        ad.AbsentDays;

--    -- Create a temporary table for Overtime Pay
--    CREATE TABLE #OvertimePay (
--        CompanyID INT,
--        BranchID INT,
--        EmployeeID INT,
--        EmployeeCode NVARCHAR(50),
--        EmployeeName NVARCHAR(50),
--        Month INT,
--        Year INT,
--        TotalOverTimePay DECIMAL(18, 2)
--    );

--    -- Insert data from DisplayOvertimePay into the temporary table
--    -- Step 1: Create a temporary table to store DisplayOvertimePay results
--    CREATE TABLE #OvertimePayTemp (
--        CompanyID INT,
--        BranchID INT,
--        EmployeeID INT,
--        EmployeeCode NVARCHAR(50),
--        EmployeeName NVARCHAR(50),
--        Month INT,
--        Year INT,
--        TotalOverTimePay DECIMAL(18, 2)
--    );

--    -- Step 2: Insert results from DisplayOvertimePay stored procedure into the temporary table
--    INSERT INTO #OvertimePayTemp
--    EXEC dbo.DisplayOvertimePay;

--    -- Step 3: Now use #OvertimePayTemp for the final SELECT
--    INSERT INTO #OvertimePay
--    SELECT * FROM #OvertimePayTemp;

--    -- Create a temporary table for Total Deductions
--    CREATE TABLE #TotalDeductions (
--        pn_CompanyID INT,
--        pn_BranchID INT,
--        Year INT,
--        Month INT,
--        EmployeeCode NVARCHAR(50),
--		PT_Monthly_Amount DECIMAL(18,2),
--		TOTALESI DECIMAL(18,2),
--		TotalPFContribution DECIMAL(18,2),
--        TotalDeductionAmount DECIMAL(18, 2)
--    );

--    -- Insert data from CalculateTotalDeductions into the temporary table
--    INSERT INTO #TotalDeductions
--    EXEC dbo.CalculateTotalDeductions;

--    -- Final result with Attendance Bonus, Overtime Pay, and Total Deductions
--    SELECT 
--        gs.pn_CompanyID,
--        gs.pn_BranchID,
--        gs.Employee_Full_Name,
--        gs.EmployeeCode,
--        gs.pn_EmployeeID,
--        gs.Year,
--        gs.Month,
--        gs.Gross_Salary,
--        ab.Attendance_Bonus_Value,
--        otp.TotalOverTimePay,
--        td.TotalDeductionAmount,
--        (gs.Gross_Salary + ISNULL(ab.Attendance_Bonus_Value, 0) + ISNULL(otp.TotalOverTimePay, 0) - ISNULL(td.TotalDeductionAmount, 0)) AS Net_Salary
--    FROM 
--        #GrossSalaryData gs
--    LEFT JOIN 
--        #AttendanceBonus ab
--    ON 
--        gs.pn_CompanyID = ab.pn_CompanyID
--        AND gs.pn_BranchID = ab.pn_BranchID
--        AND gs.EmployeeCode = ab.EmployeeCode
--        AND gs.Year = ab.Year
--        AND gs.Month = ab.Month
--    LEFT JOIN 
--        #OvertimePay otp
--    ON 
--        gs.pn_CompanyID = otp.CompanyID
--        AND gs.pn_BranchID = otp.BranchID
--        AND gs.EmployeeCode = otp.EmployeeCode
--        AND gs.Year = otp.Year
--        AND gs.Month = otp.Month
--    LEFT JOIN 
--        #TotalDeductions td
--    ON 
--        gs.pn_CompanyID = td.pn_CompanyID
--        AND gs.pn_BranchID = td.pn_BranchID
--        AND gs.EmployeeCode = td.EmployeeCode
--        AND gs.Year = td.Year
--        AND gs.Month = td.Month
--    ORDER BY 
--        gs.Year, gs.Month, gs.pn_EmployeeID;

--    -- Drop the temporary tables
--    DROP TABLE #AttendanceBonus;
--    DROP TABLE #EmployeeAllowances;
--    DROP TABLE #AttendanceData;
--    DROP TABLE #GrossSalaryData;
--    DROP TABLE #OvertimePayTemp; -- Drop the temporary table for OvertimePay
--    DROP TABLE #OvertimePay; -- Drop the final OvertimePay table
--    DROP TABLE #TotalDeductions; -- Drop the Total Deductions table
--END;
--GO
--/****** Object:  StoredProcedure [dbo].[sp_GetAllowanceValues]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE PROCEDURE [dbo].[sp_GetAllowanceValues]
--    @pn_companyid INT = NULL,
--    @pn_branchid INT = NULL
--AS
--BEGIN
--    SET NOCOUNT ON;

--    SELECT 
--        av.pn_companyid,
--        av.pn_branchid,
--        e.Employee_Full_Name,
--        e.EmployeeCode,
--        av.Grade_Name,
--        av.Level_Name,
--        av.v_EarningsName,
--        CASE 
--            WHEN av.Allowancetype = 'Fixed' THEN av.value
--            WHEN av.Cal_Based_on = 'CTC' THEN (e.CTC * av.value / 100)
--            WHEN av.Cal_Based_on = 'BasicPay' THEN (e.Basic_Salary * av.value / 100)
--            ELSE 0
--        END AS Amount,
--        av.d_order
--    FROM 
--        [dbo].[AllowanceValues] av
--    JOIN 
--        [dbo].[paym_Employee] e
--        ON av.Grade_Name = e.Grade
--        OR av.Level_Name = e.Grade
--    WHERE 
--        (@pn_companyid IS NULL OR av.pn_companyid = @pn_companyid) -- Filter by company ID if provided
--        AND (@pn_branchid IS NULL OR av.pn_branchid = @pn_branchid) -- Filter by branch ID if provided
--        AND av.pn_branchid = e.pn_BranchID -- Ensure they belong to the same branch
--        AND av.Allowancetype IN ('Fixed', 'Percentage') -- Check allowance type
--        AND NOT (av.c_Regular = 'N' AND av.payslip = 'N') -- Exclude rows where both c_Regular and payslip are 'N'
--    ORDER BY 
--        av.d_order;
--END;

--GO
--/****** Object:  StoredProcedure [dbo].[UpdatedTimecard]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE PROCEDURE [dbo].[UpdatedTimecard]
--AS
--BEGIN
--    SELECT 
--        e.pn_companyid,
--        e.pn_branchid,
--        e.employeecode,
--        e.employee_full_name,
--        s.shift_code,
--        GETDATE() AS currentDate, -- Changed alias to avoid reserved word conflict
--        FORMAT(GETDATE(), 'dddd') AS currentDay, -- Changed alias to avoid reserved word conflict
--        s.start_time,
--        s.end_time
--    FROM 
--        paym_Employee e 
--    JOIN 
--        shift_details s ON e.pn_branchid = s.pn_branchid
--    WHERE 
--        s.shift_code = (
--            SELECT 
--                shift_code 
--            FROM 
--                shift_month 
--            WHERE 
--                pn_Employeecode = e.EmployeeCode 
--                AND monthyear = FORMAT(GETDATE(), 'MM-yyyy')
--        );
--END;

--GO
--/****** Object:  StoredProcedure [dbo].[UpdateESIContributionsInPaybill]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE PROCEDURE [dbo].[UpdateESIContributionsInPaybill]
--AS
--BEGIN
--    -- Temporary table to hold the results from the ESI calculation
--    DECLARE @ESIResults TABLE (
--        pn_companyid INT,
--        pn_branchid INT,
--        Year INT,
--        Month INT,
--        Employee_Full_Name NVARCHAR(255),
--        EmployeeCode NVARCHAR(50),
--        Earned_Basic_Salary FLOAT,
--        Total_Allowance_Amt FLOAT,
--        Gross_Salary FLOAT,
--        Total_Days INT,
--        Paid_Days INT,
--        Employee_Contribution FLOAT,
--        Employer_Contribution FLOAT,
--        Employee_ESI_Contribution FLOAT,
--        Employer_ESI_Contribution FLOAT,
--        Total_ESI_Contribution FLOAT,
--        ESI_D_Order INT,
--        Type NVARCHAR(50)
--    );

--    -- Insert the results from the ESI calculation into the temporary table
--    INSERT INTO @ESIResults (
--        pn_companyid, pn_branchid, Year, Month, Employee_Full_Name, EmployeeCode,
--        Earned_Basic_Salary, Total_Allowance_Amt, Gross_Salary, Total_Days, Paid_Days,
--        Employee_Contribution, Employer_Contribution, Employee_ESI_Contribution,
--        Employer_ESI_Contribution, Total_ESI_Contribution, ESI_D_Order, Type
--    )
--    EXEC CalculateGrossSalaryAndESIwithprorata;

--    -- Update the paym_paybill table with the ESI contributions
--    UPDATE pb
--    SET 
--        pb.Deduction1 = CASE WHEN e.ESI_D_Order = 1 THEN e.Type ELSE NULL END,
--        pb.valueA1 = CASE WHEN e.ESI_D_Order = 1 THEN e.Total_ESI_Contribution ELSE 0 END,
--        pb.Deduction2 = CASE WHEN e.ESI_D_Order = 2 THEN e.Type ELSE NULL END,
--        pb.valueA2 = CASE WHEN e.ESI_D_Order = 2 THEN e.Total_ESI_Contribution ELSE 0 END,
--        pb.Deduction3 = CASE WHEN e.ESI_D_Order = 3 THEN e.Type ELSE NULL END,
--        pb.valueA3 = CASE WHEN e.ESI_D_Order = 3 THEN e.Total_ESI_Contribution ELSE 0 END,
--        pb.Deduction4 = CASE WHEN e.ESI_D_Order = 4 THEN e.Type ELSE NULL END,
--        pb.valueA4 = CASE WHEN e.ESI_D_Order = 4 THEN e.Total_ESI_Contribution ELSE 0 END,
--        pb.Deduction5 = CASE WHEN e.ESI_D_Order = 5 THEN e.Type ELSE NULL END,
--        pb.valueA5 = CASE WHEN e.ESI_D_Order = 5 THEN e.Total_ESI_Contribution ELSE 0 END,
--        pb.Deduction6 = CASE WHEN e.ESI_D_Order = 6 THEN e.Type ELSE NULL END,
--        pb.valueA6 = CASE WHEN e.ESI_D_Order = 6 THEN e.Total_ESI_Contribution ELSE 0 END,
--        pb.Deduction7 = CASE WHEN e.ESI_D_Order = 7 THEN e.Type ELSE NULL END,
--        pb.valueA7 = CASE WHEN e.ESI_D_Order = 7 THEN e.Total_ESI_Contribution ELSE 0 END,
--        pb.Deduction8 = CASE WHEN e.ESI_D_Order = 8 THEN e.Type ELSE NULL END,
--        pb.valueA8 = CASE WHEN e.ESI_D_Order = 8 THEN e.Total_ESI_Contribution ELSE 0 END,
--        pb.Deduction9 = CASE WHEN e.ESI_D_Order = 9 THEN e.Type ELSE NULL END,
--        pb.valueA9 = CASE WHEN e.ESI_D_Order = 9 THEN e.Total_ESI_Contribution ELSE 0 END,
--        pb.Deduction10 = CASE WHEN e.ESI_D_Order = 10 THEN e.Type ELSE NULL END,
--        pb.valueA10 = CASE WHEN e.ESI_D_Order = 10 THEN e.Total_ESI_Contribution ELSE 0 END
--    FROM paym_paybill pb
--    JOIN @ESIResults e 
--        ON pb.EmployeeCode = e.EmployeeCode
--       AND pb.pn_CompanyID = e.pn_companyid
--       AND pb.pn_BranchID = e.pn_branchid
--       AND YEAR(pb.d_date) = e.Year
--       AND MONTH(pb.d_date) = e.Month
--    WHERE pb.Flag = 'M';  -- Only update rows where Flag is 'M'

--    -- No need to drop the table variable, SQL Server will clean it up automatically
--END;
--GO
--/****** Object:  StoredProcedure [dbo].[UpdatePTinpaybill]    Script Date: 31-10-2025 6.45.21 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
--CREATE PROCEDURE [dbo].[UpdatePTinpaybill]
--AS
--BEGIN
--    -- Step 1: Create a temporary table to hold the results from CheckCTCLimits
--    CREATE TABLE #CTCLimits (
--        pn_CompanyID INT,
--        pn_BranchID INT,
--        EmployeeCode NVARCHAR(50),
--        Employee_Full_Name NVARCHAR(100),
--        State NVARCHAR(50),
--        Lower_limit FLOAT,
--        Upper_limit NVARCHAR(10),
--        CTC FLOAT,
--        Annual_basis FLOAT,
--        Half_yearly FLOAT,
--        Monthly_Amount FLOAT,
--        d_order INT,
--        Type NVARCHAR(50)
--    );

--    -- Step 2: Insert the results from CheckCTCLimits into the temporary table
--    INSERT INTO #CTCLimits
--    EXEC CheckCTCLimits;

--    -- Step 3: Update the paym_paybill table based on the temporary table
--    UPDATE p
--    SET 
--        Deduction1 = CASE WHEN c.d_order = 1 THEN c.Type ELSE Deduction1 END,
--        valueA1 = CASE WHEN c.d_order = 1 THEN c.Monthly_Amount ELSE valueA1 END,
--        Deduction2 = CASE WHEN c.d_order = 2 THEN c.Type ELSE Deduction2 END,
--        valueA2 = CASE WHEN c.d_order = 2 THEN c.Monthly_Amount ELSE valueA2 END,
--        Deduction3 = CASE WHEN c.d_order = 3 THEN c.Type ELSE Deduction3 END,
--        valueA3 = CASE WHEN c.d_order = 3 THEN c.Monthly_Amount ELSE valueA3 END,
--        Deduction4 = CASE WHEN c.d_order = 4 THEN c.Type ELSE Deduction4 END,
--        valueA4 = CASE WHEN c.d_order = 4 THEN c.Monthly_Amount ELSE valueA4 END,
--        Deduction5 = CASE WHEN c.d_order = 5 THEN c.Type ELSE Deduction5 END,
--        valueA5 = CASE WHEN c.d_order = 5 THEN c.Monthly_Amount ELSE valueA5 END,
--        Deduction6 = CASE WHEN c.d_order = 6 THEN c.Type ELSE Deduction6 END,
--        valueA6 = CASE WHEN c.d_order = 6 THEN c.Monthly_Amount ELSE valueA6 END,
--        Deduction7 = CASE WHEN c.d_order = 7 THEN c.Type ELSE Deduction7 END,
--        valueA7 = CASE WHEN c.d_order = 7 THEN c.Monthly_Amount ELSE valueA7 END,
--        Deduction8 = CASE WHEN c.d_order = 8 THEN c.Type ELSE Deduction8 END,
--        valueA8 = CASE WHEN c.d_order = 8 THEN c.Monthly_Amount ELSE valueA8 END,
--        Deduction9 = CASE WHEN c.d_order = 9 THEN c.Type ELSE Deduction9 END,
--        valueA9 = CASE WHEN c.d_order = 9 THEN c.Monthly_Amount ELSE valueA9 END,
--        Deduction10 = CASE WHEN c.d_order = 10 THEN c.Type ELSE Deduction10 END,
--        valueA10 = CASE WHEN c.d_order = 10 THEN c.Monthly_Amount ELSE valueA10 END
--    FROM paym_paybill p
--    INNER JOIN #CTCLimits c 
--        ON p.pn_CompanyID = c.pn_CompanyID
--        AND p.pn_BranchID = c.pn_BranchID
--        AND p.EmployeeCode = c.EmployeeCode
--    WHERE p.Flag = 'M';  -- Only update rows where Flag is 'M'

--    -- Step 4: Drop the temporary table
--    DROP TABLE #CTCLimits;
--END;
--GO
--USE [master]
--GO










CREATE FUNCTION [dbo].[Total_PF]()
RETURNS @ResultTable TABLE (
    pn_companyid INT,
    pn_branchid INT,
    emp_code NVARCHAR(50),
    emp_name NVARCHAR(100),
    basic_salary DECIMAL(18, 2),
    Level_Name NVARCHAR(50),
    PF CHAR(1),
    Month NVARCHAR(2), -- New column for Month
    Year NVARCHAR(4),  -- New column for Year
    Absent INT,
    Present INT,
    Leave INT,
    Holiday INT,
    Work_From_Home INT,
    HalfDay INT,
    WeekOff INT,
    PaidDays INT,
    TotalDaysInMonth INT,
    [Fix Amount] DECIMAL(18, 2),
    [Earn Amt] DECIMAL(18, 2),
    [Total Earn Amount] DECIMAL(18, 2),
    PF_Contribution DECIMAL(18, 0),
    EPF_Contribution DECIMAL(18, 0),
    EPS_Contribution DECIMAL(18, 0),
    Total_Contribution DECIMAL(18, 0)
)
AS
BEGIN
    WITH PF_Settings_CTE AS (
        SELECT 
            pn_CompanyID,
            [PF_Contribution(%)] AS PF_Contribution,
            [EPF_Contribution(%)] AS EPF_Contribution,
            [EPS_Contribution(%)] AS EPS_Contribution,
            [Max_Ceiling] AS MaxCeiling,
            [Eligibility_Amount] AS EligibilityAmount,
            [Upper_Limit] AS UpperLimit
        FROM 
            [dbo].[PF_Settings]
    ),
    PaidDays AS (
        SELECT 
            tc.emp_code,
            tc.emp_name,
            tc.pn_branchid,
            tc.pn_companyid,
            tc.shift_code,
            SUM(CASE WHEN tc.status = 'A' THEN 1 ELSE 0 END) AS Absent,
            SUM(CASE WHEN tc.status = 'P' THEN 1 ELSE 0 END) AS Present,
            SUM(CASE WHEN tc.status = 'L' THEN 1 ELSE 0 END) AS Leave,
            SUM(CASE WHEN tc.status = 'H' THEN 1 ELSE 0 END) AS Holiday,
            SUM(CASE WHEN tc.status = 'WFH' THEN 1 ELSE 0 END) AS Work_From_Home,
            SUM(CASE WHEN tc.status = 'HD' THEN 0.5 ELSE 0 END) AS HalfDay,
            SUM(CASE WHEN tc.status = 'W' THEN 1 ELSE 0 END) AS WeekOff,
            SUM(CASE WHEN tc.status IN ('P', 'L', 'H', 'WFH', 'W') THEN 1 ELSE 0 END) + 
            SUM(CASE WHEN tc.status = 'HD' THEN 0.5 ELSE 0 END) AS PaidDays,
            COUNT(DISTINCT tc.dates) AS TotalDaysInMonth,
            FORMAT(tc.dates, 'yyyy-MM') AS MonthYear,
            MONTH(tc.dates) AS Month, -- Extract Month
            YEAR(tc.dates) AS Year    -- Extract Year
        FROM 
            [dbo].[time_card] tc
        GROUP BY 
            tc.emp_code, 
            tc.emp_name, 
            tc.pn_branchid, 
            tc.pn_companyid, 
            tc.shift_code,
            FORMAT(tc.dates, 'yyyy-MM'),
            MONTH(tc.dates),
            YEAR(tc.dates)
    ),
    AllowanceCalculations AS (
        SELECT 
            av.pn_companyid,
            av.pn_branchid,
            e.EmployeeCode AS emp_code,
            e.Employee_Full_Name AS emp_name,
            e.basic_salary,
            av.Level_Name,
            av.v_EarningsName,
            av.value AS TotalPercentage,
            aset.Prorata_basis,
            aset.PF,
            pd.PaidDays,
            pd.TotalDaysInMonth,
            pd.Absent,
            pd.Present,
            pd.Leave,
            pd.Holiday,
            pd.Work_From_Home,
            pd.HalfDay,
            pd.WeekOff,
            pd.MonthYear,  
            pd.Month,  -- Include Month
            pd.Year,   -- Include Year
            pf.MaxCeiling,
            pf.UpperLimit,
            pf.PF_Contribution,
            pf.EPF_Contribution,
            pf.EPS_Contribution,
            -- Fixed Allowance Calculation
            CASE 
                WHEN av.Allowancetype = 'Fixed' THEN av.value
                WHEN av.Cal_Based_on = 'CTC' THEN (e.CTC * av.value / 100)
                WHEN av.Cal_Based_on = 'BasicPay' THEN (e.Basic_Salary * av.value / 100) 
                ELSE 0
            END AS FixedAmount
        FROM 
            [dbo].[AllowanceValues] av
        JOIN 
            [dbo].[paym_Employee] e
            ON av.Grade_Name = e.Grade
            OR av.Level_Name = e.Grade
        JOIN 
            PaidDays pd
            ON pd.emp_code = e.EmployeeCode 
            AND pd.pn_branchid = av.pn_branchid
        JOIN [dbo].[AllowanceSettings] aset
            ON av.v_EarningsName = aset.v_EarningsName
            AND av.pn_companyid = aset.pn_CompanyID
            AND av.pn_branchid = aset.pn_branchID
        JOIN PF_Settings_CTE pf
            ON av.pn_companyid = pf.pn_CompanyID
        GROUP BY
            av.pn_companyid,
            av.pn_branchid,
            e.EmployeeCode,
            e.Employee_Full_Name,
            e.basic_salary,
            av.Level_Name,
            av.v_EarningsName,
            av.value,
            aset.Prorata_basis,
            aset.PF,
            pd.PaidDays,
            pd.TotalDaysInMonth,
            pd.Absent,
            pd.Present,
            pd.Leave,
            pd.Holiday,
            pd.Work_From_Home,
            pd.HalfDay,
            pd.WeekOff,
            pd.MonthYear,
            pd.Month,  -- Group by Month
            pd.Year,   -- Group by Year
            pf.MaxCeiling,
            pf.UpperLimit,
            pf.PF_Contribution,
            pf.EPF_Contribution,
            pf.EPS_Contribution,
            av.Allowancetype,          
            av.Cal_Based_on,          
            e.CTC                     
    ),
    FilteredResults AS (
        SELECT 
            *,
            COUNT(CASE WHEN PF = 'Y' THEN 1 END) OVER (PARTITION BY MonthYear) AS YCount
        FROM 
            AllowanceCalculations
    )
    INSERT INTO @ResultTable
    SELECT 
        pn_companyid,
        pn_branchid,
        emp_code,
        emp_name,
        basic_salary,
        Level_Name,
        PF,
        Month,  -- New Month column
        Year,   -- New Year column
        Absent,
        Present,
        Leave,
        Holiday,
        Work_From_Home,
        HalfDay,
        WeekOff,
        PaidDays,
        TotalDaysInMonth,

        SUM(CASE 
            WHEN PF = 'Y' AND Prorata_basis = 'Y' THEN 
                FixedAmount * PaidDays / TotalDaysInMonth
            WHEN PF = 'Y' AND Prorata_basis = 'N' THEN 
                FixedAmount
            ELSE 
                0
        END) AS [Fix Amount],
        
        (basic_salary * PaidDays / TotalDaysInMonth) AS [Earn Amt], 

        (SUM(CASE 
            WHEN PF = 'Y' AND Prorata_basis = 'N' THEN FixedAmount
            ELSE 0
        END) + 
        (basic_salary + 
            SUM(CASE WHEN FixedAmount > 0 AND PF = 'Y' AND Prorata_basis = 'Y' THEN FixedAmount ELSE 0 END)) * PaidDays / TotalDaysInMonth) AS [Total Earn Amount], 
        
        CASE 
            WHEN MaxCeiling = 'Yes' THEN 
                ROUND(UpperLimit * PF_Contribution / 100, 0)
            ELSE 
                CASE 
                    WHEN PF = 'Y' THEN 
                        ROUND((SUM(CASE 
                            WHEN PF = 'Y' AND Prorata_basis = 'N' THEN FixedAmount
                            ELSE 0
                        END) + 
                        (basic_salary + 
                            SUM(CASE WHEN FixedAmount > 0 AND PF = 'Y' AND Prorata_basis = 'Y' THEN FixedAmount ELSE 0 END)) * PaidDays / TotalDaysInMonth) * PF_Contribution / 100, 0)
                    ELSE 
                        ROUND(basic_salary * PF_Contribution / 100, 0)
                END
        END AS PF_Contribution,

        CASE 
            WHEN MaxCeiling = 'Yes' THEN 
                ROUND(UpperLimit * EPF_Contribution / 100, 0)
            ELSE 
                CASE 
                    WHEN PF = 'Y' THEN 
                        ROUND((SUM(CASE 
                            WHEN PF = 'Y' AND Prorata_basis = 'N' THEN FixedAmount
                            ELSE 0
                        END) + 
                        (basic_salary + 
                            SUM(CASE WHEN FixedAmount > 0 AND PF = 'Y' AND Prorata_basis = 'Y' THEN FixedAmount ELSE 0 END)) * PaidDays / TotalDaysInMonth) * EPF_Contribution / 100, 0)
                    ELSE 
                        ROUND(basic_salary * EPF_Contribution / 100, 0)
                END
        END AS EPF_Contribution,

        CASE 
            WHEN MaxCeiling = 'Yes' THEN 
                ROUND(UpperLimit * EPS_Contribution / 100, 0)
            ELSE 
                CASE 
                    WHEN PF = 'Y' THEN 
                        ROUND((SUM(CASE 
                            WHEN PF = 'Y' AND Prorata_basis = 'N' THEN FixedAmount
                            ELSE 0
                        END) + 
                        (basic_salary + 
                            SUM(CASE WHEN FixedAmount > 0 AND PF = 'Y' AND Prorata_basis = 'Y' THEN FixedAmount ELSE 0 END)) * PaidDays / TotalDaysInMonth) * EPS_Contribution / 100, 0)
                    ELSE 
                        ROUND(basic_salary * EPS_Contribution / 100, 0)
                END
        END AS EPS_Contribution,

        -- New column for total contributions
        CASE 
            WHEN MaxCeiling = 'Yes' THEN 
                ROUND(UpperLimit * (PF_Contribution + EPF_Contribution + EPS_Contribution) / 100, 0)
            ELSE 
                CASE 
                    WHEN PF = 'Y' THEN 
                        ROUND((SUM(CASE 
                            WHEN PF = 'Y' AND Prorata_basis = 'N' THEN FixedAmount
                            ELSE 0
                        END) + 
                        (basic_salary + 
                            SUM(CASE WHEN FixedAmount > 0 AND PF = 'Y' AND Prorata_basis = 'Y' THEN FixedAmount ELSE 0 END)) * PaidDays / TotalDaysInMonth) * (PF_Contribution + EPF_Contribution + EPS_Contribution) / 100, 0)
                    ELSE 
                        ROUND(basic_salary * (PF_Contribution + EPF_Contribution + EPS_Contribution) / 100, 0)
                END
        END AS Total_Contribution

    FROM 
        FilteredResults
    WHERE 
        (YCount > 0 AND PF = 'Y') OR (YCount = 0 AND PF = 'N')
    GROUP BY 
        pn_companyid,
        pn_branchid,
        emp_code,
        emp_name,
        basic_salary,
        Level_Name,
        PF,
        Month,  -- Group by Month
        Year,   -- Group by Year
        Absent,
        Present,
        Leave,
        Holiday,
        Work_From_Home,
        HalfDay,
        WeekOff,
        PaidDays,
        TotalDaysInMonth,
        MaxCeiling,
        UpperLimit,
        PF_Contribution,
        EPF_Contribution,
        EPS_Contribution
    ORDER BY 
        emp_code, Year, Month, Level_Name; -- Order by Year and Month

    RETURN;
END;
GO
/****** Object:  UserDefinedFunction [dbo].[Total_PFdemo]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE FUNCTION [dbo].[Total_PFdemo]()
RETURNS @ResultTable TABLE (
    pn_companyid INT,
    pn_branchid INT,
    emp_code NVARCHAR(50),
    emp_name NVARCHAR(100),
    pfno NVARCHAR(50), -- Added PF Number
    basic_salary DECIMAL(18, 2),
    Level_Name NVARCHAR(50),
    PF CHAR(1),
    Month NVARCHAR(2), -- New column for Month
    Year NVARCHAR(4),  -- New column for Year
    Absent INT,
    Present INT,
    Leave INT,
    Holiday INT,
    Work_From_Home INT,
    HalfDay INT,
    WeekOff INT,
    PaidDays INT,
    TotalDaysInMonth INT,
    [Fix Amount] DECIMAL(18, 2),
    [Earn Amt] DECIMAL(18, 2),
    [Total Earn Amount] DECIMAL(18, 2),
    PF_Contribution DECIMAL(18, 2),
    EPF_Contribution DECIMAL(18, 2),
    EPS_Contribution DECIMAL(18, 2),
    Total_Contribution DECIMAL(18, 2)
)
AS
BEGIN
    WITH PF_Settings_CTE AS (
        SELECT 
            pn_CompanyID,
            [PF_Contribution(%)] AS PF_Contribution,
            [EPF_Contribution(%)] AS EPF_Contribution,
            [EPS_Contribution(%)] AS EPS_Contribution,
            [Max_Ceiling] AS MaxCeiling,
            [Eligibility_Amount] AS EligibilityAmount,
            [Upper_Limit] AS UpperLimit
        FROM 
            [dbo].[PF_Settings]
    ),
    PaidDays AS (
        SELECT 
            tc.emp_code,
            tc.emp_name,
            tc.pn_branchid,
            tc.pn_companyid,
            tc.shift_code,
            SUM(CASE WHEN tc.status = 'A' THEN 1 ELSE 0 END) AS Absent,
            SUM(CASE WHEN tc.status = 'P' THEN 1 ELSE 0 END) AS Present,
            SUM(CASE WHEN tc.status = 'L' THEN 1 ELSE 0 END) AS Leave,
            SUM(CASE WHEN tc.status = 'H' THEN 1 ELSE 0 END) AS Holiday,
            SUM(CASE WHEN tc.status = 'WFH' THEN 1 ELSE 0 END) AS Work_From_Home,
            SUM(CASE WHEN tc.status = 'HD' THEN 0.5 ELSE 0 END) AS HalfDay,
            SUM(CASE WHEN tc.status = 'W' THEN 1 ELSE 0 END) AS WeekOff,
            SUM(CASE WHEN tc.status IN ('P', 'L', 'H', 'WFH', 'W') THEN 1 ELSE 0 END) + 
            SUM(CASE WHEN tc.status = 'HD' THEN 0.5 ELSE 0 END) AS PaidDays,
            COUNT(DISTINCT tc.dates) AS TotalDaysInMonth,
            FORMAT(tc.dates, 'yyyy-MM') AS MonthYear,
            MONTH(tc.dates) AS Month, -- Extract Month
            YEAR(tc.dates) AS Year    -- Extract Year
        FROM 
            [dbo].[time_card] tc
        GROUP BY 
            tc.emp_code, 
            tc.emp_name, 
            tc.pn_branchid, 
            tc.pn_companyid, 
            tc.shift_code,
            FORMAT(tc.dates, 'yyyy-MM'),
            MONTH(tc.dates),
            YEAR(tc.dates)
    ),
    AllowanceCalculations AS (
        SELECT 
            av.pn_companyid,
            av.pn_branchid,
            e.EmployeeCode AS emp_code,
            e.Employee_Full_Name AS emp_name,
			            e.pfno, -- Added PF Number
            e.basic_salary,
            av.Level_Name,
            av.v_EarningsName,
            av.value AS TotalPercentage,
            aset.Prorata_basis,
            aset.PF,
            pd.PaidDays,
            pd.TotalDaysInMonth,
            pd.Absent,
            pd.Present,
            pd.Leave,
            pd.Holiday,
            pd.Work_From_Home,
            pd.HalfDay,
            pd.WeekOff,
            pd.MonthYear,  
            pd.Month,  -- Include Month
            pd.Year,   -- Include Year
            pf.MaxCeiling,
            pf.UpperLimit,
            pf.PF_Contribution,
            pf.EPF_Contribution,
            pf.EPS_Contribution,
            -- Fixed Allowance Calculation
            CASE 
                WHEN av.Allowancetype = 'Fixed' THEN av.value
                WHEN av.Cal_Based_on = 'CTC' THEN (e.CTC * av.value / 100)
                WHEN av.Cal_Based_on = 'BasicPay' THEN (e.Basic_Salary * av.value / 100) 
                ELSE 0
            END AS FixedAmount
        FROM 
            [dbo].[AllowanceValues] av
        JOIN 
            [dbo].[paym_Employee] e
            ON av.Grade_Name = e.Grade
            OR av.Level_Name = e.Grade
        JOIN 
            PaidDays pd
            ON pd.emp_code = e.EmployeeCode 
            AND pd.pn_branchid = av.pn_branchid
        JOIN [dbo].[AllowanceSettings] aset
            ON av.v_EarningsName = aset.v_EarningsName
            AND av.pn_companyid = aset.pn_CompanyID
            AND av.pn_branchid = aset.pn_branchID
        JOIN PF_Settings_CTE pf
            ON av.pn_companyid = pf.pn_CompanyID
        GROUP BY
            av.pn_companyid,
            av.pn_branchid,
            e.EmployeeCode,
            e.Employee_Full_Name,
		e.pfno, -- Added PF Number
            e.basic_salary,
            av.Level_Name,
            av.v_EarningsName,
            av.value,
            aset.Prorata_basis,
            aset.PF,
            pd.PaidDays,
            pd.TotalDaysInMonth,
            pd.Absent,
            pd.Present,
            pd.Leave,
            pd.Holiday,
            pd.Work_From_Home,
            pd.HalfDay,
            pd.WeekOff,
            pd.MonthYear,
            pd.Month,  -- Group by Month
            pd.Year,   -- Group by Year
            pf.MaxCeiling,
            pf.UpperLimit,
            pf.PF_Contribution,
            pf.EPF_Contribution,
            pf.EPS_Contribution,
            av.Allowancetype,          
            av.Cal_Based_on,          
            e.CTC                     
    ),
    FilteredResults AS (
        SELECT 
            *,
            COUNT(CASE WHEN PF = 'Y' THEN 1 END) OVER (PARTITION BY MonthYear) AS YCount
        FROM 
            AllowanceCalculations
    )
    INSERT INTO @ResultTable
    SELECT 
        pn_companyid,
        pn_branchid,
        emp_code,
        emp_name,
		        pfno, -- Added PF Number
        basic_salary,
        Level_Name,
        PF,
        Month,  -- New Month column
        Year,   -- New Year column
        Absent,
        Present,
        Leave,
        Holiday,
        Work_From_Home,
        HalfDay,
        WeekOff,
        PaidDays,
        TotalDaysInMonth,

        SUM(CASE 
            WHEN PF = 'Y' AND Prorata_basis = 'Y' THEN 
                FixedAmount * PaidDays / TotalDaysInMonth
            WHEN PF = 'Y' AND Prorata_basis = 'N' THEN 
                FixedAmount
            ELSE 
                0
        END) AS [Fix Amount],
        
        (basic_salary * PaidDays / TotalDaysInMonth) AS [Earn Amt], 

        (SUM(CASE 
            WHEN PF = 'Y' AND Prorata_basis = 'N' THEN FixedAmount
            ELSE 0
        END) + 
        (basic_salary + 
            SUM(CASE WHEN FixedAmount > 0 AND PF = 'Y' AND Prorata_basis = 'Y' THEN FixedAmount ELSE 0 END)) * PaidDays / TotalDaysInMonth) AS [Total Earn Amount], 
        
                       CASE 
            WHEN MaxCeiling = 'Yes' THEN 
                ROUND(CAST(UpperLimit AS DECIMAL(18,2)) * PF_Contribution / 100, 2)
            ELSE 
                CASE 
                    WHEN PF = 'Y' THEN 
                        ROUND((SUM(CASE 
                            WHEN PF = 'Y' AND Prorata_basis = 'N' THEN FixedAmount
                            ELSE 0
                        END) + 
                        (basic_salary + 
                            SUM(CASE WHEN FixedAmount > 0 AND PF = 'Y' AND Prorata_basis = 'Y' THEN FixedAmount ELSE 0 END)) * PaidDays / TotalDaysInMonth) * PF_Contribution / 100, 2)
                    ELSE 
                        ROUND(basic_salary * PF_Contribution / 100, 2)
                END
        END AS PF_Contribution,

        CASE 
            WHEN MaxCeiling = 'Yes' THEN 
                ROUND(CAST(UpperLimit AS DECIMAL(18,2)) * EPF_Contribution / 100, 2)
            ELSE 
                CASE 
                    WHEN PF = 'Y' THEN 
                        ROUND((SUM(CASE 
                            WHEN PF = 'Y' AND Prorata_basis = 'N' THEN FixedAmount
                            ELSE 0
                        END) + 
                        (basic_salary + 
                            SUM(CASE WHEN FixedAmount > 0 AND PF = 'Y' AND Prorata_basis = 'Y' THEN FixedAmount ELSE 0 END)) * PaidDays / TotalDaysInMonth) * EPF_Contribution / 100, 2)
                    ELSE 
                        ROUND(basic_salary * EPF_Contribution / 100, 2)
                END
        END AS EPF_Contribution,

        CASE 
            WHEN MaxCeiling = 'Yes' THEN 
                ROUND(CAST(UpperLimit AS DECIMAL(18,2)) * EPS_Contribution / 100, 2)
            ELSE 
                CASE 
                    WHEN PF = 'Y' THEN 
                        ROUND((SUM(CASE 
                            WHEN PF = 'Y' AND Prorata_basis = 'N' THEN FixedAmount
                            ELSE 0
                        END) + 
                        (basic_salary + 
                            SUM(CASE WHEN FixedAmount > 0 AND PF = 'Y' AND Prorata_basis = 'Y' THEN FixedAmount ELSE 0 END)) * PaidDays / TotalDaysInMonth) * EPS_Contribution / 100, 2)
                    ELSE 
                        ROUND(basic_salary * EPS_Contribution / 100, 2)
                END
        END AS EPS_Contribution,

        -- New column for total contributions
        CASE 
            WHEN MaxCeiling = 'Yes' THEN 
                ROUND(UpperLimit * (PF_Contribution + EPF_Contribution + EPS_Contribution) / 100, 2)
            ELSE 
                CASE 
                    WHEN PF = 'Y' THEN 
                        ROUND((SUM(CASE 
                            WHEN PF = 'Y' AND Prorata_basis = 'N' THEN FixedAmount
                            ELSE 0
                        END) + 
                        (basic_salary + 
                            SUM(CASE WHEN FixedAmount > 0 AND PF = 'Y' AND Prorata_basis = 'Y' THEN FixedAmount ELSE 0 END)) * PaidDays / TotalDaysInMonth) * (PF_Contribution + EPF_Contribution + EPS_Contribution) / 100, 2)
                    ELSE 
                        ROUND(basic_salary * (PF_Contribution + EPF_Contribution + EPS_Contribution) / 100, 2)
                END
        END AS Total_Contribution

    FROM 
        FilteredResults
    WHERE 
        (YCount > 0 AND PF = 'Y') OR (YCount = 0 AND PF = 'N')
    GROUP BY 
        pn_companyid,
        pn_branchid,
        emp_code,
        emp_name,
		pfno,
        basic_salary,
        Level_Name,
        PF,
        Month,  -- Group by Month
        Year,   -- Group by Year
        Absent,
        Present,
        Leave,
        Holiday,
        Work_From_Home,
        HalfDay,
        WeekOff,
        PaidDays,
        TotalDaysInMonth,
        MaxCeiling,
        UpperLimit,
        PF_Contribution,
        EPF_Contribution,
        EPS_Contribution
    ORDER BY 
        emp_code, Year, Month, Level_Name; -- Order by Year and Month

    RETURN;
END;

GO
/****** Object:  Table [dbo].[Allowancesettings]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Allowancesettings](
	[pn_CompanyID] [int] NOT NULL,
	[pn_BranchID] [int] NULL,
	[v_EarningsName] [varchar](40) NULL,
	[c_OT] [char](1) NULL,
	[Prorata_basis] [char](1) NULL,
	[d_order] [int] NULL,
	[PF] [char](1) NULL,
	[ESI] [char](1) NULL,
	[h] [char](1) NULL,
	[rtg] [char](1) NULL,
	[uyjtyu] [char](1) NULL,
	[hbib] [char](1) NULL,
	[nbkbk] [char](1) NULL,
	[wedlfknon] [char](1) NULL,
	[kbkjb_k] [char](1) NULL,
	[kbk_k] [char](1) NULL,
	[iojoj] [char](1) NULL,
	[jijnini] [char](1) NULL,
	[fea] [char](1) NULL,
	[Internet] [char](1) NULL,
	[Travel] [char](1) NULL,
	[Cab] [char](1) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AllowanceValues]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AllowanceValues](
	[pn_companyid] [int] NOT NULL,
	[pn_branchid] [int] NOT NULL,
	[Grade_Name] [varchar](30) NULL,
	[Level_Name] [varchar](30) NULL,
	[v_EarningsName] [varchar](40) NULL,
	[Allowancetype] [varchar](20) NULL,
	[Cal_Based_on] [varchar](20) NULL,
	[value] [float] NULL,
	[c_Regular] [char](1) NULL,
	[payslip] [char](1) NULL,
	[PayMonth] [varchar](20) NULL,
	[d_order] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[time_card]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[time_card](
	[Sno] [int] IDENTITY(1,1) NOT NULL,
	[pn_companyid] [int] NULL,
	[pn_branchid] [int] NULL,
	[emp_code] [varchar](10) NULL,
	[emp_name] [varchar](50) NULL,
	[shift_code] [varchar](5) NULL,
	[dates] [datetime] NULL,
	[days] [varchar](15) NULL,
	[intime] [time](7) NULL,
	[break_out] [time](7) NULL,
	[break_in] [time](7) NULL,
	[early_out] [time](7) NULL,
	[outtime] [time](7) NULL,
	[Late_in] [time](7) NULL,
	[Late_out] [time](7) NULL,
	[ot_hrs] [time](7) NULL,
	[status] [varchar](5) NULL,
	[leave_code] [varchar](20) NULL,
	[data] [char](1) NULL,
	[pn_EmployeeID] [varchar](20) NULL,
	[flag] [char](1) NULL,
PRIMARY KEY CLUSTERED 
(
	[Sno] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[paym_Employee]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[paym_Employee](
	[pn_CompanyID] [int] NOT NULL,
	[pn_BranchID] [int] NOT NULL,
	[pn_EmployeeID] [int] IDENTITY(1,1) NOT NULL,
	[EmployeeCode] [varchar](50) NULL,
	[Employee_First_Name] [varchar](50) NULL,
	[Employee_Middle_Name] [varchar](50) NULL,
	[Employee_Last_Name] [varchar](50) NULL,
	[DateofBirth] [datetime] NULL,
	[Password] [varchar](20) NULL,
	[Gender] [varchar](20) NULL,
	[status] [nvarchar](20) NULL,
	[Employee_Full_Name] [varchar](70) NULL,
	[Readerid] [varchar](100) NULL,
	[OT_Eligible] [varchar](100) NULL,
	[Pfno] [varchar](20) NULL,
	[Esino] [varchar](20) NULL,
	[OT_calc] [float] NULL,
	[CTC] [float] NULL,
	[basic_salary] [float] NULL,
	[Bank_code] [varchar](10) NULL,
	[Bank_Name] [varchar](30) NULL,
	[Branch_Name] [varchar](30) NULL,
	[Account_Type] [varchar](20) NULL,
	[MICR_code] [varchar](20) NULL,
	[IFSC_Code] [varchar](20) NULL,
	[Other_Info] [varchar](100) NULL,
	[Reporting_person] [varchar](50) NULL,
	[ReportingID] [varchar](100) NULL,
	[Reporting_email] [varchar](50) NULL,
	[Pan_no] [varchar](20) NULL,
	[salary_type] [varchar](50) NULL,
	[TDS_Applicable] [varchar](100) NULL,
	[Flag] [varchar](1) NULL,
	[role] [varchar](100) NULL,
	[accountNo] [varchar](50) NULL,
	[Blood_Group] [varchar](20) NULL,
	[Phone_No] [varchar](20) NULL,
	[Alternate_Phone_No] [varchar](20) NULL,
	[permanent_address] [varchar](200) NULL,
	[Aadhar_Card] [varchar](20) NULL,
	[Current_Address] [varchar](200) NULL,
	[Father_Name] [varchar](200) NULL,
	[Email] [varchar](100) NULL,
	[Alternate_Email] [varchar](100) NULL,
	[Grade] [varchar](30) NULL,
	[Overall_Experience] [float] NULL,
	[HighestQualification] [varchar](100) NULL,
	[UniversityName] [varchar](100) NULL,
	[YearOfPassing] [varchar](100) NULL,
	[Certifications] [nvarchar](255) NULL,
	[Skills] [nvarchar](max) NULL,
	[UAN] [varchar](25) NULL,
	[PaymentMode] [varchar](100) NULL,
	[PassportNumber] [varchar](20) NULL,
	[VisaDetails] [varchar](200) NULL,
	[JoiningDate] [date] NULL,
	[ExitReason] [varchar](100) NULL,
	[PreviousCompany] [varchar](100) NULL,
	[PreviousDesignation] [varchar](100) NULL,
	[PreviousEmploymentDuration] [varchar](50) NULL,
	[ReasonForLeaving] [varchar](255) NULL,
	[PerformanceRating] [decimal](3, 2) NULL,
	[TrainingRecords] [varchar](255) NULL,
	[DisciplinaryActions] [varchar](255) NULL,
	[Awards] [varchar](255) NULL,
	[VehicleDetails] [varchar](255) NULL,
	[HealthInsuranceDetails] [varchar](255) NULL,
	[NomineeDetails] [varchar](255) NULL,
	[Asset_Name] [varchar](100) NULL,
	[Asset_SerialNumber] [varchar](100) NULL,
	[NomineePhoneno] [varchar](20) NULL,
	[NomineeRelationship] [varchar](30) NULL,
	[ExitDate] [date] NULL,
	[AssetType] [varchar](40) NULL,
 CONSTRAINT [pk_paym_Employee] PRIMARY KEY CLUSTERED 
(
	[pn_CompanyID] ASC,
	[pn_BranchID] ASC,
	[pn_EmployeeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  UserDefinedFunction [dbo].[GetEmployeeAllowancesWithFinalOTDisplay]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE FUNCTION [dbo].[GetEmployeeAllowancesWithFinalOTDisplay]()
RETURNS TABLE
AS
RETURN
(
    WITH EmployeeAllowances AS (
        SELECT DISTINCT
            e.pn_CompanyID,
            e.pn_BranchID,
            e.Employee_Full_Name,
            e.EmployeeCode,
            e.pn_EmployeeID,
            av.Grade_Name,
            av.Level_Name,
            av.v_EarningsName,
            av.Allowancetype,
            av.Cal_Based_on,
            CASE 
                WHEN av.Allowancetype = 'Fixed' THEN av.value
                WHEN av.Allowancetype = 'Percentage' AND av.Cal_Based_on = 'CTC' THEN (e.CTC * av.value / 100.0)
                WHEN av.Allowancetype = 'Percentage' AND av.Cal_Based_on = 'BasicPay' THEN (e.Basic_Salary * av.value / 100.0)
                ELSE 0
            END AS OriginalAmount,
            aset.Prorata_basis,
            aset.c_OT,
            av.d_order
        FROM 
            [dbo].[AllowanceValues] av
        JOIN 
            [dbo].[paym_Employee] e
            ON av.Grade_Name = e.Grade
            OR av.Level_Name = e.Grade
        LEFT JOIN (
            SELECT 
                pn_CompanyID, pn_BranchID, v_EarningsName, 
                MAX(Prorata_basis) AS Prorata_basis,
                MAX(c_OT) AS c_OT
            FROM 
                [dbo].[Allowancesettings]
            GROUP BY 
                pn_CompanyID, pn_BranchID, v_EarningsName
        ) aset
        ON av.pn_companyid = aset.pn_CompanyID
        AND av.pn_branchid = aset.pn_BranchID
        AND av.v_EarningsName = aset.v_EarningsName
        WHERE 
            av.pn_branchid = e.pn_BranchID
            AND av.Allowancetype IN ('Fixed', 'Percentage')
            AND NOT (av.c_Regular = 'N' AND av.payslip = 'N')
            AND (aset.c_OT = 'Y' OR aset.c_OT IS NULL)
    ),
    AbsentDays AS (
        SELECT 
            tc.emp_code,
            COUNT(CASE WHEN tc.Status = 'A' THEN 1 ELSE NULL END) AS FullDayAbsences,
            COUNT(CASE WHEN tc.Status = 'HD' THEN 1 ELSE NULL END) AS HalfDayAbsences,
            MAX(DATEPART(DAY, EOMONTH(tc.dates))) AS TotalDaysInMonth,
            DATEPART(YEAR, tc.dates) AS Year,
            DATEPART(MONTH, tc.dates) AS Month,
            COUNT(CASE WHEN tc.Status = 'A' THEN 1 ELSE NULL END) + 
            (COUNT(CASE WHEN tc.Status = 'HD' THEN 1 ELSE NULL END) * 0.5) AS TotalAbsentDays
        FROM 
            [dbo].[time_card] tc
        GROUP BY 
            tc.emp_code, DATEPART(YEAR, tc.dates), DATEPART(MONTH, tc.dates)
    )
    SELECT 
        ea.pn_CompanyID,
        ea.pn_BranchID,
        ea.pn_EmployeeID,
        ea.Employee_Full_Name,
        ea.EmployeeCode,
        ad.Year,
        ad.Month,
        ISNULL(ad.FullDayAbsences, 0) AS FullDayAbsences,
        ISNULL(ad.HalfDayAbsences, 0) AS HalfDayAbsences,
        ISNULL(ad.TotalDaysInMonth, 31) AS TotalDaysInMonth,
        ISNULL(ad.TotalAbsentDays, 0) AS TotalAbsentDays,
        (ISNULL(ad.TotalDaysInMonth, 31) - ISNULL(ad.TotalAbsentDays, 0)) AS PaidDays,
        COALESCE(SUM(
            CASE 
                WHEN ea.Prorata_basis = 'Y' THEN 
                    (ea.OriginalAmount / ISNULL(ad.TotalDaysInMonth, 31)) * 
                    (ISNULL(ad.TotalDaysInMonth, 31) - ISNULL(ad.TotalAbsentDays, 0))
                ELSE 
                    ea.OriginalAmount
            END
        ), 0) AS TotalAllowance
    FROM 
        EmployeeAllowances ea
    LEFT JOIN 
        AbsentDays ad
        ON ea.EmployeeCode = ad.emp_code
    WHERE 
        ea.Prorata_basis IN ('Y', 'N')
    GROUP BY
        ea.pn_CompanyID, 
        ea.pn_BranchID, 
        ea.pn_EmployeeID, 
        ea.Employee_Full_Name, 
        ea.EmployeeCode,
        ad.Year,
        ad.Month,
        ad.FullDayAbsences,
        ad.HalfDayAbsences,
        ad.TotalDaysInMonth,
        ad.TotalAbsentDays
);
GO
/****** Object:  Table [dbo].[__EFMigrationsHistory]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[__EFMigrationsHistory](
	[MigrationId] [nvarchar](150) NOT NULL,
	[ProductVersion] [nvarchar](32) NOT NULL,
 CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY CLUSTERED 
(
	[MigrationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[adminlogin]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[adminlogin](
	[username] [varchar](20) NOT NULL,
	[password] [varchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AllowanceMaster]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AllowanceMaster](
	[pn_CompanyID] [int] NOT NULL,
	[pn_BranchID] [int] NULL,
	[pn_EarningsID] [int] IDENTITY(1,1) NOT NULL,
	[v_EarningsName] [varchar](40) NULL,
	[c_Regular] [char](1) NULL,
	[c_PF] [char](1) NULL,
	[c_ESI] [char](1) NULL,
	[c_OT] [char](1) NULL,
	[c_LOP] [char](1) NULL,
	[c_PT] [char](1) NULL,
	[payslip] [char](1) NULL,
	[status] [char](1) NULL,
	[d_order] [int] NULL,
	[Company_User_Id] [varchar](255) NULL,
	[Branch_User_Id] [varchar](255) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AllowanceMasterApprove]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AllowanceMasterApprove](
	[pn_CompanyID] [int] NOT NULL,
	[pn_BranchID] [int] NOT NULL,
	[v_EarningsName] [varchar](40) NOT NULL,
	[Approve] [varchar](40) NOT NULL,
	[Pending] [varchar](40) NOT NULL,
	[Reject] [varchar](40) NOT NULL,
	[RequestDate] [datetime] NULL,
	[Responsedate] [datetime] NULL,
	[Response_User_Id] [varchar](255) NULL,
	[Request_User_Id] [varchar](255) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Assets]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Assets](
	[pn_CompanyID] [int] NOT NULL,
	[BranchID] [int] NOT NULL,
	[pn_Assetid] [int] IDENTITY(1,1) NOT NULL,
	[Asset_name] [varchar](100) NOT NULL,
	[Asset_SerialNumber] [varchar](100) NULL,
	[PurchaseDate] [date] NULL,
	[AssetValue] [decimal](18, 2) NULL,
	[Status] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](max) NULL,
	[CreatedDate] [datetime] NOT NULL,
	[AssetType] [varchar](100) NULL,
	[AssetAssignedTo] [int] NULL,
 CONSTRAINT [PK_Assets] PRIMARY KEY CLUSTERED 
(
	[pn_CompanyID] ASC,
	[BranchID] ASC,
	[Asset_name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_AssetType_Serial] UNIQUE NONCLUSTERED 
(
	[AssetType] ASC,
	[Asset_SerialNumber] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[attendance]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[attendance](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[pn_companyId] [int] NULL,
	[pn_branchId] [int] NULL,
	[pn_employeeId] [int] NULL,
	[day_status] [varchar](20) NULL,
	[intime] [datetime] NULL,
	[outtime] [datetime] NULL,
	[meeting] [varchar](500) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Attendance_Bonus]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Attendance_Bonus](
	[pn_companyid] [int] NULL,
	[pn_branchid] [int] NULL,
	[Category_Name] [varchar](30) NULL,
	[SlabID] [int] NULL,
	[Attendance_Bonus_Value] [numeric](10, 2) NULL,
	[Attendance_bonus_type] [float] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[attendance_ceiling]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[attendance_ceiling](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[pn_companyid] [int] NULL,
	[pn_branchid] [int] NULL,
	[intime] [time](3) NULL,
	[early_intime] [time](3) NULL,
	[shift_lin] [time](3) NULL,
	[lunch_ein] [time](3) NULL,
	[halfday] [time](3) NULL,
	[ot_limit] [time](3) NULL,
	[permission_limit] [time](3) NULL,
	[leave_days] [int] NULL,
	[morning_ot] [varchar](3) NULL,
	[month_type] [varchar](22) NULL,
	[week_off1] [varchar](12) NULL,
	[week_off2] [varchar](12) NULL,
	[manual_days] [int] NULL,
	[ot_days] [float] NULL,
	[ot_hrs] [float] NULL,
	[time_card] [varchar](25) NULL,
	[ptax_month] [varchar](30) NULL,
	[reader_name] [varchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Backup_Attendance]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Backup_Attendance](
	[Sno] [int] IDENTITY(1,1) NOT NULL,
	[pn_companyid] [int] NULL,
	[pn_branchid] [int] NULL,
	[emp_code] [varchar](10) NULL,
	[emp_name] [varchar](50) NULL,
	[shift_code] [varchar](5) NULL,
	[dates] [datetime] NULL,
	[days] [varchar](15) NULL,
	[intime] [datetime] NULL,
	[break_out] [datetime] NULL,
	[break_in] [datetime] NULL,
	[early_out] [datetime] NULL,
	[outtime] [datetime] NULL,
	[Late_in] [datetime] NULL,
	[Late_out] [datetime] NULL,
	[ot_hrs] [datetime] NULL,
	[status] [varchar](5) NULL,
	[leave_code] [varchar](20) NULL,
	[data] [char](1) NULL,
	[pn_EmployeeID] [varchar](20) NULL,
	[flag] [char](1) NULL,
PRIMARY KEY CLUSTERED 
(
	[Sno] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CTCSlab]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CTCSlab](
	[CTCSlabID] [int] IDENTITY(1,1) NOT NULL,
	[MinCTC] [decimal](18, 2) NOT NULL,
	[MaxCTC] [decimal](18, 2) NOT NULL,
	[MaxLoanAmount] [decimal](18, 2) NOT NULL,
	[InterestRate] [decimal](5, 2) NULL,
	[pn_CompanyID] [int] NOT NULL,
	[pn_BranchID] [int] NOT NULL,
	[LoanType] [varchar](50) NULL,
	[LoanID] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[CTCSlabID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[daily_timecard_new]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[daily_timecard_new](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[pn_companyid] [int] NULL,
	[pn_branchid] [int] NULL,
	[machine_num] [varchar](30) NULL,
	[card_no] [varchar](5) NULL,
	[emp_code] [varchar](10) NULL,
	[emp_name] [varchar](50) NULL,
	[VerifyMode] [int] NULL,
	[InOutMode] [int] NULL,
	[shift_code] [varchar](5) NULL,
	[dates] [datetime] NULL,
	[days] [varchar](15) NULL,
	[intime] [time](7) NULL,
	[break_out] [time](7) NULL,
	[break_in] [time](7) NULL,
	[outtime] [time](7) NULL,
	[ot_hrs] [datetime] NULL,
	[status] [varchar](2) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[DeductionMaster]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DeductionMaster](
	[pn_CompanyID] [int] NOT NULL,
	[pn_BranchID] [int] NOT NULL,
	[pn_DeductionID] [int] IDENTITY(1,1) NOT NULL,
	[v_DeductionName] [varchar](40) NOT NULL,
	[c_Regular] [char](1) NULL,
	[status] [char](1) NULL,
	[d_order] [int] NULL,
	[v_DeductionType] [varchar](20) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[DeductionMasterApprove]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DeductionMasterApprove](
	[pn_CompanyID] [int] NOT NULL,
	[pn_BranchID] [int] NOT NULL,
	[v_DeductionName] [varchar](40) NOT NULL,
	[Type] [varchar](255) NULL,
	[Approve] [varchar](40) NOT NULL,
	[Pending] [varchar](40) NOT NULL,
	[Reject] [varchar](40) NOT NULL,
	[RequestDate] [datetime] NULL,
	[Responsedate] [datetime] NULL,
	[Request_User_Id] [varchar](255) NULL,
	[Response_User_Id] [varchar](255) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[DeductionValues]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DeductionValues](
	[pn_companyid] [int] NOT NULL,
	[pn_branchid] [int] NOT NULL,
	[Grade_Name] [varchar](30) NULL,
	[Level_Name] [varchar](30) NULL,
	[v_DeductionName] [varchar](40) NULL,
	[Deductiontype] [varchar](20) NULL,
	[value] [float] NULL,
	[d_order] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[earn_deduct]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[earn_deduct](
	[pn_CompanyID] [int] NOT NULL,
	[pn_BranchID] [int] NOT NULL,
	[ED_ID] [int] IDENTITY(1,1) NOT NULL,
	[pn_EmployeeID] [int] NOT NULL,
	[Allowance1] [varchar](30) NULL,
	[value1] [float] NULL,
	[Allowance2] [varchar](30) NULL,
	[value2] [float] NULL,
	[Allowance3] [varchar](30) NULL,
	[value3] [float] NULL,
	[Allowance4] [varchar](30) NULL,
	[value4] [float] NULL,
	[Allowance5] [varchar](30) NULL,
	[value5] [float] NULL,
	[Allowance6] [varchar](30) NULL,
	[value6] [float] NULL,
	[Allowance7] [varchar](30) NULL,
	[value7] [float] NULL,
	[Allowance8] [varchar](30) NULL,
	[value8] [float] NULL,
	[Allowance9] [varchar](30) NULL,
	[value9] [float] NULL,
	[Allowance10] [varchar](30) NULL,
	[value10] [float] NULL,
	[Deduction1] [varchar](30) NULL,
	[valueA1] [float] NULL,
	[Deduction2] [varchar](30) NULL,
	[valueA2] [float] NULL,
	[Deduction3] [varchar](30) NULL,
	[valueA3] [float] NULL,
	[Deduction4] [varchar](30) NULL,
	[valueA4] [float] NULL,
	[Deduction5] [varchar](30) NULL,
	[valueA5] [float] NULL,
	[Deduction6] [varchar](30) NULL,
	[valueA6] [float] NULL,
	[Deduction7] [varchar](30) NULL,
	[valueA7] [float] NULL,
	[Deduction8] [varchar](30) NULL,
	[valueA8] [float] NULL,
	[Deduction9] [varchar](30) NULL,
	[valueA9] [float] NULL,
	[Deduction10] [varchar](30) NULL,
	[valueA10] [float] NULL,
	[d_date] [datetime] NOT NULL,
	[d_From_Date] [datetime] NULL,
	[d_To_Date] [datetime] NULL,
 CONSTRAINT [pk_earn_deduct] PRIMARY KEY CLUSTERED 
(
	[pn_CompanyID] ASC,
	[pn_BranchID] ASC,
	[pn_EmployeeID] ASC,
	[d_date] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EarnDeductMasters]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EarnDeductMasters](
	[pn_CompanyID] [int] NULL,
	[pn_BranchID] [int] NULL,
	[Allowance1] [varchar](30) NULL,
	[Allowance2] [varchar](30) NULL,
	[Allowance3] [varchar](30) NULL,
	[Allowance4] [varchar](30) NULL,
	[Allowance5] [varchar](30) NULL,
	[Allowance6] [varchar](30) NULL,
	[Allowance7] [varchar](30) NULL,
	[Allowance8] [varchar](30) NULL,
	[Allowance9] [varchar](30) NULL,
	[Allowance10] [varchar](30) NULL,
	[Deduction1] [varchar](30) NULL,
	[Deduction2] [varchar](30) NULL,
	[Deduction3] [varchar](30) NULL,
	[Deduction4] [varchar](30) NULL,
	[Deduction5] [varchar](30) NULL,
	[Deduction6] [varchar](30) NULL,
	[Deduction7] [varchar](30) NULL,
	[Deduction8] [varchar](30) NULL,
	[Deduction9] [varchar](30) NULL,
	[Deduction10] [varchar](30) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EarnDeductValuesMasters]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EarnDeductValuesMasters](
	[pn_CompanyID] [int] NULL,
	[pn_BranchID] [int] NULL,
	[pn_EmployeeID] [int] NULL,
	[ValueType] [varchar](20) NULL,
	[CTC] [float] NULL,
	[value1] [float] NULL,
	[value2] [float] NULL,
	[value3] [float] NULL,
	[value4] [float] NULL,
	[value5] [float] NULL,
	[value6] [float] NULL,
	[value7] [float] NULL,
	[value8] [float] NULL,
	[value9] [float] NULL,
	[value10] [float] NULL,
	[valueA1] [float] NULL,
	[valueA2] [float] NULL,
	[valueA3] [float] NULL,
	[valueA4] [float] NULL,
	[valueA5] [float] NULL,
	[valueA6] [float] NULL,
	[valueA7] [float] NULL,
	[valueA8] [float] NULL,
	[valueA9] [float] NULL,
	[valueA10] [float] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[employee_Group]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[employee_Group](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[employee_code] [varchar](50) NULL,
	[groupid] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[employee_code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ESI_Settings]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ESI_Settings](
	[pn_CompanyID] [int] NOT NULL,
	[Effective_Month_From] [varchar](30) NULL,
	[Effective_From_Year] [int] NULL,
	[Lower_Limit] [int] NULL,
	[Upper_Limit] [int] NULL,
	[Employee_Contribution(%)] [float] NULL,
	[Employer_Contribution(%)] [float] NULL,
	[Rounding_Options] [varchar](50) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Final_Salary]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Final_Salary](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[pn_CompanyID] [int] NOT NULL,
	[pn_BranchID] [int] NOT NULL,
	[pn_EmployeeID] [int] NOT NULL,
	[EmployeeCode] [nvarchar](50) NULL,
	[Employee_First_Name] [nvarchar](50) NULL,
	[DesignationName] [nvarchar](50) NULL,
	[DepartmentName] [nvarchar](50) NULL,
	[GradeName] [nvarchar](50) NULL,
	[CategoryName] [nvarchar](50) NULL,
	[JoiningDate] [nvarchar](50) NULL,
	[d_date] [datetime] NULL,
	[Month] [nvarchar](20) NULL,
	[Year] [nvarchar](20) NULL,
	[Earn_Amount] [float] NULL,
	[Ded_Amount] [float] NULL,
	[NetPay] [float] NULL,
	[Earned_Basic] [float] NULL,
	[Gross_salary] [float] NULL,
	[Net_salary] [float] NULL,
	[EPF] [float] NULL,
	[FPF] [float] NULL,
	[period_code] [nvarchar](50) NULL,
	[max_amount] [float] NULL,
	[Act_Basic] [float] NULL,
	[Calc_Days] [float] NULL,
	[Paid_Days] [float] NULL,
	[Present_Days] [float] NULL,
	[Absent_Days] [float] NULL,
	[WeekOffDays] [float] NULL,
	[Holidays] [float] NULL,
	[TotLeave_Days] [float] NULL,
	[ot_hrs] [datetime] NULL,
	[ot_value] [float] NULL,
	[ot_amt] [float] NULL,
	[Allowance1] [nvarchar](50) NULL,
	[value1] [float] NULL,
	[Allowance2] [nvarchar](50) NULL,
	[value2] [float] NULL,
	[Allowance3] [nvarchar](50) NULL,
	[value3] [float] NULL,
	[Allowance4] [nvarchar](50) NULL,
	[value4] [float] NULL,
	[Allowance5] [nvarchar](50) NULL,
	[value5] [float] NULL,
	[Allowance6] [nvarchar](50) NULL,
	[value6] [float] NULL,
	[Allowance7] [nvarchar](50) NULL,
	[value7] [float] NULL,
	[Allowance8] [nvarchar](50) NULL,
	[value8] [float] NULL,
	[Allowance9] [nvarchar](50) NULL,
	[value9] [float] NULL,
	[Allowance10] [nvarchar](50) NULL,
	[value10] [float] NULL,
	[Deduction1] [nvarchar](50) NULL,
	[valueA1] [float] NULL,
	[Deduction2] [nvarchar](50) NULL,
	[valueA2] [float] NULL,
	[Deduction3] [nvarchar](50) NULL,
	[valueA3] [float] NULL,
	[Deduction4] [nvarchar](50) NULL,
	[valueA4] [float] NULL,
	[Deduction5] [nvarchar](50) NULL,
	[valueA5] [float] NULL,
	[Deduction6] [nvarchar](50) NULL,
	[valueA6] [float] NULL,
	[Deduction7] [nvarchar](50) NULL,
	[valueA7] [float] NULL,
	[Deduction8] [nvarchar](50) NULL,
	[valueA8] [float] NULL,
	[Deduction9] [nvarchar](50) NULL,
	[valueA9] [float] NULL,
	[Deduction10] [nvarchar](50) NULL,
	[valueA10] [float] NULL,
	[CompanyName] [nvarchar](50) NULL,
	[Address_line1] [nvarchar](500) NULL,
	[Address_Line2] [nvarchar](500) NULL,
	[City] [nvarchar](50) NULL,
	[Zipcode] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[form7]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[form7](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[pn_CompanyID] [int] NULL,
	[pn_BranchID] [int] NULL,
	[pn_EmployeeID] [varchar](20) NULL,
	[EmployeeCode] [varchar](20) NULL,
	[Esino] [varchar](20) NULL,
	[M1] [int] NULL,
	[M2] [int] NULL,
	[M3] [int] NULL,
	[M4] [int] NULL,
	[M5] [int] NULL,
	[M6] [int] NULL,
	[D1] [float] NULL,
	[D2] [float] NULL,
	[D3] [float] NULL,
	[D4] [float] NULL,
	[D5] [float] NULL,
	[D6] [float] NULL,
	[W1] [float] NULL,
	[W2] [float] NULL,
	[W3] [float] NULL,
	[W4] [float] NULL,
	[W5] [float] NULL,
	[W6] [float] NULL,
	[Esi1] [float] NULL,
	[Esi2] [float] NULL,
	[Esi3] [float] NULL,
	[Esi4] [float] NULL,
	[Esi5] [float] NULL,
	[Esi6] [float] NULL,
	[Empr1] [float] NULL,
	[Empr2] [float] NULL,
	[Empr3] [float] NULL,
	[Empr4] [float] NULL,
	[Empr5] [float] NULL,
	[Empr6] [float] NULL,
	[Totwage] [float] NULL,
	[TotEsi] [float] NULL,
	[TotEmpr] [float] NULL,
	[Disp] [varchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[GradeSlab_Branch]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[GradeSlab_Branch](
	[pn_companyid] [int] NULL,
	[pn_branchid] [int] NULL,
	[Slab_Type] [varchar](30) NULL,
	[Grade_Name] [varchar](30) NULL,
	[Level_Name] [varchar](30) NULL,
	[Experience_From] [float] NULL,
	[Experience_To] [varchar](10) NULL,
	[CTC] [numeric](10, 2) NULL,
	[Value_type] [varchar](20) NULL,
	[value1] [float] NULL,
	[value2] [float] NULL,
	[value3] [float] NULL,
	[value4] [float] NULL,
	[value5] [float] NULL,
	[value6] [float] NULL,
	[value7] [float] NULL,
	[value8] [float] NULL,
	[value9] [float] NULL,
	[value10] [float] NULL,
	[pn_GradeSlabID] [int] IDENTITY(1,1) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[pn_GradeSlabID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[GradeSlab_Division]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[GradeSlab_Division](
	[pn_CompanyID] [int] NOT NULL,
	[pn_DivisionID] [int] NOT NULL,
	[Slab_Type] [varchar](50) NULL,
	[Grade_Name] [varchar](100) NULL,
	[Level_Name] [varchar](100) NULL,
	[Experience_From] [decimal](10, 2) NULL,
	[Experience_To] [decimal](10, 2) NULL,
	[CTC] [decimal](18, 2) NULL,
	[Value_type] [varchar](50) NULL,
	[value1] [decimal](18, 2) NULL,
	[value2] [decimal](18, 2) NULL,
	[value3] [decimal](18, 2) NULL,
	[value4] [decimal](18, 2) NULL,
	[GradeSlabID] [int] IDENTITY(1,1) NOT NULL,
	[pn_branchid] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[GradeSlabID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Group_details]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Group_details](
	[GroupID] [int] IDENTITY(1,1) NOT NULL,
	[Group_name] [varchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[GroupID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Group_Settings]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Group_Settings](
	[Settings_id] [int] IDENTITY(1,1) NOT NULL,
	[groupid] [int] NULL,
	[emp_EPF] [float] NULL,
	[emp_FPF] [float] NULL,
	[Ded_Amount] [float] NULL,
	[Earned_Amount] [float] NULL,
	[Gross_salary] [float] NULL,
	[Basic_salary] [float] NULL,
	[Net_salary] [float] NULL,
	[vpfamount] [money] NULL,
	[shift_code] [varchar](25) NULL,
	[Allowance1] [varchar](30) NULL,
	[Value1] [float] NULL,
	[Allowance2] [varchar](30) NULL,
	[value2] [float] NULL,
	[Allowance3] [varchar](30) NULL,
	[Value3] [float] NULL,
	[Allowance4] [varchar](30) NULL,
	[Value4] [float] NULL,
	[Allowance5] [varchar](30) NULL,
	[Value5] [float] NULL,
	[Allowance6] [varchar](30) NULL,
	[Value6] [float] NULL,
	[Allowance7] [varchar](30) NULL,
	[Value7] [float] NULL,
	[Allowance8] [varchar](30) NULL,
	[Value8] [float] NULL,
	[Allowance9] [varchar](30) NULL,
	[Value9] [float] NULL,
	[Allowance10] [varchar](30) NULL,
	[Value10] [float] NULL,
	[Deduction1] [varchar](30) NULL,
	[valueA1] [float] NULL,
	[Deduction2] [varchar](30) NULL,
	[valueA2] [float] NULL,
	[Deduction3] [varchar](30) NULL,
	[valueA3] [float] NULL,
	[Deduction4] [varchar](30) NULL,
	[valueA4] [float] NULL,
	[Deduction5] [varchar](30) NULL,
	[valueA5] [float] NULL,
	[Deduction6] [varchar](30) NULL,
	[valueA6] [float] NULL,
	[Deduction7] [varchar](30) NULL,
	[valueA7] [float] NULL,
	[Deduction8] [varchar](30) NULL,
	[valueA8] [float] NULL,
	[Deduction9] [varchar](30) NULL,
	[valueA9] [float] NULL,
	[Deduction10] [varchar](30) NULL,
	[valueA10] [float] NULL,
	[medical] [int] NULL,
	[official] [int] NULL,
	[casual] [int] NULL,
	[personnel] [varchar](30) NULL,
	[maternity] [varchar](30) NULL,
	[Earned] [varchar](30) NULL,
	[Admin_Charges] [float] NULL,
	[NetPay] [float] NULL,
	[Earned_Basic] [float] NULL,
	[max_amount] [float] NULL,
	[emp_PF] [float] NULL,
PRIMARY KEY CLUSTERED 
(
	[Settings_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[hr_authentication]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[hr_authentication](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[pn_CompanyID] [int] NULL,
	[pn_BranchID] [int] NULL,
	[SectionID] [int] NULL,
	[section_view] [varchar](3) NULL,
	[section_edit] [varchar](3) NULL,
	[section_delete] [varchar](3) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[hrmm_Course]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[hrmm_Course](
	[pn_CompanyID] [int] NOT NULL,
	[pn_CourseID] [int] IDENTITY(1,1) NOT NULL,
	[v_CourseName] [varchar](40) NOT NULL,
	[status] [char](1) NULL,
	[BranchID] [int] NULL,
 CONSTRAINT [pk_hrmm_Course] PRIMARY KEY CLUSTERED 
(
	[pn_CompanyID] ASC,
	[pn_CourseID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[hrmm_SkillsMaster]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[hrmm_SkillsMaster](
	[pn_CompanyID] [int] NOT NULL,
	[pn_SkillID] [int] IDENTITY(1,1) NOT NULL,
	[v_SkillName] [varchar](40) NULL,
	[status] [char](1) NULL,
	[BranchID] [int] NULL,
 CONSTRAINT [pk_hrmm_SkillsMaster] PRIMARY KEY CLUSTERED 
(
	[pn_CompanyID] ASC,
	[pn_SkillID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[hrmm_Specialization]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[hrmm_Specialization](
	[pn_CompanyID] [int] NOT NULL,
	[pn_SpecializationId] [int] IDENTITY(1,1) NOT NULL,
	[v_SpecializationName] [varchar](40) NOT NULL,
	[status] [char](1) NULL,
	[pn_BranchID] [int] NULL,
 CONSTRAINT [pk_hrmm_Specialization] PRIMARY KEY CLUSTERED 
(
	[pn_CompanyID] ASC,
	[pn_SpecializationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[late_deduction_minutes]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[late_deduction_minutes](
	[Minutes_ID] [int] IDENTITY(1,1) NOT NULL,
	[pn_CompanyID] [int] NULL,
	[pn_BranchID] [int] NULL,
	[minutes_per_count] [int] NULL,
	[from_minutes] [time](3) NOT NULL,
	[to_minutes] [time](3) NOT NULL,
	[count] [decimal](2, 1) NOT NULL,
	[deduction] [varchar](25) NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[late_deduction_time]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[late_deduction_time](
	[Time_ID] [int] IDENTITY(1,1) NOT NULL,
	[pn_CompanyID] [int] NULL,
	[pn_BranchID] [int] NULL,
	[from_minutes] [time](3) NOT NULL,
	[to_minutes] [time](3) NOT NULL,
	[deduction] [varchar](25) NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[leave_apply]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[leave_apply](
	[pn_CompanyID] [int] NULL,
	[pn_BranchID] [int] NULL,
	[pn_EmployeeID] [int] NULL,
	[Emp_code] [varchar](10) NULL,
	[Emp_name] [varchar](50) NULL,
	[pn_LeaveID] [int] NULL,
	[pn_Leavename] [varchar](50) NULL,
	[pn_leavecode] [varchar](20) NULL,
	[from_date] [datetime] NULL,
	[from_status] [varchar](2) NULL,
	[to_date] [datetime] NULL,
	[status] [varchar](2) NULL,
	[days] [float] NULL,
	[reason] [varchar](50) NULL,
	[submitted_date] [datetime] NULL,
	[approve] [varchar](10) NULL,
	[reminder] [datetime] NULL,
	[priority] [varchar](10) NULL,
	[comments] [varchar](100) NULL,
	[record] [varchar](10) NULL,
	[flag] [char](1) NULL,
	[yearend] [int] NULL,
	[sno] [int] IDENTITY(1,1) NOT NULL,
	[attachfile] [varbinary](max) NULL,
 CONSTRAINT [pkleave_apply] PRIMARY KEY CLUSTERED 
(
	[sno] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[leave_settlement]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[leave_settlement](
	[pn_CompanyID] [int] NOT NULL,
	[pn_BranchID] [int] NOT NULL,
	[pn_EmployeeID] [int] NOT NULL,
	[pn_LeaveID] [int] NULL,
	[pn_leavecode] [varchar](5) NOT NULL,
	[days_allowed] [int] NULL,
	[days_taken] [int] NULL,
	[days_balance] [int] NULL,
	[Ec] [char](1) NULL,
	[Cf] [char](1) NULL,
	[max_days] [int] NULL,
	[flag] [char](1) NULL,
	[calendar_year] [varchar](12) NOT NULL,
 CONSTRAINT [pk_settlement] PRIMARY KEY CLUSTERED 
(
	[pn_CompanyID] ASC,
	[pn_BranchID] ASC,
	[pn_leavecode] ASC,
	[pn_EmployeeID] ASC,
	[calendar_year] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[leaveallocation_master]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[leaveallocation_master](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[pn_CompanyID] [int] NULL,
	[pn_BranchID] [int] NULL,
	[pn_leaveID] [int] NULL,
	[pn_EmployeeID] [int] NULL,
	[Category] [varchar](30) NULL,
	[Sub_Category] [varchar](30) NULL,
	[n_count] [int] NULL,
	[Yearend] [int] NULL,
	[Medical] [int] NULL,
	[Official] [int] NULL,
	[Casual] [int] NULL,
	[ssss] [varchar](30) NULL,
	[personnel] [varchar](30) NULL,
	[personel] [varchar](30) NULL,
	[maternity] [varchar](30) NULL,
	[Earned] [varchar](30) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[leaveapprove_hr]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[leaveapprove_hr](
	[sno] [int] IDENTITY(1,1) NOT NULL,
	[pn_companyId] [int] NULL,
	[pn_BranchId] [int] NULL,
	[Emp_Id] [int] NULL,
	[Empcode] [varchar](50) NULL,
	[Emp_name] [varchar](100) NULL,
	[pn_LeaveId] [int] NULL,
	[pn_Leavecode] [varchar](50) NULL,
	[pn_leaveName] [varchar](100) NULL,
	[from_date] [datetime] NULL,
	[To_date] [datetime] NULL,
	[Submitted_date] [datetime] NULL,
	[from_status] [varchar](20) NULL,
	[To_status] [varchar](20) NULL,
	[Approve] [varchar](30) NULL,
	[YearEnd] [varchar](10) NULL,
	[dayss] [int] NULL,
	[pn_DesignationId] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[sno] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[leaveapprove_manager]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[leaveapprove_manager](
	[sno] [int] IDENTITY(1,1) NOT NULL,
	[pn_companyId] [int] NULL,
	[pn_BranchId] [int] NULL,
	[Emp_Id] [int] NULL,
	[Empcode] [varchar](50) NULL,
	[Emp_name] [varchar](100) NULL,
	[pn_LeaveId] [int] NULL,
	[pn_Leavecode] [varchar](50) NULL,
	[pn_leaveName] [varchar](100) NULL,
	[from_date] [datetime] NULL,
	[To_date] [datetime] NULL,
	[Submitted_date] [datetime] NULL,
	[from_status] [varchar](20) NULL,
	[To_status] [varchar](20) NULL,
	[Approve] [varchar](30) NULL,
	[YearEnd] [varchar](10) NULL,
	[dayss] [int] NULL,
	[pn_DesignationId] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[sno] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LeaveSandwichingSettings]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LeaveSandwichingSettings](
	[pn_CompanyID] [int] NOT NULL,
	[pn_BranchID] [int] NULL,
	[id] [int] IDENTITY(1,1) NOT NULL,
	[weekend_days] [nvarchar](255) NULL,
	[selected_days] [nvarchar](255) NULL,
	[created_at] [datetime] NULL,
	[Include_PaidLeaves] [bit] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[loan_post]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[loan_post](
	[loan_reqno] [varchar](20) NOT NULL,
	[req_date] [datetime] NULL,
	[employeeid] [int] NULL,
	[employeename] [varchar](20) NULL,
	[loan_appid] [varchar](20) NULL,
	[loan_type] [varchar](20) NULL,
	[loan_name] [varchar](20) NULL,
	[loan_amount] [decimal](8, 2) NULL,
	[month_to_posted] [datetime] NULL,
	[month_posted_on] [datetime] NULL,
	[rem_month] [int] NULL,
	[postedamt] [decimal](8, 2) NULL,
	[balance_amt] [decimal](8, 2) NULL,
	[approve_by] [varchar](20) NULL,
	[pn_companyid] [int] NULL,
	[pn_branchid] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[loan_reqno] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Loan_PreCloser]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Loan_PreCloser](
	[pn_CompanyID] [int] NOT NULL,
	[pn_BranchID] [int] NOT NULL,
	[pn_EmployeeID] [int] NOT NULL,
	[loan_appid] [varchar](20) NOT NULL,
	[d_date] [datetime] NOT NULL,
	[n_loanamount] [decimal](8, 2) NULL,
	[n_balanceamount] [float] NULL,
	[n_paidamount] [float] NULL,
	[n_closureamount] [float] NULL,
	[n_checkno] [varchar](20) NULL,
	[d_checkdate] [datetime] NULL,
	[n_checkamount] [float] NULL,
	[v_bankname] [varchar](20) NULL,
	[v_Remarks] [varchar](20) NULL,
	[c_status] [char](1) NULL,
	[int_amt] [decimal](8, 2) NULL,
	[payment_mode] [varchar](20) NULL,
	[loan_process] [varchar](20) NULL,
	[loan_interest] [decimal](8, 2) NULL,
	[loan_name] [varchar](20) NULL,
 CONSTRAINT [pk_loan_appid] PRIMARY KEY CLUSTERED 
(
	[loan_appid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LoanEntry]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LoanEntry](
	[pn_CompanyID] [int] NOT NULL,
	[pn_BranchID] [int] NOT NULL,
	[pn_EmployeeID] [int] NOT NULL,
	[Loan_AutoID] [varchar](20) NULL,
	[fn_LoanID] [int] NOT NULL,
	[san_date] [datetime] NULL,
	[d_effdate] [datetime] NULL,
	[Loan_Amt] [decimal](8, 2) NULL,
	[InstalmentAmt] [decimal](8, 2) NULL,
	[Instalmentcount] [int] NULL,
	[Balance_Amt] [decimal](8, 2) NULL,
	[c_status] [char](1) NULL,
	[loan_name] [varchar](20) NULL,
	[loan_process] [varchar](20) NULL,
	[loan_calculation] [varchar](20) NULL,
	[comments] [varchar](50) NULL,
	[loan_appid] [varchar](20) NOT NULL,
	[interest] [decimal](8, 2) NULL,
	[tot_interest_amt] [decimal](8, 2) NULL,
	[emp_name] [varchar](30) NULL,
	[loan_status] [char](20) NULL,
	[lasttransaction_from] [datetime] NULL,
	[lasttransaction_to] [datetime] NULL,
 CONSTRAINT [loan_key] PRIMARY KEY CLUSTERED 
(
	[loan_appid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LoanPostponed]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LoanPostponed](
	[PostponementID] [int] IDENTITY(1,1) NOT NULL,
	[ApplicationID] [int] NOT NULL,
	[pn_companyid] [int] NULL,
	[pn_branchid] [int] NULL,
	[employeeid] [int] NULL,
	[employeename] [varchar](20) NULL,
	[loan_type] [varchar](20) NULL,
	[loan_amount] [decimal](8, 2) NULL,
	[req_date] [datetime] NULL,
	[postedamt] [decimal](8, 2) NULL,
	[ApprovalStatus] [varchar](50) NOT NULL,
	[month_to_posted] [date] NULL,
	[Remarks] [varchar](200) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LoanPreclosure]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LoanPreclosure](
	[PreclosureID] [int] IDENTITY(1,1) NOT NULL,
	[ApplicationID] [int] NOT NULL,
	[pn_CompanyID] [int] NOT NULL,
	[pn_BranchID] [int] NOT NULL,
	[pn_EmployeeID] [int] NOT NULL,
	[PreclosureAmount] [decimal](18, 2) NOT NULL,
	[PaidDate] [date] NULL,
	[Status] [varchar](20) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[PreclosureID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LoanRepayment]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LoanRepayment](
	[RepaymentID] [int] IDENTITY(1,1) NOT NULL,
	[pn_CompanyID] [int] NOT NULL,
	[pn_BranchID] [int] NOT NULL,
	[pn_EmployeeID] [int] NOT NULL,
	[ApplicationID] [int] NOT NULL,
	[LoanAmount] [decimal](18, 2) NOT NULL,
	[InterestRate] [decimal](5, 2) NOT NULL,
	[Totalamount] [decimal](18, 2) NULL,
	[EMIAmount] [decimal](18, 2) NOT NULL,
	[TotalPaidAmout] [decimal](18, 2) NULL,
	[RemainingAmount] [decimal](18, 2) NULL,
	[ScheduledPaymentDate] [date] NOT NULL,
	[PaymentDate] [date] NULL,
	[PaymentStatus] [varchar](20) NOT NULL,
	[Remarks] [varchar](200) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[medicalslip]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[medicalslip](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[Date_of_service] [varchar](50) NULL,
	[Hospital_Name] [varchar](50) NULL,
	[Amount] [float] NULL,
	[Medicalbills] [text] NULL,
	[pn_EmployeeID] [int] NULL,
	[EmployeeCode] [varchar](50) NULL,
	[Employee_Full_Name] [varchar](70) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[onduty]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[onduty](
	[sno] [int] IDENTITY(1,1) NOT NULL,
	[Ref_no] [varchar](20) NOT NULL,
	[pn_companyid] [int] NOT NULL,
	[pn_branchid] [int] NOT NULL,
	[empid] [varchar](50) NULL,
	[empname] [varchar](50) NULL,
	[onduty_dat] [datetime] NOT NULL,
	[fstatus] [varchar](15) NULL,
	[todat] [datetime] NOT NULL,
	[tstatus] [varchar](15) NULL,
	[tot_days] [float] NULL,
	[sub_dat] [datetime] NOT NULL,
	[reason] [varchar](30) NULL,
	[priority] [varchar](10) NULL,
	[approval] [varchar](10) NULL,
	[Message1] [varchar](500) NULL,
	[Message2] [varchar](500) NULL,
	[Message3] [varchar](500) NULL,
	[Message4] [varchar](500) NULL,
 CONSTRAINT [pk_paym_onduty] PRIMARY KEY CLUSTERED 
(
	[pn_companyid] ASC,
	[pn_branchid] ASC,
	[Ref_no] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[otslab]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[otslab](
	[pn_companyid] [int] NOT NULL,
	[pn_branchid] [int] NOT NULL,
	[slab_id] [int] IDENTITY(1,1) NOT NULL,
	[ot_from] [time](3) NOT NULL,
	[ot_to] [time](3) NOT NULL,
	[ot_slab] [time](3) NOT NULL,
	[pn_category] [varchar](30) NOT NULL,
	[ot_hrs] [decimal](2, 1) NOT NULL,
 CONSTRAINT [pk_otslab] PRIMARY KEY CLUSTERED 
(
	[pn_companyid] ASC,
	[pn_branchid] ASC,
	[ot_from] ASC,
	[ot_to] ASC,
	[pn_category] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[OtslabNew]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[OtslabNew](
	[pn_companyid] [int] NOT NULL,
	[pn_branchid] [int] NOT NULL,
	[Category_Name] [varchar](30) NOT NULL,
	[SlabID] [int] NOT NULL,
	[Ot_From_Duration] [time](3) NOT NULL,
	[Ot_To_Duration] [time](3) NOT NULL,
	[Ot_Rate] [decimal](2, 1) NOT NULL,
	[oT_Hrs] [time](3) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PayInput]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PayInput](
	[pn_CompanyID] [int] NOT NULL,
	[pn_BranchID] [int] NOT NULL,
	[pn_EmployeeID] [int] NOT NULL,
	[d_Date] [datetime] NOT NULL,
	[d_From_Date] [datetime] NULL,
	[d_To_Date] [datetime] NULL,
	[Calc_Days] [float] NULL,
	[Paid_Days] [float] NULL,
	[Present_Days] [float] NULL,
	[Absent_Days] [float] NULL,
	[TotLeave_Days] [float] NULL,
	[WeekOffDays] [float] NULL,
	[Holidays] [float] NULL,
	[OnDuty_days] [float] NULL,
	[Compoff_Days] [float] NULL,
	[Tour_Days] [float] NULL,
	[Att_Bonus] [char](1) NULL,
	[Att_BonusAmount] [float] NULL,
	[OT_HRS] [time](3) NULL,
	[Earn_Arrears] [float] NULL,
	[Ded_Arrears] [float] NULL,
	[ot_value] [float] NULL,
	[ot_Amt] [float] NULL,
	[Act_Basic] [float] NULL,
	[Earn_Basic] [float] NULL,
	[Mode] [char](1) NULL,
	[Flag] [char](1) NULL,
	[PT_Gross] [float] NULL,
 CONSTRAINT [pk_PayInput] PRIMARY KEY CLUSTERED 
(
	[pn_CompanyID] ASC,
	[pn_BranchID] ASC,
	[pn_EmployeeID] ASC,
	[d_Date] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[paym_attbonus]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[paym_attbonus](
	[pn_CompanyId] [int] NULL,
	[pn_BranchId] [int] NULL,
	[AttbonusId] [int] IDENTITY(1,1) NOT NULL,
	[CategoryId] [varchar](20) NULL,
	[CategoryName] [varchar](30) NULL,
	[Fullatt] [decimal](7, 2) NULL,
	[Halfatt] [decimal](7, 2) NULL,
	[Oneatt] [decimal](7, 2) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[paym_Bank]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[paym_Bank](
	[pn_BankID] [int] IDENTITY(1,1) NOT NULL,
	[v_BankName] [varchar](50) NULL,
	[v_BankCode] [varchar](50) NULL,
	[status] [char](1) NULL,
	[pn_CompanyID] [int] NULL,
	[pn_BranchID] [int] NULL,
	[Branch_Name] [varchar](50) NULL,
	[Account_Type] [varchar](20) NULL,
	[Micr_Code] [varchar](20) NULL,
	[Ifsc_Code] [varchar](20) NULL,
	[Address] [varchar](100) NULL,
	[others] [varchar](500) NULL,
 CONSTRAINT [pk_paym_Bank] PRIMARY KEY CLUSTERED 
(
	[pn_BankID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[paym_Branch]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[paym_Branch](
	[pn_CompanyID] [int] NOT NULL,
	[pn_BranchID] [int] IDENTITY(1,1) NOT NULL,
	[BranchCode] [varchar](20) NULL,
	[BranchName] [varchar](50) NULL,
	[Address_Line1] [varchar](100) NULL,
	[Address_Line2] [varchar](100) NULL,
	[City] [varchar](50) NULL,
	[ZipCode] [varchar](50) NULL,
	[Country] [varchar](100) NULL,
	[State] [varchar](100) NULL,
	[Phone_No] [varchar](50) NULL,
	[Fax_No] [varchar](50) NULL,
	[Email_Id] [varchar](100) NULL,
	[AlternateEmail_Id] [varchar](100) NULL,
	[Branch_User_Id] [varchar](10) NULL,
	[Branch_Password] [varchar](10) NULL,
	[status] [varchar](40) NULL,
	[start_date] [datetime] NULL,
	[end_date] [datetime] NULL,
	[BranchType] [varchar](100) NULL,
	[can_manage_department] [bit] NULL,
	[can_manage_designation] [bit] NULL,
 CONSTRAINT [pk_paym_Branch] PRIMARY KEY CLUSTERED 
(
	[pn_CompanyID] ASC,
	[pn_BranchID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[paym_CarryForward]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[paym_CarryForward](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[pn_CompanyId] [int] NOT NULL,
	[pn_BranchId] [int] NOT NULL,
	[pn_EmployeeId] [int] NOT NULL,
	[Pn_LeaveId] [int] NOT NULL,
	[Allow_Days] [decimal](18, 0) NOT NULL,
	[Taken_Days] [decimal](18, 0) NOT NULL,
	[Max_Days] [decimal](18, 0) NOT NULL,
	[Bal_Days] [decimal](18, 0) NOT NULL,
	[Date] [datetime] NOT NULL,
	[YearEnd] [varchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[paym_Category]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[paym_Category](
	[pn_CompanyID] [int] NOT NULL,
	[BranchID] [int] NOT NULL,
	[pn_CategoryID] [int] IDENTITY(1,1) NOT NULL,
	[v_CategoryName] [varchar](40) NOT NULL,
	[status] [varchar](20) NULL,
 CONSTRAINT [PK_paym_Category] PRIMARY KEY CLUSTERED 
(
	[pn_CompanyID] ASC,
	[BranchID] ASC,
	[pn_CategoryID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[paym_Company]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[paym_Company](
	[pn_CompanyID] [int] IDENTITY(1,1) NOT NULL,
	[CompanyCode] [varchar](20) NULL,
	[CompanyName] [varchar](50) NULL,
	[Address_Line1] [varchar](100) NULL,
	[Address_Line2] [varchar](100) NULL,
	[City] [varchar](50) NULL,
	[ZipCode] [varchar](50) NULL,
	[Country] [varchar](100) NULL,
	[State] [varchar](100) NULL,
	[Phone_No] [varchar](50) NULL,
	[Fax_No] [varchar](50) NULL,
	[Email_Id] [varchar](100) NULL,
	[AlternateEmail_Id] [varchar](100) NULL,
	[start_date] [datetime] NULL,
	[end_date] [datetime] NULL,
	[Company_User_Id] [varchar](25) NULL,
	[Company_Password] [varchar](25) NULL,
	[GSTNumber] [varchar](100) NULL,
	[WebsiteURL] [varchar](250) NULL,
	[ContactPerson] [varchar](200) NULL,
	[CompanyLogo] [varchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[pn_CompanyID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[paym_Computation]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[paym_Computation](
	[pn_CompanyID] [int] NOT NULL,
	[pn_BranchID] [int] NOT NULL,
	[id] [int] IDENTITY(1,1) NOT NULL,
	[Type] [varchar](20) NULL,
	[pn_EarningsCode] [varchar](50) NOT NULL,
	[Value] [float] NULL,
 CONSTRAINT [pk_paym_Computation] PRIMARY KEY CLUSTERED 
(
	[pn_CompanyID] ASC,
	[pn_BranchID] ASC,
	[pn_EarningsCode] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[paym_Deduction]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[paym_Deduction](
	[pn_CompanyID] [int] NOT NULL,
	[pn_BranchID] [int] NOT NULL,
	[pn_DeductionID] [int] IDENTITY(1,1) NOT NULL,
	[v_DeductionCode] [varchar](40) NOT NULL,
	[v_DeductionName] [varchar](40) NOT NULL,
	[c_Regular] [char](1) NULL,
	[c_Print] [char](1) NULL,
	[status] [char](1) NULL,
	[d_order] [int] NULL,
 CONSTRAINT [pk_paym_Deduction] PRIMARY KEY CLUSTERED 
(
	[pn_CompanyID] ASC,
	[pn_DeductionID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[paym_Department]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[paym_Department](
	[pn_CompanyID] [int] NOT NULL,
	[pn_BranchID] [int] NOT NULL,
	[pn_DepartmentID] [int] IDENTITY(1,1) NOT NULL,
	[v_DepartmentName] [varchar](40) NOT NULL,
	[status] [varchar](20) NULL,
 CONSTRAINT [PK_paym_Department] PRIMARY KEY CLUSTERED 
(
	[pn_CompanyID] ASC,
	[pn_BranchID] ASC,
	[pn_DepartmentID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[paym_Designation]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[paym_Designation](
	[pn_CompanyID] [int] NOT NULL,
	[BranchID] [int] NOT NULL,
	[pn_DesignationID] [int] IDENTITY(1,1) NOT NULL,
	[v_DesignationName] [varchar](40) NOT NULL,
	[Authority] [varchar](20) NULL,
	[status] [varchar](20) NULL,
 CONSTRAINT [PK_paym_Designation_1] PRIMARY KEY CLUSTERED 
(
	[pn_CompanyID] ASC,
	[BranchID] ASC,
	[v_DesignationName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[paym_Division]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[paym_Division](
	[pn_CompanyID] [int] NOT NULL,
	[BranchID] [int] NOT NULL,
	[pn_DivisionID] [int] IDENTITY(1,1) NOT NULL,
	[v_DivisionName] [varchar](40) NOT NULL,
	[status] [char](1) NULL,
 CONSTRAINT [PK_paym_Division_1] PRIMARY KEY CLUSTERED 
(
	[pn_CompanyID] ASC,
	[BranchID] ASC,
	[v_DivisionName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[paym_Earnings]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[paym_Earnings](
	[pn_CompanyID] [int] NOT NULL,
	[pn_EarningsID] [int] IDENTITY(1,1) NOT NULL,
	[v_EarningsCode] [varchar](40) NOT NULL,
	[v_EarningsName] [varchar](40) NULL,
	[c_Regular] [char](1) NULL,
	[c_PF] [char](1) NULL,
	[c_ESI] [char](1) NULL,
	[c_OT] [char](1) NULL,
	[c_LOP] [char](1) NULL,
	[c_PT] [char](1) NULL,
	[c_Print] [char](1) NULL,
	[payslip] [char](1) NULL,
	[status] [char](1) NULL,
	[d_order] [int] NULL,
	[pn_BranchID] [int] NULL,
 CONSTRAINT [pk_paym_Earnings] PRIMARY KEY CLUSTERED 
(
	[pn_CompanyID] ASC,
	[pn_EarningsID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[paym_Emp_Deduction]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[paym_Emp_Deduction](
	[pn_CompanyID] [int] NOT NULL,
	[pn_BranchID] [int] NOT NULL,
	[pn_EmployeeID] [int] NOT NULL,
	[pn_DeductionID] [int] NOT NULL,
	[n_Amount] [float] NULL,
	[d_Date] [datetime] NOT NULL,
	[c_eligible] [char](1) NULL,
	[from_date] [datetime] NULL,
	[to_date] [datetime] NULL,
	[period_code] [varchar](10) NULL,
 CONSTRAINT [pk_paym_Emp_Deduction] PRIMARY KEY CLUSTERED 
(
	[pn_CompanyID] ASC,
	[pn_BranchID] ASC,
	[pn_EmployeeID] ASC,
	[pn_DeductionID] ASC,
	[d_Date] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[paym_Emp_Earnings]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[paym_Emp_Earnings](
	[pn_CompanyID] [int] NOT NULL,
	[pn_BranchID] [int] NOT NULL,
	[pn_EmployeeID] [int] NOT NULL,
	[pn_EarningsID] [int] NOT NULL,
	[Pid] [int] NOT NULL,
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[n_Amount] [int] NULL,
	[d_Date] [datetime] NOT NULL,
	[c_eligible] [char](1) NULL,
	[from_date] [datetime] NULL,
	[to_date] [datetime] NULL,
	[Flag] [char](1) NULL,
 CONSTRAINT [pk_paym_Emp_Earnings] PRIMARY KEY CLUSTERED 
(
	[pn_CompanyID] ASC,
	[pn_BranchID] ASC,
	[pn_EmployeeID] ASC,
	[pn_EarningsID] ASC,
	[Pid] ASC,
	[d_Date] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[paym_Employee_leave]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[paym_Employee_leave](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[pn_CompanyID] [int] NOT NULL,
	[pn_BranchID] [int] NOT NULL,
	[pn_EmployeeID] [int] NOT NULL,
	[pn_leaveID] [int] NOT NULL,
	[From_Date] [datetime] NULL,
	[To_Date] [datetime] NULL,
	[From_Status] [varchar](5) NULL,
	[To_Status] [varchar](5) NULL,
	[Leave_Count] [float] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[paym_employee_profile1]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[paym_employee_profile1](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[pn_CompanyID] [int] NULL,
	[pn_BranchID] [int] NULL,
	[pn_EmployeeID] [int] NULL,
	[pn_DivisionId] [int] NULL,
	[pn_DepartmentId] [int] NULL,
	[pn_DesignationId] [int] NULL,
	[pn_GradeId] [int] NULL,
	[pn_ShiftId] [int] NULL,
	[pn_CategoryId] [int] NULL,
	[pn_JobStatusId] [int] NULL,
	[pn_LevelID] [int] NULL,
	[pn_projectsiteID] [int] NULL,
	[d_Date] [datetime] NULL,
	[v_Reason] [varchar](500) NULL,
	[r_Department] [int] NULL,
	[father_name] [varchar](40) NULL,
	[Emp_Profile_Image] [varchar](max) NULL,
	[image_data] [varchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[paym_Employee_WorkDetails]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[paym_Employee_WorkDetails](
	[pn_CompanyID] [int] NOT NULL,
	[pn_BranchID] [int] NOT NULL,
	[pn_EmployeeID] [int] NOT NULL,
	[JoiningDate] [datetime] NULL,
	[OfferDate] [datetime] NULL,
	[ProbationUpto] [datetime] NULL,
	[ExtendedUpto] [datetime] NULL,
	[ConfirmationDate] [datetime] NULL,
	[RetirementDate] [datetime] NULL,
	[ContractRenviewDate] [datetime] NULL,
	[v_Reason] [varchar](200) NULL,
 CONSTRAINT [pk_paym_Employee_workdetails] PRIMARY KEY CLUSTERED 
(
	[pn_CompanyID] ASC,
	[pn_BranchID] ASC,
	[pn_EmployeeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[paym_EncashmentDetails]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[paym_EncashmentDetails](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[pn_CompanyId] [int] NULL,
	[pn_BranchId] [int] NULL,
	[pn_EmployeeId] [int] NULL,
	[Pn_LeaveId] [int] NULL,
	[Allow_Days] [decimal](18, 0) NULL,
	[Taken_Days] [decimal](18, 0) NULL,
	[Max_Days] [decimal](18, 0) NULL,
	[Bal_Days] [decimal](18, 0) NULL,
	[Basic_PerDay] [decimal](18, 0) NULL,
	[Total_Amt] [decimal](18, 0) NULL,
	[Date] [datetime] NULL,
	[YearEnd] [varchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[paym_Grade]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[paym_Grade](
	[pn_CompanyID] [int] NOT NULL,
	[BranchID] [int] NOT NULL,
	[pn_GradeID] [int] IDENTITY(1,1) NOT NULL,
	[v_GradeName] [varchar](40) NOT NULL,
	[status] [varchar](20) NULL,
 CONSTRAINT [PK_paym_Grade_1] PRIMARY KEY CLUSTERED 
(
	[pn_CompanyID] ASC,
	[BranchID] ASC,
	[v_GradeName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[paym_holiday]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[paym_holiday](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[pn_CompanyID] [int] NULL,
	[pn_BranchID] [int] NULL,
	[pn_Holidaycode] [varchar](10) NULL,
	[pn_Holidayname] [varchar](30) NULL,
	[Fyear] [int] NULL,
	[From_date] [datetime] NULL,
	[To_date] [datetime] NULL,
	[days] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[paym_JobStatus]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[paym_JobStatus](
	[pn_CompanyID] [int] NOT NULL,
	[BranchID] [int] NOT NULL,
	[pn_JobStatusID] [int] IDENTITY(1,1) NOT NULL,
	[v_JobStatusName] [varchar](40) NOT NULL,
	[status] [varchar](20) NULL,
 CONSTRAINT [PK_paym_JobStatus_1] PRIMARY KEY CLUSTERED 
(
	[pn_CompanyID] ASC,
	[BranchID] ASC,
	[v_JobStatusName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[paym_leave]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[paym_leave](
	[pn_CompanyID] [int] NOT NULL,
	[pn_leaveID] [int] IDENTITY(1,1) NOT NULL,
	[v_leaveName] [varchar](40) NOT NULL,
	[pn_leaveCode] [varchar](10) NULL,
	[pn_Count] [int] NULL,
	[status] [varchar](20) NULL,
	[pn_BranchID] [int] NULL,
	[max_days] [int] NULL,
	[Type] [varchar](10) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[paym_leaveAllocation1]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[paym_leaveAllocation1](
	[pn_companyid] [int] NOT NULL,
	[pn_branchid] [int] NOT NULL,
	[pn_leaveid] [int] NOT NULL,
	[pn_employeeid] [int] NOT NULL,
	[n_count] [float] NULL,
	[cy_count] [float] NULL,
	[Leaveby] [varchar](50) NULL,
	[yearend] [int] NOT NULL,
 CONSTRAINT [PK_paym_leaveAllocation1] PRIMARY KEY CLUSTERED 
(
	[pn_companyid] ASC,
	[pn_branchid] ASC,
	[pn_leaveid] ASC,
	[pn_employeeid] ASC,
	[yearend] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[paym_Level]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[paym_Level](
	[pn_CompanyID] [int] NOT NULL,
	[BranchID] [int] NOT NULL,
	[pn_LevelID] [int] IDENTITY(1,1) NOT NULL,
	[v_LevelName] [varchar](40) NOT NULL,
	[status] [varchar](20) NULL,
 CONSTRAINT [PK_paym_Level_1] PRIMARY KEY CLUSTERED 
(
	[pn_CompanyID] ASC,
	[BranchID] ASC,
	[v_LevelName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[paym_Loan]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[paym_Loan](
	[pn_Companyid] [int] NOT NULL,
	[pn_LoanID] [int] IDENTITY(1,1) NOT NULL,
	[v_LoanName] [varchar](50) NULL,
	[v_LoanCode] [varchar](50) NULL,
	[status] [varchar](30) NULL,
	[Pn_BranchID] [int] NULL,
	[v_LoanType] [varchar](100) NULL,
 CONSTRAINT [pk_paym_loan] PRIMARY KEY CLUSTERED 
(
	[pn_Companyid] ASC,
	[pn_LoanID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[paym_loan_diminishing]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[paym_loan_diminishing](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[pn_companyid] [int] NULL,
	[pn_branchid] [int] NULL,
	[pn_employeeid] [int] NULL,
	[fn_LoanId] [int] NULL,
	[loan_appid] [varchar](20) NULL,
	[loan_amount] [float] NULL,
	[balance_amt] [decimal](8, 2) NULL,
	[installement_count] [int] NULL,
	[eff_date] [datetime] NULL,
	[from_date] [datetime] NULL,
	[to_date] [datetime] NULL,
	[instal_amt] [decimal](8, 2) NULL,
	[months] [int] NULL,
	[loan_status] [varchar](30) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[paym_LoanApply_employee]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[paym_LoanApply_employee](
	[ApplicationID] [int] IDENTITY(1,1) NOT NULL,
	[pn_CompanyID] [int] NOT NULL,
	[pn_BranchID] [int] NOT NULL,
	[pn_EmployeeID] [int] NOT NULL,
	[RequestedAmount] [decimal](18, 2) NULL,
	[RepaymentPeriod] [int] NOT NULL,
	[ApplicationDate] [date] NOT NULL,
	[InterestRate] [decimal](5, 2) NOT NULL,
	[EmployeeComments] [text] NULL,
	[ApplicationStatus] [varchar](20) NOT NULL,
	[loantype] [varchar](50) NOT NULL,
	[MaxLoanAmount] [decimal](18, 2) NOT NULL,
	[Pan_Card] [varbinary](max) NULL,
	[Aadhaar_Card] [varbinary](max) NULL,
	[Digital_Signature] [varbinary](max) NULL,
	[EffectiveDate] [date] NULL,
PRIMARY KEY CLUSTERED 
(
	[ApplicationID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[paym_LoanTypeMaster]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[paym_LoanTypeMaster](
	[pn_LoanTypeID] [int] IDENTITY(1,1) NOT NULL,
	[v_LoanTypeName] [varchar](100) NOT NULL,
	[status] [varchar](20) NULL,
	[CreatedDate] [datetime] NULL,
	[ModifiedDate] [datetime] NULL,
	[pn_CompanyID] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[pn_LoanTypeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[paym_OverHeadingCost]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[paym_OverHeadingCost](
	[pn_CompanyID] [int] NOT NULL,
	[BranchID] [int] NOT NULL,
	[overHeadingID] [int] IDENTITY(1,1) NOT NULL,
	[OverHeadingName] [varchar](40) NOT NULL,
	[status] [char](1) NULL,
 CONSTRAINT [PK_paym_OverHeadingCost_1] PRIMARY KEY CLUSTERED 
(
	[pn_CompanyID] ASC,
	[BranchID] ASC,
	[OverHeadingName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[paym_paybill]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[paym_paybill](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[pn_CompanyID] [int] NOT NULL,
	[pn_BranchID] [int] NOT NULL,
	[pn_EmployeeID] [int] NOT NULL,
	[EmployeeCode] [nvarchar](50) NULL,
	[Employee_First_Name] [nvarchar](50) NULL,
	[DesignationName] [nvarchar](50) NULL,
	[DepartmentName] [nvarchar](50) NULL,
	[GradeName] [nvarchar](50) NULL,
	[CategoryName] [nvarchar](50) NULL,
	[JoiningDate] [nvarchar](50) NULL,
	[d_date] [datetime] NULL,
	[Earn_Amount] [float] NULL,
	[Ded_Amount] [float] NULL,
	[NetPay] [float] NULL,
	[Earned_Basic] [float] NULL,
	[Gross_salary] [float] NULL,
	[Net_salary] [float] NULL,
	[EPF] [float] NULL,
	[FPF] [float] NULL,
	[period_code] [nvarchar](50) NULL,
	[max_amount] [float] NULL,
	[Act_Basic] [float] NULL,
	[Calc_Days] [float] NULL,
	[Paid_Days] [float] NULL,
	[Present_Days] [float] NULL,
	[Absent_Days] [float] NULL,
	[WeekOffDays] [float] NULL,
	[Holidays] [float] NULL,
	[TotLeave_Days] [float] NULL,
	[ot_hrs] [datetime] NULL,
	[ot_value] [float] NULL,
	[ot_amt] [float] NULL,
	[Allowance1] [nvarchar](50) NULL,
	[value1] [float] NULL,
	[Allowance2] [nvarchar](50) NULL,
	[value2] [float] NULL,
	[Allowance3] [nvarchar](50) NULL,
	[value3] [float] NULL,
	[Allowance4] [nvarchar](50) NULL,
	[value4] [float] NULL,
	[Allowance5] [nvarchar](50) NULL,
	[value5] [float] NULL,
	[Allowance6] [nvarchar](50) NULL,
	[value6] [float] NULL,
	[Allowance7] [nvarchar](50) NULL,
	[value7] [float] NULL,
	[Allowance8] [nvarchar](50) NULL,
	[value8] [float] NULL,
	[Allowance9] [nvarchar](50) NULL,
	[value9] [float] NULL,
	[Allowance10] [nvarchar](50) NULL,
	[value10] [float] NULL,
	[Deduction1] [nvarchar](50) NULL,
	[valueA1] [float] NULL,
	[Deduction2] [nvarchar](50) NULL,
	[valueA2] [float] NULL,
	[Deduction3] [nvarchar](50) NULL,
	[valueA3] [float] NULL,
	[Deduction4] [nvarchar](50) NULL,
	[valueA4] [float] NULL,
	[Deduction5] [nvarchar](50) NULL,
	[valueA5] [float] NULL,
	[Deduction6] [nvarchar](50) NULL,
	[valueA6] [float] NULL,
	[Deduction7] [nvarchar](50) NULL,
	[valueA7] [float] NULL,
	[Deduction8] [nvarchar](50) NULL,
	[valueA8] [float] NULL,
	[Deduction9] [nvarchar](50) NULL,
	[valueA9] [float] NULL,
	[Deduction10] [nvarchar](50) NULL,
	[valueA10] [float] NULL,
	[CompanyName] [nvarchar](50) NULL,
	[Address_line1] [nvarchar](500) NULL,
	[Address_Line2] [nvarchar](500) NULL,
	[City] [nvarchar](50) NULL,
	[Zipcode] [int] NULL,
	[Att_bonus] [float] NULL,
	[WorkFromHome] [float] NULL,
	[Halfday] [float] NULL,
	[Flag] [char](1) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[paym_paybill_log]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[paym_paybill_log](
	[LogID] [int] IDENTITY(1,1) NOT NULL,
	[OriginalID] [int] NOT NULL,
	[ChangeType] [nvarchar](10) NOT NULL,
	[OldValue] [nvarchar](max) NULL,
	[NewValue] [nvarchar](max) NULL,
	[ChangeDate] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[LogID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Paym_Permission]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Paym_Permission](
	[CompanyID] [int] NOT NULL,
	[BranchID] [int] NOT NULL,
	[PermissionID] [int] IDENTITY(1,1) NOT NULL,
	[EmployeeID] [int] NOT NULL,
	[EmployeeName] [nvarchar](50) NULL,
	[Date] [datetime] NOT NULL,
	[Session] [nvarchar](50) NOT NULL,
	[Status] [nvarchar](50) NULL,
 CONSTRAINT [PK_Paym_Permission_1] PRIMARY KEY CLUSTERED 
(
	[CompanyID] ASC,
	[BranchID] ASC,
	[EmployeeID] ASC,
	[Date] ASC,
	[Session] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[paym_PermissionSlab]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[paym_PermissionSlab](
	[pn_CompanyID] [int] NOT NULL,
	[pn_BranchID] [int] NOT NULL,
	[From_Duration] [varchar](25) NOT NULL,
	[To_Duration] [varchar](25) NOT NULL,
	[Permission_Deduction] [varchar](25) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[paym_PF]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[paym_PF](
	[pn_CompanyID] [int] NOT NULL,
	[pn_BranchID] [int] NOT NULL,
	[Emp_Con_PF] [float] NULL,
	[Emp_Con_EPF] [float] NULL,
	[Emp_Con_FPF] [float] NULL,
	[Admin_Charges] [float] NULL,
	[Eligibility_Amt] [float] NULL,
	[c_Round] [char](1) NULL,
	[d_date] [datetime] NOT NULL,
	[check_ceiling] [varchar](2) NULL,
	[max_amount] [int] NULL,
	[check_allowance] [char](1) NULL,
	[month] [varchar](10) NULL,
	[year] [int] NULL,
 CONSTRAINT [pk_paym_PF] PRIMARY KEY CLUSTERED 
(
	[pn_CompanyID] ASC,
	[pn_BranchID] ASC,
	[d_date] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[paym_Reimbursement]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[paym_Reimbursement](
	[ReimbursementID] [int] IDENTITY(1,1) NOT NULL,
	[EmployeeCode] [varchar](50) NOT NULL,
	[PayableMonth] [date] NOT NULL,
	[Category] [varchar](100) NOT NULL,
	[Amount] [decimal](18, 2) NOT NULL,
	[StartDate] [date] NOT NULL,
	[EndDate] [date] NOT NULL,
	[Description] [nvarchar](500) NOT NULL,
	[AttachFile] [varbinary](max) NULL,
	[CreatedDate] [datetime] NULL,
	[UpdatedDate] [datetime] NULL,
	[Status] [varchar](20) NULL,
	[Total_Amount_Approved] [decimal](18, 2) NULL,
	[EmployeeName] [varchar](200) NULL,
	[Start_Date] [date] NULL,
	[End_Date] [date] NULL,
PRIMARY KEY CLUSTERED 
(
	[ReimbursementID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[paym_Shift]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[paym_Shift](
	[pn_CompanyID] [int] NOT NULL,
	[pn_branchid] [int] NOT NULL,
	[pn_ShiftID] [int] IDENTITY(1,1) NOT NULL,
	[shift_code] [varchar](20) NOT NULL,
	[start_time] [time](7) NULL,
	[break_time_out] [time](7) NULL,
	[break_time_in] [time](7) NULL,
	[end_time] [time](7) NULL,
	[shift_indicator] [varchar](30) NULL,
	[Shift_Type] [varchar](40) NULL,
 CONSTRAINT [pk_paym_Shift] PRIMARY KEY CLUSTERED 
(
	[pn_CompanyID] ASC,
	[pn_branchid] ASC,
	[pn_ShiftID] ASC,
	[shift_code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Paym_vpf]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Paym_vpf](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[pn_companyid] [int] NULL,
	[pn_branchid] [int] NULL,
	[pn_EmployeeID] [varchar](10) NULL,
	[employeename] [varchar](50) NULL,
	[monthlycontribution] [money] NULL,
	[salaryfrom] [varchar](20) NULL,
	[vpfamount] [money] NULL,
	[contribution_type] [varchar](15) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PayOutput_Actuals]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PayOutput_Actuals](
	[pn_CompanyID] [int] NOT NULL,
	[pn_BranchID] [int] NULL,
	[pn_EmployeeID] [int] NOT NULL,
	[d_Date] [datetime] NOT NULL,
	[d_From_Date] [datetime] NULL,
	[d_To_Date] [datetime] NULL,
	[Earn_Act_Amount] [float] NULL,
	[Ded_Act_Amount] [float] NULL,
	[Act_basic] [float] NULL,
	[Period_code] [varchar](20) NULL,
 CONSTRAINT [pk_PayOutput_Actuals] PRIMARY KEY CLUSTERED 
(
	[pn_CompanyID] ASC,
	[pn_EmployeeID] ASC,
	[d_Date] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PayOutput_Deductions]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PayOutput_Deductions](
	[pn_CompanyID] [int] NOT NULL,
	[pn_EmployeeID] [int] NOT NULL,
	[pn_DeductionID] [int] NOT NULL,
	[pn_DepartmentName] [varchar](30) NULL,
	[d_Date] [datetime] NOT NULL,
	[d_From_Date] [datetime] NULL,
	[d_To_Date] [datetime] NULL,
	[Mode] [char](1) NULL,
	[Flag] [char](1) NOT NULL,
	[Act_Amount] [float] NULL,
	[Amount] [float] NULL,
	[pn_BranchID] [int] NULL,
 CONSTRAINT [pk_PayOutput_Deductions] PRIMARY KEY CLUSTERED 
(
	[pn_CompanyID] ASC,
	[pn_EmployeeID] ASC,
	[pn_DeductionID] ASC,
	[Flag] ASC,
	[d_Date] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PayOutput_Earnings]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PayOutput_Earnings](
	[pn_CompanyID] [int] NOT NULL,
	[pn_EmployeeID] [int] NOT NULL,
	[pn_EarningsID] [int] NOT NULL,
	[Pn_DepartmentName] [varchar](30) NULL,
	[d_Date] [datetime] NOT NULL,
	[d_From_Date] [datetime] NULL,
	[d_To_Date] [datetime] NULL,
	[Mode] [char](1) NULL,
	[Flag] [char](1) NULL,
	[Act_Amount] [float] NULL,
	[Amount] [float] NULL,
	[pn_BranchID] [int] NULL,
 CONSTRAINT [pk_PayOutput_Earnings] PRIMARY KEY CLUSTERED 
(
	[pn_CompanyID] ASC,
	[pn_EmployeeID] ASC,
	[pn_EarningsID] ASC,
	[d_Date] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PayOutput_ESI]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PayOutput_ESI](
	[pn_CompanyID] [int] NOT NULL,
	[pn_EmployeeID] [int] NOT NULL,
	[v_ESIno] [varchar](20) NULL,
	[d_Date] [datetime] NOT NULL,
	[d_From_Date] [datetime] NULL,
	[d_To_Date] [datetime] NULL,
	[NetPay] [int] NULL,
	[ESI_EMP] [float] NULL,
	[ESI_EPR] [float] NULL,
	[Paid_Days] [float] NULL,
	[Absent_Days] [float] NULL,
	[WeekOffDays] [float] NULL,
	[Period_code] [varchar](20) NULL,
	[pn_BranchID] [int] NULL,
 CONSTRAINT [pk_PayOutput_ESI] PRIMARY KEY CLUSTERED 
(
	[pn_CompanyID] ASC,
	[pn_EmployeeID] ASC,
	[d_Date] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[payoutput_loan]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[payoutput_loan](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[pn_companyid] [int] NULL,
	[pn_employeeid] [int] NULL,
	[pn_loanid] [int] NULL,
	[d_Date] [datetime] NULL,
	[d_From_Date] [datetime] NULL,
	[d_To_Date] [datetime] NULL,
	[Amount] [decimal](8, 2) NULL,
	[count_installement] [int] NULL,
	[pn_branchid] [int] NULL,
	[installement_count] [int] NULL,
	[loan_appid] [varchar](20) NULL,
	[instal_amt] [decimal](8, 2) NULL,
	[balance_amt] [decimal](8, 2) NULL,
	[loan_status] [varchar](30) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PayOutput_NetPay]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PayOutput_NetPay](
	[pn_CompanyID] [int] NOT NULL,
	[pn_BranchID] [int] NULL,
	[pn_EmployeeID] [int] NOT NULL,
	[d_Date] [datetime] NOT NULL,
	[d_From_Date] [datetime] NULL,
	[d_To_Date] [datetime] NULL,
	[Earn_Act_Amount] [float] NULL,
	[Earn_Amount] [float] NULL,
	[OT_amt] [float] NULL,
	[Ded_Act_Amount] [float] NULL,
	[Ded_Amount] [float] NULL,
	[NetPay] [float] NULL,
	[Act_basic] [float] NULL,
	[Earned_basic] [float] NULL,
	[Gross_salary] [float] NULL,
	[Net_salary] [float] NULL,
	[Period_code] [varchar](20) NULL,
 CONSTRAINT [pk_PayOutput_NetPay] PRIMARY KEY CLUSTERED 
(
	[pn_CompanyID] ASC,
	[pn_EmployeeID] ASC,
	[d_Date] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PayOutput_PF]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PayOutput_PF](
	[pn_CompanyID] [int] NOT NULL,
	[pn_EmployeeID] [int] NOT NULL,
	[v_PFno] [varchar](20) NULL,
	[d_Date] [datetime] NOT NULL,
	[d_From_Date] [datetime] NULL,
	[d_To_Date] [datetime] NULL,
	[NetPay] [int] NULL,
	[PF] [float] NULL,
	[Tot_pf] [float] NULL,
	[EPF] [float] NULL,
	[FPF] [float] NULL,
	[VPF] [float] NULL,
	[Paid_Days] [float] NULL,
	[Absent_Days] [float] NULL,
	[WeekOffDays] [float] NULL,
	[Period_Code] [varchar](20) NULL,
	[pn_BranchID] [int] NULL,
 CONSTRAINT [pk_PayOutput_PF] PRIMARY KEY CLUSTERED 
(
	[pn_CompanyID] ASC,
	[pn_EmployeeID] ASC,
	[d_Date] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PayProcess]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PayProcess](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[pn_CompanyID] [int] NOT NULL,
	[pn_BranchID] [int] NOT NULL,
	[d_Date] [datetime] NOT NULL,
	[d_From_Date] [datetime] NULL,
	[d_To_Date] [datetime] NULL,
	[salary_period] [varchar](20) NULL,
	[ProcessDate] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Payroll_final_settlement]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Payroll_final_settlement](
	[Pn_companyid] [int] NOT NULL,
	[pn_branchid] [int] NOT NULL,
	[ReferenceNo] [varchar](20) NOT NULL,
	[pn_employeeid] [int] NOT NULL,
	[joining_date] [varchar](50) NOT NULL,
	[Last_Working_date] [varchar](50) NULL,
	[ServiceYear] [int] NULL,
	[Grauity_Amount] [decimal](18, 2) NULL,
	[PF_Amount] [decimal](18, 2) NULL,
	[Encashment_Amount] [decimal](18, 2) NULL,
	[Loan_Amount] [decimal](18, 2) NULL,
	[Deduct_Salary_Amount] [decimal](18, 2) NULL,
	[Final_Amount] [decimal](18, 2) NULL,
	[Status] [varchar](50) NULL,
 CONSTRAINT [pk_Payroll_final_settlement] PRIMARY KEY CLUSTERED 
(
	[Pn_companyid] ASC,
	[pn_employeeid] ASC,
	[ReferenceNo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PF_EPF]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PF_EPF](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[pn_companyID] [int] NULL,
	[pn_BranchID] [int] NULL,
	[pn_employeeID] [int] NULL,
	[Nominee_Name] [varchar](20) NULL,
	[Gender] [varchar](10) NULL,
	[DOB] [datetime] NULL,
	[PF_Share] [decimal](18, 2) NULL,
	[Relationship] [varchar](20) NULL,
	[address1] [varchar](50) NULL,
	[State] [varchar](20) NULL,
	[District] [varchar](20) NULL,
	[city] [varchar](20) NULL,
	[pin_no] [varchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PF_EPS]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PF_EPS](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[pn_companyID] [int] NULL,
	[pn_BranchID] [int] NULL,
	[pn_employeeID] [int] NULL,
	[FamilyMember_Name] [varchar](20) NULL,
	[Gender] [varchar](10) NULL,
	[Relationship] [varchar](20) NULL,
	[DOB] [datetime] NULL,
	[address1] [varchar](50) NULL,
	[State] [varchar](20) NULL,
	[District] [varchar](20) NULL,
	[city] [varchar](20) NULL,
	[pin_no] [varchar](50) NULL,
	[Disabled] [varchar](10) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PF_Settings]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PF_Settings](
	[pn_CompanyID] [int] NOT NULL,
	[Effective_Month_From] [varchar](30) NULL,
	[Effective_From_Year] [int] NULL,
	[PF_Contribution(%)] [float] NULL,
	[Max_Ceiling] [varchar](20) NULL,
	[PF_below_ceiling] [varchar](20) NULL,
	[EPF_Contribution(%)] [float] NULL,
	[Upper_Limit] [decimal](18, 2) NULL,
	[EPS_Contribution(%)] [float] NULL,
	[Eligibility_Amount] [decimal](18, 2) NULL,
	[Admin_Charges(%)] [float] NULL,
	[Rounding_Options] [varchar](50) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Professional_Tax]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Professional_Tax](
	[pn_companyid] [int] NULL,
	[pn_branchid] [int] NULL,
	[State] [varchar](30) NULL,
	[SlabID] [int] NULL,
	[Lower_limit] [numeric](10, 2) NULL,
	[Upper_limit] [varchar](50) NULL,
	[Annual_basis] [numeric](10, 2) NULL,
	[Half_yearly] [numeric](10, 2) NULL,
	[Monthly_Amount] [numeric](10, 2) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ProRataBasisMasters]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProRataBasisMasters](
	[pn_CompanyID] [int] NULL,
	[pn_BranchID] [int] NULL,
	[Allowance1PRB] [nchar](1) NULL,
	[Allowance2PRB] [nchar](1) NULL,
	[Allowance3PRB] [nchar](1) NULL,
	[Allowance4PRB] [nchar](1) NULL,
	[Allowance5PRB] [nchar](1) NULL,
	[Allowance6PRB] [nchar](1) NULL,
	[Allowance7PRB] [nchar](1) NULL,
	[Allowance8PRB] [nchar](1) NULL,
	[Allowance9PRB] [nchar](1) NULL,
	[Allowance10PRB] [nchar](1) NULL,
	[Deduction1PRB] [nchar](1) NULL,
	[Deduction2PRB] [nchar](1) NULL,
	[Deduction3PRB] [nchar](1) NULL,
	[Deduction4PRB] [nchar](1) NULL,
	[Deduction5PRB] [nchar](1) NULL,
	[Deduction6PRB] [nchar](1) NULL,
	[Deduction7PRB] [nchar](1) NULL,
	[Deduction8PRB] [nchar](1) NULL,
	[Deduction9PRB] [nchar](1) NULL,
	[Deduction10PRB] [nchar](1) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[punch_details]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[punch_details](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[pn_companyid] [int] NULL,
	[pn_branchid] [int] NULL,
	[machine_num] [bigint] NULL,
	[card_no] [varchar](15) NULL,
	[emp_code] [varchar](15) NULL,
	[emp_name] [varchar](50) NULL,
	[VerifyMode] [int] NULL,
	[InOutMode] [int] NULL,
	[shift_code] [varchar](5) NULL,
	[dates] [datetime] NULL,
	[days] [varchar](15) NULL,
	[times] [time](7) NULL,
	[ot_hrs] [time](7) NULL,
	[status] [varchar](2) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Reader]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Reader](
	[SlNo] [int] IDENTITY(1,1) NOT NULL,
	[pn_CompanyID] [int] NOT NULL,
	[Pn_BranchID] [int] NOT NULL,
	[ReaderNo] [varchar](50) NOT NULL,
	[IPAddress] [varchar](50) NOT NULL,
	[Location] [varchar](50) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Register]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Register](
	[UserID] [int] IDENTITY(1,1) NOT NULL,
	[CompanyName] [varchar](100) NOT NULL,
	[Email] [varchar](100) NOT NULL,
	[Username] [varchar](50) NOT NULL,
	[Passwordhash] [varchar](255) NOT NULL,
	[MobileNumber] [varchar](15) NULL,
	[Address] [nvarchar](255) NULL,
	[CreatedAt] [datetime] NULL,
	[IsActive] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[UserID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[Username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[Email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[salary_period]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[salary_period](
	[pn_CompanyID] [int] NULL,
	[pn_BranchID] [int] NULL,
	[period_code] [varchar](15) NULL,
	[selection] [varchar](5) NULL,
	[p_year] [int] NULL,
	[p_month] [varchar](15) NULL,
	[from_date] [datetime] NOT NULL,
	[to_date] [datetime] NOT NULL,
	[total_days] [int] NULL,
	[pay_date] [datetime] NULL,
	[ot_include] [char](1) NULL,
PRIMARY KEY CLUSTERED 
(
	[from_date] ASC,
	[to_date] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[salary_structure]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[salary_structure](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[pn_companyid] [int] NULL,
	[pn_branchid] [int] NULL,
	[pn_EmployeeID] [int] NULL,
	[Salary] [float] NULL,
	[Effective_date] [datetime] NULL,
	[Remarks] [varchar](30) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[shift_balance]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[shift_balance](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[pn_companyid] [int] NULL,
	[pn_branchid] [int] NULL,
	[pn_employeecode] [varchar](10) NULL,
	[pn_employeename] [varchar](50) NULL,
	[monthyear] [varchar](8) NULL,
	[pattern_code] [varchar](5) NULL,
	[slot] [int] NULL,
	[balance_days] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[shift_details]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[shift_details](
	[pn_companyid] [int] NOT NULL,
	[pn_branchid] [int] NOT NULL,
	[shift_code] [varchar](20) NOT NULL,
	[start_time] [time](7) NULL,
	[break_time_out] [time](7) NULL,
	[break_time_in] [time](7) NULL,
	[end_time] [time](7) NULL,
	[shift_indicator] [varchar](30) NULL,
	[Shift_Type] [varchar](40) NULL,
 CONSTRAINT [PK_shift_details] PRIMARY KEY NONCLUSTERED 
(
	[pn_companyid] ASC,
	[pn_branchid] ASC,
	[shift_code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[shift_month]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[shift_month](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[pn_CompanyID] [int] NULL,
	[pn_BranchID] [int] NULL,
	[pn_EmployeeCode] [varchar](50) NULL,
	[pn_EmployeeName] [varchar](50) NULL,
	[monthyear] [varchar](20) NULL,
	[date] [datetime] NULL,
	[Shift_PatternCode] [varchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[shift_pattern]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[shift_pattern](
	[pn_companyid] [int] NOT NULL,
	[pn_branchid] [int] NOT NULL,
	[pattern_code] [varchar](5) NOT NULL,
	[shift_code1] [varchar](10) NULL,
	[days1] [int] NULL,
	[shift_code2] [varchar](10) NULL,
	[days2] [int] NULL,
	[shift_code3] [varchar](10) NULL,
	[days3] [int] NULL,
	[shift_code4] [varchar](10) NULL,
	[days4] [int] NULL,
	[shift_code5] [varchar](10) NULL,
	[days5] [int] NULL,
	[shift_code6] [varchar](10) NULL,
	[days6] [int] NULL,
	[shift_code7] [varchar](10) NULL,
	[days7] [int] NULL,
	[shift_code8] [varchar](10) NULL,
	[days8] [int] NULL,
 CONSTRAINT [pk_shift_pattern] PRIMARY KEY CLUSTERED 
(
	[pn_companyid] ASC,
	[pn_branchid] ASC,
	[pattern_code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[temp_deductions]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[temp_deductions](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[pn_CompanyID] [int] NOT NULL,
	[pn_EmployeeID] [int] NOT NULL,
	[pn_DeductionID] [int] NOT NULL,
	[pn_DepartmentName] [varchar](30) NULL,
	[d_Date] [datetime] NOT NULL,
	[d_From_Date] [datetime] NULL,
	[d_To_Date] [datetime] NULL,
	[Mode] [char](1) NULL,
	[Flag] [char](1) NOT NULL,
	[Act_Amount] [float] NULL,
	[Amount] [float] NULL,
	[pn_BranchID] [int] NULL,
	[v_deductionname] [varchar](40) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[temp_earnings]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[temp_earnings](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[pn_CompanyID] [int] NOT NULL,
	[pn_EmployeeID] [int] NOT NULL,
	[pn_EarningsID] [int] NOT NULL,
	[Pn_DepartmentName] [varchar](30) NULL,
	[d_Date] [datetime] NOT NULL,
	[d_From_Date] [datetime] NULL,
	[d_To_Date] [datetime] NULL,
	[Mode] [char](1) NULL,
	[Flag] [char](1) NULL,
	[Act_Amount] [float] NULL,
	[Amount] [float] NULL,
	[pn_BranchID] [int] NULL,
	[v_earningsname] [varchar](40) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Temp_EmployeeID]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Temp_EmployeeID](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[pn_CompanyID] [int] NOT NULL,
	[pn_BranchID] [int] NOT NULL,
	[pn_EmployeeID] [int] NULL,
	[d_date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Temp_Muster]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Temp_Muster](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[pn_CompanyID] [int] NULL,
	[pn_BranchID] [int] NULL,
	[Emp_code] [varchar](50) NULL,
	[Emp_name] [varchar](100) NULL,
	[From_date] [datetime] NULL,
	[To_Date] [datetime] NULL,
	[M1] [varchar](2) NULL,
	[M2] [varchar](2) NULL,
	[M3] [varchar](2) NULL,
	[M4] [varchar](2) NULL,
	[M5] [varchar](2) NULL,
	[M6] [varchar](2) NULL,
	[M7] [varchar](2) NULL,
	[M8] [varchar](2) NULL,
	[M9] [varchar](2) NULL,
	[M10] [varchar](2) NULL,
	[M11] [varchar](2) NULL,
	[M12] [varchar](2) NULL,
	[M13] [varchar](2) NULL,
	[M14] [varchar](2) NULL,
	[M15] [varchar](2) NULL,
	[M16] [varchar](2) NULL,
	[M17] [varchar](2) NULL,
	[M18] [varchar](2) NULL,
	[M19] [varchar](2) NULL,
	[M20] [varchar](2) NULL,
	[M21] [varchar](2) NULL,
	[M22] [varchar](2) NULL,
	[M23] [varchar](2) NULL,
	[M24] [varchar](2) NULL,
	[M25] [varchar](2) NULL,
	[M26] [varchar](2) NULL,
	[M27] [varchar](2) NULL,
	[M28] [varchar](2) NULL,
	[M29] [varchar](2) NULL,
	[M30] [varchar](2) NULL,
	[M31] [varchar](2) NULL,
	[PrsDays] [float] NULL,
	[leaveDays] [float] NULL,
	[OdDays] [float] NULL,
	[Holidays] [float] NULL,
	[WeekOff] [float] NULL,
	[AbsDays] [float] NULL,
	[PaidDays] [float] NULL,
	[pn_GradeID] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[temp_netpay]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[temp_netpay](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[pn_CompanyID] [int] NOT NULL,
	[pn_BranchID] [int] NULL,
	[pn_EmployeeID] [int] NOT NULL,
	[d_Date] [datetime] NOT NULL,
	[d_From_Date] [datetime] NULL,
	[d_To_Date] [datetime] NULL,
	[Earn_Act_Amount] [float] NULL,
	[Earn_Amount] [float] NULL,
	[OT_amt] [float] NULL,
	[Ded_Act_Amount] [float] NULL,
	[Ded_Amount] [float] NULL,
	[NetPay] [float] NULL,
	[Act_basic] [float] NULL,
	[Earned_basic] [float] NULL,
	[Gross_salary] [float] NULL,
	[Net_salary] [float] NULL,
	[Period_code] [varchar](20) NULL,
	[EPF] [float] NULL,
	[FPF] [float] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[temp_Payinput]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[temp_Payinput](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[pn_CompanyID] [int] NOT NULL,
	[pn_BranchID] [int] NOT NULL,
	[pn_EmployeeID] [int] NOT NULL,
	[d_Date] [datetime] NOT NULL,
	[d_From_Date] [datetime] NULL,
	[d_To_Date] [datetime] NULL,
	[Calc_Days] [float] NULL,
	[Paid_Days] [float] NULL,
	[Present_Days] [float] NULL,
	[Absent_Days] [float] NULL,
	[TotLeave_Days] [float] NULL,
	[WeekOffDays] [float] NULL,
	[Holidays] [float] NULL,
	[OnDuty_days] [float] NULL,
	[Compoff_Days] [float] NULL,
	[Tour_Days] [float] NULL,
	[Att_Bonus] [char](1) NULL,
	[Att_BonusAmount] [float] NULL,
	[OT_HRS] [time](3) NULL,
	[Earn_Arrears] [float] NULL,
	[Ded_Arrears] [float] NULL,
	[ot_value] [float] NULL,
	[ot_Amt] [float] NULL,
	[Act_Basic] [float] NULL,
	[Earn_Basic] [float] NULL,
	[Mode] [char](1) NULL,
	[Flag] [char](1) NULL,
	[PT_Gross] [float] NULL,
	[max_amount] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[temp_timecard]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[temp_timecard](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[pn_companyid] [int] NULL,
	[pn_branchid] [int] NULL,
	[BranchCode] [varchar](10) NULL,
	[emp_code] [varchar](10) NULL,
	[emp_name] [varchar](50) NULL,
	[shift_code] [varchar](10) NULL,
	[dates] [datetime] NULL,
	[days] [varchar](15) NULL,
	[intime] [time](7) NULL,
	[break_out] [time](7) NULL,
	[break_in] [time](7) NULL,
	[outtime] [time](7) NULL,
	[late_in] [time](7) NULL,
	[late_out] [time](7) NULL,
	[early_out] [time](7) NULL,
	[ot_hrs] [datetime] NULL,
	[leave_code] [varchar](20) NULL,
	[status] [varchar](2) NULL,
	[data] [char](1) NULL,
	[pn_EmployeeID] [varchar](20) NULL,
	[flag] [char](1) NULL,
	[GroupID] [int] NULL,
	[pn_DepartmentID] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tempsattendance]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tempsattendance](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[pn_companyid] [int] NULL,
	[pn_branchid] [int] NULL,
	[RegisterNo] [varchar](15) NULL,
	[StudentName] [varchar](50) NULL,
	[dates] [datetime] NULL,
	[intime] [varchar](10) NULL,
	[latein] [varchar](10) NULL,
	[outtime] [varchar](10) NULL,
	[lateout] [varchar](10) NULL,
	[whours] [varchar](10) NULL,
	[status] [varchar](5) NULL,
	[Department] [varchar](50) NULL,
	[Leave_name] [varchar](50) NULL,
	[earlyout] [varchar](10) NULL,
	[pn_gradeID] [int] NULL,
	[To_Date] [datetime] NULL,
	[Shift_code] [varchar](10) NULL,
	[work_hrs] [varchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tempshift]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tempshift](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[pn_companyid] [int] NULL,
	[pn_branchid] [int] NULL,
	[RegisterNo] [varchar](15) NULL,
	[StudentName] [varchar](50) NULL,
	[dates] [datetime] NULL,
	[intime] [varchar](10) NULL,
	[latein] [varchar](10) NULL,
	[outtime] [varchar](10) NULL,
	[lateout] [varchar](10) NULL,
	[whours] [varchar](10) NULL,
	[status] [varchar](5) NULL,
	[Department] [varchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tempshiftdetails]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tempshiftdetails](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[pn_companyid] [int] NULL,
	[pn_branchid] [int] NULL,
	[RegisterNo] [varchar](15) NULL,
	[StudentName] [varchar](50) NULL,
	[dates] [datetime] NULL,
	[intime] [varchar](10) NULL,
	[latein] [varchar](10) NULL,
	[outtime] [varchar](10) NULL,
	[lateout] [varchar](10) NULL,
	[whours] [varchar](10) NULL,
	[shift_code] [varchar](50) NULL,
	[Department] [varchar](50) NULL,
	[To_Date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[temptimecard]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[temptimecard](
	[Sno] [int] IDENTITY(1,1) NOT NULL,
	[pn_companyid] [int] NULL,
	[pn_branchid] [int] NULL,
	[emp_code] [varchar](10) NULL,
	[emp_name] [varchar](50) NULL,
	[shift_code] [varchar](5) NULL,
	[dates] [datetime] NULL,
	[days] [varchar](15) NULL,
	[intime] [datetime] NULL,
	[break_out] [datetime] NULL,
	[break_in] [datetime] NULL,
	[early_out] [datetime] NULL,
	[outtime] [datetime] NULL,
	[Late_in] [datetime] NULL,
	[Late_out] [datetime] NULL,
	[ot_hrs] [datetime] NULL,
	[status] [varchar](5) NULL,
	[leave_code] [varchar](20) NULL,
	[data] [char](1) NULL,
	[pn_EmployeeID] [varchar](20) NULL,
	[flag] [char](1) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Yearend]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Yearend](
	[pn_CompanyID] [int] NOT NULL,
	[pn_BranchID] [int] NOT NULL,
	[StartDate] [datetime] NOT NULL,
	[EndDate] [datetime] NOT NULL,
	[ProcessDate] [datetime] NOT NULL,
 CONSTRAINT [PK_Yearend] PRIMARY KEY CLUSTERED 
(
	[StartDate] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Assets] ADD  DEFAULT ('Active') FOR [Status]
GO
ALTER TABLE [dbo].[Assets] ADD  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[LoanPostponed] ADD  DEFAULT ('Pending') FOR [ApprovalStatus]
GO
ALTER TABLE [dbo].[paym_LoanApply_employee] ADD  DEFAULT ('Pending') FOR [ApplicationStatus]
GO
ALTER TABLE [dbo].[paym_LoanApply_employee] ADD  DEFAULT ((0)) FOR [MaxLoanAmount]
GO
ALTER TABLE [dbo].[paym_LoanTypeMaster] ADD  DEFAULT ('Active') FOR [status]
GO
ALTER TABLE [dbo].[paym_LoanTypeMaster] ADD  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[paym_paybill_log] ADD  DEFAULT (getdate()) FOR [ChangeDate]
GO
ALTER TABLE [dbo].[paym_Reimbursement] ADD  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[paym_Reimbursement] ADD  DEFAULT ('Pending') FOR [Status]
GO
ALTER TABLE [dbo].[Register] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Register] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[employee_Group]  WITH CHECK ADD  CONSTRAINT [fk_employeeGroup_groupid] FOREIGN KEY([groupid])
REFERENCES [dbo].[Group_details] ([GroupID])
GO
ALTER TABLE [dbo].[employee_Group] CHECK CONSTRAINT [fk_employeeGroup_groupid]
GO
ALTER TABLE [dbo].[Group_Settings]  WITH CHECK ADD  CONSTRAINT [fk_groupSettings_groupid] FOREIGN KEY([groupid])
REFERENCES [dbo].[Group_details] ([GroupID])
GO
ALTER TABLE [dbo].[Group_Settings] CHECK CONSTRAINT [fk_groupSettings_groupid]
GO
ALTER TABLE [dbo].[hrmm_Course]  WITH CHECK ADD  CONSTRAINT [fk_hrmm_Company] FOREIGN KEY([pn_CompanyID])
REFERENCES [dbo].[paym_Company] ([pn_CompanyID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[hrmm_Course] CHECK CONSTRAINT [fk_hrmm_Company]
GO
ALTER TABLE [dbo].[hrmm_SkillsMaster]  WITH CHECK ADD  CONSTRAINT [fk_hrmm_SkillsMaster_Company] FOREIGN KEY([pn_CompanyID])
REFERENCES [dbo].[paym_Company] ([pn_CompanyID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[hrmm_SkillsMaster] CHECK CONSTRAINT [fk_hrmm_SkillsMaster_Company]
GO
ALTER TABLE [dbo].[hrmm_Specialization]  WITH CHECK ADD  CONSTRAINT [fk_Specialization_Company] FOREIGN KEY([pn_CompanyID])
REFERENCES [dbo].[paym_Company] ([pn_CompanyID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[hrmm_Specialization] CHECK CONSTRAINT [fk_Specialization_Company]
GO
ALTER TABLE [dbo].[Loan_PreCloser]  WITH NOCHECK ADD  CONSTRAINT [fk_loancloser_company] FOREIGN KEY([pn_CompanyID], [pn_BranchID])
REFERENCES [dbo].[paym_Branch] ([pn_CompanyID], [pn_BranchID])
GO
ALTER TABLE [dbo].[Loan_PreCloser] CHECK CONSTRAINT [fk_loancloser_company]
GO
ALTER TABLE [dbo].[LoanEntry]  WITH NOCHECK ADD  CONSTRAINT [fk_loanentry_company] FOREIGN KEY([pn_CompanyID], [pn_BranchID])
REFERENCES [dbo].[paym_Branch] ([pn_CompanyID], [pn_BranchID])
GO
ALTER TABLE [dbo].[LoanEntry] CHECK CONSTRAINT [fk_loanentry_company]
GO
ALTER TABLE [dbo].[LoanEntry]  WITH NOCHECK ADD  CONSTRAINT [fk_loanentry_loanid] FOREIGN KEY([pn_CompanyID], [fn_LoanID])
REFERENCES [dbo].[paym_Loan] ([pn_Companyid], [pn_LoanID])
GO
ALTER TABLE [dbo].[LoanEntry] CHECK CONSTRAINT [fk_loanentry_loanid]
GO
ALTER TABLE [dbo].[LoanPreclosure]  WITH CHECK ADD FOREIGN KEY([ApplicationID])
REFERENCES [dbo].[paym_LoanApply_employee] ([ApplicationID])
GO
ALTER TABLE [dbo].[PayInput]  WITH NOCHECK ADD  CONSTRAINT [fk_PayInput] FOREIGN KEY([pn_CompanyID], [pn_BranchID])
REFERENCES [dbo].[paym_Branch] ([pn_CompanyID], [pn_BranchID])
GO
ALTER TABLE [dbo].[PayInput] CHECK CONSTRAINT [fk_PayInput]
GO
ALTER TABLE [dbo].[paym_Branch]  WITH CHECK ADD  CONSTRAINT [fk_paym_Branch] FOREIGN KEY([pn_CompanyID])
REFERENCES [dbo].[paym_Company] ([pn_CompanyID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[paym_Branch] CHECK CONSTRAINT [fk_paym_Branch]
GO
ALTER TABLE [dbo].[paym_Category]  WITH CHECK ADD  CONSTRAINT [fk_Category_Company] FOREIGN KEY([pn_CompanyID])
REFERENCES [dbo].[paym_Company] ([pn_CompanyID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[paym_Category] CHECK CONSTRAINT [fk_Category_Company]
GO
ALTER TABLE [dbo].[paym_Deduction]  WITH CHECK ADD  CONSTRAINT [fk_Deduction_Company] FOREIGN KEY([pn_CompanyID])
REFERENCES [dbo].[paym_Company] ([pn_CompanyID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[paym_Deduction] CHECK CONSTRAINT [fk_Deduction_Company]
GO
ALTER TABLE [dbo].[paym_Department]  WITH CHECK ADD  CONSTRAINT [fk_Department_Company] FOREIGN KEY([pn_CompanyID])
REFERENCES [dbo].[paym_Company] ([pn_CompanyID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[paym_Department] CHECK CONSTRAINT [fk_Department_Company]
GO
ALTER TABLE [dbo].[paym_Designation]  WITH CHECK ADD  CONSTRAINT [fk_Designation_Company] FOREIGN KEY([pn_CompanyID])
REFERENCES [dbo].[paym_Company] ([pn_CompanyID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[paym_Designation] CHECK CONSTRAINT [fk_Designation_Company]
GO
ALTER TABLE [dbo].[paym_Division]  WITH CHECK ADD  CONSTRAINT [fk_Division_Company] FOREIGN KEY([pn_CompanyID])
REFERENCES [dbo].[paym_Company] ([pn_CompanyID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[paym_Division] CHECK CONSTRAINT [fk_Division_Company]
GO
ALTER TABLE [dbo].[paym_Earnings]  WITH CHECK ADD  CONSTRAINT [fk_Earnings_Company] FOREIGN KEY([pn_CompanyID])
REFERENCES [dbo].[paym_Company] ([pn_CompanyID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[paym_Earnings] CHECK CONSTRAINT [fk_Earnings_Company]
GO
ALTER TABLE [dbo].[paym_Emp_Deduction]  WITH NOCHECK ADD  CONSTRAINT [fk_paym_Deduction_Branch] FOREIGN KEY([pn_CompanyID], [pn_BranchID])
REFERENCES [dbo].[paym_Branch] ([pn_CompanyID], [pn_BranchID])
GO
ALTER TABLE [dbo].[paym_Emp_Deduction] CHECK CONSTRAINT [fk_paym_Deduction_Branch]
GO
ALTER TABLE [dbo].[paym_Emp_Deduction]  WITH NOCHECK ADD  CONSTRAINT [fk_paym_Deduction_Deduction] FOREIGN KEY([pn_CompanyID], [pn_DeductionID])
REFERENCES [dbo].[paym_Deduction] ([pn_CompanyID], [pn_DeductionID])
GO
ALTER TABLE [dbo].[paym_Emp_Deduction] CHECK CONSTRAINT [fk_paym_Deduction_Deduction]
GO
ALTER TABLE [dbo].[paym_Emp_Earnings]  WITH NOCHECK ADD  CONSTRAINT [fk_paym_Earnings_Branch] FOREIGN KEY([pn_CompanyID], [pn_BranchID])
REFERENCES [dbo].[paym_Branch] ([pn_CompanyID], [pn_BranchID])
GO
ALTER TABLE [dbo].[paym_Emp_Earnings] CHECK CONSTRAINT [fk_paym_Earnings_Branch]
GO
ALTER TABLE [dbo].[paym_Emp_Earnings]  WITH NOCHECK ADD  CONSTRAINT [fk_paym_Earnings_Earnings] FOREIGN KEY([pn_CompanyID], [pn_EarningsID])
REFERENCES [dbo].[paym_Earnings] ([pn_CompanyID], [pn_EarningsID])
GO
ALTER TABLE [dbo].[paym_Emp_Earnings] CHECK CONSTRAINT [fk_paym_Earnings_Earnings]
GO
ALTER TABLE [dbo].[paym_Employee]  WITH NOCHECK ADD  CONSTRAINT [fk_paym_Employee] FOREIGN KEY([pn_CompanyID], [pn_BranchID])
REFERENCES [dbo].[paym_Branch] ([pn_CompanyID], [pn_BranchID])
GO
ALTER TABLE [dbo].[paym_Employee] CHECK CONSTRAINT [fk_paym_Employee]
GO
ALTER TABLE [dbo].[paym_Employee]  WITH NOCHECK ADD  CONSTRAINT [fk_paym_Employee1] FOREIGN KEY([pn_CompanyID], [pn_BranchID])
REFERENCES [dbo].[paym_Branch] ([pn_CompanyID], [pn_BranchID])
GO
ALTER TABLE [dbo].[paym_Employee] CHECK CONSTRAINT [fk_paym_Employee1]
GO
ALTER TABLE [dbo].[paym_Grade]  WITH CHECK ADD  CONSTRAINT [fk_Grade_Company] FOREIGN KEY([pn_CompanyID])
REFERENCES [dbo].[paym_Company] ([pn_CompanyID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[paym_Grade] CHECK CONSTRAINT [fk_Grade_Company]
GO
ALTER TABLE [dbo].[paym_JobStatus]  WITH CHECK ADD  CONSTRAINT [fk_JobStatus_Company] FOREIGN KEY([pn_CompanyID])
REFERENCES [dbo].[paym_Company] ([pn_CompanyID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[paym_JobStatus] CHECK CONSTRAINT [fk_JobStatus_Company]
GO
ALTER TABLE [dbo].[paym_Level]  WITH CHECK ADD  CONSTRAINT [fk_Level_Company] FOREIGN KEY([pn_CompanyID])
REFERENCES [dbo].[paym_Company] ([pn_CompanyID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[paym_Level] CHECK CONSTRAINT [fk_Level_Company]
GO
ALTER TABLE [dbo].[paym_Loan]  WITH CHECK ADD  CONSTRAINT [fk_paym_loan] FOREIGN KEY([pn_Companyid])
REFERENCES [dbo].[paym_Company] ([pn_CompanyID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[paym_Loan] CHECK CONSTRAINT [fk_paym_loan]
GO
ALTER TABLE [dbo].[paym_OverHeadingCost]  WITH CHECK ADD  CONSTRAINT [fk_OverHeading_Company] FOREIGN KEY([pn_CompanyID])
REFERENCES [dbo].[paym_Company] ([pn_CompanyID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[paym_OverHeadingCost] CHECK CONSTRAINT [fk_OverHeading_Company]
GO
ALTER TABLE [dbo].[paym_PF]  WITH NOCHECK ADD  CONSTRAINT [fk_paym_PF] FOREIGN KEY([pn_CompanyID], [pn_BranchID])
REFERENCES [dbo].[paym_Branch] ([pn_CompanyID], [pn_BranchID])
GO
ALTER TABLE [dbo].[paym_PF] CHECK CONSTRAINT [fk_paym_PF]
GO
ALTER TABLE [dbo].[paym_Shift]  WITH CHECK ADD  CONSTRAINT [fk_Shift_Company] FOREIGN KEY([pn_CompanyID])
REFERENCES [dbo].[paym_Company] ([pn_CompanyID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[paym_Shift] CHECK CONSTRAINT [fk_Shift_Company]
GO
ALTER TABLE [dbo].[PayOutput_Deductions]  WITH CHECK ADD  CONSTRAINT [fk_paym_PayOutput_Deductions] FOREIGN KEY([pn_CompanyID])
REFERENCES [dbo].[paym_Company] ([pn_CompanyID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[PayOutput_Deductions] CHECK CONSTRAINT [fk_paym_PayOutput_Deductions]
GO
ALTER TABLE [dbo].[PayOutput_ESI]  WITH CHECK ADD  CONSTRAINT [fk_PayOutput_ESI] FOREIGN KEY([pn_CompanyID])
REFERENCES [dbo].[paym_Company] ([pn_CompanyID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[PayOutput_ESI] CHECK CONSTRAINT [fk_PayOutput_ESI]
GO
ALTER TABLE [dbo].[PayOutput_NetPay]  WITH CHECK ADD  CONSTRAINT [fk_PayOutput_NetPay] FOREIGN KEY([pn_CompanyID])
REFERENCES [dbo].[paym_Company] ([pn_CompanyID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[PayOutput_NetPay] CHECK CONSTRAINT [fk_PayOutput_NetPay]
GO
ALTER TABLE [dbo].[PayOutput_PF]  WITH CHECK ADD  CONSTRAINT [fk_PayOutput_PF] FOREIGN KEY([pn_CompanyID])
REFERENCES [dbo].[paym_Company] ([pn_CompanyID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[PayOutput_PF] CHECK CONSTRAINT [fk_PayOutput_PF]
GO
ALTER TABLE [dbo].[shift_balance]  WITH NOCHECK ADD  CONSTRAINT [fk_paym_Shift_Balance] FOREIGN KEY([pn_companyid], [pn_branchid], [pattern_code])
REFERENCES [dbo].[shift_pattern] ([pn_companyid], [pn_branchid], [pattern_code])
GO
ALTER TABLE [dbo].[shift_balance] CHECK CONSTRAINT [fk_paym_Shift_Balance]
GO
/****** Object:  StoredProcedure [dbo].[AssignAssetToEmployee]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[AssignAssetToEmployee]
    @pnCompanyId INT,
    @pnBranchId INT,
    @pnEmployeeId INT,
    @AssetName VARCHAR(100),
    @AssetSerialNumber VARCHAR(100),
    @AssetType VARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1 FROM Assets
        WHERE pn_CompanyID = @pnCompanyId
          AND BranchID = @pnBranchId
          AND Asset_name = @AssetName
          AND Asset_SerialNumber = @AssetSerialNumber
          AND Status = 'Active'
    )
    BEGIN
        -- Assign asset to employee in paym_Employee table
        UPDATE paym_Employee
        SET Asset_Name = @AssetName,
            Asset_SerialNumber = @AssetSerialNumber
        WHERE pn_CompanyID = @pnCompanyId
          AND pn_BranchID = @pnBranchId
          AND pn_EmployeeID = @pnEmployeeId;

        -- Update asset status and assign employee in Assets table
        UPDATE Assets
        SET Status = 'Assigned',
            AssetAssignedTo = @pnEmployeeId
        WHERE pn_CompanyID = @pnCompanyId
          AND BranchID = @pnBranchId
          AND Asset_name = @AssetName
          AND Asset_SerialNumber = @AssetSerialNumber
          AND Status = 'Active';

        -- Return updated asset details including AssetAssignedTo
        SELECT 
            pn_Assetid,
            pn_CompanyID,
            BranchID,
            Asset_name,
            Asset_SerialNumber,
            PurchaseDate,
            AssetValue,
            Status,
            Description,
            CreatedDate,
            AssetAssignedTo,
            @AssetType AS AssetType,
            'Asset assigned and marked as Assigned.' AS Message
        FROM Assets
        WHERE pn_CompanyID = @pnCompanyId
          AND BranchID = @pnBranchId
          AND Asset_name = @AssetName
          AND Asset_SerialNumber = @AssetSerialNumber;
    END
    ELSE
    BEGIN
        -- Return asset details with message when not found or already assigned
        SELECT 
            pn_Assetid,
            pn_CompanyID,
            BranchID,
            Asset_name,
            Asset_SerialNumber,
            PurchaseDate,
            AssetValue,
            Status,
            Description,
            CreatedDate,
            AssetAssignedTo,
            @AssetType AS AssetType,
            'Asset not found or already Assigned.' AS Message
        FROM Assets
        WHERE pn_CompanyID = @pnCompanyId
          AND BranchID = @pnBranchId
          AND Asset_name = @AssetName
          AND Asset_SerialNumber = @AssetSerialNumber;
    END
END

GO
/****** Object:  StoredProcedure [dbo].[CalculateGrossSalary]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[CalculateGrossSalary]
AS
BEGIN
    SET NOCOUNT ON;

    -- Temporary table to store Employee Allowances
    WITH EmployeeAllowances AS (
        SELECT DISTINCT
            e.pn_CompanyID,
            e.pn_BranchID,
            e.Employee_Full_Name,
            e.EmployeeCode,
            e.pn_EmployeeID,
            av.Grade_Name,
            av.Level_Name,
            av.v_EarningsName,
            av.Allowancetype,
            av.Cal_Based_on,
            CASE 
                WHEN av.Allowancetype = 'Fixed' THEN av.value
                WHEN av.Cal_Based_on = 'CTC' THEN (e.CTC * av.value / 100)
                WHEN av.Cal_Based_on = 'BasicPay' THEN (e.Basic_Salary * av.value / 100)
                ELSE 0
            END AS OriginalAmount,
            aset.Prorata_basis, -- Prorata flag specific to each earning
            av.d_order
        FROM 
            [dbo].[AllowanceValues] av
        JOIN 
            [dbo].[paym_Employee] e
            ON av.Grade_Name = e.Grade
            OR av.Level_Name = e.Grade
        LEFT JOIN (
            SELECT 
                pn_CompanyID, pn_BranchID, v_EarningsName, 
                MAX(Prorata_basis) AS Prorata_basis
            FROM 
                [dbo].[Allowancesettings]
            GROUP BY 
                pn_CompanyID, pn_BranchID, v_EarningsName
        ) aset
        ON av.pn_companyid = aset.pn_CompanyID
        AND av.pn_branchid = aset.pn_BranchID
        AND av.v_EarningsName = aset.v_EarningsName
        WHERE 
            av.pn_branchid = e.pn_BranchID
            AND (av.Allowancetype IN ('Fixed', 'Percentage'))
            AND NOT (av.c_Regular = 'N' AND av.payslip = 'N')
    ),
    AttendanceData AS (
        SELECT 
            tc.pn_EmployeeID,
            YEAR(tc.dates) AS Year,
            MONTH(tc.dates) AS Month,
            COUNT(DISTINCT MONTH(tc.dates)) AS MonthsWithAttendance,
            SUM(CASE WHEN tc.status = 'A' THEN 1 ELSE 0 END) + 
            SUM(CASE WHEN tc.status = 'HD' THEN 0.5 ELSE 0 END) AS AbsentDays,
            COUNT(tc.dates) AS TotalDays,
            COUNT(tc.dates) - 
            (SUM(CASE WHEN tc.status = 'A' THEN 1 ELSE 0 END) + 
             SUM(CASE WHEN tc.status = 'HD' THEN 0.5 ELSE 0 END)) AS PaidDays,
            SUM(CASE WHEN tc.status = 'P' THEN 1 ELSE 0 END) AS PresentDays,
            SUM(CASE WHEN tc.status = 'W' THEN 1 ELSE 0 END) AS Weekoffdays,
            SUM(CASE WHEN tc.status = 'L' THEN 1 ELSE 0 END) AS Leavedays,
            SUM(CASE WHEN tc.status = 'H' THEN 1 ELSE 0 END) AS Holidays,
            SUM(CASE WHEN tc.status = 'WFH' THEN 1 ELSE 0 END) AS WorkFromHome,
            SUM(CASE WHEN tc.status = 'HD' THEN 1 ELSE 0 END) AS HalfDay
        FROM 
            dbo.time_card tc
        GROUP BY 
            tc.pn_EmployeeID, YEAR(tc.dates), MONTH(tc.dates)
        HAVING COUNT(DISTINCT MONTH(tc.dates)) > 0  -- Only consider employees with attendance in this month
    ),
    GrossSalaryData AS (
        SELECT 
            emp.pn_CompanyID,
            emp.pn_BranchID,
            emp.Employee_Full_Name,
            emp.EmployeeCode,
            emp.pn_EmployeeID,
            emp.Basic_Salary,
            ad.Year,
            ad.Month,
            ad.TotalDays,
            ad.PaidDays,
            ad.AbsentDays,
            -- Calculate Earned Basic
            CASE 
                WHEN ad.TotalDays > 0 THEN 
                    (emp.Basic_Salary / ad.TotalDays) * ad.PaidDays
                ELSE 0 
            END AS Earned_Basic,
            -- Calculate Gross Salary
            (CASE 
                WHEN ad.TotalDays > 0 THEN 
                    (emp.Basic_Salary / ad.TotalDays) * ad.PaidDays
                ELSE 0 
            END + 
            COALESCE(MAX(CASE WHEN ea.d_order = 1 THEN 
                CASE WHEN ea.Prorata_basis = 'Y' THEN 
                    (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
                    ELSE ea.OriginalAmount END
                ELSE 0 END), 0) +
            COALESCE(MAX(CASE WHEN ea.d_order = 2 THEN 
                CASE WHEN ea.Prorata_basis = 'Y' THEN 
                    (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
                    ELSE ea.OriginalAmount END
                ELSE 0 END), 0) +
            COALESCE(MAX(CASE WHEN ea.d_order = 3 THEN 
                CASE WHEN ea.Prorata_basis = 'Y' THEN 
                    (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
                    ELSE ea.OriginalAmount END
                ELSE 0 END), 0) +
            COALESCE(MAX(CASE WHEN ea.d_order = 4 THEN 
                CASE WHEN ea.Prorata_basis = 'Y' THEN 
                    (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
                    ELSE ea.OriginalAmount END
                ELSE 0 END), 0) +
            COALESCE(MAX(CASE WHEN ea.d_order = 5 THEN 
                CASE WHEN ea.Prorata_basis = 'Y' THEN 
                    (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
                    ELSE ea.OriginalAmount END
                ELSE 0 END), 0) +
            COALESCE(MAX(CASE WHEN ea.d_order = 6 THEN 
                CASE WHEN ea.Prorata_basis = 'Y' THEN 
                    (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
                    ELSE ea.OriginalAmount END
                ELSE 0 END), 0) +
            COALESCE(MAX(CASE WHEN ea.d_order = 7 THEN 
                CASE WHEN ea.Prorata_basis = 'Y' THEN 
                    (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
                    ELSE ea.OriginalAmount END
                ELSE 0 END), 0) +
            COALESCE(MAX(CASE WHEN ea.d_order = 8 THEN 
                CASE WHEN ea.Prorata_basis = 'Y' THEN 
                    (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
                    ELSE ea.OriginalAmount END
                ELSE 0 END), 0) +
            COALESCE(MAX(CASE WHEN ea.d_order = 9 THEN 
                CASE WHEN ea.Prorata_basis = 'Y' THEN 
                    (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
                    ELSE ea.OriginalAmount END
                ELSE 0 END), 0) +
            COALESCE(MAX(CASE WHEN ea.d_order = 10 THEN 
                CASE WHEN ea.Prorata_basis = 'Y' THEN 
                    (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
                    ELSE ea.OriginalAmount END
                ELSE 0 END), 0)) AS Gross_Salary
        FROM 
            EmployeeAllowances ea
        JOIN 
            AttendanceData ad
            ON ea.pn_EmployeeID = ad.pn_EmployeeID
        JOIN 
            [dbo].[paym_Employee] emp
            ON emp.pn_EmployeeID = ea.pn_EmployeeID
        GROUP BY 
            emp.pn_CompanyID,
            emp.pn_BranchID,
            emp.Employee_Full_Name,
            emp.EmployeeCode,
            emp.pn_EmployeeID,
            emp.Basic_Salary,
            ad.Year,
            ad.Month,
            ad.TotalDays,
            ad.PaidDays,
            ad.AbsentDays
    )
    SELECT *
    FROM GrossSalaryData
    ORDER BY Year, Month, pn_EmployeeID; -- Order by Year, Month, and Employee ID
END;
GO
/****** Object:  StoredProcedure [dbo].[CalculateGrossSalaryAndESI]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[CalculateGrossSalaryAndESI]
AS
BEGIN
    WITH GrossSalaryCalculation AS (
        SELECT 
            av.pn_companyid,
            av.pn_branchid,
            e.Employee_Full_Name,
            e.EmployeeCode,
            e.Basic_Salary,  -- Basic Salary
            av.Level_Name,
            SUM(CASE 
                WHEN av.Allowancetype = 'Fixed' THEN av.value
                WHEN av.Cal_Based_on = 'CTC' THEN (e.CTC * av.value / 100)
                WHEN av.Cal_Based_on = 'BasicPay' THEN (e.Basic_Salary * av.value / 100)
                ELSE 0
            END) AS Total_Allowance_Amt,
            -- Calculate Gross Salary
            e.Basic_Salary + SUM(CASE 
                WHEN av.Allowancetype = 'Fixed' THEN av.value
                WHEN av.Cal_Based_on = 'CTC' THEN (e.CTC * av.value / 100)
                WHEN av.Cal_Based_on = 'BasicPay' THEN (e.Basic_Salary * av.value / 100)
                ELSE 0
            END) AS Gross_Salary
        FROM 
            [dbo].[AllowanceValues] av
        JOIN 
            [dbo].[paym_Employee] e
            ON av.Grade_Name = e.Grade
            OR av.Level_Name = e.Grade
        JOIN 
            [dbo].[Allowancesettings] aset
            ON av.pn_companyid = aset.pn_CompanyID
            AND av.pn_branchid = aset.pn_BranchID
            AND av.v_EarningsName = aset.v_EarningsName
        WHERE 
            av.pn_branchid = e.pn_BranchID -- Ensure they belong to the same branch
            AND (av.Allowancetype IN ('Fixed', 'Percentage')) -- Check allowance type
            AND aset.ESI = 'Y' -- Include only EarningsName where ESI is 'Y'
        GROUP BY 
            av.pn_companyid,
            av.pn_branchid,
            e.Employee_Full_Name,
            e.EmployeeCode,
            e.Basic_Salary,  -- Add Basic_Salary to the GROUP BY clause
            av.Level_Name
    )
    SELECT 
        gs.pn_companyid,
        gs.pn_branchid,
        gs.Employee_Full_Name,
        gs.EmployeeCode,
        gs.Basic_Salary,
        gs.Total_Allowance_Amt,
        gs.Gross_Salary,
        es.[Employee_Contribution(%)] AS Employee_Contribution,
        es.[Employer_Contribution(%)] AS Employer_Contribution,
        -- Calculate ESI Contributions dynamically and round to the next rupee
        CEILING(gs.Gross_Salary * es.[Employee_Contribution(%)] / 100) AS Employee_ESI_Contribution,
        CEILING(gs.Gross_Salary * es.[Employer_Contribution(%)] / 100) AS Employer_ESI_Contribution
    FROM 
        GrossSalaryCalculation gs
    JOIN 
        [dbo].[ESI_Settings] es
    ON 
        gs.pn_companyid = es.pn_CompanyID
    WHERE 
        gs.Gross_Salary >= es.Lower_Limit  -- Only show employees whose gross salary is greater than or equal to Lower_Limit
        AND gs.Gross_Salary <= es.Upper_Limit -- Only show employees whose gross salary is less than or equal to Upper_Limit
END;
GO
/****** Object:  StoredProcedure [dbo].[CalculateGrossSalaryWithBonus]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[CalculateGrossSalaryWithBonus]
AS
BEGIN
    SET NOCOUNT ON;

    -- Create a temporary table to store output from GetEmployeeAttendanceBonus
    CREATE TABLE #AttendanceBonus (
        pn_CompanyID INT,
        pn_BranchID INT,
        pn_EmployeeID INT,
        EmployeeCode NVARCHAR(50),
        Employee_Full_Name NVARCHAR(100),
        pn_CategoryId INT,
        v_CategoryName NVARCHAR(100),
        Year INT,
        Month INT,
        Status_A_Count INT,
        Attendance_bonus_type NVARCHAR(50),
        Attendance_Bonus_Value DECIMAL(18, 2)
    );

    -- Insert data from GetEmployeeAttendanceBonus into the temporary table
    INSERT INTO #AttendanceBonus
    EXEC dbo.GetEmployeeAttendanceBonus;

    -- Temporary table to store Employee Allowances
    WITH EmployeeAllowances AS (
        SELECT DISTINCT
            e.pn_CompanyID,
            e.pn_BranchID,
            e.Employee_Full_Name,
            e.EmployeeCode,
            e.pn_EmployeeID,
            av.Grade_Name,
            av.Level_Name,
            av.v_EarningsName,
            av.Allowancetype,
            av.Cal_Based_on,
            CASE 
                WHEN av.Allowancetype = 'Fixed' THEN av.value
                WHEN av.Cal_Based_on = 'CTC' THEN (e.CTC * av.value / 100)
                WHEN av.Cal_Based_on = 'BasicPay' THEN (e.Basic_Salary * av.value / 100)
                ELSE 0
            END AS OriginalAmount,
            aset.Prorata_basis,
            av.d_order
        FROM 
            [dbo].[AllowanceValues] av
        JOIN 
            [dbo].[paym_Employee] e
            ON av.Grade_Name = e.Grade
            OR av.Level_Name = e.Grade
        LEFT JOIN (
            SELECT 
                pn_CompanyID, pn_BranchID, v_EarningsName, 
                MAX(Prorata_basis) AS Prorata_basis
            FROM 
                [dbo].[Allowancesettings]
            GROUP BY 
                pn_CompanyID, pn_BranchID, v_EarningsName
        ) aset
        ON av.pn_companyid = aset.pn_CompanyID
        AND av.pn_branchid = aset.pn_BranchID
        AND av.v_EarningsName = aset.v_EarningsName
        WHERE 
            av.pn_branchid = e.pn_BranchID
            AND (av.Allowancetype IN ('Fixed', 'Percentage'))
            AND NOT (av.c_Regular = 'N' AND av.payslip = 'N')
    ),
    AttendanceData AS (
        SELECT 
            tc.pn_EmployeeID,
            YEAR(tc.dates) AS Year,
            MONTH(tc.dates) AS Month,
            COUNT(DISTINCT MONTH(tc.dates)) AS MonthsWithAttendance,
            SUM(CASE WHEN tc.status = 'A' THEN 1 ELSE 0 END) + 
            SUM(CASE WHEN tc.status = 'HD' THEN 0.5 ELSE 0 END) AS AbsentDays,
            COUNT(tc.dates) AS TotalDays,
            COUNT(tc.dates) - 
            (SUM(CASE WHEN tc.status = 'A' THEN 1 ELSE 0 END) + 
             SUM(CASE WHEN tc.status = 'HD' THEN 0.5 ELSE 0 END)) AS PaidDays
        FROM 
            dbo.time_card tc
        GROUP BY 
            tc.pn_EmployeeID, YEAR(tc.dates), MONTH(tc.dates)
        HAVING COUNT(DISTINCT MONTH(tc.dates)) > 0
    ),
    GrossSalaryData AS (
        SELECT 
            emp.pn_CompanyID,
            emp.pn_BranchID,
            emp.Employee_Full_Name,
            emp.EmployeeCode,
            emp.pn_EmployeeID,
            emp.Basic_Salary,
            ad.Year,
            ad.Month,
            ad.TotalDays,
            ad.PaidDays,
            ad.AbsentDays,
            CASE 
                WHEN ad.TotalDays > 0 THEN 
                    (emp.Basic_Salary / ad.TotalDays) * ad.PaidDays
                ELSE 0 
            END AS Earned_Basic,
            (
                CASE 
                    WHEN ad.TotalDays > 0 THEN 
                        (emp.Basic_Salary / ad.TotalDays) * ad.PaidDays
                    ELSE 0 
                END +
                SUM(CASE 
                    WHEN ea.d_order BETWEEN 1 AND 10 THEN
                        CASE 
                            WHEN ea.Prorata_basis = 'Y' THEN 
                                (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
                            ELSE ea.OriginalAmount
                        END
                    ELSE 0
                END)
            ) AS Gross_Salary
        FROM 
            EmployeeAllowances ea
        JOIN 
            AttendanceData ad
            ON ea.pn_EmployeeID = ad.pn_EmployeeID
        JOIN 
            [dbo].[paym_Employee] emp
            ON emp.pn_EmployeeID = ea.pn_EmployeeID
        GROUP BY 
            emp.pn_CompanyID,
            emp.pn_BranchID,
            emp.Employee_Full_Name,
            emp.EmployeeCode,
            emp.pn_EmployeeID,
            emp.Basic_Salary,
            ad.Year,
            ad.Month,
            ad.TotalDays,
            ad.PaidDays,
            ad.AbsentDays
    )
    -- Final result with Attendance Bonus
    SELECT 
        gs.pn_CompanyID,
        gs.pn_BranchID,
        gs.Employee_Full_Name,
        gs.EmployeeCode,
        gs.pn_EmployeeID,
        gs.Year,
        gs.Month,
        gs.Gross_Salary,
        ab.Attendance_Bonus_Value,
        (gs.Gross_Salary + ISNULL(ab.Attendance_Bonus_Value, 0)) AS Total_Value
    FROM 
        GrossSalaryData gs
    LEFT JOIN 
        #AttendanceBonus ab
    ON 
        gs.pn_CompanyID = ab.pn_CompanyID
        AND gs.pn_BranchID = ab.pn_BranchID
        AND gs.EmployeeCode = ab.EmployeeCode
        AND gs.Year = ab.Year
        AND gs.Month = ab.Month
    ORDER BY 
        gs.Year, gs.Month, gs.pn_EmployeeID;

    -- Drop the temporary table
    DROP TABLE #AttendanceBonus;
END;
GO
/****** Object:  StoredProcedure [dbo].[CalculateOvertimePay]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[CalculateOvertimePay]
AS
BEGIN
    -- Create a temporary table to store the output of the stored procedure
    CREATE TABLE #AllowanceData (
        pn_CompanyID INT,
        pn_BranchID INT,
        pn_EmployeeID INT,
        Employee_Full_Name VARCHAR(255),
        EmployeeCode VARCHAR(50),
        Year INT,
        Month INT,
        FullDayAbsences FLOAT,
        HalfDayAbsences FLOAT,
        TotalDaysInMonth FLOAT,
        TotalAbsentDays FLOAT,
        PaidDays FLOAT,
        TotalAllowance DECIMAL(18, 2)
    );

    -- Execute the stored procedure and insert its output into the temporary table
    INSERT INTO #AllowanceData
    EXEC GetEmployeeAllowancesWithFinalOT;

    -- Use a CTE to precompute the number of days in the month
    WITH CTE_TimeCard AS (
        SELECT 
            tc.*,
            DAY(EOMONTH(tc.dates)) AS Total_Days_In_Month
        FROM [dbo].[time_card] tc
    ),
    CTE_Overtime AS (
        SELECT 
            tc.pn_companyid,
            tc.pn_branchid,
            ep.pn_EmployeeID,
            tc.emp_code,
            e.Employee_Full_Name,
            c.v_CategoryName,
            MONTH(tc.dates) AS Month,
            YEAR(tc.dates) AS Year,
            SUM(((e.basic_salary / tc.Total_Days_In_Month * allowance.PaidDays) + ISNULL(allowance.TotalAllowance, 0)) / (tc.Total_Days_In_Month * 8) * o.Ot_Rate) AS TotalOverTimePay
        FROM 
            CTE_TimeCard tc
        JOIN 
            [dbo].[paym_Employee] e ON tc.emp_code = e.EmployeeCode  
        JOIN 
            [dbo].[paym_employee_profile1] ep ON e.pn_EmployeeID = ep.pn_EmployeeID
        JOIN 
            [dbo].[paym_category] c ON ep.pn_CategoryId = c.pn_CategoryId
        JOIN 
            [dbo].[OtslabNew] o ON c.v_CategoryName = o.Category_Name
        LEFT JOIN 
            #AllowanceData allowance ON tc.emp_code = allowance.EmployeeCode
            AND MONTH(tc.dates) = allowance.Month
            AND YEAR(tc.dates) = allowance.Year
        WHERE 
            CONVERT(TIME, CAST(tc.ot_hrs AS TIME)) BETWEEN CONVERT(TIME, o.Ot_From_Duration) AND CONVERT(TIME, o.Ot_To_Duration)
        GROUP BY 
            tc.pn_companyid,
            tc.pn_branchid,
            ep.pn_EmployeeID,
            tc.emp_code,
            e.Employee_Full_Name,
            c.v_CategoryName,
            MONTH(tc.dates),
            YEAR(tc.dates)
    )
    -- Update the paym_paybill table with the calculated TotalOverTimePay
    UPDATE pb
    SET pb.ot_amt = ot.TotalOverTimePay
    FROM [dbo].[paym_paybill] pb
    JOIN CTE_Overtime ot ON pb.EmployeeCode = ot.emp_code
        AND pb.pn_EmployeeID = ot.pn_EmployeeID
        AND MONTH(pb.d_date) = ot.Month
        AND YEAR(pb.d_date) = ot.Year
    WHERE pb.Flag = 'M';  -- Only update rows where Flag is 'M'

    -- Drop the temporary table after use
    DROP TABLE #AllowanceData;
END;
GO
/****** Object:  StoredProcedure [dbo].[CalculateProRataForCompanyBranch]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[CalculateProRataForCompanyBranch]
    @pn_CompanyID INT,
    @pn_BranchID INT
AS
BEGIN
    WITH PaidDaysCalculation AS (
        SELECT 
            TC.emp_code,
            TC.pn_CompanyID,
            TC.pn_BranchID,
            MONTH(TC.dates) AS Month,
            YEAR(TC.dates) AS Year,
            
            -- Calculate Present Days, Off Days, WorkFromHome, Holidays, Half Days, Leave Days, and Absent Days
            SUM(CASE WHEN TC.status = 'P' THEN 1 ELSE 0 END) AS PresentDays,
            SUM(CASE WHEN TC.status = 'W' THEN 1 ELSE 0 END) AS OffDays,
            SUM(CASE WHEN TC.status = 'WFH' THEN 1 ELSE 0 END) AS WorkFromHome,
            SUM(CASE WHEN TC.status = 'H' THEN 1 ELSE 0 END) AS Holidays,
            SUM(CASE WHEN TC.status = 'HD' THEN 1 ELSE 0 END) AS HalfDays,
            SUM(CASE WHEN TC.status = 'L' THEN 1 ELSE 0 END) AS LeaveDays,
            SUM(CASE WHEN TC.status = 'A' THEN 1 ELSE 0 END) AS AbsentDays,
            
            -- Calculate PaidDays using the given logic
            (SUM(CASE WHEN TC.status = 'P' THEN 1 ELSE 0 END) +   -- Present Days
             SUM(CASE WHEN TC.status = 'W' THEN 1 ELSE 0 END) +   -- Off Days
             (SUM(CASE WHEN TC.status = 'HD' THEN 1 ELSE 0 END) * 0.5) + -- Half Days (Half considered)
          
             SUM(CASE WHEN TC.status = 'H' THEN 1 ELSE 0 END) +   -- Holidays
             SUM(CASE WHEN TC.status = 'WFH' THEN 1 ELSE 0 END))  -- Work From Home
             AS PaidDays,

            -- Calculate Total Days in the month from the 'dates' column
            COUNT(*) AS TotalDays
        
        FROM [dbo].[time_card] TC
        WHERE TC.pn_CompanyID = @pn_CompanyID
          AND TC.pn_BranchID = @pn_BranchID
        GROUP BY TC.emp_code, TC.pn_CompanyID, TC.pn_BranchID, MONTH(TC.dates), YEAR(TC.dates)
    ),


    CalculatedValues AS (
        SELECT 
            ED.pn_CompanyID, ED.pn_BranchID,EDV.pn_EmployeeID, EDM.Allowance1, EDM.Allowance2, EDM.Allowance3,EDM.Allowance4, EDM.Allowance5,
			EDM.Allowance6, EDM.Allowance7, EDM.Allowance8, EDM.Allowance9, EDM.Allowance10,
			EDM.Deduction1,EDM.Deduction2, EDM.Deduction3,EDM.Deduction4, EDM.Deduction5, EDM.Deduction6,EDM.Deduction7,
			EDM.Deduction8, EDM.Deduction9, EDM.Deduction10,
            PE.EmployeeCode, PE.Employee_Full_Name, PDE.v_DesignationName,PD.v_DepartmentName,PG.v_GradeName, CAT.v_CategoryName,
			PEW.JoiningDate,PE.CTC,PDC.PaidDays, PDC.TotalDays,PDC.PresentDays,PDC.AbsentDays,PDC.OffDays,PDC.Holidays,PDC.LeaveDays,
            PDC.Month, PDC.Year, PC.CompanyName,PC.Address_Line1,PC.Address_Line2,PC.City, PC.ZipCode,
			

            -- Calculate EarnedBasic based on PaidDays and TotalDays
            PE.basic_salary AS BasicSalary,
            ROUND((PE.basic_salary / PDC.TotalDays) * PDC.PaidDays, 2) AS EarnedBasic,

			-- Calculate Actual Salary (CTC / 12)
             (PE.CTC / 12) AS ActualBasic,

            -- Calculate Allowances 1-10 based on prorata using PaidDays and TotalDays
          CASE 
    WHEN ED.Allowance1PRB = 'Y' AND COALESCE(EDV.Value1, '') != '' 
    THEN ROUND((COALESCE(EDV.Value1, 0) / PDC.TotalDays) * PDC.PaidDays, 2)
    ELSE ROUND(COALESCE (EDV.Value1, 0), 2)
END AS value1
,

            CASE 
    WHEN ED.Allowance2PRB = 'Y' AND COALESCE(EDV.Value2, '') != '' 
    THEN Round((COALESCE(EDV.Value2, 0) / PDC.TotalDays) * PDC.PaidDays, 2)
    ELSE ROUND(COALESCE(EDV.Value2, 0), 2)
END AS value2,

	CASE 
    WHEN ED.Allowance3PRB = 'Y' AND COALESCE(EDV.Value3, '') != '' 
    THEN ROUND((COALESCE(EDV.Value3, 0) / PDC.TotalDays) * PDC.PaidDays, 2)
    ELSE ROUND(COALESCE(EDV.Value3, 0), 2)
END AS value3,

			 CASE 
    WHEN ED.Allowance4PRB = 'Y' AND COALESCE(EDV.Value4, '') != '' 
    THEN ROUND((COALESCE(EDV.Value4, 0) / PDC.TotalDays) * PDC.PaidDays, 2)
    ELSE ROUND(COALESCE(EDV.Value4, 0), 2)
END AS value4,

			 CASE 
    WHEN ED.Allowance5PRB = 'Y' AND COALESCE(EDV.Value5, '') != '' 
    THEN ROUND((COALESCE(EDV.Value5, 0) / PDC.TotalDays) * PDC.PaidDays, 2)
    ELSE Round(COALESCE(EDV.Value5, 0), 2)
END AS value5,

			 CASE 
    WHEN ED.Allowance6PRB = 'Y' AND COALESCE(EDV.Value6, '') != '' 
    THEN Round((COALESCE(EDV.Value6, 0) / PDC.TotalDays) * PDC.PaidDays, 2)
    ELSE Round(COALESCE(EDV.Value6, 0), 2)
END AS value6,

			CASE 
    WHEN ED.Allowance7PRB = 'Y' AND COALESCE(EDV.Value7, '') != '' 
    THEN Round((COALESCE(EDV.Value7, 0) / PDC.TotalDays) * PDC.PaidDays, 2)
    ELSE Round(COALESCE(EDV.Value7, 0), 2)
END AS value7,

			CASE 
    WHEN ED.Allowance8PRB = 'Y' AND COALESCE(EDV.Value8, '') != '' 
    THEN Round((COALESCE(EDV.Value8, 0) / PDC.TotalDays) * PDC.PaidDays, 2)
    ELSE Round(COALESCE(EDV.Value8, 0), 2)
END AS value8,

			CASE 
    WHEN ED.Allowance9PRB = 'Y' AND COALESCE(EDV.Value9, '') != '' 
    THEN Round((COALESCE(EDV.Value9, 0) / PDC.TotalDays) * PDC.PaidDays, 2)
    ELSE Round(COALESCE(EDV.Value9, 0), 2)
END AS value9,


           
           CASE 
    WHEN ED.Allowance10PRB = 'Y' AND COALESCE(EDV.Value10, '') != '' 
    THEN Round((COALESCE(EDV.Value10, 0) / PDC.TotalDays) * PDC.PaidDays, 2)
    ELSE Round(COALESCE(EDV.Value10, 0), 2)
END AS value10,

            -- Calculate Deductions 1-10 based on prorata using PaidDays and TotalDays
            -- Similar logic for deductions
           CASE 
    WHEN ED.Deduction1PRB = 'Y' AND COALESCE(EDV.ValueA1, '') != '' 
    THEN Round((COALESCE(EDV.ValueA1, 0) / PDC.TotalDays) * PDC.PaidDays, 2)
    ELSE Round(COALESCE(EDV.ValueA1, 0), 2)
END AS valueA1,

			CASE 
    WHEN ED.Deduction2PRB = 'Y' AND COALESCE(EDV.ValueA2, '') != '' 
    THEN Round((COALESCE(EDV.ValueA2, 0) / PDC.TotalDays) * PDC.PaidDays, 2)
    ELSE Round(COALESCE(EDV.ValueA2, 0), 2)
END AS valueA2,

			CASE 
    WHEN ED.Deduction3PRB = 'Y' AND COALESCE(EDV.ValueA3, '') != '' 
    THEN Round((COALESCE(EDV.ValueA3, 0) / PDC.TotalDays) * PDC.PaidDays, 2)
    ELSE Round(COALESCE(EDV.ValueA3, 0), 2)
END AS valueA3,

			CASE 
    WHEN ED.Deduction4PRB = 'Y' AND COALESCE(EDV.ValueA4, '') != '' 
    THEN Round((COALESCE(EDV.ValueA4, 0) / PDC.TotalDays) * PDC.PaidDays, 2)
    ELSE Round(COALESCE(EDV.ValueA4, 0), 2)
END AS valueA4,

			CASE 
    WHEN ED.Deduction5PRB = 'Y' AND COALESCE(EDV.ValueA5, '') != '' 
    THEN Round((COALESCE(EDV.ValueA5, 0) / PDC.TotalDays) * PDC.PaidDays, 2)
    ELSE Round(COALESCE(EDV.ValueA5, 0), 2)
END AS valueA5,

			CASE 
    WHEN ED.Deduction6PRB = 'Y' AND COALESCE(EDV.ValueA6, '') != '' 
    THEN Round((COALESCE(EDV.ValueA6, 0) / PDC.TotalDays) * PDC.PaidDays, 2)
    ELSE Round(COALESCE(EDV.ValueA6, 0), 2)
END AS valueA6,

			CASE 
    WHEN ED.Deduction7PRB = 'Y' AND COALESCE(EDV.ValueA7, '') != '' 
    THEN Round((COALESCE(EDV.ValueA7, 0) / PDC.TotalDays) * PDC.PaidDays, 2)
    ELSE Round(COALESCE(EDV.ValueA7, 0), 2)
END AS valueA7,

			CASE 
    WHEN ED.Deduction8PRB = 'Y' AND COALESCE(EDV.ValueA8, '') != '' 
    THEN Round((COALESCE(EDV.ValueA8, 0) / PDC.TotalDays) * PDC.PaidDays, 2)
    ELSE COALESCE(EDV.ValueA8, 0)
END AS valueA8,


			CASE 
    WHEN ED.Deduction9PRB = 'Y' AND COALESCE(EDV.ValueA9, '') != '' 
    THEN Round((COALESCE(EDV.ValueA9, 0) / PDC.TotalDays) * PDC.PaidDays, 2)
    ELSE Round(COALESCE(EDV.ValueA9, 0), 2)
END AS valueA9,

			CASE 
    WHEN ED.Deduction10PRB = 'Y' AND COALESCE(EDV.ValueA10, '') != '' 
    THEN Round((COALESCE(EDV.ValueA10, 0) / PDC.TotalDays) * PDC.PaidDays, 2)
    ELSE Round(COALESCE(EDV.ValueA10, 0), 2)
END AS valueA10

            -- Other deductions (up to 10) handled similarly...
      FROM ProRataBasisMasters ED
    JOIN EarnDeductValuesMasters EDV 
        ON ED.pn_CompanyID = EDV.pn_CompanyID 
        AND ED.pn_BranchID = EDV.pn_BranchID
  
    JOIN paym_Employee PE 
        ON PE.pn_EmployeeID = EDV.pn_EmployeeID  -- Ensure this join is correctly placed
    JOIN paym_employee_profile1 EP 
        ON EP.pn_EmployeeID = PE.pn_EmployeeID  -- Use PE here since it has been joined above
    JOIN paym_Grade PG 
        ON PG.pn_GradeID = EP.pn_GradeId
    JOIN paym_Designation PDE 
        ON PDE.pn_DesignationID = EP.pn_DesignationId
    JOIN paym_Department PD 
        ON PD.pn_DepartmentID = EP.pn_DepartmentId
    JOIN paym_Company PC 
        ON PC.pn_CompanyID = EP.pn_CompanyID
    JOIN paym_Category CAT 
        ON CAT.pn_CategoryID = EP.pn_CategoryId
    JOIN paym_Employee_WorkDetails PEW 
        ON PEW.pn_EmployeeID = PE.pn_EmployeeID  -- Make sure alias matches
    JOIN PaidDaysCalculation PDC 
        ON PE.EmployeeCode = PDC.emp_code
		  JOIN EarnDeductMasters EDM 
	ON EDV.pn_CompanyID = EDM.pn_CompanyID 
	AND EDV.pn_BranchID = EDM.pn_BranchID
    ),
    GrossSalaryCalculation AS (
        SELECT *,
            -- Calculate Gross Salary as Earn edBasic + all Allowances (Null values treated as 0)
            EarnedBasic + 
            ISNULL(value1, 0) + 
            ISNULL(value2, 0) + 
            ISNULL(value3, 0) + 
            ISNULL(value4, 0) + 
            ISNULL(value5, 0) + 
            ISNULL(value6, 0) + 
            ISNULL(value7, 0) + 
            ISNULL(value8, 0) + 
            ISNULL(value9, 0) + 
            ISNULL(value10, 0) AS GrossSalary,


			 -- Calculate Total Allowances (Null values treated as 0)
            ISNULL(value1, 0) + 
            ISNULL(value2, 0) + 
            ISNULL(value3, 0) + 
            ISNULL(value4, 0) + 
            ISNULL(value5, 0) + 
            ISNULL(value6, 0) + 
            ISNULL(value7, 0) + 
            ISNULL(value8, 0) + 
            ISNULL(value9, 0) + 
            ISNULL(value10, 0) AS Earned_Amount,

            -- Calculate Total Deductions (Null values treated as 0)
            ISNULL(valueA1, 0) + 
            ISNULL(valueA2, 0) + 
            ISNULL(valueA3, 0) + 
            ISNULL(valueA4, 0) + 
            ISNULL(valueA5, 0) + 
            ISNULL(valueA6, 0) + 
            ISNULL(valueA7, 0) + 
            ISNULL(valueA8, 0) + 
            ISNULL(valueA9, 0) + 
            ISNULL(valueA10, 0) AS Deducted_Amount,

            -- Calculate Net Salary: GrossSalary - TotalDeductions
            (EarnedBasic + 
             ISNULL(value1, 0) + 
            ISNULL(value2, 0) + 
            ISNULL(value3, 0) + 
            ISNULL(value4, 0) + 
            ISNULL(value5, 0) + 
            ISNULL(value6, 0) + 
            ISNULL(value7, 0) + 
            ISNULL(value8, 0) + 
            ISNULL(value9, 0) + 
            ISNULL(value10, 0)) 
             - (ISNULL(valueA1, 0) + 
            ISNULL(valueA2, 0) + 
            ISNULL(valueA3, 0) + 
            ISNULL(valueA4, 0) + 
            ISNULL(valueA5, 0) + 
            ISNULL(valueA6, 0) + 
            ISNULL(valueA7, 0) + 
            ISNULL(valueA8, 0) + 
            ISNULL(valueA9, 0) + 
            ISNULL(valueA10, 0)) AS NetSalary
        FROM CalculatedValues
    )
    INSERT INTO [dbo].[paym_paybill]
           ([pn_CompanyID]
           ,[pn_BranchID]
           ,[pn_EmployeeID]
           ,[EmployeeCode]
           ,[Employee_First_Name]
           ,[DesignationName]
           ,[DepartmentName]
           ,[GradeName]
           ,[CategoryName]
           ,[JoiningDate]
           ,[d_date]
           ,[Earn_Amount]
           ,[Ded_Amount]
           ,[NetPay]
           ,[Earned_Basic]
           ,[Gross_salary]
           ,[Net_salary]
           ,[EPF]
           ,[FPF]
           ,[period_code]
           ,[max_amount]
           ,[Act_Basic]
           ,[Calc_Days]
           ,[Paid_Days]
           ,[Present_Days]
           ,[Absent_Days]
           ,[WeekOffDays]
           ,[Holidays]
           ,[TotLeave_Days]
           ,[ot_hrs]
           ,[ot_value]
           ,[ot_amt]
           ,[Allowance1]
           ,[value1]
           ,[Allowance2]
           ,[value2]
           ,[Allowance3]
           ,[value3]
           ,[Allowance4]
           ,[value4]
           ,[Allowance5]
           ,[value5]
           ,[Allowance6]
           ,[value6]
           ,[Allowance7]
           ,[value7]
           ,[Allowance8]
           ,[value8]
           ,[Allowance9]
           ,[value9]
           ,[Allowance10]
           ,[value10]
           ,[Deduction1]
           ,[valueA1]
           ,[Deduction2]
           ,[valueA2]
           ,[Deduction3]
           ,[valueA3]
           ,[Deduction4]
           ,[valueA4]
           ,[Deduction5]
           ,[valueA5]
           ,[Deduction6]
           ,[valueA6]
           ,[Deduction7]
           ,[valueA7]
           ,[Deduction8]
           ,[valueA8]
           ,[Deduction9]
           ,[valueA9]
           ,[Deduction10]
           ,[valueA10]
           ,[CompanyName]
           ,[Address_line1]
           ,[Address_Line2]
           ,[City]
           ,[Zipcode])
    SELECT 
           @pn_CompanyID
           ,@pn_BranchID
           ,pn_EmployeeID
           ,EmployeeCode
           ,Employee_Full_Name
           ,v_DesignationName
           ,v_DepartmentName
           ,v_GradeName
           ,v_CategoryName
           ,JoiningDate
           ,DATEFROMPARTS(Year, Month, 1) AS d_date  -- Use the month and year from the time_card table
           ,Earned_Amount
           ,Deducted_Amount
           ,NetSalary
           ,EarnedBasic
           ,GrossSalary
           ,NetSalary
           ,0  -- EPF
           ,0  -- FPF
           ,0  -- period_code
           ,CTC  -- max_amount
           ,ActualBasic
           ,TotalDays  -- Calc_Days
           ,PaidDays
           ,PresentDays
           ,AbsentDays
           ,OffDays  -- WeekOffDays
           ,Holidays
           ,LeaveDays  -- TotLeave_Days
           ,0  -- ot_hrs
           ,0  -- ot_value
           ,0  -- ot_amt
           ,Allowance1  -- Allowance1-10
           ,value1
           ,Allowance2  -- Allowance2-10
           ,value2
           ,Allowance3  -- Allowance3-10
           ,value3
           ,Allowance4  -- Allowance4-10
           ,value4
           ,Allowance5  -- Allowance5-10
           ,value5
           ,Allowance6  -- Allowance6-10
           ,value6
           ,Allowance7  -- Allowance7-10
           ,value7
           ,Allowance8  -- Allowance8-10
           ,value8
           ,Allowance9  -- Allowance9-10
           ,value9
           ,Allowance10  -- Allowance10
           ,value10
           ,Deduction1  -- Deduction1-10
           ,valueA1
           ,Deduction2  -- Deduction2-10
           ,valueA2
           ,Deduction3  -- Deduction3-10
           ,valueA3
           ,Deduction4  -- Deduction4-10
           ,valueA4
           ,Deduction5  -- Deduction5 -10
           ,valueA5
           ,Deduction6  -- Deduction6-10
           ,valueA6
           ,Deduction7  -- Deduction7-10
           ,valueA7
           ,Deduction8  -- Deduction8-10
           ,valueA8
           ,Deduction9  -- Deduction9-10
           ,valueA9
           ,Deduction10  -- Deduction10
           ,valueA10
           ,CompanyName
           ,Address_Line1
           ,Address_Line2
           ,City
           ,ZipCode
    FROM GrossSalaryCalculation
    WHERE NOT EXISTS (
        SELECT 1
        FROM [dbo].[paym_paybill] PP
        WHERE PP.pn_CompanyID = @pn_CompanyID
          AND PP.pn_BranchID = @pn_BranchID
          AND PP.pn_EmployeeID = GrossSalaryCalculation.pn_EmployeeID
          AND PP.d_date = DATEFROMPARTS(GrossSalaryCalculation.Year, GrossSalaryCalculation.Month, 1)
    );
END;
GO
/****** Object:  StoredProcedure [dbo].[CalculateTotalDeductions]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[CalculateTotalDeductions]
AS
BEGIN
    -- Temporary tables to hold the results of the table-valued functions
    CREATE TABLE #GrossSalaryAndESI (
        pn_companyid INT,
        pn_branchid INT,
        Year INT,
        Month INT,
        Employee_Full_Name NVARCHAR(50),
        EmployeeCode NVARCHAR(50),
        Earned_Basic_Salary DECIMAL(18, 2),
        Total_Allowance_Amt DECIMAL(18, 2),
        Gross_Salary DECIMAL(18, 2),
        TotalDays FLOAT,
        Paid_Days FLOAT,
        Employee_Contribution FLOAT,
        Employer_Contribution FLOAT,
        Employee_ESI_Contribution DECIMAL(18, 2),
        Employer_ESI_Contribution DECIMAL(18, 2),
        Total_ESI_Contribution DECIMAL(18, 2),
        ESI_D_Order INT,
        Type NVARCHAR(50)
    );

    CREATE TABLE #CTCLimits (
        pn_CompanyID INT,
        pn_BranchID INT,
        EmployeeCode NVARCHAR(50),
        Employee_Full_Name NVARCHAR(50),
        State NVARCHAR(50),
        Lower_limit DECIMAL(18, 2),
        Upper_limit NVARCHAR(20),
        CTC DECIMAL(18, 2),
        Annual_basis DECIMAL(18, 2),
        Half_yearly DECIMAL(18, 2),
        Monthly_Amount DECIMAL(18, 2),
        d_order INT,
        Type NVARCHAR(50)
    );

    CREATE TABLE #PFContributions (
        pn_companyid INT,
        pn_branchid INT,
        emp_code NVARCHAR(50),
        emp_name NVARCHAR(50),
        basic_salary DECIMAL(18, 2),
        Level_Name NVARCHAR(50),
        PF char(1),
        Month INT,
        Year INT,
        Absent float,
        Present float,
        Leave float,
        Holiday float,
        Work_From_Home float,
        HalfDay float,
        WeekOff float,
        PaidDays float,
        TotalDaysInMonth INT,
        Fix_Amount DECIMAL(18, 2),
        Earn_Amt DECIMAL(18, 2),
        Total_Earn_Amount DECIMAL(18, 2),
        PF_Contribution DECIMAL(18, 2),
        EPF_Contribution DECIMAL(18, 2),
        EPS_Contribution DECIMAL(18, 2),
        Total_Contribution DECIMAL(18, 2)
    );

    -- Insert data from the first table-valued function
    INSERT INTO #GrossSalaryAndESI
    SELECT * FROM dbo.CalculateGrossSalaryAndESIwithprorataDisplay();

    -- Insert data from the second table-valued function
    INSERT INTO #CTCLimits
    SELECT * 
    FROM dbo.CheckCTCLimitsDisplay()
    ORDER BY pn_CompanyID, pn_BranchID, EmployeeCode;

    -- Insert data from the PF contributions function
    INSERT INTO #PFContributions
    SELECT * FROM dbo.Total_PF(); -- Replace with your actual function name

    -- Join the results and calculate Total Deduction
    SELECT 
        g.pn_companyid,
        g.pn_branchid,
        g.Year,
        g.Month,
        g.EmployeeCode,
        ISNULL(c.Monthly_Amount, 0) AS PT_Monthly_Amount,
        ISNULL(g.Total_ESI_Contribution, 0) AS TOTALESI,
        ISNULL(p.Total_Contribution, 0) AS TotalPFContribution,
        ISNULL(c.Monthly_Amount, 0) + ISNULL(g.Total_ESI_Contribution, 0) + ISNULL(p.Total_Contribution, 0) AS TotalDeductionAmount
    INTO #Result
    FROM #GrossSalaryAndESI g
    LEFT JOIN #CTCLimits c
        ON g.pn_companyid = c.pn_CompanyID
        AND g.pn_branchid = c.pn_BranchID
        AND g.EmployeeCode = c.EmployeeCode
    LEFT JOIN #PFContributions p
        ON g.pn_companyid = p.pn_companyid
        AND g.pn_branchid = p.pn_branchid
		AND g.EmployeeCode = p.emp_code
        AND g.Month = p.Month
        AND g.Year = p.Year;

    -- Return the results
    SELECT 
        r.pn_companyid,
        r.pn_branchid,
        r.Year,
        r.Month,
        r.EmployeeCode,
        r.PT_Monthly_Amount,
        r.TOTALESI,
        r.TotalPFContribution,
        r.TotalDeductionAmount
    FROM #Result r;

    -- Cleanup temporary tables
    DROP TABLE #GrossSalaryAndESI;
    DROP TABLE #CTCLimits;
    DROP TABLE #PFContributions;
    DROP TABLE #Result;
END;
GO
/****** Object:  StoredProcedure [dbo].[CheckCTCLimitsonlybranchpt]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[CheckCTCLimitsonlybranchpt]
    @CompanyID INT,
    @BranchID INT
AS
BEGIN
    -- Select employees and tax slab information where CTC fits between Lower_limit and Upper_limit
    SELECT 
        e.pn_CompanyID,
        e.pn_BranchID,
        e.EmployeeCode,
        e.Employee_Full_Name,
        pt.State,
        pt.Lower_limit,
        pt.Upper_limit,
        e.CTC,
        pt.Annual_basis,
        pt.Half_yearly,
        pt.Monthly_Amount
		
    FROM 
        dbo.paym_Employee e
    INNER JOIN 
        dbo.Professional_Tax pt
        ON e.pn_CompanyID = pt.pn_companyid 
        AND e.pn_BranchID = pt.pn_branchid
    WHERE 
        e.pn_CompanyID = @CompanyID
        AND e.pn_BranchID = @BranchID
        -- Use TRY_CAST to safely convert Upper_limit to numeric and handle non-numeric values
        AND e.CTC BETWEEN pt.Lower_limit AND ISNULL(TRY_CAST(pt.Upper_limit AS numeric(10,2)), e.CTC + 1)
    ORDER BY 
        e.pn_CompanyID, e.pn_BranchID, e.EmployeeCode;
END
GO
/****** Object:  StoredProcedure [dbo].[CombinedPaybillProcessing]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[CombinedPaybillProcessing]
AS
BEGIN
    -- Begin a transaction to ensure all steps are executed or none in case of failure
    BEGIN TRANSACTION;

    BEGIN TRY
        -- Execute each stored procedure in order
        EXEC GetAttendanceSummaryWithAllowances;
        EXEC UpdateESIContributionsInPaybill;
        EXEC CalculateOvertimePay;
        EXEC UpdatePTinpaybill;

        -- Commit the transaction if all succeed
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- Rollback the transaction in case of any error
        ROLLBACK TRANSACTION;

        -- Print or rethrow the error for debugging
        THROW;
    END CATCH
END;
GO
/****** Object:  StoredProcedure [dbo].[DisplayOvertimePay]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[DisplayOvertimePay]
AS
BEGIN
    -- Use a CTE to precompute the number of days in the month
    WITH CTE_TimeCard AS (
        SELECT 
            tc.*,
            DAY(EOMONTH(tc.dates)) AS Total_Days_In_Month
        FROM [dbo].[time_card] tc
    ),
    CTE_Overtime AS (
        SELECT 
            tc.pn_companyid,
            tc.pn_branchid,
            ep.pn_EmployeeID,
            tc.emp_code AS EmployeeCode,
            e.Employee_Full_Name,
            c.v_CategoryName,
            MONTH(tc.dates) AS Month,
            YEAR(tc.dates) AS Year,
            SUM(((e.basic_salary / tc.Total_Days_In_Month * allowance.PaidDays) + ISNULL(allowance.TotalAllowance, 0)) / (tc.Total_Days_In_Month * 8) * o.Ot_Rate) AS TotalOverTimePay
        FROM 
            CTE_TimeCard tc
        JOIN 
            [dbo].[paym_Employee] e ON tc.emp_code = e.EmployeeCode  
        JOIN 
            [dbo].[paym_employee_profile1] ep ON e.pn_EmployeeID = ep.pn_EmployeeID
        JOIN 
            [dbo].[paym_category] c ON ep.pn_CategoryId = c.pn_CategoryId
        JOIN 
            [dbo].[OtslabNew] o ON c.v_CategoryName = o.Category_Name
        -- Replace the temp table with the table-valued function
        CROSS APPLY dbo.GetEmployeeAllowancesWithFinalOTDisplay() allowance
        WHERE 
            CONVERT(TIME, CAST(tc.ot_hrs AS TIME)) BETWEEN CONVERT(TIME, o.Ot_From_Duration) AND CONVERT(TIME, o.Ot_To_Duration)
            AND tc.emp_code = allowance.EmployeeCode  -- Matching the employee code
            AND MONTH(tc.dates) = allowance.Month     -- Matching the month
            AND YEAR(tc.dates) = allowance.Year       -- Matching the year
        GROUP BY 
            tc.pn_companyid,
            tc.pn_branchid,
            ep.pn_EmployeeID,
            tc.emp_code,
            e.Employee_Full_Name,
            c.v_CategoryName,
            MONTH(tc.dates),
            YEAR(tc.dates)
    )
    -- Display the calculated TotalOverTimePay instead of updating the paym_paybill table
    SELECT 
        ot.pn_companyid AS CompanyID,
        ot.pn_branchid AS BranchID,
        ot.pn_EmployeeID AS EmployeeID,
        ot.EmployeeCode,
        ot.Employee_Full_Name AS EmployeeName,
        ot.Month,
        ot.Year,
        ot.TotalOverTimePay
    FROM 
        CTE_Overtime ot;
END;
GO
/****** Object:  StoredProcedure [dbo].[FinalSalaryCalculation2]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE PROCEDURE [dbo].[FinalSalaryCalculation2] 
    @EmployeeCode VARCHAR(50),
    @Month INT,
    @Year INT,
    @D_dates datetime
AS
BEGIN
    DECLARE @workingdays INT;
    DECLARE @paiddays INT;
    DECLARE @firstOfMonth DATE = DATEFROMPARTS(@Year, @Month, 1);
    DECLARE @lastOfMonth DATE = EOMONTH(@firstOfMonth);
	
    -- Calculate working days in the specified month
    SELECT @workingdays = COUNT(*) 
    FROM time_card 
    WHERE emp_code = @EmployeeCode
      AND dates BETWEEN @firstOfMonth AND @lastOfMonth;

    -- Calculate paid days in the specified month
    SELECT @paiddays = COUNT(CASE WHEN status = 'P' THEN 1 END) 
                        + COUNT(CASE WHEN status = 'W' THEN 1 END) 
                        + COUNT(CASE WHEN status = 'H' THEN 1 END) 
                        + COUNT(CASE WHEN status = 'L' THEN 1 END)
    FROM time_card 
    WHERE emp_code = @EmployeeCode
      AND dates BETWEEN @firstOfMonth AND @lastOfMonth;

    DECLARE @Earn_Amount FLOAT = 0; 
    DECLARE @Ded_Amount FLOAT = 0;
    DECLARE @NetPay FLOAT = 0; 
    DECLARE @Earned_Basic FLOAT = 0; 
    DECLARE @Gross_salary FLOAT = 0; 
    DECLARE @Net_salary FLOAT = 0; 
    DECLARE @PF_Pct FLOAT = 0; 
    DECLARE @ESI_Pct FLOAT = 0;
    DECLARE @FPF FLOAT = 0; 
    DECLARE @max_amount FLOAT = 0; 
    DECLARE @Act_Basic FLOAT = 0; 
    DECLARE @Calc_Days FLOAT = 0; 
    DECLARE @Paid_Days FLOAT = 0; 
    DECLARE @Present_Days FLOAT = 0; 
    DECLARE @Absent_Days FLOAT = 0; 
    DECLARE @WeekOffDays FLOAT = 0; 
    DECLARE @Holidays FLOAT = 0; 
    DECLARE @TotLeave FLOAT = 0; 
    DECLARE @ot_value FLOAT = 0; 
    DECLARE @ot_amt FLOAT = 0; 
    DECLARE @value1 FLOAT = 0;
    DECLARE @value2 FLOAT = 0;
    DECLARE @value3 FLOAT = 0;
    DECLARE @value4 FLOAT = 0;
    DECLARE @value5 FLOAT = 0;
    DECLARE @value6 FLOAT = 0;
    DECLARE @value7 FLOAT = 0;
    DECLARE @value8 FLOAT = 0;
    DECLARE @value9 FLOAT = 0;
    DECLARE @value10 FLOAT = 0;
    DECLARE @valueA1 FLOAT = 0;
    DECLARE @valueA2 FLOAT = 0;
    DECLARE @valueA3 FLOAT = 0;
    DECLARE @valueA4 FLOAT = 0;
    DECLARE @valueA5 FLOAT = 0;
    DECLARE @valueA6 FLOAT = 0;
    DECLARE @valueA7 FLOAT = 0;
    DECLARE @valueA8 FLOAT = 0;
    DECLARE @valueA9 FLOAT = 0;
    DECLARE @valueA10 FLOAT = 0;
    DECLARE @MonthlySalary FLOAT;

    SELECT 
        @Earn_Amount = Earn_Amount,
        @Ded_Amount = Ded_Amount,
        @NetPay = NetPay,
        @Earned_Basic = Earned_Basic,
        @Gross_salary = Gross_salary,
        @Net_salary = Net_salary,
        @PF_Pct = EPF,
        @FPF = FPF,
        @max_amount = max_amount,
        @Act_Basic = Act_Basic,
        @Present_Days = Present_Days,
        @Absent_Days = Absent_Days,
        @WeekOffDays = WeekOffDays,
        @Holidays = Holidays,
        @Totleave = TotLeave_Days,
        @ot_value = ot_value,
        @ot_amt = ot_amt,
        @value1 = value1,
        @value2 = value2,
        @value3 = value3,
        @value4 = value4,
        @value5 = value5,
        @value6 = value6,
        @value7 = value7,
        @value8 = value8,
        @value9 = value9,
        @value10 = value10,
        @valueA1 = valueA1,
        @valueA2 = valueA2,
        @valueA3 = valueA3,
        @valueA4 = valueA4,
        @valueA5 = valueA5,
        @valueA6 = valueA6,
        @valueA7 = valueA7,
        @valueA8 = valueA8,
        @valueA9 = valueA9,
        @valueA10 = valueA10
    FROM paym_paybill 
    WHERE EmployeeCode = @EmployeeCode and d_date = @D_dates

	DECLARE @HRA FLOAT = @Act_Basic * (@value1 / 100.0);
    DECLARE @TotalAllowances FLOAT = @HRA + @value2 + @value3 + @value4 + @value5 + @value6 + @value7 + @value8 + @value9 + @value10;
    DECLARE @GrossPay FLOAT = @Act_Basic + @TotalAllowances;
    DECLARE @PF_Amount FLOAT = @Act_Basic * (@PF_Pct / 100.0);
    DECLARE @ESI_Amount FLOAT = @GrossPay * (@valueA1 / 100.0);
	

    SET @MonthlySalary = CEILING(
        (@Act_Basic / @workingdays) * @paiddays 
        + @TotalAllowances 
        - (@PF_Amount + @ESI_Amount + @valueA2 + @valueA3 + @valueA4 + @valueA5 + @valueA6 + @valueA7 + @valueA8 + @valueA9 + @valueA10)
    );

    SELECT @MonthlySalary AS MonthlySalary;
END;

GO
/****** Object:  StoredProcedure [dbo].[GetAttendanceSummary]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[GetAttendanceSummary]
    @Month INT,
    @Year INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Calculate StartDate and EndDate based on Month and Year
    DECLARE @StartDate DATE = DATEFROMPARTS(@Year, @Month, 1);
    DECLARE @EndDate DATE = EOMONTH(@StartDate);

    SELECT 
        tc.pn_companyid,
        tc.pn_branchid,
        tc.pn_EmployeeID,
        tc.emp_code,
        tc.emp_name,
        tc.shift_code,
        emp.CTC,
        emp.basic_salary,
        emp.Grade,
        emp.Overall_Experience,
        COUNT(tc.dates) AS Total_Calculated_Days,
        SUM(CASE WHEN tc.status = 'P' THEN 1 ELSE 0 END) AS Present,
        SUM(CASE WHEN tc.status = 'A' THEN 1 ELSE 0 END) AS Absent,
        SUM(CASE WHEN tc.status = 'L' THEN 1 ELSE 0 END) AS Leave,
        SUM(CASE WHEN tc.status = 'H' THEN 1 ELSE 0 END) AS Holiday,
        SUM(CASE WHEN tc.status = 'WFH' THEN 1 ELSE 0 END) AS Work_From_Home,
        SUM(CASE WHEN tc.status = 'HD' THEN 1 ELSE 0 END) AS HalfDay,
        SUM(CASE WHEN tc.status = 'W' THEN 1 ELSE 0 END) AS WeekOff,
        -- Calculate Paid Days considering Half Days and Leaves
        SUM(CASE WHEN tc.status IN ('P', 'W', 'H', 'WFH', 'L') THEN 1 ELSE 0 END) 
        + SUM(CASE WHEN tc.status = 'HD' THEN 0.5 ELSE 0 END) AS Paid_Days,
        -- Calculate Earned Basic
        CASE 
            WHEN COUNT(tc.dates) > 0 THEN 
                (emp.basic_salary / COUNT(tc.dates)) * 
                (
                    SUM(CASE WHEN tc.status IN ('P', 'W', 'H', 'WFH', 'L') THEN 1 ELSE 0 END) 
                    + SUM(CASE WHEN tc.status = 'HD' THEN 0.5 ELSE 0 END)
                )
            ELSE 0 
        END AS Earned_Basic,
        -- Additional fields from related tables
        dp.v_DesignationName,
        dpt.v_DepartmentName,
        ct.v_CategoryName,
        ep.d_Date AS JoiningDate,
        co.CompanyName,
        co.Address_Line1,
        co.Address_Line2,
        co.City,
        co.ZipCode
    FROM 
        dbo.time_card tc
    INNER JOIN 
        dbo.paym_Employee emp ON tc.pn_EmployeeID = emp.pn_EmployeeID
    INNER JOIN 
        dbo.paym_employee_profile1 ep ON emp.pn_EmployeeID = ep.pn_EmployeeID
    INNER JOIN 
        dbo.paym_Designation dp ON ep.pn_DesignationId = dp.pn_DesignationId
    INNER JOIN 
        dbo.paym_Department dpt ON ep.pn_DepartmentId = dpt.pn_DepartmentId
    INNER JOIN 
        dbo.paym_Category ct ON ep.pn_CategoryId = ct.pn_CategoryId
    INNER JOIN 
        dbo.paym_Company co ON ep.pn_CompanyID = co.pn_CompanyID
    WHERE 
        tc.dates BETWEEN @StartDate AND @EndDate
    GROUP BY 
        tc.pn_companyid,
        tc.pn_branchid,
        tc.pn_EmployeeID,
        tc.emp_code,
        tc.emp_name,
        tc.shift_code,
        emp.CTC,
        emp.basic_salary,
        emp.Grade,
        emp .Overall_Experience,
        dp.v_DesignationName,
        dpt.v_DepartmentName,
        ct.v_CategoryName,
        ep.d_Date,
        co.CompanyName,
        co.Address_Line1,
        co.Address_Line2,
        co.City,
        co.ZipCode
END

GO
/****** Object:  StoredProcedure [dbo].[GetAttendanceSummaryInsertquery]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[GetAttendanceSummaryInsertquery]
    @Month INT,
    @Year INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Calculate StartDate and EndDate based on Month and Year
    DECLARE @StartDate DATE = DATEFROMPARTS(@Year, @Month, 1);
    DECLARE @EndDate DATE = EOMONTH(@StartDate);

    -- Insert selected data into paym_paybill table
    INSERT INTO [dbo].[paym_paybill]
           ([pn_CompanyID],
            [pn_BranchID],
            [pn_EmployeeID],
            [EmployeeCode],
            [Employee_First_Name],
            [DesignationName],
            [DepartmentName],
            [GradeName],
            [CategoryName],
            [JoiningDate],
            [d_date],
            [Earned_Basic],
            [Act_Basic],
            [Calc_Days],
            [Paid_Days],
            [Present_Days],
            [Absent_Days],
            [WeekOffDays],
            [Holidays],
            [TotLeave_Days],
            [CompanyName],
            [Address_line1],
            [Address_Line2],
            [City],
            [Zipcode])
    SELECT 
        tc.pn_companyid AS [pn_CompanyID],
        tc.pn_branchid AS [pn_BranchID],
        tc.pn_EmployeeID AS [pn_EmployeeID],
        tc.emp_code AS [EmployeeCode],
        tc.emp_name AS [Employee_First_Name],
        dp.v_DesignationName AS [DesignationName],
        dpt.v_DepartmentName AS [DepartmentName],
        emp.Grade AS [GradeName],
        ct.v_CategoryName AS [CategoryName],
        ep.d_Date AS [JoiningDate],
        GETDATE() AS [d_date], -- Use current date for d_date
        CASE 
            WHEN COUNT(tc.dates) > 0 THEN 
                (emp.basic_salary / COUNT(tc.dates)) * 
                (
                    SUM(CASE WHEN tc.status IN ('P', 'W', 'H', 'WFH', 'L') THEN 1 ELSE 0 END) 
                    + SUM(CASE WHEN tc.status = 'HD' THEN 0.5 ELSE 0 END)
                )
            ELSE 0 
        END AS [Earned_Basic],
        emp.basic_salary AS [Act_Basic],
        COUNT(tc.dates) AS [Calc_Days],
        SUM(CASE WHEN tc.status IN ('P', 'W', 'H', 'WFH', 'L') THEN 1 ELSE 0 END) 
        + SUM(CASE WHEN tc.status = 'HD' THEN 0.5 ELSE 0 END) AS [Paid_Days],
        SUM(CASE WHEN tc.status = 'P' THEN 1 ELSE 0 END) AS [Present_Days],
        SUM(CASE WHEN tc.status = 'A' THEN 1 ELSE 0 END) AS [Absent_Days],
        SUM(CASE WHEN tc.status = 'W' THEN 1 ELSE 0 END) AS [WeekOffDays],
        SUM(CASE WHEN tc.status = 'H' THEN 1 ELSE 0 END) AS [Holidays],
        SUM(CASE WHEN tc.status = 'L' THEN 1 ELSE 0 END) AS [TotLeave_Days],
        co.CompanyName AS [CompanyName],
        co.Address_Line1 AS [Address_line1],
        co.Address_Line2 AS [Address_Line2],
        co.City AS [City],
        co.ZipCode AS [Zipcode]
    FROM 
        dbo.time_card tc
    INNER JOIN 
        dbo.paym_Employee emp ON tc.pn_EmployeeID = emp.pn_EmployeeID
    INNER JOIN 
        dbo.paym_employee_profile1 ep ON emp.pn_EmployeeID = ep.pn_EmployeeID
    INNER JOIN 
        dbo.paym_Designation dp ON ep.pn_DesignationId = dp.pn_DesignationId
    INNER JOIN 
        dbo.paym_Department dpt ON ep.pn_DepartmentId = dpt.pn_DepartmentId
    INNER JOIN 
        dbo.paym_Category ct ON ep.pn_CategoryId = ct.pn_CategoryId
    INNER JOIN 
        dbo.paym_Company co ON ep.pn_CompanyID = co.pn_CompanyID
    WHERE 
        tc.dates BETWEEN @StartDate AND @EndDate
    GROUP BY 
        tc.pn_companyid,  
        tc.pn_branchid,
        tc.pn_EmployeeID,
        tc.emp_code,
        tc.emp_name,
        tc.shift_code,
        emp.CTC,
        emp.basic_salary,
        emp.Grade,
        emp.Overall_Experience,
        dp.v_DesignationName,
        dpt.v_DepartmentName,
        ct.v_CategoryName,
        ep.d_Date,
        co.CompanyName,
        co.Address_Line1,
        co.Address_Line2,
        co.City,
        co.ZipCode;
END
GO
/****** Object:  StoredProcedure [dbo].[GetAttendanceSummaryInsertqueryforallmonth]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[GetAttendanceSummaryInsertqueryforallmonth]
AS
BEGIN
    SET NOCOUNT ON;

    -- Declare variables for year and month
    DECLARE @Year INT, @Month INT;
    DECLARE @ExecutionDay INT = DAY(GETDATE()); -- Get the day of the execution date
    DECLARE @CursorExist INT;

    -- Check if cursor already exists (this is an optional safety check)
    SELECT @CursorExist = COUNT(*) FROM sys.objects WHERE type = 'P' AND name = 'AttendanceCursor';

    -- Declare the cursor to fetch distinct Year and Month
    DECLARE AttendanceCursor CURSOR FOR
        SELECT DISTINCT YEAR(dates) AS Year, MONTH(dates) AS Month
        FROM dbo.time_card;

    OPEN AttendanceCursor;
    FETCH NEXT FROM AttendanceCursor INTO @Year, @Month;

    WHILE @@FETCH_STATUS = 0
    BEGIN
        -- Calculate the start and end dates for the month
        DECLARE @StartDate DATE = DATEFROMPARTS(@Year, @Month, 1);
        DECLARE @EndDate DATE = EOMONTH(@StartDate);

        -- Construct d_date with correct month/year and the execution day
        DECLARE @DDate DATE = DATEFROMPARTS(@Year, @Month, @ExecutionDay);

        -- Insert new data into the paym_paybill table, avoiding duplicates
        INSERT INTO [dbo].[paym_paybill]
               ([pn_CompanyID],
                [pn_BranchID],
                [pn_EmployeeID],
                [EmployeeCode],
                [Employee_First_Name],
                [DesignationName],
                [DepartmentName],
                [GradeName],
                [CategoryName],
                [JoiningDate],
                [d_date],
                [Earned_Basic],
                [Act_Basic],
                [Calc_Days],
                [Paid_Days],
                [Present_Days],
                [Absent_Days],
                [WeekOffDays],
                [Holidays],
                [TotLeave_Days],
                [CompanyName],
                [Address_line1],
                [Address_Line2],
                [City],
                [Zipcode],
                [EarningsName],
                [FinalAmount])
        SELECT 
            tc.pn_companyid AS [pn_CompanyID],
            tc.pn_branchid AS [pn_BranchID],
            tc.pn_EmployeeID AS [pn_EmployeeID],
            tc.emp_code AS [EmployeeCode],
            tc.emp_name AS [Employee_First_Name],
            dp.v_DesignationName AS [DesignationName],
            dpt.v_DepartmentName AS [DepartmentName],
            emp.Grade AS [GradeName],
            ct.v_CategoryName AS [CategoryName],
            ep.d_Date AS [JoiningDate],
            @DDate AS [d_date], -- Use the constructed date with correct month/year and execution day
            CASE 
                WHEN COUNT(tc.dates) > 0 THEN 
                    (emp.basic_salary / COUNT(tc.dates)) * 
                    (
                        SUM(CASE WHEN tc.status IN ('P', 'W', 'H', 'WFH', 'L') THEN 1 ELSE 0 END) 
                        + SUM(CASE WHEN tc.status = 'HD' THEN 0.5 ELSE 0 END)
                    )
                ELSE 0 
            END AS [Earned_Basic],
            emp.basic_salary AS [Act_Basic],
            COUNT(tc.dates) AS [Calc_Days],
            SUM(CASE WHEN tc.status IN ('P', 'W', 'H', 'WFH', 'L') THEN 1 ELSE 0 END) 
            + SUM(CASE WHEN tc.status = 'HD' THEN 0.5 ELSE 0 END) AS [Paid_Days],
            SUM(CASE WHEN tc.status = 'P' THEN 1 ELSE 0 END) AS [Present_Days],
            SUM(CASE WHEN tc.status = 'A' THEN 1 ELSE 0 END) AS [Absent_Days],
            SUM(CASE WHEN tc.status = 'W' THEN 1 ELSE 0 END) AS [WeekOffDays],
            SUM(CASE WHEN tc.status = 'H' THEN 1 ELSE 0 END) AS [Holidays],
            SUM(CASE WHEN tc.status = 'L' THEN 1 ELSE 0 END) AS [TotLeave_Days],
            co.CompanyName AS [CompanyName],
            co.Address_Line1 AS [Address_line1],
            co.Address_Line2 AS [Address_Line2],
            co.City AS [City],
            co.ZipCode AS [Zipcode],
            -- Add allowances (v_earningsname) and final amount
            al.v_earningsname AS [EarningsName],
            al.finalamount AS [FinalAmount]
        FROM 
            dbo.time_card tc
        INNER JOIN 
            dbo.paym_Employee emp ON tc.pn_EmployeeID = emp.pn_EmployeeID
        INNER JOIN 
            dbo.paym_employee_profile1 ep ON emp.pn_EmployeeID = ep.pn_EmployeeID
        INNER JOIN 
            dbo.paym_Designation dp ON ep.pn_DesignationId = dp.pn_DesignationId
        INNER JOIN 
            dbo.paym_Department dpt ON ep.pn_DepartmentId = dpt.pn_DepartmentId
        INNER JOIN 
            dbo.paym_Category ct ON ep.pn_CategoryId = ct.pn_CategoryId
        INNER JOIN 
            dbo.paym_Company co ON ep.pn_CompanyID = co.pn_CompanyID
        -- Join with the allowance table to get earnings and final amount
        LEFT JOIN 
            dbo.paym_Allowances al ON tc.pn_EmployeeID = al.pn_EmployeeID
        WHERE 
            tc.dates BETWEEN @StartDate AND @EndDate
        GROUP BY 
            tc.pn_companyid,  
            tc.pn_branchid,
            tc.pn_EmployeeID,
            tc.emp_code,
            tc.emp_name,
            tc.shift_code,
            emp.CTC,
            emp.basic_salary,
            emp.Grade,
            emp.Overall_Experience,
            dp.v_DesignationName,
            dpt.v_DepartmentName,
            ct.v_CategoryName,
            ep.d_Date,
            co.CompanyName,
            co.Address_Line1,
            co.Address_Line2,
            co.City,
            co.ZipCode,
            al.v_earningsname,
            al.finalamount
        HAVING 
            NOT EXISTS (
                SELECT 1
                FROM dbo.paym_paybill pb
                WHERE pb.pn_CompanyID = tc.pn_companyid
                  AND pb.pn_BranchID = tc.pn_branchid
                  AND pb.pn_EmployeeID = tc.pn_EmployeeID
                  AND pb.d_date = @DDate -- Check for duplicate record based on unique combination
            );

        -- Fetch the next month and year
        FETCH NEXT FROM AttendanceCursor INTO @Year, @Month;
    END;

    -- Close and deallocate the cursor
    CLOSE AttendanceCursor;
    DEALLOCATE AttendanceCursor;
END;
GO
/****** Object:  StoredProcedure [dbo].[GetAttendanceSummaryInsertqueryforallmonthsupdate]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[GetAttendanceSummaryInsertqueryforallmonthsupdate]
AS
BEGIN
    SET NOCOUNT ON;

    -- Declare variables for year and month
    DECLARE @Year INT, @Month INT;
    DECLARE @ExecutionDay INT = DAY(GETDATE()); -- Get the day of the execution date
    DECLARE AttendanceCursor CURSOR FOR
        SELECT DISTINCT YEAR(dates) AS Year, MONTH(dates) AS Month
        FROM dbo.time_card;

    OPEN AttendanceCursor;
    FETCH NEXT FROM AttendanceCursor INTO @Year, @Month;

    WHILE @@FETCH_STATUS = 0
    BEGIN
        -- Calculate the start and end dates for the month
        DECLARE @StartDate DATE = DATEFROMPARTS(@Year, @Month, 1);
        DECLARE @EndDate DATE = EOMONTH(@StartDate);

        -- Construct d_date with correct month/year and the execution day
        DECLARE @DDate DATE = DATEFROMPARTS(@Year, @Month, @ExecutionDay);

        -- Insert new data into the paym_paybill table, avoiding duplicates
        INSERT INTO [dbo].[paym_paybill]
           ([pn_CompanyID],
            [pn_BranchID],
            [pn_EmployeeID],
            [EmployeeCode],
            [Employee_First_Name],
            [DesignationName],
            [DepartmentName],
            [GradeName],
            [CategoryName],
            [JoiningDate],
            [d_date],
            [Earn_Amount],
            [Ded_Amount],
            [NetPay],
            [Earned_Basic],
            [Gross_salary],
            [Net_salary],
            [EPF],
            [FPF],
            [period_code],
            [max_amount],
            [Act_Basic],
            [Calc_Days],
            [Paid_Days],
            [Present_Days],
            [Absent_Days],
            [WeekOffDays],
            [Holidays],
            [TotLeave_Days],
            [ot_hrs],
            [ot_value],
            [ot_amt],
            [Allowance1],
            [value1],
            [Allowance2],
            [value2],
            [Allowance3],
            [value3],
            [Allowance4],
            [value4],
            [Allowance5],
            [value5],
            [Allowance6],
            [value6],
            [Allowance7],
            [value7],
            [Allowance8],
            [value8],
            [Allowance9],
            [value9],
            [Allowance10],
            [value10],
            [Deduction1],
            [valueA1],
            [Deduction2],
            [valueA2],
            [Deduction3],
            [valueA3],
            [Deduction4],
            [valueA4],
            [Deduction5],
            [valueA5],
            [Deduction6],
            [valueA6],
            [Deduction7],
            [valueA7],
            [Deduction8],
            [valueA8],
            [Deduction9],
            [valueA9],
            [Deduction10],
            [valueA10],
            [CompanyName],
            [Address_line1],
            [Address_Line2],
            [City],
            [Zipcode],
            [Att_bonus])
        SELECT 
            ea.pn_CompanyID,
            ea.pn_BranchID,
            ea.pn_EmployeeID,
            ea.EmployeeCode,
            ea.Employee_First_Name,
            ea.DesignationName,
            ea.DepartmentName,
            ea.GradeName,
            ea.CategoryName,
            ea.JoiningDate,
            @DDate AS [d_date], -- Use the constructed date with correct month/year and execution day
            ea.OriginalAmount AS [Earn_Amount],
            0 AS [Ded_Amount], -- Assuming Deduction logic is handled separately
            (ea.OriginalAmount - 0) AS [NetPay], -- Assuming no deductions here, adjust as needed
            ea.OriginalAmount AS [Earned_Basic],
            ea.OriginalAmount AS [Gross_salary], -- Assuming Gross Salary equals Earned Amount
            ea.OriginalAmount AS [Net_salary], -- Assuming Net Salary equals Earned Amount
            0 AS [EPF], -- Assuming EPF logic is handled separately
            0 AS [FPF], -- Assuming FPF logic is handled separately
            'PeriodCode' AS [period_code], -- Placeholder, replace with actual logic
            ea.OriginalAmount AS [max_amount], -- Adjust logic based on the actual requirement
            ea.OriginalAmount AS [Act_Basic],
            31 AS [Calc_Days], -- Assuming a fixed 31 days for calculation, adjust as needed
            ad.Paid_Days, -- This value will be passed from the absent days calculation
            ad.Present_Days,
            ad.Absent_Days,
            ad.WeekOffDays,
            ad.Holidays,
            ad.TotLeave_Days,
            0 AS [ot_hrs], -- Assuming overtime logic is handled separately
            0 AS [ot_value], -- Assuming overtime value logic is handled separately
            0 AS [ot_amt], -- Assuming overtime amount logic is handled separately
            NULL AS [Allowance1],
            0 AS [value1],
            NULL AS [Allowance2],
            0 AS [value2],
            NULL AS [Allowance3],
            0 AS [value3],
            NULL AS [Allowance4],
            0 AS [value4],
            NULL AS [Allowance5],
            0 AS [value5],
            NULL AS [Allowance6],
            0 AS [value6],
            NULL AS [Allowance7],
            0 AS [value7],
            NULL AS [Allowance8],
            0 AS [value8],
            NULL AS [Allowance9],
            0 AS [value9],
            NULL AS [Allowance10],
            0 AS [value10],
            NULL AS [Deduction1],
            0 AS [valueA1],
            NULL AS [Deduction2],
            0 AS [valueA2],
            NULL AS [Deduction3],
            0 AS [valueA3],
            NULL AS [Deduction4],
            0 AS [valueA4],
            NULL AS [Deduction5],
            0 AS [valueA5],
            NULL AS [Deduction6],
            0 AS [valueA6],
            NULL AS [Deduction7],
            0 AS [valueA7],
            NULL AS [Deduction8],
            0 AS [valueA8],
            NULL AS [Deduction9],
            0 AS [valueA9],
            NULL AS [Deduction10],
            0 AS [valueA10],
            ea.CompanyName,
            ea.Address_line1,
            ea.Address_Line2,
            ea.City,
            ea.Zipcode,
            0 AS [Att_bonus] -- Assuming no attendance bonus logic
        FROM 
            EmployeeAllowances ea
        LEFT JOIN 
            AbsentDays ad ON ea.EmployeeCode = ad.emp_code
        WHERE 
            ea.Prorata_basis IN ('Y', 'N') -- Ensure only valid prorata values
        ORDER BY 
            ea.d_order; -- Order by the d_order to align allowances correctly

        -- Fetch the next month and year
        FETCH NEXT FROM AttendanceCursor INTO @Year, @Month;
    END;

    -- Close and deallocate the cursor
    CLOSE AttendanceCursor;
    DEALLOCATE AttendanceCursor;
END;

GO
/****** Object:  StoredProcedure [dbo].[GetAttendanceSummaryWithAllowances]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[GetAttendanceSummaryWithAllowances]
AS
BEGIN
    SET NOCOUNT ON;

  -- Declare variables for year and month
DECLARE @Year INT, @Month INT;
DECLARE @ExecutionDay INT = DAY(GETDATE()); -- Get the day of the execution date

-- Declare cursor for distinct Year-Month combinations with attendance
DECLARE AttendanceCursor CURSOR FOR
    SELECT DISTINCT YEAR(dates) AS Year, MONTH(dates) AS Month
    FROM dbo.time_card
    GROUP BY YEAR(dates), MONTH(dates)
    HAVING COUNT(*) > 0;  -- Ensure there's attendance data

OPEN AttendanceCursor;
FETCH NEXT FROM AttendanceCursor INTO @Year, @Month;

WHILE @@FETCH_STATUS = 0
BEGIN
    -- Validate the month and year
    IF @Month < 1 OR @Month > 12 OR @Year < 1900 OR @Year > 2100
    BEGIN
        FETCH NEXT FROM AttendanceCursor INTO @Year, @Month;
        CONTINUE;
    END

    -- Calculate the start and end dates for the month
    DECLARE @StartDate DATE = DATEFROMPARTS(@Year, @Month, 1);
    DECLARE @EndDate DATE = EOMONTH(@StartDate);
    DECLARE @TotalDaysInMonth INT = DAY(@EndDate); -- Total days in the month

    -- Count distinct days with attendance data for the month
    DECLARE @DistinctDaysWithAttendance INT;
    SELECT @DistinctDaysWithAttendance = COUNT(DISTINCT CAST(dates AS DATE))
    FROM dbo.time_card
    WHERE dates BETWEEN @StartDate AND @EndDate;

    -- Check if the distinct days with attendance data is less than total days in the month
    IF @DistinctDaysWithAttendance < @TotalDaysInMonth
    BEGIN
        -- If not all days have attendance data, skip processing
        FETCH NEXT FROM AttendanceCursor INTO @Year, @Month;
        CONTINUE;
    END

    -- Ensure the execution day is valid for the month
    IF @ExecutionDay > @TotalDaysInMonth
    BEGIN
        SET @ExecutionDay = @TotalDaysInMonth; -- Adjust to the last day of the month
    END

    -- Construct d_date with correct month/year and the execution day
    DECLARE @DDate DATE = DATEFROMPARTS(@Year, @Month, @ExecutionDay);


   BEGIN TRY
        -- Drop the temporary table if it exists
        IF OBJECT_ID('tempdb..#AttendanceBonus2') IS NOT NULL 
            DROP TABLE #AttendanceBonus2;

        -- Create a temporary table to store Employee Allowances
        CREATE TABLE #AttendanceBonus2(
            pn_companyid INT,
            pn_branchid INT,
            pn_employeeid INT,
            EmployeeCode NVARCHAR(50),
            Employee_Full_Name NVARCHAR(100),
            pn_categoryid INT,
            v_categoryname NVARCHAR(100),
            Year INT,
            Month INT,
            status_A_count INT,
            attendance_bonus_type NVARCHAR(50),
            attendance_bonus_value DECIMAL(18, 2)
        );

        -- Temporary table to store Employee Allowances
        WITH EmployeeAllowances AS (
            SELECT DISTINCT
                e.pn_CompanyID,
                e.pn_BranchID,
                e.Employee_Full_Name,
                e.EmployeeCode,
                e.pn_EmployeeID,
                av.Grade_Name,
                av.Level_Name,
                av.v_EarningsName,
                av.Allowancetype,
                av.Cal_Based_on,
                CASE 
                    WHEN av.Allowancetype = 'Fixed' THEN av.value
                    WHEN av.Cal_Based_on = 'CTC' THEN (e.CTC * av.value / 100)
                    WHEN av.Cal_Based_on = 'BasicPay' THEN (e.Basic_Salary * av.value / 100)
                    ELSE 0
                END AS OriginalAmount,
                aset.Prorata_basis, -- Prorata flag specific to each earning
                av.d_order
            FROM 
                [dbo].[AllowanceValues] av
            JOIN 
                [dbo].[paym_Employee] e
                ON av.Grade_Name = e.Grade
                OR av.Level_Name = e.Grade
            LEFT JOIN (
                SELECT 
                    pn_CompanyID, pn_BranchID, v_EarningsName, 
                    MAX(Prorata_basis) AS Prorata_basis
                FROM 
                    [dbo].[Allowancesettings]
                GROUP BY 
                    pn_CompanyID, pn_BranchID, v_EarningsName
            ) aset
            ON av.pn_companyid = aset.pn_CompanyID
            AND av.pn_branchid = aset.pn_BranchID
            AND av.v_EarningsName = aset.v_EarningsName
            WHERE 
                av.pn_branchid = e.pn_BranchID
                AND (av.Allowancetype IN ('Fixed', 'Percentage'))
                AND NOT (av.c_Regular = 'N' AND av.payslip = 'N')
        ),
        AttendanceData AS (
            SELECT 
                tc.pn_EmployeeID,
                COUNT(DISTINCT MONTH(tc.dates)) AS MonthsWithAttendance,
                SUM(CASE WHEN tc.status = 'A' THEN 1 ELSE 0 END 
                ) + 
                SUM(CASE WHEN tc.status = 'HD' THEN 0.5 ELSE 0 END) AS AbsentDays,
                COUNT(tc.dates) AS TotalDays,
                COUNT(tc.dates) - 
                (SUM(CASE WHEN tc .status = 'A' THEN 1 ELSE 0 END) + 
                 SUM(CASE WHEN tc.status = 'HD' THEN 0.5 ELSE 0 END)) AS PaidDays, 
                SUM(CASE WHEN tc.status = 'P' THEN 1 ELSE 0 END) AS PresentDays,
                SUM(CASE WHEN tc.status = 'W' THEN 1 ELSE 0 END) AS Weekoffdays,
                SUM(CASE WHEN tc.status = 'L' THEN 1 ELSE 0 END) AS Leavedays,
                SUM(CASE WHEN tc.status = 'H' THEN 1 ELSE 0 END) AS Holidays,
                SUM(CASE WHEN tc.status = 'WFH' THEN 1 ELSE 0 END) AS WorkFromHome,
                SUM(CASE WHEN tc.status = 'HD' THEN 1 ELSE 0 END) AS HalfDay
            FROM 
                dbo.time_card tc
            WHERE 
                tc.dates BETWEEN @StartDate AND @EndDate
            GROUP BY 
                tc.pn_EmployeeID
            HAVING COUNT(DISTINCT MONTH(tc.dates)) > 0  -- Only consider employees with attendance in this month
        )
        -- Insert or update data into paym_paybill table for employees with attendance
        MERGE INTO [dbo].[paym_paybill] AS target
        USING (
            SELECT 
                tc.pn_companyid AS [pn_CompanyID],
                tc.pn_branchid AS [pn_BranchID],
                tc.pn_EmployeeID AS [pn_EmployeeID],
                tc.emp_code AS [EmployeeCode],
                tc.emp_name AS [Employee_First_Name],
                dp.v_DesignationName AS [DesignationName],
                dpt.v_DepartmentName AS [DepartmentName],
                pg.v_GradeName AS [GradeName],
                ct.v_CategoryName AS [CategoryName],
                ep.d_Date AS [JoiningDate],
                @DDate AS [d_date],
                COALESCE(MAX(CASE WHEN ea.d_order = 1 THEN 
                    CASE WHEN ea.Prorata_basis = 'Y' THEN 
                        (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
                        ELSE ea.OriginalAmount END
                    ELSE 0 END), 0) +
                COALESCE(MAX(CASE WHEN ea.d_order = 2 THEN 
                    CASE WHEN ea.Prorata_basis = 'Y' THEN 
                        (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
                        ELSE ea.OriginalAmount END
                    ELSE 0 END), 0) +
                COALESCE(MAX(CASE WHEN ea.d_order = 3 THEN 
                    CASE WHEN ea.Prorata_basis = 'Y' THEN 
                        (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
                        ELSE ea.OriginalAmount END
                    ELSE 0 END), 0) +
                COALESCE(MAX(CASE WHEN ea.d_order = 4 THEN 
                    CASE WHEN ea.Prorata_basis = 'Y' THEN 
                        (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
                        ELSE ea.OriginalAmount END
                    ELSE 0 END), 0) +
                COALESCE(MAX(CASE WHEN ea.d_order = 5 THEN 
                    CASE WHEN ea.Prorata_basis = 'Y' THEN 
                        (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
                        ELSE ea.OriginalAmount END
                    ELSE 0 END), 0) +
                COALESCE(MAX(CASE WHEN ea.d_order = 6 THEN 
                    CASE WHEN ea.Prorata_basis = 'Y' THEN 
                        (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
                        ELSE ea.OriginalAmount END
                    ELSE 0 END), 0) +
                COALESCE(MAX(CASE WHEN ea.d_order = 7 THEN 
                    CASE WHEN ea.Prorata_basis = 'Y' THEN 
                        (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
                        ELSE ea.OriginalAmount END
                    ELSE 0 END), 0) +
                COALESCE(MAX(CASE WHEN ea.d_order = 8 THEN 
                    CASE WHEN ea.Prorata_basis = 'Y' THEN 
                        (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
                        ELSE ea.OriginalAmount END
                    ELSE 0 END), 0) +
                COALESCE(MAX(CASE WHEN ea.d_order = 9 THEN 
                    CASE WHEN ea.Prorata_basis = 'Y' THEN 
                        (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
                        ELSE ea.OriginalAmount END
                    ELSE 0 END), 0) +
                COALESCE(MAX(CASE WHEN ea.d_order = 10 THEN 
                    CASE WHEN ea.Prorata_basis = 'Y' THEN 
                        (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
                        ELSE ea.OriginalAmount END
                    ELSE 0 END), 0) AS [Earn_Amount],

                NULL AS [Ded_Amount], -- Placeholder for missing value
                NULL AS [NetPay], -- Placeholder for missing value
                CASE 
                    WHEN ad.TotalDays > 0 THEN 
                        (emp.basic_salary / ad.TotalDays) * ad.PaidDays
                    ELSE 0 
                END AS [Earned_Basic],
                (CASE 
                    WHEN ad.TotalDays > 0 THEN 
                        (emp.basic_salary / ad.TotalDays) * ad.PaidDays
                    ELSE 0 
                END + 
                COALESCE(MAX(CASE WHEN ea.d_order = 1 THEN 
                    CASE WHEN ea.Prorata_basis = 'Y' THEN 
                        (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
                        ELSE ea.OriginalAmount END
                    ELSE 0 END), 0) +
                COALESCE(MAX(CASE WHEN ea.d_order = 2 THEN 
                    CASE WHEN ea.Prorata_basis = 'Y' THEN 
                        (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
                        ELSE ea.OriginalAmount END
                    ELSE 0 END), 0) +
                COALESCE(MAX(CASE WHEN ea.d_order = 3 THEN 
                    CASE WHEN ea.Prorata_basis = 'Y' THEN 
                        (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
                        ELSE ea.OriginalAmount END
                    ELSE 0 END), 0) +
                COALESCE(MAX(CASE WHEN ea.d_order = 4 THEN 
                    CASE WHEN ea.Prorata_basis = 'Y' THEN 
                        (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
                        ELSE ea.OriginalAmount END
                    ELSE 0 END), 0) +
                COALESCE(MAX(CASE WHEN ea.d_order = 5 THEN 
                    CASE WHEN ea.Prorata_basis = 'Y' THEN 
                        (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
                        ELSE ea.OriginalAmount END
                    ELSE 0 END), 0) +
                COALESCE(MAX(CASE WHEN ea.d_order = 6 THEN 
                    CASE WHEN ea.Prorata_basis = 'Y' THEN 
                        (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
                        ELSE ea.OriginalAmount END
                    ELSE 0 END), 0) +
                COALESCE(MAX(CASE WHEN ea.d_order = 7 THEN 
                    CASE WHEN ea.Prorata_basis = 'Y' THEN 
                        (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
                        ELSE ea.OriginalAmount END
                    ELSE 0 END), 0) +
                COALESCE(MAX(CASE WHEN ea.d_order = 8 THEN 
                    CASE WHEN ea.Prorata_basis = 'Y' THEN 
                        (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
                        ELSE ea.OriginalAmount END
                    ELSE 0 END), 0) +
                COALESCE(MAX(CASE WHEN ea.d_order = 9 THEN 
                    CASE WHEN ea.Prorata_basis = 'Y' THEN 
                        (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
                        ELSE ea.OriginalAmount END
                    ELSE 0 END), 0) +
                COALESCE(MAX(CASE WHEN ea.d_order = 10 THEN 
                    CASE WHEN ea.Prorata_basis = 'Y' THEN 
                        (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
                        ELSE ea.OriginalAmount END
                    ELSE 0 END), 0)
                ) AS [Gross_salary],
                NULL AS [Net_salary],
                NULL AS [EPF],
                NULL AS [FPF],
                Format (@DDate, 'MMMM yyyy') AS [Period_code],
                emp.CTC AS [max_amount],
                emp.basic_salary AS [Act_Basic],
                ad.TotalDays AS [Calc_Days],
                ad.PaidDays AS [Paid_Days],
                ad.PresentDays AS [Present_Days],
                ad.AbsentDays AS [Absent_Days],
                ad.Weekoffdays AS [WeekOffDays],
				ad.Holidays AS [Holidays],
                ad.Leavedays AS [TotLeave_Days],
                NULL AS [ot_hrs],
                NULL AS [ot_value],
                NULL AS [ot_amt],
                -- Allowance calculation (taking Prorata_basis into account)
                MAX(CASE WHEN ea.d_order = 1 THEN ea.v_EarningsName ELSE NULL END) AS [Allowance1],
                MAX(CASE WHEN ea.d_order = 1 THEN 
                    CASE 
                        WHEN ea.Prorata_basis = 'Y' THEN 
                            (
                                ea.OriginalAmount - (
                                    (ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays
                                )
                            )
                        ELSE ea.OriginalAmount
                    END
                    ELSE 0 END) AS [value1],
                MAX(CASE WHEN ea.d_order = 2 THEN ea.v_EarningsName ELSE NULL END) AS [Allowance2],
                MAX(CASE WHEN ea.d_order = 2 THEN 
                    CASE 
                        WHEN ea.Prorata_basis = 'Y' THEN 
                            (
                                ea.OriginalAmount - (
                                    (ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays
                                )
                            )
                        ELSE ea.OriginalAmount
                    END
                    ELSE 0 END) AS [value2],
                MAX(CASE WHEN ea.d_order = 3 THEN ea.v_EarningsName ELSE NULL END) AS [Allowance3],
                MAX(CASE WHEN ea.d_order = 3 THEN 
                    CASE 
                        WHEN ea.Prorata_basis = 'Y' THEN 
                            (
                                ea.OriginalAmount - (
                                    (ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays
                                )
                            )
                        ELSE ea.OriginalAmount
                    END
                    ELSE 0 END) AS [value3],
                MAX(CASE WHEN ea.d_order = 4 THEN ea.v_EarningsName ELSE NULL END) AS [Allowance4],
                MAX(CASE WHEN ea.d_order = 4 THEN 
                    CASE 
                        WHEN ea.Prorata_basis = 'Y' THEN 
                            (
                                ea.OriginalAmount - (
                                    (ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays
                                )
                            )
                        ELSE ea.OriginalAmount
                    END
                    ELSE 0 END) AS [value4],
                MAX(CASE WHEN ea.d_order = 5 THEN ea.v_EarningsName ELSE NULL END) AS [Allowance5],
                MAX(CASE WHEN ea.d_order = 5 THEN 
                    CASE 
                        WHEN ea.Prorata_basis = 'Y' THEN 
                            (
                                ea.OriginalAmount - (
                                    (ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays
                                )
                            )
                        ELSE ea.OriginalAmount
                    END
                    ELSE 0 END) AS [value5],
                MAX(CASE WHEN ea.d_order = 6 THEN ea.v_EarningsName ELSE NULL END) AS [Allowance6],
                MAX(CASE WHEN ea.d_order = 6 THEN 
                    CASE 
                        WHEN ea.Prorata_basis = 'Y' THEN 
                            (
                                ea.OriginalAmount - (
                                    (ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays
                                )
                            )
                        ELSE ea.OriginalAmount
                    END
                    ELSE 0 END) AS [value6],
                MAX(CASE WHEN ea.d_order = 7 THEN ea.v_EarningsName ELSE NULL END) AS [Allowance7],
                MAX(CASE WHEN ea.d_order = 7 THEN 
                    CASE 
                        WHEN ea.Prorata_basis = 'Y' THEN 
                            (
                                ea.OriginalAmount - (
                                    (ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays
                                )
                            )
                        ELSE ea.OriginalAmount
                    END
                    ELSE 0 END) AS [value7],
                MAX(CASE WHEN ea.d_order = 8 THEN ea.v_EarningsName ELSE NULL END) AS [Allowance8],
                MAX(CASE WHEN ea.d_order = 8 THEN 
                    CASE WHEN ea.Prorata_basis = 'Y' THEN 
                            (
                                ea.OriginalAmount - (
                                    (ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays
                                )
                            )
                        ELSE ea.OriginalAmount
                    END
                    ELSE 0 END) AS [value8],
                MAX(CASE WHEN ea.d_order = 9 THEN ea.v_EarningsName ELSE NULL END) AS [Allowance9],
                MAX(CASE WHEN ea.d_order = 9 THEN 
                    CASE 
                        WHEN ea.Prorata_basis = 'Y' THEN 
                            (
                                ea.OriginalAmount - (
                                    (ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays
                                )
                            )
                        ELSE ea.OriginalAmount
                    END
                    ELSE 0 END) AS [value9],
                MAX(CASE WHEN ea.d_order = 10 THEN ea.v_EarningsName ELSE NULL END) AS [Allowance10],
				MAX(CASE WHEN ea.d_order = 10 THEN CASE WHEN ea.Prorata_basis = 'Y' THEN ( ea.OriginalAmount - ( (ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays ) ) ELSE ea.OriginalAmount END ELSE 0 END) AS [value10], 
				NULL AS [Deduction1], -- Placeholder for missing value
				0 AS [valueA1], -- Placeholder for missing value 
				NULL AS [Deduction2], -- Placeholder for missing value 
				0 AS [valueA2], -- Placeholder for missing value 
				NULL AS [Deduction3], -- Placeholder for missing value 
				0 AS [valueA3], -- Placeholder for missing value 
				NULL AS [Deduction4], -- Placeholder for missing value 
				0 AS [valueA4], -- Placeholder for missing value 
				NULL AS [Deduction5], -- Placeholder for missing value 
				0 AS [valueA5], -- Placeholder for missing value 
				NULL AS [Deduction6], -- Placeholder for missing value 
				0 AS [valueA6], -- Placeholder for missing value 
				NULL AS [Deduction7], -- Placeholder for missing value 
				0 AS [valueA7], -- Placeholder for missing value 
				NULL AS [Deduction8], -- Placeholder for missing value 
				0 AS [valueA8], -- Placeholder for missing value 
				NULL AS [Deduction9], -- Placeholder for missing value 
				0 AS [valueA9], -- Placeholder for missing value 
				NULL AS [Deduction10], -- Placeholder for missing value 
				0 AS [valueA10], -- Placeholder for missing value 
				co.CompanyName AS [CompanyName], co.Address_Line1 AS [Address_line1], co.Address_Line2 AS [Address_Line2], co.City AS [City], co.ZipCode AS [Zipcode], NULL AS [Att_bonus], ad.WorkFromHome AS [WorkFromHome], ad.HalfDay AS [Halfday], 'M' AS Flag FROM dbo.time_card tc INNER JOIN dbo.paym_Employee emp ON tc.pn_EmployeeID = emp.pn_EmployeeID INNER JOIN dbo.paym_employee_profile1 ep ON emp.pn_EmployeeID = ep.pn_EmployeeID INNER JOIN dbo.paym_Designation dp ON ep.pn_DesignationId = dp.pn_DesignationId INNER JOIN dbo.paym_Department dpt ON ep.pn_DepartmentId = dpt.pn_DepartmentId INNER JOIN dbo.paym_Category ct ON ep.pn_CategoryId = ct.pn_CategoryId INNER JOIN dbo.paym_Company co ON ep.pn_CompanyID = co.pn_CompanyID INNER JOIN EmployeeAllowances ea ON tc.pn_EmployeeID = ea.pn_EmployeeID INNER JOIN 
            paym_Grade pg ON ep.pn_GradeId = pg.pn_GradeID
				INNER JOIN AttendanceData ad ON tc.pn_EmployeeID = ad.pn_EmployeeID WHERE tc.dates BETWEEN @StartDate AND @EndDate GROUP BY tc.pn_companyid,
tc.pn_branchid, tc.pn_EmployeeID, tc.emp_code, tc.emp_name, emp.basic_salary, dp.v_DesignationName, dpt.v_DepartmentName, ct.v_CategoryName, pg.v_GradeName, ep.d_Date, co.CompanyName, co.Address_Line1, co.Address_Line2, co.City, co.Zipcode, ad.TotalDays,
ad.PaidDays,ad.MonthsWithAttendance, ad.AbsentDays, ad.PresentDays, ad.Weekoffdays, ad.Leavedays, ad.Holidays, ad.WorkFromHome, ad.HalfDay, emp.CTC ) AS source ON target.pn_CompanyID = source.pn_CompanyID AND target.pn_BranchID = source.pn_BranchID AND target.pn_EmployeeID = source.pn_EmployeeID AND target.d_date = source.d_date WHEN MATCHED AND target.Flag = 'M' THEN UPDATE SET target.Earn_Amount = source.Earn_Amount, target.Ded_Amount = source.Ded_Amount, target.NetPay = source.NetPay, target.Earned_Basic = source.Earned_Basic, target.Gross_salary = source.Gross_salary, target.Net_salary = source.Net_salary, target.EPF = source.EPF ,target.FPF = source.FPF, target.Period_code = source.Period_code, target.max_amount = source.max_amount, target.Act_Basic = source.Act_Basic, target.Calc_Days = source.Calc_Days, target.Paid_Days = source.Paid_Days, target.Present_Days = source.Present_Days, target.Absent_Days = source.Absent_Days, target.WeekOffDays = source.WeekOffDays, target.Holidays = source.Holidays, 
target.TotLeave_Days = source.TotLeave_Days, target.ot_hrs = source.ot_hrs, target.ot_value = source.ot_value, target.ot_amt = source.ot_amt, target.Allowance1 = source.Allowance1, target.value1 = source.value1, target.Allowance2 = source.Allowance2, target.value2 = source.value2, target.Allowance3 = source.Allowance3, target.value3 = source.value3, target.Allowance4 = source.Allowance4, target.value4 = source.value4, target.Allowance5 = source.Allowance5, target.value5 = source.value5, target.Allowance6 = source.Allowance6, target.value6 = source.value6, target.Allowance7 = source.Allowance7, target.value7 = source.value7, target.Allowance8 = source.Allowance8, target.value8 = source.value8, target.Allowance9 = source.Allowance9, target.value9 = source.value9, target.Allowance10 = source.Allowance10, target.value10 = source.value10, target.Deduction1 = source.Deduction1, target.valueA1 = source.valueA1, target.Deduction2 = source.Deduction2, target.valueA2 = source.valueA2, target.Deduction3 = source.Deduction3, target.valueA3 = source.valueA3, target.Deduction4 = source.Deduction4, target.valueA4 = source.valueA4, target.Deduction5 = source.Deduction5, target.valueA5 = source.valueA5, 
target.Deduction6 = source.Deduction6, target.valueA6 = source.valueA6, target.Deduction7 = source.Deduction7, target.valueA7 = source.valueA7, target.Deduction8 = source.Deduction8, target.valueA8 = source.valueA8, target.Deduction9 = source.Deduction9, target.valueA9 = source.valueA9, target.Deduction10 = source.Deduction10, target.valueA10 = source.valueA10, target.CompanyName = source.CompanyName, target.Address_line1 = source.Address_line1, target.Address_Line2 = source.Address_Line2, target.City = source.City, target.Zipcode = source.Zipcode, target.Att_bonus = source.Att_bonus, target.WorkFromHome = source.WorkFromHome, target.Halfday = source.Halfday, target.Flag = source.Flag WHEN NOT MATCHED THEN INSERT ([pn_CompanyID], [pn_BranchID], [pn_EmployeeID], [EmployeeCode], [Employee_First_Name], [DesignationName], [DepartmentName], [GradeName], [CategoryName], [JoiningDate], [d_date], [Earn_Amount], [Ded_Amount], [NetPay], [Earned_Basic], [Gross_salary], [Net_salary], [EPF], [FPF], [Period_code], [max_amount], [Act_Basic], [Calc_Days],
[Paid_Days], [Present_Days], [Absent_Days], [WeekOffDays], [Holidays], [TotLeave_Days], [ot_hrs], [ot_value], [ot_amt], [Allowance1], [value1], [Allowance2], [value2], [Allowance3], [value3], [Allowance4], [value4], [Allowance5], [value5], [Allowance6], [value6], [Allowance7], [value7], [Allowance8], [value8], [Allowance9], [value9], [Allowance10], [value10], [Deduction1], [valueA1], [Deduction2], [valueA2], [Deduction3], [valueA3], [Deduction4], [valueA4], [Deduction5], [valueA5], [Deduction6], [valueA6], [Deduction7], [valueA7], [Deduction8], [valueA8], [Deduction9], [valueA9], [Deduction10], [valueA10], [CompanyName], [Address_line1], [Address_Line2], [City], [Zipcode], [Att_bonus], [WorkFromHome], [Halfday], [Flag]) 
VALUES (source.pn_CompanyID, source.pn_BranchID, source.pn_EmployeeID, source.EmployeeCode, source.Employee_First_Name, source.DesignationName, source.DepartmentName, source.GradeName, source.CategoryName, source.JoiningDate, source.d_date, source.Earn_Amount, source.Ded_Amount, source.NetPay, source.Earned_Basic, source.Gross_salary, source.Net_salary, source.EPF, source.FPF, source.Period_code, source.max_amount, source.Act_Basic, source.Calc_Days, source.Paid_Days, source.Present_Days, source.Absent_Days, source.WeekOffDays, source.Holidays, source.TotLeave_Days, source.ot_hrs, source.ot_value, source.ot_amt, source.Allowance1, source.value1, source.Allowance2, source.value2, source.Allowance3, source.value3, source.Allowance4, source.value4, source.Allowance5, source.value5, source.Allowance6, source.value6, source.Allowance7, source.value7, source.Allowance8, source.value8, source.Allowance9, source.value9, source.Allowance10, source.value10, source.Deduction1, source.valueA1, source.Deduction2, source.valueA2, source.Deduction3, source.valueA3, source.Deduction4, source.valueA4, source.Deduction5, source.valueA5, source.Deduction6, source.valueA6, source.Deduction7, source.valueA7, source.Deduction8, source.valueA8, source.Deduction9, source.valueA9, source.Deduction10, source.valueA10, source.CompanyName, source.Address_line1, source.Address_Line2, source.City, source.Zipcode, source.Att_bonus, source.WorkFromHome, source.Halfday, source.Flag);

        -- Execute the attendance bonus stored procedure and insert results into the temporary table
        INSERT INTO #AttendanceBonus2
        EXEC GetEmployeeAttendanceBonus;

        -- Update the paym_paybill table to fill the Att_bonus column
        UPDATE pb
        SET pb.Att_bonus = ab.attendance_bonus_value
        FROM dbo.paym_paybill pb
        INNER JOIN #AttendanceBonus2 ab ON pb.pn_CompanyID = ab.pn_companyid
            AND pb.pn_BranchID = ab.pn_branchid
            AND pb.pn_EmployeeID = ab.pn_employeeid
            AND pb.EmployeeCode = ab.EmployeeCode
            AND YEAR(pb.d_date) = ab.Year
            AND MONTH(pb.d_date) = ab.Month;

        -- Fetch the next Year-Month combination
        FETCH NEXT FROM AttendanceCursor INTO @Year, @Month;
    END TRY
    BEGIN CATCH
        -- Handle the error
        PRINT ERROR_MESSAGE();
        -- Drop the temporary table if it exists
        IF OBJECT_ID('tempdb..#AttendanceBonus2') IS NOT NULL 
            DROP TABLE #AttendanceBonus2;
    END CATCH;
END

CLOSE AttendanceCursor;
DEALLOCATE AttendanceCursor;

END; 

GO
/****** Object:  StoredProcedure [dbo].[GetCTCBySlab]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[GetCTCBySlab]
    @SlabType VARCHAR(30), -- Slab_Type can be either 'Level' or 'Grade'
    @Level_Name VARCHAR(30) = NULL, -- Optional parameter for Level_Name
    @Grade_Name VARCHAR(30) = NULL, -- Optional parameter for Grade_Name
    @Experience FLOAT -- Experience value to check against
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @CTC NUMERIC(10, 2);

    -- Check if SlabType is 'Level'
    IF @SlabType = 'Level'
    BEGIN
        SELECT @CTC = CTC
        FROM [dbo].[GradeSlab_Branch]
        WHERE Slab_Type = @SlabType
          AND Level_Name = @Level_Name
          AND Experience_From <= @Experience
          AND (Experience_To = 'upwards' OR Experience_To >= @Experience);
    END
    -- Check if SlabType is 'Grade'
    ELSE IF @SlabType = 'Grade'
    BEGIN
        SELECT @CTC = CTC
        FROM [dbo].[GradeSlab_Branch]
        WHERE Slab_Type = @SlabType
          AND Grade_Name = @Grade_Name
          AND Experience_From <= @Experience
          AND (Experience_To = 'upwards' OR Experience_To >= @Experience);
    END
    ELSE
    BEGIN
        RAISERROR('Invalid Slab_Type. Please use ''Level'' or ''Grade''.', 16, 1);
        RETURN;
    END

    -- Return the CTC value
    IF @CTC IS NOT NULL
    BEGIN
        SELECT @CTC AS CTC;
    END
    ELSE
    BEGIN
        SELECT 'No matching records found.' AS Message;
    END
END
GO
/****** Object:  StoredProcedure [dbo].[GetCTCSlabForEmployees]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

create PROCEDURE [dbo].[GetCTCSlabForEmployees]
    @EmployeeID INT -- Add EmployeeID as a parameter
AS
BEGIN
    SELECT 
        s.pn_CompanyID,  -- Show CompanyID from the CTCSlab table
        s.pn_BranchID,   -- Show BranchID from the CTCSlab table
        e.pn_EmployeeID,
        e.CTC,
        s.MinCTC,
        s.MaxCTC,
        s.MaxLoanAmount,
        s.InterestRate,
        s.LoanType
    FROM 
        dbo.paym_Employee e
    INNER JOIN 
        dbo.CTCSlab s
        ON e.CTC BETWEEN s.MinCTC AND s.MaxCTC
    WHERE 
        e.pn_EmployeeID = @EmployeeID  -- Filter by the logged-in employee
        AND e.pn_CompanyID = s.pn_CompanyID  -- Ensure the employee belongs to the same company as the slab
        AND e.pn_BranchID = s.pn_BranchID; -- Ensure the employee belongs to the same branch as the slab
END;
GO
/****** Object:  StoredProcedure [dbo].[GetEmployeeAllowancesAndFinalAmount]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[GetEmployeeAllowancesAndFinalAmount]
    @CompanyID INT,
    @BranchID INT,
    @GradeName NVARCHAR(100) = NULL,
    @LevelName NVARCHAR(100) = NULL,
    @EarningsName NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- Fetch the consistent Prorata_basis value for the branch and company
    DECLARE @GlobalProrata NVARCHAR(1);

    SELECT TOP 1 @GlobalProrata = Prorata_basis
    FROM [dbo].[Allowancesettings]
    WHERE pn_CompanyID = @CompanyID AND pn_BranchID = @BranchID;

    -- If Prorata_basis is not found, raise an error
    IF @GlobalProrata IS NULL
    BEGIN
        RAISERROR ('No Allowancesettings record found for the specified CompanyID and BranchID.', 16, 1);
        RETURN;
    END;

    -- Start the CTEs
    ;WITH EmployeeAllowances AS (
        SELECT DISTINCT
            e.Employee_Full_Name,
            e.EmployeeCode,
            av.Grade_Name,
            av.Level_Name,
            av.v_EarningsName,
            av.pn_companyid,
            av.pn_branchid,
            CASE 
                WHEN av.Allowancetype = 'Fixed' THEN av.value
                WHEN av.Cal_Based_on = 'CTC' THEN (e.CTC * av.value / 100)
                WHEN av.Cal_Based_on = 'BasicPay' THEN (e.Basic_Salary * av.value / 100)
                ELSE 0
            END AS OriginalAmount,
            av.d_order
        FROM 
            [dbo].[AllowanceValues] av
        JOIN 
            [dbo].[paym_Employee] e
            ON av.Grade_Name = e.Grade
            OR av.Level_Name = e.Grade
        WHERE 
            av.pn_branchid = e.pn_BranchID
            AND (av.Allowancetype IN ('Fixed', 'Percentage'))
            AND (av.c_Regular = 'N' AND av.payslip = 'N')
            AND av.pn_companyid = @CompanyID
            AND av.pn_branchid = @BranchID
            AND (@GradeName IS NULL OR av.Grade_Name = @GradeName)
            AND (@LevelName IS NULL OR av.Level_Name = @LevelName)
            AND (@EarningsName IS NULL OR av.v_EarningsName = @EarningsName)
    ),
    AbsentDays AS (
        SELECT 
            tc.emp_code,
            DATEPART(MONTH, tc.dates) AS Month,
            DATEPART(YEAR, tc.dates) AS Year,
            COUNT(CASE WHEN tc.Status = 'A' THEN 1 ELSE NULL END) AS TotalAbsences
        FROM 
            [dbo].[time_card] tc
        GROUP BY 
            tc.emp_code, 
            DATEPART(MONTH, tc.dates),
            DATEPART(YEAR, tc.dates)
    )
    SELECT DISTINCT
        ea.pn_companyid,
        ea.pn_branchid,
        ea.Grade_Name,
        ea.Level_Name,
        ea.v_EarningsName,
        ea.OriginalAmount,
        ea.d_order
    FROM 
        EmployeeAllowances ea
    LEFT JOIN 
        AbsentDays ad
    ON ea.EmployeeCode = ad.emp_code
    ORDER BY 
        ea.pn_branchid, ea.d_order;
END;
GO
/****** Object:  StoredProcedure [dbo].[GetEmployeeAllowancesAndFinalAmounts]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[GetEmployeeAllowancesAndFinalAmounts]
    @CompanyID INT,
    @BranchID INT,
    @GradeName NVARCHAR(100) = NULL,
    @LevelName NVARCHAR(100) = NULL,
    @EarningsName NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- Fetch the consistent Prorata_basis value for the branch and company
    DECLARE @GlobalProrata NVARCHAR(1);

    SELECT TOP 1 @GlobalProrata = Prorata_basis
    FROM [dbo].[Allowancesettings]
    WHERE pn_CompanyID = @CompanyID AND pn_BranchID = @BranchID;

    -- If Prorata_basis is not found, raise an error
    IF @GlobalProrata IS NULL
    BEGIN
        RAISERROR ('No Allowancesettings record found for the specified CompanyID and BranchID.', 16, 1);
        RETURN;
    END;

    -- Start the CTEs
    ;WITH EmployeeAllowances AS (
        SELECT DISTINCT
            e.Employee_Full_Name,
            e.EmployeeCode,
            av.Grade_Name,
            av.Level_Name,
            av.v_EarningsName,
            av.pn_companyid,
            av.pn_branchid,
            CASE 
                WHEN av.Allowancetype = 'Fixed' THEN av.value
                WHEN av.Cal_Based_on = 'CTC' THEN (e.CTC * av.value / 100)
                WHEN av.Cal_Based_on = 'BasicPay' THEN (e.Basic_Salary * av.value / 100)
                ELSE 0
            END AS OriginalAmount,
            av.d_order
        FROM 
            [dbo].[AllowanceValues] av
        JOIN 
            [dbo].[paym_Employee] e
            ON av.Grade_Name = e.Grade
            OR av.Level_Name = e.Grade
        WHERE 
            av.pn_branchid = e.pn_BranchID
            AND (av.Allowancetype IN ('Fixed', 'Percentage'))
            AND (av.c_Regular = 'N' AND av.payslip = 'N')
            AND av.pn_companyid = @CompanyID
            AND av.pn_branchid = @BranchID
            AND (@GradeName IS NULL OR av.Grade_Name = @GradeName)
            AND (@LevelName IS NULL OR av.Level_Name = @LevelName)
            AND (@EarningsName IS NULL OR av.v_EarningsName = @EarningsName)
    ),
    AbsentDays AS (
        SELECT 
            tc.emp_code,
            DATEPART(MONTH, tc.dates) AS Month,
            DATEPART(YEAR, tc.dates) AS Year,
            COUNT(CASE WHEN tc.Status = 'A' THEN 1 ELSE NULL END) AS TotalAbsences
        FROM 
            [dbo].[time_card] tc
        GROUP BY 
            tc.emp_code, 
            DATEPART(MONTH, tc.dates),
            DATEPART(YEAR, tc.dates)
    )
    SELECT DISTINCT
        ea.pn_companyid,
        ea.pn_branchid,
        ea.Grade_Name,
        ea.Level_Name,
        ea.v_EarningsName,
        ea.OriginalAmount,
        ea.d_order
    FROM 
        EmployeeAllowances ea
    LEFT JOIN 
        AbsentDays ad
    ON ea.EmployeeCode = ad.emp_code
    ORDER BY 
        ea.pn_branchid, ea.d_order;
END;
GO
/****** Object:  StoredProcedure [dbo].[GetEmployeeAllowancesWithFinalall]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[GetEmployeeAllowancesWithFinalall]
AS
BEGIN
    SET NOCOUNT ON;

    WITH EmployeeAllowances AS (
        SELECT DISTINCT
            e.pn_CompanyID,
            e.pn_BranchID,
            e.Employee_Full_Name,
            e.EmployeeCode,
            e.pn_EmployeeID,
            av.Grade_Name,
            av.Level_Name,
            av.v_EarningsName,
            av.Allowancetype,
            av.Cal_Based_on,
            CASE 
                WHEN av.Allowancetype = 'Fixed' THEN av.value
                WHEN av.Cal_Based_on = 'CTC' THEN (e.CTC * av.value / 100)
                WHEN av.Cal_Based_on = 'BasicPay' THEN (e.Basic_Salary * av.value / 100)
                ELSE 0
            END AS OriginalAmount,
            aset.Prorata_basis, -- Prorata flag specific to each earning
            av.d_order
        FROM 
            [dbo].[AllowanceValues] av
        JOIN 
            [dbo].[paym_Employee] e
            ON av.Grade_Name = e.Grade
            OR av.Level_Name = e.Grade
        LEFT JOIN (
            SELECT 
                pn_CompanyID, pn_BranchID, v_EarningsName, 
                MAX(Prorata_basis) AS Prorata_basis
            FROM 
                [dbo].[Allowancesettings]
            GROUP BY 
                pn_CompanyID, pn_BranchID, v_EarningsName
        ) aset
        ON av.pn_companyid = aset.pn_CompanyID
        AND av.pn_branchid = aset.pn_BranchID
        AND av.v_EarningsName = aset.v_EarningsName
        WHERE 
            av.pn_branchid = e.pn_BranchID
            AND (av.Allowancetype IN ('Fixed', 'Percentage'))
            AND NOT (av.c_Regular = 'N' AND av.payslip = 'N')
    ),
    AbsentDays AS (
        SELECT 
            tc.emp_code,
            COUNT(CASE WHEN tc.Status = 'A' THEN 1 ELSE NULL END) AS FullDayAbsences,
            COUNT(CASE WHEN tc.Status = 'HD' THEN 1 ELSE NULL END) AS HalfDayAbsences,
            MAX(DATEPART(DAY, EOMONTH(tc.dates))) AS TotalDaysInMonth,
            DATEPART(YEAR, tc.dates) AS Year,
            DATEPART(MONTH, tc.dates) AS Month
        FROM 
            [dbo].[time_card] tc
        GROUP BY 
            tc.emp_code, DATEPART(YEAR, tc.dates), DATEPART(MONTH, tc.dates)
    )
    SELECT 
        ea.pn_CompanyID,
        ea.pn_BranchID,
        ea.pn_EmployeeID,
        ea.Employee_Full_Name,
        ea.EmployeeCode,
        ad.Year, -- Year
        ad.Month, -- Month
        SUM(
            CASE 
                WHEN ea.Prorata_basis = 'Y' THEN 
                    CEILING(
                        ea.OriginalAmount - (
                            (ea.OriginalAmount / ISNULL(ad.TotalDaysInMonth, 31)) * 
                            (ISNULL(ad.FullDayAbsences, 0) + ISNULL(ad.HalfDayAbsences, 0) * 0.5)
                        )
                    )
                ELSE 
                    ea.OriginalAmount
            END
        ) AS TotalAllowance -- Total Allowance for the employee in the month
    FROM 
        EmployeeAllowances ea
    LEFT JOIN 
        AbsentDays ad
        ON ea.EmployeeCode = ad.emp_code
    WHERE 
        ea.Prorata_basis IN ('Y', 'N') -- Ensure only valid prorata values
    GROUP BY
        ea.pn_CompanyID, 
        ea.pn_BranchID, 
        ea.pn_EmployeeID, 
        ea.Employee_Full_Name, 
        ea.EmployeeCode,
        ad.Year,
        ad.Month
    ORDER BY   
        ea.EmployeeCode, ad.Year, ad.Month;
END;
GO
/****** Object:  StoredProcedure [dbo].[GetEmployeeAllowancesWithFinalAmounts]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[GetEmployeeAllowancesWithFinalAmounts]
AS
BEGIN
    SET NOCOUNT ON;

    WITH EmployeeAllowances AS (
        SELECT DISTINCT
            e.pn_CompanyID,
            e.pn_BranchID,
            e.Employee_Full_Name,
            e.EmployeeCode,
            e.pn_EmployeeID,
            av.Grade_Name,
            av.Level_Name,
            av.v_EarningsName,
            av.Allowancetype,
            av.Cal_Based_on,
            CASE 
                WHEN av.Allowancetype = 'Fixed' THEN av.value
                WHEN av.Cal_Based_on = 'CTC' THEN (e.CTC * av.value / 100)
                WHEN av.Cal_Based_on = 'BasicPay' THEN (e.Basic_Salary * av.value / 100)
                ELSE 0
            END AS OriginalAmount,
            aset.Prorata_basis, -- Prorata flag specific to each earning
            av.d_order
        FROM 
            [dbo].[AllowanceValues] av
        JOIN 
            [dbo].[paym_Employee] e
            ON av.Grade_Name = e.Grade
            OR av.Level_Name = e.Grade
        LEFT JOIN (
            SELECT 
                pn_CompanyID, pn_BranchID, v_EarningsName, 
                MAX(Prorata_basis) AS Prorata_basis
            FROM 
                [dbo].[Allowancesettings]
            GROUP BY 
                pn_CompanyID, pn_BranchID, v_EarningsName
        ) aset
        ON av.pn_companyid = aset.pn_CompanyID
        AND av.pn_branchid = aset.pn_BranchID
        AND av.v_EarningsName = aset.v_EarningsName
        WHERE 
            av.pn_branchid = e.pn_BranchID
            AND (av.Allowancetype IN ('Fixed', 'Percentage'))
            AND NOT (av.c_Regular = 'N' AND av.payslip = 'N')
    ),
    AbsentDays AS (
        SELECT 
            tc.emp_code,
            COUNT(CASE WHEN tc.Status = 'A' THEN 1 ELSE NULL END) AS FullDayAbsences,
            COUNT(CASE WHEN tc.Status = 'HD' THEN 1 ELSE NULL END) AS HalfDayAbsences,
            MAX(DATEPART(DAY, EOMONTH(tc.dates))) AS TotalDaysInMonth,
            DATEPART(YEAR, tc.dates) AS Year,
            DATEPART(MONTH, tc.dates) AS Month
        FROM 
            [dbo].[time_card] tc
        GROUP BY 
            tc.emp_code, DATEPART(YEAR, tc.dates), DATEPART(MONTH, tc.dates)
    )
    SELECT DISTINCT
        ea.pn_CompanyID,
        ea.pn_BranchID,
        ea.pn_EmployeeID,
        ea.Employee_Full_Name,
        ea.EmployeeCode,
        ea.Grade_Name,
        ea.Level_Name,
        ea.v_EarningsName,
        ea.OriginalAmount,
        ea.Prorata_basis, -- Show prorata basis (Y or N)
        CASE 
            WHEN ea.Prorata_basis = 'Y' THEN 
                CEILING(
                    ea.OriginalAmount - (
                        (ea.OriginalAmount / ISNULL(ad.TotalDaysInMonth, 31)) * 
                        (ISNULL(ad.FullDayAbsences, 0) + ISNULL(ad.HalfDayAbsences, 0) * 0.5)
                    )
                )
            ELSE 
                ea.OriginalAmount
        END AS FinalAmount,
        ea.d_order,
        ad.Year, -- Show Year
        ad.Month -- Show Month
    FROM 
        EmployeeAllowances ea
    LEFT JOIN 
        AbsentDays ad
        ON ea.EmployeeCode = ad.emp_code
    WHERE 
        ea.Prorata_basis IN ('Y', 'N') -- Ensure only valid prorata values
    ORDER BY   
        ea.d_order, ad.Year, ad.Month;
END;
GO
/****** Object:  StoredProcedure [dbo].[GetEmployeeAllowancesWithFinalOT]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[GetEmployeeAllowancesWithFinalOT]
AS
BEGIN
    SET NOCOUNT ON;

    WITH EmployeeAllowances AS (
        SELECT DISTINCT
            e.pn_CompanyID,
            e.pn_BranchID,
            e.Employee_Full_Name,
            e.EmployeeCode,
            e.pn_EmployeeID,
            av.Grade_Name,
            av.Level_Name,
            av.v_EarningsName,
            av.Allowancetype,
            av.Cal_Based_on,
            CASE 
                WHEN av.Allowancetype = 'Fixed' THEN av.value
                WHEN av.Allowancetype = 'Percentage' AND av.Cal_Based_on = 'CTC' THEN (e.CTC * av.value / 100.0)
                WHEN av.Allowancetype = 'Percentage' AND av.Cal_Based_on = 'BasicPay' THEN (e.Basic_Salary * av.value / 100.0)
                ELSE 0
            END AS OriginalAmount,
            aset.Prorata_basis,
            aset.c_OT,
            av.d_order
        FROM 
            [dbo].[AllowanceValues] av
        JOIN 
            [dbo].[paym_Employee] e
            ON av.Grade_Name = e.Grade
            OR av.Level_Name = e.Grade
        LEFT JOIN (
            SELECT 
                pn_CompanyID, pn_BranchID, v_EarningsName, 
                MAX(Prorata_basis) AS Prorata_basis,
                MAX(c_OT) AS c_OT
            FROM 
                [dbo].[Allowancesettings]
            GROUP BY 
                pn_CompanyID, pn_BranchID, v_EarningsName
        ) aset
        ON av.pn_companyid = aset.pn_CompanyID
        AND av.pn_branchid = aset.pn_BranchID
        AND av.v_EarningsName = aset.v_EarningsName
        WHERE 
            av.pn_branchid = e.pn_BranchID
            AND av.Allowancetype IN ('Fixed', 'Percentage')
            AND NOT (av.c_Regular = 'N' AND av.payslip = 'N')
            AND (aset.c_OT = 'Y' OR aset.c_OT IS NULL)
    ),
    AbsentDays AS (
        SELECT 
            tc.emp_code,
            COUNT(CASE WHEN tc.Status = 'A' THEN 1 ELSE NULL END) AS FullDayAbsences,
            COUNT(CASE WHEN tc.Status = 'HD' THEN 1 ELSE NULL END) AS HalfDayAbsences,
            MAX(DATEPART(DAY, EOMONTH(tc.dates))) AS TotalDaysInMonth,
            DATEPART(YEAR, tc.dates) AS Year,
            DATEPART(MONTH, tc.dates) AS Month,
            COUNT(CASE WHEN tc.Status = 'A' THEN 1 ELSE NULL END) + 
            (COUNT(CASE WHEN tc.Status = 'HD' THEN 1 ELSE NULL END) * 0.5) AS TotalAbsentDays
        FROM 
            [dbo].[time_card] tc
        GROUP BY 
            tc.emp_code, DATEPART(YEAR, tc.dates), DATEPART(MONTH, tc.dates)
    )
    SELECT 
        ea.pn_CompanyID,
        ea.pn_BranchID,
        ea.pn_EmployeeID,
        ea.Employee_Full_Name,
        ea.EmployeeCode,
        ad.Year,
        ad.Month,
        ISNULL(ad.FullDayAbsences, 0) AS FullDayAbsences,
        ISNULL(ad.HalfDayAbsences, 0) AS HalfDayAbsences,
        ISNULL(ad.TotalDaysInMonth, 31) AS TotalDaysInMonth,
        ISNULL(ad.TotalAbsentDays, 0) AS TotalAbsentDays,
        (ISNULL(ad.TotalDaysInMonth, 31) - ISNULL(ad.TotalAbsentDays, 0)) AS PaidDays,
        COALESCE(SUM(
            CASE 
                WHEN ea.Prorata_basis = 'Y' THEN 
                    (ea.OriginalAmount / ISNULL(ad.TotalDaysInMonth, 31)) * 
                    (ISNULL(ad.TotalDaysInMonth, 31) - ISNULL(ad.TotalAbsentDays, 0))
                ELSE 
                    ea.OriginalAmount
            END
        ), 0) AS TotalAllowance
    FROM 
        EmployeeAllowances ea
    LEFT JOIN 
        AbsentDays ad
        ON ea.EmployeeCode = ad.emp_code
    WHERE 
        ea.Prorata_basis IN ('Y', 'N')
    GROUP BY
        ea.pn_CompanyID, 
        ea.pn_BranchID, 
        ea.pn_EmployeeID, 
        ea.Employee_Full_Name, 
        ea.EmployeeCode,
        ad.Year,
        ad.Month,
        ad.FullDayAbsences,
        ad.HalfDayAbsences,
        ad.TotalDaysInMonth,
        ad.TotalAbsentDays
    UNION ALL
    SELECT 
        e.pn_CompanyID,
        e.pn_BranchID,
        e.pn_EmployeeID,
        e.Employee_Full_Name,
        e.EmployeeCode,
        ad.Year,
        ad.Month,
        ISNULL(ad.FullDayAbsences, 0) AS FullDayAbsences,
        ISNULL(ad.HalfDayAbsences, 0) AS HalfDayAbsences,
        ISNULL(ad.TotalDaysInMonth, 31) AS TotalDaysInMonth,
        ISNULL(ad.TotalAbsentDays, 0) AS TotalAbsentDays,
        (ISNULL(ad.TotalDaysInMonth, 31) - ISNULL(ad.TotalAbsentDays, 0)) AS PaidDays,
        0 AS TotalAllowance
    FROM 
        [dbo].[paym_Employee] e
    LEFT JOIN 
        AbsentDays ad
        ON e.EmployeeCode = ad.emp_code
    WHERE 
        NOT EXISTS (
            SELECT 1 
            FROM EmployeeAllowances ea 
            WHERE ea.pn_EmployeeID = e.pn_EmployeeID
        )
    ORDER BY   
        EmployeeCode, Year, Month;
END;
GO
/****** Object:  StoredProcedure [dbo].[GetEmployeeAttendanceBonus]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[GetEmployeeAttendanceBonus]
AS
BEGIN
    -- Set the transaction isolation level
    SET NOCOUNT ON;

    -- Define the main query with the employee details and status count
    WITH EmployeeAttendance AS (
        SELECT 
            e.pn_CompanyID,
            e.pn_BranchID,
            e.pn_EmployeeID,
            emp.EmployeeCode,
            emp.Employee_Full_Name,
            e.pn_CategoryId,
            c.v_CategoryName,
            DATEPART(YEAR, tc.dates) AS [Year],        -- Extract year from the Date column
            DATEPART(MONTH, tc.dates) AS [Month],      -- Extract month from the Date column
          SUM(CASE WHEN tc.Status = 'A' THEN 1 ELSE 0 END) + 
          SUM(CASE WHEN tc.Status = 'HD' THEN 0.5 ELSE 0 END) AS Status_A_Count

        FROM 
           [dbo].[paym_employee_profile1] e 
        INNER JOIN 
            [dbo].[paym_Category] c  
        ON 
            e.pn_CompanyID = c.pn_CompanyID
            AND e.pn_BranchID = c.BranchID
            AND e.pn_CategoryId = c.pn_CategoryId
        INNER JOIN 
            [dbo].[paym_Employee] emp 
        ON 
            e.pn_CompanyID = emp.pn_CompanyID
            AND e.pn_BranchID = emp.pn_BranchID
            AND e.pn_EmployeeID = emp.pn_EmployeeID
        LEFT JOIN 
            [dbo].[time_card] tc 
        ON 
            e.pn_CompanyID = tc.pn_CompanyID
            AND e.pn_BranchID = tc.pn_BranchID
            AND e.pn_EmployeeID = tc.pn_EmployeeID
        GROUP BY 
            e.pn_CompanyID,
            e.pn_BranchID,
            e.pn_EmployeeID,
            emp.EmployeeCode,
            emp.Employee_Full_Name,
            e.pn_CategoryId,
            c.v_CategoryName,
            DATEPART(YEAR, tc.dates),
            DATEPART(MONTH, tc.dates)
    )

    -- Join with Attendance_Bonus table to get the corresponding Attendance_Bonus_Value
    SELECT 
        ea.pn_CompanyID,
        ea.pn_BranchID,
        ea.pn_EmployeeID,
        ea.EmployeeCode,
        ea.Employee_Full_Name,
        ea.pn_CategoryId,
        ea.v_CategoryName,
        ea.[Year],
        ea.[Month],
        ea.Status_A_Count,
        ab.Attendance_bonus_type,
        ab.Attendance_Bonus_Value
    FROM 
        EmployeeAttendance ea
    LEFT JOIN 
        [dbo].[Attendance_Bonus] ab
    ON 
	ea.pn_CompanyID = ab.pn_companyid and
	ea.pn_BranchID = ab.pn_branchid and
	ea.v_CategoryName = ab.Category_Name and
        ea.Status_A_Count = ab.Attendance_bonus_type
    ORDER BY 
        ea.EmployeeCode,
        ea.[Year],
        ea.[Month];
END

GO
/****** Object:  StoredProcedure [dbo].[GetEmployeeOTDetails]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[GetEmployeeOTDetails]
    @CategoryName NVARCHAR(100) = NULL -- Optional parameter to filter by category name
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        tc.pn_companyid,
        tc.pn_branchid,
        ep.pn_EmployeeID,
        tc.emp_code,
        tc.ot_hrs,
        e.Employee_Full_Name,
        ep.pn_CategoryId,
        o.Category_Name, -- Include category name
        -- Convert ot_hrs to time format
        CONVERT(VARCHAR(8), CAST(tc.ot_hrs AS TIME), 108) AS Formatted_OT_Hours,
        o.Ot_From_Duration, -- OT slab start
        o.Ot_To_Duration,   -- OT slab end
        o.Ot_Rate,          -- OT rate
        -- Return OT hours and rate if the employee's OT falls within the slab range
        CASE 
            WHEN CONVERT(TIME, CAST(tc.ot_hrs AS TIME)) BETWEEN CONVERT(TIME, o.Ot_From_Duration) AND CONVERT(TIME, o.Ot_To_Duration)
            THEN tc.ot_hrs
            ELSE NULL
        END AS Matched_OT_Hours,
        CASE 
            WHEN CONVERT(TIME, CAST(tc.ot_hrs AS TIME)) BETWEEN CONVERT(TIME, o.Ot_From_Duration) AND CONVERT(TIME, o.Ot_To_Duration)
            THEN o.Ot_Rate
            ELSE NULL
        END AS Matched_OT_Rate
    FROM 
        [dbo].[time_card] tc
    JOIN 
        [dbo].[paym_Employee] e ON tc.emp_code = e.EmployeeCode  
    JOIN 
        [dbo].[paym_employee_profile1] ep ON e.pn_EmployeeID = ep.pn_EmployeeID
    JOIN 
        [dbo].[paym_category] c ON ep.pn_CategoryId = c.pn_CategoryId
    JOIN 
        [dbo].[OtslabNew] o ON c.v_CategoryName = o.Category_Name
    WHERE 
        (@CategoryName IS NULL OR c.v_CategoryName = @CategoryName)
        AND CONVERT(TIME, CAST(tc.ot_hrs AS TIME)) 
            BETWEEN CONVERT(TIME, o.Ot_From_Duration) AND CONVERT(TIME, o.Ot_To_Duration)
END;
GO
/****** Object:  StoredProcedure [dbo].[GetEmployeeOvertimeAndAllowances]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[GetEmployeeOvertimeAndAllowances]
AS
BEGIN
    SET NOCOUNT ON;

    WITH OTAllowances AS (
        -- Calculate allowances included in OT
        SELECT 
            e.EmployeeCode AS emp_code,
            av.pn_companyid,
            av.pn_branchid,
            SUM(
                CASE 
                    WHEN aset.c_OT = 'Y' THEN 
                        CASE 
                            WHEN av.Allowancetype = 'Fixed' THEN av.value
                            WHEN av.Cal_Based_on = 'CTC' THEN (e.CTC * av.value / 100)
                            WHEN av.Cal_Based_on = 'BasicPay' THEN (e.basic_salary * av.value / 100)
                            ELSE 0
                        END
                    ELSE 0
                END
            ) AS OT_AllowanceValue
        FROM 
            [dbo].[AllowanceSettings] aset
        JOIN 
            [dbo].[AllowanceValues] av ON aset.v_EarningsName = av.v_EarningsName
        JOIN 
            [dbo].[paym_Employee] e ON av.Grade_Name = e.Grade OR av.Level_Name = e.Grade
        GROUP BY 
            e.EmployeeCode, av.pn_companyid, av.pn_branchid
    ),
    OTCalculations AS (
        SELECT 
            tc.pn_companyid,
            tc.pn_branchid,
            ep.pn_EmployeeID,
            tc.emp_code,
            tc.ot_hrs,
            e.Employee_Full_Name,
            ep.pn_CategoryId,
            c.v_CategoryName,
            CONVERT(VARCHAR(8), CAST(tc.ot_hrs AS TIME), 108) AS Formatted_OT_Hours,
            o.Ot_From_Duration,
            o.Ot_To_Duration,
            o.Ot_Rate,
            e.CTC,
            e.basic_salary,
            e.Grade,
            DAY(EOMONTH(tc.dates)) AS Total_Days_In_Month,
            ((e.basic_salary + COALESCE(ota.OT_AllowanceValue, 0)) / (DAY(EOMONTH(tc.dates)) * 8)) * o.Ot_Rate AS OverTimePay,
            FORMAT(tc.dates, 'dd/MM/yyyy') AS Formatted_Date
        FROM 
            [dbo].[time_card] tc
        JOIN 
            [dbo].[paym_Employee] e ON tc.emp_code = e.EmployeeCode
        JOIN 
            [dbo].[paym_employee_profile1] ep ON e.pn_EmployeeID = ep.pn_EmployeeID
        JOIN 
            [dbo].[paym_category] c ON ep.pn_CategoryId = c.pn_CategoryId
        JOIN 
            [dbo].[OtslabNew] o ON c.v_CategoryName = o.Category_Name
        LEFT JOIN 
            OTAllowances ota ON tc.emp_code = ota.emp_code AND tc.pn_branchid = ota.pn_branchid
        WHERE 
            CONVERT(TIME, CAST(tc.ot_hrs AS TIME)) BETWEEN CONVERT(TIME, o.Ot_From_Duration) AND CONVERT(TIME, o.Ot_To_Duration)
    ),
    AllowanceCalculations AS (
        -- Unchanged logic for allowances not related to OT
        SELECT 
            av.pn_companyid,
            av.pn_branchid,
            e.EmployeeCode AS emp_code,
            e.Employee_Full_Name AS emp_name,
            e.CTC,
            e.basic_salary,
            av.Level_Name,
            SUM(
                CASE 
                    WHEN aset.c_OT = 'Y' THEN 0 -- Exclude OT-related allowances
                    WHEN av.Allowancetype = 'Fixed' THEN av.value
                    WHEN av.Cal_Based_on = 'CTC' THEN (e.CTC * av.value / 100)
                    WHEN av.Cal_Based_on = 'BasicPay' THEN (e.basic_salary * av.value / 100)
                    ELSE 0
                END
            ) AS Total_Allowance
        FROM 
            [dbo].[AllowanceValues] av
        JOIN 
            [dbo].[paym_Employee] e
            ON av.Grade_Name = e.Grade
            OR av.Level_Name = e.Grade
        JOIN 
            [dbo].[AllowanceSettings] aset
            ON av.v_EarningsName = aset.v_EarningsName
        GROUP BY 
            av.pn_companyid,
            av.pn_branchid,
            e.EmployeeCode,
            e.Employee_Full_Name,
            e.CTC,
            e.basic_salary,
            av.Level_Name
    ),
    RankedOT AS (
        SELECT 
            ot.pn_companyid,
            ot.pn_branchid,
            ot.emp_code,
            ot.Employee_Full_Name,
            ot.CTC,
            ot.basic_salary,
            ot.Grade,
            ot.Formatted_OT_Hours,
            ot.Ot_From_Duration,
            ot.Ot_To_Duration,
            ot.Ot_Rate,
            ot.OverTimePay,
            ot.Total_Days_In_Month,
            ot.Formatted_Date,
            ac.Level_Name,
            ac.Total_Allowance,
            ROW_NUMBER() OVER (PARTITION BY ot.emp_code, ot.Formatted_Date ORDER BY ot.Formatted_Date) AS rn
        FROM 
            OTCalculations ot
        LEFT JOIN 
            AllowanceCalculations ac ON ot.emp_code = ac.emp_code AND ot.pn_branchid = ac.pn_branchid
    )
    -- Final output unchanged
    SELECT 
        ro.pn_companyid,
        ro.pn_branchid,
        ro.emp_code,
        ro.Employee_Full_Name,
        ro.CTC,
        ro.basic_salary,
        ro.Grade,
        ro.Formatted_OT_Hours,
        ro.Ot_From_Duration,
        ro.Ot_To_Duration,
        ro.Ot_Rate,
        ro.OverTimePay,
        ro.Total_Days_In_Month,
        ro.Formatted_Date,
        ro.Level_Name,
        ro.Total_Allowance
    FROM 
        RankedOT ro
    WHERE 
        ro.rn = 1
    ORDER BY 
        ro.emp_code, ro.Total_Days_In_Month, ro.Level_Name;
END;
GO
/****** Object:  StoredProcedure [dbo].[GetEmployeeSummaryInPayBill]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[GetEmployeeSummaryInPayBill]
AS
BEGIN
    SET NOCOUNT ON;

    -- Declare variables for Salary, Attendance, and Deductions calculations
    DECLARE @EmployeeCode VARCHAR(10), @EmployeeName VARCHAR(50);
    DECLARE @pn_CompanyID INT, @pn_BranchID INT, @pn_EmployeeID INT;
    DECLARE @Month INT, @Year INT;
    DECLARE @CTC FLOAT, @BasicSalary FLOAT, @ActualSalary FLOAT, @Earnedbasic FLOAT;
    DECLARE @PresentDays INT, @OffDays INT, @HalfDays INT, @LeaveDays INT;
    DECLARE @Holidays INT, @WorkFromHome INT, @AbsentDays INT, @PaidDays FLOAT;
    DECLARE @TotalDaysInMonth INT, @TotalCalculatedDays INT;
    DECLARE @TotalAllowances FLOAT; -- Declare variable for total allowances
    DECLARE @GrossSalary FLOAT; -- Declare variable for gross salary
    DECLARE @TotalDeductions FLOAT; -- Declare variable for total deductions
    DECLARE @NetSalary FLOAT; -- Declare variable for net salary

    -- Temporary table for employees
    SELECT 
        pn_CompanyID,
        pn_BranchID,
        pn_EmployeeID,
        EmployeeCode, 
        Employee_Full_Name AS EmployeeName
    INTO #EmployeeList
    FROM [dbo].[paym_employee];

    -- Create a table to hold the results
    CREATE TABLE #EmployeeSummary (
        pn_CompanyID INT,
        pn_BranchID INT,
        pn_EmployeeID INT,
        EmployeeCode VARCHAR(10),
        EmployeeName VARCHAR(50),
        Month INT,
        Year INT,
        NoOfPresentDays INT,
        NoOfOffDays INT,
        NoOfHalfDays INT,
        Holidays INT,
        WorkFromHome INT,
        NoOfLeaves INT,
        AbsentDays INT,
        PaidDays FLOAT,
        TotalCalculatedDays INT,
        BasicSalary FLOAT,
        ActualSalary FLOAT,
        Earnedbasic FLOAT,
        CTC FLOAT,
        GrossSalary FLOAT, -- Add GrossSalary column here
        TotalDeductions FLOAT, -- Add TotalDeductions column here
        NetSalary FLOAT -- Add NetSalary column here
    );

    -- Loop through each employee
    DECLARE EmployeeCursor CURSOR FOR
    SELECT pn_CompanyID, pn_BranchID, pn_EmployeeID, EmployeeCode, EmployeeName 
    FROM #EmployeeList;

    OPEN EmployeeCursor;
    FETCH NEXT FROM EmployeeCursor INTO @pn_CompanyID, @pn_BranchID, @pn_EmployeeID, @EmployeeCode, @EmployeeName;

    WHILE @@FETCH_STATUS = 0
    BEGIN
        -- Get CTC and BasicSalary for the employee
        SELECT @CTC = ctc, @BasicSalary = basic_salary
        FROM [dbo].[paym_employee]
        WHERE EmployeeCode = @EmployeeCode;

        -- Calculate Gross Salary (CTC / 12)
        SET @ActualSalary = @CTC / 12;



        -- Get total allowances for the employee
        SELECT @TotalAllowances = SUM(COALESCE(value1, 0) + COALESCE(value2, 0) + 
                                       COALESCE(value3, 0) + COALESCE(value4, 0) +
                                       COALESCE(value5, 0) + COALESCE(value6, 0) + 
                                       COALESCE(value7, 0) + COALESCE(value8, 0) + 
                                       COALESCE(value9, 0) + COALESCE(value10, 0))
        FROM [dbo].[EarnDeductValuesMasters]
        WHERE pn_CompanyID = @pn_CompanyID AND pn_BranchID = @pn_BranchID and pn_EmployeeID = @pn_EmployeeID;

        -- Calculate Gross Salary
        SET @GrossSalary = @BasicSalary + @TotalAllowances;

        -- Get total deductions for the employee
        SELECT @TotalDeductions = SUM(COALESCE(valueA1, 0) + COALESCE(valueA2, 0) + 
                                       COALESCE(valueA3, 0) + COALESCE(valueA4, 0) +
                                       COALESCE(valueA5, 0) + COALESCE(valueA6, 0) + 
                                       COALESCE(valueA7, 0) + COALESCE(valueA8, 0) + 
                                       COALESCE(valueA9, 0) + COALESCE(valueA10, 0))
        FROM [dbo].[EarnDeductValuesMasters]
        WHERE pn_CompanyID = @pn_CompanyID AND pn_BranchID = @pn_BranchID AND pn_EmployeeID = @pn_EmployeeID;

        -- Calculate Net Salary
        SET @NetSalary = @GrossSalary - @TotalDeductions;

        -- Loop through each month/year combination in the time_card table
        DECLARE MonthYearCursor CURSOR FOR
        SELECT DISTINCT MONTH([dates]) AS Month, YEAR([dates]) AS Year
        FROM [dbo].[time_card]
        WHERE [emp_code] = @EmployeeCode;

        OPEN MonthYearCursor;
        FETCH NEXT FROM MonthYearCursor INTO @Month, @Year;

        WHILE @@FETCH_STATUS = 0
        BEGIN
            -- Initialize counts for attendance
            SET @PresentDays = 0;
            SET @OffDays = 0;
            SET @HalfDays = 0;
            SET @LeaveDays = 0;
            SET @Holidays = 0;
            SET @WorkFromHome = 0;
            SET @AbsentDays = 0;

            -- Attendance calculations
            SELECT @PresentDays = COUNT(*) 
            FROM [dbo].[time_card]
            WHERE [emp_code] = @EmployeeCode AND [status] = 'P' AND MONTH([dates]) = @Month AND YEAR([dates]) = @Year;

            SELECT @OffDays = COUNT(*) 
            FROM [dbo].[time_card]
            WHERE [emp_code] = @EmployeeCode AND [status] = 'W' AND MONTH([dates]) = @Month AND YEAR([dates]) = @Year;

            SELECT @WorkFromHome = COUNT(*) 
            FROM [dbo].[time_card]
            WHERE [emp_code] = @EmployeeCode AND [status] = 'WFH' AND MONTH([dates]) = @Month AND YEAR([dates]) = @Year;

            SELECT @Holidays = COUNT(*) 
            FROM [dbo].[time_card]
            WHERE [emp_code] = @EmployeeCode AND [status] = 'H' AND MONTH([dates]) = @Month AND YEAR([dates]) = @Year;

            SELECT @HalfDays = COUNT(*) 
            FROM [dbo].[time_card]
            WHERE [emp_code] = @EmployeeCode AND [status] = 'HD' AND MONTH([dates]) = @Month AND YEAR([dates]) = @Year;

            SELECT @LeaveDays = COUNT(*) 
            FROM [dbo].[time_card]
            WHERE [emp_code] = @EmployeeCode AND ([leave_code] = 'LC001' OR [leave_code] = 'LC002') AND MONTH([dates]) = @Month AND YEAR([dates]) = @Year;

            SELECT @AbsentDays = COUNT(*) 
            FROM [dbo].[time_card]
            WHERE [emp_code] = @EmployeeCode AND [status] = 'A' AND MONTH([dates]) = @Month AND YEAR([dates]) = @Year;

            -- Calculate PaidDays
            SET @PaidDays = @PresentDays + @OffDays + (@HalfDays * 0.5) + @LeaveDays + @Holidays + @WorkFromHome;

            -- Calculate Total Days in the month
            SET @TotalDaysInMonth = DAY(EOMONTH(CONVERT(DATE, CONCAT(@Year, '-', @Month, '-01'))));

            -- Calculate Earned Basic Salary
            SET @Earnedbasic = (@BasicSalary / @TotalDaysInMonth) * @PaidDays;

            -- Calculate total days for the employee in that month
            SET @TotalCalculatedDays = (SELECT COUNT(*) 
                                        FROM [dbo].[time_card] 
                                        WHERE [emp_code] = @EmployeeCode 
                                        AND MONTH([dates]) = @Month 
                                        AND YEAR([dates]) = @Year);

            -- Insert the results into the summary table
            INSERT INTO #EmployeeSummary (
                pn_CompanyID, pn_BranchID, pn_EmployeeID, EmployeeCode, EmployeeName, Month, Year, 
                NoOfPresentDays, NoOfOffDays, NoOfHalfDays, Holidays, WorkFromHome, NoOfLeaves, AbsentDays, 
                PaidDays, TotalCalculatedDays, BasicSalary, ActualSalary, Earnedbasic, CTC, GrossSalary,
                TotalDeductions, NetSalary)
            VALUES (
                @pn_CompanyID, @pn_BranchID, @pn_EmployeeID, @EmployeeCode, @EmployeeName, @Month, @Year, 
                @PresentDays, @OffDays, @HalfDays, @Holidays, @WorkFromHome, @LeaveDays, @AbsentDays, 
                @PaidDays, @TotalCalculatedDays, @BasicSalary, @ActualSalary, @Earnedbasic, @CTC, @GrossSalary,
                @TotalDeductions, @NetSalary);

            -- Insert into paym_paybill after calculations
            INSERT INTO paym_paybill (
                pn_CompanyID, pn_BranchID, pn_EmployeeID, EmployeeCode, Employee_First_Name, Earned_Basic, Calc_Days, Paid_Days, Present_Days, Absent_Days, WeekOffDays, Holidays, TotLeave_Days)
            VALUES (
                @pn_CompanyID, @pn_BranchID, @pn_EmployeeID, @EmployeeCode, @EmployeeName, @Earnedbasic , @TotalCalculatedDays, @PaidDays, @PresentDays, @AbsentDays, @OffDays, @Holidays, @LeaveDays);

            FETCH NEXT FROM MonthYearCursor INTO @Month, @Year;
        END;

        CLOSE MonthYearCursor;
        DEALLOCATE MonthYearCursor;

        FETCH NEXT FROM EmployeeCursor INTO @pn_CompanyID, @pn_BranchID, @pn_EmployeeID, @EmployeeCode, @EmployeeName;
    END;

    CLOSE EmployeeCursor;
    DEALLOCATE EmployeeCursor;

    -- Return the results
    SELECT * FROM #EmployeeSummary;

    -- Clean up temporary table
    DROP TABLE #EmployeeList;
    DROP TABLE #EmployeeSummary;
END;

GO
/****** Object:  StoredProcedure [dbo].[GetEmployeeTotalAllowancesWithFinalAmounts]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[GetEmployeeTotalAllowancesWithFinalAmounts]
AS
BEGIN
    SET NOCOUNT ON;

    WITH EmployeeAllowances AS (
        SELECT DISTINCT
            e.pn_CompanyID,
            e.pn_BranchID,
            e.Employee_Full_Name,
            e.EmployeeCode,
            e.pn_EmployeeID,
            av.Grade_Name,
            av.Level_Name,
            av.v_EarningsName,
            av.Allowancetype,
            av.Cal_Based_on,
            CASE 
                WHEN av.Allowancetype = 'Fixed' THEN av.value
                WHEN av.Cal_Based_on = 'CTC' THEN (e.CTC * av.value / 100)
                WHEN av.Cal_Based_on = 'BasicPay' THEN (e.Basic_Salary * av.value / 100)
                ELSE 0
            END AS OriginalAmount,
            aset.Prorata_basis, -- Prorata flag specific to each earning
            av.d_order
        FROM 
            [dbo].[AllowanceValues] av
        JOIN 
            [dbo].[paym_Employee] e
            ON av.Grade_Name = e.Grade
            OR av.Level_Name = e.Grade
        LEFT JOIN (
            SELECT 
                pn_CompanyID, pn_BranchID, v_EarningsName, 
                MAX(Prorata_basis) AS Prorata_basis
            FROM 
                [dbo].[Allowancesettings]
            GROUP BY 
                pn_CompanyID, pn_BranchID, v_EarningsName
        ) aset
        ON av.pn_companyid = aset.pn_CompanyID
        AND av.pn_branchid = aset.pn_BranchID
        AND av.v_EarningsName = aset.v_EarningsName
        WHERE 
            av.pn_branchid = e.pn_BranchID
            AND (av.Allowancetype IN ('Fixed', 'Percentage'))
            AND NOT (av.c_Regular = 'N' AND av.payslip = 'N')
    ),
    AbsentDays AS (
        SELECT 
            tc.emp_code,
            COUNT(CASE WHEN tc.Status = 'A' THEN 1 ELSE NULL END) AS FullDayAbsences,
            COUNT(CASE WHEN tc.Status = 'HD' THEN 1 ELSE NULL END) AS HalfDayAbsences,
            MAX(DATEPART(DAY, EOMONTH(tc.dates))) AS TotalDaysInMonth,
            DATEPART(YEAR, tc.dates) AS Year,
            DATEPART(MONTH, tc.dates) AS Month
        FROM 
            [dbo].[time_card] tc
        GROUP BY 
            tc.emp_code, DATEPART(YEAR, tc.dates), DATEPART(MONTH, tc.dates)
    )
    SELECT 
        ea.pn_CompanyID,
        ea.pn_BranchID,
        ea.pn_EmployeeID,
        ea.Employee_Full_Name,
        ea.EmployeeCode,
        ad.Year, -- Year
        ad.Month, -- Month
        SUM(
            CASE 
                WHEN ea.Prorata_basis = 'Y' THEN 
                    CEILING(
                        ea.OriginalAmount - (
                            (ea.OriginalAmount / ISNULL(ad.TotalDaysInMonth, 31)) * 
                            (ISNULL(ad.FullDayAbsences, 0) + ISNULL(ad.HalfDayAbsences, 0) * 0.5)
                        )
                    )
                ELSE 
                    ea.OriginalAmount
            END
        ) AS TotalAllowance -- Total Allowance for the employee in the month
    FROM 
        EmployeeAllowances ea
    LEFT JOIN 
        AbsentDays ad
        ON ea.EmployeeCode = ad.emp_code
    WHERE 
        ea.Prorata_basis IN ('Y', 'N') -- Ensure only valid prorata values
    GROUP BY
        ea.pn_CompanyID, 
        ea.pn_BranchID, 
        ea.pn_EmployeeID, 
        ea.Employee_Full_Name, 
        ea.EmployeeCode,
        ad.Year,
        ad.Month
    ORDER BY   
        ea.EmployeeCode, ad.Year, ad.Month;
END;
GO
/****** Object:  StoredProcedure [dbo].[GetPermissionDeduction]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[GetPermissionDeduction]
    @CompanyID INT,
    @BranchID INT = NULL,
    @PermissionMinutes INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Deduction VARCHAR(25);

    -- Find the deduction based on permission duration
    SELECT TOP 1 @Deduction = Permission_Deduction
    FROM paym_PermissionSlab
    WHERE pn_CompanyID = @CompanyID
        AND (pn_BranchID = @BranchID OR pn_BranchID IS NULL)
        AND CAST(From_Duration AS INT) <= @PermissionMinutes
        AND (
            -- Condition 1: Normal range-based duration check
            (ISNUMERIC(To_Duration) = 1 AND CAST(To_Duration AS INT) >= @PermissionMinutes)
            -- Condition 2: If To_Duration is "Upwards", consider it as unlimited
            OR (To_Duration = 'Upwards')
        )
    ORDER BY CAST(From_Duration AS INT) ASC;

    -- Return the deduction value
    IF @Deduction IS NOT NULL
        SELECT @Deduction AS Permission_Deduction;
    ELSE
        SELECT 'No Slab Defined' AS Permission_Deduction;
END;
GO
/****** Object:  StoredProcedure [dbo].[LoanPayment]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[LoanPayment] 
    @EmployeeID INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @ApplicationID INT;
	DECLARE @RequestedAmount DECIMAL(18,2);
	DECLARE @loantype varchar(50);
    DECLARE @LoanAmount DECIMAL(18,2), @InterestRate DECIMAL(5,2);
    DECLARE @RepaymentPeriod INT, @EffectiveDate DATE, @TotalInterest DECIMAL(18,2);
    DECLARE @TotalLoanAmount DECIMAL(18,2), @EMIAmount DECIMAL(18,2), @RemainingAmount DECIMAL(18,2);
    DECLARE @Month INT = 1, @EMIDueDate DATE, @ExtendedMonths INT = 0;
    DECLARE @PreclosureAmount DECIMAL(18,2), @LastRemainingAmount DECIMAL(18,2);
    DECLARE @CompanyID INT, @BranchID INT;
    
    -- Get latest approved loan application
    SELECT TOP 1 
        @ApplicationID = ApplicationID,
		@loantype = loantype,
	@RequestedAmount = RequestedAmount,
	@InterestRate =InterestRate
    FROM [paym_LoanApply_employee] 
    WHERE pn_EmployeeID = @EmployeeID AND ApplicationStatus = 'Approved' 
    ORDER BY ApplicationDate DESC;

    -- Validate if a loan exists
    IF @ApplicationID IS NULL
    BEGIN
        PRINT 'No approved loan found';
        RETURN;
    END;

    -- Fetch Loan Details
    BEGIN TRY
        SELECT 
            @LoanAmount = RequestedAmount, 
            @InterestRate = InterestRate, 
            @CompanyID = pn_CompanyId,
            @BranchID = pn_BranchId,
            @RepaymentPeriod = RepaymentPeriod,
            @EffectiveDate = EffectiveDate
        FROM [paym_LoanApply_employee] 
        WHERE ApplicationID = @ApplicationID;

        IF @LoanAmount IS NULL
        BEGIN
            RAISERROR('Loan details not found for ApplicationID: %d', 16, 1, @ApplicationID);
            RETURN;
        END;
    END TRY
    BEGIN CATCH
        PRINT 'Error fetching loan details: ' + ERROR_MESSAGE();
        RETURN;
    END CATCH;

    -- Calculate Total Loan Amount
    SET @TotalInterest = (@LoanAmount * (@InterestRate / 100)) * @RepaymentPeriod;
    SET @TotalLoanAmount = @LoanAmount + @TotalInterest;
    SET @EMIAmount = @TotalLoanAmount / @RepaymentPeriod;
    SET @RemainingAmount = @TotalLoanAmount;
    SET @EMIDueDate = DATEADD(MONTH, 1, @EffectiveDate);

    -- Temporary Table for Repayment Schedule
    CREATE TABLE #LoanRepaymentSchedule (
        EmployeeID INT,
        MonthNo INT,
        EMIAmount DECIMAL(18,2),
        PaidAmount DECIMAL(18,2) DEFAULT 0.00,
        RemainingAmount DECIMAL(18,2) DEFAULT 0.00,
        EMIDueDate DATE,
        Status VARCHAR(20)
    );

    -- Generate Repayment Schedule
    WHILE @Month <= @RepaymentPeriod + @ExtendedMonths
    BEGIN
        IF EXISTS (SELECT 1 FROM dbo.LoanPostponed WHERE ApplicationID = @ApplicationID AND ApprovalStatus = 'Approved' AND month_to_posted = @EMIDueDate)
        BEGIN
            INSERT INTO #LoanRepaymentSchedule (EmployeeID, MonthNo, EMIAmount, EMIDueDate, Status)
            VALUES (@EmployeeID, @Month, 0.00, @EMIDueDate, 'Postponed');
            SET @ExtendedMonths = @ExtendedMonths + 1;
        END
        ELSE
        BEGIN
            INSERT INTO #LoanRepaymentSchedule (EmployeeID, MonthNo, EMIAmount, EMIDueDate, Status)
            VALUES (@EmployeeID, @Month, @EMIAmount, @EMIDueDate, 'Pending');
        END;

        SET @EMIDueDate = DATEADD(MONTH, 1, @EMIDueDate);
        SET @Month = @Month + 1;
    END;

    -- Fetch Preclosure Amount
    SELECT @PreclosureAmount = PreclosureAmount 
    FROM dbo.LoanPreclosure 
    WHERE ApplicationID = @ApplicationID;

    -- Fetch Last Remaining Amount
    SELECT TOP 1 @LastRemainingAmount = RemainingAmount 
    FROM dbo.LoanRepayment 
    WHERE ApplicationID = @ApplicationID 
    ORDER BY ScheduledPaymentDate DESC;

    -- Handle Preclosure Case
    IF @LastRemainingAmount IS NOT NULL AND @PreclosureAmount IS NOT NULL AND @LastRemainingAmount = @PreclosureAmount
    BEGIN
        UPDATE LRS
        SET RemainingAmount = 0.00, Status = 'Preclosed'
        FROM #LoanRepaymentSchedule LRS
        WHERE LRS.Status = 'Pending';
    END;

    -- Mark Paid EMIs
    UPDATE LRS
    SET Status = 'Paid'
    FROM #LoanRepaymentSchedule LRS
    JOIN dbo.LoanRepayment LR ON LRS.EMIDueDate = LR.ScheduledPaymentDate
    WHERE LR.ApplicationID = @ApplicationID AND LR.PaymentStatus = 'Paid';

    -- Update Remaining Amounts
    UPDATE LRS
    SET RemainingAmount = 0.00
    FROM #LoanRepaymentSchedule LRS
    WHERE LRS.Status = 'Paid';

    -- Return Loan Repayment Schedule
    SELECT 
          LRS.MonthNo,
	@ApplicationID AS ApplicationID,
	@CompanyID AS CompanyID,  -- Adding Company ID
    @BranchID AS BranchID    ,
	LRS.EmployeeID,
	@loantype As loantype,
	@InterestRate As intrestrate,
	@RequestedAmount As PrincipalAmount,
	@TotalLoanAmount As TotalAmount,
    LRS.EMIAmount,
    LRS.EMIDueDate,
          COALESCE(
            (SELECT SUM(EMIAmount) 
             FROM dbo.LoanRepayment 
             WHERE ApplicationID = @ApplicationID 
               AND PaymentStatus = 'Paid' 
               AND ScheduledPaymentDate = LRS.EMIDueDate), 0) AS PaidAmount,
        CASE 
            WHEN LRS.Status = 'Preclosed' THEN 0.00
            ELSE @TotalLoanAmount - 
                 (SELECT COALESCE(SUM(EMIAmount), 0) 
                  FROM dbo.LoanRepayment 
                  WHERE ApplicationID = @ApplicationID 
                    AND PaymentStatus = 'Paid' 
                    AND ScheduledPaymentDate <= LRS.EMIDueDate)
        END AS RemainingAmount,
        LRS.Status
    FROM #LoanRepaymentSchedule LRS
    ORDER BY LRS.EMIDueDate;

    -- Cleanup
    DROP TABLE #LoanRepaymentSchedule; 
END;

------------------------------------------------------------------------
--EXEC LoanPayment @EmployeeID 

GO
/****** Object:  StoredProcedure [dbo].[NETSALARY]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[NETSALARY]
AS
BEGIN
    SET NOCOUNT ON;

    -- Create a temporary table to store output from GetEmployeeAttendanceBonus
    CREATE TABLE #AttendanceBonus (
        pn_CompanyID INT,
        pn_BranchID INT,
        pn_EmployeeID INT,
        EmployeeCode NVARCHAR(50),
        Employee_Full_Name NVARCHAR(100),
        pn_CategoryId INT,
        v_CategoryName NVARCHAR(100),
        Year INT,
        Month INT,
        Status_A_Count INT,
        Attendance_bonus_type NVARCHAR(50),
        Attendance_Bonus_Value DECIMAL(18, 2)
    );

    -- Insert data from GetEmployeeAttendanceBonus into the temporary table
    INSERT INTO #AttendanceBonus
    EXEC dbo.GetEmployeeAttendanceBonus;

    -- Create a temporary table to store Employee Allowances
    CREATE TABLE #EmployeeAllowances (
        pn_CompanyID INT,
        pn_BranchID INT,
        Employee_Full_Name NVARCHAR(100),
        EmployeeCode NVARCHAR(50),
        pn_EmployeeID INT,
        Grade_Name NVARCHAR(100),
        Level_Name NVARCHAR(100),
        v_EarningsName NVARCHAR(100),
        Allowancetype NVARCHAR(50),
        Cal_Based_on NVARCHAR(50),
        OriginalAmount DECIMAL(18, 2),
        Prorata_basis NVARCHAR(50),
        d_order INT
    );

    -- Insert data into #EmployeeAllowances table
    INSERT INTO #EmployeeAllowances
    SELECT DISTINCT
        e.pn_CompanyID,
        e.pn_BranchID,
        e.Employee_Full_Name,
        e.EmployeeCode,
        e.pn_EmployeeID,
        av.Grade_Name,
        av.Level_Name,
        av.v_EarningsName,
        av.Allowancetype,
        av.Cal_Based_on,
        CASE 
            WHEN av.Allowancetype = 'Fixed' THEN av.value
            WHEN av.Cal_Based_on = 'CTC' THEN (e.CTC * av.value / 100)
            WHEN av.Cal_Based_on = 'BasicPay' THEN (e.Basic_Salary * av.value / 100)
            ELSE 0
        END AS OriginalAmount,
        aset.Prorata_basis,
        av.d_order
    FROM 
        [dbo].[AllowanceValues] av
    JOIN 
        [dbo].[paym_Employee] e
        ON av.Grade_Name = e.Grade
        OR av.Level_Name = e.Grade
    LEFT JOIN (
        SELECT 
            pn_CompanyID, pn_BranchID, v_EarningsName, 
            MAX(Prorata_basis) AS Prorata_basis
        FROM 
            [dbo].[Allowancesettings]
        GROUP BY 
            pn_CompanyID, pn_BranchID, v_EarningsName
    ) aset
    ON av.pn_companyid = aset.pn_CompanyID
    AND av.pn_branchid = aset.pn_BranchID
    AND av.v_EarningsName = aset.v_EarningsName
    WHERE 
        av.pn_branchid = e.pn_BranchID
        AND (av.Allowancetype IN ('Fixed', 'Percentage'))
        AND NOT (av.c_Regular = 'N' AND av.payslip = 'N');

    -- Create a temporary table to store Attendance Data
    CREATE TABLE #AttendanceData (
        pn_EmployeeID INT,
        Year INT,
        Month INT,
        MonthsWithAttendance INT,
        AbsentDays DECIMAL(18, 2),
        TotalDays INT,
        PaidDays INT
    );

    -- Insert data into #AttendanceData table
    INSERT INTO #AttendanceData
    SELECT 
        tc.pn_EmployeeID,
        YEAR(tc.dates) AS Year,
        MONTH(tc.dates) AS Month,
        COUNT(DISTINCT MONTH(tc.dates)) AS MonthsWithAttendance,
        SUM(CASE WHEN tc.status = 'A' THEN 1 ELSE 0 END) + 
        SUM(CASE WHEN tc.status = 'HD' THEN 0.5 ELSE 0 END) AS AbsentDays,
        COUNT(tc.dates) AS TotalDays,
        COUNT(tc.dates) - 
        (SUM(CASE WHEN tc.status = 'A' THEN 1 ELSE 0 END) + 
         SUM(CASE WHEN tc.status = 'HD' THEN 0.5 ELSE 0 END)) AS PaidDays
    FROM 
        dbo.time_card tc
    GROUP BY 
        tc.pn_EmployeeID, YEAR(tc.dates), MONTH(tc.dates)
    HAVING COUNT(DISTINCT MONTH(tc.dates)) > 0;

    -- Create a temporary table to store Gross Salary Data
    CREATE TABLE #GrossSalaryData (
        pn_CompanyID INT,
        pn_BranchID INT,
        Employee_Full_Name NVARCHAR(100),
        EmployeeCode NVARCHAR(50),
        pn_EmployeeID INT,
        Basic_Salary DECIMAL(18, 2),
        Year INT,
        Month INT,
        TotalDays INT,
        PaidDays INT,
        AbsentDays DECIMAL(18, 2),
        Earned_Basic DECIMAL(18, 2),
        Gross_Salary DECIMAL(18, 2)
    );

    -- Insert data into #GrossSalaryData table
    INSERT INTO #GrossSalaryData
    SELECT 
        emp.pn_CompanyID,
        emp.pn_BranchID,
        emp.Employee_Full_Name,
        emp.EmployeeCode,
        emp.pn_EmployeeID,
        emp.Basic_Salary,
        ad.Year,
        ad.Month,
        ad.TotalDays,
        ad.PaidDays,
        ad.AbsentDays,
        CASE 
            WHEN ad.TotalDays > 0 THEN 
                (emp.Basic_Salary / ad.TotalDays) * ad.PaidDays
            ELSE 0 
        END AS Earned_Basic,
        (
            CASE 
                WHEN ad.TotalDays > 0 THEN 
                    (emp.Basic_Salary / ad.TotalDays) * ad.PaidDays
                ELSE 0 
            END +
            SUM(CASE 
                WHEN ea.d_order BETWEEN 1 AND 10 THEN
                    CASE 
                        WHEN ea.Prorata_basis = 'Y' THEN 
                            (ea.OriginalAmount - ((ea.OriginalAmount / ad.TotalDays) * ad.AbsentDays))
                        ELSE ea.OriginalAmount
                    END
                ELSE 0
            END)
        ) AS Gross_Salary
    FROM 
        #EmployeeAllowances ea
    JOIN 
        #AttendanceData ad
        ON ea.pn_EmployeeID = ad.pn_EmployeeID
    JOIN 
        [dbo].[paym_Employee] emp
        ON emp.pn_EmployeeID = ea.pn_EmployeeID
    GROUP BY 
        emp.pn_CompanyID,
        emp.pn_BranchID,
        emp.Employee_Full_Name,
        emp.EmployeeCode,
        emp.pn_EmployeeID,
        emp.Basic_Salary,
        ad.Year,
        ad.Month,
        ad.TotalDays,
        ad.PaidDays,
        ad.AbsentDays;

    -- Create a temporary table for Overtime Pay
    CREATE TABLE #OvertimePay (
        CompanyID INT,
        BranchID INT,
        EmployeeID INT,
        EmployeeCode NVARCHAR(50),
        EmployeeName NVARCHAR(50),
        Month INT,
        Year INT,
        TotalOverTimePay DECIMAL(18, 2)
    );

    -- Insert data from DisplayOvertimePay into the temporary table
    -- Step 1: Create a temporary table to store DisplayOvertimePay results
    CREATE TABLE #OvertimePayTemp (
        CompanyID INT,
        BranchID INT,
        EmployeeID INT,
        EmployeeCode NVARCHAR(50),
        EmployeeName NVARCHAR(50),
        Month INT,
        Year INT,
        TotalOverTimePay DECIMAL(18, 2)
    );

    -- Step 2: Insert results from DisplayOvertimePay stored procedure into the temporary table
    INSERT INTO #OvertimePayTemp
    EXEC dbo.DisplayOvertimePay;

    -- Step 3: Now use #OvertimePayTemp for the final SELECT
    INSERT INTO #OvertimePay
    SELECT * FROM #OvertimePayTemp;

    -- Create a temporary table for Total Deductions
    CREATE TABLE #TotalDeductions (
        pn_CompanyID INT,
        pn_BranchID INT,
        Year INT,
        Month INT,
        EmployeeCode NVARCHAR(50),
		PT_Monthly_Amount DECIMAL(18,2),
		TOTALESI DECIMAL(18,2),
		TotalPFContribution DECIMAL(18,2),
        TotalDeductionAmount DECIMAL(18, 2)
    );

    -- Insert data from CalculateTotalDeductions into the temporary table
    INSERT INTO #TotalDeductions
    EXEC dbo.CalculateTotalDeductions;

    -- Final result with Attendance Bonus, Overtime Pay, and Total Deductions
    SELECT 
        gs.pn_CompanyID,
        gs.pn_BranchID,
        gs.Employee_Full_Name,
        gs.EmployeeCode,
        gs.pn_EmployeeID,
        gs.Year,
        gs.Month,
        gs.Gross_Salary,
        ab.Attendance_Bonus_Value,
        otp.TotalOverTimePay,
        td.TotalDeductionAmount,
        (gs.Gross_Salary + ISNULL(ab.Attendance_Bonus_Value, 0) + ISNULL(otp.TotalOverTimePay, 0) - ISNULL(td.TotalDeductionAmount, 0)) AS Net_Salary
    FROM 
        #GrossSalaryData gs
    LEFT JOIN 
        #AttendanceBonus ab
    ON 
        gs.pn_CompanyID = ab.pn_CompanyID
        AND gs.pn_BranchID = ab.pn_BranchID
        AND gs.EmployeeCode = ab.EmployeeCode
        AND gs.Year = ab.Year
        AND gs.Month = ab.Month
    LEFT JOIN 
        #OvertimePay otp
    ON 
        gs.pn_CompanyID = otp.CompanyID
        AND gs.pn_BranchID = otp.BranchID
        AND gs.EmployeeCode = otp.EmployeeCode
        AND gs.Year = otp.Year
        AND gs.Month = otp.Month
    LEFT JOIN 
        #TotalDeductions td
    ON 
        gs.pn_CompanyID = td.pn_CompanyID
        AND gs.pn_BranchID = td.pn_BranchID
        AND gs.EmployeeCode = td.EmployeeCode
        AND gs.Year = td.Year
        AND gs.Month = td.Month
    ORDER BY 
        gs.Year, gs.Month, gs.pn_EmployeeID;

    -- Drop the temporary tables
    DROP TABLE #AttendanceBonus;
    DROP TABLE #EmployeeAllowances;
    DROP TABLE #AttendanceData;
    DROP TABLE #GrossSalaryData;
    DROP TABLE #OvertimePayTemp; -- Drop the temporary table for OvertimePay
    DROP TABLE #OvertimePay; -- Drop the final OvertimePay table
    DROP TABLE #TotalDeductions; -- Drop the Total Deductions table
END;
GO
/****** Object:  StoredProcedure [dbo].[sp_GetAllowanceValues]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[sp_GetAllowanceValues]
    @pn_companyid INT = NULL,
    @pn_branchid INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        av.pn_companyid,
        av.pn_branchid,
        e.Employee_Full_Name,
        e.EmployeeCode,
        av.Grade_Name,
        av.Level_Name,
        av.v_EarningsName,
        CASE 
            WHEN av.Allowancetype = 'Fixed' THEN av.value
            WHEN av.Cal_Based_on = 'CTC' THEN (e.CTC * av.value / 100)
            WHEN av.Cal_Based_on = 'BasicPay' THEN (e.Basic_Salary * av.value / 100)
            ELSE 0
        END AS Amount,
        av.d_order
    FROM 
        [dbo].[AllowanceValues] av
    JOIN 
        [dbo].[paym_Employee] e
        ON av.Grade_Name = e.Grade
        OR av.Level_Name = e.Grade
    WHERE 
        (@pn_companyid IS NULL OR av.pn_companyid = @pn_companyid) -- Filter by company ID if provided
        AND (@pn_branchid IS NULL OR av.pn_branchid = @pn_branchid) -- Filter by branch ID if provided
        AND av.pn_branchid = e.pn_BranchID -- Ensure they belong to the same branch
        AND av.Allowancetype IN ('Fixed', 'Percentage') -- Check allowance type
        AND NOT (av.c_Regular = 'N' AND av.payslip = 'N') -- Exclude rows where both c_Regular and payslip are 'N'
    ORDER BY 
        av.d_order;
END;

GO
/****** Object:  StoredProcedure [dbo].[UpdatedTimecard]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[UpdatedTimecard]
AS
BEGIN
    SELECT 
        e.pn_companyid,
        e.pn_branchid,
        e.employeecode,
        e.employee_full_name,
        s.shift_code,
        GETDATE() AS currentDate, -- Changed alias to avoid reserved word conflict
        FORMAT(GETDATE(), 'dddd') AS currentDay, -- Changed alias to avoid reserved word conflict
        s.start_time,
        s.end_time
    FROM 
        paym_Employee e 
    JOIN 
        shift_details s ON e.pn_branchid = s.pn_branchid
    WHERE 
        s.shift_code = (
            SELECT 
                shift_code 
            FROM 
                shift_month 
            WHERE 
                pn_Employeecode = e.EmployeeCode 
                AND monthyear = FORMAT(GETDATE(), 'MM-yyyy')
        );
END;

GO
/****** Object:  StoredProcedure [dbo].[UpdateESIContributionsInPaybill]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[UpdateESIContributionsInPaybill]
AS
BEGIN
    -- Temporary table to hold the results from the ESI calculation
    DECLARE @ESIResults TABLE (
        pn_companyid INT,
        pn_branchid INT,
        Year INT,
        Month INT,
        Employee_Full_Name NVARCHAR(255),
        EmployeeCode NVARCHAR(50),
        Earned_Basic_Salary FLOAT,
        Total_Allowance_Amt FLOAT,
        Gross_Salary FLOAT,
        Total_Days INT,
        Paid_Days INT,
        Employee_Contribution FLOAT,
        Employer_Contribution FLOAT,
        Employee_ESI_Contribution FLOAT,
        Employer_ESI_Contribution FLOAT,
        Total_ESI_Contribution FLOAT,
        ESI_D_Order INT,
        Type NVARCHAR(50)
    );

    -- Insert the results from the ESI calculation into the temporary table
    INSERT INTO @ESIResults (
        pn_companyid, pn_branchid, Year, Month, Employee_Full_Name, EmployeeCode,
        Earned_Basic_Salary, Total_Allowance_Amt, Gross_Salary, Total_Days, Paid_Days,
        Employee_Contribution, Employer_Contribution, Employee_ESI_Contribution,
        Employer_ESI_Contribution, Total_ESI_Contribution, ESI_D_Order, Type
    )
    EXEC CalculateGrossSalaryAndESIwithprorata;

    -- Update the paym_paybill table with the ESI contributions
    UPDATE pb
    SET 
        pb.Deduction1 = CASE WHEN e.ESI_D_Order = 1 THEN e.Type ELSE NULL END,
        pb.valueA1 = CASE WHEN e.ESI_D_Order = 1 THEN e.Total_ESI_Contribution ELSE 0 END,
        pb.Deduction2 = CASE WHEN e.ESI_D_Order = 2 THEN e.Type ELSE NULL END,
        pb.valueA2 = CASE WHEN e.ESI_D_Order = 2 THEN e.Total_ESI_Contribution ELSE 0 END,
        pb.Deduction3 = CASE WHEN e.ESI_D_Order = 3 THEN e.Type ELSE NULL END,
        pb.valueA3 = CASE WHEN e.ESI_D_Order = 3 THEN e.Total_ESI_Contribution ELSE 0 END,
        pb.Deduction4 = CASE WHEN e.ESI_D_Order = 4 THEN e.Type ELSE NULL END,
        pb.valueA4 = CASE WHEN e.ESI_D_Order = 4 THEN e.Total_ESI_Contribution ELSE 0 END,
        pb.Deduction5 = CASE WHEN e.ESI_D_Order = 5 THEN e.Type ELSE NULL END,
        pb.valueA5 = CASE WHEN e.ESI_D_Order = 5 THEN e.Total_ESI_Contribution ELSE 0 END,
        pb.Deduction6 = CASE WHEN e.ESI_D_Order = 6 THEN e.Type ELSE NULL END,
        pb.valueA6 = CASE WHEN e.ESI_D_Order = 6 THEN e.Total_ESI_Contribution ELSE 0 END,
        pb.Deduction7 = CASE WHEN e.ESI_D_Order = 7 THEN e.Type ELSE NULL END,
        pb.valueA7 = CASE WHEN e.ESI_D_Order = 7 THEN e.Total_ESI_Contribution ELSE 0 END,
        pb.Deduction8 = CASE WHEN e.ESI_D_Order = 8 THEN e.Type ELSE NULL END,
        pb.valueA8 = CASE WHEN e.ESI_D_Order = 8 THEN e.Total_ESI_Contribution ELSE 0 END,
        pb.Deduction9 = CASE WHEN e.ESI_D_Order = 9 THEN e.Type ELSE NULL END,
        pb.valueA9 = CASE WHEN e.ESI_D_Order = 9 THEN e.Total_ESI_Contribution ELSE 0 END,
        pb.Deduction10 = CASE WHEN e.ESI_D_Order = 10 THEN e.Type ELSE NULL END,
        pb.valueA10 = CASE WHEN e.ESI_D_Order = 10 THEN e.Total_ESI_Contribution ELSE 0 END
    FROM paym_paybill pb
    JOIN @ESIResults e 
        ON pb.EmployeeCode = e.EmployeeCode
       AND pb.pn_CompanyID = e.pn_companyid
       AND pb.pn_BranchID = e.pn_branchid
       AND YEAR(pb.d_date) = e.Year
       AND MONTH(pb.d_date) = e.Month
    WHERE pb.Flag = 'M';  -- Only update rows where Flag is 'M'

    -- No need to drop the table variable, SQL Server will clean it up automatically
END;
GO
/****** Object:  StoredProcedure [dbo].[UpdatePTinpaybill]    Script Date: 09-12-2025 3.00.59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[UpdatePTinpaybill]
AS
BEGIN
    -- Step 1: Create a temporary table to hold the results from CheckCTCLimits
    CREATE TABLE #CTCLimits (
        pn_CompanyID INT,
        pn_BranchID INT,
        EmployeeCode NVARCHAR(50),
        Employee_Full_Name NVARCHAR(100),
        State NVARCHAR(50),
        Lower_limit FLOAT,
        Upper_limit NVARCHAR(10),
        CTC FLOAT,
        Annual_basis FLOAT,
        Half_yearly FLOAT,
        Monthly_Amount FLOAT,
        d_order INT,
        Type NVARCHAR(50)
    );

    -- Step 2: Insert the results from CheckCTCLimits into the temporary table
    INSERT INTO #CTCLimits
    EXEC CheckCTCLimits;

    -- Step 3: Update the paym_paybill table based on the temporary table
    UPDATE p
    SET 
        Deduction1 = CASE WHEN c.d_order = 1 THEN c.Type ELSE Deduction1 END,
        valueA1 = CASE WHEN c.d_order = 1 THEN c.Monthly_Amount ELSE valueA1 END,
        Deduction2 = CASE WHEN c.d_order = 2 THEN c.Type ELSE Deduction2 END,
        valueA2 = CASE WHEN c.d_order = 2 THEN c.Monthly_Amount ELSE valueA2 END,
        Deduction3 = CASE WHEN c.d_order = 3 THEN c.Type ELSE Deduction3 END,
        valueA3 = CASE WHEN c.d_order = 3 THEN c.Monthly_Amount ELSE valueA3 END,
        Deduction4 = CASE WHEN c.d_order = 4 THEN c.Type ELSE Deduction4 END,
        valueA4 = CASE WHEN c.d_order = 4 THEN c.Monthly_Amount ELSE valueA4 END,
        Deduction5 = CASE WHEN c.d_order = 5 THEN c.Type ELSE Deduction5 END,
        valueA5 = CASE WHEN c.d_order = 5 THEN c.Monthly_Amount ELSE valueA5 END,
        Deduction6 = CASE WHEN c.d_order = 6 THEN c.Type ELSE Deduction6 END,
        valueA6 = CASE WHEN c.d_order = 6 THEN c.Monthly_Amount ELSE valueA6 END,
        Deduction7 = CASE WHEN c.d_order = 7 THEN c.Type ELSE Deduction7 END,
        valueA7 = CASE WHEN c.d_order = 7 THEN c.Monthly_Amount ELSE valueA7 END,
        Deduction8 = CASE WHEN c.d_order = 8 THEN c.Type ELSE Deduction8 END,
        valueA8 = CASE WHEN c.d_order = 8 THEN c.Monthly_Amount ELSE valueA8 END,
        Deduction9 = CASE WHEN c.d_order = 9 THEN c.Type ELSE Deduction9 END,
        valueA9 = CASE WHEN c.d_order = 9 THEN c.Monthly_Amount ELSE valueA9 END,
        Deduction10 = CASE WHEN c.d_order = 10 THEN c.Type ELSE Deduction10 END,
        valueA10 = CASE WHEN c.d_order = 10 THEN c.Monthly_Amount ELSE valueA10 END
    FROM paym_paybill p
    INNER JOIN #CTCLimits c 
        ON p.pn_CompanyID = c.pn_CompanyID
        AND p.pn_BranchID = c.pn_BranchID
        AND p.EmployeeCode = c.EmployeeCode
    WHERE p.Flag = 'M';  -- Only update rows where Flag is 'M'

    -- Step 4: Drop the temporary table
    DROP TABLE #CTCLimits;
END;

