const User = require("../models/user");
const { validate, validateUpdate } = require("../helpers/validate");
const bcrypt = require("bcrypt");
const jwt = require("../helpers/jwt");
const fs = require("fs");
const path = require("path");

const register = async (req, res) => {

    const params = req.body;
    if (!validate(params)) {
        return res.status(400).send({ status: "error", message: "Faltan datos por enviar" });
    }

    try {
        const userRegistered = await User.find({ $or: [{ email: params.email.toLowerCase() }, { nick: params.nick.toLowerCase() }] })
        if (userRegistered.length >= 1) return res.status(200).send({ status: "error", message: "El usuario ya existe" });

    } catch (err) {
        return res.status(500).send({ status: "error", message: err.message });
    }

    //encriptar password
    let pwd = await bcrypt.hash(params.password, 10);
    params.password = pwd;

    let user_to_save = new User(params);
    let userSaved = await user_to_save.save();
    if (!userSaved) return res.status(500).send({ status: "error", message: "Ha habido un error al registrar el usuario" });

    //elinimar datos sensibles
    const { password, email, __v, ...user } = userSaved.toObject();

    return res.status(200).send({ status: "succes", message: "Se ha registrado correctamente", user });
}

const login = async (req, res) => {

    const params = req.body;
    if (!params.nick || !params.password) return res.status(400).send({ status: "error", message: "Faltan datos por enviar" });

    try {
        const userFound = await User.findOne({ nick: params.nick })
        if (!userFound) return res.status(404).send({ status: "error", message: "El usuario no existe" });

        //comprobar password
        const pwd = await bcrypt.compare(params.password, userFound.password)
        if (!pwd) return res.status(401).send({ status: "error", message: "La contraseña es incorrecta" });

        //token jwt
        const token = jwt.createToken(userFound);
        if (!token) return res.status(500).send({ status: "error", message: "Ha habido un error al crear el token" });

        return res.status(200).send({ status: "succes", message: "Se ha registrado correctamente", nick: userFound.nick, token: token });
    } catch (err) {
        return res.status(500).send({ status: "error", message: err.message });
    }

}

const profile = async (req, res) => {


    try {
        const userFound = await User.findOne({ nick: req.params.nick });
        if (!userFound) return res.status(404).send({ status: "error", message: "El usuario no existe" });

        const { password, email, __v, ...user } = userFound.toObject();

        return res.status(200).send({ status: "succes", user });
    } catch (err) {
        return res.status(500).send({ status: "error", message: err.message });
    }
}

const update = async (req, res) => {
    let userIdentity = req.user;
    let userToUpdate = req.body;
    if (!validateUpdate(userToUpdate)) return res.status(400).send({ status: "error", message: "Los datos a actualizar no son validos" });

    try {
        const userFound = await User.find({ $or: [{ nick: userToUpdate.nick?.toLowerCase() }, { email: userToUpdate.email?.toLowerCase() }] });
        if (userFound.length >= 1) {
            if (userFound[0].email == userToUpdate.email) return res.status(400).send({ status: "error", message: "El email ya existe" });
            if (userFound[0].nick == userToUpdate.nick) return res.status(400).send({ status: "error", message: "El nick ya existe" });
        }
    }
    catch (err) { return res.status(500).send({ status: "error", message: err.message }); }

    if (userToUpdate.password) {
        let pwd = await bcrypt.hash(userToUpdate.password, 10);
        userToUpdate.password = pwd;
    }

    try {
        const userUpdated = await User.findByIdAndUpdate({ _id: userIdentity.id }, userToUpdate, { new: true });
        if (!userUpdated) return res.status(400).send({ status: "error", message: "Ha habido un error al actualizar el usuario" });

        return res.status(200).send({ status: "succes", message: "Se ha actualizado correctamente", userToUpdate });
    } catch (err) { return res.status(500).send({ status: "error", message: err.message }); }
}

const upload = async (req, res) => {

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
        const avatarUpdated = await User.findByIdAndUpdate({ _id: req.user.id }, { image: image.filename }, { new: true });
        if (!avatarUpdated) return res.status(400).send({ status: "error", message: "Ha habido un error al actualizar la imagen" });

        return res.status(200).send({ status: "succes", message: "Se ha actualizado correctamente", image: avatarUpdated.image });
    } catch (err) {
        return res.status(500).send({ status: "error", message: err.message });
    }

}
const avatar = async (req, res) => {

    const user = await User.findOne({ nick: req.params.nick });
    const file = user.image;
    const filePath = `./uploads/avatars/${file}`;
    console.log(filePath) 
    
    fs.stat(filePath, (err, image) => {
        if (err || !image) return res.status(400).send({ status: "error", message: "La imagen no existe" });
        return res.sendFile(path.resolve(filePath))
    })
}


module.exports = { register, login, profile, update, upload, avatar };

