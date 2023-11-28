const mongoose = require('mongoose');
const { MONGODB } = require('../config/index');

const connString = MONGODB;

const dbConnect = async ()=>{
try {
    const conn = await mongoose.connect(connString);
    console.log(`Database connected to host: ${conn.connection.host}`);
} catch (error) {
 console.log(`Error: ${error}`);   
}}

module.exports = dbConnect;