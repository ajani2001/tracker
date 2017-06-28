import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Tracker } from '../api/tracker.js';
import './body.html';

Template.body.onCreated(function(){
    Meteor.subscribe('location');
    Tracker.init();
});

Template.body.helpers({
    currentPosition: function(){
        lastRecord = Session.get('lastRecord');
        if (lastRecord === undefined || !lastRecord.time) {
            return;
        }
        return 'latitude: ' + lastRecord.location.coords.latitude + ' longitude: ' + lastRecord.location.coords.longitude;
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