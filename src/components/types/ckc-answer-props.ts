import { type Message } from "./message";
import type { Component } from 'vue';

export interface CkcAnswerProps {
    messages?: Message[];
    historyMessages?: Message[];
    customHtmlTags?: string[];
    renderCustomId?: string;
    isShowRecommendations?: boolean; // 是否展示推荐问，移动端单独渲染
    markdownComponent?: Component; // 接收外部的 Markdown 渲染组件
}