import mongoose from "mongoose";

const promptSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Set to true if you ONLY want logged-in users to use the AI
    },
    role:{
        type:String,
        enum:["user","assistant"],
        required:true
    },
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
  
});

export const Prompt = mongoose.model("Prompt", promptSchema);
