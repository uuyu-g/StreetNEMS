const nem = require("nem-sdk").default;
const networkId = nem.model.network.data.mainnet.id;
const Axios = require("axios");
const NEM_EPOCH = Date.UTC(2015, 2, 29, 0, 6, 25, 0);
const TRANSFER = nem.model.transactionTypes.transfer;
const MULTISIG_TRANSACTION = nem.model.transactionTypes.multisigTransaction;
//# ここを調べたいものに変える
const ADDRESS = "NCHV46TIRIV3H7V3SONZLIN2VGWMK3RMOUOVRXHO";

// transaction のデータを見やすいように加工する
class IncomingTransactionObject {
  constructor(obj) {
    this.metaId = obj.meta.id;
    this.hash = obj.meta.hash.data;
    this.type = obj.transaction.type;
    this.signer = obj.transaction.signer;

    if (this.type === TRANSFER) {
      // 送信者の PublicKey から アドレスへ変換
      this.sender = nem.model.address.toAddress(
        obj.transaction.signer,
        networkId
      );
      this.message = obj.transaction.message.payload || "";
      this.timeStamp = obj.transaction.timeStamp;
      this.amount = obj.transaction.amount;
    } else if (obj.transaction.type === MULTISIG_TRANSACTION) {
      // multisig の場合は 見る中身を変える
      const otherTrans = obj.transaction.otherTrans;
      if (otherTrans.type === TRANSFER) {
        this.sender = nem.model.address.toAddress(otherTrans.signer, networkId);
        this.message = otherTrans.message.payload || "";
        this.timeStamp = otherTrans.timeStamp;
        this.amount = otherTrans.amount;
      }
    }
  }

  view() {
    if (this.amount === undefined) {
      return;
    }
    // console.log(`${this.unixtime},${this.metaId},${this.type},${this.sender}`);
    // return `${this.unixtime},${this.metaId},${this.type},${this.sender}`;
    return {
      message: this.message,
      tx: this.hash,
      amount: this.amount,
      signer: this.signer,
      address: this.sender
    }
  }

  hyouji() {
    const obj = { sender: this.sender };
    return obj;
  }

  get unixtime() {
    const d = new Date(NEM_EPOCH + this.timeStamp * 1000);
    return d.toLocaleString();
  }

  get xemAmount() {
    return this.amount / 1000000;
  }
}

class IncomingTransaction {
  constructor() {
    this.url = `http://alice2.nem.ninja:7890/account/transfers/incoming?address=${ADDRESS}`;
    this.list = [];
  }

  fetch(metaId) {
    return Axios.get(this.generateUrl(metaId)).then(
      res => {
        let lastmetaId = null;
        res.data.data.forEach(tx => {
          const txObject = new IncomingTransactionObject(tx);
          console.log(txObject.sender);
          lastmetaId = txObject.metaId;
          this.list.push(txObject.view());
        });

        if (lastmetaId && lastmetaId !== metaId) {
          return new Promise (resolve => {
            setTimeout(() => {
              resolve(this.fetch(lastmetaId));
            }, 1000);
          }
          )}
      },
      err => {
        console.error(err);
      }
    );
  }
  generateUrl(metaId) {
    if (metaId) {
      return `${this.url}&id=${metaId}`;
    } else {
      return this.url;
    }
  }
}

// const inTx = new IncomingTransaction();
// inTx.fetch().then(() => {
//   console.log(inTx.list);
// });

// 返り値は
// {
// 	message: nem.utils.format.hexToUtf8(message),
// 	tx: d.meta.hash.data,
// 	amount: d.transaction.amount,
// 	signer: d.transaction.signer,
// 	address: address
// }
// 上記のオブジェクト

module.exports = {
  IncomingTransaction
}
