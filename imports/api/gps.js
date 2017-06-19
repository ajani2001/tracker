import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const location = new Mongo.Collection('location');

Meteor.methods({
    'location.saveCurrent'(currentLocation){
        location.insert({
            'location': currentLocation,
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