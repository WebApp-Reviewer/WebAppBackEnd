const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { createAdmin, getAdmin, getAdminByUsername } = require('../db/admin');
const { requireUser } = require('./utils');
const { JWT_SECRET = 'neverTell' } = process.env;

// POST /api/admins/login
router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  // request must have both
  if (!username || !password) {
    next({
      name: 'MissingCredentialsError',
      message: 'Please supply both a username and password'
    });
  }

  try {
    const user = await getAdmin({username, password});
    if(!user) {
      next({
        name: 'IncorrectCredentialsError',
        message: 'Username or password is incorrect',
      })
    } else {
      const token = jwt.sign({id: admin.id, username: admin.username}, JWT_SECRET, { expiresIn: '1w' });
      res.send({ admin, message: "you're logged in!", token });
    }
  } catch (error) {
    next(error);
  }
});

// POST /api/admins/register
router.post('/register', async (req, res, next) => {
  try {
    const {username, password} = req.body;
    const queriedAdmin = await getAdminByUsername(username);
    if (queriedAdmin) {
      res.status(401);
      next({
        name: 'AdminExistsError',
        message: 'A admin by that username already exists'
      });
    } else if (password.length < 8) {
      res.status(401);
      next({
        name: 'PasswordLengthError',
        message: 'Password Too Short!'
      });
    } else {
      const admin = await createAdmin({
        username,
        password
      });
      if (!admin) {
        next({
          name: 'AdminCreationError',
          message: 'There was a problem registering you. Please try again.',
        });
      } else {
        const token = jwt.sign({id: admin.id, username: admin.username}, JWT_SECRET, { expiresIn: '1w' });
        res.send({ admin, message: "you're signed up!", token });
      }
    }
  } catch (error) {
    next(error)
  }
})

// GET /api/admins/me
router.get('/me', requireUser, async (req, res, next) => {
  try {
    res.send(req.admin);
  } catch (error) {
    next(error)
  }
})

module.exports = router;