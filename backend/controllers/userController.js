const {userModel} = require('../models/userSchema')
const saltRounds = 10;
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/Token');
const jwt = require('jsonwebtoken');



const getUser = (req, res) =>{
if(!req.user){
    return res.status(400).json({error:true,message:'User not found'})
}
try{
    return res.status(200).json({error:false,message:{username: req.user.userName}})
  }catch(err){
   res.status(400).json({error:true,message:err.message})
  }
}

const login = async (req, res) => {
    console.log("check")
    try{
        const userName = req.body.userName;
        const passWord = req.body.password;
        console.log(userName,passWord)
        if(userName!="" && passWord!=""){
            const user = await userModel.findOne({userName:userName})
            if(!user){
              return  res.status(500).json({error:true,message:"User Not Found"})
            }    
            const passwordMatch  =  await bcrypt.compare(passWord,user.password);
            if(passwordMatch){
               const authToken = await generateToken(userName,"user");
               if(authToken === ""){
                return res.status(400).json({error:true, message:"auth token not generated"});
               }
               return res.status(200).json({error:false,message:{token:authToken,userType: "user"}})
            }
            else{
                return res.status(500).json({error:true,message:"Password not Matching"})
            }
        }
        else{
            return res.status(500).json({error:true,message:"Enter UserName and PassWord"})
        }

    }
    catch(e){
        return res.status(404).json({error:true,message:e.message})

    }
}

const signup = async(req, res) =>{
    const userName = req.body.userName;
    const email = req.body.email;
    const password = req.body.password;
    console.log(req.body)
    if(userName == "" || password == "" || email == ""){
        return res.status(401).json({error: true, message:"invalid credentials"})
    }
    if(userName == undefined || password == undefined || email == undefined){
        return res.status(401).json({error: true, message:"invalid credentials"})
    }
    try{
        const response = await userModel.findOne({userName:userName});
        if(response){
            return res.status(401).json({error: true, message:"User Name already exists"});
        }
        const hashPassword = await bcrypt.hash(password, saltRounds);
        const authToken = await generateToken(userName,"user");
        try{
            const doc = await userModel.create({userName: userName, password: hashPassword, email: email,token:authToken})
            console.log(doc)
            if(doc){
                return res.status(200).json({error:false, message:{token : authToken}});
            }
        }
        catch(err){
            console.log(err.message)
            return res.status(500).json({error:true, message: err.message})
        }
    }
    catch(err){
        console.log(err.message)
        return res.status(520).json({error:true, message: err.message})
    }
}

module.exports = {signup, login, getUser}