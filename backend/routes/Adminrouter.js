const express = require("express");
const Adminrouter = express.Router();
const { 
  authenticateToken, 
  authorizeAdmin, 
  authorizeSubAdmin,
  checkAccountStatus 
} = require("../middleware/auth"); // Update the path accordingly
const Teacher = require("../models/Teacher");
const bcrypt = require('bcryptjs');
const Student = require("../models/Student");
// Example of a protected admin route
Adminrouter.get("/", authenticateToken, authorizeAdmin, (req, res) => {
    try {
        // Now you have access to req.admin, req.id, and req.role
        res.json({ 
            message: "Welcome Admin", 
            admin: req.admin,
            role: req.role
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// -------------------------------------teachers-routes----------------------------------------
// Get all teachers 
Adminrouter.get("/teachers", authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const teachers = await Teacher.find({}).select('-password -__v');
        
        res.json({
            success: true,
            count: teachers.length,
            data: teachers
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: "Server error while fetching teachers" 
        });
    }
});

// Get single teacher by ID
Adminrouter.get("/teachers/:id", authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id).select('-password -__v');
        
        if (!teacher) {
            return res.status(404).json({ 
                success: false,
                message: "Teacher not found" 
            });
        }
        
        res.json({
            success: true,
            data: teacher
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: "Server error while fetching teacher" 
        });
    }
});

// Update teacher (all fields)
Adminrouter.put("/teachers/:id", authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const updates = req.body;
        
        // Prevent password updates through this route (should have separate password update route)
        if (updates.password) {
            return res.status(400).json({ 
                success: false,
                message: "Use the password reset route to change password" 
            });
        }

        const updatedTeacher = await Teacher.findByIdAndUpdate(
            req.params.id,
            { 
                ...updates,
                last_updated: Date.now()
            },
            { new: true, runValidators: true }
        ).select('-password -__v');
        
        if (!updatedTeacher) {
            return res.status(404).json({ 
                success: false,
                message: "Teacher not found" 
            });
        }
        
        res.json({
            success: true,
            message: "Teacher updated successfully",
            data: updatedTeacher
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: "Server error while updating teacher" 
        });
    }
});
// Change teacher password 
Adminrouter.put("/teachers-update-password/:id", authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { newPassword } = req.body;
        
        if (!newPassword) {
            return res.status(400).json({ 
                success: false,
                message: "New password is required" 
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ 
                success: false,
                message: "Password must be at least 8 characters" 
            });
        }

        if (!/\d/.test(newPassword) || !/[!@#$%^&*]/.test(newPassword)) {
            return res.status(400).json({ 
                success: false,
                message: "Password must contain a number and a special character" 
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        
        const updatedTeacher = await Teacher.findByIdAndUpdate(
            req.params.id,
            { 
                password: hashedPassword,
                last_updated: Date.now()
            },
            { new: true }
        ).select('-password -__v');
        
        if (!updatedTeacher) {
            return res.status(404).json({ 
                success: false,
                message: "Teacher not found" 
            });
        }
        
        res.json({
            success: true,
            message: "Teacher password updated successfully",
            data: updatedTeacher
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: "Server error while updating password" 
        });
    }
});
// Change teacher status 
Adminrouter.put("/teachers-status/:id", authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { status, rejection_reason } = req.body;
        
        if (!status) {
            return res.status(400).json({ 
                success: false,
                message: "Status is required" 
            });
        }
        
        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ 
                success: false,
                message: "Invalid status value" 
            });
        }
        
        // If rejecting, require a reason
        if (status === 'rejected' && !rejection_reason) {
            return res.status(400).json({ 
                success: false,
                message: "Rejection reason is required when rejecting a teacher" 
            });
        }
        
        const updateData = { 
            status,
            last_updated: Date.now()
        };
        
        // Only update rejection_reason 
        if (status === 'rejected') {
            updateData.rejection_reason = rejection_reason;
        } else {
            updateData.rejection_reason = undefined;
        }
        
        const updatedTeacher = await Teacher.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).select('-password -__v');
        
        if (!updatedTeacher) {
            return res.status(404).json({ 
                success: false,
                message: "Teacher not found" 
            });
        }
        
        res.json({
            success: true,
            message: `Teacher status changed to ${status}`,
            data: updatedTeacher
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: "Server error while updating teacher status" 
        });
    }
});

// Delete single teacher
Adminrouter.delete("/teachers/:id", authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);
        
        if (!deletedTeacher) {
            return res.status(404).json({ 
                success: false,
                message: "Teacher not found" 
            });
        }
        
        res.json({
            success: true,
            message: "Teacher deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: "Server error while deleting teacher" 
        });
    }
});

