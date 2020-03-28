const express = require('express');
const bodyParser = require('body-parser');
const mongoose =require('mongoose');
const multer = require('multer');
const shortid=require('shortid');
const path=require('path');

const signroutes = require('./routes/signup');

const app = express();

const fileStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'images');
    },
    filename:(req,file,cb)=>{
        cb(null,shortid.generate().toString()+file.originalname);
    }
});

const fileFilter = (req,file,cb)=>{
    if(
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null,true);
    }
    else {
        cb(null,false);
    }
}

app.use(bodyParser.json());
app.use('/images',express.static(path.join(__dirname,'images')));
app.use(
    multer({storage:fileStorage,fileFilter:fileFilter}).single('image')
);

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Acess-Control-Allow-Methods','*');
    res.setHeader('Aceess-Control-Allow-Headers','Content-Type, Authorization');
    next();
})

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message });
 });
  
app.use('/sign',signroutes);

mongoose.connect(
    'mongodb+srv://admin:fbfuKOUSXQOLiIqF@cluster0-voers.gcp.mongodb.net/stickman?retryWrites=true&w=majority'
)
.then(result=>{
    app.listen(8080);
})
.catch(err=>console.log(err));
