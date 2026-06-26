type ProgressBarProps = {
  current: number;
  total: number;
};

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="slide-progress" aria-label={`Slide ${current} of ${total}`}>
      <span className="progress-count">
        {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
