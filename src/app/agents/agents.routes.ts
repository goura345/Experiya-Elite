import { Routes } from '@angular/router';

import { AgentListComponent } from './agent-list';
import { AddEditAgentComponent } from './agent';

export const AGENT_ROUTES: Routes = [
    { path: '', component: AgentListComponent },
    { path: 'add', component: AddEditAgentComponent },
    { path: 'edit/:id', component: AddEditAgentComponent }
];