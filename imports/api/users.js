import { Meteor } from 'meteor/meteor';

if(Meteor.isServer){
    Meteor.publish('users.thisUser', function(){
        return Meteor.users.find({ _id: this.userId });
    });
    Meteor.publish('users.hiddenUsersNames', function(){
        return Meteor.users.find({ isHidden: true }, { fields: { username: 1, isHidden: 1, _id: 1 } });
    });
    Meteor.publish('users.otherUsers', function(){
        return Meteor.users.find({ isHidden: false }, { fields: { services: 0 } });
    });
}

Meteor.methods({
    'users.hideProfile'(setTo) {
        Meteor.users.update({ _id: this.userId }, { $set: { isHidden: setTo } });
    },
    'users.makeHistoryPublic'(setTo) {
        Meteor.users.update({ _id: this.userId }, { $set: { isHistoryPublic: setTo } });
    },
    'users.shareHistoryTo'(userId, setTo) { // so many IFs!
        if (setTo) {
            if (Meteor.users.findOne({ _id: this.userId }).sharedTo) {
                Meteor.users.update({ _id: this.userId }, { $push: { sharedTo: userId } });
            } else {
                Meteor.users.update({ _id: this.userId }, { $set: { sharedTo: [userId] } });
            }
        } else {
            if (Meteor.users.findOne({ _id: this.userId }).sharedTo) {
                Meteor.users.update({ _id: this.userId }, { $pull: { sharedTo: userId } });
                if (Meteor.users.findOne({ _id: this.userId }).sharedTo.length == 0) {
                    Meteor.users.update({ _id: this.userId }, { $unset: { sharedTo: "" } });
                }
            }
        }
    }
});