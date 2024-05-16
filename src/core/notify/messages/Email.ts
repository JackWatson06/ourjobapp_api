import Message from "./Message"

type Attachment = {
    path: string,
    name: string
}

interface Email extends Message {
    address      : string,
    html        ?: string,
    attachments ?: Array<Attachment>
}

export {Email};
