import type { Feature } from "./Feature";

export interface ProductFeature {
	id: number;
	product: number;
	feature: Feature;
	value: string;
}

export type ProductFeaturePayload = {
	product: number;
	value: string;
};
