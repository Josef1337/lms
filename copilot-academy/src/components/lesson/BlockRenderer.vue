<script setup lang="ts">
import { defineAsyncComponent, type Component } from 'vue'
import type { Block, InteractiveKey } from '@/types/content'
import BeforeAfter from '@/components/blocks/BeforeAfter.vue'
import CalloutBox from '@/components/blocks/CalloutBox.vue'
import ChatExample from '@/components/blocks/ChatExample.vue'
import ComparisonTable from '@/components/blocks/ComparisonTable.vue'
import ConceptGrid from '@/components/blocks/ConceptGrid.vue'
import DisclosureList from '@/components/blocks/DisclosureList.vue'
import KeyPoint from '@/components/blocks/KeyPoint.vue'
import ListBlock from '@/components/blocks/ListBlock.vue'
import PromptAnatomy from '@/components/blocks/PromptAnatomy.vue'
import RevealSteps from '@/components/blocks/RevealSteps.vue'
import TextBlock from '@/components/blocks/TextBlock.vue'
import ChoiceTask from '@/components/tasks/ChoiceTask.vue'
import ClassifyTask from '@/components/tasks/ClassifyTask.vue'
import DecisionCases from '@/components/tasks/DecisionCases.vue'
import OrderTask from '@/components/tasks/OrderTask.vue'
import QuestionSet from '@/components/tasks/QuestionSet.vue'
import SpotTask from '@/components/tasks/SpotTask.vue'

defineProps<{ block: Block }>()

// Interactive labs load on demand: the Excel lab pulls in the chart library,
// which no other lesson needs.
const lazy = (load: () => Promise<{ default: Component }>) =>
	defineAsyncComponent({ loader: load, delay: 120 })

const INTERACTIVE: Record<InteractiveKey, Component> = {
	reportExplorer: lazy(() => import('@/components/interactive/ReportExplorer.vue')),
	promptBuilder: lazy(() => import('@/components/interactive/PromptBuilder.vue')),
	promptCompare: lazy(() => import('@/components/interactive/PromptCompare.vue')),
	chatSimulator: lazy(() => import('@/components/interactive/ChatSimulator.vue')),
	wordDraft: lazy(() => import('@/components/interactive/WordDraft.vue')),
	wordRewriter: lazy(() => import('@/components/interactive/WordRewriter.vue')),
	outlookLab: lazy(() => import('@/components/interactive/OutlookLab.vue')),
	toneSwitcher: lazy(() => import('@/components/interactive/ToneSwitcher.vue')),
	excelLab: lazy(() => import('@/components/interactive/ExcelLab.vue')),
	pptStudio: lazy(() => import('@/components/interactive/PptStudio.vue')),
	teamsLab: lazy(() => import('@/components/interactive/TeamsLab.vue')),
	scenarioRunner: lazy(() => import('@/components/interactive/ScenarioRunner.vue')),
}
</script>

<template>
	<TextBlock v-if="block.type === 'text'" :block="block" />
	<ConceptGrid v-else-if="block.type === 'concepts'" :block="block" />
	<CalloutBox v-else-if="block.type === 'callout'" :block="block" />
	<KeyPoint v-else-if="block.type === 'keyPoint'" :block="block" />
	<DisclosureList v-else-if="block.type === 'disclosure'" :block="block" />
	<ComparisonTable v-else-if="block.type === 'comparison'" :block="block" />
	<ChatExample v-else-if="block.type === 'chat'" :block="block" />
	<BeforeAfter v-else-if="block.type === 'beforeAfter'" :block="block" />
	<RevealSteps v-else-if="block.type === 'reveal'" :block="block" />
	<ListBlock v-else-if="block.type === 'list'" :block="block" />
	<PromptAnatomy v-else-if="block.type === 'promptAnatomy'" :block="block" />
	<ChoiceTask v-else-if="block.type === 'choice'" :block="block" />
	<ClassifyTask v-else-if="block.type === 'classify'" :block="block" />
	<OrderTask v-else-if="block.type === 'order'" :block="block" />
	<SpotTask v-else-if="block.type === 'spot'" :block="block" />
	<QuestionSet v-else-if="block.type === 'questions'" :block="block" />
	<DecisionCases v-else-if="block.type === 'cases'" :block="block" />
	<component
		:is="INTERACTIVE[block.component]"
		v-else-if="block.type === 'interactive'"
		:task-id="block.taskId"
		v-bind="block.props ?? {}"
	/>
</template>
