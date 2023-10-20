const mongoose = require("mongoose");


const promptSchema = new mongoose.Schema({

    userID: {
        type: String,
        required: true
    },
    category: {
        type: String,
        require: true
    },
    topic: {
        type: String,
        require: true
    },
    content: {
        type: String,
        required: true
    }
});

const promptModel = mongoose.model("prompt", promptSchema);

module.exports = promptModel;
