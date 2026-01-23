--1: Creacion Database
CREATE DATABASE "TeamTasksSample";

--2: Creacion Tablas solicitadas

--2.1:
CREATE TABLE Developers (
    DeveloperId SERIAL PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,
    CreatedAt TIMESTAMP NOT NULL DEFAULT NOW()
);

--2.2:
CREATE TABLE Projects (
    ProjectId SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    ClientName VARCHAR(100) NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE,
    Status VARCHAR(20) NOT NULL
        CHECK (Status IN ('Planned', 'InProgress', 'Completed'))
);

--2.3:
CREATE TABLE Tasks (
    TaskId SERIAL PRIMARY KEY,
    ProjectId INT NOT NULL REFERENCES Projects(ProjectId),
    Title VARCHAR(150) NOT NULL,
    Description TEXT,
    AssigneeId INT NOT NULL REFERENCES Developers(DeveloperId),
    Status VARCHAR(20) NOT NULL
        CHECK (Status IN ('ToDo', 'InProgress', 'Blocked', 'Completed')),
    Priority VARCHAR(20) NOT NULL
        CHECK (Priority IN ('Low', 'Medium', 'High')),
    EstimatedComplexity INT NOT NULL
        CHECK (EstimatedComplexity BETWEEN 1 AND 5),
    DueDate DATE NOT NULL,
    CompletionDate DATE,
    CreatedAt TIMESTAMP NOT NULL DEFAULT NOW()
);

--3: Inserción de datos

--3.1:
INSERT INTO Developers (FirstName, LastName, Email)
VALUES
('Claudia', 'Fayiber', 'claudia.fayiber@mail.com'),
('Luis', 'Martinez', 'luis.martinez@mail.com'),
('Cristian', 'Castro', 'cristian.castro@mail.com'),
('Estefania', 'Gamba', 'estefania.gamba@mail.com'),
('Sofia', 'Ramirez', 'sofia.ramirez@mail.com');

--3.2:
INSERT INTO Projects (Name, ClientName, StartDate, EndDate, Status)
VALUES
('Website Redesign', 'ACME Corp', '2025-01-01', '2025-03-31', 'InProgress'),
('Mobile App', 'TechSoft', '2025-02-01', '2025-05-30', 'Planned'),
('Internal Tool', 'InHouse', '2024-11-01', '2025-01-31', 'Completed');

--3.3:
INSERT INTO Tasks
(ProjectId, Title, Description, AssigneeId, Status, Priority, EstimatedComplexity, DueDate, CompletionDate)
VALUES
(1, 'Design landing page', 'UI design', 1, 'Completed', 'High', 4, '2025-01-20', '2025-01-22'),
(1, 'Implement homepage', 'Angular layout', 2, 'InProgress', 'High', 5, '2025-02-05', NULL),
(1, 'Fix CSS issues', 'Responsive fixes', 3, 'ToDo', 'Medium', 3, '2025-02-10', NULL),
(2, 'Create API endpoints', 'Backend work', 4, 'InProgress', 'High', 5, '2025-03-10', NULL),
(2, 'Auth module', 'JWT auth', 5, 'ToDo', 'High', 4, '2025-03-15', NULL),
(3, 'Database migration', 'Move old DB', 1, 'Completed', 'Medium', 3, '2024-12-10', '2024-12-09'),
(1, 'Optimize images', 'Improve load times', 4, 'Completed', 'Low', 2, '2025-01-25', '2025-01-24'),
(1, 'SEO improvements', 'Meta tags and structure', 5, 'Completed', 'Medium', 3, '2025-01-30', '2025-02-02'),
(1, 'Navbar refactor', 'Refactor navigation menu', 1, 'InProgress', 'Medium', 3, '2025-02-12', NULL),
(1, 'Footer redesign', 'Update footer layout', 2, 'ToDo', 'Low', 2, '2025-02-18', NULL),
(2, 'Setup project structure', 'Initial mobile setup', 3, 'Completed', 'High', 4, '2025-02-20', '2025-02-22'),
(2, 'Implement login screen', 'UI and validation', 4, 'InProgress', 'High', 5, '2025-03-05', NULL),
(2, 'Push notifications', 'Firebase integration', 5, 'Blocked', 'Medium', 4, '2025-03-12', NULL),
(2, 'Offline mode', 'Local storage support', 1, 'ToDo', 'Medium', 3, '2025-03-18', NULL),
(2, 'App store assets', 'Icons and screenshots', 2, 'Completed', 'Low', 2, '2025-02-28', '2025-02-27'),
(3, 'User management module', 'CRUD users', 3, 'Completed', 'High', 5, '2024-12-05', '2024-12-10'),
(3, 'Audit logs', 'Track system actions', 4, 'Completed', 'Medium', 3, '2024-12-15', '2024-12-14'),
(3, 'Performance tuning', 'Query optimization', 5, 'Completed', 'High', 4, '2025-01-10', '2025-01-15'),
(3, 'Export reports', 'CSV and PDF export', 1, 'Completed', 'Medium', 3, '2025-01-20', '2025-01-19'),
(3, 'Role-based access', 'Permissions system', 2, 'Completed', 'High', 5, '2025-01-25', '2025-01-29');

