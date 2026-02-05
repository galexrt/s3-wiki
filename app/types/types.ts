export const storageProtocols = ['S3', 'SFTP', 'Swift', 'FTP', 'FTPS', 'SCP', 'Samba', 'rsync', 'Borg', 'WebDAV'] as const;

export type ProviderPlan = {
  providerName: string;
  providerUrl: string;
  protocols: string[];

  name: string;

	baseCost: {
		currency?: string;
		value: number;
		interval?: number;
		vat?: boolean;
	} | Array<{
		currency?: string;
		value: number;
		interval?: number;
		vat?: boolean;
	}>;
	storage: {
		included: number;
		more?: {
			cost: {
				value: number;
				currency?: string;
				interval?: number;
				vat?: boolean;
			};
			per: number;
		};
	};
	trafficAll?: {
		included: number;
	};
	trafficEgress?: {
		included: number;
		includedStorageMultiplier?: number;
		more?: {
			cost: {
				value: number;
				currency?: string;
			};
			per: number;
		};
	};
	trafficIngress?: {
		included: number;
	};
};
