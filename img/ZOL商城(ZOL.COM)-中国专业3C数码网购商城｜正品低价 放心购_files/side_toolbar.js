$(function(){

	// ��¼
	var useid = document.cookie.match(/zol_userid=([^;$]+)/);
	if(useid && useid[1])
	window.useid = useid[1]; 

	/*function toolbarLogin(y,h){
		y = y - 68.5 + h/2 - $(window).scrollTop();
		$toast_login.show().animate({left:-352,top:y},200);	
	};*/

	// ��¼��֤
	function validateSignin(y,h){
		if(!useid){
			ZsLogin.openLoginBox();
			return false;
		}else{
			return true;	
		}	
	};

	var $operation_region 			= $('#operation_region'),				// ������
		$show_region 				= $('#show_region'),					// չʾ��
		$toast_login				= $('#toast_login'), 					// ��¼��
		$hoverTips 					= $('#hover_tips'),						// hover��
		$plugins 					= $('.zc-toolbar-plugins'),
		$cartTotal 					= $('#cart-total'),
		ajaxBaseUrl 				= $('#side-toolbar-wrapper').data('url');

	// �رյ���
	$toast_login.on('click','.close',function(){
		$toast_login.hide();	
	});

	// ��/�رշ���
	$show_region.on('click','.zc-share-ico',function(){
		onToggleClass($(this));
	});

	// ��/�رն�ά��
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

	// ʵ����һ�������
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

	// �ر��Ҳ����ݲ�
	$('.zc-toolbar-plugin-close').on('click',function(){
		sideToolbar.close();	
	});

	// ��껬����� 
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
		��껬������
		Ϊ��ǰԪ��������һ��ʱ���
		���뻬���ٶȹ��죬��ִֻ�����һ��
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

	// ɾ���㼣����մ��޸�
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
					defaultAjaxErrorCallback('\u5220\u9664\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5\uff01'); // ɾ��ʧ�ܣ������ԣ�
				}
			},
			error:function(){
				defaultAjaxErrorCallback('\u5220\u9664\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5\uff01'); // ɾ��ʧ�ܣ������ԣ�
			}
		});	
	};

	// ɾ���㼣�ɹ�
	deleteTimeLine.success = function($item){
		//sideToolbar.removeStorage('BrowseHistroy'); 	// ��ձ��ػ�����㼣����
		sideToolbar.change('BrowseHistroy'); 			// ������Ϣ�б�*/
		$browseHistroy.perfectScrollbar('update');      // ���¹�����
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

	// Ĭ��ajaxʧ�ܵĻص�
	function defaultAjaxErrorCallback(s){
		alert(s); 
		return;
	};

	$plugins.on('click','.zc-delete',deleteTimeLine);
	$plugins.on('click','.zc-remove-btn',function(){
		deleteTimeLine.call($(this),'all');	
	});

	// �ӹ��ﳵ��ɾ����Ʒ
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
					defaultAjaxErrorCallback('\u5220\u9664\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5\uff01') // ɾ��ʧ�ܣ������ԣ�
				}
			},
			error:function(){
				defaultAjaxErrorCallback('\u5220\u9664\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5\uff01') // ɾ��ʧ�ܣ������ԣ�
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
		$wrap.parents('.zc-scroll-bd').perfectScrollbar('update'); // ���¹�����

		/*
			*** ������ѡ�������ܼ�
			*** �����ɾ����ƷΪ�ѹ�ѡ��Ʒ�������ܼ��н������
		*/
		if(checked){
			checkedTotal -= 1;
			var $form = $wrap.find('form'),
				price = +$form.data('totalprice') -$checkbox.data('price');
			updateSelectedTotal(checkedTotal,price,$form);
		};

		/*
			*** �����ύ��ť״̬
			*** ����ύ��ťΪ����״̬��ѡ����Ϊ0������ť�ر�
		*/
		if(total > 0){
			var $submit = $wrap.find('input[type="submit"]');
			var status = $submit[0].disabled;
			if(!status && checkedTotal === 0){
				chanegSubmitStatus($submit,0);	
			}	
		};
		/*
			*** ���µ���ѡ��״̬
			*** �����ǰ��������δ��ѡ����Ŀ��ɾ����ʣ��ȫ��Ϊѡ����Ŀʱ����ǰ���̽���ѡ��
			*** 
		*/
		if(checkedTotal > 0 && checkedTotal === total && $shopCheckbox[0])
		$shopCheckbox[0].checked = true;

		total === 0 ? $wrap.remove() : $item.remove();
		//sideToolbar.removeStorage('ShopCart'); 	// ��ձ��ػ���Ĺ��ﳵ����
		
		cartTotal -= 1;
		$cartTotal.html(cartTotal);	
		if(cartTotal === 0)
		$cartTotal.hide();
	};

	// ������Ʒ���������ν����ύ
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


	// ���ť
	function chanegSubmitStatus($submit,checked){
		if(!$submit) return;
		var submit = $submit[0];
		submit.disabled = checked ? false : true;
		var fn = checked ? 'removeClass' : 'addClass';
		$submit[fn]('zc-no-settlement');
	};

	// ������ѡ�������ܼ�
	function updateSelectedTotal(total,price,$form){
		if(!$form) return;
		var $number = $form.find('.zc-selected-number > span'),
			$price = $form.find('.zc-total-price > span');
	 	$number.html(total);
	 	$price.html(price);
	 	$form.data('totalprice',price);
	};

	// �ӹ��ﳵ��ѡ����Ʒ
	function checkedProducts(s){
		var $checkbox = $(this),checkbox = $checkbox[0];
		var $form = $checkbox.parents('form');
		var $submit = $form.find('input[type="submit"]');
		var price = +$form.data('totalprice');
		if(typeof s === 'string' && s === 'shop'){ // ѡ�����
			var merid = checkbox.value;	
			var $all = $form.find('input[data-shopid="'+ merid +'"]');
			price = 0;
			$all.each(function(index,item){ // �ı�ȫ��ѡ��״̬
				item.checked = checkbox.checked ? true : false;
				item.setAttribute('data-checked', checkbox.checked ? 'checked' : '');
				price += (+$(item).data('price'));
			});
			price = checkbox.checked ? price : 0;
			chanegSubmitStatus($submit,checkbox.checked); // �ı䰴ť״̬
			updateSelectedTotal(checkbox.checked ? $all.length : 0,price,$form);
		}else{
			var total = $form.find('.zc-order-detail').length; // ��ǰ����������Ʒ����
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
	$plugins.on('click','.zc-shop-name > input[type="checkbox"]',function(){	 // ѡ��ǰ�����е�������Ʒ
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
