function AmberTexts({ children, className }) {
  return (
    <div>
      <p className={`text-amber-600 mb-4 font-body ${className}`}>{children}</p>
    </div>
  );
}

export default AmberTexts;
