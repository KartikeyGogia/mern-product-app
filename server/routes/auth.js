  const express = require("express");
  const jwt = require("jsonwebtoken");
  const router = express.Router();

  let users = [];

  router.post("/register", (req, res) => {
    const { email, password } = req.body;

    console.log("BODY:", req.body);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    users.push({ email, password });
    return res.status(201).json({
      success: true,
      message: "User registered successfully"
    });
  });

  router.post("/login", (req, res) => {
    const { email, password } = req.body;

    console.log("BODY:", req.body);

    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign({ email }, "secretkey", { expiresIn: "1h" });
    return res.json({
      success: true,
      token
    });
  });

  module.exports = router;
