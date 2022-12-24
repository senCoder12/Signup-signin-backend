import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv"
import PasswordValidator from 'password-validator';
import generator from 'generate-password';
import userModel from '../Modals/user.model.js';

var schema = new PasswordValidator();
schema
.is().min(8)     
.has().uppercase()                             
.has().lowercase()                          
.has().digits(1) 
dotenv.config();

const hasSpecialChar = (password)=>  {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(password);
}

export const signup =  async (req, res) => {
    const {email, password, first_name, last_name, mobile, status, role} = req.body;
    try {
        let oldUser = await userModel.findOne({email});
        if (oldUser) {
            return res.status(400).json({message: "Email already exists"});
        }
        oldUser = await userModel.findOne({mobile});
        if (oldUser) {
            return res.status(400).json({message: "Mobile number already exists"});
        }

        if(!schema.validate(password) || !hasSpecialChar(password)) {
            return res.status(400).json({message: "password should contain 8 characters, min one special character, one upper case character, one lower case character and one number"});
        }
        if(mobile.length == 10) {
            return res.status(400).json({message: "Mobile number should be 10 number"});
        }

        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = await userModel.create({
            uid: generator.generate({
                length: 13,
                numbers: true
              }),
            first_name,
            last_name,
            email,
            mobile,
            role: role.toLowerCase(),
            status: status.toLowerCase(),
            password: hashedPassword
        });
        res.status(201).json({
            message: "Account successfully created"
        }) 
    } catch (err) {
        console.log(err)
        res.status(500).send({
            "message": "signup failed"
        })
    }
}

export const signin =  async (req, res) => {
    try {
        const {email, password,role} = req.body;
        const user = await userModel.find({email,role});
        if(user && user.length == 1) {
            const isValidPassword = await bcrypt.compare(password,user[0].password);
            if(isValidPassword) {
                const token = jwt.sign({
                    uid: user[0].uid,
                    email,
                },process.env.JWT_SECRET_KEY,{
                    expiresIn: "30d"
                })
                res.status(200).send({
                    token,
                    data: user[0],
                    "message": "Login successful"
                })
            }else {
                res.status(501).send({
                    "message": "Password is not valid"
                })
            }
        }else {
            res.status(501).send({
                "message": "Wrong credential"
            })
        }
    } catch (err) {
        console.log(err)
        res.status(500).send({
            "message": "Something went wrong"
        })
    }
}


const secret_key = process.env.JWT_SECRET_KEY;
export const getUserByJWT = async(req,res)=> {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        const decodedData = jwt.verify(token,secret_key);
        const uid = decodedData?.uid;
        const user = await userModel.findOne({uid}).select(["-password","-createdAt","-updatedAt"]);
        res.status(200).send({user});
    } catch (error) {
        res.status(401).send({
            "message": "Invalid token/Expired token"
        })
    }
}

export const getAllUser = async(req,res)=> {
    try {
        const user = await userModel.find().select(["-password","-createdAt","-updatedAt"]);
        res.status(200).send({user});
    } catch (error) {
        res.status(401).send({
            "message": "Something went wrong"
        })
    }
}