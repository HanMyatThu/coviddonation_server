const auth = (req,res,next) => {
    try {
       
        const whiteList = ['https://riceatm.azurewebsites.net','https://www.riceatm.org'];
        const requestedUrl = req.headers.origin;

        const isWhitelist = whiteList.filter((list) => list === requestedUrl);
        if(isWhitelist.length === 0) {
            return res.status(403).send({ error: true, message: "No permission"})
        }

        next();

    } catch(e) {
        res.send({ error: true, message: "No permission"});
    }
}

module.exports = auth;