const express = require('express');
const app = express();
const PORT = 3000; // Choose any port you like

// Middleware to parse JSON bodies
app.use(express.json());

// Data Store (array to store items)
let items = [];

// POST route to add a new item
app.post('/items', (req, res) => {
    const newItem = req.body;
    console.log('item recieved',newItem)
    if (!newItem.name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    newItem.id = Date.now(); // Assigning a unique identifier
    items.push(newItem);
    res.status(201).json(newItem);
});

// GET route to list all items
app.get('/items', (req, res) => {
    res.json(items);
});

// GET route to retrieve a single item by its identifier
app.get('/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    const item = items.find(item => item.id === itemId);
    if (!item) {
        return res.status(404).send('Item not found');
    }
    res.json(item);
});

// PUT route to update an item by its identifier
app.put('/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    let updatedItem = req.body;
    let itemIndex = items.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
        // Update only the fields that are provided in the request body
        items[itemIndex] = { ...items[itemIndex], ...updatedItem };
        res.json(items[itemIndex]);
    } else {
        res.status(404).send('Item not found');
    }
});

// DELETE route to delete an item by its identifier
app.delete('/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    items = items.filter(item => item.id !== itemId);
    res.status(204).send();
});

// Error handling middleware
app.use((err, req, res) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
