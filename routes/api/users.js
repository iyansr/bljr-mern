const express = require('express');
const router = express.Router();

// @route GET api/uers/test

router.get('/test', (req, res) => {
    res.json({
        msg: "Users Work"
    });
});

module.exports = router;    