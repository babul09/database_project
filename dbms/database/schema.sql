-- Updated MySQL Schema for Employee Management System
-- Drop existing tables if they exist
DROP TABLE IF EXISTS TimeTracking;
DROP TABLE IF EXISTS Dependent;
DROP TABLE IF EXISTS Benefits;
DROP TABLE IF EXISTS LeaveRecords;
DROP TABLE IF EXISTS WorksOn;
DROP TABLE IF EXISTS Project;
DROP TABLE IF EXISTS Department;
DROP TABLE IF EXISTS Employee;

-- Create tables with updated schema
CREATE TABLE Employee (
    EmployeeID INT PRIMARY KEY,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    BirthDate DATE,
    Gender VARCHAR(10),
    HireDate DATE,
    Email VARCHAR(100),
    PhoneNo VARCHAR(15),
    DepartmentID INT,
    SupervisorID INT,
    Salary DECIMAL(15,2),
    Address VARCHAR(200),
    FOREIGN KEY (SupervisorID) REFERENCES Employee(EmployeeID)
);

CREATE TABLE Department (
    DepartmentID INT PRIMARY KEY,
    DepartmentName VARCHAR(100),
    Location VARCHAR(100),
    Budget DECIMAL(15,2)
);

-- Add foreign key after both tables exist
ALTER TABLE Employee
ADD CONSTRAINT FK_Employee_Department
FOREIGN KEY (DepartmentID) REFERENCES Department(DepartmentID);

CREATE TABLE Project (
    ProjectID INT PRIMARY KEY,
    ProjectName VARCHAR(100),
    StartDate DATE,
    EndDate DATE,
    Budget DECIMAL(15,2),
    Status VARCHAR(20)
);

CREATE TABLE WorksOn (
    EmployeeID INT,
    ProjectID INT,
    Role VARCHAR(50),
    HoursPerWeek DECIMAL(5,2),
    PRIMARY KEY (EmployeeID, ProjectID),
    FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID),
    FOREIGN KEY (ProjectID) REFERENCES Project(ProjectID)
);

CREATE TABLE LeaveRecords (
    ID INT PRIMARY KEY,
    EmployeeID INT,
    LeaveType VARCHAR(50),
    StartDate DATE,
    EndDate DATE,
    Status VARCHAR(20),
    FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID)
);

CREATE TABLE Benefits (
    BenefitID INT PRIMARY KEY,
    EmployeeID INT,
    BenefitType VARCHAR(50),
    StartDate DATE,
    Coverage VARCHAR(50),
    Premium DECIMAL(10,2),
    FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID)
);

CREATE TABLE Dependent (
    DependentID INT PRIMARY KEY,
    EmployeeID INT,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    Relationship VARCHAR(50),
    DateOfBirth DATE,
    FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID)
);

CREATE TABLE TimeTracking (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    EmployeeID INT,
    ProjectID INT,
    Date DATE,
    HoursWorked DECIMAL(5,2),
    FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID),
    FOREIGN KEY (ProjectID) REFERENCES Project(ProjectID)
);

-- Create views for common queries
CREATE OR REPLACE VIEW EmployeeProjectDetails AS
SELECT
    E.EmployeeID,
    E.FirstName AS EmployeeFirstName,
    E.LastName AS EmployeeLastName,
    D.DepartmentName,
    P.ProjectName,
    WO.Role,
    S.FirstName AS SupervisorFirstName,
    S.LastName AS SupervisorLastName
FROM
    Employee E
JOIN
    Department D ON E.DepartmentID = D.DepartmentID
LEFT JOIN
    WorksOn WO ON E.EmployeeID = WO.EmployeeID
LEFT JOIN
    Project P ON WO.ProjectID = P.ProjectID
LEFT JOIN
    Employee S ON E.SupervisorID = S.EmployeeID;

-- Sample Data for Employee Management System
-- This script will populate the database with sample data

-- Clear existing data
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE TimeTracking;
TRUNCATE TABLE Dependent;
TRUNCATE TABLE Benefits;
TRUNCATE TABLE LeaveRecords;
TRUNCATE TABLE WorksOn;
TRUNCATE TABLE Project;
TRUNCATE TABLE Employee;
TRUNCATE TABLE Department;
SET FOREIGN_KEY_CHECKS = 1;

