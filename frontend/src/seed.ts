import * as PrismaClient from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient.PrismaClient();

async function seedDepartments() {
  // Generate fake departments
  let departments:any = await prisma.department.createMany({
    data: [
      { name: 'Engineering' },
      { name: 'Marketing' },
      { name: 'Sales' },
      { name: 'Finance' },
      { name: 'HR' },
      { name: 'Legal' },
      { name: 'IT' },
      { name: 'Operations' },
      { name: 'Product' },
      { name: 'Sales' },
      { name: 'Support' },
      ]
  });
  departments = await prisma.department.findMany();
  return departments;
}

async function seedEmployees(numEntries: number, departments: any[]) {
  // Generate fake employees
  const employeesData = Array.from({ length: numEntries }, () => ({
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    departmentid: faker.helpers.arrayElement(departments).id,
    salary: faker.number.int({ min: 30000, max: 100000 }),
  }));

  const employees = await prisma.employee.createMany({
    data: employeesData,
  });

  return employees;
}

async function main() {
  try {
    const departments:any = await seedDepartments();
    const numEntries = 100; // Default number of entries
    console.log(departments)
    const employees = await seedEmployees(numEntries, departments);

    console.log(`Data seeded successfully with ${numEntries} entries:`, { departments, employees });
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
