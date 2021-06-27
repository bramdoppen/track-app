<template>
	<BasePage title="Kratten">
		<BoxesList>
      <Box>
        <h3>Nieuwe kratten</h3>
        <p>Nieuwe kratten aanmaken</p>
        <Button to="/kratten/nieuw" type="green" title="Nieuwe kratten"></Button>
      </Box>
      <Box>
        <h3>Alle kratten</h3>
        <p>Overzicht van alle kratten</p>
        <Button to="/kratten/list" type="green" title="Alle kratten"></Button>
      </Box>
    </BoxesList>
	</BasePage>
</template>

<script>
	import BasePage from "@/layouts/BasePage.vue";
	import Box from "@/components/base/Box.vue";
	import BoxesList from "@/components/base/BoxesList.vue";
	import Button from "@/components/base/Button.vue";

	export default {
		components: {
			BasePage,
      Box,
      BoxesList,
      Button,
		},
	};
</script>
