const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const user = require('../models/user');
const User = require('../models/user')

const transporter = nodemailer.createTransport(sendGridTransport({
    auth: {
        api_key: "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",
    }
}));

exports.getLogin = (req, res, next) => {
    let message = req.flash('error')
    message = message.length > 0 ? message[0] : null
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message
    })
}
exports.postLogin = (req, res, next) => {
    const { email, password } = req.body
    user.findOne({ email: email })
        .then(async user => {
            if (!user) {
                req.flash('error', 'Invalid Email or Password')
                return res.redirect('/auth/login')
            }
            return { result: await user.comparePass(password), user }
        })
        .then(({ result, user }) => {
            console.log('jsjsj', result);
            if (result) {
                req.session.isLoggedIn = true;
                req.session.user = user;
                return req.session.save(err => {
                    console.log(err)
                    return res.redirect('/shop')
                })
            } else {
                req.flash('error', 'Invalid Email or Password')
                res.redirect('/auth/login')
            }
        })
        .catch(err => {
            console.log(err);
        })
}
exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        res.redirect('/shop')
    });
}
exports.getSignUp = (req, res, next) => {
    let message = req.flash('error')
    message = message.length > 0 ? message[0] : null
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message
    })

}
exports.postSignUp = (req, res, next) => {
    const { email, password, name, confirmPassword } = req.body
    User.findOne({ email })
        .then(user => {
            console.log('user=>', user);
            if (user) {
                req.flash('error', 'E-mail Already Exists')
                return res.redirect('/auth/signup')
            } else {
                const newUser = new User({
                    email: email,
                    password: password,
                    name: name,
                    cart: {
                        items: []
                    }
                })
                return newUser.save()
            }
        })
        .then(result => {
            if (result) {
                res.redirect('/auth/login')
            }
            return transporter.sendMail({
                to: email,
                from: "nikhilcares22@gmail.com",
                subject: "Signup succeeded",
                html: '<h1>Sign up done!!!</h1>',
            })/* .then(e => console.log(e)) */.catch(err => {
                console.log(err);
            })
        })
        .catch(err => {
            console.log(err)
        })
}
exports.getReset = (req, res, next) => {
    let message = req.flash('error')
    message = message.length > 0 ? message[0] : null
    res.render("auth/reset", {
        path: "/reset",
        pageTitle: "Reset Password",
        errorMessage: message,
    })
}
exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err)
            return res.redirect('/reset')
        }
        const token = buffer.toString('hex')
        user.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    req.flash('error', 'No Account with That email found');
                    return res.redirect('/reset')
                }
                user.resetToken = token
                user.resetTokenExpiration = Date.now() + 3600000
                return user.save()
            })
            .then(result => {
                res.redirect('/shop')
                return transporter.sendMail({
                    to: req.body.email,
                    from: "nikhilcares22@gmail.com",
                    subject: "Reset Password",
                    html: `<p>you have requested a password reset</p>
                    <p>
                    Click on this link to set a new password
                    <a href="https://localhost:3000/auth/reset/${token}">Link</a>
                    </p>
                    `,
                })/* .then(e => console.log(e)) */
                    .catch(err => {
                        console.log(err);
                    })
            })
            .catch(err => {
                console.log(err)
            })
    })
}