// config/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';

// Small delay to ensure env vars are loaded
setTimeout(() => {
  const cloudinaryUrl = process.env.CLOUDINARY_URL;

  if (cloudinaryUrl) {
    const matches = cloudinaryUrl.match(/cloudinary:\/\/(\d+):([^@]+)@(.+)/);
    
    if (matches) {
      const [, apiKey, apiSecret, cloudName] = matches;
      
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret
      });
      
      console.log('✅ Cloudinary configured successfully');
    }
  } else {
    console.log('⚠️ Cloudinary URL not found, using local storage');
  }
}, 100);

export default cloudinary;