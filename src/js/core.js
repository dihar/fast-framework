
/*
	CONTROLLER.js
	
	namespace: window.ff.controller
	
	Methods:

	get

	@params: name – name of controller
	@return: Object {value, clearFunction}; 
		value – function, which called when controller activated, 
		clearFunction – when controller deactivated

	set

	@params: name – name of controller,
		value – function, which called when controller activated,
		clearFunction – function, which called when controller deactivated

	@return: undefined
*/
;(function ($){
	var controllers = {};
	if(window.ff === undefined){
		window.ff = {};
	}
	if(window.ff.controller === undefined){
		window.ff.controller = (function initController(){
			var get = function(name){
				if(controllers[name]){
					return { 
						value: controllers[name].value, 
						clearFunction: controllers[name].clearFunction || function(){}
					};
				}
				console.error('Undefined controller ' + name);
			};
			var set = function(name, value, clearFunction){
				if( typeof name !== 'string' ){
					throw new Error('Key of controller must be String!');
				}
				controllers[name] = { value: value, clearFunction: clearFunction };
			};
			return {
				get: get,
				set: set
			};
		})();
	}
})(jQuery);


/*
	Router.js
 */

;(function($){
	var activeRoute;
	if(!ff.router){

		ff.router = (function(){
			var routes = [];
			function findRoute(name){
				var paramRoute = $.router.getParameters(name || '');
				return routes.filter(function(el){
					var isParamRoute = paramRoute.length > 0 && paramRoute[0].route.route === el.name; 
					return el.name === name || isParamRoute;
				})[0];
			}
			return {
				add: function(name, controller, title, id){
					var route = findRoute(name);
					if(!route){
						routes.push({
							name: name,
							controller: controller,
							title: title
						});
					} else {
						route.name = name;
						route.controller = controller;
						route.title = title;
					}
					
					$.router.add(name, controller.value, id);
				},
				
				go: function(name, title, isPushState){
					var routeParameters = $.router.getParameters(name);

					if(findRoute(name)){
						if(!title){
							title = findRoute(name).title;
						}
						if(!!activeRoute){
							activeRoute.controller.clearFunction(name);
						}
						activeRoute = findRoute(name);

						$.router.go(name, title, !isPushState);
					} else {
						console.error('Undefined route ' + name);
					}
					
				},
				
				updateLinks: function(container){
					
					var go = this.go;
					var $cont = $(container);
					$cont.find('a').filter(function(i, el){
						return !!findRoute($(el).attr('href')) && $(el).attr('target') !== '_blank';
					}).click(function(e){
						e.preventDefault();
						go($(this).attr('href'), findRoute($(this).attr('href')).title, true);
					});
					
					return $cont;
					
			}
				
			}
		})();
	}

	window.addEventListener('popstate', function(){
		if(!!activeRoute){
			activeRoute.controller.clearFunction(window.location.pathname);
		}
		ff.router.go(window.location.pathname);
	});

})(jQuery);

$(function(){

	var path = window.location.pathname;
	if(path.length > 1 && /(.+)\/$/.test(path)){
		path = path.slice(0, path.length - 1);
	}
	ff.router.go(path);

	ff.router.updateLinks($('body'));

});


/** view.js expand ff namespace, simple get views with Mustache
	* @function ff.view(name, callback, data)
	* @param name
		name of view (must equal file name in views folder withot extention)
	* @param callback
		callback succsess function with one parameter: template (template or mustache rendering)
	* @param data
		if you want mustache rendered template, set obj, without it, result will be template as it is on server;
		specific options: layout – layout name (from view/layouts), dataLayout: data for layout
	* @return jQuery Deferrer
*/
;(function ($){
	var views = {};
	if(window.ff === undefined){
		window.ff = {};
	}
	if(window.ff.view === undefined){
		window.ff.view = (function initView(){

			function resolveDfd(dfd, cb, result){
				if(typeof cb === 'function'){
					cb(result);
				}
				dfd.resolve(result);
			}

			return function renderView(name, cb, data){
				var config = window.ff.view.config;
				var dfd = $.Deferred();
				var result;
				if(!views[name]){
					$.get(config.root + name + config.ext)
						.done(function(template){
							views[name] = template;
							if(data && typeof data === 'object'){
								result = Mustache.render(template, data);

								if(typeof data.layout === 'string'){
									renderView('layouts/' + data.layout, null)
										.then(function(layout){
											result = Mustache.render(layout, data.dataLayout, {partialView: result});
											resolveDfd(dfd, cb, result);
										}, function(err){
											dfd.reject('Can not get layout ' + data.layout);
										});
								} else {
									resolveDfd(dfd, cb, result);
								}

							} else {
								result = template;
								resolveDfd(dfd, cb, result);
							}
						})
						.fail(function(){
							dfd.reject('Can not get view ' + name);
						});
				} else {
					if(data){
						result = Mustache.render(views[name], data);

						if(typeof data.layout === 'string'){
							renderView('layouts/' + data.layout, null)
								.then(function(layout){
									result = Mustache.render(layout, data.dataLayout, {partialView: result});
									resolveDfd(dfd, cb, result);
								});
						} else {
							resolveDfd(dfd, cb, result);
						}

					} else {
						result = views[name];
						resolveDfd(dfd, cb, result);
					}
				}

				return dfd.promise();
			};

		})();
		window.ff.view.config = {
			root: '/views/',
			ext: '.mst'
		}
	}
})(jQuery);
