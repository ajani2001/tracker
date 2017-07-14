import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { location } from '../api/gps.js';
import './history.html';

Template.history.onCreated(function(){
    Session.set('historyLimit', 10);
});

Template.history.helpers({
    History: function(){
        return location.find({ location: { $ne: null } }, { sort: { time: 1 }, limit: Session.get('historyLimit') } );
    },
    recordsLeft: function(){
        return ( location.find({ location: { $ne: null } }).count() > Session.get('historyLimit') );
    },
    location: function(){
        return location;
    }
});

Template.history.events({
    'click #loadMore'(){
        Session.set('historyLimit', Session.get('historyLimit')+10);
    }
});

Template.history.onDestroyed(function(){
    Session.set('historyLimit', undefined);
});