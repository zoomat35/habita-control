const fetch = require("node-fetch");

async function publish(topic, value) {
  const AIO_USERNAME = process.env.AIO_USERNAME;
  const AIO_KEY = process.env.AIO_KEY;

  const url = `https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/${topic}/data`;

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "X-AIO-Key": AIO_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ value }),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Error al publicar: ${errText}`);
  }
}

module.exports = publish;
