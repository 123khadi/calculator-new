function delay(ms, value) {
  return new Promise(res => setTimeout(() => res(value), ms));
}
async function fetchData() {
  const step1 = await delay(150, 'step1');
  const step2 = await delay(100, 42);
  return step2 * 2;
}
fetchData();