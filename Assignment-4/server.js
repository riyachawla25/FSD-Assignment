const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = 3000;
const DATA_FILE = path.join(__dirname, "requests.json");

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Read data from requests.json
function readRequests() {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(data);
}

// Write data to requests.json
function writeRequests(requests) {
    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(requests, null, 2)
    );
}


// 1. GET - Get all requests
app.get("/api/requests", (req, res) => {
    const requests = readRequests();
    res.json(requests);
});


// 2. GET - Get request by ID
app.get("/api/requests/:id", (req, res) => {
    const requests = readRequests();
    const id = parseInt(req.params.id);

    const request = requests.find(r => r.id === id);

    if (!request) {
        return res.status(404).json({
            message: "Request not found"
        });
    }

    res.json(request);
});


// 3. POST - Add a new request
app.post("/api/requests", (req, res) => {
    const requests = readRequests();

    const newRequest = {
        id: requests.length > 0
            ? requests[requests.length - 1].id + 1
            : 1,

        studentName: req.body.studentName,
        email: req.body.email,
        category: req.body.category,
        description: req.body.description,
        priority: req.body.priority
    };

    requests.push(newRequest);

    writeRequests(requests);

    res.status(201).json(newRequest);
});


// 4. PUT - Update a request
app.put("/api/requests/:id", (req, res) => {
    const requests = readRequests();
    const id = parseInt(req.params.id);

    const index = requests.findIndex(r => r.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Request not found"
        });
    }

    requests[index] = {
        id: id,
        studentName: req.body.studentName,
        email: req.body.email,
        category: req.body.category,
        description: req.body.description,
        priority: req.body.priority
    };

    writeRequests(requests);

    res.json(requests[index]);
});


// 5. DELETE - Delete a request
app.delete("/api/requests/:id", (req, res) => {
    const requests = readRequests();
    const id = parseInt(req.params.id);

    const index = requests.findIndex(r => r.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Request not found"
        });
    }

    requests.splice(index, 1);

    writeRequests(requests);

    res.json({
        message: "Request deleted successfully"
    });
});


// Start server
app.listen(PORT, () => {
    console.log(`Campus Help Desk running at http://localhost:${PORT}`);
});