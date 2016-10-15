


(function(){

	var getCont = ff.controller.get;
	//here add routes (name, controller, title);
	
	ff.router.add('/', getCont('index'));
	// ff.router.add('/request-form/:lot_id', getCont('request-form'), 'Форма заявки', 'lot_id');

})();

