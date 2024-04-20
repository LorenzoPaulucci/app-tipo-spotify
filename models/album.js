const {Schema, model} = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const AlbumSchema = Schema({
    artist:{type: Schema.Types.ObjectId, ref: "Artist"},
    title: {type: String, required: true},
    description: {type: String},
    year: {type: Number, required: true},
    image: {type: String, default: "default.jpg"},
    created_at: {type: Date, default: Date.now}
})

AlbumSchema.plugin(mongoosePaginate)

module.exports = model("Album", AlbumSchema, "albums")