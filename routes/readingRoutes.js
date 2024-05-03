const { add_new_reading, get_latest_readings } = require('../controller/readingController')
const { protect } = require('../middlewares/authMiddleware')

const router = require('express').Router()

router.post('/add_new_reading/:id', protect, add_new_reading )
router.get('/get_latest_readings', protect, get_latest_readings )

module.exports = router