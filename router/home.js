const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const productAsm = require('../model/product.js');
const mdw = require('../middleware/usermid.js');
const jwt = require('jsonwebtoken');
//
//uri of mongoose
const uri = 'mongodb+srv://chinhnvph23300:MqnjWKKJ04zLKLj3@cluster0.lhzfez8.mongodb.net/AsmMobieServer?retryWrites=true&w=majority';
router.get('/', mdw.check_login, async (req, res) => {
    //get token
    let authToken = req.session.userLogin;
    console.log('\n' + authToken + ' token');
    if (authToken) {
        try {
            const decoded = jwt.verify(authToken.split(' ')[1], process.env.KEY_SESSION);
            if (decoded.exp > Date.now() / 1000) { // Kiểm tra xem token còn hạn sử dụng không
                const name = req.session.name;
                const email = req.session.email123;
                const img = req.session.img;
                const status = req.session.status;
                console.log(status + ' trạng thái test');
                await mongoose.connect(uri);
                let product = await productAsm.find().lean();
                //
                for (let i = 0; i < product.length; i++) {
                    product[i].order = i + 1;
                }
                console.log(product);
                console.log(email + ' email của tôi');
                console.log(name + ' tên của tôi');
                res.render('emptyView', {
                    layout: 'home',
                    name: name,
                    img: img,
                    email: email,
                    status: status,
                    product: product,
                });
            } else {
                return res.status(403).send({ success: false, msg: 'Token expired.' });
            }
        } catch (error) {
            //return res.status(403).send({ success: false, msg: 'Invalid token.' });
            return res.redirect('/login');
        }
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorized.' });
    }


});

router.get('/logout',mdw.check_login ,async (req, res) => {
    if (req.session != null) {
        req.session.destroy(
            function () {
                console.log('Đăng Xuất Thành Công');
                res.redirect('/login');
            }
        );
    }
})

module.exports = router;