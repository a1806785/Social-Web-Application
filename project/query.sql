CREATE DATABASE social_media;

USE social_media;

CREATE TABLE Users (
    User_ID INT NOT NULL AUTO_INCREMENT,
    Username VARCHAR(40),
    Email VARCHAR(100),
    Password VARCHAR(256),
    Code VARCHAR(40),
    Type VARCHAR(10),
    PRIMARY KEY (User_ID)
);

CREATE TABLE Events (
    Event_ID INT NOT NULL AUTO_INCREMENT,
    User_ID INT,
    Event_name VARCHAR(200),
    Start_time VARCHAR(100),
    End_time VARCHAR(100),
    Detail TEXT,
    PRIMARY KEY (Event_ID),
    FOREIGN KEY (User_ID) REFERENCES Users(User_ID) ON DELETE SET NULL
);

INSERT INTO Users (Username, Email, Password)
VALUES (?, ?, ?);

DELETE FROM Users WHERE Username = ?;

SELECT Username FROM Users WHERE Username = ?;

SELECT Username, Email FROM Users;

DELETE FROM Users WHERE Username = ? AND Email = ?;

INSERT INTO Events (User_ID, Event_name, Start_time, End_time, Detail)
VALUES (?, ?, ?, ?, ?);

SELECT Event_name, Start_time, End_time, Detail FROM Events;

DELETE FROM Events WHERE Event_name = ? AND Start_time = ? AND End_time = ?;

DELETE FROM Admins WHERE Username = ?;

SELECT Admin_ID, Username, Email, Password FROM Admins WHERE Username = ?;