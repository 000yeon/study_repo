function intToRoman(num: number): string {
  // 로마 숫자와 그 값 매핑
  let values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  let symbols = [ "M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I" ];

  let result = '';

  for ( let i = 0; i < values.length; i++) {
      while ( num >= values[i] ) {
          num -= values[i]
          result = result + symbols[i];
      }
  }

  return result;
};