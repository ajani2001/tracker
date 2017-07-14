import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './body.html';

Template.body.helpers({
    currentStatus: function(){
        return Meteor.status().status;
    },
});