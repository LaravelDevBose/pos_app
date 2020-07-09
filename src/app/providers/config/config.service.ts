import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  public APP_URL = '';
  public CLIENT_SECRET = 'UFPXbTuQp4tGut4YvwzGCpwvYoejWeLVUKX0q3xu';


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
