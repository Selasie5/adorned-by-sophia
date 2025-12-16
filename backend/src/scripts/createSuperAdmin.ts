import { Admin, AdminRole } from '../models/Admin.js';
import { connectDB } from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

export const createSuperAdmin = async () => {
  await connectDB();

  const exists = await Admin.findOne({ role: AdminRole.SUPER_ADMIN });
  if (exists) {
    console.log('Super admin already exists');
    process.exit(0);
  }

  await Admin.create({
    email: 'engineering@forgestudios.tech',
    password: 'ChangeMeNow123!',
    firstName: 'Super',
    lastName: 'Admin',
    role: AdminRole.SUPER_ADMIN,
    isActive: true
  });

  console.log(' Super admin created');
  console.log('Email: engineering@forgestudios.tech');
  console.log('Password: ChangeMeNow123!');
  console.log(' Change password immediately!');
  
  process.exit(0);
};

// createSuperAdmin();
