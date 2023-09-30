<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { useServices } from '$lib/hooks';
	import type { PageData } from './$types';

	export let data: PageData;

	const { roomService } = useServices();

	const socket = roomService.roomSocket(data.room.id);

	onMount(() => {
		socket.onmessage = (event) => {
			const response = JSON.parse(event.data);
			data = { ...data, room: response };
		};
	});

	onDestroy(() => {
		socket.close();
	});
</script>

{#if data !== null}
	<main class="flex flex-col items-center mt-48">
		<div class="flex flex-col items-center w-fit mb-12">
			<p class="cursor-default text-3xl mb-8">🐰</p>
			<span class="flex items-center">
				<h1 class="text-xl capitalize font-bold text-pink-800 text-start">{data.room.name}</h1>
				<p class="text-xl font-bold text-pink-500/10 ml-2">by</p>
				<h1 class="text-xl capitalize font-bold text-white/10 ml-2">{data.room.ownerName}</h1>
			</span>
		</div>

		<div class="flex gap-6">
			{#each [1, 2, 3, 5, 8, '☕️'] as item}
				<div class="cursor-pointer p-3 w-24 h-32 border border-pink-800 rounded-lg">
					<div class="flex items-center justify-center bg-pink-500/10 h-full p-8 rounded-lg">
						<p class="font-medium">{item}</p>
					</div>
				</div>
			{/each}
		</div>

		<div class="flex gap-4 mt-14">
			{#each data.room.participants as participant}
				<p class={`font-bold text-lg capitalize ${false ? 'text-pink-800' : 'text-pink-500/10'}`}>
					{participant.name}
				</p>
			{/each}
		</div>
	</main>
{/if}
