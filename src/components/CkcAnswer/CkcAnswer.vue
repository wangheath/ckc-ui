<template>
  <div class="ckc-ui-upload-heart" v-if="uploadHeartInfo && currentMeassageViewInfo.length === 0">
    <img class="ckc-ui-loading" src="../../assets/imgs/loading.gif" alt="avatar" />
    正在执行：{{ uploadHeartInfo.task }} 
    <span style="margin-left: 20px;">进度： {{ uploadHeartInfo.percent }}</span>
  </div>
  <div>
    <template v-for="(meassageGroupView, index) in currentMeassageViewInfo" :key="index">
      <div  v-if="meassageGroupView.messageGroupInfo.length > 0">
        <CkcAnswerThinkingHead 
          :messageGroupView="meassageGroupView" 
          :currentMessageViewInfo="currentMeassageViewInfo" />
        <CkcAnswerDocuments 
          v-if="meassageGroupView.isDocumentGroup" 
          :meassageGroupView="meassageGroupView"
          @clickDocument="clickDocument" />
        <template v-else>
          <div v-show="meassageGroupView.isExpanded">  
            <div v-for="message in meassageGroupView.messageGroupInfo">
                <div v-show="message.thinkingIsExpanded">
                  <CkcAnswerThinking 
                    v-if="message.type === MessageType.THINKING" 
                    :message="message.content as string"
                    :renderCustomId="prop.renderCustomId" 
                    :customHtmlTags="prop.customHtmlTags" />
                  <CkcAnswerToolUse 
                    v-if="message.type === MessageType.TOOL_USE" 
                    :toolUseComplete="meassageGroupView.toolUseComplete"
                    :message="message.content as string" />
                  <CkcAnswerToolUseSilent
                    v-if="message.type === MessageType.TOOL_USE_SILENT"
                    :toolUseComplete="meassageGroupView.toolUseComplete"
                    :message="message.content as string" />
                  <CkcAnswerContent 
                    v-if="message.type === MessageType.ANSWER" 
                    :message="message.content as string"
                    :renderCustomId="prop.renderCustomId" 
                    :customHtmlTags="prop.customHtmlTags" />  
                </div>
              </div>
            </div>
        </template>
      </div>
    </template>
    <div v-if="end && $slots.actions">
      <slot name="actions" :messageViewInfo="currentMeassageViewInfo"></slot>
    </div>
    <CkcAnswerRecommendations 
      @clickRecomendation="clickRecomendation" v-if="recommendations.length > 0" 
      :messages="recommendations"  />
  </div>
</template>

<script setup lang="ts">
import { watch, ref, provide } from 'vue';
import type { CkcAnswerProps } from '../types/ckc-answer-props';
import { MessageType, type Document } from '../types/message';
import { useMessageView } from '../composables/useMessageView';
import CkcAnswerThinking from './CkcAnswerThinking.vue';
import CkcAnswerToolUse from './CkcAnswerToolUse.vue';
import CkcAnswerToolUseSilent from './CkcAnswerToolUseSilent.vue';
import CkcAnswerContent from './CkcAnswerContent.vue';
import CkcAnswerThinkingHead from './CkcAnswerThinkingHead.vue';
import CkcAnswerDocuments from './CkcAnswerDocuments.vue';
import CkcAnswerRecommendations from './CkcAnswerRecommendations.vue';
const prop = defineProps<CkcAnswerProps>();

// 提供 markdown 渲染组件，默认使用 markstream-vue，也可外部传入
if (prop.markdownComponent) {
  provide('markdownComponent', prop.markdownComponent);
}
const emit = defineEmits<{  
  (e: 'clickRecomendation', message: string) : void 
  (e: 'clickDocument', message: Document) : void 
}>();
const { currentMeassageViewInfo,recommendations,end, handleData, uploadHeartInfo } = useMessageView();
const lastProcessedIndex = ref(0);
const lastProcessedHistoryIndex = ref(0);

function clickRecomendation(message: string) {
  emit('clickRecomendation', message);
}

function clickDocument(message: Document) {
  emit('clickDocument', message);
}

watch(() => prop.messages, (newVal) => {
  if (newVal && newVal.length > lastProcessedIndex.value) {
    for (let i = lastProcessedIndex.value; i < newVal.length; i++) {
      handleData(newVal[i]);
    }
    lastProcessedIndex.value = newVal.length;
  }
  console.log('prop.messages', currentMeassageViewInfo.value);
}, { deep: true, immediate: true });

watch(() => prop.historyMessages, (newVal) => {
  if (newVal && newVal.length > lastProcessedHistoryIndex.value) {
    for (let i = lastProcessedHistoryIndex.value; i < newVal.length; i++) {
      handleData(newVal[i]);
    }
    lastProcessedHistoryIndex.value = newVal.length;
  }
}, { deep: true, immediate: true });
</script>

<style lang="scss">
  @use "../../styles/index.scss" as *;
  .#{$ckcUiPrefix}-upload-heart {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 14px;
    .#{$ckcUiPrefix}-loading {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }
  }
</style>
