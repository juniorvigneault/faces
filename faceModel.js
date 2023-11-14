const mongoose = require("mongoose");

const FaceSchema = new mongoose.Schema({
    index: {
        type: Number
    },
    x: {
        type: Number
    },
    y: {
        type: Number
    },
    angle: {
        type: Number
    },
    vertices: {
        type: [{
            x: Number,
            y: Number
        }]
    },
    imagePath: {
        type: String
    },
});

const Face = mongoose.model("Face", FaceSchema);

module.exports = Face;