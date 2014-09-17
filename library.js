"use strict";

var plugin = {},
	groups = module.parent.require('./groups'),
	meta = module.parent.require('./meta');

plugin.init = function(app, middleware, controllers, callback) {
	app.get('/admin/superuser', middleware.admin.buildHeader, renderAdmin);
	app.get('/api/admin/superuser', renderAdmin);

	var SocketPlugins = module.parent.require('./socket.io/plugins');
		SocketPlugins.groupBanning = {};
		SocketPlugins.groupBanning.ban = ban;
		SocketPlugins.groupBanning.unban = unban;
		SocketPlugins.groupBanning.canBan = function(socket, data, callback) {
			canBan(socket.uid ? socket.uid : 0, callback);
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

function canBan(uid, callback) {
	var group = meta.config['superuser:groupname'] || '';

	groups.isMember(uid, group, callback);
}

function ban(socket, callback) {
	console.log('banned');
}

function unban(socket, callback) {
	console.log('unbanned');
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