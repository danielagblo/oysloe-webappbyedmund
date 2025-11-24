/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/**
 * * `SALE` - SALE
 * * `PAYLATER` - PAYLATER
 * * `RENT` - RENT
 */
export enum TypeEnum {
  SALE = "SALE",
  PAYLATER = "PAYLATER",
  RENT = "RENT",
}

/**
 * * `Ahafo` - Ahafo
 * * `Ashanti` - Ashanti
 * * `Bono East` - Bono East
 * * `Brong Ahafo` - Brong Ahafo
 * * `Central` - Central
 * * `Eastern` - Eastern
 * * `Greater Accra` - Greater Accra
 * * `North East` - North East
 * * `Northern` - Northern
 * * `Oti` - Oti
 * * `Savannah` - Savannah
 * * `Upper East` - Upper East
 * * `Upper West` - Upper West
 * * `Volta` - Volta
 * * `Western` - Western
 * * `Western North` - Western North
 */
export enum RegionEnum {
  Ahafo = "Ahafo",
  Ashanti = "Ashanti",
  BonoEast = "Bono East",
  BrongAhafo = "Brong Ahafo",
  Central = "Central",
  Eastern = "Eastern",
  GreaterAccra = "Greater Accra",
  NorthEast = "North East",
  Northern = "Northern",
  Oti = "Oti",
  Savannah = "Savannah",
  UpperEast = "Upper East",
  UpperWest = "Upper West",
  Volta = "Volta",
  Western = "Western",
  WesternNorth = "Western North",
}

/**
 * * `ACTIVE` - ACTIVE
 * * `SUSPENDED` - SUSPENDED
 * * `DRAFT` - DRAFT
 * * `PENDING` - PENDING
 * * `REJECTED` - REJECTED
 */
export enum ProductStatusEnum {
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  REJECTED = "REJECTED",
}

/**
 * * `PENDING` - Pending
 * * `SUCCESS` - Success
 * * `FAILED` - Failed
 */
