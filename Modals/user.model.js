import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum : ['admin','trainer', 'member'],
      default: 'member',
      required: true,
    },
    status: {
      type: String,
      enum : ['active','inactive'],
      default: 'active',
      required: true,
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);
const userModel = mongoose.model("User", userSchema);

export default userModel;
