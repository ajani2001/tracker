import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const locations = new Mongo.Collection('locations');
locations.attachSchema(new SimpleSchema({
    location: {
        type: Object
    },
    'location.coords': {
        type: Object
    },
    'location.coords.latitude': {
        type: Number
    },
    'location.coords.longitude': {
        type: Number
    },
    'location.coords.altitude': {
        type: Number,
        optional: true
    },
    'location.coords.accuracy': {
        type: Number,
        optional: true
    },
    'location.coords.altitudeAccuracy': {
        type: Number,
        optional: true
    },
    'location.coords.heading': {
        type: Number,
        optional: true
    },
    'location.coords.speed': {
        type: Number,
        optional: true
    },
    'location.timestamp': {
        type: Number
    },
    userId: {
        type: String // ?? maybe a special userid type exists
    },
    time: {
        type: Date
    },
    trackName: {
        type: String
    },
    address: {
        type: String,
        optional: true
    },
    description: {
        type: String,
        max: 400,
        optional: true
    }
}));

if(Meteor.isServer){
    Meteor.publish('locations.thisUserLocations', function(){
        return locations.find({ userId: this.userId });
    });
    Meteor.publish('locations.publicLocations', function(){
        return locations.find({ userId: { $in: Meteor.users.find({ isHistoryPublic: true }).fetch().map( (user) => user.userId ) } });
    });
    Meteor.publish('locations.sharedLocations', function(){
        return locations.find({ userId: { $in: Meteor.users.find({ sharedTo: { $exists: true } }).map( (user) => ( user.sharedTo.some( (userId) => ( userId == this.userId ? true : false ) ) ? user._id : undefined ) ) } });
    });
}

Meteor.methods({
    'locations.saveLocation'(location, trackName) {
        locations.insert({
            location: location,
            userId: this.userId,
            time: new Date(),
            trackName: trackName
        });
    }
});