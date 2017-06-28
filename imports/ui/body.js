import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Tracker } from '../api/tracker.js';
import './body.html';

Template.body.onCreated(function(){
    Meteor.subscribe('location');
    Tracker.init();
    Tracker.loop();
});

Template.body.helpers({
    currentPosition: function(){
        lastRecord = Session.get('lastRecord');
        if (lastRecord === undefined || !lastRecord.time) {
            return;
        }
        if ('errorInfo' in lastRecord) {
            console.log(lastRecord.errorInfo.message);
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