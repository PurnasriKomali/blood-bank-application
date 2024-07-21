const userModel=require("../models/userModel");
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const registerController=async (req,res) => {    
      try {
        const existingUser=await userModel.findOne({email:req.body.email}) 
        if(existingUser) {
           return res.status(409).json({
                success:false,
                message:'user already exists'
            });  
        }         
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(req.body.password,salt);
        req.body.password=hashedPassword;
        const user=new userModel(req.body);
        await user.save();
        return res.status(201).json({    
            success:true,
           message:"user registered successfully",
            user,
        });           
      } catch (error) {
            console.log(error);
            res.status(500).json({
                success:false,
                message:'error in register api',
                error,  
            });
      }
};
const loginController=async(req,res)=>{
    try{
        const user=await userModel.findOne({email:req.body.email});
        if(!user) {
            return res.status(404).json({
                success:false,
                message:'invalid credentials'
            });
        }
        if(user.role !== req.body.role){
           return res.status(500).json({
            success:false,
            message:"role doesn\'t match",
           });
        }
        const comparePassword=await bcrypt.compare(req.body.password,user.password);
        if(!comparePassword) {
            return res.status(500).json({
                success:false,
                message:'invalid credentials',
            });
        }
        const token=jwt.sign({userId:user._id, role:user.role},process.env.JWT_SECRET,{expiresIn:'1d'})
        return res.status(200).json({
              success:true,
              message:'login successfully',
              token,
              user,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message:'error in login api',
            error,
        });
    }
};
const currentUserController=async(req,res)=>{
    try {
        const user=await userModel.findOne({_id:req.body.userId});
        return res.status(200).json({
            success:true,
            message:"user fetched successfully",
            user,
        });
    } catch(error) {
        console.error(error)
        return res.status(500).json({
            success:false,
            message:"unable to get current user",
            error,
        });
    }
};
module.exports={registerController,loginController,currentUserController};