-- Departments
INSERT INTO Department (DepartmentID, DepartmentName, Location, Budget) VALUES 
(1, 'Engineering', 'Building A, Floor 2', 5000000),
(2, 'Marketing', 'Building B, Floor 1', 2500000),
(3, 'Human Resources', 'Building A, Floor 1', 1000000),
(4, 'Finance', 'Building C, Floor 3', 3000000),
(5, 'Product Management', 'Building B, Floor 3', 2000000),
(6, 'Customer Support', 'Building D, Floor 1', 1500000),
(7, 'Research & Development', 'Building E, Floor 2', 4000000),
(8, 'Sales', 'Building B, Floor 2', 3500000);

-- Employees
INSERT INTO Employee (EmployeeID, FirstName, LastName, BirthDate, Gender, HireDate, Email, PhoneNo, DepartmentID, SupervisorID, Salary, Address) VALUES 
(1001, 'John', 'Doe', '1985-05-15', 'Male', '2023-01-01', 'john.doe@company.com', '555-123-4567', 1, NULL, 100000, '123 Main St'),
(1002, 'Jane', 'Smith', '1990-08-21', 'Female', '2023-02-01', 'jane.smith@company.com', '555-234-5678', 2, 1001, 90000, '456 Elm St'),
(1003, 'Michael', 'Johnson', '1988-04-12', 'Male', '2023-03-01', 'michael.johnson@company.com', '555-345-6789', 1, 1001, 100000, '789 Oak St'),
(1004, 'Emily', 'Williams', '1992-11-30', 'Female', '2023-04-01', 'emily.williams@company.com', '555-456-7890', 3, 1001, 95000, '101 Pine St'),
(1005, 'David', 'Brown', '1987-07-08', 'Male', '2023-05-01', 'david.brown@company.com', '555-567-8901', 4, 1001, 100000, '202 Maple St'),
(1006, 'Sarah', 'Miller', '1991-03-17', 'Female', '2023-06-01', 'sarah.miller@company.com', '555-678-9012', 1, 1003, 90000, '303 Birch St'),
(1007, 'Robert', 'Anderson', '1986-09-22', 'Male', '2023-07-01', 'robert.anderson@company.com', '555-789-0123', 5, 1001, 100000, '404 Cedar St'),
(1008, 'Jennifer', 'Thomas', '1993-01-05', 'Female', '2023-08-01', 'jennifer.thomas@company.com', '555-890-1234', 2, 1002, 95000, '505 Walnut St'),
(1009, 'William', 'Jackson', '1989-12-14', 'Male', '2023-09-01', 'william.jackson@company.com', '555-901-2345', 6, 1001, 100000, '606 Chestnut St'),
(1010, 'Elizabeth', 'White', '1990-06-25', 'Female', '2023-10-01', 'elizabeth.white@company.com', '555-012-3456', 7, 1001, 95000, '707 Hickory St'),
(1011, 'Christopher', 'Harris', '1988-02-28', 'Male', '2023-11-01', 'christopher.harris@company.com', '555-123-4567', 1, 1003, 100000, '808 Beech St'),
(1012, 'Amanda', 'Martin', '1991-10-11', 'Female', '2023-12-01', 'amanda.martin@company.com', '555-234-5678', 2, 1002, 90000, '909 Maple St'),
(1013, 'Daniel', 'Thompson', '1987-08-04', 'Male', '2023-01-01', 'daniel.thompson@company.com', '555-345-6789', 3, 1004, 100000, '1010 Oak St'),
(1014, 'Jessica', 'Garcia', '1992-05-19', 'Female', '2023-02-01', 'jessica.garcia@company.com', '555-456-7890', 4, 1005, 95000, '1111 Pine St'),
(1015, 'Matthew', 'Martinez', '1986-11-02', 'Male', '2023-03-01', 'matthew.martinez@company.com', '555-567-8901', 5, 1007, 100000, '1212 Elm St'),
(1016, 'Megan', 'Robinson', '1993-04-08', 'Female', '2023-04-01', 'megan.robinson@company.com', '555-678-9012', 6, 1009, 95000, '1313 Birch St'),
(1017, 'Andrew', 'Clark', '1989-07-16', 'Male', '2023-05-01', 'andrew.clark@company.com', '555-789-0123', 7, 1010, 100000, '1414 Cedar St'),
(1018, 'Lauren', 'Rodriguez', '1990-12-29', 'Female', '2023-06-01', 'lauren.rodriguez@company.com', '555-890-1234', 8, 1001, 95000, '1515 Walnut St'),
(1019, 'James', 'Lewis', '1988-06-07', 'Male', '2023-07-01', 'james.lewis@company.com', '555-901-2345', 8, 1018, 100000, '1616 Chestnut St'),
(1020, 'Ashley', 'Lee', '1991-01-23', 'Female', '2023-08-01', 'ashley.lee@company.com', '555-012-3456', 1, 1003, 95000, '1717 Hickory St'),
(1021, 'Babul', 'Rahman', '1989-03-15', 'Male', '2023-09-01', 'babul.rahman@company.com', '555-111-2222', 1, 1001, 100000, '1818 Beech St'),
(1022, 'Lora', 'Piterson', '1990-07-18', 'Female', '2023-10-01', 'lora.piterson@company.com', '555-111-3333', 2, 1002, 95000, '1919 Maple St'),
(1023, 'Nixtio', 'Admin', '1985-01-01', 'Male', '2023-11-01', 'admin@crextio.com', '555-000-0000', 3, NULL, 100000, '2020 Oak St');

