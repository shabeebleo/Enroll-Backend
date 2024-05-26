const express = require("express");
const router = express.Router();
const authorizeRoles = require("../middleware/authorizeRoles");
const authenticateToken = require("../middleware/authMiddleware");
const {
  enrollCourse,
  dropCourse,
  getAllCourses,
  getUserDetails,
  enrolledCourses,
} = require("../controllers/studentController");

//get user(student) details
router.get(
  "/get-user",
  authenticateToken,
  authorizeRoles("student"),
  getUserDetails
);

//const getAllCourse
router.get("/allCourses", getAllCourses);

//enrolled course
router.get(
  "/enrolled-Courses",
  authenticateToken,
  authorizeRoles("student"),
  enrolledCourses
);
//enroll a new course
router.post(
  "/enroll/:courseId",
  authenticateToken,
  authorizeRoles("student"),
  enrollCourse
);

//drop a course
router.put(
  "/dropCourse/:enrollId",
  authenticateToken,
  authorizeRoles("student"),
  dropCourse
);

module.exports = router;
