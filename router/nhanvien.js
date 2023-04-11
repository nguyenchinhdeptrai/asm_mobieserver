const express = require('express');
const app = express()
const router = express.Router();
//
const mdw = require('../middleware/usermid')

router.get('/addNhanVien', function (req, res) {
    const name = req.session.name;
    const email = req.session.email123;
    const img = req.session.img;
    res.render('emptyView', {
        layout: 'addnhanVien',
        status: req.session.status,
        name: name,
        img: img,
        email: email,
    })
})

module.exports = router;