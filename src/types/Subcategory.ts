export interface Subcategory {
	id: number;
	created_at: string;
	updated_at: string;
	name: string;
	description?: string;
	category: number;
}

export type SubcategoryPayload = {
	name: string;
	description?: string;
	category: number;
};
