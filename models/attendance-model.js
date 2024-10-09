const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AttendanceSchema = new Schema({
  employeeID: { type: Schema.Types.ObjectId, ref: "User", required: true },
  year: {
    type: Number,
    required: true,
  },
  month: { type: Number, required: true },
  date: { type: Number, required: true },
  day: { type: String, required: true },

  // New 'status' field to store Present, Absent, Leave, Half Day
  status: {
    type: String,
    enum: ["Present", "Absent", "Leave", "Half Day"],
    required: true,
  },

  // Optional field to track if attendance was entered manually
  manual: {
    type: Boolean,
    default: true,
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Attendance", AttendanceSchema);
