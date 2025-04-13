const BadgeQuestionCustom = ({ count, className = "" }: any) => {
  return (
    <span
      className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-white ${className}`}
    >
      {count}
    </span>
  );
};

export { BadgeQuestionCustom };
