const mongoose = require("mongoose");

const consumptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  energyConsumed: { type: Number, required: true }, // kWh
  cost: { type: Number, required: true }, // asociado con energía consumida
  type: {
    type: String,
    enum: ["historical", "real-time"],
    default: "historical",
  },
});

module.exports = mongoose.model("Consumption", consumptionSchema);
