import Salary from "../models/Salary.js";
import Employee from "../models/Employee.js";

// Add Salary
export const addSalary = async (req, res) => {
  try {
    const { employee, department, basicSalary, allowance, deduction, payDate } = req.body;

    // Validation
    if (!employee || !basicSalary || !payDate) {
      return res.status(400).json({ 
        success: false, 
        message: "Employee, basic salary, and pay date are required" 
      });
    }

    // Check if employee exists
    const employeeExists = await Employee.findById(employee);
    if (!employeeExists) {
      return res.status(404).json({ 
        success: false, 
        message: "Employee not found" 
      });
    }

    // Create new salary
    const newSalary = new Salary({
      employee,
      department: department || employeeExists.department,
      basicSalary: parseFloat(basicSalary) || 0,
      allowance: parseFloat(allowance) || 0,
      deduction: parseFloat(deduction) || 0,
      payDate: new Date(payDate)
    });

    await newSalary.save();

    // Populate employee and department references
    await newSalary.populate('employee', 'name email employeeId');
    await newSalary.populate('department', 'departmentName');

    res.status(201).json({
      success: true,
      message: "Salary added successfully",
      salary: newSalary
    });
  } catch (error) {
    console.error("ADD SALARY ERROR:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Get All Salaries with Pagination
export const getSalaries = async (req, res) => {
  try {
    // Get pagination parameters from query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const employeeId = req.query.employeeId;
    const departmentId = req.query.departmentId;
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    
    // Build search query
    const searchQuery = {};
    
    if (employeeId) {
      searchQuery.employee = employeeId;
    }
    
    if (departmentId) {
      searchQuery.department = departmentId;
    }
    
    // Get total count for pagination info
    const totalCount = await Salary.countDocuments(searchQuery);
    
    // Get salaries with pagination and search
    const salaries = await Salary.find(searchQuery)
      .populate('employee', 'name email employeeId')
      .populate('department', 'departmentName')
      .sort({ payDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    res.json({
      success: true,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage,
        hasPrevPage
      },
      count: salaries.length,
      salaries
    });
  } catch (error) {
    console.error("GET SALARIES ERROR:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Get Single Salary
export const getSalary = async (req, res) => {
  try {
    const { id } = req.params;

    const salary = await Salary.findById(id)
      .populate('employee', 'name email employeeId')
      .populate('department', 'departmentName');
    
    if (!salary) {
      return res.status(404).json({ 
        success: false, 
        message: "Salary not found" 
      });
    }

    res.json({
      success: true,
      salary
    });
  } catch (error) {
    console.error("GET SALARY ERROR:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Update Salary
export const updateSalary = async (req, res) => {
  try {
    const { id } = req.params;
    const { employee, department, basicSalary, allowance, deduction, payDate } = req.body;

    // Check if salary exists
    const salary = await Salary.findById(id);
    if (!salary) {
      return res.status(404).json({ 
        success: false, 
        message: "Salary not found" 
      });
    }

    // Update fields if provided
    if (employee) {
      const employeeExists = await Employee.findById(employee);
      if (!employeeExists) {
        return res.status(404).json({ 
          success: false, 
          message: "Employee not found" 
        });
      }
      salary.employee = employee;
      // Update department if not explicitly provided
      if (!department) {
        salary.department = employeeExists.department;
      }
    }

    if (department !== undefined) {
      salary.department = department;
    }

    if (basicSalary !== undefined) {
      salary.basicSalary = parseFloat(basicSalary) || 0;
    }

    if (allowance !== undefined) {
      salary.allowance = parseFloat(allowance) || 0;
    }

    if (deduction !== undefined) {
      salary.deduction = parseFloat(deduction) || 0;
    }

    if (payDate) {
      salary.payDate = new Date(payDate);
    }
    
    await salary.save();

    // Populate employee and department references
    await salary.populate('employee', 'name email employeeId');
    await salary.populate('department', 'departmentName');

    res.json({
      success: true,
      message: "Salary updated successfully",
      salary
    });
  } catch (error) {
    console.error("UPDATE SALARY ERROR:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Delete Salary
export const deleteSalary = async (req, res) => {
  try {
    const { id } = req.params;

    const salary = await Salary.findByIdAndDelete(id);
    
    if (!salary) {
      return res.status(404).json({ 
        success: false, 
        message: "Salary not found" 
      });
    }

    res.json({
      success: true,
      message: "Salary deleted successfully",
      salary
    });
  } catch (error) {
    console.error("DELETE SALARY ERROR:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};



