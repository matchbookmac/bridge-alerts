/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var applicationId = "3auqJUgZz2edaX8bUDrB1TRoUaVxPaWZ4gSAFzYq";
var clientKey = "ZujNEPdo02x2mvyeXUUcqmaQtDD1YOVD3BNhT3IR";

var app = {
    // Application Constructor
    initialize: function() {
      this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
      // Cordova DOM ready event
      document.addEventListener('deviceready', this.onDeviceReady, false);
      // Browser DOM ready event
      document.addEventListener('DOMContentLoaded', this.onBrowserReady);
      document.addEventListener('online', this.online, false);
      document.addEventListener('offline', this.offline, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
      app.registerToParse();
      app.socket.connect();
      app.setUpNav();
    },
    onBrowserReady: function () {
      app.setUpNav();
      app.socket.connect();
    },
    registerToParse: function () {
      // Parse Push notification service
      var Parse = window.parsepushnotification;
      Parse.setUp(applicationId, clientKey);

      //registerAsPushNotificationClient callback (called after setUp)
      Parse.onRegisterAsPushNotificationClientSucceeded = function() {
          alert('You have registered for notifications with Parse');
      };
      Parse.onRegisterAsPushNotificationClientFailed = function() {
          alert('Register As Push Notification Client Failed');
      };

      //subscribe callback
      Parse.onSubscribeToChannelSucceeded = function() {
          alert('onSubscribeToChannelSucceeded');
          return;
      };
      Parse.onSubscribeToChannelFailed = function() {
          alert('Subscribe To Channel Failed');
      };
      //unsubscribe callback
      Parse.onUnsubscribeSucceeded = function() {
          alert('onUnsubscribeSucceeded');
          return;
      };
      Parse.onUnsubscribeFailed = function() {
          alert('Unsubscribe Failed');
      };
// Add set timeout here, having trouble doing it async
      Parse.subscribeToChannel('Hawthorne');
      Parse.subscribeToChannel('Morrison');
      Parse.subscribeToChannel('Burnside');
      Parse.subscribeToChannel('Broadway');
      Parse.subscribeToChannel('Cuevas Crossing');
    },
    socket: {
      connect: function () {
        var socket = io('http://54.191.150.69');
        // var socket = io('http://172.20.150.140');
        // var socket = io('http://127.0.0.1:9000');
        socket.on('bridge data', this.updateDOM);
      },
      updateDOM: function (data) {
        // $("#bridges").text("");
        $.each(data, function (bridge) {
          if(data[bridge].status){
            bridge = bridge.replace(/\s/g, '-');
            $("#" + bridge + "-led").removeClass("led-green", 1000, "easeInBack");
            $("#" + bridge + "-led").addClass("led-red", 1000, "easeInBack");
            $("#" + bridge + "-led").text(" UP");
          }
            else {
              bridge = bridge.replace(/\s/g, '-');
              $("#" + bridge + "-led").removeClass("led-red").addClass("led-green");
              $("#" + bridge + "-led").text(" DOWN");
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
      }
    },
    setUpNav: function () {
      $('.button-collapse').sideNav({
          closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
        }
      );

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
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
      var parentElement = document.getElementById(id);
      var listeningElement = parentElement.querySelector('.listening');
      var receivedElement = parentElement.querySelector('.received');

      listeningElement.setAttribute('style', 'display:none;');
      receivedElement.setAttribute('style', 'display:block;');

      console.log('Received Event: ' + id);
    },
    // Update DOM to reflect offline status
    offline: function () {

    },
    // Update DOM to reflect offline status
    online: function () {

    }
};

app.initialize();
