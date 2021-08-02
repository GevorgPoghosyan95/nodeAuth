const Router = require('express').Router
const UserController = require('../controllers/user-controller')
const createUserSchema = require('../request/createUser')
const createUserMiddleware = require('../middlewares/createUser-middleware')


const router = new Router();

router.post('/registration',createUserMiddleware(createUserSchema), UserController.registration);
router.post('/login',UserController.login);
router.post('/logout',UserController.logout);
router.get('/refresh',UserController.refresh);
router.get('/users',UserController.getUsers);

module.exports = router