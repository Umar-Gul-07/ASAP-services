const verificationStore = {}; // in-memory store for email verification codes
require("dotenv").config({ path: "node.env" });
require('dotenv').config();
const ADMIN_ID = "admin@gmail.com"; // only admin
const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
const bcryptjs = require("bcryptjs");
const AppModel = require("./models/App");
const WorkUpload = require("./models/workupload");
//////
const InformationBox = require("./models/informationBox");
const Service = require("./models/Service"); // ya sahi path jo aapka model hai
const Event = require("./models/Event");
const http = require("http");
const crypto = require("crypto");
const SellerModelProfile = require("./models/sellerdetailsmodel");
const router = express.Router();
const Stripe = require("stripe");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const bodyParser = require("body-parser");
const ForgotPassword = require("./models/ForgotPassword");
const Ad = require("./models/Ad");
///
const mongoose = require("mongoose");
const cors = require("cors");
const Seller = require("./models/Seller");
const Message = require("./models/Message");
//const SellerDetails = require("./models/SellerDetails");

const { createPaymentIntent } = require('./models/paymentModel');
const DeltaPayment = require("./models/DeltaPayment");
const City = require("./models/City");
const Product = require("./models/Prodct");
const Booking = require("./models/Booking");
const ServiceProvider = require("./models/Serviceprovider");
const Category = require("./models/Category");
const User = require("./models/User");
const Request = require("./models/Request");
const app = express();


app.use(express.urlencoded({ extended: true })); 

require("./db/conn");
const jwtToken = require("jsonwebtoken");
const port = process.env.PORT || 3000;
const static_path = path.join(__dirname, "../public");
app.use(express.static(static_path));
app.use(cors());
app.use(express.json({ limit: '5mb' }));
///////////
// Attach io to req

/////////////
app.get("/", (req, res) => {
  res.send("Hello from me");
});

app.listen(8000, () => {
  console.log(`Server is running on 8000`);
});
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: Token is missing" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: Invalid token" });
  }
};
const jwt = require("jsonwebtoken");
const Subproduct = require("./models/Subproduct");
const secretKey = process.env.JWT_SECRET_KEY;

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token || !token.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access denied. Token missing or invalid format." });
  }

  const tokenWithoutBearer = token.substring(7); // Remove "Bearer " prefix

  try {
    const decoded = jwt.verify(tokenWithoutBearer, secretKey);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
  }
};
app.post("/signup", async (req, res) => {
  try {
    const { Name, password, email, phoneNumber, zipCode, country, city, heardFrom,referenceName, } = req.body;

    // 🔍 Debug: frontend se kya aaya
    console.log("📩 Signup Request Body:", req.body);

    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: "Email already registered" });
      } else if (existingUser.phoneNumber === phoneNumber) {
        return res.status(400).json({ message: "Phone number already registered" });
      }
    }

    const newUser = new User({
      Name,
      password,
      country,
      city,
      email,
      phoneNumber,
      zipCode,
      heardFrom, 
      referenceName,
    });

    // 🔍 Debug: DB me save hone se pehle object
    console.log("📝 New User Object:", newUser);

    await newUser.save();

    // 🔍 Debug: confirm save
    console.log("✅ User Saved with heardFrom:", newUser.heardFrom);

    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("❌ Signup Error:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});


//////////////////////////////
///////////////////////////
////seller side



app.post("/seller-signup", async (req, res) => {
  try {
    let {
      Name,
      password,
      email,
      phoneNumber,
      categoryId,
      productId,
      city,
      subproductId,
      country,
      zipCode,
      experience,
      details,
      heardFrom, 
      referenceName,
    } = req.body;

    // agar empty hai to "Other"
    if (!heardFrom || heardFrom.trim() === "") {
      heardFrom = "Other";
    }

    // check duplicate user
    const existingUser = await Seller.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: "Email already registered" });
      } else if (existingUser.phoneNumber === phoneNumber) {
        return res.status(400).json({ message: "Phone number already registered" });
      }
    }

    // ✅ password hashing
    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = new Seller({
      Name,
      city,
      country,
      password: hashedPassword,
      email,
      category: categoryId,
      product: productId,
      phoneNumber,
      subproduct: subproductId,
      zipCode,
      experience,
      details,
      heardFrom,
      referenceName,
    });

    console.log("📩 Seller Signup Body:", req.body);
    console.log("📝 New Seller Object:", newUser);

    await newUser.save();

    res.status(200).json({ success: true, message: "Seller registered successfully" });
  } catch (error) {
    console.error("❌ Seller Signup Error:", error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});


app.post("/send-verification-code", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // store code (in-memory)
  verificationStore[email] = code;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "inquiriesesa@gmail.com",
      pass: "dmsfmhyxafbvnbgb",
    },
  });

  try {
    await transporter.sendMail({
      from: "inquiriesesa@gmail.com", // <-- should match your Gmail
      to: email,
      subject: "Your Verification Code",
      text: `Your code is ${code}`,
    });

    res.json({ success: true, code }); // optional
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send email", error: err.message });
  }
});







// Seller Login


