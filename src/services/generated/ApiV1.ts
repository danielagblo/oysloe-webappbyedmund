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

import {
  AccountDeleteRequest,
  AdminCategoryWithSubcategories,
  AdminToggleUser,
  AdminVerifyUser,
  Alert,
  Category,
  ChangePassword,
  ChatRoom,
  ChatroomIdResponse,
  Coupon,
  CreateReview,
  Feature,
  Feedback,
  GenericMessage,
  Location,
  Login,
  LoginResponse,
  Message,
  PatchedAccountDeleteRequest,
  PatchedAlert,
  PatchedCategory,
  PatchedCoupon,
  PatchedFeature,
  PatchedFeedback,
  PatchedLocation,
  PatchedPrivacyPolicy,
  PatchedProduct,
  PatchedProductFeature,
  PatchedProductImage,
  PatchedReview,
  PatchedSubCategory,
  PatchedSubscription,
  PatchedTermsAndConditions,
  PatchedUserSubscription,
  Payment,
  PingResponse,
  PrivacyPolicy,
  Product,
  ProductFeature,
  ProductImage,
  RedeemReferralResponse,
  RegisterUser,
  RegisterUserResponse,
  ResetPassword,
  Review,
  SimpleStatus,
  SubCategory,
  Subscription,
  TermsAndConditions,
  User,
  UserSubscription,
  UserUpdate,
  VerifyOTPPostRequest,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class ApiV1<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description This method is used to check if the server is up and running
   *
   * @tags api-v1
   * @name Ping
   * @request GET:/api-v1/
   * @secure
   */
  ping = (params: RequestParams = {}) =>
    this.request<PingResponse, any>({
      path: `/api-v1/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Users can submit account delete requests; admins can review/approve.
   *
   * @tags api-v1
   * @name ApiV1AccountDeleteRequestsList
   * @request GET:/api-v1/account-delete-requests/
   * @secure
   */
  apiV1AccountDeleteRequestsList = (
    query?: {
      /** Which field to use when ordering the results. */
      ordering?: string;
      /** A search term. */
      search?: string;
      /**
       * * `PENDING` - Pending
       * * `APPROVED` - Approved
       * * `REJECTED` - Rejected
       */
      status?: "APPROVED" | "PENDING" | "REJECTED";
    },
    params: RequestParams = {},
  ) =>
    this.request<AccountDeleteRequest[], any>({
      path: `/api-v1/account-delete-requests/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Users can submit account delete requests; admins can review/approve.
   *
   * @tags api-v1
   * @name ApiV1AccountDeleteRequestsCreate
   * @request POST:/api-v1/account-delete-requests/
   * @secure
   */
  apiV1AccountDeleteRequestsCreate = (
    data: AccountDeleteRequest,
    params: RequestParams = {},
  ) =>
    this.request<AccountDeleteRequest, any>({
      path: `/api-v1/account-delete-requests/`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Users can submit account delete requests; admins can review/approve.
   *
   * @tags api-v1
   * @name ApiV1AccountDeleteRequestsRetrieve
   * @request GET:/api-v1/account-delete-requests/{id}/
   * @secure
   */
  apiV1AccountDeleteRequestsRetrieve = (
    id: number,
    params: RequestParams = {},
  ) =>
    this.request<AccountDeleteRequest, any>({
      path: `/api-v1/account-delete-requests/${id}/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Users can submit account delete requests; admins can review/approve.
   *
   * @tags api-v1
   * @name ApiV1AccountDeleteRequestsUpdate
   * @request PUT:/api-v1/account-delete-requests/{id}/
   * @secure
   */
  apiV1AccountDeleteRequestsUpdate = (
    id: number,
    data: AccountDeleteRequest,
    params: RequestParams = {},
  ) =>
    this.request<AccountDeleteRequest, any>({
      path: `/api-v1/account-delete-requests/${id}/`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Users can submit account delete requests; admins can review/approve.
   *
   * @tags api-v1
   * @name ApiV1AccountDeleteRequestsPartialUpdate
   * @request PATCH:/api-v1/account-delete-requests/{id}/
   * @secure
   */
  apiV1AccountDeleteRequestsPartialUpdate = (
    id: number,
    data: PatchedAccountDeleteRequest,
    params: RequestParams = {},
  ) =>
    this.request<AccountDeleteRequest, any>({
      path: `/api-v1/account-delete-requests/${id}/`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Users can submit account delete requests; admins can review/approve.
   *
   * @tags api-v1
   * @name ApiV1AccountDeleteRequestsDestroy
   * @request DELETE:/api-v1/account-delete-requests/{id}/
   * @secure
   */
  apiV1AccountDeleteRequestsDestroy = (
    id: number,
    params: RequestParams = {},
  ) =>
    this.request<void, any>({
      path: `/api-v1/account-delete-requests/${id}/`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * @description Admin approves the delete request; optionally soft-deletes user.
   *
   * @tags api-v1
   * @name ApiV1AccountDeleteRequestsApproveCreate
   * @request POST:/api-v1/account-delete-requests/{id}/approve/
   * @secure
   */
  apiV1AccountDeleteRequestsApproveCreate = (
    id: number,
    data: AccountDeleteRequest,
    params: RequestParams = {},
  ) =>
    this.request<AccountDeleteRequest, any>({
      path: `/api-v1/account-delete-requests/${id}/approve/`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Admin rejects the delete request with an optional comment.
   *
   * @tags api-v1
   * @name ApiV1AccountDeleteRequestsRejectCreate
   * @request POST:/api-v1/account-delete-requests/{id}/reject/
   * @secure
   */
  apiV1AccountDeleteRequestsRejectCreate = (
    id: number,
    data: AccountDeleteRequest,
    params: RequestParams = {},
  ) =>
    this.request<AccountDeleteRequest, any>({
      path: `/api-v1/account-delete-requests/${id}/reject/`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description List all categories with nested subcategories (admin/staff only).
   *
   * @tags api-v1
   * @name AdminListCategories
   * @request GET:/api-v1/admin/categories/
   * @secure
   */
  adminListCategories = (params: RequestParams = {}) =>
    this.request<AdminCategoryWithSubcategories[], any>({
      path: `/api-v1/admin/categories/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description List users (admin/staff only). Supports optional 'q' search across name, email, phone.
   *
   * @tags api-v1
   * @name AdminListUsers
   * @request GET:/api-v1/admin/users/
   * @secure
   */
  adminListUsers = (
    query?: {
      /** Search by name, email or phone */
      q?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<User[], any>({
      path: `/api-v1/admin/users/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Set admin verification status for a user by id. Staff-only.
   *
   * @tags api-v1
   * @name AdminVerifyUser
   * @request POST:/api-v1/admin/verifyuser/
   * @secure
   */
  adminVerifyUser = (data: AdminVerifyUser, params: RequestParams = {}) =>
    this.request<User, GenericMessage>({
      path: `/api-v1/admin/verifyuser/`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Admin/Staff-only login endpoint (same as LoginAPI but enforces staff/admin).
   *
   * @tags api-v1
   * @name AdminLogin
   * @request POST:/api-v1/adminlogin/
   * @secure
   */
  adminLogin = (data: Login, params: RequestParams = {}) =>
    this.request<LoginResponse, GenericMessage>({
      path: `/api-v1/adminlogin/`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Users can manage their in-app alerts; admins can manage all. When creating an alert as an admin, you can specify the target user by setting the 'user' field in the alert data.
   *
   * @tags api-v1
   * @name ApiV1AlertsList
   * @request GET:/api-v1/alerts/
   * @secure
   */
  apiV1AlertsList = (
    query?: {
      /** Which field to use when ordering the results. */
      ordering?: string;
      /** A search term. */
      search?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<Alert[], any>({
      path: `/api-v1/alerts/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Users can manage their in-app alerts; admins can manage all. When creating an alert as an admin, you can specify the target user by setting the 'user' field in the alert data.
   *
   * @tags api-v1
   * @name ApiV1AlertsCreate
   * @request POST:/api-v1/alerts/
   * @secure
   */
  apiV1AlertsCreate = (data: Alert, params: RequestParams = {}) =>
    this.request<Alert, any>({
      path: `/api-v1/alerts/`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Users can manage their in-app alerts; admins can manage all. When creating an alert as an admin, you can specify the target user by setting the 'user' field in the alert data.
   *
   * @tags api-v1
   * @name ApiV1AlertsRetrieve
   * @request GET:/api-v1/alerts/{id}/
   * @secure
   */
  apiV1AlertsRetrieve = (id: number, params: RequestParams = {}) =>
    this.request<Alert, any>({
      path: `/api-v1/alerts/${id}/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Users can manage their in-app alerts; admins can manage all. When creating an alert as an admin, you can specify the target user by setting the 'user' field in the alert data.
   *
   * @tags api-v1
   * @name ApiV1AlertsUpdate
   * @request PUT:/api-v1/alerts/{id}/
   * @secure
   */
  apiV1AlertsUpdate = (id: number, data: Alert, params: RequestParams = {}) =>
    this.request<Alert, any>({
      path: `/api-v1/alerts/${id}/`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Users can manage their in-app alerts; admins can manage all. When creating an alert as an admin, you can specify the target user by setting the 'user' field in the alert data.
   *
   * @tags api-v1
   * @name ApiV1AlertsPartialUpdate
   * @request PATCH:/api-v1/alerts/{id}/
   * @secure
   */
  apiV1AlertsPartialUpdate = (
    id: number,
    data: PatchedAlert,
    params: RequestParams = {},
  ) =>
    this.request<Alert, any>({
      path: `/api-v1/alerts/${id}/`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Users can manage their in-app alerts; admins can manage all. When creating an alert as an admin, you can specify the target user by setting the 'user' field in the alert data.
   *
   * @tags api-v1
   * @name ApiV1AlertsDestroy
   * @request DELETE:/api-v1/alerts/{id}/
   * @secure
   */
  apiV1AlertsDestroy = (id: number, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api-v1/alerts/${id}/`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * @description Users can manage their in-app alerts; admins can manage all. When creating an alert as an admin, you can specify the target user by setting the 'user' field in the alert data.
   *
   * @tags api-v1
   * @name ApiV1AlertsDeleteDestroy
   * @request DELETE:/api-v1/alerts/{id}/delete/
   * @secure
   */
  apiV1AlertsDeleteDestroy = (id: number, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api-v1/alerts/${id}/delete/`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * @description Users can manage their in-app alerts; admins can manage all. When creating an alert as an admin, you can specify the target user by setting the 'user' field in the alert data.
   *
   * @tags api-v1
   * @name ApiV1AlertsMarkReadCreate
   * @request POST:/api-v1/alerts/{id}/mark-read/
   * @secure
   */
  apiV1AlertsMarkReadCreate = (
    id: number,
    data: Alert,
    params: RequestParams = {},
  ) =>
    this.request<Alert, any>({
      path: `/api-v1/alerts/${id}/mark-read/`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Users can manage their in-app alerts; admins can manage all. When creating an alert as an admin, you can specify the target user by setting the 'user' field in the alert data.
   *
   * @tags api-v1
   * @name ApiV1AlertsMarkAllReadCreate
   * @request POST:/api-v1/alerts/mark-all-read/
   * @secure
   */
  apiV1AlertsMarkAllReadCreate = (data: Alert, params: RequestParams = {}) =>
    this.request<Alert, any>({
      path: `/api-v1/alerts/mark-all-read/`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1CategoriesList
   * @request GET:/api-v1/categories/
   * @secure
   */
  apiV1CategoriesList = (
    query?: {
      /** Which field to use when ordering the results. */
      ordering?: string;
      /** A search term. */
      search?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<Category[], any>({
      path: `/api-v1/categories/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1CategoriesCreate
   * @request POST:/api-v1/categories/
   * @secure
   */
  apiV1CategoriesCreate = (data: Category, params: RequestParams = {}) =>
    this.request<Category, any>({
      path: `/api-v1/categories/`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1CategoriesRetrieve
   * @request GET:/api-v1/categories/{id}/
   * @secure
   */
  apiV1CategoriesRetrieve = (id: number, params: RequestParams = {}) =>
    this.request<Category, any>({
      path: `/api-v1/categories/${id}/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1CategoriesUpdate
   * @request PUT:/api-v1/categories/{id}/
   * @secure
   */
  apiV1CategoriesUpdate = (
    id: number,
    data: Category,
    params: RequestParams = {},
  ) =>
    this.request<Category, any>({
      path: `/api-v1/categories/${id}/`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1CategoriesPartialUpdate
   * @request PATCH:/api-v1/categories/{id}/
   * @secure
   */
  apiV1CategoriesPartialUpdate = (
    id: number,
    data: PatchedCategory,
    params: RequestParams = {},
  ) =>
    this.request<Category, any>({
      path: `/api-v1/categories/${id}/`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1CategoriesDestroy
   * @request DELETE:/api-v1/categories/{id}/
   * @secure
   */
  apiV1CategoriesDestroy = (id: number, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api-v1/categories/${id}/`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * @description Change user password
   *
   * @tags api-v1
   * @name ChangePassword
   * @request POST:/api-v1/changepassword/
   * @secure
   */
  changePassword = (data: ChangePassword, params: RequestParams = {}) =>
    this.request<SimpleStatus, GenericMessage>({
      path: `/api-v1/changepassword/`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get the chatroom ID between the current user and the other user if it exists, else create one
   *
   * @tags api-v1
   * @name GetChatroomId
   * @request GET:/api-v1/chatroomid/
   * @secure
   */
  getChatroomId = (
    query: {
      email: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<ChatroomIdResponse, ChatroomIdResponse>({
      path: `/api-v1/chatroomid/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1ChatroomsList
   * @request GET:/api-v1/chatrooms/
   * @secure
   */
  apiV1ChatroomsList = (
    query?: {
      /** Which field to use when ordering the results. */
      ordering?: string;
      /** A search term. */
      search?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<ChatRoom[], any>({
      path: `/api-v1/chatrooms/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1ChatroomsRetrieve
   * @request GET:/api-v1/chatrooms/{id}/
   * @secure
   */
  apiV1ChatroomsRetrieve = (id: number, params: RequestParams = {}) =>
    this.request<ChatRoom, any>({
      path: `/api-v1/chatrooms/${id}/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1ChatroomsMarkReadCreate
   * @request POST:/api-v1/chatrooms/{id}/mark-read/
   * @secure
   */
  apiV1ChatroomsMarkReadCreate = (
    id: number,
    data: ChatRoom,
    params: RequestParams = {},
  ) =>
    this.request<ChatRoom, any>({
      path: `/api-v1/chatrooms/${id}/mark-read/`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1ChatroomsMessagesRetrieve
   * @request GET:/api-v1/chatrooms/{id}/messages/
   * @secure
   */
  apiV1ChatroomsMessagesRetrieve = (id: number, params: RequestParams = {}) =>
    this.request<ChatRoom, any>({
      path: `/api-v1/chatrooms/${id}/messages/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1ChatroomsSendCreate
   * @request POST:/api-v1/chatrooms/{id}/send/
   * @secure
   */
  apiV1ChatroomsSendCreate = (
    id: number,
    data: ChatRoom,
    params: RequestParams = {},
  ) =>
    this.request<ChatRoom, any>({
      path: `/api-v1/chatrooms/${id}/send/`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1CouponsList
   * @request GET:/api-v1/coupons/
   * @secure
   */
  apiV1CouponsList = (
    query?: {
      code?: string;
      /**
       * * `percent` - Percent
       * * `fixed` - Fixed
       */
      discount_type?: "fixed" | "percent";
      is_active?: boolean;
      /** Which field to use when ordering the results. */
      ordering?: string;
      /** A search term. */
      search?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<Coupon[], any>({
      path: `/api-v1/coupons/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1CouponsCreate
   * @request POST:/api-v1/coupons/
   * @secure
   */
  apiV1CouponsCreate = (data: Coupon, params: RequestParams = {}) =>
    this.request<Coupon, any>({
      path: `/api-v1/coupons/`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1CouponsRetrieve
   * @request GET:/api-v1/coupons/{id}/
   * @secure
   */
  apiV1CouponsRetrieve = (id: number, params: RequestParams = {}) =>
    this.request<Coupon, any>({
      path: `/api-v1/coupons/${id}/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1CouponsUpdate
   * @request PUT:/api-v1/coupons/{id}/
   * @secure
   */
  apiV1CouponsUpdate = (id: number, data: Coupon, params: RequestParams = {}) =>
    this.request<Coupon, any>({
      path: `/api-v1/coupons/${id}/`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1CouponsPartialUpdate
   * @request PATCH:/api-v1/coupons/{id}/
   * @secure
   */
  apiV1CouponsPartialUpdate = (
    id: number,
    data: PatchedCoupon,
    params: RequestParams = {},
  ) =>
    this.request<Coupon, any>({
      path: `/api-v1/coupons/${id}/`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1CouponsDestroy
   * @request DELETE:/api-v1/coupons/{id}/
   * @secure
   */
  apiV1CouponsDestroy = (id: number, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api-v1/coupons/${id}/`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1CouponsExpireCreate
   * @request POST:/api-v1/coupons/{id}/expire/
   * @secure
   */
  apiV1CouponsExpireCreate = (
    id: number,
    data: Coupon,
    params: RequestParams = {},
  ) =>
    this.request<Coupon, any>({
      path: `/api-v1/coupons/${id}/expire/`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1CouponsRedeemCreate
   * @request POST:/api-v1/coupons/{id}/redeem/
   * @secure
   */
  apiV1CouponsRedeemCreate = (
    id: number,
    data: Coupon,
    params: RequestParams = {},
  ) =>
    this.request<Coupon, any>({
      path: `/api-v1/coupons/${id}/redeem/`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1FeaturesList
   * @request GET:/api-v1/features/
   * @secure
   */
  apiV1FeaturesList = (
    query?: {
      /** Which field to use when ordering the results. */
      ordering?: string;
      /** A search term. */
      search?: string;
      subcategory?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<Feature[], any>({
      path: `/api-v1/features/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1FeaturesCreate
   * @request POST:/api-v1/features/
   * @secure
   */
  apiV1FeaturesCreate = (data: Feature, params: RequestParams = {}) =>
    this.request<Feature, any>({
      path: `/api-v1/features/`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1FeaturesRetrieve
   * @request GET:/api-v1/features/{id}/
   * @secure
   */
  apiV1FeaturesRetrieve = (id: number, params: RequestParams = {}) =>
    this.request<Feature, any>({
      path: `/api-v1/features/${id}/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1FeaturesUpdate
   * @request PUT:/api-v1/features/{id}/
   * @secure
   */
  apiV1FeaturesUpdate = (
    id: number,
    data: Feature,
    params: RequestParams = {},
  ) =>
    this.request<Feature, any>({
      path: `/api-v1/features/${id}/`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1FeaturesPartialUpdate
   * @request PATCH:/api-v1/features/{id}/
   * @secure
   */
  apiV1FeaturesPartialUpdate = (
    id: number,
    data: PatchedFeature,
    params: RequestParams = {},
  ) =>
    this.request<Feature, any>({
      path: `/api-v1/features/${id}/`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1FeaturesDestroy
   * @request DELETE:/api-v1/features/{id}/
   * @secure
   */
  apiV1FeaturesDestroy = (id: number, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api-v1/features/${id}/`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * @description Users can submit feedback; admins can browse all feedback.
   *
   * @tags api-v1
   * @name ApiV1FeedbackList
   * @request GET:/api-v1/feedback/
   * @secure
   */
  apiV1FeedbackList = (
    query?: {
      /** Which field to use when ordering the results. */
      ordering?: string;
      /** A search term. */
      search?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<Feedback[], any>({
      path: `/api-v1/feedback/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Users can submit feedback; admins can browse all feedback.
   *
   * @tags api-v1
   * @name ApiV1FeedbackCreate
   * @request POST:/api-v1/feedback/
   * @secure
   */
  apiV1FeedbackCreate = (data: Feedback, params: RequestParams = {}) =>
    this.request<Feedback, any>({
      path: `/api-v1/feedback/`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Users can submit feedback; admins can browse all feedback.
   *
   * @tags api-v1
   * @name ApiV1FeedbackRetrieve
   * @request GET:/api-v1/feedback/{id}/
   * @secure
   */
  apiV1FeedbackRetrieve = (id: number, params: RequestParams = {}) =>
    this.request<Feedback, any>({
      path: `/api-v1/feedback/${id}/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Users can submit feedback; admins can browse all feedback.
   *
   * @tags api-v1
   * @name ApiV1FeedbackUpdate
   * @request PUT:/api-v1/feedback/{id}/
   * @secure
   */
  apiV1FeedbackUpdate = (
    id: number,
    data: Feedback,
    params: RequestParams = {},
  ) =>
    this.request<Feedback, any>({
      path: `/api-v1/feedback/${id}/`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Users can submit feedback; admins can browse all feedback.
   *
   * @tags api-v1
   * @name ApiV1FeedbackPartialUpdate
   * @request PATCH:/api-v1/feedback/{id}/
   * @secure
   */
  apiV1FeedbackPartialUpdate = (
    id: number,
    data: PatchedFeedback,
    params: RequestParams = {},
  ) =>
    this.request<Feedback, any>({
      path: `/api-v1/feedback/${id}/`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Users can submit feedback; admins can browse all feedback.
   *
   * @tags api-v1
   * @name ApiV1FeedbackDestroy
   * @request DELETE:/api-v1/feedback/{id}/
   * @secure
   */
  apiV1FeedbackDestroy = (id: number, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api-v1/feedback/${id}/`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1LocationsList
   * @request GET:/api-v1/locations/
   * @secure
   */
  apiV1LocationsList = (
    query?: {
      name?: string;
      /** Which field to use when ordering the results. */
      ordering?: string;
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
      region?:
        | "Ahafo"
        | "Ashanti"
        | "Bono East"
        | "Brong Ahafo"
        | "Central"
        | "Eastern"
        | "Greater Accra"
        | "North East"
        | "Northern"
        | "Oti"
        | "Savannah"
        | "Upper East"
        | "Upper West"
        | "Volta"
        | "Western"
        | "Western North";
      /** A search term. */
      search?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<Location[], any>({
      path: `/api-v1/locations/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1LocationsCreate
   * @request POST:/api-v1/locations/
   * @secure
   */
  apiV1LocationsCreate = (data: Location, params: RequestParams = {}) =>
    this.request<Location, any>({
      path: `/api-v1/locations/`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1LocationsRetrieve
   * @request GET:/api-v1/locations/{id}/
   * @secure
   */
  apiV1LocationsRetrieve = (id: number, params: RequestParams = {}) =>
    this.request<Location, any>({
      path: `/api-v1/locations/${id}/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1LocationsUpdate
   * @request PUT:/api-v1/locations/{id}/
   * @secure
   */
  apiV1LocationsUpdate = (
    id: number,
    data: Location,
    params: RequestParams = {},
  ) =>
    this.request<Location, any>({
      path: `/api-v1/locations/${id}/`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1LocationsPartialUpdate
   * @request PATCH:/api-v1/locations/{id}/
   * @secure
   */
  apiV1LocationsPartialUpdate = (
    id: number,
    data: PatchedLocation,
    params: RequestParams = {},
  ) =>
    this.request<Location, any>({
      path: `/api-v1/locations/${id}/`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1LocationsDestroy
   * @request DELETE:/api-v1/locations/{id}/
   * @secure
   */
  apiV1LocationsDestroy = (id: number, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api-v1/locations/${id}/`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * @description Login api endpoint
   *
   * @tags api-v1
   * @name Login
   * @request POST:/api-v1/login/
   * @secure
   */
  login = (data: Login, params: RequestParams = {}) =>
    this.request<LoginResponse, GenericMessage>({
      path: `/api-v1/login/`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Logout user
   *
   * @tags api-v1
   * @name Logout
   * @request POST:/api-v1/logout/
   * @secure
   */
  logout = (data: SimpleStatus, params: RequestParams = {}) =>
    this.request<SimpleStatus, any>({
      path: `/api-v1/logout/`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1MessagesList
   * @request GET:/api-v1/messages/
   * @secure
   */
  apiV1MessagesList = (
    query?: {
      /** Which field to use when ordering the results. */
      ordering?: string;
      room?: number;
      /** A search term. */
      search?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<Message[], any>({
      path: `/api-v1/messages/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1MessagesRetrieve
   * @request GET:/api-v1/messages/{id}/
   * @secure
   */
  apiV1MessagesRetrieve = (id: number, params: RequestParams = {}) =>
    this.request<Message, any>({
      path: `/api-v1/messages/${id}/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Login api endpoint using OTP
   *
   * @tags api-v1
   * @name OtpLogin
   * @request POST:/api-v1/otplogin/
   * @secure
   */
  otpLogin = (data: VerifyOTPPostRequest, params: RequestParams = {}) =>
    this.request<LoginResponse, GenericMessage>({
      path: `/api-v1/otplogin/`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Read-only access to payment records. This is mainly for admin dashboards and debugging; the actual Paystack interaction (initiation/webhook) endpoints are implemented in the PaystackPaymentViewSet.
   *
   * @tags api-v1
   * @name ApiV1PaymentsList
   * @request GET:/api-v1/payments/
   * @secure
   */
  apiV1PaymentsList = (
    query?: {
      /** Which field to use when ordering the results. */
      ordering?: string;
      provider?: string;
      /** A search term. */
      search?: string;
      /**
       * * `PENDING` - Pending
       * * `SUCCESS` - Success
       * * `FAILED` - Failed
       */
      status?: "FAILED" | "PENDING" | "SUCCESS";
      subscription?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<Payment[], any>({
      path: `/api-v1/payments/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Read-only access to payment records. This is mainly for admin dashboards and debugging; the actual Paystack interaction (initiation/webhook) endpoints are implemented in the PaystackPaymentViewSet.
   *
   * @tags api-v1
   * @name ApiV1PaymentsRetrieve
   * @request GET:/api-v1/payments/{id}/
   * @secure
   */
  apiV1PaymentsRetrieve = (id: number, params: RequestParams = {}) =>
    this.request<Payment, any>({
      path: `/api-v1/payments/${id}/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Initiate a Paystack payment for a subscription. Expects: {"subscription_id": <id>, "callback_url": "https://..."}
   *
   * @tags api-v1
   * @name ApiV1PaystackInitiateCreate
   * @request POST:/api-v1/paystack/initiate/
   * @secure
   */
  apiV1PaystackInitiateCreate = (params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api-v1/paystack/initiate/`,
      method: "POST",
      secure: true,
      ...params,
    });
  /**
   * @description Paystack webhook to confirm payments and create UserSubscriptions. Configure Paystack to send webhooks to this endpoint.
   *
   * @tags api-v1
   * @name ApiV1PaystackWebhookCreate
   * @request POST:/api-v1/paystack/webhook/
   * @secure
   */
  apiV1PaystackWebhookCreate = (params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api-v1/paystack/webhook/`,
      method: "POST",
      secure: true,
      ...params,
    });
  /**
   * @description Admin CRUD for privacy policies; public read access to latest version.
   *
   * @tags api-v1
   * @name ApiV1PrivacyPoliciesList
   * @request GET:/api-v1/privacy-policies/
   * @secure
   */
  apiV1PrivacyPoliciesList = (
    query?: {
      /** @format date */
      date?: string;
      /** Which field to use when ordering the results. */
      ordering?: string;
      /** A search term. */
      search?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<PrivacyPolicy[], any>({
      path: `/api-v1/privacy-policies/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Admin CRUD for privacy policies; public read access to latest version.
   *
   * @tags api-v1
   * @name ApiV1PrivacyPoliciesCreate
   * @request POST:/api-v1/privacy-policies/
   * @secure
   */
  apiV1PrivacyPoliciesCreate = (
    data: PrivacyPolicy,
    params: RequestParams = {},
  ) =>
    this.request<PrivacyPolicy, any>({
      path: `/api-v1/privacy-policies/`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Admin CRUD for privacy policies; public read access to latest version.
   *
   * @tags api-v1
   * @name ApiV1PrivacyPoliciesRetrieve
   * @request GET:/api-v1/privacy-policies/{id}/
   * @secure
   */
  apiV1PrivacyPoliciesRetrieve = (id: number, params: RequestParams = {}) =>
    this.request<PrivacyPolicy, any>({
      path: `/api-v1/privacy-policies/${id}/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Admin CRUD for privacy policies; public read access to latest version.
   *
   * @tags api-v1
   * @name ApiV1PrivacyPoliciesUpdate
   * @request PUT:/api-v1/privacy-policies/{id}/
   * @secure
   */
  apiV1PrivacyPoliciesUpdate = (
    id: number,
    data: PrivacyPolicy,
    params: RequestParams = {},
  ) =>
    this.request<PrivacyPolicy, any>({
      path: `/api-v1/privacy-policies/${id}/`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Admin CRUD for privacy policies; public read access to latest version.
   *
   * @tags api-v1
   * @name ApiV1PrivacyPoliciesPartialUpdate
   * @request PATCH:/api-v1/privacy-policies/{id}/
   * @secure
   */
  apiV1PrivacyPoliciesPartialUpdate = (
    id: number,
    data: PatchedPrivacyPolicy,
    params: RequestParams = {},
  ) =>
    this.request<PrivacyPolicy, any>({
      path: `/api-v1/privacy-policies/${id}/`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Admin CRUD for privacy policies; public read access to latest version.
   *
   * @tags api-v1
   * @name ApiV1PrivacyPoliciesDestroy
   * @request DELETE:/api-v1/privacy-policies/{id}/
   * @secure
   */
  apiV1PrivacyPoliciesDestroy = (id: number, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api-v1/privacy-policies/${id}/`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * @description Admin CRUD for privacy policies; public read access to latest version.
   *
   * @tags api-v1
   * @name ApiV1PrivacyPoliciesLatestRetrieve
   * @request GET:/api-v1/privacy-policies/latest/
   * @secure
   */
  apiV1PrivacyPoliciesLatestRetrieve = (params: RequestParams = {}) =>
    this.request<PrivacyPolicy, any>({
      path: `/api-v1/privacy-policies/latest/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1ProductFeaturesList
   * @request GET:/api-v1/product-features/
   * @secure
   */
  apiV1ProductFeaturesList = (
    query?: {
      feature?: number;
      /** Which field to use when ordering the results. */
      ordering?: string;
      product?: number;
      /** A search term. */
      search?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<ProductFeature[], any>({
      path: `/api-v1/product-features/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1ProductFeaturesCreate
   * @request POST:/api-v1/product-features/
   * @secure
   */
  apiV1ProductFeaturesCreate = (
    data: ProductFeature,
    params: RequestParams = {},
  ) =>
    this.request<ProductFeature, any>({
      path: `/api-v1/product-features/`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1ProductFeaturesRetrieve
   * @request GET:/api-v1/product-features/{id}/
   * @secure
   */
  apiV1ProductFeaturesRetrieve = (id: number, params: RequestParams = {}) =>
    this.request<ProductFeature, any>({
      path: `/api-v1/product-features/${id}/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1ProductFeaturesUpdate
   * @request PUT:/api-v1/product-features/{id}/
   * @secure
   */
  apiV1ProductFeaturesUpdate = (
    id: number,
    data: ProductFeature,
    params: RequestParams = {},
  ) =>
    this.request<ProductFeature, any>({
      path: `/api-v1/product-features/${id}/`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1ProductFeaturesPartialUpdate
   * @request PATCH:/api-v1/product-features/{id}/
   * @secure
   */
  apiV1ProductFeaturesPartialUpdate = (
    id: number,
    data: PatchedProductFeature,
    params: RequestParams = {},
  ) =>
    this.request<ProductFeature, any>({
      path: `/api-v1/product-features/${id}/`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1ProductFeaturesDestroy
   * @request DELETE:/api-v1/product-features/{id}/
   * @secure
   */
  apiV1ProductFeaturesDestroy = (id: number, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api-v1/product-features/${id}/`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1ProductImagesList
   * @request GET:/api-v1/product-images/
   * @secure
   */
  apiV1ProductImagesList = (
    query?: {
      /** Which field to use when ordering the results. */
      ordering?: string;
      product?: number;
      /** A search term. */
      search?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<ProductImage[], any>({
      path: `/api-v1/product-images/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1ProductImagesCreate
   * @request POST:/api-v1/product-images/
   * @secure
   */
  apiV1ProductImagesCreate = (data: ProductImage, params: RequestParams = {}) =>
    this.request<ProductImage, any>({
      path: `/api-v1/product-images/`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1ProductImagesRetrieve
   * @request GET:/api-v1/product-images/{id}/
   * @secure
   */
  apiV1ProductImagesRetrieve = (id: number, params: RequestParams = {}) =>
    this.request<ProductImage, any>({
      path: `/api-v1/product-images/${id}/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1ProductImagesUpdate
   * @request PUT:/api-v1/product-images/{id}/
   * @secure
   */
  apiV1ProductImagesUpdate = (
    id: number,
    data: ProductImage,
    params: RequestParams = {},
  ) =>
    this.request<ProductImage, any>({
      path: `/api-v1/product-images/${id}/`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1ProductImagesPartialUpdate
   * @request PATCH:/api-v1/product-images/{id}/
   * @secure
   */
  apiV1ProductImagesPartialUpdate = (
    id: number,
    data: PatchedProductImage,
    params: RequestParams = {},
  ) =>
    this.request<ProductImage, any>({
      path: `/api-v1/product-images/${id}/`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1ProductImagesDestroy
   * @request DELETE:/api-v1/product-images/{id}/
   * @secure
   */
  apiV1ProductImagesDestroy = (id: number, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api-v1/product-images/${id}/`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1ProductsList
   * @request GET:/api-v1/products/
   * @secure
   */
  apiV1ProductsList = (
    query?: {
      /** Which field to use when ordering the results. */
      ordering?: string;
      /** A search term. */
      search?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<Product[], any>({
      path: `/api-v1/products/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Create a product only if user has an active subscription within limits.
   *
   * @tags api-v1
   * @name ApiV1ProductsCreate
   * @request POST:/api-v1/products/
   * @secure
   */
  apiV1ProductsCreate = (data: Product, params: RequestParams = {}) =>
    this.request<Product, any>({
      path: `/api-v1/products/`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1ProductsRetrieve
   * @request GET:/api-v1/products/{id}/
   * @secure
   */
  apiV1ProductsRetrieve = (id: number, params: RequestParams = {}) =>
    this.request<Product, any>({
      path: `/api-v1/products/${id}/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1ProductsUpdate
   * @request PUT:/api-v1/products/{id}/
   * @secure
   */
  apiV1ProductsUpdate = (
    id: number,
    data: Product,
    params: RequestParams = {},
  ) =>
    this.request<Product, any>({
      path: `/api-v1/products/${id}/`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1ProductsPartialUpdate
   * @request PATCH:/api-v1/products/{id}/
   * @secure
   */
  apiV1ProductsPartialUpdate = (
    id: number,
    data: PatchedProduct,
    params: RequestParams = {},
  ) =>
    this.request<Product, any>({
      path: `/api-v1/products/${id}/`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1ProductsDestroy
   * @request DELETE:/api-v1/products/{id}/
   * @secure
   */
  apiV1ProductsDestroy = (id: number, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api-v1/products/${id}/`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1ProductsMarkAsTakenCreate
   * @request POST:/api-v1/products/{id}/mark-as-taken/
   * @secure
   */
  apiV1ProductsMarkAsTakenCreate = (
    id: number,
    data: Product,
    params: RequestParams = {},
  ) =>
    this.request<Product, any>({
      path: `/api-v1/products/${id}/mark-as-taken/`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Set the product (ad) status. Staff-only.
   *
   * @tags api-v1
   * @name ApiV1ProductsSetStatusUpdate
   * @request PUT:/api-v1/products/{id}/set-status/
   * @secure
   */
  apiV1ProductsSetStatusUpdate = (
    id: number,
    data: Product,
    params: RequestParams = {},
  ) =>
    this.request<Product, any>({
      path: `/api-v1/products/${id}/set-status/`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1ProductsRelatedRetrieve
   * @request GET:/api-v1/products/related/
   * @secure
   */
  apiV1ProductsRelatedRetrieve = (params: RequestParams = {}) =>
    this.request<Product, any>({
      path: `/api-v1/products/related/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Redeem referral points in blocks of 2,500 => Ghc 500 per block.
   *
   * @tags api-v1
   * @name RedeemReferralPoints
   * @request POST:/api-v1/redeem-points/
   * @secure
   */
  redeemReferralPoints = (
    data: RedeemReferralResponse,
    params: RequestParams = {},
  ) =>
    this.request<RedeemReferralResponse, GenericMessage>({
      path: `/api-v1/redeem-points/`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Register User api endpoint
   *
   * @tags api-v1
   * @name Register
   * @request POST:/api-v1/register/
   * @secure
   */
  register = (data: RegisterUser, params: RequestParams = {}) =>
    this.request<RegisterUserResponse, GenericMessage>({
      path: `/api-v1/register/`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Reset user password
   *
   * @tags api-v1
   * @name ResetPassword
   * @request POST:/api-v1/resetpassword/
   * @secure
   */
  resetPassword = (data: ResetPassword, params: RequestParams = {}) =>
    this.request<SimpleStatus, GenericMessage>({
      path: `/api-v1/resetpassword/`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1ReviewsList
   * @request GET:/api-v1/reviews/
   * @secure
   */
  apiV1ReviewsList = (
    query?: {
      /** Which field to use when ordering the results. */
      ordering?: string;
      product?: number;
      /** A search term. */
      search?: string;
      user?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<Review[], any>({
      path: `/api-v1/reviews/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1ReviewsCreate
   * @request POST:/api-v1/reviews/
   * @secure
   */
  apiV1ReviewsCreate = (data: CreateReview, params: RequestParams = {}) =>
    this.request<Review, any>({
      path: `/api-v1/reviews/`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1ReviewsRetrieve
   * @request GET:/api-v1/reviews/{id}/
   * @secure
   */
  apiV1ReviewsRetrieve = (id: number, params: RequestParams = {}) =>
    this.request<Review, any>({
      path: `/api-v1/reviews/${id}/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1ReviewsUpdate
   * @request PUT:/api-v1/reviews/{id}/
   * @secure
   */
  apiV1ReviewsUpdate = (id: number, data: Review, params: RequestParams = {}) =>
    this.request<Review, any>({
      path: `/api-v1/reviews/${id}/`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1ReviewsPartialUpdate
   * @request PATCH:/api-v1/reviews/{id}/
   * @secure
   */
  apiV1ReviewsPartialUpdate = (
    id: number,
    data: PatchedReview,
    params: RequestParams = {},
  ) =>
    this.request<Review, any>({
      path: `/api-v1/reviews/${id}/`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1ReviewsDestroy
   * @request DELETE:/api-v1/reviews/{id}/
   * @secure
   */
  apiV1ReviewsDestroy = (id: number, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api-v1/reviews/${id}/`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1SubcategoriesList
   * @request GET:/api-v1/subcategories/
   * @secure
   */
  apiV1SubcategoriesList = (
    query?: {
      category?: number;
      /** Which field to use when ordering the results. */
      ordering?: string;
      /** A search term. */
      search?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<SubCategory[], any>({
      path: `/api-v1/subcategories/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1SubcategoriesCreate
   * @request POST:/api-v1/subcategories/
   * @secure
   */
  apiV1SubcategoriesCreate = (data: SubCategory, params: RequestParams = {}) =>
    this.request<SubCategory, any>({
      path: `/api-v1/subcategories/`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1SubcategoriesRetrieve
   * @request GET:/api-v1/subcategories/{id}/
   * @secure
   */
  apiV1SubcategoriesRetrieve = (id: number, params: RequestParams = {}) =>
    this.request<SubCategory, any>({
      path: `/api-v1/subcategories/${id}/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1SubcategoriesUpdate
   * @request PUT:/api-v1/subcategories/{id}/
   * @secure
   */
  apiV1SubcategoriesUpdate = (
    id: number,
    data: SubCategory,
    params: RequestParams = {},
  ) =>
    this.request<SubCategory, any>({
      path: `/api-v1/subcategories/${id}/`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1SubcategoriesPartialUpdate
   * @request PATCH:/api-v1/subcategories/{id}/
   * @secure
   */
  apiV1SubcategoriesPartialUpdate = (
    id: number,
    data: PatchedSubCategory,
    params: RequestParams = {},
  ) =>
    this.request<SubCategory, any>({
      path: `/api-v1/subcategories/${id}/`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags api-v1
   * @name ApiV1SubcategoriesDestroy
   * @request DELETE:/api-v1/subcategories/{id}/
   * @secure
   */
  apiV1SubcategoriesDestroy = (id: number, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api-v1/subcategories/${id}/`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * @description Admin-only CRUD for subscription packages.
   *
   * @tags api-v1
   * @name ApiV1SubscriptionsList
   * @request GET:/api-v1/subscriptions/
   * @secure
   */
  apiV1SubscriptionsList = (
    query?: {
      duration_days?: number;
      is_active?: boolean;
      max_products?: number;
      /** Which field to use when ordering the results. */
      ordering?: string;
      price?: number;
      /** A search term. */
      search?: string;
      tier?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<Subscription[], any>({
      path: `/api-v1/subscriptions/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Admin-only CRUD for subscription packages.
   *
   * @tags api-v1
   * @name ApiV1SubscriptionsCreate
   * @request POST:/api-v1/subscriptions/
   * @secure
   */
  apiV1SubscriptionsCreate = (data: Subscription, params: RequestParams = {}) =>
    this.request<Subscription, any>({
      path: `/api-v1/subscriptions/`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Admin-only CRUD for subscription packages.
   *
   * @tags api-v1
   * @name ApiV1SubscriptionsRetrieve
   * @request GET:/api-v1/subscriptions/{id}/
   * @secure
   */
  apiV1SubscriptionsRetrieve = (id: number, params: RequestParams = {}) =>
    this.request<Subscription, any>({
      path: `/api-v1/subscriptions/${id}/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Admin-only CRUD for subscription packages.
   *
   * @tags api-v1
   * @name ApiV1SubscriptionsUpdate
   * @request PUT:/api-v1/subscriptions/{id}/
   * @secure
   */
  apiV1SubscriptionsUpdate = (
    id: number,
    data: Subscription,
    params: RequestParams = {},
  ) =>
    this.request<Subscription, any>({
      path: `/api-v1/subscriptions/${id}/`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Admin-only CRUD for subscription packages.
   *
   * @tags api-v1
   * @name ApiV1SubscriptionsPartialUpdate
   * @request PATCH:/api-v1/subscriptions/{id}/
   * @secure
   */
  apiV1SubscriptionsPartialUpdate = (
    id: number,
    data: PatchedSubscription,
    params: RequestParams = {},
  ) =>
    this.request<Subscription, any>({
      path: `/api-v1/subscriptions/${id}/`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Admin-only CRUD for subscription packages.
   *
   * @tags api-v1
   * @name ApiV1SubscriptionsDestroy
   * @request DELETE:/api-v1/subscriptions/{id}/
   * @secure
   */
  apiV1SubscriptionsDestroy = (id: number, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api-v1/subscriptions/${id}/`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * @description Admin CRUD for T&C; public read access to latest version.
   *
   * @tags api-v1
   * @name ApiV1TermsAndConditionsList
   * @request GET:/api-v1/terms-and-conditions/
   * @secure
   */
  apiV1TermsAndConditionsList = (
    query?: {
      /** @format date */
      date?: string;
      /** Which field to use when ordering the results. */
      ordering?: string;
      /** A search term. */
      search?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<TermsAndConditions[], any>({
      path: `/api-v1/terms-and-conditions/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Admin CRUD for T&C; public read access to latest version.
   *
   * @tags api-v1
   * @name ApiV1TermsAndConditionsCreate
   * @request POST:/api-v1/terms-and-conditions/
   * @secure
   */
  apiV1TermsAndConditionsCreate = (
    data: TermsAndConditions,
    params: RequestParams = {},
  ) =>
    this.request<TermsAndConditions, any>({
      path: `/api-v1/terms-and-conditions/`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Admin CRUD for T&C; public read access to latest version.
   *
   * @tags api-v1
   * @name ApiV1TermsAndConditionsRetrieve
   * @request GET:/api-v1/terms-and-conditions/{id}/
   * @secure
   */
  apiV1TermsAndConditionsRetrieve = (id: number, params: RequestParams = {}) =>
    this.request<TermsAndConditions, any>({
      path: `/api-v1/terms-and-conditions/${id}/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Admin CRUD for T&C; public read access to latest version.
   *
   * @tags api-v1
   * @name ApiV1TermsAndConditionsUpdate
   * @request PUT:/api-v1/terms-and-conditions/{id}/
   * @secure
   */
  apiV1TermsAndConditionsUpdate = (
    id: number,
    data: TermsAndConditions,
    params: RequestParams = {},
  ) =>
    this.request<TermsAndConditions, any>({
      path: `/api-v1/terms-and-conditions/${id}/`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Admin CRUD for T&C; public read access to latest version.
   *
   * @tags api-v1
   * @name ApiV1TermsAndConditionsPartialUpdate
   * @request PATCH:/api-v1/terms-and-conditions/{id}/
   * @secure
   */
  apiV1TermsAndConditionsPartialUpdate = (
    id: number,
    data: PatchedTermsAndConditions,
    params: RequestParams = {},
  ) =>
    this.request<TermsAndConditions, any>({
      path: `/api-v1/terms-and-conditions/${id}/`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Admin CRUD for T&C; public read access to latest version.
   *
   * @tags api-v1
   * @name ApiV1TermsAndConditionsDestroy
   * @request DELETE:/api-v1/terms-and-conditions/{id}/
   * @secure
   */
  apiV1TermsAndConditionsDestroy = (id: number, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api-v1/terms-and-conditions/${id}/`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * @description Admin CRUD for T&C; public read access to latest version.
   *
   * @tags api-v1
   * @name ApiV1TermsAndConditionsLatestRetrieve
   * @request GET:/api-v1/terms-and-conditions/latest/
   * @secure
   */
  apiV1TermsAndConditionsLatestRetrieve = (params: RequestParams = {}) =>
    this.request<TermsAndConditions, any>({
      path: `/api-v1/terms-and-conditions/latest/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Users can subscribe to packages and view their subscriptions.
   *
   * @tags api-v1
   * @name ApiV1UserSubscriptionsList
   * @request GET:/api-v1/user-subscriptions/
   * @secure
   */
  apiV1UserSubscriptionsList = (
    query?: {
      /** Which field to use when ordering the results. */
      ordering?: string;
      /** A search term. */
      search?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<UserSubscription[], any>({
      path: `/api-v1/user-subscriptions/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Users can subscribe to packages and view their subscriptions.
   *
   * @tags api-v1
   * @name ApiV1UserSubscriptionsCreate
   * @request POST:/api-v1/user-subscriptions/
   * @secure
   */
  apiV1UserSubscriptionsCreate = (
    data: UserSubscription,
    params: RequestParams = {},
  ) =>
    this.request<UserSubscription, any>({
      path: `/api-v1/user-subscriptions/`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Users can subscribe to packages and view their subscriptions.
   *
   * @tags api-v1
   * @name ApiV1UserSubscriptionsRetrieve
   * @request GET:/api-v1/user-subscriptions/{id}/
   * @secure
   */
  apiV1UserSubscriptionsRetrieve = (id: number, params: RequestParams = {}) =>
    this.request<UserSubscription, any>({
      path: `/api-v1/user-subscriptions/${id}/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Users can subscribe to packages and view their subscriptions.
   *
   * @tags api-v1
   * @name ApiV1UserSubscriptionsUpdate
   * @request PUT:/api-v1/user-subscriptions/{id}/
   * @secure
   */
  apiV1UserSubscriptionsUpdate = (
    id: number,
    data: UserSubscription,
    params: RequestParams = {},
  ) =>
    this.request<UserSubscription, any>({
      path: `/api-v1/user-subscriptions/${id}/`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Users can subscribe to packages and view their subscriptions.
   *
   * @tags api-v1
   * @name ApiV1UserSubscriptionsPartialUpdate
   * @request PATCH:/api-v1/user-subscriptions/{id}/
   * @secure
   */
  apiV1UserSubscriptionsPartialUpdate = (
    id: number,
    data: PatchedUserSubscription,
    params: RequestParams = {},
  ) =>
    this.request<UserSubscription, any>({
      path: `/api-v1/user-subscriptions/${id}/`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Users can subscribe to packages and view their subscriptions.
   *
   * @tags api-v1
   * @name ApiV1UserSubscriptionsDestroy
   * @request DELETE:/api-v1/user-subscriptions/{id}/
   * @secure
   */
  apiV1UserSubscriptionsDestroy = (id: number, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api-v1/user-subscriptions/${id}/`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * @description Get user preferences for the logged in user
   *
   * @tags api-v1
   * @name UserPreferencesGet
   * @request GET:/api-v1/userpreferences/
   * @secure
   */
  userPreferencesGet = (params: RequestParams = {}) =>
    this.request<User, any>({
      path: `/api-v1/userpreferences/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Update user preferences for the logged in user
   *
   * @tags api-v1
   * @name UserPreferencesPut
   * @request PUT:/api-v1/userpreferences/
   * @secure
   */
  userPreferencesPut = (data: UserUpdate, params: RequestParams = {}) =>
    this.request<User, GenericMessage>({
      path: `/api-v1/userpreferences/`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get user profile for the logged in user
   *
   * @tags api-v1
   * @name UserProfileGet
   * @request GET:/api-v1/userprofile/
   * @secure
   */
  userProfileGet = (params: RequestParams = {}) =>
    this.request<User, any>({
      path: `/api-v1/userprofile/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Use this to disable/enable a user account. To be used by admins only
   *
   * @tags api-v1
   * @name UserProfilePost
   * @request POST:/api-v1/userprofile/
   * @secure
   */
  userProfilePost = (data: AdminToggleUser, params: RequestParams = {}) =>
    this.request<User, GenericMessage>({
      path: `/api-v1/userprofile/`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Update user profile for the logged in user
   *
   * @tags api-v1
   * @name UserProfilePut
   * @request PUT:/api-v1/userprofile/
   * @secure
   */
  userProfilePut = (data: UserUpdate, params: RequestParams = {}) =>
    this.request<User, GenericMessage>({
      path: `/api-v1/userprofile/`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Delete user account. To be used by admins only
   *
   * @tags api-v1
   * @name UserProfileDelete
   * @request DELETE:/api-v1/userprofile/
   * @secure
   */
  userProfileDelete = (params: RequestParams = {}) =>
    this.request<GenericMessage, GenericMessage>({
      path: `/api-v1/userprofile/`,
      method: "DELETE",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Use this endpoint to send OTP to the user
   *
   * @tags api-v1
   * @name VerifyOtpGet
   * @request GET:/api-v1/verifyotp/
   * @secure
   */
  verifyOtpGet = (
    query: {
      /** Phone number to which the OTP will be sent. */
      phone: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<GenericMessage, GenericMessage>({
      path: `/api-v1/verifyotp/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Verify OTP api endpoint
   *
   * @tags api-v1
   * @name VerifyOtpPost
   * @request POST:/api-v1/verifyotp/
   * @secure
   */
  verifyOtpPost = (data: VerifyOTPPostRequest, params: RequestParams = {}) =>
    this.request<GenericMessage, GenericMessage>({
      path: `/api-v1/verifyotp/`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
