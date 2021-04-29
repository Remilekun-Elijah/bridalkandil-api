const api = require("express").Router(),
    {Authenticate} = require("../controller/auth"),
    {upload} = require("../config/multer"),
    uploadImage = require("../controller/imageUpload").uploadImage
api.put("/one/image_upload", Authenticate.verifyToken,upload.single('avatar'),uploadImage)


module.exports = api