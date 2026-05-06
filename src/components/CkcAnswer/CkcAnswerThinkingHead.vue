<template>
  <div v-if="isShow" class="ckc-ui-think-head">
    <img class="ckc-ui-think-img" src="../../assets/imgs/deepThink.gif" alt="avatar" />
    <template v-if="messageGroupView.thinkState === 'loading'">
      执行中...
      <!-- 思考中... -->
    </template>
    <template v-if="messageGroupView.thinkState === 'success'">
      执行完成
      <!-- 已深度思考 -->
    </template>
    <template v-if="messageGroupView.thinkState === 'break'">
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
</script>

<style lang="scss">
  @use "../../styles/index.scss" as *;

  .#{$ckcUiPrefix}-think-head {
    @include thinkStyle;
    .#{$ckcUiPrefix}-think-img {
      width: 12px;
      height: 12px;
    }
    .#{$ckcUiPrefix}-think-btn {
      background: none;
      border: none;
      cursor: pointer;
      outline: none;
    }
  }
</style>
