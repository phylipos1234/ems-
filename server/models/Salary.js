import mongoose from 'mongoose';

const salarySchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  basicSalary: {
    type: Number,
    required: true,
    min: 0
  },
  allowance: {
    type: Number,
    default: 0,
    min: 0
  },
  deduction: {
    type: Number,
    default: 0,
    min: 0
  },
  payDate: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual field to calculate net salary
salarySchema.virtual('netSalary').get(function() {
  return this.basicSalary + this.allowance - this.deduction;
});

// Update the updatedAt field before saving
salarySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Ensure virtual fields are included in JSON output
salarySchema.set('toJSON', { virtuals: true });
salarySchema.set('toObject', { virtuals: true });

const Salary = mongoose.model('Salary', salarySchema);

export default Salary;

