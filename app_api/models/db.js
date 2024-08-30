const mongoose = require('mongoose');
const readLine = require('readline');
require('dotenv').config();

const dbURI = process.env.DB_URI || 'mongodb://127.0.0.1:27017/travlr';
//mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
const connect = () => {
    mongoose.connect(process.env.DB_URI, )
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('Mongoose connection error: ', err));
    
  };

mongoose.connection.on('connected', () => {
    console.log(`Mongoose connected to ${dbURI}`);
});

mongoose.connection.on('error', err => {
    console.log('Mongoose connection error: ', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

if (process.platform === 'win32') {
    const r1 = readLine.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    r1.on('SIGINT', () => {
        process.emit("SIGINT");
    });
}

const gracefulShutdown = (msg) => {
    mongoose.connection.close(() => {
        console.log(`Mongoose disconnected through ${msg}`);
    });
};

process.once('SIGUSR2', () => {
    gracefulShutdown('nodemon restart');
    process.kill(process.pid, 'SIGUSR2');
});

process.on('SIGINT', () => {
    gracefulShutdown('app termination');
    process.exit(0);
});

process.on('SIGTERM', () => {
    gracefulShutdown('app shutdown');
    process.exit(0);
});

connect();

require('./users');
require('./travlr');
