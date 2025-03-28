const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/gym';

module.exports = {
    PORT,
    MONGO_URI
};