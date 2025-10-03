import Snackbar from "./Snackbar";

export default function SnackbarStack({ messages, removeSnackbar }) {
  return (
    <div
      className="
        fixed bottom-7 right-7 z-[120]
        flex flex-col items-end gap-3
        w-full max-w-xs pointer-events-none
        sm:right-12 sm:bottom-10
        "
      style={{
        // glass/blur efekat iza snackova
        backdropFilter: "blur(2.5px)",
        WebkitBackdropFilter: "blur(2.5px)",
      }}
    >
      {messages.map((snack, i) => (
        <div
          key={snack.id}
          className="w-full animate-in fade-in"
          style={{
            transitionDelay: `${i * 100}ms`, // animacija stekovanja, svaka kasni malo
          }}
        >
          <Snackbar
            message={snack.message}
            show={snack.show}
            id={snack.id}
            onClose={removeSnackbar}
            type={snack.type || "info"}
          />
        </div>
      ))}
    </div>
  );
}
