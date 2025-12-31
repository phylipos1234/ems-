import User from "../models/User.js";
import Employee from "../models/Employee.js";
import Department from "../models/Department.js";
import bcrypt from "bcryptjs";

// Add Employee
export const addEmployee = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      employeeId,
      dateOfBirth,
      gender,
      maritalStatus,
      designation,
      phone, 
      address, 
      position, 
      department, 
      salary, 
      role,
      hireDate, 
      status 
    } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Name, email, and password are required" 
      });
    }

    // Check if user already exists by email
    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
    
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: "User with this email already exists" 
      });
    }

    // Check if employeeId already exists (if provided)
    if (employeeId) {
      const existingEmployeeId = await Employee.findOne({ employeeId: employeeId.trim() });
      if (existingEmployeeId) {
        return res.status(400).json({ 
          success: false, 
          message: "Employee ID already exists" 
        });
      }
    }

    // Validate department if provided
    if (department) {
      const deptExists = await Department.findById(department);
      if (!deptExists) {
        return res.status(400).json({ 
          success: false, 
          message: "Department not found" 
        });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Handle profile image upload
    let profileImagePath = null;
    if (req.file) {
      profileImagePath = `/uploads/profileImages/${req.file.filename}`;
    }

    // Create User first
    const newUser = new User({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: role || 'employee',
      employeeId: employeeId?.trim() || null,
      dateOfBirth: dateOfBirth || null,
      gender: gender || null,
      maritalStatus: maritalStatus || null,
      designation: designation?.trim() || position?.trim() || null,
      phone: phone?.trim() || null,
      address: address?.trim() || null,
      position: position?.trim() || designation?.trim() || null,
      profileImage: profileImagePath
    });

    await newUser.save();

    // Create Employee with reference to User
    const newEmployee = new Employee({
      employeeId: employeeId?.trim() || null,
      user: newUser._id,
      department: department || null,
      salary: salary ? parseFloat(salary) : 0,
      hireDate: hireDate || new Date(),
      status: status || 'active'
    });

    await newEmployee.save();

    // Populate user and department for response
    await newEmployee.populate([
      { path: 'user', select: '-password' },
      { path: 'department', select: 'departmentName description' }
    ]);

    // Format response to include user data
    const employeeResponse = {
      ...newEmployee.toObject(),
      ...newEmployee.user.toObject(),
      employeeId: newEmployee.employeeId || newEmployee.user.employeeId
    };

    res.status(201).json({
      success: true,
      message: "Employee added successfully",
      employee: employeeResponse
    });
  } catch (error) {
    console.error("ADD EMPLOYEE ERROR:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Get All Employees
export const getEmployees = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    
    const skip = (page - 1) * limit;
    
    // Build search query for Employee
    let searchQuery = {};
    
    if (search) {
      // Search in populated user fields
      const users = await User.find({
        role: 'employee',
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { position: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');
      
      const userIds = users.map(u => u._id);
      searchQuery = { user: { $in: userIds } };
    }
    
    // Get total count
    const totalCount = await Employee.countDocuments(searchQuery);
    
    // Get employees with pagination and populate user and department
    const employees = await Employee.find(searchQuery)
      .populate('user', '-password')
      .populate('department', 'departmentName description')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Format response to merge employee and user data
    const formattedEmployees = employees.map(emp => {
      const empObj = emp.toObject();
      const userObj = emp.user ? emp.user.toObject() : {};
      return {
        ...empObj,
        ...userObj,
        employeeId: empObj.employeeId || userObj.employeeId,
        _id: empObj._id
      };
    });
    
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
      count: formattedEmployees.length,
      employees: formattedEmployees
    });
  } catch (error) {
    console.error("GET EMPLOYEES ERROR:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Get Single Employee
export const getEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id)
      .populate('user', '-password')
      .populate('department', 'departmentName description');
    
    if (!employee) {
      return res.status(404).json({ 
        success: false, 
        message: "Employee not found" 
      });
    }

    // Format response to merge employee and user data
    const empObj = employee.toObject();
    const userObj = employee.user ? employee.user.toObject() : {};
    const employeeResponse = {
      ...empObj,
      ...userObj,
      employeeId: empObj.employeeId || userObj.employeeId,
      _id: empObj._id
    };

    res.json({
      success: true,
      employee: employeeResponse
    });
  } catch (error) {
    console.error("GET EMPLOYEE ERROR:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Update Employee
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      email, 
      phone, 
      address, 
      position, 
      designation,
      dateOfBirth,
      gender,
      maritalStatus,
      department, 
      salary, 
      hireDate, 
      status,
      employeeId 
    } = req.body;

    // Check if employee exists
    const employee = await Employee.findById(id).populate('user');
    if (!employee) {
      return res.status(404).json({ 
        success: false, 
        message: "Employee not found" 
      });
    }

    const user = await User.findById(employee.user._id);
    if (!user || user.role !== 'employee') {
      return res.status(404).json({ 
        success: false, 
        message: "User not found or not an employee" 
      });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ 
        email: email.trim().toLowerCase(),
        _id: { $ne: user._id }
      });
      
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: "Email already exists" 
        });
      }
    }

    // Check if employeeId is being changed and if it already exists
    if (employeeId && employeeId !== employee.employeeId) {
      const existingEmployeeId = await Employee.findOne({ 
        employeeId: employeeId.trim(),
        _id: { $ne: id }
      });
      
      if (existingEmployeeId) {
        return res.status(400).json({ 
          success: false, 
          message: "Employee ID already exists" 
        });
      }
    }

    // Validate department if provided
    if (department) {
      const deptExists = await Department.findById(department);
      if (!deptExists) {
        return res.status(400).json({ 
          success: false, 
          message: "Department not found" 
        });
      }
    }

    // Handle profile image upload
    if (req.file) {
      const profileImagePath = `/uploads/profileImages/${req.file.filename}`;
      user.profileImage = profileImagePath;
    }

    // Update user fields
    if (name) user.name = name.trim();
    if (email) user.email = email.trim().toLowerCase();
    if (phone !== undefined) user.phone = phone?.trim();
    if (address !== undefined) user.address = address?.trim();
    if (position !== undefined) user.position = position?.trim();
    if (designation !== undefined) user.designation = designation?.trim();
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
    if (gender !== undefined) user.gender = gender;
    if (maritalStatus !== undefined) user.maritalStatus = maritalStatus;
    
    await user.save();

    // Update employee fields
    if (employeeId !== undefined) employee.employeeId = employeeId?.trim() || null;
    if (department !== undefined) employee.department = department || null;
    if (salary !== undefined) employee.salary = salary || 0;
    if (hireDate) employee.hireDate = hireDate;
    if (status) employee.status = status;
    
    await employee.save();

    // Populate for response
    await employee.populate([
      { path: 'user', select: '-password' },
      { path: 'department', select: 'departmentName description' }
    ]);

    // Format response to merge employee and user data
    const empObj = employee.toObject();
    const userObj = employee.user ? employee.user.toObject() : {};
    const employeeResponse = {
      ...empObj,
      ...userObj,
      employeeId: empObj.employeeId || userObj.employeeId,
      _id: empObj._id
    };

    res.json({
      success: true,
      message: "Employee updated successfully",
      employee: employeeResponse
    });
  } catch (error) {
    console.error("UPDATE EMPLOYEE ERROR:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Delete Employee
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id).populate('user');
    
    if (!employee) {
      return res.status(404).json({ 
        success: false, 
        message: "Employee not found" 
      });
    }

    // Get user before deletion for response
    const user = employee.user;
    
    // Delete employee record
    await Employee.findByIdAndDelete(id);
    
    // Delete associated user record
    if (user) {
      await User.findByIdAndDelete(user._id);
    }

    // Format response
    const empObj = employee.toObject();
    const userObj = user ? user.toObject() : {};
    const employeeResponse = {
      ...empObj,
      ...userObj,
      employeeId: empObj.employeeId || userObj.employeeId
    };
    
    delete employeeResponse.password;

    res.json({
      success: true,
      message: "Employee deleted successfully",
      employee: employeeResponse
    });
  } catch (error) {
    console.error("DELETE EMPLOYEE ERROR:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

