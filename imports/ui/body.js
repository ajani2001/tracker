import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './body.html';
import './history.js';
import './map.js';
import './edit.js';

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

FlowRouter.route('/history', {
    name: 'location.showRecent',
    action(params, queryParams){
        BlazeLayout.render('history');
    }
});

FlowRouter.route('/point/', {
    name: 'location.editPoint',
    action(params, queryParams) {
        BlazeLayout.render('edit');
    }
});