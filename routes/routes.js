const router = express.Router();
const User = require('../model/User');
const Auth = require('../model/Auth');

router.post('/registerUser', Auth.registerUser)




module.exports = router;