const mongoose = require("mongoose");

const ResourceSchema = new mongoose.Schema(
  {
    resourceName: { 
        type: String, 
        required: true 
    },
    type: { 
        type: String, 
        enum: ["food", "water", "shelter"], 
        required: true 
    },
    quantity: { 
        type: Number, 
        required: true 
    },
    location: {
      type: String,
      required: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    expirationDate: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resource", ResourceSchema);
