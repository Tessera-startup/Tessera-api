const cloudinary = require('cloudinary').v2;
          
cloudinary.config({ 
  cloud_name: 'db0v83nmr', 
  api_key: '438937393957913', 
  api_secret: 'PvXKNxI-NXnn4JXp1jdKBDlaIZU' 
});


export const cloudinaryUpload =async (path:any) => {
  const res = await cloudinary.uploader.upload(path)
  return res
}