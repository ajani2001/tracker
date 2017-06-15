import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const location = new Mongo.Collection('location');

Meteor.methods({
    'location.saveCurrent'(latitude, longitude){
        location.insert({
            'latitude': latitude,
            'longitude': longitude,
            'time': new Date(),
        });
    },
    'location.saveError'(error){
        location.insert({
            'errorInfo': error,
            'time': new Date(),
        });
    },
});