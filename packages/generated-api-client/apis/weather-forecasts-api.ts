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

import globalAxios, {
  AxiosResponse,
  AxiosInstance,
  AxiosRequestConfig,
} from "axios";
import { Configuration } from "../configuration";
// Some imports not used depending on template conditions
// @ts-ignore
import {
  BASE_PATH,
  COLLECTION_FORMATS,
  RequestArgs,
  BaseAPI,
  RequiredError,
} from "../base";
import { WeatherForecastResponse } from "../models";
/**
 * WeatherForecastsApi - axios parameter creator
 * @export
 */
export const WeatherForecastsApiAxiosParamCreator = function (
  configuration?: Configuration,
) {
  return {
    /**
     *
     * @param {string} coordinate &lt;lat&gt;,&lt;lng&gt;
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    weatherForecastControllerGet: async (
      coordinate: string,
      options: AxiosRequestConfig = {},
    ): Promise<RequestArgs> => {
      // verify required parameter 'coordinate' is not null or undefined
      if (coordinate === null || coordinate === undefined) {
        throw new RequiredError(
          "coordinate",
          "Required parameter coordinate was null or undefined when calling weatherForecastControllerGet.",
        );
      }
      const localVarPath = `/weather-forecast`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, "https://example.com");
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }
      const localVarRequestOptions: AxiosRequestConfig = {
        method: "GET",
        ...baseOptions,
        ...options,
      };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      if (coordinate !== undefined) {
        localVarQueryParameter["coordinate"] = coordinate;
      }

      const query = new URLSearchParams(localVarUrlObj.search);
      for (const key in localVarQueryParameter) {
        query.set(key, localVarQueryParameter[key]);
      }
      for (const key in options.params) {
        query.set(key, options.params[key]);
      }
      localVarUrlObj.search = new URLSearchParams(query).toString();
      let headersFromBaseOptions =
        baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers,
      };

      return {
        url:
          localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
        options: localVarRequestOptions,
      };
    },
  };
};

/**
 * WeatherForecastsApi - functional programming interface
 * @export
 */
export const WeatherForecastsApiFp = function (configuration?: Configuration) {
  return {
    /**
     *
     * @param {string} coordinate &lt;lat&gt;,&lt;lng&gt;
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async weatherForecastControllerGet(
      coordinate: string,
      options?: AxiosRequestConfig,
    ): Promise<
      (
        axios?: AxiosInstance,
        basePath?: string,
      ) => Promise<AxiosResponse<WeatherForecastResponse>>
    > {
      const localVarAxiosArgs = await WeatherForecastsApiAxiosParamCreator(
        configuration,
      ).weatherForecastControllerGet(coordinate, options);
      return (
        axios: AxiosInstance = globalAxios,
        basePath: string = BASE_PATH,
      ) => {
        const axiosRequestArgs: AxiosRequestConfig = {
          ...localVarAxiosArgs.options,
          url: basePath + localVarAxiosArgs.url,
        };
        return axios.request(axiosRequestArgs);
      };
    },
  };
};

/**
 * WeatherForecastsApi - factory interface
 * @export
 */
export const WeatherForecastsApiFactory = function (
  configuration?: Configuration,
  basePath?: string,
  axios?: AxiosInstance,
) {
  return {
    /**
     *
     * @param {string} coordinate &lt;lat&gt;,&lt;lng&gt;
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async weatherForecastControllerGet(
      coordinate: string,
      options?: AxiosRequestConfig,
    ): Promise<AxiosResponse<WeatherForecastResponse>> {
      return WeatherForecastsApiFp(configuration)
        .weatherForecastControllerGet(coordinate, options)
        .then((request) => request(axios, basePath));
    },
  };
};

/**
 * WeatherForecastsApi - object-oriented interface
 * @export
 * @class WeatherForecastsApi
 * @extends {BaseAPI}
 */
export class WeatherForecastsApi extends BaseAPI {
  /**
   *
   * @param {string} coordinate &lt;lat&gt;,&lt;lng&gt;
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof WeatherForecastsApi
   */
  public async weatherForecastControllerGet(
    coordinate: string,
    options?: AxiosRequestConfig,
  ): Promise<AxiosResponse<WeatherForecastResponse>> {
    return WeatherForecastsApiFp(this.configuration)
      .weatherForecastControllerGet(coordinate, options)
      .then((request) => request(this.axios, this.basePath));
  }
}
