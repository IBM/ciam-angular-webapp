import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WatsonAssistantService {
  private renderer: Renderer2;
  private isLoaded = false;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  /**
   * Loads the Watson Assistant chat widget
   * This should be called once the component is initialized
   */
  loadWatsonAssistant(): void {
    // Prevent multiple loads
    if (this.isLoaded) {
      return;
    }

    // Set the global Watson Assistant options
    (window as any).watsonAssistantChatOptions = {
      integrationID: environment.integrationID,
      region: environment.region,
      serviceInstanceID: environment.serviceInstanceID,
      onLoad: async (instance: any) => {
        await instance.render();
      },
    };

    // Create and append the script element
    const script = this.renderer.createElement('script');
    script.src = `https://web-chat.global.assistant.watson.appdomain.cloud/versions/latest/WatsonAssistantChatEntry.js`;
    script.type = 'text/javascript';

    this.renderer.appendChild(document.head, script);
    this.isLoaded = true;
  }
}
