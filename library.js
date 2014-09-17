"use strict";

var plugin = {},
	groups = module.parent.require('./groups');

plugin.init = function(app, middleware, controllers, callback) {
	app.get('/admin/group-banning', middleware.admin.buildHeader, renderAdmin);
	app.get('/api/admin/group-banning', renderAdmin);

	var SocketPlugins = module.parent.require('./socket.io/plugins');
		SocketPlugins.groupBanning = {};
		SocketPlugins.groupBanning.ban = ban;
		SocketPlugins.groupBanning.unban = unban;

	callback();
};

plugin.addAdminNavigation = function(header, callback) {
	header.plugins.push({
		route: '/group-banning',
		icon: 'fa-tint',
		name: 'group-banning'
	});

	callback(null, header);
};


function ban() {
	console.log('banned');
}

function unban() {
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

		res.render('admin/group-banning', {
			groups: groups
		});
	});
}

module.exports = plugin;