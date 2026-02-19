// functions/_middleware.js
// Privremeno: potpuno isključen SSR middleware (CSR-only deploy)

export const config = {
  compatibility_flags: ["nodejs_compat"],
};

export async function onRequest(context) {
  return context.next();
}
