import { Template } from 'meteor/templating';
import { location } from '../api/gps.js';
import './edit.html';

Template.edit.helpers({
    currentPoint: function () {
        return location.findOne({ _id: FlowRouter.getQueryParam('id') });
    },
    location: function () {
        return location;
    }
});