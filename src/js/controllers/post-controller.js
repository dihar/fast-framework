
ff.controller.set('post', function(param){

	ff.view('post',{
		postId: param.post_id,
		hashActiving: param.hash.activing,
		hashFavorite: param.hash.favorite,
		hashSubParameter: param.hash.subParameter,
		layout: 'main'
	}, function(template){
		$('#mustache-target').html(template);
		ff.state.hideLoader();
	});

});