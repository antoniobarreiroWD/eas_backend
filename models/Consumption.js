const mongoose = require("mongoose");

const consumptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  year: { type: Number, required: true },
  energyConsumed: { type: Number, required: true },
  cost: { type: Number, required: true },
  type: {
    type: String,
    enum: ["historical", "real-time"],
    default: "historical",
  },
});

module.exports = mongoose.model("Consumption", consumptionSchema);
