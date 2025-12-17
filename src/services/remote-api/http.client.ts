import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";
import type { Observable } from "rxjs";
import { defer, from } from "rxjs";

import { config } from "./api/configuration";

export class HttpClient {
  private axiosInstance: AxiosInstance;
  constructor(baseUrl?: string) {
    this.axiosInstance = axios.create({ baseURL: baseUrl });

    // this.axiosInstance.defaults.headers

    const requestHandler = (request: any) => {
      // const token: any = (window as any)["getToken"] && (window as any)["getToken"]()

      //       if(request.url.slice(0,40) == `${config.rootUrl}sha-rule-service`){
      //         const obj = {
      //           Accept: "application/json, text/plain, */*"
      //         }

      //         request.headers = obj;

      // return request;
      //       }

      // if (token) {
      //   request.headers.Authorization = `Bearer ${token}`;
      // }


      return request;
    };

    const errorHandler = (error: any) => {
      return Promise.reject(error);
    };

    this.axiosInstance.interceptors.request.use(
      (request) => requestHandler(request),
      (error) => errorHandler(error)
    );


    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (window && window.document) {
          const event = new CustomEvent('errorHappend', {
            detail: {
              response: error.response
            }
          });

          window.document.dispatchEvent(event);

          // Handle 401 Unauthorized error
          if (error.response?.status === 401) {
            console.log('Unauthorized! Logging out...');
            localStorage.clear();
            window.location.href = '/api/auth/logout'
          }

          return Promise.reject(error);
        }
      }
    );

  }

  // private successTransformer(response: AxiosResponse): T {
  //     return response.data;
  // }

  // private errorTransformer(response: AxiosResponse): T {
  //     return response.data;
  // }

  // private errorHandle(): OperatorFunction<any, any> {
  //     return catchError(data => of(this.errorTransformer(data)));
  // }

  // private handleResponse() {
  //     return map(this.successTransformer);
  // }



  convertToURLSearchParams(param: any) {
    if (param) {
      const searchParam = new URLSearchParams();

      for (const key in param) {
        const value = param[key];

        if (Array.isArray(value)) {
          value.forEach(item => {
            searchParam.append(key, item);
          })
        } else {
          searchParam.append(key, value);
        }
      }


      return searchParam;
    }


    return param;
  }

  get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Observable<AxiosResponse<T>> {
    config = config && {
      ...config,
      params: this.convertToURLSearchParams(config.params)
    };

    return defer(() => from(this.axiosInstance.get<T, AxiosResponse<T>>(url, config)));
  }

  post<T>(
    url: string,
    body?: any,
    config?: AxiosRequestConfig
  ): Observable<AxiosResponse<T>> {
    config = config && {
      ...config,
      params: this.convertToURLSearchParams(config.params)
    };

    return defer(() => from(
      this.axiosInstance.post<T, AxiosResponse<T>>(url, body, config)
    ));
  }

  put<T>(
    url: string,
    body?: any,
    config?: AxiosRequestConfig
  ): Observable<AxiosResponse<T>> {
    config = config && {
      ...config,
      params: this.convertToURLSearchParams(config.params)
    };

    return defer(() => from(this.axiosInstance.put<T, AxiosResponse<T>>(url, body, config)));
  }

  patch<T>(
    url: string,
    body?: any,
    config?: AxiosRequestConfig
  ): Observable<AxiosResponse<T>> {
    config = config && {
      ...config,
      params: this.convertToURLSearchParams(config.params)
    };

    return defer(() => from(
      this.axiosInstance.patch<T, AxiosResponse<T>>(url, body, config)
    ));
  }


  delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Observable<AxiosResponse<T>> {
    config = config && {
      ...config,
      params: this.convertToURLSearchParams(config.params)
    };

    return defer(() => from(this.axiosInstance.delete<T, AxiosResponse<T>>(url, config)));
  }

  options<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Observable<AxiosResponse<T>> {
    config = config && {
      ...config,
      params: this.convertToURLSearchParams(config.params)
    };

    return defer(() => from(this.axiosInstance.options<T, AxiosResponse<T>>(url, config)));
  }

  head<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Observable<AxiosResponse<T>> {
    config = config && {
      ...config,
      params: this.convertToURLSearchParams(config.params)
    };

    return defer(() => from(this.axiosInstance.head<T, AxiosResponse<T>>(url, config)));
  }
}

export const http = new HttpClient(config.rootUrl);



// import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
// import axios from "axios";
// import type { Observable } from "rxjs";
// import { defer, from } from "rxjs";
// import { config } from "./api/configuration";

// let isRefreshing = false;
// let failedQueue: any[] = [];

// const processQueue = (error: any, token: string | null = null) => {
//   failedQueue.forEach(prom => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
//   failedQueue = [];
// };

// export class HttpClient {
//   private axiosInstance: AxiosInstance;

//   constructor(baseUrl?: string) {
//     this.axiosInstance = axios.create({ baseURL: baseUrl });

//     this.axiosInstance.interceptors.request.use(
//       (request) => this.requestHandler(request),
//       (error) => Promise.reject(error)
//     );

