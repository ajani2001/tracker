import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const location = new Mongo.Collection('location');
location.attachSchema(new SimpleSchema({
    location: {
        type: Object,
        label: 'Location info'
    },
    'location.timestamp': {
        type: Number
    },
    'location.coords': {
        type: Object,
        label: 'Coordinates data',
        required: true
    },
    'location.coords.latitude': {
        type: Number,
        label: 'Latitude',
        required: true
    },
    'location.coords.longitude': {
        type: Number,
        label: 'Longitude',
        required: true
    },
    'location.coords.altitude': {
        type: Number,
        label: 'Altitude',
    },
    'location.coords.accuracy': {
        type: Number,
        label: 'Accuracy',
    },
    'location.coords.altitudeAccuracy': {
        type: Number,
        label: 'Altitude Accuracy',
    },
    'location.coords.heading': {
        type: Number,
        label: 'Heading',
    },
    'location.coords.speed': {
        type: Number,
        label: 'Speed',
    },
    errorInfo: {
        type: Object,
        label: 'Error info'
    },
    'errorInfo.message': {
        type: String,
        label: 'Error description',
        required: true
    },
    'errorInfo.code': {
        type: Number,
        label: 'Error code',
        required: true
    },
    time: {
        type: Date,
        label: 'Time',
        required: true
    },
    userId: {
        type: String,
        label: 'userId',
        required: true
    },
    address: {
        type: String,
        label: 'Address',
    },
    description: {
        type: String,
        label: 'Description',
        max: 400
    }
},{ tracker: Tracker, requiredByDefault: false }));

if(Meteor.isServer){
    Meteor.publish('location', function(){
        return location.find({userId: this.userId});
    });
}

Meteor.methods({
    'location.saveCurrent'(currentLocation, userId){
        location.insert({
            'location': currentLocation,
            'time': new Date(),
            'userId': userId
        });
    },
    'location.saveError'(error, userId){
        location.insert({
            'errorInfo': error,
            'time': new Date(),
            'userId': userId
        });
    },
    'location.setAddress'(recordId, address){
        location.update(recordId, { $set: { address: address } });
    },
    'location.updatePoint'(newPoint){
        location.update(newPoint._id, newPoint.modifier);
    }
});