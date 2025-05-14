import userModel from "../models/userModel.js";
import ApiResponse from "../utils/ApiResponse.js";
import cloudinary from "../utils/cloudinary.js";
import { ApiError } from "../utils/error.js";
import transporter from "../utils/nodemailer.js";
import { uploadToCloudinary } from "../utils/cloudinaryHelper.js";
import jwt from "jsonwebtoken";

export const Register = async (req, res, next) => {
  try {
    // Destructure and sanitize input
    const firstName = req.body.firstName?.trim();
    const lastName = req.body.lastName?.trim();
    const email = req.body.email?.trim();
    const userName = req.body.userName?.trim();
    const password = req.body.password;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return next(
        new ApiError(
          400,
          "First Name, Last Name, E-mail and Password are required"
        )
      );
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return next(new ApiError(400, "User already exists. Please login"));
    }

    // Handle Cloudinary upload if file exists
    let uploadResult = { secure_url: "", public_id: "" };
    if (req.file) {
      try {
        uploadResult = await uploadToCloudinary(req.file.buffer);
      } catch (uploadError) {
        return next(new ApiError(500, "Failed to upload image"));
      }
    }

    // Create user
    const user = await userModel.create({
      firstName,
      lastName,
      userName,
      email,
      password,
      thumbnail: uploadResult.secure_url,
      cloudinary_id: uploadResult.public_id,
    });

    // Send welcome email (non-blocking)
    transporter
      .sendMail({
        from: process.env.SMTP_EMAIL,
        to: user.email,
        subject: "🎉 Welcome to VeriCapture – No More Fake News for You!",
        text: `Hello ${user.firstName},\n\nWelcome to VeriCapture!\n\nYou're now officially part of a real-time, truth-driven platform.\n\n🚀 Explore. Share. Stay ahead.\n\n- VeriCapture Team`,
      })
      .catch(console.error); // Do not block if email fails

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    // Set token cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    // Send success response
    res.status(201).json(new ApiResponse(201, "Registration successful"));
  } catch (error) {
    next(error); // Global error handler
  }
};

export const Login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ApiError(400, "E-mail and Password are required"));
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new ApiError(401, "Invalid credentials"));
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new ApiError(401, "Invalid credentials"));
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 3 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json(new ApiResponse(200, user, "Login successful"));
};

export const Logout = (req, res, next) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

export const updateUser = async (req, res, next) => {
  const userId = req.user?._id;
  const { firstName, lastName, userName, email } = req.body;

  if (!userId) {
    return next(
      new ApiError(403, "You are not authorized. Please login to continue")
    );
  }

  const user = await userModel.findById(userId);
  if (!user) {
    return next(new ApiError(404, "User not found"));
  }

  let uploadResult = {
    secure_url: user.thumbnail,
    public_id: user.cloudinary_id,
  };

  // 🔵 Only upload new image if file exists
  if (req.file) {
    if (user.cloudinary_id) {
      await cloudinary.uploader.destroy(user.cloudinary_id);
    }

    uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });
  }

  const updateFields = {
    thumbnail: uploadResult.secure_url,
    cloudinary_id: uploadResult.public_id,
  };

  if (firstName) updateFields.firstName = firstName;
  if (lastName) updateFields.lastName = lastName;
  if (userName) updateFields.userName = userName;
  if (email) updateFields.email = email;

  const updatedUser = await userModel.findByIdAndUpdate(
    user._id,
    { $set: updateFields },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: "Profile update successful",
    user: {
      firstName: updatedUser.firstName,
      lastName: updateUser.lastName,
      userName: updateUser.userName,
      email: updatedUser.email,
      thumbnail: updatedUser.thumbnail,
    },
  });
};

// Delete User
export const deleteUser = async (req, res, next) => {
  const userId = req.user?._id;
  if (!userId) {
    return next(
      new ApiError(403, "You are not authorized. Please login to continue")
    );
  }

  const user = await userModel.findById(userId);
  if (!user) {
    return next(new ApiError(404, "User not found"));
  }

  // Delete image from Cloudinary (if any)
  if (user.cloudinary_id) {
    await cloudinary.uploader.destroy(user.cloudinary_id);
  }

  await userModel.findByIdAndDelete(user._id);

  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({
    success: true,
    message: "Your account has been deleted successfully",
  });
};

// export const Register = async (req, res, next) => {
//   const { firstName, lastName, email, userName, password } = req.body;

