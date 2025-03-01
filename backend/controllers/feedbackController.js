const spaceModel = require("../models/spaceModel");
const feedbackModel = require("../models/feedbackModel");
const { validationResult } = require("express-validator");

const submitFeedback = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, name, feedback, rating } = req.body;
  const { spaceId } = req.params;

  try {
    const space = await spaceModel.findById(spaceId);
    if (!space) {
      return res.status(404).json({ msg: "Space not found" });
    }

    const feedbacksave = new feedbackModel({
      email,
      name,
      feedbackuserLogo: req.file.buffer,
      feedback,
      rating,
      space: space._id,
    });

    await feedbacksave.save();

    return res.status(201).json({ msg: "Feedback submitted successfully" });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return res.status(500).json({ msg: "Failed to submit feedback" });
  }
};

module.exports = {
  submitFeedback,
};