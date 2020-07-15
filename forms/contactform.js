
!(function($) {
  "use strict";

  $('form.php-email-form').submit(function(e) {
    e.preventDefault();
    
    var f = $(this).find('.form-group'),
      ferror = false,
      emailExp = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i;

    f.children('input').each(function() { // run all inputs
     
      var i = $(this); // current input
      var rule = i.attr('data-rule');

      if (rule !== undefined) {
        var ierror = false; // error flag for current input
        var pos = rule.indexOf(':', 0);
        if (pos >= 0) {
          var exp = rule.substr(pos + 1, rule.length);
          rule = rule.substr(0, pos);
        } else {
          rule = rule.substr(pos + 1, rule.length);
        }

        switch (rule) {
          case 'required':
            if (i.val() === '') {
              ferror = ierror = true;
            }
            break;

          case 'minlen':
            if (i.val().length < parseInt(exp)) {
              ferror = ierror = true;
            }
            break;

          case 'email':
            if (!emailExp.test(i.val())) {
              ferror = ierror = true;
            }
            break;

          case 'checked':
            if (! i.is(':checked')) {
              ferror = ierror = true;
            }
            break;

          case 'regexp':
            exp = new RegExp(exp);
            if (!exp.test(i.val())) {
              ferror = ierror = true;
            }
            break;
        }
        i.next('.validate').html((ierror ? (i.attr('data-msg') !== undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
      }
    });
    f.children('textarea').each(function() { // run all inputs

      var i = $(this); // current input
      var rule = i.attr('data-rule');

      if (rule !== undefined) {
        var ierror = false; // error flag for current input
        var pos = rule.indexOf(':', 0);
        if (pos >= 0) {
          var exp = rule.substr(pos + 1, rule.length);
          rule = rule.substr(0, pos);
        } else {
          rule = rule.substr(pos + 1, rule.length);
        }

        switch (rule) {
          case 'required':
            if (i.val() === '') {
              ferror = ierror = true;
            }
            break;

          case 'minlen':
            if (i.val().length < parseInt(exp)) {
              ferror = ierror = true;
            }
            break;
        }
        i.next('.validate').html((ierror ? (i.attr('data-msg') != undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
      }
    });
    if (ferror) return false;
   
    
    var action = $(this).attr('action');
    if( ! action ) {
      action = '../forms/contactform.js'; //.. root
      console.log("catch it");
    }

    var this_form = $(this);

    const name =  $( "#name" ).val();
    const email =  $( "#email" ).val();
    const subject = $( "#subject" ).val();
    const message = $( "#message" ).val();

    console.log(name + " " + email + " " + subject + " " + message);
  
    $.ajax({
      type: "GET",
      url: 'http://localhost:8001/sendMessage?',
      crossDomain: true,
      dataType: 'jsonp',
      data: { name: name , email: email, subject: subject, message: message },

      statusCode: {
        200: function (response) {
          this_form.find('.sent-message').slideDown();
         
          $( "#name" ).val("");
          $( "#email" ).val("");
          $( "#subject" ).val("");
          $( "#message" ).val("");

          setInterval(() => {
            this_form.find('.sent-message').slideUp();
          }, 3250);
        },
        400: function (response) {
          this_form.find('.error-message').slideDown().html('Error, this message has not been sent' +
           '<br>' + 'Please check your details and try again');
        }
      }
    });

    return true;
  });



})(jQuery);