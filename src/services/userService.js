const User = require('../models/usermodel')
const bcrypt = require('bcrypt');
const jwtProvider = require('../config/jwtProvider')

const createUser = async (userData) => {
    try {
        let { firstName, lastName, email, password } = userData;
        const isUserExist = await User.findOne({ email });
        if (isUserExist) {
            throw new Error("User already exists :", email)
        }
        password = await bcrypt.hash(password, 10);
        const user = await User.create({ firstName, lastName, email, password })
        console.log("created user :", user);
        return user;
    } catch (error) {
        throw new Error(error.message)

    }
}
const findUserById = async (userId) => {
    try {
        const user = await User.findById(userId).populate("address") ;
        if (!user) {
            throw new Error("user not found with id :", userId)
        }
        return user;

    } catch (error) {
        throw new Error(error.message)

    }
}
const getUserByEmail = async (email) => {
    try {
        const user = await User.findOne(email);
        if (!user) {
            throw new Error("user not found with email :", email)
        }
        return user;

    } catch (error) {
        throw new Error(error.message)

    }
}
const getUserProfileByToken = async (token) => {
    try {
        const userId = jwtProvider.getUserIdFromToken(token);
        const user = await findUserById(userId)
        if (!user) {
            throw new Error("user not found with email :", email)
        }
        return user;

    } catch (error) {
        throw new Error(error.message)

    }
}
const getAllUsers = async () => {
    try {

        const users = await User.find();
        return users;

    } catch (error) {
        throw new Error(error.message)

    }
}


module.exports = { createUser, getUserByEmail, findUserById, getUserProfileByToken, getAllUsers }