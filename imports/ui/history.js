import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { location } from '../api/gps.js';
import './history.html';
import './point.js';

Template.history.onCreated(function(){
    Session.set('historyLimit', 10);
});

Template.history.helpers({
    History: function(){
        return location.find({ location: { $ne: null } }, { sort: { time: 1 }, limit: Session.get('historyLimit') } );
    },
    recordsLeft: function(){
        return ( location.find({ location: { $ne: null } }).count() > Session.get('historyLimit') );
    }
});

Template.history.events({
    'click #loadMore'(){
        Session.set('historyLimit', Session.get('historyLimit')+10);
    }
});