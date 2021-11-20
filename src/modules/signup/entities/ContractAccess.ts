/**
 * Original Author: Jack Watosn
 * Created Date: 11/20/2021
 * Purpose: This class will dictate access to contracts that the frontend needs access to.
 */

export default class ContractAccess
{
    private fileName: string;
    private tokenValidated: boolean;
    private tokenExpired: number;

    constructor(fileName: string, tokenValidated: boolean, tokenExpired: number)
    {
        this.fileName       = fileName;
        this.tokenValidated = tokenValidated;
        this.tokenExpired   = tokenExpired;
    }

    /**
     * Let a consumer of this contract access have the ability to see if this contract access is allowed to be viewed. Technically
     * this poses an issue since you can just avoid using this it depends on the consumer of this API.
     */
    public canView()
    {
        return Date.now() < this.tokenExpired && ! this.tokenValidated ;
    }

    public getFileName()
    {
        return this.fileName;
    }
}
