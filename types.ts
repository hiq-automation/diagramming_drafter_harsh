

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  context?: string; // Stores full content (e.g., with file attachments) for AI context, while content is for display
}

export type LogStatus = 'pending' | 'success' | 'error' | 'info';

export interface LogMessage {
  id: number;
  message: string;
  status: LogStatus;
}

export interface User {
  name: string;
  company_name?: string;
  auth_cookie?: string;
  uid?: string;
}

export interface UserSettings {
  systemPrompt: string;
}

export type Role = string;

export type Permission = string;

export interface AppInfo {
  id: number;
  name: string;
  createdBy: string;
  primary_domain?: string;
  base_url?: string;
  studio_app_url?: string;
}

// FIX: Add missing AppMetadata interface used by Dashboard component
export interface AppMetadata {
  name: string;
  description: string;
}

export interface PullRequest {
  id: number;
  number?: number;
  title: string;
  state: 'open' | 'closed';
  user: {
    login: string;
    avatar_url: string;
  };
  head: string | {
    ref: string;
  };
  base: string | {
    ref: string;
  };
  html_url: string;
  created_at: string;
  updated_at?: string;
  merged: boolean;
  merged_at?: string | null;
  source?: 'gitea' | 'database';
  environment?: 'non-prod' | 'prod' | 'dev';
  envName?: string;
  hasConflicts?: boolean;
}

export interface Organization {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  organizationId: number;
  createdAt?: string;
}

export interface ProjectComponent {
  id: number;
  projectId: number;
  name: string;
  title: string;
  type: 'UX' | 'API';
  description?: string;
  status?: 'Pending' | 'Active' | 'Inactive';
  createdAt?: string;
  additional_info?: {
    slug?: string;
    supported_domains?: string[];
    ai_studio_link?: string;
    github_repo?: string;
    github_owner?: string;
    hiq_repo?: string;
    unique_app_code?: string;
    [key: string]: any;
  };
}

export type RequirementType = 'Defect' | 'Feature';
export type RequirementCategory = 'User' | 'System' | 'Non-Functional';
// Updated to match backend API validation
export type RequirementStatus = 'New' | 'Open' | 'InProgress' | 'Resolved' | 'Closed';

export interface Requirement {
  id?: number;
  componentId?: number;
  type: RequirementType;
  category?: RequirementCategory;
  title: string;
  description: string;
  status: RequirementStatus;
  tempId?: string; // For frontend tracking of new items before they have a DB ID
  unique_hash?: string;
}

export interface ComponentPrompt {
  id?: number;
  componentId: number;
  title: string;
  description: string;
  type: 'System' | 'Other';
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ComponentContentItem {
  id?: number;
  componentId: number;
  textId: string;
  description: string;
  text: string;
  format: 'plain' | 'markdown';
  type: 'Title' | 'Body' | 'LinkText' | 'Heading';
  createdAt?: string;
  updatedAt?: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  assignee: string;
  assigned_date?: string;
  due_date: string;
  start_date?: string;
  close_date?: string;
  status: 'Open' | 'InProgress' | 'Closed';
  created_at?: string;
  updated_at?: string;
  additional_info?: any;
}

// Added missing LLM and Attachment types
export type ModelProvider = 'google' | 'openai';

export interface LLMConfig {
    provider: ModelProvider;
    model: string;
    apiKey?: string;
    systemInstruction?: string;
}

export interface Attachment {
    id: string;
    name: string;
    content: string;
    isProcessing: boolean;
}