export enum PaymentStatusEnum {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

/**
 * * `SILVER` - SILVER
 * * `GOLD` - GOLD
 * * `DIAMOND` - DIAMOND
 */
export enum LevelEnum {
  SILVER = "SILVER",
  GOLD = "GOLD",
  DIAMOND = "DIAMOND",
}

/**
 * * `percent` - Percent
 * * `fixed` - Fixed
 */
export enum DiscountTypeEnum {
  Percent = "percent",
  Fixed = "fixed",
}

/**
 * * `PENDING` - Pending
 * * `APPROVED` - Approved
 * * `REJECTED` - Rejected
 */
export enum AccountDeleteRequestStatusEnum {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface AccountDeleteRequest {
  id: number;
  reason: string;
  status: AccountDeleteRequestStatusEnum;
  admin_comment: string | null;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  processed_at: string | null;
}

export interface AdminCategoryWithSubcategories {
  id: number;
  /** @maxLength 100 */
  name: string;
  description?: string | null;
  subcategories: SubCategory[];
}

export interface AdminToggleUser {
  id: number;
  is_active: boolean;
}

export interface AdminVerifyUser {
  id: number;
  /** @default true */
  admin_verified?: boolean;
}

export interface Alert {
  id: number;
  user: number;
  /** @maxLength 200 */
  title: string;
  body?: string;
  /**
   * Type of alert, e.g., ACCOUNT_CREATED, ACCOUNT_APPROVED, PRODUCT_APPROVED
   * @maxLength 50
   */
  kind?: string;
  is_read?: boolean;
  /** @format date-time */
  created_at: string;
}

export interface Category {
  id: number;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
  /** @maxLength 100 */
  name: string;
  description?: string | null;
}

export interface ChangePassword {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export interface ChatRoom {
  id: number;
  /** @maxLength 200 */
  room_id: string;
  /** @maxLength 100 */
  name: string;
  is_group?: boolean;
  members: User[];
  messages: Message[];
  /** @format date-time */
  created_at: string;
  total_unread: number;
}

export interface ChatroomIdResponse {
  chatroom_id: string;
}

export interface Coupon {
  id: number;
  /** @maxLength 50 */
  code: string;
  description?: string | null;
  /**
   * * `percent` - Percent
   * * `fixed` - Fixed
   */
  discount_type: DiscountTypeEnum;
  /**
   * @format decimal
   * @pattern ^-?\d{0,8}(?:\.\d{0,2})?$
   */
  discount_value: string;
  /**
   * Total times this coupon can be used across all users
   * @format int64
   * @min 0
   * @max 9223372036854776000
   */
  max_uses?: number | null;
  uses: number;
  /**
   * Max uses allowed per user
   * @format int64
   * @min 0
   * @max 9223372036854776000
   */
  per_user_limit?: number | null;
  /** @format date-time */
  valid_from?: string | null;
  /** @format date-time */
  valid_until?: string | null;
  is_active?: boolean;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
  remaining_uses: number | null;
}

export interface CreateReview {
  product: number;
  /**
   * @format int64
   * @min -9223372036854776000
   * @max 9223372036854776000
   */
  rating: number;
  comment?: string | null;
}

export interface FCMDevice {
  id: number;
  user: number;
  /** @maxLength 255 */
  token: string;
  /** @format date-time */
  created_at: string;
}

export interface Feature {
  id: number;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
  /** @maxLength 100 */
  name: string;
  description: string;
  subcategory: number;
}

export interface Feedback {
  id: number;
  user: User;
  /**
   * @format int64
   * @min -9223372036854776000
   * @max 9223372036854776000
   */
  rating: number;
  message: string;
  /** @format date-time */
  created_at: string;
}

export interface GenericMessage {
  message: string;
}

export interface Location {
  id: number;
  /**
   * * `Ahafo` - Ahafo
   * * `Ashanti` - Ashanti
   * * `Bono East` - Bono East
   * * `Brong Ahafo` - Brong Ahafo
   * * `Central` - Central
   * * `Eastern` - Eastern
   * * `Greater Accra` - Greater Accra
   * * `North East` - North East
   * * `Northern` - Northern
   * * `Oti` - Oti
   * * `Savannah` - Savannah
   * * `Upper East` - Upper East
   * * `Upper West` - Upper West
   * * `Volta` - Volta
   * * `Western` - Western
   * * `Western North` - Western North
   */
  region?: RegionEnum;
  /** @maxLength 100 */
  name?: string | null;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
}

export interface Login {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface Message {
  id: number;
  room: number;
  sender: User;
  content: string;
  /** @format date-time */
  created_at: string;
  is_read?: boolean;
}

export interface PatchedAccountDeleteRequest {
  id?: number;
  reason?: string;
  status?: AccountDeleteRequestStatusEnum;
  admin_comment?: string | null;
  /** @format date-time */
  created_at?: string;
  /** @format date-time */
  processed_at?: string | null;
}

export interface PatchedAlert {
  id?: number;
  user?: number;
  /** @maxLength 200 */
  title?: string;
  body?: string;
  /**
   * Type of alert, e.g., ACCOUNT_CREATED, ACCOUNT_APPROVED, PRODUCT_APPROVED
   * @maxLength 50
   */
  kind?: string;
  is_read?: boolean;
  /** @format date-time */
  created_at?: string;
}

export interface PatchedCategory {
  id?: number;
  /** @format date-time */
  created_at?: string;
  /** @format date-time */
  updated_at?: string;
  /** @maxLength 100 */
  name?: string;
  description?: string | null;
}

export interface PatchedCoupon {
  id?: number;
  /** @maxLength 50 */
  code?: string;
  description?: string | null;
  /**
   * * `percent` - Percent
   * * `fixed` - Fixed
   */
  discount_type?: DiscountTypeEnum;
  /**
   * @format decimal
   * @pattern ^-?\d{0,8}(?:\.\d{0,2})?$
   */
  discount_value?: string;
  /**
   * Total times this coupon can be used across all users
   * @format int64
   * @min 0
   * @max 9223372036854776000
   */
  max_uses?: number | null;
  uses?: number;
  /**
   * Max uses allowed per user
   * @format int64
   * @min 0
   * @max 9223372036854776000
   */
  per_user_limit?: number | null;
  /** @format date-time */
  valid_from?: string | null;
  /** @format date-time */
  valid_until?: string | null;
  is_active?: boolean;
  /** @format date-time */
  created_at?: string;
  /** @format date-time */
  updated_at?: string;
  remaining_uses?: number | null;
}

export interface PatchedFCMDevice {
  id?: number;
  user?: number;
  /** @maxLength 255 */
  token?: string;
  /** @format date-time */
  created_at?: string;
}

export interface PatchedFeature {
  id?: number;
  /** @format date-time */
  created_at?: string;
  /** @format date-time */
  updated_at?: string;
  /** @maxLength 100 */
  name?: string;
  description?: string;
  subcategory?: number;
}

export interface PatchedFeedback {
  id?: number;
  user?: User;
  /**
   * @format int64
   * @min -9223372036854776000
   * @max 9223372036854776000
   */
  rating?: number;
  message?: string;
  /** @format date-time */
  created_at?: string;
}

export interface PatchedLocation {
  id?: number;
  /**
   * * `Ahafo` - Ahafo
   * * `Ashanti` - Ashanti
   * * `Bono East` - Bono East
   * * `Brong Ahafo` - Brong Ahafo
   * * `Central` - Central
   * * `Eastern` - Eastern
   * * `Greater Accra` - Greater Accra
   * * `North East` - North East
   * * `Northern` - Northern
   * * `Oti` - Oti
   * * `Savannah` - Savannah
   * * `Upper East` - Upper East
   * * `Upper West` - Upper West
   * * `Volta` - Volta
   * * `Western` - Western
   * * `Western North` - Western North
   */
  region?: RegionEnum;
  /** @maxLength 100 */
  name?: string | null;
  /** @format date-time */
  created_at?: string;
  /** @format date-time */
  updated_at?: string;
}

export interface PatchedPrivacyPolicy {
  id?: number;
  /** @maxLength 200 */
  title?: string;
  /** @format date */
  date?: string;
  body?: string;
  /** @format date-time */
  created_at?: string;
  /** @format date-time */
  updated_at?: string;
}

export interface PatchedProduct {
  id?: number;
  images?: ProductImage[];
  product_features?: ProductFeature[];
  location?: ProductLocation;
  owner?: ProductOwner;
  /** @format date-time */
  created_at?: string;
  /** @format date-time */
  updated_at?: string;
  /** @maxLength 20 */
  pid?: string;
  /** @maxLength 100 */
  name?: string;
  /** @format uri */
  image?: string | null;
  /**
   * * `SALE` - SALE
   * * `PAYLATER` - PAYLATER
   * * `RENT` - RENT
   */
  type?: TypeEnum;
  /**
   * * `ACTIVE` - ACTIVE
   * * `SUSPENDED` - SUSPENDED
   * * `DRAFT` - DRAFT
   * * `PENDING` - PENDING
   * * `REJECTED` - REJECTED
   */
  status?: ProductStatusEnum;
  is_taken?: boolean;
  description?: string;
  /**
   * @format decimal
   * @pattern ^-?\d{0,8}(?:\.\d{0,2})?$
   */
  price?: string;
  /** @maxLength 100 */
  duration?: string;
  category?: number | null;
}

export interface PatchedProductFeature {
  id?: number;
  product?: number;
  feature?: Feature;
  /** @maxLength 255 */
  value?: string;
}

export interface PatchedProductImage {
  id?: number;
  product?: number;
  /** @format uri */
  image?: string;
  /** @format date-time */
  created_at?: string;
}

export interface PatchedReview {
  id?: number;
  user?: User;
  product?: Product;
  /**
   * @format int64
   * @min -9223372036854776000
   * @max 9223372036854776000
   */
  rating?: number;
  comment?: string | null;
  /** @format date-time */
  created_at?: string;
}

export interface PatchedSubCategory {
  id?: number;
  /** @format date-time */
  created_at?: string;
  /** @format date-time */
  updated_at?: string;
  /** @maxLength 100 */
  name?: string;
  description?: string | null;
  category?: number;
}

export interface PatchedSubscription {
  id?: number;
  /** @maxLength 100 */
  name?: string;
  /** @maxLength 50 */
  tier?: string;
  description?: string | null;
  /**
   * @format decimal
   * @pattern ^-?\d{0,8}(?:\.\d{0,2})?$
   */
  price?: string;
  /**
   * @format decimal
   * @pattern ^-?\d{0,8}(?:\.\d{0,2})?$
   */
  original_price?: string | null;
  /**
   * Just a tag to be used for differentiating plans
   * @format decimal
   * @pattern ^-?\d{0,3}(?:\.\d{0,2})?$
   */
  multiplier?: string;
  /**
   * Percentage discount on the original price if any
   * @format decimal
   * @pattern ^-?\d{0,3}(?:\.\d{0,2})?$
   */
  discount_percentage?: string | null;
  /**
   * @format decimal
   * @pattern ^-?\d{0,8}(?:\.\d{0,2})?$
   */
  effective_price?: string;
  /** Comma-separated list of features included in this subscription */
  features?: string;
  features_list?: string[];
  /**
   * Duration of the subscription in days
   * @format int64
   * @min 0
   * @max 9223372036854776000
   */
  duration_days?: number;
  /**
   * Maximum number of products allowed under this subscription. Use 0 for unlimited.
   * @format int64
   * @min 0
   * @max 9223372036854776000
   */
  max_products?: number;
  is_active?: boolean;
  /** @format date-time */
  created_at?: string;
  /** @format date-time */
  updated_at?: string;
}

export interface PatchedTermsAndConditions {
  id?: number;
  /** @maxLength 200 */
  title?: string;
  /** @format date */
  date?: string;
  body?: string;
  /** @format date-time */
  created_at?: string;
  /** @format date-time */
  updated_at?: string;
}

export interface PatchedUserSubscription {
  id?: number;
  subscription?: Subscription;
  subscription_id?: number;
  payment?: Payment;
  /** @format date-time */
  start_date?: string;
  /** @format date-time */
  end_date?: string;
  is_active?: boolean;
  /** @format date-time */
  created_at?: string;
}

export interface Payment {
  id: number;
  user: number;
  /** Subscription this payment is intended for (if applicable). */
  subscription?: number | null;
  /**
   * @format decimal
   * @pattern ^-?\d{0,8}(?:\.\d{0,2})?$
   */
  amount: string;
  /** @maxLength 10 */
  currency?: string;
  /** @maxLength 30 */
  provider?: string;
  /** @maxLength 100 */
  reference: string;
  status: PaymentStatusEnum;
  channel: string | null;
  raw_response: any;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
}

export interface PingResponse {
  message: string;
}

export interface PrivacyPolicy {
  id: number;
  /** @maxLength 200 */
  title?: string;
  /** @format date */
  date: string;
  body: string;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
}

export interface Product {
  id: number;
  images: ProductImage[];
  product_features: ProductFeature[];
  location: ProductLocation;
  owner: ProductOwner;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
  /** @maxLength 20 */
  pid?: string;
  /** @maxLength 100 */
  name: string;
  /** @format uri */
  image?: string | null;
  /**
   * * `SALE` - SALE
   * * `PAYLATER` - PAYLATER
   * * `RENT` - RENT
   */
  type?: TypeEnum;
  /**
   * * `ACTIVE` - ACTIVE
   * * `SUSPENDED` - SUSPENDED
   * * `DRAFT` - DRAFT
   * * `PENDING` - PENDING
   * * `REJECTED` - REJECTED
   */
  status?: ProductStatusEnum;
  is_taken?: boolean;
  description: string;
  /**
   * @format decimal
   * @pattern ^-?\d{0,8}(?:\.\d{0,2})?$
   */
  price: string;
  /** @maxLength 100 */
  duration?: string;
  category?: number | null;
}

export interface ProductFeature {
  id: number;
  product: number;
  feature: Feature;
  /** @maxLength 255 */
  value: string;
}

export interface ProductImage {
  id: number;
  product: number;
  /** @format uri */
  image: string;
  /** @format date-time */
  created_at: string;
}

export interface ProductLocation {
  id: number;
  /**
   * * `Ahafo` - Ahafo
   * * `Ashanti` - Ashanti
   * * `Bono East` - Bono East
   * * `Brong Ahafo` - Brong Ahafo
   * * `Central` - Central
   * * `Eastern` - Eastern
   * * `Greater Accra` - Greater Accra
   * * `North East` - North East
   * * `Northern` - Northern
   * * `Oti` - Oti
   * * `Savannah` - Savannah
   * * `Upper East` - Upper East
   * * `Upper West` - Upper West
   * * `Volta` - Volta
   * * `Western` - Western
   * * `Western North` - Western North
   */
  region?: RegionEnum;
  /** @maxLength 100 */
  name?: string | null;
}

export interface ProductOwner {
  id: number;
  /** @format email */
  email: string;
  phone: string;
  name: string;
}

export interface RedeemReferralResponse {
  redeemed_points: number;
  /**
   * @format decimal
   * @pattern ^-?\d{0,8}(?:\.\d{0,2})?$
   */
  cash_amount: string;
  remaining_points: number;
  /**
   * @format decimal
   * @pattern ^-?\d{0,8}(?:\.\d{0,2})?$
   */
  wallet_balance: string;
}

export interface RegisterUser {
  /**
   * @format email
   * @maxLength 50
   */
  email: string;
  /** @maxLength 15 */
  phone: string;
  /** @maxLength 128 */
  password: string;
  /** @maxLength 255 */
  name: string;
  /** @maxLength 500 */
  address?: string | null;
  referral_code?: string;
}

export interface RegisterUserResponse {
  user: User;
  token: string;
}

export interface ResetPassword {
  phone: string;
  new_password: string;
  confirm_password: string;
}

export interface Review {
  id: number;
  user: User;
  product: Product;
  /**
   * @format int64
   * @min -9223372036854776000
   * @max 9223372036854776000
   */
  rating: number;
  comment?: string | null;
  /** @format date-time */
  created_at: string;
}

export interface SaveFCMTokenRequest {
  token: string;
  user_id: number;
}

export interface SaveFCMTokenResponse {
  status: string;
}

export interface SimpleStatus {
  status: string;
  message?: string;
}

export interface SubCategory {
  id: number;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
  /** @maxLength 100 */
  name: string;
  description?: string | null;
  category: number;
}

export interface Subscription {
  id: number;
  /** @maxLength 100 */
  name: string;
  /** @maxLength 50 */
  tier: string;
  description?: string | null;
  /**
   * @format decimal
   * @pattern ^-?\d{0,8}(?:\.\d{0,2})?$
   */
  price: string;
  /**
   * @format decimal
   * @pattern ^-?\d{0,8}(?:\.\d{0,2})?$
   */
  original_price?: string | null;
  /**
   * Just a tag to be used for differentiating plans
   * @format decimal
   * @pattern ^-?\d{0,3}(?:\.\d{0,2})?$
   */
  multiplier?: string;
  /**
   * Percentage discount on the original price if any
   * @format decimal
   * @pattern ^-?\d{0,3}(?:\.\d{0,2})?$
   */
  discount_percentage?: string | null;
  /**
   * @format decimal
   * @pattern ^-?\d{0,8}(?:\.\d{0,2})?$
   */
  effective_price: string;
  /** Comma-separated list of features included in this subscription */
  features: string;
  features_list: string[];
  /**
   * Duration of the subscription in days
   * @format int64
   * @min 0
   * @max 9223372036854776000
   */
  duration_days: number;
  /**
   * Maximum number of products allowed under this subscription. Use 0 for unlimited.
   * @format int64
   * @min 0
   * @max 9223372036854776000
   */
  max_products: number;
  is_active?: boolean;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
}

export interface TermsAndConditions {
  id: number;
  /** @maxLength 200 */
  title?: string;
  /** @format date */
  date: string;
  body: string;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
}

export interface User {
  id: number;
  active_ads: number;
  taken_ads: number;
  /** @format date-time */
  last_login?: string | null;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
  /**
   * @format email
   * @maxLength 50
   */
  email: string;
  /** @maxLength 15 */
  phone: string;
  /** @maxLength 255 */
  name: string;
  /** @maxLength 255 */
  business_name?: string;
  /** @maxLength 50 */
  id_number?: string;
  /** @maxLength 15 */
  second_number?: string;
  /** @format uri */
  business_logo?: string | null;
  /** @format uri */
  id_front_page?: string | null;
  /** @format uri */
  id_back_page?: string | null;
  /** @maxLength 50 */
  account_number?: string | null;
  /** @maxLength 100 */
  account_name?: string | null;
  /** @maxLength 50 */
  mobile_network?: string | null;
  /** @maxLength 500 */
  address?: string | null;
  /** @format uri */
  avatar?: string | null;
  admin_verified?: boolean;
  deleted?: boolean;
  /**
   * * `SILVER` - SILVER
   * * `GOLD` - GOLD
   * * `DIAMOND` - DIAMOND
   */
  level?: LevelEnum;
  /**
   * @format int64
   * @min -9223372036854776000
   * @max 9223372036854776000
   */
  referral_points?: number;
  /** @maxLength 20 */
  referral_code?: string;
  is_active?: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
  created_from_app?: boolean;
  phone_verified?: boolean;
  email_verified?: boolean;
  /**
   * @format email
   * @maxLength 50
   */
  preferred_notification_email?: string | null;
  /** @maxLength 15 */
  preferred_notification_phone?: string | null;
}

export interface UserSubscription {
  id: number;
  subscription: Subscription;
  subscription_id: number;
  payment: Payment;
  /** @format date-time */
  start_date: string;
  /** @format date-time */
  end_date: string;
  is_active: boolean;
  /** @format date-time */
  created_at: string;
}

export interface UserUpdate {
  /**
   * @format email
   * @maxLength 50
   */
  email?: string;
  /** @maxLength 15 */
  phone?: string;
  /** @maxLength 255 */
  name?: string;
  /** @maxLength 500 */
  address?: string | null;
  /** @format uri */
  avatar?: string | null;
  /**
   * @format email
   * @maxLength 50
   */
  preferred_notification_email?: string | null;
  /** @maxLength 15 */
  preferred_notification_phone?: string | null;
}

export interface VerifyOTPPostRequest {
  /** @maxLength 10 */
  phone: string;
  otp: string;
}
