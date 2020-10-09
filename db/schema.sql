DROP DATABASE IF EXISTS employeeTracker_db;

CREATE DATABASE employeeTracker_db;

USE employeeTracker_db;

CREATE TABLE department (
   id INTEGER(20) AUTO_INCREMENT NOT NULL,
   name VARCHAR(30) NULL,
   PRIMARY KEY (id)
);

CREATE TABLE role (
   id INTEGER(20) AUTO_INCREMENT NOT NULL,
   title VARCHAR(30) NULL,
   salary DECIMAL(10,4) NULL,
   department_id INTEGER(20),
   PRIMARY KEY (id)
);

CREATE TABLE employee (
   id INTEGER(20) AUTO_INCREMENT NOT NULL,
   first_name VARCHAR(30) NULL,
   last_name VARCHAR(30) NULL,
   role_id INTEGER NULL,
   manager_id INTEGER NULL,
   PRIMARY KEY (id)
);