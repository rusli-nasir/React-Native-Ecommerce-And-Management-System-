import Realm from 'realm';

//List name of all required schemas
export const CUSTOMERS_SCHEMA = 'Customers';
export const SALES_SCHEMA = 'Sales';
export const PRODUCTS_SCHEMA = 'Products';
export const LAST_CUSTOMER_SCHEMA = 'Last_customer';
export const LAST_SALES_SCHEMA = 'Last_sales';
export const LAST_PRODUCT_SCHEMA = 'Last_Product';
export const PENDING_CUSTOMERS_SCHEMA = 'Pending_customers';
export const PENDING_SALES_SCHEMA = 'pending_sales';
export const SETTINGS_SCHEMA = 'Settings';
export const SALES_CHANELS_SCHEMA = 'Sales_chanels';
export const CUSTOMER_TYPES_SCHEMA = 'Customer_types';
export const PRODUCT_MRPS_SCHEMA = 'Product_mrps';
export const REMOTE__RECEIPTS_SCHEMA = 'Remote_receipts';
export const REMINDER_DATA_SCHEMA = 'Reminder_data';

//Create models for all schemas

export const customerSchema = {
	name: CUSTOMERS_SCHEMA,
	primaryKey: 'customerId',
	properties: {
		customerId: 'int',
		created_at: 'date',
		updated_at: 'date',
		active: 'bool',
		address: 'string',
		name: 'string',
		customerTypeId: 'int',
		salesChannelId: 'int',
		gpsCoordinates: 'string',
		siteId: 'int',
		phoneNumber: 'string',
		dueAmount: 'double',
		reminder_date: 'date',
		frequency: 'int'
	}
};

export const productSchema = {
	name: PRODUCTS_SCHEMA,
	primaryKey: 'productId',
	properties: {
		productId: 'int',
		updated_at: 'date',
		active: 'bool',
		base64encodedImage: 'string',
		categoryId: 'int',
		description: 'string',
		maximumQuantity: 'int',
		minimumQuantity: 'int',
		priceAmount: 'int',
		priceCurrency: 'string',
		sku: 'string',
		unitPerProduct: 'float',
		unitMeasure: 'string',
		cogsAmount: 'double'
	}
};

export const saleSchema = {
	name: SALES_SCHEMA,
	primaryKey: 'id',
	properties: {
		id: 'string',
		created_at: 'date',
		updated_at: 'date',
		amountCash: 'int',
		amountLoan: 'int',
		amountMobile: 'int',
		siteId: 'int',
		paymentType: 'string',
		salesChannelId: 'int',
		customerTypeId: 'string',
		products: 'int',
		minimumQuantity: 'int',
		priceAmount: 'int',
		priceCurrency: 'string',
		sku: 'string',
		unitPerProduct: 'float',
		unitMeasure: 'string',
		cogsAmount: 'double'
	}
};

export const settingsSchema = {
	name: SETTINGS_SCHEMA,
	primaryKey: 'id',
	properties: {
		id: 'int',
		semaUrl: 'string',
		site: 'string',
		user: 'string',
		password: 'string',
		language: 'string',
		loginSync: 'bool',
		token: 'int',
		siteId: 'int'
	}
};

export const productMrpSchema = {
	name: PRODUCT_MRPS_SCHEMA,
	primaryKey: 'id',
	properties: {
		id: 'string',
		siteId: 'int',
		productId: 'int',
		salesChannelId: 'int',
		priceAmount: 'double',
		currencyCode: 'string',
		cogsAmount: 'double'
	}
};

export const salesChanelSchema = {
	name: SALES_CHANELS_SCHEMA,
	primaryKey: 'id',
	properties: {
		id: 'int',
		name: 'string',
		description: 'string'
	}
};

export const customerTypesSchema = {
	name: CUSTOMER_TYPES_SCHEMA,
	primaryKey: 'id',
	properties: {
		id: 'int',
		name: 'string',
		description: 'string'
	}
};

export const reminderDataSchema = {
	name: REMINDER_DATA_SCHEMA,
	properties: {
		name: 'string',
		kiosk_id: 'int',
		frequency: 'int',
		address: 'string',
		phoneNumber: 'string',
		amount_cash: 'double',
		dueAmount: 'double',
		product_name: 'string',
		total: 'int',
		salesChannelId: 'int',
		customerTypeId: 'int',
		customerId: 'int',
		receipt: 'string',
		reminder_date: 'date',
	}
};

export const lastCustomerSchema = {
	name: LAST_CUSTOMER_SCHEMA,
	properties: {
		lastCustomerSyncKey: 'string'
	}
};

export const lastSalesSchema = {
	name: LAST_SALES_SCHEMA,
	properties: {
		lastSalesSyncKey: 'string'
	}
};

export const lastProductsSchema = {
	name: LAST_PRODUCT_SCHEMA,
	properties: {
		lastProductsSyncKey: 'string'
	}
};

export const pendingCustomerSchema = {
	name: PENDING_CUSTOMERS_SCHEMA,
	primaryKey: 'customerId',
	properties: {
		customerId: 'int',
		created_at: 'date',
		updated_at: 'date',
		active: 'bool',
		address: 'string',
		name: 'string',
		customerTypeId: 'int',
		salesChannelId: 'int',
		gpsCoordinates: 'string',
		siteId: 'int',
		phoneNumber: 'string',
		dueAmount: 'double',
		reminder_date: 'date',
		frequency: 'int'
	}
};

export const pendingSalesSchema = {
	name: PENDING_SALES_SCHEMA,
	primaryKey: 'id',
	properties: {
		id: 'string',
		created_at: 'date',
		updated_at: 'date',
		amountCash: 'int',
		amountLoan: 'int',
		amountMobile: 'int',
		siteId: 'int',
		paymentType: 'string',
		salesChannelId: 'int',
		customerTypeId: 'string',
		products: 'int',
		minimumQuantity: 'int',
		priceAmount: 'int',
		priceCurrency: 'string',
		sku: 'string',
		unitPerProduct: 'float',
		unitMeasure: 'string',
		cogsAmount: 'double'
	}
};
