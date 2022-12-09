interface Number {
  between(min: number, max: number): boolean;
}

Number.prototype.between = function(min: number, max: number): boolean {
  // var min = Math.min.apply(Math, [min, max]),
  //   max = Math.max.apply(Math, [min, max]);
  return this >= min && this <= max;
};
