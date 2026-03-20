import{ User } from '../model/user.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import jwtConfig from './jwt.js';



export const signup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    //console.log(firstName,lastName,email,password);

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try{
        const user=await User.findOne({email:email})
        if(user){
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashPassword=await bcrypt.hash(password,10)
        const newUser=new User({
            firstName,
            lastName,
            email,
            password: hashPassword
        });
        await newUser.save()
        res.status(201).json({ message: 'User created successfully' });

    }
    catch(error){
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Internal server error' });
    }


    //console.log("signup function.....");
    // Implementation for signup
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try{
        const user=await User.findOne({email:email})
        if(!user){
            return res.status(403).json({ message: 'Invalid credentials' });
        }
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(403).json({ message: 'Invalid credentials' });
        } 
        // Generate JWT token
        const token = jwt.sign({id:user._id},jwtConfig.JWT_SECRET,{ // Use the new jwtConfig and JWT_SECRET
            expiresIn: "1d"
        })
        const cookieOptions = {
            expires:new Date(Date.now()+24*60*60*1000),
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:"Lax" // Changed to Lax for better compatibility, or keep strict if preferred
        }
        res.cookie("jwt",token,cookieOptions);
        // Exclude password from the user object before sending it to the client
        const userObject = user.toObject(); // Convert Mongoose document to plain JavaScript object
        const { password: _, ...userWithoutPassword } = userObject;
        res.status(200).json({ message: 'Login successful', user: userWithoutPassword, token });
    }
     catch(error){
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
   
    //console.log("login function.....");
    // Implementation for login
};

export const logout = (req, res) => {
    //console.log("logout function.....");
    // Implementation for logout
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "Lax"
        });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Error during logout:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};