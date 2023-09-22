<script lang="ts">
	import { GiantInput, IconButton, LoadingPuff } from '$lib/components';
	import { onMount } from 'svelte';

	let userName = '';
	let roomName = '';
	let submitting = false;
	
	let currentStep: 'name' | 'room' = 'name';

	const nextStep = () => {
		currentStep = 'room';
	};

	const submit = () => {
		submitting = true;
		console.log('submit');
	};
</script>

<main class="flex flex-col justify-between items-center mt-48">
	<span class="flex flex-col items-center gap-4 mb-4">
		<h1 class="text-4xl">🐰</h1>
	</span>

	<div>
		{#if currentStep === 'name'}
			<GiantInput
				bind:value={userName}
				on:keyup={e => e.key === 'Enter' && nextStep()}
				label="A great name for a great person"
				placeholder="e.g Maria do Bairro"
			>
				<IconButton on:click={nextStep} slot="button">-></IconButton>
			</GiantInput>
		{:else if currentStep === 'room'}
			<GiantInput
				bind:value={roomName}
				on:keyup={e => e.key === 'Enter' && submit()}
				placeholder="What the name of your room?"
				label="Insert your room name"
				disabled={submitting}
			>
				<IconButton on:click={submit} slot="button">
					{#if submitting}
						<LoadingPuff width={22} height={22} />
					{:else}
						->
					{/if}
				</IconButton>
			</GiantInput>
		{/if}
	</div>
</main>
