"use strict";

(function() {
	$(window).on('action:ajaxify.end', function(ev, data) {
		if (data.url.match(/^user\/([\s\S]*)/)) {
			socket.emit('plugins.superuser.isSuperUser', function(err, isSuperUser) {
				if (isSuperUser) {
					setupBanButton(data);
				}
			});
		}
	});

	function setupBanButton(data) {
		$.get(RELATIVE_PATH + '/api/' + data.url, function(data) {
			if (data.isSelf) {
				return;
			}

			$('<a id="group-ban-btn" href="#" class="btn btn-primary btn-sm"></a>').insertAfter($('#unfollow-btn'));
			$btn = $('#group-ban-btn');

			if (data.banned) {
				setupBan();
			} else {
				setupUnban();
			}
		});


		function setupBan() {
			$btn.removeClass('btn-success').addClass('btn-danger').html('Ban');
			$btn.off('click').on('click', function(ev) {
				socket.emit('plugins.superuser.ban');
				setupUnban();
				ev.preventDefault();
				return false;
			});
		}

		function setupUnban() {
			$btn.removeClass('btn-danger').addClass('btn-success').html('Unban');
			$btn.off('click').on('click', function(ev) {
				socket.emit('plugins.superuser.unban');
				setupBan();
				ev.preventDefault();
				return false;
			});
		}
	}
}());