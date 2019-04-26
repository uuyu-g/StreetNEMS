let posts = []; //取得した投稿内容を riot の tag に渡すための配列
let data = {
  list: [
    {
      message: "",
      tx: "",
      amount: 0,
      signer: "",
      address: ""
    }
  ],
  scaleSetting: {
    width: {
      in: { start: 0, end: 255 },
      out: { start: 0, end: 1800 }
    },
    hight: {
      in: { start: 0, end: 255 },
      out: { start: 0, end: 1100 }
    },
    scaleX: {
      in: { start: 0, end: 15 },
      out: { start: 0.8, end: 1.5 }
    },
    deg: {
      in: { start: 0, end: 255 },
      out: { start: -5, end: 5 }
    }
  }
};
const hexToLimitedRange = (input, setting) => {
  const slope =
    (setting.out.end - setting.out.start) / (setting.in.end - setting.in.start);
  return setting.out.start + slope * (input - setting.in.start);
};

//NEMメッセージの取り込み
const nem = require("nem-sdk").default;

const address = "NCHV46TIRIV3H7V3SONZLIN2VGWMK3RMOUOVRXHO"; //SNEMSのアドレス

const recent_transactions_handler = res => {
  console.log("recent_transactions_handler", res);
  res.data.map(d => {
    const message = d.transaction.message.payload;
    const pubKey = d.transaction.signer;
    const address = nem.model.address.toAddress(pubKey, 104);
    if (message) {
      posts.push({
        message: nem.utils.format.hexToUtf8(message),
        tx: d.meta.hash.data,
        amount: d.transaction.amount,
        signer: d.transaction.signer,
        address: address
      });
    }
  });
  data.list.push(...posts);
};

const confirmed_transaction_handler = res => {
  console.log("confirmed_transaction_handler", res);
  const message = res.transaction.message.payload;
  const pubKey = res.transaction.signer;
  const address = nem.model.address.toAddress(pubKey, 104);
  if (message) {
    posts.unshift({
      message: nem.utils.format.hexToUtf8(message),
      tx: res.meta.hash.data,
      amount: res.transaction.amount,
      signer: res.transaction.signer,
      address: address
    });
  }
  data.list.unshift(...posts);
};

const app = new Vue({
  el: "#app",
  data: data,
  created() {
    function connect() {
      const getEndpoint = () => {
        const mainnet = nem.model.nodes.mainnet;

        // 62.75.171.41 と localhost を除いた node を取得する
        const target_node =
          mainnet[Math.floor(Math.random() * (mainnet.length - 2)) + 1];
        console.log(target_node);

        return target_node.uri;
      };
      const endpoint = nem.model.objects.create("endpoint")(
        getEndpoint(),
        nem.model.nodes.websocketPort
      );
      const connector = nem.com.websockets.connector.create(endpoint, address);
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
          connect();
        }
      );
    }
    connect();
  },
  methods: {
    style(list) {
      //位置と角度をハッシュから
      const tx = list.tx;
      const x = parseInt(tx.substr(10, 2), 16);
      const y = parseInt(tx.substr(12, 2), 16);
      const r = parseInt(tx.substr(14, 2), 16);
      const top = hexToLimitedRange(x, this.scaleSetting.hight);
      const left = hexToLimitedRange(y, this.scaleSetting.width);
      const deg = hexToLimitedRange(r, this.scaleSetting.deg);
      //サイズをammountから
      const size = 20 + (list.amount * 20) / 1000000;

      return {
        top: top + "px",
        left: left + "px",
        transform: `rotate(${deg}deg)`,
        fontSize: `${size}px`
      };
    },
    graffitiStyle(list) {
      //
      const tx = list.tx;
      const num1 = parseInt(tx.substr(0, 1), 16);
      const num2 = parseInt(tx.substr(1, 1), 16);
      const fontFamily = `font${num1}`;
      const fontStyle = `style${num2}`;
      return [fontFamily, fontStyle];
    },
    taggingStyle(list) {
      /**
       *  送信者に書体、長体、改行するか否かを紐づける
       *  スタイルを返す
       * */
      const taggingFont = [
        "BRINGTHANOIZE",
        "DonGraffiti",
        "Sadoc Wild",
        "SedgwickAveDisplay-Regular",
        "Tag Hand Graffiti",
        "Sprayerz",
        "adrip1",
        "throwupz",
        "street soul",
        "BRINGTHANOIZE",
        "DonGraffiti",
        "Sadoc Wild",
        "SedgwickAveDisplay-Regular",
        "Tag Hand Graffiti",
        "adrip1",
        "street soul",
        "throwupz",
        "Sprayerz"
      ];
      const signer = list.signer;
      const num1 = parseInt(signer.substr(0, 1), 16);
      const num2 = parseInt(signer.substr(1, 1), 16);
      const num3 = hexToLimitedRange(num2, this.scaleSetting.scaleX);
      return {
        fontFamily: taggingFont[num1],
        transform: `scaleX(${num3})`
      };
    },
    kaigyou(list) {
      /**
       * 改行するかどうかを判定
       * 送信者から取得
       * 改行パターンは4パターン 0,1,2,3
       * @param タギングのテキスト
       * @return 改行したテキスト
       */
      const pubKey = list.signer;
      const address = list.address;
      const flag = parseInt(pubKey.substr(2, 1), 16);
      const tagNameArray = address.substr(1, 4).split(""); // => ["D","S","A","2"]
      // 公開鍵から改行パターンを生成
      let tagName = "";
      if (flag < 4) {
        // 改行０
        tagName = tagNameArray.join("");
      } else if (flag < 9) {
        // 改行１
        tagNameArray.push("\n");
        tagName = tagNameArray.join("");
      } else if (flag < 14) {
        // 改行２
        tagNameArray.splice(2, 0, "\n");
        tagNameArray.push("\n");
        tagName = tagNameArray.join("");
      } else {
        // 改行３
        tagNameArray.splice(3, 0, "\n");
        tagNameArray.splice(1, 0, "\n");
        tagNameArray.push("\n");
        tagName = tagNameArray.join("");
      }
      const tagNum = parseInt(pubKey.substr(0, 2), 16);
      return `${tagName}${tagNum}`;
    }
  }
});
