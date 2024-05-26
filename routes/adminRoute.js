const express = require("express");
const router = express.Router();
const authorizeRoles = require("../middleware/authorizeRoles");
const authenticateToken = require("../middleware/authMiddleware");
const {
  createCourse,
  deleteCourse,
  allStudents,
  courseCompletionStatusUpdate,
  updateAndCreateNewVersion,
  getAllCourses,
  getAdminDetails,
  getStudentSpecificCourses
} = require("../controllers/adminController");

//get admin details
router.get(
  "/get-admin",
  authenticateToken,
  authorizeRoles("admin"),
  getAdminDetails
);

//get all course
router.get(
  "/allCourses",
  authenticateToken,
  authorizeRoles("admin"),
  getAllCourses
);

//creating a new course
router.post(
  "/create-course",
  authenticateToken,
  authorizeRoles("admin"),
  createCourse
);

//updating a existing course
router.put(
  "/update-course/:courseId",
  authenticateToken,
  authorizeRoles("admin"),
  updateAndCreateNewVersion
);

//discountinuing a course
router.delete(
  "/delete-course/:courseId",
  authenticateToken,
  authorizeRoles("admin"),
  deleteCourse
);

//all the student list
router.get(
  "/all-students",
  authenticateToken,
  authorizeRoles("admin"),
  allStudents
);

//get student specific courses
router.get("/student-courses/:stdId",authenticateToken,
authorizeRoles("admin"),getStudentSpecificCourses)

//course completion status update of a student
router.post(
  "/course-completion/:studentId/:courseId",
  authenticateToken,
  authorizeRoles("admin"),
  courseCompletionStatusUpdate
);
module.exports = router;
