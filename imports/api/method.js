import SimpleSchema from 'simpl-schema';

export function Method(name, schema, body) {

    var schema = schema;
    var body = body;

    if( typeof(name) !== 'string' )
        throw new Error('incorrect type of \'name\' argument');
    Object.defineProperties(this, {
        name:{
            value: name,
            enumerable: true,
            writable: false,
        },
        schema:{
            enumerable: true,
            get: () => schema,
            set: function(newValue){
                if( !(newValue instanceof SimpleSchema) )
                    throw new Error('incorrect type of \'schema\' argument');
                schema = newValue;
            }
        },
        body:{
            enumerable: true,
            get: () => body,
            set: function(newValue){
                if( !(newValue instanceof Function) )
                    throw new Error('incorrect type of \'body\' argument');
                body = newValue;
            }
        }
    });
    this.schema = schema; // validate initial values with setters
    this.body = body;

    this.validate = function(args){
        this.schema.validate(args);
    }
    this.run = function(args){
        return this.body(args);
    }
    this.call = function(args, options, callback){
        return Meteor.apply(this.name, args, options, callback);
    }
}