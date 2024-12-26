require("dotenv").config();
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const bodyParser = require("body-parser");
const authRouter=require('./routes/auth-routes');
const testRouter=require('./routes/test-routes');
const db = require("./db");
const swaggerJSDoc = require("swagger-jsdoc");

const { swaggerOptions } = require("./configs/swagger");
const { verifyToken } = require("./Controllers/auth-controller");

//routes


const app = express();
app.use(bodyParser.json());

//constants
const HOST = process.env.HOST;
const PORT = process.env.PORT || 3000;

db.connect((err) => {
  if (err) {
    console.log("Error connecting to the database");
    return;
  }
  console.log("Connected to the database");
});

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api/auth",authRouter);
app.use("/api/admin",testRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(3000, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
