export function splitArray(array, size) {
    let retArr = [];
  
    if(array.length < size) {
      return [array];
    }
  
    while (array.length > size) {
      retArr.push(array.splice(0, size));
    }
  
    retArr.push(array);
  
    return retArr;
  }