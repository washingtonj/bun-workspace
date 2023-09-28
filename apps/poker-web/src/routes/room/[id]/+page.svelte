<script lang="ts">
	import { page } from '$app/stores';
	import { useServices } from '$lib/hooks';
	import { onDestroy, onMount } from 'svelte';

	const { roomService } = useServices();

	let data: {
		room: {
			id: string;
			name: string;
			ownerName: string;
			participants: {
				id: string;
				name: string;
			}[];
		};
		user: {
			id: string;
			name: string;
		};
	};

	let loadingData = true;
	let loadingError = false;

	const socket = roomService.roomSocket($page.params.id);

	async function getData(userName: string | null) {
		try {
			data = await roomService.joinRoom($page.params.id, userName ?? undefined);
		} catch {
			loadingError = true;
		} finally {
			loadingData = false;
		}
	}

	onMount(() => {
		let userName: string | null = null;
		
		const userId = document.cookie
			.split('; ')
			.find((row) => row.startsWith('userId'))
			?.split('=')[1];

		if (userId == null) {
			userName = window.prompt('Enter your name');
		}

		if (userName || userId) {
			getData(userName);
		}

		socket.onmessage = (event) => {
			const response = JSON.parse(event.data);
			data = { ...data, room: response };
		};
	});

	onDestroy(() => {
		socket.close();
	});
</script>

{#if !loadingData && data !== null}
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
{:else if loadingData}
	<main class="flex flex-col items-center mt-48">
		<p class="text-3xl mb-8">🐰</p>
		<p class="text-xl font-bold text-pink-800">Loading...</p>
	</main>
{:else if loadingError}
	<main class="flex flex-col items-center mt-48">
		<p class="text-3xl mb-8">🐰</p>
		<p class="text-xl font-bold text-pink-800">Error</p>
	</main>
{/if}
