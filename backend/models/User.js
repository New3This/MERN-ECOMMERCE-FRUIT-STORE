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
    }
});

userSchema.statics.signUp = async function(username, email, password) {
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

    const user = await this.create({username, email, password: hashedPassword});
    
    return user;
}
export default mongoose.model('User', userSchema);