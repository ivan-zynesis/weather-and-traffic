/* tslint:disable */
/* eslint-disable */
/**
 * Weather Forecast and Traffic Monitoring
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 0.0.0
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

import { TrafficCamData } from "./traffic-cam-data";
/**
 *
 *
 * @export
 * @interface TrafficCamDataResponse
 */
export interface TrafficCamDataResponse {
  /**
   * @type {string}
   * @memberof TrafficCamDataResponse
   */
  timestamp?: string;

  /**
   * @type {Array<TrafficCamData>}
   * @memberof TrafficCamDataResponse
   */
  cameras: Array<TrafficCamData>;
}
