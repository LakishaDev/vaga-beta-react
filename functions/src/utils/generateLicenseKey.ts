export function generateLicenseKey() {
  const part = () => Math.random().toString(36).substring(2, 6).toUpperCase();

  return `EVAGA-${part()}-${part()}-${part()}`;
}
