const express = require('express');
const router = express.Router();
const NGO = require('../models/NGO'); 

// Create a new NGO
router.post('/', async (req, res) => {
    try {
        const newNgo = new NGO(req.body); 
        const savedNgo = await newNgo.save(); 
        res.status(201).json(savedNgo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all NGOs
router.get('/', async (req, res) => {
    try {
        const ngos = await NGO.find(); 
        res.status(200).json(ngos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a specific NGO by ID
router.get('/:id', async (req, res) => {
    try {
        const ngo = await NGO.findById(req.params.id); // Fetch NGO by ID
        if (!ngo) return res.status(404).json({ message: 'NGO not found' });
        res.status(200).json(ngo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Update an NGO by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedNgo = await NGO.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedNgo) return res.status(404).json({ message: 'NGO not found' });
        res.status(200).json(updatedNgo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete an NGO by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedNgo = await NGO.findByIdAndDelete(req.params.id);
        if (!deletedNgo) return res.status(404).json({ message: 'NGO not found' });
        res.status(204).send(); 
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Search NGOs by name
router.get('/search/:name', async (req, res) => {
    try {
        const name = req.params.name.toLowerCase();
        const ngos = await NGO.find({ NGOName: { $regex: name, $options: 'i' } }); // Case-insensitive search by name
        res.status(200).json(ngos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
