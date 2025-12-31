import User from './models/User.js';
import bcrypt from 'bcrypt';
import connectDB from './db/db.js';

const run = async () => {
  await connectDB();

  try {
    const email = "no";

    const exists = await User.findOne({ email });
    if (exists) {
      console.log("⚠️ User already exists:", email);
      return process.exit();
    }

    const hashPassword = await bcrypt.hash("admin123", 10);

    const admin = new User({
      name: "superadmin",
      email,
      password: hashPassword,
      role: "admin",
    });

    await admin.save();
    console.log("✅ Admin user saved successfully");

    process.exit();
  } catch (error) {
    console.log("❌ Error:", error);
    process.exit(1);
  }
};

run();
