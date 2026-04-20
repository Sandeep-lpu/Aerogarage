import { useRouter } from "./routerStore";

export default function Link({ to, className = "", children, onClick, ...props }) {
  const { navigate } = useRouter();

  return (
    <a
      href={to}
      className={className}
      onClick={(event) => {
        event.preventDefault();
        if (onClick) onClick(event);
        navigate(to);
      }}
      {...props}
    >
      {children}
    </a>
  );
}
