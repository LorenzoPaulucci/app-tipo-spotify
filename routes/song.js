const express = require("express");
const router = express.Router();
const SongController = require("../controllers/song");  
const check = require("../middlewares/auth");
const multer = require("multer");
// configuracion de subida de archivos (middleware)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/songs/")
    },
    filename: (req, file, cb) => {
        cb(null, `song-${Date.now()}-${file.originalname}`)
    }

});
const uploads = multer({storage});

router.post("/save", check.auth, SongController.save);
router.get("/songList/:name", check.auth, SongController.songList);
router.get("/trackList/:id", check.auth, SongController.trackList);
router.put("/update/:id", check.auth, SongController.update);
router.delete("/remove/:id", check.auth, SongController.remove);
router.post("/upload/:id", [check.auth, uploads.single("file0")], SongController.upload);
router.get("/fileAudio/:name", check.auth, SongController.fileAudio);


module.exports = router;