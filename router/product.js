const express = require('express');
const app = express()
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const ProductAsm = require('../model/product.js');

const mdw = require('../middleware/usermid.js');
//
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


router.get('/addProduct', mdw.check_login , function (req, res) {
    const name = req.session.name;
    const email = req.session.email123;
    const img = req.session.img;
    res.render('emptyView', {
        layout: 'addProduct',
        status: req.session.status,
        name: name,
        img: img,
        email: email,
    });
})
//add product
router.post('/addProduct', upImg.single('myImage'), async (req, res) => {
    await mongoose.connect(uri).then(console.log('Kết nối server thành công'));
    let check = '';
    const file = req.file;
    //retun 
    const nameUser = req.session.name;
    const emailUser = req.session.email123;
    const imgUser = req.session.img;
    if (!file) {
        check = 'Bạn chưa chọn ảnh';
        return res.render('emptyView', {
            layout: 'addProduct',
            check: check,
            name: nameUser,
            img: imgUser,
            email: emailUser,
        });
    }
    console.log(file.originalname + 'Hello');
    const img = 'http://localhost:4050/uploads/' + file.originalname;
    const name = req.body.nameProduct;
    const price = req.body.priceProduct;
    const type = req.body.loaiProduct;
    const color = req.body.mauProduct;
    //check string 
    const regex = /^[0-9]+$/;
    if (regex.test(name)) {
        check = 'Bạn phải nhập chuỗi';
        return res.render('emptyView', {
            layout: 'addProduct',
            check: check,
            name: nameUser,
            img: imgUser,
            email: emailUser,
        });
    }
    //check number
    if (isNaN(price)) {
        check = 'Bạn phải nhập số';
        return res.render('emptyView', {
            layout: 'addProduct',
            check: check,
            name: nameUser,
            img: imgUser,
            email: emailUser,
        })
    }

    const addProduct = new ProductAsm({
        name: name,
        price: price,
        image: img,
        color: color,
        type: type
    });
    let kq = await addProduct.save();
    console.log(kq);
    res.redirect('/home');
});
//update product
router.post('/updateProduct', upImg.single('myImage'), async (req, res) => {
    await mongoose.connect(uri).then(console.log('Kết nối server thành công'));
    //
    const file = req.file;
    if (!file) {
        res.status(400).send('No file uploaded');
        return;
    }
    const id = req.body.hello;
    console.log(id);
    const name = req.body.nameProduct;
    const price = req.body.priceProduct;
    const type = req.body.loaiProduct;
    const color = req.body.color;
    const img = 'http://localhost:4050/uploads/' + file.originalname;
    //update
    try {
        const updateProduct = await ProductAsm.findOneAndUpdate(
            { _id: id },
            { name: name, price: price, type: type, color: color, image: img },
            { new: true }
        );
        console.log(updateProduct);
        res.redirect('/home');
    } catch (err) {
        console.log(err);
        res.send(err);
    }


});
//show layout update
router.get('/update/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);

    res.render('emptyView', {
        layout: 'updateProduct',
        id: req.params.id,
        nameProduct: req.query.name,
        price: req.query.price,
        color: req.query.color,
        type: req.query.type,
        image: req.query.image
    });
});
//delete
router.post('/delete', async (req, res) => {
    await mongoose.connect(uri).then(console.log('Kết nối server thành công'));
    const id = req.body.hello;
    try {
        const deleteProduct = await ProductAsm.deleteOne({ _id: id });
        console.log(deleteProduct);
        res.redirect('/home');
    } catch (err) {
        console.log(err);
        res.send(err);
    }
})
//get layout show product
router.post('/showProduct', upImg.single('myImage'), async (req, res) => {
    await mongoose.connect(uri).then(console.log('Kết nối server thành công'));
    const id = req.body.hello;
    let showProduct = await ProductAsm.find({ _id: id }).lean();
    console.log(showProduct + ' data get về');
    console.log(id);
    res.render('emptyView', {
        layout: 'showProduct',
        product: showProduct,
    })
});
//search product
router.post('/search', async (req, res) => {
    await mongoose.connect(uri).then(console.log('Kết nối server thành công'));
    const search = req.body.search;
    console.log(search);
    let searchProduct = await ProductAsm.find({ name: search }).lean();
    res.render('emptyView', {
        layout: 'home',
        search: searchProduct,
    })
});


module.exports = router;