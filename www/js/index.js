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
      window.addEventListener('online', this.online, false);
      window.addEventListener('offline', this.offline, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
      app.registerToParse();
    },
    onBrowserReady: function () {
      Materialize.toast('<i class="material-icons left">sync_outline</i>Establishing connection...', 10000, 'rounded yellow black-text');
      app.nav.setUp();
      app.socket.connect();
    },
    registerToParse: function () {
      app.parse = window.parsepushnotification;
      // parse Push notification service
      // var parse = window.parsepushnotification;
      app.parse.setUp(applicationId, clientKey);

      //registerAsPushNotificationClient callback (called after setUp)
      app.parse.onRegisterAsPushNotificationClientSucceeded = function() {
          // alert('You have registered for notifications with parse');
        app.parse.subscribeToChannel('Hawthorne');
        app.parse.subscribeToChannel('Morrison');
        app.parse.subscribeToChannel('Burnside');
        app.parse.subscribeToChannel('Broadway');
        app.parse.subscribeToChannel('CuevasCrossing');
      };
      app.parse.onRegisterAsPushNotificationClientFailed = function() {
        alert('Register As Push Notification Client Failed');
      };

      //subscribe callback
      app.parse.onSubscribeToChannelSucceeded = function() {
        // alert('Subscribe To Channel Succeeded');
        return;
      };
      app.parse.onSubscribeToChannelFailed = function() {
        alert('Subscribe To Channel Failed');
      };
      //unsubscribe callback
      app.parse.onUnsubscribeSucceeded = function() {
        // alert('Unsubscribe Succeeded');
        return;
    };
      app.parse.onUnsubscribeFailed = function() {
        alert('Unsubscribe Failed');
      };
    },
    socket: {
      connect: function () {
        this.connection = io('http://54.191.150.69');
        // var socket = io('http://172.20.150.140');
        // var socket = io('http://127.0.0.1:9000');
        this.connection.on('bridge data', this.updateDOM);
      },
      updateDOM: function (data) {
        $("#toast-container").remove();
        var bridgeLED;
        var bridgeSchedule;
        $.each(data, function (bridge) {
          if(data[bridge] != null){
            bridgeName = bridge.replace(/\s/g, '-');
            bridgeLED = $("#" + bridgeName + "-led");
            bridgeSchedule = $("#" + bridgeName + "-next");
            bridgeLED.removeClass("led-yellow");
            if (data[bridge].status) {
              bridgeLED.removeClass("led-green", 1000, "easeInBack");
              bridgeLED.addClass("led-red", 1000, "easeInBack");
              bridgeLED.text(" UP");
            } else {
              bridgeLED.removeClass("led-red").addClass("led-green");
              bridgeLED.text(" DOWN");
            }
            if(data[bridge].scheduledLift) {
              var estLiftTime = data[bridge].scheduledLift.estimatedLiftTime;
              var newEstLiftTime = new Date(estLiftTime)
              bridge = bridge.replace(/\s/g, '-');
              bridgeSchedule.empty()
                .append("<br>Lift est: "+ moment(newEstLiftTime).format('ddd [at] LT'))
                .show();
            } else{
              bridgeSchedule.hide().empty();
            };
          }
        });
      }
    },
    nav: {
      setUp: function () {
        $('.button-collapse').sideNav({
            closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
          }
        );

        $( "#multco-us" ).click(function () {
          if (typeof window['cordova'] === 'undefined') {
            window.open('https://multco.us/bridge-services');
          } else {
            var ref = cordova.InAppBrowser.open('https://multco.us/bridge-services', '_blank', 'enableViewportScale=yes;location=yes');
          }
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
          $("#settings-page").hide();
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
          $("#settings-page").hide();
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
          $("#settings-page").hide();
          // Hide sideNav
          $('.button-collapse').sideNav('hide');
        });

        $( "#menu-settings").click(function(){
          $("#bridge-page").hide();
          $("#feed-page").hide();
          $("#terms-page").hide();
          $("#hawthorne-page").hide();
          $("#morrison-page").hide();
          $("#burnside-page").hide();
          $("#broadway-page").hide();
          $("#cuevas-crossing-page").hide();
          $("#settings-page").show();
          // Hide sideNav
          $('.button-collapse').sideNav('hide');
        });

        $("#hawthorne").click(this.showBridgePage);

        $( "#morrison").click(this.showBridgePage);

        $( "#burnside").click(this.showBridgePage);

        $( "#broadway").click(this.showBridgePage);

        $( "#cuevas-crossing").click(this.showBridgePage);

        $(".bridge-link").click(function (event) {
          var bridge = event.currentTarget.id.replace('-link', "");
          if (typeof window['cordova'] === 'undefined') {
            window.open('https://multco.us/bridge-services/'+ bridge);
          } else {
            var ref = cordova.InAppBrowser.open('https://multco.us/bridge-services/'+ bridge, '_blank', 'enableViewportScale=yes;location=yes');
          }
        });
        // TODO: Hook into local storage to save settings between sessions
        $(".push-setting").each(function (index, setting) {
          setting.checked = true;
        });
        $("#hawthorne-pn").click(function (event) {
          if (event.target.checked) {
            app.parse.subscribeToChannel('Hawthorne');
          } else {
            app.parse.unsubscribe('Hawthorne');
          }
        });
        $("#morrison-pn").click(function (event) {
          if (event.target.checked) {
            app.parse.subscribeToChannel('Morrison');
          } else {
            app.parse.unsubscribe('Morrison');
          }
        });
        $("#burnside-pn").click(function (event) {
          if (event.target.checked) {
            app.parse.subscribeToChannel('Burnside');
          } else {
            app.parse.unsubscribe('Burnside');
          }
        });
        $("#broadway-pn").click(function (event) {
          if (event.target.checked) {
            app.parse.subscribeToChannel('Broadway');
          } else {
            app.parse.unsubscribe('Broadway');
          }
        });
        $("#cuevas-crossing-pn").click(function (event) {
          if (event.target.checked) {
            app.parse.subscribeToChannel('CuevasCrossing');
          } else {
            app.parse.unsubscribe('CuevasCrossing');
          }
        });
      },
      showBridgePage: function(event){
        var bridge = event.currentTarget.id;
        $("#"+ bridge +"-last-5").empty();
        $("#bridge-page").hide();
        $("#"+ bridge +"-page").show();
        $.getJSON( "http://54.191.150.69/bridges/"+ bridge +"/events/actual/5", function( data ) {
          $("#"+ bridge +"-last-5").empty().append(
            "<table class='striped'>"+
              "<thead>"+
                "<tr>"+
                  "<th data-field='time-up'>Time Up</th>"+
                  "<th data-field='time-down'>Time Down</th>"+
                  "<th data-field='duration'>Duration (min)</th>"+
                "</tr>"+
              "</thead>"+
              "<tbody id='"+ bridge +"-data'>"+
              "</tbody>"+
            "</table>"
          );
          $.each( data, function( key, val ) {
            // var up_time = val.up_time.toString();
            var up_time = new Date(val.up_time);
            // var down_time = val.down_time.toString();
            var down_time = new Date(val.down_time);
            var duration = down_time - up_time;
            $("#"+ bridge +"-data").append(
              "<tr>"+
                "<td>"+moment(up_time).format('lll')+"</td>"+
                "<td>"+moment(down_time).format('lll')+"</td>"+
                "<td>"+_.round(duration/60000, 2)+"</td>"+
              "</tr>"
            );
          });
        });
      }
    },
    // Update DOM to reflect offline status
    offline: function () {
      app.socket.connection.disconnect();
      var condition = navigator.onLine ? "online" : "offline";
      Materialize.toast('<i class="material-icons left">error_outline</i>Could not establish connection...', 10000, 'rounded yellow black-text');
      var bridgeLED;
      $.each($("#bridge-page").children(), function ( index, child ) {
        bridgeLED = $("#"+ child.id).find("#"+ child.id +"-led");
        bridgeLED.removeClass("led-red").removeClass("led-green").addClass("led-yellow");
        bridgeLED.empty().html("<i class='material-icons' style='padding-top:12.5px'>error_outline</i>")
      });
      console.log(condition);
    },
    // Update DOM to reflect offline status
    online: function () {
      var condition = navigator.onLine ? "online" : "offline";
      console.log(condition);
      if (typeof app.socket.connection === 'undefined') {
        app.socket.connect();
      } else {
        app.socket.connection.connect();
      }
    }
};

app.initialize();
