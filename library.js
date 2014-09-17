"use strict";

var plugin = {},
	groups = module.parent.require('./groups');

plugin.init = function(app, middleware, controllers, callback) {
	app.get('/admin/group-banning', middleware.admin.buildHeader, renderAdmin);
	app.get('/api/admin/group-banning', renderAdmin);

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


function renderAdmin(req, res, next) {
	groups.list({
		expand: true,
		showSystemGroups: true,
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