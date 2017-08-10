import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const errors = new Mongo.Collection('errors');
errors.attachSchema(new SimpleSchema({
    error: {
        type: Object
    },
    'error.code': {
        type: Number
    },
    'error.message': {
        type: String
    },
    userId: {
        type: String // maybe a special userid type exists
    },
    time: {
        type: Date
    },
    trackName: {
        type: String,
        optional: true
    }
}));

if(Meteor.isServer){
    Meteor.publish('errors.thisUserErrors', function(){
        return errors.find({userId: this.userId});
    });
}

Meteor.methods({
    'errors.saveError'(error, trackName) {
        errors.insert({
            error: error,
            userId: this.userId,
            time: new Date(),
            trackName: trackName
        });
    }
});