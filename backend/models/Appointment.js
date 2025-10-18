import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true },
  counsellorName: { type: String, required: true },
  counsellorEmail: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  mode: { type: String, required: true },
  meetingLink: { type: String },
  location: { type: String},
  status: { type: String, default: "Pending", enum: ["Pending", "Completed"] }
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
