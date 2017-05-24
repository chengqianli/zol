if(typeof(pvhitimgview)=="undefined"){
	var pvhitimgview=true;
	function pv_rport(dm,f) {
		var i = dm.indexOf(f);
		if (i > 0) {
			return  dm.substring(0, i);
		}
		return dm;
	}

	function getRefUrl(refUrl) {
		if (refUrl.indexOf('ref0') > -1){
			var regexstr = /(?:\&|\?)ref0=([\s\S]*?)$/i;
			refUrl = refUrl.match(regexstr);
			refUrl = encodeURI(refUrl[1]);
			return refUrl;
		}
	}
	function getDomain(){
		var dm = '';
		hn=location.hostname;
		str=hn.replace(/\.(com|net|org|cn$)\.?.*/,"");
		if(str.lastIndexOf(".") == -1)
			dm = "." + hn;
		else
		{
			str = str.substring(str.lastIndexOf("."));
			dm = hn.substring(hn.lastIndexOf(str));
		}
		return dm;
	}

	function getflash(){
		var i,flash;
		if (window.ActiveXObject){
			for(i=12;i>0;i--){
				try{
					flash=new ActiveXObject("ShockwaveFlash.ShockwaveFlash."+i);
					return i+".0";
				}
				catch(e){
				}
			}
		}
		else if (navigator.plugins&&navigator.plugins.length){
			for (i=0;i<navigator.plugins.length;i++){
				if (navigator.plugins[i].name.indexOf('Shockwave Flash')!=-1){
					return navigator.plugins[i].description.split(" ")[2];
				}
			}
		}
		return "Not enabled";
	}


	function readck(name){
		var cookieValue = "";
		var search_s = name + "=";
		if(document.cookie.length > 0)
		{ 
			offset = document.cookie.indexOf(search_s);
			if (offset != -1)
			{ 
				offset += search_s.length;
				end = document.cookie.indexOf(";", offset);
				if (end == -1) end = document.cookie.length;
				cookieValue = unescape(document.cookie.substring(offset, end))
			}
		}
		return cookieValue;
	}

	function writeck(name, value, hours){
		var expire = "";
		var dm = getDomain();
		if(hours != null)
		{
			expire = new Date((new Date()).getTime() + hours * 3600000);
			expire = "; expires=" + expire.toGMTString();
		}
		document.cookie = name + "=" + escape(value) + expire + ";domain=" + dm + ";path=/; ";
	}

	function randck(){
		return Math.floor(Math.random()*256);
	}

	function gettitle(){
		var title;
		if (typeof(encodeURIComponent)=="function"){
			if (document.title){
				if (window.RegExp){
					var tire=new RegExp("^"+window.location.protocol+"//"+window.location.hostname+"\\s-\\s");
					title=document.title.replace(tire,"");
				}
			}else{
				title=document.title;
			}
			title=encodeURIComponent(title);
		}else{
			title='';
		}
		return title;
	}
	function getRefer(){
		var refer;
		if(typeof(_zpv_document_refer)=="undefined"){
			refer = document.referrer;
		} else {
			if(''==_zpv_document_refer){
				refer = document.referrer;
			} else {
				refer = _zpv_document_refer;
			}
		}
		return refer;
	}

	var imgsrc='';
	function pv_d(){
		var _check_url = document.URL;
		if(_check_url.indexOf('#cwmysxghgu')!=-1){
			return;
		}
		var now = new Date().getTime();
		var pv_userid;
		var dm = getDomain();
		if(dm==".fengniao.com"){
			var fn_userid = readck('bbuserid');
			if(fn_userid != ''){
				pv_userid = 'fn_'+fn_userid;
			}
		}else{
			pv_userid = readck('zol_userid');
		}
		var datestr=escape(now*1000+Math.round(Math.random()*1000));

		//增加产品线统计
		if(typeof(pv_subcatid)=="undefined")
			pv_subcatid=0;

		if(top.location==self.location){
//			var refer_str = getRefer();
//			refer_str=refer_str.replace(/\</g,"");
//			refer_str=refer_str.replace(/\>/g,"");
//			imgsrc='http://pv.zol.com.cn/images/pvhit0001.gif?t='+datestr+'&subcat='+pv_subcatid+'&vuserid='+pv_userid+'&'+refer_str;
//			var f=location.href;
//			if(f.indexOf("xiyuit.com")>0 || f.indexOf("westd.net")>0 || f.indexOf("westd.com")>0 || f.indexOf("idvd.com.cn")>0 || f.indexOf("51flash.com")>0 || f.indexOf("xiaoshuoku.com.cn")>0 || f.indexOf("5down.com")>0){
//				imgsrc='http://pvsite.zol.com.cn/images/pvhit0001.gif?t='+datestr+'&vuserid='+pv_userid+'&'+refer_str;
//			// wap站特殊处理
//			} else if (f.indexOf("http://m.zol.com.cn/")>=0 || f.indexOf("http://m.zol.com/")>=0 || f.indexOf("http://wap.zol.com.cn/")>=0 || f.indexOf("http://m.abab.com/")>=0 || f.indexOf("http://app.zol.com.cn/")>=0){
//				imgsrc='http://wappv.zol.com.cn/images/wap3g.gif?t='+datestr+'&vuserid='+pv_userid+'&url='+f+'&ref='+refer_str;
//			}
		}else {
			var d=document.referrer+'';
			d=d.substr(7);
			d=pv_rport(d,'/');
			d=pv_rport(d,':');

			var refer_str = getRefUrl(document.referrer);

			refer_str = (refer_str)?refer_str:document.referrer;
			refer_str=refer_str.replace(/\</g,"");
			refer_str=refer_str.replace(/\>/g,"");
			if(d.substr(d.length-10)=='zol.com.cn' || d.substr(d.length-12)=='fengniao.com' || d.substr(d.length-10)=='google.com' || d.substr(d.length-9)=='qihoo.com' || d.substr(d.length-9)=='baidu.com'|| d.substr(d.length-8)=='3721.com' || d.substr(d.length-8)=='1sou.com' || d.substr(d.length-10)=='pku.edu.cn' || d.substr(d.length-16)=='sanhaostreet.com' || d.substr(d.length-11)=='ibox.com.cn' || d.substr(d.length-6)=='360.cn')
				imgsrc='https://pv.zol.com.cn/images/pvhit0001.gif?t='+datestr+'&subcat='+pv_subcatid+'&vuserid='+pv_userid+'&'+refer_str;
			else if(d.substr(d.length-10)=='xiyuit.com' || d.substr(d.length-9)=='westd.net' || d.substr(d.length-9)=='westd.com' || d.substr(d.length-11)=='idvd.com.cn' || d.substr(d.length-11)=='51flash.com' || d.substr(d.length-17)=='xiaoshuoku.com.cn' || d.substr(d.length-9)=='5down.com')
				imgsrc='https://pvsite.zol.com.cn/images/pvhit0002.gif?t='+datestr+'&'+refer_str;
			else
				imgsrc='';
		}

		if(imgsrc!='')
		{
			var ck = readck('ip_ck');
			var dom = ".w8.com.cn";
			if (null == document.getElementById('pv_d')) {
				document.write('<scr'+'ipt type="text/javascript" id="pv_d" src="https://zdw'+ dom +'/p.ht?h=&t='+ datestr +'&c='+ ck +'"></scr'+'ipt>');
			} else {
				var script = document.createElement('script');
				script.src = 'https://zdw'+ dom +'/p.ht?h=&t='+ datestr +'&c='+ ck;
				script.type = "text/javascript";
				document.getElementsByTagName("head")[0].appendChild(script);
			}
		}
	}

	pv_d();
	if(typeof(moduleHeatConfig) != "undefined")
	{
		var ck = readck('ip_ck');
		var dom = getDomain();
		if(dom != ".fengniao.com" && dom != ".3qit.com")
			dom=".zol.com.cn";
                //document.write('<scr'+'ipt type="text/javascript" src="http://js'+ dom +'/moduleHeat.ht"></scr'+'ipt>');
	}
}