app.post("/seller-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find seller by email
    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(400).json({ success: false, message: "Seller not found" });
    }

    // ✅ Compare password
    const isMatch = await bcryptjs.compare(password, seller.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid password" });
    }

    // ✅ Return sellerId directly (no JWT)
    res.json({
      success: true,
      message: "Login successful",
      sellerId: seller._id,
      name:seller.Name,
      userType: "SELLER",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
////////////////////

app.post("/seller-update-profile" , async (req,res)=>{
  const {sellerId , Name , email, phoneNumber , details,documentationURL, demoURL  } = req.body
  console.log(sellerId , Name , email, phoneNumber , details, documentationURL, demoURL )
  console.log("hello")
  try{
    const seller = await Seller.findById(sellerId);
    const updatedSeller = await Seller.findByIdAndUpdate(sellerId , {
      Name:Name ||  seller.Name,
      email : email || seller.email ,
      phoneNumber: phoneNumber || seller.phoneNumber,
      details:details|| seller.details,
      documentationURL:documentationURL || seller.documentationURL,
      demoURL: demoURL || seller.demoURL
    },{new:true}) ;
    res.status(201).json(updatedSeller);
  }
  catch(error){
    res.status(400).json(error)
  }
});
app.post("/buyer-update-profile" , async (req,res)=>{
  const {sellerId , Name , email, phoneNumber  } = req.body
  console.log(sellerId , Name , email, phoneNumber  )
  console.log("hello")
  try{
    const seller = await User.findById(sellerId);
    const updatedSeller = await User.findByIdAndUpdate(sellerId , {
      Name:Name ||  seller.Name,
      email : email || seller.email ,
      phoneNumber: phoneNumber || seller.phoneNumber,
    },{new:true}) ;
    res.status(201).json(updatedSeller);
  }
  catch(error){
    res.status(400).json(error)
  }
});
app.delete("/delete-seller/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSeller = await Seller.findByIdAndDelete(id);

    if (!deletedSeller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.status(200).json({ message: "Seller deleted successfully" });
  } catch (error) {
    console.error("Error deleting seller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    console.log(user)

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid User" });
    }

    if (user.isDeleted) {
      return res
        .status(403)
        .json({ success: false, message: "User account is deactivated" });
    }

    if (user.password !== password) {
      console.log(user);
      return res
        .status(401)
        .json({ success: false, message: "Invalid Password", data: user });
    }

    let payStatus;
    if (user && user.isDeleted === false) {
      try {
        payStatus = await Payment.findOne({ userId: user._id, expired: false });
        // console.log(status.isPaid);
      } catch (error) {
        console.error("Error fetching payment status:", error);
      }
    }

    //  const token = jwt.sign({ userId: user._id }, secretKey, {
    // expiresIn: "1h",
    //});

    res.status(200).json({
      success: true,
      message: "Login successful",
      userId: user._id,
      userType: user.userType,
      name:user.Name,
      payStatus: payStatus,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});
//////////////////
app.post("/logout", (req, res) => {
  // Assuming the token is sent in the Authorization header
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: No token provided" });
  }

  // Here, you would perform any additional validation or processing related to logging out
  // For example, you might revoke the token, update the user's status, etc.

  // Respond with a success message
  res.status(200).json({ success: true, message: "Logout successful" });
});
app.get("/check-auth", authenticateToken, (req, res) => {
  // If the code reaches here, it means the user is authenticated
  // You can return additional user information if needed
  res.json({ isAuthenticated: true, userId: req.userId });
});
app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route.", userId: req.userId });
});
app.post("/city", async (req, res) => {
  try {
    const { cityname } = req.body;
    const newCity = new City({
      cityname,
    });

    await newCity.save();

    res.status(200).json({ message: "City registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});
//////////////////////////////////
app.get("/users", async (req, res) => {
  try {
    const allusers = await User.find({}); // Query all cities and project only the 'cityname' field
    res.status(200).json(allusers);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching cities" });
  }
});
app.get("/getallsellers", async (req, res) => {
  try {
    const allusers = await Seller.find({}); // Query all cities and project only the 'cityname' field
    res.status(200).json(allusers);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching cities" });
  }
});
app.get("/getseller/:userId", async (req, res) => {
  console.log("hy")
  try {
    
    const id=req.params.userId;
    console.log(id)
    const allusers = await Seller.findById(id); // Query all cities and project only the 'cityname' field
    res.status(200).json(allusers);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching cities" });
  }
});
//////////////////
app.post("/messages", async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;
    const newMessage = new Message({ sender, receiver, message });
    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/messages/:userId/:sellerId", async (req, res) => {
  try {
    const { userId, sellerId } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: sellerId },
        { sender: sellerId, receiver: userId },
      ],
    }).sort({ createdAt: 1 }); // Use 'createdAt' instead of 'timestamp'

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/cities", async (req, res) => {
  try {
    const cities = await City.find({}, "cityname"); // Query all cities and project only the 'cityname' field
    res.status(200).json(cities);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching cities" });
  }
});
app.post("/services", async (req, res) => {
  try {
    const { name } = req.body;
    const newServices = new Services({
      name,
    });

    await newServices.save();

    res.status(200).json({ message: "Services registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});
app.get("/services", async (req, res) => {
  try {
    const services = await Services.find({}, "name"); // Query all cities and project only the 'cityname' field
    res.status(200).json(services);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching cities" });
  }
});
app.post("/serviceprovider", async (req, res) => {
  try {
    // Extract data from the request body
    const {
      Name,
      email,
      phoneNumber,
      city,
      product,
      location,
      distance,
      availability,
    } = req.body;
    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    // Create a new Serviceprovider instance
    const serviceprovider = new ServiceProvider({
      Name,
      email,
      phoneNumber,
      city,
      product,
      location,
      distance,
      availability,
    });

    // Save the data to the database
    await serviceprovider.save();

    res.status(201).json({ message: "Location data saved successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while saving location data" });
  }
});
app.get("/serviceprovider", async (req, res) => {
  try {
    const Services = await ServiceProvider.find(
      {},
      "Name email phoneNumber city category location distance availability"
    ); // Query all cities and project only the 'cityname' field
    res.status(200).json(Services);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching cities" });
  }
});
app.post("/Category", async (req, res) => {
  try {
    const { Title, image } = req.body;
    if (!Title || !image) {
      throw new Error("Missing parameter");
    }

    let existingCategory = await Category.findOne({ Title });

    if (existingCategory) {
      if (existingCategory.isDeleted) {
        // If the existing category is marked as deleted, update it to set isDeleted to false
        existingCategory.isDeleted = false;
        existingCategory.image = image;
        await existingCategory.save();
        return res
          .status(200)
          .json({ message: "Category already existed and is now restored" });
      } else {
        return res.status(400).json({ message: "Category already registered" });
      }
    }

    const newCategory = new Category({
      Title,
      image,
    });

    await newCategory.save();

    res.status(200).json({ message: "Category registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});
app.get("/Category", async (req, res) => {
  try {
    const Services = await Category.find({ isDeleted: false }); // Query categories where isDeleted is false
    res.status(200).json(Services);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching categories" });
  }
});

app.get("/Category/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching category by ID" });
  }
});
app.post("/product", async (req, res) => {
  try {
    const { name, categoryId, image } = req.body;
    console.log(name, categoryId, image);

    // Check if the categoryId exists in the Category model
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    // Check if a product with the same name already exists
    const existingProduct = await Product.findOne({ name, category: categoryId });
    if (existingProduct) {
      return res.status(400).json({ message: "Product already registered" });
    }

    const newProduct = new Product({
      name,
      category: categoryId,
      image,
    });

    await newProduct.save();

    res.status(200).json({ message: "Product registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});
app.get("/product", async (req, res) => {
  try {
    const categoryId = req.query.categoryId;

    // Create a filter object to use in the query
    const filter = categoryId ? { category: categoryId, isDeleted: false } : {};

    // Fetch products based on the filter
    const products = await Product.find(filter);

    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching products" });
  }
});
app.get("/product/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching product by ID" });
  }
});
app.put('/product/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, categoryId, image } = req.body;

    // Validate if categoryId exists
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    // Check if another product with the same name and category exists (exclude current product)
    const existingProduct = await Product.findOne({ 
      name, 
      category: categoryId, 
      _id: { $ne: productId } 
    });
    if (existingProduct) {
      return res.status(400).json({ message: 'Another product with this name already exists in this category' });
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        name,
        category: categoryId,
        image,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while updating product' });
  }
});

app.get("/category/:categoryId/products", async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    // Check if the category exists
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Fetch products for the specified category
    const products = await Product.find({
      category: categoryId,
      isDeleted: false,
    });

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/seller-form", async (req, res) => {
  try {
    const { category, product, location, address } = req.body;
    const newUser = new Sellerform({
      category,
      location,
      product,
      address,
    });
    await newUser.save();
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});
app.get("/users/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Check if the user ID is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID" });
    }

    // Fetch user details by ID
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Return all user details
    res.status(200).json({ success: true, user: user.toObject() });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});
app.get("/getallsellers/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Check if the user ID is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID" });
    }

    // Fetch user details by ID
    const user = await Seller.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});
