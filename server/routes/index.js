var express = require('express')
var router = express.Router()

router.get('/', function (req, res) {
  res.send('API is working properly')
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

      img.mv('./uploads/' + img.name)

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
