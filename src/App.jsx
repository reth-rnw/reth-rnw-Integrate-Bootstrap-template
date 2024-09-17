import React, { useState, useEffect } from "react";
import { Button, Form, Card, Row, Col, Container } from "react-bootstrap";
import { FaFrown, FaMeh, FaSmile, FaGrinAlt, FaAngry } from "react-icons/fa";

function App() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    hearAbout: "",
    registrationRating: "",
    navigationRating: "",
    feedback: "",
    agree: false,
  });
  const [feedbackList, setFeedbackList] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const storedFeedback = JSON.parse(localStorage.getItem("feedbackList")) || [];
    setFeedbackList(storedFeedback);
  }, []);

  useEffect(() => {
    localStorage.setItem("feedbackList", JSON.stringify(feedbackList));
  }, [feedbackList]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First Name is required.";
    if (!formData.lastName) newErrors.lastName = "Last Name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.phone) newErrors.phone = "Phone Number is required.";
    if (!formData.hearAbout) newErrors.hearAbout = "Please select how you heard about us.";
    if (!formData.registrationRating) newErrors.registrationRating = "Please rate the Registration Process.";
    if (!formData.navigationRating) newErrors.navigationRating = "Please rate the Website Navigation.";
    if (!formData.feedback) newErrors.feedback = "Feedback is required.";
    if (!formData.agree) newErrors.agree = "You must agree to the terms.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" })); // Clear error on change
  };

  const handleRatingChange = (category, value) => {
    setFormData({ ...formData, [category]: value });
    setErrors((prevErrors) => ({ ...prevErrors, [category]: "" })); // Clear error on change
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const newFeedback = { ...formData };

    if (editIndex !== null) {
      const updatedFeedbackList = feedbackList.map((fb, index) =>
        index === editIndex ? newFeedback : fb
      );
      setFeedbackList(updatedFeedbackList);
      setEditIndex(null);
    } else {
      setFeedbackList([newFeedback, ...feedbackList]);
    }

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      hearAbout: "",
      registrationRating: "",
      navigationRating: "",
      feedback: "",
      agree: false,
    });
  };

  const handleEdit = (index) => {
    setFormData(feedbackList[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedFeedbackList = feedbackList.filter((_, i) => i !== index);
    setFeedbackList(updatedFeedbackList);
  };

  const ratingIcons = [
    { icon: <FaAngry />, color: "red" },
    { icon: <FaFrown />, color: "orange" },
    { icon: <FaMeh />, color: "yellow" },
    { icon: <FaSmile />, color: "lightgreen" },
    { icon: <FaGrinAlt />, color: "green" },
  ];

  return (
    <Container className="my-5 text-white py-4 rounded">
      <h1 className="text-center mb-4">Feedback Form</h1>

      <Form onSubmit={handleSubmit} className="border w-50 mx-auto p-4 rounded">
        <h2>User Registration Feedback</h2>
        <p>We would love to hear your thoughts about your registration experience.</p>

        <Row>
          <Col sm={6}>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="bg-dark text-white"
              />
              {errors.firstName && <Form.Text className="text-danger">{errors.firstName}</Form.Text>}
            </Form.Group>
          </Col>
          <Col sm={6}>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="bg-dark text-white"
              />
              {errors.lastName && <Form.Text className="text-danger">{errors.lastName}</Form.Text>}
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Email Address"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="bg-dark text-white"
          />
          {errors.email && <Form.Text className="text-danger">{errors.email}</Form.Text>}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="bg-dark text-white"
          />
          {errors.phone && <Form.Text className="text-danger">{errors.phone}</Form.Text>}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>How did you hear about us?</Form.Label>
          <Form.Select
            name="hearAbout"
            value={formData.hearAbout}
            onChange={handleChange}
            className="bg-dark text-white"
          >
            <option value="">Select an option</option>
            <option value="Internet Search">Internet Search</option>
            <option value="Friend">Friend</option>
            <option value="Advertisement">Advertisement</option>
            <option value="Other">Other</option>
          </Form.Select>
          {errors.hearAbout && <Form.Text className="text-danger">{errors.hearAbout}</Form.Text>}
        </Form.Group>

        <h3>Rate your experience</h3>

        <Form.Group className="mb-3">
          <Form.Label>Registration Process</Form.Label>
          <div>
            {ratingIcons.map((item, index) => (
              <span
                key={index}
                onMouseOver={() => handleRatingChange("registrationRating", index + 1)}
                style={{
                  cursor: "pointer",
                  fontSize: "2rem",
                  color: formData.registrationRating === index + 1 ? item.color : "gray",
                  margin: "0 5px",
                  transition: "color 0.3s ease",
                }}
                className={`rating-icon ${formData.registrationRating === index + 1 ? "selected" : ""}`}
              >
                {item.icon}
              </span>
            ))}
          </div>
          {errors.registrationRating && <Form.Text className="text-danger">{errors.registrationRating}</Form.Text>}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Website Navigation</Form.Label>
          <div>
            {ratingIcons.map((item, index) => (
              <span
                key={index}
                onMouseOver={() => handleRatingChange("navigationRating", index + 1)}
                style={{
                  cursor: "pointer",
                  fontSize: "2rem",
                  color: formData.navigationRating === index + 1 ? item.color : "gray",
                  margin: "0 5px",
                  transition: "color 0.3s ease",
                }}
                className={`rating-icon ${formData.navigationRating === index + 1 ? "selected" : ""}`}
              >
                {item.icon}
              </span>
            ))}
          </div>
          {errors.navigationRating && <Form.Text className="text-danger">{errors.navigationRating}</Form.Text>}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Feedback</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="feedback"
            value={formData.feedback}
            onChange={handleChange}
            placeholder="Please provide any feedback you have about your experience."
            className="bg-dark text-white"
          />
          {errors.feedback && <Form.Text className="text-danger">{errors.feedback}</Form.Text>}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="I agree to the Terms and Conditions and acknowledge the Privacy Policy."
            name="agree"
            checked={formData.agree}
            onChange={handleChange}
            className="text-white"
          />
          {errors.agree && <Form.Text className="text-danger">{errors.agree}</Form.Text>}
        </Form.Group>

        <Button variant="primary" type="submit" className="d-block mx-auto">
          {editIndex !== null ? "Update Feedback" : "Submit Feedback"}
        </Button>
      </Form>

      <div className="mt-5">
        <h2 className="text-center">User Feedback</h2>
        <div className="d-flex flex-wrap ">
          {feedbackList.length === 0 ? (
            <p className="text-center">No feedback yet.</p>
          ) : (
            feedbackList.map((feedback, index) => (
              <Card
                key={index}
                className="bg-secondary text-white m-3"
                style={{ width: "18rem" }}
              >
                <Card.Body>
                  <Card.Title>Feedback #{index + 1}</Card.Title>
                  <Card.Text>
                    <p>First Name: {feedback.firstName}</p>
                  </Card.Text>
                  <Card.Text>
                    <p>Last Name: {feedback.lastName}</p>
                  </Card.Text>
                  <Card.Text>
                    <p>Email: {feedback.email}</p>
                  </Card.Text>
                  <Card.Text>
                    <p>Phone: {feedback.phone}</p>
                  </Card.Text>
                  <Card.Text>
                    <p>How did you hear about us? {feedback.hearAbout}</p>
                  </Card.Text>
                  <Card.Text>
                    <p>Registration Rating: {feedback.registrationRating}</p>
                  </Card.Text>
                  <Card.Text>
                    <p>Navigation Rating: {feedback.navigationRating}</p>
                  </Card.Text>
                  <Card.Text>
                    <p>Feedback: {feedback.feedback}</p>
                  </Card.Text>
                  <Button
                    variant="warning"
                    onClick={() => handleEdit(index)}
                    className="me-2"
                  >
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(index)}>
                    Delete
                  </Button>
                </Card.Body>
              </Card>
            ))
          )}
        </div>
      </div>
    </Container>
  );
}

export default App;
