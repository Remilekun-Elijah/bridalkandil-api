// jshint esversion: 8
var express = require("express");
if (express().get("env") === "development") require("dotenv/config");
var api = express.Router(),
    multer = require("multer"),
    { Authenticate } = require("../controller/auth"),
    { validate, isLoggedIn } = require("../controller/helper"),
    DB = require("../controller/database"),
    db = new DB(),
    users = DB.model("user", db.userSchema);

api.put("/one", Authenticate.verifyToken, async(req, res) => {
    const { update_type } = req.query;
    const userData = req.header.token.data;
    // console.log(userData);
    let update = [];
    try {
        const { type, number } = req.body;

        let isUser = await users.findById(userData._id);

        if (isUser) {

            if (update_type === "contact-info") {
                if (validate().num(req.body.number) && type === 'primary') {
                    update.push(await users.findByIdAndUpdate({ _id: userData._id }, { "number.primary": req.body.number }, { new: true }));
                } else if (validate().num(req.body.number) && type === 'secondary') {
                    update.push(await users.findByIdAndUpdate({ _id: userData._id }, { "number.secondary": req.body.number }, { new: true }))
                } else if (validate().num(req.body.number) && type === 'other') {
                    update.push(await users.findByIdAndUpdate({ _id: userData._id }, { "number.other": req.body.number }, { new: true }))
                } else {
                    console.log("I don't understand this operation");
                }

                const returnedData = update.map(data => {
                    return {
                        primary: data.number.primary,
                        secondary: data.number.secondary,
                        other: data.number.other
                    };
                });

                if (returnedData.length !== 0) res.status(201).json({ msg: "Updated successfully", data: returnedData[0], token: Authenticate.createToken({ data: await isLoggedIn(update[0]) }) });
                else res.status(400).send("There is an error in your input!");

            } else if (update_type === "profile-info") {
                if (validate().isEmpty(req.body.name) == false && validate().isEmpty(req.body.email) == false) {
                    update.push(await users.findByIdAndUpdate({ _id: userData._id }, { "name": req.body.name, "email": req.body.email }, { new: true }))

                } else if (validate().isEmpty(req.body.name) == false) {
                    update.push(await users.findByIdAndUpdate({ _id: userData._id }, { "name": req.body.name }, { new: true }))
                } else if (validate().isEmpty(req.body.email) == false) {
                    update.push(await users.findByIdAndUpdate({ _id: userData._id }, { "email": req.body.email }, { new: true }));
                }
                const returnedData = update.map(data => {
                    return {
                        name: data.name,
                        email: data.email
                    }
                });

                if (returnedData.length !== 0) res.status(201).json({ msg: "Updated successfully", data: returnedData[0], token: Authenticate.createToken({ data: await isLoggedIn(update[0]) }) });
                else res.status(400).send("There is an error in your input!");
            }

            else if (update_type === "address-info") {
                console.log(req.body)
                if (validate().isEmpty(req.body.address) == false && type === 'home') {
                    update.push(await users.findByIdAndUpdate({ _id: userData._id }, { "address.home": req.body.address }, { new: true }));
                } else if (validate().isEmpty(req.body.address) == false && type === 'office') {
                    update.push(await users.findByIdAndUpdate({ _id: userData._id }, { "address.office": req.body.address }, { new: true }))
                } else if (validate().isEmpty(req.body.address) == false && type === 'other') {
                    update.push(await users.findByIdAndUpdate({ _id: userData._id }, { "address.other": req.body.address }, { new: true }))
                } else {
                    console.log("I don't understand this operation");
                }

                const returnedData = update.map(data => {
                    return {
                        home: data.address.home,
                        office: data.address.office,
                        other: data.address.other
                    };
                });

                if (returnedData.length !== 0) res.status(201).json({ msg: "Updated successfully", data: returnedData[0], token: Authenticate.createToken({ data: await isLoggedIn(update[0]) }) });
                else res.status(400).send("There is an error in your input!");

            }else {
                console.log("query unknown")
            }
        }
    } catch (err) {
        console.log(err.message);

        res.status(400).send("You are not logged in!");
    }
    // console.log(decode.v);
});
api.delete("/one", Authenticate.verifyToken, async(req, res) => {
    const { delete_type } = req.query;
    const userData = req.header.token.data;
    // console.log(userData);
    let update = [];
    try {
        let isUser = await users.findById(userData._id);


        console.log(delete_type)

        if (isUser) {

            if (delete_type === "number") {
                const { type, number } = req.body;
                if (validate().num(number) && type.toLowerCase() === 'primary') {
                    update.push(await users.findByIdAndUpdate({_id: userData._id},{ "number.primary": '' }));
                } else if (validate().num(number) && type.toLowerCase() === 'secondary') {
                    update.push(await users.findByIdAndUpdate({_id:userData._id},{ "number.secondary": '' }))
                } else if (validate().num(number) && type.toLowerCase() === 'other') {
                    update.push(await users.findByIdAndUpdate({_id:userData._id},{ "number.other": '' }))
                } else {
                    console.log("I don't understand this operation");
                }

                const returnedData = update.map(data => {
                    return {
                        primary: data.number.primary,
                        secondary: data.number.secondary,
                        other: data.number.other
                    };
                });

                if (returnedData.length !== 0) res.status(201).json({ msg: "Deleted successfully", data: returnedData[0], token: Authenticate.createToken({ data: await isLoggedIn(update[0]) }) });
                else res.status(400).send("Something went wrong!");

            }

            else if (delete_type === "address") {
                const { type, address } = req.body;
                console.log(req.body)
                if (validate().isEmpty(address) == false && type.toLowerCase() === 'home') {
                    update.push(await users.findByIdAndUpdate({_id:userData._id},{ "address.home": '' }));
                } else if (validate().isEmpty(address) == false && type.toLowerCase() === 'office') {
                    update.push(await users.findByIdAndUpdate({_id:userData._id},{ "address.office": '' }))
                } else if (validate().isEmpty(req.body.address) == false && type.toLowerCase() === 'other') {
                    update.push(await users.findByIdAndUpdate({_id:userData._id},{ "address.other": '' }))
                } else {
                    console.log("I don't understand this operation");
                }

                const returnedData = update.map(data => {
                    return {
                        home: data.address.home,
                        office: data.address.office,
                        other: data.address.other
                    };
                });

                if (returnedData.length !== 0) res.status(201).json({ msg: "Deleted successfully", data: returnedData[0], token: Authenticate.createToken({ data: await isLoggedIn(update[0]) }) });
                else res.status(400).send("There is an error in your input!");

            }else {
                console.log("query unknown")
            }
        }
    } catch (err) {
        console.log(err.message);

        res.status(400).send("You are not logged in!");
    }
    // console.log(decode.v);
});


api.get("/one", Authenticate.verifyToken, async(req, res) => {
    // console.log(req.header)
    try {
        // console.log(req.body);
        let data = req.header.token;

        const resp = await isLoggedIn(data.data);
        console.log(resp)
        if (resp) {
            res.status(200).json({ data: resp, token: Authenticate.createToken({ data: await isLoggedIn(resp) }) });
        }
    } catch (err) {
        console.error(err.message, req.status);
        // res.status(403).json({ err: "Forbidden" });
    }
    // next();
});

module.exports = api;