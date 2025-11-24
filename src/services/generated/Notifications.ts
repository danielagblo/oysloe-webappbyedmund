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
  FCMDevice,
  PatchedFCMDevice,
  SaveFCMTokenRequest,
  SaveFCMTokenResponse,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Notifications<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description Manage FCM device tokens for the authenticated user. POST is idempotent per-token.
   *
   * @tags notifications
   * @name NotificationsDevicesList
   * @request GET:/notifications/devices/
   * @secure
   */
  notificationsDevicesList = (
    query?: {
      /** Which field to use when ordering the results. */
      ordering?: string;
      /** A search term. */
      search?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<FCMDevice[], any>({
      path: `/notifications/devices/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Manage FCM device tokens for the authenticated user. POST is idempotent per-token.
   *
   * @tags notifications
   * @name NotificationsDevicesCreate
   * @request POST:/notifications/devices/
   * @secure
   */
  notificationsDevicesCreate = (data: FCMDevice, params: RequestParams = {}) =>
    this.request<FCMDevice, any>({
      path: `/notifications/devices/`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Manage FCM device tokens for the authenticated user. POST is idempotent per-token.
   *
   * @tags notifications
   * @name NotificationsDevicesRetrieve
   * @request GET:/notifications/devices/{id}/
   * @secure
   */
  notificationsDevicesRetrieve = (id: number, params: RequestParams = {}) =>
    this.request<FCMDevice, any>({
      path: `/notifications/devices/${id}/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Manage FCM device tokens for the authenticated user. POST is idempotent per-token.
   *
   * @tags notifications
   * @name NotificationsDevicesUpdate
   * @request PUT:/notifications/devices/{id}/
   * @secure
   */
  notificationsDevicesUpdate = (
    id: number,
    data: FCMDevice,
    params: RequestParams = {},
  ) =>
    this.request<FCMDevice, any>({
      path: `/notifications/devices/${id}/`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Manage FCM device tokens for the authenticated user. POST is idempotent per-token.
   *
   * @tags notifications
   * @name NotificationsDevicesPartialUpdate
   * @request PATCH:/notifications/devices/{id}/
   * @secure
   */
  notificationsDevicesPartialUpdate = (
    id: number,
    data: PatchedFCMDevice,
    params: RequestParams = {},
  ) =>
    this.request<FCMDevice, any>({
      path: `/notifications/devices/${id}/`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Manage FCM device tokens for the authenticated user. POST is idempotent per-token.
   *
   * @tags notifications
   * @name NotificationsDevicesDestroy
   * @request DELETE:/notifications/devices/{id}/
   * @secure
   */
  notificationsDevicesDestroy = (id: number, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/notifications/devices/${id}/`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags notifications
   * @name NotificationsSaveFcmTokenCreate
   * @request POST:/notifications/save-fcm-token/
   * @secure
   */
  notificationsSaveFcmTokenCreate = (
    data: SaveFCMTokenRequest,
    params: RequestParams = {},
  ) =>
    this.request<SaveFCMTokenResponse, SaveFCMTokenResponse>({
      path: `/notifications/save-fcm-token/`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
