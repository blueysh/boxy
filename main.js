const express = require("express");
const request = require("request");

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/use", (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res
      .status(400)
      .json({ type: "error", message: "Missing URL parameter" });
  }

  request({ url: url }, (error, response, body) => {
    if (error) {
      return res.status(500).json({ type: "error", message: error.message });
    }

    if (response.statusCode !== 200) {
      return res.status(response.statusCode).json({
        type: "error",
        message: `Request failed with status code ${response.statusCode}`,
      });
    }

    try {
      res.json(JSON.parse(body));
    } catch {
      res
        .status(500)
        .json({
          type: "error",
          message:
            "Failed to parse JSON. Is the type of the expected request valid JSON?",
        });
    }
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`listening on ${PORT}`));