app.post("/api/logout", (req, res) => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(authToken, secretKey);
    // Additional checks, if needed...

    // If everything is fine, perform logout operations
    // ...

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
});
app.post("/bookings", async (req, res) => {
  try {
    const { userId, productId, sellerId } = req.body;
    // Create a new booking
    console.log(req.body.sellerName);
    const newBooking = await Booking.create({
      ...req.body
    })
    // SEND EMAIL ...................
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      // service: 'gmail',
      auth: {
        user: "inquiriesesa@gmail.com",
        pass: "vdaqhaybecipeldj",
      },
    });

    // Email options
    let mailOptions = {
      from: "inquiriesesa@gmail.com",
      to: req.body.sellerEmail,
      subject: "You Have Recieved A New Booking",
      text: `
      Hello ${req.body.sellerName},

      You have received a new booking for your service. Please review the detail on your dashboard and take necessary actions accordingly.
      Thank you for your cooperation.`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to send email." });
      } else {
        console.log("Email sent: " + info.response);
        res
          .status(200)
          .json({ message: "User found. Email sent.", ok: true });
      }
    });
    // SEND EMAIL END ...................
    res.status(201).json(newBooking);

  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
app.get("/bookings", async (req, res) => {
  try {
    const allBookings = await Booking.find().populate("user product seller");
    res.status(200).json(allBookings);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching bookings" });
  }
});
app.delete("/bookings/:id", async (req, res) => {
  try {
    // Extract the booking ID from the request parameters
    const bookingId = req.params.id;
    const buyerEmail = req.query.buyerEmail;
    const buyerName = req.query.buyerName
    const sellerName = req.query.sellerName
    // Check if the booking ID is valid
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ error: "Invalid booking ID" });
    }

    // Find the booking by its ID and delete it
    const deletedBooking = await Booking.findByIdAndDelete(bookingId);

    // Check if the booking was found and deleted successfully
    if (!deletedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Send a success response with the deleted booking data
    res.status(200).json(deletedBooking);

    // EMAIL SEND ...............
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      // service: 'gmail',
      auth: {
        user: "inquiriesesa@gmail.com",
        pass: "vdaqhaybecipeldj",
      },
    });

    // Email options
    let mailOptions = {
      from: "inquiriesesa@gmail.com",
      to: buyerEmail,
      subject: "Your request has been rejected",
      text: `Dear ${buyerName},

      We regret to inform you that your recent request has been declined by our service provider, Mr. ${sellerName}. We understand this may be disappointing and we are available to discuss any alternative solutions that may meet your needs.
      
      Kind regards,
      ASAP Services,
      `,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to send email." });
      } else {
        console.log("Email sent: " + info.response);
        res
          .status(200)
          .json({ message: "User found. Email sent.", ok: true });
      }
    });
    // EMAIL END .............

  } catch (error) {
    // Handle errors and send an error response
    console.error("Error deleting booking:", error);
    res.status(500).json({ error: "Failed to delete booking" });
  }
});

app.patch("/updateBooking/:id" ,async (req,res)=>{
  const bookingId = req.params.id
  const buyerEmail = req.query.buyerEmail;
  const buyerName = req.query.buyerName
  const sellerName = req.query.sellerName
  try {
  const booking = await Booking.findByIdAndUpdate({_id:bookingId} , {ordered:true} , {new:true})
  if(!booking){
   throw new Error("Booking Not Found") 
  }  
  // EMAIL SEND ...............
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      // service: 'gmail',
      auth: {
        user: "inquiriesesa@gmail.com",
        pass: "vdaqhaybecipeldj",
      },
    });

    // Email options
    let mailOptions = {
      from: "inquiriesesa@gmail.com",
      to: buyerEmail,
      subject: "Your request has been Accepted",
      text: `Dear ${buyerName},

      We regret to inform you that your recent request has been Accepted by our service provider, Mr. ${sellerName}. 
      
      Kind regards,
      ASAP Services,
      `,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to send email." });
      } else {
        console.log("Email sent: " + info.response);
        res
          .status(200)
          .json({ message: "User found. Email sent.", ok: true });
      }
    });
    // EMAIL END .............
  res.status(200).json(booking)
  } catch (error) {
    console.log("here")
    res.status(400).json({error:error.message , ok:false})
  }
  
})

app.get("/specificbooking", async (req, res) => {
  try {
    const { sellerId } = req.query;

    if (!sellerId) {
      return res.status(400).json({ message: "Seller ID is required" });
    }

    const sellerBookings = await Booking.find({ seller: sellerId }).populate(
      "user product seller"
    );
    res.status(200).json(sellerBookings);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching bookings" });
  }
});

