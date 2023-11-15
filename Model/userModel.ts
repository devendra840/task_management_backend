export const createTableQuery = `
CREATE TABLE IF NOT EXISTS users (
    UserId SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS projects (
    ProjectId SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    users JSON 
);

CREATE TABLE IF NOT EXISTS assignments (
    assignmentId SERIAL PRIMARY KEY,
    UserId INT,
    ProjectId INT,
    IsActive BOOLEAN,
    FOREIGN KEY (UserId) REFERENCES users(UserId),
    FOREIGN KEY (ProjectId) REFERENCES projects(ProjectId)
);

CREATE TABLE IF NOT EXISTS tasks (
    taskId SERIAL PRIMARY KEY,
    ProjectId INT,
    StartTime TIMESTAMP,
    EndTime TIMESTAMP,
    description VARCHAR(255),
    FOREIGN KEY (ProjectId) REFERENCES projects(ProjectId)
);


`;