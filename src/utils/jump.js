/**
     * 使用UniversalLink技术调起NA, 入口
     * @param  {string}   targetUrl     调起失败的回调url
     * @param  {string} openapi 调起api
     * @param  {Object} opts 调起可选参数
     */
function callNAbyUniversalLink(targetUrl, openapi, opts) {
    opts = opts || {};

    // 开发测试用，clicktest = 当天日期 时点击不调起
    var todayString = (new Date().toLocaleDateString() || '').replace(/\//g, '');
    var clicktest = todayString && location.href.indexOf('clicktest=' + todayString) > -1;
    var allowDownLoad = !callNaConfig.forbidDownLoadTable[opts.source] && !(opts && opts.forbidDownLoad);

    // 调起位的调起策略
    var callNaStrategy = getCallNAStrategy(opts);
    if (callNaStrategy === 'no' || clicktest || !canUseUniversalLink()) {
        return;
    }

    // 非S级调起位置（非常量调起，不用universaklink）, 微信必须用universaklink
    if ((callNaStrategy === 'normal' && !/MicroMessenger/ig.test(userAgent) && !/newapp/ig.test(userAgent))) {
        // safari 非S级button调起前加弹窗
        // 埋入度口令
        var source = opts.source || '';
        // 拿到静态度口令
        var token = uiUtil.DownBox._getDuToken(source, opts);
        // 获取动态度口令
        getDynamicToken(token);
        openapi = rewriteOpenapiSrc(openapi, opts);
        opts.targetUrl = targetUrl;
        listener.trigger('callNa', 'UniversalTypePopup',
            {
                openapi: openapi,
                opts: opts
            });
        var popUpEl = $('#downloadnativepopupUlink');
        if (popUpEl) {
            popUpEl[0].style.display = 'block';
            pbstat.addStat('downloadnativepopupUlink', 'show');
        }
        return;
    }
    // 埋入度口令
    var source = opts.source || '';
    // 拿到静态度口令
    var token = uiUtil.DownBox._getDuToken(source, opts);
    // 获取动态度口令
    getDynamicToken(token);
    // hao123来源调起量统计单独计算
    var thirdParty = cookie.get('third_party');
    var cbkFr = 'webapp_callna';
    openapi = rewriteOpenapiSrc(openapi, opts);
    if (thirdParty === 'hao123') {
        cbkFr = 'webapp_hao123';
    }

    // 调起来源区分微信流量
    var urlParams = url.get();
    var daFrom = urlParams.pageState ? (urlParams.pageState.da_from || '') : '';
    if (daFrom === 'weixin' || /MicroMessenger/ig.test(userAgent)) {
        cbkFr = 'webapp_weixin';
    }

    // 默认 允许下载，常调起位如果调起失败，跳转到自定义下载页, (跳转到AppStore下载页失败)
    var cbkUrl = 'https://map.baidu.com/zt/client/index/?down=iphone&fr=' + cbkFr;

    if (!allowDownLoad && targetUrl) {
        cbkUrl = processCbkUrl(targetUrl, opts);
    }


    var universalUrl = 'https://clientmap.baidu.com/map/maplink.php?'
        + 'cburl=' + encodeURIComponent(cbkUrl)
        + '&openapi=' + encodeURIComponent(openapi);
    // window.location.href = universalUrl;
    if (isNewapp && !clicked) {
        clicked = true;
        var scheme = 'baiduwanhua://location/showMapPannel?callback=UlShowMapPannelCb';
        window.UlShowMapPannelCb = function (data) {
            clicked = false;
            var cbData = JSON.parse(data);
            // 0取消调起 1调起失败跳下载 2调起地图
            if (Number(cbData.data.status) !== 0) {
                setTimeout(() => {
                    setClipBoard(dynamicToken);
                }, 500);
                if (Number(cbData.data.status) === 1) {
                    window.location.href = 'https://itunes.apple.com/cn/app/apple-store/id452186370?pt=328057&mt=8';
                } else if (Number(cbData.data.status) === 2) {
                    window.location.href = openapi;
                } else {
                    return;
                }
            }
        };
        // window.location.href = scheme;
        iframeCallup(scheme);

    } else // return;
    {
        setTimeout(function () {
            setClipBoard(dynamicToken);
            window.location.href = universalUrl;
        }, 500);
    }
}
;