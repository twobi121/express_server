const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userSchema = new mongoose.Schema({
    login: {
        type: String,
        unique:true,
        required: true,
        trim: true
    },
    name: {
        type: String,
    },
    surname: {
        type: String,
    },
    password: {
        type: String,
        minlength: 2,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    email: {
        type: String,
    },
    birth_year: {
        type: Number,
    },
    phone: {
        type: String,
    },
    avatar: {
        type: Object,
        default: {filename: 'avatar-default.png'}
    },
    tokens: [{
        token: {
            type: String,

        }
    }],

})

userSchema.statics.findByCredentials = async (login, password) => {
    const user = await User.findOne({login: login.toLowerCase()});
    if(!user) {
        throw new Error('Неверный логин или пароль');
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Неверный логин или пароль');
    }

    return user;
}

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({_id: user._id.toString() }, process.env.SECRET_KEY);
    user.tokens = user.tokens.concat({ token });
    user.save();

    return token;
}

userSchema.pre('save', async function(next){
    const user = this;
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    this.name.charAt(0).toUpperCase() + this.name.slice(1);
    this.surname.charAt(0).toUpperCase() + this.name.slice(1);
    next();
})


const User = mongoose.model('User', userSchema);

module.exports = User;

