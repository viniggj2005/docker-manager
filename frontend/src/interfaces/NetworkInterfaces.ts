
export interface NetworkItem {
  Name: string;
  Id: string;
  Created?: string; 
  Scope?: string;
  Driver?: string;
  EnableIPv4?: boolean;
  EnableIPv6?: boolean;

  IPAM?: {
    Driver: string;
    Options: Record<string, string> | null;
    Config: Array<{
      Subnet: string;
      Gateway: string;
    }> | null;
  };

  Internal?: boolean;
  Attachable?: boolean;
  Ingress?: boolean;

  ConfigFrom?: {
    Network: string;
  };

  ConfigOnly?: boolean;
  Containers?: Record<string, unknown>;
  Options?: Record<string, string>;
  Labels?: Record<string, string>;
}