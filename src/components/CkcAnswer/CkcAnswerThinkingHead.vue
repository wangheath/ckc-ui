<template>
  <div v-if="isShow" :class="['ckc-ui-think-head', 'is-expanded']">
    <img v-if="loading" class="ckc-ui-think-img" src="../../assets/imgs/deepThink.gif" alt="avatar" />
    <DeepThink v-if="isSuccess"></DeepThink>
    <template v-if="loading">
      执行中...
      <!-- 思考中... -->
    </template>
    <template v-if="isSuccess">
      执行完成
      <!-- 已深度思考 -->
    </template>
    <template v-if="isBreak">
      执行终止
      <!-- 已终止 -->
    </template>
    <button class="ckc-ui-think-btn" @click="toggleFold(messageGroupView)">
      <img src="../../assets/imgs/arrow-down.png" alt="avatar" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { MessageType, type MessageViewInfo } from '../types/message';
import DeepThink from '../svg/deepThink.vue';
const { messageGroupView, currentMessageViewInfo } = defineProps<{
    messageGroupView: MessageViewInfo;
    currentMessageViewInfo: MessageViewInfo[];
}>();
const toggleFold = (messageGroupView: MessageViewInfo) => {
  const groupIndex = currentMessageViewInfo.indexOf(messageGroupView);
  if (groupIndex < 0) {
    return;
  }

  const isLastGroup = (groupIndex === currentMessageViewInfo.length - 1) 
                      || (groupIndex === currentMessageViewInfo.length - 2 
                          && currentMessageViewInfo[currentMessageViewInfo.length - 1].messageGroupInfo[0].type === MessageType.DOCUMENTS
                        );
  const nextGroupExpandState = !messageGroupView.isExpanded;
  const thinkingMessage = messageGroupView.messageGroupInfo.find(
      (item) => item.type === MessageType.THINKING
  );

  // 非最后一个历史组：切换组展开状态，并同步 thinking 消息的折叠状态
  if (!isLastGroup) {
    messageGroupView.isExpanded = nextGroupExpandState;
  }

  // 最后一个组：保留组状态，仅切换思考消息的展开状态
  if (thinkingMessage) {
    thinkingMessage.thinkingIsExpanded = isLastGroup
      ? !thinkingMessage.thinkingIsExpanded
      : nextGroupExpandState;
  }
}
const isShow = computed(() => {
  const thinkingMessage = messageGroupView.messageGroupInfo.find(
    (item) => item.type === MessageType.THINKING
  );
  return !!thinkingMessage;
});
const loading = computed(() => messageGroupView.thinkState === 'loading');
const isSuccess = computed(() => messageGroupView.thinkState === 'success');
const isBreak = computed(() => messageGroupView.thinkState === 'break');
</script>

<style lang="scss">
  @use "../../styles/index.scss" as *;

  .#{$ckcUiPrefix}-think-head {
    @include thinkStyle;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    width: auto;

    &.is-expanded {
      display: flex;
      width: 100%;
    }

    .#{$ckcUiPrefix}-think-img {
      width: 16px;
      height: 16px;
      display: inline-block;
      position: static;
      top: auto;
    }

    .#{$ckcUiPrefix}-think-btn {
      background: none;
      border: none;
      cursor: pointer;
      outline: none;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
