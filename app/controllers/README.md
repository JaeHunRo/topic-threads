# API Documentation

## Topics API

#### GET all topics page-by-page: /api/topic/pageNum/:pageNum
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

#### GET information for one specific topic: /api/topic/:topicId
Retrieves information for one specific topic. Sample response:
```javascript
{
	id: 1,
	title: "My Really Bad Diarrhea Last Week",
	description: "A girl can't always have a smooth bathroom experience. Sometimes it gets a little rough. That's what happened last week when I plopped down onto the seat. I'll spare you the details.",
	category: "humor",
	createdAt: "2016-12-10T06:56:15.817Z",
	updatedAt: "2016-12-10T06:56:15.817Z",
	user_id: 1,
	userPreviouslyVoted: false,    //Whether the user has already voted on this topic. Null if they haven't.
	numUpvotes: 0,
	numDownvotes: 1
}
````




#### POST a new topic: /api/topic
Request body requires the following fields:
* String: title
* String: description
* String: category

Returns a response with status 200 and message "Topic successfully posted."
Otherwise returns a response with status 400 and message "There was an error posting your topic."




## Opinions API

#### GET all opinions for a particular topic: /api/opinion/topicId/:topicId/pageNum/:pageNum


#### GET a specific opinion: /api/opinion/topicId/:topicId/opinionId/:opinionId
#### POST a new opinion: /api/opinion/topicId/:topicId 
Request body requires the following fields:
* String: content

Returns a response with status 200 and message "Opinion successfully posted!"
Otherwise returns a response with status 400 and message "There was an error posting your opinion."






## Comments API

#### GET all comments for a particular opinion: /api/comment/topicId/:topicId/opinionId/:opinionId/pageNum/:pageNum

#### POST a new comment: /api/comment/topicId/:topicId/opinionId/:opinionId
Request body requires the following fields:
* String: content

Returns a response with status 200 and message "Comment successfully posted."
Otherwise returns a response with status 400 and message "There was an error posting your comment."







## TopicVote API

#### Get all votes for one particular topic: /api/topic_votes/topicId/:topicId

#### POST a new topic vote: /api/topic_votes/topicId/:topicId
Request body requires the following fields:
* Boolean: is_up

Checks to see if the user has already voted on a particular topic. Will reject if the user has already voted.

Returns a response with status 200 and message "Vote posted."
Otherwise returns a response with status 400 and message "User has already voted."






## OpinionVote API

#### GET all votes associated with a particular opinion: /api/opinion_votes/topicId/:topicId/opinionId/:opinionId
#### POST a new opinion vote: /api/opinion_votes/topicId/:topicId/opinionId/:opinionId
Request body requires the following fields:
* String: type (convincing, debatable, savage, etc.)

Checks to make sure that the user has not already voted on a particular opinion.


Returns a response with status 200 and message "Opinion vote posted."
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