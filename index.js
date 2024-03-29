const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth")
const userRoute = require("./routes/user")

dotenv.config();

mongoose
.connect(process.env.MONGO_URL)
.then(()=> console.log("DB connected"))
.catch((err) => {
    console.log(err);
});

// app.get("/api/test", () => {
//     console.log("Test succes");
// });
app.use(express.json());

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);

app.listen(process.env.PORT || 5000, () => {
    console.log("Backend is running");
});