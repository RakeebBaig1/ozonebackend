const { getUvReport, getOzoneReport } = require("../controller/reportController")
const { protect } = require("../middlewares/authMiddleware")

const router = require("express").Router()

router.get('/uv', protect, getUvReport)
router.get('/ozone', protect, getOzoneReport)

module.exports = router