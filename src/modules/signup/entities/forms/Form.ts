/**
 * Original Author: Jack Watson
 * Created Date: 11/29/2021
 * Purpose: This form interface holds the contract which we can depend on since we do not know the type of form data
 * until compile time.
 */

export interface Form {
    getData(): {}
}
