import {User} from "../Models/user.model.js"
import {Blogs} from "../Models/blogs.model.js"

import { customError } from "../Utils/errorClass.js";
import bcrypt from "bcrypt"
import { sendEmail } from "../Services/emailService.js";
import { otpVerificationTemplate } from "../Templates/otpVerificationTemplate.js";
import jwt from "jsonwebtoken";
import { roleCheck } from "../Middlewares/roleCheck.js";




const registerUserController = async(req, res)=>{
   console.log("Request received!", req.body); 
 
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password ) {
       throw new customError(400, "All fields are required");
    }


    // For Already Registered Users

    const existingUser = await User.findOne({email});

    if (existingUser) {
      throw new customError(400, "User Already Exists");
    }



    // Password Hashing :-

    const hashedPassword = await bcrypt.hash(password, 12);


    // OTP Creation
    const OTP = Math.floor(1000 + Math.random()* 9000);

    // IF first time User
    const user = await User.create({name, email, phone, password: hashedPassword, OTP});


     // send OTP Email
    sendEmail(email, "OTP Verification", otpVerificationTemplate.replace("{OTP}", OTP));

    res.status(201).json({status: "success", user});
  }




  const otpVerificationController = async(req, res)=> {

    const {email, otp} = req.body;

    console.log(email, otp);
    
    if(!email || !otp) {
      throw new customError(400, "All fields are required")
    }

    const user = await User.findOne({email});

    if(!user){
      throw new customError(400, "User not found");
    }


    console.log(otp, user.OTP)

    if(user.OTP !== otp) {
      throw new customError(400, "Incorrect OTP");
    }




    // Updating database fields

    user.OTP = null;
    user.isVerified = true;
    await user.save()

    res.status(200).json({status: "success", message:"OTP verified successfully"})
  }




  const loginController = async (req, res)=> {
    const {email, password} = req.body;

    if( !email || !password ){
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


    const token = jwt.sign({ userId: user._id, role : user.role }, process.env.JWT_SECRET);
    // console.log(token)

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,  // Requires Https
      sameSite: "None", 
      // maxAge: 3600000, // 1 hour
    })

    res.status(200).json({status: "success", message: "Login Successful", userId : user._id, token})
  }




 const getUserDetailsController = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new customError(400, "user id is required");
  }

 
  const user = await User.findById(userId).populate('blogs');

  if (!user) {
    throw new customError(404, "User not found");
  }



  const userData = {
    name: user.name,
    email: user.email,
    phone: user.phone,
    blogs: user.blogs
  };

  res.status(200).json({ status: "success", message: "user data fetched successfully", userData });
};





const postBlogController = async (req, res) => {

  console.log("controleer started ...")
  const { userId } = req.params;
  const { title, description, content } = req.body;

  // ... (keep your validation checks)

  const blog = await Blogs.create({ 
    title, 
    description, 
    content, 
    author: userId // Assign author immediately
  });

  const existinguser = await User.findById(userId);
  existinguser.blogs.push(blog._id);

  // Use await for saves
  await existinguser.save();
  await blog.save();

  res.status(201).json({ status: "success", message: "Blog created Successfully", data: blog });
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