const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");

require("./db/conn")
const UserInfo = require("./models/UserInfo");
const Product = require("./models/Product");

const { request } = require("http");

//defining port for server
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({extended:false}));

//routes for requests made by user
app.post("/user/login", async (req, res) => {
    try {
        //getting user entered fields
        const uemail = req.body.email;
        const password = req.body.password;

        //finding user entered email in db
        const userEmail = await Register.findOne({email:uemail});
        //matching user entered password with hashed password in db
        const isMatch = await bcrypt.compare(password, userEmail.password);

        //password match cases to be executed
        if(isMatch) {
            res.status(201).send("Login Successful");
        }else {
            res.send("Invalid Email or Password");
        }

    } catch (error) {
        res.status(400).send("Invalid Email or Password !!");
    }
});

app.post("/user/register", async (req, res) => {
    try {
        // getting user entered fields
        const registerUser = new UserInfo({
            name : req.body.name,
            email : req.body.email,
            password : req.body.password
        })
        
        //save method to store entered data in db
        const registered = await registerUser.save();
        res.status(201).send("Registered Successfully");

    } catch (error) {
        res.status(400).send(error);
    }
})

app.get("/product", async (req, res,next) => {
    try {
        const ProductData = await Product.find({});
        res.send(ProductData);
    }
    catch (e) {
        res.status(400).send(e);
    }
})

app.get("/checkout/payment", (req, res) => {
    res.send("Payment Page");
})

// Server port listening
app.listen(port, () => {
    console.log(`Sever running at port ${port}`);
})
