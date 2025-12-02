import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { getCloudinaryCloudName, getCloudinaryApiKey, getCloudinaryApiSecret } from '../utils/env';
dotenv.config();
const cloudinaryCloudName = getCloudinaryCloudName();
const cloudinaryApiKey = getCloudinaryApiKey();
const cloudinaryApiSecret = getCloudinaryApiSecret();

cloudinary.config({
  cloud_name: cloudinaryCloudName,
  api_key: cloudinaryApiKey,
  api_secret: cloudinaryApiSecret,
});

export default cloudinary;