const { addJournal, getJournals, getUserJournal, getJournalbyId, updateJournal, deleteJournal } = require('../controllers/journalController');
const upload = require('../middlewares/multer');
const router = require('express').Router();
const {checkUser}  = require('../middlewares/auth');
const { categoriesFeedback } = require('../controllers/llmController');
const multer = require('multer');


const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
    }
});



const uploads = multer({ storage: storage });


router.post('/uploads',checkUser,uploads.single('image'),addJournal);
router.get('/getJournals',checkUser,getJournals);
router.get('/getUserJournal',checkUser,getUserJournal);
router.post('/getJournalbyId',checkUser,getJournalbyId);
router.patch('/updateJournal',checkUser,updateJournal)
router.post('/deleteJournal',checkUser,deleteJournal)
router.post('/generateblog',checkUser,categoriesFeedback)



module.exports = router;