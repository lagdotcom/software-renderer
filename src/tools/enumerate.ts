export default function enumerate(max: number, min = 0) {
  const values: number[] = [];
  for (let i = min; i < max; i++) values.push(i);
  return values;
}
