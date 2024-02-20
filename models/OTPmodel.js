const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema({

  otp: { type: String, required: true },
  emailId: { type: String, required: true },
  createdAt: { type: Date, expires: "2m", default: Date.now },
  
});


const Otp = mongoose.model("Otp", OtpSchema);

module.exports = Otp;