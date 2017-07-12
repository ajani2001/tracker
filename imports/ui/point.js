import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Track } from '../api/track.js';
import { Session } from 'meteor/session';
import './point.html';

Template.point.onRendered(function(){
    console.log(this);
});

Template.point.helpers({
    address: function(){
        return this.address;
    },
    edit: function(){
        return Session.get('currentPoint') === this._id;
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
        var recordId = this._id
        Track.geocoder.geocode({
            location: new google.maps.LatLng(this.location.coords.latitude,this.location.coords.longitude)
        },
        function(result, status){
            Meteor.call('location.setAddress', recordId, result[0].formatted_address);
        });
    },
    'click .edit'(){
        FlowRouter.go('location.editPoint', {}, {id: this._id});
    },
    'click .save'(eventObj){
        eventObj.stopImmediatePropagation();
        Session.set('currentPoint', 1);
    },
    'click'(){
        Session.set('currentPoint', this._id);
    }
});