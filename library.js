"use strict";

var plugin = {};
var groups = require.main.require('./src/groups'),
var meta = require.main.require('./src/meta'),
var user = require.main.require('./src/user'),
var socketAdminUser = require.main.require('./src/socket.io/admin/user');

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
	meta.settings.getOne('superuser', 'groupname', function(err, group) {
		group = group || '';

		if (Array.isArray(uid)) {
			groups.isMembers(uid, group, callback);
		} else {
			groups.isMember(uid, group, callback);
		}
	});
};

plugin.isModerator = function(params, callback) {
	plugin.isSuperUser(params.uid, function(err, isSuperUser) {
		if (Array.isArray(params.cid)) {
			var arr = [], length = params.cid.length;
			while (length--) {
				arr.push(isSuperUser);
			}

			params.isModerator = arr;
			callback(null, params);
		} else {
			if (isSuperUser) {
				params.isModerator = isSuperUser;
			}

			callback(null, params);
		}
	});
};

function ban(socket, data, callback) {
	var uid = socket.uid ? socket.uid : 0;

	plugin.isSuperUser(uid, function(err, isSuperUser) {
		if (!isSuperUser) {
			return callback(new Error('Not Allowed'));
		}

		socketAdminUser.banUser(data.uid, callback);
	});
}

function unban(socket, data, callback) {
	var uid = socket.uid ? socket.uid : 0;

	plugin.isSuperUser(uid, function(err, isSuperUser) {
		if (!isSuperUser) {
			return callback(new Error('Not Allowed'));
		}

		user.unban(data.uid, callback);
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
