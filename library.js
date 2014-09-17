"use strict";

var plugin = {};

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
	res.render('admin/group-banning', {});
}

module.exports = plugin;