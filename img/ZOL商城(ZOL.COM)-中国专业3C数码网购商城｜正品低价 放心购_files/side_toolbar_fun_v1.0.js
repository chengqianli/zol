(function (W,jQuery){
	jQuery = jQuery || window.jQuery;
	if (!jQuery)
		return;
	if (!W) W = window;


	// #region utility & prototype
	function drawer(id){
		this.wrapper = jQuery(id);
		this.status = !1;
		this.model = null;
		this.ajaxURL = this.wrapper.data('url');
		this.loading = '<div class="loading"></div>';
	};
	drawer.prototype = {
		open:function(m){	
			var me = this;
			if(this.model === m){
				this.close();
				return;	
			};
			this.model = m;
			if(me.status) return;
			me.status = !0;
			this.change(m);
			this.wrapper.animate({right:0},300,function(){
				me.status = !1;
			});
		},
		close:function(){
			this.model = null;
			this.wrapper.animate({right:-237},300);
		},
		addStorage:function(key,value){ 	// 添加/更新缓存数据
			try{
				sessionStorage.setItem(key,value);
			}catch(error){}
		},
		removeStorage:function(key){		// 删除缓存数据
			try{
				var storage = sessionStorage.getItem(key);
				if(storage)
				sessionStorage.removeItem(key);
			}catch(error){}
		},
		change:function(m){ // 切换，本页面数据被请求过后将全部缓存在本地sessionStorage
			var that = this;
/*			try{
				var storageData = sessionStorage.getItem(m);
				if(storageData && JSON && JSON.parse){
					storageData = JSON.parse(storageData);
					this.render(m,storageData);
					return;	
				}
			}catch(error){};*/
			jQuery.ajax({
				url:that.ajaxURL,
				data:{a:m},
				dataType:'jsonp',
				success:function(response){
					if(response)
					that.render(m,response);
/*					try{
						if(JSON && JSON.stringify){ // 将数据缓存在本地存储中，IE8以下浏览器不进行缓存
							var data = JSON.stringify(response);
							that.addStorage(m,data);	
						}
					}catch(error){}*/
				},
				error:function(){that.render(m,null);}
			});	
		},
		template:{	// 模板对应的是接口返回的字段名
			ShopCart : function(data){  
				if(data && jQuery.isArray(data)){
					var complete = '';
					function goodsList(goods,merId){
						if(!jQuery.isArray(goods)) 
						return '';
						var goodsListString = '';
						jQuery.each(goods,function(i,goods){
				    		goodsListString += '<div class="zc-order-detail clearfix">\
								<div class="zc-checkbox"><input name="goodsId" type="checkbox" value="'+ goods.cartId +'" data-shopId="'+ merId +'" data-price="'+ goods.price + '"></div>\
								<div class="zp-pic"><a href="'+goods.goodsUrl+'" title="'+ goods.goodsName +'"><img width="40" height="40" src="'+goods.goodsPicUrl+'" alt="'+ goods.goodsName +'"></a></div>\
								<div class="zp-number"><em class="zc-minus">-</em><span data-max="'+ goods.canBuyMaxNum +'">'+ goods.buyNumber +'</span><em class="zc-plus">+</em></div>\
								<div class="zp-price">&yen;'+goods.price+'</div>\
								<span class="zc-delete-btn"></span>\
								<input type="hidden" name="buyNumber" value="'+ goods.buyNumber +'" />\
								<input type="hidden" name="promoId" value="'+ goods.promoId +'" />\
								<input type="hidden" name="zp-choose-suit-id" value="'+ goods.suidId +'" />\
								<input type="hidden" name="isContract" value="'+ goods.isContract +'" />\
							</div>'	
				    	});
				    	return goodsListString;	
					};
					jQuery.each(data,function(index,item){
						complete += '<li><form action="http://order.zol.com/index.php?c=ConfirmOrder" method="POST" data-totalPrice="0" target="_blank">\
							<div class="zc-shop-name"><input name="merchantId" type="checkbox" value="' + item.merId + '"><a href="http://www.zol.com/shop_'+ item.merId + '/">' + item.merName + '</a></div>'+ goodsList(item.goodsInfo,item.merId) +'\
							<div class="zc-order-related clearfix">\
								<div class="zc-selected-number">\u5df2\u9009<span>0</span>\u4ef6</div>\
								<div class="zc-total-price">&yen; <span>0</span></div>\
							</div>\
							<input type="hidden" name="fromMerchantId" value="'+ item.merId +'" />\
							<input type="submit" value="\u7ed3\u7b97" class="zc-settlement-btn zc-no-settlement" disabled="" />\
							</form></li>';	
					});
					return complete;
				}	
			},
			OrderInfo : function(data){
				if(data && jQuery.isArray(data)){
					var complete = '';
					jQuery.each(data,function(index,item){
						complete += '<li data-index="'+ index +'">\
							<div class="zc-shop-name"><a href="'+ item.merUrl +'" title="'+ item.merName +'" target="_blank">' + item.merName + '</a></div>\
							<div class="zc-order-detail clearfix">\
								<div class="zp-pic"><a href="'+ item.goodsDetailUrl +'" title="'+ item.goodsName +'" target="_blank"><img width="40" height="40" src="'+ item.picUrl +'" alt="'+ item.goodsName +'"></a></div>\
								<div class="zp-number">'+ item.goodsNum +'</div>\
								<div class="zp-price">&yen;'+ item.orderPrice +'</div>\
							</div>\
							<div class="zc-order-related clearfix">\
								<div class="zp-time">' + item.addTime + '</div>\
								<div class="zp-state zp-state-'+ (item.orderStatus === '\u5df2\u5173\u95ed' ? 'over' : (item.orderStatus === '\u5df2\u5b8c\u6210' ? 'finish' : 'ing')) +'">'+ item.orderStatus +'</div>\
								<div class="zc-links"><a href="' + item.orderDetailUrl + '" target="_blank">\u67e5\u770b</a></div>\
							</div>\
						</li>';	
					});
					return complete;
				}
			},
			BrowseHistroy : function(data){
				if(data && jQuery.isArray(data)){
					var todayList = '',lastWeekList = '',weekAgoList = '';
					var complete = '<div class="zc-number">\
							\u5171<em id="history-total">'+ data.length +'</em>\u4ef6\u5546\u54c1<span class="zc-remove-btn">\u6e05\u7a7a</span>\
						</div>';
					function same(item){
						return '<li data-id="'+ item.goodsId +'">\
							<a href="'+ item.goodsUrl +'" class="zc-pic" title="'+ item.goodsName +'" target="_blank">\
								<img width="100" height="100" src="'+ item.indexPicUrl +'" alt="' + item.goodsName + '">\
								<span class="zc-price">&yen;'+ item.goodsPrice +'</span>\
							</a>\
							<span class="zc-delete"><i class="zc-ico"></i></span>\
						</li>';
					};
					function wrap(text,inner){
						return '<div class="zc-goods-item">\
							<div class="zc-attention-goods">\
								<ul class="clearfix">'+ inner +'</ul>\
							</div>\
						</div>'
					};
					jQuery.each(data,function(index,item){
						var currentTime = (+new Date(item.time) - (+new Date))/36E5;
						switch(!0){
							case currentTime <= 24: 						// 当天
								todayList += same(item);
							break;
							case currentTime > 24 && currentTime <= 168: 	// 最近一周
								lastWeekList += same(item);
							break;
							case currentTime > 168: 						// 一周前
								weekAgoList += same(item);
							break;
						}
					});
					if(todayList)
					complete += wrap('\u5f53\u5929',todayList);
					if(lastWeekList)
					complete += wrap('\u6700\u8fd17\u5929',lastWeekList);	
					if(weekAgoList)
					complete += wrap('\u4e00\u5468\u524d',weekAgoList);
					complete += '<div class="zc-view-all">\
							<p>\u53ea\u4fdd\u5b58\u6700\u8fd11\u4e2a\u6708\u7684\u6d4f\u89c8\u8bb0\u5f55</p>\
						</div>';
					return complete;
				}
			},
			UserCoupon : function(data){
				$(".zc-tab-coupons .xhd").hide();
				if(data && jQuery.isArray(data)){
					var complete = '';
					jQuery.each(data,function(index,item){
						complete += '<li';
						if (!item.enabled) {
							complete += ' class="finish"';
						}
						complete += '>';
						complete += '<div class="coupons"><div class="amount">&yen;<span>'+item.couponPrice+'</span></div><div class="aging">'+item.startTime+'~'+item.stopTime+'</div><div class="usage"><span>'+item.couponRange+'</span>|<span>'+item.couponConditions+'</span></div></div><div class="store-links"><a href="'+item.shopUrl+'">'+item.merchantName+'&nbsp;&nbsp;&nbsp;&nbsp;进店看看&gt;</a></div></li>';
					});
					return complete;
				}
			}
		},
		empty:{	// 数据为空时候的回调
			ShopCart:function(){
				return '<p>\u8d2d\u7269\u8f66\u7a7a\u7a7a\u7684</p>\
				<p>\u8d76\u5feb\u53bb\u6311\u9009\u5fc3\u4eea\u7684\u5546\u54c1\u5427~</p>'
			},
			OrderInfo:function(){
				return '<p>\u60a8\u7684\u8ba2\u5355\u7a7a\u7a7a\u7684</p>\
				<p>\u8d76\u5feb\u53bb\u6311\u9009\u5fc3\u4eea\u7684\u5546\u54c1\u5427~</p>';
			},
			BrowseHistroy:function(){
				return '\u60a8\u7684\u8db3\u8ff9\u7a7a\u7a7a\u5982\u4e5f~';
			},
			UserCoupon:function(){
				return '<p>\u6ca1\u6709\u53ef\u7528\u7684\u4f18\u60e0\u5238</p>';
			}
		},
		render:function(m,data){ // 数据渲染，待添加Loading
			if(!m)	return;
			var $content = jQuery('[data-contains="'+ m +'"]'); // 找到对应元素的jQuery对象
				content =  $content && $content[0]; 
			var $parent = $content.parent(),
				$parents = $content.parents('.zc-toolbar-plugin'),
				parent = $parent[0];
			var that = this,
				s = '',
				$current = jQuery('[data-change="current"]'), // 当前显示模块
				h = jQuery(window).height();

			/* 加载切换，已修正 */
			if($current && $current[0] && $current[0] !== $parents[0]){
				$current.removeAttr('data-change').animate({opacity:0,transform:'scale(0)'},500,function(){
					$current.css({top:h});	
				});
				$parents.attr('data-change','current').css({opacity:1,transform:'scale(1)'}).animate({top:0},500);
			}else{
				$parents.attr('data-change','current').css({top:0});
			};
			if(data && data.flag && jQuery.isArray(data.msg)){
				if(parent.style.display === 'none')
					parent.style.display = 'block';
				content.innerHTML = that.template[m](data.msg);
				$parent.height(h - (m === 'OrderInfo' ? 102 : 50));
				$parent.perfectScrollbar && $parent.perfectScrollbar();
			}else{
				parent.style.display = 'none';
				var empty = $parents.find('.zc-empty-box');
				empty = empty[0];
				if(!empty){
					empty = document.createElement('div');
					empty.className = 'zc-empty-box';
					parent.parentNode.appendChild(empty);
				}
				empty.innerHTML = this.empty[m]();
			}
		}
	};
	jQuery.drawer = drawer;
})();