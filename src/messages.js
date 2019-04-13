const nem = require("nem-sdk").default;

//connectorオブジェクトを作る
const getEndpoint = () => {
	const mainnet = nem.model.nodes.mainnet;

	const target_node = mainnet[Math.floor(Math.random()* (mainnet.lenght - 2)) + 1];
	console.log('target_node', target_node);

	return target_node.uri;
}

const endpoint = nem.model.objects.create("endpoint")(getEndpoint(), nem.model.nodes.websocketPort);
// 投稿用アドレス
const address = "NCHV46TIRIV3H7V3SONZLIN2VGWMK3RMOUOVRXHO";

const connector = nem.com.websockets.connector.create(endpoint, address);

//ハンドラを定義してからNISに接続

//直近のトランザクションを取得 ←省略

// 承認されたトランザクションを取得
const confirmed_transaction_handler = (res) => {
	console.log("confirmed_transaction_handler", res);
}

connector.connect().then(() => {
	console.log("Connected");
	nem.com.websockets.subscribe.account.transactions.confirmed(connector, confirmed_transaction_handler);
	nem.com.websockets.requests.account.transactions.recent(connector);
}, err => console.log("errorMessage", err));

nem.utils.format.hexToUtf8(res.transaction.message.payload);
