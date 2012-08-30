var FBconfig = {
	app:{
		id: '265916113507900',								// id of facebook application
		perms: 'publish_stream, user_photos, user_likes',	// extended permissions required of htis app. Leave as empty string for no extended permissions.
		site: 'http://zetagame.herokuapp.com/'					// direct url to app server
	},
	login:{
		method: 'popup',									// 'redirect' or 'popup'
		target: 'http://www.spaceanglers.com'				// endpoint url if loginmethod is 'redirect'
	},
	likegate:{												
		targetid: '102352989996',							// facebook id of target link
		targeturl: 'http://www.facebook.com/greenzeta',		// url of target link
		gatepage: 'likegate.html',							// like gate page
		redirect: 'index.html'								// destination page for users who pass through like gate
	}
};