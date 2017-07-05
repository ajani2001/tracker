import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Tracker } from '../api/tracker.js';
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
        if(Tracker.geocoder == null){ //very crutchy
            if(GoogleMaps.loaded())
                Tracker.geocoder = new google.maps.Geocoder();
            else
                return;
        }
        var recordId = this._id
        Tracker.geocoder.geocode({
            location: new google.maps.LatLng(this.location.coords.latitude,this.location.coords.longitude)
        },
        function(result, status){
            Meteor.call('location.setAddress', recordId, result[0].formatted_address);
        });
    }
});