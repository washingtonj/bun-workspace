<script lang="ts">
	import { onMount } from 'svelte';

	export let label: string;
	export let placeholder: string;
	export let disabled: boolean = false;
	export let value = '';
	
	let ref: HTMLInputElement;

	$: appearButton = value.length > 4;

	onMount(() => {
		ref.focus();
	});
</script>

<div class="flex flex-col gap-4 rounded-lg items-center justify-center p-8">
	<label class="flex flex-col w-[500px]">
		<span
			placeholder="What the name of your room?"
			class="w-full uppercase border-b text-xl font-bold text-center text-pink-800 border-pink-800 py-4 px-1"
		>
			{label}
		</span>
		<input
			bind:value
			bind:this={ref}
			on:keyup
			autocomplete="off"
			{disabled}
			type="text"
			{placeholder}
			class="w-full uppercase text-xl font-bold text-center text-zinc-300 bg-transparent py-4 px-1 outline-none placeholder:uppercase placeholder:font-bold placeholder:text-pink-500/10"
		/>
	</label>

	{#if appearButton}
		<slot name="button" />
	{/if}
</div>
