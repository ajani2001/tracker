import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Track } from '../api/track.js';
import './point.html';

Template.point.helpers({
    hasAddress: function(){
        return !!this.address;
    },
    address: function(){
        return this.address;
    }
});

Template.point.events({
    'click .getAddress'(){
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
});