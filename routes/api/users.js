const express = require("express");
const router = express.Router();


router.get('/', (req, res) => {
    console.log('ya');
    res.send("WADDP")
})

module.exports = router;