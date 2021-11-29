/**
 * Original Author: Jack Watson
 * Created Date: 11/3/2021
 * Purpose: This class serves as a wrapper to the fs dependency in node.js. I was debating having multiple methods to 
 * make it very strict which folders you can write to. But I have decided that it would be best to simply just write to
 * the different elements based on the parameter you pass in. So you pick from the folders that have read / write access
 * then you can read and write to those select folders.
 */

import objectHash from "object-hash";
import fs from "fs";

// Define the types that are allowed into the functions below... this is interesting to say the least. Like these
// are still string types.
type Document = string;
type Cache    = string;
type Template = string;

const DOCUMENT: Document = "/../../../documents/";
const CACHE: Cache       = "/../../../.cache/";
const TEMPLATE: Template = "/../../../templates/";

/**
 * Get the full path of the contract in our system.
 * @param directory Directory we chose in the root of the project
 * @param file The file we want to get the full path of
 */
function absolutePath(directory: Document|Cache|Template, file: string)
{
    return `${__dirname}${directory}${file}`;
}

/**
 * Remove a file from the operating syste.
 * @param directory Directory we are currently removing from.
 * @param file File we are removing from within the directory.
 */
async function remove(directory: Cache, file: string): Promise<string>
{
    return new Promise( (resolve, reject) => {
        fs.unlink( absolutePath(directory, file), err => {
            if(err)
            {
                reject(err);
            }

            resolve(`${file} successfully removed`);
        } );
    } );
}

/**
 * Return as a string the expected output. I should be able to set the expected output through a template
 * @param directory Directory we are reading from.
 * @param file Get the file that we want to read
 */
async function read(directory: Document|Cache|Template, file: string): Promise<string>
{
    return new Promise( (resolve, reject) => {
        fs.readFile(absolutePath(directory, file), "utf8", ( err, data ) => {
            if(err)
            {
                reject(err);
            }

            resolve(data);
        } );
    } );
}

/**
 * Write a file to the drive on the system. Use only the allowed directories to be written to within the function.
 * @param directory Directory we are writing to.
 * @param file File name we are writing to within the directory.
 * @param data Data we are writing to the file.
 */
async function write(directory: Document|Cache, data: any): Promise<string>
{
    // If we don't pass in a filename then we will generate a file name. this can be useful if we are
    // storing something in the cache. We will seperate the filesystem API with the caching API soon!
    const fileName: string = objectHash.MD5(data);

    return new Promise( (resolve, reject) => {
        fs.writeFile(absolutePath(directory, fileName), data, err => {
            if(err)
            {
                reject(err);
            }            
            resolve(fileName);
        } );
    } );
}

export default { absolutePath, write, read, remove, DOCUMENT, CACHE, TEMPLATE }
