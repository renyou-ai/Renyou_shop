const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name:             { type: String, required: true },
    email:            { type: String, required: true, unique: true },
    password:         { type: String, required: true },
    role:             { type: String, enum: ["user", "admin"], default: "user" }, // ← AJOUT
    resetToken:       { type: String },
    resetTokenExpiry: { type: Date },
    skinProfile: {
  ageRange: {
    type: String,
  },

  gender: {
    type: String,
  },

  skinType: {
    type: String,
  },

  dehydration: {
    type: String,
  },

  redness: {
    type: String,
  },

  wrinkles: {
    type: String,
  },

  darkSpots: {
    type: String,
  },

  completed: {
    type: Boolean,
    default: false,
  },

  completedAt: {
    type: Date,
  },
  
},
shippingAddress: {
  fullName: String,

  phone: String,

  address: String,

  city: String,

  postalCode: String,

  country: String,
},
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);