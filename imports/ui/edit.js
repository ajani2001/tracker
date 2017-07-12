import { Template } from 'meteor/templating';
import { location } from '../api/gps.js';
import { Tracker } from 'meteor/tracker';
import SimpleSchema from 'simpl-schema';
import './edit.html';

Template.edit.helpers({
    currentPoint: function () {
        return location.findOne({ _id: FlowRouter.getQueryParam('id') });
    },
    location: function() {
        return location;
    },
    editingSchema: function() {
        return new SimpleSchema({
            address: {
                type: String,
                label: 'Address',
            },
            description: {
                type: String,
                label: 'Description',
                max: 400
            }
        }, {tracker: Tracker, requiredByDefault: false});
    }
});

Template.registerHelper('edit', function(){
    if(FlowRouter.getRouteName() === 'location.editPoint')
        return true;
});