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
			loaderIsActive: 'true',
			loaderInError: 'false'
		};
		let state = window.ff.state;
		state.showLoader = function(){
			state.loaderIsActive = true;
			$('.ff-loader').addClass('ff-loader_show');
		};
		state.hideLoader = function(){
			state.loaderIsActive = false;
			$('.ff-loader').removeClass('ff-loader_show');
		};
		state.errorLoader = function(err){
			state.loaderIsActive = true;
			state.loaderInError = false;
			$('.ff-loader').addClass('ff-loader_show')
				.addClass('ff-loader_error')
				.attr('data-error', err);
			setTimeout(()=>{
				state.hideLoader();
				state.loaderInError = false;
				$('.ff-loader').removeClass('ff-loader_error').attr('data-error', '');
			}, 10000)
		}
	}

})();