app.post("/create-checkout-session", async (req, res) => {
  try {
    console.log("Request received at /create-checkout-session");

    const { paymentMethodId, userId, productId, zipCode, city } = req.body; // Destructure values from request body
    console.log("Product ID:", productId);
    console.log("Zip Code:", zipCode);
    console.log("City:", city);

    // Retrieve product details based on the paymentMethodId
    const items = [
      {
        price: "price_1P6bhaH9HQ2Ek1tPWKH1k7WL", // Your product price ID
        quantity: 1,
      },
      // Add more items if needed
    ];

    // Construct success and cancel URLs with parameters
    const success_url = `http://${
      req.headers.host
    }/success?session_id={CHECKOUT_SESSION_ID}&userId=${userId}&productId=${productId}${
      zipCode ? "&zipCode=" + zipCode : ""
    }${city ? "&city=" + city : ""}`;
    const cancel_url = `https://asap-new-backend.vercel.app/cancel?userId=${userId}&productId=${productId}&zipCode=${
      zipCode || ""
    }&city=${city || ""}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items,
      mode: "payment",
      success_url: success_url,
      cancel_url: cancel_url,
    });

    // Append session ID to success URL
    session.success_url += `?session_id=${session.id}`;

    // Return the session ID to the client
    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Error creating checkout session" });
  }
});

app.get("/success", async (req, res) => {
  try {
    console.log("Query Parameters:", req.query); // Log the entire req.query object
    const sessionId = req.query.session_id; // Correctly extract session ID from query parameters
    console.log("Session ID:", sessionId); // Log the session ID for debugging
    if (!sessionId) {
      throw new Error("Session ID is missing in query parameters.");
    }

    const userId = req.query.userId;
    console.log("User ID:", userId);

    const productId = req.query.productId;
    console.log("Product ID:", productId);

    const zipCode = req.query.zipCode;
    console.log("Zip Code:", zipCode);

    const city = req.query.city;
    console.log("City:", city);

    // Retrieve the session from Stripe to check its payment status
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      // Check if payment record already exists for the user
      let payment = await Payment.findOne({ userId: userId });
      // if (payment) {
      //   // Update existing payment record
      //   payment.isPaid = true;
      //   payment.zipCode = zipCode;
      //   payment.city = city;
      // } else {
      // Create new payment record
      payment = new Payment({
        sessionId: session.id,
        userId: userId,
        isPaid: true,
        zipCode: zipCode,
        city: city,
        // Add more payment-related fields as needed
      });

      // Save the payment record
      await payment.save();
      console.log("Payment Record Saved to Database");
    } else {
      console.error("Payment was not successful.");
    }
    // Redirect to seller panel with productId, zipCode, and city parameters
    res.redirect(
      `http://getasapservice.com/card.html?productId=${productId}&zipCode=${
        zipCode || ""
      }&city=${city || ""}&paidNow=${true}`
    );
  } catch (error) {
    console.error("Error handling success redirect:", error);
    res.status(500).json({ error: "Error handling success redirect" });
  }
});

// Cancel URL endpoint for Stripe Checkout
app.get("/cancel", (req, res) => {
  res.redirect("http://127.0.0.1:5500/ASSP/index.html"); // Redirect to login page if payment is cancelled
});
app.post("/delta-checkout-session", async (req, res) => {
  try {
    console.log("Request received at /create-checkout-session");

    const { paymentMethodId, email } = req.body; // Get userId from the request body
    console.log("Received Token:", req.header("Authorization"));
    console.log("Authenticated User ID:", email);

    // Retrieve product details based on the paymentMethodId
    const items = [
      {
        price: "price_1OhHCMH9HQ2Ek1tPDpXnGNlO", // Your product price ID
        quantity: 1,
      },
      // Add more items if needed
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items,
      mode: "payment",
      success_url: "https://dtouristics.com/Login",
      cancel_url: "https://asap-new-backend.vercel.app/cancel",
    });

    console.log("Checkout Session Created:", session);

    const payment = new DeltaPayment({
      sessionId: session.id,
      email: email,
      // Add more payment-related fields as needed
    });

    // Save the payment record to the database
    await payment.save();
    console.log("Payment Record Saved to Database");

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Error creating checkout session" });
  }
});

//Filter based on country city and zipcode
app.get("/getFilteredSellers", async (req, res) => {
  const city = req.headers.city;
  const zipCode = req.headers.zipcode;
  const category = req.headers.category;
  const product = req.headers.product;

  try {
    let filter = {}; // Initialize an empty filter object

    // Check if city is provided
    if (city) {
      filter.city = city;
    }

    // Check if zip code is provided
    if (zipCode) {
      filter.zipCode = zipCode;
    }

    // Check if category is provided
    if (category) {
      const categoryDoc = await Category.findById(category);

      if (!categoryDoc) {
        return res.status(404).json({ message: "Category not found" });
      }

      filter.category = category; // Include category in the filter
    }
    if (product) {
      // Find product title using its ObjectId
      const productDoc = await Product.findById(product);

      if (!productDoc) {
        return res.status(404).json({ message: "Product not found" });
      }

      filter.product = product; // Include product in the filter
    }

    const filteredSellers = await Seller.find(filter)
      .populate("category", "Title")
      .populate("product", "name");

    res.status(200).json({ data: filteredSellers });
  } catch (error) {
    res.status(400).json({ message: "Error filtering the sellers" });
  }
});

app.post("/forgotPassword", async (req, res) => {
  const { email, phoneNumber } = req.body;
  console.log("Received body:", req.body);

  try {
    const user = await User.findOne({ email });
    console.log("Found user:", user);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    console.log("User password:", user.password); // safe now

    // Create transporter
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "inquiriesesa@gmail.com",
        pass: "vdaqhaybecipeldj",
      },
    });

    let mailOptions = {
      from: "inquiriesesa@gmail.com",
      to: email,
      subject: "Password Reset",
      text: `Password: ${user.password}`,
    };

    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    res.status(200).json({ message: "User found. Email sent.", ok: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error." });
  }
});


app.delete("/deleteUser/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true }
    );
    res.status(200).json({ ok: true, data: updatedUser });
  } catch (error) {
    res.status(400).json({ message: "Error deleting" });
  }
});

app.delete('/category/:categoryId', async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    // Check if the Category ID is valid
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: 'Invalid Category ID' });
    }

    // Attempt to find the Category by ID and delete it
    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    // Check if the Category was found and deleted
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while deleting the Category' });
  }
});
app.put('/Category/:id', async (req, res) => {
    const { id } = req.params;
    const { Title, image } = req.body;

    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { Title, image },
            { new: true, runValidators: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json(updatedCategory);
    } catch (err) {
        console.error('Update error:', err);
        res.status(500).json({ error: 'Server error while updating category' });
    }
});

app.delete('/product/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;

    // Check if the product ID is valid
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    // Attempt to find the product by ID and delete it
    const deletedproduct = await Product.findByIdAndDelete(productId);

    // Check if the product was found and deleted
    if (!deletedproduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while deleting the Product' });
  }
});

app.get("/getAllPayments", async (req, res) => {
  try {
    const payments = await Payment.find().populate({
      path: "userId",
      select: "Name email phoneNumber",
    });
    res.status(200).json({ data: payments, ok: true });
  } catch (error) {
    res.status(400).json({ message: "Error getting all payments" });
  }
});

app.post("/postRequest", async (req, res) => {
  const { userId } = req.body;
  try {
    if (!userId) {
      return res.status(400).json({ message: "Missing fields" });
    }
    const existingRequest = await Request.findOne({
      userId,
      status: "pending",
    });
    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "Your request is already pending" });
    }
    const request = new Request({ userId });
    await request.save();

    res.status(200).json({ data: request, ok: true });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

app.get("/getAllRequests", async (req, res) => {
  try {
    const requests = await Request.find({ status: "pending" }).populate(
      "userId",
      "Name email phoneNumber"
    );

    res.status(200).json({ data: requests, ok: true });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

app.put("/updateReq/:id", async (req, res) => {
  const id = req.params.id;
  const { status, userId } = req.body;
  console.log(userId, status);

  try {
    // Update the request
    const updatedReq = await Request.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );

    // If the status is 'accepted', update the payment
    if (status === "accepted") {
      const updatedUser = await Payment.create({
        userId: userId,
        isPaid: true,
      });
      console.log(updatedUser);
    }

    // If the request is not found, return 404 response
    if (!updatedReq) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Return success response with updated request data
    res.status(200).json({ ok: true, data: updatedReq });
  } catch (error) {
    // Handle errors
    console.error("Error updating request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/checkExpired/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const expired = await Payment.findOne({ userId: userId, expired: false });
    console.log(expired);
    if (expired) {
      const dateCreated = new Date(expired.dateAdded);
      const currentDate = new Date();
      const differenceInMilliseconds = currentDate - dateCreated;
      const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
      console.log(differenceInDays);
      if (differenceInDays > 30) {
        expired.expired = true;
        await expired.save();
        return res.status(200).json({ ok: false, expired: true });
      } else {
        return res.status(200).json({
          data: expired,
          message: "Payment is not expired.",
          ok: true,
        });
      }
    }
    // If no payment is found, send a response indicating that
    return res
      .status(200)
      .json({ message: "No payment found. or payment is expired" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

app.get("/getOneUser/:id" ,async (req,res)=>{
  try {
    const user = await User.findById(req.params.id);
    if(!user){
      throw new Error("User Not Found")
    }
    res.status(200).json(user);
  } catch (error) {
    res.status.json(error);
  }
})


app.post("/seller/update" ,async (req,res)=>{
  const image = req.body.image
  const sellerId = req.body.sellerId
  
  try {
    const  updatedSeller= await Seller.findByIdAndUpdate(sellerId , {image:image} , {new:true})
    if (!updatedSeller) {
      throw new Error("SERVER ISSUE FACED")
    }
    res.status(201).json(updatedSeller)
  } catch (error) {
    res.status(400).json(error)
  }
})
app.post("/buyer/update" ,async (req,res)=>{
  const image = req.body.image
  const sellerId = req.body.sellerId
  
  try {
    const  updatedSeller= await User.findByIdAndUpdate(sellerId , {image:image} , {new:true})
    if (!updatedSeller) {
      throw new Error("SERVER ISSUE FACED")
    }
    res.status(201).json(updatedSeller)
  } catch (error) {
    res.status(400).json(error)
  }
})


app.post("/subproduct", async (req, res) => {
  try {
    const { name, productId,image, categoryId } = req.body;

    // Check if the productId exists in the Product model
    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // Check if a subproduct with the same name already exists
    const existingProduct = await Product.findOne({ name, category: categoryId, product: productId });
    if (existingProduct) {
      return res.status(400).json({ message: "Product already registered for this category" });
    }

    const newSubproduct = new Subproduct({
      name,
      product: productId,
      category: categoryId,
      image,
    });

    await newSubproduct.save();

    res.status(200).json({ message: "Subproduct registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});
app.put('/subproduct/:id', async (req, res) => {
  try {
    const subproductId = req.params.id;
    const { name, image } = req.body;

    // Find the subproduct by id
    const subproduct = await Subproduct.findById(subproductId);
    if (!subproduct) {
      return res.status(404).json({ message: 'Subproduct not found' });
    }

    // Update name and image only
    subproduct.name = name || subproduct.name;
    subproduct.image = image || subproduct.image;

    await subproduct.save();

    res.status(200).json({ message: 'Subproduct updated successfully', subproduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while updating subproduct' });
  }
});

app.get('/subproduct', async (req, res) => {
  try {
    const productId = req.query.productId;

    // Create a filter object to use in the query
    const filter = productId ? { product: productId } : {};

    // Fetch subproducts based on the filter
    const subproducts = await Subproduct.find(filter);

    res.status(200).json({ subproducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching subproducts' });
  }
});
app.delete('/subproduct/:subproductId', async (req, res) => {
  try {
    const subproductId = req.params.subproductId;

    // Check if the subproduct ID is valid
    if (!mongoose.Types.ObjectId.isValid(subproductId)) {
      return res.status(400).json({ message: 'Invalid subproduct ID' });
    }

    // Attempt to find the subproduct by ID and delete it
    const deletedSubproduct = await Subproduct.findByIdAndDelete(subproductId);

    // Check if the subproduct was found and deleted
    if (!deletedSubproduct) {
      return res.status(404).json({ message: 'Subproduct not found' });
    }

    res.status(200).json({ message: 'Subproduct deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while deleting the subproduct' });
  }
});
///////////////////////////////////////////////
/////////////sufian///////////////////////
// ------------------- Multer -------------------
///////////////////////////////
///////////////////////////////
////////////////////////////////////
//////////////////////////////////
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "user_ads",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage }); // use this in routes

////////////////////////////////////////
//////////////////////////////////
///////////////////////////
// ------------------ POST Seller ------------------
// POST seller details
// 1️⃣ Configure Multer fields (must be declared **before** the route)

const uploadFields = upload.fields([
  { name: "profileImage", maxCount: 1 },
  { name: "adsImages", maxCount: 10 },
]);

// 2️⃣ Use in route
app.post("/api/sellerdetailsprofile", uploadFields, async (req, res) => {
  try {
    const personal = req.body.personal ? JSON.parse(req.body.personal) : {};
    const aboutText = req.body.about || "";

    // Profile image
    if (req.files?.profileImage?.[0]) {
      personal.profileImage = {
        url: req.files.profileImage[0].path, // Cloudinary URL
        public_id: req.files.profileImage[0].filename,
      };
    }

    // Ads images
    const ads = [];
    if (req.files?.adsImages) {
      for (let file of req.files.adsImages) {
        ads.push({
          image: { url: file.path, public_id: file.filename },
          description: "",
        });
      }
    }

    // Save to DB
    const newSeller = await SellerModelProfile.create({
      personal,
      education: JSON.parse(req.body.education || "[]"),
      skills: JSON.parse(req.body.skills || "[]"),
      about: { description: aboutText },
      ads,
    });

    res.status(200).json({
      success: true,
      message: "Seller details uploaded successfully",
      data: newSeller,
    });
  } catch (error) {
    console.error("Form submission error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});




// GET sellers (all or by userId)
app.get("/api/sellerdetailsprofile", async (req, res) => {
  try {
    const { userId } = req.query;
    const query = userId ? { _id: userId } : {};
    const sellers = await SellerModelProfile.find(query);
    res.status(200).json(sellers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get verified sellers
app.get("/api/sellerdetailsprofile/verified", async (req, res) => {
  try {
    
    const verifiedSellers = await SellerModelProfile.find({ isVerified: true });
    res.status(200).json(verifiedSellers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});
// GET verified seller by ID
app.get("/api/sellerdetailsprofile/verified/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const seller = await SellerModelProfile.findOne({ _id: userId, isVerified: true });

    if (!seller) {
      return res.status(404).json({ success: false, message: "Verified seller not found" });
    }

    res.status(200).json(seller);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});


// Get unverified sellers
app.get("/api/sellerdetailsprofile/unverified", async (req, res) => {
  try {
    const unverifiedSellers = await SellerModelProfile.find({ isVerified: false });
    res.status(200).json(unverifiedSellers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});
// ✅ Verify a seller (admin action)
// Verify seller
// Verify seller
app.put("/api/sellerdetailsprofile/verify/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid seller ID" });
    }

    const seller = await SellerModelProfile.findById(id);
    if (!seller) return res.status(404).json({ message: "Seller not found" });

    seller.isVerified = true;
    await seller.save();

    res.status(200).json({ message: "Seller verified successfully", seller });
  } catch (error) {
    console.error("Error verifying seller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// DELETE a seller
app.delete("/api/sellerdetailsprofile/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Delete by MongoDB ObjectId
    const deletedSeller = await SellerModelProfile.findByIdAndDelete(id);

    if (!deletedSeller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.status(200).json({ message: "Seller deleted successfully" });
  } catch (error) {
    console.error("Error deleting seller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//////////////////////
//////////////////////
///////////////////////////
//////////////////////////
//////////////////



// Create Stripe checkout session
app.post('/create-checkout-session', async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price: productId, // Stripe priceId for registration fee
        quantity: 1,
      }],
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      client_reference_id: userId,
    });

    // Save session in DB
    await DeltaPayment.create({
      sessionId: session.id,
      email: "temp@example.com", // optional, can update later
    });

    res.json({ sessionId: session.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Stripe webhook
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Mark payment completed
    await DeltaPayment.findOneAndUpdate(
      { sessionId: session.id },
      { status: 'completed', paymentMethod: 'card' }
    );

    // Mark user as paid
    await User.findByIdAndUpdate(session.client_reference_id, { isPaid: true });
  }
  

  res.json({ received: true });
});
/////////////////////////////////////////////////
//////////////////////////////////////////////\
///////////////////////////////////////
////////////////////////////////////////
///////////////////////////////////////////
/////////////////////////////////////////////
// POST /add-post
app.post("/api/post/add-post", upload.single("image"), async (req, res) => {
  try {
    const { description, userId } = req.body;
    const image = req.file ? req.file.path : null;
    const ad = new Ad({ userId, description, image });
    await ad.save();
    res.status(201).json({ success: true, data: ad });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// Get all ads of a user
app.get("/api/post/posts", async (req, res) => {
  try {
    const userId = req.query.userId;
    const ads = await Ad.find({ userId });
    res.json({ success: true, data: ads });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update ad
app.put("/api/post/posts/:id", upload.single("image"), async (req, res) => {
  try {
    const { description } = req.body;
    const updateData = { description };
    if (req.file) updateData.image = req.file.path;

    const updatedAd = await Ad.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ success: true, data: updatedAd });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete ad
app.delete("/api/post/posts/:id", async (req, res) => {
  try {
    await Ad.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Ad deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ------------------ ADMIN API ------------------

// Get pending ads
app.get("/api/post/admin/pending", async (req, res) => {
  try {
    const ads = await Ad.find({ status: "pending" });
    res.json({ success: true, data: ads });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin route for verifying/rejecting ads
// Admin verifies/rejects ad
// Only JSON body, no file uploads!
// Verify or reject an ad

// Get pending ads
app.get("/api/post/admin/pending", async (req, res) => {
  try {
    const ads = await Ad.find({ status: "pending" });
    res.json({ success: true, data: ads });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Verify or reject ad
app.put("/api/post/admin/verify/:id", async (req, res) => {
  try {
    const { action, message } = req.body;

    if (!action || !["verified", "rejected"].includes(action)) {
      return res.status(400).json({ success: false, message: "Invalid action" });
    }

    const updatedAd = await Ad.findByIdAndUpdate(
      req.params.id,
      { status: action, message: message || "" },
      { new: true }
    );

    if (!updatedAd) {
      return res.status(404).json({ success: false, message: "Ad not found" });
    }

    res.status(200).json({ success: true, data: updatedAd });
  } catch (err) {
    console.error("Error updating ad:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


// Get verified ads
app.get("/api/post/admin/verified", async (req, res) => {
  try {
    const ads = await Ad.find({ status: "verified" });
    res.json({ success: true, data: ads });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get rejected ads
app.get("/api/post/admin/rejected", async (req, res) => {
  try {
    const ads = await Ad.find({ status: "rejected" });
    res.json({ success: true, data: ads });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
/////////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
/////////////////////////////////////
///////////////////////////////////////



// ✅ Nodemailer transporter (Gmail example)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com", // apna email
    pass: "your-app-password",    // Gmail App password (normal password nahi chalega)
  },
});








// ======================
// Add new service
// ======================

// ----- POST /api/services -----
// ----- POST /api/services -----

app.post("/api/services", upload.single("image"), async (req, res) => {
  console.log(req.body)
  try {
    const { name, experience, description, categoryId, productId, subProductId, sId } = req.body;
const sellerId = sId ? new mongoose.Types.ObjectId(sId) : null;

    if (!sellerId) {
      return res.status(400).json({ success: false, message: "SellerId is required" });
    }

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ success: false, message: "Invalid category ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }
    if (subProductId && !mongoose.Types.ObjectId.isValid(subProductId)) {
      return res.status(400).json({ success: false, message: "Invalid subProduct ID" });
    }

    // Check existence
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) return res.status(400).json({ success: false, message: "Category not found" });

    const productExists = await Product.findById(productId);
    if (!productExists) return res.status(400).json({ success: false, message: "Product not found" });

    if (subProductId) {
      const subProductExists = await Subproduct.findById(subProductId);
      if (!subProductExists) return res.status(400).json({ success: false, message: "SubProduct not found" });
    }

    // Upload image if file present
    let uploadedImage = null;
    if (req.file) {
      uploadedImage = req.file.path; // Cloudinary URL from multer storage
    }

    const newService = new Service({
      name,
      experience,
      description,
      category: categoryId,
      product: productId,
      subProduct: subProductId,
      sellerId,
      image: uploadedImage,
    });

    await newService.save();

    res.json({ success: true, data: newService });
  } catch (err) {
    console.error("❌ Service Save Error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});



// Get all services of a seller with populated category/product/subProduct
app.get("/api/services", async (req, res) => {
  try {
    const sellerId = req.query.sellerId;
    if (!sellerId) {
      return res.status(400).json({ message: "Seller ID is required" });
    }

    // Fetch services and populate references
    const services = await Service.find({ sellerId })
      .populate("category", "Title name") // populate category, pick Title or name
      .populate("product", "name Title")  // populate product
      .populate("subProduct", "name");    // populate subProduct

    res.status(200).json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching services" });
  }
});


// ----- GET All Services -----
app.get("/api/servicesSeller", async (req, res) => {
  try {
    const services = await Service.find()
      .populate("category")
      .populate("product")
      .populate("subProduct");
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ----- GET All Services -----
app.get("/api/services", async (req, res) => {
  try {
    const services = await Service.find()
      .populate("category")
      .populate("product")
      .populate("subProduct");
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ======================
// Edit service
// ======================
app.put("/api/services/:id", upload.single("image"), async (req, res) => {
  try {
    const serviceId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ success: false, message: "Invalid service ID" });
    }

    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });

    const { name, experience, description, categoryId, productId, subProductId } = req.body;

    if (name) service.name = name;
    if (experience) service.experience = experience;
    if (description) service.description = description;

    if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) service.category = categoryId;
    if (productId && mongoose.Types.ObjectId.isValid(productId)) service.product = productId;
    if (subProductId && mongoose.Types.ObjectId.isValid(subProductId)) service.subProduct = subProductId;

    if (req.file) service.image = req.file.path;

    await service.save();
    res.json({ success: true, data: service });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ======================
// Delete service
// ======================
app.delete("/api/services/:id", async (req, res) => {
  try {
    const serviceId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ success: false, message: "Invalid service ID" });
    }

    const service = await Service.findByIdAndDelete(serviceId);
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });

    res.json({ success: true, message: "Service deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ======================
// Get only verified services
// ======================
// ======================
// PUT /api/services/:id/verify
// Toggle isVerified flag
// ======================
app.put("/api/services/:id/verify", async (req, res) => {
  try {
    const serviceId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ success: false, message: "Invalid service ID" });
    }

    let service = await Service.findById(serviceId);
    if (!service)
      return res.status(404).json({ success: false, message: "Service not found" });

    // Toggle verify
    service.isVerified = !service.isVerified;
    await service.save();

    // ⚡️Populate related fields
    service = await Service.findById(serviceId)
      .populate("category", "name")
      .populate("product", "name")
      .populate("subProduct", "name");

    res.json({
      success: true,
      data: service,
      message: service.isVerified ? "Service verified" : "Service unverified",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ======================
// GET /api/services/verified
// ======================
app.get("/api/services/verified", async (req, res) => {
  try {
    const services = await Service.find({ isVerified: true })
      .populate("category", "name Title")
      .populate("product", "name Title")
      .populate("subProduct", "name Title");

    res.json({ success: true, data: services });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


////////////////////////
//////////////////
///////////////////
/////////////////////////
///////////////////////////
///////////////////////////

// ===================== Nodemailer Transporter =====================
const createTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Gmail App Password
    },
  });

// ===================== FORGOT PASSWORD =====================
app.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.json({ status: false, message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.json({ status: false, message: "User not found" });

    // Generate token
    const token = crypto.randomBytes(20).toString("hex");
    const expires = Date.now() + 3600000; // 1 hour

    // Push new token to resetTokens array
    if (!user.resetTokens) user.resetTokens = [];
    user.resetTokens.push({ token, expires });
    await user.save();

    console.log("Generated token:", token);
    console.log("Expires at:", new Date(expires));

    // Send email
    const transporter = createTransporter();
    const resetUrl = `http://localhost:5173/reset-password/${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      text: `Click the link to reset your password:\n\n${resetUrl}\n\nThis link expires in 1 hour.`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
        return res.json({ status: false, message: "Error sending email", error: err.toString() });
      }
      console.log("Email sent:", info.response);
      res.json({ status: true, message: "Password reset email sent" });
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.json({ status: false, message: "Internal server error", error: error.toString() });
  }
});


