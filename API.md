### 微信web开发者工具
https://mp.weixin.qq.com/debug/wxadoc/dev/devtools/download.html?t=201715

### 父母堂
api/parentHall/courses?pageNum=1&pageSize=10

### 加入成长营

```
POST /api/pay/payInfo/joinClub
openid=&clubId=
```

### 购买课程

```
POST /api/pay/payInfo/buyCourse
openid=&courseId=
```

### sdkapi

```
/api/wx/config?url=
```


```
<script>
$.post('/api/wx/config', {'url':location.href}).done(function( res ) {
	var data = res.data;
	wx.config({
		debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		appId: data.appId, // 必填，公众号的唯一标识
		timestamp: data.timestamp, // 必填，生成签名的时间戳
		nonceStr: data.nonceStr, // 必填，生成签名的随机串
		signature: data.signature,// 必填，签名，见附录1
		jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
	});
});

wx.ready(function(){
});

wx.error(function(res){
});

$('#joinClub').click(function(){
	$.post('/api/pay/payInfo/joinClub', {'clubId':1}).done(function( res ) {
		pay(res);
	}).fail(function (res) {
        alert(JSON.stringify(res));
    });
});

$('#buyCourse').click(function(){
	$.post('/api/pay/payInfo/buyCourse', {'courseId':1}).done(function( res ) {
		pay(res);
	}).fail(function (res) {
        alert(JSON.stringify(res));
    });
});

function pay(res) {
	var data = res.data;
	wx.chooseWXPay({
		timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
		nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
		package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
		signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
		paySign: data.paySign, // 支付签名
		success: function (res) {
			alert(JSON.stringify(res));
		}
	});
}
</script>
```