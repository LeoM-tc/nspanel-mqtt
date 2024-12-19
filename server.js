const express = require('express');
const mqtt = require('mqtt');
const app = express();
const path = require('path');

// Serve static files from 'public' directory
app.use(express.static('public'));
app.use(express.json());

// Connect to MQTT broker
const client = mqtt.connect('mqtt://10.2.17.32:1883');

client.on('connect', () => {
    console.log('Connected to MQTT broker');
});

// API endpoint to publish messages
app.post('/api/publish', (req, res) => {
    const { state } = req.body;
    client.publish('zigbee2mqtt/nspanel', JSON.stringify({ state }), (err) => {
        if (err) {
            res.status(500).json({ error: 'Failed to publish message' });
        } else {
            res.json({ success: true });
        }
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});