const cloudinary = require("cloudinary").v2;
cloudinary.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    cloud_name: process.env.CLOUDINARY_NAME,
});

exports.upload = (file) => {
    return new Promise((resolve) => {
        cloudinary.uploader.upload(
            file,
            {
                folder: "bridalkandil",
                public_id: "bridalkandil",
                use_filename: true,
                unique_filename: true,
            },

            (error, result) => {
                if (result) {
                    resolve({
                        url: result.url,
                        id: result.public_id,
                    });
                } else {
                    resolve(error);
                }
            },
            { resource_type: "auto" }
        );
    });
};
