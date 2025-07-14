import mongoose from 'mongoose';
const noteSchema = new mongoose.Schema({
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    fileUrl:{
        type: String,
        required: false
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    public_id: {
    type: String,
    required: false // added field to track Cloudinary file for deletion
    }

},{timestamps:true});

const Note = mongoose.model('Note', noteSchema);
export default Note;