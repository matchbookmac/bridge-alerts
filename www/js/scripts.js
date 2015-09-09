var socket = io('http://52.26.186.75');

socket.on('bridge data', function (data) {
  // $("#bridges").text("");
  $.each(data, function (bridge) {
    if(data[bridge].status){
      bridge = bridge.replace(/\s/g, '-');
      $("#" + bridge + "-led").removeClass("led-green", 1000, "easeInBack");
      $("#" + bridge + "-led").addClass("led-red", 1000, "easeInBack");
    }
      else {
        bridge = bridge.replace(/\s/g, '-');
        $("#" + bridge + "-led").removeClass("led-red").addClass("led-green");
      }
  });
  $.each(data, function (bridge) {
    if(data[bridge] != null){
      if(data[bridge].scheduledLift) {
        var estLiftTime = data[bridge].scheduledLift.estimatedLiftTime;
        var newEstLiftTime = new Date(estLiftTime)
        bridge = bridge.replace(/\s/g, '-');
        $("#" + bridge + "-next").show();
        $("#" + bridge + "-next").append(moment(newEstLiftTime).format('lll'));
      }
      else{
        $("#" + bridge + "-next").hide();
        $("#" + bridge + "-next").empty();
      };
    };
  });
});



$( document ).ready(function() {

  $('.button-collapse').sideNav({
      closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
    }
  );

  (function() {
    "use strict";
    var toggles = document.querySelectorAll(".c-hamburger");

    for (var i = toggles.length - 1; i >= 0; i--) {
      var toggle = toggles[i];
      toggleHandler(toggle);
    }

    function toggleHandler(toggle) {
      toggle.addEventListener( "click", function(e) {
        e.preventDefault();
        if (this.classList.contains("c-hamburger--htla") === true) {
          $("#toggle-button").removeClass("c-hamburger--htla").addClass("c-hamburger--htx");
          $("#bridge-page").show();
          $("#feed-page").hide();
          $("#terms-page").hide();
          $("#hawthorne-page").hide();
          $("#morrison-page").hide();
          $("#burnside-page").hide();
          $("#broadway-page").hide();
          $("#cuevas-crossing-page").hide();
          $("#toggle-button").removeClass("is-active");
        } else if (this.classList.contains("is-active") === true) {
          this.classList.remove("is-active");
          slideout.toggle();
        } else {this.classList.add("is-active");
        slideout.toggle();
        }
      });
    }
  })();

  $( "#multco-us" ).click(function () {
    var ref = cordova.InAppBrowser.open('https://multco.us/bridge-services', '_blank', 'enableViewportScale=yes;location=yes');
  });

  $( "#menu-feed" ).click(function() {
    $("#bridge-page").hide();
    $("#feed-page").show();
    $("#terms-page").hide();
    $("#hawthorne-page").hide();
    $("#morrison-page").hide();
    $("#burnside-page").hide();
    $("#broadway-page").hide();
    $("#cuevas-crossing-page").hide();
    // Hide sideNav
    $('.button-collapse').sideNav('hide');
  });

  $( "#menu-home").click(function(){
    $("#bridge-page").show();
    $("#feed-page").hide();
    $("#terms-page").hide();
    $("#hawthorne-page").hide();
    $("#morrison-page").hide();
    $("#burnside-page").hide();
    $("#broadway-page").hide();
    $("#cuevas-crossing-page").hide();
    // Hide sideNav
    $('.button-collapse').sideNav('hide');
  });

  $( "#menu-terms").click(function(){
    $("#bridge-page").hide();
    $("#feed-page").hide();
    $("#terms-page").show();
    $("#hawthorne-page").hide();
    $("#morrison-page").hide();
    $("#burnside-page").hide();
    $("#broadway-page").hide();
    $("#cuevas-crossing-page").hide();
    // Hide sideNav
    $('.button-collapse').sideNav('hide');
  });

  $( "#hawthorne").click(function(){
    $("#hawthorne-last").empty();
    $("#bridge-page").hide();
    $("#hawthorne-page").show();
    $("#toggle-button").removeClass("c-hamburger--htx").addClass("c-hamburger--htla").addClass("is-active");
    $.getJSON( "http://54.191.150.69/bridges/hawthorne/events/actual/5", function( data ) {
      $.each( data, function( key, val ) {
        var up_time = val.up_time.toString();
        var new_up_time = new Date(up_time)
        var down_time = val.down_time.toString();
        var new_down_time = new Date(down_time);
        $("#hawthorne-last").append("<li class='bridge-event'>" + " Time up: " + moment(new_up_time).format('lll') + "</li>")
        $("#hawthorne-last").append("<li class='bridge-event'>" + "Time down: " + moment(new_down_time).format('lll') + "</li><br>");
      });
    });
  });

  $( "#morrison").click(function(){
    $("#morrison-last").empty();
    $("#bridge-page").hide();
    $("#morrison-page").show();
    $("#toggle-button").removeClass("c-hamburger--htx").addClass("c-hamburger--htla").addClass("is-active");
    $.getJSON( "http://54.191.150.69/bridges/morrison/events/actual/5", function( data ) {
      $.each( data, function( key, val ) {
        var up_time = val.up_time.toString();
        var new_up_time = new Date(up_time);
        var down_time = val.down_time.toString();
        var new_down_time = new Date(down_time);
        $("#morrison-last").append("<li class='bridge-event'>" + " Time up: " + moment(new_up_time).format('lll') + "</li>")
        $("#morrison-last").append("<li class='bridge-event'>" + "Time down: " + moment(new_down_time).format('lll') + "</li><br>")
      });
    });
  });

  $( "#burnside").click(function(){
    $("#burnside-last").empty();
    $("#bridge-page").hide();
    $("#burnside-page").show();
    $("#toggle-button").removeClass("c-hamburger--htx").addClass("c-hamburger--htla").addClass("is-active");
    $.getJSON( "http://54.191.150.69/bridges/burnside/events/actual/5", function( data ) {
      $.each( data, function( key, val ) {
        var up_time = val.up_time.toString();
        var new_up_time = new Date(up_time);
        var down_time = val.down_time.toString();
        var new_down_time = new Date(down_time);
        $("#burnside-last").append("<li class='bridge-event'>" + " Time up: " + moment(new_up_time).format('lll') + "</li>")
        $("#burnside-last").append("<li class='bridge-event'>" + "Time down: " + moment(new_down_time).format('lll') + "</li><br>")
      });
    });
  });

  $( "#broadway").click(function(){
    $("#broadway-last").empty();
    $("#bridge-page").hide();
    $("#broadway-page").show();
    $("#toggle-button").removeClass("c-hamburger--htx").addClass("c-hamburger--htla").addClass("is-active");
    $.getJSON( "http://54.191.150.69/bridges/broadway/events/actual/5", function( data ) {
      $.each( data, function( key, val ) {
        var up_time = val.up_time.toString();
        var new_up_time = new Date(up_time);
        var down_time = val.down_time.toString();
        var new_down_time = new Date(down_time);
        $("#broadway-last").append("<li class='bridge-event'>" + " Time up: " + moment(new_up_time).format('lll') + "</li>")
        $("#broadway-last").append("<li class='bridge-event'>" + "Time down: " + moment(new_down_time).format('lll') + "</li><br>")
      });
    });
  });

  $( "#cuevas-crossing").click(function(){
    $("#cuevas-crossing-last").empty();
    $("#bridge-page").hide();
    $("#cuevas-crossing-page").show();
    $("#toggle-button").removeClass("c-hamburger--htx").addClass("c-hamburger--htla").addClass("is-active");
    $.getJSON( "http://54.191.150.69/bridges/cuevas%20crossing/events/actual/5", function( data ) {
      $.each( data, function( key, val ) {
        var up_time = val.up_time.toString();
        var new_up_time = new Date(up_time);
        var down_time = val.down_time.toString();
        var new_down_time = new Date(down_time);
        $("#cuevas-crossing-last").append("<li class='bridge-event'>" + " Time up: " + moment(new_up_time).format('lll') + "</li>");
        $("#cuevas-crossing-last").append("<li class='bridge-event'>" + "Time down: " + moment(new_down_time).format('lll') + "</li><br>");
      });
    });
  });
});
