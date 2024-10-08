const mongoose = require("mongoose");

const NGOSchema = new mongoose.Schema(
    {
        NGOName : {
            type: String,
            required: true,
            min: 3,
            max: 20,
            unique: true,
            trim: true,
        },
        NGOAddress : {
            type: String,
            required: true,
            max: 200,
            unique: true,
        },
        TotalDonations : {
            type: Number,
            required: true,
        },
        TotalVolunteers : {
            type: Number,
            required: true,
        },
        NGOLocation : {
            type: String,
            required: true,
        },
        NGOOwner : {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model("NGO", NGOSchema);