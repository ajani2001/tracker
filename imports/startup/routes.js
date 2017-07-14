import '../ui/body.js';
import '../ui/history.js';
import '../ui/map.js';
import '../ui/point.js';

FlowRouter.route('/', {
    name: 'location.showMap',
    action(params, queryParams) {
        BlazeLayout.render('map');
    }
})

FlowRouter.route('/history', {
    name: 'location.showRecent',
    action(params, queryParams) {
        BlazeLayout.render('history');
    }
});