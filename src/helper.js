exports.isSupported = function(str) {
  if (!str.match(/[^ -~\u30a1-\u30f6]/)) {
    return true;
  }
  return false;
}

exports.isKatakanaStyle = function(str) {
  if (
    !str.match(/[^\u30a1-\u30f6\d!"#$%&'()\*\+\-\.,\/:;<=>?@\[\\\]^_`{|}~ ]/g)
  ) {
    return true;
  }
  return false;
}

exports.select = function(str) {
  if (exports.isSupported(str)) {
    if (exports.isKatakanaStyle(str)) {
      return 'kanaStyle';
    } else {
      return 'alphabetStyle';
    }
  }
};