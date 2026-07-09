function solution(nums) {
  const PhoneCatMonSpieces = new Set(nums).size;
  const picks = nums.length / 2;
  
  return Math.min(PhoneCatMonSpieces, picks);
}