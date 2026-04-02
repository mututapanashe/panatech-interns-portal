import Button from "./Button";
import SectionHeading from "./SectionHeading";

function EmptyState({ actionLabel, description, onAction, title }) {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/80 p-6 text-center shadow-[0_20px_60px_-36px_rgba(15,23,42,0.15)]">
      <SectionHeading className="space-y-2" description={description} title={title} />
      {actionLabel && onAction && (
        <div className="mt-5">
          <Button onClick={onAction} variant="secondary">
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

export default EmptyState;