/*
4: Querys (DML)

4.1 Carga por developer:
SELECT 
    CONCAT(d.FirstName, ' ', d.LastName) AS DeveloperName,
    COUNT(t.TaskId) AS OpenTasksCount,
    COALESCE(AVG(t.EstimatedComplexity), 0) AS AverageEstimatedComplexity
FROM Developers d
LEFT JOIN Tasks t 
    ON t.AssigneeId = d.DeveloperId
    AND t.Status <> 'Completed'
WHERE d.IsActive = TRUE
GROUP BY d.DeveloperId, d.FirstName, d.LastName;


4.2 Estado por proyecto:
SELECT
    p.Name AS ProjectName,
    COUNT(t.TaskId) AS TotalTasks,
    SUM(CASE WHEN t.Status <> 'Completed' THEN 1 ELSE 0 END) AS OpenTasks,
    SUM(CASE WHEN t.Status = 'Completed' THEN 1 ELSE 0 END) AS CompletedTasks
FROM Projects p
LEFT JOIN Tasks t ON t.ProjectId = p.ProjectId
GROUP BY p.ProjectId;

4.3 Tasks proximas a vencerse segun (7) dias;
SELECT *
FROM Tasks
WHERE Status <> 'Completed'
AND DueDate BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days';

4.4 Query Insertar Nueva Task;

CREATE PROCEDURE sp_InsertarTarea
    @ProjectId INT,
    @Title NVARCHAR(150),
    @Description NVARCHAR(MAX),
    @AssigneeId INT,
    @Status NVARCHAR(50),
    @Priority NVARCHAR(50),
    @EstimatedComplexity INT,
    @DueDate DATE
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM Projects WHERE ProjectId = @ProjectId)
    BEGIN
        RAISERROR('Error: El ProjectId especificado no existe.', 16, 1);
        RETURN;
    END

    IF NOT EXISTS (SELECT 1 FROM Developers WHERE DeveloperId = @AssigneeId)
    BEGIN
        RAISERROR('Error: El AssigneeId (Desarrollador) especificado no existe.', 16, 1);
        RETURN;
    END

    BEGIN TRY
        INSERT INTO Tasks (
            ProjectId, Title, Description, AssigneeId, [Status], Priority, EstimatedComplexity, DueDate
        )
        VALUES (
            @ProjectId, @Title, @Description, @AssigneeId, @Status, @Priority, @EstimatedComplexity, @DueDate
        );
        
        PRINT 'Tarea insertada con éxito.';
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;

5  Developer Delay Risk Prediction:

SELECT
    d.FirstName || ' ' || d.LastName AS DeveloperName,
    COALESCE(open_tasks.OpenTasksCount, 0) AS OpenTasksCount,
    COALESCE(avg_delay.AvgDelayDays, 0)::INT AS AvgDelayDays,
    open_tasks.NearestDueDate,
    open_tasks.LatestDueDate,

    -- Predicted completion date
    CASE
        WHEN open_tasks.LatestDueDate IS NOT NULL
        THEN open_tasks.LatestDueDate + COALESCE(avg_delay.AvgDelayDays, 0)::INT ELSE NULL
    END AS PredictedCompletionDate,

    -- High risk flag
    CASE
        WHEN COALESCE(avg_delay.AvgDelayDays, 0) >= 3
          OR (
              open_tasks.LatestDueDate IS NOT NULL AND open_tasks.LatestDueDate + COALESCE(avg_delay.AvgDelayDays, 0)::INT > open_tasks.LatestDueDate
          )
        THEN 1
        ELSE 0
    END AS HighRiskFlag

FROM Developers d

LEFT JOIN (
    SELECT
        AssigneeId,
        COUNT(*) AS OpenTasksCount,
        MIN(DueDate) AS NearestDueDate,
        MAX(DueDate) AS LatestDueDate
    FROM Tasks
    WHERE Status <> 'Completed'
    GROUP BY AssigneeId
) open_tasks ON open_tasks.AssigneeId = d.DeveloperId

LEFT JOIN (
    SELECT
        AssigneeId,
        AVG(GREATEST((CompletionDate - DueDate), 0)) AS AvgDelayDays
    FROM Tasks
    WHERE Status = 'Completed'
      AND CompletionDate IS NOT NULL
    GROUP BY AssigneeId
) avg_delay ON avg_delay.AssigneeId = d.DeveloperId

WHERE d.IsActive = TRUE
ORDER BY HighRiskFlag DESC, AvgDelayDays DESC;*/