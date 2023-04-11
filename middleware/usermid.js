exports.check_login = (req, res, next) => {
    if (req.session.userLogin) {
        next();
    } else {
        res.redirect('/login');
    }

};
//phân quyền
exports.phan_quyen = (req, res, next) => {
    if (req.session.status === 0) {
        next();
    } else {
        res.redirect('/home');
    }
}