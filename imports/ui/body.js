import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './body.html';

import { location } from '../api/gps.js';

Template.body.onCreated(function bodyOnCreate(){
    function success(position){
        alert(position.coords.latitude);
        Meteor.call('location.saveCurrent', position);
    }
    function error(info){
        Meteor.call('location.saveError', info);
    }
    navigator.geolocation.getCurrentPosition(success, error);
});

Template.body.helpers({
    currentPosition(){
        console.log(location.find({}));
        return 0;
    },
});

Template.body.events({
    'click .reload'(event){
        alert(1);
    },
});