import { useNavigate } from "react-router";

function ActionButton({
  children = "Back to Home",
  type = "button",
  onClick,
  className = "",
  to = "/",
}) {
  const navigate = useNavigate();

  function handleClick(event) {
    onClick?.(event);

    if (!event.defaultPrevented) {
      navigate(to);
    }
  }

  return (
    <button
      type={type}
      onClick={handleClick}
      className={`mt-6 cursor-pointer w-fit h-11 bg-gray-200 border border-slate-400 px-4 rounded-lg text-sm sm:text-lg font-semibold hover:bg-slate-500 hover:text-white transition ${className}`}
    >
      {children}
    </button>
  );
}

export default ActionButton;
