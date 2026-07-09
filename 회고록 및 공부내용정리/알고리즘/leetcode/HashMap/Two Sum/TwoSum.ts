function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();

  for( let i = 0; i < nums.length; i++) {
      const otherNum = target - nums[i];

      if(map.has(otherNum)) {
          return [map.get(otherNum)!, i];
      }

    map.set(nums[i], i);
  }

  return []

};