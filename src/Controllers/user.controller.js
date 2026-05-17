import mongoose from "mongoose";
import {User} from "../Models/user.model.js"
import {Blogs} from "../Models/blogs.model.js"

import { customError } from "../Utils/errorClass.js";
import bcrypt from "bcrypt"
import { sendEmail } from "../Services/emailService.js";
import { otpVerificationTemplate } from "../Templates/otpVerificationTemplate.js";
import jwt from "jsonwebtoken";
import { roleCheck } from "../Middlewares/roleCheck.js";



const registerUserController = async (req, res, next) => { 
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password ) {
       throw new customError(400, "All fields are required");
    }

    const existingUser = await User.findOne({email});
    if (existingUser) {
      throw new customError(400, "User Already Exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const OTP = Math.floor(1000 + Math.random()* 9000);

    // 1. User created in DB successfully here
    const user = await User.create({name, email, phone, password: hashedPassword, OTP});

    // 2. Email process triggers
    sendEmail(email, "OTP Verification", otpVerificationTemplate.replace("{OTP}", OTP.toString())
  ).catch((error) => {
    console.error("Email error:", error);
  });

    // 3. Sent back to frontend
    return res.status(201).json({status: "success", user});

  } catch (error) {
    console.error("Caught email or DB error:", error.message);
    next(error); 
  }
};




const otpVerificationController = async (req, res) => {

  const { email, otp } = req.body;

  console.log(email, otp);

  if (!email || !otp) {
    throw new customError(400, "All fields are required")
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new customError(400, "User not found");
  }


  console.log(otp, user.OTP)

  if (user.OTP !== otp) {
    throw new customError(400, "Incorrect OTP");
  }
  // Updating database fields

  user.OTP = null;
  user.isVerified = true;
  await user.save()

  res.status(200).json({ status: "success", message: "OTP verified successfully" })
}




const loginController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new customError(400, "All fields are required")
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new customError(400, "User not found")
  }

  if (!user.isVerified) {
    throw new customError(400, "User not Verified")
  }

  const isPassowrdValid = await bcrypt.compare(password, user.password);

  if (!isPassowrdValid) {
    throw new customError(400, "Incorrect Password")
  }


  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET);
  // console.log(token)

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,  // Requires Https
    sameSite: "None",
    // maxAge: 3600000, // 1 hour
  })

  res.status(200).json({ status: "success", message: "Login Successful", userId: user._id, token })
}




const getUserDetailsController = async (req, res) => {
  const { userId } = req.params;

  // Checks format. If bad, it THROWS to expressAsyncHandler, 
  // which sends it to your new 4-argument handler in server.js
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new customError(400, "Invalid User ID format");
  }

  const user = await User.findById(userId).populate('blogs');

  if (!user) {
    throw new customError(404, "User not found");
  }

  res.status(200).json({ 
    status: "success", 
    message: "user data fetched successfully", 
    userData: { name: user.name, email: user.email, blogs: user.blogs } 
  });
};







const postBlogController = async (req, res) => {
  console.log("controller started ...");
  const { userId } = req.params;
  const { title, description, content } = req.body;

  // 1. Validation Check
  if (!userId || !title || !description || !content) {
    throw new customError(400, "All fields (userId, title, description, content) are required");
  }

  // 2. Check if the User exists before doing anything else
  const existinguser = await User.findById(userId);
  if (!existinguser) {
    throw new customError(404, "User not found");
  }

  // 3. Create the blog
  const blog = await Blogs.create({ 
    title, 
    description, 
    content, 
    author: userId 
  });

  // 4. Update the user's blog list
  existinguser.blogs.push(blog._id);

  // 5. Use await for saves (Keeping your logic)
  await existinguser.save();
  await blog.save();

  res.status(201).json({ 
    status: "success", 
    message: "Blog created Successfully", 
    data: blog 
  });
};




const getSingleBlogController = async (req, res) => {
  const { id } = req.params;
  const blog = await Blogs.findById(id).populate("author", "name");
  if (!blog) throw new customError(404, "Blog not found");
  
  res.status(200).json({ status: "success", blog });
};



const updateBlogController = async (req, res) => {
  const { id } = req.params;
  const { title, description, content } = req.body;

  const updatedBlog = await Blogs.findByIdAndUpdate(
    id, 
    { title, description, content }, 
    { new: true } // This returns the updated version
  );

  if (!updatedBlog) throw new customError(404, "Blog not found");

  res.status(200).json({ status: "success", message: "Updated successfully", data: updatedBlog });
};


const deletBlogController = async ( req, res ) => {
  const { id } = req.params;
  const deleteBlog = await Blogs.findByIdAndDelete(id);

  if ( !deleteBlog ) throw new customError(404, "Blog not found")

   res.status(200).json({ status: "success", message: "Deleted successfully", data: deleteBlog });
  
}


const getAllBlogsController = async (req, res) => {
  // 1. Added .populate("author", "name") 
  // This fetches the user document and only selects the 'name' field
  const blogs = await Blogs.find()
    .populate("author", "name") 
    .sort({ createdAt: -1 }); 
  
  res.status(200).json({ 
    status: "success", 
    data: blogs 
  });
};




export {
  registerUserController, 
  otpVerificationController, 
  loginController, 
  getUserDetailsController, 
  postBlogController, 
  getSingleBlogController, 
  updateBlogController,
  deletBlogController,
  getAllBlogsController
}; 