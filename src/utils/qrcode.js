const QRCode = require('qrcode')
const fs = require('fs')
const path = require('path');
const User = require('../models/User');
const Code = require('../models/Code');
const Qr = require('../models/Qr');
const cryptoRandomString = require('crypto-random-string');
const SMSController = require('../controllers/SmsController');
const BlobStorageController = require('../controllers/BlobStorageController');
const AZURE_LINK = process.env.AZURE_URL;

exports.downloadPNG = async(req,res) => {
  const image = path.join(__dirname,'qr.png');
    try {
        const { name,phone, township,street,city} = req.params;

          const newuser = {
            name ,
            phone,
            township,
            password : '123456',
            street,
            city,
            approved: true,
            qruser: true
          }  
          const existedUser = await User.findOne({ phone});
          if(existedUser) {
            return res.status(400).send({ error : "User already existed"});
          }
          const user = new User(newuser);
          await user.save();
        
          const codeData = {
            owner: user._id
          }
          const code = new Code(codeData);
          const codeExisted = await Code.findOne({ owner: user._id});
          if(codeExisted) {
              return res.status(400).send({ error : "User already have a code"});
          } 
          const firstpart = cryptoRandomString({length: 3, type: 'distinguishable'});
          const secondpart = cryptoRandomString({length: 3, type: 'distinguishable'});
          code.text = `${firstpart}-${secondpart}`;
          await code.save();

        // create QR here
        const qrData = {
          user: user._id,
          code: code._id,
          machine: '5ebfc07eeb2f46182865a043',
          activate: true
        }
        const qrdata = new Qr(qrData);
        await qrdata.save();  

        const option1 = await cryptoRandomString({length: 10, type: 'url-safe'});
        const option2 = await cryptoRandomString({length: 10, type: 'url-safe'});
        const qrText = `https://riceatm-admin.azurewebsites.net/process/qr/${option1}/${qrdata._id}/${option2}`;

        await QRCode.toFile(image,qrText,{
          width: 220,
          height: 220,
          color: {
            dark: '#000',  // Blue dots
            light: '#fff' // Transparent background
          }
        });

        //send SMS to user
        const content = 'စာရင်းပေးသွင်းခြင်းအောင်မြင်ပါသည်။ ၁၀နာရီမှ ၁၂နာရီ ၊ ၂နာရီမှ၄နာရီ ကြား လာရောက်ထုတ်ယူနိုင်ပါသည်။';
        await SMSController.sendSMS(phone,content);

        const file  = await fs.createReadStream(image);
        res.writeHead(200, {'Content-disposition': `attachment; filename=${phone}.png`});
        file.pipe(res); 
    } catch(e) {
        res.status(500).send(e);
    }
}

exports.downloadPNGDefault = async(req,res) => {
  const image = path.join(__dirname,'default-qr.png');
    try {
        const qrData = {
          user: '5ebd1722bfda35a42befcc98',
          code: '5ebd18e5028977a56b74823b',
          machine: '5ebfc07eeb2f46182865a043',
          activate: false
        }
        const qr = new Qr(qrData);
        await qr.save();  
        const qrText = qr._id.toString();
        
        await QRCode.toFile(image,qrText,{
          width: 220,
          height: 220,
          color: {
            dark: '#000',  // Blue dots
            light: '#fff' // Transparent background
          }
        });
        const file  = await fs.createReadStream(image);
        res.writeHead(200, {'Content-disposition': `attachment; filename=qr-default.png`});
        file.pipe(res); 
    } catch(e) {
        res.status(500).send(e);
    }
}

exports.downloadPNGByID = async(req,res) => {
  const image = path.join(__dirname,'qr.png');
    try {
      const id = req.params.qrid;
      const phone = req.params.phone; 
      const option1 = await cryptoRandomString({length: 10, type: 'url-safe'});
      const option2 = await cryptoRandomString({length: 10, type: 'url-safe'});

      const qrText = `https://riceatm-admin.azurewebsites.net/process/qr/${option1}/${id}/${option2}`;

        await QRCode.toFile(image,qrText,{
          width: 220,
          height: 220,
          color: {
            dark: '#000',  // Blue dots
            light: '#fff' // Transparent background
          }
        });

        const file  = await fs.createReadStream(image);
        res.writeHead(200, {'Content-disposition': `attachment; filename=${phone}.png`});
        file.pipe(res); 
    } catch(e) {
        res.status(500).send(e);
    }
}

exports.downloadPNGfromClient = async (req,res) => {
  try { 
        const id = req.params.id;
        const existedUser = await User.findById(id);
        if(!existedUser) {
          return res.status(404).send({ error : "User is not existed"});
        }
        
        const codeData = {
          owner: existedUser._id
        }
        const code = new Code(codeData);
        const firstpart = cryptoRandomString({length: 3, type: 'distinguishable'});
        const secondpart = cryptoRandomString({length: 3, type: 'distinguishable'});
        code.text = `${firstpart}-${secondpart}`;
        await code.save();

      // create QR here
      const qrData = {
        user: id,
        code: code._id,
        machine: '5ebfc07eeb2f46182865a043',
        activate: true
      }
      const qrdata = new Qr(qrData);
      await qrdata.save();  
      const qrText = qrdata._id.toString();
      const image = path.join(__dirname,`${existedUser.phone}.png`);

      await QRCode.toFile(image,qrText,{
        width: 220,
        height: 220,
        color: {
          dark: '#000',  // Blue dots
          light: '#fff' // Transparent background
        }
      });

      //send SMS to user
      const content = 'ဆန်ထုတ်ယူရန် တနင်္လာနေ့ မှ သောကြာနေ့ အတွင်း (၁၀:၀၀ မှ ၁၂:၀၀) (၂:၀၀ မှ ၄:၀၀) ကြား လာရောက်ထုတ်ယူနိုင်ပါပြီ။';
      await SMSController.sendSMS(existedUser.phone,content);

      await BlobStorageController.uploadImageToAzure(image);
      await fs.unlinkSync(image);
      res.send({ link : AZURE_LINK+'/'+existedUser.phone+'.png' }); 
  } catch(e) {
    res.status(500).send(e);
  }
}

exports.downloadQrForRegisteredUser = async(req,res) => {
   try {
      const phone = req.params.id;
      const existedUser = await User.findOne({ phone });
      if(!existedUser) {
        return res.status(404).send({ error : "User not found"});
      }

     const qr = await Qr.findOne({ user: existedUser._id});
     const qrText = qr._id.toString();
     const image = path.join(__dirname,`${phone}.png`);
     
      await QRCode.toFile(image,qrText,{
        width: 220,
        height: 220,
        color: {
          dark: '#000',  // Blue dots
          light: '#fff' // Transparent background
        }
      });

      await BlobStorageController.uploadImageToAzure(image);
      await fs.unlinkSync(image);
      res.send({ link : AZURE_LINK+'/'+phone+'.png' }); 
   } catch(e) {
      res.status(500).send(e);
   }
}