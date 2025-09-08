import User from './models/User.js'
import bcrypt from 'bcrypt'
import connectToDatabase from './db/db.js'

const userRegister = async () => {
    connectToDatabase()
    try {
        const hashPassword = await bcrypt.hash("admin11", 10)
        const newUser = new User({
            name: "Admin",
            email: "admin22@gmail.com",
            password: hashPassword,
            role: "admin"
        })
        await newUser.save()
        console.log("Admin User Created")
    } catch(error) {
        console.log(error)
    }
}

userRegister();