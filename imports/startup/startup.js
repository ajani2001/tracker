import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Meteor.startup( function(){
    GoogleMaps.load({key: "AIzaSyA26KsNInPZmyqlTUA3IfBKl4A1kKvCYRs"});
    Accounts.ui.config({passwordSignupFields: 'USERNAME_ONLY'});
});