//   if (!firstName || !lastName || !email || !password) {
//     const error = new ApiError(
//       400,
//       "First Name, Last Name, E-mail and Password are required"
//     );
//     return next(error);
//   }
//   // const { error } = schema.validate(req.body);
//   // if (error) {
//   //   return next(new ApiError(400, error.details[0].message));
//   // }

//   const existingUser = await userModel.findOne({ email });
//   if (existingUser) {
//     // const error = new ApiError(403, "User already exist");
//     // return next(error);
//     return next(new ApiError(400, "User Already exist. Please login"));
//   }

//   // if (!req.file) {
//   //   return res
//   //     .status(400)
//   //     .json({ status: "fail", message: "Image file is required" });
//   // }

//   let uploadResult = { secure_url: "", public_id: "" }; // Default values

//   if (req.file) {
//     uploadResult = await new Promise((resolve, reject) => {
//       const stream = cloudinary.uploader.upload_stream(
//         { resource_type: "auto" },
//         (error, result) => {
//           if (error) {
//             return reject(error);
//           }
//           resolve(result);
//         }
//       );
//       stream.end(req.file.buffer);
//     });
//   }

//   // const result = await new Promise((resolve, reject) => {
//   //   const stream = cloudinary.uploader.upload_stream(
//   //     { resource_type: "auto" },
//   //     (error, result) => {
//   //       if (error) {
//   //         return reject(error);
//   //       }
//   //       resolve(result);
//   //     }
//   //   );
//   //   stream.end(req.file.buffer);
//   // });

//   // const uploadResult = await result;
//   const user = await userModel.create({
//     firstName,
//     lastName,
//     userName,
//     email,
//     password,
//     thumbnail: uploadResult.secure_url,
//     cloudinary_id: uploadResult.public_id,
//   });

//   const newUser = await userModel.findById(user._id);
//   if (!newUser) {
//     const error = new ApiError(500, "Something went wrong");
//     return next(error);
//   }

//   const mailOptions = {
//     from: process.env.SMTP_EMAIL,
//     to: newUser.email,
//     subject: "🎉 Welcome to VeriCapture – No More Fake News for You!",
//     text: `Hello ${newUser.name},

//             Congratulations! You just made one of the smartest decisions of your life (okay, maybe second to choosing jollof over fried rice).
//             You’re now officially part of VeriCapture—where only real-time,
//             verified content gets to shine, and fake news gets kicked to the curb.

//            🚀 What’s Next?

//            Capture & Share – Spot something happening? Record live and upload—no old, recycled nonsense here.

//            Stay Ahead – Get real-time updates on traffic, riots, accidents, and those "avoid-this-road" situations.

//            Trust the Trends – AI ensures what you see is authentic, not WhatsApp-forwarded chaos.

//           💡 Pro Tip: If you ever try uploading a photo from 2016 claiming it’s "happening now," our AI will laugh at you (and then block it). Just saying.

//            Go ahead, log in, explore, and see what’s real near you!

//            🔗 CALL TO ACTION BUTTON

//            Welcome aboard! The internet just got a little less messy—thanks to you.

//            The VeriCapture Team
//            Bringing the truth, one real-time upload at a time.`,
//   };
//   await transporter.sendMail(mailOptions);

//   const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
//     expiresIn: "3d",
//   });

//   res.cookie("token", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict",
//     maxAge: 3 * 24 * 60 * 60 * 1000,
//   });

//   res.status(201).json(new ApiResponse(201, "Registration successful"));
// };

// export const Login = async (req, res, next) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     const error = new ApiError(400, "E-mail and Password are required");
//     return next(error);
//   }
//   // const { error } = loginSchema.validate(req.body);
//   // if (error) {
//   //   return res.status(400).json(new ApiError(400, error.details[0].message));
//   // }

//   const user = await userModel.findOne({ email });
//   if (!user) {
//     const error = new ApiError(401, "Invalid credentials");
//     return next(error);
//   }

//   const isMatch = await user.comparePassword(password, user.password);
//   if (!isMatch) {
//     const error = new ApiError(401, "Invalid credentials");
//     return next(error);
//   }

//   const loggedInUser = await userModel
//     .findById(user._id)
//     .select("firstName lastName username thumbnail email");

//   const token = jwt.sign({ id: loggedInUser._id }, process.env.JWT_SECRET, {
//     expiresIn: "3d",
//   });

//   res.cookie("token", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict",
//     maxAge: 3 * 24 * 60 * 60 * 1000,
//   });

