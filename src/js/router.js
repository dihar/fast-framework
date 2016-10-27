


(function(){

	var getCont = ff.controller.get;
	//here add routes (name, controller, {title, param, hashParams});
	
	ff.router.add('/', getCont('index'));
	// ff.router.add('/request-form/:lot_id', getCont('request-form'), {
	// 		param: 'lot_id',
	// 		title: 'Форма заявки'
	// });

})();

