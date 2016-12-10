# API Documentation

### User API
##### GET User information: /api/user
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