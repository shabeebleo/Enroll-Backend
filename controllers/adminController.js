const Course = require("../models/courseModel");
const User=require("../models/userModel")
const Enrollment=require("../models/enrollementModel")




//getUserDetails
const getAdminDetails = async (req, res) => {
  userId = req.user._id;

  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ error: true, message: "user not found" });
    }
    return res.json({
      error: false,
      user: {
        username: user.username,
        email: user.email,
        _id: user._id,
        createdOn: user.createdOn,
      },
      message: "user details",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "internal server error" });
  }
};




//get all courses
const getAllCourses = async (req, res) => {
  try {
    // Fetch all courses from the database where active is true
    const courses = await Course.find();

    // Check if there are any courses found
    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: "No active courses found" });
    }

    // Send the courses in the response
    res.status(200).json(courses);
  } catch (error) {
    // Handle any errors that occurred during the process
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



//create a new course
const createCourse = async (req, res) => {
    console.log(req.body,"req.body in createCourse")
  try {
    const newCourse = new Course(req.body);
    await newCourse.save();
    res.status(201).json({newCourse});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// create a new version of course (updating)
const updateAndCreateNewVersion = async (req, res) => {
  const courseId=req.params.courseId
  console.log(req.body,"req.body in updating")
  try {
    // Create a new version of the course with the provided data
    const newCourse = new Course(req.body);
    newCourse.version += 1; // Increment the version
    console.log("newversion after update : ",newCourse)
    await newCourse.save();
    // Deactivate the previous version of the course if it exists
    const previousVersion = await Course.findOne({ _id:courseId, active: true });
    if (previousVersion) {
      previousVersion.active = false;
      await previousVersion.save();
    }

    res.status(201).json({ newCourse });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// delete a course
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.courseId,
      { active: false }, // Set the active status to false
      { new: true }
    );
    
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course marked as inactive successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//getting all students
const allStudents=async (req,res)=>{
    try {
        const students=await User.find({role:"student"})
        if (!students) {
            return res.status(404).json({ message: "no students" });
          }
          res.status(200).json({ students: students,message:"fetched all students" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//get student specific courses
const getStudentSpecificCourses=async(req,res)=>{
  console.log("student specifice courses")
  try {
    const studentId = req.params.stdId; // Get the student ID from the authenticated user's request
    const enrolledCourses = await Enrollment.find({ student: studentId }).populate('course'); // Find enrollments and populate course details

    if (!enrolledCourses) {
      return res.status(404).json({ message: "No enrolled courses found" });
    }
    res.status(200).json(enrolledCourses); // Send the enrolled courses as a response
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    res.status(500).json({ message: "Server error" }); // Handle any server errors
  }
}
//course completion approval of a student for respective course
const courseCompletionStatusUpdate = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;

    // Find the enrollment and update the status to 'completed'
    const enrollment = await Enrollment.findOneAndUpdate(
      { student: studentId, course: courseId, status: 'enrolled' },
      { status: 'completed' },
      { new: true }
    );

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found or course already completed" });
    }

    res.status(200).json({ message: "Course status updated to completed", enrollment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports={getAdminDetails,getStudentSpecificCourses,createCourse,deleteCourse,allStudents,courseCompletionStatusUpdate,getAllCourses,updateAndCreateNewVersion}