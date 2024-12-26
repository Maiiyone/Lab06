require('dotenv').config();
const amqp = require('amqplib');
const express = require('express');
const bodyParser = require('body-parser')
const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');
const app = express();
app.use(bodyParser.json());

const RABBITMQ_URL = 'amqp://localhost';
const QUEUE = 'messages';
const MONGO_URI = 'mongodb://localhost:27017/rabbitmq_example'

// MongoDB connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));


// Define a Message Schema
const messageSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    content: { type: String, required: true },
    metadata: { type: Object, required: false },
    timestamp: { type: Date, required: true },
});
const Message = mongoose.model('Message', messageSchema);



async function consumeMessages() {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE);
    console.log(`Waiting for messages in ${QUEUE}...`);
    channel.consume(QUEUE, async (msg) => {
        if (msg !== null) {
            const messageContent = JSON.parse(msg.content.toString());
            console.log('Message received:', messageContent);
            try {
                const savedMessage = await Message.create({
                    ...messageContent,
                    metadata: { source: 'RabbitMQ', priority: 'High' },
                });

                console.log('Message saved to MongoDB:', savedMessage);
            } catch (err) {
                console.error('Error saving message to MongoDB:', err);
            }
        }
        channel.ack(msg);
    })
}

consumeMessages().catch(console.error);








const PORT = 3000;
app.listen(PORT, async () => {
    console.log(`Producer running on http://${process.env.HOST}:${PORT}`);
   
})