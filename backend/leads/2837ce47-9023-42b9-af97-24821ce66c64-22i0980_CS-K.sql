CREATE PROCEDURE FindDepartmentWithMinAvgSalary()
BEGIN
    SELECT department_name
    FROM (
        SELECT department_name, AVG(salary) AS avg_salary
        FROM employees
        GROUP BY department_name
        ORDER BY avg_salary
        LIMIT 1
    ) AS min_avg_salary;
END;


CREATE PROCEDURE FindEmployeesBySalaryAndDept(IN salary_limit INT, IN dept_name VARCHAR(255))
BEGIN
    SELECT *
    FROM employees
    WHERE department_name = dept_name AND salary < salary_limit;
END;


CREATE TRIGGER TableCreatedTrigger
AFTER CREATE
ON DATABASE
BEGIN
    DECLARE table_name VARCHAR(255);
    SELECT EVENT_OBJECT_TABLE INTO table_name;
    SELECT CONCAT('Table ', table_name, ' has been created successfully.') AS Message;
END;


CREATE TABLE log_table (
    activity VARCHAR(40),
    date DATETIME
);

CREATE TRIGGER InsertLogTrigger
AFTER INSERT
ON employees
FOR EACH ROW
BEGIN
    INSERT INTO log_table (activity, date)
    VALUES ('Inserted new employee', NOW());
END;


CREATE FUNCTION SumSalariesInDepartment(dept_name VARCHAR(255))
RETURNS INT
BEGIN
    DECLARE total_salary INT;
    SELECT SUM(salary) INTO total_salary
    FROM employees
    WHERE department_name = dept_name;
    RETURN total_salary;
END;
