import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { location } from '../api/gps.js';

export var Tracker = {
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
        Meteor.call('location.saveCurrent', Tracker.clone(position), Meteor.userId());
    },
    error: function(info) {
        console.log(info.message);
        Meteor.call('location.saveError', Tracker.clone(info), Meteor.userId());
    },
    updatePosition: function(){
        navigator.geolocation.getCurrentPosition(Tracker.success, Tracker.error);
    },
    updateMap: function(){
        var record = location.find({ location: { $ne: null }, time: { $gt: Tracker.lastRecord.time } }, { sort: { time: 1 } } ).fetch();
        if(record.length == 0){
            console.log(Tracker.lastRecord.time);
            console.log('no new data');
            return;
        }

        var isChanged = false;
        Tracker.setLastRecord(record[record.length-1]);
        for(var i=0; i<record.length; i++){
            if( Tracker.points.length != 0 && record[i].location.coords.latitude == Tracker.points[Tracker.points.length-1].lat && record[i].location.coords.longitude == Tracker.points[Tracker.points.length-1].lng){
                continue;
            }
            Tracker.points.push({ lat: record[i].location.coords.latitude, lng: record[i].location.coords.longitude });
            isChanged = true;
        }
        if(!isChanged){
            console.log('nothing was update');
            return;
        }
            
        Tracker.line.setPath(Tracker.points);
        Tracker.map.setCenter(Tracker.points[Tracker.points.length-1]);
    },
    setLastRecord: function(toSet){ //nice crutch
        Tracker.lastRecord = toSet;
        Session.set('lastRecord', Tracker.lastRecord);
    },
    loop: function(){
        var self = Tracker;
        setTimeout(function(){
            if(self.begin){
                self.updatePosition();
                self.updateMap();
            }
            self.loop();
        }, self.interval)
    },
    init: function(){
        var self = Tracker;
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
            self.begin = true;
        });
    },
    lastRecord: {time: new Date(0)}, // another crutch
    points: new Array(),
    map: null,
    line: null,
    interval: 1000,
    begin: false
};