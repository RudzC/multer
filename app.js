const express = require("express");
const multer = require("multer");
const ejs = require("ejs");
const path = require("path");

//Set storage engine
const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: function(req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});

//Initialize Upload
const upload = multer({
  storage: storage,
  //set image size
  limits: { fileSize: 3000000 },
  //Specify type of files
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single("myImage");

//Check File
function checkFileType(file, cb) {
  //Allowed extensions
  const filetypes = /jpeg|jpg|png|gif|svg/;
  //check extensions
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  //check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error : Images only!");
  }
}

//init app
const app = express();

//EJS
app.set("view engine", "ejs");

//public folder
app.use(express.static("./public"));

app.get("/", (req, res) => res.render("index"));

app.post("/upload", (req, res) => {
  upload(req, res, err => {
    if (err) {
      res.render("index", {
        msg: err
      });
    } else {
      if (req.file === undefined) {
        res.render("index", {
          msg: "Error: No file selected!"
        });
      } else {
        res.render("index", {
          msg: "File uploaded!",
          file: `uploads/${req.file.filename}`
        });
      }
    }
  });
});

const port = 9000;

app.listen(port, () => console.log(`listening on "${port}"`));
