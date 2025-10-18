import TestQuestion from "../models/TestQuestion.js";
import TestResult from "../models/TestResult.js";

// Get questions for a test
export const getQuestions = async (req, res) => {
  const { testType } = req.params;
  const test = await TestQuestion.findOne({ testType });
  if (!test) return res.status(404).json({ message: "Test not found" });
  res.json(test);
};

// Save test result
export const saveTestResult = async (req, res) => {
  const { studentId, testType, answers, score, severity, recommendation } = req.body;

  let testResult = await TestResult.findOne({ studentId });
  const testAttempt = { testType, answers, score, severity, recommendation };

  if (testResult) {
    testResult.tests.push(testAttempt);
  } else {
    testResult = new TestResult({ studentId, tests: [testAttempt] });
  }

  await testResult.save();
  res.json({ message: "Test saved successfully" });
};

// Get all tests of a student
export const getStudentTests = async (req, res) => {
  const { studentId } = req.params;
  const result = await TestResult.findOne({ studentId });
  res.json(result || { tests: [] });
};

// Get specific test report
export const getTestReport = async (req, res) => {
  const { studentId, testId } = req.params;
  const result = await TestResult.findOne({ studentId });
  if (!result) return res.status(404).json({ message: "No tests found" });

  const test = result.tests.id(testId);
  if (!test) return res.status(404).json({ message: "Test not found" });

  res.json(test);
};
