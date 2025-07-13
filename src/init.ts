import {
  backButton,
  viewport,
  themeParams,
  miniApp,
  initData,
  expandViewport,
  mainButton,
  secondaryButton,
  $debug,
  swipeBehavior,
  init as initSDK,
  closingBehavior
} from '@telegram-apps/sdk-react';

/**
 * Initializes the application and configures its dependencies.
 */
export function init(debug: boolean): void {
  // Set @telegram-apps/sdk-react debug mode.
  $debug.set(debug);

  // Initialize special event handlers for Telegram Desktop, Android, iOS, etc.
  // Also, configure the package.
  initSDK();

  // Add Eruda if needed (for debugging in development).
  // 

  import('eruda')
    .then((lib) => lib.default.init())
    .catch(console.error);

  // Check if all required components are supported.
  if (!backButton.isSupported() || !miniApp.isSupported()) {
    throw new Error('ERR_NOT_SUPPORTED');
  }

  // Mount all components used in the project.
  backButton.mount();
  mainButton.mount();
  secondaryButton.mount();
  miniApp.mount();
  themeParams.mount();
  initData.restore();
  closingBehavior.mount();
  closingBehavior.enableConfirmation();


  // Mount and configure the viewport
  void viewport
    .mount()
    .catch((e) => {
      console.error('Something went wrong mounting the viewport', e);
    })
    .then(() => {
      // Bind the CSS variables for the viewport
      viewport.bindCssVars(); // Binds the default Telegram theme parameters
      viewport.requestFullscreen();
      
      if(viewport.bindCssVars.isAvailable()){
          viewport.requestFullscreen();
      }
                
      viewport.expand()
      swipeBehavior.disableVertical();

    });

  // Bind the theme parameters to CSS variables (colors, etc.).
  //miniApp.bindCssVars();
  themeParams.bindCssVars();

  // Expand the viewport to full screen

  expandViewport()

}
