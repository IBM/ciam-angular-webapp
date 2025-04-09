import { Component, OnInit } from '@angular/core';

import { UserService } from '../_services/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService

interface Project {
  projectId: string;
  projectName: string;
  projectDescription: string;
  projectOwner: string;
  status: 'Active' | 'Completed' | 'On Hold';
  lastUpdated: string;
}

interface Activity {
  id: number;
  type: 'comment' | 'update' | 'milestone';
  description: string;
  timestamp: string;
  user: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService // Inject ToastrService
  ) {}
  userData: any;
  // Dummy project data
  statsData: Project[] = [
    {
      projectId: 'P001',
      projectName: 'Website Redesign',
      projectDescription: 'Complete overhaul of the company website.',
      projectOwner: 'Alice B.',
      status: 'Active',
      lastUpdated: '2025-08-03',
    },
    {
      projectId: 'P002',
      projectName: 'Mobile App Development',
      projectDescription: 'Develop a new cross-platform mobile app.',
      projectOwner: 'Bob C.',
      status: 'Active',
      lastUpdated: '2025-08-04',
    },
    {
      projectId: 'P003',
      projectName: 'Marketing Campaign Q3',
      projectDescription: 'Plan and execute the Q3 marketing strategy.',
      projectOwner: 'Charlie D.',
      status: 'Completed',
      lastUpdated: '2025-07-28',
    },
    {
      projectId: 'P004',
      projectName: 'Infrastructure Upgrade',
      projectDescription: 'Migrate servers to the new cloud platform.',
      projectOwner: 'David E.',
      status: 'On Hold',
      lastUpdated: '2025-06-15',
    },
    {
      projectId: 'P005',
      projectName: 'Customer Portal',
      projectDescription: 'Build a self-service portal for customers.',
      projectOwner: 'Eve F.',
      status: 'Active',
      lastUpdated: '2025-08-01',
    },
  ];

  // Dummy activity data
  activityFeed: Activity[] = [
    {
      id: 1,
      type: 'comment',
      description: 'Commented on P001 task "Homepage Mockup"',
      timestamp: '2 hours ago',
      user: 'Alice B.',
    },
    {
      id: 2,
      type: 'update',
      description: 'Updated status for P002 to "In Progress"',
      timestamp: '5 hours ago',
      user: 'Bob C.',
    },
    {
      id: 3,
      type: 'milestone',
      description: 'Milestone "Phase 1 Complete" reached for P005',
      timestamp: '1 day ago',
      user: 'Eve F.',
    },
    {
      id: 4,
      type: 'comment',
      description: 'Replied to feedback on P001',
      timestamp: '2 days ago',
      user: 'Alice B.',
    },
  ];

  selectedProject: Project | null = null;
  loading = false; // Keep loading flag if needed for future async ops
  header = [
    {
      config: 'Project ID',
    },
    {
      config: 'Project Name',
    },
    {
      config: 'Project Desc',
    },
    { config: 'Project Owner' }, // Corrected casing
    { config: 'Status' },
    { config: 'Last Updated' },
  ];

  async ngOnInit() {
    let token = localStorage.getItem('login_token') || '';
    let tokenDetails = JSON.parse(token);
    const response = await this.userService.getUserData(
      tokenDetails.access_token
    );

    if ((response as any).status == 200) {
      this.userData = (response as any).data;
    } else if ((response as any).response.status === 401) {
      localStorage.removeItem('login_token');
      this.router.navigateByUrl('/');
    }
    this.userService.getStats().subscribe(
      (data: any) => {
        this.statsData = data;
      },
      (error) => {
        this.loading = false;
        error.error.errMessage
          ? this.toastr.error(error.error.errMessage)
          : null; // Use ToastrService for error
      }
    );
  }

  // Method to handle project selection
  selectProject(project: Project) {
    this.selectedProject = project;
    console.log('Selected Project:', this.selectedProject);
    // Here you could trigger other actions, like showing project details elsewhere
  }

  // Optional: Method to load data from a local JSON file
  // async loadDummyDataFromJson() {
  //   try {
  //     const data = await import('../../assets/dummy-dashboard-data.json'); // Adjust path as needed
  //     this.statsData = data.projects;
  //     this.activityFeed = data.activity;
  //     this.userData = data.user;
  //   } catch (error) {
  //     console.error('Error loading dummy data:', error);
  //     // Handle error, maybe set default dummy data
  //   }
  // }

  // Method to get CSS class based on project status
  getStatusClass(status: 'Active' | 'Completed' | 'On Hold'): string {
    switch (status) {
      case 'Active':
        return 'badge-success';
      case 'Completed':
        return 'badge-info';
      case 'On Hold':
        return 'badge-warning';
      default:
        return 'badge-secondary';
    }
  }

  // Method to get icon class based on activity type
  getActivityIcon(type: 'comment' | 'update' | 'milestone'): string {
    switch (type) {
      case 'comment':
        return 'bi-chat-dots-fill'; // Bootstrap Icons class
      case 'update':
        return 'bi-pencil-square'; // Bootstrap Icons class
      case 'milestone':
        return 'bi-flag-fill'; // Bootstrap Icons class
      default:
        return 'bi-info-circle-fill'; // Default icon
    }
  }
}
