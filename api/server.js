const express = require('express');
const path = require('path');
require('dotenv').config();
const app = express();
const publish = require('./publish');

const horarios = [];
const estadosActuales = {};

app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));

app.post("/api/publish", async (req, res) => {
  const { topic, value } = req.body;
  if (!topic || value === undefined) return res.status(400).json({ error: "Faltan parámetros" });

  try {
    await publish(topic, value);
    estadosActuales[topic] = String(value);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/schedule", (req, res) => {
  const { topic, onTime, offTime } = req.body;
  if (!topic || !onTime || !offTime) return res.status(400).json({ success: false });

  horarios.push({ topic, onTime, offTime });
  console.log("Horario guardado:", { topic, onTime, offTime });
  res.json({ success: true });
});

app.get("/api/status", (req, res) => {
  const resultado = Object.entries(estadosActuales).map(([topic, estado]) => ({ topic, estado }));
  res.json(resultado);
});

setInterval(() => {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM

  horarios.forEach(({ topic, onTime, offTime }) => {
    if (currentTime === onTime) {
      console.log(`Encendiendo ${topic} por horario`);
      publish(topic, 1);
      estadosActuales[topic] = "1";
    }
    if (currentTime === offTime) {
      console.log(`Apagando ${topic} por horario`);
      publish(topic, 0);
      estadosActuales[topic] = "0";
    }
  });
}, 60000);

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
