import { Template } from 'meteor/templating';
import { location } from '../api/gps.js';
import { Session } from 'meteor/session';
import './edit.html';

Template.edit.helpers({
    currentPoint: function () {
        return location.findOne({ _id: Session.get('currentPoint') });
    }
});