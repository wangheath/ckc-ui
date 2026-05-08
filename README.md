# CKC UI

A Vue 3 + TypeScript UI component library for AI chat answer display with flexible markdown rendering support.

## Features

- 💬 Display AI assistant responses with message grouping
- 🎨 Support for thinking, tool use, and recommendations
- 🔄 Automatic message merging and grouping
- 📝 Flexible markdown rendering (built-in or custom)
- 🎯 Type-safe with full TypeScript support

## Installation

```bash
pnpm install ckc-ui
```

## Usage

### Basic Usage (with default markstream-vue)

```vue
<script setup>
import { ref } from 'vue'
import { CkcAnswer } from 'ckc-ui'
import 'ckc-ui/dist/style.css'
import type { Message } from 'ckc-ui/dist/types'

const messages = ref<Message[]>([])

// Simulate receiving messages
const simulateMessages = () => {
  messages.value.push({
    type: 'answer',
    content: '# Hello World\n\nThis is a markdown response',
    traceId: '123',
    sessionId: 'session-1'
  })
}
</script>

<template>
  <div class="chat-container">
    <CkcAnswer :messages="messages" />
    <button @click="simulateMessages">Send Message</button>
  </div>
</template>

<style scoped>
.chat-container {
  max-width: 800px;
  margin: 0 auto;
}
</style>
```

### Custom Markdown Component

If you want to use a different markdown rendering library instead of markstream-vue, you can pass a custom component:

```vue
<script setup>
import { ref } from 'vue'
import { CkcAnswer } from 'ckc-ui'
import 'ckc-ui/dist/style.css'
import MyMarkdownRenderer from './MyMarkdownRenderer.vue'
import type { Message } from 'ckc-ui/dist/types'

const messages = ref<Message[]>([])
</script>

<template>
  <CkcAnswer 
    :messages="messages" 
    :markdownComponent="MyMarkdownRenderer"
  />
</template>
```

**Custom Markdown Component Example:**

```vue
<!-- MyMarkdownRenderer.vue -->
<template>
  <div class="custom-markdown">
    <!-- Your markdown rendering logic -->
    <div v-html="renderedContent"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import markdownIt from 'markdown-it'

const props = defineProps<{
  content: string
  customHtmlTags?: string[]
  customId?: string
  loading?: boolean
}>()

const md = markdownIt()

const renderedContent = computed(() => {
  return md.render(props.content)
})
</script>

<style scoped>
.custom-markdown {
  /* Your custom styles */
}
</style>
```

### With History Messages

```vue
<script setup>
import { ref } from 'vue'
import { CkcAnswer } from 'ckc-ui'
import 'ckc-ui/dist/style.css'
import type { Message } from 'ckc-ui/dist/types'

const messages = ref<Message[]>([])
const historyMessages = ref<Message[]>([
  {
    type: 'answer',
    content: 'Previous response from history',
    traceId: '100',
    sessionId: 'session-1'
  }
])
</script>

<template>
  <CkcAnswer 
    :messages="messages"
    :historyMessages="historyMessages"
  />
</template>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `messages` | `Message[]` | Current messages to display |
| `historyMessages` | `Message[]` | Previous/history messages |
| `customHtmlTags` | `string[]` | Custom HTML tags for rendering |
| `renderCustomId` | `string` | Custom ID for rendering |
| `markdownComponent` | `Component` | Custom markdown renderer component (optional) |

## Message Type

```typescript
interface Message {
  type: 'thinking' | 'tool_use' | 'tool_use_silent' | 'answer' | 'documents' | 'recommendations' | 'end'
  content: string | string[]
  traceId?: string
  sessionId?: string
  endFlag?: boolean
}
```

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `clickRecomendation` | `string` | Emitted when a recommendation is clicked |

## Slots

| Slot | Scope | Description |
|------|-------|-------------|
| `actions` | `{ messageViewInfo }` | Custom action buttons area |

## Dependencies

### Required
- `vue`: ^3.5.0

### Optional (Choose one for markdown rendering)
- `markstream-vue`: ^0.0.13-beta.4 (default)
- Or your custom markdown component

## License

MIT

