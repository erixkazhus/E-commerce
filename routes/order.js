const router = require("express").Router();
const Order = require("../models/Order");

const { verifyToken, verifyTokenAndAuth, verifyTokenAndAdmin} = require("./verifyToken");


//CREATE

router.post("/", verifyToken, async (request, response)=>{
    const newOrder = new Order(request.body);
    console.log(request.body);

    try{
        const savedOrder = await newOrder.save();
       
        response.status(200).json(savedOrder);
    }catch(err){
        response.status(500).json(err);
    }
});

// UPDATE order
router.put("/:id", verifyTokenAndAdmin, async (request, response)=>{
       
    try{
        const updatedOrder = await Order.findByIdAndUpdate(
            request.params.id, 
            {
                $set: request.body,
            }, 
        {new: true}
        );
        response.status(200).json(updatedOrder);
    }catch(err){
        response.status(500).json(err);
    }
});

//DELETE order

router.delete("/:id", verifyTokenAndAdmin, async (request, response)=>{
    try{
        await Order.findByIdAndDelete(request.params.id)
        response.status(200).json("Order has been deleted");
    }catch(err){
        response.status(500).json(err);
    }
});

//GET user orders

router.get("/find/:userId", verifyTokenAndAuth, async (request, response)=>{
    try{
       const orders = await Order.find({userId: request.params.userId});         
       response.status(200).json(orders);
    }catch(err){
        response.status(500).json(err);
    }
});

// GET ALL

router.get("/", verifyTokenAndAdmin, async (request, response)=>{
    try{
       const orders = await Order.find();         
       response.status(200).json(orders);
    }catch(err){
        response.status(500).json(err);
    }
});

// GET Monthly income

router.get("/income", verifyTokenAndAdmin, async (request, response)=>{
    
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
    try {
        const income = await Order.aggregate([
          { $match: { createdAt: { $gte: previousMonth } } },
          {
            $project: {
              month: { $month: "$createdAt" },
              sales: "$amount",
            },
          },
          {
            $group: {
              _id: "$month",
              total: { $sum: "$sales" },
            },
          },
        ]);
        response.status(200).json(income);
      } catch (err) {
        response.status(500).json(err);
      }
    });


module.exports = router;