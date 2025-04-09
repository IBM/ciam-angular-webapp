import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { WatsonAssistantService } from './_services/watson-assistant.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'tcs-angular-app';
  loggedInUser = localStorage.getItem('login_token');
  dropdownActive = false;
  showUserIcon = true; // Default to true

  constructor(
    private router: Router,
    private watsonAssistantService: WatsonAssistantService
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        // Hide icon on the register page (root path '/')
        this.showUserIcon = event.urlAfterRedirects !== '/';
        // Close dropdown on navigation
        this.dropdownActive = false;
      });
    // Load Watson Assistant chat widget
    this.watsonAssistantService.loadWatsonAssistant();
  }

  openDropdown() {
    this.dropdownActive = !this.dropdownActive;
  }

  logoutUser() {
    this.dropdownActive = !this.dropdownActive;
    localStorage.clear();
    window.open(
      `${environment.baseUrl}/idaas/mtfim/sps/idaas/logout?themeId=d2ca09b4-06e6-457d-89cf-357f5553ee62`,
      '_self'
    );
    this.router.navigateByUrl('/');
  }

  redirectToProfile() {
    this.dropdownActive = !this.dropdownActive;
    this.router.navigateByUrl('/profile');
  }
}
