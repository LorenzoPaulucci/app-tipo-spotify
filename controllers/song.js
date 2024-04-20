const Song = require("../models/song");
const Album = require("../models/album");
const fs = require("fs");
const path = require("path");

const save = async (req, res) => {
    const params = req.body;
    const song = new Song(params);

    try {
        const songSaved = await song.save();
        return res.status(200).send({ status: "success", songSaved });
    }catch(err){
        return res.status(500).send({ status: "error", message: err.message });
    }
}

const songList = async (req, res) => {
    const name = req.params.name;

    try {
        const songs = await Song.find({ name: name}).populate("album");
        return res.status(200).send({ status: "success", songs });
    }catch(err){
        return res.status(500).send({ status: "error", message: err.message });
    }
}

const trackList = async (req, res) => {
    const albumId = req.params.id;

    try {
        const album = await Album.findById(albumId).populate("artist").select("-__v -created_at");
        const songs = await Song.find({ album: albumId }).select("-album -__v");
        return res.status(200).send({ status: "success", album, trackList: songs});
    }catch(err){
        return res.status(500).send({ status: "error", message: err.message });
    }
}

const update = async (req, res) => {
    const id = req.params.id;
    const data = req.body;

    try {
        const songUpdated = await Song.findByIdAndUpdate(id, data, { new: true });
        return res.status(200).send({ status: "success", songUpdated });
    }catch(err){
        return res.status(500).send({ status: "error", message: err.message });
    }
}

const remove = async (req, res) => {
    const id = req.params.id;

    try {
        const songRemoved = await Song.findByIdAndDelete(id);
        return res.status(200).send({ status: "success", songRemoved });
    }catch(err){
        return res.status(500).send({ status: "error", message: err.message });
    }
}

const upload = async (req, res) => {
    let id = req.params.id

    if (!req.file) return res.status(400).send({ status: "error", message: "La peticion no incluye una imagen" });
    let image = req.file;

    const imageSplit = image.originalname.split(".");
    const extension = imageSplit[1];

    if (extension != "mp3" && extension != "ogg") {
        const filePath = image.path;
        fs.unlinkSync(filePath);

        return res.status(400).send({ status: "error", message: "La extension de la imagen no es valida" });
    }
    try {
        const SongUpdated = await Song.findByIdAndUpdate({ _id: id }, { file: image.filename }, { new: true });
        if (!SongUpdated) return res.status(400).send({ status: "error", message: "Ha habido un error al actualizar la imagen" });

        return res.status(200).send({ status: "succes", message: "Se ha actualizado correctamente", song: SongUpdated.file });
    } catch (err) {
        return res.status(500).send({ status: "error", message: err.message });
    }

}
const fileAudio = async (req, res) => {

    const song = await Song.findOne({ name: req.params.name });
    const file = song.file;
    const filePath = `./uploads/songs/${file}`;
    console.log(filePath) 
    
    fs.stat(filePath, (err, file) => {
        if (err || !file) return res.status(400).send({ status: "error", message: "El archivo de audio no existe" });
        return res.sendFile(path.resolve(filePath))
    })
}


module.exports = { save, songList, trackList, update, remove, upload, fileAudio }  


