export interface WebhookConfig {
  accountNumber: string;
  accountHolder: string;
  url: string;
  type: number;
  secret: string;
  lastTriggeredAt: string | null;
  lastFailureAt: string | null;
  failureCount: number;
  isEnabled: boolean;
  maxRetries: number;
  retryIntervalSeconds: number;
  contentType: string;
  accountId: string;
  account: any | null;
  id: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}
