export class ConfigService {
  private urlService : string;

  constructor(){
    this.urlService = "https://lennin.herokuapp.com";

  }

  getUrlService(){
    return this.urlService;
  }

}
