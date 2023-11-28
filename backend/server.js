const express = require("express");
const dbConnect = require('./database/index');
const router = require("./routes/index");
const errorHandler = require("./middleware/errorHandling");
const { PORT } = require("./config/index");
const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser());

app.use(cookieParser());

app.use(express.json());

app.use(router);

dbConnect();

app.use(errorHandler);

app.listen(PORT, console.log(`Server is runnung on port ${PORT}`));