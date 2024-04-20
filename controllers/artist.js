const Artist = require("../models/artist");
const Album = require("../models/album");
const Song = require("../models/song");
const fs = require("fs");
const path = require("path");

const save = async (req, res) => {
    let params = req.body;

    let artist = new Artist(params);

    try {
        let artistSaved = await artist.save();
        return res.status(200).send({ status: "success", artistSaved });
    } catch (err) {
        return res.status(500).send({ status: "error", message: err.message });
    }
}

const oneArtist = async (req, res) => {
    const artistId = req.params.id;

    try {
        let artist = await Artist.findById(artistId);
        return res.status(200).send({ status: "success", artist });
    } catch (err) {
        return res.status(500).send({ status: "error", message: err.message });
    }
}

const list = async (req, res) => {
    let page = 1
    if (req.params.page) page = parseInt(req.params.page)

    const options = { sort: { name: 1 }, limit: 10, };
    try {
        const result = await Artist.paginate({}, options)
        const { docs: artists, totalDocs: total } = result
        return res.status(200).send({ status: "success", total, artists });
    } catch (err) {
        return res.status(500).send({ status: "error", message: err.message });
    }
}

const update = async (req, res) => {
    const id = req.params.id;
    const data = req.body;

    try {
        const artistUpdated = await Artist.findByIdAndUpdate(id, data, { new: true });
        return res.status(200).send({ status: "success", artistUpdated });
    } catch (err) {
        return res.status(500).send({ status: "error", message: err.message });
    }
}

const remove = async (req, res) => {
    const id = req.params.id;

    try {
        const artistRemoved = await Artist.findByIdAndDelete(id);
        const albumsRemoved = await Album.find({ artist: id });

        albumsRemoved.forEach(async (album) => { // haces un bucle para borrar todos los albumes y todas las canciones del artista

            await Song.findOneAndDelete({ album: album._id });
            await Album.findOneAndDelete({ _id: album._id });
        });
        return res.status(200).send({ status: "success", artistRemoved });
    } catch (err) {
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
        const imageUpdated = await Artist.findByIdAndUpdate({ _id: id }, { image: image.filename }, { new: true });
        console.log(imageUpdated)
        if (!imageUpdated) return res.status(400).send({ status: "error", message: "Ha habido un error al actualizar la imagen" });

        return res.status(200).send({ status: "succes", message: "Se ha actualizado correctamente", image: imageUpdated.image });
    } catch (err) {
        return res.status(500).send({ status: "error", message: err.message });
    }

}
const image = async (req, res) => {

    const user = await Artist.findOne({ name: req.params.name });
    const file = user.image;
    const filePath = `./uploads/artists/${file}`;
    console.log(filePath)

    fs.stat(filePath, (err, image) => {
        if (err || !image) return res.status(400).send({ status: "error", message: "La imagen no existe" });
        return res.sendFile(path.resolve(filePath))
    })
}

module.exports = { save, oneArtist, list, update, remove, upload, image }