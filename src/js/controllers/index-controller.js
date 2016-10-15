
ff.controller.set('index', function(){

	ff.view('index', function(template){
		$('#mustache-target').html(template);
	}, {
		name: 'fast-framework',
		layout: 'main'
	});
});