// ===================== RESET PASSWORD =====================
app.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    if (!password) return res.json({ status: false, message: "Password is required" });

    // Find user with this token in the array and check expiry
    const user = await User.findOne({
      "resetTokens.token": token,
      "resetTokens.expires": { $gt: Date.now() },
    });

    if (!user) return res.json({ status: false, message: "Invalid or expired token" });

    // Hash new password
    user.password = await bcryptjs.hash(password, 10);

    // Remove only the used token
    user.resetTokens = user.resetTokens.filter((t) => t.token !== token);
    await user.save();

    console.log(`Password reset successful for: ${user.email}`);
    res.json({ status: true, message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.json({ status: false, message: "Internal server error", error: error.toString() });
  }
});
app.get("/check-token/:token", async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({
    "resetTokens.token": token,
    "resetTokens.expires": { $gt: Date.now() },
  });

  if (!user) {
    return res.json({ status: false, message: "Invalid or expired token" });
  }

  const tokenObj = user.resetTokens.find((t) => t.token === token);
  res.json({ status: true, expires: tokenObj.expires });
});




////////////////////////////////////////////
//////Events/////////////////////
// ---------------- ADMIN MIDDLEWARE ----------------
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "ADMIN";

const adminAuth = (req, res, next) => {
  const { email, password } = req.headers;
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    req.isAdmin = true;
    next();
  } else {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};
