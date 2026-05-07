import { type Message } from "./message";
export interface CkcAnswerProps {
    messages?: Message[];
    historyMessages?: Message[];
    customHtmlTags?: string[];
    renderCustomId?: string;
}