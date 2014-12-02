"use strict";

var plugin = {},
	groups = module.parent.require('./groups'),
	meta = module.parent.require('./meta'),
	user = module.parent.require('./user'),
	socketAdminUser = module.parent.require('./socket.io/admin/user');

plugin.init = function(params, callback) {
	var app = params.router,
		middleware = params.middleware,
		controllers = params.controllers;
		
	app.get('/admin/superuser', middleware.admin.buildHeader, renderAdmin);
	app.get('/api/admin/superuser', renderAdmin);

	var SocketPlugins = module.parent.require('./socket.io/plugins');
		SocketPlugins.superuser = SocketPlugins.superuser || {};
		SocketPlugins.superuser.ban = ban;
		SocketPlugins.superuser.unban = unban;

	SocketPlugins.superuser.isSuperUser = function(socket, data, callback) {
		plugin.isSuperUser(socket.uid ? socket.uid : 0, callback);
	};

	callback();
};

plugin.addAdminNavigation = function(header, callback) {
	header.plugins.push({
		route: '/superuser',
		icon: 'fa-tint',
		name: 'superuser'
	});

	callback(null, header);
};

plugin.isSuperUser = function(uid, callback) {
	var group = meta.config['superuser:groupname'] || '';

	groups.isMember(uid, group, callback);
}

plugin.isModerator = function(params, callback) {
	plugin.isSuperUser(parseInt(params.uid, 10), function(err, isSuperUser) {
		if (isSuperUser) {
			params.isModerator = isSuperUser;
		}

		callback(null, params);
	});
};

function ban(socket, data, callback) {
	var uid = socket.uid ? socket.uid : 0;

	plugin.isSuperUser(uid, function(err, isSuperUser) {
		if (!isSuperUser) {
			return callback(new Error('Not Allowed'));
		}

		socketAdminUser.banUser(data.uid, callback);
		console.log('banned');
	});
}

function unban(socket, data, callback) {
	var uid = socket.uid ? socket.uid : 0;

	plugin.isSuperUser(uid, function(err, isSuperUser) {
		if (!isSuperUser) {
			return callback(new Error('Not Allowed'));
		}

		user.unban(data.uid, callback);
		console.log('unbanned');
	});
}

function renderAdmin(req, res, next) {
	groups.list({
		expand: true,
		showSystemGroups: false,
		truncateUserList: true
	}, function(err, groups) {
		groups = groups.filter(function(group) {
			return group.name !== 'registered-users' && group.name !== 'guests';
		});

		res.render('admin/superuser', {
			groups: groups
		});
	});
}

module.exports = plugin;