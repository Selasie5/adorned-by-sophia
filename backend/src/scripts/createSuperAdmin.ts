import { Admin, AdminRole } from '../models/Admin.js';
import { connectDB } from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const createSuperAdmin = async () => {
  await connectDB();

  const exists = await Admin.findOne({ role: AdminRole.SUPER_ADMIN });
  if (exists) {
    console.log('Super admin already exists');
    process.exit(0);
  }

  await Admin.create({
    email: 'support@adornedbysophia.com',
    password: 'ChangeMeNow123!',
    firstName: 'Super',
    lastName: 'Admin',
    role: AdminRole.SUPER_ADMIN,
    isActive: true
  });

  console.log(' Super admin created');
  console.log('Email: support@adornedbysophia.com');
  console.log('Password: ChangeMeNow123!');
  console.log(' Change password immediately!');
  
  process.exit(0);
};

createSuperAdmin();
