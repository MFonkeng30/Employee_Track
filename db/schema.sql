DROP DATABASE IF EXISTS employeeTracker_db;

CREATE DATABASE employeeTracker_db;

USE employeeTracker_db;

CREATE TABLE department (
   id INTEGER(20) AUTO_INCREMENT NOT NULL,
   name VARCHAR(30) NOT NULL,
   PRIMARY KEY (id)
);

CREATE TABLE role (
   id INTEGER(20) AUTO_INCREMENT NOT NULL,
   title VARCHAR(30) NOT NULL,
   salary DECIMAL(10,4) NOT NULL,
   department_id INTEGER(20) NOT NULL,
   PRIMARY KEY (id)
);

CREATE TABLE employee (
   id INTEGER(20) AUTO_INCREMENT NOT NULL,
   first_name VARCHAR(30) NOT NULL,
   last_name VARCHAR(30) NOT NULL,
   role_id INTEGER NOT NULL,
   manager_id INTEGER,
   PRIMARY KEY (id)
);