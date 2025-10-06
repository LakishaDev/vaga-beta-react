import Snackbar from "./Snackbar";

export default function SnackbarStack({ messages, removeSnackbar }) {
  return (
    <div
      className="
        fixed bottom-7 right-7 z-[120]
        flex flex-col items-end gap-1
        w-full max-w-xs pointer-events-none
        sm:right-12 sm:bottom-10
      "
      style={{
        backdropFilter: "blur(2.5px)",
        WebkitBackdropFilter: "blur(2.5px)",
      }}
    >
      {messages.map((snack, i) => (
        <div
          key={snack.id}
          className={`w-full stack-fade-in-up`}
          style={{
            animationDelay: `${i * 120}ms`,
            // z-index povećava gornje snackove
            zIndex: 120 + i,
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