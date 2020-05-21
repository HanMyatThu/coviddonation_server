const crypto = require('crypto');

const key = Buffer.from([10,20,30,40,50,60,10,20,30,40,50,60,10,20,20,10,10,20,30,40,50,60,10,20,30,40,50,60,10,20,20,10]);
const iv = Buffer.from([10,20,30,40,50,60,10,20,30,40,50,60,10,20,20,10]);

async function encryptString(text) {
    let cipher =  crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
   }

async function decryptString(text) {
    const [ivdata, encryptedData] = text.split(':');
    let iv = Buffer.from(ivdata, 'hex');
    let encryptedText = Buffer.from(encryptedData, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

module.exports = {
    encryptString,
    decryptString
}