const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource'); // Adjust the path as needed
const axios = require('axios');

// Create a new resource
router.post('/',  async (req, res) => {
  const { resourceName, type, quantity, location, expirationDate } = req.body;

  try {
    const newResource = new Resource({
      resourceName,
      type,
      quantity,
      location,
      expirationDate,
      provider: req.userId
    });
    await newResource.save();
    res.status(201).json("Resource created successfully");
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Update an existing resource by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedResource = await Resource.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!updatedResource) return res.status(404).json("Resource not found");
    res.status(200).json("Resource updated successfully");
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Get a resource by ID
router.get('/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json("Resource not found");
    res.status(200).json(resource);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Get all resources
router.get('/', async (req, res) => {
  try {
    const resources = await Resource.find();
    res.status(200).json(resources);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.get('/nearby', async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = process.env.api_Key;

  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=5000&type=resource&key=${apiKey}`);
    res.status(200).json(response.data.results);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.get('/search', async (req, res) => {
  const { type, location, quantity } = req.query;

  try {
    const query = {};
    if (type) query.type = type;
    if (location) query.location = location;
    if (quantity) query.quantity = { $gte: quantity };

    const resources = await Resource.find(query);
    res.status(200).json(resources);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;