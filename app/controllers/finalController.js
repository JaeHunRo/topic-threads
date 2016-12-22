function sendResults(req, res){
	res.status(200).send(req.result);
}

module.exports = {
	sendResults: sendResults
};