-- Projects
INSERT INTO Project (ProjectID, ProjectName, StartDate, EndDate, Budget, Status) VALUES 
(1, 'Website Redesign', '2023-01-15', '2023-06-30', 150000, 'Completed'),
(2, 'Mobile App Development', '2023-03-01', '2023-09-30', 300000, 'In Progress'),
(3, 'Database Migration', '2023-02-10', '2023-05-31', 120000, 'Completed'),
(4, 'AI Implementation', '2023-04-15', '2023-12-15', 500000, 'In Progress'),
(5, 'Cloud Migration', '2023-05-01', '2023-11-30', 250000, 'In Progress'),
(6, 'Security Audit', '2023-06-01', '2023-07-31', 80000, 'In Progress'),
(7, 'Data Analytics Platform', '2023-07-01', '2024-01-31', 350000, 'Planning'),
(8, 'Employee Portal', '2023-06-15', '2023-12-31', 200000, 'In Progress'),
(9, 'CRM Integration', '2023-08-01', '2024-02-28', 180000, 'Planning'),
(10, 'Product Launch Campaign', '2023-09-01', '2023-12-15', 400000, 'Planning');

-- WorksOn (Employee assignments to projects)
INSERT INTO WorksOn (EmployeeID, ProjectID, Role, HoursPerWeek) VALUES 
(1001, 1, 'Project Manager', 10),
(1003, 1, 'Lead Developer', 20),
(1006, 1, 'Developer', 30),
(1011, 1, 'Developer', 30),
(1020, 1, 'QA Tester', 20),

(1001, 2, 'Project Manager', 10),
(1003, 2, 'Technical Advisor', 5),
(1006, 2, 'Lead Developer', 25),
(1011, 2, 'Developer', 30),
(1020, 2, 'Developer', 30),
(1021, 2, 'DevOps Engineer', 20),

(1001, 3, 'Project Manager', 5),
(1005, 3, 'Database Administrator', 25),
(1014, 3, 'Data Analyst', 30),

(1001, 4, 'Project Manager', 10),
(1003, 4, 'Lead Developer', 15),
(1010, 4, 'Research Scientist', 30),
(1017, 4, 'Data Scientist', 30),
(1021, 4, 'Machine Learning Engineer', 25),

(1001, 5, 'Project Manager', 10),
(1021, 5, 'Cloud Architect', 30),
(1006, 5, 'DevOps Engineer', 20),
(1011, 5, 'Developer', 15),

(1001, 6, 'Project Manager', 5),
(1009, 6, 'Security Specialist', 30),
(1021, 6, 'System Administrator', 15),

(1001, 8, 'Project Manager', 10),
(1003, 8, 'Lead Developer', 15),
(1006, 8, 'Frontend Developer', 25),
(1011, 8, 'Backend Developer', 25),
(1004, 8, 'UX Designer', 20),
(1021, 8, 'DevOps Engineer', 15);

-- LeaveRecords
INSERT INTO LeaveRecords (ID, EmployeeID, LeaveType, StartDate, EndDate, Status) VALUES 
(1, 1002, 'Vacation', '2023-07-10', '2023-07-14', 'Approved'),
(2, 1003, 'Sick Leave', '2023-06-22', '2023-06-23', 'Approved'),
(3, 1006, 'Vacation', '2023-08-01', '2023-08-12', 'Pending'),
(4, 1008, 'Personal Leave', '2023-07-05', '2023-07-07', 'Approved'),
(5, 1012, 'Vacation', '2023-09-15', '2023-09-30', 'Pending'),
(6, 1015, 'Sick Leave', '2023-06-19', '2023-06-20', 'Approved'),
(7, 1018, 'Maternity Leave', '2023-10-01', '2024-01-31', 'Approved'),
(8, 1021, 'Vacation', '2023-08-21', '2023-08-25', 'Pending');

