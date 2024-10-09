const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 25,
      trim: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    // Office-related Details
    joiningDate: {
      type: Date,
      required: true,
    },
    empID: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ["admin", "employee", "leader"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "banned"],
      default: "active",
    },
    team: {
      type: Schema.Types.ObjectId,
      ref: "Team",
    },
    email: {
      type: String,
      required: [true, "Enter Email Address"],
      unique: [true, "Email Already Exists"],
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: "{VALUE} is not a valid email",
      },
    },
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 4,
      maxlength: 15,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 13,
      validate: {
        validator: (v) => /^[0-9]{10,13}$/.test(v), // Validate mobile number format
        message: "{VALUE} is not a valid mobile number!",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    address: {
      type: String,
      default: "No Address Specified",
      maxlength: 100,
      trim: true,
    },
    image: {
      type: String,
      default: "user.png",
    },

    // Bank Details
    accountNumber: {
      type: String,
      required: false,
      trim: true,
    },
    bankName: {
      type: String,
      required: false,
      trim: true,
    },
    IFSC: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const SALT_FACTOR = 10;

// Hash password before saving
userSchema.pre("save", async function () {
  const user = this;
  if (!user.isModified("password")) return;

  try {
    const salt = await bcrypt.genSalt(SALT_FACTOR);
    user.password = await bcrypt.hash(user.password, salt);
  } catch (err) {
    throw new Error("Password hashing failed");
  }
});

// Hash password before updateOne
userSchema.pre("updateOne", async function () {
  const update = this.getUpdate();

  // Check if password is being updated
  if (update.password) {
    try {
      const salt = await bcrypt.genSalt(SALT_FACTOR);
      const hashedPassword = await bcrypt.hash(update.password, salt);
      this.setUpdate({ ...update, password: hashedPassword });
    } catch (err) {
      throw new Error("Password hashing failed");
    }
  }
});

module.exports = mongoose.model("User", userSchema, "users");
