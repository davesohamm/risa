from faker import Faker
from pg_client import pg_client
from random import random

# Initialize Faker generator
fake = Faker()

fake.random
# Create a cursor object
cursor = pg_client.cursor()

# SQL to create tables
create_tables_sql = """
CREATE TABLE IF NOT EXISTS Employees (
    EmployeeID SERIAL PRIMARY KEY,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    DepartmentID INT,
    Salary DECIMAL(10,2)
);
CREATE TABLE IF NOT EXISTS Departments (
    DepartmentID SERIAL PRIMARY KEY,
    DepartmentName VARCHAR(50)
);
"""

# Execute the SQL commands
cursor.execute(create_tables_sql)
pg_client.commit()

# Function to insert fake department data
def insert_departments(n):
    insert_sql = "INSERT INTO Departments (DepartmentName) VALUES (%s);"
    for _ in range(n):
        cursor.execute(insert_sql, (fake.word(),))

# Function to insert fake employee data
def insert_employees(n):
    insert_sql = """
    INSERT INTO Employees (FirstName, LastName, DepartmentID, Salary) VALUES (%s, %s, %s, %s);
    """
    # Get existing department IDs
    cursor.execute("SELECT DepartmentID FROM Departments;")
    department_ids = [row[0] for row in cursor.fetchall()]

    for _ in range(n):
        first_name = fake.first_name()
        last_name = fake.last_name()
        # choose one id from the department_ids list
        department_id = fake.random_element(department_ids)
        salary = round(fake.random_number(digits=5), 2)
        cursor.execute(insert_sql, (first_name, last_name, department_id, salary))


insert_departments(10)  
insert_employees(1000)  


pg_client.commit()
cursor.close()
pg_client.close()
print("seeding done!")