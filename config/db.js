const mongoose=require('mongoose');
const colors=require('colors');
const connectdb=async()=>
{
    try {
       await mongoose.connect(process.env.MONGO_URL)
       console.log(`connceted to mongodb database ${mongoose.connection.host}`.bgMagenta.white);
    } catch(error) {
      console.log(`mongodb database error ${error}`.bgRed.white);
    }
};
module.exports=connectdb;