const express = require('express');
const mqtt = require('mqtt');
const app = express();
const path = require('path');

// Serve static files from 'public' directory
app.use(express.static('public'));
app.use(express.json());

// Connect to MQTT broker with new address
const client = mqtt.connect('mqtt://10.2.7.30:1883');

client.on('connect', () => {
    console.log('Connected to MQTT broker');
});

// API endpoint to publish messages with updated topic and payload structure
app.post('/api/publish', (req, res) => {
    const { state, brightness } = req.body;
    const payload = brightness !== undefined ? 
        { state, brightness: parseInt(brightness) } : 
        { state };
        
    client.publish('zigbee2mqtt/Z2Dali/set', JSON.stringify(payload), (err) => {
        if (err) {
            res.status(500).json({ error: 'Failed to publish message' });
        } else {
            res.json({ success: true });
        }
    });
});

app.listen(3000, '0.0.0.0', () => {
    console.log('Server running on http://0.0.0.0:3000');
});