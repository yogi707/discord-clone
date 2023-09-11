var gcdOfStrings = function (str1, str2) {
  const minStr = str1.length > str2.length ? str2 : str1;
  const maxStr = str1.length > str2.length ? str1 : str2;

  let i = 0;
  let str = "";
  while (i < minStr.length) {
    str += minStr[i];
    let j = 0;
    while (j < maxStr.length) {
      if (str === maxstr.substring(0, str.length)) {
        j += str.length;
        continue;
      } else {
        break;
      }
    }
  }
};
