///here settings for state and config

;(function(){

	if(window.ff === undefined){
		window.ff = {};
	}
	if(!window.ff.config){
		window.ff.config = {
			someSetting: 'some value'
		}
	}
	if(!window.ff.state){
		window.ff.state = {
			someState: 'some value'
		};
	}

})();