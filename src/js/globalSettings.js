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

	ff.fastResolve = function(data){
		return $.Deferred().resolve(data).promise();
	}
	ff.fastReject = function(err){
		return $.Deferred().reject(err).promise();
	}
	ff.async = function(time, resolveFunction, data){
		var deff = $.Deferred();
		setTimeout(function(){
			!!resolveFunction && resolveFunction(data);
			deff.resolve(data);
		}, time);
		return deff.promise();
	}

	ff.HashOfTree = class HashOfTree{
		constructor(name) {
			this.name = name;
			this.length = 0;
			this.hash = {
				[this.name + '_-1']: {
					meta: this.name + '_-1',
					childrenArr: [],
					level: 0
				}
			};
		}
		push(item, parentMeta = null){
			var meta = this.name + '_' + this.length++;
			this.hash[meta] = Object.assign(item, {
				parentMeta,
				meta, 
				childrenArr: item.el.has_child ? [] : null,
				level: parentMeta ? this.hash[parentMeta].level + 1 : 1
			});
			if(!!parentMeta){
				this.hash[parentMeta].childrenArr.push(meta);
			} else{
				this.hash[this.name + '_-1'].childrenArr.push(meta);
			}
			return meta;
		}
		getRegistry(meta){
			return this.hash[meta];
		}
		getParentRegistry(meta, levelUp = 1){
			var registry = this.getRegistry(meta);
			if(levelUp < 0){
				levelUp = registry.level + levelUp;
			}
			for(var i = 1; i <= levelUp; i++){
				if(registry.level > 1){
					registry = this.getRegistry(registry.parentMeta);
				} else {
					break;
				}
			}
			return registry;
		}
		showRegistries(){
			console.log(this.hash)
		}
		getNodeByMeta(meta){
			var registry = this.getRegistry(meta);
			if(!registry._node){
				let node = $('#mustache-target').find(`[data-ff="${meta}"]`);
				registry._node = node;
			}
			return registry._node;
		}
		setNodeByMeta(meta, node){
			var registry = this.getRegistry(meta);
			registry._node = node;
		}
		getFirstLevelMeta(){
			return this.hash[this.name + '_-1'].childrenArr;
		}
	};
})();