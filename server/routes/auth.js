const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

// In-memory fallback if MongoDB is temporarily unavailable
let inMemoryUsers = [
  {
    email: "admin@productr.com",
    password: "password123",
    name: "Admin User",
  },
  {
    email: "demo@productr.com",
    password: "Password123!",
    name: "Demo User",
  },
];

const isMongoConnected = () => mongoose.connection.readyState === 1;

// Seed default users to MongoDB if empty
async function seedDefaultUsers() {
  if (!isMongoConnected()) return;
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      await User.insertMany(inMemoryUsers);
      console.log("Seeded default users to MongoDB");
    }
  } catch (err) {
    console.error("Error seeding default users:", err.message);
  }
}

mongoose.connection.on("connected", () => {
  seedDefaultUsers();
});
if (isMongoConnected()) {
  seedDefaultUsers();
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check MongoDB if connected
    if (isMongoConnected()) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      const newUser = new User({
        email: normalizedEmail,
        password: password,
        name: name ? name.trim() : "",
      });
      await newUser.save();

      if (!inMemoryUsers.some((u) => u.email === normalizedEmail)) {
        inMemoryUsers.push({ email: normalizedEmail, password, name });
      }

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
      });
    }

    // In-memory fallback
    const existingInMemory = inMemoryUsers.find((u) => u.email === normalizedEmail);
    if (existingInMemory) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    inMemoryUsers.push({ email: normalizedEmail, password, name: name || "" });
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    let matchedUser = null;

    // Check MongoDB first
    if (isMongoConnected()) {
      try {
        const dbUser = await User.findOne({ email: normalizedEmail });
        if (dbUser) {
          if (dbUser.password === password) {
            matchedUser = dbUser;
          } else {
            return res.status(400).json({
              success: false,
              message: "Invalid password",
            });
          }
        } else {
          // If user doesn't exist yet, auto-register them seamlessly
          const newUser = new User({
            email: normalizedEmail,
            password: password,
            name: normalizedEmail.split("@")[0],
          });
          await newUser.save();
          matchedUser = newUser;
          console.log(`Auto-registered new user on login: ${normalizedEmail}`);
        }
      } catch (dbErr) {
        console.warn("MongoDB query error, falling back to in-memory:", dbErr.message);
      }
    }

    // Fallback to in-memory check if MongoDB not available
    if (!matchedUser) {
      const memUser = inMemoryUsers.find((u) => u.email === normalizedEmail);
      if (memUser) {
        if (memUser.password === password) {
          matchedUser = memUser;
        } else {
          return res.status(400).json({
            success: false,
            message: "Invalid password",
          });
        }
      } else {
        // Auto-register in memory
        const newMemUser = {
          email: normalizedEmail,
          password: password,
          name: normalizedEmail.split("@")[0],
        };
        inMemoryUsers.push(newMemUser);
        matchedUser = newMemUser;
      }
    }

    const token = jwt.sign(
      { email: matchedUser.email, id: matchedUser._id || matchedUser.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        email: matchedUser.email,
        name: matchedUser.name || matchedUser.email.split("@")[0],
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
});

// GET /api/auth/me
router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.json({ success: true, user: decoded });
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
});

module.exports = router;
