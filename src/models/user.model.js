const mongoose = require('mongoose');
const PasswordUtil = require('../libs/passwordUtil');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }


},
    {
        timestamps: true
    }
);

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        // Hash the password before saving
        this.password = await PasswordUtil.hashPassword(this.password);
    }
    next();
});

module.exports = mongoose.model('User', userSchema);