//     this.axiosInstance.interceptors.response.use(
//       (response) => response,
//       (error) => this.responseErrorHandler(error)
//     );
//   }

//   private requestHandler(request: any) {
//     const token = localStorage.getItem("access_token");
//     if (token) {
//       request.headers.Authorization = `Bearer ${token}`;
//     }
//     return request;
//   }

//   private responseErrorHandler(error: any) {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//           .then((token) => {
//             originalRequest.headers["Authorization"] = "Bearer " + token;
//             return this.axiosInstance(originalRequest);
//           })
//           .catch((err) => {
//             return Promise.reject(err);
//           });
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       const refreshToken = localStorage.getItem("refresh_token");
//       console.log("qwertyu", refreshToken)
//       if (!refreshToken) {
//         console.log("1111111", refreshToken)
//         this.logoutUser();
//         return Promise.reject(error);
//       }

//       return new Promise((resolve, reject) => {
//         this.refreshToken(refreshToken)
//           .then((newAccessToken: string) => {
//             localStorage.setItem("access_token", newAccessToken);
//             originalRequest.headers["Authorization"] = "Bearer " + newAccessToken;
//             processQueue(null, newAccessToken);
//             resolve(this.axiosInstance(originalRequest));
//           })
//           .catch((err) => {
//             processQueue(err, null);
//             this.logoutUser();
//             reject(err);
//           })
//           .finally(() => {
//             isRefreshing = false;
//           });
//       });
//     }

//     return Promise.reject(error);
//   }

//   private async refreshToken(refreshToken: string): Promise<string> {
//     const params = new URLSearchParams();
//     params.append('grant_type', 'refresh_token');
//     params.append('client_id', process.env.AUTH_KEYCLOAK_ID!);
//     params.append('client_secret', process.env.AUTH_KEYCLOAK_SECRET!);
//     params.append('refresh_token', refreshToken);

//     try {
//       const response = await axios.post(
//         `${config.keycloakIssuer}/protocol/openid-connect/token`,
//         params,
//         {
//           headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//           },
//         }
//       );

//       const { access_token, refresh_token: newRefreshToken } = response.data;

//       // Update tokens in localStorage
//       localStorage.setItem('access_token', access_token);
//       localStorage.setItem('refresh_token', newRefreshToken);

//       return access_token;
//     } catch (err) {
//       throw err;
//     }
//   }


//   private logoutUser() {
//     console.log('Unauthorized! Logging out...');
//     localStorage.clear();
//     window.location.href = '/api/auth/logout';
//   }

//   convertToURLSearchParams(param: any) {
//     if (param) {
//       const searchParam = new URLSearchParams();
//       for (const key in param) {
//         const value = param[key];
//         if (Array.isArray(value)) {
//           value.forEach(item => searchParam.append(key, item));
//         } else {
//           searchParam.append(key, value);
//         }
//       }
//       return searchParam;
//     }
//     return param;
//   }

//   get<T>(url: string, config?: AxiosRequestConfig): Observable<AxiosResponse<T>> {
//     config = config && { ...config, params: this.convertToURLSearchParams(config.params) };
//     return defer(() => from(this.axiosInstance.get<T, AxiosResponse<T>>(url, config)));
//   }

//   post<T>(url: string, body?: any, config?: AxiosRequestConfig): Observable<AxiosResponse<T>> {
//     config = config && { ...config, params: this.convertToURLSearchParams(config.params) };
//     return defer(() => from(this.axiosInstance.post<T, AxiosResponse<T>>(url, body, config)));
//   }

//   put<T>(url: string, body?: any, config?: AxiosRequestConfig): Observable<AxiosResponse<T>> {
//     config = config && { ...config, params: this.convertToURLSearchParams(config.params) };
//     return defer(() => from(this.axiosInstance.put<T, AxiosResponse<T>>(url, body, config)));
//   }

//   patch<T>(url: string, body?: any, config?: AxiosRequestConfig): Observable<AxiosResponse<T>> {
//     config = config && { ...config, params: this.convertToURLSearchParams(config.params) };
//     return defer(() => from(this.axiosInstance.patch<T, AxiosResponse<T>>(url, body, config)));
//   }

//   delete<T>(url: string, config?: AxiosRequestConfig): Observable<AxiosResponse<T>> {
//     config = config && { ...config, params: this.convertToURLSearchParams(config.params) };
//     return defer(() => from(this.axiosInstance.delete<T, AxiosResponse<T>>(url, config)));
//   }

//   options<T>(url: string, config?: AxiosRequestConfig): Observable<AxiosResponse<T>> {
//     config = config && { ...config, params: this.convertToURLSearchParams(config.params) };
//     return defer(() => from(this.axiosInstance.options<T, AxiosResponse<T>>(url, config)));
//   }

//   head<T>(url: string, config?: AxiosRequestConfig): Observable<AxiosResponse<T>> {
//     config = config && { ...config, params: this.convertToURLSearchParams(config.params) };
//     return defer(() => from(this.axiosInstance.head<T, AxiosResponse<T>>(url, config)));
//   }
// }

// export const http = new HttpClient(config.rootUrl);
