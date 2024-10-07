// models/userModel.js
import mongoose, { Schema } from "mongoose";

// Schéma utilisateur
const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "First Name is Required!"],
        },
        lastName: {
            type: String,
            required: [true, "Last Name is Required!"],
        },
        email: {
            type: String,
            required: [true, "Email is Required!"],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Password is Required!"],
            minlength: [6, "Password length should be greater than 6 characters"],
            select: true,
        },
        location: { type: String },
        profileUrl: { type: String },
        profession: { type: String },
        friends: [{ type: Schema.Types.ObjectId, ref: "Users" }],
        views: [{ type: Schema.Types.ObjectId, ref: "Users" }],
        verified: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Users = mongoose.model("Users", userSchema);

export default Users;
