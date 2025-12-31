import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  departmentName: {
    type: String,
    required: true,
    trim: true,
    minLength: 3
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minLength: 10
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Department = mongoose.model('Department', departmentSchema);

export default Department;

