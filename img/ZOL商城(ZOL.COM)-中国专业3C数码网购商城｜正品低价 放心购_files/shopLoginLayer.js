    (function(a){
    if (a){
        return;
    }
    
    /**
     * MD5加密
     *   
    */    
    var CryptoJS=CryptoJS||function(o,q){var l={},m=l.lib={},n=m.Base=function(){function a(){}return{extend:function(e){a.prototype=this;var c=new a;e&&c.mixIn(e);c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.$super.extend(this)}}}(),j=m.WordArray=n.extend({init:function(a,e){a=
    this.words=a||[];this.sigBytes=e!=q?e:4*a.length},toString:function(a){return(a||r).stringify(this)},concat:function(a){var e=this.words,c=a.words,d=this.sigBytes,a=a.sigBytes;this.clamp();if(d%4)for(var b=0;b<a;b++)e[d+b>>>2]|=(c[b>>>2]>>>24-8*(b%4)&255)<<24-8*((d+b)%4);else if(65535<c.length)for(b=0;b<a;b+=4)e[d+b>>>2]=c[b>>>2];else e.push.apply(e,c);this.sigBytes+=a;return this},clamp:function(){var a=this.words,e=this.sigBytes;a[e>>>2]&=4294967295<<32-8*(e%4);a.length=o.ceil(e/4)},clone:function(){var a=
    n.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var e=[],c=0;c<a;c+=4)e.push(4294967296*o.random()|0);return j.create(e,a)}}),k=l.enc={},r=k.Hex={stringify:function(a){for(var e=a.words,a=a.sigBytes,c=[],d=0;d<a;d++){var b=e[d>>>2]>>>24-8*(d%4)&255;c.push((b>>>4).toString(16));c.push((b&15).toString(16))}return c.join("")},parse:function(a){for(var b=a.length,c=[],d=0;d<b;d+=2)c[d>>>3]|=parseInt(a.substr(d,2),16)<<24-4*(d%8);return j.create(c,b/2)}},p=k.Latin1={stringify:function(a){for(var b=
    a.words,a=a.sigBytes,c=[],d=0;d<a;d++)c.push(String.fromCharCode(b[d>>>2]>>>24-8*(d%4)&255));return c.join("")},parse:function(a){for(var b=a.length,c=[],d=0;d<b;d++)c[d>>>2]|=(a.charCodeAt(d)&255)<<24-8*(d%4);return j.create(c,b)}},h=k.Utf8={stringify:function(a){try{return decodeURIComponent(escape(p.stringify(a)))}catch(b){throw Error("Malformed UTF-8 data");}},parse:function(a){return p.parse(unescape(encodeURIComponent(a)))}},b=m.BufferedBlockAlgorithm=n.extend({reset:function(){this._data=j.create();
    this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=h.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var b=this._data,c=b.words,d=b.sigBytes,f=this.blockSize,i=d/(4*f),i=a?o.ceil(i):o.max((i|0)-this._minBufferSize,0),a=i*f,d=o.min(4*a,d);if(a){for(var h=0;h<a;h+=f)this._doProcessBlock(c,h);h=c.splice(0,a);b.sigBytes-=d}return j.create(h,d)},clone:function(){var a=n.clone.call(this);a._data=this._data.clone();return a},_minBufferSize:0});m.Hasher=b.extend({init:function(){this.reset()},
    reset:function(){b.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);this._doFinalize();return this._hash},clone:function(){var a=b.clone.call(this);a._hash=this._hash.clone();return a},blockSize:16,_createHelper:function(a){return function(b,c){return a.create(c).finalize(b)}},_createHmacHelper:function(a){return function(b,c){return f.HMAC.create(a,c).finalize(b)}}});var f=l.algo={};return l}(Math);
    (function(o){function q(b,f,a,e,c,d,g){b=b+(f&a|~f&e)+c+g;return(b<<d|b>>>32-d)+f}function l(b,f,a,e,c,d,g){b=b+(f&e|a&~e)+c+g;return(b<<d|b>>>32-d)+f}function m(b,f,a,e,c,d,g){b=b+(f^a^e)+c+g;return(b<<d|b>>>32-d)+f}function n(b,f,a,e,c,d,g){b=b+(a^(f|~e))+c+g;return(b<<d|b>>>32-d)+f}var j=CryptoJS,k=j.lib,r=k.WordArray,k=k.Hasher,p=j.algo,h=[];(function(){for(var b=0;64>b;b++)h[b]=4294967296*o.abs(o.sin(b+1))|0})();p=p.MD5=k.extend({_doReset:function(){this._hash=r.create([1732584193,4023233417,
    2562383102,271733878])},_doProcessBlock:function(b,f){for(var a=0;16>a;a++){var e=f+a,c=b[e];b[e]=(c<<8|c>>>24)&16711935|(c<<24|c>>>8)&4278255360}for(var e=this._hash.words,c=e[0],d=e[1],g=e[2],i=e[3],a=0;64>a;a+=4)16>a?(c=q(c,d,g,i,b[f+a],7,h[a]),i=q(i,c,d,g,b[f+a+1],12,h[a+1]),g=q(g,i,c,d,b[f+a+2],17,h[a+2]),d=q(d,g,i,c,b[f+a+3],22,h[a+3])):32>a?(c=l(c,d,g,i,b[f+(a+1)%16],5,h[a]),i=l(i,c,d,g,b[f+(a+6)%16],9,h[a+1]),g=l(g,i,c,d,b[f+(a+11)%16],14,h[a+2]),d=l(d,g,i,c,b[f+a%16],20,h[a+3])):48>a?(c=
    m(c,d,g,i,b[f+(3*a+5)%16],4,h[a]),i=m(i,c,d,g,b[f+(3*a+8)%16],11,h[a+1]),g=m(g,i,c,d,b[f+(3*a+11)%16],16,h[a+2]),d=m(d,g,i,c,b[f+(3*a+14)%16],23,h[a+3])):(c=n(c,d,g,i,b[f+3*a%16],6,h[a]),i=n(i,c,d,g,b[f+(3*a+7)%16],10,h[a+1]),g=n(g,i,c,d,b[f+(3*a+14)%16],15,h[a+2]),d=n(d,g,i,c,b[f+(3*a+5)%16],21,h[a+3]));e[0]=e[0]+c|0;e[1]=e[1]+d|0;e[2]=e[2]+g|0;e[3]=e[3]+i|0},_doFinalize:function(){var b=this._data,f=b.words,a=8*this._nDataBytes,e=8*b.sigBytes;f[e>>>5]|=128<<24-e%32;f[(e+64>>>9<<4)+14]=(a<<8|a>>>
    24)&16711935|(a<<24|a>>>8)&4278255360;b.sigBytes=4*(f.length+1);this._process();b=this._hash.words;for(f=0;4>f;f++)a=b[f],b[f]=(a<<8|a>>>24)&16711935|(a<<24|a>>>8)&4278255360}});j.MD5=k._createHelper(p);j.HmacMD5=k._createHmacHelper(p)})(Math);
    
    window.ZsLogin = {};
    
    /**
     * 基本参数设置 
     * ZsLoginType 处罚类型 1 跳转到指定网址 2 提交表单事件 
     * 
     * 
     */    
    var baseUrl     = "http://login.zol.com";  
    var locationUrl = {
        'shop' : {'name':'\u005a\u004f\u004c\u5546\u57ce','url':'http://www.zol.com','regUrl':'https://login.zol.com/index.php?c=Default&a=Register'}, //商城
        'dealer':{'name':'','url':'http://s.zol.com.cn','regUrl':'http://s.zol.com.cn/register.html'}, //经销商
        'qyg':{'name':'\u005a\u004f\u004c\u4f01\u4e1a\u8d2d','url':'http://s.zol.com.cn/qyg/','regUrl':'http://q.zol.com.cn/index.php?c=UserRegister'} //企业购
    };  
    var loginParams = {'ZsLoginBoxType' : 1, 'ZsLoginType':1, 'ZsLoginUrl' : 'http://www.zol.com', 'showType':'shop','ZsLoginSubmitId' : '', 'backUrl' : ''};
    ZsLogin.set = function (params){
        for (key in params){
            loginParams[key] = params[key];
        }
    }

    ZsLogin.openLoginBox = function (){
        var loginType = 1;
        var boxStr  = '';
            boxStr = '<div class="login-layerbox-overlay" id="zolShopOverLay"></div>';
            
            boxStr += '<div class="login-layer-box" id="zolShopLayBox">';
            boxStr += '<div class="login-layer">';
            
            boxStr += '<div class="login-head">';
            boxStr += '<h3>登录'+locationUrl[loginParams.showType].name +'</h3>';
            boxStr += '<i class="close" id="zolShopLoginBoxClose"></i>';
            boxStr += '</div>';
            
            boxStr += '<div class="login-content">';
            boxStr += '<div class="login-hd">';
            boxStr += '<h3>账号登录</h3>';
            
            var typeTipClass = 'phone-login';
            var typeTipsStr  = '手机动态登录';
            if (2 == loginParams.ZsLoginBoxType){
                typeTipClass = 'common-login';
                typeTipsStr  = '普通方式登录';                
            }

            //boxStr += '<a href="javascript:;" class="' + typeTipClass + '" id="zolShopLoginTypeTips">' + typeTipsStr + '</a>';
            boxStr += '</div>';   
            
            boxStr += '<div class="login-wrong-tips" id="zolShopUserWrongTips"></div>';
            
            var userDivStyle   = 'block';
            var phoneDiveStyle = 'none';
            if (2 == loginParams.ZsLoginBoxType){
                userDivStyle   = 'none';
                phoneDiveStyle = 'block';                
                loginType = 2;
            }
            
            // 普通登陆
            boxStr += '<div class="form-item username" id="zolShopUserNameDive" style="display:' + userDivStyle + '">';
            boxStr += '<label for="zolShopUserName" class="label" style="display: none;">手机号/邮箱/用户名</label>';
            boxStr += '<input type="text" value="" autocomplete="off" placeholder="手机号/邮箱/用户名" class="text" id="zolShopUserName">';
            boxStr += '<ul style="display:none;" class="account-list" id="zolShopEmailList"></ul>';
            boxStr += '</div>';

            boxStr += '<div class="form-item" id="zolShopPasswordDiv" style="display:' + userDivStyle + '">';
            //boxStr += '<label for="" class="label">密码</label>';
            boxStr += '<input type="password" autocomplete="off" placeholder="密码" class="text" id="zolShopUserPassword">';
            boxStr += '<span class="case-tips" id="zolShopCapsLock">大小写锁定已打开<i class="ico"></i></span>';
            boxStr += '</div>';   
            
            // 手机号
            boxStr += '<div class="form-item phone-number" id="zolShopUserPhoneDiv" style="display:' + phoneDiveStyle + '">';
            //boxStr += '<label for="" class="label">手机号</label>';
            boxStr += '<input type="text" autocomplete="off" placeholder="手机号" class="text" id="zolShopUserPhone" name="zolShopUserPhone" value＝“15911050684”>';
            boxStr += '<input name="zolShopUserSendButton" type="button" value="发送验证码" class="btn" id="zolShopUserSendButton">';
            boxStr += '<span class="captcha-loading" style="display:none" id="zolShopUserSendLoading">100秒后重新获取</span>';
            boxStr += '</div>';              

            boxStr += '<div class="form-item" id="zolShopUserCodeDiv" style="display:' + phoneDiveStyle + '">';
            //boxStr += '<label for="" class="label">验证码</label>';
            boxStr += '<input type="text" autocomplete="off" placeholder="验证码" class="text" id="zolShopUserCode" name="zolShopUserCode" value="">';
            boxStr += '</div>';               
            
            // 图片验证码
            boxStr += '<div class="form-item captcha-item" id="zolShopUserPicCodeDiv" style="display:' + phoneDiveStyle + '">';
            boxStr += '<input type="text" value="" autocomplete="off" placeholder="图片验证码" class="text" id="zolShopUserPicCode" name="zolShopUserPicCode" maxlength="100">';
            boxStr += '<input type="hidden" value="" id="zolShopUserPicCodeToken" name="J_zolShopUserPicCodeToken">';
            boxStr += '<img width="98" height="38" src="" alt="点击刷新验证码" id="J_zolShopUserPicCodeImg">';            
            boxStr += '</div>';            
            
            boxStr += '<div class="form-other">';
            boxStr += '<label class="autologon"><input type="checkbox" name="" value="">记住登录状态</label>';
            boxStr += '<a target="_blank" href="http://my.zol.com.cn/index.php?c=getPassword">忘记密码？</a>';
            boxStr += '</div>';            
            
            boxStr += '<input type="hidden" name="zolShopUserLoginType" id="zolShopUserLoginType" value="' + loginType + '">';
            
            boxStr += '<input type="button" value="登 录" class="login-layer-btn" id="zolShopSubmit">';
            //boxStr += '<span style="display:none;" class="submit-loading" id="zolShopSubmitLoading">正在进入...(<b>3</b>)</span>';
            boxStr += '<span style="display:none;" class="submit-loading" id="zolShopSubmitLoading">正在登录...</span>';
            boxStr += '<div class="form-other"><a target="_blank" href="'+locationUrl[loginParams.showType].regUrl +'" class="register-btn">立即注册</a></div>'; 
                
            boxStr += '</div>';

            
            // 合作账号
            var backUrl = loginParams.backUrl ? escape(loginParams.backUrl) : escape(window.location.href);
            if(loginParams.showType != 'qyg'){
                boxStr += '<div class="login-foot clearfix"><span>合作账号登录：</span><a target="_blank" class="sina" href="http://service.zol.com.cn/user/api/sina/jump.php?comeshop=1&amp;backurl=' + backUrl + '">用微博账号登录</a><a target="_blank" class="qq" href="http://service.zol.com.cn/user/api/qq/libs/oauth/redirect_to_login.php?comeshop=1&amp;backurl=' + backUrl + '">用QQ账号登录</a><a target="_blank" class="alipay" href="http://tuan.zol.com/userBinding/alipay/alipay.auth.authorize_php_gb/alipay_auth_authorize.php?fromUrl='+backUrl+'">用支付宝账号登录</a><a target="_blank" class="baidu" href="http://service.zol.com.cn/user/api/baidu/jump.php?comeshop=1&backurl='+backUrl+'">用百度账号</a></div>';
            }
            
            boxStr += '</div>';            
            boxStr += '</div>';       

            var layerObj      = document.getElementById('zolShoplayer');
            if (layerObj){                        
                layerObj.innerHTML = boxStr;                            
            }else{
                var element       = document.createElement("div");
                element.id        = 'zolShoplayer';
                element.innerHTML = boxStr;
                document.body.appendChild(element);                
            }
            
            if (2 == loginParams.ZsLoginBoxType){                
                document.getElementById('zolShopUserPhone').focus();                    
                document.getElementById('zolShopUserPhoneDiv').style.border = "1px solid #FF3333";                
            }else{
                document.getElementById('zolShopUserName').focus();                    
                document.getElementById('zolShopUserNameDive').style.border = "1px solid #FF3333";
            }           
            
            // 点击图片获取验证码
            
            addEvent(document.getElementById('J_zolShopUserPicCodeImg'), 'click', function (event){
                ZsLogin.zsPicode();                
            });            
            ZsLogin.zsPicode();             
            
            // 添加普通登陆 和手机验证码登录切换
//            addEvent(document.getElementById('zolShopLoginTypeTips'), 'click', function (event){                
//                                
//                var typeTipsObj = document.getElementById('zolShopLoginTypeTips');                
//                var isIE = navigator.userAgent.indexOf("MSIE 6.0") === -1 ? 0 : 1; 
//                if (isIE){                    
//                    var className   = typeTipsObj.getAttribute('className');
//                    if ('common-login' == className){ // 普通登录                    
//                        typeTipsObj.setAttribute('className', 'phone-login');
//                        typeTipsObj.innerHTML = '手机动态登录';
//                    }else{
//                        typeTipsObj.setAttribute('className', 'common-login');
//                        typeTipsObj.innerHTML = '普通方式登录';
//                    } 
//                }else{
//                    var className   = typeTipsObj.getAttribute('class');       
//                    if ('common-login' == className){ // 普通登录                    
//                        typeTipsObj.setAttribute('class', 'phone-login');
//                        typeTipsObj.innerHTML = '手机动态登录';
//                    }else{
//                        typeTipsObj.setAttribute('class', 'common-login');
//                        typeTipsObj.innerHTML = '普通方式登录';
//                    }                     
//                }
//                
//                if ('common-login' == className){
//                    document.getElementById('zolShopUserNameDive').style.display = "block";
//                    document.getElementById('zolShopPasswordDiv').style.display = "block";
//                    
//                    document.getElementById('zolShopUserPhoneDiv').style.display = "none";
//                    document.getElementById('zolShopUserCodeDiv').style.display = "none";
//                    document.getElementById('zolShopUserPicCodeDiv').style.display = "none";                    
//                    
//                    document.getElementById('zolShopUserLoginType').value = 1;
//                    
//                    document.getElementById('zolShopUserName').focus();                    
//                    document.getElementById('zolShopUserNameDive').style.border = "1px solid #FF3333";                    
//                    
//                }else{
//                    document.getElementById('zolShopUserNameDive').style.display = "none";
//                    document.getElementById('zolShopPasswordDiv').style.display = "none";  
//                    
//                    document.getElementById('zolShopUserPhoneDiv').style.display = "block";
//                    document.getElementById('zolShopUserCodeDiv').style.display = "block";
//                    document.getElementById('zolShopUserPicCodeDiv').style.display = "block";
//                    
//                    document.getElementById('zolShopUserLoginType').value = 2;
//                    
//                    document.getElementById('zolShopUserPhone').focus();                    
//                    document.getElementById('zolShopUserPhoneDiv').style.border = "1px solid #FF3333";    
//                                                                                         
//                }
//                
//                document.getElementById('zolShopUserWrongTips').style.display = "none";
//                                 
//            
//            });  
            
            // 获取手机验证码
            var sendCodeObj = document.getElementById('zolShopUserSendButton');
            if (sendCodeObj){
                addEvent(sendCodeObj, 'click', ZsLogin.sendPhoneCode);
            }            

            // 关闭登陆框
            var closeObj = document.getElementById('zolShopLoginBoxClose');
            addEvent(closeObj, 'click', ZsLogin.closeLoginBox);

            // 提交登录
            var submitObj = document.getElementById('zolShopSubmit');
            addEvent(submitObj, 'click', ZsLogin.submitLogin);
            
            // email自动填充
            addEvent(document.getElementById('zolShopUserName'), 'keyup', checkEmail);
            
            // 用户按下回车提交登录            
            document.getElementById('zolShopLayBox').onkeypress = function (e){                  
                if (window.event){
                    e = window.event;                    
                }       
                var keyNumber = e.keyCode;     
                
                if (13 == keyNumber){
                    ZsLogin.submitLogin();
                }
            }        
            
            // 查看键盘是否锁定大小写
            document.getElementById('zolShopUserPassword').onkeypress = function (e){                 
                if (window.event){
                    e = window.event;                    
                }       
                var keyNumber = e.keyCode;
                var isShift = e.shiftKey || (e.keyCode == 16) || false; // shift键是否按住
                if (((e.keyCode >= 65 && e.keyCode <= 90) && !isShift) || ((e.keyCode >= 97 && e.keyCode <= 122) && isShift)) {         
                    document.getElementById('zolShopCapsLock').style.display = "block";                    
                } else {
                    document.getElementById('zolShopCapsLock').style.display = 'none';
                }
            }                
            
            // 自动加边框
            var inputArr = new Array('zolShopUserName', 'zolShopUserPassword', 'zolShopUserPhone', 'zolShopUserCode');
            for (var i = 0; i < 4; i++){
                document.getElementById(inputArr[i]).onfocus = function(e){                    
                    this.parentNode.style.border = "1px solid #FF3333";
                }
                document.getElementById(inputArr[i]).onblur = function(){                    
                    this.parentNode.style.border = "1px solid #ccc";
                }                
            }   
                          

    }
    
    ZsLogin.zsPicode = function(){        
        // 获取图片验证码        
        var url = baseUrl + "/index.php?a=AjaxPicCode&t="+Math.random();          
        getJSONP(url, ZsLogin.zsPicCodeCallback);         
    }
    
    // 手机号验证成功调用jsop调用论坛接口登录zol 
    ZsLogin.zsPicCodeCallback = function (jsonData){         
        document.getElementById('J_zolShopUserPicCodeImg').src     = jsonData.url;
        if(document.getElementById('J_zolShopUserPicCodeToken')){
            document.getElementById('J_zolShopUserPicCodeToken').value = jsonData.token;
        }
        
        return false;
    }        
    
    // 调用发送验证码
    ZsLogin.sendPhoneCode = function (){
        var mobile = document.getElementById('zolShopUserPhone').value;                    
        if ('' == mobile){
            ZsLogin.errorTips('请填写手机号');                        
            return false;                    
        }
        
        if (!checkMobile(mobile)){
            ZsLogin.errorTips('请填写正确的手机号');                        
            return false; 
        }        

        // 请求验证码
        var url = baseUrl + "/index.php?a=SendPhoneCode&mobile=" + mobile;        
        getJSONP(url, ZsLogin.userPhoneSendCodeCallback);        
    }
    
    // 关闭登录窗口
    ZsLogin.closeLoginBox = function (){
        var layBoxObj  = document.getElementById('zolShopLayBox');
        if (layBoxObj){            
            document.getElementById('zolShoplayer').removeChild(layBoxObj);
        }
        
        var overLayObj = document.getElementById('zolShopOverLay');
        if (overLayObj){
            document.getElementById('zolShoplayer').removeChild(overLayObj);            
        }        
    }
    
    // 错误提示
    ZsLogin.errorTips = function (msg){
        var wrongTips   = document.getElementById('zolShopUserWrongTips'); // 错误提示        
        if (msg){
            wrongTips.style.display = "block";
            wrongTips.innerHTML = msg;            
        }                     
    }
    
    // 登录按钮变化
    ZsLogin.loginButton = function (displayName){
        if ('none' == displayName){
            document.getElementById('zolShopSubmitLoading').style.display = 'block';
            document.getElementById('zolShopSubmit').style.display = 'none';                            
        }else{
            document.getElementById('zolShopSubmitLoading').style.display = 'none';
            document.getElementById('zolShopSubmit').style.display = 'block';             
        }
      
    }    

    // 登录成功处理后续
    ZsLogin.loginSucessCallback = function (jsonData){
        switch(loginParams.ZsLoginType){
            case 1:
                window.location = locationUrl[loginParams.showType].url;
                break;
            case 2:
                if(document.getElementById(loginParams.ZsLoginSubmitId)){ // 触发提交事件
                    ZsLogin.closeLoginBox();
                    if (document.all){
                        document.getElementById(loginParams.ZsLoginSubmitId).click();											            			
                    }else{
                        var e = document.createEvent("MouseEvents");
                        e.initEvent("click", true, true);
                        document.getElementById(loginParams.ZsLoginSubmitId).dispatchEvent(e);            			
                    }
                }else{ // 没有触发事件关闭窗口
                    ZsLogin.closeLoginBox();
                }                
                break;
             case 3:
                window.location.reload();
                break;
			 case 4:
                if(document.getElementById(loginParams.ZsLoginSubmitId)){ // 触发提交事件
                    ZsLogin.closeLoginBox();
                    document.getElementById(loginParams.ZsLoginSubmitId).submit();											            			
                }
                break;
            default:    
                window.location = loginParams.ZsLoginUrl;
        }
    }   

    
    // 提交登录
    ZsLogin.submitLogin = function (){                       
        var loginType = document.getElementById('zolShopUserLoginType').value;
        
        // 普通登录
        if (1 == loginType){             
            ZsLogin.userLogin();   // 登录处理程序            
        }
        
        // 手机号发验证码登录
        if (2 == loginType){ 
            ZsLogin.userPhoneLogin(); // 手机号发验证码程序  
            ZsLogin.loginButton(); // 恢复登录按钮为可提交状态            
        }        
    }   

    // 普通登录
    ZsLogin.userLogin = function (){        
        var username = document.getElementById('zolShopUserName').value;      // 登陆名称        
        if ('' == username){
            ZsLogin.errorTips("请填写手机号/邮箱/用户名");            
            return false;
        }
        
        var password = document.getElementById('zolShopUserPassword').value; // 登录密码        
        if ('' == password){
            ZsLogin.errorTips("请填写正确的密码");            
            return false;            
        }  
        password = CryptoJS.MD5(password+"zol");
        
        ZsLogin.loginButton('none'); // 设置登录按钮为不可提交状态                
        var url = baseUrl + "/index.php?a=AjaxLogin&username=" + username + "&password="+password;                
        getJSONP(url, ZsLogin.userLoginCallback);
    }
    
    // 普通登录回调    
    ZsLogin.userLoginCallback = function (jsonData){
        var jsonData = jsonData;
        if (jsonData.flag){ 
            var url = "http://service.zol.com.cn/user/api/login_zol_new.php?act=signin&username="+jsonData.userName + "&checkCode=" + jsonData.checkCode + "&sid=" + jsonData.userId + "&check=" + jsonData.check; 
            getJSONP(url); // 同步登录zol           
            setTimeout(ZsLogin.loginSucessCallback, 1200); // 调用公用处理      
            return false; 
        }else{
            ZsLogin.errorTips(jsonData.msg);
            ZsLogin.loginButton(); // 恢复登录按钮为可提交状态  
            return false;        
        }
    }
        
        
    // 手机号验证码登录
    ZsLogin.userPhoneLogin = function (){        
        var mobile      = document.getElementById('zolShopUserPhone').value;
        if ('' == mobile){
            ZsLogin.errorTips("请填写手机号");            
            return false;   
        }  
         
        if (!checkMobile(mobile)){
            ZsLogin.errorTips('请填写正确的手机号');                        
            return false; 
        }          
        
        var mobieCode   = document.getElementById('zolShopUserCode').value;
        if ('' == mobieCode){
            ZsLogin.errorTips("请填写手机验证码");            
            return false;    
        }    
        
        var picCode  = document.getElementById('zolShopUserPicCode').value;
        var picToken = document.getElementById('zolShopUserPicCodeToken').value;
        
                
        ZsLogin.loginButton('none'); // 设置登录按钮为不可提交状态
        var url = baseUrl + "/index.php?a=AjaxLoginPhone&mobile=" + mobile + "&mobieCode=" + mobieCode + "&picCode="+picCode+"&picToken="+picToken;
        getJSONP(url, ZsLogin.userPhoneLoginCallback);        
    } 
    
    // 手机号验证成功调用jsop调用论坛接口登录zol 
    ZsLogin.userPhoneLoginCallback = function (jsonData){
        var jsonData = jsonData;
        if (jsonData.flag){
            var url = "http://m.zol.com.cn/user/api/phoneLogin.php?token="+jsonData.token + "&phone=" + jsonData.mobile + "&t=" + jsonData.time; 
            getJSONP(url, ZsLogin.userPhoneCallback);
        }else{                       
            ZsLogin.errorTips(jsonData.msg);  
            return false;              
        }
    }    
    

    // zol成功调用商城接口 实现商城登录
    ZsLogin.userPhoneCallback = function (jsonData){
        var jsonData = jsonData;
        if (jsonData.code){
            ZsLogin.errorTips("网路繁忙，请稍后再试");   
            return false;             
        }else{
            var url = baseUrl + "/index.php?a=AjaxLoginPhoneSucess&userId=" + jsonData.zol_sid + "&userName=" + jsonData.zol_userid + "&checkCode=" + jsonData.zol_check + "&cipher="+jsonData.zol_cipher;                         
            getJSONP(url, ZsLogin.loginSucessCallback);
        }
    }    
        
    // 发送验证码回调
    ZsLogin.userPhoneSendCodeCallback = function(jsonData){
        var wrongTips   = document.getElementById('zolShopUserWrongTips');
        if (jsonData.flag){
            document.getElementById('zolShopUserSendButton').style.display = "none";
            document.getElementById('zolShopUserSendLoading').style.display = "block";
            // 设置倒计时时间
            setTimeout("ZsLogin.userPhoneCountDown('100')", 1000);   
            if ('block' == wrongTips.style.display){
                wrongTips.style.display = "none";
            }            
        }else{
            ZsLogin.errorTips(jsonData.msg);             
            return false;         
        }
    }
    
    // 发送验证码倒计时时间
    ZsLogin.userPhoneCountDown = function (countDownNumber){
        document.getElementById('zolShopUserSendLoading').innerHTML = countDownNumber + '秒后重新获取';
        countDownNumber = parseInt(countDownNumber);
        countDownNumber--;
        if (!countDownNumber){
            clearTimeout(timeout);
            document.getElementById('zolShopUserSendButton').style.display = "block";
            document.getElementById('zolShopUserSendLoading').style.display = "none";            
        }else{
            var timeout = setTimeout("ZsLogin.userPhoneCountDown('" + countDownNumber + "')", 1000);                     
        }
        
    }    
    
    var checkEmail = function (){   
        var email = document.getElementById('zolShopUserName').value;        
        if (email){
            var obj         = document.getElementById('zolShopEmailList');
            var indexNumber = email.indexOf("@");
            if (indexNumber > 0){
                
                var emailArr = new Array("qq.com", "163.com", "gmail.com", "126.com", "sina.com", "hotmail.com");
                
                var emailList = '';
                var number = emailArr.length;
                var emailtTitle = email.substr(0, indexNumber);        
                var emailBody   = email.substr(indexNumber+1);                     
                for (i = 0; i < number; i++) {     
                    if (-1 !== emailArr[i].indexOf(emailBody)){
                        emailList += '<li>' + emailtTitle + '@' + emailArr[i] + '</li>';
                    }                    
                }
                
                obj.innerHTML     = emailList;
                obj.style.display = "block";
                var liObj = obj.querySelectorAll("li");
                var liLen = liObj.length;
                for (var j = 0; j < liLen; j++){
                    liObj[j].onclick = function (){
                        document.getElementById('zolShopUserName').value = this.innerHTML;
                        obj.innerHTML     = "";
                        obj.style.display  = "none";
                    }
                }
            }else{
                obj.innerHTML = '';
                obj.style.display = "none";
            }                        
        }      
    }
    
    // 验证手机号
    var checkMobile = function (mobile){
        var flag = false;
        if (mobile){
            var regPartton = new RegExp(/1[3-8]+\d{9}/);
            if (regPartton.test(mobile)){
                flag = true;
            }
        }
        
        return flag;
                
    }
    // 格式化参数 
    function encodeFormData(data){
        if (!data){
            return "";    
        }
        var pairs = [];
        for (var name in data){
            if (!data.hasOwnProperty(name)){
                continue;    
            }    

            if (typeof(data[name]) === "function"){
                continue;    
            }

            var value = data[name].toString();

            name  = encodeURIComponent(name.replace("%20", "+"));

            value = encodeURIComponent(value.replace("%20", "+"));

            pairs.push(name  + "=" + value);

        }

        return pairs.join('&');        
    }
    
    var getXmlHttpRequest = function (){
        if (window.XMLHttpRequest){
            xmlHttpRequest = new XMLHttpRequest();
        }else if (window.ActiveXObject){
            xmlHttpRequest = new ActiveXObject("Microsoft.XMLHTTP");
        }else{

        }          
        return xmlHttpRequest;
    }
    
    // post请求
    var postData = function (url, data, callback){
        var xmlHttpRequest = getXmlHttpRequest();
        if (xmlHttpRequest && url){
            xmlHttpRequest.open("POST", url);
            xmlHttpRequest.onreadystatechange = function(){
                if ((4 == xmlHttpRequest.readyState) && callback){                
                       var data = JSON.parse(xmlHttpRequest.responseText);                       
                       callback(data);                    
                }
            };
            xmlHttpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xmlHttpRequest.send(encodeFormData(data));            
        }
    }
    
    /**
     * 跨域HTTP请求 JSONP
     * 根据指定URL发送一个JSONP请求
     * 然后把解析得到的响应数传递给回调函数
     * 在URL中添加一个名为JSOP的查询参数用于指定该请求的回调函数的名称
     *     
     */
    var getJSONP = function(url, callback){

        // 为本次请求创建一个唯一的回调函数名称
        var ts     = Date.parse(new Date());
        var cbnum  = "cb" + ts + getJSONP.counter++;
        
        var cbname = "JSONP" + cbnum;

        if (-1 === url.indexOf("?")){
             url += "?callback=" + cbname;    
        } else{
                url += "&callback=" + cbname;    
        }
        
        // 定义将被脚本执行的回调函数
        window[cbname] = function(response){
          try{
              if (callback){
                callback(response);
              }              
          }finally{ 
               delete getJSONP[cbnum];
               script.parentNode.removeChild(script);
          }
        }
        
        var script = document.createElement("script");
        script.type = "text/javascript"; 
        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);  
    }
    getJSONP.counter = 0;
    
    // 事件监听
    var addEvent = function (obj, eventType, eventData){
        if ('object' !== typeof(obj)){
            return;
        }
        if ('' == eventType){
            return;
        }
        // 兼容IE11取消MSIE判断
//        var isEvent = navigator.userAgent.indexOf("MSIE") == -1 ? 1 : 0;     
        if (obj.addEventListener){            
            obj.addEventListener(eventType, eventData);
        }else if(obj.attachEvent){
            obj.attachEvent('on' + eventType, eventData);  
        }
    }
    
    // 设置cookie值
    function setcookie(name, value, daysToLive){
        var cookie = name + '=' + encodeURIComponent(value);
            cookie += '; path=/'; 
            cookie += '; domain=.zol.com'; 
        if ('number' === typeof daysToLive){
            cookie += '; max-age=' + (daysToLive*60*60*24);
        }
    }    
    
    // 获取cookie值
    ZsLogin.getCookie = function(cookieName){
        var cookieObj = {};
        var all = document.cookie;

        if ('' === all){
            return cookieObj;
        }

        var list = all.split(";");
        for (var i = 0; i < list.length; i++){
            var cookie = list[i];
            var p = cookie.indexOf("=");

            var name  = cookie.substring(0, p);
            var value = cookie.substring(p+1);

            //value = decodeURIComponent(value);

            cookieObj[name] = value;
        }

        return cookieObj;
    }    
    
    
    var isIE   = navigator.userAgent.indexOf("MSIE") == -1 ? 1 : 0; 
    if (!isIE){ // 如果是IE引入json插件
        
        if (typeof JSON !== 'object') {
            JSON = {};
        }        
        
        function f(n) {        
            return n < 10 ? '0' + n : n;
        }

        if (typeof Date.prototype.toJSON !== 'function') {

            Date.prototype.toJSON = function () {

                return isFinite(this.valueOf())
                    ? this.getUTCFullYear()     + '-' +
                        f(this.getUTCMonth() + 1) + '-' +
                        f(this.getUTCDate())      + 'T' +
                        f(this.getUTCHours())     + ':' +
                        f(this.getUTCMinutes())   + ':' +
                        f(this.getUTCSeconds())   + 'Z'
                    : null;
            };

            String.prototype.toJSON      =
                Number.prototype.toJSON  =
                Boolean.prototype.toJSON = function () {
                    return this.valueOf();
                };
        }

        var cx, escapable, gap, indent, meta, rep;


        function quote(string) {

            escapable.lastIndex = 0;
            return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string'
                    ? c
                    : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' : '"' + string + '"';
        }


        function str(key, holder) {

            var i,          // The loop counter.
                k,          // The member key.
                v,          // The member value.
                length,
                mind = gap,
                partial,
                value = holder[key];

            // If the value has a toJSON method, call it to obtain a replacement value.

            if (value && typeof value === 'object' &&
                    typeof value.toJSON === 'function') {
                value = value.toJSON(key);
            }

            // If we were called with a replacer function, then call the replacer to
            // obtain a replacement value.

            if (typeof rep === 'function') {
                value = rep.call(holder, key, value);
            }

            // What happens next depends on the value's type.
            switch (typeof value) {
            case 'string':
                return quote(value);

            case 'number':

            // JSON numbers must be finite. Encode non-finite numbers as null.

                return isFinite(value) ? String(value) : 'null';

            case 'boolean':
            case 'null':

            // If the value is a boolean or null, convert it to a string. Note:
            // typeof null does not produce 'null'. The case is included here in
            // the remote chance that this gets fixed someday.

                return String(value);

            // If the type is 'object', we might be dealing with an object or an array or
            // null.

            case 'object':

            // Due to a specification blunder in ECMAScript, typeof null is 'object',
            // so watch out for that case.

                if (!value) {
                    return 'null';
                }

            // Make an array to hold the partial results of stringifying this object value.

                gap += indent;
                partial = [];

            // Is the value an array?

                if (Object.prototype.toString.apply(value) === '[object Array]') {

            // The value is an array. Stringify every element. Use null as a placeholder
            // for non-JSON values.

                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }

                // Join all of the elements together, separated with commas, and wrap them in
                // brackets.

                    v = partial.length === 0
                        ? '[]'
                        : gap
                        ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                        : '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }

                // If the replacer is an array, use it to select the members to be stringified.

                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        if (typeof rep[i] === 'string') {
                            k = rep[i];
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {

                // Otherwise, iterate through all of the keys in the object.

                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }

                // Join all of the member texts together, separated with commas,
                // and wrap them in braces.

                v = partial.length === 0
                    ? '{}'
                    : gap
                    ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                    : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
            }
        }

        // If the JSON object does not yet have a stringify method, give it one.

        if (typeof JSON.stringify !== 'function') {
            escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
            meta = {    // table of character substitutions
                '\b': '\\b',
                '\t': '\\t',
                '\n': '\\n',
                '\f': '\\f',
                '\r': '\\r',
                '"' : '\\"',
                '\\': '\\\\'
            };
            JSON.stringify = function (value, replacer, space) {

                // The stringify method takes a value and an optional replacer, and an optional
                // space parameter, and returns a JSON text. The replacer can be a function
                // that can replace values, or an array of strings that will select the keys.
                // A default replacer method can be provided. Use of the space parameter can
                // produce text that is more easily readable.

                var i;
                gap = '';
                indent = '';

                // If the space parameter is a number, make an indent string containing that
                // many spaces.

                if (typeof space === 'number') {
                    for (i = 0; i < space; i += 1) {
                        indent += ' ';
                    }

                // If the space parameter is a string, it will be used as the indent string.

                } else if (typeof space === 'string') {
                    indent = space;
                }

                // If there is a replacer, it must be a function or an array.
                // Otherwise, throw an error.

                rep = replacer;
                if (replacer && typeof replacer !== 'function' &&
                        (typeof replacer !== 'object' ||
                        typeof replacer.length !== 'number')) {
                    throw new Error('JSON.stringify');
                }

                // Make a fake root object containing our value under the key of ''.
                // Return the result of stringifying the value.

                return str('', {'': value});
            };
        }


        // If the JSON object does not yet have a parse method, give it one.

        if (typeof JSON.parse !== 'function') {
            cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
            JSON.parse = function (text, reviver) {

    // The parse method takes a text and an optional reviver function, and returns
    // a JavaScript value if the text is a valid JSON text.

                var j;

                function walk(holder, key) {

    // The walk method is used to recursively walk the resulting structure so
    // that modifications can be made.

                    var k, v, value = holder[key];
                    if (value && typeof value === 'object') {
                        for (k in value) {
                            if (Object.prototype.hasOwnProperty.call(value, k)) {
                                v = walk(value, k);
                                if (v !== undefined) {
                                    value[k] = v;
                                } else {
                                    delete value[k];
                                }
                            }
                        }
                    }
                    return reviver.call(holder, key, value);
                }


    // Parsing happens in four stages. In the first stage, we replace certain
    // Unicode characters with escape sequences. JavaScript handles many characters
    // incorrectly, either silently deleting them, or treating them as line endings.

                text = String(text);
                cx.lastIndex = 0;
                if (cx.test(text)) {
                    text = text.replace(cx, function (a) {
                        return '\\u' +
                            ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                    });
                }

    // In the second stage, we run the text against regular expressions that look
    // for non-JSON patterns. We are especially concerned with '()' and 'new'
    // because they can cause invocation, and '=' because it can cause mutation.
    // But just to be safe, we want to reject all unexpected forms.

    // We split the second stage into 4 regexp operations in order to work around
    // crippling inefficiencies in IE's and Safari's regexp engines. First we
    // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
    // replace all simple value tokens with ']' characters. Third, we delete all
    // open brackets that follow a colon or comma or that begin the text. Finally,
    // we look to see that the remaining characters are only whitespace or ']' or
    // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

                if (/^[\],:{}\s]*$/
                        .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                            .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                            .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

    // In the third stage we use the eval function to compile the text into a
    // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
    // in JavaScript: it can begin a block or an object literal. We wrap the text
    // in parens to eliminate the ambiguity.

                    j = eval('(' + text + ')');

    // In the optional fourth stage, we recursively walk the new structure, passing
    // each name/value pair to a reviver function for possible transformation.

                    return typeof reviver === 'function'
                        ? walk({'': j}, '')
                        : j;
                }

    // If the text is not JSON parseable, then a SyntaxError is thrown.

                throw new SyntaxError('JSON.parse');
            };
        }        
    }
    
})(window.ZsLogin);