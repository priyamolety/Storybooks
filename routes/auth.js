const express = require('express');
const passport = require('passport');
const router = express.Router()

// Login page auth with google
// GET/
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))


// google auth callback
// get/auth/google/callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/dashboard')
    })



// Logout user
// /auth/logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/')
})


module.exports = router