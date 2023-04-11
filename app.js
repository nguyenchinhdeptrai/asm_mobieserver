require('dotenv').config();
const express = require('express');
const expressHbs = require('express-handlebars');
const multer = require('multer');
const bodyParser = require("body-parser");
const app = express()
const session = require('express-session');
//
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/uploads', express.static('uploads'));
app.use(express.static('uploads'));
app.engine('.hbs', expressHbs.engine({
    extname: "hbs",
    defaultLayout: 'login',
    layoutsDir: "views/layouts/"
}));
//
app.set('view engine', '.hbs');
app.set('views', './views');
//session
app.use(session({
    secret: process.env.KEY_SESSION, // chuỗi bí mật sử dụng để mã hóa session
    resave: false,
    saveUninitialized: true
}));
//


//home
const homePage = require('./router/home');
app.use('/home', homePage);

//login
const userLogin = require('./router/login');
app.use('/login', userLogin);
//add nhan vien
const userNhanVien = require('./router/nhanvien.js');
app.use('/', userNhanVien);
//product
const userProduct = require('./router/product');
app.use('/', userProduct);
//acount 
const userAcount = require('./router/acount');
app.use('/', userAcount);
//regisst
const userRegisst = require('./router/regist');
app.use('/regist', userRegisst);

app.listen(4050);