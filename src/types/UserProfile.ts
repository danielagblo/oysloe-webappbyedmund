export interface UserProfile {
	id: number;
	active_ads: number;
	taken_ads: number;
	last_login: string;
	created_at: string;
	updated_at: string;
	email: string;
	phone?: string;
	name?: string;
	business_name?: string;
	id_number?: string;
	second_number?: string;
	business_logo?: string;
	id_front_page?: string;
	id_back_page?: string;
	account_number?: string;
	account_name?: string;
	mobile_network?: string;
	address?: string;
	avatar?: string;
	admin_verified: boolean;
	deleted: boolean;
	level: string;
	referral_points: number;
	referral_code?: string;
	is_active: boolean;
	is_staff: boolean;
	is_superuser: boolean;
	created_from_app: boolean;
	phone_verified: boolean;
	email_verified: boolean;
	preferred_notification_email?: string;
	preferred_notification_phone?: string;
}

export type UserProfileUpdatePayload = {
	email?: string;
	phone?: string;
	name?: string;
	address?: string;
	avatar?: string;
	preferred_notification_email?: string;
	preferred_notification_phone?: string;
};

export interface OTPVerifyRequest {
	phone: string;
	otp: string;
}

export interface MessageResponse {
	message: string;
}
