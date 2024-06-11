const {journalModel} = require('../models/journalSchema');

const getJournalbyId = async (req, res) => {
    try{
        const id = req.body.id;
        console.log(id)
        const journal = await journalModel.findOne({_id:id});
        return res.status(200).json({error:false, message:journal});
    }
    catch(err){
        res.status(500).json({error:true, message:err.message});
    }
}

const getUserJournal = async (req, res) => {
    try{ 
        const journals = await journalModel.find({userName: req.user.userName});
        return res.status(200).json({error:false, message:journals});
    }
    catch(err){
        res.status(500).json({error:true, message:err.message});
    }
}

const addJournal = async (req, res) => {
    try {
        const { id, title, description, journalContent, author } = req.body;
        const userName = req.user.userName;
        let existingJournal;
        const imageFile = req.file ? req.file.path : null;
        const image = `${process.env.BACKEND_URL}/${imageFile}`
        console.log(image)
        if (id) {
            existingJournal = await journalModel.findById(id);
        }
        if (existingJournal) {
            existingJournal.title = title;
            existingJournal.description = description;
            existingJournal.journalContent = journalContent;
            if (image) {
                existingJournal.image = image; 
            }
            existingJournal.author = author;
            await existingJournal.save();

            return res.status(200).json({ error: false, message: "Journal Updated" });
        } else {
            await journalModel.create({
                title,
                description,
                journalContent,
                author,
                userName,
                image, 
            });
            return res.status(200).json({ error: false, message: "Journal Added" });
        }
    } catch (err) {
        return res.status(500).json({ error: true, message: err.message });
    }
};

const updateJournal = async(req,res)=>{
    try{
       const username = req.body.userName;
       const title = req.body.title;
       const description = req.body.description;
       const journalContent = req.body.journalContent;
       const image = req.file.path;
       const author = req.body.author;
       const doc = await journalModel.updateOne({userName:username,title:title})
    }catch(err){
       console.log(err)
    }
}

const deleteJournal = async(req,res)=>{
    const userName = req.body.userName;
    const title = req.body.title;
    try{
    const doc = await journalModel.deleteOne({userName:userName,title:title});
    return res.status(200).json({error:false,message:"successfully deleted"})
    }catch(err){
        return res.status(404).json({error:true,message:"deletion failed"})
    }
}

const getJournals = async (req, res) => {
    try{
        const journals = await journalModel.find({});
        return res.status(200).json({error:false, journals});
    }
    catch(e){
        return res.status(500).json({error:true, message:e.message});
    }
}

module.exports = { addJournal, getJournals, getUserJournal, getJournalbyId,updateJournal,deleteJournal }