-- Benefits
INSERT INTO Benefits (BenefitID, EmployeeID, BenefitType, StartDate, Coverage, Premium) VALUES 
(1, 1001, 'Health Insurance', '2020-01-01', 'Comprehensive', 350.00),
(2, 1001, 'Dental Insurance', '2020-01-01', 'Basic', 50.00),
(3, 1001, '401K', '2020-01-01', '5% match', 0.00),
(4, 1002, 'Health Insurance', '2020-09-01', 'Comprehensive', 350.00),
(5, 1002, 'Dental Insurance', '2020-09-01', 'Premium', 75.00),
(6, 1003, 'Health Insurance', '2020-04-15', 'Basic', 200.00),
(7, 1004, 'Health Insurance', '2020-12-01', 'Comprehensive', 350.00),
(8, 1005, 'Health Insurance', '2020-07-15', 'Basic', 200.00),
(9, 1021, 'Health Insurance', '2021-03-15', 'Comprehensive', 350.00),
(10, 1021, 'Dental Insurance', '2021-03-15', 'Premium', 75.00),
(11, 1021, 'Vision Insurance', '2021-03-15', 'Standard', 25.00),
(12, 1021, '401K', '2021-03-15', '5% match', 0.00);

-- Dependents
INSERT INTO Dependent (DependentID, EmployeeID, FirstName, LastName, Relationship, DateOfBirth) VALUES 
(1, 1001, 'Nancy', 'Doe', 'Spouse', '1986-08-12'),
(2, 1001, 'Tommy', 'Doe', 'Child', '2015-03-22'),
(3, 1002, 'Mark', 'Smith', 'Spouse', '1991-05-18'),
(4, 1004, 'John', 'Williams', 'Spouse', '1990-09-05'),
(5, 1004, 'Lucy', 'Williams', 'Child', '2018-11-15'),
(6, 1007, 'Lisa', 'Anderson', 'Spouse', '1988-07-30'),
(7, 1007, 'James', 'Anderson', 'Child', '2016-02-28'),
(8, 1007, 'Emma', 'Anderson', 'Child', '2019-12-10'),
(9, 1018, 'Michael', 'Rodriguez', 'Spouse', '1989-04-15'),
(10, 1021, 'Sophia', 'Rahman', 'Spouse', '1990-05-25'),
(11, 1021, 'Aiden', 'Rahman', 'Child', '2017-08-10');

-- Update the time tracking data for the week
INSERT INTO TimeTracking (ID, EmployeeID, ProjectID, Date, HoursWorked) VALUES
-- Babul's time entries (Employee 1021)
(1, 1021, 2, '2023-09-10', 1.5),  -- Sunday
(2, 1021, 5, '2023-09-11', 4.0),  -- Monday
(3, 1021, 4, '2023-09-11', 4.0),  -- Monday
(4, 1021, 2, '2023-09-12', 3.0),  -- Tuesday
(5, 1021, 8, '2023-09-12', 5.0),  -- Tuesday
(6, 1021, 4, '2023-09-13', 4.0),  -- Wednesday
(7, 1021, 5, '2023-09-13', 4.0),  -- Wednesday
(8, 1021, 2, '2023-09-14', 7.0),  -- Thursday (peak day - 7 hours)
(9, 1021, 6, '2023-09-15', 3.0),  -- Friday
(10, 1021, 8, '2023-09-15', 3.0), -- Friday
(11, 1021, 4, '2023-09-16', 2.0); -- Saturday


-- Create stored procedures
DELIMITER //

-- Procedure to approve leaves for employees working on multiple projects
CREATE PROCEDURE ApproveLeavesForMultiProjectEmployees()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE emp_id INT;
    DECLARE leave_id INT;

    DECLARE leave_cursor CURSOR FOR
    SELECT ID, EmployeeID
    FROM LeaveRecords
    WHERE Status = 'Pending';

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN leave_cursor;

    read_loop: LOOP
        FETCH leave_cursor INTO leave_id, emp_id;
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Check if employee works on more than one project
        IF (SELECT COUNT(DISTINCT ProjectID) FROM WorksOn WHERE EmployeeID = emp_id) > 1 THEN
            UPDATE LeaveRecords
            SET Status = 'Approved'
            WHERE ID = leave_id;
        END IF;

    END LOOP;

    CLOSE leave_cursor;
END //

-- Create trigger to check pending leaves
CREATE TRIGGER CheckPendingLeaves BEFORE INSERT ON LeaveRecords
FOR EACH ROW
BEGIN
    DECLARE pending_count INT;

    SELECT COUNT(*) INTO pending_count
    FROM LeaveRecords
    WHERE EmployeeID = NEW.EmployeeID AND Status = 'Pending';

    IF pending_count >= 3 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Employee has too many pending leave requests.';
 