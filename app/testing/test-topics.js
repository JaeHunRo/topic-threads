var request = require('supertest');
var server = request.agent('http://localhost:3001');
var cookie;

server
.post('/login')
.send({username: 'philphoo95@gmail.com', password: 'fredperry516'})
.end(function(err, res){
	cookie = res.headers['set-cookie'];
	console.log(res);
});

var sampleTopic = {
	title: "Poop",
    description: "Poop description",
    category: "Toiletries",
    user_id: "1"
};

// server
// .post('/api/topics')
// .send(sampleTopic)
// .expect(200)
// .end(function(err, res){
// 	console.log(res);
// });

