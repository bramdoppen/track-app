<template>
  <BasePage title="Instellingen">
		<BoxesList>
      <Box>
        <h3>Leveringen</h3>
        <p>Beheer verwachtte bloemleveringen per uur</p>
        <Button to="/flowers/list" look="green" title="Bloemleveringen"></Button>
      </Box>
      <Box>
        <h3>Wagenonderdelen</h3>
        <p>Beheer verschillende wagenonderdelen</p>
        <Button to="/flowers/list" look="green" title="Wagenonderdelen"></Button>
      </Box>
      <Box>
        <h3>Dahlias</h3>
        <p>Dahliasoorten beheren</p>
        <Button to="/flowers/list" look="green" title="Dahliasoorten"></Button>
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