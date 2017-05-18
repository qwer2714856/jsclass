window.BAAS = {
    getInstance: function(app_id, app_secret,base_url,version) {
        var api = {};
        api.base = base_url?base_url:BAASBase;
        api.app_id = app_id;
        api.app_secret = app_secret;
        api.getURL = function(uri, params) {
            var url = api.base + uri;
            var keyUrl = "?app_id=" + api.app_id + "&app_secret=" + api.app_secret;
            //var ts = localStorage.getItem( api.base + 'ts' );
            var ts = sessionStorage.ts;
            if( ts != null ){
                keyUrl += '&ts=' + ts;
            }
            url += keyUrl;
            if(version){
                url+='&lv='+version;
            }
            if(typeof params != 'undefined' && params != {} ){

                url += '&'+api.param(params);
            }
            return url;
        }
        /**
         * 重写angular的param方法，使angular使用jquery一样的数据序列化方式  The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
        api.param = function(obj) {
            var query = '',
                name, value, fullSubName, subName, subValue, innerObj, i;
            for (name in obj) {
                value = obj[name];
                //if(name=='sort'){
                //    query+=encodeURIComponent(name) + '=' + encodeURIComponent(value);
                //}

                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';

                    }
                } else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                     //  query += param(innerObj) + '&';
                      query+= encodeURIComponent(name) + '=' +subName+":"+subValue+"&";
                    }
                } else if (value !== undefined && value !== null)
                    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
            }
            console.log(1);
            console.log(query.length ? query.substr(0, query.length - 1) : query);
            return query.length ? query.substr(0, query.length - 1) : query;
        };
        /****
$obj={http:$http,method:'post',uri:$uri,data:$data,success:$success,error:$error}
****/
        api.call = function($obj) {
            if ($obj.method.toLowerCase() == 'post') {
              // console.log($obj.data );

                if(!$obj.success){
                    return  $obj.http.post(api.getURL($obj.uri), $obj.data);
                }
                $obj.http.post(api.getURL($obj.uri), $obj.data).success($obj.success);
                return;
            }
            if ($obj.method.toLowerCase() == 'get') {
                if(!$obj.success){
                    return   $obj.http.get(api.getURL($obj.uri, $obj.data));
                }
                $obj.http.get(api.getURL($obj.uri, $obj.data)).success($obj.success);
                return;
            }
            if ($obj.method.toLowerCase() == 'put') {
                if(!$obj.success){
                    return   $obj.http.put(api.getURL($obj.uri), $obj.data);
                }
                $obj.http.get(api.getURL($obj.uri, $obj.data)).success($obj.success);
                return;
            }
            if ($obj.method.toLowerCase() == 'delete') {
                if(!$obj.success){
                    return   $obj.http.delete(api.getURL($obj.uri, $obj.data));
                }
                $obj.http.get(api.getURL($obj.uri, $obj.data)).success($obj.success);
                return;
            }
        }
        return api;
    }
};

var baas_t31_lv1=BAAS.getInstance(baas.appId,baas.appSecret,baas.serverURL,1);