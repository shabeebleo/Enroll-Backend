const Enrollment = require("../models/enrollementModel");
const User = require("../models/userModel");
const Course = require("../models/courseModel");

//getUserDetails

const getUserDetails = async (req, res) => {
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

//const getAllCourse

const getAllCourses = async (req, res) => {
  try {
    // Fetch all courses from the database where active is true
    const courses = await Course.find({ active: true });

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

//enrolled coures list
const enrolledCourses = async (req, res) => {
  try {
    const studentId = req.user._id; // Get the student ID from the authenticated user's request
    const enrolledCourses = await Enrollment.find({ student: studentId }).populate('course'); // Find enrollments and populate course details

    if (!enrolledCourses) {
      return res.status(404).json({ message: "No enrolled courses found" });
    }
    res.status(200).json(enrolledCourses); // Send the enrolled courses as a response
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    res.status(500).json({ message: "Server error" }); // Handle any server errors
  }
};

//enroll a new course
const enrollCourse = async (req, res) => {
  console.log("enrollCourseenrollCourse")
  try {
    const { courseId } = req.params;
    const studentId = req.user._id; // Assuming you have the authenticated user in req.user

    // Check if the student is already enrolled in the course
    const existingEnrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
      status:"enrolled"
    });
    if (existingEnrollment) {
      return res
        .status(400)
        .json({ message: "Student is already enrolled in the course" });
    }

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Create a new enrollment
    let enrollment = new Enrollment({
      student: studentId,
      course: courseId,
      status: "enrolled",
    });
    await enrollment.save();

    // Populate the course field with course details
    enrollment = await Enrollment.findById(enrollment._id).populate('course');

    res
      .status(200)
      .json({ message: "Enrolled in the course successfully", enrollment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



//drop a course

const dropCourse = async (req, res) => {
  console.log("reached dropCourse");
  try {
    const { enrollId } = req.params;
    console.log("Enrollment ID:", enrollId);

    const enrollment = await Enrollment.findOneAndUpdate(
      { _id: enrollId },
      { status: "dropped" },
      { new: true }
    );

    if (!enrollment) {
      console.log("Enrollment not found or already dropped");
      return res
        .status(404)
        .json({ message: "Enrollment not found or already dropped" });
    }

    console.log("Course dropped successfully:", enrollment);
    res.status(200).json({ message: "Course dropped successfully", enrollment });
  } catch (error) {
    console.error("Error dropping course:", error);
    res.status(500).json({ message: error.message });
  }
};


module.exports = { enrollCourse, dropCourse, getAllCourses, getUserDetails,enrolledCourses,enrollCourse };
