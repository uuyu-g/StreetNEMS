const nem = require("nem-sdk").default;
let posts = [];

//connectorオブジェクトを作る
const getEndpoint = () => {
	const mainnet = nem.model.nodes.mainnet;

	const target_node = mainnet[Math.floor(Math.random()* (mainnet.lenght - 2)) + 1];
	console.log('target_node', target_node);

	return target_node.uri;
}

const endpoint = nem.model.objects.create("endpoint")(getEndpoint(), nem.model.nodes.websocketPort);
const address = "NCHV46TIRIV3H7V3SONZLIN2VGWMK3RMOUOVRXHO";// 投稿用アドレス
const connector = nem.com.websockets.connector.create(endpoint, address);

//ハンドラを定義してからNISに接続

//直近のトランザクションを取得 ←省略

// 承認されたトランザクションを取得
const confirmed_transaction_handler = (res) => {
	console.log("confirmed_transaction_handler", res);
	if (res.transaction.message.payload) {
		posts.unshift({
			message: nem.utils.format.hexToUtf8(res.transaction.message.payload),
			tx: 'bfcdc535283c21dd9b480d1a9a66ee2adc691edef271daa50569c7c9feea72a8',
			amount: 1,
			signature:"11bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
		})
	}
}

connector.connect().then(() => {
	console.log("Connected");
	nem.com.websockets.subscribe.account.transactions.confirmed(connector, confirmed_transaction_handler);
	nem.com.websockets.requests.account.transactions.recent(connector);
}, err => console.log("errorMessage", err));


