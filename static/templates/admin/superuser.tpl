<div class="row">
	<div class="col-lg-9">
		<div class="panel panel-default">
			<div class="panel-heading">Super Users</div>
			<div class="panel-body">
				<form role="form" class="superuser-settings">
					<p>
						Select a group to be declared as superusers. These users will not have access to the ACP but will have the ability to perform various advanced actions such as banning users from their profile page.
					</p>
					<div class="form-group">
						<select class="form-control" id="groupname" name="groupname">
							<option value="">None</option>
							<!-- BEGIN groups -->
							<option value="{groups.name}">{groups.name}</option>
							<!-- END groups -->
						</select>
					</div>
				</form>
			</div>
		</div>
	</div>
	<div class="col-lg-3">
		<div class="panel panel-default">
			<div class="panel-heading">Control Panel</div>
			<div class="panel-body">
				<button class="btn btn-primary" id="save">Save Settings</button>
			</div>
		</div>
	</div>
</div>

<script>
	'use strict';
	/* globals $, app, socket, require */

	require(['settings'], function(Settings) {
		Settings.load('superuser', $('.superuser-settings'));

		$('#save').on('click', function() {
			Settings.save('superuser', $('.superuser-settings'), function() {
				app.alert({
					type: 'success',
					alert_id: 'superuser-saved',
					title: 'Settings Saved',
					message: 'Please reload your NodeBB to apply these settings',
					clickfn: function() {
						socket.emit('admin.reload');
					}
				});
			});
		});
	});
</script>