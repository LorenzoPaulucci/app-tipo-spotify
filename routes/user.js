const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");
const check = require("../middlewares/auth");
const multer = require("multer");
// configuracion de subida de archivos (middleware)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/avatars/")
    },
    filename: (req, file, cb) => {
        cb(null, `avatar-${Date.now()}-${file.originalname}`)
    }

});
const uploads = multer({storage});

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/profile/:nick", check.auth, UserController.profile);
router.put("/update", check.auth, UserController.update);
router.post("/upload", [check.auth, uploads.single("file0")], UserController.upload);
router.get("/avatar/:nick", check.auth, UserController.avatar);

module.exports = router;