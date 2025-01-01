const { Schema, model } = require("mongoose");

const ProductScheema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    
    coverImageURL: {
      type: String,
      
    },
    Product_state:
    {
        type:String,
        
    },
    bread:{
      type:String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    waight:{
      type:String,
    },
  },
  { timestamps: true }
);

const Product = model("product", ProductScheema);

module.exports = Product;