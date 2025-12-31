import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'employee'], required: true },
  profileImage: { type: String },
  
  // Employee-specific fields
  employeeId: { type: String, unique: true, sparse: true, trim: true },
  dateOfBirth: { type: Date },
  gender: { 
    type: String, 
    enum: ['male', 'female', 'other'],
    trim: true 
  },
  maritalStatus: { 
    type: String, 
    enum: ['single', 'married', 'divorced', 'widowed'],
    trim: true 
  },
  designation: { type: String, trim: true },
  phone: { type: String, trim: true },
  address: { type: String, trim: true },
  position: { type: String, trim: true }, // Keep for backward compatibility
  department: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Department' 
  },
  salary: { type: Number, min: 0 },
  hireDate: { type: Date },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'on-leave'], 
    default: 'active' 
  },
  
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

export default User;