<script>
	const players = [
		{
			name: 'John Doe',
			ready: false
		},
		{
			name: 'Jane Doe',
			ready: true
		},
		{
			name: 'John Smith',
			ready: false
		},
		{
			name: 'Jane Smith',
			ready: true
		}
	];
</script>

<main class="flex flex-col items-center mt-48">
	<div class="flex flex-col items-center w-fit mb-12">
    <p class="cursor-default text-3xl mb-8">🐰</p>
		<span class="flex items-center">
			<h1 class="text-xl font-bold text-pink-800 text-start">Identity Admin</h1>
			<p class="text-xl font-bold text-pink-500/10 ml-2">by</p>
			<h1 class="text-xl font-bold text-white/10 ml-2">Washington Junior</h1>
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
		{#each players as player}
			<p
				class={`font-bold text-lg capitalize ${
					player.ready ? 'text-pink-800' : 'text-pink-500/10'
				}`}
			>
				{player.name}
			</p>
		{/each}
	</div>
</main>
