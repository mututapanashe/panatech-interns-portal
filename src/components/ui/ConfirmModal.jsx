import Button from "./Button";

function ConfirmModal({
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isOpen,
  isProcessing = false,
  onCancel,
  onConfirm,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[80] overflow-y-auto bg-slate-950/60 backdrop-blur-md"
      onClick={onCancel}
    >
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="w-full max-w-md overflow-hidden rounded-[28px] border border-slate-200/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.99)_0%,rgba(248,250,252,0.98)_100%)] shadow-[0_36px_96px_-44px_rgba(15,23,42,0.42)] ring-1 ring-white/70"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="border-b border-slate-200 bg-white/80 px-5 py-5 backdrop-blur">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-500">
              Confirm Action
            </p>
            <h2 className="mt-2 text-xl leading-tight text-slate-950">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{message}</p>
          </div>

          <div className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:justify-end">
            <Button
              disabled={isProcessing}
              fullWidth
              onClick={onCancel}
              variant="secondary"
            >
              {cancelLabel}
            </Button>
            <Button
              disabled={isProcessing}
              fullWidth
              onClick={onConfirm}
              variant="dark"
            >
              {isProcessing ? "Logging out..." : confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
