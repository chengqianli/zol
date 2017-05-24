/**
 * spm统计继承
 *
 * @author yuhx
 * @date 2015-11-30
 */
var SPM = {
    'getSpm' : function(url){
        if(url == ''){
            return '';
        }
        var r = url.match('spm=[0-9.]*');  //获取url中"?"符后的字符串并正则匹配
        var context = "";  
        if (r != null){
            context = r[0];
        }
        return context == null || context == "" || context == "undefined" ? "" : context;  
    },
    'setSpm' : function(tagName,spm){
        if(tagName == '' || spm == ''){
            return '';
        }
        var tagArr = document.getElementsByTagName(tagName);
        var tagLen = tagArr.length;
        for(var i=0;i<=tagLen-1;i++){
            var nowHref = "";
            var tagHref = tagArr[i].getAttribute("href"); 
            if(tagHref.indexOf('http://') >= 0){
                var tagSpm = SPM.getSpm(tagHref);
                if(tagSpm){
                    nowHref = tagHref.replace(spm,tagSpm);
                }else{
                    if(tagHref.indexOf('?') >= 0){
                        nowHref = tagHref+"&"+spm;
                    } else {
                        nowHref = tagHref+"?"+spm; 
                    }
                }
                tagArr[i].setAttribute("href", nowHref);
            }
        }
    },
    'start' : function(){
        var urlSpm = SPM.getSpm(window.location.search);
        if(urlSpm){
            SPM.setSpm('a',urlSpm);
            SPM.setSpm('area',urlSpm);
        }
    }
};
SPM.start();
