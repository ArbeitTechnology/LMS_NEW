const express=require("express");
const MCQ = require("../models/MCQ");
const { authenticateTeacher } = require("../middleware/teacherauth");
const { create } = require("../models/Admin");
const Question = require("../models/Question");
const Teaceherrouter=express.Router();


// Create a new MCQ
Teaceherrouter.post('/create-mcq', authenticateTeacher, async (req, res) => {
  try {
    const mcq = new MCQ({
      ...req.body,
      createdBy: req.user._id
    });
    await mcq.save();
    res.status(201).send(mcq);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all MCQs 
Teaceherrouter.get('/all-mcq',authenticateTeacher, async (req, res) => {
  try {
    const mcqs = await MCQ.find().sort({createdAt: -1})
    res.send(mcqs);
  } catch (error) {
    res.status(500).send();
  }
});

// Get a specific MCQ
Teaceherrouter.get('/single-mcq/:id',authenticateTeacher, async (req, res) => {
  try {
    const mcq = await MCQ.findById(req.params.id);
    if (!mcq) {
      return res.status(404).send();
    }
    res.send(mcq);
  } catch (error) {
    res.status(500).send();
  }
});

// Update an MCQ
Teaceherrouter.put('/update-mcq/:id', authenticateTeacher, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['question', 'options', 'correctAnswer', 'category', 'difficulty', 'explanation'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const mcq = await MCQ.findOne({ _id: req.params.id, createdBy: req.user._id });

    if (!mcq) {
      return res.status(404).send();
    }

    updates.forEach(update => mcq[update] = req.body[update]);
    await mcq.save();
    res.send(mcq);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete an MCQ
Teaceherrouter.delete('/delete-mcq/:id', authenticateTeacher, async (req, res) => {
  try {
    const mcq = await MCQ.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    if (!mcq) {
      return res.status(404).send();
    }
    res.send(mcq);
  } catch (error) {
    res.status(500).send();
  }
});

// ---------------------------------------question-routes----------------------------
// Get all questions
Teaceherrouter.get('/',authenticateTeacher, async (req, res) => {
  try {
  
    const questions = await Question.find({}).sort({createdAt:-1})
    res.send(questions);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get a specific question
Teaceherrouter.get('/single-question/:id',authenticateTeacher, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('author', 'username'); // Adjust fields as needed

    if (!question) {
      return res.status(404).send({ error: 'Question not found' });
    }

    // Increment view count
    question.views += 1;
    await question.save();

    res.send(question);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
// Create a new question 
Teaceherrouter.post('/create-question', authenticateTeacher, async (req, res) => {
  try {
    const question = new Question({
      ...req.body,
      author: req.user._id 
    });

    await question.save();
    res.status(201).send(question);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});
// Update a question
Teaceherrouter.put('/update-question/:id', authenticateTeacher, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'content', 'type', 'number', 'tags'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const question = await Question.findOne({
      _id: req.params.id,
      author: req.user._id
    });

    if (!question) {
      return res.status(404).send({ error: 'Question not found or not authorized' });
    }

    updates.forEach(update => question[update] = req.body[update]);
    question.updatedAt = Date.now();
    await question.save();

    res.send(question);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});
// Delete a question
Teaceherrouter.delete('/delete-question/:id', authenticateTeacher, async (req, res) => {
  try {
    const question = await Question.findOneAndDelete({
      _id: req.params.id,
    });
    if (!question) {
      return res.status(404).send({ error: 'Question not found or not authorized' });
    }

    res.send(question);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports=Teaceherrouter;