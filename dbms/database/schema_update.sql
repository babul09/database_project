-- Schema update script for Employee Management System

-- Add HireDate column to Employee table
ALTER TABLE Employee
ADD COLUMN HireDate DATE AFTER Gender;

-- Rename DateOfBirth column to BirthDate for consistency with the application
ALTER TABLE Employee
CHANGE COLUMN DateOfBirth BirthDate DATE;

-- Update existing employee records with sample HireDate values
UPDATE Employee SET HireDate = '2020-01-15' WHERE EmployeeID = 1001;
UPDATE Employee SET HireDate = '2020-08-21' WHERE EmployeeID = 1002;
UPDATE Employee SET HireDate = '2020-04-12' WHERE EmployeeID = 1003;
UPDATE Employee SET HireDate = '2020-11-30' WHERE EmployeeID = 1004;
UPDATE Employee SET HireDate = '2020-07-08' WHERE EmployeeID = 1005;
UPDATE Employee SET HireDate = '2021-03-17' WHERE EmployeeID = 1006;
UPDATE Employee SET HireDate = '2020-09-22' WHERE EmployeeID = 1007;
UPDATE Employee SET HireDate = '2021-01-05' WHERE EmployeeID = 1008;
UPDATE Employee SET HireDate = '2020-12-14' WHERE EmployeeID = 1009;
UPDATE Employee SET HireDate = '2021-06-25' WHERE EmployeeID = 1010;
UPDATE Employee SET HireDate = '2020-02-28' WHERE EmployeeID = 1011;
UPDATE Employee SET HireDate = '2021-10-11' WHERE EmployeeID = 1012;
UPDATE Employee SET HireDate = '2020-08-04' WHERE EmployeeID = 1013;
UPDATE Employee SET HireDate = '2021-05-19' WHERE EmployeeID = 1014;
UPDATE Employee SET HireDate = '2020-11-02' WHERE EmployeeID = 1015;
UPDATE Employee SET HireDate = '2021-04-08' WHERE EmployeeID = 1016;
UPDATE Employee SET HireDate = '2020-07-16' WHERE EmployeeID = 1017;
UPDATE Employee SET HireDate = '2021-12-29' WHERE EmployeeID = 1018;
UPDATE Employee SET HireDate = '2020-06-07' WHERE EmployeeID = 1019;
UPDATE Employee SET HireDate = '2021-01-23' WHERE EmployeeID = 1020;
UPDATE Employee SET HireDate = '2021-03-15' WHERE EmployeeID = 1021;
UPDATE Employee SET HireDate = '2021-07-18' WHERE EmployeeID = 1022;
UPDATE Employee SET HireDate = '2020-01-01' WHERE EmployeeID = 1023;

-- Add column for Salary (also missing in the schema but used in the application)
ALTER TABLE Employee
ADD COLUMN Salary DECIMAL(15,2) AFTER SupervisorID;

-- Update with sample salary data
UPDATE Employee SET Salary = 120000 WHERE EmployeeID = 1001;
UPDATE Employee SET Salary = 95000 WHERE EmployeeID = 1002;
UPDATE Employee SET Salary = 110000 WHERE EmployeeID = 1003;
UPDATE Employee SET Salary = 90000 WHERE EmployeeID = 1004;
UPDATE Employee SET Salary = 105000 WHERE EmployeeID = 1005;
UPDATE Employee SET Salary = 98000 WHERE EmployeeID = 1006;
UPDATE Employee SET Salary = 115000 WHERE EmployeeID = 1007;
UPDATE Employee SET Salary = 85000 WHERE EmployeeID = 1008;
UPDATE Employee SET Salary = 92000 WHERE EmployeeID = 1009;
UPDATE Employee SET Salary = 118000 WHERE EmployeeID = 1010;
UPDATE Employee SET Salary = 97000 WHERE EmployeeID = 1011;
UPDATE Employee SET Salary = 88000 WHERE EmployeeID = 1012;
UPDATE Employee SET Salary = 86000 WHERE EmployeeID = 1013;
UPDATE Employee SET Salary = 89000 WHERE EmployeeID = 1014;
UPDATE Employee SET Salary = 108000 WHERE EmployeeID = 1015;
UPDATE Employee SET Salary = 81000 WHERE EmployeeID = 1016;
UPDATE Employee SET Salary = 112000 WHERE EmployeeID = 1017;
UPDATE Employee SET Salary = 105000 WHERE EmployeeID = 1018;
UPDATE Employee SET Salary = 96000 WHERE EmployeeID = 1019;
UPDATE Employee SET Salary = 93000 WHERE EmployeeID = 1020;
UPDATE Employee SET Salary = 125000 WHERE EmployeeID = 1021;
UPDATE Employee SET Salary = 90000 WHERE EmployeeID = 1022;
UPDATE Employee SET Salary = 150000 WHERE EmployeeID = 1023;

-- Add Address column
ALTER TABLE Employee
ADD COLUMN Address VARCHAR(200) AFTER Salary;

-- The application is now fully aligned with the database schema 