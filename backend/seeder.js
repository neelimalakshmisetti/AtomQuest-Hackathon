const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Goal = require('./models/Goal');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Goal.deleteMany();

    // Create Admin
    const adminUser = await User.create({
      name: 'Admin HR',
      email: 'admin@company.com',
      password: 'password123',
      role: 'Admin',
      department: 'HR'
    });

    // Create Manager
    const managerUser = await User.create({
      name: 'Manager Bob',
      email: 'manager@company.com',
      password: 'password123',
      role: 'Manager',
      department: 'Engineering'
    });

    // Create Employees
    const employee1 = await User.create({
      name: 'Employee Alice',
      email: 'alice@company.com',
      password: 'password123',
      role: 'Employee',
      department: 'Engineering',
      managerId: managerUser._id
    });

    const employee2 = await User.create({
      name: 'Employee Charlie',
      email: 'charlie@company.com',
      password: 'password123',
      role: 'Employee',
      department: 'Engineering',
      managerId: managerUser._id
    });

    // Create Goals
    await Goal.create({
      employeeId: employee1._id,
      title: 'Increase Code Coverage',
      description: 'Write unit tests to increase coverage to 80%',
      thrustArea: 'Internal Process',
      uomType: 'Percentage',
      target: 80,
      weightage: 50,
      status: 'Pending Approval'
    });

    await Goal.create({
      employeeId: employee1._id,
      title: 'Complete 3 Certifications',
      description: 'AWS, Azure, and GCP certifications',
      thrustArea: 'Learning & Growth',
      uomType: 'Numeric',
      target: 3,
      weightage: 50,
      status: 'Draft'
    });

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
