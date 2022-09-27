/* eslint-disable */
export function ExampleIcon(props: { className?: string; width?: number; height?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      dangerouslySetInnerHTML={{
        __html: `
    <path d="M4 19L19 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>

`,
      }}
    />
  );
}
