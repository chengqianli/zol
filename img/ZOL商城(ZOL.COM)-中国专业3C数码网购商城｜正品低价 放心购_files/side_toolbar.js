$(function(){

	// 登录
	var useid = document.cookie.match(/zol_userid=([^;$]+)/);
	if(useid && useid[1])
	window.useid = useid[1]; 

	/*function toolbarLogin(y,h){
		y = y - 68.5 + h/2 - $(window).scrollTop();
		$toast_login.show().animate({left:-352,top:y},200);	
	};*/

	// 登录验证
	function validateSignin(y,h){
		if(!useid){
			ZsLogin.openLoginBox();
			return false;
		}else{
			return true;	
		}	
	};

	var $operation_region 			= $('#operation_region'),				// 功能区
		$show_region 				= $('#show_region'),					// 展示区
		$toast_login				= $('#toast_login'), 					// 登录层
		$hoverTips 					= $('#hover_tips'),						// hover层
		$plugins 					= $('.zc-toolbar-plugins'),
		$cartTotal 					= $('#cart-total'),
		ajaxBaseUrl 				= $('#side-toolbar-wrapper').data('url');

	// 关闭弹层
	$toast_login.on('click','.close',function(){
		$toast_login.hide();	
	});

	// 打开/关闭分享
	$show_region.on('click','.zc-share-ico',function(){
		onToggleClass($(this));
	});

	// 打开/关闭二维码
	$show_region.on('click','.zc-ico',function(){
		onToggleClass($(this));
	});

	function onToggleClass($icon){
		var $wrap = $icon.parent();
		var c = $wrap[0].className.match(/[^\s$]+/);
		if(c && c[0])
		c = $.trim(c[0]) + '-hover';
		$wrap.toggleClass(c);	
	};

	// 实例化一个抽屉层
	var sideToolbar = new $.drawer('#side-toolbar-wrapper');

	if($operation_region){
		$operation_region.children().not('.activity-entrance').on({
			mouseenter:operationOnMousEenter,
			mouseleave:operationOnMouseLeave,
			click:function(){
				var $this = $(this);
				if(validateSignin($this.offset().top,$this.height())){
					sideToolbar.open($this.data('role'));			
				}
			}	
		});
	};

	// 关闭右侧内容层
	$('.zc-toolbar-plugin-close').on('click',function(){
		sideToolbar.close();	
	});

	// 鼠标滑入操作 
	function operationOnMousEenter(){
		var $this = $(this),$tips = $this.data('tips');
		$this[0].inTimeStamp = +new Date();
		if(this.className.indexOf('zc-tab') >= 0 && !$this.hasClass('zc-tab-hover')){
			$this[0].timer = setTimeout(function(){
				$this.addClass('zc-tab-hover');
				if($tips){
					$hoverTips.html($tips).css({top:$this.offset().top - $(window).scrollTop()}).animate({right:277},200)
				}
			},100);	
		}
	};

	/*
		鼠标滑出操作
		为当前元素下增加一个时间差
		滑入滑出速度过快，将只执行最后一个
	*/
	if($hoverTips)
	var hideWidth = -$hoverTips.width();	

	function operationOnMouseLeave(){
		var $this = $(this)[0];
		$this.diffTimeStamp = +new Date() - $this.inTimeStamp; 
		if($this.diffTimeStamp < 100 && $this.timer)
		clearTimeout($this.timer);	
		$('.zc-tab-hover').removeClass('zc-tab-hover');
		$hoverTips.stop().css({right:hideWidth});	
	};


	var $cover_screen = $('#cover_screen'),
		$clear_confirm = $('#clear_confirm'),
		$browseHistroy = $('div[data-contains="BrowseHistroy"]').parent();

	// 删除足迹，清空待修复
	function deleteTimeLine(total){
		var $this = $(this),$elements;
		if(typeof total !== 'string' && total !== 'all'){
			$elements = $this.parents('li');
			total = $elements.data('id');
			deleteTimeLine.go(total,$elements);
		}else{
			$elements = $this.parents('.zc-scroll-bd');
			comfirm();
			return;
		};
						
	};
	deleteTimeLine.go = function(total,$item){
		$.ajax({
			url:ajaxBaseUrl, //ajaxBaseUrl
			data:{'a':'DelHistory','goodsId':total},
			dataType:'json',
			success:function(res){
				if(res && res.flag){
					deleteTimeLine.success($item);
				}else{
					defaultAjaxErrorCallback('\u5220\u9664\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5\uff01'); // 删除失败，请重试！
				}
			},
			error:function(){
				defaultAjaxErrorCallback('\u5220\u9664\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5\uff01'); // 删除失败，请重试！
			}
		});	
	};

	// 删除足迹成功
	deleteTimeLine.success = function($item){
		//sideToolbar.removeStorage('BrowseHistroy'); 	// 清空本地缓存的足迹数据
		sideToolbar.change('BrowseHistroy'); 			// 更新信息列表*/
		$browseHistroy.perfectScrollbar('update');      // 更新滚动条
	};

	function comfirm(total){
		$cover_screen.fadeIn(300);
		$clear_confirm.fadeIn(300);
		$clear_confirm.on('click',comfirm.onClickHandle);
	};
	comfirm.onClickHandle = function(e){
		var target = e.target;
		$cover_screen.fadeOut(300);
		$clear_confirm.fadeOut(300);
		$clear_confirm.off('click',comfirm.onClickHandle);
		if(target.className === 'ok')
		deleteTimeLine.go('all');
		else if(target.className === 'cancel')
		return;
	};

	// 默认ajax失败的回调
	function defaultAjaxErrorCallback(s){
		alert(s); 
		return;
	};

	$plugins.on('click','.zc-delete',deleteTimeLine);
	$plugins.on('click','.zc-remove-btn',function(){
		deleteTimeLine.call($(this),'all');	
	});

	// 从购物车中删除商品
	function removeProductsItem(){
		var $this = $(this),
			$item = $this.parent(),
			$wrap = $this.parents('li'),
			value,
			total;
		value = $item.find('input[name="goodsId"]')[0].value;
		total = $wrap.find('.zc-order-detail').length;
		$.ajax({
			url:ajaxBaseUrl, //ajaxBaseUrl
			data:{'a':'DelCartGoods','goodsId':value},
			dataType:'json',
			success:function(res){
				if(res && res.flag){
					removeProductsItem.success($item,total,$wrap);	
				}else{
					defaultAjaxErrorCallback('\u5220\u9664\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5\uff01') // 删除失败，请重试！
				}
			},
			error:function(){
				defaultAjaxErrorCallback('\u5220\u9664\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5\uff01') // 删除失败，请重试！
			}
		});
	};
	removeProductsItem.success = function($item,total,$wrap){
		var $checkbox 	= $item.find('input[name="goodsId"]'),
			checkbox 	= $checkbox[0];
		var checked = checkbox.checked;
		var checkedTotal = $wrap.find('input[data-checked="checked"]').length;
		var $shopCheckbox = $wrap.find('.zc-shop-name > input[type="checkbox"]');
		var cartTotal = +$cartTotal.html();
		total -= 1;
		$wrap.parents('.zc-scroll-bd').perfectScrollbar('update'); // 更新滚动条

		/*
			*** 更新已选数量与总价
			*** 如果是删除商品为已勾选商品，将从总价中将其减掉
		*/
		if(checked){
			checkedTotal -= 1;
			var $form = $wrap.find('form'),
				price = +$form.data('totalprice') -$checkbox.data('price');
			updateSelectedTotal(checkedTotal,price,$form);
		};

		/*
			*** 更新提交按钮状态
			*** 如果提交按钮为激活状态，选中项为0，将按钮关闭
		*/
		if(total > 0){
			var $submit = $wrap.find('input[type="submit"]');
			var status = $submit[0].disabled;
			if(!status && checkedTotal === 0){
				chanegSubmitStatus($submit,0);	
			}	
		};
		/*
			*** 更新店铺选择状态
			*** 如果当前店铺所有未被选中项目被删除，剩下全部为选中项目时，当前店铺将被选中
			*** 
		*/
		if(checkedTotal > 0 && checkedTotal === total && $shopCheckbox[0])
		$shopCheckbox[0].checked = true;

		total === 0 ? $wrap.remove() : $item.remove();
		//sideToolbar.removeStorage('ShopCart'); 	// 清空本地缓存的购物车数据
		
		cartTotal -= 1;
		$cartTotal.html(cartTotal);	
		if(cartTotal === 0)
		$cartTotal.hide();
	};

	// 增减产品数量，本次将不提交
	function changeAmount($count,i){
		var $wrap 		= $count.parent(),
			$amount 	= $wrap.find('span'),
			$subtract 	= $wrap.find('.zc-minus'),
			$add  		= $wrap.find('.zc-plus'),
			amount 		= $amount[0];
			total 		= 0,
			num 		= +$amount.html(),
			max 		= +$amount.data('max'),
			formTotal  	= $wrap.parent().find('input[name="buyNumber"]')[0];
		if(amount.disabled)	return;	
		total = num+i;
		switch(!0){
			case total === max:
				changeAmount.disabled($add);
				changeAmount.enabled($subtract);
				break;
			case total === 1:
			case total === 0:
				total = 1;
				changeAmount.disabled($subtract);
				changeAmount.enabled($add);
				break;
			default:
				changeAmount.enabled($add);
				changeAmount.enabled($subtract);
				break;
		};
		$amount.html(total);
		formTotal.value = total;
	};
	changeAmount.enabled = function($b){
		var b = $b[0];
		b.disabled = false;
		var c = b.className.match(/[^\s$]+/);
		if(c && c[0])
			c = $.trim(c[0]) + '-noclick';
		$b.removeClass(c);
	};
	changeAmount.disabled = function($b){
		var b = $b[0];
		b.disabled = true;
		var c = $.trim(b.className) + '-noclick';
		$b.addClass(c);
	};


	// 激活按钮
	function chanegSubmitStatus($submit,checked){
		if(!$submit) return;
		var submit = $submit[0];
		submit.disabled = checked ? false : true;
		var fn = checked ? 'removeClass' : 'addClass';
		$submit[fn]('zc-no-settlement');
	};

	// 更新已选数量与总价
	function updateSelectedTotal(total,price,$form){
		if(!$form) return;
		var $number = $form.find('.zc-selected-number > span'),
			$price = $form.find('.zc-total-price > span');
	 	$number.html(total);
	 	$price.html(price);
	 	$form.data('totalprice',price);
	};

	// 从购物车中选择商品
	function checkedProducts(s){
		var $checkbox = $(this),checkbox = $checkbox[0];
		var $form = $checkbox.parents('form');
		var $submit = $form.find('input[type="submit"]');
		var price = +$form.data('totalprice');
		if(typeof s === 'string' && s === 'shop'){ // 选择店铺
			var merid = checkbox.value;	
			var $all = $form.find('input[data-shopid="'+ merid +'"]');
			price = 0;
			$all.each(function(index,item){ // 改变全部选中状态
				item.checked = checkbox.checked ? true : false;
				item.setAttribute('data-checked', checkbox.checked ? 'checked' : '');
				price += (+$(item).data('price'));
			});
			price = checkbox.checked ? price : 0;
			chanegSubmitStatus($submit,checkbox.checked); // 改变按钮状态
			updateSelectedTotal(checkbox.checked ? $all.length : 0,price,$form);
		}else{
			var total = $form.find('.zc-order-detail').length; // 当前店铺所有商品总数
			checkbox.price = +$checkbox.data('price');
			$checkbox.attr('data-checked',checkbox.checked ? 'checked' : '');
			price = checkbox.checked ? (price + checkbox.price) : (price - checkbox.price);
			var checkedTotal = $form.find('input[data-checked="checked"]').length;
			var $shopCheckbox = $form.find('.zc-shop-name > input[type="checkbox"]');	
			if($shopCheckbox){
				var shopCheckbox = $shopCheckbox[0];
				if(total === checkedTotal){
					shopCheckbox.checked = true;
				}else{
					if(shopCheckbox.checked)
					shopCheckbox.checked = false;
				}
			};
			chanegSubmitStatus($submit,checkedTotal);
			updateSelectedTotal(checkedTotal,price,$form);
		};
	};

	$plugins.on('click','.zc-checkbox > input[type="checkbox"]',checkedProducts);
	$plugins.on('click','.zc-shop-name > input[type="checkbox"]',function(){	 // 选择当前店铺中的所有商品
		checkedProducts.call($(this),'shop');
	});
	$plugins.on('click','.zc-delete-btn',removeProductsItem);
	$plugins.on('click','.zc-minus',function(){
		changeAmount($(this),-1)	
	});
	$plugins.on('click','.zc-plus',function(){
		changeAmount($(this),1);
	});
});
