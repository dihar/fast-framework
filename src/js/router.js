


(function(){

	var getCont = ff.controller.get;
	//here add routes (name, controller, {title, param, hashParams});
	
	ff.router.add('/', getCont('index'));
	ff.router.add('/post/:post_id', getCont('post'), {
			param: 'post_id',
		});
	ff.router.add('/post/:post_id', getCont('post'), {
			param: 'post_id',
			hashParams: ['activing', 'favorite', 'subParameter']
	});

})();

//http://localhost:3000/post/33/#activing=true&favorite=false&subParameter=yes