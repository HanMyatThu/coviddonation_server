const {
    StorageSharedKeyCredential,
    BlobServiceClient
    } = require('@azure/storage-blob');

const {AbortController} = require('@azure/abort-controller');
const path = require("path");
const STORAGE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const ACCOUNT_ACCESS_KEY = process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY;
const containerName = process.env.CONTAINER_NAME;

const ONE_MINUTE = 60 * 1000;

async function uploadLocalFile(aborter, containerClient, filePath) {
    filePath = path.resolve(filePath);

    const fileName = path.basename(filePath);

    const blobClient = containerClient.getBlobClient(fileName);
    const blockBlobClient = blobClient.getBlockBlobClient();

    return await blockBlobClient.uploadFile(filePath,aborter);
}

async function uploadImageToAzure(file) {
    try {
        const credentials = new StorageSharedKeyCredential(STORAGE_ACCOUNT_NAME, ACCOUNT_ACCESS_KEY);

        const blobServiceClient = new BlobServiceClient(`https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,credentials);

        const containerClient = blobServiceClient.getContainerClient(containerName);
    
        const aborter = AbortController.timeout(30 * ONE_MINUTE);
        await uploadLocalFile(aborter, containerClient, file);
        console.log('file is uploaded')
    } catch(e) {
        res.send(401).send({ error: true, message: "Unable to upload image to azure"})
    }
}

module.exports = {uploadImageToAzure}