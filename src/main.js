const degSetting = {
  in_start: 0,
  in_end: 255,
  out_start: -10,
  out_end: 10
};

const scaleSetting = {
  width: {
    in_start: 0,
    in_end: 255,
    out_start: 0,
    out_end: 1800
  },
  hight: {
    in_start: 0,
    in_end: 255,
    out_start: 0,
    out_end: 1100
  }
};

const hexToLimitedRange = (input, obj) => {
  const slope = (obj.out_end - obj.out_start) / (obj.in_end - obj.in_start);
  return obj.out_start + slope * (input - obj.in_start);
};

let data = {
  list: [
    {
      message: "NEM1",
      tx: "bfcdc535283c21dd9b480d1a9a66ee2adc691edef271daa50569c7c9feea72a8",
      amount: 1000000,
      signature: "11bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
    },
    {
      message: "FUDFUDFUD2",
      tx: "7ba3a7328c7ea9616fe1758c5f4f7d1a333d26fb2bc1d42e0862762a42b38430",
      amount: 0,
      signature: "22bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
    },
    {
      message: "PUMP!!!!3",
      tx: "c3cec3c3c1fffea00e4bd06dcdb1c3e5b93b73465eb6276a5cd0f89511611557",
      amount: 3900000,
      signature: "33bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
    },
    {
      message: "SnemS!!4",
      tx: "0000ff000",
      amount: 2000000,
      signature: "44bdddd123123123bbbbbbbbbbbbbbbbbb"
    },
    {
      message: "e697a5e69cace8aa9e35", //日本語
      tx: "0000ff000",
      amount: 2000000,
      signature: "44bdddd123123123bbbbbbbbbbbbbbbbbb"
    },
    {
      message: "e381b2e38289e3818ce381aa36", //ひらがな
      tx: "0000ff000",
      amount: 2000000,
      signature:
        "655d570083ae0974ac594d6b28d2603fdfd2f59e253ea2153456d80df0230fe3"
    },
    {
      message: "SnemS!!7",
      tx: "0000ff000",
      amount: 2000000,
      signature: "44bdddd123123123bbbbbbbbbbbbbbbbbb"
    },
    {
      message: "SnemS!!8",
      tx: "0000ff000",
      amount: 2000000,
      signature: "44bdddd123123123bbbbbbbbbbbbbbbbbb"
    },
    {
      message: "SnemS!!9",
      tx: "0000ff000",
      amount: 2000000,
      signature: "44bdddd123123123bbbbbbbbbbbbbbbbbb"
    },
    {
      message: "SnemS!!10",
      tx: "0000ff000",
      amount: 2000000,
      signature: "44bdddd123123123bbbbbbbbbbbbbbbbbb"
    },
    {
      message: "SnemS!!11",
      tx: "0000ff000",
      amount: 2000000,
      signature: "44bdddd123123123bbbbbbbbbbbbbbbbbb"
    },
    {
      message: "SnemS!!12",
      tx: "0000ff000",
      amount: 2000000,
      signature: "44bdddd123123123bbbbbbbbbbbbbbbbbb"
    },
    {
      message: "SnemS!!13",
      tx: "0000ff000",
      amount: 2000000,
      signature: "44bdddd123123123bbbbbbbbbbbbbbbbbb"
    },
    {
      message: "SnemS!!14",
      tx: "0000ff000",
      amount: 2000000,
      signature: "44bdddd123123123bbbbbbbbbbbbbbbbbb"
    },
    {
      message: "SnemS!!15",
      tx: "0000ff000",
      amount: 2000000,
      signature: "44bdddd123123123bbbbbbbbbbbbbbbbbb"
    },
    {
      message: "SnemS!!16",
      tx: "0000ff000",
      amount: 2000000,
      signature: "44bdddd123123123bbbbbbbbbbbbbbbbbb"
    }
  ]
};
//NEMメッセージの取り込み
const nem = require("nem-sdk").default;
const tagging = require("./tagging");

let posts = []; //取得した投稿内容を riot の tag に渡すための配列

//接続する supernode をばらけさせる
let getEndpoint = () => {
  let mainnet = nem.model.nodes.mainnet;

  // 62.75.171.41 と localhost を除いた node を取得する
  let target_node =
    mainnet[Math.floor(Math.random() * (mainnet.length - 2)) + 1];
  console.log(target_node);

  return target_node.uri;
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
    const pubkey = d.transaction.message.payload;
    const address = nem.model.address.toAddress(pubkey, 104);
    const tag = tagging(address, pubkey);
    if (pubkey) {
      posts.push({
        message: nem.utils.format.hexToUtf8(d.transaction.message.payload),
        tx: d.meta.hash.data,
        amount: d.transaction.amount,
        signature: d.transaction.signature,
        address: address,
        tag: tag
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
  data.list.unshift(...posts);
};

console.log("data:", data);

const app = new Vue({
  el: "#app",
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
      const x = parseInt(tx.substr(10, 2), 16); //
      const y = parseInt(tx.substr(12, 2), 16);
      const r = parseInt(tx.substr(14, 2), 16);
      const top = hexToLimitedRange(x, scaleSetting.hight);
      const left = hexToLimitedRange(y, scaleSetting.width);
      const deg = hexToLimitedRange(r, degSetting);
			console.log(x,y);
      //サイズをammountから
      const size = 20 + (val.amount * 20) / 1000000;

      return {
        top: top + "px",
        left: left + "px",
        transform: `rotate(${deg}deg)`,
        fontSize: `${size}px`
      };
    },
    graffitiStyle(list) {
      //

      // フォントファミリー
      const signature = list.signature;
      const num1 = parseInt(signature.substr(0, 1), 16);
      const num2 = parseInt(signature.substr(1, 1), 16);
      const fontFamily = `font${num1}`;
      const fontStyle = `style${num2}`;
      return [fontFamily, fontStyle];
    }
  }
});
