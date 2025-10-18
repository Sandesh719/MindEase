import mongoose from "mongoose";

const testAttemptSchema = new mongoose.Schema({
  testType: { type: String, enum: ["PHQ-9", "GAD-7", "GHQ-12"], required: true },
  answers: [Number],
  score: Number,
  severity: String,
  recommendation: String,
  createdAt: { type: Date, default: Date.now }
});

const testResultSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tests: [testAttemptSchema]
});

export default mongoose.model("TestResult", testResultSchema);
