class ApiService {

    constructor(){
        this.api_url = "http://bciapi.eu-west-1.elasticbeanstalk.com/game/";
    }

    async getBoard(){
        let response = await fetch(this.api_url + 'board',{
            headers: {
                'Authorization': 'Basic '+btoa('Kotkodaky_8:kikirik'),
            }
        })
    }

}