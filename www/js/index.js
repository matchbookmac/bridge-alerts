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
  initialize: function () {
    this.bindEvents();
  },
  // Bind Event Listeners
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function () {
    // App sent to fore/background events
    document.addEventListener('pause', function () {
      // app.settings.saveOrCreate();
      app.offline();
    });
    document.addEventListener('resume', function () {
      app.settings.load();
      app.online();
    });

    // Browser DOM ready event
    document.addEventListener('DOMContentLoaded', app.onBrowserReady);
    // Cordova device ready event
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },
  // deviceready Event Handler
  // The scope of 'this' is the event. In order to call the needed function, we must explicitly call 'app.function(...);'
  onDeviceReady: function () {
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
    app.registerToParse();
  },
  onBrowserReady: function () {
    Materialize.toast('<i class="material-icons left">sync_outline</i>Establishing connection...', 10000, 'rounded yellow black-text');
    app.nav.setUp();
    app.socket.connect();
    // Network connection events
    document.addEventListener('online', app.online, false);
    document.addEventListener('offline', app.offline, false);
  },
  settings: {
    render: function(callback) {
      var settingElement;
      _.forIn(app.parseSettings, function (setting, key) {
        if (setting) {
          app.parse.subscribeToChannel(key);
        } else {
          app.parse.unsubscribe(key);
        }
        settingElement = $("#"+ _.kebabCase(key) +"-pn");
        settingElement[0].checked = setting;
      });
      if (callback) callback();
    },
    load: function (callback) {
      window.requestFileSystem(window.PERSISTENT, 1024*1024, function (fs) {
        app.fs = fs;
        app.fs.root.getFile('settings.json', {}, function(fileEntry) {
          fileEntry.file(function(file) {
            var reader = new FileReader();
            reader.onloadend = function(e) {
              var settings = this.result;
              app.parseSettings = JSON.parse(settings);
              app.settings.render(callback);
            };
            reader.readAsText(file);
          }, errorHandler);
        }, app.settings.saveOrCreate);
      }, errorHandler);
      function errorHandler(err) {
        return;
      }
    },
    saveOrCreate: function () {
      if (!app.parseSettings) {
        app.parseSettings = {
          Hawthorne: true,
          Morrison: true,
          Burnside: true,
          Broadway: true,
          CuevasCrossing: true
        };
      }
      app.fs.root.getFile('settings.json', { create: true }, function (fileEntry) {
        fileEntry.createWriter(function(fileWriter) {
          app.settingsFileWriter = fileWriter;
          var blob = new Blob([JSON.stringify(app.parseSettings)], {type: 'text/plain'});
          app.settingsFileWriter.write(blob);
        }, function (err) {
          console.log(err);
        });
      });
    },
    attachClickListener: function () {
      var settingElement;
      _.forIn(app.parseSettings, function (setting, key) {
        settingElement = $("#"+ _.kebabCase(key) +"-pn");
        settingElement.click(function (event) {
          if (event.target.checked) {
            app.parse.subscribeToChannel(key);
            app.parseSettings[key] = true;
          } else {
            app.parse.unsubscribe(key);
            app.parseSettings[key] = false;
          }
          app.settings.saveOrCreate();
        });
      });
    }
  },
  registerToParse: function () {
    // parse Push notification service
    app.parse = window.parsepushnotification;
    app.parse.setUp(applicationId, clientKey);
    //registerAsPushNotificationClient callback (called after setUp)
    app.parse.onRegisterAsPushNotificationClientSucceeded = function () {
      app.settings.load(app.settings.attachClickListener);
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
      this.connection = io('https://api.multco.us', { secure: true });
      // var socket = io('http://172.20.150.140');
      // var socket = io('http://127.0.0.1:9000');
      this.connection.on('bridge data', this.updateDOM);
    },
    updateDOM: function (data) {
      $("#toast-container").remove();
      var bridgeLED;
      var bridgeSchedule;
      $.each(data, function (bridge) {
        if(data[bridge] !== null){
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
            var newEstLiftTime = new Date(estLiftTime);
            bridge = bridge.replace(/\s/g, '-');
            bridgeSchedule.empty()
              .append("Lift est: "+ moment(newEstLiftTime).format('ddd [at] LT'))
              .show();
          } else{
            bridgeSchedule.hide().empty();
          }
        }
      });
    }
  },
  nav: {
   setUp: function () {
      var $menu = $('#menu'),
        $menulink = $('.menu-link'),
        $wrap = $('#content-wrap');

      $menulink.click(function() {
        $menulink.toggleClass('active');
        $wrap.toggleClass('active');
        return false;
      });

      $( "#multco-us" ).click(function () {
        if (typeof window.cordova === 'undefined') {
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

        $menulink.toggleClass('active');
        $wrap.toggleClass('active');
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

        $menulink.toggleClass('active');
        $wrap.toggleClass('active');
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

        $menulink.toggleClass('active');
        $wrap.toggleClass('active');
      });

      $( "#menu-settings").click(function(){
        app.settings.render();
        $("#bridge-page").hide();
        $("#feed-page").hide();
        $("#terms-page").hide();
        $("#hawthorne-page").hide();
        $("#morrison-page").hide();
        $("#burnside-page").hide();
        $("#broadway-page").hide();
        $("#cuevas-crossing-page").hide();
        $("#settings-page").show();

        $menulink.toggleClass('active');
        $wrap.toggleClass('active');
      });

      $("#hawthorne").click(this.showBridgePage);

      $("#morrison").click(this.showBridgePage);

      $("#burnside").click(this.showBridgePage);

      $("#broadway").click(this.showBridgePage);

      $("#cuevas-crossing").click(this.showBridgePage);

      $(".bridge-link").click(function (event) {
        var bridge = event.currentTarget.id.replace('-link', "");
        if (typeof window.cordova === 'undefined') {
          window.open('https://multco.us/bridge-services/'+ bridge);
        } else {
          var ref = cordova.InAppBrowser.open('https://multco.us/bridge-services/'+ bridge, '_blank', 'enableViewportScale=yes;location=yes');
        }
      });
    },
    showBridgePage: function(event){
      var bridge = event.currentTarget.id;
      $("#"+ bridge +"-last-5").empty();
      $("#bridge-page").hide();
      $("#"+ bridge +"-page").show();
      $.getJSON( "https://api.multco.us/bridges/"+ bridge +"/events/actual/5", function( data ) {
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
          // var upTime = val.upTime.toString();
          var upTime = new Date(val.upTime);
          // var downTime = val.downTime.toString();
          var downTime = new Date(val.downTime);
          var duration = downTime - upTime;
          $("#"+ bridge +"-data").append(
            "<tr>"+
              "<td>"+moment(upTime).format('lll')+"</td>"+
              "<td>"+moment(downTime).format('lll')+"</td>"+
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
      bridgeLED.empty().html("<i class='material-icons' style='padding-top:12.5px'>error_outline</i>");
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
