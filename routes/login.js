const express = require("express"),
    DB = require("../controller/database"),
    api = express.Router(),
    { isLoggedIn } = require("../controller/helper"),
    { Authenticate } = require("../controller/auth");
bcrypt = require("bcrypt"),
    db = new DB(),
    users = DB.model("user", db.userSchema);

api.post("/login", async(req, res) => {
    try {
        let data = await users.findOne({ email: req.body.email })
            .select("-password");
        console.log(data);
        let userData= await users.findOne({ email: req.body.email });
        if ((await isLoggedIn(req.body)) === null) {
            res.status(404).json({ err: "User not found!", status: 404, ok: false });
        }

        let access = await bcrypt.compareSync(req.body.password, userData.password);

        access === true ?
            res.status(200).json({
                token: Authenticate.createToken({ data }),
                data: "Login successful",
            }) :
            res
            .status(400)
            .json({ err: "Password is not correct.", success: false });
    } catch (error) {
        console.error(error);
        // res.redirect("/admin")
    }
});

module.exports = api;