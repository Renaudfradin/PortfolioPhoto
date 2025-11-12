type Props = {
  children?: string | JSX.Element;
  title: string;
  subtitle: string;
  subtitle2?: string;
};

export async function Header({
  title,
  subtitle,
  subtitle2,
  children
}: Props) {
  return (
    <>
      <div
        className={`flex flex-col items-center justify-between ${
          children ? "md:px-24 md:pt-24 md:pb-10" : "md:p-24"
        } h-1/2`}
      >
        <div className="relative isolate px-6 pt-24 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight py-4 border-b mb-5 sm:text-6xl">
              {title}
            </h1>
            <p className="text-xl py-2 text-muted-foreground leading-10">
              {subtitle}
            </p>
            {subtitle2 && (
              <p className="text-xl py-2 text-muted-foreground leading-10">
                {subtitle2}
              </p>
            )}
          </div>
        </div>
      </div>
      {children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 mt-10 animate-bounce opacity-70 text-center mx-auto"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 17.25L12 21m0 0l-3.75-3.75M12 21V3"
        />
      </svg>
    </>
  );
}
