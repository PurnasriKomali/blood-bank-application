const mongoose = require("mongoose");

const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");
const createInventoryController = async (req, res) => {
    try {
        const { email, inventoryType } = req.body;
        const user = await userModel.findOne({ email })
        if (!user) {
            throw new Error('user not found')
        }
        //if(inventoryType==='in'&&user.role!=='donar') {
        //throw new Error('not a donar account')
        //}
        //if(inventoryType==='out'&& user.role!='hospital') {
        //throw new Error('not a hospital')
        //}
        if (req.body.inventoryType == 'out') {
            const requestedBloodGroup = req.body.bloodGroup
            const requestedQuantityOfBlood = req.body.quantity
            const organisation = new mongoose.Types.ObjectId(req.body.userId)
            const totalInOfRequestedBlood = await inventoryModel.aggregate([
                {
                    $match: {
                        organisation,
                        inventoryType: 'in',
                        bloodGroup: requestedBloodGroup
                    }
                }, {
                    $group: {
                        _id: '$bloodGroup',
                        total: { $sum: '$quantity' }
                    }
                }
            ])
            //console.log('Total In',totalInOfRequestedBlood)
            const totalIn = totalInOfRequestedBlood[0]?.total || 0;
            const totalOutOfRequestedBloodGroup = await inventoryModel.aggregate([
                {
                    $match: {
                        organisation,
                        inventoryType: 'out',
                        bloodGroup: requestedBloodGroup
                    }
                },
                {
                    $group: {
                        _id: '$bloodGroup',
                        total: { $sum: '$quantity' }
                    }
                }
            ])
            const totalOut = totalOutOfRequestedBloodGroup[0]?.total || 0;
            const availableQuantityOfBloodGroup = totalIn - totalOut;
            if (availableQuantityOfBloodGroup < requestedQuantityOfBlood) {
                return res.status(500).send({
                    success: false,
                    message: `only ${availableQuantityOfBloodGroup}ML of ${requestedBloodGroup.toUpperCase()} is available`
                })
            }
            req.body.hospital = user?._id;
        } else {
            req.body.donar = user?._id;
        }
        const inventory = new inventoryModel(req.body);
        await inventory.save();
        return res.status(201).send({
            success: true,
            message: "new blood record added"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: "error in create inventory api",
            error
        })
    }
};
const getInventoryController = async (req, res) => {
    try {
      const inventory = await inventoryModel
        .find({
          organisation: req.body.userId,
        })
        .populate("donar")
        .populate("hospital")
        .sort({ createdAt: -1 });
      return res.status(200).send({
        success: true,
        messaage: "get all records successfully",
        inventory,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Error In Get All Inventory",
        error,
      });
    }
  };
const getInventoryHospitalController = async (req, res) => {
    try {   
        const inventory = await inventoryModel.find(req.body.filters)
            .populate("donar")
            .populate("hospital")
            .populate("organisation")
            .sort({ createdAt: -1 });
        return res.status(200).send({
            success: true,
            message: "get hospital consumer records successfully",
            inventory,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "error in get consumer inventory",
            error,
        });
    }
};
const getDonarsController=async(req,res)=>{
    try {
        const organisation=req.body.userId
        const donarId=await inventoryModel.distinct("donar",{
            organisation,
        });
    // console.log(donarId);
    const donars=await userModel.find({_id:{$in:donarId}})
    return res.status(200).send({
        success:true,
        message:'donar record fetched successfully',
        donars,
    });
    } catch(error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            message:'error in donar records',
            error,
        })
    }
};
const getHospitalController=async(req,res)=>{
    try {
         const organisation=req.body.userId 
         const hospitalId=await inventoryModel.distinct('hospital',{organisation})
         const hospitals=await userModel.find({
            _id:{$in:hospitalId}
         })
         return res.status(200).send({
            success:true,
            message:'Hospitals Data Fetched Successfully',
            hospitals,
         })
    } catch(error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            message:'error in hospital API',
            error,
        });
    }
};
// GET BLOOD RECORD OF 3
const getRecentInventoryController = async (req, res) => {
    try {
      const inventory = await inventoryModel
        .find({
          organisation: req.body.userId,
        })
        .limit(3)
        .sort({ createdAt: -1 });
      return res.status(200).send({
        success: true,
        message: "recent Invenotry Data",
        inventory,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Error In Recent Inventory API",
        error,
      });
    }
  };
  
const getOrganisationController=async(req,res)=>{
     try {
        const donar=req.body.userId
        const orgId=await inventoryModel.distinct('organisation',{donar})
        const organisations=await userModel.find({
            _id:{$in:orgId},
        })
        return res.status(200).send({
            success:true,
            message:'org data fetched successfully',
            organisations,
        })
     } catch(error) {
        console.log(error)
        return res.send(500).send({
            success:false,
            message:'error in org api',
            error,
        });
     }
};
const getOrganisationForHospitalController=async(req,res)=>{
    try {
       const hospital=req.body.userId
       const orgId=await inventoryModel.distinct('organisation',{hospital});
       const organisations=await userModel.find({
           _id:{$in:orgId},
       })
       return res.status(200).send({
           success:true,
           message:'Hospital org data fetched successfully',
           organisations,
       })
    } catch(error) {
       console.log(error)
       return res.send(500).send({
           success:false,
           message:'error in Hospital org api',
           error,
       })
    }
}
module.exports = { createInventoryController, getInventoryController,getDonarsController,getHospitalController,getOrganisationController,getOrganisationForHospitalController,getInventoryHospitalController ,getRecentInventoryController};