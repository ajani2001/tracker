import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Track } from '../api/track.js';
import SimpleSchema from 'simpl-schema';

Meteor.startup( function(){
    Meteor.subscribe('location');
    GoogleMaps.load({key: "AIzaSyA26KsNInPZmyqlTUA3IfBKl4A1kKvCYRs"});
    Accounts.ui.config({passwordSignupFields: 'USERNAME_ONLY'});
    Accounts.onLogout(Track.clear);
    SimpleSchema.extendOptions(['autoform']);
});