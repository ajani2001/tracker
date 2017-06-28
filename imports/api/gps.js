import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const location = new Mongo.Collection('location');

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
});