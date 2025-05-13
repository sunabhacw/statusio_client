const express = require("express");
const StatusIOApi = require("statusio").StatusIOApi;

const app = express();
app.use(express.json()); // Use express.json() instead of bodyParser
const API_ID = process.env.STATUSIO_API_ID;
const API_KEY = process.env.STATUSIO_API_KEY;

const api = new StatusIOApi(API_ID, API_KEY);

// Webhook to list components
app.post("/webhook/components/list", (req, res) => {
  const { statusPageId } = req.body;

  api.components.list(statusPageId, (error, data) => {
    if (error) {
      console.error("Error fetching components:", data);
      res.status(500).send({ error: "Failed to fetch components" });
    } else {
      console.log("Components list:", data);
      res.status(200).send(data);
    }
  });
});

// Webhook to update component status
app.post("/webhook/components/status-update", (req, res) => {
  const { component_id, status } = req.body;

  api.components.statusUpdate({ component_id, status }, (error, data) => {
    if (error) {
      console.error("Error updating component status:", data);
      res.status(500).send({ error: "Failed to update component status" });
    } else {
      console.log("Component status updated:", data);
      res.status(200).send(data);
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook server is running on port ${PORT}`);
});

// Export the app for Vercel
module.exports = app;
