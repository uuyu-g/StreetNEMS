const degSetting = {
	in_start: 0,
	in_end: 255,
	out_start: -20,
	out_end: 20
};

const widthSetting = {
	in_start: 0,
	in_end: 255,
	out_start: 0,
	out_end: 800
};

const hexToLimitedRange = (input, obj) => {
	const slope = (obj.out_end - obj.out_start) / (obj.in_end - obj.in_start);
	return obj.out_start + slope * (input - obj.in_start);
};

let data = {
	list: [{
			message: 'NEM',
			tx: 'bfcdc535283c21dd9b480d1a9a66ee2adc691edef271daa50569c7c9feea72a8',
			amount: 1000000,
			signature:"11bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
		},
		{
			message: 'FUDFUDFUD',
			tx: '7ba3a7328c7ea9616fe1758c5f4f7d1a333d26fb2bc1d42e0862762a42b38430',
			amount: 0,
			signature:"22bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
		},
		{
			message: 'PUMP!!!!',
			tx: 'c3cec3c3c1fffea00e4bd06dcdb1c3e5b93b73465eb6276a5cd0f89511611557',
			amount: 3900000,
			signature:"33bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
		},
		{
			message: 'SnemS!!',
			tx: '0000ff000',
			amount: 2000000,
			signature:"44bdddd123123123bbbbbbbbbbbbbbbbbb"
		}
	]
};
//NEMメッセージの取り込み
const nem = require("nem-sdk").default;

let posts = []; //取得した投稿内容を riot の tag に渡すための配列

//接続する supernode をばらけさせる
const getEndpoint = () => {
  var sn =
  "https://nemstrunk.supernode.me,https://nemstrunk2.supernode.me,https://kohkei.supernode.me,https://mttsukuba.supernode.me,https://pegatennnag.supernode.me,https://qora01.supernode.me,https://shibuya.supernode.me,https://strategic-trader-1.supernode.me,https://strategic-trader-2.supernode.me,https://thomas1.supernode.me,https://beny.supernode.me,https://aqualife1.supernode.me,https://aqualife2.supernode.me,https://aqualife3.supernode.me,https://mnbhsgwbeta.supernode.me,https://mnbhsgwgamma.supernode.me";
	var snArray = sn.split(",");

  const target_node =
    snArray[Math.floor(Math.random() * (snArray.length)) + 1];
  console.log(target_node);

  return target_node;
};

const address = "NCHV46TIRIV3H7V3SONZLIN2VGWMK3RMOUOVRXHO"; //SNEMSのアドレス
const endpoint = nem.model.objects.create("endpoint")(
  getEndpoint(),
  nem.model.nodes.websocketPort
);
const connector = nem.com.websockets.connector.create(endpoint, address);

const recent_transactions_handler = res => {
  console.log("recent_transactions_handler", res);
  res.data.map(d => {
    if (d.transaction.message.payload) {
      posts.push({
				message: nem.utils.format.hexToUtf8(d.transaction.message.payload),
        tx: d.meta.hash.data,
        amount: d.transaction.amount,
        signature: d.transaction.signature
      });
    }
  });
	data.list.push(...posts);
};

const confirmed_transaction_handler = res => {
  console.log("confirmed_transaction_handler", res);
  if (res.transaction.message.payload) {
    posts.unshift({
      message: nem.utils.format.hexToUtf8(res.transaction.message.payload),
      tx: res.meta.hash.data,
      amount: res.transaction.amount,
      signature: res.transaction.signature
    });
  }
	// riot.update("message", { posts: posts });
	data.list.unshift(...posts);
};

console.log("data:",data)

const app = new Vue({
	el: '#app',
	data: data,
	created() {
		connector.connect().then(
			() => {
				console.log("Connected");
		
				nem.com.websockets.subscribe.account.transactions.recent(
					connector,
					recent_transactions_handler
				);
				nem.com.websockets.subscribe.account.transactions.confirmed(
					connector,
					confirmed_transaction_handler
				);
		
				nem.com.websockets.requests.account.transactions.recent(connector);
			},
			err => {
				console.error(err);
			}
		);
	},
	methods: {
		style(val) {
			//位置と角度をハッシュから
			const tx = val.tx;
			const x = parseInt(tx.substr(1, 2), 16); //
			const y = parseInt(tx.substr(3, 2), 16);
			const r = parseInt(tx.substr(5, 2), 16);
			const top = hexToLimitedRange(x, widthSetting);
			const left = hexToLimitedRange(y, widthSetting);
			const deg = hexToLimitedRange(r, degSetting);

			//サイズをammountから
			const size = 20 + val.amount * 20 / 1000000 || 36;
			console.log("fontsize is ",size)

			return {
				top: top + 'px',
				left: left + 'px',
				transform: `rotate(${deg}deg)`,
				fontSize: `${size}px`
			};
		},
		graffitiStyle(list) {
			// フォントファミリー
			const signature = list.signature;
			const num1 = parseInt(signature.substr(0, 1), 16);
			const num2 = parseInt(signature.substr(1, 1), 16);
			const fontFamily = `font${num1}`;
			const fontStyle = `style${num2}`;
			return [
				fontFamily,
				fontStyle
			];
		}
	}
});