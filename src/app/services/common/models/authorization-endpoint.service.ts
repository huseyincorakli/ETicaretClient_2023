import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Observable,firstValueFrom } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class AuthorizationEndpointService {

  constructor(private httpClientService: HttpClientService) { }

  async assignRoleEndpoint(roles: string[], code: string, menu: string, successCallBack?: () => void, errorCallBack?: (error) => void) {
    const observable: Observable<any> = this.httpClientService.post({
      controller: 'AuthorizationEndpoints'

    }, { roles: roles, menu: menu, code: code })

    const promiseData = firstValueFrom(observable).then(successCallBack).catch(errorCallBack)

    await promiseData;
  }

  async getRolesToEndpoint(code: string, menu: string, successCallBack?: () => void, errorCallBack?: (error) => void): Promise<string[]> {
    const observable: Observable<any> = this.httpClientService.post({
      controller: "AuthorizationEndpoints",
      action: "GetRolesToEndpoint"
    }, {
      code: code,
      menu: menu
    });

    const promiseData = firstValueFrom(observable);
    promiseData.then(successCallBack)
      .catch(errorCallBack);

    return (await promiseData).roles;
  }
}




