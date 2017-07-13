import { Template } from 'meteor/templating';
import { location } from '../api/gps.js';
import './edit.html';

Template.edit.helpers({
    currentPoint: function () {
        console.log('pp ' + location.findOne({ _id: FlowRouter.getQueryParam('id') }));
        return location.findOne({ _id: FlowRouter.getQueryParam('id') });
    },
});