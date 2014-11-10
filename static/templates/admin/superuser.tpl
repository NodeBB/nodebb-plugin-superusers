<h1>Super Users</h1>
<hr />

<form>
	<p>
		Select a group to be declared as superusers. These users will not have access to the ACP but will have the ability to perform various advanced actions such as banning users from their profile page.
	</p><br />
	<div class="alert alert-info">
		<p>
			<select class="form-control" data-field="superuser:groupname">
				<option value="">None</option>
				<!-- BEGIN groups -->
				<option value="{groups.name}">{groups.name}</option>
				<!-- END groups -->
			</select>
		</p>
	</div>
</form>

<button class="btn btn-lg btn-primary" id="save">Save</button>

<script>
	require(['admin/settings'], function(Settings) {
		Settings.prepare();
	});
</script>