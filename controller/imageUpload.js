// const experss
const {isLoggedIn} = require("./helper");
const cloudinary = require("../config/cloudinary"),
    DB = require("./database"),
    {Authenticate}= require("./auth"),
    db = new DB(),
    users = DB.model("user", db.userSchema);
exports.uploadImage = async (req, res) =>{
    // console.log(req.file.path)
try {
    const resp = await cloudinary.upload(req.file.path);
    let user = await isLoggedIn(req.header.token.data);
    if (user) {
        // console.log(req.header.token.data);
        let newUser = await users.findOne({email: user.email}).select('-password')
        console.log(newUser);

        newUser.image = resp.url;
        let data = await newUser.save();
        if (data) {
            res.status(201).json({
                msg: "Profile image uploaded successfully",
                img: data.image,
                token: Authenticate.createToken({data})
            })
        } else
            res.status(400).send("You are not logged in!");
    } else res.status(400).send("You are not logged in!");
    //
    // if(resp)
}catch(e) {

        res.status(400).send("You are not logged in!");
    }
}