const express = require('express');
const expressHbs = require('express-handlebars');
const multer = require('multer');
const bodyParser = require("body-parser");
const app = express()


//giới hạn chuyển trang
// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/uploads', express.static('uploads'));
app.use(express.static('uploads'));

//
app.engine('.hbs', expressHbs.engine({
  extname: "hbs",
  defaultLayout: 'login',
  layoutsDir: "views/layouts/"
}));
//
app.set('view engine', '.hbs');
app.set('views', './views');
//list of array
const users = [];
const product = [];
let name, img, email123, pass123 = '';
let userIndex;
let maSp,
  tenSp,
  priceSp,
  loaiSp,
  codeUser,
  nameUser,
  imgProduct = '';

app.get('/login', (req, res) => {

  res.render('emptyView', {
    layout: 'login',
    name: name,
    email123: email123,
    img: img,
  });
});
//regist
app.get('/dangky', (req, res) => {
  res.render('emptyView', {
    layout: 'regist',
    name: name,
    email123: email123,
    img: img,

  });
});

//show product
app.get('/showProduct', (req, res) => {
  res.render('emptyView', {
    layout: 'showProduct',
    name: name,
    email123: email123,
    img: img,
  })
})
//add product
app.get('/addProduct', (req, res) => {
  res.render('emptyView', {
    layout: 'addproduct',
    name: name,
    email123: email123,
    img: img,
  })
})
//acount
app.get('/acount', (req, res) => {
  res.render('emptyView', {
    layout: 'quanlytaikhoan',
    name: name,
    email123: email123,
    img: img,
    users: users,

  })
})
//hoa don
app.get('/hoadon', (req, res) => {
  res.render('emptyView', {
    layout: 'thanhtoanhoadon',
    name: name,
    email123: email123,
    img: img,
  })
})
//nhan vien
app.get('/addNhanvien', (req, res) => {
  res.render('emptyView', {
    layout: 'addNhanvien',
    name: name,
    email123: email123,
    img: img,
  })
})
//thong tin user
app.get('/getThongTin', (req, res) => {
  res.render('emptyView', {
    layout: 'thongTinUser',
    name: name,
    email123: email123,
    img: img,
  })
})

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

//post update user
const upImg = multer({ storage: storage });


//delete user 
app.post('/deleteU', (req, res) => {
  const getValue = req.body.hello;
  console.log(getValue + " value");
  users.splice(getValue, 1)
  res.send('Xóa ok');
});

//post password
app.post('/changePass', (req, res) => {
  const oldPass = req.body.olPass;
  const newPass = req.body.newPass;
  const newPass2 = req.body.ChPass;
  console.log(`Pass 1: ${oldPass}`, `Pass 2: ${newPass}`, `Pass 3: ${newPass2}`);
  //
  res.send('Đổi pass');
})


//login
app.post('/login', (req, res) => {
  const email = req.body.email;
  const pass = req.body.pswd;
  console.log(email + " " + pass);
  let check;
  let errorFlag = false; // tạo biến flag và đặt giá trị mặc định là false

  if (email.trim() === '' || pass.trim() === '' || userIndex == undefined) {
    console.log('test rỗng');
    check = 'Chưa đủ thông tin';
    errorFlag = true; // gán giá trị true cho biến flag
  }
  users.forEach((user, index) => { // sử dụng forEach để lặp qua mảng users
    console.log(user.name + " Tài khoản");
    console.log(user.email + " Tên");
    console.log(user.pass + " Mật khẩu");
    if (email === user.email && pass === user.pass) {
      userIndex = index; // gán index của phần tử vào biến userIndex
      console.log(userIndex + " vị trí của mảng");
      res.redirect('/home');
    }
    else {
      check = "Nhập sai email hoặc password";
      console.log(check + " for");
    }
  });
  if (userIndex !== undefined) { // kiểm tra xem userIndex đã được gán giá trị hay chưa
    const user = users[userIndex]; // lấy thông tin của người dùng tương ứng với vị trí được tìm thấy
    name = user.name;
    img = user.img;
    email123 = user.email;
    pass123 = user.pass;
    console.log(img);

  }
  res.render('emptyView', {
    layout: 'login',
    check: check,
  });
});


//resgite
//array
//home
app.get('/home', (req, res) => {
  console.log(name + "Tên của người dùng");
  res.render('emptyView', {
    layout: 'home',
    name: name,
    img: img,
    email123: email123,
    product: product,
    maSp: product.maSp,
    tenSp: product.tenSp,
    priceSp: product.priceSp,
    loaiSp: product.loaiSp,
    codeUser: product.codeUser,
    nameUser: product.nameUser,
    imgProduct: product.imgProduct,
  })
})



