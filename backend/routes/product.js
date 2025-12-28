const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const fs =require("fs");
const Product = require("../scheema/product");
const { fstat } = require("fs");
const { isUtf8 } = require("buffer");
const {checkRole}= require('../midelwear/restrict');
//const Comment = require("../models/comment");
const checkForAuthenticationCookie= require('../midelwear/autho')

const url=process.env.Static_storege_URL;
const router = Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve('./public/productIMG'));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });


 router.get("/all-product" ,(req, res)=>{
    const products=  fs.readFileSync('data.json','utf8');
    json_product=JSON.parse(products);
     return res.json(json_product);
 });
 

 router.get("/my-product",checkRole('Farmer'), checkForAuthenticationCookie, async (req, res) => {
  try {
    const my_Product = await Product.find({createdBy:req.user._id}).populate('createdBy');
    if (!my_Product) {
      return res.status(404).json({ msg: "Product not found" }); // Added error handling for product not found
    }
    return res.json( my_Product );
  } catch (err) {
    return res.status(500).json({ error: err.message }); // Added error handling for server errors
  }
});

router.get('/products',checkForAuthenticationCookie, checkRole('Buyer'), async (req, res) => {
  try {
    const products = await Product.find({}).populate('createdBy');
    res.json( products );
  } catch (err) {
    res.status(500).json({ error: err.message }); // Added error handling for server errors
  }
});

router.post("/add-new",checkRole('Farmer'), checkForAuthenticationCookie, upload.single("coverImage"), async (req, res) => {
  try {
    const {  waight,title, bread, Product_state } = req.body;
    const product = await Product.create({
      waight,
      title,
      bread,
      Product_state,
      createdBy: req.user._id,
      coverImageURL: `${url}/productIMG/${req.file.filename}`,
    });
    return res.json({ msg: "New item added", productId: product._id }); // Changed from res.redirect to res.json
  } catch (err) {
    return res.status(500).json({ error: err.message }); // Added error handling for server errors
  }
});
router.delete("/delete/:id", checkRole('Farmer'), checkForAuthenticationCookie, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    if (!product) {
      return res.status(404).json({ msg: "Product not found or you are not authorized to delete this product" });
    }
    return res.json({ msg: "Product deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
router.get('/filterdproduct', async (req, res) => {
  const query = req.query.search;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  try {
    const filteredItems = await Product.find({
      title: { $regex: query, $options: 'i' }
    });

    res.json(filteredItems);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/markets', (req, res) => {
  const searchQuery = req.query.search?.toLowerCase() || '';

  const products = fs.readFileSync('data.json', 'utf8');
  const markets = JSON.parse(products);

  const filteredMarkets = markets.filter(market => {
    const nameMatch = market.name.toLowerCase().includes(searchQuery);
    const priceMatch = market.price.toLowerCase().includes(searchQuery);
    const cityMatch = market.mandi.city.toLowerCase().includes(searchQuery);
    const stateMatch = market.mandi.state.toLowerCase().includes(searchQuery);

    return nameMatch || priceMatch || cityMatch || stateMatch;
  });

  res.json(filteredMarkets);
});

module.exports = router;


module.exports = router;
