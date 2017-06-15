import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './body.html';

import { location } from '../api/gps.js';

Template.body.onCreated(function bodyOnCreate(){
    function success(position){
        Meteor.call('location.saveCurrent', position.coords.latitude, position.coords.longitude);
    }
    function error(info){
        Meteor.call('location.saveError', info);
    }
    navigator.geolocation.getCurrentPosition(success, error);
});

Template.body.helpers({
    currentPosition(){
        var oneRecord = location.findOne();
        return 'latitude: ' + oneRecord.latitude + ' longitude: ' + oneRecord.longitude;
    },
});