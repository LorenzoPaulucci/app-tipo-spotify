const express = require("express");
const router = express.Router();
const AlbumController = require("../controllers/album");
const check = require("../middlewares/auth");
const multer = require("multer");
// configuracion de subida de archivos (middleware)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/albums/")
    },
    filename: (req, file, cb) => {
        cb(null, `avatar-${Date.now()}-${file.originalname}`)
    }

});
const uploads = multer({storage});

router.post("/save", check.auth, AlbumController.save);
router.get("/one/:id", check.auth, AlbumController.one);
router.get("/list/:id", check.auth, AlbumController.list);
router.put("/update/:id", check.auth, AlbumController.update);
router.post("/upload/:id", [check.auth, uploads.single("file0")], AlbumController.upload);
router.get("/image/:title", check.auth, AlbumController.image);
router.delete("/remove/:id", check.auth, AlbumController.remove);

module.exports = router;