import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { DDP } from 'meteor/ddp-client';
import { Session } from 'meteor/session';
import { ReactiveDict } from 'meteor/reactive-dict';
import './body.html';

import { location } from '../api/gps.js';

function clone(obj) {
    if (typeof (obj) != 'object' || obj == null) {
        return obj;
    }
    var toReturn = {};

    for (var property in obj) {
        toReturn[property] = clone(obj[property]);
    }
    return toReturn;
}

Meteor.startup( function(){
    //this.conn = new DDP.connect('http://90.188.118.184:3000');
    GoogleMaps.load({key: "AIzaSyA26KsNInPZmyqlTUA3IfBKl4A1kKvCYRs"});
});

Template.body.onCreated(function(){
    GoogleMaps.ready('display', function(){
        this.map = GoogleMaps.maps.display.instance;
        this.points = new Array();
        this.line = new google.maps.Polyline({
            path: points,
            geodesic: true,
            strokeColor: '#3366CC',
            strokeOpacity: 1.0,
            strokeWeight: 2,
            map: GoogleMaps.maps.display.instance
        });
        setInterval(function(){
            //alert(conn.status().status);
            function clone(obj) {
                if (typeof (obj) != 'object' || obj == null) {
                    return obj;
                }
                var toReturn = {};

                for (var property in obj) {
                    toReturn[property] = clone(obj[property]);
                }
                return toReturn;
            }
            function success(position) {
                Meteor.call('location.saveCurrent', clone(position));
            }
            function error(info) {
                alert(info.message);
                Meteor.call('location.saveError', clone(info));
            }
            navigator.geolocation.getCurrentPosition(success, error);

            var record = location.find({ location: { $ne: null } }, { sort: { time: -1 } } ).fetch();
            for(var i=0; i<record.length; i++){
                points[i]={ lat: record[i].location.coords.latitude, lng: record[i].location.coords.longitude };
            }
            line.setPath(points);

            map.setCenter(points[0]);
        }, 1000);
    });
});

Template.body.helpers({
    isCordova: function(){
        return Meteor.isCordova;
    },
    currentPosition: function(){
        var lastRecord = location.find({ location: { $ne: null } }, { sort: { time: -1 } } ).fetch()[0];
        if (lastRecord === undefined) {
            return;
        }
        if ('errorInfo' in lastRecord) {
            alert(lastRecord.errorInfo.message);
        }
        return 'latitude: ' + lastRecord.location.coords.latitude + ' longitude: ' + lastRecord.location.coords.longitude + ' time: ' + lastRecord.time;
    },
    currentStatus: function(){
        return Meteor.status().status;
    },
    mapOnLoad: function(){
        if(GoogleMaps.loaded()){
            return {
                center: {lat: 0, lng: 0},
                zoom: 16
            };
        }
    },
});

Template.body.events({
});