// Delete multiple teachers
Adminrouter.delete("/delete-all-teachers", authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { teacherIds } = req.body;
        
        if (!teacherIds || !Array.isArray(teacherIds) || teacherIds.length === 0) {
            return res.status(400).json({ 
                success: false,
                message: "Please provide an array of teacher IDs to delete" 
            });
        }
        
        const result = await Teacher.deleteMany({ _id: { $in: teacherIds } });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ 
                success: false,
                message: "No teachers found to delete" 
            });
        }
        
        res.json({
            success: true,
            message: `${result.deletedCount} teacher(s) deleted successfully`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: "Server error while deleting teachers" 
        });
    }
});

// ------------------------------------teacher-routes-------------------------------------------------


// -------------------------------------students-routes----------------------------------------
// Get all students 
Adminrouter.get("/students", authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const students = await Student.find({}).select('-password -__v');
        
        res.json({
            success: true,
            count: students.length,
            data: students
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: "Server error while fetching students" 
        });
    }
});

// Get single student by ID
Adminrouter.get("/students/:id", authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).select('-password -__v');
        
        if (!student) {
            return res.status(404).json({ 
                success: false,
                message: "Student not found" 
            });
        }
        
        res.json({
            success: true,
            data: student
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: "Server error while fetching student" 
        });
    }
});

// Create new student
Adminrouter.post("/students", authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { email, password, full_name, phone, date_of_birth, address } = req.body;

        // Check if student already exists
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({
                success: false,
                message: "Student with this email already exists"
            });
        }

        const newStudent = await Student.create({
            email,
            password,
            full_name,
            phone,
            date_of_birth,
            address
        });

        // Remove password from the response
        const studentResponse = newStudent.toObject();
        delete studentResponse.password;

        res.status(201).json({
            success: true,
            message: "Student created successfully",
            data: studentResponse
        });
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: Object.values(error.errors).map(val => val.message)
            });
        }
        res.status(500).json({ 
            success: false,
            message: "Server error while creating student" 
        });
    }
});

// Update student (all fields except password)
Adminrouter.put("/students/:id", authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const updates = req.body;
        
        // Prevent password updates through this route
        if (updates.password) {
            return res.status(400).json({ 
                success: false,
                message: "Use the password update route to change password" 
            });
        }

        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        ).select('-password -__v');
        
        if (!updatedStudent) {
            return res.status(404).json({ 
                success: false,
                message: "Student not found" 
            });
        }
        
        res.json({
            success: true,
            message: "Student updated successfully",
            data: updatedStudent
        });
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: Object.values(error.errors).map(val => val.message)
            });
        }
        res.status(500).json({ 
            success: false,
            message: "Server error while updating student" 
        });
    }
});

// Change student password 
Adminrouter.put("/students-update-password/:id", authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { newPassword } = req.body;
        
        if (!newPassword) {
            return res.status(400).json({ 
                success: false,
                message: "New password is required" 
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ 
                success: false,
                message: "Password must be at least 8 characters" 
            });
        }

        if (!/\d/.test(newPassword) || !/[!@#$%^&*]/.test(newPassword)) {
            return res.status(400).json({ 
                success: false,
                message: "Password must contain a number and a special character" 
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            { 
                password: hashedPassword,
                password_changed_at: Date.now()
            },
            { new: true }
        ).select('-password -__v');
        
        if (!updatedStudent) {
            return res.status(404).json({ 
                success: false,
                message: "Student not found" 
            });
        }
        
        res.json({
            success: true,
            message: "Student password updated successfully",
            data: updatedStudent
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: "Server error while updating password" 
        });
    }
});

// Change student status (active/inactive)
Adminrouter.put("/students-status/:id", authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { is_active } = req.body;
        
        if (typeof is_active !== 'boolean') {
            return res.status(400).json({ 
                success: false,
                message: "is_active must be a boolean value" 
            });
        }
        
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            { 
                is_active,
                last_login: is_active ? Date.now() : undefined
            },
            { new: true }
        ).select('-password -__v');
        
        if (!updatedStudent) {
            return res.status(404).json({ 
                success: false,
                message: "Student not found" 
            });
        }
        
        res.json({
            success: true,
            message: `Student status changed to ${is_active ? 'active' : 'inactive'}`,
            data: updatedStudent
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: "Server error while updating student status" 
        });
    }
});

// Delete single student
Adminrouter.delete("/students/:id", authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);
        
        if (!deletedStudent) {
            return res.status(404).json({ 
                success: false,
                message: "Student not found" 
            });
        }
        
        res.json({
            success: true,
            message: "Student deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: "Server error while deleting student" 
        });
    }
});

// Delete multiple students
Adminrouter.delete("/delete-all-students", authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { studentIds } = req.body;
        
        if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
            return res.status(400).json({ 
                success: false,
                message: "Please provide an array of student IDs to delete" 
            });
        }
        
        const result = await Student.deleteMany({ _id: { $in: studentIds } });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ 
                success: false,
                message: "No students found to delete" 
            });
        }
        
        res.json({
            success: true,
            message: `${result.deletedCount} student(s) deleted successfully`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: "Server error while deleting students" 
        });
    }
});
module.exports = Adminrouter;