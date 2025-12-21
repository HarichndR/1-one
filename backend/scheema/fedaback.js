const { Schema, model } = require("mongoose");
const feedBackSchema= new Schema({
    email:{
        type:String
    },
    message:{
        type:String,
    },
    time:{
        type:Date,
        default:Date.now(),
    },
    read:{
        type:Boolean,
        default:false
    }
});

const FeedBack= model('feedback', feedBackSchema);

module.exports= FeedBack;