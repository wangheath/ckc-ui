import { type Message } from "./message";
import type { Component } from 'vue';

export interface CkcAnswerProps {
    messages?: Message[];
    historyMessages?: Message[];
    customHtmlTags?: string[];
    renderCustomId?: string;
    markdownComponent?: Component; // 接收外部的 Markdown 渲染组件
}