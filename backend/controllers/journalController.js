const {journalModel} = require('../models/journalSchema');
const {journalValidationSchema} = require('../validation/validation');

const addJournal = async (req, res) => {
    try{
        const title = req.body.title;
        const description = req.body.description;
        const journalContent = req.body.journalContent;
        const image = req.body.image;
        const author = req.body.author;
        const userName = req.body.userName;

        const {error, value} = journalValidationSchema.validate(req.body);
        if(error){
            return res.status(400).json({error:true, message:error.details[0].message});
        }

        try{
            const doc = await journalModel.create({title: title, description: description, journalContent: journalContent, image: image, author: author, userName: userName});
            return res.status(200).json({error:false, message:"Journal Added"});
        }
        catch(err){
            return res.status(500).json({error:true, message:err.message});
        }
    }
    catch(e){
        return res.status(404).json({error:true, message:e.message});
    }
}

module.exports = { addJournal }