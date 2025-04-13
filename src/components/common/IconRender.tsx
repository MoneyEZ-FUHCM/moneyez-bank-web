export const renderIcon = (iconName: string, fontSize: number = 24) => {
  const formattedIconName = iconName.replace(/-/g, "_");
  return (
    <span className="material-symbols-rounded" style={{ fontSize: fontSize }}>
      {formattedIconName}
    </span>
  );
};