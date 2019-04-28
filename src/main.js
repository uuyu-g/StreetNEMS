const income = require("./incomming");

let list = [
  {
    message: "",
    tx: "",
    amount: 0,
    signer: "",
    address: ""
  }
];

const scaleSetting = {
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
};

const mainnetList =  [
"163.44.170.40",
"153.122.13.96",
"133.130.91.240",
"45.76.184.50",
"183.181.38.140",
"beny.supernode.me",
"160.16.201.189",
"118.27.16.176",
"54.255.196.128",
"reach.supernode.me",
"199.233.237.83",
"172.82.183.27",
"nemstrunk2.supernode.me",
"103.27.76.170",
"150.95.147.85",
"153.126.188.239",
"shibuya.supernode.me",
"45.124.66.70",
"nemlovely4.supernode.me",
"52.78.229.61",
"153.126.157.53",
"45.124.65.166",
"88.86.222.147",
"160.16.126.235",
"owl.supernode.me",
"45.124.65.125",
"103.207.68.57",
"pegatennnag.supernode.me",
"207.148.99.87",
"157.7.131.206",
"150.95.128.62",
"153.122.13.90",
"128.199.244.45",
"210.16.120.204",
"153.122.86.21",
"nemlovely5.supernode.me",
"45.77.248.215",
"163.44.168.183",
"103.207.68.56",
"160.16.147.251",
"160.16.76.122",
"157.7.135.123",
"188.166.235.219",
"153.122.60.153",
"157.7.135.224",
"45.32.229.163",
"153.126.160.251",
"103.192.177.252",
"153.122.13.94",
"47.75.223.145",
"sn1.tamami-foundation.org",
"163.44.175.223",
"133.167.83.62",
"150.95.136.134",
"153.122.115.170",
"snnode.supernode.me",
"133.167.106.40",
"45.33.105.19",
"52.42.99.254",
"153.122.85.149",
"13.76.243.137"
];

const hexToLimitedRange = (input, setting) => {
  const slope =
    (setting.out.end - setting.out.start) / (setting.in.end - setting.in.start);
  return setting.out.start + slope * (input - setting.in.start);
};

//NEMメッセージの取り込み

const app = new Vue({
  el: "#app",
  data: {
    list: list,
    scaleSetting: scaleSetting,
    loading: true
  },

  created() {
    const getEndpoint = () => {
      const mainnet = mainnetList;
      // 62.75.171.41 と localhost を除いた node を取得する
      const target_node =
        mainnet[Math.floor(Math.random() * (mainnet.length - 2)) + 1];
      console.log(`http://${target_node}`);
      return `http://${target_node}`;
    };
    const inTx = new income.IncomingTransaction(getEndpoint());
    inTx.fetch(list).then(() => {
      this.loading = false;
    });
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
        "Sadoc_Wild",
        "throwupz",
        "SedgwickAveDisplay-Regular",
        "Tag_Hand_Graffiti",
        "adrip1",
        "throwupz",
        "street_soul",
        "BRINGTHANOIZE",
        "DonGraffiti",
        "Sadoc_Wild",
        "SedgwickAveDisplay-Regular",
        "Tag_Hand_Graffiti",
        "adrip1",
        "street_soul",
        "throwupz",
      ];
      const signer = list.signer;
      const xemAmount = list.amount / 1000000
      const num1 = parseInt(signer.substr(0, 1), 16);
      const num2 = parseInt(signer.substr(1, 1), 16);
      const num3 = hexToLimitedRange(num2, this.scaleSetting.scaleX);
      const size = xemAmount < 46 ? xemAmount * 5 + 70 : 300;
      return {
        fontFamily: taggingFont[num1],
        transform: `scaleX(${num3})`,
        fontSize: `${size}px`
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
