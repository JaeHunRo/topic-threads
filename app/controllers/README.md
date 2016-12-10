# API Documentation

## Topics API

#### GET All topics page-by-page: /api/topic/pageNum/:pageNum
Returns all the topics, sorted in descending order with the most recent first. 
Sample request response:
```javascript
{
	count: 4,
	rows: [
		{
			id: 4,
			title: "Sample Data 4",
			description: "This is a description for sample data 4. SOOO EXCITING.",
			category: "general",
			createdAt: "2016-12-10T07:08:55.993Z",
			updatedAt: "2016-12-10T07:08:55.993Z",
			user_id: 1,
			userPreviouslyVoted: null,  //null if the user has never voted on this topic
			topicAuthor: "Phil Foo",
			upvotes: 0,
			downvotes: 0
		},
		{
			id: 3,
			title: "Sample Data 3",
			description: "This is a description for sample data 3. Kinda boring, I know.",
			category: "general",
			createdAt: "2016-12-10T06:58:04.239Z",
			updatedAt: "2016-12-10T06:58:04.239Z",
			user_id: 1,
			userPreviouslyVoted: true,  //user has upvoted this topic
			topicAuthor: "Phil Foo",
			upvotes: 0,
			downvotes: 0
		},
		{
			id: 2,
			title: "Jayson Tatum's Sick Throwdown",
			description: "DID YOU SEE THAT DUNK BR0000ooOOOHHHH?? DIRTY! FILTHY! VILE!",
			category: "sports",
			createdAt: "2016-12-10T06:57:12.285Z",
			updatedAt: "2016-12-10T06:57:12.285Z",
			user_id: 1,
			userPreviouslyVoted: false,  //user has downvoted this topic
			topicAuthor: "Phil Foo",
			upvotes: 0,
			downvotes: 0
		}
	]
}
```

#### GET Information for one specific topic: /api/topic/:topicId

#### POST A new topic: /api/topic
Request body requires the following fields:
* title
* description
* category

Returns a response with status 200 and message "Topic successfully posted."
Otherwise returns a response with status 400 and message "There was an error posting your topic."




## Opinions API

#### GET all opinions for a particular topic: /api/opinion/topicId/:topicId/pageNum/:pageNum


#### GET a specific opinion: /api/opinion/topicId/:topicId/opinionId/:opinionId
#### POST a new opinion: /api/opinion/topicId/:topicId 
Request body requires the following fields:
* content

Returns a response with status 200 and message "Opinion successfully posted!"
Otherwise returns a response with status 400 and message "There was an error posting your opinion."





## OpinionVote API

#### GET all votes associated with a particular opinion: /api/opinion_votes/topicId/:topicId/opinionId/:opinionId
#### POST a new opinion vote: /api/opinion_votes/topicId/:topicId/opinionId/:opinionId
Request body requires the following fields:
* type (convincing, debatable, savage, etc.)

Checks to make sure that the user has not already voted on a particular opinion.


Returns a respons with status 200 and message "Opinion vote posted."
Otherwise returns a response with status 400 and message "User has already voted an opinion."




## User API
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