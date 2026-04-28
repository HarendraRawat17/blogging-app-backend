import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      // minlength: 6,
    },

    OTP: {
      type: String,
      default: null,
    },

    isVerified: {
      type: String,
      default: false,
    },
    role : {
      type: String,
      default: "user"
    },
    blogs : [{ 
      type : mongoose.Schema.Types.ObjectId,
       ref: "Blogs"
      }]
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model("User", userSchema);