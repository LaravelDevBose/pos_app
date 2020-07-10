import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  public API_URL = 'http://paikari.pc/';
  public CLIENT_SECRET = 'WLYjq5w0BO6H36j7HjARak12kagNj9C61P2L1k3Q';


  //================================================//
  //================================================//
  //=============== HTTP RESPONSE ==================//

  public HTTP_OK = 200;
  public HTTP_NOT_FOUND = 404;
  public HTTP_UNAUTHORIZED = 401;
  public HTTP_NOT_ACCEPTABLE = 406;
  public HTTP_BAD_REQUEST = 400;


  constructor(

  ) { }


}
