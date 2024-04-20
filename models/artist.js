const {Schema, model} = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const ArtistSchema = Schema({
    name:{type: String, required: true},
    description: {type: String},
    image: {type: String, default: "default.jpg"},
    created_at: {type: Date, default: Date.now}
})

ArtistSchema.plugin(mongoosePaginate)

module.exports = model("Artist", ArtistSchema, "artists")