import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { location } from '../api/gps.js';
import './body.html';
import './dummy.js';
import './history.js';
import './map.js';

Template.body.onCreated(function(){
    Meteor.subscribe('location');
});

Template.body.helpers({
    currentStatus: function(){
        return Meteor.status().status;
    },
});

FlowRouter.route('/', {
    name: 'location.showMap',
    action(params, queryParams){
        BlazeLayout.render('map');
    }
})

FlowRouter.route('/dummy', {
    name:'location.showDummy',
    action(params, queryParams){
        BlazeLayout.render('dummy');
    }
});
FlowRouter.route('/history', {
    name: 'location.showRecent',
    action(params, queryParams){
        BlazeLayout.render('history');
    }
});