//   res.status(200).json(new ApiResponse(200, loggedInUser, "Login successful"));
// };

// export const Logout = (req, res, next) => {
//   const { token } = req.cookies;
//   res.clearCookie("token", token, {
//     httpOnly: true,
//     sameSite: "strict",
//     secure: process.env.NODE_ENV === "production",
//   });

//   res.status(200).json({
//     success: true,
//     message: "Logout successful",
//   });
// };

// export const updateUser = async (req, res, next) => {
//   const userId = req.user._id;
//   const { name, email } = req.body;

//   if (!userId) {
//     const error = new ApiError(
//       403,
//       "You are not authorized. Please login to continue"
//     );
//     return next(error);
//   }
//   const user = await userModel.findById(userId);
//   if (!user) {
//     const error = new ApiError(404, "User not found");
//     return next(error);
//   }

//   // 🔵 If a new file is uploaded, handle streaming upload
//   if (req.file) {
//     // Delete old image from Cloudinary if exists
//     if (user.cloudinary_id) {
//       await cloudinary.uploader.destroy(user.cloudinary_id);
//     }
//   }

//   const uploadPromise = new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       { resource_type: "auto" },
//       (error, result) => {
//         if (error) return reject(error);
//         resolve(result);
//       }
//     );
//     stream.end(req.file.buffer);
//   });

//   // Await Cloudinary upload result
//   const uploadResult = await uploadPromise;

//   const userToUpdate = await userModel.findByIdAndUpdate(
//     user._id,
//     {
//       $set: {
//         name,
//         email,
//         thumbnail: uploadResult.secure_url,
//         cloudinary_id: uploadResult.public_id,
//       },
//     },
//     { new: true, runValidators: true }
//   );
//   await userToUpdate.save();

//   res.status(201).json({
//     success: true,
//     message: "Profile update successful",
//   });
// };

// export const deleteUser = async (req, res, next) => {
//   const userId = req.user._id;
//   if (!userId) {
//     const error = new ApiError(
//       403,
//       "You are not authorized. Please login to continue"
//     );
//     return next(error);
//   }
//   const user = await userModel.findById(userId);
//   if (!user) {
//     const error = new ApiError(404, "User not found");
//     return next(error);
//   }

//   const userToDelete = await userModel.findByIdAndDelete(user._id);

//   res.status(200).json({
//     success: true,
//     message: "Your account is deleted successfully",
//   });
// };

export const fetchUsersByName = async (req, res, next) => {
  const userId = req.user.id;
  // console.log("Decoded User from Token:", req.user);
  if (!userId) {
    const error = new ApiError(
      403,
      "You are not authorized. Please login to continue"
    );
    return next(error);
  }

  const user = await userModel.findById(userId);
  if (!user) {
    const error = new ApiError(404, "User not found");
    return next(error);
  }

  const { name } = req.params;
  if (!name) {
    const error = new ApiError(400, "Please provide name for the search");
    return next(error);
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const totalUsers = await userModel.countDocuments({
    name: { $regex: name, $options: "i" },
  });
  if (!totalUsers) {
    const error = new ApiError(404, "No users found");
    return next(error);
  }

  const foundUsers = await userModel
    .find({ name: { $regex: name, $options: "i" } })
    .skip(skip)
    .limit(limit)
    .select("firstName thumbnail");

  if (foundUsers.length === 0) {
    const error = new ApiError(404, "No more page available");
    return next(error);
  }

  res.status(200).json({
    page,
    limit,
    totalUsers,
    totalPages: Math.ceil(totalUsers / limit),
    data: foundUsers,
  });
};

export const fetchOneUserById = async (req, res, next) => {
  const userId = req.user._id;
  if (!userId) {
    const error = new ApiError(
      403,
      "You are not authorized. Please login to continue"
    );
    return next(error);
  }

  const user = await userModel.findById(userId);
  if (!user) {
    const error = new ApiError(404, "User not found");
    return next(error);
  }

  const { id } = req.params;
  if (!id) {
    const error = new ApiError(400, "Please user ID in the search query");
    return next(error);
  }

  const fetchedUser = await userModel.findById(id).select("name thumbnail");
  if (!fetchedUser) {
    const error = new ApiError(404, "User not found");
    return next(error);
  }

  res.status(200).json({
    success: true,
    data: {
      id: fetchedUser._id,
      firstName: fetchedUser.firstName,
      lastName: fetchedUser.lastName,
      email: fetchedUser.email,
      thumbnail: fetchedUser.thumbnail,
    },
  });
};
