const router = require('express').Router();
const {signup, login,getUser} = require('../controllers/userController');
const {checkUser}  = require('../middlewares/auth')

router.post('/signup', signup);
router.post('/login', login);
router.get('/getUser',checkUser,getUser)


module.exports = router;