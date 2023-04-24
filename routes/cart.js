const router = require("express").Router();
const { verifyToken, verifyTokenAndAuth, verifyTokenAndAdmin} = require("./verifyToken")
const Cart = require("../models/Cart");


//CREATE

router.post("/", verifyToken, async (request, response)=>{
    const newCart = new Cart(request.body);

    try{
        const savedCart = await newCart.save();
       
        response.status(200).json(savedCart);
    }catch(err){
        response.status(500).json(err);
    }
});

// UPDATE Cart
router.put("/:id", verifyTokenAndAuth, async (request, response)=>{
       
    try{
        const updatedCart = await Cart.findByIdAndUpdate(
            request.params.id, 
            {
                $set: request.body,
            }, 
        {new: true}
        );
        response.status(200).json(updatedCart);
    }catch(err){
        response.status(500).json(err);
    }
});

//DELETE Cart

router.delete("/:id", verifyTokenAndAuth, async (request, response)=>{
    try{
        await Cart.findByIdAndDelete(request.params.id)
        response.status(200).json("Product has been deleted");
    }catch(err){
        response.status(500).json(err);
    }
});

//GET Cart

router.get("/find/:userId", verifyTokenAndAuth, async (request, response)=>{
    try{
       const cart = await Cart.findOne({userId: request.params.userId});         
       response.status(200).json(cart);
    }catch(err){
        response.status(500).json(err);
    }
});

// GET ALL

router.get("/", verifyTokenAndAdmin, async (request, response)=>{
    try{
       const carts = await Cart.find();         
       response.status(200).json(carts);
    }catch(err){
        response.status(500).json(err);
    }
});


module.exports = router;