app.post('/dangky', upImg.single('myImage'), (req, res) => {
  const file = req.file
  console.log(file.originalname + 'Hello');

  const email = req.body.email;
  const pass = req.body.pswd;
  const name = req.body.name;
  // const img = 'http://localhost:8888/' + file.originalname;
  const img = 'http://localhost:8888/uploads/' + file.originalname;
  let check;
  if (!email || !pass || !name) {
    // Nếu email hoặc pass rỗng thì thực hiện hành động này
    check = "Chưa đủ thông tin";
    res.render('emptyView', {
      layout: 'regist',
      check: check,
    });
  }
  //
  else {
    const newUser = {
      email,
      pass,
      name,
      img,
    };
    users.push(newUser);
    console.log(users);
    console.log(users.length);
    res.redirect('/login');
  }
});

app.post('/addProduct', upImg.single('myImage'), (req, res) => {
  const file = req.file
  console.log(file.originalname + 'Hello');
  maSp = req.body.maProduct;
  tenSp = req.body.nameProduct;
  priceSp = req.body.priceProduct;
  loaiSp = req.body.loaiProduct;
  codeUser = req.body.codeUser;
  nameUser = req.body.nameUser;
  imgProduct = 'http://localhost:8888/uploads/' + file.originalname;

  const newProduct = { maSp, tenSp, priceSp, loaiSp, codeUser, nameUser, imgProduct }
  product.push(newProduct);
  console.log(product.length);
  console.log(product);
  res.render('emptyView', {
    layout: 'addProduct',
  });



});
app.post('/deleteSp', (req, res) => {
  const getValue = req.body.hello;
  console.log(getValue + " value");
  product.splice(getValue, 1)
  res.redirect('/home');
})
app.post('/updateProduct', upImg.single('myImage'), (req, res) => {
  const getValue = req.body.hello;
  console.log(getValue + " value");
  const selectedProduct = product[getValue];
  console.log(selectedProduct + " selectedProduct");
  res.render('emptyView', {
    layout: 'updateProduct',
    product: selectedProduct
  });
})
app.post('/updateProduct2', upImg.single('myImage'), (req, res) => {
  const file = req.file
  console.log(file.originalname + 'Hello');
  const getValue = req.body.hello;
  console.log(getValue + " value của tôi");
  product.forEach((pr, index) => {
    if (getValue == index) {
      const maSpU = req.body.maProduct;
      const tenSpu = req.body.nameProduct;
      const priceSp = req.body.priceProduct;
      const loaiSp = req.body.loaiProduct;
      const codeUser = req.body.codeUser;
      const nameUser = req.body.nameUser;
      const imgUpPro = 'http://localhost:8888/uploads/' + file.originalname;
      console.log(maSpU + ' của tôi');
      const newPro = { maSp: maSpU, tenSp: tenSpu, priceSp: priceSp, loaiSp: loaiSp, codeUser: codeUser, nameUser: nameUser, imgProduct: imgUpPro }
      product.splice(getValue, 1, newPro);
      res.redirect('/home');
    }
  })
});

//show product
app.post('/showProduct', upImg.single('myImage'), (req, res) => {
  const getValue = req.body.hello;
  console.log(getValue + " value");
  product.forEach((pr, index) => {
    if (getValue == index) {
      res.render('emptyView', {
        layout: 'showProduct',
        product: product,
        maSp: product.maSp,
        tenSp: product.tenSp,
        priceSp: product.priceSp,
        loaiSp: product.loaiSp,
        codeUser: product.codeUser,
        nameUser: product.nameUser,
        imgProduct: product.imgProduct,
      })
    }
  })
})

app.get('/getThongTin', (req, res) => {
  res.render('emptyView', {
    layout: 'updateNhanVien',
  })
})


//update user
app.post('/upUser', upImg.single('myImage'), (req, res) => {
  const getValue = req.body.hello;
  const selectedProduct = users[getValue];
  console.log(selectedProduct + " selectedProduct");
  console.log(getValue + " value của tôi ");
  res.render('emptyView', {
    layout: 'updateNhanVien',
    users: selectedProduct
  });
})
app.post('/updateUser2', upImg.single('myImage'), (req, res) => {
  const getValue = req.body.hello;
  console.log("Value của tôi là: " + getValue);
  const file = req.file
  console.log(file.originalname + 'Hello');

  const email = req.body.email;
  const pass = req.body.pass;
  const name = req.body.name;
  // const img = 'http://localhost:8888/' + file.originalname;
  const img = 'http://localhost:8888/uploads/' + file.originalname;
  const newUser = { email: email, name: name, img: img, pass: pass }
  users.splice(getValue, 1, newUser);
  res.redirect('/home');
})
const port = 8888

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})