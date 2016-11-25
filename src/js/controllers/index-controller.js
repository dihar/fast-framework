
ff.controller.set('index', function(){

	ff.view('index', {
		name: 'fast-framework',
		layout: 'main'
	}, function(template){
		$('#mustache-target').html(template);
		ff.state.hideLoader();
	});

});