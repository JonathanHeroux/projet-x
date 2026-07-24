const disabledStyle =
  "disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-default";

export default function Button({
  children,
  disabled,
  onClick,
  icon,
  type = "button",
  form,
}) {
  return (
    <button
      onClick={onClick}
      className={`relative bg-white gap-3 text-black cursor-pointer rounded-full w-90 py-2.5 font-semibold ${disabledStyle}`}
      disabled={disabled}
      type={type}
      form={form}
    >
      {icon && <span className="absolute left-19 text-lg">{icon}</span>}
      {children}
    </button>
  );
}
