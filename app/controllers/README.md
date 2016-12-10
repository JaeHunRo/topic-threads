# API Documentation

### Topics API

#### GET All topics page-by-page: /api/topic/pageNum/:pageNum

#### GET Information for one specific topic: /api/topic/:topicId

#### POST A new topic: /api/topic
Request body requires the following fields:
* title
* description
* category

Returns a response with status 200 and message "Topic successfully posted."
Otherwise returns a response with status 400 and message "There was an error posting your topic."




### Opinions API

#### GET all opinions for a particular topic: /api/opinion/topicId/:topicId/pageNum/:pageNum
#### GET a specific opinion: /api/opinion/topicId/:topicId/opinionId/:opinionId
#### POST a new opinion: /api/opinion/topicId/:topicId 






### User API
#### GET User information: /api/user
Simple API call which can be used to check the admin status of a user (Perhaps for delete access?).
Ends up returning an object containing all of the user information. Returned object in format:
```javascript
{
	id: 1,
	fb_id: "10210619611520173",
	username: "Phil Foo",
	admin: true,
	createdAt: "2016-12-06T05:27:21.777Z",
	updatedAt: "2016-12-06T05:27:21.777Z"
}
```