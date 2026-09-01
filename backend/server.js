const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

// Startseite des Backends.
app.get("/", (req, res) => {
  res.send("Kanban Board Backend läuft im Entwicklungsmodus!");
});

const taskRoutes = require("./routes/taskRoutes");
app.use("/api/tasks", taskRoutes);

const boardRoutes = require("./routes/boardRoutes");
app.use("/api/boards", boardRoutes);

const columnRoutes = require("./routes/columnRoutes");
app.use("/api/columns", columnRoutes);

// Server starten.
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB verbunden ✅");
    app.listen(PORT, () => {
      console.log(`Server läuft auf http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB Verbindung fehlgeschlagen:", error.message);
  });
