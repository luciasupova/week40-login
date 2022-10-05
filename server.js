const mongodb = require('mongodb').MongoClient
const express = require('express')
const jwt = require('jsonwebtoken'); // generate token
const app = express()
app.use(express.json())
const port = 5503;

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));var bodyParser = require('body-parser');
 
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/week')
.catch(error => console.log(error));

// create user schema
const userSchema = new mongoose.Schema({ 
    email: { 
    type: String,
    unique: true, // creates index on that, searching is much faster - put on properties you'll search often
    required: "Email is required",
}, 
password: {
    type: String,
    required: "Password is required"
}
});

const User = mongoose.model('User', userSchema);


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/auth/signup", (req, res) => {  // why post? cuz it's creating
    const user = new User({
        email: req.body.email,
        password: req.body.password
    });

    user.save((err) => {
        if(err) console.log(err)
        res.status(201).json(user);
    })
  });

  // generate token for password
  app.get("/auth/login", (req,res) => {                                                     //enpoint must be unique
    User.findOne({email: req.body.email, password: req.body.password}, (err, user) => {   // can't use findbyid cuz you don't have id // 
        if (err) console.log(err)
        const token = jwt.sign({_id: user.id}, "secretPutThisInEnvFile");

        res.status(200).json(token);
    }) 
  })  

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
