const express = require("express");
const router = express.Router();
const ArtistController = require("../controllers/artist");
const check = require("../middlewares/auth");
const multer = require("multer");
// configuracion de subida de archivos (middleware)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/artists/")
    },
    filename: (req, file, cb) => {
        cb(null, `avatar-${Date.now()}-${file.originalname}`)
    }

});
const uploads = multer({storage});

router.post("/save", check.auth, ArtistController.save);
router.get("/one/:id", ArtistController.oneArtist);
router.get("/list/:page?", ArtistController.list);
router.put("/update/:id", check.auth, ArtistController.update);
router.delete("/remove/:id", check.auth, ArtistController.remove);
router.post("/upload/:id", [check.auth, uploads.single("file0")], ArtistController.upload);
router.get("/image/:name", check.auth, ArtistController.image);

module.exports = router;