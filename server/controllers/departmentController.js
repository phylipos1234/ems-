import Department from "../models/Department.js";

// Add Department
export const addDepartment = async (req, res) => {
  try {
    const { departmentName, description } = req.body;

    // Validation
    if (!departmentName || !description) {
      return res.status(400).json({ 
        success: false, 
        message: "Department name and description are required" 
      });
    }

    // Check if department already exists
    const existingDepartment = await Department.findOne({ 
      departmentName: departmentName.trim() 
    });
    
    if (existingDepartment) {
      return res.status(400).json({ 
        success: false, 
        message: "Department already exists" 
      });
    }

    // Create new department
    const newDepartment = new Department({
      departmentName: departmentName.trim(),
      description: description.trim()
    });

    await newDepartment.save();

    res.status(201).json({
      success: true,
      message: "Department added successfully",
      department: newDepartment
    });
  } catch (error) {
    console.error("ADD DEPARTMENT ERROR:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Get All Departments with Pagination
export const getDepartments = async (req, res) => {
  try {
    // Get pagination parameters from query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    
    // Build search query
    const searchQuery = search 
      ? { departmentName: { $regex: search, $options: 'i' } }
      : {};
    
    // Get total count for pagination info
    const totalCount = await Department.countDocuments(searchQuery);
    
    // Get departments with pagination and search
    const departments = await Department.find(searchQuery)
      .sort({ createdAt: -1 })
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
      count: departments.length,
      departments
    });
  } catch (error) {
    console.error("GET DEPARTMENTS ERROR:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Get Single Department
export const getDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await Department.findById(id);
    
    if (!department) {
      return res.status(404).json({ 
        success: false, 
        message: "Department not found" 
      });
    }

    res.json({
      success: true,
      department
    });
  } catch (error) {
    console.error("GET DEPARTMENT ERROR:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Update Department
export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { departmentName, description } = req.body;

    // Validation
    if (!departmentName || !description) {
      return res.status(400).json({ 
        success: false, 
        message: "Department name and description are required" 
      });
    }

    // Check if department exists
    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ 
        success: false, 
        message: "Department not found" 
      });
    }

    // Check if another department with the same name exists
    const existingDepartment = await Department.findOne({ 
      departmentName: departmentName.trim(),
      _id: { $ne: id }
    });
    
    if (existingDepartment) {
      return res.status(400).json({ 
        success: false, 
        message: "Department name already exists" 
      });
    }

    // Update department
    department.departmentName = departmentName.trim();
    department.description = description.trim();
    
    await department.save();

    res.json({
      success: true,
      message: "Department updated successfully",
      department
    });
  } catch (error) {
    console.error("UPDATE DEPARTMENT ERROR:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Delete Department
export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await Department.findByIdAndDelete(id);
    
    if (!department) {
      return res.status(404).json({ 
        success: false, 
        message: "Department not found" 
      });
    }

    res.json({
      success: true,
      message: "Department deleted successfully",
      department
    });
  } catch (error) {
    console.error("DELETE DEPARTMENT ERROR:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};