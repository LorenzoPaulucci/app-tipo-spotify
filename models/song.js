const {Schema, model} = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const SongSchema = Schema({
    album:{type: Schema.Types.ObjectId, ref: "Album"},
    track: {type: Number, required: true},
    name: {type: String, required: true},
    duration: {type: String, required: true},
    file: {type: String, default: "default.mp3"},
    created_at: {type: Date, default: Date.now}
})

SongSchema.plugin(mongoosePaginate)

module.exports = model("Song", SongSchema, "songs") 