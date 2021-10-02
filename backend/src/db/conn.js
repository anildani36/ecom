const mongoose = require("mongoose");

const db = "mongodb+srv://admin:admin@cluster0.xcbvf.mongodb.net/ecommerce?retryWrites=true&w=majority"

//port & db name declaration for mongo db 
mongoose.connect(db, {
    useNewUrlParser:true,
    // userUnifiedTopology:true,
    // useCreateIndex:true,
    // useFindAndModify:false
}).then(() => {
    console.log(`Connected to DataBase`);
}).catch((error) => {
    console.log(`No connection`,error);
})
