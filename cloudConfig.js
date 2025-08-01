const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary'); //This two from multer-storage-cloudinary


cloudinary.config({  //built own
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

const storage = new CloudinaryStorage({ //This is from multer-storage-cloudinary
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',
    allowedFormats: ["png","jpg","jpeg"]
  },
});

module.exports = {
    cloudinary,
    storage,
}