import { Meteor } from 'meteor/meteor';
import { Method } from './method.js';
import { assert } from 'meteor/practicalmeteor:chai';
import SimpleSchema from 'simpl-schema';

if(Meteor.isServer){
    describe('API', function () {
        describe('Method object', function () {
            describe('throws an error if any of given arguments is of incorrect type', function () {
                
                let ifErrorCatched = false;
                beforeEach(function(){
                    ifErrorCatched = false;
                });

                it('error if \'name\' argument is not a string', function(){
                    try{
                        new Method(1337, new SimpleSchema(), new Function());
                    }
                    catch (error) {
                        ifErrorCatched = true;
                    }
                    assert.isTrue(ifErrorCatched);
                });

                it('error if \'schema\' argument is not a SimpleSchema', function(){
                    try{
                        new Method('string', 'kek', new Function());
                    }
                    catch (error) {
                        ifErrorCatched = true;
                    }
                    assert.isTrue(ifErrorCatched);
                });

                it('error if \'body\' argument is not a function', function(){
                    try{
                        new Method('string', new SimpleSchema(), 'string');
                    }
                    catch (error) {
                        ifErrorCatched = true;
                    }
                    assert.isTrue(ifErrorCatched);
                });

                it('nothing is thrown if each argument is of the right type', function(){
                    new Method('string', new SimpleSchema(), new Function());
                })
            });

            describe('schema and main function can be changed', function(){

                let testedMethod;
                beforeEach(function(){
                    testedMethod = new Method('', new SimpleSchema(), function(){ return 'kek'; });
                });

                it('schema can be changed', function(){
                    testedMethod.schema = new SimpleSchema({
                        arg1: {
                            type: String,
                            label: 'string'
                        },
                        arg2: {
                            type: Number,
                            label: 'number'
                        }
                    });
                    testedMethod.validate({ arg1: 'arg1', arg2: 2 });
                });

                it('body can be changed', function(){
                    testedMethod.body = function(value){ return value; }
                    assert.equal(testedMethod.run('dummy'), 'dummy');
                });

                it('name cannot be changed', function(){
                    try{
                        testedMethod.name = 'newName';
                    }
                    catch(err){
                        assert.isTrue( err instanceof TypeError ); // error will be catched if 'use strict' is set
                    }
                    assert.equal(testedMethod.name, '');
                });

            });
        });
    });
}