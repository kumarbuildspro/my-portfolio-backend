const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Frontend ko connect karne ke liye

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://test:test1234@cluster0.mongodb.net/portfolio?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch((err) => console.log('DB Connection Error:', err));

// Schema & Model (Contact Form Data Structure)
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// Test Route
app.get('/', (req, res) => {
  res.send('Portfolio Backend API is Running!');
});

// Contact API Route (Form submit hone par data save hoga)
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    if(!name || !email || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newContact = new Contact({ name, email, message });
    await newContact.save();

    res.status(201).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

