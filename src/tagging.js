/**
 * 
 * タギング
 * @param {String} address 
 * @param {String} pubKey 
 * @return {String} 例：NDSA2Q 345
 */
function tagging(address,pubKey) {
  const name = address.substr(0, 6);
  const num = parseInt(pubKey.substr(0, 2), 16);
  return `${name}${num}`;
}


module.exports = tagging;

