var express = require('express')
var router = express.Router()

var fs = require('fs')
var path = require('path')
var imagePath = path.join(path.resolve(__dirname, '..'), '/public/images/')

function getDirectoryContent (req, res, next) {
  fs.readdir(imagePath, function (err, images) {
    if (err) { return next(err) }
    res.locals.filenames = images
    next()
  })
}

router.get('/', getDirectoryContent, function (req, res) {
  res.send(res.locals)
})

router.post('/', async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: 'No file uploaded'
      })
    } else {
      const img = req.files.package

      img.mv('./public/images/' + img.name)

      res.send({
        status: true,
        message: 'File is uploaded',
        data: {
          name: img.name,
          mimetype: img.mimetype,
          size: img.size
        }
      })
    }
  } catch (err) {
    res.status(500).send(err)
  }
})

module.exports = router
