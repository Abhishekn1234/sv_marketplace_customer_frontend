// navigationService.ts
let navigator: null | ((path: string) => void) = null;

export const setNavigator = (nav: (path: string) => void) => {
  navigator = nav;
};

export const navigateTo = (path: string) => {
  navigator?.(path);
};