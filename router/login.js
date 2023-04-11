const express = require('express');
const app = express()
const router = express.Router();
const mongoose = require('mongoose');
const usetAsm = require('../model/user.js');
const jwt = require('jsonwebtoken');
//
const bcrypt = require('bcrypt');//thư viên mã hóa

const notifier = require('node-notifier');
let name, img, email123, pass123 = '';
let userIndex;
//uri of mongoose
const uri = 'mongodb+srv://chinhnvph23300:MqnjWKKJ04zLKLj3@cluster0.lhzfez8.mongodb.net/AsmMobieServer?retryWrites=true&w=majority';
router.get('/', (req, res) => {
    res.render('emptyView', {
        layout: 'login',
        name: name,
        email123: email123,
        img: img,
    });
});
//
router.post('/add', async (req, res) => {
    const email = req.body.email;
    const pass = req.body.pswd;
    console.log(email + " " + pass);
    await mongoose.connect(uri);

    let check;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.trim() === '' || pass.trim() === '') {
        check = 'Chưa đủ thông tin';
        console.log(check);
        return res.render('emptyView', {
            layout: 'login',
            check: check,
        });
    }
    if (!emailRegex.test(email)) {
        check = 'Sai định dạng email';
        console.log(check);
        notifier.notify({
            title: 'Lỗi đăng nhập',
            message: 'Vui lòng nhập đầy đủ thông tin.',
        });
        return res.render('emptyView', {
            layout: 'login',
            check: check,
        });
    }
    const foundUser = await usetAsm.findOne({ email: email });
    if (foundUser) {
        const passDb = foundUser.password;
        //so sánh pass
        const match = await bcrypt.compare(pass, passDb);
        if (match) {
            const { _id, name, email, pass, status, img } = foundUser;
            //set session
            req.session.name = name;
            req.session.email123 = email;
            req.session.pass123 = pass;
            req.session.status = status;
            req.session.img = img;
            req.session._id = _id.toString();
            console.log(req.session.name + ' tên của tôi');
            console.log('User Id Check: ' + req.session._id);
            //
            const token = jwt.sign(foundUser.toJSON() , process.env.KEY_SESSION , {expiresIn:'1h'});
            let authToken = 'JWT ' + token ;
            req.session.userLogin = authToken;
            console.log(authToken + ' check logn');
            return res.redirect('/home');
        } else {
            // Nếu mật khẩu sai, trả về thông báo lỗi
            return res.render('emptyView', {
                layout: 'login',
                check: 'Sai email hoặc password'
            });
        }

    } else {
        check = "Nhập sai email hoặc password";
        console.log(check);
        return res.render('emptyView', {
            layout: 'login',
            check: check,
        });
    }
});

//session


module.exports = router;