// ---------------- USER + ADMIN ROUTES ----------------

// Add Event (user or admin)
app.post("/api/event/add-event", upload.single("image"), async (req, res) => {
  try {
    const { startDate, endDate, time, venue, description } = req.body;
    const image = req.file ? req.file.path : null;

    const { email, password } = req.headers;
    const isAdmin = email === "admin@gmail.com" && password === "ADMIN";
    const status = isAdmin ? "verified" : "pending";

    const event = new Event({ startDate, endDate, time, venue, description, image, status });
    await event.save();

    res.status(201).json({ success: true, data: event });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});



// Get all events
app.get("/api/event/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.json({ success: true, data: events });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update event
app.put("/api/event/events/:id", upload.single("image"), async (req, res) => {
  try {
    const { startDate, endDate, time, venue, description } = req.body;
    const updateData = { startDate, endDate, time, venue, description };
    if (req.file) updateData.image = req.file.path;

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ success: true, data: updatedEvent });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// Delete event
app.delete("/api/event/events/:id", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---------------- ADMIN ONLY ROUTES ----------------

// Get pending events
app.get("/api/event/admin/pending", adminAuth, async (req, res) => {
  try {
    const events = await Event.find({ status: "pending" });
    res.json({ success: true, data: events });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Verify or reject event
app.put("/api/event/admin/verify/:id", adminAuth, async (req, res) => {
  try {
    const { action, message } = req.body;
    if (!action || !["verified", "rejected"].includes(action)) {
      return res.status(400).json({ success: false, message: "Invalid action" });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { status: action, message: message || "" },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.status(200).json({ success: true, data: updatedEvent });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get verified events
app.get("/api/event/admin/verified", adminAuth, async (req, res) => {
  try {
    const events = await Event.find({ status: "verified" });
    res.json({ success: true, data: events });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get rejected events
app.get("/api/event/admin/rejected", adminAuth, async (req, res) => {
  try {
    const events = await Event.find({ status: "rejected" });
    res.json({ success: true, data: events });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});



//////////////////////
/////info msg///////
// POST API - User sends message
app.post("/api/informationBox", async (req, res) => {
  try {
    const { name, email, contact, description } = req.body;
    if (!name || !email || !contact || !description)
      return res.status(400).json({ error: "All fields required" });

    const info = new InformationBox({ name, email, contact, description });
    await info.save();
    res.status(201).json({ success: true, message: "Message sent to Admin", data: info });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET API - Admin fetches all messages
// GET all or by status
app.get("/api/informationBox", async (req, res) => {
  try {
    const { status } = req.query; // optional query param ?status=pending or responded
    let filter = {};
    if (status) filter.status = status;

    const messages = await InformationBox.find(filter).sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// PATCH - Admin marks message as responded
// PATCH - Mark message as responded
app.patch("/api/informationBox/:id/respond", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMessage = await InformationBox.findByIdAndUpdate(
      id,
      { status: "responded" },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json({
      success: true,
      message: "Message marked as responded",
      data: updatedMessage,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


app.delete("/api/informationBox/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await InformationBox.findByIdAndDelete(id);
    res.json({ success: true, message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
/////////////////////////////////
////APP////////////
// POST - create new app
app.post("/api/apps", upload.single("image"), async (req, res) => {
  try {
    const newApp = new AppModel({
      name: req.body.name,
      image: req.file.path, // Cloudinary URL
      link: req.body.link
    });
    await newApp.save();
    res.json(newApp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET - all apps
app.get("/api/apps", async (req, res) => {
  try {
    const apps = await AppModel.find();
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET - single app by ID
app.get("/api/apps/:id", async (req, res) => {
  try {
    const appData = await AppModel.findById(req.params.id);
    if (!appData) return res.status(404).json({ message: "App not found" });
    res.json(appData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT - update app
app.put("/api/apps/:id", upload.single("image"), async (req, res) => {
  try {
    const updatedData = {
      name: req.body.name,
      link: req.body.link
    };
    if (req.file) updatedData.image = req.file.path;

    const updatedApp = await AppModel.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!updatedApp) return res.status(404).json({ message: "App not found" });
    res.json(updatedApp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE - delete app
app.delete("/api/apps/:id", async (req, res) => {
  try {
    const deletedApp = await AppModel.findByIdAndDelete(req.params.id);
    if (!deletedApp) return res.status(404).json({ message: "App not found" });
    res.json({ message: "App deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
/////////////////////////
////////////upload work APIs//////

app.post("/api/workupload", upload.array("images"), async (req, res) => {
  try {
    console.log("👉 Body:", req.body);
    console.log("👉 Files:", req.files);

    const { sellerId, descriptions } = req.body;
    if (!sellerId) {
      return res.status(400).json({ success: false, message: "sellerId is required" });
    }

    let descArray = [];
    if (typeof descriptions === "string") {
      descArray = [descriptions];
    } else {
      descArray = descriptions || [];
    }

    const samples = req.files.map((file, idx) => ({
      imageUrl: file.path,
      description: descArray[idx] || "",
      publicId: file.filename,
    }));

    const newWork = new WorkUpload({ sellerId, samples });
    await newWork.save();

    res.status(201).json({ success: true, work: newWork });
  } catch (err) {
    console.error("❌ Upload Error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Upload failed",
      error: err, // debugging ke liye full error bhej rahe hain
    });
  }
});


/**
 * @route GET /api/workupload/:sellerId
 * @desc Get all work samples for a seller
 */
app.get("/api/workupload/:sellerId", async (req, res) => {
  try {
    const works = await WorkUpload.findOne({ sellerId: req.params.sellerId });
    res.json({ success: true, works });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching works" });
  }
});

/**
 * @route PUT /api/workupload/:id
 * @desc Update a work sample (replace image + description)
 */
app.put("/api/workupload/:id", upload.single("image"), async (req, res) => {
  try {
    const { description } = req.body;
    const work = await WorkUpload.findById(req.params.id);
    if (!work) return res.status(404).json({ success: false, message: "Not found" });

    // if new image uploaded
    if (req.file) {
      if (work.samples[0].publicId) {
        await cloudinary.uploader.destroy(work.samples[0].publicId);
      }
      work.samples[0].imageUrl = req.file.path;
      work.samples[0].publicId = req.file.filename;
    }

    if (description) {
      work.samples[0].description = description;
    }

    await work.save();
    res.json({ success: true, work });
  } catch (err) {
    res.status(500).json({ success: false, message: "Update failed" });
  }
});

/**
 * @route DELETE /api/workupload/:id
 * @desc Delete a work sample
 */
app.delete("/api/workupload/:id", async (req, res) => {
  try {
    const work = await WorkUpload.findById(req.params.id);
    if (!work) return res.status(404).json({ success: false, message: "Not found" });

    for (const sample of work.samples) {
      if (sample.publicId) {
        await cloudinary.uploader.destroy(sample.publicId);
      }
    }

    await WorkUpload.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Work deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
});
