

(function ($){

/* 城市选择 */ 
$('.city-location').hover(
	function (){
		$(this).addClass('hover');
	},
	function (){
		$(this).removeClass('hover');
	}

);
/* 分类 */
$('.menu-nav-container>li').hover(
	function (){
		$(this).addClass('current');
	},
	function (){
		$(this).removeClass('current');
	}

);

/* 焦点�? */
var bxSlider=$('.focus-con').bxSlider({
        auto: true,
        autoHover: true,
        prevText:'',
        nextText:'',
        speed:1000
});
$('.focus-box').mouseout(function (){
	bxSlider.startAuto();
});

var aFocus={};
/* 热门区域焦点�? */
$('.hotregion-focus-con').each(function (index){
	var oName='focus'+index;
	aFocus[oName]=$(this).bxSlider({
        auto: true,
        autoHover: true,
        prevText:'',
        nextText:'',
        speed:1000
	});
	$(this).mouseout(function (){
		aFocus[oName].startAuto();
	});
});


/* 数码选择 */
$('.computer-right').each(function (){
	var tab=$(this).find('.waretype-tab>li');
	var con=$(this).find('.waretype-con>li');
	tab.mouseover(function(){
		$(this).addClass('cur').siblings().removeClass('cur');
		var oIndex=$(this).index();
		con.eq(oIndex).addClass('cur').siblings().removeClass('cur');
		$.each(aFocus,function (item){
			aFocus[item].reloadSlider();
		})
	});
});



})(window.$ || window.jQuery);




