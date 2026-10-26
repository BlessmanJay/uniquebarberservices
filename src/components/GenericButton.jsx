function GenericButton({ type, id, disabled, onClick, className, children }) {
  return (
    <button
      type={type}
      id={id}
      disabled={disabled}
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  );
}

export default GenericButton;
