/**
 * Original Author: Jack Watson
 * Created Date: 10/25/2021
 * Purpose: This class takes in a affiliate then transforms it into a link which will be displayed on the front-end
 */
import Resume from "../entities/Resume";

export type ResumeView = {
    id: string,
}

export default function transform(resume: Resume): ResumeView
{
    return {
        id: resume.getId()
    }
}
