import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './body.html';

import { location } from '../api/gps.js';

Template.body.helpers({
    currentPosition(){
        var oneRecord = location.findOne();
        if (oneRecord === undefined) {
            return;
        }
        if ('errorInfo' in oneRecord) {
            alert(oneRecord.errorInfo.message);
        }
        return 'latitude: ' + oneRecord.location.coords.latitude + ' longitude: ' + oneRecord.location.coords.longitude;
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
            Meteor.call('location.saveCurrent', clone(position));
        }
        function error(info) {
            Meteor.call('location.saveError', clone(info));
        }
        navigator.geolocation.getCurrentPosition(success, error);
    },
});