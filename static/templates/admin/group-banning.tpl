<h1>Group Banning</h1>
<hr />

<form>
	<p>
		Select a group to gain banning privileges
	</p><br />
	<div class="alert alert-info">
		<p>
			<select class="form-control" data-field="group-banning">
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
	require(['forum/admin/settings'], function(Settings) {
		Settings.prepare();
	});
</script>