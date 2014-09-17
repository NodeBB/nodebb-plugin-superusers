"use strict";

(function() {
	$(window).on('action:ajaxify.end', function(ev, data) {
		if (data.url.match(/^user\/([\s\S]*)/)) {
			socket.emit('plugins.superuser.isSuperUser', function(err, isSuperUser) {
				if (isSuperUser) {
					$('span.label-danger').remove();
					setupBanButton(data);
				}
			});
		}
	});

	var $btn, uid;

	function setupBanButton(data) {
		$.get(RELATIVE_PATH + '/api/' + data.url, function(data) {
			if (data.isSelf) {
				return;
			}

			uid = parseInt(data.uid, 10);

			$('<a id="group-ban-btn" href="#" class="btn btn-primary btn-sm"></a>').insertAfter($('#unfollow-btn'));
			$btn = $('#group-ban-btn');

			$(window).trigger('action:plugins.superuser.setupButtons', {user: data});

			if (data.banned) {
				setupUnban();
			} else {
				setupBan();
			}
		});


		function setupBan() {
			$btn.removeClass('btn-success').addClass('btn-danger').html('Ban');
			$btn.off('click').on('click', function(ev) {
				socket.emit('plugins.superuser.ban', {uid: uid});
				setupUnban();
				ev.preventDefault();
				return false;
			});
		}

		function setupUnban() {
			$btn.removeClass('btn-danger').addClass('btn-success').html('Unban');
			$btn.off('click').on('click', function(ev) {
				socket.emit('plugins.superuser.unban', {uid: uid});
				setupBan();
				ev.preventDefault();
				return false;
			});
		}
	}
}());