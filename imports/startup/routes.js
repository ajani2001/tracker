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

FlowRouter.route('/point/', {
    name: 'location.editPoint',
    action(params, queryParams) {
        BlazeLayout.render('edit');
    }
});