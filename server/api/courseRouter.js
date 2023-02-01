const router = require("express").Router();
const {
  models: { Student, Course, Assessment },
} = require("../db");
const asyncHandler = require("express-async-handler");
const Submission = require("../db/models/submissionModel");

/*
courses/:courseid/assessments
courses/:courseid/students
courses/:courseid/assessments/:assessmentid
courses/:courseid/students/:studentid
courses/:courseid/submissions
*/

// get all course list
router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    res.status(200).json(await Course.findAll());
  })
);

// coursed assessments
router.get(
  "/:courseid/assessments",
  asyncHandler(async (req, res, next) => {
    res.status(200).json(
      await Course.findAll({
        include: Assessment,
      })
    );
  })
);

// get individual courses with students
router.get(
  "/:courseid/students",
  asyncHandler(async (req, res, next) => {
    res.status(200).json(
      await Course.findByPk(req.params.courseid, {
        include: Student,
      })
    );
  })
);

// create new courses
router.post(
  "/",
  asyncHandler(async (req, res, next) => {
    res.status(200).send(await Course.create(req.body));
  })
);

// Edit a course
router.put(
  "/:courseId",
  asyncHandler(async (req, res, next) => {
    const course = await Course.findByPk(req.params.courseId);
    res.status(200).send(await course.update(req.body));
  })
);

// get courses with single students
// router.get(
//   "/students/:studentId",
//   asyncHandler(async (req, res, next) => {
//     res.status(200).json(
//       await Course.findByPk(req.params.studentId, {
//         include: Student,
//       })
//     );
//   })
// );

//@desc fetch grades for every assessment in a particular course

router.get(
  "/:courseid/submissions",
  asyncHandler(async (req, res, next) => {
    const allSubmissions = await Submission.findAll({
      where: {
        courseId: req.params.courseid,
      },
    });
    const ungraded = {};
    const graded = {};
    allSubmissions.forEach((element) => {
      if (element.grade === null) {
        if (!ungraded[element.assessmentId]) {
          ungraded[element.assessmentId] = {};
        }
        if (!ungraded[element.assessmentId][element.studentId]) {
          ungraded[element.assessmentId][element.studentId] = [];
        }
        ungraded[element.assessmentId][element.studentId].push(element);
      } else {
        if (!graded[element.assessmentId]) {
          graded[element.assessmentId] = {};
        }
        if (!graded[element.assessmentId][element.studentId]) {
          graded[element.assessmentId][element.studentId] = [];
        }
        graded[element.assessmentId][element.studentId].push(element);
      }
    });
    res.json({ graded, ungraded });
  })
);

module.exports = router;
