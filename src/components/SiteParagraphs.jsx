function SiteParagraphs({ children, className }) {
  return (
    <div>
      <p className={`text-lg mb-6 font-body ${className}`}>{children}</p>
    </div>
  );
}

export default SiteParagraphs;
