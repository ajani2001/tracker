import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { sinon } from 'meteor/practicalmeteor:sinon';
import { Random } from 'meteor/random';

import { errors } from './errors.js';
import { locations } from './locations.js';
import './users.js';

if(Meteor.isServer){
    describe('Methods', function(){

        var context = { userId: Random.id() };

        describe('errors', function(){
            
            beforeEach(() => { errors.remove({}); });
            afterEach(() => { errors.remove({}); });

            it('can simply insert an error to the database', function(){

                const method = Meteor.server.method_handlers['errors.saveError'];
                var args = [{ code: 1, message: 'error' }, 'trackName0'];
                method.apply(context, args);

                var insertedError = errors.findOne({});

                assert.equal(errors.find({}).count(), 1);
                assert.equal(insertedError.userId, context.userId);
                assert.deepEqual(insertedError.error, args[0]);
                assert.equal(insertedError.trackName, args[1]);
            });

            it('throws an error when inserting if the error object doesnt match the defined schema', function(){

                const method = Meteor.server.method_handlers['errors.saveError'];
                var spy = sinon.spy(method);
                var args = [{ code: true, message: 228 }, 'trackName0'];

                try{
                    spy.apply(context, args);
                } catch(err){}

                assert.isTrue(spy.threw());
            });
        });

        describe('locations', function(){
            
            beforeEach(() => { locations.remove({}); });
            afterEach(() => { locations.remove({}); });

            it('can simply insert a location point to the database', function(){

                const method = Meteor.server.method_handlers['locations.saveLocation'];
                var args = [{
                    coords: {
                        latitude: 80,
                        longitude: 80,
                        speed: 0
                    },
                    timestamp: 131352352
                }, 'trackName0'];
                method.apply(context, args);

                var insertedLocation = locations.findOne({});

                assert.equal(locations.find({}).count(), 1);
                assert.equal(insertedLocation.userId, context.userId);
                assert.deepEqual(insertedLocation.location, args[0]);
                assert.equal(insertedLocation.trackName, args[1]);
            });

            it('throws an error when inserting if the location object doesnt match the defined schema', function(){

                const method = Meteor.server.method_handlers['locations.saveLocation'];
                var spy = sinon.spy(method);
                var args = [{ timestamp: 1234567890 }, 'trackName0'];

                try{
                    spy.apply(context, args);
                } catch(err){}

                assert.isTrue(spy.threw());
            });
        });

        describe('users', function(){
        
            var user = {
                _id: context.userId,
                createdAt: new Date(),
                username: 'Ajani'
            };
            beforeEach(() => { Meteor.users.insert(user) });
            afterEach(() => { Meteor.users.remove({}) });

            it('can set and unset user\'s profile as hidden', function(){

                const method = Meteor.server.method_handlers['users.hideProfile'];

                assert.isUndefined( Meteor.users.findOne({_id: user._id}).isHidden );

                method.call(context, true);
                assert.isTrue( Meteor.users.findOne({_id: user._id}).isHidden );

                method.call(context, false);
                assert.isFalse( Meteor.users.findOne({_id: user._id}).isHidden );
            });

            it('can set and unset \'isHistoryPublic\' flag', function(){
                
                const method = Meteor.server.method_handlers['users.makeHistoryPublic'];

                assert.isUndefined( Meteor.users.findOne({_id: user._id}).isHistoryPublic );

                method.call(context, true);
                assert.isTrue( Meteor.users.findOne({_id: user._id}).isHistoryPublic );

                method.call(context, false);
                assert.isFalse( Meteor.users.findOne({_id: user._id}).isHistoryPublic );
            });

            it('can add/remove user to/from the list of users with whom they shared location history', function(){  //change description

                const method = Meteor.server.method_handlers['users.shareHistoryTo'];
                const user1 = { _id: Random.id(), createdAt: new Date(), username: Random.secret(8) };
                const user2 = { _id: Random.id(), createdAt: new Date(), username: Random.secret(8) };

                assert.isUndefined( Meteor.users.findOne({_id: user._id}).sharedTo );

                method.call(context, user1._id, true);
                assert.include( Meteor.users.findOne({_id: user._id}).sharedTo, user1._id );

                method.call(context, user2._id, true);
                assert.include( Meteor.users.findOne({_id: user._id}).sharedTo, user1._id );
                assert.include( Meteor.users.findOne({_id: user._id}).sharedTo, user2._id );
                
                method.call(context, user1._id, false);
                assert.notInclude( Meteor.users.findOne({_id: user._id}).sharedTo, user1._id );
                assert.include( Meteor.users.findOne({_id: user._id}).sharedTo, user2._id );

                method.call(context, user2._id, false);
                assert.isUndefined( Meteor.users.findOne({_id: user._id}).sharedTo );
            });
        });
    });
}