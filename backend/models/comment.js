const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
        required : true
    },
    postId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "post",
        required : true
    },
    content : {
        type : String,
        required : true,
        trim : true
    }
}, {timestamps : true});

commentSchema.index({ postId: 1, createdAt: -1 });
commentSchema.index({ userId: 1 });

module.exports = mongoose.model("comment" , commentSchema);