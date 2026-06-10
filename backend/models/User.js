import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import validator from 'validator'

const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["customer", "admin"],
        default: "customer"
    }
});

userSchema.statics.signUp = async function(username, email, password, role="customer") { // defaults to customer
    const userExists = await this.findOne({username});
    const emailExists = await this.findOne({email});

    if (userExists) {
        throw Error('Username is taken');
    }

    if (emailExists) {
        throw Error('Email already in use');
    }

    if (!username || !email || !password) {
        throw Error('All fields must be filled');
    }
    if (!validator.isEmail(email)) {
        throw Error('Email is invalid');
    }

    if (!validator.isStrongPassword(password)) {
        throw Error('Password is not strong enough');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.create({username, email, password: hashedPassword, role});
    
    return user;
}

userSchema.statics.login = async function (username, email, password, role) {

    if (!username && !email || !password) {
        throw Error('All fields must be filled');
    }
    const user = await this.findOne({username}) || await this.findOne({email});

    if (!user) {
        throw Error('Incorrect username or email');
    }

    if (role && user.role !== role) {
        throw Error('Incorrect Login Portal');
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw Error('Incorrect password');
    }

    return user;
}

export default mongoose.model('User', userSchema);