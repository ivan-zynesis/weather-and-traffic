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

import { ImageMetadata } from "./image-metadata";
/**
 *
 *
 * @export
 * @interface Image
 */
export interface Image {
  /**
   * @type {string}
   * @memberof Image
   */
  src: string;

  /**
   * @type {ImageMetadata}
   * @memberof Image
   */
  metadata: ImageMetadata;
}
