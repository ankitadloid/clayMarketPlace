const express = require('express');
const fs = require('fs');
//const Web3 = require('web3');
const cors = require('cors')
const pinataSDK = require('@pinata/sdk');
const multer = require('multer')
const pinata = pinataSDK('98452b6d3ddade1de540', '5e4dda55f095ad3dce031b18d55c1dd1cca94ad186f16be1415b9eeb0b7b148c');

const diskStore = multer({ 'dest': './tmp' }).single('file');

const app = express()
app.use(express.json());

app.use(cors())

pinata.testAuthentication().then((result) => {
    console.log(result);
}).catch((err) => {
    console.log(err);
});

const itemForSale ={}

app.post("/forSale",async (req,res)=>{

	const modelHash = req.body.modelHash
	const amount = req.body.amount

	if(amount == 0 ){
		if(itemForSale[modelHash])
			delete itemForSale[modelHash]
		return res.json({"data":"deleted"});
	}

	itemForSale[modelHash] = 1;

	return res.json({"data":"ok"});


})


app.get("/forSale",async (req,res)=>{

	return res.json(itemForSale);


})

const itemForRent ={}

app.post("/forRent",async (req,res)=>{

	const modelHash = req.body.modelHash
	const amount = req.body.amount

	if(amount == 0 ){
		if(itemForRent[modelHash])
			delete itemForRent[modelHash]
		return res.json({"data":"deleted"});
	}

	itemForRent[modelHash] = 1;

	return res.json({"data":"ok"});


})

app.get("/forRent",async (req,res)=>{


	return res.json(itemForRent);



})

app.post("/mintNFT", diskStore, async (req, res) => {

    const file = req.file;


    const readStream = fs.createReadStream(file.path);
    pinata.pinFileToIPFS(readStream, {}).then((result) => {

        const jsonData = result;
        jsonData.name = req.body.name;
        jsonData.description = req.body.description
        jsonData.file = result.IpfsHash

        pinata.pinJSONToIPFS(jsonData, {}).then((result2) => {
             res.status(200);
             res.json({ modelHash:result.IpfsHash ,metaDataHash:result2.IpfsHash  });
	     fs.unlink(file.path);
        }).catch((err2) => {
            res.status(500);
            res.json({ err2 });
            console.log(err2);
        });

    }).catch((err) => {
        res.status(500);
        res.json({ err });
        console.log(err);
    });

});



app.listen(3001, () => {
    console.log("Running on port 3001");
})