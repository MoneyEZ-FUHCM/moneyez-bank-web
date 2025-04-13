const CardQuestion = ({ children, title, extra, className = "" }: any) => (
  <div
    className={`overflow-hidden rounded-lg border border-gray-200 shadow-sm transition-all hover:shadow-md ${className}`}
  >
    {(title || extra) && (
      <div className="flex items-center justify-between border-b bg-gray-50 px-6 py-4">
        {title && (
          <div className="text-lg font-medium text-gray-800">{title}</div>
        )}
        {extra && <div>{extra}</div>}
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

export { CardQuestion };
