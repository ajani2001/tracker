import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { DDP } from 'meteor/ddp-client';
import { ReactiveDict } from 'meteor/reactive-dict'
import './body.html';

import { location } from '../api/gps.js';

Meteor.startup( function(){
    this.clientStorage= new ReactiveDict();
    DDP.connect('http://90.188.118.184:3000');
    GoogleMaps.load();
});

Template.body.helpers({
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
    mapOnLoad: function(){
        if(GoogleMaps.loaded()){
            return {
                center: {lat: 0, lng: 0},
                zoom: 1
            };
        }
    },
});

Template.body.events({
    'click .reload'(event) {
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
            //if()
            Meteor.call('location.saveCurrent', clone(position));
        }
        function error(info) {
            alert(info.message);
            Meteor.call('location.saveError', clone(info));
        }
        navigator.geolocation.getCurrentPosition(success, error);

        var lastRecord = location.find({ location: { $ne: null } }, { sort: { time: -1 } } ).fetch()[0];
        var position = { lat: lastRecord.location.coords.latitude, lng: lastRecord.location.coords.longitude };
        var map = GoogleMaps.maps.display.instance;
        var marker = new google.maps.Marker({
            position,
            map
        });
        map.setZoom(8);
        map.setCenter(position);
    },
});