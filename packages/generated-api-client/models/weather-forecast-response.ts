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

import { Forecast } from "./forecast";
/**
 *
 *
 * @export
 * @interface WeatherForecastResponse
 */
export interface WeatherForecastResponse {
  /**
   * @type {string}
   * @memberof WeatherForecastResponse
   */
  timestamp: string;

  /**
   * @type {string}
   * @memberof WeatherForecastResponse
   */
  updateTimestamp: string;

  /**
   * @type {string}
   * @memberof WeatherForecastResponse
   */
  validPeriod: string;

  /**
   * @type {Array<Forecast>}
   * @memberof WeatherForecastResponse
   */
  forecasts: Array<Forecast>;
}
