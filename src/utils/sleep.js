export default async function sleep(ms) {
  return await new Promise((r) => setTimeout(r, ms));
}
