require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const app = express();
const port = 3000;

const { OnePasswordConnect } = require('@1password/connect');

const op = OnePasswordConnect({
    serverURL: 'http://localhost:8080',
    token: process.env.OP_ACCESS_TOKEN,
    keepAlive: true,
});

const getSecret = async (title) => {
    try {
        const item = await op.getItemByTitle(process.env.OP_VAULT_ID, title);
        return item.fields[0].value;
    } catch(error) {
        console.log(error);
    }
}

app.use(cors());
app.use(express.json());

const validateSignature = async (req, res, next) => {
    const signature = req.header('Signature');
    const hmac = crypto.createHmac('sha256', await getSecret("Webhook Secret")).update(JSON.stringify(req.body)).digest('hex');
    if(signature != hmac) {
        return next(new Error('Invalid signature'));
    }
    return next();
};

app.post('/api/domains/autorenew', validateSignature, (req, res, next) => {
    console.log(req.body);
    res.json(req.body);
});

app.post('/api/domains/expiring', validateSignature,  (req, res, next) => {
    console.log(req.body);
    res.json(req.body);
});

app.use((error, req, res, next) => {
    const { message } = error;
    res.status(400).json({ message });
});

app.listen(3000, () => {
    console.log(`App listening on port ${port}`);
});