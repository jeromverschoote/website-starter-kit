const styles = {
  container: '',

  list: 'grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8',

  viewer: {
    container:
      'fixed left-0 top-0 right-0 bottom-0 bg-white/80 dark:bg-black/80 z-50 duration-300',
    content: '',
    navigation: {
      container: 'w-full h-screen p-4 sm:p-8 h-screen fixed',

      head: 'w-full flex flex-row items-center justify-between',
      body: 'w-full h-full flex flex-row items-center justify-between',

      content: '  dark:text-white text-sm',
      alt: 'font-semibold',
      date: 'font-light',
    },

    button:
      'z-50 aspect-square w-12 rounded-full flex items-center justify-center cursor-pointer bg-white text-black',
  },

  images: {
    container: 'grid grid-cols-2 gap-6',
    item: 'relative aspect-video w-full group overflow cursor-pointer',
    image:
      'object-cover group-hover:scale-105 transition-all duration-300 cursor-pointer',
  },
};

export default styles;
