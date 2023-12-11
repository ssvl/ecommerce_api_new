require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const AppError = require('./utils/appError');
const cors = require('cors');
const bodyParser = require('body-parser');


const addCategoryRoutes = require('./Routes/MainCategory.routes');
const subCategoryRoutes = require('./Routes/SubCategory.routes');
const addProductRoutes = require('./Routes/product.routes');



const Database_Url = process.env.Database_Url || 'mongodb://localhost:27017/ecommerce';
const PORT = process.env.PORT || 4200;

mongoose.connect(Database_Url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("connected to the database"))
  .catch((err) => console.log(err.message));

const app = express();

app.use("/public", express.static(__dirname + "/public"))
app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));
app.use(cookieParser());
app.use('/api/v1/uploads', express.static('uploads'));
app.use(cors({
  withCredentials: true,
  origin: ['*', 'http://localhost:3000','http://localhost:3001']
}));

app.use('/api/v1', addCategoryRoutes);
app.use('/api/v1', subCategoryRoutes);
app.use('/api/v1', addProductRoutes);


app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});


app.listen(PORT, () => {
  console.log(`server started on port: ${PORT}`);
});

// public static final String BASE_URL = "http://phpstack-921939-3200340.cloudwaysapps.com/";