const multer = require('multer')
const cloudinary = require('../config/cloudinary')

// Custom multer storage engine — compatible with cloudinary v2, no extra packages needed
function makeCloudinaryStorage(opts) {
  return {
    _handleFile(req, file, cb) {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: opts.folder,
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
          transformation: opts.transformation || [],
        },
        (error, result) => {
          if (error) return cb(error)
          cb(null, {
            fieldname: file.fieldname,
            originalname: file.originalname,
            path: result.secure_url,
            filename: result.public_id,
            size: result.bytes,
          })
        }
      )
      file.stream.pipe(uploadStream)
    },
    _removeFile(req, file, cb) {
      if (file.filename) {
        cloudinary.uploader.destroy(file.filename, cb)
      } else {
        cb(null)
      }
    },
  }
}

// Cloudinary storage for project images
const projectStorage = makeCloudinaryStorage({
  folder: 'portfolio/projects',
  transformation: [{ width: 1200, height: 675, crop: 'fill', quality: 'auto:good' }],
})

// Cloudinary storage for blog covers
const blogStorage = makeCloudinaryStorage({
  folder: 'portfolio/blog',
  transformation: [{ width: 1200, height: 630, crop: 'fill', quality: 'auto:good' }],
})

// Cloudinary storage for avatars
const avatarStorage = makeCloudinaryStorage({
  folder: 'portfolio/avatars',
  transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face', quality: 'auto' }],
})

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only JPG, PNG, and WebP images are allowed.'), false)
  }
}

exports.uploadProjectImage = multer({ storage: projectStorage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } })
exports.uploadBlogImage = multer({ storage: blogStorage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } })
exports.uploadAvatar = multer({ storage: avatarStorage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } })
