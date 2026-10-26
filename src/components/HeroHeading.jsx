function HeroHeading({ children, className }) {
  return (
    <div>
      <p className={`font-heading max-w-sm mb-4 text-slate-500 ${className}`}>
        {children}
      </p>
    </div>
  );
}

export default HeroHeading;
