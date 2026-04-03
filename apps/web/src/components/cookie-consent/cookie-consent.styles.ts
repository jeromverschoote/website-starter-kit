const styles = {
  wrapper: 'fixed z-[200] bottom-0 left-0 right-0 sm:left-4 sm:bottom-4 w-full sm:max-w-md duration-700',
  wrapperOpen: 'transition-[opacity,transform] translate-y-0 opacity-100 pointer-events-auto',
  wrapperClosed: 'transition-[opacity,transform] translate-y-8 opacity-0 pointer-events-none',
  card: 'dark:bg-card bg-background m-3 border border-border shadow-lg bg-white',
  grid: 'grid gap-2',
  header: 'border-b border-border h-14 flex items-center justify-between p-4',
  title: 'text-lg font-medium',
  icon: 'h-[1.2rem] w-[1.2rem]',
  body: 'p-4',
  description: 'text-sm font-normal text-start',
  footer: 'flex gap-2 p-4 py-5 border-t border-border',
  button: 'w-full',
};

export default styles;
