(function(){

	jQuery.fn.extend({

	  	isEmpty: function() {

	  		var el = $(this).get(0);
	  		if(el instanceof HTMLInputElement)
				return !$(this).val().trim();
			return;
		},
		isValid: function(){

			//HTML5 validation
			var el = $(this).get(0);
	  		if(el instanceof HTMLInputElement)
				return el.checkValidity();
			return;
		},
		equals: function(val){

			var el = $(this).get(0);
			if(el instanceof HTMLInputElement)
				return $(this).val() === val;
		},
		clear: function(el){

			var el = $(this).get(0);
			if(el instanceof HTMLInputElement)
				$(this).val("");
		},
		jsonize:function(){

			var json = {}
			var el = $(this).get(0);
			if(el instanceof HTMLFormElement)
				$(this).serializeArray().map(function(item){

					json[item.name]=item.value;
				});

			return json;
		}
	});

	$("#login").click(function(){

		var error = 0;

		if($("#email").isEmpty()){

			error++;

			$("#email")
				.css({

					"border":"1px inset red",
					"border-spacing":"2px"
				})
				.focus(function(){

					$(this)
						.css("border","1px inset #000")
				});
		}

		if($("#password").isEmpty()){

			error++;

			$("#password")
				.css({

					"border":"1px inset red",
					"border-spacing":"2px"
				})
				.focus(function(){

					$(this)
						.css("border","1px inset #000")
				});
		}

		if(error == 0)
			$.ajax({

				method: "POST",
				url: "/auth",
				data: $("form").jsonize(),
				beforeSend:function(){

					$(".alert")
						.hide()
						.html("");

					$("form input")
						.attr("disabled","true")
				}
			})
			.done(function( msg ) {

			    $(".alert")
			    	.css("background-color","light-green")
			    	.html("Success!");

			    // setTimeout(function(){

			    // 	location.href = "/";
			    // }, 1000);
			})
			.error(function(){

				$(".alert")
			    	.css("background-color","pink")
			    	.html("Failed!");

			    $("form input")
			    	.removeAttr("disabled")
			})
			.always(function(){

				$("form input[type=text], form input[type=password]")
						.removeAttr("disabled");
			});
	})

	$("#surname, #othernames, #phone,"+
		"#email, #password, #confirm, #dob").focus(function(){

		$(this)
			.css({

				"border":"1px inset #000",
				"background":""
			});

		$(".alert").hide("1000");
	})

	$("#register-save").click(function(){

		var error = 0;

		$(".alert").html("");

		$.each(["#othernames",	
					"#surname", 
					"#phone", 
					"#email",
					"#password",
					"#confirm",
					"#dob"], function(i,e){

			if($(e).isEmpty()){

				$(e).css("border","1px inset red");

				error++;
			}
			else if(!$(e).isValid()){

				$(".alert")
					.html($(e)
							.css("background","pink")
							.data("invalid"))
					.show();

				error++;
			}
		});

		if(!$("#password").isEmpty() && !$("#confirm").isEmpty())
			if(!$("#password").equals($("#confirm").val())){

				$(".alert")
					.html($(".alert").html().trim().concat(" Passwords do not match!"))
					.show()

				$("#password, #confirm")
					.css("background","pink")
					.clear();

				error++;
			}

		if(error == 0)
			$.ajax({

				method: "POST",
				url: "/register/new",
				data: $("form").jsonize(),
				beforeSend:function(){

					$(".alert")
						.hide()
						.html("");

					$("form input, form textarea, form select")
						.attr("disabled","true")
				}
			})
			.done(function( msg ) {

			    $(".alert")
			    	.css("background-color","light-green")
			    	.html("Success!");

			    setTimeout(function(){

			    	location.href = "/";
			    }, 1000);
			})
			.error(function(){

				$(".alert")
			    	.css("background-color","pink")
			    	.html("Failed!");

			    $("form input[type=button]")
			    	.removeAttr("disabled")
			})
			.always(function(){

				$("form input[type=text], form input[type=date],"+ 
					"form input[type=date], form input[type=text],"+
					"form input[type=password], form textarea, form select")
						.removeAttr("disabled");
			});
	})
})();