const express = require('express');
const Payment = require('../models/Payments'); 

const router = express.Router();

// Get all payments
router.get('/', async (req, res) => {
    try {
        const payments = await Payment.find();
        res.json(payments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a specific payment
router.get('/:id', getPayment, (req, res) => {
    res.json(res.payment);
});

// Create a new payment
router.post('/', async (req, res) => {
    const payment = new Payment({
        amount: req.body.amount,
        method: req.body.method,
        date: req.body.date
    });

    try {
        const newPayment = await payment.save();
        res.status(201).json(newPayment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a payment
router.patch('/:id', getPayment, async (req, res) => {
    if (req.body.amount != null) {
        res.payment.amount = req.body.amount;
    }
    if (req.body.method != null) {
        res.payment.method = req.body.method;
    }
    if (req.body.date != null) {
        res.payment.date = req.body.date;
    }

    try {
        const updatedPayment = await res.payment.save();
        res.json(updatedPayment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a payment
router.delete('/:id', getPayment, async (req, res) => {
    try {
        await res.payment.remove();
        res.json({ message: 'Deleted Payment' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware to get payment by ID
async function getPayment(req, res, next) {
    let payment;
    try {
        payment = await Payment.findById(req.params.id);
        if (payment == null) {
            return res.status(404).json({ message: 'Cannot find payment' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.payment = payment;
    next();
}

module.exports = router;