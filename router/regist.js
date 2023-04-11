const express = require('express');
const app = express()
const router = express.Router();
const mongoose = require('mongoose');
const usetAsm = require('../model/user.js');
const multer = require('multer');
const userAsm = require('../model/user.js');

const bcrypt = require('bcrypt');//thư viên mã hóa
//

//database
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

router.get('/', (req, res) => {
    res.render('emptyView', {
        layout: 'regist',
    });
});
router.post('/dangky', upImg.single('myImage'), async (req, res) => {
    await mongoose.connect(uri).then(console.log('Kết nối server thành công'));
    const file = req.file
    if (!file) {
        res.status(400).send('No file uploaded');
        return;
    }
    const email = req.body.email;
    const password = req.body.pswd;
    const name = req.body.name;
    const img = 'http://localhost:4050/uploads/' + file.originalname;

    let check;
    if (!email || !password || !name) {
        // Nếu email hoặc pass rỗng thì thực hiện hành động này
        check = "Chưa đủ thông tin";
        res.render('emptyView', {
            layout: 'regist',
            check: check,
        });
    } else {
        // Mã hóa mật khẩu bằng bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Tạo mới đối tượng người dùng với mật khẩu đã được mã hóa
        const addUser = new userAsm({
            name: name,
            email: email,
            password: hashedPassword,
            img: img,
        });
        let kq = await addUser.save();
        console.log(kq);
        res.redirect('/login');
    }
});

module.exports = router; 