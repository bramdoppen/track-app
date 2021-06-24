<template>
	<BasePage title="Kratten">
		<div>
      <Box>
        <h3>Nieuwe kratten</h3>
        <p>Nieuwe kratten aanmaken</p>
        <Button to="/kratten/nieuw" title="Nieuwe kratten"></Button>
      </Box>
      <Box>
        <h3>Alle kratten</h3>
        <p>Overzicht van alle kratten</p>
        <Button to="/kratten/list" title="Alle kratten"></Button>
      </Box>
		</div>
	</BasePage>
</template>

<script>
	import BasePage from "@/layouts/BasePage.vue";
	import Box from "@/components/base/Box.vue";
	import Button from "@/components/base/Button.vue";

	export default {
		components: {
			BasePage,
      Box,
      Button,
		},
	};
</script>
