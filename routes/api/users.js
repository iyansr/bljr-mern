const express = require('express');
const router = express.Router();

// @route GET api/uers/test
// @desc    Users Post Route
// access   Public
router.get('/test', (req, res) => {
    res.json({
        msg: "Users Work"
    });
});

module.exports = router;    