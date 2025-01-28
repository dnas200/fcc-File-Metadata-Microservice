const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const multer = require('multer')
const upload = multer({ dest: 'uploads' })


const client = new MongoClient(process.env.DB_connect);
const db = client.db('File_Metadata_Microservice');
const collection = db.collection('MetadataMicroservice');

const app = express();

app.use(cors());
app.use(bodyParser.json())
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


app.post('/api/fileanalyse' , upload.single('upfile') ,async (req, res) => {
    const fileUpload = req.file;

    const insertFile = await collection.insertOne({fileUpload})
    try {
        if (!insertFile) {
            res.status(404).json({Failed: 'Failed to upload file'})
            return
        }else {
            await collection.findOne({fileUpload});

            res.status(401).json({Success: 'File uploaded successfully', 
                name: fileUpload.originalname, 
                type: fileUpload.mimetype, 
                size: fileUpload.size
            })
        }

    } catch (err) {
        res.status(500).json({error: err})
    }

    
    
})


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
