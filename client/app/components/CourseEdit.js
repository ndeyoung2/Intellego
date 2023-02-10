//react stuff
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editCourse } from "../store/slices/courseSlices";
import { selectCourses } from "../store/slices/courseSlices";
import { useNavigate } from "react-router-dom";

//bootstrap stuff
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

const CourseCreate = ({ showEdit, setShowEdit, id }) => {
  const handleEditClose = () => setShowEdit(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [validated, setValidated] = useState(false);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      dispatch(editCourse({ id, name, subject, gradeLevel }));
      setShowEdit(false);

      navigate(0);
    }
    setValidated(true);
  };

  return (
    <Modal show={showEdit} onHide={handleEditClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Course</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated} onSubmit={handleEditSubmit}>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              autoFocus
              required
              placeholder="Course Name"
              onChange={(e) => setName(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please enter a Course Name.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Subject</Form.Label>
            <Form.Control
              type="text"
              required
              placeholder="Subject Name"
              onChange={(e) => setSubject(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please enter a Subject Name.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group>
            <Form.Label>Grade</Form.Label>
            <Form.Control
              type="number"
              min="0"
              max="100"
              step="1"
              required
              placeholder="Grade"
              onChange={(e) => setGradeLevel(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please enter a number between 0 to 100.
            </Form.Control.Feedback>
          </Form.Group>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CourseCreate;
