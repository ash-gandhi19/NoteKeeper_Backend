const router = require('express').Router();
let User = require('../models/usersModel');
let UserSession = require('../models/userSessionModel');

// Get all
router.route('/').get((req, res) => {
    User.find()
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error :' + err));

});


// Get all sessions
router.route('/sessions').get((req,res) => {
    UserSession.find()
        .then(session => res.json(session))
        .catch(err => res.status(400).json('Error: ' +err));
});

// Get one (Login)
router.route('/findOne').post((req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    // 1. Find user
    User.findOne({
            email: email    
        })
        .then(user => {
            if (user) {
                if (user.validPassword(password)) {

                    // 2. Create user session
                    const userSession = new UserSession();
                    userSession.userId = user._id;
                    userSession.save((err, doc) => {
                        if (err) {
                            return res.json({
                                success: false,
                                message: 'Error: server error'
                            });
                        }
                        return res.json({
                            success: true,
                            message: 'Sign in successful',
                            token: doc._id,
                            userId: user._id,
                            fullname: user.fullname
                        });

                    });
                } else {
                    res.json("Credentials wrong!");
                }
            } else {
                res.json("User not found");
            }
        })
        .catch(err => res.status(400).json('Error! :' + err));
});

// Add (Register)
router.route('/add').post((req, res) => {
    const fullname = req.body.fullname;
    const email = req.body.email;
    const password = req.body.password;

    // 1. Verify email
    User.find({
        email: email
    }, (err, previousUsers) => {

        if (err) {
            return res.json({
                success: false,
                message: 'Error: Server error',
            });
        } else if (previousUsers.length > 0) {
            return res.json({
                success: false,
                message: 'Account already exist.'
            });
        }

        // 2. Save new user
        const newUser = new User({
            fullname,
            email
        });
        newUser.password = newUser.generateHash(password);

        newUser.save()
            .then(user => {
                res.json({
                    success: true,
                    message: 'Sign Up Successful!'
                });
            })
            .catch(err => res.status(400).json('Error :' + err));
    });

});

// Verify token
router.route('/verify').get((req, res) => {
    // Get the token
    const {
        query
    } = req;
    const {
        token
    } = query;

    // Verify the token is one of a kind and it's not deleted.

    UserSession.find({
        _id: token,
        isDeleted: false
    }, (err, sessions) => {
        if (err) {
            return res.json({
                success: false,
                message: 'Error: Server error'
            });
        }

        if (sessions.length != 1) {
            return res.json({
                success: false,
                message: 'Error: Invalid'
            });
        } else {
            return res.json({
                userId: sessions[0].userId,
                success: true,
                message: 'Good'
            });
        }
    });
});


// Logout
router.route('/logout').get((req, res) => {
    const {
        query
    } = req;

    const {
        token
    } = query;

    UserSession.findOneAndUpdate({
        _id: token,
        isDeleted: false
    }, {
        $set: {
            isDeleted: true
        }
    }, null, (err, sessions) => {
    
        if (err) {
            return res.json({
                success: false,
                message: 'Error: Server error'
            });
        }
        return res.json({
            success: true,
            message: 'Logout successfully'
        });
    });
})




// Details
router.route('/:id').get((req, res) => {
    User.findById(req.params.id)
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err));
});


// Update
router.route('/update/:id').post((req, res) => {

    User.findById((req.params.id))
        .then(user => {

            user.fullname = req.body.fullname;
            user.email = req.body.email;
            user.password = req.body.password;

            user.save()
                .then(() => res.json('Record was updated!'))
                .catch(err => res.status(400).json('Error :' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));

});

// Delete
router.route('/:id').delete((req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then(user => res.json('Record was deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});


module.exports = router;