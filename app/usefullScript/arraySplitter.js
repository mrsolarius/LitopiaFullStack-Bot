var split = function (str,length) {
    let i=0,j,result = []
    do {
      j = str.slice(i,i+length).lastIndexOf(' ')+1
      result.push(str.slice(i,i+j-1));
    } while ((i + length < str.length) && (i += j))
    return result.concat(str.slice(i+j))
  }
  

module.exports = split;