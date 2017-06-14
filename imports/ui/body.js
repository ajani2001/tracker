import { Template } from 'meteor/templating';
import './body.html';

var positionData = 'null';

Template.body.helpers({
    currentPosition(){
        var success = function(position){
            console.log(position);
            var r = 'latitude: ' + position.coords.latitude + ', longitude: ' + position.coords.longitude;
            alert(r);
            window.positionData = r;
        }
        function error(info){
            alert('error');
            positionData = info;
        }
        navigator.geolocation.getCurrentPosition(success, error);
        return positionData;
    },
});