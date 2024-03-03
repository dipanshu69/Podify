export interface MapRangeOptions {
  inputValue: number;
  outputMax: number;
  outputMin: number;
  inputMax: number;
  inputMin: number;
}

export const mapRange = (options: MapRangeOptions) => {
  const {inputValue, outputMax, outputMin, inputMax, inputMin} = options;

  const result =
    ((inputValue - inputMin) / (inputMax - inputMin)) *
      (outputMax - outputMin) +
    outputMin;

  if (result === Infinity) return 0;

  return result;
};
