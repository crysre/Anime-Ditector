
import express from "express";
import bodyParser from "body-parser";
import  axios from "axios";
import multer from "multer";
import path from "path";
import fs from 'fs';
import FormData from 'form-data';

const __dirname = path.resolve();

const app = express();
const port = 3000;


//using multer for the first time

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'uploads/');
    },
    filename: (req, file, cb)=>{
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({storage: storage});


app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", (req, res)=>{
    res.render("index.ejs")
});

app.post("/postUrlFile", upload.single('image'), async (req, res)=>{
    const filePath = req.file.path
    const formData = new FormData();
    formData.append('image', fs.createReadStream(filePath));

    const result = await axios.post("https://api.trace.moe/search", formData)
    const data = result.data

    console.log(data)
    
    res.render("index.ejs", {data: data})
})



app.listen(port, ()=>{
    console.log(`Server is running on port: ${port}`)
});


