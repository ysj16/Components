/*@params  selector:选择器，
		   options配置参数，包括事件：onStop*/
var Lottery = function(selector,options){
	var _default = {
		width:4,//宽度
		height:4,//高度
		initSpeed:300,//初始速度，以seTimeout的时间为单位，因此值越小，速度越快
		aSpeed:20,//加速度
		maxSpeed:80,//最大速度
		initIndex:0,//初始位置
		minStep:36//最小的转动步数
	}
	var _options = this.options = $.extend({},_default,options);
	this.counts = _options.width*2 + _options.height*2 - 4;
	this.$ele = $(selector);
	this.init();
}
Lottery.prototype.init = function(){
	if(this.$ele.find(".lot-item .shadow").length==0)
		this.$ele.find(".lot-item").append("<i class='shadow'></i>");
	this.$ele.addClass("init");
}
Lottery.prototype.start = function(){
	var _$items = this.$ele.find(".lot-item"),
		steps = 0,
		slowSteps = 0,
	 	_options = this.options,
		index = _options.initIndex,
		speed = _options.initSpeed,
		that = this,
	 	map = this.map = this.getMap(),
	 	aSpeed = _options.aSpeed,
	 	nASpeed = -_options.aSpeed;
	this.$ele.removeClass("init");
	_$items.eq(index).addClass("cur");//设置初始选中位置
	_scroll.call(this);
	function _scroll(){
		index++;
		if(index>11){
			index = 0;
		}
		setTimeout(function(){
			_$items.removeClass("cur");
			_$items.eq(map[index]).addClass("cur");
			steps++;
			if(that.awardNo&&steps>=_options.minStep){
				slowSteps++;
				aSpeed = nASpeed;
			}
			if(steps>=_options.minStep&&slowSteps>=12&&that.awardNo==index){
				that.onStop();
				return;
			}
			else
				_scroll.call(that);
		},speed)
		speed = speed-aSpeed;
		if(speed<_options.maxSpeed)
			speed = _options.maxSpeed;
		else if(speed>_options.initSpeed){
			speed = _options.initSpeed;
		}
	}
}
Lottery.prototype.stop = function(index){//停止转动
	this.awardNo = index;
	return this.$ele.find(".lot-item").eq(this.map[index]);
}
Lottery.prototype.onStop = function(){//停止触发的事件
	this.options.onStop&&this.options.onStop.call(this);
}
Lottery.prototype.getMap = function(){//获取格子下标对应的map
	var map = {},_options = this.options;
	for(var i=0;i < this.options.width;i++){
		map[i] = i;
	}
	for(var i = _options.height + _options.width -2,j = this.counts-1;i <= _options.width*2+_options.height-3;i++,j--){
		map[i] = j;
	}
	for(var i = _options.width,j = _options.width+1;i < _options.width + _options.height - 2;i++){
		map[i] = j;
		j+=2;
	}
	for(var i = this.counts-1,j=_options.width;i>=this.counts-_options.height+2;i--){
		map[i] = j;
		j+=2;
	}
	return map;
}