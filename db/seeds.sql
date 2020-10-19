USE employeeTracker_db

INSERT INTO department
    (d_name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Sales Lead', 140000, 1),
    ('Salesperson', 110000, 1),
    ('Lead Engineer', 180000, 2),
    ('Software Engineer', 150000, 2),
    ('Account Manager', 190000, 3),
    ('Accountant', 150000, 3),
    ('Legal Team Lead', 280000, 4),
    ('Lawyer', 200000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Ric', 'Ocasek', 1, NULL),
    ('Janis', 'Joplin', 2, 1),
    ('Stevie', 'Nicks', 3, NULL),
    ('Ray', 'Manzarek', 4, 3),
    ('Ray', 'Charles', 5, NULL),
    ('Ann', 'Wilson', 6, 5),
    ('Robert', 'Plant', 7, NULL),
    ('Roger', 'Waters', 8, 7);
