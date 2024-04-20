const Album = require("../models/album");
const Artist = require("../models/artist");
const Song = require("../models/song");
const fs = require("fs");
const path = require("path");

const save = async (req, res) => {
    let params = req.body;
    const album = new Album(params);

    try {
        let albumSaved = await album.save();
        return res.status(200).send({ status: "success", albumSaved });
    } catch (err) {
        return res.status(500).send({ status: "error", message: err.message });
    }
}

const one = async (req, res) => {
    albumId = req.params.id;

    try {
        let album = await Album.findById(albumId).populate("artist");
        return res.status(200).send({ status: "success", album });
    } catch (err) {
        return res.status(500).send({ status: "error", message: err.message });
    }
}

const list = async (req, res) => {
    const artistId = req.params.id;

    try {
        let albums = await Album.find({ artist: artistId }).select("-artist -__v");
        let artist = await Artist.findById(artistId).select("-_id -__v");
        
        return res.status(200).send({ status: "success", artist, albums });
    }
    catch (err) {
        return res.status(500).send({ status: "error", message: err.message });
    }
}

const update = async (req, res) => {
    const id = req.params.id;
    const data = req.body;

    try {
        const albumUpdated = await Album.findByIdAndUpdate(id, data, { new: true });
        return res.status(200).send({ status: "success", albumUpdated });
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

    if (extension != "jpg" && extension != "png" && extension != "jpeg" && extension != "svg") {
        const filePath = image.path;
        fs.unlinkSync(filePath);

        return res.status(400).send({ status: "error", message: "La extension de la imagen no es valida" });
    }
    try {
        const imageUpdated = await Album.findByIdAndUpdate({ _id: id }, { image: image.filename }, { new: true });
        console.log(imageUpdated)
        if (!imageUpdated) return res.status(400).send({ status: "error", message: "Ha habido un error al actualizar la imagen" });

        return res.status(200).send({ status: "succes", message: "Se ha actualizado correctamente", image: imageUpdated.image });
    } catch (err) {
        return res.status(500).send({ status: "error", message: err.message });
    }

}
const image = async (req, res) => {

    const album = await Album.findOne({ title: req.params.title });
    const file = album.image;
    const filePath = `./uploads/albums/${file}`;
    console.log(filePath) 
    
    fs.stat(filePath, (err, image) => {
        if (err || !image) return res.status(400).send({ status: "error", message: "La imagen no existe" });
        return res.sendFile(path.resolve(filePath))
    })
}

const remove = async (req, res) => {
    const id = req.params.id;

    try {
        const albumRemoved = await Album.findByIdAndDelete(id);
        albumRemoved && await Song.deleteMany({ album: albumRemoved._id });

        return res.status(200).send({ status: "success", albumRemoved });
    } catch (err) {
        return res.status(500).send({ status: "error", message: err.message });
    }
}


module.exports = { save, one, list, update, upload, image, remove }