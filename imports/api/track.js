import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { location } from '../api/gps.js';

export var Track = {
    clone: function clone(obj) {
        if (typeof (obj) != 'object' || obj == null) {
            return obj;
        }
        var toReturn = {};

        for (var property in obj) {
            toReturn[property] = clone(obj[property]);
        }
        return toReturn;
    },
    success: function(position) {
        Meteor.call('location.saveCurrent', Track.clone(position), Meteor.userId());
    },
    error: function(info) {
        console.log(info.message);
        Meteor.call('location.saveError', Track.clone(info), Meteor.userId());
    },
    updatePosition: function(){
        navigator.geolocation.getCurrentPosition(Track.success, Track.error, { enableHighAccuracy: true });
    },
    updateMap: function(){
        var record = location.find({ location: { $ne: null }, time: { $gt: Track.lastRecord.time } }, { sort: { time: 1 } } ).fetch();
        if(record.length == 0){
            return;
        }

        var isChanged = false;
        Track.setLastRecord(record[record.length-1]);
        for(var i=0; i<record.length; i++){
            if( Track.points.length != 0 && record[i].location.coords.latitude == Track.points[Track.points.length-1].lat && record[i].location.coords.longitude == Track.points[Track.points.length-1].lng){
                continue;
            }
            Track.points.push({ lat: record[i].location.coords.latitude, lng: record[i].location.coords.longitude });
            isChanged = true;
        }
        if(!isChanged){
            return;
        }
            
        Track.line.setPath(Track.points);
        Track.map.setCenter(Track.points[Track.points.length-1]);
    },
    setLastRecord: function(toSet){ //nice crutch
        Track.lastRecord = toSet;
        Session.set('lastRecord', Track.lastRecord);
    },
    loop: function(){
        var self = Track;
        self.currentTimeoutId = setTimeout(function(){
            if(Meteor.isCordova)
                self.updatePosition();
            self.updateMap();
            if(self.running)
                self.loop();
        }, self.interval)
    },
    init: function(){
        var self = Track;
        self.running = true;
        GoogleMaps.ready('display', function(){
            self.map = GoogleMaps.maps.display.instance;
            self.line = new google.maps.Polyline({
                path: self.points,
                geodesic: true,
                strokeColor: '#3366CC',
                strokeOpacity: 1.0,
                strokeWeight: 2,
                map: self.map
            });
            self.geocoder = new google.maps.Geocoder();
            self.loop();
        });
    },
    stop: function(){
        Track.running = false;
        clearTimeout(Track.currentTimeoutId);
    },
    clear: function(){
        Track.stop();
        Track.setLastRecord({time: new Date(0)});
        Track.points = new Array();
        Track.map = null;
        Track.line = null;
        Track.interval = 2000;
        //Tracker.geocoder = null;
        Track.running = false;
        Track.currentTimeoutId = null;
    },
    lastRecord: {time: new Date(0)}, // another crutch
    points: new Array(),
    map: null,
    line: null,
    interval: 10000,
    geocoder: null,
    running: false,
    currentTimeoutId: null,
};