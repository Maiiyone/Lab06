const amqp = require('amqplib');
const { faker } = require('@faker-js/faker');

const RABBITMQ_URL = 'amqp://localhost';
const QUEUE = 'messages';

let connection;
let channel;

async function initRabbitMQ() {
    try {
        console.log('Connecting to RabbitMQ...');
        connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        await channel.assertQueue(QUEUE);
        console.log('RabbitMQ connected and queue asserted (Producer 1)');
    } catch (error) {
        console.error('Error initializing RabbitMQ:', error);
    }
}

function generateFakeMessage() {
    return {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        content: faker.lorem.sentence(),
        timestamp: new Date().toISOString(),
        producer: 'Producer 1' // Thêm dấu hiệu để nhận biết
    };
}

async function sendMessage(message) {
    try {
        if (!channel) {
            throw new Error('Channel is not initialized');
        }
        channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(message)));
        console.log(`Message sent by Producer 1: ${JSON.stringify(message)}`);
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

function startAutoProducer() {
    console.log('Starting auto-producer for Producer 1...');
    setInterval(async () => {
        const fakeMessage = generateFakeMessage();
        await sendMessage(fakeMessage);
    }, 5000);
}

async function closeRabbitMQ() {
    try {
        console.log('Closing RabbitMQ connection (Producer 1)...');
        if (channel) await channel.close();
        if (connection) await connection.close();
        console.log('RabbitMQ connection closed.');
    } catch (error) {
        console.error('Error closing RabbitMQ connection:', error);
    }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
    await closeRabbitMQ();
    process.exit(0);
});

// Initialize and start Producer 2
(async () => {
    await initRabbitMQ();
    startAutoProducer();
})();
