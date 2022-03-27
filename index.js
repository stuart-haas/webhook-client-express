require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const validateSignature = async (req, res, next) => {
    const signature = req.header('Signature');
    const hmac = crypto.createHmac('sha256', process.env.WEBHOOK_SECRET).update(JSON.stringify(req.body)).digest('hex');
    if(signature != hmac) {
        return next(new Error('Invalid signature'));
    }
    return next();
};

app.post('/api/domains/autorenew', validateSignature, (req, res) => {
    console.log(req.body);
    res.json(req.body);
});

app.post('/api/domains/expiring', validateSignature,  (req, res) => {
    console.log(req.body);
    res.json(req.body);
});

app.post('/api/domains/expired', validateSignature,  (req, res) => {
    console.log(req.body);
    res.json(req.body);
});

app.post('/api/domains/transfer/pending', validateSignature, (req, res) => {
    console.log(req.body);
    res.json(req.body);
});

app.post('/api/domains/transfer/cancelled', validateSignature, (req, res) => {
    console.log(req.body);
    res.json(req.body);
});

app.post('/api/domains/transfer/approved', validateSignature, (req, res) => {
    console.log(req.body);
    res.json(req.body);
});

app.post('/api/domains/transfer/rejected', validateSignature, (req, res) => {
    console.log(req.body);
    res.json(req.body);
});

app.use((error, req, res, next) => {
    const { message } = error;
    console.log(message);
    res.status(400).json({ message });
});

app.listen(3000, () => {
    console.log(`App listening on port ${port}`);
});