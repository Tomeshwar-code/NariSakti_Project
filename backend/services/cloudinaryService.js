const cloudinary = require('../config/cloudinary');

exports.uploadImage = async (filePath, folder = 'narisakti') => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: 'auto',
    use_filename: true,
    unique_filename: false,
    overwrite: true
  });
  return result;
};

exports.deleteImage = async (publicId) => {
  if (!publicId) {
    throw new Error('PublicId is required to delete an image');
  }

  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: 'image'
  });
  return result;
};

exports.uploadImages = async (files = [], folder = 'narisakti') => {
  if (!Array.isArray(files) || files.length === 0) {
    return [];
  }

  const uploads = await Promise.all(
    files.map((file) => exports.uploadImage(file.path || file, folder))
  );

  return uploads;
};
