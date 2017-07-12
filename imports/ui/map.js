import { Template } from 'meteor/templating';
import { Track } from '../api/track.js';
import { Session } from 'meteor/session';
import './map.html';

Template.map.onCreated(function(){
    Track.init();
});

Template.map.helpers({
    currentPosition: function(){
        lastRecord = Session.get('lastRecord');
        if (lastRecord === undefined || !lastRecord.location) {
            return;
        }
        return 'latitude: ' + lastRecord.location.coords.latitude + ' longitude: ' + lastRecord.location.coords.longitude;
    },
    mapOnLoad: function(){
        if(GoogleMaps.loaded()){
            return {
                center: {lat: 0, lng: 0},
                zoom: 16
            };
        }
    }
});

Template.map.onDestroyed(function(){
    Track.clear();
});