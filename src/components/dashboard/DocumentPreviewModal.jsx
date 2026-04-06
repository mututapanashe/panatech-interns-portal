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
      className="fixed inset-0 z-[70] overflow-y-auto bg-slate-950/62 backdrop-blur-md"
      onClick={onClose}
    >
      <div className="flex min-h-full items-start justify-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:items-center sm:p-4">
        <div
          className="flex w-full max-w-5xl flex-col overflow-hidden rounded-[28px] border border-slate-300/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.99)_0%,rgba(241,245,249,0.98)_100%)] shadow-[0_40px_104px_-42px_rgba(15,23,42,0.44)] ring-1 ring-slate-100/90 sm:rounded-[32px]"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between gap-4 border-b border-slate-800/80 bg-[linear-gradient(180deg,#0f172a_0%,#1e293b_100%)] px-4 py-4 sm:px-6 sm:py-5">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-300">
                {eyebrow}
              </p>
              <h2 className="mt-2 truncate text-lg text-white sm:text-xl">{fileName || title}</h2>
            </div>
            <div className="flex items-center gap-2">
              {typeof onDownload === "function" && (
                <button
                  className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/12 bg-white/10 text-slate-100 transition hover:border-sky-200/60 hover:text-sky-200"
                  onClick={onDownload}
                  type="button"
                >
                  <ArrowDownTrayIcon className="h-5 w-5" />
                </button>
              )}
              <button
                className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/12 bg-white/10 text-slate-100 transition hover:border-orange-200/60 hover:text-orange-200"
                onClick={onClose}
                type="button"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-3 sm:p-5">
            <div className="overflow-hidden rounded-[24px] border border-slate-300/80 bg-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
              <iframe
                className="h-[58dvh] w-full bg-white sm:h-[70vh]"
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
