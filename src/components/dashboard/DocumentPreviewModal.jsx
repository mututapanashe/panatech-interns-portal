import { ArrowDownTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";

function DocumentPreviewModal({
  title,
  fileName,
  url,
  isOpen,
  onClose,
  onDownload,
  eyebrow = "Document Preview",
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[70] overflow-y-auto bg-slate-950/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="flex min-h-full items-start justify-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:items-center sm:p-4">
        <div
          className="flex w-full max-w-5xl flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_32px_90px_-42px_rgba(15,23,42,0.38)] sm:rounded-[32px]"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-500">
                {eyebrow}
              </p>
              <h2 className="mt-2 truncate text-lg text-slate-950 sm:text-xl">{fileName || title}</h2>
            </div>
            <div className="flex items-center gap-2">
              {typeof onDownload === "function" && (
                <button
                  className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-sky-200 hover:text-sky-600"
                  onClick={onDownload}
                  type="button"
                >
                  <ArrowDownTrayIcon className="h-5 w-5" />
                </button>
              )}
              <button
                className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-orange-200 hover:text-orange-600"
                onClick={onClose}
                type="button"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50">
              <iframe
                className="h-[55dvh] w-full bg-white sm:h-[68vh]"
                src={url}
                title={title}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentPreviewModal;
