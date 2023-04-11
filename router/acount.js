const express = require('express');
const app = express();
const multer = require('multer');
const router = express.Router();
const mongoose = require('mongoose');
const usetAsm = require('../model/user.js');
const mdw = require('../middleware/usermid.js');
const jwt = require('jsonwebtoken');
const acountAsm = require('../model/user.js')
const bcrypt = require('bcrypt');//thư viên mã hóa

//uri
const uri = 'mongodb+srv://chinhnvph23300:MqnjWKKJ04zLKLj3@cluster0.lhzfez8.mongodb.net/AsmMobieServer?retryWrites=true&w=majority';



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upImg = multer({ storage: storage });


//list acount 
router.get('/acount', mdw.check_login, async (req, res) => {
    let authToken = req.session.userLogin;
    console.log('\n' + authToken + ' quản lý tài khoản');
    if (authToken) {
        try {
            const decoded = jwt.verify(authToken.split(' ')[1], process.env.KEY_SESSION);
            if (decoded.exp > Date.now() / 1000) {
                const name = req.session.name;
                const email = req.session.email123;
                const img = req.session.img;
                await mongoose.connect(uri);
                let user = await acountAsm.find().lean();
                for (let i = 0; i < user.length; i++) {
                    user[i].order = i + 1;
                }
                res.render('emptyView', {
                    layout: 'quanlytaikhoan',
                    status: req.session.status,
                    name: name,
                    img: img,
                    email: email,
                    users: user,
                })
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
// delete acount

router.post('/acount/delete', async (req, res) => {
    await mongoose.connect(uri).then(console.log('Kết nối server thành công'));
    const id = req.body.hello;
    console.log(id + '  sss');
    try {
        const deleteUser = await acountAsm.deleteOne({ _id: id });
        console.log(deleteUser + ' xóa thành công');
        res.redirect('/acount');

    } catch (err) {
        console.log(err);
        res.send(err);
    }
});
//add user
router.post('/acount/addUser', upImg.single('myImage'), async (req, res) => {
    //check
    let check = '';
    await mongoose.connect(uri).then(console.log('Kết nối server thành công'));
    const file = req.file;
    console.log(file + ' test file');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!file) {
        check = 'Bạn chưa chọn ảnh';
        return res.render('emptyView', {
            layout: 'addNhanVien',
            check: check,
        });
    }
    const name = req.body.name;
    const img = 'http://localhost:4050/uploads/' + file.originalname;
    const pass = req.body.pswd;
    const pass2 = req.body.pswd2;
    const email = req.body.email;
    //phân quyền 
    const phanQuyen = req.body.phanQuyenAdmin;
    let status;
    console.log(phanQuyen + ' add phân quyền');
    if (phanQuyen === "") {
        check = 'Bạn chưa chọn quyền';
        return res.render('emptyView', {
            layout: 'addNhanVien',
            check: check,
        })
    }
    if (phanQuyen === 'Admin') {
        status = 0;
    } else {
        status = 1;
    }
    if (!emailRegex.test(email)) {
        check = 'Sai định dạng email';
        console.log(check);
        return res.render('emptyView', {
            layout: 'addNhanVien',
            check: check,
        });
    }
    if (email.trim() === '' || name.trim() === '' || pass2.trim() === '') {
        check = 'Chưa Nhập Đủ Thông Tin';
        console.log(check);
        return res.render('emptyView', {
            layout: 'addNhanVien',
            check: check,
        });
    }
    if (pass != pass2) {
        check = 'Password không trùng khớp';
        console.log(check);
        return res.render('emptyView', {
            layout: 'addNhanVien',
            check: check,
        });
    }
    console.log(name + ' ' + pass + ' ' + pass2 + ' ' + img + ' ' + email);
    const addUsers = new usetAsm({
        name: name,
        email: email,
        img: img,
        password: pass2,
        status: status,
    });
    let kq = await addUsers.save();
    console.log(kq);
    res.redirect('/acount');
});

router.get('/acount/update/:id', mdw.check_login, async (req, res) => {
    const id = req.params.id;
    const pass = req.query.pass;
    const status = req.query.status;
    let sts = '';
    if (status === 0) {
        sts = 'Admin';
    } else {
        sts = 'User';
    }
    console.log(pass + ' check');
    console.log(id);
    res.render('emptyView', {
        layout: 'updateNhanVien',
        id: id,
        name: req.query.name,
        img: req.query.img,
        email: req.query.email,
        status: sts,
    })
});
router.post('/acount/updateUser2', upImg.single('myImage'), async (req, res) => {
    await mongoose.connect(uri).then(console.log('Kết nối server thành công'));
    const file = req.file;
    let check = '';
    console.log(file + ' test file');
    if (!file) {
        check = 'Bạn chưa chọn ảnh';
        return res.render('emptyView', {
            layout: 'updateNhanVien',
            check: check,
            name: req.body.name,
            img: req.body.img,
            email: req.body.email,
        });
    }
    const img = 'http://localhost:4050/uploads/' + file.originalname;
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.pass;
    const password2 = req.body.pass2;
    const id = req.body.id;
    //phan quyền
    const phanQuyen = req.body.phanQuyenAdmin;
    let status;
    console.log(phanQuyen + ' update phân quyền');
    if (phanQuyen === "") {
        check = 'Bạn chưa chọn quyền';
        return res.render('emptyView', {
            layout: 'updateNhanVien',
            check: check,
        })
    }
    if (phanQuyen === 'Admin') {
        status = 0;
    } else {
        status = 1;
    }
    console.log(id + ' id user');
    if (password != password2) {
        check = 'Mật khẩu xác nhận không chính xác';
        return res.render('emptyView', {
            layout: 'updateNhanVien',
            check: check,
            name: req.body.name,
            img: req.body.img,
            email: req.body.email,
        });
    }


    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password2, saltRounds);
        console.log(hashedPassword + ' mã hóa');
        const updateUser = await usetAsm.findOneAndUpdate(
            { _id: id },
            { name: name, email: email, img: img, password: hashedPassword , status:status },
            { new: true },
        );
        console.log(updateUser);
        res.redirect('/acount');

    } catch (err) {
        console.log(err);
    }
})




// ====================== cá nhân =======================
// thông tin
router.get('/getThongTin', mdw.check_login, (req, res) => {
    const name = req.session.name;
    const email = req.session.email123;
    const status = req.session.status;
    console.log(status + ' trạng thái');
    let sts;
    if (status == 0) {
        sts = 'Admin';
    } else {
        sts = 'User';
    }
    console.log(name + ' tên ');
    res.render('emptyView', {
        layout: 'thongTinUser',
        name: name,
        email: email,
        status: status,
        status1: sts,
        img: req.session.img,
    });
});
//update thong tin
router.post('/process-form', upImg.single('myImage'), async (req, res) => {
    await mongoose.connect(uri);
    const file = req.file
    console.log(file.originalname + 'Hello');
    const email = req.body.email;
    const name = req.body.name;
    const img = 'http://localhost:4050/uploads/' + file.originalname;
    console.log(email + ' ' + name + ' ' + img);
    const id = req.session._id;
    console.log(id + 'địa chỉ id');
    console.log(req.session + ' Định dạng');
    try {
        const updateUser = await usetAsm.findOneAndUpdate(
            { _id: id },
            { name: name, email: email, img: img, status: req.session.status, password: req.session.pass123 },
            { new: true },
        );
        console.log(updateUser + ' update ');
        res.redirect('/getThongTin');
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

//change password
router.post('/acount/changePass/', async (req, res) => {
    let check = '';

    const oldPass = req.body.olPass;
    const newPass = req.body.nePass;
    const newPass2 = req.body.ChPass;
    //
    const name = req.session.name;
    const email = req.session.email123;
    const status = req.session.status;
    //so sánh pass cũ 
    const foundUser = await usetAsm.findOne({ email: email });
    if (foundUser) {
        const passDb = foundUser.password;
        const match = await bcrypt.compare(oldPass, passDb);
        if (!match) {
            check = 'Mật khẩu cũ không khớp';
            return res.render('emptyView', {
                layout: 'thongTinUser',
                check: check,
                name: name,
                email: email,
                status: status,
                img: req.session.img,
            });
        }
    }

    console.log(oldPass + ' ' + newPass + ' ' + newPass2);
    if (newPass != newPass2) {
        check = 'Mật khẩu xác thực sai';
        return res.render('emptyView', {
            layout: 'thongTinUser',
            check: check,
            name: name,
            email: email,
            status: status,
            img: req.session.img,
        });
    }
    const id = req.session._id;
    console.log(id + ' id của user');

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPass2, saltRounds);
        const updatePass = await usetAsm.findOneAndUpdate(
            { _id: id },
            { name: name, email: email, img: req.session.img, status: req.session.status, password: hashedPassword },
            { new: true },
        );
        console.log(updatePass + ' update ');
        res.redirect('/getThongTin');
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});



module.exports = router;