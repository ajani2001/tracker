import { assert } from 'meteor/practicalmeteor:chai';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { Random } from 'meteor/random';

import { errors } from './errors.js';
import { locations } from './locations.js';
import './users.js';

if (Meteor.isServer) {
    describe('publications', function () {

        const defaultUser = { _id: Random.id(), createdAt: new Date(), username: 'IVAN', services: { secret: 'secret' } };
        const privateUser = { _id: Random.id(), createdAt: new Date(), username: 'parano1a', services: { secret: 'secret' }, isHidden: true };
        const publicUser = { _id: Random.id(), createdAt: new Date(), username: 'AkuraTheSlayer', services: { secret: 'secret' }, isHistoryPublic: true };
        const friendlyUser = { _id: Random.id(), createdAt: new Date(), username: 'Yippi <3', services: { secret: 'secret' }, sharedTo: [privateUser._id, defaultUser._id] };
        const users = [defaultUser, privateUser, publicUser, friendlyUser];

        const defaultUserCollector = new PublicationCollector({ userId: defaultUser._id });
        const privateUserCollector = new PublicationCollector({ userId: privateUser._id });
        const publicUserCollector = new PublicationCollector({ userId: publicUser._id });
        const friendlyUserCollector = new PublicationCollector({ userId: friendlyUser._id });
        const collectors = [defaultUserCollector, privateUserCollector, publicUserCollector, friendlyUserCollector];

        errors.remove({});
        locations.remove({});
        Meteor.users.remove({});

        before(function () {
            users.forEach((user) => {
                Meteor.users.insert(user);
                errors.insert({
                    error: {
                        code: 0,
                        message: user.username + "'s error message"
                    },
                    userId: user._id,
                    time: new Date(),
                    trackName: 'publications.tests'
                });
                locations.insert({
                    location: {
                        coords: {
                            latitude: 1.234,
                            longitude: 5.678,
                            speed: 90
                        },
                        timestamp: 123851205
                    },
                    userId: user._id,
                    time: new Date(),
                    trackName: 'publications.tests',
                    description: 'dummy point'
                });
            });
        });    
        
        describe('errors', function () {

            describe('errors available only to their owner', function () {

                users.forEach((user) => {
                    it(user.username + ' has access only to their errors', function (done) {
                        collectors.find((collector) => (collector.userId == user._id ? true : false)).collect('errors.thisUserErrors', (collections) => {
                            assert.equal(collections.errors.length, 1);
                            assert.equal(collections.errors[0].userId, user._id);
                            done();
                        });
                    });
                });
            });
        });

        describe('locations', function () {

            describe('each user has access to their location points', function () {

                users.forEach((user) => {
                    it(user.username + ' has access to their errors', function (done) {
                        collectors.find((collector) => (collector.userId == user._id ? true : false)).collect('locations.thisUserLocations', (collections) => {
                            assert.equal(collections.locations.length, 1);
                            assert.equal(collections.locations[0].userId, user._id);
                            done();
                        });
                    });
                });
            });

            describe('each user has access to locations of users have made their locations public', function () {

                let publicUsers = users.filter((user) => (user.isHistoryPublic));
                users.forEach((user) => {
                    it(user.username + ' has access to public locations', function (done) {
                        collectors.find((collector) => (collector.userId == user._id ? true : false)).collect('locations.publicLocations', (collections) => {
                            publicUsers.forEach((publicUser) => {
                                assert.isTrue(collections.locations.some( (location) => location.userId == publicUser._id ));
                            });
                            done();
                        });
                    });
                });
            });

            describe('user has access to locations of other users who have shared their history with him', function () {

                let sharedUsers = users.filter((user) => !!user.sharedTo);

                sharedUsers.forEach( (sharedUser) => {
                    sharedUser.sharedTo.forEach( (userId) => {
                        let currentUser = users.find((user) => user._id == userId);
                        it(currentUser.username + ' has access to ' + sharedUser.username + '\'s locations', function(done){
                            collectors.find( (collector) => collector.userId == userId ).collect('locations.sharedLocations', function(collections){
                                assert.isTrue( !!collections.locations.find((location) => location.userId == sharedUser._id));
                                done();
                            });
                        });
                    });
                });
            });

            describe('and what do we have', function(){

                users.forEach( (currentUser) => {
                    describe(currentUser.username, function(){
                        users.forEach( (user) => {
                            if(user == currentUser) return;

                            let access = (user.isHistoryPublic || user.sharedTo && user.sharedTo.some( (userId) => userId == currentUser._id ) ) ? true : false;

                            it( 'has' + (access?' ':'n\'t ') + 'access to ' + user.username + '\'s' + ' locations', function(done){
                                collectors.find( (collector) => collector.userId == currentUser._id ).collect('locations.sharedLocations', function(collections){
                                    assert.equal( collections.locations.some( (location) => location.userId == user._id), access );
                                    done();
                                });
                            });
                        });
                    });
                });
            });
        });

        describe('users', function () {

            describe('each user has full access to their fields', function(){

                users.forEach( (user) => {
                    it(user.username + ' has full access to the user object', function(done){
                        collectors.find( (collector) => collector.userId == user._id ).collect('users.thisUser', function(collections){
                            assert.deepEqual(collections.users.find( (dbUser) => dbUser._id == user._id ), user);
                            done();
                        });
                    });
                });
            });

            describe('users have little information about other users with hidden profiles', function(){

                users.forEach( (currentUser) => {
                    it(currentUser.username + ' has access to hidden users\' available information', function(done){
                        collectors.find( (collector) => collector.userId == currentUser._id ).collect('users.hiddenUsersNames', function(collections){ // practicalmeteor update chai pleaz
                            assert.equal(collections.users.filter( (user) => user.isHidden).length, users.filter( (user) => user.isHidden).length );
                            users.filter( (user) => user.isHidden ).forEach( (hiddenUser) => assert.isTrue( collections.users.some( (userRecord) => userRecord._id == hiddenUser._id ) ) );
                            done();
                        });
                    }); 
                });
            });

            describe('users have access to each field except \'services\' of non-hidden user', function(){
                
                users.forEach( (currentUser) => {
                    it(currentUser.username + ' has access to normal users', function(done){
                        collectors.find( (collector) => collector.userId == currentUser._id ).collect('users.otherUsers', function(collections){
                            collections.users.filter( (dbUser) => dbUser._id != currentUser._id ).forEach( (anotherUser) => {
                                anotherUser.isHidden?assert.isUndefined(anotherUser.createdAt):assert.isDefined(anotherUser.createdAt); // practicalmeteor update chai pleaz
                                assert.isUndefined(anotherUser.services);
                            });
                            done();
                        });
                    });
                });
            });
        });
    });
}