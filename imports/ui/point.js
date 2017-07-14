import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Track } from '../api/track.js';
import { Tracker } from 'meteor/tracker';
import { Session } from 'meteor/session';
import SimpleSchema from 'simpl-schema';
import './point.html';

Template.point.helpers({
    address: function(){
        return this.record.address;
    },
    edit: function(){
        return Session.get('currentPoint') === this.record._id;
    },
    autoFormId: function(){
        return 'edit_' + this.record._id;
    },
    editingSchema: function(){
        return new SimpleSchema({
            address: {
                type: String,
                label: 'Address',
            },
            description: {
                type: String,
                label: 'Description',
                max: 400
            }
        }, {tracker: Tracker, requiredByDefault: false});
    }
});

Template.point.events({
    'click .getAddress'(eventObj){
        eventObj.stopImmediatePropagation();
        if(Track.geocoder == null){ //very crutchy
            if(GoogleMaps.loaded())
                Track.geocoder = new google.maps.Geocoder();
            else
                return;
        }
        var recordId = this.record._id
        Track.geocoder.geocode({
            location: new google.maps.LatLng(this.record.location.coords.latitude,this.record.location.coords.longitude)
        },
        function(result, status){
            Meteor.call('location.setAddress', recordId, result[0].formatted_address);
        });
    },
    'click .btn'(eventObj){
        eventObj.stopImmediatePropagation();
        Session.set('currentPoint', undefined);
    },
    'click .point'(eventObj, instance){
        eventObj.stopImmediatePropagation();
        Session.set('currentPoint', this.record._id);
    }
});